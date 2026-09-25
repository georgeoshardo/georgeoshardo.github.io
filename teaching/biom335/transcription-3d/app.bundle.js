(()=>{var Lr={LEFT:0,MIDDLE:1,RIGHT:2,ROTATE:0,DOLLY:1,PAN:2},Ur={ROTATE:0,PAN:1,DOLLY_PAN:2,DOLLY_ROTATE:3},px=0,am=1,mx=2;var lm=1,gx=2,Es=3,ji=0,bn=1,vi=2,Rn=0,mo=1,Fr=2,cm=3,hm=4,Fu=5,Ji=100,xx=101,yx=102,_x=103,vx=104,Dc=200,bx=201,Mx=202,Sx=203,ou=204,au=205,Ou=206,wx=207,Bu=208,Ax=209,Tx=210,Ex=211,Rx=212,Cx=213,Px=214,ku=0,zu=1,Hu=2,go=3,Vu=4,Gu=5,Wu=6,Xu=7,qu=0,Ix=1,Nx=2,Qs=0,$u=1,Yu=2,Zu=3,Za=4,Ku=5,ju=6,Ju=7;var um=300,Ao=301,To=302,Qu=303,ed=304,Lc=306,xo=1e3,Cr=1001,lu=1002,kn=1003,Dx=1004;var Uc=1005;var Qi=1006,td=1007;var Or=1008;var is=1009,dm=1010,fm=1011,Ka=1012,nd=1013,Br=1014,bi=1015,zn=1016,id=1017,sd=1018,kr=1020,pm=35902,mm=35899,gm=1021,xm=1022,Li=1023,Ua=1026,zr=1027,ja=1028,rd=1029,ym=1030,od=1031;var ad=1033,Fc=33776,Oc=33777,Bc=33778,kc=33779,ld=35840,cd=35841,hd=35842,ud=35843,dd=36196,fd=37492,pd=37496,md=37808,gd=37809,xd=37810,yd=37811,_d=37812,vd=37813,bd=37814,Md=37815,Sd=37816,wd=37817,Ad=37818,Td=37819,Ed=37820,Rd=37821,Cd=36492,Pd=36494,Id=36495,Nd=36283,Dd=36284,Ld=36285,Ud=36286;var nc=2300,cu=2301,ru=2302,Qp=2400,em=2401,tm=2402;var Lx=3200,Ux=3201;var zc=0,Fx=1,er="",$n="srgb",yo="srgb-linear",ic="linear",vt="srgb";var po=7680;var nm=519,Ox=512,Bx=513,kx=514,_m=515,zx=516,Hx=517,Vx=518,Gx=519,hu=35044,Fd=35048;var vm="300 es",Ki=2e3,sc=2001;var Ss=class{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});let i=this._listeners;i[e]===void 0&&(i[e]=[]),i[e].indexOf(t)===-1&&i[e].push(t)}hasEventListener(e,t){let i=this._listeners;return i===void 0?!1:i[e]!==void 0&&i[e].indexOf(t)!==-1}removeEventListener(e,t){let i=this._listeners;if(i===void 0)return;let s=i[e];if(s!==void 0){let r=s.indexOf(t);r!==-1&&s.splice(r,1)}}dispatchEvent(e){let t=this._listeners;if(t===void 0)return;let i=t[e.type];if(i!==void 0){e.target=this;let s=i.slice(0);for(let r=0,o=s.length;r<o;r++)s[r].call(this,e);e.target=null}}},Xn=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],z0=1234567,Jl=Math.PI/180,Fa=180/Math.PI;function js(){let n=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,i=Math.random()*4294967295|0;return(Xn[n&255]+Xn[n>>8&255]+Xn[n>>16&255]+Xn[n>>24&255]+"-"+Xn[e&255]+Xn[e>>8&255]+"-"+Xn[e>>16&15|64]+Xn[e>>24&255]+"-"+Xn[t&63|128]+Xn[t>>8&255]+"-"+Xn[t>>16&255]+Xn[t>>24&255]+Xn[i&255]+Xn[i>>8&255]+Xn[i>>16&255]+Xn[i>>24&255]).toLowerCase()}function tt(n,e,t){return Math.max(e,Math.min(t,n))}function bm(n,e){return(n%e+e)%e}function Kv(n,e,t,i,s){return i+(n-e)*(s-i)/(t-e)}function jv(n,e,t){return n!==e?(t-n)/(e-n):0}function Ql(n,e,t){return(1-t)*n+t*e}function Jv(n,e,t,i){return Ql(n,e,1-Math.exp(-t*i))}function Qv(n,e=1){return e-Math.abs(bm(n,e*2)-e)}function eb(n,e,t){return n<=e?0:n>=t?1:(n=(n-e)/(t-e),n*n*(3-2*n))}function tb(n,e,t){return n<=e?0:n>=t?1:(n=(n-e)/(t-e),n*n*n*(n*(n*6-15)+10))}function nb(n,e){return n+Math.floor(Math.random()*(e-n+1))}function ib(n,e){return n+Math.random()*(e-n)}function sb(n){return n*(.5-Math.random())}function rb(n){n!==void 0&&(z0=n);let e=z0+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}function ob(n){return n*Jl}function ab(n){return n*Fa}function lb(n){return(n&n-1)===0&&n!==0}function cb(n){return Math.pow(2,Math.ceil(Math.log(n)/Math.LN2))}function hb(n){return Math.pow(2,Math.floor(Math.log(n)/Math.LN2))}function ub(n,e,t,i,s){let r=Math.cos,o=Math.sin,a=r(t/2),c=o(t/2),h=r((e+i)/2),l=o((e+i)/2),d=r((e-i)/2),u=o((e-i)/2),f=r((i-e)/2),x=o((i-e)/2);switch(s){case"XYX":n.set(a*l,c*d,c*u,a*h);break;case"YZY":n.set(c*u,a*l,c*d,a*h);break;case"ZXZ":n.set(c*d,c*u,a*l,a*h);break;case"XZX":n.set(a*l,c*x,c*f,a*h);break;case"YXY":n.set(c*f,a*l,c*x,a*h);break;case"ZYZ":n.set(c*x,c*f,a*l,a*h);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+s)}}function Zi(n,e){switch(e.constructor){case Float32Array:return n;case Uint32Array:return n/4294967295;case Uint16Array:return n/65535;case Uint8Array:return n/255;case Int32Array:return Math.max(n/2147483647,-1);case Int16Array:return Math.max(n/32767,-1);case Int8Array:return Math.max(n/127,-1);default:throw new Error("Invalid component type.")}}function St(n,e){switch(e.constructor){case Float32Array:return n;case Uint32Array:return Math.round(n*4294967295);case Uint16Array:return Math.round(n*65535);case Uint8Array:return Math.round(n*255);case Int32Array:return Math.round(n*2147483647);case Int16Array:return Math.round(n*32767);case Int8Array:return Math.round(n*127);default:throw new Error("Invalid component type.")}}var Hc={DEG2RAD:Jl,RAD2DEG:Fa,generateUUID:js,clamp:tt,euclideanModulo:bm,mapLinear:Kv,inverseLerp:jv,lerp:Ql,damp:Jv,pingpong:Qv,smoothstep:eb,smootherstep:tb,randInt:nb,randFloat:ib,randFloatSpread:sb,seededRandom:rb,degToRad:ob,radToDeg:ab,isPowerOfTwo:lb,ceilPowerOfTwo:cb,floorPowerOfTwo:hb,setQuaternionFromProperEuler:ub,normalize:St,denormalize:Zi},ae=class n{constructor(e=0,t=0){n.prototype.isVector2=!0,this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){let t=this.x,i=this.y,s=e.elements;return this.x=s[0]*t+s[3]*i+s[6],this.y=s[1]*t+s[4]*i+s[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=tt(this.x,e.x,t.x),this.y=tt(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=tt(this.x,e,t),this.y=tt(this.y,e,t),this}clampLength(e,t){let i=this.length();return this.divideScalar(i||1).multiplyScalar(tt(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let i=this.dot(e)/t;return Math.acos(tt(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,i=this.y-e.y;return t*t+i*i}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){let i=Math.cos(t),s=Math.sin(t),r=this.x-e.x,o=this.y-e.y;return this.x=r*i-o*s+e.x,this.y=r*s+o*i+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}},nn=class{constructor(e=0,t=0,i=0,s=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=i,this._w=s}static slerpFlat(e,t,i,s,r,o,a){let c=i[s+0],h=i[s+1],l=i[s+2],d=i[s+3],u=r[o+0],f=r[o+1],x=r[o+2],y=r[o+3];if(a===0){e[t+0]=c,e[t+1]=h,e[t+2]=l,e[t+3]=d;return}if(a===1){e[t+0]=u,e[t+1]=f,e[t+2]=x,e[t+3]=y;return}if(d!==y||c!==u||h!==f||l!==x){let m=1-a,p=c*u+h*f+l*x+d*y,w=p>=0?1:-1,v=1-p*p;if(v>Number.EPSILON){let _=Math.sqrt(v),S=Math.atan2(_,p*w);m=Math.sin(m*S)/_,a=Math.sin(a*S)/_}let g=a*w;if(c=c*m+u*g,h=h*m+f*g,l=l*m+x*g,d=d*m+y*g,m===1-a){let _=1/Math.sqrt(c*c+h*h+l*l+d*d);c*=_,h*=_,l*=_,d*=_}}e[t]=c,e[t+1]=h,e[t+2]=l,e[t+3]=d}static multiplyQuaternionsFlat(e,t,i,s,r,o){let a=i[s],c=i[s+1],h=i[s+2],l=i[s+3],d=r[o],u=r[o+1],f=r[o+2],x=r[o+3];return e[t]=a*x+l*d+c*f-h*u,e[t+1]=c*x+l*u+h*d-a*f,e[t+2]=h*x+l*f+a*u-c*d,e[t+3]=l*x-a*d-c*u-h*f,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,i,s){return this._x=e,this._y=t,this._z=i,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){let i=e._x,s=e._y,r=e._z,o=e._order,a=Math.cos,c=Math.sin,h=a(i/2),l=a(s/2),d=a(r/2),u=c(i/2),f=c(s/2),x=c(r/2);switch(o){case"XYZ":this._x=u*l*d+h*f*x,this._y=h*f*d-u*l*x,this._z=h*l*x+u*f*d,this._w=h*l*d-u*f*x;break;case"YXZ":this._x=u*l*d+h*f*x,this._y=h*f*d-u*l*x,this._z=h*l*x-u*f*d,this._w=h*l*d+u*f*x;break;case"ZXY":this._x=u*l*d-h*f*x,this._y=h*f*d+u*l*x,this._z=h*l*x+u*f*d,this._w=h*l*d-u*f*x;break;case"ZYX":this._x=u*l*d-h*f*x,this._y=h*f*d+u*l*x,this._z=h*l*x-u*f*d,this._w=h*l*d+u*f*x;break;case"YZX":this._x=u*l*d+h*f*x,this._y=h*f*d+u*l*x,this._z=h*l*x-u*f*d,this._w=h*l*d-u*f*x;break;case"XZY":this._x=u*l*d-h*f*x,this._y=h*f*d-u*l*x,this._z=h*l*x+u*f*d,this._w=h*l*d+u*f*x;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+o)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){let i=t/2,s=Math.sin(i);return this._x=e.x*s,this._y=e.y*s,this._z=e.z*s,this._w=Math.cos(i),this._onChangeCallback(),this}setFromRotationMatrix(e){let t=e.elements,i=t[0],s=t[4],r=t[8],o=t[1],a=t[5],c=t[9],h=t[2],l=t[6],d=t[10],u=i+a+d;if(u>0){let f=.5/Math.sqrt(u+1);this._w=.25/f,this._x=(l-c)*f,this._y=(r-h)*f,this._z=(o-s)*f}else if(i>a&&i>d){let f=2*Math.sqrt(1+i-a-d);this._w=(l-c)/f,this._x=.25*f,this._y=(s+o)/f,this._z=(r+h)/f}else if(a>d){let f=2*Math.sqrt(1+a-i-d);this._w=(r-h)/f,this._x=(s+o)/f,this._y=.25*f,this._z=(c+l)/f}else{let f=2*Math.sqrt(1+d-i-a);this._w=(o-s)/f,this._x=(r+h)/f,this._y=(c+l)/f,this._z=.25*f}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let i=e.dot(t)+1;return i<1e-8?(i=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=i):(this._x=0,this._y=-e.z,this._z=e.y,this._w=i)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=i),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(tt(this.dot(e),-1,1)))}rotateTowards(e,t){let i=this.angleTo(e);if(i===0)return this;let s=Math.min(1,t/i);return this.slerp(e,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){let i=e._x,s=e._y,r=e._z,o=e._w,a=t._x,c=t._y,h=t._z,l=t._w;return this._x=i*l+o*a+s*h-r*c,this._y=s*l+o*c+r*a-i*h,this._z=r*l+o*h+i*c-s*a,this._w=o*l-i*a-s*c-r*h,this._onChangeCallback(),this}slerp(e,t){if(t===0)return this;if(t===1)return this.copy(e);let i=this._x,s=this._y,r=this._z,o=this._w,a=o*e._w+i*e._x+s*e._y+r*e._z;if(a<0?(this._w=-e._w,this._x=-e._x,this._y=-e._y,this._z=-e._z,a=-a):this.copy(e),a>=1)return this._w=o,this._x=i,this._y=s,this._z=r,this;let c=1-a*a;if(c<=Number.EPSILON){let f=1-t;return this._w=f*o+t*this._w,this._x=f*i+t*this._x,this._y=f*s+t*this._y,this._z=f*r+t*this._z,this.normalize(),this}let h=Math.sqrt(c),l=Math.atan2(h,a),d=Math.sin((1-t)*l)/h,u=Math.sin(t*l)/h;return this._w=o*d+this._w*u,this._x=i*d+this._x*u,this._y=s*d+this._y*u,this._z=r*d+this._z*u,this._onChangeCallback(),this}slerpQuaternions(e,t,i){return this.copy(e).slerp(t,i)}random(){let e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),i=Math.random(),s=Math.sqrt(1-i),r=Math.sqrt(i);return this.set(s*Math.sin(e),s*Math.cos(e),r*Math.sin(t),r*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}},L=class n{constructor(e=0,t=0,i=0){n.prototype.isVector3=!0,this.x=e,this.y=t,this.z=i}set(e,t,i){return i===void 0&&(i=this.z),this.x=e,this.y=t,this.z=i,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(H0.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(H0.setFromAxisAngle(e,t))}applyMatrix3(e){let t=this.x,i=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[3]*i+r[6]*s,this.y=r[1]*t+r[4]*i+r[7]*s,this.z=r[2]*t+r[5]*i+r[8]*s,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){let t=this.x,i=this.y,s=this.z,r=e.elements,o=1/(r[3]*t+r[7]*i+r[11]*s+r[15]);return this.x=(r[0]*t+r[4]*i+r[8]*s+r[12])*o,this.y=(r[1]*t+r[5]*i+r[9]*s+r[13])*o,this.z=(r[2]*t+r[6]*i+r[10]*s+r[14])*o,this}applyQuaternion(e){let t=this.x,i=this.y,s=this.z,r=e.x,o=e.y,a=e.z,c=e.w,h=2*(o*s-a*i),l=2*(a*t-r*s),d=2*(r*i-o*t);return this.x=t+c*h+o*d-a*l,this.y=i+c*l+a*h-r*d,this.z=s+c*d+r*l-o*h,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){let t=this.x,i=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[4]*i+r[8]*s,this.y=r[1]*t+r[5]*i+r[9]*s,this.z=r[2]*t+r[6]*i+r[10]*s,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=tt(this.x,e.x,t.x),this.y=tt(this.y,e.y,t.y),this.z=tt(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=tt(this.x,e,t),this.y=tt(this.y,e,t),this.z=tt(this.z,e,t),this}clampLength(e,t){let i=this.length();return this.divideScalar(i||1).multiplyScalar(tt(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this.z=e.z+(t.z-e.z)*i,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){let i=e.x,s=e.y,r=e.z,o=t.x,a=t.y,c=t.z;return this.x=s*c-r*a,this.y=r*o-i*c,this.z=i*a-s*o,this}projectOnVector(e){let t=e.lengthSq();if(t===0)return this.set(0,0,0);let i=e.dot(this)/t;return this.copy(e).multiplyScalar(i)}projectOnPlane(e){return Tp.copy(this).projectOnVector(e),this.sub(Tp)}reflect(e){return this.sub(Tp.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let i=this.dot(e)/t;return Math.acos(tt(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,i=this.y-e.y,s=this.z-e.z;return t*t+i*i+s*s}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,i){let s=Math.sin(t)*e;return this.x=s*Math.sin(i),this.y=Math.cos(t)*e,this.z=s*Math.cos(i),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,i){return this.x=e*Math.sin(t),this.y=i,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){let t=this.setFromMatrixColumn(e,0).length(),i=this.setFromMatrixColumn(e,1).length(),s=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=i,this.z=s,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let e=Math.random()*Math.PI*2,t=Math.random()*2-1,i=Math.sqrt(1-t*t);return this.x=i*Math.cos(e),this.y=t,this.z=i*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}},Tp=new L,H0=new nn,Qe=class n{constructor(e,t,i,s,r,o,a,c,h){n.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,i,s,r,o,a,c,h)}set(e,t,i,s,r,o,a,c,h){let l=this.elements;return l[0]=e,l[1]=s,l[2]=a,l[3]=t,l[4]=r,l[5]=c,l[6]=i,l[7]=o,l[8]=h,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){let t=this.elements,i=e.elements;return t[0]=i[0],t[1]=i[1],t[2]=i[2],t[3]=i[3],t[4]=i[4],t[5]=i[5],t[6]=i[6],t[7]=i[7],t[8]=i[8],this}extractBasis(e,t,i){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),i.setFromMatrix3Column(this,2),this}setFromMatrix4(e){let t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let i=e.elements,s=t.elements,r=this.elements,o=i[0],a=i[3],c=i[6],h=i[1],l=i[4],d=i[7],u=i[2],f=i[5],x=i[8],y=s[0],m=s[3],p=s[6],w=s[1],v=s[4],g=s[7],_=s[2],S=s[5],R=s[8];return r[0]=o*y+a*w+c*_,r[3]=o*m+a*v+c*S,r[6]=o*p+a*g+c*R,r[1]=h*y+l*w+d*_,r[4]=h*m+l*v+d*S,r[7]=h*p+l*g+d*R,r[2]=u*y+f*w+x*_,r[5]=u*m+f*v+x*S,r[8]=u*p+f*g+x*R,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){let e=this.elements,t=e[0],i=e[1],s=e[2],r=e[3],o=e[4],a=e[5],c=e[6],h=e[7],l=e[8];return t*o*l-t*a*h-i*r*l+i*a*c+s*r*h-s*o*c}invert(){let e=this.elements,t=e[0],i=e[1],s=e[2],r=e[3],o=e[4],a=e[5],c=e[6],h=e[7],l=e[8],d=l*o-a*h,u=a*c-l*r,f=h*r-o*c,x=t*d+i*u+s*f;if(x===0)return this.set(0,0,0,0,0,0,0,0,0);let y=1/x;return e[0]=d*y,e[1]=(s*h-l*i)*y,e[2]=(a*i-s*o)*y,e[3]=u*y,e[4]=(l*t-s*c)*y,e[5]=(s*r-a*t)*y,e[6]=f*y,e[7]=(i*c-h*t)*y,e[8]=(o*t-i*r)*y,this}transpose(){let e,t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){let t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,i,s,r,o,a){let c=Math.cos(r),h=Math.sin(r);return this.set(i*c,i*h,-i*(c*o+h*a)+o+e,-s*h,s*c,-s*(-h*o+c*a)+a+t,0,0,1),this}scale(e,t){return this.premultiply(Ep.makeScale(e,t)),this}rotate(e){return this.premultiply(Ep.makeRotation(-e)),this}translate(e,t){return this.premultiply(Ep.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){let t=Math.cos(e),i=Math.sin(e);return this.set(t,-i,0,i,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){let t=this.elements,i=e.elements;for(let s=0;s<9;s++)if(t[s]!==i[s])return!1;return!0}fromArray(e,t=0){for(let i=0;i<9;i++)this.elements[i]=e[i+t];return this}toArray(e=[],t=0){let i=this.elements;return e[t]=i[0],e[t+1]=i[1],e[t+2]=i[2],e[t+3]=i[3],e[t+4]=i[4],e[t+5]=i[5],e[t+6]=i[6],e[t+7]=i[7],e[t+8]=i[8],e}clone(){return new this.constructor().fromArray(this.elements)}},Ep=new Qe;function Mm(n){for(let e=n.length-1;e>=0;--e)if(n[e]>=65535)return!0;return!1}function rc(n){return document.createElementNS("http://www.w3.org/1999/xhtml",n)}function Wx(){let n=rc("canvas");return n.style.display="block",n}var V0={};function Oa(n){n in V0||(V0[n]=!0,console.warn(n))}function Xx(n,e,t){return new Promise(function(i,s){function r(){switch(n.clientWaitSync(e,n.SYNC_FLUSH_COMMANDS_BIT,0)){case n.WAIT_FAILED:s();break;case n.TIMEOUT_EXPIRED:setTimeout(r,t);break;default:i()}}setTimeout(r,t)})}var G0=new Qe().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),W0=new Qe().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function db(){let n={enabled:!0,workingColorSpace:yo,spaces:{},convert:function(s,r,o){return this.enabled===!1||r===o||!r||!o||(this.spaces[r].transfer===vt&&(s.r=Js(s.r),s.g=Js(s.g),s.b=Js(s.b)),this.spaces[r].primaries!==this.spaces[o].primaries&&(s.applyMatrix3(this.spaces[r].toXYZ),s.applyMatrix3(this.spaces[o].fromXYZ)),this.spaces[o].transfer===vt&&(s.r=La(s.r),s.g=La(s.g),s.b=La(s.b))),s},workingToColorSpace:function(s,r){return this.convert(s,this.workingColorSpace,r)},colorSpaceToWorking:function(s,r){return this.convert(s,r,this.workingColorSpace)},getPrimaries:function(s){return this.spaces[s].primaries},getTransfer:function(s){return s===er?ic:this.spaces[s].transfer},getToneMappingMode:function(s){return this.spaces[s].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(s,r=this.workingColorSpace){return s.fromArray(this.spaces[r].luminanceCoefficients)},define:function(s){Object.assign(this.spaces,s)},_getMatrix:function(s,r,o){return s.copy(this.spaces[r].toXYZ).multiply(this.spaces[o].fromXYZ)},_getDrawingBufferColorSpace:function(s){return this.spaces[s].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(s=this.workingColorSpace){return this.spaces[s].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(s,r){return Oa("THREE.ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),n.workingToColorSpace(s,r)},toWorkingColorSpace:function(s,r){return Oa("THREE.ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),n.colorSpaceToWorking(s,r)}},e=[.64,.33,.3,.6,.15,.06],t=[.2126,.7152,.0722],i=[.3127,.329];return n.define({[yo]:{primaries:e,whitePoint:i,transfer:ic,toXYZ:G0,fromXYZ:W0,luminanceCoefficients:t,workingColorSpaceConfig:{unpackColorSpace:$n},outputColorSpaceConfig:{drawingBufferColorSpace:$n}},[$n]:{primaries:e,whitePoint:i,transfer:vt,toXYZ:G0,fromXYZ:W0,luminanceCoefficients:t,outputColorSpaceConfig:{drawingBufferColorSpace:$n}}}),n}var lt=db();function Js(n){return n<.04045?n*.0773993808:Math.pow(n*.9478672986+.0521327014,2.4)}function La(n){return n<.0031308?n*12.92:1.055*Math.pow(n,.41666)-.055}var xa,uu=class{static getDataURL(e,t="image/png"){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let i;if(e instanceof HTMLCanvasElement)i=e;else{xa===void 0&&(xa=rc("canvas")),xa.width=e.width,xa.height=e.height;let s=xa.getContext("2d");e instanceof ImageData?s.putImageData(e,0,0):s.drawImage(e,0,0,e.width,e.height),i=xa}return i.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){let t=rc("canvas");t.width=e.width,t.height=e.height;let i=t.getContext("2d");i.drawImage(e,0,0,e.width,e.height);let s=i.getImageData(0,0,e.width,e.height),r=s.data;for(let o=0;o<r.length;o++)r[o]=Js(r[o]/255)*255;return i.putImageData(s,0,0),t}else if(e.data){let t=e.data.slice(0);for(let i=0;i<t.length;i++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[i]=Math.floor(Js(t[i]/255)*255):t[i]=Js(t[i]);return{data:t,width:e.width,height:e.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}},fb=0,Ba=class{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:fb++}),this.uuid=js(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){let t=this.data;return typeof HTMLVideoElement<"u"&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):t instanceof VideoFrame?e.set(t.displayHeight,t.displayWidth,0):t!==null?e.set(t.width,t.height,t.depth||0):e.set(0,0,0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){let t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];let i={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let o=0,a=s.length;o<a;o++)s[o].isDataTexture?r.push(Rp(s[o].image)):r.push(Rp(s[o]))}else r=Rp(s);i.url=r}return t||(e.images[this.uuid]=i),i}};function Rp(n){return typeof HTMLImageElement<"u"&&n instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&n instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&n instanceof ImageBitmap?uu.getDataURL(n):n.data?{data:Array.from(n.data),width:n.width,height:n.height,type:n.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}var pb=0,Cp=new L,Qn=class n extends Ss{constructor(e=n.DEFAULT_IMAGE,t=n.DEFAULT_MAPPING,i=Cr,s=Cr,r=Qi,o=Or,a=Li,c=is,h=n.DEFAULT_ANISOTROPY,l=er){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:pb++}),this.uuid=js(),this.name="",this.source=new Ba(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=i,this.wrapT=s,this.magFilter=r,this.minFilter=o,this.anisotropy=h,this.format=a,this.internalFormat=null,this.type=c,this.offset=new ae(0,0),this.repeat=new ae(1,1),this.center=new ae(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Qe,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=l,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(e&&e.depth&&e.depth>1),this.pmremVersion=0}get width(){return this.source.getSize(Cp).x}get height(){return this.source.getSize(Cp).y}get depth(){return this.source.getSize(Cp).z}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(let t in e){let i=e[t];if(i===void 0){console.warn(`THREE.Texture.setValues(): parameter '${t}' has value of undefined.`);continue}let s=this[t];if(s===void 0){console.warn(`THREE.Texture.setValues(): property '${t}' does not exist.`);continue}s&&i&&s.isVector2&&i.isVector2||s&&i&&s.isVector3&&i.isVector3||s&&i&&s.isMatrix3&&i.isMatrix3?s.copy(i):this[t]=i}}toJSON(e){let t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];let i={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(i.userData=this.userData),t||(e.textures[this.uuid]=i),i}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==um)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case xo:e.x=e.x-Math.floor(e.x);break;case Cr:e.x=e.x<0?0:1;break;case lu:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case xo:e.y=e.y-Math.floor(e.y);break;case Cr:e.y=e.y<0?0:1;break;case lu:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}};Qn.DEFAULT_IMAGE=null;Qn.DEFAULT_MAPPING=um;Qn.DEFAULT_ANISOTROPY=1;var wt=class n{constructor(e=0,t=0,i=0,s=1){n.prototype.isVector4=!0,this.x=e,this.y=t,this.z=i,this.w=s}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,i,s){return this.x=e,this.y=t,this.z=i,this.w=s,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){let t=this.x,i=this.y,s=this.z,r=this.w,o=e.elements;return this.x=o[0]*t+o[4]*i+o[8]*s+o[12]*r,this.y=o[1]*t+o[5]*i+o[9]*s+o[13]*r,this.z=o[2]*t+o[6]*i+o[10]*s+o[14]*r,this.w=o[3]*t+o[7]*i+o[11]*s+o[15]*r,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);let t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,i,s,r,c=e.elements,h=c[0],l=c[4],d=c[8],u=c[1],f=c[5],x=c[9],y=c[2],m=c[6],p=c[10];if(Math.abs(l-u)<.01&&Math.abs(d-y)<.01&&Math.abs(x-m)<.01){if(Math.abs(l+u)<.1&&Math.abs(d+y)<.1&&Math.abs(x+m)<.1&&Math.abs(h+f+p-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;let v=(h+1)/2,g=(f+1)/2,_=(p+1)/2,S=(l+u)/4,R=(d+y)/4,P=(x+m)/4;return v>g&&v>_?v<.01?(i=0,s=.707106781,r=.707106781):(i=Math.sqrt(v),s=S/i,r=R/i):g>_?g<.01?(i=.707106781,s=0,r=.707106781):(s=Math.sqrt(g),i=S/s,r=P/s):_<.01?(i=.707106781,s=.707106781,r=0):(r=Math.sqrt(_),i=R/r,s=P/r),this.set(i,s,r,t),this}let w=Math.sqrt((m-x)*(m-x)+(d-y)*(d-y)+(u-l)*(u-l));return Math.abs(w)<.001&&(w=1),this.x=(m-x)/w,this.y=(d-y)/w,this.z=(u-l)/w,this.w=Math.acos((h+f+p-1)/2),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=tt(this.x,e.x,t.x),this.y=tt(this.y,e.y,t.y),this.z=tt(this.z,e.z,t.z),this.w=tt(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=tt(this.x,e,t),this.y=tt(this.y,e,t),this.z=tt(this.z,e,t),this.w=tt(this.w,e,t),this}clampLength(e,t){let i=this.length();return this.divideScalar(i||1).multiplyScalar(tt(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this.z=e.z+(t.z-e.z)*i,this.w=e.w+(t.w-e.w)*i,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}},du=class extends Ss{constructor(e=1,t=1,i={}){super(),i=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Qi,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1},i),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=i.depth,this.scissor=new wt(0,0,e,t),this.scissorTest=!1,this.viewport=new wt(0,0,e,t);let s={width:e,height:t,depth:i.depth},r=new Qn(s);this.textures=[];let o=i.count;for(let a=0;a<o;a++)this.textures[a]=r.clone(),this.textures[a].isRenderTargetTexture=!0,this.textures[a].renderTarget=this;this._setTextureOptions(i),this.depthBuffer=i.depthBuffer,this.stencilBuffer=i.stencilBuffer,this.resolveDepthBuffer=i.resolveDepthBuffer,this.resolveStencilBuffer=i.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=i.depthTexture,this.samples=i.samples,this.multiview=i.multiview}_setTextureOptions(e={}){let t={minFilter:Qi,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let i=0;i<this.textures.length;i++)this.textures[i].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),e!==null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,i=1){if(this.width!==e||this.height!==t||this.depth!==i){this.width=e,this.height=t,this.depth=i;for(let s=0,r=this.textures.length;s<r;s++)this.textures[s].image.width=e,this.textures[s].image.height=t,this.textures[s].image.depth=i,this.textures[s].isArrayTexture=this.textures[s].image.depth>1;this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,i=e.textures.length;t<i;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;let s=Object.assign({},e.textures[t].image);this.textures[t].source=new Ba(s)}return this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}},ln=class extends du{constructor(e=1,t=1,i={}){super(e,t,i),this.isWebGLRenderTarget=!0}},oc=class extends Qn{constructor(e=null,t=1,i=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:i,depth:s},this.magFilter=kn,this.minFilter=kn,this.wrapR=Cr,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}};var fu=class extends Qn{constructor(e=null,t=1,i=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:i,depth:s},this.magFilter=kn,this.minFilter=kn,this.wrapR=Cr,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}};var ws=class{constructor(e=new L(1/0,1/0,1/0),t=new L(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t+=3)this.expandByPoint(qi.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,i=e.count;t<i;t++)this.expandByPoint(qi.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){let i=qi.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(i),this.max.copy(e).add(i),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);let i=e.geometry;if(i!==void 0){let r=i.getAttribute("position");if(t===!0&&r!==void 0&&e.isInstancedMesh!==!0)for(let o=0,a=r.count;o<a;o++)e.isMesh===!0?e.getVertexPosition(o,qi):qi.fromBufferAttribute(r,o),qi.applyMatrix4(e.matrixWorld),this.expandByPoint(qi);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),Fh.copy(e.boundingBox)):(i.boundingBox===null&&i.computeBoundingBox(),Fh.copy(i.boundingBox)),Fh.applyMatrix4(e.matrixWorld),this.union(Fh)}let s=e.children;for(let r=0,o=s.length;r<o;r++)this.expandByObject(s[r],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,qi),qi.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,i;return e.normal.x>0?(t=e.normal.x*this.min.x,i=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,i=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,i+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,i+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,i+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,i+=e.normal.z*this.min.z),t<=-e.constant&&i>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(Vl),Oh.subVectors(this.max,Vl),ya.subVectors(e.a,Vl),_a.subVectors(e.b,Vl),va.subVectors(e.c,Vl),Sr.subVectors(_a,ya),wr.subVectors(va,_a),co.subVectors(ya,va);let t=[0,-Sr.z,Sr.y,0,-wr.z,wr.y,0,-co.z,co.y,Sr.z,0,-Sr.x,wr.z,0,-wr.x,co.z,0,-co.x,-Sr.y,Sr.x,0,-wr.y,wr.x,0,-co.y,co.x,0];return!Pp(t,ya,_a,va,Oh)||(t=[1,0,0,0,1,0,0,0,1],!Pp(t,ya,_a,va,Oh))?!1:(Bh.crossVectors(Sr,wr),t=[Bh.x,Bh.y,Bh.z],Pp(t,ya,_a,va,Oh))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,qi).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(qi).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(Xs[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),Xs[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),Xs[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),Xs[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),Xs[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),Xs[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),Xs[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),Xs[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(Xs),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}},Xs=[new L,new L,new L,new L,new L,new L,new L,new L],qi=new L,Fh=new ws,ya=new L,_a=new L,va=new L,Sr=new L,wr=new L,co=new L,Vl=new L,Oh=new L,Bh=new L,ho=new L;function Pp(n,e,t,i,s){for(let r=0,o=n.length-3;r<=o;r+=3){ho.fromArray(n,r);let a=s.x*Math.abs(ho.x)+s.y*Math.abs(ho.y)+s.z*Math.abs(ho.z),c=e.dot(ho),h=t.dot(ho),l=i.dot(ho);if(Math.max(-Math.max(c,h,l),Math.min(c,h,l))>a)return!1}return!0}var mb=new ws,Gl=new L,Ip=new L,Pr=class{constructor(e=new L,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){let i=this.center;t!==void 0?i.copy(t):mb.setFromPoints(e).getCenter(i);let s=0;for(let r=0,o=e.length;r<o;r++)s=Math.max(s,i.distanceToSquared(e[r]));return this.radius=Math.sqrt(s),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){let t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){let i=this.center.distanceToSquared(e);return t.copy(e),i>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;Gl.subVectors(e,this.center);let t=Gl.lengthSq();if(t>this.radius*this.radius){let i=Math.sqrt(t),s=(i-this.radius)*.5;this.center.addScaledVector(Gl,s/i),this.radius+=s}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(Ip.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(Gl.copy(e.center).add(Ip)),this.expandByPoint(Gl.copy(e.center).sub(Ip))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}},qs=new L,Np=new L,kh=new L,Ar=new L,Dp=new L,zh=new L,Lp=new L,_o=class{constructor(e=new L,t=new L(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,qs)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);let i=t.dot(this.direction);return i<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,i)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){let t=qs.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(qs.copy(this.origin).addScaledVector(this.direction,t),qs.distanceToSquared(e))}distanceSqToSegment(e,t,i,s){Np.copy(e).add(t).multiplyScalar(.5),kh.copy(t).sub(e).normalize(),Ar.copy(this.origin).sub(Np);let r=e.distanceTo(t)*.5,o=-this.direction.dot(kh),a=Ar.dot(this.direction),c=-Ar.dot(kh),h=Ar.lengthSq(),l=Math.abs(1-o*o),d,u,f,x;if(l>0)if(d=o*c-a,u=o*a-c,x=r*l,d>=0)if(u>=-x)if(u<=x){let y=1/l;d*=y,u*=y,f=d*(d+o*u+2*a)+u*(o*d+u+2*c)+h}else u=r,d=Math.max(0,-(o*u+a)),f=-d*d+u*(u+2*c)+h;else u=-r,d=Math.max(0,-(o*u+a)),f=-d*d+u*(u+2*c)+h;else u<=-x?(d=Math.max(0,-(-o*r+a)),u=d>0?-r:Math.min(Math.max(-r,-c),r),f=-d*d+u*(u+2*c)+h):u<=x?(d=0,u=Math.min(Math.max(-r,-c),r),f=u*(u+2*c)+h):(d=Math.max(0,-(o*r+a)),u=d>0?r:Math.min(Math.max(-r,-c),r),f=-d*d+u*(u+2*c)+h);else u=o>0?-r:r,d=Math.max(0,-(o*u+a)),f=-d*d+u*(u+2*c)+h;return i&&i.copy(this.origin).addScaledVector(this.direction,d),s&&s.copy(Np).addScaledVector(kh,u),f}intersectSphere(e,t){qs.subVectors(e.center,this.origin);let i=qs.dot(this.direction),s=qs.dot(qs)-i*i,r=e.radius*e.radius;if(s>r)return null;let o=Math.sqrt(r-s),a=i-o,c=i+o;return c<0?null:a<0?this.at(c,t):this.at(a,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){let t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;let i=-(this.origin.dot(e.normal)+e.constant)/t;return i>=0?i:null}intersectPlane(e,t){let i=this.distanceToPlane(e);return i===null?null:this.at(i,t)}intersectsPlane(e){let t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let i,s,r,o,a,c,h=1/this.direction.x,l=1/this.direction.y,d=1/this.direction.z,u=this.origin;return h>=0?(i=(e.min.x-u.x)*h,s=(e.max.x-u.x)*h):(i=(e.max.x-u.x)*h,s=(e.min.x-u.x)*h),l>=0?(r=(e.min.y-u.y)*l,o=(e.max.y-u.y)*l):(r=(e.max.y-u.y)*l,o=(e.min.y-u.y)*l),i>o||r>s||((r>i||isNaN(i))&&(i=r),(o<s||isNaN(s))&&(s=o),d>=0?(a=(e.min.z-u.z)*d,c=(e.max.z-u.z)*d):(a=(e.max.z-u.z)*d,c=(e.min.z-u.z)*d),i>c||a>s)||((a>i||i!==i)&&(i=a),(c<s||s!==s)&&(s=c),s<0)?null:this.at(i>=0?i:s,t)}intersectsBox(e){return this.intersectBox(e,qs)!==null}intersectTriangle(e,t,i,s,r){Dp.subVectors(t,e),zh.subVectors(i,e),Lp.crossVectors(Dp,zh);let o=this.direction.dot(Lp),a;if(o>0){if(s)return null;a=1}else if(o<0)a=-1,o=-o;else return null;Ar.subVectors(this.origin,e);let c=a*this.direction.dot(zh.crossVectors(Ar,zh));if(c<0)return null;let h=a*this.direction.dot(Dp.cross(Ar));if(h<0||c+h>o)return null;let l=-a*Ar.dot(Lp);return l<0?null:this.at(l/o,r)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}},ut=class n{constructor(e,t,i,s,r,o,a,c,h,l,d,u,f,x,y,m){n.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,i,s,r,o,a,c,h,l,d,u,f,x,y,m)}set(e,t,i,s,r,o,a,c,h,l,d,u,f,x,y,m){let p=this.elements;return p[0]=e,p[4]=t,p[8]=i,p[12]=s,p[1]=r,p[5]=o,p[9]=a,p[13]=c,p[2]=h,p[6]=l,p[10]=d,p[14]=u,p[3]=f,p[7]=x,p[11]=y,p[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new n().fromArray(this.elements)}copy(e){let t=this.elements,i=e.elements;return t[0]=i[0],t[1]=i[1],t[2]=i[2],t[3]=i[3],t[4]=i[4],t[5]=i[5],t[6]=i[6],t[7]=i[7],t[8]=i[8],t[9]=i[9],t[10]=i[10],t[11]=i[11],t[12]=i[12],t[13]=i[13],t[14]=i[14],t[15]=i[15],this}copyPosition(e){let t=this.elements,i=e.elements;return t[12]=i[12],t[13]=i[13],t[14]=i[14],this}setFromMatrix3(e){let t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,i){return e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),i.setFromMatrixColumn(this,2),this}makeBasis(e,t,i){return this.set(e.x,t.x,i.x,0,e.y,t.y,i.y,0,e.z,t.z,i.z,0,0,0,0,1),this}extractRotation(e){let t=this.elements,i=e.elements,s=1/ba.setFromMatrixColumn(e,0).length(),r=1/ba.setFromMatrixColumn(e,1).length(),o=1/ba.setFromMatrixColumn(e,2).length();return t[0]=i[0]*s,t[1]=i[1]*s,t[2]=i[2]*s,t[3]=0,t[4]=i[4]*r,t[5]=i[5]*r,t[6]=i[6]*r,t[7]=0,t[8]=i[8]*o,t[9]=i[9]*o,t[10]=i[10]*o,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){let t=this.elements,i=e.x,s=e.y,r=e.z,o=Math.cos(i),a=Math.sin(i),c=Math.cos(s),h=Math.sin(s),l=Math.cos(r),d=Math.sin(r);if(e.order==="XYZ"){let u=o*l,f=o*d,x=a*l,y=a*d;t[0]=c*l,t[4]=-c*d,t[8]=h,t[1]=f+x*h,t[5]=u-y*h,t[9]=-a*c,t[2]=y-u*h,t[6]=x+f*h,t[10]=o*c}else if(e.order==="YXZ"){let u=c*l,f=c*d,x=h*l,y=h*d;t[0]=u+y*a,t[4]=x*a-f,t[8]=o*h,t[1]=o*d,t[5]=o*l,t[9]=-a,t[2]=f*a-x,t[6]=y+u*a,t[10]=o*c}else if(e.order==="ZXY"){let u=c*l,f=c*d,x=h*l,y=h*d;t[0]=u-y*a,t[4]=-o*d,t[8]=x+f*a,t[1]=f+x*a,t[5]=o*l,t[9]=y-u*a,t[2]=-o*h,t[6]=a,t[10]=o*c}else if(e.order==="ZYX"){let u=o*l,f=o*d,x=a*l,y=a*d;t[0]=c*l,t[4]=x*h-f,t[8]=u*h+y,t[1]=c*d,t[5]=y*h+u,t[9]=f*h-x,t[2]=-h,t[6]=a*c,t[10]=o*c}else if(e.order==="YZX"){let u=o*c,f=o*h,x=a*c,y=a*h;t[0]=c*l,t[4]=y-u*d,t[8]=x*d+f,t[1]=d,t[5]=o*l,t[9]=-a*l,t[2]=-h*l,t[6]=f*d+x,t[10]=u-y*d}else if(e.order==="XZY"){let u=o*c,f=o*h,x=a*c,y=a*h;t[0]=c*l,t[4]=-d,t[8]=h*l,t[1]=u*d+y,t[5]=o*l,t[9]=f*d-x,t[2]=x*d-f,t[6]=a*l,t[10]=y*d+u}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(gb,e,xb)}lookAt(e,t,i){let s=this.elements;return xi.subVectors(e,t),xi.lengthSq()===0&&(xi.z=1),xi.normalize(),Tr.crossVectors(i,xi),Tr.lengthSq()===0&&(Math.abs(i.z)===1?xi.x+=1e-4:xi.z+=1e-4,xi.normalize(),Tr.crossVectors(i,xi)),Tr.normalize(),Hh.crossVectors(xi,Tr),s[0]=Tr.x,s[4]=Hh.x,s[8]=xi.x,s[1]=Tr.y,s[5]=Hh.y,s[9]=xi.y,s[2]=Tr.z,s[6]=Hh.z,s[10]=xi.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let i=e.elements,s=t.elements,r=this.elements,o=i[0],a=i[4],c=i[8],h=i[12],l=i[1],d=i[5],u=i[9],f=i[13],x=i[2],y=i[6],m=i[10],p=i[14],w=i[3],v=i[7],g=i[11],_=i[15],S=s[0],R=s[4],P=s[8],b=s[12],M=s[1],C=s[5],U=s[9],V=s[13],H=s[2],k=s[6],z=s[10],ie=s[14],$=s[3],te=s[7],F=s[11],O=s[15];return r[0]=o*S+a*M+c*H+h*$,r[4]=o*R+a*C+c*k+h*te,r[8]=o*P+a*U+c*z+h*F,r[12]=o*b+a*V+c*ie+h*O,r[1]=l*S+d*M+u*H+f*$,r[5]=l*R+d*C+u*k+f*te,r[9]=l*P+d*U+u*z+f*F,r[13]=l*b+d*V+u*ie+f*O,r[2]=x*S+y*M+m*H+p*$,r[6]=x*R+y*C+m*k+p*te,r[10]=x*P+y*U+m*z+p*F,r[14]=x*b+y*V+m*ie+p*O,r[3]=w*S+v*M+g*H+_*$,r[7]=w*R+v*C+g*k+_*te,r[11]=w*P+v*U+g*z+_*F,r[15]=w*b+v*V+g*ie+_*O,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){let e=this.elements,t=e[0],i=e[4],s=e[8],r=e[12],o=e[1],a=e[5],c=e[9],h=e[13],l=e[2],d=e[6],u=e[10],f=e[14],x=e[3],y=e[7],m=e[11],p=e[15];return x*(+r*c*d-s*h*d-r*a*u+i*h*u+s*a*f-i*c*f)+y*(+t*c*f-t*h*u+r*o*u-s*o*f+s*h*l-r*c*l)+m*(+t*h*d-t*a*f-r*o*d+i*o*f+r*a*l-i*h*l)+p*(-s*a*l-t*c*d+t*a*u+s*o*d-i*o*u+i*c*l)}transpose(){let e=this.elements,t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,i){let s=this.elements;return e.isVector3?(s[12]=e.x,s[13]=e.y,s[14]=e.z):(s[12]=e,s[13]=t,s[14]=i),this}invert(){let e=this.elements,t=e[0],i=e[1],s=e[2],r=e[3],o=e[4],a=e[5],c=e[6],h=e[7],l=e[8],d=e[9],u=e[10],f=e[11],x=e[12],y=e[13],m=e[14],p=e[15],w=d*m*h-y*u*h+y*c*f-a*m*f-d*c*p+a*u*p,v=x*u*h-l*m*h-x*c*f+o*m*f+l*c*p-o*u*p,g=l*y*h-x*d*h+x*a*f-o*y*f-l*a*p+o*d*p,_=x*d*c-l*y*c-x*a*u+o*y*u+l*a*m-o*d*m,S=t*w+i*v+s*g+r*_;if(S===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let R=1/S;return e[0]=w*R,e[1]=(y*u*r-d*m*r-y*s*f+i*m*f+d*s*p-i*u*p)*R,e[2]=(a*m*r-y*c*r+y*s*h-i*m*h-a*s*p+i*c*p)*R,e[3]=(d*c*r-a*u*r-d*s*h+i*u*h+a*s*f-i*c*f)*R,e[4]=v*R,e[5]=(l*m*r-x*u*r+x*s*f-t*m*f-l*s*p+t*u*p)*R,e[6]=(x*c*r-o*m*r-x*s*h+t*m*h+o*s*p-t*c*p)*R,e[7]=(o*u*r-l*c*r+l*s*h-t*u*h-o*s*f+t*c*f)*R,e[8]=g*R,e[9]=(x*d*r-l*y*r-x*i*f+t*y*f+l*i*p-t*d*p)*R,e[10]=(o*y*r-x*a*r+x*i*h-t*y*h-o*i*p+t*a*p)*R,e[11]=(l*a*r-o*d*r-l*i*h+t*d*h+o*i*f-t*a*f)*R,e[12]=_*R,e[13]=(l*y*s-x*d*s+x*i*u-t*y*u-l*i*m+t*d*m)*R,e[14]=(x*a*s-o*y*s-x*i*c+t*y*c+o*i*m-t*a*m)*R,e[15]=(o*d*s-l*a*s+l*i*c-t*d*c-o*i*u+t*a*u)*R,this}scale(e){let t=this.elements,i=e.x,s=e.y,r=e.z;return t[0]*=i,t[4]*=s,t[8]*=r,t[1]*=i,t[5]*=s,t[9]*=r,t[2]*=i,t[6]*=s,t[10]*=r,t[3]*=i,t[7]*=s,t[11]*=r,this}getMaxScaleOnAxis(){let e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],i=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],s=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,i,s))}makeTranslation(e,t,i){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,i,0,0,0,1),this}makeRotationX(e){let t=Math.cos(e),i=Math.sin(e);return this.set(1,0,0,0,0,t,-i,0,0,i,t,0,0,0,0,1),this}makeRotationY(e){let t=Math.cos(e),i=Math.sin(e);return this.set(t,0,i,0,0,1,0,0,-i,0,t,0,0,0,0,1),this}makeRotationZ(e){let t=Math.cos(e),i=Math.sin(e);return this.set(t,-i,0,0,i,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){let i=Math.cos(t),s=Math.sin(t),r=1-i,o=e.x,a=e.y,c=e.z,h=r*o,l=r*a;return this.set(h*o+i,h*a-s*c,h*c+s*a,0,h*a+s*c,l*a+i,l*c-s*o,0,h*c-s*a,l*c+s*o,r*c*c+i,0,0,0,0,1),this}makeScale(e,t,i){return this.set(e,0,0,0,0,t,0,0,0,0,i,0,0,0,0,1),this}makeShear(e,t,i,s,r,o){return this.set(1,i,r,0,e,1,o,0,t,s,1,0,0,0,0,1),this}compose(e,t,i){let s=this.elements,r=t._x,o=t._y,a=t._z,c=t._w,h=r+r,l=o+o,d=a+a,u=r*h,f=r*l,x=r*d,y=o*l,m=o*d,p=a*d,w=c*h,v=c*l,g=c*d,_=i.x,S=i.y,R=i.z;return s[0]=(1-(y+p))*_,s[1]=(f+g)*_,s[2]=(x-v)*_,s[3]=0,s[4]=(f-g)*S,s[5]=(1-(u+p))*S,s[6]=(m+w)*S,s[7]=0,s[8]=(x+v)*R,s[9]=(m-w)*R,s[10]=(1-(u+y))*R,s[11]=0,s[12]=e.x,s[13]=e.y,s[14]=e.z,s[15]=1,this}decompose(e,t,i){let s=this.elements,r=ba.set(s[0],s[1],s[2]).length(),o=ba.set(s[4],s[5],s[6]).length(),a=ba.set(s[8],s[9],s[10]).length();this.determinant()<0&&(r=-r),e.x=s[12],e.y=s[13],e.z=s[14],$i.copy(this);let h=1/r,l=1/o,d=1/a;return $i.elements[0]*=h,$i.elements[1]*=h,$i.elements[2]*=h,$i.elements[4]*=l,$i.elements[5]*=l,$i.elements[6]*=l,$i.elements[8]*=d,$i.elements[9]*=d,$i.elements[10]*=d,t.setFromRotationMatrix($i),i.x=r,i.y=o,i.z=a,this}makePerspective(e,t,i,s,r,o,a=Ki,c=!1){let h=this.elements,l=2*r/(t-e),d=2*r/(i-s),u=(t+e)/(t-e),f=(i+s)/(i-s),x,y;if(c)x=r/(o-r),y=o*r/(o-r);else if(a===Ki)x=-(o+r)/(o-r),y=-2*o*r/(o-r);else if(a===sc)x=-o/(o-r),y=-o*r/(o-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return h[0]=l,h[4]=0,h[8]=u,h[12]=0,h[1]=0,h[5]=d,h[9]=f,h[13]=0,h[2]=0,h[6]=0,h[10]=x,h[14]=y,h[3]=0,h[7]=0,h[11]=-1,h[15]=0,this}makeOrthographic(e,t,i,s,r,o,a=Ki,c=!1){let h=this.elements,l=2/(t-e),d=2/(i-s),u=-(t+e)/(t-e),f=-(i+s)/(i-s),x,y;if(c)x=1/(o-r),y=o/(o-r);else if(a===Ki)x=-2/(o-r),y=-(o+r)/(o-r);else if(a===sc)x=-1/(o-r),y=-r/(o-r);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return h[0]=l,h[4]=0,h[8]=0,h[12]=u,h[1]=0,h[5]=d,h[9]=0,h[13]=f,h[2]=0,h[6]=0,h[10]=x,h[14]=y,h[3]=0,h[7]=0,h[11]=0,h[15]=1,this}equals(e){let t=this.elements,i=e.elements;for(let s=0;s<16;s++)if(t[s]!==i[s])return!1;return!0}fromArray(e,t=0){for(let i=0;i<16;i++)this.elements[i]=e[i+t];return this}toArray(e=[],t=0){let i=this.elements;return e[t]=i[0],e[t+1]=i[1],e[t+2]=i[2],e[t+3]=i[3],e[t+4]=i[4],e[t+5]=i[5],e[t+6]=i[6],e[t+7]=i[7],e[t+8]=i[8],e[t+9]=i[9],e[t+10]=i[10],e[t+11]=i[11],e[t+12]=i[12],e[t+13]=i[13],e[t+14]=i[14],e[t+15]=i[15],e}},ba=new L,$i=new ut,gb=new L(0,0,0),xb=new L(1,1,1),Tr=new L,Hh=new L,xi=new L,X0=new ut,q0=new nn,hi=class n{constructor(e=0,t=0,i=0,s=n.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=i,this._order=s}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,i,s=this._order){return this._x=e,this._y=t,this._z=i,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,i=!0){let s=e.elements,r=s[0],o=s[4],a=s[8],c=s[1],h=s[5],l=s[9],d=s[2],u=s[6],f=s[10];switch(t){case"XYZ":this._y=Math.asin(tt(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-l,f),this._z=Math.atan2(-o,r)):(this._x=Math.atan2(u,h),this._z=0);break;case"YXZ":this._x=Math.asin(-tt(l,-1,1)),Math.abs(l)<.9999999?(this._y=Math.atan2(a,f),this._z=Math.atan2(c,h)):(this._y=Math.atan2(-d,r),this._z=0);break;case"ZXY":this._x=Math.asin(tt(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(-d,f),this._z=Math.atan2(-o,h)):(this._y=0,this._z=Math.atan2(c,r));break;case"ZYX":this._y=Math.asin(-tt(d,-1,1)),Math.abs(d)<.9999999?(this._x=Math.atan2(u,f),this._z=Math.atan2(c,r)):(this._x=0,this._z=Math.atan2(-o,h));break;case"YZX":this._z=Math.asin(tt(c,-1,1)),Math.abs(c)<.9999999?(this._x=Math.atan2(-l,h),this._y=Math.atan2(-d,r)):(this._x=0,this._y=Math.atan2(a,f));break;case"XZY":this._z=Math.asin(-tt(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(u,h),this._y=Math.atan2(a,r)):(this._x=Math.atan2(-l,f),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,i===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,i){return X0.makeRotationFromQuaternion(e),this.setFromRotationMatrix(X0,t,i)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return q0.setFromEuler(this),this.setFromQuaternion(q0,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};hi.DEFAULT_ORDER="XYZ";var ka=class{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}},yb=0,$0=new L,Ma=new nn,$s=new ut,Vh=new L,Wl=new L,_b=new L,vb=new nn,Y0=new L(1,0,0),Z0=new L(0,1,0),K0=new L(0,0,1),j0={type:"added"},bb={type:"removed"},Sa={type:"childadded",child:null},Up={type:"childremoved",child:null},sn=class n extends Ss{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:yb++}),this.uuid=js(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=n.DEFAULT_UP.clone();let e=new L,t=new hi,i=new nn,s=new L(1,1,1);function r(){i.setFromEuler(t,!1)}function o(){t.setFromQuaternion(i,void 0,!1)}t._onChange(r),i._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:i},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new ut},normalMatrix:{value:new Qe}}),this.matrix=new ut,this.matrixWorld=new ut,this.matrixAutoUpdate=n.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=n.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new ka,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return Ma.setFromAxisAngle(e,t),this.quaternion.multiply(Ma),this}rotateOnWorldAxis(e,t){return Ma.setFromAxisAngle(e,t),this.quaternion.premultiply(Ma),this}rotateX(e){return this.rotateOnAxis(Y0,e)}rotateY(e){return this.rotateOnAxis(Z0,e)}rotateZ(e){return this.rotateOnAxis(K0,e)}translateOnAxis(e,t){return $0.copy(e).applyQuaternion(this.quaternion),this.position.add($0.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(Y0,e)}translateY(e){return this.translateOnAxis(Z0,e)}translateZ(e){return this.translateOnAxis(K0,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4($s.copy(this.matrixWorld).invert())}lookAt(e,t,i){e.isVector3?Vh.copy(e):Vh.set(e,t,i);let s=this.parent;this.updateWorldMatrix(!0,!1),Wl.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?$s.lookAt(Wl,Vh,this.up):$s.lookAt(Vh,Wl,this.up),this.quaternion.setFromRotationMatrix($s),s&&($s.extractRotation(s.matrixWorld),Ma.setFromRotationMatrix($s),this.quaternion.premultiply(Ma.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(j0),Sa.child=e,this.dispatchEvent(Sa),Sa.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.remove(arguments[i]);return this}let t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(bb),Up.child=e,this.dispatchEvent(Up),Up.child=null),this}removeFromParent(){let e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),$s.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),$s.multiply(e.parent.matrixWorld)),e.applyMatrix4($s),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(j0),Sa.child=e,this.dispatchEvent(Sa),Sa.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let i=0,s=this.children.length;i<s;i++){let o=this.children[i].getObjectByProperty(e,t);if(o!==void 0)return o}}getObjectsByProperty(e,t,i=[]){this[e]===t&&i.push(this);let s=this.children;for(let r=0,o=s.length;r<o;r++)s[r].getObjectsByProperty(e,t,i);return i}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Wl,e,_b),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Wl,vb,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);let t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);let t=this.children;for(let i=0,s=t.length;i<s;i++)t[i].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);let t=this.children;for(let i=0,s=t.length;i<s;i++)t[i].traverseVisible(e)}traverseAncestors(e){let t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);let t=this.children;for(let i=0,s=t.length;i<s;i++)t[i].updateMatrixWorld(e)}updateWorldMatrix(e,t){let i=this.parent;if(e===!0&&i!==null&&i.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),t===!0){let s=this.children;for(let r=0,o=s.length;r<o;r++)s[r].updateWorldMatrix(!1,!0)}}toJSON(e){let t=e===void 0||typeof e=="string",i={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},i.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});let s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.geometryInfo=this._geometryInfo.map(a=>({...a,boundingBox:a.boundingBox?a.boundingBox.toJSON():void 0,boundingSphere:a.boundingSphere?a.boundingSphere.toJSON():void 0})),s.instanceInfo=this._instanceInfo.map(a=>({...a})),s.availableInstanceIds=this._availableInstanceIds.slice(),s.availableGeometryIds=this._availableGeometryIds.slice(),s.nextIndexStart=this._nextIndexStart,s.nextVertexStart=this._nextVertexStart,s.geometryCount=this._geometryCount,s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.matricesTexture=this._matricesTexture.toJSON(e),s.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(s.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(s.boundingBox=this.boundingBox.toJSON()));function r(a,c){return a[c.uuid]===void 0&&(a[c.uuid]=c.toJSON(e)),c.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(e.geometries,this.geometry);let a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){let c=a.shapes;if(Array.isArray(c))for(let h=0,l=c.length;h<l;h++){let d=c[h];r(e.shapes,d)}else r(e.shapes,c)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(e.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){let a=[];for(let c=0,h=this.material.length;c<h;c++)a.push(r(e.materials,this.material[c]));s.material=a}else s.material=r(e.materials,this.material);if(this.children.length>0){s.children=[];for(let a=0;a<this.children.length;a++)s.children.push(this.children[a].toJSON(e).object)}if(this.animations.length>0){s.animations=[];for(let a=0;a<this.animations.length;a++){let c=this.animations[a];s.animations.push(r(e.animations,c))}}if(t){let a=o(e.geometries),c=o(e.materials),h=o(e.textures),l=o(e.images),d=o(e.shapes),u=o(e.skeletons),f=o(e.animations),x=o(e.nodes);a.length>0&&(i.geometries=a),c.length>0&&(i.materials=c),h.length>0&&(i.textures=h),l.length>0&&(i.images=l),d.length>0&&(i.shapes=d),u.length>0&&(i.skeletons=u),f.length>0&&(i.animations=f),x.length>0&&(i.nodes=x)}return i.object=s,i;function o(a){let c=[];for(let h in a){let l=a[h];delete l.metadata,c.push(l)}return c}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let i=0;i<e.children.length;i++){let s=e.children[i];this.add(s.clone())}return this}};sn.DEFAULT_UP=new L(0,1,0);sn.DEFAULT_MATRIX_AUTO_UPDATE=!0;sn.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;var Yi=new L,Ys=new L,Fp=new L,Zs=new L,wa=new L,Aa=new L,J0=new L,Op=new L,Bp=new L,kp=new L,zp=new wt,Hp=new wt,Vp=new wt,Ks=class n{constructor(e=new L,t=new L,i=new L){this.a=e,this.b=t,this.c=i}static getNormal(e,t,i,s){s.subVectors(i,t),Yi.subVectors(e,t),s.cross(Yi);let r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(e,t,i,s,r){Yi.subVectors(s,t),Ys.subVectors(i,t),Fp.subVectors(e,t);let o=Yi.dot(Yi),a=Yi.dot(Ys),c=Yi.dot(Fp),h=Ys.dot(Ys),l=Ys.dot(Fp),d=o*h-a*a;if(d===0)return r.set(0,0,0),null;let u=1/d,f=(h*c-a*l)*u,x=(o*l-a*c)*u;return r.set(1-f-x,x,f)}static containsPoint(e,t,i,s){return this.getBarycoord(e,t,i,s,Zs)===null?!1:Zs.x>=0&&Zs.y>=0&&Zs.x+Zs.y<=1}static getInterpolation(e,t,i,s,r,o,a,c){return this.getBarycoord(e,t,i,s,Zs)===null?(c.x=0,c.y=0,"z"in c&&(c.z=0),"w"in c&&(c.w=0),null):(c.setScalar(0),c.addScaledVector(r,Zs.x),c.addScaledVector(o,Zs.y),c.addScaledVector(a,Zs.z),c)}static getInterpolatedAttribute(e,t,i,s,r,o){return zp.setScalar(0),Hp.setScalar(0),Vp.setScalar(0),zp.fromBufferAttribute(e,t),Hp.fromBufferAttribute(e,i),Vp.fromBufferAttribute(e,s),o.setScalar(0),o.addScaledVector(zp,r.x),o.addScaledVector(Hp,r.y),o.addScaledVector(Vp,r.z),o}static isFrontFacing(e,t,i,s){return Yi.subVectors(i,t),Ys.subVectors(e,t),Yi.cross(Ys).dot(s)<0}set(e,t,i){return this.a.copy(e),this.b.copy(t),this.c.copy(i),this}setFromPointsAndIndices(e,t,i,s){return this.a.copy(e[t]),this.b.copy(e[i]),this.c.copy(e[s]),this}setFromAttributeAndIndices(e,t,i,s){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,i),this.c.fromBufferAttribute(e,s),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return Yi.subVectors(this.c,this.b),Ys.subVectors(this.a,this.b),Yi.cross(Ys).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return n.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return n.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,i,s,r){return n.getInterpolation(e,this.a,this.b,this.c,t,i,s,r)}containsPoint(e){return n.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return n.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){let i=this.a,s=this.b,r=this.c,o,a;wa.subVectors(s,i),Aa.subVectors(r,i),Op.subVectors(e,i);let c=wa.dot(Op),h=Aa.dot(Op);if(c<=0&&h<=0)return t.copy(i);Bp.subVectors(e,s);let l=wa.dot(Bp),d=Aa.dot(Bp);if(l>=0&&d<=l)return t.copy(s);let u=c*d-l*h;if(u<=0&&c>=0&&l<=0)return o=c/(c-l),t.copy(i).addScaledVector(wa,o);kp.subVectors(e,r);let f=wa.dot(kp),x=Aa.dot(kp);if(x>=0&&f<=x)return t.copy(r);let y=f*h-c*x;if(y<=0&&h>=0&&x<=0)return a=h/(h-x),t.copy(i).addScaledVector(Aa,a);let m=l*x-f*d;if(m<=0&&d-l>=0&&f-x>=0)return J0.subVectors(r,s),a=(d-l)/(d-l+(f-x)),t.copy(s).addScaledVector(J0,a);let p=1/(m+y+u);return o=y*p,a=u*p,t.copy(i).addScaledVector(wa,o).addScaledVector(Aa,a)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}},qx={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Er={h:0,s:0,l:0},Gh={h:0,s:0,l:0};function Gp(n,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?n+(e-n)*6*t:t<1/2?e:t<2/3?n+(e-n)*6*(2/3-t):n}var Ee=class{constructor(e,t,i){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,i)}set(e,t,i){if(t===void 0&&i===void 0){let s=e;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(e,t,i);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=$n){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,lt.colorSpaceToWorking(this,t),this}setRGB(e,t,i,s=lt.workingColorSpace){return this.r=e,this.g=t,this.b=i,lt.colorSpaceToWorking(this,s),this}setHSL(e,t,i,s=lt.workingColorSpace){if(e=bm(e,1),t=tt(t,0,1),i=tt(i,0,1),t===0)this.r=this.g=this.b=i;else{let r=i<=.5?i*(1+t):i+t-i*t,o=2*i-r;this.r=Gp(o,r,e+1/3),this.g=Gp(o,r,e),this.b=Gp(o,r,e-1/3)}return lt.colorSpaceToWorking(this,s),this}setStyle(e,t=$n){function i(r){r!==void 0&&parseFloat(r)<1&&console.warn("THREE.Color: Alpha component of "+e+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(e)){let r,o=s[1],a=s[2];switch(o){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return i(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,t);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return i(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,t);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return i(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,t);break;default:console.warn("THREE.Color: Unknown color model "+e)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(e)){let r=s[1],o=r.length;if(o===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,t);if(o===6)return this.setHex(parseInt(r,16),t);console.warn("THREE.Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=$n){let i=qx[e.toLowerCase()];return i!==void 0?this.setHex(i,t):console.warn("THREE.Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=Js(e.r),this.g=Js(e.g),this.b=Js(e.b),this}copyLinearToSRGB(e){return this.r=La(e.r),this.g=La(e.g),this.b=La(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=$n){return lt.workingToColorSpace(qn.copy(this),e),Math.round(tt(qn.r*255,0,255))*65536+Math.round(tt(qn.g*255,0,255))*256+Math.round(tt(qn.b*255,0,255))}getHexString(e=$n){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=lt.workingColorSpace){lt.workingToColorSpace(qn.copy(this),t);let i=qn.r,s=qn.g,r=qn.b,o=Math.max(i,s,r),a=Math.min(i,s,r),c,h,l=(a+o)/2;if(a===o)c=0,h=0;else{let d=o-a;switch(h=l<=.5?d/(o+a):d/(2-o-a),o){case i:c=(s-r)/d+(s<r?6:0);break;case s:c=(r-i)/d+2;break;case r:c=(i-s)/d+4;break}c/=6}return e.h=c,e.s=h,e.l=l,e}getRGB(e,t=lt.workingColorSpace){return lt.workingToColorSpace(qn.copy(this),t),e.r=qn.r,e.g=qn.g,e.b=qn.b,e}getStyle(e=$n){lt.workingToColorSpace(qn.copy(this),e);let t=qn.r,i=qn.g,s=qn.b;return e!==$n?`color(${e} ${t.toFixed(3)} ${i.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(i*255)},${Math.round(s*255)})`}offsetHSL(e,t,i){return this.getHSL(Er),this.setHSL(Er.h+e,Er.s+t,Er.l+i)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,i){return this.r=e.r+(t.r-e.r)*i,this.g=e.g+(t.g-e.g)*i,this.b=e.b+(t.b-e.b)*i,this}lerpHSL(e,t){this.getHSL(Er),e.getHSL(Gh);let i=Ql(Er.h,Gh.h,t),s=Ql(Er.s,Gh.s,t),r=Ql(Er.l,Gh.l,t);return this.setHSL(i,s,r),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){let t=this.r,i=this.g,s=this.b,r=e.elements;return this.r=r[0]*t+r[3]*i+r[6]*s,this.g=r[1]*t+r[4]*i+r[7]*s,this.b=r[2]*t+r[5]*i+r[8]*s,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}},qn=new Ee;Ee.NAMES=qx;var Mb=0,es=class extends Ss{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Mb++}),this.uuid=js(),this.name="",this.type="Material",this.blending=mo,this.side=ji,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=ou,this.blendDst=au,this.blendEquation=Ji,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Ee(0,0,0),this.blendAlpha=0,this.depthFunc=go,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=nm,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=po,this.stencilZFail=po,this.stencilZPass=po,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(let t in e){let i=e[t];if(i===void 0){console.warn(`THREE.Material: parameter '${t}' has value of undefined.`);continue}let s=this[t];if(s===void 0){console.warn(`THREE.Material: '${t}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(i):s&&s.isVector3&&i&&i.isVector3?s.copy(i):this[t]=i}}toJSON(e){let t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});let i={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.color&&this.color.isColor&&(i.color=this.color.getHex()),this.roughness!==void 0&&(i.roughness=this.roughness),this.metalness!==void 0&&(i.metalness=this.metalness),this.sheen!==void 0&&(i.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(i.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(i.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(i.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(i.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(i.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(i.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(i.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(i.shininess=this.shininess),this.clearcoat!==void 0&&(i.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(i.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(i.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(i.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,i.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(i.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(i.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(i.dispersion=this.dispersion),this.iridescence!==void 0&&(i.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(i.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(i.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(i.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(i.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(i.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(i.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(i.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(i.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(i.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(i.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(i.lightMap=this.lightMap.toJSON(e).uuid,i.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(i.aoMap=this.aoMap.toJSON(e).uuid,i.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(i.bumpMap=this.bumpMap.toJSON(e).uuid,i.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(i.normalMap=this.normalMap.toJSON(e).uuid,i.normalMapType=this.normalMapType,i.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(i.displacementMap=this.displacementMap.toJSON(e).uuid,i.displacementScale=this.displacementScale,i.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(i.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(i.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(i.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(i.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(i.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(i.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(i.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(i.combine=this.combine)),this.envMapRotation!==void 0&&(i.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(i.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(i.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(i.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(i.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(i.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(i.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(i.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(i.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(i.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(i.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(i.size=this.size),this.shadowSide!==null&&(i.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(i.sizeAttenuation=this.sizeAttenuation),this.blending!==mo&&(i.blending=this.blending),this.side!==ji&&(i.side=this.side),this.vertexColors===!0&&(i.vertexColors=!0),this.opacity<1&&(i.opacity=this.opacity),this.transparent===!0&&(i.transparent=!0),this.blendSrc!==ou&&(i.blendSrc=this.blendSrc),this.blendDst!==au&&(i.blendDst=this.blendDst),this.blendEquation!==Ji&&(i.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(i.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(i.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(i.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(i.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(i.blendAlpha=this.blendAlpha),this.depthFunc!==go&&(i.depthFunc=this.depthFunc),this.depthTest===!1&&(i.depthTest=this.depthTest),this.depthWrite===!1&&(i.depthWrite=this.depthWrite),this.colorWrite===!1&&(i.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(i.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==nm&&(i.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(i.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(i.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==po&&(i.stencilFail=this.stencilFail),this.stencilZFail!==po&&(i.stencilZFail=this.stencilZFail),this.stencilZPass!==po&&(i.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(i.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(i.rotation=this.rotation),this.polygonOffset===!0&&(i.polygonOffset=!0),this.polygonOffsetFactor!==0&&(i.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(i.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(i.linewidth=this.linewidth),this.dashSize!==void 0&&(i.dashSize=this.dashSize),this.gapSize!==void 0&&(i.gapSize=this.gapSize),this.scale!==void 0&&(i.scale=this.scale),this.dithering===!0&&(i.dithering=!0),this.alphaTest>0&&(i.alphaTest=this.alphaTest),this.alphaHash===!0&&(i.alphaHash=!0),this.alphaToCoverage===!0&&(i.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(i.premultipliedAlpha=!0),this.forceSinglePass===!0&&(i.forceSinglePass=!0),this.wireframe===!0&&(i.wireframe=!0),this.wireframeLinewidth>1&&(i.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(i.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(i.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(i.flatShading=!0),this.visible===!1&&(i.visible=!1),this.toneMapped===!1&&(i.toneMapped=!1),this.fog===!1&&(i.fog=!1),Object.keys(this.userData).length>0&&(i.userData=this.userData);function s(r){let o=[];for(let a in r){let c=r[a];delete c.metadata,o.push(c)}return o}if(t){let r=s(e.textures),o=s(e.images);r.length>0&&(i.textures=r),o.length>0&&(i.images=o)}return i}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;let t=e.clippingPlanes,i=null;if(t!==null){let s=t.length;i=new Array(s);for(let r=0;r!==s;++r)i[r]=t[r].clone()}return this.clippingPlanes=i,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}},ts=class extends es{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Ee(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new hi,this.combine=qu,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}};var dn=new L,Wh=new ae,Sb=0,Ht=class{constructor(e,t,i=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:Sb++}),this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=i,this.usage=hu,this.updateRanges=[],this.gpuType=bi,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,i){e*=this.itemSize,i*=t.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[e+s]=t.array[i+s];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,i=this.count;t<i;t++)Wh.fromBufferAttribute(this,t),Wh.applyMatrix3(e),this.setXY(t,Wh.x,Wh.y);else if(this.itemSize===3)for(let t=0,i=this.count;t<i;t++)dn.fromBufferAttribute(this,t),dn.applyMatrix3(e),this.setXYZ(t,dn.x,dn.y,dn.z);return this}applyMatrix4(e){for(let t=0,i=this.count;t<i;t++)dn.fromBufferAttribute(this,t),dn.applyMatrix4(e),this.setXYZ(t,dn.x,dn.y,dn.z);return this}applyNormalMatrix(e){for(let t=0,i=this.count;t<i;t++)dn.fromBufferAttribute(this,t),dn.applyNormalMatrix(e),this.setXYZ(t,dn.x,dn.y,dn.z);return this}transformDirection(e){for(let t=0,i=this.count;t<i;t++)dn.fromBufferAttribute(this,t),dn.transformDirection(e),this.setXYZ(t,dn.x,dn.y,dn.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let i=this.array[e*this.itemSize+t];return this.normalized&&(i=Zi(i,this.array)),i}setComponent(e,t,i){return this.normalized&&(i=St(i,this.array)),this.array[e*this.itemSize+t]=i,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=Zi(t,this.array)),t}setX(e,t){return this.normalized&&(t=St(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=Zi(t,this.array)),t}setY(e,t){return this.normalized&&(t=St(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=Zi(t,this.array)),t}setZ(e,t){return this.normalized&&(t=St(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=Zi(t,this.array)),t}setW(e,t){return this.normalized&&(t=St(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,i){return e*=this.itemSize,this.normalized&&(t=St(t,this.array),i=St(i,this.array)),this.array[e+0]=t,this.array[e+1]=i,this}setXYZ(e,t,i,s){return e*=this.itemSize,this.normalized&&(t=St(t,this.array),i=St(i,this.array),s=St(s,this.array)),this.array[e+0]=t,this.array[e+1]=i,this.array[e+2]=s,this}setXYZW(e,t,i,s,r){return e*=this.itemSize,this.normalized&&(t=St(t,this.array),i=St(i,this.array),s=St(s,this.array),r=St(r,this.array)),this.array[e+0]=t,this.array[e+1]=i,this.array[e+2]=s,this.array[e+3]=r,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==hu&&(e.usage=this.usage),e}};var ac=class extends Ht{constructor(e,t,i){super(new Uint16Array(e),t,i)}};var lc=class extends Ht{constructor(e,t,i){super(new Uint32Array(e),t,i)}};var Ut=class extends Ht{constructor(e,t,i){super(new Float32Array(e),t,i)}},wb=0,Ni=new ut,Wp=new sn,Ta=new L,yi=new ws,Xl=new ws,En=new L,fn=class n extends Ss{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:wb++}),this.uuid=js(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(Mm(e)?lc:ac)(e,1):this.index=e,this}setIndirect(e){return this.indirect=e,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,i=0){this.groups.push({start:e,count:t,materialIndex:i})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){let t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);let i=this.attributes.normal;if(i!==void 0){let r=new Qe().getNormalMatrix(e);i.applyNormalMatrix(r),i.needsUpdate=!0}let s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(e),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return Ni.makeRotationFromQuaternion(e),this.applyMatrix4(Ni),this}rotateX(e){return Ni.makeRotationX(e),this.applyMatrix4(Ni),this}rotateY(e){return Ni.makeRotationY(e),this.applyMatrix4(Ni),this}rotateZ(e){return Ni.makeRotationZ(e),this.applyMatrix4(Ni),this}translate(e,t,i){return Ni.makeTranslation(e,t,i),this.applyMatrix4(Ni),this}scale(e,t,i){return Ni.makeScale(e,t,i),this.applyMatrix4(Ni),this}lookAt(e){return Wp.lookAt(e),Wp.updateMatrix(),this.applyMatrix4(Wp.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Ta).negate(),this.translate(Ta.x,Ta.y,Ta.z),this}setFromPoints(e){let t=this.getAttribute("position");if(t===void 0){let i=[];for(let s=0,r=e.length;s<r;s++){let o=e[s];i.push(o.x,o.y,o.z||0)}this.setAttribute("position",new Ut(i,3))}else{let i=Math.min(e.length,t.count);for(let s=0;s<i;s++){let r=e[s];t.setXYZ(s,r.x,r.y,r.z||0)}e.length>t.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new ws);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new L(-1/0,-1/0,-1/0),new L(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let i=0,s=t.length;i<s;i++){let r=t[i];yi.setFromBufferAttribute(r),this.morphTargetsRelative?(En.addVectors(this.boundingBox.min,yi.min),this.boundingBox.expandByPoint(En),En.addVectors(this.boundingBox.max,yi.max),this.boundingBox.expandByPoint(En)):(this.boundingBox.expandByPoint(yi.min),this.boundingBox.expandByPoint(yi.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Pr);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new L,1/0);return}if(e){let i=this.boundingSphere.center;if(yi.setFromBufferAttribute(e),t)for(let r=0,o=t.length;r<o;r++){let a=t[r];Xl.setFromBufferAttribute(a),this.morphTargetsRelative?(En.addVectors(yi.min,Xl.min),yi.expandByPoint(En),En.addVectors(yi.max,Xl.max),yi.expandByPoint(En)):(yi.expandByPoint(Xl.min),yi.expandByPoint(Xl.max))}yi.getCenter(i);let s=0;for(let r=0,o=e.count;r<o;r++)En.fromBufferAttribute(e,r),s=Math.max(s,i.distanceToSquared(En));if(t)for(let r=0,o=t.length;r<o;r++){let a=t[r],c=this.morphTargetsRelative;for(let h=0,l=a.count;h<l;h++)En.fromBufferAttribute(a,h),c&&(Ta.fromBufferAttribute(e,h),En.add(Ta)),s=Math.max(s,i.distanceToSquared(En))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){let e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}let i=t.position,s=t.normal,r=t.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new Ht(new Float32Array(4*i.count),4));let o=this.getAttribute("tangent"),a=[],c=[];for(let P=0;P<i.count;P++)a[P]=new L,c[P]=new L;let h=new L,l=new L,d=new L,u=new ae,f=new ae,x=new ae,y=new L,m=new L;function p(P,b,M){h.fromBufferAttribute(i,P),l.fromBufferAttribute(i,b),d.fromBufferAttribute(i,M),u.fromBufferAttribute(r,P),f.fromBufferAttribute(r,b),x.fromBufferAttribute(r,M),l.sub(h),d.sub(h),f.sub(u),x.sub(u);let C=1/(f.x*x.y-x.x*f.y);isFinite(C)&&(y.copy(l).multiplyScalar(x.y).addScaledVector(d,-f.y).multiplyScalar(C),m.copy(d).multiplyScalar(f.x).addScaledVector(l,-x.x).multiplyScalar(C),a[P].add(y),a[b].add(y),a[M].add(y),c[P].add(m),c[b].add(m),c[M].add(m))}let w=this.groups;w.length===0&&(w=[{start:0,count:e.count}]);for(let P=0,b=w.length;P<b;++P){let M=w[P],C=M.start,U=M.count;for(let V=C,H=C+U;V<H;V+=3)p(e.getX(V+0),e.getX(V+1),e.getX(V+2))}let v=new L,g=new L,_=new L,S=new L;function R(P){_.fromBufferAttribute(s,P),S.copy(_);let b=a[P];v.copy(b),v.sub(_.multiplyScalar(_.dot(b))).normalize(),g.crossVectors(S,b);let C=g.dot(c[P])<0?-1:1;o.setXYZW(P,v.x,v.y,v.z,C)}for(let P=0,b=w.length;P<b;++P){let M=w[P],C=M.start,U=M.count;for(let V=C,H=C+U;V<H;V+=3)R(e.getX(V+0)),R(e.getX(V+1)),R(e.getX(V+2))}}computeVertexNormals(){let e=this.index,t=this.getAttribute("position");if(t!==void 0){let i=this.getAttribute("normal");if(i===void 0)i=new Ht(new Float32Array(t.count*3),3),this.setAttribute("normal",i);else for(let u=0,f=i.count;u<f;u++)i.setXYZ(u,0,0,0);let s=new L,r=new L,o=new L,a=new L,c=new L,h=new L,l=new L,d=new L;if(e)for(let u=0,f=e.count;u<f;u+=3){let x=e.getX(u+0),y=e.getX(u+1),m=e.getX(u+2);s.fromBufferAttribute(t,x),r.fromBufferAttribute(t,y),o.fromBufferAttribute(t,m),l.subVectors(o,r),d.subVectors(s,r),l.cross(d),a.fromBufferAttribute(i,x),c.fromBufferAttribute(i,y),h.fromBufferAttribute(i,m),a.add(l),c.add(l),h.add(l),i.setXYZ(x,a.x,a.y,a.z),i.setXYZ(y,c.x,c.y,c.z),i.setXYZ(m,h.x,h.y,h.z)}else for(let u=0,f=t.count;u<f;u+=3)s.fromBufferAttribute(t,u+0),r.fromBufferAttribute(t,u+1),o.fromBufferAttribute(t,u+2),l.subVectors(o,r),d.subVectors(s,r),l.cross(d),i.setXYZ(u+0,l.x,l.y,l.z),i.setXYZ(u+1,l.x,l.y,l.z),i.setXYZ(u+2,l.x,l.y,l.z);this.normalizeNormals(),i.needsUpdate=!0}}normalizeNormals(){let e=this.attributes.normal;for(let t=0,i=e.count;t<i;t++)En.fromBufferAttribute(e,t),En.normalize(),e.setXYZ(t,En.x,En.y,En.z)}toNonIndexed(){function e(a,c){let h=a.array,l=a.itemSize,d=a.normalized,u=new h.constructor(c.length*l),f=0,x=0;for(let y=0,m=c.length;y<m;y++){a.isInterleavedBufferAttribute?f=c[y]*a.data.stride+a.offset:f=c[y]*l;for(let p=0;p<l;p++)u[x++]=h[f++]}return new Ht(u,l,d)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;let t=new n,i=this.index.array,s=this.attributes;for(let a in s){let c=s[a],h=e(c,i);t.setAttribute(a,h)}let r=this.morphAttributes;for(let a in r){let c=[],h=r[a];for(let l=0,d=h.length;l<d;l++){let u=h[l],f=e(u,i);c.push(f)}t.morphAttributes[a]=c}t.morphTargetsRelative=this.morphTargetsRelative;let o=this.groups;for(let a=0,c=o.length;a<c;a++){let h=o[a];t.addGroup(h.start,h.count,h.materialIndex)}return t}toJSON(){let e={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){let c=this.parameters;for(let h in c)c[h]!==void 0&&(e[h]=c[h]);return e}e.data={attributes:{}};let t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});let i=this.attributes;for(let c in i){let h=i[c];e.data.attributes[c]=h.toJSON(e.data)}let s={},r=!1;for(let c in this.morphAttributes){let h=this.morphAttributes[c],l=[];for(let d=0,u=h.length;d<u;d++){let f=h[d];l.push(f.toJSON(e.data))}l.length>0&&(s[c]=l,r=!0)}r&&(e.data.morphAttributes=s,e.data.morphTargetsRelative=this.morphTargetsRelative);let o=this.groups;o.length>0&&(e.data.groups=JSON.parse(JSON.stringify(o)));let a=this.boundingSphere;return a!==null&&(e.data.boundingSphere=a.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let t={};this.name=e.name;let i=e.index;i!==null&&this.setIndex(i.clone());let s=e.attributes;for(let h in s){let l=s[h];this.setAttribute(h,l.clone(t))}let r=e.morphAttributes;for(let h in r){let l=[],d=r[h];for(let u=0,f=d.length;u<f;u++)l.push(d[u].clone(t));this.morphAttributes[h]=l}this.morphTargetsRelative=e.morphTargetsRelative;let o=e.groups;for(let h=0,l=o.length;h<l;h++){let d=o[h];this.addGroup(d.start,d.count,d.materialIndex)}let a=e.boundingBox;a!==null&&(this.boundingBox=a.clone());let c=e.boundingSphere;return c!==null&&(this.boundingSphere=c.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}},Q0=new ut,uo=new _o,Xh=new Pr,ex=new L,qh=new L,$h=new L,Yh=new L,Xp=new L,Zh=new L,tx=new L,Kh=new L,nt=class extends sn{constructor(e=new fn,t=new ts){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){let t=this.geometry.morphAttributes,i=Object.keys(t);if(i.length>0){let s=t[i[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){let a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}getVertexPosition(e,t){let i=this.geometry,s=i.attributes.position,r=i.morphAttributes.position,o=i.morphTargetsRelative;t.fromBufferAttribute(s,e);let a=this.morphTargetInfluences;if(r&&a){Zh.set(0,0,0);for(let c=0,h=r.length;c<h;c++){let l=a[c],d=r[c];l!==0&&(Xp.fromBufferAttribute(d,e),o?Zh.addScaledVector(Xp,l):Zh.addScaledVector(Xp.sub(t),l))}t.add(Zh)}return t}raycast(e,t){let i=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(i.boundingSphere===null&&i.computeBoundingSphere(),Xh.copy(i.boundingSphere),Xh.applyMatrix4(r),uo.copy(e.ray).recast(e.near),!(Xh.containsPoint(uo.origin)===!1&&(uo.intersectSphere(Xh,ex)===null||uo.origin.distanceToSquared(ex)>(e.far-e.near)**2))&&(Q0.copy(r).invert(),uo.copy(e.ray).applyMatrix4(Q0),!(i.boundingBox!==null&&uo.intersectsBox(i.boundingBox)===!1)&&this._computeIntersections(e,t,uo)))}_computeIntersections(e,t,i){let s,r=this.geometry,o=this.material,a=r.index,c=r.attributes.position,h=r.attributes.uv,l=r.attributes.uv1,d=r.attributes.normal,u=r.groups,f=r.drawRange;if(a!==null)if(Array.isArray(o))for(let x=0,y=u.length;x<y;x++){let m=u[x],p=o[m.materialIndex],w=Math.max(m.start,f.start),v=Math.min(a.count,Math.min(m.start+m.count,f.start+f.count));for(let g=w,_=v;g<_;g+=3){let S=a.getX(g),R=a.getX(g+1),P=a.getX(g+2);s=jh(this,p,e,i,h,l,d,S,R,P),s&&(s.faceIndex=Math.floor(g/3),s.face.materialIndex=m.materialIndex,t.push(s))}}else{let x=Math.max(0,f.start),y=Math.min(a.count,f.start+f.count);for(let m=x,p=y;m<p;m+=3){let w=a.getX(m),v=a.getX(m+1),g=a.getX(m+2);s=jh(this,o,e,i,h,l,d,w,v,g),s&&(s.faceIndex=Math.floor(m/3),t.push(s))}}else if(c!==void 0)if(Array.isArray(o))for(let x=0,y=u.length;x<y;x++){let m=u[x],p=o[m.materialIndex],w=Math.max(m.start,f.start),v=Math.min(c.count,Math.min(m.start+m.count,f.start+f.count));for(let g=w,_=v;g<_;g+=3){let S=g,R=g+1,P=g+2;s=jh(this,p,e,i,h,l,d,S,R,P),s&&(s.faceIndex=Math.floor(g/3),s.face.materialIndex=m.materialIndex,t.push(s))}}else{let x=Math.max(0,f.start),y=Math.min(c.count,f.start+f.count);for(let m=x,p=y;m<p;m+=3){let w=m,v=m+1,g=m+2;s=jh(this,o,e,i,h,l,d,w,v,g),s&&(s.faceIndex=Math.floor(m/3),t.push(s))}}}};function Ab(n,e,t,i,s,r,o,a){let c;if(e.side===bn?c=i.intersectTriangle(o,r,s,!0,a):c=i.intersectTriangle(s,r,o,e.side===ji,a),c===null)return null;Kh.copy(a),Kh.applyMatrix4(n.matrixWorld);let h=t.ray.origin.distanceTo(Kh);return h<t.near||h>t.far?null:{distance:h,point:Kh.clone(),object:n}}function jh(n,e,t,i,s,r,o,a,c,h){n.getVertexPosition(a,qh),n.getVertexPosition(c,$h),n.getVertexPosition(h,Yh);let l=Ab(n,e,t,i,qh,$h,Yh,tx);if(l){let d=new L;Ks.getBarycoord(tx,qh,$h,Yh,d),s&&(l.uv=Ks.getInterpolatedAttribute(s,a,c,h,d,new ae)),r&&(l.uv1=Ks.getInterpolatedAttribute(r,a,c,h,d,new ae)),o&&(l.normal=Ks.getInterpolatedAttribute(o,a,c,h,d,new L),l.normal.dot(i.direction)>0&&l.normal.multiplyScalar(-1));let u={a,b:c,c:h,normal:new L,materialIndex:0};Ks.getNormal(qh,$h,Yh,u.normal),l.face=u,l.barycoord=d}return l}var Ir=class n extends fn{constructor(e=1,t=1,i=1,s=1,r=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:i,widthSegments:s,heightSegments:r,depthSegments:o};let a=this;s=Math.floor(s),r=Math.floor(r),o=Math.floor(o);let c=[],h=[],l=[],d=[],u=0,f=0;x("z","y","x",-1,-1,i,t,e,o,r,0),x("z","y","x",1,-1,i,t,-e,o,r,1),x("x","z","y",1,1,e,i,t,s,o,2),x("x","z","y",1,-1,e,i,-t,s,o,3),x("x","y","z",1,-1,e,t,i,s,r,4),x("x","y","z",-1,-1,e,t,-i,s,r,5),this.setIndex(c),this.setAttribute("position",new Ut(h,3)),this.setAttribute("normal",new Ut(l,3)),this.setAttribute("uv",new Ut(d,2));function x(y,m,p,w,v,g,_,S,R,P,b){let M=g/R,C=_/P,U=g/2,V=_/2,H=S/2,k=R+1,z=P+1,ie=0,$=0,te=new L;for(let F=0;F<z;F++){let O=F*C-V;for(let J=0;J<k;J++){let q=J*M-U;te[y]=q*w,te[m]=O*v,te[p]=H,h.push(te.x,te.y,te.z),te[y]=0,te[m]=0,te[p]=S>0?1:-1,l.push(te.x,te.y,te.z),d.push(J/R),d.push(1-F/P),ie+=1}}for(let F=0;F<P;F++)for(let O=0;O<R;O++){let J=u+O+k*F,q=u+O+k*(F+1),le=u+(O+1)+k*(F+1),Se=u+(O+1)+k*F;c.push(J,q,Se),c.push(q,le,Se),$+=6}a.addGroup(f,$,b),f+=$,u+=ie}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new n(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}};function Eo(n){let e={};for(let t in n){e[t]={};for(let i in n[t]){let s=n[t][i];s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)?s.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][i]=null):e[t][i]=s.clone():Array.isArray(s)?e[t][i]=s.slice():e[t][i]=s}}return e}function Yn(n){let e={};for(let t=0;t<n.length;t++){let i=Eo(n[t]);for(let s in i)e[s]=i[s]}return e}function Tb(n){let e=[];for(let t=0;t<n.length;t++)e.push(n[t].clone());return e}function Sm(n){let e=n.getRenderTarget();return e===null?n.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:lt.workingColorSpace}var ui={clone:Eo,merge:Yn},Eb=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,Rb=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,Pt=class extends es{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=Eb,this.fragmentShader=Rb,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=Eo(e.uniforms),this.uniformsGroups=Tb(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){let t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(let s in this.uniforms){let o=this.uniforms[s].value;o&&o.isTexture?t.uniforms[s]={type:"t",value:o.toJSON(e).uuid}:o&&o.isColor?t.uniforms[s]={type:"c",value:o.getHex()}:o&&o.isVector2?t.uniforms[s]={type:"v2",value:o.toArray()}:o&&o.isVector3?t.uniforms[s]={type:"v3",value:o.toArray()}:o&&o.isVector4?t.uniforms[s]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?t.uniforms[s]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?t.uniforms[s]={type:"m4",value:o.toArray()}:t.uniforms[s]={value:o}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;let i={};for(let s in this.extensions)this.extensions[s]===!0&&(i[s]=!0);return Object.keys(i).length>0&&(t.extensions=i),t}},cc=class extends sn{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new ut,this.projectionMatrix=new ut,this.projectionMatrixInverse=new ut,this.coordinateSystem=Ki,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}},Rr=new L,nx=new ae,ix=new ae,Bn=class extends cc{constructor(e=50,t=1,i=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=i,this.far=s,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){let t=.5*this.getFilmHeight()/e;this.fov=Fa*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){let e=Math.tan(Jl*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return Fa*2*Math.atan(Math.tan(Jl*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,i){Rr.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(Rr.x,Rr.y).multiplyScalar(-e/Rr.z),Rr.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),i.set(Rr.x,Rr.y).multiplyScalar(-e/Rr.z)}getViewSize(e,t){return this.getViewBounds(e,nx,ix),t.subVectors(ix,nx)}setViewOffset(e,t,i,s,r,o){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=i,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=this.near,t=e*Math.tan(Jl*.5*this.fov)/this.zoom,i=2*t,s=this.aspect*i,r=-.5*s,o=this.view;if(this.view!==null&&this.view.enabled){let c=o.fullWidth,h=o.fullHeight;r+=o.offsetX*s/c,t-=o.offsetY*i/h,s*=o.width/c,i*=o.height/h}let a=this.filmOffset;a!==0&&(r+=e*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,t,t-i,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}},Ea=-90,Ra=1,pu=class extends sn{constructor(e,t,i){super(),this.type="CubeCamera",this.renderTarget=i,this.coordinateSystem=null,this.activeMipmapLevel=0;let s=new Bn(Ea,Ra,e,t);s.layers=this.layers,this.add(s);let r=new Bn(Ea,Ra,e,t);r.layers=this.layers,this.add(r);let o=new Bn(Ea,Ra,e,t);o.layers=this.layers,this.add(o);let a=new Bn(Ea,Ra,e,t);a.layers=this.layers,this.add(a);let c=new Bn(Ea,Ra,e,t);c.layers=this.layers,this.add(c);let h=new Bn(Ea,Ra,e,t);h.layers=this.layers,this.add(h)}updateCoordinateSystem(){let e=this.coordinateSystem,t=this.children.concat(),[i,s,r,o,a,c]=t;for(let h of t)this.remove(h);if(e===Ki)i.up.set(0,1,0),i.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),a.up.set(0,1,0),a.lookAt(0,0,1),c.up.set(0,1,0),c.lookAt(0,0,-1);else if(e===sc)i.up.set(0,-1,0),i.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),a.up.set(0,-1,0),a.lookAt(0,0,1),c.up.set(0,-1,0),c.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(let h of t)this.add(h),h.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();let{renderTarget:i,activeMipmapLevel:s}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());let[r,o,a,c,h,l]=this.children,d=e.getRenderTarget(),u=e.getActiveCubeFace(),f=e.getActiveMipmapLevel(),x=e.xr.enabled;e.xr.enabled=!1;let y=i.texture.generateMipmaps;i.texture.generateMipmaps=!1,e.setRenderTarget(i,0,s),e.render(t,r),e.setRenderTarget(i,1,s),e.render(t,o),e.setRenderTarget(i,2,s),e.render(t,a),e.setRenderTarget(i,3,s),e.render(t,c),e.setRenderTarget(i,4,s),e.render(t,h),i.texture.generateMipmaps=y,e.setRenderTarget(i,5,s),e.render(t,l),e.setRenderTarget(d,u,f),e.xr.enabled=x,i.texture.needsPMREMUpdate=!0}},hc=class extends Qn{constructor(e=[],t=Ao,i,s,r,o,a,c,h,l){super(e,t,i,s,r,o,a,c,h,l),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}},mu=class extends ln{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;let i={width:e,height:e,depth:1},s=[i,i,i,i,i,i];this.texture=new hc(s),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;let i={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},s=new Ir(5,5,5),r=new Pt({name:"CubemapFromEquirect",uniforms:Eo(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,side:bn,blending:Rn});r.uniforms.tEquirect.value=t;let o=new nt(s,r),a=t.minFilter;return t.minFilter===Or&&(t.minFilter=Qi),new pu(1,10,this).update(e,o),t.minFilter=a,o.geometry.dispose(),o.material.dispose(),this}clear(e,t=!0,i=!0,s=!0){let r=e.getRenderTarget();for(let o=0;o<6;o++)e.setRenderTarget(this,o),e.clear(t,i,s);e.setRenderTarget(r)}},Lt=class extends sn{constructor(){super(),this.isGroup=!0,this.type="Group"}},Cb={type:"move"},za=class{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Lt,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Lt,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new L,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new L),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Lt,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new L,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new L),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){let t=this._hand;if(t)for(let i of e.hand.values())this._getHandJoint(t,i)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,i){let s=null,r=null,o=null,a=this._targetRay,c=this._grip,h=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(h&&e.hand){o=!0;for(let y of e.hand.values()){let m=t.getJointPose(y,i),p=this._getHandJoint(h,y);m!==null&&(p.matrix.fromArray(m.transform.matrix),p.matrix.decompose(p.position,p.rotation,p.scale),p.matrixWorldNeedsUpdate=!0,p.jointRadius=m.radius),p.visible=m!==null}let l=h.joints["index-finger-tip"],d=h.joints["thumb-tip"],u=l.position.distanceTo(d.position),f=.02,x=.005;h.inputState.pinching&&u>f+x?(h.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!h.inputState.pinching&&u<=f-x&&(h.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else c!==null&&e.gripSpace&&(r=t.getPose(e.gripSpace,i),r!==null&&(c.matrix.fromArray(r.transform.matrix),c.matrix.decompose(c.position,c.rotation,c.scale),c.matrixWorldNeedsUpdate=!0,r.linearVelocity?(c.hasLinearVelocity=!0,c.linearVelocity.copy(r.linearVelocity)):c.hasLinearVelocity=!1,r.angularVelocity?(c.hasAngularVelocity=!0,c.angularVelocity.copy(r.angularVelocity)):c.hasAngularVelocity=!1));a!==null&&(s=t.getPose(e.targetRaySpace,i),s===null&&r!==null&&(s=r),s!==null&&(a.matrix.fromArray(s.transform.matrix),a.matrix.decompose(a.position,a.rotation,a.scale),a.matrixWorldNeedsUpdate=!0,s.linearVelocity?(a.hasLinearVelocity=!0,a.linearVelocity.copy(s.linearVelocity)):a.hasLinearVelocity=!1,s.angularVelocity?(a.hasAngularVelocity=!0,a.angularVelocity.copy(s.angularVelocity)):a.hasAngularVelocity=!1,this.dispatchEvent(Cb)))}return a!==null&&(a.visible=s!==null),c!==null&&(c.visible=r!==null),h!==null&&(h.visible=o!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){let i=new Lt;i.matrixAutoUpdate=!1,i.visible=!1,e.joints[t.jointName]=i,e.add(i)}return e.joints[t.jointName]}},uc=class n{constructor(e,t=25e-5){this.isFogExp2=!0,this.name="",this.color=new Ee(e),this.density=t}clone(){return new n(this.color,this.density)}toJSON(){return{type:"FogExp2",name:this.name,color:this.color.getHex(),density:this.density}}};var vo=class extends sn{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new hi,this.environmentIntensity=1,this.environmentRotation=new hi,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){let t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(t.object.environmentIntensity=this.environmentIntensity),t.object.environmentRotation=this.environmentRotation.toArray(),t}},dc=class{constructor(e,t){this.isInterleavedBuffer=!0,this.array=e,this.stride=t,this.count=e!==void 0?e.length/t:0,this.usage=hu,this.updateRanges=[],this.version=0,this.uuid=js()}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.array=new e.array.constructor(e.array),this.count=e.count,this.stride=e.stride,this.usage=e.usage,this}copyAt(e,t,i){e*=this.stride,i*=t.stride;for(let s=0,r=this.stride;s<r;s++)this.array[e+s]=t.array[i+s];return this}set(e,t=0){return this.array.set(e,t),this}clone(e){e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=js()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);let t=new this.array.constructor(e.arrayBuffers[this.array.buffer._uuid]),i=new this.constructor(t,this.stride);return i.setUsage(this.usage),i}onUpload(e){return this.onUploadCallback=e,this}toJSON(e){return e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=js()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer))),{uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride}}},jn=new L,Ha=class n{constructor(e,t,i,s=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=e,this.itemSize=t,this.offset=i,this.normalized=s}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(e){this.data.needsUpdate=e}applyMatrix4(e){for(let t=0,i=this.data.count;t<i;t++)jn.fromBufferAttribute(this,t),jn.applyMatrix4(e),this.setXYZ(t,jn.x,jn.y,jn.z);return this}applyNormalMatrix(e){for(let t=0,i=this.count;t<i;t++)jn.fromBufferAttribute(this,t),jn.applyNormalMatrix(e),this.setXYZ(t,jn.x,jn.y,jn.z);return this}transformDirection(e){for(let t=0,i=this.count;t<i;t++)jn.fromBufferAttribute(this,t),jn.transformDirection(e),this.setXYZ(t,jn.x,jn.y,jn.z);return this}getComponent(e,t){let i=this.array[e*this.data.stride+this.offset+t];return this.normalized&&(i=Zi(i,this.array)),i}setComponent(e,t,i){return this.normalized&&(i=St(i,this.array)),this.data.array[e*this.data.stride+this.offset+t]=i,this}setX(e,t){return this.normalized&&(t=St(t,this.array)),this.data.array[e*this.data.stride+this.offset]=t,this}setY(e,t){return this.normalized&&(t=St(t,this.array)),this.data.array[e*this.data.stride+this.offset+1]=t,this}setZ(e,t){return this.normalized&&(t=St(t,this.array)),this.data.array[e*this.data.stride+this.offset+2]=t,this}setW(e,t){return this.normalized&&(t=St(t,this.array)),this.data.array[e*this.data.stride+this.offset+3]=t,this}getX(e){let t=this.data.array[e*this.data.stride+this.offset];return this.normalized&&(t=Zi(t,this.array)),t}getY(e){let t=this.data.array[e*this.data.stride+this.offset+1];return this.normalized&&(t=Zi(t,this.array)),t}getZ(e){let t=this.data.array[e*this.data.stride+this.offset+2];return this.normalized&&(t=Zi(t,this.array)),t}getW(e){let t=this.data.array[e*this.data.stride+this.offset+3];return this.normalized&&(t=Zi(t,this.array)),t}setXY(e,t,i){return e=e*this.data.stride+this.offset,this.normalized&&(t=St(t,this.array),i=St(i,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=i,this}setXYZ(e,t,i,s){return e=e*this.data.stride+this.offset,this.normalized&&(t=St(t,this.array),i=St(i,this.array),s=St(s,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=i,this.data.array[e+2]=s,this}setXYZW(e,t,i,s,r){return e=e*this.data.stride+this.offset,this.normalized&&(t=St(t,this.array),i=St(i,this.array),s=St(s,this.array),r=St(r,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=i,this.data.array[e+2]=s,this.data.array[e+3]=r,this}clone(e){if(e===void 0){console.log("THREE.InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");let t=[];for(let i=0;i<this.count;i++){let s=i*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)t.push(this.data.array[s+r])}return new Ht(new this.array.constructor(t),this.itemSize,this.normalized)}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.clone(e)),new n(e.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(e){if(e===void 0){console.log("THREE.InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");let t=[];for(let i=0;i<this.count;i++){let s=i*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)t.push(this.data.array[s+r])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:t,normalized:this.normalized}}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.toJSON(e)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}},Va=class extends es{constructor(e){super(),this.isSpriteMaterial=!0,this.type="SpriteMaterial",this.color=new Ee(16777215),this.map=null,this.alphaMap=null,this.rotation=0,this.sizeAttenuation=!0,this.transparent=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.rotation=e.rotation,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}},Ca,ql=new L,Pa=new L,Ia=new L,Na=new ae,$l=new ae,$x=new ut,Jh=new L,Yl=new L,Qh=new L,sx=new ae,qp=new ae,rx=new ae,fc=class extends sn{constructor(e=new Va){if(super(),this.isSprite=!0,this.type="Sprite",Ca===void 0){Ca=new fn;let t=new Float32Array([-.5,-.5,0,0,0,.5,-.5,0,1,0,.5,.5,0,1,1,-.5,.5,0,0,1]),i=new dc(t,5);Ca.setIndex([0,1,2,0,2,3]),Ca.setAttribute("position",new Ha(i,3,0,!1)),Ca.setAttribute("uv",new Ha(i,2,3,!1))}this.geometry=Ca,this.material=e,this.center=new ae(.5,.5),this.count=1}raycast(e,t){e.camera===null&&console.error('THREE.Sprite: "Raycaster.camera" needs to be set in order to raycast against sprites.'),Pa.setFromMatrixScale(this.matrixWorld),$x.copy(e.camera.matrixWorld),this.modelViewMatrix.multiplyMatrices(e.camera.matrixWorldInverse,this.matrixWorld),Ia.setFromMatrixPosition(this.modelViewMatrix),e.camera.isPerspectiveCamera&&this.material.sizeAttenuation===!1&&Pa.multiplyScalar(-Ia.z);let i=this.material.rotation,s,r;i!==0&&(r=Math.cos(i),s=Math.sin(i));let o=this.center;eu(Jh.set(-.5,-.5,0),Ia,o,Pa,s,r),eu(Yl.set(.5,-.5,0),Ia,o,Pa,s,r),eu(Qh.set(.5,.5,0),Ia,o,Pa,s,r),sx.set(0,0),qp.set(1,0),rx.set(1,1);let a=e.ray.intersectTriangle(Jh,Yl,Qh,!1,ql);if(a===null&&(eu(Yl.set(-.5,.5,0),Ia,o,Pa,s,r),qp.set(0,1),a=e.ray.intersectTriangle(Jh,Qh,Yl,!1,ql),a===null))return;let c=e.ray.origin.distanceTo(ql);c<e.near||c>e.far||t.push({distance:c,point:ql.clone(),uv:Ks.getInterpolation(ql,Jh,Yl,Qh,sx,qp,rx,new ae),face:null,object:this})}copy(e,t){return super.copy(e,t),e.center!==void 0&&this.center.copy(e.center),this.material=e.material,this}};function eu(n,e,t,i,s,r){Na.subVectors(n,t).addScalar(.5).multiply(i),s!==void 0?($l.x=r*Na.x-s*Na.y,$l.y=s*Na.x+r*Na.y):$l.copy(Na),n.copy(e),n.x+=$l.x,n.y+=$l.y,n.applyMatrix4($x)}var Ga=class extends Qn{constructor(e=null,t=1,i=1,s,r,o,a,c,h=kn,l=kn,d,u){super(null,o,a,c,h,l,s,r,d,u),this.isDataTexture=!0,this.image={data:e,width:t,height:i},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}};var Wa=class extends Ht{constructor(e,t,i,s=1){super(e,t,i),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=s}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}toJSON(){let e=super.toJSON();return e.meshPerAttribute=this.meshPerAttribute,e.isInstancedBufferAttribute=!0,e}},Da=new ut,ox=new ut,tu=[],ax=new ws,Pb=new ut,Zl=new nt,Kl=new Pr,ei=class extends nt{constructor(e,t,i){super(e,t),this.isInstancedMesh=!0,this.instanceMatrix=new Wa(new Float32Array(i*16),16),this.instanceColor=null,this.morphTexture=null,this.count=i,this.boundingBox=null,this.boundingSphere=null;for(let s=0;s<i;s++)this.setMatrixAt(s,Pb)}computeBoundingBox(){let e=this.geometry,t=this.count;this.boundingBox===null&&(this.boundingBox=new ws),e.boundingBox===null&&e.computeBoundingBox(),this.boundingBox.makeEmpty();for(let i=0;i<t;i++)this.getMatrixAt(i,Da),ax.copy(e.boundingBox).applyMatrix4(Da),this.boundingBox.union(ax)}computeBoundingSphere(){let e=this.geometry,t=this.count;this.boundingSphere===null&&(this.boundingSphere=new Pr),e.boundingSphere===null&&e.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let i=0;i<t;i++)this.getMatrixAt(i,Da),Kl.copy(e.boundingSphere).applyMatrix4(Da),this.boundingSphere.union(Kl)}copy(e,t){return super.copy(e,t),this.instanceMatrix.copy(e.instanceMatrix),e.morphTexture!==null&&(this.morphTexture=e.morphTexture.clone()),e.instanceColor!==null&&(this.instanceColor=e.instanceColor.clone()),this.count=e.count,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}getColorAt(e,t){t.fromArray(this.instanceColor.array,e*3)}getMatrixAt(e,t){t.fromArray(this.instanceMatrix.array,e*16)}getMorphAt(e,t){let i=t.morphTargetInfluences,s=this.morphTexture.source.data.data,r=i.length+1,o=e*r+1;for(let a=0;a<i.length;a++)i[a]=s[o+a]}raycast(e,t){let i=this.matrixWorld,s=this.count;if(Zl.geometry=this.geometry,Zl.material=this.material,Zl.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),Kl.copy(this.boundingSphere),Kl.applyMatrix4(i),e.ray.intersectsSphere(Kl)!==!1))for(let r=0;r<s;r++){this.getMatrixAt(r,Da),ox.multiplyMatrices(i,Da),Zl.matrixWorld=ox,Zl.raycast(e,tu);for(let o=0,a=tu.length;o<a;o++){let c=tu[o];c.instanceId=r,c.object=this,t.push(c)}tu.length=0}}setColorAt(e,t){this.instanceColor===null&&(this.instanceColor=new Wa(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),t.toArray(this.instanceColor.array,e*3)}setMatrixAt(e,t){t.toArray(this.instanceMatrix.array,e*16)}setMorphAt(e,t){let i=t.morphTargetInfluences,s=i.length+1;this.morphTexture===null&&(this.morphTexture=new Ga(new Float32Array(s*this.count),s,this.count,ja,bi));let r=this.morphTexture.source.data.data,o=0;for(let h=0;h<i.length;h++)o+=i[h];let a=this.geometry.morphTargetsRelative?1:1-o,c=s*e;r[c]=a,r.set(i,c+1)}updateMorphTargets(){}dispose(){this.dispatchEvent({type:"dispose"}),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null)}},$p=new L,Ib=new L,Nb=new Qe,Jn=class{constructor(e=new L(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,i,s){return this.normal.set(e,t,i),this.constant=s,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,i){let s=$p.subVectors(i,t).cross(Ib.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(s,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){let e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t){let i=e.delta($p),s=this.normal.dot(i);if(s===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;let r=-(e.start.dot(this.normal)+this.constant)/s;return r<0||r>1?null:t.copy(e.start).addScaledVector(i,r)}intersectsLine(e){let t=this.distanceToPoint(e.start),i=this.distanceToPoint(e.end);return t<0&&i>0||i<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){let i=t||Nb.getNormalMatrix(e),s=this.coplanarPoint($p).applyMatrix4(e),r=this.normal.applyMatrix3(i).normalize();return this.constant=-s.dot(r),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}},fo=new Pr,Db=new ae(.5,.5),nu=new L,Xa=class{constructor(e=new Jn,t=new Jn,i=new Jn,s=new Jn,r=new Jn,o=new Jn){this.planes=[e,t,i,s,r,o]}set(e,t,i,s,r,o){let a=this.planes;return a[0].copy(e),a[1].copy(t),a[2].copy(i),a[3].copy(s),a[4].copy(r),a[5].copy(o),this}copy(e){let t=this.planes;for(let i=0;i<6;i++)t[i].copy(e.planes[i]);return this}setFromProjectionMatrix(e,t=Ki,i=!1){let s=this.planes,r=e.elements,o=r[0],a=r[1],c=r[2],h=r[3],l=r[4],d=r[5],u=r[6],f=r[7],x=r[8],y=r[9],m=r[10],p=r[11],w=r[12],v=r[13],g=r[14],_=r[15];if(s[0].setComponents(h-o,f-l,p-x,_-w).normalize(),s[1].setComponents(h+o,f+l,p+x,_+w).normalize(),s[2].setComponents(h+a,f+d,p+y,_+v).normalize(),s[3].setComponents(h-a,f-d,p-y,_-v).normalize(),i)s[4].setComponents(c,u,m,g).normalize(),s[5].setComponents(h-c,f-u,p-m,_-g).normalize();else if(s[4].setComponents(h-c,f-u,p-m,_-g).normalize(),t===Ki)s[5].setComponents(h+c,f+u,p+m,_+g).normalize();else if(t===sc)s[5].setComponents(c,u,m,g).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),fo.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{let t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),fo.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(fo)}intersectsSprite(e){fo.center.set(0,0,0);let t=Db.distanceTo(e.center);return fo.radius=.7071067811865476+t,fo.applyMatrix4(e.matrixWorld),this.intersectsSphere(fo)}intersectsSphere(e){let t=this.planes,i=e.center,s=-e.radius;for(let r=0;r<6;r++)if(t[r].distanceToPoint(i)<s)return!1;return!0}intersectsBox(e){let t=this.planes;for(let i=0;i<6;i++){let s=t[i];if(nu.x=s.normal.x>0?e.max.x:e.min.x,nu.y=s.normal.y>0?e.max.y:e.min.y,nu.z=s.normal.z>0?e.max.z:e.min.z,s.distanceToPoint(nu)<0)return!1}return!0}containsPoint(e){let t=this.planes;for(let i=0;i<6;i++)if(t[i].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}};var pc=class extends Qn{constructor(e,t,i,s,r,o,a,c,h){super(e,t,i,s,r,o,a,c,h),this.isCanvasTexture=!0,this.needsUpdate=!0}},bo=class extends Qn{constructor(e,t,i=Br,s,r,o,a=kn,c=kn,h,l=Ua,d=1){if(l!==Ua&&l!==zr)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");let u={width:e,height:t,depth:d};super(u,s,r,o,a,c,l,i,h),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new Ba(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){let t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}},mc=class extends Qn{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}};var As=class n extends fn{constructor(e=1,t=1,i=1,s=32,r=1,o=!1,a=0,c=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:t,height:i,radialSegments:s,heightSegments:r,openEnded:o,thetaStart:a,thetaLength:c};let h=this;s=Math.floor(s),r=Math.floor(r);let l=[],d=[],u=[],f=[],x=0,y=[],m=i/2,p=0;w(),o===!1&&(e>0&&v(!0),t>0&&v(!1)),this.setIndex(l),this.setAttribute("position",new Ut(d,3)),this.setAttribute("normal",new Ut(u,3)),this.setAttribute("uv",new Ut(f,2));function w(){let g=new L,_=new L,S=0,R=(t-e)/i;for(let P=0;P<=r;P++){let b=[],M=P/r,C=M*(t-e)+e;for(let U=0;U<=s;U++){let V=U/s,H=V*c+a,k=Math.sin(H),z=Math.cos(H);_.x=C*k,_.y=-M*i+m,_.z=C*z,d.push(_.x,_.y,_.z),g.set(k,R,z).normalize(),u.push(g.x,g.y,g.z),f.push(V,1-M),b.push(x++)}y.push(b)}for(let P=0;P<s;P++)for(let b=0;b<r;b++){let M=y[b][P],C=y[b+1][P],U=y[b+1][P+1],V=y[b][P+1];(e>0||b!==0)&&(l.push(M,C,V),S+=3),(t>0||b!==r-1)&&(l.push(C,U,V),S+=3)}h.addGroup(p,S,0),p+=S}function v(g){let _=x,S=new ae,R=new L,P=0,b=g===!0?e:t,M=g===!0?1:-1;for(let U=1;U<=s;U++)d.push(0,m*M,0),u.push(0,M,0),f.push(.5,.5),x++;let C=x;for(let U=0;U<=s;U++){let H=U/s*c+a,k=Math.cos(H),z=Math.sin(H);R.x=b*z,R.y=m*M,R.z=b*k,d.push(R.x,R.y,R.z),u.push(0,M,0),S.x=k*.5+.5,S.y=z*.5*M+.5,f.push(S.x,S.y),x++}for(let U=0;U<s;U++){let V=_+U,H=C+U;g===!0?l.push(H,H+1,V):l.push(H+1,H,V),P+=3}h.addGroup(p,P,g===!0?1:2),p+=P}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new n(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}},gc=class n extends As{constructor(e=1,t=1,i=32,s=1,r=!1,o=0,a=Math.PI*2){super(0,e,t,i,s,r,o,a),this.type="ConeGeometry",this.parameters={radius:e,height:t,radialSegments:i,heightSegments:s,openEnded:r,thetaStart:o,thetaLength:a}}static fromJSON(e){return new n(e.radius,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}},gu=class n extends fn{constructor(e=[],t=[],i=1,s=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:e,indices:t,radius:i,detail:s};let r=[],o=[];a(s),h(i),l(),this.setAttribute("position",new Ut(r,3)),this.setAttribute("normal",new Ut(r.slice(),3)),this.setAttribute("uv",new Ut(o,2)),s===0?this.computeVertexNormals():this.normalizeNormals();function a(w){let v=new L,g=new L,_=new L;for(let S=0;S<t.length;S+=3)f(t[S+0],v),f(t[S+1],g),f(t[S+2],_),c(v,g,_,w)}function c(w,v,g,_){let S=_+1,R=[];for(let P=0;P<=S;P++){R[P]=[];let b=w.clone().lerp(g,P/S),M=v.clone().lerp(g,P/S),C=S-P;for(let U=0;U<=C;U++)U===0&&P===S?R[P][U]=b:R[P][U]=b.clone().lerp(M,U/C)}for(let P=0;P<S;P++)for(let b=0;b<2*(S-P)-1;b++){let M=Math.floor(b/2);b%2===0?(u(R[P][M+1]),u(R[P+1][M]),u(R[P][M])):(u(R[P][M+1]),u(R[P+1][M+1]),u(R[P+1][M]))}}function h(w){let v=new L;for(let g=0;g<r.length;g+=3)v.x=r[g+0],v.y=r[g+1],v.z=r[g+2],v.normalize().multiplyScalar(w),r[g+0]=v.x,r[g+1]=v.y,r[g+2]=v.z}function l(){let w=new L;for(let v=0;v<r.length;v+=3){w.x=r[v+0],w.y=r[v+1],w.z=r[v+2];let g=m(w)/2/Math.PI+.5,_=p(w)/Math.PI+.5;o.push(g,1-_)}x(),d()}function d(){for(let w=0;w<o.length;w+=6){let v=o[w+0],g=o[w+2],_=o[w+4],S=Math.max(v,g,_),R=Math.min(v,g,_);S>.9&&R<.1&&(v<.2&&(o[w+0]+=1),g<.2&&(o[w+2]+=1),_<.2&&(o[w+4]+=1))}}function u(w){r.push(w.x,w.y,w.z)}function f(w,v){let g=w*3;v.x=e[g+0],v.y=e[g+1],v.z=e[g+2]}function x(){let w=new L,v=new L,g=new L,_=new L,S=new ae,R=new ae,P=new ae;for(let b=0,M=0;b<r.length;b+=9,M+=6){w.set(r[b+0],r[b+1],r[b+2]),v.set(r[b+3],r[b+4],r[b+5]),g.set(r[b+6],r[b+7],r[b+8]),S.set(o[M+0],o[M+1]),R.set(o[M+2],o[M+3]),P.set(o[M+4],o[M+5]),_.copy(w).add(v).add(g).divideScalar(3);let C=m(_);y(S,M+0,w,C),y(R,M+2,v,C),y(P,M+4,g,C)}}function y(w,v,g,_){_<0&&w.x===1&&(o[v]=w.x-1),g.x===0&&g.z===0&&(o[v]=_/2/Math.PI+.5)}function m(w){return Math.atan2(w.z,-w.x)}function p(w){return Math.atan2(-w.y,Math.sqrt(w.x*w.x+w.z*w.z))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new n(e.vertices,e.indices,e.radius,e.details)}};var Di=class{constructor(){this.type="Curve",this.arcLengthDivisions=200,this.needsUpdate=!1,this.cacheArcLengths=null}getPoint(){console.warn("THREE.Curve: .getPoint() not implemented.")}getPointAt(e,t){let i=this.getUtoTmapping(e);return this.getPoint(i,t)}getPoints(e=5){let t=[];for(let i=0;i<=e;i++)t.push(this.getPoint(i/e));return t}getSpacedPoints(e=5){let t=[];for(let i=0;i<=e;i++)t.push(this.getPointAt(i/e));return t}getLength(){let e=this.getLengths();return e[e.length-1]}getLengths(e=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===e+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;let t=[],i,s=this.getPoint(0),r=0;t.push(0);for(let o=1;o<=e;o++)i=this.getPoint(o/e),r+=i.distanceTo(s),t.push(r),s=i;return this.cacheArcLengths=t,t}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(e,t=null){let i=this.getLengths(),s=0,r=i.length,o;t?o=t:o=e*i[r-1];let a=0,c=r-1,h;for(;a<=c;)if(s=Math.floor(a+(c-a)/2),h=i[s]-o,h<0)a=s+1;else if(h>0)c=s-1;else{c=s;break}if(s=c,i[s]===o)return s/(r-1);let l=i[s],u=i[s+1]-l,f=(o-l)/u;return(s+f)/(r-1)}getTangent(e,t){let s=e-1e-4,r=e+1e-4;s<0&&(s=0),r>1&&(r=1);let o=this.getPoint(s),a=this.getPoint(r),c=t||(o.isVector2?new ae:new L);return c.copy(a).sub(o).normalize(),c}getTangentAt(e,t){let i=this.getUtoTmapping(e);return this.getTangent(i,t)}computeFrenetFrames(e,t=!1){let i=new L,s=[],r=[],o=[],a=new L,c=new ut;for(let f=0;f<=e;f++){let x=f/e;s[f]=this.getTangentAt(x,new L)}r[0]=new L,o[0]=new L;let h=Number.MAX_VALUE,l=Math.abs(s[0].x),d=Math.abs(s[0].y),u=Math.abs(s[0].z);l<=h&&(h=l,i.set(1,0,0)),d<=h&&(h=d,i.set(0,1,0)),u<=h&&i.set(0,0,1),a.crossVectors(s[0],i).normalize(),r[0].crossVectors(s[0],a),o[0].crossVectors(s[0],r[0]);for(let f=1;f<=e;f++){if(r[f]=r[f-1].clone(),o[f]=o[f-1].clone(),a.crossVectors(s[f-1],s[f]),a.length()>Number.EPSILON){a.normalize();let x=Math.acos(tt(s[f-1].dot(s[f]),-1,1));r[f].applyMatrix4(c.makeRotationAxis(a,x))}o[f].crossVectors(s[f],r[f])}if(t===!0){let f=Math.acos(tt(r[0].dot(r[e]),-1,1));f/=e,s[0].dot(a.crossVectors(r[0],r[e]))>0&&(f=-f);for(let x=1;x<=e;x++)r[x].applyMatrix4(c.makeRotationAxis(s[x],f*x)),o[x].crossVectors(s[x],r[x])}return{tangents:s,normals:r,binormals:o}}clone(){return new this.constructor().copy(this)}copy(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}toJSON(){let e={metadata:{version:4.7,type:"Curve",generator:"Curve.toJSON"}};return e.arcLengthDivisions=this.arcLengthDivisions,e.type=this.type,e}fromJSON(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}},xc=class extends Di{constructor(e=0,t=0,i=1,s=1,r=0,o=Math.PI*2,a=!1,c=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=e,this.aY=t,this.xRadius=i,this.yRadius=s,this.aStartAngle=r,this.aEndAngle=o,this.aClockwise=a,this.aRotation=c}getPoint(e,t=new ae){let i=t,s=Math.PI*2,r=this.aEndAngle-this.aStartAngle,o=Math.abs(r)<Number.EPSILON;for(;r<0;)r+=s;for(;r>s;)r-=s;r<Number.EPSILON&&(o?r=0:r=s),this.aClockwise===!0&&!o&&(r===s?r=-s:r=r-s);let a=this.aStartAngle+e*r,c=this.aX+this.xRadius*Math.cos(a),h=this.aY+this.yRadius*Math.sin(a);if(this.aRotation!==0){let l=Math.cos(this.aRotation),d=Math.sin(this.aRotation),u=c-this.aX,f=h-this.aY;c=u*l-f*d+this.aX,h=u*d+f*l+this.aY}return i.set(c,h)}copy(e){return super.copy(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}toJSON(){let e=super.toJSON();return e.aX=this.aX,e.aY=this.aY,e.xRadius=this.xRadius,e.yRadius=this.yRadius,e.aStartAngle=this.aStartAngle,e.aEndAngle=this.aEndAngle,e.aClockwise=this.aClockwise,e.aRotation=this.aRotation,e}fromJSON(e){return super.fromJSON(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}},xu=class extends xc{constructor(e,t,i,s,r,o){super(e,t,i,i,s,r,o),this.isArcCurve=!0,this.type="ArcCurve"}};function wm(){let n=0,e=0,t=0,i=0;function s(r,o,a,c){n=r,e=a,t=-3*r+3*o-2*a-c,i=2*r-2*o+a+c}return{initCatmullRom:function(r,o,a,c,h){s(o,a,h*(a-r),h*(c-o))},initNonuniformCatmullRom:function(r,o,a,c,h,l,d){let u=(o-r)/h-(a-r)/(h+l)+(a-o)/l,f=(a-o)/l-(c-o)/(l+d)+(c-a)/d;u*=l,f*=l,s(o,a,u,f)},calc:function(r){let o=r*r,a=o*r;return n+e*r+t*o+i*a}}}var iu=new L,Yp=new wm,Zp=new wm,Kp=new wm,ns=class extends Di{constructor(e=[],t=!1,i="centripetal",s=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=e,this.closed=t,this.curveType=i,this.tension=s}getPoint(e,t=new L){let i=t,s=this.points,r=s.length,o=(r-(this.closed?0:1))*e,a=Math.floor(o),c=o-a;this.closed?a+=a>0?0:(Math.floor(Math.abs(a)/r)+1)*r:c===0&&a===r-1&&(a=r-2,c=1);let h,l;this.closed||a>0?h=s[(a-1)%r]:(iu.subVectors(s[0],s[1]).add(s[0]),h=iu);let d=s[a%r],u=s[(a+1)%r];if(this.closed||a+2<r?l=s[(a+2)%r]:(iu.subVectors(s[r-1],s[r-2]).add(s[r-1]),l=iu),this.curveType==="centripetal"||this.curveType==="chordal"){let f=this.curveType==="chordal"?.5:.25,x=Math.pow(h.distanceToSquared(d),f),y=Math.pow(d.distanceToSquared(u),f),m=Math.pow(u.distanceToSquared(l),f);y<1e-4&&(y=1),x<1e-4&&(x=y),m<1e-4&&(m=y),Yp.initNonuniformCatmullRom(h.x,d.x,u.x,l.x,x,y,m),Zp.initNonuniformCatmullRom(h.y,d.y,u.y,l.y,x,y,m),Kp.initNonuniformCatmullRom(h.z,d.z,u.z,l.z,x,y,m)}else this.curveType==="catmullrom"&&(Yp.initCatmullRom(h.x,d.x,u.x,l.x,this.tension),Zp.initCatmullRom(h.y,d.y,u.y,l.y,this.tension),Kp.initCatmullRom(h.z,d.z,u.z,l.z,this.tension));return i.set(Yp.calc(c),Zp.calc(c),Kp.calc(c)),i}copy(e){super.copy(e),this.points=[];for(let t=0,i=e.points.length;t<i;t++){let s=e.points[t];this.points.push(s.clone())}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}toJSON(){let e=super.toJSON();e.points=[];for(let t=0,i=this.points.length;t<i;t++){let s=this.points[t];e.points.push(s.toArray())}return e.closed=this.closed,e.curveType=this.curveType,e.tension=this.tension,e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,i=e.points.length;t<i;t++){let s=e.points[t];this.points.push(new L().fromArray(s))}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}};function lx(n,e,t,i,s){let r=(i-e)*.5,o=(s-t)*.5,a=n*n,c=n*a;return(2*t-2*i+r+o)*c+(-3*t+3*i-2*r-o)*a+r*n+t}function Lb(n,e){let t=1-n;return t*t*e}function Ub(n,e){return 2*(1-n)*n*e}function Fb(n,e){return n*n*e}function ec(n,e,t,i){return Lb(n,e)+Ub(n,t)+Fb(n,i)}function Ob(n,e){let t=1-n;return t*t*t*e}function Bb(n,e){let t=1-n;return 3*t*t*n*e}function kb(n,e){return 3*(1-n)*n*n*e}function zb(n,e){return n*n*n*e}function tc(n,e,t,i,s){return Ob(n,e)+Bb(n,t)+kb(n,i)+zb(n,s)}var yu=class extends Di{constructor(e=new ae,t=new ae,i=new ae,s=new ae){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=e,this.v1=t,this.v2=i,this.v3=s}getPoint(e,t=new ae){let i=t,s=this.v0,r=this.v1,o=this.v2,a=this.v3;return i.set(tc(e,s.x,r.x,o.x,a.x),tc(e,s.y,r.y,o.y,a.y)),i}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}},qa=class extends Di{constructor(e=new L,t=new L,i=new L,s=new L){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=e,this.v1=t,this.v2=i,this.v3=s}getPoint(e,t=new L){let i=t,s=this.v0,r=this.v1,o=this.v2,a=this.v3;return i.set(tc(e,s.x,r.x,o.x,a.x),tc(e,s.y,r.y,o.y,a.y),tc(e,s.z,r.z,o.z,a.z)),i}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}},_u=class extends Di{constructor(e=new ae,t=new ae){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=e,this.v2=t}getPoint(e,t=new ae){let i=t;return e===1?i.copy(this.v2):(i.copy(this.v2).sub(this.v1),i.multiplyScalar(e).add(this.v1)),i}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new ae){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},vu=class extends Di{constructor(e=new L,t=new L){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=e,this.v2=t}getPoint(e,t=new L){let i=t;return e===1?i.copy(this.v2):(i.copy(this.v2).sub(this.v1),i.multiplyScalar(e).add(this.v1)),i}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new L){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},bu=class extends Di{constructor(e=new ae,t=new ae,i=new ae){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=e,this.v1=t,this.v2=i}getPoint(e,t=new ae){let i=t,s=this.v0,r=this.v1,o=this.v2;return i.set(ec(e,s.x,r.x,o.x),ec(e,s.y,r.y,o.y)),i}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},yc=class extends Di{constructor(e=new L,t=new L,i=new L){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=e,this.v1=t,this.v2=i}getPoint(e,t=new L){let i=t,s=this.v0,r=this.v1,o=this.v2;return i.set(ec(e,s.x,r.x,o.x),ec(e,s.y,r.y,o.y),ec(e,s.z,r.z,o.z)),i}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},Mu=class extends Di{constructor(e=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=e}getPoint(e,t=new ae){let i=t,s=this.points,r=(s.length-1)*e,o=Math.floor(r),a=r-o,c=s[o===0?o:o-1],h=s[o],l=s[o>s.length-2?s.length-1:o+1],d=s[o>s.length-3?s.length-1:o+2];return i.set(lx(a,c.x,h.x,l.x,d.x),lx(a,c.y,h.y,l.y,d.y)),i}copy(e){super.copy(e),this.points=[];for(let t=0,i=e.points.length;t<i;t++){let s=e.points[t];this.points.push(s.clone())}return this}toJSON(){let e=super.toJSON();e.points=[];for(let t=0,i=this.points.length;t<i;t++){let s=this.points[t];e.points.push(s.toArray())}return e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,i=e.points.length;t<i;t++){let s=e.points[t];this.points.push(new ae().fromArray(s))}return this}},Hb=Object.freeze({__proto__:null,ArcCurve:xu,CatmullRomCurve3:ns,CubicBezierCurve:yu,CubicBezierCurve3:qa,EllipseCurve:xc,LineCurve:_u,LineCurve3:vu,QuadraticBezierCurve:bu,QuadraticBezierCurve3:yc,SplineCurve:Mu});var _c=class n extends gu{constructor(e=1,t=0){let i=(1+Math.sqrt(5))/2,s=[-1,i,0,1,i,0,-1,-i,0,1,-i,0,0,-1,i,0,1,i,0,-1,-i,0,1,-i,i,0,-1,i,0,1,-i,0,-1,-i,0,1],r=[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1];super(s,r,e,t),this.type="IcosahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new n(e.radius,e.detail)}};var vc=class n extends fn{constructor(e=1,t=1,i=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:i,heightSegments:s};let r=e/2,o=t/2,a=Math.floor(i),c=Math.floor(s),h=a+1,l=c+1,d=e/a,u=t/c,f=[],x=[],y=[],m=[];for(let p=0;p<l;p++){let w=p*u-o;for(let v=0;v<h;v++){let g=v*d-r;x.push(g,-w,0),y.push(0,0,1),m.push(v/a),m.push(1-p/c)}}for(let p=0;p<c;p++)for(let w=0;w<a;w++){let v=w+h*p,g=w+h*(p+1),_=w+1+h*(p+1),S=w+1+h*p;f.push(v,g,S),f.push(g,_,S)}this.setIndex(f),this.setAttribute("position",new Ut(x,3)),this.setAttribute("normal",new Ut(y,3)),this.setAttribute("uv",new Ut(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new n(e.width,e.height,e.widthSegments,e.heightSegments)}};var Ts=class n extends fn{constructor(e=1,t=32,i=16,s=0,r=Math.PI*2,o=0,a=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:t,heightSegments:i,phiStart:s,phiLength:r,thetaStart:o,thetaLength:a},t=Math.max(3,Math.floor(t)),i=Math.max(2,Math.floor(i));let c=Math.min(o+a,Math.PI),h=0,l=[],d=new L,u=new L,f=[],x=[],y=[],m=[];for(let p=0;p<=i;p++){let w=[],v=p/i,g=0;p===0&&o===0?g=.5/t:p===i&&c===Math.PI&&(g=-.5/t);for(let _=0;_<=t;_++){let S=_/t;d.x=-e*Math.cos(s+S*r)*Math.sin(o+v*a),d.y=e*Math.cos(o+v*a),d.z=e*Math.sin(s+S*r)*Math.sin(o+v*a),x.push(d.x,d.y,d.z),u.copy(d).normalize(),y.push(u.x,u.y,u.z),m.push(S+g,1-v),w.push(h++)}l.push(w)}for(let p=0;p<i;p++)for(let w=0;w<t;w++){let v=l[p][w+1],g=l[p][w],_=l[p+1][w],S=l[p+1][w+1];(p!==0||o>0)&&f.push(v,g,S),(p!==i-1||c<Math.PI)&&f.push(g,_,S)}this.setIndex(f),this.setAttribute("position",new Ut(x,3)),this.setAttribute("normal",new Ut(y,3)),this.setAttribute("uv",new Ut(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new n(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}};var bc=class n extends fn{constructor(e=new yc(new L(-1,-1,0),new L(-1,1,0),new L(1,1,0)),t=64,i=1,s=8,r=!1){super(),this.type="TubeGeometry",this.parameters={path:e,tubularSegments:t,radius:i,radialSegments:s,closed:r};let o=e.computeFrenetFrames(t,r);this.tangents=o.tangents,this.normals=o.normals,this.binormals=o.binormals;let a=new L,c=new L,h=new ae,l=new L,d=[],u=[],f=[],x=[];y(),this.setIndex(x),this.setAttribute("position",new Ut(d,3)),this.setAttribute("normal",new Ut(u,3)),this.setAttribute("uv",new Ut(f,2));function y(){for(let v=0;v<t;v++)m(v);m(r===!1?t:0),w(),p()}function m(v){l=e.getPointAt(v/t,l);let g=o.normals[v],_=o.binormals[v];for(let S=0;S<=s;S++){let R=S/s*Math.PI*2,P=Math.sin(R),b=-Math.cos(R);c.x=b*g.x+P*_.x,c.y=b*g.y+P*_.y,c.z=b*g.z+P*_.z,c.normalize(),u.push(c.x,c.y,c.z),a.x=l.x+i*c.x,a.y=l.y+i*c.y,a.z=l.z+i*c.z,d.push(a.x,a.y,a.z)}}function p(){for(let v=1;v<=t;v++)for(let g=1;g<=s;g++){let _=(s+1)*(v-1)+(g-1),S=(s+1)*v+(g-1),R=(s+1)*v+g,P=(s+1)*(v-1)+g;x.push(_,S,P),x.push(S,R,P)}}function w(){for(let v=0;v<=t;v++)for(let g=0;g<=s;g++)h.x=v/t,h.y=g/s,f.push(h.x,h.y)}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){let e=super.toJSON();return e.path=this.parameters.path.toJSON(),e}static fromJSON(e){return new n(new Hb[e.path.type]().fromJSON(e.path),e.tubularSegments,e.radius,e.radialSegments,e.closed)}};var Mc=class extends Pt{constructor(e){super(e),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}},Mo=class extends es{constructor(e){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new Ee(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Ee(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=zc,this.normalScale=new ae(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new hi,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}},Sc=class extends Mo{constructor(e){super(),this.isMeshPhysicalMaterial=!0,this.defines={STANDARD:"",PHYSICAL:""},this.type="MeshPhysicalMaterial",this.anisotropyRotation=0,this.anisotropyMap=null,this.clearcoatMap=null,this.clearcoatRoughness=0,this.clearcoatRoughnessMap=null,this.clearcoatNormalScale=new ae(1,1),this.clearcoatNormalMap=null,this.ior=1.5,Object.defineProperty(this,"reflectivity",{get:function(){return tt(2.5*(this.ior-1)/(this.ior+1),0,1)},set:function(t){this.ior=(1+.4*t)/(1-.4*t)}}),this.iridescenceMap=null,this.iridescenceIOR=1.3,this.iridescenceThicknessRange=[100,400],this.iridescenceThicknessMap=null,this.sheenColor=new Ee(0),this.sheenColorMap=null,this.sheenRoughness=1,this.sheenRoughnessMap=null,this.transmissionMap=null,this.thickness=0,this.thicknessMap=null,this.attenuationDistance=1/0,this.attenuationColor=new Ee(1,1,1),this.specularIntensity=1,this.specularIntensityMap=null,this.specularColor=new Ee(1,1,1),this.specularColorMap=null,this._anisotropy=0,this._clearcoat=0,this._dispersion=0,this._iridescence=0,this._sheen=0,this._transmission=0,this.setValues(e)}get anisotropy(){return this._anisotropy}set anisotropy(e){this._anisotropy>0!=e>0&&this.version++,this._anisotropy=e}get clearcoat(){return this._clearcoat}set clearcoat(e){this._clearcoat>0!=e>0&&this.version++,this._clearcoat=e}get iridescence(){return this._iridescence}set iridescence(e){this._iridescence>0!=e>0&&this.version++,this._iridescence=e}get dispersion(){return this._dispersion}set dispersion(e){this._dispersion>0!=e>0&&this.version++,this._dispersion=e}get sheen(){return this._sheen}set sheen(e){this._sheen>0!=e>0&&this.version++,this._sheen=e}get transmission(){return this._transmission}set transmission(e){this._transmission>0!=e>0&&this.version++,this._transmission=e}copy(e){return super.copy(e),this.defines={STANDARD:"",PHYSICAL:""},this.anisotropy=e.anisotropy,this.anisotropyRotation=e.anisotropyRotation,this.anisotropyMap=e.anisotropyMap,this.clearcoat=e.clearcoat,this.clearcoatMap=e.clearcoatMap,this.clearcoatRoughness=e.clearcoatRoughness,this.clearcoatRoughnessMap=e.clearcoatRoughnessMap,this.clearcoatNormalMap=e.clearcoatNormalMap,this.clearcoatNormalScale.copy(e.clearcoatNormalScale),this.dispersion=e.dispersion,this.ior=e.ior,this.iridescence=e.iridescence,this.iridescenceMap=e.iridescenceMap,this.iridescenceIOR=e.iridescenceIOR,this.iridescenceThicknessRange=[...e.iridescenceThicknessRange],this.iridescenceThicknessMap=e.iridescenceThicknessMap,this.sheen=e.sheen,this.sheenColor.copy(e.sheenColor),this.sheenColorMap=e.sheenColorMap,this.sheenRoughness=e.sheenRoughness,this.sheenRoughnessMap=e.sheenRoughnessMap,this.transmission=e.transmission,this.transmissionMap=e.transmissionMap,this.thickness=e.thickness,this.thicknessMap=e.thicknessMap,this.attenuationDistance=e.attenuationDistance,this.attenuationColor.copy(e.attenuationColor),this.specularIntensity=e.specularIntensity,this.specularIntensityMap=e.specularIntensityMap,this.specularColor.copy(e.specularColor),this.specularColorMap=e.specularColorMap,this}};var wc=class extends es{constructor(e){super(),this.isMeshNormalMaterial=!0,this.type="MeshNormalMaterial",this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=zc,this.normalScale=new ae(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.flatShading=!1,this.setValues(e)}copy(e){return super.copy(e),this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.flatShading=e.flatShading,this}},Ac=class extends es{constructor(e){super(),this.isMeshLambertMaterial=!0,this.type="MeshLambertMaterial",this.color=new Ee(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Ee(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=zc,this.normalScale=new ae(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new hi,this.combine=qu,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}},Su=class extends es{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=Lx,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}},wu=class extends es{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}};function su(n,e){return!n||n.constructor===e?n:typeof e.BYTES_PER_ELEMENT=="number"?new e(n):Array.prototype.slice.call(n)}function Vb(n){return ArrayBuffer.isView(n)&&!(n instanceof DataView)}var So=class{constructor(e,t,i,s){this.parameterPositions=e,this._cachedIndex=0,this.resultBuffer=s!==void 0?s:new t.constructor(i),this.sampleValues=t,this.valueSize=i,this.settings=null,this.DefaultSettings_={}}evaluate(e){let t=this.parameterPositions,i=this._cachedIndex,s=t[i],r=t[i-1];n:{e:{let o;t:{i:if(!(e<s)){for(let a=i+2;;){if(s===void 0){if(e<r)break i;return i=t.length,this._cachedIndex=i,this.copySampleValue_(i-1)}if(i===a)break;if(r=s,s=t[++i],e<s)break e}o=t.length;break t}if(!(e>=r)){let a=t[1];e<a&&(i=2,r=a);for(let c=i-2;;){if(r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(i===c)break;if(s=r,r=t[--i-1],e>=r)break e}o=i,i=0;break t}break n}for(;i<o;){let a=i+o>>>1;e<t[a]?o=a:i=a+1}if(s=t[i],r=t[i-1],r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(s===void 0)return i=t.length,this._cachedIndex=i,this.copySampleValue_(i-1)}this._cachedIndex=i,this.intervalChanged_(i,r,s)}return this.interpolate_(i,r,e,s)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(e){let t=this.resultBuffer,i=this.sampleValues,s=this.valueSize,r=e*s;for(let o=0;o!==s;++o)t[o]=i[r+o];return t}interpolate_(){throw new Error("call to abstract method")}intervalChanged_(){}},Au=class extends So{constructor(e,t,i,s){super(e,t,i,s),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:Qp,endingEnd:Qp}}intervalChanged_(e,t,i){let s=this.parameterPositions,r=e-2,o=e+1,a=s[r],c=s[o];if(a===void 0)switch(this.getSettings_().endingStart){case em:r=e,a=2*t-i;break;case tm:r=s.length-2,a=t+s[r]-s[r+1];break;default:r=e,a=i}if(c===void 0)switch(this.getSettings_().endingEnd){case em:o=e,c=2*i-t;break;case tm:o=1,c=i+s[1]-s[0];break;default:o=e-1,c=t}let h=(i-t)*.5,l=this.valueSize;this._weightPrev=h/(t-a),this._weightNext=h/(c-i),this._offsetPrev=r*l,this._offsetNext=o*l}interpolate_(e,t,i,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,c=e*a,h=c-a,l=this._offsetPrev,d=this._offsetNext,u=this._weightPrev,f=this._weightNext,x=(i-t)/(s-t),y=x*x,m=y*x,p=-u*m+2*u*y-u*x,w=(1+u)*m+(-1.5-2*u)*y+(-.5+u)*x+1,v=(-1-f)*m+(1.5+f)*y+.5*x,g=f*m-f*y;for(let _=0;_!==a;++_)r[_]=p*o[l+_]+w*o[h+_]+v*o[c+_]+g*o[d+_];return r}},Tu=class extends So{constructor(e,t,i,s){super(e,t,i,s)}interpolate_(e,t,i,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,c=e*a,h=c-a,l=(i-t)/(s-t),d=1-l;for(let u=0;u!==a;++u)r[u]=o[h+u]*d+o[c+u]*l;return r}},Eu=class extends So{constructor(e,t,i,s){super(e,t,i,s)}interpolate_(e){return this.copySampleValue_(e-1)}},_i=class{constructor(e,t,i,s){if(e===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(t===void 0||t.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+e);this.name=e,this.times=su(t,this.TimeBufferType),this.values=su(i,this.ValueBufferType),this.setInterpolation(s||this.DefaultInterpolation)}static toJSON(e){let t=e.constructor,i;if(t.toJSON!==this.toJSON)i=t.toJSON(e);else{i={name:e.name,times:su(e.times,Array),values:su(e.values,Array)};let s=e.getInterpolation();s!==e.DefaultInterpolation&&(i.interpolation=s)}return i.type=e.ValueTypeName,i}InterpolantFactoryMethodDiscrete(e){return new Eu(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodLinear(e){return new Tu(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodSmooth(e){return new Au(this.times,this.values,this.getValueSize(),e)}setInterpolation(e){let t;switch(e){case nc:t=this.InterpolantFactoryMethodDiscrete;break;case cu:t=this.InterpolantFactoryMethodLinear;break;case ru:t=this.InterpolantFactoryMethodSmooth;break}if(t===void 0){let i="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(e!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(i);return console.warn("THREE.KeyframeTrack:",i),this}return this.createInterpolant=t,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return nc;case this.InterpolantFactoryMethodLinear:return cu;case this.InterpolantFactoryMethodSmooth:return ru}}getValueSize(){return this.values.length/this.times.length}shift(e){if(e!==0){let t=this.times;for(let i=0,s=t.length;i!==s;++i)t[i]+=e}return this}scale(e){if(e!==1){let t=this.times;for(let i=0,s=t.length;i!==s;++i)t[i]*=e}return this}trim(e,t){let i=this.times,s=i.length,r=0,o=s-1;for(;r!==s&&i[r]<e;)++r;for(;o!==-1&&i[o]>t;)--o;if(++o,r!==0||o!==s){r>=o&&(o=Math.max(o,1),r=o-1);let a=this.getValueSize();this.times=i.slice(r,o),this.values=this.values.slice(r*a,o*a)}return this}validate(){let e=!0,t=this.getValueSize();t-Math.floor(t)!==0&&(console.error("THREE.KeyframeTrack: Invalid value size in track.",this),e=!1);let i=this.times,s=this.values,r=i.length;r===0&&(console.error("THREE.KeyframeTrack: Track is empty.",this),e=!1);let o=null;for(let a=0;a!==r;a++){let c=i[a];if(typeof c=="number"&&isNaN(c)){console.error("THREE.KeyframeTrack: Time is not a valid number.",this,a,c),e=!1;break}if(o!==null&&o>c){console.error("THREE.KeyframeTrack: Out of order keys.",this,a,c,o),e=!1;break}o=c}if(s!==void 0&&Vb(s))for(let a=0,c=s.length;a!==c;++a){let h=s[a];if(isNaN(h)){console.error("THREE.KeyframeTrack: Value is not a valid number.",this,a,h),e=!1;break}}return e}optimize(){let e=this.times.slice(),t=this.values.slice(),i=this.getValueSize(),s=this.getInterpolation()===ru,r=e.length-1,o=1;for(let a=1;a<r;++a){let c=!1,h=e[a],l=e[a+1];if(h!==l&&(a!==1||h!==e[0]))if(s)c=!0;else{let d=a*i,u=d-i,f=d+i;for(let x=0;x!==i;++x){let y=t[d+x];if(y!==t[u+x]||y!==t[f+x]){c=!0;break}}}if(c){if(a!==o){e[o]=e[a];let d=a*i,u=o*i;for(let f=0;f!==i;++f)t[u+f]=t[d+f]}++o}}if(r>0){e[o]=e[r];for(let a=r*i,c=o*i,h=0;h!==i;++h)t[c+h]=t[a+h];++o}return o!==e.length?(this.times=e.slice(0,o),this.values=t.slice(0,o*i)):(this.times=e,this.values=t),this}clone(){let e=this.times.slice(),t=this.values.slice(),i=this.constructor,s=new i(this.name,e,t);return s.createInterpolant=this.createInterpolant,s}};_i.prototype.ValueTypeName="";_i.prototype.TimeBufferType=Float32Array;_i.prototype.ValueBufferType=Float32Array;_i.prototype.DefaultInterpolation=cu;var Nr=class extends _i{constructor(e,t,i){super(e,t,i)}};Nr.prototype.ValueTypeName="bool";Nr.prototype.ValueBufferType=Array;Nr.prototype.DefaultInterpolation=nc;Nr.prototype.InterpolantFactoryMethodLinear=void 0;Nr.prototype.InterpolantFactoryMethodSmooth=void 0;var Ru=class extends _i{constructor(e,t,i,s){super(e,t,i,s)}};Ru.prototype.ValueTypeName="color";var Cu=class extends _i{constructor(e,t,i,s){super(e,t,i,s)}};Cu.prototype.ValueTypeName="number";var Pu=class extends So{constructor(e,t,i,s){super(e,t,i,s)}interpolate_(e,t,i,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,c=(i-t)/(s-t),h=e*a;for(let l=h+a;h!==l;h+=4)nn.slerpFlat(r,0,o,h-a,o,h,c);return r}},Tc=class extends _i{constructor(e,t,i,s){super(e,t,i,s)}InterpolantFactoryMethodLinear(e){return new Pu(this.times,this.values,this.getValueSize(),e)}};Tc.prototype.ValueTypeName="quaternion";Tc.prototype.InterpolantFactoryMethodSmooth=void 0;var Dr=class extends _i{constructor(e,t,i){super(e,t,i)}};Dr.prototype.ValueTypeName="string";Dr.prototype.ValueBufferType=Array;Dr.prototype.DefaultInterpolation=nc;Dr.prototype.InterpolantFactoryMethodLinear=void 0;Dr.prototype.InterpolantFactoryMethodSmooth=void 0;var Iu=class extends _i{constructor(e,t,i,s){super(e,t,i,s)}};Iu.prototype.ValueTypeName="vector";var Nu=class{constructor(e,t,i){let s=this,r=!1,o=0,a=0,c,h=[];this.onStart=void 0,this.onLoad=e,this.onProgress=t,this.onError=i,this.abortController=new AbortController,this.itemStart=function(l){a++,r===!1&&s.onStart!==void 0&&s.onStart(l,o,a),r=!0},this.itemEnd=function(l){o++,s.onProgress!==void 0&&s.onProgress(l,o,a),o===a&&(r=!1,s.onLoad!==void 0&&s.onLoad())},this.itemError=function(l){s.onError!==void 0&&s.onError(l)},this.resolveURL=function(l){return c?c(l):l},this.setURLModifier=function(l){return c=l,this},this.addHandler=function(l,d){return h.push(l,d),this},this.removeHandler=function(l){let d=h.indexOf(l);return d!==-1&&h.splice(d,2),this},this.getHandler=function(l){for(let d=0,u=h.length;d<u;d+=2){let f=h[d],x=h[d+1];if(f.global&&(f.lastIndex=0),f.test(l))return x}return null},this.abort=function(){return this.abortController.abort(),this.abortController=new AbortController,this}}},Yx=new Nu,Du=class{constructor(e){this.manager=e!==void 0?e:Yx,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={}}load(){}loadAsync(e,t){let i=this;return new Promise(function(s,r){i.load(e,s,t,r)})}parse(){}setCrossOrigin(e){return this.crossOrigin=e,this}setWithCredentials(e){return this.withCredentials=e,this}setPath(e){return this.path=e,this}setResourcePath(e){return this.resourcePath=e,this}setRequestHeader(e){return this.requestHeader=e,this}abort(){return this}};Du.DEFAULT_MATERIAL_NAME="__DEFAULT";var $a=class extends sn{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new Ee(e),this.intensity=t}dispose(){}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){let t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,this.groundColor!==void 0&&(t.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(t.object.distance=this.distance),this.angle!==void 0&&(t.object.angle=this.angle),this.decay!==void 0&&(t.object.decay=this.decay),this.penumbra!==void 0&&(t.object.penumbra=this.penumbra),this.shadow!==void 0&&(t.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(t.object.target=this.target.uuid),t}},Ec=class extends $a{constructor(e,t,i){super(e,i),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(sn.DEFAULT_UP),this.updateMatrix(),this.groundColor=new Ee(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}},jp=new ut,cx=new L,hx=new L,Lu=class{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new ae(512,512),this.mapType=is,this.map=null,this.mapPass=null,this.matrix=new ut,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Xa,this._frameExtents=new ae(1,1),this._viewportCount=1,this._viewports=[new wt(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){let t=this.camera,i=this.matrix;cx.setFromMatrixPosition(e.matrixWorld),t.position.copy(cx),hx.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(hx),t.updateMatrixWorld(),jp.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(jp,t.coordinateSystem,t.reversedDepth),t.reversedDepth?i.set(.5,0,0,.5,0,.5,0,.5,0,0,1,0,0,0,0,1):i.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),i.multiply(jp)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.autoUpdate=e.autoUpdate,this.needsUpdate=e.needsUpdate,this.normalBias=e.normalBias,this.blurSamples=e.blurSamples,this.mapSize.copy(e.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){let e={};return this.intensity!==1&&(e.intensity=this.intensity),this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}};var ux=new ut,jl=new L,Jp=new L,im=class extends Lu{constructor(){super(new Bn(90,1,.5,500)),this.isPointLightShadow=!0,this._frameExtents=new ae(4,2),this._viewportCount=6,this._viewports=[new wt(2,1,1,1),new wt(0,1,1,1),new wt(3,1,1,1),new wt(1,1,1,1),new wt(3,0,1,1),new wt(1,0,1,1)],this._cubeDirections=[new L(1,0,0),new L(-1,0,0),new L(0,0,1),new L(0,0,-1),new L(0,1,0),new L(0,-1,0)],this._cubeUps=[new L(0,1,0),new L(0,1,0),new L(0,1,0),new L(0,1,0),new L(0,0,1),new L(0,0,-1)]}updateMatrices(e,t=0){let i=this.camera,s=this.matrix,r=e.distance||i.far;r!==i.far&&(i.far=r,i.updateProjectionMatrix()),jl.setFromMatrixPosition(e.matrixWorld),i.position.copy(jl),Jp.copy(i.position),Jp.add(this._cubeDirections[t]),i.up.copy(this._cubeUps[t]),i.lookAt(Jp),i.updateMatrixWorld(),s.makeTranslation(-jl.x,-jl.y,-jl.z),ux.multiplyMatrices(i.projectionMatrix,i.matrixWorldInverse),this._frustum.setFromProjectionMatrix(ux,i.coordinateSystem,i.reversedDepth)}},Rc=class extends $a{constructor(e,t,i=0,s=2){super(e,t),this.isPointLight=!0,this.type="PointLight",this.distance=i,this.decay=s,this.shadow=new im}get power(){return this.intensity*4*Math.PI}set power(e){this.intensity=e/(4*Math.PI)}dispose(){this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.decay=e.decay,this.shadow=e.shadow.clone(),this}},wo=class extends cc{constructor(e=-1,t=1,i=1,s=-1,r=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=i,this.bottom=s,this.near=r,this.far=o,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,i,s,r,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=i,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),i=(this.right+this.left)/2,s=(this.top+this.bottom)/2,r=i-e,o=i+e,a=s+t,c=s-t;if(this.view!==null&&this.view.enabled){let h=(this.right-this.left)/this.view.fullWidth/this.zoom,l=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=h*this.view.offsetX,o=r+h*this.view.width,a-=l*this.view.offsetY,c=a-l*this.view.height}this.projectionMatrix.makeOrthographic(r,o,a,c,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}},sm=class extends Lu{constructor(){super(new wo(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}},Cc=class extends $a{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(sn.DEFAULT_UP),this.updateMatrix(),this.target=new sn,this.shadow=new sm}dispose(){this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}};var Uu=class extends Bn{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e}},Pc=class{constructor(e=!0){this.autoStart=e,this.startTime=0,this.oldTime=0,this.elapsedTime=0,this.running=!1}start(){this.startTime=performance.now(),this.oldTime=this.startTime,this.elapsedTime=0,this.running=!0}stop(){this.getElapsedTime(),this.running=!1,this.autoStart=!1}getElapsedTime(){return this.getDelta(),this.elapsedTime}getDelta(){let e=0;if(this.autoStart&&!this.running)return this.start(),0;if(this.running){let t=performance.now();e=(t-this.oldTime)/1e3,this.oldTime=t,this.elapsedTime+=e}return e}};var Am="\\[\\]\\.:\\/",Gb=new RegExp("["+Am+"]","g"),Tm="[^"+Am+"]",Wb="[^"+Am.replace("\\.","")+"]",Xb=/((?:WC+[\/:])*)/.source.replace("WC",Tm),qb=/(WCOD+)?/.source.replace("WCOD",Wb),$b=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",Tm),Yb=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",Tm),Zb=new RegExp("^"+Xb+qb+$b+Yb+"$"),Kb=["material","materials","bones","map"],rm=class{constructor(e,t,i){let s=i||Bt.parseTrackName(t);this._targetGroup=e,this._bindings=e.subscribe_(t,s)}getValue(e,t){this.bind();let i=this._targetGroup.nCachedObjects_,s=this._bindings[i];s!==void 0&&s.getValue(e,t)}setValue(e,t){let i=this._bindings;for(let s=this._targetGroup.nCachedObjects_,r=i.length;s!==r;++s)i[s].setValue(e,t)}bind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,i=e.length;t!==i;++t)e[t].bind()}unbind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,i=e.length;t!==i;++t)e[t].unbind()}},Bt=class n{constructor(e,t,i){this.path=t,this.parsedPath=i||n.parseTrackName(t),this.node=n.findNode(e,this.parsedPath.nodeName),this.rootNode=e,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(e,t,i){return e&&e.isAnimationObjectGroup?new n.Composite(e,t,i):new n(e,t,i)}static sanitizeNodeName(e){return e.replace(/\s/g,"_").replace(Gb,"")}static parseTrackName(e){let t=Zb.exec(e);if(t===null)throw new Error("PropertyBinding: Cannot parse trackName: "+e);let i={nodeName:t[2],objectName:t[3],objectIndex:t[4],propertyName:t[5],propertyIndex:t[6]},s=i.nodeName&&i.nodeName.lastIndexOf(".");if(s!==void 0&&s!==-1){let r=i.nodeName.substring(s+1);Kb.indexOf(r)!==-1&&(i.nodeName=i.nodeName.substring(0,s),i.objectName=r)}if(i.propertyName===null||i.propertyName.length===0)throw new Error("PropertyBinding: can not parse propertyName from trackName: "+e);return i}static findNode(e,t){if(t===void 0||t===""||t==="."||t===-1||t===e.name||t===e.uuid)return e;if(e.skeleton){let i=e.skeleton.getBoneByName(t);if(i!==void 0)return i}if(e.children){let i=function(r){for(let o=0;o<r.length;o++){let a=r[o];if(a.name===t||a.uuid===t)return a;let c=i(a.children);if(c)return c}return null},s=i(e.children);if(s)return s}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(e,t){e[t]=this.targetObject[this.propertyName]}_getValue_array(e,t){let i=this.resolvedProperty;for(let s=0,r=i.length;s!==r;++s)e[t++]=i[s]}_getValue_arrayElement(e,t){e[t]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(e,t){this.resolvedProperty.toArray(e,t)}_setValue_direct(e,t){this.targetObject[this.propertyName]=e[t]}_setValue_direct_setNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(e,t){let i=this.resolvedProperty;for(let s=0,r=i.length;s!==r;++s)i[s]=e[t++]}_setValue_array_setNeedsUpdate(e,t){let i=this.resolvedProperty;for(let s=0,r=i.length;s!==r;++s)i[s]=e[t++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(e,t){let i=this.resolvedProperty;for(let s=0,r=i.length;s!==r;++s)i[s]=e[t++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(e,t){this.resolvedProperty[this.propertyIndex]=e[t]}_setValue_arrayElement_setNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(e,t){this.resolvedProperty.fromArray(e,t)}_setValue_fromArray_setNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(e,t){this.bind(),this.getValue(e,t)}_setValue_unbound(e,t){this.bind(),this.setValue(e,t)}bind(){let e=this.node,t=this.parsedPath,i=t.objectName,s=t.propertyName,r=t.propertyIndex;if(e||(e=n.findNode(this.rootNode,t.nodeName),this.node=e),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!e){console.warn("THREE.PropertyBinding: No target node found for track: "+this.path+".");return}if(i){let h=t.objectIndex;switch(i){case"materials":if(!e.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.materials){console.error("THREE.PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}e=e.material.materials;break;case"bones":if(!e.skeleton){console.error("THREE.PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}e=e.skeleton.bones;for(let l=0;l<e.length;l++)if(e[l].name===h){h=l;break}break;case"map":if("map"in e){e=e.map;break}if(!e.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.map){console.error("THREE.PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}e=e.material.map;break;default:if(e[i]===void 0){console.error("THREE.PropertyBinding: Can not bind to objectName of node undefined.",this);return}e=e[i]}if(h!==void 0){if(e[h]===void 0){console.error("THREE.PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,e);return}e=e[h]}}let o=e[s];if(o===void 0){let h=t.nodeName;console.error("THREE.PropertyBinding: Trying to update property for track: "+h+"."+s+" but it wasn't found.",e);return}let a=this.Versioning.None;this.targetObject=e,e.isMaterial===!0?a=this.Versioning.NeedsUpdate:e.isObject3D===!0&&(a=this.Versioning.MatrixWorldNeedsUpdate);let c=this.BindingType.Direct;if(r!==void 0){if(s==="morphTargetInfluences"){if(!e.geometry){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!e.geometry.morphAttributes){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}e.morphTargetDictionary[r]!==void 0&&(r=e.morphTargetDictionary[r])}c=this.BindingType.ArrayElement,this.resolvedProperty=o,this.propertyIndex=r}else o.fromArray!==void 0&&o.toArray!==void 0?(c=this.BindingType.HasFromToArray,this.resolvedProperty=o):Array.isArray(o)?(c=this.BindingType.EntireArray,this.resolvedProperty=o):this.propertyName=s;this.getValue=this.GetterByBindingType[c],this.setValue=this.SetterByBindingTypeAndVersioning[c][a]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};Bt.Composite=rm;Bt.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};Bt.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};Bt.prototype.GetterByBindingType=[Bt.prototype._getValue_direct,Bt.prototype._getValue_array,Bt.prototype._getValue_arrayElement,Bt.prototype._getValue_toArray];Bt.prototype.SetterByBindingTypeAndVersioning=[[Bt.prototype._setValue_direct,Bt.prototype._setValue_direct_setNeedsUpdate,Bt.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[Bt.prototype._setValue_array,Bt.prototype._setValue_array_setNeedsUpdate,Bt.prototype._setValue_array_setMatrixWorldNeedsUpdate],[Bt.prototype._setValue_arrayElement,Bt.prototype._setValue_arrayElement_setNeedsUpdate,Bt.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[Bt.prototype._setValue_fromArray,Bt.prototype._setValue_fromArray_setNeedsUpdate,Bt.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];var jE=new Float32Array(1);var dx=new ut,Ic=class{constructor(e,t,i=0,s=1/0){this.ray=new _o(e,t),this.near=i,this.far=s,this.camera=null,this.layers=new ka,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(e,t){this.ray.set(e,t)}setFromCamera(e,t){t.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(e.x,e.y,.5).unproject(t).sub(this.ray.origin).normalize(),this.camera=t):t.isOrthographicCamera?(this.ray.origin.set(e.x,e.y,(t.near+t.far)/(t.near-t.far)).unproject(t),this.ray.direction.set(0,0,-1).transformDirection(t.matrixWorld),this.camera=t):console.error("THREE.Raycaster: Unsupported camera type: "+t.type)}setFromXRController(e){return dx.identity().extractRotation(e.matrixWorld),this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(dx),this}intersectObject(e,t=!0,i=[]){return om(e,this,i,t),i.sort(fx),i}intersectObjects(e,t=!0,i=[]){for(let s=0,r=e.length;s<r;s++)om(e[s],this,i,t);return i.sort(fx),i}};function fx(n,e){return n.distance-e.distance}function om(n,e,t,i){let s=!0;if(n.layers.test(e.layers)&&n.raycast(e,t)===!1&&(s=!1),s===!0&&i===!0){let r=n.children;for(let o=0,a=r.length;o<a;o++)om(r[o],e,t,!0)}}var Ya=class{constructor(e=1,t=0,i=0){this.radius=e,this.phi=t,this.theta=i}set(e,t,i){return this.radius=e,this.phi=t,this.theta=i,this}copy(e){return this.radius=e.radius,this.phi=e.phi,this.theta=e.theta,this}makeSafe(){return this.phi=tt(this.phi,1e-6,Math.PI-1e-6),this}setFromVector3(e){return this.setFromCartesianCoords(e.x,e.y,e.z)}setFromCartesianCoords(e,t,i){return this.radius=Math.sqrt(e*e+t*t+i*i),this.radius===0?(this.theta=0,this.phi=0):(this.theta=Math.atan2(e,i),this.phi=Math.acos(tt(t/this.radius,-1,1))),this}clone(){return new this.constructor().copy(this)}};var Nc=class extends Ss{constructor(e,t=null){super(),this.object=e,this.domElement=t,this.enabled=!0,this.state=-1,this.keys={},this.mouseButtons={LEFT:null,MIDDLE:null,RIGHT:null},this.touches={ONE:null,TWO:null}}connect(e){if(e===void 0){console.warn("THREE.Controls: connect() now requires an element.");return}this.domElement!==null&&this.disconnect(),this.domElement=e}disconnect(){}dispose(){}update(){}};function Em(n,e,t,i){let s=jb(i);switch(t){case gm:return n*e;case ja:return n*e/s.components*s.byteLength;case rd:return n*e/s.components*s.byteLength;case ym:return n*e*2/s.components*s.byteLength;case od:return n*e*2/s.components*s.byteLength;case xm:return n*e*3/s.components*s.byteLength;case Li:return n*e*4/s.components*s.byteLength;case ad:return n*e*4/s.components*s.byteLength;case Fc:case Oc:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*8;case Bc:case kc:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case cd:case ud:return Math.max(n,16)*Math.max(e,8)/4;case ld:case hd:return Math.max(n,8)*Math.max(e,8)/2;case dd:case fd:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*8;case pd:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case md:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case gd:return Math.floor((n+4)/5)*Math.floor((e+3)/4)*16;case xd:return Math.floor((n+4)/5)*Math.floor((e+4)/5)*16;case yd:return Math.floor((n+5)/6)*Math.floor((e+4)/5)*16;case _d:return Math.floor((n+5)/6)*Math.floor((e+5)/6)*16;case vd:return Math.floor((n+7)/8)*Math.floor((e+4)/5)*16;case bd:return Math.floor((n+7)/8)*Math.floor((e+5)/6)*16;case Md:return Math.floor((n+7)/8)*Math.floor((e+7)/8)*16;case Sd:return Math.floor((n+9)/10)*Math.floor((e+4)/5)*16;case wd:return Math.floor((n+9)/10)*Math.floor((e+5)/6)*16;case Ad:return Math.floor((n+9)/10)*Math.floor((e+7)/8)*16;case Td:return Math.floor((n+9)/10)*Math.floor((e+9)/10)*16;case Ed:return Math.floor((n+11)/12)*Math.floor((e+9)/10)*16;case Rd:return Math.floor((n+11)/12)*Math.floor((e+11)/12)*16;case Cd:case Pd:case Id:return Math.ceil(n/4)*Math.ceil(e/4)*16;case Nd:case Dd:return Math.ceil(n/4)*Math.ceil(e/4)*8;case Ld:case Ud:return Math.ceil(n/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function jb(n){switch(n){case is:case dm:return{byteLength:1,components:1};case Ka:case fm:case zn:return{byteLength:2,components:1};case id:case sd:return{byteLength:2,components:4};case Br:case nd:case bi:return{byteLength:4,components:1};case pm:case mm:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${n}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:"180"}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__="180");function yy(){let n=null,e=!1,t=null,i=null;function s(r,o){t(r,o),i=n.requestAnimationFrame(s)}return{start:function(){e!==!0&&t!==null&&(i=n.requestAnimationFrame(s),e=!0)},stop:function(){n.cancelAnimationFrame(i),e=!1},setAnimationLoop:function(r){t=r},setContext:function(r){n=r}}}function n1(n){let e=new WeakMap;function t(a,c){let h=a.array,l=a.usage,d=h.byteLength,u=n.createBuffer();n.bindBuffer(c,u),n.bufferData(c,h,l),a.onUploadCallback();let f;if(h instanceof Float32Array)f=n.FLOAT;else if(typeof Float16Array<"u"&&h instanceof Float16Array)f=n.HALF_FLOAT;else if(h instanceof Uint16Array)a.isFloat16BufferAttribute?f=n.HALF_FLOAT:f=n.UNSIGNED_SHORT;else if(h instanceof Int16Array)f=n.SHORT;else if(h instanceof Uint32Array)f=n.UNSIGNED_INT;else if(h instanceof Int32Array)f=n.INT;else if(h instanceof Int8Array)f=n.BYTE;else if(h instanceof Uint8Array)f=n.UNSIGNED_BYTE;else if(h instanceof Uint8ClampedArray)f=n.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+h);return{buffer:u,type:f,bytesPerElement:h.BYTES_PER_ELEMENT,version:a.version,size:d}}function i(a,c,h){let l=c.array,d=c.updateRanges;if(n.bindBuffer(h,a),d.length===0)n.bufferSubData(h,0,l);else{d.sort((f,x)=>f.start-x.start);let u=0;for(let f=1;f<d.length;f++){let x=d[u],y=d[f];y.start<=x.start+x.count+1?x.count=Math.max(x.count,y.start+y.count-x.start):(++u,d[u]=y)}d.length=u+1;for(let f=0,x=d.length;f<x;f++){let y=d[f];n.bufferSubData(h,y.start*l.BYTES_PER_ELEMENT,l,y.start,y.count)}c.clearUpdateRanges()}c.onUploadCallback()}function s(a){return a.isInterleavedBufferAttribute&&(a=a.data),e.get(a)}function r(a){a.isInterleavedBufferAttribute&&(a=a.data);let c=e.get(a);c&&(n.deleteBuffer(c.buffer),e.delete(a))}function o(a,c){if(a.isInterleavedBufferAttribute&&(a=a.data),a.isGLBufferAttribute){let l=e.get(a);(!l||l.version<a.version)&&e.set(a,{buffer:a.buffer,type:a.type,bytesPerElement:a.elementSize,version:a.version});return}let h=e.get(a);if(h===void 0)e.set(a,t(a,c));else if(h.version<a.version){if(h.size!==a.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");i(h.buffer,a,c),h.version=a.version}}return{get:s,remove:r,update:o}}var i1=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,s1=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,r1=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,o1=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,a1=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,l1=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,c1=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,h1=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,u1=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec3 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 ).rgb;
	}
#endif`,d1=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,f1=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,p1=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,m1=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,g1=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,x1=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,y1=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,_1=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,v1=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,b1=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,M1=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,S1=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,w1=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,A1=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif
#ifdef USE_BATCHING_COLOR
	vec3 batchingColor = getBatchingColor( getIndirectIndex( gl_DrawID ) );
	vColor.xyz *= batchingColor.xyz;
#endif`,T1=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
mat3 transposeMat3( const in mat3 m ) {
	mat3 tmp;
	tmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );
	tmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );
	tmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );
	return tmp;
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,E1=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,R1=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,C1=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,P1=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,I1=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,N1=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,D1="gl_FragColor = linearToOutputTexel( gl_FragColor );",L1=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,U1=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
	#else
		vec4 envColor = vec4( 0.0 );
	#endif
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif`,F1=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,O1=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,B1=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,k1=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,z1=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,H1=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,V1=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,G1=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,W1=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,X1=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,q1=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,$1=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,Y1=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`,Z1=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, roughness * roughness) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,K1=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,j1=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,J1=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,Q1=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,eM=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = mix( min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = mix( vec3( 0.04 ), diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.07, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,tM=`struct PhysicalMaterial {
	vec3 diffuseColor;
	float roughness;
	vec3 specularColor;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		float v = 0.5 / ( gv + gl );
		return saturate(v);
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColor;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transposeMat3( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float a = roughness < 0.25 ? -339.2 * r2 + 161.4 * roughness - 25.9 : -8.48 * r2 + 14.3 * roughness - 9.95;
	float b = roughness < 0.25 ? 44.0 * r2 - 23.7 * roughness + 3.26 : 1.97 * r2 - 3.27 * roughness + 0.72;
	float DG = exp( a * dotNV + b ) + ( roughness < 0.25 ? 0.0 : 0.1 * ( roughness - 0.25 ) );
	return saturate( DG * RECIPROCAL_PI );
}
vec2 DFGApprox( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );
	const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );
	vec4 r = roughness * c0 + c1;
	float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;
	vec2 fab = vec2( - 1.04, 1.04 ) * a004 + r.zw;
	return fab;
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColor * t2.x + ( vec3( 1.0 ) - material.specularColor ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseColor * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
	#endif
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnel, material.roughness, singleScattering, multiScattering );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScattering, multiScattering );
	#endif
	vec3 totalScattering = singleScattering + multiScattering;
	vec3 diffuse = material.diffuseColor * ( 1.0 - max( max( totalScattering.r, totalScattering.g ), totalScattering.b ) );
	reflectedLight.indirectSpecular += radiance * singleScattering;
	reflectedLight.indirectSpecular += multiScattering * cosineWeightedIrradiance;
	reflectedLight.indirectDiffuse += diffuse * cosineWeightedIrradiance;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,nM=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnel = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,iM=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
		iblIrradiance += getIBLIrradiance( geometryNormal );
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,sM=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,rM=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,oM=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,aM=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,lM=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,cM=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,hM=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,uM=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,dM=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,fM=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,pM=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,mM=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,gM=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,xM=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,yM=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,_M=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,vM=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,bM=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,MM=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,SM=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,wM=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,AM=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,TM=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,EM=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,RM=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,CM=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,PM=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,IM=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return depth * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * depth - far );
}`,NM=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,DM=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,LM=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,UM=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,FM=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,OM=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,BM=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform sampler2D pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {
		float depth = unpackRGBAToDepth( texture2D( depths, uv ) );
		#ifdef USE_REVERSED_DEPTH_BUFFER
			return step( depth, compare );
		#else
			return step( compare, depth );
		#endif
	}
	vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {
		return unpackRGBATo2Half( texture2D( shadow, uv ) );
	}
	float VSMShadow( sampler2D shadow, vec2 uv, float compare ) {
		float occlusion = 1.0;
		vec2 distribution = texture2DDistribution( shadow, uv );
		#ifdef USE_REVERSED_DEPTH_BUFFER
			float hard_shadow = step( distribution.x, compare );
		#else
			float hard_shadow = step( compare, distribution.x );
		#endif
		if ( hard_shadow != 1.0 ) {
			float distance = compare - distribution.x;
			float variance = max( 0.00000, distribution.y * distribution.y );
			float softness_probability = variance / (variance + distance * distance );			softness_probability = clamp( ( softness_probability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 );			occlusion = clamp( max( hard_shadow, softness_probability ), 0.0, 1.0 );
		}
		return occlusion;
	}
	float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
		float shadow = 1.0;
		shadowCoord.xyz /= shadowCoord.w;
		shadowCoord.z += shadowBias;
		bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
		bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
		if ( frustumTest ) {
		#if defined( SHADOWMAP_TYPE_PCF )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx0 = - texelSize.x * shadowRadius;
			float dy0 = - texelSize.y * shadowRadius;
			float dx1 = + texelSize.x * shadowRadius;
			float dy1 = + texelSize.y * shadowRadius;
			float dx2 = dx0 / 2.0;
			float dy2 = dy0 / 2.0;
			float dx3 = dx1 / 2.0;
			float dy3 = dy1 / 2.0;
			shadow = (
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )
			) * ( 1.0 / 17.0 );
		#elif defined( SHADOWMAP_TYPE_PCF_SOFT )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx = texelSize.x;
			float dy = texelSize.y;
			vec2 uv = shadowCoord.xy;
			vec2 f = fract( uv * shadowMapSize + 0.5 );
			uv -= f * texelSize;
			shadow = (
				texture2DCompare( shadowMap, uv, shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( dx, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( 0.0, dy ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + texelSize, shadowCoord.z ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, 0.0 ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 0.0 ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, dy ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( 0.0, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 0.0, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( texture2DCompare( shadowMap, uv + vec2( dx, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( dx, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( mix( texture2DCompare( shadowMap, uv + vec2( -dx, -dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, -dy ), shadowCoord.z ),
						  f.x ),
					 mix( texture2DCompare( shadowMap, uv + vec2( -dx, 2.0 * dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 2.0 * dy ), shadowCoord.z ),
						  f.x ),
					 f.y )
			) * ( 1.0 / 9.0 );
		#elif defined( SHADOWMAP_TYPE_VSM )
			shadow = VSMShadow( shadowMap, shadowCoord.xy, shadowCoord.z );
		#else
			shadow = texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );
		#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	vec2 cubeToUV( vec3 v, float texelSizeY ) {
		vec3 absV = abs( v );
		float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );
		absV *= scaleToCube;
		v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );
		vec2 planar = v.xy;
		float almostATexel = 1.5 * texelSizeY;
		float almostOne = 1.0 - almostATexel;
		if ( absV.z >= almostOne ) {
			if ( v.z > 0.0 )
				planar.x = 4.0 - v.x;
		} else if ( absV.x >= almostOne ) {
			float signX = sign( v.x );
			planar.x = v.z * signX + 2.0 * signX;
		} else if ( absV.y >= almostOne ) {
			float signY = sign( v.y );
			planar.x = v.x + 2.0 * signY + 2.0;
			planar.y = v.z * signY - 2.0;
		}
		return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );
	}
	float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		
		float lightToPositionLength = length( lightToPosition );
		if ( lightToPositionLength - shadowCameraFar <= 0.0 && lightToPositionLength - shadowCameraNear >= 0.0 ) {
			float dp = ( lightToPositionLength - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear );			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );
			#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT ) || defined( SHADOWMAP_TYPE_VSM )
				vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;
				shadow = (
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )
				) * ( 1.0 / 9.0 );
			#else
				shadow = texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );
			#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
#endif`,kM=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,zM=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,HM=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,VM=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,GM=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,WM=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,XM=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,qM=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,$M=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,YM=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,ZM=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,KM=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,jM=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,JM=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,QM=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,eS=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,tS=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,nS=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,iS=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,sS=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,rS=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,oS=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,aS=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,lS=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,cS=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,hS=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,uS=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = packDepthToRGBA( dist );
}`,dS=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,fS=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,pS=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,mS=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,gS=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,xS=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,yS=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,_S=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,vS=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,bS=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,MS=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,SS=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <packing>
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( packNormalToRGB( normal ), diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,wS=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,AS=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,TS=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,ES=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
		float sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );
		outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecularDirect + sheenSpecularIndirect;
	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,RS=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,CS=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,PS=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,IS=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,NS=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,DS=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <packing>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,LS=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,US=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,st={alphahash_fragment:i1,alphahash_pars_fragment:s1,alphamap_fragment:r1,alphamap_pars_fragment:o1,alphatest_fragment:a1,alphatest_pars_fragment:l1,aomap_fragment:c1,aomap_pars_fragment:h1,batching_pars_vertex:u1,batching_vertex:d1,begin_vertex:f1,beginnormal_vertex:p1,bsdfs:m1,iridescence_fragment:g1,bumpmap_pars_fragment:x1,clipping_planes_fragment:y1,clipping_planes_pars_fragment:_1,clipping_planes_pars_vertex:v1,clipping_planes_vertex:b1,color_fragment:M1,color_pars_fragment:S1,color_pars_vertex:w1,color_vertex:A1,common:T1,cube_uv_reflection_fragment:E1,defaultnormal_vertex:R1,displacementmap_pars_vertex:C1,displacementmap_vertex:P1,emissivemap_fragment:I1,emissivemap_pars_fragment:N1,colorspace_fragment:D1,colorspace_pars_fragment:L1,envmap_fragment:U1,envmap_common_pars_fragment:F1,envmap_pars_fragment:O1,envmap_pars_vertex:B1,envmap_physical_pars_fragment:Z1,envmap_vertex:k1,fog_vertex:z1,fog_pars_vertex:H1,fog_fragment:V1,fog_pars_fragment:G1,gradientmap_pars_fragment:W1,lightmap_pars_fragment:X1,lights_lambert_fragment:q1,lights_lambert_pars_fragment:$1,lights_pars_begin:Y1,lights_toon_fragment:K1,lights_toon_pars_fragment:j1,lights_phong_fragment:J1,lights_phong_pars_fragment:Q1,lights_physical_fragment:eM,lights_physical_pars_fragment:tM,lights_fragment_begin:nM,lights_fragment_maps:iM,lights_fragment_end:sM,logdepthbuf_fragment:rM,logdepthbuf_pars_fragment:oM,logdepthbuf_pars_vertex:aM,logdepthbuf_vertex:lM,map_fragment:cM,map_pars_fragment:hM,map_particle_fragment:uM,map_particle_pars_fragment:dM,metalnessmap_fragment:fM,metalnessmap_pars_fragment:pM,morphinstance_vertex:mM,morphcolor_vertex:gM,morphnormal_vertex:xM,morphtarget_pars_vertex:yM,morphtarget_vertex:_M,normal_fragment_begin:vM,normal_fragment_maps:bM,normal_pars_fragment:MM,normal_pars_vertex:SM,normal_vertex:wM,normalmap_pars_fragment:AM,clearcoat_normal_fragment_begin:TM,clearcoat_normal_fragment_maps:EM,clearcoat_pars_fragment:RM,iridescence_pars_fragment:CM,opaque_fragment:PM,packing:IM,premultiplied_alpha_fragment:NM,project_vertex:DM,dithering_fragment:LM,dithering_pars_fragment:UM,roughnessmap_fragment:FM,roughnessmap_pars_fragment:OM,shadowmap_pars_fragment:BM,shadowmap_pars_vertex:kM,shadowmap_vertex:zM,shadowmask_pars_fragment:HM,skinbase_vertex:VM,skinning_pars_vertex:GM,skinning_vertex:WM,skinnormal_vertex:XM,specularmap_fragment:qM,specularmap_pars_fragment:$M,tonemapping_fragment:YM,tonemapping_pars_fragment:ZM,transmission_fragment:KM,transmission_pars_fragment:jM,uv_pars_fragment:JM,uv_pars_vertex:QM,uv_vertex:eS,worldpos_vertex:tS,background_vert:nS,background_frag:iS,backgroundCube_vert:sS,backgroundCube_frag:rS,cube_vert:oS,cube_frag:aS,depth_vert:lS,depth_frag:cS,distanceRGBA_vert:hS,distanceRGBA_frag:uS,equirect_vert:dS,equirect_frag:fS,linedashed_vert:pS,linedashed_frag:mS,meshbasic_vert:gS,meshbasic_frag:xS,meshlambert_vert:yS,meshlambert_frag:_S,meshmatcap_vert:vS,meshmatcap_frag:bS,meshnormal_vert:MS,meshnormal_frag:SS,meshphong_vert:wS,meshphong_frag:AS,meshphysical_vert:TS,meshphysical_frag:ES,meshtoon_vert:RS,meshtoon_frag:CS,points_vert:PS,points_frag:IS,shadow_vert:NS,shadow_frag:DS,sprite_vert:LS,sprite_frag:US},_e={common:{diffuse:{value:new Ee(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Qe},alphaMap:{value:null},alphaMapTransform:{value:new Qe},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Qe}},envmap:{envMap:{value:null},envMapRotation:{value:new Qe},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Qe}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Qe}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Qe},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Qe},normalScale:{value:new ae(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Qe},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Qe}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Qe}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Qe}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Ee(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Ee(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Qe},alphaTest:{value:0},uvTransform:{value:new Qe}},sprite:{diffuse:{value:new Ee(16777215)},opacity:{value:1},center:{value:new ae(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Qe},alphaMap:{value:null},alphaMapTransform:{value:new Qe},alphaTest:{value:0}}},Rs={basic:{uniforms:Yn([_e.common,_e.specularmap,_e.envmap,_e.aomap,_e.lightmap,_e.fog]),vertexShader:st.meshbasic_vert,fragmentShader:st.meshbasic_frag},lambert:{uniforms:Yn([_e.common,_e.specularmap,_e.envmap,_e.aomap,_e.lightmap,_e.emissivemap,_e.bumpmap,_e.normalmap,_e.displacementmap,_e.fog,_e.lights,{emissive:{value:new Ee(0)}}]),vertexShader:st.meshlambert_vert,fragmentShader:st.meshlambert_frag},phong:{uniforms:Yn([_e.common,_e.specularmap,_e.envmap,_e.aomap,_e.lightmap,_e.emissivemap,_e.bumpmap,_e.normalmap,_e.displacementmap,_e.fog,_e.lights,{emissive:{value:new Ee(0)},specular:{value:new Ee(1118481)},shininess:{value:30}}]),vertexShader:st.meshphong_vert,fragmentShader:st.meshphong_frag},standard:{uniforms:Yn([_e.common,_e.envmap,_e.aomap,_e.lightmap,_e.emissivemap,_e.bumpmap,_e.normalmap,_e.displacementmap,_e.roughnessmap,_e.metalnessmap,_e.fog,_e.lights,{emissive:{value:new Ee(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:st.meshphysical_vert,fragmentShader:st.meshphysical_frag},toon:{uniforms:Yn([_e.common,_e.aomap,_e.lightmap,_e.emissivemap,_e.bumpmap,_e.normalmap,_e.displacementmap,_e.gradientmap,_e.fog,_e.lights,{emissive:{value:new Ee(0)}}]),vertexShader:st.meshtoon_vert,fragmentShader:st.meshtoon_frag},matcap:{uniforms:Yn([_e.common,_e.bumpmap,_e.normalmap,_e.displacementmap,_e.fog,{matcap:{value:null}}]),vertexShader:st.meshmatcap_vert,fragmentShader:st.meshmatcap_frag},points:{uniforms:Yn([_e.points,_e.fog]),vertexShader:st.points_vert,fragmentShader:st.points_frag},dashed:{uniforms:Yn([_e.common,_e.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:st.linedashed_vert,fragmentShader:st.linedashed_frag},depth:{uniforms:Yn([_e.common,_e.displacementmap]),vertexShader:st.depth_vert,fragmentShader:st.depth_frag},normal:{uniforms:Yn([_e.common,_e.bumpmap,_e.normalmap,_e.displacementmap,{opacity:{value:1}}]),vertexShader:st.meshnormal_vert,fragmentShader:st.meshnormal_frag},sprite:{uniforms:Yn([_e.sprite,_e.fog]),vertexShader:st.sprite_vert,fragmentShader:st.sprite_frag},background:{uniforms:{uvTransform:{value:new Qe},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:st.background_vert,fragmentShader:st.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Qe}},vertexShader:st.backgroundCube_vert,fragmentShader:st.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:st.cube_vert,fragmentShader:st.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:st.equirect_vert,fragmentShader:st.equirect_frag},distanceRGBA:{uniforms:Yn([_e.common,_e.displacementmap,{referencePosition:{value:new L},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:st.distanceRGBA_vert,fragmentShader:st.distanceRGBA_frag},shadow:{uniforms:Yn([_e.lights,_e.fog,{color:{value:new Ee(0)},opacity:{value:1}}]),vertexShader:st.shadow_vert,fragmentShader:st.shadow_frag}};Rs.physical={uniforms:Yn([Rs.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Qe},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Qe},clearcoatNormalScale:{value:new ae(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Qe},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Qe},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Qe},sheen:{value:0},sheenColor:{value:new Ee(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Qe},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Qe},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Qe},transmissionSamplerSize:{value:new ae},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Qe},attenuationDistance:{value:0},attenuationColor:{value:new Ee(0)},specularColor:{value:new Ee(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Qe},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Qe},anisotropyVector:{value:new ae},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Qe}}]),vertexShader:st.meshphysical_vert,fragmentShader:st.meshphysical_frag};var Od={r:0,b:0,g:0},Ro=new hi,FS=new ut;function OS(n,e,t,i,s,r,o){let a=new Ee(0),c=r===!0?0:1,h,l,d=null,u=0,f=null;function x(v){let g=v.isScene===!0?v.background:null;return g&&g.isTexture&&(g=(v.backgroundBlurriness>0?t:e).get(g)),g}function y(v){let g=!1,_=x(v);_===null?p(a,c):_&&_.isColor&&(p(_,1),g=!0);let S=n.xr.getEnvironmentBlendMode();S==="additive"?i.buffers.color.setClear(0,0,0,1,o):S==="alpha-blend"&&i.buffers.color.setClear(0,0,0,0,o),(n.autoClear||g)&&(i.buffers.depth.setTest(!0),i.buffers.depth.setMask(!0),i.buffers.color.setMask(!0),n.clear(n.autoClearColor,n.autoClearDepth,n.autoClearStencil))}function m(v,g){let _=x(g);_&&(_.isCubeTexture||_.mapping===Lc)?(l===void 0&&(l=new nt(new Ir(1,1,1),new Pt({name:"BackgroundCubeMaterial",uniforms:Eo(Rs.backgroundCube.uniforms),vertexShader:Rs.backgroundCube.vertexShader,fragmentShader:Rs.backgroundCube.fragmentShader,side:bn,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute("normal"),l.geometry.deleteAttribute("uv"),l.onBeforeRender=function(S,R,P){this.matrixWorld.copyPosition(P.matrixWorld)},Object.defineProperty(l.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),s.update(l)),Ro.copy(g.backgroundRotation),Ro.x*=-1,Ro.y*=-1,Ro.z*=-1,_.isCubeTexture&&_.isRenderTargetTexture===!1&&(Ro.y*=-1,Ro.z*=-1),l.material.uniforms.envMap.value=_,l.material.uniforms.flipEnvMap.value=_.isCubeTexture&&_.isRenderTargetTexture===!1?-1:1,l.material.uniforms.backgroundBlurriness.value=g.backgroundBlurriness,l.material.uniforms.backgroundIntensity.value=g.backgroundIntensity,l.material.uniforms.backgroundRotation.value.setFromMatrix4(FS.makeRotationFromEuler(Ro)),l.material.toneMapped=lt.getTransfer(_.colorSpace)!==vt,(d!==_||u!==_.version||f!==n.toneMapping)&&(l.material.needsUpdate=!0,d=_,u=_.version,f=n.toneMapping),l.layers.enableAll(),v.unshift(l,l.geometry,l.material,0,0,null)):_&&_.isTexture&&(h===void 0&&(h=new nt(new vc(2,2),new Pt({name:"BackgroundMaterial",uniforms:Eo(Rs.background.uniforms),vertexShader:Rs.background.vertexShader,fragmentShader:Rs.background.fragmentShader,side:ji,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),h.geometry.deleteAttribute("normal"),Object.defineProperty(h.material,"map",{get:function(){return this.uniforms.t2D.value}}),s.update(h)),h.material.uniforms.t2D.value=_,h.material.uniforms.backgroundIntensity.value=g.backgroundIntensity,h.material.toneMapped=lt.getTransfer(_.colorSpace)!==vt,_.matrixAutoUpdate===!0&&_.updateMatrix(),h.material.uniforms.uvTransform.value.copy(_.matrix),(d!==_||u!==_.version||f!==n.toneMapping)&&(h.material.needsUpdate=!0,d=_,u=_.version,f=n.toneMapping),h.layers.enableAll(),v.unshift(h,h.geometry,h.material,0,0,null))}function p(v,g){v.getRGB(Od,Sm(n)),i.buffers.color.setClear(Od.r,Od.g,Od.b,g,o)}function w(){l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0),h!==void 0&&(h.geometry.dispose(),h.material.dispose(),h=void 0)}return{getClearColor:function(){return a},setClearColor:function(v,g=1){a.set(v),c=g,p(a,c)},getClearAlpha:function(){return c},setClearAlpha:function(v){c=v,p(a,c)},render:y,addToRenderList:m,dispose:w}}function BS(n,e){let t=n.getParameter(n.MAX_VERTEX_ATTRIBS),i={},s=u(null),r=s,o=!1;function a(M,C,U,V,H){let k=!1,z=d(V,U,C);r!==z&&(r=z,h(r.object)),k=f(M,V,U,H),k&&x(M,V,U,H),H!==null&&e.update(H,n.ELEMENT_ARRAY_BUFFER),(k||o)&&(o=!1,g(M,C,U,V),H!==null&&n.bindBuffer(n.ELEMENT_ARRAY_BUFFER,e.get(H).buffer))}function c(){return n.createVertexArray()}function h(M){return n.bindVertexArray(M)}function l(M){return n.deleteVertexArray(M)}function d(M,C,U){let V=U.wireframe===!0,H=i[M.id];H===void 0&&(H={},i[M.id]=H);let k=H[C.id];k===void 0&&(k={},H[C.id]=k);let z=k[V];return z===void 0&&(z=u(c()),k[V]=z),z}function u(M){let C=[],U=[],V=[];for(let H=0;H<t;H++)C[H]=0,U[H]=0,V[H]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:C,enabledAttributes:U,attributeDivisors:V,object:M,attributes:{},index:null}}function f(M,C,U,V){let H=r.attributes,k=C.attributes,z=0,ie=U.getAttributes();for(let $ in ie)if(ie[$].location>=0){let F=H[$],O=k[$];if(O===void 0&&($==="instanceMatrix"&&M.instanceMatrix&&(O=M.instanceMatrix),$==="instanceColor"&&M.instanceColor&&(O=M.instanceColor)),F===void 0||F.attribute!==O||O&&F.data!==O.data)return!0;z++}return r.attributesNum!==z||r.index!==V}function x(M,C,U,V){let H={},k=C.attributes,z=0,ie=U.getAttributes();for(let $ in ie)if(ie[$].location>=0){let F=k[$];F===void 0&&($==="instanceMatrix"&&M.instanceMatrix&&(F=M.instanceMatrix),$==="instanceColor"&&M.instanceColor&&(F=M.instanceColor));let O={};O.attribute=F,F&&F.data&&(O.data=F.data),H[$]=O,z++}r.attributes=H,r.attributesNum=z,r.index=V}function y(){let M=r.newAttributes;for(let C=0,U=M.length;C<U;C++)M[C]=0}function m(M){p(M,0)}function p(M,C){let U=r.newAttributes,V=r.enabledAttributes,H=r.attributeDivisors;U[M]=1,V[M]===0&&(n.enableVertexAttribArray(M),V[M]=1),H[M]!==C&&(n.vertexAttribDivisor(M,C),H[M]=C)}function w(){let M=r.newAttributes,C=r.enabledAttributes;for(let U=0,V=C.length;U<V;U++)C[U]!==M[U]&&(n.disableVertexAttribArray(U),C[U]=0)}function v(M,C,U,V,H,k,z){z===!0?n.vertexAttribIPointer(M,C,U,H,k):n.vertexAttribPointer(M,C,U,V,H,k)}function g(M,C,U,V){y();let H=V.attributes,k=U.getAttributes(),z=C.defaultAttributeValues;for(let ie in k){let $=k[ie];if($.location>=0){let te=H[ie];if(te===void 0&&(ie==="instanceMatrix"&&M.instanceMatrix&&(te=M.instanceMatrix),ie==="instanceColor"&&M.instanceColor&&(te=M.instanceColor)),te!==void 0){let F=te.normalized,O=te.itemSize,J=e.get(te);if(J===void 0)continue;let q=J.buffer,le=J.type,Se=J.bytesPerElement,Y=le===n.INT||le===n.UNSIGNED_INT||te.gpuType===nd;if(te.isInterleavedBufferAttribute){let j=te.data,he=j.stride,De=te.offset;if(j.isInstancedInterleavedBuffer){for(let ve=0;ve<$.locationSize;ve++)p($.location+ve,j.meshPerAttribute);M.isInstancedMesh!==!0&&V._maxInstanceCount===void 0&&(V._maxInstanceCount=j.meshPerAttribute*j.count)}else for(let ve=0;ve<$.locationSize;ve++)m($.location+ve);n.bindBuffer(n.ARRAY_BUFFER,q);for(let ve=0;ve<$.locationSize;ve++)v($.location+ve,O/$.locationSize,le,F,he*Se,(De+O/$.locationSize*ve)*Se,Y)}else{if(te.isInstancedBufferAttribute){for(let j=0;j<$.locationSize;j++)p($.location+j,te.meshPerAttribute);M.isInstancedMesh!==!0&&V._maxInstanceCount===void 0&&(V._maxInstanceCount=te.meshPerAttribute*te.count)}else for(let j=0;j<$.locationSize;j++)m($.location+j);n.bindBuffer(n.ARRAY_BUFFER,q);for(let j=0;j<$.locationSize;j++)v($.location+j,O/$.locationSize,le,F,O*Se,O/$.locationSize*j*Se,Y)}}else if(z!==void 0){let F=z[ie];if(F!==void 0)switch(F.length){case 2:n.vertexAttrib2fv($.location,F);break;case 3:n.vertexAttrib3fv($.location,F);break;case 4:n.vertexAttrib4fv($.location,F);break;default:n.vertexAttrib1fv($.location,F)}}}}w()}function _(){P();for(let M in i){let C=i[M];for(let U in C){let V=C[U];for(let H in V)l(V[H].object),delete V[H];delete C[U]}delete i[M]}}function S(M){if(i[M.id]===void 0)return;let C=i[M.id];for(let U in C){let V=C[U];for(let H in V)l(V[H].object),delete V[H];delete C[U]}delete i[M.id]}function R(M){for(let C in i){let U=i[C];if(U[M.id]===void 0)continue;let V=U[M.id];for(let H in V)l(V[H].object),delete V[H];delete U[M.id]}}function P(){b(),o=!0,r!==s&&(r=s,h(r.object))}function b(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:a,reset:P,resetDefaultState:b,dispose:_,releaseStatesOfGeometry:S,releaseStatesOfProgram:R,initAttributes:y,enableAttribute:m,disableUnusedAttributes:w}}function kS(n,e,t){let i;function s(h){i=h}function r(h,l){n.drawArrays(i,h,l),t.update(l,i,1)}function o(h,l,d){d!==0&&(n.drawArraysInstanced(i,h,l,d),t.update(l,i,d))}function a(h,l,d){if(d===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(i,h,0,l,0,d);let f=0;for(let x=0;x<d;x++)f+=l[x];t.update(f,i,1)}function c(h,l,d,u){if(d===0)return;let f=e.get("WEBGL_multi_draw");if(f===null)for(let x=0;x<h.length;x++)o(h[x],l[x],u[x]);else{f.multiDrawArraysInstancedWEBGL(i,h,0,l,0,u,0,d);let x=0;for(let y=0;y<d;y++)x+=l[y]*u[y];t.update(x,i,1)}}this.setMode=s,this.render=r,this.renderInstances=o,this.renderMultiDraw=a,this.renderMultiDrawInstances=c}function zS(n,e,t,i){let s;function r(){if(s!==void 0)return s;if(e.has("EXT_texture_filter_anisotropic")===!0){let R=e.get("EXT_texture_filter_anisotropic");s=n.getParameter(R.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function o(R){return!(R!==Li&&i.convert(R)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_FORMAT))}function a(R){let P=R===zn&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(R!==is&&i.convert(R)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_TYPE)&&R!==bi&&!P)}function c(R){if(R==="highp"){if(n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.HIGH_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.HIGH_FLOAT).precision>0)return"highp";R="mediump"}return R==="mediump"&&n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.MEDIUM_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let h=t.precision!==void 0?t.precision:"highp",l=c(h);l!==h&&(console.warn("THREE.WebGLRenderer:",h,"not supported, using",l,"instead."),h=l);let d=t.logarithmicDepthBuffer===!0,u=t.reversedDepthBuffer===!0&&e.has("EXT_clip_control"),f=n.getParameter(n.MAX_TEXTURE_IMAGE_UNITS),x=n.getParameter(n.MAX_VERTEX_TEXTURE_IMAGE_UNITS),y=n.getParameter(n.MAX_TEXTURE_SIZE),m=n.getParameter(n.MAX_CUBE_MAP_TEXTURE_SIZE),p=n.getParameter(n.MAX_VERTEX_ATTRIBS),w=n.getParameter(n.MAX_VERTEX_UNIFORM_VECTORS),v=n.getParameter(n.MAX_VARYING_VECTORS),g=n.getParameter(n.MAX_FRAGMENT_UNIFORM_VECTORS),_=x>0,S=n.getParameter(n.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:c,textureFormatReadable:o,textureTypeReadable:a,precision:h,logarithmicDepthBuffer:d,reversedDepthBuffer:u,maxTextures:f,maxVertexTextures:x,maxTextureSize:y,maxCubemapSize:m,maxAttributes:p,maxVertexUniforms:w,maxVaryings:v,maxFragmentUniforms:g,vertexTextures:_,maxSamples:S}}function HS(n){let e=this,t=null,i=0,s=!1,r=!1,o=new Jn,a=new Qe,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(d,u){let f=d.length!==0||u||i!==0||s;return s=u,i=d.length,f},this.beginShadows=function(){r=!0,l(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(d,u){t=l(d,u,0)},this.setState=function(d,u,f){let x=d.clippingPlanes,y=d.clipIntersection,m=d.clipShadows,p=n.get(d);if(!s||x===null||x.length===0||r&&!m)r?l(null):h();else{let w=r?0:i,v=w*4,g=p.clippingState||null;c.value=g,g=l(x,u,v,f);for(let _=0;_!==v;++_)g[_]=t[_];p.clippingState=g,this.numIntersection=y?this.numPlanes:0,this.numPlanes+=w}};function h(){c.value!==t&&(c.value=t,c.needsUpdate=i>0),e.numPlanes=i,e.numIntersection=0}function l(d,u,f,x){let y=d!==null?d.length:0,m=null;if(y!==0){if(m=c.value,x!==!0||m===null){let p=f+y*4,w=u.matrixWorldInverse;a.getNormalMatrix(w),(m===null||m.length<p)&&(m=new Float32Array(p));for(let v=0,g=f;v!==y;++v,g+=4)o.copy(d[v]).applyMatrix4(w,a),o.normal.toArray(m,g),m[g+3]=o.constant}c.value=m,c.needsUpdate=!0}return e.numPlanes=y,e.numIntersection=0,m}}function VS(n){let e=new WeakMap;function t(o,a){return a===Qu?o.mapping=Ao:a===ed&&(o.mapping=To),o}function i(o){if(o&&o.isTexture){let a=o.mapping;if(a===Qu||a===ed)if(e.has(o)){let c=e.get(o).texture;return t(c,o.mapping)}else{let c=o.image;if(c&&c.height>0){let h=new mu(c.height);return h.fromEquirectangularTexture(n,o),e.set(o,h),o.addEventListener("dispose",s),t(h.texture,o.mapping)}else return null}}return o}function s(o){let a=o.target;a.removeEventListener("dispose",s);let c=e.get(a);c!==void 0&&(e.delete(a),c.dispose())}function r(){e=new WeakMap}return{get:i,dispose:r}}var Qa=4,Zx=[.125,.215,.35,.446,.526,.582],Io=20,Rm=new wo,Kx=new Ee,Cm=null,Pm=0,Im=0,Nm=!1,Po=(1+Math.sqrt(5))/2,Ja=1/Po,jx=[new L(-Po,Ja,0),new L(Po,Ja,0),new L(-Ja,0,Po),new L(Ja,0,Po),new L(0,Po,-Ja),new L(0,Po,Ja),new L(-1,1,-1),new L(1,1,-1),new L(-1,1,1),new L(1,1,1)],GS=new L,tl=class{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(e,t=0,i=.1,s=100,r={}){let{size:o=256,position:a=GS}=r;Cm=this._renderer.getRenderTarget(),Pm=this._renderer.getActiveCubeFace(),Im=this._renderer.getActiveMipmapLevel(),Nm=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(o);let c=this._allocateTargets();return c.depthBuffer=!0,this._sceneToCubeUV(e,i,s,c,a),t>0&&this._blur(c,0,0,t),this._applyPMREM(c),this._cleanup(c),c}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=ey(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Qx(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodPlanes.length;e++)this._lodPlanes[e].dispose()}_cleanup(e){this._renderer.setRenderTarget(Cm,Pm,Im),this._renderer.xr.enabled=Nm,e.scissorTest=!1,Bd(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===Ao||e.mapping===To?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),Cm=this._renderer.getRenderTarget(),Pm=this._renderer.getActiveCubeFace(),Im=this._renderer.getActiveMipmapLevel(),Nm=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;let i=t||this._allocateTargets();return this._textureToCubeUV(e,i),this._applyPMREM(i),this._cleanup(i),i}_allocateTargets(){let e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,i={magFilter:Qi,minFilter:Qi,generateMipmaps:!1,type:zn,format:Li,colorSpace:yo,depthBuffer:!1},s=Jx(e,t,i);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Jx(e,t,i);let{_lodMax:r}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=WS(r)),this._blurMaterial=XS(r,e,t)}return s}_compileMaterial(e){let t=new nt(this._lodPlanes[0],e);this._renderer.compile(t,Rm)}_sceneToCubeUV(e,t,i,s,r){let c=new Bn(90,1,t,i),h=[1,-1,1,1,1,1],l=[1,1,1,-1,-1,-1],d=this._renderer,u=d.autoClear,f=d.toneMapping;d.getClearColor(Kx),d.toneMapping=Qs,d.autoClear=!1,d.state.buffers.depth.getReversed()&&(d.setRenderTarget(s),d.clearDepth(),d.setRenderTarget(null));let y=new ts({name:"PMREM.Background",side:bn,depthWrite:!1,depthTest:!1}),m=new nt(new Ir,y),p=!1,w=e.background;w?w.isColor&&(y.color.copy(w),e.background=null,p=!0):(y.color.copy(Kx),p=!0);for(let v=0;v<6;v++){let g=v%3;g===0?(c.up.set(0,h[v],0),c.position.set(r.x,r.y,r.z),c.lookAt(r.x+l[v],r.y,r.z)):g===1?(c.up.set(0,0,h[v]),c.position.set(r.x,r.y,r.z),c.lookAt(r.x,r.y+l[v],r.z)):(c.up.set(0,h[v],0),c.position.set(r.x,r.y,r.z),c.lookAt(r.x,r.y,r.z+l[v]));let _=this._cubeSize;Bd(s,g*_,v>2?_:0,_,_),d.setRenderTarget(s),p&&d.render(m,c),d.render(e,c)}m.geometry.dispose(),m.material.dispose(),d.toneMapping=f,d.autoClear=u,e.background=w}_textureToCubeUV(e,t){let i=this._renderer,s=e.mapping===Ao||e.mapping===To;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=ey()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Qx());let r=s?this._cubemapMaterial:this._equirectMaterial,o=new nt(this._lodPlanes[0],r),a=r.uniforms;a.envMap.value=e;let c=this._cubeSize;Bd(t,0,0,3*c,2*c),i.setRenderTarget(t),i.render(o,Rm)}_applyPMREM(e){let t=this._renderer,i=t.autoClear;t.autoClear=!1;let s=this._lodPlanes.length;for(let r=1;r<s;r++){let o=Math.sqrt(this._sigmas[r]*this._sigmas[r]-this._sigmas[r-1]*this._sigmas[r-1]),a=jx[(s-r-1)%jx.length];this._blur(e,r-1,r,o,a)}t.autoClear=i}_blur(e,t,i,s,r){let o=this._pingPongRenderTarget;this._halfBlur(e,o,t,i,s,"latitudinal",r),this._halfBlur(o,e,i,i,s,"longitudinal",r)}_halfBlur(e,t,i,s,r,o,a){let c=this._renderer,h=this._blurMaterial;o!=="latitudinal"&&o!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");let l=3,d=new nt(this._lodPlanes[s],h),u=h.uniforms,f=this._sizeLods[i]-1,x=isFinite(r)?Math.PI/(2*f):2*Math.PI/(2*Io-1),y=r/x,m=isFinite(r)?1+Math.floor(l*y):Io;m>Io&&console.warn(`sigmaRadians, ${r}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${Io}`);let p=[],w=0;for(let R=0;R<Io;++R){let P=R/y,b=Math.exp(-P*P/2);p.push(b),R===0?w+=b:R<m&&(w+=2*b)}for(let R=0;R<p.length;R++)p[R]=p[R]/w;u.envMap.value=e.texture,u.samples.value=m,u.weights.value=p,u.latitudinal.value=o==="latitudinal",a&&(u.poleAxis.value=a);let{_lodMax:v}=this;u.dTheta.value=x,u.mipInt.value=v-i;let g=this._sizeLods[s],_=3*g*(s>v-Qa?s-v+Qa:0),S=4*(this._cubeSize-g);Bd(t,_,S,3*g,2*g),c.setRenderTarget(t),c.render(d,Rm)}};function WS(n){let e=[],t=[],i=[],s=n,r=n-Qa+1+Zx.length;for(let o=0;o<r;o++){let a=Math.pow(2,s);t.push(a);let c=1/a;o>n-Qa?c=Zx[o-n+Qa-1]:o===0&&(c=0),i.push(c);let h=1/(a-2),l=-h,d=1+h,u=[l,l,d,l,d,d,l,l,d,d,l,d],f=6,x=6,y=3,m=2,p=1,w=new Float32Array(y*x*f),v=new Float32Array(m*x*f),g=new Float32Array(p*x*f);for(let S=0;S<f;S++){let R=S%3*2/3-1,P=S>2?0:-1,b=[R,P,0,R+2/3,P,0,R+2/3,P+1,0,R,P,0,R+2/3,P+1,0,R,P+1,0];w.set(b,y*x*S),v.set(u,m*x*S);let M=[S,S,S,S,S,S];g.set(M,p*x*S)}let _=new fn;_.setAttribute("position",new Ht(w,y)),_.setAttribute("uv",new Ht(v,m)),_.setAttribute("faceIndex",new Ht(g,p)),e.push(_),s>Qa&&s--}return{lodPlanes:e,sizeLods:t,sigmas:i}}function Jx(n,e,t){let i=new ln(n,e,t);return i.texture.mapping=Lc,i.texture.name="PMREM.cubeUv",i.scissorTest=!0,i}function Bd(n,e,t,i,s){n.viewport.set(e,t,i,s),n.scissor.set(e,t,i,s)}function XS(n,e,t){let i=new Float32Array(Io),s=new L(0,1,0);return new Pt({name:"SphericalGaussianBlur",defines:{n:Io,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${n}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:i},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:Vm(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:Rn,depthTest:!1,depthWrite:!1})}function Qx(){return new Pt({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Vm(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:Rn,depthTest:!1,depthWrite:!1})}function ey(){return new Pt({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Vm(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Rn,depthTest:!1,depthWrite:!1})}function Vm(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}function qS(n){let e=new WeakMap,t=null;function i(a){if(a&&a.isTexture){let c=a.mapping,h=c===Qu||c===ed,l=c===Ao||c===To;if(h||l){let d=e.get(a),u=d!==void 0?d.texture.pmremVersion:0;if(a.isRenderTargetTexture&&a.pmremVersion!==u)return t===null&&(t=new tl(n)),d=h?t.fromEquirectangular(a,d):t.fromCubemap(a,d),d.texture.pmremVersion=a.pmremVersion,e.set(a,d),d.texture;if(d!==void 0)return d.texture;{let f=a.image;return h&&f&&f.height>0||l&&f&&s(f)?(t===null&&(t=new tl(n)),d=h?t.fromEquirectangular(a):t.fromCubemap(a),d.texture.pmremVersion=a.pmremVersion,e.set(a,d),a.addEventListener("dispose",r),d.texture):null}}}return a}function s(a){let c=0,h=6;for(let l=0;l<h;l++)a[l]!==void 0&&c++;return c===h}function r(a){let c=a.target;c.removeEventListener("dispose",r);let h=e.get(c);h!==void 0&&(e.delete(c),h.dispose())}function o(){e=new WeakMap,t!==null&&(t.dispose(),t=null)}return{get:i,dispose:o}}function $S(n){let e={};function t(i){if(e[i]!==void 0)return e[i];let s;switch(i){case"WEBGL_depth_texture":s=n.getExtension("WEBGL_depth_texture")||n.getExtension("MOZ_WEBGL_depth_texture")||n.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":s=n.getExtension("EXT_texture_filter_anisotropic")||n.getExtension("MOZ_EXT_texture_filter_anisotropic")||n.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":s=n.getExtension("WEBGL_compressed_texture_s3tc")||n.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||n.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":s=n.getExtension("WEBGL_compressed_texture_pvrtc")||n.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:s=n.getExtension(i)}return e[i]=s,s}return{has:function(i){return t(i)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(i){let s=t(i);return s===null&&Oa("THREE.WebGLRenderer: "+i+" extension not supported."),s}}}function YS(n,e,t,i){let s={},r=new WeakMap;function o(d){let u=d.target;u.index!==null&&e.remove(u.index);for(let x in u.attributes)e.remove(u.attributes[x]);u.removeEventListener("dispose",o),delete s[u.id];let f=r.get(u);f&&(e.remove(f),r.delete(u)),i.releaseStatesOfGeometry(u),u.isInstancedBufferGeometry===!0&&delete u._maxInstanceCount,t.memory.geometries--}function a(d,u){return s[u.id]===!0||(u.addEventListener("dispose",o),s[u.id]=!0,t.memory.geometries++),u}function c(d){let u=d.attributes;for(let f in u)e.update(u[f],n.ARRAY_BUFFER)}function h(d){let u=[],f=d.index,x=d.attributes.position,y=0;if(f!==null){let w=f.array;y=f.version;for(let v=0,g=w.length;v<g;v+=3){let _=w[v+0],S=w[v+1],R=w[v+2];u.push(_,S,S,R,R,_)}}else if(x!==void 0){let w=x.array;y=x.version;for(let v=0,g=w.length/3-1;v<g;v+=3){let _=v+0,S=v+1,R=v+2;u.push(_,S,S,R,R,_)}}else return;let m=new(Mm(u)?lc:ac)(u,1);m.version=y;let p=r.get(d);p&&e.remove(p),r.set(d,m)}function l(d){let u=r.get(d);if(u){let f=d.index;f!==null&&u.version<f.version&&h(d)}else h(d);return r.get(d)}return{get:a,update:c,getWireframeAttribute:l}}function ZS(n,e,t){let i;function s(u){i=u}let r,o;function a(u){r=u.type,o=u.bytesPerElement}function c(u,f){n.drawElements(i,f,r,u*o),t.update(f,i,1)}function h(u,f,x){x!==0&&(n.drawElementsInstanced(i,f,r,u*o,x),t.update(f,i,x))}function l(u,f,x){if(x===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(i,f,0,r,u,0,x);let m=0;for(let p=0;p<x;p++)m+=f[p];t.update(m,i,1)}function d(u,f,x,y){if(x===0)return;let m=e.get("WEBGL_multi_draw");if(m===null)for(let p=0;p<u.length;p++)h(u[p]/o,f[p],y[p]);else{m.multiDrawElementsInstancedWEBGL(i,f,0,r,u,0,y,0,x);let p=0;for(let w=0;w<x;w++)p+=f[w]*y[w];t.update(p,i,1)}}this.setMode=s,this.setIndex=a,this.render=c,this.renderInstances=h,this.renderMultiDraw=l,this.renderMultiDrawInstances=d}function KS(n){let e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function i(r,o,a){switch(t.calls++,o){case n.TRIANGLES:t.triangles+=a*(r/3);break;case n.LINES:t.lines+=a*(r/2);break;case n.LINE_STRIP:t.lines+=a*(r-1);break;case n.LINE_LOOP:t.lines+=a*r;break;case n.POINTS:t.points+=a*r;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",o);break}}function s(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:s,update:i}}function jS(n,e,t){let i=new WeakMap,s=new wt;function r(o,a,c){let h=o.morphTargetInfluences,l=a.morphAttributes.position||a.morphAttributes.normal||a.morphAttributes.color,d=l!==void 0?l.length:0,u=i.get(a);if(u===void 0||u.count!==d){let b=function(){R.dispose(),i.delete(a),a.removeEventListener("dispose",b)};u!==void 0&&u.texture.dispose();let f=a.morphAttributes.position!==void 0,x=a.morphAttributes.normal!==void 0,y=a.morphAttributes.color!==void 0,m=a.morphAttributes.position||[],p=a.morphAttributes.normal||[],w=a.morphAttributes.color||[],v=0;f===!0&&(v=1),x===!0&&(v=2),y===!0&&(v=3);let g=a.attributes.position.count*v,_=1;g>e.maxTextureSize&&(_=Math.ceil(g/e.maxTextureSize),g=e.maxTextureSize);let S=new Float32Array(g*_*4*d),R=new oc(S,g,_,d);R.type=bi,R.needsUpdate=!0;let P=v*4;for(let M=0;M<d;M++){let C=m[M],U=p[M],V=w[M],H=g*_*4*M;for(let k=0;k<C.count;k++){let z=k*P;f===!0&&(s.fromBufferAttribute(C,k),S[H+z+0]=s.x,S[H+z+1]=s.y,S[H+z+2]=s.z,S[H+z+3]=0),x===!0&&(s.fromBufferAttribute(U,k),S[H+z+4]=s.x,S[H+z+5]=s.y,S[H+z+6]=s.z,S[H+z+7]=0),y===!0&&(s.fromBufferAttribute(V,k),S[H+z+8]=s.x,S[H+z+9]=s.y,S[H+z+10]=s.z,S[H+z+11]=V.itemSize===4?s.w:1)}}u={count:d,texture:R,size:new ae(g,_)},i.set(a,u),a.addEventListener("dispose",b)}if(o.isInstancedMesh===!0&&o.morphTexture!==null)c.getUniforms().setValue(n,"morphTexture",o.morphTexture,t);else{let f=0;for(let y=0;y<h.length;y++)f+=h[y];let x=a.morphTargetsRelative?1:1-f;c.getUniforms().setValue(n,"morphTargetBaseInfluence",x),c.getUniforms().setValue(n,"morphTargetInfluences",h)}c.getUniforms().setValue(n,"morphTargetsTexture",u.texture,t),c.getUniforms().setValue(n,"morphTargetsTextureSize",u.size)}return{update:r}}function JS(n,e,t,i){let s=new WeakMap;function r(c){let h=i.render.frame,l=c.geometry,d=e.get(c,l);if(s.get(d)!==h&&(e.update(d),s.set(d,h)),c.isInstancedMesh&&(c.hasEventListener("dispose",a)===!1&&c.addEventListener("dispose",a),s.get(c)!==h&&(t.update(c.instanceMatrix,n.ARRAY_BUFFER),c.instanceColor!==null&&t.update(c.instanceColor,n.ARRAY_BUFFER),s.set(c,h))),c.isSkinnedMesh){let u=c.skeleton;s.get(u)!==h&&(u.update(),s.set(u,h))}return d}function o(){s=new WeakMap}function a(c){let h=c.target;h.removeEventListener("dispose",a),t.remove(h.instanceMatrix),h.instanceColor!==null&&t.remove(h.instanceColor)}return{update:r,dispose:o}}var _y=new Qn,ty=new bo(1,1),vy=new oc,by=new fu,My=new hc,ny=[],iy=[],sy=new Float32Array(16),ry=new Float32Array(9),oy=new Float32Array(4);function nl(n,e,t){let i=n[0];if(i<=0||i>0)return n;let s=e*t,r=ny[s];if(r===void 0&&(r=new Float32Array(s),ny[s]=r),e!==0){i.toArray(r,0);for(let o=1,a=0;o!==e;++o)a+=t,n[o].toArray(r,a)}return r}function Mn(n,e){if(n.length!==e.length)return!1;for(let t=0,i=n.length;t<i;t++)if(n[t]!==e[t])return!1;return!0}function Sn(n,e){for(let t=0,i=e.length;t<i;t++)n[t]=e[t]}function Hd(n,e){let t=iy[e];t===void 0&&(t=new Int32Array(e),iy[e]=t);for(let i=0;i!==e;++i)t[i]=n.allocateTextureUnit();return t}function QS(n,e){let t=this.cache;t[0]!==e&&(n.uniform1f(this.addr,e),t[0]=e)}function ew(n,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Mn(t,e))return;n.uniform2fv(this.addr,e),Sn(t,e)}}function tw(n,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(n.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(Mn(t,e))return;n.uniform3fv(this.addr,e),Sn(t,e)}}function nw(n,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Mn(t,e))return;n.uniform4fv(this.addr,e),Sn(t,e)}}function iw(n,e){let t=this.cache,i=e.elements;if(i===void 0){if(Mn(t,e))return;n.uniformMatrix2fv(this.addr,!1,e),Sn(t,e)}else{if(Mn(t,i))return;oy.set(i),n.uniformMatrix2fv(this.addr,!1,oy),Sn(t,i)}}function sw(n,e){let t=this.cache,i=e.elements;if(i===void 0){if(Mn(t,e))return;n.uniformMatrix3fv(this.addr,!1,e),Sn(t,e)}else{if(Mn(t,i))return;ry.set(i),n.uniformMatrix3fv(this.addr,!1,ry),Sn(t,i)}}function rw(n,e){let t=this.cache,i=e.elements;if(i===void 0){if(Mn(t,e))return;n.uniformMatrix4fv(this.addr,!1,e),Sn(t,e)}else{if(Mn(t,i))return;sy.set(i),n.uniformMatrix4fv(this.addr,!1,sy),Sn(t,i)}}function ow(n,e){let t=this.cache;t[0]!==e&&(n.uniform1i(this.addr,e),t[0]=e)}function aw(n,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Mn(t,e))return;n.uniform2iv(this.addr,e),Sn(t,e)}}function lw(n,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Mn(t,e))return;n.uniform3iv(this.addr,e),Sn(t,e)}}function cw(n,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Mn(t,e))return;n.uniform4iv(this.addr,e),Sn(t,e)}}function hw(n,e){let t=this.cache;t[0]!==e&&(n.uniform1ui(this.addr,e),t[0]=e)}function uw(n,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Mn(t,e))return;n.uniform2uiv(this.addr,e),Sn(t,e)}}function dw(n,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Mn(t,e))return;n.uniform3uiv(this.addr,e),Sn(t,e)}}function fw(n,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Mn(t,e))return;n.uniform4uiv(this.addr,e),Sn(t,e)}}function pw(n,e,t){let i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s);let r;this.type===n.SAMPLER_2D_SHADOW?(ty.compareFunction=_m,r=ty):r=_y,t.setTexture2D(e||r,s)}function mw(n,e,t){let i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),t.setTexture3D(e||by,s)}function gw(n,e,t){let i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),t.setTextureCube(e||My,s)}function xw(n,e,t){let i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),t.setTexture2DArray(e||vy,s)}function yw(n){switch(n){case 5126:return QS;case 35664:return ew;case 35665:return tw;case 35666:return nw;case 35674:return iw;case 35675:return sw;case 35676:return rw;case 5124:case 35670:return ow;case 35667:case 35671:return aw;case 35668:case 35672:return lw;case 35669:case 35673:return cw;case 5125:return hw;case 36294:return uw;case 36295:return dw;case 36296:return fw;case 35678:case 36198:case 36298:case 36306:case 35682:return pw;case 35679:case 36299:case 36307:return mw;case 35680:case 36300:case 36308:case 36293:return gw;case 36289:case 36303:case 36311:case 36292:return xw}}function _w(n,e){n.uniform1fv(this.addr,e)}function vw(n,e){let t=nl(e,this.size,2);n.uniform2fv(this.addr,t)}function bw(n,e){let t=nl(e,this.size,3);n.uniform3fv(this.addr,t)}function Mw(n,e){let t=nl(e,this.size,4);n.uniform4fv(this.addr,t)}function Sw(n,e){let t=nl(e,this.size,4);n.uniformMatrix2fv(this.addr,!1,t)}function ww(n,e){let t=nl(e,this.size,9);n.uniformMatrix3fv(this.addr,!1,t)}function Aw(n,e){let t=nl(e,this.size,16);n.uniformMatrix4fv(this.addr,!1,t)}function Tw(n,e){n.uniform1iv(this.addr,e)}function Ew(n,e){n.uniform2iv(this.addr,e)}function Rw(n,e){n.uniform3iv(this.addr,e)}function Cw(n,e){n.uniform4iv(this.addr,e)}function Pw(n,e){n.uniform1uiv(this.addr,e)}function Iw(n,e){n.uniform2uiv(this.addr,e)}function Nw(n,e){n.uniform3uiv(this.addr,e)}function Dw(n,e){n.uniform4uiv(this.addr,e)}function Lw(n,e,t){let i=this.cache,s=e.length,r=Hd(t,s);Mn(i,r)||(n.uniform1iv(this.addr,r),Sn(i,r));for(let o=0;o!==s;++o)t.setTexture2D(e[o]||_y,r[o])}function Uw(n,e,t){let i=this.cache,s=e.length,r=Hd(t,s);Mn(i,r)||(n.uniform1iv(this.addr,r),Sn(i,r));for(let o=0;o!==s;++o)t.setTexture3D(e[o]||by,r[o])}function Fw(n,e,t){let i=this.cache,s=e.length,r=Hd(t,s);Mn(i,r)||(n.uniform1iv(this.addr,r),Sn(i,r));for(let o=0;o!==s;++o)t.setTextureCube(e[o]||My,r[o])}function Ow(n,e,t){let i=this.cache,s=e.length,r=Hd(t,s);Mn(i,r)||(n.uniform1iv(this.addr,r),Sn(i,r));for(let o=0;o!==s;++o)t.setTexture2DArray(e[o]||vy,r[o])}function Bw(n){switch(n){case 5126:return _w;case 35664:return vw;case 35665:return bw;case 35666:return Mw;case 35674:return Sw;case 35675:return ww;case 35676:return Aw;case 5124:case 35670:return Tw;case 35667:case 35671:return Ew;case 35668:case 35672:return Rw;case 35669:case 35673:return Cw;case 5125:return Pw;case 36294:return Iw;case 36295:return Nw;case 36296:return Dw;case 35678:case 36198:case 36298:case 36306:case 35682:return Lw;case 35679:case 36299:case 36307:return Uw;case 35680:case 36300:case 36308:case 36293:return Fw;case 36289:case 36303:case 36311:case 36292:return Ow}}var Lm=class{constructor(e,t,i){this.id=e,this.addr=i,this.cache=[],this.type=t.type,this.setValue=yw(t.type)}},Um=class{constructor(e,t,i){this.id=e,this.addr=i,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=Bw(t.type)}},Fm=class{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,i){let s=this.seq;for(let r=0,o=s.length;r!==o;++r){let a=s[r];a.setValue(e,t[a.id],i)}}},Dm=/(\w+)(\])?(\[|\.)?/g;function ay(n,e){n.seq.push(e),n.map[e.id]=e}function kw(n,e,t){let i=n.name,s=i.length;for(Dm.lastIndex=0;;){let r=Dm.exec(i),o=Dm.lastIndex,a=r[1],c=r[2]==="]",h=r[3];if(c&&(a=a|0),h===void 0||h==="["&&o+2===s){ay(t,h===void 0?new Lm(a,n,e):new Um(a,n,e));break}else{let d=t.map[a];d===void 0&&(d=new Fm(a),ay(t,d)),t=d}}}var el=class{constructor(e,t){this.seq=[],this.map={};let i=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let s=0;s<i;++s){let r=e.getActiveUniform(t,s),o=e.getUniformLocation(t,r.name);kw(r,o,this)}}setValue(e,t,i,s){let r=this.map[t];r!==void 0&&r.setValue(e,i,s)}setOptional(e,t,i){let s=t[i];s!==void 0&&this.setValue(e,i,s)}static upload(e,t,i,s){for(let r=0,o=t.length;r!==o;++r){let a=t[r],c=i[a.id];c.needsUpdate!==!1&&a.setValue(e,c.value,s)}}static seqWithValue(e,t){let i=[];for(let s=0,r=e.length;s!==r;++s){let o=e[s];o.id in t&&i.push(o)}return i}};function ly(n,e,t){let i=n.createShader(e);return n.shaderSource(i,t),n.compileShader(i),i}var zw=37297,Hw=0;function Vw(n,e){let t=n.split(`
`),i=[],s=Math.max(e-6,0),r=Math.min(e+6,t.length);for(let o=s;o<r;o++){let a=o+1;i.push(`${a===e?">":" "} ${a}: ${t[o]}`)}return i.join(`
`)}var cy=new Qe;function Gw(n){lt._getMatrix(cy,lt.workingColorSpace,n);let e=`mat3( ${cy.elements.map(t=>t.toFixed(4))} )`;switch(lt.getTransfer(n)){case ic:return[e,"LinearTransferOETF"];case vt:return[e,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",n),[e,"LinearTransferOETF"]}}function hy(n,e,t){let i=n.getShaderParameter(e,n.COMPILE_STATUS),r=(n.getShaderInfoLog(e)||"").trim();if(i&&r==="")return"";let o=/ERROR: 0:(\d+)/.exec(r);if(o){let a=parseInt(o[1]);return t.toUpperCase()+`

`+r+`

`+Vw(n.getShaderSource(e),a)}else return r}function Ww(n,e){let t=Gw(e);return[`vec4 ${n}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}function Xw(n,e){let t;switch(e){case $u:t="Linear";break;case Yu:t="Reinhard";break;case Zu:t="Cineon";break;case Za:t="ACESFilmic";break;case ju:t="AgX";break;case Ju:t="Neutral";break;case Ku:t="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",e),t="Linear"}return"vec3 "+n+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}var kd=new L;function qw(){lt.getLuminanceCoefficients(kd);let n=kd.x.toFixed(4),e=kd.y.toFixed(4),t=kd.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${n}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function $w(n){return[n.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",n.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Vc).join(`
`)}function Yw(n){let e=[];for(let t in n){let i=n[t];i!==!1&&e.push("#define "+t+" "+i)}return e.join(`
`)}function Zw(n,e){let t={},i=n.getProgramParameter(e,n.ACTIVE_ATTRIBUTES);for(let s=0;s<i;s++){let r=n.getActiveAttrib(e,s),o=r.name,a=1;r.type===n.FLOAT_MAT2&&(a=2),r.type===n.FLOAT_MAT3&&(a=3),r.type===n.FLOAT_MAT4&&(a=4),t[o]={type:r.type,location:n.getAttribLocation(e,o),locationSize:a}}return t}function Vc(n){return n!==""}function uy(n,e){let t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return n.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function dy(n,e){return n.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}var Kw=/^[ \t]*#include +<([\w\d./]+)>/gm;function Om(n){return n.replace(Kw,Jw)}var jw=new Map;function Jw(n,e){let t=st[e];if(t===void 0){let i=jw.get(e);if(i!==void 0)t=st[i],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,i);else throw new Error("Can not resolve #include <"+e+">")}return Om(t)}var Qw=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function fy(n){return n.replace(Qw,eA)}function eA(n,e,t,i){let s="";for(let r=parseInt(e);r<parseInt(t);r++)s+=i.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function py(n){let e=`precision ${n.precision} float;
	precision ${n.precision} int;
	precision ${n.precision} sampler2D;
	precision ${n.precision} samplerCube;
	precision ${n.precision} sampler3D;
	precision ${n.precision} sampler2DArray;
	precision ${n.precision} sampler2DShadow;
	precision ${n.precision} samplerCubeShadow;
	precision ${n.precision} sampler2DArrayShadow;
	precision ${n.precision} isampler2D;
	precision ${n.precision} isampler3D;
	precision ${n.precision} isamplerCube;
	precision ${n.precision} isampler2DArray;
	precision ${n.precision} usampler2D;
	precision ${n.precision} usampler3D;
	precision ${n.precision} usamplerCube;
	precision ${n.precision} usampler2DArray;
	`;return n.precision==="highp"?e+=`
#define HIGH_PRECISION`:n.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:n.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}function tA(n){let e="SHADOWMAP_TYPE_BASIC";return n.shadowMapType===lm?e="SHADOWMAP_TYPE_PCF":n.shadowMapType===gx?e="SHADOWMAP_TYPE_PCF_SOFT":n.shadowMapType===Es&&(e="SHADOWMAP_TYPE_VSM"),e}function nA(n){let e="ENVMAP_TYPE_CUBE";if(n.envMap)switch(n.envMapMode){case Ao:case To:e="ENVMAP_TYPE_CUBE";break;case Lc:e="ENVMAP_TYPE_CUBE_UV";break}return e}function iA(n){let e="ENVMAP_MODE_REFLECTION";if(n.envMap)switch(n.envMapMode){case To:e="ENVMAP_MODE_REFRACTION";break}return e}function sA(n){let e="ENVMAP_BLENDING_NONE";if(n.envMap)switch(n.combine){case qu:e="ENVMAP_BLENDING_MULTIPLY";break;case Ix:e="ENVMAP_BLENDING_MIX";break;case Nx:e="ENVMAP_BLENDING_ADD";break}return e}function rA(n){let e=n.envMapCubeUVHeight;if(e===null)return null;let t=Math.log2(e)-2,i=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),112)),texelHeight:i,maxMip:t}}function oA(n,e,t,i){let s=n.getContext(),r=t.defines,o=t.vertexShader,a=t.fragmentShader,c=tA(t),h=nA(t),l=iA(t),d=sA(t),u=rA(t),f=$w(t),x=Yw(r),y=s.createProgram(),m,p,w=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(m=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,x].filter(Vc).join(`
`),m.length>0&&(m+=`
`),p=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,x].filter(Vc).join(`
`),p.length>0&&(p+=`
`)):(m=[py(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,x,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+l:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+c:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Vc).join(`
`),p=[py(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,x,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+h:"",t.envMap?"#define "+l:"",t.envMap?"#define "+d:"",u?"#define CUBEUV_TEXEL_WIDTH "+u.texelWidth:"",u?"#define CUBEUV_TEXEL_HEIGHT "+u.texelHeight:"",u?"#define CUBEUV_MAX_MIP "+u.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor||t.batchingColor?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+c:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==Qs?"#define TONE_MAPPING":"",t.toneMapping!==Qs?st.tonemapping_pars_fragment:"",t.toneMapping!==Qs?Xw("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",st.colorspace_pars_fragment,Ww("linearToOutputTexel",t.outputColorSpace),qw(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(Vc).join(`
`)),o=Om(o),o=uy(o,t),o=dy(o,t),a=Om(a),a=uy(a,t),a=dy(a,t),o=fy(o),a=fy(a),t.isRawShaderMaterial!==!0&&(w=`#version 300 es
`,m=[f,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,p=["#define varying in",t.glslVersion===vm?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===vm?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+p);let v=w+m+o,g=w+p+a,_=ly(s,s.VERTEX_SHADER,v),S=ly(s,s.FRAGMENT_SHADER,g);s.attachShader(y,_),s.attachShader(y,S),t.index0AttributeName!==void 0?s.bindAttribLocation(y,0,t.index0AttributeName):t.morphTargets===!0&&s.bindAttribLocation(y,0,"position"),s.linkProgram(y);function R(C){if(n.debug.checkShaderErrors){let U=s.getProgramInfoLog(y)||"",V=s.getShaderInfoLog(_)||"",H=s.getShaderInfoLog(S)||"",k=U.trim(),z=V.trim(),ie=H.trim(),$=!0,te=!0;if(s.getProgramParameter(y,s.LINK_STATUS)===!1)if($=!1,typeof n.debug.onShaderError=="function")n.debug.onShaderError(s,y,_,S);else{let F=hy(s,_,"vertex"),O=hy(s,S,"fragment");console.error("THREE.WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(y,s.VALIDATE_STATUS)+`

Material Name: `+C.name+`
Material Type: `+C.type+`

Program Info Log: `+k+`
`+F+`
`+O)}else k!==""?console.warn("THREE.WebGLProgram: Program Info Log:",k):(z===""||ie==="")&&(te=!1);te&&(C.diagnostics={runnable:$,programLog:k,vertexShader:{log:z,prefix:m},fragmentShader:{log:ie,prefix:p}})}s.deleteShader(_),s.deleteShader(S),P=new el(s,y),b=Zw(s,y)}let P;this.getUniforms=function(){return P===void 0&&R(this),P};let b;this.getAttributes=function(){return b===void 0&&R(this),b};let M=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return M===!1&&(M=s.getProgramParameter(y,zw)),M},this.destroy=function(){i.releaseStatesOfProgram(this),s.deleteProgram(y),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=Hw++,this.cacheKey=e,this.usedTimes=1,this.program=y,this.vertexShader=_,this.fragmentShader=S,this}var aA=0,Bm=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){let t=e.vertexShader,i=e.fragmentShader,s=this._getShaderStage(t),r=this._getShaderStage(i),o=this._getShaderCacheForMaterial(e);return o.has(s)===!1&&(o.add(s),s.usedTimes++),o.has(r)===!1&&(o.add(r),r.usedTimes++),this}remove(e){let t=this.materialCache.get(e);for(let i of t)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){let t=this.materialCache,i=t.get(e);return i===void 0&&(i=new Set,t.set(e,i)),i}_getShaderStage(e){let t=this.shaderCache,i=t.get(e);return i===void 0&&(i=new km(e),t.set(e,i)),i}},km=class{constructor(e){this.id=aA++,this.code=e,this.usedTimes=0}};function lA(n,e,t,i,s,r,o){let a=new ka,c=new Bm,h=new Set,l=[],d=s.logarithmicDepthBuffer,u=s.vertexTextures,f=s.precision,x={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function y(b){return h.add(b),b===0?"uv":`uv${b}`}function m(b,M,C,U,V){let H=U.fog,k=V.geometry,z=b.isMeshStandardMaterial?U.environment:null,ie=(b.isMeshStandardMaterial?t:e).get(b.envMap||z),$=ie&&ie.mapping===Lc?ie.image.height:null,te=x[b.type];b.precision!==null&&(f=s.getMaxPrecision(b.precision),f!==b.precision&&console.warn("THREE.WebGLProgram.getParameters:",b.precision,"not supported, using",f,"instead."));let F=k.morphAttributes.position||k.morphAttributes.normal||k.morphAttributes.color,O=F!==void 0?F.length:0,J=0;k.morphAttributes.position!==void 0&&(J=1),k.morphAttributes.normal!==void 0&&(J=2),k.morphAttributes.color!==void 0&&(J=3);let q,le,Se,Y;if(te){let bt=Rs[te];q=bt.vertexShader,le=bt.fragmentShader}else q=b.vertexShader,le=b.fragmentShader,c.update(b),Se=c.getVertexShaderID(b),Y=c.getFragmentShaderID(b);let j=n.getRenderTarget(),he=n.state.buffers.depth.getReversed(),De=V.isInstancedMesh===!0,ve=V.isBatchedMesh===!0,ge=!!b.map,ot=!!b.matcap,D=!!ie,Ze=!!b.aoMap,Pe=!!b.lightMap,Le=!!b.bumpMap,Te=!!b.normalMap,_t=!!b.displacementMap,we=!!b.emissiveMap,Ge=!!b.metalnessMap,en=!!b.roughnessMap,Ft=b.anisotropy>0,I=b.clearcoat>0,A=b.dispersion>0,X=b.iridescence>0,ee=b.sheen>0,oe=b.transmission>0,Q=Ft&&!!b.anisotropyMap,Ue=I&&!!b.clearcoatMap,pe=I&&!!b.clearcoatNormalMap,Ie=I&&!!b.clearcoatRoughnessMap,Be=X&&!!b.iridescenceMap,de=X&&!!b.iridescenceThicknessMap,be=ee&&!!b.sheenColorMap,We=ee&&!!b.sheenRoughnessMap,ke=!!b.specularMap,xe=!!b.specularColorMap,$e=!!b.specularIntensityMap,B=oe&&!!b.transmissionMap,ce=oe&&!!b.thicknessMap,me=!!b.gradientMap,Ne=!!b.alphaMap,ue=b.alphaTest>0,se=!!b.alphaHash,Oe=!!b.extensions,je=Qs;b.toneMapped&&(j===null||j.isXRRenderTarget===!0)&&(je=n.toneMapping);let Dt={shaderID:te,shaderType:b.type,shaderName:b.name,vertexShader:q,fragmentShader:le,defines:b.defines,customVertexShaderID:Se,customFragmentShaderID:Y,isRawShaderMaterial:b.isRawShaderMaterial===!0,glslVersion:b.glslVersion,precision:f,batching:ve,batchingColor:ve&&V._colorsTexture!==null,instancing:De,instancingColor:De&&V.instanceColor!==null,instancingMorph:De&&V.morphTexture!==null,supportsVertexTextures:u,outputColorSpace:j===null?n.outputColorSpace:j.isXRRenderTarget===!0?j.texture.colorSpace:yo,alphaToCoverage:!!b.alphaToCoverage,map:ge,matcap:ot,envMap:D,envMapMode:D&&ie.mapping,envMapCubeUVHeight:$,aoMap:Ze,lightMap:Pe,bumpMap:Le,normalMap:Te,displacementMap:u&&_t,emissiveMap:we,normalMapObjectSpace:Te&&b.normalMapType===Fx,normalMapTangentSpace:Te&&b.normalMapType===zc,metalnessMap:Ge,roughnessMap:en,anisotropy:Ft,anisotropyMap:Q,clearcoat:I,clearcoatMap:Ue,clearcoatNormalMap:pe,clearcoatRoughnessMap:Ie,dispersion:A,iridescence:X,iridescenceMap:Be,iridescenceThicknessMap:de,sheen:ee,sheenColorMap:be,sheenRoughnessMap:We,specularMap:ke,specularColorMap:xe,specularIntensityMap:$e,transmission:oe,transmissionMap:B,thicknessMap:ce,gradientMap:me,opaque:b.transparent===!1&&b.blending===mo&&b.alphaToCoverage===!1,alphaMap:Ne,alphaTest:ue,alphaHash:se,combine:b.combine,mapUv:ge&&y(b.map.channel),aoMapUv:Ze&&y(b.aoMap.channel),lightMapUv:Pe&&y(b.lightMap.channel),bumpMapUv:Le&&y(b.bumpMap.channel),normalMapUv:Te&&y(b.normalMap.channel),displacementMapUv:_t&&y(b.displacementMap.channel),emissiveMapUv:we&&y(b.emissiveMap.channel),metalnessMapUv:Ge&&y(b.metalnessMap.channel),roughnessMapUv:en&&y(b.roughnessMap.channel),anisotropyMapUv:Q&&y(b.anisotropyMap.channel),clearcoatMapUv:Ue&&y(b.clearcoatMap.channel),clearcoatNormalMapUv:pe&&y(b.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:Ie&&y(b.clearcoatRoughnessMap.channel),iridescenceMapUv:Be&&y(b.iridescenceMap.channel),iridescenceThicknessMapUv:de&&y(b.iridescenceThicknessMap.channel),sheenColorMapUv:be&&y(b.sheenColorMap.channel),sheenRoughnessMapUv:We&&y(b.sheenRoughnessMap.channel),specularMapUv:ke&&y(b.specularMap.channel),specularColorMapUv:xe&&y(b.specularColorMap.channel),specularIntensityMapUv:$e&&y(b.specularIntensityMap.channel),transmissionMapUv:B&&y(b.transmissionMap.channel),thicknessMapUv:ce&&y(b.thicknessMap.channel),alphaMapUv:Ne&&y(b.alphaMap.channel),vertexTangents:!!k.attributes.tangent&&(Te||Ft),vertexColors:b.vertexColors,vertexAlphas:b.vertexColors===!0&&!!k.attributes.color&&k.attributes.color.itemSize===4,pointsUvs:V.isPoints===!0&&!!k.attributes.uv&&(ge||Ne),fog:!!H,useFog:b.fog===!0,fogExp2:!!H&&H.isFogExp2,flatShading:b.flatShading===!0&&b.wireframe===!1,sizeAttenuation:b.sizeAttenuation===!0,logarithmicDepthBuffer:d,reversedDepthBuffer:he,skinning:V.isSkinnedMesh===!0,morphTargets:k.morphAttributes.position!==void 0,morphNormals:k.morphAttributes.normal!==void 0,morphColors:k.morphAttributes.color!==void 0,morphTargetsCount:O,morphTextureStride:J,numDirLights:M.directional.length,numPointLights:M.point.length,numSpotLights:M.spot.length,numSpotLightMaps:M.spotLightMap.length,numRectAreaLights:M.rectArea.length,numHemiLights:M.hemi.length,numDirLightShadows:M.directionalShadowMap.length,numPointLightShadows:M.pointShadowMap.length,numSpotLightShadows:M.spotShadowMap.length,numSpotLightShadowsWithMaps:M.numSpotLightShadowsWithMaps,numLightProbes:M.numLightProbes,numClippingPlanes:o.numPlanes,numClipIntersection:o.numIntersection,dithering:b.dithering,shadowMapEnabled:n.shadowMap.enabled&&C.length>0,shadowMapType:n.shadowMap.type,toneMapping:je,decodeVideoTexture:ge&&b.map.isVideoTexture===!0&&lt.getTransfer(b.map.colorSpace)===vt,decodeVideoTextureEmissive:we&&b.emissiveMap.isVideoTexture===!0&&lt.getTransfer(b.emissiveMap.colorSpace)===vt,premultipliedAlpha:b.premultipliedAlpha,doubleSided:b.side===vi,flipSided:b.side===bn,useDepthPacking:b.depthPacking>=0,depthPacking:b.depthPacking||0,index0AttributeName:b.index0AttributeName,extensionClipCullDistance:Oe&&b.extensions.clipCullDistance===!0&&i.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(Oe&&b.extensions.multiDraw===!0||ve)&&i.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:i.has("KHR_parallel_shader_compile"),customProgramCacheKey:b.customProgramCacheKey()};return Dt.vertexUv1s=h.has(1),Dt.vertexUv2s=h.has(2),Dt.vertexUv3s=h.has(3),h.clear(),Dt}function p(b){let M=[];if(b.shaderID?M.push(b.shaderID):(M.push(b.customVertexShaderID),M.push(b.customFragmentShaderID)),b.defines!==void 0)for(let C in b.defines)M.push(C),M.push(b.defines[C]);return b.isRawShaderMaterial===!1&&(w(M,b),v(M,b),M.push(n.outputColorSpace)),M.push(b.customProgramCacheKey),M.join()}function w(b,M){b.push(M.precision),b.push(M.outputColorSpace),b.push(M.envMapMode),b.push(M.envMapCubeUVHeight),b.push(M.mapUv),b.push(M.alphaMapUv),b.push(M.lightMapUv),b.push(M.aoMapUv),b.push(M.bumpMapUv),b.push(M.normalMapUv),b.push(M.displacementMapUv),b.push(M.emissiveMapUv),b.push(M.metalnessMapUv),b.push(M.roughnessMapUv),b.push(M.anisotropyMapUv),b.push(M.clearcoatMapUv),b.push(M.clearcoatNormalMapUv),b.push(M.clearcoatRoughnessMapUv),b.push(M.iridescenceMapUv),b.push(M.iridescenceThicknessMapUv),b.push(M.sheenColorMapUv),b.push(M.sheenRoughnessMapUv),b.push(M.specularMapUv),b.push(M.specularColorMapUv),b.push(M.specularIntensityMapUv),b.push(M.transmissionMapUv),b.push(M.thicknessMapUv),b.push(M.combine),b.push(M.fogExp2),b.push(M.sizeAttenuation),b.push(M.morphTargetsCount),b.push(M.morphAttributeCount),b.push(M.numDirLights),b.push(M.numPointLights),b.push(M.numSpotLights),b.push(M.numSpotLightMaps),b.push(M.numHemiLights),b.push(M.numRectAreaLights),b.push(M.numDirLightShadows),b.push(M.numPointLightShadows),b.push(M.numSpotLightShadows),b.push(M.numSpotLightShadowsWithMaps),b.push(M.numLightProbes),b.push(M.shadowMapType),b.push(M.toneMapping),b.push(M.numClippingPlanes),b.push(M.numClipIntersection),b.push(M.depthPacking)}function v(b,M){a.disableAll(),M.supportsVertexTextures&&a.enable(0),M.instancing&&a.enable(1),M.instancingColor&&a.enable(2),M.instancingMorph&&a.enable(3),M.matcap&&a.enable(4),M.envMap&&a.enable(5),M.normalMapObjectSpace&&a.enable(6),M.normalMapTangentSpace&&a.enable(7),M.clearcoat&&a.enable(8),M.iridescence&&a.enable(9),M.alphaTest&&a.enable(10),M.vertexColors&&a.enable(11),M.vertexAlphas&&a.enable(12),M.vertexUv1s&&a.enable(13),M.vertexUv2s&&a.enable(14),M.vertexUv3s&&a.enable(15),M.vertexTangents&&a.enable(16),M.anisotropy&&a.enable(17),M.alphaHash&&a.enable(18),M.batching&&a.enable(19),M.dispersion&&a.enable(20),M.batchingColor&&a.enable(21),M.gradientMap&&a.enable(22),b.push(a.mask),a.disableAll(),M.fog&&a.enable(0),M.useFog&&a.enable(1),M.flatShading&&a.enable(2),M.logarithmicDepthBuffer&&a.enable(3),M.reversedDepthBuffer&&a.enable(4),M.skinning&&a.enable(5),M.morphTargets&&a.enable(6),M.morphNormals&&a.enable(7),M.morphColors&&a.enable(8),M.premultipliedAlpha&&a.enable(9),M.shadowMapEnabled&&a.enable(10),M.doubleSided&&a.enable(11),M.flipSided&&a.enable(12),M.useDepthPacking&&a.enable(13),M.dithering&&a.enable(14),M.transmission&&a.enable(15),M.sheen&&a.enable(16),M.opaque&&a.enable(17),M.pointsUvs&&a.enable(18),M.decodeVideoTexture&&a.enable(19),M.decodeVideoTextureEmissive&&a.enable(20),M.alphaToCoverage&&a.enable(21),b.push(a.mask)}function g(b){let M=x[b.type],C;if(M){let U=Rs[M];C=ui.clone(U.uniforms)}else C=b.uniforms;return C}function _(b,M){let C;for(let U=0,V=l.length;U<V;U++){let H=l[U];if(H.cacheKey===M){C=H,++C.usedTimes;break}}return C===void 0&&(C=new oA(n,M,b,r),l.push(C)),C}function S(b){if(--b.usedTimes===0){let M=l.indexOf(b);l[M]=l[l.length-1],l.pop(),b.destroy()}}function R(b){c.remove(b)}function P(){c.dispose()}return{getParameters:m,getProgramCacheKey:p,getUniforms:g,acquireProgram:_,releaseProgram:S,releaseShaderCache:R,programs:l,dispose:P}}function cA(){let n=new WeakMap;function e(o){return n.has(o)}function t(o){let a=n.get(o);return a===void 0&&(a={},n.set(o,a)),a}function i(o){n.delete(o)}function s(o,a,c){n.get(o)[a]=c}function r(){n=new WeakMap}return{has:e,get:t,remove:i,update:s,dispose:r}}function hA(n,e){return n.groupOrder!==e.groupOrder?n.groupOrder-e.groupOrder:n.renderOrder!==e.renderOrder?n.renderOrder-e.renderOrder:n.material.id!==e.material.id?n.material.id-e.material.id:n.z!==e.z?n.z-e.z:n.id-e.id}function my(n,e){return n.groupOrder!==e.groupOrder?n.groupOrder-e.groupOrder:n.renderOrder!==e.renderOrder?n.renderOrder-e.renderOrder:n.z!==e.z?e.z-n.z:n.id-e.id}function gy(){let n=[],e=0,t=[],i=[],s=[];function r(){e=0,t.length=0,i.length=0,s.length=0}function o(d,u,f,x,y,m){let p=n[e];return p===void 0?(p={id:d.id,object:d,geometry:u,material:f,groupOrder:x,renderOrder:d.renderOrder,z:y,group:m},n[e]=p):(p.id=d.id,p.object=d,p.geometry=u,p.material=f,p.groupOrder=x,p.renderOrder=d.renderOrder,p.z=y,p.group=m),e++,p}function a(d,u,f,x,y,m){let p=o(d,u,f,x,y,m);f.transmission>0?i.push(p):f.transparent===!0?s.push(p):t.push(p)}function c(d,u,f,x,y,m){let p=o(d,u,f,x,y,m);f.transmission>0?i.unshift(p):f.transparent===!0?s.unshift(p):t.unshift(p)}function h(d,u){t.length>1&&t.sort(d||hA),i.length>1&&i.sort(u||my),s.length>1&&s.sort(u||my)}function l(){for(let d=e,u=n.length;d<u;d++){let f=n[d];if(f.id===null)break;f.id=null,f.object=null,f.geometry=null,f.material=null,f.group=null}}return{opaque:t,transmissive:i,transparent:s,init:r,push:a,unshift:c,finish:l,sort:h}}function uA(){let n=new WeakMap;function e(i,s){let r=n.get(i),o;return r===void 0?(o=new gy,n.set(i,[o])):s>=r.length?(o=new gy,r.push(o)):o=r[s],o}function t(){n=new WeakMap}return{get:e,dispose:t}}function dA(){let n={};return{get:function(e){if(n[e.id]!==void 0)return n[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new L,color:new Ee};break;case"SpotLight":t={position:new L,direction:new L,color:new Ee,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new L,color:new Ee,distance:0,decay:0};break;case"HemisphereLight":t={direction:new L,skyColor:new Ee,groundColor:new Ee};break;case"RectAreaLight":t={color:new Ee,position:new L,halfWidth:new L,halfHeight:new L};break}return n[e.id]=t,t}}}function fA(){let n={};return{get:function(e){if(n[e.id]!==void 0)return n[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ae};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ae};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ae,shadowCameraNear:1,shadowCameraFar:1e3};break}return n[e.id]=t,t}}}var pA=0;function mA(n,e){return(e.castShadow?2:0)-(n.castShadow?2:0)+(e.map?1:0)-(n.map?1:0)}function gA(n){let e=new dA,t=fA(),i={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let h=0;h<9;h++)i.probe.push(new L);let s=new L,r=new ut,o=new ut;function a(h){let l=0,d=0,u=0;for(let b=0;b<9;b++)i.probe[b].set(0,0,0);let f=0,x=0,y=0,m=0,p=0,w=0,v=0,g=0,_=0,S=0,R=0;h.sort(mA);for(let b=0,M=h.length;b<M;b++){let C=h[b],U=C.color,V=C.intensity,H=C.distance,k=C.shadow&&C.shadow.map?C.shadow.map.texture:null;if(C.isAmbientLight)l+=U.r*V,d+=U.g*V,u+=U.b*V;else if(C.isLightProbe){for(let z=0;z<9;z++)i.probe[z].addScaledVector(C.sh.coefficients[z],V);R++}else if(C.isDirectionalLight){let z=e.get(C);if(z.color.copy(C.color).multiplyScalar(C.intensity),C.castShadow){let ie=C.shadow,$=t.get(C);$.shadowIntensity=ie.intensity,$.shadowBias=ie.bias,$.shadowNormalBias=ie.normalBias,$.shadowRadius=ie.radius,$.shadowMapSize=ie.mapSize,i.directionalShadow[f]=$,i.directionalShadowMap[f]=k,i.directionalShadowMatrix[f]=C.shadow.matrix,w++}i.directional[f]=z,f++}else if(C.isSpotLight){let z=e.get(C);z.position.setFromMatrixPosition(C.matrixWorld),z.color.copy(U).multiplyScalar(V),z.distance=H,z.coneCos=Math.cos(C.angle),z.penumbraCos=Math.cos(C.angle*(1-C.penumbra)),z.decay=C.decay,i.spot[y]=z;let ie=C.shadow;if(C.map&&(i.spotLightMap[_]=C.map,_++,ie.updateMatrices(C),C.castShadow&&S++),i.spotLightMatrix[y]=ie.matrix,C.castShadow){let $=t.get(C);$.shadowIntensity=ie.intensity,$.shadowBias=ie.bias,$.shadowNormalBias=ie.normalBias,$.shadowRadius=ie.radius,$.shadowMapSize=ie.mapSize,i.spotShadow[y]=$,i.spotShadowMap[y]=k,g++}y++}else if(C.isRectAreaLight){let z=e.get(C);z.color.copy(U).multiplyScalar(V),z.halfWidth.set(C.width*.5,0,0),z.halfHeight.set(0,C.height*.5,0),i.rectArea[m]=z,m++}else if(C.isPointLight){let z=e.get(C);if(z.color.copy(C.color).multiplyScalar(C.intensity),z.distance=C.distance,z.decay=C.decay,C.castShadow){let ie=C.shadow,$=t.get(C);$.shadowIntensity=ie.intensity,$.shadowBias=ie.bias,$.shadowNormalBias=ie.normalBias,$.shadowRadius=ie.radius,$.shadowMapSize=ie.mapSize,$.shadowCameraNear=ie.camera.near,$.shadowCameraFar=ie.camera.far,i.pointShadow[x]=$,i.pointShadowMap[x]=k,i.pointShadowMatrix[x]=C.shadow.matrix,v++}i.point[x]=z,x++}else if(C.isHemisphereLight){let z=e.get(C);z.skyColor.copy(C.color).multiplyScalar(V),z.groundColor.copy(C.groundColor).multiplyScalar(V),i.hemi[p]=z,p++}}m>0&&(n.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=_e.LTC_FLOAT_1,i.rectAreaLTC2=_e.LTC_FLOAT_2):(i.rectAreaLTC1=_e.LTC_HALF_1,i.rectAreaLTC2=_e.LTC_HALF_2)),i.ambient[0]=l,i.ambient[1]=d,i.ambient[2]=u;let P=i.hash;(P.directionalLength!==f||P.pointLength!==x||P.spotLength!==y||P.rectAreaLength!==m||P.hemiLength!==p||P.numDirectionalShadows!==w||P.numPointShadows!==v||P.numSpotShadows!==g||P.numSpotMaps!==_||P.numLightProbes!==R)&&(i.directional.length=f,i.spot.length=y,i.rectArea.length=m,i.point.length=x,i.hemi.length=p,i.directionalShadow.length=w,i.directionalShadowMap.length=w,i.pointShadow.length=v,i.pointShadowMap.length=v,i.spotShadow.length=g,i.spotShadowMap.length=g,i.directionalShadowMatrix.length=w,i.pointShadowMatrix.length=v,i.spotLightMatrix.length=g+_-S,i.spotLightMap.length=_,i.numSpotLightShadowsWithMaps=S,i.numLightProbes=R,P.directionalLength=f,P.pointLength=x,P.spotLength=y,P.rectAreaLength=m,P.hemiLength=p,P.numDirectionalShadows=w,P.numPointShadows=v,P.numSpotShadows=g,P.numSpotMaps=_,P.numLightProbes=R,i.version=pA++)}function c(h,l){let d=0,u=0,f=0,x=0,y=0,m=l.matrixWorldInverse;for(let p=0,w=h.length;p<w;p++){let v=h[p];if(v.isDirectionalLight){let g=i.directional[d];g.direction.setFromMatrixPosition(v.matrixWorld),s.setFromMatrixPosition(v.target.matrixWorld),g.direction.sub(s),g.direction.transformDirection(m),d++}else if(v.isSpotLight){let g=i.spot[f];g.position.setFromMatrixPosition(v.matrixWorld),g.position.applyMatrix4(m),g.direction.setFromMatrixPosition(v.matrixWorld),s.setFromMatrixPosition(v.target.matrixWorld),g.direction.sub(s),g.direction.transformDirection(m),f++}else if(v.isRectAreaLight){let g=i.rectArea[x];g.position.setFromMatrixPosition(v.matrixWorld),g.position.applyMatrix4(m),o.identity(),r.copy(v.matrixWorld),r.premultiply(m),o.extractRotation(r),g.halfWidth.set(v.width*.5,0,0),g.halfHeight.set(0,v.height*.5,0),g.halfWidth.applyMatrix4(o),g.halfHeight.applyMatrix4(o),x++}else if(v.isPointLight){let g=i.point[u];g.position.setFromMatrixPosition(v.matrixWorld),g.position.applyMatrix4(m),u++}else if(v.isHemisphereLight){let g=i.hemi[y];g.direction.setFromMatrixPosition(v.matrixWorld),g.direction.transformDirection(m),y++}}}return{setup:a,setupView:c,state:i}}function xy(n){let e=new gA(n),t=[],i=[];function s(l){h.camera=l,t.length=0,i.length=0}function r(l){t.push(l)}function o(l){i.push(l)}function a(){e.setup(t)}function c(l){e.setupView(t,l)}let h={lightsArray:t,shadowsArray:i,camera:null,lights:e,transmissionRenderTarget:{}};return{init:s,state:h,setupLights:a,setupLightsView:c,pushLight:r,pushShadow:o}}function xA(n){let e=new WeakMap;function t(s,r=0){let o=e.get(s),a;return o===void 0?(a=new xy(n),e.set(s,[a])):r>=o.length?(a=new xy(n),o.push(a)):a=o[r],a}function i(){e=new WeakMap}return{get:t,dispose:i}}var yA=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,_A=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
#include <packing>
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = unpackRGBATo2Half( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ) );
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = unpackRGBAToDepth( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ) );
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( squared_mean - mean * mean );
	gl_FragColor = pack2HalfToRGBA( vec2( mean, std_dev ) );
}`;function vA(n,e,t){let i=new Xa,s=new ae,r=new ae,o=new wt,a=new Su({depthPacking:Ux}),c=new wu,h={},l=t.maxTextureSize,d={[ji]:bn,[bn]:ji,[vi]:vi},u=new Pt({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new ae},radius:{value:4}},vertexShader:yA,fragmentShader:_A}),f=u.clone();f.defines.HORIZONTAL_PASS=1;let x=new fn;x.setAttribute("position",new Ht(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let y=new nt(x,u),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=lm;let p=this.type;this.render=function(S,R,P){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||S.length===0)return;let b=n.getRenderTarget(),M=n.getActiveCubeFace(),C=n.getActiveMipmapLevel(),U=n.state;U.setBlending(Rn),U.buffers.depth.getReversed()===!0?U.buffers.color.setClear(0,0,0,0):U.buffers.color.setClear(1,1,1,1),U.buffers.depth.setTest(!0),U.setScissorTest(!1);let V=p!==Es&&this.type===Es,H=p===Es&&this.type!==Es;for(let k=0,z=S.length;k<z;k++){let ie=S[k],$=ie.shadow;if($===void 0){console.warn("THREE.WebGLShadowMap:",ie,"has no shadow.");continue}if($.autoUpdate===!1&&$.needsUpdate===!1)continue;s.copy($.mapSize);let te=$.getFrameExtents();if(s.multiply(te),r.copy($.mapSize),(s.x>l||s.y>l)&&(s.x>l&&(r.x=Math.floor(l/te.x),s.x=r.x*te.x,$.mapSize.x=r.x),s.y>l&&(r.y=Math.floor(l/te.y),s.y=r.y*te.y,$.mapSize.y=r.y)),$.map===null||V===!0||H===!0){let O=this.type!==Es?{minFilter:kn,magFilter:kn}:{};$.map!==null&&$.map.dispose(),$.map=new ln(s.x,s.y,O),$.map.texture.name=ie.name+".shadowMap",$.camera.updateProjectionMatrix()}n.setRenderTarget($.map),n.clear();let F=$.getViewportCount();for(let O=0;O<F;O++){let J=$.getViewport(O);o.set(r.x*J.x,r.y*J.y,r.x*J.z,r.y*J.w),U.viewport(o),$.updateMatrices(ie,O),i=$.getFrustum(),g(R,P,$.camera,ie,this.type)}$.isPointLightShadow!==!0&&this.type===Es&&w($,P),$.needsUpdate=!1}p=this.type,m.needsUpdate=!1,n.setRenderTarget(b,M,C)};function w(S,R){let P=e.update(y);u.defines.VSM_SAMPLES!==S.blurSamples&&(u.defines.VSM_SAMPLES=S.blurSamples,f.defines.VSM_SAMPLES=S.blurSamples,u.needsUpdate=!0,f.needsUpdate=!0),S.mapPass===null&&(S.mapPass=new ln(s.x,s.y)),u.uniforms.shadow_pass.value=S.map.texture,u.uniforms.resolution.value=S.mapSize,u.uniforms.radius.value=S.radius,n.setRenderTarget(S.mapPass),n.clear(),n.renderBufferDirect(R,null,P,u,y,null),f.uniforms.shadow_pass.value=S.mapPass.texture,f.uniforms.resolution.value=S.mapSize,f.uniforms.radius.value=S.radius,n.setRenderTarget(S.map),n.clear(),n.renderBufferDirect(R,null,P,f,y,null)}function v(S,R,P,b){let M=null,C=P.isPointLight===!0?S.customDistanceMaterial:S.customDepthMaterial;if(C!==void 0)M=C;else if(M=P.isPointLight===!0?c:a,n.localClippingEnabled&&R.clipShadows===!0&&Array.isArray(R.clippingPlanes)&&R.clippingPlanes.length!==0||R.displacementMap&&R.displacementScale!==0||R.alphaMap&&R.alphaTest>0||R.map&&R.alphaTest>0||R.alphaToCoverage===!0){let U=M.uuid,V=R.uuid,H=h[U];H===void 0&&(H={},h[U]=H);let k=H[V];k===void 0&&(k=M.clone(),H[V]=k,R.addEventListener("dispose",_)),M=k}if(M.visible=R.visible,M.wireframe=R.wireframe,b===Es?M.side=R.shadowSide!==null?R.shadowSide:R.side:M.side=R.shadowSide!==null?R.shadowSide:d[R.side],M.alphaMap=R.alphaMap,M.alphaTest=R.alphaToCoverage===!0?.5:R.alphaTest,M.map=R.map,M.clipShadows=R.clipShadows,M.clippingPlanes=R.clippingPlanes,M.clipIntersection=R.clipIntersection,M.displacementMap=R.displacementMap,M.displacementScale=R.displacementScale,M.displacementBias=R.displacementBias,M.wireframeLinewidth=R.wireframeLinewidth,M.linewidth=R.linewidth,P.isPointLight===!0&&M.isMeshDistanceMaterial===!0){let U=n.properties.get(M);U.light=P}return M}function g(S,R,P,b,M){if(S.visible===!1)return;if(S.layers.test(R.layers)&&(S.isMesh||S.isLine||S.isPoints)&&(S.castShadow||S.receiveShadow&&M===Es)&&(!S.frustumCulled||i.intersectsObject(S))){S.modelViewMatrix.multiplyMatrices(P.matrixWorldInverse,S.matrixWorld);let V=e.update(S),H=S.material;if(Array.isArray(H)){let k=V.groups;for(let z=0,ie=k.length;z<ie;z++){let $=k[z],te=H[$.materialIndex];if(te&&te.visible){let F=v(S,te,b,M);S.onBeforeShadow(n,S,R,P,V,F,$),n.renderBufferDirect(P,null,V,F,S,$),S.onAfterShadow(n,S,R,P,V,F,$)}}}else if(H.visible){let k=v(S,H,b,M);S.onBeforeShadow(n,S,R,P,V,k,null),n.renderBufferDirect(P,null,V,k,S,null),S.onAfterShadow(n,S,R,P,V,k,null)}}let U=S.children;for(let V=0,H=U.length;V<H;V++)g(U[V],R,P,b,M)}function _(S){S.target.removeEventListener("dispose",_);for(let P in h){let b=h[P],M=S.target.uuid;M in b&&(b[M].dispose(),delete b[M])}}}var bA={[ku]:zu,[Hu]:Wu,[Vu]:Xu,[go]:Gu,[zu]:ku,[Wu]:Hu,[Xu]:Vu,[Gu]:go};function MA(n,e){function t(){let B=!1,ce=new wt,me=null,Ne=new wt(0,0,0,0);return{setMask:function(ue){me!==ue&&!B&&(n.colorMask(ue,ue,ue,ue),me=ue)},setLocked:function(ue){B=ue},setClear:function(ue,se,Oe,je,Dt){Dt===!0&&(ue*=je,se*=je,Oe*=je),ce.set(ue,se,Oe,je),Ne.equals(ce)===!1&&(n.clearColor(ue,se,Oe,je),Ne.copy(ce))},reset:function(){B=!1,me=null,Ne.set(-1,0,0,0)}}}function i(){let B=!1,ce=!1,me=null,Ne=null,ue=null;return{setReversed:function(se){if(ce!==se){let Oe=e.get("EXT_clip_control");se?Oe.clipControlEXT(Oe.LOWER_LEFT_EXT,Oe.ZERO_TO_ONE_EXT):Oe.clipControlEXT(Oe.LOWER_LEFT_EXT,Oe.NEGATIVE_ONE_TO_ONE_EXT),ce=se;let je=ue;ue=null,this.setClear(je)}},getReversed:function(){return ce},setTest:function(se){se?j(n.DEPTH_TEST):he(n.DEPTH_TEST)},setMask:function(se){me!==se&&!B&&(n.depthMask(se),me=se)},setFunc:function(se){if(ce&&(se=bA[se]),Ne!==se){switch(se){case ku:n.depthFunc(n.NEVER);break;case zu:n.depthFunc(n.ALWAYS);break;case Hu:n.depthFunc(n.LESS);break;case go:n.depthFunc(n.LEQUAL);break;case Vu:n.depthFunc(n.EQUAL);break;case Gu:n.depthFunc(n.GEQUAL);break;case Wu:n.depthFunc(n.GREATER);break;case Xu:n.depthFunc(n.NOTEQUAL);break;default:n.depthFunc(n.LEQUAL)}Ne=se}},setLocked:function(se){B=se},setClear:function(se){ue!==se&&(ce&&(se=1-se),n.clearDepth(se),ue=se)},reset:function(){B=!1,me=null,Ne=null,ue=null,ce=!1}}}function s(){let B=!1,ce=null,me=null,Ne=null,ue=null,se=null,Oe=null,je=null,Dt=null;return{setTest:function(bt){B||(bt?j(n.STENCIL_TEST):he(n.STENCIL_TEST))},setMask:function(bt){ce!==bt&&!B&&(n.stencilMask(bt),ce=bt)},setFunc:function(bt,Ws,Ms){(me!==bt||Ne!==Ws||ue!==Ms)&&(n.stencilFunc(bt,Ws,Ms),me=bt,Ne=Ws,ue=Ms)},setOp:function(bt,Ws,Ms){(se!==bt||Oe!==Ws||je!==Ms)&&(n.stencilOp(bt,Ws,Ms),se=bt,Oe=Ws,je=Ms)},setLocked:function(bt){B=bt},setClear:function(bt){Dt!==bt&&(n.clearStencil(bt),Dt=bt)},reset:function(){B=!1,ce=null,me=null,Ne=null,ue=null,se=null,Oe=null,je=null,Dt=null}}}let r=new t,o=new i,a=new s,c=new WeakMap,h=new WeakMap,l={},d={},u=new WeakMap,f=[],x=null,y=!1,m=null,p=null,w=null,v=null,g=null,_=null,S=null,R=new Ee(0,0,0),P=0,b=!1,M=null,C=null,U=null,V=null,H=null,k=n.getParameter(n.MAX_COMBINED_TEXTURE_IMAGE_UNITS),z=!1,ie=0,$=n.getParameter(n.VERSION);$.indexOf("WebGL")!==-1?(ie=parseFloat(/^WebGL (\d)/.exec($)[1]),z=ie>=1):$.indexOf("OpenGL ES")!==-1&&(ie=parseFloat(/^OpenGL ES (\d)/.exec($)[1]),z=ie>=2);let te=null,F={},O=n.getParameter(n.SCISSOR_BOX),J=n.getParameter(n.VIEWPORT),q=new wt().fromArray(O),le=new wt().fromArray(J);function Se(B,ce,me,Ne){let ue=new Uint8Array(4),se=n.createTexture();n.bindTexture(B,se),n.texParameteri(B,n.TEXTURE_MIN_FILTER,n.NEAREST),n.texParameteri(B,n.TEXTURE_MAG_FILTER,n.NEAREST);for(let Oe=0;Oe<me;Oe++)B===n.TEXTURE_3D||B===n.TEXTURE_2D_ARRAY?n.texImage3D(ce,0,n.RGBA,1,1,Ne,0,n.RGBA,n.UNSIGNED_BYTE,ue):n.texImage2D(ce+Oe,0,n.RGBA,1,1,0,n.RGBA,n.UNSIGNED_BYTE,ue);return se}let Y={};Y[n.TEXTURE_2D]=Se(n.TEXTURE_2D,n.TEXTURE_2D,1),Y[n.TEXTURE_CUBE_MAP]=Se(n.TEXTURE_CUBE_MAP,n.TEXTURE_CUBE_MAP_POSITIVE_X,6),Y[n.TEXTURE_2D_ARRAY]=Se(n.TEXTURE_2D_ARRAY,n.TEXTURE_2D_ARRAY,1,1),Y[n.TEXTURE_3D]=Se(n.TEXTURE_3D,n.TEXTURE_3D,1,1),r.setClear(0,0,0,1),o.setClear(1),a.setClear(0),j(n.DEPTH_TEST),o.setFunc(go),Le(!1),Te(am),j(n.CULL_FACE),Ze(Rn);function j(B){l[B]!==!0&&(n.enable(B),l[B]=!0)}function he(B){l[B]!==!1&&(n.disable(B),l[B]=!1)}function De(B,ce){return d[B]!==ce?(n.bindFramebuffer(B,ce),d[B]=ce,B===n.DRAW_FRAMEBUFFER&&(d[n.FRAMEBUFFER]=ce),B===n.FRAMEBUFFER&&(d[n.DRAW_FRAMEBUFFER]=ce),!0):!1}function ve(B,ce){let me=f,Ne=!1;if(B){me=u.get(ce),me===void 0&&(me=[],u.set(ce,me));let ue=B.textures;if(me.length!==ue.length||me[0]!==n.COLOR_ATTACHMENT0){for(let se=0,Oe=ue.length;se<Oe;se++)me[se]=n.COLOR_ATTACHMENT0+se;me.length=ue.length,Ne=!0}}else me[0]!==n.BACK&&(me[0]=n.BACK,Ne=!0);Ne&&n.drawBuffers(me)}function ge(B){return x!==B?(n.useProgram(B),x=B,!0):!1}let ot={[Ji]:n.FUNC_ADD,[xx]:n.FUNC_SUBTRACT,[yx]:n.FUNC_REVERSE_SUBTRACT};ot[_x]=n.MIN,ot[vx]=n.MAX;let D={[Dc]:n.ZERO,[bx]:n.ONE,[Mx]:n.SRC_COLOR,[ou]:n.SRC_ALPHA,[Tx]:n.SRC_ALPHA_SATURATE,[Bu]:n.DST_COLOR,[Ou]:n.DST_ALPHA,[Sx]:n.ONE_MINUS_SRC_COLOR,[au]:n.ONE_MINUS_SRC_ALPHA,[Ax]:n.ONE_MINUS_DST_COLOR,[wx]:n.ONE_MINUS_DST_ALPHA,[Ex]:n.CONSTANT_COLOR,[Rx]:n.ONE_MINUS_CONSTANT_COLOR,[Cx]:n.CONSTANT_ALPHA,[Px]:n.ONE_MINUS_CONSTANT_ALPHA};function Ze(B,ce,me,Ne,ue,se,Oe,je,Dt,bt){if(B===Rn){y===!0&&(he(n.BLEND),y=!1);return}if(y===!1&&(j(n.BLEND),y=!0),B!==Fu){if(B!==m||bt!==b){if((p!==Ji||g!==Ji)&&(n.blendEquation(n.FUNC_ADD),p=Ji,g=Ji),bt)switch(B){case mo:n.blendFuncSeparate(n.ONE,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case Fr:n.blendFunc(n.ONE,n.ONE);break;case cm:n.blendFuncSeparate(n.ZERO,n.ONE_MINUS_SRC_COLOR,n.ZERO,n.ONE);break;case hm:n.blendFuncSeparate(n.DST_COLOR,n.ONE_MINUS_SRC_ALPHA,n.ZERO,n.ONE);break;default:console.error("THREE.WebGLState: Invalid blending: ",B);break}else switch(B){case mo:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case Fr:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE,n.ONE,n.ONE);break;case cm:console.error("THREE.WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case hm:console.error("THREE.WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:console.error("THREE.WebGLState: Invalid blending: ",B);break}w=null,v=null,_=null,S=null,R.set(0,0,0),P=0,m=B,b=bt}return}ue=ue||ce,se=se||me,Oe=Oe||Ne,(ce!==p||ue!==g)&&(n.blendEquationSeparate(ot[ce],ot[ue]),p=ce,g=ue),(me!==w||Ne!==v||se!==_||Oe!==S)&&(n.blendFuncSeparate(D[me],D[Ne],D[se],D[Oe]),w=me,v=Ne,_=se,S=Oe),(je.equals(R)===!1||Dt!==P)&&(n.blendColor(je.r,je.g,je.b,Dt),R.copy(je),P=Dt),m=B,b=!1}function Pe(B,ce){B.side===vi?he(n.CULL_FACE):j(n.CULL_FACE);let me=B.side===bn;ce&&(me=!me),Le(me),B.blending===mo&&B.transparent===!1?Ze(Rn):Ze(B.blending,B.blendEquation,B.blendSrc,B.blendDst,B.blendEquationAlpha,B.blendSrcAlpha,B.blendDstAlpha,B.blendColor,B.blendAlpha,B.premultipliedAlpha),o.setFunc(B.depthFunc),o.setTest(B.depthTest),o.setMask(B.depthWrite),r.setMask(B.colorWrite);let Ne=B.stencilWrite;a.setTest(Ne),Ne&&(a.setMask(B.stencilWriteMask),a.setFunc(B.stencilFunc,B.stencilRef,B.stencilFuncMask),a.setOp(B.stencilFail,B.stencilZFail,B.stencilZPass)),we(B.polygonOffset,B.polygonOffsetFactor,B.polygonOffsetUnits),B.alphaToCoverage===!0?j(n.SAMPLE_ALPHA_TO_COVERAGE):he(n.SAMPLE_ALPHA_TO_COVERAGE)}function Le(B){M!==B&&(B?n.frontFace(n.CW):n.frontFace(n.CCW),M=B)}function Te(B){B!==px?(j(n.CULL_FACE),B!==C&&(B===am?n.cullFace(n.BACK):B===mx?n.cullFace(n.FRONT):n.cullFace(n.FRONT_AND_BACK))):he(n.CULL_FACE),C=B}function _t(B){B!==U&&(z&&n.lineWidth(B),U=B)}function we(B,ce,me){B?(j(n.POLYGON_OFFSET_FILL),(V!==ce||H!==me)&&(n.polygonOffset(ce,me),V=ce,H=me)):he(n.POLYGON_OFFSET_FILL)}function Ge(B){B?j(n.SCISSOR_TEST):he(n.SCISSOR_TEST)}function en(B){B===void 0&&(B=n.TEXTURE0+k-1),te!==B&&(n.activeTexture(B),te=B)}function Ft(B,ce,me){me===void 0&&(te===null?me=n.TEXTURE0+k-1:me=te);let Ne=F[me];Ne===void 0&&(Ne={type:void 0,texture:void 0},F[me]=Ne),(Ne.type!==B||Ne.texture!==ce)&&(te!==me&&(n.activeTexture(me),te=me),n.bindTexture(B,ce||Y[B]),Ne.type=B,Ne.texture=ce)}function I(){let B=F[te];B!==void 0&&B.type!==void 0&&(n.bindTexture(B.type,null),B.type=void 0,B.texture=void 0)}function A(){try{n.compressedTexImage2D(...arguments)}catch(B){console.error("THREE.WebGLState:",B)}}function X(){try{n.compressedTexImage3D(...arguments)}catch(B){console.error("THREE.WebGLState:",B)}}function ee(){try{n.texSubImage2D(...arguments)}catch(B){console.error("THREE.WebGLState:",B)}}function oe(){try{n.texSubImage3D(...arguments)}catch(B){console.error("THREE.WebGLState:",B)}}function Q(){try{n.compressedTexSubImage2D(...arguments)}catch(B){console.error("THREE.WebGLState:",B)}}function Ue(){try{n.compressedTexSubImage3D(...arguments)}catch(B){console.error("THREE.WebGLState:",B)}}function pe(){try{n.texStorage2D(...arguments)}catch(B){console.error("THREE.WebGLState:",B)}}function Ie(){try{n.texStorage3D(...arguments)}catch(B){console.error("THREE.WebGLState:",B)}}function Be(){try{n.texImage2D(...arguments)}catch(B){console.error("THREE.WebGLState:",B)}}function de(){try{n.texImage3D(...arguments)}catch(B){console.error("THREE.WebGLState:",B)}}function be(B){q.equals(B)===!1&&(n.scissor(B.x,B.y,B.z,B.w),q.copy(B))}function We(B){le.equals(B)===!1&&(n.viewport(B.x,B.y,B.z,B.w),le.copy(B))}function ke(B,ce){let me=h.get(ce);me===void 0&&(me=new WeakMap,h.set(ce,me));let Ne=me.get(B);Ne===void 0&&(Ne=n.getUniformBlockIndex(ce,B.name),me.set(B,Ne))}function xe(B,ce){let Ne=h.get(ce).get(B);c.get(ce)!==Ne&&(n.uniformBlockBinding(ce,Ne,B.__bindingPointIndex),c.set(ce,Ne))}function $e(){n.disable(n.BLEND),n.disable(n.CULL_FACE),n.disable(n.DEPTH_TEST),n.disable(n.POLYGON_OFFSET_FILL),n.disable(n.SCISSOR_TEST),n.disable(n.STENCIL_TEST),n.disable(n.SAMPLE_ALPHA_TO_COVERAGE),n.blendEquation(n.FUNC_ADD),n.blendFunc(n.ONE,n.ZERO),n.blendFuncSeparate(n.ONE,n.ZERO,n.ONE,n.ZERO),n.blendColor(0,0,0,0),n.colorMask(!0,!0,!0,!0),n.clearColor(0,0,0,0),n.depthMask(!0),n.depthFunc(n.LESS),o.setReversed(!1),n.clearDepth(1),n.stencilMask(4294967295),n.stencilFunc(n.ALWAYS,0,4294967295),n.stencilOp(n.KEEP,n.KEEP,n.KEEP),n.clearStencil(0),n.cullFace(n.BACK),n.frontFace(n.CCW),n.polygonOffset(0,0),n.activeTexture(n.TEXTURE0),n.bindFramebuffer(n.FRAMEBUFFER,null),n.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),n.bindFramebuffer(n.READ_FRAMEBUFFER,null),n.useProgram(null),n.lineWidth(1),n.scissor(0,0,n.canvas.width,n.canvas.height),n.viewport(0,0,n.canvas.width,n.canvas.height),l={},te=null,F={},d={},u=new WeakMap,f=[],x=null,y=!1,m=null,p=null,w=null,v=null,g=null,_=null,S=null,R=new Ee(0,0,0),P=0,b=!1,M=null,C=null,U=null,V=null,H=null,q.set(0,0,n.canvas.width,n.canvas.height),le.set(0,0,n.canvas.width,n.canvas.height),r.reset(),o.reset(),a.reset()}return{buffers:{color:r,depth:o,stencil:a},enable:j,disable:he,bindFramebuffer:De,drawBuffers:ve,useProgram:ge,setBlending:Ze,setMaterial:Pe,setFlipSided:Le,setCullFace:Te,setLineWidth:_t,setPolygonOffset:we,setScissorTest:Ge,activeTexture:en,bindTexture:Ft,unbindTexture:I,compressedTexImage2D:A,compressedTexImage3D:X,texImage2D:Be,texImage3D:de,updateUBOMapping:ke,uniformBlockBinding:xe,texStorage2D:pe,texStorage3D:Ie,texSubImage2D:ee,texSubImage3D:oe,compressedTexSubImage2D:Q,compressedTexSubImage3D:Ue,scissor:be,viewport:We,reset:$e}}function SA(n,e,t,i,s,r,o){let a=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,c=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),h=new ae,l=new WeakMap,d,u=new WeakMap,f=!1;try{f=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function x(I,A){return f?new OffscreenCanvas(I,A):rc("canvas")}function y(I,A,X){let ee=1,oe=Ft(I);if((oe.width>X||oe.height>X)&&(ee=X/Math.max(oe.width,oe.height)),ee<1)if(typeof HTMLImageElement<"u"&&I instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&I instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&I instanceof ImageBitmap||typeof VideoFrame<"u"&&I instanceof VideoFrame){let Q=Math.floor(ee*oe.width),Ue=Math.floor(ee*oe.height);d===void 0&&(d=x(Q,Ue));let pe=A?x(Q,Ue):d;return pe.width=Q,pe.height=Ue,pe.getContext("2d").drawImage(I,0,0,Q,Ue),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+oe.width+"x"+oe.height+") to ("+Q+"x"+Ue+")."),pe}else return"data"in I&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+oe.width+"x"+oe.height+")."),I;return I}function m(I){return I.generateMipmaps}function p(I){n.generateMipmap(I)}function w(I){return I.isWebGLCubeRenderTarget?n.TEXTURE_CUBE_MAP:I.isWebGL3DRenderTarget?n.TEXTURE_3D:I.isWebGLArrayRenderTarget||I.isCompressedArrayTexture?n.TEXTURE_2D_ARRAY:n.TEXTURE_2D}function v(I,A,X,ee,oe=!1){if(I!==null){if(n[I]!==void 0)return n[I];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+I+"'")}let Q=A;if(A===n.RED&&(X===n.FLOAT&&(Q=n.R32F),X===n.HALF_FLOAT&&(Q=n.R16F),X===n.UNSIGNED_BYTE&&(Q=n.R8)),A===n.RED_INTEGER&&(X===n.UNSIGNED_BYTE&&(Q=n.R8UI),X===n.UNSIGNED_SHORT&&(Q=n.R16UI),X===n.UNSIGNED_INT&&(Q=n.R32UI),X===n.BYTE&&(Q=n.R8I),X===n.SHORT&&(Q=n.R16I),X===n.INT&&(Q=n.R32I)),A===n.RG&&(X===n.FLOAT&&(Q=n.RG32F),X===n.HALF_FLOAT&&(Q=n.RG16F),X===n.UNSIGNED_BYTE&&(Q=n.RG8)),A===n.RG_INTEGER&&(X===n.UNSIGNED_BYTE&&(Q=n.RG8UI),X===n.UNSIGNED_SHORT&&(Q=n.RG16UI),X===n.UNSIGNED_INT&&(Q=n.RG32UI),X===n.BYTE&&(Q=n.RG8I),X===n.SHORT&&(Q=n.RG16I),X===n.INT&&(Q=n.RG32I)),A===n.RGB_INTEGER&&(X===n.UNSIGNED_BYTE&&(Q=n.RGB8UI),X===n.UNSIGNED_SHORT&&(Q=n.RGB16UI),X===n.UNSIGNED_INT&&(Q=n.RGB32UI),X===n.BYTE&&(Q=n.RGB8I),X===n.SHORT&&(Q=n.RGB16I),X===n.INT&&(Q=n.RGB32I)),A===n.RGBA_INTEGER&&(X===n.UNSIGNED_BYTE&&(Q=n.RGBA8UI),X===n.UNSIGNED_SHORT&&(Q=n.RGBA16UI),X===n.UNSIGNED_INT&&(Q=n.RGBA32UI),X===n.BYTE&&(Q=n.RGBA8I),X===n.SHORT&&(Q=n.RGBA16I),X===n.INT&&(Q=n.RGBA32I)),A===n.RGB&&(X===n.UNSIGNED_INT_5_9_9_9_REV&&(Q=n.RGB9_E5),X===n.UNSIGNED_INT_10F_11F_11F_REV&&(Q=n.R11F_G11F_B10F)),A===n.RGBA){let Ue=oe?ic:lt.getTransfer(ee);X===n.FLOAT&&(Q=n.RGBA32F),X===n.HALF_FLOAT&&(Q=n.RGBA16F),X===n.UNSIGNED_BYTE&&(Q=Ue===vt?n.SRGB8_ALPHA8:n.RGBA8),X===n.UNSIGNED_SHORT_4_4_4_4&&(Q=n.RGBA4),X===n.UNSIGNED_SHORT_5_5_5_1&&(Q=n.RGB5_A1)}return(Q===n.R16F||Q===n.R32F||Q===n.RG16F||Q===n.RG32F||Q===n.RGBA16F||Q===n.RGBA32F)&&e.get("EXT_color_buffer_float"),Q}function g(I,A){let X;return I?A===null||A===Br||A===kr?X=n.DEPTH24_STENCIL8:A===bi?X=n.DEPTH32F_STENCIL8:A===Ka&&(X=n.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):A===null||A===Br||A===kr?X=n.DEPTH_COMPONENT24:A===bi?X=n.DEPTH_COMPONENT32F:A===Ka&&(X=n.DEPTH_COMPONENT16),X}function _(I,A){return m(I)===!0||I.isFramebufferTexture&&I.minFilter!==kn&&I.minFilter!==Qi?Math.log2(Math.max(A.width,A.height))+1:I.mipmaps!==void 0&&I.mipmaps.length>0?I.mipmaps.length:I.isCompressedTexture&&Array.isArray(I.image)?A.mipmaps.length:1}function S(I){let A=I.target;A.removeEventListener("dispose",S),P(A),A.isVideoTexture&&l.delete(A)}function R(I){let A=I.target;A.removeEventListener("dispose",R),M(A)}function P(I){let A=i.get(I);if(A.__webglInit===void 0)return;let X=I.source,ee=u.get(X);if(ee){let oe=ee[A.__cacheKey];oe.usedTimes--,oe.usedTimes===0&&b(I),Object.keys(ee).length===0&&u.delete(X)}i.remove(I)}function b(I){let A=i.get(I);n.deleteTexture(A.__webglTexture);let X=I.source,ee=u.get(X);delete ee[A.__cacheKey],o.memory.textures--}function M(I){let A=i.get(I);if(I.depthTexture&&(I.depthTexture.dispose(),i.remove(I.depthTexture)),I.isWebGLCubeRenderTarget)for(let ee=0;ee<6;ee++){if(Array.isArray(A.__webglFramebuffer[ee]))for(let oe=0;oe<A.__webglFramebuffer[ee].length;oe++)n.deleteFramebuffer(A.__webglFramebuffer[ee][oe]);else n.deleteFramebuffer(A.__webglFramebuffer[ee]);A.__webglDepthbuffer&&n.deleteRenderbuffer(A.__webglDepthbuffer[ee])}else{if(Array.isArray(A.__webglFramebuffer))for(let ee=0;ee<A.__webglFramebuffer.length;ee++)n.deleteFramebuffer(A.__webglFramebuffer[ee]);else n.deleteFramebuffer(A.__webglFramebuffer);if(A.__webglDepthbuffer&&n.deleteRenderbuffer(A.__webglDepthbuffer),A.__webglMultisampledFramebuffer&&n.deleteFramebuffer(A.__webglMultisampledFramebuffer),A.__webglColorRenderbuffer)for(let ee=0;ee<A.__webglColorRenderbuffer.length;ee++)A.__webglColorRenderbuffer[ee]&&n.deleteRenderbuffer(A.__webglColorRenderbuffer[ee]);A.__webglDepthRenderbuffer&&n.deleteRenderbuffer(A.__webglDepthRenderbuffer)}let X=I.textures;for(let ee=0,oe=X.length;ee<oe;ee++){let Q=i.get(X[ee]);Q.__webglTexture&&(n.deleteTexture(Q.__webglTexture),o.memory.textures--),i.remove(X[ee])}i.remove(I)}let C=0;function U(){C=0}function V(){let I=C;return I>=s.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+I+" texture units while this GPU supports only "+s.maxTextures),C+=1,I}function H(I){let A=[];return A.push(I.wrapS),A.push(I.wrapT),A.push(I.wrapR||0),A.push(I.magFilter),A.push(I.minFilter),A.push(I.anisotropy),A.push(I.internalFormat),A.push(I.format),A.push(I.type),A.push(I.generateMipmaps),A.push(I.premultiplyAlpha),A.push(I.flipY),A.push(I.unpackAlignment),A.push(I.colorSpace),A.join()}function k(I,A){let X=i.get(I);if(I.isVideoTexture&&Ge(I),I.isRenderTargetTexture===!1&&I.isExternalTexture!==!0&&I.version>0&&X.__version!==I.version){let ee=I.image;if(ee===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(ee.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{Y(X,I,A);return}}else I.isExternalTexture&&(X.__webglTexture=I.sourceTexture?I.sourceTexture:null);t.bindTexture(n.TEXTURE_2D,X.__webglTexture,n.TEXTURE0+A)}function z(I,A){let X=i.get(I);if(I.isRenderTargetTexture===!1&&I.version>0&&X.__version!==I.version){Y(X,I,A);return}t.bindTexture(n.TEXTURE_2D_ARRAY,X.__webglTexture,n.TEXTURE0+A)}function ie(I,A){let X=i.get(I);if(I.isRenderTargetTexture===!1&&I.version>0&&X.__version!==I.version){Y(X,I,A);return}t.bindTexture(n.TEXTURE_3D,X.__webglTexture,n.TEXTURE0+A)}function $(I,A){let X=i.get(I);if(I.version>0&&X.__version!==I.version){j(X,I,A);return}t.bindTexture(n.TEXTURE_CUBE_MAP,X.__webglTexture,n.TEXTURE0+A)}let te={[xo]:n.REPEAT,[Cr]:n.CLAMP_TO_EDGE,[lu]:n.MIRRORED_REPEAT},F={[kn]:n.NEAREST,[Dx]:n.NEAREST_MIPMAP_NEAREST,[Uc]:n.NEAREST_MIPMAP_LINEAR,[Qi]:n.LINEAR,[td]:n.LINEAR_MIPMAP_NEAREST,[Or]:n.LINEAR_MIPMAP_LINEAR},O={[Ox]:n.NEVER,[Gx]:n.ALWAYS,[Bx]:n.LESS,[_m]:n.LEQUAL,[kx]:n.EQUAL,[Vx]:n.GEQUAL,[zx]:n.GREATER,[Hx]:n.NOTEQUAL};function J(I,A){if(A.type===bi&&e.has("OES_texture_float_linear")===!1&&(A.magFilter===Qi||A.magFilter===td||A.magFilter===Uc||A.magFilter===Or||A.minFilter===Qi||A.minFilter===td||A.minFilter===Uc||A.minFilter===Or)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),n.texParameteri(I,n.TEXTURE_WRAP_S,te[A.wrapS]),n.texParameteri(I,n.TEXTURE_WRAP_T,te[A.wrapT]),(I===n.TEXTURE_3D||I===n.TEXTURE_2D_ARRAY)&&n.texParameteri(I,n.TEXTURE_WRAP_R,te[A.wrapR]),n.texParameteri(I,n.TEXTURE_MAG_FILTER,F[A.magFilter]),n.texParameteri(I,n.TEXTURE_MIN_FILTER,F[A.minFilter]),A.compareFunction&&(n.texParameteri(I,n.TEXTURE_COMPARE_MODE,n.COMPARE_REF_TO_TEXTURE),n.texParameteri(I,n.TEXTURE_COMPARE_FUNC,O[A.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(A.magFilter===kn||A.minFilter!==Uc&&A.minFilter!==Or||A.type===bi&&e.has("OES_texture_float_linear")===!1)return;if(A.anisotropy>1||i.get(A).__currentAnisotropy){let X=e.get("EXT_texture_filter_anisotropic");n.texParameterf(I,X.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(A.anisotropy,s.getMaxAnisotropy())),i.get(A).__currentAnisotropy=A.anisotropy}}}function q(I,A){let X=!1;I.__webglInit===void 0&&(I.__webglInit=!0,A.addEventListener("dispose",S));let ee=A.source,oe=u.get(ee);oe===void 0&&(oe={},u.set(ee,oe));let Q=H(A);if(Q!==I.__cacheKey){oe[Q]===void 0&&(oe[Q]={texture:n.createTexture(),usedTimes:0},o.memory.textures++,X=!0),oe[Q].usedTimes++;let Ue=oe[I.__cacheKey];Ue!==void 0&&(oe[I.__cacheKey].usedTimes--,Ue.usedTimes===0&&b(A)),I.__cacheKey=Q,I.__webglTexture=oe[Q].texture}return X}function le(I,A,X){return Math.floor(Math.floor(I/X)/A)}function Se(I,A,X,ee){let Q=I.updateRanges;if(Q.length===0)t.texSubImage2D(n.TEXTURE_2D,0,0,0,A.width,A.height,X,ee,A.data);else{Q.sort((de,be)=>de.start-be.start);let Ue=0;for(let de=1;de<Q.length;de++){let be=Q[Ue],We=Q[de],ke=be.start+be.count,xe=le(We.start,A.width,4),$e=le(be.start,A.width,4);We.start<=ke+1&&xe===$e&&le(We.start+We.count-1,A.width,4)===xe?be.count=Math.max(be.count,We.start+We.count-be.start):(++Ue,Q[Ue]=We)}Q.length=Ue+1;let pe=n.getParameter(n.UNPACK_ROW_LENGTH),Ie=n.getParameter(n.UNPACK_SKIP_PIXELS),Be=n.getParameter(n.UNPACK_SKIP_ROWS);n.pixelStorei(n.UNPACK_ROW_LENGTH,A.width);for(let de=0,be=Q.length;de<be;de++){let We=Q[de],ke=Math.floor(We.start/4),xe=Math.ceil(We.count/4),$e=ke%A.width,B=Math.floor(ke/A.width),ce=xe,me=1;n.pixelStorei(n.UNPACK_SKIP_PIXELS,$e),n.pixelStorei(n.UNPACK_SKIP_ROWS,B),t.texSubImage2D(n.TEXTURE_2D,0,$e,B,ce,me,X,ee,A.data)}I.clearUpdateRanges(),n.pixelStorei(n.UNPACK_ROW_LENGTH,pe),n.pixelStorei(n.UNPACK_SKIP_PIXELS,Ie),n.pixelStorei(n.UNPACK_SKIP_ROWS,Be)}}function Y(I,A,X){let ee=n.TEXTURE_2D;(A.isDataArrayTexture||A.isCompressedArrayTexture)&&(ee=n.TEXTURE_2D_ARRAY),A.isData3DTexture&&(ee=n.TEXTURE_3D);let oe=q(I,A),Q=A.source;t.bindTexture(ee,I.__webglTexture,n.TEXTURE0+X);let Ue=i.get(Q);if(Q.version!==Ue.__version||oe===!0){t.activeTexture(n.TEXTURE0+X);let pe=lt.getPrimaries(lt.workingColorSpace),Ie=A.colorSpace===er?null:lt.getPrimaries(A.colorSpace),Be=A.colorSpace===er||pe===Ie?n.NONE:n.BROWSER_DEFAULT_WEBGL;n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,A.flipY),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,A.premultiplyAlpha),n.pixelStorei(n.UNPACK_ALIGNMENT,A.unpackAlignment),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,Be);let de=y(A.image,!1,s.maxTextureSize);de=en(A,de);let be=r.convert(A.format,A.colorSpace),We=r.convert(A.type),ke=v(A.internalFormat,be,We,A.colorSpace,A.isVideoTexture);J(ee,A);let xe,$e=A.mipmaps,B=A.isVideoTexture!==!0,ce=Ue.__version===void 0||oe===!0,me=Q.dataReady,Ne=_(A,de);if(A.isDepthTexture)ke=g(A.format===zr,A.type),ce&&(B?t.texStorage2D(n.TEXTURE_2D,1,ke,de.width,de.height):t.texImage2D(n.TEXTURE_2D,0,ke,de.width,de.height,0,be,We,null));else if(A.isDataTexture)if($e.length>0){B&&ce&&t.texStorage2D(n.TEXTURE_2D,Ne,ke,$e[0].width,$e[0].height);for(let ue=0,se=$e.length;ue<se;ue++)xe=$e[ue],B?me&&t.texSubImage2D(n.TEXTURE_2D,ue,0,0,xe.width,xe.height,be,We,xe.data):t.texImage2D(n.TEXTURE_2D,ue,ke,xe.width,xe.height,0,be,We,xe.data);A.generateMipmaps=!1}else B?(ce&&t.texStorage2D(n.TEXTURE_2D,Ne,ke,de.width,de.height),me&&Se(A,de,be,We)):t.texImage2D(n.TEXTURE_2D,0,ke,de.width,de.height,0,be,We,de.data);else if(A.isCompressedTexture)if(A.isCompressedArrayTexture){B&&ce&&t.texStorage3D(n.TEXTURE_2D_ARRAY,Ne,ke,$e[0].width,$e[0].height,de.depth);for(let ue=0,se=$e.length;ue<se;ue++)if(xe=$e[ue],A.format!==Li)if(be!==null)if(B){if(me)if(A.layerUpdates.size>0){let Oe=Em(xe.width,xe.height,A.format,A.type);for(let je of A.layerUpdates){let Dt=xe.data.subarray(je*Oe/xe.data.BYTES_PER_ELEMENT,(je+1)*Oe/xe.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,ue,0,0,je,xe.width,xe.height,1,be,Dt)}A.clearLayerUpdates()}else t.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,ue,0,0,0,xe.width,xe.height,de.depth,be,xe.data)}else t.compressedTexImage3D(n.TEXTURE_2D_ARRAY,ue,ke,xe.width,xe.height,de.depth,0,xe.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else B?me&&t.texSubImage3D(n.TEXTURE_2D_ARRAY,ue,0,0,0,xe.width,xe.height,de.depth,be,We,xe.data):t.texImage3D(n.TEXTURE_2D_ARRAY,ue,ke,xe.width,xe.height,de.depth,0,be,We,xe.data)}else{B&&ce&&t.texStorage2D(n.TEXTURE_2D,Ne,ke,$e[0].width,$e[0].height);for(let ue=0,se=$e.length;ue<se;ue++)xe=$e[ue],A.format!==Li?be!==null?B?me&&t.compressedTexSubImage2D(n.TEXTURE_2D,ue,0,0,xe.width,xe.height,be,xe.data):t.compressedTexImage2D(n.TEXTURE_2D,ue,ke,xe.width,xe.height,0,xe.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):B?me&&t.texSubImage2D(n.TEXTURE_2D,ue,0,0,xe.width,xe.height,be,We,xe.data):t.texImage2D(n.TEXTURE_2D,ue,ke,xe.width,xe.height,0,be,We,xe.data)}else if(A.isDataArrayTexture)if(B){if(ce&&t.texStorage3D(n.TEXTURE_2D_ARRAY,Ne,ke,de.width,de.height,de.depth),me)if(A.layerUpdates.size>0){let ue=Em(de.width,de.height,A.format,A.type);for(let se of A.layerUpdates){let Oe=de.data.subarray(se*ue/de.data.BYTES_PER_ELEMENT,(se+1)*ue/de.data.BYTES_PER_ELEMENT);t.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,se,de.width,de.height,1,be,We,Oe)}A.clearLayerUpdates()}else t.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,0,de.width,de.height,de.depth,be,We,de.data)}else t.texImage3D(n.TEXTURE_2D_ARRAY,0,ke,de.width,de.height,de.depth,0,be,We,de.data);else if(A.isData3DTexture)B?(ce&&t.texStorage3D(n.TEXTURE_3D,Ne,ke,de.width,de.height,de.depth),me&&t.texSubImage3D(n.TEXTURE_3D,0,0,0,0,de.width,de.height,de.depth,be,We,de.data)):t.texImage3D(n.TEXTURE_3D,0,ke,de.width,de.height,de.depth,0,be,We,de.data);else if(A.isFramebufferTexture){if(ce)if(B)t.texStorage2D(n.TEXTURE_2D,Ne,ke,de.width,de.height);else{let ue=de.width,se=de.height;for(let Oe=0;Oe<Ne;Oe++)t.texImage2D(n.TEXTURE_2D,Oe,ke,ue,se,0,be,We,null),ue>>=1,se>>=1}}else if($e.length>0){if(B&&ce){let ue=Ft($e[0]);t.texStorage2D(n.TEXTURE_2D,Ne,ke,ue.width,ue.height)}for(let ue=0,se=$e.length;ue<se;ue++)xe=$e[ue],B?me&&t.texSubImage2D(n.TEXTURE_2D,ue,0,0,be,We,xe):t.texImage2D(n.TEXTURE_2D,ue,ke,be,We,xe);A.generateMipmaps=!1}else if(B){if(ce){let ue=Ft(de);t.texStorage2D(n.TEXTURE_2D,Ne,ke,ue.width,ue.height)}me&&t.texSubImage2D(n.TEXTURE_2D,0,0,0,be,We,de)}else t.texImage2D(n.TEXTURE_2D,0,ke,be,We,de);m(A)&&p(ee),Ue.__version=Q.version,A.onUpdate&&A.onUpdate(A)}I.__version=A.version}function j(I,A,X){if(A.image.length!==6)return;let ee=q(I,A),oe=A.source;t.bindTexture(n.TEXTURE_CUBE_MAP,I.__webglTexture,n.TEXTURE0+X);let Q=i.get(oe);if(oe.version!==Q.__version||ee===!0){t.activeTexture(n.TEXTURE0+X);let Ue=lt.getPrimaries(lt.workingColorSpace),pe=A.colorSpace===er?null:lt.getPrimaries(A.colorSpace),Ie=A.colorSpace===er||Ue===pe?n.NONE:n.BROWSER_DEFAULT_WEBGL;n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,A.flipY),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,A.premultiplyAlpha),n.pixelStorei(n.UNPACK_ALIGNMENT,A.unpackAlignment),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,Ie);let Be=A.isCompressedTexture||A.image[0].isCompressedTexture,de=A.image[0]&&A.image[0].isDataTexture,be=[];for(let se=0;se<6;se++)!Be&&!de?be[se]=y(A.image[se],!0,s.maxCubemapSize):be[se]=de?A.image[se].image:A.image[se],be[se]=en(A,be[se]);let We=be[0],ke=r.convert(A.format,A.colorSpace),xe=r.convert(A.type),$e=v(A.internalFormat,ke,xe,A.colorSpace),B=A.isVideoTexture!==!0,ce=Q.__version===void 0||ee===!0,me=oe.dataReady,Ne=_(A,We);J(n.TEXTURE_CUBE_MAP,A);let ue;if(Be){B&&ce&&t.texStorage2D(n.TEXTURE_CUBE_MAP,Ne,$e,We.width,We.height);for(let se=0;se<6;se++){ue=be[se].mipmaps;for(let Oe=0;Oe<ue.length;Oe++){let je=ue[Oe];A.format!==Li?ke!==null?B?me&&t.compressedTexSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+se,Oe,0,0,je.width,je.height,ke,je.data):t.compressedTexImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+se,Oe,$e,je.width,je.height,0,je.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):B?me&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+se,Oe,0,0,je.width,je.height,ke,xe,je.data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+se,Oe,$e,je.width,je.height,0,ke,xe,je.data)}}}else{if(ue=A.mipmaps,B&&ce){ue.length>0&&Ne++;let se=Ft(be[0]);t.texStorage2D(n.TEXTURE_CUBE_MAP,Ne,$e,se.width,se.height)}for(let se=0;se<6;se++)if(de){B?me&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+se,0,0,0,be[se].width,be[se].height,ke,xe,be[se].data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+se,0,$e,be[se].width,be[se].height,0,ke,xe,be[se].data);for(let Oe=0;Oe<ue.length;Oe++){let Dt=ue[Oe].image[se].image;B?me&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+se,Oe+1,0,0,Dt.width,Dt.height,ke,xe,Dt.data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+se,Oe+1,$e,Dt.width,Dt.height,0,ke,xe,Dt.data)}}else{B?me&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+se,0,0,0,ke,xe,be[se]):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+se,0,$e,ke,xe,be[se]);for(let Oe=0;Oe<ue.length;Oe++){let je=ue[Oe];B?me&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+se,Oe+1,0,0,ke,xe,je.image[se]):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+se,Oe+1,$e,ke,xe,je.image[se])}}}m(A)&&p(n.TEXTURE_CUBE_MAP),Q.__version=oe.version,A.onUpdate&&A.onUpdate(A)}I.__version=A.version}function he(I,A,X,ee,oe,Q){let Ue=r.convert(X.format,X.colorSpace),pe=r.convert(X.type),Ie=v(X.internalFormat,Ue,pe,X.colorSpace),Be=i.get(A),de=i.get(X);if(de.__renderTarget=A,!Be.__hasExternalTextures){let be=Math.max(1,A.width>>Q),We=Math.max(1,A.height>>Q);oe===n.TEXTURE_3D||oe===n.TEXTURE_2D_ARRAY?t.texImage3D(oe,Q,Ie,be,We,A.depth,0,Ue,pe,null):t.texImage2D(oe,Q,Ie,be,We,0,Ue,pe,null)}t.bindFramebuffer(n.FRAMEBUFFER,I),we(A)?a.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,ee,oe,de.__webglTexture,0,_t(A)):(oe===n.TEXTURE_2D||oe>=n.TEXTURE_CUBE_MAP_POSITIVE_X&&oe<=n.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&n.framebufferTexture2D(n.FRAMEBUFFER,ee,oe,de.__webglTexture,Q),t.bindFramebuffer(n.FRAMEBUFFER,null)}function De(I,A,X){if(n.bindRenderbuffer(n.RENDERBUFFER,I),A.depthBuffer){let ee=A.depthTexture,oe=ee&&ee.isDepthTexture?ee.type:null,Q=g(A.stencilBuffer,oe),Ue=A.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,pe=_t(A);we(A)?a.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,pe,Q,A.width,A.height):X?n.renderbufferStorageMultisample(n.RENDERBUFFER,pe,Q,A.width,A.height):n.renderbufferStorage(n.RENDERBUFFER,Q,A.width,A.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,Ue,n.RENDERBUFFER,I)}else{let ee=A.textures;for(let oe=0;oe<ee.length;oe++){let Q=ee[oe],Ue=r.convert(Q.format,Q.colorSpace),pe=r.convert(Q.type),Ie=v(Q.internalFormat,Ue,pe,Q.colorSpace),Be=_t(A);X&&we(A)===!1?n.renderbufferStorageMultisample(n.RENDERBUFFER,Be,Ie,A.width,A.height):we(A)?a.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,Be,Ie,A.width,A.height):n.renderbufferStorage(n.RENDERBUFFER,Ie,A.width,A.height)}}n.bindRenderbuffer(n.RENDERBUFFER,null)}function ve(I,A){if(A&&A.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(t.bindFramebuffer(n.FRAMEBUFFER,I),!(A.depthTexture&&A.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");let ee=i.get(A.depthTexture);ee.__renderTarget=A,(!ee.__webglTexture||A.depthTexture.image.width!==A.width||A.depthTexture.image.height!==A.height)&&(A.depthTexture.image.width=A.width,A.depthTexture.image.height=A.height,A.depthTexture.needsUpdate=!0),k(A.depthTexture,0);let oe=ee.__webglTexture,Q=_t(A);if(A.depthTexture.format===Ua)we(A)?a.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,n.DEPTH_ATTACHMENT,n.TEXTURE_2D,oe,0,Q):n.framebufferTexture2D(n.FRAMEBUFFER,n.DEPTH_ATTACHMENT,n.TEXTURE_2D,oe,0);else if(A.depthTexture.format===zr)we(A)?a.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,n.DEPTH_STENCIL_ATTACHMENT,n.TEXTURE_2D,oe,0,Q):n.framebufferTexture2D(n.FRAMEBUFFER,n.DEPTH_STENCIL_ATTACHMENT,n.TEXTURE_2D,oe,0);else throw new Error("Unknown depthTexture format")}function ge(I){let A=i.get(I),X=I.isWebGLCubeRenderTarget===!0;if(A.__boundDepthTexture!==I.depthTexture){let ee=I.depthTexture;if(A.__depthDisposeCallback&&A.__depthDisposeCallback(),ee){let oe=()=>{delete A.__boundDepthTexture,delete A.__depthDisposeCallback,ee.removeEventListener("dispose",oe)};ee.addEventListener("dispose",oe),A.__depthDisposeCallback=oe}A.__boundDepthTexture=ee}if(I.depthTexture&&!A.__autoAllocateDepthBuffer){if(X)throw new Error("target.depthTexture not supported in Cube render targets");let ee=I.texture.mipmaps;ee&&ee.length>0?ve(A.__webglFramebuffer[0],I):ve(A.__webglFramebuffer,I)}else if(X){A.__webglDepthbuffer=[];for(let ee=0;ee<6;ee++)if(t.bindFramebuffer(n.FRAMEBUFFER,A.__webglFramebuffer[ee]),A.__webglDepthbuffer[ee]===void 0)A.__webglDepthbuffer[ee]=n.createRenderbuffer(),De(A.__webglDepthbuffer[ee],I,!1);else{let oe=I.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,Q=A.__webglDepthbuffer[ee];n.bindRenderbuffer(n.RENDERBUFFER,Q),n.framebufferRenderbuffer(n.FRAMEBUFFER,oe,n.RENDERBUFFER,Q)}}else{let ee=I.texture.mipmaps;if(ee&&ee.length>0?t.bindFramebuffer(n.FRAMEBUFFER,A.__webglFramebuffer[0]):t.bindFramebuffer(n.FRAMEBUFFER,A.__webglFramebuffer),A.__webglDepthbuffer===void 0)A.__webglDepthbuffer=n.createRenderbuffer(),De(A.__webglDepthbuffer,I,!1);else{let oe=I.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,Q=A.__webglDepthbuffer;n.bindRenderbuffer(n.RENDERBUFFER,Q),n.framebufferRenderbuffer(n.FRAMEBUFFER,oe,n.RENDERBUFFER,Q)}}t.bindFramebuffer(n.FRAMEBUFFER,null)}function ot(I,A,X){let ee=i.get(I);A!==void 0&&he(ee.__webglFramebuffer,I,I.texture,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,0),X!==void 0&&ge(I)}function D(I){let A=I.texture,X=i.get(I),ee=i.get(A);I.addEventListener("dispose",R);let oe=I.textures,Q=I.isWebGLCubeRenderTarget===!0,Ue=oe.length>1;if(Ue||(ee.__webglTexture===void 0&&(ee.__webglTexture=n.createTexture()),ee.__version=A.version,o.memory.textures++),Q){X.__webglFramebuffer=[];for(let pe=0;pe<6;pe++)if(A.mipmaps&&A.mipmaps.length>0){X.__webglFramebuffer[pe]=[];for(let Ie=0;Ie<A.mipmaps.length;Ie++)X.__webglFramebuffer[pe][Ie]=n.createFramebuffer()}else X.__webglFramebuffer[pe]=n.createFramebuffer()}else{if(A.mipmaps&&A.mipmaps.length>0){X.__webglFramebuffer=[];for(let pe=0;pe<A.mipmaps.length;pe++)X.__webglFramebuffer[pe]=n.createFramebuffer()}else X.__webglFramebuffer=n.createFramebuffer();if(Ue)for(let pe=0,Ie=oe.length;pe<Ie;pe++){let Be=i.get(oe[pe]);Be.__webglTexture===void 0&&(Be.__webglTexture=n.createTexture(),o.memory.textures++)}if(I.samples>0&&we(I)===!1){X.__webglMultisampledFramebuffer=n.createFramebuffer(),X.__webglColorRenderbuffer=[],t.bindFramebuffer(n.FRAMEBUFFER,X.__webglMultisampledFramebuffer);for(let pe=0;pe<oe.length;pe++){let Ie=oe[pe];X.__webglColorRenderbuffer[pe]=n.createRenderbuffer(),n.bindRenderbuffer(n.RENDERBUFFER,X.__webglColorRenderbuffer[pe]);let Be=r.convert(Ie.format,Ie.colorSpace),de=r.convert(Ie.type),be=v(Ie.internalFormat,Be,de,Ie.colorSpace,I.isXRRenderTarget===!0),We=_t(I);n.renderbufferStorageMultisample(n.RENDERBUFFER,We,be,I.width,I.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+pe,n.RENDERBUFFER,X.__webglColorRenderbuffer[pe])}n.bindRenderbuffer(n.RENDERBUFFER,null),I.depthBuffer&&(X.__webglDepthRenderbuffer=n.createRenderbuffer(),De(X.__webglDepthRenderbuffer,I,!0)),t.bindFramebuffer(n.FRAMEBUFFER,null)}}if(Q){t.bindTexture(n.TEXTURE_CUBE_MAP,ee.__webglTexture),J(n.TEXTURE_CUBE_MAP,A);for(let pe=0;pe<6;pe++)if(A.mipmaps&&A.mipmaps.length>0)for(let Ie=0;Ie<A.mipmaps.length;Ie++)he(X.__webglFramebuffer[pe][Ie],I,A,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+pe,Ie);else he(X.__webglFramebuffer[pe],I,A,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+pe,0);m(A)&&p(n.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(Ue){for(let pe=0,Ie=oe.length;pe<Ie;pe++){let Be=oe[pe],de=i.get(Be),be=n.TEXTURE_2D;(I.isWebGL3DRenderTarget||I.isWebGLArrayRenderTarget)&&(be=I.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY),t.bindTexture(be,de.__webglTexture),J(be,Be),he(X.__webglFramebuffer,I,Be,n.COLOR_ATTACHMENT0+pe,be,0),m(Be)&&p(be)}t.unbindTexture()}else{let pe=n.TEXTURE_2D;if((I.isWebGL3DRenderTarget||I.isWebGLArrayRenderTarget)&&(pe=I.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY),t.bindTexture(pe,ee.__webglTexture),J(pe,A),A.mipmaps&&A.mipmaps.length>0)for(let Ie=0;Ie<A.mipmaps.length;Ie++)he(X.__webglFramebuffer[Ie],I,A,n.COLOR_ATTACHMENT0,pe,Ie);else he(X.__webglFramebuffer,I,A,n.COLOR_ATTACHMENT0,pe,0);m(A)&&p(pe),t.unbindTexture()}I.depthBuffer&&ge(I)}function Ze(I){let A=I.textures;for(let X=0,ee=A.length;X<ee;X++){let oe=A[X];if(m(oe)){let Q=w(I),Ue=i.get(oe).__webglTexture;t.bindTexture(Q,Ue),p(Q),t.unbindTexture()}}}let Pe=[],Le=[];function Te(I){if(I.samples>0){if(we(I)===!1){let A=I.textures,X=I.width,ee=I.height,oe=n.COLOR_BUFFER_BIT,Q=I.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,Ue=i.get(I),pe=A.length>1;if(pe)for(let Be=0;Be<A.length;Be++)t.bindFramebuffer(n.FRAMEBUFFER,Ue.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+Be,n.RENDERBUFFER,null),t.bindFramebuffer(n.FRAMEBUFFER,Ue.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+Be,n.TEXTURE_2D,null,0);t.bindFramebuffer(n.READ_FRAMEBUFFER,Ue.__webglMultisampledFramebuffer);let Ie=I.texture.mipmaps;Ie&&Ie.length>0?t.bindFramebuffer(n.DRAW_FRAMEBUFFER,Ue.__webglFramebuffer[0]):t.bindFramebuffer(n.DRAW_FRAMEBUFFER,Ue.__webglFramebuffer);for(let Be=0;Be<A.length;Be++){if(I.resolveDepthBuffer&&(I.depthBuffer&&(oe|=n.DEPTH_BUFFER_BIT),I.stencilBuffer&&I.resolveStencilBuffer&&(oe|=n.STENCIL_BUFFER_BIT)),pe){n.framebufferRenderbuffer(n.READ_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.RENDERBUFFER,Ue.__webglColorRenderbuffer[Be]);let de=i.get(A[Be]).__webglTexture;n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,de,0)}n.blitFramebuffer(0,0,X,ee,0,0,X,ee,oe,n.NEAREST),c===!0&&(Pe.length=0,Le.length=0,Pe.push(n.COLOR_ATTACHMENT0+Be),I.depthBuffer&&I.resolveDepthBuffer===!1&&(Pe.push(Q),Le.push(Q),n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,Le)),n.invalidateFramebuffer(n.READ_FRAMEBUFFER,Pe))}if(t.bindFramebuffer(n.READ_FRAMEBUFFER,null),t.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),pe)for(let Be=0;Be<A.length;Be++){t.bindFramebuffer(n.FRAMEBUFFER,Ue.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+Be,n.RENDERBUFFER,Ue.__webglColorRenderbuffer[Be]);let de=i.get(A[Be]).__webglTexture;t.bindFramebuffer(n.FRAMEBUFFER,Ue.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+Be,n.TEXTURE_2D,de,0)}t.bindFramebuffer(n.DRAW_FRAMEBUFFER,Ue.__webglMultisampledFramebuffer)}else if(I.depthBuffer&&I.resolveDepthBuffer===!1&&c){let A=I.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,[A])}}}function _t(I){return Math.min(s.maxSamples,I.samples)}function we(I){let A=i.get(I);return I.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&A.__useRenderToTexture!==!1}function Ge(I){let A=o.render.frame;l.get(I)!==A&&(l.set(I,A),I.update())}function en(I,A){let X=I.colorSpace,ee=I.format,oe=I.type;return I.isCompressedTexture===!0||I.isVideoTexture===!0||X!==yo&&X!==er&&(lt.getTransfer(X)===vt?(ee!==Li||oe!==is)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",X)),A}function Ft(I){return typeof HTMLImageElement<"u"&&I instanceof HTMLImageElement?(h.width=I.naturalWidth||I.width,h.height=I.naturalHeight||I.height):typeof VideoFrame<"u"&&I instanceof VideoFrame?(h.width=I.displayWidth,h.height=I.displayHeight):(h.width=I.width,h.height=I.height),h}this.allocateTextureUnit=V,this.resetTextureUnits=U,this.setTexture2D=k,this.setTexture2DArray=z,this.setTexture3D=ie,this.setTextureCube=$,this.rebindTextures=ot,this.setupRenderTarget=D,this.updateRenderTargetMipmap=Ze,this.updateMultisampleRenderTarget=Te,this.setupDepthRenderbuffer=ge,this.setupFrameBufferTexture=he,this.useMultisampledRTT=we}function wA(n,e){function t(i,s=er){let r,o=lt.getTransfer(s);if(i===is)return n.UNSIGNED_BYTE;if(i===id)return n.UNSIGNED_SHORT_4_4_4_4;if(i===sd)return n.UNSIGNED_SHORT_5_5_5_1;if(i===pm)return n.UNSIGNED_INT_5_9_9_9_REV;if(i===mm)return n.UNSIGNED_INT_10F_11F_11F_REV;if(i===dm)return n.BYTE;if(i===fm)return n.SHORT;if(i===Ka)return n.UNSIGNED_SHORT;if(i===nd)return n.INT;if(i===Br)return n.UNSIGNED_INT;if(i===bi)return n.FLOAT;if(i===zn)return n.HALF_FLOAT;if(i===gm)return n.ALPHA;if(i===xm)return n.RGB;if(i===Li)return n.RGBA;if(i===Ua)return n.DEPTH_COMPONENT;if(i===zr)return n.DEPTH_STENCIL;if(i===ja)return n.RED;if(i===rd)return n.RED_INTEGER;if(i===ym)return n.RG;if(i===od)return n.RG_INTEGER;if(i===ad)return n.RGBA_INTEGER;if(i===Fc||i===Oc||i===Bc||i===kc)if(o===vt)if(r=e.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(i===Fc)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(i===Oc)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(i===Bc)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(i===kc)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=e.get("WEBGL_compressed_texture_s3tc"),r!==null){if(i===Fc)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(i===Oc)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(i===Bc)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(i===kc)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(i===ld||i===cd||i===hd||i===ud)if(r=e.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(i===ld)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(i===cd)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(i===hd)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(i===ud)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(i===dd||i===fd||i===pd)if(r=e.get("WEBGL_compressed_texture_etc"),r!==null){if(i===dd||i===fd)return o===vt?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(i===pd)return o===vt?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(i===md||i===gd||i===xd||i===yd||i===_d||i===vd||i===bd||i===Md||i===Sd||i===wd||i===Ad||i===Td||i===Ed||i===Rd)if(r=e.get("WEBGL_compressed_texture_astc"),r!==null){if(i===md)return o===vt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(i===gd)return o===vt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(i===xd)return o===vt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(i===yd)return o===vt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(i===_d)return o===vt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(i===vd)return o===vt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(i===bd)return o===vt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(i===Md)return o===vt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(i===Sd)return o===vt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(i===wd)return o===vt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(i===Ad)return o===vt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(i===Td)return o===vt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(i===Ed)return o===vt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(i===Rd)return o===vt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(i===Cd||i===Pd||i===Id)if(r=e.get("EXT_texture_compression_bptc"),r!==null){if(i===Cd)return o===vt?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(i===Pd)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(i===Id)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(i===Nd||i===Dd||i===Ld||i===Ud)if(r=e.get("EXT_texture_compression_rgtc"),r!==null){if(i===Nd)return r.COMPRESSED_RED_RGTC1_EXT;if(i===Dd)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(i===Ld)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(i===Ud)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return i===kr?n.UNSIGNED_INT_24_8:n[i]!==void 0?n[i]:null}return{convert:t}}var AA=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,TA=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`,zm=class{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){let i=new mc(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=i}}getMesh(e){if(this.texture!==null&&this.mesh===null){let t=e.cameras[0].viewport,i=new Pt({vertexShader:AA,fragmentShader:TA,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new nt(new vc(20,20),i)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}},Hm=class extends Ss{constructor(e,t){super();let i=this,s=null,r=1,o=null,a="local-floor",c=1,h=null,l=null,d=null,u=null,f=null,x=null,y=typeof XRWebGLBinding<"u",m=new zm,p={},w=t.getContextAttributes(),v=null,g=null,_=[],S=[],R=new ae,P=null,b=new Bn;b.viewport=new wt;let M=new Bn;M.viewport=new wt;let C=[b,M],U=new Uu,V=null,H=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(Y){let j=_[Y];return j===void 0&&(j=new za,_[Y]=j),j.getTargetRaySpace()},this.getControllerGrip=function(Y){let j=_[Y];return j===void 0&&(j=new za,_[Y]=j),j.getGripSpace()},this.getHand=function(Y){let j=_[Y];return j===void 0&&(j=new za,_[Y]=j),j.getHandSpace()};function k(Y){let j=S.indexOf(Y.inputSource);if(j===-1)return;let he=_[j];he!==void 0&&(he.update(Y.inputSource,Y.frame,h||o),he.dispatchEvent({type:Y.type,data:Y.inputSource}))}function z(){s.removeEventListener("select",k),s.removeEventListener("selectstart",k),s.removeEventListener("selectend",k),s.removeEventListener("squeeze",k),s.removeEventListener("squeezestart",k),s.removeEventListener("squeezeend",k),s.removeEventListener("end",z),s.removeEventListener("inputsourceschange",ie);for(let Y=0;Y<_.length;Y++){let j=S[Y];j!==null&&(S[Y]=null,_[Y].disconnect(j))}V=null,H=null,m.reset();for(let Y in p)delete p[Y];e.setRenderTarget(v),f=null,u=null,d=null,s=null,g=null,Se.stop(),i.isPresenting=!1,e.setPixelRatio(P),e.setSize(R.width,R.height,!1),i.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(Y){r=Y,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(Y){a=Y,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return h||o},this.setReferenceSpace=function(Y){h=Y},this.getBaseLayer=function(){return u!==null?u:f},this.getBinding=function(){return d===null&&y&&(d=new XRWebGLBinding(s,t)),d},this.getFrame=function(){return x},this.getSession=function(){return s},this.setSession=async function(Y){if(s=Y,s!==null){if(v=e.getRenderTarget(),s.addEventListener("select",k),s.addEventListener("selectstart",k),s.addEventListener("selectend",k),s.addEventListener("squeeze",k),s.addEventListener("squeezestart",k),s.addEventListener("squeezeend",k),s.addEventListener("end",z),s.addEventListener("inputsourceschange",ie),w.xrCompatible!==!0&&await t.makeXRCompatible(),P=e.getPixelRatio(),e.getSize(R),y&&"createProjectionLayer"in XRWebGLBinding.prototype){let he=null,De=null,ve=null;w.depth&&(ve=w.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,he=w.stencil?zr:Ua,De=w.stencil?kr:Br);let ge={colorFormat:t.RGBA8,depthFormat:ve,scaleFactor:r};d=this.getBinding(),u=d.createProjectionLayer(ge),s.updateRenderState({layers:[u]}),e.setPixelRatio(1),e.setSize(u.textureWidth,u.textureHeight,!1),g=new ln(u.textureWidth,u.textureHeight,{format:Li,type:is,depthTexture:new bo(u.textureWidth,u.textureHeight,De,void 0,void 0,void 0,void 0,void 0,void 0,he),stencilBuffer:w.stencil,colorSpace:e.outputColorSpace,samples:w.antialias?4:0,resolveDepthBuffer:u.ignoreDepthValues===!1,resolveStencilBuffer:u.ignoreDepthValues===!1})}else{let he={antialias:w.antialias,alpha:!0,depth:w.depth,stencil:w.stencil,framebufferScaleFactor:r};f=new XRWebGLLayer(s,t,he),s.updateRenderState({baseLayer:f}),e.setPixelRatio(1),e.setSize(f.framebufferWidth,f.framebufferHeight,!1),g=new ln(f.framebufferWidth,f.framebufferHeight,{format:Li,type:is,colorSpace:e.outputColorSpace,stencilBuffer:w.stencil,resolveDepthBuffer:f.ignoreDepthValues===!1,resolveStencilBuffer:f.ignoreDepthValues===!1})}g.isXRRenderTarget=!0,this.setFoveation(c),h=null,o=await s.requestReferenceSpace(a),Se.setContext(s),Se.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return m.getDepthTexture()};function ie(Y){for(let j=0;j<Y.removed.length;j++){let he=Y.removed[j],De=S.indexOf(he);De>=0&&(S[De]=null,_[De].disconnect(he))}for(let j=0;j<Y.added.length;j++){let he=Y.added[j],De=S.indexOf(he);if(De===-1){for(let ge=0;ge<_.length;ge++)if(ge>=S.length){S.push(he),De=ge;break}else if(S[ge]===null){S[ge]=he,De=ge;break}if(De===-1)break}let ve=_[De];ve&&ve.connect(he)}}let $=new L,te=new L;function F(Y,j,he){$.setFromMatrixPosition(j.matrixWorld),te.setFromMatrixPosition(he.matrixWorld);let De=$.distanceTo(te),ve=j.projectionMatrix.elements,ge=he.projectionMatrix.elements,ot=ve[14]/(ve[10]-1),D=ve[14]/(ve[10]+1),Ze=(ve[9]+1)/ve[5],Pe=(ve[9]-1)/ve[5],Le=(ve[8]-1)/ve[0],Te=(ge[8]+1)/ge[0],_t=ot*Le,we=ot*Te,Ge=De/(-Le+Te),en=Ge*-Le;if(j.matrixWorld.decompose(Y.position,Y.quaternion,Y.scale),Y.translateX(en),Y.translateZ(Ge),Y.matrixWorld.compose(Y.position,Y.quaternion,Y.scale),Y.matrixWorldInverse.copy(Y.matrixWorld).invert(),ve[10]===-1)Y.projectionMatrix.copy(j.projectionMatrix),Y.projectionMatrixInverse.copy(j.projectionMatrixInverse);else{let Ft=ot+Ge,I=D+Ge,A=_t-en,X=we+(De-en),ee=Ze*D/I*Ft,oe=Pe*D/I*Ft;Y.projectionMatrix.makePerspective(A,X,ee,oe,Ft,I),Y.projectionMatrixInverse.copy(Y.projectionMatrix).invert()}}function O(Y,j){j===null?Y.matrixWorld.copy(Y.matrix):Y.matrixWorld.multiplyMatrices(j.matrixWorld,Y.matrix),Y.matrixWorldInverse.copy(Y.matrixWorld).invert()}this.updateCamera=function(Y){if(s===null)return;let j=Y.near,he=Y.far;m.texture!==null&&(m.depthNear>0&&(j=m.depthNear),m.depthFar>0&&(he=m.depthFar)),U.near=M.near=b.near=j,U.far=M.far=b.far=he,(V!==U.near||H!==U.far)&&(s.updateRenderState({depthNear:U.near,depthFar:U.far}),V=U.near,H=U.far),U.layers.mask=Y.layers.mask|6,b.layers.mask=U.layers.mask&3,M.layers.mask=U.layers.mask&5;let De=Y.parent,ve=U.cameras;O(U,De);for(let ge=0;ge<ve.length;ge++)O(ve[ge],De);ve.length===2?F(U,b,M):U.projectionMatrix.copy(b.projectionMatrix),J(Y,U,De)};function J(Y,j,he){he===null?Y.matrix.copy(j.matrixWorld):(Y.matrix.copy(he.matrixWorld),Y.matrix.invert(),Y.matrix.multiply(j.matrixWorld)),Y.matrix.decompose(Y.position,Y.quaternion,Y.scale),Y.updateMatrixWorld(!0),Y.projectionMatrix.copy(j.projectionMatrix),Y.projectionMatrixInverse.copy(j.projectionMatrixInverse),Y.isPerspectiveCamera&&(Y.fov=Fa*2*Math.atan(1/Y.projectionMatrix.elements[5]),Y.zoom=1)}this.getCamera=function(){return U},this.getFoveation=function(){if(!(u===null&&f===null))return c},this.setFoveation=function(Y){c=Y,u!==null&&(u.fixedFoveation=Y),f!==null&&f.fixedFoveation!==void 0&&(f.fixedFoveation=Y)},this.hasDepthSensing=function(){return m.texture!==null},this.getDepthSensingMesh=function(){return m.getMesh(U)},this.getCameraTexture=function(Y){return p[Y]};let q=null;function le(Y,j){if(l=j.getViewerPose(h||o),x=j,l!==null){let he=l.views;f!==null&&(e.setRenderTargetFramebuffer(g,f.framebuffer),e.setRenderTarget(g));let De=!1;he.length!==U.cameras.length&&(U.cameras.length=0,De=!0);for(let D=0;D<he.length;D++){let Ze=he[D],Pe=null;if(f!==null)Pe=f.getViewport(Ze);else{let Te=d.getViewSubImage(u,Ze);Pe=Te.viewport,D===0&&(e.setRenderTargetTextures(g,Te.colorTexture,Te.depthStencilTexture),e.setRenderTarget(g))}let Le=C[D];Le===void 0&&(Le=new Bn,Le.layers.enable(D),Le.viewport=new wt,C[D]=Le),Le.matrix.fromArray(Ze.transform.matrix),Le.matrix.decompose(Le.position,Le.quaternion,Le.scale),Le.projectionMatrix.fromArray(Ze.projectionMatrix),Le.projectionMatrixInverse.copy(Le.projectionMatrix).invert(),Le.viewport.set(Pe.x,Pe.y,Pe.width,Pe.height),D===0&&(U.matrix.copy(Le.matrix),U.matrix.decompose(U.position,U.quaternion,U.scale)),De===!0&&U.cameras.push(Le)}let ve=s.enabledFeatures;if(ve&&ve.includes("depth-sensing")&&s.depthUsage=="gpu-optimized"&&y){d=i.getBinding();let D=d.getDepthInformation(he[0]);D&&D.isValid&&D.texture&&m.init(D,s.renderState)}if(ve&&ve.includes("camera-access")&&y){e.state.unbindTexture(),d=i.getBinding();for(let D=0;D<he.length;D++){let Ze=he[D].camera;if(Ze){let Pe=p[Ze];Pe||(Pe=new mc,p[Ze]=Pe);let Le=d.getCameraImage(Ze);Pe.sourceTexture=Le}}}}for(let he=0;he<_.length;he++){let De=S[he],ve=_[he];De!==null&&ve!==void 0&&ve.update(De,j,h||o)}q&&q(Y,j),j.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:j}),x=null}let Se=new yy;Se.setAnimationLoop(le),this.setAnimationLoop=function(Y){q=Y},this.dispose=function(){}}},Co=new hi,EA=new ut;function RA(n,e){function t(m,p){m.matrixAutoUpdate===!0&&m.updateMatrix(),p.value.copy(m.matrix)}function i(m,p){p.color.getRGB(m.fogColor.value,Sm(n)),p.isFog?(m.fogNear.value=p.near,m.fogFar.value=p.far):p.isFogExp2&&(m.fogDensity.value=p.density)}function s(m,p,w,v,g){p.isMeshBasicMaterial||p.isMeshLambertMaterial?r(m,p):p.isMeshToonMaterial?(r(m,p),d(m,p)):p.isMeshPhongMaterial?(r(m,p),l(m,p)):p.isMeshStandardMaterial?(r(m,p),u(m,p),p.isMeshPhysicalMaterial&&f(m,p,g)):p.isMeshMatcapMaterial?(r(m,p),x(m,p)):p.isMeshDepthMaterial?r(m,p):p.isMeshDistanceMaterial?(r(m,p),y(m,p)):p.isMeshNormalMaterial?r(m,p):p.isLineBasicMaterial?(o(m,p),p.isLineDashedMaterial&&a(m,p)):p.isPointsMaterial?c(m,p,w,v):p.isSpriteMaterial?h(m,p):p.isShadowMaterial?(m.color.value.copy(p.color),m.opacity.value=p.opacity):p.isShaderMaterial&&(p.uniformsNeedUpdate=!1)}function r(m,p){m.opacity.value=p.opacity,p.color&&m.diffuse.value.copy(p.color),p.emissive&&m.emissive.value.copy(p.emissive).multiplyScalar(p.emissiveIntensity),p.map&&(m.map.value=p.map,t(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,t(p.alphaMap,m.alphaMapTransform)),p.bumpMap&&(m.bumpMap.value=p.bumpMap,t(p.bumpMap,m.bumpMapTransform),m.bumpScale.value=p.bumpScale,p.side===bn&&(m.bumpScale.value*=-1)),p.normalMap&&(m.normalMap.value=p.normalMap,t(p.normalMap,m.normalMapTransform),m.normalScale.value.copy(p.normalScale),p.side===bn&&m.normalScale.value.negate()),p.displacementMap&&(m.displacementMap.value=p.displacementMap,t(p.displacementMap,m.displacementMapTransform),m.displacementScale.value=p.displacementScale,m.displacementBias.value=p.displacementBias),p.emissiveMap&&(m.emissiveMap.value=p.emissiveMap,t(p.emissiveMap,m.emissiveMapTransform)),p.specularMap&&(m.specularMap.value=p.specularMap,t(p.specularMap,m.specularMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest);let w=e.get(p),v=w.envMap,g=w.envMapRotation;v&&(m.envMap.value=v,Co.copy(g),Co.x*=-1,Co.y*=-1,Co.z*=-1,v.isCubeTexture&&v.isRenderTargetTexture===!1&&(Co.y*=-1,Co.z*=-1),m.envMapRotation.value.setFromMatrix4(EA.makeRotationFromEuler(Co)),m.flipEnvMap.value=v.isCubeTexture&&v.isRenderTargetTexture===!1?-1:1,m.reflectivity.value=p.reflectivity,m.ior.value=p.ior,m.refractionRatio.value=p.refractionRatio),p.lightMap&&(m.lightMap.value=p.lightMap,m.lightMapIntensity.value=p.lightMapIntensity,t(p.lightMap,m.lightMapTransform)),p.aoMap&&(m.aoMap.value=p.aoMap,m.aoMapIntensity.value=p.aoMapIntensity,t(p.aoMap,m.aoMapTransform))}function o(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,p.map&&(m.map.value=p.map,t(p.map,m.mapTransform))}function a(m,p){m.dashSize.value=p.dashSize,m.totalSize.value=p.dashSize+p.gapSize,m.scale.value=p.scale}function c(m,p,w,v){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.size.value=p.size*w,m.scale.value=v*.5,p.map&&(m.map.value=p.map,t(p.map,m.uvTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,t(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function h(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.rotation.value=p.rotation,p.map&&(m.map.value=p.map,t(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,t(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function l(m,p){m.specular.value.copy(p.specular),m.shininess.value=Math.max(p.shininess,1e-4)}function d(m,p){p.gradientMap&&(m.gradientMap.value=p.gradientMap)}function u(m,p){m.metalness.value=p.metalness,p.metalnessMap&&(m.metalnessMap.value=p.metalnessMap,t(p.metalnessMap,m.metalnessMapTransform)),m.roughness.value=p.roughness,p.roughnessMap&&(m.roughnessMap.value=p.roughnessMap,t(p.roughnessMap,m.roughnessMapTransform)),p.envMap&&(m.envMapIntensity.value=p.envMapIntensity)}function f(m,p,w){m.ior.value=p.ior,p.sheen>0&&(m.sheenColor.value.copy(p.sheenColor).multiplyScalar(p.sheen),m.sheenRoughness.value=p.sheenRoughness,p.sheenColorMap&&(m.sheenColorMap.value=p.sheenColorMap,t(p.sheenColorMap,m.sheenColorMapTransform)),p.sheenRoughnessMap&&(m.sheenRoughnessMap.value=p.sheenRoughnessMap,t(p.sheenRoughnessMap,m.sheenRoughnessMapTransform))),p.clearcoat>0&&(m.clearcoat.value=p.clearcoat,m.clearcoatRoughness.value=p.clearcoatRoughness,p.clearcoatMap&&(m.clearcoatMap.value=p.clearcoatMap,t(p.clearcoatMap,m.clearcoatMapTransform)),p.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=p.clearcoatRoughnessMap,t(p.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),p.clearcoatNormalMap&&(m.clearcoatNormalMap.value=p.clearcoatNormalMap,t(p.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(p.clearcoatNormalScale),p.side===bn&&m.clearcoatNormalScale.value.negate())),p.dispersion>0&&(m.dispersion.value=p.dispersion),p.iridescence>0&&(m.iridescence.value=p.iridescence,m.iridescenceIOR.value=p.iridescenceIOR,m.iridescenceThicknessMinimum.value=p.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=p.iridescenceThicknessRange[1],p.iridescenceMap&&(m.iridescenceMap.value=p.iridescenceMap,t(p.iridescenceMap,m.iridescenceMapTransform)),p.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=p.iridescenceThicknessMap,t(p.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),p.transmission>0&&(m.transmission.value=p.transmission,m.transmissionSamplerMap.value=w.texture,m.transmissionSamplerSize.value.set(w.width,w.height),p.transmissionMap&&(m.transmissionMap.value=p.transmissionMap,t(p.transmissionMap,m.transmissionMapTransform)),m.thickness.value=p.thickness,p.thicknessMap&&(m.thicknessMap.value=p.thicknessMap,t(p.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=p.attenuationDistance,m.attenuationColor.value.copy(p.attenuationColor)),p.anisotropy>0&&(m.anisotropyVector.value.set(p.anisotropy*Math.cos(p.anisotropyRotation),p.anisotropy*Math.sin(p.anisotropyRotation)),p.anisotropyMap&&(m.anisotropyMap.value=p.anisotropyMap,t(p.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=p.specularIntensity,m.specularColor.value.copy(p.specularColor),p.specularColorMap&&(m.specularColorMap.value=p.specularColorMap,t(p.specularColorMap,m.specularColorMapTransform)),p.specularIntensityMap&&(m.specularIntensityMap.value=p.specularIntensityMap,t(p.specularIntensityMap,m.specularIntensityMapTransform))}function x(m,p){p.matcap&&(m.matcap.value=p.matcap)}function y(m,p){let w=e.get(p).light;m.referencePosition.value.setFromMatrixPosition(w.matrixWorld),m.nearDistance.value=w.shadow.camera.near,m.farDistance.value=w.shadow.camera.far}return{refreshFogUniforms:i,refreshMaterialUniforms:s}}function CA(n,e,t,i){let s={},r={},o=[],a=n.getParameter(n.MAX_UNIFORM_BUFFER_BINDINGS);function c(w,v){let g=v.program;i.uniformBlockBinding(w,g)}function h(w,v){let g=s[w.id];g===void 0&&(x(w),g=l(w),s[w.id]=g,w.addEventListener("dispose",m));let _=v.program;i.updateUBOMapping(w,_);let S=e.render.frame;r[w.id]!==S&&(u(w),r[w.id]=S)}function l(w){let v=d();w.__bindingPointIndex=v;let g=n.createBuffer(),_=w.__size,S=w.usage;return n.bindBuffer(n.UNIFORM_BUFFER,g),n.bufferData(n.UNIFORM_BUFFER,_,S),n.bindBuffer(n.UNIFORM_BUFFER,null),n.bindBufferBase(n.UNIFORM_BUFFER,v,g),g}function d(){for(let w=0;w<a;w++)if(o.indexOf(w)===-1)return o.push(w),w;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function u(w){let v=s[w.id],g=w.uniforms,_=w.__cache;n.bindBuffer(n.UNIFORM_BUFFER,v);for(let S=0,R=g.length;S<R;S++){let P=Array.isArray(g[S])?g[S]:[g[S]];for(let b=0,M=P.length;b<M;b++){let C=P[b];if(f(C,S,b,_)===!0){let U=C.__offset,V=Array.isArray(C.value)?C.value:[C.value],H=0;for(let k=0;k<V.length;k++){let z=V[k],ie=y(z);typeof z=="number"||typeof z=="boolean"?(C.__data[0]=z,n.bufferSubData(n.UNIFORM_BUFFER,U+H,C.__data)):z.isMatrix3?(C.__data[0]=z.elements[0],C.__data[1]=z.elements[1],C.__data[2]=z.elements[2],C.__data[3]=0,C.__data[4]=z.elements[3],C.__data[5]=z.elements[4],C.__data[6]=z.elements[5],C.__data[7]=0,C.__data[8]=z.elements[6],C.__data[9]=z.elements[7],C.__data[10]=z.elements[8],C.__data[11]=0):(z.toArray(C.__data,H),H+=ie.storage/Float32Array.BYTES_PER_ELEMENT)}n.bufferSubData(n.UNIFORM_BUFFER,U,C.__data)}}}n.bindBuffer(n.UNIFORM_BUFFER,null)}function f(w,v,g,_){let S=w.value,R=v+"_"+g;if(_[R]===void 0)return typeof S=="number"||typeof S=="boolean"?_[R]=S:_[R]=S.clone(),!0;{let P=_[R];if(typeof S=="number"||typeof S=="boolean"){if(P!==S)return _[R]=S,!0}else if(P.equals(S)===!1)return P.copy(S),!0}return!1}function x(w){let v=w.uniforms,g=0,_=16;for(let R=0,P=v.length;R<P;R++){let b=Array.isArray(v[R])?v[R]:[v[R]];for(let M=0,C=b.length;M<C;M++){let U=b[M],V=Array.isArray(U.value)?U.value:[U.value];for(let H=0,k=V.length;H<k;H++){let z=V[H],ie=y(z),$=g%_,te=$%ie.boundary,F=$+te;g+=te,F!==0&&_-F<ie.storage&&(g+=_-F),U.__data=new Float32Array(ie.storage/Float32Array.BYTES_PER_ELEMENT),U.__offset=g,g+=ie.storage}}}let S=g%_;return S>0&&(g+=_-S),w.__size=g,w.__cache={},this}function y(w){let v={boundary:0,storage:0};return typeof w=="number"||typeof w=="boolean"?(v.boundary=4,v.storage=4):w.isVector2?(v.boundary=8,v.storage=8):w.isVector3||w.isColor?(v.boundary=16,v.storage=12):w.isVector4?(v.boundary=16,v.storage=16):w.isMatrix3?(v.boundary=48,v.storage=48):w.isMatrix4?(v.boundary=64,v.storage=64):w.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",w),v}function m(w){let v=w.target;v.removeEventListener("dispose",m);let g=o.indexOf(v.__bindingPointIndex);o.splice(g,1),n.deleteBuffer(s[v.id]),delete s[v.id],delete r[v.id]}function p(){for(let w in s)n.deleteBuffer(s[w]);o=[],s={},r={}}return{bind:c,update:h,dispose:p}}var zd=class{constructor(e={}){let{canvas:t=Wx(),context:i=null,depth:s=!0,stencil:r=!1,alpha:o=!1,antialias:a=!1,premultipliedAlpha:c=!0,preserveDrawingBuffer:h=!1,powerPreference:l="default",failIfMajorPerformanceCaveat:d=!1,reversedDepthBuffer:u=!1}=e;this.isWebGLRenderer=!0;let f;if(i!==null){if(typeof WebGLRenderingContext<"u"&&i instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");f=i.getContextAttributes().alpha}else f=o;let x=new Uint32Array(4),y=new Int32Array(4),m=null,p=null,w=[],v=[];this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=Qs,this.toneMappingExposure=1,this.transmissionResolutionScale=1;let g=this,_=!1;this._outputColorSpace=$n;let S=0,R=0,P=null,b=-1,M=null,C=new wt,U=new wt,V=null,H=new Ee(0),k=0,z=t.width,ie=t.height,$=1,te=null,F=null,O=new wt(0,0,z,ie),J=new wt(0,0,z,ie),q=!1,le=new Xa,Se=!1,Y=!1,j=new ut,he=new L,De=new wt,ve={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0},ge=!1;function ot(){return P===null?$:1}let D=i;function Ze(E,G){return t.getContext(E,G)}try{let E={alpha:!0,depth:s,stencil:r,antialias:a,premultipliedAlpha:c,preserveDrawingBuffer:h,powerPreference:l,failIfMajorPerformanceCaveat:d};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${"180"}`),t.addEventListener("webglcontextlost",me,!1),t.addEventListener("webglcontextrestored",Ne,!1),t.addEventListener("webglcontextcreationerror",ue,!1),D===null){let G="webgl2";if(D=Ze(G,E),D===null)throw Ze(G)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(E){throw console.error("THREE.WebGLRenderer: "+E.message),E}let Pe,Le,Te,_t,we,Ge,en,Ft,I,A,X,ee,oe,Q,Ue,pe,Ie,Be,de,be,We,ke,xe,$e;function B(){Pe=new $S(D),Pe.init(),ke=new wA(D,Pe),Le=new zS(D,Pe,e,ke),Te=new MA(D,Pe),Le.reversedDepthBuffer&&u&&Te.buffers.depth.setReversed(!0),_t=new KS(D),we=new cA,Ge=new SA(D,Pe,Te,we,Le,ke,_t),en=new VS(g),Ft=new qS(g),I=new n1(D),xe=new BS(D,I),A=new YS(D,I,_t,xe),X=new JS(D,A,I,_t),de=new jS(D,Le,Ge),pe=new HS(we),ee=new lA(g,en,Ft,Pe,Le,xe,pe),oe=new RA(g,we),Q=new uA,Ue=new xA(Pe),Be=new OS(g,en,Ft,Te,X,f,c),Ie=new vA(g,X,Le),$e=new CA(D,_t,Le,Te),be=new kS(D,Pe,_t),We=new ZS(D,Pe,_t),_t.programs=ee.programs,g.capabilities=Le,g.extensions=Pe,g.properties=we,g.renderLists=Q,g.shadowMap=Ie,g.state=Te,g.info=_t}B();let ce=new Hm(g,D);this.xr=ce,this.getContext=function(){return D},this.getContextAttributes=function(){return D.getContextAttributes()},this.forceContextLoss=function(){let E=Pe.get("WEBGL_lose_context");E&&E.loseContext()},this.forceContextRestore=function(){let E=Pe.get("WEBGL_lose_context");E&&E.restoreContext()},this.getPixelRatio=function(){return $},this.setPixelRatio=function(E){E!==void 0&&($=E,this.setSize(z,ie,!1))},this.getSize=function(E){return E.set(z,ie)},this.setSize=function(E,G,Z=!0){if(ce.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}z=E,ie=G,t.width=Math.floor(E*$),t.height=Math.floor(G*$),Z===!0&&(t.style.width=E+"px",t.style.height=G+"px"),this.setViewport(0,0,E,G)},this.getDrawingBufferSize=function(E){return E.set(z*$,ie*$).floor()},this.setDrawingBufferSize=function(E,G,Z){z=E,ie=G,$=Z,t.width=Math.floor(E*Z),t.height=Math.floor(G*Z),this.setViewport(0,0,E,G)},this.getCurrentViewport=function(E){return E.copy(C)},this.getViewport=function(E){return E.copy(O)},this.setViewport=function(E,G,Z,K){E.isVector4?O.set(E.x,E.y,E.z,E.w):O.set(E,G,Z,K),Te.viewport(C.copy(O).multiplyScalar($).round())},this.getScissor=function(E){return E.copy(J)},this.setScissor=function(E,G,Z,K){E.isVector4?J.set(E.x,E.y,E.z,E.w):J.set(E,G,Z,K),Te.scissor(U.copy(J).multiplyScalar($).round())},this.getScissorTest=function(){return q},this.setScissorTest=function(E){Te.setScissorTest(q=E)},this.setOpaqueSort=function(E){te=E},this.setTransparentSort=function(E){F=E},this.getClearColor=function(E){return E.copy(Be.getClearColor())},this.setClearColor=function(){Be.setClearColor(...arguments)},this.getClearAlpha=function(){return Be.getClearAlpha()},this.setClearAlpha=function(){Be.setClearAlpha(...arguments)},this.clear=function(E=!0,G=!0,Z=!0){let K=0;if(E){let W=!1;if(P!==null){let fe=P.texture.format;W=fe===ad||fe===od||fe===rd}if(W){let fe=P.texture.type,Me=fe===is||fe===Br||fe===Ka||fe===kr||fe===id||fe===sd,Fe=Be.getClearColor(),Ce=Be.getClearAlpha(),Xe=Fe.r,Ye=Fe.g,He=Fe.b;Me?(x[0]=Xe,x[1]=Ye,x[2]=He,x[3]=Ce,D.clearBufferuiv(D.COLOR,0,x)):(y[0]=Xe,y[1]=Ye,y[2]=He,y[3]=Ce,D.clearBufferiv(D.COLOR,0,y))}else K|=D.COLOR_BUFFER_BIT}G&&(K|=D.DEPTH_BUFFER_BIT),Z&&(K|=D.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),D.clear(K)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){t.removeEventListener("webglcontextlost",me,!1),t.removeEventListener("webglcontextrestored",Ne,!1),t.removeEventListener("webglcontextcreationerror",ue,!1),Be.dispose(),Q.dispose(),Ue.dispose(),we.dispose(),en.dispose(),Ft.dispose(),X.dispose(),xe.dispose(),$e.dispose(),ee.dispose(),ce.dispose(),ce.removeEventListener("sessionstart",Ms),ce.removeEventListener("sessionend",L0),ao.stop()};function me(E){E.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),_=!0}function Ne(){console.log("THREE.WebGLRenderer: Context Restored."),_=!1;let E=_t.autoReset,G=Ie.enabled,Z=Ie.autoUpdate,K=Ie.needsUpdate,W=Ie.type;B(),_t.autoReset=E,Ie.enabled=G,Ie.autoUpdate=Z,Ie.needsUpdate=K,Ie.type=W}function ue(E){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",E.statusMessage)}function se(E){let G=E.target;G.removeEventListener("dispose",se),Oe(G)}function Oe(E){je(E),we.remove(E)}function je(E){let G=we.get(E).programs;G!==void 0&&(G.forEach(function(Z){ee.releaseProgram(Z)}),E.isShaderMaterial&&ee.releaseShaderCache(E))}this.renderBufferDirect=function(E,G,Z,K,W,fe){G===null&&(G=ve);let Me=W.isMesh&&W.matrixWorld.determinant()<0,Fe=Wv(E,G,Z,K,W);Te.setMaterial(K,Me);let Ce=Z.index,Xe=1;if(K.wireframe===!0){if(Ce=A.getWireframeAttribute(Z),Ce===void 0)return;Xe=2}let Ye=Z.drawRange,He=Z.attributes.position,at=Ye.start*Xe,At=(Ye.start+Ye.count)*Xe;fe!==null&&(at=Math.max(at,fe.start*Xe),At=Math.min(At,(fe.start+fe.count)*Xe)),Ce!==null?(at=Math.max(at,0),At=Math.min(At,Ce.count)):He!=null&&(at=Math.max(at,0),At=Math.min(At,He.count));let tn=At-at;if(tn<0||tn===1/0)return;xe.setup(W,K,Fe,Z,Ce);let Ot,Ct=be;if(Ce!==null&&(Ot=I.get(Ce),Ct=We,Ct.setIndex(Ot)),W.isMesh)K.wireframe===!0?(Te.setLineWidth(K.wireframeLinewidth*ot()),Ct.setMode(D.LINES)):Ct.setMode(D.TRIANGLES);else if(W.isLine){let Ve=K.linewidth;Ve===void 0&&(Ve=1),Te.setLineWidth(Ve*ot()),W.isLineSegments?Ct.setMode(D.LINES):W.isLineLoop?Ct.setMode(D.LINE_LOOP):Ct.setMode(D.LINE_STRIP)}else W.isPoints?Ct.setMode(D.POINTS):W.isSprite&&Ct.setMode(D.TRIANGLES);if(W.isBatchedMesh)if(W._multiDrawInstances!==null)Oa("THREE.WebGLRenderer: renderMultiDrawInstances has been deprecated and will be removed in r184. Append to renderMultiDraw arguments and use indirection."),Ct.renderMultiDrawInstances(W._multiDrawStarts,W._multiDrawCounts,W._multiDrawCount,W._multiDrawInstances);else if(Pe.get("WEBGL_multi_draw"))Ct.renderMultiDraw(W._multiDrawStarts,W._multiDrawCounts,W._multiDrawCount);else{let Ve=W._multiDrawStarts,Zt=W._multiDrawCounts,dt=W._multiDrawCount,mi=Ce?I.get(Ce).bytesPerElement:1,ga=we.get(K).currentProgram.getUniforms();for(let gi=0;gi<dt;gi++)ga.setValue(D,"_gl_DrawID",gi),Ct.render(Ve[gi]/mi,Zt[gi])}else if(W.isInstancedMesh)Ct.renderInstances(at,tn,W.count);else if(Z.isInstancedBufferGeometry){let Ve=Z._maxInstanceCount!==void 0?Z._maxInstanceCount:1/0,Zt=Math.min(Z.instanceCount,Ve);Ct.renderInstances(at,tn,Zt)}else Ct.render(at,tn)};function Dt(E,G,Z){E.transparent===!0&&E.side===vi&&E.forceSinglePass===!1?(E.side=bn,E.needsUpdate=!0,Uh(E,G,Z),E.side=ji,E.needsUpdate=!0,Uh(E,G,Z),E.side=vi):Uh(E,G,Z)}this.compile=function(E,G,Z=null){Z===null&&(Z=E),p=Ue.get(Z),p.init(G),v.push(p),Z.traverseVisible(function(W){W.isLight&&W.layers.test(G.layers)&&(p.pushLight(W),W.castShadow&&p.pushShadow(W))}),E!==Z&&E.traverseVisible(function(W){W.isLight&&W.layers.test(G.layers)&&(p.pushLight(W),W.castShadow&&p.pushShadow(W))}),p.setupLights();let K=new Set;return E.traverse(function(W){if(!(W.isMesh||W.isPoints||W.isLine||W.isSprite))return;let fe=W.material;if(fe)if(Array.isArray(fe))for(let Me=0;Me<fe.length;Me++){let Fe=fe[Me];Dt(Fe,Z,W),K.add(Fe)}else Dt(fe,Z,W),K.add(fe)}),p=v.pop(),K},this.compileAsync=function(E,G,Z=null){let K=this.compile(E,G,Z);return new Promise(W=>{function fe(){if(K.forEach(function(Me){we.get(Me).currentProgram.isReady()&&K.delete(Me)}),K.size===0){W(E);return}setTimeout(fe,10)}Pe.get("KHR_parallel_shader_compile")!==null?fe():setTimeout(fe,10)})};let bt=null;function Ws(E){bt&&bt(E)}function Ms(){ao.stop()}function L0(){ao.start()}let ao=new yy;ao.setAnimationLoop(Ws),typeof self<"u"&&ao.setContext(self),this.setAnimationLoop=function(E){bt=E,ce.setAnimationLoop(E),E===null?ao.stop():ao.start()},ce.addEventListener("sessionstart",Ms),ce.addEventListener("sessionend",L0),this.render=function(E,G){if(G!==void 0&&G.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(_===!0)return;if(E.matrixWorldAutoUpdate===!0&&E.updateMatrixWorld(),G.parent===null&&G.matrixWorldAutoUpdate===!0&&G.updateMatrixWorld(),ce.enabled===!0&&ce.isPresenting===!0&&(ce.cameraAutoUpdate===!0&&ce.updateCamera(G),G=ce.getCamera()),E.isScene===!0&&E.onBeforeRender(g,E,G,P),p=Ue.get(E,v.length),p.init(G),v.push(p),j.multiplyMatrices(G.projectionMatrix,G.matrixWorldInverse),le.setFromProjectionMatrix(j,Ki,G.reversedDepth),Y=this.localClippingEnabled,Se=pe.init(this.clippingPlanes,Y),m=Q.get(E,w.length),m.init(),w.push(m),ce.enabled===!0&&ce.isPresenting===!0){let fe=g.xr.getDepthSensingMesh();fe!==null&&wp(fe,G,-1/0,g.sortObjects)}wp(E,G,0,g.sortObjects),m.finish(),g.sortObjects===!0&&m.sort(te,F),ge=ce.enabled===!1||ce.isPresenting===!1||ce.hasDepthSensing()===!1,ge&&Be.addToRenderList(m,E),this.info.render.frame++,Se===!0&&pe.beginShadows();let Z=p.state.shadowsArray;Ie.render(Z,E,G),Se===!0&&pe.endShadows(),this.info.autoReset===!0&&this.info.reset();let K=m.opaque,W=m.transmissive;if(p.setupLights(),G.isArrayCamera){let fe=G.cameras;if(W.length>0)for(let Me=0,Fe=fe.length;Me<Fe;Me++){let Ce=fe[Me];F0(K,W,E,Ce)}ge&&Be.render(E);for(let Me=0,Fe=fe.length;Me<Fe;Me++){let Ce=fe[Me];U0(m,E,Ce,Ce.viewport)}}else W.length>0&&F0(K,W,E,G),ge&&Be.render(E),U0(m,E,G);P!==null&&R===0&&(Ge.updateMultisampleRenderTarget(P),Ge.updateRenderTargetMipmap(P)),E.isScene===!0&&E.onAfterRender(g,E,G),xe.resetDefaultState(),b=-1,M=null,v.pop(),v.length>0?(p=v[v.length-1],Se===!0&&pe.setGlobalState(g.clippingPlanes,p.state.camera)):p=null,w.pop(),w.length>0?m=w[w.length-1]:m=null};function wp(E,G,Z,K){if(E.visible===!1)return;if(E.layers.test(G.layers)){if(E.isGroup)Z=E.renderOrder;else if(E.isLOD)E.autoUpdate===!0&&E.update(G);else if(E.isLight)p.pushLight(E),E.castShadow&&p.pushShadow(E);else if(E.isSprite){if(!E.frustumCulled||le.intersectsSprite(E)){K&&De.setFromMatrixPosition(E.matrixWorld).applyMatrix4(j);let Me=X.update(E),Fe=E.material;Fe.visible&&m.push(E,Me,Fe,Z,De.z,null)}}else if((E.isMesh||E.isLine||E.isPoints)&&(!E.frustumCulled||le.intersectsObject(E))){let Me=X.update(E),Fe=E.material;if(K&&(E.boundingSphere!==void 0?(E.boundingSphere===null&&E.computeBoundingSphere(),De.copy(E.boundingSphere.center)):(Me.boundingSphere===null&&Me.computeBoundingSphere(),De.copy(Me.boundingSphere.center)),De.applyMatrix4(E.matrixWorld).applyMatrix4(j)),Array.isArray(Fe)){let Ce=Me.groups;for(let Xe=0,Ye=Ce.length;Xe<Ye;Xe++){let He=Ce[Xe],at=Fe[He.materialIndex];at&&at.visible&&m.push(E,Me,at,Z,De.z,He)}}else Fe.visible&&m.push(E,Me,Fe,Z,De.z,null)}}let fe=E.children;for(let Me=0,Fe=fe.length;Me<Fe;Me++)wp(fe[Me],G,Z,K)}function U0(E,G,Z,K){let W=E.opaque,fe=E.transmissive,Me=E.transparent;p.setupLightsView(Z),Se===!0&&pe.setGlobalState(g.clippingPlanes,Z),K&&Te.viewport(C.copy(K)),W.length>0&&Lh(W,G,Z),fe.length>0&&Lh(fe,G,Z),Me.length>0&&Lh(Me,G,Z),Te.buffers.depth.setTest(!0),Te.buffers.depth.setMask(!0),Te.buffers.color.setMask(!0),Te.setPolygonOffset(!1)}function F0(E,G,Z,K){if((Z.isScene===!0?Z.overrideMaterial:null)!==null)return;p.state.transmissionRenderTarget[K.id]===void 0&&(p.state.transmissionRenderTarget[K.id]=new ln(1,1,{generateMipmaps:!0,type:Pe.has("EXT_color_buffer_half_float")||Pe.has("EXT_color_buffer_float")?zn:is,minFilter:Or,samples:4,stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:lt.workingColorSpace}));let fe=p.state.transmissionRenderTarget[K.id],Me=K.viewport||C;fe.setSize(Me.z*g.transmissionResolutionScale,Me.w*g.transmissionResolutionScale);let Fe=g.getRenderTarget(),Ce=g.getActiveCubeFace(),Xe=g.getActiveMipmapLevel();g.setRenderTarget(fe),g.getClearColor(H),k=g.getClearAlpha(),k<1&&g.setClearColor(16777215,.5),g.clear(),ge&&Be.render(Z);let Ye=g.toneMapping;g.toneMapping=Qs;let He=K.viewport;if(K.viewport!==void 0&&(K.viewport=void 0),p.setupLightsView(K),Se===!0&&pe.setGlobalState(g.clippingPlanes,K),Lh(E,Z,K),Ge.updateMultisampleRenderTarget(fe),Ge.updateRenderTargetMipmap(fe),Pe.has("WEBGL_multisampled_render_to_texture")===!1){let at=!1;for(let At=0,tn=G.length;At<tn;At++){let Ot=G[At],Ct=Ot.object,Ve=Ot.geometry,Zt=Ot.material,dt=Ot.group;if(Zt.side===vi&&Ct.layers.test(K.layers)){let mi=Zt.side;Zt.side=bn,Zt.needsUpdate=!0,O0(Ct,Z,K,Ve,Zt,dt),Zt.side=mi,Zt.needsUpdate=!0,at=!0}}at===!0&&(Ge.updateMultisampleRenderTarget(fe),Ge.updateRenderTargetMipmap(fe))}g.setRenderTarget(Fe,Ce,Xe),g.setClearColor(H,k),He!==void 0&&(K.viewport=He),g.toneMapping=Ye}function Lh(E,G,Z){let K=G.isScene===!0?G.overrideMaterial:null;for(let W=0,fe=E.length;W<fe;W++){let Me=E[W],Fe=Me.object,Ce=Me.geometry,Xe=Me.group,Ye=Me.material;Ye.allowOverride===!0&&K!==null&&(Ye=K),Fe.layers.test(Z.layers)&&O0(Fe,G,Z,Ce,Ye,Xe)}}function O0(E,G,Z,K,W,fe){E.onBeforeRender(g,G,Z,K,W,fe),E.modelViewMatrix.multiplyMatrices(Z.matrixWorldInverse,E.matrixWorld),E.normalMatrix.getNormalMatrix(E.modelViewMatrix),W.onBeforeRender(g,G,Z,K,E,fe),W.transparent===!0&&W.side===vi&&W.forceSinglePass===!1?(W.side=bn,W.needsUpdate=!0,g.renderBufferDirect(Z,G,K,W,E,fe),W.side=ji,W.needsUpdate=!0,g.renderBufferDirect(Z,G,K,W,E,fe),W.side=vi):g.renderBufferDirect(Z,G,K,W,E,fe),E.onAfterRender(g,G,Z,K,W,fe)}function Uh(E,G,Z){G.isScene!==!0&&(G=ve);let K=we.get(E),W=p.state.lights,fe=p.state.shadowsArray,Me=W.state.version,Fe=ee.getParameters(E,W.state,fe,G,Z),Ce=ee.getProgramCacheKey(Fe),Xe=K.programs;K.environment=E.isMeshStandardMaterial?G.environment:null,K.fog=G.fog,K.envMap=(E.isMeshStandardMaterial?Ft:en).get(E.envMap||K.environment),K.envMapRotation=K.environment!==null&&E.envMap===null?G.environmentRotation:E.envMapRotation,Xe===void 0&&(E.addEventListener("dispose",se),Xe=new Map,K.programs=Xe);let Ye=Xe.get(Ce);if(Ye!==void 0){if(K.currentProgram===Ye&&K.lightsStateVersion===Me)return k0(E,Fe),Ye}else Fe.uniforms=ee.getUniforms(E),E.onBeforeCompile(Fe,g),Ye=ee.acquireProgram(Fe,Ce),Xe.set(Ce,Ye),K.uniforms=Fe.uniforms;let He=K.uniforms;return(!E.isShaderMaterial&&!E.isRawShaderMaterial||E.clipping===!0)&&(He.clippingPlanes=pe.uniform),k0(E,Fe),K.needsLights=qv(E),K.lightsStateVersion=Me,K.needsLights&&(He.ambientLightColor.value=W.state.ambient,He.lightProbe.value=W.state.probe,He.directionalLights.value=W.state.directional,He.directionalLightShadows.value=W.state.directionalShadow,He.spotLights.value=W.state.spot,He.spotLightShadows.value=W.state.spotShadow,He.rectAreaLights.value=W.state.rectArea,He.ltc_1.value=W.state.rectAreaLTC1,He.ltc_2.value=W.state.rectAreaLTC2,He.pointLights.value=W.state.point,He.pointLightShadows.value=W.state.pointShadow,He.hemisphereLights.value=W.state.hemi,He.directionalShadowMap.value=W.state.directionalShadowMap,He.directionalShadowMatrix.value=W.state.directionalShadowMatrix,He.spotShadowMap.value=W.state.spotShadowMap,He.spotLightMatrix.value=W.state.spotLightMatrix,He.spotLightMap.value=W.state.spotLightMap,He.pointShadowMap.value=W.state.pointShadowMap,He.pointShadowMatrix.value=W.state.pointShadowMatrix),K.currentProgram=Ye,K.uniformsList=null,Ye}function B0(E){if(E.uniformsList===null){let G=E.currentProgram.getUniforms();E.uniformsList=el.seqWithValue(G.seq,E.uniforms)}return E.uniformsList}function k0(E,G){let Z=we.get(E);Z.outputColorSpace=G.outputColorSpace,Z.batching=G.batching,Z.batchingColor=G.batchingColor,Z.instancing=G.instancing,Z.instancingColor=G.instancingColor,Z.instancingMorph=G.instancingMorph,Z.skinning=G.skinning,Z.morphTargets=G.morphTargets,Z.morphNormals=G.morphNormals,Z.morphColors=G.morphColors,Z.morphTargetsCount=G.morphTargetsCount,Z.numClippingPlanes=G.numClippingPlanes,Z.numIntersection=G.numClipIntersection,Z.vertexAlphas=G.vertexAlphas,Z.vertexTangents=G.vertexTangents,Z.toneMapping=G.toneMapping}function Wv(E,G,Z,K,W){G.isScene!==!0&&(G=ve),Ge.resetTextureUnits();let fe=G.fog,Me=K.isMeshStandardMaterial?G.environment:null,Fe=P===null?g.outputColorSpace:P.isXRRenderTarget===!0?P.texture.colorSpace:yo,Ce=(K.isMeshStandardMaterial?Ft:en).get(K.envMap||Me),Xe=K.vertexColors===!0&&!!Z.attributes.color&&Z.attributes.color.itemSize===4,Ye=!!Z.attributes.tangent&&(!!K.normalMap||K.anisotropy>0),He=!!Z.morphAttributes.position,at=!!Z.morphAttributes.normal,At=!!Z.morphAttributes.color,tn=Qs;K.toneMapped&&(P===null||P.isXRRenderTarget===!0)&&(tn=g.toneMapping);let Ot=Z.morphAttributes.position||Z.morphAttributes.normal||Z.morphAttributes.color,Ct=Ot!==void 0?Ot.length:0,Ve=we.get(K),Zt=p.state.lights;if(Se===!0&&(Y===!0||E!==M)){let Kn=E===M&&K.id===b;pe.setState(K,E,Kn)}let dt=!1;K.version===Ve.__version?(Ve.needsLights&&Ve.lightsStateVersion!==Zt.state.version||Ve.outputColorSpace!==Fe||W.isBatchedMesh&&Ve.batching===!1||!W.isBatchedMesh&&Ve.batching===!0||W.isBatchedMesh&&Ve.batchingColor===!0&&W.colorTexture===null||W.isBatchedMesh&&Ve.batchingColor===!1&&W.colorTexture!==null||W.isInstancedMesh&&Ve.instancing===!1||!W.isInstancedMesh&&Ve.instancing===!0||W.isSkinnedMesh&&Ve.skinning===!1||!W.isSkinnedMesh&&Ve.skinning===!0||W.isInstancedMesh&&Ve.instancingColor===!0&&W.instanceColor===null||W.isInstancedMesh&&Ve.instancingColor===!1&&W.instanceColor!==null||W.isInstancedMesh&&Ve.instancingMorph===!0&&W.morphTexture===null||W.isInstancedMesh&&Ve.instancingMorph===!1&&W.morphTexture!==null||Ve.envMap!==Ce||K.fog===!0&&Ve.fog!==fe||Ve.numClippingPlanes!==void 0&&(Ve.numClippingPlanes!==pe.numPlanes||Ve.numIntersection!==pe.numIntersection)||Ve.vertexAlphas!==Xe||Ve.vertexTangents!==Ye||Ve.morphTargets!==He||Ve.morphNormals!==at||Ve.morphColors!==At||Ve.toneMapping!==tn||Ve.morphTargetsCount!==Ct)&&(dt=!0):(dt=!0,Ve.__version=K.version);let mi=Ve.currentProgram;dt===!0&&(mi=Uh(K,G,W));let ga=!1,gi=!1,Hl=!1,Kt=mi.getUniforms(),Pi=Ve.uniforms;if(Te.useProgram(mi.program)&&(ga=!0,gi=!0,Hl=!0),K.id!==b&&(b=K.id,gi=!0),ga||M!==E){Te.buffers.depth.getReversed()&&E.reversedDepth!==!0&&(E._reversedDepth=!0,E.updateProjectionMatrix()),Kt.setValue(D,"projectionMatrix",E.projectionMatrix),Kt.setValue(D,"viewMatrix",E.matrixWorldInverse);let ci=Kt.map.cameraPosition;ci!==void 0&&ci.setValue(D,he.setFromMatrixPosition(E.matrixWorld)),Le.logarithmicDepthBuffer&&Kt.setValue(D,"logDepthBufFC",2/(Math.log(E.far+1)/Math.LN2)),(K.isMeshPhongMaterial||K.isMeshToonMaterial||K.isMeshLambertMaterial||K.isMeshBasicMaterial||K.isMeshStandardMaterial||K.isShaderMaterial)&&Kt.setValue(D,"isOrthographic",E.isOrthographicCamera===!0),M!==E&&(M=E,gi=!0,Hl=!0)}if(W.isSkinnedMesh){Kt.setOptional(D,W,"bindMatrix"),Kt.setOptional(D,W,"bindMatrixInverse");let Kn=W.skeleton;Kn&&(Kn.boneTexture===null&&Kn.computeBoneTexture(),Kt.setValue(D,"boneTexture",Kn.boneTexture,Ge))}W.isBatchedMesh&&(Kt.setOptional(D,W,"batchingTexture"),Kt.setValue(D,"batchingTexture",W._matricesTexture,Ge),Kt.setOptional(D,W,"batchingIdTexture"),Kt.setValue(D,"batchingIdTexture",W._indirectTexture,Ge),Kt.setOptional(D,W,"batchingColorTexture"),W._colorsTexture!==null&&Kt.setValue(D,"batchingColorTexture",W._colorsTexture,Ge));let Ii=Z.morphAttributes;if((Ii.position!==void 0||Ii.normal!==void 0||Ii.color!==void 0)&&de.update(W,Z,mi),(gi||Ve.receiveShadow!==W.receiveShadow)&&(Ve.receiveShadow=W.receiveShadow,Kt.setValue(D,"receiveShadow",W.receiveShadow)),K.isMeshGouraudMaterial&&K.envMap!==null&&(Pi.envMap.value=Ce,Pi.flipEnvMap.value=Ce.isCubeTexture&&Ce.isRenderTargetTexture===!1?-1:1),K.isMeshStandardMaterial&&K.envMap===null&&G.environment!==null&&(Pi.envMapIntensity.value=G.environmentIntensity),gi&&(Kt.setValue(D,"toneMappingExposure",g.toneMappingExposure),Ve.needsLights&&Xv(Pi,Hl),fe&&K.fog===!0&&oe.refreshFogUniforms(Pi,fe),oe.refreshMaterialUniforms(Pi,K,$,ie,p.state.transmissionRenderTarget[E.id]),el.upload(D,B0(Ve),Pi,Ge)),K.isShaderMaterial&&K.uniformsNeedUpdate===!0&&(el.upload(D,B0(Ve),Pi,Ge),K.uniformsNeedUpdate=!1),K.isSpriteMaterial&&Kt.setValue(D,"center",W.center),Kt.setValue(D,"modelViewMatrix",W.modelViewMatrix),Kt.setValue(D,"normalMatrix",W.normalMatrix),Kt.setValue(D,"modelMatrix",W.matrixWorld),K.isShaderMaterial||K.isRawShaderMaterial){let Kn=K.uniformsGroups;for(let ci=0,Ap=Kn.length;ci<Ap;ci++){let lo=Kn[ci];$e.update(lo,mi),$e.bind(lo,mi)}}return mi}function Xv(E,G){E.ambientLightColor.needsUpdate=G,E.lightProbe.needsUpdate=G,E.directionalLights.needsUpdate=G,E.directionalLightShadows.needsUpdate=G,E.pointLights.needsUpdate=G,E.pointLightShadows.needsUpdate=G,E.spotLights.needsUpdate=G,E.spotLightShadows.needsUpdate=G,E.rectAreaLights.needsUpdate=G,E.hemisphereLights.needsUpdate=G}function qv(E){return E.isMeshLambertMaterial||E.isMeshToonMaterial||E.isMeshPhongMaterial||E.isMeshStandardMaterial||E.isShadowMaterial||E.isShaderMaterial&&E.lights===!0}this.getActiveCubeFace=function(){return S},this.getActiveMipmapLevel=function(){return R},this.getRenderTarget=function(){return P},this.setRenderTargetTextures=function(E,G,Z){let K=we.get(E);K.__autoAllocateDepthBuffer=E.resolveDepthBuffer===!1,K.__autoAllocateDepthBuffer===!1&&(K.__useRenderToTexture=!1),we.get(E.texture).__webglTexture=G,we.get(E.depthTexture).__webglTexture=K.__autoAllocateDepthBuffer?void 0:Z,K.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(E,G){let Z=we.get(E);Z.__webglFramebuffer=G,Z.__useDefaultFramebuffer=G===void 0};let $v=D.createFramebuffer();this.setRenderTarget=function(E,G=0,Z=0){P=E,S=G,R=Z;let K=!0,W=null,fe=!1,Me=!1;if(E){let Ce=we.get(E);if(Ce.__useDefaultFramebuffer!==void 0)Te.bindFramebuffer(D.FRAMEBUFFER,null),K=!1;else if(Ce.__webglFramebuffer===void 0)Ge.setupRenderTarget(E);else if(Ce.__hasExternalTextures)Ge.rebindTextures(E,we.get(E.texture).__webglTexture,we.get(E.depthTexture).__webglTexture);else if(E.depthBuffer){let He=E.depthTexture;if(Ce.__boundDepthTexture!==He){if(He!==null&&we.has(He)&&(E.width!==He.image.width||E.height!==He.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");Ge.setupDepthRenderbuffer(E)}}let Xe=E.texture;(Xe.isData3DTexture||Xe.isDataArrayTexture||Xe.isCompressedArrayTexture)&&(Me=!0);let Ye=we.get(E).__webglFramebuffer;E.isWebGLCubeRenderTarget?(Array.isArray(Ye[G])?W=Ye[G][Z]:W=Ye[G],fe=!0):E.samples>0&&Ge.useMultisampledRTT(E)===!1?W=we.get(E).__webglMultisampledFramebuffer:Array.isArray(Ye)?W=Ye[Z]:W=Ye,C.copy(E.viewport),U.copy(E.scissor),V=E.scissorTest}else C.copy(O).multiplyScalar($).floor(),U.copy(J).multiplyScalar($).floor(),V=q;if(Z!==0&&(W=$v),Te.bindFramebuffer(D.FRAMEBUFFER,W)&&K&&Te.drawBuffers(E,W),Te.viewport(C),Te.scissor(U),Te.setScissorTest(V),fe){let Ce=we.get(E.texture);D.framebufferTexture2D(D.FRAMEBUFFER,D.COLOR_ATTACHMENT0,D.TEXTURE_CUBE_MAP_POSITIVE_X+G,Ce.__webglTexture,Z)}else if(Me){let Ce=G;for(let Xe=0;Xe<E.textures.length;Xe++){let Ye=we.get(E.textures[Xe]);D.framebufferTextureLayer(D.FRAMEBUFFER,D.COLOR_ATTACHMENT0+Xe,Ye.__webglTexture,Z,Ce)}}else if(E!==null&&Z!==0){let Ce=we.get(E.texture);D.framebufferTexture2D(D.FRAMEBUFFER,D.COLOR_ATTACHMENT0,D.TEXTURE_2D,Ce.__webglTexture,Z)}b=-1},this.readRenderTargetPixels=function(E,G,Z,K,W,fe,Me,Fe=0){if(!(E&&E.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Ce=we.get(E).__webglFramebuffer;if(E.isWebGLCubeRenderTarget&&Me!==void 0&&(Ce=Ce[Me]),Ce){Te.bindFramebuffer(D.FRAMEBUFFER,Ce);try{let Xe=E.textures[Fe],Ye=Xe.format,He=Xe.type;if(!Le.textureFormatReadable(Ye)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!Le.textureTypeReadable(He)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}G>=0&&G<=E.width-K&&Z>=0&&Z<=E.height-W&&(E.textures.length>1&&D.readBuffer(D.COLOR_ATTACHMENT0+Fe),D.readPixels(G,Z,K,W,ke.convert(Ye),ke.convert(He),fe))}finally{let Xe=P!==null?we.get(P).__webglFramebuffer:null;Te.bindFramebuffer(D.FRAMEBUFFER,Xe)}}},this.readRenderTargetPixelsAsync=async function(E,G,Z,K,W,fe,Me,Fe=0){if(!(E&&E.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Ce=we.get(E).__webglFramebuffer;if(E.isWebGLCubeRenderTarget&&Me!==void 0&&(Ce=Ce[Me]),Ce)if(G>=0&&G<=E.width-K&&Z>=0&&Z<=E.height-W){Te.bindFramebuffer(D.FRAMEBUFFER,Ce);let Xe=E.textures[Fe],Ye=Xe.format,He=Xe.type;if(!Le.textureFormatReadable(Ye))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!Le.textureTypeReadable(He))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");let at=D.createBuffer();D.bindBuffer(D.PIXEL_PACK_BUFFER,at),D.bufferData(D.PIXEL_PACK_BUFFER,fe.byteLength,D.STREAM_READ),E.textures.length>1&&D.readBuffer(D.COLOR_ATTACHMENT0+Fe),D.readPixels(G,Z,K,W,ke.convert(Ye),ke.convert(He),0);let At=P!==null?we.get(P).__webglFramebuffer:null;Te.bindFramebuffer(D.FRAMEBUFFER,At);let tn=D.fenceSync(D.SYNC_GPU_COMMANDS_COMPLETE,0);return D.flush(),await Xx(D,tn,4),D.bindBuffer(D.PIXEL_PACK_BUFFER,at),D.getBufferSubData(D.PIXEL_PACK_BUFFER,0,fe),D.deleteBuffer(at),D.deleteSync(tn),fe}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(E,G=null,Z=0){let K=Math.pow(2,-Z),W=Math.floor(E.image.width*K),fe=Math.floor(E.image.height*K),Me=G!==null?G.x:0,Fe=G!==null?G.y:0;Ge.setTexture2D(E,0),D.copyTexSubImage2D(D.TEXTURE_2D,Z,0,0,Me,Fe,W,fe),Te.unbindTexture()};let Yv=D.createFramebuffer(),Zv=D.createFramebuffer();this.copyTextureToTexture=function(E,G,Z=null,K=null,W=0,fe=null){fe===null&&(W!==0?(Oa("WebGLRenderer: copyTextureToTexture function signature has changed to support src and dst mipmap levels."),fe=W,W=0):fe=0);let Me,Fe,Ce,Xe,Ye,He,at,At,tn,Ot=E.isCompressedTexture?E.mipmaps[fe]:E.image;if(Z!==null)Me=Z.max.x-Z.min.x,Fe=Z.max.y-Z.min.y,Ce=Z.isBox3?Z.max.z-Z.min.z:1,Xe=Z.min.x,Ye=Z.min.y,He=Z.isBox3?Z.min.z:0;else{let Ii=Math.pow(2,-W);Me=Math.floor(Ot.width*Ii),Fe=Math.floor(Ot.height*Ii),E.isDataArrayTexture?Ce=Ot.depth:E.isData3DTexture?Ce=Math.floor(Ot.depth*Ii):Ce=1,Xe=0,Ye=0,He=0}K!==null?(at=K.x,At=K.y,tn=K.z):(at=0,At=0,tn=0);let Ct=ke.convert(G.format),Ve=ke.convert(G.type),Zt;G.isData3DTexture?(Ge.setTexture3D(G,0),Zt=D.TEXTURE_3D):G.isDataArrayTexture||G.isCompressedArrayTexture?(Ge.setTexture2DArray(G,0),Zt=D.TEXTURE_2D_ARRAY):(Ge.setTexture2D(G,0),Zt=D.TEXTURE_2D),D.pixelStorei(D.UNPACK_FLIP_Y_WEBGL,G.flipY),D.pixelStorei(D.UNPACK_PREMULTIPLY_ALPHA_WEBGL,G.premultiplyAlpha),D.pixelStorei(D.UNPACK_ALIGNMENT,G.unpackAlignment);let dt=D.getParameter(D.UNPACK_ROW_LENGTH),mi=D.getParameter(D.UNPACK_IMAGE_HEIGHT),ga=D.getParameter(D.UNPACK_SKIP_PIXELS),gi=D.getParameter(D.UNPACK_SKIP_ROWS),Hl=D.getParameter(D.UNPACK_SKIP_IMAGES);D.pixelStorei(D.UNPACK_ROW_LENGTH,Ot.width),D.pixelStorei(D.UNPACK_IMAGE_HEIGHT,Ot.height),D.pixelStorei(D.UNPACK_SKIP_PIXELS,Xe),D.pixelStorei(D.UNPACK_SKIP_ROWS,Ye),D.pixelStorei(D.UNPACK_SKIP_IMAGES,He);let Kt=E.isDataArrayTexture||E.isData3DTexture,Pi=G.isDataArrayTexture||G.isData3DTexture;if(E.isDepthTexture){let Ii=we.get(E),Kn=we.get(G),ci=we.get(Ii.__renderTarget),Ap=we.get(Kn.__renderTarget);Te.bindFramebuffer(D.READ_FRAMEBUFFER,ci.__webglFramebuffer),Te.bindFramebuffer(D.DRAW_FRAMEBUFFER,Ap.__webglFramebuffer);for(let lo=0;lo<Ce;lo++)Kt&&(D.framebufferTextureLayer(D.READ_FRAMEBUFFER,D.COLOR_ATTACHMENT0,we.get(E).__webglTexture,W,He+lo),D.framebufferTextureLayer(D.DRAW_FRAMEBUFFER,D.COLOR_ATTACHMENT0,we.get(G).__webglTexture,fe,tn+lo)),D.blitFramebuffer(Xe,Ye,Me,Fe,at,At,Me,Fe,D.DEPTH_BUFFER_BIT,D.NEAREST);Te.bindFramebuffer(D.READ_FRAMEBUFFER,null),Te.bindFramebuffer(D.DRAW_FRAMEBUFFER,null)}else if(W!==0||E.isRenderTargetTexture||we.has(E)){let Ii=we.get(E),Kn=we.get(G);Te.bindFramebuffer(D.READ_FRAMEBUFFER,Yv),Te.bindFramebuffer(D.DRAW_FRAMEBUFFER,Zv);for(let ci=0;ci<Ce;ci++)Kt?D.framebufferTextureLayer(D.READ_FRAMEBUFFER,D.COLOR_ATTACHMENT0,Ii.__webglTexture,W,He+ci):D.framebufferTexture2D(D.READ_FRAMEBUFFER,D.COLOR_ATTACHMENT0,D.TEXTURE_2D,Ii.__webglTexture,W),Pi?D.framebufferTextureLayer(D.DRAW_FRAMEBUFFER,D.COLOR_ATTACHMENT0,Kn.__webglTexture,fe,tn+ci):D.framebufferTexture2D(D.DRAW_FRAMEBUFFER,D.COLOR_ATTACHMENT0,D.TEXTURE_2D,Kn.__webglTexture,fe),W!==0?D.blitFramebuffer(Xe,Ye,Me,Fe,at,At,Me,Fe,D.COLOR_BUFFER_BIT,D.NEAREST):Pi?D.copyTexSubImage3D(Zt,fe,at,At,tn+ci,Xe,Ye,Me,Fe):D.copyTexSubImage2D(Zt,fe,at,At,Xe,Ye,Me,Fe);Te.bindFramebuffer(D.READ_FRAMEBUFFER,null),Te.bindFramebuffer(D.DRAW_FRAMEBUFFER,null)}else Pi?E.isDataTexture||E.isData3DTexture?D.texSubImage3D(Zt,fe,at,At,tn,Me,Fe,Ce,Ct,Ve,Ot.data):G.isCompressedArrayTexture?D.compressedTexSubImage3D(Zt,fe,at,At,tn,Me,Fe,Ce,Ct,Ot.data):D.texSubImage3D(Zt,fe,at,At,tn,Me,Fe,Ce,Ct,Ve,Ot):E.isDataTexture?D.texSubImage2D(D.TEXTURE_2D,fe,at,At,Me,Fe,Ct,Ve,Ot.data):E.isCompressedTexture?D.compressedTexSubImage2D(D.TEXTURE_2D,fe,at,At,Ot.width,Ot.height,Ct,Ot.data):D.texSubImage2D(D.TEXTURE_2D,fe,at,At,Me,Fe,Ct,Ve,Ot);D.pixelStorei(D.UNPACK_ROW_LENGTH,dt),D.pixelStorei(D.UNPACK_IMAGE_HEIGHT,mi),D.pixelStorei(D.UNPACK_SKIP_PIXELS,ga),D.pixelStorei(D.UNPACK_SKIP_ROWS,gi),D.pixelStorei(D.UNPACK_SKIP_IMAGES,Hl),fe===0&&G.generateMipmaps&&D.generateMipmap(Zt),Te.unbindTexture()},this.initRenderTarget=function(E){we.get(E).__webglFramebuffer===void 0&&Ge.setupRenderTarget(E)},this.initTexture=function(E){E.isCubeTexture?Ge.setTextureCube(E,0):E.isData3DTexture?Ge.setTexture3D(E,0):E.isDataArrayTexture||E.isCompressedArrayTexture?Ge.setTexture2DArray(E,0):Ge.setTexture2D(E,0),Te.unbindTexture()},this.resetState=function(){S=0,R=0,P=null,Te.reset(),xe.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Ki}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;let t=this.getContext();t.drawingBufferColorSpace=lt._getDrawingBufferColorSpace(e),t.unpackColorSpace=lt._getUnpackColorSpace()}};var Sy={type:"change"},Wm={type:"start"},Ay={type:"end"},Vd=new _o,wy=new Jn,IA=Math.cos(70*Hc.DEG2RAD),wn=new L,di=2*Math.PI,Tt={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_PAN:4,TOUCH_DOLLY_PAN:5,TOUCH_DOLLY_ROTATE:6},Gm=1e-6,Gd=class extends Nc{constructor(e,t=null){super(e,t),this.state=Tt.NONE,this.target=new L,this.cursor=new L,this.minDistance=0,this.maxDistance=1/0,this.minZoom=0,this.maxZoom=1/0,this.minTargetRadius=0,this.maxTargetRadius=1/0,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.minAzimuthAngle=-1/0,this.maxAzimuthAngle=1/0,this.enableDamping=!1,this.dampingFactor=.05,this.enableZoom=!0,this.zoomSpeed=1,this.enableRotate=!0,this.rotateSpeed=1,this.keyRotateSpeed=1,this.enablePan=!0,this.panSpeed=1,this.screenSpacePanning=!0,this.keyPanSpeed=7,this.zoomToCursor=!1,this.autoRotate=!1,this.autoRotateSpeed=2,this.keys={LEFT:"ArrowLeft",UP:"ArrowUp",RIGHT:"ArrowRight",BOTTOM:"ArrowDown"},this.mouseButtons={LEFT:Lr.ROTATE,MIDDLE:Lr.DOLLY,RIGHT:Lr.PAN},this.touches={ONE:Ur.ROTATE,TWO:Ur.DOLLY_PAN},this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.zoom0=this.object.zoom,this._domElementKeyEvents=null,this._lastPosition=new L,this._lastQuaternion=new nn,this._lastTargetPosition=new L,this._quat=new nn().setFromUnitVectors(e.up,new L(0,1,0)),this._quatInverse=this._quat.clone().invert(),this._spherical=new Ya,this._sphericalDelta=new Ya,this._scale=1,this._panOffset=new L,this._rotateStart=new ae,this._rotateEnd=new ae,this._rotateDelta=new ae,this._panStart=new ae,this._panEnd=new ae,this._panDelta=new ae,this._dollyStart=new ae,this._dollyEnd=new ae,this._dollyDelta=new ae,this._dollyDirection=new L,this._mouse=new ae,this._performCursorZoom=!1,this._pointers=[],this._pointerPositions={},this._controlActive=!1,this._onPointerMove=DA.bind(this),this._onPointerDown=NA.bind(this),this._onPointerUp=LA.bind(this),this._onContextMenu=HA.bind(this),this._onMouseWheel=OA.bind(this),this._onKeyDown=BA.bind(this),this._onTouchStart=kA.bind(this),this._onTouchMove=zA.bind(this),this._onMouseDown=UA.bind(this),this._onMouseMove=FA.bind(this),this._interceptControlDown=VA.bind(this),this._interceptControlUp=GA.bind(this),this.domElement!==null&&this.connect(this.domElement),this.update()}connect(e){super.connect(e),this.domElement.addEventListener("pointerdown",this._onPointerDown),this.domElement.addEventListener("pointercancel",this._onPointerUp),this.domElement.addEventListener("contextmenu",this._onContextMenu),this.domElement.addEventListener("wheel",this._onMouseWheel,{passive:!1}),this.domElement.getRootNode().addEventListener("keydown",this._interceptControlDown,{passive:!0,capture:!0}),this.domElement.style.touchAction="none"}disconnect(){this.domElement.removeEventListener("pointerdown",this._onPointerDown),this.domElement.removeEventListener("pointermove",this._onPointerMove),this.domElement.removeEventListener("pointerup",this._onPointerUp),this.domElement.removeEventListener("pointercancel",this._onPointerUp),this.domElement.removeEventListener("wheel",this._onMouseWheel),this.domElement.removeEventListener("contextmenu",this._onContextMenu),this.stopListenToKeyEvents(),this.domElement.getRootNode().removeEventListener("keydown",this._interceptControlDown,{capture:!0}),this.domElement.style.touchAction="auto"}dispose(){this.disconnect()}getPolarAngle(){return this._spherical.phi}getAzimuthalAngle(){return this._spherical.theta}getDistance(){return this.object.position.distanceTo(this.target)}listenToKeyEvents(e){e.addEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=e}stopListenToKeyEvents(){this._domElementKeyEvents!==null&&(this._domElementKeyEvents.removeEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=null)}saveState(){this.target0.copy(this.target),this.position0.copy(this.object.position),this.zoom0=this.object.zoom}reset(){this.target.copy(this.target0),this.object.position.copy(this.position0),this.object.zoom=this.zoom0,this.object.updateProjectionMatrix(),this.dispatchEvent(Sy),this.update(),this.state=Tt.NONE}update(e=null){let t=this.object.position;wn.copy(t).sub(this.target),wn.applyQuaternion(this._quat),this._spherical.setFromVector3(wn),this.autoRotate&&this.state===Tt.NONE&&this._rotateLeft(this._getAutoRotationAngle(e)),this.enableDamping?(this._spherical.theta+=this._sphericalDelta.theta*this.dampingFactor,this._spherical.phi+=this._sphericalDelta.phi*this.dampingFactor):(this._spherical.theta+=this._sphericalDelta.theta,this._spherical.phi+=this._sphericalDelta.phi);let i=this.minAzimuthAngle,s=this.maxAzimuthAngle;isFinite(i)&&isFinite(s)&&(i<-Math.PI?i+=di:i>Math.PI&&(i-=di),s<-Math.PI?s+=di:s>Math.PI&&(s-=di),i<=s?this._spherical.theta=Math.max(i,Math.min(s,this._spherical.theta)):this._spherical.theta=this._spherical.theta>(i+s)/2?Math.max(i,this._spherical.theta):Math.min(s,this._spherical.theta)),this._spherical.phi=Math.max(this.minPolarAngle,Math.min(this.maxPolarAngle,this._spherical.phi)),this._spherical.makeSafe(),this.enableDamping===!0?this.target.addScaledVector(this._panOffset,this.dampingFactor):this.target.add(this._panOffset),this.target.sub(this.cursor),this.target.clampLength(this.minTargetRadius,this.maxTargetRadius),this.target.add(this.cursor);let r=!1;if(this.zoomToCursor&&this._performCursorZoom||this.object.isOrthographicCamera)this._spherical.radius=this._clampDistance(this._spherical.radius);else{let o=this._spherical.radius;this._spherical.radius=this._clampDistance(this._spherical.radius*this._scale),r=o!=this._spherical.radius}if(wn.setFromSpherical(this._spherical),wn.applyQuaternion(this._quatInverse),t.copy(this.target).add(wn),this.object.lookAt(this.target),this.enableDamping===!0?(this._sphericalDelta.theta*=1-this.dampingFactor,this._sphericalDelta.phi*=1-this.dampingFactor,this._panOffset.multiplyScalar(1-this.dampingFactor)):(this._sphericalDelta.set(0,0,0),this._panOffset.set(0,0,0)),this.zoomToCursor&&this._performCursorZoom){let o=null;if(this.object.isPerspectiveCamera){let a=wn.length();o=this._clampDistance(a*this._scale);let c=a-o;this.object.position.addScaledVector(this._dollyDirection,c),this.object.updateMatrixWorld(),r=!!c}else if(this.object.isOrthographicCamera){let a=new L(this._mouse.x,this._mouse.y,0);a.unproject(this.object);let c=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),this.object.updateProjectionMatrix(),r=c!==this.object.zoom;let h=new L(this._mouse.x,this._mouse.y,0);h.unproject(this.object),this.object.position.sub(h).add(a),this.object.updateMatrixWorld(),o=wn.length()}else console.warn("WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled."),this.zoomToCursor=!1;o!==null&&(this.screenSpacePanning?this.target.set(0,0,-1).transformDirection(this.object.matrix).multiplyScalar(o).add(this.object.position):(Vd.origin.copy(this.object.position),Vd.direction.set(0,0,-1).transformDirection(this.object.matrix),Math.abs(this.object.up.dot(Vd.direction))<IA?this.object.lookAt(this.target):(wy.setFromNormalAndCoplanarPoint(this.object.up,this.target),Vd.intersectPlane(wy,this.target))))}else if(this.object.isOrthographicCamera){let o=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),o!==this.object.zoom&&(this.object.updateProjectionMatrix(),r=!0)}return this._scale=1,this._performCursorZoom=!1,r||this._lastPosition.distanceToSquared(this.object.position)>Gm||8*(1-this._lastQuaternion.dot(this.object.quaternion))>Gm||this._lastTargetPosition.distanceToSquared(this.target)>Gm?(this.dispatchEvent(Sy),this._lastPosition.copy(this.object.position),this._lastQuaternion.copy(this.object.quaternion),this._lastTargetPosition.copy(this.target),!0):!1}_getAutoRotationAngle(e){return e!==null?di/60*this.autoRotateSpeed*e:di/60/60*this.autoRotateSpeed}_getZoomScale(e){let t=Math.abs(e*.01);return Math.pow(.95,this.zoomSpeed*t)}_rotateLeft(e){this._sphericalDelta.theta-=e}_rotateUp(e){this._sphericalDelta.phi-=e}_panLeft(e,t){wn.setFromMatrixColumn(t,0),wn.multiplyScalar(-e),this._panOffset.add(wn)}_panUp(e,t){this.screenSpacePanning===!0?wn.setFromMatrixColumn(t,1):(wn.setFromMatrixColumn(t,0),wn.crossVectors(this.object.up,wn)),wn.multiplyScalar(e),this._panOffset.add(wn)}_pan(e,t){let i=this.domElement;if(this.object.isPerspectiveCamera){let s=this.object.position;wn.copy(s).sub(this.target);let r=wn.length();r*=Math.tan(this.object.fov/2*Math.PI/180),this._panLeft(2*e*r/i.clientHeight,this.object.matrix),this._panUp(2*t*r/i.clientHeight,this.object.matrix)}else this.object.isOrthographicCamera?(this._panLeft(e*(this.object.right-this.object.left)/this.object.zoom/i.clientWidth,this.object.matrix),this._panUp(t*(this.object.top-this.object.bottom)/this.object.zoom/i.clientHeight,this.object.matrix)):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."),this.enablePan=!1)}_dollyOut(e){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale/=e:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_dollyIn(e){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale*=e:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_updateZoomParameters(e,t){if(!this.zoomToCursor)return;this._performCursorZoom=!0;let i=this.domElement.getBoundingClientRect(),s=e-i.left,r=t-i.top,o=i.width,a=i.height;this._mouse.x=s/o*2-1,this._mouse.y=-(r/a)*2+1,this._dollyDirection.set(this._mouse.x,this._mouse.y,1).unproject(this.object).sub(this.object.position).normalize()}_clampDistance(e){return Math.max(this.minDistance,Math.min(this.maxDistance,e))}_handleMouseDownRotate(e){this._rotateStart.set(e.clientX,e.clientY)}_handleMouseDownDolly(e){this._updateZoomParameters(e.clientX,e.clientX),this._dollyStart.set(e.clientX,e.clientY)}_handleMouseDownPan(e){this._panStart.set(e.clientX,e.clientY)}_handleMouseMoveRotate(e){this._rotateEnd.set(e.clientX,e.clientY),this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);let t=this.domElement;this._rotateLeft(di*this._rotateDelta.x/t.clientHeight),this._rotateUp(di*this._rotateDelta.y/t.clientHeight),this._rotateStart.copy(this._rotateEnd),this.update()}_handleMouseMoveDolly(e){this._dollyEnd.set(e.clientX,e.clientY),this._dollyDelta.subVectors(this._dollyEnd,this._dollyStart),this._dollyDelta.y>0?this._dollyOut(this._getZoomScale(this._dollyDelta.y)):this._dollyDelta.y<0&&this._dollyIn(this._getZoomScale(this._dollyDelta.y)),this._dollyStart.copy(this._dollyEnd),this.update()}_handleMouseMovePan(e){this._panEnd.set(e.clientX,e.clientY),this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd),this.update()}_handleMouseWheel(e){this._updateZoomParameters(e.clientX,e.clientY),e.deltaY<0?this._dollyIn(this._getZoomScale(e.deltaY)):e.deltaY>0&&this._dollyOut(this._getZoomScale(e.deltaY)),this.update()}_handleKeyDown(e){let t=!1;switch(e.code){case this.keys.UP:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateUp(di*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,this.keyPanSpeed),t=!0;break;case this.keys.BOTTOM:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateUp(-di*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,-this.keyPanSpeed),t=!0;break;case this.keys.LEFT:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateLeft(di*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(this.keyPanSpeed,0),t=!0;break;case this.keys.RIGHT:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateLeft(-di*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(-this.keyPanSpeed,0),t=!0;break}t&&(e.preventDefault(),this.update())}_handleTouchStartRotate(e){if(this._pointers.length===1)this._rotateStart.set(e.pageX,e.pageY);else{let t=this._getSecondPointerPosition(e),i=.5*(e.pageX+t.x),s=.5*(e.pageY+t.y);this._rotateStart.set(i,s)}}_handleTouchStartPan(e){if(this._pointers.length===1)this._panStart.set(e.pageX,e.pageY);else{let t=this._getSecondPointerPosition(e),i=.5*(e.pageX+t.x),s=.5*(e.pageY+t.y);this._panStart.set(i,s)}}_handleTouchStartDolly(e){let t=this._getSecondPointerPosition(e),i=e.pageX-t.x,s=e.pageY-t.y,r=Math.sqrt(i*i+s*s);this._dollyStart.set(0,r)}_handleTouchStartDollyPan(e){this.enableZoom&&this._handleTouchStartDolly(e),this.enablePan&&this._handleTouchStartPan(e)}_handleTouchStartDollyRotate(e){this.enableZoom&&this._handleTouchStartDolly(e),this.enableRotate&&this._handleTouchStartRotate(e)}_handleTouchMoveRotate(e){if(this._pointers.length==1)this._rotateEnd.set(e.pageX,e.pageY);else{let i=this._getSecondPointerPosition(e),s=.5*(e.pageX+i.x),r=.5*(e.pageY+i.y);this._rotateEnd.set(s,r)}this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);let t=this.domElement;this._rotateLeft(di*this._rotateDelta.x/t.clientHeight),this._rotateUp(di*this._rotateDelta.y/t.clientHeight),this._rotateStart.copy(this._rotateEnd)}_handleTouchMovePan(e){if(this._pointers.length===1)this._panEnd.set(e.pageX,e.pageY);else{let t=this._getSecondPointerPosition(e),i=.5*(e.pageX+t.x),s=.5*(e.pageY+t.y);this._panEnd.set(i,s)}this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd)}_handleTouchMoveDolly(e){let t=this._getSecondPointerPosition(e),i=e.pageX-t.x,s=e.pageY-t.y,r=Math.sqrt(i*i+s*s);this._dollyEnd.set(0,r),this._dollyDelta.set(0,Math.pow(this._dollyEnd.y/this._dollyStart.y,this.zoomSpeed)),this._dollyOut(this._dollyDelta.y),this._dollyStart.copy(this._dollyEnd);let o=(e.pageX+t.x)*.5,a=(e.pageY+t.y)*.5;this._updateZoomParameters(o,a)}_handleTouchMoveDollyPan(e){this.enableZoom&&this._handleTouchMoveDolly(e),this.enablePan&&this._handleTouchMovePan(e)}_handleTouchMoveDollyRotate(e){this.enableZoom&&this._handleTouchMoveDolly(e),this.enableRotate&&this._handleTouchMoveRotate(e)}_addPointer(e){this._pointers.push(e.pointerId)}_removePointer(e){delete this._pointerPositions[e.pointerId];for(let t=0;t<this._pointers.length;t++)if(this._pointers[t]==e.pointerId){this._pointers.splice(t,1);return}}_isTrackingPointer(e){for(let t=0;t<this._pointers.length;t++)if(this._pointers[t]==e.pointerId)return!0;return!1}_trackPointer(e){let t=this._pointerPositions[e.pointerId];t===void 0&&(t=new ae,this._pointerPositions[e.pointerId]=t),t.set(e.pageX,e.pageY)}_getSecondPointerPosition(e){let t=e.pointerId===this._pointers[0]?this._pointers[1]:this._pointers[0];return this._pointerPositions[t]}_customWheelEvent(e){let t=e.deltaMode,i={clientX:e.clientX,clientY:e.clientY,deltaY:e.deltaY};switch(t){case 1:i.deltaY*=16;break;case 2:i.deltaY*=100;break}return e.ctrlKey&&!this._controlActive&&(i.deltaY*=10),i}};function NA(n){this.enabled!==!1&&(this._pointers.length===0&&(this.domElement.setPointerCapture(n.pointerId),this.domElement.addEventListener("pointermove",this._onPointerMove),this.domElement.addEventListener("pointerup",this._onPointerUp)),!this._isTrackingPointer(n)&&(this._addPointer(n),n.pointerType==="touch"?this._onTouchStart(n):this._onMouseDown(n)))}function DA(n){this.enabled!==!1&&(n.pointerType==="touch"?this._onTouchMove(n):this._onMouseMove(n))}function LA(n){switch(this._removePointer(n),this._pointers.length){case 0:this.domElement.releasePointerCapture(n.pointerId),this.domElement.removeEventListener("pointermove",this._onPointerMove),this.domElement.removeEventListener("pointerup",this._onPointerUp),this.dispatchEvent(Ay),this.state=Tt.NONE;break;case 1:let e=this._pointers[0],t=this._pointerPositions[e];this._onTouchStart({pointerId:e,pageX:t.x,pageY:t.y});break}}function UA(n){let e;switch(n.button){case 0:e=this.mouseButtons.LEFT;break;case 1:e=this.mouseButtons.MIDDLE;break;case 2:e=this.mouseButtons.RIGHT;break;default:e=-1}switch(e){case Lr.DOLLY:if(this.enableZoom===!1)return;this._handleMouseDownDolly(n),this.state=Tt.DOLLY;break;case Lr.ROTATE:if(n.ctrlKey||n.metaKey||n.shiftKey){if(this.enablePan===!1)return;this._handleMouseDownPan(n),this.state=Tt.PAN}else{if(this.enableRotate===!1)return;this._handleMouseDownRotate(n),this.state=Tt.ROTATE}break;case Lr.PAN:if(n.ctrlKey||n.metaKey||n.shiftKey){if(this.enableRotate===!1)return;this._handleMouseDownRotate(n),this.state=Tt.ROTATE}else{if(this.enablePan===!1)return;this._handleMouseDownPan(n),this.state=Tt.PAN}break;default:this.state=Tt.NONE}this.state!==Tt.NONE&&this.dispatchEvent(Wm)}function FA(n){switch(this.state){case Tt.ROTATE:if(this.enableRotate===!1)return;this._handleMouseMoveRotate(n);break;case Tt.DOLLY:if(this.enableZoom===!1)return;this._handleMouseMoveDolly(n);break;case Tt.PAN:if(this.enablePan===!1)return;this._handleMouseMovePan(n);break}}function OA(n){this.enabled===!1||this.enableZoom===!1||this.state!==Tt.NONE||(n.preventDefault(),this.dispatchEvent(Wm),this._handleMouseWheel(this._customWheelEvent(n)),this.dispatchEvent(Ay))}function BA(n){this.enabled!==!1&&this._handleKeyDown(n)}function kA(n){switch(this._trackPointer(n),this._pointers.length){case 1:switch(this.touches.ONE){case Ur.ROTATE:if(this.enableRotate===!1)return;this._handleTouchStartRotate(n),this.state=Tt.TOUCH_ROTATE;break;case Ur.PAN:if(this.enablePan===!1)return;this._handleTouchStartPan(n),this.state=Tt.TOUCH_PAN;break;default:this.state=Tt.NONE}break;case 2:switch(this.touches.TWO){case Ur.DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchStartDollyPan(n),this.state=Tt.TOUCH_DOLLY_PAN;break;case Ur.DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchStartDollyRotate(n),this.state=Tt.TOUCH_DOLLY_ROTATE;break;default:this.state=Tt.NONE}break;default:this.state=Tt.NONE}this.state!==Tt.NONE&&this.dispatchEvent(Wm)}function zA(n){switch(this._trackPointer(n),this.state){case Tt.TOUCH_ROTATE:if(this.enableRotate===!1)return;this._handleTouchMoveRotate(n),this.update();break;case Tt.TOUCH_PAN:if(this.enablePan===!1)return;this._handleTouchMovePan(n),this.update();break;case Tt.TOUCH_DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchMoveDollyPan(n),this.update();break;case Tt.TOUCH_DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchMoveDollyRotate(n),this.update();break;default:this.state=Tt.NONE}}function HA(n){this.enabled!==!1&&n.preventDefault()}function VA(n){n.key==="Control"&&(this._controlActive=!0,this.domElement.getRootNode().addEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}function GA(n){n.key==="Control"&&(this._controlActive=!1,this.domElement.getRootNode().removeEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}var Cs={name:"CopyShader",uniforms:{tDiffuse:{value:null},opacity:{value:1}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform float opacity;

		uniform sampler2D tDiffuse;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );
			gl_FragColor = opacity * texel;


		}`};var ti=class{constructor(){this.isPass=!0,this.enabled=!0,this.needsSwap=!0,this.clear=!1,this.renderToScreen=!1}setSize(){}render(){console.error("THREE.Pass: .render() must be implemented in derived pass.")}dispose(){}},WA=new wo(-1,1,1,-1,0,1),Xm=class extends fn{constructor(){super(),this.setAttribute("position",new Ut([-1,3,0,-1,-1,0,3,-1,0],3)),this.setAttribute("uv",new Ut([0,2,0,0,2,0],2))}},XA=new Xm,Ps=class{constructor(e){this._mesh=new nt(XA,e)}dispose(){this._mesh.geometry.dispose()}render(e){e.render(this._mesh,WA)}get material(){return this._mesh.material}set material(e){this._mesh.material=e}};var il=class extends ti{constructor(e,t="tDiffuse"){super(),this.textureID=t,this.uniforms=null,this.material=null,e instanceof Pt?(this.uniforms=e.uniforms,this.material=e):e&&(this.uniforms=ui.clone(e.uniforms),this.material=new Pt({name:e.name!==void 0?e.name:"unspecified",defines:Object.assign({},e.defines),uniforms:this.uniforms,vertexShader:e.vertexShader,fragmentShader:e.fragmentShader})),this._fsQuad=new Ps(this.material)}render(e,t,i){this.uniforms[this.textureID]&&(this.uniforms[this.textureID].value=i.texture),this._fsQuad.material=this.material,this.renderToScreen?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(t),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this._fsQuad.render(e))}dispose(){this.material.dispose(),this._fsQuad.dispose()}};var Gc=class extends ti{constructor(e,t){super(),this.scene=e,this.camera=t,this.clear=!0,this.needsSwap=!1,this.inverse=!1}render(e,t,i){let s=e.getContext(),r=e.state;r.buffers.color.setMask(!1),r.buffers.depth.setMask(!1),r.buffers.color.setLocked(!0),r.buffers.depth.setLocked(!0);let o,a;this.inverse?(o=0,a=1):(o=1,a=0),r.buffers.stencil.setTest(!0),r.buffers.stencil.setOp(s.REPLACE,s.REPLACE,s.REPLACE),r.buffers.stencil.setFunc(s.ALWAYS,o,4294967295),r.buffers.stencil.setClear(a),r.buffers.stencil.setLocked(!0),e.setRenderTarget(i),this.clear&&e.clear(),e.render(this.scene,this.camera),e.setRenderTarget(t),this.clear&&e.clear(),e.render(this.scene,this.camera),r.buffers.color.setLocked(!1),r.buffers.depth.setLocked(!1),r.buffers.color.setMask(!0),r.buffers.depth.setMask(!0),r.buffers.stencil.setLocked(!1),r.buffers.stencil.setFunc(s.EQUAL,1,4294967295),r.buffers.stencil.setOp(s.KEEP,s.KEEP,s.KEEP),r.buffers.stencil.setLocked(!0)}},Wd=class extends ti{constructor(){super(),this.needsSwap=!1}render(e){e.state.buffers.stencil.setLocked(!1),e.state.buffers.stencil.setTest(!1)}};var Xd=class{constructor(e,t){if(this.renderer=e,this._pixelRatio=e.getPixelRatio(),t===void 0){let i=e.getSize(new ae);this._width=i.width,this._height=i.height,t=new ln(this._width*this._pixelRatio,this._height*this._pixelRatio,{type:zn}),t.texture.name="EffectComposer.rt1"}else this._width=t.width,this._height=t.height;this.renderTarget1=t,this.renderTarget2=t.clone(),this.renderTarget2.texture.name="EffectComposer.rt2",this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2,this.renderToScreen=!0,this.passes=[],this.copyPass=new il(Cs),this.copyPass.material.blending=Rn,this.clock=new Pc}swapBuffers(){let e=this.readBuffer;this.readBuffer=this.writeBuffer,this.writeBuffer=e}addPass(e){this.passes.push(e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}insertPass(e,t){this.passes.splice(t,0,e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}removePass(e){let t=this.passes.indexOf(e);t!==-1&&this.passes.splice(t,1)}isLastEnabledPass(e){for(let t=e+1;t<this.passes.length;t++)if(this.passes[t].enabled)return!1;return!0}render(e){e===void 0&&(e=this.clock.getDelta());let t=this.renderer.getRenderTarget(),i=!1;for(let s=0,r=this.passes.length;s<r;s++){let o=this.passes[s];if(o.enabled!==!1){if(o.renderToScreen=this.renderToScreen&&this.isLastEnabledPass(s),o.render(this.renderer,this.writeBuffer,this.readBuffer,e,i),o.needsSwap){if(i){let a=this.renderer.getContext(),c=this.renderer.state.buffers.stencil;c.setFunc(a.NOTEQUAL,1,4294967295),this.copyPass.render(this.renderer,this.writeBuffer,this.readBuffer,e),c.setFunc(a.EQUAL,1,4294967295)}this.swapBuffers()}Gc!==void 0&&(o instanceof Gc?i=!0:o instanceof Wd&&(i=!1))}}this.renderer.setRenderTarget(t)}reset(e){if(e===void 0){let t=this.renderer.getSize(new ae);this._pixelRatio=this.renderer.getPixelRatio(),this._width=t.width,this._height=t.height,e=this.renderTarget1.clone(),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.renderTarget1=e,this.renderTarget2=e.clone(),this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2}setSize(e,t){this._width=e,this._height=t;let i=this._width*this._pixelRatio,s=this._height*this._pixelRatio;this.renderTarget1.setSize(i,s),this.renderTarget2.setSize(i,s);for(let r=0;r<this.passes.length;r++)this.passes[r].setSize(i,s)}setPixelRatio(e){this._pixelRatio=e,this.setSize(this._width,this._height)}dispose(){this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.copyPass.dispose()}};var qd=class extends ti{constructor(e,t,i=null,s=null,r=null){super(),this.scene=e,this.camera=t,this.overrideMaterial=i,this.clearColor=s,this.clearAlpha=r,this.clear=!0,this.clearDepth=!1,this.needsSwap=!1,this._oldClearColor=new Ee}render(e,t,i){let s=e.autoClear;e.autoClear=!1;let r,o;this.overrideMaterial!==null&&(o=this.scene.overrideMaterial,this.scene.overrideMaterial=this.overrideMaterial),this.clearColor!==null&&(e.getClearColor(this._oldClearColor),e.setClearColor(this.clearColor,e.getClearAlpha())),this.clearAlpha!==null&&(r=e.getClearAlpha(),e.setClearAlpha(this.clearAlpha)),this.clearDepth==!0&&e.clearDepth(),e.setRenderTarget(this.renderToScreen?null:i),this.clear===!0&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),e.render(this.scene,this.camera),this.clearColor!==null&&e.setClearColor(this._oldClearColor),this.clearAlpha!==null&&e.setClearAlpha(r),this.overrideMaterial!==null&&(this.scene.overrideMaterial=o),e.autoClear=s}};var $d=class{constructor(e=Math){this.grad3=[[1,1,0],[-1,1,0],[1,-1,0],[-1,-1,0],[1,0,1],[-1,0,1],[1,0,-1],[-1,0,-1],[0,1,1],[0,-1,1],[0,1,-1],[0,-1,-1]],this.grad4=[[0,1,1,1],[0,1,1,-1],[0,1,-1,1],[0,1,-1,-1],[0,-1,1,1],[0,-1,1,-1],[0,-1,-1,1],[0,-1,-1,-1],[1,0,1,1],[1,0,1,-1],[1,0,-1,1],[1,0,-1,-1],[-1,0,1,1],[-1,0,1,-1],[-1,0,-1,1],[-1,0,-1,-1],[1,1,0,1],[1,1,0,-1],[1,-1,0,1],[1,-1,0,-1],[-1,1,0,1],[-1,1,0,-1],[-1,-1,0,1],[-1,-1,0,-1],[1,1,1,0],[1,1,-1,0],[1,-1,1,0],[1,-1,-1,0],[-1,1,1,0],[-1,1,-1,0],[-1,-1,1,0],[-1,-1,-1,0]],this.p=[];for(let t=0;t<256;t++)this.p[t]=Math.floor(e.random()*256);this.perm=[];for(let t=0;t<512;t++)this.perm[t]=this.p[t&255];this.simplex=[[0,1,2,3],[0,1,3,2],[0,0,0,0],[0,2,3,1],[0,0,0,0],[0,0,0,0],[0,0,0,0],[1,2,3,0],[0,2,1,3],[0,0,0,0],[0,3,1,2],[0,3,2,1],[0,0,0,0],[0,0,0,0],[0,0,0,0],[1,3,2,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[1,2,0,3],[0,0,0,0],[1,3,0,2],[0,0,0,0],[0,0,0,0],[0,0,0,0],[2,3,0,1],[2,3,1,0],[1,0,2,3],[1,0,3,2],[0,0,0,0],[0,0,0,0],[0,0,0,0],[2,0,3,1],[0,0,0,0],[2,1,3,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[2,0,1,3],[0,0,0,0],[0,0,0,0],[0,0,0,0],[3,0,1,2],[3,0,2,1],[0,0,0,0],[3,1,2,0],[2,1,0,3],[0,0,0,0],[0,0,0,0],[0,0,0,0],[3,1,0,2],[0,0,0,0],[3,2,0,1],[3,2,1,0]]}noise(e,t){let i,s,r,o=.5*(Math.sqrt(3)-1),a=(e+t)*o,c=Math.floor(e+a),h=Math.floor(t+a),l=(3-Math.sqrt(3))/6,d=(c+h)*l,u=c-d,f=h-d,x=e-u,y=t-f,m,p;x>y?(m=1,p=0):(m=0,p=1);let w=x-m+l,v=y-p+l,g=x-1+2*l,_=y-1+2*l,S=c&255,R=h&255,P=this.perm[S+this.perm[R]]%12,b=this.perm[S+m+this.perm[R+p]]%12,M=this.perm[S+1+this.perm[R+1]]%12,C=.5-x*x-y*y;C<0?i=0:(C*=C,i=C*C*this._dot(this.grad3[P],x,y));let U=.5-w*w-v*v;U<0?s=0:(U*=U,s=U*U*this._dot(this.grad3[b],w,v));let V=.5-g*g-_*_;return V<0?r=0:(V*=V,r=V*V*this._dot(this.grad3[M],g,_)),70*(i+s+r)}noise3d(e,t,i){let s,r,o,a,h=(e+t+i)*.3333333333333333,l=Math.floor(e+h),d=Math.floor(t+h),u=Math.floor(i+h),f=1/6,x=(l+d+u)*f,y=l-x,m=d-x,p=u-x,w=e-y,v=t-m,g=i-p,_,S,R,P,b,M;w>=v?v>=g?(_=1,S=0,R=0,P=1,b=1,M=0):w>=g?(_=1,S=0,R=0,P=1,b=0,M=1):(_=0,S=0,R=1,P=1,b=0,M=1):v<g?(_=0,S=0,R=1,P=0,b=1,M=1):w<g?(_=0,S=1,R=0,P=0,b=1,M=1):(_=0,S=1,R=0,P=1,b=1,M=0);let C=w-_+f,U=v-S+f,V=g-R+f,H=w-P+2*f,k=v-b+2*f,z=g-M+2*f,ie=w-1+3*f,$=v-1+3*f,te=g-1+3*f,F=l&255,O=d&255,J=u&255,q=this.perm[F+this.perm[O+this.perm[J]]]%12,le=this.perm[F+_+this.perm[O+S+this.perm[J+R]]]%12,Se=this.perm[F+P+this.perm[O+b+this.perm[J+M]]]%12,Y=this.perm[F+1+this.perm[O+1+this.perm[J+1]]]%12,j=.6-w*w-v*v-g*g;j<0?s=0:(j*=j,s=j*j*this._dot3(this.grad3[q],w,v,g));let he=.6-C*C-U*U-V*V;he<0?r=0:(he*=he,r=he*he*this._dot3(this.grad3[le],C,U,V));let De=.6-H*H-k*k-z*z;De<0?o=0:(De*=De,o=De*De*this._dot3(this.grad3[Se],H,k,z));let ve=.6-ie*ie-$*$-te*te;return ve<0?a=0:(ve*=ve,a=ve*ve*this._dot3(this.grad3[Y],ie,$,te)),32*(s+r+o+a)}noise4d(e,t,i,s){let r=this.grad4,o=this.simplex,a=this.perm,c=(Math.sqrt(5)-1)/4,h=(5-Math.sqrt(5))/20,l,d,u,f,x,y=(e+t+i+s)*c,m=Math.floor(e+y),p=Math.floor(t+y),w=Math.floor(i+y),v=Math.floor(s+y),g=(m+p+w+v)*h,_=m-g,S=p-g,R=w-g,P=v-g,b=e-_,M=t-S,C=i-R,U=s-P,V=b>M?32:0,H=b>C?16:0,k=M>C?8:0,z=b>U?4:0,ie=M>U?2:0,$=C>U?1:0,te=V+H+k+z+ie+$,F=o[te][0]>=3?1:0,O=o[te][1]>=3?1:0,J=o[te][2]>=3?1:0,q=o[te][3]>=3?1:0,le=o[te][0]>=2?1:0,Se=o[te][1]>=2?1:0,Y=o[te][2]>=2?1:0,j=o[te][3]>=2?1:0,he=o[te][0]>=1?1:0,De=o[te][1]>=1?1:0,ve=o[te][2]>=1?1:0,ge=o[te][3]>=1?1:0,ot=b-F+h,D=M-O+h,Ze=C-J+h,Pe=U-q+h,Le=b-le+2*h,Te=M-Se+2*h,_t=C-Y+2*h,we=U-j+2*h,Ge=b-he+3*h,en=M-De+3*h,Ft=C-ve+3*h,I=U-ge+3*h,A=b-1+4*h,X=M-1+4*h,ee=C-1+4*h,oe=U-1+4*h,Q=m&255,Ue=p&255,pe=w&255,Ie=v&255,Be=a[Q+a[Ue+a[pe+a[Ie]]]]%32,de=a[Q+F+a[Ue+O+a[pe+J+a[Ie+q]]]]%32,be=a[Q+le+a[Ue+Se+a[pe+Y+a[Ie+j]]]]%32,We=a[Q+he+a[Ue+De+a[pe+ve+a[Ie+ge]]]]%32,ke=a[Q+1+a[Ue+1+a[pe+1+a[Ie+1]]]]%32,xe=.6-b*b-M*M-C*C-U*U;xe<0?l=0:(xe*=xe,l=xe*xe*this._dot4(r[Be],b,M,C,U));let $e=.6-ot*ot-D*D-Ze*Ze-Pe*Pe;$e<0?d=0:($e*=$e,d=$e*$e*this._dot4(r[de],ot,D,Ze,Pe));let B=.6-Le*Le-Te*Te-_t*_t-we*we;B<0?u=0:(B*=B,u=B*B*this._dot4(r[be],Le,Te,_t,we));let ce=.6-Ge*Ge-en*en-Ft*Ft-I*I;ce<0?f=0:(ce*=ce,f=ce*ce*this._dot4(r[We],Ge,en,Ft,I));let me=.6-A*A-X*X-ee*ee-oe*oe;return me<0?x=0:(me*=me,x=me*me*this._dot4(r[ke],A,X,ee,oe)),27*(l+d+u+f+x)}_dot(e,t,i){return e[0]*t+e[1]*i}_dot3(e,t,i,s){return e[0]*t+e[1]*i+e[2]*s}_dot4(e,t,i,s,r){return e[0]*t+e[1]*i+e[2]*s+e[3]*r}};var Wc={name:"SSAOShader",defines:{PERSPECTIVE_CAMERA:1,KERNEL_SIZE:32},uniforms:{tNormal:{value:null},tDepth:{value:null},tNoise:{value:null},kernel:{value:null},cameraNear:{value:null},cameraFar:{value:null},resolution:{value:new ae},cameraProjectionMatrix:{value:new ut},cameraInverseProjectionMatrix:{value:new ut},kernelRadius:{value:8},minDistance:{value:.005},maxDistance:{value:.05}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;

			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`
		uniform highp sampler2D tNormal;
		uniform highp sampler2D tDepth;
		uniform sampler2D tNoise;

		uniform vec3 kernel[ KERNEL_SIZE ];

		uniform vec2 resolution;

		uniform float cameraNear;
		uniform float cameraFar;
		uniform mat4 cameraProjectionMatrix;
		uniform mat4 cameraInverseProjectionMatrix;

		uniform float kernelRadius;
		uniform float minDistance; // avoid artifacts caused by neighbour fragments with minimal depth difference
		uniform float maxDistance; // avoid the influence of fragments which are too far away

		varying vec2 vUv;

		#include <packing>

		float getDepth( const in vec2 screenPosition ) {

			return texture2D( tDepth, screenPosition ).x;

		}

		float getLinearDepth( const in vec2 screenPosition ) {

			#if PERSPECTIVE_CAMERA == 1

				float fragCoordZ = texture2D( tDepth, screenPosition ).x;
				float viewZ = perspectiveDepthToViewZ( fragCoordZ, cameraNear, cameraFar );
				return viewZToOrthographicDepth( viewZ, cameraNear, cameraFar );

			#else

				return texture2D( tDepth, screenPosition ).x;

			#endif

		}

		float getViewZ( const in float depth ) {

			#if PERSPECTIVE_CAMERA == 1

				return perspectiveDepthToViewZ( depth, cameraNear, cameraFar );

			#else

				return orthographicDepthToViewZ( depth, cameraNear, cameraFar );

			#endif

		}

		vec3 getViewPosition( const in vec2 screenPosition, const in float depth, const in float viewZ ) {

			float clipW = cameraProjectionMatrix[2][3] * viewZ + cameraProjectionMatrix[3][3];

			vec4 clipPosition = vec4( ( vec3( screenPosition, depth ) - 0.5 ) * 2.0, 1.0 );

			clipPosition *= clipW; // unprojection.

			return ( cameraInverseProjectionMatrix * clipPosition ).xyz;

		}

		vec3 getViewNormal( const in vec2 screenPosition ) {

			return unpackRGBToNormal( texture2D( tNormal, screenPosition ).xyz );

		}

		void main() {

			float depth = getDepth( vUv );

			if ( depth == 1.0 ) {

				gl_FragColor = vec4( 1.0 ); // don't influence background

			} else {

				float viewZ = getViewZ( depth );

				vec3 viewPosition = getViewPosition( vUv, depth, viewZ );
				vec3 viewNormal = getViewNormal( vUv );

				vec2 noiseScale = vec2( resolution.x / 4.0, resolution.y / 4.0 );
				vec3 random = vec3( texture2D( tNoise, vUv * noiseScale ).r );

				// compute matrix used to reorient a kernel vector

				vec3 tangent = normalize( random - viewNormal * dot( random, viewNormal ) );
				vec3 bitangent = cross( viewNormal, tangent );
				mat3 kernelMatrix = mat3( tangent, bitangent, viewNormal );

				float occlusion = 0.0;

				for ( int i = 0; i < KERNEL_SIZE; i ++ ) {

					vec3 sampleVector = kernelMatrix * kernel[ i ]; // reorient sample vector in view space
					vec3 samplePoint = viewPosition + ( sampleVector * kernelRadius ); // calculate sample point

					vec4 samplePointNDC = cameraProjectionMatrix * vec4( samplePoint, 1.0 ); // project point and calculate NDC
					samplePointNDC /= samplePointNDC.w;

					vec2 samplePointUv = samplePointNDC.xy * 0.5 + 0.5; // compute uv coordinates

					float realDepth = getLinearDepth( samplePointUv ); // get linear depth from depth texture
					float sampleDepth = viewZToOrthographicDepth( samplePoint.z, cameraNear, cameraFar ); // compute linear depth of the sample view Z value
					float delta = sampleDepth - realDepth;

					if ( delta > minDistance && delta < maxDistance ) { // if fragment is before sample point, increase occlusion

						occlusion += 1.0;

					}

				}

				occlusion = clamp( occlusion / float( KERNEL_SIZE ), 0.0, 1.0 );

				gl_FragColor = vec4( vec3( 1.0 - occlusion ), 1.0 );

			}

		}`},Xc={name:"SSAODepthShader",defines:{PERSPECTIVE_CAMERA:1},uniforms:{tDepth:{value:null},cameraNear:{value:null},cameraFar:{value:null}},vertexShader:`varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`uniform sampler2D tDepth;

		uniform float cameraNear;
		uniform float cameraFar;

		varying vec2 vUv;

		#include <packing>

		float getLinearDepth( const in vec2 screenPosition ) {

			#if PERSPECTIVE_CAMERA == 1

				float fragCoordZ = texture2D( tDepth, screenPosition ).x;
				float viewZ = perspectiveDepthToViewZ( fragCoordZ, cameraNear, cameraFar );
				return viewZToOrthographicDepth( viewZ, cameraNear, cameraFar );

			#else

				return texture2D( tDepth, screenPosition ).x;

			#endif

		}

		void main() {

			float depth = getLinearDepth( vUv );
			gl_FragColor = vec4( vec3( 1.0 - depth ), 1.0 );

		}`},qc={name:"SSAOBlurShader",uniforms:{tDiffuse:{value:null},resolution:{value:new ae}},vertexShader:`varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`uniform sampler2D tDiffuse;

		uniform vec2 resolution;

		varying vec2 vUv;

		void main() {

			vec2 texelSize = ( 1.0 / resolution );
			float result = 0.0;

			for ( int i = - 2; i <= 2; i ++ ) {

				for ( int j = - 2; j <= 2; j ++ ) {

					vec2 offset = ( vec2( float( i ), float( j ) ) ) * texelSize;
					result += texture2D( tDiffuse, vUv + offset ).r;

				}

			}

			gl_FragColor = vec4( vec3( result / ( 5.0 * 5.0 ) ), 1.0 );

		}`};var $c=class n extends ti{constructor(e,t,i=512,s=512,r=32){super(),this.width=i,this.height=s,this.clear=!0,this.needsSwap=!1,this.camera=t,this.scene=e,this.kernelRadius=8,this.kernel=[],this.noiseTexture=null,this.output=0,this.minDistance=.005,this.maxDistance=.1,this._visibilityCache=[],this._generateSampleKernel(r),this._generateRandomKernelRotations();let o=new bo;o.format=zr,o.type=kr,this.normalRenderTarget=new ln(this.width,this.height,{minFilter:kn,magFilter:kn,type:zn,depthTexture:o}),this.ssaoRenderTarget=new ln(this.width,this.height,{type:zn}),this.blurRenderTarget=this.ssaoRenderTarget.clone(),this.ssaoMaterial=new Pt({defines:Object.assign({},Wc.defines),uniforms:ui.clone(Wc.uniforms),vertexShader:Wc.vertexShader,fragmentShader:Wc.fragmentShader,blending:Rn}),this.ssaoMaterial.defines.KERNEL_SIZE=r,this.ssaoMaterial.uniforms.tNormal.value=this.normalRenderTarget.texture,this.ssaoMaterial.uniforms.tDepth.value=this.normalRenderTarget.depthTexture,this.ssaoMaterial.uniforms.tNoise.value=this.noiseTexture,this.ssaoMaterial.uniforms.kernel.value=this.kernel,this.ssaoMaterial.uniforms.cameraNear.value=this.camera.near,this.ssaoMaterial.uniforms.cameraFar.value=this.camera.far,this.ssaoMaterial.uniforms.resolution.value.set(this.width,this.height),this.ssaoMaterial.uniforms.cameraProjectionMatrix.value.copy(this.camera.projectionMatrix),this.ssaoMaterial.uniforms.cameraInverseProjectionMatrix.value.copy(this.camera.projectionMatrixInverse),this.normalMaterial=new wc,this.normalMaterial.blending=Rn,this.blurMaterial=new Pt({defines:Object.assign({},qc.defines),uniforms:ui.clone(qc.uniforms),vertexShader:qc.vertexShader,fragmentShader:qc.fragmentShader}),this.blurMaterial.uniforms.tDiffuse.value=this.ssaoRenderTarget.texture,this.blurMaterial.uniforms.resolution.value.set(this.width,this.height),this.depthRenderMaterial=new Pt({defines:Object.assign({},Xc.defines),uniforms:ui.clone(Xc.uniforms),vertexShader:Xc.vertexShader,fragmentShader:Xc.fragmentShader,blending:Rn}),this.depthRenderMaterial.uniforms.tDepth.value=this.normalRenderTarget.depthTexture,this.depthRenderMaterial.uniforms.cameraNear.value=this.camera.near,this.depthRenderMaterial.uniforms.cameraFar.value=this.camera.far,this.copyMaterial=new Pt({uniforms:ui.clone(Cs.uniforms),vertexShader:Cs.vertexShader,fragmentShader:Cs.fragmentShader,transparent:!0,depthTest:!1,depthWrite:!1,blendSrc:Bu,blendDst:Dc,blendEquation:Ji,blendSrcAlpha:Ou,blendDstAlpha:Dc,blendEquationAlpha:Ji}),this._fsQuad=new Ps(null),this._originalClearColor=new Ee}dispose(){this.normalRenderTarget.dispose(),this.ssaoRenderTarget.dispose(),this.blurRenderTarget.dispose(),this.normalMaterial.dispose(),this.blurMaterial.dispose(),this.copyMaterial.dispose(),this.depthRenderMaterial.dispose(),this._fsQuad.dispose()}render(e,t,i){switch(this._overrideVisibility(),this._renderOverride(e,this.normalMaterial,this.normalRenderTarget,7829503,1),this._restoreVisibility(),this.ssaoMaterial.uniforms.kernelRadius.value=this.kernelRadius,this.ssaoMaterial.uniforms.minDistance.value=this.minDistance,this.ssaoMaterial.uniforms.maxDistance.value=this.maxDistance,this._renderPass(e,this.ssaoMaterial,this.ssaoRenderTarget),this._renderPass(e,this.blurMaterial,this.blurRenderTarget),this.output){case n.OUTPUT.SSAO:this.copyMaterial.uniforms.tDiffuse.value=this.ssaoRenderTarget.texture,this.copyMaterial.blending=Rn,this._renderPass(e,this.copyMaterial,this.renderToScreen?null:i);break;case n.OUTPUT.Blur:this.copyMaterial.uniforms.tDiffuse.value=this.blurRenderTarget.texture,this.copyMaterial.blending=Rn,this._renderPass(e,this.copyMaterial,this.renderToScreen?null:i);break;case n.OUTPUT.Depth:this._renderPass(e,this.depthRenderMaterial,this.renderToScreen?null:i);break;case n.OUTPUT.Normal:this.copyMaterial.uniforms.tDiffuse.value=this.normalRenderTarget.texture,this.copyMaterial.blending=Rn,this._renderPass(e,this.copyMaterial,this.renderToScreen?null:i);break;case n.OUTPUT.Default:this.copyMaterial.uniforms.tDiffuse.value=this.blurRenderTarget.texture,this.copyMaterial.blending=Fu,this._renderPass(e,this.copyMaterial,this.renderToScreen?null:i);break;default:console.warn("THREE.SSAOPass: Unknown output type.")}}setSize(e,t){this.width=e,this.height=t,this.ssaoRenderTarget.setSize(e,t),this.normalRenderTarget.setSize(e,t),this.blurRenderTarget.setSize(e,t),this.ssaoMaterial.uniforms.resolution.value.set(e,t),this.ssaoMaterial.uniforms.cameraProjectionMatrix.value.copy(this.camera.projectionMatrix),this.ssaoMaterial.uniforms.cameraInverseProjectionMatrix.value.copy(this.camera.projectionMatrixInverse),this.blurMaterial.uniforms.resolution.value.set(e,t)}_renderPass(e,t,i,s,r){e.getClearColor(this._originalClearColor);let o=e.getClearAlpha(),a=e.autoClear;e.setRenderTarget(i),e.autoClear=!1,s!=null&&(e.setClearColor(s),e.setClearAlpha(r||0),e.clear()),this._fsQuad.material=t,this._fsQuad.render(e),e.autoClear=a,e.setClearColor(this._originalClearColor),e.setClearAlpha(o)}_renderOverride(e,t,i,s,r){e.getClearColor(this._originalClearColor);let o=e.getClearAlpha(),a=e.autoClear;e.setRenderTarget(i),e.autoClear=!1,s=t.clearColor||s,r=t.clearAlpha||r,s!=null&&(e.setClearColor(s),e.setClearAlpha(r||0),e.clear()),this.scene.overrideMaterial=t,e.render(this.scene,this.camera),this.scene.overrideMaterial=null,e.autoClear=a,e.setClearColor(this._originalClearColor),e.setClearAlpha(o)}_generateSampleKernel(e){let t=this.kernel;for(let i=0;i<e;i++){let s=new L;s.x=Math.random()*2-1,s.y=Math.random()*2-1,s.z=Math.random(),s.normalize();let r=i/e;r=Hc.lerp(.1,1,r*r),s.multiplyScalar(r),t.push(s)}}_generateRandomKernelRotations(){let i=new $d,s=16,r=new Float32Array(s);for(let o=0;o<s;o++){let a=Math.random()*2-1,c=Math.random()*2-1,h=0;r[o]=i.noise3d(a,c,h)}this.noiseTexture=new Ga(r,4,4,ja,bi),this.noiseTexture.wrapS=xo,this.noiseTexture.wrapT=xo,this.noiseTexture.needsUpdate=!0}_overrideVisibility(){let e=this.scene,t=this._visibilityCache;e.traverse(function(i){(i.isPoints||i.isLine||i.isLine2)&&i.visible&&(i.visible=!1,t.push(i))})}_restoreVisibility(){let e=this._visibilityCache;for(let t=0;t<e.length;t++)e[t].visible=!0;e.length=0}};$c.OUTPUT={Default:0,SSAO:1,Blur:2,Depth:3,Normal:4};var Ty={name:"LuminosityHighPassShader",uniforms:{tDiffuse:{value:null},luminosityThreshold:{value:1},smoothWidth:{value:1},defaultColor:{value:new Ee(0)},defaultOpacity:{value:0}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;

			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform sampler2D tDiffuse;
		uniform vec3 defaultColor;
		uniform float defaultOpacity;
		uniform float luminosityThreshold;
		uniform float smoothWidth;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );

			float v = luminance( texel.xyz );

			vec4 outputColor = vec4( defaultColor.rgb, defaultOpacity );

			float alpha = smoothstep( luminosityThreshold, luminosityThreshold + smoothWidth, v );

			gl_FragColor = mix( outputColor, texel, alpha );

		}`};var sl=class n extends ti{constructor(e,t=1,i,s){super(),this.strength=t,this.radius=i,this.threshold=s,this.resolution=e!==void 0?new ae(e.x,e.y):new ae(256,256),this.clearColor=new Ee(0,0,0),this.needsSwap=!1,this.renderTargetsHorizontal=[],this.renderTargetsVertical=[],this.nMips=5;let r=Math.round(this.resolution.x/2),o=Math.round(this.resolution.y/2);this.renderTargetBright=new ln(r,o,{type:zn}),this.renderTargetBright.texture.name="UnrealBloomPass.bright",this.renderTargetBright.texture.generateMipmaps=!1;for(let l=0;l<this.nMips;l++){let d=new ln(r,o,{type:zn});d.texture.name="UnrealBloomPass.h"+l,d.texture.generateMipmaps=!1,this.renderTargetsHorizontal.push(d);let u=new ln(r,o,{type:zn});u.texture.name="UnrealBloomPass.v"+l,u.texture.generateMipmaps=!1,this.renderTargetsVertical.push(u),r=Math.round(r/2),o=Math.round(o/2)}let a=Ty;this.highPassUniforms=ui.clone(a.uniforms),this.highPassUniforms.luminosityThreshold.value=s,this.highPassUniforms.smoothWidth.value=.01,this.materialHighPassFilter=new Pt({uniforms:this.highPassUniforms,vertexShader:a.vertexShader,fragmentShader:a.fragmentShader}),this.separableBlurMaterials=[];let c=[3,5,7,9,11];r=Math.round(this.resolution.x/2),o=Math.round(this.resolution.y/2);for(let l=0;l<this.nMips;l++)this.separableBlurMaterials.push(this._getSeparableBlurMaterial(c[l])),this.separableBlurMaterials[l].uniforms.invSize.value=new ae(1/r,1/o),r=Math.round(r/2),o=Math.round(o/2);this.compositeMaterial=this._getCompositeMaterial(this.nMips),this.compositeMaterial.uniforms.blurTexture1.value=this.renderTargetsVertical[0].texture,this.compositeMaterial.uniforms.blurTexture2.value=this.renderTargetsVertical[1].texture,this.compositeMaterial.uniforms.blurTexture3.value=this.renderTargetsVertical[2].texture,this.compositeMaterial.uniforms.blurTexture4.value=this.renderTargetsVertical[3].texture,this.compositeMaterial.uniforms.blurTexture5.value=this.renderTargetsVertical[4].texture,this.compositeMaterial.uniforms.bloomStrength.value=t,this.compositeMaterial.uniforms.bloomRadius.value=.1;let h=[1,.8,.6,.4,.2];this.compositeMaterial.uniforms.bloomFactors.value=h,this.bloomTintColors=[new L(1,1,1),new L(1,1,1),new L(1,1,1),new L(1,1,1),new L(1,1,1)],this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,this.copyUniforms=ui.clone(Cs.uniforms),this.blendMaterial=new Pt({uniforms:this.copyUniforms,vertexShader:Cs.vertexShader,fragmentShader:Cs.fragmentShader,blending:Fr,depthTest:!1,depthWrite:!1,transparent:!0}),this._oldClearColor=new Ee,this._oldClearAlpha=1,this._basic=new ts,this._fsQuad=new Ps(null)}dispose(){for(let e=0;e<this.renderTargetsHorizontal.length;e++)this.renderTargetsHorizontal[e].dispose();for(let e=0;e<this.renderTargetsVertical.length;e++)this.renderTargetsVertical[e].dispose();this.renderTargetBright.dispose();for(let e=0;e<this.separableBlurMaterials.length;e++)this.separableBlurMaterials[e].dispose();this.compositeMaterial.dispose(),this.blendMaterial.dispose(),this._basic.dispose(),this._fsQuad.dispose()}setSize(e,t){let i=Math.round(e/2),s=Math.round(t/2);this.renderTargetBright.setSize(i,s);for(let r=0;r<this.nMips;r++)this.renderTargetsHorizontal[r].setSize(i,s),this.renderTargetsVertical[r].setSize(i,s),this.separableBlurMaterials[r].uniforms.invSize.value=new ae(1/i,1/s),i=Math.round(i/2),s=Math.round(s/2)}render(e,t,i,s,r){e.getClearColor(this._oldClearColor),this._oldClearAlpha=e.getClearAlpha();let o=e.autoClear;e.autoClear=!1,e.setClearColor(this.clearColor,0),r&&e.state.buffers.stencil.setTest(!1),this.renderToScreen&&(this._fsQuad.material=this._basic,this._basic.map=i.texture,e.setRenderTarget(null),e.clear(),this._fsQuad.render(e)),this.highPassUniforms.tDiffuse.value=i.texture,this.highPassUniforms.luminosityThreshold.value=this.threshold,this._fsQuad.material=this.materialHighPassFilter,e.setRenderTarget(this.renderTargetBright),e.clear(),this._fsQuad.render(e);let a=this.renderTargetBright;for(let c=0;c<this.nMips;c++)this._fsQuad.material=this.separableBlurMaterials[c],this.separableBlurMaterials[c].uniforms.colorTexture.value=a.texture,this.separableBlurMaterials[c].uniforms.direction.value=n.BlurDirectionX,e.setRenderTarget(this.renderTargetsHorizontal[c]),e.clear(),this._fsQuad.render(e),this.separableBlurMaterials[c].uniforms.colorTexture.value=this.renderTargetsHorizontal[c].texture,this.separableBlurMaterials[c].uniforms.direction.value=n.BlurDirectionY,e.setRenderTarget(this.renderTargetsVertical[c]),e.clear(),this._fsQuad.render(e),a=this.renderTargetsVertical[c];this._fsQuad.material=this.compositeMaterial,this.compositeMaterial.uniforms.bloomStrength.value=this.strength,this.compositeMaterial.uniforms.bloomRadius.value=this.radius,this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,e.setRenderTarget(this.renderTargetsHorizontal[0]),e.clear(),this._fsQuad.render(e),this._fsQuad.material=this.blendMaterial,this.copyUniforms.tDiffuse.value=this.renderTargetsHorizontal[0].texture,r&&e.state.buffers.stencil.setTest(!0),this.renderToScreen?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(i),this._fsQuad.render(e)),e.setClearColor(this._oldClearColor,this._oldClearAlpha),e.autoClear=o}_getSeparableBlurMaterial(e){let t=[];for(let i=0;i<e;i++)t.push(.39894*Math.exp(-.5*i*i/(e*e))/e);return new Pt({defines:{KERNEL_RADIUS:e},uniforms:{colorTexture:{value:null},invSize:{value:new ae(.5,.5)},direction:{value:new ae(.5,.5)},gaussianCoefficients:{value:t}},vertexShader:`varying vec2 vUv;
				void main() {
					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
				}`,fragmentShader:`#include <common>
				varying vec2 vUv;
				uniform sampler2D colorTexture;
				uniform vec2 invSize;
				uniform vec2 direction;
				uniform float gaussianCoefficients[KERNEL_RADIUS];

				void main() {
					float weightSum = gaussianCoefficients[0];
					vec3 diffuseSum = texture2D( colorTexture, vUv ).rgb * weightSum;
					for( int i = 1; i < KERNEL_RADIUS; i ++ ) {
						float x = float(i);
						float w = gaussianCoefficients[i];
						vec2 uvOffset = direction * invSize * x;
						vec3 sample1 = texture2D( colorTexture, vUv + uvOffset ).rgb;
						vec3 sample2 = texture2D( colorTexture, vUv - uvOffset ).rgb;
						diffuseSum += (sample1 + sample2) * w;
						weightSum += 2.0 * w;
					}
					gl_FragColor = vec4(diffuseSum/weightSum, 1.0);
				}`})}_getCompositeMaterial(e){return new Pt({defines:{NUM_MIPS:e},uniforms:{blurTexture1:{value:null},blurTexture2:{value:null},blurTexture3:{value:null},blurTexture4:{value:null},blurTexture5:{value:null},bloomStrength:{value:1},bloomFactors:{value:null},bloomTintColors:{value:null},bloomRadius:{value:0}},vertexShader:`varying vec2 vUv;
				void main() {
					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
				}`,fragmentShader:`varying vec2 vUv;
				uniform sampler2D blurTexture1;
				uniform sampler2D blurTexture2;
				uniform sampler2D blurTexture3;
				uniform sampler2D blurTexture4;
				uniform sampler2D blurTexture5;
				uniform float bloomStrength;
				uniform float bloomRadius;
				uniform float bloomFactors[NUM_MIPS];
				uniform vec3 bloomTintColors[NUM_MIPS];

				float lerpBloomFactor(const in float factor) {
					float mirrorFactor = 1.2 - factor;
					return mix(factor, mirrorFactor, bloomRadius);
				}

				void main() {
					gl_FragColor = bloomStrength * ( lerpBloomFactor(bloomFactors[0]) * vec4(bloomTintColors[0], 1.0) * texture2D(blurTexture1, vUv) +
						lerpBloomFactor(bloomFactors[1]) * vec4(bloomTintColors[1], 1.0) * texture2D(blurTexture2, vUv) +
						lerpBloomFactor(bloomFactors[2]) * vec4(bloomTintColors[2], 1.0) * texture2D(blurTexture3, vUv) +
						lerpBloomFactor(bloomFactors[3]) * vec4(bloomTintColors[3], 1.0) * texture2D(blurTexture4, vUv) +
						lerpBloomFactor(bloomFactors[4]) * vec4(bloomTintColors[4], 1.0) * texture2D(blurTexture5, vUv) );
				}`})}};sl.BlurDirectionX=new ae(1,0);sl.BlurDirectionY=new ae(0,1);var Yc={name:"OutputShader",uniforms:{tDiffuse:{value:null},toneMappingExposure:{value:1}},vertexShader:`
		precision highp float;

		uniform mat4 modelViewMatrix;
		uniform mat4 projectionMatrix;

		attribute vec3 position;
		attribute vec2 uv;

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		precision highp float;

		uniform sampler2D tDiffuse;

		#include <tonemapping_pars_fragment>
		#include <colorspace_pars_fragment>

		varying vec2 vUv;

		void main() {

			gl_FragColor = texture2D( tDiffuse, vUv );

			// tone mapping

			#ifdef LINEAR_TONE_MAPPING

				gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );

			#elif defined( REINHARD_TONE_MAPPING )

				gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );

			#elif defined( CINEON_TONE_MAPPING )

				gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );

			#elif defined( ACES_FILMIC_TONE_MAPPING )

				gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );

			#elif defined( AGX_TONE_MAPPING )

				gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );

			#elif defined( NEUTRAL_TONE_MAPPING )

				gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );

			#elif defined( CUSTOM_TONE_MAPPING )

				gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );

			#endif

			// color space

			#ifdef SRGB_TRANSFER

				gl_FragColor = sRGBTransferOETF( gl_FragColor );

			#endif

		}`};var Yd=class extends ti{constructor(){super(),this.uniforms=ui.clone(Yc.uniforms),this.material=new Mc({name:Yc.name,uniforms:this.uniforms,vertexShader:Yc.vertexShader,fragmentShader:Yc.fragmentShader}),this._fsQuad=new Ps(this.material),this._outputColorSpace=null,this._toneMapping=null}render(e,t,i){this.uniforms.tDiffuse.value=i.texture,this.uniforms.toneMappingExposure.value=e.toneMappingExposure,(this._outputColorSpace!==e.outputColorSpace||this._toneMapping!==e.toneMapping)&&(this._outputColorSpace=e.outputColorSpace,this._toneMapping=e.toneMapping,this.material.defines={},lt.getTransfer(this._outputColorSpace)===vt&&(this.material.defines.SRGB_TRANSFER=""),this._toneMapping===$u?this.material.defines.LINEAR_TONE_MAPPING="":this._toneMapping===Yu?this.material.defines.REINHARD_TONE_MAPPING="":this._toneMapping===Zu?this.material.defines.CINEON_TONE_MAPPING="":this._toneMapping===Za?this.material.defines.ACES_FILMIC_TONE_MAPPING="":this._toneMapping===ju?this.material.defines.AGX_TONE_MAPPING="":this._toneMapping===Ju?this.material.defines.NEUTRAL_TONE_MAPPING="":this._toneMapping===Ku&&(this.material.defines.CUSTOM_TONE_MAPPING=""),this.material.needsUpdate=!0),this.renderToScreen===!0?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(t),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this._fsQuad.render(e))}dispose(){this.material.dispose(),this._fsQuad.dispose()}};var Ey={name:"FXAAShader",uniforms:{tDiffuse:{value:null},resolution:{value:new ae(1/1024,1/512)}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform sampler2D tDiffuse;
		uniform vec2 resolution;
		varying vec2 vUv;

		#define EDGE_STEP_COUNT 6
		#define EDGE_GUESS 8.0
		#define EDGE_STEPS 1.0, 1.5, 2.0, 2.0, 2.0, 4.0
		const float edgeSteps[EDGE_STEP_COUNT] = float[EDGE_STEP_COUNT]( EDGE_STEPS );

		float _ContrastThreshold = 0.0312;
		float _RelativeThreshold = 0.063;
		float _SubpixelBlending = 1.0;

		vec4 Sample( sampler2D  tex2D, vec2 uv ) {

			return texture( tex2D, uv );

		}

		float SampleLuminance( sampler2D tex2D, vec2 uv ) {

			return dot( Sample( tex2D, uv ).rgb, vec3( 0.3, 0.59, 0.11 ) );

		}

		float SampleLuminance( sampler2D tex2D, vec2 texSize, vec2 uv, float uOffset, float vOffset ) {

			uv += texSize * vec2(uOffset, vOffset);
			return SampleLuminance(tex2D, uv);

		}

		struct LuminanceData {

			float m, n, e, s, w;
			float ne, nw, se, sw;
			float highest, lowest, contrast;

		};

		LuminanceData SampleLuminanceNeighborhood( sampler2D tex2D, vec2 texSize, vec2 uv ) {

			LuminanceData l;
			l.m = SampleLuminance( tex2D, uv );
			l.n = SampleLuminance( tex2D, texSize, uv,  0.0,  1.0 );
			l.e = SampleLuminance( tex2D, texSize, uv,  1.0,  0.0 );
			l.s = SampleLuminance( tex2D, texSize, uv,  0.0, -1.0 );
			l.w = SampleLuminance( tex2D, texSize, uv, -1.0,  0.0 );

			l.ne = SampleLuminance( tex2D, texSize, uv,  1.0,  1.0 );
			l.nw = SampleLuminance( tex2D, texSize, uv, -1.0,  1.0 );
			l.se = SampleLuminance( tex2D, texSize, uv,  1.0, -1.0 );
			l.sw = SampleLuminance( tex2D, texSize, uv, -1.0, -1.0 );

			l.highest = max( max( max( max( l.n, l.e ), l.s ), l.w ), l.m );
			l.lowest = min( min( min( min( l.n, l.e ), l.s ), l.w ), l.m );
			l.contrast = l.highest - l.lowest;
			return l;

		}

		bool ShouldSkipPixel( LuminanceData l ) {

			float threshold = max( _ContrastThreshold, _RelativeThreshold * l.highest );
			return l.contrast < threshold;

		}

		float DeterminePixelBlendFactor( LuminanceData l ) {

			float f = 2.0 * ( l.n + l.e + l.s + l.w );
			f += l.ne + l.nw + l.se + l.sw;
			f *= 1.0 / 12.0;
			f = abs( f - l.m );
			f = clamp( f / l.contrast, 0.0, 1.0 );

			float blendFactor = smoothstep( 0.0, 1.0, f );
			return blendFactor * blendFactor * _SubpixelBlending;

		}

		struct EdgeData {

			bool isHorizontal;
			float pixelStep;
			float oppositeLuminance, gradient;

		};

		EdgeData DetermineEdge( vec2 texSize, LuminanceData l ) {

			EdgeData e;
			float horizontal =
				abs( l.n + l.s - 2.0 * l.m ) * 2.0 +
				abs( l.ne + l.se - 2.0 * l.e ) +
				abs( l.nw + l.sw - 2.0 * l.w );
			float vertical =
				abs( l.e + l.w - 2.0 * l.m ) * 2.0 +
				abs( l.ne + l.nw - 2.0 * l.n ) +
				abs( l.se + l.sw - 2.0 * l.s );
			e.isHorizontal = horizontal >= vertical;

			float pLuminance = e.isHorizontal ? l.n : l.e;
			float nLuminance = e.isHorizontal ? l.s : l.w;
			float pGradient = abs( pLuminance - l.m );
			float nGradient = abs( nLuminance - l.m );

			e.pixelStep = e.isHorizontal ? texSize.y : texSize.x;

			if (pGradient < nGradient) {

				e.pixelStep = -e.pixelStep;
				e.oppositeLuminance = nLuminance;
				e.gradient = nGradient;

			} else {

				e.oppositeLuminance = pLuminance;
				e.gradient = pGradient;

			}

			return e;

		}

		float DetermineEdgeBlendFactor( sampler2D  tex2D, vec2 texSize, LuminanceData l, EdgeData e, vec2 uv ) {

			vec2 uvEdge = uv;
			vec2 edgeStep;
			if (e.isHorizontal) {

				uvEdge.y += e.pixelStep * 0.5;
				edgeStep = vec2( texSize.x, 0.0 );

			} else {

				uvEdge.x += e.pixelStep * 0.5;
				edgeStep = vec2( 0.0, texSize.y );

			}

			float edgeLuminance = ( l.m + e.oppositeLuminance ) * 0.5;
			float gradientThreshold = e.gradient * 0.25;

			vec2 puv = uvEdge + edgeStep * edgeSteps[0];
			float pLuminanceDelta = SampleLuminance( tex2D, puv ) - edgeLuminance;
			bool pAtEnd = abs( pLuminanceDelta ) >= gradientThreshold;

			for ( int i = 1; i < EDGE_STEP_COUNT && !pAtEnd; i++ ) {

				puv += edgeStep * edgeSteps[i];
				pLuminanceDelta = SampleLuminance( tex2D, puv ) - edgeLuminance;
				pAtEnd = abs( pLuminanceDelta ) >= gradientThreshold;

			}

			if ( !pAtEnd ) {

				puv += edgeStep * EDGE_GUESS;

			}

			vec2 nuv = uvEdge - edgeStep * edgeSteps[0];
			float nLuminanceDelta = SampleLuminance( tex2D, nuv ) - edgeLuminance;
			bool nAtEnd = abs( nLuminanceDelta ) >= gradientThreshold;

			for ( int i = 1; i < EDGE_STEP_COUNT && !nAtEnd; i++ ) {

				nuv -= edgeStep * edgeSteps[i];
				nLuminanceDelta = SampleLuminance( tex2D, nuv ) - edgeLuminance;
				nAtEnd = abs( nLuminanceDelta ) >= gradientThreshold;

			}

			if ( !nAtEnd ) {

				nuv -= edgeStep * EDGE_GUESS;

			}

			float pDistance, nDistance;
			if ( e.isHorizontal ) {

				pDistance = puv.x - uv.x;
				nDistance = uv.x - nuv.x;

			} else {

				pDistance = puv.y - uv.y;
				nDistance = uv.y - nuv.y;

			}

			float shortestDistance;
			bool deltaSign;
			if ( pDistance <= nDistance ) {

				shortestDistance = pDistance;
				deltaSign = pLuminanceDelta >= 0.0;

			} else {

				shortestDistance = nDistance;
				deltaSign = nLuminanceDelta >= 0.0;

			}

			if ( deltaSign == ( l.m - edgeLuminance >= 0.0 ) ) {

				return 0.0;

			}

			return 0.5 - shortestDistance / ( pDistance + nDistance );

		}

		vec4 ApplyFXAA( sampler2D  tex2D, vec2 texSize, vec2 uv ) {

			LuminanceData luminance = SampleLuminanceNeighborhood( tex2D, texSize, uv );
			if ( ShouldSkipPixel( luminance ) ) {

				return Sample( tex2D, uv );

			}

			float pixelBlend = DeterminePixelBlendFactor( luminance );
			EdgeData edge = DetermineEdge( texSize, luminance );
			float edgeBlend = DetermineEdgeBlendFactor( tex2D, texSize, luminance, edge, uv );
			float finalBlend = max( pixelBlend, edgeBlend );

			if (edge.isHorizontal) {

				uv.y += edge.pixelStep * finalBlend;

			} else {

				uv.x += edge.pixelStep * finalBlend;

			}

			return Sample( tex2D, uv );

		}

		void main() {

			gl_FragColor = ApplyFXAA( tDiffuse, resolution.xy, vUv );

		}`};var Zd=class extends il{constructor(){super(Ey)}setSize(e,t){this.material.uniforms.resolution.value.set(1/e,1/t)}};var Kd=class extends vo{constructor(){super();let e=new Ir;e.deleteAttribute("uv");let t=new Mo({side:bn}),i=new Mo,s=new Rc(16777215,900,28,2);s.position.set(.418,16.199,.3),this.add(s);let r=new nt(e,t);r.position.set(-.757,13.219,.717),r.scale.set(31.713,28.305,28.591),this.add(r);let o=new ei(e,i,6),a=new sn;a.position.set(-10.906,2.009,1.846),a.rotation.set(0,-.195,0),a.scale.set(2.328,7.905,4.651),a.updateMatrix(),o.setMatrixAt(0,a.matrix),a.position.set(-5.607,-.754,-.758),a.rotation.set(0,.994,0),a.scale.set(1.97,1.534,3.955),a.updateMatrix(),o.setMatrixAt(1,a.matrix),a.position.set(6.167,.857,7.803),a.rotation.set(0,.561,0),a.scale.set(3.927,6.285,3.687),a.updateMatrix(),o.setMatrixAt(2,a.matrix),a.position.set(-2.017,.018,6.124),a.rotation.set(0,.333,0),a.scale.set(2.002,4.566,2.064),a.updateMatrix(),o.setMatrixAt(3,a.matrix),a.position.set(2.291,-.756,-2.621),a.rotation.set(0,-.286,0),a.scale.set(1.546,1.552,1.496),a.updateMatrix(),o.setMatrixAt(4,a.matrix),a.position.set(-2.193,-.369,-5.547),a.rotation.set(0,.516,0),a.scale.set(3.875,3.487,2.986),a.updateMatrix(),o.setMatrixAt(5,a.matrix),this.add(o);let c=new nt(e,rl(50));c.position.set(-16.116,14.37,8.208),c.scale.set(.1,2.428,2.739),this.add(c);let h=new nt(e,rl(50));h.position.set(-16.109,18.021,-8.207),h.scale.set(.1,2.425,2.751),this.add(h);let l=new nt(e,rl(17));l.position.set(14.904,12.198,-1.832),l.scale.set(.15,4.265,6.331),this.add(l);let d=new nt(e,rl(43));d.position.set(-.462,8.89,14.52),d.scale.set(4.38,5.441,.088),this.add(d);let u=new nt(e,rl(20));u.position.set(3.235,11.486,-12.541),u.scale.set(2.5,2,.1),this.add(u);let f=new nt(e,rl(100));f.position.set(0,20,0),f.scale.set(1,.1,1),this.add(f)}dispose(){let e=new Set;this.traverse(t=>{t.isMesh&&(e.add(t.geometry),e.add(t.material))});for(let t of e)t.dispose()}};function rl(n){return new Ac({color:0,emissive:16777215,emissiveIntensity:n})}function Cy(n,e=!1){let t=n[0].index!==null,i=new Set(Object.keys(n[0].attributes)),s=new Set(Object.keys(n[0].morphAttributes)),r={},o={},a=n[0].morphTargetsRelative,c=new fn,h=0;for(let l=0;l<n.length;++l){let d=n[l],u=0;if(t!==(d.index!==null))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+l+". All geometries must have compatible attributes; make sure index attribute exists among all geometries, or in none of them."),null;for(let f in d.attributes){if(!i.has(f))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+l+'. All geometries must have compatible attributes; make sure "'+f+'" attribute exists among all geometries, or in none of them.'),null;r[f]===void 0&&(r[f]=[]),r[f].push(d.attributes[f]),u++}if(u!==i.size)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+l+". Make sure all geometries have the same number of attributes."),null;if(a!==d.morphTargetsRelative)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+l+". .morphTargetsRelative must be consistent throughout all geometries."),null;for(let f in d.morphAttributes){if(!s.has(f))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+l+".  .morphAttributes must be consistent throughout all geometries."),null;o[f]===void 0&&(o[f]=[]),o[f].push(d.morphAttributes[f])}if(e){let f;if(t)f=d.index.count;else if(d.attributes.position!==void 0)f=d.attributes.position.count;else return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+l+". The geometry must have either an index or a position attribute"),null;c.addGroup(h,f,l),h+=f}}if(t){let l=0,d=[];for(let u=0;u<n.length;++u){let f=n[u].index;for(let x=0;x<f.count;++x)d.push(f.getX(x)+l);l+=n[u].attributes.position.count}c.setIndex(d)}for(let l in r){let d=Ry(r[l]);if(!d)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+l+" attribute."),null;c.setAttribute(l,d)}for(let l in o){let d=o[l][0].length;if(d===0)break;c.morphAttributes=c.morphAttributes||{},c.morphAttributes[l]=[];for(let u=0;u<d;++u){let f=[];for(let y=0;y<o[l].length;++y)f.push(o[l][y][u]);let x=Ry(f);if(!x)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+l+" morphAttribute."),null;c.morphAttributes[l].push(x)}}return c}function Ry(n){let e,t,i,s=-1,r=0;for(let h=0;h<n.length;++h){let l=n[h];if(e===void 0&&(e=l.array.constructor),e!==l.array.constructor)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.array must be of consistent array types across matching attributes."),null;if(t===void 0&&(t=l.itemSize),t!==l.itemSize)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.itemSize must be consistent across matching attributes."),null;if(i===void 0&&(i=l.normalized),i!==l.normalized)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.normalized must be consistent across matching attributes."),null;if(s===-1&&(s=l.gpuType),s!==l.gpuType)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.gpuType must be consistent across matching attributes."),null;r+=l.count*t}let o=new e(r),a=new Ht(o,t,i),c=0;for(let h=0;h<n.length;++h){let l=n[h];if(l.isInterleavedBufferAttribute){let d=c/t;for(let u=0,f=l.count;u<f;u++)for(let x=0;x<t;x++){let y=l.getComponent(u,x);a.setComponent(u+d,x,y)}}else o.set(l.array,c);c+=l.count*t}return s!==void 0&&(a.gpuType=s),a}var qA="http://www.w3.org/2000/svg",Py=5,qm=10,$m=3,ni=8,Ym=10,Iy=20,No=(n,e={})=>{let t=document.createElementNS(qA,n);for(let[i,s]of Object.entries(e))t.setAttribute(i,s);return t},Hr=(n,e,t=ni)=>n.x<e.x+e.w+t&&n.x+n.w+t>e.x&&n.y<e.y+e.h+t&&n.y+n.h+t>e.y,$A=[[64,-96],[84,-40],[64,34],[128,-150],[36,-150],[150,-70],[40,70]];function Ny(n,e,t){let i=Array.from({length:Py},()=>{let v=document.createElement("div");v.className="annotation",v.innerHTML='<i class="dot"></i><b></b><small></small>',n.append(v);let g=No("path",{class:"leader-halo"}),_=No("path",{class:"leader-line"}),S=No("circle",{class:"leader-ring",r:3.5});return e.append(g,_,S),{el:v,dot:v.children[0],title:v.children[1],sub:v.children[2],halo:g,line:_,ring:S,key:null,x:0,y:0,w:0,h:0,shown:!1,text:"",sizeText:""}}),s=Array.from({length:qm},()=>{let v=document.createElement("span");return v.className="tag",n.append(v),{el:v,text:"",color:"",shown:!1,flip:!1,box:null}}),r=document.createElement("span");r.className="tag",r.setAttribute("aria-hidden","true"),r.style.cssText="visibility:hidden;transform:translate3d(-9999px,0,0)",n.append(r);let o=Array.from({length:$m},()=>{let v=No("g",{class:"bracket"}),g=No("path",{class:"bracket-halo"}),_=No("path",{class:"bracket-line"}),S=No("text");return v.append(g,_,S),e.append(v),{g:v,halo:g,line:_,text:S,label:"",shown:!1}}),a=[],c=[],h=[],l=new Map,d=new Map,u=new L,f=new L,x=[],y="",m=(v,g,_,S)=>(u.copy(v).project(g),u.z<1&&u.z>-1?{x:(u.x+1)*_/2,y:(1-u.y)*S/2}:null),p=(v,g)=>x.some(_=>v>=_.x&&v<=_.x+_.w&&g>=_.y&&g<=_.y+_.h),w=(v,g)=>{v.classList.toggle("show",g)};return{layout(v){x=v},resetSizes(){l.clear(),d.clear(),i.forEach(v=>v.sizeText="")},snapshot(){let v=g=>{let _=g.getBoundingClientRect();return{x:_.left,y:_.top,w:_.width,h:_.height}};return{labels:i.filter(g=>g.shown).map(g=>({text:g.title.textContent,...v(g.el)})),tags:s.filter(g=>g.shown).map(g=>({text:g.text,...v(g.el)})),brackets:o.filter(g=>g.shown&&g.box).map(g=>({text:g.label,...g.box})),blocked:x}},shown(){let v=[];for(let g of i)g.shown&&v.push({key:"L:"+g.key,title:g.title.textContent,text:g.title.textContent+" "+g.sub.textContent});for(let g of s)g.shown&&v.push({key:"T:"+g.text,title:g.text,text:g.text});for(let g of o)g.shown&&v.push({key:"B:"+g.label,title:g.label,text:g.label});return v},begin(){a.length=0,c.length=0,h.length=0},label(v,g,_,S={}){a.push({anchor:v,title:g,sub:_,key:S.key||g,color:S.color||"#d8e4e4",priority:S.priority??1,inside:!!S.inside,order:a.length})},tag(v,g,_={}){c.push({anchor:v,text:g,color:_.color||"#d8e4e4"})},bracket(v,g,_){h.push({a:v,b:g,text:_})},end(v,g,_,S,R,P=!0){let b=!1,M=g<=600?2:Py,C=[],U=[],V=new Set,H=P?a.filter(O=>{let J=m(O.anchor,v,g,_);return!J||J.x<ni||J.y<ni||J.x>g-ni||J.y>_-ni||p(J.x,J.y)?!1:(O.s=J,!0)}):[];H.sort((O,J)=>J.priority-O.priority||O.order-J.order),H.forEach(O=>U.push({x:O.s.x-6,y:O.s.y-6,w:12,h:12}));let k=new Map;H.forEach(O=>{let J=i.findIndex((q,le)=>q.key===O.key&&q.shown&&!V.has(le));J>=0&&(k.set(O,J),V.add(J))}),H.forEach(O=>{if(!k.has(O)){let J=i.findIndex((q,le)=>!V.has(le));J>=0&&(k.set(O,J),V.add(J))}});let z=1-Math.exp(-S/(.12/Math.min(Math.max(R,1),2))),ie=new Set,$=0;for(let O of H){if($>=M)break;let J=k.get(O);if(J===void 0)continue;let q=i[J],le=O.title+"\0"+O.sub+(O.inside?"\0in":"");if(q.text!==le&&(q.title.textContent=O.title,q.sub.textContent=O.sub,q.text=le),q.el.classList.toggle("inside",O.inside),q.sizeText!==le){let ge=l.get(le);ge?(q.w=ge[0],q.h=ge[1]):(q.el.style.transform="translate3d(-9999px,0,0)",q.w=q.el.offsetWidth,q.h=q.el.offsetHeight,l.set(le,[q.w,q.h])),q.sizeText=le}let Se=O.s.x>g*.55?1:-1,Y=null;for(let ge of[Se,-Se]){for(let[ot,D]of $A){let Ze={x:ge>0?O.s.x+ot:O.s.x-ot-q.w,y:O.s.y+D-q.h/2,w:q.w,h:q.h};if(!(Ze.x<12||Ze.y<12||Ze.x+Ze.w>g-12||Ze.y+Ze.h>_-12)&&!x.some(Pe=>Hr(Ze,Pe))&&!C.some(Pe=>Hr(Ze,Pe))&&!U.some(Pe=>Hr(Ze,Pe,4))){Y=Ze;break}}if(Y)break}if(!Y)continue;let j=q.key!==O.key||!q.shown;q.key=O.key,j?(q.x=Y.x,q.y=Y.y):(q.x+=(Y.x-q.x)*z,q.y+=(Y.y-q.y)*z),Math.abs(Y.x-q.x)+Math.abs(Y.y-q.y)>.5&&(b=!0),C.push({x:q.x,y:q.y,w:q.w,h:q.h}),ie.add(J),$++,q.el.style.transform=`translate3d(${q.x.toFixed(1)}px,${q.y.toFixed(1)}px,0)`,q.dot.style.background=O.color,q.el.classList.toggle("inside",O.inside),w(q.el,!0),q.shown=!0;let he=O.s.x<q.x+q.w/2?q.x-4:q.x+q.w+4,De=q.y+q.h/2,ve=`M${O.s.x.toFixed(1)} ${O.s.y.toFixed(1)}L${((O.s.x+he)/2).toFixed(1)} ${De.toFixed(1)}H${he.toFixed(1)}`;q.halo.setAttribute("d",ve),q.line.setAttribute("d",ve),q.ring.setAttribute("cx",O.s.x.toFixed(1)),q.ring.setAttribute("cy",O.s.y.toFixed(1));for(let ge of[q.halo,q.line,q.ring])ge.classList.add("show"),ge.classList.toggle("dashed",O.inside)}i.forEach((O,J)=>{if(!ie.has(J)){w(O.el,!1),O.shown=!1,O.key=null;for(let q of[O.halo,O.line,O.ring])q.classList.remove("show")}});let te=0;if(P)for(let O of c){if(te>=qm)break;let J=m(O.anchor,v,g,_);if(!J||J.x<ni||J.y<ni||J.x>g-ni||J.y>_-ni||p(J.x,J.y))continue;let q=s[te],le=d.get(O.text);le===void 0&&(r.textContent=O.text,le=r.offsetWidth||O.text.length*6.2+12,d.set(O.text,le));let Se=J.x-Ym+le>g-ni,Y={x:Se?J.x+Ym-le:J.x-Ym,y:J.y-Iy/2,w:le,h:Iy};Y.x<ni||C.some(j=>Hr(Y,j,6))||x.some(j=>Hr(Y,j,4))||(te++,C.push(Y),q.box=Y,q.text!==O.text&&(q.el.textContent=O.text,q.text=O.text),q.flip!==Se&&(q.el.classList.toggle("flip",Se),q.flip=Se),q.color!==O.color&&(q.el.style.setProperty("--c",O.color),q.color=O.color),q.el.style.transform=`translate3d(${Y.x.toFixed(1)}px,${Y.y.toFixed(1)}px,0)`,w(q.el,!0),q.shown=!0)}for(;te<qm;te++)s[te].shown&&(w(s[te].el,!1),s[te].shown=!1);if(te=0,P)for(let O of h){if(te>=$m)break;let J=Le=>f.copy(v.position).sub(Le).setLength(16).add(Le),q=m(J(O.a),v,g,_),le=m(J(O.b),v,g,_);if(!q||!le||[q,le].some(Le=>Le.x<ni||Le.y<ni||Le.x>g-ni||Le.y>_-ni))continue;let Se=le.x-q.x,Y=le.y-q.y,j=Math.hypot(Se,Y)||1,he=-Y/j*7,De=Se/j*7,ve=`M${(q.x+he).toFixed(1)} ${(q.y+De).toFixed(1)}L${q.x.toFixed(1)} ${q.y.toFixed(1)}L${le.x.toFixed(1)} ${le.y.toFixed(1)}L${(le.x+he).toFixed(1)} ${(le.y+De).toFixed(1)}`,ge=O.text.length*3.8+9,ot=0,D=0,Ze=null;for(let Le of[1,-1]){let Te=Math.min(g-ge,Math.max(ge,(q.x+le.x)/2-Le*he*2.2)),_t=Math.min(_-8,Math.max(14,(q.y+le.y)/2-Le*De*2.2)),we={x:Te-ge,y:_t-12,w:2*ge,h:16};if(!C.some(Ge=>Hr(we,Ge,4))&&!x.some(Ge=>Hr(we,Ge,4))&&!U.some(Ge=>Hr(we,Ge,2))){ot=Te,D=_t,Ze=we;break}}if(!Ze)continue;C.push(Ze);let Pe=o[te++];Pe.box=Ze,Pe.halo.setAttribute("d",ve),Pe.line.setAttribute("d",ve),Pe.label!==O.text&&(Pe.text.textContent=O.text,Pe.label=O.text),Pe.text.setAttribute("x",ot.toFixed(1)),Pe.text.setAttribute("y",D.toFixed(1)),Pe.text.setAttribute("text-anchor","middle"),w(Pe.g,!0),Pe.shown=!0}for(;te<$m;te++)o[te].shown&&(w(o[te].g,!1),o[te].shown=!1);let F=i.filter(O=>O.shown).map(O=>O.title.textContent).join("; ");return t&&F!==y&&(y=F,t.textContent=F?`On screen: ${F}.`:"No labels on screen."),b}}}var Do={alphaI:{short:"Assembly scaffold",title:"\u03B1 subunit (\u03B1I)",gene:"rpoA",color:"#d6c496",notes:"the-alpha-subunits",at:[["Core enzyme",0]],text:"Two \u03B1 subunits form a dimer, the scaffold on which the core enzyme assembles. Their flexible C-terminal domains (not resolved in 8E6X, and not shown) can contact promoter DNA."},alphaII:{short:"Assembly scaffold",title:"\u03B1 subunit (\u03B1II)",gene:"rpoA",color:"#d6c496",notes:"the-alpha-subunits",at:[["Core enzyme",0]],text:"The second \u03B1 subunit of the \u03B1\u2082 scaffold. Together the \u03B1 dimer holds \u03B2 and \u03B2\u2032 in place."},beta:{short:"Catalytic subunit \xB7 forms the channels",title:"\u03B2 subunit",gene:"rpoB",color:"#56c2b1",notes:"the-beta-and-beta-subunits",at:[["Core enzyme",2.5],["Nucleotide addition",108]],text:"One of the two large catalytic subunits. With \u03B2\u2032 it forms the active centre, the main DNA channel, the secondary channel for NTPs and the RNA exit channel."},betaPrime:{short:"Catalytic subunit \xB7 holds the Mg\xB2\u207A",title:"\u03B2\u2032 subunit",gene:"rpoC",color:"#7fa3e3",notes:"the-beta-and-beta-subunits",at:[["Core enzyme",5],["Nucleotide addition",108]],text:"The largest subunit. It carries the NADFDGD motif that holds the catalytic Mg\xB2\u207A, the bridge helix and the trigger loop, and lines the secondary channel."},omega:{short:"Small subunit \xB7 not essential",title:"\u03C9 subunit",gene:"rpoZ",color:"#c2bdb2",notes:"bacterial-rna-polymerase-consists-of-multiple-subunits",at:[["Core enzyme",5.5]],text:"A small subunit bound to \u03B2\u2032. Its function is not fully understood and it is not essential for transcription."},sigma:{short:"Promoter recognition \xB7 reads \u221235 and \u221210",title:"\u03C370 factor",gene:"rpoD",color:"#f094ae",notes:"sigma-factors",at:[["Sigma binding",9],["Closed complex",34],["Promoter escape",72]],text:"Gives the core enzyme promoter specificity: region 4 reads the \u221235 element and region 2 the \u221210 element, which it helps to melt. It is often released after promoter escape and can then be reused."},nusA:{short:"Enhances pausing at RNA hairpins",title:"NusA",gene:"nusA",color:"#b9d56b",notes:"elongation-factors-nusa-and-nusg",at:[["Elongation factors",84],["Hairpin pause",129.5]],text:"An elongation factor bound beside the RNA exit channel. It enhances pausing at RNA hairpins, which also helps intrinsic termination."},nusG:{short:"Reduces pausing \xB7 can bridge to Rho",title:"NusG",gene:"nusG",color:"#c08a4c",notes:"elongation-factors-nusa-and-nusg",at:[["Elongation factors",86],["Rho engagement",180,"rho"]],text:"An elongation factor bound across the DNA channel. It reduces pausing, raising the overall rate, and can link RNAP to the ribosome or to Rho."},ribosome:{short:"Translates the RNA as it is made (schematic)",title:"Ribosome (70S, schematic)",color:"#e3d6b8",notes:"elongation-factors-nusa-and-nusg",at:[["Elongation",96]],text:"A schematic 70S ribosome: a small 30S and a large 50S lobe, not a structure. It binds the ribosome-binding site, translates from AUG and stops at UAA while RNAP is still transcribing; NusG\u2019s KOW domain can link the two (coupling). Shown only with Coupled translation on."},rho:{short:"Hexameric RNA translocase",title:"Rho factor",gene:"rho",color:"#9d7cc0",notes:"rho-dependent-terminators",at:[["Rho loading",136,"rho"],["Rho traversal",146,"rho"]],text:"A ring of six identical subunits. It binds the rut site on the RNA and uses its ATPase to move 5\u2032 \u2192 3\u2032 along the transcript until it reaches RNAP and ends transcription."},template:{short:"Read 3\u2032 \u2192 5\u2032",title:"Template strand",color:"#72cdeb",notes:"transcription-occurs-by-base-pairing-in-a-bubble-of-unpaired-dna",at:[["Open complex",44]],text:"The DNA strand that RNAP reads, 3\u2032 \u2192 5\u2032. Each RNA nucleotide pairs with a base on this strand."},coding:{short:"Same sequence as the RNA",title:"Coding (non-template) strand",color:"#e9e1cf",notes:"transcription-occurs-by-base-pairing-in-a-bubble-of-unpaired-dna",at:[["Open complex",44]],text:"The strand with the same sequence as the RNA (T in place of U). Promoter sequences are written on this strand."},rna:{short:"Made 5\u2032 \u2192 3\u2032",title:"RNA transcript",color:"#ffa45e",notes:"the-mechanism-of-nucleotide-addition",at:[["Abortive initiation",56],["Elongation",92]],text:"Made 5\u2032 \u2192 3\u2032. The newest ~9 nucleotides pair with the template in the RNA\u2013DNA hybrid; older RNA leaves through the exit channel."},ntp:{short:"Base, ribose and \u03B1, \u03B2, \u03B3 phosphates",title:"Incoming NTP",color:"#ffa45e",notes:"the-mechanism-of-nucleotide-addition",at:[["Nucleotide addition",108]],text:"A ribonucleoside triphosphate: base, ribose and \u03B1, \u03B2, \u03B3 phosphates. The RNA 3\u2032\u2013OH attacks its \u03B1 phosphate; \u03B2 and \u03B3 leave as pyrophosphate."},ppi:{short:"The \u03B2 and \u03B3 phosphates, released",title:"Pyrophosphate (PPi)",color:"#f2c46d",notes:"the-mechanism-of-nucleotide-addition",at:[["Nucleotide addition",108]],text:"The \u03B2 and \u03B3 phosphates that leave when a nucleotide is added. Cleaving them off provides the energy for the new phosphodiester bond."},mg:{short:"Catalytic metal ion",title:"Active-site Mg\xB2\u207A",color:"#c8ffd8",notes:"the-mechanism-of-nucleotide-addition",at:[["Nucleotide addition",108],["Proofreading",121]],text:"Held by \u03B2\u2032 aspartates (NADFDGD). It catalyses phosphodiester-bond formation and, after backtracking, the cleavage that removes an error."},bridgeHelix:{short:"Spans the active-site cleft",title:"Bridge helix",gene:"rpoC",color:"#bfeaf2",notes:"the-mechanism-of-nucleotide-addition",at:[["Nucleotide addition",108]],text:"A long \u03B2\u2032 helix spanning the cleft beside the active site. With the trigger loop it helps each translocation step."},triggerLoop:{short:"Folds over the NTP (schematic)",title:"Trigger loop",gene:"rpoC",color:"#f3e3c2",notes:"the-mechanism-of-nucleotide-addition",at:[["Nucleotide addition",108]],text:"A flexible \u03B2\u2032 element that folds over a correctly paired NTP, closing the active site for catalysis, then opens again. Its tip is unresolved in 8E6X, so this fold is schematic."},promoter35:{short:"TTGACA \xB7 read by \u03C3 region 4",title:"\u221235 element",color:"#f0a0b4",notes:"sigma-factors-control-binding-to-dna-by-recognising-promoter-sequences",at:[["The promoter",27.4],["Closed complex",34]],text:"Consensus TTGACA on the coding strand, read by \u03C3 region 4."},promoter10:{short:"TATAAT \xB7 read by \u03C3 region 2",title:"\u221210 element",color:"#f0a0b4",notes:"sigma-factors-control-binding-to-dna-by-recognising-promoter-sequences",at:[["The promoter",27.4],["Closed complex",34],["Open complex",44]],text:"Consensus TATAAT, 16\u201318 bp downstream of \u221235. \u03C3 region 2 reads it and the DNA melts here."},start:{short:"First transcribed base pair",title:"+1 start site",color:"#dcefff",notes:"initiation",at:[["The promoter",27.4],["Open complex",44]],text:"The first transcribed base pair. Positions upstream are negative and downstream positive; there is no position 0."},hairpin:{short:"RNA stem\u2013loop",title:"RNA hairpin",color:"#ffd88f",notes:"intrinsic-terminators",at:[["Hairpin pause",129.5],["Hairpin formation",142,"intrinsic"]],text:"Complementary RNA segments pair into a stem\u2013loop. A GC-rich hairpin followed by a U tract is an intrinsic terminator."},utract:{short:"Weak rU\xB7dA pairs",title:"U-rich tract",color:"#ffe1a0",notes:"intrinsic-terminators",at:[["Intrinsic terminator",136,"intrinsic"]],text:"Uridines paired with template adenines: weak rU\xB7dA pairs that let the hybrid come apart after the hairpin forms."},error:{short:"C opposite template A \xB7 stalls RNAP",title:"Misincorporated nucleotide",color:"#ff6f88",notes:"elongation",at:[["Nucleotide addition",117],["Proofreading",121]],text:"A C added opposite a template A. The mismatch stalls RNAP, which backtracks and cuts it off with the adjacent nucleotide."}},Zm={C:"alphaI",D:"alphaII",A:"beta",B:"betaPrime",E:"omega",F:"nusG"};var Km=[{term:"Abortive initiation",def:"RNAP makes and releases short RNAs while it is still bound to the promoter, before it escapes.",notes:"initiation",show:{t:56}},{term:"Active site",aliases:["active centre"],def:"Where RNAP joins nucleotides: a catalytic Mg\xB2\u207A held by \u03B2\u2032, between the \u03B2 and \u03B2\u2032 subunits.",notes:"the-mechanism-of-nucleotide-addition",show:{t:108,key:"mg"}},{term:"Backtracking",aliases:["backtracks","backtrack"],def:"RNAP slides backwards along the DNA and RNA, so the RNA 3\u2032 end leaves the active site and enters the secondary channel.",notes:"elongation",show:{t:121.8}},{term:"Bridge helix",def:"A long \u03B2\u2032 helix that spans the active-site cleft; with the trigger loop it helps each step forward.",notes:"the-mechanism-of-nucleotide-addition",show:{t:109,key:"bridgeHelix"}},{term:"Closed complex",def:"The holoenzyme bound at a promoter with the DNA still fully double stranded.",notes:"sigma-factors-control-binding-to-dna-by-recognising-promoter-sequences",show:{t:34}},{term:"Coding strand",aliases:["non-template strand","non-template (coding) strand","nontemplate strand"],def:"The DNA strand with the same sequence as the RNA (T in place of U). Promoter sequences are written on it.",notes:"transcription-occurs-by-base-pairing-in-a-bubble-of-unpaired-dna",show:{t:47,key:"coding"}},{term:"Core enzyme",def:"RNA polymerase without \u03C3 (\u03B1\u2082\u03B2\u03B2\u2032\u03C9). It can make RNA on a DNA template but cannot recognise promoters.",notes:"bacterial-rna-polymerase-consists-of-multiple-subunits",show:{t:6,key:"rnap"}},{term:"Coupled transcription\u2013translation",aliases:["coupling"],def:"In bacteria a ribosome can translate an mRNA while RNAP is still making it; NusG can link the two machines.",notes:"elongation-factors-nusa-and-nusg",show:{t:96,coupling:!0}},{term:"Elongation",def:"The stage in which RNAP moves along the template, unwinding DNA ahead and rewinding it behind while extending the RNA.",notes:"elongation",show:{t:92}},{term:"Exit channel",aliases:["RNA exit channel"],def:"The channel through which the RNA leaves RNAP, beside NusA; hairpins can fold here.",notes:"the-beta-and-beta-subunits",show:{t:130.4}},{term:"Hairpin",aliases:["stem\u2013loop","RNA hairpin"],def:"An RNA segment that folds back on itself where two stretches are complementary, forming a paired stem and a loop.",notes:"intrinsic-terminators",show:{t:131,key:"hairpin"}},{term:"Holoenzyme",def:"The complete enzyme that starts transcription at promoters: core RNAP plus a \u03C3 factor (\u03B1\u2082\u03B2\u03B2\u2032\u03C9\u03C3).",notes:"sigma-factors",show:{t:14.6}},{term:"Hopping",def:"A proposed search mechanism: RNAP lets go of the DNA briefly and rebinds a short distance away.",notes:"how-does-rnap-find-the-promoter",show:{t:21.5}},{term:"Hybrid",aliases:["RNA\u2013DNA hybrid","heteroduplex"],def:"The newest ~8\u20139 nucleotides of RNA, base paired with the template strand inside RNAP.",notes:"transcription-occurs-by-base-pairing-in-a-bubble-of-unpaired-dna",show:{t:110}},{term:"Initiation",def:"The first stage: RNAP finds a promoter, opens the DNA and starts the RNA, until it escapes the promoter.",notes:"initiation",show:{t:15}},{term:"Intersegment transfer",aliases:["transfer between nearby DNA segments"],def:"A proposed search mechanism: RNAP moves directly from one DNA segment to another where the two pass close together.",notes:"how-does-rnap-find-the-promoter",show:{t:23.5}},{term:"Intrinsic terminator",aliases:["intrinsic termination"],def:"A terminator that needs no protein: a GC-rich hairpin in the RNA followed by a U-rich tract.",notes:"intrinsic-terminators",show:{t:136,path:"intrinsic"}},{term:"NusA",def:"An elongation factor bound beside the RNA exit channel. It enhances pausing at RNA hairpins and helps intrinsic termination.",notes:"elongation-factors-nusa-and-nusg",show:{t:84,key:"nusA"}},{term:"NusG",def:"An elongation factor that reduces pausing, raising the overall rate. Its KOW domain can link RNAP to the ribosome or to Rho.",notes:"elongation-factors-nusa-and-nusg",show:{t:86,key:"nusG"}},{term:"Open complex",def:"The complex in which the DNA has been melted around the start site, exposing the template strand.",notes:"initiation",show:{t:44}},{term:"Pausing",aliases:["pause","pauses"],def:"RNAP stopping temporarily. Hairpins and NusA lengthen pauses; NusG shortens them. Pauses give Rho time to catch up.",notes:"elongation-factors-nusa-and-nusg",show:{t:129.5}},{term:"Phosphodiester bond",def:"The bond that joins nucleotides: the RNA 3\u2032\u2013OH attacks the incoming NTP\u2019s \u03B1 phosphate.",notes:"the-mechanism-of-nucleotide-addition",show:{t:111}},{term:"Promoter",aliases:["promoters"],def:"The DNA region at the start of a gene, recognised through \u03C3, where RNAP binds and starts transcription. It includes the start point (+1), the first base pair transcribed.",notes:"sigma-factors-control-binding-to-dna-by-recognising-promoter-sequences",show:{t:27.4}},{term:"Promoter escape",aliases:["promoter clearance","clears the promoter"],def:"RNAP leaves the promoter once the RNA is about 10\u201312 nucleotides long; \u03C3 is often released soon after.",notes:"the-sigma-cycle",show:{t:72}},{term:"Proofreading",def:"Removal of a wrongly added nucleotide: RNAP backtracks and its active site cuts off the RNA end carrying the error.",notes:"elongation",show:{t:121}},{term:"Pyrophosphate",aliases:["PPi"],def:"The \u03B2 and \u03B3 phosphates released when a nucleotide is added to the RNA.",notes:"the-mechanism-of-nucleotide-addition",show:{t:111.4,key:"ppi"}},{term:"Rho factor",aliases:["Rho"],def:"A ring of six subunits that binds the rut site and uses ATP to move 5\u2032 \u2192 3\u2032 along the RNA until it ends transcription.",notes:"rho-dependent-terminators",show:{t:136,path:"rho",key:"rho"}},{term:"Rudder",def:"A \u03B2\u2032 element that contacts the RNA at the upstream edge of the hybrid and stabilises the elongation complex.",notes:"the-mechanism-of-nucleotide-addition",show:{t:109}},{term:"rut site",aliases:["rut"],def:"Rho utilisation site: an exposed, unstructured stretch of RNA where Rho loads, upstream of the termination point.",notes:"rho-dependent-terminators",show:{t:136,path:"rho"}},{term:"Scrunching",def:"During initiation RNAP stays on the promoter and pulls downstream DNA into itself as the RNA grows.",notes:"initiation",show:{t:60}},{term:"Secondary channel",aliases:["pore"],def:"A pore in RNAP through which NTPs are thought to reach the active site; a backtracked RNA end also enters it.",notes:"the-beta-and-beta-subunits",show:{t:109}},{term:"Sigma factor",aliases:["\u03C3 factor","\u03C370","sigma"],def:"The subunit that gives RNAP promoter specificity: \u03C370 region 4 reads \u221235 and region 2 reads \u221210.",notes:"sigma-factors",show:{t:34,key:"sigma"}},{term:"Sigma cycle",aliases:["\u03C3 cycle"],def:"\u03C3 joins core to start transcription, is often (not always) released after promoter escape, and once released can bind another core enzyme.",notes:"the-sigma-cycle",show:{t:78}},{term:"Sliding",def:"A proposed search mechanism: one-dimensional diffusion of RNAP along the DNA.",notes:"how-does-rnap-find-the-promoter",show:{t:18}},{term:"Template strand",def:"The DNA strand RNAP reads, 3\u2032 \u2192 5\u2032; each RNA nucleotide pairs with a base on it.",notes:"transcription-occurs-by-base-pairing-in-a-bubble-of-unpaired-dna",show:{t:47,key:"template"}},{term:"Termination",def:"The final stage: the RNA\u2013DNA hybrid is broken, the RNA is released and the DNA duplex re-forms.",notes:"transcription-termination",show:{t:136}},{term:"Terminator",aliases:["terminators"],def:"The DNA sequence where transcription ends. A transcription unit runs from the promoter to the terminator.",notes:"transcription-termination",show:{t:155.6,path:"rho",routes:{rho:155.6,intrinsic:137.6}}},{term:"Translocation",aliases:["translocates"],def:"After each nucleotide is added, RNAP moves one base pair downstream so the next template base enters the active site.",notes:"the-mechanism-of-nucleotide-addition",show:{t:112}},{term:"Transcription bubble",aliases:["bubble"],def:"The ~12\u201314 bp region inside RNAP where the two DNA strands are held apart.",notes:"transcription-occurs-by-base-pairing-in-a-bubble-of-unpaired-dna",show:{t:47}},{term:"Trigger loop",def:"A flexible \u03B2\u2032 element that folds over a correctly paired NTP for catalysis, then opens again.",notes:"the-mechanism-of-nucleotide-addition",show:{t:110.4,key:"triggerLoop"}},{term:"U-rich tract",aliases:["U tract","U-rich"],def:"A run of uridines after an intrinsic terminator hairpin; its weak rU\xB7dA pairs let the hybrid come apart.",notes:"intrinsic-terminators",show:{t:150,path:"intrinsic",key:"utract"}},{term:"\u221210 element",aliases:["\u221210"],def:"Promoter hexamer (consensus TATAAT) about 10 bp upstream of the start site, read by \u03C3 region 2; the DNA melts here.",notes:"sigma-factors-control-binding-to-dna-by-recognising-promoter-sequences",show:{t:27.4,key:"promoter10"}},{term:"\u221235 element",aliases:["\u221235"],def:"Promoter hexamer (consensus TTGACA) about 35 bp upstream of the start site, read by \u03C3 region 4.",notes:"sigma-factors-control-binding-to-dna-by-recognising-promoter-sequences",show:{t:27.4,key:"promoter35"}}],jm=n=>n.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");var ss={rho:440,intrinsic:392},ft=n=>Math.max(0,Math.min(1,n)),pt=n=>(n=ft(n),n*n*(3-2*n)),ne=(n,e,t)=>pt((n-e)/(t-e)),Re=(n,e,t)=>n+(e-n)*t,Cn=n=>n==="intrinsic"?180:214,Hn={start:56,round:5,lengths:[5,7,9]},It={factors:84,nusG:88,wide:92,end:108},jt={start:109.2,cycle:3.9,count:3,first:320},Jt={cycle:2,j:jt.first+2,wrong:"C"},ct={pause:121,start:121.8,end:124.6,cleave:125.4,resume:127.2,steps:1,cut:2,recovered:330},Qm=185,tr={pairs:9,loop:5,gap:8,approach:11,root:19},Lo={pairs:5,loop:4,gap:12,approach:8,root:15};function Vr(n,e){let t=e-n.gap;return[t-2*n.pairs-n.loop+1,t]}var kt={start:129.5,fold:[130.4,132],unfold:[133.8,134.8],resume:134.5},Je={land:[15,17],slide:[17,20.5],hop:[20.5,22.5],transfer:[22.5,25],drift:[25,26.4],wait:[26.4,30.4],approach:[30.4,33],found:33,cross:-240,park:-228},ii={intrinsic:{n:[362,391],show:[136.2,137.2,139.2,140.6],hold:[136,138.6,346]},rho:{n:[424,446],show:[153.6,154.6,157.4,158.8],hold:[153.8,158.2,171,2.6]}},rs={chapter:39.5,cut:[39.2,40.2],bend:[40.2,44],strain:42.6};function ol(n){if(n<Je.land[0]||n>=34)return null;let e=Je,t=ne(n,...e.hop),i=(r,o,a,c)=>a*Math.sin(2*Math.PI*c*(n-r))*Math.sin(Math.PI*ft((n-r)/(o-r)));return{x:Re(-150,Re(-300,-266,t),ne(n,e.land[0],e.land[1]+.3))+Re(0,e.cross+266,ne(n,...e.transfer))+Re(0,e.park-e.cross,ne(n,...e.drift))+Re(0,-e.park,ne(n,e.approach[0]-.2,e.found+.8))+i(...e.slide,20,.5)+i(e.drift[0],e.approach[1],3,.45),lift:28*Math.sin(Math.PI*ft((n-e.hop[0])/(e.hop[1]-e.hop[0]))),land:1-ne(n,...e.land),segment:ne(n,e.transfer[0]+.8,e.transfer[1])}}var jd=[{start:0,nav:"Core enzyme",topic:"RNA polymerase",title:"Assembling<br>the core enzyme.",copy:"Two \u03B1 subunits form an assembly scaffold. The \u03B2 and \u03B2\u2032 subunits form the catalytic machinery and the channels for DNA, NTPs and RNA; \u03C9 is also part of the bacterial core. The flexible \u03B1 C-terminal domains can also contact promoter DNA.",notes:"bacterial-rna-polymerase-consists-of-multiple-subunits"},{start:9,nav:"Sigma binding",topic:"Holoenzyme formation",title:"Sigma gives the core<br>promoter specificity.",copy:"A \u03C370 factor associates with the core enzyme. The resulting holoenzyme can recognise the promoter sequences used by many growing-cell genes; \u03C3 also weakens binding to random DNA about 1000-fold.",notes:"sigma-factors"},{start:Je.land[0],nav:"Promoter search",topic:"Finding a promoter",title:"Searching the DNA<br>for a starting point.",copy:"RNAP encounters DNA and samples potential binding sites. Sliding, hopping and transfer between nearby DNA segments are proposed search mechanisms.",notes:"how-does-rnap-find-the-promoter"},{start:Je.wait[0],nav:"The promoter",topic:"Where transcription starts",title:"A promoter is<br>a stretch of DNA.",copy:"RNAP has reached the DNA that carries the promoter, the sequence at the beginning of a gene where transcription starts. The holoenzyme recognises its \u221235 and \u221210 elements; +1 is the first base pair transcribed.",notes:"sigma-factors-control-binding-to-dna-by-recognising-promoter-sequences"},{start:34,nav:"Closed complex",topic:"Promoter recognition",title:"Bound, but the DNA<br>is still closed.",copy:"Sigma recognises promoter elements, including the \u221235 and \u221210 regions. In the closed complex, the DNA remains double-stranded.",notes:"sigma-factors-control-binding-to-dna-by-recognising-promoter-sequences"},{start:rs.chapter,nav:"Bending the DNA",topic:"Opening the DNA",title:"Bending the DNA<br>helps unwind it.",copy:"RNAP pulls the downstream DNA into its cleft and bends it sharply beside the \u221210 element. The bend strains the double helix; at the \u221210 element the strain helps it unwind.",notes:"initiation"},{start:44,nav:"Open complex",topic:"Opening the DNA",title:"The promoter opens<br>around the start site.",copy:"Local strand separation exposes the template strand, which RNAP reads 3\u2032 \u2192 5\u2032. The other, non-template (coding) strand has the same sequence as the RNA, with T in place of U.",notes:"initiation"},{start:56,nav:"Abortive initiation",topic:"Initial RNA synthesis",title:"Short attempts<br>before escape.",copy:"RNAP can synthesise and release several short RNAs while retaining its promoter contacts. These are abortive initiation events.",notes:"initiation"},{start:72,nav:"Promoter escape",topic:"Transition to elongation",title:"RNAP clears<br>the promoter.",copy:"A transcript of about 10\u201312 nucleotides accompanies promoter escape. Sigma\u2013core contacts weaken and released sigma can bind another core enzyme; NusA can compete with sigma for the core. Some complexes retain sigma.",notes:"the-sigma-cycle"},{start:84,nav:"Elongation factors",topic:"NusA and NusG",title:"Elongation factors<br>join the core.",copy:[{at:84,text:"NusA binds beside the RNA exit channel and enhances pausing at RNA hairpins. Without NusG, RNAP pauses often."},{at:86.2,text:"NusG binds across the DNA channel: it reduces pausing, raising the overall rate. NusG can also link RNAP to the ribosome and to Rho."}],notes:"elongation-factors-nusa-and-nusg"},{start:92,nav:"Elongation",topic:"Processive RNA synthesis",title:"The transcript<br>keeps growing.",copy:"RNAP moves downstream. DNA opens in front and rewinds behind, while new ribonucleotides are added to the RNA\u2019s 3\u2032 end.",notes:"elongation"},{start:108,nav:"Nucleotide addition",topic:"The chemical step",title:"One nucleotide<br>at a time.",copy:"An NTP, thought to enter through the secondary channel, pairs with the template base. The RNA 3\u2032\u2013OH attacks its \u03B1 phosphate; the \u03B2 and \u03B3 phosphates leave as pyrophosphate and RNAP translocates by one base pair.",notes:"the-mechanism-of-nucleotide-addition"},{start:121,nav:"Proofreading",topic:"Pausing and backtracking",title:"A wrong nucleotide,<br>a step back, a clean cut.",copy:"Rarely, RNAP adds a wrong nucleotide. The mismatched 3\u2032 end stalls the enzyme, which slides back so the error enters the secondary channel. The active site then cuts off the last two nucleotides, taking the error with them, and elongation resumes. Long pauses can also make RNAP backtrack without an error.",notes:"elongation"},{start:129.5,nav:"Hairpin pause",topic:"NusA at work",title:"NusA holds RNAP<br>at an RNA hairpin.",copy:"An RNA hairpin folding in the exit channel can hold RNAP in a pause. NusA, bound beside the exit, stabilises the hairpin and lengthens the pause. The same activity helps intrinsic termination.",notes:"elongation-factors-nusa-and-nusg"}],YA=[{start:136,nav:"Rho loading",topic:"Rho-dependent termination",title:"Rho loads far behind<br>the polymerase.",copy:"Past the gene\u2019s stop codon no ribosome covers the RNA, so an exposed rut region lets Rho load, far behind RNAP.",copyUncoupled:"Rho loads on the rut site, an exposed, C-rich stretch of RNA far behind RNAP. Ribosomes cover the gene\u2019s RNA up to its stop codon; the rut lies beyond it.",notes:"rho-dependent-terminators"},{start:146,nav:"Rho traversal",topic:"ATP-dependent translocation",title:"Follow Rho<br>along the RNA.",copy:"Using ATP, Rho advances 5\u2032 \u2192 3\u2032 along the transcript while RNAP keeps extending the RNA\u2019s 3\u2032 end.",notes:"rho-dependent-terminators"},{start:180,nav:"Rho engagement",topic:"A favourable pause",title:"The motor reaches<br>the elongation complex.",copy:"A polymerase pause favours engagement: Rho catches up with RNAP, and NusG can connect the two.",notes:"rho-dependent-terminators"},{start:190,nav:"RNA release",topic:"Termination",title:"RNA is released<br>and DNA rewinds.",copy:"The elongation complex is destabilised. The RNA\u2013DNA hybrid separates and the DNA strands rejoin. Polymerase dissociation is one possible outcome.",notes:"transcription-termination"},{start:200,nav:"Recycling",topic:"Enzyme recycling",title:"The core enzyme<br>is free again.",copy:"The released core RNAP can bind a free \u03C3 factor, forming a new holoenzyme that can initiate at another promoter.",notes:"the-sigma-cycle"}],ZA=[{start:136,nav:"Intrinsic terminator",topic:"Intrinsic termination",title:"The RNA encodes<br>its own stop signal.",copy:"A GC-rich inverted repeat is followed by a U-rich tract. The transcript can fold into a hairpin without requiring Rho. The U-rich RNA\u2013DNA hybrid is held by weak rU\xB7dA pairs and comes apart easily.",notes:"intrinsic-terminators"},{start:142,nav:"Hairpin formation",topic:"An RNA stem\u2013loop",title:"The hairpin folds<br>beside the RNA exit.",copy:"Complementary RNA segments pair to form the stem. Hairpin formation and the U-rich RNA\u2013DNA hybrid promote pausing and destabilisation; NusA can assist.",notes:"intrinsic-terminators"},{start:154,nav:"RNA release",topic:"Intrinsic termination",title:"The hybrid gives way.<br>The transcript leaves.",copy:"RNA is released as the transcription bubble rewinds. Rho is absent from this pathway.",notes:"intrinsic-terminators"},{start:166,nav:"Recycling",topic:"Enzyme recycling",title:"Ready for<br>another transcript.",copy:"The released core RNAP can associate with \u03C3 again and initiate at another promoter.",notes:"the-sigma-cycle"}];function Jd(n,e){let t=n.copy;if(typeof t=="string")return t;let i=t[0].text;for(let s of t)e>=s.at&&(i=s.text);return i}var Fy=n=>typeof n.copy=="string"?n.copy:n.copy.map(e=>e.text).join(" "),Qd=n=>n.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,""),al=[{start:0,numeral:"Prologue",title:"The enzyme",sub:"Building RNA polymerase"},{start:15,numeral:"I",title:"Initiation",sub:"Finding and opening a promoter"},{start:It.factors,numeral:"II",title:"Elongation",sub:"The bubble travels with RNAP"},{start:136,card:136+.3,numeral:"III",title:"Termination",sub:{rho:"A motor catches the polymerase",intrinsic:"The RNA encodes its own stop"}},{start:{rho:200,intrinsic:166},numeral:"Coda",title:"Recycling",sub:"The core enzyme is free again"}],ef=(n,e)=>typeof n.start=="number"?n.start:n.start[e==="intrinsic"?"intrinsic":"rho"];var Is=(n,e)=>+(jt.start+jt.cycle*(n+e)).toFixed(2),KA=[0,1,2].flatMap(n=>n===Jt.cycle?[[Is(n,0),"Wrong nucleotide","A CTP enters instead of the UTP that pairs with this template A."],[Is(n,.3),"Mispairs","The C cannot pair properly with the template A, but it is held in the active site."],[Is(n,.47),"Bond forms anyway","Rarely, catalysis happens anyway: the wrong nucleotide is joined to the RNA."],[Is(n,.6),"PPi leaves","Pyrophosphate is released, as for a correct nucleotide."],[Is(n,.72),"Mismatched end","The mismatched 3\u2032 end stops RNAP from stepping forward."]]:[[Is(n,0),n===0?"NTP enters":"Next NTP","An NTP, thought to enter through the secondary channel, moves towards the active site."],[Is(n,.3),"Base pairs","Its base pairs with the next template base; the trigger loop folds over it."],[Is(n,.47),"Bond forms","The RNA 3\u2032\u2013OH attacks the NTP\u2019s \u03B1 phosphate, forming a phosphodiester bond with help from Mg\xB2\u207A."],[Is(n,.56),"PPi leaves","The \u03B2 and \u03B3 phosphates leave as pyrophosphate."],[Is(n,.7),"Translocates","RNAP moves one base pair downstream, freeing the site for the next NTP."]]),jA=Hn.lengths.flatMap((n,e)=>[[Hn.start+Hn.round*e,`Attempt ${e+1} \xB7 ${n} nt`,`RNAP makes a ${n}-nt RNA, pulling downstream DNA into itself (scrunching) while it keeps hold of the promoter.`],[+(Hn.start+Hn.round*(e+.64)).toFixed(2),"Released",`The ${n}-nt RNA is released and the scrunched DNA springs back; RNAP starts again.`]]),Ui={appear:93,join:94.2,follow:[95,97.5],stop:149,split:[100.4,101.6],gone:[102.6,104],contact:[95,96.6,100.3,101.8],gap:33},Dy={common:[[0,"\u03B1\u2082 scaffold","Two \u03B1 subunits come together: the scaffold on which the core enzyme assembles."],[2.5,"\u03B2 joins","The \u03B2 subunit joins the \u03B1 dimer."],[5,"\u03B2\u2032 and \u03C9 join","\u03B2\u2032 and the small \u03C9 subunit complete the core enzyme, \u03B1\u2082\u03B2\u03B2\u2032\u03C9."],[9,"\u03C370 approaches","A free \u03C370 factor approaches the core enzyme."],[14.5,"Holoenzyme","\u03C370 is bound: the holoenzyme can recognise promoters."],[Je.land[0],"Searching","The holoenzyme binds DNA non-specifically, on a segment far from the promoter."],[Je.slide[0],"Sliding","It slides back and forth along the DNA: one-dimensional diffusion."],[Je.hop[0],"Hopping","It lets go briefly and rebinds a short distance away."],[Je.transfer[0],"Intersegment transfer","Where two DNA segments pass close, RNAP bridges them and moves onto the promoter DNA."],[Je.drift[0],"Sliding again","It slides along the promoter DNA towards the promoter."],[Je.wait[0],"The promoter","Just ahead of RNAP: the \u221235 and \u221210 elements lie upstream of the +1 start site."],[Je.approach[0],"Onto the promoter","RNAP slides the last stretch onto the promoter."],[Je.found,"Promoter found","\u03C3 recognises the \u221210 and \u221235 elements as the DNA settles into the holoenzyme."],[34,"Closed complex","In the closed complex \u03C3 holds \u221235 and \u221210; the DNA is still double stranded."],[rs.chapter,"DNA bends","RNAP pulls the downstream DNA into its cleft, bending it sharply beside the \u221210 element."],[rs.strain,"Strain unwinds","The bend strains the helix, which starts to unwind at the \u221210 element."],[44,"DNA melts","The DNA unwinds around the start site, opening the transcription bubble."],[47,"Template exposed","The template strand is single stranded in the active site, ready to be read 3\u2032 \u2192 5\u2032."],...jA,[71,"Productive start","This time the RNA keeps growing."],[77,"\u224810 nt \xB7 escape","At about 10\u201312 nt, RNAP lets go of the promoter and moves downstream."],[78,"\u03C370 released","\u03C370 leaves the core and can bind another core enzyme."],[81.5,"NusA arrives","NusA binds beside the RNA exit channel."],[It.factors,"Frequent pauses","Without NusG, RNAP pauses often."],[85,"NusG binds","NusG binds across the DNA channel."],[It.nusG,"Fewer pauses","With NusG, pauses are fewer and shorter, so the overall rate rises."],[It.wide,"Processive elongation","RNAP moves downstream, opening DNA ahead and rewinding it behind, as the RNA lengthens."],[It.end,"Active site","A close look inside the active site."],...KA,[ct.pause,"Stalled","RNAP stalls at the mismatched 3\u2032 end."],[ct.start,"Backtrack 1 bp","RNAP slides back one base pair, so the error moves into the secondary channel."],[ct.cleave,"Cleavage","The active site cuts off the last two nucleotides, taking the error with them."],[ct.resume,"Elongation resumes","Transcription continues from a correct 3\u2032 end."],[kt.start,"Pause site","RNAP reaches a pause site."],[kt.fold[0],"Hairpin folds","An RNA hairpin folds in the exit channel; NusA stabilises it and RNAP stays paused."],[kt.unfold[0],"Hairpin unfolds","The hairpin unfolds and RNAP can move again."],[kt.resume,"Resumes","Elongation resumes."]],rho:[[136,"Rho loads","Rho binds the rut site on the older, unstructured part of the RNA."],[146,"Rho translocates","Using ATP, Rho moves 5\u2032 \u2192 3\u2032 along the RNA towards RNAP."],[172,"RNAP pauses","RNAP pauses, which gives Rho time to catch up."],[178,"Rho engages","Rho reaches the polymerase; NusG can bridge the two."],[191,"RNA released","The RNA is pulled away, the hybrid separates and the DNA rewinds."],[200,"Recycling","The free core enzyme can bind \u03C3 again."]],intrinsic:[[136,"Terminator made","RNAP transcribes a GC-rich inverted repeat followed by a U-rich tract."],[142,"Hairpin folds","The inverted repeat folds into a stem\u2013loop at the RNA exit, with NusA assisting."],[153,"Weak hybrid","The hairpin and the weak rU\xB7dA hybrid destabilise the elongation complex."],[155,"RNA released","The RNA is released and the bubble collapses."],[166,"Recycling","The free core enzyme can bind \u03C3 again."]]},JA=[[Ui.appear,"Ribosome binds","A ribosome binds the ribosome-binding site and starts translating at AUG while the RNA is still being made."],[Ui.contact[1],"Coupled","NusG\u2019s KOW domain links RNAP to the ribosome (uS10), so the two machines move together."],[+(Ui.split[0]-.6).toFixed(2),"Stop codon","The ribosome reaches the UAA stop codon."],[Ui.split[0],"Ribosome splits","The short peptide is released and the ribosome splits; NusG lets go of it."]],Uo=(n,e=!1)=>{let t=[...Dy.common,...Dy[n==="intrinsic"?"intrinsic":"rho"]];return e?[...t,...JA].sort((i,s)=>i[0]-s[0]):t};function tf(n,e,t=!1){let i=Uo(e,t),s=0;for(let r=0;r<i.length;r++)n>=i[r][0]-1e-6&&(s=r);return s}var QA=[{id:"search",t:14.1,q:"RNAP must find one promoter among ~4.6 million base pairs. In the notes\u2019 model, how does it search?",options:["It binds DNA anywhere, then slides along it and transfers between nearby segments","It reads every base pair in order from one end of the genome","It waits at one site until a promoter drifts past"],answer:0,why:"The notes describe non-specific binding, then sliding and intersegment transfer (with hopping): proposed ways to search locally and move between nearby DNA.",notes:"how-does-rnap-find-the-promoter"},{id:"sigma",t:33.6,q:"Which part of the holoenzyme will recognise the \u221235 and \u221210 elements?",options:["\u03C370","\u03B2\u2032","\u03C9","NusA"],answer:0,why:"\u03C3 gives the core promoter specificity: region 4 reads \u221235 and region 2 reads \u221210.",notes:"sigma-factors-control-binding-to-dna-by-recognising-promoter-sequences"},{id:"template",t:55.4,kind:"pick",q:"Which strand will RNAP read? Click it in the 3D view, or choose below.",options:["The template strand (blue)","The coding strand (ivory)"],answer:0,pick:"template",why:"RNAP reads the template strand 3\u2032 \u2192 5\u2032; the RNA matches the coding strand, with U for T.",notes:"transcription-occurs-by-base-pairing-in-a-bubble-of-unpaired-dna"},{id:"clearance",t:70.6,q:"About how long must the RNA be before RNAP clears the promoter?",options:["2\u20133 nucleotides","About 10\u201312 nucleotides","About 100 nucleotides"],answer:1,why:"Shorter RNAs are often released (abortive initiation); a transcript of about 10\u201312 nt accompanies promoter escape.",notes:"the-sigma-cycle"},{id:"nusg",t:83,q:"NusG is about to bind. What will it do?",options:["Reduce pausing, raising the overall rate","Replace \u03C3 as the promoter-recognition factor","Stop transcription at the next hairpin"],answer:0,why:"NusG is an anti-pausing factor: fewer, shorter pauses raise the overall rate. NusA does the opposite at hairpins.",notes:"elongation-factors-nusa-and-nusg"},{id:"coupling",t:90.2,q:"Besides RNAP, which machine can NusG also link to?",options:["The ribosome","DNA polymerase","The spliceosome"],answer:0,why:"NusG can couple RNAP to the ribosome translating the same RNA, and it can also contact Rho.",notes:"elongation-factors-nusa-and-nusg"},{id:"oh",t:106.3,q:"Which group attacks the incoming NTP to join it to the RNA?",options:["The RNA 3\u2032\u2013OH","The RNA 5\u2032 phosphate","The 2\u2032\u2013OH of the NTP"],answer:0,why:"RNA grows 5\u2032 \u2192 3\u2032: the 3\u2032\u2013OH at the end of the chain attacks the NTP\u2019s \u03B1 phosphate.",notes:"the-mechanism-of-nucleotide-addition"},{id:"ppi",t:111,q:"Which phosphates will leave as the bond forms?",options:["\u03B2 and \u03B3, as pyrophosphate","\u03B1 and \u03B2","Only \u03B3"],answer:0,why:"The \u03B1 phosphate stays in the phosphodiester bond; \u03B2 and \u03B3 leave together as pyrophosphate.",notes:"the-mechanism-of-nucleotide-addition"},{id:"error",t:120.95,q:"RNAP has just added a wrong nucleotide. What will it do?",options:["Back up and cut off the RNA end that carries the error","Keep going; the error stays in the RNA","Release the RNA and stop"],answer:0,why:"The mismatched end stalls RNAP; it backtracks and its active site cleaves off the error with the adjacent nucleotide.",notes:"elongation"},{id:"nusa",t:128.2,q:"An RNA hairpin is about to fold in the exit channel. Which factor will lengthen this pause?",options:["NusA","NusG","\u03C370"],answer:0,why:"NusA, beside the RNA exit, stabilises hairpins and enhances pausing.",notes:"elongation-factors-nusa-and-nusg"},{id:"rho-direction",t:145.8,path:"rho",q:"Rho has loaded on the rut site. Which way will it move?",options:["5\u2032 \u2192 3\u2032, towards RNAP","3\u2032 \u2192 5\u2032, away from RNAP","It stays where it loaded"],answer:0,why:"Rho\u2019s ATPase drives it 5\u2032 \u2192 3\u2032 along the RNA until it catches up with the polymerase.",notes:"rho-dependent-terminators"},{id:"bridge",t:178.5,path:"rho",q:"Which factor can bridge Rho and RNAP?",options:["NusG","NusA","\u03C370"],answer:0,why:"NusG binds RNAP and can also contact Rho, helping termination.",notes:"rho-dependent-terminators"},{id:"repeat",t:141.2,path:"intrinsic",q:"What will the GC-rich inverted repeat in the new RNA do?",options:["Fold back on itself into a hairpin","Pair with the coding strand","Bind Rho"],answer:0,why:"The two halves of an inverted repeat are complementary, so the RNA folds into a stem\u2013loop.",notes:"intrinsic-terminators"},{id:"protein",t:152.4,path:"intrinsic",q:"Does this RNA need a protein to be released?",options:["No: the hairpin and the weak U-rich hybrid are enough (NusA can help)","Yes: Rho must reach RNAP","Yes: \u03C3 must rebind first"],answer:0,why:"Intrinsic terminators depend only on the RNA: the hairpin forms and the rU\xB7dA hybrid comes apart.",notes:"intrinsic-terminators"}],eg={id:"atp",q:"Which ending needs an ATP-driven protein?",options:["Rho-dependent","Intrinsic"],answer:0,why:"Rho uses its C-terminal ATPase to move along the RNA; intrinsic termination needs no protein."},Oy=n=>QA.filter(e=>!e.path||e.path===n),nr=[["Closed complex",34],["Open complex",44],["Abortive initiation",56],["Promoter clearance",72],["Elongation",92],["Termination",136]],Ly={rho:[136,146,180,190,200,214],intrinsic:[136,142,148,154,166,180]};function tg(n,e,t){let i=Ly[e],s=Ly[t];if(!i||!s||n<136)return n;for(let r=1;r<i.length;r++)if(n<=i[r])return s[r-1]+(s[r]-s[r-1])*(n-i[r-1])/(i[r]-i[r-1]);return s.at(-1)}function ng(n){if(n<Ui.appear||n>Ui.gone[1])return null;let e=Ui,t=os(n,"rho").ntCount,i=Math.min(e.stop+1,Re(21,t-e.gap,ne(n,...e.follow)));return{j:i,small:ne(n,e.appear,e.appear+1),large:ne(n,e.join,e.join+.9),split:ne(n,...e.split),fade:1-ne(n,...e.gone),kow:ne(n,e.contact[0],e.contact[1])*(1-ne(n,e.contact[2],e.contact[3])),peptide:ft((i-21)/3/43)*(1-ne(n,e.split[0],e.gone[0]))}}function By(n){let e=n>=jt.start&&n<ct.pause?Jm(n):null;return!!(e&&e.f>=.25&&e.f<=.7)||Math.abs(n-ct.cleave)<.6}var Uy=(n,e,t,i,s,r,o)=>{let a=t-e,c=Math.max(0,Math.min(1,(n-e)/a)),h=c*c,l=h*c;return(2*l-3*h+1)*i+(l-2*h+c)*a*r+(-2*l+3*h)*s+(l-h)*a*o};function ir(n){return[...jd,...n==="intrinsic"?ZA:YA]}function Jm(n){if(n<jt.start)return null;let e=(n-jt.start)/jt.cycle,t=Math.floor(e);return t<jt.count?{cycle:t,f:e-t}:null}function ky(n,e){let t=e==="intrinsic",i=ne(n,81.5,85.5)*(1-(t?ne(n,156,161):ne(n,168,173))),s=ne(n,85,88.5)*(1-(t?ne(n,155,160):ne(n,191,196))),r=Math.max(ne(n,82.5,84)*(1-ne(n,86,87.5)),ne(n,130.8,131.6)*(1-ne(n,134,135)),t?ne(n,143,145)*(1-ne(n,152,154)):0),o=Math.max(ne(n,86,87.5)*(1-ne(n,91,92)),t?0:ne(n,180,182)*(1-ne(n,188,190)));return{nusA:i,nusG:s,nusAActive:r,nusGActive:o}}function zy(n,e){return ne(n,...rs.cut)*(1-ne(n,72,73.2))+ne(n,107.4,108.4)*(1-ne(n,kt.start,kt.start+1.2))+(e==="intrinsic"?ne(n,141.4,142.4)*(1-ne(n,154,155.5)):0)}var kP={common:[[84,88],[88,92],[92,108],[108,121],[ct.resume,kt.start],[kt.resume,136]],rho:[[136,172]],intrinsic:[[136,142]]};function os(n,e="rho"){let t=Math.max(0,Math.min(Cn(e),n)),i=0,s=0,r=1,o=null,a=0;if(t>=Hn.start&&t<71){let b=(t-Hn.start)/Hn.round,M=Math.floor(b),C=b-M,U=Hn.lengths[M];C<.64?(i=U*pt((C-.03)/.52),s=Math.max(0,i-1)):(s=(U-1)*(1-ne(C,.64,.86)),o={offsets:Array.from({length:U},(V,H)=>H-(U-1)),shift:(U+15)*ne(C,.66,.95),fade:1-ne(C,.85,.97)}),r=0}else if(t>=71&&t<84)i=22*ne(t,71,84),s=Math.max(0,i-1),r=ne(t,77,83);else if(t>=It.factors&&t<It.end)i=t<It.nusG?22+2*ne(t,84.3,85.3)+2*ne(t,86.2,87.2):t<It.wide?Uy(t,It.nusG,It.wide,26,40,0,3.5):Uy(t,It.wide,It.end,40,jt.first,3.5,0),s=i-1;else if(t>=It.end&&t<ct.pause){let b=Jm(t),M=b?b.cycle:t>=jt.start?jt.count:0,C=b?b.f:0;i=jt.first+M+ne(C,.5,.6),s=jt.first-1+Math.min(M,Jt.cycle)+(b&&b.cycle<Jt.cycle?ne(C,.7,.95):0)}else if(t>=ct.pause&&t<kt.start){let b=jt.first+jt.count,M=ct.cleave,C=b-ct.cut;t<M?(i=b,s=b-2-ct.steps*ne(t,ct.start,ct.end)):(i=t<ct.resume?C:Re(C,ct.recovered,ne(t,ct.resume,kt.start)),s=i-1,t<M+3.1&&(o={offsets:Array.from({length:ct.cut},(U,V)=>V+1),shift:14*ne(t,M+.1,M+2.6),fade:1-ne(t,M+1.8,M+3.1)})),a=ne(t,M-.4,M)*(1-ne(t,M,M+.7))}else if(t>=kt.start&&t<136)i=t<kt.resume?ct.recovered:Re(ct.recovered,340,ne(t,kt.resume,136)),s=i-1;else if(t>=136){let b=ii.intrinsic.hold;i=e==="intrinsic"?t<b[1]?Re(340,b[2],ne(t,b[0],b[1])):Re(b[2],ss.intrinsic,ne(t,b[1],142)):Re(340,ss.rho,ne(t-ii.rho.hold[3]*(ne(t,ii.rho.hold[0],ii.rho.hold[1])-ne(t,ii.rho.hold[1],ii.rho.hold[2])),136,172)),s=i-1}let c=ol(t),h=t<Je.land[0]?-150:c?c.x:3.4*s*r,l=t<34?0:Math.max(0,s-h/3.4),d=e==="intrinsic"?ne(t,155,163):ne(t,191,198),u=e==="intrinsic"?ne(t,166,178):ne(t,200,212),f=(1-(1-ft((t-42.4)/10.6))**2)*(1-d),x=ne(t,34,38)*(1-d),y=ne(t,...rs.bend),m=ne(t,31,38)*(1-ne(t,76,84)),p=e==="rho"&&t>=136?Re(Qm,i-27,ne(t,146,180)):0,w=e==="rho"?ne(t,178,186):0,v=e==="intrinsic"?ne(t,142,153):0,g=jt.start+jt.cycle*(Jt.cycle+.5),_=ne(t,g,g+.35)*(1-ne(t,ct.cleave+1.8,ct.cleave+3.1)),S=t<136?ne(t,...kt.fold)*(1-ne(t,...kt.unfold)):0,R=ne(t,9,14.5)*(1-ne(t,78,84)),P=ir(e).findLastIndex(b=>t>=b.start);return{time:t,path:e,ntCount:i,displayNt:Math.max(0,Math.floor(i+1e-6)),register:s,distance:h,scrunch:l,open:f,grip:x,bend:y,init:m,release:d,recycling:u,sigmaBound:R,rhoIndex:p,rhoEngage:w,hairpin:v,pauseHairpin:S,error:_,fragment:o,cleavage:a,addition:t>=It.end&&t<ct.pause?Jm(t):null,rhoVisible:e==="rho"&&t>=136&&t<201.2,paused:t>=172&&t<190&&e==="rho",backtracking:t>=ct.start&&t<ct.cleave,chapter:Math.max(0,P),atChoice:t>=136}}var ig="ACTTGACATCCCACCTCACGTATGCTATAATGTGTGC",eT="AACCCCGCTCTTACACATTCCAGCCCTGAAAAAGGGCATCAAATTAAACCACACCTAT",Zc=160,tT=[8,13],Hy=20,Fo=149,nT={A:"T",T:"A",G:"C",C:"G"};function Vy(n){let e=n*2654435761+2654435769>>>0;return e^=e>>>16,e=Math.imul(e,2146121005)>>>0,e^=e>>>15,e=Math.imul(e,2221713035)>>>0,e^=e>>>16,"ACGT"[e&3]}function iT(n){let e=new Map,t=(r,o)=>[...o].forEach((a,c)=>e.set(r+c,a));t(0,"A"),t(tT[0],"AGGAGG"),t(Hy,"ATG"),t(Fo,"TAA"),t(Zc,eT);for(let r=Hy+3;r<Fo;r+=3){let o=[0,1,2].map(a=>e.get(r+a)??Vy(r+a)).join("");(o==="TAA"||o==="TAG"||o==="TGA")&&e.set(r+2,"C")}let[i,s]=Vr(Lo,330);if(t(i,"GCCGC"),t(i+Lo.pairs,"TTCG"),t(s-Lo.pairs+1,"GCGGC"),e.set(sT,"T"),n==="intrinsic"){let[r,o]=Vr(tr,ss.intrinsic);t(r,"GCCCGCCTC"),t(r+tr.pairs,"TTCGA"),t(o-tr.pairs+1,"GAGGCGGGC"),t(o+1,"TTTTTTT")}return e}var sT=jt.first+2,rT={};function oT(n){return rT[n]??=iT(n)}function Gr(n,e="rho"){return n=Math.round(n),n<0&&n>=-ig.length?ig[n+ig.length]:oT(e).get(n)??Vy(n)}function Oo(n,e="rho"){return nT[Gr(n,e)]}function Bo(n,e="rho"){let t=Gr(n,e);return t==="T"?"U":t}function Gy(n,e,t="rho"){let i="";for(let s=n;s<=e;s++)i+=Bo(s,t);return i}function Kc(n,e,t="rho"){let i="";for(let s=n;s<=e;s++)i+=Gr(s,t);return i}var nf=n=>n>=0?`+${n+1}`:String(n);var T=n=>document.getElementById(n),N=(...n)=>new L(...n),I_=.86,yg=7523819,_g=15327695,Jr=16753241,sf=15909997,aT=11521884,lT=10.5,yh=Math.PI*2/lT,Un=-11,Si=4,si=-8,qt=-26,N_=N(-22,-88,22),Us=new vo,Tl=new Lt,jo=new Lt,hn=new Lt,Os=new Lt,ua=new Lt,yr=new Lt,sr=new Lt,Fs=new Lt,yl=new Lt,El=new Lt,Wo=new Lt,_h=new Lt;Tl.add(jo,hn,Os,ua,yr,sr,Fs,yl,El,Wo,_h);Us.add(Tl);var Et,An,Ke,yt,Bs,dh,oi,Sf=matchMedia("(prefers-reduced-motion: reduce)"),Fn=!1,Ae=0,re=null,zt=!1,Nt=!1,zi=null,t0=-1,Rl=0,qr=!0,_s=1,vh=0,$r=!0,or=!0,Ff=!0,bh=!1,vs=!1,_l=-1;function Cl(){!bh&&vs&&(clearTimeout(Tg),bh=!0,vh=performance.now(),requestAnimationFrame(Gv))}function on(){$r=!0,Cl()}function _r(){or=!0,Cl()}var rt=os(0),vg=ir("rho"),ia=[],Qr=[],sa,dr,ai,Xo,Yr,D_=new L,Zn,Vs,mr,Zr,cT=new L,ze=N(1,0,0),vr=N(0,-18,-45),wf=[],vl,bg,Of,fh=N(0,1,0),Gt=N(),no=N(),L_=N(),Wy=N(-300,-112,25),hT=140,uT=N(-40,135,-57),U_=N(),F_=N(),Af=new Ts(1,12,8),dT=new Ts(1,14,10),qo=new As(1,1,1,8),xt=new sn,Ei=N(0,1,0),Bf=new Jn,Mg=new Jn,Xy=[Bf],qy=[],fT=new L(-8,-6,-8),Sg=class extends $c{setSize(e,t){super.setSize(Math.max(1,e*.5|0),Math.max(1,t*.5|0))}_overrideVisibility(){super._overrideVisibility();let e=this._visibilityCache;this.scene.traverse(t=>{t.isMesh&&t.visible&&t.material?.userData?.noAO&&(t.visible=!1,e.push(t))})}};function pT(n){let e=n.materialHighPassFilter;e.fragmentShader=e.fragmentShader.replace("vec4 texel = texture2D( tDiffuse, vUv );","vec4 texel = clamp( texture2D( tDiffuse, vUv ), 0.0, 256.0 );"),e.needsUpdate=!0}var qe={lo:-300,hi:100,step:.125,p:[],t:[],count:0,last:0},rr={lo:-300,hi:100,step:.125,p:[],t:[],count:0,last:0},kf={},Ns={fork:-9,straight:10,join:75,span:.85,aim:.1,lift:34},Qt={up:0,shift:0,nt:Math.PI,radius:9.3,residual:0},wg=N(),O_=N(),B_=N(),k_=[0,1].map(()=>[0,1].map(()=>({b0:0,b1:0,p0:N(),m0:N(),p1:N(),m1:N()}))),n0,i0,yn,Ai=0,ra=0,Wt,wi,ks,Wn,fi,ko,Jo,ph,eo,bl=[],ih,Ml,$o,hr,da=[],Pl,Ag=[],sh,ar,Tn,Hi,Nn,fr,ur,rh=N(),$y=new nn,zf=new Ee(16299908),Hf=16731501,z_=new Ee(Hf),s0={A:"#2fbf8f",T:"#e8743b",U:"#e8743b",G:"#f0e442",C:"#3d7fd6"},Vf=Object.fromEntries(Object.entries(s0).map(([n,e])=>[n,new Ee(e)])),Mh=[new Ee(8301250),new Ee(13617336)],Gf=new Ee,cp=[["sigma","\u03C3 regions","Which parts of \u03C3 read \u221235 and \u221210"],["site","Active-site parts","Mg\xB2\u207A, bridge helix, trigger loop"],["parts","Subunits and channels","\u03B2, \u03B2\u2032, \u03C9 and \u03B1\u2082 names; the channel paths"],["extra","More mechanism","DNA scrunching; NusG\u2019s two domains"]],gr=new Set,as=n=>gr.has(n),_n=!1,Il=n=>_n?ng(n):null,hp=!1,us=0,Yy=-1,Zy="",Ky=-1,jy="",fl=[];function mT(n,e){return Math.max(hp?1:0,ne(n,34,35)*(1-ne(n,43,44)),ne(n,116.6,117.6)*(1-ne(n,127.4,128.4)),e==="intrinsic"?ne(n,142,143)*(1-ne(n,152.5,153.5)):0)}var ls,ll=-1,Jy=!1,lr=(n,e)=>Vt(n,rt,e),H_=N(),Yo=[],gT=N(),xT=N(),yT=N(),_T=N(),V_,br={high:{label:"High",budget:42e5,ao:!0,bloom:!0,samples:4},balanced:{label:"Balanced",budget:24e5,ao:!0,bloom:!0,samples:2},low:{label:"Low",budget:13e5,ao:!1,bloom:!1,samples:0,fxaa:!0}},Qy=["high","balanced","low"],Gs="balanced",oa=null,ri="auto",Wf=!0,cr,pl,Nl=[],Tg=0,Xf=0,sg=0,rf=!1,In={samples:[],work:[],skip:30,strikes:0,checked:0},Ln={get(n){try{return localStorage.getItem("transcription3d."+n)}catch{return null}},set(n,e){try{localStorage.setItem("transcription3d."+n,e)}catch{}}};function On(n,e=3200){let t=T("toast");t.textContent=n,t.hidden=!1,clearTimeout(Xf),Xf=setTimeout(()=>t.hidden=!0,e),li(n,0)}var Fi=1,G_,W_=[],X_={},Zo={},cs,Kr,Qo,q_=N(),$_=N(),Ko=N(),r0=[[],[]],Gn,Y_={},o0={},vT=0,bT=90,a0=!1,Gi,Tf=1,e_=null,t_="",Ef=-240,Rf=470,qf=16,n_=N(-.18,.95,-.22).normalize(),MT=N(-25,-62,-10),ST=N(.2,-.3,-.93).normalize(),wT=N(-18,-37,-15),AT=N(.05,.3,-.95).normalize(),TT=N(-38,-42,-5),ET=N(.15,.3,-.94).normalize();function gn(n,e={}){return new Sc({color:n,roughness:.63,metalness:0,clearcoat:0,envMapIntensity:.2,...e})}function mt(n,e){e=ft(e),n.userData.layered&&e<.999&&(e=Re(1-Math.cbrt(1-e),e,pt((e-.85)/.15)));let t=e<.999;n.transparent!==t&&(n.transparent=t,n.depthWrite=!t,n.needsUpdate=!0),n.opacity=e}function i_(n,e,t){let i=new fn;i.setAttribute("position",new Ht(new Float32Array(e,n.position.offset,n.position.length),3)),n.normal?i.setAttribute("normal",new Ht(new Float32Array(e,n.normal.offset,n.normal.length),3)):i.computeVertexNormals();let s=n.index.type==="uint16"?Uint16Array:Uint32Array;i.setIndex(new Ht(new s(e,n.index.offset,n.index.length),1)),i.computeBoundingSphere();let r=new Ee(t).multiplyScalar(I_),o=gn(r,{side:vi});o.userData.base=r.clone(),o.userData.layered=!0;let a=o.userData.uniforms={uCut:{value:0},uCapOn:{value:1},uCap:{value:new Ee(t).lerp(new Ee(12043970),.35).multiplyScalar(.42)},uRim:{value:.2},uRimColor:{value:new Ee(t).lerp(new Ee(14677247),.6)}};o.onBeforeCompile=h=>{Object.assign(h.uniforms,a),h.fragmentShader=h.fragmentShader.replace("void main() {",`uniform float uCut,uCapOn,uRim;uniform vec3 uCap,uRimColor;
void main() {`).replace("#include <dithering_fragment>",`
  // Clamped: two unit vectors can dot to just over 1, and pow() of a negative base is NaN, which bloom
  // would smear into black blocks.
  float fr=clamp(1.-abs(dot(normalize(normal),normalize(vViewPosition))),0.,1.);
  gl_FragColor.rgb+=uRim*fr*fr*sqrt(fr)*uRimColor*gl_FragColor.a;
  #if NUM_CLIPPING_PLANES>0
   float dP=clippingPlanes[0].w-dot(vClipPosition,clippingPlanes[0].xyz);
   if(!gl_FrontFacing&&uCapOn>.5)gl_FragColor.rgb=uCap*(.78+.22*smoothstep(0.,40.,dP));
   gl_FragColor.rgb=mix(gl_FragColor.rgb,vec3(1.,.93,.8),uCut*uCapOn*(1.-smoothstep(0.,1.8,dP)));
  #endif
  #include <dithering_fragment>`)},o.customProgramCacheKey=()=>"surface-cap";let c=new nt(i,o);return c.userData=n,c}function Eg(){let n=new ts({color:198671,side:bn});return n.userData.noAO=!0,n}function of(n,e={}){return new Pt({userData:{noAO:!0},uniforms:{uColor:{value:new Ee(n).multiplyScalar(1.7)},uAmount:{value:0}},transparent:!0,depthWrite:!1,blending:Fr,...e,vertexShader:"varying vec3 vN,vV;void main(){vec4 mv=modelViewMatrix*vec4(position,1.);vN=normalMatrix*normal;vV=-mv.xyz;gl_Position=projectionMatrix*mv;}",fragmentShader:"uniform vec3 uColor;uniform float uAmount;varying vec3 vN,vV;void main(){float f=clamp(1.-abs(dot(normalize(vN),normalize(vV))),0.,1.);gl_FragColor=vec4(uColor*uAmount*(.05+1.15*f*f*f),1.);}"})}var oh=(n,e,t,i,s)=>ne(n,e,t)*(1-ne(n,i,s))*(Fn?.85:.72+.28*Math.cos((n-t)*Math.PI*2/1.7)),rg=N();function RT(n,e,t,i,s,r=1){rg.subVectors(i,t);let o=rg.length();xt.position.copy(t).add(i).multiplyScalar(.5),xt.quaternion.setFromUnitVectors(Ei,o>1e-6?rg.divideScalar(o):Ei),xt.scale.set(s*r,o,s*r),xt.updateMatrix(),n.setMatrixAt(e,xt.matrix)}var af=N();function ds(n,e,t,i,s,r){if(r<.01)xt.position.copy(t),xt.scale.setScalar(0);else{af.subVectors(i,t).multiplyScalar(r);let o=af.length();xt.position.copy(t).addScaledVector(af,.5),xt.quaternion.setFromUnitVectors(Ei,o>1e-6?af.divideScalar(o):Ei),xt.scale.set(s,o,s)}xt.updateMatrix(),n.setMatrixAt(e,xt.matrix)}function $f(n,e,t,i=1){xt.position.copy(t),xt.quaternion.identity(),xt.scale.setScalar(i),xt.updateMatrix(),n.setMatrixAt(e,xt.matrix)}function Hs(n){n.instanceMatrix.needsUpdate=!0,n.frustumCulled=!1}function zo(n,e,t,i,s,r){let o=r*r,a=o*r;return n.copy(e).multiplyScalar(2*a-3*o+1).addScaledVector(t,a-2*o+r).addScaledVector(i,-2*a+3*o).addScaledVector(s,a-o)}var ea=n=>Math.atan2(Math.sin(n),Math.cos(n)),og=n=>Math.atan2(n.reduce((e,t)=>e+Math.sin(t),0),n.reduce((e,t)=>e+Math.cos(t),0));function Sh(n){let e=n.reduce((s,r)=>s.add(r),N()).multiplyScalar(1/n.length),t=new Array(9).fill(0);for(let s of n){let r=s.x-e.x,o=s.y-e.y,a=s.z-e.z;t[0]+=r*r,t[1]+=r*o,t[2]+=r*a,t[4]+=o*o,t[5]+=o*a,t[8]+=a*a}t[3]=t[1],t[6]=t[2],t[7]=t[5];let i=N(1,.7,.4).normalize();for(let s=0;s<80;s++)i.set(t[0]*i.x+t[1]*i.y+t[2]*i.z,t[3]*i.x+t[4]*i.y+t[5]*i.z,t[6]*i.x+t[7]*i.y+t[8]*i.z).normalize();return{c:e,d:i}}function Vn(n,e,t,i,s=8,r={},o=null,a=null){let c=s+1,h=new Float32Array(i*c*3),l=new Float32Array(h.length),d=new(i*c<65536?Uint16Array:Uint32Array)((i-1)*s*6),u=Float32Array.from({length:c},(C,U)=>Math.cos(U/s*Math.PI*2)),f=Float32Array.from({length:c},(C,U)=>Math.sin(U/s*Math.PI*2));for(let C=0,U=0;C<i-1;C++)for(let V=0;V<s;V++,U+=6){let H=C*c+V,k=H+c;d.set([H,H+1,k,k,H+1,k+1],U)}let x=new fn,y=new Ht(h,3).setUsage(Fd),m=new Ht(l,3).setUsage(Fd);x.setAttribute("position",y),x.setAttribute("normal",m),x.setIndex(new Ht(d,1));let p=o||gn(e,{roughness:.4,emissive:e,emissiveIntensity:.035,...r}),w=new nt(x,p),v=[0,1].map(()=>new nt(dT,p)),g=!o||!!r.capped;w.frustumCulled=!1,v.forEach(C=>{C.scale.setScalar(t),C.frustumCulled=!1}),n.add(w,...v);let _=a||Array.from({length:i},()=>N()),S=N(),R=N(),P=N(),b=N(),M=new Float32Array(i);return{mesh:w,material:p,points:_,count:0,radius:t,base:t,taper:0,update(C){let U=this.radius,V=this.taper;v.forEach(z=>z.scale.setScalar(U)),this.count=C;let H=C>1;if(w.visible=H,v.forEach(z=>z.visible=H&&g),!H)return;let k=0;if(V>0){M[0]=0;for(let z=1;z<C;z++)M[z]=M[z-1]+_[z].distanceTo(_[z-1]);k=M[C-1]}for(let z=0;z<C;z++){let ie=_[z];S.subVectors(_[Math.min(C-1,z+1)],_[Math.max(0,z-1)]),S.lengthSq()<1e-12&&S.copy(ze),S.normalize(),z>0&&R.addScaledVector(S,-R.dot(S)),(z===0||R.lengthSq()<1e-8)&&R.copy(Math.abs(S.y)<.9?Ei:ze).cross(S),R.normalize(),P.crossVectors(S,R);let $=U,te=0;if(V>0){let F=Math.min(V,k/2)||1,O=M[z],J=k-O,q=ft(Math.min(O,J)/F),le=Math.sqrt(Math.max(q*(2-q),1e-4));$=U*le,te=q<1?(O<=J?-1:1)*U*(1-q)/(F*le):0}for(let F=0;F<=s;F++){let O=(z*c+F)*3;b.copy(R).multiplyScalar(u[F]).addScaledVector(P,f[F]),h[O]=ie.x+$*b.x,h[O+1]=ie.y+$*b.y,h[O+2]=ie.z+$*b.z,te&&b.addScaledVector(S,te).normalize(),l[O]=b.x,l[O+1]=b.y,l[O+2]=b.z}}v[0].position.copy(_[0]),v[1].position.copy(_[C-1]),x.setDrawRange(0,(C-1)*s*6);for(let z of[y,m])z.clearUpdateRanges(),z.addUpdateRange(0,C*c*3),z.needsUpdate=!0}}}function CT(){let n=F=>N(...vl.get(F).p),e=F=>N(...bg.get(F).p),t=(F,O)=>Array.from({length:O-F+1},(J,q)=>F+q),i=Sh([...t(24,38).map(n),...t(86,100).map(e)]),s=Sh([...t(2,13).map(n),...t(111,122).map(e)]);i.d.dot(n(24).sub(n(38)))<0&&i.d.negate(),s.d.dot(n(2).sub(n(13)))<0&&s.d.negate();let r=(F,O)=>O.clone().sub(F.c).dot(F.d),o=(r(i,n(24))+r(i,e(100)))/2,a=(r(s,n(13))+r(s,e(111)))/2,c=F=>i.c.clone().addScaledVector(i.d,o+3.4*(F+9)),h=F=>s.c.clone().addScaledVector(s.d,a+3.4*(F-2)),l=F=>F.clone().sub(vr).dot(ze),d=F=>vr.clone().addScaledVector(ze,F),u=(F,O)=>F.clone().multiplyScalar(O);fh.crossVectors(i.d,s.d).normalize();let f=d(l(c(-16))-95),x=d(l(h(10))+120),y=[],m=(F,O)=>{for(let J=y.length?1:0;J<=O;J++)y.push(F(J/O))};m(F=>f.clone().addScaledVector(ze,-3.4*320*(1-F)),160);let p=f.distanceTo(c(-16));m(F=>zo(N(),f,u(ze,p),c(-16),u(i.d,p),F),200),m(F=>c(Re(-16,-9,F)),28);let w=y.length-1;p=3.4*11,m(F=>zo(N(),c(-9),u(i.d,p),h(2),u(s.d,p),F),120),m(F=>h(Re(2,10,F)),32),p=h(10).distanceTo(x),m(F=>zo(N(),h(10),u(s.d,p),x,u(ze,p),F),260),m(F=>x.clone().addScaledVector(ze,3.4*140*F),70);let v=[0];for(let F=1;F<y.length;F++)v.push(v[F-1]+y[F].distanceTo(y[F-1]));qe.count=Math.round((qe.hi-qe.lo)/qe.step)+1,qe.last=qe.count-1;for(let F=0,O=0;F<qe.count;F++){let J=v[w]+3.4*(qe.lo+F*qe.step+9);for(;O<v.length-2&&v[O+1]<J;)O++;qe.p.push(y[O].clone().lerp(y[O+1],ft((J-v[O])/(v[O+1]-v[O]))))}for(let F=0;F<qe.count;F++)qe.t.push(qe.p[Math.min(qe.last,F+1)].clone().sub(qe.p[Math.max(0,F-1)]).normalize());let g=c(-9),_=G_.basePairs.filter(F=>F.n>=-35&&F.n<=-30).map(F=>N(...F.nontemplateP).add(N(...F.templateP)).multiplyScalar(.5)).reduce((F,O)=>F.add(O),N()).multiplyScalar(1/6),S=g.clone().sub(_).normalize(),R=F=>g.clone().addScaledVector(S,3.4*(F+9)),P=F=>qe.p[Math.round((F-qe.lo)/qe.step)].clone(),b=[{b0:Ef,b1:-45,point:F=>{let O=P(Ef),J=R(-45),q=O.distanceTo(J)*.55;return zo(N(),O,u(ze,q),J,u(S,q),F)}},{b0:-45,b1:-9,point:F=>R(Re(-45,-9,F))},{b0:-9,b1:2,point:F=>zo(N(),g,u(S,3.4*11),h(2),u(s.d,3.4*11),F)}],M=[];for(let F of b){let O=Math.round((F.b1-F.b0)*6),J=Array.from({length:O+1},(le,Se)=>F.point(Se/O)),q=[0];for(let le=1;le<=O;le++)q.push(q[le-1]+J[le].distanceTo(J[le-1]));J.forEach((le,Se)=>M.push({b:F.b0+(F.b1-F.b0)*q[Se]/q[O],p:le}))}rr.count=qe.count,rr.last=qe.last;for(let F=0,O=0;F<qe.count;F++){let J=qe.lo+F*qe.step;if(J<=Ef||J>=2){rr.p.push(qe.p[F].clone());continue}for(;O<M.length-2&&M[O+1].b<J;)O++;rr.p.push(M[O].p.clone().lerp(M[O+1].p,ft((J-M[O].b)/(M[O+1].b-M[O].b))))}for(let F=0;F<qe.count;F++)rr.t.push(rr.p[Math.min(qe.last,F+1)].clone().sub(rr.p[Math.max(0,F-1)]).normalize());let C=F=>qe.p[0].clone().addScaledVector(ze,3.4*(F-qe.lo)),U=N().crossVectors(fh,ze).multiplyScalar(.7).addScaledVector(fh,-.3).normalize(),V=F=>Math.round((F-qe.lo)/qe.step),H=V(Ns.fork),k=V(Ns.join),z=3.4*(Ns.join-Ns.fork),ie=(F,O)=>{let J={lo:qe.lo,hi:qe.hi,step:qe.step,count:qe.count,last:qe.last,p:[],t:[]},q=[0];for(let le=H+1;le<=k;le++)q.push(q.at(-1)+F[le].distanceTo(F[le-1]));for(let le=0,Se=0;le<qe.count;le++){if(le<=H||le>=k){J.p.push(O.p[le].clone());continue}let Y=q.at(-1)*(le-H)/(k-H);for(;Se<q.length-2&&q[Se+1]<Y;)Se++;J.p.push(F[H+Se].clone().lerp(F[H+Se+1],ft((Y-q[Se])/(q[Se+1]-q[Se]))))}for(let le=0;le<qe.count;le++)J.t.push(J.p[Math.min(qe.last,le+1)].clone().sub(J.p[Math.max(0,le-1)]).normalize());return J.scale=q.at(-1)/z,J},$=(F,O)=>{let J=F.clone().lerp(s.d,Ns.aim).normalize(),q=3.4*Ns.straight,le=g.clone().addScaledVector(J,q),Se=O.p[k],Y=le.distanceTo(Se)*Ns.span,j=[];for(let ge=0;ge<=60;ge++)j.push(g.clone().addScaledVector(J,q*ge/60));for(let ge=1;ge<=400;ge++)j.push(zo(N(),le,u(J,Y),Se,u(O.t[k],Y),ge/400));let he=[0];for(let ge=1;ge<j.length;ge++)he.push(he[ge-1]+j[ge].distanceTo(j[ge-1]));let De=he.at(-1);j.forEach((ge,ot)=>{let D=he[ot]/De;ge.addScaledVector(U,Ns.lift*16*D*D*(1-D)*(1-D))}),he=[0];for(let ge=1;ge<j.length;ge++)he.push(he[ge-1]+j[ge].distanceTo(j[ge-1]));let ve=O.p.map(ge=>ge.clone());for(let ge=H+1,ot=0;ge<k;ge++){let D=he.at(-1)*(ge-H)/(k-H);for(;ot<he.length-2&&he[ot+1]<D;)ot++;ve[ge]=j[ot].clone().lerp(j[ot+1],ft((D-he[ot])/(he[ot+1]-he[ot])))}return ie(ve,O)},te=(F,O)=>{let J=$(O,F),q=[J];for(let le of[.25,.5,.75])q.push(ie(J.p.map((Se,Y)=>Se.clone().lerp(F.p[Y],le)),F));return q.push(F),q};Object.assign(kf,{fit:te(qe,i.d),init:te(rr,S)}),W_=[b[0],b[2]].map(F=>{let J=0;for(let q=1;q<=60;q++)J+=F.point(q/60).distanceTo(F.point((q-1)/60));return+(J/(F.b1-F.b0)).toFixed(2)})}var vn=N(),Oi=N(),wh=N(),up=N(),s_=N(),jc=N(),Jc=N(),lf=N(),cf=N(),hf=N(),uf=N();function cl(n,e,t,i){let s=(e-n.lo)/n.step;if(s<=0)t.copy(n.p[0]).addScaledVector(ze,3.4*(e-n.lo)),i.copy(ze);else if(s>=n.last)t.copy(n.p[n.last]).addScaledVector(ze,3.4*(e-n.hi)),i.copy(ze);else{let r=Math.floor(s),o=s-r;t.lerpVectors(n.p[r],n.p[r+1],o),i.lerpVectors(n.t[r],n.t[r+1],o)}}function fs(n,e,t){if(cl(qe,n,vn,Oi),t.init>0&&n>Ef&&n<2&&(cl(rr,n,jc,Jc),vn.lerp(jc,t.init),Oi.lerp(Jc,t.init)),t.bend!==void 0&&t.bend<1&&n>Ns.fork&&n<Ns.join){let i=t.bend*4,s=Math.min(3,Math.floor(i)),r=i-s,o=kf.fit,a=kf.init;cl(o[s],n,lf,cf),cl(o[s+1],n,hf,uf),lf.lerp(hf,r),cf.lerp(uf,r),t.init>0&&(cl(a[s],n,jc,Jc),cl(a[s+1],n,hf,uf),jc.lerp(hf,r),Jc.lerp(uf,r),lf.lerp(jc,t.init),cf.lerp(Jc,t.init)),vn.copy(lf),Oi.copy(cf)}e<1&&(s_.copy(qe.p[0]).addScaledVector(ze,3.4*(n-qe.lo)),vn.lerpVectors(s_,vn,e),Oi.multiplyScalar(e).addScaledVector(ze,1-e)),vn.addScaledVector(ze,t.distance),Z_&&IT(t),Oi.normalize(),wh.copy(fh).addScaledVector(Oi,-fh.dot(Oi)).normalize(),up.crossVectors(Oi,wh)}var Qc={up:90*3.4,down:25*3.4,ramp:40*3.4},PT=N(),Yf=N(),Rg=N(),Z_=!1;function IT(n){let e=PT.copy(vn).sub(vr).dot(ze),t=e-Math.max(0,n.distance||0),i=t<0?(-t-Qc.up)/Qc.ramp:(t-Qc.down)/Qc.ramp,s=1-(n.release||0),r=pt(i),o=1-s*(1-r);if(o<1e-4)return;let a=i>0&&i<1?s*6*i*(1-i)/Qc.ramp*(t<0?-1:1):0,c=2*Math.PI,h=18*Math.sin(c*e/860+.6)+6*Math.sin(c*e/390+2.3),l=18*Math.sin(c*e/1040+2)+6*Math.sin(c*e/450+.9),d=18*c/860*Math.cos(c*e/860+.6)+6*c/390*Math.cos(c*e/390+2.3),u=18*c/1040*Math.cos(c*e/1040+2)+6*c/450*Math.cos(c*e/450+.9);vn.addScaledVector(Yf,o*h).addScaledVector(Rg,o*l),Oi.addScaledVector(Yf,a*h+o*d).addScaledVector(Rg,a*l+o*u)}function dp(n,e){let t=e.distance/3.4;if(e.scrunch<1e-4)return t;let i=n<=Un?0:n<Un+2?pt((n-Un)/2):1-pt((n-20)/240);return t+e.scrunch*i}function Bi(n,e){let t=e.distance/3.4;if(e.scrunch<1e-4)return n-t;let i=n-t-e.scrunch-1,s=n-t+1;for(let r=0;r<26;r++){let o=(i+s)/2;o+dp(o,e)<n?i=o:s=o}return(i+s)/2}function Ho(n,e,t,i){fs(e,t.grip,t);let s=yh*(e+dp(e,t))+Qt.up+Qt.shift*pt((e-Un)/(Si-Un))+(n?Qt.nt:0);return i.copy(vn).addScaledVector(wh,Qt.radius*Math.cos(s)).addScaledVector(up,Qt.radius*Math.sin(s))}function $t(n,e,t,i){let s=n.points.length-1,r=t-e,o=n.points;return r<=0?i.subVectors(o[0],o[1]).multiplyScalar(-r).add(o[0]):r>=s?i.subVectors(o[s],o[s-1]).multiplyScalar(r-s).add(o[s]):n.getPoint(r/s,i)}function NT(){let n={distance:0,grip:1,scrunch:0,init:0},e=N(),t=c=>{let h=0,l=1/0;for(let f=0;f<qe.count;f++){let x=qe.p[f].distanceToSquared(c);x<l&&(l=x,h=f)}let d=qe.lo+h*qe.step;fs(d,1,n),e.copy(c).sub(vn);let u=Math.atan2(e.dot(up),e.dot(wh));return{b:d,psi:u,radius:e.addScaledVector(Oi,-e.dot(Oi)).length()}},i=[],s=[],r=[],o=[];for(let c of Bs.nucleic.template){let h=15-c.id;if(h>-9&&h<2)continue;let l=t(N(...c.p));(h<0?i:s).push(l.psi-yh*l.b),o.push(l.radius)}Qt.up=og(i),Qt.shift=ea(og(s)-Qt.up);for(let c of Bs.nucleic.nontemplate){let h=c.id-109;if(h>-9&&h<2)continue;let l=t(N(...c.p));r.push(l.psi-yh*l.b-Qt.up-(h>0?Qt.shift:0)),o.push(l.radius)}Qt.nt=og(r),Qt.radius=o.reduce((c,h)=>c+h,0)/o.length;let a=[...i.map(c=>ea(c-Qt.up)),...s.map(c=>ea(c-Qt.up-Qt.shift)),...r.map(c=>ea(c-Qt.nt))];Qt.residual=Math.sqrt(a.reduce((c,h)=>c+h*h,0)/a.length)*180/Math.PI}var Wr=N(),df=N(),DT=N();function K_(n){for(let e of[0,1]){let t=e?i0:n0,[i,s]=k_[e],r=si-Un,o=Si-1;i.b0=Un,i.b1=si,Ho(e,Un,n,i.p0),Ho(e,Un+.05,n,Wr),Ho(e,Un-.05,n,df),i.m0.subVectors(Wr,df).multiplyScalar(r/.1),$t(t,si,si,i.p1).addScaledVector(ze,n.distance),$t(t,si,si+.05,Wr).addScaledVector(ze,n.distance),i.m1.subVectors(Wr,i.p1).multiplyScalar(r/.05),s.b0=1,s.b1=Si,$t(t,si,1,s.p0).addScaledVector(ze,n.distance),$t(t,si,.95,Wr).addScaledVector(ze,n.distance),s.m0.subVectors(s.p0,Wr).multiplyScalar(o/.05),Ho(e,Si,n,s.p1),Ho(e,Si+.05,n,Wr),Ho(e,Si-.05,n,df),s.m1.subVectors(Wr,df).multiplyScalar(o/.1)}}function LT(n,e,t,i){if(e>=si&&e<=1)return $t(n?i0:n0,si,e,i).addScaledVector(ze,t.distance);let s=k_[n][e<si?0:1];return zo(i,s.p0,s.m0,s.p1,s.m1,(e-s.b0)/(s.b1-s.b0))}function fp(n,e){return ft(e.open*1.7-.7*ft((n-Un)/(Si-Un)))}function r_(n,e=rt){let t=ii[n].n;return fs(Bi((t[0]+t[1])/2,e),e.grip,e),vn.clone()}function ht(n,e,t,i){return Ho(n,e,t,i),t.open>0&&e>Un&&e<Si&&i.lerp(LT(n,e,t,DT),fp(e,t)),i}function zl(n,e){return e.open*(1-e.release)*pt((n-si+1.3)/1.1)*pt((1.6-n)/.5)*(1-e.hairpin*pt((si+2.2-n)/1.2))}var o_=N();function j_(n,e,t){let i=n-e.register;if(i>=qt)return $t(yn,qt,i,t).addScaledVector(ze,e.distance);let s=ft((qt-4-i)/27);return t.copy(wg).addScaledVector(ze,3.4*(n-qt)),t.y+=(-22*Math.sin(n*.12)-35*Math.sin(n*.031))*s,t.z+=30*Math.sin(n*.11)*s,o_.copy(wg).addScaledVector(O_,6*(qt-i)).addScaledVector(ze,e.distance),t.lerp(o_,1-pt((qt-i)/7))}var Ah=N(-.35,-.9,-.26).normalize(),Sl=N(.94,-.34,0),Cg=N(),hl=N(),UT=N();Sl.addScaledVector(Ah,-Sl.dot(Ah)).normalize();Cg.crossVectors(Ah,Sl).normalize();function pp(n){return n.hairpin>0?[tr,n.hairpin]:n.pauseHairpin>0?[Lo,n.pauseHairpin]:null}function FT(n,e,t,i){let s=pp(i);if(!s)return t;let[r,o]=s,[a,c]=Vr(r,e);if(n<a-r.approach||n>c)return t;let h=8.5,l=r.pairs-1,d=c-a,u=UT.copy(ze).multiplyScalar(i.distance).add(wf[r.root]).addScaledVector(Sl,-h),f=n-a,x=(y,m,p)=>{let w=y*Math.PI*2/11;return p.copy(u).addScaledVector(Ah,y*2.8).addScaledVector(Sl,m*h*Math.cos(w)).addScaledVector(Cg,m*h*Math.sin(w))};if(f<0)j_(a-r.approach,i,hl),hl.lerp(x(0,-1,N()),ft((f+r.approach)/r.approach));else if(f<r.pairs)x(f,-1,hl);else if(f<r.pairs+r.loop){let y=(f-l)/(r.loop+1)*Math.PI,m=l*Math.PI*2/11;x(l,0,hl).addScaledVector(Sl,-Math.cos(y)*h*Math.cos(m)).addScaledVector(Cg,-Math.cos(y)*h*Math.sin(m)).addScaledVector(Ah,Math.sin(y)*9*r.loop/5)}else x(Math.max(0,d-f),1,hl);return t.lerp(hl,J_(o,f,r))}function J_(n,e,t){let i=e<0?0:e<t.pairs?e:e<t.pairs+t.loop?t.pairs:2*t.pairs+t.loop-1-e;return pt((n-(1-i/t.pairs)*.55)/.45)}function Vt(n,e=rt,t=N()){return j_(n,e,t),FT(n,e.ntCount,t,e),t.addScaledVector(N_,e.release)}var Zf={y:n=>72+34*pt(Math.abs(n-Je.cross)/150)+6e-4*Math.max(0,Math.abs(n-Je.cross)-280)**2,z:n=>.22*(n-Je.cross)},OT=N(),BT=new nn;function ta(n,e){return e.copy(vr).addScaledVector(ze,n).add(OT.set(0,Zf.y(n),Zf.z(n)))}function l0(n){let e=n.time,t=ol(e);if(t){let s=1-t.segment;return ze.clone().multiplyScalar(n.distance).add(N(0,Re(Zf.y(n.distance),125,t.land)*s+t.lift,Zf.z(n.distance)*s*(1-t.land)))}let i=e<Je.land[0]?125:0;return ze.clone().multiplyScalar(n.distance).add(N(28*n.release+15*n.recycling,i+80*n.release+40*n.recycling,23*n.release+10*n.recycling))}var kT=N(),zT=N(),ff=new nn,HT=N();function VT(n,e){e.identity();let t=ol(n.time);if(!t)return e;let i=n.distance,s=ta(i+2,kT).sub(ta(i-2,zT)).normalize();return e.setFromUnitVectors(ze,s),e.slerp(BT.identity(),Math.max(t.segment,t.land))}function GT(){L_.copy(N(...Bs.rhoCenter)),wf=Bs.nucleic.rna.map(g=>N(...g.p)),H_.copy(wf[10]).sub(wf[2]).normalize();let n=g=>new Map(g.map(_=>[_.id,_]));vl=n(Bs.nucleic.template),bg=n(Bs.nucleic.nontemplate),Of=n(Bs.nucleic.rna);let e=g=>N(...vl.get(g).p),t=g=>N(...bg.get(g).p),i=g=>N(...Of.get(g).p),s=t(86).add(e(38)).multiplyScalar(.5),r=t(122).add(e(2)).multiplyScalar(.5);ze.copy(r).sub(s).normalize(),vr.copy(s).addScaledVector(ze,-s.dot(ze)),CT(),NT(),Yf.set(0,1,0).addScaledVector(ze,-ze.y).normalize(),Rg.crossVectors(ze,Yf),Z_=!0;let o=(g,_)=>Array.from({length:_-g+1},(S,R)=>g+R),a=Sh([...o(15,23).map(e),...o(27,35).map(i)]).d,c=Sh([...o(2,13).map(e),...o(111,122).map(t)]).d;bT=Math.round(Math.acos(Math.abs(a.dot(c)))*180/Math.PI),n0=new ns([23,22,21,20,19,18,17,16,15,14].map(e),!1,"centripetal");let h=[101,102,103].map(t),l=[108,109,110].map(t),d=h[2].clone().add(l[0]).multiplyScalar(.5).sub(e(19).add(e(18)).multiplyScalar(.5)).normalize();i0=new ns([...h,...[1,2,3,4].map(g=>h[2].clone().lerp(l[0],g/5).addScaledVector(d,11*Math.sin(Math.PI*g/5))),...l],!1,"centripetal");let u=N(-.01,-.41,-1.52),f=new ns([u,...[[4.5,1.5,-4.5],[9,6,-5],[13,9,-8],[19,12,-10.5],[27,14.5,-10.5],[35,20,-10.5],[43,28,-10.5],[51,36,-10.5],[58,42.5,-11.5],[68,50,-13.5],[80,58,-15.5]].map(g=>N(...g))],!1,"centripetal"),x=f.getLength(),y=Math.floor(x/6);yn=new ns([...Array.from({length:27},(g,_)=>i(9+_)),...Array.from({length:y+1},(g,_)=>f.getPointAt(_*6/x))],!1,"centripetal"),wg.copy(i(9)),O_.copy(i(9)).sub(i(12)).normalize();let m=qe.p[0].clone().sub(vr).dot(ze);Ai=Math.ceil(qe.lo+(-510-m)/3.4),ra=Math.floor(qe.lo+(1940-m)/3.4),Wt=[Vn(sr,yg,1,2600,8,{emissiveIntensity:.2}),Vn(sr,_g,.72,2600,8,{emissiveIntensity:.16})],da=Wt.map(g=>Vn(sr,0,g.base,2600,8,{capped:!0},Eg(),g.points)),wi=[8301250,13617336].map((g,_)=>{let S=new ei(qo,gn(16777215,{roughness:.55}),ra-Ai+1);for(let R=0;R<S.count;R++)S.setColorAt(R,Mh[_]);return sr.add(S),S}),ks=new ei(qo,wi[0].material,qf);for(let g=0;g<qf;g++)ks.setColorAt(g,Mh[0]);sr.add(ks);let p=g=>{let _=document.createElement("canvas");_.width=_.height=64;let S=_.getContext("2d");S.font="600 44px DM Sans, sans-serif",S.textAlign="center",S.textBaseline="middle",S.lineWidth=8,S.strokeStyle="#050b14",S.strokeText(g,32,34),S.fillStyle=s0[g],S.fillText(g,32,34);let R=new pc(_);return R.colorSpace=$n,new Va({map:R,depthWrite:!1,transparent:!0})},w=Object.fromEntries(["A","C","G","T","U"].map(g=>[g,p(g)]));fl=Array.from({length:60},()=>{let g=new fc(w.A);return g.visible=!1,g.scale.setScalar(3.4),g.userData.glyphs=w,Wo.add(g),g}),Wn=Vn(Fs,Jr,1.3,1500,9),Pl=Vn(Fs,0,1.3,1500,9,{capped:!0},Eg(),Wn.points),fi=new ei(qo,gn(16777215,{roughness:.45}),Rf),Fs.add(fi),ko=Vn(Fs,16764794,2.1,181),ih=Vn(Fs,0,6.5,121,12,{},of(11898096)),Ml=[15764134,15764134,15267071].map((g,_)=>{let S=Vn(El,0,_<2?13.5:12,41,14,{},of(g,{depthTest:!1}));return S.taper=_<2?9:6,S}),$o=Vn(sr,0,12,61,14,{},of(8838399,{depthTest:!1})),$o.taper=8,hr=Vn(sr,0,12.5,161,14,{},of(16743014,{depthTest:!1})),hr.taper=10,sh=Vn(_h,Jr,1.3,90,9),ar=new ei(qo,gn(16777215,{roughness:.45}),12),_h.add(ar);for(let g of[fi,ar])for(let _=0;_<g.count;_++)g.setColorAt(_,zf);ls=new nt(new Ts(1.6,16,12),gn(Hf,{emissive:Hf,emissiveIntensity:.45})),Fs.parent.add(ls);for(let g of[{n:-32.5,name:"\u221235",color:15111850},{n:-9.5,name:"\u221210",color:15111850},{n:0,name:"+1",color:14479359}]){let _=new sn;El.add(_),bl.push({...g,marker:_})}ph=new ei(qo,gn(16769192,{emissive:16763256,emissiveIntensity:.18}),9),yl.add(ph),Jo=Vn(yl,16767119,1.75,90,10,{emissiveIntensity:.14}),eo=new ei(Af,gn(16769440,{emissive:16761450,emissiveIntensity:.2}),7),yl.add(eo);let v=new gc(1.5,4,10);Gi=[yg,_g,Jr].map((g,_)=>{let S=new ei(v,gn(g,{emissive:g,emissiveIntensity:.18,roughness:.4}),_<2?Math.ceil((ra-Ai)/10)+2:48);return S.frustumCulled=!1,(_<2?sr:Fs).add(S),S}),ZT(),YT(),$T(),XT(f)}var ml,WT=[],Q_={value:0};function XT(n){ml=new Lt,jo.add(ml),ml.visible=!1;let e=(i,s)=>{let r=new ts({color:i,transparent:!0,opacity:.55,depthWrite:!1});return r.userData.noAO=!0,r.onBeforeCompile=o=>{o.uniforms.uTime=Q_,o.uniforms.uSpeed={value:s},o.vertexShader=o.vertexShader.replace("void main() {",`varying float vRun;
void main() {
vRun=uv.x;`),o.fragmentShader=o.fragmentShader.replace("void main() {",`uniform float uTime,uSpeed;varying float vRun;
void main() {
if(fract(vRun*14.-uTime*uSpeed)>.55)discard;`)},WT.push(r),r},t=(i,s,r,o)=>ml.add(new nt(new bc(new ns(i),96,o,10,!1),e(s,r)));t(Array.from({length:9},(i,s)=>vr.clone().addScaledVector(ze,110-s*14)),9425919,.6,5.5),t(Array.from({length:12},(i,s)=>n.getPoint(1-s/11)),16765562,.8,4.5),t(Array.from({length:10},(i,s)=>$t(yn,qt,si-s*2.2,N())),16753758,.7,4.5)}var ki,Cf=null,qT=null,ev=[14.5,15.3],Pg=n=>ne(n,...ev),ul={from:-470,reach:150};function $T(){ki=new Lt,Tl.add(ki),fs(Ai,0,{distance:0,grip:0,scrunch:0,init:0,open:0});let e=vn.clone(),t=Oi.clone(),i=wh.clone(),s=up.clone(),r=N(0,0,-70),o=[];for(let k=500;k>ul.from;k-=1.1)o.push(ta(k,N()));let a=ta(ul.from,N()),c=ta(ul.from-1,N()).sub(ta(ul.from+1,N())).normalize(),h=new qa(a,a.clone().addScaledVector(c,ul.reach),e.clone().addScaledVector(t,-ul.reach),e),l=Math.ceil(h.getLength()/1.1);for(let k=0;k<=l;k++){let z=k/l;o.push(h.getPointAt(z).addScaledVector(r,16*z*z*(1-z)*(1-z)))}let d=o.length,u=[],f=[],x=new Float32Array(d);for(let k=0;k<d;k++)u.push(k===d-1?t.clone():o[Math.min(d-1,k+1)].clone().sub(o[Math.max(0,k-1)]).normalize()),k&&(x[k]=x[k-1]+o[k].distanceTo(o[k-1]));f.push(N(0,1,0).addScaledVector(u[0],-u[0].y).normalize());for(let k=1;k<d;k++)f.push(f[k-1].clone().addScaledVector(u[k],-f[k-1].dot(u[k])).normalize());let y=yh/3.4,m=f[d-1],p=Math.atan2(m.dot(s),m.dot(i)),w=ea(yh*Ai+Qt.up-p-y*x[d-1]),v=N(),g=(k,z,ie)=>{let $=y*x[z]+w+(k?Qt.nt:0);return v.crossVectors(u[z],f[z]),ie.copy(o[z]).addScaledVector(f[z],Qt.radius*Math.cos($)).addScaledVector(v,Qt.radius*Math.sin($))},_=Ag=[Vn(ki,yg,1,d,8,{emissiveIntensity:.2}),Vn(ki,_g,.72,d,8,{emissiveIntensity:.16})];_.forEach((k,z)=>{for(let ie=0;ie<d;ie++)g(z,ie,k.points[ie]);k.update(d)});let S=_.map(k=>{let z=Vn(ki,0,k.base+.3,d,8,{capped:!0},Eg(),k.points);return z.update(d),z}),R=Math.floor(x[d-1]/3.4),P=[0,1].map(k=>new ei(qo,gn(16777215,{roughness:.55}),R)),b=N(),M=N(),C=N(),U=N(),V=N(),H=d-1;for(let k=0;k<R;k++){let z=x[d-1]-(k+1)*3.4;for(;H>0&&x[H-1]>z;)H--;let ie=Math.max(0,H-1),$=ft((z-x[ie])/Math.max(1e-6,x[H]-x[ie]));g(0,ie,U),g(0,H,V),b.lerpVectors(U,V,$),g(1,ie,U),g(1,H,V),M.lerpVectors(U,V,$),C.addVectors(b,M).multiplyScalar(.5),ds(P[0],k,b,C,.5,1),ds(P[1],k,M,C,.5,1),P.forEach((te,F)=>te.setColorAt(k,Mh[F]))}P.forEach(k=>{Hs(k),k.instanceColor.needsUpdate=!0,ki.add(k)}),qT={junction:e,strandEnds:_.map(k=>k.points[d-1]),pairs:R},Cf={strands:_,hulls:S,halves:P},ki.visible=!1}function YT(){let n=(t,i)=>{let s=new _c(1,5),r=s.attributes.position;for(let o=0;o<r.count;o++){let a=r.getX(o),c=r.getY(o),h=r.getZ(o),l=1+.08*Math.sin(3.1*a+i)*Math.sin(2.3*c+2*i)+.06*Math.sin(4.7*h+3*i)*Math.cos(2.9*a);r.setXYZ(o,a*t[0]*l,c*t[1]*l,h*t[2]*l)}return s.computeVertexNormals(),s},e=t=>gn(t,{transparent:!0,opacity:.32,depthWrite:!1,roughness:.85,emissive:t,emissiveIntensity:.02});Vs=new nt(n([66,40,52],1.3),e(14274486)),mr=new nt(n([90,70,82],2.9),e(11049596)),Zn=new Lt,Zn.add(Vs,mr),Zn.visible=!1,Tl.add(Zn),Zr=Vn(Tl,12179880,1.2,40,6,{emissiveIntensity:.2})}function ZT(){let n=$t(yn,qt,1,N()),e=N(...vl.get(14).p),t=e.clone().sub(n).multiplyScalar(.5),i=t.clone().normalize(),s=N(...Of.get(35).p).add(N(...vl.get(15).p)).sub(N(...Of.get(27).p)).sub(N(...vl.get(23).p));s.addScaledVector(i,-s.dot(i)).normalize();let r=$t(yn,qt,2,N()).sub(n).normalize(),o=N();rh.copy(r).multiplyScalar(2.9),o.copy(rh).addScaledVector(r.clone().multiplyScalar(.8).addScaledVector(s,.6).normalize(),2.9),B_.copy($t(yn,qt,.9,N())).sub($t(yn,qt,1.1,N())).normalize();let a=new nn().setFromRotationMatrix(new ut().makeBasis(i,s,N().crossVectors(i,s)));Nn={base:gn(Jr,{emissive:Jr,emissiveIntensity:.3,roughness:.35}),sugar:gn(16175786,{emissive:16175786,emissiveIntensity:.12}),alpha:gn(sf,{emissive:sf,emissiveIntensity:.35,roughness:.3}),bond:gn(15392714,{roughness:.5}),bridge:gn(15392714,{roughness:.5}),ppi:gn(sf,{emissive:sf,emissiveIntensity:.35,roughness:.3})},Tn=new Lt,Hi=new Lt,Wo.add(Tn,Hi);let c=(_,S,R,P,b)=>{let M=new nt(qo,P),C=S.clone().sub(_);M.position.copy(_).add(S).multiplyScalar(.5),M.quaternion.setFromUnitVectors(Ei,C.clone().normalize()),M.scale.set(R,C.length(),R),b.add(M)},h=new nt(new As(2.1,2.1,.95,6),Nn.base),l=new nt(new As(1.3,1.3,.8,5),Nn.sugar),d=new nt(Af,Nn.alpha);h.position.copy(i).multiplyScalar(t.length()*.68),h.quaternion.copy(a),l.position.copy(i).multiplyScalar(2.5),l.quaternion.copy(a),d.scale.setScalar(1.15),Tn.add(h,l,d),c(l.position,h.position,.5,Nn.bond,Tn),c(N(),l.position,.4,Nn.bond,Tn),c(N(),rh,.38,Nn.bridge,Tn);let u=new nt(Af,Nn.ppi),f=new nt(Af,Nn.ppi);u.scale.setScalar(1.15),f.scale.setScalar(1.15),f.position.copy(o).sub(rh),Hi.add(u,f),c(N(),f.position,.38,Nn.ppi,Hi);let x=Zo.bridgeHelix.map(_=>N(..._)),y=Sh(x),m=x.map(_=>_.clone().sub(y.c).dot(y.d));cs=new nt(new As(2.8,2.8,Math.max(...m)-Math.min(...m)+4,18),gn(12577522,{emissive:12577522,emissiveIntensity:.18,roughness:.3})),cs.userData.centre=y.c.clone().addScaledVector(y.d,(Math.max(...m)+Math.min(...m))/2),cs.quaternion.setFromUnitVectors(Ei,y.d),Wo.add(cs);let p=N(...Zo.triggerLoopN.at(-1)),w=N(...Zo.triggerLoopC[0]),v=p.clone().add(w).multiplyScalar(.5);q_.copy(v).addScaledVector(v.clone().sub(n).normalize(),10),$_.copy(n).addScaledVector(cs.userData.centre.clone().sub(n).normalize(),6),Kr=Vn(Wo,15983554,1.5,48,8,{emissiveIntensity:.3}),Yo.push(...Zo.triggerLoopN.map(_=>N(..._)),N(),N(),N(),...Zo.triggerLoopC.map(_=>N(..._))),V_=new ns(Yo,!1,"centripetal");let g=Cy([new As(1.7,1.7,.7,6).rotateZ(Math.PI/2),...[0,1,2].map(_=>new Ts(.85,10,8).translate(0,2.6+1.9*_,0))].map(_=>(_.deleteAttribute("uv"),_)));Qo=new ei(g,gn(Jr,{emissive:Jr,emissiveIntensity:.12,roughness:.4}),16),Qo.frustumCulled=!1,Wo.add(Qo),fr=new nt(new Ts(1.25,16,12),gn(13172696,{emissive:13172696,emissiveIntensity:.5})),ur=new nt(new Ts(1,18,12),new ts({color:16773320,transparent:!0,opacity:0,depthWrite:!1,blending:Fr})),Wo.add(fr,ur)}var it=N(),un=N(),pi=N(),Xt=N(),ps=N(),fa=N(),ag=N(),a_=N(),l_=new nn,c_=new nn,pf=new hi;function KT(n){n.open>0&&K_(n);let e=Bi(Ai,n),t=Bi(ra,n),i=0;for(let x of[0,1]){let y=Wt[x],m=y.points.length-1,p=r0[x],w=0;for(let v=e;v<t&&w<m;v+=v>-45&&v<50?1/6:1/2.3)p[w]=v,ht(x,v,n,y.points[w++]);p[w]=t,ht(x,t,n,y.points[w++]),y.update(w),da[x].update(w)}for(let x=0,y=Ai;y<=ra;x++,y++){let m=Bi(y,n);ht(0,m,n,it),ht(1,m,n,un),pi.addVectors(it,un).multiplyScalar(.5);let p=1-fp(m,n)*pt((y-n.distance/3.4-Un)/1.5)*pt((Si-m)/1.5);ds(wi[0],x,it,pi,.5,p),ds(wi[1],x,un,pi,.5,p),p<.5&&Math.abs(m)<20&&i++}vT=i;let s=n.path||"rho";if(Math.abs(us-Yy)>.01||s!==Zy){for(let[x,y]of wi.entries()){for(let m=0;m<y.count;m++){let p=Ai+m;y.setColorAt(m,Gf.copy(Mh[x]).lerp(Vf[x===0?Oo(p,s):Gr(p,s)],us))}y.instanceColor.needsUpdate=!0}Yy=us,Zy=s}Hs(wi[0]),Hs(wi[1]),Tf=1-pt((Ke.position.distanceTo(yt.target)-600)/200);for(let x of[0,1]){let y=0,m=Gi[x];for(let p=Math.ceil(Ai/10)*10;p<=ra;p+=10,y++){let w=Bi(p,n);if(Tf<.01){$f(m,y,it,0);continue}ht(x,w,n,it),Xt.subVectors(it,vn).setLength(1.2),ht(x,w+(x?.25:-.25),n,ps),ht(x,w+(x?-.25:.25),n,fa),un.subVectors(ps,fa).normalize(),xt.position.copy(it).add(Xt),xt.quaternion.setFromUnitVectors(Ei,un),xt.scale.setScalar(Tf*(w>Un&&w<Si?.7:1)),xt.updateMatrix(),m.setMatrixAt(y,xt.matrix)}for(;y<m.count;y++)$f(m,y,it,0);Hs(m)}let r=0;for(let x=Math.ceil(n.register-9.4);x<=Math.floor(n.register+1.7)&&r<qf;x++){let y=x-n.register,m=zl(y,n)*(x===Jt.j?1-.4*n.error:1);m<.01||(ht(0,y,n,it),$t(yn,qt,y,un).addScaledVector(ze,n.distance),pi.addVectors(it,un).multiplyScalar(.5),ks.setColorAt(r,Gf.copy(Mh[0]).lerp(Vf[Oo(x,n.path||"rho")],us)),ds(ks,r++,it,pi,.5,m))}for(;r<qf;r++)ds(ks,r,it,it,0,0);Hs(ks),ks.instanceColor.needsUpdate=!0;let o=n.time,a=Pg(o);if(El.visible=a>.01,El.visible)for(let x of bl)fs(Bi(x.n,n),n.grip,n),x.marker.position.copy(vn);let c=oh(o,Je.wait[0]+.3,Je.wait[0]+1.3,Je.approach[0]+.2,Je.approach[0]+1.4),h=.8*oh(o,Je.approach[0]+.4,Je.found,41.4,43.4),l=a*Math.max(.3,c,h);[[-35,-30],[-12,-7],[0,0]].forEach(([x,y],m)=>{let p=Ml[m],w=m<2?2:1.2,v=m<2?l:l*.8*(1-.6*n.open);if(p.material.uniforms.uAmount.value=v,v<.01){p.update(0);return}let g=0;for(let _=x-w;_<=y+w+1e-6&&g<p.points.length;_+=.25)fs(Bi(_,n),n.grip,n),p.points[g++].copy(vn);p.update(g)});let d=n.path&&ii[n.path],u=d&&o>=d.show[0]?(n.path==="rho"?.9:.65)*Math.max(oh(o,...d.show),.4*ne(o,d.show[0],d.show[1]))*(1-(1-n.release)*pt((n.register-d.n[0]+12)/8)):0;if(hr.material.uniforms.uAmount.value=u,u>.01){let x=0;for(let y=d.n[0]-2;y<=d.n[1]+2+1e-6&&x<hr.points.length;y+=.25)fs(Bi(y,n),n.grip,n),hr.points[x++].copy(vn);hr.update(x)}else hr.update(0);let f=.5*oh(o,44.2,45.2,49,51);if($o.material.uniforms.uAmount.value=f,f>.01){let x=0;for(let y=Un-1;y<=Si+1+1e-6&&x<$o.points.length;y+=.3)fs(y,n.grip,n),$o.points[x++].copy(vn);$o.update(x)}else $o.update(0)}function tv(n,e,t,i,s){ag.copy(Math.abs(t.y)<.9?Ei:ze).cross(t).normalize(),a_.crossVectors(t,ag);let r=n*1.15;return s.copy(ag).multiplyScalar(Math.cos(r)).addScaledVector(a_,Math.sin(r)).multiplyScalar(i).add(e)}function jT(n){let e=n.ntCount,t=e-1;if(Fs.visible=e>.02,!Fs.visible){lr=(f,x)=>Vt(f,n,x);return}let i=0;if(t>.05){let f=Math.ceil(t*3);for(let x=0;x<=f&&i<Wn.points.length;x++)Vt(Math.min(t,x/3),n,Wn.points[i++])}Wn.update(i),Pl.update(i);let s=Wn.points,r=(f,x)=>{let y=Math.round(f*3);return Math.abs(y-f*3)<1e-6&&y>=0&&y<i-1?x.copy(s[y]):Vt(f,n,x)};lr=r;let o=Math.min(Rf,Math.ceil(e-1e-6)),a=pp(n),c=a?[...Vr(a[0],n.ntCount),a[1]]:null;for(let f=0;f<Rf;f++){if(f>=o){ds(fi,f,it,it,0,0);continue}let x=n.addition?f:Math.min(f,Math.max(0,t)),y=x-n.register,m=zl(y,n);r(x,it),r(x+1/3,Xt),r(Math.max(0,x-1/3),ps),fa.subVectors(Xt,ps).normalize(),tv(f,it,fa,3.6,un),m>0&&(ht(0,y,n,pi),pi.add(it).multiplyScalar(.5),un.lerp(pi,m));let p=c&&f>=c[0]&&f<=c[1]?c[2]:0,w=f===Jt.j?n.error:0;ds(fi,f,it,un,.55,ft(e-f)*(1-p)*(1-.4*w))}let h=n.path||"rho";if(Math.abs(us-Ky)>.01||h!==jy){for(let f=0;f<Rf;f++)fi.setColorAt(f,Gf.copy(zf).lerp(Vf[Bo(f,h)],us));fi.instanceColor.needsUpdate=!0,Ky=us,jy=h,ll=-1}let l=n.error>.02&&Jt.j<o?Jt.j:-1;l!==ll&&(ll>=0&&fi.setColorAt(ll,Gf.copy(zf).lerp(Vf[Bo(ll,h)],us)),l>=0&&fi.setColorAt(l,z_),fi.instanceColor.needsUpdate=!0,ll=l),Hs(fi);let d=Gi[2],u=0;for(let f=5;f<e-2&&u<d.count;f+=10,u++)r(f,it),r(f+1/3,Xt),r(f-1/3,ps),un.subVectors(Xt,ps).normalize(),xt.position.copy(it),xt.quaternion.setFromUnitVectors(Ei,un),xt.scale.setScalar(Tf),xt.updateMatrix(),d.setMatrixAt(u,xt.matrix);for(;u<d.count;u++)$f(d,u,it,0);Hs(d)}var h_=34,JT=N(0,-.9,0),lg=N(),eh=N(),th=N(),cg=N(),u_=new ut,d_=new nn,f_=new nn;function QT(n){let e=Il(n.time);if(Zn.visible=!!e&&e.fade>.01,Yr.quaternion.identity(),!Zn.visible){Zr.update(0);return}Vt(e.j,n,lg),eh.copy(ze),th.copy(JT),th.addScaledVector(eh,-th.dot(eh)).normalize(),cg.crossVectors(eh,th).normalize(),cT.copy(lg),u_.makeBasis(eh,th,cg),Zn.quaternion.setFromRotationMatrix(u_),Zn.position.copy(lg),Vs.position.set(-h_,34,0).addScaledVector(N(0,0,1),110*(1-e.small)).addScaledVector(N(0,0,-1),70*e.split),mr.position.set(-h_*1.4,134,0).addScaledVector(N(0,1,0),150*(1-e.large)+90*e.split),mt(Vs.material,.32*e.small*e.fade),mt(mr.material,.32*e.large*e.fade),Vs.material.depthWrite=mr.material.depthWrite=!1,Zn.updateMatrixWorld();let t=Math.round(40*e.peptide);if(t>1){for(let i=0;i<t;i++){let s=i/39;Xt.set(18*Math.sin(s*7),150+95*s+30*e.split*(1-s),14*Math.cos(s*5)+60*e.split).applyMatrix4(Zn.matrixWorld),Zr.points[i].copy(Xt)}Zr.update(t),mt(Zr.material,e.fade)}else Zr.update(0);e.kow>.001&&(d_.copy(Zn.quaternion),Xt.set(0,4,0).applyQuaternion(d_).add(Zn.position).addScaledVector(cg,-20),yr.updateMatrixWorld(),yr.worldToLocal(Xt),Xt.sub(Yr.position).normalize(),f_.setFromUnitVectors(D_,Xt),Yr.quaternion.slerp(f_,e.kow*.85))}function eE(n){let e=us>.5&&Fi>1.1&&n.time>=34,t=0,i=n.path||"rho",s=(r,o)=>{if(t>=fl.length)return;let a=fl[t++];a.material=a.userData.glyphs[o],a.position.copy(r),a.scale.setScalar(Math.max(3,9/Fi)),a.visible=!0};if(e){for(let r=-12;r<=6;r++){let o=Math.round(r+dp(r,n));ht(0,r,n,it),ht(1,r,n,un),pi.addVectors(it,un).multiplyScalar(.5);let a=fp(r,n)*pt((r-Un)/1.5)*pt((Si-r)/1.5);s(Xt.copy(it).lerp(pi,.35),Oo(o,i)),(a<.5||r>1)&&s(ps.copy(un).lerp(pi,.35),Gr(o,i))}for(let r=Math.max(0,Math.ceil(n.register-8));r<=Math.floor(n.ntCount-1)&&t<fl.length;r++)zl(r-n.register,n)<.3&&r<n.register||(lr(r,it),ht(0,r-n.register,n,un),s(Xt.copy(it).lerp(un,.3),r===Jt.j&&n.error>.5?Jt.wrong:Bo(r,i)))}for(;t<fl.length;t++)fl[t].visible=!1}function tE(n){let e=n.fragment;if(_h.visible=!!e&&e.fade>.01,!_h.visible)return;let t=e.offsets[0]+e.shift,i=e.offsets.at(-1)+e.shift,s=0;for(let r=t;s<sh.points.length;r+=1/3){let o=Math.min(r,i);if($t(yn,qt,o,sh.points[s++]).addScaledVector(ze,n.distance),o>=i)break}sh.update(s),mt(sh.material,e.fade),mt(ar.material,e.fade),e.offsets.forEach((r,o)=>{let a=r+e.shift;$t(yn,qt,a,it).addScaledVector(ze,n.distance),$t(yn,qt,a+.3,Xt),$t(yn,qt,a-.3,ps),fa.subVectors(Xt,ps).normalize(),tv(o,it,fa,3.6,un);let c=zl(a,n)*(1-ne(e.shift,0,2));c>0&&(ht(0,a,n,pi),pi.add(it).multiplyScalar(.5),un.lerp(pi,c)),ds(ar,o,it,un,.55,1),ar.setColorAt(o,n.error>.02&&o===e.offsets.length-1?z_:zf)}),ar.instanceColor.needsUpdate=!0;for(let r=e.offsets.length;r<12;r++)ds(ar,r,it,it,0,0);Hs(ar)}function nE(n){let e=n.time,t=n.addition,i=fa.copy(ze).multiplyScalar(n.distance),s=ne(e,107.4,108.4)*(1-ne(e,kt.start,kt.start+1.2)),r=Math.max(s,pt((Rl-.4)/.5)*(n.release<.5?1:0));fr.visible=r>.01,fr.position.copy(i),mt(fr.material,r);let a=n.cleavage;if(Tn.visible=Hi.visible=!!t,t){let d=t.cycle===Jt.cycle,u=t.f,f=1-Math.pow(1-ft(u/.4),2.2),x=ne(u,.28,.42),y=Re(15,1,f),m=(Fn?.25:1)*(1-(d?.5:1)*x),p=e*2.3+t.cycle*1.7;if(d!==Jy){Jy=d;let g=d?Hf:Jr;Nn.base.color.setHex(g),Nn.base.emissive.setHex(g)}$t(yn,qt,y,Tn.position).add(i),$t(yn,qt,y-.1,Xt),$t(yn,qt,y+.1,ps),l_.setFromUnitVectors(B_,Xt.sub(ps).normalize()),pf.set(.9*m*Math.sin(p)+(d?.44*x:0),.9*m*Math.cos(p*1.3),.6*m*Math.sin(p*.7)),Tn.quaternion.copy(l_).multiply(c_.setFromEuler(pf)),Tn.position.add(it.set(Math.sin(p*1.9),Math.cos(p*1.4),Math.sin(p*2.3)).multiplyScalar(2.2*m));let w=ne(u,0,.07),v=1-ne(u,.52,.6);if(mt(Nn.base,w*v),mt(Nn.sugar,w*v),mt(Nn.alpha,w*v),mt(Nn.bond,w*v),mt(Nn.bridge,w*(1-ne(u,.5,.56))),u<.56)Hi.position.copy(rh).applyQuaternion(Tn.quaternion).add(Tn.position),Hi.quaternion.copy(Tn.quaternion);else{let g=ne(u,.58,.9);$t(yn,qt,Re(1.48,16,g),Hi.position).add(i),pf.set(g*4.1,g*2.7,g*1.9),Hi.quaternion.copy(Tn.quaternion).multiply(c_.setFromEuler(pf))}mt(Nn.ppi,w*(1-ne(u,.8,.9))),a=Math.max(a,(d?.5:1)*Math.sin(Math.PI*ne(u,.47,.63)))}let c=t?ne(t.f,.28,.42)*(1-ne(t.f,.62,.74))*(t.cycle===Jt.cycle?.5:1):0,h=s;if(Kr.mesh.visible=cs.visible=h>.01,h>.01){Ko.lerpVectors(q_,$_,c);let d=Zo.triggerLoopN.length;Yo[d].copy(Ko).lerp(Yo[d-1],.45),Yo[d+1].copy(Ko),Yo[d+2].copy(Ko).lerp(Yo[d+3],.45);for(let u=0;u<48;u++)V_.getPoint(u/47,Kr.points[u]).add(i);Kr.update(48),mt(Kr.material,h),cs.position.copy(cs.userData.centre).add(i),mt(cs.material,.4*h),Ko.add(i)}else Kr.update(0);let l=ne(e,107.4,108.6)*(1-ne(e,120.6,121.6));if(Qo.visible=l>.01,Qo.visible){$t(yn,qt,18,it).add(i);for(let d=0;d<16;d++){let u=x=>Math.sin(d*12.9898+x*78.233)*43758.5453%1,f=12+22*Math.abs(u(1));Xt.set(u(2),u(3),u(4)).normalize().multiplyScalar(f),Xt.x+=4*Math.sin(e*.7+d),Xt.y+=4*Math.cos(e*.6+d*1.3),Xt.z+=3*Math.sin(e*.5+d*2.1),xt.position.copy(it).add(Xt),xt.rotation.set(e*.4+d,e*.3+d*2,d),xt.scale.setScalar(l),xt.updateMatrix(),Qo.setMatrixAt(d,xt.matrix)}Qo.instanceMatrix.needsUpdate=!0}ur.visible=a>.01,ur.visible&&($t(yn,qt,t?.6:.5,ur.position).add(i),ur.scale.setScalar(1.2+(Fn?.4:1.7)*a),ur.material.opacity=(Fn?.3:.75)*a,fr.material.emissiveIntensity=.5+1.2*a)}var Ig=N(),mf=N(),Ng=!1;function nv(){return innerHeight/(2*Ke.position.distanceTo(yt.target)*Math.tan(Ke.fov*ms/2))}function Kf(){let n=rt,e=n.time;Gt.copy(l0(n)),jo.position.copy(Gt),Nt&&Ng&&(mf.subVectors(Gt,Ig),mf.lengthSq()>1e-8&&(Ke.position.add(mf),yt.target.add(mf))),Ig.copy(Gt),Ng=!0,Fi=nv();for(let g of Wt)g.radius=Math.max(g.base,.8/Fi);if(Wn.radius=Math.max(Wn.base,1/Fi),Wt.forEach((g,_)=>da[_].radius=g.radius+Math.max(.3,.9/Fi)),Pl.radius=Wn.radius+Math.max(.35,.9/Fi),ia.forEach(g=>{let[_,S]=ug[g.userData.chain],R=ne(e,_,S);g.position.copy(g.userData.out).multiplyScalar(70*(1-R)),g.visible=e>=_-1}),e<9)hn.position.copy(Wy);else if(e<Je.land[0]){let g=ne(e,9,14.5);hn.position.lerpVectors(Wy,Gt,g),hn.position.z-=hT*Math.sin(Math.PI*g)}else e<78?hn.position.copy(Gt):hn.position.lerpVectors(Gt,uT,ne(e,78,86));let t=1-ne(e,87,91);hn.visible=t>.01;let i=n.path==="intrinsic"&&!Nt?Math.max(ne(e,142,146),ne(e,ii.intrinsic.show[2],ii.intrinsic.show[3])*(1-ne(e,144,146)))*(1-ne(e,153.5,157)):0,s=ky(e,n.path),r=Nt?0:ne(e,kt.start+.4,kt.fold[0]+.4)*(1-ne(e,kt.resume,kt.resume+1)),o=(g,_)=>{g.material.emissiveIntensity=_*(Fn?.27:.2+.13*Math.sin(e*5.2))};if(ua.visible=s.nusA>.01,ua.position.copy(Gt).addScaledVector(U_,70*(1-s.nusA)),mt(dr.material,s.nusA*(1-.72*i-.55*r)),o(dr,s.nusAActive),yr.visible=s.nusG>.01,yr.position.copy(Gt).addScaledVector(F_,60*(1-s.nusG)),mt(ai.material,s.nusG*(1-.96*i-.85*r)),o(ai,s.nusGActive),Os.visible=n.rhoVisible,n.rhoVisible){let g=n.rhoIndex,_=Vt(g,n,it),S=Vt(Math.min(n.ntCount-1,g+1),n,yT).sub(Vt(Math.max(0,g-1),n,Xt)).normalize();$y.setFromUnitVectors(H_,S);let R=_T.copy(ze).multiplyScalar(n.distance).add(L_).addScaledVector(N_,n.release);no.copy(_).lerp(R,n.rhoEngage),Os.position.copy(no),Os.quaternion.copy($y).slerp(new nn,n.rhoEngage);let P=ne(e,136,143),b=ne(e,198.5,201);Os.position.y-=80*(1-P),Os.position.addScaledVector(no.clone().sub(Gt).normalize(),45*b),Qr.forEach(M=>{mt(M.material,P*(1-b)),M.material.emissive.setHex(4400208),M.material.emissiveIntensity=e>=146&&e<188?Fn?.14*Math.max(0,Math.cos(Math.PI*2*(e/3-M.userData.rhoIndex/6)))**4:Math.floor(e*2)%6===M.userData.rhoIndex?.14:0:0})}let a=zy(e,n.path);zi!==null&&n.chapter!==t0&&(zi=null);let c=zi===null?ft(a):zi?1:0;if(Rl=c,hg!==c>.5&&(hg=c>.5,T("cutaway").setAttribute("aria-pressed",String(hg))),ml.visible=a0&&(c>.5||Nt)&&e>=44,ml.visible&&(Q_.value=e),VT(n,ff),jo.quaternion.copy(ff),jo.position.copy(Gt).add(vr).sub(HT.copy(vr).applyQuaternion(ff)),e>=Je.land[0]&&e<78?(hn.quaternion.copy(ff),hn.position.copy(jo.position)):hn.quaternion.identity(),ki.visible=e>=ev[0]&&e<30,ki.visible){let g=Pg(e)*(1-ne(e,27,30)),_=pt((Fi-.35)/.4);Cf.strands.forEach((S,R)=>{let P=Cf.hulls[R],b=Math.max(S.base,.8/Fi),M=b+Math.max(.3,.9/Fi);(Math.abs(S.radius-b)>.02||Math.abs(P.radius-M)>.02)&&(S.radius=b,P.radius=M,S.update(S.count),P.update(P.count)),mt(S.material,g),mt(P.material,g)});for(let S of Cf.halves)mt(S.material,g*_)}let h=ne(e,9,12),l=g=>ft(e-ug[g.userData.chain][0]+1),d=g=>{let _=ug[g.userData.chain][0];return ne(e,_+.2,_+.8)*(1-ne(e,_+2.6,_+3.6))};ia.forEach(g=>{let _=g.material.userData.uniforms;_.uRim.value=.2+1.1*d(g),_.uCut.value=c,_.uCapOn.value=g.material.opacity>.999?1:0,g.material.color.copy(lE.setHex(aE[g.userData.chain]).multiplyScalar(I_)).lerp(g.material.userData.base,h).multiplyScalar(1-.25*c),mt(g.material,Math.min(l(g),1-.94*i-.9*r));let S=c>.001?Xy:qy;(g.material.clippingPlanes?.length||0)!==S.length&&(g.material.clippingPlanes=S,g.material.needsUpdate=!0)}),mt(sa.material,t*(1-.6*c*(e<72?1:0)));{let g=ai.material.userData.uniforms,_=c>.001?Xy:qy;g.uCut.value=c,g.uCapOn.value=ai.material.opacity>.999?1:0,(ai.material.clippingPlanes?.length||0)!==_.length&&(ai.material.clippingPlanes=_,ai.material.needsUpdate=!0)}let u=(1-pt(Math.max(c,i,r)/.08))*(1-pt((Il(e)?.fade??0)/.08));Wf=u>.004&&!(so&&performance.now()<Sp),oi&&(oi.enabled=Wf&&br[Gs].ao,oi.copyMaterial.uniforms.opacity.value=u);for(let g of Nl){let _=g.material,S=_.clippingPlanes?.length?vi:ji;_.side!==S&&(_.side=S,_.needsUpdate=!0)}let f=zi===!0&&n.rhoVisible;if(Qr.forEach(g=>{let _=f?[Mg]:[];(g.material.clippingPlanes?.length||0)!==_.length&&(g.material.clippingPlanes=_,g.material.needsUpdate=!0)}),us=mT(e,n.path),KT(n),jT(n),tE(n),nE(n),eE(n),QT(n),ls.visible=n.error>.02,ls.visible&&(n.fragment&&n.time>=ct.cleave?$t(yn,qt,n.fragment.offsets.at(-1)+n.fragment.shift,ls.position).addScaledVector(ze,n.distance):Vt(Jt.j,n,ls.position),ls.scale.setScalar(n.error),mt(ls.material,n.fragment?n.fragment.fade:1)),ko.mesh.visible=n.path==="rho"&&e>=136&&e<184,ko.mesh.visible){for(let g=0;g<181;g++)lr(Zc+g/3,ko.points[g]);ko.update(181)}else ko.update(0);let x=n.path==="rho"&&re?oh(e,136.2,137.2,142.4,144.8):0;if(ih.material.uniforms.uAmount.value=x,ko.material.emissiveIntensity=.035+.6*x,x>.01){for(let g=0;g<121;g++)lr(Zc+g/2,ih.points[g]);ih.update(121)}else ih.update(0);let y=pp(n),m=n.path==="intrinsic"&&e>=136?ft((n.ntCount-362)/6):0,p=y?Math.max(ft(y[1]*3),m):m;if(yl.visible=p>.02,yl.visible){let[g,_]=y||[tr,0],[S,R]=Vr(g,g===tr?ss.intrinsic:n.ntCount),P=Math.min(R,n.ntCount-1),b=0;for(let M=0;S+M/3<=P+1e-6&&b<Jo.points.length;M++)lr(S+M/3,Jo.points[b++]);Jo.update(b),mt(Jo.material,p);for(let M=0;M<9;M++)M<g.pairs&&_>0?RT(ph,M,lr(S+M,it),lr(R-M,un),.55,J_(_,M,g)):ds(ph,M,it,it,0,0);if(Hs(ph),eo.visible=g===tr&&_>0,eo.visible){for(let M=0;M<7;M++)$f(eo,M,lr(n.ntCount-7+M,it),1.6);Hs(eo)}}let w=Pg(e)*(1-.8*i-.55*r),v=pt((Fi-.35)/.4);[Wt[0].material,Wt[1].material,...da.map(g=>g.material)].forEach(g=>mt(g,w)),[wi[0].material,wi[1].material].forEach(g=>mt(g,w*v));for(let g of[Gi[0],Gi[1]])g.visible=w>.01,mt(g.material,w);mt(Wn.material,1),mt(Pl.material,1),mt(fi.material,1),mt(Gi[2].material,1),zE();for(let g of Nl){let _=g.material.userData.uniforms;_&&(_.uCapOn.value=g.material.opacity>.999?1:0)}}function iv(){let n=gT.subVectors(Ke.position,yt.target).normalize();Bf.normal.copy(n).negate(),Bf.constant=n.dot(xT.copy(Gt).add(fT))+Re(160,-1,Rl),Mg.normal.copy(n).negate(),Mg.constant=n.dot(no)}var ms=Math.PI/180,sv=(n,e,t)=>(n+e+Math.hypot(n-e,t))/2,rv=n=>(n=ft(n),n*n*n*(n*(6*n-15)+10)),mn=(n,e,t,i)=>({target:n,offset:e,yaw:t,dist:i}),Vo={fov:26},Pf={fov:30,wide:!0};function iE(n){let e=innerWidth;return innerHeight<=560&&e>600?[.5,n?.4:.46]:e<=780?[.5,n?.32:.34]:e<=1100?[.58,n?.36:.4]:n?[.56,.36]:[.6,.4]}var c0=[{start:0,blend:0,fit:!0,frame:(n,e)=>mn(N(-160,5,-15).lerp(N(-105,0,-10),pt(e)),N(110,175,-635),Re(-8,6,e),Re(800,680,e))},{start:Je.land[0],blend:2.4,frame:(n,e,t)=>{let i=1-pt((e-.14)*2.6);return mn(t.add(N(-40-140*i,20+30*i,-20)),N(70,165,-420),Re(7,-5,e),Re(590,470,e)+420*i)}},{start:Je.wait[0],blend:2.6,...Vo,frame:(n,e)=>(fs(Bi(-24,n),n.grip,n),mn(vn.clone().add(N(0,8,0)),N(30,90,-430),Re(-6,5,e),Re(470,440,e)))},{start:Je.approach[0],blend:2.4,frame:(n,e,t)=>mn(t.add(N(-40,20,-20)),N(70,165,-420),Re(3,-5,e),Re(520,450,e))},{start:rs.chapter,blend:2.8,...Vo,frame:(n,e,t)=>mn(t.add(N(-12,-14,-26)),N(20,-150,-120),Re(-6,4,e),Re(265,225,e))},{start:44,blend:2.2,...Vo,frame:(n,e,t)=>mn(t.add(N(-13,-13,-9)),N(20,45,-165),Re(-7,7,e),Re(180,164,e))},{start:72,blend:2.2,frame:(n,e,t)=>mn(t.add(N(-30,-30,-20)),N(110,135,-450),Re(5,-8,e),Re(460,520,e))},{start:It.factors,blend:2.2,frame:(n,e,t)=>mn(t.add(MT),ST,Re(5,-35,e),Re(495,455,e))},{start:It.wide,blend:4.5,...Pf,frame:(n,e)=>{let t=pt(e),i=Il(n.time),s=i?Math.min(i.small,i.fade):0,r=sv(495,n.distance*1.75+400,100)*(1+.3*s);return mn(ze.clone().multiplyScalar(n.distance*.5+55-.073*r).add(N(0,-50-95*s,-20)),N(130,-Re(130,440,t),-Re(460,1460,t)),Re(-4,4,e),r)}},{start:It.end,blend:4.2,...Vo,frame:(n,e,t)=>mn(t.add(N(6,-10,-10)),n_,Re(-4,3,e),Re(180,170,e))},{start:ct.start,blend:1.6,...Vo,frame:(n,e,t)=>mn(t.add(N(10,-4,-10)),n_,Re(3,-3,e),Re(188,180,e))},{start:kt.start,blend:3.2,...Vo,frame:(n,e,t)=>mn(t.add(TT),ET,Re(-5,4,e),Re(190,168,e))}],h0={rho:[{start:136,lead:0,blend:3.6,...Pf,frame:(n,e,t)=>{let i=n.rhoVisible?no:t,s=i.clone().add(t).multiplyScalar(.5),r=sv(540,i.distanceTo(t)*1.75+220,90),o=N(100,-Math.max(220,r*.29),-r),a=ii.rho.show,c=ne(n.time,a[0]-1.2,a[0])*(1-ne(n.time,a[3],a[3]+1.6));return mn(s.add(N(0,-15,-10)).addScaledVector(ze,-.07*r+110*c),o,Re(0,-35,e),o.length())}},{start:180,blend:3.6,frame:(n,e,t)=>mn(t.add(N(-25,-48,-15)),N(-155,145,-420),Re(20,32,e),Re(490,430,e))},{start:190,blend:4,...Pf,frame:(n,e)=>mn(ze.clone().multiplyScalar(n.distance*.67).add(N(0,-60,-10)),N(150,-460,-1550),Re(-10,25,e),Re(1620,1720,e))},{start:200,blend:4,frame:(n,e,t)=>mn(t.add(N(-30,-30,-15)),N(90,170,-440),Re(-20,0,e),Re(480,420,e))}],intrinsic:[{start:136,lead:0,blend:2.4,frame:(n,e,t)=>{let i=1-pt((n.time-ii.intrinsic.show[2])/1.6);return mn(t.add(N(-20,-25,-8)).addScaledVector(ze,70*i),N(40,70,-220),Re(-5,4,e),Re(245,225,e)+90*i)}},{start:142,blend:2.2,...Vo,frame:(n,e,t)=>mn(t.add(wT),AT,Re(5,-12,e),Re(176,158,e))},{start:154,blend:4,...Pf,frame:(n,e)=>mn(ze.clone().multiplyScalar(n.distance*.63).add(N(0,-55,-10)),N(140,-400,-1480),Re(25,35,e),Re(1540,1640,e))},{start:166,blend:4,frame:(n,e,t)=>mn(t.add(N(-30,-30,-15)),N(90,170,-440),Re(-20,0,e),Re(480,420,e))}]};function jf(n,e,t,i=Gt){let s=n[e],r=n[e+1]?.start??Cn(t.path),o=t.time,a=Fn?.5:Math.max(-.5,Math.min(1.5,(o-s.start)/(r-s.start))),c=s.frame(t,a,i.clone()),h=Fn?0:1,l=c.yaw+h*(.9*Math.sin(o*.31)+.4*Math.sin(o*.83+2)),d=h*(.7*Math.sin(o*.27+1)+.3*Math.sin(o*.71)),u=c.offset.clone().normalize().applyAxisAngle(Ei,l*ms),f=N().crossVectors(Ei,u);f.lengthSq()>1e-6&&u.applyAxisAngle(f.normalize(),d*ms);let x=s.fov||36,y=s.wide||s.fit?Math.min(2.2,Math.max(1,(1.5*innerHeight/innerWidth)**.8)):1;return{target:c.target,dir:u,dist:c.dist*y*Math.tan(18*ms)/Math.tan(x/2*ms),fov:x,anchor:iE(s.wide)}}function ov(n,e,t){let i=d=>({az:Math.atan2(d.x,d.z),el:Math.asin(Math.max(-1,Math.min(1,-d.y)))}),s=i(n.dir),r=i(e.dir),o=ea(r.az-s.az),a=Fn?0:ft((Math.abs(o)-100*ms)/(50*ms)),c=(s.el+r.el)/2,h=Re(s.el,r.el,t)+Math.sin(Math.PI*t)*Math.max(0,80*ms-c)*a,l=s.az+o*t;return{target:n.target.clone().lerp(e.target,t),dir:N(Math.cos(h)*Math.sin(l),-Math.sin(h),Math.cos(h)*Math.cos(l)),dist:Math.exp(Re(Math.log(n.dist),Math.log(e.dist),t)),fov:Re(n.fov,e.fov,t),anchor:[Re(n.anchor[0],e.anchor[0],t),Re(n.anchor[1],e.anchor[1],t)]}}function sE(n){let e=[...c0,...h0[n.path]],t=n.time,i=l=>Fn?Math.min(l.blend,1.2):l.blend,s=l=>i(l)*(l.lead??.35),r=l=>Fn&&l>0&&rE(e,l,n.path),o=0;If=0;for(let l=1;l<e.length;l++)t>=e[l].start-(r(l)?0:s(e[l]))&&(o=l),r(l)&&zt&&(If=Math.max(If,.85*(1-ft(Math.abs(t-e[l].start)/.35))));let a=e[o],c=jf(e,o,n);if(r(o))return c;let h=a.blend?rv((t-a.start+s(a))/i(a)):1;return h<1&&o>0?ov(jf(e,o-1,n),c,h):c}var If=0,Dg=-1,hg=null,mh={};function rE(n,e,t){let i=t+e;if(!(i in mh)){let s=os(n[e].start,t),r=l0(s),o=jf(n,e-1,s,r),a=jf(n,e,s,r),c=h=>Math.atan2(h.x,h.z);mh[i]=Math.abs(ea(c(o.dir)-c(a.dir)))>60*ms||Math.max(o.dist/a.dist,a.dist/o.dist)>1.8}return mh[i]}var aa=null,av=0;function oE(){let n=Ke.position.clone().sub(yt.target);return{target:yt.target.clone(),dir:n.clone().normalize(),dist:n.length(),fov:Ke.fov,anchor:u0.slice()}}var u0=[.5,.5];function lv(n,e){let t=innerWidth,i=innerHeight;if(u0=e,Ke.fov=n,Ke.setViewOffset(t,i,(.5-e[0])*t,(.5-e[1])*i,t,i),Ke.updateProjectionMatrix(),oi){let s=oi.ssaoMaterial.uniforms;s.cameraProjectionMatrix.value.copy(Ke.projectionMatrix),s.cameraInverseProjectionMatrix.value.copy(Ke.projectionMatrixInverse)}}function Jf(){aa=oE(),av=performance.now(),_r()}function d0(){if(Nt)return;let n=sE(rt);if(aa){let t=rv((performance.now()-av)/(Fn?600:1400));n=ov(aa,n,t),t>=1&&(aa=null)}if(na>0){let t=pt(na);n.dir.applyAxisAngle(Ei,t*1.6*ms*Math.sin(lp*.42)),n.dir.y+=t*.012*Math.sin(lp*.31+1),n.dir.normalize()}n.dist*=Go;let e=+If.toFixed(3);e!==Dg&&(T("dip").style.opacity=e,Dg=e),lv(n.fov,n.anchor),yt.target.copy(n.target),Ke.position.copy(n.target).addScaledVector(n.dir,n.dist),Ke.lookAt(n.target),Ke.updateMatrixWorld()}var ye={terminator:"#ff9a88",rut:"#ffcf7a",ribosome:"#e3d6b8",rnap:"#74bcb2",sigma:"#f094ae",template:"#72cdeb",coding:"#e9e1cf",rna:"#ffa45e",rho:"#9d7cc0",nusA:"#b9d56b",nusG:"#c08a4c",mg:"#c8ffd8",ppi:"#f2c46d",promoter:"#f0a0b4",start:"#dcefff",part:"#cfe3ea",alpha:"#d6c496",beta:"#56c2b1",betaPrime:"#7fa3e3",omega:"#c2bdb2"},p_={alphaI:"C",alphaII:"D",beta:"A",betaPrime:"B",omega:"E"},ug={C:[0,2.5],D:[0,2.5],A:[2.5,5],B:[5,8],E:[5.5,8]},aE={C:12166266,D:12166266,A:3120783,B:4879544,E:10986394},lE=new Ee;function f0(n=1){let e=rt,t=e.time,i=Gt,s=Gn===Lf?null:new Set(Hv(performance.now())),r=(_,S,R,P,b=2)=>Gn.label(_,S,R,{color:P,priority:b+(s?.has(Rh("L:"+S))?.5:0),inside:P!==ye.rnap&&_.distanceTo(Gt)>2&&_.distanceTo(Gt)<55&&Rl<.5&&!e.release}),o=(_,S,R=ye.part)=>Gn.tag(_,S,{color:R}),a=(_,S,R)=>Gn.bracket(_,S,R),c=()=>hn.position.clone().add(N(...sa.userData.center)),h=()=>Vt(Math.max(0,e.ntCount-1)),l=ze.clone().multiplyScalar(e.distance),d=_=>$t(yn,qt,_,N()).add(l),u=()=>ua.position.clone().add(N(...dr.userData.center)),f=()=>yr.position.clone().add(N(...ai.userData.center)),x=_=>bl[_].marker.position,y=()=>{let[_]=pp(e)||[Lo],[S,R]=Vr(_,e.ntCount);return Vt(S+_.pairs-1).add(Vt(R-_.pairs+1)).multiplyScalar(.5)},m=()=>{let _=e.fragment;return d((_.offsets[0]+_.offsets.at(-1))/2+_.shift)},p=_=>Gt.clone().add(N(...Y_[_].centroid)).add(p_[_]?o0[p_[_]].position:N()),w=()=>ht(0,-4,e,N()).add(ht(1,-4,e,N())).multiplyScalar(.5),v=_=>{if(!as("sigma")||e.sigmaBound<.5||!hn.visible)return;let S=dh.meshes.find(R=>R.group==="sigma").anchors;o(hn.position.clone().add(N(...S.sigma2)),`\u03C3 region 2 \xB7 ${_}`,ye.sigma),o(hn.position.clone().add(N(...S.sigma4)),e.grip>.9?"\u03C3 region 4 \xB7 binds \u221235":"\u03C3 region 4",ye.sigma)},g=()=>{Rl>.5||Nt?(o(d(13),"Secondary channel \xB7 NTPs enter"),fs(8,e.grip,e),o(vn.clone(),"Main channel \xB7 DNA"),e.ntCount>1&&o(p("rudder"),"Rudder"),e.ntCount>=16&&o(Vt(e.register-14),"RNA exit channel"),e.open>.5&&o(ht(0,1,e,N()),"Template turns \u224890\xB0"),as("site")&&(o(Gt,"Active-site Mg\xB2\u207A",ye.mg),o(p("bridgeHelix"),"Bridge helix"))):as("parts")&&(o(p("beta"),"\u03B2",ye.beta),o(p("betaPrime"),"\u03B2\u2032",ye.betaPrime),o(p("omega"),"\u03C9",ye.omega),o(p("alphaI").lerp(p("alphaII"),.5),"\u03B1\u2082",ye.alpha))};if(Gn.begin(),t<9)r(i.clone().add(N(-30,20,-30)),"Core RNA polymerase","\u03B1\u2082\u03B2\u03B2\u2032\u03C9",ye.rnap,3),r(c(),"Free sigma factor","\u03C370",ye.sigma,2),o(p("alphaI").lerp(p("alphaII"),.5),"\u03B1\u2082 \xB7 assembly scaffold",ye.alpha),t>2.5&&o(p("beta"),"\u03B2 \xB7 catalytic",ye.beta),t>5&&o(p("betaPrime"),"\u03B2\u2032 \xB7 catalytic",ye.betaPrime),t>5.5&&o(p("omega"),"\u03C9 \xB7 small, not essential",ye.omega);else if(t<Je.land[0])r(c(),"\u03C370 \xB7 promoter specificity","Compared with core: ~1000\xD7 weaker binding to random DNA, ~1000\xD7 tighter to promoters",ye.sigma,3);else if(t<44){let _=ol(t),S=t>=Je.wait[0]&&t<Je.approach[0];if(_&&!S){let[R,P]=t<Je.land[1]?["Non-specific binding","RNAP can bind DNA anywhere"]:t<Je.slide[1]?["Sliding","One-dimensional diffusion along DNA"]:t<Je.hop[1]?["Hopping","Brief release and rebinding nearby"]:t<Je.transfer[1]?["Intersegment transfer","Hand-over where two DNA segments pass close"]:t<Je.found?["Sliding","Along the promoter DNA"]:["Promoter found","RNAP settles on \u221235 and \u221210"];Gn.label(i,R,P,{color:ye.rnap,priority:3}),_.segment<.6&&t<Je.transfer[1]&&o(ta(_.x-150,N()),"Another stretch of the same DNA",ye.part)}if(S)r(x(0),`\u221235 element \xB7 ${Kc(-35,-30)}`,"About 35 bp upstream of the start",ye.promoter,3),r(x(1),`\u221210 element \xB7 ${Kc(-12,-7)}`,"About 10 bp upstream of the start",ye.promoter,3),r(x(2),"+1 start site","The first base pair transcribed",ye.start,3),a(x(0).clone().add(N(0,17,0)),x(2).clone().add(N(0,17,0)),"Promoter");else if(t>=Je.approach[0]&&t<rs.chapter){let R=e.grip>.9,P=b=>R?as("sigma")?`Read by \u03C3 region ${b}`:"Recognised by \u03C3":"Promoter element";r(x(0),`\u221235 element \xB7 ${Kc(-35,-30)}`,P(4),ye.promoter,3),r(x(1),`\u221210 element \xB7 ${Kc(-12,-7)}`,P(2),ye.promoter,3),o(x(2),"+1 start site",ye.start),t>=36&&t<rs.chapter-.3&&a(x(0),x(1),"17-bp spacer")}else t>=rs.chapter&&(fs(-4,e.grip,e),r(vn.clone(),"A sharp bend","RNAP pulls the DNA into its cleft",ye.part,3),t>=rs.strain&&r(x(1),"The \u221210 element unwinds","The bent, strained helix starts to melt here",ye.promoter,3),o(x(2),"+1 start site",ye.start));t>=34&&v("binds \u221210")}else if(t<72)t<56&&r(w(),"Transcription bubble",t<47?"The DNA opens around the start site":"12\u201314 bp of DNA held apart",ye.template,3),t>=47&&t<56&&(r(ht(0,-7,e,N()),"Template strand","Read 3\u2032 \u2192 5\u2032 \xB7 pairs with the RNA",ye.template,3),r(ht(1,-2,e,N()),"Coding (non-template) strand","Same sequence as the RNA, with T for U",ye.coding,2)),e.fragment?r(m(),"Short RNA released","RNAP keeps its promoter contacts",ye.rna,3):e.ntCount>=1?r(h(),"Short RNA","New RNA grows 5\u2032 \u2192 3\u2032",ye.rna,3):t<56&&r(ht(0,0,e,N()),"+1 start site","The first RNA nucleotide will pair here",ye.start,2),as("extra")&&t>=58&&t<70&&e.scrunch>1.5&&r(ht(0,8,e,N()),"DNA scrunching","Downstream DNA pulled in; RNAP stays on the promoter",ye.template,1),v("holds \u221210 open"),t>=47&&t<52&&g();else if(t<78)r(i,t<76?"Promoter escape":"Promoter clearance",t<76?"The transcript lengthens":`${e.displayNt} nt \xB7 escape at \u224810\u201312 nt`,ye.rnap,3);else if(t<It.factors)t<80&&r(i,"Promoter clearance",`${e.displayNt} nt \xB7 escape at \u224810\u201312 nt`,ye.rnap,2),as("sigma")&&t>=78&&t<81&&o(x(0),"\u03C34 lets go of \u221235",ye.sigma),t>=78&&t<84&&o(c(),"Some complexes keep \u03C3",ye.sigma),r(c(),"\u03C370 released","Reusable \xB7 can bind another core enzyme",ye.sigma,3),t>=81.5&&r(u(),"NusA binds","Can compete with \u03C3 for the core",ye.nusA,3);else if(t<It.wide)r(u(),"NusA","By the RNA exit \xB7 enhances pausing",ye.nusA,3),t>=85.5&&r(f(),"NusG",t<It.nusG+.5?"Binds across the DNA channel":"Anti-pausing \xB7 fewer, shorter pauses",ye.nusG,3),r(i,t<It.nusG?"Frequent pauses":"Fewer, shorter pauses",`${e.displayNt} nt synthesised`,ye.rnap,2);else if(t<It.end){r(i,"RNAP moves downstream",`${e.displayNt} nt synthesised`,ye.rnap,3);let _=Il(t),S=()=>Vs.getWorldPosition(N());_&&_.fade>.3?(t<95.6?r(S(),"Ribosome binds the RNA","Translation starts while the RNA is still being made",ye.ribosome,3):_.j<Fo-1?r(S(),"Coupled ribosome","Follows RNAP; in cells both move \u224840\u201350 nt/s",ye.ribosome,3):t<Ui.split[0]?r(Vt(Fo+1),"UAA stop codon","Translation ends here",ye.ribosome,3):r(S(),"The ribosome splits","Its short peptide is released",ye.ribosome,3),as("extra")&&_.kow>.4&&(o(Xo.getWorldPosition(N()),"NusG KOW \u2194 ribosome (uS10)",ye.nusG),o(f(),"NusG NGN stays on RNAP",ye.nusG)),_.peptide>.2&&_.split<.5&&o(Zr.points[Math.min(Zr.count-1,20)],"Nascent peptide","#b9d9a8")):r(Vt(0),"RNA 5\u2032 end","Oldest part of the transcript",ye.rna,2),t<96&&r(ht(0,-60,e,N()),"Template strand","Read 3\u2032 \u2192 5\u2032",ye.template,1)}else if(t<ct.pause){let _=e.addition,S=_?_.f:1,R=_?_.cycle===Jt.cycle:t>=jt.start+jt.count*jt.cycle,P="#ff6f88";R?S<.47?(r(Tn.position,"Wrong nucleotide",`${Jt.wrong} opposite template ${Oo(Jt.j)} \xB7 U belongs here`,P,3),o(Tn.position,"\xD7",P)):S<.72?r(ur.position,"Misincorporation","Rare \xB7 the bond still forms",P,3):r(h(),"Mismatched 3\u2032 end","RNAP does not step forward",P,3):!_||S>=.72?(r(h(),"New 3\u2032 end","RNAP translocates 1 bp",ye.rna,3),r(ht(0,1,e,N()),"Next template-strand base","Moves into the active site",ye.template,2)):S<.47?(r(h(),"RNA 3\u2032\u2013OH","Growing end of the RNA",ye.rna,3),r(Tn.position,S<.1&&_.cycle===0?"NTP from the pool":"Incoming NTP","Pairs with the template base",ye.rna,3),as("site")&&_.cycle===0&&S>=.3&&r(Ko,"Trigger loop closes","Folds over the paired NTP","#f3e3c2",1)):S<.6?(r(ur.position,"Phosphodiester bond","3\u2032\u2013OH attacks the \u03B1 phosphate","#fff0c8",3),r(ht(0,1,e,N()),"Template base","Paired with the new nucleotide",ye.template,2)):(r(h(),"RNA 3\u2032 end","One nucleotide longer",ye.rna,3),r(Hi.position,"Pyrophosphate","\u03B2 and \u03B3 phosphates leave",ye.ppi,3),as("site")&&_&&_.cycle===0&&S<.72&&r(Ko,"Trigger loop opens","Lets RNAP step forward","#f3e3c2",1)),t>=108.5&&t<110?a(ht(1,-10,e,N()),ht(1,3,e,N()),"Transcription bubble \xB7 12\u201314 bp"):t>=110&&t<113.5?a(d(si),d(0),"RNA\u2013DNA hybrid \xB7 8\u20139 bp"):t>=113.5&&t<116.5&&a(Vt(e.ntCount-14),h(),"RNAP holds the last \u224814 nt"),t>=108.4&&t<111.5&&g()}else if(t<kt.start){let _="#ff6f88",S=ls.position.clone();t<ct.start?r(S,"RNAP stalls at the error","A mismatched 3\u2032 end is not extended",_,3):t<ct.end?(r(S,"RNAP slides back 1 bp","The mismatched end enters the secondary channel",_,3),r(ht(0,-4,e,N()),"Hybrid shifts upstream","One base pair, with the enzyme",ye.template,2)):t<ct.cleave?r(Gt,"The active site cuts the RNA",as("site")?"Same Mg\xB2\u207A centre, now hydrolysing":"The same active site, now cutting RNA",ye.mg,3):e.fragment&&t<ct.resume+.3?(r(m(),"Dinucleotide released","It carries the error away",_,3),r(h(),"Correct 3\u2032 end","Back in the active site",ye.rna,3)):r(h(),"Elongation resumes","Error corrected: proofreading",ye.rna,3)}else if(t<136){let _=t<kt.resume;r(u(),"NusA",e.pauseHairpin>.4?"Stabilises the hairpin \xB7 longer pause":"Bound beside the RNA exit",ye.nusA,3),e.pauseHairpin>.2&&r(y(),"Pause hairpin","Folds in the RNA exit channel",ye.rna,3),r(h(),_?"Paused RNAP":"RNAP resumes",_?"Held while the hairpin is folded":"The hairpin has unfolded",ye.rnap,2)}else if(e.recycling>.02)r(i.clone().add(N(-20,0,-20)),"Released core RNAP","Can bind \u03C370 for a new round",ye.rnap,3);else if(e.path==="rho")if(e.release>.05)r(Vt(Math.max(0,e.ntCount-60)),"Released RNA","Transcript separates from the complex",ye.rna,3);else{t<146?(r(Vt(Zc+30),"rut site","Exposed, C-rich RNA \xB7 Rho binds here",ye.rut,3),r(t<143?Os.position.clone():no,t<143?"Rho arrives":"Rho on the rut site","A ring of six subunits",ye.rho,3)):r(no,e.rhoEngage>.8?"Rho\u2013RNAP contact":"Rho on the RNA",`${Math.max(0,Math.floor(e.rhoIndex-Qm))} nt traversed`,ye.rho,3),r(i,e.paused?"Paused RNAP":"RNA polymerase",e.rhoEngage>.8?"RNA 3\u2032 end still in the active site":`${Math.max(0,e.displayNt-1-Math.floor(e.rhoIndex))} nt ahead`,ye.rnap,3),t>=180&&r(f(),"NusG","Bridges Rho and RNAP",ye.nusG,2);let _=ii.rho;t>=_.show[0]&&t<_.show[3]-.3&&r(r_("rho"),"Terminator","RNAP pauses in this stretch, where Rho catches up",ye.terminator,3)}else t<ii.intrinsic.show[3]?r(r_("intrinsic"),"Terminator","A GC-rich inverted repeat, then a run of A on the template",ye.terminator,3):(r(Vt(e.ntCount-30).add(Vt(e.ntCount-8)).multiplyScalar(.5),e.hairpin>.3?"GC-rich RNA hairpin":"GC-rich inverted repeat",e.hairpin>.3?"Nine paired positions in the stem":"Transcribed just before the U tract",ye.rna,3),e.ntCount>=388&&r(Vt(e.ntCount-4),"U-rich tract",`${Gy(ss.intrinsic-7,ss.intrinsic-1,"intrinsic")} over template A \xB7 weak rU\xB7dA pairs`,ye.rna,2),t<154&&ua.visible&&r(u(),"NusA","Promotes pausing at the hairpin",ye.nusA,2));return a0&&!(t>=47&&t<52)&&!(t>=108.4&&t<111.5)&&g(),Gn.end(Ke,innerWidth,innerHeight,n,zt?_s:1,qr&&!an)}var ah="",Lg=null;function m_(){let n=ah==="flipped",e=(t,i)=>n?`${i} \u2026 ${t}`:`${t} \u2026 ${i}`;for(let[t,i,s]of[["coding","5\u2032","3\u2032"],["template","3\u2032","5\u2032"],["rna","5\u2032","3\u2032"]]){let[r,o]=document.querySelectorAll(`#strand-key .${t} b`);r.textContent=n?s:i,o.textContent=n?i:s}T("strand-key").setAttribute("aria-label",`Strand ends, left to right on screen: coding strand ${e("5\u2032","3\u2032")}, template strand ${e("3\u2032","5\u2032")}${Lg?`, RNA ${e("5\u2032","3\u2032")}`:""}`)}function cv(){let n=T("compass"),e=rt;if(e.time<Je.land[0]){ah!=="off"&&(n.hidden=!0,ah="off",Yt());return}let t=Gt.clone().project(Ke),i=Gt.clone().addScaledVector(ze,60).project(Ke),s=Math.atan2(-(i.y-t.y)*innerHeight,(i.x-t.x)*innerWidth)*180/Math.PI,r=Math.abs(s)>90,o=r?"flipped":"ok";o!==ah&&(n.hidden=!1,n.classList.toggle("flipped",r),T("compass-text").textContent=r?innerWidth<=600?"Seen from behind":"Viewing from the other side":"Upstream \xB7 Downstream",T("textbook-view").hidden=!r,ah=o,m_(),Yt());let a=e.ntCount>=1;a!==Lg&&(Lg=a,T("strand-key-rna").hidden=!a,m_(),Yt()),T("compass-arrow").style.transform=`rotate(${(r?s-180:s).toFixed(1)}deg)`}function Yt(){requestAnimationFrame(()=>{if(!Gn)return;let n=document.querySelector(".narration"),e=T("progress-view");n&&document.body.style.setProperty("--narr",`${Math.ceil(n.offsetHeight)}px`),document.body.style.setProperty("--card",`${e.hidden?0:Math.ceil(e.offsetHeight)}px`),Gn.layout([".brand",".chapter-title",".top-controls","#chapters",".narration","#progress-view",".legend",".path-control",".transport",".scene-meta","#compass","#settings","#act-card","#inspector","#description","#next-chip","#key-button","#chapter-name","#checkpoint","#end-card","#glossary"].map(t=>document.querySelector(t)).filter(t=>t&&!t.hidden&&t.getClientRects().length).map(t=>{let i=t.getBoundingClientRect();return{x:i.left,y:i.top,w:i.width,h:i.height}}).filter(t=>t.w>0&&t.h>0)),_r()})}function Ri(n){return`${Math.floor(n/60)}:${String(Math.floor(n%60)).padStart(2,"0")}`}var hv={start:136,nav:"Termination pathways",topic:"Termination pathways",title:"Two ways<br>to end transcription.",copy:"Choose the ATP-dependent Rho pathway or the RNA hairpin pathway.",notes:"transcription-termination"},Qf=n=>!_n&&n?.copyUncoupled?{...n,copy:n.copyUncoupled}:n,p0=n=>n.replace(/<br>/g," ").replace(/<[^>]+>/g,"").replace(/\s+/g," ").trim(),Mr=()=>re?vg:[...vg.slice(0,jd.length),hv],mp=()=>!re&&Ae>=136?jd.length:rt.chapter,bs=()=>Mr()[mp()],uv=()=>re?Ri(Cn(re)):"2:16 + ending",gh="",la=-1,g_=-1,x_=-1,ep="",lh="rho";function m0(){vg=ir(re||"rho");let n=Mr(),e=n.length,t=re||"rho",i=re?Cn(re):136,s="",r=!1;n.forEach((o,a)=>{let c=al.findIndex(h=>ef(h,t)===o.start);if(c>=0){r&&(s+="</div>");let h=al[c],l=h.numeral==="Prologue"||h.numeral==="Coda"?h.numeral:`Act ${h.numeral}`;s+=`<div class="act" role="group" aria-label="${l}: ${h.title}"><button class="act-head" data-time="${o.start}" aria-label="${l}: ${h.title}, go to its start"><span>${h.numeral}</span> ${h.title}</button>`,r=!0}s+=`<button class="ch" data-time="${o.start}" aria-label="Chapter ${a+1} of ${e}: ${o.nav}"><span aria-hidden="true">${String(a+1).padStart(2,"0")}</span><b aria-hidden="true">${o.nav}</b></button>`}),T("chapters").innerHTML=s+(r?"</div>":""),T("chapters").querySelectorAll("button").forEach(o=>o.onclick=()=>ro(Number(o.dataset.time))),T("chapter-select").innerHTML=n.map((o,a)=>`<option value="${o.start}">${String(a+1).padStart(2,"0")} \xB7 ${o.nav}</option>`).join(""),T("time").max=i,T("duration").textContent=uv(),T("ticks").innerHTML=n.map((o,a)=>{let c=o.start/i*100,h=(n[a+1]?.start??i)/i*100;return`<b style="left:${c.toFixed(2)}%;width:${(h-c).toFixed(2)}%"></b>${a?`<i style="left:${c.toFixed(2)}%"></i>`:""}`}).join(""),gp(),E0(),_l=-1,la=-1,gh=""}function gp(){let n=re||lh,e=Uo(n,_n),t=ir(n),i=(o,a)=>`<li><button class="line" data-i="${a}" data-t="${o[0]}"><time>${Ri(o[0])}</time><span><b>${o[1]}.</b> ${o[2]}</span></button></li>`,s="";t.forEach((o,a)=>{let c=t[a+1]?.start??Cn(n);!re&&o.start===136&&(s+=`<div class="tabs" role="group" aria-label="Ending to describe">${["rho","intrinsic"].map(l=>`<button data-route="${l}" aria-pressed="${l===n}">${l==="rho"?"Rho-dependent":"Intrinsic"}</button>`).join("")}</div>`);let h=e.map((l,d)=>[l,d]).filter(([l])=>l[0]>=o.start&&l[0]<c);s+=`<h3>${String(a+1).padStart(2,"0")} \xB7 ${o.nav}</h3><ol>${h.map(([l,d])=>i(l,d)).join("")}</ol>`});let r=T("description-body");r.innerHTML=s,r.querySelectorAll(".line").forEach(o=>o.onclick=()=>{vs&&(gt(!1),!re&&Number(o.dataset.t)>=136&&ys(lh),gs(Number(o.dataset.t)))}),r.querySelectorAll(".tabs [data-route]").forEach(o=>o.onclick=()=>{lh=o.dataset.route,gp(),r.querySelector(`.tabs [data-route="${lh}"]`)?.focus({preventScroll:!0})}),la=-1}function g0(){let n=rt,e=mp(),t=bs(),i=Mr().length,s=re||"rho";if(e!==_l){T("beat-number").textContent=String(e+1).padStart(2,"0"),T("beat-topic").textContent=t.topic,T("beat-title").innerHTML=t.title.split("<br>").map(m=>`<span class="l">${m}</span>`).join(" ");let y=[...T("chapters").querySelectorAll("button.ch")];T("chapter-select").value=String(Mr()[e].start),T("chapter-name").textContent=t.nav,y.forEach((m,p)=>p===e?m.setAttribute("aria-current","step"):m.removeAttribute("aria-current")),y[e]?.scrollIntoView({block:"nearest",inline:"nearest"}),T("chapters").querySelectorAll(".act").forEach(m=>m.classList.toggle("current",!!y[e]&&m.contains(y[e]))),_l>=0&&(jr=1,li(!zt||_s<=2?`Chapter ${e+1} of ${i}. ${p0(t.title)} ${Jd(Qf(t),Ae)}`:`Chapter ${e+1}: ${t.nav}`),Wi&&zt&&wv()),_l=e,gh="",Yt(),Cv()}let r=Jd(Qf(t),Ae);r!==gh&&(AE(T("beat-copy"),r),gh=r),T("time").value=Ae,T("clock").textContent=Ri(Ae),T("rna-count").textContent=n.displayNt;let o=Math.floor(Ae);o!==g_&&(g_=o,T("time").setAttribute("aria-valuetext",`${Ri(Ae)} of ${uv()}. Chapter ${e+1} of ${i}: ${t.nav}`));let a=n.time<Je.land[0];T("progress-view").hidden!==a&&(T("progress-view").hidden=a,Yt()),a||($g(vE(n)),qg==="dna"&&Pv(n));let c=n.time<It.factors;if(c!==e_&&(e_=c,T("initiation-view").hidden=!c,T("transcript-map").style.display=c?"none":"",T("card-heading").textContent=c?"Initiation":"Transcript"),c){T("init-bar").setAttribute("width",(404*Math.min(20,n.ntCount)/20).toFixed(1));let y=Hn.lengths.map((p,w)=>n.time>=Hn.start+Hn.round*(w+.64)?`<s>${p}</s>`:n.time>=Hn.start+Hn.round*w?`<b>${p}</b>`:`${p}`).join(" \xB7 "),m=`Abortive RNAs: ${y} nt`;m!==t_&&(T("abortive-tally").innerHTML=m,t_=m)}else{let y=Math.floor(n.displayNt/10),m=!!Il(n.time),p=`${y}${m?"r":""}${n.rhoVisible?"h":""}`;p!==x_&&(x_=p,T("transcript-map").setAttribute("aria-label",`Transcript map: about ${y*10} nucleotides, 5\u2032 end at left, RNA polymerase at the 3\u2032 end${n.rhoVisible?", Rho on the RNA":""}${m?", a ribosome translating behind RNAP":""}`))}let h=!!re&&n.rhoVisible;for(let[y,m]of[["sigma",hn.visible],["rho",h],["nusA",ua.visible],["nusG",yr.visible]]){let p=X_[y];p&&p.classList.contains("dim")===m&&p.classList.toggle("dim",!m)}{let y=Il(n.time),m=!!y&&y.fade>.2;T("map-rib").style.display=m?"block":"none",m&&T("map-rib").setAttribute("transform",`translate(${(18+404*ft(y.j/Math.max(1,n.ntCount-1))).toFixed(1)} 0)`);let p=_n&&n.ntCount>Fo+3&&n.time<108;T("map-stop").style.display=p?"block":"none",p&&T("map-stop").setAttribute("transform",`translate(${(18+404*ft(Fo/Math.max(1,n.ntCount-1))).toFixed(1)} 0)`)}T("map-error").style.display=n.error>.05?"block":"none",n.error>.05&&T("map-error").setAttribute("transform",`translate(${(18+404*ft(Jt.j/Math.max(1,n.ntCount-1))).toFixed(1)} 0)`),T("map-rho").style.display=h?"block":"none",T("map-rho").setAttribute("cx",18+404*ft(n.rhoIndex/Math.max(1,n.ntCount-1))),T("map-hairpin").style.display=n.path==="intrinsic"&&n.hairpin>.1?"block":"none",T("rho-distance").textContent=h?`${Math.floor(n.rhoIndex)+1} / ${n.displayNt} nt`:"",T("map-caption").textContent=n.recycling>.02?`At 40\u201350 nt/s, RNAP makes this ${ss[n.path]}-nt transcript in about ${Math.round(ss[n.path]/50)}\u2013${Math.round(ss[n.path]/40)} s.`:n.release>.05?"The transcript separates from RNA polymerase.":n.rhoEngage>.8?"NusG bridges Rho and RNAP; the RNA 3\u2032 end is still inside the enzyme.":h&&n.time<146?"Rho loads on the exposed rut site, far behind RNAP.":h?"Rho advances from the older RNA towards its growing 3\u2032 end.":n.hairpin>.1?"The hairpin forms near the RNA 3\u2032 end, followed by a U-rich tract.":n.pauseHairpin>.1?"Paused: NusA stabilises an RNA hairpin in the exit channel.":n.time>=84&&n.time<88?"Without NusG, RNAP pauses more often.":n.time>=88&&n.time<92?"NusG has bound: fewer pauses, so a higher overall rate.":_n&&n.time>=93&&n.time<95.6?"A ribosome starts translating while the RNA is still being made.":_n&&n.time>=95.6&&n.time<Ui.split[0]?"Coupled: NusG links RNAP to the ribosome behind it.":_n&&n.time>=Ui.split[0]&&n.time<Ui.gone[1]?"The ribosome reached UAA; it releases its peptide and splits.":n.time>=Hn.start&&n.time<It.factors?n.fragment?"An abortive RNA is released; RNAP stays on the promoter.":n.time>=71?n.ntCount>=10?"Long enough to clear the promoter (\u224810\u201312 nt).":"This RNA keeps growing towards promoter clearance.":"Short RNAs are often released: abortive initiation.":n.ntCount<1?"No RNA yet: RNAP first finds a promoter and opens the DNA.":"The transcript grows as RNAP moves away from the promoter.";let l=!re&&Ae>=136?-1:tf(Ae,s,_n);if(l!==la){let y=T("description-body");y.querySelector("[aria-current]")?.removeAttribute("aria-current");let m=l>=0&&(re||lh===s||Ae<136)?y.querySelector(`[data-i="${l}"]`):null;m&&(m.setAttribute("aria-current","true"),vv&&!T("description").hidden&&m.scrollIntoView({block:"nearest"})),la>=0&&l>=0&&bv&&zt&&_s<=1.5&&!T("description").hidden&&li(Uo(s,_n)[l][2],200),la=l}let d=0,u=null;for(let y of al){if(y.numeral==="III"&&!re)continue;let m=y.card??ef(y,s),p=zv(y),w=ne(Ae,m,m+.5)*(1-ne(Ae,p,p+.5));w>d&&(d=w,u=y)}let f=u&&d>.01?u.title:"";if(f!==ep){let y=T("act-card");y.hidden=!f,u&&(y.querySelector("span").textContent=u.numeral,y.querySelector("h2").textContent=u.title,y.querySelector("small").textContent=typeof u.sub=="string"?u.sub:u.sub[s]),ep=f,Yt()}f&&(T("act-card").style.opacity=d.toFixed(3)),T("compass").style.opacity=f?(1-d).toFixed(3):"",T("next-chip").textContent=uE();let x=!!re&&Ae>=Cn(re)-.05&&!zt;(x===T("end-card").hidden||x&&Uv!==re)&&ma(x)}function x0(){An.render()}function dv(n){return Math.min(devicePixelRatio,2,Math.sqrt(br[n].budget/Math.max(1,innerWidth*innerHeight)))}function fv(){let n=Et.getPixelRatio();T("quality-note").textContent=`${ri==="auto"?"Auto: ":""}${br[Gs].label} \xB7 ${Math.round(innerWidth*n)}\xD7${Math.round(innerHeight*n)} px${br[Gs].ao?" \xB7 ambient occlusion":""}`}function xp(n){br[n]||(n="balanced");let e=br[n],t=dv(n);Gs=n,Et.setPixelRatio(t),Et.setSize(innerWidth,innerHeight);let i=e.samples&&t>=1.75?Math.min(e.samples,2):e.samples;for(let s of[An.renderTarget1,An.renderTarget2])s.samples!==i&&(s.samples=i,s.dispose());An.setPixelRatio(t),An.setSize(innerWidth,innerHeight),cr.enabled=e.bloom,pl.enabled=!!e.fxaa,oi.enabled=Wf&&e.ao,document.body.classList.toggle("low-power",n==="low"),In.samples.length=0,In.skip=30,In.strikes=0,fv(),on()}function y_(){Ff=!0,Ke.aspect=innerWidth/innerHeight;let n=dv(Gs);Et.setPixelRatio(n),Et.setSize(innerWidth,innerHeight),An.setPixelRatio(n),An.setSize(innerWidth,innerHeight),lv(Ke.fov,u0),fv(),Yt(),on()}async function pv(){let n=[Ae,re,_l];xp("high"),re="rho",cn(60);let e=Et.getContext(),t=new Uint8Array(4),i=[];for(let r=0;r<10;r++){let o=performance.now();Pn(),e.readPixels(0,0,1,1,e.RGBA,e.UNSIGNED_BYTE,t),r>=2&&i.push(performance.now()-o),await new Promise(a=>setTimeout(a,0))}[Ae,re]=n,cn(Ae),_l=-2,i.sort((r,o)=>r-o);let s=i[i.length>>1];return s<16?"high":s<30?"balanced":"low"}function cE(){bh||!vs||Gs!=="low"||Et.getContext().isContextLost()||(oi.enabled=Wf,cr.enabled=!0,x0(),oi.enabled=!1,cr.enabled=!1)}function mv(){let n=new tl(Et),e=new Kd;Us.environment?.dispose(),Us.environment=n.fromScene(e,.04).texture,e.dispose(),n.dispose()}function cn(n){Mt=null,Bl=null,Dn=0,na=0,ap&&kl(!1);let e=Number(n);Ae=Number.isFinite(e)?Math.max(0,Math.min(Cn(re),e)):0,rt=os(Ae,re||"rho"),Ff=!0,on()}function Pn(){vs&&(Kf(),g0(),d0(),iv(),f0(1),cv(),x0(),$r=or=!1)}var hE=[.25,.5,1,1.5,2,5],dg=!1,jr=1,Go=1,Dl=!1,Ti=null,pr=null,xs=null,pa=!1,__=!1,Ug=!1,Wi=!1,Ll=!1,Ul=!1,Fg=null,gv=!1,ca=null,io=null,ch=null,xv=!1,yv=0,hh=!0,Th=!1,_v=!1,v_=0,Og="",Bg=0,vv=!0,bv=!1,Nf=null,fg=0,hs="auto";function gs(n){pr=null,Wi&&!zt&&speechSynthesis.cancel(),an&&Math.abs(n-an.t)>.01&&oo(!1),xs&&(n<xs[0]-1e-6||n>=xs[1])&&vp(!1,!0),!re&&n>=136?(io=Number.isFinite(n)&&n>136+.05?n:null,cn(136),yp()):(n<136&&(tp(),io=null),cn(n)),_p(),zt||(Ci(),y0())}function y0(){T("play-symbol").textContent=zt?"\u2161":"\u25B6",T("play-text").textContent=zt?"Pause":!re&&Ae>=136?"Choose ending":"Play the cycle"}function gt(n,{hold:e=!1}={}){if(!n&&ap&&kl(!1),n&&Ae>=Cn(re)-1e-6&&gs(0),n&&!re&&Ae>=136){yp();return}n&&Nt&&zs(!1,!1),n&&Ti!==null&&(pr=Ti,_p()),n&&an&&oo(!1),n&&ma(!1),zt=n,vh=performance.now(),In.skip=30,n?Wi&&speechSynthesis.paused&&speechSynthesis.resume():(Ul=!1,Wi&&!e&&speechSynthesis.pause(),Ci()),y0(),document.body.classList.toggle("playing",n),Cv(),on()}function yp(){zt=!1,document.body.classList.remove("playing"),Ae!==136&&cn(136);let n=T("path-choice");n.open||(PE(),n.showModal(),n.querySelector(Xi?"#choice-question button":"[data-path]").focus()),T("play-symbol").textContent="\u25B6",T("play-text").textContent="Choose ending"}function tp(){let n=T("path-choice");n.open&&n.close()}function ys(n,e=!1){if(n!=="rho"&&n!=="intrinsic"){yp();return}let t=re;re=n,gt(!1),Mv(),tp(),m0(),ma(!1),vp(!1,!0),an?.path&&oo(!1),io!==null?(Ae=Math.min(tg(io,"rho",re),Cn(re)-.1),io=null):Ae>=136&&t!==re&&(Ae=t?tg(Ae,t,re):136),e&&Ae>=Cn(re)-.05&&(Ae=136),cn(Math.min(Ae,Cn(re))),Ci(),e&&(gt(!0),T("play").focus())}function Mv(){T("path-more").value=re||"",document.querySelectorAll(".path-control [data-route]").forEach(n=>n.setAttribute("aria-pressed",String(n.dataset.route===re)))}function ro(n){gt(!1),zi=null,Nt&&zs(!1,!1),gs(n)}function kg(n){gt(!1),gs(Ae+n)}function Df(n){let e=Mr(),t=mp(),i=e[t],s=n>0?e[t+1]:Ae>i.start+1.5?i:e[t-1];s&&ro(s.start)}function zg(n){zt&&gt(!1);let e=re||"rho",t=Uo(e,_n).filter(s=>re||s[0]<136),i=n>0?t.find(s=>s[0]>Ae+.02):[...t].reverse().find(s=>s[0]<Ae-.02);i&&(gs(i[0]),On(`${i[1]} \xB7 ${i[2]}`,3600))}function uh(n){let e=[...c0,...h0[re||"rho"]].find(t=>Math.abs(t.start-n)<1e-6);return e?.blend?n-(Fn?Math.min(e.blend,1.2):e.blend)*(e.lead??.35):n-.05}var _0=n=>Mr().find(e=>e.start>n+1e-6)?.start??null;function Sv(n){Ti=n;let e=Mr().find(i=>i.start===n),t=T("continue");t.textContent=`Continue: ${e?.nav??"next"} \u25B8`,t.hidden=!1,(document.activeElement===document.body||document.activeElement===T("play"))&&t.focus({preventScroll:!0}),Yt()}function _p(){Ti===null&&T("continue").hidden||(Ti=null,T("continue").hidden=!0,Yt())}function wl(){Ti!==null&&(pr=Ti,_p()),Vv(),gt(!0)}function uE(){let n=Ti??_0(Ae),e=Mr().find(t=>t.start===n);return e?`Next \xB7 ${e.nav} \u25B8`:""}function np(n,e=!1){Dl=n,T("hold").checked=n,e&&On(n?"Holding at the end of each chapter (H).":"Playing straight through chapters (H).",2200),n||_p()}function vp(n,e=!1){let t=!!xs;if(xs=null,n){let i=Mr(),s=mp(),r=[i[s].start,i[s+1]?.start??(re?Cn(re):136)];r[1]-r[0]<1?(e||On("Choose an ending first; this point cannot loop.",2400),n=!1):xs=r}T("loop").setAttribute("aria-pressed",String(n)),(!e||t!==n)&&(e||On(n?`Looping \u201C${bs().nav}\u201D.`:"Chapter loop off.",2e3))}function zs(n,e=!0){if(n!==Nt){if(Nt=n,yt.enabled=n,yt.enableZoom=n,yt.enableDamping=!Fn,document.body.classList.toggle("exploring",n),T("explore").textContent=n?"Resume guided camera":"Explore in 3D",n)dg=zt,zt&&gt(!1),T("dip").style.opacity=0,Dg=0;else{Jf();let t=e&&dg;dg=!1,t&&gt(!0),Ci()}Yt(),on(),li(n?"Explore: drag or use arrow keys in the 3D view; Escape returns to the guided camera.":"Guided camera.",0)}}function dE(n){let e=fE.subVectors(Ke.position,yt.target).multiplyScalar(n),t=e.length();e.setLength(Math.min(yt.maxDistance,Math.max(yt.minDistance,t))),Ke.position.copy(yt.target).add(e),yt.update(),_r()}var fE=N();function ip(n,e=!1){Fn=n,e&&(hs=n?"reduced":"full",Ln.set("motion",hs),On(n?"Reduced motion on (M).":"Full motion (M).",2e3)),document.body.classList.toggle("calm",n),yt.enableDamping=!n,T("motion").value=hs,on()}function bp(n){n!==pa&&(pa=n,document.body.classList.toggle("presenting",n),n?(__=Dl,np(!0),Hg()):(np(__),document.body.classList.remove("idle"),clearTimeout(Bg)),T("present").textContent=n?"Leave presenter mode":"Presenter mode",T("next-chip").hidden=!n,Gn.resetSizes(),Yt(),Ci(),On(n?"Presenter mode: holds at chapter ends \xB7 \u2192 continues \xB7 B blacks out \xB7 Esc leaves.":"Presenter mode off.",3200))}function Hg(){pa&&(document.body.classList.remove("idle"),clearTimeout(Bg),Bg=setTimeout(()=>document.body.classList.add("idle"),2500))}function v0(n=!Ug){Ug=n,T("blackout").hidden=!n,n&&gt(!1)}var pE=[[/σ70/g,"sigma seventy"],[/σ/g,"sigma"],[/β′/g,"beta prime"],[/β/g,"beta"],[/α₂/g,"alpha two"],[/α/g,"alpha"],[/γ/g,"gamma"],[/ω/g,"omega"],[/−35/g,"minus thirty-five"],[/−10/g,"minus ten"],[/3′/g,"three prime"],[/5′/g,"five prime"],[/ → /g," to "],[/NTPs/g,"N T Ps"],[/NTP/g,"N T P"],[/rU·dA/g,"r U, d A"],[/Mg²⁺/g,"magnesium"],[/≈/g,"about "],[/(\d)–(\d)/g,"$1 to $2"],[/RNAP/g,"R N A P"],[/Nus([AG])/g,"Nus $1"],[/PPi/g,"pyrophosphate"],[/(\d) nt\b/g,"$1 nucleotides"],[/1000-fold/g,"a thousand-fold"]],mE=n=>pE.reduce((e,[t,i])=>e.replace(t,i),n);function b_(){if(!("speechSynthesis"in window))return;let n=speechSynthesis.getVoices().filter(e=>e.localService&&/^en/i.test(e.lang));ca=n.find(e=>/en-GB/i.test(e.lang))||n[0]||null,T("narrate-row").hidden=!ca,!ca&&Wi&&b0(!1)}function b0(n,e=!1){n&&!ca&&(On("No offline voice is available in this browser.",2600),n=!1),Wi=n,T("narrate").checked=n,n?wv():("speechSynthesis"in window&&speechSynthesis.cancel(),Ll=Ul=!1),e&&On(n?"Reading chapters aloud (V).":"Read-aloud off (V).",2e3)}function wv(){if(!Wi||!ca)return;speechSynthesis.cancel();let n=bs(),e=new SpeechSynthesisUtterance(mE(`${p0(n.title)} ${Fy(Qf(n))}`));e.voice=ca,e.lang=ca.lang,e.onend=e.onerror=()=>{Ll=!1,Ul&&(Ul=!1,gv&&zt?(gt(!1,{hold:!0}),Sv(Fg)):pr=Fg),on()},Ll=!0,speechSynthesis.speak(e)}function li(n,e=700){clearTimeout(v_),v_=setTimeout(()=>{if(n===Og)return;Og=n;let t=T("announcer");t.textContent="",requestAnimationFrame(()=>t.textContent=n)},e)}function gE(){let n=bs(),e=!re&&Ae>=136?null:Uo(re||"rho",_n)[tf(Ae,re||"rho",_n)];Og="",li(`${Ri(Ae)}. ${n.nav}${e?`, ${e[1]}`:""}. Transcript ${rt.displayNt} nucleotides. ${T("scene-now").textContent}`,0)}function Av(n,e){for(let t of document.body.children)t.id===e||t.tagName==="SCRIPT"||t.tagName==="DIALOG"||(n?t.setAttribute("inert",""):t.removeAttribute("inert"))}function Fl(n){gt(!1),Ih();let e=T("notes-frame"),t=()=>{let i=e.contentDocument;i?.fonts.ready.then(()=>{n&&i.getElementById(n)?.scrollIntoView({behavior:"instant",block:"start"})})};e.dataset.loaded?t():(e.onload=()=>{e.dataset.loaded="1";try{e.contentDocument.addEventListener("keydown",i=>{i.key==="Escape"&&Ph()})}catch{}t()},e.src="notes.html"),T("notes-panel").hidden&&(Nf=document.activeElement),T("notes-panel").hidden=!1,document.body.classList.add("reading"),Av(!0,"notes-panel"),T("notes-close").focus()}function Ph(){T("notes-panel").hidden||(T("notes-panel").hidden=!0,document.body.classList.remove("reading"),Av(!1),(Nf?.isConnected&&Nf!==document.body?Nf:T("read-notes")).focus(),on())}function Vg(n=T("description").hidden){n?(Ph(),T("description").hidden=!1,document.body.classList.add("describing"),la=-1,g0(),(T("description-body").querySelector("[aria-current]")||T("description-close")).focus()):Ih(),Yt()}function Ih(){T("description").hidden||(T("description").hidden=!0,document.body.classList.remove("describing"),Yt(),T("describe").focus({preventScroll:!0}))}function Ds(n=T("settings").hidden){T("settings").hidden=!n,T("more").setAttribute("aria-expanded",String(n)),n?T("settings").querySelector("select,button,input")?.focus():T("settings").contains(document.activeElement)&&T("more").focus(),Yt()}function Gg(){gt(!1),T("shortcuts").showModal()}function Tv(){if(!T("details-menu").hidden)return rp(!1);if(!T("notes-panel").hidden)return Ph();if(!T("settings").hidden)return Ds(!1);if(!T("glossary").hidden)return A0();if(!T("description").hidden)return Ih();if(Ol)return N0();if(an)return oo(!1);if(Ug)return v0(!1);if(pa)return bp(!1);Nt&&zs(!1)}var xE=()=>[...Ke.position.toArray(),...yt.target.toArray()].map(n=>n.toFixed(1)).join(",");function Ev(n){let e=new URLSearchParams(location.search);e.set("t",Ae.toFixed(1)),re?e.set("path",re):e.delete("path");for(let t of["chapter","autoplay","cam"])e.delete(t);return qr?e.delete("labels"):e.set("labels","0"),e.delete("parts"),gr.size?e.set("details",[...gr].join(",")):e.delete("details"),zi===!0?e.set("cut","1"):e.delete("cut"),_s!==1?e.set("speed",_s):e.delete("speed"),pa?e.set("present","1"):e.delete("present"),Xi?e.set("predict","1"):e.delete("predict"),hp?e.set("sequence","1"):e.delete("sequence"),_n?e.set("ribosome","1"):e.has("ribosome")||Ln.get("ribosome")==="1"?e.set("ribosome","0"):e.delete("ribosome"),Qg==="normal"?e.delete("read"):e.set("read",Qg),n&&Nt&&e.set("cam",xE()),e}function Ci(){if(!(!vs||Th||zt||sp))try{history.replaceState(null,"","?"+Ev(Nt).toString())}catch{}}async function Rv(){let n=`${location.origin}${location.pathname}?${Ev(_v)}`,e=`Link to ${Ri(Ae)} \xB7 ${bs().nav}`;try{if(!isSecureContext||!navigator.clipboard)throw 0;await navigator.clipboard.writeText(n),On(`${e} copied.`)}catch{let i=T("toast");i.innerHTML="",i.append(`${e}: `);let s=document.createElement("input");s.value=n,s.readOnly=!0,s.className="link-field",s.setAttribute("aria-label","Link to copy"),i.append(s),i.hidden=!1,s.focus(),s.select(),clearTimeout(Xf),Xf=setTimeout(()=>i.hidden=!0,8e3)}}function Cv(){window.parent!==window&&window.parent.postMessage({kind:"transcription-3d-state",t:+Ae.toFixed(2),chapter:Qd(bs().nav),playing:zt},"*")}var sp=!1;function yE(n){sp=!0,Th=n.get("embed")==="1",document.body.classList.toggle("embed",Th),n.get("labels")==="0"&&(qr=!1,T("labels").setAttribute("aria-pressed","false")),n.get("parts")==="1"&&Yg(cp.map(o=>o[0])),n.has("details")&&Yg(n.get("details").split(","));let e=Number(n.get("speed"));hE.includes(e)&&(_s=e,T("speed").value=String(e));let t=n.get("path");t!=="rho"&&t!=="intrinsic"&&(t=null);let i=Number(n.get("t"))||0,s=n.get("chapter");if(s){let o=c=>ir(c).find(h=>Qd(h.nav)===s),a=o(t||"rho")||!t&&o("intrinsic");a&&(i=a.start,!t&&i>=136&&(t=ir("rho").includes(a)?"rho":"intrinsic"))}ch=Number(n.get("end"))||null,xv=n.get("loop")==="1",yv=i,t&&ys(t),gs(i),n.get("cut")==="1"&&(zi=!0,t0=rt.chapter);let r=(n.get("cam")||"").split(",").map(Number);return r.length===6&&r.every(Number.isFinite)&&(Ig.copy(l0(rt)),Ng=!0,zs(!0),Ke.position.set(r[0],r[1],r[2]),yt.target.set(r[3],r[4],r[5]),yt.update()),n.get("present")==="1"&&bp(!0),n.get("predict")==="1"&&T0(!0),n.get("sequence")==="1"&&S0(!0),n.has("ribosome")&&Nh(n.get("ribosome")==="1"),n.has("read")&&D0(n.get("read")),sp=!1,["t","path","chapter","cam"].some(o=>n.has(o))&&Ci(),n.get("autoplay")==="1"}var rn={cols:23,cell:13.2,left:16,right:312,rows:{num:12,top:30,coding:52,template:76,rna:100,beyond:112,summary:140}},pn=null,Wg="",Xg=null,qg=null;function _E(){let n=T("dna-map"),e="http://www.w3.org/2000/svg",t=(d,u={},f=n)=>{let x=document.createElementNS(e,d);for(let[y,m]of Object.entries(u))x.setAttribute(y,m);return f.append(x),x},i=rn.rows,s=t("clipPath",{id:"map-clip"},t("defs"));t("rect",{x:rn.left,y:0,width:rn.right-rn.left,height:150},s);let r=t("g",{"clip-path":"url(#map-clip)"}),o=[t("rect",{class:"m-box",rx:3},r),t("rect",{class:"m-box",rx:3},r)],a=t("g",{},r),c=[];for(let d=0;d<rn.cols+2;d++){let u=t("g",{},a);c.push({g:u,num:t("text",{class:"m-num",y:i.num},u),c:t("text",{class:"m-base",y:i.coding},u),t:t("text",{class:"m-base",y:i.template},u),r:t("text",{class:"m-base m-rna",y:i.rna},u)})}for(let[d,u,f]of[["5\u2032",2,i.coding],["3\u2032",2,i.template],["3\u2032",rn.right+4,i.coding],["5\u2032",rn.right+4,i.template]])t("text",{class:"m-end",x:u,y:f}).textContent=d;let h=t("g",{class:"m-caret"},r);t("path",{d:`M0 ${i.coding-14}V${i.rna+8}`},h),t("circle",{cy:i.rna+10,r:2.6},h);let l=d=>t("path",{class:d},r);pn={cols:a,col:c,boxes:o,caret:h,bubble:l("m-bracket"),hybrid:l("m-bracket m-hybrid"),labels:[t("text",{class:"m-label"},r),t("text",{class:"m-label"},r),t("text",{class:"m-label m-start"},r)],summary:t("text",{class:"m-summary",x:rn.left,y:i.summary})}}var Xr=(n,e)=>{n.textContent!==e&&(n.textContent=e)};function Pv(n){pn||_E();let e=ol(n.time),t=!!e&&e.segment<.5,i=n.path||"rho",s=rn.rows,r=rn.cell,o=n.distance/3.4,a=Math.floor(o)-(n.time<It.factors?12:10),c=o-Math.floor(o),h=b=>rn.left+r/2+(b-c)*r,l=[Math.round(o*16),Math.round(n.register*16),Math.round(n.open*20),Math.round(n.ntCount*4),n.error>.5,i,Math.round(n.scrunch*8),n.backtracking,Math.round(n.time*2),us>.3].join("|");if(l===Wg)return;Wg=l;let d=[],u=[],f=n.time>=Je.wait[0]&&n.time<84&&!t,x=!1,y=!1;pn.col.forEach((b,M)=>{let C=a+M,U=C-n.register,V=fp(U,n)*pt((C-o-Un)/1.5)*pt((Si-U)/1.5),H=h(M)-r/2<rn.left-1||h(M)+r/2>rn.right+1,k=C>=Ai&&!H;b.g.setAttribute("transform",`translate(${h(M).toFixed(1)} 0)`);let z=nf(C).replace("-","\u2212"),ie=C>=0?C+1:C,$=f&&(C>=-35&&C<=-30||C>=-12&&C<=-7);Xr(b.num,ie%5===0&&!H&&!$?z:"");let te=Gr(t?C+6e4:C,i),F=Oo(t?C+6e4:C,i);t&&Xr(b.num,""),Xr(b.c,k||t&&!H?te:""),Xr(b.t,k||t&&!H?F:""),b.c.setAttribute("y",(s.coding-7*V).toFixed(1)),b.t.setAttribute("y",(s.template+7*V).toFixed(1)),V>.5&&d.push(M);let O=C,J=n.ntCount>=1&&O>=0&&O<=n.ntCount-1+1e-6,q=n.time>=ct.start&&n.time<ct.cleave+.4,le=zl(O-n.register,n),Se=O>n.register+(q?.5:1.5),Y=O===Jt.j&&n.error>.5?Jt.wrong:Bo(O,i);J&&!H&&!n.release&&(le>.25||Se||O>=n.register-10)?(Xr(b.r,Y),b.r.setAttribute("y",Se?s.beyond:s.rna),b.r.classList.toggle("m-error",O===Jt.j&&n.error>.5),b.r.classList.toggle("m-free",le<=.25&&!Se),b.r.classList.toggle("m-beyond",Se),le>.5&&O<=n.register+.5&&u.push(M),O>n.register+.5&&!Se&&(y=!0),Se&&(x=!0)):Xr(b.r,"");let j=he=>s0[he]||"";b.c.style.fill=j(te),b.t.style.fill=j(F),b.r.style.fill=b.r.classList.contains("m-error")?"":j(Y)});let m=(b,M,C)=>{if(M.length<2){b.style.display="none";return}let U=h(M[0])-r/2+1,V=h(M.at(-1))+r/2-1,H=C?s.top+6:s.rna+8;b.style.display="",b.setAttribute("d",C?`M${U.toFixed(1)} ${H+5}V${H}H${V.toFixed(1)}V${H+5}`:`M${U.toFixed(1)} ${H-5}V${H}H${V.toFixed(1)}V${H-5}`)};m(pn.bubble,d,!0),m(pn.hybrid,u,!1);let p=f,w=p&&d.length<2;[[-35,-30,"\u221235"],[-12,-7,"\u221210"]].forEach(([b,M,C],U)=>{let V=pn.boxes[U],H=h(b-a)-r/2,k=h(M-a)+r/2,z=p&&k>rn.left&&H<rn.right;V.style.display=z?"":"none",pn.labels[U].style.display=z&&w?"":"none",z&&(V.setAttribute("x",H.toFixed(1)),V.setAttribute("y",s.coding-13),V.setAttribute("width",(k-H).toFixed(1)),V.setAttribute("height",s.template-s.coding+18),pn.labels[U].setAttribute("x",Math.min(rn.right-34,Math.max(rn.left+34,(Math.max(H,rn.left)+Math.min(k,rn.right))/2)).toFixed(1)),pn.labels[U].setAttribute("y",s.top+4),Xr(pn.labels[U],C))});let v=h(0-a);pn.labels[2].style.display=w&&v>rn.left&&v<rn.right?"":"none",pn.labels[2].setAttribute("x",v.toFixed(1)),pn.labels[2].setAttribute("y",s.top+4),Xr(pn.labels[2],"+1");let g=n.time>=44&&n.open>.3&&!n.release;pn.caret.style.display=g?"":"none",g&&pn.caret.setAttribute("transform",`translate(${(h(n.register-a)+r/2).toFixed(1)} 0)`);let _=[],S=[];t?_.push("RNAP is on another DNA segment"):n.time>=Je.land[0]&&n.time<34&&_.push("RNAP is searching the promoter DNA"),g&&_.push("\u250A active site"),d.length>=2&&_.push(`bubble ${d.length} bp`),u.length>=2&&_.push(`hybrid ${u.length} bp${y?" + new nt at i+1":""}`),n.scrunch>.6&&S.push(`+${Math.round(n.scrunch)} bp of DNA scrunched in`),x&&S.push("3\u2032 end backtracked into the secondary channel");let R=[_.join("  \xB7  "),S.join("  \xB7  ")].filter(Boolean),P=R.join(`
`);pn.summary.dataset.v!==P&&(pn.summary.dataset.v=P,pn.summary.textContent="",R.forEach((b,M)=>{let C=document.createElementNS("http://www.w3.org/2000/svg","tspan");C.setAttribute("x",rn.left),C.setAttribute("dy",M?"14":"0"),C.textContent=b,pn.summary.append(C)}))}function vE(n){let e=n.time,t=e<Hn.start||e>=108&&e<136||n.path==="intrinsic"&&e>=142&&e<154;return innerWidth<=600||innerHeight<=560?"rna":Xg??(t?"dna":"rna")}function $g(n){n!==qg&&(qg=n,T("dna-view").hidden=n!=="dna",T("rna-view").hidden=n!=="rna",T("tab-dna").setAttribute("aria-selected",String(n==="dna")),T("tab-rna").setAttribute("aria-selected",String(n==="rna")),Wg="",Yt())}function Nh(n,e=!1){if(_n===n){T("ribosome").checked=n;return}_n=n,T("ribosome").checked=n;for(let s in mh)delete mh[s];let t=document.activeElement,i=t?.closest?.("#description-body .line")?.dataset.t;if(bs()?.copyUncoupled&&(gh=""),la=-1,vs&&(gp(),i&&T("description-body").querySelector(`.line[data-t="${i}"]`)?.focus({preventScroll:!0})),E0(),an?.id==="coupling"&&!n&&oo(!1),an){let s=Dh();T("cp-count").textContent=`Predict \xB7 ${s.indexOf(an)+1} of ${s.length}`}Xi&&!T("end-card").hidden&&Mp(),vs&&!sp&&!Nt&&ng(Ae)&&Jf(),on(),Ci(),e&&(Ln.set("ribosome",n?"1":"0"),On(n?"Coupled translation on: a schematic ribosome translates the RNA during the time-lapse (T).":"Coupled translation off (T).",2600))}function bE(){for(let n of document.querySelectorAll(".details-list"))n.innerHTML=cp.map(([e,t,i])=>`<label class="setting check"><input type="checkbox" data-detail="${e}"><span>${t}<small>${i}</small></span></label>`).join("");document.querySelectorAll("[data-detail]").forEach(n=>n.onchange=()=>ME(n.dataset.detail,n.checked,!0)),M0()}function M0(){document.querySelectorAll("[data-detail]").forEach(n=>n.checked=gr.has(n.dataset.detail)),T("parts").classList.toggle("on",gr.size>0),a0=as("parts")}function Yg(n){gr=new Set(n.filter(e=>cp.some(t=>t[0]===e))),M0(),on()}function ME(n,e,t=!1){e?gr.add(n):gr.delete(n),M0(),t&&(Ln.set("details",[...gr].join(",")),li(`${cp.find(i=>i[0]===n)[1]} ${e?"shown":"hidden"}.`,0)),Ci(),on()}function rp(n=T("details-menu").hidden){if(n&&!T("parts").offsetParent){Ds(!0);return}T("details-menu").hidden=!n,T("parts").setAttribute("aria-expanded",String(n)),n?T("details-menu").querySelector("input")?.focus({preventScroll:!0}):T("details-menu").contains(document.activeElement)&&T("parts").focus({preventScroll:!0})}function S0(n,e=!1){hp=n,T("sequence").checked=n,on(),e&&On(n?"Base identity on: A, T/U, G and C are coloured and lettered in close-ups (S).":"Base identity off (S).",2400)}var Iv=Km.flatMap(n=>[n.term,...n.aliases||[]].map(e=>[e,n])).sort((n,e)=>e[0].length-n[0].length),SE=new RegExp(`(?<![\\p{L}\\p{N}])(${Iv.map(([n])=>n.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")).join("|")})(?![\\p{L}\\p{N}])`,"giu"),wE=n=>Iv.find(([e])=>e.toLowerCase()===n.toLowerCase())?.[1];function AE(n,e){n.textContent="";let t=new Set,i=0;for(let s of e.matchAll(SE)){let r=wE(s[0]);if(!r||t.has(r)||t.size>=4)continue;t.add(r),n.append(e.slice(i,s.index));let o=document.createElement("button");o.className="term",o.textContent=s[0],o.title=`${r.term}: ${r.def}`,o.onclick=()=>w0(r.term),n.append(o),i=s.index+s[0].length}n.append(e.slice(i))}function TE(){let n=T("glossary-list");n.textContent="";for(let e of[...Km].sort((t,i)=>t.term.replace(/^[−+]/,"").localeCompare(i.term.replace(/^[−+]/,""),"en",{sensitivity:"base"}))){let t=document.createElement("div");t.id=`g-${jm(e.term)}`,t.className="g-entry",t.innerHTML='<dt></dt><dd><p></p><div class="g-actions"><button class="show">Show me \u25B8</button><button class="read">In the notes \u2197</button></div></dd>',t.querySelector("dt").textContent=e.term,t.querySelector("p").textContent=e.def,t.querySelector(".show").onclick=()=>EE(e),t.querySelector(".read").onclick=()=>Fl(e.notes),t.dataset.text=[e.term,...e.aliases||[],e.def].join(" ").toLowerCase(),n.append(t)}}function EE(n){let e=n.show;gt(!1);let t="";e.coupling&&!_n&&(Nh(!0),t=" Coupled translation is on for this visit; T hides it.",On(t.trim(),3200));let i=!!(re&&e.routes?.[re]!==void 0);!i&&e.path&&e.path!==re?ys(e.path):!re&&e.t>=136&&ys("rho"),ro(i?e.routes[re]:e.t),e.key&&setTimeout(()=>{Kg(e.key)&&Do[e.key]&&I0(e.key)},80),li(`${n.term}. ${n.def}${t}`,0)}function w0(n){if(T("glossary").hidden&&(Nv=document.activeElement),Ih(),T("glossary-list").children.length||TE(),T("glossary").hidden=!1,document.body.classList.add("glossing"),Yt(),n){let e=T(`g-${jm(n)}`);e&&(e.scrollIntoView({block:"start"}),e.classList.add("flash"),setTimeout(()=>e.classList.remove("flash"),1600),e.querySelector(".show").focus({preventScroll:!0}))}else T("glossary-search").focus()}var Nv=null,Dv=null,gf=!0,Lv=(n,e)=>(n?.isConnected&&n!==document.body&&n.offsetParent!==null?n:e).focus({preventScroll:!0});function A0(){if(T("glossary").hidden)return;let n=T("glossary").contains(document.activeElement);T("glossary").hidden=!0,document.body.classList.remove("glossing"),Yt(),n&&Lv(Nv,T("play"))}var Xi=!1,an=null,Eh=!1,xr={},Mi=[];try{xr=JSON.parse(Ln.get("predictions")||"{}")||{}}catch{xr={}}function T0(n,e=!1){Xi=n,T("predict").checked=n,E0(),n||oo(!1),e&&On(n?"Predict mode on: playback stops before key moments with a question (Q).":"Predict mode off (Q).",2600),Ci()}var Dh=()=>Oy(re||"rho").filter(n=>_n||n.id!=="coupling");function E0(){if(T("ticks").querySelectorAll("u").forEach(e=>e.remove()),!Xi)return;let n=Number(T("time").max);for(let e of Dh())if(e.t<=n){let t=document.createElement("u");t.style.left=`${(e.t/n*100).toFixed(2)}%`,t.title=e.q,T("ticks").append(t)}}var RE=(n,e)=>Xi?Dh().find(t=>(re||t.t<136)&&n<t.t&&e>=t.t):null;function CE(n){an=n,Eh=!1;let e=Dh();T("cp-count").textContent=`Predict \xB7 ${e.indexOf(n)+1} of ${e.length}`,T("cp-keys").textContent=n.kind==="pick"?"Click in 3D, or answer with 1\u20132":`Answer with 1\u2013${n.options.length}`,T("cp-question").textContent=n.q,T("cp-options").innerHTML=n.options.map((t,i)=>`<button data-k="${i}"><kbd>${i+1}</kbd><span></span></button>`).join(""),T("cp-options").querySelectorAll("button").forEach((t,i)=>{t.querySelector("span").textContent=n.options[i],t.onclick=()=>R0(i)}),T("cp-feedback").hidden=!0,T("checkpoint").hidden=!1,document.body.classList.add("predicting"),T("cp-options").querySelector("button").focus({preventScroll:!0}),li(`Predict. ${n.q} ${n.options.map((t,i)=>`${i+1}: ${t}.`).join(" ")}`,0),Yt(),on()}function R0(n){if(!an||Eh||n<0||n>=an.options.length)return;Eh=!0;let e=an,t=n===e.answer;xr[e.id]=t,Ln.set("predictions",JSON.stringify(xr)),T("cp-options").querySelectorAll("button").forEach((i,s)=>{i.disabled=!0,i.classList.toggle("right",s===e.answer),i.classList.toggle("wrong",s===n&&!t)}),T("cp-result").textContent=t?"Right.":`Not quite. It is: ${e.options[e.answer]}.`,T("cp-result").className=`cp-result ${t?"right":"wrong"}`,T("cp-why").textContent=e.why,T("cp-feedback").hidden=!1,T("cp-notes").onclick=()=>Fl(e.notes),T("cp-watch").focus({preventScroll:!0}),li(`${T("cp-result").textContent} ${e.why}`,0)}function oo(n){if(!an)return;let e=T("checkpoint").contains(document.activeElement);an=null,T("checkpoint").hidden=!0,e&&T("play").focus({preventScroll:!0}),document.body.classList.remove("predicting"),Yt(),on(),n&&gt(!0)}function PE(){let n=T("choice-question");if(n.hidden=!Xi,!Xi)return;let e=eg;n.innerHTML='<p class="eyebrow">Predict \xB7 answer with 1\u20132</p><p class="q"></p><div class="cp-options"></div><p class="why" role="status" hidden></p>',n.querySelector(".q").textContent=e.q;let t=n.querySelector(".cp-options");e.options.forEach((i,s)=>{let r=document.createElement("button");r.innerHTML=`<kbd>${s+1}</kbd><span></span>`,r.querySelector("span").textContent=i,r.onclick=()=>{let o=s===e.answer;xr[e.id]=o,Ln.set("predictions",JSON.stringify(xr)),t.querySelectorAll("button").forEach((c,h)=>{c.disabled=!0,c.classList.toggle("right",h===e.answer),c.classList.toggle("wrong",h===s&&!o)});let a=n.querySelector(".why");a.hidden=!1,a.textContent=`${o?"Right.":"Not quite."} ${e.why}`,T("path-choice").querySelector("[data-path]").focus()},t.append(r)})}var Uv=null;function ma(n){Uv=n?re:null,T("end-card").hidden=!n,document.body.classList.toggle("at-end",n),n&&(T("end-title").textContent=re==="intrinsic"?"The hairpin ended it. The core is free again.":"Rho ended it. The core is free again.",T("other-ending").textContent=`Watch the ${re==="rho"?"intrinsic":"Rho-dependent"} ending \u25B8`,T("recap").hidden=!Xi,Xi&&Mp(),Yt())}function Mp(){Mi.length||(Mi=[3,0,5,1,4,2]);let n=T("recap-list");n.innerHTML="",Mi.forEach((r,o)=>{let a=document.createElement("li");a.draggable=!0,a.dataset.k=r;let c=nr[r][0];a.innerHTML=`<span class="grip" aria-hidden="true">\u22EE\u22EE</span><span class="name"></span><span class="tools"><button class="up" aria-label="Move ${c} up" ${o===0?"disabled":""}>\u2191</button><button class="down" aria-label="Move ${c} down" ${o===Mi.length-1?"disabled":""}>\u2193</button></span>`,a.querySelector(".name").textContent=c,a.setAttribute("aria-label",`${o+1}. ${c}`),a.querySelector(".up").onclick=()=>M_(o,-1),a.querySelector(".down").onclick=()=>M_(o,1),a.ondragstart=h=>{h.dataTransfer.setData("text/plain",String(o)),a.classList.add("dragging")},a.ondragend=()=>a.classList.remove("dragging"),a.ondragover=h=>h.preventDefault(),a.ondrop=h=>{h.preventDefault();let l=Number(h.dataTransfer.getData("text/plain")),[d]=Mi.splice(l,1);Mi.splice(o,0,d),Mp()},n.append(a)});let e=Dh(),t=[...e.map(r=>r.id),eg.id],i=t.filter(r=>r in xr),s=i.filter(r=>xr[r]);T("score-line").textContent=i.length?`${s.length} / ${i.length} predictions right this time.`:"",T("revisit").innerHTML="";for(let r of e.filter(o=>xr[o.id]===!1)){let o=document.createElement("button");o.textContent=`Revisit \xB7 ${Ri(r.t)}`,o.title=r.q,o.onclick=()=>{ma(!1),ro(Math.max(0,r.t-4))},T("revisit").append(o)}}function M_(n,e){let t=n+e;if(t<0||t>=Mi.length)return;[Mi[n],Mi[t]]=[Mi[t],Mi[n]],Mp();let i=T("recap-list").children[t],s=i.querySelector(e<0?".up":".down");(s.disabled?i.querySelector(e<0?".down":".up"):s).focus(),li(`${nr[Mi[t]][0]} moved to position ${t+1} of ${Mi.length}.`,0)}function IE(){let n=0;[...T("recap-list").children].forEach((e,t)=>{let i=Number(e.dataset.k),s=i===t;if(s&&n++,e.classList.toggle("right",s),e.classList.toggle("wrong",!s),!e.querySelector(".jump")){let r=document.createElement("button");r.className="jump",r.textContent=`\u25B8 ${Ri(nr[i][1])}`,r.setAttribute("aria-label",`Watch ${nr[i][0]} at ${Ri(nr[i][1])}`),r.onclick=()=>{ma(!1),ro(nr[i][1])},e.querySelector(".tools").prepend(r)}}),T("recap-result").textContent=n===nr.length?"All six in order.":`${n} of ${nr.length} in place. The order is closed complex, open complex, abortive initiation, promoter clearance, elongation, termination.`}function S_(){document.querySelectorAll("#compare [data-route]").forEach(n=>n.classList.toggle("current",n.dataset.route===re)),T("compare-other").hidden=!re,T("compare-other").textContent=re?`Watch the ${re==="rho"?"intrinsic":"Rho-dependent"} ending \u25B8`:"",T("compare").showModal()}function w_(){let n=re==="rho"?"intrinsic":"rho";T("compare").open&&T("compare").close(),ma(!1),io=136,ys(n,!0)}var C0=[{keys:["Space","K"],label:"Play or pause (continues after a hold)",run:()=>Ti!==null?wl():gt(!zt)},{keys:["\u2190","\u2192"],label:"Back or forward 2 s \xB7 with Shift, 10 s",match:n=>n.key==="ArrowLeft"||n.key==="ArrowRight",run:n=>n.key==="ArrowRight"&&(Ti!==null||e0())?wl():kg((n.key==="ArrowRight"?1:-1)*(n.shiftKey?10:2))},{keys:["[","]"],alt:"Page Up / Page Down",label:"Previous or next chapter",match:n=>["[","]","PageUp","PageDown"].includes(n.key),run:n=>{let e=n.key==="]"||n.key==="PageDown";e&&(Ti!==null||e0())?wl():Df(e?1:-1)}},{keys:[",","."],label:"Previous or next step",match:n=>n.key===","||n.key===".",run:n=>zg(n.key==="."?1:-1)},{keys:["Home","End"],label:"Start, or the end (or the choice of ending)",match:n=>n.key==="Home"||n.key==="End",run:n=>{gt(!1),gs(n.key==="Home"?0:re?Cn(re):136)}},{keys:["C"],label:"Cutaway",run:()=>T("cutaway").click()},{keys:["E"],label:"Explore in 3D, or resume the guided camera",run:()=>zs(!Nt)},{keys:["L"],label:"Labels",run:()=>T("labels").click()},{keys:["A"],label:"Extra detail (\u03C3 regions, active-site parts, subunits, more mechanism)",run:()=>rp()},{keys:["F"],label:"Fullscreen",run:()=>T("fullscreen").click()},{keys:["N"],label:"Lecture notes",run:()=>T("notes-panel").hidden?Fl(bs().notes):Ph()},{keys:["D"],label:"Text description",run:()=>Vg()},{keys:["M"],label:"Reduce motion",run:()=>ip(!Fn,!0)},{keys:["H"],label:"Hold at chapter ends",run:()=>np(!Dl,!0)},{keys:["R"],label:"Loop this chapter",run:()=>vp(!xs)},{keys:["P"],label:"Presenter mode",run:()=>bp(!pa)},{keys:["B"],label:"Blackout (presenting)",run:()=>v0()},{keys:["I"],label:"Say where we are and what is on screen",run:()=>gE()},{keys:["U"],label:"Copy a link to this moment",run:()=>Rv()},{keys:["V"],label:"Read chapters aloud (offline voice)",run:()=>b0(!Wi,!0)},{keys:["S"],label:"Show base identity (sequence colours and letters)",run:()=>S0(!hp,!0)},{keys:["T"],label:"Coupled translation (a schematic ribosome)",run:()=>Nh(!_n,!0)},{keys:["G"],label:"Glossary",run:()=>T("glossary").hidden?w0():A0()},{keys:["Q"],label:"Predict, then watch",run:()=>T0(!Xi,!0)},{keys:["1","2","3","4"],label:"Answer a prediction; Enter watches the answer",match:n=>!!an&&(/^[1-9]$/.test(n.key)&&Number(n.key)<=an.options.length||Eh&&n.key==="Enter"),run:n=>n.key==="Enter"?oo(!0):R0(Number(n.key)-1)},{keys:["?"],label:"Keyboard shortcuts",match:n=>n.key==="?",run:()=>Gg()},{keys:["Esc"],label:"Close the top panel, or return to the guided camera",match:n=>n.key==="Escape",run:()=>Tv()}];C0.forEach(n=>n.match??=e=>n.keys.some(t=>t==="Space"?e.code==="Space":t.length===1&&e.key.toLowerCase()===t.toLowerCase()));function NE(){T("shortcut-list").innerHTML=C0.map(n=>`<div><dt>${n.keys.map(e=>`<kbd>${e}</kbd>`).join(" ")}${n.alt?` <small>or ${n.alt}</small>`:""}</dt><dd>${n.label}</dd></div>`).join("")}function DE(){let n=Et.domElement;T("play").onclick=()=>Ti!==null?wl():gt(!zt),T("continue").onclick=()=>wl(),T("next-chip").onclick=()=>Ti!==null||e0()?wl():Df(1),T("restart").onclick=()=>{re=null,zi=null,io=null,Mv(),tp(),m0(),cn(0),gt(!0)},T("time").oninput=l=>{gt(!1),zi=null,gs(Number(l.target.value))},T("time").addEventListener("keydown",l=>{let d=l.key,u=l.shiftKey?10:2,f=!0;d==="ArrowRight"||d==="ArrowUp"?kg(u):d==="ArrowLeft"||d==="ArrowDown"?kg(-u):d==="PageDown"?Df(1):d==="PageUp"?Df(-1):d==="Home"?(gt(!1),gs(0)):d==="End"?(gt(!1),gs(re?Cn(re):136)):f=!1,f&&l.preventDefault()});let e=T("scrub-tip");T("time").addEventListener("pointermove",l=>{let d=T("time"),u=d.getBoundingClientRect(),f=ft((l.clientX-u.left-7)/Math.max(1,u.width-14))*Number(d.max),x=re||"rho",y=!re&&f>=136?hv:ir(x).findLast(p=>f>=p.start),m=Uo(x,_n)[tf(f,x,_n)];e.textContent=`${Ri(f)} \xB7 ${y.nav}${m&&m[0]>=y.start&&(re||f<136)?` \xB7 ${m[1]}`:""}`,e.style.left=`${(l.clientX-u.left).toFixed(0)}px`,e.hidden=!1}),T("time").addEventListener("pointerleave",()=>e.hidden=!0),T("speed").onchange=l=>{_s=Number(l.target.value),on()},T("chapter-select").onchange=l=>ro(Number(l.target.value)),T("show-text").onclick=()=>{let l=!document.body.classList.contains("show-text");document.body.classList.toggle("show-text",l),T("show-text").setAttribute("aria-expanded",String(l)),T("show-text").textContent=l?"Hide text":"Show text",Yt()},T("beat-prev").onclick=()=>zg(-1),T("beat-next").onclick=()=>zg(1),T("loop").onclick=()=>vp(!xs),document.querySelectorAll(".path-control [data-route]").forEach(l=>l.onclick=()=>ys(l.dataset.route)),T("path-more").onchange=l=>{l.target.value&&(Ds(!1),ys(l.target.value))},T("path-choice").querySelectorAll("[data-path]").forEach(l=>l.onclick=()=>ys(l.dataset.path,!0)),T("path-choice").addEventListener("keydown",l=>{let d=Number(l.key),u=[...T("choice-question").querySelectorAll(".cp-options button:not(:disabled)")];Xi&&d>=1&&d<=u.length&&(l.preventDefault(),u[d-1].click())}),T("path-choice").addEventListener("close",()=>{re||(io=null,y0(),T("play").focus())}),T("choice-close").onclick=()=>tp(),T("explore").onclick=()=>zs(!Nt),T("textbook-view").onclick=()=>zs(!1,!1),yt.enabled=!1,yt.enableZoom=!1,yt.addEventListener("change",()=>_r());let t=new Map,i=null,s=!1,r=()=>{zs(!0),s=!0;for(let{start:l,last:d}of t.values())n.dispatchEvent(new PointerEvent("pointerdown",{pointerId:l.pointerId,pointerType:l.pointerType,clientX:d.clientX,clientY:d.clientY,button:l.button,buttons:l.buttons,shiftKey:l.shiftKey,ctrlKey:l.ctrlKey,metaKey:l.metaKey,isPrimary:l.isPrimary,bubbles:!0}));s=!1};n.addEventListener("pointerdown",l=>{s||(t.set(l.pointerId,{start:l,last:l}),i={x:l.clientX,y:l.clientY,id:l.pointerId,moved:!1},!Nt&&t.size>=2&&(i.moved=!0,r()))}),n.addEventListener("pointermove",l=>{t.has(l.pointerId)&&(t.get(l.pointerId).last=l),i&&!i.moved&&l.pointerId===i.id&&Math.hypot(l.clientX-i.x,l.clientY-i.y)>5&&(i.moved=!0,Nt||r()),t.size||FE(l)});let o=l=>{if(t.delete(l.pointerId),!i||i.id!==l.pointerId)return;let d=i;i=null,l.pointerType!=="touch"&&!Nt&&setTimeout(()=>n.blur()),!d.moved&&l.type==="pointerup"&&(clearTimeout(fg),fg=setTimeout(()=>BE(l),230))};n.addEventListener("pointerup",o),n.addEventListener("pointercancel",o),n.addEventListener("pointerleave",()=>OE()),n.addEventListener("wheel",l=>{Nt||(l.preventDefault(),jr=Math.min(2,Math.max(.5,jr*Math.exp(l.deltaY*.0012))),_r())},{passive:!1}),n.addEventListener("dblclick",()=>{clearTimeout(fg),Nt&&zs(!1)}),n.tabIndex=0,n.setAttribute("role","application"),n.setAttribute("aria-roledescription","3D view"),n.setAttribute("aria-label","3D view. Shift and arrow keys rotate, arrow keys pan, plus and minus zoom, Escape returns to the guided camera."),n.setAttribute("aria-describedby","scene-now"),n.addEventListener("keydown",l=>{if(l.metaKey||l.ctrlKey||l.altKey)return;let d=l.key.startsWith("Arrow"),u=["+","=","-","_"].includes(l.key);!d&&!u||!Nt&&!n.matches(":focus-visible")||(Nt||zs(!0),u&&(l.preventDefault(),dE(l.key==="-"||l.key==="_"?1/.85:.85)))}),yt.listenToKeyEvents(n),yt.keyRotateSpeed=30,yt.keyPanSpeed=14,T("cutaway").onclick=()=>{zi=T("cutaway").getAttribute("aria-pressed")!=="true",t0=rt.chapter,li(zi?"Cutaway on.":"Cutaway off.",0),Ci(),on()},T("labels").onclick=()=>{qr=!qr,T("labels").setAttribute("aria-pressed",qr),T("labels").textContent=qr?"Labels":"Labels: off",li(qr?"Labels on.":"Labels off.",0),Ci(),on()},T("parts").onclick=()=>rp(),document.addEventListener("pointerdown",l=>{!T("details-menu").hidden&&!l.target.closest?.(".details-wrap")&&rp(!1)}),T("fullscreen").onclick=()=>document.fullscreenElement?document.exitFullscreen():document.documentElement.requestFullscreen?.(),document.addEventListener("fullscreenchange",()=>{let l=!!document.fullscreenElement;T("fullscreen").setAttribute("aria-label",l?"Exit fullscreen":"Enter fullscreen"),T("fullscreen").textContent=l?"\u2921":"\u26F6"}),T("read-notes").onclick=()=>Fl(),T("section-notes").onclick=()=>Fl(bs().notes),T("notes-close").onclick=()=>Ph(),T("describe").onclick=()=>Vg(),T("glossary-more").onclick=()=>{Ds(!1),w0()},T("glossary-close").onclick=()=>A0(),T("glossary-search").oninput=l=>{let d=l.target.value.trim().toLowerCase();for(let u of T("glossary-list").children)u.hidden=!!d&&!u.dataset.text.includes(d)},T("describe-more").onclick=()=>{Ds(!1),Vg(!0)},T("description-close").onclick=()=>Ih(),T("follow").onchange=l=>vv=l.target.checked,T("announce-lines").onchange=l=>bv=l.target.checked;let a=()=>{gt(!1),Ds(!1),T("sources").showModal()};T("sources-open").onclick=a,T("sources-more").onclick=a,T("sources-close").onclick=()=>T("sources").close(),T("shortcuts-open").onclick=()=>{Ds(!1),Gg()},T("shortcuts-button").onclick=()=>Gg(),T("shortcuts-close").onclick=()=>T("shortcuts").close(),NE(),T("figure-close").onclick=()=>T("figure-dialog").close(),T("inspector-close").onclick=()=>N0(),document.querySelectorAll("#legend [data-find]").forEach(l=>{let d=l.dataset.find;l.onmouseenter=l.onfocus=()=>{(l.matches(":focus-visible")||l.matches(":hover"))&&Kg(d,!0)},l.onclick=()=>{Kg(d)&&Do[d]&&I0(d)}});for(let l of document.querySelectorAll("#legend,.card-tabs"))VE(l,l.matches(".card-tabs"));T("single-keys").checked=gf=Ln.get("singleKeys")!=="0",T("single-keys").onchange=l=>{gf=l.target.checked,Ln.set("singleKeys",gf?"1":"0")},T("key-button").onclick=()=>{let l=!T("legend").classList.contains("open");T("legend").classList.toggle("open",l),T("key-button").setAttribute("aria-expanded",String(l))},T("more").onclick=()=>Ds(),document.addEventListener("pointerdown",l=>{!T("settings").hidden&&!l.target.closest("#settings,#more")&&Ds(!1)}),T("quality").onchange=async l=>{ri=l.target.value,Ln.set("quality",ri),ri==="auto"&&!oa&&(oa=await pv()),xp(ri==="auto"?oa:ri)},T("motion").onchange=l=>{hs=l.target.value,Ln.set("motion",hs),ip(hs==="auto"?Sf.matches:hs==="reduced")},Sf.addEventListener("change",()=>{hs==="auto"&&ip(Sf.matches)}),T("hold").onchange=l=>np(l.target.checked),T("sequence").onchange=l=>S0(l.target.checked),T("ribosome").onchange=l=>Nh(l.target.checked,!0),T("read-pace").onchange=l=>D0(l.target.value,!0),T("read-pause").onclick=()=>Vv(),T("tab-dna").onclick=()=>{Xg="dna",$g("dna"),Pv(rt)},T("tab-rna").onclick=()=>{Xg="rna",$g("rna")},T("predict").onchange=l=>T0(l.target.checked),T("cp-watch").onclick=()=>oo(!0),T("recap-check").onclick=()=>IE(),T("compare-open").onclick=()=>S_(),T("choice-compare").onclick=()=>S_(),T("compare-close").onclick=()=>T("compare").close(),T("compare-other").onclick=()=>w_(),T("other-ending").onclick=()=>w_(),T("replay").onclick=()=>{ma(!1),T("restart").click()},T("narrate").onchange=l=>b0(l.target.checked),T("present").onclick=()=>{Ds(!1),bp(!pa)},T("copy-link").onclick=()=>Rv(),T("include-camera").onchange=l=>_v=l.target.checked,"speechSynthesis"in window&&(b_(),speechSynthesis.addEventListener?.("voiceschanged",b_)),addEventListener("pointermove",Hg,{passive:!0}),T("blackout").onclick=()=>v0(!1),window.addEventListener("message",l=>{if(l.source===window.parent&&window.parent!==window&&l.data?.kind==="transcription-3d"){let{action:d,value:u}=l.data;if(d==="seek"&&Number.isFinite(Number(u)))gs(Number(u));else if(d==="play")gt(!0);else if(d==="pause")gt(!1);else if(d==="chapter"&&typeof u=="string"){let f=ir(re||"rho").find(x=>Qd(x.nav)===u);f&&ro(f.start)}return}l.origin!==location.origin||l.source!==T("notes-frame").contentWindow||l.data?.kind!=="lecture-figure"||!l.data.src?.startsWith("data:image/")||(T("figure-image").src=l.data.src,T("figure-image").alt=l.data.alt||"Lecture figure",T("figure-caption").textContent=l.data.alt||"",T("figure-dialog").showModal())}),"IntersectionObserver"in window&&new IntersectionObserver(([l])=>{hh=l.isIntersecting,C_(!hh||document.hidden),hh&&Cl()}).observe(T("viewport")),document.addEventListener("visibilitychange",()=>C_(document.hidden||!hh));let c=!1;addEventListener("resize",()=>{c||(c=!0,requestAnimationFrame(()=>{c=!1,Gn.resetSizes(),y_()}))});let h=()=>matchMedia(`(resolution: ${devicePixelRatio}dppx)`).addEventListener("change",()=>{y_(),h()},{once:!0});h(),n.addEventListener("webglcontextlost",l=>{l.preventDefault(),rf=rf||zt,gt(!1),T("gl-lost").hidden=!1,T("gl-reload").hidden=!0,clearTimeout(sg),sg=setTimeout(()=>{let d=new URLSearchParams(location.search);d.set("t",Ae.toFixed(1)),re&&d.set("path",re),T("gl-reload").href="?"+d,T("gl-reload").textContent=`Reload at ${Ri(Ae)}`,T("gl-reload").hidden=!1},5e3)}),n.addEventListener("webglcontextrestored",()=>{clearTimeout(sg),mv(),T("gl-lost").hidden=!0,on(),rf&&gt(!0),rf=!1}),document.addEventListener("visibilitychange",()=>{vh=performance.now(),document.hidden||Cl()}),document.addEventListener("pointerup",l=>{if(l.pointerType!=="mouse")return;let d=l.target.closest?.(".transport button,.top-controls button,.chapters button,#legend button,.path-control button,.narration button,#end-card button,#inspector .chips button,.card-tabs button,.next-chip");d&&setTimeout(()=>d.blur())}),document.addEventListener("keydown",l=>{if(Hg(),l.defaultPrevented||l.metaKey||l.ctrlKey||l.altKey)return;let d=l.target;if(l.key==="Escape"&&!document.querySelector("dialog[open]")){if(d.type==="search"&&d.value){d.value="",d.dispatchEvent(new Event("input"));return}l.preventDefault(),Tv();return}if(d.closest?.("input:not([type=range]),select,textarea,[contenteditable]")||document.querySelector("dialog[open]")||["PageUp","PageDown","Home","End"," "].includes(l.key)&&d.closest?.("#description,#glossary,#inspector,#settings")||(l.key.startsWith("Arrow")||l.key==="Home"||l.key==="End")&&d.closest?.("[role=toolbar],[role=tablist]")||d.closest?.("button,a,summary,[role=tab]")&&(l.key===" "||l.key==="Enter")||d===n&&(l.key.startsWith("Arrow")||["+","=","-","_"].includes(l.key))||!T("notes-panel").hidden&&l.key!=="Escape")return;let u=C0.find(f=>f.match(l));u&&(!gf&&l.key.length===1&&l.key!==" "||(l.preventDefault(),u.run(l)))})}var pg=new Ic,A_=new ae,xf=N(),yf=N(),T_=N(),_f=new Map,gl=[],Ol=!1,P0=null,Al=null,E_=null,mg=0,so=null,Sp=0,gg=new Set;function LE(){let n=(e,t,i,s)=>{let r=new Float32Array(i.length*3);i.forEach((o,a)=>{r[a*3]=o[0]-(s?.[0]||0),r[a*3+1]=o[1]-(s?.[1]||0),r[a*3+2]=o[2]-(s?.[2]||0)}),gl.push({key:e,mesh:t,pts:r,clip:ia.includes(t)})};Bs.meshes.forEach((e,t)=>{let i=Nl.find(s=>s.userData===e)||Nl.find(s=>s.userData.name===e.name&&s.userData.chain===e.chain);!i||!e.trace||n(e.group==="rho"?"rho":Zm[e.chain],i,e.trace,e.group==="rho"?Bs.rhoCenter:null)}),dh.meshes.forEach(e=>{e.trace&&n(e.group==="sigma"?"sigma":"nusA",e.group==="sigma"?sa:dr,e.trace)})}var to=n=>{for(let e=n;e;e=e.parent)if(!e.visible)return!1;return!0};function op(n,e){A_.set(n/innerWidth*2-1,-(e/innerHeight)*2+1),pg.setFromCamera(A_,Ke);let t=pg.ray,i=rt,s=null,r=(h,l)=>{h>0&&(!s||h<s.along)&&(s={along:h,...l})},o=Rl>.5,a=[[Zn,"ribosome"],[Tn,"ntp"],[Hi,"ppi"],[fr,"mg"],[cs,"bridgeHelix"],[Kr.mesh,"triggerLoop"],[ls,"error"],[Jo.mesh,"hairpin"],[eo,"utract"]];for(let[h,l]of a){if(!to(h))continue;let d=pg.intersectObject(h,!0)[0];d&&(d.object.material?.opacity??1)>.15&&r(d.distance-4,{key:l})}an?.kind!=="pick"&&Ml.forEach((h,l)=>{if(!to(h.mesh)||h.material.uniforms.uAmount.value<.05)return;let d=h.radius*.8;for(let u=0;u+1<h.count;u++)if(t.distanceSqToSegment(h.points[u],h.points[u+1],yf,T_)<d*d){r(yf.distanceTo(t.origin)-4,{key:["promoter35","promoter10","start"][l]});break}});let c=(h,l,d)=>{if(!to(h.mesh)||h.material.opacity<.15)return;let u=h.radius+1.2;for(let f=0;f+1<h.count;f++){let x=t.distanceSqToSegment(h.points[f],h.points[f+1],yf,T_);x<u*u&&r(yf.distanceTo(t.origin)-Math.sqrt(u*u-x),{key:l,index:f,...d})}};c(Wt[0],"template"),c(Wt[1],"coding"),c(Wn,"rna");for(let h of gl){let l=h.mesh;if(!to(l)||l.material.opacity<.3)continue;let d=l.matrixWorld.elements,u=h.pts;for(let f=0;f<u.length;f+=3){let x=u[f],y=u[f+1],m=u[f+2];xf.set(d[0]*x+d[4]*y+d[8]*m+d[12],d[1]*x+d[5]*y+d[9]*m+d[13],d[2]*x+d[6]*y+d[10]*m+d[14]),!(h.clip&&o&&Bf.distanceToPoint(xf)<0)&&t.distanceSqToPoint(xf)<36&&r(xf.distanceTo(t.origin)-4,{key:h.key,mesh:l})}}return s&&UE(s,i)}function UE(n,e){let t=Do[n.key];if(!t)return null;let i=e.path,s=a=>a.replace("-","\u2212"),r=t.short,o=!1;if(n.key==="template"||n.key==="coding"){let a=r0[n.key==="template"?0:1][n.index]??0,c=Math.round(a+dp(a,e)),h=n.key==="template"?Oo(c,i):Gr(c,i),l=c>=-35&&c<=-30?" \xB7 in the \u221235 element":c>=-12&&c<=-7?" \xB7 in the \u221210 element":"";r=`Position ${s(nf(c))} \xB7 base ${h}${l}${n.key==="template"?" \xB7 read 3\u2032 \u2192 5\u2032":""}`,o=!0}else if(n.key==="rna"){let a=Math.min(Math.round(n.index/3),Math.max(0,e.displayNt-1)),c=a-e.register,h=zl(c,e);r=`Nucleotide ${a+1} of ${e.displayNt} \xB7 base ${a===Jt.j&&e.error>.5?Jt.wrong+" (wrong)":Bo(a,i)}${h>.5?` \xB7 pairs with template ${s(nf(a))}`:""}`,o=!0}else n.key==="rho"&&(r=`Protomer ${"ABCDEF"[Qr.indexOf(n.mesh)]||""} of 6 \xB7 ATP-driven RNA translocase`,o=!0);return{key:n.key,title:t.title,sub:t.gene&&!o?`${t.gene} \xB7 ${r}`:r,detail:o?r:""}}function FE(n){!vs||n.pointerType==="touch"||document.querySelector("dialog[open]")||!T("notes-panel").hidden||(E_=[n.clientX,n.clientY],mg||(mg=requestAnimationFrame(()=>{mg=0;let[e,t]=E_,i=op(e,t),s=T("hover-tip"),r=(i?.key||"")+(i?.sub||"")===(Al?.key||"")+(Al?.sub||"");if(Al=i,i){s.innerHTML="<b></b><small></small>",s.children[0].textContent=i.title,s.children[1].textContent=i.sub,s.hidden=!1;let o=s.offsetWidth,a=s.offsetHeight;s.style.transform=`translate3d(${Math.min(innerWidth-o-8,e+14)}px,${Math.min(innerHeight-a-8,t+14)}px,0)`,Et.domElement.style.cursor="pointer"}else s.hidden=!0,Et.domElement.style.cursor="";r||_r()})))}function OE(){!Al&&T("hover-tip").hidden||(Al=null,T("hover-tip").hidden=!0,Et.domElement.style.cursor="",_r())}function BE(n){if(!vs)return;let e=op(n.clientX,n.clientY);if(an?.kind==="pick"&&!Eh){e&&["template","coding"].includes(e.key)&&R0(e.key===an.pick?an.answer:1-an.answer);return}e?I0(e.key,e.detail):Ol&&N0()}function I0(n,e){let t=Do[n];if(!t)return;gt(!1),Ol||(Dv=document.activeElement),Ol=!0,P0=n;let i=T("inspector");i.querySelector("h2").textContent=t.title,i.querySelector(".gene").textContent=t.gene?`Gene: ${t.gene}`:"",i.querySelector(".detail").textContent=e||"",i.querySelector(".text").textContent=t.text,i.style.setProperty("--c",t.color),i.querySelector(".chips").innerHTML=t.at.map(([s,r,o])=>`<button data-t="${r}" data-route="${o||""}">${s} \xB7 ${Ri(r)}${o?` (${o==="rho"?"Rho":"intrinsic"} ending)`:""}</button>`).join(""),i.querySelectorAll(".chips button").forEach(s=>s.onclick=()=>{let r=Number(s.dataset.t),o=s.dataset.route;o&&o!==re?ys(o):!re&&r>=136&&ys("rho"),ro(r)}),i.querySelector(".read").onclick=()=>Fl(t.notes),i.hidden=!1,document.body.classList.add("inspecting"),Yt(),li(`${t.title}. ${e?e+". ":""}${t.text}`,0),T("inspector-title").focus({preventScroll:!0}),_r()}function N0(){if(!Ol)return;let n=T("inspector").contains(document.activeElement);Ol=!1,P0=null,T("inspector").hidden=!0,n&&Lv(Dv,T("play")),document.body.classList.remove("inspecting"),Yt(),_r()}function Fv(n){if(n==="rnap")return ia;let e=Object.entries(Zm).find(([,t])=>t===n)?.[0];return e?e==="F"?[ai]:[o0[e]].filter(Boolean):{sigma:[sa],nusA:[dr],nusG:[ai,Xo],ribosome:[Vs,mr],rho:Qr,template:[Wt[0].mesh,da[0].mesh,Gi[0],wi[0],ks],coding:[Wt[1].mesh,da[1].mesh,Gi[1],wi[1]],rna:[Wn.mesh,Pl.mesh,Gi[2],fi],ntp:[Tn],ppi:[Hi],mg:[fr],bridgeHelix:[cs],triggerLoop:[Kr.mesh],hairpin:[Jo.mesh],utract:[eo],error:[ls]}[n]||[]}function kE(){for(let e of gg){let t=e.material?.userData?.uniforms;t&&(t.uRim.value=.2)}gg.clear();for(let[e,t]of _f)e.emissiveIntensity=t;_f.clear();let n=[Al?.key,P0,so&&performance.now()<Sp?so:null].filter(Boolean);for(let e of n)for(let t of Fv(e)){let i=t.material?.userData?.uniforms;i?(i.uRim.value=e===so?1.1:.75,gg.add(t)):t.material&&(_f.has(t.material)||_f.set(t.material,t.material.emissiveIntensity),t.material.emissiveIntensity=Math.max(t.material.emissiveIntensity,.35))}}function Zg(n){so=n,Sp=performance.now()+2500,on(),clearTimeout(Zg.timer),Zg.timer=setTimeout(()=>{so=null,on()},2550)}function zE(){if(!so||performance.now()>=Sp)return;let n=new Set(Fv(so)),e=new Set([...n].map(i=>i.material)),t=new Set;for(let i of[...Nl,Wt[0].mesh,Wt[1].mesh,Wn.mesh,...da.map(s=>s.mesh),Pl.mesh,...Gi,wi[0],wi[1],ks,fi]){let s=i.material;e.has(s)||t.has(s)||s.opacity<=.02||(t.add(s),mt(s,s.opacity*.35))}$r=!0}var HE={sigma:[0,91],nusA:[81.5,null],nusG:[85,null],rho:[136,201],rna:[56,null],template:[4,null],coding:[4,null]};function Kg(n,e=!1){let[t,i]=HE[n]||[0,null];if(!(Ae>=t&&(i===null||Ae<i)&&(n!=="rho"||re==="rho"))){if(!e){let r=n==="rho"&&re!=="rho"?"appears on the Rho-dependent ending":Ae<t?`joins at ${Ri(t)}`:"has left by now";On(`${Do[n]?.title||"RNA polymerase"} is not in this scene \xB7 it ${r}.`,2600)}return!1}return Zg(n),!e&&!Do[n]&&li("RNA polymerase core: \u03B1\u2082\u03B2\u03B2\u2032\u03C9, the catalytic core.",300),!0}function VE(n,e){let t=()=>[...n.querySelectorAll("button")].filter(s=>s.offsetParent!==null),i=s=>t().forEach(r=>r.tabIndex=r===s?0:-1);i(n.querySelector("[aria-selected=true]")||t()[0]),n.addEventListener("focusin",s=>{s.target.matches("button")&&i(s.target)}),n.addEventListener("keydown",s=>{let r=t(),o=r.indexOf(document.activeElement);if(o<0)return;let a=null;s.key==="ArrowRight"||s.key==="ArrowDown"?a=(o+1)%r.length:s.key==="ArrowLeft"||s.key==="ArrowUp"?a=(o-1+r.length)%r.length:s.key==="Home"?a=0:s.key==="End"&&(a=r.length-1),a!==null&&(s.preventDefault(),r[a].focus(),e&&r[a].click())})}var ha=class extends Error{constructor(e,t,i){super(e),this.title=e,this.body=t,this.code=i}},Ls={total:0,got:0};function GE(){let n=t=>(t/1048576).toFixed(1),e=Ls.total&&Ls.got<=Ls.total*1.01;T("load-detail").textContent=e?`Molecular structures \xB7 ${n(Ls.got)} / ${n(Ls.total)} MB`:`Molecular structures \xB7 ${n(Ls.got)} MB`,T("load-bar").style.width=e?`${(100*Ls.got/Ls.total).toFixed(1)}%`:"35%"}async function dl(n,e){let t;try{t=await fetch(n)}catch{throw new ha("The files could not be downloaded",`The request for ${n} failed. Check that the local server is still running, then retry.`)}if(!t.ok)throw new ha("A required file is missing",`Could not load ${n} (HTTP ${t.status}).`);if(Ls.total+=Number(t.headers.get("Content-Length"))||0,!t.body)return e==="json"?await t.json():await t.arrayBuffer();let i=t.body.getReader(),s=[],r=0;for(;;){let{done:c,value:h}=await i.read();if(c)break;s.push(h),r+=h.byteLength,Ls.got+=h.byteLength,GE()}let o=new Uint8Array(r),a=0;for(let c of s)o.set(c,a),a+=c.byteLength;return e==="json"?JSON.parse(new TextDecoder().decode(o)):o.buffer}function WE(n){console.error(n),T("error-description").onclick=()=>{document.body.classList.add("no-scene"),T("loader").hidden=!0,gp(),T("description").hidden=!1,T("description-close").hidden=!0},T("loader").classList.add("failed"),T("loader").classList.remove("hidden"),T("load-error").hidden=!1,T("error-title").textContent=n.title||"The scene could not start",T("error-body").textContent=n.body||n.message||String(n),n.code&&(T("error-code").hidden=!1,T("error-code").textContent=n.code),T("error-retry").onclick=()=>location.reload(),T("error-retry").focus()}async function XE(){if(location.protocol==="file:")throw new ha("Open this page through a local web server","Browsers block the structure files when a page is opened straight from disk. In the repository folder, run the command below, then open http://127.0.0.1:8080.","pixi run python -m http.server 8080 --bind 127.0.0.1 --directory course_material/drawings/transcription_3d");if(!document.createElement("canvas").getContext("webgl2"))throw new ha("This browser cannot show the 3D scene","It needs WebGL 2. Use a current version of Chrome, Edge, Firefox or Safari, and check that hardware acceleration is switched on.");try{Et=new zd({antialias:!1,powerPreference:"high-performance"})}catch{throw new ha("The graphics card could not be started","The browser refused a WebGL 2 context. Close other 3D pages or restart the browser, then retry.")}Et.setPixelRatio(Math.min(devicePixelRatio,2)),Et.setSize(innerWidth,innerHeight),Et.outputColorSpace=$n,Et.toneMapping=Za,Et.toneMappingExposure=.95,Et.localClippingEnabled=!0,T("viewport").append(Et.domElement),Us.background=new Ee(462359),Us.fog=new uc(462359,22e-5),Ke=new Bn(36,innerWidth/innerHeight,4,6500),Ke.position.set(110,175,-490),Ke.up.set(0,-1,0),yt=new Gd(Ke,Et.domElement),yt.enableDamping=!0,yt.dampingFactor=.08,yt.minDistance=40,yt.maxDistance=4500;let n=new Ec(10930140,1120036,.45);n.position.set(0,-1,0),Us.add(n,Ke);for(let[u,f,x]of[[16772569,2.6,[-60,55,60]],[8633818,1.4,[70,-30,40]],[10794751,.8,[30,40,-100]]]){let y=new Cc(u,f);y.position.set(...x),y.target.position.set(0,0,-100),Ke.add(y,y.target)}Us.environmentRotation.x=Math.PI,mv();let[e,t,i,s,r,o]=await Promise.all([dl("assets/structure.json","json"),dl("assets/molecular_surfaces.bin"),dl("assets/accessories.json","json"),dl("assets/accessories.bin"),dl("assets/landmarks.json","json"),dl("assets/promoter.json","json")]);T("load-bar").style.width="100%",Bs=e,dh=i,Y_=r.landmarks,Zo=r.traces,G_=o;let a={A:3836803,B:4159651,C:5734289,D:4681088,E:7445386,F:11039802,a:9991608,b:9004969,c:7886745,d:7822229,e:8743076,f:9795510};e.meshes.forEach(u=>{let f=i_(u,t,a[u.chain]);u.group==="rho"?(f.geometry=f.geometry.clone().translate(-e.rhoCenter[0],-e.rhoCenter[1],-e.rhoCenter[2]),f.userData.rhoIndex=Qr.length,Os.add(f),Qr.push(f)):u.group==="nusg"?u.part==="kow"?(Xo=f,Yr=new Lt,Yr.position.set(...u.pivot),f.position.set(-u.pivot[0],-u.pivot[1],-u.pivot[2]),Yr.add(f),yr.add(Yr),D_.set(...u.center).sub(Yr.position).normalize()):(yr.add(f),ai=f):(f.userData.out=N(...u.center).normalize(),jo.add(f),ia.push(f),o0[u.chain]=f)}),i.meshes.forEach(u=>{let f=i_(u,s,u.group==="sigma"?15304611:aT);u.group==="sigma"?(hn.add(f),sa=f):(ua.add(f),dr=f)}),Xo.material.dispose(),Xo.material=ai.material,Nl=[...ia,...Qr,sa,dr,ai,Xo],[dr,ai].forEach(u=>u.material.emissive.copy(u.material.color)),U_.copy(N(...dr.userData.center)).normalize(),F_.copy(N(...ai.userData.center)).normalize(),GT();let c=Math.min(devicePixelRatio,2);An=new Xd(Et,new ln(1,1,{type:zn,samples:c>=1.75?2:4})),An.setPixelRatio(c),An.setSize(innerWidth,innerHeight),An.addPass(new qd(Us,Ke)),oi=new Sg(Us,Ke,innerWidth,innerHeight);{let u=oi.copyMaterial;u.fragmentShader=u.fragmentShader.replace("gl_FragColor = opacity * texel;","gl_FragColor = mix( vec4( 1.0 ), texel, opacity );"),u.needsUpdate=!0}oi.kernelRadius=7,oi.minDistance=1.5/(Ke.far-Ke.near),oi.maxDistance=40/(Ke.far-Ke.near),An.addPass(oi),cr=new sl(new ae(innerWidth,innerHeight),.14,.25,1.1),pT(cr),An.addPass(cr),An.addPass(new Yd),pl=new Zd,An.addPass(pl),pl.enabled=!1,LE(),Gn=Ny(T("annotations"),T("leaders"),T("scene-now")),document.querySelectorAll("#legend [data-actor]").forEach(u=>X_[u.dataset.actor]=u),Yt(),hs=Ln.get("motion")||"auto",bE(),Yg((Ln.get("details")||"").split(",")),Ln.get("ribosome")==="1"&&Nh(!0),Ln.get("readPace")&&D0(Ln.get("readPace")),ip(hs==="auto"?Sf.matches:hs==="reduced"),m0(),DE(),vs=!0,T("load-detail").textContent="Compiling shaders";try{await Et.compileAsync(Us,Ke)}catch{}for(let[u,f]of[[12,"rho"],[36,"rho"],[60,"rho"],[113,"rho"],[150,"intrinsic"]])re=f,cn(u),Pn();re=null,cn(0);let h=new URLSearchParams(location.search),l=h.get("quality");ri=br[l]||l==="auto"?l:Ln.get("quality")||"auto",br[ri]||(ri="auto"),T("quality").value=ri,T("load-detail").textContent="Measuring graphics speed",ri==="auto"&&(oa=await pv()),xp(ri==="auto"?oa:ri),T("load-detail").textContent="Preparing the complete cycle";let d=yE(h);Pn(),T("loader").classList.add("hidden"),setTimeout(()=>{T("loader").hidden=!0},800),li("The animation is ready. Space plays and pauses, D opens a text description, and the question mark lists the shortcuts.",400),d&&gt(!0),addEventListener("error",u=>On(`Something went wrong: ${u.message}`)),addEventListener("unhandledrejection",u=>On(`Something went wrong: ${u.reason?.message||u.reason}`)),window.fullCycle={seek:u=>{cn(u),Pn()},play:gt,choose:ys,state:()=>({...rt,playing:zt,exploring:Nt,path:re,corePosition:Gt.toArray(),rhoPosition:no.toArray(),sigmaPosition:hn.position.toArray(),camera:Ke.position.toArray(),cameraTarget:yt.target.toArray(),choiceVisible:T("path-choice").open}),rnaPoint:u=>Vt(u).toArray(),dnaAt:(u,f,x,y=re||"rho")=>{let m=os(u,y);return m.open>0&&K_(m),ht(f,Bi(x,m),m,N()).toArray()},rnaAt:(u,f,x=re||"rho")=>Vt(f,os(u,x)).toArray(),audit:()=>({coreChains:ia.length,rhoChains:Qr.length,accessories:dh.meshes.map(u=>({name:u.name,source:u.source,alignment:u.alignment})),rnaPoints:Wn.points.slice(0,Wn.count).map(u=>u.toArray()),dnaHelix:{radius:Qt.radius,phaseResidualDegrees:Qt.residual,basePairs:ra-Ai+1,initiationRise:W_},hybridPairs:9,hairpinPairs:9,uridines:7}),render:Pn,quality:()=>({choice:ri,tier:Gs,autoTier:oa,pixelRatio:Et.getPixelRatio(),samples:An.renderTarget1.samples,ao:oi.enabled,bloom:cr.enabled,fxaa:pl.enabled}),promoterContacts:(u=40)=>{let f=Ae;cn(u),Pn();let x=dh.meshes.find(p=>p.group==="sigma").anchors,y=p=>hn.position.clone().add(N(...x[p])),m={sigma4ToMinus35:+y("sigma4").distanceTo(bl[0].marker.position).toFixed(1),sigma2ToMinus10:+y("sigma2").distanceTo(bl[1].marker.position).toFixed(1)};return cn(f),Pn(),m},orientation:()=>{let u=[Ae,re,rt],f={};for(let x of["rho","intrinsic"]){re=x;let y=1,m=0,p=[],w=[];for(let v=6;v<=Cn(x);v+=.25){rt=os(v,x),Kf(),d0();let g=N().setFromMatrixColumn(Ke.matrixWorld,0),_=ht(0,150,rt,N()).sub(ht(0,-150,rt,N())).normalize(),S=g.dot(_);if(S<y&&(y=S,m=v),S<.35&&p.push(+v.toFixed(2)),v>=34&&v<=44&&v%2===0){let R=bl.map(P=>P.marker.position.clone().project(Ke).x);w.push(R[0]<R[1]&&R[1]<R[2])}}f[x]={minRightDotDownstream:+y.toFixed(3),at:m,lowTimes:p.slice(0,40),promoterLeftToRight:w.every(Boolean)}}return[Ae,re,rt]=u,cn(Ae),Pn(),f}},h.get("debug")==="1"&&Object.assign(window.fullCycle,{dnaContacts:(u,f,x=6,y=!1)=>{cn(f),Pn();let m=0,p=N(),w=x*x,v={};for(let g of gl){if(g.key!==u||!to(g.mesh))continue;let _=g.mesh.matrixWorld;for(let S=0;S<g.pts.length;S+=3){p.set(g.pts[S],g.pts[S+1],g.pts[S+2]).applyMatrix4(_);let R=null;for(let[P,b]of Wt.entries()){for(let M=0;M<b.count;M++)if(b.points[M].distanceToSquared(p)<w){R=Math.round(r0[P][M]);break}if(R!==null)break}R!==null&&(m++,v[R]=(v[R]||0)+1)}}return y?v:m},bendScales:()=>Object.fromEntries(Object.entries(kf).map(([u,f])=>[u,f.slice(0,4).map(x=>+x.scale.toFixed(3))])),promoterPicks:()=>Ml.map((u,f)=>{let x=u.points[Math.floor(u.count/2)].clone();Tl.localToWorld(x).project(Ke);let y=(x.x+1)/2*innerWidth,m=(1-x.y)/2*innerHeight,p=["promoter35","promoter10","start"][f],w=[];for(let v=-10;v<=10;v+=5)for(let g=-10;g<=10;g+=5)w.push(op(y+v,m+g)?.key);return w.includes(p)?p:w[12]??null}),glows:u=>(cn(u),Pn(),{promoter:Ml.map(f=>f.mesh.visible?+f.material.uniforms.uAmount.value.toFixed(3):0),terminator:hr.mesh.visible?+hr.material.uniforms.uAmount.value.toFixed(3):0,rings:El.children.filter(f=>f.isMesh&&!Ml.some(x=>x.mesh===f)&&f.visible).length}),loopJoin:u=>(cn(u),Pn(),Ag.map((f,x)=>{let y=f.count,m=f.points[y-1],p=Wt[x].points,w=m.clone().sub(f.points[y-2]).normalize(),v=Bi(Ai,rt),g=ht(x,v+.05,rt,N()).sub(ht(x,v,rt,N())).normalize();return{gap:+m.distanceTo(p[0]).toFixed(3),model:+m.distanceTo(ht(x,Bi(Ai,rt),rt,N())).toFixed(3),bend:+(Math.acos(ft(w.dot(g),-1,1))/ms).toFixed(1)}})),clearance:(u,f)=>{cn(f),Pn();let x=[];for(let m of gl){if(m.key!==u||!to(m.mesh))continue;let p=m.mesh.matrixWorld;for(let w=0;w<m.pts.length;w+=3)x.push(N(m.pts[w],m.pts[w+1],m.pts[w+2]).applyMatrix4(p))}let y=1e9;for(let m of[Wt[0],Wt[1],...ki.visible?Ag:[]])for(let p=0;p<m.count;p+=2){let w=m.points[p];for(let v of x){let g=v.distanceToSquared(w);g<y&&(y=g)}}return x.length?+Math.sqrt(y).toFixed(1):null},tubeWinding:u=>{cn(u),Pn();let f=N(),x=N(),y=N(),m=N();return[Wt[0],Wt[1],Wn].map(p=>{let w=p.mesh.geometry,v=w.attributes.position,g=w.attributes.normal,_=w.index.array,S=Math.min(_.length,w.drawRange.count),R=0,P=0;for(let b=0;b+2<S;b+=3){f.fromBufferAttribute(v,_[b]),x.fromBufferAttribute(v,_[b+1]),y.fromBufferAttribute(v,_[b+2]),m.fromBufferAttribute(g,_[b]);let M=x.sub(f).cross(y.sub(f));M.lengthSq()<1e-12||(P++,M.dot(m)>0&&R++)}return P?+(R/P).toFixed(3):null})},dnaMarks:u=>(cn(u),Pn(),{cones:[Gi[0],Gi[1]].map(f=>f.visible?+f.material.opacity.toFixed(3):0),strands:[Wt[0],Wt[1]].map(f=>f.mesh.visible?+f.material.opacity.toFixed(3):0)}),bloomGuard:()=>cr.materialHighPassFilter.fragmentShader.includes("clamp( texture2D( tDiffuse, vUv )"),reading:()=>{let u=performance.now();return{items:[...Vi].map(([f,x])=>[f,Math.round(u-x.since),Math.round(x.need)]),stop:Mt&&{...Mt},rate:+xl.toFixed(3),held:Dn?Math.round(u-Dn):0}},pipeline:(u={})=>{if("samples"in u)for(let f of[An.renderTarget1,An.renderTarget2])f.samples=u.samples,f.dispose();return"bloom"in u&&(cr.enabled=u.bloom),"fxaa"in u&&(pl.enabled=u.fxaa),An.setSize(innerWidth,innerHeight),on(),window.fullCycle.quality()},perf:()=>{let u=Et.info;u.autoReset=!1,u.reset(),Pn();let f={calls:u.render.calls,triangles:u.render.triangles,geometries:u.memory.geometries,textures:u.memory.textures,programs:u.programs?.length};return u.autoReset=!0,f},labels:()=>Gn.snapshot(),actors:(u,f=re||"rho")=>{let x=[Ae,re,rt];re=f,rt=os(u,f),Kf();let y=p=>p.getWorldPosition(N()).toArray(),m={core:Gt.toArray(),sigma:hn.visible?hn.position.toArray():null,rho:Os.visible?Os.position.toArray():null,ribSmall:Zn.visible&&Vs.material.opacity>.05?y(Vs):null,ribLarge:Zn.visible&&mr.material.opacity>.05?y(mr):null,kow:y(Xo)};return[Ae,re,rt]=x,on(),m},searchClearance:u=>{cn(u),Pn();let f=[];for(let m of gl){if(!["alphaI","alphaII","beta","betaPrime","omega","sigma"].includes(m.key)||!to(m.mesh))continue;let p=m.mesh.matrixWorld;for(let w=0;w<m.pts.length;w+=3)f.push(N(m.pts[w],m.pts[w+1],m.pts[w+2]).applyMatrix4(p))}let x=(m,p)=>{let w=0,v=1e9;for(let g=0;g<m.count;g+=2){let _=m.points[g];for(let S of f){let R=S.distanceToSquared(_);if(R<v&&(v=R),R<p*p){w++;break}}}return{inside:w,min:+Math.sqrt(v).toFixed(1)}},y=ki.children.filter(m=>m.isMesh&&!m.isInstancedMesh);return{mainDNA:x(Wt[0],6),arc:ki.visible?{inside:0}:null}},ribosomeClearance:u=>{if(cn(u),Pn(),!Zn.visible)return null;let f={};for(let[x,y]of[["small",Vs],["large",mr]]){y.updateMatrixWorld();let m=y.matrixWorld.clone().invert(),p=(y.geometry.parameters,null),w=x==="small"?[66,40,52]:[90,70,82],v=(_,S=1.08)=>{let R=_.clone().applyMatrix4(m);return(R.x/w[0])**2+(R.y/w[1])**2+(R.z/w[2])**2<S*S},g={};for(let _ of gl){if(!to(_.mesh))continue;let S=_.mesh.matrixWorld,R=0;for(let P=0;P<_.pts.length;P+=3)v(N(_.pts[P],_.pts[P+1],_.pts[P+2]).applyMatrix4(S))&&R++;R&&(g[_.key]=(g[_.key]||0)+R)}for(let[_,S]of[["template",Wt[0]],["coding",Wt[1]],["rna",Wn]]){let R=0;for(let P=0;P<S.count;P++)v(S.points[P],1)&&R++;R&&(g[_]=R)}f[x]=g}return f},pick:(u,f)=>op(u,f),screen:u=>{let f={mg:fr.position,core:Gt,tip:Vt(Math.max(0,rt.ntCount-1)),sigma:hn.position.clone().add(N(...sa.userData.center)),dna:ht(0,40,rt,N()),template:ht(0,-5,rt,N()),coding:ht(1,-5,rt,N())}[u].clone().project(Ke);return[(f.x+1)*innerWidth/2,(1-f.y)*innerHeight/2]},loseContext:()=>Et.forceContextLoss(),restoreContext:()=>Et.forceContextRestore(),luminance:()=>{Pn();let u=Et.getContext(),f=u.drawingBufferWidth,x=u.drawingBufferHeight,y=new Uint8Array(256*64);u.readPixels(f/2-32|0,x/2-32|0,64,64,u.RGBA,u.UNSIGNED_BYTE,y);let m=0;for(let p=0;p<y.length;p+=4)m+=.2126*y[p]+.7152*y[p+1]+.0722*y[p+2];return m/4096}}),Cl()}var vf=null,xg=!1,R_=!1,jg={relaxed:{base:1.3,wps:2.3,callout:2.6,group:8.5,cap:14},normal:{base:1,wps:3,callout:3.3,group:6.5,cap:9},brisk:{base:.7,wps:4,callout:4.4,group:4.5,cap:6}},xn={...jg.normal,glance:.9,brake:2.4,settle:.7,grace:400,merge:.25},Jg=new Set,xh=!0,Qg="normal",Mt=null,xl=1,Dn=0,ap=!1,Bl=null,na=0,lp=0,nh=0,Vi=new Map,Rh=n=>n.replace(/\b[0-9]+(?:[.,][0-9]+)?\b(?!′)/g,"#").trim(),bf=n=>(n.match(/[^\s·–—|]+/g)||[]).length,qE=()=>{let n=document.body.classList;return!Th&&!(innerHeight<=560&&!n.contains("show-text"))&&!["glossing","predicting","at-end","exploring"].some(e=>n.contains(e))};function Ov(n,e){return typeof n.copy=="string"?0:Math.max(0,n.copy.filter(t=>e>=t.at).length-1)}var Bv=(n,e)=>`N:${n.start>=136?re||"-":"shared"}:${n.nav}:${Ov(n,e)}`,$E=n=>`${n.numeral} ${n.title} ${typeof n.sub=="string"?n.sub:n.sub[re==="intrinsic"?"intrinsic":"rho"]}`,kv=()=>_s>1?_s**-.75:1,Ch=n=>Math.max(1e3*xn.glance,n.need*kv());function zv(n){let e=(n.card??ef(n,re||"rho"))+2.1,t=Uf().find(([i,s])=>e>i&&e<s);return t?t[1]:e}function YE(n){if(!xh)return;let e=new Set,t=[],i=(o,a,c,h)=>{e.add(o);let l=Vi.get(o);if(l){l.gone=0;return}let d=Rh(`${o}|${a}`),u=Jg.has(d),f={since:n,need:1e3*(u?xn.glance:xn.base+c/(h?xn.callout:xn.wps)),words:u?0:c,group:h&&!u,seenKey:d,gone:0};Vi.set(o,f),f.group&&t.push(f)},s=innerWidth<=600;for(let o of Gn.shown())if(!o.key.startsWith("T:")){let a=s?o.title:o.text;i(Rh(o.key),a,bf(a),!0)}let r=bs();if(r&&qE()&&!Wi){let o=Ov(r,Ae),a=Jd(Qf(r),Ae);i(Bv(r,Ae),a,bf(a)+(o===0?bf(p0(r.title)):0),!1)}if(ep&&Number(T("act-card").style.opacity)>.5){let o=al.find(a=>a.title===ep);if(o){let a=$E(o);i(`A:${o.title}`,a,bf(a),!1)}}for(let[o,a]of Vi)e.has(o)||(a.gone?n-a.gone>xn.grace&&(n-a.since>=Ch(a)&&Jg.add(a.seenKey),Vi.delete(o)):a.gone=n);if(t.length){let o=[...Vi.values()].filter(c=>c.group&&n-c.since<350),a=o.reduce((c,h)=>c+h.words,0);for(let c of o)c.need=1e3*Math.min(xn.group,xn.base+a/xn.callout)}}var Hv=n=>[...Vi].filter(([,e])=>!e.gone&&n-e.since<Ch(e)).map(([e])=>e);function C_(n){let e=performance.now();if(n){nh||(nh=e);return}if(!nh)return;let t=e-nh;nh=0;for(let i of Vi.values())i.since+=t,i.gone&&(i.gone+=t);Dn&&(Dn+=t)}var Lf={keys:new Set,begin(){},label(n,e){this.keys.add(Rh("L:"+e))},tag(){},bracket(n,e,t){this.keys.add(Rh("B:"+t))},end(){return!1}};function Mf(n){let e=rt,t=Gn;Lf.keys=new Set,rt=os(n,re||"rho"),Gn=Lf;try{f0(0)}finally{rt=e,Gn=t}return Lf.keys}function Uf(){return[...c0,...h0[re||"rho"]].filter(n=>n.blend).map(n=>{let e=Fn?Math.min(n.blend,1.2):n.blend,t=n.start-e*(n.lead??.35);return[t,t+e]})}function P_(n,e,t){let i=Hv(t),s=e/(2*xn.brake)+e*.2+xn.merge+.05,r=n+s,o=[],a=bs(),c=_0(n),h=a&&Bv(a,n),l=typeof a?.copy=="string"?null:a?.copy.find(y=>y.at>n+1e-6)?.at,d=Math.min(l??1/0,c!==null?uh(c):1/0),u=c!==null&&d===uh(c)&&c!==pr&&(re||c<136)&&(Dl||Wi&&Ll);if(Number.isFinite(d)&&d>n&&d<=r&&!u){let y=i.filter(m=>m===h);y.length?o.push({t:d,keys:y}):c!==null&&d===uh(c)&&Bl!==c&&o.push({t:d,keys:[],settle:c})}for(let y of i)if(y.startsWith("A:")){let m=al.find(p=>"A:"+p.title===y);if(m){let p=zv(m);p>n&&p<=r&&o.push({t:p,keys:[y]})}}let f=i.filter(y=>/^[LB]:/.test(y));if(f.length){let y=Uf().find(([v])=>v>n&&v<=r),m=y?y[0]:r,p=Mf(m),w=f.filter(v=>!p.has(v));if(w.length){let v=n,g=m;for(let R=0;R<9;R++){let P=(v+g)/2,b=Mf(P);w.some(M=>!b.has(M))?g=P:v=P}let _=Uf().find(([R,P])=>v>R&&v<P),S=Mf(Math.min(m,Math.max(g,v+xn.merge)));_||o.push({t:v,keys:w.filter(R=>!S.has(R))})}else if(y){let v=Mf(y[1]+.05),g=f.filter(_=>!v.has(_));g.length&&o.push({t:y[0],keys:g})}}if(!o.length)return null;o.sort((y,m)=>y.t-m.t);let x=o[0];for(let y of o.slice(1))y.t-x.t<xn.merge&&!Uf().some(([m])=>m>x.t&&m<=y.t)&&(x.keys=[...new Set([...x.keys,...y.keys])],y.settle!==void 0&&(x.chapter=y.settle),delete x.settle);return x.settle!==void 0&&x.keys.length&&delete x.settle,c!==null&&Math.abs(x.t-uh(c))<1e-6&&(x.chapter=c),x}function ZE(n,e){let t=Dn>0?e-Dn:0;return t>=1e3*xn.cap*kv()?!0:n.settle!==void 0?t>=1e3*xn.settle:n.keys.every(i=>{let s=Vi.get(i);return!s||s.gone||e-s.since>=Ch(s)})}function KE(n,e,t){if(!xh||Th||!vs)return xl=1,Mt=null,kl(!1),n+e*t;let i=performance.now();if(Mt&&ZE(Mt,i)){Bl=Mt.settle??Mt.chapter??Bl;let o=Dn;Mt=P_(n,t,i),Mt&&o&&Mt.t-n<xn.merge?(Mt.t=n+1e-4,Dn=o):Mt&&(Dn=0)}Mt||(Mt=P_(n,t,i));let s=1;if(Mt){let o=Math.max(0,Mt.t-n);s=Math.min(1,Math.sqrt(2*xn.brake*t*o)/t)}xl=Math.min(s,xl+xn.brake*e);let r=n+e*t*xl;return Mt&&r>=Mt.t-1e-4?(r=Math.max(n,Mt.t-1e-4),Dn||(Dn=i)):Dn=0,kl(!!Mt&&Dn>0&&i-Dn>350&&Mt.settle===void 0,i),na=Dn&&!Fn?Math.min(1,na+e/1.5):Math.max(0,na-e/.9),na>0?lp+=e:lp=0,r}function kl(n,e){let t=T("read-pause");if(n!==ap&&(!n&&document.activeElement===t&&T("play").focus({preventScroll:!0}),t.classList.toggle("on",n),t.tabIndex=n?0:-1,t.setAttribute("aria-hidden",String(!n)),ap=n),n){let i=Math.max(...Mt.keys.map(r=>{let o=Vi.get(r);return o?Ch(o)-(e-o.since):0}),0),s=Math.max(...Mt.keys.map(r=>{let o=Vi.get(r);return o?Ch(o):1}),1);t.style.setProperty("--p",(1-i/s).toFixed(3))}}var e0=()=>!!Mt&&Dn>0;function Vv(){let n=performance.now();for(let e of Vi.values())e.since=-1/0,Jg.add(e.seenKey);Mt&&(Bl=Mt.settle??Mt.chapter??Bl),Mt=null,kl(!1,n),Cl()}function D0(n,e=!1){n==="0"&&(n="off"),n!=="off"&&!jg[n]&&(n="normal"),Qg=n,xh=n!=="off",T("read-pace").value=n,xh?xn={...xn,...jg[n]}:(Mt=null,xl=1,kl(!1)),Ci(),e&&(Ln.set("readPace",n),On(xh?`Reading pauses: ${n}. Playback waits until text has been on screen long enough to read.`:"Reading pauses off: playback runs straight on.",2600))}function Gv(n){if(!hh){bh=!1;return}let e=n-vh,t=Math.max(0,Math.min(1/20,e/1e3||0));if(vh=n,zt&&!document.hidden&&ri==="auto"&&Gs!=="low"&&(In.skip>0?In.skip--:In.samples.push(e),n-In.checked>2e3)){In.checked=n;let r=In.samples.sort((o,a)=>o-a);if(r.length>20){let o=[...In.work].sort((c,h)=>c-h),a=o[o.length>>1]||0;if(In.strikes=r[r.length>>1]>24&&a>10?In.strikes+1:0,In.strikes>=2){let c=Qy[Qy.indexOf(Gs)+1];xp(c),oa=c,On(`Graphics lowered to ${br[c].label} to keep playback smooth. Change it under More.`,4e3)}}In.samples.length=0}if(zt&&!document.hidden&&!Ul){let r=KE(Ae,t,_s>1&&By(Ae)?1:_s),o=!1,a=null;pr!==null&&Ae>=pr&&(pr=null);let c=RE(Ae,r);c?(r=c.t,o=!0,vf=c):xs&&r>=xs[1]?(r=xs[0],Jf()):ch!==null&&Ae<ch&&r>=ch&&(xv?(r=yv,Jf()):(r=ch,o=!0));let h=_0(Ae);if(!o&&h!==null&&h!==pr&&(re||h<136)&&(Dl||Wi&&Ll)){let l=uh(h);Ae<l&&r>=l&&(r=l,Wi&&Ll?(Ul=!0,Fg=h,gv=Dl):a=h)}if(!re&&Ae<136&&r>=136?(Ae=136,yp()):(Ae=Math.min(Cn(re),r),Ae>=Cn(re)||o?gt(!1):a!==null&&(gt(!1,{hold:!0}),Sv(a))),vf){let l=vf;vf=null,CE(l)}rt=os(Ae,re||"rho"),$r=!0}$r&&(Kf(),g0(),$r=!1,or=!0),Go!==jr&&(Go+=(jr-Go)*(1-Math.exp(-t/.12)),Math.abs(Go-jr)<.001&&(Go=jr),or=!0);let i=Nt&&yt.update();i&&(or=!0),!Nt&&(or||aa)&&d0(),Math.abs(nv()/Fi-1)>.04&&($r=!0);let s=!1;(or||aa||xg)&&(Ke.updateMatrixWorld(),iv(),s=f0(Ff?1:t),YE(performance.now()),Ff=!1,cv(),kE(),x0(),or=!1),xg=s,R_&&!i&&Nt&&Ci(),R_=i,In.work.push(performance.now()-n),In.work.length>240&&In.work.splice(0,120),zt||aa||i||$r||or||xg||Go!==jr?requestAnimationFrame(Gv):(bh=!1,Gs==="low"&&(clearTimeout(Tg),Tg=setTimeout(cE,350)))}XE().catch(WE);})();
/*! For license information please see app.bundle.js.LEGAL.txt */
