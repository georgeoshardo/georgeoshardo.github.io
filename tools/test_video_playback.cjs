const vm=require('node:vm'), fs=require('node:fs'), assert=require('node:assert/strict');
function events(o={}){const l={};o.addEventListener=(k,f)=>(l[k]??=[]).push(f);o.fire=k=>(l[k]||[]).forEach(f=>f());return o;}
const timers=[];const observers=[];const attrs=new Map();
const video=events({paused:true,ended:false,currentTime:8,error:null,dataset:{srcSmall:'720.mp4',srcLarge:'1080.mp4'},getBoundingClientRect:()=>({width:300}),hasAttribute:k=>attrs.has(k),removeAttribute:k=>attrs.delete(k),load(){this.paused=true;this.error=null;},play(){this.paused=false;return Promise.resolve()},pause(){this.paused=true;}});
Object.defineProperty(video,'src',{get:()=>attrs.get('src'),set:s=>attrs.set('src',s)});
const button=events({});const figure={querySelector:s=>s==='video'?video:button};
const media=events({matches:false}),connection=events({saveData:false});
const document=events({hidden:false,querySelector:()=>figure});
class IO{constructor(f){observers.push(f)}observe(){}}
const window=events({matchMedia:()=>media,IntersectionObserver:IO,devicePixelRatio:2});
vm.runInNewContext(fs.readFileSync('assets/js/mother-machine-video.js','utf8'),{document,window,navigator:{connection},IntersectionObserver:IO,setTimeout:f=>(timers.push(f),timers.length),clearTimeout:()=>{}});
const flush=()=>new Promise(r=>setImmediate(r));
(async()=>{observers.forEach(f=>f([{isIntersecting:true,intersectionRatio:1}]));await flush();assert.equal(video.paused,false);
video.error={code:2};video.paused=true;video.fire('error');
for(let i=0;i<4&&timers.length;i++){timers.shift()();await flush();}
assert.ok(video.src && !video.paused,'A temporary media error must recover without clicking a play button');
video.ended=true;video.paused=true;video.fire('ended');await flush();assert.equal(video.currentTime,0);assert.equal(video.paused,false);
document.hidden=true;document.fire('visibilitychange');assert.equal(video.paused,true);
document.hidden=false;document.fire('visibilitychange');await flush();assert.equal(video.paused,false);
window.fire('pagehide');assert.equal(video.paused,true);
window.fire('pageshow');await flush();assert.equal(video.paused,false);
media.matches=true;media.fire('change');assert.equal(video.paused,true);assert.equal(video.autoplay,false);
media.matches=false;media.fire('change');await flush();assert.equal(video.paused,false);
connection.saveData=true;connection.fire('change');assert.equal(video.paused,true);
connection.saveData=false;connection.fire('change');await flush();assert.equal(video.paused,false);
observers[1]([{isIntersecting:false,intersectionRatio:0}]);assert.equal(video.paused,true);
observers[1]([{isIntersecting:true,intersectionRatio:1}]);await flush();assert.equal(video.paused,false);
console.log('PASS: media recovery, loop fallback, tab/history resume, reduced motion, data saving and offscreen pause');
})().catch(e=>{console.error(e.message);process.exitCode=1});
