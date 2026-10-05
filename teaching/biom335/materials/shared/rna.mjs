// RNA as the course's pages draw it, in the transcription film's look (strands.mjs): a strand is an outlined tube
// through its backbone, and each nucleotide one short bond (a stub) towards its base; paired, a base's bond runs to
// the middle of the pair. What every page with RNA needs:
// - from a structure: the nucleotides of an exported atom group (backbone C4′, base centre, Watson–Crick edge),
//   their partners, and a folded strand drawn from them (createCartoon), as the hybridisation scene and the library
//   draw RNA; the ideal helix of a crystal duplex's base-pair frames (idealHelix);
// - drawn RNA (chapter 4, splicing and processing): a strand of n nucleotides posed every frame from points
//   (createStrand: coloured stretches, pieces cut and joined end to end, drawn up to a count as it is made, extra
//   covalent bonds), layouts that give those points (a line or arc, an ideal A-form strand, a hairpin, a lariat, a row
//   with stretches looped out of it) and blends between two of them that keep the spacing (a fold can sweep along the
//   strand), RNA–RNA pairing as an ideal A-form duplex zipped pair by pair (pairing), and the chapter's colours
//   (SPLICING).
import * as THREE from 'three';
import {STRANDS, BASES, createTube, createRungs, halfRung, bondGeometry, minRadius, outlineWidth, bondFade} from './strands.mjs';
import {fadeObject, fade, baseMaterial} from './molecules.mjs';
import {fitRigid} from './fit.mjs';
import {clamp, smooth} from './ease.mjs';

const V = (...a) => new THREE.Vector3(...a);
const Z = V(0, 0, 1), _a = V(), _b = V(), _c = V(), _m = V(), _q = new THREE.Quaternion();

// ---------- Colours ----------
// Chapter 4's molecules, beside the course's strands (STRANDS: template sky blue, coding ivory, RNA orange), bases
// (BASES) and proteins (molecules.mjs PALETTE; Pol II grey-blue). Exons are the course's RNA orange (they make the
// mRNA), introns a dim grey-violet; the 5′ cap the yellow of G (it is a G), poly(A) the green of A. The snRNAs and
// proteins differ in lightness and on the blue–yellow axis as well as in hue, so they stay apart for colour-blind
// viewers: checked as rendered (strands lit as every page lights them, which pales them) by simulation (Machado 2009
// deutan, protan and tritan) for the molecules seen together: U2, U5 and U6 (the catalytic core) and U4 (paired
// with U6) are pale mint, blue, coral-red and pale lavender; U1 pink. U11 and U12, which take U1's and U2's places in
// the minor spliceosome, are a paler pink and a deeper teal. Ring proteins: Sm sand, Lsm warm grey; SR proteins
// olive-gold, U2AF deep blue, SF1 terracotta. Close under colour blindness, so name them with labels when they meet:
// the cap and an exon (deutan), SR proteins and an exon, U2 and the Sm ring (protan).
export const SPLICING = {
  exon: 0xffa259, intron: 0x5d5884, cap: 0xf0e442, polyA: 0x2fbf8f,
  U1: 0xee5f9f, U2: 0x9eeee2, U4: 0xc0a8ff, U5: 0x3d63e0, U6: 0xc8402a, U11: 0xf9a6cf, U12: 0x2fa59a,
  Sm: 0xe6d2a0, Lsm: 0x7d776c, SR: 0xa08a2a, U2AF: 0x2f4fb0, SF1: 0xa8432f,
};
// A strand colour's base bonds (stubs): a quarter of the way to white, as the film's RNA bases are (#ffa259 → #ffb982).
const WHITE = new THREE.Color(0xffffff);
export const stubColour = (colour, out = new THREE.Color()) => out.set(colour).lerp(WHITE, .25);

// ---------- Nucleotides of a structure ----------
const RING = new Set(['N1', 'C2', 'N3', 'C4', 'C5', 'C6', 'N7', 'C8', 'N9']);
// Per residue of an exported atom group (build_surfaces.py "atoms"), in order: chain, number, letter (read from the
// base's atoms when the export has none, as for a modified nucleotide), residue index, backbone point (C4′, or null
// where the residue has none), base centre (mean of its ring atoms) and Watson–Crick edge atom (N1 of a purine, N3 of
// a pyrimidine; null if missing).
export function nucleotides(g) {
  const A = g.atoms, of = g.residues.map(() => new Map()), ring = g.residues.map(() => []);
  A.name.forEach((name, i) => {
    const r = A.residue[i];
    if (!of[r].has(name)) of[r].set(name, V(...A.position[i]));
    if (RING.has(name)) ring[r].push(V(...A.position[i]));
  });
  return g.residues.map((res, r) => {
    const at = of[r], letter = res.letter || (at.has('N9') ? (at.has('N6') ? 'A' : 'G') : at.has('N4') ? 'C' : 'U');
    const base = ring[r].reduce((s, p) => s.add(p), V()).divideScalar(Math.max(1, ring[r].length));
    return {chain: res.chain, num: res.num, letter, residue: r, backbone: at.get("C4'") || null, base,
      edge: at.get('AG'.includes(letter) ? 'N1' : 'N3') || null};
  });
}
// Which bases pair (Watson–Crick, U with A as T is): A with T or U, G with C.
export const COMPLEMENT = {A: 'TU', T: 'A', U: 'A', G: 'C', C: 'G'};
// Watson–Crick partners: each nucleotide's index in `nts` of the complementary base whose edge atom lies within
// `within` Å of its own, the nearest such and only when it is that one's nearest too (a stacked neighbour on the other
// strand can lie almost as close), or -1. Neighbours in a chain (fewer than `apart` apart) never pair.
export function partners(nts, {within = 3.6, apart = 3} = {}) {
  const near = nts.map((a, i) => {
    let best = -1, d0 = within;
    if (!a.edge) return best;
    nts.forEach((b, j) => {
      if (j === i || !b.edge || !COMPLEMENT[a.letter]?.includes(b.letter) || (a.chain === b.chain && Math.abs(a.num - b.num) < apart)) return;
      const d = a.edge.distanceTo(b.edge); if (d < d0) { d0 = d; best = j; }
    });
    return best;
  });
  return near.map((j, i) => j >= 0 && near[j] === i ? j : -1);
}
// Where a nucleotide's base bond reaches: a stub of `stub` Å from its backbone `own` towards `toward` (its base centre),
// or, paired (`partner`: the other nucleotide's backbone), the middle of the pair; w (0–1) moves the tip from the one
// to the other, as a pair zips.
export const STUB = 4.2;
export function pairTip(out, own, toward, partner = null, w = 1, stub = STUB) {
  out.copy(toward).sub(own).setLength(stub).add(own);
  if (!partner || w <= 0) return out;
  return out.lerp(_m.copy(own).add(partner).multiplyScalar(.5), w);
}

// A strand drawn from a structure as the pages draw nucleic acids: a tube along its backbone (C4′ atoms, smoothed
// through `samples` points a nucleotide) and each base one bond, to the middle of its pair when paired, or else a short
// stub towards its own base. pose(points, tips) places it (backbone and bond tip per residue: see pairTip).
export function createCartoon(parent, count, {colour, rung, radius = 1.05, samples = 4}) {
  const group = new THREE.Group(); parent.add(group);
  const max = (count - 1) * samples + 1, tube = createTube(group, {color: colour, radius, max, glow: STRANDS.glow.template, outline: true});
  const [bonds] = createRungs(group, count, [rung]), pts = Array.from({length: count}, () => V()), end = V();
  return {group, tube, bonds,
    // points: backbone per residue; tips: where each residue's bond reaches.
    pose(points, tips) {
      points.forEach((p, i) => pts[i].copy(p));
      const curve = new THREE.CatmullRomCurve3(pts, false, 'centripetal').getSpacedPoints(max - 1);
      for (let i = 0; i < max; i++) tube.points[i].copy(curve[i]);
      tube.update(max);
      for (let i = 0; i < count; i++) halfRung(bonds, i, points[i], end.copy(tips[i]), STRANDS.rung.radius, 1);
      bonds.instanceMatrix.needsUpdate = true;
    },
    view(pxPerA) { tube.radius = minRadius(tube.base, pxPerA); tube.outline.width = outlineWidth(pxPerA); },
    opacity(v) { fadeObject(group, v); },
  };
}

// ---------- Ideal helices ----------
// The ideal helix of a crystal duplex's base-pair frames (pairs from … to−1 fitted; frames as dna.mjs frameFromPairs
// makes them): the mean step from one pair to the next is a screw, a turn about the helix axis and a rise along it, so
// pair x (any real number; 0 the first pair) sits at anchor ∘ step^x, the anchor fitted to every pair. frame(x, place,
// out) gives pair x's frame, moved by a placement (from place()); place(dir, origin, face, point) puts the helix axis
// along `dir` through `origin`, pair 0 on it, turned about the axis so that `point` (in the structure's coordinates)
// lies towards `face`.
export function idealHelix(frames, from = 0, to = frames.length) {
  const inv = new THREE.Quaternion(), qs = [], ts = [];
  for (let i = from; i + 1 < to; i++) {
    inv.copy(frames[i].q).invert();
    qs.push(inv.clone().multiply(frames[i + 1].q)); ts.push(frames[i + 1].origin.clone().sub(frames[i].origin).applyQuaternion(inv));
  }
  const q = averageQuaternion(qs), t = ts.reduce((s, v) => s.add(v), V()).divideScalar(ts.length);
  if (q.w < 0) q.set(-q.x, -q.y, -q.z, -q.w);
  let angle = 2 * Math.acos(clamp(q.w)), axis = V(q.x, q.y, q.z).normalize(), rise = t.dot(axis);
  if (rise < 0) { axis.negate(); angle = -angle; rise = -rise; }
  // The axis passes through c (square to it from pair 0's origin): (I − R) c = t's part across the axis.
  const across = t.clone().addScaledVector(axis, -rise);
  const c = across.clone().add(axis.clone().cross(across).multiplyScalar(1 / Math.tan(angle / 2))).multiplyScalar(.5);
  const power = (x, qo, po) => { qo.setFromAxisAngle(axis, angle * x); po.copy(c).negate().applyQuaternion(qo).add(c).addScaledVector(axis, rise * x); };
  const qx = new THREE.Quaternion(), px = V(), aq = [], ao = V();
  for (let i = from; i < to; i++) {
    power(i, qx, px); const a = frames[i].q.clone().multiply(qx.clone().invert()); aq.push(a);
    ao.add(frames[i].origin.clone().sub(px.clone().applyQuaternion(a)));
  }
  const anchor = {q: averageQuaternion(aq), origin: ao.divideScalar(to - from)};
  const worldAxis = axis.clone().applyQuaternion(anchor.q), foot = c.clone().applyQuaternion(anchor.q).add(anchor.origin);
  return {
    rise, twist: Math.abs(angle), axis: worldAxis, point: foot,
    frame(x, placement = null, out = {origin: V(), q: new THREE.Quaternion()}) {
      power(x, qx, px);
      out.q.copy(anchor.q).multiply(qx); out.origin.copy(px).applyQuaternion(anchor.q).add(anchor.origin);
      if (placement) { out.q.premultiply(placement.q); out.origin.applyQuaternion(placement.q).add(placement.p); }
      return out;
    },
    place(dir, origin, face, point = null) {
      const q = new THREE.Quaternion().setFromUnitVectors(worldAxis, dir.clone().normalize());
      // Turned about the axis: `point` (or pair 0's base-pair centre) towards `face`.
      const p = (point ? point.clone() : anchor.origin.clone()).sub(foot).applyQuaternion(q), f = face.clone();
      p.addScaledVector(dir, -p.dot(dir)); f.addScaledVector(dir, -f.dot(dir));
      if (p.lengthSq() > 1e-6 && f.lengthSq() > 1e-6) q.premultiply(new THREE.Quaternion().setFromUnitVectors(p.normalize(), f.normalize()));
      return {q, p: origin.clone().sub(foot.clone().applyQuaternion(q))};
    },
  };
}

// The mean of unit quaternions (sign-aligned to the first, then normalised): a good mean for rotations that differ
// little, as successive steps of a helix do.
export function averageQuaternion(list) {
  const s = new THREE.Quaternion(0, 0, 0, 0), first = list[0];
  for (const q of list) { const k = q.dot(first) < 0 ? -1 : 1; s.set(s.x + k * q.x, s.y + k * q.y, s.z + k * q.z, s.w + k * q.w); }
  return s.normalize();
}

// ---------- Ideal A-form RNA ----------
// The mean base pair of an RNA duplex on its ideal helix: the RNA duplex of the poliovirus polymerase's elongation
// complex (3OL6, pairs 1–10 fitted, as dna_or_rna.mjs fits it). Rise 2.91 Å and twist 32.6° a pair (11 a turn,
// right-handed); each strand's backbone point (C4′) and base centre for pair 0, in the helix's frame: z its axis,
// strand a running 5′→3′ up it (pair k at k·rise), strand b antiparallel, x towards pair 0's centre (4.2 Å off the
// axis: A-form's displaced pairs and deep major groove). Pair k is pair 0 turned k·twist about z and raised k·rise.
export const A_FORM = {
  rise: 2.915, twist: 32.65 * Math.PI / 180,
  a: {backbone: V(6.566, -6.987, 1.623), base: V(4.182, -3.151, .557)},
  b: {backbone: V(5.713, 7.817, -1.652), base: V(4.171, 3.151, -.557)},
};
// A point of the ideal A-form in the helix's frame: pair k (any real number), strand 'a' or 'b', 'backbone' or 'base'.
function helixPoint(k, strand, part, out) {
  const p = A_FORM[strand][part], c = Math.cos(k * A_FORM.twist), s = Math.sin(k * A_FORM.twist);
  return out.set(p.x * c - p.y * s, p.x * s + p.y * c, p.z + k * A_FORM.rise);
}
// Neighbouring nucleotides' spacing along a strand of the A-form (C4′ to C4′, 6.1 Å). Every layout spaces its
// nucleotides by it, so a strand keeps its length as it folds from one layout into another.
export const SPACING = helixPoint(0, 'a', 'backbone', V()).distanceTo(helixPoint(1, 'a', 'backbone', V()));

// A placement: where a layout's own frame lies in the world, as a Matrix4 (local → world). From `origin`, a
// `direction` (the layout's z: a helix's axis, a strand's 5′→3′ way) and a `reference` it faces (its x, made square to
// z); or a Matrix4 as it is (from fitRigid, say).
export function placement(p = {}) {
  if (p.isMatrix4) return p.clone();
  const {origin = V(), direction = V(1, 0, 0), reference = V(0, 1, 0)} = p;
  const z = direction.clone().normalize(), x = reference.clone().addScaledVector(z, -reference.dot(z));
  if (x.lengthSq() < 1e-8) x.set(Math.abs(z.y) < .9 ? 0 : 1, Math.abs(z.y) < .9 ? 1 : 0, 0).addScaledVector(z, -(Math.abs(z.y) < .9 ? z.y : z.x));
  x.normalize();
  return new THREE.Matrix4().makeBasis(x, z.clone().cross(x), z).setPosition(origin);
}
// A point of the ideal A-form (as helixPoint) placed in the world.
export function aFormPoint(k, strand = 'a', part = 'backbone', place = new THREE.Matrix4(), out = V()) {
  return helixPoint(k, strand, part, out).applyMatrix4(place.isMatrix4 ? place : placement(place));
}

// ---------- Layouts: a point per nucleotide (its backbone, C4′) ----------
// Every layout returns an array of Vector3 (or fills `out`), its nucleotides SPACING apart unless asked otherwise.
const outOf = (n, out) => { out ||= []; for (let i = 0; i < n; i++) out[i] ||= V(); out.length = n; return out; };

// A straight strand from `origin` along `direction` (5′→3′), or an arc turning by `bend` radians in all (towards
// `toward`) with every nucleotide the same distance from the next.
export function line(n, {origin = V(), direction = V(1, 0, 0), toward = V(0, 1, 0), bend = 0, spacing = SPACING, out} = {}) {
  out = outOf(n, out);
  const d = direction.clone().normalize(), axis = d.clone().cross(toward).normalize(), step = n > 2 ? bend / (n - 2) : 0;
  if (axis.lengthSq() < 1e-8) axis.copy(Z);
  out[0]?.copy(origin);
  for (let i = 1; i < n; i++) { out[i].copy(out[i - 1]).addScaledVector(d, spacing); d.applyAxisAngle(axis, step); }
  return out;
}
// A strand along any curve (a THREE.Curve), its nucleotides `spacing` apart along it from arc length `from` (Å).
export function along(curve, n, {spacing = SPACING, from = 0, out} = {}) {
  out = outOf(n, out); const L = curve.getLength();
  for (let i = 0; i < n; i++) curve.getPointAt(clamp((from + i * spacing) / L), out[i]);
  return out;
}
// Nucleotides leaving point p: heading first along `tangent`, turning smoothly towards `toward` (a third of the way
// each step), each `spacing` from the last. A strand's free end carried on from a helix or a ring without a kink.
export function onwards(p, tangent, toward, m, {spacing = SPACING, turn = .35, out} = {}) {
  out = outOf(m, out); const h = tangent.clone().normalize(), goal = toward.clone().normalize(), at = p.clone();
  for (let i = 0; i < m; i++) { at.addScaledVector(h, spacing); out[i].copy(at); h.lerp(goal, turn).normalize(); }
  return out;
}
// One strand of the ideal A-form helix (strand a, 5′→3′ up the axis): nucleotide i at pair start + i. `place`: a
// placement (origin on the axis at pair 0, direction the axis, reference towards pair 0's centre).
export function aFormStrand(n, place = {}, {start = 0, strand = 'a', out} = {}) {
  out = outOf(n, out); const m = placement(place);
  for (let i = 0; i < n; i++) helixPoint(strand === 'a' ? start + i : start + n - 1 - i, strand, 'backbone', out[i]).applyMatrix4(m);
  return out;
}
// Points between p and q (m of them, not p and q themselves) on a circular arc bulging towards `bulge`, in the plane
// of p, q and `bulge`, every step the same length: (m + 1)·spacing along the arc, which may pass a semicircle. Too short
// to reach, they lie on the straight line.
export function arcBetween(p, q, m, {bulge = V(0, -1, 0), spacing = SPACING, out} = {}) {
  out = outOf(m, out); const c = p.distanceTo(q), N = m + 1, u = V().subVectors(q, p).normalize();
  const side = bulge.clone().addScaledVector(u, -bulge.dot(u));
  if (side.lengthSq() < 1e-8) side.copy(Math.abs(u.y) < .9 ? V(0, 1, 0) : V(1, 0, 0)).addScaledVector(u, -(Math.abs(u.y) < .9 ? u.y : u.x));
  side.normalize();
  if (N * spacing <= c + 1e-6) { for (let i = 0; i < m; i++) out[i].lerpVectors(p, q, (i + 1) / N); return out; }
  // The circle of radius R on which N chords of `spacing` span the chord c: each chord turns 2·asin(s/2R), the arc's
  // half-angle is N times half that, and c = 2R·sin(half). c grows with R (from a full circle to a straight line).
  const halfOf = R => N * Math.asin(Math.min(1, spacing / (2 * R)));
  let lo = spacing / (2 * Math.sin(Math.PI / N)), hi = 1e5;
  for (let k = 0; k < 100; k++) { const R = (lo + hi) / 2; if (2 * R * Math.sin(halfOf(R)) < c) lo = R; else hi = R; }
  const R = (lo + hi) / 2, half = halfOf(R), step = 2 * half / N;
  // Centre on the far side of the chord for less than a semicircle, on the bulge's side for more.
  const centre = p.clone().add(q).multiplyScalar(.5).addScaledVector(side, -R * Math.cos(half));
  for (let i = 0; i < m; i++) { const th = -half + (i + 1) * step; out[i].copy(centre).addScaledVector(side, R * Math.cos(th)).addScaledVector(u, R * Math.sin(th)); }
  return out;
}
// A hairpin (stem-loop): a stem of `stem` A-form pairs, the 5′ arm up the axis (strand a) and the 3′ arm back down
// (strand b), joined by a loop of `loop` nucleotides arching over the stem's top; free tails of tail5 and tail3
// nucleotides leave the stem's foot. n = tail5 + 2·stem + loop + tail3. `.pairs` lists the stem's pairs [i, j] (5′
// arm, 3′ arm), for pairing() or strand.pair(). `place` as for aFormStrand (origin on the axis at the stem's foot).
export function hairpin(stem, loop, place = {}, {tail5 = 0, tail3 = 0, out} = {}) {
  const n = tail5 + 2 * stem + loop + tail3, m = placement(place); out = outOf(n, out);
  const axis = V().setFromMatrixColumn(m, 2).normalize();
  for (let k = 0; k < stem; k++) {
    helixPoint(k, 'a', 'backbone', out[tail5 + k]).applyMatrix4(m);
    helixPoint(k, 'b', 'backbone', out[tail5 + 2 * stem + loop - 1 - k]).applyMatrix4(m);
  }
  const top5 = out[tail5 + stem - 1], top3 = out[tail5 + stem + loop];
  arcBetween(top5, top3, loop, {bulge: axis, out: out.slice(tail5 + stem, tail5 + stem + loop)});
  // Tails carried on from the stem's ends, turning to run down, away from the stem.
  const down = axis.clone().negate(), foot5 = out[tail5], foot3 = out[tail5 + 2 * stem + loop - 1];
  if (tail5) onwards(foot5, foot5.clone().sub(out[tail5 + 1]), down, tail5, {out: out.slice(0, tail5).reverse()});
  if (tail3) onwards(foot3, foot3.clone().sub(out[tail5 + 2 * stem + loop - 2]), down, tail3, {out: out.slice(n - tail3)});
  out.pairs = Array.from({length: stem}, (_, k) => [tail5 + k, tail5 + 2 * stem + loop - 1 - k]);
  return out;
}
// A lariat: an intron whose 5′ end (nucleotide 0, the G of its GU) is joined by a 2′–5′ bond to the branch nucleotide
// (`branch`, the A of the branch site), closing a loop of branch + 1 nucleotides, with the rest of the strand (the 3′
// tail, n − branch − 1 nucleotides) running on from the branch. The loop is a ring of equal steps, the closing step
// (nucleotide 0 to the branch) the 2′–5′ bond, in the plane of `place`'s direction and reference: origin at the
// branch nucleotide, direction the way the tail leaves (the ring lies behind the branch, opposite it), the 5′ end on
// the reference side of the branch. `bend` curves the tail (radians in all, towards the reference side). `.link` is
// [0, branch] (the 2′–5′ bond's two nucleotides, for strand.link()), `.centre` the ring's centre.
export function lariat(n, branch, place = {}, {bend = 0, spacing = SPACING, out} = {}) {
  out = outOf(n, out); const m = placement(place), N = branch + 1, R = spacing / (2 * Math.sin(Math.PI / N));
  for (let i = 0; i <= branch; i++) {
    const a = 2 * Math.PI * (branch - i) / N;
    out[i].set(-R * Math.sin(a), 0, R * (Math.cos(a) - 1)).applyMatrix4(m);
  }
  const origin = out[branch], dir = V().setFromMatrixColumn(m, 2).normalize(), side = V().setFromMatrixColumn(m, 0).normalize();
  if (n > N) line(n - N + 1, {origin, direction: dir, toward: side, bend, spacing, out: [V(), ...out.slice(N)]});
  out.link = [0, branch]; out.centre = V(0, 0, -R).applyMatrix4(m);
  return out;
}
// A stretch of m nucleotides lifted out of a strand between two of its nucleotides p and q (not included): a loop
// rising towards `toward`, its feet at p and q, every step `spacing` along it ((m + 1)·spacing in all). In line when
// p and q lie that far apart, an arch as they close in, and a teardrop widest near its top once they meet one step
// apart: an intron (or exons with their introns) looping out as two splice sites pair. Farther apart than the stretch
// reaches, the points lie evenly on the straight line.
export function loopBetween(p, q, m, {toward = V(0, -1, 0), spacing = SPACING, out} = {}) {
  out = outOf(m, out); const c = p.distanceTo(q), L = (m + 1) * spacing;
  if (m < 1 || c >= L - 1e-9) { for (let i = 0; i < m; i++) out[i].lerpVectors(p, q, (i + 1) / (m + 1)); return out; }
  const u = c > 1e-9 ? V().subVectors(q, p).divideScalar(c) : V(1, 0, 0), up = toward.clone().addScaledVector(u, -toward.dot(u));
  if (up.lengthSq() < 1e-8) up.copy(Math.abs(u.z) < .9 ? V(0, 0, 1) : V(1, 0, 0)).cross(u);
  up.normalize();
  // A cubic Bézier from p to q, its inner control points raised h towards `up` and drawn apart by beta·h as the feet
  // close (k: 0 in line … 1 one step apart), so the top widens into a teardrop. The nucleotides are walked along it
  // from p, each `spacing` from the last, and h is found so the last of them lies `spacing` from q.
  const k = clamp((L - c) / Math.max(1e-9, L - spacing)), beta = k * k, S = 128;
  const P1 = V(), P2 = V(), pts = Array.from({length: S + 1}, () => V()), at = V(), A = V(), D = V(), F = V();
  const shape = h => {
    P1.copy(p).addScaledVector(up, h).addScaledVector(u, -beta * h); P2.copy(q).addScaledVector(up, h).addScaledVector(u, beta * h);
    for (let s = 0; s <= S; s++) {
      const t = s / S, a = (1 - t) ** 3, b = 3 * (1 - t) ** 2 * t, e = 3 * (1 - t) * t * t, f = t ** 3;
      pts[s].set(a * p.x + b * P1.x + e * P2.x + f * q.x, a * p.y + b * P1.y + e * P2.y + f * q.y, a * p.z + b * P1.z + e * P2.z + f * q.z);
    }
  };
  // Walks m steps of `spacing` (chords) along the curve from p, writing them to out; the distance left to q, or −1
  // if the curve ends first.
  const walk = () => {
    at.copy(p); let seg = 0;
    for (let i = 0; i < m; i++) {
      let j = seg + 1;
      while (j <= S && pts[j].distanceTo(at) < spacing) j++;
      if (j > S) return -1;
      // On the segment from A (where the walk is, or the segment's start) to pts[j], the point `spacing` from `at`.
      A.copy(j - 1 === seg ? at : pts[j - 1]); D.subVectors(pts[j], A); F.subVectors(A, at);
      const qa = D.lengthSq(), qb = 2 * F.dot(D), qc = F.lengthSq() - spacing * spacing;
      const t = clamp((-qb + Math.sqrt(Math.max(0, qb * qb - 4 * qa * qc))) / (2 * qa || 1));
      at.copy(A).addScaledVector(D, t); out[i].copy(at); seg = j - 1;
    }
    return at.distanceTo(q);
  };
  let lo = 0, hi = L;
  for (let it = 0; it < 44; it++) { const h = (lo + hi) / 2; shape(h); if (walk() < spacing) lo = h; else hi = h; }
  shape(hi); walk();
  return out;
}
// A strand laid in a row with stretches looped out of it (a pre-mRNA whose introns loop out as their splice sites
// pair): loops [{from, to, w, lift}], the nucleotides from … to − 1 lifted towards `toward` between nucleotides
// from − 1 and to (loopBetween), which close in by w (0 in line; 1 one step apart and in line, ready to be joined end
// to end with strand.pieces()), the loop then carried `lift` Å on towards `toward` (cut free, leaving). The row runs
// along `direction`, every other step `spacing`, centred on `origin` (the middle of its first and last nucleotides),
// so it shortens from both ends as its loops close. Loops must not overlap, nor include the strand's ends.
export function loopedRow(n, loops = [], {origin = V(), direction = V(1, 0, 0), toward = V(0, -1, 0), spacing = SPACING, out} = {}) {
  out = outOf(n, out); const d = direction.clone().normalize(), up = toward.clone().normalize(), inLoop = new Int32Array(n).fill(-1);
  loops.forEach((L, j) => { for (let i = Math.max(1, L.from); i < Math.min(n - 1, L.to); i++) inLoop[i] = j; });
  const at = new Float64Array(n);
  let x = 0, prev = -1;
  for (let i = 0; i < n; i++) {
    if (inLoop[i] >= 0) continue;
    if (prev >= 0) { const j = inLoop[i - 1], L = loops[j]; x += j >= 0 ? (i - prev) * spacing + (spacing - (i - prev) * spacing) * clamp(L.w ?? 0) : spacing; }
    at[i] = x; prev = i;
  }
  const mid = at[n - 1] / 2;
  for (let i = 0; i < n; i++) if (inLoop[i] < 0) out[i].copy(origin).addScaledVector(d, at[i] - mid);
  for (const L of loops) {
    const a = Math.max(1, L.from), b = Math.min(n - 1, L.to);
    if (b <= a) continue;
    loopBetween(out[a - 1], out[b], b - a, {toward: up, spacing, out: out.slice(a, b)});
    if (L.lift) for (let i = a; i < b; i++) out[i].addScaledVector(up, L.lift);
  }
  return out;
}

// ---------- Blends between layouts ----------
const weightOf = (w, i) => typeof w === 'number' ? w : typeof w === 'function' ? w(i) : w[i] ?? 0;
// A fold's weights sweeping along a strand: 0 everywhere at amount 0, 1 everywhere at 1, the nucleotides near `from`
// moving first and those at `to` last, each over `width` of the sweep (as the film's hairpins zip from their loop).
export function sweep(n, amount, {from = 0, to = n - 1, width = .45} = {}) {
  const out = new Float32Array(n), span = to - from || 1;
  for (let i = 0; i < n; i++) out[i] = smooth((amount - clamp((i - from) / span) * (1 - width)) / width);
  return out;
}
// Each nucleotide moved straight from one layout towards another by its weight (w: a number, an array, or i → w).
// Exact at every nucleotide; a long move shortens the steps between, so use it for small moves (pairs zipping), and
// blend() for folds.
export function lerp(from, to, w, out) {
  out = outOf(from.length, out);
  for (let i = 0; i < from.length; i++) out[i].lerpVectors(from[i], to[i], weightOf(w, i));
  return out;
}
// Rotation-minimising frames along a polyline: frame i's z runs from point i to point i + 1 (the last keeps the step
// before), its x carried along without twist.
function stepFrames(points) {
  const n = points.length, q = [], len = new Float32Array(Math.max(0, n - 1)), dir = V(0, 0, 1), prev = V();
  for (let i = 0; i < n; i++) {
    if (i < n - 1) { const d = _a.subVectors(points[i + 1], points[i]), l = d.length(); len[i] = l; if (l > 1e-9) dir.copy(d).divideScalar(l); }
    const f = new THREE.Quaternion();
    if (i === 0) f.setFromUnitVectors(Z, dir); else f.copy(q[i - 1]).premultiply(_q.setFromUnitVectors(prev, dir));
    q.push(f); prev.copy(dir);
  }
  return {q, len};
}
// A strand folding from one layout into another, its steps keeping their length (the mean of the two layouts' where
// they differ): the bend from each step to the next blends (by the weight of its two nucleotides), and the strand is
// rebuilt outward from `anchor`, which moves straight between its two places. So a line curls into a ring as a rod
// would, rather than its middle cutting across. w: a number, an array (e.g. from sweep) or i → w; at w = 0 the first
// layout, at 1 the second, exactly. `hold` (optional): a second nucleotide kept on its straight path too, the strand
// between it and the anchor stretched or shrunk evenly to meet it (both ends held, say).
export function blend(from, to, w, {anchor = Math.floor((from.length - 1) / 2), hold = null, out} = {}) {
  const n = from.length; out = outOf(n, out);
  let all0 = true, all1 = true;
  for (let i = 0; i < n; i++) { const x = weightOf(w, i); if (x > 1e-6) all0 = false; if (x < 1 - 1e-6) all1 = false; }
  if (all0 || all1) { const src = all0 ? from : to; for (let i = 0; i < n; i++) out[i].copy(src[i]); return out; }
  const A = stepFrames(from), B = stepFrames(to);
  // B's frames turned about their own steps to face A's at the anchor, so the blend adds no twist of its own.
  const xA = V(1, 0, 0).applyQuaternion(A.q[anchor]).applyQuaternion(_q.copy(B.q[anchor]).invert());
  const turn = new THREE.Quaternion().setFromAxisAngle(Z, Math.atan2(xA.y, xA.x));
  for (const q of B.q) q.multiply(turn);
  const rel = (F, i) => F.q[i].clone().invert().multiply(F.q[i + 1]);
  const R = new THREE.Quaternion(), q = new THREE.Quaternion(), qa = new THREE.Quaternion(), zz = V(), ws = i => (weightOf(w, i) + weightOf(w, i + 1)) / 2;
  const wa = weightOf(w, anchor);
  out[anchor].lerpVectors(from[anchor], to[anchor], wa); qa.slerpQuaternions(A.q[anchor], B.q[anchor], wa);
  q.copy(qa);
  for (let i = anchor; i < n - 1; i++) {
    const s = ws(i);
    out[i + 1].copy(out[i]).addScaledVector(zz.copy(Z).applyQuaternion(q), A.len[i] + (B.len[i] - A.len[i]) * s);
    q.multiply(R.slerpQuaternions(rel(A, i), rel(B, i), s));
  }
  q.copy(qa);
  for (let i = anchor; i > 0; i--) {
    const s = ws(i - 1);
    q.multiply(R.slerpQuaternions(rel(A, i - 1), rel(B, i - 1), s).invert());
    out[i - 1].copy(out[i]).addScaledVector(zz.copy(Z).applyQuaternion(q), -(A.len[i - 1] + (B.len[i - 1] - A.len[i - 1]) * s));
  }
  if (hold !== null && hold !== anchor) {
    const e = _a.lerpVectors(from[hold], to[hold], weightOf(w, hold)).sub(out[hold]).clone(), d = hold - anchor;
    for (let i = 0; i < n; i++) { const k = (i - anchor) / d; if (k > 0) out[i].addScaledVector(e, Math.min(1, k)); }
  }
  return out;
}

// ---------- RNA–RNA pairing ----------
// Antiparallel pairs: strand A's nucleotides a0, a0 + 1, … with strand B's b0, b0 − 1, … (m pairs).
export const antiparallel = (a0, b0, m) => Array.from({length: m}, (_, k) => [a0 + k, b0 - k]);
// Two strands paired over a stretch (pairs [[i, j], …]: strand A's nucleotide i with strand B's j, in order along A,
// e.g. from antiparallel()), laid as an ideal A-form duplex: pair k at A-form pair k, A's nucleotide on strand a
// (running 5′→3′ up the axis), B's on strand b. The two strands can be one strand (a hairpin's stem). `place`: a
// placement (origin on the axis at pair 0, direction the axis, reference towards pair 0's centre), or fit() it to
// where the strands are. Each frame: zip() moves the paired nucleotides to the duplex by each pair's weight (their
// neighbours carried with them), bond() draws each pair's bond part way; draw the strands after.
export function pairing(pairs, place = {}) {
  const m = pairs.length, a = pairs.map(() => V()), b = pairs.map(() => V()), mid = pairs.map(() => V());
  const local = pairs.flatMap((_, k) => [helixPoint(k, 'a', 'backbone', V()), helixPoint(k, 'b', 'backbone', V())]);
  let matrix = new THREE.Matrix4();
  const duplex = {pairs, a, b, mid,
    // Lays the duplex (a placement or a Matrix4); a[k], b[k] are pair k's two backbone points, mid[k] its middle.
    place(p) {
      matrix = placement(p);
      for (let k = 0; k < m; k++) { a[k].copy(local[2 * k]).applyMatrix4(matrix); b[k].copy(local[2 * k + 1]).applyMatrix4(matrix); mid[k].addVectors(a[k], b[k]).multiplyScalar(.5); }
      return duplex;
    },
    // Lays the duplex where it best fits the paired nucleotides' present places (least squares), so zipping moves
    // each strand least.
    fit(aPoints, bPoints) {
      const Q = pairs.flatMap(([i, j]) => [aPoints[i], bPoints[j]]);
      return duplex.place(fitRigid(local, Q));
    },
    get matrix() { return matrix; },
    // The duplex's axis (unit vector) and its middle, in the world.
    axis(out = V()) { return out.setFromMatrixColumn(matrix, 2).normalize(); },
    centre(out = V()) { out.set(0, 0, 0); for (const p of mid) out.add(p); return out.divideScalar(Math.max(1, m)); },
    // Moves each pair's two nucleotides (in aPoints, bPoints: the strands' layouts, changed in place) to the duplex by
    // the pair's weight (w: number, array by pair, or k → w), each strand's nucleotides beyond the stretch moving with
    // its end pair. By default all of them, rigidly, so no step outside the duplex changes length (a duplex is shorter
    // than the single strands it is made from: the two sides of each strand close in on it); `flank` (a number) moves
    // only that many, less with distance, the rest staying put (their steps stretch by up to the end pair's move, so
    // keep such moves small: lay the free strands near the duplex).
    zip(aPoints, bPoints, w, {flank = Infinity} = {}) {
      const da = pairs.map(() => V()), db = pairs.map(() => V());
      pairs.forEach(([i, j], k) => { const x = weightOf(w, k); da[k].subVectors(a[k], aPoints[i]).multiplyScalar(x); db[k].subVectors(b[k], bPoints[j]).multiplyScalar(x); });
      // Each strand's flanks beyond its lowest and highest paired nucleotide move with that pair, less with distance.
      const carry = (points, idx, disp) => {
        const lo = Math.min(...idx), hi = Math.max(...idx), paired = new Set(idx);
        for (let f = 1; f <= Math.min(flank, points.length); f++) {
          const fall = flank === Infinity ? 1 : smooth(1 - f / (flank + 1));
          if (lo - f >= 0 && !paired.has(lo - f)) points[lo - f].addScaledVector(disp[idx.indexOf(lo)], fall);
          if (hi + f < points.length && !paired.has(hi + f)) points[hi + f].addScaledVector(disp[idx.indexOf(hi)], fall);
        }
      };
      carry(aPoints, pairs.map(([i]) => i), da); carry(bPoints, pairs.map(([, j]) => j), db);
      pairs.forEach(([i, j], k) => { aPoints[i].add(da[k]); bPoints[j].add(db[k]); });
      return duplex;
    },
    // Each pair's bond drawn part way (w as for zip; 0 free stubs, 1 the two halves meeting in the middle), on two
    // strands from createStrand (the same strand twice for a hairpin).
    bond(aStrand, bStrand, w) {
      pairs.forEach(([i, j], k) => { const x = weightOf(w, k); aStrand.pair(i, bStrand.points[j], x); bStrand.pair(j, aStrand.points[i], x); });
      return duplex;
    },
  };
  return duplex.place(place);
}

// ---------- A drawn strand ----------
// An RNA strand of n nucleotides drawn as the film draws RNA: an outlined orange tube (STRANDS.rna, radius 1.3 Å)
// smoothed through its nucleotides' backbone points, and each nucleotide's base a short bond (stub, 3.6 Å, radius
// .55) a shade lighter than its stretch, turning about the strand from one nucleotide to the next (the film's 1.15 rad)
// from the `side` it starts on (default: towards a camera on −z). Posed each frame from a point per nucleotide:
// write strand.points (a layout's `out`) or pass them to pose(). Options: colour, radius, stub, stubRadius, samples
// (tube points a nucleotide, made even), sides, glow, twist, side.
//
// - stretches([[from, to, colour], …], base): colours over index ranges [from, to) (others `base`); colour(c) one colour;
//   colours(list or i → colour) one per nucleotide.
//   Where two stretches meet, the tube changes colour midway between their nucleotides. Like pieces(), reveal(),
//   pair() and link(), it applies at the next pose().
// - pieces(list): the strand drawn as separate pieces, each [from, to) or a list of ranges joined end to end in order
//   ([[0, 40], [140, 200]]: two exons ligated, as one continuous strand), or {ranges, opacity} to fade a piece alone.
//   Nucleotides in no piece are not drawn. null: one strand again.
// - reveal(count): only nucleotides [0, count) drawn (count may be fractional: the newest one grows), as made.
// - pair(i, point, w): nucleotide i's base bond reaching for its partner's backbone `point` (a live Vector3, e.g.
//   other.points[j]), meeting it at the middle when w = 1 (pairing().bond() sets these); unpair() clears all.
// - link(i, target, {w, colour, radius, backbone}): an extra covalent bond from nucleotide i to nucleotide `target` of
//   this strand or to a point (a live Vector3), drawn as a short outlined bond, grown from i by w (0 hidden): the 2′–5′
//   bond of a lariat, the 5′–5′ link of a cap. Returns the link; set link.w (and link.colour) each frame;
//   unlink(link). `backbone: true` draws it as the strand's own backbone (its width and nucleotide i's colour): a
//   bond that breaks or forms as the strand is cut or joined, shrinking back after the cut or growing to its partner
//   before the join, so the backbone does not vanish or appear in one frame.
// - letters(sequence, w): stubs coloured by base (BASES) by w.
// - view(pxPerA) keeps the strand visible in wide shots (the film's RNA: at least 2 px wide, outlined; stubs fade below
//   a pixel); opacity(v) fades it, exactly 0 (hidden) or 1 (opaque) at the ends.
// - world(i), tip(i), centre(from, to): world positions for labels and shots; drawn(i); extent(): world points of
//   every drawn nucleotide and stub tip, for tests that check what shows on screen.
export function createStrand(parent, n, {colour = STRANDS.rna, radius = STRANDS.radius.rna, stub = 3.6, stubRadius = .55, samples = 4, sides = 9,
  glow = .035, twist = 1.15, side = V(0, 0, -1)} = {}) {
  const group = new THREE.Group(); parent.add(group);
  const S = 2 * Math.max(1, Math.round(samples / 2)), max = Math.max(2, (n - 1) * S + 2);
  const points = Array.from({length: n}, () => V()), tips = Array.from({length: n}, () => V());
  const colours = Array.from({length: n}, () => new THREE.Color(colour)), hexes = new Array(n).fill(new THREE.Color(colour).getHex());
  const partner = new Array(n).fill(null), paired = new Float32Array(n), letterOf = new Array(n).fill(null);
  let lettersW = 0, pieceList = null, count = n, alpha = 1, stubScale = 1, posed = false;
  // Strands are drawn just after their outlines, before other see-through things, and keep writing depth while they
  // fade: a fading protein then shows over a strand behind it and not over one in front of it, whichever way three.js
  // sorts them.
  const early = tb => { for (const o of [tb.mesh, ...tb.caps]) o.renderOrder = -.5; return tb; };
  const tubes = [], tube = k => tubes[k] ||= early(createTube(group, {color: colour, radius, max, sides, glow, outline: true}));
  const stubs = new THREE.InstancedMesh(bondGeometry, baseMaterial(0xffffff, {roughness: .45}), n);
  stubs.frustumCulled = false; stubs.renderOrder = -.5; group.add(stubs);
  const links = [], linkTubes = [];
  const drawnFlag = new Uint8Array(n), inAnyPiece = new Uint8Array(n), alphaOf = new Float32Array(n).fill(1);
  const paint = (t, c) => { if (t.colour === c) return; t.colour = c; t.material.color.setHex(c); t.material.emissive?.setHex(c); };
  const c0 = new THREE.Color(), cB = new THREE.Color();
  const paintStubs = () => {
    for (let i = 0; i < n; i++) {
      stubColour(colours[i], c0);
      if (lettersW > 0 && letterOf[i] && BASES[letterOf[i]] !== undefined) c0.lerp(cB.setHex(BASES[letterOf[i]]), lettersW);
      stubs.setColorAt(i, c0);
    }
    stubs.instanceColor.needsUpdate = true;
  };
  paintStubs();
  // Every tube's opacity: the strand's times its piece's (tb.share; 0 for a tube not in use).
  const applyAlpha = () => {
    group.visible = alpha > 0; fade(stubs.material, alpha);
    // A tube in use is shown again when the strand fades back in (posed while hidden, it was hidden with it).
    for (const tb of [...tubes, ...linkTubes]) { const v = alpha * (tb.share ?? 0), on = v > 0 && tb.count > 1; fade(tb.material, v); fade(tb.outline.material, v); tb.mesh.visible = on; tb.outline.mesh.visible = on; }
    for (const m of [stubs.material, ...[...tubes, ...linkTubes].flatMap(tb => [tb.material, tb.outline.material])]) if (m.transparent) m.depthWrite = true;
  };
  const t = V(), sd = V(), dir = V(), pA = V(), pB = V(), _t0 = V(), _t1 = V();
  const strand = {group, n, points, tips, stubs, links, tubes, linkTubes,  // (tubes: the pool; tube.share > 0 while in use)
    radius, base: radius, side: side.clone(), twist,
    get count() { return count; },
    pose(pts = points) {
      if (pts !== points) for (let i = 0; i < n; i++) points[i].copy(pts[i]);
      posed = true;
      const last = Math.ceil(count - 1e-9), partial = count < last ? count - (last - 1) : 1;  // nucleotides [0, last); the last one's share
      const list = pieceList || [{ranges: [[0, n]], opacity: 1}];
      drawnFlag.fill(0); inAnyPiece.fill(0);
      for (const piece of list) if (piece.opacity > 0) for (const [from, to] of piece.ranges) for (let i = Math.max(0, from); i < Math.min(to, n, last); i++) inAnyPiece[i] = 1;
      let used = 0;
      for (const piece of list) {
        if (piece.opacity <= 0) continue;
        const order = [];
        for (const [from, to] of piece.ranges) for (let i = Math.max(0, from); i < Math.min(to, n, last); i++) order.push(i);
        const m = order.length; if (!m) continue;
        for (const i of order) { drawnFlag[i] = 1; alphaOf[i] = piece.opacity; }
        // Backbone samples through the piece's nucleotides: S a nucleotide, exactly on each (Catmull–Rom, centripetal).
        const growing = order[m - 1] === last - 1 && partial < 1, end = ((m - 1) - (growing ? 1 - partial : 0)) * S;
        const curve = m > 1 ? new THREE.CatmullRomCurve3(order.map(i => points[i]), false, 'centripetal') : null;
        // Runs of one colour, each its own tube, meeting midway between two nucleotides of different colours: there
        // the two tubes share one ring (no caps, the curve's tangent, the first tube's last frame), so they join
        // without a seam.
        let k0 = 0, before = null;
        for (let k = 1; k <= m; k++) {
          if (k < m && hexes[order[k]] === hexes[order[k0]]) continue;
          const u0 = k0 ? (k0 - .5) * S : 0, u1 = Math.min(end, k < m ? (k - .5) * S : end), U = (m - 1) * S;
          const tb = tube(used++); paint(tb, hexes[order[k0]]);
          let c = 0;
          if (curve && u1 > u0) {
            for (let u = u0; u < u1 - 1e-6; u += 1) curve.getPoint(u / U, tb.points[c++]);
            curve.getPoint(u1 / U, tb.points[c++]);
          }
          const joinsBefore = !!before && k0 > 0, joinsAfter = k < m && u1 < end;
          tb.radius = strand.radius;
          tb.update(c > 1 ? c : 0, {caps: [!joinsBefore, !joinsAfter],
            tangents: [joinsBefore ? curve.getTangent(u0 / U, _t0) : null, joinsAfter ? curve.getTangent(u1 / U, _t1) : null],
            frame: joinsBefore ? before.endNormal : null});
          tb.share = piece.opacity;
          before = c > 1 ? tb : null; k0 = k;
        }
        // Stubs: free, a stub turning about the strand; paired, towards the middle of the pair. At a piece's end, the
        // strand's own neighbour across the gap counts too while it is still about a step away (just cut, or about to
        // be joined), fading out as they part, so the stub does not turn at once as the strand is cut.
        for (let k = 0; k < m; k++) {
          const i = order[k], p = points[i];
          t.subVectors(points[order[Math.min(m - 1, k + 1)]], points[order[Math.max(0, k - 1)]]);
          if (t.lengthSq() < 1e-10) t.set(1, 0, 0); t.normalize();
          for (const [end, j] of [[k === 0, i - 1], [k === m - 1, i + 1]]) {
            if (!end || m < 2 || j < 0 || j >= Math.min(n, last) || !inAnyPiece[j]) continue;
            const d = points[j].distanceTo(p), w = 1 - smooth((d - 1.15 * SPACING) / (1.4 * SPACING));
            if (w <= 0) continue;
            // pA: the piece's own one-sided direction; pB: across the gap, as if the strand were whole.
            const next = points[order[Math.min(m - 1, k + 1)]], prev = points[order[Math.max(0, k - 1)]];
            if (j < i) { pA.subVectors(next, p); pB.subVectors(next, points[j]); } else { pA.subVectors(p, prev); pB.subVectors(points[j], prev); }
            if (pA.lengthSq() < 1e-10 || pB.lengthSq() < 1e-10) continue;
            t.copy(pA.normalize()).multiplyScalar(1 - w).addScaledVector(pB.normalize(), w);
            if (t.lengthSq() < 1e-10) t.copy(pA); t.normalize();
          }
          sd.copy(strand.side).addScaledVector(t, -strand.side.dot(t));
          if (sd.lengthSq() < 1e-6) sd.copy(Math.abs(t.y) < .9 ? _a.set(0, 1, 0) : _a.set(1, 0, 0)).addScaledVector(t, -sd.dot(t));
          dir.copy(sd.normalize()).applyAxisAngle(t, i * strand.twist);
          const growingHere = growing && k === m - 1, at = growingHere && curve ? curve.getPoint(end / ((m - 1) * S), pA) : p;
          tips[i].copy(at).addScaledVector(dir, stub);
          if (partner[i] && paired[i] > 0) tips[i].lerp(pB.copy(at).add(partner[i]).multiplyScalar(.5), paired[i]);
          halfRung(stubs, i, at, tips[i], stubRadius * stubScale * (piece.opacity < 1 ? piece.opacity : 1), growingHere ? partial : 1);
        }
      }
      for (let k = used; k < tubes.length; k++) { tubes[k].update(0); tubes[k].share = 0; }
      for (let i = 0; i < n; i++) if (!drawnFlag[i]) halfRung(stubs, i, points[i], points[i], 0, 0);
      stubs.instanceMatrix.needsUpdate = true;
      links.forEach((L, k) => {
        const tb = linkTubes[k] ||= early(createTube(group, {color: L.colour, radius: L.radius, max: 2, sides, glow, outline: true}));
        const target = typeof L.target === 'number' ? points[L.target] : L.target;
        const on = drawnFlag[L.from] && (typeof L.target !== 'number' || drawnFlag[L.target]) && L.w > .01;
        paint(tb, L.backbone ? hexes[L.from] : L.colour);
        if (!on) { tb.update(0); tb.share = 0; return; }
        tb.points[0].copy(points[L.from]); tb.points[1].lerpVectors(points[L.from], target, Math.min(1, L.w));
        tb.radius = L.backbone ? strand.radius : minRadius(L.radius, strand.pxPerA ?? 10, .8); tb.update(2); tb.share = alphaOf[L.from];
      });
      for (let k = links.length; k < linkTubes.length; k++) { linkTubes[k].update(0); linkTubes[k].share = 0; }
      applyAlpha();
      return strand;
    },
    stretches(list, base = colour) {
      for (let i = 0; i < n; i++) colours[i].setHex(base);
      for (const [from, to, c] of list || []) for (let i = Math.max(0, Math.round(from)); i < Math.min(n, Math.round(to)); i++) colours[i].setHex(c);
      for (let i = 0; i < n; i++) hexes[i] = colours[i].getHex();
      paintStubs(); return strand;
    },
    colour(c) { return strand.stretches(null, c); },
    // Per-nucleotide colours: an array of hex colours, or i → colour.
    colours(list) {
      for (let i = 0; i < n; i++) { const c = typeof list === 'function' ? list(i) : list[i]; if (c !== undefined && c !== null) colours[i].setHex(c); hexes[i] = colours[i].getHex(); }
      paintStubs(); return strand;
    },
    colourAt(i) { return hexes[i]; },
    pieces(list) {
      pieceList = list && list.map(p => {
        const ranges = Array.isArray(p) ? p : p.ranges, opacity = Array.isArray(p) ? 1 : p.opacity ?? 1;
        return {ranges: (typeof ranges[0] === 'number' ? [ranges] : ranges).map(([a, b]) => [Math.round(a), Math.round(b)]), opacity: snap(opacity)};
      });
      return strand;
    },
    reveal(c) { count = Math.max(0, Math.min(n, c)); return strand; },
    pair(i, point, w = 1) { partner[i] = point; paired[i] = clamp(w); return strand; },
    unpair() { partner.fill(null); paired.fill(0); return strand; },
    link(from, target, {w = 1, colour: c = null, radius: r = null, backbone = false} = {}) {
      const L = {from, target, w, colour: c ?? hexes[from], radius: r ?? strand.base * .62, backbone};
      links.push(L); return L;
    },
    unlink(L) { const k = links.indexOf(L); if (k >= 0) { links.splice(k, 1); } return strand; },
    letters(sequence, w = 1) { for (let i = 0; i < n; i++) letterOf[i] = sequence?.[i]?.toUpperCase() ?? null; lettersW = clamp(w); paintStubs(); return strand; },
    view(pxPerA) {
      strand.pxPerA = pxPerA;
      const r = minRadius(strand.base, pxPerA, 1), scale = bondFade(pxPerA), w = outlineWidth(pxPerA, .35);
      for (const tb of [...tubes, ...linkTubes]) tb.outline.width = w;
      if (Math.abs(r - strand.radius) > .02 || Math.abs(scale - stubScale) > .02) { strand.radius = r; stubScale = scale; if (posed) strand.pose(); }
      return strand;
    },
    opacity(v) { alpha = snap(v); applyAlpha(); return strand; },
    get alpha() { return alpha; },
    drawn(i) { return !!drawnFlag[i]; },
    world(i, out = V()) { group.updateWorldMatrix(true, false); return group.localToWorld(out.copy(points[i])); },
    tip(i, out = V()) { group.updateWorldMatrix(true, false); return group.localToWorld(out.copy(tips[i])); },
    centre(from = 0, to = n, out = V()) {
      out.set(0, 0, 0); let k = 0;
      for (let i = Math.max(0, from); i < Math.min(n, to); i++) { out.add(points[i]); k++; }
      group.updateWorldMatrix(true, false); return group.localToWorld(out.divideScalar(Math.max(1, k)));
    },
    extent() {
      group.updateWorldMatrix(true, false); const out = [];
      if (alpha <= 0) return out;
      for (let i = 0; i < n; i++) if (drawnFlag[i]) out.push(group.localToWorld(points[i].clone()).toArray(), group.localToWorld(tips[i].clone()).toArray());
      return out;
    },
  };
  return strand;
}
// Opacity snapped to exactly 0 or 1 near the ends of a fade, so a finished fade never leaves a part-transparent strand.
const snap = v => { v = clamp(v); return v < .005 ? 0 : v > .995 ? 1 : v; };
