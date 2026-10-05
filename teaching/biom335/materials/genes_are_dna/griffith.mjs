// Scene: Griffith's experiment, as the notes tell it, with the viewer asked to predict its key results (the shared
// player's `predict` steps). Streptococcus pneumoniae as lancet-shaped diplococci: S cells in a soft translucent
// capsule, R cells rough and bare. Four injections, one mouse each, in a row as the notes' figure has them (live S,
// live R, heat-killed S, heat-killed S with live R); each mouse's cells float above it, magnified in a drop, and a
// syringe injects them. The mouse that dies lies still on its side; live S cells come from the blood of the last one.
// Then, at the scale of cells: DNA from a dead S cell enters an R cell, which makes a capsule; and DNA isolated from S
// cells, added to R cells, gives each of them one. DNA fragments are ideal B-DNA (dna.mjs), drawn far larger than
// true scale beside the cells.
// Nothing passes behind the page's text: only the station the camera is on is drawn (all four in the view of all
// four). The camera glides from one mouse to the next, the one it leaves fading out as the move begins and the next
// fading in as it arrives; a change of place (the scale of cells to the mice, and back) fades out, cuts and fades in.
// Every shot is a box fitted round what its step shows (boxAround), measured on the scene's own key points.
import * as THREE from 'three';
import {mergeVertices} from 'three/addons/utils/BufferGeometryUtils.js';
import {SimplexNoise} from 'three/addons/math/SimplexNoise.js';
import {runScene} from '../shared/scene_player.mjs';
import {boxAround} from '../shared/camera.mjs';
import {loadSurfaceSet, baseMaterial, fade} from '../shared/molecules.mjs';
import {pairsFromStrands, frameFromPairs, meanLocal, sequencePairs, helixFrames, createDuplex, RISE} from '../shared/dna.mjs';
import {STRANDS, outlineWidth} from '../shared/strands.mjs';
import {ramp, smooth, mix, clamp} from '../shared/ease.mjs';

const V = (...a) => new THREE.Vector3(...a);
const hex = c => '#' + c.toString(16).padStart(6, '0');
const T = {cells: 0, liveS: 11, liveR: 21, heat: 30, heatResult: 41, mix: 47, mixResult: 56, principle: 70, dna: 82, dnaResult: 91, end: 105};
// Colours: live cells warm sand, dead cells grey, the capsule a pale cyan coat; the mice a warm pale grey.
const LIVE = 0xd8c28a, DEAD = 0x8f8b85, COAT = 0xb8e2ee, HEAT = 0xff9a52, FUR = 0xcdc7bd, FUR_DEAD = 0xa39e97, PINK = 0xc99b95;
const GLASS = 0xa9c6d3, BLOOD = 0xe3949f, DIES = '#ffb0a0', LIVES = '#8fe3b5', GREY = '#aaa69f', DNA_TAG = hex(STRANDS.template);

// The stations, left to right (world units; −y is up): a mouse on the ground, its drop of cells above it.
const X = [-78, -26, 26, 78], GROUND = 12, MZ = 3, DROP = {dy: -28, dx: 7, r: 10};
const BLOOD_AT = V(X[3] + 33, -3, 0), BLOOD_R = 7.5;
// The scale of cells, above the stations: one unit here is an ångström, drawn at S world units.
const STAGE = V(0, -190, 0), S = .05;
// A diplococcus (Å): two lancet-shaped cocci end to end, broad at the division and pointed at the tips; its capsule.
const HALF = 140, WIDTH = 58, COAT_T = 32;

const NOTES = 'evidence-for-dna-as-the-genetic-material-of-bacteria';
const steps = [
  {t: T.cells, nav: 'Smooth and rough cells', title: 'Smooth cells<br>and rough cells.', notes: NOTES, hold: 1.05,
    text: 'In 1928, Frederick Griffith studied Streptococcus pneumoniae, which kills mice by causing pneumonia. Its virulence is determined by the capsular polysaccharide on its surface: S cells (smooth) evade destruction by the mouse’s immune system and are virulent; R cells (rough) are avirulent.'},
  {t: T.liveS, nav: 'Live S cells', title: 'Live S cells<br>kill the mouse.', notes: NOTES,
    text: 'Injected into a mouse, living S cells evade its immune system and cause pneumonia. The mouse dies.'},
  {t: T.liveR, nav: 'Live R cells', title: 'Live R cells<br>do not.', notes: NOTES,
    text: 'Living R cells are avirulent: injected into a mouse, they do not kill it. The mouse lives.'},
  {t: T.heat, nav: 'Heat-killed S cells', title: 'S cells<br>killed by heat.', notes: NOTES,
    text: 'Griffith killed S cells by heat treatment, then injected the dead cells into a mouse.',
    predict: {id: 'heat-killed', question: 'What happens to the mouse?', choices: [{text: 'It lives', correct: true}, {text: 'It dies', correct: false}]}},
  {t: T.heatResult, nav: 'The mouse lives', title: 'Dead S cells<br>do no harm.', notes: NOTES,
    text: 'Killed by heat, the S cells were no longer able to harm the mouse. It lives.'},
  {t: T.mix, nav: 'Heat-killed S with live R', title: 'Dead S cells<br>with live R cells.', notes: NOTES, hold: 1.05,
    text: 'He then mixed dead, heat-killed S cells with living R cells, and injected them into a mouse together. Neither kills a mouse on its own.',
    predict: {id: 'mixed', question: 'What happens to the mouse?', choices: [{text: 'It lives', correct: false}, {text: 'It dies', correct: true}]}},
  {t: T.mixResult, nav: 'The mouse dies', title: 'Together,<br>they kill.', notes: NOTES, hold: 1.05,
    text: 'The mouse died from a pneumonia infection, and live S cells could be isolated from its blood. Neither heat-killed S cells nor live R cells kill a mouse, but injected together they kill it as live S cells do.'},
  {t: T.principle, nav: 'The transforming principle', title: 'R cells are<br>transformed into S.', notes: NOTES, hold: 1.05,
    text: 'Some property of the dead S cells could transform the live R cells into S cells. This was known as the transforming principle, and showed that genetic material could be transferred from one bacterial strain to another.'},
  {t: T.dna, nav: 'DNA from S cells', title: 'DNA from S cells,<br>added to R cells.', notes: NOTES,
    text: 'Then DNA was isolated from S cells and added to live R cells, and their cell surface was inspected.',
    predict: {id: 'dna', question: 'What will the R cells’ surface look like?', choices: [{text: 'Rough, as before', correct: false}, {text: 'Smooth, with a capsule', correct: true}]}},
  {t: T.dnaResult, nav: 'R cells become S', title: 'DNA transforms<br>R cells into S.', notes: NOTES, hold: 1.05,
    text: 'The R cells now had the smooth capsule of S cells: the DNA of S cells can transform R cells into the same S type. DNA is the carrier of the genetic information.'},
];

// The four injections: what each drop holds, its names (in the step, and in the view of all four), and the outcome.
const TRIALS = [
  {start: T.liveS, inject: T.liveS + 1.7, cells: 'liveS', tag: 'Live S cells', short: 'Live S', dies: true, outcome: T.liveS + 6.6, sub: 'Of pneumonia'},
  {start: T.liveR, inject: T.liveR + 1.9, cells: 'liveR', tag: 'Live R cells', short: 'Live R', dies: false, outcome: T.liveR + 6.5, sub: 'R cells are avirulent'},
  {start: T.heat, inject: T.heat + 5, cells: 'heatS', tag: 'Heat-killed S cells', short: 'Heat-killed S', dies: false, outcome: T.heatResult + .4, sub: 'Dead S cells do no harm'},
  {start: T.mix, inject: T.mix + 2, cells: 'mix', tag: 'Heat-killed S + live R', short: 'Heat-killed S + live R', dies: true, outcome: T.mixResult + .3, sub: 'Of pneumonia'},
];
const HEATING = [T.heat + 1.9, T.heat + 4.6];          // the heat treatment, in the third drop
const BLOOD_IN = [T.mixResult + 3.6, T.mixResult + 4.8];  // live S cells from the last mouse's blood
const OVERVIEW = T.mixResult + 8.4;                     // all four injections in view

// What is drawn when. The camera cuts (behind a fade) where the place changes, and glides between the mice (PAN s,
// beginning a third of the way before each step, as the player's blends do; with reduced motion the player's blends
// last at most 1.2 s, so they begin later and the station leaving fades faster).
const CUT = .55, OUT = .5, IN = .7, PAN = 2.4, leadOf = b => b * .35;
const ARRIVE = TRIALS.map((tr, i) => i ? tr.start - leadOf(PAN) + PAN : tr.start + CUT);  // the camera is on station i
const leave = (i, calm) => TRIALS[i + 1].start - leadOf(calm ? Math.min(PAN, 1.2) : PAN);  // it moves on to the next
const LEAVE = [0, 1, 2].map(i => leave(i, false));
const ALL_IN = OVERVIEW - leadOf(2.8) + 2.8, GONE = T.principle, B0 = T.principle + 1.2;  // B0: the principle's clock
let calmNow = false;  // reduced motion, as the last update() had it (annotate() and the reading pauses' dry runs follow)
// Station i: in as the camera arrives, out as it leaves; all four again in the view of all four; gone at the principle.
function stationShown(i, t) {
  const inn = i ? ramp(t, ARRIVE[i] - IN, ARRIVE[i] + .1) : ramp(t, ARRIVE[0], ARRIVE[0] + IN), go = i < 3 ? leave(i, calmNow) : 0;
  const own = inn * (i < 3 ? 1 - ramp(t, go, go + (calmNow ? OUT / 2 : OUT)) : 1), all = i < 3 ? ramp(t, ALL_IN - IN, ALL_IN + .1) : 0;
  return Math.max(own, all) * (1 - ramp(t, GONE, GONE + OUT));
}
const benchShown = t => ramp(t, ARRIVE[0], ARRIVE[0] + IN) * (1 - ramp(t, GONE, GONE + OUT));

// ---------- Materials ----------
// A soft translucent coat (the capsule; the glass of a drop or syringe): faint over its face, brighter at its rim.
function coatMaterial(color, {fill = .1, edge = .75} = {}) {
  const m = new THREE.ShaderMaterial({
    uniforms: {uColor: {value: new THREE.Color(color)}, uOpacity: {value: 1}, uFill: {value: fill}, uEdge: {value: edge}},
    vertexShader: 'varying vec3 vN; varying vec3 vV; void main() { vec4 mv = modelViewMatrix * vec4(position, 1.); vN = normalize(normalMatrix * normal); vV = -mv.xyz; gl_Position = projectionMatrix * mv; }',
    fragmentShader: 'uniform vec3 uColor; uniform float uOpacity, uFill, uEdge; varying vec3 vN; varying vec3 vV; void main() { float f = clamp(1. - abs(dot(normalize(vN), normalize(vV))), 0., 1.); gl_FragColor = vec4(uColor * (.55 + .7 * f), clamp((uFill + uEdge * pow(f, 2.2)) * uOpacity, 0., 1.)); }',
    transparent: true, depthWrite: false,
  });
  m.userData.noAO = true;
  return m;
}
// A soft round shadow on the ground.
let shadowTexture = null;
function shadowMap() {
  if (shadowTexture) return shadowTexture;
  const c = document.createElement('canvas'); c.width = c.height = 128; const g = c.getContext('2d'), r = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  r.addColorStop(0, '#fff'); r.addColorStop(.55, '#ffffff99'); r.addColorStop(1, '#fff0'); g.fillStyle = r; g.fillRect(0, 0, 128, 128);
  shadowTexture = new THREE.CanvasTexture(c); return shadowTexture;
}
function createShadow(parent, at, sx, sz, opacity = .5, color = 0x000000) {
  const m = new THREE.MeshBasicMaterial({color, alphaMap: shadowMap(), transparent: true, opacity, depthWrite: false}); m.userData.noAO = true;
  const mesh = new THREE.Mesh(new THREE.CircleGeometry(1, 48), m); mesh.rotation.x = Math.PI / 2; mesh.scale.set(sx, sz, 1); mesh.position.copy(at); mesh.renderOrder = -2;
  parent.add(mesh); return {mesh, material: m, base: opacity};
}

// ---------- Cells ----------
// Geometry (Å), built once: the diplococcus smooth (S) and rough (R), and its capsule, each with its long axis along x.
function lathe(profile, segments) {
  const g = new THREE.LatheGeometry(profile, segments); g.deleteAttribute('uv'); g.deleteAttribute('normal');
  const merged = mergeVertices(g); merged.rotateZ(Math.PI / 2); return merged;
}
function cellGeometry() {
  const n = 64, body = [], coat = [];
  // Each coccus is broadest a little way from the division and tapers to a point; a shallow groove marks the division.
  const r = y => { const u = Math.min(1, Math.abs(y) / HALF); return WIDTH * Math.pow(Math.max(0, Math.sin(Math.PI * (.36 + .64 * u))), 1.12) * (1 - .2 * Math.exp(-((u / .06) ** 2))); };
  for (let i = 0; i <= n; i++) { const y = -HALF + 2 * HALF * i / n; body.push(new THREE.Vector2(Math.max(r(y), .01), y)); }
  // The capsule: the body's outline grown by COAT_T (a round brush along it), then smoothed, so it wraps the pair whole.
  const end = HALF + COAT_T, raw = [];
  for (let i = 0; i <= n; i++) {
    const y = -end + 2 * end * i / n; let best = 0;
    for (let k = 0; k <= 200; k++) { const yb = -HALF + 2 * HALF * k / 200, d = Math.abs(y - yb); if (d < COAT_T) best = Math.max(best, r(yb) + Math.sqrt(COAT_T * COAT_T - d * d)); }
    raw.push(best);
  }
  for (let i = 0; i <= n; i++) { const w = [-3, -2, -1, 0, 1, 2, 3].map(d => raw[Math.max(0, Math.min(n, i + d))]); const y = -end + 2 * end * i / n; coat.push(new THREE.Vector2(i === 0 || i === n ? .01 : Math.max(.01, w.reduce((a, b) => a + b) / 7), y)); }
  const smoothBody = lathe(body, 48); smoothBody.computeVertexNormals();
  // R cells: the same shape, its surface roughened (a little simplex noise along the normals).
  const rough = lathe(body, 64), noise = new SimplexNoise({random: seeded(7)}), p = rough.attributes.position, v = V();
  rough.computeVertexNormals(); const nrm = rough.attributes.normal;
  for (let i = 0; i < p.count; i++) {
    v.fromBufferAttribute(p, i); const k = 4.2 * noise.noise3d(v.x / 17, v.y / 17, v.z / 17) + 2 * noise.noise3d(v.x / 7, v.y / 7, v.z / 7);
    const edge = Math.min(1, Math.abs(Math.abs(v.x) - HALF) / 20);  // the pointed tips stay whole
    p.setXYZ(i, v.x + nrm.getX(i) * k * edge, v.y + nrm.getY(i) * k * edge, v.z + nrm.getZ(i) * k * edge);
  }
  rough.computeVertexNormals();
  const capsule = lathe(coat, 48); capsule.computeVertexNormals();
  return {smooth: smoothBody, rough, capsule, coatRadius: Math.max(...coat.map(q => q.x)), bodyRadius: Math.max(...body.map(q => q.x))};
}
function seeded(seed) { let s = seed >>> 0; return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; }

let CELL = null;
// A cell at `at` in `parent` (drawn at `scale` world units per Å): its body (live or dead) and its capsule (0–1).
function createCell(parent, {at, scale, rough = false, tilt = 0, phase = 0, rate = 1}) {
  const holder = new THREE.Group(), spin = new THREE.Group(); holder.position.copy(at); holder.scale.setScalar(scale); holder.add(spin); parent.add(holder);
  const bodyMaterial = baseMaterial(LIVE, {roughness: .58, emissive: LIVE, emissiveIntensity: .1});
  const body = new THREE.Mesh(rough ? CELL.rough : CELL.smooth, bodyMaterial);
  const coatMaterialOf = coatMaterial(COAT, {fill: .12, edge: .8}), coat = new THREE.Mesh(CELL.capsule, coatMaterialOf); coat.renderOrder = 2;
  spin.add(body, coat);
  const colour = new THREE.Color(), live = new THREE.Color(LIVE), dead = new THREE.Color(DEAD), heat = new THREE.Color(HEAT), coatLive = new THREE.Color(COAT), coatDead = new THREE.Color(0xb3bcc0);
  let shown = -1, coated = false;
  const cell = {holder, spin, rough, opacity: 1,
    // capsule 0–1, death 0–1 (live to dead), heat 0–1 (a warm glow), opacity 0–1; t turns it slowly (not when calm).
    set({capsule = 0, death = 0, heat: h = 0, opacity = 1, t = 0, calm = false}) {
      colour.copy(live).lerp(dead, death); bodyMaterial.color.copy(colour);
      bodyMaterial.emissive.copy(colour).lerp(heat, h); bodyMaterial.emissiveIntensity = .1 + .55 * h;
      if (opacity !== shown) { fade(bodyMaterial, opacity); shown = opacity; }
      holder.visible = body.visible = opacity > .01; cell.opacity = opacity;
      const a = smooth(capsule) * opacity * (1 - .5 * death);
      coatMaterialOf.uniforms.uOpacity.value = a; coatMaterialOf.uniforms.uColor.value.copy(coatLive).lerp(coatDead, death); coat.visible = coated = a > .01;
      coat.scale.setScalar(mix(.9, 1, smooth(capsule)));
      const w = calm ? 0 : t * rate;
      spin.rotation.set(phase + w * .35, .12 * Math.sin(phase + w * .21), tilt + .1 * Math.sin(phase * 2 + w * .17));
    },
    // Points round its outline (world), its capsule's if it has one: for fitting shots, and for tests.
    outline() {
      spin.updateWorldMatrix(true, false);
      const L = coated ? HALF + COAT_T : HALF, R = coated ? CELL.coatRadius : CELL.bodyRadius;
      return [[L, 0, 0], [-L, 0, 0], [0, R, 0], [0, -R, 0], [0, 0, R], [0, 0, -R], [L * .55, R * .8, 0], [L * .55, -R * .8, 0], [-L * .55, R * .8, 0], [-L * .55, -R * .8, 0]]
        .map(p => spin.localToWorld(V(...p)).toArray());
    },
    // The world point just inside the top of its capsule (or of its body, bare): where a label points.
    top(coatOn = true) { holder.updateWorldMatrix(true, false); const s = holder.getWorldScale(V()).x; return holder.getWorldPosition(V()).add(V(0, -(coatOn ? CELL.coatRadius * .86 : CELL.bodyRadius * .8) * s, 0)); },
    centre() { return holder.getWorldPosition(V()); },
  };
  return cell;
}

// ---------- The mouse ----------
// A smooth stylised mouse (world units, nose along +x, −y up, its left side to the camera): body and head one surface
// of revolution, bent (the head lowered, the back arched); ears, eyes, nose and feet; a tapering tail along the ground.
const MOUSE = [[-13, 0], [-12.6, 2], [-11.7, 3.5], [-10.3, 4.6], [-8, 5.4], [-5, 5.8], [-2, 5.6], [1, 5], [3.4, 4.2], [5.2, 3.7], [6.8, 3.55], [8.4, 3.25], [9.9, 2.6], [11.3, 1.75], [12.5, .9], [13.2, .35], [13.5, 0]];
const AXIS = -5.6, droop = x => .032 * Math.max(0, x - 2) ** 2;
// The body's radius at x along it (the profile's straight-line reading, near enough for its outline).
const radiusAt = x => { for (let i = 1; i < MOUSE.length; i++) if (x <= MOUSE[i][0]) { const [a, ra] = MOUSE[i - 1], [b, rb] = MOUSE[i]; return mix(ra, rb, (x - a) / (b - a)); } return 0; };
function mouseGeometry() {
  const curve = new THREE.CatmullRomCurve3(MOUSE.map(([x, r]) => V(x, r, 0))), pts = curve.getPoints(72).map(p => new THREE.Vector2(Math.max(.01, p.y), p.x));
  pts[0].x = pts[pts.length - 1].x = .01;
  const g = new THREE.LatheGeometry(pts, 48); g.deleteAttribute('uv'); g.deleteAttribute('normal');
  const m = mergeVertices(g); m.rotateZ(-Math.PI / 2);
  const p = m.attributes.position;
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i); let y = p.getY(i), z = p.getZ(i) * .9;
    if (y > 0) y *= .86;
    y -= 1.1 * Math.exp(-(((x + 4) / 6.5) ** 2)) * Math.max(0, -y) / 5.8;
    y += droop(x);
    p.setXYZ(i, x, y, z);
  }
  m.computeVertexNormals();
  return m;
}
let MOUSE_GEO = null;
const sphere = new THREE.SphereGeometry(1, 28, 18), stick = new THREE.CylinderGeometry(1, 1, 1, 14);
function createMouse(parent, at) {
  const group = new THREE.Group(); group.position.copy(at); parent.add(group);
  const torso = new THREE.Group(); torso.position.y = AXIS; group.add(torso);
  const fur = baseMaterial(FUR, {roughness: .82, emissive: FUR, emissiveIntensity: .015}), pink = baseMaterial(PINK, {roughness: .7}), eye = baseMaterial(0x16171b, {roughness: .22, envMapIntensity: .9});
  const body = new THREE.Mesh(MOUSE_GEO, fur); torso.add(body);
  const part = (geo, mat, pos, scale, rot = [0, 0, 0]) => { const o = new THREE.Mesh(geo, mat); o.position.set(...pos); o.scale.set(...scale); o.rotation.set(...rot); torso.add(o); return o; };
  const eyes = [1, -1].map(s => part(sphere, eye, [9.35, droop(9.35) - .95, s * 2.28], [.46, .46, .46]));
  for (const s of [1, -1]) {
    part(sphere, fur, [6.0, -3.35, s * 2.05], [.42, 2.15, 1.85], [s * .28, s * -.62, 0]);
    part(sphere, pink, [6.25, -3.4, s * 2.0], [.2, 1.55, 1.3], [s * .28, s * -.62, 0]);
  }
  part(sphere, pink, [13.3, droop(13.3), 0], [.44, .4, .44]);
  // Legs and feet (the ground is −AXIS below the body's axis).
  // Each leg hangs from the body to its foot; when the mouse lies on its side they reach out stiffly, splayed.
  const legs = [];
  const leg = (x, z, r, top, splay) => {
    const g = new THREE.Group(); g.position.set(x, top, z); torso.add(g);
    const shaft = new THREE.Mesh(stick, fur), foot = new THREE.Mesh(sphere, pink); foot.scale.set(1.25, .38, .72); g.add(shaft, foot);
    legs.push({g, shaft, foot, r, length: -AXIS - .35 - top, splay});
  };
  for (const s of [1, -1]) { leg(7.2, s * 1.9, .55, 3, -.55); leg(-7.6, s * 3.1, .8, 4.2, .5); }
  const poseLegs = d => { for (const L of legs) { const len = L.length + 1.6 * d; L.g.rotation.z = L.splay * d; L.shaft.position.y = len / 2; L.shaft.scale.set(L.r, len, L.r); L.foot.position.set(.45, len, 0); } };
  // The tail: a tapering tube from the rump along the ground, rebuilt as the body rolls.
  const ground = [V(-17, -.55, -.6), V(-21, -.45, -2.8), V(-23.4, -.36, -6.2), V(-23.9, -.26, -9.6)];
  let tail = null, tailFor = null;
  const buildTail = () => {
    torso.updateMatrix(); const base = V(-12.1, .9, 0).applyMatrix4(torso.matrix), next = base.clone().lerp(ground[0], .5); next.y = Math.min(next.y, -1.2);
    const path = new THREE.CatmullRomCurve3([base, next, ...ground]), n = 40, g = new THREE.TubeGeometry(path, n, 1, 8, false), pos = g.attributes.position, nor = g.attributes.normal, c = V();
    for (let i = 0; i <= n; i++) { path.getPointAt(i / n, c); const r = .62 * (1 - .82 * i / n); for (let j = 0; j <= 8; j++) { const k = i * 9 + j; pos.setXYZ(k, c.x + nor.getX(k) * r, c.y + nor.getY(k) * r, c.z + nor.getZ(k) * r); } }
    if (tail) { tail.geometry.dispose(); tail.geometry = g; } else { tail = new THREE.Mesh(g, pink); group.add(tail); }
  };
  const shadow = createShadow(parent, V(at.x - 2, at.y - .04, at.z - 1), 17, 8.5, .55);
  const materials = [fur, pink, eye], furLive = new THREE.Color(FUR), furDead = new THREE.Color(FUR_DEAD), pinkLive = new THREE.Color(PINK);
  let shown = -1;
  const mouse = {group, torso, eyes, opacity: 1,
    // death 0–1: it rolls onto its side, still, its eyes closed; breath: a gentle rise and fall while it lives.
    set({death = 0, opacity = 1, t = 0, calm = false}) {
      const d = smooth(death);
      torso.rotation.x = -Math.PI / 2 * d; torso.rotation.z = -.05 * d; torso.position.y = mix(AXIS, -5.3, d); poseLegs(d);
      const breath = calm ? 0 : .022 * Math.sin(t * 2 * Math.PI / 1.25) * (1 - d);
      torso.scale.set(1, 1 + breath, 1 + breath * .8);
      for (const e of eyes) e.scale.y = mix(.46, .07, clamp(d * 1.6));
      fur.color.copy(furLive).lerp(furDead, d); fur.emissive.copy(fur.color); pink.color.copy(pinkLive); shadow.mesh.scale.y = 8.5 * mix(1, 1.25, d);
      const key = Math.round(d * 200);
      if (key !== tailFor) { tailFor = key; buildTail(); }
      if (opacity !== shown) { shown = opacity; for (const m of materials) fade(m, opacity); shadow.material.opacity = shadow.base * opacity; }
      group.visible = shadow.mesh.visible = opacity > .01; mouse.opacity = opacity;
    },
    // Points round its outline (world): along its back, belly and flanks, its ears, feet and tail.
    outline() {
      group.updateWorldMatrix(true, true);
      const out = [], at = (o, x, y, z) => out.push(o.localToWorld(V(x, y, z)).toArray());
      for (const x of [-13, -10.5, -7, -3, 1, 5, 8.5, 11.5, 13.5]) {
        const r = radiusAt(x), d = droop(x), top = -r - 1.1 * Math.exp(-(((x + 4) / 6.5) ** 2)) * r / 5.8 + d;
        at(torso, x, top, 0); at(torso, x, .86 * r + d, 0); at(torso, x, d, .9 * r); at(torso, x, d, -.9 * r);
      }
      for (const s of [1, -1]) at(torso, 6, -5.5, s * 2.05);
      for (const L of legs) out.push(L.foot.getWorldPosition(V()).toArray());
      for (const p of ground) at(group, p.x, p.y, p.z);
      return out;
    },
    // Where its outcome is named: above its back.
    back() { return group.position.clone().add(V(-1, AXIS - 7.5 + 1.8 * smooth(clamp((torso.position.y - AXIS) / (-5.3 - AXIS))), 0)); },
    // The point on its flank a syringe reaches.
    flank() { return group.position.clone().add(V(-2.5, AXIS - .6, -4.9)); },
  };
  mouse.set({});
  return mouse;
}

// ---------- A drop of cells, magnified, and the syringe ----------
function createDrop(parent, centre, radius, tint) {
  const group = new THREE.Group(); group.position.copy(centre); parent.add(group);
  const material = coatMaterial(tint, {fill: .05, edge: .55}), shell = new THREE.Mesh(new THREE.SphereGeometry(radius, 48, 32), material); shell.renderOrder = 3; group.add(shell);
  const base = new THREE.Color(tint), warm = new THREE.Color(HEAT);
  const drop = {group, radius, cells: [], opacity: 1,
    set({opacity = 1, heat = 0}) { material.uniforms.uOpacity.value = drop.opacity = opacity; material.uniforms.uColor.value.copy(base).lerp(warm, .7 * heat); material.uniforms.uFill.value = .05 + .07 * heat; shell.visible = opacity > .01; },
    top: () => group.position.clone().add(V(0, -radius - 1, 0)),
    // Points round its rim (world), on three great circles.
    outline() {
      const c = group.position, out = [];
      for (let k = 0; k < 8; k++) { const a = k * Math.PI / 4, u = Math.cos(a) * radius, v = Math.sin(a) * radius; out.push([c.x + u, c.y + v, c.z], [c.x, c.y + u, c.z + v], [c.x + u, c.y, c.z + v]); }
      return out;
    },
  };
  return drop;
}
// Cells in a drop: positions (world, from the drop's centre), each a live S, live R or dead S cell.
const IN_DROP = [V(-3.6, -2.6, .8), V(3.4, -3.3, -.6), V(-2.6, 3.3, -.4), V(3.7, 2.7, .7)];
const DROP_CELLS = {liveS: ['S', 'S', 'S', 'S'], liveR: ['R', 'R', 'R', 'R'], heatS: ['S', 'S', 'S', 'S'], mix: ['dead', 'R', 'R', 'dead'], blood: ['S', 'S', 'S']};

function createSyringe(parent, liquid) {
  const group = new THREE.Group(); parent.add(group);
  const metal = baseMaterial(0xc9d1d7, {metalness: .7, roughness: .26, envMapIntensity: 1.1}), plastic = baseMaterial(0xe3e9ec, {roughness: .45}), dark = baseMaterial(0x3b434b, {roughness: .5});
  const fluid = baseMaterial(liquid, {roughness: .35, emissive: liquid, emissiveIntensity: .12}), glass = coatMaterial(0xdcebf1, {fill: .1, edge: .7});
  const piece = (geo, mat, y, sx, sy, sz = sx) => { const o = new THREE.Mesh(geo, mat); o.position.y = y; o.scale.set(sx, sy, sz); group.add(o); return o; };
  const cyl = new THREE.CylinderGeometry(1, 1, 1, 28), cone = new THREE.CylinderGeometry(.5, 1, 1, 24);
  piece(cyl, metal, 3.25, .15, 6.5);
  piece(cone, plastic, 7.2, 1.05, 1.4);
  const barrel = new THREE.Mesh(new THREE.CylinderGeometry(2.1, 2.1, 15, 36, 1, true), glass); barrel.position.y = 15.4; barrel.renderOrder = 4; group.add(barrel);
  piece(cyl, plastic, 23.05, 2.9, .4);
  const fill = piece(cyl, fluid, 0, 1.88, 1), seal = piece(cyl, dark, 0, 1.94, .9), rod = piece(cyl, plastic, 0, .5, 1), thumb = piece(cyl, plastic, 0, 2.1, .4);
  const solids = [metal, plastic, dark, fluid], q = new THREE.Quaternion();
  let shown = -1;
  const syringe = {group, opacity: 0,
    // The needle's tip at `tip`, pointing from `dir` (a unit vector, tip to plunger); push 0–1 empties it.
    set({tip, dir, push = 0, opacity = 1}) {
      group.position.copy(tip); group.quaternion.copy(q.setFromUnitVectors(V(0, 1, 0), dir));
      const top = mix(20.6, 9.2, push);
      fill.position.y = (8.1 + top) / 2; fill.scale.y = Math.max(.01, top - 8.1); seal.position.y = top + .45;
      rod.position.y = top + .9 + 7.5; rod.scale.y = 15; thumb.position.y = top + 16.6;
      if (opacity !== shown) { shown = opacity; for (const m of solids) fade(m, opacity); glass.uniforms.uOpacity.value = opacity; }
      group.visible = opacity > .01; syringe.opacity = opacity;
    },
    // Its tip, the barrel's flange and the plunger's thumb rest (world).
    outline() {
      group.updateWorldMatrix(true, false);
      const y = thumb.position.y;
      return [[0, 0, 0], [0, 7.2, 0], [2.9, 23.05, 0], [-2.9, 23.05, 0], [0, 23.05, 2.9], [0, 23.05, -2.9], [2.1, y, 0], [-2.1, y, 0], [0, y, 2.1], [0, y, -2.1]]
        .map(p => group.localToWorld(V(...p)).toArray());
    },
  };
  return syringe;
}

// ---------- DNA fragments ----------
// A short ideal B-DNA duplex at the scale of cells (in the stage, one unit an ångström), posed once along its own x
// axis at DNA_K times the cells' scale, then moved and turned as a whole; view() keeps its strands visible as the
// film's are.
const DNA_K = 2.2;
function createFragment(parent, local, n, seed) {
  const pivot = new THREE.Group(); pivot.scale.setScalar(DNA_K); parent.add(pivot);
  const rnd = seeded(seed), seq = Array.from({length: n}, () => 'ACGT'[Math.floor(rnd() * 4)]).join('');
  const d = createDuplex({pairs: sequencePairs(seq, local), widths: [1.1, .85], samples: 3}); pivot.add(d.group);
  d.pose(helixFrames(n, {origin: V(-(n - 1) * RISE / 2, 0, 0), direction: V(1, 0, 0), reference: V(0, 1, 0)}));
  d.opacity(0);
  let shown = 0;
  const half = (n - 1) * RISE / 2;
  const fragment = {pivot, d, length: 2 * half, spin: rnd() * 6, axis: V(rnd() - .5, rnd() - .5, rnd() - .5).normalize(), shown: 0,
    opacity(v) { v = clamp(v); if (v === shown) return; shown = fragment.shown = v; d.opacity(v); pivot.visible = v > .01; },
    view(pxPerA) { const k = S * DNA_K; d.view(pxPerA * k); for (const tb of d.strands) tb.outline.width = outlineWidth(pxPerA * k) * k; },
    world() { return STAGE.clone().addScaledVector(pivot.position, S); },
    // Its two ends and middle, a helix's radius out (world).
    outline() {
      pivot.updateWorldMatrix(true, false);
      return [[-half, 10, 0], [-half, -10, 0], [0, 10, 0], [0, -10, 0], [half, 10, 0], [half, -10, 0], [0, 0, 10], [0, 0, -10]].map(p => pivot.localToWorld(V(...p)).toArray());
    },
  };
  return fragment;
}

const at = {};  // positions and states the tests read (world coordinates)
// Each shot's box, fitted in build() round what its step shows.
const framed = name => (t, content) => content.frames[name];
const STATION_DIR = [.02, -.3, -1], STAGE_DIR = [.04, -.14, -1];

runScene({
  pageTitle: 'Griffith’s experiment · Genes are DNA', eyebrow: 'Transformation',
  links: [{href: 'index.html', text: 'All scenes'}],
  steps, duration: T.end, notesPage: 'notes.html', fov: 28, fog: .00005, loop: false,
  shots: [
    {t: T.cells, frame: framed('cells')},
    {t: ARRIVE[0], blend: 0, frame: framed('station0')},
    {t: T.liveR, blend: PAN, frame: framed('station1')},
    {t: T.heat, blend: PAN, frame: framed('station2')},
    {t: T.mix, blend: PAN, frame: framed('station3')},
    // Then the blood drop beside the last mouse, and all four injections at once.
    {t: T.mixResult + 3.4, blend: 2, frame: framed('blood')},
    {t: OVERVIEW, blend: 2.8, frame: framed('all')},
    {t: T.principle + CUT, blend: 0, frame: framed('principle')},
    // The same view shows the R cells before and after (the capsules they make fit it too).
    {t: T.dna, blend: 1.6, frame: framed('dna')},
  ],
  async build({world, progress}) {
    // Ideal B-DNA: the mean base-pair geometry of the B-DNA crystal structure (355D).
    const set = await loadSurfaceSet('assets/helix.json', 'assets/helix.bin', progress);
    const strand = n => set.meta.strands.find(s => s.name === n);
    const crystal = pairsFromStrands(strand('a'), strand('b')); frameFromPairs(crystal);
    const local = meanLocal(crystal.slice(1, -1));
    CELL = cellGeometry(); MOUSE_GEO = mouseGeometry();

    // The ground under the stations: a faint bench, darker than the night round it.
    const bench = createShadow(world, V(8, GROUND + .02, MZ + 6), 190, 46, .3, 0x1c2a36);

    // The stations: mice, drops (their cells inside), syringes; and the drop of blood.
    const mice = X.map(x => createMouse(world, V(x + 2, GROUND, MZ)));
    const drops = X.map(x => createDrop(world, V(x + DROP.dx, DROP.dy, 0), DROP.r, GLASS));
    const cellsIn = (drop, kinds, seed) => { const rnd = seeded(seed); return kinds.map((k, i) => ({kind: k, cell: createCell(drop.group, {at: IN_DROP[i].clone().multiplyScalar(drop.radius / DROP.r), scale: .02 * drop.radius / DROP.r, rough: k === 'R', tilt: rnd() * 3, phase: rnd() * 6, rate: .6 + rnd() * .5})})); };
    TRIALS.forEach((tr, i) => { drops[i].cells = cellsIn(drops[i], DROP_CELLS[tr.cells], 11 + i); });
    const blood = createDrop(world, BLOOD_AT, BLOOD_R, BLOOD); blood.cells = cellsIn(blood, DROP_CELLS.blood, 31);
    const LIQUID = {liveS: 0xe0d2a4, liveR: 0xe0d2a4, heatS: 0xc3beb2, mix: 0xd2c9ae};
    const syringes = TRIALS.map(tr => createSyringe(world, LIQUID[tr.cells]));
    const approach = V(-.5, -.72, -.48).normalize();

    // The scale of cells.
    const stage = new THREE.Group(); stage.position.copy(STAGE); stage.scale.setScalar(S); world.add(stage);
    const cell = (x, y, z, o) => createCell(stage, {at: V(x, y, z), scale: 1, ...o});
    // First, S cells and R cells side by side.
    const A = {S: [cell(-330, -95, 0, {tilt: .25, phase: 0}), cell(-140, 25, -60, {tilt: -.35, phase: 2}), cell(-350, 140, 40, {tilt: .05, phase: 4})],
      R: [cell(330, -85, 0, {rough: true, tilt: -.2, phase: 1}), cell(150, 35, -50, {rough: true, tilt: .4, phase: 3}), cell(350, 150, 30, {rough: true, tilt: -.05, phase: 5})]};
    // Then a heat-killed S cell beside a live R cell; its DNA reaches the R cell, which makes a capsule.
    const B = {dead: cell(-310, 20, 0, {tilt: .45, phase: 1, rate: .5}), R: cell(150, 0, 0, {rough: true, tilt: -.25, phase: 2, rate: .5})};
    const Bfrag = [0, 1, 2, 3].map(i => createFragment(stage, local, [22, 18, 20, 16][i], 41 + i));
    const Bpath = [
      {from: V(-220, -30, -20), to: V(10, -20, -10), enter: true},
      {from: V(-260, 90, 20), to: V(-110, 190, 30)},
      {from: V(-230, 40, -40), to: V(-40, -170, -30)},
      {from: V(-300, -80, 10), to: V(-230, -230, 10)},
    ];
    // Last, DNA isolated from S cells, added to three R cells: each takes up a fragment and makes a capsule.
    const C = [cell(-340, 70, 0, {rough: true, tilt: .15, phase: 1, rate: .4}), cell(0, 105, -30, {rough: true, tilt: -.1, phase: 3, rate: .4}), cell(340, 60, 10, {rough: true, tilt: -.25, phase: 5, rate: .4})];
    const Cfrag = [0, 1, 2, 3, 4, 5].map(i => createFragment(stage, local, [22, 20, 24, 18, 20, 16][i], 61 + i));
    const Chover = [V(-300, -95, -10), V(40, -80, 20), V(300, -110, 0), V(-150, -210, 30), V(170, -230, -20), V(-20, -300, 10)];
    const Cstart = Chover.map((p, i) => p.clone().add(V((i - 2.5) * 24, -140, 0)));

    let pxPerA = 1;
    const tumble = (f, t, calm, w = 1) => f.pivot.quaternion.setFromAxisAngle(f.axis, f.spin + (calm ? 0 : t * .35 * w));
    const content = {
      mice, drops, blood, A, B, C, at,  // for tests (?debug=1)
      // For tests: the camera's moves and the fades round them ([start, end], s).
      moves: [[T.liveS - .05, ARRIVE[0] + IN], ...LEAVE.map((t, i) => [t, ARRIVE[i + 1] + .1]), [T.mixResult + 3.4 - leadOf(2), T.mixResult + 3.4 + 1.3],
        [OVERVIEW - leadOf(2.8), ALL_IN + .1], [GONE, T.principle + CUT + IN], [T.dna - leadOf(1.6), T.dna + 1.6 - leadOf(1.6)]],
      update(t, {calm = false, pxPerA: px = 1} = {}) {
        pxPerA = px; calmNow = calm;
        // The first view: S and R cells, gone before the camera cuts to the mice.
        const aShown = 1 - ramp(t, T.liveS, T.liveS + OUT);
        for (const c of A.S) c.set({capsule: 1, opacity: aShown, t, calm});
        for (const c of A.R) c.set({capsule: 0, opacity: aShown, t, calm});

        // The bench, the mice and each injection in turn; only the station the camera is on is drawn.
        const floor = benchShown(t); bench.material.opacity = bench.base * floor; bench.mesh.visible = floor > .01;
        TRIALS.forEach((tr, i) => {
          const shown = stationShown(i, t);
          mice[i].set({death: tr.dies ? ramp(t, tr.outcome, tr.outcome + 2.2) : 0, opacity: shown, t: t + i * .37, calm});
          const heat = i === 2 ? ramp(t, HEATING[0], HEATING[0] + 1.2) * (1 - ramp(t, HEATING[1] - 1.2, HEATING[1])) : 0;
          drops[i].set({opacity: shown, heat});
          drops[i].cells.forEach(({kind, cell}) => {
            const death = kind === 'dead' ? 1 : i === 2 ? ramp(t, HEATING[0] + .8, HEATING[1] - .4) : 0;
            cell.set({capsule: kind === 'R' ? 0 : 1, death, heat: kind === 'S' ? heat : 0, opacity: shown, t, calm});
          });
          // The syringe: in, the plunger down, out; gone.
          const s = tr.inject, reach = smooth(ramp(t, s + .3, s + 1.6)) * (1 - smooth(ramp(t, s + 3.5, s + 4.5)));
          const tip = mice[i].flank().addScaledVector(approach, mix(10, -.9, reach));
          syringes[i].set({tip, dir: approach, push: smooth(ramp(t, s + 1.8, s + 3.2)), opacity: ramp(t, s - .1, s + .5) * (1 - ramp(t, s + 4, s + 4.7)) * shown});
        });
        const bloodShown = ramp(t, ...BLOOD_IN) * (1 - ramp(t, GONE, GONE + OUT));
        blood.set({opacity: bloodShown}); blood.cells.forEach(({cell}) => cell.set({capsule: 1, opacity: bloodShown, t, calm}));

        // The transforming principle (after the cut): the dead cell's DNA drifts out; one fragment enters the R cell,
        // which makes a capsule.
        const b0 = B0, bShown = ramp(t, T.principle + CUT, T.principle + CUT + IN) * (1 - ramp(t, T.dna - .5, T.dna + .4));
        B.dead.set({capsule: 1, death: 1, opacity: bShown, t, calm});
        B.R.set({capsule: ramp(t, b0 + 6.6, b0 + 8.6), opacity: bShown, t, calm});
        Bfrag.forEach((f, i) => {
          const p = Bpath[i], go = smooth(ramp(t, b0 + 1.6 + i * .25, b0 + 5.2 + i * .25)), wob = calm ? 0 : 1;
          f.pivot.position.lerpVectors(p.from, p.to, go).add(V(0, 14 * Math.sin(go * Math.PI) * (i % 2 ? 1 : -1) + wob * 4 * Math.sin(t * .8 + i), 0));
          let o = ramp(t, b0 + 1.4 + i * .25, b0 + 2.4 + i * .25) * bShown;
          if (p.enter) {
            // In through the R cell's surface, towards its middle (the cell hides it once inside).
            const inside = smooth(ramp(t, b0 + 5.2, b0 + 6.6)); f.pivot.position.lerp(V(140, 0, 0), inside * .85);
            tumble(f, t, calm, 1 - inside); o *= 1 - ramp(t, b0 + 6.2, b0 + 6.8);
          } else { tumble(f, t, calm); o *= 1 - ramp(t, b0 + 6, b0 + 7.4); }
          f.opacity(o); f.view(pxPerA);
        });

        // DNA from S cells, added to R cells; after the question, each R cell takes up a fragment and makes a capsule.
        const c0 = T.dna, c1 = T.dnaResult, cShown = ramp(t, c0 + .2, c0 + 1.2);
        C.forEach((c, k) => c.set({capsule: ramp(t, c1 + 3 + k * .3, c1 + 5.4 + k * .3), opacity: cShown, t, calm}));
        Cfrag.forEach((f, i) => {
          const come = smooth(ramp(t, c0 + .6 + i * .2, c0 + 5 + i * .2)), wob = calm ? 0 : 1;
          f.pivot.position.lerpVectors(Cstart[i], Chover[i], come).add(V(wob * 6 * Math.sin(t * .6 + i * 1.7), wob * 5 * Math.sin(t * .5 + i), 0));
          let o = ramp(t, c0 + .4 + i * .2, c0 + 1.6 + i * .2);
          if (i < 3) {
            const cellAt = C[i].holder.position, into = smooth(ramp(t, c1 + .3 + i * .3, c1 + 2.6 + i * .3));
            f.pivot.position.lerp(cellAt.clone().add(V(0, -40, 0)), Math.min(1, into * 1.25)).lerp(cellAt, Math.max(0, into * 1.25 - .25) * .8);
            tumble(f, t, calm, 1 - into); o *= 1 - ramp(t, c1 + 2.2 + i * .3, c1 + 2.8 + i * .3);
          } else { tumble(f, t, calm); o *= 1 - ramp(t, c1 + 1.2, c1 + 2.4); }
          f.opacity(o); f.view(pxPerA);
        });

        at.mice = mice.map(m => m.group.position.toArray()); at.drops = drops.map(d => d.group.position.toArray()); at.blood = BLOOD_AT.toArray();
        at.shown = TRIALS.map((tr, i) => +stationShown(i, t).toFixed(3));
        at.death = TRIALS.map(tr => tr.dies ? +ramp(t, tr.outcome, tr.outcome + 2.2).toFixed(3) : 0);
        at.capsules = {A: [...A.S.map(() => 1), ...A.R.map(() => 0)], B: +ramp(t, b0 + 6.6, b0 + 8.6).toFixed(3), C: C.map((c, k) => +ramp(t, c1 + 3 + k * .3, c1 + 5.4 + k * .3).toFixed(3))};
        at.stage = [...A.S, ...A.R].map(c => c.centre().toArray()); at.stageC = C.map(c => c.centre().toArray());
      },
      annotate(t, {label, tag}) {
        if (t < T.liveS) {
          if (t > 1.2) label(A.S[1].top(), 'S cell', 'Smooth · a polysaccharide capsule', {color: hex(COAT)});
          if (t > 2.3) label(A.R[1].top(false), 'R cell', 'Rough · no capsule', {color: hex(LIVE)});
          if (t > 3.4) { tag(A.S[2].centre().add(V(0, 4.6, 0)), 'Virulent', {color: hex(COAT)}); tag(A.R[2].centre().add(V(0, 3.8, 0)), 'Avirulent', {color: hex(LIVE)}); }
          return;
        }
        if (t < T.principle + CUT) {
          // Only what is drawn is named.
          const overview = t > ALL_IN + .2;
          TRIALS.forEach((tr, i) => {
            if (stationShown(i, t) < .6) return;
            const current = !overview && t < (TRIALS[i + 1]?.start ?? Infinity), drop = drops[i].top(), back = mice[i].back();
            if (current && t > ARRIVE[i] + .2) tag(drop, i === 2 && t < HEATING[1] - .4 ? 'Live S cells' : tr.tag, {color: tr.cells === 'liveR' ? hex(LIVE) : i === 2 && t > HEATING[1] - .4 ? GREY : tr.cells === 'mix' ? GREY : hex(COAT)});
            if (overview) tag(drop, tr.short, {color: tr.cells === 'liveR' ? hex(LIVE) : tr.cells === 'liveS' ? hex(COAT) : GREY});
            if (t > tr.outcome + (tr.dies ? 1.8 : .6)) {
              const title = tr.dies ? 'Dies' : 'Lives', color = tr.dies ? DIES : LIVES;
              if (current && !(i === 3 && t > BLOOD_IN[1])) label(back, title, tr.sub, {color, key: `outcome ${i}`}); else tag(back, title, {color});
            }
          });
          if (t > BLOOD_IN[1] - .2 && t < GONE + OUT / 2) overview ? tag(blood.top(), 'Live S · from its blood', {color: hex(COAT)}) : label(blood.top(), 'Live S cells', 'Isolated from its blood', {color: hex(COAT)});
          return;
        }
        if (t < T.dna) {
          const b0 = B0;
          if (t > b0 + .6) label(B.dead.top(), 'Heat-killed S cell', 'Dead', {color: GREY, side: 'left'});
          if (t > b0 + 1.2 && t < b0 + 8.6) label(B.R.top(false), 'Live R cell', 'No capsule', {color: hex(LIVE), side: 'right'});
          if (t > b0 + 2.4 && t < b0 + 5.4) tag(Bfrag[0].world(), 'From the dead S cell', {color: DNA_TAG});
          if (t > b0 + 8.6) label(B.R.top(), 'Now an S cell', 'It has made a capsule', {color: hex(COAT), side: 'right'});
          return;
        }
        const c0 = T.dna, c1 = T.dnaResult;
        if (t > c0 + 1.4 && t < c1 + 3) label(C[1].top(false), 'Live R cells', 'No capsule', {color: hex(LIVE)});
        if (t > c0 + 2 && t < c1 + 1.2) tag(Cfrag[3].world(), 'DNA from S cells', {color: DNA_TAG});
        if (t > c1 + 5.6) {
          label(C[1].top(), 'Capsule', 'Smooth: now S cells', {color: hex(COAT)});
          tag(C[0].centre().add(V(0, 4.8, 0)), 'S cell', {color: hex(COAT)}); tag(C[2].centre().add(V(0, 4.8, 0)), 'S cell', {color: hex(COAT)});
        }
      },
      // Points round the outline of everything drawn now (world), with its opacity: shots are fitted to them, and the
      // tests check that none of them passes behind the page's text.
      keyPoints() {
        world.updateMatrixWorld(true);
        const out = [], add = (name, opacity, thing) => { if (opacity > .02) out.push({name, opacity: +opacity.toFixed(3), points: thing.outline()}); };
        mice.forEach((m, i) => add(`mouse${i}`, m.opacity, m));
        drops.forEach((d, i) => add(`drop${i}`, d.opacity, d));
        syringes.forEach((s, i) => add(`syringe${i}`, s.opacity, s));
        add('blood', blood.opacity, blood);
        for (const c of [...A.S, ...A.R]) add('cellsA', c.opacity, c);
        for (const c of [B.dead, B.R]) add('cellsB', c.opacity, c);
        for (const f of Bfrag) add('dnaB', f.shown, f);
        for (const c of C) add('cellsC', c.opacity, c);
        for (const f of Cfrag) add('dnaC', f.shown, f);
        return out;
      },
    };

    // Each shot's box: fitted round the points of what its step shows, sampled through the step (seen from its
    // shot's direction, with room above for the names).
    const around = (from, to, pick, dir, o) => {
      const pts = [];
      for (let t = from; t <= to + 1e-6; t += .25) { content.update(t, {pxPerA: 1}); for (const it of content.keyPoints()) if (pick.test(it.name) && it.opacity > .02) pts.push(...it.points.map(p => V(...p))); }
      return boxAround(pts, dir, {fov: 28, ...o});
    };
    const station = i => new RegExp(`^(mouse|drop|syringe)${i}$`);
    content.frames = {
      cells: around(0, T.liveS - .1, /^cellsA$/, STAGE_DIR, {margin: 1.2, above: 2.2}),
      station0: around(ARRIVE[0], LEAVE[0], station(0), STATION_DIR, {margin: 1.5, above: 3}),
      station1: around(ARRIVE[1], LEAVE[1], station(1), STATION_DIR, {margin: 1.5, above: 3}),
      station2: around(ARRIVE[2], LEAVE[2], station(2), STATION_DIR, {margin: 1.5, above: 3}),
      station3: around(ARRIVE[3], T.mixResult + 2.6, station(3), STATION_DIR, {margin: 1.5, above: 3}),
      blood: around(BLOOD_IN[1], OVERVIEW - 1, /^(mouse|drop|syringe)3$|^blood$/, STATION_DIR, {margin: 1.5, above: 3}),
      all: around(ALL_IN, GONE - .1, /^(mouse|drop)\d$|^blood$/, STATION_DIR, {margin: 2, above: 4}),
      principle: around(T.principle + CUT, T.dna - .6, /^(cellsB|dnaB)$/, STAGE_DIR, {margin: 1.2, above: 2.2}),
      dna: around(T.dna + .4, T.end, /^(cellsC|dnaC)$/, STAGE_DIR, {margin: 1.2, above: 2.2}),
    };
    content.update(0, {pxPerA: 1});
    return content;
  },
});
