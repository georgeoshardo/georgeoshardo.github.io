import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {mergeGeometries} from 'three/addons/utils/BufferGeometryUtils.js';
import {createLabels} from '../shared/labels.mjs';
import {setRich,enrichTree} from '../shared/text.mjs';
// Shared with every course page: materials and fades, the rendering pipeline, strands and bonds, camera moves and reading pauses.
import {PROTEIN_TONE,baseMaterial,proteinMaterial,surfaceGeometry,fade,createRenderer,studio,restoreEnvironment} from '../shared/molecules.mjs';
import {createPipeline,TIERS,pixelRatioFor} from '../shared/render.mjs';
import {STRANDS,createTube,createRungs,bondGeometry,between,halfRung,point,finish,minRadius,outlineWidth} from '../shared/strands.mjs';
import {blendPose as blendCamera,screenAnchor,applyLens as setLens} from '../shared/camera.mjs';
import {createReading,keyOf,wordCount} from '../shared/reading.mjs';
import {quintic,wrap} from '../shared/ease.mjs';
import {prefs} from '../shared/prefs.mjs';
import {INFO,CHAIN_KEY} from './inspect.mjs';
import {GLOSSARY,glossarySlug} from './glossary.mjs';
import {codingSeq,rnaSeq,template as templateBase,coding,rnaBase,position,RUT_START,STOP_CODON,START_CODON,RBS} from './sequence.mjs';
import {cycleState,chaptersFor,commonChapters,endTime,factorPresence,cutawayAt,ABORTIVE,TERMINATOR,PAUSE_STEM,stemRange,ERROR,CHOICE_TIME,RISE,TRANSCRIPT,ELONGATION,ADDITION,BACKTRACK,HAIRPIN_PAUSE,clamp,smooth,ramp,mix,ACTS,actStart,beatsFor,beatAt,copyAt,copyText,slug,inChemistry,checkpointsFor,CHOICE_QUESTION,RECAP,stageMap,ribosomeAt,RIBOSOME,RHO_LOAD,searchAt,SEARCH,BEND,TERMINATOR_ZONE} from './cycle_state.mjs';

const $=id=>document.getElementById(id),V=(...a)=>new THREE.Vector3(...a);
// Template DNA is sky blue; the coding (non-template) strand is ivory and thinner, a cue that does not rely on colour.
const DNA=STRANDS.template,NT=STRANDS.coding,RNA=STRANDS.rna,PHOSPHATE=0xf2c46d,NUSA=0xafcf5c;
// Positions along the nucleic acids are in base pairs (b) from the RNA 3′ end (the i site), in the
// RNAP frame. The bubble is single stranded between BUBBLE_UP and BUBBLE_DN; the resolved hybrid
// and i+1 site (b = HYBRID_UP…1) follow the 8E6X coordinates exactly.
const BP_TURN=10.5,OMEGA=Math.PI*2/BP_TURN,BUBBLE_UP=-11,BUBBLE_DN=4,HYBRID_UP=-8,EXIT=-26,RNA_RELEASE=V(-22,-88,22);
const scene=new THREE.Scene(),world=new THREE.Group(),core=new THREE.Group(),sigma=new THREE.Group(),rho=new THREE.Group(),nusA=new THREE.Group(),nusG=new THREE.Group();
const dnaGroup=new THREE.Group(),rnaGroup=new THREE.Group(),hairpinGroup=new THREE.Group(),promoterGroup=new THREE.Group(),siteGroup=new THREE.Group(),fragmentGroup=new THREE.Group();
world.add(core,sigma,rho,nusA,nusG,dnaGroup,rnaGroup,hairpinGroup,promoterGroup,siteGroup,fragmentGroup);scene.add(world);
let renderer,composer,camera,controls,metadata,accessories,ao;
// calm: reduced motion (the system setting, or the viewer's choice under More).
const rmq=matchMedia('(prefers-reduced-motion: reduce)');let calm=false;
let time=0,path=null,playing=false,exploring=false,manualCut=null,manualCutChapter=-1,cutAmount=0,labels=true,speed=1,last=0,sceneDirty=true,viewDirty=true,snapLabels=true,looping=false,ready=false,lastChapter=-1;
// The loop sleeps when nothing changes. Scene changes (time, state, toggles) rebuild the molecules;
// view changes (orbiting, resizing, layout) only re-project labels, clip planes and the image.
function requestFrame(){if(!looping&&ready){clearTimeout(refineTimer);looping=true;last=performance.now();requestAnimationFrame(frame)}}
function invalidate(){sceneDirty=true;requestFrame()}
function invalidateView(){viewDirty=true;requestFrame()}
let state=cycleState(0),chapterList=chaptersFor('rho'),coreMeshes=[],rhoMeshes=[],sigmaMesh,nusAMesh,nusGMesh,nusGKow,kowPivot,kowRest=new THREE.Vector3(),ribosome,ribSmall,ribLarge,peptide,ribAnchor=new THREE.Vector3();
let D=V(1,0,0),DNA0=V(0,-18,-45),nativeRNA=[],tById,ntById,rnaById;
const ref=V(0,1,0),corePos=V(),rhoPos=V(),rhoNative=V(),sigmaPool=V(-300,-112,25),SIGMA_ARC=140,sigmaRelease=V(-40,135,-57),nusAApproach=V(),nusGApproach=V();
const atomGeometry=new THREE.SphereGeometry(1,12,8),dummy=new THREE.Object3D(),up=V(0,1,0);
const clipPlane=new THREE.Plane(),rhoPlane=new THREE.Plane(),CLIP=[clipPlane],NONE=[],CLIP_OFFSET=new THREE.Vector3(-8,-6,-8);
const axis={lo:-300,hi:100,step:.125,p:[],t:[],count:0,last:0},axisInit={lo:-300,hi:100,step:.125,p:[],t:[],count:0,last:0},bendStages={},CLOSED={fork:-9,straight:10,join:75,span:.85,aim:.1,lift:34},phase={up:0,shift:0,nt:Math.PI,radius:9.3,residual:0};
const rnaExit=V(),exitDir=V(),inwardSite=V(),linkers=[0,1].map(()=>[0,1].map(()=>({b0:0,b1:0,p0:V(),m0:V(),p1:V(),m1:V()})));
let tTrack,ntTrack,rnaTrack,materialMin=0,materialMax=0,dnaTubes,rungs,templateStubs,rnaTube,rnaStubs,rutTube,stemTube,hairpinBonds,utract,promoterLabels=[];
let rutGlow,promoterGlow,bubbleGlow,terminatorGlow,strandOutlines=[],rnaOutline,searchStrands=[];
let fragmentTube,fragmentStubs,ntp,ppi,ntpParts,mg,flash,ntpBeta=V(),rhoQuaternion=new THREE.Quaternion();
const BASE_COLOR=new THREE.Color(0xf8b784),ERROR_RED=0xff4d6d,ERROR_COLOR=new THREE.Color(ERROR_RED);
// Base identity (Sequence mode): a palette separable under colour-vision deficiency; letters always accompany it.
const BASE_HEX={A:'#2fbf8f',T:'#e8743b',U:'#e8743b',G:'#f0e442',C:'#3d7fd6'},BASE_COL=Object.fromEntries(Object.entries(BASE_HEX).map(([k,v])=>[k,new THREE.Color(v)]));
const RUNG_PLAIN=[new THREE.Color(STRANDS.rung.template),new THREE.Color(STRANDS.rung.coding)],_bc=new THREE.Color();
// Extra detail beyond the lecture notes, each off by default: σ regions, active-site parts, subunit names with
// the channel paths, and further mechanism (scrunching, NusG's two domains).
const DETAILS=[['sigma','σ regions','Which parts of σ read −35 and −10'],['site','Active-site parts','Mg²⁺, bridge helix, trigger loop'],['parts','Subunits and channels','β, β′, ω and α₂ names; the channel paths'],['extra','More mechanism','DNA scrunching; NusG’s two domains']];
let details=new Set();const detail=k=>details.has(k);
// Coupled translation (the schematic ribosome) is optional and off by default: it competes for attention.
let coupling=false;const couplingAt=t=>coupling?ribosomeAt(t):null;
let seqOn=false,seqW=0,rungSeqShown=-1,rungSeqRoute='',rnaSeqShown=-1,rnaSeqRoute='',letters=[];
// Sequence colours switch on by themselves where the letters matter: the promoter, the error and the terminator stem.
function sequenceWeight(t,route){return Math.max(seqOn?1:0,ramp(t,34,35)*(1-ramp(t,43,44)),ramp(t,116.6,117.6)*(1-ramp(t,127.4,128.4)),route==='intrinsic'?ramp(t,142,143)*(1-ramp(t,152.5,153.5)):0)}
let errorBead,errorShown=-1,ntpWrong=false,rnaSample=(x,out)=>rnaPoint(x,state,out);
const rhoAxis=V(),tlPoints=[],_clipView=V(),_clipAt=V(),_rhoT=V(),_rhoTarget=V();let tlCurve;
let pipeline,tier='balanced',autoTier=null,qualityChoice='auto',aoAllowed=true,bloom,fxaa,surfaceMeshes=[],refineTimer=0,toastTimer=0,lostTimer=0,lostWasPlaying=false;
// Settings persist across the course's pages (../shared/prefs.mjs).
const saved=prefs;
function toast(text,ms=3200){const el=$('toast');el.textContent=text;el.hidden=false;clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.hidden=true,ms);announce(text,0)}
let pxPerA=1,promoter,initStretch=[],legendItem={},traces={},bridgeHelix,triggerLoop,ntpPool,tlOpen=V(),tlClosed=V(),tlTip=V();
const dnaSamples=[[],[]];
let notes,landmarks={},chainMesh={},bubbleOpen=0,turnAngle=90,showParts=false,polarity,polarityFade=1,cardInitiation=null,tallyHTML='';
const JOIN=-240,RNA_STUBS=470,TEMPLATE_STUBS=16,SITE_VIEW=V(-.18,.95,-.22).normalize(),FACTOR_TARGET=V(-25,-62,-10),FACTOR_VIEW=V(.2,-.3,-.93).normalize(),TERMINATOR_TARGET=V(-18,-37,-15),TERMINATOR_VIEW=V(.05,.3,-.95).normalize(),PAUSE_TARGET=V(-38,-42,-5),PAUSE_VIEW=V(.15,.3,-.94).normalize();

// Protein surfaces (../shared/molecules.mjs): tone, fresnel rim and, where the cutaway slices one, a cross-section cap.
function surface(record,buffer,color){const mesh=new THREE.Mesh(surfaceGeometry(record,buffer),proteinMaterial(color));mesh.userData=record;return mesh}
// Temporary highlights: an additive sleeve, brightest at its silhouette, so the molecule inside stays visible.
// The promoter's sleeves ignore depth: the −10 element lies under σ, and its glow marks where.
function glowMaterial(color,options={}){return new THREE.ShaderMaterial({userData:{noAO:true},uniforms:{uColor:{value:new THREE.Color(color).multiplyScalar(1.7)},uAmount:{value:0}},transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,...options,
 vertexShader:'varying vec3 vN,vV;void main(){vec4 mv=modelViewMatrix*vec4(position,1.);vN=normalMatrix*normal;vV=-mv.xyz;gl_Position=projectionMatrix*mv;}',
 fragmentShader:'uniform vec3 uColor;uniform float uAmount;varying vec3 vN,vV;void main(){float f=clamp(1.-abs(dot(normalize(vN),normalize(vV))),0.,1.);gl_FragColor=vec4(uColor*uAmount*(.05+1.15*f*f*f),1.);}'})}
// The pulse envelope of a highlight: in, a gentle beat (steady with reduced motion), out.
const pulse=(t,a,b,c,d)=>ramp(t,a,b)*(1-ramp(t,c,d))*(calm?.85:.72+.28*Math.cos((t-b)*Math.PI*2/1.7));
function hermiteInto(out,p0,m0,p1,m1,u){const u2=u*u,u3=u2*u;return out.copy(p0).multiplyScalar(2*u3-3*u2+1).addScaledVector(m0,u3-2*u2+u).addScaledVector(p1,-2*u3+3*u2).addScaledVector(m1,u3-u2)}
const circularMean=a=>Math.atan2(a.reduce((s,x)=>s+Math.sin(x),0),a.reduce((s,x)=>s+Math.cos(x),0));
function fitLine(points){
 const c=points.reduce((s,p)=>s.add(p),V()).multiplyScalar(1/points.length),m=new Array(9).fill(0);
 for(const p of points){const x=p.x-c.x,y=p.y-c.y,z=p.z-c.z;m[0]+=x*x;m[1]+=x*y;m[2]+=x*z;m[4]+=y*y;m[5]+=y*z;m[8]+=z*z}m[3]=m[1];m[6]=m[2];m[7]=m[5];
 const d=V(1,.7,.4).normalize();for(let i=0;i<80;i++)d.set(m[0]*d.x+m[1]*d.y+m[2]*d.z,m[3]*d.x+m[4]*d.y+m[5]*d.z,m[6]*d.x+m[7]*d.y+m[8]*d.z).normalize();return {c,d};
}

// DNA axis: the world line far from RNAP, the fitted 8E6X duplex axes near it, smoothly joined.
function buildAxis(){
 const T=id=>V(...tById.get(id).p),N=id=>V(...ntById.get(id).p),range=(a,b)=>Array.from({length:b-a+1},(_,i)=>a+i);
 const upstream=fitLine([...range(24,38).map(T),...range(86,100).map(N)]),downstream=fitLine([...range(2,13).map(T),...range(111,122).map(N)]);
 if(upstream.d.dot(T(24).sub(T(38)))<0)upstream.d.negate();if(downstream.d.dot(T(2).sub(T(13)))<0)downstream.d.negate();
 const onto=(line,p)=>p.clone().sub(line.c).dot(line.d),tU=(onto(upstream,T(24))+onto(upstream,N(100)))/2,tD=(onto(downstream,T(13))+onto(downstream,N(111)))/2;
 const U=b=>upstream.c.clone().addScaledVector(upstream.d,tU+RISE*(b+9)),W=b=>downstream.c.clone().addScaledVector(downstream.d,tD+RISE*(b-2));
 const along=p=>p.clone().sub(DNA0).dot(D),line=s=>DNA0.clone().addScaledVector(D,s),scaled=(v,s)=>v.clone().multiplyScalar(s);
 ref.crossVectors(upstream.d,downstream.d).normalize();
 const a0=line(along(U(-16))-95),a1=line(along(W(10))+120),pts=[],add=(f,n)=>{for(let i=pts.length?1:0;i<=n;i++)pts.push(f(i/n))};
 add(u=>a0.clone().addScaledVector(D,-RISE*320*(1-u)),160);
 let span=a0.distanceTo(U(-16));add(u=>hermiteInto(V(),a0,scaled(D,span),U(-16),scaled(upstream.d,span),u),200);
 add(u=>U(mix(-16,-9,u)),28);const anchor=pts.length-1;
 span=RISE*11;add(u=>hermiteInto(V(),U(-9),scaled(upstream.d,span),W(2),scaled(downstream.d,span),u),120);
 add(u=>W(mix(2,10,u)),32);
 span=W(10).distanceTo(a1);add(u=>hermiteInto(V(),W(10),scaled(downstream.d,span),a1,scaled(D,span),u),260);
 add(u=>a1.clone().addScaledVector(D,RISE*140*u),70);
 const arc=[0];for(let i=1;i<pts.length;i++)arc.push(arc[i-1]+pts[i].distanceTo(pts[i-1]));
 axis.count=Math.round((axis.hi-axis.lo)/axis.step)+1;axis.last=axis.count-1;
 for(let i=0,k=0;i<axis.count;i++){const s=arc[anchor]+RISE*(axis.lo+i*axis.step+9);while(k<arc.length-2&&arc[k+1]<s)k++;axis.p.push(pts[k].clone().lerp(pts[k+1],clamp((s-arc[k])/(arc[k+1]-arc[k]))))}
 for(let i=0;i<axis.count;i++)axis.t.push(axis.p[Math.min(axis.last,i+1)].clone().sub(axis.p[Math.max(0,i-1)]).normalize());
 // Initiation path. In the 4YLN promoter complex the upstream duplex wraps onto σ region 4, far from
 // the elongation path. The upstream arm pivots about the upstream fork (so the bubble stays intact)
 // towards the 4YLN −35 element, then rejoins the same straight line far upstream, so distant DNA never
 // slides when the complex switches between paths.
 const fork=U(-9),minus35=promoter.basePairs.filter(p=>p.n>=-35&&p.n<=-30).map(p=>V(...p.nontemplateP).add(V(...p.templateP)).multiplyScalar(.5)).reduce((a,p)=>a.add(p),V()).multiplyScalar(1/6);
 const toward=fork.clone().sub(minus35).normalize(),Ui=b=>fork.clone().addScaledVector(toward,RISE*(b+9)),E=b=>axis.p[Math.round((b-axis.lo)/axis.step)].clone();
 const segments=[{b0:JOIN,b1:-45,point:u=>{const a=E(JOIN),b=Ui(-45),span=a.distanceTo(b)*.55;return hermiteInto(V(),a,scaled(D,span),b,scaled(toward,span),u)}},{b0:-45,b1:-9,point:u=>Ui(mix(-45,-9,u))},
   {b0:-9,b1:2,point:u=>hermiteInto(V(),fork,scaled(toward,RISE*11),W(2),scaled(downstream.d,RISE*11),u)}],samples=[];
 for(const g of segments){const n=Math.round((g.b1-g.b0)*6),pts=Array.from({length:n+1},(_,i)=>g.point(i/n)),len=[0];for(let i=1;i<=n;i++)len.push(len[i-1]+pts[i].distanceTo(pts[i-1]));pts.forEach((p,i)=>samples.push({b:g.b0+(g.b1-g.b0)*len[i]/len[n],p}))}
 axisInit.count=axis.count;axisInit.last=axis.last;
 for(let i=0,k=0;i<axis.count;i++){const b=axis.lo+i*axis.step;if(b<=JOIN||b>=2){axisInit.p.push(axis.p[i].clone());continue}while(k<samples.length-2&&samples[k+1].b<b)k++;axisInit.p.push(samples[k].p.clone().lerp(samples[k+1].p,clamp((b-samples[k].b)/(samples[k+1].b-samples[k].b))))}
 for(let i=0;i<axis.count;i++)axisInit.t.push(axisInit.p[Math.min(axis.last,i+1)].clone().sub(axisInit.p[Math.max(0,i-1)]).normalize());
 // Closed complex, before RNAP bends the DNA into its cleft: past the fork (−9) the DNA carries straight on from the
 // upstream arm (the elongation arm, or the σ-held promoter arm) for CLOSED.straight bp, turns gently back and meets
 // the far line at CLOSED.join. The join point is chosen so the path is one rise per base pair long.
 // It is lifted to the side of the bend plane (and a little out of it) so it clears β, as measured with fullCycle.dnaContacts.
 const lineAt=b=>axis.p[0].clone().addScaledVector(D,RISE*(b-axis.lo)),away=V().crossVectors(ref,D).multiplyScalar(.7).addScaledVector(ref,-.3).normalize();
 const at=b=>Math.round((b-axis.lo)/axis.step),i0=at(CLOSED.fork),i1=at(CLOSED.join),want=RISE*(CLOSED.join-CLOSED.fork);
 // Resamples the fork…join stretch of a table to one rise per base pair along its own length.
 const even=(raw,src)=>{const out={lo:axis.lo,hi:axis.hi,step:axis.step,count:axis.count,last:axis.last,p:[],t:[]},len=[0];for(let i=i0+1;i<=i1;i++)len.push(len.at(-1)+raw[i].distanceTo(raw[i-1]));
   for(let i=0,k=0;i<axis.count;i++){if(i<=i0||i>=i1){out.p.push(src.p[i].clone());continue}const s=len.at(-1)*(i-i0)/(i1-i0);while(k<len.length-2&&len[k+1]<s)k++;out.p.push(raw[i0+k].clone().lerp(raw[i0+k+1],clamp((s-len[k])/(len[k+1]-len[k]))))}
   for(let i=0;i<axis.count;i++)out.t.push(out.p[Math.min(axis.last,i+1)].clone().sub(out.p[Math.max(0,i-1)]).normalize());out.scale=len.at(-1)/want;return out};
 // The closed path ends where the bent path puts that base pair (CLOSED.join), so DNA beyond it does not move as RNAP bends it.
 const closedPath=(arm0,src)=>{const arm=arm0.clone().lerp(downstream.d,CLOSED.aim).normalize(),straight=RISE*CLOSED.straight,bend0=fork.clone().addScaledVector(arm,straight),Q=src.p[i1],span=bend0.distanceTo(Q)*CLOSED.span,pts=[];
   for(let i=0;i<=60;i++)pts.push(fork.clone().addScaledVector(arm,straight*i/60));
   for(let i=1;i<=400;i++)pts.push(hermiteInto(V(),bend0,scaled(arm,span),Q,scaled(src.t[i1],span),i/400));
   // Lifted clear of the cleft, most in the middle of the run and not at all at the fork or the join.
   let len=[0];for(let i=1;i<pts.length;i++)len.push(len[i-1]+pts[i].distanceTo(pts[i-1]));const L=len.at(-1);pts.forEach((p,i)=>{const w=len[i]/L;p.addScaledVector(away,CLOSED.lift*16*w*w*(1-w)*(1-w))});
   len=[0];for(let i=1;i<pts.length;i++)len.push(len[i-1]+pts[i].distanceTo(pts[i-1]));
   const raw=src.p.map(p=>p.clone());for(let i=i0+1,k=0;i<i1;i++){const s=len.at(-1)*(i-i0)/(i1-i0);while(k<len.length-2&&len[k+1]<s)k++;raw[i]=pts[k].clone().lerp(pts[k+1],clamp((s-len[k])/(len[k+1]-len[k])))}
   return even(raw,src)};
 // Bending runs through evenly spaced intermediate paths, so the DNA keeps one rise per base pair while it bends.
 const stages=(src,arm)=>{const c=closedPath(arm,src),list=[c];for(const w of [.25,.5,.75])list.push(even(c.p.map((p,i)=>p.clone().lerp(src.p[i],w)),src));list.push(src);return list};
 Object.assign(bendStages,{fit:stages(axis,upstream.d),init:stages(axisInit,toward)});
 initStretch=[segments[0],segments[2]].map(g=>{const n=60;let len=0;for(let i=1;i<=n;i++)len+=g.point(i/n).distanceTo(g.point((i-1)/n));return +(len/(g.b1-g.b0)).toFixed(2)});
}
const _a=V(),_t=V(),_nm=V(),_bn=V(),_line=V(),_ai=V(),_ti=V(),_ci=V(),_ct=V(),_cj=V(),_cu=V();
function sampleAxis(table,b,outA,outT){
 const x=(b-table.lo)/table.step;
 if(x<=0){outA.copy(table.p[0]).addScaledVector(D,RISE*(b-table.lo));outT.copy(D)}
 else if(x>=table.last){outA.copy(table.p[table.last]).addScaledVector(D,RISE*(b-table.hi));outT.copy(D)}
 else{const i=Math.floor(x),f=x-i;outA.lerpVectors(table.p[i],table.p[i+1],f);outT.lerpVectors(table.t[i],table.t[i+1],f)}
}
function frameAt(b,grip,S){
 sampleAxis(axis,b,_a,_t);
 // During initiation the upstream DNA follows the promoter path onto σ region 4.
 if(S.init>0&&b>JOIN&&b<2){sampleAxis(axisInit,b,_ai,_ti);_a.lerp(_ai,S.init);_t.lerp(_ti,S.init)}
 // In the closed complex σ already holds the DNA to the fork, and past it the DNA carries straight on above the
 // cleft until RNAP bends it in (S.bend). The blend weights are the same at every base pair, so the frame stays true.
 if(S.bend!==undefined&&S.bend<1&&b>CLOSED.fork&&b<CLOSED.join){const x=S.bend*4,k=Math.min(3,Math.floor(x)),f=x-k,F=bendStages.fit,I=bendStages.init;
   sampleAxis(F[k],b,_ci,_ct);sampleAxis(F[k+1],b,_cj,_cu);_ci.lerp(_cj,f);_ct.lerp(_cu,f);
   if(S.init>0){sampleAxis(I[k],b,_ai,_ti);sampleAxis(I[k+1],b,_cj,_cu);_ai.lerp(_cj,f);_ti.lerp(_cu,f);_ci.lerp(_ai,S.init);_ct.lerp(_ti,S.init)}_a.copy(_ci);_t.copy(_ct)}
 if(grip<1){_line.copy(axis.p[0]).addScaledVector(D,RISE*(b-axis.lo));_a.lerpVectors(_line,_a,grip);_t.multiplyScalar(grip).addScaledVector(D,1-grip)}
 _a.addScaledVector(D,S.distance);if(waveOn)addWave(S);
 _t.normalize();_nm.copy(ref).addScaledVector(_t,-ref.dot(_t)).normalize();_bn.crossVectors(_t,_nm);
}
// Free DNA is gently and unevenly wavy, not ruler straight. The wave is fixed in space, so DNA slides along it as it
// moves; RNAP (or, before it binds, the promoter) holds the DNA straight from ~90 bp upstream to ~25 bp downstream
// of itself, and the hold ends when RNAP lets go of the DNA at termination.
const WAVE={up:90*RISE,down:25*RISE,ramp:40*RISE},_wx=V(),_wy=V(),_wz=V();let waveOn=false;
function addWave(S){
 const x=_wx.copy(_a).sub(DNA0).dot(D),d=x-Math.max(0,S.distance||0),s=d<0?(-d-WAVE.up)/WAVE.ramp:(d-WAVE.down)/WAVE.ramp;
 const hold=1-(S.release||0),sm=smooth(s),w=1-hold*(1-sm);if(w<1e-4)return;
 const dw=s>0&&s<1?hold*6*s*(1-s)/WAVE.ramp*(d<0?-1:1):0,k=2*Math.PI;
 const fy=18*Math.sin(k*x/860+.6)+6*Math.sin(k*x/390+2.3),fz=18*Math.sin(k*x/1040+2)+6*Math.sin(k*x/450+.9);
 const gy=18*k/860*Math.cos(k*x/860+.6)+6*k/390*Math.cos(k*x/390+2.3),gz=18*k/1040*Math.cos(k*x/1040+2)+6*k/450*Math.cos(k*x/450+.9);
 _a.addScaledVector(_wy,w*fy).addScaledVector(_wz,w*fz);_t.addScaledVector(_wy,dw*fy+w*gy).addScaledVector(_wz,dw*fz+w*gz);
}
// Which DNA base pair sits at b. Upstream DNA stays put while RNAP scrunches downstream DNA into itself.
function registerAt(b,S){const upstream=S.distance/RISE;if(S.scrunch<1e-4)return upstream;const w=b<=BUBBLE_UP?0:b<BUBBLE_UP+2?smooth((b-BUBBLE_UP)/2):1-smooth((b-20)/240);return upstream+S.scrunch*w}
function materialToB(n,S){const upstream=S.distance/RISE;if(S.scrunch<1e-4)return n-upstream;let lo=n-upstream-S.scrunch-1,hi=n-upstream+1;for(let i=0;i<26;i++){const m=(lo+hi)/2;if(m+registerAt(m,S)<n)lo=m;else hi=m}return (lo+hi)/2}
// B-form duplex whose helical phase belongs to each base pair, so free DNA does not spin as RNAP moves.
function duplexPoint(strand,b,S,out){
 frameAt(b,S.grip,S);const th=OMEGA*(b+registerAt(b,S))+phase.up+phase.shift*smooth((b-BUBBLE_UP)/(BUBBLE_DN-BUBBLE_UP))+(strand?phase.nt:0);
 return out.copy(_a).addScaledVector(_nm,phase.radius*Math.cos(th)).addScaledVector(_bn,phase.radius*Math.sin(th));
}
function trackPoint(curve,b0,b,out){
 const n=curve.points.length-1,x=b-b0,P=curve.points;
 if(x<=0)return out.subVectors(P[0],P[1]).multiplyScalar(-x).add(P[0]);
 if(x>=n)return out.subVectors(P[n],P[n-1]).multiplyScalar(x-n).add(P[n]);
 return curve.getPoint(x/n,out);
}
function fitPhases(){
 const S0={distance:0,grip:1,scrunch:0,init:0},r=V();
 const measure=p=>{let best=0,bd=Infinity;for(let i=0;i<axis.count;i++){const d=axis.p[i].distanceToSquared(p);if(d<bd){bd=d;best=i}}const b=axis.lo+best*axis.step;frameAt(b,1,S0);r.copy(p).sub(_a);const psi=Math.atan2(r.dot(_bn),r.dot(_nm));return {b,psi,radius:r.addScaledVector(_t,-r.dot(_t)).length()}};
 const upstream=[],downstream=[],nt=[],radii=[];
 for(const n of metadata.nucleic.template){const bp=15-n.id;if(bp>-9&&bp<2)continue;const m=measure(V(...n.p));(bp<0?upstream:downstream).push(m.psi-OMEGA*m.b);radii.push(m.radius)}
 phase.up=circularMean(upstream);phase.shift=wrap(circularMean(downstream)-phase.up);
 for(const n of metadata.nucleic.nontemplate){const bp=n.id-109;if(bp>-9&&bp<2)continue;const m=measure(V(...n.p));nt.push(m.psi-OMEGA*m.b-phase.up-(bp>0?phase.shift:0));radii.push(m.radius)}
 phase.nt=circularMean(nt);phase.radius=radii.reduce((s,x)=>s+x,0)/radii.length;
 const residual=[...upstream.map(x=>wrap(x-phase.up)),...downstream.map(x=>wrap(x-phase.up-phase.shift)),...nt.map(x=>wrap(x-phase.nt))];
 phase.residual=Math.sqrt(residual.reduce((s,x)=>s+x*x,0)/residual.length)*180/Math.PI;
}
const _le=V(),_lf=V(),_bp=V();
// Single-stranded linkers join the resolved bubble to duplex whose phase follows the DNA, not RNAP.
function prepareLinkers(S){
 for(const strand of [0,1]){
   const curve=strand?ntTrack:tTrack,[upL,dnL]=linkers[strand],su=HYBRID_UP-BUBBLE_UP,sd=BUBBLE_DN-1;
   upL.b0=BUBBLE_UP;upL.b1=HYBRID_UP;duplexPoint(strand,BUBBLE_UP,S,upL.p0);duplexPoint(strand,BUBBLE_UP+.05,S,_le);duplexPoint(strand,BUBBLE_UP-.05,S,_lf);upL.m0.subVectors(_le,_lf).multiplyScalar(su/.1);
   trackPoint(curve,HYBRID_UP,HYBRID_UP,upL.p1).addScaledVector(D,S.distance);trackPoint(curve,HYBRID_UP,HYBRID_UP+.05,_le).addScaledVector(D,S.distance);upL.m1.subVectors(_le,upL.p1).multiplyScalar(su/.05);
   dnL.b0=1;dnL.b1=BUBBLE_DN;trackPoint(curve,HYBRID_UP,1,dnL.p0).addScaledVector(D,S.distance);trackPoint(curve,HYBRID_UP,.95,_le).addScaledVector(D,S.distance);dnL.m0.subVectors(dnL.p0,_le).multiplyScalar(sd/.05);
   duplexPoint(strand,BUBBLE_DN,S,dnL.p1);duplexPoint(strand,BUBBLE_DN+.05,S,_le);duplexPoint(strand,BUBBLE_DN-.05,S,_lf);dnL.m1.subVectors(_le,_lf).multiplyScalar(sd/.1);
 }
}
function bubblePoint(strand,b,S,out){
 if(b>=HYBRID_UP&&b<=1)return trackPoint(strand?ntTrack:tTrack,HYBRID_UP,b,out).addScaledVector(D,S.distance);
 const L=linkers[strand][b<HYBRID_UP?0:1];return hermiteInto(out,L.p0,L.m0,L.p1,L.m1,(b-L.b0)/(L.b1-L.b0));
}
// Melting starts at the upstream edge of the bubble, in the −10 element, and unzips downstream as the bubble opens.
function openAt(b,S){return clamp(S.open*1.7-.7*clamp((b-BUBBLE_UP)/(BUBBLE_DN-BUBBLE_UP)))}
// Where a label names the terminator: the middle of its DNA stretch.
function terminatorAt(route,S=state){const z=TERMINATOR_ZONE[route].n;frameAt(materialToB((z[0]+z[1])/2,S),S.grip,S);return _a.clone()}
function dnaPoint(strand,b,S,out){duplexPoint(strand,b,S,out);if(S.open>0&&b>BUBBLE_UP&&b<BUBBLE_DN)out.lerp(bubblePoint(strand,b,S,_bp),openAt(b,S));return out}
// How strongly the RNA at b is base paired with the template in the hybrid (or at the i+1 site).
function paired(b,S){return S.open*(1-S.release)*smooth((b-HYBRID_UP+1.3)/1.1)*smooth((1.6-b)/.5)*(1-S.hairpin*smooth((HYBRID_UP+2.2-b)/1.2))}

const _rc=V();
function rnaCore(j,S,out){
 const b=j-S.register;
 if(b>=EXIT)return trackPoint(rnaTrack,EXIT,b,out).addScaledVector(D,S.distance);
 // Older RNA is laid down behind RNAP; it bends away from the exit channel into that trail.
 const trail=clamp((EXIT-4-b)/27);out.copy(rnaExit).addScaledVector(D,RISE*(j-EXIT));out.y+=(-22*Math.sin(j*.12)-35*Math.sin(j*.031))*trail;out.z+=30*Math.sin(j*.11)*trail;
 _rc.copy(rnaExit).addScaledVector(exitDir,6*(EXIT-b)).addScaledVector(D,S.distance);return out.lerp(_rc,1-smooth((EXIT-b)/7));
}
const hpAxis=V(-.35,-.90,-.26).normalize(),hpCross=V(.94,-.34,0),hpSide=V(),_hp=V(),_hq=V();
hpCross.addScaledVector(hpAxis,-hpCross.dot(hpAxis)).normalize();hpSide.crossVectors(hpAxis,hpCross).normalize();
function activeStem(S){return S.hairpin>0?[TERMINATOR,S.hairpin]:S.pauseHairpin>0?[PAUSE_STEM,S.pauseHairpin]:null}
function hairpinPoint(j,N,original,S){
 const active=activeStem(S);if(!active)return original;const [h,amount]=active,[start,end]=stemRange(h,N);
 if(j<start-h.approach||j>end)return original;
 const radius=8.5,top=h.pairs-1,last=end-start,root=_hq.copy(D).multiplyScalar(S.distance).add(nativeRNA[h.root]).addScaledVector(hpCross,-radius),q=j-start;
 const stem=(level,side,out)=>{const a=level*Math.PI*2/11;return out.copy(root).addScaledVector(hpAxis,level*2.8).addScaledVector(hpCross,side*radius*Math.cos(a)).addScaledVector(hpSide,side*radius*Math.sin(a))};
 if(q<0){rnaCore(start-h.approach,S,_hp);_hp.lerp(stem(0,-1,V()),clamp((q+h.approach)/h.approach))}
 else if(q<h.pairs)stem(q,-1,_hp);
 else if(q<h.pairs+h.loop){const a=(q-top)/(h.loop+1)*Math.PI,g=top*Math.PI*2/11;stem(top,0,_hp).addScaledVector(hpCross,-Math.cos(a)*radius*Math.cos(g)).addScaledVector(hpSide,-Math.cos(a)*radius*Math.sin(g)).addScaledVector(hpAxis,Math.sin(a)*9*h.loop/5)}
 else stem(Math.max(0,last-q),1,_hp);
 return original.lerp(_hp,zipAt(amount,q,h));
}
// Hairpins nucleate at the loop and zip down towards RNAP (and unzip from the base).
function zipAt(amount,q,h){const level=q<0?0:q<h.pairs?q:q<h.pairs+h.loop?h.pairs:2*h.pairs+h.loop-1-q;return smooth((amount-(1-level/h.pairs)*.55)/.45)}
function rnaPoint(j,S=state,out=V()){rnaCore(j,S,out);hairpinPoint(j,S.ntCount,out,S);return out.addScaledVector(RNA_RELEASE,S.release)}
// The other DNA segment of the promoter search: it runs below the promoter DNA (+y is down on screen)
// at a slight angle and passes within ~70 Å of it near −60, where RNAP transfers between them.
const ARC={y:x=>72+34*smooth(Math.abs(x-SEARCH.cross)/150)+6e-4*Math.max(0,Math.abs(x-SEARCH.cross)-280)**2,z:x=>.22*(x-SEARCH.cross)},_arcT=V(),_sq=new THREE.Quaternion();
function arcAxis(x,out){return out.copy(DNA0).addScaledVector(D,x).add(_arcT.set(0,ARC.y(x),ARC.z(x)))}
function actorPosition(S){
 const t=S.time,s=searchAt(t);
 if(s){const off=1-s.segment;return D.clone().multiplyScalar(S.distance).add(V(0,mix(ARC.y(S.distance),125,s.land)*off+s.lift,ARC.z(S.distance)*off*(1-s.land)))}
 const bindHeight=t<SEARCH.land[0]?125:0;
 return D.clone().multiplyScalar(S.distance).add(V(28*S.release+15*S.recycling,bindHeight+80*S.release+40*S.recycling,23*S.release+10*S.recycling));
}
// While RNAP is on the tilted segment the core (and σ) turn to lie along it.
const _ta=V(),_tb=V(),_tilt=new THREE.Quaternion(),_pivot=V();
function searchTilt(S,out){out.identity();const s=searchAt(S.time);if(!s)return out;const x=S.distance,tan=arcAxis(x+2,_ta).sub(arcAxis(x-2,_tb)).normalize();out.setFromUnitVectors(D,tan);return out.slerp(_sq.identity(),Math.max(s.segment,s.land))}

function makeGeometry(){
 rhoNative.copy(V(...metadata.rhoCenter));nativeRNA=metadata.nucleic.rna.map(a=>V(...a.p));rhoAxis.copy(nativeRNA[10]).sub(nativeRNA[2]).normalize();
 const index=list=>new Map(list.map(n=>[n.id,n]));tById=index(metadata.nucleic.template);ntById=index(metadata.nucleic.nontemplate);rnaById=index(metadata.nucleic.rna);
 const T=id=>V(...tById.get(id).p),N=id=>V(...ntById.get(id).p),R=id=>V(...rnaById.get(id).p);
 const a=N(86).add(T(38)).multiplyScalar(.5),b=N(122).add(T(2)).multiplyScalar(.5);D.copy(b).sub(a).normalize();DNA0.copy(a).addScaledVector(D,-a.dot(D));
 buildAxis();fitPhases();_wy.set(0,1,0).addScaledVector(D,-D.y).normalize();_wz.crossVectors(D,_wy);waveOn=true;
 // The template bends sharply at the active site: the angle between the hybrid and downstream duplex axes.
 const range=(a,b)=>Array.from({length:b-a+1},(_,i)=>a+i),hybridAxis=fitLine([...range(15,23).map(T),...range(27,35).map(R)]).d,downstreamAxis=fitLine([...range(2,13).map(T),...range(111,122).map(N)]).d;
 turnAngle=Math.round(Math.acos(Math.abs(hybridAxis.dot(downstreamAxis)))*180/Math.PI);
 tTrack=new THREE.CatmullRomCurve3([23,22,21,20,19,18,17,16,15,14].map(T),false,'centripetal');
 // NT104–107 are unresolved; the single strand bulges away from the template across that gap.
 const ntA=[101,102,103].map(N),ntB=[108,109,110].map(N),away=ntA[2].clone().add(ntB[0]).multiplyScalar(.5).sub(T(19).add(T(18)).multiplyScalar(.5)).normalize();
 ntTrack=new THREE.CatmullRomCurve3([...ntA,...[1,2,3,4].map(k=>ntA[2].clone().lerp(ntB[0],k/5).addScaledVector(away,11*Math.sin(Math.PI*k/5))),...ntB],false,'centripetal');
 // RNA 9–35 as resolved; b = +1 is one hybrid step beyond the 3′ end (the NTP site); beyond that
 // the secondary channel, traced as the widest path from the active site to solvent in 8E6X.
 const site=V(-.01,-.41,-1.52),channel=new THREE.CatmullRomCurve3([site,...[[4.5,1.5,-4.5],[9,6,-5],[13,9,-8],[19,12,-10.5],[27,14.5,-10.5],[35,20,-10.5],[43,28,-10.5],[51,36,-10.5],[58,42.5,-11.5],[68,50,-13.5],[80,58,-15.5]].map(p=>V(...p))],false,'centripetal');
 const length=channel.getLength(),steps=Math.floor(length/6);
 rnaTrack=new THREE.CatmullRomCurve3([...Array.from({length:27},(_,i)=>R(9+i)),...Array.from({length:steps+1},(_,i)=>channel.getPointAt(i*6/length))],false,'centripetal');
 rnaExit.copy(R(9));exitDir.copy(R(9)).sub(R(12)).normalize();
 const s0=axis.p[0].clone().sub(DNA0).dot(D);materialMin=Math.ceil(axis.lo+(-510-s0)/RISE);materialMax=Math.floor(axis.lo+(1940-s0)/RISE);
 dnaTubes=[createTube(dnaGroup,{color:DNA,radius:STRANDS.radius.template,max:2600,glow:STRANDS.glow.template,outline:true,axis:D}),createTube(dnaGroup,{color:NT,radius:STRANDS.radius.coding,max:2600,glow:STRANDS.glow.coding,outline:true,axis:D})];
 strandOutlines=dnaTubes.map(tb=>tb.outline);
 rungs=createRungs(dnaGroup,materialMax-materialMin+1);
 templateStubs=new THREE.InstancedMesh(bondGeometry,rungs[0].material,TEMPLATE_STUBS);for(let i=0;i<TEMPLATE_STUBS;i++)templateStubs.setColorAt(i,RUNG_PLAIN[0]);dnaGroup.add(templateStubs);
 // Base letters for close-ups in Sequence mode: a small pool of sprites, one texture per letter.
 const glyph=ch=>{const c=document.createElement('canvas');c.width=c.height=64;const g=c.getContext('2d');g.font='600 44px DM Sans, sans-serif';g.textAlign='center';g.textBaseline='middle';g.lineWidth=8;g.strokeStyle='#050b14';g.strokeText(ch,32,34);g.fillStyle=BASE_HEX[ch];g.fillText(ch,32,34);const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;return new THREE.SpriteMaterial({map:t,depthWrite:false,transparent:true})};
 const glyphs=Object.fromEntries(['A','C','G','T','U'].map(ch=>[ch,glyph(ch)]));letters=Array.from({length:60},()=>{const sp=new THREE.Sprite(glyphs.A);sp.visible=false;sp.scale.setScalar(3.4);sp.userData.glyphs=glyphs;siteGroup.add(sp);return sp});
 rnaTube=createTube(rnaGroup,{color:RNA,radius:STRANDS.radius.rna,max:1500,sides:9,outline:true,axis:D});rnaOutline=rnaTube.outline;rnaStubs=new THREE.InstancedMesh(bondGeometry,baseMaterial(0xffffff,{roughness:.45}),RNA_STUBS);rnaGroup.add(rnaStubs);
 rutTube=createTube(rnaGroup,{color:0xffcf7a,radius:2.1,max:181,axis:D});
 rutGlow=createTube(rnaGroup,{radius:6.5,max:121,sides:12,material:glowMaterial(0xb58cf0),axis:D});promoterGlow=[0xf08aa6,0xf08aa6,0xe8f4ff].map((c,i)=>{const g=createTube(promoterGroup,{radius:i<2?13.5:12,max:41,sides:14,material:glowMaterial(c,{depthTest:false}),axis:D});g.taper=i<2?9:6;return g});bubbleGlow=createTube(dnaGroup,{radius:12,max:61,sides:14,material:glowMaterial(0x86dcff,{depthTest:false}),axis:D});bubbleGlow.taper=8;terminatorGlow=createTube(dnaGroup,{radius:12.5,max:161,sides:14,material:glowMaterial(0xff7a66,{depthTest:false}),axis:D});terminatorGlow.taper=10;
 fragmentTube=createTube(fragmentGroup,{color:RNA,radius:STRANDS.radius.rna,max:90,sides:9,axis:D});fragmentStubs=new THREE.InstancedMesh(bondGeometry,baseMaterial(0xffffff,{roughness:.45}),12);fragmentGroup.add(fragmentStubs);
 for(const inst of [rnaStubs,fragmentStubs])for(let i=0;i<inst.count;i++)inst.setColorAt(i,BASE_COLOR);
 // The misincorporated nucleotide carries a red bead until the cut dinucleotide leaves.
 errorBead=new THREE.Mesh(new THREE.SphereGeometry(1.6,16,12),baseMaterial(ERROR_RED,{emissive:ERROR_RED,emissiveIntensity:.45}));rnaGroup.parent.add(errorBead);
 for(const spec of [{n:-32.5,name:'−35',color:0xe696aa},{n:-9.5,name:'−10',color:0xe696aa},{n:0,name:'+1',color:0xdcefff}]){
   // An invisible anchor for the element's labels; the glow sleeves are what the eye finds.
   const marker=new THREE.Object3D();promoterGroup.add(marker);promoterLabels.push({...spec,marker});
 }
 hairpinBonds=new THREE.InstancedMesh(bondGeometry,baseMaterial(0xffe0a8,{emissive:0xffc978,emissiveIntensity:.18}),9);hairpinGroup.add(hairpinBonds);stemTube=createTube(hairpinGroup,{color:0xffd88f,radius:1.75,max:90,sides:10,glow:.14,axis:D});
 utract=new THREE.InstancedMesh(atomGeometry,baseMaterial(0xffe1a0,{emissive:0xffc26a,emissiveIntensity:.2}),7);hairpinGroup.add(utract);
 // 5′→3′ arrowheads every 10 bp (DNA) or 10 nt (RNA): the strands visibly run antiparallel.
 const cone=new THREE.ConeGeometry(1.5,4,10);polarity=[DNA,NT,RNA].map((c,i)=>{const m=new THREE.InstancedMesh(cone,baseMaterial(c,{emissive:c,emissiveIntensity:.18,roughness:.4}),i<2?Math.ceil((materialMax-materialMin)/10)+2:48);m.frustumCulled=false;(i<2?dnaGroup:rnaGroup).add(m);return m});
 makeNucleotide();makeRibosome();makeSearchDNA();makeChannels(channel);
}
// Channel light-paths (Parts, with the cutaway or Explore): dashes flow along the main DNA channel, up the
// secondary channel (NTPs in) and out of the RNA exit channel, in the RNAP frame.
let channels,channelMats=[];const channelTime={value:0};
function makeChannels(secondary){
 channels=new THREE.Group();core.add(channels);channels.visible=false;
 const dash=(color,speed)=>{const m=new THREE.MeshBasicMaterial({color,transparent:true,opacity:.55,depthWrite:false});m.userData.noAO=true;m.onBeforeCompile=sh=>{sh.uniforms.uTime=channelTime;sh.uniforms.uSpeed={value:speed};sh.vertexShader=sh.vertexShader.replace('void main() {','varying float vRun;\nvoid main() {\nvRun=uv.x;');sh.fragmentShader=sh.fragmentShader.replace('void main() {','uniform float uTime,uSpeed;varying float vRun;\nvoid main() {\nif(fract(vRun*14.-uTime*uSpeed)>.55)discard;')};channelMats.push(m);return m};
 const path=(pts,color,speed,r)=>channels.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts),96,r,10,false),dash(color,speed)));
 // Main channel: along the downstream DNA axis into the cleft (8E6X frame); secondary channel: solvent to the active site; exit: hybrid to solvent.
 path(Array.from({length:9},(_,i)=>DNA0.clone().addScaledVector(D,110-i*14)),0x8fd3ff,.6,5.5);
 path(Array.from({length:12},(_,i)=>secondary.getPoint(1-i/11)),0xffd27a,.8,4.5);
 path(Array.from({length:10},(_,i)=>trackPoint(rnaTrack,EXIT,HYBRID_UP-i*2.2,V())),0xffa45e,.7,4.5);
}
// The other DNA segment for the promoter search: a static, faded helix built once around the arc.
let searchGroup,searchParts=null,searchLoop=null;
// The DNA (promoter DNA and the looped segment alike) appears all at once, after the holoenzyme has assembled.
const DNA_IN=[14.5,15.3],dnaIn=t=>ramp(t,...DNA_IN);
const LOOP={from:-470,reach:150};
// The segment RNAP first lands on is the same molecule: it runs in from the right below the promoter DNA,
// loops round at the left and joins the promoter DNA's upstream end, its strands continuing into the main strands.
function makeSearchDNA(){
 searchGroup=new THREE.Group();world.add(searchGroup);
 const S0={distance:0,grip:0,scrunch:0,init:0,open:0};frameAt(materialMin,0,S0);const J=_a.clone(),JT=_t.clone(),JN=_nm.clone(),JB=_bn.clone(),bulge=V(0,0,-70);
 const axisPts=[];for(let x=500;x>LOOP.from;x-=1.1)axisPts.push(arcAxis(x,V()));
 const P0=arcAxis(LOOP.from,V()),T0=arcAxis(LOOP.from-1,V()).sub(arcAxis(LOOP.from+1,V())).normalize(),turn=new THREE.CubicBezierCurve3(P0,P0.clone().addScaledVector(T0,LOOP.reach),J.clone().addScaledVector(JT,-LOOP.reach),J),steps=Math.ceil(turn.getLength()/1.1);
 // The bulge towards the viewer vanishes, with its slope, at both ends, so the loop leaves the arc and meets the DNA smoothly.
 for(let i=0;i<=steps;i++){const u=i/steps;axisPts.push(turn.getPointAt(u).addScaledVector(bulge,16*u*u*(1-u)*(1-u)))}
 // Parallel-transported frames; one constant phase offset lands both strands on the main strands at the junction.
 const n=axisPts.length,T=[],N=[],arc=new Float32Array(n);for(let i=0;i<n;i++){T.push(i===n-1?JT.clone():axisPts[Math.min(n-1,i+1)].clone().sub(axisPts[Math.max(0,i-1)]).normalize());if(i)arc[i]=arc[i-1]+axisPts[i].distanceTo(axisPts[i-1])}
 N.push(V(0,1,0).addScaledVector(T[0],-T[0].y).normalize());for(let i=1;i<n;i++)N.push(N[i-1].clone().addScaledVector(T[i],-N[i-1].dot(T[i])).normalize());
 const w=OMEGA/RISE,end=N[n-1],phi=Math.atan2(end.dot(JB),end.dot(JN)),shift=wrap(OMEGA*materialMin+phase.up-phi-w*arc[n-1]),B=V();
 const strandAt=(k,i,out)=>{const th=w*arc[i]+shift+(k?phase.nt:0);B.crossVectors(T[i],N[i]);return out.copy(axisPts[i]).addScaledVector(N[i],phase.radius*Math.cos(th)).addScaledVector(B,phase.radius*Math.sin(th))};
 const strands=searchStrands=[createTube(searchGroup,{color:DNA,radius:STRANDS.radius.template,max:n,glow:STRANDS.glow.template,outline:true,axis:D}),createTube(searchGroup,{color:NT,radius:STRANDS.radius.coding,max:n,glow:STRANDS.glow.coding,outline:true,axis:D})];
 strands.forEach((tb,k)=>{for(let i=0;i<n;i++)strandAt(k,i,tb.points[i]);tb.update(n)});
 const hulls=strands.map(tb=>tb.outline);
 // One base pair every RISE, counted back from the junction so the spacing runs on from the main DNA's rungs.
 const pairs=Math.floor(arc[n-1]/RISE),halves=[0,1].map(k=>new THREE.InstancedMesh(bondGeometry,baseMaterial(0xffffff,{roughness:.55}),pairs)),p=V(),q=V(),m=V(),a=V(),b=V();let i=n-1;
 for(let r=0;r<pairs;r++){const sAt=arc[n-1]-(r+1)*RISE;while(i>0&&arc[i-1]>sAt)i--;const j=Math.max(0,i-1),f=clamp((sAt-arc[j])/Math.max(1e-6,arc[i]-arc[j]));
   strandAt(0,j,a);strandAt(0,i,b);p.lerpVectors(a,b,f);strandAt(1,j,a);strandAt(1,i,b);q.lerpVectors(a,b,f);m.addVectors(p,q).multiplyScalar(.5);halfRung(halves[0],r,p,m,.5,1);halfRung(halves[1],r,q,m,.5,1);halves.forEach((h,k)=>h.setColorAt(r,RUNG_PLAIN[k]))}
 halves.forEach(h=>{finish(h);h.instanceColor.needsUpdate=true;searchGroup.add(h)});
 searchLoop={junction:J,strandEnds:strands.map(tb=>tb.points[n-1]),pairs};
 searchParts={strands,hulls,halves};searchGroup.visible=false;
}
// A schematic 70S ribosome: two noisy lobes (30S pale, 50S darker), clearly not a structure.
function makeRibosome(){
 const lobe=(r,seed)=>{const g=new THREE.IcosahedronGeometry(1,5),p=g.attributes.position;for(let i=0;i<p.count;i++){const x=p.getX(i),y=p.getY(i),z=p.getZ(i),k=1+.08*Math.sin(3.1*x+seed)*Math.sin(2.3*y+2*seed)+.06*Math.sin(4.7*z+3*seed)*Math.cos(2.9*x);p.setXYZ(i,x*r[0]*k,y*r[1]*k,z*r[2]*k)}g.computeVertexNormals();return g};
 const skin=c=>baseMaterial(c,{transparent:true,opacity:.32,depthWrite:false,roughness:.85,emissive:c,emissiveIntensity:.02});
 ribSmall=new THREE.Mesh(lobe([66,40,52],1.3),skin(0xd9cfb6));ribLarge=new THREE.Mesh(lobe([90,70,82],2.9),skin(0xa89a7c));ribosome=new THREE.Group();ribosome.add(ribSmall,ribLarge);ribosome.visible=false;world.add(ribosome);
 peptide=createTube(world,{color:0xb9d9a8,radius:1.2,max:40,sides:6,glow:.2,axis:D});
}
// The incoming NTP: base, ribose and α, β, γ phosphates, posed at the i+1 site of 8E6X.
function makeNucleotide(){
 const site=trackPoint(rnaTrack,EXIT,1,V()),template=V(...tById.get(14).p),stub=template.clone().sub(site).multiplyScalar(.5),us=stub.clone().normalize();
 const stack=V(...rnaById.get(35).p).add(V(...tById.get(15).p)).sub(V(...rnaById.get(27).p)).sub(V(...tById.get(23).p));stack.addScaledVector(us,-stack.dot(us)).normalize();
 const out=trackPoint(rnaTrack,EXIT,2,V()).sub(site).normalize(),gamma=V();ntpBeta.copy(out).multiplyScalar(2.9);gamma.copy(ntpBeta).addScaledVector(out.clone().multiplyScalar(.8).addScaledVector(stack,.6).normalize(),2.9);
 inwardSite.copy(trackPoint(rnaTrack,EXIT,.9,V())).sub(trackPoint(rnaTrack,EXIT,1.1,V())).normalize();
 const orient=new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().makeBasis(us,stack,V().crossVectors(us,stack)));
 ntpParts={base:baseMaterial(RNA,{emissive:RNA,emissiveIntensity:.3,roughness:.35}),sugar:baseMaterial(0xf6d2aa,{emissive:0xf6d2aa,emissiveIntensity:.12}),alpha:baseMaterial(PHOSPHATE,{emissive:PHOSPHATE,emissiveIntensity:.35,roughness:.3}),
   bond:baseMaterial(0xeadfca,{roughness:.5}),bridge:baseMaterial(0xeadfca,{roughness:.5}),ppi:baseMaterial(PHOSPHATE,{emissive:PHOSPHATE,emissiveIntensity:.35,roughness:.3})};
 ntp=new THREE.Group();ppi=new THREE.Group();siteGroup.add(ntp,ppi);
 const link=(a,b,r,mat,group)=>{const m=new THREE.Mesh(bondGeometry,mat),dir=b.clone().sub(a);m.position.copy(a).add(b).multiplyScalar(.5);m.quaternion.setFromUnitVectors(up,dir.clone().normalize());m.scale.set(r,dir.length(),r);group.add(m)};
 const base=new THREE.Mesh(new THREE.CylinderGeometry(2.1,2.1,.95,6),ntpParts.base),ribose=new THREE.Mesh(new THREE.CylinderGeometry(1.3,1.3,.8,5),ntpParts.sugar),alpha=new THREE.Mesh(atomGeometry,ntpParts.alpha);
 base.position.copy(us).multiplyScalar(stub.length()*.68);base.quaternion.copy(orient);ribose.position.copy(us).multiplyScalar(2.5);ribose.quaternion.copy(orient);alpha.scale.setScalar(1.15);ntp.add(base,ribose,alpha);
 link(ribose.position,base.position,.5,ntpParts.bond,ntp);link(V(),ribose.position,.4,ntpParts.bond,ntp);link(V(),ntpBeta,.38,ntpParts.bridge,ntp);
 const beta=new THREE.Mesh(atomGeometry,ntpParts.ppi),gammaMesh=new THREE.Mesh(atomGeometry,ntpParts.ppi);beta.scale.setScalar(1.15);gammaMesh.scale.setScalar(1.15);gammaMesh.position.copy(gamma).sub(ntpBeta);ppi.add(beta,gammaMesh);link(V(),gammaMesh.position,.38,ntpParts.ppi,ppi);
 // Bridge helix (β′ 770–805) and trigger loop: the flexible parts that fold around each NTP. The loop's
 // flanks are resolved in 8E6X (β′ 925–933, 1136–1145); its tip (934–947) is not, so the fold is schematic.
 const helix=traces.bridgeHelix.map(p=>V(...p)),fit=fitLine(helix),extent=helix.map(p=>p.clone().sub(fit.c).dot(fit.d));
 bridgeHelix=new THREE.Mesh(new THREE.CylinderGeometry(2.8,2.8,Math.max(...extent)-Math.min(...extent)+4,18),baseMaterial(0xbfeaf2,{emissive:0xbfeaf2,emissiveIntensity:.18,roughness:.3}));
 bridgeHelix.userData.centre=fit.c.clone().addScaledVector(fit.d,(Math.max(...extent)+Math.min(...extent))/2);bridgeHelix.quaternion.setFromUnitVectors(up,fit.d);siteGroup.add(bridgeHelix);
 const n933=V(...traces.triggerLoopN.at(-1)),c1136=V(...traces.triggerLoopC[0]),hinge=n933.clone().add(c1136).multiplyScalar(.5);
 tlOpen.copy(hinge).addScaledVector(hinge.clone().sub(site).normalize(),10);tlClosed.copy(site).addScaledVector(bridgeHelix.userData.centre.clone().sub(site).normalize(),6);
 triggerLoop=createTube(siteGroup,{color:0xf3e3c2,radius:1.5,max:48,glow:.3,axis:D});
 tlPoints.push(...traces.triggerLoopN.map(p=>V(...p)),V(),V(),V(),...traces.triggerLoopC.map(p=>V(...p)));tlCurve=new THREE.CatmullRomCurve3(tlPoints,false,'centripetal');
 // A small pool of free NTPs waits at the secondary-channel mouth; each incoming NTP comes from it.
 const glyph=mergeGeometries([new THREE.CylinderGeometry(1.7,1.7,.7,6).rotateZ(Math.PI/2),...[0,1,2].map(i=>new THREE.SphereGeometry(.85,10,8).translate(0,2.6+1.9*i,0))].map(g=>{g.deleteAttribute('uv');return g}));
 ntpPool=new THREE.InstancedMesh(glyph,baseMaterial(RNA,{emissive:RNA,emissiveIntensity:.12,roughness:.4}),16);ntpPool.frustumCulled=false;siteGroup.add(ntpPool);
 mg=new THREE.Mesh(new THREE.SphereGeometry(1.25,16,12),baseMaterial(0xc8ffd8,{emissive:0xc8ffd8,emissiveIntensity:.5}));
 flash=new THREE.Mesh(new THREE.SphereGeometry(1,18,12),new THREE.MeshBasicMaterial({color:0xfff0c8,transparent:true,opacity:0,depthWrite:false,blending:THREE.AdditiveBlending}));siteGroup.add(mg,flash);
}

const _p=V(),_q=V(),_m=V(),_e=V(),_f=V(),_g=V(),_n2=V(),_b2=V(),_q1=new THREE.Quaternion(),_q2=new THREE.Quaternion(),_eu=new THREE.Euler();
function updateDNA(S){
 if(S.open>0)prepareLinkers(S);
 const b0=materialToB(materialMin,S),b1=materialToB(materialMax,S);let open=0;
 for(const strand of [0,1]){const tb=dnaTubes[strand],max=tb.points.length-1,bs=dnaSamples[strand];let c=0;for(let b=b0;b<b1&&c<max;b+=b>-45&&b<50?1/6:1/2.3){bs[c]=b;dnaPoint(strand,b,S,tb.points[c++])}bs[c]=b1;dnaPoint(strand,b1,S,tb.points[c++]);tb.update(c)}
 for(let i=0,n=materialMin;n<=materialMax;i++,n++){
   const b=materialToB(n,S);dnaPoint(0,b,S,_p);dnaPoint(1,b,S,_q);_m.addVectors(_p,_q).multiplyScalar(.5);
   const k=1-openAt(b,S)*smooth((n-S.distance/RISE-BUBBLE_UP)/1.5)*smooth((BUBBLE_DN-b)/1.5);halfRung(rungs[0],i,_p,_m,.5,k);halfRung(rungs[1],i,_q,_m,.5,k);if(k<.5&&Math.abs(b)<20)open++;
 }
 bubbleOpen=open;
 const route=S.path||'rho';if(Math.abs(seqW-rungSeqShown)>.01||route!==rungSeqRoute){for(const [k,inst] of rungs.entries()){for(let i=0;i<inst.count;i++){const n=materialMin+i;inst.setColorAt(i,_bc.copy(RUNG_PLAIN[k]).lerp(BASE_COL[k===0?templateBase(n,route):coding(n,route)],seqW))}inst.instanceColor.needsUpdate=true}rungSeqShown=seqW;rungSeqRoute=route}
 finish(rungs[0]);finish(rungs[1]);
 polarityFade=1-smooth((camera.position.distanceTo(controls.target)-600)/200);
 for(const strand of [0,1]){let i=0;const inst=polarity[strand];for(let n=Math.ceil(materialMin/10)*10;n<=materialMax;n+=10,i++){const b=materialToB(n,S);if(polarityFade<.01){point(inst,i,_p,0);continue}
   dnaPoint(strand,b,S,_p);_e.subVectors(_p,_a).setLength(1.2);dnaPoint(strand,b+(strand?.25:-.25),S,_f);dnaPoint(strand,b+(strand?-.25:.25),S,_g);_q.subVectors(_f,_g).normalize();
   dummy.position.copy(_p).add(_e);dummy.quaternion.setFromUnitVectors(up,_q);dummy.scale.setScalar(polarityFade*(b>BUBBLE_UP&&b<BUBBLE_DN?.7:1));dummy.updateMatrix();inst.setMatrixAt(i,dummy.matrix)}
   for(;i<inst.count;i++)point(inst,i,_p,0);finish(inst)}
 // Template bases inside the bubble travel with the RNA they pair with.
 let k=0;
 for(let j=Math.ceil(S.register-9.4);j<=Math.floor(S.register+1.7)&&k<TEMPLATE_STUBS;j++){const b=j-S.register,w=paired(b,S)*(j===ERROR.j?1-.4*S.error:1);if(w<.01)continue;dnaPoint(0,b,S,_p);trackPoint(rnaTrack,EXIT,b,_q).addScaledVector(D,S.distance);_m.addVectors(_p,_q).multiplyScalar(.5);templateStubs.setColorAt(k,_bc.copy(RUNG_PLAIN[0]).lerp(BASE_COL[templateBase(j,S.path||'rho')],seqW));halfRung(templateStubs,k++,_p,_m,.5,w)}
 for(;k<TEMPLATE_STUBS;k++)halfRung(templateStubs,k,_p,_p,0,0);finish(templateStubs);templateStubs.instanceColor.needsUpdate=true;
 const t=S.time,show=dnaIn(t);promoterGroup.visible=show>.01;
 if(promoterGroup.visible)for(const p of promoterLabels){frameAt(materialToB(p.n,S),S.grip,S);p.marker.position.copy(_a)}
 // The −35, −10 and +1 glows stay on for the whole cycle, so the promoter can always be found; they brighten while
 // RNAP waits just upstream of the promoter and again while σ holds it in the closed complex.
 const reveal=pulse(t,SEARCH.wait[0]+.3,SEARCH.wait[0]+1.3,SEARCH.approach[0]+.2,SEARCH.approach[0]+1.4),held=.8*pulse(t,SEARCH.approach[0]+.4,SEARCH.found,41.4,43.4),pg=show*Math.max(.3,reveal,held);
 [[-35,-30],[-12,-7],[0,0]].forEach(([n0,n1],i)=>{const sl=promoterGlow[i],pad=i<2?2:1.2,amount=i<2?pg:pg*.8*(1-.6*S.open);sl.material.uniforms.uAmount.value=amount;if(amount<.01){sl.update(0);return}let c=0;for(let n=n0-pad;n<=n1+pad+1e-6&&c<sl.points.length;n+=.25){frameAt(materialToB(n,S),S.grip,S);sl.points[c++].copy(_a)}sl.update(c)});
 // The open complex: the bubble glows while the DNA melts around the start site.
 // The terminator lights up while RNAP is still upstream of it, stays faintly lit until RNAP covers it, and returns
 // once RNAP has let go, like the promoter.
 const zone=S.path&&TERMINATOR_ZONE[S.path],tg=zone&&t>=zone.show[0]?(S.path==='rho'?.9:.65)*Math.max(pulse(t,...zone.show),.4*ramp(t,zone.show[0],zone.show[1]))*(1-(1-S.release)*smooth((S.register-zone.n[0]+12)/8)):0;terminatorGlow.material.uniforms.uAmount.value=tg;
 if(tg>.01){let c=0;for(let n=zone.n[0]-2;n<=zone.n[1]+2+1e-6&&c<terminatorGlow.points.length;n+=.25){frameAt(materialToB(n,S),S.grip,S);terminatorGlow.points[c++].copy(_a)}terminatorGlow.update(c)}else terminatorGlow.update(0);
 const bg=.5*pulse(t,44.2,45.2,49,51);bubbleGlow.material.uniforms.uAmount.value=bg;if(bg>.01){let c=0;for(let b=BUBBLE_UP-1;b<=BUBBLE_DN+1+1e-6&&c<bubbleGlow.points.length;b+=.3){frameAt(b,S.grip,S);bubbleGlow.points[c++].copy(_a)}bubbleGlow.update(c)}else bubbleGlow.update(0);
}
function freeStub(j,p,tangent,length,out){_n2.copy(Math.abs(tangent.y)<.9?up:D).cross(tangent).normalize();_b2.crossVectors(tangent,_n2);const a=j*1.15;return out.copy(_n2).multiplyScalar(Math.cos(a)).addScaledVector(_b2,Math.sin(a)).multiplyScalar(length).add(p)}
function updateRNA(S){
 const L=S.ntCount,end=L-1;rnaGroup.visible=L>.02;if(!rnaGroup.visible){rnaSample=(x,out)=>rnaPoint(x,S,out);return}
 let c=0;if(end>.05){const steps=Math.ceil(end*3);for(let k=0;k<=steps&&c<rnaTube.points.length;k++)rnaPoint(Math.min(end,k/3),S,rnaTube.points[c++])}rnaTube.update(c);
 // Stubs, arrowheads, the rut and the hairpin reuse these samples (one every 1/3 nt) where they exist.
 const P=rnaTube.points,sample=(x,out)=>{const k=Math.round(x*3);return Math.abs(k-x*3)<1e-6&&k>=0&&k<c-1?out.copy(P[k]):rnaPoint(x,S,out)};rnaSample=sample;
 const nts=Math.min(RNA_STUBS,Math.ceil(L-1e-6)),active=activeStem(S),stemHere=active?[...stemRange(active[0],S.ntCount),active[1]]:null;
 for(let j=0;j<RNA_STUBS;j++){
   if(j>=nts){halfRung(rnaStubs,j,_p,_p,0,0);continue}
   const x=S.addition?j:Math.min(j,Math.max(0,end)),b=x-S.register,w=paired(b,S);
   sample(x,_p);sample(x+1/3,_e);sample(Math.max(0,x-1/3),_f);_g.subVectors(_e,_f).normalize();freeStub(j,_p,_g,3.6,_q);
   if(w>0){dnaPoint(0,b,S,_m);_m.add(_p).multiplyScalar(.5);_q.lerp(_m,w)}
   const stem=stemHere&&j>=stemHere[0]&&j<=stemHere[1]?stemHere[2]:0,mismatch=j===ERROR.j?S.error:0;halfRung(rnaStubs,j,_p,_q,.55,clamp(L-j)*(1-stem)*(1-.4*mismatch));
 }
 const route=S.path||'rho';if(Math.abs(seqW-rnaSeqShown)>.01||route!==rnaSeqRoute){for(let j=0;j<RNA_STUBS;j++)rnaStubs.setColorAt(j,_bc.copy(BASE_COLOR).lerp(BASE_COL[rnaBase(j,route)],seqW));rnaStubs.instanceColor.needsUpdate=true;rnaSeqShown=seqW;rnaSeqRoute=route;errorShown=-1}
 const errorOn=S.error>.02&&ERROR.j<nts?ERROR.j:-1;if(errorOn!==errorShown){if(errorShown>=0)rnaStubs.setColorAt(errorShown,_bc.copy(BASE_COLOR).lerp(BASE_COL[rnaBase(errorShown,route)],seqW));if(errorOn>=0)rnaStubs.setColorAt(errorOn,ERROR_COLOR);rnaStubs.instanceColor.needsUpdate=true;errorShown=errorOn}
 finish(rnaStubs);
 const cones=polarity[2];let i=0;for(let j=5;j<L-2&&i<cones.count;j+=10,i++){sample(j,_p);sample(j+1/3,_e);sample(j-1/3,_f);_q.subVectors(_e,_f).normalize();dummy.position.copy(_p);dummy.quaternion.setFromUnitVectors(up,_q);dummy.scale.setScalar(polarityFade);dummy.updateMatrix();cones.setMatrixAt(i,dummy.matrix)}
 for(;i<cones.count;i++)point(cones,i,_p,0);finish(cones);
}
// The ribosome sits on the RNA ~33 nt behind the 3′ end, its body turned away from RNAP; the KOW domain
// of NusG swings from its resting pose to the small subunit while they are coupled.
const RIB_UP=34,_rup=V(0,-.9,0),_ra=V(),_rt=V(),_ru=V(),_rw=V(),_rm=new THREE.Matrix4(),_rq=new THREE.Quaternion(),_kq=new THREE.Quaternion();
function updateRibosome(S){
 const r=couplingAt(S.time);ribosome.visible=!!r&&r.fade>.01;kowPivot.quaternion.identity();
 if(!ribosome.visible){peptide.update(0);return}
 // A fixed orientation carried by the anchor: the RNA near RNAP is being extruded fast, so any local
 // tangent would swing the schematic body around.
 rnaPoint(r.j,S,_ra);_rt.copy(D);_ru.copy(_rup);_ru.addScaledVector(_rt,-_ru.dot(_rt)).normalize();_rw.crossVectors(_rt,_ru).normalize();
 ribAnchor.copy(_ra);_rm.makeBasis(_rt,_ru,_rw);ribosome.quaternion.setFromRotationMatrix(_rm);ribosome.position.copy(_ra);
 // Assembly: the small subunit arrives from the side, the large one from above; they separate at the stop codon.
 // The body sits above the RNA and a little upstream (−x), clear of NusA at the RNA exit.
 ribSmall.position.set(-RIB_UP,34,0).addScaledVector(V(0,0,1),110*(1-r.small)).addScaledVector(V(0,0,-1),70*r.split);
 ribLarge.position.set(-RIB_UP*1.4,34+100,0).addScaledVector(V(0,1,0),150*(1-r.large)+90*r.split);
 fade(ribSmall.material,.32*r.small*r.fade);fade(ribLarge.material,.32*r.large*r.fade);ribSmall.material.depthWrite=ribLarge.material.depthWrite=false;
 // The nascent peptide leaves the large subunit's exit tunnel.
 ribosome.updateMatrixWorld();const L=Math.round(40*r.peptide);if(L>1){for(let i=0;i<L;i++){const u=i/39;_e.set(18*Math.sin(u*7),150+95*u+30*r.split*(1-u),14*Math.cos(u*5)+60*r.split).applyMatrix4(ribosome.matrixWorld);peptide.points[i].copy(_e)}peptide.update(L);fade(peptide.material,r.fade)}else peptide.update(0);
 // KOW: turn from its resting direction towards the small subunit's near side (schematic reach).
 if(r.kow>.001){_rq.copy(ribosome.quaternion);_e.set(0,4,0).applyQuaternion(_rq).add(ribosome.position).addScaledVector(_rw,-20);nusG.updateMatrixWorld();nusG.worldToLocal(_e);_e.sub(kowPivot.position).normalize();_kq.setFromUnitVectors(kowRest,_e);kowPivot.quaternion.slerp(_kq,r.kow*.85)}
}
// Base letters (Sequence mode, close-ups only): template and coding bases around the bubble and the RNA
// in the hybrid, each set just inside its strand so it reads against the base pair.
function updateLetters(S){
 const show=seqW>.5&&pxPerA>1.1&&S.time>=34;let k=0;const route=S.path||'rho',put=(p,ch)=>{if(k>=letters.length)return;const sp=letters[k++];sp.material=sp.userData.glyphs[ch];sp.position.copy(p);sp.scale.setScalar(Math.max(3,9/pxPerA));sp.visible=true};
 if(show){for(let b=-12;b<=6;b++){const n=Math.round(b+registerAt(b,S));dnaPoint(0,b,S,_p);dnaPoint(1,b,S,_q);_m.addVectors(_p,_q).multiplyScalar(.5);
     const open=openAt(b,S)*smooth((b-BUBBLE_UP)/1.5)*smooth((BUBBLE_DN-b)/1.5);put(_e.copy(_p).lerp(_m,.35),templateBase(n,route));if(open<.5||b>1)put(_f.copy(_q).lerp(_m,.35),coding(n,route))}
   for(let j=Math.max(0,Math.ceil(S.register-8));j<=Math.floor(S.ntCount-1)&&k<letters.length;j++){const w=paired(j-S.register,S);if(w<.3&&j<S.register)continue;rnaSample(j,_p);dnaPoint(0,j-S.register,S,_q);put(_e.copy(_p).lerp(_q,.3),j===ERROR.j&&S.error>.5?ERROR.wrong:rnaBase(j,route))}}
 for(;k<letters.length;k++)letters[k].visible=false;
}
// Released abortive RNAs and the cleaved backtracked 3′ end leave through the secondary channel.
function updateFragment(S){
 const fr=S.fragment;fragmentGroup.visible=!!fr&&fr.fade>.01;if(!fragmentGroup.visible)return;
 const first=fr.offsets[0]+fr.shift,final=fr.offsets.at(-1)+fr.shift;let c=0;
 for(let x=first;c<fragmentTube.points.length;x+=1/3){const b=Math.min(x,final);trackPoint(rnaTrack,EXIT,b,fragmentTube.points[c++]).addScaledVector(D,S.distance);if(b>=final)break}
 fragmentTube.update(c);fade(fragmentTube.material,fr.fade);fade(fragmentStubs.material,fr.fade);
 fr.offsets.forEach((o,i)=>{const b=o+fr.shift;trackPoint(rnaTrack,EXIT,b,_p).addScaledVector(D,S.distance);trackPoint(rnaTrack,EXIT,b+.3,_e);trackPoint(rnaTrack,EXIT,b-.3,_f);_g.subVectors(_e,_f).normalize();freeStub(i,_p,_g,3.6,_q);
   const w=paired(b,S)*(1-ramp(fr.shift,0,2));if(w>0){dnaPoint(0,b,S,_m);_m.add(_p).multiplyScalar(.5);_q.lerp(_m,w)}halfRung(fragmentStubs,i,_p,_q,.55,1);fragmentStubs.setColorAt(i,S.error>.02&&i===fr.offsets.length-1?ERROR_COLOR:BASE_COLOR)});
 fragmentStubs.instanceColor.needsUpdate=true;
 for(let i=fr.offsets.length;i<12;i++)halfRung(fragmentStubs,i,_p,_p,0,0);finish(fragmentStubs);
}
function updateNucleotide(S){
 const t=S.time,a=S.addition,base=_g.copy(D).multiplyScalar(S.distance),site=ramp(t,107.4,108.4)*(1-ramp(t,HAIRPIN_PAUSE.start,HAIRPIN_PAUSE.start+1.2));
 const mgShow=Math.max(site,smooth((cutAmount-.4)/.5)*(S.release<.5?1:0));mg.visible=mgShow>.01;mg.position.copy(base);fade(mg.material,mgShow);
 const cleave=S.cleavage;let pulse=cleave;
 ntp.visible=ppi.visible=!!a;
 if(a){
   const wrong=a.cycle===ERROR.cycle,f=a.f,travel=1-Math.pow(1-clamp(f/.4),2.2),dock=ramp(f,.28,.42),b=mix(15,1,travel),wobble=(calm?.25:1)*(1-(wrong?.5:1)*dock),w=t*2.3+a.cycle*1.7;
   if(wrong!==ntpWrong){ntpWrong=wrong;const c=wrong?ERROR_RED:RNA;ntpParts.base.color.setHex(c);ntpParts.base.emissive.setHex(c)}
   trackPoint(rnaTrack,EXIT,b,ntp.position).add(base);trackPoint(rnaTrack,EXIT,b-.1,_e);trackPoint(rnaTrack,EXIT,b+.1,_f);_q1.setFromUnitVectors(inwardSite,_e.sub(_f).normalize());
   _eu.set(.9*wobble*Math.sin(w)+(wrong?.44*dock:0),.9*wobble*Math.cos(w*1.3),.6*wobble*Math.sin(w*.7));ntp.quaternion.copy(_q1).multiply(_q2.setFromEuler(_eu));
   ntp.position.add(_p.set(Math.sin(w*1.9),Math.cos(w*1.4),Math.sin(w*2.3)).multiplyScalar(2.2*wobble));
   const appear=ramp(f,0,.07),merge=1-ramp(f,.52,.6);fade(ntpParts.base,appear*merge);fade(ntpParts.sugar,appear*merge);fade(ntpParts.alpha,appear*merge);fade(ntpParts.bond,appear*merge);fade(ntpParts.bridge,appear*(1-ramp(f,.5,.56)));
   if(f<.56){ppi.position.copy(ntpBeta).applyQuaternion(ntp.quaternion).add(ntp.position);ppi.quaternion.copy(ntp.quaternion)}
   else{const u=ramp(f,.58,.9);trackPoint(rnaTrack,EXIT,mix(1.48,16,u),ppi.position).add(base);_eu.set(u*4.1,u*2.7,u*1.9);ppi.quaternion.copy(ntp.quaternion).multiply(_q2.setFromEuler(_eu))}
   fade(ntpParts.ppi,appear*(1-ramp(f,.8,.9)));pulse=Math.max(pulse,(wrong?.5:1)*Math.sin(Math.PI*ramp(f,.47,.63)));
 }
 // Trigger loop folds onto the paired NTP (only halfway onto the wrong one) and opens before RNAP steps.
 const fold=a?ramp(a.f,.28,.42)*(1-ramp(a.f,.62,.74))*(a.cycle===ERROR.cycle?.5:1):0,tlShow=site;triggerLoop.mesh.visible=bridgeHelix.visible=tlShow>.01;
 if(tlShow>.01){tlTip.lerpVectors(tlOpen,tlClosed,fold);const nN=traces.triggerLoopN.length;tlPoints[nN].copy(tlTip).lerp(tlPoints[nN-1],.45);tlPoints[nN+1].copy(tlTip);tlPoints[nN+2].copy(tlTip).lerp(tlPoints[nN+3],.45);
   for(let i=0;i<48;i++)tlCurve.getPoint(i/47,triggerLoop.points[i]).add(base);triggerLoop.update(48);fade(triggerLoop.material,tlShow);bridgeHelix.position.copy(bridgeHelix.userData.centre).add(base);fade(bridgeHelix.material,.4*tlShow);tlTip.add(base)}else triggerLoop.update(0);
 const pool=ramp(t,107.4,108.6)*(1-ramp(t,120.6,121.6));ntpPool.visible=pool>.01;
 if(ntpPool.visible){trackPoint(rnaTrack,EXIT,18,_p).add(base);for(let i=0;i<16;i++){const h=k=>Math.sin(i*12.9898+k*78.233)*43758.5453%1,r=12+22*Math.abs(h(1));_e.set(h(2),h(3),h(4)).normalize().multiplyScalar(r);_e.x+=4*Math.sin(t*.7+i);_e.y+=4*Math.cos(t*.6+i*1.3);_e.z+=3*Math.sin(t*.5+i*2.1);dummy.position.copy(_p).add(_e);dummy.rotation.set(t*.4+i,t*.3+i*2,i);dummy.scale.setScalar(pool);dummy.updateMatrix();ntpPool.setMatrixAt(i,dummy.matrix)}ntpPool.instanceMatrix.needsUpdate=true}
 flash.visible=pulse>.01;
 if(flash.visible){trackPoint(rnaTrack,EXIT,a?.6:.5,flash.position).add(base);flash.scale.setScalar(1.2+(calm?.4:1.7)*pulse);flash.material.opacity=(calm?.3:.75)*pulse;mg.material.emissiveIntensity=.5+1.2*pulse}
}
// Screen pixels per ångström at the orbit target: strand widths and fades depend on it.
const prevCore=V(),_ride=V();let coreKnown=false;
function viewScale(){return innerHeight/(2*camera.position.distanceTo(controls.target)*Math.tan(camera.fov*DEG/2))}
function updateMolecules(){
 const S=state,t=S.time;corePos.copy(actorPosition(S));core.position.copy(corePos);
 // While exploring, the camera rides along with the complex, so scrubbing keeps RNAP in view.
 if(exploring&&coreKnown){_ride.subVectors(corePos,prevCore);if(_ride.lengthSq()>1e-8){camera.position.add(_ride);controls.target.add(_ride)}}prevCore.copy(corePos);coreKnown=true;
 // Keep strands at least ~1.6 px (DNA) and 2 px (RNA) wide in wide shots.
 pxPerA=viewScale();
 for(const tb of dnaTubes)tb.radius=minRadius(tb.base,pxPerA);rnaTube.radius=minRadius(rnaTube.base,pxPerA,1);
 strandOutlines.forEach(o=>o.width=outlineWidth(pxPerA));rnaOutline.width=outlineWidth(pxPerA,.35);
 // The core assembles in the known order α₂ → α₂β → α₂ββ′ω (timings illustrative); each subunit
 // drifts in from 70 Å and carries an anatomy tint until 12 s.
 coreMeshes.forEach(m=>{const [t0,t1]=ASSEMBLY[m.userData.chain],arrive=ramp(t,t0,t1);m.position.copy(m.userData.out).multiplyScalar(70*(1-arrive));m.visible=t>=t0-1});
 // σ70 joins the core, then is released as RNAP escapes; it drifts off rather than vanishing.
 if(t<9)sigma.position.copy(sigmaPool);else if(t<SEARCH.land[0]){const u=ramp(t,9,14.5);sigma.position.lerpVectors(sigmaPool,corePos,u);sigma.position.z-=SIGMA_ARC*Math.sin(Math.PI*u)}else if(t<78)sigma.position.copy(corePos);else sigma.position.lerpVectors(corePos,sigmaRelease,ramp(t,78,86));
 const sigmaShow=1-ramp(t,87,91);sigma.visible=sigmaShow>.01;
 const hairpinFocus=S.path==='intrinsic'&&!exploring?Math.max(ramp(t,142,146),ramp(t,TERMINATOR_ZONE.intrinsic.show[2],TERMINATOR_ZONE.intrinsic.show[3])*(1-ramp(t,144,146)))*(1-ramp(t,153.5,157)):0,factors=factorPresence(t,S.path);
 // The pause hairpin folds inside the exit channel: RNAP and NusG fade so it and NusA stay visible.
 const pauseFocus=exploring?0:ramp(t,HAIRPIN_PAUSE.start+.4,HAIRPIN_PAUSE.fold[0]+.4)*(1-ramp(t,HAIRPIN_PAUSE.resume,HAIRPIN_PAUSE.resume+1));
 // Elongation factors glow while they are doing their job on screen.
 const glow=(mesh,k)=>{mesh.material.emissiveIntensity=k*(calm?.27:.2+.13*Math.sin(t*5.2))};
 nusA.visible=factors.nusA>.01;nusA.position.copy(corePos).addScaledVector(nusAApproach,70*(1-factors.nusA));fade(nusAMesh.material,factors.nusA*(1-.72*hairpinFocus-.55*pauseFocus));glow(nusAMesh,factors.nusAActive);
 nusG.visible=factors.nusG>.01;nusG.position.copy(corePos).addScaledVector(nusGApproach,60*(1-factors.nusG));fade(nusGMesh.material,factors.nusG*(1-.96*hairpinFocus-.85*pauseFocus));glow(nusGMesh,factors.nusGActive);
 rho.visible=S.rhoVisible;
 if(S.rhoVisible){
   const index=S.rhoIndex,p=rnaPoint(index,S,_p),tangent=rnaPoint(Math.min(S.ntCount-1,index+1),S,_rhoT).sub(rnaPoint(Math.max(0,index-1),S,_e)).normalize();
   rhoQuaternion.setFromUnitVectors(rhoAxis,tangent);
   const target=_rhoTarget.copy(D).multiplyScalar(S.distance).add(rhoNative).addScaledVector(RNA_RELEASE,S.release);
   rhoPos.copy(p).lerp(target,S.rhoEngage);rho.position.copy(rhoPos);
   rho.quaternion.copy(rhoQuaternion).slerp(new THREE.Quaternion(),S.rhoEngage);
   const arrival=ramp(t,136,143),leave=ramp(t,198.5,201);rho.position.y-=80*(1-arrival);rho.position.addScaledVector(rhoPos.clone().sub(corePos).normalize(),45*leave);rhoMeshes.forEach(m=>{fade(m.material,arrival*(1-leave));m.material.emissive.setHex(0x432450);m.material.emissiveIntensity=t>=146&&t<188?(calm?.14*Math.max(0,Math.cos(Math.PI*2*(t/3-m.userData.rhoIndex/6)))**4:((Math.floor(t*2)%6)===m.userData.rhoIndex)?.14:0):0});
 }
 const autoCut=cutawayAt(t,S.path);
 // A manual cutaway choice lasts only for the chapter in which it was made.
 if(manualCut!==null&&S.chapter!==manualCutChapter)manualCut=null;
 const cut=manualCut===null?clamp(autoCut):(manualCut?1:0);cutAmount=cut;if(cutPressed!==(cut>.5)){cutPressed=cut>.5;$('cutaway').setAttribute('aria-pressed',String(cutPressed))}
 channels.visible=showParts&&(cut>.5||exploring)&&t>=44;if(channels.visible)channelTime.value=t;
 // During the search the core and σ tilt about the DNA channel to lie along the other segment.
 searchTilt(S,_tilt);core.quaternion.copy(_tilt);core.position.copy(corePos).add(DNA0).sub(_pivot.copy(DNA0).applyQuaternion(_tilt));if(t>=SEARCH.land[0]&&t<78){sigma.quaternion.copy(_tilt);sigma.position.copy(core.position)}else sigma.quaternion.identity();
 searchGroup.visible=t>=DNA_IN[0]&&t<30;
 // The looped segment is the same molecule, so it is drawn like the promoter DNA: the same fade, outline and radii.
 if(searchGroup.visible){const f=dnaIn(t)*(1-ramp(t,27,30)),rf=smooth((pxPerA-.35)/.4);
   searchParts.strands.forEach((tb,k)=>{const h=searchParts.hulls[k],r=minRadius(tb.base,pxPerA);h.width=outlineWidth(pxPerA);if(Math.abs(tb.radius-r)>.02){tb.radius=r;tb.update(tb.count)}fade(tb.material,f);fade(h.material,f)});
   for(const m of searchParts.halves)fade(m.material,f*rf)}
 const settle=ramp(t,9,12),arriving=m=>clamp(t-ASSEMBLY[m.userData.chain][0]+1);
 // As each subunit joins the core its rim glows for a few seconds, so its name tag is easy to find the first time.
 const joinGlow=m=>{const s0=ASSEMBLY[m.userData.chain][0];return ramp(t,s0+.2,s0+.8)*(1-ramp(t,s0+2.6,s0+3.6))};
 coreMeshes.forEach(m=>{const u=m.material.userData.uniforms;u.uRim.value=.2+1.1*joinGlow(m);u.uCut.value=cut;u.uCapOn.value=m.material.opacity>.999?1:0;m.material.color.copy(_tint.setHex(TINT[m.userData.chain]).multiplyScalar(PROTEIN_TONE)).lerp(m.material.userData.base,settle).multiplyScalar(1-.25*cut);fade(m.material,Math.min(arriving(m),1-.94*hairpinFocus-.9*pauseFocus));const planes=cut>.001?CLIP:NONE;if((m.material.clippingPlanes?.length||0)!==planes.length){m.material.clippingPlanes=planes;m.material.needsUpdate=true}});
 fade(sigmaMesh.material,sigmaShow*(1-.6*cut*(t<72?1:0)));
 {const u=nusGMesh.material.userData.uniforms,planes=cut>.001?CLIP:NONE;u.uCut.value=cut;u.uCapOn.value=nusGMesh.material.opacity>.999?1:0;if((nusGMesh.material.clippingPlanes?.length||0)!==planes.length){nusGMesh.material.clippingPlanes=planes;nusGMesh.material.needsUpdate=true}}
 // Ambient occlusion fades out as a cut, a focus fade or the ribosome begins (it would shade what they reveal),
 // rather than switching in one frame.
 const aoWeight=(1-smooth(Math.max(cut,hairpinFocus,pauseFocus)/.08))*(1-smooth((couplingAt(t)?.fade??0)/.08));
 aoAllowed=aoWeight>.004&&!(spotlight&&performance.now()<spotlightUntil);pipeline?.setOcclusion(aoWeight,aoAllowed);
 // Closed surfaces need back faces only where the cutaway exposes them or they are see-through.
 for(const m of surfaceMeshes){const mat=m.material,side=mat.clippingPlanes?.length?THREE.DoubleSide:THREE.FrontSide;if(mat.side!==side){mat.side=side;mat.needsUpdate=true}}
 const rhoCut=manualCut===true&&S.rhoVisible;rhoMeshes.forEach(m=>{const p=rhoCut?[rhoPlane]:[];if((m.material.clippingPlanes?.length||0)!==p.length){m.material.clippingPlanes=p;m.material.needsUpdate=true}});
 seqW=sequenceWeight(t,S.path);updateDNA(S);updateRNA(S);updateFragment(S);updateNucleotide(S);updateLetters(S);updateRibosome(S);
 errorBead.visible=S.error>.02;if(errorBead.visible){if(S.fragment&&S.time>=BACKTRACK.cleave)trackPoint(rnaTrack,EXIT,S.fragment.offsets.at(-1)+S.fragment.shift,errorBead.position).addScaledVector(D,S.distance);else rnaPoint(ERROR.j,S,errorBead.position);errorBead.scale.setScalar(S.error);fade(errorBead.material,S.fragment?S.fragment.fade:1)}
 rutTube.mesh.visible=S.path==='rho'&&t>=136&&t<184;if(rutTube.mesh.visible){for(let i=0;i<181;i++)rnaSample(RUT_START+i/3,rutTube.points[i]);rutTube.update(181)}else rutTube.update(0);
 // The rut site glows before Rho lands on it, then fades as Rho binds.
 const rg=S.path==='rho'&&!!path?pulse(t,136.2,137.2,142.4,144.8):0;rutGlow.material.uniforms.uAmount.value=rg;rutTube.material.emissiveIntensity=.035+.6*rg;
 if(rg>.01){for(let i=0;i<121;i++)rnaSample(RUT_START+i/2,rutGlow.points[i]);rutGlow.update(121)}else rutGlow.update(0);
 // The stem segment is highlighted from the moment the terminator is transcribed.
 const stemState=activeStem(S),terminatorMade=S.path==='intrinsic'&&t>=CHOICE_TIME?clamp((S.ntCount-362)/6):0,highlight=stemState?Math.max(clamp(stemState[1]*3),terminatorMade):terminatorMade;
 hairpinGroup.visible=highlight>.02;
 if(hairpinGroup.visible){
   const [h,amount]=stemState||[TERMINATOR,0],[start,end]=stemRange(h,h===TERMINATOR?TRANSCRIPT.intrinsic:S.ntCount),made=Math.min(end,S.ntCount-1);let c=0;
   for(let k=0;start+k/3<=made+1e-6&&c<stemTube.points.length;k++)rnaSample(start+k/3,stemTube.points[c++]);stemTube.update(c);fade(stemTube.material,highlight);
   for(let i=0;i<9;i++){if(i<h.pairs&&amount>0)between(hairpinBonds,i,rnaSample(start+i,_p),rnaSample(end-i,_q),.55,zipAt(amount,i,h));else halfRung(hairpinBonds,i,_p,_p,0,0)}finish(hairpinBonds);
   utract.visible=h===TERMINATOR&&amount>0;if(utract.visible){for(let i=0;i<7;i++)point(utract,i,rnaSample(S.ntCount-7+i,_p),1.6);finish(utract)}
 }
 const dnaFade=dnaIn(t)*(1-.8*hairpinFocus-.55*pauseFocus),rungFade=smooth((pxPerA-.35)/.4);[dnaTubes[0].material,dnaTubes[1].material,...strandOutlines.map(o=>o.material)].forEach(m=>fade(m,dnaFade));[rungs[0].material,rungs[1].material].forEach(m=>fade(m,dnaFade*rungFade));
 // The strands' 5′→3′ arrowheads fade in with them (they showed as dots before the DNA arrived).
 for(const m of [polarity[0],polarity[1]]){m.visible=dnaFade>.01;fade(m.material,dnaFade)}
 fade(rnaTube.material,1);fade(rnaOutline.material,1);fade(rnaStubs.material,1);fade(polarity[2].material,1);dimForSpotlight();
 // Cross-section caps only on opaque surfaces: read the final opacity, after any spotlight dimming.
 for(const m of surfaceMeshes){const u=m.material.userData.uniforms;if(u)u.uCapOn.value=m.material.opacity>.999?1:0}
}

// Clip planes face the camera, so they are placed after the camera has moved for this frame.
function updateClipping(){const view=_clipView.subVectors(camera.position,controls.target).normalize();clipPlane.normal.copy(view).negate();clipPlane.constant=view.dot(_clipAt.copy(corePos).add(CLIP_OFFSET))+mix(160,-1,cutAmount);rhoPlane.normal.copy(view).negate();rhoPlane.constant=view.dot(rhoPos)}
// Guided camera: a timeline of shots. Each shot frames its subject with a slow orbit (yaw, in
// degrees) and push-in or pull-out; consecutive shots cross-fade with an eased blend that starts a
// little before the new chapter. Everything is a function of animation time, so playback,
// scrubbing and every speed give the same smooth motion.
const DEG=Math.PI/180,softMax=(a,b,k)=>(a+b+Math.hypot(a-b,k))/2;
// Quintic ease: velocity and acceleration both start and end at zero, so blends never jolt.
const ease=quintic;
const framing=(target,offset,yaw,dist)=>({target,offset,yaw,dist});
// Lens per shot. Distances are written for a 36° lens and rescaled, so a narrower lens keeps the
// subject's size with flatter, calmer perspective. The anchor is where the subject sits on screen:
// right of the chapter list and above the narration.
const CLOSE={fov:26},WIDE={fov:30,wide:true};
const COMMON_SHOTS=[
 {start:0,blend:0,fit:true,frame:(S,u)=>framing(V(-160,5,-15).lerp(V(-105,0,-10),smooth(u)),V(110,175,-635),mix(-8,6,u),mix(800,680,u))},
 // The search opens wide and to the left, where the other segment loops round to join the promoter DNA.
 {start:SEARCH.land[0],blend:2.4,frame:(S,u,p)=>{const w=1-smooth((u-.14)*2.6);return framing(p.add(V(-40-140*w,20+30*w,-20)),V(70,165,-420),mix(7,-5,u),mix(590,470,u)+420*w)}},
 // The promoter on its own while RNAP waits just upstream: −35 to +1 across the frame, RNAP at its left edge.
 {start:SEARCH.wait[0],blend:2.6,...CLOSE,frame:(S,u)=>{frameAt(materialToB(-24,S),S.grip,S);return framing(_a.clone().add(V(0,8,0)),V(30,90,-430),mix(-6,5,u),mix(470,440,u))}},
 {start:SEARCH.approach[0],blend:2.4,frame:(S,u,p)=>framing(p.add(V(-40,20,-20)),V(70,165,-420),mix(3,-5,u),mix(520,450,u))},
 // Isomerisation, in cutaway and from above, so the bend lies in the picture plane: the downstream DNA turns into
 // the cleft and the strained helix begins to unwind.
 {start:BEND.chapter,blend:2.8,...CLOSE,frame:(S,u,p)=>framing(p.add(V(-12,-14,-26)),V(20,-150,-120),mix(-6,4,u),mix(265,225,u))},
 {start:44,blend:2.2,...CLOSE,frame:(S,u,p)=>framing(p.add(V(-13,-13,-9)),V(20,45,-165),mix(-7,7,u),mix(180,164,u))},
 {start:72,blend:2.2,frame:(S,u,p)=>framing(p.add(V(-30,-30,-20)),V(110,135,-450),mix(5,-8,u),mix(460,520,u))},
 {start:ELONGATION.factors,blend:2.2,frame:(S,u,p)=>framing(p.add(FACTOR_TARGET),FACTOR_VIEW,mix(5,-35,u),mix(495,455,u))},
 // Frames the whole transcript, from its 5′ end to RNAP, to the right of the chapter list.
 // While the coupled ribosome is on screen the shot rises and widens to keep it in frame.
 {start:ELONGATION.wide,blend:4.5,...WIDE,frame:(S,u)=>{const w=smooth(u),r=couplingAt(S.time),rv=r?Math.min(r.small,r.fade):0,d=softMax(495,S.distance*1.75+400,100)*(1+.3*rv);return framing(D.clone().multiplyScalar(S.distance*.5+55-.073*d).add(V(0,-50-95*rv,-20)),V(130,-mix(130,440,w),-mix(460,1460,w)),mix(-4,4,u),d)}},
 {start:ELONGATION.end,blend:4.2,...CLOSE,frame:(S,u,p)=>framing(p.add(V(6,-10,-10)),SITE_VIEW,mix(-4,3,u),mix(180,170,u))},
 {start:BACKTRACK.start,blend:1.6,...CLOSE,frame:(S,u,p)=>framing(p.add(V(10,-4,-10)),SITE_VIEW,mix(3,-3,u),mix(188,180,u))},
 {start:HAIRPIN_PAUSE.start,blend:3.2,...CLOSE,frame:(S,u,p)=>framing(p.add(PAUSE_TARGET),PAUSE_VIEW,mix(-5,4,u),mix(190,168,u))}
];
const ENDING_SHOTS={
 rho:[
   {start:CHOICE_TIME,lead:0,blend:3.6,...WIDE,frame:(S,u,p)=>{const r=S.rhoVisible?rhoPos:p,mid=r.clone().add(p).multiplyScalar(.5),d=softMax(540,r.distanceTo(p)*1.75+220,90),offset=V(100,-Math.max(220,d*.29),-d),z=TERMINATOR_ZONE.rho.show,ahead=ramp(S.time,z[0]-1.2,z[0])*(1-ramp(S.time,z[3],z[3]+1.6));return framing(mid.add(V(0,-15,-10)).addScaledVector(D,-.07*d+110*ahead),offset,mix(0,-35,u),offset.length())}},
   {start:180,blend:3.6,frame:(S,u,p)=>framing(p.add(V(-25,-48,-15)),V(-155,145,-420),mix(20,32,u),mix(490,430,u))},
   {start:190,blend:4,...WIDE,frame:(S,u)=>framing(D.clone().multiplyScalar(S.distance*.67).add(V(0,-60,-10)),V(150,-460,-1550),mix(-10,25,u),mix(1620,1720,u))},
   {start:200,blend:4,frame:(S,u,p)=>framing(p.add(V(-30,-30,-15)),V(90,170,-440),mix(-20,0,u),mix(480,420,u))}
 ],
 intrinsic:[
   {start:CHOICE_TIME,lead:0,blend:2.4,frame:(S,u,p)=>{const w=1-smooth((S.time-TERMINATOR_ZONE.intrinsic.show[2])/1.6);return framing(p.add(V(-20,-25,-8)).addScaledVector(D,70*w),V(40,70,-220),mix(-5,4,u),mix(245,225,u)+90*w)}},
   {start:142,blend:2.2,...CLOSE,frame:(S,u,p)=>framing(p.add(TERMINATOR_TARGET),TERMINATOR_VIEW,mix(5,-12,u),mix(176,158,u))},
   {start:154,blend:4,...WIDE,frame:(S,u)=>framing(D.clone().multiplyScalar(S.distance*.63).add(V(0,-55,-10)),V(140,-400,-1480),mix(25,35,u),mix(1540,1640,u))},
   {start:166,blend:4,frame:(S,u,p)=>framing(p.add(V(-30,-30,-15)),V(90,170,-440),mix(-20,0,u),mix(480,420,u))}
 ]
};
function shotPose(list,i,S,p=corePos){
 const shot=list[i],next=list[i+1]?.start??endTime(S.path),t=S.time,u=calm?.5:Math.max(-.5,Math.min(1.5,(t-shot.start)/(next-shot.start)));
 const v=shot.frame(S,u,p.clone());
 // A slow, low-amplitude drift keeps even held shots alive (none with reduced motion).
 const drift=calm?0:1,yaw=v.yaw+drift*(.9*Math.sin(t*.31)+.4*Math.sin(t*.83+2)),pitch=drift*(.7*Math.sin(t*.27+1)+.3*Math.sin(t*.71));
 const dir=v.offset.clone().normalize().applyAxisAngle(up,yaw*DEG),side=V().crossVectors(up,dir);if(side.lengthSq()>1e-6)dir.applyAxisAngle(side.normalize(),pitch*DEG);
 // Portrait screens see less sideways, so wide shots (and the opening pair, σ beside the core) pull back to fit.
 const fov=shot.fov||36,portrait=shot.wide||shot.fit?Math.min(2.2,Math.max(1,(1.5*innerHeight/innerWidth)**.8)):1;return {target:v.target,dir,dist:v.dist*portrait*Math.tan(18*DEG)/Math.tan(fov/2*DEG),fov,anchor:screenAnchor(shot.wide)};
}
// Blends move in azimuth and elevation around the teaching vertical (world −y: the RNA exits up). A swing of more than about 100° arcs
// over the top of the scene (a crane move) instead of passing along the DNA axis.
function blendPose(a,b,w){return blendCamera(a,b,w,{calm})}
function guidePose(S){
 const list=[...COMMON_SHOTS,...ENDING_SHOTS[S.path]],t=S.time,blend=s=>calm?Math.min(s.blend,1.2):s.blend,lead=s=>blend(s)*(s.lead??.35);
 // Reduced motion: a large change of view becomes a short dip-to-dark cut at the shot start, timed by
 // animation time so scrubbing matches; other blends are shortened to at most 1.2 s.
 const cut=k=>calm&&k>0&&bigMove(list,k,S.path);let i=0;dipAmount=0;
 for(let k=1;k<list.length;k++){if(t>=list[k].start-(cut(k)?0:lead(list[k])))i=k;if(cut(k)&&playing)dipAmount=Math.max(dipAmount,.85*(1-clamp(Math.abs(t-list[k].start)/.35)))}
 const shot=list[i],pose=shotPose(list,i,S);if(cut(i))return pose;
 const w=shot.blend?ease((t-shot.start+lead(shot))/blend(shot)):1;
 return w<1&&i>0?blendPose(shotPose(list,i-1,S),pose,w):pose;
}
let dipAmount=0,dipShown=-1,cutPressed=null;const bigCache={};
function bigMove(list,k,route){const key=route+k;if(!(key in bigCache)){const S0=cycleState(list[k].start,route),p=actorPosition(S0),a=shotPose(list,k-1,S0,p),b=shotPose(list,k,S0,p),az=d=>Math.atan2(d.x,d.z);
   bigCache[key]=Math.abs(wrap(az(a.dir)-az(b.dir)))>60*DEG||Math.max(a.dist/b.dist,b.dist/a.dist)>1.8}return bigCache[key]}
let resumeFrom=null,resumeStart=0;
function currentPose(){const d=camera.position.clone().sub(controls.target);return {target:controls.target.clone(),dir:d.clone().normalize(),dist:d.length(),fov:camera.fov,anchor:lensAnchor.slice()}}
let lensAnchor=[.5,.5];
// Shift the frustum so the target lands on its screen anchor, and keep SSAO's copy of the projection in step.
function applyLens(fov,anchor){lensAnchor=anchor;setLens(camera,fov,anchor,pipeline)}
// After the viewer has orbited, ease back to the guided camera instead of jumping.
function resumeGuide(){resumeFrom=currentPose();resumeStart=performance.now();invalidateView()}
function setGuideCamera(){
 if(exploring)return;let pose=guidePose(state);
 if(resumeFrom){const w=ease((performance.now()-resumeStart)/(calm?600:1400));pose=blendPose(resumeFrom,pose,w);if(w>=1)resumeFrom=null}
 if(reading.holdAmp>0){const a=smooth(reading.holdAmp),ph=reading.holdPhase;pose.dir.applyAxisAngle(up,a*1.6*DEG*Math.sin(ph*.42));pose.dir.y+=a*.012*Math.sin(ph*.31+1);pose.dir.normalize()}
 pose.dist*=zoomShown;const dip=+dipAmount.toFixed(3);if(dip!==dipShown){$('dip').style.opacity=dip;dipShown=dip}
 applyLens(pose.fov,pose.anchor);controls.target.copy(pose.target);camera.position.copy(pose.target).addScaledVector(pose.dir,pose.dist);camera.lookAt(pose.target);camera.updateMatrixWorld();
}
// Legend colours for label dots and tags.
const COLOR={terminator:'#ff9a88',rut:'#ffcf7a',ribosome:'#e3d6b8',rnap:'#74bcb2',sigma:'#f094ae',template:'#72cdeb',coding:'#e9e1cf',rna:'#ffa45e',rho:'#9d7cc0',nusA:'#b9d56b',nusG:'#c08a4c',mg:'#c8ffd8',ppi:'#f2c46d',promoter:'#f0a0b4',start:'#dcefff',part:'#cfe3ea',alpha:'#d6c496',beta:'#56c2b1',betaPrime:'#7fa3e3',omega:'#c2bdb2'};
const CHAIN={alphaI:'C',alphaII:'D',beta:'A',betaPrime:'B',omega:'E'};
const ASSEMBLY={C:[0,2.5],D:[0,2.5],A:[2.5,5],B:[5,8],E:[5.5,8]},TINT={C:0xb9a47a,D:0xb9a47a,A:0x2f9e8f,B:0x4a74b8,E:0xa7a39a},_tint=new THREE.Color();
function annotations(dt=1){
 const S=state,t=S.time,p=corePos,wanting=notes===recorder?null:new Set(unread(performance.now())),L=(a,title,sub,color,priority=2)=>notes.label(a,title,sub,{color,priority:priority+(wanting?.has(keyOf('L:'+title))?.5:0),inside:color!==COLOR.rnap&&a.distanceTo(corePos)>2&&a.distanceTo(corePos)<55&&cutAmount<.5&&!S.release}),T=(a,text,color=COLOR.part)=>notes.tag(a,text,{color}),B=(a,b,text)=>notes.bracket(a,b,text);
 const sigmaAt=()=>sigma.position.clone().add(V(...sigmaMesh.userData.center)),tip=()=>rnaPoint(Math.max(0,S.ntCount-1)),base=D.clone().multiplyScalar(S.distance),track=b=>trackPoint(rnaTrack,EXIT,b,V()).add(base);
 const nusAAt=()=>nusA.position.clone().add(V(...nusAMesh.userData.center)),nusGAt=()=>nusG.position.clone().add(V(...nusGMesh.userData.center)),ring=i=>promoterLabels[i].marker.position;
 const stemAt=()=>{const [h]=activeStem(S)||[PAUSE_STEM],[a,b]=stemRange(h,S.ntCount);return rnaPoint(a+h.pairs-1).add(rnaPoint(b-h.pairs+1)).multiplyScalar(.5)};
 const fragmentAt=()=>{const fr=S.fragment;return track((fr.offsets[0]+fr.offsets.at(-1))/2+fr.shift)};
 const coreAt=(key)=>corePos.clone().add(V(...landmarks[key].centroid)).add(CHAIN[key]?chainMesh[CHAIN[key]].position:V());
 const bubbleAt=()=>dnaPoint(0,-4,S,V()).add(dnaPoint(1,-4,S,V())).multiplyScalar(.5);
 const sigmaTags=text=>{if(!detail('sigma')||S.sigmaBound<.5||!sigma.visible)return;const an=accessories.meshes.find(m=>m.group==='sigma').anchors;T(sigma.position.clone().add(V(...an.sigma2)),`σ region 2 · ${text}`,COLOR.sigma);T(sigma.position.clone().add(V(...an.sigma4)),S.grip>.9?'σ region 4 · binds −35':'σ region 4',COLOR.sigma)};

 // Anatomy: inside the enzyme only when the cutaway or Explore reveals it, subunits otherwise.
 const partTags=()=>{
   if(cutAmount>.5||exploring){T(track(13),'Secondary channel · NTPs enter');frameAt(8,S.grip,S);T(_a.clone(),'Main channel · DNA');
     if(S.ntCount>1)T(coreAt('rudder'),'Rudder');if(S.ntCount>=16)T(rnaPoint(S.register-14),'RNA exit channel');if(S.open>.5)T(dnaPoint(0,1,S,V()),'Template turns ≈90°');
     if(detail('site')){T(corePos,'Active-site Mg²⁺',COLOR.mg);T(coreAt('bridgeHelix'),'Bridge helix')}}
   else if(detail('parts')){T(coreAt('beta'),'β',COLOR.beta);T(coreAt('betaPrime'),'β′',COLOR.betaPrime);T(coreAt('omega'),'ω',COLOR.omega);T(coreAt('alphaI').lerp(coreAt('alphaII'),.5),'α₂',COLOR.alpha)}
 };
 notes.begin();
 if(t<9){
   L(p.clone().add(V(-30,20,-30)),'Core RNA polymerase','α₂ββ′ω',COLOR.rnap,3);L(sigmaAt(),'Free sigma factor','σ70',COLOR.sigma,2);
   // Subunits arrive one group at a time, in the known α₂ → α₂β → α₂ββ′ω order (timings illustrative).
   T(coreAt('alphaI').lerp(coreAt('alphaII'),.5),'α₂ · assembly scaffold',COLOR.alpha);if(t>2.5)T(coreAt('beta'),'β · catalytic',COLOR.beta);if(t>5)T(coreAt('betaPrime'),'β′ · catalytic',COLOR.betaPrime);if(t>5.5)T(coreAt('omega'),'ω · small, not essential',COLOR.omega);
 }
 else if(t<SEARCH.land[0])L(sigmaAt(),'σ70 · promoter specificity','Compared with core: ~1000× weaker binding to random DNA, ~1000× tighter to promoters',COLOR.sigma,3);
 else if(t<44){
   const sr=searchAt(t),waiting=t>=SEARCH.wait[0]&&t<SEARCH.approach[0];
   if(sr&&!waiting){const [title,sub]=t<SEARCH.land[1]?['Non-specific binding','RNAP can bind DNA anywhere']:t<SEARCH.slide[1]?['Sliding','One-dimensional diffusion along DNA']:t<SEARCH.hop[1]?['Hopping','Brief release and rebinding nearby']:t<SEARCH.transfer[1]?['Intersegment transfer','Hand-over where two DNA segments pass close']:t<SEARCH.found?['Sliding','Along the promoter DNA']:['Promoter found','RNAP settles on −35 and −10'];notes.label(p,title,sub,{color:COLOR.rnap,priority:3});
     if(sr.segment<.6&&t<SEARCH.transfer[1])T(arcAxis(sr.x-150,V()),'Another stretch of the same DNA',COLOR.part)}
   // RNAP waits just upstream while the promoter itself is shown: what σ is about to recognise.
   if(waiting){L(ring(0),`−35 element · ${codingSeq(-35,-30)}`,'About 35 bp upstream of the start',COLOR.promoter,3);L(ring(1),`−10 element · ${codingSeq(-12,-7)}`,'About 10 bp upstream of the start',COLOR.promoter,3);L(ring(2),'+1 start site','The first base pair transcribed',COLOR.start,3);B(ring(0).clone().add(V(0,17,0)),ring(2).clone().add(V(0,17,0)),'Promoter')}
   else if(t>=SEARCH.approach[0]&&t<BEND.chapter){const docked=S.grip>.9;const read=r=>docked?(detail('sigma')?`Read by σ region ${r}`:'Recognised by σ'):'Promoter element';L(ring(0),`−35 element · ${codingSeq(-35,-30)}`,read(4),COLOR.promoter,3);L(ring(1),`−10 element · ${codingSeq(-12,-7)}`,read(2),COLOR.promoter,3);T(ring(2),'+1 start site',COLOR.start);if(t>=36&&t<BEND.chapter-.3)B(ring(0),ring(1),'17-bp spacer')}
   else if(t>=BEND.chapter){frameAt(-4,S.grip,S);L(_a.clone(),'A sharp bend','RNAP pulls the DNA into its cleft',COLOR.part,3);if(t>=BEND.strain)L(ring(1),'The −10 element unwinds','The bent, strained helix starts to melt here',COLOR.promoter,3);T(ring(2),'+1 start site',COLOR.start)}
   if(t>=34)sigmaTags('binds −10');
 }
 else if(t<72){
   // The bubble keeps one steady name for the whole chapter while it opens (and glows), then the strands are named.
   if(t<56)L(bubbleAt(),'Transcription bubble',t<47?'The DNA opens around the start site':'12–14 bp of DNA held apart',COLOR.template,3);
   if(t>=47&&t<56){L(dnaPoint(0,-7,S,V()),'Template strand','Read 3′ → 5′ · pairs with the RNA',COLOR.template,3);L(dnaPoint(1,-2,S,V()),'Coding (non-template) strand','Same sequence as the RNA, with T for U',COLOR.coding,2)}
   if(S.fragment)L(fragmentAt(),'Short RNA released','RNAP keeps its promoter contacts',COLOR.rna,3);
   else if(S.ntCount>=1)L(tip(),'Short RNA','New RNA grows 5′ → 3′',COLOR.rna,3);
   else if(t<56)L(dnaPoint(0,0,S,V()),'+1 start site','The first RNA nucleotide will pair here',COLOR.start,2);
   if(detail('extra')&&t>=58&&t<70&&S.scrunch>1.5)L(dnaPoint(0,8,S,V()),'DNA scrunching','Downstream DNA pulled in; RNAP stays on the promoter',COLOR.template,1);
   sigmaTags('holds −10 open');if(t>=47&&t<52)partTags();
 }
 else if(t<78)L(p,t<76?'Promoter escape':'Promoter clearance',t<76?'The transcript lengthens':`${S.displayNt} nt · escape at ≈10–12 nt`,COLOR.rnap,3);
 else if(t<ELONGATION.factors){if(t<80)L(p,'Promoter clearance',`${S.displayNt} nt · escape at ≈10–12 nt`,COLOR.rnap,2);if(detail('sigma')&&t>=78&&t<81)T(ring(0),'σ4 lets go of −35',COLOR.sigma);if(t>=78&&t<84)T(sigmaAt(),'Some complexes keep σ',COLOR.sigma);L(sigmaAt(),'σ70 released','Reusable · can bind another core enzyme',COLOR.sigma,3);if(t>=81.5)L(nusAAt(),'NusA binds','Can compete with σ for the core',COLOR.nusA,3)}
 else if(t<ELONGATION.wide){
   L(nusAAt(),'NusA','By the RNA exit · enhances pausing',COLOR.nusA,3);
   if(t>=85.5)L(nusGAt(),'NusG',t<ELONGATION.nusG+.5?'Binds across the DNA channel':'Anti-pausing · fewer, shorter pauses',COLOR.nusG,3);
   L(p,t<ELONGATION.nusG?'Frequent pauses':'Fewer, shorter pauses',`${S.displayNt} nt synthesised`,COLOR.rnap,2);
 }
 else if(t<ELONGATION.end){
   L(p,'RNAP moves downstream',`${S.displayNt} nt synthesised`,COLOR.rnap,3);
   const rib=couplingAt(t),ribAt=()=>ribSmall.getWorldPosition(V());
   if(rib&&rib.fade>.3){
     if(t<95.6)L(ribAt(),'Ribosome binds the RNA','Translation starts while the RNA is still being made',COLOR.ribosome,3);
     else if(rib.j<STOP_CODON-1)L(ribAt(),'Coupled ribosome','Follows RNAP; in cells both move ≈40–50 nt/s',COLOR.ribosome,3);
     else if(t<RIBOSOME.split[0])L(rnaPoint(STOP_CODON+1),'UAA stop codon','Translation ends here',COLOR.ribosome,3);
     else L(ribAt(),'The ribosome splits','Its short peptide is released',COLOR.ribosome,3);
     if(detail('extra')&&rib.kow>.4){T(nusGKow.getWorldPosition(V()),'NusG KOW ↔ ribosome (uS10)',COLOR.nusG);T(nusGAt(),'NusG NGN stays on RNAP',COLOR.nusG)}
     if(rib.peptide>.2&&rib.split<.5)T(peptide.points[Math.min(peptide.count-1,20)],'Nascent peptide','#b9d9a8');
   }else L(rnaPoint(0),'RNA 5′ end','Oldest part of the transcript',COLOR.rna,2);
   if(t<96)L(dnaPoint(0,-60,S,V()),'Template strand','Read 3′ → 5′',COLOR.template,1);
 }
 else if(t<BACKTRACK.pause){
   const a=S.addition,f=a?a.f:1,wrong=a?a.cycle===ERROR.cycle:t>=ADDITION.start+ADDITION.count*ADDITION.cycle,red='#ff6f88';
   if(wrong){if(f<.47){L(ntp.position,'Wrong nucleotide',`${ERROR.wrong} opposite template ${templateBase(ERROR.j)} · U belongs here`,red,3);T(ntp.position,'×',red)}else if(f<.72)L(flash.position,'Misincorporation','Rare · the bond still forms',red,3);else L(tip(),'Mismatched 3′ end','RNAP does not step forward',red,3)}
   else if(!a||f>=.72){L(tip(),'New 3′ end','RNAP translocates 1 bp',COLOR.rna,3);L(dnaPoint(0,1,S,V()),'Next template-strand base','Moves into the active site',COLOR.template,2)}
   else if(f<.47){L(tip(),'RNA 3′–OH','Growing end of the RNA',COLOR.rna,3);L(ntp.position,f<.1&&a.cycle===0?'NTP from the pool':'Incoming NTP','Pairs with the template base',COLOR.rna,3);if(detail('site')&&a.cycle===0&&f>=.3)L(tlTip,'Trigger loop closes','Folds over the paired NTP','#f3e3c2',1)}
   else if(f<.6){L(flash.position,'Phosphodiester bond','3′–OH attacks the α phosphate','#fff0c8',3);L(dnaPoint(0,1,S,V()),'Template base','Paired with the new nucleotide',COLOR.template,2)}
   else{L(tip(),'RNA 3′ end','One nucleotide longer',COLOR.rna,3);L(ppi.position,'Pyrophosphate','β and γ phosphates leave',COLOR.ppi,3);if(detail('site')&&a&&a.cycle===0&&f<.72)L(tlTip,'Trigger loop opens','Lets RNAP step forward','#f3e3c2',1)}
   if(t>=108.5&&t<110)B(dnaPoint(1,-10,S,V()),dnaPoint(1,3,S,V()),'Transcription bubble · 12–14 bp');
   else if(t>=110&&t<113.5)B(track(HYBRID_UP),track(0),'RNA–DNA hybrid · 8–9 bp');
   else if(t>=113.5&&t<116.5)B(rnaPoint(S.ntCount-14),tip(),'RNAP holds the last ≈14 nt');
   if(t>=108.4&&t<111.5)partTags();
 }
 else if(t<HAIRPIN_PAUSE.start){
   const red='#ff6f88',bead=errorBead.position.clone();
   if(t<BACKTRACK.start)L(bead,'RNAP stalls at the error','A mismatched 3′ end is not extended',red,3);
   else if(t<BACKTRACK.end){L(bead,'RNAP slides back 1 bp','The mismatched end enters the secondary channel',red,3);L(dnaPoint(0,-4,S,V()),'Hybrid shifts upstream','One base pair, with the enzyme',COLOR.template,2)}
   else if(t<BACKTRACK.cleave)L(corePos,'The active site cuts the RNA',detail('site')?'Same Mg²⁺ centre, now hydrolysing':'The same active site, now cutting RNA',COLOR.mg,3);
   else if(S.fragment&&t<BACKTRACK.resume+.3){L(fragmentAt(),'Dinucleotide released','It carries the error away',red,3);L(tip(),'Correct 3′ end','Back in the active site',COLOR.rna,3)}
   else L(tip(),'Elongation resumes','Error corrected: proofreading',COLOR.rna,3);
   
 }
 else if(t<CHOICE_TIME){
   const held=t<HAIRPIN_PAUSE.resume;L(nusAAt(),'NusA',S.pauseHairpin>.4?'Stabilises the hairpin · longer pause':'Bound beside the RNA exit',COLOR.nusA,3);
   if(S.pauseHairpin>.2)L(stemAt(),'Pause hairpin','Folds in the RNA exit channel',COLOR.rna,3);
   L(tip(),held?'Paused RNAP':'RNAP resumes',held?'Held while the hairpin is folded':'The hairpin has unfolded',COLOR.rnap,2);
 }
 else if(S.recycling>.02)L(p.clone().add(V(-20,0,-20)),'Released core RNAP','Can bind σ70 for a new round',COLOR.rnap,3);
 else if(S.path==='rho'){
   if(S.release>.05)L(rnaPoint(Math.max(0,S.ntCount-60)),'Released RNA','Transcript separates from the complex',COLOR.rna,3);
   else{if(t<146){L(rnaPoint(RUT_START+30),'rut site','Exposed, C-rich RNA · Rho binds here',COLOR.rut,3);L(t<143?rho.position.clone():rhoPos,t<143?'Rho arrives':'Rho on the rut site','A ring of six subunits',COLOR.rho,3)}else L(rhoPos,S.rhoEngage>.8?'Rho–RNAP contact':'Rho on the RNA',`${Math.max(0,Math.floor(S.rhoIndex-RHO_LOAD))} nt traversed`,COLOR.rho,3);L(p,S.paused?'Paused RNAP':'RNA polymerase',S.rhoEngage>.8?'RNA 3′ end still in the active site':`${Math.max(0,S.displayNt-1-Math.floor(S.rhoIndex))} nt ahead`,COLOR.rnap,3);if(t>=180)L(nusGAt(),'NusG','Bridges Rho and RNAP',COLOR.nusG,2);const z=TERMINATOR_ZONE.rho;if(t>=z.show[0]&&t<z.show[3]-.3)L(terminatorAt('rho'),'Terminator','RNAP pauses in this stretch, where Rho catches up',COLOR.terminator,3)}
 }
 else if(t<TERMINATOR_ZONE.intrinsic.show[3])L(terminatorAt('intrinsic'),'Terminator','A GC-rich inverted repeat, then a run of A on the template',COLOR.terminator,3);
 else{L(rnaPoint(S.ntCount-30).add(rnaPoint(S.ntCount-8)).multiplyScalar(.5),S.hairpin>.3?'GC-rich RNA hairpin':'GC-rich inverted repeat',S.hairpin>.3?'Nine paired positions in the stem':'Transcribed just before the U tract',COLOR.rna,3);if(S.ntCount>=388)L(rnaPoint(S.ntCount-4),'U-rich tract',`${rnaSeq(TRANSCRIPT.intrinsic-7,TRANSCRIPT.intrinsic-1,'intrinsic')} over template A · weak rU·dA pairs`,COLOR.rna,2);if(t<154&&nusA.visible)L(nusAAt(),'NusA','Promotes pausing at the hairpin',COLOR.nusA,2)}
 if(showParts&&!(t>=47&&t<52)&&!(t>=108.4&&t<111.5))partTags();
 return notes.end(camera,innerWidth,innerHeight,dt,playing?speed:1,labels&&!checkpoint);
}
// Visible page chrome, which labels must not cover. Measured on layout changes, never per frame.
// Orientation compass: follows the projected DNA axis; offers the textbook view when orbiting from behind.
let compassState='',keyRNA=null;
// The strand key reads left to right on screen, so viewing from behind swaps each strand's ends.
function strandKey(){const flipped=compassState==='flipped',dir=(a,b)=>flipped?`${b} … ${a}`:`${a} … ${b}`;for(const [cls,a,b] of [['coding','5′','3′'],['template','3′','5′'],['rna','5′','3′']]){const [l,r]=document.querySelectorAll(`#strand-key .${cls} b`);l.textContent=flipped?b:a;r.textContent=flipped?a:b}
 $('strand-key').setAttribute('aria-label',`Strand ends, left to right on screen: coding strand ${dir('5′','3′')}, template strand ${dir('3′','5′')}${keyRNA?`, RNA ${dir('5′','3′')}`:''}`)}
function updateCompass(){
 const el=$('compass'),S=state;if(S.time<SEARCH.land[0]){if(compassState!=='off'){el.hidden=true;compassState='off';relayout()}return}
 const a=corePos.clone().project(camera),b=corePos.clone().addScaledVector(D,60).project(camera),angle=Math.atan2(-(b.y-a.y)*innerHeight,(b.x-a.x)*innerWidth)*180/Math.PI,flipped=Math.abs(angle)>90;
 const next=flipped?'flipped':'ok';if(next!==compassState){el.hidden=false;el.classList.toggle('flipped',flipped);$('compass-text').textContent=flipped?(innerWidth<=600?'Seen from behind':'Viewing from the other side'):'Upstream · Downstream';$('textbook-view').hidden=!flipped;compassState=next;strandKey();relayout()}
 const rnaRow=S.ntCount>=1;if(rnaRow!==keyRNA){keyRNA=rnaRow;$('strand-key-rna').hidden=!rnaRow;strandKey();relayout()}
 $('compass-arrow').style.transform=`rotate(${(flipped?angle-180:angle).toFixed(1)}deg)`;
}
function relayout(){requestAnimationFrame(()=>{if(!notes)return;const nar=document.querySelector('.narration'),card=$('progress-view');if(nar)document.body.style.setProperty('--narr',`${Math.ceil(nar.offsetHeight)}px`);document.body.style.setProperty('--card',`${card.hidden?0:Math.ceil(card.offsetHeight)}px`);notes.layout(['.brand','.chapter-title','.top-controls','#chapters','.narration','#progress-view','.legend','.path-control','.transport','.scene-meta','#compass','#settings','#act-card','#inspector','#description','#next-chip','#key-button','#chapter-name','#checkpoint','#end-card','#glossary'].map(s=>document.querySelector(s)).filter(el=>el&&!el.hidden&&el.getClientRects().length).map(el=>{const r=el.getBoundingClientRect();return {x:r.left,y:r.top,w:r.width,h:r.height}}).filter(r=>r.w>0&&r.h>0));invalidateView()})}
function clock(t){return `${Math.floor(t/60)}:${String(Math.floor(t%60)).padStart(2,'0')}`}
// ---------- Chapters, acts, beats and on-screen text ----------
const CHOICE_CHAPTER={start:CHOICE_TIME,nav:'Termination pathways',topic:'Termination pathways',title:'Two ways<br>to end transcription.',copy:'Choose the ATP-dependent Rho pathway or the RNA hairpin pathway.',notes:'transcription-termination'};
// Chapter copy that refers to the ribosome has a variant for when it is not shown.
const chapterText=c=>!coupling&&c?.copyUncoupled?{...c,copy:c.copyUncoupled}:c;
const plain=html=>html.replace(/<br>/g,' ').replace(/<[^>]+>/g,'').replace(/\s+/g,' ').trim();
const visibleChapters=()=>path?chapterList:[...chapterList.slice(0,commonChapters.length),CHOICE_CHAPTER];
const chapterIndex=()=>!path&&time>=CHOICE_TIME?commonChapters.length:state.chapter;
const currentChapter=()=>visibleChapters()[chapterIndex()];
const durationText=()=>path?clock(endTime(path)):'2:16 + ending';
let copyShown='',beatShown=-1,lastSecond=-1,mapNt=-1,cardShown='',descriptionRoute='rho';
function populateNavigation(){
 chapterList=chaptersFor(path||'rho');
 const visible=visibleChapters(),n=visible.length,route=path||'rho',max=path?endTime(path):CHOICE_TIME;
 // Chapters are grouped by act; on short screens only the current act is expanded.
 let html='',open=false;
 visible.forEach((c,i)=>{const a=ACTS.findIndex(x=>actStart(x,route)===c.start);
   if(a>=0){if(open)html+='</div>';const A=ACTS[a],name=A.numeral==='Prologue'||A.numeral==='Coda'?A.numeral:`Act ${A.numeral}`;html+=`<div class="act" role="group" aria-label="${name}: ${A.title}"><button class="act-head" data-time="${c.start}" aria-label="${name}: ${A.title}, go to its start"><span>${A.numeral}</span> ${A.title}</button>`;open=true}
   html+=`<button class="ch" data-time="${c.start}" aria-label="Chapter ${i+1} of ${n}: ${c.nav}"><span aria-hidden="true">${String(i+1).padStart(2,'0')}</span><b aria-hidden="true">${c.nav}</b></button>`});
 $('chapters').innerHTML=html+(open?'</div>':'');
 $('chapters').querySelectorAll('button').forEach(b=>b.onclick=()=>goChapter(Number(b.dataset.time)));
 // Short screens choose chapters from a list box instead.
 $('chapter-select').innerHTML=visible.map((c,i)=>`<option value="${c.start}">${String(i+1).padStart(2,'0')} · ${c.nav}</option>`).join('');
 $('time').max=max;$('duration').textContent=durationText();
 // Chapters are softly shaded segments of the scrubber.
 $('ticks').innerHTML=visible.map((c,i)=>{const a=c.start/max*100,b=(visible[i+1]?.start??max)/max*100;return `<b style="left:${a.toFixed(2)}%;width:${(b-a).toFixed(2)}%"></b>${i?`<i style="left:${a.toFixed(2)}%"></i>`:''}`}).join('');
 buildDescription();drawCheckpointDots();lastChapter=-1;beatShown=-1;copyShown='';
}
// The text description: every beat as a sentence, grouped by chapter; a line seeks there.
function buildDescription(){
 const route=path||descriptionRoute,beats=beatsFor(route,coupling),groups=chaptersFor(route);
 const line=(b,i)=>`<li><button class="line" data-i="${i}" data-t="${b[0]}"><time>${clock(b[0])}</time><span><b>${b[1]}.</b> ${b[2]}</span></button></li>`;
 let html='';
 groups.forEach((c,k)=>{const end=groups[k+1]?.start??endTime(route);if(!path&&c.start===CHOICE_TIME)html+=`<div class="tabs" role="group" aria-label="Ending to describe">${['rho','intrinsic'].map(r=>`<button data-route="${r}" aria-pressed="${r===route}">${r==='rho'?'Rho-dependent':'Intrinsic'}</button>`).join('')}</div>`;
   const items=beats.map((b,i)=>[b,i]).filter(([b])=>b[0]>=c.start&&b[0]<end);html+=`<h3>${String(k+1).padStart(2,'0')} · ${c.nav}</h3><ol>${items.map(([b,i])=>line(b,i)).join('')}</ol>`});
 const body=$('description-body');body.innerHTML=html;enrichTree(body);
 body.querySelectorAll('.line').forEach(b=>b.onclick=()=>{if(!ready)return;setPlaying(false);if(!path&&Number(b.dataset.t)>=CHOICE_TIME)setPath(descriptionRoute);seekGuarded(Number(b.dataset.t))});
 body.querySelectorAll('.tabs [data-route]').forEach(b=>b.onclick=()=>{descriptionRoute=b.dataset.route;buildDescription();body.querySelector(`.tabs [data-route="${descriptionRoute}"]`)?.focus({preventScroll:true})});
 beatShown=-1;
}
function updateText(){
 const S=state,index=chapterIndex(),c=currentChapter(),n=visibleChapters().length,route=path||'rho';
 if(index!==lastChapter){
   $('beat-number').textContent=String(index+1).padStart(2,'0');$('beat-topic').textContent=c.topic;
   // The author's line breaks become block spans, so the heading's accessible name keeps its spaces.
   $('beat-title').innerHTML=c.title.split('<br>').map(s=>`<span class="l">${s}</span>`).join(' ');enrichTree($('beat-title'));
   const buttons=[...$('chapters').querySelectorAll('button.ch')];$('chapter-select').value=String(visibleChapters()[index].start);$('chapter-name').textContent=c.nav;buttons.forEach((b,i)=>i===index?b.setAttribute('aria-current','step'):b.removeAttribute('aria-current'));
   buttons[index]?.scrollIntoView({block:'nearest',inline:'nearest'});$('chapters').querySelectorAll('.act').forEach(g=>g.classList.toggle('current',!!buttons[index]&&g.contains(buttons[index])));
   if(lastChapter>=0){userZoom=1;announce(!playing||speed<=2?`Chapter ${index+1} of ${n}. ${plain(c.title)} ${copyAt(chapterText(c),time)}`:`Chapter ${index+1}: ${c.nav}`);if(narrate&&playing)sayChapter()}
   lastChapter=index;copyShown='';relayout();postState();
 }
 const copy=copyAt(chapterText(c),time);if(copy!==copyShown){renderCopy($('beat-copy'),copy);copyShown=copy}
 $('time').value=time;$('clock').textContent=clock(time);$('rna-count').textContent=S.displayNt;
 const second=Math.floor(time);if(second!==lastSecond){lastSecond=second;$('time').setAttribute('aria-valuetext',`${clock(time)} of ${durationText()}. Chapter ${index+1} of ${n}: ${c.nav}`)}
 const hideCard=S.time<SEARCH.land[0];if($('progress-view').hidden!==hideCard){$('progress-view').hidden=hideCard;relayout()}
 if(!hideCard){showTab(cardTab(S));if(mapShown==='dna')updateMap(S)}
 // During initiation the card becomes a gauge: short RNAs against the ≈10–12 nt promoter-clearance range.
 const initiating=S.time<ELONGATION.factors;if(initiating!==cardInitiation){cardInitiation=initiating;$('initiation-view').hidden=!initiating;$('transcript-map').style.display=initiating?'none':'';$('card-heading').textContent=initiating?'Initiation':'Transcript'}
 if(initiating){$('init-bar').setAttribute('width',(404*Math.min(20,S.ntCount)/20).toFixed(1));const tally=ABORTIVE.lengths.map((n,k)=>S.time>=ABORTIVE.start+ABORTIVE.round*(k+.64)?`<s>${n}</s>`:S.time>=ABORTIVE.start+ABORTIVE.round*k?`<b>${n}</b>`:`${n}`).join(' · '),html=`Abortive RNAs: ${tally} nt`;if(html!==tallyHTML){$('abortive-tally').innerHTML=html;tallyHTML=html}}
 else{const tens=Math.floor(S.displayNt/10),rib=!!couplingAt(S.time),key=`${tens}${rib?'r':''}${S.rhoVisible?'h':''}`;if(key!==mapNt){mapNt=key;$('transcript-map').setAttribute('aria-label',`Transcript map: about ${tens*10} nucleotides, 5′ end at left, RNA polymerase at the 3′ end${S.rhoVisible?', Rho on the RNA':''}${rib?', a ribosome translating behind RNAP':''}`)}}
 const rhoOn=!!path&&S.rhoVisible;for(const [key,on] of [['sigma',sigma.visible],['rho',rhoOn],['nusA',nusA.visible],['nusG',nusG.visible]]){const el=legendItem[key];if(el&&el.classList.contains('dim')===on)el.classList.toggle('dim',!on)}
 {const rib=couplingAt(S.time),on=!!rib&&rib.fade>.2;$('map-rib').style.display=on?'block':'none';if(on)$('map-rib').setAttribute('transform',`translate(${(18+404*clamp(rib.j/Math.max(1,S.ntCount-1))).toFixed(1)} 0)`);const stop=coupling&&S.ntCount>STOP_CODON+3&&S.time<108;$('map-stop').style.display=stop?'block':'none';if(stop)$('map-stop').setAttribute('transform',`translate(${(18+404*clamp(STOP_CODON/Math.max(1,S.ntCount-1))).toFixed(1)} 0)`)}
 $('map-error').style.display=S.error>.05?'block':'none';if(S.error>.05)$('map-error').setAttribute('transform',`translate(${(18+404*clamp(ERROR.j/Math.max(1,S.ntCount-1))).toFixed(1)} 0)`);$('map-rho').style.display=rhoOn?'block':'none';$('map-rho').setAttribute('cx',18+404*clamp(S.rhoIndex/Math.max(1,S.ntCount-1)));$('map-hairpin').style.display=S.path==='intrinsic'&&S.hairpin>.1?'block':'none';$('rho-distance').textContent=rhoOn?`${Math.floor(S.rhoIndex)+1} / ${S.displayNt} nt`:'';
 $('map-caption').textContent=S.recycling>.02?`At 40–50 nt/s, RNAP makes this ${TRANSCRIPT[S.path]}-nt transcript in about ${Math.round(TRANSCRIPT[S.path]/50)}–${Math.round(TRANSCRIPT[S.path]/40)} s.`:S.release>.05?'The transcript separates from RNA polymerase.':S.rhoEngage>.8?'NusG bridges Rho and RNAP; the RNA 3′ end is still inside the enzyme.':rhoOn&&S.time<146?'Rho loads on the exposed rut site, far behind RNAP.':rhoOn?'Rho advances from the older RNA towards its growing 3′ end.':S.hairpin>.1?'The hairpin forms near the RNA 3′ end, followed by a U-rich tract.':S.pauseHairpin>.1?'Paused: NusA stabilises an RNA hairpin in the exit channel.':S.time>=84&&S.time<88?'Without NusG, RNAP pauses more often.':S.time>=88&&S.time<92?'NusG has bound: fewer pauses, so a higher overall rate.':coupling&&S.time>=93&&S.time<95.6?'A ribosome starts translating while the RNA is still being made.':coupling&&S.time>=95.6&&S.time<RIBOSOME.split[0]?'Coupled: NusG links RNAP to the ribosome behind it.':coupling&&S.time>=RIBOSOME.split[0]&&S.time<RIBOSOME.gone[1]?'The ribosome reached UAA; it releases its peptide and splits.':S.time>=ABORTIVE.start&&S.time<ELONGATION.factors?(S.fragment?'An abortive RNA is released; RNAP stays on the promoter.':S.time>=71?(S.ntCount>=10?'Long enough to clear the promoter (≈10–12 nt).':'This RNA keeps growing towards promoter clearance.'):'Short RNAs are often released: abortive initiation.'):S.ntCount<1?'No RNA yet: RNAP first finds a promoter and opens the DNA.':'The transcript grows as RNAP moves away from the promoter.';
 // The current beat: marked in the text description and optionally read out.
 const bi=!path&&time>=CHOICE_TIME?-1:beatAt(time,route,coupling);
 if(bi!==beatShown){const body=$('description-body');body.querySelector('[aria-current]')?.removeAttribute('aria-current');const el=bi>=0&&(path||descriptionRoute===route||time<CHOICE_TIME)?body.querySelector(`[data-i="${bi}"]`):null;
   if(el){el.setAttribute('aria-current','true');if(followDescription&&!$('description').hidden)el.scrollIntoView({block:'nearest'})}
   if(beatShown>=0&&bi>=0&&announceLines&&playing&&speed<=1.5&&!$('description').hidden)announce(beatsFor(route,coupling)[bi][2],200);beatShown=bi}
 // Act title cards: a pure function of time, so scrubbing shows the same card.
 let best=0,act=null;for(const A of ACTS){if(A.numeral==='III'&&!path)continue;const s=A.card??actStart(A,route),f=actFade(A),o=ramp(time,s,s+.5)*(1-ramp(time,f,f+.5));if(o>best){best=o;act=A}}
 const key=act&&best>.01?act.title:'';if(key!==cardShown){const el=$('act-card');el.hidden=!key;if(act){el.querySelector('span').textContent=act.numeral;el.querySelector('h2').textContent=act.title;el.querySelector('small').textContent=typeof act.sub==='string'?act.sub:act.sub[route]}cardShown=key;relayout()}
 if(key)$('act-card').style.opacity=best.toFixed(3);$('compass').style.opacity=key?(1-best).toFixed(3):'';
 $('next-chip').textContent=nextChipText();
 const atEnd=!!path&&time>=endTime(path)-.05&&!playing;if(atEnd===$('end-card').hidden||atEnd&&endPath!==path)showEnd(atEnd);
}
function render(){composer.render()}
function qualityNote(){const r=renderer.getPixelRatio();$('quality-note').textContent=`${qualityChoice==='auto'?'Auto: ':''}${TIERS[tier].label} · ${Math.round(innerWidth*r)}×${Math.round(innerHeight*r)} px${TIERS[tier].ao?' · ambient occlusion':''}`}
// Reallocates every render target, so it runs only when the tier (or the screen) changes.
function applyTier(name){pipeline.setTier(name);tier=pipeline.tier;document.body.classList.toggle('low-power',tier==='low');qualityNote();invalidate()}
function resize(){snapLabels=true;camera.aspect=innerWidth/innerHeight;pipeline.resize();applyLens(camera.fov,lensAnchor);qualityNote();relayout();invalidate()}
// Startup probe behind the loader: synced frames of a heavy shot at the High tier.
async function probeTier(){
 const keep=[time,path,lastChapter];applyTier('high');path='rho';setTime(60);const choice=await pipeline.measure(renderNow);
 [time,path]=keep;setTime(time);lastChapter=-2;return choice;
}
// Paused on Low: draw one frame with AO and bloom so a still (or a projector screenshot) looks its best.
function refine(){if(looping||!ready||tier!=='low'||renderer.getContext().isContextLost())return;ao.enabled=aoAllowed;bloom.enabled=true;render();ao.enabled=false;bloom.enabled=false}
function setTime(value){reading.reset();const numeric=Number(value);time=Number.isFinite(numeric)?Math.max(0,Math.min(endTime(path),numeric)):0;state=cycleState(time,path||'rho');snapLabels=true;invalidate()}
// Synchronous render, for the diagnostics API and scripted checks.
function renderNow(){if(!ready)return;updateMolecules();updateText();setGuideCamera();updateClipping();annotations(1);updateCompass();render();sceneDirty=viewDirty=false}
// ---------- Playback, holds and the ending choice ----------
const SPEEDS=[.25,.5,1,1.5,2,5];
let resumePlay=false,userZoom=1,zoomShown=1,holdEnds=false,holdFor=null,skipHold=null,loopRange=null,presenting=false,holdBeforePresenting=false,blackout=false;
let narrate=false,speaking=false,waitSpeech=false,speechHold=null,holdAfterSpeech=false,voice=null,pendingTime=null,endAt=null,loopClip=false,clipStart=0,onScreen=true,embed=false,includeCamera=false;
let announceTimer=0,lastAnnounced='',idleTimer=0,followDescription=true,announceLines=false,notesOpener=null,clickTimer=0,motionChoice='auto';
// Seeking at or past the choice with no ending chosen stops at the choice; seeking back closes it.
function seekGuarded(t){skipHold=null;if(narrate&&!playing)speechSynthesis.cancel();
 // A seek away from an open prediction closes it; a seek outside the looped chapter ends the loop.
 if(checkpoint&&Math.abs(t-checkpoint.t)>.01)closeCheckpoint(false);if(loopRange&&(t<loopRange[0]-1e-6||t>=loopRange[1]))setLoop(false,true);
 if(!path&&t>=CHOICE_TIME){pendingTime=Number.isFinite(t)&&t>CHOICE_TIME+.05?t:null;setTime(CHOICE_TIME);showChoice()}else{if(t<CHOICE_TIME){hideChoice();pendingTime=null}setTime(t)}hideContinue();if(!playing){syncURL();playLabel()}}
function playLabel(){$('play-symbol').textContent=playing?'Ⅱ':'▶';$('play-text').textContent=playing?'Pause':!path&&time>=CHOICE_TIME?'Choose ending':'Play the cycle'}
function setPlaying(value,{hold=false}={}){
 if(!value)reading.hideChip();
 if(value&&time>=endTime(path)-1e-6)seekGuarded(0);
 if(value&&!path&&time>=CHOICE_TIME){showChoice();return}
 if(value&&exploring)setExploring(false,false);
 if(value&&holdFor!==null){skipHold=holdFor;hideContinue()}
 if(value&&checkpoint)closeCheckpoint(false);if(value)showEnd(false);
 playing=value;last=performance.now();if(pipeline)pipeline.governor.skip=30;
 // A hold at a chapter end lets the voice finish; only a real pause pauses it.
 if(!value){waitSpeech=false;if(narrate&&!hold)speechSynthesis.pause();syncURL()}else if(narrate&&speechSynthesis.paused)speechSynthesis.resume();
 playLabel();
 document.body.classList.toggle('playing',value);postState();invalidate();
}
function showChoice(){playing=false;document.body.classList.remove('playing');if(time!==CHOICE_TIME)setTime(CHOICE_TIME);const d=$('path-choice');if(!d.open){choiceQuestion();d.showModal();d.querySelector(predict?'#choice-question button':'[data-path]').focus()}$('play-symbol').textContent='▶';$('play-text').textContent='Choose ending'}
function hideChoice(){const d=$('path-choice');if(d.open)d.close()}
function setPath(value,autoplay=false){
 if(value!=='rho'&&value!=='intrinsic'){showChoice();return}
 const previous=path;path=value;setPlaying(false);syncPathControls();hideChoice();populateNavigation();showEnd(false);setLoop(false,true);if(checkpoint?.path)closeCheckpoint(false);
 // Switching endings keeps the viewer at the equivalent stage of the other route; a time asked for before
 // the choice (a deep link past 2:16) is read as a Rho-route time and mapped the same way.
 if(pendingTime!==null){time=Math.min(stageMap(pendingTime,'rho',path),endTime(path)-.1);pendingTime=null}else if(time>=CHOICE_TIME&&previous!==path)time=previous?stageMap(time,previous,path):CHOICE_TIME;
 if(autoplay&&time>=endTime(path)-.05)time=CHOICE_TIME;
 setTime(Math.min(time,endTime(path)));syncURL();if(autoplay){setPlaying(true);$('play').focus()}
}
function syncPathControls(){$('path-more').value=path||'';document.querySelectorAll('.path-control [data-route]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.route===path)))}
function goChapter(t){setPlaying(false);manualCut=null;if(exploring)setExploring(false,false);seekGuarded(t)}
function nudge(dt){setPlaying(false);seekGuarded(time+dt)}
function jumpChapter(dir){const list=visibleChapters(),i=chapterIndex(),c=list[i];let target=dir>0?list[i+1]:time>c.start+1.5?c:list[i-1];if(!target)return;goChapter(target.start)}
// Named beats: ‹ and › step between them while paused; a toast says what happens there.
function stepBeat(dir){if(playing)setPlaying(false);const route=path||'rho',list=beatsFor(route,coupling).filter(b=>path||b[0]<CHOICE_TIME);
 const target=dir>0?list.find(b=>b[0]>time+.02):[...list].reverse().find(b=>b[0]<time-.02);if(!target)return;seekGuarded(target[0]);toast(`${target[1]} · ${target[2]}`,3600)}
// Holding stops just before the next shot's camera blend begins, so the held frame is a steady shot.
function holdTime(start){const shot=[...COMMON_SHOTS,...ENDING_SHOTS[path||'rho']].find(s=>Math.abs(s.start-start)<1e-6);if(!shot?.blend)return start-.05;return start-(calm?Math.min(shot.blend,1.2):shot.blend)*(shot.lead??.35)}
const nextChapterStart=t=>visibleChapters().find(c=>c.start>t+1e-6)?.start??null;
function showContinue(start){holdFor=start;const c=visibleChapters().find(x=>x.start===start),b=$('continue');b.textContent=`Continue: ${c?.nav??'next'} ▸`;b.hidden=false;if(document.activeElement===document.body||document.activeElement===$('play'))b.focus({preventScroll:true});relayout()}
function hideContinue(){if(holdFor===null&&$('continue').hidden)return;holdFor=null;$('continue').hidden=true;relayout()}
function continuePlayback(){if(holdFor!==null){skipHold=holdFor;hideContinue()}skipReading();setPlaying(true)}
function nextChipText(){const s=holdFor??nextChapterStart(time),c=visibleChapters().find(x=>x.start===s);return c?`Next · ${c.nav} ▸`:''}
function setHold(on,remember=false){holdEnds=on;$('hold').checked=on;if(remember)toast(on?'Holding at the end of each chapter (H).':'Playing straight through chapters (H).',2200);if(!on)hideContinue()}
function setLoop(on,quiet=false){const was=!!loopRange;loopRange=null;if(on){const list=visibleChapters(),i=chapterIndex(),range=[list[i].start,list[i+1]?.start??(path?endTime(path):CHOICE_TIME)];if(range[1]-range[0]<1){if(!quiet)toast('Choose an ending first; this point cannot loop.',2400);on=false}else loopRange=range}$('loop').setAttribute('aria-pressed',String(on));if(!quiet||was!==on)if(!quiet)toast(on?`Looping “${currentChapter().nav}”.`:'Chapter loop off.',2000)}
// ---------- Camera modes ----------
function setExploring(on,resume=true){
 if(on===exploring)return;exploring=on;controls.enabled=on;controls.enableZoom=on;controls.enableDamping=!calm;document.body.classList.toggle('exploring',on);$('explore').textContent=on?'Resume guided camera':'Explore in 3D';
 if(on){resumePlay=playing;if(playing)setPlaying(false);$('dip').style.opacity=0;dipShown=0}else{resumeGuide();const again=resume&&resumePlay;resumePlay=false;if(again)setPlaying(true);syncURL()}
 relayout();invalidate();announce(on?'Explore: drag or use arrow keys in the 3D view; Escape returns to the guided camera.':'Guided camera.',0);
}
function zoomBy(f){const d=_zoom.subVectors(camera.position,controls.target).multiplyScalar(f),len=d.length();d.setLength(Math.min(controls.maxDistance,Math.max(controls.minDistance,len)));camera.position.copy(controls.target).add(d);controls.update();invalidateView()}
const _zoom=V();
// ---------- Reduced motion, presenting, narration ----------
function setCalm(on,remember=false){calm=on;if(remember){motionChoice=on?'reduced':'full';saved.set('motion',motionChoice);toast(on?'Reduced motion on (M).':'Full motion (M).',2000)}document.body.classList.toggle('calm',on);controls.enableDamping=!on;$('motion').value=motionChoice;invalidate()}
function setPresenting(on){if(on===presenting)return;presenting=on;document.body.classList.toggle('presenting',on);if(on){holdBeforePresenting=holdEnds;setHold(true);wake()}else{setHold(holdBeforePresenting);document.body.classList.remove('idle');clearTimeout(idleTimer)}
 $('present').textContent=on?'Leave presenter mode':'Presenter mode';$('next-chip').hidden=!on;notes.resetSizes();relayout();syncURL();toast(on?'Presenter mode: holds at chapter ends · → continues · B blacks out · Esc leaves.':'Presenter mode off.',3200)}
function wake(){if(!presenting)return;document.body.classList.remove('idle');clearTimeout(idleTimer);idleTimer=setTimeout(()=>document.body.classList.add('idle'),2500)}
function setBlackout(on=!blackout){blackout=on;$('blackout').hidden=!on;if(on)setPlaying(false)}
// Offline read-aloud of the chapter title and copy; only local voices, so nothing leaves the device.
const SAY=[[/σ70/g,'sigma seventy'],[/σ/g,'sigma'],[/β′/g,'beta prime'],[/β/g,'beta'],[/α₂/g,'alpha two'],[/α/g,'alpha'],[/γ/g,'gamma'],[/ω/g,'omega'],[/−35/g,'minus thirty-five'],[/−10/g,'minus ten'],[/3′/g,'three prime'],[/5′/g,'five prime'],[/ → /g,' to '],[/NTPs/g,'N T Ps'],[/NTP/g,'N T P'],[/rU·dA/g,'r U, d A'],[/Mg²⁺/g,'magnesium'],[/≈/g,'about '],[/(\d)–(\d)/g,'$1 to $2'],[/RNAP/g,'R N A P'],[/Nus([AG])/g,'Nus $1'],[/PPi/g,'pyrophosphate'],[/(\d) nt\b/g,'$1 nucleotides'],[/1000-fold/g,'a thousand-fold']];
const spoken=text=>SAY.reduce((s,[a,b])=>s.replace(a,b),text);
function pickVoice(){if(!('speechSynthesis' in window))return;const vs=speechSynthesis.getVoices().filter(v=>v.localService&&/^en/i.test(v.lang));voice=vs.find(v=>/en-GB/i.test(v.lang))||vs[0]||null;$('narrate-row').hidden=!voice;if(!voice&&narrate)setNarrate(false)}
function setNarrate(on,remember=false){if(on&&!voice){toast('No offline voice is available in this browser.',2600);on=false}narrate=on;$('narrate').checked=on;if(!on){if('speechSynthesis' in window)speechSynthesis.cancel();speaking=waitSpeech=false}else sayChapter();if(remember)toast(on?'Reading chapters aloud (V).':'Read-aloud off (V).',2000)}
function sayChapter(){if(!narrate||!voice)return;speechSynthesis.cancel();const c=currentChapter(),u=new SpeechSynthesisUtterance(spoken(`${plain(c.title)} ${copyText(chapterText(c))}`));u.voice=voice;u.lang=voice.lang;u.onend=u.onerror=()=>{speaking=false;if(waitSpeech){waitSpeech=false;if(holdAfterSpeech&&playing){setPlaying(false,{hold:true});showContinue(speechHold)}else skipHold=speechHold}invalidate()};speaking=true;speechSynthesis.speak(u)}
// ---------- Announcements ----------
function announce(text,delay=700){clearTimeout(announceTimer);announceTimer=setTimeout(()=>{if(text===lastAnnounced)return;lastAnnounced=text;const el=$('announcer');el.textContent='';requestAnimationFrame(()=>el.textContent=text)},delay)}
function announceStatus(){const c=currentChapter(),b=!path&&time>=CHOICE_TIME?null:beatsFor(path||'rho',coupling)[beatAt(time,path||'rho',coupling)];lastAnnounced='';announce(`${clock(time)}. ${c.nav}${b?`, ${b[1]}`:''}. Transcript ${state.displayNt} nucleotides. ${$('scene-now').textContent}`,0)}
// ---------- Panels ----------
function setInert(on,keep){for(const el of document.body.children){if(el.id===keep||el.tagName==='SCRIPT'||el.tagName==='DIALOG')continue;on?el.setAttribute('inert',''):el.removeAttribute('inert')}}
// The notes page is large, so the iframe loads it once and later opens only scroll it. It behaves as a dialog.
function readNotes(section){setPlaying(false);closeDescription();const frame=$('notes-frame'),go=()=>{const doc=frame.contentDocument;doc?.fonts.ready.then(()=>{if(section)doc.getElementById(section)?.scrollIntoView({behavior:'instant',block:'start'})})};
 if(frame.dataset.loaded)go();else{frame.onload=()=>{frame.dataset.loaded='1';try{frame.contentDocument.addEventListener('keydown',e=>{if(e.key==='Escape')closeNotes()})}catch(e){}go()};frame.src='notes.html'}
 if($('notes-panel').hidden)notesOpener=document.activeElement;$('notes-panel').hidden=false;document.body.classList.add('reading');setInert(true,'notes-panel');$('notes-close').focus()}
function closeNotes(){if($('notes-panel').hidden)return;$('notes-panel').hidden=true;document.body.classList.remove('reading');setInert(false);(notesOpener?.isConnected&&notesOpener!==document.body?notesOpener:$('read-notes')).focus();invalidate()}
function toggleDescription(open=$('description').hidden){if(open){closeNotes();$('description').hidden=false;document.body.classList.add('describing');beatShown=-1;updateText();($('description-body').querySelector('[aria-current]')||$('description-close')).focus()}else closeDescription();relayout()}
function closeDescription(){if($('description').hidden)return;$('description').hidden=true;document.body.classList.remove('describing');relayout();$('describe').focus({preventScroll:true})}
function toggleSettings(open=$('settings').hidden){$('settings').hidden=!open;$('more').setAttribute('aria-expanded',String(open));if(open)$('settings').querySelector('select,button,input')?.focus();else if($('settings').contains(document.activeElement))$('more').focus();relayout()}
function openShortcuts(){setPlaying(false);$('shortcuts').showModal()}
// Esc closes the top-most overlay; with none open it returns to the guided camera.
function escape(){if(!$('details-menu').hidden)return toggleDetailsMenu(false);if(!$('notes-panel').hidden)return closeNotes();if(!$('settings').hidden)return toggleSettings(false);if(!$('glossary').hidden)return closeGlossary();if(!$('description').hidden)return closeDescription();if(inspecting)return closeInspector();if(checkpoint)return closeCheckpoint(false);if(blackout)return setBlackout(false);if(presenting)return setPresenting(false);if(exploring)setExploring(false)}
// ---------- Links, embedding and the parent page ----------
const camString=()=>[...camera.position.toArray(),...controls.target.toArray()].map(v=>v.toFixed(1)).join(',');
function linkParams(camera){const q=new URLSearchParams(location.search);q.set('t',time.toFixed(1));path?q.set('path',path):q.delete('path');for(const k of ['chapter','autoplay','cam'])q.delete(k);
 labels?q.delete('labels'):q.set('labels','0');q.delete('parts');details.size?q.set('details',[...details].join(',')):q.delete('details');manualCut===true?q.set('cut','1'):q.delete('cut');speed!==1?q.set('speed',speed):q.delete('speed');presenting?q.set('present','1'):q.delete('present');predict?q.set('predict','1'):q.delete('predict');seqOn?q.set('sequence','1'):q.delete('sequence');coupling?q.set('ribosome','1'):q.has('ribosome')||saved.get('ribosome')==='1'?q.set('ribosome','0'):q.delete('ribosome');reading.pace==='normal'?q.delete('read'):q.set('read',reading.pace);if(camera&&exploring)q.set('cam',camString());return q}
// The address bar is always a share link: updated silently when paused, never during playback.
function syncURL(){if(!ready||embed||playing||parsing)return;try{history.replaceState(null,'','?'+linkParams(exploring).toString())}catch(e){}}
async function copyLink(){const url=`${location.origin}${location.pathname}?${linkParams(includeCamera)}`,what=`Link to ${clock(time)} · ${currentChapter().nav}`;
 try{if(!isSecureContext||!navigator.clipboard)throw 0;await navigator.clipboard.writeText(url);toast(`${what} copied.`)}catch(e){const el=$('toast');el.innerHTML='';el.append(`${what}: `);const f=document.createElement('input');f.value=url;f.readOnly=true;f.className='link-field';f.setAttribute('aria-label','Link to copy');el.append(f);el.hidden=false;f.focus();f.select();clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.hidden=true,8000)}}
function postState(){if(window.parent!==window)window.parent.postMessage({kind:'transcription-3d-state',t:+time.toFixed(2),chapter:slug(currentChapter().nav),playing},'*')}
let parsing=false;
function parseQuery(q){
 parsing=true; embed=q.get('embed')==='1';document.body.classList.toggle('embed',embed);
 if(q.get('labels')==='0'){labels=false;$('labels').setAttribute('aria-pressed','false')}
 if(q.get('parts')==='1')setDetails(DETAILS.map(d=>d[0]));if(q.has('details'))setDetails(q.get('details').split(','));
 const sp=Number(q.get('speed'));if(SPEEDS.includes(sp)){speed=sp;$('speed').value=String(sp)}
 let route=q.get('path');if(route!=='rho'&&route!=='intrinsic')route=null;
 let t=Number(q.get('t'))||0;const ch=q.get('chapter');
 if(ch){const find=r=>chaptersFor(r).find(c=>slug(c.nav)===ch);const hit=find(route||'rho')||(!route&&find('intrinsic'));if(hit){t=hit.start;if(!route&&t>=CHOICE_TIME)route=chaptersFor('rho').includes(hit)?'rho':'intrinsic'}}
 endAt=Number(q.get('end'))||null;loopClip=q.get('loop')==='1';clipStart=t;
 if(route)setPath(route);seekGuarded(t);
 if(q.get('cut')==='1'){manualCut=true;manualCutChapter=state.chapter}
 const cam=(q.get('cam')||'').split(',').map(Number);if(cam.length===6&&cam.every(Number.isFinite)){prevCore.copy(actorPosition(state));coreKnown=true;setExploring(true);camera.position.set(cam[0],cam[1],cam[2]);controls.target.set(cam[3],cam[4],cam[5]);controls.update()}
 if(q.get('present')==='1')setPresenting(true);
 if(q.get('predict')==='1')setPredict(true);if(q.get('sequence')==='1')setSequence(true);if(q.has('ribosome'))setCoupling(q.get('ribosome')==='1');if(q.has('read'))setReadPace(q.get('read'));
 parsing=false;if(['t','path','chapter','cam'].some(k=>q.has(k)))syncURL();
 return q.get('autoplay')==='1';
}
// ---------- DNA at the polymerase: the sequence strip ----------
// Always in textbook orientation: coding 5′→3′ on top, template 3′→5′ below, the RNA pairing under the
// template and the active site marked. The DNA holds still while RNAP scrunches, as in the 3D.
const MAP={cols:23,cell:13.2,left:16,right:312,rows:{num:12,top:30,coding:52,template:76,rna:100,beyond:112,summary:140}};let map=null,mapKey='',mapTab=null,mapShown=null;
function buildMap(){const svg=$('dna-map'),ns='http://www.w3.org/2000/svg',el=(tag,attrs={},parent=svg)=>{const e=document.createElementNS(ns,tag);for(const [k,v] of Object.entries(attrs))e.setAttribute(k,v);parent.append(e);return e},R=MAP.rows;
 const clip=el('clipPath',{id:'map-clip'},el('defs'));el('rect',{x:MAP.left,y:0,width:MAP.right-MAP.left,height:150},clip);
 const lane=el('g',{'clip-path':'url(#map-clip)'}),boxes=[el('rect',{class:'m-box',rx:3},lane),el('rect',{class:'m-box',rx:3},lane)],cols=el('g',{},lane),col=[];
 for(let i=0;i<MAP.cols+2;i++){const g=el('g',{},cols);col.push({g,num:el('text',{class:'m-num',y:R.num},g),c:el('text',{class:'m-base',y:R.coding},g),t:el('text',{class:'m-base',y:R.template},g),r:el('text',{class:'m-base m-rna',y:R.rna},g)})}
 // Strand ends outside the clipped lane: coding 5′…3′ on top, template 3′…5′ below.
 for(const [label,x,y] of [['5′',2,R.coding],['3′',2,R.template],['3′',MAP.right+4,R.coding],['5′',MAP.right+4,R.template]])el('text',{class:'m-end',x,y}).textContent=label;
 const caret=el('g',{class:'m-caret'},lane);el('path',{d:`M0 ${R.coding-14}V${R.rna+8}`},caret);el('circle',{cy:R.rna+10,r:2.6},caret);
 const bracket=cls=>el('path',{class:cls},lane);
 map={cols,col,boxes,caret,bubble:bracket('m-bracket'),hybrid:bracket('m-bracket m-hybrid'),labels:[el('text',{class:'m-label'},lane),el('text',{class:'m-label'},lane),el('text',{class:'m-label m-start'},lane)],summary:el('text',{class:'m-summary',x:MAP.left,y:R.summary})}}
const setText=(e,v)=>{if(e.textContent!==v)e.textContent=v};
function updateMap(S){
 if(!map)buildMap();const sr=searchAt(S.time),other=!!sr&&sr.segment<.5,route=S.path||'rho',R=MAP.rows,C=MAP.cell,anchor=S.distance/RISE,n0=Math.floor(anchor)-(S.time<ELONGATION.factors?12:10),frac=anchor-Math.floor(anchor),X=i=>MAP.left+C/2+(i-frac)*C;
 const key=[Math.round(anchor*16),Math.round(S.register*16),Math.round(S.open*20),Math.round(S.ntCount*4),S.error>.5,route,Math.round(S.scrunch*8),S.backtracking,Math.round(S.time*2),seqW>.3].join('|');if(key===mapKey)return;mapKey=key;
 const bubble=[],hybrid=[],boxed=S.time>=SEARCH.wait[0]&&S.time<84&&!other;let beyondAny=false,newAt=false;
 // The upstream fork stays at the promoter while RNAP scrunches, so the bubble grows downstream.
 map.col.forEach((cell,i)=>{const n=n0+i,b=n-S.register,o=openAt(b,S)*smooth((n-anchor-BUBBLE_UP)/1.5)*smooth((BUBBLE_DN-b)/1.5),edge=X(i)-C/2<MAP.left-1||X(i)+C/2>MAP.right+1,shown=n>=materialMin&&!edge;cell.g.setAttribute('transform',`translate(${X(i).toFixed(1)} 0)`);
   const label=position(n).replace('-','−'),num=n>=0?n+1:n,inBox=boxed&&(n>=-35&&n<=-30||n>=-12&&n<=-7);setText(cell.num,num%5===0&&!edge&&!inBox?label:'');
   // While RNAP is on the other DNA segment the strip shows that segment's (arbitrary) sequence, unnumbered.
   const cb=coding(other?n+60000:n,route),tb=templateBase(other?n+60000:n,route);if(other)setText(cell.num,'');setText(cell.c,shown||other&&!edge?cb:'');setText(cell.t,shown||other&&!edge?tb:'');cell.c.setAttribute('y',(R.coding-7*o).toFixed(1));cell.t.setAttribute('y',(R.template+7*o).toFixed(1));if(o>.5)bubble.push(i);
   // RNA nucleotide j pairs with template n = j. A new nucleotide waits at i+1 until RNAP translocates; only a
   // backtracked 3′ end reaches two or more positions past the active site, into the secondary channel.
   const j=n,exists=S.ntCount>=1&&j>=0&&j<=S.ntCount-1+1e-6,backing=S.time>=BACKTRACK.start&&S.time<BACKTRACK.cleave+.4,w=paired(j-S.register,S),beyond=j>S.register+(backing?.5:1.5),rb=j===ERROR.j&&S.error>.5?ERROR.wrong:rnaBase(j,route);
   if(exists&&!edge&&!S.release&&(w>.25||beyond||j>=S.register-10)){setText(cell.r,rb);cell.r.setAttribute('y',beyond?R.beyond:R.rna);cell.r.classList.toggle('m-error',j===ERROR.j&&S.error>.5);cell.r.classList.toggle('m-free',w<=.25&&!beyond);cell.r.classList.toggle('m-beyond',beyond);if(w>.5&&j<=S.register+.5)hybrid.push(i);if(j>S.register+.5&&!beyond)newAt=true;if(beyond)beyondAny=true}else setText(cell.r,'');
   const tint=ch=>BASE_HEX[ch]||'';cell.c.style.fill=tint(cb);cell.t.style.fill=tint(tb);cell.r.style.fill=cell.r.classList.contains('m-error')?'':tint(rb)});
 const span=(path,list,up)=>{if(list.length<2){path.style.display='none';return}const a=X(list[0])-C/2+1,z=X(list.at(-1))+C/2-1,y=up?R.top+6:R.rna+8;path.style.display='';path.setAttribute('d',up?`M${a.toFixed(1)} ${y+5}V${y}H${z.toFixed(1)}V${y+5}`:`M${a.toFixed(1)} ${y-5}V${y}H${z.toFixed(1)}V${y-5}`)};
 span(map.bubble,bubble,true);span(map.hybrid,hybrid,false);
 // −35 and −10 boxed until RNAP has escaped; their names sit in the top lane until the bubble takes it.
 const promoterOn=boxed,namesOn=promoterOn&&bubble.length<2;
 [[-35,-30,'−35'],[-12,-7,'−10']].forEach(([a,z,name],k)=>{const box=map.boxes[k],x0=X(a-n0)-C/2,x1=X(z-n0)+C/2,visible=promoterOn&&x1>MAP.left&&x0<MAP.right;box.style.display=visible?'':'none';map.labels[k].style.display=visible&&namesOn?'':'none';
   if(visible){box.setAttribute('x',x0.toFixed(1));box.setAttribute('y',R.coding-13);box.setAttribute('width',(x1-x0).toFixed(1));box.setAttribute('height',R.template-R.coding+18);map.labels[k].setAttribute('x',Math.min(MAP.right-34,Math.max(MAP.left+34,(Math.max(x0,MAP.left)+Math.min(x1,MAP.right))/2)).toFixed(1));map.labels[k].setAttribute('y',R.top+4);setText(map.labels[k],name)}});
 const xs=X(0-n0);map.labels[2].style.display=namesOn&&xs>MAP.left&&xs<MAP.right?'':'none';map.labels[2].setAttribute('x',xs.toFixed(1));map.labels[2].setAttribute('y',R.top+4);setText(map.labels[2],'+1');
 const caretOn=S.time>=44&&S.open>.3&&!S.release;map.caret.style.display=caretOn?'':'none';if(caretOn)map.caret.setAttribute('transform',`translate(${(X(S.register-n0)+C/2).toFixed(1)} 0)`);
 // One summary line instead of labels that could collide.
 const first=[],second=[];if(other)first.push('RNAP is on another DNA segment');else if(S.time>=SEARCH.land[0]&&S.time<34)first.push('RNAP is searching the promoter DNA');if(caretOn)first.push('┊ active site');if(bubble.length>=2)first.push(`bubble ${bubble.length} bp`);if(hybrid.length>=2)first.push(`hybrid ${hybrid.length} bp${newAt?' + new nt at i+1':''}`);if(S.scrunch>.6)second.push(`+${Math.round(S.scrunch)} bp of DNA scrunched in`);if(beyondAny)second.push('3′ end backtracked into the secondary channel');
 const lines=[first.join('  ·  '),second.join('  ·  ')].filter(Boolean),joined=lines.join('\n');if(map.summary.dataset.v!==joined){map.summary.dataset.v=joined;map.summary.textContent='';lines.forEach((l,k)=>{const t=document.createElementNS('http://www.w3.org/2000/svg','tspan');t.setAttribute('x',MAP.left);t.setAttribute('dy',k?'14':'0');t.textContent=l;map.summary.append(t)})}
}
// The card shows the DNA map in close-ups and while RNAP searches, the transcript otherwise, unless the viewer chose.
function cardTab(S){const t=S.time,auto=t<ABORTIVE.start||(t>=108&&t<CHOICE_TIME)||(S.path==='intrinsic'&&t>=142&&t<154);return innerWidth<=600||innerHeight<=560?'rna':mapTab??(auto?'dna':'rna')}
function showTab(tab){if(tab===mapShown)return;mapShown=tab;$('dna-view').hidden=tab!=='dna';$('rna-view').hidden=tab!=='rna';$('tab-dna').setAttribute('aria-selected',String(tab==='dna'));$('tab-rna').setAttribute('aria-selected',String(tab==='rna'));mapKey='';relayout()}
function setCoupling(on,remember=false){if(coupling===on){$('ribosome').checked=on;return}coupling=on;$('ribosome').checked=on;for(const k in bigCache)delete bigCache[k];
 // Rebuilt text keeps keyboard focus; the narration re-renders only where its copy differs.
 const a=document.activeElement,lineT=a?.closest?.('#description-body .line')?.dataset.t;if(currentChapter()?.copyUncoupled)copyShown='';beatShown=-1;if(ready){buildDescription();if(lineT)$('description-body').querySelector(`.line[data-t="${lineT}"]`)?.focus({preventScroll:true})}
 drawCheckpointDots();if(checkpoint?.id==='coupling'&&!on)closeCheckpoint(false);if(checkpoint){const list=activeCheckpoints();$('cp-count').textContent=`Predict · ${list.indexOf(checkpoint)+1} of ${list.length}`}if(predict&&!$('end-card').hidden)buildRecap();
 // Only the time-lapse framing depends on the ribosome, so only there does the camera ease to the new shot.
 if(ready&&!parsing&&!exploring&&ribosomeAt(time))resumeGuide();invalidate();syncURL();
 if(remember){saved.set('ribosome',on?'1':'0');toast(on?'Coupled translation on: a schematic ribosome translates the RNA during the time-lapse (T).':'Coupled translation off (T).',2600)}}
function buildDetails(){for(const list of document.querySelectorAll('.details-list'))list.innerHTML=DETAILS.map(([k,name,hint])=>`<label class="setting check"><input type="checkbox" data-detail="${k}"><span>${name}<small>${hint}</small></span></label>`).join('');
 document.querySelectorAll('[data-detail]').forEach(i=>i.onchange=()=>setDetail(i.dataset.detail,i.checked,true));syncDetails()}
function syncDetails(){document.querySelectorAll('[data-detail]').forEach(i=>i.checked=details.has(i.dataset.detail));$('parts').classList.toggle('on',details.size>0);showParts=detail('parts')}
function setDetails(list){details=new Set(list.filter(k=>DETAILS.some(d=>d[0]===k)));syncDetails();invalidate()}
function setDetail(k,on,remember=false){if(on)details.add(k);else details.delete(k);syncDetails();if(remember){saved.set('details',[...details].join(','));announce(`${DETAILS.find(d=>d[0]===k)[1]} ${on?'shown':'hidden'}.`,0)}syncURL();invalidate()}
// The transport's Details menu (on narrow screens the same choices sit under More).
function toggleDetailsMenu(open=$('details-menu').hidden){if(open&&!$('parts').offsetParent){toggleSettings(true);return}$('details-menu').hidden=!open;$('parts').setAttribute('aria-expanded',String(open));
 if(open)$('details-menu').querySelector('input')?.focus({preventScroll:true});else if($('details-menu').contains(document.activeElement))$('parts').focus({preventScroll:true})}
function setSequence(on,remember=false){seqOn=on;$('sequence').checked=on;invalidate();if(remember)toast(on?'Base identity on: A, T/U, G and C are coloured and lettered in close-ups (S).':'Base identity off (S).',2400)}
// ---------- Glossary ----------
// Terms and aliases, longest first, so 'RNA–DNA hybrid' wins over 'hybrid'.
const TERM_NAMES=GLOSSARY.flatMap(g=>[g.term,...(g.aliases||[])].map(name=>[name,g])).sort((a,b)=>b[0].length-a[0].length);
const TERM_RE=new RegExp(`(?<![\\p{L}\\p{N}])(${TERM_NAMES.map(([n])=>n.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')).join('|')})(?![\\p{L}\\p{N}])`,'giu');
const termOf=name=>TERM_NAMES.find(([n])=>n.toLowerCase()===name.toLowerCase())?.[1];
// Narration copy with the first mention of up to four glossary terms as buttons.
function renderCopy(el,text){el.textContent='';const used=new Set();let at=0;for(const m of text.matchAll(TERM_RE)){const g=termOf(m[0]);if(!g||used.has(g)||used.size>=4)continue;used.add(g);el.append(text.slice(at,m.index));const b=document.createElement('button');b.className='term';b.textContent=m[0];b.title=`${g.term}: ${g.def}`;b.onclick=()=>openGlossary(g.term);el.append(b);at=m.index+m[0].length}el.append(text.slice(at));enrichTree(el)}
function buildGlossary(){const list=$('glossary-list');list.textContent='';for(const g of [...GLOSSARY].sort((a,b)=>a.term.replace(/^[−+]/,'').localeCompare(b.term.replace(/^[−+]/,''),'en',{sensitivity:'base'}))){const div=document.createElement('div');div.id=`g-${glossarySlug(g.term)}`;div.className='g-entry';div.innerHTML='<dt></dt><dd><p></p><div class="g-actions"><button class="show">Show me ▸</button><button class="read">In the notes ↗</button></div></dd>';
   div.querySelector('dt').textContent=g.term;div.querySelector('p').textContent=g.def;div.querySelector('.show').onclick=()=>showTerm(g);div.querySelector('.read').onclick=()=>readNotes(g.notes);div.dataset.text=[g.term,...(g.aliases||[]),g.def].join(' ').toLowerCase();list.append(div)}enrichTree(list)}
function showTerm(g){const s=g.show;setPlaying(false);let note='';if(s.coupling&&!coupling){setCoupling(true);note=' Coupled translation is on for this visit; T hides it.';toast(note.trim(),3200)}// A term shown on both endings (routes) stays on the chosen one.
 const own=!!(path&&s.routes?.[path]!==undefined);if(!own&&s.path&&s.path!==path)setPath(s.path);else if(!path&&s.t>=CHOICE_TIME)setPath('rho');goChapter(own?s.routes[path]:s.t);if(s.key)setTimeout(()=>{findMolecule(s.key)&&INFO[s.key]&&openInspector(s.key)},80);announce(`${g.term}. ${g.def}${note}`,0)}
function openGlossary(term){if($('glossary').hidden)glossaryOpener=document.activeElement;closeDescription();if(!$('glossary-list').children.length)buildGlossary();$('glossary').hidden=false;document.body.classList.add('glossing');relayout();
 if(term){const el=$(`g-${glossarySlug(term)}`);if(el){el.scrollIntoView({block:'start'});el.classList.add('flash');setTimeout(()=>el.classList.remove('flash'),1600);el.querySelector('.show').focus({preventScroll:true})}}else $('glossary-search').focus()}
let glossaryOpener=null,inspectorOpener=null,singleKeys=true;
const refocus=(el,fallback)=>(el?.isConnected&&el!==document.body&&el.offsetParent!==null?el:fallback).focus({preventScroll:true});
function closeGlossary(){if($('glossary').hidden)return;const had=$('glossary').contains(document.activeElement);$('glossary').hidden=true;document.body.classList.remove('glossing');relayout();if(had)refocus(glossaryOpener,$('play'))}
// ---------- Predict, then watch ----------
let predict=false,checkpoint=null,cpAnswered=false,predictions={},recapOrder=[];
try{predictions=JSON.parse(saved.get('predictions')||'{}')||{}}catch(e){predictions={}}
function setPredict(on,remember=false){predict=on;$('predict').checked=on;drawCheckpointDots();if(!on)closeCheckpoint(false);if(remember)toast(on?'Predict mode on: playback stops before key moments with a question (Q).':'Predict mode off (Q).',2600);syncURL()}
// The coupling question is answered by the ribosome, so it is asked only when translation is shown.
const activeCheckpoints=()=>checkpointsFor(path||'rho').filter(c=>coupling||c.id!=='coupling');
function drawCheckpointDots(){$('ticks').querySelectorAll('u').forEach(u=>u.remove());if(!predict)return;const max=Number($('time').max);for(const c of activeCheckpoints())if(c.t<=max){const u=document.createElement('u');u.style.left=`${(c.t/max*100).toFixed(2)}%`;u.title=c.q;$('ticks').append(u)}}
const checkpointAhead=(t0,t1)=>predict?activeCheckpoints().find(c=>(path||c.t<CHOICE_TIME)&&t0<c.t&&t1>=c.t):null;
function showCheckpoint(cp){checkpoint=cp;cpAnswered=false;const list=activeCheckpoints();$('cp-count').textContent=`Predict · ${list.indexOf(cp)+1} of ${list.length}`;$('cp-keys').textContent=cp.kind==='pick'?'Click in 3D, or answer with 1–2':`Answer with 1–${cp.options.length}`;$('cp-question').textContent=cp.q;
 $('cp-options').innerHTML=cp.options.map((o,k)=>`<button data-k="${k}"><kbd>${k+1}</kbd><span></span></button>`).join('');$('cp-options').querySelectorAll('button').forEach((b,k)=>{b.querySelector('span').textContent=cp.options[k];b.onclick=()=>answer(k)});enrichTree($('checkpoint'));
 $('cp-feedback').hidden=true;$('checkpoint').hidden=false;document.body.classList.add('predicting');$('cp-options').querySelector('button').focus({preventScroll:true});
 announce(`Predict. ${cp.q} ${cp.options.map((o,k)=>`${k+1}: ${o}.`).join(' ')}`,0);relayout();invalidate()}
function answer(k){if(!checkpoint||cpAnswered||k<0||k>=checkpoint.options.length)return;cpAnswered=true;const cp=checkpoint,right=k===cp.answer;predictions[cp.id]=right;saved.set('predictions',JSON.stringify(predictions));
 $('cp-options').querySelectorAll('button').forEach((b,i)=>{b.disabled=true;b.classList.toggle('right',i===cp.answer);b.classList.toggle('wrong',i===k&&!right)});
 $('cp-result').textContent=right?'Right.':`Not quite. It is: ${cp.options[cp.answer]}.`;$('cp-result').className=`cp-result ${right?'right':'wrong'}`;setRich($('cp-why'),cp.why);$('cp-feedback').hidden=false;$('cp-notes').onclick=()=>readNotes(cp.notes);$('cp-watch').focus({preventScroll:true});
 announce(`${$('cp-result').textContent} ${cp.why}`,0)}
function closeCheckpoint(play){if(!checkpoint)return;const had=$('checkpoint').contains(document.activeElement);checkpoint=null;$('checkpoint').hidden=true;if(had)$('play').focus({preventScroll:true});document.body.classList.remove('predicting');relayout();invalidate();if(play)setPlaying(true)}
// Inside the ending choice: which ending needs an ATP-driven protein?
function choiceQuestion(){const box=$('choice-question');box.hidden=!predict;if(!predict)return;const Q=CHOICE_QUESTION;box.innerHTML='<p class="eyebrow">Predict · answer with 1–2</p><p class="q"></p><div class="cp-options"></div><p class="why" role="status" hidden></p>';box.querySelector('.q').textContent=Q.q;
 const opts=box.querySelector('.cp-options');Q.options.forEach((o,k)=>{const b=document.createElement('button');b.innerHTML=`<kbd>${k+1}</kbd><span></span>`;b.querySelector('span').textContent=o;b.onclick=()=>{const right=k===Q.answer;predictions[Q.id]=right;saved.set('predictions',JSON.stringify(predictions));opts.querySelectorAll('button').forEach((x,i)=>{x.disabled=true;x.classList.toggle('right',i===Q.answer);x.classList.toggle('wrong',i===k&&!right)});const w=box.querySelector('.why');w.hidden=false;w.textContent=`${right?'Right.':'Not quite.'} ${Q.why}`;$('path-choice').querySelector('[data-path]').focus()};opts.append(b)})}
// End of a route: the ordering recap (with Predict on), the comparison and the other ending.
let endPath=null;
function showEnd(on){endPath=on?path:null;$('end-card').hidden=!on;document.body.classList.toggle('at-end',on);if(!on)return;$('end-title').textContent=path==='intrinsic'?'The hairpin ended it. The core is free again.':'Rho ended it. The core is free again.';$('other-ending').textContent=`Watch the ${path==='rho'?'intrinsic':'Rho-dependent'} ending ▸`;
 $('recap').hidden=!predict;if(predict)buildRecap();relayout()}
function buildRecap(){if(!recapOrder.length)recapOrder=[3,0,5,1,4,2];const list=$('recap-list');list.innerHTML='';
 recapOrder.forEach((k,pos)=>{const li=document.createElement('li');li.draggable=true;li.dataset.k=k;const nm=RECAP[k][0];li.innerHTML=`<span class="grip" aria-hidden="true">⋮⋮</span><span class="name"></span><span class="tools"><button class="up" aria-label="Move ${nm} up" ${pos===0?'disabled':''}>↑</button><button class="down" aria-label="Move ${nm} down" ${pos===recapOrder.length-1?'disabled':''}>↓</button></span>`;li.querySelector('.name').textContent=nm;li.setAttribute('aria-label',`${pos+1}. ${nm}`);
   li.querySelector('.up').onclick=()=>moveRecap(pos,-1);li.querySelector('.down').onclick=()=>moveRecap(pos,1);
   li.ondragstart=e=>{e.dataTransfer.setData('text/plain',String(pos));li.classList.add('dragging')};li.ondragend=()=>li.classList.remove('dragging');li.ondragover=e=>e.preventDefault();li.ondrop=e=>{e.preventDefault();const from=Number(e.dataTransfer.getData('text/plain'));const [x]=recapOrder.splice(from,1);recapOrder.splice(pos,0,x);buildRecap()};list.append(li)});
 const cps=activeCheckpoints(),ids=[...cps.map(c=>c.id),CHOICE_QUESTION.id],seen=ids.filter(id=>id in predictions),right=seen.filter(id=>predictions[id]);
 $('score-line').textContent=seen.length?`${right.length} / ${seen.length} predictions right this time.`:'';
 $('revisit').innerHTML='';for(const c of cps.filter(c=>predictions[c.id]===false)){const b=document.createElement('button');b.textContent=`Revisit · ${clock(c.t)}`;b.title=c.q;b.onclick=()=>{showEnd(false);goChapter(Math.max(0,c.t-4))};$('revisit').append(b)}}
function moveRecap(pos,dir){const to=pos+dir;if(to<0||to>=recapOrder.length)return;[recapOrder[pos],recapOrder[to]]=[recapOrder[to],recapOrder[pos]];buildRecap();const li=$('recap-list').children[to],b=li.querySelector(dir<0?'.up':'.down');(b.disabled?li.querySelector(dir<0?'.down':'.up'):b).focus();announce(`${RECAP[recapOrder[to]][0]} moved to position ${to+1} of ${recapOrder.length}.`,0)}
function checkRecap(){let right=0;[...$('recap-list').children].forEach((li,pos)=>{const k=Number(li.dataset.k),ok=k===pos;if(ok)right++;li.classList.toggle('right',ok);li.classList.toggle('wrong',!ok);
   if(!li.querySelector('.jump')){const b=document.createElement('button');b.className='jump';b.textContent=`▸ ${clock(RECAP[k][1])}`;b.setAttribute('aria-label',`Watch ${RECAP[k][0]} at ${clock(RECAP[k][1])}`);b.onclick=()=>{showEnd(false);goChapter(RECAP[k][1])};li.querySelector('.tools').prepend(b)}});
 $('recap-result').textContent=right===RECAP.length?'All six in order.':`${right} of ${RECAP.length} in place. The order is closed complex, open complex, abortive initiation, promoter clearance, elongation, termination.`}
function openCompare(){document.querySelectorAll('#compare [data-route]').forEach(el=>el.classList.toggle('current',el.dataset.route===path));$('compare-other').hidden=!path;$('compare-other').textContent=path?`Watch the ${path==='rho'?'intrinsic':'Rho-dependent'} ending ▸`:'';$('compare').showModal()}
function otherEnding(){const other=path==='rho'?'intrinsic':'rho';if($('compare').open)$('compare').close();showEnd(false);pendingTime=CHOICE_TIME;setPath(other,true)}
// ---------- Wiring ----------
const KEYMAP=[
 {keys:['Space','K'],label:'Play or pause (continues after a hold)',run:()=>holdFor!==null?continuePlayback():setPlaying(!playing)},
 {keys:['←','→'],label:'Back or forward 2 s · with Shift, 10 s',match:e=>e.key==='ArrowLeft'||e.key==='ArrowRight',run:e=>e.key==='ArrowRight'&&(holdFor!==null||readHolding())?continuePlayback():nudge((e.key==='ArrowRight'?1:-1)*(e.shiftKey?10:2))},
 {keys:['[',']'],alt:'Page Up / Page Down',label:'Previous or next chapter',match:e=>['[',']','PageUp','PageDown'].includes(e.key),run:e=>{const fwd=e.key===']'||e.key==='PageDown';fwd&&(holdFor!==null||readHolding())?continuePlayback():jumpChapter(fwd?1:-1)}},
 {keys:[',','.'],label:'Previous or next step',match:e=>e.key===','||e.key==='.',run:e=>stepBeat(e.key==='.'?1:-1)},
 {keys:['Home','End'],label:'Start, or the end (or the choice of ending)',match:e=>e.key==='Home'||e.key==='End',run:e=>{setPlaying(false);seekGuarded(e.key==='Home'?0:path?endTime(path):CHOICE_TIME)}},
 {keys:['C'],label:'Cutaway',run:()=>$('cutaway').click()},
 {keys:['E'],label:'Explore in 3D, or resume the guided camera',run:()=>setExploring(!exploring)},
 {keys:['L'],label:'Labels',run:()=>$('labels').click()},
 {keys:['A'],label:'Extra detail (σ regions, active-site parts, subunits, more mechanism)',run:()=>toggleDetailsMenu()},
 {keys:['F'],label:'Fullscreen',run:()=>$('fullscreen').click()},
 {keys:['N'],label:'Lecture notes',run:()=>$('notes-panel').hidden?readNotes(currentChapter().notes):closeNotes()},
 {keys:['D'],label:'Text description',run:()=>toggleDescription()},
 {keys:['M'],label:'Reduce motion',run:()=>setCalm(!calm,true)},
 {keys:['H'],label:'Hold at chapter ends',run:()=>setHold(!holdEnds,true)},
 {keys:['R'],label:'Loop this chapter',run:()=>setLoop(!loopRange)},
 {keys:['P'],label:'Presenter mode',run:()=>setPresenting(!presenting)},
 {keys:['B'],label:'Blackout (presenting)',run:()=>setBlackout()},
 {keys:['I'],label:'Say where we are and what is on screen',run:()=>announceStatus()},
 {keys:['U'],label:'Copy a link to this moment',run:()=>copyLink()},
 {keys:['V'],label:'Read chapters aloud (offline voice)',run:()=>setNarrate(!narrate,true)},
 {keys:['S'],label:'Show base identity (sequence colours and letters)',run:()=>setSequence(!seqOn,true)},
 {keys:['T'],label:'Coupled translation (a schematic ribosome)',run:()=>setCoupling(!coupling,true)},
 {keys:['G'],label:'Glossary',run:()=>$('glossary').hidden?openGlossary():closeGlossary()},
 {keys:['Q'],label:'Predict, then watch',run:()=>setPredict(!predict,true)},
 {keys:['1','2','3','4'],label:'Answer a prediction; Enter watches the answer',match:e=>!!checkpoint&&(/^[1-9]$/.test(e.key)&&Number(e.key)<=checkpoint.options.length||cpAnswered&&e.key==='Enter'),run:e=>e.key==='Enter'?closeCheckpoint(true):answer(Number(e.key)-1)},
 {keys:['?'],label:'Keyboard shortcuts',match:e=>e.key==='?',run:()=>openShortcuts()},
 {keys:['Esc'],label:'Close the top panel, or return to the guided camera',match:e=>e.key==='Escape',run:()=>escape()}
];
KEYMAP.forEach(k=>k.match??=e=>k.keys.some(key=>key==='Space'?e.code==='Space':key.length===1&&e.key.toLowerCase()===key.toLowerCase()));
function buildShortcuts(){$('shortcut-list').innerHTML=KEYMAP.map(k=>`<div><dt>${k.keys.map(x=>`<kbd>${x}</kbd>`).join(' ')}${k.alt?` <small>or ${k.alt}</small>`:''}</dt><dd>${k.label}</dd></div>`).join('')}
function bind(){
 const cv=renderer.domElement;
 $('play').onclick=()=>holdFor!==null?continuePlayback():setPlaying(!playing);$('continue').onclick=()=>continuePlayback();$('next-chip').onclick=()=>holdFor!==null||readHolding()?continuePlayback():jumpChapter(1);
 $('restart').onclick=()=>{path=null;manualCut=null;pendingTime=null;syncPathControls();hideChoice();populateNavigation();setTime(0);setPlaying(true)};
 $('time').oninput=e=>{setPlaying(false);manualCut=null;seekGuarded(Number(e.target.value))};
 // The scrubber: arrows ±2 s (Shift ±10 s), Page keys by chapter, Home/End; it never starts playback.
 $('time').addEventListener('keydown',e=>{const k=e.key,step=e.shiftKey?10:2;let handled=true;
   if(k==='ArrowRight'||k==='ArrowUp')nudge(step);else if(k==='ArrowLeft'||k==='ArrowDown')nudge(-step);else if(k==='PageDown')jumpChapter(1);else if(k==='PageUp')jumpChapter(-1);else if(k==='Home'){setPlaying(false);seekGuarded(0)}else if(k==='End'){setPlaying(false);seekGuarded(path?endTime(path):CHOICE_TIME)}else handled=false;if(handled)e.preventDefault()});
 const tip=$('scrub-tip');$('time').addEventListener('pointermove',e=>{const el=$('time'),r=el.getBoundingClientRect(),t=clamp((e.clientX-r.left-7)/Math.max(1,r.width-14))*Number(el.max),route=path||'rho',ch=!path&&t>=CHOICE_TIME?CHOICE_CHAPTER:chaptersFor(route).findLast(c=>t>=c.start),b=beatsFor(route,coupling)[beatAt(t,route,coupling)];
   tip.textContent=`${clock(t)} · ${ch.nav}${b&&b[0]>=ch.start&&(path||t<CHOICE_TIME)?` · ${b[1]}`:''}`;tip.style.left=`${(e.clientX-r.left).toFixed(0)}px`;tip.hidden=false});$('time').addEventListener('pointerleave',()=>tip.hidden=true);
 $('speed').onchange=e=>{speed=Number(e.target.value);invalidate()};$('chapter-select').onchange=e=>goChapter(Number(e.target.value));$('show-text').onclick=()=>{const on=!document.body.classList.contains('show-text');document.body.classList.toggle('show-text',on);$('show-text').setAttribute('aria-expanded',String(on));$('show-text').textContent=on?'Hide text':'Show text';relayout()};$('beat-prev').onclick=()=>stepBeat(-1);$('beat-next').onclick=()=>stepBeat(1);$('loop').onclick=()=>setLoop(!loopRange);
 document.querySelectorAll('.path-control [data-route]').forEach(b=>b.onclick=()=>setPath(b.dataset.route));$('path-more').onchange=e=>{if(e.target.value){toggleSettings(false);setPath(e.target.value)}};$('path-choice').querySelectorAll('[data-path]').forEach(b=>b.onclick=()=>setPath(b.dataset.path,true));
 $('path-choice').addEventListener('keydown',e=>{const n=Number(e.key),opts=[...$('choice-question').querySelectorAll('.cp-options button:not(:disabled)')];if(predict&&n>=1&&n<=opts.length){e.preventDefault();opts[n-1].click()}});
 $('path-choice').addEventListener('close',()=>{if(!path){pendingTime=null;playLabel();$('play').focus()}});$('choice-close').onclick=()=>hideChoice();
 $('explore').onclick=()=>setExploring(!exploring);$('textbook-view').onclick=()=>setExploring(false,false);
 // OrbitControls stays disabled while the camera is guided. A drag of more than 5 px, or a second
 // finger, hands the gesture to it (Explore); a plain click inspects; a wheel tick zooms the guided shot.
 controls.enabled=false;controls.enableZoom=false;controls.addEventListener('change',()=>invalidateView());
 const down=new Map();let press=null,forwarding=false;
 const handOver=()=>{setExploring(true);forwarding=true;for(const {start:ev,last} of down.values())cv.dispatchEvent(new PointerEvent('pointerdown',{pointerId:ev.pointerId,pointerType:ev.pointerType,clientX:last.clientX,clientY:last.clientY,button:ev.button,buttons:ev.buttons,shiftKey:ev.shiftKey,ctrlKey:ev.ctrlKey,metaKey:ev.metaKey,isPrimary:ev.isPrimary,bubbles:true}));forwarding=false};
 cv.addEventListener('pointerdown',e=>{if(forwarding)return;down.set(e.pointerId,{start:e,last:e});press={x:e.clientX,y:e.clientY,id:e.pointerId,moved:false};if(!exploring&&down.size>=2){press.moved=true;handOver()}});
 cv.addEventListener('pointermove',e=>{if(down.has(e.pointerId))down.get(e.pointerId).last=e;if(press&&!press.moved&&e.pointerId===press.id&&Math.hypot(e.clientX-press.x,e.clientY-press.y)>5){press.moved=true;if(!exploring)handOver()}if(!down.size)hoverAt(e)});
 const lift=e=>{down.delete(e.pointerId);if(!press||press.id!==e.pointerId)return;const p=press;press=null;if(e.pointerType!=='touch'&&!exploring)setTimeout(()=>cv.blur());if(!p.moved&&e.type==='pointerup'){clearTimeout(clickTimer);clickTimer=setTimeout(()=>clickAt(e),230)}};
 cv.addEventListener('pointerup',lift);cv.addEventListener('pointercancel',lift);cv.addEventListener('pointerleave',()=>hoverOff());
 cv.addEventListener('wheel',e=>{if(exploring)return;e.preventDefault();userZoom=Math.min(2,Math.max(.5,userZoom*Math.exp(e.deltaY*.0012)));invalidateView()},{passive:false});
 // Double-click resumes the guided camera, and playback if it was playing before Explore.
 cv.addEventListener('dblclick',()=>{clearTimeout(clickTimer);if(exploring)setExploring(false)});
 // The 3D view is focusable: arrows pan, Shift+arrows rotate, + and − zoom; any of them enters Explore.
 cv.tabIndex=0;cv.setAttribute('role','application');cv.setAttribute('aria-roledescription','3D view');cv.setAttribute('aria-label','3D view. Shift and arrow keys rotate, arrow keys pan, plus and minus zoom, Escape returns to the guided camera.');cv.setAttribute('aria-describedby','scene-now');
 cv.addEventListener('keydown',e=>{if(e.metaKey||e.ctrlKey||e.altKey)return;const arrow=e.key.startsWith('Arrow'),zoom=['+','=','-','_'].includes(e.key);if(!arrow&&!zoom||!exploring&&!cv.matches(':focus-visible'))return;if(!exploring)setExploring(true);if(zoom){e.preventDefault();zoomBy(e.key==='-'||e.key==='_'?1/.85:.85)}});
 controls.listenToKeyEvents(cv);controls.keyRotateSpeed=30;controls.keyPanSpeed=14;
 $('cutaway').onclick=()=>{manualCut=$('cutaway').getAttribute('aria-pressed')!=='true';manualCutChapter=state.chapter;announce(manualCut?'Cutaway on.':'Cutaway off.',0);syncURL();invalidate()};
 $('labels').onclick=()=>{labels=!labels;$('labels').setAttribute('aria-pressed',labels);$('labels').textContent=labels?'Labels':'Labels: off';announce(labels?'Labels on.':'Labels off.',0);syncURL();invalidate()};
 $('parts').onclick=()=>toggleDetailsMenu();document.addEventListener('pointerdown',e=>{if(!$('details-menu').hidden&&!e.target.closest?.('.details-wrap'))toggleDetailsMenu(false)});
 $('fullscreen').onclick=()=>document.fullscreenElement?document.exitFullscreen():document.documentElement.requestFullscreen?.();
 document.addEventListener('fullscreenchange',()=>{const on=!!document.fullscreenElement;$('fullscreen').setAttribute('aria-label',on?'Exit fullscreen':'Enter fullscreen');$('fullscreen').textContent=on?'⤡':'⛶'});
 $('read-notes').onclick=()=>readNotes();$('section-notes').onclick=()=>readNotes(currentChapter().notes);$('notes-close').onclick=()=>closeNotes();
 $('describe').onclick=()=>toggleDescription();$('glossary-more').onclick=()=>{toggleSettings(false);openGlossary()};$('glossary-close').onclick=()=>closeGlossary();$('glossary-search').oninput=e=>{const q=e.target.value.trim().toLowerCase();for(const el of $('glossary-list').children)el.hidden=!!q&&!el.dataset.text.includes(q)};$('describe-more').onclick=()=>{toggleSettings(false);toggleDescription(true)};$('description-close').onclick=()=>closeDescription();
 $('follow').onchange=e=>followDescription=e.target.checked;$('announce-lines').onchange=e=>announceLines=e.target.checked;
 const sources=()=>{setPlaying(false);toggleSettings(false);$('sources').showModal()};$('sources-open').onclick=sources;$('sources-more').onclick=sources;$('sources-close').onclick=()=>$('sources').close();
 $('shortcuts-open').onclick=()=>{toggleSettings(false);openShortcuts()};$('shortcuts-button').onclick=()=>openShortcuts();$('shortcuts-close').onclick=()=>$('shortcuts').close();buildShortcuts();
 $('figure-close').onclick=()=>$('figure-dialog').close();$('inspector-close').onclick=()=>closeInspector();
 // 'Find a molecule': hover or focus spotlights it for 2.5 s; a click pins the inspector card.
 document.querySelectorAll('#legend [data-find]').forEach(b=>{const key=b.dataset.find;b.onmouseenter=b.onfocus=()=>{if(b.matches(':focus-visible')||b.matches(':hover'))findMolecule(key,true)};b.onclick=()=>{if(findMolecule(key)&&INFO[key])openInspector(key)}});
 // Toolbars and tab lists: one Tab stop, arrows move between items (roving tabindex).
 for(const group of document.querySelectorAll('#legend,.card-tabs'))roving(group,group.matches('.card-tabs'));
 $('single-keys').checked=singleKeys=saved.get('singleKeys')!=='0';$('single-keys').onchange=e=>{singleKeys=e.target.checked;saved.set('singleKeys',singleKeys?'1':'0')};
 $('key-button').onclick=()=>{const open=!$('legend').classList.contains('open');$('legend').classList.toggle('open',open);$('key-button').setAttribute('aria-expanded',String(open))};
 $('more').onclick=()=>toggleSettings();document.addEventListener('pointerdown',e=>{if(!$('settings').hidden&&!e.target.closest('#settings,#more'))toggleSettings(false)});
 $('quality').onchange=async e=>{qualityChoice=e.target.value;saved.set('quality',qualityChoice);if(qualityChoice==='auto'&&!autoTier)autoTier=await probeTier();applyTier(qualityChoice==='auto'?autoTier:qualityChoice)};
 $('motion').onchange=e=>{motionChoice=e.target.value;saved.set('motion',motionChoice);setCalm(motionChoice==='auto'?rmq.matches:motionChoice==='reduced')};rmq.addEventListener('change',()=>{if(motionChoice==='auto')setCalm(rmq.matches)});
 $('hold').onchange=e=>setHold(e.target.checked);$('sequence').onchange=e=>setSequence(e.target.checked);$('ribosome').onchange=e=>setCoupling(e.target.checked,true);$('read-pace').onchange=e=>setReadPace(e.target.value,true);$('read-pause').onclick=()=>skipReading();$('tab-dna').onclick=()=>{mapTab='dna';showTab('dna');updateMap(state)};$('tab-rna').onclick=()=>{mapTab='rna';showTab('rna')};$('predict').onchange=e=>setPredict(e.target.checked);$('cp-watch').onclick=()=>closeCheckpoint(true);
 $('recap-check').onclick=()=>checkRecap();$('compare-open').onclick=()=>openCompare();$('choice-compare').onclick=()=>openCompare();$('compare-close').onclick=()=>$('compare').close();$('compare-other').onclick=()=>otherEnding();$('other-ending').onclick=()=>otherEnding();$('replay').onclick=()=>{showEnd(false);$('restart').click()};$('narrate').onchange=e=>setNarrate(e.target.checked);$('present').onclick=()=>{toggleSettings(false);setPresenting(!presenting)};
 $('copy-link').onclick=()=>copyLink();$('include-camera').onchange=e=>includeCamera=e.target.checked;
 if('speechSynthesis' in window){pickVoice();speechSynthesis.addEventListener?.('voiceschanged',pickVoice)}
 addEventListener('pointermove',wake,{passive:true});$('blackout').onclick=()=>setBlackout(false);
 // Lecture figures posted by the notes page, and the embed API from a parent page (slides).
 window.addEventListener('message',event=>{
   if(event.source===window.parent&&window.parent!==window&&event.data?.kind==='transcription-3d'){const {action,value}=event.data;
     if(action==='seek'&&Number.isFinite(Number(value)))seekGuarded(Number(value));else if(action==='play')setPlaying(true);else if(action==='pause')setPlaying(false);else if(action==='chapter'&&typeof value==='string'){const c=chaptersFor(path||'rho').find(c=>slug(c.nav)===value);if(c)goChapter(c.start)}return}
   if(event.origin!==location.origin||event.source!==$('notes-frame').contentWindow||event.data?.kind!=='lecture-figure'||!event.data.src?.startsWith('data:image/'))return;$('figure-image').src=event.data.src;$('figure-image').alt=event.data.alt||'Lecture figure';$('figure-caption').textContent=event.data.alt||'';$('figure-dialog').showModal()});
 // Off-screen embeds (and hidden tabs) stop rendering.
 if('IntersectionObserver' in window)new IntersectionObserver(([e])=>{onScreen=e.isIntersecting;freezeReading(!onScreen||document.hidden);if(onScreen)requestFrame()}).observe($('viewport'));document.addEventListener('visibilitychange',()=>freezeReading(document.hidden||!onScreen));
 let resizeQueued=false;addEventListener('resize',()=>{if(resizeQueued)return;resizeQueued=true;requestAnimationFrame(()=>{resizeQueued=false;notes.resetSizes();resize()})});
 // Moving the window to a screen with another pixel density re-applies the pixel budget.
 const watchDensity=()=>matchMedia(`(resolution: ${devicePixelRatio}dppx)`).addEventListener('change',()=>{resize();watchDensity()},{once:true});watchDensity();
 // Context loss (a GPU reset, or too many tabs): pause, say so, rebuild the lost environment map on restore.
 cv.addEventListener('webglcontextlost',e=>{e.preventDefault();lostWasPlaying=lostWasPlaying||playing;setPlaying(false);$('gl-lost').hidden=false;$('gl-reload').hidden=true;clearTimeout(lostTimer);
   lostTimer=setTimeout(()=>{const q=new URLSearchParams(location.search);q.set('t',time.toFixed(1));if(path)q.set('path',path);$('gl-reload').href='?'+q;$('gl-reload').textContent=`Reload at ${clock(time)}`;$('gl-reload').hidden=false},5000)});
 cv.addEventListener('webglcontextrestored',()=>{clearTimeout(lostTimer);restoreEnvironment(renderer,[scene]);$('gl-lost').hidden=true;invalidate();if(lostWasPlaying)setPlaying(true);lostWasPlaying=false});
 document.addEventListener('visibilitychange',()=>{last=performance.now();if(!document.hidden)requestFrame()});
 // Mouse clicks leave focus on the page, so Space always plays and pauses; keyboard focus is kept.
 document.addEventListener('pointerup',e=>{if(e.pointerType!=='mouse')return;const b=e.target.closest?.('.transport button,.top-controls button,.chapters button,#legend button,.path-control button,.narration button,#end-card button,#inspector .chips button,.card-tabs button,.next-chip');if(b)setTimeout(()=>b.blur())});
 document.addEventListener('keydown',e=>{wake();
   if(e.defaultPrevented||e.metaKey||e.ctrlKey||e.altKey)return;const el=e.target;
   if(e.key==='Escape'&&!document.querySelector('dialog[open]')){if(el.type==='search'&&el.value){el.value='';el.dispatchEvent(new Event('input'));return}e.preventDefault();escape();return}
   if(el.closest?.('input:not([type=range]),select,textarea,[contenteditable]'))return;
   if(document.querySelector('dialog[open]'))return;
   if(['PageUp','PageDown','Home','End',' '].includes(e.key)&&el.closest?.('#description,#glossary,#inspector,#settings'))return;
   if((e.key.startsWith('Arrow')||e.key==='Home'||e.key==='End')&&el.closest?.('[role=toolbar],[role=tablist]'))return;
   if(el.closest?.('button,a,summary,[role=tab]')&&(e.key===' '||e.key==='Enter'))return;
   if(el===cv&&(e.key.startsWith('Arrow')||['+','=','-','_'].includes(e.key)))return;
   if(!$('notes-panel').hidden&&e.key!=='Escape')return;
   const entry=KEYMAP.find(k=>k.match(e));if(!entry)return;
   // Single-character shortcuts can be switched off under More (WCAG 2.1.4); Space, arrows, Page keys and Esc stay.
   if(!singleKeys&&e.key.length===1&&e.key!==' ')return;e.preventDefault();entry.run(e)});
}
// ---------- Inspector and 'Find a molecule' ----------
// Picking does not raycast the ~340k protein triangles: nucleic acids are tested analytically against
// their tube samples, proteins through their Cα traces (proxy points) and small parts by raycasting.
const raycaster=new THREE.Raycaster(),_ndc=new THREE.Vector2(),_pw=V(),_pc=V(),_seg=V();
const glowBase=new Map();let proxies=[],inspecting=false,pinnedKey=null,hoverHit=null,hoverQueued=null,hoverFrame=0,spotlight=null,spotlightUntil=0,highlighted=new Set();
function buildProxies(){
 const add=(key,mesh,trace,shift)=>{const pts=new Float32Array(trace.length*3);trace.forEach((p,i)=>{pts[i*3]=p[0]-(shift?.[0]||0);pts[i*3+1]=p[1]-(shift?.[1]||0);pts[i*3+2]=p[2]-(shift?.[2]||0)});proxies.push({key,mesh,pts,clip:coreMeshes.includes(mesh)})};
 metadata.meshes.forEach((r,i)=>{const mesh=surfaceMeshes.find(m=>m.userData===r)||surfaceMeshes.find(m=>m.userData.name===r.name&&m.userData.chain===r.chain);if(!mesh||!r.trace)return;
   add(r.group==='rho'?'rho':CHAIN_KEY[r.chain],mesh,r.trace,r.group==='rho'?metadata.rhoCenter:null)});
 accessories.meshes.forEach(r=>{if(r.trace)add(r.group==='sigma'?'sigma':'nusA',r.group==='sigma'?sigmaMesh:nusAMesh,r.trace)});
}
const shown=o=>{for(let x=o;x;x=x.parent)if(!x.visible)return false;return true};
// The nearest thing under the pointer, with enough detail for a one-line description.
function pick(clientX,clientY){
 _ndc.set(clientX/innerWidth*2-1,-(clientY/innerHeight)*2+1);raycaster.setFromCamera(_ndc,camera);const ray=raycaster.ray,S=state;let best=null;
 const offer=(along,hit)=>{if(along>0&&(!best||along<best.along))best={along,...hit}};
 const cutting=cutAmount>.5;
 // Small parts first: exact raycasts against a handful of meshes.
 const small=[[ribosome,'ribosome'],[ntp,'ntp'],[ppi,'ppi'],[mg,'mg'],[bridgeHelix,'bridgeHelix'],[triggerLoop.mesh,'triggerLoop'],[errorBead,'error'],[stemTube.mesh,'hairpin'],[utract,'utract']];
 for(const [o,key] of small){if(!shown(o))continue;const h=raycaster.intersectObject(o,true)[0];if(h&&(h.object.material?.opacity??1)>.15)offer(h.distance-4,{key})}
 // The promoter elements are picked through their glow sleeves (their marker rings are gone). A strand the click
 // lands on still wins (it lies in front of the sleeve's axis), and the sleeves step aside when a question asks for a strand.
 if(checkpoint?.kind!=='pick')promoterGlow.forEach((g,i)=>{if(!shown(g.mesh)||g.material.uniforms.uAmount.value<.05)return;const r=g.radius*.8;for(let j=0;j+1<g.count;j++){const d2=ray.distanceSqToSegment(g.points[j],g.points[j+1],_pc,_seg);if(d2<r*r){offer(_pc.distanceTo(ray.origin)-4,{key:['promoter35','promoter10','start'][i]});break}}});
 // Nucleic acids: distance from the ray to each tube segment.
 const tubeHit=(tb,kind,extra)=>{if(!shown(tb.mesh)||tb.material.opacity<.15)return;const r=tb.radius+1.2;for(let i=0;i+1<tb.count;i++){const d2=ray.distanceSqToSegment(tb.points[i],tb.points[i+1],_pc,_seg);if(d2<r*r)offer(_pc.distanceTo(ray.origin)-Math.sqrt(r*r-d2),{key:kind,index:i,...extra})}};
 tubeHit(dnaTubes[0],'template');tubeHit(dnaTubes[1],'coding');tubeHit(rnaTube,'rna');
 // Proteins: Cα proxies within 6 Å of the ray; the cut-away half of RNAP is skipped.
 for(const p of proxies){const m=p.mesh;if(!shown(m)||m.material.opacity<.3)continue;const e=m.matrixWorld.elements,pts=p.pts;
   for(let i=0;i<pts.length;i+=3){const x=pts[i],y=pts[i+1],z=pts[i+2];_pw.set(e[0]*x+e[4]*y+e[8]*z+e[12],e[1]*x+e[5]*y+e[9]*z+e[13],e[2]*x+e[6]*y+e[10]*z+e[14]);
     if(p.clip&&cutting&&clipPlane.distanceToPoint(_pw)<0)continue;if(ray.distanceSqToPoint(_pw)<36)offer(_pw.distanceTo(ray.origin)-4,{key:p.key,mesh:m})}}
 return best&&describe(best,S);
}
function describe(hit,S){
 const I=INFO[hit.key];if(!I)return null;const route=S.path,sign=s=>s.replace('-','−');let sub=I.short,special=false;
 if(hit.key==='template'||hit.key==='coding'){const b=dnaSamples[hit.key==='template'?0:1][hit.index]??0,n=Math.round(b+registerAt(b,S)),base=hit.key==='template'?templateBase(n,route):coding(n,route),inEl=n>=-35&&n<=-30?' · in the −35 element':n>=-12&&n<=-7?' · in the −10 element':'';
   sub=`Position ${sign(position(n))} · base ${base}${inEl}${hit.key==='template'?' · read 3′ → 5′':''}`;special=true}
 else if(hit.key==='rna'){const j=Math.min(Math.round(hit.index/3),Math.max(0,S.displayNt-1)),b=j-S.register,w=paired(b,S);sub=`Nucleotide ${j+1} of ${S.displayNt} · base ${j===ERROR.j&&S.error>.5?ERROR.wrong+' (wrong)':rnaBase(j,route)}${w>.5?` · pairs with template ${sign(position(j))}`:''}`;special=true}
 else if(hit.key==='rho'){const i=rhoMeshes.indexOf(hit.mesh);sub=`Protomer ${'ABCDEF'[i]||''} of 6 · ATP-driven RNA translocase`;special=true}
 // The hover line leads with the gene; the pinned card shows the gene separately and keeps only specifics.
 return {key:hit.key,title:I.title,sub:I.gene&&!special?`${I.gene} · ${sub}`:sub,detail:special?sub:''};
}
function hoverAt(e){if(!ready||e.pointerType==='touch'||document.querySelector('dialog[open]')||!$('notes-panel').hidden)return;hoverQueued=[e.clientX,e.clientY];if(!hoverFrame)hoverFrame=requestAnimationFrame(()=>{hoverFrame=0;const [x,y]=hoverQueued,hit=pick(x,y),tip=$('hover-tip');
   const same=(hit?.key||'')+(hit?.sub||'')===(hoverHit?.key||'')+(hoverHit?.sub||'');hoverHit=hit;if(hit){tip.innerHTML=`<b></b><small></small>`;setRich(tip.children[0],hit.title);setRich(tip.children[1],hit.sub);tip.hidden=false;const w=tip.offsetWidth,h=tip.offsetHeight;tip.style.transform=`translate3d(${Math.min(innerWidth-w-8,x+14)}px,${Math.min(innerHeight-h-8,y+14)}px,0)`;renderer.domElement.style.cursor='pointer'}else{tip.hidden=true;renderer.domElement.style.cursor=''}if(!same)invalidateView()})}
function hoverOff(){if(!hoverHit&&$('hover-tip').hidden)return;hoverHit=null;$('hover-tip').hidden=true;renderer.domElement.style.cursor='';invalidateView()}
function clickAt(e){if(!ready)return;const hit=pick(e.clientX,e.clientY);if(checkpoint?.kind==='pick'&&!cpAnswered){if(hit&&['template','coding'].includes(hit.key))answer(hit.key===checkpoint.pick?checkpoint.answer:1-checkpoint.answer);return}if(hit)openInspector(hit.key,hit.detail);else if(inspecting)closeInspector()}
function openInspector(key,detail){const I=INFO[key];if(!I)return;setPlaying(false);if(!inspecting)inspectorOpener=document.activeElement;inspecting=true;pinnedKey=key;const card=$('inspector');
 card.querySelector('h2').textContent=I.title;card.querySelector('.gene').textContent=I.gene?`Gene: ${I.gene}`:'';card.querySelector('.detail').textContent=detail||'';card.querySelector('.text').textContent=I.text;card.style.setProperty('--c',I.color);
 card.querySelector('.chips').innerHTML=I.at.map(([name,t,route])=>`<button data-t="${t}" data-route="${route||''}">${name} · ${clock(t)}${route?` (${route==='rho'?'Rho':'intrinsic'} ending)`:''}</button>`).join('');card.querySelectorAll('.chips button').forEach(b=>b.onclick=()=>{const t=Number(b.dataset.t),route=b.dataset.route;if(route&&route!==path)setPath(route);else if(!path&&t>=CHOICE_TIME)setPath('rho');goChapter(t)});enrichTree(card);
 card.querySelector('.read').onclick=()=>readNotes(I.notes);card.hidden=false;document.body.classList.add('inspecting');relayout();announce(`${I.title}. ${detail?detail+'. ':''}${I.text}`,0);$('inspector-title').focus({preventScroll:true});invalidateView()}
function closeInspector(){if(!inspecting)return;const had=$('inspector').contains(document.activeElement);inspecting=false;pinnedKey=null;$('inspector').hidden=true;if(had)refocus(inspectorOpener,$('play'));document.body.classList.remove('inspecting');relayout();invalidateView()}
// Which surfaces and tubes belong to a key.
function partsOf(key){if(key==='rnap')return coreMeshes;const chain=Object.entries(CHAIN_KEY).find(([,k])=>k===key)?.[0];if(chain)return chain==='F'?[nusGMesh]:[chainMesh[chain]].filter(Boolean);
 return {sigma:[sigmaMesh],nusA:[nusAMesh],nusG:[nusGMesh,nusGKow],ribosome:[ribSmall,ribLarge],rho:rhoMeshes,template:[dnaTubes[0].mesh,strandOutlines[0].mesh,polarity[0],rungs[0],templateStubs],coding:[dnaTubes[1].mesh,strandOutlines[1].mesh,polarity[1],rungs[1]],rna:[rnaTube.mesh,rnaOutline.mesh,polarity[2],rnaStubs],ntp:[ntp],ppi:[ppi],mg:[mg],bridgeHelix:[bridgeHelix],triggerLoop:[triggerLoop.mesh],hairpin:[stemTube.mesh],utract:[utract],error:[errorBead]}[key]||[]}
// A soft rim on whatever is hovered, pinned or spotlit. It runs after updateMolecules, which rewrites emissive values.
function applyHighlight(){
 for(const m of highlighted){const u=m.material?.userData?.uniforms;if(u?.uRim)u.uRim.value=.2}highlighted.clear();for(const [mat,v] of glowBase)mat.emissiveIntensity=v;glowBase.clear();
 const keys=[hoverHit?.key,pinnedKey,spotlight&&performance.now()<spotlightUntil?spotlight:null].filter(Boolean);
 for(const key of keys)for(const m of partsOf(key)){const u=m.material?.userData?.uniforms;if(u){if(u.uRim){u.uRim.value=key===spotlight?1.1:.75;highlighted.add(m)}}else if(m.material){if(!glowBase.has(m.material))glowBase.set(m.material,m.material.emissiveIntensity);m.material.emissiveIntensity=Math.max(m.material.emissiveIntensity,.35)}}
}
// Spotlight: the molecule keeps a strong rim and everything else fades to 35% for 2.5 s.
function spot(key){spotlight=key;spotlightUntil=performance.now()+2500;invalidate();clearTimeout(spot.timer);spot.timer=setTimeout(()=>{spotlight=null;invalidate()},2550)}
function dimForSpotlight(){if(!spotlight||performance.now()>=spotlightUntil)return;const keep=new Set(partsOf(spotlight));
 const keepMats=new Set([...keep].map(m=>m.material)),done=new Set();for(const m of [...surfaceMeshes,dnaTubes[0].mesh,dnaTubes[1].mesh,rnaTube.mesh,...strandOutlines.map(o=>o.mesh),rnaOutline.mesh,...polarity,rungs[0],rungs[1],templateStubs,rnaStubs]){const mat=m.material;if(keepMats.has(mat)||done.has(mat)||mat.opacity<=.02)continue;done.add(mat);fade(mat,mat.opacity*.35)}sceneDirty=true}
// When each molecule is on screen, for 'Not in this scene · joins at 1:25'.
const PRESENT={sigma:[0,91],nusA:[81.5,null],nusG:[85,null],rho:[CHOICE_TIME,201],rna:[56,null],template:[4,null],coding:[4,null]};
function findMolecule(key,quiet=false){const [a,b]=PRESENT[key]||[0,null],here=time>=a&&(b===null||time<b)&&(key!=='rho'||path==='rho');
 if(!here){if(!quiet){const when=key==='rho'&&path!=='rho'?'appears on the Rho-dependent ending':time<a?`joins at ${clock(a)}`:'has left by now';toast(`${INFO[key]?.title||'RNA polymerase'} is not in this scene · it ${when}.`,2600)}return false}
 spot(key);if(!quiet&&!INFO[key])announce(`RNA polymerase core: α₂ββ′ω, the catalytic core.`,300);return true}
function roving(group,activate){const items=()=>[...group.querySelectorAll('button')].filter(b=>b.offsetParent!==null);const set=cur=>items().forEach(b=>b.tabIndex=b===cur?0:-1);set(group.querySelector('[aria-selected=true]')||items()[0]);
 group.addEventListener('focusin',e=>{if(e.target.matches('button'))set(e.target)});
 group.addEventListener('keydown',e=>{const list=items(),i=list.indexOf(document.activeElement);if(i<0)return;let j=null;if(e.key==='ArrowRight'||e.key==='ArrowDown')j=(i+1)%list.length;else if(e.key==='ArrowLeft'||e.key==='ArrowUp')j=(i-1+list.length)%list.length;else if(e.key==='Home')j=0;else if(e.key==='End')j=list.length-1;if(j===null)return;e.preventDefault();list[j].focus();if(activate)list[j].click()})}
class StartError extends Error{constructor(title,body,code){super(title);this.title=title;this.body=body;this.code=code}}
const download={total:0,got:0};
function showProgress(){const mb=x=>(x/1048576).toFixed(1),known=download.total&&download.got<=download.total*1.01;$('load-detail').textContent=known?`Molecular structures · ${mb(download.got)} / ${mb(download.total)} MB`:`Molecular structures · ${mb(download.got)} MB`;$('load-bar').style.width=known?`${(100*download.got/download.total).toFixed(1)}%`:'35%'}
// Fetch with a byte count for the progress bar, and an error that names the file.
async function load(url,type){
 let r;try{r=await fetch(url)}catch(e){throw new StartError('The files could not be downloaded',`The request for ${url} failed. Check that the local server is still running, then retry.`)}
 if(!r.ok)throw new StartError('A required file is missing',`Could not load ${url} (HTTP ${r.status}).`);
 download.total+=Number(r.headers.get('Content-Length'))||0;
 if(!r.body){const out=type==='json'?await r.json():await r.arrayBuffer();return out}
 const reader=r.body.getReader(),parts=[];let got=0;
 for(;;){const {done,value}=await reader.read();if(done)break;parts.push(value);got+=value.byteLength;download.got+=value.byteLength;showProgress()}
 const bytes=new Uint8Array(got);let o=0;for(const p of parts){bytes.set(p,o);o+=p.byteLength}
 return type==='json'?JSON.parse(new TextDecoder().decode(bytes)):bytes.buffer;
}
function fail(e){console.error(e);$('error-description').onclick=()=>{document.body.classList.add('no-scene');$('loader').hidden=true;buildDescription();$('description').hidden=false;$('description-close').hidden=true};$('loader').classList.add('failed');$('loader').classList.remove('hidden');$('load-error').hidden=false;$('error-title').textContent=e.title||'The scene could not start';$('error-body').textContent=e.body||e.message||String(e);
 if(e.code){$('error-code').hidden=false;$('error-code').textContent=e.code}$('error-retry').onclick=()=>location.reload();$('error-retry').focus()}
async function init(){
 // Opened from disk, the page's own script has said how to serve it (index.html).
 if(location.protocol==='file:')return;
 if(!document.createElement('canvas').getContext('webgl2'))throw new StartError('This browser cannot show the 3D scene','It needs WebGL 2. Use a current version of Chrome, Edge, Firefox or Safari, and check that hardware acceleration is switched on.');
 try{renderer=createRenderer({antialias:false,exposure:.95})}catch(e){throw new StartError('The graphics card could not be started','The browser refused a WebGL 2 context. Close other 3D pages or restart the browser, then retry.')}renderer.setSize(innerWidth,innerHeight);renderer.localClippingEnabled=true;$('viewport').append(renderer.domElement);
 scene.background=new THREE.Color(0x070e17);scene.fog=new THREE.FogExp2(0x070e17,.00022);camera=new THREE.PerspectiveCamera(36,innerWidth/innerHeight,4,6500);camera.position.set(110,175,-490);
 // Teaching frame: every shot looks at the DNA-binding cleft with world −y up, so upstream is on the
 // left, downstream on the right and the RNA leaves upward, as in the lecture figures.
 camera.up.set(0,-1,0);controls=new OrbitControls(camera,renderer.domElement);controls.enableDamping=true;controls.dampingFactor=.08;controls.minDistance=40;controls.maxDistance=4500;
 // A sky light, and key, fill and rim lights fixed to the camera, so shots are never lit from below; a room environment.
 studio(scene,camera,renderer);
 const [m,b,a,ab,lm,pr]=await Promise.all([load('assets/structure.json','json'),load('assets/molecular_surfaces.bin'),load('assets/accessories.json','json'),load('assets/accessories.bin'),load('assets/landmarks.json','json'),load('assets/promoter.json','json')]);$('load-bar').style.width='100%';metadata=m;accessories=a;landmarks=lm.landmarks;traces=lm.traces;promoter=pr;
 const colors={A:0x3a8b83,B:0x3f78a3,C:0x577f91,D:0x476d80,E:0x719b8a,F:0xa8743a,a:0x9875b8,b:0x8967a9,c:0x785799,d:0x775b95,e:0x8568a4,f:0x9577b6};
 m.meshes.forEach(record=>{const mesh=surface(record,b,colors[record.chain]);if(record.group==='rho'){mesh.geometry=mesh.geometry.clone().translate(-m.rhoCenter[0],-m.rhoCenter[1],-m.rhoCenter[2]);mesh.userData.rhoIndex=rhoMeshes.length;rho.add(mesh);rhoMeshes.push(mesh)}else if(record.group==='nusg'){if(record.part==='kow'){nusGKow=mesh;kowPivot=new THREE.Group();kowPivot.position.set(...record.pivot);mesh.position.set(-record.pivot[0],-record.pivot[1],-record.pivot[2]);kowPivot.add(mesh);nusG.add(kowPivot);kowRest.set(...record.center).sub(kowPivot.position).normalize()}else{nusG.add(mesh);nusGMesh=mesh}}else{mesh.userData.out=V(...record.center).normalize();core.add(mesh);coreMeshes.push(mesh);chainMesh[record.chain]=mesh}});
 a.meshes.forEach(record=>{const mesh=surface(record,ab,record.group==='sigma'?0xe987a3:NUSA);if(record.group==='sigma'){sigma.add(mesh);sigmaMesh=mesh}else{nusA.add(mesh);nusAMesh=mesh}});
 nusGKow.material.dispose();nusGKow.material=nusGMesh.material;surfaceMeshes=[...coreMeshes,...rhoMeshes,sigmaMesh,nusAMesh,nusGMesh,nusGKow];[nusAMesh,nusGMesh].forEach(m=>m.material.emissive.copy(m.material.color));nusAApproach.copy(V(...nusAMesh.userData.center)).normalize();nusGApproach.copy(V(...nusGMesh.userData.center)).normalize();
 makeGeometry();pipeline=createPipeline(renderer,scene,camera);({composer,ao,bloom,fxaa}=pipeline);
 buildProxies();notes=createLabels($('annotations'),$('leaders'),$('scene-now'));document.querySelectorAll('#legend [data-actor]').forEach(el=>legendItem[el.dataset.actor]=el);relayout();
 motionChoice=saved.get('motion')||'auto';buildDetails();setDetails((saved.get('details')||'').split(','));if(saved.get('ribosome')==='1')setCoupling(true);if(saved.get('readPace'))setReadPace(saved.get('readPace'));setCalm(motionChoice==='auto'?rmq.matches:motionChoice==='reduced');
 populateNavigation();bind();ready=true;$('load-detail').textContent='Compiling shaders';
 // Compile every material (in parallel where the driver allows), then draw one frame from each act
 // behind the loader, so the post-processing and cutaway variants never stall the first play-through.
 try{await renderer.compileAsync(scene,camera)}catch(e){}
 for(const [t,route] of [[12,'rho'],[36,'rho'],[60,'rho'],[113,'rho'],[150,'intrinsic']]){path=route;setTime(t);renderNow()}path=null;setTime(0);
 const query=new URLSearchParams(location.search),asked=query.get('quality');qualityChoice=TIERS[asked]||asked==='auto'?asked:saved.get('quality')||'auto';if(!TIERS[qualityChoice])qualityChoice='auto';$('quality').value=qualityChoice;
 $('load-detail').textContent='Measuring graphics speed';if(qualityChoice==='auto')autoTier=await probeTier();applyTier(qualityChoice==='auto'?autoTier:qualityChoice);
 $('load-detail').textContent='Preparing the complete cycle';const autoplay=parseQuery(query);renderNow();$('loader').classList.add('hidden');setTimeout(()=>{$('loader').hidden=true},800);announce('The animation is ready. Space plays and pauses, D opens a text description, and the question mark lists the shortcuts.',400);if(autoplay)setPlaying(true);
 addEventListener('error',e=>toast(`Something went wrong: ${e.message}`));addEventListener('unhandledrejection',e=>toast(`Something went wrong: ${e.reason?.message||e.reason}`));
 window.fullCycle={seek:t=>{setTime(t);renderNow()},play:setPlaying,choose:setPath,state:()=>({...state,playing,exploring,path,corePosition:corePos.toArray(),rhoPosition:rhoPos.toArray(),sigmaPosition:sigma.position.toArray(),camera:camera.position.toArray(),cameraTarget:controls.target.toArray(),choiceVisible:$('path-choice').open}),rnaPoint:j=>rnaPoint(j).toArray(),dnaAt:(t,strand,n,route=path||'rho')=>{const S=cycleState(t,route);if(S.open>0)prepareLinkers(S);return dnaPoint(strand,materialToB(n,S),S,V()).toArray()},rnaAt:(t,j,route=path||'rho')=>rnaPoint(j,cycleState(t,route)).toArray(),
   audit:()=>({coreChains:coreMeshes.length,rhoChains:rhoMeshes.length,accessories:accessories.meshes.map(m=>({name:m.name,source:m.source,alignment:m.alignment})),rnaPoints:rnaTube.points.slice(0,rnaTube.count).map(p=>p.toArray()),dnaHelix:{radius:phase.radius,phaseResidualDegrees:phase.residual,basePairs:materialMax-materialMin+1,initiationRise:initStretch},hybridPairs:9,hairpinPairs:9,uridines:7}),
   render:renderNow,
   quality:()=>({choice:qualityChoice,tier,autoTier,pixelRatio:renderer.getPixelRatio(),samples:composer.renderTarget1.samples,ao:ao.enabled,bloom:bloom.enabled,fxaa:fxaa.enabled}),
   // Textbook orientation check: downstream must point screen-right in every guided shot, and the
   // promoter elements must read −35, −10, +1 from left to right in the closed complex.
   // σ regions against the promoter elements in the closed complex (40 s).
   promoterContacts:(when=40)=>{const saved=time;setTime(when);renderNow();const an=accessories.meshes.find(m=>m.group==='sigma').anchors,at=k=>sigma.position.clone().add(V(...an[k])),out={sigma4ToMinus35:+at('sigma4').distanceTo(promoterLabels[0].marker.position).toFixed(1),sigma2ToMinus10:+at('sigma2').distanceTo(promoterLabels[1].marker.position).toFixed(1)};setTime(saved);renderNow();return out},
   orientation:()=>{const saved=[time,path,state],result={};
     for(const route of ['rho','intrinsic']){path=route;let min=1,at=0;const low=[],promoter=[];
       for(let t=6;t<=endTime(route);t+=.25){state=cycleState(t,route);updateMolecules();setGuideCamera();const right=V().setFromMatrixColumn(camera.matrixWorld,0),d=dnaPoint(0,150,state,V()).sub(dnaPoint(0,-150,state,V())).normalize(),dot=right.dot(d);if(dot<min){min=dot;at=t}if(dot<.35)low.push(+t.toFixed(2));
         if(t>=34&&t<=44&&t%2===0){const x=promoterLabels.map(p=>p.marker.position.clone().project(camera).x);promoter.push(x[0]<x[1]&&x[1]<x[2])}}
       result[route]={minRightDotDownstream:+min.toFixed(3),at,lowTimes:low.slice(0,40),promoterLeftToRight:promoter.every(Boolean)}}
     [time,path,state]=saved;setTime(time);renderNow();return result}};
 if(query.get('debug')==='1')Object.assign(window.fullCycle,{
   // How many of a molecule's Cα proxies lie within lim Å of a DNA strand axis: a clash count (DNA contacts included).
   dnaContacts:(key,t,lim=6,where=false)=>{setTime(t);renderNow();let n=0;const e=V(),q=lim*lim,at={};for(const px of proxies){if(px.key!==key||!shown(px.mesh))continue;const m=px.mesh.matrixWorld;for(let i=0;i<px.pts.length;i+=3){e.set(px.pts[i],px.pts[i+1],px.pts[i+2]).applyMatrix4(m);let hit=null;for(const [k,tb] of dnaTubes.entries()){for(let j=0;j<tb.count;j++)if(tb.points[j].distanceToSquared(e)<q){hit=Math.round(dnaSamples[k][j]);break}if(hit!==null)break}if(hit!==null){n++;at[hit]=(at[hit]||0)+1}}}return where?at:n},
   bendScales:()=>Object.fromEntries(Object.entries(bendStages).map(([k,v])=>[k,v.slice(0,4).map(x=>+x.scale.toFixed(3))])),
   // What a click on the middle of each promoter glow opens (the inspector key).
   // (the element's key if any click within 10 px of the glow's middle opens it)
   promoterPicks:()=>promoterGlow.map((g,i)=>{const q=g.points[Math.floor(g.count/2)].clone();world.localToWorld(q).project(camera);const x=(q.x+1)/2*innerWidth,y=(1-q.y)/2*innerHeight,want=['promoter35','promoter10','start'][i],keys=[];for(let dx=-10;dx<=10;dx+=5)for(let dy=-10;dy<=10;dy+=5)keys.push(pick(x+dx,y+dy)?.key);return keys.includes(want)?want:keys[12]??null}),
   // Glow strengths: promoter −35, −10 and +1, and the terminator; and whether any promoter ring meshes remain.
   glows:t=>{setTime(t);renderNow();return {promoter:promoterGlow.map(g=>g.mesh.visible?+g.material.uniforms.uAmount.value.toFixed(3):0),terminator:terminatorGlow.mesh.visible?+terminatorGlow.material.uniforms.uAmount.value.toFixed(3):0,rings:promoterGroup.children.filter(o=>o.isMesh&&!promoterGlow.some(g=>g.mesh===o)&&o.visible).length}},
   // How the looped search segment meets the promoter DNA: gap (Å) and bend (°) where each strand joins.
   loopJoin:t=>{setTime(t);renderNow();return searchStrands.map((tb,k)=>{const n=tb.count,end=tb.points[n-1],main=dnaTubes[k].points,a=end.clone().sub(tb.points[n-2]).normalize(),b0=materialToB(materialMin,state),b=dnaPoint(k,b0+.05,state,V()).sub(dnaPoint(k,b0,state,V())).normalize();return {gap:+end.distanceTo(main[0]).toFixed(3),model:+end.distanceTo(dnaPoint(k,materialToB(materialMin,state),state,V())).toFixed(3),bend:+(Math.acos(clamp(a.dot(b),-1,1))/DEG).toFixed(1)}})},
   // Closest approach (Å) between a molecule's Cα proxies and the DNA strands' axes (strand tube centres).
   clearance:(key,t)=>{setTime(t);renderNow();const pts=[];for(const px of proxies){if(px.key!==key||!shown(px.mesh))continue;const e=px.mesh.matrixWorld;for(let i=0;i<px.pts.length;i+=3)pts.push(V(px.pts[i],px.pts[i+1],px.pts[i+2]).applyMatrix4(e))}
     let min=1e9;for(const tb of [dnaTubes[0],dnaTubes[1],...(searchGroup.visible?searchStrands:[])])for(let i=0;i<tb.count;i+=2){const q=tb.points[i];for(const p of pts){const d=p.distanceToSquared(q);if(d<min)min=d}}return pts.length?+Math.sqrt(min).toFixed(1):null},
   tubeWinding:t=>{setTime(t);renderNow();const A=V(),B=V(),C=V(),N=V();return [dnaTubes[0],dnaTubes[1],rnaTube].map(tb=>{const g=tb.mesh.geometry,P=g.attributes.position,Nm=g.attributes.normal,I=g.index.array,end=Math.min(I.length,g.drawRange.count);let ok=0,all=0;for(let i=0;i+2<end;i+=3){A.fromBufferAttribute(P,I[i]);B.fromBufferAttribute(P,I[i+1]);C.fromBufferAttribute(P,I[i+2]);N.fromBufferAttribute(Nm,I[i]);const f=B.sub(A).cross(C.sub(A));if(f.lengthSq()<1e-12)continue;all++;if(f.dot(N)>0)ok++}return all?+(ok/all).toFixed(3):null})},dnaMarks:t=>{setTime(t);renderNow();return {cones:[polarity[0],polarity[1]].map(m=>m.visible?+m.material.opacity.toFixed(3):0),strands:[dnaTubes[0],dnaTubes[1]].map(tb=>tb.mesh.visible?+tb.material.opacity.toFixed(3):0)}},bloomGuard:()=>bloom.materialHighPassFilter.fragmentShader.includes('clamp( texture2D( tDiffuse, vUv )'),reading:()=>reading.debug(),pipeline:(o={})=>{if('samples' in o)for(const rt of [composer.renderTarget1,composer.renderTarget2]){rt.samples=o.samples;rt.dispose()}if('bloom' in o)bloom.enabled=o.bloom;if('fxaa' in o)fxaa.enabled=o.fxaa;composer.setSize(innerWidth,innerHeight);invalidate();return window.fullCycle.quality()},perf:()=>{const info=renderer.info;info.autoReset=false;info.reset();renderNow();const out={calls:info.render.calls,triangles:info.render.triangles,geometries:info.memory.geometries,textures:info.memory.textures,programs:info.programs?.length};info.autoReset=true;return out},labels:()=>notes.snapshot(),actors:(t,route=path||'rho')=>{const keep=[time,path,state];path=route;state=cycleState(t,route);updateMolecules();const w=o=>o.getWorldPosition(V()).toArray(),out={core:corePos.toArray(),sigma:sigma.visible?sigma.position.toArray():null,rho:rho.visible?rho.position.toArray():null,ribSmall:ribosome.visible&&ribSmall.material.opacity>.05?w(ribSmall):null,ribLarge:ribosome.visible&&ribLarge.material.opacity>.05?w(ribLarge):null,kow:w(nusGKow)};[time,path,state]=keep;invalidate();return out},searchClearance:t=>{setTime(t);renderNow();const pts=[];for(const px of proxies){if(!['alphaI','alphaII','beta','betaPrime','omega','sigma'].includes(px.key)||!shown(px.mesh))continue;const e=px.mesh.matrixWorld;for(let i=0;i<px.pts.length;i+=3)pts.push(V(px.pts[i],px.pts[i+1],px.pts[i+2]).applyMatrix4(e))}const near=(tb,lim)=>{let n=0,min=1e9;for(let i=0;i<tb.count;i+=2){const q=tb.points[i];for(const p of pts){const d=p.distanceToSquared(q);if(d<min)min=d;if(d<lim*lim){n++;break}}}return {inside:n,min:+Math.sqrt(min).toFixed(1)}};const arc=searchGroup.children.filter(c=>c.isMesh&&!c.isInstancedMesh);return {mainDNA:near(dnaTubes[0],6),arc:searchGroup.visible?{inside:0}:null}},ribosomeClearance:t=>{setTime(t);renderNow();if(!ribosome.visible)return null;const out={};for(const [name,lobe] of [['small',ribSmall],['large',ribLarge]]){lobe.updateMatrixWorld();const inv=lobe.matrixWorld.clone().invert(),r=lobe.geometry.parameters?null:null,R=name==='small'?[66,40,52]:[90,70,82],inside=(p,m=1.08)=>{const q=p.clone().applyMatrix4(inv);return (q.x/R[0])**2+(q.y/R[1])**2+(q.z/R[2])**2<m*m};const count={};for(const px of proxies){if(!shown(px.mesh))continue;const e=px.mesh.matrixWorld;let n=0;for(let i=0;i<px.pts.length;i+=3)if(inside(V(px.pts[i],px.pts[i+1],px.pts[i+2]).applyMatrix4(e)))n++;if(n)count[px.key]=(count[px.key]||0)+n}for(const [k,tb] of [['template',dnaTubes[0]],['coding',dnaTubes[1]],['rna',rnaTube]]){let n=0;for(let i=0;i<tb.count;i++)if(inside(tb.points[i],1))n++;if(n)count[k]=n}out[name]=count}return out},pick:(x,y)=>pick(x,y),screen:name=>{const p={mg:mg.position,core:corePos,tip:rnaPoint(Math.max(0,state.ntCount-1)),sigma:sigma.position.clone().add(V(...sigmaMesh.userData.center)),dna:dnaPoint(0,40,state,V()),template:dnaPoint(0,-5,state,V()),coding:dnaPoint(1,-5,state,V())}[name].clone().project(camera);return [(p.x+1)*innerWidth/2,(1-p.y)*innerHeight/2]},loseContext:()=>renderer.forceContextLoss(),restoreContext:()=>renderer.forceContextRestore(),luminance:()=>{renderNow();const gl=renderer.getContext(),w=gl.drawingBufferWidth,h=gl.drawingBufferHeight,px=new Uint8Array(4*64*64);gl.readPixels(w/2-32|0,h/2-32|0,64,64,gl.RGBA,gl.UNSIGNED_BYTE,px);let sum=0;for(let i=0;i<px.length;i+=4)sum+=.2126*px[i]+.7152*px[i+1]+.0722*px[i+2];return sum/(64*64)}});
 requestFrame();
}
// Geometry is rebuilt only when the scene changes, so DNA, RNA and RNAP always move together.
let pendingCheckpoint=null,labelsGliding=false,wasCoasting=false;
// ---------- Reading pauses ----------
// ../shared/reading.mjs holds text on screen long enough to read (narration, callouts, brackets, act cards; not the small
// tags) and brakes before unread text would leave. The film describes its script to it: what is shown, when the
// narration changes (its timed parts and chapters, held before the camera moves), which callouts a moment shows (a dry
// run of annotations()), its camera blends and when the act cards fade.
const narrationShown=()=>{const b=document.body.classList;return !embed&&!(innerHeight<=560&&!b.contains('show-text'))&&!['glossing','predicting','at-end','exploring'].some(c=>b.contains(c))};
function copyPart(c,t){return typeof c.copy==='string'?0:Math.max(0,c.copy.filter(p=>t>=p.at).length-1)}
const narrationKey=(c,t)=>`N:${c.start>=CHOICE_TIME?path||'-':'shared'}:${c.nav}:${copyPart(c,t)}`;
const actText=A=>`${A.numeral} ${A.title} ${typeof A.sub==='string'?A.sub:A.sub[path==='intrinsic'?'intrinsic':'rho']}`;
// An act card fades 2.1 s after it begins, or once a camera move running then has finished.
function actFade(A){const end=(A.card??actStart(A,path||'rho'))+2.1,w=blendWindows().find(([w0,w1])=>end>w0&&end<w1);return w?w[1]:end}
// Which labels and brackets the script asks for at time t (a dry run of annotations()).
const recorder={keys:new Set(),begin(){},label(a,title){this.keys.add(keyOf('L:'+title))},tag(){},bracket(a,b,text){this.keys.add(keyOf('B:'+text))},end(){return false}};
function probeKeys(t){const keep=state,keepNotes=notes;recorder.keys=new Set();state=cycleState(t,path||'rho');notes=recorder;try{annotations(0)}finally{state=keep;notes=keepNotes}return recorder.keys}
// Camera blends [start, end) in animation time; a pause never freezes the camera mid-move.
function blendWindows(){return [...COMMON_SHOTS,...ENDING_SHOTS[path||'rho']].filter(s=>s.blend).map(s=>{const b=calm?Math.min(s.blend,1.2):s.blend,w0=s.start-b*(s.lead??.35);return [w0,w0+b]})}
const reading=createReading({chip:$('read-pause'),focus:$('play'),speed:()=>speed,calm:()=>calm,active:()=>!embed&&ready,
 shown:()=>{const out=[],phone=innerWidth<=600;
   for(const it of notes.shown())if(!it.key.startsWith('T:')){const text=phone?it.title:it.text;out.push({key:keyOf(it.key),text,callout:true})}
   // With read-aloud on, the voice paces the narration (playback waits for it at chapter ends).
   const c=currentChapter();if(c&&narrationShown()&&!narrate){const part=copyPart(c,time),text=copyAt(chapterText(c),time);out.push({key:narrationKey(c,time),text,words:wordCount(text)+(part===0?wordCount(plain(c.title)):0)})}
   if(cardShown&&Number($('act-card').style.opacity)>.5){const A=ACTS.find(a=>a.title===cardShown);if(A)out.push({key:`A:${A.title}`,text:actText(A)})}
   return out},
 // The narration changes at its next timed part or at the next chapter (held before the camera moves); with Hold at
 // chapter ends (or the voice still reading) the chapter hold itself waits there instead.
 narration:t0=>{const c=currentChapter(),s=nextChapterStart(t0),at=typeof c?.copy==='string'?null:c?.copy.find(p=>p.at>t0+1e-6)?.at,beat=s!==null?holdTime(s):null;
   return {key:c&&narrationKey(c,t0),turn:Math.min(at??Infinity,beat??Infinity),next:s,beat,held:s!==null&&s!==skipHold&&(path||s<CHOICE_TIME)&&(holdEnds||narrate&&speaking)}},
 probe:probeKeys,windows:blendWindows,fades:()=>ACTS.map(A=>({key:`A:${A.title}`,t:actFade(A)}))});
const trackReading=now=>reading.track(now),unread=now=>reading.unread(now),readingNext=(t0,dt,rate)=>reading.next(t0,dt,rate),readHolding=()=>reading.holding,freezeReading=frozen=>reading.freeze(frozen);
// The chip (or →, ] or Page Down, a presenter's clicker) goes on; Space still pauses.
function skipReading(){reading.skip();requestFrame()}
function setReadPace(value,remember=false){value=reading.setPace(value);$('read-pace').value=value;syncURL();
 if(remember){saved.set('readPace',value);toast(reading.enabled?`Reading pauses: ${value}. Playback waits until text has been on screen long enough to read.`:'Reading pauses off: playback runs straight on.',2600)}}
function frame(now){
 if(!onScreen){looping=false;return}
 // Cap the step so one slow frame at 5× cannot jump the animation by seconds.
 const raw=now-last,dt=Math.max(0,Math.min(1/20,raw/1000||0));last=now;
 // Auto quality steps down one tier if the 2-s median frame stays above 24 ms on two checks in a row.
 if(playing&&!document.hidden&&qualityChoice==='auto'&&tier!=='low'){const next=pipeline.govern(raw,now);if(next){applyTier(next);autoTier=next;toast(`Graphics lowered to ${TIERS[next].label} to keep playback smooth. Change it under More.`,4000)}}
 if(playing&&!document.hidden&&!waitSpeech){
   // The chemistry plays at 1× even when the movie is sped up.
   let next=readingNext(time,dt,speed>1&&inChemistry(time)?1:speed),stop=false,hold=null;
   if(skipHold!==null&&time>=skipHold)skipHold=null;
   // Precedence: a prediction checkpoint, chapter loop, clip end, hold at a chapter end (or waiting for the voice), then the choice.
   const cp=checkpointAhead(time,next);if(cp){next=cp.t;stop=true;pendingCheckpoint=cp}
   else if(loopRange&&next>=loopRange[1]){next=loopRange[0];resumeGuide()}
   else if(endAt!==null&&time<endAt&&next>=endAt){if(loopClip){next=clipStart;resumeGuide()}else{next=endAt;stop=true}}
   const s=nextChapterStart(time);
   if(!stop&&s!==null&&s!==skipHold&&(path||s<CHOICE_TIME)&&(holdEnds||narrate&&speaking)){const h=holdTime(s);if(time<h&&next>=h){next=h;if(narrate&&speaking){waitSpeech=true;speechHold=s;holdAfterSpeech=holdEnds}else hold=s}}
   if(!path&&time<CHOICE_TIME&&next>=CHOICE_TIME){time=CHOICE_TIME;showChoice()}
   else{time=Math.min(endTime(path),next);if(time>=endTime(path)||stop)setPlaying(false);else if(hold!==null){setPlaying(false,{hold:true});showContinue(hold)}}
   if(pendingCheckpoint){const c=pendingCheckpoint;pendingCheckpoint=null;showCheckpoint(c)}
   state=cycleState(time,path||'rho');sceneDirty=true;
 }
 if(sceneDirty){updateMolecules();updateText();sceneDirty=false;viewDirty=true}
 // A wheel tick while guided eases the shot in or out.
 if(zoomShown!==userZoom){zoomShown+=(userZoom-zoomShown)*(1-Math.exp(-dt/.12));if(Math.abs(zoomShown-userZoom)<1e-3)zoomShown=userZoom;viewDirty=true}
 // Orbit damping keeps the view moving for a few frames after the pointer is released.
 const coasting=exploring&&controls.update();if(coasting)viewDirty=true;
 if(!exploring&&(viewDirty||resumeFrom))setGuideCamera();
 // Zooming changes the minimum strand widths, so a large enough zoom step rebuilds the molecules next frame.
 if(Math.abs(viewScale()/pxPerA-1)>.04)sceneDirty=true;
 let gliding=false;if(viewDirty||resumeFrom||labelsGliding){camera.updateMatrixWorld();updateClipping();gliding=annotations(snapLabels?1:dt);trackReading(performance.now());snapLabels=false;updateCompass();applyHighlight();render();viewDirty=false}labelsGliding=gliding;
 // Save an Explore view to the address bar once the orbit has stopped coasting.
 if(wasCoasting&&!coasting&&exploring)syncURL();wasCoasting=coasting;pipeline.recordWork(performance.now()-now);
 if(playing||resumeFrom||coasting||sceneDirty||viewDirty||labelsGliding||zoomShown!==userZoom)requestAnimationFrame(frame);else{looping=false;if(tier==='low'){clearTimeout(refineTimer);refineTimer=setTimeout(refine,350)}}
}
init().catch(fail);
