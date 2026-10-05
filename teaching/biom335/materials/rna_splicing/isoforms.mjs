// Scene: the functional consequences of alternative splicing, as the notes give them, in three places shown one at a
// time (each fades out, the camera cuts, the next fades in):
// - pre-mRNAs at the scale of their nucleotides (../shared/rna.mjs), spliced as in the alternative splicing scene: the
//   stretch between two splice sites that pair loops out, the sites meet, the strand is cut and joined there and the
//   loop leaves. CaMKIIδ's exons 13–17 spliced three ways (δC, δB, δA); Bcl-x's exon with two 5′ splice sites (Bcl-xL
//   and Bcl-xS); an exon with a premature stop codon skipped or included, the mRNA that includes it then degraded.
// - a cell, round and a little lumpy (about 20 µm across, its nucleus about 8 µm), cut through its middle (the cell
//   membrane in section, its cytoplasm, its nucleus), in units of 100 Å: CaMKIIδ holoenzymes (8USO, the D6 dodecamer, coarse envelopes from its Cα atoms,
//   drawn 50 times their true size so they show at the scale of the cell) staying in the cytoplasm (δC), moving into
//   the nucleus (δB) and onto the cell membrane (δA).
// - Bcl-xL (1MAZ) at its true size in Å, the part Bcl-xS lacks (residues 126–188, coded by the longer exon's extra
//   stretch) in that stretch's colour. No structure of Bcl-xS exists, so the two isoforms are compared below it as
//   domain maps drawn to scale (UniProt Q07817): Bcl-xL's 233 residues and Bcl-xS's 170, their BH motifs (BH4 4–24,
//   BH3 86–100, BH1 129–148, BH2 180–195) marked, the stretch Bcl-xS lacks narrowing to where it joins 125 to 189.
import * as THREE from 'three';
import {runScene} from '../shared/scene_player.mjs';
import {boxAround} from '../shared/camera.mjs';
import {loadSurfaceSet, surfaceGeometry, proteinMaterial, fade} from '../shared/molecules.mjs';
import {SPLICING, createStrand, loopedRow} from '../shared/rna.mjs';
import {createTube} from '../shared/strands.mjs';
import {ramp, mix} from '../shared/ease.mjs';

const V = (...a) => new THREE.Vector3(...a);
const hex = c => '#' + new THREE.Color(c).getHexString();

// Times (s): each step starts at its t. Each place is shown from CUT after its first step begins (the camera cuts
// then) until its last step ends, fading out over the next step's first half second.
const T = {camk: 0, cyto: 15, nuc: 27, mem: 38, bclx: 50, xl: 63, ptc: 77, decay: 89, end: 101};
const CUT = .6, IN = .7, OUT = .5;
const PLACES = {camk: [T.camk, T.cyto], cell: [T.cyto, T.bclx], bclx: [T.bclx, T.xl], protein: [T.xl, T.ptc], ptc: [T.ptc, T.end + 1]};
const placeShown = (place, t) => { const [a, b] = PLACES[place]; return ramp(t, a ? a + CUT : .1, (a ? a + CUT : .1) + IN) * (1 - ramp(t, b, b + OUT)); };
// Where each place is in the world, far enough apart that only the one the camera is on lies within its far plane.
const AT = {strands: V(0, 0, 0), cell: V(0, 0, 90000), protein: V(0, 0, -90000)};
const DIR = {strands: [0, -.16, -1], cell: [0, -.28, -1], protein: [.12, -.22, -1]};

// ---------- Pre-mRNAs ----------
const UP = V(0, -1, -.3).normalize(), DOWN = V(0, 1, -.3).normalize();
const RISE = 2.6, CLOSE = 2.4, STAGGER = .35, LIFT = 2;
const kept = (n, loops) => { const out = []; let a = 0; for (const [f, t] of loops.slice().sort((x, y) => x[0] - y[0])) { if (f > a) out.push([a, f]); a = t; } if (a < n) out.push([a, n]); return out; };
// CaMKIIδ: exons 13 [0, 10), 14 [18, 24), 15 [32, 40), 16 [48, 54), 17 [62, 72), introns between (eight nucleotides
// each); exons coloured as the notes' figure has them (13 and 17 greys, 14 pink, 15 purple, 16 blue), in shades that
// stay apart for colour-blind viewers where they meet (checked by simulation, as shared/rna.mjs's colours were).
const CAMK = {n: 72, exons: [[0, 10, 13], [18, 24, 14], [32, 40, 15], [48, 54, 16], [62, 72, 17]],
  colour: {13: 0xc9cfd6, 14: 0xf27ab4, 15: 0xa184ec, 16: 0x4fc3e8, 17: 0x7c8591}};
// The three isoforms' holoenzymes, in their exons' colours: δC grey, δB pink, δA blue.
const ISO = {C: {colour: 0xaab2bd, label: '#d9dee4'}, B: {colour: 0xf27ab4, label: '#f59ac0'}, A: {colour: 0x4fb8ea, label: '#8cd2f5'}};
// Bcl-x: exon 1 [0, 8) purple, exon 2 [18, 30) green with its longer form's extra stretch [30, 36) a paler green,
// exon 3 [46, 54) red, as the notes' figure; Bcl-xS's 5′ splice site after nucleotide 29, Bcl-xL's after 35.
const BCLX = {n: 54, e1: 0x9a74d8, e2: 0x1f8f8a, extra: 0xb4e05a, e3: 0xe4574d, xs: 30, xl: 36};
// The isoforms' domain maps: Å per residue, bar height, Bcl-xS's bar below Bcl-xL's, the maps' top below the structure;
// Bcl-xL's BH motifs (UniProt Q07817); when each bar comes in.
const MAP = {k: .42, h: 3.4, gap: 22, top: 18}, MOTIFS = {BH4: [4, 24], BH3: [86, 100], BH1: [129, 148], BH2: [180, 195]};
const MAPS_IN = [T.xl + 4.4, T.xl + 6];
// An exon with a premature stop codon [20, 30) (its codon [24, 27) pale) between two exons [0, 12), [38, 48).
const PTC = {n: 48, exon: 0x3cc48e, stopExon: 0xf06a3a, codon: 0xf6efe2};
const RUNS = [
  // CaMKIIδ, top to bottom: δC (13, 17), δB (13, 14, 17), δA (13, 15, 16, 17), each copy's loops rising above it.
  {id: 'deltaC', place: 'camk', y: -112, n: CAMK.n, loops: [[10, 62]], rise: 2.6, close: 5.6, lift: 10, iso: 'C', exons: [13, 17]},
  {id: 'deltaB', place: 'camk', y: 0, n: CAMK.n, loops: [[10, 18], [24, 62]], rise: 2.6, close: 5.6, lift: 10, iso: 'B', exons: [13, 14, 17]},
  {id: 'deltaA', place: 'camk', y: 76, n: CAMK.n, loops: [[10, 32], [40, 48], [54, 62]], rise: 2.6, close: 5.6, lift: 10, iso: 'A', exons: [13, 15, 16, 17]},
  // Bcl-x: Bcl-xL above (its loops rising), Bcl-xS below (hanging).
  {id: 'bclxL', place: 'bclx', y: -26, n: BCLX.n, loops: [[8, 18], [BCLX.xl, 46]], rise: T.bclx + 2.2, close: T.bclx + 6, lift: 24},
  {id: 'bclxS', place: 'bclx', y: 26, down: true, n: BCLX.n, loops: [[8, 18], [BCLX.xs, 46]], rise: T.bclx + 2.2, close: T.bclx + 6, lift: 24},
  // The exon with a premature stop codon skipped (above) and included (below).
  {id: 'skipped', place: 'ptc', y: -26, n: PTC.n, loops: [[12, 38]], rise: T.ptc + 2, close: T.ptc + 5.5, lift: 24},
  {id: 'included', place: 'ptc', y: 26, down: true, n: PTC.n, loops: [[12, 20], [30, 38]], rise: T.ptc + 2, close: T.ptc + 5.5, lift: 24},
];
const closedAt = r => r.close + CLOSE + STAGGER * (r.loops.length - 1), cutAt = r => closedAt(r) + .2, madeAt = r => cutAt(r) + LIFT + .2;
// Each loop's splice without a step of backbone appearing or vanishing in one frame (as pieces() switches): the step
// joining the exons either side fades in, a piece of its own over the strand, in the moment before the strand is cut
// and joined (at), and the two steps holding the loop fade out in the moment after. They come first among the pieces,
// so the strand's own bases, drawn after, stay whole.
const STEP = .35;
const spliceSteps = (loops, t, at) => {
  const grow = t < at ? ramp(t, at - STEP, at) : 0, shrink = t >= at ? 1 - ramp(t, at, at + STEP) : 0;
  return loops.flatMap(({from, to}) => [
    ...grow > 0 ? [{ranges: [[from - 1, from], [to, to + 1]], opacity: grow}] : [],
    ...shrink > 0 ? [{ranges: [[from - 1, from + 1]], opacity: shrink}, {ranges: [[to - 1, to + 1]], opacity: shrink}] : []]);
};
const DECAY = [T.decay + 1.2, T.decay + 6.2];  // the mRNA with the premature stop codon, degraded from its ends inward

// ---------- The cell ----------
// A cell (units of 100 Å; −y up), round, its membrane and its nucleus each a sphere made a little lumpy (a few gentle
// waves over its surface, a few per cent of its radius): R its radius, the nucleus RN about a centre a little off the
// cell's. Cut through its middle (the plane z = 0), its near half removed: the camera looks at the cut face, the far
// half's membrane and nuclear envelope behind it.
const CELL = {R: 1000, nucleus: {c: V(-90, 25, 0), R: 400}};
// The waves: per surface, a direction, a frequency and a phase each, their amplitudes a fraction of the radius.
const WAVES = {
  cell: [[V(.62, -.41, .67), 2.3, .4, .009], [V(-.25, .91, .33), 3.1, 1.7, .007], [V(.81, .3, -.5), 4.2, 2.9, .005], [V(-.55, -.62, -.56), 1.7, 4.1, .008]],
  nucleus: [[V(-.37, .72, .59), 2.6, 2.2, .013], [V(.9, .12, -.42), 3.4, .9, .009], [V(.18, -.88, .44), 4.6, 3.6, .006], [V(-.71, -.3, -.64), 1.9, 5.2, .011]],
};
const lump = (waves, d) => 1 + waves.reduce((s, [u, f, ph, a]) => s + a * Math.sin(f * d.dot(u) * Math.PI + ph), 0);
const _d = V();
const cellRadius = d => CELL.R * lump(WAVES.cell, d), nucleusRadius = d => CELL.nucleus.R * lump(WAVES.nucleus, d);
// How far a point lies inside the membrane (negative outside), and outside the nuclear envelope (negative inside),
// never more than it truly is (radially, a little less for the waves' slopes).
const insideCell = p => { const r = p.length(); return r < 1e-6 ? CELL.R : (cellRadius(_d.copy(p).divideScalar(r)) - r) * .96; };
const outsideNucleus = p => { _d.subVectors(p, CELL.nucleus.c); const r = _d.length(); return r < 1e-6 ? -CELL.nucleus.R : (r - nucleusRadius(_d.divideScalar(r))) * .96; };
const inNucleus = (p, k = 1) => { _d.subVectors(p, CELL.nucleus.c); const r = _d.length(); return r < k * nucleusRadius(_d.divideScalar(Math.max(r, 1e-6))); };
const MAG = 50, HOLO = MAG / 100;  // holoenzymes drawn 50 times their true size: Å × HOLO in the cell's units
const HOLO_R = 80 * HOLO;          // a holoenzyme's radius in the cell (its Cα atoms reach about 78 Å from its centre)
const BEHIND = HOLO_R + 50;        // how far behind the cut face a holoenzyme's centre lies, at least, so it is whole
// Seeded random numbers, so the cell looks the same every time.
function rng(seed) { return () => { seed = (seed + 0x6D2B79F5) | 0; let x = Math.imul(seed ^ (seed >>> 15), 1 | seed); x = (x + Math.imul(x ^ (x >>> 7), 61 | x)) ^ x; return ((x ^ (x >>> 14)) >>> 0) / 4294967296; }; }
// The membrane's normal at the place nearest a point, pointing into the cell (the gradient of insideCell).
const inward = p => { const e = 2, f = q => insideCell(q); return V(f(V(p.x + e, p.y, p.z)) - f(V(p.x - e, p.y, p.z)), f(V(p.x, p.y + e, p.z)) - f(V(p.x, p.y - e, p.z)), f(V(p.x, p.y, p.z + e)) - f(V(p.x, p.y, p.z - e))).normalize(); };
// A point in the far half of a ball of radius r about c, uniformly by volume.
const inHalfBall = (r, c, rad) => { let d; do { d = V(r() * 2 - 1, r() * 2 - 1, r()); } while (d.lengthSq() > 1 || d.lengthSq() < 1e-4); return d.multiplyScalar(rad).add(c); };
// Points spread through the cytoplasm, the nucleus, or just inside the membrane (behind the cut face).
// Where a point lies on the cut face as the camera sees it (along the view, from its depth to z = 0).
const VIEW_CELL = V(...DIR.cell).normalize();
const onFace = p => p.clone().addScaledVector(VIEW_CELL, -p.z / VIEW_CELL.z);
function cytoplasmPoint(r) {
  const p = inHalfBall(r, V(), CELL.R);
  // (Clear of the membrane by more than a holoenzyme's width, so none of them seems to be on it; and not behind the
  // nucleus as the camera sees it, where, seen through its envelope, it would seem to be in it.)
  return p.z >= BEHIND && insideCell(p) >= HOLO_R + 70 && !inNucleus(p, 1.22) && !inNucleus(onFace(p), 1.25) ? p : null;
}
function cytoplasm(count, seed) {
  const r = rng(seed), out = [];
  while (out.length < count) {
    const p = cytoplasmPoint(r);
    if (!p || out.some(q => q.distanceTo(p) < 2.3 * HOLO_R)) continue;
    out.push(p);
  }
  return out;
}
function nucleoplasm(count, seed) {
  const r = rng(seed), n = CELL.nucleus, out = [];
  while (out.length < count) {
    const p = inHalfBall(r, n.c, n.R);
    if (p.z < BEHIND || !inNucleus(p, .82) || out.some(q => q.distanceTo(p) < 2.3 * HOLO_R)) continue;
    out.push(p);
  }
  return out;
}
// On the membrane where the cut face shows it edge on: the far half's narrow band next to the cut, seen round the
// section's rim (deeper in, the membrane lies behind the section as the camera sees it, and a holoenzyme on it there
// looks to be in the cytoplasm), clear of the nucleus.
function membrane(count, seed) {
  const r = rng(seed), out = [];
  while (out.length < count) {
    const a = 2 * Math.PI * r(), z = mix(BEHIND + 10, CELL.R * .24, r()), rho = Math.sqrt(1 - (z / CELL.R) ** 2);
    const d = V(rho * Math.cos(a), rho * Math.sin(a), z / CELL.R).normalize();
    // Just inside the membrane: a holoenzyme's radius in from it.
    const p = d.clone().multiplyScalar(cellRadius(d) - HOLO_R - 6);
    if (p.z < BEHIND || outsideNucleus(p) < HOLO_R + 40 || out.some(q => q.distanceTo(p) < 2.2 * HOLO_R)) continue;
    out.push(p);
  }
  return out;
}
// A point a little way into the cell from a place on the membrane, where a δA is made before it moves out to it.
function underMembrane(target, r) {
  const q = target.clone().addScaledVector(inward(target), 90 + 200 * r()).add(V(r() - .5, r() - .5, r() - .5).multiplyScalar(120));
  return q.z >= BEHIND && insideCell(q) >= HOLO_R + 30 && !inNucleus(q, 1.22) ? q : null;
}
// Where holoenzymes that move to `targets` (δB into the nucleus, δA onto the membrane) are made: points in the cytoplasm
// (or, for δA, `near` their targets), each moving straight to its target over MOVE s from its own time (starts), so that
// none starts inside another, and every path keeps clear of the holoenzymes still in place (`still`), of the others
// moving (at each moment) and, `around` it, of the nucleus. Each takes the first clear point of a few hundred tried
// within REACH of its target, or the clearest. (Made without regard to the others, δB and δA started inside δC and
// passed through others, and δA through the nucleus.)
const MOVE = 3.6, REACH = 500;
function departures(targets, starts, seed, still, {around = false, near = null} = {}) {
  const r = rng(seed), out = [], apart = 2.3 * HOLO_R, clear = 2.05 * HOLO_R;
  const from = Math.min(...starts), to = Math.max(...starts) + MOVE, grid = Array.from({length: Math.ceil((to - from) / .1) + 1}, (_, k) => from + k * .1);
  const along = (i, p, t) => V().lerpVectors(p, targets[i], ramp(t, starts[i], starts[i] + MOVE));
  for (let i = 0; i < targets.length; i++) {
    // As far from the nucleus as the target lets it be (a holoenzyme's radius, a few units to spare).
    const keep = Math.min(HOLO_R + 4, outsideNucleus(targets[i]) - 1);
    let best = null, bestMargin = -Infinity;
    for (let tried = 0, drawn = 0; tried < 400 && drawn < 200000; drawn++) {
      const p = near && drawn < 20000 ? near(targets[i], r) : cytoplasmPoint(r);
      if (!p || p.distanceTo(targets[i]) > REACH) continue;
      tried++;
      let margin = Math.min(...still.map(q => q.distanceTo(p) - apart), ...out.map(q => q.distanceTo(p) - apart));
      for (const t of grid) {
        if (margin < bestMargin) break;
        const q = along(i, p, t);
        for (const s of still) margin = Math.min(margin, q.distanceTo(s) - clear);
        out.forEach((o, j) => { margin = Math.min(margin, q.distanceTo(along(j, o, t)) - clear); });
        if (around) margin = Math.min(margin, outsideNucleus(q) - keep);
      }
      if (margin > bestMargin) { best = p; bestMargin = margin; }
      if (margin >= 0) break;
    }
    out.push(best);
  }
  return out;
}

// A translucent cell surface as a microscope shows it: faint across its face, brighter where seen edge on. `split`:
// one of two copies of a surface drawn either side of something fading in front of or behind it (see poseCell), 'before'
// and 'after' taking shares of its opacity by uniforms.uSplit (that thing's opacity) so that the two together are the
// surface exactly.
function glassMaterial(color, {opacity, rim, side = THREE.DoubleSide, split = null}) {
  const m = new THREE.MeshStandardMaterial({color, roughness: .45, metalness: 0, envMapIntensity: .35, transparent: true, depthWrite: false, opacity, side});
  const u = {uRim: {value: rim}, uRimColor: {value: new THREE.Color(color).lerp(new THREE.Color(0xeaf6ff), .55)}, uSplit: {value: 1}};
  m.userData.uniforms = u; m.userData.base = opacity;
  const share = {before: 'a = 1. - (1. - a) / max(1e-4, 1. - a * uSplit);', after: 'a *= uSplit;'}[split] ?? '';
  m.onBeforeCompile = sh => {
    Object.assign(sh.uniforms, u);
    sh.fragmentShader = sh.fragmentShader.replace('void main() {', 'uniform float uRim, uSplit;uniform vec3 uRimColor;\nvoid main() {')
      .replace('#include <opaque_fragment>', `float fr = clamp(1. - abs(dot(normalize(normal), normalize(vViewPosition))), 0., 1.);
  float a = clamp(diffuseColor.a * (.7 + 2.2 * fr * fr), 0., 1.);
  ${share}
  gl_FragColor = vec4(outgoingLight + uRim * fr * fr * uRimColor, a);`);
  };
  m.customProgramCacheKey = () => `isoforms-glass-${split ?? 'whole'}`;
  return m;
}
const flatMaterial = (color, opacity) => { const m = new THREE.MeshBasicMaterial({color, transparent: true, opacity, depthWrite: false, side: THREE.DoubleSide}); m.userData.base = opacity; m.userData.noAO = true; return m; };
// A body of several meshes, or a folded one, fading: its depth drawn first, with no colour (renderOrder below its
// own), so only its nearest surface takes colour. It then fades as one surface, at the opacity given, and turns opaque
// without a jump; faded by fade() alone, every see-through layer is drawn in no set order, so a part behind showed
// through the part in front until the body turned opaque (Bcl-xL's two parts, a holoenzyme's hub and kinase domains).
const depthFirst = new THREE.MeshBasicMaterial({colorWrite: false, transparent: true, depthWrite: true, polygonOffset: true, polygonOffsetFactor: 1, polygonOffsetUnits: 1});
depthFirst.userData.noAO = true;
const asOneSurface = m => { m.userData.layered = false; return m; };  // fade() then gives it the opacity asked

const NOTES = 'functional-consequences-of-alternative-splicing';
const steps = [
  {t: T.camk, nav: 'One gene, three kinases', title: 'Exons add or remove<br>protein domains.', notes: NOTES, hold: 1.05,
    text: 'By including or excluding specific exons, alternative splicing can add or remove protein domains, changing a protein’s function, its location within the cell, or its interaction with other molecules. A classic example is the CaMKIIδ gene: between its exons 13 and 17 lie three alternative exons, 14, 15 and 16.'},
  {t: T.cyto, nav: 'δC: the cytoplasm', title: 'Skipping all three:<br>a cytoplasmic kinase.', notes: NOTES,
    text: 'Skipping all three alternative exons produces a cytoplasmic kinase, CaMKIIδC. In a cell, it stays in the cytoplasm, between the cell membrane and the nucleus.'},
  {t: T.nuc, nav: 'δB: the nucleus', title: 'Exon 14 sends it<br>to the nucleus.', notes: NOTES,
    text: 'Including exon 14, which contains a nuclear localization signal, sends the kinase, CaMKIIδB, to the nucleus.'},
  {t: T.mem, nav: 'δA: the cell membrane', title: 'Exons 15 and 16:<br>to the cell membrane.', notes: NOTES,
    text: 'Including exons 15 and 16 targets the kinase, CaMKIIδA, to the cell membrane, which is common in neurons. One gene gives three kinases, each in its own part of the cell.'},
  {t: T.bclx, nav: 'Bcl-x: two isoforms', title: 'Bcl-x: two isoforms,<br>opposite functions.', notes: NOTES, hold: 1.05,
    text: 'Alternatively spliced products can have opposite functions: many genes involved in apoptosis (programmed cell death) produce one isoform that promotes cell death and another that protects the cell. The BCL2L1 gene codes for Bcl-x, a key member of the Bcl-2 family of apoptosis regulators; its pre-mRNA is spliced into two major isoforms, Bcl-xL (long) and Bcl-xS (short).'},
  {t: T.xl, nav: 'Bcl-xL and Bcl-xS', title: 'Bcl-xL protects the cell;<br>Bcl-xS promotes its death.', notes: NOTES, hold: 1.1,
    text: 'Bcl-xL is anti-apoptotic (pro-survival): the larger protein, it prevents the release of mitochondrial factors like cytochrome c, which would otherwise trigger cell death. Bcl-xS, a smaller protein lacking a key domain found in Bcl-xL, is pro-apoptotic, in part by inhibiting Bcl-xL’s protective effect. A high Bcl-xL/Bcl-xS ratio favors survival; a low ratio sensitizes the cell to death.'},
  {t: T.ptc, nav: 'A premature stop codon', title: 'An exon with a<br>premature stop codon.', notes: NOTES,
    text: 'Alternative splicing can also control the abundance of an mRNA. Sometimes splicing includes an exon that contains a premature stop codon; when that exon is skipped, the mRNA has none.'},
  {t: T.decay, nav: 'Rapid degradation', title: 'That mRNA is<br>rapidly degraded.', notes: NOTES,
    text: 'Including the exon with the premature stop codon targets the mRNA for rapid degradation, effectively reducing the amount of protein produced. This is a way to fine-tune gene expression levels, similar to transcriptional regulation.'},
];

const at = {};  // states the tests read
let shotsOf = null;
const framed = name => () => shotsOf[name];

runScene({
  pageTitle: 'Isoforms · RNA splicing and processing', eyebrow: 'Isoforms',
  links: [{href: 'index.html', text: 'All scenes'}],
  steps, duration: T.end, notesPage: 'notes.html', fov: 26, fog: .00002, far: 30000, loop: false,
  shots: [
    {t: T.camk, frame: framed('camk')},
    {t: T.cyto + CUT, blend: 0, frame: framed('cell')},
    {t: T.bclx + CUT, blend: 0, frame: framed('bclx')},
    {t: T.xl + CUT, blend: 0, frame: framed('protein')},
    {t: T.ptc + CUT, blend: 0, frame: framed('ptc')},
  ],
  async build({world, progress}) {
    const set = await loadSurfaceSet('assets/isoforms.json', 'assets/isoforms.bin', progress);
    const geometry = name => surfaceGeometry(set.byName.get(name), set.buffer);

    // ---------- Pre-mRNAs ----------
    const strandsAt = new THREE.Group(); strandsAt.position.copy(AT.strands); world.add(strandsAt);
    const colourOf = r => {
      if (r.place === 'camk') return CAMK.exons.map(([a, b, k]) => [a, b, CAMK.colour[k]]);
      if (r.place === 'bclx') return [[0, 8, BCLX.e1], [18, 30, BCLX.e2], [30, 36, BCLX.extra], [46, 54, BCLX.e3]];
      return [[0, 12, PTC.exon], [20, 30, PTC.stopExon], [24, 27, PTC.codon], [38, 48, PTC.exon]];
    };
    const runs = RUNS.map(r => {
      const rise = r.place === 'camk' ? T.camk + r.rise : r.rise, close = r.place === 'camk' ? T.camk + r.close : r.close;
      const strand = createStrand(strandsAt, r.n, {radius: 2.2, stub: 5, stubRadius: .7}).stretches(colourOf(r), SPLICING.intron);
      return {...r, rise, close, strand, loops: r.loops.map(([from, to]) => ({from, to, w: 0})), mrna: kept(r.n, r.loops), shown: 0, cut: false, hold: .55};
    });
    const run = Object.fromEntries(runs.map(r => [r.id, r]));
    const poseRun = (r, t, pxPerA) => {
      let shown = placeShown(r.place, t);
      // The mRNA with the premature stop codon is degraded: drawn ever shorter from both ends, then gone.
      const decay = r.id === 'included' ? ramp(t, ...DECAY) : 0;
      if (decay >= 1) shown = 0;
      r.shown = shown; r.decay = decay;
      if (shown <= 0) { r.strand.opacity(0); return; }
      const cut = cutAt(r), fadeOut = 1 - ramp(t, cut + .2, cut + LIFT), lift = r.lift * ramp(t, cut + .1, cut + LIFT);
      r.cut = t >= cut;
      const states = r.loops.map((L, k) => {
        const r0 = r.rise + k * STAGGER, c0 = r.close + k * STAGGER;
        L.w = t < c0 ? r.hold * ramp(t, r0, r0 + RISE) : mix(r.hold, 1, ramp(t, c0, c0 + CLOSE));
        return {from: L.from, to: L.to, w: L.w, lift: r.cut ? lift : 0};
      });
      let mrna = [r.mrna];
      if (decay > 0) {
        // The mRNA's nucleotides in order, eaten from both ends inward: those within x of an end gone, and the
        // outermost one left at each end fading (with its step to the next, its base thinning) as x grows, so the
        // strand shortens smoothly rather than by a nucleotide at a time. The fading ends are drawn before the rest,
        // so the next nucleotide in keeps its whole base.
        const order = r.mrna.flatMap(([a, b]) => Array.from({length: b - a}, (_, i) => a + i)), m = order.length;
        const x = decay * m / 2, k = Math.floor(x), f = x - k, left = m - 2 * k;
        const ranges = list => { const out = []; for (const i of list) { const last = out.at(-1); if (last && last[1] === i) last[1] = i + 1; else out.push([i, i + 1]); } return out; };
        mrna = left <= 2 ? [{ranges: ranges(order.slice(k, m - k)), opacity: 1 - f}]
          : [{ranges: ranges(order.slice(k, k + 2)), opacity: 1 - f}, {ranges: ranges(order.slice(m - k - 2, m - k)), opacity: 1 - f}, ranges(order.slice(k + 1, m - k - 1))];
      }
      r.strand.opacity(shown);
      const splices = spliceSteps(r.loops, t, cut);
      r.strand.pieces(r.cut ? [...splices, ...mrna, ...r.loops.map(L => ({ranges: [[L.from, L.to]], opacity: fadeOut}))] : splices.length ? [...splices, [0, r.n]] : null);
      loopedRow(r.n, states, {origin: V(0, r.y, 0), toward: r.down ? DOWN : UP, out: r.strand.points});
      r.strand.pose().view(pxPerA);
    };

    // ---------- The cell ----------
    const cell = new THREE.Group(); cell.position.copy(AT.cell); world.add(cell);
    const cellMaterials = [];
    // A lumpy sphere's far half (z ≥ 0) about c, its radius radiusOf(direction): rings from its pole (+z) to the cut.
    const farHalf = (c, radiusOf, rings = 30, segs = 72) => {
      const pos = [], idx = [];
      for (let i = 0; i <= rings; i++) for (let j = 0; j <= segs; j++) {
        const al = Math.PI / 2 * i / rings, be = 2 * Math.PI * j / segs, d = V(Math.sin(al) * Math.cos(be), Math.sin(al) * Math.sin(be), Math.cos(al));
        pos.push(...d.multiplyScalar(radiusOf(d)).add(c).toArray());
      }
      for (let i = 0; i < rings; i++) for (let j = 0; j < segs; j++) { const a = i * (segs + 1) + j, b = a + segs + 1; idx.push(a, b, a + 1, a + 1, b, b + 1); }
      const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setIndex(idx); g.computeVertexNormals();
      return g;
    };
    // Where a lumpy sphere meets the cut face: its section's outline (n points round, z = 0).
    const sectionOf = (c, radiusOf, n) => Array.from({length: n}, (_, k) => { const a = 2 * Math.PI * k / n, d = V(Math.cos(a), Math.sin(a), 0); return d.multiplyScalar(radiusOf(d)).add(c); });
    const N0 = CELL.nucleus, membraneLine = sectionOf(V(), cellRadius, 160), nucleusLine = sectionOf(N0.c, nucleusRadius, 120);
    // The far half of the cell membrane: its inside, which the camera sees behind everything in the cell, drawn first;
    // its outside, in front of everything, last. (One two-sided mesh drew both after the holoenzymes, so while they faded
    // the far wall showed over them.)
    {
      const g = farHalf(V(), cellRadius);
      for (const [side, order] of [[THREE.BackSide, -3], [THREE.FrontSide, 3]]) {
        const m = glassMaterial(0xa3bfd8, {opacity: .13, rim: .4, side}); cellMaterials.push(m);
        const wall = new THREE.Mesh(g, m); wall.renderOrder = order; cell.add(wall);
      }
    }
    // The cut face: the cytoplasm in section (a faint fill), with the nucleus in section cut out of it.
    {
      const shape = new THREE.Shape(membraneLine.map(p => new THREE.Vector2(p.x, p.y)));
      shape.holes.push(new THREE.Path(nucleusLine.map(p => new THREE.Vector2(p.x, p.y))));
      const m = flatMaterial(0x7d9cbb, .07); cellMaterials.push(m);
      const face = new THREE.Mesh(new THREE.ShapeGeometry(shape, 48), m); face.renderOrder = 2; cell.add(face);
    }
    // The nucleus: the far half of its envelope, and its section. The envelope is drawn as two shares, one before the
    // holoenzymes and one after (see poseCell).
    const nucleusShares = [];
    {
      const g = farHalf(N0.c, nucleusRadius, 24, 60);
      for (const [split, order] of [['before', -2], ['after', 2]]) {
        const m = glassMaterial(0x7384d8, {opacity: .22, rim: .35, split}); cellMaterials.push(m);
        const half = new THREE.Mesh(g, m); half.renderOrder = order; cell.add(half); nucleusShares.push(half);
      }
      const fill = flatMaterial(0x7384d8, .1); cellMaterials.push(fill);
      const sec = new THREE.Mesh(new THREE.ShapeGeometry(new THREE.Shape(nucleusLine.map(p => new THREE.Vector2(p.x, p.y))), 64), fill); sec.renderOrder = 2; cell.add(sec);
    }
    // Outlines in the cut face: the cell membrane and the nuclear envelope.
    const outlines = [];
    const outline = (points, color, radius) => {
      const curve = new THREE.CatmullRomCurve3(points, true, 'centripetal'), max = 260, tb = createTube(cell, {color, radius, max, glow: .25});
      curve.getSpacedPoints(max - 1).forEach((p, i) => tb.points[i].copy(p)); tb.update(max); outlines.push(tb); cellMaterials.push(tb.material);
      tb.material.userData.base = 1; return tb;
    };
    outline(membraneLine, 0xbfd6ea, 7);
    outline(nucleusLine, 0x9aa6f0, 6);
    const farPoints = [];
    for (let i = 1; i <= 6; i++) for (let j = 0; j < 16; j++) { const al = Math.PI / 2 * (1 - i / 6), be = 2 * Math.PI * j / 16, d = V(Math.sin(al) * Math.cos(be), Math.sin(al) * Math.sin(be), Math.cos(al)); farPoints.push(d.multiplyScalar(cellRadius(d))); }
    // CaMKIIδ holoenzymes: each isoform's kinase domains in its colour, their hub a shade deeper; instanced.
    const holoGeo = {kinase: geometry('Kinase domains'), hub: geometry('Hub domains')};
    const holo = {}, COUNT = {C: 26, B: 18, A: 24};
    // Each holoenzyme's turn, and when it sets off (δB and δA).
    const spins = Object.fromEntries(Object.entries(COUNT).map(([k, count]) => {
      const r = rng(71 + k.charCodeAt(0));
      return [k, Array.from({length: count}, () => ({q: new THREE.Quaternion().setFromEuler(new THREE.Euler(r() * 6.3, r() * 6.3, r() * 6.3)), axis: V(r() - .5, r() - .5, r() - .5).normalize(), rate: .15 + .2 * r(), delay: r()}))];
    }));
    const setsOff = (k, i) => (k === 'B' ? T.nuc : T.mem) + 2.4 + spins[k][i].delay * 1.4;
    // δC in the cytoplasm; δB made there, then moving into the nucleus between δC; δA made there once δB are in the
    // nucleus, a little way in from the membrane, then moving out onto it, clear of the nucleus. None starts inside
    // another, and none passes through another (see departures).
    // δB's places in the nucleus taken deepest first, so none passes those already there.
    const byStart = (k, list, depth) => { const idx = list.map((_, i) => i).sort((a, b) => setsOff(k, a) - setsOff(k, b)), sorted = list.slice().sort((a, b) => depth(a) - depth(b)), out = []; idx.forEach((i, j) => { out[i] = sorted[j]; }); return out; };
    const placesOf = {C: cytoplasm(COUNT.C, 3), B: byStart('B', nucleoplasm(COUNT.B, 5), outsideNucleus), A: membrane(COUNT.A, 41)};
    placesOf.B0 = departures(placesOf.B, placesOf.B.map((_, i) => setsOff('B', i)), 17, placesOf.C);
    placesOf.A0 = departures(placesOf.A, placesOf.A.map((_, i) => setsOff('A', i)), 29, [...placesOf.C, ...placesOf.B], {around: true, near: underMembrane});
    // The δA named: the one that ends furthest right, on the membrane's section beside its tag.
    const A_NAMED = placesOf.A.reduce((best, p, i) => p.x > placesOf.A[best].x ? i : best, 0);
    for (const [k, {colour}] of Object.entries(ISO)) {
      const count = COUNT[k], mats = {kinase: asOneSurface(proteinMaterial(colour, {rim: .3})), hub: asOneSurface(proteinMaterial(new THREE.Color(colour).multiplyScalar(.72).getHex(), {rim: .3}))};
      const meshes = Object.entries(holoGeo).map(([part, g]) => { const m = new THREE.InstancedMesh(g, mats[part], count); m.frustumCulled = false; cell.add(m); return m; });
      // While they fade, their depth first (sharing the meshes' places).
      const depth = meshes.map(m => { const d = new THREE.InstancedMesh(m.geometry, depthFirst, count); d.instanceMatrix = m.instanceMatrix; d.frustumCulled = false; d.renderOrder = -1; d.visible = false; cell.add(d); return d; });
      holo[k] = {meshes, depth, mats, spins: spins[k], count, at: Array.from({length: count}, () => V()), shown: 0};
    }
    const M = new THREE.Matrix4(), Q = new THREE.Quaternion(), S = V(HOLO, HOLO, HOLO), turn = new THREE.Quaternion();
    // Where each isoform's holoenzymes are at t (cell units): δC in the cytoplasm; δB and δA made in the cytoplasm,
    // then moving into the nucleus and onto the membrane.
    const holoAt = (k, i, t) => {
      if (k === 'C') return placesOf.C[i];
      const from = placesOf[k + '0'][i], to = placesOf[k][i], t0 = setsOff(k, i);
      return holo[k].at[i].lerpVectors(from, to, ramp(t, t0, t0 + MOVE));
    };
    const holoShown = (k, t) => placeShown('cell', t) * ramp(t, ...({C: [T.cyto + 1.8, T.cyto + 3], B: [T.nuc + .6, T.nuc + 1.6], A: [T.mem + .6, T.mem + 1.6]}[k]));
    const poseCell = (t, calm) => {
      const f = placeShown('cell', t);
      cell.visible = f > 0;
      for (const m of cellMaterials) { m.opacity = m.userData.base * f; m.visible = f > 0; }
      // The outlines keep writing depth while they fade (a tube has no folds to show through), so the see-through
      // layers drawn after them are hidden behind them as they are once they are opaque.
      for (const tb of outlines) { fade(tb.material, f); tb.material.depthWrite = true; tb.mesh.visible = f > 0; }
      for (const [k, h] of Object.entries(holo)) {
        const s = f > 0 ? holoShown(k, t) : 0;
        h.shown = s >= .995 ? 1 : s <= .005 ? 0 : s;
        for (const part of ['kinase', 'hub']) fade(h.mats[part], h.shown);
        h.meshes.forEach(m => { m.visible = h.shown > 0; });
        h.depth.forEach(m => { m.visible = h.shown > 0 && h.shown < 1; });
        if (h.shown <= 0) continue;
        for (let i = 0; i < h.count; i++) {
          const p = holoAt(k, i, t), sp = h.spins[i];
          // Free holoenzymes turn slowly (not with reduced motion); those on the membrane keep still once there.
          const settled = k === 'A' ? ramp(t, T.mem + 5.5, T.mem + 7.5) : 0;
          Q.copy(sp.q).premultiply(turn.setFromAxisAngle(sp.axis, calm ? 0 : (t * sp.rate) * (1 - settled)));
          M.compose(p, Q, S);
          h.meshes.forEach(m => m.setMatrixAt(i, M));
        }
        h.meshes.forEach(m => { m.instanceMatrix.needsUpdate = true; });
      }
      // The see-through layers round the holoenzymes are drawn in the order they lie from the camera: the dome's
      // inside, the holoenzymes (their depth, then their colour), the cut face and the dome's outside. The nucleus's
      // envelope lies in front of some and behind others: once they are opaque it is drawn after them, hidden where
      // they hide it; while some fade (one isoform at a time, or all as the cell fades out), it is drawn in two
      // shares, before them (all of it as a fade begins, so a holoenzyme still unseen hides none of it) and after them
      // (all of it as the fade ends), so the picture neither jumps as a fade begins nor as it ends.
      const fading = Object.values(holo).find(h => h.shown > 0 && h.shown < 1), w = fading ? fading.shown : 1;
      for (const half of nucleusShares) half.material.userData.uniforms.uSplit.value = w;
      nucleusShares[0].visible = w < 1;
    };

    // ---------- Bcl-xL ----------
    const protein = new THREE.Group(); protein.position.copy(AT.protein); world.add(protein);
    const spin = new THREE.Group(); protein.add(spin);
    const bcl = {xl: geometry('Bcl-xL'), xs: geometry('Missing from Bcl-xS')};
    const bclCentre = new THREE.Box3().setFromBufferAttribute(bcl.xl.attributes.position).union(new THREE.Box3().setFromBufferAttribute(bcl.xs.attributes.position)).getCenter(V());
    const bclMats = {xl: asOneSurface(proteinMaterial(BCLX.e2)), xs: asOneSurface(proteinMaterial(BCLX.extra))};
    const bclMeshes = Object.fromEntries(Object.entries(bcl).map(([k, g]) => { const m = new THREE.Mesh(g, bclMats[k]); m.position.copy(bclCentre).negate(); spin.add(m); return [k, m]; }));
    // While it fades, its two parts' depth first: faded alone, the part Bcl-xS lacks showed over Bcl-xL's front until
    // the protein turned opaque.
    const bclDepth = Object.values(bcl).map(g => { const m = new THREE.Mesh(g, depthFirst); m.position.copy(bclCentre).negate(); m.renderOrder = -1; m.visible = false; spin.add(m); return m; });
    // Where the part Bcl-xS lacks lies (its vertices' mean), and points round both parts' outlines (every 12th vertex).
    const meanOf = g => { const a = g.attributes.position, s = V(); for (let i = 0; i < a.count; i++) s.add(V().fromBufferAttribute(a, i)); return s.divideScalar(a.count).sub(bclCentre); };
    const xsCentre = meanOf(bcl.xs), xlCentre = meanOf(bcl.xl);
    const sample = g => { const a = g.attributes.position, out = []; for (let i = 0; i < a.count; i += 12) out.push(V().fromBufferAttribute(a, i).sub(bclCentre)); return out; };
    const bclPoints = [...sample(bcl.xl), ...sample(bcl.xs)];
    // Where to name a part: a point of its surface (spin's frame) that the camera sees however far the protein turns,
    // so the name's leader moves smoothly with the protein. Of its vertices facing the camera, towards the camera and
    // near the part's middle as the camera sees it, the first that faces the camera and is not hidden by the other part
    // at every turn the shot shows. (Searched afresh as the protein turned, the best vertex jumped from one to another,
    // and the leader's end with it.)
    const anchorOf = (part, centre) => {
      const toCamera = V(...DIR.protein).normalize(), worldDir = toCamera.clone().negate(), meshes = Object.values(bclMeshes), ray = new THREE.Raycaster();
      const a = bcl[part].attributes.position, n = bcl[part].attributes.normal, list = [], o = V();
      for (let i = 0; i < a.count; i += 2) {
        if (V().fromBufferAttribute(n, i).dot(toCamera) < .5) continue;
        const v = V().fromBufferAttribute(a, i).sub(bclCentre); o.subVectors(v, centre);
        const along = o.dot(toCamera), across = o.addScaledVector(toCamera, -along).length();
        list.push([across - .8 * along, v, V().fromBufferAttribute(n, i)]);
      }
      list.sort((x, y) => x[0] - y[0]);
      const turns = [-.35, -.175, 0, .175, .35], seen = (p, normal) => turns.every(angle => {
        spin.rotation.set(0, angle, 0); spin.updateWorldMatrix(true, true);
        if (normal.clone().applyQuaternion(spin.getWorldQuaternion(new THREE.Quaternion())).dot(toCamera) < .25) return false;
        const w = spin.localToWorld(p.clone()); ray.set(w.clone().addScaledVector(worldDir, -400), worldDir);
        const hit = ray.intersectObjects(meshes, false)[0];
        return hit && hit.object === bclMeshes[part] && hit.point.distanceTo(w) < 1.5;
      });
      const found = list.slice(0, 40).find(([, p, normal]) => seen(p, normal));
      spin.rotation.set(0, 0, 0); spin.updateWorldMatrix(true, true);
      return (found ?? list[0])?.[1] ?? centre.clone();
    };
    const bclAnchor = {xl: anchorOf('xl', xlCentre), xs: anchorOf('xs', xsCentre)};
    // ---------- The two isoforms as domain maps (below the structure, square to the view, N-termini aligned) ----------
    const toCam = V(...DIR.protein).normalize(), across = V(0, -1, 0).cross(toCam).normalize(), down = toCam.clone().cross(across).negate();
    const maps = new THREE.Group(); protein.add(maps);
    // (Its z away from the camera: right × down.)
    maps.quaternion.setFromRotationMatrix(new THREE.Matrix4().makeBasis(across, down, across.clone().cross(down)));
    {
      let lowest = -Infinity; for (const a of [-.35, 0, .35]) { spin.rotation.set(0, a, 0); spin.updateWorldMatrix(true, true); for (const p of bclPoints) lowest = Math.max(lowest, spin.localToWorld(p.clone()).sub(protein.position).dot(down)); }
      spin.rotation.set(0, 0, 0); spin.updateWorldMatrix(true, true);
      maps.position.copy(down).multiplyScalar(lowest + MAP.top).addScaledVector(across, -MAP.k * 233 / 2);
    }
    // (In the structure's own surface colours; the motifs darker stripes across the bars.)
    const mapMaterial = c => asOneSurface(proteinMaterial(c));
    const mapMats = {e2: mapMaterial(BCLX.e2), extra: mapMaterial(BCLX.extra), motif: mapMaterial(new THREE.Color(BCLX.e2).multiplyScalar(.42).getHex())};
    // Residue r spans [(r − 1)k, rk] along a bar; y is down the screen.
    const bar = (parent, from, to, y, material, h = MAP.h, z = 0) => {
      const m = new THREE.Mesh(new THREE.BoxGeometry((to - from + 1) * MAP.k, h, 1.6), material);
      m.position.set(((from - 1) + (to - from + 1) / 2) * MAP.k, y, z); parent.add(m); return m;
    };
    const mapsXL = new THREE.Group(), mapsXS = new THREE.Group(); maps.add(mapsXL, mapsXS);
    bar(mapsXL, 1, 125, 0, mapMats.e2); bar(mapsXL, 126, 188, 0, mapMats.extra); bar(mapsXL, 189, 233, 0, mapMats.e2);
    for (const [a, b] of Object.values(MOTIFS)) bar(mapsXL, a, b, 0, mapMats.motif, MAP.h * 1.45, -.9);
    // Bcl-xS: residues 1–125 and then Bcl-xL's 189–233 (its 126–170); of its motifs, BH4, BH3 and BH2's last seven.
    bar(mapsXS, 1, 170, MAP.gap, mapMats.e2);
    for (const [a, b] of [MOTIFS.BH4, MOTIFS.BH3, [189 - 63, 195 - 63]]) bar(mapsXS, a, b, MAP.gap, mapMats.motif, MAP.h * 1.45, -.9);
    // The stretch Bcl-xS lacks, narrowing from Bcl-xL's bar to the join in Bcl-xS's.
    const wedgeMat = new THREE.MeshBasicMaterial({color: BCLX.extra, transparent: true, opacity: 0, depthWrite: false, side: THREE.DoubleSide});
    wedgeMat.userData.noAO = true; wedgeMat.userData.base = .22;
    const wy0 = MAP.h * .75 + .6, wy1 = MAP.gap - MAP.h * .75 - .6;
    const wedge = new THREE.Mesh(new THREE.BufferGeometry().setFromPoints([V(125 * MAP.k, wy0, .4), V(188 * MAP.k, wy0, .4), V(125 * MAP.k, wy1, .4)]), wedgeMat);
    maps.add(wedge);
    const mapAt = (x, y) => { maps.updateWorldMatrix(true, true); return maps.localToWorld(V(x, y, 0)); };
    const mapPoints = () => [[0, -MAP.h * .9], [233 * MAP.k, -MAP.h * .9], [0, MAP.gap + MAP.h * .9], [233 * MAP.k, MAP.gap + MAP.h * .9]].map(([x, y]) => mapAt(x, y));
    // A motif's tag: above the bars (each motif's stripes line up in both), or, for BH1, which only Bcl-xL has, between
    // them, over the stretch Bcl-xS lacks.
    const motifTag = (name, [a, b]) => mapAt(((a + b) / 2 - .5) * MAP.k, name === 'BH1' ? MAP.gap / 2 : -MAP.h * .75 - 4.5);
    let mapsXLShown = 0, mapsXSShown = 0;
    const poseMaps = (t, shown) => {
      mapsXLShown = ramp(t, MAPS_IN[0], MAPS_IN[0] + .8) * shown; mapsXSShown = ramp(t, MAPS_IN[1], MAPS_IN[1] + .8) * shown;
      for (const [g, v] of [[mapsXL, mapsXLShown], [mapsXS, mapsXSShown]]) { g.visible = v > 0; g.traverse(o => { if (o.material) fade(o.material, v); }); }
      wedgeMat.opacity = wedgeMat.userData.base * mapsXSShown; wedge.visible = mapsXSShown > 0;
      maps.visible = mapsXLShown > 0;
    };
    let proteinShown = 0;
    const poseProtein = (t, calm) => {
      const f = placeShown('protein', t); proteinShown = f >= .995 ? 1 : f <= .005 ? 0 : f;
      protein.visible = proteinShown > 0;
      for (const m of Object.values(bclMats)) fade(m, proteinShown);
      for (const m of bclDepth) m.visible = proteinShown > 0 && proteinShown < 1;
      // A slow turn to and fro about the vertical (none with reduced motion).
      spin.rotation.set(0, calm ? 0 : .35 * Math.sin((t - T.xl) * .32), 0);
      poseMaps(t, proteinShown);
    };

    let pxPerA = 1;
    const wp = (group, p) => { group.updateWorldMatrix(true, true); return group.localToWorld(p.clone()); };
    const content = {
      runs: run, holo, at,
      starts: steps.map(s => s.t),
      // For tests: the camera's cuts and the fades round them, and the strands' cuts ([start, end], s).
      moves: [...Object.values(PLACES).flatMap(([a, b]) => [[a - .1, a + CUT + IN + .1], [b - .1, b + OUT + .1]]),
        ...RUNS.map(r => { const c = cutAt({...r, close: r.place === 'camk' ? T.camk + r.close : r.close, loops: r.loops}); return [c - .3, c + LIFT + .1]; }),
        [DECAY[0] - .1, DECAY[1] + .1]].filter(([a]) => a < T.end),
      update(t, {calm = false, pxPerA: px = 1} = {}) {
        pxPerA = px;
        for (const r of runs) poseRun(r, t, pxPerA);
        poseCell(t, calm);
        poseProtein(t, calm);
        at.places = Object.fromEntries(Object.keys(PLACES).map(k => [k, +placeShown(k, t).toFixed(3)]));
        at.cut = Object.fromEntries(runs.map(r => [r.id, r.cut]));
        at.decay = +run.included.decay.toFixed(3);
        // Each isoform's holoenzymes: how many are in the nucleus, how many on the membrane (within 30 units of it).
        at.holo = Object.fromEntries(Object.entries(holo).map(([k, h]) => {
          const ps = Array.from({length: h.count}, (_, i) => holoAt(k, i, t).clone());
          const onMembrane = p => Math.abs(insideCell(p)) < HOLO_R + 40;
          return [k, {shown: +h.shown.toFixed(3), count: h.count, nucleus: ps.filter(p => inNucleus(p)).length, membrane: ps.filter(onMembrane).length}];
        }));
        at.protein = proteinShown;
      },
      // The mRNA a copy makes: the nucleotides it keeps, and each junction's two nucleotides' distance (Å) and the
      // angle (degrees) the strand turns there.
      mrnaOf(id) {
        const r = run[id], s = r.strand;
        return {pieces: r.mrna, length: r.mrna.reduce((a, [f, t]) => a + t - f, 0),
          joins: r.mrna.slice(1).map(([a], k) => { const b = r.mrna[k][1] - 1, p = s.world(b), q = s.world(a), o = s.world(Math.max(0, b - 1));
            return {distance: +p.distanceTo(q).toFixed(3), turn: +(q.clone().sub(p).angleTo(p.clone().sub(o)) * 180 / Math.PI).toFixed(2)}; })};
      },
      annotate(t, {label, tag}) {
        const up = (r, i, d = 9) => r.strand.world(i).addScaledVector(r.down ? DOWN : UP, d);
        const mid = r => { const all = r.mrna.flatMap(([a, b]) => Array.from({length: b - a}, (_, i) => a + i)); return all[Math.floor(all.length / 2)]; };
        if (t < T.cyto + CUT) {
          if (placeShown('camk', t) < .6) return;
          const c = run.deltaC;
          // The exons, named on the top copy until its loop rises; each copy's isoform at its 5′ end.
          if (t > 1.2 && t < c.rise + .8) CAMK.exons.forEach(([a, , k]) => tag(up(c, a + 1), `Exon ${k}`, {color: hex(CAMK.colour[k])}));
          if (t > 1.6) for (const r of [run.deltaC, run.deltaB, run.deltaA]) tag(r.strand.world(0).add(V(-6, 13, 0)), `δ${r.iso}`, {color: ISO[r.iso].label});
          if (t > madeAt(c)) for (const r of [run.deltaC, run.deltaB, run.deltaA])
            label(r.strand.world(mid(r)), `CaMKIIδ${r.iso}`, `Exons ${r.exons.slice(0, -1).join(', ')} and ${r.exons.at(-1)}`, {color: ISO[r.iso].label, side: 'right', below: r.iso === 'A'});
          return;
        }
        if (t < T.bclx + CUT) {
          if (placeShown('cell', t) < .6) return;
          const W = p => wp(cell, p);
          if (t > T.cyto + 1.6) {
            tag(W(N0.c), 'Nucleus', {color: '#b3bcf5'});
            tag(W(V(-CELL.R * .6, -CELL.R * .45, 0)), 'Cytoplasm', {color: '#c3d6e8'});
            // (On the membrane's section, low on the left, clear of the isoforms' names.)
            { const d = V(Math.cos(2.45), Math.sin(2.45), 0); tag(W(d.multiplyScalar(cellRadius(d) + 14)), 'Cell membrane', {color: '#d3e3f0'}); }
          }
          const pick = (k, i) => W(holoAt(k, i, t));
          if (t > T.cyto + 3.2 && t < T.nuc) label(pick('C', 4), 'CaMKIIδC', 'In the cytoplasm', {color: ISO.C.label});
          // (δB 8 comes towards the camera as it enters the nucleus, so on screen it, and its name, hardly move; one
          // crossing the screen took its name with it, which on a phone then jumped to the other side.)
          if (t > T.nuc + 1.2 && t < T.mem) label(pick('B', 8), 'CaMKIIδB', t > T.nuc + 6.5 ? 'In the nucleus' : 'A nuclear localization signal', {color: ISO.B.label});
          if (t > T.mem + 1.2 && t < T.bclx) label(pick('A', A_NAMED), 'CaMKIIδA', t > T.mem + 6.5 ? 'At the cell membrane' : 'Exons 15 and 16', {color: ISO.A.label});
          if (t > T.mem + 7.5) { tag(pick('C', 9).add(V(0, -HOLO_R * 1.1, 0)), 'δC', {color: ISO.C.label}); tag(pick('B', 8).add(V(0, -HOLO_R * 1.1, 0)), 'δB', {color: ISO.B.label}); }
          return;
        }
        if (t < T.xl + CUT) {
          if (placeShown('bclx', t) < .6) return;
          const L = run.bclxL, S = run.bclxS;
          if (t > T.bclx + 1.4) { tag(L.strand.world(0).add(V(-6, -13, 0)), 'Bcl-xL', {color: hex(BCLX.extra)}); tag(S.strand.world(0).add(V(-6, 13, 0)), 'Bcl-xS', {color: hex(BCLX.e2)}); }
          if (t > L.rise + 1 && t < cutAt(L)) {
            label(L.strand.world(BCLX.xl - 1), '5′ splice site', 'Used for Bcl-xL', {color: hex(BCLX.extra), side: 'right'});
            label(S.strand.world(BCLX.xs - 1), '5′ splice site', 'Used for Bcl-xS', {color: hex(BCLX.e2), below: true, side: 'right'});
          }
          if (t > madeAt(L)) {
            label(L.strand.centre(18, 36), 'Bcl-xL mRNA', 'The longer exon', {color: hex(BCLX.extra)});
            label(S.strand.centre(18, 30), 'Bcl-xS mRNA', 'The shorter exon', {color: hex(BCLX.e2), below: true});
          }
          return;
        }
        if (t < T.ptc + CUT) {
          if (proteinShown < .6) return;
          // Each part named at a point of its surface the camera sees (bclAnchor); the two names on the sides their
          // parts lie, so the leaders never cross.
          const xl = wp(spin, bclAnchor.xl), xs = wp(spin, bclAnchor.xs), right = V(0, -1, 0).cross(V(...DIR.protein).normalize());
          const xlLeft = xl.dot(right) < xs.dot(right);
          if (t > T.xl + 1.6) label(xl, 'Bcl-xL', 'Anti-apoptotic', {color: hex(BCLX.e2), side: xlLeft ? 'left' : 'right'});
          if (t > T.xl + 3) label(xs, 'Missing from Bcl-xS', 'A key domain', {color: hex(BCLX.extra), side: xlLeft ? 'right' : 'left'});
          // The domain maps: each isoform named at its bar's end, and Bcl-xL's motifs (Bcl-xS's are the same ones, less
          // BH1 and most of BH2).
          // (The isoforms' names first, so a motif's tag never takes their place.)
          if (mapsXLShown > .6) tag(mapAt(233 * MAP.k + 1.5, 0), 'Bcl-xL · 233 amino acids', {color: hex(BCLX.extra)});
          if (mapsXSShown > .6) tag(mapAt(170 * MAP.k + 1.5, MAP.gap), 'Bcl-xS · 170 amino acids', {color: hex(BCLX.e2)});
          if (mapsXLShown > .6) for (const [name, range] of Object.entries(MOTIFS)) tag(motifTag(name, range), name, {color: '#e9f2ee'});
          return;
        }
        if (placeShown('ptc', t) < .6) return;
        const K = run.skipped, I = run.included;
        if (t > T.ptc + 1.4 && t < DECAY[0]) tag(I.strand.world(24).addScaledVector(UP, 11), 'Premature stop codon', {color: hex(PTC.stopExon)});
        if (t > K.rise + 1 && t < cutAt(K)) { tag(K.strand.centre(20, 30).addScaledVector(UP, 10), 'Skipped', {color: hex(PTC.stopExon)}); }
        if (t > madeAt(K) && t < T.decay + .8) {
          label(K.strand.world(mid(K)), 'mRNA', 'Without the stop codon', {color: hex(PTC.exon)});
          label(I.strand.world(mid(I)), 'mRNA', 'With the premature stop codon', {color: hex(PTC.stopExon), below: true});
        }
        if (t >= T.decay + .8) {  // (≥: at exactly that moment neither pair of names showed, for a frame)
          label(K.strand.world(mid(K)), 'mRNA', 'Kept', {color: hex(PTC.exon)});
          if (I.shown > 0) label(I.strand.world(mid(I)), 'Degraded', 'Rapidly', {color: hex(PTC.stopExon), below: true});
        }
      },
      // Points round everything drawn now (world), with its opacity: shots are fitted to them, and the tests check
      // that none of them passes behind the page's text.
      keyPoints() {
        world.updateMatrixWorld(true);
        const out = runs.filter(r => r.strand.alpha > 0).map(r => ({name: r.id, opacity: +r.strand.alpha.toFixed(3), points: r.strand.extent()}));
        const f = placeShown('cell', at.t ?? 0);
        if (f > 0) {
          // (The membrane's section, and its far half.)
          const pts = [...membraneLine.filter((_, k) => k % 4 === 0), ...farPoints];
          out.push({name: 'cell', opacity: +f.toFixed(3), points: pts.map(p => wp(cell, p).toArray())});
          for (const [k, h] of Object.entries(holo)) if (h.shown > 0) {
            const ps = [];
            for (let i = 0; i < h.count; i++) { const c = holoAt(k, i, at.t ?? 0); for (const d of [[1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0]]) ps.push(wp(cell, c.clone().addScaledVector(V(...d), HOLO_R)).toArray()); }
            out.push({name: `holo${k}`, opacity: h.shown, points: ps});
          }
        }
        if (proteinShown > 0) out.push({name: 'bclxl', opacity: proteinShown, points: bclPoints.map(p => wp(spin, p).toArray())});
        if (mapsXLShown > 0) out.push({name: 'bclmaps', opacity: mapsXLShown, points: mapPoints().map(p => p.toArray())});
        return out;
      },
    };
    // keyPoints() reads the time of the last update().
    const update = content.update;
    content.update = (t, o) => { at.t = t; update(t, o); };

    // Each place's shot: a box fitted round what it shows (sampled through its steps), seen from its direction.
    const around = (from, to, pick, dir, o) => {
      const pts = [];
      for (let t = from; t <= to + 1e-6; t += .25) { content.update(t, {calm: true}); for (const it of content.keyPoints()) if (pick.test(it.name) && it.opacity > .02) for (const p of it.points) pts.push(V(...p)); }
      return boxAround(pts, dir, {fov: 26, ...o});
    };
    // The protein's turn to and fro shows other sides: its box holds every pose.
    const proteinBox = () => {
      const pts = [];
      for (const a of [-.35, 0, .35]) { spin.rotation.set(0, a, 0); for (const p of bclPoints) pts.push(wp(spin, p)); }
      // (With the domain maps below, and room for their tags at the bars' ends.)
      pts.push(...mapPoints(), mapAt(233 * MAP.k + 34, 0), mapAt(170 * MAP.k + 34, MAP.gap));
      return boxAround(pts, DIR.protein, {fov: 26, margin: 16, above: 10, sides: 14});
    };
    shotsOf = {
      camk: around(T.camk + 1, T.cyto, /^delta/, DIR.strands, {margin: 14, above: 16, sides: 10}),
      cell: around(T.cyto + 2, T.bclx, /^(cell|holo)/, DIR.cell, {margin: 60, above: 120}),
      bclx: around(T.bclx + 1, T.xl, /^bclx/, DIR.strands, {margin: 14, above: 14, sides: 10}),
      protein: proteinBox(),
      ptc: around(T.ptc + 1, T.end, /^(skipped|included)$/, DIR.strands, {margin: 14, above: 14, sides: 10}),
    };
    content.frames = shotsOf;
    content.update(0, {pxPerA: 1});
    return content;
  },
});
