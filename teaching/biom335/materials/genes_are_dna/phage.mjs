// Phage T2, drawn as its close relative T4 (no whole T2 structure exists), at true size in ångströms. Real structures
// give its parts: the prolate head (7VS5, the whole capsid built from its asymmetric unit, and the portal from 6UZC,
// both in the same frame), the contractile tail (the gp18 sheath, one ring of 3J2M extended and of 3J2N contracted,
// repeated by the tail's helical symmetry, round the gp19 tube of 5IV5, the gp15 hexamer on top), the baseplate and
// its central hub (5IV5, pre-attachment). The neck and the six long tail fibres are drawn. Surfaces are coarse (from Cα
// atoms for the large assemblies), which is all the detail this scale shows.
//
// The model's axis is its local y, the baseplate's lowest point at the origin and the head up (−y, up on screen). A
// phage's state: `contract` (0–1: the sheath contracts ring by ring from the baseplate up, driving the tube and hub
// down through the baseplate and turning the head, as T4's does), `fibres` (0 free, 1 splayed onto the ground below)
// and the head cut open (`cut`) to show its DNA. Its DNA is a path (`dnaPath`: spooled in the head, then down the tail)
// drawn between two lengths along it (`createPath`), so it moves along its own path as it is injected; `labelCoat` and
// `labelDNA` give protein and DNA the glow of their radioactive label.
import * as THREE from 'three';
import {surfaceGeometry, proteinMaterial} from '../shared/molecules.mjs';
import {strandMaterial, outlineMaterial, minRadius, outlineWidth} from '../shared/strands.mjs';
import {fitRigid} from '../shared/fit.mjs';
import {clamp, smooth, mix} from '../shared/ease.mjs';

const V = (...a) => new THREE.Vector3(...a), DEG = Math.PI / 180, Y = V(0, 1, 0);
const rotY = a => new THREE.Matrix4().makeRotationY(a);

// The tail's helical symmetry: 23 rings of six gp18 subunits; extended 40.6 Å and 17.2° a ring, contracted 16.4 Å and
// 32.9° (Leiman PG et al. 2004; Fokine A et al. 2013). The tube's rings (gp19) repeat as 5IV5's two rings do.
export const SHEATH = {rings: 23, extended: {rise: 40.6, twist: 17.2}, contracted: {rise: 16.4, twist: 32.9}};
const TUBE = {rise: 40.2, twist: 17.8};
// Long tail fibres: a proximal and a distal half (Å), bent at the knee; free, and splayed onto a surface.
const FIBRE = {proximal: 720, distal: 740, radius: [17, 14], free: [32, 74], attached: -12};
const NECK = 115;

// Colours: protein and DNA each keep one hue throughout, pale unlabelled; radioactive label (³⁵S in protein, ³²P in
// DNA) makes them vivid and glow.
export const COLOURS = {
  protein: 0x7a74a4, proteinLabel: 0x9a5cff, proteinDark: 0x6a6590,
  dna: 0xd2a797, dnaLabel: 0xff4a2c,
};

// The inside of the head (Å from its axis, at heights along the 7VS5 axis), measured from the capsid's Cα atoms less
// a margin: where its DNA can lie.
const CAVITY = [[-520, 40], [-480, 110], [-440, 180], [-400, 235], [-360, 270], [-320, 300], [-280, 320], [-240, 332],
  [-200, 340], [-100, 348], [0, 350], [100, 348], [200, 340], [240, 330], [280, 312], [320, 288], [360, 252], [400, 205],
  [440, 150], [480, 90], [505, 45]];
const cavity = z => { if (z <= CAVITY[0][0]) return CAVITY[0][1]; for (let i = 1; i < CAVITY.length; i++) if (z <= CAVITY[i][0]) { const [a, ra] = CAVITY[i - 1], [b, rb] = CAVITY[i]; return mix(ra, rb, (z - a) / (b - a)); } return CAVITY.at(-1)[1]; };

// The frames that place each structure on the phage's axis, from the surface set (`set`, loadSurfaceSet).
export function phageModel(set) {
  const record = name => set.byName.get(name), geo = name => record(name) && surfaceGeometry(record(name), set.buffer);
  const point = name => V(...set.meta.points.find(p => p.name === name).position);
  const centre = name => V(...record(name).center);
  const geometry = {head: geo('Head'), headFar: geo('Head, far') || geo('Head'), portal: geo('Portal'),
    baseplate: geo('Baseplate'), baseplateFar: geo('Baseplate, far') || geo('Baseplate'), hub: geo('Hub'),
    tube: geo('Tube subunit'), tubeFar: geo('Tube subunit, far') || geo('Tube subunit'),
    sheath: geo('Sheath subunit'), sheathFar: geo('Sheath subunit, far') || geo('Sheath subunit'), terminator: geo('Tail terminator')};
  for (const g of Object.values(geometry)) g?.computeBoundingBox();

  // 5IV5: the axis through the hub, along z, head-ward +z; its lowest point becomes the origin.
  const hub = centre('Hub'), z0 = geometry.baseplate.boundingBox.min.z;
  const baseplate = new THREE.Matrix4().set(1, 0, 0, -hub.x, 0, 0, -1, z0, 0, 1, 0, -hub.y, 0, 0, 0, 1);
  const tube0 = centre('Tube subunit').applyMatrix4(baseplate), socket = ['F', 'G', 'H'].map(c => point(`fibre-${c}`)).reduce((s, p) => s.add(p), V()).divideScalar(3).applyMatrix4(baseplate);
  // 3J2M: the axis through the gp15 hexamer, along z, head-ward −z; the tail frame's origin is gp15's centre.
  const term = centre('Tail terminator'), sheathFrame = new THREE.Matrix4().set(1, 0, 0, -term.x, 0, 0, 1, -term.z, 0, -1, 0, term.y, 0, 0, 0, 1);
  const letters = ['a', 'b', 'c', 'd'], ext = letters.map(k => point(`sheath-${k}`)), con = letters.map(k => point(`contracted-${k}`));
  const extToCon = fitRigid(ext, con), c0 = centre('Sheath subunit');
  const qFrame = new THREE.Quaternion().setFromRotationMatrix(sheathFrame), qMove = new THREE.Quaternion().setFromRotationMatrix(extToCon);
  const pose = c => { const p = c.clone().applyMatrix4(sheathFrame); return {r: Math.hypot(p.x, p.z), phi: Math.atan2(-p.z, p.x), below: p.y}; };
  const sheath = {c0, q: [qFrame.clone(), qFrame.clone().multiply(qMove)], at: [pose(c0), pose(c0.clone().applyMatrix4(extToCon))]};

  // Heights along the axis (Å above the baseplate's lowest point) at rest: the first sheath ring sits on the baseplate,
  // gp15 above the last, then the neck and the head, its portal vertex down.
  const tubeRise = TUBE.rise, u = {tube0: -tube0.y, sheath0: -tube0.y - 34};
  u.top = u.sheath0 + (SHEATH.rings - 1) * SHEATH.extended.rise;
  u.gp15 = u.top + sheath.at[0].below;
  u.tubeRings = Math.floor((u.gp15 - 12 - u.tube0) / tubeRise) + 1;
  u.headBase = u.gp15 + 25 + NECK;
  const hz = geometry.head.boundingBox.max.z, lz = geometry.head.boundingBox.min.z;
  u.headTop = u.headBase + hz - lz;
  const head = new THREE.Matrix4().set(1, 0, 0, 0, 0, 0, 1, -hz - u.headBase, 0, -1, 0, 0, 0, 0, 0, 1);
  // The spike at the hub's tip, and the head's middle (for labels and shots).
  u.tip = geometry.hub.boundingBox.min.z - z0;
  u.headMid = (u.headBase + u.headTop) / 2;
  const sockets = Array.from({length: 6}, (_, i) => socket.clone().applyAxisAngle(Y, -i * 60 * DEG));
  return {geometry, frames: {baseplate, head, sheathFrame}, sheath, u, sockets, headWidth: 2 * 432, cavity};
}

// The DNA in the head, wound as a spool: coaxial shells round the head's long axis, outermost first, each a helix
// (`pitch` Å a turn) running the length of the head and back, kept inside its walls; then down the axis through the
// neck, tube and hub to the spike. Points in the phage's frame at rest; `spoolLength` is the length (Å) in the head.
export function dnaPath(model, {pitch = 62, shells = [332, 258, 184, 110], step = 22} = {}) {
  const pts = [], head = model.frames.head, u = model.u, z1 = -500, z2 = 488;
  let angle = 0, down = true;
  shells.forEach((r0, k) => {
    const turns = Math.round((z2 - z1) / pitch), n = Math.ceil(turns * 2 * Math.PI * r0 / step);
    for (let i = pts.length ? 1 : 0; i <= n; i++) {
      const f = i / n, z = down ? mix(z1, z2, f) : mix(z2, z1, f), a = angle + f * turns * 2 * Math.PI;
      // A little unevenness, as packed DNA has; never outside the walls.
      const r = Math.min(r0 + 7 * Math.sin(a * .37 + k) , cavity(z) - 20 - 3 * k);
      pts.push(V(r * Math.cos(a), r * Math.sin(a), z).applyMatrix4(head));
    }
    angle += turns * 2 * Math.PI; down = !down;
  });
  const spoolLength = length(pts), spoolEnd = pts.length;
  // Down the axis: from the last shell to the head's portal, then the neck, tail and hub.
  const last = pts.at(-1), exit = V(0, -u.headBase - 30, 0);
  for (let i = 1; i <= 10; i++) pts.push(last.clone().lerp(exit, i / 10));
  for (let y = -u.headBase - 30 + step; y < -u.tip; y += step) pts.push(V(0, y, 0));
  pts.push(V(0, -u.tip + 6, 0));
  return {points: pts, spoolLength, spoolEnd};
}
export function length(pts, upTo = pts.length) { let s = 0; for (let i = 1; i < upTo; i++) s += pts[i].distanceTo(pts[i - 1]); return s; }

// DNA along a path, drawn between two lengths along it (a sliding window, so a molecule moves along its own path), with
// round ends; at least `px` pixels wide in wide shots.
export function createPath(parent, points, {color = COLOURS.dna, radius = 10, sides = 8, glow = .1, outline = true} = {}) {
  const n = points.length, ring = sides + 1, position = new Float32Array(n * ring * 3), normal = new Float32Array(n * ring * 3), aRadius = new Float32Array(n * ring).fill(radius);
  const arc = new Float32Array(n);
  for (let i = 1; i < n; i++) arc[i] = arc[i - 1] + points[i].distanceTo(points[i - 1]);
  const t = V(), nn = V(), b = V(), v = V();
  for (let i = 0; i < n; i++) {
    t.subVectors(points[Math.min(n - 1, i + 1)], points[Math.max(0, i - 1)]).normalize();
    if (i === 0) nn.copy(Math.abs(t.y) < .9 ? Y : V(1, 0, 0)).cross(t); else nn.addScaledVector(t, -nn.dot(t));
    if (nn.lengthSq() < 1e-8) nn.copy(V(1, 0, 0)).cross(t);
    nn.normalize(); b.crossVectors(t, nn);
    for (let j = 0; j <= sides; j++) {
      const k = (i * ring + j) * 3, a = j / sides * Math.PI * 2; v.copy(nn).multiplyScalar(Math.cos(a)).addScaledVector(b, Math.sin(a));
      position[k] = points[i].x + radius * v.x; position[k + 1] = points[i].y + radius * v.y; position[k + 2] = points[i].z + radius * v.z;
      normal[k] = v.x; normal[k + 1] = v.y; normal[k + 2] = v.z;
    }
  }
  const index = new Uint32Array((n - 1) * sides * 6);
  for (let i = 0, k = 0; i < n - 1; i++) for (let j = 0; j < sides; j++, k += 6) { const a = i * ring + j, c = a + ring; index.set([a, a + 1, c, c, a + 1, c + 1], k); }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(position, 3)); g.setAttribute('normal', new THREE.BufferAttribute(normal, 3));
  g.setAttribute('aRadius', new THREE.BufferAttribute(aRadius, 1)); g.setIndex(new THREE.BufferAttribute(index, 1));
  g.computeBoundingSphere();
  return pathFromGeometry(parent, {geometry: g, arc, points, sides, radius, color, glow, outline});
}

// Another view of the same path geometry (spools shared by many phages), with its own material and window.
export function pathFromGeometry(parent, {geometry: source, arc, points, sides = 8, radius = 10, color = COLOURS.dna, glow = .1, outline = true, material = null}) {
  // A view of the geometry: the same buffers, its own draw range.
  const geometry = new THREE.BufferGeometry();
  for (const [k, a] of Object.entries(source.attributes)) geometry.setAttribute(k, a);
  geometry.setIndex(source.index); geometry.boundingSphere = source.boundingSphere;
  const grow = {uMinRadius: {value: radius}};
  const m = material || strandMaterial(color, {glow, grow}), capMaterial = strandMaterial(color, {glow});
  const mesh = new THREE.Mesh(geometry, m), cap = new THREE.SphereGeometry(1, 12, 8), caps = [0, 1].map(() => new THREE.Mesh(cap, capMaterial));
  mesh.frustumCulled = false; parent.add(mesh, ...caps);
  let hull = null;
  if (outline) { hull = new THREE.Mesh(geometry, outlineMaterial(.3, {grow})); hull.renderOrder = -1; hull.frustumCulled = false; parent.add(hull); }
  const total = arc[arc.length - 1], seg = s => { let lo = 0, hi = arc.length - 1; while (hi - lo > 1) { const mid = (lo + hi) >> 1; if (arc[mid] <= s) lo = mid; else hi = mid; } return lo; };
  const where = (s, out) => { const i = seg(s), f = arc[i + 1] > arc[i] ? (s - arc[i]) / (arc[i + 1] - arc[i]) : 0; return out.copy(points[i]).lerp(points[Math.min(points.length - 1, i + 1)], clamp(f)); };
  const path = {mesh, caps, hull, total, arc, points, geometry: source, sides, material: m, materials: [m, capMaterial], a: 0, b: total,
    // Draws the stretch from a to b (Å along the path).
    window(a, b) {
      a = Math.max(0, a); b = Math.min(total, b); path.a = a; path.b = b;
      const on = b - a > 1;
      const i0 = seg(a), i1 = Math.max(i0 + 1, seg(b) + 1);
      geometry.setDrawRange(i0 * sides * 6, on ? (i1 - i0) * sides * 6 : 0);
      where(a, caps[0].position); where(b, caps[1].position);
      caps.forEach(c => { c.visible = on && path.shown; });
    },
    shown: true,
    show(on) { path.shown = on; mesh.visible = on; if (hull) hull.visible = on; caps.forEach(c => { c.visible = on && path.b - path.a > 1; }); },
    // Widths that stay visible in wide shots (px/Å at the subject).
    view(pxPerA) { const r = minRadius(radius, pxPerA, 1.1); grow.uMinRadius.value = r; caps.forEach(c => c.scale.setScalar(r)); if (hull) hull.material.userData.uniforms.uWidth.value = outlineWidth(pxPerA, .3 * radius / 10); },
    // A point s Å along it, in world coordinates.
    point: (s, out = V()) => { where(clamp(s / total) * total, out); return mesh.parent ? mesh.parent.localToWorld(out) : out; },
  };
  path.window(0, total);
  return path;
}

// The protein materials of a phage: its head (cut open on its own plane), and the rest of its coat.
export function coatMaterials({cut = false} = {}) {
  const head = proteinMaterial(COLOURS.protein, {rim: .22, side: cut ? THREE.DoubleSide : THREE.FrontSide});
  const plane = new THREE.Plane(V(0, 0, 1), 1e9);
  if (cut) { head.clippingPlanes = [plane]; head.userData.uniforms.uCut.value = 0; }
  const tail = proteinMaterial(COLOURS.protein, {rim: .22}), dark = proteinMaterial(COLOURS.proteinDark, {rim: .2});
  return {head, tail, dark, plane, all: [head, tail, dark]};
}
// Label glow on protein materials (0 none, 1 labelled).
export function labelCoat(mats, w) {
  for (const m of mats.all) {
    const base = m === mats.dark ? COLOURS.proteinDark : COLOURS.protein;
    m.color.set(base).lerp(new THREE.Color(COLOURS.proteinLabel), w).multiplyScalar(.86);
    m.userData.uniforms.uGlow.value = .45 * w; m.emissive.set(COLOURS.proteinLabel); m.emissiveIntensity = .22 * w;
  }
}
export function labelDNA(materials, w) {
  for (const material of [materials].flat()) {
    material.color.set(COLOURS.dna).lerp(new THREE.Color(COLOURS.dnaLabel), w);
    material.emissive.copy(material.color); material.emissiveIntensity = .08 + .16 * w;
  }
}

const unitCylinder = new THREE.CylinderGeometry(1, 1, 1, 10, 1, false), unitSphere = new THREE.SphereGeometry(1, 14, 10);
const neckGeometry = new THREE.LatheGeometry([[0, -8], [66, -8], [64, 30], [58, 60], [60, NECK - 28], [104, NECK - 18], [106, NECK - 6], [70, NECK + 4], [0, NECK + 4]].map(([r, y]) => new THREE.Vector2(r, y)), 40);

// One phage: `far` uses the coarser surfaces (a crowd), `path` its DNA (dnaPath, or a shared spool), `mats` its
// protein materials (coatMaterials; shared by a crowd).
export function createPhage(parent, model, {far = false, mats = coatMaterials()} = {}) {
  const G = model.geometry, u = model.u, group = new THREE.Group(), upper = new THREE.Group(); group.add(upper); parent.add(group);
  const mesh = (geometry, material, matrix, into) => { const m = new THREE.Mesh(geometry, material); m.matrixAutoUpdate = false; m.matrix.copy(matrix); into.add(m); return m; };
  // The baseplate stays; the hub, tube, gp15, neck and head move as one when the sheath contracts.
  const plate = mesh(far ? G.baseplateFar : G.baseplate, mats.dark, model.frames.baseplate, group);
  const hub = mesh(G.hub, mats.dark, model.frames.baseplate, upper);
  const headMesh = mesh(far ? G.headFar : G.head, mats.head, model.frames.head, upper);
  const portal = G.portal && !far ? mesh(G.portal, mats.head, model.frames.head, upper) : null;
  const neck = new THREE.Mesh(neckGeometry, mats.tail); neck.rotation.x = Math.PI; neck.position.y = -u.gp15 - 12; upper.add(neck);
  const terminator = mesh(G.terminator, mats.tail, new THREE.Matrix4().makeTranslation(0, -u.gp15, 0).multiply(model.frames.sheathFrame), upper);
  // The tube: rings of six gp19, repeated from 5IV5's first ring.
  const tube = new THREE.InstancedMesh(far ? G.tubeFar : G.tube, mats.tail, u.tubeRings * 6), m4 = new THREE.Matrix4();
  for (let i = 0, k = 0; i < u.tubeRings; i++) for (let j = 0; j < 6; j++, k++) tube.setMatrixAt(k, m4.makeTranslation(0, -i * TUBE.rise, 0).multiply(rotY(-(i * TUBE.twist + j * 60) * DEG)).multiply(model.frames.baseplate));
  tube.frustumCulled = false; upper.add(tube);
  const sheath = new THREE.InstancedMesh(far ? G.sheathFar : G.sheath, mats.tail, SHEATH.rings * 6); sheath.frustumCulled = false; group.add(sheath);
  // Fibres: six proximal and six distal halves, knees and tips.
  const rods = new THREE.InstancedMesh(unitCylinder, mats.tail, 12), joints = new THREE.InstancedMesh(unitSphere, mats.tail, 12);
  rods.frustumCulled = joints.frustumCulled = false; group.add(rods, joints);

  const S = model.sheath, dummy = new THREE.Object3D(), q = new THREE.Quaternion(), p = V(), tmp = V();
  const state = {contract: -1, fibres: -1, ground: null};
  const ringState = c => { const W = 5, n = SHEATH.rings; return k => smooth((c * (n + W) - k) / W); };
  const ringPose = (s, out) => {
    q.slerpQuaternions(S.q[0], S.q[1], s);
    const r = mix(S.at[0].r, S.at[1].r, s), d = Math.atan2(Math.sin(S.at[1].phi - S.at[0].phi), Math.cos(S.at[1].phi - S.at[0].phi)), phi = S.at[0].phi + d * s;
    // M(s): p ↦ q (p − c0) + P(s)
    out.makeRotationFromQuaternion(q); const tr = V(r * Math.cos(phi), 0, -r * Math.sin(phi)).sub(S.c0.clone().applyQuaternion(q)); out.setPosition(tr);
    return out;
  };
  const M = new THREE.Matrix4(), R = new THREE.Matrix4();
  const phage = {group, upper, model, mats, sheath, tube, headMesh, plate, hub, u,
    heights: {top: 0, gp15: 0, drop: 0, turn: 0},
    // Contraction (0 extended … 1 contracted), the wave running up from the baseplate.
    contract(c) {
      c = clamp(c); if (Math.abs(c - state.contract) < 1e-5) return; state.contract = c;
      const s = ringState(c), E = SHEATH.extended, C = SHEATH.contracted;
      let height = u.sheath0, turn = -(SHEATH.rings - 1) * E.twist * DEG;
      for (let k = 0; k < SHEATH.rings; k++) {
        const sk = s(k);
        if (k > 0) { const w = (s(k - 1) + sk) / 2; height += mix(E.rise, C.rise, w); turn += mix(E.twist, C.twist, w) * DEG; }
        ringPose(sk, M);
        for (let j = 0; j < 6; j++) { m4.makeTranslation(0, -height, 0).multiply(R.makeRotationY(-turn - j * 60 * DEG)).multiply(M); sheath.setMatrixAt(k * 6 + j, m4); }
      }
      sheath.instanceMatrix.needsUpdate = true;
      const top = s(SHEATH.rings - 1), gp15 = height + mix(S.at[0].below, S.at[1].below, top);
      phage.heights = {top: height, gp15, drop: u.gp15 - gp15, turn};
      upper.position.y = u.gp15 - gp15; upper.rotation.y = -turn;
      upper.updateMatrix();
    },
    // Fibres from free (0) to splayed on the ground (1): `ground` is its height (local y, below the baseplate).
    // `ground` is its height below the baseplate (local y), or a function giving it under a point (a curved cell).
    fibres(w, ground = 60) {
      w = clamp(w); if (typeof ground !== 'function' && Math.abs(w - state.fibres) < 1e-5 && ground === state.ground) return; state.fibres = w; state.ground = ground;
      const [f1, f2] = FIBRE.free, a1 = mix(f1, FIBRE.attached, w) * DEG;
      model.sockets.forEach((s, i) => {
        const radial = V(s.x, 0, s.z).normalize(), down = V(0, 1, 0);
        const knee = s.clone().addScaledVector(radial, FIBRE.proximal * Math.cos(a1)).addScaledVector(down, FIBRE.proximal * Math.sin(a1));
        // Attached, the distal half reaches down to the ground (found again under where the tip lands).
        const reach = g => { const need = clamp((g - knee.y) / FIBRE.distal, -1, 1), a2 = mix(f2 * DEG, Math.asin(need), w); return knee.clone().addScaledVector(radial, FIBRE.distal * Math.cos(a2)).addScaledVector(down, FIBRE.distal * Math.sin(a2)); };
        let tip = reach(typeof ground === 'function' ? 60 : ground);
        if (typeof ground === 'function') tip = reach(ground(tip));
        rod(i, s, knee, FIBRE.radius[0]); rod(6 + i, knee, tip, FIBRE.radius[1]);
        ball(i, knee, 24); ball(6 + i, tip, 20);
        phage.tips[i] = tip;
      });
      rods.instanceMatrix.needsUpdate = joints.instanceMatrix.needsUpdate = true;
    },
    tips: [],
    // The head cut open on the plane through its axis facing −z (world), `open` 0 closed … 1 open to the axis.
    cut(open, towards = V(0, 0, -1)) {
      if (!mats.head.clippingPlanes?.length) return;
      group.updateMatrixWorld(true);
      const c = V(0, -u.headMid, 0).applyMatrix4(upper.matrixWorld), axis = V(0, -1, 0).transformDirection(upper.matrixWorld);
      const n = towards.clone().negate().addScaledVector(axis, towards.dot(axis)).normalize();
      mats.head.clippingPlanes[0].setFromNormalAndCoplanarPoint(n, c.addScaledVector(n, -(1 - open) * model.headWidth * .6));
      mats.head.userData.uniforms.uCut.value = 0;
    },
    // Where things are (world), for labels and shots.
    at(name, out = V()) {
      group.updateMatrixWorld(true);
      const local = {head: V(0, -u.headMid, 0), headSide: V(-model.headWidth * .5 - 6, -u.headMid + 120, 40), headTop: V(0, -u.headTop, 0), sheath: V(-120, -(u.sheath0 + u.top) / 2, 0),
        baseplate: V(-230, -140, 0), tip: V(0, -u.tip, 0), middle: V(0, -u.headTop / 2, 0)}[name];
      if (name === 'fibre') return out.copy(phage.tips[0] ? phage.tips[0].clone().lerp(model.sockets[0], .5) : V()).applyMatrix4(group.matrixWorld);
      if (name === 'knee') return out.copy(phage.tips[1] ? phage.tips[1] : V()).applyMatrix4(group.matrixWorld);
      return out.copy(local).applyMatrix4(['head', 'headSide', 'headTop', 'tip'].includes(name) ? upper.matrixWorld : group.matrixWorld);
    },
  };
  function rod(i, a, b, r) { tmp.subVectors(b, a); const len = tmp.length(); dummy.position.copy(a).add(b).multiplyScalar(.5); dummy.quaternion.setFromUnitVectors(Y, tmp.normalize()); dummy.scale.set(r, len, r); dummy.updateMatrix(); rods.setMatrixAt(i, dummy.matrix); }
  function ball(i, a, r) { dummy.position.copy(a); dummy.quaternion.identity(); dummy.scale.setScalar(r); dummy.updateMatrix(); joints.setMatrixAt(i, dummy.matrix); }
  phage.contract(0); phage.fibres(0);
  return phage;
}

// A phage's height (Å) from its fibre tips (free) to the top of its head, for shots.
export const phageHeight = model => model.u.headTop + 900;
