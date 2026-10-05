// Scene (an experiment): alternative splicing, as the notes give it. One pre-mRNA, four exons (each its own colour) and
// three introns, drawn at the scale of its nucleotides (../shared/rna.mjs), is spliced in a different way each time.
// The splice sites that pair are shown by the stretch between them lifting out of the strand into a loop, its two ends
// coming together; once they meet, the strand is cut there and joined, the exons on either side one continuous mRNA,
// while the loop leaves and fades. In turn: the pre-mRNA; constitutive splicing; exon skipping (the viewer predicts
// the mRNA first); intron retention (predicted too: the intron kept makes the mRNA longer); mutually exclusive exons
// and alternative 5′ and 3′ splice sites, each as two copies, one row above the other, the lower row's loops hanging
// below it. A fresh copy of the pre-mRNA fades in for each mode once the last mRNA has faded.
import * as THREE from 'three';
import {runScene} from '../shared/scene_player.mjs';
import {boxAround} from '../shared/camera.mjs';
import {SPLICING, createStrand, loopedRow} from '../shared/rna.mjs';
import {ramp, mix} from '../shared/ease.mjs';

const V = (...a) => new THREE.Vector3(...a);
const hex = c => '#' + c.toString(16).padStart(6, '0');

// ---------- The pre-mRNA ----------
// Nucleotides 0–75: exon 1 [0, 10), intron 1 [10, 22), exon 2 [22, 32), intron 2 [32, 44), exon 3 [44, 54), intron 3
// [54, 66), exon 4 [66, 76). Exon 2 has a second 5′ splice site inside it (its last four nucleotides, ALT5 on, can go
// with intron 2), exon 3 a second 3′ splice site (its first four, before ALT3, can go with intron 2). The strand is
// drawn thicker than the film's RNA, so each stretch's colour reads in a view of the whole pre-mRNA.
const N = 76, EXONS = [[0, 10], [22, 32], [44, 54], [66, 76]], INTRONS = [[10, 22], [32, 44], [54, 66]], ALT5 = 28, ALT3 = 48;
const STRAND = {radius: 2.2, stub: 5, stubRadius: .7};
// Exon 1 the course's RNA orange, then pink, sky blue and green; introns the chapter's grey-violet. The part of an exon
// that an alternative splice site can leave out is a paler shade of it. (Simulated for colour-blind viewers, the
// closest pair is exon 2 beside an intron under protanopia; they are named where it matters.)
const C = {e: [SPLICING.exon, 0xe7609e, 0x5aa0f0, 0x3cc48e], intron: SPLICING.intron, e2b: 0xf6b9d3, e3a: 0xb5d3f8};
const LABEL = {e: C.e.map(hex), intron: '#a9a2d6', site: '#e6edf0'};
const exonColours = (extra = []) => [...EXONS.map(([a, b], k) => [a, b, C.e[k]]), ...extra];

// Times (s): each step starts at its t.
const T = {rule: 0, cons: 11, skipAsk: 25, skip: 34, retAsk: 45, ret: 54, mx: 65, alt: 80, end: 96};
const ROWS = {single: 0, top: -30, bottom: 30};
// The way loops rise: up the screen (−y), leaning a little towards the camera; the lower row's loops hang down.
const UP = V(0, -1, -.3).normalize(), DOWN = V(0, 1, -.3).normalize();
// The view: from in front, a little above (from the subject towards the camera; −y is up on screen).
const DIR = [0, -.16, -1];
const BLEND = 2.4, lead = calm => (calm ? Math.min(BLEND, 1.2) : BLEND) * .35, arrive = calm => T.mx - lead(calm) + (calm ? Math.min(BLEND, 1.2) : BLEND);

// Each copy of the pre-mRNA: its row, the stretches that loop out (each between the two splice sites that pair), when
// it is shown, when its loops rise (to `hold` of the way closed, the sites' pairing in view), and when they close and
// are cut out; its mRNA is what lies outside its loops.
//   rise: loops lift into arches; close: their ends meet (one loop after another); cut: the strand is cut at each pair
//   of sites and joined, the loops leave (lift) and fade.
const RISE = 2.8, CLOSE = 2.4, STAGGER = .35, LIFT = 2;
const RUNS = [
  {id: 'constitutive', row: 'single', show: [T.rule + .2, T.skipAsk], loops: INTRONS, rise: T.cons + .8, hold: .55, close: T.cons + 5},
  {id: 'skip', row: 'single', show: [T.skipAsk + .6, T.retAsk], loops: [[10, 44], [54, 66]], rise: T.skipAsk + 1.6, hold: .5, close: T.skip + .4},
  {id: 'retention', row: 'single', show: [T.retAsk + .6, null], loops: [[10, 22], [54, 66]], rise: T.retAsk + 1.6, hold: .5, close: T.ret + .4},
  {id: 'exclusive2', row: 'top', show: [null, T.alt], loops: [[10, 22], [32, 66]], rise: T.mx + 3, hold: .55, close: T.mx + 6.8},
  {id: 'exclusive3', row: 'bottom', show: [null, T.alt], loops: [[10, 44], [54, 66]], rise: T.mx + 3, hold: .55, close: T.mx + 6.8},
  {id: 'alt5', row: 'top', show: [T.alt + .6, T.end + 1], loops: [[10, 22], [ALT5, 44], [54, 66]], rise: T.alt + 1.6, hold: .55, close: T.alt + 6.2,
    extra: [[ALT5, 32, C.e2b]]},
  {id: 'alt3', row: 'bottom', show: [T.alt + .6, T.end + 1], loops: [[10, 22], [32, ALT3], [54, 66]], rise: T.alt + 1.6, hold: .55, close: T.alt + 6.2,
    extra: [[44, ALT3, C.e3a]]},
];
const closedAt = run => run.close + CLOSE + STAGGER * (run.loops.length - 1);  // the last loop closed
const cutAt = run => closedAt(run) + .2;
const madeAt = run => cutAt(run) + LIFT + .2;                                  // the mRNA alone, the loops gone
// What each copy keeps: the nucleotides outside its loops, in order (its mRNA's pieces, joined end to end).
const kept = loops => { const out = []; let a = 0; for (const [f, t] of loops.slice().sort((x, y) => x[0] - y[0])) { if (f > a) out.push([a, f]); a = t; } if (a < N) out.push([a, N]); return out; };
// Each loop's splice without a step of backbone appearing or vanishing in one frame (as pieces() switches): the step
// joining the exons either side fades in, a piece of its own over the strand, in the moment before the strand is cut
// and joined (at), and the two steps holding the loop fade out in the moment after. They come first among the pieces,
// so the strand's own bases, drawn after, stay whole. (Grown as links instead, the bond's two halves showed their
// outlines where they met, and each half's colour changed as the strand took over.)
const STEP = .35;
const spliceSteps = (loops, t, at) => {
  const grow = t < at ? ramp(t, at - STEP, at) : 0, shrink = t >= at ? 1 - ramp(t, at, at + STEP) : 0;
  return loops.flatMap(({from, to}) => [
    ...grow > 0 ? [{ranges: [[from - 1, from], [to, to + 1]], opacity: grow}] : [],
    ...shrink > 0 ? [{ranges: [[from - 1, from + 1]], opacity: shrink}, {ranges: [[to - 1, to + 1]], opacity: shrink}] : []]);
};

const NOTES = {rule: 'alternative-splicing-is-a-rule-not-an-exception', modes: 'modes-of-alternative-splicing'};
const steps = [
  {t: T.rule, nav: 'One gene, many mRNAs', title: 'One gene,<br>many mRNAs.', notes: NOTES.rule, hold: 1.05,
    text: 'For most genes of multicellular eukaryotes, a pre-mRNA is not processed into just one mature mRNA: over 90% of mammalian genes undergo alternative splicing. It is not a mistake by the cellular machinery, but a regulated and essential part of the gene expression program, letting a single gene produce multiple distinct mRNAs, and thus multiple proteins.'},
  {t: T.cons, nav: 'Constitutive splicing', title: 'Constitutive splicing:<br>every intron removed.', notes: NOTES.modes, hold: 1.05,
    text: 'In constitutive splicing, each exon’s 5′ splice site pairs with the next exon’s 3′ splice site: the introns are removed and the exons joined in a consistent, non-variable way, producing a single type of mature mRNA. It is the most common form of splicing, and is not a type of alternative splicing.'},
  {t: T.skipAsk, nav: 'Exon 1 pairs with exon 3', title: 'Exon 1’s 5′ site pairs<br>with exon 3’s 3′ site.', notes: NOTES.modes,
    text: 'Alternative splicing can occur through several mechanisms. In this copy of the pre-mRNA, the 5′ splice site at the end of exon 1 pairs with the 3′ splice site at the start of exon 3, and exon 2’s own splice sites are not used.',
    predict: {id: 'skip', question: 'Which mRNA results?', choices: [
      {text: 'Exons 1, 2, 3 and 4', correct: false, reply: 'Exon 2 lies between the two sites that pair, so it leaves with the introns on either side of it.'},
      {text: 'Exons 1, 3 and 4', correct: true},
      {text: 'Exons 1, 2 and 4', correct: false, reply: 'Exon 3 stays: its 3′ splice site is the one that pairs with exon 1’s.'}]}},
  {t: T.skip, nav: 'Exon skipping', title: 'Exon 2<br>is skipped.', notes: NOTES.modes,
    text: 'Exon 2 leaves with the introns on either side of it, and the mRNA has exons 1, 3 and 4. In exon inclusion or skipping, an entire exon (a cassette exon) is either included in or excluded from the final mRNA; included, exon 2 gives exons 1, 2, 3 and 4.'},
  {t: T.retAsk, nav: 'Intron 2’s sites unused', title: 'Intron 2’s splice sites<br>are not used.', notes: NOTES.modes,
    text: 'In another copy, introns 1 and 3 are removed as before, but neither splice site of intron 2 is used: no pair of sites spans it.',
    predict: {id: 'retention', question: 'Which mRNA results?', choices: [
      {text: 'Exons 1, 2, 3 and 4', correct: false, reply: 'Intron 2 is not removed, so it stays between exons 2 and 3.'},
      {text: 'Exons 1, 2, 3 and 4, with intron 2', correct: true},
      {text: 'Exons 1, 3 and 4', correct: false, reply: 'No exon is lost: only intron 2 stays, between exons 2 and 3.'}]}},
  {t: T.ret, nav: 'Intron retention', title: 'Intron 2 stays<br>in the mRNA.', notes: NOTES.modes,
    text: 'In intron retention, an entire intron is kept in the mature mRNA. With intron 2 between exons 2 and 3, this mRNA is longer than the one constitutive splicing makes.'},
  {t: T.mx, nav: 'Mutually exclusive exons', title: 'Exon 2 or exon 3,<br>but not both.', notes: NOTES.modes, hold: 1.05,
    text: 'With mutually exclusive exons, one of two or more exons is included, but not both. One copy of the pre-mRNA keeps exon 2 and leaves out exon 3; another keeps exon 3 and leaves out exon 2. Which is used is often regulated in a tissue-specific manner.'},
  {t: T.alt, nav: 'Alternative splice sites', title: 'Alternative 5′ and<br>3′ splice sites.', notes: NOTES.modes, hold: 1.1,
    text: 'An alternative 5′ splice site inside exon 2 changes the 3′ end of that upstream exon; an alternative 3′ splice site inside exon 3 changes the 5′ end of that downstream exon. All these modes can be used individually or in combination for a single pre-mRNA.'},
];

const at = {};  // states the tests read
let calmNow = false;  // reduced motion, as the last update() had it (annotate() and the reading pauses' dry runs follow)
// When a copy is shown (0–1): in after its step begins (the mutually exclusive copies once the camera has moved to the
// two rows), out as the next mode begins (the copy before the two rows as the camera starts to move).
function shownOf(run, t) {
  const inn = run.show[0] ?? arrive(calmNow) - .1, out = run.show[1] ?? T.mx - lead(calmNow);
  return ramp(t, inn, inn + .7) * (1 - ramp(t, out, out + .6));
}
// How closed each of a copy's loops is (0 in line … 1 its ends one step apart), and how far it has lifted away.
function loopState(run, k, t) {
  const r0 = run.rise + k * STAGGER, c0 = run.close + k * STAGGER;
  const w = t < c0 ? run.hold * ramp(t, r0, r0 + RISE) : mix(run.hold, 1, ramp(t, c0, c0 + CLOSE));
  const cut = cutAt(run);
  return {w, lift: 30 * ramp(t, cut + .1, cut + LIFT), fade: 1 - ramp(t, cut + .2, cut + LIFT)};
}

runScene({
  pageTitle: 'Alternative splicing · RNA splicing and processing', eyebrow: 'Alternative splicing',
  links: [{href: 'index.html', text: 'All scenes'}],
  steps, duration: T.end, notesPage: 'notes.html', fov: 26, fog: .00005, loop: false,
  shots: [
    {t: T.rule, frame: (t, content) => content.frames.single},
    {t: T.mx, blend: BLEND, frame: (t, content) => content.frames.double},
  ],
  async build({world}) {
    const runs = RUNS.map(run => {
      const strand = createStrand(world, N, STRAND).stretches([...exonColours(), ...(run.extra || [])], C.intron);
      const loops = run.loops.map(([from, to]) => ({from, to, w: 0, lift: 0}));
      const mrna = kept(run.loops);
      return {...run, strand, loops, mrna, shown: 0, cut: false};
    });
    const byId = Object.fromEntries(runs.map(r => [r.id, r]));
    let pxPerA = 1;

    const pose = (run, t) => {
      const shown = shownOf(run, t);
      run.shown = shown;
      if (shown <= 0) { run.strand.opacity(0); return; }
      const states = run.loops.map((L, k) => Object.assign(L, loopState(run, k, t)));
      const toward = run.row === 'bottom' ? DOWN : UP;
      // Before the cut, one strand through its loops; after it, the mRNA's pieces joined end to end, each loop alone.
      run.cut = t >= cutAt(run);
      const splices = spliceSteps(run.loops, t, cutAt(run));
      run.strand.pieces(run.cut ? [...splices, run.mrna, ...run.loops.map((L, k) => ({ranges: [[L.from, L.to]], opacity: states[k].fade}))]
        : splices.length ? [...splices, [0, N]] : null);
      loopedRow(N, run.loops.map((L, k) => ({from: L.from, to: L.to, w: states[k].w, lift: run.cut ? states[k].lift : 0})),
        {origin: V(0, ROWS[run.row], 0), toward, out: run.strand.points});
      run.strand.pose().view(pxPerA).opacity(shown);
    };

    // The nucleotide in the middle of a copy's mRNA (where its name points), and of a stretch.
    const middleOf = ranges => { const all = ranges.flatMap(([a, b]) => Array.from({length: b - a}, (_, i) => a + i)); return all[Math.floor(all.length / 2)]; };
    const above = (run, i, d = 9) => run.strand.world(i).addScaledVector(run.row === 'bottom' ? DOWN : UP, d);
    const centreOf = (run, a, b, d = 9) => run.strand.centre(a, b).addScaledVector(run.row === 'bottom' ? DOWN : UP, d);
    // The strand's 5′ and 3′ ends, named beside them (above the upper row, below a single one).
    const ends = (run, tag) => {
      const off = run.row === 'top' ? UP : DOWN, x = V(1, 0, 0);
      tag(run.strand.world(0).addScaledVector(off, 13).addScaledVector(x, -10), '5′', {color: LABEL.site});
      tag(run.strand.world(N - 1).addScaledVector(off, 13).addScaledVector(x, 4), '3′', {color: LABEL.site});
    };

    const content = {
      runs: byId, at,
      // For tests: each step's start, and the camera's move and the fades and cuts ([start, end], s).
      starts: steps.map(s => s.t),
      get moves() {
        const move = [T.mx - lead(calmNow), arrive(calmNow) + .1];
        return [move, ...runs.flatMap(r => { const inn = r.show[0] ?? arrive(calmNow) - .1, out = r.show[1] ?? T.mx - lead(calmNow);
          return [[inn - .1, inn + .8], [out - .1, out + .7], [cutAt(r) - .3, cutAt(r) + LIFT + .1]]; }).filter(([a]) => a < T.end)];
      },
      update(t, {calm = false, pxPerA: px = 1} = {}) {
        pxPerA = px; calmNow = calm;
        for (const run of runs) pose(run, t);
        at.shown = Object.fromEntries(runs.map(r => [r.id, +r.shown.toFixed(3)]));
        at.closed = Object.fromEntries(runs.map(r => [r.id, r.loops.map(L => +L.w.toFixed(3))]));
        at.cut = Object.fromEntries(runs.map(r => [r.id, r.cut]));
      },
      // The mRNA a copy makes: its pieces, and the nucleotides of each exon (and intron) it keeps.
      mrnaOf(id) {
        const run = byId[id], keep = new Set(run.mrna.flatMap(([a, b]) => Array.from({length: b - a}, (_, i) => a + i)));
        const count = ([a, b]) => Array.from({length: b - a}, (_, i) => a + i).filter(i => keep.has(i)).length;
        return {pieces: run.mrna, exons: EXONS.map(count), introns: INTRONS.map(count), length: keep.size,
          // Each junction: the two nucleotides joined, their distance apart (Å) and the angle (degrees) the strand turns there.
          joins: run.mrna.slice(1).map(([a], k) => { const b = run.mrna[k][1] - 1, p = run.strand.world(b), q = run.strand.world(a), r = run.strand.world(Math.max(0, b - 1));
            return {from: b, to: a, distance: +p.distanceTo(q).toFixed(3), turn: +(q.clone().sub(p).angleTo(p.clone().sub(r)) * 180 / Math.PI).toFixed(2)}; })};
      },
      annotate(t, {label, tag}) {
        const R = byId;
        if (t < T.cons) {
          // The pre-mRNA: its exons and introns, its 5′ and 3′ ends.
          const run = R.constitutive;
          // (Each exon's tag starts over the exon, its pill running on over it.)
          if (t > 1.4) EXONS.forEach(([a], k) => tag(above(run, a + 1), `Exon ${k + 1}`, {color: LABEL.e[k]}));
          if (t > 2.6) label(run.strand.centre(32, 44), 'Intron', 'Between two exons', {color: LABEL.intron, below: true});
          if (t > 3.6) ends(run, tag);
          if (t > 4.6) label(run.strand.world(2), 'Pre-mRNA', 'Of one gene', {color: LABEL.e[0], side: 'left'});
          return;
        }
        if (t < T.skipAsk) {
          const run = R.constitutive;
          if (t > T.cons + 1.6 && t < cutAt(run)) {
            label(run.strand.world(9), '5′ splice site', 'End of exon 1', {color: LABEL.site, below: true, side: 'left'});
            label(run.strand.world(22), '3′ splice site', 'Start of exon 2', {color: LABEL.site, side: 'right'});
          }
          if (t > cutAt(run) + .3 && t < cutAt(run) + LIFT) tag(above(run, 38, 10), 'Introns removed', {color: LABEL.intron});
          if (t > madeAt(run)) label(run.strand.world(middleOf(run.mrna)), 'mRNA', 'Exons 1, 2, 3 and 4, in order', {color: LABEL.mrna, below: true});
          return;
        }
        if (t < T.retAsk) {
          const run = R.skip;
          if (t > T.skipAsk + 2.6 && t < cutAt(run)) {
            label(run.strand.world(9), '5′ splice site', 'End of exon 1', {color: LABEL.site, below: true, side: 'left'});
            label(run.strand.world(44), '3′ splice site', 'Start of exon 3', {color: LABEL.site, side: 'right'});
            if (t > T.skipAsk + 3.6) tag(centreOf(run, 22, 32, 8), 'Exon 2', {color: LABEL.e[1]});
          }
          if (t > cutAt(run) + .3 && t < cutAt(run) + LIFT) tag(above(run, 27, 12), 'Exon 2 skipped', {color: LABEL.e[1]});
          if (t > madeAt(run)) label(run.strand.world(middleOf(run.mrna)), 'mRNA', 'Exons 1, 3 and 4', {color: LABEL.mrna, below: true});
          return;
        }
        if (t < T.mx) {
          const run = R.retention;
          // Its names go as the copy starts to fade, when the camera moves to the two rows.
          if (t >= T.mx - lead(calmNow)) return;
          if (t > T.retAsk + 2.6 && t < cutAt(run)) label(centreOf(run, 32, 44, 3), 'Intron 2', 'Its splice sites not used', {color: LABEL.intron});
          if (t > madeAt(run)) {
            label(run.strand.centre(32, 44), 'Intron 2', 'Kept in the mRNA', {color: LABEL.intron});
            label(run.strand.world(4), 'mRNA', 'Longer, with intron 2', {color: LABEL.mrna, below: true});
          }
          return;
        }
        if (t < T.alt) {
          const a = R.exclusive2, b = R.exclusive3;
          if (a.shown < .6) return;
          if (t > a.rise + 1.2 && t < cutAt(a)) { tag(centreOf(a, 44, 54, 8), 'Exon 3', {color: LABEL.e[2]}); tag(centreOf(b, 22, 32, 8), 'Exon 2', {color: LABEL.e[1]}); }
          if (t > madeAt(a)) {
            label(a.strand.world(middleOf(a.mrna)), 'Exon 2 kept', 'Exons 1, 2 and 4', {color: LABEL.e[1]});
            label(b.strand.world(middleOf(b.mrna)), 'Exon 3 kept', 'Exons 1, 3 and 4', {color: LABEL.e[2], below: true});
          }
          return;
        }
        const a = R.alt5, b = R.alt3;
        if (a.shown < .6) return;
        if (t > a.rise + 1 && t < cutAt(a)) {
          // Both on the right, one above the rows and one below: on the left, the lower one would cover the loop
          // of intron 1 hanging from the lower row.
          label(a.strand.world(ALT5 - 1), 'Alternative 5′ splice site', 'Inside exon 2', {color: LABEL.e[1], side: 'right'});
          label(b.strand.world(ALT3), 'Alternative 3′ splice site', 'Inside exon 3', {color: LABEL.e[2], below: true, side: 'right'});
        }
        if (t > madeAt(a)) {
          label(a.strand.centre(22, ALT5), 'Exon 2', 'Shorter at its 3′ end', {color: LABEL.e[1]});
          label(b.strand.centre(ALT3, 54), 'Exon 3', 'Shorter at its 5′ end', {color: LABEL.e[2], below: true});
        }
        if (t > a.rise + .6) ends(a, tag);
      },
      // Every drawn nucleotide and base of each copy shown (world), with its opacity: shots are fitted to them, and the
      // tests check that none of them passes behind the page's text.
      keyPoints() {
        world.updateMatrixWorld(true);
        return runs.filter(r => r.strand.alpha > 0).map(r => ({name: r.id, opacity: +r.strand.alpha.toFixed(3), points: r.strand.extent()}));
      },
    };

    // Each shot's box, fitted round what its steps show (sampled through them), seen from its direction, with room above
    // for the names.
    const around = (from, to, ids, o) => {
      const pts = [];
      for (let t = from; t <= to + 1e-6; t += .25) { content.update(t); for (const it of content.keyPoints()) if (ids.includes(it.name)) for (const p of it.points) pts.push(V(...p)); }
      return boxAround(pts, DIR, {fov: 26, ...o});
    };
    content.frames = {
      single: around(0, T.mx - 1, ['constitutive', 'skip', 'retention'], {margin: 14, above: 22}),
      double: around(T.mx, T.end, ['exclusive2', 'exclusive3', 'alt5', 'alt3'], {margin: 14, above: 14}),
    };
    content.update(0);
    return content;
  },
});
