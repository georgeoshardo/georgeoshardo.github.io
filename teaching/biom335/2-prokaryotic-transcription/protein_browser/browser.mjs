// Protein browser: every protein of the prokaryotic transcription chapter as a slowly turning 3D icon;
// one opens full screen with an interactive structure and its facts. Icons share one fixed canvas
// (each drawn into its card's box with a scissor); the open protein has its own canvas and controls.
import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {PALETTE, loadSurfaceSet, surfaceGeometry, proteinMaterial, createRenderer, studio, fitDistance, restoreEnvironment} from '../shared/molecules.mjs';
import {GROUPS, PROTEINS} from './proteins.mjs';
import {INFO} from '../transcription_3d/inspect.mjs';
import {setRich} from '../shared/text.mjs';

const $ = id => document.getElementById(id), V = (...a) => new THREE.Vector3(...a);
const FILM = '../transcription_3d/';
const hex = n => '#' + n.toString(16).padStart(6, '0');
// σ factor names and Unicode subscripts are set as <sub> (../shared/text.mjs).
const setSymbol = setRich, rich = (text, tag = 'span') => setRich(document.createElement(tag), text);
const rmq = matchMedia('(prefers-reduced-motion: reduce)');
let calm = rmq.matches;

// ---------- What each card shows ----------
// Parts name a mesh in one of three surface sets: the film's RNAP, NusG and Rho (8E6X/8E6W), its σ70
// and NusA (4YLN, 6FLQ, aligned to the same core) and the other σ factors (AlphaFold models).
const SIGMA = {sigma70: 0xe987a3, sigma54: 0xd66a8e, sigmaS: 0xe595ad, sigma32: 0xde7390, sigmaF: 0xdb93aa, sigmaE: 0xc97ba3, fecI: 0xd9889f};
const SUB = {
  beta: {mesh: 'β', color: PALETTE.beta, label: 'β', link: 'beta'},
  betaPrime: {mesh: 'β′', color: PALETTE.betaPrime, label: 'β′', link: 'betaPrime'},
  alphaI: {mesh: 'α I', color: PALETTE.alpha, label: 'α (I)', link: 'alpha'},
  alphaII: {mesh: 'α II', color: PALETTE.alpha2, label: 'α (II)', link: 'alpha'},
  omega: {mesh: 'ω', color: PALETTE.omega, label: 'ω', link: 'omega'},
  sigma70: {set: 'acc', mesh: 'σ70', color: SIGMA.sigma70, label: 'σ70', link: 'sigma70'},
};
const CORE = [SUB.beta, SUB.betaPrime, SUB.alphaI, SUB.alphaII, SUB.omega];
const MODELS = {
  core: {parts: CORE, accent: 0x6fb3c0, wide: true},
  holoenzyme: {parts: [...CORE, SUB.sigma70], accent: 0xe7a3b6, wide: true},
  beta: {parts: [SUB.beta], accent: 0x56c2b1},
  betaPrime: {parts: [SUB.betaPrime], accent: 0x7fa3e3},
  alpha: {parts: [SUB.alphaI, SUB.alphaII], accent: 0xd6c496},
  omega: {parts: [SUB.omega], accent: 0xc2bdb2},
  sigma70: {parts: [{...SUB.sigma70, link: null}], accent: 0xf094ae},
  ...Object.fromEntries(['sigma54', 'sigmaS', 'sigma32', 'sigmaF', 'sigmaE', 'fecI'].map(id =>
    [id, {parts: [{set: 'sigma', id, color: SIGMA[id]}], accent: new THREE.Color(SIGMA[id]).lerp(new THREE.Color(0xffffff), .12).getHex()}])),
  nusA: {parts: [{set: 'acc', mesh: 'NusA', color: PALETTE.nusA}], accent: 0xb9d56b},
  nusG: {parts: [{mesh: 'NusG NGN', color: PALETTE.nusG, label: 'N-terminal domain'}, {mesh: 'NusG KOW', color: PALETTE.nusGKow, label: 'C-terminal (KOW) domain'}], accent: 0xc08a4c},
  rho: {parts: 'ABCDEF'.split('').map((c, i) => ({mesh: `Rho ${c}`, color: PALETTE.rho[i], label: `Subunit ${i + 1}`})), accent: 0x9d7cc0, legend: false},
};
// Proteins whose structure shares the core enzyme's coordinates can be shown inside it, faintly.
const CONTEXT = {beta: CORE, betaPrime: CORE, alpha: CORE, omega: CORE, sigma70: CORE,
  nusA: CORE, nusG: CORE};
const CONTEXT_LABEL = {sigma70: 'On the core enzyme', nusA: 'On RNA polymerase', nusG: 'On RNA polymerase'};
let contextOn = false;
const SOURCES = {
  '8E6X': 'PDB 8E6X · E. coli Rho-dependent pre-termination complex, RNA polymerase and NusG (Molodtsov et al., Nature 2023)',
  '8E6W': 'PDB 8E6W · E. coli Rho-dependent pre-termination complex, Rho (Molodtsov et al., Nature 2023)',
  '4YLN': 'PDB 4YLN · E. coli transcription initiation complex (Zuo and Steitz, Mol Cell 2015)',
  '6FLQ': 'PDB 6FLQ · E. coli RNA polymerase paused elongation complex bound to NusA (Guo et al., Mol Cell 2018)',
};
// Where each protein appears in the transcription film: [chapter, time, route].
const FILM_AT = {
  core: [['Core enzyme', 0]], holoenzyme: [['Sigma binding', 9], ['Closed complex', 34]],
  beta: INFO.beta.at, betaPrime: INFO.betaPrime.at, alpha: INFO.alphaI.at, omega: INFO.omega.at,
  sigma70: INFO.sigma.at, nusA: INFO.nusA.at, nusG: INFO.nusG.at, rho: INFO.rho.at,
};
// Film frame: the textbook view (upstream left, downstream right, RNA leaving upward), world −y up.
const VIEW = V(110, 175, -490).normalize();
// No ambient-occlusion pass here, so surfaces are exposed a little lower than in the film.
const EXPOSURE = .8;

// ---------- Loading ----------
let sets;
async function load() {
  const detail = $('load-detail');
  let shown = -1;
  const bar = p => { const tens = Math.floor(p * 10) * 10; if (tens !== shown) { shown = tens; detail.textContent = `Loading structures · ${tens}%`; } };
  const [film, acc, sigma] = await Promise.all([
    loadSurfaceSet(FILM + 'assets/structure.json', FILM + 'assets/molecular_surfaces.bin', bar),
    loadSurfaceSet(FILM + 'assets/accessories.json', FILM + 'assets/accessories.bin'),
    loadSurfaceSet('assets/sigma_models.json', 'assets/sigma_models.bin'),
  ]);
  sets = {film, acc, sigma};
}
function recordOf(part) {
  const set = sets[part.set || 'film'], rec = part.id ? set.byId.get(part.id) : set.byName.get(part.mesh);
  if (!rec) throw new Error(`Missing structure ${part.id || part.mesh}`);
  return {set, rec};
}

// A model: the parts' meshes in an inner group centred on the pivot, which turns. With `context`, the
// rest of the enzyme it binds is added as faint, unpickable ghosts in the same coordinates.
function buildModel(id, {context = false} = {}) {
  const pivot = new THREE.Group(), inner = new THREE.Group(), parts = [], ghosts = [];
  pivot.add(inner);
  for (const part of MODELS[id].parts) {
    const {set, rec} = recordOf(part), mesh = new THREE.Mesh(surfaceGeometry(rec, set.buffer), proteinMaterial(part.color));
    mesh.userData.part = part; mesh.userData.record = rec;
    inner.add(mesh); parts.push(mesh);
  }
  const box = new THREE.Box3();
  for (const m of parts) box.union(m.geometry.boundingBox);
  const center = box.getCenter(V());
  // The exact extent about the centre (every vertex), so icons fill their boxes.
  let r2 = 0;
  for (const m of parts) { const a = m.geometry.attributes.position.array; for (let i = 0; i < a.length; i += 3) { const x = a[i] - center.x, y = a[i + 1] - center.y, z = a[i + 2] - center.z; r2 = Math.max(r2, x * x + y * y + z * z); } }
  const radius = Math.sqrt(r2);
  inner.position.copy(center).negate();
  let whole = radius;
  if (context && CONTEXT[id]) {
    const own = new Set(MODELS[id].parts.map(p => p.mesh));
    for (const part of CONTEXT[id]) {
      if (own.has(part.mesh)) continue;
      const {set, rec} = recordOf(part), m = new THREE.Mesh(surfaceGeometry(rec, set.buffer), ghostMaterial(part.color));
      m.renderOrder = 1; m.userData.record = rec; inner.add(m); ghosts.push(m);
      const a = m.geometry.attributes.position.array;
      for (let i = 0; i < a.length; i += 3) whole = Math.max(whole, Math.hypot(a[i] - center.x, a[i + 1] - center.y, a[i + 2] - center.z));
    }
  }
  return {pivot, parts, ghosts, radius, whole};
}

function ghostMaterial(color) {
  const m = proteinMaterial(new THREE.Color(color).lerp(new THREE.Color(0x8fa3ad), .55).getHex(), {rim: .5});
  m.transparent = true; m.opacity = .13; m.depthWrite = false; m.side = THREE.FrontSide;
  return m;
}

function sourcesOf(model) {
  const lines = new Set();
  for (const m of [...model.parts, ...model.ghosts]) {
    const r = m.userData.record;
    if (r.uniprot) lines.add(`AlphaFold DB model ${r.source} (UniProt ${r.uniprot}), residues ${r.residues[0]}–${r.residues[1]} of ${r.length} · Jumper et al., Nature 2021; Varadi et al., Nucleic Acids Res 2024 · CC BY 4.0`);
    else lines.add(SOURCES[r.source] || r.source);
  }
  return [...lines];
}

// ---------- The grid ----------
const cards = [];
let iconRenderer;
function buildGrid() {
  const byGroup = Object.fromEntries(GROUPS.map(g => [g.id, []]));
  for (const p of PROTEINS) byGroup[p.group]?.push(p);
  const root = $('groups'), filters = document.querySelector('.filters');
  for (const g of GROUPS) {
    const section = document.createElement('section');
    section.className = 'group'; section.dataset.group = g.id; section.setAttribute('aria-labelledby', `g-${g.id}`);
    section.innerHTML = `<div class="group-head"><h2 id="g-${g.id}"></h2><p></p></div><div class="grid"></div>`;
    section.querySelector('h2').textContent = g.title; setSymbol(section.querySelector('p'), g.intro || '');
    const grid = section.querySelector('.grid');
    for (const p of byGroup[g.id]) grid.append(card(p));
    root.append(section);
    const f = document.createElement('button');
    f.className = 'pill'; f.dataset.filter = g.id; f.setAttribute('aria-pressed', 'false'); f.textContent = g.title;
    filters.append(f);
  }
  filters.addEventListener('click', e => {
    const b = e.target.closest('[data-filter]'); if (!b) return;
    filters.querySelectorAll('[data-filter]').forEach(x => x.setAttribute('aria-pressed', String(x === b)));
    document.querySelectorAll('.group').forEach(s => { s.hidden = b.dataset.filter !== 'all' && s.dataset.group !== b.dataset.filter; });
    relayout();
  });
}

function card(p) {
  const spec = MODELS[p.id], el = document.createElement('button');
  el.className = 'card' + (spec.wide ? ' wide' : ''); el.dataset.id = p.id; el.style.setProperty('--c', hex(spec.accent));
  el.setAttribute('aria-label', `${p.name}${p.gene ? `, ${p.gene}` : ''}. ${p.short}`);
  el.innerHTML = `<span class="icon"><span class="symbol"></span></span><span class="label"><span class="name"></span><span class="gene"></span><span class="short"></span></span>`;
  setSymbol(el.querySelector('.symbol'), p.symbol);
  setSymbol(el.querySelector('.name'), p.name);
  const gene = el.querySelector('.gene');
  if (p.gene) { const i = document.createElement('i'); i.textContent = p.gene; gene.append(i); } else gene.remove();
  setSymbol(el.querySelector('.short'), p.short);
  const scene = new THREE.Scene(), camera = new THREE.PerspectiveCamera(28, 1, 1, 5000), model = buildModel(p.id);
  studio(scene, camera, iconRenderer); scene.add(model.pivot);
  camera.position.copy(VIEW).multiplyScalar(fitDistance(camera, model.radius, spec.wide ? .96 : .9)); camera.lookAt(0, 0, 0);
  const c = {id: p.id, el, icon: el.querySelector('.icon'), scene, camera, model, angle: cards.length * .9, hover: 0, hovering: false};
  el.addEventListener('pointerenter', () => { c.hovering = true; wake(); });
  el.addEventListener('pointerleave', () => { c.hovering = false; wake(); });
  el.addEventListener('focus', () => { c.hovering = true; wake(); });
  el.addEventListener('blur', () => { c.hovering = false; wake(); });
  el.addEventListener('click', () => open(p.id));
  cards.push(c);
  return el;
}

// ---------- The open protein ----------
let detail = null, openId = null, opener = null, hintTimer = 0, retired = [];
const inerted = [];
function setupDetail() {
  const view = $('detail-view'), renderer = createRenderer({alpha: true, exposure: EXPOSURE});
  view.append(renderer.domElement);
  keepContext(renderer, () => [detail.scene]);
  const scene = new THREE.Scene(), camera = new THREE.PerspectiveCamera(30, 1, 1, 8000);
  studio(scene, camera, renderer);
  const controls = new OrbitControls(camera, view);
  controls.enableDamping = true; controls.dampingFactor = .08; controls.enablePan = false; controls.rotateSpeed = .8;
  controls.addEventListener('start', () => { controls.autoRotate = false; $('view-hint')?.classList.add('gone'); });
  controls.addEventListener('change', wake);
  detail = {renderer, scene, camera, controls, model: null, hovered: null, highlight: null};
  new ResizeObserver(wake).observe(view);
  // Hover names a part; a click on a part of a complex opens that protein.
  const ray = new THREE.Raycaster(), ndc = new THREE.Vector2();
  let down = null;
  const hit = e => {
    if (!detail.model) return null;
    const r = view.getBoundingClientRect();
    ndc.set((e.clientX - r.left) / r.width * 2 - 1, -(e.clientY - r.top) / r.height * 2 + 1);
    ray.setFromCamera(ndc, camera);
    return ray.intersectObjects(detail.model.parts, false)[0]?.object || null;
  };
  view.addEventListener('pointermove', e => {
    if (e.buttons) return;
    const m = hit(e), tag = $('hover-tag');
    setHover(m);
    if (m && detail.model.parts.length > 1) {
      const part = m.userData.part, r = view.getBoundingClientRect(), stage = view.parentElement.getBoundingClientRect(), p = part.link && part.link !== openId ? PROTEINS.find(x => x.id === part.link) : null;
      tag.innerHTML = ''; tag.append(rich(part.label || ''));
      if (p) tag.append(rich(p.name, 'small'));
      tag.style.left = `${e.clientX - stage.left}px`; tag.style.top = `${e.clientY - stage.top}px`; tag.hidden = false;
      view.style.cursor = p ? 'pointer' : '';
    } else { tag.hidden = true; view.style.cursor = ''; }
  });
  view.addEventListener('pointerleave', () => { setHover(null); $('hover-tag').hidden = true; });
  // A tap is one pointer that never strayed more than 5 px; drags that come back and pinches are not taps.
  const pointers = new Map();
  let multi = false;
  view.addEventListener('pointerdown', e => { pointers.set(e.pointerId, {x: e.clientX, y: e.clientY, far: 0}); if (pointers.size > 1) multi = true; });
  view.addEventListener('pointermove', e => { const q = pointers.get(e.pointerId); if (q) q.far = Math.max(q.far, Math.hypot(e.clientX - q.x, e.clientY - q.y)); });
  const lift = e => { pointers.delete(e.pointerId); if (!pointers.size) setTimeout(() => { multi = false; }); };
  view.addEventListener('pointercancel', lift);
  view.addEventListener('pointerup', e => {
    const q = pointers.get(e.pointerId), tap = q && !multi && pointers.size === 1 && q.far <= 5;
    lift(e);
    if (!tap) return;
    const link = hit(e)?.userData.part.link;
    if (link && link !== openId) open(link);
  });
  // From the keyboard the view turns with the arrow keys and zooms with + and −.
  view.addEventListener('keydown', e => {
    const turn = {ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1]}[e.key], zoom = {'+': 1 / 1.15, '=': 1 / 1.15, '-': 1.15, '_': 1.15}[e.key];
    if ((!turn && !zoom) || e.altKey || e.metaKey || e.ctrlKey) return;
    e.preventDefault(); e.stopPropagation();
    const c = detail.camera, o = c.position.clone().sub(detail.controls.target);
    if (turn) {
      o.applyAxisAngle(c.up, turn[0] * .21);
      const side = o.clone().cross(c.up).normalize(), tilted = o.clone().applyAxisAngle(side, turn[1] * .17), lat = tilted.angleTo(c.up);
      if (lat > .12 && lat < Math.PI - .12) o.copy(tilted);
    } else o.setLength(Math.min(detail.controls.maxDistance, Math.max(detail.controls.minDistance, o.length() * zoom)));
    detail.controls.autoRotate = false;
    c.position.copy(detail.controls.target).add(o); c.lookAt(detail.controls.target); detail.controls.update(); wake();
  });
  $('context').addEventListener('click', () => { contextOn = !contextOn; if (openId) { setModel(openId, {keepView: true}); fill(PROTEINS.find(x => x.id === openId), MODELS[openId], detail.model); } });
  $('close').addEventListener('click', () => close());
  $('prev').addEventListener('click', () => step(-1));
  $('next').addEventListener('click', () => step(1));
  document.addEventListener('keydown', e => {
    if (!openId) return;
    if (e.key === 'Escape') { e.preventDefault(); close(); }
    else if ((e.key === 'ArrowLeft' || e.key === 'ArrowRight') && !(e.altKey || e.metaKey || e.ctrlKey || e.shiftKey) && !e.target.closest('input,select,#detail-view')) { e.preventDefault(); step(e.key === 'ArrowLeft' ? -1 : 1); }
  });
}

function setHover(mesh) {
  if (detail.hovered === mesh) return;
  detail.hovered = mesh; paintParts(); wake();
}
// The hovered part (or legend item) glows and the rest of a complex dims, so one subunit stands out.
function paintParts() {
  const focus = detail.highlight || (detail.model?.parts.length > 1 ? detail.hovered : null);
  for (const m of detail.model?.parts || []) {
    const u = m.material.userData.uniforms, lit = !focus || m === focus || (focus.userData.part.link && m.userData.part.link === focus.userData.part.link && m.userData.part.link !== openId);
    m.material.color.copy(m.material.userData.base).multiplyScalar(lit ? 1 : .38);
    u.uGlow.value = focus && lit ? .35 : 0;
  }
}

// History: opening from the grid pushes one entry (depth 1); moving between proteins replaces it, so Back
// (or ×, Esc) always returns to the grid.
function open(id, {push = true} = {}) {
  const p = PROTEINS.find(x => x.id === id); if (!p) return;
  const first = !openId;
  if (first) opener = document.activeElement;
  openId = id;
  const spec = MODELS[id], d = detail;
  setModel(id, {keepView: false});
  d.controls.autoRotate = !calm; d.controls.autoRotateSpeed = .7; d.controls.update(); d.fitted = false;
  fill(p, spec, d.model);
  const el = $('detail'); el.style.setProperty('--c', hex(spec.accent));
  if (el.hidden) {
    el.hidden = false; document.body.style.overflow = 'hidden'; $('stage').style.visibility = 'hidden';
    for (const child of document.body.children) if (child !== el && !child.inert && child.tagName !== 'SCRIPT') { child.inert = true; inerted.push(child); }
  }
  $('detail-text').scrollTop = 0;
  // Focus moves into the dialog when it opens; stepping with ‹ › keeps it where it was.
  if (first || !el.contains(document.activeElement)) $('close').focus({preventScroll: true});
  if (push) (first ? history.pushState : history.replaceState).call(history, {id, depth: 1}, '', `#${id}`);
  document.title = `${p.name} · Proteins of bacterial transcription`;
  clearTimeout(hintTimer); $('view-hint')?.classList.remove('gone'); hintTimer = setTimeout(() => $('view-hint')?.classList.add('gone'), 5000);
  wake();
}

// Builds the open protein (with the enzyme around it when that is on) and frames it.
function setModel(id, {keepView}) {
  const d = detail, withContext = contextOn && !!CONTEXT[id];
  // Old materials are disposed after the next frame, so their shader program is reused rather than rebuilt.
  if (d.model) { d.scene.remove(d.model.pivot); retired.push(...[...d.model.parts, ...d.model.ghosts].map(m => m.material)); }
  d.model = buildModel(id, {context: withContext}); d.hovered = d.highlight = null; d.scene.add(d.model.pivot);
  d.fitR = withContext ? d.model.whole : d.model.radius;
  const dir = keepView ? d.camera.position.clone().sub(d.controls.target).normalize() : VIEW;
  d.camera.position.copy(dir).multiplyScalar(fitDistance(d.camera, d.fitR, .78)); d.camera.lookAt(0, 0, 0);
  d.controls.target.set(0, 0, 0); d.controls.minDistance = d.model.radius * 1.15; d.controls.maxDistance = d.fitR * 7;
  const toggle = $('context'); toggle.hidden = !CONTEXT[id]; toggle.setAttribute('aria-pressed', String(withContext));
  $('context-label').textContent = CONTEXT_LABEL[id] || 'In the core enzyme';
  if (keepView) { d.controls.update(); wake(); }
}

function close({push = true} = {}) {
  if (!openId) return;
  // With our own entry on the stack, going back to the grid entry closes the view (through popstate).
  if (push && history.state?.depth === 1) { history.back(); return; }
  const id = openId; openId = null;
  $('detail').hidden = true; document.body.style.overflow = ''; $('stage').style.visibility = '';
  for (const child of inerted.splice(0)) child.inert = false;
  document.title = 'Proteins of bacterial transcription';
  if (push) history.replaceState({depth: 0}, '', location.pathname + location.search);
  const back = opener && opener !== document.body && opener.isConnected ? opener : cards.find(c => c.id === id)?.el;
  back?.focus({preventScroll: false});
  relayout();
}

function step(dir) {
  const i = PROTEINS.findIndex(p => p.id === openId);
  open(PROTEINS[(i + dir + PROTEINS.length) % PROTEINS.length].id);
}

function fill(p, spec, model) {
  const group = GROUPS.find(g => g.id === p.group);
  $('detail-group').querySelector('span').textContent = group?.title || '';
  setSymbol($('detail-title'), p.name);
  const meta = $('detail-meta'); meta.textContent = '';
  const bits = [];
  if (p.gene) { const i = document.createElement('i'); i.textContent = p.gene; bits.push(i); }
  if (p.symbol && p.symbol !== p.name) { const s = document.createElement('span'); setSymbol(s, p.symbol); bits.push(s); }
  if (p.aka?.length) bits.push(rich(`also ${p.aka.join(', ')}`));
  bits.forEach((b, i) => { if (i) meta.append(' · '); meta.append(b); });
  setSymbol($('detail-short'), p.short);
  const table = $('detail-table'); table.textContent = '';
  if (p.table) {
    for (const [k, label] of [['size', 'Length'], ['promoters', 'Promoters'], ['sequence', 'Promoter sequence']]) {
      if (!p.table[k]) continue;
      const dt = document.createElement('dt'), dd = document.createElement('dd');
      dt.textContent = label; const v = p.table[k] === '?' ? '—' : p.table[k]; if (k === 'sequence') { dd.className = 'sequence'; dd.textContent = v; } else setSymbol(dd, v);
      table.append(dt, dd);
    }
  }
  table.hidden = !p.table;
  const facts = $('detail-facts'); facts.textContent = '';
  for (const f of p.facts) facts.append(rich(f, 'li'));
  // Parts of a complex: hovering highlights, clicking opens the subunit.
  const parts = $('parts'); parts.textContent = '';
  if (model.parts.length > 1 && spec.legend !== false) {
    const seen = new Set();
    for (const m of model.parts) {
      const part = m.userData.part, key = part.link && part.link !== p.id ? part.link : part.label;
      if (seen.has(key)) continue; seen.add(key);
      const li = document.createElement('li'), linked = part.link && part.link !== p.id, el = document.createElement(linked ? 'button' : 'span');
      el.className = 'pill'; el.style.setProperty('--c', hex(part.color));
      el.innerHTML = '<span class="dot"></span>'; const t = document.createElement('span'); setSymbol(t, linked ? (PROTEINS.find(x => x.id === part.link)?.symbol || part.label) : part.label); el.append(t);
      if (linked) { el.addEventListener('click', () => open(part.link)); el.setAttribute('aria-label', `Open ${PROTEINS.find(x => x.id === part.link)?.name}`); }
      const on = () => { detail.highlight = m; paintParts(); wake(); }, off = () => { detail.highlight = null; paintParts(); wake(); };
      el.addEventListener('pointerenter', on); el.addEventListener('pointerleave', off);
      if (linked) { el.addEventListener('focus', on); el.addEventListener('blur', off); }
      li.append(el); parts.append(li);
    }
  }
  const filmAt = FILM_AT[p.id] || [], film = $('film-links'); film.textContent = '';
  for (const [name, t, route] of filmAt) {
    const a = document.createElement('a');
    a.className = 'pill'; a.href = `${FILM}index.html?t=${t}${route ? `&path=${route}` : ''}`; a.textContent = name;
    film.append(a);
  }
  $('detail-film').hidden = !filmAt.length;
  const related = $('related'); related.textContent = '';
  for (const id of p.related || []) {
    const q = PROTEINS.find(x => x.id === id); if (!q) continue;
    const b = document.createElement('button');
    b.className = 'pill'; b.style.setProperty('--c', hex(MODELS[id].accent));
    b.innerHTML = '<span class="dot"></span>'; b.append(rich(q.name));
    b.addEventListener('click', () => open(id));
    related.append(b);
  }
  $('detail-related').hidden = !related.children.length;
  const notes = $('notes-link');
  notes.href = `${FILM}notes.html#${p.notes}`; notes.parentElement.hidden = !p.notes;
  const source = $('detail-source'); source.textContent = '';
  for (const line of sourcesOf(model)) { const s = document.createElement('span'); s.textContent = line; source.append(s); }
}

// ---------- Drawing ----------
let raf = 0, last = 0, iconTick = false, iconDt = 0, layoutDirty = true;
const turning = () => !calm || cards.some(c => c.hovering || Math.abs(c.hover) > .002);
function wake() { if (!raf) raf = requestAnimationFrame(frame); }
// Scrolling, resizing and filtering move the cards under the fixed canvas: the next frame must redraw.
function relayout() { layoutDirty = true; wake(); }
function syncPixelRatio(r) { const pr = Math.min(devicePixelRatio, 2); if (r.getPixelRatio() !== pr) r.setPixelRatio(pr); }
function frame(now) {
  raf = 0;
  const dt = last ? Math.min(.05, (now - last) / 1000) : 0; last = now;
  let busy = false;
  if (openId) busy = drawDetail(dt);
  // Icons turn slowly, so every other frame (about 30 fps) is enough, unless the cards have moved.
  else if (layoutDirty || (iconTick = !iconTick) || !turning()) { busy = drawIcons(iconDt + dt); iconDt = 0; layoutDirty = false; }
  else { iconDt += dt; busy = true; }
  if (busy) wake(); else last = 0;
}

let drawn = 0;
function drawIcons(dt) {
  // Positions are measured against the canvas itself, which is what the drawing buffer covers.
  const r = iconRenderer, box = r.domElement.getBoundingClientRect(), W = Math.round(box.width), H = Math.round(box.height);
  drawn = 0;
  syncPixelRatio(r);
  const size = r.getSize(new THREE.Vector2());
  if (size.x !== W || size.y !== H) r.setSize(W, H, false);
  r.setScissorTest(false); r.clear(); r.setScissorTest(true);
  let busy = false;
  for (const c of cards) {
    const target = c.hovering ? 1 : 0;
    c.hover += (target - c.hover) * Math.min(1, dt * 8);
    if (Math.abs(target - c.hover) > .002) busy = true;
    if (!calm) { c.angle += dt * (.3 + .9 * c.hover); busy = true; }
    const b = c.icon.getBoundingClientRect();
    if (b.bottom < box.top || b.top > box.bottom || b.width < 2 || c.el.closest('[hidden]')) continue;
    c.model.pivot.rotation.y = calm ? .6 + c.hover * .4 : c.angle;
    for (const m of c.model.parts) m.material.userData.uniforms.uGlow.value = .16 * c.hover;
    const aspect = b.width / b.height;
    if (c.camera.aspect !== aspect) { c.camera.aspect = aspect; c.camera.updateProjectionMatrix(); }
    const x = b.left - box.left, y = box.bottom - b.bottom;
    r.setViewport(x, y, b.width, b.height); r.setScissor(x, y, b.width, b.height);
    r.render(c.scene, c.camera); drawn++;
  }
  return busy;
}

function drawDetail(dt) {
  const d = detail, view = $('detail-view'), w = view.clientWidth, h = view.clientHeight;
  if (!w || !h) return true;
  syncPixelRatio(d.renderer);
  const size = d.renderer.getSize(new THREE.Vector2());
  if (size.x !== w || size.y !== h) d.renderer.setSize(w, h, false);
  if (d.camera.aspect !== w / h) {
    d.camera.aspect = w / h; d.camera.updateProjectionMatrix();
    // The first frame at the view's real shape frames the molecule to fit it.
    if (!d.fitted) { const dir = d.camera.position.clone().sub(d.controls.target).normalize(); d.camera.position.copy(d.controls.target).addScaledVector(dir, fitDistance(d.camera, d.fitR, .78)); d.fitted = true; }
  }
  const moving = d.controls.update(dt);
  d.renderer.render(d.scene, d.camera);
  for (const m of retired.splice(0)) m.dispose();
  return moving || d.controls.autoRotate;
}

// A lost graphics context (GPU reset, a reclaimed background tab) is restored with its environment rebuilt.
function keepContext(renderer, scenes) {
  const canvas = renderer.domElement;
  canvas.addEventListener('webglcontextlost', e => e.preventDefault());
  canvas.addEventListener('webglcontextrestored', () => { restoreEnvironment(renderer, scenes()); relayout(); });
}

// ---------- Start ----------
async function start() {
  if (location.protocol === 'file:') return;
  try {
    await load();
  } catch (e) {
    $('load-detail').textContent = `The structures could not be loaded (${e.message}).`;
    return;
  }
  try {
    iconRenderer = createRenderer({canvas: $('stage'), alpha: true, exposure: EXPOSURE});
    iconRenderer.setClearColor(0x000000, 0);
    keepContext(iconRenderer, () => cards.map(c => c.scene));
    buildGrid();
    setupDetail();
  } catch (e) {
    $('load-detail').textContent = /WebGL/i.test(e.message) ? 'This page needs WebGL 2, which this browser could not start.' : `The structures could not be shown (${e.message}).`;
    return;
  }
  addEventListener('scroll', relayout, {passive: true});
  addEventListener('resize', relayout);
  rmq.addEventListener('change', e => { calm = e.matches; if (detail) detail.controls.autoRotate = !calm && detail.controls.autoRotate; wake(); });
  addEventListener('popstate', () => { const id = location.hash.slice(1); if (id && MODELS[id]) open(id, {push: false}); else close({push: false}); });
  history.replaceState({depth: 0}, '', location.pathname + location.search + location.hash);
  // Diagnostics for the browser tests (?debug=1).
  if (new URLSearchParams(location.search).get('debug') === '1') window.proteinBrowser = {
    open: id => open(id), close: () => close(), drawn: () => drawn,
    state: () => ({openId, contextOn, cards: cards.length, parts: detail.model?.parts.length ?? 0, ghosts: detail.model?.ghosts.length ?? 0,
      triangles: detail.renderer.info.render.triangles, iconTriangles: iconRenderer.info.render.triangles}),
  };
  const first = location.hash.slice(1);
  if (first && MODELS[first]) { history.replaceState({depth: 0}, '', location.pathname + location.search); open(first); }
  wake();
  // After the first frame; a timer covers pages opened in a background tab, where frames wait.
  const ready = () => { const l = $('loader'); if (l.classList.contains('hidden')) return; l.classList.add('hidden'); setTimeout(() => { l.hidden = true; }, 800); };
  requestAnimationFrame(ready); setTimeout(ready, 600);
}
start();
