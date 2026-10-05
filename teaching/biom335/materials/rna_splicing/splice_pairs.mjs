// Scene (experiments): splice sites are read in pairs. Pre-mRNAs drawn with shared/rna.mjs at true size, their introns
// looped out of the row they lie in (below it; above the polymerase's RNA).
// - A pre-mRNA with three introns: an intron's ends have no complementarity; the right pairs keep every exon, and
//   pairing the wrong junctions (the 5′ splice site of intron 1 with the 3′ splice site of intron 2) would remove exon 2.
// - The hybrid intron: an exon of the SV40 virus, with the 5′ part of its intron, joined to the 3′ part of an intron and
//   an exon of mouse β-globin. The viewer predicts whether the hybrid intron is removed; it is, as a lariat, and the
//   two exons join.
// - Coupling with transcription: RNA polymerase II (6GMH) transcribes a gene of three exons and two introns at a
//   steady rate; the RNA leaves its exit channel 5′ end first and runs along a row, so its splice sites appear in 5′ to
//   3′ order, and each intron is spliced out of the row as soon as its 3′ splice site has emerged: exon 1 is joined to
//   exon 2 before intron 2's 3′ splice site is made, then exon 2 to exon 3, as the polymerase makes exon 3.
// - Splicing enhancers and silencers round a 3′ splice site, and how well it is recognised.
// - Cryptic sites: with the branch site's A mutated, the viewer predicts which of two cryptic sites is used; the one
//   nearest the 3′ splice site forms the lariat.
// Each step's molecules fade out as the camera leaves and in once it arrives; every shot fits what its step shows into
// the free part of the screen.
import * as THREE from 'three';
import {runScene} from '../shared/scene_player.mjs';
import {loadSurfaceSet, surfaceGeometry, proteinMaterial, baseMaterial, fade, fadeObject} from '../shared/molecules.mjs';
import {boxAround} from '../shared/camera.mjs';
import {STRANDS, BASES, createTube} from '../shared/strands.mjs';
import {SPLICING, SPACING, createStrand, line, loopBetween} from '../shared/rna.mjs';
import {pairsFromStrands, frameFromPairs, meanLocal, sequencePairs, extend, createDuplex} from '../shared/dna.mjs';
import {ramp, smooth, clamp, mix} from '../shared/ease.mjs';

const V = (...a) => new THREE.Vector3(...a);
const X = V(1, 0, 0), Y = V(0, 1, 0);
const hex = c => '#' + new THREE.Color(c).getHexString();
const lighter = (c, k) => new THREE.Color(c).lerp(new THREE.Color(0xffffff), k).getHex();
const S = SPACING, GAP = 4.5 * S;

// Times (s): each step starts at its t.
const T = {pairs: 0, hybrid: 16, result: 30, coupling: 44, context: 73.5, cryptic: 88.5, used: 102.5, end: 119.5};
// Splicing, from a step's start r: the intron's 5′ end comes to the branch A, exon 1 is cut free, the lariat swings
// back, exon 1 slides to exon 2 and they join, the lariat leaves.
const splicing = r => ({fold: [r + 1, r + 3], cut: [r + 3.2, r + 4.2], swing: [r + 4.4, r + 6.2], slide: [r + 6.2, r + 7.8], join: r + 7.8, away: [r + 8.2, r + 10.6]});

// Colours: exons the course's orange (exon 2 of the three-intron gene paler, to follow it), introns grey-violet; the
// hybrid's SV40 parts as those, its mouse β-globin parts amber and mauve; enhancers green, silencers red.
const EXON = SPLICING.exon, INTRON = SPLICING.intron, EXON2 = 0xf2e27a;
const SV40 = {exon: SPLICING.exon, intron: SPLICING.intron}, GLOBIN = {exon: 0xffc94a, intron: 0x93709f};
const ENHANCER = 0x4fd48c, SILENCER = 0xe8605a, SITE = 0xff7a6b, CRYPTIC = 0xd57ac0, POL2 = 0x9fb0b8;
const label$ = c => ({color: hex(c)});
const INK = {intron: lighter(INTRON, .5), globinIntron: lighter(GLOBIN.intron, .35)};

const NOTES = {pairs: 'splice-sites-are-read-in-pairs', lariat: 'splicing-proceeds-through-a-lariat-intermediate'};
const steps = [
  {t: T.pairs, nav: 'Joining the right pairs', title: 'The right 5′ and 3′ sites<br>must be joined.', notes: NOTES.pairs, hold: 1.1,
    text: 'A major challenge in pre-mRNA splicing is ensuring the correct 5′ and 3′ splice sites are joined together, especially in genes with many long introns. The sequences at the ends of an intron have no complementarity, so the pairing cannot rely on base-pairing. Pairing the wrong junctions would remove exons.'},
  {t: T.hybrid, nav: 'A hybrid intron', title: 'An SV40 exon joined<br>to a β-globin exon.', notes: NOTES.pairs, hold: 1.05,
    text: 'In an experiment, an exon of the SV40 virus, with the start of its intron, is linked to the end of an intron and an exon of a completely different gene, mouse β-globin. The hybrid intron has the 5′ splice site of one gene and the 3′ splice site of the other.',
    predict: {id: 'hybrid', question: 'Is the hybrid intron removed?', choices: [
      {text: 'Yes: it is spliced out', correct: true},
      {text: 'No: its ends come from different genes', correct: false, reply: 'Splice sites are generic and interchangeable: any 5′ splice site can be joined to any 3′ splice site.'}]}},
  {t: T.result, nav: 'The hybrid intron is removed', title: 'The hybrid intron<br>is removed.', notes: NOTES.pairs, hold: 1.1,
    text: 'The hybrid intron is correctly removed: the splicing machinery treats splice sites as generic and interchangeable. All 5′ splice sites are functionally equivalent, as are all 3′ splice sites. It does not depend on specific secondary structures within a particular intron to identify its ends, and it is not tissue-specific: it can process most RNA precursors, regardless of which cell they come from.'},
  {t: T.coupling, nav: 'Read 5′ to 3′', title: 'Splice sites are read<br>in 5′ to 3′ order.', notes: NOTES.pairs, hold: 1.1,
    text: 'When several 5′ and 3′ splice sites are available, splicing often occurs as the pre-mRNA is still being transcribed. This temporal link imposes a direction: splice sites are recognized in a 5′ to 3′ order as they emerge from RNA polymerase II, much like a “first-come, first-served” system.'},
  {t: T.context, nav: 'Enhancers and silencers', title: 'Splicing enhancers<br>and silencers.', notes: NOTES.pairs, hold: 1.1,
    text: 'Splice sites are not functionally equivalent: their sequence strength and surrounding context determine how efficiently they are recognised. A functional splice site is defined by surrounding sequences in both exons and introns that act as splicing enhancers or splicing silencers, cis-regulatory elements. To be efficiently recognized, it must have a dominant set of enhancing elements over suppressing ones.'},
  {t: T.cryptic, nav: 'A mutated branch site', title: 'The branch site’s A<br>is mutated.', notes: NOTES.lariat, hold: 1.05,
    text: 'The branch site identifies the nearest 3′ splice site to be used in the second reaction. Here its critical A is mutated. Nearby are related sequences, cryptic sites, one 28 and one 40 nucleotides upstream of the 3′ splice site.',
    predict: {id: 'cryptic', question: 'Which site is used as the branch site?', choices: [
      {text: 'The cryptic site nearest the 3′ splice site', correct: true},
      {text: 'The cryptic site farthest from it', correct: false, reply: 'Proximity to the 3′ splice site is a critical factor: the nearest related sequence is used.'},
      {text: 'Neither: the intron stays', correct: false, reply: 'Especially in multicellular eukaryotes, nearby related sequences, cryptic sites, can be used in its place.'}]}},
  {t: T.used, nav: 'The nearest cryptic site', title: 'The cryptic site nearest<br>the 3′ splice site is used.', notes: NOTES.lariat, hold: 1.1,
    text: 'If the authentic branch site is mutated, especially in multicellular eukaryotes, the splicing machinery may use nearby, related sequences called cryptic sites: here the one nearest the 3′ splice site forms the lariat. This demonstrates that proximity to the 3′ splice site is a critical factor for branch site function.'},
];

// ---------- Loops and splicing in a row ----------
// A balloon of a given length from PL (5′ foot) to PR (3′ foot): down a short neck from each foot, round a circle.
function balloon(PL, PR, length, d, sd, neck) {
  const mid = PL.clone().add(PR).multiplyScalar(.5), gap = PL.distanceTo(PR);
  const make = R => {
    const C = mid.clone().addScaledVector(sd, neck + R), th0 = Math.min(1.3, Math.asin(Math.min(1, (gap / 2 + .7 * S) / R)) + .2);
    const pts = [PL.clone(), PL.clone().addScaledVector(sd, neck * .6)];
    for (let k = 0; k <= 12; k++) { const th = th0 + (2 * Math.PI - 2 * th0) * k / 12; pts.push(C.clone().addScaledVector(sd, -R * Math.cos(th)).addScaledVector(d, -R * Math.sin(th))); }
    pts.push(PR.clone().addScaledVector(sd, neck * .6), PR.clone());
    const c = new THREE.CatmullRomCurve3(pts, false, 'centripetal'); c.arcLengthDivisions = 240; return c;
  };
  let lo = 2, hi = 300;
  for (let k = 0; k < 26; k++) { const R = (lo + hi) / 2; if (make(R).getLength() < length) lo = R; else hi = R; }
  return make((lo + hi) / 2);
}
// A pre-mRNA (exon 1 [0, e1), intron [e1, e2), exon 2 from e2) along a row (`dir`, 5′ → 3′), its intron looped out to
// `side`: each nucleotide laid by its distance back from the pivot (exon 2's first nucleotide) along a path: the row to
// the loop's 3′ foot (dR before the pivot), the loop, its 5′ foot (`gap` before the 3′ foot), the row on to the 5′ end;
// so every step keeps its length. Splicing: the gap closes, bringing the intron's 5′ end to the branch A at the loop's
// 3′ foot; exon 1 is cut free; the lariat swings back and up about the pivot; exon 1 slides along the row to the pivot,
// where the exons join; the lariat drifts off.
function createRowSplice({e1, e2, pivot, dir = X, side = Y, neck = 2.4 * S, swing = [.8, 1], drift = V(-8, -16, 60)}) {
  const d = dir.clone().normalize(), sd = side.clone().normalize(), up = d.clone().cross(sd).normalize(), at = pivot.clone();
  const q = new THREE.Quaternion(), q2 = new THREE.Quaternion();
  let cache = null;
  return {
    pivot: at,
    // {dR (Å), gap (Å), cut, swing, slide, away (0–1)}; fills out[0, n).
    pose(n, {dR, gap, cut = 0, swing: sw = 0, slide = 0, away = 0}, out) {
      const L = (e2 - e1) * S - dR, PR = at.clone().addScaledVector(d, -dR), PL = PR.clone().addScaledVector(d, -gap);
      const key = `${dR.toFixed(3)}|${gap.toFixed(3)}`;
      if (!cache || cache.key !== key) cache = {key, curve: balloon(PL, PR, L, d, sd, neck)};
      q.setFromAxisAngle(sd, swing[0] * sw); q2.setFromAxisAngle(up, swing[1] * sw); q.premultiply(q2);
      for (let i = 0; i < n; i++) {
        const s = (e2 - i) * S, p = out[i] ||= V();
        if (s <= dR) p.copy(at).addScaledVector(d, -s);
        else if (s < dR + L) cache.curve.getPointAt(clamp(1 - (s - dR) / L), p);
        else p.copy(PL).addScaledVector(d, -(s - dR - L));
        // Exon 1: drawn back a step by the cut, then slid until its last nucleotide is a step before the pivot.
        if (i < e1) p.addScaledVector(d, -1.2 * S * cut + (gap + dR + 1.2 * S * cut) * slide);
        else if (i < e2 && (sw > 0 || away > 0)) p.sub(at).applyQuaternion(q).add(at).addScaledVector(drift, away);
      }
      return out;
    },
  };
}
// A row of exons and introns, each intron looped out to `side` (its feet `gap` apart): parts [[length, kind]], kind
// 'exon' or 'intron'. Returns the points and each part's range.
function rowWithLoops(parts, {origin, dir = X, side = Y, gap = GAP, neck = 2.4 * S}) {
  const d = dir.clone().normalize(), sd = side.clone().normalize(), out = [], ranges = [];
  let at = origin.clone();
  for (const [m, kind] of parts) {
    const from = out.length;
    if (kind === 'intron') {
      const PL = at.clone(), PR = at.clone().addScaledVector(d, gap), c = balloon(PL, PR, (m - 1) * S, d, sd, neck);
      for (let k = 0; k < m; k++) out.push(c.getPointAt(k / (m - 1)));
      at = PR.clone().addScaledVector(d, S);
    } else {
      for (let k = 0; k < m; k++) { out.push(at.clone()); at.addScaledVector(d, S); }
    }
    ranges.push([from, out.length, kind]);
  }
  return {points: out, ranges};
}

// A backbone bond broken or made gradually (a splice's cut and join): two halves of the strand's own backbone, one
// from each nucleotide to the middle of the two (each in its nucleotide's colour), grown or shrunk together by w, so
// no stretch of backbone vanishes or appears in a frame. set(w, points) before the strand is posed.
const BREAK = .35;
function halfBonds(strand, i, j) {
  const mid = V(), a = strand.link(i, mid, {w: 0, backbone: true}), b = strand.link(j, mid, {w: 0, backbone: true});
  return {set(w, pts = strand.points) { mid.lerpVectors(pts[i], pts[j], .5); a.w = b.w = w; }};
}
// A splice's bonds (intron [e1, e2)), by time t: cut at C, exon 1 lets go of the intron; as exon 1 arrives, it
// reaches for exon 2, joined at J (the joined strand then takes over); and the lariat lets go of exon 2.
function spliceBonds(strand, e1, e2) {
  const cut = halfBonds(strand, e1 - 1, e1), made = halfBonds(strand, e1 - 1, e2), old = halfBonds(strand, e2 - 1, e2);
  return {set(t, cutOn, C, J, pts) {
    const joined = t >= J;
    cut.set(cutOn && !joined ? 1 - ramp(t, C, C + BREAK) : 0, pts); made.set(joined ? 0 : ramp(t, J - BREAK, J), pts);
    old.set(joined ? 1 - ramp(t, J, J + BREAK) : 0, pts);
  }};
}

// ---------- The molecules of each step ----------
// Step 1: four exons (8 nucleotides each) and three introns (26 each); the right and the wrong products below.
const MULTI = [[8, 'exon'], [26, 'intron'], [8, 'exon'], [26, 'intron'], [8, 'exon'], [26, 'intron'], [8, 'exon']];
const YP = -46, YRIGHT = 58, YWRONG = 92;
// Steps 2–3: the hybrid: the SV40 exon [0, 10), its intron's start [10, 38), β-globin's intron end [38, 64) with the
// branch A at 42, 22 nucleotides upstream of the 3′ splice site, and the β-globin exon [64, 74).
const HY = {n: 74, e1: 10, join: 38, branch: 42, e2: 64};
// Step 5: exon 1 [0, 14), intron [14, 54), exon 2 [54, 68); enhancers in exon 2 and in the intron, a silencer in the intron.
const CX = {n: 68, e1: 14, e2: 54, branch: 34, enhancers: [[57, 63], [38, 43]], silencer: [45, 50]};
// Steps 6–7: exon 1 [0, 6), a 70-nucleotide intron [6, 76), exon 2 [76, 82); the branch site's A 20 nucleotides
// upstream of the 3′ splice site, cryptic sites' A 28 and 40.
const CR = {n: 82, e1: 6, e2: 76, authentic: 56, near: 48, far: 36, start: 46};
// Step 4: a gene of three exons and two introns (34 and 38 nucleotides, each branch A 18 nucleotides upstream of
// its 3′ splice site), transcribed by RNAP II at a steady RATE (nucleotides a second) all through the step. The RNA's
// 5′ end leaves the polymerase at TX.at, nucleotide i at leaves(i); exon 3 is still being made at the step's end.
const GENE = [[8, 'exon'], [34, 'intron'], [16, 'exon'], [38, 'intron'], [74, 'exon']];
const GENE_RANGES = (() => { let a = 0; return GENE.map(([m, kind]) => { const r = [a, a + m, kind]; a += m; return r; }); })();
const GN = GENE_RANGES[GENE_RANGES.length - 1][1];
const INTRONS = GENE_RANGES.filter(r => r[2] === 'intron').map(([e1, e2]) => ({e1, e2, branch: e2 - 18}));
const RATE = 5, TX = {at: T.coupling + .6};
const leaves = i => TX.at + i / RATE;
// Each intron spliced as soon as its 3′ splice site is out, as splicing(r) does it, a little brisker: its 5′ end
// brought to the branch A as it loops out of the row, exon cut free, lariat swung off, exons slid together and joined.
const rowSplicing = F => ({fold: [F, F + 1.8], cut: [F + 1.9, F + 2.6], swing: [F + 2.7, F + 3.9], slide: [F + 3.9, F + 5.1], join: F + 5.1, away: [F + 5.4, F + 7.6]});
const CO = INTRONS.map(I => rowSplicing(leaves(I.e2) + .5));

const at = {};
const DIR = [.03, -.12, -1];

runScene({
  pageTitle: 'Splice sites in pairs · RNA splicing and processing', eyebrow: 'Splice sites in pairs',
  links: [{href: 'index.html', text: 'All scenes'}],
  steps, duration: T.end, notesPage: 'notes.html', fov: 26, fog: .00006, loop: false,
  shots: [
    {t: T.pairs, frame: () => at.frames.pairs},
    {t: T.hybrid, blend: 2.4, frame: () => at.frames.hybrid},
    {t: T.coupling, blend: 2.6, frame: () => at.frames.coupling},
    {t: T.context, blend: 2.6, frame: () => at.frames.context},
    {t: T.cryptic, blend: 2.4, frame: () => at.frames.cryptic},
  ],
  async build({world, progress}) {
    const set = await loadSurfaceSet('assets/splice_pairs.json', 'assets/splice_pairs.bin', progress);
    const strandOf = name => set.meta.strands.find(s => s.name === name);

    // ---------- Step 1: three introns ----------
    const multiRow = rowWithLoops(MULTI, {origin: V(-(4 * 7 * S + 3 * (2 * S + GAP)) / 2, YP, 0)});
    const multi = createStrand(world, multiRow.points.length);
    const exonColour = k => k === 2 ? EXON2 : EXON;
    multi.stretches(multiRow.ranges.map(([a, b, kind], k) => [a, b, kind === 'exon' ? exonColour(k) : INTRON]));
    multi.pose(multiRow.points);
    const exonsOf = multiRow.ranges.filter(r => r[2] === 'exon'), intronsOf = multiRow.ranges.filter(r => r[2] === 'intron');
    // The products: every exon (right), or exons 1, 3 and 4 (exon 2 lost with introns 1 and 2).
    const product = (which, y) => {
      const n = which.length * 8, s = createStrand(world, n);
      s.stretches(which.map((k, j) => [j * 8, j * 8 + 8, exonColour(2 * k)]));
      s.pose(line(n, {origin: V(-(n - 1) * S / 2, y, 0), direction: X})); return s;
    };
    const right = product([0, 1, 2, 3], YRIGHT), wrong = product([0, 2, 3], YWRONG);
    // Pairs joined, drawn as arcs over the row from a 5′ splice site to a 3′ splice site: the right pairs, then a wrong one.
    const arcMaterial = (c) => { const m = baseMaterial(c, {emissive: c, emissiveIntensity: .45, roughness: .5}); return m; };
    const junction5 = r => multiRow.points[r[0]].clone().lerp(multiRow.points[r[0] - 1], .5), junction3 = r => multiRow.points[r[1] - 1].clone().lerp(multiRow.points[r[1]], .5);
    const pairArc = (a, b, height, colour) => {
      const mid = a.clone().lerp(b, .5).add(V(0, -height, 0)), curve = new THREE.QuadraticBezierCurve3(a.clone().add(V(0, -6, 0)), mid, b.clone().add(V(0, -6, 0)));
      const mesh = new THREE.Mesh(new THREE.TubeGeometry(curve, 40, .55, 8, false), arcMaterial(colour)); world.add(mesh);
      const points = curve.getPoints(12);
      return {mesh, opacity(v) { fade(mesh.material, v); mesh.visible = v > 0; this.alpha = v; }, alpha: 0, extent: () => points.map(p => p.toArray())};
    };
    const rightArcs = intronsOf.map(r => pairArc(junction5(r), junction3(r), 16, 0xd8f0e4));
    const wrongArc = pairArc(junction5(intronsOf[0]), junction3(intronsOf[1]), 34, SITE);

    // ---------- Steps 2–3: the hybrid intron ----------
    const hybrid = createStrand(world, HY.n).stretches([[0, HY.e1, SV40.exon], [HY.e1, HY.join, SV40.intron], [HY.join, HY.e2, GLOBIN.intron], [HY.e2, HY.n, GLOBIN.exon]]);
    const hyRow = createRowSplice({e1: HY.e1, e2: HY.e2, pivot: V((22 * S + GAP + S) / 2, 0, 0)});
    const hyPts = Array.from({length: HY.n}, () => V()), hyBond = hybrid.link(HY.branch, HY.e1, {w: 0, colour: lighter(SPLICING.cap, .2)});
    const HS = splicing(T.result), HY_MEET = T.hybrid + 6;   // (the two parts meet as their approach ends)
    const hyMeet = halfBonds(hybrid, HY.join - 1, HY.join), hySplice = spliceBonds(hybrid, HY.e1, HY.e2);

    // ---------- Step 5: enhancers and silencers ----------
    const context = createStrand(world, CX.n);
    const cxRow = createRowSplice({e1: CX.e1, e2: CX.e2, pivot: V(((CX.e2 - CX.branch) * S + GAP + S) / 2 + 2 * S, 0, 0)});
    const cxPts = cxRow.pose(CX.n, {dR: (CX.e2 - CX.branch) * S, gap: GAP}, []);
    const base = i => i < CX.e1 || i >= CX.e2 ? EXON : INTRON;
    const inside = (i, [a, b]) => i >= a && i < b;
    // The 3′ splice site's ring: how well it is recognised, in its glow.
    const ringMaterial = baseMaterial(0xfff1d6, {emissive: 0xffe2b0, emissiveIntensity: .2, roughness: .4});
    const ring = new THREE.Mesh(new THREE.TorusGeometry(6.2, .62, 10, 40), ringMaterial); world.add(ring);
    ring.position.copy(cxPts[CX.e2 - 1]).lerp(cxPts[CX.e2], .5); ring.rotation.y = Math.PI / 2;

    // ---------- Steps 6–7: cryptic sites ----------
    const cryptic = createStrand(world, CR.n);
    const crRow = createRowSplice({e1: CR.e1, e2: CR.e2, pivot: V((CR.start * S + GAP + S) / 2 - 1 * S, 0, 0)});
    const crPts = Array.from({length: CR.n}, () => V()), crBond = cryptic.link(CR.near, CR.e1, {w: 0, colour: lighter(SPLICING.cap, .2)});
    const CS = splicing(T.used), crSplice = spliceBonds(cryptic, CR.e1, CR.e2);
    const crSeq = (mutated) => {
      // Bases shown at the three branch-like sites only.
      const seq = Array.from({length: CR.n}, () => '-');
      // Branch-like heptamers round each A (CUAAC-like): the authentic UACUAAC, cryptic CUGAC and CUCAC.
      const put = (a, s) => [...s].forEach((ch, k) => { seq[a - s.indexOf('*') + k] = ch === '*' ? 'A' : ch; });
      put(CR.authentic, 'UACUA*C'); put(CR.near, 'CUG*C'); put(CR.far, 'CUC*C');
      if (mutated) seq[CR.authentic] = 'C';
      return seq.join('');
    };
    const heptamer = a => [a - 5, a + 2];
    cryptic.stretches([[0, CR.e1, EXON], [CR.e1, CR.e2, INTRON], [CR.e2, CR.n, EXON], [...heptamer(CR.authentic), lighter(SITE, .1)],
      [...heptamer(CR.near), CRYPTIC], [...heptamer(CR.far), CRYPTIC]]);

    // ---------- Step 4: RNA polymerase II transcribing ----------
    const ec = new THREE.Group(); world.add(ec);
    const polRec = set.byName.get('RNAP II'), pol = new THREE.Mesh(surfaceGeometry(polRec, set.buffer), proteinMaterial(POL2)); ec.add(pol);
    const tmpl = strandOf('template'), nontmpl = strandOf('non-template'), rnaS = strandOf('RNA');
    const allPairs = pairsFromStrands(tmpl, nontmpl), bdna = pairsFromStrands(strandOf('a'), strandOf('b'));
    frameFromPairs(bdna); const local = meanLocal(bdna.slice(1, -1));
    // The structure's two duplexes: downstream (template 1–23, ahead of the active site) and upstream (35–48).
    const runOf = (lo, hi) => allPairs.filter(p => p.a.num >= lo && p.a.num <= hi);
    const downPairs = runOf(1, 23), upPairs = runOf(35, 48);
    const downFrames = frameFromPairs(downPairs), upFrames = frameFromPairs(upPairs);
    // The template pairs with the RNA's 3′ end at template 25 (the active site): pair at template j is 25 − j ahead.
    // Ideal arms: a short one downstream (the gene just ahead), a longer one upstream, under the RNA's row.
    const AHEAD = 0, BEHIND = 34;
    const downAll = extend(downFrames, AHEAD, 0), upAll = extend(upFrames, 0, BEHIND);
    const aheadOf = [...Array.from({length: AHEAD}, (_, k) => 25 - (1 - (AHEAD - k))), ...downPairs.map(p => 25 - p.a.num)];
    const behindOf = [...upPairs.map(p => p.a.num - 25), ...Array.from({length: BEHIND}, (_, k) => 48 - 25 + k + 1)];
    const duplex = (frames) => { const d = createDuplex({pairs: sequencePairs('G'.repeat(frames.length), local), samples: 3}); ec.add(d.group); d.pose(frames); return d; };
    const downDNA = duplex(downAll), upDNA = duplex(upAll);
    const rnaPts = rnaS.backbone.map(b => V(...b)).reverse();   // 3′ end first
    // Turn the complex so the downstream DNA runs to the right and the RNA leaves upwards.
    const outward = downFrames.slice(0, 6).reduce((s, f) => s.add(V(0, 0, -1).applyQuaternion(f.q)), V()).normalize();
    const exit = rnaPts[rnaPts.length - 1].clone(), exitDir = exit.clone().sub(rnaPts[rnaPts.length - 4]).normalize();
    const yAxis = exitDir.clone().addScaledVector(outward, -exitDir.dot(outward)).normalize().negate(), zAxis = outward.clone().cross(yAxis);
    ec.quaternion.setFromRotationMatrix(new THREE.Matrix4().makeBasis(outward, yAxis, zAxis).transpose());
    ec.updateMatrixWorld(true);
    const toWorld = v => v.clone().applyQuaternion(ec.quaternion);
    // The RNA's path, by distance σ from the active site (where its 3′ end is made) outwards: back along the
    // structure's RNA (3′ → 5′) to the exit channel, up a short way and round into a straight row running left,
    // upstream (the 5′ end trailing away from the polymerase), its introns looping up out of it, away from the
    // polymerase. Before the active site (σ < 0), straight on: where nucleotides not yet made wait, undrawn.
    const inPol = rnaPts.map(toWorld), exitW = inPol[inPol.length - 1], exitDirW = toWorld(exitDir);
    const ROW = V(-1, 0, 0), UP = V(0, -1, 0), RISE = 18, TURN = 12;
    const Q0 = exitW.clone().addScaledVector(exitDirW, 4), Q1 = Q0.clone().addScaledVector(exitDirW, (exitW.y - RISE - Q0.y) / exitDirW.y);
    const Q2 = Q1.clone().addScaledVector(ROW, TURN);
    const lead = new THREE.CurvePath();
    lead.add(new THREE.CatmullRomCurve3([...inPol, Q0], false, 'centripetal')); lead.add(new THREE.QuadraticBezierCurve3(Q0, Q1, Q2));
    const leadLength = lead.getLength(), back = inPol[0].clone().sub(inPol[1]).normalize();
    const inPolLength = lead.curves[0].getLength();
    at.held = inPolLength;   // (tests: the RNA held in the polymerase, Å)
    const pathAt = (s, out) => s <= 0 ? out.copy(inPol[0]).addScaledVector(back, -s) : s < leadLength ? lead.getPoint(s / leadLength, out) : out.copy(Q2).addScaledVector(ROW, s - leadLength);
    // How far along the path the next nucleotide lies, `gap` from one at s in a straight line (as the strand's steps
    // are measured: through the polymerase's bends a chord is shorter than the arc it spans).
    const pA = V(), pB = V();
    const advance = (s, gap) => {
      if (s + gap <= 0 || s >= leadLength) return s + gap;
      pathAt(s, pA);
      let lo = s + gap, hi = s + 1.6 * gap;
      if (pathAt(lo, pB).distanceTo(pA) >= gap - 1e-4) return lo;
      for (let k = 0; k < 18; k++) { const m = (lo + hi) / 2; if (pathAt(m, pB).distanceTo(pA) < gap) lo = m; else hi = m; }
      return (lo + hi) / 2;
    };
    const nascent = createStrand(world, GN).stretches(GENE_RANGES.map(([a, b, kind], k) => [a, b, kind === 'intron' ? INTRON : k === 2 ? EXON2 : EXON]));
    const nascentPts = Array.from({length: GN}, () => V());
    const bonds = INTRONS.map(I => nascent.link(I.branch, I.e1, {w: 0, colour: lighter(SPLICING.cap, .2)}));
    const splices = INTRONS.map(I => spliceBonds(nascent, I.e1, I.e2));
    // Each intron's lariat as it is cut out, from the pivot (the next exon's first nucleotide): its 3′ part along the
    // row, its 5′ end one step from the branch A, the ring between looped up (fixed: the row is straight there).
    const lariatShape = INTRONS.map(I => {
      const A = ROW.clone().multiplyScalar((I.e2 - I.branch) * S), G = ROW.clone().multiplyScalar((I.e2 - I.branch + 1) * S);
      const ring = loopBetween(G, A, I.branch - I.e1 - 1, {toward: UP});
      return Array.from({length: I.e2 - I.e1}, (_, k) => { const i = I.e1 + k; return i === I.e1 ? G : i < I.branch ? ring[i - I.e1 - 1] : ROW.clone().multiplyScalar((I.e2 - i) * S); });
    });
    // The lariat swings up and back about the pivot, then drifts off.
    const SWING = [-.55, -.45], SWING_AXIS = [UP, V(1, 0, 0).cross(UP)], DRIFT = V(-4, -4, 80), sigma = new Float64Array(GN);
    const q = new THREE.Quaternion(), q2 = new THREE.Quaternion();
    // Through the polymerase's bends the walk's steps take a little more path than they add up to, by an amount that
    // changes as each nucleotide moves through (a cycle a nucleotide, five a second): left alone, everything beyond it,
    // the row with its loops and lariats, would surge and slow with it. That change (from its mean, by the phase of the
    // nucleotide being made) is taken out gradually along the RNA inside the polymerase, all of it by its exit, so the
    // RNA leaves the polymerase and runs along the row at one steady rate (each step inside changed by under 0.1 Å).
    const PHASES = 48, excess = Array.from({length: PHASES + 1}, (_, k) => {
      const s0 = (k / PHASES - 1) * S; let s = s0, m = 0;
      while (s < leadLength) { s = advance(s, S); m++; }
      return s - s0 - m * S;
    });
    const meanExcess = excess.slice(0, PHASES).reduce((x, y) => x + y, 0) / PHASES;
    const surge = made => { const f = (made - Math.floor(made)) * PHASES, k = Math.floor(f); return mix(excess[k], excess[k + 1], f - k) - meanExcess; };
    // Lays the RNA for `made` nucleotides and each intron's splicing weights st[k] ({fold, cut, swing, slide, away},
    // 0–1), walking from the 3′ end: every nucleotide one step along the path from the last, but an intron folding
    // brings its 5′ end towards its branch A (the ring between lifted out, loopBetween); cut, the lariat leaves the
    // row (posed from the pivot) and the exon before it slides along the row to the pivot.
    const layNascent = (made, st, out) => {
      let s = 0, prev = -1;
      const shift = surge(made);
      for (let i = GN - 1; i >= 0; i--) {
        let gap = S, skip = false;
        INTRONS.forEach((I, k) => {
          const w = st[k];
          if (w.cut > 0) { if (i >= I.e1 && i < I.e2) skip = true; else if (i === I.e1 - 1) gap = mix((I.e2 - I.branch + 2 + 1.2 * w.cut) * S, S, w.slide); }
          else if (w.fold > 0) { if (i > I.e1 && i < I.branch) skip = true; else if (i === I.e1) gap = mix((I.branch - I.e1) * S, S, w.fold); }
        });
        if (skip) continue;
        s = prev < 0 ? (made - 1 - i) * S : advance(s, gap);
        prev = i;
        sigma[i] = s - shift * clamp(s / inPolLength);
        pathAt(sigma[i], out[i]);
      }
      INTRONS.forEach((I, k) => {
        const w = st[k];
        if (w.cut > 0) {
          q.setFromAxisAngle(SWING_AXIS[0], SWING[0] * w.swing); q2.setFromAxisAngle(SWING_AXIS[1], SWING[1] * w.swing); q.premultiply(q2);
          const pivot = out[I.e2];
          lariatShape[k].forEach((p, j) => out[I.e1 + j].copy(p).applyQuaternion(q).add(pivot).addScaledVector(DRIFT, w.away));
        } else if (w.fold > 0) loopBetween(out[I.e1], out[I.branch], I.branch - I.e1 - 1, {toward: UP, out: out.slice(I.e1 + 1, I.branch)});
      });
      return out;
    };
    const geneColour = (g, k) => { const r = GENE_RANGES.findIndex(([a, b]) => g >= a && g < b), plain = k ? STRANDS.coding : STRANDS.template;
      if (r < 0) return plain;
      const exon = GENE_RANGES[r][2] === 'exon';
      return new THREE.Color(plain).lerp(new THREE.Color(!exon ? 0x8d83c4 : r === 2 ? EXON2 : EXON), exon ? .7 : .45).getHex(); };
    // Splice sites, in the order they leave the polymerase (intron 1's 5′ and 3′ sites, then intron 2's), each named
    // from when it is out until it is spliced: a 5′ site at the cut, a 3′ site as the exons join.
    const SITES = INTRONS.flatMap((I, k) => [{i: I.e1, name: '5′ splice site', until: CO[k].cut[0]}, {i: I.e2, name: '3′ splice site', until: CO[k].join}]);
    let lastMade = null;
    const geneHex = [new Map(), new Map()], gene = (g, k) => { let c = geneHex[k].get(g); if (c === undefined) geneHex[k].set(g, c = geneColour(g, k)); return c; };
    const cA = new THREE.Color(), cB = new THREE.Color();
    const colourDNA = m => {
      const key = m.toFixed(4); if (key === lastMade) return; lastMade = key;
      // Runs of pairs of one colour on each strand (the gene's position at each pair: ahead of or behind the active
      // site). That position moves on a pair as each nucleotide is made; meanwhile each pair's colour passes from the
      // one to the next, so the gene's stretches glide along the DNA instead of stepping.
      const k = Math.floor(m), f = m - k;
      const runs = (ahead, sign, strand) => {
        const list = [];
        ahead.forEach((a, j) => {
          const c0 = gene(k + sign * a, strand), c1 = gene(k + 1 + sign * a, strand), c = c0 === c1 ? c0 : cA.setHex(c0).lerp(cB.setHex(c1), f).getHex();
          const last = list[list.length - 1];
          if (last && last[2] === c) last[1] = j + 1; else list.push([j, j + 1, c]);
        });
        return list;
      };
      for (const [d, ahead, sign] of [[downDNA, aheadOf, 1], [upDNA, behindOf, -1]]) { d.segments(0, runs(ahead, sign, 0)); d.segments(1, runs(ahead, sign, 1)); }
      downDNA.pose(downAll); upDNA.pose(upAll);
    };

    // Points of everything drawn now (world): for the shots and the tests.
    const strands = [multi, right, wrong, hybrid, context, cryptic, nascent];
    const shownPoints = () => {
      const out = [];
      for (const s of strands) if (s.alpha > 0) out.push(...s.extent());
      for (const a of [...rightArcs, wrongArc]) if (a.alpha > 0) out.push(...a.extent());
      if (ring.visible) out.push(...[[6, 0], [-6, 0], [0, 6], [0, -6]].map(([y, z]) => ring.localToWorld(V(y, z, 0)).toArray()));
      if (ec.visible) {
        const g = pol.geometry.attributes.position, v = V();
        for (let k = 0; k < g.count; k += 40) out.push(pol.localToWorld(v.fromBufferAttribute(g, k)).toArray());
        for (const d of [downDNA, upDNA]) for (let i = 0; i < d.world.aBackbone.length; i += 4) out.push(ec.localToWorld(d.world.aBackbone[i].clone()).toArray(), ec.localToWorld(d.world.bBackbone[i].clone()).toArray());
      }
      return out;
    };
    at.shown = shownPoints;
    // The polymerase's topmost point (world), for its label.
    const polTop = (() => { const g = pol.geometry.attributes.position, v = V(), top = V(0, Infinity, 0); for (let k = 0; k < g.count; k++) { pol.localToWorld(v.fromBufferAttribute(g, k)); if (v.y < top.y) top.copy(v); } return top; })();

    let pxPerA = 1;
    const content = {
      multi, right, wrong, hybrid, context, cryptic, nascent, at,  // for tests (?debug=1)
      update(t, {pxPerA: px = 1, answers = {}} = {}) {
        pxPerA = px;
        // Each step's molecules: out as the camera leaves (after the beat that ends the step), in once it arrives.
        const span = (a, b, inAt = 1.7) => ramp(t, a + inAt, a + inAt + .8) * (1 - ramp(t, b - .8, b - .2));

        // Step 1.
        const s1 = (t < T.hybrid ? ramp(t, .3, 1.3) : 1) * (1 - ramp(t, T.hybrid - .8, T.hybrid - .2));
        multi.view(pxPerA).opacity(s1);
        const rightIn = ramp(t, 8.6, 9.6) * s1, wrongIn = ramp(t, 12.2, 13.2) * s1;
        right.view(pxPerA).opacity(rightIn); wrong.view(pxPerA).opacity(wrongIn);
        rightArcs.forEach(a => a.opacity(rightIn)); wrongArc.opacity(wrongIn);

        // Steps 2–3: the hybrid's two parts come together, then (step 3) the intron is removed.
        const hyShown = span(T.hybrid, T.coupling);
        const apart = 70 * (1 - smooth(ramp(t, T.hybrid + 2.6, T.hybrid + 6)));
        const w = {cut: ramp(t, ...HS.cut), swing: smooth(ramp(t, ...HS.swing)), slide: smooth(ramp(t, ...HS.slide)), away: smooth(ramp(t, ...HS.away))};
        hyRow.pose(HY.n, {dR: (HY.e2 - HY.branch) * S, gap: mix(GAP, S, smooth(ramp(t, ...HS.fold))), ...w}, hyPts);
        if (apart > .01) for (let i = 0; i < HY.n; i++) hyPts[i].x += i < HY.join ? -apart : apart;
        const hyJoined = t >= HS.join;
        const meeting = t < HY_MEET;
        hybrid.pieces(meeting ? [[0, HY.join], [HY.join, HY.n]] : w.cut > 0 ? hyJoined ? [[[0, HY.e1], [HY.e2, HY.n]], {ranges: [[HY.e1, HY.e2]], opacity: 1 - ramp(t, HS.away[0] + .6, HS.away[1])}] : [[0, HY.e1], [HY.e1, HY.n]] : null);
        hyBond.w = w.cut;
        hyMeet.set(meeting ? ramp(t, HY_MEET - BREAK, HY_MEET) : 0, hyPts); hySplice.set(t, w.cut > 0, HS.cut[0], HS.join, hyPts);
        if (hyShown > 0) hybrid.pose(hyPts);
        hybrid.view(pxPerA).opacity(hyShown);
        at.hybridApart = apart; at.hybridSpliced = hyJoined;

        // Step 4: transcription at a steady rate (the polymerase holds inPolLength of RNA), each intron spliced out as
        // soon as its 3′ splice site is out: exon 1 joined to exon 2 before intron 2's 3′ splice site is made.
        const ecShown = span(T.coupling, T.context);
        fadeObject(ec, ecShown);
        const made = Math.min(GN, Math.max(0, inPolLength / S + RATE * (t - TX.at)));
        at.made = made;
        const st = CO.map(c => ({fold: smooth(ramp(t, ...c.fold)), cut: ramp(t, ...c.cut), swing: smooth(ramp(t, ...c.swing)), slide: smooth(ramp(t, ...c.slide)), away: smooth(ramp(t, ...c.away))}));
        // Pieces: one strand; an exon cut free of its intron; exons joined, the lariat fading on its own.
        let main = [[0, GN]], split = null;
        const lariats = [];
        INTRONS.forEach((I, k) => {
          if (t >= CO[k].join) {
            main = main.flatMap(([a, b]) => a < I.e1 && b > I.e2 ? [[a, I.e1], [I.e2, b]] : [[a, b]]);
            const o = 1 - ramp(t, CO[k].away[0] + .6, CO[k].away[1]);
            if (o > 0) lariats.push({ranges: [[I.e1, I.e2]], opacity: o});
          } else if (st[k].cut > 0) split = I.e1;
          bonds[k].w = st[k].cut;
        });
        const parts = split === null ? [main] : [main.flatMap(([a, b]) => b <= split ? [[a, b]] : a < split ? [[a, split]] : []), main.flatMap(([a, b]) => a >= split ? [[a, b]] : b > split ? [[split, b]] : [])];
        nascent.pieces(parts.length === 1 && main.length === 1 && !lariats.length ? null : [...parts, ...lariats]);
        at.introns = INTRONS; at.co = CO; at.spliced = INTRONS.map((I, k) => t >= CO[k].join); at.lariat = INTRONS.map((I, k) => t < CO[k].cut[0] ? null : 1 - ramp(t, CO[k].away[0] + .6, CO[k].away[1]));
        if (ecShown > 0) {
          colourDNA(made);
          layNascent(made, st, nascentPts);
          splices.forEach((b, k) => b.set(t, st[k].cut > 0, CO[k].cut[0], CO[k].join, nascentPts));
          nascent.reveal(made).pose(nascentPts);
          downDNA.view(pxPerA); upDNA.view(pxPerA);
        }
        nascent.view(pxPerA).opacity(made > .05 ? ecShown : 0);

        // Step 5: enhancers and silencers round a 3′ splice site.
        const cxShown = span(T.context, T.cryptic);
        const enh = ramp(t, T.context + 4.6, T.context + 5.8), sil = ramp(t, T.context + 7.6, T.context + 8.8);
        const cA = new THREE.Color(), cB = new THREE.Color();
        context.colours(i => {
          const c = base(i);
          if (CX.enhancers.some(r => inside(i, r))) return cA.set(c).lerp(cB.set(ENHANCER), enh).getHex();
          if (inside(i, CX.silencer)) return cA.set(c).lerp(cB.set(SILENCER), sil).getHex();
          return c;
        });
        if (cxShown > 0) context.pose(cxPts);
        context.view(pxPerA).opacity(cxShown);
        const strength = .15 + 1.1 * enh - .45 * sil + .25 * ramp(t, T.context + 10.2, T.context + 11);
        ringMaterial.emissiveIntensity = clamp(strength) * 1.4; at.recognised = +clamp(strength).toFixed(3);
        fade(ringMaterial, ramp(t, T.context + 2.4, T.context + 3.2) * cxShown); ring.visible = ringMaterial.opacity > 0;

        // Steps 6–7: the branch site mutated; the nearest cryptic site used.
        const crShown = span(T.cryptic, T.end + 10);
        const mutated = t > T.cryptic + 5;
        const seq = crSeq(mutated); if (seq !== at.crSeq) { cryptic.letters(seq, 1); at.crSeq = seq; }
        const v = {cut: ramp(t, ...CS.cut), swing: smooth(ramp(t, ...CS.swing)), slide: smooth(ramp(t, ...CS.slide)), away: smooth(ramp(t, ...CS.away))};
        const fold = smooth(ramp(t, ...CS.fold));
        crRow.pose(CR.n, {dR: mix(CR.start, CR.e2 - CR.near, fold) * S, gap: mix(GAP, S, fold), ...v}, crPts);
        const crJoined = t >= CS.join;
        cryptic.pieces(v.cut > 0 ? crJoined ? [[[0, CR.e1], [CR.e2, CR.n]], {ranges: [[CR.e1, CR.e2]], opacity: 1 - ramp(t, CS.away[0] + .6, CS.away[1])}] : [[0, CR.e1], [CR.e1, CR.n]] : null);
        crBond.w = v.cut; crSplice.set(t, v.cut > 0, CS.cut[0], CS.join, crPts);
        if (crShown > 0) cryptic.pose(crPts);
        cryptic.view(pxPerA).opacity(crShown);
        at.branchUsed = v.cut > 0 ? CR.near : null; at.crypticSpliced = crJoined; at.mutated = mutated;
        at.answers = answers;
      },
      annotate(t, {label, tag, bracket}) {
        const W = (s, i) => s.world(i);
        if (t < T.hybrid) {
          if (multi.alpha < .9) return;
          const I1 = intronsOf[0], I2 = intronsOf[1];
          if (t > 1.4 && t < 8.4) label(W(multi, I2[0] + 13), 'Pre-mRNA', 'Four exons, three introns', label$(INK.intron));
          if (t > 2.6 && t < 8.4) intronsOf.forEach(r => { tag(W(multi, r[0]).add(V(-2, -9, 0)), 'GU', label$(BASES.G)); tag(W(multi, r[1] - 1).add(V(2, -9, 0)), 'AG', label$(BASES.A)); });
          if (t > 5 && t < 8.4) label(W(multi, I1[0] + 13), 'No complementarity', 'An intron’s ends cannot base-pair', {...label$(INK.intron), side: 'left'});
          if (t > 9.6) label(right.world(4), 'Right pairs', 'Every exon kept', {...label$(EXON), side: 'left'});
          if (t > 9.6) tag(W(multi, exonsOf[1][0] + 4).add(V(0, -12, 0)), 'Exon 2', label$(EXON2));
          if (t > 13.2) label(wrong.world(20), 'Wrong junctions paired', 'Exon 2 removed', {...label$(SITE), side: 'right', below: true});
          return;
        }
        if (t < T.coupling) {
          if (hybrid.alpha < .9) return;
          if (t < T.hybrid + 6.2) {
            label(W(hybrid, 4), 'SV40 exon', 'With its 5′ splice site', {...label$(SV40.exon), side: 'left'});
            label(W(hybrid, HY.n - 4), 'Mouse β-globin exon', 'With its 3′ splice site', {...label$(GLOBIN.exon), side: 'right'});
          } else if (t < T.result) label(W(hybrid, 26), 'Hybrid intron', 'Its ends from two genes', {...label$(INK.globinIntron), below: true});
          else {
            const S3 = HS;
            if (t > S3.cut[0] + .4 && t < S3.slide[0]) label(W(hybrid, HY.e1).lerp(W(hybrid, HY.branch), .5), 'Lariat', 'The hybrid intron, cut out', label$(INK.intron));
            if (t > S3.away[1] - .6) label(W(hybrid, HY.e2), 'Exons joined', 'SV40 to β-globin', label$(GLOBIN.exon));
          }
          return;
        }
        if (t < T.context) {
          if (!ec.visible || fadeOpacity(ec) < .9) return;
          // The polymerase (above it), then the gene it transcribes (below the RNA's row), clear of the RNA leaving it.
          if (t < TX.at + 4.8) label(polTop.clone(), 'RNA polymerase II', 'Transcribing the gene', label$(POL2));
          else if (t < TX.at + 8) label(ec.localToWorld(upDNA.world.aBackbone[upDNA.world.aBackbone.length - 6].clone()), 'Gene', 'Its exons and introns', {...label$(STRANDS.template), side: 'left', below: true});
          // Each splice site named, in order, from when it is out of the polymerase until it is spliced: 5′ sites
          // below the row, 3′ sites above it, so neither hides the other as an intron's ends close in (offsets in
          // screen pixels, px(n) Å). A bracket runs level under the row, from the 3′ site (wherever it is) back to the
          // 5′ site.
          const px = n => n / Math.max(.1, pxPerA), out = i => sigma[i] > inPolLength + S;
          const junction = (i, y) => nascent.world(i).addScaledVector(ROW, S / 2).add(V(0, y, 0));
          const level = (i, y) => { const p = junction(i, 0); p.y = Q2.y + y; return p; };
          SITES.forEach(({i, name, until}, k) => { if (out(i) && t < until) tag(junction(i, px(k % 2 ? -16 : 16)), `${k + 1} · ${name}`, label$(k % 2 ? EXON : INK.intron)); });
          // Each intron's two sites, paired as soon as its 3′ site is out; its lariat, named until the exons join.
          INTRONS.forEach((I, k) => {
            const c = CO[k];
            if (out(I.e2) && t < c.swing[0]) bracket(level(I.e2, px(36)), level(I.e1, px(36)), k ? 'Then intron 2' : 'Intron 1: paired first');
            if (t > c.cut[0] + .3 && t < c.join + .1) label(nascent.world(I.e1).lerp(nascent.world(I.branch), .5).add(V(0, -14, 0)), 'Lariat', `Intron ${k + 1}, cut out`, {...label$(INK.intron), key: `lariat ${k}`});
          });
          // The joined exons named from exon 1 (left of the junctions, so the callout keeps its place as the RNA moves),
          // the last below the row, clear of the leaving lariat.
          if (t > CO[0].join + .3 && t < CO[1].fold[0]) label(nascent.world(INTRONS[0].e1 - 4), 'Exons 1 and 2 joined', 'Before intron 2’s 3′ splice site is made', label$(EXON2));
          if (t > CO[1].join + .3) label(nascent.world(INTRONS[0].e1 - 4), 'Exons joined in 5′ to 3′ order', 'Exon 1, exon 2, exon 3', {...label$(EXON), below: true});
          return;
        }
        if (t < T.cryptic) {
          if (context.alpha < .9) return;
          if (t > T.context + 3 && t < T.context + 11) label(ring.position.clone().add(V(0, -8, 0)), '3′ splice site', 'Its core consensus', label$(0xfff1d6));
          if (t > T.context + 5.4) label(W(context, 60), 'Splicing enhancer', 'In an exon', {...label$(ENHANCER), side: 'right'});
          if (t > T.context + 6.4) label(W(context, 40), 'Splicing enhancer', 'In the intron', {...label$(ENHANCER), side: 'left', key: 'enhancer 2'});
          if (t > T.context + 8.4) label(W(context, 47), 'Splicing silencer', 'In the intron', {...label$(SILENCER), below: true});
          if (t > T.context + 11) label(ring.position.clone().add(V(0, -8, 0)), 'Recognised', 'Enhancers dominate', label$(0xfff1d6));
          return;
        }
        if (cryptic.alpha < .9) return;
        if (t < T.used) {
          if (t < T.cryptic + 5.4) label(W(cryptic, CR.authentic), 'Branch site', 'Its A essential', label$(SITE));
          else label(W(cryptic, CR.authentic), 'Branch site mutated', 'A → C', label$(SITE));
          if (t > T.cryptic + 7.4) { tag(W(cryptic, CR.near).add(V(0, -9, 0)), 'Cryptic · 28', label$(CRYPTIC)); tag(W(cryptic, CR.far).add(V(0, 18, 0)), 'Cryptic · 40', label$(CRYPTIC)); }
          if (t > T.cryptic + 8.6) bracket(W(cryptic, CR.near).add(V(0, 9, 0)), W(cryptic, CR.e2 - 1).add(V(0, 9, 0)), '28 nucleotides');
          return;
        }
        // (Named on its left: as the lariat swings up past the middle of the view, a callout on its right would no longer
        // fit and would glide across to the other side.)
        if (t > CS.cut[0] + .4 && t < CS.slide[0]) label(W(cryptic, CR.near), 'Cryptic site used', 'The nearest to the 3′ splice site', {...label$(CRYPTIC), side: 'left'});
        if (t > CS.away[1] - .6) label(W(cryptic, CR.e2), 'Exons joined', 'Through the cryptic site’s lariat', label$(EXON));
      },
    };
    const fadeOpacity = obj => { let o = 1; obj.traverse(x => { if (x.material?.opacity !== undefined && x.visible) o = Math.min(o, x.material.transparent ? x.material.opacity : 1); }); return o; };

    // Each shot's box, fitted round what its steps show, sampled through them.
    const around = (from, to, o = {}) => {
      const pts = [];
      for (let t = from; t <= to + 1e-6; t += .5) { content.update(t, {pxPerA: 1}); world.updateMatrixWorld(true); pts.push(...shownPoints().map(p => V(...p))); }
      return boxAround(pts, DIR, {fov: 26, margin: 6, above: 14, ...o});
    };
    at.frames = {
      pairs: around(1, T.hybrid - 1, {above: 18}),
      hybrid: around(T.hybrid + 2.6, T.coupling - 1, {above: 16}),
      // (Step 4's RNA grows until its fade out ends, so its box is sampled to then.)
      coupling: around(T.coupling + 2.65, T.context - .2, {above: 14}),
      context: around(T.context + 2.6, T.cryptic - 1, {above: 18}),
      cryptic: around(T.cryptic + 2.6, T.end, {above: 16}),
    };
    content.update(0, {pxPerA: 1});
    return content;
  },
});
