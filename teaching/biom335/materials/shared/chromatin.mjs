// Chromatin for the course's scenes, at the scale of whole genes: DNA drawn as the film draws it (two
// strands and base-pair rungs), one base pair at a time and continuous through everything that holds it.
// Crystal structures supply the DNA where proteins hold it (a nucleosome's 147 bp round its histone octamer,
// a promoter, an enhancer); the free DNA between them (linkers, long runs) is laid as ideal B-DNA along the
// fibre's path and meets each held piece's end base pair in place, direction and twist, so every join lines
// up. Where the DNA is far from what a scene shows, it is drawn as a line along its axis.
import * as THREE from 'three';
import {RISE, TWIST} from './dna.mjs';
import {STRANDS, strandMaterial, outlineMaterial, bondGeometry, minRadius, outlineWidth, bondFade} from './strands.mjs';
import {baseMaterial, fade} from './molecules.mjs';

const V = (...a) => new THREE.Vector3(...a);
const EX = V(1, 0, 0), EY = V(0, 1, 0), EZ = V(0, 0, 1);

// ---------- Frames ----------
// A base pair's frame {o, q}, as dna.mjs's frameFromPairs: o on the helix axis, q turning x towards strand
// b's base and z along the axis (5′→3′ of strand a).
export const zOf = (q, out = V()) => out.copy(EZ).applyQuaternion(q);
export const xOf = (q, out = V()) => out.copy(EX).applyQuaternion(q);

// Frames for every base pair from the first to the last numbered pair of a crystal duplex (`nums`: strand a's
// residue numbers of the paired bases, `frames`: their frameFromPairs), filling pairs the structure leaves
// unpaired from their paired neighbours.
export function fillFrames(nums, frames) {
  const out = [];
  for (let k = 0; k < nums.length; k++) {
    out.push({o: frames[k].origin.clone(), q: frames[k].q.clone(), num: nums[k]});
    const gap = k + 1 < nums.length ? nums[k + 1] - nums[k] : 1;
    for (let g = 1; g < gap; g++) {
      const f = g / gap;
      out.push({o: frames[k].origin.clone().lerp(frames[k + 1].origin, f), q: frames[k].q.clone().slerp(frames[k + 1].q, f), num: nums[k] + g});
    }
  }
  return out;
}

// The frame free DNA leaves a held piece from, or meets it at: its end pair, turned so its axis follows the
// piece's own path there (`dir`, over its last few pairs), which an end pair's frame, often distorted in a
// structure, may not; its twist stays the pair's own.
export function alongPath(o, q, dir) {
  const z = dir.clone().normalize(), x = xOf(q); x.addScaledVector(z, -x.dot(z)).normalize();
  return {o: o.clone(), q: new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().makeBasis(x, z.clone().cross(x), z))};
}

// The same base pair seen from its other strand: half a turn about the pair's dyad (the axis in the pair's
// plane that swaps its two backbones), so that strand b runs 5′→3′ along z. `local`: the ideal pair.
export function dyadTurn(local) {
  const d = local.aBackbone.clone().add(local.bBackbone); d.z = 0; d.normalize();
  return new THREE.Quaternion().setFromAxisAngle(d, Math.PI);
}

// A rigid move as a screw: a turn of `angle` about `axis` through `point`, with a slide along the axis; at(s)
// is the same screw a fraction s of the way (s = 1 is the move itself), for animating it.
export function screw(M) {
  const R = new THREE.Matrix4().extractRotation(M), t = V().setFromMatrixPosition(M), q = new THREE.Quaternion().setFromRotationMatrix(R);
  const angle = 2 * Math.acos(Math.min(1, Math.abs(q.w))), axis = angle > 1e-9 ? V(q.x, q.y, q.z).normalize().multiplyScalar(q.w < 0 ? -1 : 1) : EZ.clone();
  const slide = t.dot(axis), tp = t.clone().addScaledVector(axis, -slide), point = V();
  if (angle > 1e-6) {
    const u = (Math.abs(axis.x) < .9 ? EX : EY).clone().cross(axis).normalize(), w = axis.clone().cross(u);
    const a = tp.dot(u), b = tp.dot(w), c = Math.cos(angle), s = Math.sin(angle), det = (1 - c) * (1 - c) + s * s;
    point.copy(u).multiplyScalar(((1 - c) * a - s * b) / det).addScaledVector(w, (s * a + (1 - c) * b) / det);
  }
  const at = (f, out = new THREE.Matrix4()) => out.makeTranslation(point.x + axis.x * slide * f, point.y + axis.y * slide * f, point.z + axis.z * slide * f)
    .multiply(new THREE.Matrix4().makeRotationAxis(axis, angle * f)).multiply(new THREE.Matrix4().makeTranslation(-point.x, -point.y, -point.z));
  return {axis, angle, point, slide, at};
}

// ---------- The chain ----------
// Every base pair of a fibre in order, pooled so a scene can rebuild it each frame: frame, number, whether a
// protein holds it in its structure (`bound`), whether the chain is broken before it (`cut`), whether it is
// drawn as the far line (`far`), and how far its strands have taken each other's colours (`swap`, 0–1).
export function createChain(max) {
  return {max, n: 0, o: Array.from({length: max}, () => V()), q: Array.from({length: max}, () => new THREE.Quaternion()),
    bp: new Int32Array(max), bound: new Uint8Array(max), cut: new Uint8Array(max), far: new Uint8Array(max), swap: new Float32Array(max)};
}

// Fills the chain with base pairs `from` … `to`. `pieces` (sorted, not overlapping) are held DNA:
// {from, count, frame(i, o, q) writing its pair i's frame, bound, swap, cut: drawn apart from its
// neighbours, which then meet `link` ({first, last} frames) instead; lead: see axisOf}. Everything between the pieces is free
// DNA laid along guide(bp, out) (where the fibre runs) to meet them; far(bp) marks pairs drawn as the line.
// `memory` (a Map kept from one call to the next) lets a scene that changes its chain frame by frame keep the
// DNA's twist continuous: it holds every pair's x axis from the last call (below). A scene clears it when its
// time jumps.
export function assemble(chain, {from, to, pieces, guide, far = () => false, memory = null}) {
  chain.n = 0;
  let prev = null, bp = from, cutNext = false;
  const a = {o: V(), q: new THREE.Quaternion()}, b = {o: V(), q: new THREE.Quaternion()};
  const mark = k => { if (cutNext && chain.n > k) { chain.cut[k] = 1; cutNext = false; } };
  // A piece's first and last pairs as free DNA meets them (along the piece's own path over up to 4 pairs).
  const endOf = (piece, last) => {
    const n = piece.count - 1, i = last ? n : 0, j = last ? Math.max(0, n - 3) : Math.min(n, 3);
    piece.frame(i, a.o, a.q); if (i === j) return {o: a.o.clone(), q: a.q.clone()};
    piece.frame(j, b.o, b.q); return alongPath(a.o, a.q, last ? a.o.clone().sub(b.o) : b.o.clone().sub(a.o));
  };
  let lead = null;  // the lead of the last piece (see axisOf)
  for (const piece of pieces) {
    if (piece.from + piece.count - 1 < from || piece.from > to) continue;
    const start = piece.link ? piece.link.first : endOf(piece, false);
    let k = chain.n; layFree(chain, prev, start, bp, piece.from - 1, guide, far, memory, piece.lead || lead); mark(k);
    k = chain.n;
    for (let i = 0; i < piece.count && chain.n < chain.max; i++) {
      const j = chain.n++;
      piece.frame(i, chain.o[j], chain.q[j]);
      if (memory) remember(memory, piece.from + i, chain.q[j]);
      chain.bp[j] = piece.from + i; chain.bound[j] = piece.bound ? 1 : 0; chain.cut[j] = 0; chain.swap[j] = piece.swap || 0; chain.far[j] = far(piece.from + i) ? 1 : 0;
    }
    if (piece.cut) chain.cut[k] = 1; else mark(k);
    cutNext = !!piece.cut;
    prev = piece.link ? {o: piece.link.last.o.clone(), q: piece.link.last.q.clone()} : endOf(piece, true);
    bp = piece.from + piece.count; lead = piece.lead || null;
  }
  const k = chain.n; layFree(chain, prev, null, bp, to, guide, far, memory, lead); mark(k);
  return chain;
}

// ---------- Free DNA ----------
function hermitePoint(a, ta, b, tb, u, out) {
  const u2 = u * u, u3 = u2 * u;
  return out.set(0, 0, 0).addScaledVector(a, 2 * u3 - 3 * u2 + 1).addScaledVector(ta, u3 - 2 * u2 + u).addScaledVector(b, -2 * u3 + 3 * u2).addScaledVector(tb, u3 - u2);
}
// n points spaced equally along a polyline.
function resample(pts, n) {
  const cum = [0]; for (let i = 1; i < pts.length; i++) cum.push(cum[i - 1] + pts[i].distanceTo(pts[i - 1]));
  const L = cum[cum.length - 1], out = [];
  for (let i = 0, k = 0; i < n; i++) {
    const l = n === 1 ? L / 2 : L * i / (n - 1);
    while (k < cum.length - 2 && cum[k + 1] < l) k++;
    out.push(pts[k].clone().lerp(pts[k + 1] || pts[k], (l - cum[k]) / ((cum[k + 1] - cum[k]) || 1)));
  }
  return out;
}

// The axis of n free pairs b0 … b0 + n − 1 from frame P (or a free start) to frame Q (or a free end). A short
// run between two held pieces (a linker) is a cubic curve leaving P along its axis and meeting Q along its
// axis, sized so that it holds its pairs at the ideal rise (`rough`: not sized, for DNA drawn far away); a
// longer run follows the fibre's guide, bent near each end (over up to 24 pairs) to leave P and meet Q in
// place and direction. `lead` ({at(bp, out), w}, from a piece either side) draws the run a fraction w of the way
// to following a path of its own, as a longer run follows the guide.
const tA = V(), tB = V(), hp = V(), hq = V(), hl = V();
function axisOf(P, Q, n, b0, guide, rough, memory, lead) {
  const zP = P && zOf(P.q), zQ = Q && zOf(Q.q);
  const A = P ? P.o.clone().addScaledVector(zP, RISE) : null, B = Q ? Q.o.clone().addScaledVector(zQ, -RISE) : null;
  const w = lead && !rough ? Math.min(1, Math.max(0, lead.w)) : 0;
  if (P && Q && (n <= 120 || rough)) {
    if (n === 1) return [A.clone().lerp(B, .5)];
    const pts = linker();
    if (w <= 0) return pts;
    const along = guided(lead.at);
    return pts.map((p, i) => p.lerp(along[i], w));
  }
  return guided(w > 0 ? (bp, out) => guide(bp, out).lerp(lead.at(bp, hl), w) : guide);

  function linker() {
    // A cubic curve leaving P along its axis and meeting Q along its axis (tangents as long as the gap), and, where
    // the pairs need more room, a smooth bulge to one side (sin² along it, so the ends keep their direction).
    const want = (n - 1) * RISE, chord = B.clone().sub(A), d = chord.length() || 1, m = 2 * n + 8;
    const c = chord.clone().divideScalar(d), bulge = zP.clone().sub(zQ); bulge.addScaledVector(c, -bulge.dot(c));
    if (bulge.lengthSq() < 1e-4) { bulge.copy(zP).add(zQ); bulge.addScaledVector(c, -bulge.dot(c)); }
    if (bulge.lengthSq() < 1e-4) bulge.copy(Math.abs(c.y) < .9 ? EY : EX).addScaledVector(c, -(Math.abs(c.y) < .9 ? c.y : c.x));
    bulge.normalize();
    // With `memory` the bulge keeps to the side it was on, turning at most 3° a call towards the one the ends
    // suggest (which can swap sides at once when they point alike).
    if (memory) {
      const key = 'bulge' + b0, last = memory.get(key);
      if (last) {
        hp.copy(last).addScaledVector(c, -last.dot(c));
        if (hp.lengthSq() > 1e-4) {
          hp.normalize();
          const angle = hp.angleTo(bulge);
          if (angle > BEND) { hq.crossVectors(hp, bulge); if (hq.lengthSq() < 1e-8) hq.copy(c); bulge.copy(hp).applyAxisAngle(hq.normalize(), BEND); }
        }
      }
      if (last) last.copy(bulge); else memory.set(key, bulge.clone());
    }
    tA.copy(zP).multiplyScalar(d); tB.copy(zQ).multiplyScalar(d);
    const at = (u, h, out) => hermitePoint(A, tA, B, tB, u, out).addScaledVector(bulge, h * Math.sin(Math.PI * u) ** 2);
    const length = h => { hq.copy(A); let L = 0; for (let i = 1; i <= m; i++) { at(i / m, h, hp); L += hp.distanceTo(hq); hq.copy(hp); } return L; };
    let h = 0;
    if (!rough && length(0) < want) {
      let lo = 0, hi = want;
      for (let it = 0; it < 16; it++) { const x = (lo + hi) / 2; if (length(x) < want) lo = x; else hi = x; }
      h = (lo + hi) / 2;
    }
    const pts = []; for (let i = 0; i <= m; i++) pts.push(at(i / m, h, V()));
    return resample(pts, n);
  }

  function guided(guide) {
    const g = []; for (let i = 0; i < n; i++) g.push(guide(b0 + i, V()));
    if (n < 2) return [A || B || g[0]];
    // A loose end (held on one side only): the DNA runs on from the piece along its axis, turning gently (at
    // most 2.5° a pair) towards the way the fibre runs there, as a free end would.
    if (!rough && !(A && B) && (A || B) && n < 160) {
      const out = [], d = (A ? zP.clone() : zQ.clone().negate()), p = (A || B).clone();
      const way = (A ? g[n - 1].clone().sub(g[0]) : g[0].clone().sub(g[n - 1])).normalize(), q = new THREE.Quaternion();
      out.push(p.clone());
      for (let i = 1; i < n; i++) {
        const angle = d.angleTo(way), step = Math.min(angle, 2.5 * Math.PI / 180);
        if (angle > 1e-6) { const axis = d.clone().cross(way); if (axis.lengthSq() > 1e-12) d.applyQuaternion(q.setFromAxisAngle(axis.normalize(), step)); }
        out.push(p.addScaledVector(d, RISE).clone());
      }
      return A ? out : out.reverse();
    }
    const c = V(), h00 = s => 2 * s * s * s - 3 * s * s + 1, h10 = s => s * s * s - 2 * s * s + s;
    // The bend is spread over enough pairs for the turn and the offset it must make (about 1.2° and 1.2 Å a pair),
    // however long the run (so a run that a new piece splits keeps its shape), the two ends' bends adding where they
    // overlap on a short run.
    const most = n - 1;
    const span = (offset, from, to) => Math.max(1, Math.min(most, Math.max(24, Math.ceil(from.angleTo(to) * 180 / Math.PI / 1.2 + offset / 1.2))));
    let nA = 0, nB = 0;
    if (A) {
      const step = g[1].clone().sub(g[0]), d0 = A.clone().sub(g[0]), nb = nA = span(d0.length(), zP, step);
      const t0 = zP.clone().multiplyScalar(RISE).sub(step).multiplyScalar(nb);
      for (let i = 0; i <= nb && i < n; i++) { const s = i / nb; g[i].add(c.copy(d0).multiplyScalar(h00(s)).addScaledVector(t0, h10(s))); }
    }
    if (B) {
      const step = g[n - 1].clone().sub(g[n - 2]), d1 = B.clone().sub(g[n - 1]), nb = nB = span(d1.length(), zQ, step);
      const t1 = step.clone().sub(zQ.clone().multiplyScalar(RISE)).multiplyScalar(nb);
      for (let i = 0; i <= nb && i < n; i++) { const s = i / nb; g[n - 1 - i].add(c.copy(d1).multiplyScalar(h00(s)).addScaledVector(t1, h10(s))); }
    }
    const out = resample(g, n); out.ends = [nA, nB];
    return out;
  }
}

// ---------- Nucleosome fibres ----------
// How successive nucleosomes sit along a fibre, from one nucleosome's own DNA ({entry, exit: axis points;
// tIn, tOut: the DNA's direction there}, in a frame centred on the histone octamer), with linkers of `linker`
// bp. Open: each linker is an arc turning the DNA back as far as the nucleosome turned it, so the octamers
// sit in a line along the fibre (the beads-on-a-string of open chromatin). Closed: straight linkers, each
// nucleosome turned by `beta` about the linker from the last, a compact two-start fibre. Every repeat is the
// same screw; returns its rise along the fibre (Å per nucleosome) and pose(k, out): nucleosome k's pose in the
// fibre's frame at its own place along it (x along the fibre), for the scene to set on the fibre's path.
export function nucleosomePattern({entry, exit, tIn, tOut}, {linker = 53, closed = false, beta = 0} = {}) {
  const L = linker * RISE, turnAxis = tIn.clone().cross(tOut).normalize(), turnBy = tIn.angleTo(tOut);
  // Nucleosome k+1's pose from k's (both as matrices taking the nucleosome's frame to the world).
  const next = F => {
    const R = new THREE.Matrix4().extractRotation(F), exitW = exit.clone().applyMatrix4(F), out = tOut.clone().applyMatrix4(R).normalize();
    let end, dir;
    if (closed) { end = exitW.clone().addScaledVector(out, L + RISE); dir = out; }
    else {
      // The arc runs from the linker's first pair to its last (linker − 1 steps).
      const axis = turnAxis.clone().applyMatrix4(R).normalize(), r = (L - RISE) / turnBy, side = axis.clone().cross(out).multiplyScalar(-1);
      const start = exitW.clone().addScaledVector(out, RISE), centre = start.clone().addScaledVector(side, r);
      const q = new THREE.Quaternion().setFromAxisAngle(axis, -turnBy);
      end = start.clone().sub(centre).applyQuaternion(q).add(centre); dir = out.clone().applyQuaternion(q);
      end.addScaledVector(dir, RISE);
    }
    // Its entry continues the linker; turned by beta about that direction.
    const inW = tIn.clone().applyMatrix4(R).normalize();
    const Rn = new THREE.Matrix4().makeRotationFromQuaternion(new THREE.Quaternion().setFromAxisAngle(dir, beta).multiply(new THREE.Quaternion().setFromUnitVectors(inW, dir))).multiply(R);
    const pos = end.clone().sub(entry.clone().applyMatrix4(Rn));
    return Rn.setPosition(pos);
  };
  const F0 = new THREE.Matrix4(), F1 = next(F0);
  // The screw F0 → F1: its axis, turn and rise.
  const M = F1.clone().multiply(F0.clone().invert()), Rm = new THREE.Matrix4().extractRotation(M), t = V().setFromMatrixPosition(M);
  const q = new THREE.Quaternion().setFromRotationMatrix(Rm), angle = 2 * Math.acos(Math.min(1, Math.abs(q.w)));
  // A turn of `angle` about axis0; the fibre's axis points along the rise, so the turn about it may be negative.
  const axis0 = angle > 1e-6 ? V(q.x, q.y, q.z).normalize().multiplyScalar(q.w < 0 ? -1 : 1) : t.clone().normalize();
  const flip = t.dot(axis0) < 0, axis = flip ? axis0.clone().negate() : axis0, turn = angle > 1e-6 ? (flip ? -angle : angle) : 0;
  const rise = t.dot(axis);
  // A point on the screw axis: (I − R) p = t − rise·axis, solved in the plane square to the axis.
  const tp = t.clone().addScaledVector(axis, -rise), p = V();
  if (angle > 1e-6) {
    const u = (Math.abs(axis.x) < .9 ? EX : EY).clone().cross(axis).normalize(), w = axis.clone().cross(u);
    const a = tp.dot(u), b = tp.dot(w), c = Math.cos(turn), s = Math.sin(turn);
    // (I − R) restricted to the plane is [[1 − c, s], [−s, 1 − c]]; solve for the point's (u, w) coordinates.
    const det = (1 - c) * (1 - c) + s * s, pu = ((1 - c) * a - s * b) / det, pw = (s * a + (1 - c) * b) / det;
    p.copy(u).multiplyScalar(pu).addScaledVector(w, pw);
  }
  // The fibre's frame at nucleosome 0: origin on the axis level with it, x along the axis.
  const ref = (Math.abs(axis.y) < .9 ? EY : EX).clone(), y = ref.addScaledVector(axis, -ref.dot(axis)).normalize(), z = axis.clone().cross(y);
  const fibre0 = new THREE.Matrix4().makeBasis(axis, y, z).setPosition(p.clone().addScaledVector(axis, -p.dot(axis)));
  const rel0 = fibre0.clone().invert().multiply(F0);
  return {rise, turn, rel0, pose(k, out = new THREE.Matrix4()) { return out.makeRotationX(k * turn).multiply(rel0); }};
}

// How a compact fibre (`closed`, a nucleosomePattern) opens into one `rise` Å a nucleosome, each nucleosome keeping
// the closed fibre's turn about the fibre. Over `stages` steps of the rise, the nucleosome's pose in the fibre's
// frame is the one whose linker is a natural arc (its chord what an arc of its length with its end angles would
// span, the angles alike at both ends) with neighbours clear of each other, drawn gently towards the fibre's axis;
// each stage starts from the last and is held near it, so the poses change smoothly all the way. The octamer stays level with its
// place on the fibre and on the side of the axis it starts on (moving it along the fibre or turning every
// nucleosome about it would leave the linkers as they are). Returns rise(s) and pose(k, s, out) (as
// nucleosomePattern's pose) for s from 0 (closed) to 1 (open).
export function nucleosomeOpening({entry, exit, tIn, tOut}, closed, {rise: open = 120.6, linker = 53, stages = 20} = {}) {
  const L = (linker + 1) * RISE, turn = closed.turn, q0 = new THREE.Quaternion().setFromRotationMatrix(closed.rel0);
  const riseAt = s => closed.rise + (open - closed.rise) * s;
  // A pose from its distance off the axis (x[0]) and a turn (x[1..3], a rotation vector) from the closed pose.
  const p0 = V().setFromMatrixPosition(closed.rel0), side = Math.atan2(p0.z, p0.y);
  const rel = x => { const r = V(x[1], x[2], x[3]), a = r.length(), q = a > 1e-9 ? new THREE.Quaternion().setFromAxisAngle(r.divideScalar(a), a) : new THREE.Quaternion();
    return new THREE.Matrix4().compose(V(0, x[0] * Math.cos(side), x[0] * Math.sin(side)), q.multiply(q0), V(1, 1, 1)); };
  const sinc = a => a < 1e-6 ? 1 : Math.sin(a) / a, R0 = new THREE.Matrix4(), R1 = new THREE.Matrix4(), F1 = new THREE.Matrix4();
  const cost = (x, s, last) => {
    const F0 = rel(x); F1.makeTranslation(riseAt(s), 0, 0).multiply(new THREE.Matrix4().makeRotationX(turn)).multiply(F0);
    R0.extractRotation(F0); R1.extractRotation(F1);
    const c = entry.clone().applyMatrix4(F1).sub(exit.clone().applyMatrix4(F0));
    const a1 = tOut.clone().applyMatrix4(R0).angleTo(c), a2 = tIn.clone().applyMatrix4(R1).angleTo(c), len = c.length();
    const o0 = V().setFromMatrixPosition(F0), o1 = V().setFromMatrixPosition(F1), o2 = o1.clone().applyMatrix4(new THREE.Matrix4().makeTranslation(riseAt(s), 0, 0).multiply(new THREE.Matrix4().makeRotationX(turn)));
    const near = Math.min(o0.distanceTo(o1), o0.distanceTo(o2)), radius = Math.abs(x[0]);
    return 30 * ((len - L * sinc((a1 + a2) / 2)) / L) ** 2 + 4 * (a1 - a2) ** 2 + 300 * Math.max(0, len / L - .97) ** 2
      + 2 * Math.max(0, (100 - near) / 100) ** 2 + 6 * s * s * (radius / 140) ** 2 + .15 * (a1 * a1 + a2 * a2)
      + 8 * ((x[1] - last[1]) ** 2 + (x[2] - last[2]) ** 2 + (x[3] - last[3]) ** 2) + 2 * ((x[0] - last[0]) / 40) ** 2;
  };
  // Nelder–Mead from the last stage's pose.
  const minimise = (f, x0, iterations = 500) => {
    const n = x0.length, step = [6, .08, .08, .08];
    let pts = [x0.slice(), ...step.map((d, i) => { const x = x0.slice(); x[i] += d; return x; })], vals = pts.map(f);
    for (let it = 0; it < iterations; it++) {
      const order = vals.map((v, i) => i).sort((a, b) => vals[a] - vals[b]); pts = order.map(i => pts[i]); vals = order.map(i => vals[i]);
      const c = Array(n).fill(0); for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) c[j] += pts[i][j] / n;
      const along = t => c.map((cj, j) => cj + t * (pts[n][j] - cj)), xr = along(-1), fr = f(xr);
      if (fr < vals[0]) { const xe = along(-2), fe = f(xe); [pts[n], vals[n]] = fe < fr ? [xe, fe] : [xr, fr]; }
      else if (fr < vals[n - 1]) { pts[n] = xr; vals[n] = fr; }
      else {
        const xc = along(.5), fc = f(xc);
        if (fc < vals[n]) { pts[n] = xc; vals[n] = fc; }
        else for (let i = 1; i <= n; i++) { pts[i] = pts[i].map((v, j) => pts[0][j] + .5 * (v - pts[0][j])); vals[i] = f(pts[i]); }
      }
    }
    return pts[vals.indexOf(Math.min(...vals))];
  };
  let x = [Math.hypot(p0.y, p0.z), 0, 0, 0];
  const at = [rel(x)];
  for (let i = 1; i <= stages; i++) { const s = i / stages, last = x; x = minimise(y => cost(y, s, last), x); at.push(rel(x)); }
  const P = at.map(M => V().setFromMatrixPosition(M)), Q = at.map(M => new THREE.Quaternion().setFromRotationMatrix(M));
  const q = new THREE.Quaternion(), p = V(), one = V(1, 1, 1);
  return {turn, rise: riseAt, pose(k, s, out = new THREE.Matrix4()) {
    const u = Math.min(1, Math.max(0, s)) * stages, i = Math.min(stages - 1, Math.floor(u)), f = u - i;
    return out.makeRotationX(k * turn).multiply(new THREE.Matrix4().compose(p.lerpVectors(P[i], P[i + 1], f), q.slerpQuaternions(Q[i], Q[i + 1], f), one));
  }};
}

// Evens out the bending of free pairs lo … hi (the rest stay put), as a rod relaxes: each pair moves towards
// the smoothest position between its neighbours, then every step is set back to the ideal rise. P and Q fix
// the ends in place and direction (their pairs and one ideal step beyond each); without them an end is free.
function relax(pts, P, Q, lo, hi, iterations = 36) {
  const n = pts.length; if (hi < lo) return;
  const before = P ? [P.o.clone().addScaledVector(zOf(P.q), -RISE), P.o.clone()] : null;
  const after = Q ? [Q.o.clone(), Q.o.clone().addScaledVector(zOf(Q.q), RISE)] : null;
  const at = i => i >= 0 && i < n ? pts[i] : i < 0 ? (before ? before[2 + i] : null) : (after ? after[i - n] : null);
  const fixed = i => i < lo || i > hi;
  const target = V(), d = V();
  for (let it = 0; it < iterations; it++) {
    for (let i = lo; i <= hi; i++) {
      const a = at(i - 2), b = at(i - 1), c = at(i + 1), e = at(i + 2);
      if (b && c && a && e) target.copy(b).add(c).multiplyScalar(4).sub(a).sub(e).divideScalar(6);
      else if (b && c) target.copy(b).add(c).multiplyScalar(.5);
      else continue;
      pts[i].lerp(target, .5);
    }
    for (let pass = 0; pass < 2; pass++) for (let i = lo - 1; i <= hi; i++) {
      const a = at(i), b = at(i + 1); if (!a || !b) continue;
      d.subVectors(b, a); const len = d.length() || 1, err = (len - RISE) / len;
      const fa = fixed(i), fb = fixed(i + 1);
      if (fa && fb) continue;
      if (fa) b.addScaledVector(d, -err); else if (fb) a.addScaledVector(d, err);
      else { a.addScaledVector(d, err / 2); b.addScaledVector(d, -err / 2); }
    }
  }
}

// Lays free pairs b0 … b1 into the chain: their axis from axisOf, each frame carried on from the one before
// (turned with the axis) and twisted by 10.5 bp per turn, plus an equal share of whatever twist brings the
// last one round to meet Q exactly.
const lx = V(), lzPrev = V(), lturn = new THREE.Quaternion(), lm = new THREE.Matrix4(), ly = V();
function layFree(chain, P, Q, b0, b1, guide, far, memory, lead) {
  const n = Math.min(b1 - b0 + 1, chain.max - chain.n); if (n <= 0) return;
  const rough = far(b0) && far(b0 + n - 1);
  const pts = axisOf(P, Q, n, b0, guide, rough, memory, lead);
  // A linker is relaxed as a whole, a long run near the ends it bends to meet (its middle staying on the
  // guide). The pairs next to a held piece stay one ideal step along its axis, so every join lines up.
  if (!rough && n > 2) {
    if (P && Q && n <= 120) relax(pts, P, Q, 1, n - 2, 30);
    else if (pts.ends) {
      const [wa, wb] = pts.ends.map(w => Math.min(n - 3, w + 4));
      if (P && wa > 1) relax(pts, P, null, 1, wa, 48);
      if (Q && wb > 1) relax(pts, null, Q, n - 1 - wb, n - 2, 48);
    }
  }
  const zQ = Q && zOf(Q.q), xQ = Q && xOf(Q.q);
  const z = pts.map((p, i) => {
    const a = i > 0 ? pts[i - 1] : P ? P.o : null, b = i < n - 1 ? pts[i + 1] : Q ? Q.o : null;
    return (a && b ? b.clone().sub(a) : a ? p.clone().sub(a) : b ? b.clone().sub(p) : EZ.clone()).normalize();
  });
  const xs = Array.from({length: n + 1}, () => V());
  // A run with no piece before it starts turned as its first pair was last time (with `memory`), or square to
  // a fixed direction.
  const start = !P && memory && memory.get(b0), x0 = start && start.clone().addScaledVector(z[0], -start.dot(z[0]));
  const run = (extra, more = null) => {
    if (P) { xOf(P.q, lx); zOf(P.q, lzPrev); }
    else { if (x0 && x0.lengthSq() > 1e-6) lx.copy(x0).normalize(); else lx.copy(Math.abs(z[0].y) < .9 ? EY : EX).cross(z[0]).normalize(); lzPrev.copy(z[0]); }
    for (let i = 0; i <= n; i++) {
      const zi = i < n ? z[i] : zQ;
      if (!zi) break;
      lx.applyQuaternion(lturn.setFromUnitVectors(lzPrev, zi)).applyAxisAngle(zi, TWIST + extra + (more ? more[i] : 0));
      lx.addScaledVector(zi, -lx.dot(zi)).normalize(); lzPrev.copy(zi); xs[i].copy(lx);
    }
  };
  let extra = 0; run(0);
  // The twist that brings the chain round to Q (a few passes: turning with the axis and twisting interact).
  // Which way round is a choice of whole turns: the least twist, or, with `memory`, the choice that leaves the
  // run's pairs nearest where they were turned last time (held then or free), so the DNA never flips half a
  // turn from one frame to the next as the run's ends turn, or as it grows, merges or takes over a piece's DNA;
  // up to 1.5 turns beyond the least, or 6° a pair on a long run.
  if (Q) for (let pass = 0; pass < 3; pass++) {
    const got = xs[n], miss = Math.atan2(got.clone().cross(xQ).dot(zQ), got.dot(xQ));
    if (pass === 0 && memory) {
      const every = Math.max(1, Math.floor(n / 12)), limit = Math.max(1.5 * Math.PI, (n + 1) * .1);
      let best = null;
      for (const turns of [0, -1, 1, -2, 2, -3, 3, -4, 4]) {
        const total = miss + turns * 2 * Math.PI; if (turns && Math.abs(total) > limit) continue;
        run(total / (n + 1));
        let off = 0;
        for (let i = 0; i < n; i += every) { const was = memory.get(b0 + i); if (was) { lx.copy(was).addScaledVector(z[i], -was.dot(z[i])); off += lx.angleTo(xs[i]); } }
        if (!best || off < best.off - 1e-6) best = {total, off};
      }
      extra = best.total / (n + 1); run(extra);
      continue;
    }
    if (Math.abs(miss) < 1e-4) break;
    extra += miss / (n + 1); run(extra);
  }
  // With `memory` the twist also changes only gradually: each pair turns, the short way, at most 6° from where it
  // was last time towards that even twist (faster near the pieces the run meets, so its ends settle at once), and
  // the DNA settles into the even twist over a few calls.
  if (memory && Q) {
    const c = new Float64Array(n); let have = false;
    for (let i = 0; i < n; i++) {
      const was = memory.get(b0 + i); if (!was) continue;
      lx.copy(was).addScaledVector(z[i], -was.dot(z[i])); if (lx.lengthSq() < 1e-6) continue;
      const d = Math.atan2(ly.crossVectors(xs[i], lx).dot(z[i]), xs[i].dot(lx)), step = STEP * Math.max(1, P ? 8 / (i + 1) : 1, 8 / (n - i));
      c[i] = d - Math.max(-step, Math.min(step, d)); if (c[i]) have = true;
    }
    if (have) {
      const more = new Float64Array(n + 1), wrap = a => a - 2 * Math.PI * Math.round(a / (2 * Math.PI));
      let before = 0;
      for (let i = 0; i < n; i++) { more[i] = wrap(c[i] - before); before = c[i]; }
      more[n] = wrap(-before); run(extra, more);
    }
  }
  for (let i = 0; i < n; i++) {
    const k = chain.n++;
    chain.o[k].copy(pts[i]); ly.crossVectors(z[i], xs[i]);
    chain.q[k].setFromRotationMatrix(lm.makeBasis(xs[i], ly, z[i]));
    chain.bp[k] = b0 + i; chain.bound[k] = 0; chain.cut[k] = 0; chain.swap[k] = 0; chain.far[k] = far(b0 + i) ? 1 : 0;
    if (memory) remember(memory, b0 + i, chain.q[k]);
  }
}
const STEP = 6 * Math.PI / 180, BEND = 3 * Math.PI / 180;
// A pair's x axis, kept for the next call.
function remember(memory, bp, q) { const x = memory.get(bp); if (x) xOf(q, x); else memory.set(bp, xOf(q)); }

// ---------- Drawing ----------
// A chain drawn with the film's strands (strands.mjs): a tube through each strand's backbone (smoothed), outlined,
// each base pair one straight bond from backbone to backbone, and the far line. `local` is one base pair's geometry in
// its frame (dna.mjs meanLocal of a straight crystal duplex). Strand a (5′→3′ along the chain) is drawn as the film's
// coding strand (ivory, thinner) and strand b as its template strand (sky blue, thicker); a strand takes the other's
// colour by its pairs' `swap`. The strands are rebuilt only when the chain changes (set); view(pxPerA) keeps them at the
// film's minimum width in wide shots and fades the bonds where they would be under a pixel.
export function createFibre({local, maxNear = 16000, maxFar = 90000, samples = 2, sides = 6, farColor = 0x9fc3d2} = {}) {
  const group = new THREE.Group();
  const ring = sides + 1, maxVtx = (maxNear * samples + 16) * 2 * ring, maxIdx = maxVtx * sides * 6 / ring;
  const colA = new THREE.Color(STRANDS.coding), colB = new THREE.Color(STRANDS.template), radii = [STRANDS.radius.coding, STRANDS.radius.template];
  // Strand tubes: one mesh for both strands, with vertex colours (a strand takes the other's colour by `swap`) and each
  // vertex's own radius, which the shader grows to the view's minimum (strandMaterial's `grow`).
  const position = new Float32Array(maxVtx * 3), normal = new Float32Array(maxVtx * 3), color = new Float32Array(maxVtx * 3), vRadius = new Float32Array(maxVtx);
  const index = new Uint32Array(maxIdx);
  const g = new THREE.BufferGeometry();
  const dyn = (a, n) => new THREE.BufferAttribute(a, n).setUsage(THREE.DynamicDrawUsage);
  g.setAttribute('position', dyn(position, 3)); g.setAttribute('normal', dyn(normal, 3)); g.setAttribute('color', dyn(color, 3)); g.setAttribute('aRadius', dyn(vRadius, 1)); g.setIndex(dyn(index, 1));
  const grow = {uMinRadius: {value: 0}};
  const tubes = new THREE.Mesh(g, strandMaterial(0xffffff, {glow: (STRANDS.glow.template + STRANDS.glow.coding) / 2, vertexColors: true, grow}));
  const outline = new THREE.Mesh(g, outlineMaterial(.3, {grow}));
  tubes.frustumCulled = outline.frustumCulled = false; group.add(outline, tubes);
  // Bonds: two halves per pair, from each backbone to the middle of the line between them.
  const rungs = new THREE.InstancedMesh(bondGeometry, baseMaterial(0xffffff, {roughness: .55}), maxNear * 2);
  rungs.frustumCulled = false; rungs.setColorAt(0, new THREE.Color()); rungs.count = 0; group.add(rungs);
  // The far line: a segment every two pairs.
  const farPos = new Float32Array(maxFar * 3), lg = new THREE.BufferGeometry();
  lg.setAttribute('position', dyn(farPos, 3));
  const line = new THREE.LineSegments(lg, new THREE.LineBasicMaterial({color: farColor, transparent: true, opacity: .85}));
  line.frustumCulled = false; group.add(line);

  const bands = [], rungBase = [STRANDS.rung.coding, STRANDS.rung.template].map(c => new THREE.Color(c)), rc = new THREE.Color(), tc = new THREE.Color();
  const t = V(), nrm = V(), bn = V(), P = V(), Q = V(), M = V(), d = V(), rx = V(), rz = V();
  // Scratch for one strand of a run: its backbone points, their swaps, and the smoothed samples.
  let back = new Float32Array(3 * 4096), swp = new Float32Array(4096), smp = new Float32Array(3 * 4096 * samples + 3), ssw = new Float32Array(4096 * samples + 1);
  const room = n => { if (back.length < 3 * n) { back = new Float32Array(3 * n); swp = new Float32Array(n); smp = new Float32Array(3 * n * samples + 3); ssw = new Float32Array(n * samples + 1); } };
  let vtx = 0, idx = 0;
  // A Catmull–Rom curve through a strand's backbone points (`samples` per pair) with a tube ring at each sample.
  function tube(count, radius, cA, cB) {
    const m = (count - 1) * samples + 1;
    if (count < 2 || vtx + m * ring > maxVtx || idx + (m - 1) * sides * 6 > maxIdx) return;
    let w = 0;
    for (let i = 0; i < count - 1; i++) {
      const i0 = 3 * Math.max(0, i - 1), i1 = 3 * i, i2 = 3 * (i + 1), i3 = 3 * Math.min(count - 1, i + 2);
      for (let s = 0; s < samples; s++, w++) {
        const u = s / samples, u2 = u * u, u3 = u2 * u, c0 = -.5 * u3 + u2 - .5 * u, c1 = 1.5 * u3 - 2.5 * u2 + 1, c2 = -1.5 * u3 + 2 * u2 + .5 * u, c3 = .5 * u3 - .5 * u2;
        for (let k = 0; k < 3; k++) smp[3 * w + k] = c0 * back[i0 + k] + c1 * back[i1 + k] + c2 * back[i2 + k] + c3 * back[i3 + k];
        ssw[w] = swp[i] + (swp[i + 1] - swp[i]) * u;
      }
    }
    for (let k = 0; k < 3; k++) smp[3 * w + k] = back[3 * (count - 1) + k]; ssw[w] = swp[count - 1];
    for (let i = 0; i < m; i++) {
      const a = 3 * Math.min(m - 1, i + 1), b = 3 * Math.max(0, i - 1);
      t.set(smp[a] - smp[b], smp[a + 1] - smp[b + 1], smp[a + 2] - smp[b + 2]).normalize();
      if (i === 0) nrm.copy(Math.abs(t.y) < .9 ? EY : EX).cross(t); else nrm.addScaledVector(t, -nrm.dot(t));
      nrm.normalize(); bn.crossVectors(t, nrm);
      tc.copy(cA).lerp(cB, ssw[i]);
      const x = smp[3 * i], y = smp[3 * i + 1], z = smp[3 * i + 2];
      for (let j = 0; j <= sides; j++) {
        const an = j / sides * Math.PI * 2, k = (vtx + j) * 3, c = Math.cos(an), s = Math.sin(an);
        const vx = nrm.x * c + bn.x * s, vy = nrm.y * c + bn.y * s, vz = nrm.z * c + bn.z * s;
        position[k] = x + radius * vx; position[k + 1] = y + radius * vy; position[k + 2] = z + radius * vz;
        normal[k] = vx; normal[k + 1] = vy; normal[k + 2] = vz;
        color[k] = tc.r; color[k + 1] = tc.g; color[k + 2] = tc.b; vRadius[vtx + j] = radius;
      }
      if (i < m - 1) for (let j = 0; j < sides; j++) {
        const p0 = vtx + j, p1 = p0 + ring;
        index[idx++] = p0; index[idx++] = p0 + 1; index[idx++] = p1;
        index[idx++] = p1; index[idx++] = p0 + 1; index[idx++] = p1 + 1;
      }
      vtx += ring;
    }
  }
  function set(chain) {
    vtx = 0; idx = 0;
    let nR = 0, nF = 0, start = -1;
    const L = local, mat = rungs.instanceMatrix.array, col = rungs.instanceColor.array, rr = STRANDS.rung.radius;
    const strand = (k0, k1, which) => {
      const n = k1 - k0; room(n);
      const loc = which ? L.bBackbone : L.aBackbone;
      for (let i = 0; i < n; i++) { P.copy(loc).applyQuaternion(chain.q[k0 + i]).add(chain.o[k0 + i]); back[3 * i] = P.x; back[3 * i + 1] = P.y; back[3 * i + 2] = P.z; swp[i] = chain.swap[k0 + i]; }
      tube(n, radii[which], which ? colB : colA, which ? colA : colB);
    };
    const flush = k => { if (start >= 0 && k - start > 1) { strand(start, k, 0); strand(start, k, 1); } start = -1; };
    // A half-bond from backbone a to the bond's middle b, written straight into the instance buffers.
    const place = (a, b, c) => {
      if (nR >= maxNear * 2) return;
      d.subVectors(b, a); const len = d.length() || 1; d.divideScalar(len);
      rx.copy(Math.abs(d.y) < .9 ? EY : EX).cross(d).normalize(); rz.crossVectors(d, rx);
      const e = 16 * nR;
      mat[e] = rx.x * rr; mat[e + 1] = rx.y * rr; mat[e + 2] = rx.z * rr; mat[e + 3] = 0;
      mat[e + 4] = d.x * len; mat[e + 5] = d.y * len; mat[e + 6] = d.z * len; mat[e + 7] = 0;
      mat[e + 8] = rz.x * rr; mat[e + 9] = rz.y * rr; mat[e + 10] = rz.z * rr; mat[e + 11] = 0;
      mat[e + 12] = (a.x + b.x) / 2; mat[e + 13] = (a.y + b.y) / 2; mat[e + 14] = (a.z + b.z) / 2; mat[e + 15] = 1;
      col[3 * nR] = c.r; col[3 * nR + 1] = c.g; col[3 * nR + 2] = c.b; nR++;
    };
    for (let k = 0; k < chain.n; k++) {
      if (chain.cut[k]) flush(k);
      if (chain.far[k]) {
        flush(k);
        if (k + 1 < chain.n && !chain.cut[k + 1] && nF + 2 <= maxFar) {
          const k2 = Math.min(chain.n - 1, k + 2);
          chain.o[k].toArray(farPos, nF * 3); chain.o[chain.cut[k2] ? k + 1 : k2].toArray(farPos, nF * 3 + 3); nF += 2; k++;
        }
        continue;
      }
      if (start < 0) start = k;
      const q = chain.q[k], o = chain.o[k];
      P.copy(L.aBackbone).applyQuaternion(q).add(o); Q.copy(L.bBackbone).applyQuaternion(q).add(o); M.addVectors(P, Q).multiplyScalar(.5);
      place(P, M, tint(chain.bp[k], rc.copy(rungBase[0])));
      place(Q, M, tint(chain.bp[k], rc.copy(rungBase[1])));
    }
    flush(chain.n);
    g.setDrawRange(0, idx);
    for (const k of ['position', 'normal', 'color', 'aRadius']) { const a = g.attributes[k]; a.clearUpdateRanges(); a.addUpdateRange(0, vtx * a.itemSize); a.needsUpdate = true; }
    g.index.clearUpdateRanges(); g.index.addUpdateRange(0, idx); g.index.needsUpdate = true;
    rungs.count = nR;
    rungs.instanceMatrix.clearUpdateRanges(); rungs.instanceMatrix.addUpdateRange(0, 16 * nR); rungs.instanceMatrix.needsUpdate = true;
    rungs.instanceColor.clearUpdateRanges(); rungs.instanceColor.addUpdateRange(0, 3 * nR); rungs.instanceColor.needsUpdate = true;
    lg.setDrawRange(0, nF); const fa = lg.attributes.position; fa.clearUpdateRanges(); fa.addUpdateRange(0, nF * 3); fa.needsUpdate = true;
  }
  function tint(bp, c) { for (const b of bands) if (b && b.w > 0 && bp >= b.from && bp <= b.to) c.lerp(b.color, b.w); return c; }
  // Tints the bonds of base pairs from … to (a few stretches, by slot i), e.g. an enhancer or the CCAAT box.
  function band(i, from, to, c, w) { bands[i] = {from, to, color: new THREE.Color(c), w}; }
  // The view's scale (px/Å): strands no thinner than the film's minimum, outlines to match, bonds faded when tiny.
  function view(pxPerA) {
    grow.uMinRadius.value = minRadius(0, pxPerA); outline.material.userData.uniforms.uWidth.value = outlineWidth(pxPerA);
    const f = bondFade(pxPerA); fade(rungs.material, f); rungs.visible = f > .01;
  }
  return {group, tubes, outline, rungs, line, set, band, view};
}
