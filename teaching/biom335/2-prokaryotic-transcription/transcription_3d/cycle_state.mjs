export const CHOICE_TIME=136,RISE=3.4,TRANSCRIPT={rho:440,intrinsic:392};
export const clamp=x=>Math.max(0,Math.min(1,x));
export const smooth=x=>{x=clamp(x);return x*x*(3-2*x)};
export const ramp=(t,a,b)=>smooth((t-a)/(b-a));
export const mix=(a,b,t)=>a+(b-a)*t;
export const endTime=path=>path==='intrinsic'?180:214;

// Abortive rounds make 5, 7 and 9 nt before each short RNA is released.
export const ABORTIVE={start:56,round:5,lengths:[5,7,9]};
// NusG binds at 86–88.5 s; before it, RNAP stutters, afterwards it accelerates.
export const ELONGATION={factors:84,nusG:88,wide:92,end:108};
// Nucleotide-addition close-up: approach, pairing, catalysis, PPi release and translocation.
export const ADDITION={start:109.2,cycle:3.9,count:3,first:320};
// Proofreading (Zenkin et al. 2006): the third added nucleotide is wrong (C opposite template A). The
// mismatched 3′ end stops RNAP stepping forward; it backtracks 1 bp and the active site cuts off the
// last two nucleotides, taking the error with them, before elongation resumes.
export const ERROR={cycle:2,j:ADDITION.first+2,wrong:'C'};
export const BACKTRACK={pause:121,start:121.8,end:124.6,cleave:125.4,resume:127.2,steps:1,cut:2,recovered:330};
// A pause hairpin folds in the RNA exit channel beside NusA, then unfolds so RNAP can resume.
// Stem–loops: the intrinsic terminator (9-bp stem, 5-nt loop, 8 nt from the 3′ end) and a smaller
// pause hairpin (5-bp stem, 4-nt loop, 12 nt from the 3′ end) that folds against NusA.
// Rho loads 25 nt into the rut site (sequence.mjs: rut 160–217, after the gene's stop codon).
export const RHO_LOAD=185;
export const TERMINATOR={pairs:9,loop:5,gap:8,approach:11,root:19},PAUSE_STEM={pairs:5,loop:4,gap:12,approach:8,root:15};
export function stemRange(h,N){const end=N-h.gap;return [end-2*h.pairs-h.loop+1,end]}
export const HAIRPIN_PAUSE={start:129.5,fold:[130.4,132],unfold:[133.8,134.8],resume:134.5};
// Promoter search (15–34 s), after the notes' proposed mechanisms: RNAP lands on another DNA segment,
// slides (1D diffusion), hops a short distance, transfers to the promoter DNA where the two segments pass
// close, slides a little and waits just upstream while the promoter is shown, then slides onto it. x is RNAP's
// position along D (Å, 0 = promoter); segment is 0 on the other duplex and 1 on the promoter DNA; lift is the hop height.
export const SEARCH={land:[15,17],slide:[17,20.5],hop:[20.5,22.5],transfer:[22.5,25],drift:[25,26.4],wait:[26.4,30.4],approach:[30.4,33],found:33,cross:-240,park:-228};
// Isomerisation: in the closed complex σ holds the upstream DNA and the DNA past it is only gently curved; then RNAP
// pulls the downstream DNA into its cleft, bending it sharply beside the −10 element, where the strained helix starts to melt.
// The terminator on each route: the DNA stretch it occupies (material n) and when it is shown, while RNAP is still
// just upstream of it. Intrinsic: the GC-rich inverted repeat and the U tract; Rho: where RNAP pauses for Rho.
// While a terminator is shown RNAP waits just upstream of it: on the intrinsic route it slows to a stop at hold[2] nt;
// on the Rho route the clock that moves RNAP lags by hold[3] s over hold[0..1] and catches up by hold[2].
export const TERMINATOR_ZONE={intrinsic:{n:[362,391],show:[136.2,137.2,139.2,140.6],hold:[136,138.6,346]},rho:{n:[424,446],show:[153.6,154.6,157.4,158.8],hold:[153.8,158.2,171,2.6]}};
export const BEND={chapter:39.5,cut:[39.2,40.2],bend:[40.2,44],strain:42.6};
export function searchAt(t){
 if(t<SEARCH.land[0]||t>=34)return null;const S=SEARCH,hop=ramp(t,...S.hop),wiggle=(a,b,amp,f)=>amp*Math.sin(2*Math.PI*f*(t-a))*Math.sin(Math.PI*clamp((t-a)/(b-a)));
 const x=mix(-150,mix(-300,-266,hop),ramp(t,S.land[0],S.land[1]+.3))+mix(0,S.cross+266,ramp(t,...S.transfer))+mix(0,S.park-S.cross,ramp(t,...S.drift))+mix(0,-S.park,ramp(t,S.approach[0]-.2,S.found+.8))+wiggle(...S.slide,20,.5)+wiggle(S.drift[0],S.approach[1],3,.45);
 return {x,lift:28*Math.sin(Math.PI*clamp((t-S.hop[0])/(S.hop[1]-S.hop[0]))),land:1-ramp(t,...S.land),segment:ramp(t,S.transfer[0]+.8,S.transfer[1])};
}

export const commonChapters=[
 {start:0,nav:'Core enzyme',topic:'RNA polymerase',title:'Assembling<br>the core enzyme.',copy:'Two α subunits form an assembly scaffold. The β and β′ subunits form the catalytic machinery and the channels for DNA, NTPs and RNA; ω is also part of the bacterial core. The flexible α C-terminal domains can also contact promoter DNA.',notes:'bacterial-rna-polymerase-consists-of-multiple-subunits'},
 {start:9,nav:'Sigma binding',topic:'Holoenzyme formation',title:'Sigma gives the core<br>promoter specificity.',copy:'A σ70 factor associates with the core enzyme. The resulting holoenzyme can recognise the promoter sequences used by many growing-cell genes; σ also weakens binding to random DNA about 1000-fold.',notes:'sigma-factors'},
 {start:SEARCH.land[0],nav:'Promoter search',topic:'Finding a promoter',title:'Searching the DNA<br>for a starting point.',copy:'RNAP encounters DNA and samples potential binding sites. Sliding, hopping and transfer between nearby DNA segments are proposed search mechanisms.',notes:'how-does-rnap-find-the-promoter'},
 {start:SEARCH.wait[0],nav:'The promoter',topic:'Where transcription starts',title:'A promoter is<br>a stretch of DNA.',copy:'RNAP has reached the DNA that carries the promoter, the sequence at the beginning of a gene where transcription starts. The holoenzyme recognises its −35 and −10 elements; +1 is the first base pair transcribed.',notes:'sigma-factors-control-binding-to-dna-by-recognising-promoter-sequences'},
 {start:34,nav:'Closed complex',topic:'Promoter recognition',title:'Bound, but the DNA<br>is still closed.',copy:'Sigma recognises promoter elements, including the −35 and −10 regions. In the closed complex, the DNA remains double-stranded.',notes:'sigma-factors-control-binding-to-dna-by-recognising-promoter-sequences'},
 {start:BEND.chapter,nav:'Bending the DNA',topic:'Opening the DNA',title:'Bending the DNA<br>helps unwind it.',copy:'RNAP pulls the downstream DNA into its cleft and bends it sharply beside the −10 element. The bend strains the double helix; at the −10 element the strain helps it unwind.',notes:'initiation'},
 {start:44,nav:'Open complex',topic:'Opening the DNA',title:'The promoter opens<br>around the start site.',copy:'Local strand separation exposes the template strand, which RNAP reads 3′ → 5′. The other, non-template (coding) strand has the same sequence as the RNA, with T in place of U.',notes:'initiation'},
 {start:56,nav:'Abortive initiation',topic:'Initial RNA synthesis',title:'Short attempts<br>before escape.',copy:'RNAP can synthesise and release several short RNAs while retaining its promoter contacts. These are abortive initiation events.',notes:'initiation'},
 {start:72,nav:'Promoter escape',topic:'Transition to elongation',title:'RNAP clears<br>the promoter.',copy:'A transcript of about 10–12 nucleotides accompanies promoter escape. Sigma–core contacts weaken and released sigma can bind another core enzyme; NusA can compete with sigma for the core. Some complexes retain sigma.',notes:'the-sigma-cycle'},
 {start:84,nav:'Elongation factors',topic:'NusA and NusG',title:'Elongation factors<br>join the core.',copy:[{at:84,text:'NusA binds beside the RNA exit channel and enhances pausing at RNA hairpins. Without NusG, RNAP pauses often.'},{at:86.2,text:'NusG binds across the DNA channel: it reduces pausing, raising the overall rate. NusG can also link RNAP to the ribosome and to Rho.'}],notes:'elongation-factors-nusa-and-nusg'},
 {start:92,nav:'Elongation',topic:'Processive RNA synthesis',title:'The transcript<br>keeps growing.',copy:'RNAP moves downstream. DNA opens in front and rewinds behind, while new ribonucleotides are added to the RNA’s 3′ end.',notes:'elongation'},
 {start:108,nav:'Nucleotide addition',topic:'The chemical step',title:'One nucleotide<br>at a time.',copy:'An NTP, thought to enter through the secondary channel, pairs with the template base. The RNA 3′–OH attacks its α phosphate; the β and γ phosphates leave as pyrophosphate and RNAP translocates by one base pair.',notes:'the-mechanism-of-nucleotide-addition'},
 {start:121,nav:'Proofreading',topic:'Pausing and backtracking',title:'A wrong nucleotide,<br>a step back, a clean cut.',copy:'Rarely, RNAP adds a wrong nucleotide. The mismatched 3′ end stalls the enzyme, which slides back so the error enters the secondary channel. The active site then cuts off the last two nucleotides, taking the error with them, and elongation resumes. Long pauses can also make RNAP backtrack without an error.',notes:'elongation'},
 {start:129.5,nav:'Hairpin pause',topic:'NusA at work',title:'NusA holds RNAP<br>at an RNA hairpin.',copy:'An RNA hairpin folding in the exit channel can hold RNAP in a pause. NusA, bound beside the exit, stabilises the hairpin and lengthens the pause. The same activity helps intrinsic termination.',notes:'elongation-factors-nusa-and-nusg'}
];
export const rhoChapters=[
 {start:136,nav:'Rho loading',topic:'Rho-dependent termination',title:'Rho loads far behind<br>the polymerase.',copy:'Past the gene’s stop codon no ribosome covers the RNA, so an exposed rut region lets Rho load, far behind RNAP.',copyUncoupled:'Rho loads on the rut site, an exposed, C-rich stretch of RNA far behind RNAP. Ribosomes cover the gene’s RNA up to its stop codon; the rut lies beyond it.',notes:'rho-dependent-terminators'},
 {start:146,nav:'Rho traversal',topic:'ATP-dependent translocation',title:'Follow Rho<br>along the RNA.',copy:'Using ATP, Rho advances 5′ → 3′ along the transcript while RNAP keeps extending the RNA’s 3′ end.',notes:'rho-dependent-terminators'},
 {start:180,nav:'Rho engagement',topic:'A favourable pause',title:'The motor reaches<br>the elongation complex.',copy:'A polymerase pause favours engagement: Rho catches up with RNAP, and NusG can connect the two.',notes:'rho-dependent-terminators'},
 {start:190,nav:'RNA release',topic:'Termination',title:'RNA is released<br>and DNA rewinds.',copy:'The elongation complex is destabilised. The RNA–DNA hybrid separates and the DNA strands rejoin. Polymerase dissociation is one possible outcome.',notes:'transcription-termination'},
 {start:200,nav:'Recycling',topic:'Enzyme recycling',title:'The core enzyme<br>is free again.',copy:'The released core RNAP can bind a free σ factor, forming a new holoenzyme that can initiate at another promoter.',notes:'the-sigma-cycle'}
];
export const intrinsicChapters=[
 {start:136,nav:'Intrinsic terminator',topic:'Intrinsic termination',title:'The RNA encodes<br>its own stop signal.',copy:'A GC-rich inverted repeat is followed by a U-rich tract. The transcript can fold into a hairpin without requiring Rho. The U-rich RNA–DNA hybrid is held by weak rU·dA pairs and comes apart easily.',notes:'intrinsic-terminators'},
 {start:142,nav:'Hairpin formation',topic:'An RNA stem–loop',title:'The hairpin folds<br>beside the RNA exit.',copy:'Complementary RNA segments pair to form the stem. Hairpin formation and the U-rich RNA–DNA hybrid promote pausing and destabilisation; NusA can assist.',notes:'intrinsic-terminators'},
 {start:154,nav:'RNA release',topic:'Intrinsic termination',title:'The hybrid gives way.<br>The transcript leaves.',copy:'RNA is released as the transcription bubble rewinds. Rho is absent from this pathway.',notes:'intrinsic-terminators'},
 {start:166,nav:'Recycling',topic:'Enzyme recycling',title:'Ready for<br>another transcript.',copy:'The released core RNAP can associate with σ again and initiate at another promoter.',notes:'the-sigma-cycle'}
];
// Chapter copy is a string, or timed parts [{at,text}] for chapters with more than one idea.
export function copyAt(chapter,t){const c=chapter.copy;if(typeof c==='string')return c;let text=c[0].text;for(const p of c)if(t>=p.at)text=p.text;return text}
export const copyText=chapter=>typeof chapter.copy==='string'?chapter.copy:chapter.copy.map(p=>p.text).join(' ');
export const slug=text=>text.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
// Acts follow the notes' three stages of transcription, framed by building the enzyme and recycling it.
export const ACTS=[
 {start:0,numeral:'Prologue',title:'The enzyme',sub:'Building RNA polymerase'},
 {start:15,numeral:'I',title:'Initiation',sub:'Finding and opening a promoter'},
 {start:ELONGATION.factors,numeral:'II',title:'Elongation',sub:'The bubble travels with RNAP'},
 {start:CHOICE_TIME,card:CHOICE_TIME+.3,numeral:'III',title:'Termination',sub:{rho:'A motor catches the polymerase',intrinsic:'The RNA encodes its own stop'}},
 {start:{rho:200,intrinsic:166},numeral:'Coda',title:'Recycling',sub:'The core enzyme is free again'}
];
export const actStart=(act,path)=>typeof act.start==='number'?act.start:act.start[path==='intrinsic'?'intrinsic':'rho'];
export function actAt(t,path){let i=0;ACTS.forEach((a,k)=>{if(t>=actStart(a,path))i=k});return i}
// Named beats: [time, short name, one-sentence description]. Times come from the timeline
// constants, so retiming a stage keeps the text description, stepping and tooltips in sync.
const addStep=(cycle,f)=>+(ADDITION.start+ADDITION.cycle*(cycle+f)).toFixed(2);
const additionBeats=[0,1,2].flatMap(c=>c===ERROR.cycle?[
 [addStep(c,0),'Wrong nucleotide','A CTP enters instead of the UTP that pairs with this template A.'],
 [addStep(c,.3),'Mispairs','The C cannot pair properly with the template A, but it is held in the active site.'],
 [addStep(c,.47),'Bond forms anyway','Rarely, catalysis happens anyway: the wrong nucleotide is joined to the RNA.'],
 [addStep(c,.6),'PPi leaves','Pyrophosphate is released, as for a correct nucleotide.'],
 [addStep(c,.72),'Mismatched end','The mismatched 3′ end stops RNAP from stepping forward.']]:[
 [addStep(c,0),c===0?'NTP enters':'Next NTP','An NTP, thought to enter through the secondary channel, moves towards the active site.'],
 [addStep(c,.3),'Base pairs','Its base pairs with the next template base; the trigger loop folds over it.'],
 [addStep(c,.47),'Bond forms','The RNA 3′–OH attacks the NTP’s α phosphate, forming a phosphodiester bond with help from Mg²⁺.'],
 [addStep(c,.56),'PPi leaves','The β and γ phosphates leave as pyrophosphate.'],
 [addStep(c,.7),'Translocates','RNAP moves one base pair downstream, freeing the site for the next NTP.']]);
const abortiveBeats=ABORTIVE.lengths.flatMap((n,k)=>[[ABORTIVE.start+ABORTIVE.round*k,`Attempt ${k+1} · ${n} nt`,`RNAP makes a ${n}-nt RNA, pulling downstream DNA into itself (scrunching) while it keeps hold of the promoter.`],
 [+(ABORTIVE.start+ABORTIVE.round*(k+.64)).toFixed(2),'Released',`The ${n}-nt RNA is released and the scrunched DNA springs back; RNAP starts again.`]]);
// Coupled-translation timings (see ribosomeAt below).
export const RIBOSOME={appear:93,join:94.2,follow:[95,97.5],stop:149,split:[100.4,101.6],gone:[102.6,104],contact:[95,96.6,100.3,101.8],gap:33};
export const BEATS={
 common:[
  [0,'α₂ scaffold','Two α subunits come together: the scaffold on which the core enzyme assembles.'],
  [2.5,'β joins','The β subunit joins the α dimer.'],
  [5,'β′ and ω join','β′ and the small ω subunit complete the core enzyme, α₂ββ′ω.'],
  [9,'σ70 approaches','A free σ70 factor approaches the core enzyme.'],
  [14.5,'Holoenzyme','σ70 is bound: the holoenzyme can recognise promoters.'],
  [SEARCH.land[0],'Searching','The holoenzyme binds DNA non-specifically, on a segment far from the promoter.'],
  [SEARCH.slide[0],'Sliding','It slides back and forth along the DNA: one-dimensional diffusion.'],
  [SEARCH.hop[0],'Hopping','It lets go briefly and rebinds a short distance away.'],
  [SEARCH.transfer[0],'Intersegment transfer','Where two DNA segments pass close, RNAP bridges them and moves onto the promoter DNA.'],
  [SEARCH.drift[0],'Sliding again','It slides along the promoter DNA towards the promoter.'],
  [SEARCH.wait[0],'The promoter','Just ahead of RNAP: the −35 and −10 elements lie upstream of the +1 start site.'],
  [SEARCH.approach[0],'Onto the promoter','RNAP slides the last stretch onto the promoter.'],
  [SEARCH.found,'Promoter found','σ recognises the −10 and −35 elements as the DNA settles into the holoenzyme.'],
  [34,'Closed complex','In the closed complex σ holds −35 and −10; the DNA is still double stranded.'],
  [BEND.chapter,'DNA bends','RNAP pulls the downstream DNA into its cleft, bending it sharply beside the −10 element.'],
  [BEND.strain,'Strain unwinds','The bend strains the helix, which starts to unwind at the −10 element.'],
  [44,'DNA melts','The DNA unwinds around the start site, opening the transcription bubble.'],
  [47,'Template exposed','The template strand is single stranded in the active site, ready to be read 3′ → 5′.'],
  ...abortiveBeats,
  [71,'Productive start','This time the RNA keeps growing.'],
  [77,'≈10 nt · escape','At about 10–12 nt, RNAP lets go of the promoter and moves downstream.'],
  [78,'σ70 released','σ70 leaves the core and can bind another core enzyme.'],
  [81.5,'NusA arrives','NusA binds beside the RNA exit channel.'],
  [ELONGATION.factors,'Frequent pauses','Without NusG, RNAP pauses often.'],
  [85,'NusG binds','NusG binds across the DNA channel.'],
  [ELONGATION.nusG,'Fewer pauses','With NusG, pauses are fewer and shorter, so the overall rate rises.'],
  [ELONGATION.wide,'Processive elongation','RNAP moves downstream, opening DNA ahead and rewinding it behind, as the RNA lengthens.'],
  [ELONGATION.end,'Active site','A close look inside the active site.'],
  ...additionBeats,
  [BACKTRACK.pause,'Stalled','RNAP stalls at the mismatched 3′ end.'],
  [BACKTRACK.start,'Backtrack 1 bp','RNAP slides back one base pair, so the error moves into the secondary channel.'],
  [BACKTRACK.cleave,'Cleavage','The active site cuts off the last two nucleotides, taking the error with them.'],
  [BACKTRACK.resume,'Elongation resumes','Transcription continues from a correct 3′ end.'],
  [HAIRPIN_PAUSE.start,'Pause site','RNAP reaches a pause site.'],
  [HAIRPIN_PAUSE.fold[0],'Hairpin folds','An RNA hairpin folds in the exit channel; NusA stabilises it and RNAP stays paused.'],
  [HAIRPIN_PAUSE.unfold[0],'Hairpin unfolds','The hairpin unfolds and RNAP can move again.'],
  [HAIRPIN_PAUSE.resume,'Resumes','Elongation resumes.']
 ],
 rho:[
  [CHOICE_TIME,'Rho loads','Rho binds the rut site on the older, unstructured part of the RNA.'],
  [146,'Rho translocates','Using ATP, Rho moves 5′ → 3′ along the RNA towards RNAP.'],
  [172,'RNAP pauses','RNAP pauses, which gives Rho time to catch up.'],
  [178,'Rho engages','Rho reaches the polymerase; NusG can bridge the two.'],
  [191,'RNA released','The RNA is pulled away, the hybrid separates and the DNA rewinds.'],
  [200,'Recycling','The free core enzyme can bind σ again.']
 ],
 intrinsic:[
  [CHOICE_TIME,'Terminator made','RNAP transcribes a GC-rich inverted repeat followed by a U-rich tract.'],
  [142,'Hairpin folds','The inverted repeat folds into a stem–loop at the RNA exit, with NusA assisting.'],
  [153,'Weak hybrid','The hairpin and the weak rU·dA hybrid destabilise the elongation complex.'],
  [155,'RNA released','The RNA is released and the bubble collapses.'],
  [166,'Recycling','The free core enzyme can bind σ again.']
 ]
};
// Beats of the optional coupled ribosome, merged in only when it is shown.
const COUPLING_BEATS=[
 [RIBOSOME.appear,'Ribosome binds','A ribosome binds the ribosome-binding site and starts translating at AUG while the RNA is still being made.'],
 [RIBOSOME.contact[1],'Coupled','NusG’s KOW domain links RNAP to the ribosome (uS10), so the two machines move together.'],
 [+(RIBOSOME.split[0]-.6).toFixed(2),'Stop codon','The ribosome reaches the UAA stop codon.'],
 [RIBOSOME.split[0],'Ribosome splits','The short peptide is released and the ribosome splits; NusG lets go of it.']];
export const beatsFor=(path,coupled=false)=>{const list=[...BEATS.common,...BEATS[path==='intrinsic'?'intrinsic':'rho']];return coupled?[...list,...COUPLING_BEATS].sort((a,b)=>a[0]-b[0]):list};
export function beatAt(t,path,coupled=false){const list=beatsFor(path,coupled);let i=0;for(let k=0;k<list.length;k++)if(t>=list[k][0]-1e-6)i=k;return i}
// Predict-then-watch checkpoints (only with Predict on). Each halts playback just before the next
// shot's camera blend, asks a question the next few seconds answer, then plays the answer. Written
// for this animation from the lecture notes; they are not assessment items.
export const CHECKPOINTS=[
 {id:'search',t:14.1,q:'RNAP must find one promoter among ~4.6 million base pairs. In the notes’ model, how does it search?',options:['It binds DNA anywhere, then slides along it and transfers between nearby segments','It reads every base pair in order from one end of the genome','It waits at one site until a promoter drifts past'],answer:0,why:'The notes describe non-specific binding, then sliding and intersegment transfer (with hopping): proposed ways to search locally and move between nearby DNA.',notes:'how-does-rnap-find-the-promoter'},
 {id:'sigma',t:33.6,q:'Which part of the holoenzyme will recognise the −35 and −10 elements?',options:['σ70','β′','ω','NusA'],answer:0,why:'σ gives the core promoter specificity: region 4 reads −35 and region 2 reads −10.',notes:'sigma-factors-control-binding-to-dna-by-recognising-promoter-sequences'},
 {id:'template',t:55.4,kind:'pick',q:'Which strand will RNAP read? Click it in the 3D view, or choose below.',options:['The template strand (blue)','The coding strand (ivory)'],answer:0,pick:'template',why:'RNAP reads the template strand 3′ → 5′; the RNA matches the coding strand, with U for T.',notes:'transcription-occurs-by-base-pairing-in-a-bubble-of-unpaired-dna'},
 {id:'clearance',t:70.6,q:'About how long must the RNA be before RNAP clears the promoter?',options:['2–3 nucleotides','About 10–12 nucleotides','About 100 nucleotides'],answer:1,why:'Shorter RNAs are often released (abortive initiation); a transcript of about 10–12 nt accompanies promoter escape.',notes:'the-sigma-cycle'},
 {id:'nusg',t:83,q:'NusG is about to bind. What will it do?',options:['Reduce pausing, raising the overall rate','Replace σ as the promoter-recognition factor','Stop transcription at the next hairpin'],answer:0,why:'NusG is an anti-pausing factor: fewer, shorter pauses raise the overall rate. NusA does the opposite at hairpins.',notes:'elongation-factors-nusa-and-nusg'},
 {id:'coupling',t:90.2,q:'Besides RNAP, which machine can NusG also link to?',options:['The ribosome','DNA polymerase','The spliceosome'],answer:0,why:'NusG can couple RNAP to the ribosome translating the same RNA, and it can also contact Rho.',notes:'elongation-factors-nusa-and-nusg'},
 {id:'oh',t:106.3,q:'Which group attacks the incoming NTP to join it to the RNA?',options:['The RNA 3′–OH','The RNA 5′ phosphate','The 2′–OH of the NTP'],answer:0,why:'RNA grows 5′ → 3′: the 3′–OH at the end of the chain attacks the NTP’s α phosphate.',notes:'the-mechanism-of-nucleotide-addition'},
 {id:'ppi',t:111,q:'Which phosphates will leave as the bond forms?',options:['β and γ, as pyrophosphate','α and β','Only γ'],answer:0,why:'The α phosphate stays in the phosphodiester bond; β and γ leave together as pyrophosphate.',notes:'the-mechanism-of-nucleotide-addition'},
 {id:'error',t:120.95,q:'RNAP has just added a wrong nucleotide. What will it do?',options:['Back up and cut off the RNA end that carries the error','Keep going; the error stays in the RNA','Release the RNA and stop'],answer:0,why:'The mismatched end stalls RNAP; it backtracks and its active site cleaves off the error with the adjacent nucleotide.',notes:'elongation'},
 {id:'nusa',t:128.2,q:'An RNA hairpin is about to fold in the exit channel. Which factor will lengthen this pause?',options:['NusA','NusG','σ70'],answer:0,why:'NusA, beside the RNA exit, stabilises hairpins and enhances pausing.',notes:'elongation-factors-nusa-and-nusg'},
 {id:'rho-direction',t:145.8,path:'rho',q:'Rho has loaded on the rut site. Which way will it move?',options:['5′ → 3′, towards RNAP','3′ → 5′, away from RNAP','It stays where it loaded'],answer:0,why:'Rho’s ATPase drives it 5′ → 3′ along the RNA until it catches up with the polymerase.',notes:'rho-dependent-terminators'},
 {id:'bridge',t:178.5,path:'rho',q:'Which factor can bridge Rho and RNAP?',options:['NusG','NusA','σ70'],answer:0,why:'NusG binds RNAP and can also contact Rho, helping termination.',notes:'rho-dependent-terminators'},
 {id:'repeat',t:141.2,path:'intrinsic',q:'What will the GC-rich inverted repeat in the new RNA do?',options:['Fold back on itself into a hairpin','Pair with the coding strand','Bind Rho'],answer:0,why:'The two halves of an inverted repeat are complementary, so the RNA folds into a stem–loop.',notes:'intrinsic-terminators'},
 {id:'protein',t:152.4,path:'intrinsic',q:'Does this RNA need a protein to be released?',options:['No: the hairpin and the weak U-rich hybrid are enough (NusA can help)','Yes: Rho must reach RNAP','Yes: σ must rebind first'],answer:0,why:'Intrinsic terminators depend only on the RNA: the hairpin forms and the rU·dA hybrid comes apart.',notes:'intrinsic-terminators'}
];
// Asked inside the ending choice, when Predict is on.
export const CHOICE_QUESTION={id:'atp',q:'Which ending needs an ATP-driven protein?',options:['Rho-dependent','Intrinsic'],answer:0,why:'Rho uses its C-terminal ATPase to move along the RNA; intrinsic termination needs no protein.'};
export const checkpointsFor=path=>CHECKPOINTS.filter(c=>!c.path||c.path===path);
// End-of-cycle recap: the stages in order.
export const RECAP=[['Closed complex',34],['Open complex',44],['Abortive initiation',56],['Promoter clearance',72],['Elongation',92],['Termination',136]];
// Equivalent stages of the two endings, so switching keeps the viewer at the same point in the story.
const STAGES={rho:[136,146,180,190,200,214],intrinsic:[136,142,148,154,166,180]};
export function stageMap(t,from,to){const a=STAGES[from],b=STAGES[to];if(!a||!b||t<CHOICE_TIME)return t;for(let i=1;i<a.length;i++)if(t<=a[i])return b[i-1]+(b[i]-b[i-1])*(t-a[i-1])/(a[i]-a[i-1]);return b.at(-1)}
// Coupled translation (schematic) during the elongation time-lapse: a ribosome assembles on the
// ribosome-binding site, follows ~33 nt behind the RNA 3′ end, stops at UAA (nt 149–151), releases a
// short peptide and splits, all before the 108 s close-up. NusG's KOW domain links it to RNAP meanwhile.
export function ribosomeAt(t){
 if(t<RIBOSOME.appear||t>RIBOSOME.gone[1])return null;const R=RIBOSOME,n=cycleState(t,'rho').ntCount;
 const j=Math.min(R.stop+1,mix(21,n-R.gap,ramp(t,...R.follow)));
 return {j,small:ramp(t,R.appear,R.appear+1),large:ramp(t,R.join,R.join+.9),split:ramp(t,...R.split),fade:1-ramp(t,...R.gone),kow:ramp(t,R.contact[0],R.contact[1])*(1-ramp(t,R.contact[2],R.contact[3])),peptide:clamp((j-21)/3/43)*(1-ramp(t,R.split[0],R.gone[0]))};
}
// Chemistry windows play at 1× even when the movie is sped up: catalysis in each addition cycle and the cut.
export function inChemistry(t){const p=t>=ADDITION.start&&t<BACKTRACK.pause?additionPhase(t):null;return !!(p&&p.f>=.25&&p.f<=.7)||Math.abs(t-BACKTRACK.cleave)<.6}
// Cubic Hermite from (t0,y0,slope m0) to (t1,y1,slope m1); slopes are per second.
const hermite=(t,t0,t1,y0,y1,m0,m1)=>{const d=t1-t0,u=Math.max(0,Math.min(1,(t-t0)/d)),u2=u*u,u3=u2*u;return (2*u3-3*u2+1)*y0+(u3-2*u2+u)*d*m0+(-2*u3+3*u2)*y1+(u3-u2)*d*m1};
export function chaptersFor(path){return [...commonChapters,...(path==='intrinsic'?intrinsicChapters:rhoChapters)]}
export function additionPhase(t){
 if(t<ADDITION.start)return null;const x=(t-ADDITION.start)/ADDITION.cycle,cycle=Math.floor(x);
 return cycle<ADDITION.count?{cycle,f:x-cycle}:null;
}
// NusA takes over from σ at escape; NusG binds as elongation starts. Both stay until release,
// except that NusA leaves the Rho route before Rho reaches the RNA exit it occupies.
// The active weights highlight each factor while it is doing its job on screen.
export function factorPresence(t,path){
 const intrinsic=path==='intrinsic';
 const nusA=ramp(t,81.5,85.5)*(1-(intrinsic?ramp(t,156,161):ramp(t,168,173)));
 const nusG=ramp(t,85,88.5)*(1-(intrinsic?ramp(t,155,160):ramp(t,191,196)));
 const nusAActive=Math.max(ramp(t,82.5,84)*(1-ramp(t,86,87.5)),ramp(t,130.8,131.6)*(1-ramp(t,134,135)),intrinsic?ramp(t,143,145)*(1-ramp(t,152,154)):0);
 const nusGActive=Math.max(ramp(t,86,87.5)*(1-ramp(t,91,92)),intrinsic?0:ramp(t,180,182)*(1-ramp(t,188,190)));
 return {nusA,nusG,nusAActive,nusGActive};
}
// The cutaway follows the close-up shots: it opens as the camera moves in and closes once it has
// moved away, so scrubbing into a close-up never shows it half formed.
export function cutawayAt(t,path){
 return ramp(t,...BEND.cut)*(1-ramp(t,72,73.2))+ramp(t,107.4,108.4)*(1-ramp(t,HAIRPIN_PAUSE.start,HAIRPIN_PAUSE.start+1.2))+(path==='intrinsic'?ramp(t,141.4,142.4)*(1-ramp(t,154,155.5)):0);
}
// How much slower than a cell each stretch plays at 1× (cells add ~40–50 nt/s), or why no rate applies.
const SCALE_WINDOWS={common:[[84,88],[88,92],[92,108],[108,121],[BACKTRACK.resume,HAIRPIN_PAUSE.start],[HAIRPIN_PAUSE.resume,CHOICE_TIME]],rho:[[136,172]],intrinsic:[[136,142]]};
const scaleCache={};
export function timeScale(t,path='rho'){
 if(t<ELONGATION.factors)return {text:'Initiation · timing not to scale'};
 // Before NusG the slow growth is real pausing, so the playback factor comes from the window after NusG binds.
 if(t<ELONGATION.nusG){const f=timeScale(ELONGATION.nusG,path).factor;return {text:`Slowed ≈${f}× · without NusG, RNAP pauses more`,factor:f}}
 if((t>=BACKTRACK.pause&&t<BACKTRACK.resume)||(t>=HAIRPIN_PAUSE.start&&t<HAIRPIN_PAUSE.resume)||(path==='rho'&&t>=172&&t<190))return {text:'RNAP paused'};
 const w=[...SCALE_WINDOWS.common,...SCALE_WINDOWS[path==='intrinsic'?'intrinsic':'rho']].find(([a,b])=>t>=a&&t<b);
 if(!w)return {text:'Termination · timing not to scale'};
 const key=path+w[0];if(!(key in scaleCache)){const grow=cycleState(w[1]-1e-6,path).ntCount-cycleState(w[0],path).ntCount,rate=grow/(w[1]-w[0]),n=45/rate;scaleCache[key]=+n.toPrecision(2)}
 return {text:`Slowed ≈${scaleCache[key]}× · cells add 40–50 nt/s`,factor:scaleCache[key]};
}
export function cycleState(time,path='rho'){
 const t=Math.max(0,Math.min(endTime(path),time));
 // length: RNA nucleotides made. register: position of the RNA 3′ end on the template, so the
 // nucleotide j sits (j − register) bp from the active site. catchUp is 0 while RNAP scrunches
 // DNA at the promoter and 1 once it moves with the transcript.
 let length=0,register=0,catchUp=1,fragment=null,cleavage=0;
 if(t>=ABORTIVE.start&&t<71){
   const x=(t-ABORTIVE.start)/ABORTIVE.round,k=Math.floor(x),f=x-k,M=ABORTIVE.lengths[k];
   if(f<.64){length=M*smooth((f-.03)/.52);register=Math.max(0,length-1)}
   else{register=(M-1)*(1-ramp(f,.64,.86));fragment={offsets:Array.from({length:M},(_,i)=>i-(M-1)),shift:(M+15)*ramp(f,.66,.95),fade:1-ramp(f,.85,.97)}}
   catchUp=0;
 }else if(t>=71&&t<84){length=22*ramp(t,71,84);register=Math.max(0,length-1);catchUp=ramp(t,77,83)}
 else if(t>=ELONGATION.factors&&t<ELONGATION.end){
   // Before NusG: short bursts and stalls. With NusG: steady, modestly faster growth (~3.5 nt/s).
   // From 92 s the movie itself speeds up (a time-lapse); RNAP's real rate does not change.
   length=t<ELONGATION.nusG?22+2*ramp(t,84.3,85.3)+2*ramp(t,86.2,87.2):t<ELONGATION.wide?hermite(t,ELONGATION.nusG,ELONGATION.wide,26,40,0,3.5):hermite(t,ELONGATION.wide,ELONGATION.end,40,ADDITION.first,3.5,0);register=length-1;
 }else if(t>=ELONGATION.end&&t<BACKTRACK.pause){
   // The misincorporated nucleotide (the error cycle) leaves a mismatched end, so RNAP does not translocate.
   const phase=additionPhase(t),done=phase?phase.cycle:t>=ADDITION.start?ADDITION.count:0,f=phase?phase.f:0;
   length=ADDITION.first+done+ramp(f,.5,.6);register=ADDITION.first-1+Math.min(done,ERROR.cycle)+(phase&&phase.cycle<ERROR.cycle?ramp(f,.7,.95):0);
 }else if(t>=BACKTRACK.pause&&t<HAIRPIN_PAUSE.start){
   const top=ADDITION.first+ADDITION.count,c=BACKTRACK.cleave,kept=top-BACKTRACK.cut;
   if(t<c){length=top;register=top-2-BACKTRACK.steps*ramp(t,BACKTRACK.start,BACKTRACK.end)}
   else{
     length=t<BACKTRACK.resume?kept:mix(kept,BACKTRACK.recovered,ramp(t,BACKTRACK.resume,HAIRPIN_PAUSE.start));register=length-1;
     if(t<c+3.1)fragment={offsets:Array.from({length:BACKTRACK.cut},(_,i)=>i+1),shift:14*ramp(t,c+.1,c+2.6),fade:1-ramp(t,c+1.8,c+3.1)};
   }
   cleavage=ramp(t,c-.4,c)*(1-ramp(t,c,c+.7));
 }else if(t>=HAIRPIN_PAUSE.start&&t<CHOICE_TIME){length=t<HAIRPIN_PAUSE.resume?BACKTRACK.recovered:mix(BACKTRACK.recovered,340,ramp(t,HAIRPIN_PAUSE.resume,CHOICE_TIME));register=length-1}else if(t>=CHOICE_TIME){const h=TERMINATOR_ZONE.intrinsic.hold;length=path==='intrinsic'?(t<h[1]?mix(340,h[2],ramp(t,h[0],h[1])):mix(h[2],TRANSCRIPT.intrinsic,ramp(t,h[1],142))):mix(340,TRANSCRIPT.rho,ramp(t-TERMINATOR_ZONE.rho.hold[3]*(ramp(t,TERMINATOR_ZONE.rho.hold[0],TERMINATOR_ZONE.rho.hold[1])-ramp(t,TERMINATOR_ZONE.rho.hold[1],TERMINATOR_ZONE.rho.hold[2])),136,172));register=length-1}
 const search=searchAt(t),distance=t<SEARCH.land[0]?-150:search?search.x:RISE*register*catchUp;
 const scrunch=t<34?0:Math.max(0,register-distance/RISE);
 const release=path==='intrinsic'?ramp(t,155,163):ramp(t,191,198);
 const recycling=path==='intrinsic'?ramp(t,166,178):ramp(t,200,212);
 // Melting begins as the bend completes, quickly at first, and the bubble is fully open by 53 s.
 const open=(1-(1-clamp((t-42.4)/10.6))**2)*(1-release),grip=ramp(t,34,38)*(1-release),bend=ramp(t,...BEND.bend);
 // Upstream DNA docks on the promoter path (−35 on σ region 4) and is let go as σ is released.
 const init=ramp(t,31,38)*(1-ramp(t,76,84));
 const rhoIndex=path==='rho'&&t>=136?mix(RHO_LOAD,length-27,ramp(t,146,180)):0;
 const rhoEngage=path==='rho'?ramp(t,178,186):0;
 const hairpin=path==='intrinsic'?ramp(t,142,153):0;
 // The wrong nucleotide exists from its catalysis until the released dinucleotide has left.
 const errorStart=ADDITION.start+ADDITION.cycle*(ERROR.cycle+.5),error=ramp(t,errorStart,errorStart+.35)*(1-ramp(t,BACKTRACK.cleave+1.8,BACKTRACK.cleave+3.1));
 const pauseHairpin=t<CHOICE_TIME?ramp(t,...HAIRPIN_PAUSE.fold)*(1-ramp(t,...HAIRPIN_PAUSE.unfold)):0;
 const sigmaBound=ramp(t,9,14.5)*(1-ramp(t,78,84));
 const selected=chaptersFor(path).findLastIndex(c=>t>=c.start);
 return {time:t,path,ntCount:length,displayNt:Math.max(0,Math.floor(length+1e-6)),register,distance,scrunch,open,grip,bend,init,release,recycling,sigmaBound,rhoIndex,rhoEngage,hairpin,pauseHairpin,error,fragment,cleavage,
   addition:t>=ELONGATION.end&&t<BACKTRACK.pause?additionPhase(t):null,rhoVisible:path==='rho'&&t>=136&&t<201.2,paused:t>=172&&t<190&&path==='rho',
   backtracking:t>=BACKTRACK.start&&t<BACKTRACK.cleave,chapter:Math.max(0,selected),atChoice:t>=136};
}
