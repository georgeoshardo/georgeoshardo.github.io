// Scene: transfection, the evidence that DNA is the genetic material of eukaryotes, as the notes' thymidine kinase
// experiment. Everything is drawn at its true size in one space (Å): cultured cells about 25 µm across on a dish, each
// with its nucleus, none able to make thymidine kinase (TK). Plasmids of 5,040 bp (a relaxed circle about 0.5 µm
// across, its TK gene in coral) are added; some enter cells, and one reaches a nucleus. There it lies beside a
// stretch of a chromosome's DNA (ideal B-DNA, drawn without its nucleosomes), is expressed, and its protein, human
// thymidine kinase 1 (PDB 1XBT), is made nearby. The plasmid then opens and joins the chromosome's DNA: its ends meet
// the chromosome's in place, direction and twist, so the DNA is continuous. Under selection the other cells die and
// the transfected cell divides into a colony. The camera moves on a logarithmic scale between the dish, the nucleus
// and the protein; each level fades in and out with the camera's distance, and the fog follows it.
import * as THREE from 'three';
import {runScene} from '../shared/scene_player.mjs';
import {loadSurfaceSet, surfaceGeometry, proteinMaterial, baseMaterial, fadeObject} from '../shared/molecules.mjs';
import {pairsFromStrands, frameFromPairs, meanLocal, sequencePairs, createDuplex, RISE, TWIST} from '../shared/dna.mjs';
import {STRANDS, strandMaterial, createTube} from '../shared/strands.mjs';
import {ramp, smooth, clamp, mix} from '../shared/ease.mjs';

const V = (...a) => new THREE.Vector3(...a);
const hex = c => '#' + c.toString(16).padStart(6, '0');
const T = {add: 10, nucleus: 22, protein: 33, integrate: 44, select: 56, end: 73};
const ASK = T.select - 1.5;                       // when step 5 asks its question (before the camera's move at 54.74)
const COL = {
  cell: 0xa3bfd8, nucleus: 0x7384d8, dying: 0x8d82b4, tkCell: 0xf2ab94, tkNucleus: 0xe9785c, dish: 0x22384a,
  plasmid: [0xefb84a, 0xf8e3b0], tk: [0xe8452a, 0xffb29a], protein: [0xf0896a, 0xde7a5d, 0xf5a386, 0xd46e55],
};
const LABEL = {cell: '#bcd3e6', plasmid: '#f3d58f', tk: '#ffa98c', dna: hex(STRANDS.template)};

// A small seeded random generator, so the culture looks the same every time.
function rng(seed) { return () => { seed = (seed + 0x6D2B79F5) | 0; let x = Math.imul(seed ^ (seed >>> 15), 1 | seed); x = (x + Math.imul(x ^ (x >>> 7), 61 | x)) ^ x; return ((x ^ (x >>> 14)) >>> 0) / 4294967296; }; }

// ---------- The culture ----------
// Cells on the dish (the plane y = 0; −y is up): centre, the long axis' angle, footprint radius and height (Å). Cell 0
// is the one that is transfected. Each nucleus is a flattened ellipsoid at its cell's centre.
const CELLS = [
  [0, 0, 0, 128000, 56000], [-300000, -30000, 1.1, 118000, 52000], [295000, 55000, -.6, 122000, 54000],
  [-150000, 245000, 2.0, 114000, 51000], [165000, 262000, .8, 120000, 53000], [-170000, -245000, -1.2, 112000, 50000],
  [160000, -235000, 1.6, 118000, 52000], [-455000, 215000, .3, 110000, 50000], [450000, -185000, 2.5, 116000, 52000],
  [455000, 300000, -.3, 108000, 49000], [-450000, -270000, 1.0, 112000, 50000], [10000, 485000, .5, 110000, 50000],
].map(([x, z, rot, R, H], i) => {
  const r = rng(11 + i), lobes = [[2, .2 + .08 * r(), 0], [3, .07 * r(), 6 * r()], [4, .05 * r(), 6 * r()], [5, .03 * r(), 6 * r()]];
  const k = R / 128000;
  return {x, z, rot, R, H, lobes, nucleus: {a: 51200 * k, b: 20000 * k, c: 41000 * k, y: -24000 * k}};
});
const footprint = (c, th) => c.R * (1 + c.lobes.reduce((s, [k, a, p]) => s + a * Math.cos(k * th + p), 0));
// The height of a cell's top above the dish at a world point (0 outside it).
function topOf(c, x, z) {
  const dx = x - c.x, dz = z - c.z, a = Math.atan2(dz, dx) - c.rot, rho = Math.hypot(dx, dz) / footprint(c, a);
  return rho >= 1 ? 0 : c.H * Math.pow(1 - rho * rho, .8);
}

// ---------- The site ----------
// In cell 0's nucleus, 1,000 Å under the top of its envelope, a plane seen face on from the site shots: u runs across
// the screen (world x), v up it (world z). A stretch of a chromosome's DNA runs along v = LINE; the plasmid lies
// just above it, then joins it.
const SITE = V(0, -43000, 0), EU = V(1, 0, 0), EVV = V(0, 0, 1), UP = V(0, -1, 0), LINE = -2750;
const P = 5040, A = 4000;                         // plasmid pairs (480 turns); chromosome pairs each side of the join
const TK = [P / 2 - 820, P / 2 + 820];           // the TK gene, opposite where the plasmid opens
const STRAIGHT = 7000, BEND = 40000, FADE = [6500, 12500];  // each arm runs straight, then curves gently down into
// the nucleus, fading into the dark with distance from the site
const D_DISH = [.06, -.77, -.63], D_SITE = [.03, -.95, -.31];
const SITE_VIEW = SITE.clone().addScaledVector(EVV, 450);
const PROTEIN = SITE_VIEW.clone().addScaledVector(V(...D_SITE).normalize(), 1800);
const plane = (u, v, out = V()) => out.copy(SITE).addScaledVector(EU, u).addScaledVector(EVV, v);

// The plasmid's shape as it opens and joins the chromosome: the heading of each step (radians in the plane), blended
// from a closed circle (turning once round, clockwise, from the bottom) to an Ω whose feet lie along the chromosome.
// Both are symmetric about the plasmid's middle, so the shape stays symmetric; its length never changes.
const TURN = .62 * Math.PI, FOOT = .12, GAP = .09;
const omega = x => x < FOOT ? TURN * smooth(x / FOOT) : x > 1 - FOOT ? -TURN * smooth((1 - x) / FOOT) : TURN * Math.cos(Math.PI * (x - FOOT) / (1 - 2 * FOOT));
function plasmidShape(open, w, out) {
  const heading = x => (1 - w) * (Math.PI - GAP * open) * (1 - 2 * x) + w * omega(x);
  const u = out.u, v = out.v, th = out.th;
  u[0] = 0; v[0] = 0;
  for (let k = 0; k < P; k++) { const a = heading((k + .5) / P); th[k] = a; u[k + 1] = u[k] + RISE * Math.cos(a); v[k + 1] = v[k] + RISE * Math.sin(a); }
  // The middle on u = 0; the ends a little above the chromosome, lifted clear of it while they turn, and on it once joined.
  const du = u[P / 2], lift = 40 * (1 - w) + 300 * Math.sin(Math.PI * w);
  for (let k = 0; k <= P; k++) { u[k] -= du; v[k] += LINE + lift; }
  return out;
}

// ---------- The colony ----------
// Sixteen cells, the descendants of cell 0 after four divisions, packed round it, a few piled on the others. The
// family tree is built backwards, splitting the group along its longer side; each cell before them sits at the middle
// of its descendants.
const DIVIDE = [3.5, 5.7, 7.9, 10.1];            // seconds into the selection step at which each generation divides
function colonyTree() {
  const r = rng(5), leaves = [];
  for (let i = 0; i < 12; i++) { const a = i * 2.39996 + .4, d = 205000 * Math.sqrt((i + .5) / 12); leaves.push({x: d * Math.cos(a), z: d * Math.sin(a) * .82, lift: 0}); }
  for (let i = 0; i < 4; i++) { const a = i * Math.PI / 2 + .6; leaves.push({x: 62000 * Math.cos(a), z: 62000 * Math.sin(a), lift: -34000}); }
  const mx = leaves.reduce((s, l) => s + l.x, 0) / 16, mz = leaves.reduce((s, l) => s + l.z, 0) / 16;
  leaves.forEach(l => { l.x -= mx; l.z -= mz; });
  const split = (group, depth) => {
    const node = {depth, x: group.reduce((s, l) => s + l.x, 0) / group.length, z: group.reduce((s, l) => s + l.z, 0) / group.length,
      lift: group.reduce((s, l) => s + l.lift, 0) / group.length, children: []};
    if (group.length > 1) {
      const sx = Math.max(...group.map(l => l.x)) - Math.min(...group.map(l => l.x)), sz = Math.max(...group.map(l => l.z)) - Math.min(...group.map(l => l.z));
      const sorted = group.slice().sort((a, b) => sx > sz ? a.x - b.x : a.z - b.z);
      node.children = [split(sorted.slice(0, group.length / 2), depth + 1), split(sorted.slice(group.length / 2), depth + 1)];
      node.divide = T.select + DIVIDE[depth] + .25 * (r() - .5);
    }
    return node;
  };
  return split(leaves, 0);
}

const NOTES = 'evidence-for-dna-as-the-genetic-material-of-eukaryotes';
const steps = [
  {t: 0, nav: 'Cells without TK', title: 'Cells that lack<br>thymidine kinase.', notes: NOTES,
    text: 'Eukaryotic cells grow in culture on the surface of a dish. These cells are deficient for the thymidine kinase (TK) gene, which is required for DNA synthesis, so they cannot produce thymidine kinase.'},
  {t: T.add, nav: 'DNA is added', title: 'Added DNA<br>enters some cells.', notes: NOTES, hold: 1.1,
    text: 'When DNA is added to eukaryotic cells growing in culture, it can enter the cells; here it is a plasmid containing the thymidine kinase gene. This is transfection: the analogue of transformation in bacteria, named differently for historical reasons.'},
  {t: T.nucleus, nav: 'Transient expression', title: 'Some of the DNA<br>is expressed.', notes: NOTES,
    text: 'Some of the DNA that enters a cell may be expressed and produce new proteins. Transfected DNA may be expressed transiently, without integration into a chromosome.'},
  {t: T.protein, nav: 'Thymidine kinase', title: 'The new gene’s<br>protein is made.', notes: NOTES,
    text: 'When a particular gene is used, its uptake results in the production of the protein associated with that gene: here, thymidine kinase. Expression of this new DNA can also give the cell a new phenotype.'},
  {t: T.integrate, nav: 'Stable transfection', title: 'In one cell, the DNA<br>joins a chromosome.', notes: NOTES, hold: 1.1,
    text: 'In stable transfection, the selected DNA is maintained through cell division, usually after integration into the genome: the plasmid’s DNA, its thymidine kinase gene included, becomes part of a chromosome.',
    // Asked while the joined gene is still named, before the camera returns to the dish.
    predict: {id: 'selection', at: ASK, question: 'Which cells survive under selection?', choices: [
      {text: 'Only descendants of the cell whose plasmid joined a chromosome', correct: true},
      {text: 'Every cell that took up the plasmid', correct: false,
        reply: 'DNA that was not integrated is expressed only transiently: it is not maintained through cell division.'},
      {text: 'All the cells', correct: false, reply: 'Only cells that keep the plasmid’s TK gene are rescued; cells deficient for thymidine kinase die under selection.'}]}},
  {t: T.select, nav: 'Selection: a colony', title: 'Under selection,<br>TK⁺ cells proliferate.', notes: NOTES, hold: 1.1,
    text: 'Under selection, cells without thymidine kinase die, while the transfected cell’s descendants proliferate and pile up into a colony: the introduced genetic information is maintained through cell division.'},
];

// When the plasmid opens (0–1) and joins the chromosome (0–1).
const opening = t => ramp(t, T.integrate + 2, T.integrate + 3.2), joining = t => smooth(clamp((t - T.integrate - 3.2) / 4));
const JOINED = T.integrate + 7.2;

// The transfected plasmid's way in: it drifts down onto cell 0, turning over, lands on it, and sinks through the cell
// into its nucleus, where it lies flat at the site. Returns the rotation and centre of the plasmid (world).
const FALL = {from: V(38000, -205000, -26000), land: V(0, -57500, 0), axis: V(.4, .3, .87).normalize()};
function plasmidPlace(t, centre, q = new THREE.Quaternion(), p = V()) {
  const f = smooth(clamp((t - T.add - .6) / 4.2)), sink = smooth(clamp((t - T.add - 5.4) / 2.8));
  p.lerpVectors(FALL.from, FALL.land, 1 - (1 - f) * (1 - f)).lerp(centre, sink);
  q.setFromAxisAngle(FALL.axis, 2.6 * (1 - smooth(clamp((t - T.add - 1) / 3.8))));
  return {q, p};
}

// ---------- Materials ----------
// Cells as the microscope sees them: a translucent body, brighter where it is seen edge on, over its nucleus.
function glassMaterial(color, {opacity, rim, depthWrite = false}) {
  const m = new THREE.MeshStandardMaterial({color, roughness: .45, metalness: 0, envMapIntensity: .35, transparent: true, depthWrite, opacity});
  const u = {uRim: {value: rim}, uRimColor: {value: new THREE.Color(color).lerp(new THREE.Color(0xeaf6ff), .55)}};
  m.userData.uniforms = u;
  m.onBeforeCompile = sh => {
    Object.assign(sh.uniforms, u);
    sh.fragmentShader = sh.fragmentShader.replace('void main() {', 'uniform float uRim;uniform vec3 uRimColor;\nvoid main() {')
      .replace('#include <opaque_fragment>', `float fr = clamp(1. - abs(dot(normalize(normal), normalize(vViewPosition))), 0., 1.);
  gl_FragColor = vec4(outgoingLight + uRim * fr * fr * uRimColor, clamp(diffuseColor.a * (.7 + 2.2 * fr * fr), 0., 1.));`);
  };
  m.customProgramCacheKey = () => 'transfection-glass';
  return m;
}

// ---------- The free part of the screen ----------
// Nothing is drawn behind the page's text and controls: the header's buttons, the step list, the narration (as tall as
// at its longest step, so the room keeps still from step to step) and the transport. Each cell, nucleus, plasmid and
// protein fades out as its outline on screen comes within a few pixels of one, and the chromosome's DNA fades there
// point by point.
const CLEAR = 8, SOFT = 30, MAX_RECTS = 8;
const CHROME = ['.brand', '.top-controls', '#chapters', '#chapter-name', '.transport'];
let tallestCache = {key: '', h: 0};
document.fonts?.addEventListener?.('loadingdone', () => { tallestCache.key = ''; });
function narrationTallest(nar) {
  const key = `${innerWidth}x${innerHeight}`; if (tallestCache.key === key) return tallestCache.h;
  const probe = nar.cloneNode(true); probe.querySelectorAll('[id]').forEach(e => e.removeAttribute('id'));
  probe.style.visibility = 'hidden'; probe.setAttribute('aria-hidden', 'true'); nar.after(probe);
  let h = nar.offsetHeight;
  const ask = probe.querySelector('.ask'), recalled = probe.querySelector('.predicted');
  steps.forEach((s, i) => {
    probe.querySelector('h1').innerHTML = s.title.split('<br>').map(line => `<span class="l">${line}</span>`).join(' ');
    probe.querySelector('h1 + p').textContent = s.text;
    // A step that asks, as it asks; the step after it, recalling each answer.
    if (s.predict && ask) {
      ask.querySelector('.ask-question').textContent = s.predict.question;
      ask.querySelector('.ask-choices').innerHTML = s.predict.choices.map((c, n) => `<button><kbd>${n + 1}</kbd><span>${c.text}</span></button>`).join('');
    }
    const before = steps[i - 1]?.predict;
    for (const c of before && recalled ? [null, ...before.choices] : [null]) {
      if (recalled) { recalled.hidden = !c; if (c) recalled.textContent = `You predicted: ${c.text}. ${c.correct ? 'Right.' : 'Not quite.'} ${c.reply || ''}`; }
      for (const on of s.predict && ask ? [false, true] : [false]) { probe.classList.toggle('asking', on); if (ask) ask.hidden = !on; h = Math.max(h, probe.offsetHeight); }
    }
  });
  probe.remove(); tallestCache = {key, h}; return h;
}
// The page's chrome as [left, top, right, bottom] (px), measured as each frame is drawn (the page settles its layout as
// it opens and at each step). The step list, whose foot follows the narration's top, is taken down to the narration's
// foot.
function chromeRects() {
  const rects = [], box = el => { if (!el || el.hidden || !el.getClientRects().length) return null; const r = el.getBoundingClientRect(); return r.width > 0 && r.height > 0 ? r : null; };
  const nar = document.querySelector('.narration'), n = box(nar);
  for (const s of CHROME) { const r = box(document.querySelector(s)); if (r) rects.push([r.left, r.top, r.right, s === '#chapters' && n && r.height > r.width ? Math.max(r.bottom, n.bottom) : r.bottom]); }
  if (n) rects.push([n.left, Math.min(n.top, n.bottom - narrationTallest(nar)), n.right, n.bottom]);
  return rects.slice(0, MAX_RECTS);
}
// How much of something to show whose outline is `gap` px from the nearest chrome: none within CLEAR, all beyond
// CLEAR + SOFT.
const roomFor = gap => smooth(clamp((gap - CLEAR) / SOFT));
// Distance (px) from a point to a rect, 0 inside it.
const pointGap = (x, y, [l, t, r, b]) => Math.hypot(Math.max(l - x, 0, x - r), Math.max(t - y, 0, y - b));
// Distance (px) from a convex polygon [[x, y], …] to a rect, 0 where they overlap.
function polygonGap(poly, rect) {
  const [l, t, r, b] = rect; let best = Infinity;
  for (const [x, y] of poly) best = Math.min(best, pointGap(x, y, rect));
  if (best === 0) return 0;
  const n = poly.length, corners = [[l, t], [r, t], [r, b], [l, b]];
  // A corner of the rect inside the polygon (its edges all turn the same way round the corner).
  for (const [cx, cy] of corners) {
    let pos = 0, neg = 0;
    for (let i = 0; i < n; i++) { const [ax, ay] = poly[i], [bx, by] = poly[(i + 1) % n], c = (bx - ax) * (cy - ay) - (by - ay) * (cx - ax); if (c > 0) pos++; else if (c < 0) neg++; }
    if (!pos || !neg) return 0;
  }
  for (let i = 0; i < n; i++) {
    const [ax, ay] = poly[i], [bx, by] = poly[(i + 1) % n];
    // An edge crossing the rect (clipped to it, Liang–Barsky).
    let u0 = 0, u1 = 1, crosses = true;
    for (const [p, q] of [[ax - bx, ax - l], [bx - ax, r - ax], [ay - by, ay - t], [by - ay, b - ay]]) {
      if (p === 0) { if (q < 0) { crosses = false; break; } continue; }
      const u = q / p; if (p < 0) u0 = Math.max(u0, u); else u1 = Math.min(u1, u);
      if (u0 > u1) { crosses = false; break; }
    }
    if (crosses) return 0;
    const dx = bx - ax, dy = by - ay, len2 = dx * dx + dy * dy || 1;
    for (const [cx, cy] of corners) { const u = clamp(((cx - ax) * dx + (cy - ay) * dy) / len2); best = Math.min(best, Math.hypot(ax + u * dx - cx, ay + u * dy - cy)); }
  }
  return best;
}
// The convex hull of points [[x, y], …] (monotone chain), anticlockwise on screen.
function hull(points) {
  const p = points.slice().sort((a, b) => a[0] - b[0] || a[1] - b[1]), cross = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const lower = [], upper = [];
  for (const q of p) { while (lower.length > 1 && cross(lower[lower.length - 2], lower[lower.length - 1], q) <= 0) lower.pop(); lower.push(q); }
  for (let i = p.length - 1; i >= 0; i--) { const q = p[i]; while (upper.length > 1 && cross(upper[upper.length - 2], upper[upper.length - 1], q) <= 0) upper.pop(); upper.push(q); }
  return lower.slice(0, -1).concat(upper.slice(0, -1));
}
// Screen room for a set of world points (their hull on screen), with the camera as drawn; 1 when all are behind it.
const _p = new THREE.Vector3();
function roomOfPoints(points, cam, rects) {
  const screen = [];
  for (const q of points) { _p.copy(q).project(cam); if (_p.z < 1) screen.push([(_p.x + 1) * innerWidth / 2, (1 - _p.y) * innerHeight / 2]); }
  if (!screen.length) return 1;
  const poly = screen.length > 2 ? hull(screen) : screen;
  return rects.reduce((m, r) => Math.min(m, roomFor(polygonGap(poly, r))), 1);
}
// The chrome as the chromosome's material reads it: rects in CSS px, the drawing buffer's scale to them.
const ROOM = {uRects: {value: Array.from({length: MAX_RECTS}, () => new THREE.Vector4())}, uRectCount: {value: 0},
  uScreen: {value: new THREE.Vector4(1, 1, 800, 0)}, uSoft: {value: new THREE.Vector2(CLEAR, SOFT)}};

// DNA drawn along its axis, its colour sinking into the night wherever it comes near the page's chrome, and for the
// chromosome's arms (`far`) with distance from the site (world Å), so they leave the view without an end.
function fadingMaterial(color, {far = true, glow = .3} = {}) {
  const m = strandMaterial(color, {glow}), u = {uCentre: {value: SITE}, uFade: {value: new THREE.Vector2(...(far ? FADE : [1e9, 2e9]))}, uNight: {value: new THREE.Color(0x070e17)}, ...ROOM};
  m.onBeforeCompile = sh => {
    Object.assign(sh.uniforms, u);
    sh.vertexShader = sh.vertexShader.replace('void main() {', 'varying vec3 vFadeWorld;\nvoid main() {').replace('#include <project_vertex>', '#include <project_vertex>\n  vFadeWorld = (modelMatrix * vec4(transformed, 1.0)).xyz;');
    sh.fragmentShader = sh.fragmentShader.replace('void main() {', `varying vec3 vFadeWorld;uniform vec3 uCentre;uniform vec2 uFade;uniform vec3 uNight;
uniform vec4 uRects[${MAX_RECTS}];uniform int uRectCount;uniform vec4 uScreen;uniform vec2 uSoft;
void main() {`)
      .replace('#include <opaque_fragment>', `#include <opaque_fragment>
  vec2 px = vec2(gl_FragCoord.x * uScreen.x, uScreen.z - gl_FragCoord.y * uScreen.y);
  float gap = 1e5;
  for (int i = 0; i < ${MAX_RECTS}; i++) { if (i >= uRectCount) break; vec4 r = uRects[i]; gap = min(gap, length(max(max(r.xy - px, px - r.zw), 0.))); }
  float room = smoothstep(uSoft.x, uSoft.x + uSoft.y, gap);
  gl_FragColor.rgb = mix(uNight, mix(gl_FragColor.rgb, uNight, smoothstep(uFade.x, uFade.y, distance(vFadeWorld, uCentre))), room);`);
  };
  m.customProgramCacheKey = () => 'transfection-fading-strand'; m.userData.room = true;
  return m;
}

// A cell's top surface, spread on the dish, with a morph target rounded up (as a cell dividing or dying): rings from
// the top to the rim, the rim on the dish.
const RINGS = 16, SEGMENTS = 64, PSI = 150 * Math.PI / 180;
function cellGeometry(c, Rr) {
  const spread = [], round = [], index = [];
  for (let i = 0; i <= RINGS; i++) {
    const rho = i / RINGS, psi = rho * PSI;
    for (let j = 0; j <= SEGMENTS; j++) {
      const th = j / SEGMENTS * Math.PI * 2, r = rho * footprint(c, th), a = th + c.rot;
      spread.push(r * Math.cos(a), -c.H * Math.pow(Math.max(0, 1 - rho * rho), .8), r * Math.sin(a));
      round.push(Rr * Math.sin(psi) * Math.cos(a), Rr * (Math.cos(PSI) - Math.cos(psi)), Rr * Math.sin(psi) * Math.sin(a));
    }
  }
  const W = SEGMENTS + 1;
  for (let i = 0; i < RINGS; i++) for (let j = 0; j < SEGMENTS; j++) { const a = i * W + j, b = a + W; index.push(a, a + 1, b, b, a + 1, b + 1); }
  const g = new THREE.BufferGeometry(), normals = pos => {
    const h = new THREE.BufferGeometry(); h.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); h.setIndex(index); h.computeVertexNormals();
    const n = h.getAttribute('normal');
    // Outward means up at the top; the apex, where every segment meets, points straight up.
    if (n.getY(W + 1) > 0) for (let k = 0; k < n.array.length; k++) n.array[k] *= -1;
    for (let j = 0; j < W; j++) n.setXYZ(j, 0, -1, 0);
    return n;
  };
  g.setAttribute('position', new THREE.Float32BufferAttribute(spread, 3)); g.setIndex(index);
  const n0 = normals(spread);
  // Faces wound to face outwards (up), as their normals.
  const probe = new THREE.Vector3().fromArray(spread, 3 * (W + 1)), e1 = V().fromArray(spread, 3 * (W + 2)).sub(probe), e2 = V().fromArray(spread, 3 * (2 * W + 1)).sub(probe);
  if (e1.cross(e2).y > 0) for (let k = 0; k < index.length; k += 3) { const s = index[k + 1]; index[k + 1] = index[k + 2]; index[k + 2] = s; }
  g.setIndex(index);
  g.setAttribute('normal', n0);
  g.morphAttributes.position = [new THREE.Float32BufferAttribute(round, 3)];
  g.morphAttributes.normal = [normals(round)];
  g.computeBoundingSphere();
  return g;
}
const volumeRadius = c => Math.cbrt(.75 * .45 * c.R * c.R * c.H);

// A cell: body and nucleus, set each frame from its state.
const nucleusGeometry = new THREE.SphereGeometry(1, 40, 22);
const C = Object.fromEntries(Object.entries({cell: COL.cell, tkCell: COL.tkCell, dying: COL.dying, nucleus: COL.nucleus, tkNucleus: COL.tkNucleus, deadNucleus: 0x4a4468, rim: 0xeaf6ff}).map(([k, v]) => [k, new THREE.Color(v)]));
function createCell(parent, c) {
  const group = new THREE.Group(); group.position.set(c.x, c.lift || 0, c.z); parent.add(group);
  const Rr = volumeRadius(c), bodyMat = glassMaterial(COL.cell, {opacity: .2, rim: .5}), nucMat = glassMaterial(COL.nucleus, {opacity: .5, rim: .35, depthWrite: true});
  const body = new THREE.Mesh(cellGeometry(c, Rr), bodyMat); body.morphTargetInfluences = [0]; body.renderOrder = 2;
  const nucleus = new THREE.Mesh(nucleusGeometry, nucMat); nucleus.renderOrder = 1; nucleus.rotation.y = -c.rot;
  nucleus.position.y = c.nucleus.y; nucleus.scale.set(c.nucleus.a, c.nucleus.b, c.nucleus.c);
  group.add(body, nucleus);
  const tint = new THREE.Color(), tintN = new THREE.Color(), base = {body: .2, nucleus: .5}, state = {shown: 0, nucleus: 1};
  let last = '', level = 1;
  // How much the free part of the screen lets the body and the nucleus show (each by its own outline).
  const room = {body: 1, nucleus: 1};
  const apply = () => {
    const s = state.shown * level, b = s * room.body, n = s * state.nucleus * room.nucleus;
    group.visible = b > .005 || n > .005; body.visible = b > .005; bodyMat.opacity = base.body * b; nucMat.opacity = base.nucleus * n; nucleus.visible = n > .005;
  };
  // Points on the cell's outline as it is now (world): rings of its surface from the top to the rim on the dish, as
  // spread or rounded up; and on its nucleus, a little outside it.
  const spread = body.geometry.attributes.position.array, rounded = body.geometry.morphAttributes.position[0].array, W = SEGMENTS + 1;
  const SAMPLE = [0, ...[4, 8, 10, 12, 16].flatMap(i => Array.from({length: 16}, (_, j) => i * W + j * 4))];
  const RIM = Array.from({length: 16}, (_, j) => RINGS * W + j * 4);
  const UNIT = [[0, 1, 0], [0, -1, 0], ...[-.5, 0, .5].flatMap(y => Array.from({length: 8}, (_, k) => { const a = k * Math.PI / 4, r = Math.sqrt(1 - y * y); return [r * Math.cos(a), y, r * Math.sin(a)]; }))];
  const pointsAt = (indices, out, w = body.morphTargetInfluences[0]) => {
    const s = group.scale.x;
    indices.forEach((k, i) => (out[i] ||= V()).set(mix(spread[3 * k], rounded[3 * k], w), mix(spread[3 * k + 1], rounded[3 * k + 1], w), mix(spread[3 * k + 2], rounded[3 * k + 2], w)).multiplyScalar(s).add(group.position));
    return out;
  };
  const bodyPts = [], spreadPts = [], rimPts = [], nucPts = UNIT.map(() => V());
  const outline = {
    // As it is now, and as spread where it is now: a cell rounding up (dividing or dying) keeps the room it had.
    body: () => body.morphTargetInfluences[0] > 0 ? pointsAt(SAMPLE, bodyPts).concat(pointsAt(SAMPLE, spreadPts, 0)) : pointsAt(SAMPLE, bodyPts),
    rim: () => pointsAt(RIM, rimPts),
    nucleus: () => { nucleus.updateMatrix(); return UNIT.map((u, i) => nucPts[i].set(...u).multiplyScalar(1.06).applyMatrix4(nucleus.matrix).multiplyScalar(group.scale.x).add(group.position)); },
  };
  return {group, c, Rr, state, room, outline,
    get shown() { return state.shown * level; },
    get opacity() { return state.shown * level * room.body; },
    get nucleusOpacity() { return state.shown * level * state.nucleus * room.nucleus; },
    // How much of the body and the nucleus the free part of the screen lets show.
    clear(b, n) { if (b !== room.body || n !== room.nucleus) { room.body = b; room.nucleus = n; apply(); } },
    // round: 0 spread … 1 rounded up; shown: 0–1; tk: 0–1 (TK⁺ colour); dead: 0–1 (dying colour); nucleus: 0–1 shown.
    set({round = 0, shown = 1, tk = 0, dead = 0, nucleus: nShown = 1, scale = 1, x = c.x, z = c.z, lift = c.lift || 0}) {
      const key = [round, shown, tk, dead, nShown, scale, x, z, lift].map(v => v.toFixed(4)).join(',');
      if (key === last) return; last = key;
      state.shown = shown; state.nucleus = nShown; apply();
      group.position.set(x, lift, z); group.scale.setScalar(scale);
      body.morphTargetInfluences[0] = round;
      tint.copy(C.cell).lerp(C.tkCell, tk).lerp(C.dying, dead); bodyMat.color.copy(tint);
      bodyMat.userData.uniforms.uRimColor.value.copy(tint).lerp(C.rim, .55);
      tintN.copy(C.nucleus).lerp(C.tkNucleus, tk).lerp(C.deadNucleus, dead); nucMat.color.copy(tintN);
      nucMat.userData.uniforms.uRimColor.value.copy(tintN).lerp(C.rim, .55);
      // A cell rounding up lifts its nucleus with it and, dying, shrinks it.
      const k = 1 - .3 * dead;
      nucleus.position.y = mix(c.nucleus.y, Rr * (Math.cos(PSI) - .1), round);
      nucleus.scale.set(mix(c.nucleus.a, Rr * .45, round) * k, mix(c.nucleus.b, Rr * .4, round) * k, mix(c.nucleus.c, Rr * .45, round) * k);
    },
    // How much the culture shows at this camera distance.
    lod(v) { if (v !== level) { level = v; apply(); } },
  };
}

runScene({
  pageTitle: 'Transfection · Genes are DNA', eyebrow: 'DNA in eukaryotes',
  links: [{href: 'index.html', text: 'All scenes'}],
  steps, duration: T.end, notesPage: 'notes.html', fov: 30, fog: .0000003, near: 80, far: 1.2e8, loop: false,
  shots: [
    {t: 0, target: [0, -26000, 30000], dir: D_DISH, box: [880000, 540000]},
    {t: T.add, blend: 2.6, target: [0, -60000, 20000], dir: D_DISH, box: [560000, 400000]},
    {t: T.nucleus, blend: 3.4, target: SITE_VIEW.toArray(), dir: D_SITE, box: [10600, 8600]},
    {t: T.protein, blend: 3, target: PROTEIN.toArray(), dir: D_SITE, box: [120, 110]},
    {t: T.integrate, blend: 3, target: SITE_VIEW.toArray(), dir: D_SITE, box: [11600, 9600]},
    {t: T.select, blend: 3.6, target: [0, -26000, 30000], dir: D_DISH, box: [900000, 560000]},
    {t: T.select + 9.4, blend: 3, target: [0, -34000, 0], dir: D_DISH, box: [540000, 420000]},
  ],
  async build({world, scene, progress}) {
    const [helix, set] = await Promise.all([loadSurfaceSet('assets/helix.json', 'assets/helix.bin'), loadSurfaceSet('assets/transfection.json', 'assets/transfection.bin', progress)]);
    const hs = n => helix.meta.strands.find(s => s.name === n), crystal = pairsFromStrands(hs('a'), hs('b')); frameFromPairs(crystal);
    const local = meanLocal(crystal.slice(1, -1));
    const at = {};

    // ---------- The dish and the culture ----------
    const dish = new THREE.Mesh(new THREE.CircleGeometry(4.5e6, 96), baseMaterial(COL.dish, {roughness: .8, envMapIntensity: .15}));
    dish.rotation.x = -Math.PI / 2; dish.position.y = 30; world.add(dish);
    const cells = CELLS.map(c => createCell(world, c));
    // TK⁻ cells die in turn under selection, the nearest to the transfected cell first.
    const order = cells.slice(1).map((cell, i) => ({i: i + 1, d: Math.hypot(cell.c.x, cell.c.z)})).sort((a, b) => a.d - b.d);
    const dies = new Map(order.map(({i}, k) => [i, T.select + 3 + .32 * k]));
    // The colony: every descendant of cell 0 as a cell of its own, shown from its birth.
    const root = colonyTree(), nodes = [];
    const walk = (node, parent) => {
      node.parent = parent; nodes.push(node);
      if (node.depth > 0) {
        const r = rng(100 + nodes.length), k = Math.pow(.8, node.depth);
        node.cell = createCell(world, {x: node.x, z: node.z, lift: node.lift, rot: 6 * r(), R: 128000 * k, H: 56000 * mix(1, .74, node.depth / 4),
          lobes: [[2, .12 + .08 * r(), 0], [3, .06 * r(), 6 * r()], [4, .04 * r(), 6 * r()]], nucleus: {a: 51200 * k, b: 20000 * k, c: 41000 * k, y: -24000 * k}});
      } else node.cell = cells[0];
      node.children.forEach(ch => walk(ch, node));
    };
    walk(root, null);
    // For tests: the transfected cell, a TK⁻ cell, and the colony's sixteen cells, each a little above the dish.
    at.cell0 = [0, -30000, 0]; at.others = CELLS.slice(1).map(c => [c.x, -.5 * c.H, c.z]);
    at.colonyCells = nodes.filter(n => !n.children.length).map(n => [n.x, n.lift - 20000, n.z]);

    // ---------- Plasmids at the scale of the culture ----------
    // Rings 0.54 µm across (the plasmid's own size), gold with the TK gene's arc in coral, each drawn at least a
    // couple of pixels thick. Some settle on the dish or on a cell; some are taken up into a cell, a few into a nucleus.
    const r = rng(3), rings = [];
    const inside = (x, z) => CELLS.some(c => topOf(c, x, z) > 0);
    const spotOn = (c, spread) => { const a = 6.3 * r(), d = spread * Math.sqrt(r()) * footprint(c, a - c.rot); return [c.x + d * Math.cos(a), c.z + d * Math.sin(a)]; };
    const addRing = (end, kind, t0) => {
      const from = V(end.x + (r() - .5) * 60000, -150000 - 70000 * r(), end.z + (r() - .5) * 60000);
      rings.push({from, land: kind === 'dish' ? end : V(end.x, -topOf(CELLS[end.cell], end.x, end.z) - 1800, end.z), end, kind, t0,
        fall: 3.6 + 1.2 * r(), axis: V(r() - .5, r() - .5, r() - .5).normalize(), spin: 6.3 * r(), tumble: 2 + 2 * r()});
    };
    for (let k = 0; k < 14; k++) { let x, z; do { x = (r() - .5) * 1.1e6; z = (r() - .5) * 8e5; } while (inside(x, z) || Math.hypot(x, z) < 150000); addRing(V(x, -30, z), 'dish', T.add + .3 + 1.6 * r()); }
    for (let k = 0; k < 24; k++) {
      const i = 1 + (k % 11), c = CELLS[i], kind = k < 10 ? 'cell' : k < 19 ? 'cyto' : 'nucleus';
      // Spots in the nucleus, or clear of it.
      let x, z;
      do { [x, z] = kind === 'nucleus' ? spotOn({...c, R: c.nucleus.c, lobes: []}, .7) : spotOn(c, .75); }
      while (kind !== 'nucleus' && Math.hypot(x - c.x, z - c.z) < c.nucleus.a * 1.15);
      const top = topOf(c, x, z), end = kind === 'cell' ? V(x, -top - 1800, z) : kind === 'cyto' ? V(x, -Math.max(6000, top * .4), z) : V(x, c.nucleus.y * (1.1 + .3 * r()), z);
      end.cell = i; addRing(end, kind, T.add + .3 + 1.6 * r());
    }
    // The plasmid named in step 2: the one that settles on the cell beyond and left of the transfected one (cell 3),
    // landed before it is named; or, where the free part of the screen leaves that one faded, the one nearest to it that
    // shows whole, well inside the window, on a cell or on the dish (kept while it shows).
    const first = rings.find(g => g.kind === 'cell' && g.end.cell === 3);
    let named = first;
    const inView = g => g.screen && g.screen[0] > 60 && g.screen[0] < innerWidth - 60 && g.screen[1] > 60 && g.screen[1] < innerHeight - 60;
    const nameable = () => rings.filter(g => (g.kind === 'cell' || g.kind === 'dish') && g.t0 + g.fall < T.add + 5.6 && (g.room ?? 0) > .99 && inView(g))
      .sort((a, b) => a.end.distanceTo(first.end) - b.end.distanceTo(first.end))[0];
    at.named = named.end.toArray();
    const ringTube = {size: 0}, ringMats = [strandMaterial(COL.plasmid[0], {glow: .25}), strandMaterial(COL.tk[0], {glow: .2})];
    const ringMeshes = ringMats.map(m => { const mesh = new THREE.InstancedMesh(new THREE.BufferGeometry(), m, rings.length); mesh.frustumCulled = false; world.add(mesh); return mesh; });
    const setRingTube = size => {
      if (Math.abs(size / (ringTube.size || 1) - 1) < .12) return; ringTube.size = size;
      const gold = new THREE.TorusGeometry(2700, size, 6, 44, 2 * Math.PI * 250 / 360), coral = new THREE.TorusGeometry(2700, size, 6, 20, 2 * Math.PI * 110 / 360);
      coral.rotateZ(2 * Math.PI * 250 / 360);
      ringMeshes.forEach((m, k) => { m.geometry.dispose(); m.geometry = k ? coral : gold; });
    };
    const flat = new THREE.Quaternion().setFromAxisAngle(V(1, 0, 0), Math.PI / 2), m4 = new THREE.Matrix4(), rq = new THREE.Quaternion(), rp = V(), rs = V();
    const ringAt = (g, t, q, p) => {
      const f = smooth(clamp((t - g.t0) / g.fall)), sink = g.kind === 'dish' || g.kind === 'cell' ? 0 : smooth(clamp((t - g.t0 - g.fall - .4) / 2.4));
      p.lerpVectors(g.from, g.land, 1 - (1 - f) * (1 - f)).lerp(g.end, sink);
      q.setFromAxisAngle(UP, g.spin).multiply(flat).premultiply(rq.setFromAxisAngle(g.axis, g.tumble * (1 - smooth(clamp((t - g.t0) / (g.fall * .9))))));
      return p;
    };

    // ---------- DNA at the site ----------
    // One chromosome's DNA, the left arm (pairs 0 … A) and the right (A + P − 1 …), and the plasmid (A … A + P); each
    // pair's twist is its number times 34.3°. Where two pieces meet they share their end pair, so strands and twist
    // run on unbroken. Before the plasmid joins, the arms share two pairs and the chromosome is whole; with 480 full
    // turns, the plasmid closes on itself and the arms meet in the same register. Seen from the culture or across the
    // nucleus the double helix is far under a pixel wide, so the DNA is drawn along its axis, a line a few pixels wide
    // (in the TK gene's colour along the gene); explored close to, it is drawn as its two strands.
    const seq = n => { const q = rng(n); return Array.from({length: n}, () => 'ACGT'[Math.floor(q() * 4)]).join(''); };
    const framesOf = n => Array.from({length: n}, () => ({origin: V(), q: new THREE.Quaternion()}));
    // A line glows less in the TK gene's deeper colour, so the gene reads as a stretch of its own.
    const piece = (n, colours, spans, fading = false) => {
      const holder = new THREE.Group(), axis = new THREE.Group(); world.add(holder);
      const d = createDuplex({pairs: sequencePairs(seq(n), local), template: colours[0], coding: colours[1], samples: 2}); holder.add(d.group, axis);
      const tubes = spans.map(([a, b, colour]) => ({a, b, tube: createTube(axis, {color: colour, radius: 10, max: b - a + 1, outline: true, capped: true,
        material: fadingMaterial(colour, {far: fading, glow: fading ? .3 : colour === COL.tk[0] ? .15 : .22})})}));
      return {holder, d, axis, tubes, frames: framesOf(n), dirty: true, fade: ''};
    };
    const left = piece(A + 1, [STRANDS.template, STRANDS.coding], [[0, A, STRANDS.template]], true), right = piece(A + 1, [STRANDS.template, STRANDS.coding], [[0, A, STRANDS.template]], true);
    const plasmid = piece(P + 1, COL.plasmid, [[0, TK[0], COL.plasmid[0]], [TK[0], TK[1], COL.tk[0]], [TK[1], P, COL.plasmid[0]]]);
    for (const k of [0, 1]) plasmid.d.segments(k, [[0, TK[0], COL.plasmid[k]], [TK[0], TK[1], COL.tk[k]], [TK[1], P + 1, COL.plasmid[k]]]);
    const F = {left: left.frames, right: right.frames, plasmid: plasmid.frames};
    const drawAxis = pc => { for (const {a, b, tube} of pc.tubes) { for (let i = a; i <= b; i++) tube.points[i - a].copy(pc.frames[i].origin); tube.update(b - a + 1); } };
    const q0 = new THREE.Quaternion(), qt = new THREE.Quaternion(), mb = new THREE.Matrix4(), yy = V(), zz = V(), xx = V();
    // A pair's frame from its place, axis (z, towards higher pair numbers) and the axis' reference (x0), turned by its twist.
    const frame = (f, i, origin, z, x0) => {
      f.origin.copy(origin); yy.crossVectors(z, x0);
      q0.setFromRotationMatrix(mb.makeBasis(x0, yy, z)); f.q.copy(qt.setFromAxisAngle(z, i * TWIST)).multiply(q0);
    };
    // A point on an arm at arc length s from where it meets the plasmid: along the chromosome's line, then bent down
    // into the nucleus. side −1 is the left arm, +1 the right.
    const DOWN = V(0, 1, 0), pa = V();
    const armPoint = (side, s, out, z, x0) => {
      let along, depth, phi;
      if (s <= STRAIGHT) { along = s; depth = 0; phi = 0; }
      else if (s <= STRAIGHT + BEND * Math.PI / 2) { phi = (s - STRAIGHT) / BEND; along = STRAIGHT + BEND * Math.sin(phi); depth = BEND * (1 - Math.cos(phi)); }
      else { phi = Math.PI / 2; along = STRAIGHT + BEND; depth = BEND + s - STRAIGHT - BEND * Math.PI / 2; }
      plane(side * along, LINE, out).addScaledVector(DOWN, depth);
      // The pair's axis runs towards higher pair numbers: inwards on the left arm, outwards on the right.
      const c = Math.cos(phi), sn = Math.sin(phi);
      if (side < 0) { z.copy(EU).multiplyScalar(c).addScaledVector(DOWN, -sn); x0.copy(EU).multiplyScalar(-sn).addScaledVector(UP, c); }
      else { z.copy(EU).multiplyScalar(c).addScaledVector(DOWN, sn); x0.copy(EU).multiplyScalar(sn).addScaledVector(UP, c); }
      return out;
    };
    const shape = {u: new Float64Array(P + 1), v: new Float64Array(P + 1), th: new Float64Array(P)};
    let posed = '';
    // Poses the three pieces for the plasmid's opening and joining (and the arms' slide apart).
    const poseSite = (open, w) => {
      const key = `${open.toFixed(4)},${w.toFixed(4)}`; if (key === posed) return; posed = key;
      plasmidShape(open, w, shape);
      for (let k = 0; k <= P; k++) {
        const a = k === 0 ? shape.th[0] : k === P ? shape.th[P - 1] : (shape.th[k - 1] + shape.th[k]) / 2;
        zz.copy(EU).multiplyScalar(Math.cos(a)).addScaledVector(EVV, Math.sin(a));
        frame(F.plasmid[k], A + k, plane(shape.u[k], shape.v[k], pa), zz, UP);
      }
      // The arms' ends follow the plasmid's once the chromosome has parted; before, they meet under it.
      const part = smooth(clamp(w / .4)), slideL = -shape.u[0] * part, slideR = shape.u[P] * part;
      for (let j = 0; j <= A; j++) frame(F.left[j], j, armPoint(-1, slideL + (A - j) * RISE, pa, zz, xx), zz, xx);
      for (let j = 0; j <= A; j++) frame(F.right[j], A + P - 1 + j, armPoint(1, slideR + (j - 1) * RISE, pa, zz, xx), zz, xx);
      for (const pc of [left, right, plasmid]) { drawAxis(pc); pc.dirty = true; }
    };
    poseSite(0, 0);
    // The plasmid's centre as it lies at the site (a closed circle), about which it turns while it falls.
    const centre = F.plasmid.reduce((s, f) => s.add(f.origin), V()).divideScalar(P + 1);
    at.site = SITE.toArray(); at.plasmidCentre = centre.toArray();

    // ---------- Thymidine kinase ----------
    // Human TK1 tetramers (1XBT, four subunits in shades of coral) in the cytoplasm just outside the nucleus, above the
    // plasmid: the first in the middle of the view, the others round it. Each is centred on its subunits, and the first
    // turned so its broad side faces the camera.
    const parts = ['TK1 A', 'TK1 B', 'TK1 C', 'TK1 D'].map(n => set.byName.get(n));
    const tkCentre = parts.reduce((s, p) => s.add(V(...p.center)), V()).divideScalar(4);
    const geoms = parts.map(p => surfaceGeometry(p, set.buffer));
    const axes = (() => {
      const cov = [0, 0, 0, 0, 0, 0, 0, 0, 0], v = V();
      for (const g of geoms) { const pos = g.attributes.position; for (let i = 0; i < pos.count; i += 3) { v.fromBufferAttribute(pos, i).sub(tkCentre); const a = v.toArray(); for (let r0 = 0; r0 < 3; r0++) for (let c0 = 0; c0 < 3; c0++) cov[r0 * 3 + c0] += a[r0] * a[c0]; } }
      return eigen(cov);
    })();
    const dSite = V(...D_SITE).normalize(), across = V().crossVectors(UP, dSite).normalize(), upScreen = V().crossVectors(dSite, across);
    const broad = new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().makeBasis(across, upScreen, dSite).multiply(new THREE.Matrix4().makeBasis(axes[0], axes[1], axes[2]).transpose()));
    const pr = rng(9), proteins = [];
    for (let k = 0; k < 8; k++) {
      const g = new THREE.Group(), q = k ? new THREE.Quaternion().setFromAxisAngle(V(pr() - .5, pr() - .5, pr() - .5).normalize(), 6.3 * pr()) : broad;
      geoms.forEach((geo, i) => { const m = new THREE.Mesh(geo, proteinMaterial(COL.protein[i])); m.position.copy(tkCentre).negate(); g.add(m); });
      const a = 6.3 * pr(), d = k ? 700 + 2200 * Math.sqrt(pr()) : 0;
      const holder = new THREE.Group(); holder.add(g); g.quaternion.copy(q);
      holder.position.copy(PROTEIN).addScaledVector(EU, d * Math.cos(a)).addScaledVector(EVV, d * Math.sin(a)).addScaledVector(DOWN, k ? 120 * (pr() - .2) : 0);
      world.add(holder); proteins.push({holder, made: T.protein - .3 + (k ? .9 + .45 * k : 0)});
    }
    at.protein = PROTEIN.toArray();

    // ---------- Levels of scale ----------
    // Each level shows over the range of camera distances (Å) at which it can be seen: the culture from afar, the
    // nucleus's DNA near to, the proteins only close up. They are set as each frame is drawn, from the camera as it is
    // then (the distance to the site stands for the view's scale), so a paused view is never left at the wrong level.
    const levels = D => ({cells: ramp(D, 70000, 190000), dna: 1 - ramp(D, 110000, 260000), proteins: 1 - ramp(D, 5000, 14000)});
    const pieces = [left, right, plasmid], shown = {plasmid: 0, arms: 0, rings: 0, proteins: proteins.map(() => 0)};
    let lastView = 0;
    const allCells = cells.concat(nodes.filter(n => n.depth > 0).map(n => n.cell)), viewSize = new THREE.Vector2();
    scene.onBeforeRender = (renderer, s, cam) => {
      const D = Math.max(1, cam.position.distanceTo(SITE)), pxPerA = innerHeight / (2 * D * Math.tan(cam.fov * Math.PI / 360)), L = levels(D);
      scene.fog.density = .32 / D; at.D = D; at.levels = L;
      cells.forEach(c => c.lod(L.cells)); nodes.forEach(n => n.cell.lod(L.cells));
      // DNA along its axis at least a few pixels wide (a little wider across the nucleus than in the culture), rebuilt
      // only when the scale has changed by a few per cent; its two strands once it is near enough to show them.
      // The renderer has already placed every object for this frame, so a piece rebuilt here has its end caps placed
      // again at once (otherwise a paused view would keep caps sized for the frame before).
      const rebuilt = new Set();
      if (Math.abs(Math.log(pxPerA / (lastView || 1))) > .05) {
        lastView = pxPerA;
        const px = mix(1.2, 2, 1 - ramp(D, 60000, 300000)), r = Math.max(10, px / pxPerA);
        for (const pc of pieces) { for (const {tube} of pc.tubes) { tube.radius = r; tube.outline.width = .7 / pxPerA; } drawAxis(pc); pc.d.view(pxPerA); rebuilt.add(pc); }
        setRingTube(Math.max(12, px / pxPerA));
      }
      // Its two strands only when explored: the guided camera shows the DNA as a line, which fades by the chrome.
      const near = document.body.classList.contains('exploring') ? ramp(pxPerA, .15, .3) : 0;
      [[plasmid, shown.plasmid * (shown.integrated ? L.dna : 1)], [left, shown.arms * L.dna], [right, shown.arms * L.dna]].forEach(([pc, v]) => {
        const strands = snapFade(v * near), line = snapFade(v * (1 - near)), key = `${strands},${line}`;
        if (strands > 0 && pc.dirty) { pc.d.pose(pc.frames); pc.dirty = false; rebuilt.add(pc); }
        if (key !== pc.fade) { pc.fade = key; fadeObject(pc.d.group, strands); fadeObject(pc.axis, line); }
      });
      rebuilt.forEach(pc => pc.holder.updateMatrixWorld(true));

      // The free part of the screen: the chromosome's material fades by it, each cell (body and nucleus), plasmid and
      // protein by its outline on screen; a plasmid on or in a cell no more than the cell.
      const rects = chromeRects(), target = renderer.getRenderTarget(), size = target ? viewSize.set(target.width, target.height) : renderer.getDrawingBufferSize(viewSize);
      ROOM.uRectCount.value = rects.length; rects.forEach((r, i) => ROOM.uRects.value[i].set(...r));
      ROOM.uScreen.value.set(innerWidth / size.x, innerHeight / size.y, innerHeight, 0); at.roomRects = rects;
      const pointRoom = (p, radius = 0) => { _p.copy(p).project(cam); if (_p.z >= 1) return 1; const x = (_p.x + 1) * innerWidth / 2, y = (1 - _p.y) * innerHeight / 2; return rects.reduce((m, r) => Math.min(m, roomFor(pointGap(x, y, r) - radius)), 1); };
      // A nucleus shows no further than its cell, except the transfected cell's, which the camera flies into.
      if (L.cells > .005) for (const cell of allCells) if (cell.shown > .005) {
        const b = roomOfPoints(cell.outline.body(), cam, rects), n = roomOfPoints(cell.outline.nucleus(), cam, rects);
        cell.clear(b, cell === cells[0] ? n : Math.min(b, n));
      }
      const ringsShown = shown.rings && L.cells > .02;
      ringMeshes.forEach(m => { m.visible = ringsShown; });
      if (ringsShown) {
        rings.forEach((g, k) => {
          const host = g.kind === 'dish' ? 1 : g.kind === 'nucleus' ? cells[g.end.cell].room.nucleus : cells[g.end.cell].room.body;
          g.room = Math.min(host, pointRoom(g.p, 3)); rs.setScalar(Math.max(1e-3, g.s * g.room));
          _p.copy(g.p).project(cam); g.screen = _p.z < 1 ? [(_p.x + 1) * innerWidth / 2, (1 - _p.y) * innerHeight / 2] : null;
          m4.compose(g.p, g.q, rs); ringMeshes.forEach(m => m.setMatrixAt(k, m4));
        });
        ringMeshes.forEach(m => { m.instanceMatrix.needsUpdate = true; });
      }
      const pxAt = d => innerHeight / (2 * d * Math.tan(cam.fov * Math.PI / 360));
      proteins.forEach((pr, k) => {
        const v = shown.proteins[k] * L.proteins;
        pr.room = v > .005 ? pointRoom(pr.holder.position, 45 * pxAt(Math.max(1, cam.position.distanceTo(pr.holder.position)))) : 1;
        fadeObject(pr.holder, snapFade(v * pr.room));
      });
    };

    return {
      at, cells, nodes, rings, dna: {left, right, plasmid, A, P}, proteins,  // for tests (?debug=1)
      update(t) {
        // The culture.
        const joined = t >= JOINED, tkOf = t => smooth(clamp((t - JOINED) / 1.5));
        let alive = 0;
        cells.forEach((cell, i) => {
          if (i === 0) return;
          const td = dies.get(i), round = ramp(t, td, td + 1.6), gone = ramp(t, td + 1.3, td + 2.9);
          cell.set({round, dead: round, scale: 1 - .18 * round, shown: 1 - gone});
          if (gone < 1) alive++;
        });
        // The transfected cell and its descendants: each rounds up before it divides; its two daughters take over from it,
        // move apart and spread.
        let colony = 0;
        for (const node of nodes) {
          const born = node.parent ? node.parent.divide : -Infinity, ends = node.divide ?? Infinity;
          const shownFrom = node.parent ? ramp(t, born - .2, born + .2) : 1, shownTo = node.children.length ? 1 - ramp(t, ends - .2, ends + .2) : 1;
          const visible = shownFrom * shownTo;
          if (t >= born && t < ends) colony++;
          if (visible <= .005) { node.cell.set({shown: 0}); continue; }
          let x = node.x, z = node.z, lift = node.lift, round = node.children.length ? ramp(t, ends - 1.1, ends - .1) : 0;
          if (node.parent) {
            // From the middle of the rounded mother, a little way towards its own place, to that place.
            const p = node.parent, move = smooth(clamp((t - born - .2) / 1.6)), dx = node.x - p.x, dz = node.z - p.z, len = Math.hypot(dx, dz) || 1, off = .36 * p.cell.Rr;
            x = mix(p.x + dx / len * off, node.x, move); z = mix(p.z + dz / len * off, node.z, move); lift = mix(p.lift, node.lift, move);
            round = Math.max(round, 1 - smooth(clamp((t - born - .4) / 1.6)) * (node.children.length ? 1 : .7));
          }
          node.cell.set({x, z, lift, round, shown: visible, tk: node.parent ? 1 : tkOf(t), nucleus: 1 - round});
        }
        at.alive = alive; at.colony = colony; at.joined = joined;

        // Plasmids in the culture; they are washed away once selection begins.
        const washed = 1 - ramp(t, T.select + .5, T.select + 2.5);
        // (placed as each frame is drawn, by how much of the screen is free: see onBeforeRender)
        rings.forEach(g => { ringAt(g, t, g.q ||= new THREE.Quaternion(), g.p ||= V()); g.s = smooth(clamp((t - g.t0) / .7)) * washed; });
        shown.rings = t > T.add && washed > .01;

        // The site's DNA: the plasmid falls in, then opens and joins the chromosome. The chromosome shows only near to,
        // and all of it is left behind once the view returns to the culture.
        poseSite(opening(t), joining(t));
        const {q, p} = plasmidPlace(t, centre);
        plasmid.holder.quaternion.copy(q); plasmid.holder.position.copy(p).sub(centre.clone().applyQuaternion(q));
        shown.plasmid = t < T.add + .4 ? 0 : ramp(t, T.add + .4, T.add + 1.1); shown.arms = t > T.add ? 1 : 0; shown.integrated = t >= T.select - 1;

        // Thymidine kinase, made one molecule after another once the gene is expressed.
        proteins.forEach((pr, k) => { shown.proteins[k] = ramp(t, pr.made, pr.made + .9); });
        at.tk = tkOf(t); at.proteinsShown = shown.proteins.filter(v => v > .5).length;
        at.plasmid = p.toArray();
      },
      annotate(t, {label, tag}) {
        const cell = cells[0].c, onDNA = (pc, k) => pc.holder.localToWorld(pc.frames[k].origin.clone());
        // Only what shows whole in the free part of the screen is named.
        const clear = v => v > .9;
        if (t > 1.6 && t < T.add) {
          if (clear(cells[0].room.body)) label(V(cell.x + .62 * cell.R, -.45 * topOf(cell, .62 * cell.R, 0) - 3000, cell.z), 'Cell lacking the TK gene', 'Cannot make thymidine kinase', {color: LABEL.cell});
          const n = CELLS[2]; if (clear(cells[2].room.nucleus)) tag(V(n.x, n.nucleus.y * 1.9, n.z), 'Nucleus', {color: hex(COL.nucleus)});
        } else if (t > T.add + 5.6 && t < T.nucleus - 1.2) {
          if (!clear(named.room ?? 1) || !inView(named)) { named = nameable() || named; at.named = named.end.toArray(); }
          if (clear(named.room ?? 1)) label(ringAt(named, t, new THREE.Quaternion(), V()), 'Plasmid', 'DNA carrying the TK gene', {color: LABEL.plasmid});
          if (t > T.add + 8.4 && clear(cells[0].room.nucleus)) label(plasmidPlace(t, centre).p.clone().addScaledVector(EU, 2700), 'Taken up by a cell', 'Now in its nucleus', {color: LABEL.plasmid, key: 'taken up'});
        } else if (t > T.nucleus + 2.6 && t < T.protein - 1) {
          label(onDNA(plasmid, P / 2), 'TK gene', 'On the plasmid, not in a chromosome', {color: LABEL.tk});
          tag(onDNA(right, 900), 'Chromosome’s DNA', {color: LABEL.dna});
        } else if (t > T.protein + 2.4 && t < T.integrate - 1) {
          label(PROTEIN.clone(), 'Thymidine kinase', 'Made from the TK gene', {color: LABEL.tk});
        } else if (t > JOINED + .4 && t < ASK + .22) {
          label(onDNA(plasmid, P / 2), 'TK gene', 'Now part of a chromosome', {color: LABEL.tk});
          tag(onDNA(right, 1100), 'Chromosome’s DNA', {color: LABEL.dna});
        } else if (t > T.select + 2.6) {
          // One that dies in the middle of the view in any window.
          const dying = 4, c = CELLS[dying], td = dies.get(dying);
          if (t < td + 1.8 && clear(cells[dying].room.body)) label(V(c.x, -c.H * .7, c.z), 'Cell without TK', 'Dies under selection', {color: '#b9b0dc'});
          if (t > T.select + 11.4) label(V(0, -60000, 0), 'Colony of TK⁺ cells', 'Descendants of the transfected cell', {color: LABEL.tk});
        }
      },
    };
  },
});

// Fades that finish exactly at 0 or 1, so nothing is left part-transparent.
function snapFade(v) { return v > .995 ? 1 : v < .005 ? 0 : v; }

// Principal axes of a symmetric 3×3 matrix (row-major), largest spread first (Jacobi rotations).
function eigen(m) {
  const a = [[m[0], m[1], m[2]], [m[3], m[4], m[5]], [m[6], m[7], m[8]]], v = [[1, 0, 0], [0, 1, 0], [0, 0, 1]];
  for (let sweep = 0; sweep < 30; sweep++) for (const [p, q] of [[0, 1], [0, 2], [1, 2]]) {
    if (Math.abs(a[p][q]) < 1e-9) continue;
    const th = (a[q][q] - a[p][p]) / (2 * a[p][q]), t = Math.sign(th || 1) / (Math.abs(th) + Math.sqrt(th * th + 1)), c = 1 / Math.sqrt(t * t + 1), s = t * c;
    for (let k = 0; k < 3; k++) { const x = a[k][p], y = a[k][q]; a[k][p] = c * x - s * y; a[k][q] = s * x + c * y; }
    for (let k = 0; k < 3; k++) { const x = a[p][k], y = a[q][k]; a[p][k] = c * x - s * y; a[q][k] = s * x + c * y; }
    for (let k = 0; k < 3; k++) { const x = v[k][p], y = v[k][q]; v[k][p] = c * x - s * y; v[k][q] = s * x + c * y; }
  }
  const order = [0, 1, 2].sort((i, j) => a[j][j] - a[i][i]);
  const axes = order.map(i => V(v[0][i], v[1][i], v[2][i]).normalize());
  if (axes[0].clone().cross(axes[1]).dot(axes[2]) < 0) axes[2].negate();
  return axes;
}
