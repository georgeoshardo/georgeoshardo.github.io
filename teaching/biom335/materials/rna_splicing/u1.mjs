// Experiment: U1 snRNP and the 5′ splice site, with the viewer asked to predict two results (the shared player's
// `predict` steps). The whole human U1 snRNP (3CW1: U1 snRNA as a strand, U1-70K as a coarse envelope from its Cα
// atoms) binds a pre-mRNA's 5′ splice site; its U1-C and ring of Sm proteins are those of the minimal U1 snRNP 4PJO
// (every atom), superposed on 3CW1's by their Sm proteins, U1-70K and U1-C. 4PJO's U1 snRNA is paired with a 5′
// splice-site RNA: the duplex of U1's 5′ end with the splice site is ideal A-form RNA (rna.mjs pairing) fitted onto
// that crystal duplex, and U1 snRNA's own 5′ end is drawn along it (native sequence; 4PJO's U1 starts GG), joining
// 3CW1's trace at nucleotide 12. Then, base by base and with each base's letter: U1 nucleotides 2–8 with the
// consensus GUAAGUA; and the adenovirus 12S experiment, as the figure has it: the wild-type site GUGAGG pairs and is
// spliced; the mutant GUGAAU loses its pair at position 5 (predict: is it spliced?); a compensating C→U mutation in U1
// snRNA restores it (predict: is splicing restored?). The consensus pre-mRNA fades in on the site (U1-C and the Sm
// ring hug the duplex, leaving no way in from outside); the 12S pre-mRNA comes up from just below, clear of U1's 5′
// end. Then the pairs bond one by one; mismatched bases stay unbonded.
// Nothing passes behind the page's text: shots are boxes fitted round what each step shows (boxAround), and before
// the camera closes in on the duplex everything but U1's 5′ end and the short pre-mRNA fades fully out.
import * as THREE from 'three';
import {runScene} from '../shared/scene_player.mjs';
import {loadSurfaceSet, surfaceGeometry, proteinMaterial, baseMaterial, fade} from '../shared/molecules.mjs';
import {SPLICING, A_FORM, createStrand, pairing, antiparallel, aFormPoint, onwards, stubColour} from '../shared/rna.mjs';
import {BASES} from '../shared/strands.mjs';
import {boxAround} from '../shared/camera.mjs';
import {ramp, smooth, clamp, mix} from '../shared/ease.mjs';

const V = (...a) => new THREE.Vector3(...a);
const hex = c => '#' + new THREE.Color(c).getHexString();
const lighter = (c, k) => new THREE.Color(c).lerp(new THREE.Color(0xffffff), k).getHex();
// Colours: U1 snRNA and U1-70K in U1's pink, U1-C paler, the Sm ring sand; exons orange, the intron grey-violet;
// a mutated base ringed in coral, the compensating base in green; the cap the yellow of G.
const C70K = SPLICING.U1, C1C = lighter(SPLICING.U1, .38), SM = SPLICING.Sm;
const MUTANT = 0xff7a66, RESCUE = 0x6fe0a4, CAP = SPLICING.cap, INK = 0xd8e4e4;

// Times (s): each step starts at its t.
const T = {binds: 0, domains: 15, wild: 35, mutant: 50, none: 61, supp: 74, restored: 85, end: 99};
const CLOSE = T.domains + 10;  // the camera closes in on the duplex (its move begins about a second before)
const FAR_OUT = [CLOSE - 2.1, CLOSE - 1.15];  // everything but the duplex region fades out before that move
const NOTES = 'initial-splice-site-recognition-and-the-e-complex';
const steps = [
  {t: T.binds, nav: 'U1 binds first', title: 'U1 binds the 5′<br>splice site first.', notes: NOTES, hold: 1.1,
    text: 'The very first step in splicing is the binding of the U1 snRNP to the 5′ splice site, at the start of the intron. U1 snRNA binds it through a direct RNA–RNA base-pairing interaction.'},
  {t: T.domains, nav: 'A single-stranded 5′ end', title: 'Base-paired domains,<br>a single-stranded end.', notes: NOTES, hold: 1.1,
    text: 'U1 snRNA has a base-paired structure that creates several domains. Its 5′ end remains single stranded and is complementary to the consensus sequence at the 5′ splice site: U1 nucleotides 2–8 pair with the intron’s GUAAGUA.'},
  {t: T.wild, nav: 'The 12S pre-mRNA', title: 'Adenovirus 12S<br>pre-mRNA.', notes: NOTES, hold: 1.1,
    text: 'The necessity of this base pairing has been confirmed experimentally, with the 12S pre-mRNA of adenovirus. Its 5′ splice site, GUGAGG, pairs with wild-type U1 snRNA, and the pre-mRNA is spliced normally.'},
  {t: T.mutant, nav: 'A mutant splice site', title: 'A mutant<br>5′ splice site.', notes: NOTES,
    text: 'In a mutant 12S pre-mRNA the last two Gs of the splice site are changed: GUGAGG becomes GUGAAU. The mutant pre-mRNA meets wild-type U1 snRNA.',
    predict: {id: 'mutant', question: 'Is the mutant pre-mRNA spliced?', choices: [{text: 'Yes, normally', correct: false}, {text: 'No', correct: true}]}},
  {t: T.none, nav: 'No splicing', title: 'Pairing disrupted,<br>no splicing.', notes: NOTES, hold: 1.1,
    text: 'The mutant site cannot pair with U1 snRNA at position 5, where an A now faces a C, and the pre-mRNA is not spliced. Mutations that disrupt the pairing between the 5′ splice site and U1 snRNA abolish splicing.'},
  {t: T.supp, nav: 'A mutation in U1', title: 'A compensating<br>mutation in U1.', notes: NOTES,
    text: 'A second, “suppressor” mutation is made in U1 snRNA: the C that faced position 5 becomes a U, which can pair with the mutant site’s A.',
    predict: {id: 'suppressor', question: 'With the mutant U1 snRNA, is the mutant pre-mRNA spliced?', choices: [{text: 'Yes', correct: true}, {text: 'No', correct: false}]}},
  {t: T.restored, nav: 'Splicing restored', title: 'Pairing restored,<br>splicing restored.', notes: NOTES, hold: 1.1,
    text: 'The suppressor mutation in U1 snRNA restores the complementarity, and splicing is rescued: base pairing between U1 snRNA and the 5′ splice site is necessary for splicing.'},
];

// The pre-mRNAs: a short stretch of each, exon (orange) then intron (grey-violet). The consensus site (steps 1–2):
// four exon nucleotides (any more would run into the Sm ring in the wide shots), the intron’s GUAAGUA (+1 to +7) and
// twelve more. The 12S site: four exon nucleotides, +1 to +6 and five more. Their sequences are known only at the
// splice site (N elsewhere: no letter).
const E0 = 4, E = 4;
const SITE = {consensus: 'GUAAGUA', wild: 'GUGAGG', mutant: 'GUGAAU'};
const PRE0 = 'N'.repeat(E0) + SITE.consensus + 'N'.repeat(12), PRE1 = 'N'.repeat(E) + SITE.wild + 'N'.repeat(5);
const NEAR0 = [0, E0 + 11];  // the consensus pre-mRNA's nucleotides kept close up: its exon, the site and four more
// U1 snRNA nucleotides 2–8 (5′→3′ UACUUAC; read 3′→5′ against the site, CAUUCAU) pair with +7 … +1; in the 12S
// experiment nucleotides 3–8 with +6 … +1. The suppressor changes nucleotide 4 (C, facing +5) to U.
const U1_LETTERS = {2: 'U', 3: 'A', 4: 'C', 5: 'U', 6: 'U', 7: 'A', 8: 'C'};
// Which 12S positions pair (+1 … +6) in each state: G·U at +3 pairs; wild type +6 G faces A (no pair); the mutant's
// +5 A faces C (no pair) and its +6 U pairs with A; with the suppressor, +5 A pairs with U.
const PAIRED = {wild: [1, 1, 1, 1, 1, 0], mutant: [1, 1, 1, 1, 0, 1], restored: [1, 1, 1, 1, 1, 1]};
// The stems of 3CW1's U1 snRNA (residue numbers, paired antiparallel: [from, to, partner of from]), found from its
// phosphate trace (complementary nucleotides 14–21 Å apart in runs of three or more): helix H, stem-loops 1, 2 (as
// crystallised, shortened) and 3, and stem-loop 4 at the 3′ end; the Sm site (125–133) between them single-stranded.
const STEMS = [[12, 15, 122], [17, 21, 47], [23, 27, 42], [48, 54, 91], [92, 94, 117], [95, 100, 113], [137, 143, 164], [146, 148, 155]];

const at = {};

runScene({
  pageTitle: 'U1 and the 5′ splice site · RNA splicing and processing', eyebrow: 'U1 and the 5′ splice site',
  links: [{href: 'index.html', text: 'All scenes'}],
  steps, duration: T.end, notesPage: 'notes.html', fov: 26, fog: .00012, loop: false,
  shots: [
    {t: T.binds, frame: () => at.views.wide},
    {t: CLOSE, blend: 3, frame: () => at.views.close},
  ],
  async build({world, progress}) {
    const [set] = await Promise.all([loadSurfaceSet('assets/u1.json', 'assets/u1.bin', progress), document.fonts.load('600 122px "DM Sans"')]);
    const strandOf = (name, structure) => set.meta.strands.find(s => s.name === name && (!structure || s.structure === structure));
    const s3 = strandOf('U1 snRNA', 'u1'), s4 = strandOf('U1 5′ end', 'min'), sx = strandOf('5′ splice site', 'min');
    const nt = (s, n) => V(...s.backbone[s.numbers.indexOf(n)]);

    // ---------- The duplex: ideal A-form fitted onto 4PJO's U1 5′ end and splice-site RNA ----------
    // Pair k: U1 nucleotide k + 2 (strand a, 5′→3′ up the axis) with the site's +(7 − k) (strand b).
    const fitted = pairing(antiparallel(0, 6, 7)).fit([2, 3, 4, 5, 6, 7, 8].map(n => nt(s4, n)), [3, 4, 5, 6, 7, 8, 9].map(n => nt(sx, n)));
    const M = fitted.matrix, A = (k, out = V()) => aFormPoint(k, 'a', 'backbone', M, out), B = (k, out = V()) => aFormPoint(k, 'b', 'backbone', M, out);
    at.fit = Math.sqrt([2, 3, 4, 5, 6, 7, 8].reduce((s, n, k) => s + A(k).distanceToSquared(nt(s4, n)) + B(k).distanceToSquared(nt(sx, 9 - k)), 0) / 14);

    // ---------- The world: the duplex at the origin, its axis across the screen ----------
    // Turned so the pre-mRNA runs 5′→3′ from left to right (the axis, U1's 5′→3′ way, towards −x) and the rest of
    // the snRNP lies above and behind the duplex (world −y is up on screen, the camera on −z).
    const holder = new THREE.Group(); world.add(holder);
    const axis = fitted.axis(), mid = fitted.centre();
    const records = set.meta.meshes, geoms = Object.fromEntries(records.map(r => [r.name, surfaceGeometry(r, set.buffer)]));
    // Turned so that the middle pair (pair 3) is seen broadside, its bond from U1 to the site running down the screen
    // (+y): both ends of the duplex are then side on, and the strands can leave them to either side.
    const across = B(3).sub(A(3)); across.addScaledVector(axis, -across.dot(axis)).normalize();
    const from = new THREE.Matrix4().makeBasis(axis, across, axis.clone().cross(across)), X = V(-1, 0, 0), Y = V(0, 1, 0);
    const to = new THREE.Matrix4().makeBasis(X, Y, X.clone().cross(Y));
    holder.quaternion.setFromRotationMatrix(to.multiply(from.transpose()));
    holder.position.copy(mid).applyQuaternion(holder.quaternion).negate();
    holder.updateMatrixWorld(true);
    const local = w => w.clone().applyQuaternion(holder.quaternion.clone().invert());  // a world direction in the holder
    const W = p => holder.localToWorld(p.clone());

    // ---------- Proteins ----------
    const meshes = {};
    for (const [name, colour] of [['U1-70K', C70K], ['U1-C', C1C], ['Sm ring', SM]]) {
      const m = new THREE.Mesh(geoms[name], proteinMaterial(colour)); holder.add(m); meshes[name] = m;
    }
    const sample = m => { const p = m.geometry.attributes.position, out = []; for (let k = 0; k < p.count; k += 6) out.push(V().fromBufferAttribute(p, k)); return out; };
    const samples = Object.fromEntries(Object.entries(meshes).map(([k, m]) => [k, sample(m)]));
    const centreOf = name => W(samples[name].reduce((s, p) => s.add(p), V()).divideScalar(samples[name].length));

    // ---------- U1 snRNA ----------
    // 3CW1's trace (its phosphates), with nucleotides 1–11 along the fitted duplex (U1 nucleotide n at A-form pair
    // n − 2) and nucleotide 12 midway, where the two meet within 2 Å.
    const N1 = s3.numbers.length, idx = n => s3.numbers.indexOf(n);
    const u1Points = s3.numbers.map((n, i) => n <= 11 ? A(n - 2) : n === 12 ? A(10).lerp(nt(s3, 12), .5) : V(...s3.backbone[i]));
    const u1 = createStrand(holder, N1, {colour: SPLICING.U1, side: local(V(0, 0, -1))});
    u1Points.forEach((p, i) => u1.points[i].copy(p));
    for (const [a, b, c] of STEMS) for (let n = a; n <= b; n++) { const i = idx(n), j = idx(c - (n - a)); u1.pair(i, u1.points[j], 1); u1.pair(j, u1.points[i], 1); }
    const u1Letters = n => s3.numbers.map(m => m >= 2 && m <= 8 ? (m === 4 && n ? 'U' : U1_LETTERS[m]) : 'N').join('');
    // The trimethylated cap, one step beyond nucleotide 1 along the strand, joined to it.
    const capAt = A(-2).lerp(A(-1), .2);
    const cap = new THREE.Mesh(new THREE.SphereGeometry(2.1, 24, 16), baseMaterial(CAP, {emissive: CAP, emissiveIntensity: .18})); cap.position.copy(capAt); holder.add(cap);
    u1.link(0, capAt, {colour: CAP});
    const NEAR = 11;  // nucleotides 1–11 stay drawn close up

    // ---------- The pre-mRNAs ----------
    // Each site nucleotide +j at pair 7 − j (strand b); the exon leaves +1 and the intron the last paired nucleotide,
    // each carried on from the helix and turning away from the snRNP, down and to its side.
    const layout = (n, E, last) => {
      const pts = Array.from({length: n}, () => V());
      for (let j = 1; j <= last; j++) B(7 - j, pts[E + j - 1]);
      const away = dir => local(dir.normalize());
      onwards(pts[E], B(7).sub(B(6)), away(V(-1, .25, -.15)), E, {turn: .5}).reverse().forEach((p, i) => pts[i].copy(p));
      onwards(pts[E + last - 1], B(7 - last - 1).sub(B(7 - last)), away(V(1, .25, -.15)), n - E - last, {turn: .5}).forEach((p, i) => pts[E + last + i].copy(p));
      return pts;
    };
    const pre0 = createStrand(holder, PRE0.length, {side: local(V(0, 0, -1))}).stretches([[0, E0, SPLICING.exon]], SPLICING.intron);
    const pre1 = createStrand(holder, PRE1.length, {side: local(V(0, 0, -1))}).stretches([[0, E, SPLICING.exon]], SPLICING.intron);
    const home0 = layout(PRE0.length, E0, 7), home1 = layout(PRE1.length, E, 6);
    // Close up, a pre-mRNA backs off only a little, down and a little towards the camera (so that, coming back, it
    // clears U1's 5′ end), its letters going with it.
    const DROP = 15, NEAR_OFF = local(V(0, DROP, -3));
    // Bonds: the consensus site's seven pairs (U1 2–8 with +7 … +1), the 12S site's six (U1 3–8 with +6 … +1, one pair
    // along the same helix).
    const pair0 = pairing(antiparallel(1, E0 + 6, 7), M);
    const shift = new THREE.Matrix4().makeRotationZ(A_FORM.twist).setPosition(0, 0, A_FORM.rise);
    const pair1 = pairing(antiparallel(2, E + 5, 6), M.clone().multiply(shift));

    // ---------- Letters ----------
    // Each base's letter in two rows, as the figure writes them: U1's above the duplex, the pre-mRNA's below, each under
    // its pair (pair k's middle along the axis); letters face the camera. A ring marks a mutated base.
    const glyphs = {};
    const glyph = ch => {
      if (glyphs[ch]) return glyphs[ch];
      const c = document.createElement('canvas'); c.width = c.height = 128; const g = c.getContext('2d');
      if (ch === 'ring') { g.strokeStyle = '#fff'; g.lineWidth = 7; g.beginPath(); g.arc(64, 64, 56, 0, 2 * Math.PI); g.stroke(); }
      else { g.fillStyle = '#fff'; g.font = '600 104px "DM Sans", system-ui, sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(ch, 64, 70); }
      const tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 4;
      return glyphs[ch] = tex;
    };
    const plane = new THREE.PlaneGeometry(1, 1).rotateX(Math.PI);  // faces −z, its top towards −y
    const letterGroup = new THREE.Group(); world.add(letterGroup);
    const makeGlyph = (size, order) => {
      const m = new THREE.Mesh(plane, new THREE.MeshBasicMaterial({map: glyph('A'), transparent: true, depthWrite: false, opacity: 0}));
      m.scale.setScalar(size); m.renderOrder = order; m.userData.ch = 'A'; m.visible = false; letterGroup.add(m); return m;
    };
    const ROW = 16, LETTER = 4.6;
    const pairX = k => W(A(k).add(B(k)).multiplyScalar(.5)).x;
    // A letter slot: two glyphs to cross-fade a change, and a ring.
    const slot = (k, row) => ({k, row, a: makeGlyph(LETTER, 6), b: makeGlyph(LETTER, 6), ring: makeGlyph(LETTER * 1.1, 5), pos: V(pairX(k), row * ROW, 0)});
    const u1Slots = [2, 3, 4, 5, 6, 7, 8].map(n => slot(n - 2, -1)), preSlots = [1, 2, 3, 4, 5, 6, 7].map(j => slot(7 - j, 1));
    const setGlyph = (m, ch, colour, alpha, pos) => {
      if (m.userData.ch !== ch) { m.material.map = glyph(ch); m.userData.ch = ch; m.material.needsUpdate = true; }
      m.material.color.set(colour).multiplyScalar(1.1); m.position.copy(pos);
      const a = alpha < .004 ? 0 : alpha > .996 ? 1 : alpha; m.material.opacity = a; m.visible = a > 0;
    };
    // Draws a slot: letter `from` changing to `to` by w, shown by alpha, ringed by ring (0–1) in ringColour.
    const drawSlot = (s, from, to, w, alpha, ring = 0, ringColour = MUTANT, drop = 0) => {
      const p = s.pos.clone().add(V(0, drop, 0));
      setGlyph(s.a, from || 'A', BASES[from] ?? INK, alpha * (from ? 1 - w : 0), p);
      setGlyph(s.b, to || 'A', BASES[to] ?? INK, alpha * (to ? w : 0), p);
      setGlyph(s.ring, 'ring', ringColour, alpha * ring, p.clone().add(V(0, 0, .3)));
    };

    // ---------- Views ----------
    world.updateMatrixWorld(true);
    // The wide shot looks at the snRNP from the front, a little from the right and above, where the duplex with the
    // pre-mRNA is clear of the proteins; the close-up looks square onto the duplex from the same side.
    const DIR_WIDE = [.42, -.2, -1], DIR_CLOSE = [-.04, -.1, -1];
    at.dirWide = DIR_WIDE;
    const wide = [...Object.values(samples).flat().filter((p, k) => k % 3 === 0).map(W), ...u1Points.map(W), ...home0.map(W)];
    const nearPts = [...u1Points.slice(0, NEAR).map(W), ...home1.flatMap(p => [W(p), W(p.clone().add(NEAR_OFF))]), ...home0.slice(...NEAR0).map(W), W(capAt),
      ...[...u1Slots, ...preSlots].flatMap(s => [s.pos.clone().add(V(0, -LETTER, 0)), s.pos.clone().add(V(0, LETTER, 0))]), V(0, ROW + DROP + 6, 0)];
    at.views = {
      wide: {...boxAround(wide, DIR_WIDE, {margin: 10, above: 8, fov: 26}), fill: .94},
      close: {...boxAround(nearPts, DIR_CLOSE, {margin: 2, above: 3, fov: 26}), fill: .96},
    };
    at.moves = [[CLOSE - 3 * .35 - .05, CLOSE + 3 * .65 + .05]];

    // ---------- Timeline ----------
    // The consensus pre-mRNA (steps 1–2): its opacity (it fades in on the site), its bonds, and how far it has backed
    // off as it leaves (1 docked … 0 away). The 12S pre-mRNA (steps 3–7): docked three times (wild type, mutant, mutant
    // with mutant U1), its site's letters changing and which positions pair; U1's nucleotide 4 changing C → U.
    const DOCKINGS = [[T.wild + 3.4, T.wild + 6.2, T.mutant + .3], [T.none + .4, T.none + 2.8, T.supp + .3], [T.restored + .4, T.restored + 2.8, 1e6]];
    const state = t => {
      const s = {pre: t < T.wild + 3 ? 0 : 1};
      s.show0 = ramp(t, 1.2, 3.4) * (1 - ramp(t, T.wild + 1.6, T.wild + 3));
      s.dock0 = 1 - smooth(ramp(t, T.wild + 1, T.wild + 3));
      s.bonds0 = ramp(t, 6.6, 9.8) * (1 - ramp(t, T.wild + .2, T.wild + 1));
      s.show1 = ramp(t, T.wild + 2.8, T.wild + 3.8);
      s.dock1 = 0; s.bonds1 = 0;
      for (const [a, b, l] of DOCKINGS) {
        if (t < a) continue;
        s.dock1 = smooth(ramp(t, a, a + 2.4)) * (1 - smooth(ramp(t, l + .9, l + 2.7)));
        s.bonds1 = ramp(t, b, b + 2.6) * (1 - ramp(t, l, l + .9));
      }
      s.mutate = ramp(t, T.mutant + 3.6, T.mutant + 5);
      s.paired = t < T.none ? PAIRED.wild : t < T.restored ? PAIRED.mutant : PAIRED.restored;
      s.u1Mutant = ramp(t, T.supp + 3.6, T.supp + 5);
      return s;
    };
    const far = t => 1 - ramp(t, FAR_OUT[0], FAR_OUT[1]);                                   // U1's body: wide shots only
    const proteins = t => ramp(t, .2, 1.4) * (1 - ramp(t, T.domains + .4, T.domains + 1.8));
    const lettersShown = t => ramp(t, CLOSE + 1.2, CLOSE + 2.4);
    const work0 = home0.map(p => p.clone()), work1 = home1.map(p => p.clone());
    const u1Seq = [u1Letters(false), u1Letters(true)];
    // Helix H pairs nucleotides 12–15 with 119–122, which are not drawn close up: those bonds go with the far part.
    const helixH = [12, 13, 14, 15].map(n => [idx(n), idx(134 - n)]);
    // Bond weights forming one pair after another from +1 outward (j: the site position, 1–7).
    const zipFrom1 = (w, j, n) => clamp((w * (n + 2) - (j - 1)) / 2.2);
    // A base whose letter changes (a mutation) takes its new colour over the letters' cross-fade, as its letter does,
    // not at once: its stub's colour from `from` to `to` by w (shown as letters by lw), after the strand's letters().
    const cA = new THREE.Color(), cB = new THREE.Color(), cS = new THREE.Color();
    const stubLetter = (strand, i, from, to, w, lw) => {
      stubColour(strand.colourAt(i), cS).lerp(cA.setHex(BASES[from]).lerp(cB.setHex(BASES[to]), w), lw);
      strand.stubs.setColorAt(i, cS); strand.stubs.instanceColor.needsUpdate = true;
    };

    // For tests (?debug=1): what is paired now, and world points of everything drawn.
    at.shown = () => {
      const out = [];
      for (const [k, m] of Object.entries(meshes)) if (m.visible && m.material.opacity > 0) out.push(...samples[k].filter((p, i) => i % 3 === 0).map(p => W(p).toArray()));
      for (const s of [u1, pre0, pre1]) out.push(...s.extent());
      if (cap.visible) out.push(W(capAt).toArray());
      for (const m of letterGroup.children) if (m.visible) for (const [dx, dy] of [[-.5, -.5], [.5, .5]]) out.push(m.position.clone().add(V(dx * m.scale.x, dy * m.scale.y, 0)).toArray());
      return out;
    };

    // Each strand’s shortest and longest step (Å) where it is drawn: the drawn pre-mRNAs and U1’s 5′ end (nucleotides
    // 1–11; beyond, 3CW1’s phosphate trace as deposited) keep A-form spacing (6.1 Å) through the duplex and its arms.
    at.spacing = () => Object.fromEntries([['pre0', pre0, 0, PRE0.length], ['pre1', pre1, 0, PRE1.length], ['u1', u1, 0, 11]].map(([k, st, a, b]) => {
      const d = []; for (let i = a + 1; i < b; i++) if (st.drawn(i) && st.drawn(i - 1)) d.push(st.points[i].distanceTo(st.points[i - 1]));
      return [k, d.length ? [Math.min(...d), Math.max(...d)] : null];
    }));

    return {
      u1, pre0, pre1, meshes, at,
      update(t, {pxPerA = 1} = {}) {
        const s = state(t); at.state = s;
        // Proteins fade out in step 2, U1's body before the camera closes in.
        const pv = proteins(t);
        for (const m of Object.values(meshes)) { fade(m.material, pv); m.visible = pv > 0; }
        const fv = far(t), lv = lettersShown(t);
        // (The near piece last: where two pieces share a nucleotide, its base is drawn as the last piece's, so the bases
        // kept close up stay whole while the rest fades.)
        u1.pieces(fv >= 1 ? null : fv > 0 ? [{ranges: [[NEAR, N1]], opacity: fv}, [0, NEAR + 1]] : [[0, NEAR + 1]]);
        for (const [i, j] of helixH) { u1.pair(i, u1.points[j], fv); u1.pair(j, u1.points[i], fv); }
        u1.letters(s.u1Mutant > .5 ? u1Seq[1] : u1Seq[0], lv); stubLetter(u1, idx(4), 'C', 'U', s.u1Mutant, lv);

        // The consensus pre-mRNA: fades in on the site, its bonds form from +1 outward; it leaves at the start of step 3.
        home0.forEach((p, i) => work0[i].copy(p).addScaledVector(NEAR_OFF, 1 - s.dock0));
        pre0.pieces(fv >= 1 ? null : fv > 0 ? [{ranges: [[NEAR0[1] - 1, PRE0.length]], opacity: fv}, NEAR0] : [NEAR0]);
        pre0.pose(work0);
        // The 12S pre-mRNA, docking three times.
        home1.forEach((p, i) => work1[i].copy(p).addScaledVector(NEAR_OFF, 1 - s.dock1));
        pre1.pose(work1);
        // Bonds: U1 nucleotides 2–8 with the consensus site, then 3–8 with the 12S site where its bases pair.
        pair0.pairs.forEach(([i, j], k) => { const w = s.pre === 0 ? zipFrom1(s.bonds0, 7 - k, 7) : 0; u1.pair(i, w > 0 ? pre0.points[j] : null, w); pre0.pair(j, u1.points[i], w); });
        pair1.pairs.forEach(([i, j], k) => {
          const pos = 6 - k, w = s.pre === 1 && s.paired[pos - 1] ? zipFrom1(s.bonds1, pos, 6) : 0;
          pre1.pair(j, u1.points[i], w); if (s.pre === 1) u1.pair(i, w > 0 ? pre1.points[j] : null, w);
        });
        const site = t >= T.mutant + 3.6 ? SITE.mutant : SITE.wild;
        pre0.letters(PRE0, lv).pose().view(pxPerA).opacity(s.show0);
        pre1.letters('N'.repeat(E) + site + 'N'.repeat(5), lv);
        for (let j = 1; j <= 6; j++) if (SITE.wild[j - 1] !== SITE.mutant[j - 1]) stubLetter(pre1, E + j - 1, SITE.wild[j - 1], SITE.mutant[j - 1], s.mutate, lv);
        pre1.pose().view(pxPerA).opacity(s.show1);
        u1.pose().view(pxPerA).opacity(1);

        // Letters: U1's row (nucleotide 4 changing C → U with the suppressor), the pre-mRNA's (consensus, then 12S).
        u1Slots.forEach((sl, k) => {
          const n = k + 2;
          if (n === 4) drawSlot(sl, 'C', 'U', s.u1Mutant, lv, s.u1Mutant, RESCUE);
          else drawSlot(sl, U1_LETTERS[n], U1_LETTERS[n], 0, lv);
        });
        preSlots.forEach((sl, k) => {
          const j = k + 1, c = SITE.wild[j - 1], m = SITE.mutant[j - 1];
          if (s.show0 > 0) {
            // The consensus letters fade as the 12S ones come in (drawn by the slot's second glyph until the consensus
            // ones have gone, then by its first, as below: the same glyph, so nothing changes on screen).
            const cs = SITE.consensus[j - 1], p1 = sl.pos.clone().add(V(0, DROP * (1 - s.dock1), 0));
            setGlyph(sl.a, cs, BASES[cs], lv * s.show0, sl.pos.clone().add(V(0, DROP * (1 - s.dock0), 0)));
            setGlyph(sl.b, c || 'A', BASES[c] ?? INK, c ? lv * s.show1 : 0, p1);
            setGlyph(sl.ring, 'ring', MUTANT, 0, p1);
          } else if (j <= 6) drawSlot(sl, c, m, c === m ? 0 : s.mutate, lv * s.show1, c === m ? 0 : s.mutate, MUTANT, DROP * (1 - s.dock1));
          else drawSlot(sl, null, null, 0, 0);
        });
        at.letters = {u1: [2, 3, 4, 5, 6, 7, 8].map(n => n === 4 && s.u1Mutant > .5 ? 'U' : U1_LETTERS[n]).join(''), site: s.show0 > 0 ? SITE.consensus : site};
        at.bonded = {consensus: pair0.pairs.map(([i, j], k) => s.pre === 0 ? +zipFrom1(s.bonds0, 7 - k, 7).toFixed(2) : 0).reverse(),
          site: pair1.pairs.map(([i, j], k) => { const pos = 6 - k; return s.pre === 1 && s.paired[pos - 1] ? +zipFrom1(s.bonds1, pos, 6).toFixed(2) : 0; }).reverse()};
        at.time = t;
      },
      annotate(t, {label, tag}) {
        const s = state(t), col = c => ({color: hex(c)});
        const rowAt = (k, row) => V(pairX(k), row * (ROW + 3.2) + (row > 0 && t >= T.wild ? DROP * (1 - s.dock1) : 0), 0);
        if (t < T.domains) {
          if (t > 1.6 && t < 7) label(centreOf('U1-70K'), 'U1 snRNP', 'U1 snRNA with its proteins', col(SPLICING.U1));
          if (t > 1.6) { tag(centreOf('Sm ring'), 'Sm ring', col(SM)); tag(centreOf('U1-C'), 'U1-C', col(C1C)); }
          if (t > 3.6 && t < 9.4) label(W(pre0.points[E0 + 11]), 'Pre-mRNA', 'Exon, then intron', col(SPLICING.intron));
          if (t > 10) label(W(B(3)), '5′ splice site', 'Paired with U1 snRNA', col(SPLICING.intron));
        } else if (t < T.wild) {
          const d = t - T.domains;
          if (t < FAR_OUT[0]) {
            if (d > 2.2 && d < 6.4) label(W(u1Points[idx(95)].clone().lerp(u1Points[idx(113)], .5)), 'Base-paired domains', 'Stems of U1 snRNA', col(SPLICING.U1));
            if (d > 2.2) tag(W(u1Points[idx(129)]), 'Sm binding site', col(SM));
            if (d > 4.4) label(W(A(4)), 'Single-stranded 5′ end', 'Paired with the 5′ splice site', col(SPLICING.U1));
          }
          if (t > CLOSE + 2.4) {
            label(rowAt(-.6, -1), 'U1 snRNA', 'Nucleotides 2–8, read 3′ → 5′', {...col(SPLICING.U1), side: 'right'});
            if (t > CLOSE + 4) label(rowAt(-.6, 1), '5′ splice site', 'Exon, then GUAAGUA', {...col(SPLICING.intron), side: 'right', below: true});
            tag(W(pre0.points[NEAR0[0] + 1]), 'Exon', col(SPLICING.exon)); tag(W(pre0.points[NEAR0[1] - 2]), 'Intron', col(SPLICING.intron));
            tag(W(capAt).add(V(3, 5, 0)), 'Cap', col(CAP));
          }
        } else {
          // The 12S experiment, close up.
          const exonTag = () => tag(W(pre1.points[1]), 'Exon', col(SPLICING.exon)), intronTag = () => tag(W(pre1.points[PRE1.length - 3]), 'Intron', col(SPLICING.intron));
          if (s.show1 > .9) { exonTag(); intronTag(); }
          const status = (text, c) => tag(V(pairX(3.5), ROW + 12, 0), text, col(c));
          if (t < T.mutant) {
            // Once the pre-mRNA has docked (a label riding the docking would push the tags round it about on phones).
            if (t > DOCKINGS[0][0] + 2.4) label(rowAt(.4, 1), '12S adenovirus splice site', 'GUGAGG', {...col(SPLICING.intron), side: 'right', below: true});
            if (t > T.wild + 9) status('Normal splicing', RESCUE);
          } else if (t < T.none) {
            if (t > T.mutant + 4.6) label(rowAt(.4, 1), 'Mutant splice site', 'GG at positions 5 and 6 changed to AU', {...col(MUTANT), side: 'right', below: true});
          } else if (t < T.supp) {
            if (t > T.none + 5.6) { label(W(A(2).lerp(B(2), .5)), 'No pair at position 5', 'Its A faces a C', col(MUTANT)); status('No splicing', MUTANT); }
          } else if (t < T.restored) {
            if (t > T.supp + 4.6) label(rowAt(2, -1), 'Mutation in U1 snRNA', 'Its C changed to U', {...col(RESCUE), side: 'right'});
          } else if (t > T.restored + 5.6) {
            label(W(A(2).lerp(B(2), .5)), 'Pairing restored', 'A pairs with U at position 5', col(RESCUE));
            status('Splicing restored', RESCUE);
          }
        }
      },
    };
  },
});
