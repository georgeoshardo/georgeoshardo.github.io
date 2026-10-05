// Scene: DNA is a double helix. The B-DNA dodecamer CGCGAATTCGCG (the Dickerson–Drew dodecamer; PDB 355D, 1.4 Å)
// atom by atom, each strand's carbons in its colour: the helix, a G–C and an A–T pair with their hydrogen bonds,
// the antiparallel strands, the constant width (the two pairs lifted out, one above the other, their sugars' C1′
// atoms in line), the flat, stacked base pairs (the helix stood upright), ten to a turn (seen down its axis, a hand on
// each base pair sweeping round as the pairs go up), the grooves (atoms at full size, each strand in its colour, the
// helix turning to and fro) and the charged backbone (the phosphate groups picked out, and Na⁺ counterions gathering
// by them, as in solution; the crystal's own Mg²⁺ ion is not drawn); then the same helix as tubes and bonds, extended by
// ideal B-DNA.
import * as THREE from 'three';
import {runScene} from '../shared/scene_player.mjs';
import {loadSurfaceSet, baseMaterial} from '../shared/molecules.mjs';
import {BASES} from '../shared/strands.mjs';
import {createAtoms, createPlates, isPurine, BOND, ELEMENTS} from '../shared/atoms.mjs';
import {pairsFromStrands, frameFromPairs, createDuplex, extend, padPairs, minorGroove} from '../shared/dna.mjs';
import {ramp, smooth} from '../shared/ease.mjs';
import {boxAround} from '../shared/camera.mjs';

const V = (...a) => new THREE.Vector3(...a);
const hex = c => '#' + c.toString(16).padStart(6, '0');
const T = {gc: 10, at: 19, anti: 28, width: 37, plates: 47, turn: 57, grooves: 70, charge: 82, drawn: 93, end: 104};
const PURINE = 0xeeb45a, PYRIMIDINE = 0x8fb4ff, CHARGE = 0xff7a3d, HAND = 0xf3cf97, ARM = 9;
// Counterions: how far each Na⁺ sits from its phosphorus (Å, just beyond the two charged oxygens), how far out it
// starts as it gathers in, and when; and how far along the helix from its middle the phosphates that get one lie (all
// but the two outermost, whose ions would stand off the helix's ends).
const SODIUM = {gap: 3.7, from: 9, t0: 3, t1: 5.4, reach: 17};
// Each strand's carbons in its colour (light enough to tell from nitrogen); both strands are then drawn as tubes
// in the same colours.
const CARBON = {A: 0x86d2ec, B: 0xe4dccb};
// The helix turning to and fro about its axis while its grooves and charges are shown (radians, seconds).
const SWAY = {angle: .62, period: 13};

const NOTES = 'dna-is-a-double-helix';
const steps = [
  {t: 0, nav: 'A double helix', title: 'DNA is a<br>double helix.', notes: NOTES,
    text: 'In 1953, James Watson and Francis Crick proposed that DNA is a double helix, made up of two strands of nucleotides. The X-ray diffraction pattern of DNA captured by Rosalind Franklin and her student Raymond Gosling provided the crucial evidence for this model.'},
  {t: T.gc, nav: 'G pairs with C', title: 'G pairs with C:<br>three hydrogen bonds.', notes: NOTES,
    text: 'The two polynucleotide chains associate by hydrogen bonding between the bases. G can hydrogen-bond most stably with C, forming three hydrogen bonds.'},
  {t: T.at, nav: 'A pairs with T', title: 'A pairs with T:<br>two hydrogen bonds.', notes: NOTES,
    text: 'A bonds most stably with T, forming two hydrogen bonds. This hydrogen bonding between bases is described as base pairing, and the paired bases are said to be complementary.'},
  {t: T.anti, nav: 'Antiparallel', title: 'The strands run in<br>opposite directions.', notes: NOTES,
    text: 'The Watson–Crick model has the two polynucleotide chains running in opposite directions, so they are said to be antiparallel.'},
  {t: T.width, nav: 'Constant width', title: 'Purines always<br>face pyrimidines.', notes: NOTES, hold: 1.1,
    text: 'The double helix maintains a constant width because purines always face pyrimidines in the complementary A-T and G-C base pairs.'},
  {t: T.plates, nav: 'Stacked base pairs', title: 'Flat base pairs,<br>stacked like plates.', notes: NOTES, hold: 1.1,
    text: 'The sugar–phosphate backbones are on the outside of the double helix and the base pairs on the inside. The base pairs are flat and lie perpendicular to the axis of the helix, stacked on one another like a pile of plates: the steps of a spiral staircase.'},
  {t: T.turn, nav: 'Ten to a turn', title: 'About 10 base pairs<br>to a turn.', notes: NOTES, hold: 1.1,
    text: 'Each base pair is rotated about 36° around the axis of the helix relative to the next base pair, so approximately 10 base pairs make a complete turn of 360°.'},
  {t: T.grooves, nav: 'Two grooves', title: 'A minor and<br>a major groove.', notes: NOTES, hold: 1.1,
    text: 'The twisting of the two strands around each other forms a minor groove about 12 Å across and a major groove about 22 Å across. In B-DNA, the form in which DNA is found in the cell, the double helix is right-handed.'},
  {t: T.charge, nav: 'Charged backbone', title: 'A negatively<br>charged backbone.', notes: NOTES, hold: 1.1,
    text: 'The phosphate groups on the outside of the double helix carry negative charges. In solution these are neutralised by the binding of metal ions, typically Na⁺; in the cell, positively charged proteins provide some of the neutralising force.'},
  {t: T.drawn, nav: 'Simplified', title: 'The same helix,<br>simplified.',
    text: 'Drawn simply, each strand becomes a tube along its sugar–phosphate backbone and each base pair a single bond across the helix.'},
];

const at = {};  // positions the camera shots read (world coordinates)
// How far the helix has turned about its own axis at time t (only once it stands upright).
const sway = t => SWAY.angle * Math.sin(2 * Math.PI * (t - T.grooves) / SWAY.period) * ramp(t, T.grooves + .4, T.grooves + 2.2) * (1 - ramp(t, T.drawn - 1.6, T.drawn - .2));

runScene({
  pageTitle: 'DNA is a double helix · Genes are DNA', eyebrow: 'The double helix',
  links: [{href: 'index.html', text: 'All scenes'}],
  steps, duration: T.end, notesPage: 'notes.html', fov: 28, fog: .0006,
  shots: [
    // Shots that show the whole helix (or the lifted pair) fit what they show into the free part of the screen, so no
    // atom stands behind the step list, the narration or the buttons (at.views, measured from the atoms in build()).
    {t: 0, frame: () => ({...at.views.whole, fill: .92})},
    // A base pair lifted out of the helix to face the viewer, the rest of the helix hidden.
    {t: T.gc, blend: 2.4, frame: () => ({...at.views.pair, fill: .9})},
    {t: T.at, blend: 2.2, frame: () => ({...at.views.pair, fill: .9})},
    // Square on, so both strands' brackets read at the same length.
    {t: T.anti, blend: 2.6, target: [0, 0, 0], dir: [0, -.04, -1], radius: 31, fill: .96},
    // The two pairs one above the other, facing the viewer.
    {t: T.width, blend: 2.4, target: [0, 1.5, -7], dir: [0, -.06, -1], box: [34, 29], fill: .9},
    // Upright from here: a three-quarter view, down the axis, then side on and three-quarter again.
    {t: T.plates, blend: 3, frame: () => ({...at.views.plates, fill: .92})},
    // Almost straight down the axis, so every hand starts from the middle of the view.
    {t: T.turn, blend: 2.8, frame: () => ({...at.views.turn, fill: .92})},
    {t: T.grooves, blend: 2.8, frame: () => ({...at.views.grooves, fill: .95})},
    {t: T.charge, blend: 2.4, frame: () => ({...at.views.charge, fill: .93})},
    {t: T.drawn, blend: 3.2, frame: () => ({...at.views.drawn, fill: .95})},
  ],
  async build({world, progress}) {
    const set = await loadSurfaceSet('assets/helix.json', 'assets/helix.bin', progress);
    const data = set.meta.atoms[0], strand = n => set.meta.strands.find(s => s.name === n);
    const pairs = pairsFromStrands(strand('a'), strand('b')), frames = frameFromPairs(pairs);

    // The scene frame: the helix axis along world x (strand 1 runs 5′→3′ to the right), the central pair's y up
    // (−y is up on screen). From the stacking step the helix stands upright (its axis turns to −y, strand 1's 3′
    // end at the top); it can then turn about its own axis.
    const axis = frames.reduce((s, f) => s.add(V(0, 0, 1).applyQuaternion(f.q)), V()).normalize();
    const centre = frames.reduce((s, f) => s.add(f.origin), V()).divideScalar(frames.length);
    const up = V(0, 1, 0).applyQuaternion(frames[6].q); up.addScaledVector(axis, -up.dot(axis)).normalize();
    const basis = new THREE.Matrix4().makeBasis(axis, up, axis.clone().cross(up));
    const q0 = new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().makeBasis(V(1, 0, 0), V(0, -1, 0), V(0, 0, -1)).multiply(basis.clone().transpose()));
    const frame = new THREE.Group(); world.add(frame);
    const qStand = new THREE.Quaternion(), qSpin = new THREE.Quaternion();
    const pose = (stand, spin, out = new THREE.Quaternion()) => out.copy(qSpin.setFromAxisAngle(V(0, 1, 0), spin)).multiply(qStand.setFromAxisAngle(V(0, 0, 1), stand)).multiply(q0);
    const orient = (stand, spin = 0) => { pose(stand, spin, frame.quaternion); frame.position.copy(centre).applyQuaternion(frame.quaternion).negate(); frame.updateMatrixWorld(true); };
    orient(0);
    const toWorld = v => frame.localToWorld(v.clone()), toLocal = v => frame.worldToLocal(v.clone());

    const R = data.residues, chainOf = k => R[data.atoms.residue[k]].chain;
    const atoms = createAtoms(frame, data, {carbon: k => CARBON[chainOf(k)] ?? 0xbfc9cd});
    const find = (chain, num) => R.findIndex(r => r.chain === chain && r.num === num);
    const GC = [find('A', 4), find('B', 21)], AT = [find('A', 6), find('B', 19)], LIFTED = [...GC, ...AT];
    const letter = k => R[atoms.residueOf[k]].letter, inRes = rs => k => rs.includes(atoms.residueOf[k]);
    const purines = atoms.select(k => letter(k) && isPurine(letter(k)) && atoms.part(k) === 'base');
    const pyrimidines = atoms.select(k => letter(k) && !isPurine(letter(k)) && atoms.part(k) === 'base');
    const phosphates = atoms.select(k => atoms.part(k) === 'phosphate');
    const strandAtoms = c => atoms.select(k => letter(k) && R[atoms.residueOf[k]].chain === c && atoms.part(k) !== 'base');
    const backbones = {A: strandAtoms('A'), B: strandAtoms('B')}, bases = atoms.select(k => letter(k) && atoms.part(k) === 'base');
    const hbondsOf = rs => new Set(atoms.hbonds.flatMap(([i], h) => rs.includes(atoms.residueOf[i]) ? [h] : []));
    const hbGC = hbondsOf(GC), hbAT = hbondsOf(AT);
    const platesBase = createPlates(frame, atoms, {color: ring => BASES[ring.letter], opacity: .62});
    const platesClass = createPlates(frame, atoms, {residues: LIFTED, color: ring => isPurine(ring.letter) ? PURINE : PYRIMIDINE, opacity: .62});
    // The same pairs drawn as the other pages draw DNA, extended by ideal B-DNA on both sides.
    const cartoon = createDuplex({pairs: padPairs(pairs, ARM, ARM)});
    cartoon.pose(extend(frames, ARM, ARM)); frame.add(cartoon.group); cartoon.opacity(0);

    // Measured from the crystal: the C1′–C1′ width of each lifted pair, and the mean twist from pair to pair.
    const c1 = r => atoms.home[atoms.find("C1'", r)], width = rs => c1(rs[0]).distanceTo(c1(rs[1]));
    const across = i => { const p = pairs[i], v = p.b.backbone.clone().sub(p.a.backbone); return v.addScaledVector(axis, -v.dot(axis)).normalize(); };
    let twist = 0; for (let i = 1; i < pairs.length - 2; i++) twist += across(i).angleTo(across(i + 1));
    at.widths = {gc: width(GC), at: width(AT)}; at.twist = THREE.MathUtils.radToDeg(twist / (pairs.length - 3));

    // Lifting a pair out: a rigid move (in the frame's coordinates) that turns its base-pair plane to face the
    // viewer, its C1′–C1′ line level with strand 1's base on the left: alone in the middle for its own step, then
    // one above the other so their widths can be compared, the purines on the left.
    const lift = (rs, windows) => {
      const ks = atoms.select(inRes(rs)), mid = c1(rs[0]).clone().add(c1(rs[1])).multiplyScalar(.5);
      const a = c1(rs[1]).clone().sub(c1(rs[0])); a.addScaledVector(axis, -a.dot(axis)).normalize();
      const from = new THREE.Matrix4().makeBasis(a, axis, a.clone().cross(axis));
      const x = toLocal(V(1, 0, 0)).sub(toLocal(V())).normalize(), n = toLocal(V(0, 0, -1)).sub(toLocal(V())).normalize();
      const to = new THREE.Matrix4().makeBasis(x, n, x.clone().cross(n));
      const q = new THREE.Quaternion().setFromRotationMatrix(to.multiply(from.transpose()));
      return {ks, mid, q, windows: windows.map(([spot, a0, b0]) => ({spot: toLocal(spot), a0, b0}))};
    };
    const CENTRE = V(0, 1.5, -7), GAP = 5.8;
    // When one pair gives way to the other, the two cross-fade in the middle of the view: the G·C pair goes back into
    // the helix once hidden, and the A·T pair has come out of it before it shows.
    const lifts = [lift(GC, [[CENTRE, T.gc, T.at + 2.2], [V(0, 1.5 - GAP, -7), T.width, T.plates]]), lift(AT, [[CENTRE, T.at - 2.5, T.anti], [V(0, 1.5 + GAP, -7), T.width, T.plates]])];
    const qi = new THREE.Quaternion(), qt = new THREE.Quaternion(), pos = V(), spot = V();
    // Guides down through the two pairs' C1′ atoms, dashed: the pairs are equally wide.
    const guideMaterial = new THREE.LineDashedMaterial({color: 0xf3cf97, dashSize: .7, gapSize: .5, transparent: true, opacity: 0});
    const guides = [0, 1].map(() => { const g = new THREE.BufferGeometry().setFromPoints([V(), V()]), l = new THREE.Line(g, guideMaterial); world.add(l); return l; });

    // Ten to a turn: seen down the axis, a hand from the axis to each base pair's strand-1 sugar, swept pair by pair
    // up the helix, and the angle it has turned drawn on a ring above the helix.
    const onAxis = p => centre.clone().addScaledVector(axis, p.clone().sub(centre).dot(axis));
    const hands = pairs.map((p, i) => {
      const base = onAxis(frames[i].origin), h = c1(find('A', i + 1)).clone().sub(base); h.addScaledVector(axis, -h.dot(axis)).normalize();
      return {base, h};
    });
    const angles = [0]; for (let i = 1; i < hands.length; i++) angles.push(angles[i - 1] + Math.atan2(axis.dot(hands[i - 1].h.clone().cross(hands[i].h)), hands[i - 1].h.dot(hands[i].h)));
    const sense = Math.sign(angles[1]) || 1, turnGroup = new THREE.Group(); frame.add(turnGroup);
    const handMaterial = baseMaterial(HAND, {emissive: HAND, emissiveIntensity: .35, roughness: .4}), oldHand = baseMaterial(0xb9c6cc, {emissive: 0xb9c6cc, emissiveIntensity: .1, roughness: .5, transparent: true, opacity: .5});
    const handMeshes = hands.map(({base, h}) => {
      const m = new THREE.Mesh(new THREE.CylinderGeometry(.16, .16, 10, 10).translate(0, 5, 0), handMaterial);
      m.position.copy(base); m.quaternion.setFromUnitVectors(V(0, 1, 0), h); turnGroup.add(m); return m;
    });
    // The ring girdles the helix halfway up, at the depth the camera looks at.
    const top = onAxis(centre), RING = 12, SEG = 240;
    // A tube round a circle, built along its length, so drawing part of it draws an arc.
    const circle = new THREE.CatmullRomCurve3(Array.from({length: 97}, (_, i) => V(RING * Math.cos(i / 96 * Math.PI * 2), RING * Math.sin(i / 96 * Math.PI * 2), 0)));
    const ringGeometry = new THREE.TubeGeometry(circle, SEG, .16, 8, false), ring = new THREE.Mesh(ringGeometry, handMaterial);
    const rz = axis.clone().multiplyScalar(sense), rx = hands[0].h.clone(), ry = rz.clone().cross(rx);
    ring.quaternion.setFromRotationMatrix(new THREE.Matrix4().makeBasis(rx, ry, rz)); ring.position.copy(top); turnGroup.add(ring);
    const ringPoint = a => top.clone().addScaledVector(rx, RING * Math.cos(a)).addScaledVector(ry, RING * Math.sin(a));
    const dots = angles.slice(0, 11).map(a => { const d = new THREE.Mesh(new THREE.SphereGeometry(.42, 12, 8), handMaterial); d.position.copy(ringPoint(Math.abs(a))); turnGroup.add(d); return d; });
    // When the sweep reaches pair k (0 … 10), and how far round it has come at time t.
    const SWEEP = {t0: T.turn + 2.4, step: .72};
    const swept = t => Math.max(0, Math.min(10, (t - SWEEP.t0) / SWEEP.step));
    const sweptAngle = t => { const s = swept(t), k = Math.floor(s), f = s - k; return Math.abs(k >= 10 ? angles[10] : angles[k] + (angles[k + 1] - angles[k]) * smooth(f)); };

    // The phosphate groups that face the viewer when the charges are shown (the helix at its pose then), for the
    // labels to follow as it turns.
    const Pk = atoms.select(k => atoms.names[k] === 'P'), qRef = pose(-Math.PI / 2, sway(T.charge + 2));
    const facing = Pk.map(k => ({k, z: atoms.home[k].clone().sub(centre).applyQuaternion(qRef).z})).sort((a, b) => a.z - b.z).map(x => x.k);
    const frontP = facing.slice(0, 5);
    // In solution the phosphates' charges are neutralised by metal ions, typically Na⁺: one drawn by each phosphate
    // group, just outside its two charged oxygens and level with it along the helix (an illustration of the
    // counterions, not positions from the crystal), gathering in from further out. The one by the front-most
    // phosphate near the middle of the helix that carries no other label is named.
    const flat = v => v.addScaledVector(axis, -v.dot(axis)), along = k => atoms.home[k].clone().sub(centre).dot(axis);
    const withIon = Pk.filter(k => Math.abs(along(k)) < SODIUM.reach);
    const sodium = withIon.map(k => {
      const r = atoms.residueOf[k], P = atoms.home[k], O = atoms.home[atoms.find('OP1', r)].clone().add(atoms.home[atoms.find('OP2', r)]).multiplyScalar(.5);
      const d = flat(O.sub(P)).normalize().add(flat(P.clone().sub(centre)).normalize()).normalize();
      return {at: P.clone().addScaledVector(d, SODIUM.gap), from: P.clone().addScaledVector(d, SODIUM.gap + SODIUM.from)};
    });
    const ions = createAtoms(frame, {atoms: {name: sodium.map(() => 'NA'), element: sodium.map(() => 'NA'), residue: sodium.map(() => 0),
      position: sodium.map(s => s.from.toArray())}, bonds: [], residues: [{}]});
    ions.opacity(0);
    at.counterions = {ions: sodium.length, phosphates: Pk.length, magnesium: 0,
      nearest: Math.min(...sodium.map((s, i) => s.at.distanceTo(atoms.home[withIon[i]]))), farthest: Math.max(...sodium.map((s, i) => s.at.distanceTo(atoms.home[withIon[i]])))};
    const namedIon = withIon.indexOf(facing.find(k => !frontP.includes(k) && Math.abs(along(k)) < 7));

    // What each shot shows, posed as it is then (frame coordinates to world), for the camera to fit: the whole helix
    // (upright from the stacking step on, turning to and fro while the grooves and charges are shown), the lifted
    // pairs, the ring of the turn, the counterions, the simplified helix; with room beside an upright helix for its
    // labels.
    const posed = (points, stand, spins = [0]) => spins.flatMap(spin => { const q = pose(stand, spin); return points.map(v => v.clone().sub(centre).applyQuaternion(q)); });
    const helixAtoms = atoms.home.filter((_, k) => letter(k)), UP = -Math.PI / 2, swings = [-1, -.5, 0, .5, 1].map(f => f * SWAY.angle);
    const lifted = lifts.flatMap(L => L.ks.map(k => atoms.home[k].clone().sub(L.mid).applyQuaternion(L.q).add(L.windows[0].spot)));
    const ringPoints = Array.from({length: 24}, (_, i) => ringPoint(i / 24 * Math.PI * 2));
    const fit = (points, dir, o = {}) => boxAround(points, dir, {fov: 28, ...o});
    at.views = {
      whole: fit(posed(helixAtoms, 0), [.45, -.28, -1]),
      pair: fit(posed(lifted, 0), [0, -.12, -1]),
      plates: fit(posed(helixAtoms, UP), [.6, -.16, -1], {sides: 13}),
      turn: fit(posed([...helixAtoms, ...ringPoints], UP), [.02, -1, -.1]),
      grooves: fit(posed(helixAtoms, UP, swings), [.1, -.05, -1], {margin: 2, sides: 12}),
      charge: fit(posed([...helixAtoms, ...sodium.map(s => s.at.clone().lerp(s.from, .5))], UP, swings), [.45, -.14, -1], {margin: 1.5, sides: 13}),
      drawn: fit(posed([...cartoon.world.aBackbone, ...cartoon.world.bBackbone], UP), [.42, -.14, -1], {margin: 2, sides: 22}),
    };

    // For tests (?debug=1): the atoms, ions, ring and simplified strands drawn now, world coordinates.
    at.shown = () => {
      const out = [];
      if (atoms.group.visible) atoms.positions.forEach((v, k) => { if (letter(k) && atoms.shown[k] > .05) out.push(toWorld(v)); });
      if (ions.group.visible) ions.positions.forEach(v => out.push(toWorld(v)));
      if (turnGroup.visible) ringPoints.forEach(v => out.push(toWorld(v)));
      if (cartoon.group.visible) for (const v of [...cartoon.world.aBackbone, ...cartoon.world.bBackbone]) out.push(toWorld(v));
      return out.map(v => v.toArray());
    };

    let lastTint = '';
    return {
      atoms, cartoon, ions, at,  // for tests (?debug=1)
      update(t, {pxPerA = 1} = {}) {
        orient(-Math.PI / 2 * smooth(ramp(t, T.plates - .4, T.plates + 2.4)), sway(t));
        cartoon.view(pxPerA);
        // One pair at a time, then the two one above the other; the rest of the helix hidden meanwhile.
        const only = [
          [GC, ramp(t, T.gc + .1, T.gc + 1.3) * (1 - ramp(t, T.at - .3, T.at + .7))],
          [AT, ramp(t, T.at - .3, T.at + .7) * (1 - ramp(t, T.anti - .5, T.anti + .7))],
          [LIFTED, ramp(t, T.width + .1, T.width + 1.2) * (1 - ramp(t, T.plates - 1.4, T.plates - .3))],
        ];
        // While charged, the phosphate groups swell a little.
        const ch = ramp(t, T.charge + .3, T.charge + 1.3) * (1 - ramp(t, T.drawn, T.drawn + .8)), swell = 1 + .55 * ch;
        for (let k = 0; k < atoms.count; k++) {
          const r = atoms.residueOf[k];
          let hide = 0; for (const [rs, w] of only) if (!rs.includes(r)) hide = Math.max(hide, w);
          // (The crystal's Mg²⁺ ion is never drawn.)
          atoms.shown[k] = letter(k) ? (1 - hide) * (atoms.part(k) === 'phosphate' ? swell : 1) : 0;
          if (!letter(k)) at.counterions.magnesium = Math.max(at.counterions.magnesium, atoms.shown[k]);
        }
        // The lifted pairs move out and back.
        for (const L of lifts) {
          const win = L.windows.find(x => t > x.a0 - .5 && t < x.b0 + .5), w = win ? smooth(ramp(t, win.a0 + .3, win.a0 + 2.2) * (1 - ramp(t, win.b0 - 1.5, win.b0 - .4))) : 0;
          qt.slerpQuaternions(qi, L.q, w); spot.lerpVectors(L.mid, win ? win.spot : L.mid, w);
          for (const k of L.ks) atoms.positions[k].copy(pos.subVectors(atoms.home[k], L.mid).applyQuaternion(qt).add(spot));
        }
        // Space filling for the grooves.
        atoms.fill = smooth(ramp(t, T.grooves + .4, T.grooves + 2.2) * (1 - ramp(t, T.charge - .2, T.charge + 1)));
        const all = ramp(t, T.anti + .4, T.anti + 1.8) * (1 - atoms.fill);
        const gc = ramp(t, T.gc + 1.2, T.gc + 2.2), atw = ramp(t, T.at + .8, T.at + 1.8);
        atoms.showHbonds(all); atoms.showHbonds(Math.max(all, gc), h => hbGC.has(h)); atoms.showHbonds(Math.max(all, atw), h => hbAT.has(h));
        atoms.update();
        platesClass.update();
        // The Na⁺ ions gather by the phosphates, then leave with the atoms.
        const gather = smooth(ramp(t, T.charge + SODIUM.t0, T.charge + SODIUM.t1));
        sodium.forEach((s, i) => ions.positions[i].lerpVectors(s.from, s.at, gather));
        ions.update(); ions.opacity(ramp(t, T.charge + SODIUM.t0, T.charge + SODIUM.t0 + 1.2) * (1 - ramp(t, T.drawn, T.drawn + 1)));
        // The C1′ guides while the pairs are compared.
        const wc = ramp(t, T.width + 1.4, T.width + 2.6) * (1 - ramp(t, T.plates - 1.4, T.plates - .4));
        guideMaterial.opacity = .85 * ramp(t, T.width + 2.4, T.width + 3.2) * (1 - ramp(t, T.plates - 1.6, T.plates - .8));
        guides.forEach((l, i) => {
          const a = toWorld(atoms.positions[atoms.find("C1'", GC[i])]), b = toWorld(atoms.positions[atoms.find("C1'", AT[i])]), d = b.clone().sub(a).normalize();
          l.geometry.setFromPoints([a.addScaledVector(d, -2.6), b.addScaledVector(d, 2.6)]); l.computeLineDistances(); l.visible = guideMaterial.opacity > .01;
        });
        // Tints: purines and pyrimidines while the pairs are compared; for the grooves, each strand's backbone in its
        // colour over darker bases; the phosphates while charged.
        const gv = ramp(t, T.grooves + .6, T.grooves + 1.8) * (1 - ramp(t, T.charge - .2, T.charge + .8));
        const key = `${wc.toFixed(2)}|${ch.toFixed(2)}|${gv.toFixed(2)}`;
        if (key !== lastTint) {
          lastTint = key; atoms.untint();
          atoms.tint(purines, PURINE, .75 * wc); atoms.tint(pyrimidines, PYRIMIDINE, .75 * wc);
          atoms.tint(backbones.A, CARBON.A, .82 * gv); atoms.tint(backbones.B, CARBON.B, .82 * gv); atoms.tint(bases, 0x3b4a58, .72 * gv);
          atoms.tint(phosphates, CHARGE, .95 * ch);
        }
        // Down the axis, the atoms step back and the plates dim, so the hands show the turn; then the atoms give way
        // to the simpler drawing.
        const back = ramp(t, T.turn + .6, T.turn + 1.8) * (1 - ramp(t, T.grooves - .4, T.grooves + .6));
        const drawn = ramp(t, T.drawn + .4, T.drawn + 2.4);
        platesClass.opacity(wc);
        platesBase.opacity(ramp(t, T.plates + .8, T.plates + 2) * (1 - ramp(t, T.grooves + .2, T.grooves + 1)) * (1 - .55 * back));
        atoms.opacity((1 - .94 * back) * (1 - drawn)); cartoon.opacity(drawn);
        // The sweep: hands up to the one reached, the newest bright; the angle so far on the ring.
        const s = swept(t), shownTurn = ramp(t, T.turn + 1.4, T.turn + 2.2) * (1 - ramp(t, T.grooves - .6, T.grooves + .2));
        turnGroup.visible = shownTurn > .01;
        handMeshes.forEach((m, k) => { m.visible = shownTurn > .01 && k <= s + .02 && k <= 10; m.material = k === Math.min(10, Math.floor(s + .02)) ? handMaterial : oldHand; });
        dots.forEach((d, k) => { d.visible = shownTurn > .01 && k <= s + .02; });
        ringGeometry.setDrawRange(0, 48 * Math.round(SEG * sweptAngle(t) / (2 * Math.PI)));
        ring.visible = shownTurn > .01 && s > 0;
      },
      annotate(t, {label, tag, bracket}) {
        const P = (name, r) => toWorld(atoms.positions[atoms.find(name, r)]);
        const baseCentre = r => toWorld(atoms.centre(atoms.select(k => atoms.residueOf[k] === r && atoms.part(k) === 'base')));
        const hbCentre = rs => toWorld(atoms.centre(atoms.hbonds.filter(([i]) => rs.includes(atoms.residueOf[i])).flat()));
        const A1 = find('A', 1), A12 = find('A', 12), B13 = find('B', 13), B24 = find('B', 24);
        if (t < T.gc) {
          if (t > 1.6) { tag(P('P', find('A', 7)), 'Strand 1', {color: hex(CARBON.A)}); tag(P('P', find('B', 19)), 'Strand 2', {color: hex(CARBON.B)}); }
        } else if (t < T.at) {
          if (t > T.gc + 2.2) {
            label(hbCentre(GC), 'Three hydrogen bonds', 'G pairs with C', {color: hex(BOND.hbondColor)});
            tag(baseCentre(GC[0]), 'G', {color: hex(BASES.G)}); tag(baseCentre(GC[1]), 'C', {color: hex(BASES.C)});
          }
        } else if (t < T.anti) {
          if (t > T.at + 1.8) {
            label(hbCentre(AT), 'Two hydrogen bonds', 'A pairs with T', {color: hex(BOND.hbondColor)});
            tag(baseCentre(AT[0]), 'A', {color: hex(BASES.A)}); tag(baseCentre(AT[1]), 'T', {color: hex(BASES.T)});
          }
        } else if (t < T.width) {
          if (t > T.anti + 1.8) {
            // Each strand's direction above and below the helix, both brackets spanning its whole length, their ends
            // turned in towards it; and each strand's two ends where they are.
            const a5 = P("O5'", A1), a3 = P("O3'", A12), b5 = P("O5'", B13), b3 = P("O3'", B24), ends = [a5, a3, b5, b3];
            const left = Math.min(...ends.map(p => p.x)), right = Math.max(...ends.map(p => p.x));
            const above = Math.min(...ends.map(p => p.y)) - 9, below = Math.max(...ends.map(p => p.y)) + 9;
            bracket(V(left, above, 0), V(right, above, 0), 'Strand 1 · 5′ → 3′');
            bracket(V(right, below, 0), V(left, below, 0), 'Strand 2 · 3′ ← 5′');
            tag(a5, 'Strand 1 · 5′', {color: hex(CARBON.A)}); tag(a3, 'Strand 1 · 3′', {color: hex(CARBON.A)});
            tag(b5, 'Strand 2 · 5′', {color: hex(CARBON.B)}); tag(b3, 'Strand 2 · 3′', {color: hex(CARBON.B)});
          }
        } else if (t < T.plates) {
          if (t > T.width + 2.8 && t < T.plates - 1.6) {
            // Each pair's width, sugar to sugar: over the G–C pair, under the A–T pair, ends turned in towards it.
            const c = r => P("C1'", r), shift = (v, dy) => v.clone().add(V(0, dy, 0));
            bracket(shift(c(GC[0]), -3.6), shift(c(GC[1]), -3.6), `${at.widths.gc.toFixed(1)} Å`);
            bracket(shift(c(AT[1]), 3.6), shift(c(AT[0]), 3.6), `${at.widths.at.toFixed(1)} Å`);
            label(c(GC[1]).lerp(c(AT[1]), .5), 'C1′ to C1′', 'Sugar to sugar: the same width in both pairs', {color: '#f3cf97'});
            tag(baseCentre(GC[0]), 'G · purine', {color: hex(PURINE)}); tag(baseCentre(GC[1]), 'C · pyrimidine', {color: hex(PYRIMIDINE)});
            tag(baseCentre(AT[0]), 'A · purine', {color: hex(PURINE)}); tag(baseCentre(AT[1]), 'T · pyrimidine', {color: hex(PYRIMIDINE)});
          }
        } else if (t < T.turn) {
          if (t > T.plates + 2.6) {
            const out = atoms.select(k => atoms.names[k] === 'P').map(k => toWorld(atoms.positions[k])).sort((a, b) => a.z - b.z)[0];
            label(out, 'Sugar–phosphate backbone', 'On the outside', {color: hex(CARBON.A)});
            label(baseCentre(find('A', 5)), 'Base pairs', 'Flat, stacked on the inside', {color: hex(BASES.A)});
          }
        } else if (t < T.grooves) {
          // The first step of the sweep, then the whole turn.
          const r = swept(t), a1 = Math.abs(angles[1]);
          if (r > .6 && r < 5) label(toWorld(ringPoint(a1 / 2)), 'About 36°', 'From one base pair to the next', {color: hex(HAND)});
          if (r >= 10) label(toWorld(ringPoint(Math.abs(angles[10]))), 'About 10 base pairs', 'One complete turn of 360°', {color: hex(HAND)});
        } else if (t < T.charge) {
          if (t > T.grooves + 2.4) {
            // Where each groove faces the viewer (from −z): along the helix, the point whose groove direction turns
            // most towards the camera, found between base pairs so the label glides as the helix turns.
            const dirs = pairs.map((p, i) => minorGroove(p, frames[i]).applyQuaternion(frame.quaternion));
            const facing = sign => {
              let best = 1; for (let i = 2; i < pairs.length - 2; i++) if (-sign * dirs[i].z > -sign * dirs[best].z) best = i;
              const s = i => -sign * dirs[i].z, a = s(best - 1), b = s(best), c = s(best + 1), d = a - 2 * b + c, f = Math.abs(d) > 1e-6 ? Math.max(-.5, Math.min(.5, (a - c) / (2 * d))) : 0;
              const point = i => toWorld(frames[i].origin.clone().add(minorGroove(pairs[i], frames[i]).multiplyScalar(sign * 7)));
              return f >= 0 ? point(best).lerp(point(best + 1), f) : point(best).lerp(point(best - 1), -f);
            };
            label(facing(1), 'Minor groove', 'About 12 Å across', {color: '#9fd6c8'});
            label(facing(-1), 'Major groove', 'About 22 Å across', {color: '#f3cf97'});
            tag(V(-13, -17, -4), 'Right-handed', {color: '#e8f1f4'});
          }
        } else if (t < T.drawn) {
          if (t > T.charge + 1.4) {
            const [first, ...rest] = frontP.map(k => toWorld(atoms.positions[k]));
            label(first, 'Phosphate group', 'Negatively charged', {color: hex(CHARGE)});
            for (const p of rest) tag(p, '−', {color: hex(CHARGE)});
            if (t > T.charge + SODIUM.t1 + .3) label(toWorld(ions.positions[namedIon]), 'Na⁺ ions', 'Neutralise the negative charges', {color: hex(ELEMENTS.NA.color)});
          }
        } else if (t > T.drawn + 2.6) {
          const W = cartoon.world;
          label(toWorld(W.aBackbone[ARM + 2]), 'Sugar–phosphate backbone', 'Drawn as a tube', {color: hex(CARBON.A)});
          label(toWorld(W.aBackbone[ARM + 7].clone().add(W.bBackbone[ARM + 7]).multiplyScalar(.5)), 'Base pair', 'Drawn as one bond', {color: '#cfc8b8'});
        }
      },
    };
  },
});
