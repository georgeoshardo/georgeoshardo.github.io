// The chapter's opening view: a gene's RNA processed as it is made, in one picture at true size (Å), toured by five
// stations named on a rail under the introduction. A typical mammalian gene, eight exons of 110–190 bp and seven
// introns of about 1 kb, is drawn as B-DNA one base pair at a time (../shared/chromatin.mjs), its exons tinted; two
// RNA polymerases transcribe it. The first, just past the start, is paused with the capping enzymes on a capped RNA
// (8P4E, human: Pol II with RNGTT, CMTR1 and SPT5). The second has just made the second intron's 5′ splice site, and a
// U1 snRNP is paired with it (7B0Y: Pol II transcribing, with U1 snRNP on the 5′ splice site of its RNA). Behind it on
// the same RNA a spliceosome (the P complex, 6QDV, coarse, from the spliceosome scene's set) has joined the first two
// exons and holds the first intron as a lariat. A mature mRNA, capped, spliced and with its poly(A) tail, leaves. The
// RNA is drawn with ../shared/rna.mjs through the structures' own nucleotides, the stretches they leave unmodelled
// laid smoothly between them, every nucleotide 6.1 Å from the next. The camera moves between stations zooming out and
// in as it pans (van Wijk and Nuij's smooth zoom), and a drag turns the view. The 3D view is masked out under the page's
// text and header, so nothing is drawn behind them however the view turns.
import * as THREE from 'three';
import {NIGHT, loadSurfaceSet, surfaceGeometry, proteinMaterial, createRenderer, studio, restoreEnvironment, viewScale, fade, PALETTE} from '../shared/molecules.mjs';
import {createLabels} from '../shared/labels.mjs';
import {pairsFromStrands, frameFromPairs, meanLocal, RISE} from '../shared/dna.mjs';
import {createChain, assemble, createFibre, fillFrames} from '../shared/chromatin.mjs';
import {SPLICING, COMPLEMENT, SPACING, createStrand, createCartoon, pairTip, stubColour} from '../shared/rna.mjs';
import {STRANDS, createTube, minRadius, outlineWidth} from '../shared/strands.mjs';
import {boxAround, fitRoom} from '../shared/camera.mjs';
import {smooth, quintic} from '../shared/ease.mjs';
import {setRich} from '../shared/text.mjs';

const $ = id => document.getElementById(id), V = (...a) => new THREE.Vector3(...a);
const hex = c => '#' + new THREE.Color(c).getHexString();
const lighter = (c, k) => new THREE.Color(c).lerp(new THREE.Color(0xffffff), k).getHex();
const rmq = matchMedia('(prefers-reduced-motion: reduce)');
let calm = rmq.matches;

// The stations, in the notes' words.
const STATIONS = [
  {name: 'Interrupted gene', text: 'A typical mammalian gene has 7–8 exons. The exons are relatively short, around 100–200 bp, and the introns are long, approximately 1 kb.'},
  {name: 'Capping', text: 'Shortly after initiation, RNA polymerase II pauses, and capping enzymes add the cap to the 5′ end of the new RNA: a G joined by an unusual 5′–5′ triphosphate linkage.'},
  {name: 'U1 snRNP', text: 'Splicing often occurs as the pre-mRNA is still being transcribed. Its first step is the binding of the U1 snRNP to the 5′ splice site, by base pairing with U1 snRNA.'},
  {name: 'Spliceosome', text: 'In the spliceosome the two exons are joined together, releasing the intron in its lariat form: an unusual 2′–5′ phosphodiester bond forms its branch point.'},
  {name: 'Mature mRNA', text: 'Capped at the 5′ end, its introns removed and polyadenylated at the 3′ end, the mRNA is transported through nuclear pores to the cytoplasm, where it is translated.'},
];

// ---------- The gene ----------
// Exons and introns (bp), 5′ → 3′; positions g along the gene from its first transcribed base (g = 0).
const EXONS = [150, 120, 180, 110, 160, 130, 190, 170], INTRONS = [1000, 950, 1100, 900, 1050, 980, 1020];
const PARTS = [];
{ let g = 0; EXONS.forEach((e, k) => { PARTS.push({kind: 'exon', k, from: g, to: g + e}); g += e; if (k < INTRONS.length) { PARTS.push({kind: 'intron', k, from: g, to: g + INTRONS[k]}); g += INTRONS[k]; } }); }
const GENE = PARTS[PARTS.length - 1].to, FROM = -120, TO = GENE + 300, NEAR = [FROM, 1700];
// Exons alternate between two shades of the exon colour, so where two are joined in an RNA shows.
const exonColour = k => k % 2 ? EXON_2 : SPLICING.exon, EXON_2 = 0xe27a37;
const partColour = p => p.kind === 'exon' ? exonColour(p.k) : SPLICING.intron;
const POLY_A = 200;
// Where the mRNA leaves: beside this gene position, this far off the gene (Å).
const MRNA_AT = 5000, MRNA_OFF = new THREE.Vector3(200, -4300, 600);
const COLOUR = {pol2: 0x7f97a8, rngtt: 0xc890d8, cmtr1: 0x6fb3a0, spt5: PALETTE.nusG,
  'U1-70K': SPLICING.U1, 'U1-A': lighter(SPLICING.U1, .35), 'U1 Sm ring': SPLICING.Sm,
  'U2 snRNP': SPLICING.U2, 'U2 Sm ring': SPLICING.Sm, 'U5 snRNP': SPLICING.U5, 'U5 Sm ring': SPLICING.Sm, 'Prp19 complex': 0xa7abb0, 'Other proteins': 0x6f7684};
const SNRNA = {'U2 snRNA': SPLICING.U2, 'U5 snRNA': SPLICING.U5, 'U6 snRNA': SPLICING.U6, 'U1 snRNA': SPLICING.U1};

// The nascent RNA of the second polymerase, nucleotide by nucleotide: its cap (0), exon 1, intron 1 (a lariat in the
// spliceosome), exon 2 and the first 29 nucleotides of intron 2 (7B0Y's RNA 117–145, its 3′ end in the active site).
const E1 = EXONS[0], I1 = INTRONS[0], E2 = EXONS[1], IN2 = 29;
const B = {n: 1 + E1 + I1 + E2 + IN2, exon1: [1, 1 + E1], intron: [1 + E1, 1 + E1 + I1], exon2: [1 + E1 + I1, 1 + E1 + I1 + E2]};
B.g3 = E1 + I1 + E2 + IN2 - 1;                         // the gene position of its 3′ end
B.ofU1 = r => r - 145 + B.n - 1;                       // 7B0Y's RNA number → index (116, exon 2's last, → its last)
B.ofE = r => r < 0 ? B.exon1[1] + r : B.exon2[0] - 1 + r;   // 6QDV's exons: −12 … −1 the end of exon 1, 1, 2 the start of exon 2
// The first polymerase's RNA: its cap (0) and 50 nucleotides, the last 20 as in 8P4E.
const A = {n: 51, g3: 49};

// A small seeded generator, so every visit draws the same RNA.
function random(seed) { return () => { seed = (seed + 0x6d2b79f5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t ^= t + Math.imul(t ^ (t >>> 7), 61 | t); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }

// ---------- Paths for free RNA ----------
// A dense polyline through a Catmull–Rom curve, from control point i0 to i1.
function dense(points, i0 = 0, i1 = points.length - 1, per = 24) {
  const curve = new THREE.CatmullRomCurve3(points, false, 'centripetal'), N = points.length - 1, out = [];
  for (let k = 0, m = (i1 - i0) * per; k <= m; k++) out.push(curve.getPoint((i0 + (i1 - i0) * k / m) / N));
  return out;
}
const lengthOf = pts => { let L = 0; for (let i = 1; i < pts.length; i++) L += pts[i].distanceTo(pts[i - 1]); return L; };
// Points every `spacing` along a polyline, from `spacing` after its start (n of them).
function walk(pts, n, spacing = SPACING) {
  const out = []; let k = 1, acc = 0;
  for (let i = 1; i < pts.length && out.length < n; i++) {
    const d = pts[i].distanceTo(pts[i - 1]);
    while (out.length < n && acc + d >= k * spacing) { out.push(pts[i - 1].clone().lerp(pts[i], (k * spacing - acc) / d)); k++; }
    acc += d;
  }
  while (out.length < n) out.push(pts[pts.length - 1].clone());
  return out;
}
// n free nucleotides between two fixed ones, a and b (each carried on smoothly from its neighbour beyond: `before`,
// `after`), every step SPACING: through control points that one amount s spreads out (shape(s) → points), s found so
// that the way from a to b is (n + 1)·SPACING long.
// Where a or b continues a strand, the way first runs on along it for `lead` Å, so the strand meets it without a kink.
function bridge(n, a, b, shape, {before = null, after = null, lead = 2 * SPACING} = {}) {
  const want = (n + 1) * SPACING;
  const outA = before && a.clone().add(a.clone().sub(before).setLength(lead)), inB = after && b.clone().add(b.clone().sub(after).setLength(lead));
  const poly = s => { const pts = [before, a, outA, ...shape(s), inB, b, after].filter(Boolean); return dense(pts, before ? 1 : 0, pts.length - 1 - (after ? 1 : 0)); };
  let lo = 0, hi = 1;
  while (lengthOf(poly(hi)) < want && hi < 1e6) hi *= 2;
  for (let it = 0; it < 40; it++) { const s = (lo + hi) / 2; if (lengthOf(poly(s)) < want) lo = s; else hi = s; }
  return walk(poly((lo + hi) / 2), n);
}
// Two unit vectors square to `d` (any, if it is degenerate).
function across(d, hint = V(0, -1, 0)) {
  const u = hint.clone().addScaledVector(d, -hint.dot(d));
  if (u.lengthSq() < 1e-6) u.set(1, 0, 0).addScaledVector(d, -d.x);
  u.normalize(); return [u, d.clone().cross(u).normalize()];
}

// ---------- van Wijk and Nuij's smooth zoom-and-pan ----------
// From a view of height w0 centred at c0 to one of height w1 at c1 (distance d apart): the view zooms out as it pans
// so the way looks even. Returns {S (its length), at(t) → [fraction of the way along c0→c1, height]}.
function zoomPath(w0, w1, d, rho = 1.25) {
  const r2 = rho * rho, r4 = r2 * r2;
  if (d < 1e-6 * Math.max(w0, w1)) { const S = Math.log(w1 / w0) / rho; return {S: Math.abs(S), at: t => [t, w0 * Math.exp(rho * t * S)]}; }
  const b0 = (w1 * w1 - w0 * w0 + r4 * d * d) / (2 * w0 * r2 * d), b1 = (w1 * w1 - w0 * w0 - r4 * d * d) / (2 * w1 * r2 * d);
  const r0 = Math.log(Math.sqrt(b0 * b0 + 1) - b0), r1 = Math.log(Math.sqrt(b1 * b1 + 1) - b1), S = (r1 - r0) / rho;
  return {S, at: t => { const s = t * S, u = w0 / (r2 * d) * (Math.cosh(r0) * Math.tanh(rho * s + r0) - Math.sinh(r0)); return [u, w0 * Math.cosh(r0) / Math.cosh(rho * s + r0)]; }};
}

// ---------- The page ----------
async function start() {
  if (location.protocol === 'file:') return;
  const hero = $('hero'), view = $('viewport');
  let renderer;
  try { renderer = createRenderer({alpha: false, exposure: .9}); }
  catch { $('load-detail').textContent = 'This page needs WebGL 2, which this browser could not start.'; return; }
  view.append(renderer.domElement);
  const scene = new THREE.Scene(), camera = new THREE.PerspectiveCamera(30, 1, 1, 1e7);
  scene.background = new THREE.Color(NIGHT); scene.fog = new THREE.Fog(NIGHT, 1e6, 1e7);
  studio(scene, camera, renderer);
  const world = new THREE.Group(); scene.add(world);

  let sets, failed = false;
  try {
    sets = await Promise.all([
      loadSurfaceSet('assets/hub.json', 'assets/hub.bin', p => { if (!failed) $('load-detail').textContent = `Loading structures · ${Math.floor(p * 10) * 10}%`; }),
      loadSurfaceSet('assets/spliceosome_p.json', 'assets/spliceosome_p.bin'),
    ]);
  } catch (e) { failed = true; $('load-detail').textContent = `The structures could not be loaded (${e.message}).`; return; }
  const [set, spl] = sets;
  const strandOf = (s, id, name) => s.meta.strands.find(x => x.structure === id && x.name === name);
  const meshesOf = (s, id) => s.meta.meshes.filter(m => m.structure === id);

  // ---------- The two polymerases, each placed by its own DNA ----------
  // Base-pair frames of a structure's DNA, numbered by its non-template strand (the bubble filled in), and where its
  // RNA's 3′ end pairs: g = n + offset puts that end at gene position g3. Placed with its downstream DNA along +x and
  // the side its RNA leaves from (towards `feature`) up and towards the viewer.
  const UP = V(0, -1, -.55).normalize();
  function polymerase(id, g3, feature, origin) {
    const N = strandOf(set, id, 'non-template'), T = strandOf(set, id, 'template'), R = strandOf(set, id, 'RNA');
    const pairs = pairsFromStrands(N, T), frames = fillFrames(pairs.map(p => p.a.num), frameFromPairs(pairs));
    const pairSum = pairs[0].a.num + pairs[0].b.num, end = R.partner[R.partner.length - 1], active = pairSum - T.numbers[end[1]];
    const offset = g3 - active, at = frames.find(f => f.num === active).o;
    const down = frames.filter(f => f.num >= active + 3), dir = down[down.length - 1].o.clone().sub(down[0].o).normalize();
    const [u] = across(dir, feature.clone().sub(at)), w = dir.clone().cross(u);
    const [U] = across(V(1, 0, 0), UP), W = V(1, 0, 0).cross(U);
    const rot = new THREE.Matrix4().makeBasis(V(1, 0, 0), U, W).multiply(new THREE.Matrix4().makeBasis(dir, u, w).transpose());
    const M = new THREE.Matrix4().makeTranslation(origin.x, origin.y, origin.z).multiply(rot).multiply(new THREE.Matrix4().makeTranslation(-at.x, -at.y, -at.z));
    const q = new THREE.Quaternion().setFromRotationMatrix(rot);
    return {id, M, q, frames, offset, pairs, R, from: frames[0].num + offset, count: frames.length,
      piece: {from: frames[0].num + offset, count: frames.length, bound: true, frame: (i, o, qq) => { o.copy(frames[i].o).applyMatrix4(M); qq.copy(q).multiply(frames[i].q); }}};
  }
  const centreOf = (s, id, names) => { const c = V(); let n = 0; for (const m of meshesOf(s, id)) if (!names || names.includes(m.name)) { c.addScaledVector(V(...m.center), m.atomCount); n += m.atomCount; } return c.divideScalar(n || 1); };
  const capFeature = centreOf(set, 'cap', ['Capping enzyme', 'CMTR1']), u1Feature = centreOf(set, 'u1', ['U1-70K', 'U1-A', 'U1 Sm ring']);
  const polA = polymerase('cap', A.g3, capFeature, V(0, 0, 0));
  // The second polymerase is set along +x where the free DNA from the first meets it at the ideal rise.
  // B-DNA's mean base pair, from 7B0Y's straight downstream DNA.
  const downstream = pairsFromStrands(strandOf(set, 'u1', 'non-template'), strandOf(set, 'u1', 'template'));
  frameFromPairs(downstream);
  const local = meanLocal(downstream.filter(p => p.a.num >= 28 && p.a.num <= 43));
  const endFrame = (p, last) => { const o = V(), q = new THREE.Quaternion(), o2 = V(), q2 = new THREE.Quaternion(); const i = last ? p.count - 1 : 0, j = last ? p.count - 4 : 3;
    p.piece.frame(i, o, q); p.piece.frame(j, o2, q2); return {o, dir: last ? o.clone().sub(o2).normalize() : o2.clone().sub(o).normalize()}; };
  const aEnd = endFrame(polA, true);
  // Free DNA between them: a cubic from the first's downstream end (leaving along its axis) to the second's upstream
  // end (meeting it along its axis), RISE a pair.
  const hermite = (P, tP, Q, tQ, m = 400) => { const pts = []; for (let i = 0; i <= m; i++) { const u = i / m, u2 = u * u, u3 = u2 * u;
    pts.push(V().addScaledVector(P, 2 * u3 - 3 * u2 + 1).addScaledVector(tP, u3 - 2 * u2 + u).addScaledVector(Q, -2 * u3 + 3 * u2).addScaledVector(tQ, u3 - u2)); } return pts; };
  let polB, between;
  {
    const trial = x => {
      const p = polymerase('u1', B.g3, u1Feature, V(x, 0, 0)), s = endFrame(p, false), d = s.o.distanceTo(aEnd.o);
      const P = aEnd.o.clone().addScaledVector(aEnd.dir, RISE), Q = s.o.clone().addScaledVector(s.dir, -RISE);
      return {p, pts: hermite(P, aEnd.dir.clone().multiplyScalar(.6 * d), Q, s.dir.clone().multiplyScalar(.6 * d)), want: (p.from - 1 - (polA.from + polA.count)) * RISE};
    };
    let lo = 1000, hi = 8000;
    for (let it = 0; it < 40; it++) { const x = (lo + hi) / 2, t = trial(x); if (lengthOf(t.pts) < t.want) lo = x; else hi = x; }
    const t = trial((lo + hi) / 2); polB = t.p; between = t.pts;
  }
  // The guide: every free base pair's place, RISE apart. Upstream of the first polymerase the DNA runs back along its
  // axis; downstream of the second it runs on along +x with a slow wave.
  const guidePts = new Map();
  {
    const s0 = endFrame(polA, false);
    for (let g = FROM; g < polA.from; g++) guidePts.set(g, s0.o.clone().addScaledVector(s0.dir, -(polA.from - g) * RISE));
    [between[0], ...walk(between, polB.from - (polA.from + polA.count) - 1, RISE)].forEach((p, i) => guidePts.set(polA.from + polA.count + i, p));
    // Beyond the second polymerase the gene meanders as a river does (its heading swinging to and fro along it, a
    // sine-generated curve), filling the view of the whole gene rather than running off in a line.
    const e = endFrame(polB, true), last = polB.from + polB.count - 1, wave = [], p = e.o.clone(), d = V();
    const [y0] = across(e.dir, V(0, -1, 0)), z0 = e.dir.clone().cross(y0);
    for (let s = 0; s <= (TO - last + 40) * RISE * 1.05; s += 20) {
      wave.push(p.clone());
      const phi = 1.85 * Math.sin(2 * Math.PI * s / 9800) * smooth(s / 1600);
      d.copy(e.dir).multiplyScalar(Math.cos(phi)).addScaledVector(y0, Math.sin(phi)).addScaledVector(z0, .18 * Math.sin(2 * Math.PI * s / 7300) * smooth(s / 1600)).normalize();
      p.addScaledVector(d, 20);
    }
    walk(wave, TO - last, RISE).forEach((p, i) => guidePts.set(last + 1 + i, p));
  }
  const guide = (g, out) => out.copy(guidePts.get(g) ?? guidePts.get(TO));
  const chain = createChain(TO - FROM + 8);
  assemble(chain, {from: FROM, to: TO, pieces: [polA.piece, polB.piece], guide, far: g => g < NEAR[0] || g > NEAR[1]});
  const at = g => chain.o[g - FROM];

  // The DNA close to: the film's strands, the exons' base pairs tinted.
  const fibre = createFibre({local, maxNear: NEAR[1] - NEAR[0] + 40, maxFar: TO - FROM + 40});
  PARTS.filter(p => p.kind === 'exon').forEach((p, i) => fibre.band(i, p.from, p.to - 1, exonColour(p.k), .9));
  fibre.set(chain); fibre.line.visible = false; world.add(fibre.group);
  // The DNA from afar: a tube along its axis, its exons and introns in their colours, at least a few pixels wide.
  const axisTubes = [];
  {
    const runs = [{from: FROM, to: 0, colour: STRANDS.template}, ...PARTS.map(p => ({from: p.from, to: p.to, colour: partColour(p)})), {from: GENE, to: TO + 1, colour: STRANDS.template}];
    const segs = [];
    for (const r of runs) for (const [lo, hi, near] of [[r.from, Math.min(r.to, NEAR[1] + 1), true], [Math.max(r.from, NEAR[1] + 1), r.to, false]]) if (hi > lo) segs.push({lo, hi, near, colour: r.colour});
    // Neighbouring tubes of one kind join on a shared ring (no caps, the axis's own direction there, the first tube's
    // last frame carried on), so the gene's colour changes without a seam; a near tube meets a far one with caps, as
    // either may be hidden.
    const dirAt = g => at(Math.min(TO, g + 1)).clone().sub(at(Math.max(FROM, g - 1))).normalize();
    let prev = null;
    segs.forEach((s, k) => {
      const pts = []; for (let g = s.lo; g < s.hi; g += 3) pts.push(at(g)); pts.push(at(Math.min(TO, s.hi)));
      const group = new THREE.Group(), tube = createTube(group, {color: s.colour, radius: 10, max: pts.length, sides: 8, outline: true});
      const next = segs[k + 1], before = !!prev && prev.near === s.near && prev.hi === s.lo, after = !!next && next.near === s.near && next.lo === s.hi;
      const join = {caps: [!before, !after], tangents: [before ? dirAt(s.lo) : null, after ? dirAt(Math.min(TO, s.hi)) : null], frame: before ? prev.tube.endNormal : null};
      world.add(group); pts.forEach((p, i) => tube.points[i].copy(p)); tube.update(pts.length, join);
      axisTubes.push({tube, group, near: s.near, n: pts.length, join});
      prev = {...s, tube};
    });
  }

  // ---------- Structures ----------
  const holder = M => { const g = new THREE.Group(); g.matrixAutoUpdate = false; g.matrix.copy(M); world.add(g); g.updateMatrixWorld(true); return g; };
  const gA = holder(polA.M), gB = holder(polB.M), meshAt = {};
  const anchors = new Map();  // labels' anchors on proteins, for the station the camera is at (see meshCentre)
  const material = {};
  const meshFor = (s, rec, g, colour) => {
    const m = new THREE.Mesh(surfaceGeometry(rec, s.buffer), material[colour] ||= proteinMaterial(colour));
    g.add(m); m.updateMatrixWorld(true); return m;
  };
  for (const rec of meshesOf(set, 'cap')) meshAt['A ' + rec.name] = meshFor(set, rec, gA, {'RNA polymerase II': COLOUR.pol2, 'Capping enzyme': COLOUR.rngtt, CMTR1: COLOUR.cmtr1, SPT5: COLOUR.spt5}[rec.name]);
  for (const rec of meshesOf(set, 'u1')) meshAt['B ' + rec.name] = meshFor(set, rec, gB, rec.name === 'RNA polymerase II' ? COLOUR.pol2 : COLOUR[rec.name]);
  const inA = p => V(...p).applyMatrix4(polA.M), inB = p => V(...p).applyMatrix4(polB.M);

  // The spliceosome (P complex) above the second polymerase's RNA: turned so that exon 2 leaves it towards the
  // polymerase and the lariat's loop leaves it up and away from the gene.
  const pE = strandOf(spl, 'p', 'pre-mRNA E'), pI = strandOf(spl, 'p', 'pre-mRNA I');
  const pIdx = (s, num) => s.numbers.indexOf(num);
  let MP;
  {
    const c = centreOf(spl, 'p'), e2 = V(...pE.backbone[pIdx(pE, 2)]), loop = V(...pI.backbone[pIdx(pI, 20)]).add(V(...pI.backbone[pIdx(pI, 83)])).multiplyScalar(.5);
    const u1Exit = inB(polB.R.backbone[0]);
    const C = u1Exit.clone().add(V(-430, -470, -60));
    const a1 = e2.clone().sub(c).normalize(), [a2] = across(a1, loop.clone().sub(c)), a3 = a1.clone().cross(a2);
    const w1 = u1Exit.clone().sub(C).normalize(), [w2] = across(w1, V(-.35, -1, .25)), w3 = w1.clone().cross(w2);
    const rot = new THREE.Matrix4().makeBasis(w1, w2, w3).multiply(new THREE.Matrix4().makeBasis(a1, a2, a3).transpose());
    MP = new THREE.Matrix4().makeTranslation(C.x, C.y, C.z).multiply(rot).multiply(new THREE.Matrix4().makeTranslation(-c.x, -c.y, -c.z));
  }
  const gP = holder(MP), inP = p => V(...p).applyMatrix4(MP);
  for (const rec of meshesOf(spl, 'p')) meshAt['P ' + rec.name] = meshFor(spl, rec, gP, COLOUR[rec.name] ?? 0x8a8f99);

  // snRNAs from the structures, as cartoons in their snRNP's colour (pieces where nucleotides are missing). A base
  // paired with the pre-mRNA reaches to the middle of the pair.
  const cartoons = [];
  const cartoon = (s, strand, place, g) => {
    const chainOf = new Map(s.meta.strands.filter(x => x.structure === strand.structure).map(x => [x.chain, x]));
    const P = strand.backbone.map(b => V(...b)), colour = SNRNA[strand.name];
    let a = 0;
    for (let b = 1; b <= P.length; b++) {
      if (b < P.length && P[b].distanceTo(P[b - 1]) < 9) continue;
      if (b - a >= 2) {
        const c = createCartoon(g, b - a, {colour, rung: stubColour(colour).getHex(), radius: 1.6, samples: 3});
        c.pose(P.slice(a, b), P.slice(a, b).map((p, i) => {
          const k = a + i, q = strand.partner[k], o = q && chainOf.get(q[0]);
          const mate = o && COMPLEMENT[strand.sequence[k]]?.includes(o.sequence[q[1]]) ? V(...o.backbone[q[1]]) : null, base = V(...strand.base[k]);
          if (base.distanceTo(p) < .5) return mate ? p.clone().lerp(mate, .5) : p.clone();
          return pairTip(V(), p, base, mate, 1);
        }));
        cartoons.push({c, points: P.slice(a, b).map(p => p.clone().applyMatrix4(place))});
      }
      a = b;
    }
  };
  cartoon(set, strandOf(set, 'u1', 'U1 snRNA'), polB.M, gB);
  for (const name of ['U2 snRNA', 'U5 snRNA', 'U6 snRNA']) cartoon(spl, strandOf(spl, 'p', name), MP, gP);

  // ---------- RNA ----------
  // The view of each station (from what it shows towards the camera; world −y is up).
  const DIRS = [V(0, -.16, -1), V(-.3, -.5, -1), V(.25, -.35, -1), V(.05, -.25, -1), V(0, -.1, -1)].map(d => d.normalize());
  const rnd = random(20261002), held = {A: new Set(), B: new Set()};  // nucleotides placed where a structure has them
  // Control points for free RNA (see bridge). A short stretch the structures leave unmodelled: a bulge out along `out`
  // from the line between a and b, a little to one side.
  const arcShape = (a, b, out, side, K = 6) => s => Array.from({length: K}, (_, j) => {
    const u = (j + 1) / (K + 1); return a.clone().lerp(b, u).addScaledVector(out, s * Math.sin(Math.PI * u)).addScaledVector(side, .3 * s * Math.sin(2 * Math.PI * u)); });
  // A long stretch: a smooth random curve, the sum of harmonics 1 … H (the k-th 1/k^power the size of the first) in
  // random directions, leaving a along `out` and returning to b (a loop), so a kilobase of RNA lies loosely coiled.
  const harmonics = (H, power) => Array.from({length: H}, (_, k) => ({k: k + 1,
    a: V(rnd() - .5, rnd() - .5, rnd() - .5).normalize().multiplyScalar((k + 1) ** -power), b: V(rnd() - .5, rnd() - .5, rnd() - .5).normalize().multiplyScalar((k + 1) ** -power)}));
  const loopShape = (a, b, out, terms, reach, K = 72) => s => {
    const M = a.clone().add(b).multiplyScalar(.5);
    return Array.from({length: K}, (_, j) => {
      const th = 2 * Math.PI * (j + 1) / (K + 1), p = M.clone().addScaledVector(out, s * reach * (1 - Math.cos(th)));
      for (const t of terms) p.addScaledVector(t.a, s * (1 - Math.cos(t.k * th))).addScaledVector(t.b, s * Math.sin(t.k * th) * Math.sin(th / 2));
      return p;
    });
  };
  // The first polymerase's RNA: the cap where 8P4E has it (on CMTR1), its last 20 nucleotides in the polymerase, and
  // the 30 between them (not modelled) in a loop out from the enzymes.
  const rnaA = createStrand(world, A.n).stretches([[0, 1, SPLICING.cap]], exonColour(0));
  {
    const pts = rnaA.points, R = polA.R;
    R.numbers.forEach((num, k) => { pts[num].copy(inA(R.backbone[k])); held.A.add(num); }); held.A.add(0);
    const cap = inA(set.meta.points.find(p => p.structure === 'cap' && p.name === "cap C1'").position);
    pts[0].copy(cap);
    // It loops out across the view of the capping station, so it shows as a loop.
    const view = DIRS[1], chord = pts[31].clone().sub(cap).normalize();
    const out = cap.clone().add(pts[31]).multiplyScalar(.5).sub(meshAt['A RNA polymerase II'].localToWorld(V(...set.meta.meshes.find(m => m.structure === 'cap' && m.name === 'RNA polymerase II').center)));
    out.addScaledVector(view, -out.dot(view)).addScaledVector(chord, -out.dot(chord)).normalize();
    const side = chord.clone().cross(out).normalize();
    bridge(30, cap, pts[31], arcShape(cap, pts[31], out, side), {after: pts[32]}).forEach((p, i) => pts[1 + i].copy(p));
  }
  // The second polymerase's RNA, through 7B0Y's nucleotides (the end of exon 2 paired with U1 snRNA, and intron 2 in
  // the polymerase) and 6QDV's (the joined exons, and the lariat's two ends in the spliceosome). 6QDV's intron is in
  // three runs: its 5′ end (1–20, with the nucleotide numbered 83 next to 20), the branch site (84–101, the branch A
  // 97) and the 3′ end (111–113); the first is the start of this intron, the others its end.
  const iRun = []; { let r = 0; pI.backbone.forEach((b, k) => { if (k && V(...b).distanceTo(V(...pI.backbone[k - 1])) > 9) r++; iRun.push(r); }); }
  const ofIk = k => iRun[k] === 0 ? B.intron[0] + k : B.intron[1] - 114 + pI.numbers[k];
  const ofI = num => ofIk(pI.numbers.indexOf(num));
  const rnaB = createStrand(world, B.n).stretches([[0, 1, SPLICING.cap], [...B.exon1, exonColour(0)], [...B.intron, SPLICING.intron], [...B.exon2, exonColour(1)], [B.exon2[1], B.n, SPLICING.intron]]);
  {
    const pts = rnaB.points, put = (i, p) => pts[i].copy(p);
    const hold = (i, p) => { put(i, p); held.B.add(i); };
    polB.R.numbers.forEach((num, k) => hold(B.ofU1(num), inB(polB.R.backbone[k])));
    pE.numbers.forEach((num, k) => hold(B.ofE(num), inP(pE.backbone[k])));
    pI.numbers.forEach((num, k) => hold(ofIk(k), inP(pI.backbone[k])));
    const C = gP.localToWorld(centreOf(spl, 'p').clone());
    const free = (a, b, shape, lead) => bridge(b - a - 1, pts[a], pts[b], shape, {before: pts[a - 1], after: pts[b + 1], lead}).forEach((p, i) => put(a + 1 + i, p));
    // Between 6QDV's intron 101 and 111: nine nucleotides bulging out of the core.
    {
      const a = ofI(101), b = ofI(111), out = pts[a].clone().add(pts[b]).multiplyScalar(.5).sub(C).normalize(), [side] = across(pts[b].clone().sub(pts[a]).normalize(), out);
      bridge(b - a - 1, pts[a], pts[b], arcShape(pts[a], pts[b], across(pts[b].clone().sub(pts[a]).normalize(), out)[0], side.clone().cross(out).normalize(), 4),
        {before: pts[a - 1], after: pts[b + 1], lead: 3}).forEach((p, i) => put(a + 1 + i, p));
    }
    // The lariat's loop: from the end of the intron's 5′ run round to its branch site, out of the spliceosome and back,
    // a kilobase of RNA coiled loosely three times round, like a lasso's rope: each turn a little inside the last and a
    // little nearer the viewer, all of them clear of each other.
    {
      const k0 = iRun.lastIndexOf(0), a = ofIk(k0), b = ofIk(k0 + 1), M = pts[a].clone().add(pts[b]).multiplyScalar(.5);
      // The loop lies the way both of its ends leave the spliceosome, so the RNA runs on smoothly into it.
      const dA = pts[a].clone().sub(pts[a - 1]).normalize(), dB = pts[b].clone().sub(pts[b + 1]).normalize();
      const out = dA.clone().add(dB).normalize().add(V(-.1, -.3, 0)).normalize(), face = V(.05, -.2, -1).normalize();
      const nrm = face.clone().addScaledVector(out, -face.dot(out)).normalize(), t = nrm.clone().cross(out);
      const TURNS = 3, K = 66, ph = [rnd(), rnd()].map(x => x * Math.PI * 2);
      const runA = pts[a].clone().addScaledVector(dA, 90), runB = pts[b].clone().addScaledVector(dB, 90);
      free(a, b, R => [runA, ...Array.from({length: K}, (_, j) => {
        const u = j / (K - 1), th = 2 * Math.PI * TURNS * u, r = R * (1.12 - .24 * u) * (1 + .07 * Math.sin(2 * th + ph[0]) + .04 * Math.sin(3 * th + ph[1]));
        return M.clone().addScaledVector(out, R * 1.12 + 150 - r * Math.cos(th)).addScaledVector(t, r * Math.sin(th))
          .addScaledVector(nrm, 70 * TURNS * (u - .5) + 14 * Math.sin(5 * th + ph[1]));
      }), runB], 36);
    }
    // Exon 2, from the spliceosome down to U1 and the polymerase: a gentle S.
    {
      const a = B.ofE(2), b = B.ofU1(110), chord = pts[b].clone().sub(pts[a]).normalize(), [bulge] = across(chord, V(.3, -1, -.4)), side = chord.clone().cross(bulge);
      free(a, b, s => [.2, .4, .6, .8].map((u, j) => pts[a].clone().lerp(pts[b], u).addScaledVector(bulge, s * Math.sin(Math.PI * u)).addScaledVector(side, .5 * s * Math.sin(2 * Math.PI * u + j * 0))));
    }
    // Exon 1, from the spliceosome back to the cap, which lies up and to the left of it.
    {
      const a = B.ofE(-12), out = pts[a].clone().sub(C).normalize(), cap = pts[a].clone().addScaledVector(out, 160).add(V(-260, -120, 40));
      const chord = pts[a].clone().sub(cap).normalize(), [bulge] = across(chord, V(0, -1, -.3)), side = chord.clone().cross(bulge);
      bridge(a - 1, cap, pts[a], s => [.2, .4, .6, .8].map(u => cap.clone().lerp(pts[a], u).addScaledVector(bulge, s * Math.sin(Math.PI * u)).addScaledVector(side, .6 * s * Math.sin(2 * Math.PI * u))),
        {after: pts[a + 1]}).forEach((p, i) => put(1 + i, p));
      put(0, cap);
    }
  }
  // Exons joined (exon 1's last nucleotide next to exon 2's first, as 6QDV has them), the intron a lariat of its own,
  // its 5′ end joined to the branch A by the 2′–5′ bond.
  rnaB.pieces([[[0, B.exon1[1]], [B.exon2[0], B.n]], [B.intron]]);
  rnaB.link(ofI(97), ofI(1), {colour: SPLICING.intron});
  // Bases paired with U1 snRNA (7B0Y) and with U2, U5 and U6 snRNAs (6QDV) reach to the middle of their pairs.
  {
    const pairWith = (strand, ofK, place) => {
      const chainOf = new Map((strand.structure === 'u1' ? set : spl).meta.strands.filter(x => x.structure === strand.structure).map(x => [x.chain, x]));
      strand.partner.forEach((q, k) => {
        const o = q && chainOf.get(q[0]);
        if (!o || !SNRNA[o.name] || !COMPLEMENT[strand.sequence[k]]?.includes(o.sequence[q[1]])) return;
        rnaB.pair(ofK(k), V(...o.backbone[q[1]]).applyMatrix4(place), 1);
      });
    };
    pairWith(polB.R, k => B.ofU1(polB.R.numbers[k]), polB.M); pairWith(pE, k => B.ofE(pE.numbers[k]), MP); pairWith(pI, ofIk, MP);
  }
  rnaA.pose(); rnaB.pose();

  // The mature mRNA: cap, eight exons joined, poly(A) tail, loosely coiled, leaving the gene cap first.
  const mN = 1 + GENE - INTRONS.reduce((s, x) => s + x, 0) + POLY_A;
  const mrna = createStrand(world, mN);
  {
    const list = [[0, 1, SPLICING.cap]]; let i = 1;
    EXONS.forEach((e, k) => { list.push([i, i + e, exonColour(k)]); i += e; });
    list.push([i, mN, SPLICING.polyA]); mrna.stretches(list);
    const C = at(MRNA_AT).clone().add(MRNA_OFF), terms = harmonics(7, 1.05), lead = V(.55, -.75, -.1).normalize();
    // An open curve: from its 3′ end (u = 0) to the cap (u = 1), drifting along `lead`.
    const path = s => { const pts = []; for (let k = 0; k <= 160; k++) { const u = k / 160, p = C.clone().addScaledVector(lead, s * 2.2 * (u - .5));
      for (const t of terms) p.addScaledVector(t.a, s * Math.sin(t.k * Math.PI * u)).addScaledVector(t.b, s * (Math.cos(t.k * Math.PI * u) - 1) * .7); pts.push(p); } return dense(pts, 0, pts.length - 1, 8); };
    let lo = 1, hi = 1e5;
    for (let it = 0; it < 40; it++) { const s = (lo + hi) / 2; if (lengthOf(path(s)) < (mN - 1) * SPACING) lo = s; else hi = s; }
    const p = path((lo + hi) / 2).reverse(), pts = [p[0], ...walk(p, mN - 1)];
    pts.forEach((q, k) => mrna.points[k].copy(q));
  }
  mrna.pose();
  const strands = [rnaA, rnaB, mrna];

  // ---------- Stations: what each shows, and from where ----------
  const sample = (mesh, step = 6) => { const a = mesh.geometry.attributes.position, out = []; for (let i = 0; i < a.count; i += step) out.push(mesh.localToWorld(V().fromBufferAttribute(a, i))); return out; };
  const pick = (pts, from, to, step = 1) => { const out = []; for (let i = from; i < to; i += step) out.push(pts[i].clone()); return out; };
  const meshPts = keys => keys.flatMap(k => sample(meshAt[k]));
  const genePts = []; for (let g = FROM; g <= TO; g += 120) genePts.push(at(g).clone());
  const POINTS = [
    [...genePts, ...pick(mrna.points, 0, mN, 20), ...pick(rnaB.points, 0, B.n, 20)],
    [...meshPts(['A RNA polymerase II', 'A Capping enzyme', 'A CMTR1']), ...rnaA.points],
    [...meshPts(['B RNA polymerase II', 'B U1-70K', 'B U1-A', 'B U1 Sm ring']), ...cartoons.filter(c => c.c.group.parent === gB).flatMap(c => c.points), ...pick(rnaB.points, B.exon2[1] - 30, B.n)],
    [...meshPts(['P U2 snRNP', 'P U5 snRNP', 'P Prp19 complex', 'P Other proteins']), ...pick(rnaB.points, 0, B.exon2[1], 4)],
    pick(mrna.points, 0, mN, 4),
  ];
  const MARGIN = [1500, 30, 40, 80, 250];

  // ---------- Camera, room and mask ----------
  const labels = createLabels($('annotations'), $('leaders'), $('hub-now'));
  const FEATHER = 30;
  let W = 0, H = 0, rooms = [], blocked = [], lines = {};
  const poses = [];
  const fit = i => {
    const b = boxAround(POINTS[i], DIRS[i], {margin: MARGIN[i], fov: camera.fov});
    let best = null;
    for (const room of rooms) { const f = fitRoom(camera, b.box, room, .94, W, H); if (!best || f.dist < best.dist) best = {...f, room}; }
    return {target: b.target, dir: DIRS[i].clone(), dist: best.dist, anchor: best.anchor, room: best.room};
  };
  const resize = () => {
    fitText();
    W = hero.clientWidth; H = hero.clientHeight;
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2)); renderer.setSize(W, H, false);
    camera.aspect = W / H;
    const base = hero.getBoundingClientRect(), rel = el => { const r = el?.getBoundingClientRect(); return r?.width ? {left: r.left - base.left, top: r.top - base.top, right: r.right - base.left, bottom: r.bottom - base.top} : null; };
    const brand = rel(document.querySelector('.top .brand')), links = rel(document.querySelector('.top-links')), text = rel($('hero-text'));
    const cue = rel($('scroll-cue')), hint = rel(document.querySelector('.hero-hint'));
    const head = Math.max(brand?.bottom ?? 0, links?.bottom ?? 0) + 10, foot = Math.min(H, ...[cue?.top, hint?.top].filter(x => x !== undefined)) - 10;
    lines = {head, foot, textRight: text.right + 10, textTop: text.top - 10};
    // Masked out: the header's band, the foot's band (the arrow down and the hint), and the introduction (to the left
    // edge and the foot), each with a soft edge FEATHER wide.
    const f = FEATHER, L = lines;
    const mask = [`linear-gradient(to bottom, transparent ${L.head}px, #000 ${L.head + f}px)`, `linear-gradient(to top, transparent ${H - L.foot}px, #000 ${H - L.foot + f}px)`,
      `linear-gradient(to right, transparent ${L.textRight}px, #000 ${L.textRight + f}px)`, `linear-gradient(to bottom, #000 ${L.textTop - f}px, transparent ${L.textTop}px)`].join(',');
    for (const [k, v] of [['maskImage', mask], ['webkitMaskImage', mask], ['maskComposite', 'intersect, intersect, add, add'], ['webkitMaskComposite', 'source-in, source-in, source-over, source-over'],
      ['maskRepeat', 'no-repeat'], ['webkitMaskRepeat', 'no-repeat']]) view.style[k] = v;
    // Where a shot can go: right of the introduction, or above it, clear of the soft edges.
    const m = 14;
    rooms = [{left: L.textRight + f + m, top: L.head + f + m, right: W - m, bottom: L.foot - f - m}, {left: m, top: L.head + f + m, right: W - m, bottom: L.textTop - f - m}]
      .filter(r => r.right - r.left > 160 && r.bottom - r.top > 120);
    if (!rooms.length) rooms = [{left: m, top: L.head + f, right: W - m, bottom: Math.max(L.head + f + 120, L.textTop - f)}];
    // Labels keep clear of what is masked.
    blocked = [{x: 0, y: 0, w: W, h: L.head + f}, {x: 0, y: L.foot - f, w: W, h: H - L.foot + f}, {x: 0, y: L.textTop - f, w: L.textRight + f, h: H - L.textTop + f}];
    labels.resetSizes?.(); labels.layout(blocked);
    poses.length = 0; for (let i = 0; i < STATIONS.length; i++) poses.push(fit(i));
    anchors.clear();
    if (glide) glide.dirty = true;
  };
  const ro = new ResizeObserver(() => { resize(); wake(); });
  addEventListener('resize', () => { resize(); wake(); });
  renderer.domElement.addEventListener('webglcontextlost', e => e.preventDefault());
  renderer.domElement.addEventListener('webglcontextrestored', () => { restoreEnvironment(renderer, [scene]); wake(); });

  // A drag turns the view about the point looked at; it eases back to the station's view when let go.
  const turn = {yaw: 0, pitch: 0, dragging: false, x: 0, y: 0};
  renderer.domElement.style.touchAction = 'pan-y';
  renderer.domElement.addEventListener('pointerdown', e => { turn.dragging = true; turn.x = e.clientX; turn.y = e.clientY; renderer.domElement.setPointerCapture(e.pointerId); stopTour(); wake(); });
  renderer.domElement.addEventListener('pointermove', e => {
    if (!turn.dragging) return;
    turn.yaw = Math.max(-1.2, Math.min(1.2, turn.yaw - (e.clientX - turn.x) * .005)); turn.pitch = Math.max(-.7, Math.min(.7, turn.pitch + (e.clientY - turn.y) * .004));
    turn.x = e.clientX; turn.y = e.clientY; wake();
  });
  const release = () => { turn.dragging = false; wake(); };
  renderer.domElement.addEventListener('pointerup', release); renderer.domElement.addEventListener('pointercancel', release);

  // ---------- The rail ----------
  const rail = $('stations'), text = $('station-text'), tourButton = $('tour');
  // The station's text keeps the height of the longest at this width, so the introduction above it (bottom-aligned)
  // does not move up and down a line as the stations change, and the free part of the screen stays the same.
  function fitText() {
    const width = text.getBoundingClientRect().width; if (!width) return;
    const probe = text.cloneNode(false); probe.removeAttribute('id'); probe.removeAttribute('aria-live'); probe.setAttribute('aria-hidden', 'true');
    probe.style.cssText = `position:absolute;left:0;top:0;visibility:hidden;width:${width}px;min-height:0`;
    text.parentElement.append(probe);
    let tallest = 0; for (const s of STATIONS) { setRich(probe, s.text); tallest = Math.max(tallest, probe.getBoundingClientRect().height); }
    probe.remove();
    const h = `${Math.ceil(tallest)}px`; if (text.style.minHeight !== h) text.style.minHeight = h;
  }
  const buttons = STATIONS.map((s, i) => {
    const b = document.createElement('button'); b.type = 'button'; b.className = 'station';
    b.innerHTML = `<span class="n">${String(i + 1).padStart(2, '0')}</span><span class="name">${s.name}</span>`;
    b.addEventListener('click', () => { stopTour(); go(i); });
    rail.append(b); return b;
  });
  let station = 0, glide = null, tour = null, clock = 0, pose = null;
  const HOLD = 7;  // s at each station on the tour, long enough to read it
  // A glide from the pose now to station i's: van Wijk's path in view height, the direction and the screen anchor
  // following the same fraction of the way.
  function go(i) {
    const from = pose || poses[station];
    station = i;
    if (calm || !from) { glide = null; pose = null; }
    else {
      const to = poses[i], k = 2 * Math.tan(camera.fov * Math.PI / 360), d = from.target.distanceTo(to.target), path = zoomPath(from.dist * k, to.dist * k, d);
      glide = {from: {...from, target: from.target.clone(), dir: from.dir.clone(), anchor: from.anchor.slice()}, i, path, k, t0: clock, dur: Math.min(5.5, 1.3 + .75 * Math.abs(path.S))};
    }
    show(); wake();
  }
  function show() {
    anchors.clear();
    buttons.forEach((b, i) => b.setAttribute('aria-current', i === station ? 'step' : 'false'));
    setRich(text, STATIONS[station].text);
  }
  function setTour(on) {
    tour = on ? {next: clock + (station === 0 ? 2.6 : HOLD)} : null;
    const end = station === STATIONS.length - 1;
    tourButton.setAttribute('aria-pressed', on ? 'true' : 'false');
    tourButton.setAttribute('aria-label', on ? 'Pause the tour' : end ? 'Replay the tour' : 'Play the tour');
    tourButton.dataset.state = on ? 'playing' : end ? 'ended' : 'paused';
  }
  function stopTour() { if (tour) setTour(false); }
  tourButton.addEventListener('click', () => {
    if (tour) { setTour(false); return; }
    if (station === STATIONS.length - 1) go(0);
    setTour(true); wake();
  });
  show();

  // ---------- Frames ----------
  let visible = true, raf = 0, last = 0, pxShown = 0, near = null;  // near: the DNA's hand-over, 0 its axis … 1 its strands
  new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; if (visible) wake(); }).observe(hero);
  rmq.addEventListener('change', e => { calm = e.matches; if (calm) { stopTour(); glide = null; pose = null; } wake(); });
  function wake() { if (!raf && visible) raf = requestAnimationFrame(frame); }
  const blendDir = (a, b, w) => { const q = new THREE.Quaternion().setFromUnitVectors(a, b), out = a.clone(); return out.applyQuaternion(new THREE.Quaternion().slerp(q, w)); };
  // Where the camera is now: a station's pose, or part of the way along a glide.
  function current() {
    if (!glide) return poses[station];
    const to = poses[glide.i], u = quintic(glide.hold ?? (clock - glide.t0) / glide.dur);
    if (glide.dirty) { const k = glide.k, d = glide.from.target.distanceTo(to.target); glide.path = zoomPath(glide.from.dist * k, to.dist * k, d); glide.dirty = false; }
    const [f, w] = glide.path.at(u), F = glide.from;
    return {target: F.target.clone().lerp(to.target, f), dir: blendDir(F.dir, to.dir, f), dist: w / glide.k, anchor: [F.anchor[0] + (to.anchor[0] - F.anchor[0]) * f, F.anchor[1] + (to.anchor[1] - F.anchor[1]) * f], u};
  }
  const tmp = V();
  function frame(now) {
    raf = 0;
    const dt = last ? Math.min(.05, (now - last) / 1000) : 0; last = now; clock += dt;
    if (glide && glide.hold == null && clock - glide.t0 >= glide.dur) { glide = null; pose = null; if (tour) tour.next = clock + HOLD; }
    if (tour && !glide && clock >= tour.next) { if (station < STATIONS.length - 1) go(station + 1); else setTour(false); }
    if (!turn.dragging) { const k = Math.exp(-dt * 2.2); turn.yaw *= k; turn.pitch *= k; }

    // The camera: the pose, turned by the drag (and, unless calm, a slow drift).
    pose = current();
    const {target, dir, dist: D, anchor} = pose;
    const drift = calm ? 0 : .045 * Math.sin(clock * .19);
    const up = V(0, -1, 0), d = dir.clone().applyAxisAngle(up, turn.yaw + drift);
    const side = V().crossVectors(up, d).normalize(); d.applyAxisAngle(side, turn.pitch).normalize();
    camera.setViewOffset(W, H, (.5 - anchor[0]) * W, (.5 - anchor[1]) * H, W, H);
    camera.position.copy(target).addScaledVector(d, D); camera.lookAt(target);
    camera.near = D / 60; camera.far = D * 80; camera.updateProjectionMatrix();
    scene.fog.near = D * 1.2; scene.fog.far = D * 5;

    // Close to, the DNA is its two strands; from afar, its axis in the gene's colours. Strands keep a few pixels wide.
    // The two hand over in turn, never both see-through at once (two half-faded pictures read as a dark, dotted tube):
    // zooming in, the strands come in behind the axis while it is still opaque, then the axis fades away over them
    // (zooming out, the reverse). An outline fades faster than its tube, so a see-through tube never shows its dark
    // outline through its middle. The hand-over follows the scale while the camera glides; at a station whose scale
    // falls within it (in some windows), it eases to the nearer end, so the DNA never rests half-faded.
    const px = viewScale(camera, target, H), byScale = smooth((px - .62) / .25), want = glide ? byScale : Math.round(byScale);
    near = near == null || calm ? want : near + (want - near) * (1 - Math.exp(-dt / .2));
    if (Math.abs(near - want) < .002) near = want;
    const strandsIn = smooth(2 * near), axisIn = 1 - smooth(2 * near - 1);
    fade(fibre.tubes.material, strandsIn); fade(fibre.outline.material, strandsIn ** 3);
    fibre.view(px); fade(fibre.rungs.material, fibre.rungs.material.opacity * strandsIn); fibre.group.visible = strandsIn > 0;
    const radius = minRadius(10, px, 2.1);
    for (const a of axisTubes) {
      const v = a.near ? axisIn : 1;
      fade(a.tube.material, v); fade(a.tube.outline.material, v ** 3); a.group.visible = v > 0;
      if (v > 0 && Math.abs(a.tube.radius - radius) > .03 * radius) { a.tube.radius = radius; a.tube.outline.width = outlineWidth(px); a.tube.update(a.n, a.join); }
    }
    // (In steps of 5 %, so a zoom re-poses the long strands now and then rather than every frame.)
    const pq = Math.exp(Math.round(Math.log(px) * 20) / 20);
    if (pq !== pxShown) { pxShown = pq; for (const s of strands) s.view(pq); for (const c of cartoons) c.c.view(pq); }
    renderer.render(scene, camera);

    // Labels once the camera has settled at a station.
    labels.begin();
    if (!glide) annotate(station);
    const settling = labels.end(camera, W, H, dt, 1, true);
    if (glide || tour || turn.dragging || Math.abs(turn.yaw) + Math.abs(turn.pitch) > 1e-4 || !calm || settling) wake(); else last = 0;
  }
  const mid = (s, a, b) => s.centre(a, b);
  // A label's anchor on a protein: a point of its surface the camera sees (no other protein in front of it), as near
  // its middle as the camera sees it as can be. Found when the camera settles at a station, and kept while it stays.
  const surfaceOf = {}, ray = new THREE.Raycaster(), u = V(), rel = V();
  const solids = () => Object.values(meshAt);
  const meshCentre = k => {
    const key = station + ' ' + k;
    if (anchors.has(key)) return anchors.get(key);
    const pts = surfaceOf[k] ||= sample(meshAt[k], 3), c = pts.reduce((s, p) => s.add(p), V()).divideScalar(pts.length);
    u.copy(camera.position).sub(c).normalize();
    const ranked = pts.map(p => { rel.subVectors(p, c); const along = rel.dot(u); return {p, score: along - .9 * rel.addScaledVector(u, -along).length()}; }).sort((a, b) => b.score - a.score);
    let best = ranked[0].p;
    for (const {p} of ranked.slice(0, 60)) {
      const d = p.clone().sub(camera.position), dist = d.length();
      ray.set(camera.position, d.divideScalar(dist)); ray.far = dist + 2;
      const hit = ray.intersectObjects(solids(), false)[0];
      if (hit && hit.object === meshAt[k] && hit.distance > dist - 4) { best = hit.point; break; }
    }
    anchors.set(key, best.clone()); return anchors.get(key);
  };
  // What each station names.
  function annotate(i) {
    if (i === 0) {
      const ex = PARTS.find(p => p.kind === 'exon' && p.k === 4), intr = PARTS.find(p => p.kind === 'intron' && p.k === 4);
      labels.label(at((ex.from + ex.to) >> 1), 'Exon', '100–200 bp', {color: hex(SPLICING.exon), below: true});
      labels.label(at((intr.from + intr.to) >> 1), 'Intron', 'About 1 kb', {color: hex(lighter(SPLICING.intron, .45)), below: true});
      labels.label(mid(mrna, 300, 900), 'mRNA', 'Leaving the gene', {color: hex(SPLICING.exon)});
    }
    if (i === 1) {
      labels.label(meshCentre('A RNA polymerase II'), 'RNA polymerase II', 'Paused', {color: hex(COLOUR.pol2), below: true});
      labels.label(meshCentre('A Capping enzyme'), 'Capping enzyme', 'Guanylyl-transferase', {color: hex(COLOUR.rngtt), side: 'left'});
      labels.label(rnaA.world(0), '5′ cap', 'Held by CMTR1', {color: hex(SPLICING.cap), inside: true});
      labels.label(meshCentre('A CMTR1'), 'CMTR1', 'Methylates the cap', {color: hex(COLOUR.cmtr1), priority: .5, side: 'right'});
    }
    if (i === 2) {
      // (A copy: the anchor found for the Sm ring is kept for the station, and lerp() would move it every frame.)
      labels.label(meshCentre('B U1 Sm ring').clone().lerp(meshCentre('B U1-70K'), .5), 'U1 snRNP', 'U1 snRNA and its proteins', {color: hex(SPLICING.U1)});
      labels.label(rnaB.world(B.ofU1(118)), '5′ splice site', 'Paired with U1 snRNA', {color: hex(SPLICING.intron)});
      labels.label(meshCentre('B RNA polymerase II'), 'RNA polymerase II', 'Transcribing', {color: hex(COLOUR.pol2), below: true});
    }
    if (i === 3) {
      labels.label(meshCentre('P U5 snRNP'), 'Spliceosome', 'snRNPs and many proteins', {color: hex(SPLICING.U5)});
      labels.label(rnaB.world(B.intron[0] + 480), 'Intron lariat', 'Intron 1, about 1 kb', {color: hex(lighter(SPLICING.intron, .45))});
      labels.label(rnaB.world(B.exon1[0] + 70), 'Exons joined', 'Exon 1 to exon 2', {color: hex(SPLICING.exon)});
    }
    if (i === 4) {
      labels.label(mrna.world(0), '5′ cap', 'm7G', {color: hex(SPLICING.cap)});
      labels.label(mrna.world(600), 'Exons joined', 'All eight', {color: hex(SPLICING.exon)});
      labels.label(mrna.world(mN - 90), 'Poly(A) tail', 'At the 3′ end', {color: hex(SPLICING.polyA)});
    }
  }
  resize(); ro.observe($('hero-text'));
  document.fonts?.ready.then(() => { resize(); wake(); });
  wake();
  const ready = () => { const l = $('loader'); if (l.classList.contains('hidden')) return; l.classList.add('hidden'); setTimeout(() => { l.hidden = true; }, 800); };
  requestAnimationFrame(ready); setTimeout(ready, 600);
  if (!calm) setTour(true); else setTour(false);

  if (new URLSearchParams(location.search).get('debug') === '1') {
    const project = p => { const v = V(...(p.isVector3 ? p.toArray() : p)).project(camera); return [(v.x + 1) * W / 2, (1 - v.y) * H / 2, v.z]; };
    // Every nucleotide's step along each RNA (as drawn: joined pieces end to end), to check none is stretched or kinked.
    const steps = s => { const out = []; const list = s === rnaB ? [[...range(0, B.exon1[1]), ...range(B.exon2[0], B.n)], range(...B.intron)] : [range(0, s.n)];
      for (const order of list) for (let k = 1; k < order.length; k++) out.push(s.points[order[k]].distanceTo(s.points[order[k - 1]])); return out; };
    const range = (a, b) => Array.from({length: b - a}, (_, k) => a + k);
    const bends = s => { const out = []; for (let k = 2; k < s.n; k++) { const a = s.points[k - 1].clone().sub(s.points[k - 2]), b = s.points[k].clone().sub(s.points[k - 1]); out.push(a.angleTo(b)); } return out; };
    window.hub = {
      labels: () => labels.snapshot(), shown: () => labels.shown(), state: () => ({station, touring: !!tour, gliding: !!glide}),
      go: i => { stopTour(); go(i); }, jump: i => { stopTour(); station = i; glide = null; pose = null; show(); wake(); },
      // Part of the way along the glide to station i (u from 0 to 1), held there.
      glideTo: (i, u) => { stopTour(); go(i); if (glide) glide.hold = u; wake(); },
      rooms: () => rooms, lines: () => ({...lines, feather: FEATHER, W, H}), project,
      // Key points of what each station shows (world), and every drawn RNA nucleotide and DNA axis point.
      points: i => POINTS[i].map(p => p.toArray()),
      drawn: () => [...strands.flatMap(s => s.extent().filter((_, k) => k % 6 === 0)), ...genePts.map(p => p.toArray())],
      rna: () => Object.fromEntries([['A', rnaA], ['B', rnaB], ['mRNA', mrna]].map(([k, s]) => { const st = steps(s), b = bends(s); return [k, {n: s.n, min: Math.min(...st), max: Math.max(...st), bend: Math.max(...b)}]; })),
      // Where steps are stretched (> 7 Å) or bends sharp (> 80°) in each RNA, by nucleotide index.
      issues: () => Object.fromEntries([['A', rnaA], ['B', rnaB], ['mRNA', mrna]].map(([k, s]) => {
        const out = []; const list = s === rnaB ? [[...range(0, B.exon1[1]), ...range(B.exon2[0], B.n)], range(...B.intron)] : [range(0, s.n)];
        for (const order of list) for (let j = 1; j < order.length; j++) { const d = s.points[order[j]].distanceTo(s.points[order[j - 1]]); if (d > 7 || d < 4.5) out.push(['step', order[j - 1], order[j], +d.toFixed(1)]);
          if (j > 1) { const u = s.points[order[j - 1]].clone().sub(s.points[order[j - 2]]), v = s.points[order[j]].clone().sub(s.points[order[j - 1]]), ang = u.angleTo(v) * 180 / Math.PI; if (ang > 80) out.push(['bend', order[j - 1], Math.round(ang)]); } }
        return [k, out.slice(0, 30)]; })),
      anchor: k => project(meshCentre(k)), colourOf: k => meshAt[k].material.color.getHexString(),
      held: () => ({A: [...held.A], B: [...held.B]}),
      around: (k, w = 4) => range(k - w, k + w + 1).map(i => [i, rnaB.points[i].toArray().map(x => +x.toFixed(1))]),
      gene: () => ({exons: EXONS, introns: INTRONS, length: GENE, chain: chain.n, polymerases: [polA.from, polB.from], rnaB: B.n, mrna: mN, polyA: POLY_A}),
      camera: () => ({...pose, px: viewScale(camera, pose.target, H)}),
    };
  }
}
start();
