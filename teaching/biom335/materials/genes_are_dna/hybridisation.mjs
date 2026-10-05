// Scene: base pairing, made and broken. A DNA duplex (ideal B-DNA, A–T-rich at its ends and G–C-rich in its middle)
// is heated: its base pairs break from the ends inward, the A–T pairs first, until the two strands part (denaturation);
// cooled, the complementary strands meet and pair again from the middle outward (renaturation). Then RNA, from real
// structures: a single-stranded RNA folds back on itself and its bases pair (the HIV-1 TAR hairpin), and a second,
// complementary RNA hairpin pairs with its loop (the TAR "kissing" complex, PDB 1KIS); a DNA–RNA heteroduplex atom by
// atom (PDB 1FIX), the RNA's riboses with their 2′ hydroxyls and its uracils paired with adenine; and the three side by
// side. Each molecule has its place, one above the other, and the camera moves from one to the next.
import * as THREE from 'three';
import {runScene} from '../shared/scene_player.mjs';
import {loadSurfaceSet} from '../shared/molecules.mjs';
import {STRANDS, BASES} from '../shared/strands.mjs';
import {createCartoon, nucleotides, partners, pairTip} from '../shared/rna.mjs';
import {createAtoms, createPlates} from '../shared/atoms.mjs';
import {pairsFromStrands, frameFromPairs, meanLocal, sequencePairs, createDuplex, RISE, TWIST} from '../shared/dna.mjs';
import {ramp, smooth, clamp, mix} from '../shared/ease.mjs';

const V = (...a) => new THREE.Vector3(...a);
const hex = c => '#' + c.toString(16).padStart(6, '0');
const T = {renature: 15, fold: 28, kiss: 42, hybrid: 55, all: 70, end: 83};
// Colours: DNA's two strands as the other pages draw them (sky blue, ivory), RNA orange and a second RNA lilac; the
// hybrid's carbons in its strands' colours. A–T and G–C pairs tinted while the duplex melts.
const DNA = [STRANDS.template, STRANDS.coding], RNA = STRANDS.rna, RNA2 = 0xc9a2f4;
const RUNG = {rna: 0xd7925c, rna2: 0xa68ccb}, CARBON = {rna: 0xffbf87, dna: 0x86d2ec};
const AT = 0x49c99a, GC = 0xefd65a, HEAT = 0xf3a36b, COOL = 0x8fcbf2, HYDROXYL = 0xff6fae;
// Each molecule's place (Å; −y is up on screen): the DNA duplex above, the RNAs below it on the left and the
// heteroduplex on the right, so the last step shows all three at once.
const HOME = {dna: V(-2, -44, 0), rna: V(-30, 20, 0), hybrid: V(38, 20, 0)};

// The DNA duplex: 20 base pairs, A–T at both ends and G–C in the middle.
const SEQ = 'ATTAAT' + 'GCGGCCGC' + 'TTAATA', N = SEQ.length, isAT = i => 'AT'.includes(SEQ[i]);
const S = i => (i - (N - 1) / 2) * RISE;  // where each pair sits along the duplex, from its middle (Å)
// W for every pair paired, and for the A–T pairs parted while the G–C pairs hold.
const EDGE = S(N - 1) + 1.5 * RISE, BORDER = Math.abs(S(6)) + .2;
// Where the strands have parted they turn away from the duplex (radius RHO) and run on at an angle.
// A single strand's backbone lies closer to its path than a paired strand's does to the duplex's axis (by SHRINK).
const RHO = 14, OPEN_ANGLE = 1, APART_ANGLE = .5, APART = 13, SHRINK = .45;
// The duplex's state at time t: pairs within W of its middle are paired; the strands' paths turn away beyond, at angle
// `alpha`; once no pair is left, the strands lie D apart. It melts from its ends, faster through the A–T pairs, and
// pairs again from the middle outward.
function dnaState(t) {
  const melt = ramp(t, 3.6, 6.4), melt2 = ramp(t, 9, 10.6);
  const apart = ramp(t, 10.6, 12.6) * (1 - ramp(t, T.renature + .6, T.renature + 3));
  let W = mix(mix(EDGE, BORDER, melt), 0, melt2);
  if (t > T.renature) W = EDGE * smooth(ramp(t, T.renature + 3, T.renature + 7));
  return {W, D: APART * apart, alpha: mix(OPEN_ANGLE, APART_ANGLE, apart)};
}

// The hairpin (TAR, chain A of 1KIS): residues 1–5 pair with 16–12, its loop 6–11 pairs with the second RNA's.
// Array indices: arm 1 is 0–4, the loop 5–10, arm 2 11–15. The fold: both arms swung out by ARM (radians) at first,
// then zipped together from the loop outward.
const ARM = .85, STUB = 4.2;

const NOTES = {fork: 'polymerases-act-on-separated-dna-strands-at-the-replication-fork', pairing: 'nucleic-acids-hybridise-by-base-pairing'};
const steps = [
  {t: 0, nav: 'Denaturation', title: 'Denaturation:<br>the strands part.', notes: NOTES.fork, hold: 1.1,
    text: 'The two strands of a DNA duplex are held together by base pairing. Separating them is called denaturation: the disruption of the duplex, as the hydrogen bonds between its base pairs break.'},
  {t: T.renature, nav: 'Renaturation', title: 'Renaturation:<br>the strands pair again.', notes: NOTES.fork, hold: 1.1,
    text: 'Since the two strands are held together by base-specific pairing, denaturation is reversible: the complementary strands rejoin by base pairing, re-forming the duplex. This is called renaturation.'},
  {t: T.fold, nav: 'Within one RNA', title: 'An RNA can pair<br>with itself.', notes: NOTES.pairing, hold: 1.1,
    text: 'Base pairing also occurs within single-stranded RNA (or DNA): the strand folds back on itself, and its bases pair with complementary bases in the same molecule. This is intramolecular pairing.'},
  {t: T.kiss, nav: 'Between RNAs', title: 'RNAs pair with<br>one another.', notes: NOTES.pairing, hold: 1.1,
    text: 'Bases can pair between molecules too: intermolecular pairing. Base pairing is generally intercompatible between complementary strands of the same nucleic acid: here the unpaired loops of two RNAs pair.'},
  {t: T.hybrid, nav: 'DNA–RNA heteroduplex', title: 'DNA pairs with RNA:<br>a heteroduplex.', notes: NOTES.pairing, hold: 1.1,
    text: 'Single-stranded DNA and single-stranded RNA can also base pair, forming double-stranded structures known as DNA–RNA heteroduplexes. The RNA strand has a ribose, with its 2′ hydroxyl, in each nucleotide, and uracil in place of thymine.'},
  {t: T.all, nav: 'Central to all', title: 'Base pairing is<br>central to all.', notes: NOTES.pairing, hold: 1.1,
    text: 'The concept of base pairing is central to all processes involving nucleic acids. Disruption of the hydrogen bonds which form base pairs is crucial to the function of a double-stranded nucleic acid, whereas the ability to form base pairs is essential for the activity of a single-stranded nucleic acid.'},
];

const at = {};  // world positions the shots and tests read, and counts for the tests

// A rotation taking the unit vectors x and y (x ⟂ y) to world +x and y (±y, as `down` says: +y is down on screen).
const orientation = (x, y, down = true) => new THREE.Quaternion().setFromRotationMatrix(
  new THREE.Matrix4().makeBasis(V(1, 0, 0), V(0, down ? 1 : -1, 0), V(0, 0, down ? 1 : -1)).multiply(new THREE.Matrix4().makeBasis(x, y, x.clone().cross(y)).transpose()));

runScene({
  pageTitle: 'Denaturation and hybridisation · Genes are DNA', eyebrow: 'Base pairing',
  links: [{href: 'index.html', text: 'All scenes'}],
  steps, duration: T.end, notesPage: 'notes.html', fov: 26, fog: .0002, loop: false,
  shots: [
    {t: 0, target: HOME.dna.toArray(), dir: [.06, -.1, -1], box: [84, 70]},
    {t: T.fold, blend: 2.6, frame: () => ({target: at.tar, dir: [.05, -.1, -1], box: [58, 52]})},
    {t: T.kiss, blend: 2.4, frame: () => ({target: at.rna, dir: [.05, -.1, -1], box: [72, 46]})},
    {t: T.hybrid, blend: 2.6, frame: () => ({target: at.hybrid, dir: [.12, -.16, -1], box: [44, 34]})},
    {t: T.all, blend: 3, target: [-2, -10, 0], dir: [.06, -.1, -1], box: [120, 96]},
  ],
  async build({world, progress}) {
    const [helix, set] = await Promise.all([loadSurfaceSet('assets/helix.json', 'assets/helix.bin'), loadSurfaceSet('assets/hybridisation.json', 'assets/hybridisation.bin', progress)]);

    // ---------- The DNA duplex ----------
    // Ideal B-DNA (the mean base-pair geometry of 355D). Each strand is its own duplex drawn with only that strand, so
    // it can follow its own path: along the duplex's axis where paired, turning away where it has parted. Where both are
    // paired their frames are the same, and their half-bonds meet.
    const hs = n => helix.meta.strands.find(s => s.name === n), crystal = pairsFromStrands(hs('a'), hs('b')); frameFromPairs(crystal);
    const local = meanLocal(crystal.slice(1, -1)), dnaGroup = new THREE.Group(); dnaGroup.position.copy(HOME.dna); world.add(dnaGroup);
    // Each pair has its own copy of the local geometry, so a parted strand's backbone can move in towards its path.
    const strand = k => {
      const pairs = sequencePairs(SEQ, local).map(p => ({...p, local: Object.fromEntries(Object.entries(local).map(([key, v]) => [key, v.clone()]))}));
      const d = createDuplex({pairs, template: DNA[0], coding: DNA[1], widths: [.95, .95], samples: 3}); d.reveal(1 - k, 0); dnaGroup.add(d.group); return d;
    };
    const strands = [strand(0), strand(1)];
    const frames = [0, 1].map(() => Array.from({length: N}, () => ({origin: V(), q: new THREE.Quaternion()}))), open = [new Float32Array(N), new Float32Array(N)];
    const Z = V(0, 0, 1), zz = V(), yy = V(), pA = V(), pB = V(), m4 = new THREE.Matrix4(), q0 = new THREE.Quaternion(), qt = new THREE.Quaternion();
    // A point on strand k's path (k = 0 turns up, 1 down) at s along it, from the duplex's middle.
    const pathPoint = (s, k, {W, D, alpha}, out) => {
      const sigma = k ? 1 : -1, u = Math.abs(s) - W, side = Math.sign(s) || 1;
      if (u <= 0) return out.set(s, sigma * D, 0);
      const arc = RHO * alpha;
      const dx = u < arc ? RHO * Math.sin(u / RHO) : RHO * Math.sin(alpha) + (u - arc) * Math.cos(alpha);
      const dy = u < arc ? RHO * (1 - Math.cos(u / RHO)) : RHO * (1 - Math.cos(alpha)) + (u - arc) * Math.sin(alpha);
      return out.set(side * (W + dx), sigma * (D + dy), 0);
    };
    // Each pair's frame on a path: its axis along the path (towards higher pair numbers), a fixed reference across it
    // (the paths are flat), and the helix's twist.
    const poseDNA = st => {
      for (let k = 0; k < 2; k++) {
        for (let i = 0; i < N; i++) {
          const f = frames[k][i]; pathPoint(S(i), k, st, f.origin);
          zz.subVectors(pathPoint(S(i) + .05, k, st, pA), pathPoint(S(i) - .05, k, st, pB)).normalize(); yy.crossVectors(zz, Z);
          q0.setFromRotationMatrix(m4.makeBasis(Z, yy, zz)); f.q.copy(qt.setFromAxisAngle(zz, i * TWIST)).multiply(q0);
          open[k][i] = Math.max(clamp((Math.abs(S(i)) - st.W) / (1.2 * RISE)), clamp(st.D / 3));
          const key = k ? 'bBackbone' : 'aBackbone', inward = 1 - SHRINK * open[k][i];
          strands[k].pairs[i].local[key].set(local[key].x * inward, local[key].y * inward, local[key].z);
        }
        strands[k].pose(frames[k], open[k]);
      }
    };
    // A–T and G–C pairs tinted (w 0–1).
    let tinted = -1;
    const tintPairs = w => {
      if (Math.abs(w - tinted) < .01) return; tinted = w;
      const c = new THREE.Color(), base = [STRANDS.rung.template, STRANDS.rung.coding];
      strands.forEach((d, k) => { for (let i = 0; i < N; i++) d.rungs[k].setColorAt(i, c.set(base[k]).lerp(new THREE.Color(isAT(i) ? AT : GC), w)); d.rungs[k].instanceColor.needsUpdate = true; });
    };

    // ---------- The RNAs: the TAR hairpin and its complement (1KIS) ----------
    const groupOf = name => set.meta.atoms.find(g => g.name === name);
    const kis = nucleotides(groupOf('kissing')), kisPartner = partners(kis);
    const tarIdx = kis.map((n, i) => i).filter(i => kis[i].chain === 'A'), starIdx = kis.map((n, i) => i).filter(i => kis[i].chain === 'B');
    const nA = tarIdx.length, nB = starIdx.length;
    // The complex's frame: its long axis (TAR's stem end to its complement's) along x, TAR on the left; TAR's arm 1
    // above its arm 2.
    const mid = (i, j) => kis[i].backbone.clone().add(kis[j].backbone).multiplyScalar(.5);
    const xAxis = mid(starIdx[0], kisPartner[starIdx[0]]).sub(mid(tarIdx[0], kisPartner[tarIdx[0]])).normalize();
    const meanOf = is => is.reduce((s, i) => s.add(kis[i].backbone), V()).divideScalar(is.length);
    const across = meanOf(tarIdx.slice(11, 16)).sub(meanOf(tarIdx.slice(0, 5))); across.addScaledVector(xAxis, -across.dot(xAxis)).normalize();
    const kisCentre = kis.reduce((s, n) => s.add(n.backbone), V()).divideScalar(kis.length);
    const rnaGroup = new THREE.Group(), rnaInner = new THREE.Group(); rnaGroup.position.copy(HOME.rna); world.add(rnaGroup); rnaGroup.add(rnaInner);
    rnaInner.quaternion.copy(orientation(xAxis, across)); rnaInner.position.copy(kisCentre).applyQuaternion(rnaInner.quaternion).negate();
    const tar = createCartoon(rnaInner, nA, {colour: RNA, rung: RUNG.rna}), star = createCartoon(rnaInner, nB, {colour: RNA2, rung: RUNG.rna2});
    // The fold: arms hinge about the axis square to the plane of the stem (in the view's plane), each swung away from
    // the other.
    const hinge = xAxis.clone().cross(across).normalize(), qa = new THREE.Quaternion(), tmp = V();
    const home = tarIdx.map(i => kis[i].backbone), homeBase = tarIdx.map(i => kis[i].base);
    const swing = (p, pivot, a) => tmp.copy(p).sub(pivot).applyQuaternion(qa.setFromAxisAngle(hinge, a)).add(pivot).distanceTo(home[0]);
    const sign2 = swing(home[15], home[10], .3) > home[15].distanceTo(home[0]) ? 1 : -1;
    const sign1 = tmp.copy(home[0]).sub(home[5]).applyQuaternion(qa.setFromAxisAngle(hinge, .3)).add(home[5]).distanceTo(home[15]) > home[0].distanceTo(home[15]) ? 1 : -1;
    const tarPos = home.map(p => p.clone()), tarBase = homeBase.map(p => p.clone()), Q = new THREE.Quaternion(), tr = V(), pivot = V();
    // Zips F pairs (0–5) from the loop outward: the bend sits between the joints either side of the zip's front.
    const foldTar = F => {
      home.forEach((p, r) => { tarPos[r].copy(p); tarBase[r].copy(homeBase[r]); });
      for (const [joints, sign, step] of [[[10, 11, 12, 13, 14, 15], sign2, 1], [[5, 4, 3, 2, 1, 0], sign1, -1]]) {
        Q.identity(); tr.set(0, 0, 0);
        joints.forEach((j, u) => {
          const w = clamp(F - u + 1) - clamp(F - u), next = j + step;
          if (w > 0) {
            pivot.copy(home[j]).applyQuaternion(Q).add(tr); qa.setFromAxisAngle(hinge, sign * ARM * w);
            Q.premultiply(qa); tr.sub(pivot).applyQuaternion(qa).add(pivot);
          }
          if (next >= 0 && next < nA && (step > 0 ? next > 10 : next < 5)) {
            tarPos[next].copy(home[next]).applyQuaternion(Q).add(tr); tarBase[next].copy(homeBase[next]).applyQuaternion(Q).add(tr);
          }
        });
      }
    };
    // The second hairpin arrives along the direction that keeps it clearest of the first, and pairs.
    const starHome = starIdx.map(i => kis[i].backbone), starBaseHome = starIdx.map(i => kis[i].base);
    const clearance = d => {
      let low = Infinity;
      for (let off = 1.5; off <= 14; off += 1.5) for (const b of [...starHome, ...starBaseHome]) for (const a of [...home, ...homeBase]) low = Math.min(low, tmp.copy(b).addScaledVector(d, off).distanceTo(a));
      return low;
    };
    let approach = xAxis.clone(), best = -1;
    for (let k = 0; k < 160; k++) {
      const y = 1 - 2 * (k + .5) / 160, r = Math.sqrt(1 - y * y), a = k * Math.PI * (3 - Math.sqrt(5)), d = V(r * Math.cos(a), y, r * Math.sin(a));
      if (d.dot(xAxis) < .2) continue;  // from TAR's side, as the complement lies
      const c = clearance(d); if (c > best) { best = c; approach = d; }
    }
    const starPos = starHome.map(p => p.clone()), starBase = starBaseHome.map(p => p.clone());
    const placeStar = off => starHome.forEach((p, r) => { starPos[r].copy(p).addScaledVector(approach, off); starBase[r].copy(starBaseHome[r]).addScaledVector(approach, off); });
    // Bonds: each residue's to the middle of its pair (by how far paired, w), from a stub towards its base.
    const tips = n => Array.from({length: n}, () => V()), tarTips = tips(nA), starTips = tips(nB);
    const posOf = i => kis[i].chain === 'A' ? tarPos[tarIdx.indexOf(i)] : starPos[starIdx.indexOf(i)];
    const bond = (i, own, base, out, w) => { const j = kisPartner[i]; return pairTip(out, own, base, j >= 0 ? posOf(j) : null, w, STUB); };
    // Pairs: TAR's stem pair k (from the loop) zipped by F; the complement's own stem always; loop to loop by `kiss`.
    const tarStem = r => r <= 4 ? 4 - r : r >= 11 ? r - 11 : -1;
    const intra = kis.map((n, i) => kisPartner[i] >= 0 && kis[kisPartner[i]].chain === n.chain);
    at.rnaPairs = {intra: intra.filter(Boolean).length / 2, inter: kis.filter((n, i) => kisPartner[i] >= 0 && !intra[i]).length / 2};
    const rnaWorld = v => rnaInner.localToWorld(v.clone());
    // The loop-to-loop pair named: the leftmost on screen, so its label has room beside it in a narrow window.
    const loopPairs = [5, 6, 7, 8, 9, 10].map(r => [r, starIdx.indexOf(kisPartner[tarIdx[r]])]);
    const loopPair = () => loopPairs.map(([r, q]) => rnaWorld(tarPos[r].clone().lerp(starPos[q], .5))).sort((a, b) => a.x - b.x)[0];

    // ---------- The DNA–RNA heteroduplex (1FIX) ----------
    const hyb = groupOf('heteroduplex'), hn = nucleotides(hyb), hp = partners(hn);
    // Hydrogen bonds between true partners only (the export also joins near neighbours).
    hyb.hbonds = hyb.hbonds.filter(([i, j]) => hp[hyb.atoms.residue[i]] === hyb.atoms.residue[j]);
    const rnaS = set.meta.strands.find(s => s.name === 'rna'), dnaS = set.meta.strands.find(s => s.name === 'dna');
    const hpairs = pairsFromStrands(rnaS, dnaS), hframes = frameFromPairs(hpairs);
    const hAxis = hframes.reduce((s, f) => s.add(V(0, 0, 1).applyQuaternion(f.q)), V()).normalize();
    const hCentre = hframes.reduce((s, f) => s.add(f.origin), V()).divideScalar(hframes.length);
    const hUp = V(0, 1, 0).applyQuaternion(hframes[4].q); hUp.addScaledVector(hAxis, -hUp.dot(hAxis)).normalize();
    const hybridGroup = new THREE.Group(), hybridInner = new THREE.Group(); hybridGroup.position.copy(HOME.hybrid); world.add(hybridGroup); hybridGroup.add(hybridInner);
    hybridInner.quaternion.copy(orientation(hAxis, hUp, false)); hybridInner.position.copy(hCentre).applyQuaternion(hybridInner.quaternion).negate();
    const isRNA = r => hyb.residues[r].chain === rnaS.chain;
    const atoms = createAtoms(hybridInner, hyb, {carbon: i => isRNA(hyb.atoms.residue[i]) ? CARBON.rna : CARBON.dna});
    const plates = createPlates(hybridInner, atoms, {color: ring => BASES[ring.letter], opacity: .55});
    const hydroxyls = atoms.select(k => atoms.names[k] === "O2'");
    const backbones = {rna: atoms.select(k => isRNA(atoms.residueOf[k]) && atoms.part(k) !== 'base' && atoms.names[k] !== "O2'"),
      dna: atoms.select(k => !isRNA(atoms.residueOf[k]) && atoms.part(k) !== 'base')};
    const cartoon = createDuplex({pairs: hpairs, template: RNA, coding: DNA[0], widths: [1.05, .95], rung: [RUNG.rna, STRANDS.rung.template]});
    cartoon.pose(hframes); hybridInner.add(cartoon.group); cartoon.opacity(0);
    world.updateMatrixWorld(true);
    const hybWorld = v => hybridInner.localToWorld(v.clone());
    at.hybrid = hybWorld(hCentre);
    // What the labels name: the 2′ hydroxyl nearest the viewer (the camera looks along +z), on an inner nucleotide; a
    // uracil and the adenine it pairs with.
    const inner = k => { const r = atoms.residueOf[k], n = hyb.residues[r].num, nums = hyb.residues.filter(x => x.chain === hyb.residues[r].chain).map(x => x.num); return n > Math.min(...nums) + 1 && n < Math.max(...nums) - 1; };
    const nearest = ks => ks.filter(inner).sort((a, b) => hybWorld(atoms.home[a]).z - hybWorld(atoms.home[b]).z)[0] ?? ks[0];
    const o2 = nearest(hydroxyls.filter(k => hybWorld(atoms.home[k]).x > at.hybrid.x));
    const uracil = hn.findIndex(n => n.letter === 'U' && hp[hn.indexOf(n)] >= 0 && hn.filter(x => x.chain === n.chain).indexOf(n) > 0);
    const baseAtoms = r => atoms.select(k => atoms.residueOf[k] === r && atoms.part(k) === 'base');
    at.hbonds = hyb.hbonds.length; at.hybridPairs = hp.filter(j => j >= 0).length / 2;
    at.rnaLetters = hn.filter(n => n.chain === rnaS.chain).map(n => n.letter).join(''); at.dnaLetters = hn.filter(n => n.chain === dnaS.chain).map(n => n.letter).join('');
    at.hydroxyls = hydroxyls.length;

    foldTar(5); placeStar(0);
    const tarCentre = home.reduce((s, p) => s.add(p), V()).divideScalar(nA);
    at.tar = rnaWorld(tarCentre); at.rna = rnaWorld(kisCentre);
    at.dnaCentre = HOME.dna.clone();

    // Points on each molecule, in world space, for tests that check what shows on screen.
    const W3 = (group, v) => group.localToWorld(v.clone()).toArray();
    at.extent = () => ({
      dna: [0, 9, N - 1].flatMap(i => [W3(dnaGroup, strands[0].world.aBackbone[i]), W3(dnaGroup, strands[1].world.bBackbone[i])]),
      tar: [0, 7, nA - 1].map(r => W3(rnaInner, tarPos[r])), star: [0, 7, nB - 1].map(r => W3(rnaInner, starPos[r])),
      hybrid: [0, hpairs.length - 1].flatMap(i => [W3(hybridInner, cartoon.world.aBackbone[i]), W3(hybridInner, cartoon.world.bBackbone[i])]),
    });

    let lastTint = '';
    return {
      strands, tar, star, atoms, cartoon, at,  // for tests (?debug=1)
      update(t, {pxPerA = 1} = {}) {
        // Which molecules show: the DNA for its two steps and at the end; the RNAs for theirs and at the end; the
        // heteroduplex from its step, atom by atom, then drawn simply.
        const end = ramp(t, T.all + .4, T.all + 1.8);
        const dnaShown = ramp(t, .2, 1.4) * (1 - ramp(t, T.fold - .2, T.fold + .8)) + end;
        const tarShown = ramp(t, T.fold + .6, T.fold + 1.8) * (1 - ramp(t, T.hybrid - .2, T.hybrid + .8)) + end;
        const starShown = ramp(t, T.kiss + .4, T.kiss + 1.6) * (1 - ramp(t, T.hybrid - .2, T.hybrid + .8)) + end;
        // The heteroduplex drawn simply first, to show its two strands; then atom by atom; simply again at the end.
        const atomsShown = ramp(t, T.hybrid + 6.8, T.hybrid + 8.2) * (1 - ramp(t, T.all, T.all + 1.2));
        const simple = ramp(t, T.hybrid + .6, T.hybrid + 1.8) * (1 - atomsShown);

        // The DNA melts and pairs again; in the last step it is whole.
        const st = t > T.all ? dnaState(T.renature + 9) : dnaState(t);
        if (dnaShown > .001) { poseDNA(st); strands.forEach(d => d.view(pxPerA)); }
        strands.forEach(d => d.opacity(clamp(dnaShown)));
        tintPairs(.7 * ramp(t, 2, 3.2) * (1 - ramp(t, T.fold - 3, T.fold - 1)));
        at.paired = {AT: 0, GC: 0}; open[0].forEach((x, i) => { if (x < .5) at.paired[isAT(i) ? 'AT' : 'GC']++; });
        at.gap = Math.min(...strands[0].world.aBackbone.flatMap(a => strands[1].world.bBackbone.map(b => a.distanceTo(b))));

        // TAR opens as a single strand, then folds; the complement arrives and their loops pair.
        const F = t > T.all ? 5 : 5 * smooth(ramp(t, T.fold + 4, T.fold + 7.4));
        const kiss = t > T.all ? 1 : ramp(t, T.kiss + 2.8, T.kiss + 4.2);
        foldTar(F); placeStar(14 * (1 - smooth(ramp(t, T.kiss + .4, T.kiss + 3.2))));
        tarIdx.forEach((i, r) => { const s = tarStem(r), j = kisPartner[i]; bond(i, tarPos[r], tarBase[r], tarTips[r], s >= 0 ? clamp(F - s) : j >= 0 ? kiss : 0); });
        starIdx.forEach((i, r) => { const j = kisPartner[i]; bond(i, starPos[r], starBase[r], starTips[r], j >= 0 && kis[j].chain === 'B' ? 1 : j >= 0 ? kiss : 0); });
        if (tarShown > .001) { tar.pose(tarPos, tarTips); tar.view(pxPerA); }
        if (starShown > .001) { star.pose(starPos, starTips); star.view(pxPerA); }
        tar.opacity(clamp(tarShown)); star.opacity(clamp(starShown));
        at.fold = F; at.kiss = kiss;

        // Atom by atom, each strand's sugars and phosphates lean to its colour, and the RNA's 2′ hydroxyls swell a little.
        const oh = ramp(t, T.hybrid + 8.8, T.hybrid + 9.8) * (1 - ramp(t, T.all - .8, T.all));
        for (const k of hydroxyls) atoms.shown[k] = 1 + .6 * oh;
        atoms.showHbonds(1); if (atomsShown > .001) atoms.update();
        const key = oh.toFixed(2);
        if (key !== lastTint) {
          lastTint = key; atoms.untint();
          atoms.tint(backbones.rna, CARBON.rna, .55); atoms.tint(backbones.dna, CARBON.dna, .55); atoms.tint(hydroxyls, HYDROXYL, .8 * oh);
        }
        atoms.opacity(atomsShown); plates.opacity(atomsShown);
        cartoon.opacity(simple); cartoon.view(pxPerA);
      },
      annotate(t, {label, tag}) {
        const W = (d, k, i) => dnaGroup.localToWorld((k ? d.world.bBackbone : d.world.aBackbone)[i].clone());
        const across = i => W(strands[0], 0, i).lerp(W(strands[1], 1, i), .5);
        const below = HOME.dna.clone().add(V(-8, 33, 0));  // heating and cooling named under the duplex
        if (t < T.renature) {
          if (t > 1.4 && t < 3.4) label(across(9), 'DNA duplex', 'Two strands held by base pairs', {color: hex(DNA[0])});
          if (t > 3.4 && t < 11) tag(below, 'Heated', {color: hex(HEAT)});
          // The A–T pairs as they part, then the G–C pairs holding, one label at a time.
          if (t > 4.4 && t < 7) label(W(strands[0], 0, 2), 'A–T pairs part first', 'Two hydrogen bonds each', {color: hex(AT)});
          else if (t > 7.2 && t < 9.4) label(across(7), 'G–C pairs hold longer', 'Three hydrogen bonds each', {color: hex(GC)});
          if (t > 12.8) label(W(strands[0], 0, 11), 'Single strands', 'The duplex disrupted', {color: hex(DNA[0])});
        } else if (t < T.fold) {
          if (t > T.renature + .4 && t < T.renature + 7) tag(below, 'Cooled', {color: hex(COOL)});
          if (t > T.renature + .8 && t < T.renature + 3.2) label(W(strands[0], 0, 12), 'Complementary strands', 'Coming together again', {color: hex(DNA[0])});
          else if (t > T.renature + 3.6 && t < T.renature + 7.6) label(across(13), 'Base pairs re-form', 'A with T, G with C', {color: hex(STRANDS.rung.coding)});
          else if (t > T.renature + 8) label(across(10), 'Duplex re-formed', 'Renaturation', {color: hex(DNA[0])});
        } else if (t < T.kiss) {
          if (t > T.fold + 1.6 && t < T.fold + 4.4) label(rnaWorld(tarPos[7]), 'Single-stranded RNA', 'One strand', {color: hex(RNA)});
          // One label at a time, so leaders never cross.
          if (t > T.fold + 7.8 && t < T.fold + 10.8) label(rnaWorld(tarPos[2].clone().lerp(tarPos[13], .5)), 'Intramolecular pairing', 'Bases paired within one RNA', {color: hex(RNA)});
          else if (t > T.fold + 11) label(rnaWorld(tarPos[8]), 'Unpaired loop', 'Its bases free to pair', {color: hex(RUNG.rna)});
        } else if (t < T.hybrid) {
          if (t > T.kiss + 1.2 && t < T.kiss + 4) label(rnaWorld(starPos[4]), 'A second RNA', 'Folded on itself too', {color: hex(RNA2)});
          else if (t > T.kiss + 4.6 && t < T.kiss + 8.6) label(loopPair(), 'Intermolecular pairing', 'Between two RNA molecules', {color: hex(RNA2)});
          else if (t > T.kiss + 8.8) label(rnaWorld(tarPos[2].clone().lerp(tarPos[13], .5)), 'Intramolecular pairing', 'Within each RNA', {color: hex(RNA), side: 'left'});
        } else if (t < T.all) {
          const A = k => hybWorld(atoms.positions[k]);
          if (t > T.hybrid + 2.4 && t < T.hybrid + 4.6) label(hybWorld(cartoon.world.aBackbone[2]), 'RNA strand', 'Paired with a DNA strand', {color: hex(RNA)});
          else if (t > T.hybrid + 4.8 && t < T.hybrid + 6.8) label(hybWorld(cartoon.world.bBackbone[7]), 'DNA strand', 'Paired with an RNA strand', {color: hex(DNA[0])});
          else if (t > T.hybrid + 9 && t < T.hybrid + 11.8) label(A(o2), '2′ hydroxyl', 'On each ribose of the RNA', {color: hex(HYDROXYL)});
          else if (t > T.hybrid + 12 && uracil >= 0) {
            label(hybWorld(atoms.centre(baseAtoms(uracil))), 'Uracil (U)', 'Pairs with A, in place of thymine', {color: hex(BASES.U)});
            tag(hybWorld(atoms.centre(baseAtoms(hp[uracil]))), 'A', {color: hex(BASES.A)});
          }
        } else if (t > T.all + 2) {
          // Each molecule named beside it, as captions: the duplex above, the others below.
          tag(HOME.dna.clone().add(V(-30, -18, 0)), 'DNA duplex', {color: hex(DNA[0])});
          tag(HOME.rna.clone().add(V(-26, 21, 0)), 'RNA with RNA', {color: hex(RNA)});
          tag(HOME.hybrid.clone().add(V(-36, 21, 0)), 'DNA–RNA heteroduplex', {color: hex(RNA)});
        }
      },
    };
  },
});
