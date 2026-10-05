// Protein library: every protein of each chapter (./chapters.mjs) as a slowly turning 3D icon; one opens
// full screen with an interactive structure and its facts. Chapters are tabs, and a chapter's structures
// load the first time it is shown. Icons share one fixed canvas (each drawn into its card's box with a
// scissor); the open protein has its own canvas and controls.
import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {loadSurfaceSet, surfaceGeometry, proteinMaterial, createRenderer, studio, fitDistance, restoreEnvironment} from '../shared/molecules.mjs';
import {STRANDS} from '../shared/strands.mjs';
import {nucleotides, partners, pairTip, createCartoon, COMPLEMENT, stubColour} from '../shared/rna.mjs';
import {createAtoms} from '../shared/atoms.mjs';
import {pairsFromStrands, frameFromPairs, createDuplex} from '../shared/dna.mjs';
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
// Tab, window title and back-button names; the transcription chapters' are built from their noun.
const tabName = ch => ch.label || `${ch.tab} transcription`;
const titleOf = ch => ch.title || `Proteins of ${ch.noun} transcription`;

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
// rest of the complex it belongs to is added as faint, unpickable ghosts in the same coordinates. An `icon` (a grid
// card) draws its small molecules space filling, so they read at that size.
function buildModel(id, {context = false, icon = false} = {}) {
  const ch = where.get(id), pivot = new THREE.Group(), orient = new THREE.Group(), inner = new THREE.Group(), parts = [], ghosts = [];
  pivot.add(orient); orient.add(inner);
  // Proteins are surfaces; a nucleic acid (style 'strands') is drawn as every page draws DNA and RNA. Surfaces can
  // come with exported strands (`strands`: the RNA of a ribonucleoprotein, the RNA a protein binds) and small
  // molecules drawn atom by atom (`ligands`: a cap in its pocket).
  const spec = ch.M[id];
  let pairs = 0;
  if (spec.style === 'strands') { const n = nucleicParts(spec, ch, inner); parts.push(...n.parts); pairs = n.pairs; }
  for (const part of spec.parts || []) {
    const {set, rec} = recordOf(part, ch), mesh = new THREE.Mesh(surfaceGeometry(rec, set.buffer), proteinMaterial(part.color));
    mesh.userData.part = part; mesh.userData.record = rec;
    inner.add(mesh); parts.push(mesh);
  }
  if (spec.strands) { const n = strandParts(spec.strands, ch, inner); parts.push(...n.parts); pairs += n.pairs; }
  if (spec.ligands) parts.push(...ligandParts(spec.ligands, ch, inner, icon ? 1 : 0));
  const box = new THREE.Box3();
  for (const m of parts) box.union(m.userData.points ? new THREE.Box3().setFromArray(m.userData.points) : m.geometry.boundingBox);
  const center = box.getCenter(V());
  // The exact extent about the centre (every vertex), so icons fill their boxes.
  let r2 = 0;
  for (const m of parts) { const a = pointsOf(m); for (let i = 0; i < a.length; i += 3) { const x = a[i] - center.x, y = a[i + 1] - center.y, z = a[i + 2] - center.z; r2 = Math.max(r2, x * x + y * y + z * z); } }
  const radius = Math.sqrt(r2);
  inner.position.copy(center).negate();
  // A model can be turned to show itself best: the long (or, for a flat one, the short) axis of its parts, or of
  // one named part, stood up along the turning axis (a duplex upright) or turned towards the viewer (down a ring).
  // With `to: 'front'`, the named part is brought round in front of the rest (a strand in its enzyme's cleft).
  const o = spec.orient;
  if (o) {
    const named = o.part ? parts.filter(m => [o.part].flat().includes(m.userData.part.label)) : parts;
    const [long, , short, mean] = principalAxes(named);
    if (o.to === 'front') orient.quaternion.setFromUnitVectors(mean.sub(center).normalize(), VIEW);
    else orient.quaternion.setFromUnitVectors(o.axis === 'short' ? short : long, o.to === 'view' ? VIEW : V(0, -1, 0));
    // `turn` then spins it about the upright axis (radians), to choose which side faces the viewer.
    if (o.turn) orient.quaternion.premultiply(new THREE.Quaternion().setFromAxisAngle(V(0, -1, 0), o.turn));
  }
  let whole = radius;
  if (context && ch.X[id]) {
    const own = new Set((spec.parts || []).map(p => partKey(p, ch)));
    for (const part of ch.X[id]) {
      if (own.has(partKey(part, ch))) continue;
      const {set, rec} = recordOf(part, ch), m = new THREE.Mesh(surfaceGeometry(rec, set.buffer), ghostMaterial(part.color));
      m.renderOrder = 1; m.userData.record = rec; inner.add(m); ghosts.push(m);
      const a = m.geometry.attributes.position.array;
      for (let i = 0; i < a.length; i += 3) whole = Math.max(whole, Math.hypot(a[i] - center.x, a[i + 1] - center.y, a[i + 2] - center.z));
    }
  }
  return {pivot, parts, ghosts, radius, whole, pairs};
}

// ---------- Nucleic acids ----------
// A model with style 'strands' draws its nucleic acid from the structure's own atoms, as the scenes do: a duplex
// (`duplex: {structure, strands: [a, b]}`, two exported strands) with shared/dna.mjs, each strand a tube through its
// backbone and each base pair one bond across; or a single folded chain (`fold: {structure, atoms}`, an exported atom
// group) as a tube with, for each base, one bond to the middle of its pair or, unpaired, a short stub towards its base.
// Each strand is a part (legend, hover); `labels`, `colors`, `widths` and `rungs` style them.
function nucleicParts(spec, ch, inner) {
  const meta = ch.data[spec.set || ch.defaultSet].meta, n = spec.duplex || spec.fold, source = {source: null};
  let tubes, rungs, count;
  if (spec.duplex) {
    const [a, b] = spec.duplex.strands.map(name => meta.strands.find(s => s.structure === n.structure && s.name === name));
    const pairs = pairsFromStrands(a, b), frames = frameFromPairs(pairs);
    const duplex = createDuplex({pairs, ...(spec.colors && {template: spec.colors[0], coding: spec.colors[1]}), ...(spec.widths && {widths: spec.widths}), ...(spec.rungs && {rung: spec.rungs})});
    duplex.pose(frames); inner.add(duplex.group);
    tubes = duplex.strands; rungs = duplex.rungs; source.source = a.source; count = pairs.length;
  } else {
    const group = meta.atoms.find(g => g.structure === n.structure && g.name === n.atoms), cartoon = foldedStrand(group, spec);
    inner.add(cartoon.group);
    tubes = [cartoon.tube]; rungs = [cartoon.bonds]; source.source = group.source; count = cartoon.pairs;
  }
  return {pairs: count, parts: tubes.map((tube, k) => {
    const m = tube.mesh;
    m.geometry.computeBoundingBox(); m.geometry.computeBoundingSphere(); m.geometry.userData.own = true;
    m.userData.part = {label: spec.labels?.[k] ?? '', color: tube.material.color.getHex()}; m.userData.record = source;
    // Its half of each base-pair bond dims and lights with it.
    m.userData.also = [rungs[k]];
    return m;
  })};
}

// A single folded chain, as shared/rna.mjs draws one: a tube through its nucleotides' backbones (C4′) and each base
// one bond, to the middle of its pair (Watson–Crick partners within the chain) or, unpaired, a short stub towards it.
function foldedStrand(g, spec) {
  const nts = nucleotides(g).filter(nt => nt.backbone), partner = partners(nts);
  const cartoon = createCartoon(new THREE.Group(), nts.length, {colour: spec.colors?.[0] ?? STRANDS.rna, rung: spec.rungs?.[0] ?? STRANDS.rung.template, radius: spec.widths?.[0] ?? 1.05});
  cartoon.pose(nts.map(nt => nt.backbone), nts.map((nt, i) => pairTip(V(), nt.backbone, nt.base, partner[i] >= 0 ? nts[partner[i]].backbone : null)));
  return {group: cartoon.group, tube: cartoon.tube, bonds: cartoon.bonds, pairs: partner.filter((j, i) => j > i).length};
}

// Exported strands drawn with a model's surfaces (`strands: [{structure, strand, label, color, width, group, link,
// from}]`), as the scenes draw a structure's RNA: a tube through each strand's backbone, in pieces where nucleotides
// are missing (consecutive backbone points more than 9 Å apart), and each base one bond, to the middle of its pair (a
// complementary partner on any strand of the same structure, each the other's) or else a short stub towards its base.
// `from: {strand, num}` starts the strand at another strand's nucleotide, joined to it as a branch is by its 2′–5′
// bond. Each piece is a part; a strand in pieces gathers them under its label.
const GAP = 9;
function strandParts(list, ch, inner) {
  const out = [], pairs = new Set();
  for (const x of list) {
    const meta = ch.data[x.set || ch.defaultSet].meta, of = (structure, name) => meta.strands.find(s => s.structure === structure && s.name === name);
    const s = of(x.structure, x.strand);
    if (!s) throw new Error(`Missing strand ${x.structure} ${x.strand}`);
    const byChain = new Map(meta.strands.filter(o => o.structure === x.structure).map(o => [o.chain, o]));
    const P = s.backbone.map(b => V(...b)), color = x.color ?? STRANDS.rna;
    // A partner counts when it pairs back and the bases are complementary.
    const mate = k => {
      const q = s.partner[k], o = q && byChain.get(q[0]), back = o?.partner[q[1]];
      return o && back && back[0] === s.chain && back[1] === k && COMPLEMENT[s.sequence[k]]?.includes(o.sequence[q[1]]) ? V(...o.backbone[q[1]]) : null;
    };
    const tips = P.map((p, k) => { const m = mate(k), base = V(...s.base[k]); return base.distanceTo(p) < .5 ? (m ? p.clone().lerp(m, .5) : p.clone()) : pairTip(V(), p, base, m); });
    P.forEach((_, k) => { if (mate(k)) pairs.add([`${x.structure}/${s.chain}/${k}`, `${x.structure}/${s.partner[k].join('/')}`].sort().join(' ')); });
    const runs = [[0, 1]];
    for (let k = 1; k < P.length; k++) if (P[k - 1].distanceTo(P[k]) > GAP) runs.push([k, k + 1]); else runs[runs.length - 1][1] = k + 1;
    // A branch starts from its branch point: that nucleotide's backbone leads the first piece, with no bond of its own.
    const lead = x.from && (() => { const b = of(x.structure, x.from.strand), k = b?.numbers.indexOf(x.from.num); return b && k >= 0 ? V(...b.backbone[k]) : null; })();
    const pieces = runs.map(([a, b], i) => i === 0 && lead ? [[lead, ...P.slice(a, b)], [lead, ...tips.slice(a, b)]] : [P.slice(a, b), tips.slice(a, b)]).filter(([p]) => p.length > 1);
    for (const [points, ends] of pieces) {
      const cartoon = createCartoon(inner, points.length, {colour: color, rung: stubColour(color).getHex(), radius: x.width ?? STRANDS.radius.rna});
      cartoon.pose(points, ends);
      const m = cartoon.tube.mesh;
      m.geometry.computeBoundingBox(); m.geometry.computeBoundingSphere(); m.geometry.userData.own = true;
      m.userData.part = {label: x.label ?? x.strand, color, link: x.link, group: x.group ?? (pieces.length > 1 ? x.label ?? x.strand : undefined)};
      m.userData.record = {source: s.source}; m.userData.also = [cartoon.bonds];
      out.push(m);
    }
  }
  return {parts: out, pairs: pairs.size};
}

// Small molecules from exported atom groups (`ligands: [{structure, atoms, label, color}]`), drawn atom by atom as
// the scenes draw chemistry (shared/atoms.mjs), carbons in `color`: a cap in its binding pocket. Each is a part.
// `fill` 1 draws them space filling (an icon's), 0 ball-and-stick (the open view's).
function ligandParts(list, ch, inner, fill = 0) {
  return list.map(x => {
    const g = ch.data[x.set || ch.defaultSet].meta.atoms.find(a => a.structure === x.structure && a.name === x.atoms);
    if (!g) throw new Error(`Missing atoms ${x.structure} ${x.atoms}`);
    const atoms = createAtoms(inner, g, {carbon: () => x.color, filter: i => g.atoms.element[i].toUpperCase() !== 'H'});
    if (fill) { atoms.fill = fill; atoms.update(); }
    const balls = atoms.group.children[0];
    balls.userData.part = {label: x.label ?? x.atoms, color: x.color, link: x.link}; balls.userData.record = {source: g.source};
    balls.userData.points = Float32Array.from(atoms.positions.flatMap(p => [p.x, p.y, p.z]));
    balls.computeBoundingSphere();
    return balls;
  });
}
// A part's points: a surface's or a tube's vertices, or a molecule's atom centres.
const pointsOf = m => m.userData.points || m.geometry.attributes.position.array;

// The principal axes of some meshes' vertices, longest first (power iteration on their covariance, the second
// axis kept perpendicular to the first, the third perpendicular to both), and the vertices' mean.
function principalAxes(meshes) {
  const mean = V(); let n = 0;
  for (const m of meshes) { const a = pointsOf(m); for (let i = 0; i < a.length; i += 3) { mean.x += a[i]; mean.y += a[i + 1]; mean.z += a[i + 2]; n++; } }
  mean.divideScalar(n);
  const c = new THREE.Matrix3().multiplyScalar(0), e = c.elements;  // symmetric: element order does not matter
  for (const m of meshes) { const a = pointsOf(m); for (let i = 0; i < a.length; i += 3) { const d = [a[i] - mean.x, a[i + 1] - mean.y, a[i + 2] - mean.z]; for (let r = 0; r < 3; r++) for (let k = 0; k < 3; k++) e[r * 3 + k] += d[r] * d[k]; } }
  const iterate = (v, away) => { for (let k = 0; k < 60; k++) { v.applyMatrix3(c); if (away) v.addScaledVector(away, -v.dot(away)); v.normalize(); } return v; };
  const long = iterate(V(1, .7, .4).normalize()), mid = iterate(V(-.4, 1, .7).normalize(), long);
  return [long, mid, long.clone().cross(mid).normalize(), mean];
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
  const scene = new THREE.Scene(), camera = new THREE.PerspectiveCamera(28, 1, 1, 5000), model = buildModel(p.id, {icon: true});
  studio(scene, camera, iconRenderer); scene.add(model.pivot);
  camera.position.copy(VIEW).multiplyScalar(fitDistance(camera, model.radius, spec.wide ? .96 : .9)); camera.lookAt(0, 0, 0);
  const c = {id: p.id, el, icon: el.querySelector('.icon'), scene, camera, model, angle: cards.length * .9, hover: 0, hovering: false, faced: ['view', 'front'].includes(spec.orient?.to) || spec.orient?.turn != null};
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
    b.setAttribute('role', 'tab'); b.setAttribute('aria-controls', 'groups'); b.textContent = tabName(ch);
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
  if (!openId) document.title = titleOf(ch);
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
  back.textContent = `Back to ${previous.label || tabName(previous).toLowerCase()}`; back.hidden = false;
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
  // The part under a resting mouse is named; as the view turns under it (by itself, or from the keys) the name follows
  // what is now under it, and a drag clears it, so the tag never names a part that has turned away or behind another.
  let pointer = null;
  const unhover = () => { setHover(null); $('hover-tag').hidden = true; view.style.cursor = ''; };
  const hoverAt = e => {
    const m = hit(e), tag = $('hover-tag');
    setHover(m);
    if (m && detail.model.parts.length > 1) {
      const part = m.userData.part, stage = view.parentElement.getBoundingClientRect(), p = part.link && part.link !== openId ? proteinOf(part.link) : null;
      tag.innerHTML = ''; tag.append(rich(part.label || ''));
      if (p && p.name !== part.label) tag.append(rich(p.name, 'small'));
      tag.style.left = `${e.clientX - stage.left}px`; tag.style.top = `${e.clientY - stage.top}px`; tag.hidden = false;
      view.style.cursor = p ? 'pointer' : '';
    } else { tag.hidden = true; view.style.cursor = ''; }
  };
  view.addEventListener('pointermove', e => {
    if (e.buttons) return;
    pointer = e.pointerType === 'mouse' ? {clientX: e.clientX, clientY: e.clientY} : null;
    hoverAt(e);
  });
  view.addEventListener('pointerleave', () => { pointer = null; unhover(); });
  // A tap is one pointer that never strayed more than 5 px; drags that come back and pinches are not taps.
  const pointers = new Map();
  let multi = false;
  detail.rehover = () => { if (pointer && !pointers.size && detail.model) hoverAt(pointer); };
  view.addEventListener('pointerdown', e => { pointers.set(e.pointerId, {x: e.clientX, y: e.clientY, far: 0}); if (pointers.size > 1) multi = true; });
  view.addEventListener('pointermove', e => {
    const q = pointers.get(e.pointerId); if (!q) return;
    q.far = Math.max(q.far, Math.hypot(e.clientX - q.x, e.clientY - q.y));
    if (q.far > 5 && (detail.hovered || !$('hover-tag').hidden)) unhover();
  });
  const lift = e => { pointers.delete(e.pointerId); if (!pointers.size) setTimeout(() => { multi = false; }); };
  view.addEventListener('pointercancel', lift);
  view.addEventListener('pointerup', e => {
    const q = pointers.get(e.pointerId), tap = q && !multi && pointers.size === 1 && q.far <= 5;
    lift(e);
    // After a drag, the part now under the mouse is named again.
    if (!tap) { if (e.pointerType === 'mouse' && !pointers.size) { pointer = {clientX: e.clientX, clientY: e.clientY}; hoverAt(pointer); } return; }
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
    const part = m.userData.part, lit = !focus || m === focus || (group && part.group === group) || (link && link !== openId && part.link === link);
    for (const material of [m.material, ...(m.userData.also || []).map(x => x.material)]) {
      // A strand's own colour (and glow) is kept on first use; a protein surface keeps its tone in userData.base.
      const base = material.userData.base ||= material.color.clone(), glow = material.emissive && (material.userData.emissive ||= material.emissive.clone());
      material.color.copy(base).multiplyScalar(lit ? 1 : .38); if (glow) material.emissive.copy(glow).multiplyScalar(lit ? 1 : .38);
      if (material.userData.uniforms?.uGlow) material.userData.uniforms.uGlow.value = focus && lit ? .35 : 0;
    }
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
  document.title = `${p.name} · ${titleOf(ch)}`;
  clearTimeout(hintTimer); $('view-hint')?.classList.remove('gone'); hintTimer = setTimeout(() => $('view-hint')?.classList.add('gone'), 5000);
  wake();
}

// Builds the open protein (with the complex around it when that is on) and frames it.
function setModel(id, {keepView}) {
  const d = detail, ch = where.get(id), withContext = contextOn && !!ch.X[id];
  // Old materials are disposed after the next frame, so their shader program is reused rather than rebuilt.
  // (Surface geometry is shared between views; a strand's own tube geometry is disposed with its materials.)
  if (d.model) {
    d.scene.remove(d.model.pivot);
    const done = new Set();
    d.model.pivot.traverse(o => { for (const x of [o.material, o.geometry?.userData.own && o.geometry]) if (x && !done.has(x)) { done.add(x); retired.push(x); } });
  }
  d.model = buildModel(id, {context: withContext}); d.hovered = d.highlight = null; d.scene.add(d.model.pivot);
  $('hover-tag').hidden = true; d.rehoverIn = 0;  // the old model's part is gone; the new one's is named on the next frame
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
  document.title = titleOf(active);
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
    b.innerHTML = '<span class="dot"></span>'; b.append(rich(ch.relatedNames?.[id] || q.name));
    // A protein of another chapter says which (opening it shows that chapter).
    if (where.get(id) !== ch) { const s = document.createElement('small'); s.textContent = tabName(where.get(id)); b.append(s); }
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
    // Held still, a model turned to face the viewer, or to a chosen side (orient), shows it; the others turn a little.
    c.model.pivot.rotation.y = calm ? (c.faced ? 0 : .6) + c.hover * .4 : c.angle;
    for (const m of c.model.parts) { const u = m.material.userData.uniforms; if (u?.uGlow) u.uGlow.value = .16 * c.hover; }
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
  // While the view turns (by itself, easing, or from the keys) the hover follows what is under a resting mouse, ten
  // times a second.
  if ((d.rehoverIn = (d.rehoverIn ?? 0) - dt) <= 0) { d.rehoverIn = .1; if (moving || d.controls.autoRotate || !d.hovered) d.rehover?.(); }
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
      triangles: detail.renderer.info.render.triangles, iconTriangles: iconRenderer.info.render.triangles, pairs: detail.model?.pairs ?? 0}),
  };
  const hash = location.hash.slice(1);
  if (hash && where.has(hash)) { history.replaceState({depth: 0}, '', location.pathname + location.search); open(hash); }
  wake();
  hideLoader();
}
start();
