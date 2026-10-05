// Scene: insertions, deletions and reversion, on the sequence of the notes' figure (ATCGGACTTACCGGTTA, ideal B-DNA).
// Along each duplex its sequence is written base by base, and above the letters bars group them into codons, read
// three at a time from the start of the gene: the reading frame. Three duplexes stand one above the other, as in the
// figure: a point mutation, an insertion and a deletion. An insertion of five base pairs (the DNA opens and the
// stretch comes forward into the gap) and a deletion of five shift the reading frame, so every codon after them
// changes. Then which can revert: the point mutation by true reversion, or by a second-site reversion elsewhere in the
// gene; the insertion by deletion of the inserted sequence (it moves back out and the DNA closes); the deletion not at
// all. The DNA drawn in pieces meets end to end on one ideal helix, so it stays continuous where the pieces join.
import * as THREE from 'three';
import {runScene} from '../shared/scene_player.mjs';
import {loadSurfaceSet, baseMaterial, fade} from '../shared/molecules.mjs';
import {STRANDS} from '../shared/strands.mjs';
import {pairsFromStrands, frameFromPairs, meanLocal, sequencePairs, createDuplex, RISE, TWIST} from '../shared/dna.mjs';
import {ramp, smooth} from '../shared/ease.mjs';

const V = (...a) => new THREE.Vector3(...a);
const hex = c => '#' + c.toString(16).padStart(6, '0');
const mixHex = (a, b, w) => new THREE.Color(a).lerp(new THREE.Color(b), w).getHex();
const T = {deletion: 16, point: 31, second: 44, back: 57, lost: 70, all: 77, end: 90};
// The notes' sequence; the five base pairs inserted after the ninth; the five deleted from the seventh; the point
// mutation (T → A) at the ninth base and the second-site change (G → C) at the fourteenth.
const WT = 'ATCGGACTTACCGGTTA', INSERTED = 'GTACA', AT_INSERT = 9, AT_DELETE = 6, SHIFT = 5, AT_POINT = 8, AT_SECOND = 13;
// Rows (−y is up): the point mutation above, the insertion, the deletion below. In each row the letters stand above
// the DNA, the codon bars above them, and what the row has become is named below it.
const ROW = {P: -44, I: 0, D: 44}, LETTER_Y = -14.2, BAR_Y = -19, STATUS_Y = 14, AWAY = 40;
const X0 = -10.5 * RISE, PAD = 2;  // x of the first base pair (a row 22 pairs long is centred); pairs padding each piece
const INK = 0xe9e1cf, INSERT = 0xb99be0, CHANGE = 0xff8a6a, REVERT = 0x62d0b4, FRAME = 0x93a7b1;
// When things happen (s).
const E = {
  // The insertion: the DNA opens and the stretch comes forward into the gap from behind; to revert, it moves back
  // out of sight and the DNA closes. The deletion: the stretch is marked and moves back out of sight, and the DNA
  // closes over the gap.
  insertOpen: [4.4, 6.4], insertIn: [6, 8.4],
  mark: T.deletion + 1.6, deleteOut: [T.deletion + 4.2, T.deletion + 6.4], deleteClose: [T.deletion + 6.6, T.deletion + 8.6],
  mutate: T.point + 2.4, revert: T.point + 7, mutateAgain: T.second + 1.4, second: T.second + 5.6,
  insertOut: [T.back + 3.8, T.back + 5.8], insertClose: [T.back + 6, T.back + 8],
};

const MUT = 'mutations-can-affect-single-base-pairs-or-long-sequences', REV = 'some-mutations-can-be-reversed';
const steps = [
  {t: 0, nav: 'An insertion', title: 'An insertion shifts<br>the reading frame.', notes: MUT, hold: 1.2,
    text: 'Insertions of short sequences are quite frequent, often the result of transposable elements: sequences of DNA able to move from one site to another. An insertion within a coding region usually abolishes the activity of the gene because it can alter the reading frame: a frameshift mutation.'},
  {t: T.deletion, nav: 'A deletion', title: 'So can<br>a deletion.', notes: MUT, hold: 1.1,
    text: 'Similarly, a deletion within a coding region is usually a frameshift mutation: every codon after it is read differently.'},
  {t: T.point, nav: 'True reversion', title: 'A point mutation<br>can revert.', notes: REV, hold: 1.1,
    text: 'The possibility of reversion distinguishes point mutations and insertions from deletions. A point mutation can revert by restoring the original sequence: a true reversion.'},
  {t: T.second, nav: 'Second-site reversion', title: 'Or a second mutation<br>can compensate.', notes: REV, hold: 1.1,
    text: 'A point mutation can also revert by gaining a compensatory mutation elsewhere in the gene: a second-site reversion.'},
  {t: T.back, nav: 'Insertion reverted', title: 'An insertion can<br>revert by deletion.', notes: REV, hold: 1.1,
    text: 'An insertion can revert by deletion of the inserted sequence. Insertions of transposable elements can subsequently result in deletion of part or all of the inserted material, and sometimes of the adjacent regions.'},
  {t: T.lost, nav: 'No reversion', title: 'A deletion<br>cannot revert.', notes: REV, hold: 1.1,
    text: 'A deletion of a sequence cannot revert in the absence of some mechanism to restore the lost sequence. Point mutations and insertions can revert, but deletions cannot.'},
];

// Letters are drawn once each (white, tinted by their material), on planes facing the viewer (−z) with −y up.
const glyphs = {};
function glyph(ch) {
  if (glyphs[ch]) return glyphs[ch];
  const c = document.createElement('canvas'); c.width = 100; c.height = 110;
  const g = c.getContext('2d'); g.fillStyle = '#fff'; g.font = '600 122px "DM Sans", system-ui, sans-serif'; g.textAlign = 'center'; g.textBaseline = 'alphabetic';
  g.fillText(ch, 50, 99);
  const tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 4;
  return glyphs[ch] = tex;
}
const letterGeometry = new THREE.PlaneGeometry(3.2, 3.52).rotateX(Math.PI);
const barGeometry = new THREE.CapsuleGeometry(.42, 3 * RISE - 1.3 - .84, 4, 10).rotateZ(Math.PI / 2);

// Each shot's camera move (s); a row fades out in the first 30 % of the move away from it and in over the last 30 % of
// the move to it, so no row is seen passing behind the page's text.
const BLEND = {deletion: 2.4, point: 2.8, back: 2.6, lost: 2.4, all: 3};
const leaving = (t, ts, b) => ramp(t, ts - .35 * b, ts - .05 * b), arriving = (t, ts, b) => ramp(t, ts + .35 * b, ts + .65 * b);
// The three rows' extent (top of the codon bars above the first, the status below the last) and the overview's lift.
const OVERVIEW = {top: ROW.P + BAR_Y - 1.5, bottom: ROW.D + STATUS_Y + 2, lift: 16};

const at = {};

runScene({
  pageTitle: 'Frameshifts and reversion · Genes are DNA', eyebrow: 'Frameshifts and reversion',
  links: [{href: 'index.html', text: 'All scenes'}],
  steps, duration: T.end, notesPage: 'notes.html', fov: 26, fog: .0002, loop: false,
  shots: [
    {t: 0, target: [0, ROW.I - 2, 0], dir: [0, -.07, -1], box: [86, 54]},
    {t: T.deletion, blend: BLEND.deletion, target: [0, ROW.D - 2, 0], dir: [0, -.07, -1], box: [86, 54]},
    {t: T.point, blend: BLEND.point, target: [0, ROW.P - 2, 0], dir: [0, -.07, -1], box: [86, 54]},
    {t: T.back, blend: BLEND.back, target: [0, ROW.I - 2, 0], dir: [0, -.07, -1], box: [86, 54]},
    {t: T.lost, blend: BLEND.lost, target: [0, ROW.D - 2, 0], dir: [0, -.07, -1], box: [86, 54]},
    // All three rows. Where the free part of the screen runs the full height beside the narration, they are framed a
    // little high, so the lowest stays clear of the darker band at the foot of the screen and all three read alike.
    {t: T.all, blend: BLEND.all, frame: () => {
      const text = document.querySelector('.narration')?.getBoundingClientRect(), beside = !!text && text.width < innerWidth * .66;
      const lift = beside ? OVERVIEW.lift : 0, y = (OVERVIEW.top + OVERVIEW.bottom) / 2 + lift;
      return {target: [0, y, 0], dir: [0, -.05, -1], box: [86, 2 * (y - OVERVIEW.top)]};
    }},
  ],
  async build({world, progress}) {
    const [set] = await Promise.all([loadSurfaceSet('assets/helix.json', 'assets/helix.bin', progress), document.fonts.load('600 122px "DM Sans"')]);
    const strand = n => set.meta.strands.find(s => s.name === n);
    const crystal = pairsFromStrands(strand('a'), strand('b')); frameFromPairs(crystal);
    const local = meanLocal(crystal.slice(1, -1));

    // One ideal helix for every row: base pair u (fractional while a piece slides) at x = X0 + u·RISE, turned u·TWIST
    // about the axis, so pieces meet in place, direction and twist. The coding strand (whose sequence is written,
    // 5′ → 3′ from left to right) is ivory, the template strand sky blue, as the course draws them.
    const q0 = new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().makeBasis(V(0, -1, 0), V(0, 0, -1), V(1, 0, 0)));
    const frame = (u, lift, depth) => ({origin: V(X0 + u * RISE, lift, depth), q: new THREE.Quaternion().setFromAxisAngle(V(1, 0, 0), u * TWIST).multiply(q0)});
    // A piece of DNA: its pairs, and two more at each end that its strands are smoothed through; each strand is drawn
    // from its first pair on to where the next piece's first pair is, so pieces meet end to end.
    const createPiece = (group, seq, tint = null) => {
      const n = seq.length, d = createDuplex({pairs: sequencePairs('AA' + seq + 'AA', local), template: STRANDS.coding, coding: STRANDS.template,
        widths: [STRANDS.radius.coding, STRANDS.radius.template], rung: [STRANDS.rung.coding, STRANDS.rung.template], samples: 3});
      group.add(d.group);
      const colour = [STRANDS.coding, STRANDS.template].map(c => tint ? mixHex(c, tint, .8) : c);
      d.segments(0, [[PAD, n + PAD, colour[0]]]); d.segments(1, [[PAD, n + PAD, colour[1]]]);
      const rungBase = [STRANDS.rung.coding, STRANDS.rung.template].map(c => new THREE.Color(tint ? mixHex(c, tint, .8) : c).multiplyScalar(.8));
      let key = '', shown = -1, tints = '';
      return {d, n, seq,
        place(u, lift = 0, depth = 0) { const k = `${u.toFixed(4)}|${lift.toFixed(3)}|${depth.toFixed(3)}`; if (k === key) return; key = k; d.pose(Array.from({length: n + 2 * PAD}, (_, j) => frame(u - PAD + j, lift, depth))); },
        opacity(v) { if (v === shown) return; shown = v; d.opacity(v); d.group.visible = v > .001; },
        // Pair i's bond towards a colour (its letter's), by weight.
        tint(list) {
          const k = list.map(([i, c, w]) => `${i}:${c}:${w.toFixed(2)}`).join(); if (k === tints) return; tints = k;
          const col = new THREE.Color();
          d.rungs.forEach((r, s) => { for (let i = 0; i < n; i++) r.setColorAt(i + PAD, rungBase[s]); for (const [i, c, w] of list) r.setColorAt(i + PAD, col.copy(rungBase[s]).lerp(new THREE.Color(c), w)); r.instanceColor.needsUpdate = true; });
        },
        view(pxPerA) { d.view(pxPerA); },
        backbone: (i, k = 0) => (k ? d.world.bBackbone : d.world.aBackbone)[i + PAD],
      };
    };

    // A row: its pieces, a pool of letters and a pool of codon bars, all in a group at the row's height.
    const createRow = (key, y, pieces) => {
      const group = new THREE.Group(); group.position.y = y; world.add(group);
      const made = pieces.map(p => ({...p, piece: createPiece(group, p.seq, p.tint)}));
      const letters = [], bars = [];
      const letterAt = k => letters[k] || (letters[k] = (() => {
        const m = new THREE.Mesh(letterGeometry, new THREE.MeshBasicMaterial({map: glyph('A'), transparent: true, depthWrite: false}));
        m.renderOrder = 5; m.frustumCulled = false; group.add(m); m.userData.ch = 'A'; return m;
      })());
      const barAt = k => bars[k] || (bars[k] = (() => { const m = new THREE.Mesh(barGeometry, baseMaterial(FRAME, {emissive: FRAME, emissiveIntensity: .3, roughness: .5})); group.add(m); return m; })());
      return {y, group, pieces: Object.fromEntries(made.map(p => [p.name, p.piece])),
        // Draws the letters ({ch, u, lift, colour, alpha}) and bars ({u, colour, alpha}); the row faded by `shown`.
        draw(list, barList, shown) {
          list.forEach((l, k) => {
            const m = letterAt(k); if (m.userData.ch !== l.ch) { m.material.map = glyph(l.ch); m.userData.ch = l.ch; }
            m.position.set(X0 + l.u * RISE, LETTER_Y + (l.lift || 0), l.depth || 0); m.material.color.set(l.colour).multiplyScalar(1.12);
            m.material.opacity = l.alpha * shown; m.visible = m.material.opacity > .004;
          });
          for (let k = list.length; k < letters.length; k++) letters[k].visible = false;
          barList.forEach((b, k) => {
            const m = barAt(k); m.position.set(X0 + b.u * RISE, BAR_Y, 0);
            m.material.color.set(b.colour); m.material.emissive.set(b.colour); fade(m.material, b.alpha * shown); m.visible = b.alpha * shown > .004;
          });
          for (let k = barList.length; k < bars.length; k++) bars[k].visible = false;
        },
        world: (u, dy = 0) => Object.assign(V(X0 + u * RISE, y + dy, 0), {row: key}),
      };
    };

    const rows = {
      P: createRow('P', ROW.P, [{name: 'all', seq: WT}]),
      I: createRow('I', ROW.I, [{name: 'left', seq: WT.slice(0, AT_INSERT)}, {name: 'insert', seq: INSERTED, tint: INSERT}, {name: 'right', seq: WT.slice(AT_INSERT)}]),
      D: createRow('D', ROW.D, [{name: 'left', seq: WT.slice(0, AT_DELETE)}, {name: 'lost', seq: WT.slice(AT_DELETE, AT_DELETE + SHIFT)}, {name: 'right', seq: WT.slice(AT_DELETE + SHIFT)}]),
    };

    // Each row's sequence at time t, letter by letter: its character, where it is (u), how far it has lifted, its
    // status (wild type, inserted, changed or reverted) and how much it shows. Changes of letter cross-fade.
    const between = ([a, b], t) => smooth(ramp(t, a, b));
    const insertion = t => ({open: between(E.insertOpen, t) * (1 - between(E.insertClose, t)), lift: 0,
      depth: AWAY * (1 - between(E.insertIn, t)) + AWAY * between(E.insertOut, t),
      shown: ramp(t, E.insertIn[0], E.insertIn[0] + 1) * (1 - ramp(t, E.insertOut[1] - 1, E.insertOut[1]))});
    const deletion = t => ({lift: 0, depth: AWAY * between(E.deleteOut, t), shown: 1 - ramp(t, E.deleteOut[1] - 1, E.deleteOut[1]),
      close: between(E.deleteClose, t), marked: ramp(t, E.mark, E.mark + .8)});
    // The point mutation row's changes: [time, base, from, to, status of the new letter].
    const CHANGES = [[E.mutate, AT_POINT, 'T', 'A', 'change'], [E.revert, AT_POINT, 'A', 'T', 'revert'], [E.mutateAgain, AT_POINT, 'T', 'A', 'change'], [E.second, AT_SECOND, 'G', 'C', 'revert']];
    const COLOUR = {wt: INK, ins: INSERT, change: CHANGE, revert: REVERT};
    const pointLetters = t => {
      const out = [...WT].map((ch, u) => ({ch, u, status: 'wt', alpha: 1}));
      for (const [te, i, from, to, status] of CHANGES) {
        if (t < te) continue;
        const w = ramp(t, te, te + .7);
        const old = out[i];
        out[i] = {ch: to, u: i, status, alpha: ramp(t, te + .25, te + .8)};
        if (w < 1) out.push({...old, alpha: old.alpha * (1 - w)});
      }
      return out;
    };
    // The sequence as read now (for the codons): a string and each letter's status.
    const read = (key, t) => {
      if (key === 'P') { const seq = [...WT], status = seq.map(() => 'wt'); for (const [te, i, , to, s] of CHANGES) if (t >= te + .3) { seq[i] = to; status[i] = s; } return {seq: seq.join(''), status}; }
      if (key === 'I') { const inserted = t >= E.insertIn[1] - .1 && t < E.insertClose[1] - .1; return inserted ? {seq: WT.slice(0, AT_INSERT) + INSERTED + WT.slice(AT_INSERT), status: [...WT.slice(0, AT_INSERT)].map(() => 'wt').concat([...INSERTED].map(() => 'ins'), [...WT.slice(AT_INSERT)].map(() => 'wt'))} : {seq: WT, status: [...WT].map(() => 'wt')}; }
      const gone = t >= E.deleteClose[1] - .1;
      return gone ? {seq: WT.slice(0, AT_DELETE) + WT.slice(AT_DELETE + SHIFT), status: [...WT].slice(SHIFT).map(() => 'wt')} : {seq: WT, status: [...WT].map(() => 'wt')};
    };
    // Codon k's colour: reverted (a letter reverted in it), changed (it reads differently from the wild type), or not.
    const codons = ({seq, status}) => Array.from({length: Math.floor(seq.length / 3)}, (_, k) => {
      const text = seq.slice(3 * k, 3 * k + 3), s = status.slice(3 * k, 3 * k + 3);
      return s.includes('revert') ? REVERT : text !== WT.slice(3 * k, 3 * k + 3) ? CHANGE : FRAME;
    });
    const EVENTS = {P: CHANGES.map(c => c[0] + .3), I: [E.insertIn[1] - .1, E.insertClose[1] - .1], D: [E.deleteClose[1] - .1]};
    // Bars fade to their new colours (and in or out) over a moment after each change.
    const barsOf = (key, t) => {
      const last = EVENTS[key].filter(te => te <= t).pop(), now = codons(read(key, t));
      if (last === undefined) return now.map((c, k) => ({u: 3 * k + 1, colour: c, alpha: 1}));
      const before = codons(read(key, last - .01)), w = ramp(t, last, last + .8), n = Math.max(now.length, before.length);
      return Array.from({length: n}, (_, k) => ({u: 3 * k + 1, colour: mixHex(before[k] ?? now[k], now[k] ?? before[k], w), alpha: k < now.length && k < before.length ? 1 : k < now.length ? w : 1 - w}));
    };

    // Which rows show: each in its steps and all three at the end.
    const out = (t, k) => leaving(t, T[k], BLEND[k]), into = (t, k) => arriving(t, T[k], BLEND[k]);
    const visible = {
      I: t => ramp(t, .2, 1.2) * (1 - out(t, 'deletion')) + into(t, 'back') * (1 - out(t, 'lost')) + into(t, 'all'),
      D: t => into(t, 'deletion') * (1 - out(t, 'point')) + into(t, 'lost'),
      P: t => into(t, 'point') * (1 - out(t, 'back')) + into(t, 'all'),
    };
    const exact = v => v > .999 ? 1 : v < .001 ? 0 : v;

    at.rows = {}; at.anchor = {};
    return {
      rows, at, read: (key, t) => read(key, t), visible: (key, t) => visible[key](t),  // for tests (?debug=1)
      update(t, {pxPerA = 1} = {}) {
        for (const [key, row] of Object.entries(rows)) {
          const shown = exact(Math.min(1, visible[key](t)));
          const letters = [];
          if (key === 'I') {
            const s = insertion(t), {left, insert, right} = row.pieces;
            left.place(0); right.place(AT_INSERT + SHIFT * s.open); insert.place(AT_INSERT, s.lift, s.depth);
            left.opacity(shown); right.opacity(shown); insert.opacity(exact(shown * s.shown));
            [...WT.slice(0, AT_INSERT)].forEach((ch, i) => letters.push({ch, u: i, colour: INK, alpha: 1}));
            [...INSERTED].forEach((ch, i) => letters.push({ch, u: AT_INSERT + i, lift: s.lift, depth: s.depth, colour: INSERT, alpha: s.shown}));
            [...WT.slice(AT_INSERT)].forEach((ch, i) => letters.push({ch, u: AT_INSERT + SHIFT * s.open + i, colour: INK, alpha: 1}));
            at.rows.I = {open: s.open, lift: s.lift, seq: read('I', t).seq};
          } else if (key === 'D') {
            const s = deletion(t), {left, lost, right} = row.pieces;
            left.place(0); lost.place(AT_DELETE, s.lift, s.depth); right.place(AT_DELETE + SHIFT - SHIFT * s.close);
            left.opacity(shown); right.opacity(shown); lost.opacity(exact(shown * s.shown));
            [...WT.slice(0, AT_DELETE)].forEach((ch, i) => letters.push({ch, u: i, colour: INK, alpha: 1}));
            [...WT.slice(AT_DELETE, AT_DELETE + SHIFT)].forEach((ch, i) => letters.push({ch, u: AT_DELETE + i, lift: s.lift, depth: s.depth, colour: mixHex(INK, CHANGE, s.marked), alpha: s.shown}));
            [...WT.slice(AT_DELETE + SHIFT)].forEach((ch, i) => letters.push({ch, u: AT_DELETE + SHIFT - SHIFT * s.close + i, colour: INK, alpha: 1}));
            lost.tint(Array.from({length: SHIFT}, (_, i) => [i, CHANGE, s.marked]));
            at.rows.D = {close: s.close, lift: s.lift, seq: read('D', t).seq};
          } else {
            const {all} = row.pieces; all.place(0); all.opacity(shown);
            const ls = pointLetters(t);
            for (const l of ls) letters.push({ch: l.ch, u: l.u, colour: COLOUR[l.status], alpha: l.alpha});
            // Each changed pair's bond in its letter's colour.
            all.tint([AT_POINT, AT_SECOND].map(i => { const l = ls.filter(x => x.u === i).sort((a, b) => b.alpha - a.alpha)[0]; return [i, COLOUR[l.status], l.status === 'wt' ? 0 : l.alpha]; }));
            at.rows.P = {seq: read('P', t).seq};
          }
          for (const p of Object.values(row.pieces)) p.view(pxPerA);
          row.draw(letters, barsOf(key, t), shown);
          at.rows[key].shown = shown;
        }
      },
      annotate(t, draw) {
        // Only a row wholly in view is named (not one fading as the camera moves on).
        const whole = p => !p.row || visible[p.row](t) > .999;
        const label = (p, ...rest) => { if (whole(p)) draw.label(p, ...rest); }, tag = (p, ...rest) => { if (whole(p)) draw.tag(p, ...rest); };
        const I = rows.I, D = rows.D, P = rows.P, col = c => ({color: hex(c)});
        const bar = (row, k) => row.world(3 * k + 1, BAR_Y - .6), letter = (row, u) => row.world(u, LETTER_Y - 1.9), under = (row, u) => row.world(u, 10.5);
        const status = (row, text, c) => tag(row.world(-.6, STATUS_Y), text, col(c));
        if (t < T.deletion) {
          if (t > 1.8 && t < E.insertOpen[0] + 1.6) label(bar(I, 0), 'Codons', 'Read three bases at a time, from the start', col(FRAME));
          if (t > E.insertIn[1] + .4) {
            label(letter(I, AT_INSERT + 2), 'Insertion', 'Often a transposable element', col(INSERT));
            label(bar(I, 5), 'Frameshift', 'Every codon after it is read differently', {...col(CHANGE), side: 'right'});
          }
        } else if (t < T.point) {
          if (t > E.mark + .6 && t < E.deleteOut[0] + .6) label(letter(D, AT_DELETE + 2), 'Deletion', 'Five base pairs lost', col(CHANGE));
          if (t > E.deleteClose[1] + .4) {
            label(under(D, AT_DELETE - .5), 'Deletion', 'Five base pairs lost', {...col(CHANGE), below: true});
            label(bar(D, 3), 'Frameshift', 'Every codon after it is read differently', {...col(CHANGE), side: 'right'});
          }
        } else if (t < T.second) {
          if (t > E.mutate + .8 && t < E.revert) { label(letter(P, AT_POINT), 'Point mutation', 'One base pair changed', col(CHANGE)); status(P, 'Mutant', CHANGE); }
          if (t > E.revert + .8) { label(letter(P, AT_POINT), 'True reversion', 'The original sequence restored', col(REVERT)); status(P, 'Revertant', REVERT); }
        } else if (t < T.back) {
          // The first mutation named below the DNA (to the right, clear of the row's status), the second above it.
          if (t > E.mutateAgain + .8) label(under(P, AT_POINT), 'Point mutation', 'Still there', {...col(CHANGE), below: true, side: 'right'});
          if (t < E.second + .8) { if (t > E.mutateAgain + .8) status(P, 'Mutant', CHANGE); }
          else { label(letter(P, AT_SECOND), 'Second-site reversion', 'A compensating mutation elsewhere in the gene', {...col(REVERT), priority: 2, side: 'left'}); status(P, 'Revertant', REVERT); }
        } else if (t < T.lost) {
          if (t > T.back + 1.8 && t < E.insertOut[0] + .6) { label(letter(I, AT_INSERT + 2), 'Insertion', 'Often a transposable element', col(INSERT)); status(I, 'Frameshift mutation', CHANGE); }
          if (t > E.insertClose[1] + .4) { label(letter(I, AT_INSERT), 'Reversion by deletion', 'The inserted sequence removed', col(REVERT)); status(I, 'Revertant', REVERT); }
        } else if (t < T.all) {
          if (t > T.lost + 1.6) { label(letter(D, AT_DELETE), 'No reversion possible', 'The lost sequence cannot be restored', col(CHANGE)); status(D, 'Frameshift mutation', CHANGE); }
        } else if (t > T.all + 2.6) {
          status(P, 'Point mutation · can revert', REVERT); status(I, 'Insertion · can revert', REVERT); status(D, 'Deletion · cannot revert', CHANGE);
        }
      },
    };
  },
});
