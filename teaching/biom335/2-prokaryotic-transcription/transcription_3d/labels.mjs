// Screen-space annotations: leader labels, leaderless tags and measurement brackets.
// Each frame the app queues what should be named; end() projects with the current camera, places
// labels greedily in free screen space (clear of the page chrome and of each other) and updates a
// fixed pool of DOM nodes, so nothing is rebuilt per frame.
import {Vector3} from 'three';
import {setRich} from '../shared/text.mjs';

// Tags are pills centred on their anchor dot: DOT is the dot's offset from the pill's edge, TAG_H its height.
const NS='http://www.w3.org/2000/svg',MAX_LABELS=5,MAX_TAGS=10,MAX_BRACKETS=3,MARGIN=8,DOT=10,TAG_H=20;
const svgEl=(name,attrs={})=>{const el=document.createElementNS(NS,name);for(const[k,v]of Object.entries(attrs))el.setAttribute(k,v);return el};
const overlaps=(a,b,m=MARGIN)=>a.x<b.x+b.w+m&&a.x+a.w+m>b.x&&a.y<b.y+b.h+m&&a.y+a.h+m>b.y;
// Box positions relative to the anchor, tried in order; the side facing away from screen centre first.
const OFFSETS=[[64,-96],[84,-40],[64,34],[128,-150],[36,-150],[150,-70],[40,70]];

export function createLabels(root,svg,announcer){
  const labels=Array.from({length:MAX_LABELS},()=>{
    const el=document.createElement('div');el.className='annotation';el.innerHTML='<i class="dot"></i><b></b><small></small>';root.append(el);
    const halo=svgEl('path',{class:'leader-halo'}),line=svgEl('path',{class:'leader-line'}),ring=svgEl('circle',{class:'leader-ring',r:3.5});svg.append(halo,line,ring);
    return {el,dot:el.children[0],title:el.children[1],sub:el.children[2],halo,line,ring,key:null,x:0,y:0,w:0,h:0,shown:false,text:'',sizeText:''};
  });
  const tags=Array.from({length:MAX_TAGS},()=>{const el=document.createElement('span');el.className='tag';root.append(el);return {el,text:'',color:'',shown:false,flip:false,box:null}});
  // Tag widths are measured in a spare node, so a rejected candidate never overwrites a slot's visible text.
  const ruler=document.createElement('span');ruler.className='tag';ruler.setAttribute('aria-hidden','true');ruler.style.cssText='visibility:hidden;transform:translate3d(-9999px,0,0)';root.append(ruler);
  const brackets=Array.from({length:MAX_BRACKETS},()=>{
    const g=svgEl('g',{class:'bracket'}),halo=svgEl('path',{class:'bracket-halo'}),line=svgEl('path',{class:'bracket-line'}),text=svgEl('text');g.append(halo,line,text);svg.append(g);
    return {g,halo,line,text,label:'',shown:false};
  });
  const queue=[],tagQueue=[],bracketQueue=[],sizes=new Map(),tagWidths=new Map(),v=new Vector3(),w=new Vector3();
  let blocked=[],announced='';
  const project=(p,camera,W,H)=>{v.copy(p).project(camera);return v.z<1&&v.z>-1?{x:(v.x+1)*W/2,y:(1-v.y)*H/2}:null};
  const inBlocked=(x,y)=>blocked.some(r=>x>=r.x&&x<=r.x+r.w&&y>=r.y&&y<=r.y+r.h);
  const show=(el,on)=>{el.classList.toggle('show',on)};
  return {
    // Rectangles of visible page chrome (header controls, chapter list, narration, cards…).
    layout(rects){blocked=rects},
    // Text sizes change with the layout (breakpoints, presenter mode), so cached measurements are dropped.
    resetSizes(){sizes.clear();tagWidths.clear();labels.forEach(L=>L.sizeText='')},
    // Placed boxes, for automated overlap checks.
    snapshot(){const rect=el=>{const r=el.getBoundingClientRect();return {x:r.left,y:r.top,w:r.width,h:r.height}};return {labels:labels.filter(L=>L.shown).map(L=>({text:L.title.textContent,...rect(L.el)})),tags:tags.filter(T=>T.shown).map(T=>({text:T.text,...rect(T.el)})),brackets:brackets.filter(B=>B.shown&&B.box).map(B=>({text:B.label,...B.box})),blocked}},
    // What is on screen now, for reading-time checks (keys match what the app queued).
    shown(){const out=[];for(const L of labels)if(L.shown)out.push({key:'L:'+L.key,title:L.title.textContent,text:L.title.textContent+' '+L.sub.textContent});
      for(const T of tags)if(T.shown)out.push({key:'T:'+T.text,title:T.text,text:T.text});for(const B of brackets)if(B.shown)out.push({key:'B:'+B.label,title:B.label,text:B.label});return out},
    begin(){queue.length=0;tagQueue.length=0;bracketQueue.length=0},
    label(anchor,title,sub,o={}){queue.push({anchor,title,sub,key:o.key||title,color:o.color||'#d8e4e4',priority:o.priority??1,inside:!!o.inside,order:queue.length})},
    tag(anchor,text,o={}){tagQueue.push({anchor,text,color:o.color||'#d8e4e4'})},
    bracket(a,b,text){bracketQueue.push({a,b,text})},
    end(camera,W,H,dt,speed,enabled=true){
      // Phones show at most two labels, titles only (CSS hides the second line).
      let moving=false;const limit=W<=600?2:MAX_LABELS,placed=[],dots=[],used=new Set(),wanted=enabled?queue.filter(q=>{const s=project(q.anchor,camera,W,H);if(!s||s.x<MARGIN||s.y<MARGIN||s.x>W-MARGIN||s.y>H-MARGIN||inBlocked(s.x,s.y))return false;q.s=s;return true}):[];
      wanted.sort((a,b)=>b.priority-a.priority||a.order-b.order);
      wanted.forEach(q=>dots.push({x:q.s.x-6,y:q.s.y-6,w:12,h:12}));
      // Keep a label in the DOM node it used last frame, so it glides instead of jumping.
      const slotFor=new Map();wanted.forEach(q=>{const i=labels.findIndex((l,k)=>l.key===q.key&&l.shown&&!used.has(k));if(i>=0){slotFor.set(q,i);used.add(i)}});
      wanted.forEach(q=>{if(!slotFor.has(q)){const i=labels.findIndex((l,k)=>!used.has(k));if(i>=0){slotFor.set(q,i);used.add(i)}}});
      const damping=1-Math.exp(-dt/(.12/Math.min(Math.max(speed,1),2)));
      const active=new Set();
      let count=0;
      for(const q of wanted){
        if(count>=limit)break;const i=slotFor.get(q);if(i===undefined)continue;const L=labels[i],text=q.title+'\u0000'+q.sub+(q.inside?'\u0000in':'');
        if(L.text!==text){setRich(L.title,q.title);setRich(L.sub,q.sub);L.text=text}
        L.el.classList.toggle('inside',q.inside);
        if(L.sizeText!==text){const c=sizes.get(text);if(c){L.w=c[0];L.h=c[1]}else{L.el.style.transform='translate3d(-9999px,0,0)';L.w=L.el.offsetWidth;L.h=L.el.offsetHeight;sizes.set(text,[L.w,L.h])}L.sizeText=text}
        const outward=q.s.x>W*.55?1:-1;let box=null;
        for(const side of [outward,-outward]){for(const[ox,oy]of OFFSETS){const b={x:side>0?q.s.x+ox:q.s.x-ox-L.w,y:q.s.y+oy-L.h/2,w:L.w,h:L.h};
          if(b.x<12||b.y<12||b.x+b.w>W-12||b.y+b.h>H-12)continue;if(blocked.some(r=>overlaps(b,r)))continue;if(placed.some(r=>overlaps(b,r)))continue;if(dots.some(d=>overlaps(b,d,4)))continue;box=b;break}if(box)break}
        if(!box)continue;
        const fresh=L.key!==q.key||!L.shown;L.key=q.key;
        if(fresh){L.x=box.x;L.y=box.y}else{L.x+=(box.x-L.x)*damping;L.y+=(box.y-L.y)*damping}if(Math.abs(box.x-L.x)+Math.abs(box.y-L.y)>.5)moving=true;
        placed.push({x:L.x,y:L.y,w:L.w,h:L.h});active.add(i);count++;
        L.el.style.transform=`translate3d(${L.x.toFixed(1)}px,${L.y.toFixed(1)}px,0)`;L.dot.style.background=q.color;L.el.classList.toggle('inside',q.inside);show(L.el,true);L.shown=true;
        const edge=q.s.x<L.x+L.w/2?L.x-4:L.x+L.w+4,ey=L.y+L.h/2,d=`M${q.s.x.toFixed(1)} ${q.s.y.toFixed(1)}L${((q.s.x+edge)/2).toFixed(1)} ${ey.toFixed(1)}H${edge.toFixed(1)}`;
        L.halo.setAttribute('d',d);L.line.setAttribute('d',d);L.ring.setAttribute('cx',q.s.x.toFixed(1));L.ring.setAttribute('cy',q.s.y.toFixed(1));
        for(const e of [L.halo,L.line,L.ring]){e.classList.add('show');e.classList.toggle('dashed',q.inside)}
      }
      labels.forEach((L,i)=>{if(!active.has(i)){show(L.el,false);L.shown=false;L.key=null;for(const e of [L.halo,L.line,L.ring])e.classList.remove('show')}});
      // Leaderless tags: short names that sit beside their subject.
      let k=0;
      if(enabled)for(const q of tagQueue){if(k>=MAX_TAGS)break;const s=project(q.anchor,camera,W,H);if(!s||s.x<MARGIN||s.y<MARGIN||s.x>W-MARGIN||s.y>H-MARGIN||inBlocked(s.x,s.y))continue;
        const T=tags[k];let w=tagWidths.get(q.text);if(w===undefined){ruler.textContent=q.text;w=ruler.offsetWidth||q.text.length*6.2+12;tagWidths.set(q.text,w)}
        // Near the right edge the tag flips to the left of its subject, dot on the right.
        const flip=s.x-DOT+w>W-MARGIN,box={x:flip?s.x+DOT-w:s.x-DOT,y:s.y-TAG_H/2,w,h:TAG_H};
        if(box.x<MARGIN||placed.some(r=>overlaps(box,r,6))||blocked.some(r=>overlaps(box,r,4)))continue;
        k++;placed.push(box);T.box=box;if(T.text!==q.text){setRich(T.el,q.text);T.text=q.text}if(T.flip!==flip){T.el.classList.toggle('flip',flip);T.flip=flip}if(T.color!==q.color){T.el.style.setProperty('--c',q.color);T.color=q.color}
        T.el.style.transform=`translate3d(${box.x.toFixed(1)}px,${box.y.toFixed(1)}px,0)`;show(T.el,true);T.shown=true}
      for(;k<MAX_TAGS;k++)if(tags[k].shown){show(tags[k].el,false);tags[k].shown=false}
      // Brackets measure a stretch of molecule; both ends must be on screen.
      k=0;
      if(enabled)for(const q of bracketQueue){if(k>=MAX_BRACKETS)break;
        const lift=p=>w.copy(camera.position).sub(p).setLength(16).add(p),a=project(lift(q.a),camera,W,H),b=project(lift(q.b),camera,W,H);if(!a||!b)continue;
        if([a,b].some(s=>s.x<MARGIN||s.y<MARGIN||s.x>W-MARGIN||s.y>H-MARGIN))continue;
        const dx=b.x-a.x,dy=b.y-a.y,len=Math.hypot(dx,dy)||1,nx=-dy/len*7,ny=dx/len*7,d=`M${(a.x+nx).toFixed(1)} ${(a.y+ny).toFixed(1)}L${a.x.toFixed(1)} ${a.y.toFixed(1)}L${b.x.toFixed(1)} ${b.y.toFixed(1)}L${(b.x+nx).toFixed(1)} ${(b.y+ny).toFixed(1)}`;
        // The caption tries both sides of the bracket and is dropped (with its bracket) if it would cover a
        // label, tag or page chrome; it is clamped on screen even when the bracket runs close to an edge.
        const half=q.text.length*3.8+9;let tx=0,ty=0,cap=null;for(const s of [1,-1]){const x=Math.min(W-half,Math.max(half,(a.x+b.x)/2-s*nx*2.2)),y=Math.min(H-8,Math.max(14,(a.y+b.y)/2-s*ny*2.2)),box={x:x-half,y:y-12,w:2*half,h:16};if(!placed.some(r=>overlaps(box,r,4))&&!blocked.some(r=>overlaps(box,r,4))&&!dots.some(r=>overlaps(box,r,2))){tx=x;ty=y;cap=box;break}}
        if(!cap)continue;placed.push(cap);
        const B=brackets[k++];B.box=cap;B.halo.setAttribute('d',d);B.line.setAttribute('d',d);if(B.label!==q.text){setRich(B.text,q.text);B.label=q.text}
        B.text.setAttribute('x',tx.toFixed(1));B.text.setAttribute('y',ty.toFixed(1));B.text.setAttribute('text-anchor','middle');show(B.g,true);B.shown=true}
      for(;k<MAX_BRACKETS;k++)if(brackets[k].shown){show(brackets[k].g,false);brackets[k].shown=false}
      const said=labels.filter(L=>L.shown).map(L=>L.title.textContent).join('; ');
      // A description of the view (not a live region): read on request and by the 3D view's description.
      if(announcer&&said!==announced){announced=said;announcer.textContent=said?`On screen: ${said}.`:'No labels on screen.'}
      return moving;
    }
  };
}
