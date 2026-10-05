// Scene: the Hershey–Chase experiment. Phage T2 (drawn as its close relative T4, phage.mjs) and E. coli at true size
// in one space (Å): a phage beside a cell 1 µm wide and 2.4 µm long. The phage, its protein coat and the DNA in its
// head; phages attaching to a cell; one cell cut open as its tail contracts and its DNA passes down the tail into the
// cell, the empty coat staying outside; the lytic cycle (the DNA copied, new phages assembled, the cell bursting open
// and releasing them); then the experiment: a phage whose DNA carries ³²P and whose protein carries ³⁵S (protein
// lilac and DNA pale rose throughout, vivid violet and red where labelled), labelled phages infecting bacteria in a
// blender, their coats sheared off, a centrifuge tube with the bacteria in the pellet and the coats in the
// supernatant, meters for where each label went, and the progeny of the infected cells, some of their DNA carrying
// ³²P and their new coats none of the ³⁵S.
import * as THREE from 'three';
import {runScene} from '../shared/scene_player.mjs';
import {loadSurfaceSet, baseMaterial, fade, fadeObject} from '../shared/molecules.mjs';
import {ramp, smooth, clamp, mix} from '../shared/ease.mjs';
import {phageModel, createPhage, coatMaterials, dnaPath, createPath, pathFromGeometry, labelCoat, labelDNA, COLOURS, SHEATH, length} from './phage.mjs';

const V = (...a) => new THREE.Vector3(...a), DEG = Math.PI / 180;
const hex = c => '#' + c.toString(16).padStart(6, '0');
const T = {attach: 11, enter: 22, lytic: 35, label: 50, blend: 61, spin: 74, results: 85, progeny: 98, dna: 110, end: 121};
// E. coli: a rod 1 µm across (radius R) and 2.4 µm long (a cylinder 2 × HALF long between round ends); its envelope
// ENV thick, from the outer membrane to the inner.
const R = 5000, HALF = 7000, ENV = 320, GAP = 60;
// The free phage's height above the cell before it lands (Å), and the radius of the cell drawn in the close shot of its
// entry; the one other phage that shot keeps.
const LIFT = 9500, WINDOW = 3600, NEIGHBOUR = 3;
// The labelled phage's height above the bacterium it will infect, while it is shown on its own.
const LABEL_LIFT = 20000;
const P32 = COLOURS.dnaLabel, S35 = COLOURS.proteinLabel;
// Where each label was found (Hershey and Chase, 1952): in the supernatant with the coats, in the pellet with the
// bacteria, and in the progeny. The notes give 80% of the ³⁵S in the supernatant, 70% of the ³²P in the pellet, and 30%
// of the ³²P and 1% of the ³⁵S in the progeny; the meters show the rest of each label in the other fraction, unnamed.
const RESULTS = {supernatant: {S35: .8, P32: .3}, pellet: {S35: .2, P32: .7}, progeny: {S35: .01, P32: .3}};
// The progeny phage the last step looks at (one of those carrying labelled DNA).
const FOCUS = 4;

const NOTES = 'evidence-for-dna-as-the-genetic-material-of-viruses';
const steps = [
  {t: 0, nav: 'Phages', title: 'Phages are viruses<br>that infect bacteria.', notes: NOTES,
    text: 'Bacteriophages, often abbreviated to phages, are viruses that infect bacteria. We focus on phage T2, a virus that infects Escherichia coli bacteria.'},
  {t: T.attach, nav: 'Attachment', title: 'Phages attach to<br>the cell surface.', notes: NOTES,
    text: 'When phage particles are added to the bacteria, they attach to the outside surface.'},
  {t: T.enter, nav: 'Entry', title: 'Some material<br>enters the cell.', notes: NOTES,
    text: 'Once the phage is attached, some material enters the cell, while the empty coat stays on the outside.'},
  {t: T.lytic, nav: 'The lytic cycle', title: 'The cell bursts,<br>releasing new phages.', notes: NOTES, hold: 1.1,
    text: 'Approximately 20 minutes later, the cell bursts open, releasing new phage particles, which go on to infect other cells. This is the lytic cycle.'},
  {t: T.label, nav: 'Radiolabelling', title: '³²P in the DNA,<br>³⁵S in the protein.', notes: NOTES, hold: 1.2,
    text: 'In 1952, Martha Chase and Alfred Hershey asked which material injected into the cell carries the genetic information. They replaced the phosphorus atoms in the phage’s DNA with radioactive phosphorus-32, and the sulfur atoms in its protein with radioactive sulfur-35.'},
  {t: T.blend, nav: 'Infect, then blend', title: 'Infect briefly,<br>then blend.', notes: NOTES, hold: 1.1,
    text: 'They infected bacteria with these radiolabelled phages and allowed the infection to proceed for a short time. Blending then detached the adsorbed phage coats from the bacteria.'},
  {t: T.spin, nav: 'Centrifuge', title: 'Bacteria in the pellet,<br>coats above.', notes: NOTES,
    text: 'Centrifugation then placed the bacteria in the pellet and the detached phage material in the supernatant.',
    predict: {id: 'sulfur', question: 'Where will most of the ³⁵S be?', choices: [
      {text: 'In the supernatant, with the coats', correct: true},
      {text: 'In the pellet, with the bacteria', correct: false, reply: 'The ³⁵S is in the protein of the phage coats, which blending detached from the bacteria.'}]}},
  {t: T.results, nav: 'Where the labels went', title: '³⁵S stays outside,<br>³²P goes in.', notes: NOTES, hold: 1.1,
    text: 'The supernatant, with the phage coats, contained 80% of the sulfur-35 label, while the pellet, with the bacteria, contained 70% of the phosphorus-32 label.',
    predict: {id: 'progeny', question: 'Which label will reach the progeny phages?', choices: [
      {text: '³²P, in the DNA', correct: true},
      {text: '³⁵S, in the protein', correct: false, reply: 'The ³⁵S stayed outside with the coats: only DNA is injected into the bacterium.'},
      {text: 'Both, equally', correct: false, reply: 'Only DNA is injected into the bacterium, so only its label can become part of the progeny.'}]}},
  {t: T.progeny, nav: 'The progeny', title: 'The progeny carry<br>³²P, not ³⁵S.', notes: NOTES,
    text: 'The progeny phages contained 30% of the phosphorus-32 label, but only 1% of the sulfur-35 label.'},
  {t: T.dna, nav: 'DNA carries the genes', title: 'DNA is the<br>genetic material.', notes: NOTES, hold: 1.1,
    text: 'Only DNA is injected into the bacterium, and can therefore become part of the progeny phages: DNA is the genetic information carrier for these viruses.'},
];

// ---------- Small helpers ----------
const rng = seed => () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
// A smooth random walk, as DNA lies in a cell: from `start`, first along `dir`, turning a little at each step and
// steered back when it strays from its region (a box of half-sizes `half` round `centre`).
function wander(start, dir, total, centre, half, seed, step = 22) {
  const r = rng(seed), pts = [start.clone()], d = dir.clone().normalize(), p = start.clone(), spin = V(r() - .5, r() - .5, r() - .5).normalize();
  let s = 0;
  while (s < total) {
    const n = pts.length;
    if (n > 18) {
      // Slowly turning (curvature ~1/250 Å), with a slowly changing plane of turning.
      spin.add(V(r() - .5, r() - .5, r() - .5).multiplyScalar(.35)).normalize();
      d.addScaledVector(V().crossVectors(d, spin), .085).normalize();
      const off = V().subVectors(p, centre); let pull = 0;
      for (const k of ['x', 'y', 'z']) { const e = Math.abs(off[k]) / half[k]; if (e > .8) pull = Math.max(pull, e - .8); }
      if (pull > 0) d.addScaledVector(off.clone().divide(V(half.x, half.y, half.z)).normalize().negate(), Math.min(.25, pull * .6)).normalize();
    }
    p.addScaledVector(d, step); pts.push(p.clone()); s += step;
  }
  return pts;
}
const surfacePoint = (x, phi, r = R) => V(x, -r * Math.cos(phi), r * Math.sin(phi));
const normalAt = phi => V(0, -Math.cos(phi), Math.sin(phi));

// ---------- E. coli ----------
// A cell as two closed surfaces, the outer and inner membranes (each a capsule). Cut open, the far half shows its
// inside: the envelope between the membranes and the cytoplasm within. When it bursts, holes open in its envelope and
// spread, their edges lit, until nothing is left of it.
const CELL = {outer: 0x6f5639, periplasm: 0x75593a, inner: 0x8a6a45, cytoplasm: 0x3b3128};
const capsule = (() => {
  const cache = new Map();
  return radius => { if (!cache.has(radius)) cache.set(radius, new THREE.CapsuleGeometry(radius, 2 * HALF, 24, 112, 44).rotateZ(Math.PI / 2)); return cache.get(radius); };
})();
function cellMaterial(color, cap, plane, seed) {
  const m = baseMaterial(color, {side: THREE.DoubleSide, roughness: .86, envMapIntensity: .08});
  if (plane) m.clippingPlanes = [plane];
  // uWindow: only the part of the cell within a radius (w, Å; 0 for all of it) of a point (xy, world) is drawn, its edge
  // dithered over uFeather, so a close shot shows no more of the cell than it frames.
  const u = {uBurst: {value: 0}, uSeed: {value: seed}, uCap: {value: new THREE.Color(cap)}, uEdge: {value: 30}, uWindow: {value: new THREE.Vector4(0, 0, 0, 0)}, uFeather: {value: 500}};
  m.userData.uniforms = u;
  m.onBeforeCompile = sh => {
    Object.assign(sh.uniforms, u);
    sh.vertexShader = sh.vertexShader.replace('void main() {', 'varying vec3 vCell, vCellWorld;\nvoid main() {\n  vCell = position;\n  vCellWorld = (modelMatrix * vec4(position, 1.)).xyz;');
    // Value noise over the cell's own coordinates (Å): where it falls below the burst, the envelope is gone.
    sh.fragmentShader = sh.fragmentShader.replace('void main() {', `uniform vec3 uCap;
uniform float uEdge, uBurst, uSeed, uFeather;
uniform vec4 uWindow;
varying vec3 vCell, vCellWorld;
float cellHash(vec3 p) { p = fract(p * .3183099 + .1); p *= 17.; return fract(p.x * p.y * p.z * (p.x + p.y + p.z)); }
float cellNoise(vec3 x) {
  vec3 i = floor(x), f = fract(x); f = f * f * (3. - 2. * f);
  return mix(mix(mix(cellHash(i), cellHash(i + vec3(1., 0., 0.)), f.x), mix(cellHash(i + vec3(0., 1., 0.)), cellHash(i + vec3(1., 1., 0.)), f.x), f.y),
             mix(mix(cellHash(i + vec3(0., 0., 1.)), cellHash(i + vec3(1., 0., 1.)), f.x), mix(cellHash(i + vec3(0., 1., 1.)), cellHash(i + vec3(1., 1., 1.)), f.x), f.y), f.z);
}
void main() {
  float holes = .78 * cellNoise(vCell / 2600. + uSeed) + .22 * cellNoise(vCell / 900. + 1.7 * uSeed);
  float burstAt = mix(.2, .92, uBurst);
  if (uBurst > 0. && holes < burstAt) discard;
  if (uWindow.w > 0.) {
    float beyond = (length(vCellWorld.xy - uWindow.xy) - uWindow.w) / uFeather + .5;
    if (beyond > fract(52.9829189 * fract(dot(gl_FragCoord.xy, vec2(.06711056, .00583715))))) discard;
  }`)
      .replace('#include <opaque_fragment>', `#include <opaque_fragment>
  #if NUM_CLIPPING_PLANES > 0
    float dP = clippingPlanes[0].w - dot(vClipPosition, clippingPlanes[0].xyz);
    if (!gl_FrontFacing) gl_FragColor.rgb = uCap * (.8 + .2 * smoothstep(0., 5000., dP));
    else gl_FragColor.rgb = mix(gl_FragColor.rgb, vec3(1., .88, .66), .7 * (1. - smoothstep(0., uEdge, dP)));
  #else
    if (!gl_FrontFacing) gl_FragColor.rgb = uCap;
  #endif
  if (uBurst > 0.) gl_FragColor.rgb = mix(gl_FragColor.rgb, vec3(1., .82, .58), .5 * (1. - smoothstep(0., .025, holes - burstAt)));`);
  };
  m.customProgramCacheKey = () => `hc-cell-${plane ? 1 : 0}`;
  return m;
}
function createCell(parent, {at = V(), tilt = 0, cut = false, seed = 1} = {}) {
  const group = new THREE.Group(); group.position.copy(at); group.rotation.z = tilt; parent.add(group);
  const plane = cut ? new THREE.Plane(V(0, 0, 1), 1e9) : null;
  const outer = new THREE.Mesh(capsule(R), cellMaterial(CELL.outer, CELL.periplasm, plane, seed * 7.31));
  const inner = new THREE.Mesh(capsule(R - ENV), cellMaterial(CELL.inner, CELL.cytoplasm, plane, seed * 7.31));
  outer.frustumCulled = inner.frustumCulled = false; group.add(outer, inner);
  const mats = [outer.material, inner.material];
  let on = true, gone = false;
  const visible = () => { outer.visible = inner.visible = on && !gone; };
  return {group, plane, mats,
    // The membranes shown or not (what the cell holds is shown on its own).
    show(v) { on = v; visible(); },
    // The cut: 0 whole, 1 open to the axis (the half towards the viewer gone).
    cut(open) {
      if (!plane) return; group.updateMatrixWorld(true);
      const n = V(0, 0, 1).transformDirection(group.matrixWorld), c = V().setFromMatrixPosition(group.matrixWorld).addScaledVector(n, -(1 - open) * (R + 900));
      plane.setFromNormalAndCoplanarPoint(n, c);
    },
    // Bursting: 0 whole … 1 gone.
    burst(b) { for (const m of mats) m.userData.uniforms.uBurst.value = b; gone = b >= 1; visible(); },
    view(pxPerA) { for (const m of mats) m.userData.uniforms.uEdge.value = 1.6 / Math.max(pxPerA, 1e-4); },
    // Only the part within radius r (Å; 0 for all) of a world point (x, y) is drawn.
    window(x, y, r) { for (const m of mats) m.userData.uniforms.uWindow.value.set(x, y, 0, r); },
  };
}

// ---------- Glassware ----------
// Glass and liquid stay see-through; solid parts fade as proteins do, opaque again once shown.
function fadeParts(group, mats, v) { group.visible = v > .01; for (const {m, base, glass} of mats) { if (glass) m.opacity = base * v; else fade(m, v); } }
const glass = (opacity = .13) => baseMaterial(0xa9c3cc, {roughness: .3, transparent: true, opacity, side: THREE.DoubleSide, depthWrite: false, envMapIntensity: .25});
function lathe(points, segments = 72) { return new THREE.LatheGeometry(points.map(([r, y]) => new THREE.Vector2(r, y)), segments); }
// A blender: a glass jar on its motor base, blades at the bottom, filled with medium.
function createBlender(parent, {at, radius = 27000, height = 66000}) {
  const group = new THREE.Group(); group.position.copy(at); parent.add(group);
  const bottom = height / 2, top = -height / 2, parts = [];
  const jar = new THREE.Mesh(lathe([[radius * .86, bottom], [radius, bottom - 5000], [radius * 1.04, top + 3000], [radius * 1.07, top]]), glass(.12));
  const liquid = new THREE.Mesh(lathe([[0, bottom - 400], [radius * .85, bottom - 400], [radius * .98, bottom - 5000], [radius * 1.02, top + 6000], [0, top + 6000]]), baseMaterial(0x5d8594, {transparent: true, opacity: .1, depthWrite: false, side: THREE.DoubleSide}));
  const rim = new THREE.Mesh(new THREE.TorusGeometry(radius * 1.07, 700, 10, 96), baseMaterial(0xcfdde2, {roughness: .3}));
  rim.rotation.x = Math.PI / 2; rim.position.y = top;
  const base = new THREE.Mesh(new THREE.CylinderGeometry(radius * 1.02, radius * 1.18, 15000, 64), baseMaterial(0x2c3a45, {roughness: .45}));
  base.position.y = bottom + 7500;
  const collar = new THREE.Mesh(new THREE.CylinderGeometry(radius * .9, radius * .95, 3000, 64), baseMaterial(0x3b4b57, {roughness: .4}));
  collar.position.y = bottom + 900;
  const blades = new THREE.Group(); blades.position.y = bottom - 2600;
  const bladeMaterial = baseMaterial(0xd4dde2, {metalness: .6, roughness: .28});
  for (let i = 0; i < 4; i++) {
    const b = new THREE.Mesh(new THREE.BoxGeometry(radius * .62, 500, 3200), bladeMaterial);
    b.geometry.translate(radius * .31, 0, 0); b.rotation.y = i * Math.PI / 2; b.rotation.x = (i % 2 ? 1 : -1) * .35; blades.add(b);
  }
  blades.add(new THREE.Mesh(new THREE.CylinderGeometry(1800, 1800, 2600, 24), bladeMaterial));
  group.add(jar, liquid, rim, base, collar, blades);
  const mats = [...new Set([jar, liquid, rim, base, collar, ...blades.children].map(m => m.material))].map(m => ({m, base: m.opacity, glass: m.transparent}));
  return {group, blades, top, bottom, radius, opacity: v => fadeParts(group, mats, v)};
}
// A centrifuge tube with a conical tip, filled to near the top.
function createTube(parent, {at, radius = 24000, top = -44000, bottom = 42000}) {
  const group = new THREE.Group(); group.position.copy(at); parent.add(group);
  // A round bottom: the pellet collects there.
  const round = (r, n = 16) => Array.from({length: n + 1}, (_, i) => { const a = i / n * Math.PI / 2; return [r * Math.sin(a), bottom - radius + r * Math.cos(a)]; });
  const wall = new THREE.Mesh(lathe([...round(radius), [radius, top], [radius * 1.04, top - 1200]]), glass(.13));
  const liquid = new THREE.Mesh(lathe([...round(radius * .97), [radius * .97, top + 9000], [0, top + 9000]]), baseMaterial(0x6d93a3, {transparent: true, opacity: .09, depthWrite: false, side: THREE.DoubleSide}));
  const cap = new THREE.Mesh(new THREE.CylinderGeometry(radius * 1.08, radius * 1.08, 6000, 64), baseMaterial(0x4f6d7c, {roughness: .45}));
  cap.position.y = top - 3600;
  group.add(wall, liquid, cap);
  const mats = [wall.material, liquid.material, cap.material].map(m => ({m, base: m.opacity, glass: m !== cap.material}));
  return {group, radius, top, bottom, liquidTop: top + 9000, opacity: v => fadeParts(group, mats, v)};
}
// A meter for how much of one label a fraction holds: a dim track and a fill in the label's colour, left to right. Its
// tag (the isotope, and the amount where it is known) sits just past the track's end, so it never moves.
function createMeter(parent, {at, length: L = 30000, thick = 2400, color}) {
  const group = new THREE.Group(); group.position.copy(at); parent.add(group);
  const flat = (c, opacity) => new THREE.MeshBasicMaterial({color: c, transparent: true, opacity, depthWrite: false, side: THREE.DoubleSide, toneMapped: false});
  const track = new THREE.Mesh(new THREE.PlaneGeometry(L, thick), flat(0x1c2a36, 0)); track.position.x = L / 2;
  const fillGeometry = new THREE.PlaneGeometry(1, thick * .7); fillGeometry.translate(.5, 0, 0);
  const fill = new THREE.Mesh(fillGeometry, flat(color, 0)); fill.position.z = -20;
  track.renderOrder = 2; fill.renderOrder = 3; group.add(track, fill);
  return {group, L, tagAt: V(at.x + L + thick * 1.1, at.y, at.z), headAt: V(at.x + thick * .2, at.y - thick * 4.5, at.z),
    // Filled to w (0–1), shown v (0–1).
    value: 0, shown: 0,
    set(w, v) { this.value = w; this.shown = v; group.visible = v > .01; fill.scale.x = Math.max(1, L * w); fill.visible = w > .001; track.material.opacity = .92 * v; fill.material.opacity = v; }};
}

const at = {};  // for tests (?debug=1) and the shots

runScene({
  pageTitle: 'The Hershey–Chase experiment · Genes are DNA', eyebrow: 'DNA in viruses',
  links: [{href: 'index.html', text: 'All scenes'}],
  steps, duration: T.end, notesPage: 'notes.html', fov: 28, fog: .0000012, near: 30, far: 3e6, loop: false,
  shots: [
    {t: 0, frame: () => ({target: at.shot.free, dir: [.16, -.1, -1], box: [3700, 3900]})},
    {t: T.attach, blend: 2.8, frame: () => ({target: at.shot.cell, dir: [.12, -.34, -1], box: [27500, 24000]})},
    {t: T.enter, blend: 2.8, frame: () => ({target: at.shot.entry, dir: [.1, -.07, -1], box: [8000, 6800]})},
    {t: T.lytic, blend: 2.8, frame: () => ({target: at.shot.lytic, dir: [.08, -.16, -1], box: [27500, 15500]})},
    {t: T.label, blend: 2.6, frame: () => ({target: at.shot.label, dir: [.18, -.08, -1], box: [3700, 3900]})},
    // The pull back from the labelled phage to the blender waits for the step: from so close, even its first moments move a lot.
    {t: T.blend, blend: 3, lead: .1, frame: () => ({target: at.shot.jar, dir: [.06, -.12, -1], box: [66000, 86000]})},
    {t: T.spin, blend: 2.4, frame: () => ({target: at.shot.tube, dir: [.05, -.08, -1], box: [54000, 100000]})},
    {t: T.results, blend: 2.6, frame: () => ({target: at.shot.results, dir: [.04, -.06, -1], box: [102000, 108000]})},
    {t: T.progeny, blend: 3, frame: () => ({target: at.shot.progeny, dir: [.08, -.12, -1], box: [30000, 33000]})},
    {t: T.dna, blend: 2.6, frame: () => ({target: at.shot.close, dir: [.12, -.1, -1], box: [4600, 3800]})},
  ],
  async build({world, renderer, progress}) {
    renderer.localClippingEnabled = true;
    const set = await loadSurfaceSet('assets/phage.json', 'assets/phage.bin', progress);
    const model = phageModel(set), u = model.u, spool = dnaPath(model), r = rng(7);
    at.shot = {};

    // A phage placed on a surface point with outward normal n, `lift` Å above its landing height, turned `spin` about
    // its own axis.
    const orient = (ph, point, n, lift = 0, spin = 0) => {
      ph.group.quaternion.setFromUnitVectors(V(0, -1, 0), n.clone().normalize()).multiply(new THREE.Quaternion().setFromAxisAngle(V(0, 1, 0), spin));
      ph.group.position.copy(point).addScaledVector(n.clone().normalize(), GAP + lift);
    };
    // Fibre tips reach down to a cell's curved surface (the phage's parent is the cell's frame).
    const curved = (ph, point) => tip => { const p = V(tip.x, 0, tip.z).applyQuaternion(ph.group.quaternion).add(point), x = clamp(p.x, -HALF, HALF); return GAP + Math.max(0, Math.hypot(p.x - x, p.y, p.z) - R); };
    // Two of the hero's fibres in the plane of the cut, left and right.
    const s0 = model.sockets[0], spinFlat = Math.atan2(-s0.z, s0.x);

    // A shared spool (for phages whose DNA is not followed) and its geometry.
    const spoolGeo = createPath(new THREE.Group(), spool.points.slice(0, spool.spoolEnd), {});
    const shareSpool = (ph, {glow = 0} = {}) => { const p = pathFromGeometry(ph.upper, {geometry: spoolGeo.geometry, arc: spoolGeo.arc, points: spoolGeo.points}); p.window(0, spool.spoolLength); labelDNA(p.materials, glow); return p; };

    // ---- Cell A, where a phage (the hero) is followed through the lytic cycle ----
    const cellA = createCell(world, {cut: true, seed: 3});
    const heroMats = coatMaterials({cut: true}), hero = createPhage(world, model, {mats: heroMats});
    const heroAt = surfacePoint(-1500, 0), up = normalAt(0);
    // Its DNA: from the spool, down the tail, then into the cell (laid out with the phage contracted and in place).
    orient(hero, heroAt, up, 0, spinFlat); hero.contract(1); hero.group.updateMatrixWorld(true);
    const tipWorld = hero.upper.localToWorld(V(0, -u.tip, 0));
    const inCell = wander(tipWorld, V(0, 1, 0), spool.spoolLength + 400, V(-1500, -3700, 1300), V(2300, 850, 900), 11);
    const toUpper = inCell.map(p => hero.upper.worldToLocal(p.clone()));
    const heroPath = createPath(hero.upper, [...spool.points, ...toUpper.slice(1)], {});
    const channel = length(spool.points) - spool.spoolLength, travel = heroPath.total - spool.spoolLength;
    hero.contract(0);
    // Other phages landing on the top of the cell (the half kept when it is cut open).
    const plainMats = coatMaterials();
    const others = [[-6000, 8, .4], [2400, 12, 1.3], [5600, 4, 2.1], [-3800, 14, 2.9]].map(([x, phi, spin], i) => {
      const ph = createPhage(world, model, {far: true, mats: coatMaterials()}); ph.land = {point: surfacePoint(x, phi * DEG), n: normalAt(phi * DEG), spin, delay: .9 * i}; return ph;
    });
    // DNA copied in the cell, then packed into new phages.
    const copies = [0, 1, 2].map(k => createPath(cellA.group, wander(V(-2500 + 2800 * k, -600 + 500 * k, 1400), V(1, .3, 0), 42000, V(-500 + 1200 * k, 0, 1500), V(4200, 2600, 1000), 21 + k), {}));
    const progeny = Array.from({length: 9}, (_, i) => {
      const ph = createPhage(cellA.group, model, {far: true, mats: plainMats}); shareSpool(ph);
      const x = -8200 + i * 2050 + (r() - .5) * 500, y = (i % 2 ? 1300 : -1500) + (r() - .5) * 900;
      ph.home = V(x, y, 1600 + r() * 800); ph.tilt = (r() - .5) * 1.4 + (i % 2 ? Math.PI : 0); ph.spin = r() * 6.28;
      ph.group.position.copy(ph.home); ph.group.rotation.set(0, ph.spin, ph.tilt); ph.delay = [3, 0, 5, 2, 7, 1, 6, 4, 8][i] * .5;
      return ph;
    });

    // ---- The experiment: a labelled phage, bacteria in a blender, then a centrifuge tube ----
    const freeAt = V(-3500, -2000 - R - GAP - LABEL_LIFT, 0);
    const jarAt = V(0, 2000, 0), blender = createBlender(world, {at: jarAt});
    const tube = createTube(world, {at: jarAt.clone().add(V(0, 0, 0))});
    const glowMats = coatMaterials(); labelCoat(glowMats, 1);
    // Three bacteria (J1 below the labelled phage), each cut open, and the labelled phages that infect them.
    const jarCells = [[V(-2000, -2000, 0), 0], [V(-8000, 16500, 2500), .45], [V(10500, 12500, -1500), -.5]].map(([p, tilt], k) => {
      const c = createCell(world, {at: p, tilt, cut: true, seed: 5 + k}); c.home = p.clone(); c.tilt = tilt;
      c.dna = createPath(c.group, wander(V(-1500 + 1600 * k, -2500, 1300), V(0, 1, 0), 60000, V(0, 0, 1500), V(5500, 2600, 900), 31 + k), {});
      labelDNA(c.dna.materials, 1);
      // Where it settles in the pellet (tube coordinates).
      c.pellet = [[V(0, 35300, 0), 0], [V(-8000, 21000, -3000), .25], [V(8200, 20500, 3000), -.25]][k];
      return c;
    });
    // The labelled phage, in the first bacterium's frame (it lands there).
    const labelMats = coatMaterials({cut: true}), labelled = createPhage(jarCells[0].group, model, {mats: labelMats});
    const labelledPath = createPath(labelled.upper, spool.points.slice(0, spool.spoolEnd), {});
    const coats = [];
    jarCells.forEach((c, k) => {
      const spots = k === 0 ? [[-6200, 6], [2400, 10], [5800, 2], [-3600, -5]] : [[-5200, 4], [-1200, 12], [2600, -4], [6000, 8]];
      spots.forEach(([x, phi], i) => {
        const ph = createPhage(c.group, model, {far: true, mats: glowMats});
        ph.land = {point: surfacePoint(x, phi * DEG), n: normalAt(phi * DEG), spin: r() * 6.28, delay: .25 * i + .3 * k};
        ph.cell = c; ph.drift = V((r() - .5) * 9000, -4000 - r() * 7000, (r() - .5) * 3000); ph.turn = (r() - .5) * 2.4;
        // A fifth of the coats stay on their cells (the ³⁵S in the pellet).
        ph.stays = (k === 1 && i === 2) || (k === 2 && i === 0);
        ph.settle = V((r() - .5) * 30000, -30000 + r() * 34000, (r() - .5) * 14000);
        coats.push(ph);
      });
    });
    // A few phages that never attached (and so keep their DNA: some ³²P in the supernatant).
    const loose = [[V(-17000, -21000, 4000), V(-11000, -24000, 3000)], [V(4000, -27000, 6000), V(1000, -12000, 4000)], [V(15000, -19000, 3000), V(12000, -2000, 2000)]].map(([home, settle], k) => {
      const ph = createPhage(world, model, {far: true, mats: glowMats}); shareSpool(ph, {glow: 1}); ph.home = home.add(jarAt); ph.settle = settle.add(jarAt);
      ph.group.position.copy(ph.home); ph.group.rotation.set(.3 * k, k * 2, .5 - .4 * k); return ph;
    });

    // Meters beside the tube: the supernatant's and the pellet's share of each label, at the height of each fraction.
    const meterX = jarAt.x + 31000, metersAt = {supernatant: jarAt.y - 14000, pellet: jarAt.y + 30000};
    const meters = {};
    for (const [fraction, y] of Object.entries(metersAt)) meters[fraction] = {S35: createMeter(world, {at: V(meterX, y - 4600, 0), color: S35}), P32: createMeter(world, {at: V(meterX, y + 4600, 0), color: P32})};

    // ---- The progeny of an infected cell from the pellet ----
    const cellP = createCell(world, {at: V(118000, 4000, 0), cut: true, seed: 9});
    const cellPDNA = createPath(cellP.group, wander(V(-3000, 0, 1400), V(1, 0, 0), 60000, V(0, 0, 1500), V(6000, 2500, 900), 41), {}); labelDNA(cellPDNA.materials, 1);
    const young = Array.from({length: 8}, (_, i) => {
      const mats = coatMaterials({cut: true}), ph = createPhage(cellP.group, model, {far: true, mats});
      // Three carry stretches of labelled parental DNA among their new DNA.
      const labelledStretch = [1, 4, 6].includes(i);
      // The labelled stretch is the outer shell of the spool, the part a cut head shows most.
      const views = labelledStretch ? [[0, .3], [.3, 1]] : [[0, 1]];
      ph.spools = views.map(([a, b], k) => { const p = pathFromGeometry(ph.upper, {geometry: spoolGeo.geometry, arc: spoolGeo.arc, points: spoolGeo.points}); p.window(a * spool.spoolLength, b * spool.spoolLength); labelDNA(p.materials, labelledStretch && k === 0 ? 1 : 0); p.hot = labelledStretch && k === 0; return p; });
      ph.hot = labelledStretch;
      const x = -7400 + i * 2100 + (r() - .5) * 400, y = (i % 2 ? 1400 : -1400) + (r() - .5) * 700;
      ph.home = V(x, y, 1700 + r() * 600); ph.tilt = (i % 2 ? Math.PI : 0) + (r() - .5) * .9; ph.spin = r() * 6.28;
      ph.group.position.copy(ph.home); ph.group.rotation.set(0, ph.spin, ph.tilt);
      return ph;
    });
    // Meters under it: the progeny's share of each label.
    const progenyMeterAt = cellP.group.position.clone().add(V(-8000, 17000, 0));
    const metersP = {S35: createMeter(world, {at: progenyMeterAt.clone(), length: 15000, thick: 1500, color: S35}),
      P32: createMeter(world, {at: progenyMeterAt.clone().add(V(0, 4200, 0)), length: 15000, thick: 1500, color: P32})};

    // ---- Shots ----
    const heroFree = heroAt.clone().addScaledVector(up, GAP + LIFT);
    at.shot = {
      free: heroFree.clone().add(V(0, -u.headTop / 2 + 350, 0)),
      cell: V(0, -5800, 0),
      entry: heroAt.clone().add(V(0, 500, 0)),
      lytic: V(0, -300, 0),
      label: freeAt.clone().add(V(0, -u.headTop / 2 + 350, 0)),
      jar: jarAt.clone().add(V(0, 7500, 0)),
      tube: jarAt.clone().add(V(0, -2300, 0)),
      // (room above the tube for a phone's step name)
      results: jarAt.clone().add(V(26500, -6300, 0)),
      progeny: cellP.group.position.clone().add(V(0, 7000, 0)),
      close: V(),
    };
    at.results = RESULTS; at.counts = {progeny: progeny.length, coats: coats.length, young: young.length, labelledYoung: young.filter(y => y.hot).length};
    // Sizes (Å): the phage's head and tail (the sheath extended and contracted), and the cell.
    {
      const bb = model.geometry.head.boundingBox, probe = createPhage(new THREE.Group(), model, {far: true}), sheathLength = () => probe.heights.top - u.sheath0 + SHEATH.extended.rise;
      probe.contract(0); const extended = sheathLength(); probe.contract(1); const contracted = sheathLength();
      at.sizes = {head: {length: bb.max.z - bb.min.z, width: Math.max(bb.max.x - bb.min.x, bb.max.y - bb.min.y)}, sheath: {extended, contracted},
        fibres: model.sockets.length, cell: {width: 2 * R, length: 2 * (HALF + R)}, phage: u.headTop};
    }
    // Where things are: each bacterium and each detached coat, as heights in the tube (the pellet lies below PELLET), and
    // how much of the hero's DNA has left its head.
    const PELLET = 15000;
    at.where = () => {
      const y = o => { o.updateMatrixWorld(true); return V().setFromMatrixPosition(o.matrixWorld).y - jarAt.y; };
      return {pellet: PELLET, cells: jarCells.map(c => y(c.group)), coats: coats.map(c => ({y: y(c.group), stays: !!c.stays})), injected: clamp((heroPath.a - 0) / spool.spoolLength)};
    };
    // The objects each step names (world points), for checks that they are on screen and clear of the narration.
    at.named = t => {
      const w = o => { o.updateMatrixWorld(true); return V().setFromMatrixPosition(o.matrixWorld).toArray(); }, p = v => v.toArray();
      if (t < T.attach) return {head: p(hero.at('head')), baseplate: p(hero.at('baseplate'))};
      if (t < T.enter) return {phage: p(hero.at('headTop')), cell: p(cellA.group.position.clone().add(V(0, -R, 0)))};
      if (t < T.lytic) return {tip: p(hero.at('tip')), dna: p(heroPath.point(spool.spoolLength + channel + 900))};
      if (t < T.label) return {cell: w(cellA.group), phage: w(progeny[6].group)};
      if (t < T.blend) return {head: p(labelled.at('head')), tail: p(labelled.at('sheath'))};
      if (t < T.spin) return Object.fromEntries(jarCells.map((c, k) => [`cell${k}`, w(c.group)]));
      if (t < T.results) return {supernatant: p(jarAt.clone().add(V(-9000, -20000, 3000))), pellet: p(jarAt.clone().add(V(0, 30000, 0)))};
      if (t < T.progeny) return {tube: p(jarAt), ...Object.fromEntries(Object.entries(meters).flatMap(([f, m]) => [[`${f}S35`, p(m.S35.tagAt)], [`${f}P32`, p(m.P32.tagAt)]]))};
      if (t < T.dna) return {phage: w(young[FOCUS].group), S35: p(metersP.S35.tagAt), P32: p(metersP.P32.tagAt)};
      return {head: p(young[FOCUS].at('head')), baseplate: p(young[FOCUS].at('baseplate'))};
    };

    const tmp = V();
    // The hero phage and cell A over steps 1–4.
    function heroStage(t, pxPerA) {
      const on = t < T.label + 1.6;
      cellA.group.visible = on; hero.group.visible = on;
      if (!on) { others.forEach(o => { o.group.visible = false; }); return; }
      // Descends and lands (step 2), contracts and injects (step 3).
      const land = smooth(ramp(t, T.attach + 1, T.attach + 6)), lift = LIFT * (1 - land);
      orient(hero, heroAt, up, lift, spinFlat);
      hero.fibres(ramp(t, T.attach + 4, T.attach + 6.6), curved(hero, heroAt));
      hero.contract(ramp(t, T.enter + 2.8, T.enter + 4.6));
      const inject = smooth(ramp(t, T.enter + 5, T.enter + 10.5));
      // Packed into new phages in the lytic cycle.
      const pack = smooth(ramp(t, T.lytic + 5.5, T.lytic + 9.5));
      heroPath.window(inject * travel + pack * spool.spoolLength, spool.spoolLength + inject * travel);
      heroPath.view(pxPerA);
      hero.cut(ramp(t, 1.4, 3.2) * (1 - ramp(t, T.attach, T.attach + 1.4)) + ramp(t, T.enter + .6, T.enter + 2.2));
      // Cell A: cut open as the material enters; bursting open in the lytic cycle.
      cellA.cut(smooth(ramp(t, T.enter + .4, T.enter + 2.6)));
      const burst = ramp(t, T.lytic + 9.4, T.lytic + 13.4);
      cellA.burst(burst); cellA.view(pxPerA);
      // The close shot of the entry draws only what it frames: the cell within a radius of where the tail enters, the
      // hero and its neighbour. The rest goes as the camera moves in, and comes back as it pulls away.
      const close = ramp(t, T.enter - .9, T.enter + .6) * (1 - ramp(t, T.lytic - .3, T.lytic + 1));
      cellA.window(heroAt.x, heroAt.y, close > 0 ? mix(26000, WINDOW, close) : 0);
      // The empty coats on its surface drift off as it bursts, and fade.
      const away = smooth(ramp(t, T.lytic + 10, T.lytic + 14)) * 2600, coatsShown = 1 - ramp(t, T.lytic + 10.4, T.lytic + 12.6);
      for (const m of heroMats.all) fade(m, coatsShown);
      if (away > 0) hero.group.position.addScaledVector(up, away);
      hero.group.visible = coatsShown > .01;
      others.forEach((o, i) => {
        const L = o.land, w = smooth(ramp(t, T.attach + 1.6 + L.delay, T.attach + 6 + L.delay));
        orient(o, L.point, L.n, 4200 * (1 - w) + away, L.spin);
        o.fibres(ramp(t, T.attach + 4.6 + L.delay, T.attach + 7 + L.delay), curved(o, L.point));
        o.contract(ramp(t, T.enter + 3 + .3 * L.delay, T.enter + 4.8 + .3 * L.delay));
        // They join as the camera pulls back from the hero, and leave the close shot of its entry.
        fadeObject(o.group, Math.min(ramp(t, T.attach - .2, T.attach + 1.2), coatsShown, i === NEIGHBOUR ? 1 : 1 - close));
      });
      // Copies of the DNA, then new phages assembled from them, released when the cell bursts.
      copies.forEach((c, k) => { const grow = ramp(t, T.lytic + 1 + .5 * k, T.lytic + 5 + .5 * k); c.window(pack * c.total, grow * c.total); c.show(grow > 0 && pack < 1); c.view(pxPerA); });
      // They go as the camera leaves for the next step.
      const stay = 1 - ramp(t, T.label - .9, T.label - .1);
      progeny.forEach(p => {
        const made = smooth(ramp(t, T.lytic + 5.2 + p.delay, T.lytic + 6.6 + p.delay)), out = smooth(ramp(t, T.lytic + 9.8, T.lytic + 15));
        if (made > .01) fadeObject(p.group, stay); else p.group.visible = false;
        p.group.scale.setScalar(Math.max(.01, made));
        tmp.copy(p.home); tmp.y *= 1 + out * .9; tmp.x *= 1 + out * .3; tmp.y += (p.home.y > 0 ? 1 : -1) * out * 3000;
        p.group.position.copy(tmp); p.group.rotation.z = p.tilt + out * .25;
      });
    }
    // The labelled phage (step 5) and the experiment (steps 5–8).
    function experiment(t, pxPerA) {
      const on = t > T.label - .4 && t < T.progeny + 2;
      labelled.group.visible = on && t > T.label - .2;
      const appear = ramp(t, T.label - .2, T.label + .8);
      labelCoat(labelMats, ramp(t, T.label + 4, T.label + 5.6)); labelDNA(labelledPath.materials, ramp(t, T.label + 2, T.label + 3.6));
      for (const m of labelMats.all) fade(m, appear); labelledPath.materials.forEach(m => fade(m, appear));
      // Lands on the first bacterium, contracts and injects (quickly, at this scale), then its coat is sheared off.
      const land = smooth(ramp(t, T.blend + .6, T.blend + 3.6)), J1 = jarCells[0];
      const lpoint = surfacePoint(-1500, 0);
      orient(labelled, lpoint, V(0, -1, 0), LABEL_LIFT * (1 - land), spinFlat);
      labelled.fibres(ramp(t, T.blend + 2.4, T.blend + 3.6), curved(labelled, lpoint)); labelled.contract(ramp(t, T.blend + 3.6, T.blend + 4.4));
      labelled.cut(1);
      const inject = smooth(ramp(t, T.blend + 4.4, T.blend + 6.4)); labelledPath.window(0, spool.spoolLength * (1 - inject)); labelledPath.view(pxPerA);
      // The coats come off in the blender and drift in the swirl; in the tube they stay in the supernatant.
      const spin = ramp(t, T.blend + 5.4, T.blend + 7), shear = smooth(ramp(t, T.blend + 7, T.blend + 10.5)), settle = smooth(ramp(t, T.spin + 1.4, T.spin + 5));
      const swirl = t < T.spin ? .06 * Math.max(0, t - T.blend - 6) : .06 * (T.spin - T.blend - 6);
      blender.blades.rotation.y = spin * (t - T.blend - 5.4) * 5;
      // The blender shows once the camera has left the labelled phage, and gives way to the tube as the camera moves on;
      // the tube goes as the camera leaves for the progeny.
      const showJar = ramp(t, T.blend + .9, T.blend + 2.4) * (1 - ramp(t, T.spin - .3, T.spin + .6)), showTube = ramp(t, T.spin + .7, T.spin + 1.9) * (1 - ramp(t, T.progeny - 1, T.progeny - .3));
      blender.opacity(on ? showJar : 0); tube.opacity(on ? showTube : 0);
      // The bacteria (far below the labelled phage) join as the camera starts to pull back.
      const cellsOn = on && t > T.blend - 1.2;
      jarCells.forEach((c, k) => {
        c.show(cellsOn); c.dna.show(cellsOn);
        // Swaying a little in the swirl, then down into the pellet.
        const sway = V(Math.sin(swirl * 2 + k * 2) * 2500 * spin, Math.cos(swirl * 1.3 + k) * 1400 * spin, 0);
        c.group.position.copy(c.home).add(sway).lerp(c.pellet[0].clone().add(jarAt), settle);
        c.group.rotation.z = mix(c.tilt + .12 * Math.sin(swirl + k) * spin, c.pellet[1], settle);
        c.cut(1); c.view(pxPerA);
        const grown = ramp(t, T.blend + 4.2, T.blend + 7.5); c.dna.window(0, grown * c.dna.total); c.dna.view(pxPerA);
      });
      coats.forEach(ph => {
        const L = ph.land, w = smooth(ramp(t, T.blend + .8 + L.delay, T.blend + 3.4 + L.delay));
        ph.group.visible = cellsOn;
        if (!cellsOn) return;
        const off = ph.stays ? 0 : shear;
        // On its cell until sheared off; then in the medium (world), drifting to where it settles.
        orient(ph, L.point, L.n, 2400 * (1 - w) + off * 1800, L.spin);
        ph.fibres(ramp(t, T.blend + 2.4 + L.delay, T.blend + 3.8 + L.delay) * (1 - off), curved(ph, L.point));
        ph.contract(ramp(t, T.blend + 3.6 + L.delay, T.blend + 4.6 + L.delay));
        if (off > 0) {
          ph.group.position.addScaledVector(ph.drift, off * (1 - settle));
          ph.group.rotation.z += ph.turn * off;
          if (settle > 0) { ph.cell.group.updateMatrixWorld(true); const home = ph.cell.group.worldToLocal(ph.settle.clone().add(jarAt)); ph.group.position.lerp(home, settle); }
        }
      });
      loose.forEach(ph => { ph.group.visible = cellsOn; ph.group.position.copy(ph.home).lerp(ph.settle, settle).add(V(Math.sin(swirl * 1.7 + ph.home.x) * 2000 * spin * (1 - settle), 0, 0)); });
      // The labelled phage's own coat comes off the first bacterium too.
      if (shear > 0) { labelled.group.position.addScaledVector(V(-.3, -1, 0).normalize(), shear * 7000 * (1 - settle)); labelled.group.rotation.z += .7 * shear; }
      if (settle > 0) { J1.group.updateMatrixWorld(true); labelled.group.position.lerp(J1.group.worldToLocal(jarAt.clone().add(V(-9000, -22000, 5000))), settle); }
      // Meters: ³⁵S first, then ³²P, each filling once; the amounts are named when they are full.
      const metersOn = ramp(t, T.results + .4, T.results + 1.4) * (1 - ramp(t, T.progeny - 1.05, T.progeny - .4));
      const s = ramp(t, T.results + 1.2, T.results + 3.2), p = ramp(t, T.results + 4, T.results + 6);
      for (const [fraction, m] of Object.entries(meters)) { m.S35.set(RESULTS[fraction].S35 * s, metersOn); m.P32.set(RESULTS[fraction].P32 * p, metersOn); }
      at.meters = {S35: s, P32: p, shown: metersOn};
    }
    // The progeny (steps 9–10).
    function progenyStage(t, pxPerA) {
      const on = t > T.results + 8;
      cellP.group.visible = on;
      if (!on) { young.forEach(y => { y.group.visible = false; }); Object.values(metersP).forEach(m => m.set(0, 0)); return; }
      cellP.cut(1); cellP.view(pxPerA);
      // Its DNA, packed into the progeny; then it bursts and they drift out.
      const burst = ramp(t, T.progeny + 2.6, T.progeny + 6.4), out = smooth(ramp(t, T.progeny + 3, T.progeny + 9));
      cellP.burst(burst);
      const packed = ramp(t, T.progeny + .4, T.progeny + 3);
      cellPDNA.window(0, (1 - packed) * cellPDNA.total); cellPDNA.show(packed < 1); cellPDNA.view(pxPerA);
      // In the last step only the phage looked at stays.
      const others = 1 - ramp(t, T.dna - .9, T.dna - .1);
      young.forEach((y, i) => {
        tmp.copy(y.home); tmp.y *= 1 + out * 1.1; tmp.x *= 1 + out * .3; tmp.y += (y.home.y > 0 ? 1 : -1) * out * 3000;
        y.group.position.copy(tmp); y.group.rotation.z = y.tilt + out * .2 * (i % 2 ? 1 : -1);
        y.cut(1); y.spools.forEach(s => s.view(pxPerA));
        fadeObject(y.group, i === FOCUS ? 1 : others);
      });
      // The progeny's meters: ³⁵S (1%: a sliver) and ³²P.
      const shown = ramp(t, T.progeny + 5.6, T.progeny + 6.6) * (1 - ramp(t, T.dna - .9, T.dna - .2));
      metersP.P32.set(RESULTS.progeny.P32 * ramp(t, T.progeny + 6, T.progeny + 7.6), shown); metersP.S35.set(RESULTS.progeny.S35 * ramp(t, T.progeny + 7.2, T.progeny + 8.2), shown);
    }

    return {
      at, hero, labelled, cells: {A: cellA, P: cellP, jar: jarCells}, coats, young, meters, metersP, // for tests (?debug=1)
      update(t, {pxPerA = 1} = {}) {
        heroStage(t, pxPerA); experiment(t, pxPerA); progenyStage(t, pxPerA);
        young[FOCUS].group.updateMatrixWorld(true); at.shot.close.copy(young[FOCUS].at('middle'));
      },
      annotate(t, {label, tag}) {
        const coat = hex(COLOURS.protein), dna = hex(COLOURS.dna);
        if (t > 3 && t < T.attach) {
          label(hero.at('headSide'), 'Protein coat', 'The head, tail and tail fibres', {color: '#b9b0ea', priority: 2});
          label(heroPath.point(spool.spoolLength * .45), 'DNA', 'Inside the head', {color: dna, priority: 2});
          if (t > 5) label(hero.at('sheath'), 'Tail', '', {color: '#b9b0ea'});
          if (t > 6.2) label(hero.at('fibre'), 'Tail fibres', '', {color: '#b9b0ea'});
        } else if (t > T.attach + 3 && t < T.enter) {
          label(surfacePoint(3500, -62 * DEG), 'E. coli', 'A bacterium', {color: hex(CELL.outer)});
          label(hero.at('headTop'), 'Phage T2', 'Attached to the outside surface', {color: '#b9b0ea'});
        } else if (t > T.enter + 6.2 && t < T.lytic) {
          label(heroPath.point(spool.spoolLength + channel + 900), 'Material enters the cell', 'Down the tail, into the cytoplasm', {color: dna, priority: 2});
          if (t > T.enter + 8.5) label(hero.at('headSide'), 'Coat stays outside', 'Its head now empty', {color: '#b9b0ea'});
        } else if (t > T.lytic + 1.5 && t < T.label) {
          if (t < T.lytic + 11) tag(V(-4200, R + 1600, 0), 'About 20 minutes later', {color: '#f3cf97'});
          if (t > T.lytic + 7 && t < T.label - .9) label(progeny[6].group.position.clone().add(V(0, 0, 0)), 'New phages', t > T.lytic + 10.5 ? 'Released as the cell bursts' : 'Assembled in the cell', {color: '#b9b0ea', key: 'new phages'});
        } else if (t > T.label + 3.6 && t < T.blend) {
          label(labelledPath.point(spool.spoolLength * .45), '³²P in DNA', 'Radioactive phosphorus', {color: hex(P32), priority: 2});
          if (t > T.label + 5.6) label(labelled.at('sheath'), '³⁵S in protein', 'Radioactive sulfur', {color: hex(S35), priority: 2});
        } else if (t > T.blend + 4 && t < T.spin) {
          if (t > T.blend + 6) label(jarAt.clone().add(V(22000, 30000, 0)), 'Blender', '', {color: '#cfe3ea'});
          label(jarCells[1].group.position.clone().add(V(-4000, 1500, 0)), 'Infected bacteria', 'Their DNA labelled with ³²P', {color: hex(P32)});
          if (t > T.blend + 8.2) label(coats[1].at('headTop'), 'Coats detached', 'Protein labelled with ³⁵S', {color: hex(S35)});
        } else if (t > T.spin + 4.6 && t < T.results) {
          label(jarAt.clone().add(V(-9000, -20000, 3000)), 'Supernatant', 'The phage coats', {color: hex(S35), priority: 2});
          label(jarAt.clone().add(V(0, 30000, 0)), 'Pellet', 'The bacteria', {color: hex(P32), priority: 2});
        } else if (t > T.results + 1.2 && t < T.progeny && at.meters.shown > .5) {
          // Each fraction's two meters, named; each amount the notes give, once its meter is full.
          const full = k => at.meters[k] > .999;
          tag(meters.supernatant.S35.headAt, 'Supernatant · phage coats', {color: '#cfe3ea'});
          tag(meters.pellet.S35.headAt, 'Pellet · bacteria', {color: '#cfe3ea'});
          tag(meters.supernatant.S35.tagAt, full('S35') ? '³⁵S · 80%' : '³⁵S', {color: hex(S35)});
          tag(meters.pellet.S35.tagAt, '³⁵S', {color: hex(S35)});
          if (t > T.results + 3.6) {
            tag(meters.supernatant.P32.tagAt, '³²P', {color: hex(P32)});
            tag(meters.pellet.P32.tagAt, full('P32') ? '³²P · 70%' : '³²P', {color: hex(P32)});
          }
        } else if (t > T.progeny + 4 && t < T.dna - .9) {
          label(young[5].group.position.clone().applyMatrix4(cellP.group.matrixWorld), 'Progeny phages', 'Released from an infected cell', {color: '#b9b0ea'});
          if (t > T.progeny + 6) {
            tag(metersP.S35.headAt, 'In the progeny', {color: '#cfe3ea'});
            tag(metersP.P32.tagAt, t > T.progeny + 7.6 ? '³²P · 30%' : '³²P', {color: hex(P32)});
            if (t > T.progeny + 7.2) tag(metersP.S35.tagAt, t > T.progeny + 8.2 ? '³⁵S · 1%' : '³⁵S', {color: hex(S35)});
          }
        } else if (t > T.dna + 2.4) {
          const hot = young[FOCUS];
          label(hot.spools[0].point(spool.spoolLength * .16), '³²P DNA', 'From the infecting phage', {color: hex(P32), priority: 2});
          label(hot.at('headSide'), 'New protein coat', 'Without ³⁵S', {color: coat, priority: 2});
        }
      },
    };
  },
});
