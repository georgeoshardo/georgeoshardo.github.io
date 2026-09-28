// DNA of a structure, for the course's scenes, drawn with the film's strands (strands.mjs): a thick template-coloured
// strand, a thinner ivory strand, both outlined, and each base pair one straight bond from backbone to backbone. A
// duplex is a list of base pairs, each with its own local geometry (backbone and base centre of both nucleotides,
// relative to the pair's frame), so the same pairs can be laid along any axis: the bent path of a crystal structure,
// an ideal straight B-form helix, or any blend of the two (bending, unwinding). Arms of ideal B-DNA can extend a
// short crystal duplex.
import * as THREE from 'three';
import {STRANDS, createTube, createRungs, halfRung, minRadius, outlineWidth} from './strands.mjs';
import {fadeObject} from './molecules.mjs';

const V = (...a) => new THREE.Vector3(...a);
export const RISE = 3.38, TWIST = 2 * Math.PI / 10.5;

// Base pairs from two exported strands (shared/build_surfaces.py): strand a runs 5′→3′, b pairs with it.
export function pairsFromStrands(a, b) {
  const pairs = [];
  a.partner.forEach((p, i) => {
    if (!p || p[0] !== b.chain) return;
    const j = p[1];
    pairs.push({a: {backbone: V(...a.backbone[i]), base: V(...a.base[i]), letter: a.sequence[i], num: a.numbers[i]},
      b: {backbone: V(...b.backbone[j]), base: V(...b.base[j]), letter: b.sequence[j], num: b.numbers[j]}});
  });
  return pairs;
}

// Each pair's frame from the structure: origin between the two base centres, z along the local helix axis,
// x towards strand b's base. Local coordinates are stored for re-posing. The axis is the base-pair plane's
// normal (square to the line between the bases and to the groove direction, from the backbones' midpoint to
// the bases), averaged over ±`window` pairs: pair centres alone wander off the axis where DNA is kinked, as
// at a TBP-bound TATA box, and would understate the bend.
export function frameFromPairs(pairs, {window = 1} = {}) {
  const origins = pairs.map(p => p.a.base.clone().add(p.b.base).multiplyScalar(.5));
  const normals = pairs.map((p, i) => {
    const across = p.b.base.clone().sub(p.a.base), groove = origins[i].clone().sub(p.a.backbone.clone().add(p.b.backbone).multiplyScalar(.5));
    const n = across.cross(groove).normalize(), along = origins[Math.min(i + 1, pairs.length - 1)].clone().sub(origins[Math.max(i - 1, 0)]);
    return n.dot(along) < 0 ? n.negate() : n;
  });
  const frames = pairs.map((p, i) => {
    const z = V();
    for (let k = Math.max(0, i - window); k <= Math.min(pairs.length - 1, i + window); k++) z.add(normals[k]);
    z.normalize();
    const x = p.b.base.clone().sub(p.a.base); x.addScaledVector(z, -x.dot(z)).normalize();
    const y = z.clone().cross(x);
    const q = new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().makeBasis(x, y, z));
    return {origin: origins[i], q};
  });
  pairs.forEach((p, i) => {
    const inv = frames[i].q.clone().invert(), o = frames[i].origin;
    p.local = {aBackbone: p.a.backbone.clone().sub(o).applyQuaternion(inv), aBase: p.a.base.clone().sub(o).applyQuaternion(inv),
      bBackbone: p.b.backbone.clone().sub(o).applyQuaternion(inv), bBase: p.b.base.clone().sub(o).applyQuaternion(inv)};
  });
  return frames;
}

// Frames of an ideal straight B-DNA through the same first pair: rise 3.38 Å and 10.5 bp per turn.
export function straightFrames(bent, {anchor = 0} = {}) {
  const a = bent[anchor], z = V(0, 0, 1).applyQuaternion(a.q);
  return bent.map((_, i) => {
    const turn = new THREE.Quaternion().setFromAxisAngle(z, (i - anchor) * TWIST);
    return {origin: a.origin.clone().addScaledVector(z, (i - anchor) * RISE), q: turn.multiply(a.q.clone())};
  });
}

// Extends frames with `n` ideal base pairs before and after, continuing each end's axis and twist.
export function extend(frames, before, after) {
  const step = (f, dir) => {
    const z = V(0, 0, 1).applyQuaternion(f.q);
    return {origin: f.origin.clone().addScaledVector(z, dir * RISE), q: new THREE.Quaternion().setFromAxisAngle(z, dir * TWIST).multiply(f.q.clone())};
  };
  const out = frames.slice();
  for (let k = 0; k < before; k++) out.unshift(step(out[0], -1));
  for (let k = 0; k < after; k++) out.push(step(out[out.length - 1], 1));
  return out;
}

// Blends two frame lists (same length) by w (0 → first, 1 → second): positions lerp, rotations slerp.
export function blendFrames(from, to, w, out = []) {
  for (let i = 0; i < from.length; i++) {
    const f = out[i] || (out[i] = {origin: V(), q: new THREE.Quaternion()});
    f.origin.lerpVectors(from[i].origin, to[i].origin, w); f.q.slerpQuaternions(from[i].q, to[i].q, w);
  }
  return out;
}

// Bending and unbending: blends the step from each base pair to the next (rotation slerped, offset lerped in
// the pair's own frame) and rebuilds the duplex outward from `anchor`, which blends directly. Unlike
// blendFrames, arms keep their length through the morph, so a straight duplex bends as a rod would.
export function createMorph(from, to, anchor = Math.floor(from.length / 2)) {
  const step = (a, b) => { const inv = a.q.clone().invert(); return {q: inv.clone().multiply(b.q), t: b.origin.clone().sub(a.origin).applyQuaternion(inv)}; };
  const A = from.slice(1).map((f, i) => step(from[i], f)), B = to.slice(1).map((f, i) => step(to[i], f));
  const q = new THREE.Quaternion(), t = V();
  return (w, out = []) => {
    for (let i = 0; i < from.length; i++) out[i] ||= {origin: V(), q: new THREE.Quaternion()};
    out[anchor].origin.lerpVectors(from[anchor].origin, to[anchor].origin, w); out[anchor].q.slerpQuaternions(from[anchor].q, to[anchor].q, w);
    for (let i = anchor; i < from.length - 1; i++) {
      q.slerpQuaternions(A[i].q, B[i].q, w); t.lerpVectors(A[i].t, B[i].t, w);
      out[i + 1].q.copy(out[i].q).multiply(q); out[i + 1].origin.copy(t).applyQuaternion(out[i].q).add(out[i].origin);
    }
    for (let i = anchor; i > 0; i--) {
      q.slerpQuaternions(A[i - 1].q, B[i - 1].q, w); t.lerpVectors(A[i - 1].t, B[i - 1].t, w);
      out[i - 1].q.copy(out[i].q).multiply(q.invert()); out[i - 1].origin.copy(out[i].origin).sub(t.applyQuaternion(out[i - 1].q));
    }
    return out;
  };
}

// Where the minor groove faces at a pair: from the pair's centre towards the midpoint of its two backbones
// (both sugars lie on the minor-groove edge of a base pair), square to the local axis. In world space for `frame`.
export function minorGroove(pair, frame) {
  const d = pair.local.aBackbone.clone().add(pair.local.bBackbone).multiplyScalar(.5); d.z = 0;
  return d.normalize().applyQuaternion(frame.q);
}

// A drawable duplex. `pairs` carry local geometry; pose(frames) places every pair and rebuilds the strands (smoothed
// through `samples` points a pair) and the bonds. Colours follow the film: `template` colours strand a (sky blue),
// `coding` strand b (ivory); `widths` sets each strand's radius (the template strand is thicker), and `rung` each
// half-bond's colour. view(pxPerA) keeps the strands and outlines visible in wide shots, as the film does.
export function createDuplex({pairs, template = STRANDS.template, coding = STRANDS.coding, rung = [STRANDS.rung.template, STRANDS.rung.coding], samples = 4,
  widths = [STRANDS.radius.template, STRANDS.radius.coding]}) {
  const group = new THREE.Group(), n = pairs.length, max = (n - 1) * samples + 1;
  // The thicker strand glows as the film's template strand does, the thinner as its coding strand.
  const glow = k => widths[k] >= widths[1 - k] ? STRANDS.glow.template : STRANDS.glow.coding;
  const strands = [template, coding].map((color, k) => createTube(group, {color, radius: widths[k], max, glow: glow(k), outline: true}));
  const rungs = createRungs(group, n, rung);
  // How many pairs of each strand are drawn (from pair 0), e.g. a new strand as a replication fork makes it.
  const shown = [n, n];
  const world = {aBackbone: pairs.map(() => new THREE.Vector3()), bBackbone: pairs.map(() => new THREE.Vector3()), aBase: pairs.map(() => new THREE.Vector3()), bBase: pairs.map(() => new THREE.Vector3())};
  const curve = pts => new THREE.CatmullRomCurve3(pts, false, 'centripetal').getSpacedPoints(max - 1), mid = new THREE.Vector3();
  let last = null;
  const duplex = {group, pairs, strands, rungs, world,
    // Places each pair by its frame; `open` (0–1 per pair, optional) draws the bond part way, as the strands part.
    pose(frames, open) {
      last = [frames, open];
      for (let i = 0; i < n; i++) {
        const f = frames[i], L = pairs[i].local;
        world.aBackbone[i].copy(L.aBackbone).applyQuaternion(f.q).add(f.origin);
        world.bBackbone[i].copy(L.bBackbone).applyQuaternion(f.q).add(f.origin);
        world.aBase[i].copy(L.aBase).applyQuaternion(f.q).add(f.origin);
        world.bBase[i].copy(L.bBase).applyQuaternion(f.q).add(f.origin);
        const k = 1 - .6 * (open?.[i] || 0);
        mid.addVectors(world.aBackbone[i], world.bBackbone[i]).multiplyScalar(.5);
        halfRung(rungs[0], i, world.aBackbone[i], mid, STRANDS.rung.radius, i < shown[0] ? k : 0);
        halfRung(rungs[1], i, world.bBackbone[i], mid, STRANDS.rung.radius, i < shown[1] ? k : 0);
      }
      [world.aBackbone, world.bBackbone].forEach((backbone, k) => {
        const pts = curve(backbone), m = shown[k] >= n ? pts.length : Math.max(0, (shown[k] - 1) * samples + 1);
        for (let i = 0; i < m; i++) strands[k].points[i].copy(pts[i]);
        strands[k].update(m);
      });
      rungs.forEach(r => { r.instanceMatrix.needsUpdate = true; });
    },
    // Draws strand k (0 = a, 1 = b) only up to pair `count`; applies at the next pose().
    reveal(k, count) { shown[k] = Math.max(0, Math.min(n, Math.round(count))); },
    // Wide shots: strands at least ~1.6 px wide and outlined, for a view scale in px/Å; re-posed when they change.
    view(pxPerA) {
      let changed = false;
      for (const tb of strands) { const r = minRadius(tb.base, pxPerA); if (Math.abs(r - tb.radius) > .02) { tb.radius = r; changed = true; } tb.outline.width = outlineWidth(pxPerA); }
      if (changed && last) duplex.pose(...last);
    },
    // Tints pairs (e.g. the TATA box) by blending each bond towards a colour by w[i].
    tint(color, w) {
      const c = new THREE.Color(color), base = rung.map(x => new THREE.Color(x)), out = new THREE.Color();
      rungs.forEach((r, k) => { for (let i = 0; i < n; i++) r.setColorAt(i, out.copy(base[k]).lerp(c, w[i] || 0)); r.instanceColor.needsUpdate = true; });
    },
    opacity(value) { fadeObject(group, value); },
  };
  return duplex;
}

// The average local geometry of a run of pairs (a straight stretch of a structure's DNA), to draw a duplex
// of any sequence as ideal B-DNA with sequencePairs() and helixFrames().
export function meanLocal(pairs) {
  const keys = ['aBackbone', 'bBackbone', 'aBase', 'bBase'], out = Object.fromEntries(keys.map(k => [k, V()]));
  for (const p of pairs) for (const k of keys) out[k].add(p.local[k]);
  for (const k of keys) out[k].divideScalar(pairs.length);
  return out;
}
const COMPLEMENT = {A: 'T', T: 'A', G: 'C', C: 'G'};
// Pairs for a sequence (strand a, 5′→3′), each with the same local geometry.
export function sequencePairs(sequence, local) {
  return [...sequence].map(letter => ({a: {letter}, b: {letter: COMPLEMENT[letter] || 'N'}, local}));
}
// An ideal straight B-DNA: n pair frames from `origin` along `direction` (rise 3.38 Å, 10.5 bp per turn),
// the first pair's x axis towards `reference`.
export function helixFrames(n, {origin = V(), direction = V(1, 0, 0), reference = V(0, 1, 0)} = {}) {
  const z = direction.clone().normalize(), x = reference.clone().addScaledVector(z, -reference.dot(z)).normalize(), y = z.clone().cross(x);
  const q0 = new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().makeBasis(x, y, z));
  return Array.from({length: n}, (_, i) => ({origin: origin.clone().addScaledVector(z, i * RISE), q: new THREE.Quaternion().setFromAxisAngle(z, i * TWIST).multiply(q0)}));
}

// Pads a pair list with copies of its end pairs' local geometry, for arms added with extend().
export function padPairs(pairs, before, after) {
  const copy = p => ({a: {...p.a}, b: {...p.b}, local: p.local, extra: true});
  return [...Array.from({length: before}, () => copy(pairs[0])), ...pairs, ...Array.from({length: after}, () => copy(pairs[pairs.length - 1]))];
}
