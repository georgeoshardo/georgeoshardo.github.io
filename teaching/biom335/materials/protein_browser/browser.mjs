// Protein library: every protein of each chapter (./chapters.mjs) as a slowly turning 3D icon; one opens
// full screen with an interactive structure and its facts. Chapters are tabs, and a chapter's structures
// load the first time it is shown. Icons share one fixed canvas (each drawn into its card's box with a
// scissor); the open protein has its own canvas and controls.
import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {loadSurfaceSet, surfaceGeometry, proteinMaterial, createRenderer, studio, fitDistance, restoreEnvironment} from '../shared/molecules.mjs';
import {CHAPTERS} from './chapters.mjs';
import {setRich} from '../shared/text.mjs';

const $ = id => document.getElementById(id), V = (...a) => new THREE.Vector3(...a);
const hex = n => '#' + n.toString(16).padStart(6, '0');
// σ factor names, basal factor classes and Unicode subscripts are set as <sub> (../shared/text.mjs).
const setSymbol = setRich, rich = (text, tag = 'span') => setRich(document.createElement(tag), text);
const rmq = matchMedia('(prefers-reduced-motion: reduce)');
let calm = rmq.matches;
// Film frame: the textbook view (upstream left, downstream right, RNA leaving upward), world −y up.
const VIEW = V(110, 175, -490).normalize();
// No ambient-occlusion pass here, so surfaces are exposed a little lower than in the film.
const EXPOSURE = .8;

// ---------- Chapters ----------
const where = new Map();  // protein id → its chapter
for (const ch of CHAPTERS) for (const p of ch.PROTEINS) where.set(p.id, ch);
const proteinOf = id => where.get(id)?.PROTEINS.find(p => p.id === id);
let active = null;

// A chapter's sets load once; its models and contexts may be listed from the sets themselves.
function loadChapter(ch, onProgress) {
  ch.loading ||= (async () => {
    const entries = Object.entries(ch.sets), progress = entries.map(() => 0);
    const report = () => onProgress?.(progress.reduce((a, b) => a + b, 0) / entries.length);
    const loaded = await Promise.all(entries.map(([key, [json, bin]], i) => loadSurfaceSet(json, bin, p => { progress[i] = p; report(); }).then(s => [key, s])));
    ch.data = Object.fromEntries(loaded);
    ch.M = typeof ch.models === 'function' ? ch.models(ch.data) : ch.models;
    ch.X = (typeof ch.context === 'function' ? ch.context(ch.data) : ch.context) || {};
  })().catch(e => { ch.loading = null; throw e; });
  return ch.loading;
}
function recordOf(part, ch) {
  const set = ch.data[part.set || ch.defaultSet];
  set.byKey ||= new Map(set.meta.meshes.map(r => [`${r.structure}/${r.name}`, r]));
  const rec = part.id ? set.byId.get(part.id) : part.structure ? set.byKey.get(`${part.structure}/${part.mesh}`) : set.byName.get(part.mesh);
  if (!rec) throw new Error(`Missing structure ${part.structure ? part.structure + ' ' : ''}${part.id || part.mesh}`);
  return {set, rec};
}
const partKey = (part, ch) => `${part.set || ch.defaultSet}/${part.structure || ''}/${part.id || part.mesh}`;

// A model: the parts' meshes in an inner group centred on the pivot, which turns. With `context`, the
// rest of the complex it belongs to is added as faint, unpickable ghosts in the same coordinates.
function buildModel(id, {context = false} = {}) {
  const ch = where.get(id), pivot = new THREE.Group(), inner = new THREE.Group(), parts = [], ghosts = [];
  pivot.add(inner);
  for (const part of ch.M[id].parts) {
    const {set, rec} = recordOf(part, ch), mesh = new THREE.Mesh(surfaceGeometry(rec, set.buffer), proteinMaterial(part.color));
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
  if (context && ch.X[id]) {
    const own = new Set(ch.M[id].parts.map(p => partKey(p, ch)));
    for (const part of ch.X[id]) {
      if (own.has(partKey(part, ch))) continue;
      const {set, rec} = recordOf(part, ch), m = new THREE.Mesh(surfaceGeometry(rec, set.buffer), ghostMaterial(part.color));
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

function sourcesOf(model, ch) {
  const lines = new Set();
  for (const m of [...model.parts, ...model.ghosts]) {
    const r = m.userData.record;
    if (r.uniprot) lines.add(`AlphaFold DB model ${r.source} (UniProt ${r.uniprot}), residues ${r.residues[0]}–${r.residues[1]} of ${r.length} · Jumper et al., Nature 2021; Varadi et al., Nucleic Acids Res 2024 · CC BY 4.0`);
    else lines.add(ch.sources[r.source] || r.source);
  }
  return [...lines];
}

// ---------- The grid ----------
const cards = [];
let iconRenderer;
function buildGrid(ch) {
  const byGroup = Object.fromEntries(ch.GROUPS.map(g => [g.id, []]));
  for (const p of ch.PROTEINS) byGroup[p.group]?.push(p);
  const root = $('groups');
  for (const g of ch.GROUPS) {
    const section = document.createElement('section');
    section.className = 'group'; section.dataset.group = g.id; section.dataset.chapter = ch.id; section.setAttribute('aria-labelledby', `g-${g.id}`);
    // A chapter that finishes loading after another tab was chosen stays out of sight.
    section.hidden = ch !== active;
    section.innerHTML = `<div class="group-head"><h2 id="g-${g.id}"></h2><p></p></div><div class="grid"></div>`;
    setSymbol(section.querySelector('h2'), g.title); setSymbol(section.querySelector('p'), g.intro || '');
    const grid = section.querySelector('.grid');
    for (const p of byGroup[g.id]) grid.append(card(p, ch));
    root.append(section);
  }
  ch.built = true;
}

// The group filters of the shown chapter.
function buildFilters(ch) {
  const filters = document.querySelector('.filters');
  filters.querySelectorAll('[data-filter]:not([data-filter=all])').forEach(b => b.remove());
  filters.querySelector('[data-filter=all]').setAttribute('aria-pressed', 'true');
  for (const g of ch.GROUPS) {
    const f = document.createElement('button');
    f.className = 'pill'; f.dataset.filter = g.id; f.setAttribute('aria-pressed', 'false'); setSymbol(f, g.title);
    filters.append(f);
  }
}
function showGroups(filter) {
  document.querySelectorAll('.group').forEach(s => { s.hidden = s.dataset.chapter !== active.id || (filter !== 'all' && s.dataset.group !== filter); });
  relayout();
}

function card(p, ch) {
  const spec = ch.M[p.id], el = document.createElement('button');
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

// ---------- Chapter tabs ----------
function buildTabs() {
  const tabs = $('chapters');
  for (const ch of CHAPTERS) {
    const b = document.createElement('button');
    b.className = 'pill'; b.id = `tab-${ch.id}`; b.dataset.chapter = ch.id;
    b.setAttribute('role', 'tab'); b.setAttribute('aria-controls', 'groups'); b.textContent = `${ch.tab} transcription`;
    b.addEventListener('click', () => showChapter(ch));
    tabs.append(b);
  }
  // Arrow keys move between tabs (and show the one reached), as in a tab list.
  tabs.addEventListener('keydown', e => {
    const k = {ArrowLeft: -1, ArrowRight: 1}[e.key]; if (!k) return;
    const all = [...tabs.children], i = all.indexOf(document.activeElement); if (i < 0) return;
    e.preventDefault(); const next = all[(i + k + all.length) % all.length]; next.focus(); next.click();
  });
}

let showing = 0;
// Shows a chapter: its intro, links and groups (loading its structures the first time). Only the latest
// call shows anything; one overtaken by another tab still builds its grid, hidden, for later.
async function showChapter(ch, {url = true} = {}) {
  const token = ++showing, previous = active;
  active = ch;
  for (const b of $('chapters').children) { const on = b.dataset.chapter === ch.id; b.setAttribute('aria-selected', String(on)); b.tabIndex = on ? 0 : -1; }
  $('groups').setAttribute('aria-labelledby', `tab-${ch.id}`);
  $('intro-eyebrow').textContent = ch.eyebrow;
  const h = $('page-title'); h.textContent = '';
  ch.heading.split('<br>').forEach((line, i) => { if (i) h.append(document.createElement('br')); h.append(line); });
  setSymbol($('intro-lede'), ch.lede);
  const links = $('top-links'); links.textContent = '';
  for (const l of ch.links) { const a = document.createElement('a'); a.className = 'pill'; a.href = l.href; a.textContent = l.text; links.append(a); }
  document.querySelector('.brand').href = ch.links[0].href;
  if (!openId) document.title = `Proteins of ${ch.noun} transcription`;
  if (url) history.replaceState(history.state, '', `${location.pathname}${chapterQuery(ch)}${location.hash}`);
  if (!ch.built) {
    const l = $('loader'); l.hidden = false; l.classList.remove('hidden'); $('load-detail').textContent = 'Loading structures'; $('load-back').hidden = true;
    const bar = progressBar();
    try {
      await loadChapter(ch, p => { if (token === showing) bar(p); });
      if (!ch.built) buildGrid(ch);
    } catch (e) {
      bar.stop();
      if (token === showing) failed(ch, previous, e);
      return false;
    }
  }
  if (token !== showing) return false;
  hideLoader();
  buildFilters(ch); showGroups('all');
  return true;
}
// A chapter that could not load: say so, put the address back, and offer the chapter that was showing.
function failed(ch, previous, e) {
  $('load-detail').textContent = `The structures could not be loaded (${e.message}).`;
  if (!previous?.built) return;
  history.replaceState(history.state, '', `${location.pathname}${chapterQuery(previous)}`);
  const back = $('load-back');
  back.textContent = `Back to ${previous.tab.toLowerCase()} transcription`; back.hidden = false;
  back.onclick = () => showChapter(previous);
}
const chapterQuery = ch => {
  const q = new URLSearchParams(location.search);
  if (ch === CHAPTERS[0]) q.delete('chapter'); else q.set('chapter', ch.id);
  const s = q.toString(); return s ? `?${s}` : '';
};
// Progress in tens of percent, until stop(): once loading has failed, downloads still under way must not
// write over the message.
function progressBar() {
  let shown = -1, stopped = false;
  const bar = p => { const tens = Math.floor(p * 10) * 10; if (!stopped && tens !== shown) { shown = tens; $('load-detail').textContent = `Loading structures · ${tens}%`; } };
  bar.stop = () => { stopped = true; };
  return bar;
}
// After the first frame; a timer covers pages opened in a background tab, where frames wait.
function hideLoader() {
  const ready = () => { const l = $('loader'); if (l.classList.contains('hidden')) return; l.classList.add('hidden'); setTimeout(() => { if (l.classList.contains('hidden')) l.hidden = true; }, 800); };
  requestAnimationFrame(ready); setTimeout(ready, 600);
}

// ---------- The open protein ----------
let detail = null, openId = null, opener = null, hintTimer = 0, retired = [], contextOn = false;
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
      const part = m.userData.part, stage = view.parentElement.getBoundingClientRect(), p = part.link && part.link !== openId ? proteinOf(part.link) : null;
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
  $('context').addEventListener('click', () => { contextOn = !contextOn; if (openId) { setModel(openId, {keepView: true}); fill(proteinOf(openId), detail.model); } });
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
// The hovered part (or legend entry) glows and the rest of a complex dims, so one subunit stands out; a
// legend entry lights every part it gathers (a group, or the parts of one linked protein).
function paintParts() {
  const legend = detail.highlight, focus = legend || (detail.model?.parts.length > 1 ? detail.hovered : null);
  const group = legend?.userData.part.group, link = focus?.userData.part.link;
  for (const m of detail.model?.parts || []) {
    const part = m.userData.part, u = m.material.userData.uniforms;
    const lit = !focus || m === focus || (group && part.group === group) || (link && link !== openId && part.link === link);
    m.material.color.copy(m.material.userData.base).multiplyScalar(lit ? 1 : .38);
    u.uGlow.value = focus && lit ? .35 : 0;
  }
}

// History: opening from the grid pushes one entry (depth 1); moving between proteins replaces it, so Back
// (or ×, Esc) always returns to the grid. A protein of another chapter shows that chapter first.
function open(id, {push = true} = {}) {
  const p = proteinOf(id), ch = where.get(id); if (!p) return;
  // Once the chapter is shown, unless the reader has moved on meanwhile (another tab, Back).
  if (ch !== active || !ch.built) { showChapter(ch).then(ok => { if (ok && active === ch && (push || location.hash.slice(1) === id)) open(id, {push}); }); return; }
  const first = !openId;
  if (first) opener = document.activeElement;
  openId = id;
  const spec = ch.M[id], d = detail;
  setModel(id, {keepView: false});
  d.controls.autoRotate = !calm; d.controls.autoRotateSpeed = .7; d.controls.update(); d.fitted = false;
  fill(p, d.model);
  const el = $('detail'); el.style.setProperty('--c', hex(spec.accent));
  if (el.hidden) {
    el.hidden = false; document.body.style.overflow = 'hidden'; $('stage').style.visibility = 'hidden';
    for (const child of document.body.children) if (child !== el && !child.inert && child.tagName !== 'SCRIPT') { child.inert = true; inerted.push(child); }
  }
  $('detail-text').scrollTop = 0;
  // Focus moves into the dialog when it opens; stepping with ‹ › keeps it where it was.
  if (first || !el.contains(document.activeElement)) $('close').focus({preventScroll: true});
  if (push) (first ? history.pushState : history.replaceState).call(history, {id, depth: 1}, '', `${location.pathname}${location.search}#${id}`);
  document.title = `${p.name} · Proteins of ${ch.noun} transcription`;
  clearTimeout(hintTimer); $('view-hint')?.classList.remove('gone'); hintTimer = setTimeout(() => $('view-hint')?.classList.add('gone'), 5000);
  wake();
}

// Builds the open protein (with the complex around it when that is on) and frames it.
function setModel(id, {keepView}) {
  const d = detail, ch = where.get(id), withContext = contextOn && !!ch.X[id];
  // Old materials are disposed after the next frame, so their shader program is reused rather than rebuilt.
  if (d.model) { d.scene.remove(d.model.pivot); retired.push(...[...d.model.parts, ...d.model.ghosts].map(m => m.material)); }
  d.model = buildModel(id, {context: withContext}); d.hovered = d.highlight = null; d.scene.add(d.model.pivot);
  d.fitR = withContext ? d.model.whole : d.model.radius;
  const dir = keepView ? d.camera.position.clone().sub(d.controls.target).normalize() : VIEW;
  d.camera.position.copy(dir).multiplyScalar(fitDistance(d.camera, d.fitR, .78)); d.camera.lookAt(0, 0, 0);
  d.controls.target.set(0, 0, 0); d.controls.minDistance = d.model.radius * 1.15; d.controls.maxDistance = d.fitR * 7;
  const toggle = $('context'); toggle.hidden = !ch.X[id]; toggle.setAttribute('aria-pressed', String(withContext));
  $('context-label').textContent = ch.contextLabel[id] || ch.contextDefault;
  if (keepView) { d.controls.update(); wake(); }
}

function close({push = true} = {}) {
  if (!openId) return;
  // With our own entry on the stack, going back to the grid entry closes the view (through popstate).
  if (push && history.state?.depth === 1) { history.back(); return; }
  const id = openId; openId = null;
  $('detail').hidden = true; document.body.style.overflow = ''; $('stage').style.visibility = '';
  for (const child of inerted.splice(0)) child.inert = false;
  document.title = `Proteins of ${active.noun} transcription`;
  if (push) history.replaceState({depth: 0}, '', location.pathname + location.search);
  const back = opener && opener !== document.body && opener.isConnected && !opener.closest('[hidden]') ? opener : cards.find(c => c.id === id)?.el;
  back?.focus({preventScroll: false});
  relayout();
}

function step(dir) {
  const list = where.get(openId).PROTEINS, i = list.findIndex(p => p.id === openId);
  open(list[(i + dir + list.length) % list.length].id);
}

function fill(p, model) {
  const ch = where.get(p.id), spec = ch.M[p.id], group = ch.GROUPS.find(g => g.id === p.group);
  setSymbol($('detail-group').querySelector('span'), group?.title || '');
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
  // Parts of a complex, one legend entry per group, linked protein or part: hovering highlights, clicking
  // opens the protein it links to.
  const parts = $('parts'); parts.textContent = '';
  if (model.parts.length > 1 && spec.legend !== false) {
    const seen = new Set();
    for (const m of model.parts) {
      const part = m.userData.part, linked = part.link && part.link !== p.id ? part.link : null;
      const members = part.group ? model.parts.filter(x => x.userData.part.group === part.group) : [m];
      const opens = part.group ? (members.every(x => x.userData.part.link === part.link) ? linked : null) : linked;
      const key = part.group ? `g:${part.group}` : linked ? `l:${linked}` : `p:${part.label}`;
      if (seen.has(key)) continue; seen.add(key);
      const li = document.createElement('li'), el = document.createElement(opens ? 'button' : 'span');
      el.className = 'pill'; el.style.setProperty('--c', hex(part.color));
      el.innerHTML = '<span class="dot"></span>';
      const t = document.createElement('span'); setSymbol(t, part.group || (linked ? (proteinOf(linked)?.symbol || part.label) : part.label)); el.append(t);
      if (opens) { el.addEventListener('click', () => open(opens)); el.setAttribute('aria-label', `Open ${proteinOf(opens)?.name}`); }
      const on = () => { detail.highlight = m; paintParts(); wake(); }, off = () => { detail.highlight = null; paintParts(); wake(); };
      el.addEventListener('pointerenter', on); el.addEventListener('pointerleave', off);
      if (opens) { el.addEventListener('focus', on); el.addEventListener('blur', off); }
      li.append(el); parts.append(li);
    }
  }
  const seeAlso = ch.seeAlso[p.id] || [], links = $('film-links'); links.textContent = '';
  $('detail-film').querySelector('h3').textContent = ch.seeAlsoTitle;
  for (const [name, href] of seeAlso) {
    const a = document.createElement('a');
    a.className = 'pill'; a.href = href; setSymbol(a, name);
    links.append(a);
  }
  $('detail-film').hidden = !seeAlso.length;
  const related = $('related'); related.textContent = '';
  for (const id of p.related || []) {
    const q = proteinOf(id); if (!q) continue;
    const b = document.createElement('button');
    b.className = 'pill'; b.style.setProperty('--c', hex(where.get(id).M?.[id]?.accent ?? 0x8fa3ad));
    b.innerHTML = '<span class="dot"></span>'; b.append(rich(q.name));
    b.addEventListener('click', () => open(id));
    related.append(b);
  }
  $('detail-related').hidden = !related.children.length;
  const notes = $('notes-link');
  notes.href = `${ch.notes}#${p.notes}`; notes.parentElement.hidden = !p.notes;
  const source = $('detail-source'); source.textContent = '';
  for (const line of sourcesOf(model, ch)) { const s = document.createElement('span'); s.textContent = line; source.append(s); }
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
  // The chapter shown first: the one named in the address, or the one holding a protein linked by #id.
  const named = CHAPTERS.find(c => c.id === new URLSearchParams(location.search).get('chapter'));
  const first = where.get(location.hash.slice(1)) || named || CHAPTERS[0], bar = progressBar();
  try {
    await loadChapter(first, bar);
  } catch (e) {
    bar.stop();
    $('load-detail').textContent = `The structures could not be loaded (${e.message}).`;
    return;
  }
  try {
    iconRenderer = createRenderer({canvas: $('stage'), alpha: true, exposure: EXPOSURE});
    iconRenderer.setClearColor(0x000000, 0);
    keepContext(iconRenderer, () => cards.map(c => c.scene));
    buildTabs();
    setupDetail();
    await showChapter(first);
  } catch (e) {
    $('load-detail').textContent = /WebGL/i.test(e.message) ? 'This page needs WebGL 2, which this browser could not start.' : `The structures could not be shown (${e.message}).`;
    return;
  }
  document.querySelector('.filters').addEventListener('click', e => {
    const b = e.target.closest('[data-filter]'); if (!b) return;
    document.querySelectorAll('.filters [data-filter]').forEach(x => x.setAttribute('aria-pressed', String(x === b)));
    showGroups(b.dataset.filter);
  });
  addEventListener('scroll', relayout, {passive: true});
  addEventListener('resize', relayout);
  rmq.addEventListener('change', e => { calm = e.matches; if (detail) detail.controls.autoRotate = !calm && detail.controls.autoRotate; wake(); });
  // Back and Forward: the protein in the address, or the grid of the chapter it names.
  addEventListener('popstate', () => {
    const id = location.hash.slice(1);
    if (id && where.has(id)) { open(id, {push: false}); return; }
    close({push: false});
    const named = CHAPTERS.find(c => c.id === new URLSearchParams(location.search).get('chapter')) || CHAPTERS[0];
    if (named !== active) showChapter(named, {url: false});
  });
  history.replaceState({depth: 0}, '', location.pathname + location.search + location.hash);
  // Diagnostics for the browser tests (?debug=1).
  if (new URLSearchParams(location.search).get('debug') === '1') window.proteinBrowser = {
    open: id => open(id), close: () => close(), drawn: () => drawn, chapter: id => showChapter(CHAPTERS.find(c => c.id === id)),
    state: () => ({openId, contextOn, chapter: active.id, cards: cards.length, parts: detail.model?.parts.length ?? 0, ghosts: detail.model?.ghosts.length ?? 0,
      triangles: detail.renderer.info.render.triangles, iconTriangles: iconRenderer.info.render.triangles}),
  };
  const hash = location.hash.slice(1);
  if (hash && where.has(hash)) { history.replaceState({depth: 0}, '', location.pathname + location.search); open(hash); }
  wake();
  hideLoader();
}
start();
