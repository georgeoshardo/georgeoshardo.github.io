// The player for the course's short 3D scenes, with the transcription film's controls and behaviour. A scene gives its
// steps (a headline and a caption each, from the notes), builds its molecules, poses them for any time t, and names
// what matters with the shared labels. The player adds everything else as the film does: its page chrome (player.css),
// rendering pipeline and quality tiers (render.mjs), guided camera (camera.mjs: eased blends that begin just before a
// step, a slow drift, drag to explore, wheel to zoom the guided shot, an eased return), reading pauses (reading.mjs),
// the step list, transport (play, restart, step back and forward, scrubber, speed, loop a step, labels), the notes
// panel, keyboard shortcuts, reduced motion, settings kept across pages (prefs.mjs), ?t= links and test hooks (?debug=1).
// A step can also ask the viewer to predict its result (`predict`: predict, then watch; see the README).
import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {createRenderer, studio, NIGHT, fitDistance, restoreEnvironment, viewScale, FADE} from './molecules.mjs';
import {createPipeline, TIERS} from './render.mjs';
import {blendPose, screenAnchor, applyLens, placeCamera, currentPose, fitRoom} from './camera.mjs';
import {createReading, keyOf, wordCount} from './reading.mjs';
import {createLabels} from './labels.mjs';
import {setRich, enrichTree} from './text.mjs';
import {clamp, smooth, quintic} from './ease.mjs';
import {prefs} from './prefs.mjs';

const $ = id => document.getElementById(id), V = (...a) => new THREE.Vector3(...a), DEG = Math.PI / 180;
const clock = t => `${Math.floor(t / 60)}:${String(Math.floor(t % 60)).padStart(2, '0')}`;
const plain = html => html.replace(/<br>/g, ' ').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
const SPEEDS = [.25, .5, 1, 1.5, 2, 5];

export async function runScene(spec) {
  const query = new URLSearchParams(location.search), debug = query.get('debug') === '1';
  // Opened from disk, the page's own script has said how to serve it.
  if (location.protocol === 'file:') return;
  buildShell(spec);
  const rmq = matchMedia('(prefers-reduced-motion: reduce)');
  let motion = prefs.get('motion') || 'auto', calm = motion === 'auto' ? rmq.matches : motion === 'reduced';
  const fail = (title, body) => { $('loader').classList.add('failed'); $('load-error').hidden = false; $('error-title').textContent = title; $('error-body').textContent = body; };

  let renderer;
  try { renderer = createRenderer({antialias: false, exposure: spec.exposure ?? .95}); }
  catch { fail('This browser cannot show the 3D scene', 'It needs WebGL 2. Use a current version of Chrome, Edge, Firefox or Safari, and check that hardware acceleration is switched on.'); return; }
  renderer.setSize(innerWidth, innerHeight);
  $('viewport').append(renderer.domElement);
  // Scenes at the scale of whole genes set a farther clipping plane (spec.near, spec.far).
  const scene = new THREE.Scene(), camera = new THREE.PerspectiveCamera(spec.fov || 30, innerWidth / innerHeight, spec.near ?? 1, spec.far ?? 20000);
  scene.background = new THREE.Color(NIGHT); scene.fog = new THREE.FogExp2(NIGHT, spec.fog ?? .00012);
  studio(scene, camera, renderer);
  FADE.depthFirst = true;  // see-through protein surfaces drawn nearest layer only (molecules.mjs fade)
  const world = new THREE.Group(); scene.add(world);
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = !calm; controls.dampingFactor = .08; controls.enablePan = false; controls.enabled = false;
  const labels = createLabels($('annotations'), $('leaders'), $('scene-now'));

  // Once loading has failed, downloads still under way must not write over the message.
  let content, failed = false;
  try {
    content = await spec.build({THREE, scene, world, camera, renderer, V, progress: p => {
      if (failed) return; $('load-detail').textContent = `Loading structures · ${Math.floor(clamp(p) * 10) * 10}%`; $('load-bar').style.width = `${(clamp(p) * 100).toFixed(0)}%`;
    }});
  } catch (e) { failed = true; fail('The structures could not be loaded', `${e.message}. Check that the local server is still running, then retry.`); $('error-retry').onclick = () => location.reload(); return; }
  $('load-bar').style.width = '100%';
  const pipeline = createPipeline(renderer, scene, camera);

  const steps = spec.steps, duration = spec.duration;
  const stepAt = t => { let i = 0; for (let k = 0; k < steps.length; k++) if (t >= steps[k].t - 1e-6) i = k; return i; };
  const stepEnd = i => i + 1 < steps.length ? steps[i + 1].t : duration;
  let time = Math.min(duration - .01, Math.max(0, +query.get('t') || 0)), playing = false, speed = 1, exploring = false, labelsOn = query.get('labels') !== '0';
  let loopStep = query.get('loop') === '1' ? stepAt(time) : -1, shownStep = -1, last = performance.now(), raf = 0, zoom = 1, zoomShown = 1, resumeFrom = null, resumeStart = 0, resumePlay = false;
  // Predict, then watch: the steps that ask (none with ?predict=0), each one's answer this visit (a choice, or −1 when
  // the viewer just watched; kept in memory only), the question open now, and the answers as the scene reads them.
  const asks = query.get('predict') === '0' ? [] : steps.flatMap((s, k) => s.predict?.choices?.length ? [k] : []);
  const answered = new Map();
  let asking = null, answers = {};

  // ---------- Camera ----------
  // Blends begin a little before their step (the film's lead), so the move straddles the change of step.
  const blendOf = s => calm ? Math.min(s.blend ?? 2.2, 1.2) : s.blend ?? 2.2, leadOf = s => blendOf(s) * (s.lead ?? .35);
  const shots = spec.shots;
  const shotPose = (k, t) => {
    const s = shots[k], f = typeof s.frame === 'function' ? s.frame(t, content) : s;
    const dir = V(...f.dir).normalize(), target = f.target.isVector3 ? f.target.clone() : V(...f.target);
    // A slow, low-amplitude drift keeps even held shots alive (none with reduced motion).
    if (!calm) {
      const yaw = .9 * Math.sin(t * .31) + .4 * Math.sin(t * .83 + 2), pitch = .7 * Math.sin(t * .27 + 1) + .3 * Math.sin(t * .71), up = V(0, 1, 0);
      dir.applyAxisAngle(up, yaw * DEG); const side = V().crossVectors(up, dir); if (side.lengthSq() > 1e-6) dir.applyAxisAngle(side.normalize(), pitch * DEG);
    }
    camera.fov = spec.fov || 30;
    // A shot with a box fits it to the free part of the screen, at any size of window.
    if (f.box) {
      // Of the free areas, the one that shows the box largest.
      const fits = rooms.map(r => fitRoom(camera, f.box, r, f.fill ?? .92)), {dist, anchor} = fits.reduce((a, b) => b.dist < a.dist ? b : a);
      return {target, dir, dist: f.dist ?? dist, fov: spec.fov || 30, anchor};
    }
    return {target, dir, dist: f.dist ?? fitDistance(camera, f.radius, f.fill ?? .8), fov: spec.fov || 30, anchor: screenAnchor(!!f.wide)};
  };
  const guided = t => {
    let k = 0; for (let i = 1; i < shots.length; i++) if (t >= shots[i].t - leadOf(shots[i])) k = i;
    const now = shotPose(k, t), w = k > 0 ? quintic((t - shots[k].t + leadOf(shots[k])) / blendOf(shots[k])) : 1;
    return w < 1 ? blendPose(shotPose(k - 1, t), now, w, {calm, zoomPan: shots[k].zoomPan ?? 0}) : now;
  };
  const blendWindows = () => shots.slice(1).map(s => { const w0 = s.t - leadOf(s); return [w0, w0 + blendOf(s)]; });
  // The time playback holds before a step's camera move begins (the reading pauses' beat).
  const holdTime = i => { const s = shots.find(x => Math.abs(x.t - steps[i].t) < 1e-6); return s && s.blend !== 0 ? steps[i].t - leadOf(s) : steps[i].t - .05; };
  // Where a step asks for its prediction: `predict.at`, or its end (that same beat before the next step's move).
  const askAt = k => { const p = steps[k].predict; return Math.min(stepEnd(k) - .02, Math.max(steps[k].t + .05, p.at ?? (k + 1 < steps.length ? holdTime(k + 1) : duration - .05))); };
  let lensAnchor = screenAnchor();
  function setCamera() {
    if (exploring) return;
    let pose = guided(time);
    if (resumeFrom) { const w = quintic((performance.now() - resumeStart) / (calm ? 600 : 1400)); pose = blendPose(resumeFrom, pose, w, {calm}); if (w >= 1) resumeFrom = null; }
    if (reading.holdAmp > 0) { const a = smooth(reading.holdAmp), ph = reading.holdPhase; pose.dir.applyAxisAngle(V(0, 1, 0), a * 1.6 * DEG * Math.sin(ph * .42)); pose.dir.y += a * .012 * Math.sin(ph * .31 + 1); pose.dir.normalize(); }
    pose.dist *= zoomShown; lensAnchor = pose.anchor;
    applyLens(camera, pose.fov, pose.anchor, pipeline); placeCamera(camera, controls, pose);
  }

  // ---------- Reading pauses ----------
  const recorder = {keys: new Set(), label(a, title) { recorder.keys.add(keyOf('L:' + title)); }, tag() {}, bracket(a, b, text) { recorder.keys.add(keyOf('B:' + text)); }, get answers() { return answers; }};
  const probe = t => { recorder.keys = new Set(); try { content.annotate?.(t, recorder); } catch { /* a dry run only */ } return recorder.keys; };
  const reading = createReading({chip: $('read-pause'), focus: $('play'), speed: () => speed, calm: () => calm, active: () => !exploring,
    windows: blendWindows, probe,
    shown: () => {
      const phone = innerWidth <= 600, out = [];
      for (const it of labels.shown()) if (!it.key.startsWith('T:')) { const text = phone ? it.title : it.text; out.push({key: keyOf(it.key), text, callout: true}); }
      const i = stepAt(time), s = steps[i], recalled = $('predicted').hidden ? 0 : wordCount($('predicted').textContent);
      if (!exploring) out.push({key: `N:${i}`, text: s.text, words: Math.round((wordCount(s.text) + wordCount(plain(s.title)) + recalled) * (s.hold ?? 1))});
      return out;
    },
    narration: t0 => { const i = stepAt(t0), next = i + 1 < steps.length ? steps[i + 1].t : null, beat = next !== null ? holdTime(i + 1) : null; return {key: `N:${i}`, turn: beat ?? Infinity, next, beat, held: false}; },
  });

  // ---------- Interface ----------
  $('chapters').innerHTML = steps.map((s, i) => `<button class="ch" data-step="${i}" aria-label="Step ${i + 1} of ${steps.length}: ${plain(s.nav)}"><span aria-hidden="true">${String(i + 1).padStart(2, '0')}</span><b aria-hidden="true"></b></button>`).join('');
  $('chapters').querySelectorAll('button').forEach((b, i) => { setRich(b.querySelector('b'), steps[i].nav); b.onclick = () => goStep(i); });
  $('chapter-select').innerHTML = steps.map((s, i) => `<option value="${i}">${String(i + 1).padStart(2, '0')} · ${plain(s.nav)}</option>`).join('');
  $('chapter-select').onchange = e => goStep(+e.target.value);
  // Steps are softly shaded segments of the scrubber.
  $('ticks').innerHTML = steps.map((s, i) => { const a = s.t / duration * 100, b = stepEnd(i) / duration * 100; return `<b style="left:${a.toFixed(2)}%;width:${(b - a).toFixed(2)}%"></b>${i ? `<i style="left:${a.toFixed(2)}%"></i>` : ''}`; }).join('')
    + asks.map(k => `<u class="ask-tick" style="left:${(askAt(k) / duration * 100).toFixed(2)}%"></u>`).join('');
  const scrub = $('time'); scrub.max = duration; $('duration').textContent = clock(duration);
  scrub.oninput = () => { setPlaying(false); seek(+scrub.value); };
  scrub.addEventListener('keydown', e => {
    const k = e.key, step = e.shiftKey ? 10 : 2; let handled = true;
    if (k === 'ArrowRight' || k === 'ArrowUp') nudge(step); else if (k === 'ArrowLeft' || k === 'ArrowDown') nudge(-step);
    else if (k === 'PageDown') jumpStep(1); else if (k === 'PageUp') jumpStep(-1);
    else if (k === 'Home') { setPlaying(false); seek(0); } else if (k === 'End') { setPlaying(false); seek(duration - .01); } else handled = false;
    if (handled) e.preventDefault();
  });
  scrub.addEventListener('pointermove', e => {
    const r = scrub.getBoundingClientRect(), t = clamp((e.clientX - r.left - 7) / Math.max(1, r.width - 14)) * duration, tip = $('scrub-tip');
    tip.textContent = `${clock(t)} · ${plain(steps[stepAt(t)].nav)}`; tip.style.left = `${(e.clientX - r.left).toFixed(0)}px`; tip.hidden = false;
  });
  scrub.addEventListener('pointerleave', () => { $('scrub-tip').hidden = true; });
  $('play').onclick = () => setPlaying(!playing);
  // A fresh run from the start asks every question again.
  $('restart').onclick = () => { answered.clear(); refreshAnswers(); seek(0); setPlaying(true); };
  $('ask-watch').onclick = () => choose(-1);
  $('beat-prev').onclick = () => jumpStep(-1); $('beat-next').onclick = () => jumpStep(1);
  const speedEl = $('speed');
  speedEl.onchange = () => { speed = +speedEl.value; wake(); };
  const asked = +query.get('speed'); if (SPEEDS.includes(asked)) { speed = asked; speedEl.value = String(asked); }
  $('loop').onclick = () => setLoop(loopStep < 0);
  $('labels').onclick = () => { labelsOn = !labelsOn; $('labels').setAttribute('aria-pressed', String(labelsOn)); $('labels').textContent = labelsOn ? 'Labels' : 'Labels: off'; announce(labelsOn ? 'Labels on.' : 'Labels off.'); wake(); };
  $('labels').setAttribute('aria-pressed', String(labelsOn)); if (!labelsOn) $('labels').textContent = 'Labels: off';
  $('read-pause').onclick = () => { reading.skip(); wake(); };
  $('explore').onclick = () => setExploring(!exploring);
  $('section-notes').onclick = () => readNotes(steps[stepAt(time)].notes || spec.notes);
  $('notes-close').onclick = () => closeNotes();
  $('more').onclick = () => toggleSettings();
  document.addEventListener('pointerdown', e => { if (!$('settings').hidden && !e.target.closest('#settings,#more')) toggleSettings(false); });
  $('shortcuts-button').onclick = () => openShortcuts(); $('shortcuts-open').onclick = () => { toggleSettings(false); openShortcuts(); };
  $('shortcuts-close').onclick = () => $('shortcuts').close(); $('figure-close').onclick = () => $('figure-dialog').close();
  const qualityEl = $('quality'), paceEl = $('read-pace'), motionEl = $('motion');
  paceEl.onchange = () => setPace(paceEl.value, true);
  motionEl.value = motion; motionEl.onchange = () => { motion = motionEl.value; prefs.set('motion', motion); setCalm(motion === 'auto' ? rmq.matches : motion === 'reduced'); };
  rmq.addEventListener('change', () => { if (motion === 'auto') setCalm(rmq.matches); });
  qualityEl.onchange = async () => { quality = qualityEl.value; prefs.set('quality', quality); if (quality === 'auto' && !autoTier) autoTier = await measure(); applyTier(quality === 'auto' ? autoTier : quality); };
  // Lecture figures posted by the notes panel.
  addEventListener('message', e => {
    if (e.origin !== location.origin || e.source !== $('notes-frame').contentWindow || e.data?.kind !== 'lecture-figure' || !e.data.src?.startsWith('data:image/')) return;
    $('figure-image').src = e.data.src; $('figure-image').alt = e.data.alt || 'Lecture figure'; $('figure-caption').textContent = e.data.alt || ''; $('figure-dialog').showModal();
  });

  // The guided camera stays in charge of the view: a drag of more than 5 px (or a second finger) hands the gesture to
  // the orbit controls (Explore); a wheel tick zooms the guided shot; double-click or Esc resumes it.
  const canvas = renderer.domElement, down = new Map();
  let press = null, forwarding = false;
  const handOver = () => {
    setExploring(true); forwarding = true;
    for (const {start: ev, last: at} of down.values()) canvas.dispatchEvent(new PointerEvent('pointerdown', {pointerId: ev.pointerId, pointerType: ev.pointerType, clientX: at.clientX, clientY: at.clientY, button: ev.button, buttons: ev.buttons, isPrimary: ev.isPrimary, bubbles: true}));
    forwarding = false;
  };
  canvas.addEventListener('pointerdown', e => { if (forwarding) return; down.set(e.pointerId, {start: e, last: e}); press = {x: e.clientX, y: e.clientY, id: e.pointerId, moved: false}; if (!exploring && down.size >= 2) { press.moved = true; handOver(); } });
  canvas.addEventListener('pointermove', e => { if (down.has(e.pointerId)) down.get(e.pointerId).last = e; if (press && !press.moved && e.pointerId === press.id && Math.hypot(e.clientX - press.x, e.clientY - press.y) > 5) { press.moved = true; if (!exploring) handOver(); } });
  const lift = e => { down.delete(e.pointerId); if (press?.id === e.pointerId) press = null; };
  canvas.addEventListener('pointerup', lift); canvas.addEventListener('pointercancel', lift);
  canvas.addEventListener('wheel', e => { if (exploring) return; e.preventDefault(); zoom = Math.min(2, Math.max(.5, zoom * Math.exp(e.deltaY * .0012))); wake(); }, {passive: false});
  canvas.addEventListener('dblclick', () => { if (exploring) setExploring(false); });
  controls.addEventListener('change', wake);
  // Mouse clicks leave focus on the page, so Space always plays and pauses; keyboard focus is kept.
  document.addEventListener('pointerup', e => { if (e.pointerType !== 'mouse') return; const b = e.target.closest?.('.transport button,.top-controls button,.chapters button,.narration button'); if (b) setTimeout(() => b.blur()); });

  // The film's keys (? lists them).
  const KEYMAP = [
    {keys: ['Space', 'K'], label: 'Play or pause', run: () => setPlaying(!playing)},
    {keys: ['←', '→'], label: 'Back or forward 2 s · with Shift, 10 s', match: e => e.key === 'ArrowLeft' || e.key === 'ArrowRight', run: e => e.key === 'ArrowRight' && reading.holding ? (reading.skip(), wake()) : nudge((e.key === 'ArrowRight' ? 1 : -1) * (e.shiftKey ? 10 : 2))},
    {keys: ['[', ']'], alt: 'Page Up / Page Down', label: 'Previous or next step', match: e => ['[', ']', 'PageUp', 'PageDown'].includes(e.key), run: e => { const fwd = e.key === ']' || e.key === 'PageDown'; if (fwd && reading.holding) { reading.skip(); wake(); } else jumpStep(fwd ? 1 : -1); }},
    {keys: [',', '.'], label: 'Previous or next step', match: e => e.key === ',' || e.key === '.', run: e => jumpStep(e.key === '.' ? 1 : -1)},
    {keys: ['Home', 'End'], label: 'Start, or the end', match: e => e.key === 'Home' || e.key === 'End', run: e => { setPlaying(false); seek(e.key === 'Home' ? 0 : duration - .01); }},
    {keys: ['E'], label: 'Explore in 3D, or resume the guided camera', run: () => setExploring(!exploring)},
    {keys: ['L'], label: 'Labels', run: () => $('labels').click()},
    {keys: ['R'], label: 'Loop this step', run: () => setLoop(loopStep < 0)},
    {keys: ['M'], label: 'Reduce motion', run: () => { motion = calm ? 'full' : 'reduced'; motionEl.value = motion; prefs.set('motion', motion); setCalm(!calm); toast(calm ? 'Reduced motion on (M).' : 'Full motion (M).', 2000); }},
    {keys: ['N'], label: 'Lecture notes', run: () => $('notes-panel').hidden ? readNotes(steps[stepAt(time)].notes || spec.notes) : closeNotes()},
    ...asks.length ? [{keys: ['1', '2', '3', '4'], label: 'Answer a prediction (Space just watches)', match: e => asking !== null && /^[1-9]$/.test(e.key) && +e.key <= steps[asking].predict.choices.length, run: e => choose(+e.key - 1)}] : [],
    {keys: ['?'], label: 'Keyboard shortcuts', match: e => e.key === '?', run: () => openShortcuts()},
    {keys: ['Esc'], label: 'Close the top panel, or return to the guided camera', match: e => e.key === 'Escape', run: () => escape()},
  ];
  KEYMAP.forEach(k => { k.match ??= e => k.keys.some(key => key === 'Space' ? e.code === 'Space' : key.length === 1 && e.key.toLowerCase() === key.toLowerCase()); });
  $('shortcut-list').innerHTML = KEYMAP.map(k => `<div><dt>${k.keys.map(x => `<kbd>${x}</kbd>`).join(' ')}${k.alt ? ` <small>or ${k.alt}</small>` : ''}</dt><dd>${k.label}</dd></div>`).join('');
  addEventListener('keydown', e => {
    if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.altKey) return;
    const el = e.target;
    if (e.key === 'Escape' && !document.querySelector('dialog[open]')) { e.preventDefault(); escape(); return; }
    if (el.closest?.('input:not([type=range]),select,textarea') || document.querySelector('dialog[open]')) return;
    if (el.closest?.('button,a,summary') && (e.key === ' ' || e.key === 'Enter')) return;
    if (!$('notes-panel').hidden) return;
    const entry = KEYMAP.find(k => k.match(e)); if (!entry) return;
    e.preventDefault(); entry.run(e);
  });
  let resizeQueued = false;
  addEventListener('resize', () => { if (resizeQueued) return; resizeQueued = true; requestAnimationFrame(() => { resizeQueued = false; labels.resetSizes(); camera.aspect = innerWidth / innerHeight; pipeline.resize(); relayout(); wake(); }); });
  // A lost graphics context (a GPU reset, a reclaimed background tab) comes back with its lighting rebuilt.
  canvas.addEventListener('webglcontextlost', e => { e.preventDefault(); $('gl-lost').hidden = false; });
  canvas.addEventListener('webglcontextrestored', () => { restoreEnvironment(renderer, [scene]); $('gl-lost').hidden = true; wake(); });
  // Reading clocks stop while the page is hidden: nobody reads a hidden tab.
  document.addEventListener('visibilitychange', () => { reading.freeze(document.hidden); last = performance.now(); if (!document.hidden) wake(); });

  function setPlaying(on) {
    // Playing on from a question (Play, Space) just watches.
    if (on && asking !== null) { answered.set(asking, -1); refreshAnswers(); closeAsk(); reading.skip(); }
    if (!on) reading.hideChip();
    if (on && exploring) setExploring(false, false);
    playing = on; last = performance.now(); pipeline.governor.skip = 30;
    $('play-symbol').textContent = on ? 'Ⅱ' : '▶'; $('play-text').textContent = on ? 'Pause' : 'Play'; $('play').setAttribute('aria-label', on ? 'Pause' : 'Play');
    document.body.classList.toggle('playing', on); wake();
  }
  // Seeking (scrubbing, a step, ← →) keeps the camera guided and starts the reading clocks afresh.
  function seek(t) {
    closeAsk();  // unanswered: playing through that moment again asks again
    time = Math.min(duration - .001, Math.max(0, t)); reading.reset();
    if (loopStep >= 0 && stepAt(time) !== loopStep) setLoop(false, true);
    wake();
  }
  function nudge(dt) { setPlaying(false); seek(time + dt); }
  function goStep(i) { setPlaying(false); if (exploring) setExploring(false, false); seek(steps[Math.max(0, Math.min(steps.length - 1, i))].t + .01); }
  function jumpStep(dir) { const i = stepAt(time), s = steps[i]; goStep(dir > 0 ? i + 1 : time > s.t + 1.5 ? i : i - 1); }
  function setLoop(on, quiet = false) { loopStep = on ? stepAt(time) : -1; $('loop').setAttribute('aria-pressed', String(on)); if (!quiet) toast(on ? `Looping “${plain(steps[loopStep].nav)}”.` : 'Step loop off.', 2000); }
  function setExploring(on, resume = true) {
    if (on === exploring) return;
    exploring = on; controls.enabled = on; document.body.classList.toggle('exploring', on); $('explore').textContent = on ? 'Resume guided camera' : 'Explore in 3D';
    if (on) { resumePlay = playing; if (playing) setPlaying(false); }
    else { resumeFrom = currentPose(camera, controls, lensAnchor); resumeStart = performance.now(); const again = resume && resumePlay; resumePlay = false; if (again) setPlaying(true); }
    relayout(); announce(on ? 'Explore: drag to turn, scroll to zoom; Escape returns to the guided camera.' : 'Guided camera.'); wake();
  }
  function setCalm(on) { calm = on; controls.enableDamping = !on; document.body.classList.toggle('calm', on); wake(); }
  function setPace(value, remember = false) {
    value = reading.setPace(value); paceEl.value = value;
    if (remember) { prefs.set('readPace', value); toast(reading.enabled ? `Reading pauses: ${value}. Playback waits until text has been on screen long enough to read.` : 'Reading pauses off: playback runs straight on.', 2600); }
  }
  function toggleSettings(open = $('settings').hidden) { $('settings').hidden = !open; $('more').setAttribute('aria-expanded', String(open)); if (open) $('settings').querySelector('select,button')?.focus(); relayout(); }
  function openShortcuts() { setPlaying(false); $('shortcuts').showModal(); }
  function escape() { if (!$('settings').hidden) return toggleSettings(false); if (!$('notes-panel').hidden) return closeNotes(); if (exploring) setExploring(false); }
  let notesOpener = null;
  // The notes page loads once in the panel; later opens only scroll it to the step's section.
  function readNotes(section) {
    setPlaying(false); const frame = $('notes-frame');
    const go = () => { const doc = frame.contentDocument; doc?.fonts.ready.then(() => { if (section) doc.getElementById(section)?.scrollIntoView({behavior: 'instant', block: 'start'}); }); };
    if (frame.dataset.loaded) go(); else { frame.onload = () => { frame.dataset.loaded = '1'; try { frame.contentDocument.addEventListener('keydown', e => { if (e.key === 'Escape') closeNotes(); }); } catch { /* cross-origin */ } go(); }; frame.src = spec.notesPage || 'notes.html'; }
    if ($('notes-panel').hidden) notesOpener = document.activeElement;
    $('notes-panel').hidden = false; document.body.classList.add('reading'); $('notes-close').focus();
  }
  function closeNotes() { if ($('notes-panel').hidden) return; $('notes-panel').hidden = true; document.body.classList.remove('reading'); (notesOpener?.isConnected && notesOpener !== document.body ? notesOpener : $('section-notes')).focus(); wake(); }
  let toastTimer = 0, announceTimer = 0;
  function toast(text, ms = 3200) { const el = $('toast'); el.textContent = text; el.hidden = false; clearTimeout(toastTimer); toastTimer = setTimeout(() => { el.hidden = true; }, ms); announce(text); }
  function announce(text) { clearTimeout(announceTimer); announceTimer = setTimeout(() => { const el = $('announcer'); el.textContent = ''; requestAnimationFrame(() => { el.textContent = text; }); }, 0); }

  // ---------- Predict, then watch ----------
  // The next question playback would reach from t (unanswered this visit; while a step loops, only its own), if any.
  const askAhead = t => { for (const k of asks) if (!answered.has(k) && askAt(k) > t - 1e-6 && (loopStep < 0 || k === loopStep)) return k; return null; };
  // Playback has reached a question: it pauses on it in the narration, in place of the narration's foot.
  function openAsk(k) {
    const p = steps[k].predict; setPlaying(false); asking = k;
    setRich($('ask-question'), p.question);
    $('ask-keys').textContent = `Answer with 1–${p.choices.length}`;
    $('ask-choices').innerHTML = p.choices.map((c, n) => `<button data-choice="${n}"><kbd aria-hidden="true">${n + 1}</kbd><span></span></button>`).join('');
    $('ask-choices').querySelectorAll('button').forEach((b, n) => { setRich(b.querySelector('span'), p.choices[n].text); b.setAttribute('aria-keyshortcuts', String(n + 1)); b.onclick = () => choose(n); });
    $('ask').hidden = false; document.querySelector('.narration').classList.add('asking'); relayout(); keepStepInView();
    // Focus goes to the question (not to a choice, so Space still plays on) unless the viewer is busy elsewhere.
    const el = document.activeElement;
    if (!el || el === document.body || el.closest?.('.transport,.chapters,.narration')) $('ask').focus({preventScroll: true});
    announce(`Paused to predict. ${plain(p.question)} ${p.choices.map((c, n) => `${n + 1}: ${plain(c.text)}.`).join(' ')} Or just watch.`);
  }
  function closeAsk() {
    if (asking === null) return;
    const had = $('ask').contains(document.activeElement); asking = null;
    $('ask').hidden = true; document.querySelector('.narration').classList.remove('asking');
    if (had) $('play').focus({preventScroll: true});
    relayout(); keepStepInView();
  }
  // The step list ends above the narration, so it shortens while a question is open: its current step stays in view,
  // clear of the list's faded foot (after relayout's frame has set the new height). A list that fits never moves.
  const keepStepInView = () => requestAnimationFrame(() => {
    const list = $('chapters'), b = list.querySelector('[aria-current=step]'); if (!b || list.scrollHeight <= list.clientHeight + 1) return;
    const l = list.getBoundingClientRect(), r = b.getBoundingClientRect(), foot = 30;
    if (r.bottom > l.bottom - foot) list.scrollTop += r.bottom - (l.bottom - foot); else if (r.top < l.top) list.scrollTop -= l.top - r.top;
  });
  // A choice (n), or −1 to just watch: playback goes on into the result.
  function choose(n) {
    if (asking === null || n < -1 || n >= steps[asking].predict.choices.length) return;
    answered.set(asking, n); refreshAnswers(); closeAsk(); reading.skip(); setPlaying(true);
  }
  // The answers as the scene's update() and annotate() read them: {[predict.id or step index]: {choice, text, correct}}.
  function refreshAnswers() {
    answers = {};
    for (const [k, n] of answered) if (n >= 0) { const p = steps[k].predict, c = p.choices[n]; answers[p.id ?? k] = {choice: n, text: plain(c.text), correct: c.correct ?? null}; }
    if (shownStep >= 0) recall(shownStep); wake();
  }
  // A result step (the step after a question) recalls the viewer's prediction under its caption: "You predicted: …",
  // "Right." or "Not quite." when a choice is marked correct, and the choice's own `reply`.
  const recallOf = i => { const k = i - 1, n = asks.includes(k) ? answered.get(k) : undefined; return n >= 0 ? steps[k].predict.choices[n] : null; };
  function fillRecall(el, c) {
    el.textContent = 'You predicted: '; const b = document.createElement('b'); setRich(b, c.text); el.append(b, '.');
    if (c.correct != null) { const v = document.createElement('span'); v.className = c.correct ? 'right' : 'wrong'; v.textContent = c.correct ? 'Right.' : 'Not quite.'; el.append(' ', v); }
    if (c.reply) { const r = document.createElement('span'); setRich(r, c.reply); el.append(' ', r); }
  }
  function recall(i) {
    const c = recallOf(i), el = $('predicted'), was = el.hidden;
    if (c) fillRecall(el, c); el.hidden = !c;
    if (was !== el.hidden) relayout();
  }
  // Page chrome that labels must not cover; the step list ends above the narration, whatever its height. The free parts
  // of the screen (`rooms`, for shots that fit a box) lie below the header and above the transport: right of the
  // narration where it is a column at the lower left, and above it, clear of the step list.
  let rooms = [{left: 0, top: 0, right: innerWidth, bottom: innerHeight}], tallest = {size: '', height: 0, width: 0};
  // The narration's height at its longest step (and its width at its widest), measured on a hidden copy once per
  // window size, so the free areas above it and beside it keep still from step to step.
  const narrationSize = nar => {
    const size = `${innerWidth}x${innerHeight}`; if (tallest.size === size) return tallest;
    const probe = nar.cloneNode(true); probe.querySelectorAll('[id]').forEach(el => el.removeAttribute('id'));
    probe.style.visibility = 'hidden'; probe.setAttribute('aria-hidden', 'true'); nar.after(probe);
    let height = 0, width = 0;
    // A question's step is measured as it asks, and a result step with each prediction it could recall.
    const ask = probe.querySelector('.ask'), recalled = probe.querySelector('.predicted');
    steps.forEach((s, i) => {
      probe.querySelector('h1').innerHTML = s.title.split('<br>').map(line => `<span class="l">${line}</span>`).join(' ');
      setRich(probe.querySelector('h1 + p'), s.text);
      if (asks.includes(i)) {
        setRich(ask.querySelector('.ask-question'), s.predict.question);
        ask.querySelector('.ask-choices').innerHTML = s.predict.choices.map((c, n) => `<button><kbd>${n + 1}</kbd><span>${plain(c.text)}</span></button>`).join('');
      }
      for (const c of asks.includes(i - 1) ? [null, ...steps[i - 1].predict.choices] : [null]) {
        if (c) fillRecall(recalled, c); recalled.hidden = !c;
        for (const on of asks.includes(i) ? [false, true] : [false]) { probe.classList.toggle('asking', on); ask.hidden = !on; height = Math.max(height, probe.offsetHeight); width = Math.max(width, probe.getBoundingClientRect().width); }
      }
    });
    probe.remove(); tallest = {size, height, width}; return tallest;
  };
  function relayout() {
    requestAnimationFrame(() => {
      // The film's layout leaves room for its transcript card on narrow screens; the scenes have none.
      const nar = document.querySelector('.narration'); if (nar) document.body.style.setProperty('--narr', `${Math.ceil(nar.offsetHeight)}px`); document.body.style.setProperty('--card', '0px');
      const box = s => { const el = document.querySelector(s); if (!el || el.hidden || !el.getClientRects().length) return null; const r = el.getBoundingClientRect(); return r.width > 0 && r.height > 0 ? r : null; };
      labels.layout(['.brand', '.top-controls', '#chapters', '#chapter-name', '.narration', '.transport', '#settings'].map(box).filter(Boolean).map(r => ({x: r.left, y: r.top, w: r.width, h: r.height})));
      const head = Math.max(box('.brand')?.bottom ?? 0, box('.top-controls')?.bottom ?? 0), foot = box('.transport')?.top ?? innerHeight, text = box('.narration'), list = box('#chapters');
      const top = head + 10, bottom = foot - 10, upright = list && list.height > list.width;
      rooms = [];
      const widest = text ? Math.max(text.width, narrationSize(nar).width) : 0;
      if (text && widest < innerWidth * .66) rooms.push({left: text.left + widest + 16, top, right: innerWidth - 12, bottom});
      if (text) rooms.push({left: upright ? list.right + 16 : 12, top: upright || !list ? top : Math.max(top, list.bottom + 8), right: innerWidth - 12, bottom: Math.min(bottom, text.bottom - narrationSize(nar).height - 8)});
      if (!rooms.length) rooms.push({left: 12, top, right: innerWidth - 12, bottom});
      wake();
    });
  }
  function showStep(i) {
    const s = steps[i];
    $('beat-number').textContent = String(i + 1).padStart(2, '0'); setRich($('beat-topic'), s.topic || spec.eyebrow || '');
    // The author's line breaks become block spans, so the heading's accessible name keeps its spaces.
    $('beat-title').innerHTML = s.title.split('<br>').map(line => `<span class="l">${line}</span>`).join(' '); enrichTree($('beat-title'));
    setRich($('beat-copy'), s.text);
    const buttons = [...$('chapters').querySelectorAll('button.ch')];
    buttons.forEach((b, k) => k === i ? b.setAttribute('aria-current', 'step') : b.removeAttribute('aria-current'));
    buttons[i]?.scrollIntoView({block: 'nearest', inline: 'nearest'});
    $('chapter-select').value = String(i); setRich($('chapter-name'), s.nav);
    $('section-notes').hidden = !(s.notes || spec.notes);
    recall(i);
    if (shownStep >= 0) announce(`Step ${i + 1} of ${steps.length}. ${plain(s.title)} ${s.text}${$('predicted').hidden ? '' : ' ' + $('predicted').textContent}`);
    shownStep = i; relayout();
  }

  // ---------- Quality ----------
  let quality = TIERS[query.get('quality')] || query.get('quality') === 'auto' ? query.get('quality') : prefs.get('quality') || 'auto', autoTier = null;
  if (!TIERS[quality]) quality = 'auto';
  qualityEl.value = quality;
  const qualityNote = () => { const r = renderer.getPixelRatio(); $('quality-note').textContent = `${quality === 'auto' ? 'Auto: ' : ''}${TIERS[pipeline.tier].label} · ${Math.round(innerWidth * r)}×${Math.round(innerHeight * r)} px${TIERS[pipeline.tier].ao ? ' · ambient occlusion' : ''}`; };
  function applyTier(name) { pipeline.setTier(name); document.body.classList.toggle('low-power', pipeline.tier === 'low'); qualityNote(); wake(); }
  // Startup probe behind the loader: synced frames of this scene at the High tier.
  const measure = () => pipeline.measure(() => draw(0));

  // ---------- Loop ----------
  function wake() { if (!raf) raf = requestAnimationFrame(frame); }
  function draw(dt) {
    const i = stepAt(time);
    if (i !== shownStep) showStep(i);
    scrub.value = time; $('clock').textContent = clock(time);
    zoomShown += (zoom - zoomShown) * (1 - Math.exp(-dt / .12)); if (Math.abs(zoomShown - zoom) < 1e-3) zoomShown = zoom;
    const coasting = exploring && controls.update();
    // The scene first (its shots can follow what it poses), at the view's scale; then the camera.
    content.update(time, {calm, pxPerA: viewScale(camera, controls.target), answers});
    setCamera();
    pipeline.render();
    labels.begin();
    content.annotate?.(time, {label: (p, title, sub, o) => labels.label(p, title, sub, o), tag: (p, text, o) => labels.tag(p, text, o), bracket: (a, b, text) => labels.bracket(a, b, text), answers});
    const moving = labels.end(camera, innerWidth, innerHeight, dt, playing ? speed : 1, labelsOn);
    reading.track(performance.now());
    return moving || coasting || !!resumeFrom || zoomShown !== zoom;
  }
  function frame(now) {
    raf = 0;
    const raw = now - last, dt = Math.max(0, Math.min(1 / 20, raw / 1000 || 0)); last = now;
    if (playing && !document.hidden && quality === 'auto') { const next = pipeline.govern(raw, now); if (next) { autoTier = next; applyTier(next); toast(`Graphics lowered to ${TIERS[next].label} to keep playback smooth. Change it under More.`, 4000); } }
    let ask = null;
    if (playing && !document.hidden) {
      let next = reading.next(time, dt, speed);
      // A question ahead: playback brakes to it (as reading pauses do) and pauses there, once any reading pause at
      // that moment has run (the step's caption is read before the question comes).
      const k = askAhead(time);
      if (k !== null) {
        const at = askAt(k); next = Math.min(next, time + dt * Math.sqrt(2 * 2.4 * speed * Math.max(0, at - time)) + 1e-5);
        if (next >= at - 2e-4) { next = Math.max(time, at - 1e-4); if (!reading.holding) ask = k; }
      }
      if (loopStep >= 0 && next >= stepEnd(loopStep)) { next = steps[loopStep].t + .01; reading.reset(); }
      else if (next >= duration) { if (spec.loop === false) { next = duration - .001; setPlaying(false); } else { next = 0; reading.reset(); } }
      time = next;
    }
    if (ask !== null) openAsk(ask);
    const busy = draw(dt);
    pipeline.recordWork(performance.now() - now);
    if (playing || busy || reading.holdAmp > 0) wake();
  }

  if (debug) window.scenePlayer = {
    seek: t => { seek(t); }, play: on => setPlaying(on), labels: () => labels.snapshot(), shown: () => labels.shown(),
    state: () => ({time, playing, holding: reading.holding, step: stepAt(time), exploring, steps: steps.length, duration, speed, section: steps[stepAt(time)].notes || spec.notes || null, asking}),
    // The steps that ask, when each asks, and this visit's answers (as update() and annotate() get them).
    predictions: () => ({steps: asks.slice(), at: asks.map(askAt), asking, answers: structuredClone(answers)}),
    camera: () => ({position: camera.position.toArray(), target: controls.target.toArray()}),
    // Where a world point lands on screen (px), with the camera as drawn.
    project: xyz => { const v = V(...xyz).project(camera); return [(v.x + 1) * innerWidth / 2, (1 - v.y) * innerHeight / 2]; },
    content: () => content, reading: () => reading.debug(), quality: () => ({choice: quality, tier: pipeline.tier, ao: pipeline.ao.enabled, bloom: pipeline.bloom.enabled}),
    // Looks at a point (world coordinates) from another, as exploring does, to inspect a detail.
    look: (target, from) => { setExploring(true); controls.target.set(...target); camera.position.set(...from); controls.update(); wake(); },
  };
  setPace(query.get('read') || prefs.get('readPace') || 'normal');
  setCalm(calm); if (loopStep >= 0) setLoop(true, true);
  $('load-detail').textContent = 'Measuring graphics speed';
  if (quality === 'auto') autoTier = await measure();
  applyTier(quality === 'auto' ? autoTier : quality);
  relayout(); draw(0);
  const l = $('loader'); l.classList.add('hidden'); setTimeout(() => { l.hidden = true; }, 800);
  setPlaying(!calm && query.get('autoplay') !== '0');
}

// The page around the 3D view, as the film has it: header with the course's links, step list, narration with the
// notes link and the reading chip, transport, labels layer, settings, notes panel and dialogs.
function buildShell(spec) {
  document.title = spec.pageTitle || spec.title;
  document.body.insertAdjacentHTML('afterbegin', `
<div id="viewport" aria-hidden="true"></div><div class="vignette" aria-hidden="true"></div>
<header><a class="brand" href="${spec.courseHome || '../'}"><span class="brand-mark" aria-hidden="true">II</span><span>MOLECULAR BIOLOGY<br><b>OF GENES</b></span></a>
<div class="top-controls">${(spec.links || []).map(l => `<a href="${l.href}">${l.text}</a>`).join('')}<button id="explore" aria-keyshortcuts="e">Explore in 3D</button><button id="more" aria-expanded="false" aria-controls="settings">More</button></div></header>
<div id="settings" class="settings" role="dialog" aria-label="More options" hidden>
<label class="setting"><span>Graphics quality</span><select id="quality"><option value="auto">Auto</option><option value="high">High</option><option value="balanced">Balanced</option><option value="low">Low · saves battery</option></select></label><p id="quality-note" class="setting-note"></p>
<label class="setting"><span>Motion <kbd>M</kbd></span><select id="motion"><option value="auto">Follow system</option><option value="full">Full</option><option value="reduced">Reduced</option></select></label>
<label class="setting"><span>Pause to read</span><select id="read-pace"><option value="relaxed">Relaxed</option><option value="normal" selected>Normal</option><option value="brisk">Brisk</option><option value="off">Off</option></select></label><p class="setting-note">Playback waits until each caption has been on screen long enough to read.</p>
<div class="setting-buttons"><button id="shortcuts-open">Keyboard shortcuts <kbd>?</kbd></button></div>
</div>
<div id="toast" class="toast" hidden></div>
<div id="gl-lost" class="gl-lost" role="alert" hidden><p>Graphics were interrupted — restoring…</p></div>
<nav class="chapters" id="chapters" aria-label="Steps"></nav><p id="chapter-name" class="chapter-name" aria-hidden="true"></p><label class="chapter-pick"><span class="sr-only">Step</span><select id="chapter-select"></select></label>
<div id="annotations" aria-hidden="true"><svg id="leaders"></svg></div><p id="scene-now" class="sr-only"></p><p id="announcer" class="sr-only" role="status"></p>
<section class="narration" aria-label="Step"><p class="eyebrow"><span id="beat-number">01</span><i></i><span id="beat-topic"></span></p><h1 id="beat-title"></h1><p id="beat-copy"></p>
<p id="predicted" class="predicted" hidden></p><div id="ask" class="ask" role="group" aria-labelledby="ask-question" tabindex="-1" hidden><p class="ask-head"><span>Predict</span><i></i><span id="ask-keys" class="ask-keys"></span></p><p id="ask-question" class="ask-question"></p><div class="ask-row"><div id="ask-choices" class="ask-choices"></div><button id="ask-watch" class="ask-watch">Just watch <span aria-hidden="true">▸</span></button></div></div>
<div class="narration-foot"><button id="section-notes" class="section-notes">Read this section of the notes ↗</button><button id="read-pause" class="read-pause" tabindex="-1" aria-hidden="true" title="Playback waits so the text can be read. Click to go on.">Pausing to read <b aria-hidden="true">▸</b><i></i></button></div></section>
<footer class="transport"><button id="play" class="play" aria-keyshortcuts="Space k"><span id="play-symbol" aria-hidden="true">▶</span><span id="play-text">Play</span></button><button id="restart" class="restart" aria-label="Restart from the beginning">↺</button><button id="beat-prev" class="step" aria-label="Previous step" aria-keyshortcuts=",">‹</button><button id="beat-next" class="step" aria-label="Next step" aria-keyshortcuts=".">›</button>
<div class="scrubber"><label class="sr-only" for="time">Animation position</label><input id="time" type="range" min="0" max="60" step="0.01" value="0"><div class="ticks" id="ticks"></div><div id="scrub-tip" class="scrub-tip" aria-hidden="true" hidden></div></div>
<span class="clock"><span id="clock">0:00</span><em>/</em><span id="duration">0:00</span></span><label class="sr-only" for="speed">Playback speed</label><select id="speed">${SPEEDS.map(s => `<option value="${s}"${s === 1 ? ' selected' : ''}>${s}×</option>`).join('')}</select>
<button id="loop" aria-pressed="false" aria-keyshortcuts="r" title="Loop this step">⟳ Step</button><button id="labels" aria-pressed="true" aria-keyshortcuts="l">Labels</button><button id="shortcuts-button" class="help" aria-label="Keyboard shortcuts" aria-keyshortcuts="?">?</button></footer>
<p class="orbit-hint">Drag to orbit · scroll to zoom · double-click or Esc to resume</p>
<aside id="notes-panel" class="notes-panel" aria-label="Lecture notes" hidden><div class="notes-bar"><span>YOUR LECTURE NOTES</span><button id="notes-close" aria-label="Close lecture notes">×</button></div><iframe id="notes-frame" title="Lecture notes"></iframe></aside>
<dialog id="shortcuts" aria-labelledby="shortcuts-title"><button class="close" id="shortcuts-close" aria-label="Close">×</button><p class="eyebrow">Keyboard</p><h2 id="shortcuts-title">Shortcuts</h2><dl id="shortcut-list" class="shortcut-list"></dl><p>In the 3D view, drag to turn and scroll to zoom; Esc returns to the guided camera.</p></dialog>
<dialog id="figure-dialog" aria-label="Lecture figure"><button class="close" id="figure-close" aria-label="Close figure">×</button><img id="figure-image" alt=""><p id="figure-caption"></p></dialog>`);
  $('beat-topic').textContent = spec.eyebrow || '';
}
