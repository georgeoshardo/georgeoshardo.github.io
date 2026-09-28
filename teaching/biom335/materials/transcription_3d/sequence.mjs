// Teaching sequence: the single source of every base letter the animation shows.
// Material index n: n = 0 is the +1 start site. Promoter numbering has no position 0, so n = −1 is
// shown as '−1' and n = 0 as '+1'. RNA nucleotide j pairs with template base n = j.
// Upstream of +1 the non-template strand is the 4YLN promoter (chain 1, ids 11–47, n = id − 48:
// TTGACA at −35…−30, TATAAT at −12…−7, a 17-bp spacer). Everything else is an illustrative
// teaching sequence: seeded filler with the rut site, the pause hairpin, the error site and (on the
// intrinsic route) the terminator embedded where the timeline uses them. +1 = A is a declared choice.
// The transcript starts with a short gene: a ribosome-binding site (AGGAGG, nt 8–13), AUG at 20–22 and an
// in-frame UAA at 149–151, so a ribosome can translate it while RNAP is still transcribing. The rut site
// lies after the stop codon, in RNA that no ribosome covers, which is where Rho can load.
import {PAUSE_STEM,TERMINATOR,ADDITION,TRANSCRIPT,stemRange} from './cycle_state.mjs';

const UPSTREAM='ACTTGACATCCCACCTCACGTATGCTATAATGTGTGC';
// λtR1 rut RNA bound by Rho in PDB 8E6W, as DNA (sense strand).
const RUT='AACCCCGCTCTTACACATTCCAGCCCTGAAAAAGGGCATCAAATTAAACCACACCTAT';
export const RUT_START=160,RBS=[8,13],START_CODON=20,STOP_CODON=149;
const COMPLEMENT={A:'T',T:'A',G:'C',C:'G'};
// Deterministic filler, so every scrub and every page load shows the same letters.
function filler(n){let x=(n*2654435761+0x9e3779b9)>>>0;x^=x>>>16;x=Math.imul(x,0x7feb352d)>>>0;x^=x>>>15;x=Math.imul(x,0x846ca68b)>>>0;x^=x>>>16;return 'ACGT'[x&3]}
function features(path){
  const f=new Map(),put=(start,s)=>[...s].forEach((b,i)=>f.set(start+i,b));
  put(0,'A');put(RBS[0],'AGGAGG');put(START_CODON,'ATG');put(STOP_CODON,'TAA');put(RUT_START,RUT);
  // No stop codon in frame before UAA: an in-frame TAA, TAG or TGA in the filler becomes TAC or TGC.
  for(let c=START_CODON+3;c<STOP_CODON;c+=3){const codon=[0,1,2].map(i=>f.get(c+i)??filler(c+i)).join('');if(codon==='TAA'||codon==='TAG'||codon==='TGA')f.set(c+2,'C')}
  // Pause hairpin: a 5-bp GC stem around a UUCG loop, ending 12 nt from the 3′ end at 330 nt.
  const [p0,p1]=stemRange(PAUSE_STEM,330);put(p0,'GCCGC');put(p0+PAUSE_STEM.pairs,'TTCG');put(p1-PAUSE_STEM.pairs+1,'GCGGC');
  // Error site: the template reads A here, so U belongs in the RNA; RNAP misincorporates C.
  f.set(ERROR_SITE,'T');
  if(path==='intrinsic'){const [t0,t1]=stemRange(TERMINATOR,TRANSCRIPT.intrinsic);put(t0,'GCCCGCCTC');put(t0+TERMINATOR.pairs,'TTCGA');put(t1-TERMINATOR.pairs+1,'GAGGCGGGC');put(t1+1,'TTTTTTT')}
  return f;
}
export const ERROR_SITE=ADDITION.first+2;
const cache={};
function table(path){return cache[path]??=features(path)}
// Coding (non-template) strand, 5′→3′, same sequence as the RNA with T for U.
export function coding(n,path='rho'){n=Math.round(n);if(n<0&&n>=-UPSTREAM.length)return UPSTREAM[n+UPSTREAM.length];return table(path).get(n)??filler(n)}
export function template(n,path='rho'){return COMPLEMENT[coding(n,path)]}
export function rnaBase(j,path='rho'){const b=coding(j,path);return b==='T'?'U':b}
export function rnaSeq(from,to,path='rho'){let s='';for(let j=from;j<=to;j++)s+=rnaBase(j,path);return s}
export function codingSeq(from,to,path='rho'){let s='';for(let n=from;n<=to;n++)s+=coding(n,path);return s}
export const position=n=>n>=0?`+${n+1}`:String(n);
