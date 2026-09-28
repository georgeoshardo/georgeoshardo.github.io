// Reading pauses (the transcription film's, shared by every animated page). Text on screen (narration, callouts,
// brackets, title cards; not the small tags) must stay up long enough to read: about a second to notice it plus
// ~3 words a second; callouts that appear together are read in turn, and anything already read (a second pass, a
// looped chapter) needs only a glance. Before an unread item would disappear, playback brakes smoothly to a stop at
// that transition (or just before a camera move that starts there), waits, then eases back in. Chapter ends always
// get a short beat. A quiet chip shows while a pause holds; its bar fills as the pause runs out, and clicking it
// (or → on the keyboard) goes on. A single pause never outlasts the pace's cap (a reader who needs longer can pause).
//
// The page describes its script through hooks:
//   shown()        what is on screen now: [{key, text, callout, words?}] (key 'L:…' or 'B:…' for callouts and
//                  brackets, as labels.mjs shown() gives them; `words` overrides the count)
//   narration(t)   the narration at time t: {key, turn, next, beat, held}: its key, when it next changes, the next
//                  chapter's start and its beat (the time playback holds for it, before its camera move), and whether
//                  the page itself will hold there (hold at chapter ends, a voice still reading)
//   probe(t)       the callout and bracket keys the script shows at time t (a dry run of its labels)
//   windows()      camera blends [start, end) in animation time; a pause never freezes the camera mid-move
//   fades(t0, t1)  other timed text leaving between t0 and t1: [{key, t}] (title cards)
//   speed(), calm(), active(): playback speed, reduced motion, and whether pauses apply now (not in an embed)

// Paces: seconds to notice, words a second (narration, callouts), cap for a group of callouts, cap for one pause.
export const PACES = {
  relaxed: {base: 1.3, wps: 2.3, callout: 2.6, group: 8.5, cap: 14},
  normal: {base: 1, wps: 3, callout: 3.3, group: 6.5, cap: 9},
  brisk: {base: .7, wps: 4, callout: 4.4, group: 4.5, cap: 6},
};
// Counters and lengths change within one callout, so standalone numbers are masked; 3′ and 5′ are names.
export const keyOf = text => text.replace(/\b[0-9]+(?:[.,][0-9]+)?\b(?!′)/g, '#').trim();
export const wordCount = text => (text.match(/[^\s·–—|]+/g) || []).length;

export function createReading({chip, focus, shown, narration, probe, windows, fades = () => [], speed = () => 1, calm = () => false, active = () => true}) {
  let R = {...PACES.normal, glance: .9, brake: 2.4, settle: .7, grace: 400, merge: .25};
  const seen = new Set(), items = new Map();
  let enabled = true, pace = 'normal', stop = null, rate = 1, heldAt = 0, chipOn = false, settled = null, frozenAt = 0;
  // Budgets shrink above 1× (a viewer skimming at 5× reads less), never below a glance.
  const speedScale = () => speed() > 1 ? speed() ** -.75 : 1, needOf = it => Math.max(1000 * R.glance, it.need * speedScale());
  const unread = now => [...items].filter(([, it]) => !it.gone && now - it.since < needOf(it)).map(([k]) => k);

  function findStop(t0, r, now) {
    const open = unread(now), horizon = r / (2 * R.brake) + r * .2 + R.merge + .05, t1 = t0 + horizon, stops = [];
    // The narration changes at its next timed part or at the next chapter (held before the camera moves). When the
    // page holds at the chapter end itself (Hold at chapter ends, the voice still reading), that hold waits instead.
    const n = narration(t0), s = n.next ?? null, turn = n.turn ?? Infinity, chapterHold = s !== null && turn === n.beat && n.held;
    if (Number.isFinite(turn) && turn > t0 && turn <= t1 && !chapterHold) {
      const keys = open.filter(k => k === n.key);
      if (keys.length) stops.push({t: turn, keys});
      else if (s !== null && turn === n.beat && settled !== s) stops.push({t: turn, keys: [], settle: s});
    }
    for (const f of fades(t0, t1)) if (open.includes(f.key) && f.t > t0 && f.t <= t1) stops.push({t: f.t, keys: [f.key]});
    const labelKeys = open.filter(k => /^[LB]:/.test(k));
    if (labelKeys.length) {
      // Search up to the next camera move (if one starts soon); text that outlasts it waits before the move.
      const blends = windows(), win = blends.find(([w0]) => w0 > t0 && w0 <= t1), edge = win ? win[0] : t1, atEdge = probe(edge), gone = labelKeys.filter(k => !atEdge.has(k));
      if (gone.length) {
        let lo = t0, hi = edge;
        for (let i = 0; i < 9; i++) { const m = (lo + hi) / 2, here = probe(m); if (gone.some(k => !here.has(k))) hi = m; else lo = m; }
        // Callouts that leave within a quarter-second of the first are held in the same pause.
        const inside = blends.find(([w0, w1]) => lo > w0 && lo < w1), later = probe(Math.min(edge, Math.max(hi, lo + R.merge)));
        if (!inside) stops.push({t: lo, keys: gone.filter(k => !later.has(k))});
      } else if (win) {
        const later = probe(win[1] + .05), left = labelKeys.filter(k => !later.has(k));
        if (left.length) stops.push({t: win[0], keys: left});
      }
    }
    if (!stops.length) return null;
    stops.sort((a, b) => a.t - b.t); const first = stops[0];
    // Stops a few frames apart become one pause (unless a camera move begins between them).
    for (const st of stops.slice(1)) if (st.t - first.t < R.merge && !windows().some(([w0]) => w0 > first.t && w0 <= st.t)) {
      first.keys = [...new Set([...first.keys, ...st.keys])]; if (st.settle !== undefined) first.chapter = st.settle; delete first.settle;
    }
    if (first.settle !== undefined && first.keys.length) delete first.settle;
    // A pause that falls where the chapter's camera move begins also serves as that chapter's beat.
    if (s !== null && Math.abs(first.t - n.beat) < 1e-6) first.chapter = s;
    return first;
  }
  function done(st, now) {
    const held = heldAt > 0 ? now - heldAt : 0;
    if (held >= 1000 * R.cap * speedScale()) return true;
    return st.settle !== undefined ? held >= 1000 * R.settle : st.keys.every(k => { const it = items.get(k); return !it || it.gone || now - it.since >= needOf(it); });
  }
  function showChip(on, now) {
    if (!chip) return;
    if (on !== chipOn) {
      if (!on && document.activeElement === chip) focus?.focus({preventScroll: true});
      chip.classList.toggle('on', on); chip.tabIndex = on ? 0 : -1; chip.setAttribute('aria-hidden', String(!on)); chipOn = on;
    }
    if (on) {
      const left = Math.max(...stop.keys.map(k => { const it = items.get(k); return it ? needOf(it) - (now - it.since) : 0; }), 0);
      const total = Math.max(...stop.keys.map(k => { const it = items.get(k); return it ? needOf(it) : 1; }), 1);
      chip.style.setProperty('--p', (1 - left / total).toFixed(3));
    }
  }

  const reading = {
    PACES,
    // Camera breathing while a pause holds (0–1, and its phase in seconds), for the guided camera.
    holdAmp: 0, holdPhase: 0,
    get enabled() { return enabled; }, get pace() { return pace; },
    get holding() { return !!stop && heldAt > 0; },
    get rate() { return rate; },
    unread,
    // Called after each frame's labels are placed: starts a clock for anything new, forgets what has gone.
    track(now = performance.now()) {
      if (!enabled) return;
      const here = new Set(), fresh = [];
      for (const {key, text, callout, words = wordCount(text)} of shown()) {
        here.add(key); const had = items.get(key); if (had) { had.gone = 0; continue; }
        const seenKey = keyOf(`${key}|${text}`), known = seen.has(seenKey);
        const it = {since: now, need: 1000 * (known ? R.glance : R.base + words / (callout ? R.callout : R.wps)), words: known ? 0 : words, group: callout && !known, seenKey, gone: 0};
        items.set(key, it); if (it.group) fresh.push(it);
      }
      // Something that leaves, or is briefly unplaced by the label layout, keeps its clock for a moment.
      for (const [k, it] of items) if (!here.has(k)) {
        if (!it.gone) it.gone = now;
        else if (now - it.gone > R.grace) { if (now - it.since >= needOf(it)) seen.add(it.seenKey); items.delete(k); }
      }
      if (fresh.length) {
        const group = [...items.values()].filter(it => it.group && now - it.since < 350), words = group.reduce((n, it) => n + it.words, 0);
        for (const it of group) it.need = 1000 * Math.min(R.group, R.base + words / R.callout);
      }
    },
    // The next animation time under reading pauses: brake along v = √(2·a·distance), ease back in after.
    next(t0, dt, r) {
      if (!enabled || !active()) { rate = 1; stop = null; showChip(false); return t0 + dt * r; }
      const now = performance.now();
      if (stop && done(stop, now)) {
        settled = stop.settle ?? stop.chapter ?? settled; const held = heldAt; stop = findStop(t0, r, now);
        // Another stop a few frames ahead continues this hold instead of creeping forward to it.
        if (stop && held && stop.t - t0 < R.merge) { stop.t = t0 + 1e-4; heldAt = held; } else if (stop) heldAt = 0;
      }
      if (!stop) stop = findStop(t0, r, now);
      let m = 1; if (stop) { const left = Math.max(0, stop.t - t0); m = Math.min(1, Math.sqrt(2 * R.brake * r * left) / r); }
      rate = Math.min(m, rate + R.brake * dt); let next = t0 + dt * r * rate;
      if (stop) { if (next >= stop.t - 1e-4) { next = Math.max(t0, stop.t - 1e-4); if (!heldAt) heldAt = now; } else heldAt = 0; } else heldAt = 0;
      showChip(!!stop && heldAt > 0 && now - heldAt > 350 && stop.settle === undefined, now);
      // While held, the camera keeps breathing (not with reduced motion); it eases back when playback resumes.
      reading.holdAmp = heldAt && !calm() ? Math.min(1, reading.holdAmp + dt / 1.5) : Math.max(0, reading.holdAmp - dt / .9);
      if (reading.holdAmp > 0) reading.holdPhase += dt; else reading.holdPhase = 0;
      return next;
    },
    // Everything on screen counts as read: playback goes on at once.
    skip() {
      const now = performance.now();
      for (const it of items.values()) { it.since = -Infinity; seen.add(it.seenKey); }
      if (stop) settled = stop.settle ?? stop.chapter ?? settled;
      stop = null; showChip(false, now);
    },
    // A seek: no pause pending, no beat taken.
    reset() { stop = null; settled = null; heldAt = 0; reading.holdAmp = 0; if (chipOn) showChip(false); },
    hideChip() { if (chipOn) showChip(false); },
    // Reading clocks stop while the page is hidden or scrolled away: nobody reads a hidden tab.
    freeze(frozen) {
      const now = performance.now();
      if (frozen) { if (!frozenAt) frozenAt = now; return; }
      if (!frozenAt) return;
      const d = now - frozenAt; frozenAt = 0;
      for (const it of items.values()) { it.since += d; if (it.gone) it.gone += d; }
      if (heldAt) heldAt += d;
    },
    // 'relaxed', 'normal', 'brisk' or 'off'.
    setPace(value) {
      if (value === '0') value = 'off';
      if (value !== 'off' && !PACES[value]) value = 'normal';
      pace = value; enabled = value !== 'off';
      if (enabled) R = {...R, ...PACES[value]}; else { stop = null; rate = 1; showChip(false); }
      return value;
    },
    // For tests: each item's age and need (ms), the pending stop, the braking rate and how long it has held.
    debug() {
      const now = performance.now();
      return {items: [...items].map(([k, v]) => [k, Math.round(now - v.since), Math.round(v.need)]), stop: stop && {...stop}, rate: +rate.toFixed(3), held: heldAt ? Math.round(now - heldAt) : 0};
    },
  };
  return reading;
}
