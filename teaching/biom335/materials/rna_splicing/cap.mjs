// Scene: the 5′ cap of mRNA. Human RNA polymerase II paused early in transcription with the capping enzyme RNGTT on it
// (8P4B: its guanylyl-transferase domain at the RNA exit, the RNA's 5′ end in it, cut away in front of the RNA); then,
// where the camera leaves that 5′ end, the 5′ end atom by atom (the dictionary's ideal molecules, hydrogens included):
// the first nucleotide with its triphosphate and the next two (a regular stretch of the structure's RNA, G37–A39 of
// its hybrid, rebuilt from ideal nucleotides), the outermost phosphate removed and a GMP joined in reverse by a 5′–5′
// triphosphate linkage (the dictionary's m7GpppG, GTG, its own first nucleotide fitted onto G37; two of its free
// torsions turned so that the cap's guanine lies to the left, facing the viewer), the methyl group on N7 (the
// monomethylated cap) and, beside it, a small noncoding RNA's trimethylated cap (the two N2 methyl groups from M7M);
// the cap protecting an mRNA from the 5′–3′ exonuclease Xrn1 (2Y35, fruit fly, cut away in front of its RNA), which
// stops at the cap but takes an uncapped RNA's 5′ end into its active site and degrades it one nucleotide at a time,
// each released as a 5′ monophosphate (the dictionary's AMP, CMP, GMP, UMP); and the cap held by the nuclear
// cap-binding complex CBP20/80 (1N52, m7GpppG, CBP20 cut away in front of it) and by eIF4E, the cap-binding protein of
// eIF4F (1IPC, m7GTP), each cap space-filling with its mRNA drawn leaving it.
import * as THREE from 'three';
import {runScene} from '../shared/scene_player.mjs';
import {loadSurfaceSet, surfaceGeometry, proteinMaterial, fadeObject} from '../shared/molecules.mjs';
import {STRANDS} from '../shared/strands.mjs';
import {createAtoms} from '../shared/atoms.mjs';
import {SPLICING, createStrand, createCartoon, pairTip, line, onwards, SPACING} from '../shared/rna.mjs';
import {fitRigid} from '../shared/fit.mjs';
import {boxAround} from '../shared/camera.mjs';
import {ramp, clamp} from '../shared/ease.mjs';

const V = (...a) => new THREE.Vector3(...a);
const hex = c => '#' + new THREE.Color(c).getHexString();

// Times (s): each step starts at its t.
const T = {pol: 0, ppp: 12, gt: 23, m7: 40, tmg: 52, protect: 64, cbc: 82, eif: 94, end: 106};
// The uncapped RNA's degradation: its 23 nucleotides taken one after another, at a steady pace.
const EAT = [T.protect + 4.6, T.protect + 13.1];
// Colours: RNA polymerase II a cool grey, the capping enzyme orchid; the cap's guanosine in the cap's yellow and the
// RNA's own nucleotides in the RNA's orange (their carbons, atom by atom), methyl groups cyan; a small noncoding RNA
// lilac; the exonuclease periwinkle.
const POL = 0x9fb0b8, GT = 0xc890d8, CBP80 = 0x6c79b0, CBP20 = 0x3f9a8a, EIF4E = 0x4f7fc9, XRN = 0x8c80c8;
// The uncapped RNA, 5′ → 3′ (its released nucleotides in this order).
const UNCAPPED = 'GAUCCGAUACGUCAAGGCUUACG';
const CAP = SPLICING.cap, RNA = SPLICING.exon, SNC = 0xd3b6e8, PHOSPHATE = 0xf0a240, METHYL = 0x7fd8e8;
// Where each station sits (Å): the polymerase (where the cap is made), then, far apart, the protection, the cap-binding
// complex and eIF4E. The camera moves between them while both are faded out.
const AT = {pol: V(0, 0, 0), protect: V(1500, 0, 0), cbc: V(3000, 0, 0), eif: V(4500, 0, 0)};
// The views (from the subject towards the camera; world −y is up on screen).
const DIR = {pol: [.1, -.16, -1], chem: [.45, -.2, -1], side: [0, -.1, -1]};
const FOV = 28;

const NOTES = 'the-5-end-of-eukaryotic-mrna-is-capped';
const steps = [
  {t: T.pol, nav: 'Capped as it is made', title: 'Capping happens<br>during transcription.', notes: NOTES, hold: 1.1,
    text: 'The capping process happens during transcription. Shortly after initiation, RNA polymerase II pauses about 30 nucleotides downstream. This pause allows capping enzymes to be recruited to add the cap to the 5′ end of the new RNA molecule.'},
  {t: T.ppp, nav: 'A triphosphate end', title: 'Transcription starts with<br>a nucleoside triphosphate.', notes: NOTES,
    text: 'Transcription starts with a nucleoside triphosphate, usually an A or a G. When a mature mRNA is examined, however, the 5′ end does not have the expected nucleoside triphosphate.'},
  {t: T.gt, nav: 'A G added in reverse', title: 'A G is added<br>by a 5′–5′ link.', notes: NOTES, hold: 1.2,
    text: 'Instead, it contains a 5′ cap, formed by adding a guanine (G) to the terminal base of the transcript via an unusual 5′–5′ triphosphate linkage. The addition is catalyzed by guanylyl-transferase (GT), and the new G is added in the reverse orientation to all the other nucleotides.'},
  {t: T.m7, nav: 'A methyl on N7', title: 'A methyl at N7:<br>the monomethylated cap.', notes: NOTES, hold: 1.1,
    text: 'This structure is then a substrate for methylation. The most critical modification is the addition of a methyl group at the 7th position of the terminal guanine, creating a monomethylated cap, which is found on most mRNAs.'},
  {t: T.tmg, nav: 'The trimethylated cap', title: 'Some small RNAs have<br>a trimethylated cap.', notes: NOTES, hold: 1.2,
    text: 'Some small noncoding RNAs can be further methylated to form a trimethylated cap.'},
  {t: T.protect, nav: 'Protection', title: 'The cap protects<br>the new RNA.', notes: NOTES, hold: 1.1,
    text: 'Capping is crucial: without this protection, the nascent RNA is vulnerable to degradation by exonucleases, and the cap protects the mRNA from 5′–3′ exonucleases. Thus, capping is an important checkpoint for the polymerase to continue elongation and transcribe the rest of the gene.'},
  {t: T.cbc, nav: 'The cap-binding complex', title: 'In the nucleus: the<br>cap-binding complex.', notes: NOTES, hold: 1.1,
    text: 'In the nucleus, the cap is recognized by the cap-binding complex (CBP20/80), which stimulates the splicing of the first intron and helps with mRNA export from the nucleus.'},
  {t: T.eif, nav: 'eIF4F', title: 'In the cytoplasm,<br>eIF4F binds the cap.', notes: NOTES, hold: 1.2,
    text: 'Once in the cytoplasm, a different set of proteins (eIF4F) binds to the cap to initiate translation.'},
];

// The cap guanine's ring in the dictionary's m7GpppG (GTG: the cap's guanosine is …A and …D, its first nucleotide …B
// and …E).
const RING_A = ['N1A', 'C2A', 'N3A', 'C4A', 'C5A', 'C6A', 'N7A', 'C8A', 'N9A'], RING_B = RING_A.map(n => n.replace(/A$/, 'B'));
// The first nucleotide's atoms in GTG and in a structure's RNA.
const FIRST = {"C1'": 'C1E', "C2'": 'C2E', "C3'": 'C3E', "C4'": 'C4E', "O4'": 'O4E', "C5'": 'C5E', "O3'": 'O3E', "O2'": 'O2E',
  N9: 'N9B', C8: 'C8B', N7: 'N7B', C5: 'C5B', C6: 'C6B', O6: 'O6B', N1: 'N1B', C2: 'C2B', N2: 'N2B', N3: 'N3B', C4: 'C4B'};
// M7M (N2,N2,7-trimethylguanosine diphosphate) names its guanine's atoms its own way: matched to GTG's cap guanine.
const M7M_RING = {NBE: 'N1A', CBM: 'C2A', NBN: 'N3A', CBO: 'C4A', CBG: 'C5A', CBF: 'C6A', NBH: 'N7A', CBI: 'C8A', NBP: 'N9A', NBV: 'N2A', OBB: 'O6A'};
// The phosphates' acidic hydrogens are left out (charged, as at neutral pH).
const ACID = new Set(['HOA2', 'HOB2', 'HOG2', 'HOP2', 'HOP3', 'H16', 'H17', 'H18', 'H19']);
const METHYL7 = ['C7X', 'HC71', 'HC72', 'HC73'], N2_METHYLS = ['CBW', 'HBW', 'HBWA', 'HBWB', 'CBZ', 'HBZ', 'HBZA', 'HBZB'];
const GAMMA = ['PA', 'O1A', 'O2A', 'O5D', 'OP4'];

// A molecule fading in or out keeps writing depth while it is see-through, as a cut-open protein does (fade in
// ../shared/molecules.mjs): otherwise a protein surface behind it, drawn after it (sorted nearer), covers it from the
// first frame of a fade, so it would vanish as a fade begins and appear only as one ends.
const keepDepth = object => object.traverse(o => { for (const m of [o.material ?? []].flat()) if (m.transparent) m.depthWrite = true; });

const at = {};  // positions the camera shots read, and state for tests (?debug=1)
// A station's presence: in as the camera arrives (its move begins 0.84 s before the step and takes 2.4 s), out before it
// leaves for the next; labels end 1.7 s before the next step, before the fade.
const on = (t, from, to) => (from < 0 ? 1 : ramp(t, from + .9, from + 1.6)) * (1 - ramp(t, to - 1.5, to - .95));
const LABELS_END = 1.7;
// When the camera starts on to the next view of the 5′ end (each shot's move begins .35 of its blend before its step).
const MOVE = {gt: .7, m7: .7, tmg: .84};

runScene({
  pageTitle: 'The 5′ cap · RNA splicing and processing', eyebrow: 'The 5′ cap',
  links: [{href: 'index.html', text: 'All scenes'}],
  steps, duration: T.end, notesPage: 'notes.html', fov: FOV, fog: .00035, loop: false,
  shots: [
    {t: T.pol, frame: () => at.views.pol},
    {t: T.ppp, blend: 2.4, frame: () => at.views.ppp},
    {t: T.gt, blend: 2, frame: () => at.views.gt},
    {t: T.m7, blend: 2, frame: () => at.views.m7},
    {t: T.tmg, blend: 2.4, frame: () => at.views.tmg},
    {t: T.protect, blend: 2.4, frame: () => at.views.protect},
    {t: T.cbc, blend: 2.4, frame: () => at.views.cbc},
    {t: T.eif, blend: 2.4, frame: () => at.views.eif},
  ],
  async build({world, progress, renderer}) {
    const set = await loadSurfaceSet('assets/cap.json', 'assets/cap.bin', progress);
    renderer.localClippingEnabled = true;
    const group = name => set.meta.atoms.find(g => g.name === name), strandOf = name => set.meta.strands.find(s => s.name === name);
    const recs = id => set.meta.meshes.filter(m => m.structure === id);
    const posIn = (g, name, r = 0) => { const A = g.atoms; for (let i = 0; i < A.name.length; i++) if (A.name[i] === name && A.residue[i] === r) return V(...A.position[i]); return null; };
    const mean = list => list.reduce((s, p) => s.add(p), V()).divideScalar(list.length);
    // A station's turn: its local x to world x, `up` (made square to x) to world −y, up on screen.
    const turn = (x, up) => {
      const X = x.clone().normalize(), U = up.clone().addScaledVector(X, -up.dot(X)).normalize(), Y = U.negate(), Z = X.clone().cross(Y);
      return new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().makeBasis(X, Y, Z)).invert();
    };

    // ---------- RNA polymerase II with the capping enzyme (8P4B) ----------
    const tpl = strandOf('template'), ntp = strandOf('nontemplate'), rnaS = strandOf('rna');
    const backbone = s => s.backbone.map(b => V(...b)), baseOf = s => s.base.map(b => V(...b));
    const rnaB = backbone(rnaS), rnaBase = baseOf(rnaS), tB = backbone(tpl), tBase = baseOf(tpl), nB = backbone(ntp), nBase = baseOf(ntp);
    // The polymerase's view: the DNA left to right (upstream to downstream), the RNA leaving upwards to the capping
    // enzyme.
    const duplex = tpl.partner.flatMap((p, i) => p && p[0] === ntp.chain ? [tB[i].clone().add(nB[p[1]]).multiplyScalar(.5)] : []);
    const downstream = duplex[0].clone().sub(duplex[Math.min(15, duplex.length - 1)]);
    const qPol = turn(downstream, rnaB[0].clone().sub(rnaB[rnaB.length - 1]));
    const polCentre = mean(recs('pol').filter(r => r.name !== 'Capping enzyme').map(r => V(...r.center)));
    const polStation = new THREE.Group(), polInner = new THREE.Group();
    polStation.position.copy(AT.pol); polStation.quaternion.copy(qPol); polInner.position.copy(polCentre).negate();
    polStation.add(polInner); world.add(polStation);
    const polWorld = p => p.clone().sub(polCentre).applyQuaternion(qPol).add(AT.pol);

    // Proteins, cut away in front of the RNA so its path through the polymerase shows.
    const cut = new THREE.Plane(V(0, 0, 1), 1e9);
    const polMeshes = recs('pol').map((rec, i) => {
      const colour = rec.name === 'Capping enzyme' ? GT : new THREE.Color(POL).multiplyScalar([1, 1.1, .86][i] ?? 1).getHex();
      const m = new THREE.Mesh(surfaceGeometry(rec, set.buffer), proteinMaterial(colour));
      m.material.clippingPlanes = [cut]; m.material.side = THREE.DoubleSide;
      const u = m.material.userData.uniforms; u.uCut.value = .7; u.uCap.value.set(colour).multiplyScalar(.45);
      m.userData.rec = rec; polInner.add(m); return m;
    });
    const gtMesh = polMeshes.find(m => m.userData.rec.name === 'Capping enzyme');
    // The DNA: template and non-template strands as the structure has them (paired downstream, apart in the bubble, the
    // template paired with the RNA in the hybrid); the RNA, each base towards its own base or to the middle of its pair.
    const template = createCartoon(polInner, tB.length, {colour: STRANDS.template, rung: STRANDS.rung.template, radius: STRANDS.radius.template});
    const nontemplate = createCartoon(polInner, nB.length, {colour: STRANDS.coding, rung: STRANDS.rung.coding, radius: STRANDS.radius.coding});
    const mateOf = (s, i) => { const p = s.partner[i]; if (!p) return null; return p[0] === tpl.chain ? tB[p[1]] : p[0] === ntp.chain ? nB[p[1]] : p[0] === rnaS.chain ? rnaB[p[1]] : null; };
    template.pose(tB, tB.map((b, i) => pairTip(V(), b, tBase[i], mateOf(tpl, i), 1)));
    nontemplate.pose(nB, nB.map((b, i) => pairTip(V(), b, nBase[i], mateOf(ntp, i), 1)));
    const toward = i => rnaB[i].clone().add(rnaBase[i].clone().sub(rnaB[i]).setLength(5.6));
    const rna = createStrand(polInner, rnaB.length, {colour: RNA});
    rnaB.forEach((p, i) => { rna.points[i].copy(p); rna.pair(i, mateOf(rnaS, i) || toward(i), 1); });
    rna.pose();

    // ---------- The RNA's 5′ end atom by atom, and its cap ----------
    // A regular stretch of the structure's RNA (G37, G38, A39 of the hybrid, each rebuilt from the dictionary's ideal
    // molecule with its hydrogens) stands for the RNA's first three nucleotides, a G first. The cap is the dictionary's
    // ideal m7GpppG (GTG), its own first nucleotide fitted onto G37; G38 and A39 are fitted on by that nucleotide's sugar,
    // so that G38's phosphate bonds to GTG's 3′ oxygen.
    const GTG = group('cap'), M7M = group('tmg'), CHAIN = group('rna5'), FROM = 12;  // FROM: G37's index in the RNA
    const capFit = fitRigid(Object.values(FIRST).map(n => posIn(GTG, n)), Object.keys(FIRST).map(n => posIn(CHAIN, n, 0)));
    const SUGAR = {C1E: "C1'", C2E: "C2'", C3E: "C3'", C4E: "C4'", O4E: "O4'", O3E: "O3'"};
    const chainFit = fitRigid(Object.values(SUGAR).map(n => posIn(CHAIN, n, 0)), Object.keys(SUGAR).map(n => posIn(GTG, n).applyMatrix4(capFit)));
    // (Then shifted along that bond so that G38's phosphorus lies 1.6 Å from GTG's 3′ oxygen.)
    {
      const o3 = posIn(GTG, 'O3E').applyMatrix4(capFit), p = posIn(CHAIN, 'P', 1).applyMatrix4(chainFit), v = p.clone().sub(o3);
      chainFit.premultiply(new THREE.Matrix4().makeTranslation(v.clone().setLength(1.6).sub(v)));
    }
    // What an atom leads to, without crossing one bond.
    const reach = (d, start, skip) => {
      const A = d.atoms, nb = A.name.map(() => []), [s0, s1] = skip.map(n => A.name.indexOf(n));
      for (const [i, j] of d.bonds) if (!((i === s0 && j === s1) || (i === s1 && j === s0))) { nb[i].push(j); nb[j].push(i); }
      const seen = new Set([A.name.indexOf(start)]), q = [...seen];
      while (q.length) for (const j of nb[q.pop()]) if (!seen.has(j)) { seen.add(j); q.push(j); }
      return new Set([...seen].map(i => A.name[i]));
    };
    const ownFirst = reach(GTG, 'C1E', ['O5E', 'PG']);  // GTG's own first nucleoside (sugar …E, base …B)
    // The 5′ end as one molecule (residues 0–2 the RNA's nucleotides, 3 the cap's GMP and the triphosphate), with, on
    // request, the fourth oxygen the outermost phosphate leaves with (`gamma`) and a trimethylated cap's two methyl
    // groups on N2 (`tmg`, from M7M fitted on the cap's guanine).
    const fivePrime = ({gamma = false, tmg = false, alpha = 0, chi = 0} = {}) => {
      const d = {atoms: {name: [], element: [], residue: [], position: []}, bonds: [], hbonds: [], residues: [...CHAIN.residues.slice(0, 3).map(r => ({...r})), {chain: '', num: 0, name: 'GTG', letter: null}]};
      const A = d.atoms, map = new Map();
      const push = (key, name, element, r, p) => { map.set(key, A.name.length); A.name.push(name); A.element.push(element); A.residue.push(r); A.position.push(p.toArray()); return A.name.length - 1; };
      // GTG: its first nucleotide residue 0 (its 3′ hydrogen left out: the RNA runs on), the rest residue 3.
      GTG.atoms.name.forEach((n, i) => { if (!ACID.has(n) && n !== 'H3BO') push('g' + i, n, GTG.atoms.element[i], ownFirst.has(n) ? 0 : 3, V(...GTG.atoms.position[i]).applyMatrix4(capFit)); });
      for (const [i, j, o] of GTG.bonds) if (map.has('g' + i) && map.has('g' + j)) d.bonds.push([map.get('g' + i), map.get('g' + j), o]);
      CHAIN.atoms.name.forEach((n, i) => { const r = CHAIN.atoms.residue[i]; if (r === 1 || r === 2) push('c' + i, n, CHAIN.atoms.element[i], r, V(...CHAIN.atoms.position[i]).applyMatrix4(chainFit)); });
      for (const [i, j, o] of CHAIN.bonds) if (map.has('c' + i) && map.has('c' + j)) d.bonds.push([map.get('c' + i), map.get('c' + j), o]);
      const at3 = n => A.name.findIndex((x, k) => x === n && A.residue[k] === 3);
      d.bonds.push([A.name.indexOf('O3E'), A.name.findIndex((x, k) => x === 'P' && A.residue[k] === 1), 1]);
      const P3 = n => V(...A.position[at3(n)]);
      if (gamma) d.bonds.push([at3('PA'), push('op4', 'OP4', 'O', 3, P3('PA').add(P3('O3A').sub(P3('PA')).setLength(1.52))), 1]);
      if (tmg) {
        const fit = fitRigid(Object.keys(M7M_RING).map(n => posIn(M7M, n)), Object.values(M7M_RING).map(n => posIn(GTG, n))).premultiply(capFit);
        const k = Object.fromEntries(N2_METHYLS.map(n => [n, push('m' + n, n, n.startsWith('C') ? 'C' : 'H', 3, posIn(M7M, n).applyMatrix4(fit))]));
        for (const c of ['CBW', 'CBZ']) { d.bonds.push([at3('N2A'), k[c], 1]); for (const h of N2_METHYLS.filter(n => n.startsWith('H' + c.slice(1, 3)))) d.bonds.push([k[c], k[h], 1]); }
      }
      // Two free torsions turned for the view (the molecule's bonds and angles unchanged): the cap's GMP about its
      // phosphate's bond to the triphosphate (`alpha`), and its guanine about the glycosidic bond (`chi`).
      const twist = (names, from, to, angle) => {
        if (!angle) return;
        const o = P3(to), axis = o.clone().sub(P3(from)).normalize();
        for (const n of names) { const k = at3(n); if (k >= 0) A.position[k] = V(...A.position[k]).sub(o).applyAxisAngle(axis, angle).add(o).toArray(); }
      };
      twist([...gmpOf, 'OP4', ...N2_METHYLS], 'O3A', 'PA', alpha);
      twist(capBase, 'C1D', 'N9A', chi);
      return d;
    };
    const capBase = new Set([...reach(GTG, 'N9A', ['N9A', 'C1D']), ...N2_METHYLS]);
    const gmpOf = [...reach(GTG, 'C1D', ['PA', 'O3A'])].filter(n => n !== 'PA');
    // Carbons: the cap's guanosine yellow and its methyl groups cyan, the RNA's own nucleotides orange (or a small RNA's
    // lilac).
    const drawFive = (parent, d, own = RNA) => createAtoms(parent, d, {carbon: i => d.atoms.residue[i] !== 3 ? own : /^(C7X|CBW|CBZ)$/.test(d.atoms.name[i]) ? METHYL : CAP});
    const in5 = (d, name, r) => V(...d.atoms.position[d.atoms.name.findIndex((x, k) => x === name && d.atoms.residue[k] === r)]);

    // The chemistry's station, where the polymerase's view leaves the RNA's 5′ end: the 5′ end left to right as it
    // reads, its bases up; the RNA runs on from A39 as a slender strand (A40 to C42).
    let cap1Data = fivePrime({gamma: true});
    const TRACE = [FROM + 3, FROM + 4, FROM + 5], heavy = cap1Data.atoms.position.filter((_, k) => cap1Data.atoms.element[k] !== 'H').map(p => V(...p));
    const pivot = mean(heavy);
    const along5 = rnaB[FROM + 5].clone().sub(in5(cap1Data, "C4'", 1));  // about the strand's helix axis
    const basesUp = mean([0, 1, 2].map(r => mean((r ? ['N1', 'C2', 'N3', 'C4', 'C5', 'C6'] : ['N1B', 'C2B', 'N3B', 'C4B', 'C5B', 'C6B']).map(n => in5(cap1Data, n, r)))))
      .sub(mean([in5(cap1Data, 'C4E', 0), in5(cap1Data, "C4'", 1), in5(cap1Data, "C4'", 2)]));
    const qChem = turn(along5, basesUp);
    // The cap's turns that lay it out clearly: its guanine to the left of the triphosphate, about level with it, its
    // ring square to the view, clear of the other atoms.
    const TURN = (() => {
      const qi = qChem.clone().invert(), view = V(...DIR.chem).normalize().applyQuaternion(qi), X = V(1, 0, 0).applyQuaternion(qi), Y = V(0, -1, 0).applyQuaternion(qi);
      const isCap = (d, k) => d.atoms.residue[k] === 3 && (capBase.has(d.atoms.name[k]) || gmpOf.includes(d.atoms.name[k]));
      let best = {alpha: 0, chi: 0}, score = -Infinity;
      for (let a = 0; a < 360; a += 10) for (let c = 0; c < 360; c += 10) {
        const turn = {alpha: a * Math.PI / 180, chi: c * Math.PI / 180}, d = fivePrime(turn), at = n => in5(d, n, 3);
        const heavyK = d.atoms.element.map((e, k) => e === 'H' ? -1 : k).filter(k => k >= 0);
        const capK = heavyK.filter(k => isCap(d, k) && !['O5D', 'O1A', 'O2A'].includes(d.atoms.name[k])), restK = heavyK.filter(k => !isCap(d, k));
        const P = k => V(...d.atoms.position[k]);
        let gap = Infinity; for (const i of capK) for (const j of restK) gap = Math.min(gap, P(i).distanceTo(P(j)));
        const n = at('C5A').sub(at('N9A')).cross(at('N1A').sub(at('N9A'))).normalize(), g = mean(RING_A.map(at)).sub(in5(d, 'C5E', 0));
        const sc = 1.5 * Math.abs(n.dot(view)) - g.dot(X) / 8 - Math.abs(g.dot(Y)) / 12 - (gap < 3.1 ? 9 : 0);
        if (sc > score) { score = sc; best = turn; }
      }
      return best;
    })();
    cap1Data = fivePrime({gamma: true, ...TURN});
    AT.chem = polWorld(rnaB[0]);
    const chemStation = new THREE.Group(), chemInner = new THREE.Group();
    chemStation.position.copy(AT.chem); chemStation.quaternion.copy(qChem); chemInner.position.copy(pivot).negate();
    chemStation.add(chemInner); world.add(chemStation);
    const chemWorld = p => p.clone().sub(pivot).applyQuaternion(qChem).add(AT.chem);
    const thin = {stub: 2.4, stubRadius: .16, radius: .22};
    // The slender strand runs straight on from A39's 3′ oxygen, bases up as the chain's.
    const o3Chem = in5(cap1Data, "O3'", 2), aheadL = along5.clone().normalize(), upL = basesUp.clone().addScaledVector(aheadL, -basesUp.dot(aheadL)).normalize();
    const tracePts = TRACE.map((_, i) => o3Chem.clone().addScaledVector(aheadL, 3.4 + i * SPACING).addScaledVector(upL, -.6));
    const trace = createStrand(chemInner, TRACE.length, {colour: RNA, ...thin});
    tracePts.forEach((p, i) => { trace.points[i].copy(p); trace.pair(i, p.clone().addScaledVector(upL, 5.6), 1); });
    trace.link(0, o3Chem, {w: 1, colour: RNA, radius: .16}); trace.pose();

    // A group shown part way grows (or shrinks) as a whole about a point, so that its bonds keep in proportion to its
    // atoms (rather than full-length threads between specks).
    const scaleAbout = (a, list, centre, s) => { for (const k of list) a.positions[k].sub(centre).multiplyScalar(Math.max(s, .02)).add(centre); };
    const holder = (parent, matrix) => { const h = new THREE.Group(); h.matrixAutoUpdate = false; h.matrix.copy(matrix); parent.add(h); return h; };
    const cap1 = drawFive(chemInner, cap1Data);
    const ks = (a, names, r = 3) => names.map(n => a.find(n, r)).filter(k => k >= 0);
    const gmpSide = reach(cap1Data, 'C1D', ['PA', 'O3A']);
    const C1 = {gamma: ks(cap1, GAMMA), gammaO: ks(cap1, ['OP4']), gmp: cap1.select(k => cap1.residueOf[k] === 3 && gmpSide.has(cap1.names[k]) && !METHYL7.includes(cap1.names[k])),
      methyl: ks(cap1, METHYL7), pa: cap1.find('PA', 3), o3a: cap1.find('O3A', 3), n7: cap1.find('N7A', 3), c7: cap1.find('C7X', 3)};
    const gmpNoGamma = C1.gmp.filter(k => !C1.gamma.includes(k));
    // Directions (in the station's own coordinates): the outermost phosphate leaves upwards and outwards; the GMP comes
    // in from the left, along the 5′ end.
    const qInv = qChem.clone().invert(), chemUp = V(0, -1, 0).applyQuaternion(qInv), chemX = V(1, 0, 0).applyQuaternion(qInv);
    const OUT = chemUp.clone().multiplyScalar(.8).addScaledVector(chemX, -.6).multiplyScalar(8), IN = chemX.clone().multiplyScalar(-9);

    // A small noncoding RNA's 5′ end beside it (above, on screen), its cap trimethylated.
    const ABOVE = chemUp.clone().multiplyScalar(21);
    const cap2Hold = holder(chemInner, new THREE.Matrix4().makeTranslation(ABOVE));
    const cap2Data = fivePrime({tmg: true, ...TURN}), cap2 = drawFive(cap2Hold, cap2Data, SNC);
    const C2 = {n2: ks(cap2, N2_METHYLS), nh: ks(cap2, ['HN21', 'HN22']), n2a: cap2.find('N2A', 3),
      methyls: ['CBW', 'CBZ'].map(c => [cap2.find(c, 3), ks(cap2, N2_METHYLS.filter(n => n === c || n.startsWith('H' + c.slice(1, 3))))])};
    const snc = createStrand(chemInner, TRACE.length, {colour: SNC, ...thin});
    tracePts.forEach((p, i) => { snc.points[i].copy(p).add(ABOVE); snc.pair(i, p.clone().addScaledVector(upL, 5.6).add(ABOVE), 1); });
    snc.link(0, o3Chem.clone().add(ABOVE), {w: 1, colour: SNC, radius: .16}); snc.pose();

    // ---------- Protection: a capped mRNA and an uncapped RNA, each met by the 5′–3′ exonuclease Xrn1 (2Y35) ----------
    const protStation = new THREE.Group(); protStation.position.copy(AT.protect); world.add(protStation);
    const chemLocal = new THREE.Matrix4().compose(V(), qChem, V(1, 1, 1)).multiply(new THREE.Matrix4().makeTranslation(pivot.clone().negate()));
    const cap3Data = fivePrime(TURN), cap3 = drawFive(holder(protStation, chemLocal), cap3Data);
    cap3.fill = 1; cap3.update();  // space-filling, so it reads at the enzyme's scale
    const o3Prot = o3Chem.clone().applyMatrix4(chemLocal), first = tracePts[0].clone().applyMatrix4(chemLocal);
    const LONG = 20;
    const mrnaPts = [first, ...onwards(first, first.clone().sub(in5(cap3Data, "C4'", 2).applyMatrix4(chemLocal)), V(1, .08, 0), LONG - 1, {turn: .3})];
    const mrna = createStrand(protStation, LONG, {colour: RNA});
    mrna.pose(mrnaPts); mrna.link(0, o3Prot, {w: 1, colour: RNA}); mrna.pose();
    // Xrn1 (2Y35, its substrate's 5′ nucleotide in the active site) turned so that the substrate leaves its channel to
    // the right (world x, the RNAs' 5′ → 3′), the enzyme's bulk behind the RNA; each copy cut away in front of its RNA,
    // square to the view, so the channel shows. One stops with its channel's mouth against the cap (it cannot take a
    // capped 5′ end into its active site); the other takes the uncapped RNA's 5′ end in and runs along it.
    const X = V(1, 0, 0), xrnRec = recs('xrn1')[0];
    const pt = name => V(...set.meta.points.find(p => p.structure === 'xrn1' && p.name === name).position);
    const SITE = pt('substrate C4′ 1'), alongX = pt('substrate P4').sub(SITE).normalize();
    const bulk = V(...xrnRec.center).sub(SITE); bulk.addScaledVector(alongX, -bulk.dot(alongX)).normalize();
    const behind = V(0, .1, 1).normalize();
    const qXrn = new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().makeBasis(X, behind, X.clone().cross(behind))
      .multiply(new THREE.Matrix4().makeBasis(alongX, bulk, alongX.clone().cross(bulk)).transpose()));
    const viewSide = V(...DIR.side).normalize(), xrnGeometry = surfaceGeometry(xrnRec, set.buffer);
    const exonuclease = through => {
      const outer = new THREE.Group(), inner = new THREE.Group(), plane = new THREE.Plane();
      outer.quaternion.copy(qXrn); inner.position.copy(SITE).negate(); outer.add(inner); protStation.add(outer);
      const mesh = new THREE.Mesh(xrnGeometry, proteinMaterial(XRN));
      mesh.material.clippingPlanes = [plane]; mesh.material.side = THREE.DoubleSide;
      const u = mesh.material.userData.uniforms; u.uCut.value = .7; u.uCap.value.set(XRN).multiplyScalar(.58);
      inner.add(mesh);
      plane.normal.copy(viewSide).negate(); plane.constant = viewSide.dot(through.clone().add(AT.protect));
      // place(p): the active site (the substrate's 5′ nucleotide) at p, in the station's coordinates.
      return {outer, mesh, place(p) { outer.position.copy(p); }};
    };
    // The top copy's active site would be BLOCK Å before the cap's guanine, on its RNA's line; the uncapped RNA below
    // starts there, straight, and is drawn 3′ → 5′ so that it can be shortened from its 5′ end.
    const capG = mean(RING_A.map(n => cap3.home[cap3.find(n, 3)].clone().applyMatrix4(chemLocal)));
    const BLOCK = 36, ARRIVE = 24, BELOW = V(0, 96, 0), N_UN = LONG + 3;
    const topSite = capG.clone().addScaledVector(X, -BLOCK), U0 = topSite.clone().add(BELOW);
    const unPts = Array.from({length: N_UN}, (_, i) => U0.clone().addScaledVector(X, i * SPACING));
    const uncapped = createStrand(protStation, N_UN, {colour: RNA}).pose(unPts.slice().reverse());
    const topXrn = exonuclease(topSite), bottomXrn = exonuclease(U0);
    // The released nucleotides (5′ monophosphates, the dictionary's AMP, CMP, GMP and UMP), one per nucleotide of the
    // uncapped RNA, space-filling: each grows where its nucleotide was as that nucleotide is taken, then drifts a little
    // way off (towards the viewer, down and back), turning, and settles: the strand left as free nucleotides.
    const NMP = {A: group('AMP'), C: group('CMP'), G: group('GMP'), U: group('UMP')};
    const releasedData = {atoms: {name: [], element: [], residue: [], position: []}, bonds: [], hbonds: [], residues: []};
    [...UNCAPPED].forEach((letter, k) => {
      const g = NMP[letter], base = releasedData.atoms.name.length, A = releasedData.atoms;
      const c = mean(g.atoms.position.filter((_, i) => g.atoms.element[i] !== 'H').map(p => V(...p)));
      g.atoms.name.forEach((n, i) => { A.name.push(n); A.element.push(g.atoms.element[i]); A.residue.push(k); A.position.push(V(...g.atoms.position[i]).sub(c).toArray()); });
      for (const [i, j, o] of g.bonds) releasedData.bonds.push([base + i, base + j, o]);
      releasedData.residues.push({...g.residues[0], num: k + 1});
    });
    const released = createAtoms(protStation, releasedData, {carbon: () => RNA});
    released.fill = 1;
    const byResidue = UNCAPPED.split('').map((_, k) => released.select(i => released.residueOf[i] === k));
    const hash = (k, s) => { const x = Math.sin(k * 12.9898 + s * 78.233) * 43758.5453; return x - Math.floor(x); };
    const freed = UNCAPPED.split('').map((_, k) => ({
      from: unPts[k].clone().add(V(0, 1.5, -2.5)),
      drift: V(-.25, .3, -.9).normalize().applyAxisAngle(V(0, 0, 1), (hash(k, 1) - .5) * 1.1).applyAxisAngle(X, (hash(k, 2) - .5) * .7).multiplyScalar(20 + 12 * hash(k, 3)),
      axis: V(hash(k, 4) - .5, hash(k, 5) - .5, hash(k, 6) - .5).normalize(), spin: 1.2 + 1.4 * hash(k, 7),
      q0: new THREE.Quaternion().setFromAxisAngle(V(hash(k, 8) - .5, hash(k, 9) - .5, hash(k, 10) - .5).normalize(), 6.3 * hash(k, 11)),
    }));
    const settle = tau => 1 - Math.exp(-Math.max(0, tau) / 1.1);
    const freedAt = (k, tau) => freed[k].from.clone().addScaledVector(freed[k].drift, settle(tau));
    const LOWEST = [0, 1, 2, 3, 4].reduce((a, k) => freedAt(k, 1e9).y > freedAt(a, 1e9).y ? k : a, 0);

    // ---------- The cap-binding complex (1N52) and eIF4E (1IPC) ----------
    const sample = (m, every = 9) => { const a = m.geometry.attributes.position, out = []; for (let i = 0; i < a.count; i += every) out.push(V().fromBufferAttribute(a, i)); return out; };
    // Each station turned so its mRNA leaves the cap to the right; the mRNA drawn on from the cap's last oxygen.
    const holdStation = (id, capName, from, partner, n) => {
      const g = group(capName), meshes = recs(id), pts = g.atoms.position.map(p => V(...p));
      const centre = mean(meshes.map(m => V(...m.center))), capC = mean(pts), o = posIn(g, from);
      const exit = o.clone().sub(centre).normalize();
      const up = partner ? V(...meshes.find(m => m.name === partner).center).sub(V(...meshes.find(m => m.name !== partner).center)) : V(0, -1, 0);
      const colours = {CBP80, CBP20, eIF4E: EIF4E};
      const ms = meshes.map(rec => { const m = new THREE.Mesh(surfaceGeometry(rec, set.buffer), proteinMaterial(colours[rec.name])); m.userData.rec = rec; return m; });
      // CBP20 closes over its cap, so it is cut away in front of it (square to the view) to show the cap in place.
      const pocketCut = new THREE.Plane();
      for (const m of ms) if (m.userData.rec.name === 'CBP20') {
        m.material.clippingPlanes = [pocketCut]; m.material.side = THREE.DoubleSide;
        const u = m.material.userData.uniforms; u.uCut.value = .7; u.uCap.value.set(CBP20).multiplyScalar(.45);
      }
      // Rolled about the mRNA's way out (still to the right) so the cap's pocket opens towards the viewer: the roll
      // that leaves least protein in front of the cap.
      const view = V(...DIR.side).normalize(), around = ms.flatMap(m => sample(m, 3)).map(p => p.sub(capC));
      const q0 = turn(exit, up);
      let q = q0, fewest = Infinity;
      for (let deg = 0; deg < 360; deg += 10) {
        const qr = new THREE.Quaternion().setFromAxisAngle(V(1, 0, 0), deg * Math.PI / 180).multiply(q0);
        let n = 0; for (const p of around) { const w = p.clone().applyQuaternion(qr), along = w.dot(view); if (along > 2 && w.addScaledVector(view, -along).length() < 7) n++; }
        if (n < fewest - 2) { fewest = n; q = qr; }
      }
      const station = new THREE.Group(), inner = new THREE.Group();
      station.position.copy(AT[id === 'cbc' ? 'cbc' : 'eif']); station.quaternion.copy(q); inner.position.copy(capC).negate();
      station.add(inner); world.add(station); ms.forEach(m => inner.add(m));
      // The cap space-filling, so it reads at the protein's scale (m7GpppG's own first nucleotide, …B and …E, in the
      // RNA's colour).
      const atoms = createAtoms(inner, g, {carbon: i => /[BE]$/.test(g.atoms.name[i]) && capName === 'cbc-cap' ? RNA : CAP});
      atoms.fill = 1; atoms.update();
      station.updateMatrixWorld(true);
      const capW = inner.localToWorld(capC.clone()).addScaledVector(view, 1.5);
      pocketCut.normal.copy(view).negate(); pocketCut.constant = view.dot(capW);
      const oW = inner.localToWorld(o.clone()), startDir = V(1, 0, 0);
      const pts2 = line(n, {origin: oW.clone().addScaledVector(startDir, 4.6).sub(station.position), direction: startDir, toward: V(0, 1, 0), bend: .5});
      const holderW = new THREE.Group(); holderW.position.copy(station.position); world.add(holderW);
      const strand = createStrand(holderW, n, {colour: RNA}).pose(pts2);
      strand.link(0, oW.clone().sub(station.position), {w: 1, colour: RNA}); strand.pose();
      return {station, inner, meshes: ms, atoms, strand, q, hidden: fewest};
    };
    const cbc = holdStation('cbc', 'cbc-cap', 'O3E', 'CBP80', 16);
    // m7GTP's γ-phosphate: the RNA's first nucleotide would join at one of its oxygens (the one facing outwards).
    const eifCap = group('eif4e-cap');
    const eifO = ['O1C', 'O2C', 'O3C'].map(n => [n, posIn(eifCap, n)]).sort((a, b) => b[1].distanceTo(posIn(eifCap, 'N7')) - a[1].distanceTo(posIn(eifCap, 'N7')))[0][0];
    const eif = holdStation('eif4e', 'eif4e-cap', eifO, null, 14);

    // ---------- Views ----------
    world.updateMatrixWorld(true);
    const polLocal = [...polMeshes.flatMap(m => sample(m, 15)), ...tB, ...nB];
    const atomsLocal = (a, matrix = new THREE.Matrix4(), list = null) => (list || a.positions.map((_, k) => k)).map(k => a.home[k].clone().applyMatrix4(matrix));
    const pppAtoms = atomsLocal(cap1, undefined, cap1.select(k => !gmpNoGamma.includes(k) && !C1.methyl.includes(k) && !C1.gammaO.includes(k)));
    const capAll = atomsLocal(cap1);
    const near = tracePts.flatMap(p => [p, p.clone().addScaledVector(upL, 2.8)]);
    const chemView = (pts, opts) => boxAround(pts.map(chemWorld), DIR.chem, {fov: FOV, ...opts});
    const outPts = atomsLocal(cap1, new THREE.Matrix4().makeTranslation(OUT), C1.gamma), inPts = atomsLocal(cap1, new THREE.Matrix4().makeTranslation(IN), gmpNoGamma);
    const strandPts = s => { const out = []; for (let i = 0; i < s.n; i++) out.push(s.world(i), s.tip(i)); return out; };
    const meshWorld = m => sample(m, 7).map(p => m.localToWorld(p));
    // The exonucleases where they come in from, where they stop, and (the lower one) where it ends; their parts cut away
    // left out. The released nucleotides where they settle.
    const unclipped = m => meshWorld(m).filter(p => !(m.material.clippingPlanes[0].distanceToPoint(p) < 0));
    const xrnAt = (x, p) => { x.place(p); x.outer.updateMatrixWorld(true); return unclipped(x.mesh); };
    const xrnPts = [
      ...xrnAt(topXrn, topSite.clone().addScaledVector(X, -ARRIVE)), ...xrnAt(topXrn, topSite),
      ...xrnAt(bottomXrn, U0.clone().addScaledVector(X, -ARRIVE)), ...xrnAt(bottomXrn, U0.clone().addScaledVector(X, N_UN * SPACING)),
    ];
    const freedPts = freed.flatMap((_, k) => [-5, 5].map(o => freedAt(k, 1e9).addScalar(o).add(AT.protect)));
    at.views = {
      pol: {...boxAround(polLocal.map(polWorld), DIR.pol, {fov: FOV, margin: 6, above: 6}), fill: .95},
      ppp: {...chemView([...pppAtoms, ...near], {margin: 2.5, above: 2}), fill: .92},
      gt: {...chemView([...capAll, ...near, ...outPts, ...inPts], {margin: 2, above: 2}), fill: .94},
      m7: {...chemView([...capAll, ...near], {margin: 3, above: 3}), fill: .92},
      tmg: {...chemView([...capAll, ...near, ...capAll.map(p => p.clone().add(ABOVE))], {margin: 3, above: 2}), fill: .92},
      protect: {...boxAround([...atomsLocal(cap3, chemLocal).map(p => p.add(AT.protect)), ...strandPts(mrna), ...strandPts(uncapped), ...xrnPts, ...freedPts], DIR.side, {fov: FOV, margin: 6, above: 4}), fill: .94},
      cbc: {...boxAround([...cbc.meshes.flatMap(meshWorld), ...strandPts(cbc.strand)], DIR.side, {fov: FOV, margin: 5, above: 4}), fill: .95},
      eif: {...boxAround([...eif.meshes.flatMap(meshWorld), ...strandPts(eif.strand)], DIR.side, {fov: FOV, margin: 5, above: 4}), fill: .95},
    };
    // The cut: square to the polymerase's view, through the middle of the RNA's path.
    const cutDir = V(...DIR.pol).normalize(), rnaMid = polWorld(rnaB[Math.floor(rnaB.length / 2)]);
    cut.normal.copy(cutDir).negate(); cut.constant = cutDir.dot(rnaMid);

    // A point on a protein's surface facing the camera near its middle, for labels.
    const front = (mesh, dir) => {
      const d = V(...dir).normalize(), c = V(), all = meshWorld(mesh); all.forEach(p => c.add(p)); c.divideScalar(all.length);
      let best = c, score = -Infinity;
      for (const p of all) { if (mesh.material.clippingPlanes?.[0]?.distanceToPoint(p) < 0) continue; const off = p.clone().sub(c), s = off.dot(d) - .7 * off.clone().addScaledVector(d, -off.dot(d)).length(); if (s > score) { score = s; best = p; } }
      return mesh.worldToLocal(best.clone());
    };
    const anchors = {};

    // State the tests read.
    const state = {};
    at.state = () => ({...state});
    // For tests (?debug=1): world points of everything drawn now.
    at.shown = () => {
      world.updateMatrixWorld(true);
      const out = [];
      const meshes = list => { for (const m of list) if (m.visible && m.material.opacity > 0) for (const p of sample(m, 11)) { const w = m.localToWorld(p); if (!(m.material.clippingPlanes?.[0]?.distanceToPoint(w) < 0)) out.push(w.toArray()); } };
      meshes(polMeshes); meshes(cbc.meshes); meshes(eif.meshes); meshes([topXrn.mesh, bottomXrn.mesh]);
      for (const c of [template, nontemplate]) if (c.group.visible) for (const p of [...c.group === template.group ? tB : nB]) out.push(polInner.localToWorld(p.clone()).toArray());
      for (const s of [rna, trace, snc, mrna, uncapped, cbc.strand, eif.strand]) out.push(...s.extent());
      for (const a of [cap1, cap2, cap3, released, cbc.atoms, eif.atoms]) if (a.group.visible) a.positions.forEach((p, k) => { if (a.shown[k] > .05) out.push(a.group.localToWorld(p.clone()).toArray()); });
      return out;
    };
    const atomW = (a, k) => a.group.localToWorld(a.positions[k].clone());
    const named = (a, name, r = 3) => atomW(a, a.find(name, r));
    const centreW = (a, names, r = 3) => mean(names.map(n => named(a, n, r)));

    // For tests (?debug=1): the 5′ end's chemistry as drawn now.
    at.measure = () => {
      world.updateMatrixWorld(true);
      const d = (a, n1, r1, n2, r2) => +named(a, n1, r1).distanceTo(named(a, n2, r2)).toFixed(2);
      const sh = (a, n, r = 3) => +a.shown[a.find(n, r)].toFixed(3);
      const axis = trace.world(TRACE.length - 1).sub(named(cap1, 'C4E', 0)).normalize();  // the RNA, 5′ → 3′
      const way = (a, r, c5, c3) => Math.sign(named(a, c3, r).sub(named(a, c5, r)).dot(axis));
      const steps = s => s.points.slice(1).map((p, i) => +p.distanceTo(s.points[i]).toFixed(2));
      const nearest = (p, mesh) => Math.min(...meshWorld(mesh).map(q => q.distanceTo(p)));
      return {
        phosphates: ['PA', 'PB', 'PG'].filter(n => cap1.shown[cap1.find(n, 3)] > .5).length, gammaBond: d(cap1, 'PA', 3, 'O3A', 3),
        op4: sh(cap1, 'OP4'), capG: sh(cap1, 'C1D'), methyl: sh(cap1, 'C7X'), n7c7: d(cap1, 'N7A', 3, 'C7X', 3),
        // From the cap's 5′ carbon to the first nucleotide's: C5′–O5′–P–O–P–O–P–O5′–C5′.
        bridge: [['C5D', 3, 'O5D', 3], ['O5D', 3, 'PA', 3], ['PA', 3, 'O3A', 3], ['O3A', 3, 'PB', 3], ['PB', 3, 'O3B', 3], ['O3B', 3, 'PG', 3],
          ['PG', 3, 'O5E', 0], ['O5E', 0, 'C5E', 0]].map(([a, r, b, q]) => d(cap1, a, r, b, q)),
        way: {cap: way(cap1, 3, 'C5D', 'C3D'), rna: [way(cap1, 0, 'C5E', 'C3E'), way(cap1, 1, "C5'", "C3'"), way(cap1, 2, "C5'", "C3'")]},
        links: [d(cap1, 'O3E', 0, 'P', 1), d(cap1, "O3'", 1, 'P', 2)], traceGap: +trace.world(0).distanceTo(named(cap1, "O3'", 2)).toFixed(2),
        tmg: {visible: cap2.group.visible, n2: sh(cap2, 'CBW'), nh: sh(cap2, 'HN21'), n2c: [d(cap2, 'N2A', 3, 'CBW', 3), d(cap2, 'N2A', 3, 'CBZ', 3)], n7: d(cap2, 'N7A', 3, 'C7X', 3)},
        uncapped: +state.uncapped.toFixed(2), capped: mrna.count, released: state.released,
        // The lower exonuclease's active site from the uncapped RNA's 5′-most nucleotide; the upper one's from the cap's G.
        site: state.site === null ? null : +state.site.toFixed(2), block: +state.block.toFixed(2), steps: {trace: steps(trace), mrna: steps(mrna), uncapped: steps(uncapped), cbc: steps(cbc.strand), eif: steps(eif.strand)},
        gaps: {mrna: +mrna.world(0).distanceTo(named(cap3, "O3'", 2)).toFixed(2), cbc: +cbc.strand.world(0).distanceTo(named(cbc.atoms, 'O3E', 0)).toFixed(2), eif: +eif.strand.world(0).distanceTo(named(eif.atoms, eifO, 0)).toFixed(2)},
        // How near each cap's guanine lies to the protein that holds it.
        pocket: {cbp20: +nearest(centreW(cbc.atoms, RING_A, 0), cbc.meshes.find(m => m.userData.rec.name === 'CBP20')).toFixed(2),
          eif4e: +nearest(centreW(eif.atoms, ['N1', 'C2', 'N3', 'C4', 'C5', 'C6', 'N7', 'C8', 'N9'], 0), eif.meshes[0]).toFixed(2)},
      };
    };
    let lastPol = -1;
    // The atoms and strands that fade (each station's molecules besides its proteins).
    const fading = [template, nontemplate, rna, trace, cap1, cap2, snc, uncapped, mrna, cap3, released, cbc.atoms, cbc.strand, eif.atoms, eif.strand].map(x => x.group);
    return {
      at, cap1, cap2, cap3, rna, trace, snc, mrna, uncapped, cbc, eif,  // for tests (?debug=1)
      update(t, {pxPerA}) {
        // Who is on stage.
        // Who is on stage: each station fades out before the camera leaves it (its labels gone first) and in as the
        // camera arrives.
        const polOn = on(t, -1, T.ppp), chemOn = on(t, T.ppp, T.protect), protOn = on(t, T.protect, T.cbc), cbcOn = on(t, T.cbc, T.eif), eifOn = on(t, T.eif, T.end + 9);
        // The polymerase fades as the camera leaves for its RNA's 5′ end, where the 5′ end's atoms fade in.
        if (polOn !== lastPol) { lastPol = polOn; for (const m of polMeshes) fadeObject(m, polOn); template.opacity(polOn); nontemplate.opacity(polOn); }
        rna.opacity(polOn).pose().view(pxPerA);
        trace.opacity(chemOn).pose().view(pxPerA);

        // The 5′ end: the triphosphate's outermost phosphate leaves; the GMP comes in and joins by its phosphate.
        const gone = ramp(t, T.gt + 2, T.gt + 5), leaving = t < T.gt + 5.25;
        const arrive = ramp(t, T.gt + 5.6, T.gt + 9.6), grown = ramp(t, T.gt + 5.6, T.gt + 6.8);
        const bond = leaving ? 1 - ramp(t, T.gt + 2, T.gt + 2.6) : ramp(t, T.gt + 9.3, T.gt + 10.3);
        const methyl = ramp(t, T.m7 + 1.6, T.m7 + 3.2);
        for (let k = 0; k < cap1.count; k++) cap1.positions[k].copy(cap1.home[k]);
        if (leaving) {
          const shown = 1 - ramp(t, T.gt + 3.8, T.gt + 5);
          for (const k of C1.gamma) cap1.positions[k].addScaledVector(OUT, gone);
          scaleAbout(cap1, C1.gamma, cap1.positions[C1.pa].clone(), shown);
          cap1.show(C1.gamma, shown);
          cap1.show(C1.gammaO, ramp(t, T.gt + 2.2, T.gt + 2.8) * shown);
          cap1.show(gmpNoGamma, 0);
        } else {
          for (const k of C1.gmp) cap1.positions[k].addScaledVector(IN, 1 - arrive);
          scaleAbout(cap1, C1.gmp, cap1.centre(C1.gmp), grown);
          cap1.show(C1.gmp, grown); cap1.show(C1.gammaO, 0);
        }
        // The methyl group comes onto N7 (from a little beyond it) and bonds as it arrives.
        const m7dir = cap1.home[C1.c7].clone().sub(cap1.home[C1.n7]).setLength(3);
        for (const k of C1.methyl) cap1.positions[k].addScaledVector(m7dir, 1 - methyl).addScaledVector(IN, leaving ? 0 : 1 - arrive);
        scaleAbout(cap1, C1.methyl, cap1.positions[C1.c7].clone(), methyl);
        cap1.show(C1.methyl, leaving ? 0 : methyl * grown);
        cap1.showBond(C1.pa, C1.o3a, bond); cap1.showBond(C1.n7, C1.c7, ramp(t, T.m7 + 2.8, T.m7 + 3.4));
        cap1.update(); cap1.opacity(chemOn);
        Object.assign(state, {gamma: leaving ? 1 - gone : 0, gmp: leaving ? 0 : arrive, bond, methyl: leaving ? 0 : methyl});

        // The small noncoding RNA's cap: an m7G cap that gains two methyl groups on N2.
        const sncOn = ramp(t, T.tmg + .6, T.tmg + 1.8) * chemOn, n2 = ramp(t, T.tmg + 3.2, T.tmg + 4.8);
        cap2.show(C2.n2, n2); cap2.show(C2.nh, 1 - n2);
        const n2out = cap2.home[C2.n2[0]].clone().sub(cap2.home[C2.n2a]).setLength(2.5);
        C2.n2.forEach(k => cap2.positions[k].copy(cap2.home[k]).addScaledVector(n2out, 1 - n2));
        for (const [c, group] of C2.methyls) { scaleAbout(cap2, group, cap2.positions[c].clone(), n2); cap2.showBond(C2.n2a, c, ramp(t, T.tmg + 4.4, T.tmg + 5)); }
        // (N2's two hydrogens shrink onto it as the methyl groups take their places.)
        C2.nh.forEach(k => cap2.positions[k].copy(cap2.home[k])); scaleAbout(cap2, C2.nh, cap2.home[C2.n2a], 1 - n2);
        cap2.update(); cap2.opacity(sncOn); snc.opacity(sncOn).pose().view(pxPerA);
        state.n2 = n2;

        // Protection: both exonucleases come in along their RNAs; the upper one stops at the cap, the lower one takes the
        // uncapped RNA's 5′ end into its active site and runs along it, taking one nucleotide after another, each
        // released as it goes; the capped mRNA is kept.
        const xrnIn = ramp(t, T.protect + 1.4, T.protect + 3.6), xrnOn = protOn * ramp(t, T.protect + 1.4, T.protect + 2.3);
        const eaten = N_UN * clamp((t - EAT[0]) / (EAT[1] - EAT[0]));
        topXrn.place(topSite.clone().addScaledVector(X, -ARRIVE * (1 - xrnIn)));
        bottomXrn.place(U0.clone().addScaledVector(X, -ARRIVE * (1 - xrnIn) + eaten * SPACING));
        fadeObject(topXrn.mesh, xrnOn); fadeObject(bottomXrn.mesh, xrnOn);
        uncapped.reveal(N_UN - eaten).opacity(protOn).pose().view(pxPerA);
        mrna.opacity(protOn).pose().view(pxPerA); cap3.opacity(protOn);
        // Nucleotide k grows where it was as the enzyme takes it, then drifts off (from when half grown) and settles.
        let out = 0;
        freed.forEach((f, k) => {
          const grown = ramp(eaten, k + .15, k + .85), tau = t - (EAT[0] + (k + .5) / N_UN * (EAT[1] - EAT[0]));
          const c = freedAt(k, tau), q = new THREE.Quaternion().setFromAxisAngle(f.axis, f.spin * settle(tau)).multiply(f.q0);
          for (const i of byResidue[k]) released.positions[i].copy(released.home[i]).applyQuaternion(q).add(c);
          released.show(byResidue[k], grown);
          if (grown > .5) out++;
        });
        released.update(); released.opacity(protOn);
        Object.assign(state, {uncapped: N_UN - eaten, capped: LONG, released: out,
          site: eaten < N_UN ? bottomXrn.outer.position.distanceTo(unPts[Math.floor(eaten)]) : null, block: topXrn.outer.position.distanceTo(capG)});

        for (const [s, on] of [[cbc, cbcOn], [eif, eifOn]]) { for (const m of s.meshes) fadeObject(m, on); s.atoms.opacity(on); s.strand.opacity(on).pose().view(pxPerA); }
        for (const g of fading) keepDepth(g);
      },
      annotate(t, {label, tag}) {
        const col = {pol: hex(POL), gt: hex(GT), rna: hex(RNA), cap: hex(CAP), p: hex(PHOSPHATE), snc: hex(SNC), me: hex(METHYL)};
        if (t < T.ppp) {
          if (t > 1.6 && t < T.ppp - LABELS_END) {
            anchors.pol ??= front(polMeshes[0], DIR.pol); anchors.gt ??= front(gtMesh, DIR.pol);
            label(polMeshes[0].localToWorld(anchors.pol.clone()), 'RNA polymerase II', 'Paused shortly after initiation', {color: col.pol});
            label(gtMesh.localToWorld(anchors.gt.clone()), 'Capping enzyme', 'Its guanylyl-transferase (GT)', {color: col.gt});
            if (t > 4) label(rna.world(5), 'New RNA', 'Its 5′ end reaches the capping enzyme', {color: col.rna});
            if (t > 4) tag(polInner.localToWorld(duplex[4].clone()), 'DNA', {color: hex(STRANDS.template)});
          }
        } else if (t < T.gt) {
          // (Each view of the 5′ end names its parts until the camera moves on, as the stations' labels end first.)
          if (t > T.ppp + 2.2 && t < T.gt - MOVE.gt) {
            label(named(cap1, 'PB'), '5′ triphosphate', 'Three phosphates', {color: col.p});
            label(centreW(cap1, RING_B, 0), 'First nucleotide', 'Here a G', {color: col.rna});
            label(trace.world(1), 'RNA', 'Continuing 5′ → 3′', {color: col.rna, side: 'right'});
          }
        } else if (t < T.m7) {
          const u = t - T.gt;
          // (The GMP is named where it is going, so its label keeps still while it slides in.)
          if (u > .8 && u < 4.2) label(named(cap1, 'PA'), 'Outermost phosphate', 'Removed', {color: col.p});
          else if (u > 6 && u < 10.2) label(mean(RING_A.map(n => cap1.group.localToWorld(cap1.home[cap1.find(n, 3)].clone()))), 'GMP', 'Added by guanylyl-transferase (GT)', {color: col.cap, side: 'left'});
          else if (u > 10.6 && t < T.m7 - MOVE.m7) {
            label(named(cap1, 'PB'), '5′–5′ triphosphate', 'Three phosphates join two 5′ carbons', {color: col.p, side: 'right'});
            label(centreW(cap1, RING_A), 'The cap’s G', 'In reverse orientation', {color: col.cap, side: 'right', below: true});
            tag(named(cap1, 'C5D'), '5′', {color: col.cap}); tag(named(cap1, 'C5E', 0), '5′', {color: col.rna});
          }
        } else if (t < T.tmg) {
          const u = t - T.m7;
          if (u > 3 && t < T.tmg - MOVE.tmg) {
            label(named(cap1, 'C7X'), 'Methyl group on N7', 'm7G: the monomethylated cap', {color: col.me, side: 'left'});
            label(named(cap1, 'O2E', 0), '2′ oxygen', 'Can also be methylated (cap 1)', {color: hex(0xe2584e), side: 'right', below: true});
          }
        } else if (t < T.protect) {
          const u = t - T.tmg;
          if (u > 2 && t < T.protect - LABELS_END) {
            label(trace.world(1), 'mRNA', 'Monomethylated cap', {color: col.rna, side: 'right', below: true});
            label(snc.world(1), 'Small noncoding RNA', 'Trimethylated cap', {color: col.snc, side: 'right'});
            if (u > 5) label(named(cap2, 'N2A'), 'Two more methyl groups', 'On N2: m2,2,7G', {color: col.me, side: 'left'});
          }
        } else if (t < T.cbc) {
          const u = t - T.protect;
          if (u > 2.2 && t < T.cbc - LABELS_END) {
            label(centreW(cap3, RING_A), 'Cap', 'The 5′ end protected', {color: col.cap, side: 'right'});
            // (Tagged at a nucleotide near its 3′ end, which stays while the rest goes, so the tag keeps still.)
            if (state.uncapped > 4) tag(uncapped.world(1), 'No cap', {color: col.rna});
          }
          if (u > 4 && t < T.cbc - LABELS_END) {
            anchors.xrn ??= front(topXrn.mesh, DIR.side);
            // (The one degrading the RNA first: a phone, which shows two labels, names it.)
            label(bottomXrn.mesh.localToWorld(anchors.xrn.clone()), '5′–3′ exonuclease', 'Degrading the RNA from its 5′ end', {color: hex(XRN), side: 'left', key: 'xrn bottom'});
            label(topXrn.mesh.localToWorld(anchors.xrn.clone()), '5′–3′ exonuclease', 'Stopped by the cap', {color: hex(XRN), side: 'left', key: 'xrn top'});
          }
          // (Named at the lower edge of the lowest of the first few released, once settled, the box below them.)
          if (u > 8 && t < T.cbc - LABELS_END) label(freedAt(LOWEST, 1e9).add(V(0, 4.5, 0)).add(AT.protect), 'Released nucleotides', 'One at a time, from the 5′ end', {color: col.rna, side: 'right', below: true});
        } else if (t < T.eif) {
          if (t > T.cbc + 2.2 && t < T.eif - LABELS_END) {
            anchors.cbp80 ??= front(cbc.meshes.find(m => m.userData.rec.name === 'CBP80'), DIR.side);
            anchors.cbp20 ??= front(cbc.meshes.find(m => m.userData.rec.name === 'CBP20'), DIR.side);
            label(cbc.meshes.find(m => m.userData.rec.name === 'CBP80').localToWorld(anchors.cbp80.clone()), 'CBP80', 'Cap-binding complex', {color: hex(CBP80), side: 'left'});
            label(cbc.meshes.find(m => m.userData.rec.name === 'CBP20').localToWorld(anchors.cbp20.clone()), 'CBP20', 'Holds the cap', {color: hex(CBP20), side: 'left', below: true});
            label(centreW(cbc.atoms, RING_A, 0), 'Cap', 'm7GpppG', {color: col.cap, side: 'right', below: true});
            tag(cbc.strand.world(10), 'mRNA', {color: col.rna});
          }
        } else if (t > T.eif + 2.2) {
          anchors.eif ??= front(eif.meshes[0], DIR.side);
          label(eif.meshes[0].localToWorld(anchors.eif.clone()), 'eIF4E', 'The cap-binding protein of eIF4F', {color: hex(EIF4E), side: 'left'});
          label(centreW(eif.atoms, ['N1', 'C2', 'N3', 'C4', 'C5', 'C6', 'N7', 'C8', 'N9'], 0), 'Cap', 'm7G triphosphate', {color: col.cap, side: 'right'});
          tag(eif.strand.world(9), 'mRNA', {color: col.rna});
        }
      },
    };
  },
});
