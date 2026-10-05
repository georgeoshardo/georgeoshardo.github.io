// Scene: mutations change the sequence of DNA. A gene's double helix (ideal B-DNA) with one base pair changed; how
// rare that is in bacteria; then a point mutation atom by atom, as the notes' figure shows it: nitrous acid turns a
// cytosine into uracil, which pairs with adenine at replication, so one daughter is mutant and the other wild type;
// at the next replication the adenine pairs with thymine, and a G–C pair has become A–T (a transition). The four
// bases then open into a square, purines on one side and pyrimidines on the other, with the transitions and
// transversions between them. The nucleotides are those of the B-DNA crystal structure 355D (C3–G22 and T7–A18),
// each given its hydrogens and full phosphate group from the dictionary's ideal molecule, fitted piece by piece.
import * as THREE from 'three';
import {runScene} from '../shared/scene_player.mjs';
import {loadSurfaceSet, baseMaterial, fade} from '../shared/molecules.mjs';
import {BASES, STRANDS} from '../shared/strands.mjs';
import {createAtoms, createPlates, ELEMENTS, isPurine} from '../shared/atoms.mjs';
import {pairsFromStrands, frameFromPairs, meanLocal, sequencePairs, helixFrames, createDuplex} from '../shared/dna.mjs';
import {fitRigid} from '../shared/fit.mjs';
import {ramp, smooth} from '../shared/ease.mjs';

const V = (...a) => new THREE.Vector3(...a);
const hex = c => '#' + c.toString(16).padStart(6, '0');
const T = {rare: 11, base: 22, copy: 36, transition: 49, types: 62, end: 78};
// The gene's colour (as the hub marks one), a changed base pair, the classes of base (as the double helix page draws
// them), the mutagen, and the two kinds of point mutation.
const GENE = 0xf0c060, CHANGE = 0xff8a6a, PURINE = 0xeeb45a, PYRIMIDINE = 0x8fb4ff, MUTAGEN = 0xf6d27a;
const TRANSITION = 0x8fdcc6, TRANSVERSION = 0xf28b7c;
// The duplex of the first two steps: N pairs along x, pair M (a C–G, then T–A) at the origin, the gene from GENE_START
// to the end. It is short enough to show whole in the free part of the screen, clear of the step list and narration.
const N = 36, M = 18, GENE_START = 7, SPAN = (N - 1) * 3.38;
const SEQ = Array.from({length: N}, (_, i) => i === M ? 'C' : 'ACGT'[(i * 7 + (i >> 2) + (i >> 3)) % 4]).join('');
// Where the pairs sit once replicated: the mutant daughter above (−y is up), the wild type below; and the half-width of
// the square the four bases then open into.
const DAUGHTER = 9, SQUARE = 8.5;
const RING = ['N1', 'C2', 'N3', 'C4', 'C5', 'C6'];
const PURINE_RING = ['N1', 'C2', 'N3', 'C4', 'C5', 'C6', 'N7', 'C8', 'N9'];

const NOTES = 'mutations-change-the-sequence-of-dna', POINT = 'mutations-can-affect-single-base-pairs-or-long-sequences';
const steps = [
  {t: 0, nav: 'A changed sequence', title: 'Mutations change<br>the sequence of DNA.', notes: NOTES, hold: 1.1,
    text: 'Mutations provide decisive evidence that DNA is the genetic material. When a change in the sequence of DNA alters the sequence of a gene, the gene’s product, for example a protein, could be altered, and with it the phenotype of the organism.'},
  {t: T.rare, nav: 'Spontaneous, induced', title: 'Mutations are<br>rare events.', notes: NOTES, hold: 1.2,
    text: 'Spontaneous mutations arise from normal cellular operations or random interactions with the environment. Mutagens, such as radiation and chemicals, raise the rate: induced mutations. In bacteria, the rate is about 10⁻⁶ per locus, or 10⁻⁹–10⁻¹⁰ per base pair, per generation.'},
  {t: T.base, nav: 'A base modified', title: 'A chemical changes<br>one base into another.', notes: POINT, hold: 1.2,
    text: 'A point mutation changes only a single base pair. It can be caused by chemical modification of the DNA directly converting one base into another, as nitrous acid converts cytosine into uracil, or by an error during replication that inserts the wrong base.'},
  {t: T.copy, nav: 'Mutant and wild type', title: 'Replication copies<br>the change.', notes: POINT, hold: 1.1,
    text: 'At replication, uracil pairs with adenine. One daughter duplex is mutant, with a U–A pair; the other, copied from the strand with guanine, is wild type, with its C–G pair.'},
  {t: T.transition, nav: 'A transition', title: 'G–C becomes A–T:<br>a transition.', notes: POINT, hold: 1.2,
    text: 'At the next replication, the adenine pairs with thymine: a G–C pair has been replaced by an A–T pair. This is a transition, one pyrimidine converted into another and one purine into another, and it is the most common type of point mutation.'},
  {t: T.types, nav: 'Transversions', title: 'Transitions and<br>transversions.', notes: POINT, hold: 1.2,
    text: 'A transversion converts a pyrimidine into a purine, or vice versa, replacing an A–T pair with a T–A pair or a C–G pair. Transversions are less common. Purines have two rings and pyrimidines one.'},
];

// A nucleotide of the crystal (heavy atoms, B-DNA) with the atoms it lacks, its hydrogens and its terminal phosphate's
// third oxygen, from the dictionary's ideal molecule: each placed by fitting the ideal atoms within three bonds of it
// onto the crystal's. Bonds are the ideal molecule's.
function rebuild(crystal, r, ideal) {
  const C = crystal.atoms, have = new Map();
  C.name.forEach((n, k) => { if (C.residue[k] === r) have.set(n, V(...C.position[k])); });
  const I = ideal.atoms, names = I.name, home = I.position.map(p => V(...p)), near = names.map(() => []);
  for (const [i, j] of ideal.bonds) { near[i].push(j); near[j].push(i); }
  const position = names.map((n, i) => {
    if (have.has(n)) return have.get(n).clone();
    const seen = new Set([i]); let ring = [i];
    for (let depth = 0; depth < 3; depth++) { ring = ring.flatMap(k => near[k]).filter(k => !seen.has(k)); ring.forEach(k => seen.add(k)); }
    const ks = [...seen].filter(k => have.has(names[k]));
    return home[i].clone().applyMatrix4(fitRigid(ks.map(k => home[k]), ks.map(k => have.get(names[k]))));
  });
  return {atoms: {name: names.slice(), element: I.element.slice(), residue: names.map(() => 0), position: position.map(p => p.toArray())},
    bonds: ideal.bonds.map(b => b.slice()), hbonds: [], residues: [{chain: crystal.residues[r].chain, num: crystal.residues[r].num, letter: crystal.residues[r].letter}]};
}

const at = {};  // positions the camera shots read, and state for tests (?debug=1)

runScene({
  pageTitle: 'Mutations change the sequence of DNA · Genes are DNA', eyebrow: 'Mutations',
  links: [{href: 'index.html', text: 'All scenes'}],
  steps, duration: T.end, notesPage: 'notes.html', fov: 28, fog: .0005, loop: false,
  shots: [
    {t: 0, target: [SPAN / 2 - M * 3.38, 0, 0], dir: [.1, -.14, -1], box: [SPAN + 10, 46]},
    {t: T.rare, blend: 2.4, target: [SPAN / 2 - M * 3.38, 0, 0], dir: [-.1, -.1, -1], box: [SPAN + 10, 46]},
    // The base pair faces the viewer, alone.
    {t: T.base, blend: 2.8, target: [0, -1, 0], dir: [0, -.04, -1], box: [27, 23]},
    {t: T.copy, blend: 2.4, target: [0, 0, 0], dir: [0, -.03, -1], box: [30, 2 * DAUGHTER + 21]},
    // The square; on a phone a little right of centre, so the names of the arrows fit to its left.
    {t: T.types, blend: 2.4, frame: () => {
      const shift = innerWidth <= 600 ? 7 : 0;
      return {target: [-shift, 0, 0], dir: [0, -.03, -1], box: [2 * SQUARE + 22 + 2 * shift, 2 * SQUARE + 40]};
    }},
  ],
  async build({world, progress}) {
    const [helix, nucleotides] = await Promise.all([
      loadSurfaceSet('assets/helix.json', 'assets/helix.bin', p => progress(.7 * p)),
      loadSurfaceSet('assets/nucleotides.json', 'assets/nucleotides.bin', p => progress(.7 + .3 * p)),
    ]);

    // ---------- A gene's double helix (the first two steps) ----------
    const strand = n => helix.meta.strands.find(s => s.name === n);
    const crystalPairs = pairsFromStrands(strand('a'), strand('b')); frameFromPairs(crystalPairs);
    const local = meanLocal(crystalPairs.slice(1, -1));
    const duplex = createDuplex({pairs: sequencePairs(SEQ, local), samples: 3}); world.add(duplex.group);
    const tinted = (c, w) => new THREE.Color(c).lerp(new THREE.Color(GENE), w).getHex();
    duplex.segments(0, [[0, GENE_START, STRANDS.template], [GENE_START, N, tinted(STRANDS.template, .85)]]);
    duplex.segments(1, [[0, GENE_START, STRANDS.coding], [GENE_START, N, tinted(STRANDS.coding, .85)]]);
    duplex.pose(helixFrames(N, {origin: V(-M * 3.38, 0, 0), direction: V(1, 0, 0), reference: V(0, -1, 0)}));
    const rungColour = [0, 1].map(k => new THREE.Color(tinted(k ? STRANDS.rung.coding : STRANDS.rung.template, .85)).multiplyScalar(.8));
    const pairMid = i => duplex.world.aBackbone[i].clone().add(duplex.world.bBackbone[i]).multiplyScalar(.5);

    // ---------- The nucleotides, atom by atom ----------
    const crystal = helix.meta.atoms[0], ideal = Object.fromEntries(nucleotides.meta.atoms.map(g => [g.name, g]));
    const residue = (chain, num) => crystal.residues.findIndex(r => r.chain === chain && r.num === num);
    const DATA = {C: rebuild(crystal, residue('A', 3), ideal.dCMP), G: rebuild(crystal, residue('B', 22), ideal.dGMP),
      T: rebuild(crystal, residue('A', 7), ideal.dTMP), A: rebuild(crystal, residue('B', 18), ideal.dAMP)};
    const pos = (data, name) => V(...data.atoms.position[data.atoms.name.indexOf(name)]);
    const baseNames = letter => isPurine(letter) ? PURINE_RING : RING;
    const centroid = (data, names) => names.reduce((s, n) => s.add(pos(data, n)), V()).divideScalar(names.length);

    // A base pair's frame: C1′ to C1′ along x (strand 1 on the left), the bases above that line (−y is up), facing the
    // viewer. place() gives a nucleotide's pose there, about its base's centre, optionally fitted first (fit: crystal
    // to crystal) onto another residue's place.
    const pairFrame = (d1, d2) => {
      const c1 = pos(d1, "C1'"), c2 = pos(d2, "C1'"), mid = c1.clone().add(c2).multiplyScalar(.5), x = c2.clone().sub(c1).normalize();
      const up = centroid(d1, baseNames(d1.residues[0].letter)).add(centroid(d2, baseNames(d2.residues[0].letter))).multiplyScalar(.5).sub(mid);
      up.addScaledVector(x, -up.dot(x)).normalize();
      const y = up.negate(), z = x.clone().cross(y);
      const rot = new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().makeBasis(x, y, z)).invert();
      return {mid, rot};
    };
    const CG = pairFrame(DATA.C, DATA.G), TA = pairFrame(DATA.T, DATA.A);
    const onto = (from, to, names) => fitRigid(names.map(n => pos(from, n)), names.map(n => pos(to, n)));
    const C_ON_T = onto(DATA.C, DATA.T, [...RING, "C1'", 'O2']);
    const place = (inst, frame, slot, fit = null) => {
      const pivot = fit ? inst.pivot.clone().applyMatrix4(fit) : inst.pivot.clone();
      const q = frame.rot.clone(); if (fit) q.multiply(new THREE.Quaternion().setFromRotationMatrix(fit));
      return {p: pivot.sub(frame.mid).applyQuaternion(frame.rot).add(slot), q};
    };

    // A drawable nucleotide: an outer group holds its pose (about the base's centre), the inner one its atoms, in the
    // crystal's coordinates; plates colour its base by letter, then by class.
    const instance = (data, letter) => {
      const outer = new THREE.Group(), inner = new THREE.Group(); outer.add(inner); world.add(outer);
      const pivot = centroid(data, baseNames(data.residues[0].letter)); inner.position.copy(pivot).negate();
      const atoms = createAtoms(inner, data);
      const plates = createPlates(inner, atoms, {color: () => BASES[letter], opacity: .5});
      const classPlates = createPlates(inner, atoms, {color: () => isPurine(letter) ? PURINE : PYRIMIDINE, opacity: .55});
      const inst = {outer, inner, atoms, plates, classPlates, pivot, letter, shown: -1,
        pose({p, q}) { outer.position.copy(p); outer.quaternion.copy(q); },
        blend(a, b, w) { outer.position.lerpVectors(a.p, b.p, w); outer.quaternion.slerpQuaternions(a.q, b.q, w); },
        opacity(v) { if (v === inst.shown) return; inst.shown = v; atoms.opacity(v); },
        // World position of one of its atoms (by name), as drawn now.
        world(name) { const k = atoms.find(name); return inner.localToWorld(atoms.positions[k].clone()); },
        base() { const ks = atoms.select(k => atoms.part(k) === 'base' && atoms.elements[k] !== 'H'); return inner.localToWorld(atoms.centre(ks)); },
      };
      return inst;
    };

    // The cytosine that becomes uracil. Its amino nitrogen turns into uracil's oxygen (and moves to where that
    // oxygen sits, from the ideal UMP fitted on the ring), both amino hydrogens go and N3 gains one. The two bonds that
    // change order are drawn apart, in two groups of their own that trade places: C4=N3 and C4–N4 for cytosine,
    // C4–N3 and C4=O4 for uracil.
    const UMP = ideal.UMP, uFit = fitRigid(RING.map(n => pos(UMP, n)), RING.map(n => pos(DATA.C, n)));
    const O4 = pos(UMP, 'O4').applyMatrix4(uFit), H3 = pos(UMP, 'H3').applyMatrix4(uFit);
    const cData = structuredClone(DATA.C), name = cData.atoms.name, iOf = n => name.indexOf(n);
    const [kC4, kN3, kN4] = ['C4', 'N3', 'N4'].map(iOf);
    cData.bonds = cData.bonds.filter(([i, j]) => !([i, j].includes(kC4) && ([i, j].includes(kN3) || [i, j].includes(kN4))));
    name.push('H3'); cData.atoms.element.push('H'); cData.atoms.residue.push(0); cData.atoms.position.push(H3.toArray()); cData.bonds.push([kN3, name.length - 1, 1]);
    const cu = instance(cData, 'C');
    const uPlates = createPlates(cu.inner, cu.atoms, {color: () => BASES.U, opacity: .5});
    const ghostBonds = orders => {
      const data = {atoms: {name: ['C4', 'N3', 'X'], element: ['C', 'N', 'O'], residue: [0, 0, 0], position: [pos(DATA.C, 'C4'), pos(DATA.C, 'N3'), pos(DATA.C, 'N4')].map(p => p.toArray())},
        bonds: [[0, 1, orders[0]], [0, 2, orders[1]]], residues: [{letter: null}]};
      return createAtoms(cu.inner, data, {ghost: () => true});
    };
    const cBonds = ghostBonds([2, 1]), uBonds = ghostBonds([1, 2]);
    const amino = ['H41', 'H42'].map(n => cu.atoms.find(n)), kH3 = cu.atoms.find('H3'), kX = cu.atoms.find('N4');
    const N4 = pos(DATA.C, 'N4');

    const g = instance(DATA.G, 'G'), a = instance(DATA.A, 'A'), c = instance(DATA.C, 'C'), t = instance(DATA.T, 'T');
    const all = [cu, g, a, c, t];
    // Poses: the original pair at the centre; the daughters above (mutant) and below (wild type); the new nucleotides
    // come forward from behind their places, and the uracil leaves back into the distance, so nothing crosses the
    // page's text; and, for the square, the bases moved apart.
    const S0 = V(0, 0, 0), SM = V(0, -DAUGHTER, 0), SW = V(0, DAUGHTER, 0);
    // In the square each base turns flat to the viewer, at a corner: pyrimidines on the left, purines on the right.
    const flat = (inst, from, corner) => {
      const ring = baseNames(inst.letter).slice(0, 6).map(n => inst.atoms.home[inst.atoms.find(n)]);
      const n = ring[1].clone().sub(ring[0]).cross(ring[3].clone().sub(ring[0])).normalize().applyQuaternion(from.q);
      return {p: corner, q: new THREE.Quaternion().setFromUnitVectors(n, V(0, 0, Math.sign(n.z) || 1)).multiply(from.q)};
    };
    const P = {
      cu0: place(cu, CG, S0), cuM: place(cu, TA, SM, C_ON_T), cuGone: place(cu, TA, SM.clone().add(V(-5, -3, 24)), C_ON_T),
      g0: place(g, CG, S0), gW: place(g, CG, SW), aIn: place(a, TA, SM.clone().add(V(3, 0, 20))), aM: place(a, TA, SM),
      cIn: place(c, CG, SW.clone().add(V(-3, 0, 20))), cW: place(c, CG, SW), tIn: place(t, TA, SM.clone().add(V(-3, 0, 20))), tM: place(t, TA, SM),
    };
    Object.assign(P, {tSq: flat(t, P.tM, V(-SQUARE, -SQUARE, 0)), aSq: flat(a, P.aM, V(SQUARE, -SQUARE, 0)),
      cSq: flat(c, P.cW, V(-SQUARE, SQUARE, 0)), gSq: flat(g, P.gW, V(SQUARE, SQUARE, 0))});
    // Everything but each base, shrunk away for the square.
    const backbone = Object.fromEntries(all.map(i => [i.letter + (i === cu ? 'u' : ''), i.atoms.select(k => i.atoms.part(k) !== 'base')]));

    // Hydrogen bonds between paired nucleotides, drawn in world space: each a pair of ghost atoms following the two
    // atoms it joins.
    const HB = {
      cg0: [[cu, 'N4', g, 'O6'], [cu, 'N3', g, 'N1'], [cu, 'O2', g, 'N2']],
      ua: [[cu, 'N4', a, 'N6'], [cu, 'N3', a, 'N1']],
      cgW: [[c, 'N4', g, 'O6'], [c, 'N3', g, 'N1'], [c, 'O2', g, 'N2']],
      ta: [[t, 'O4', a, 'N6'], [t, 'N3', a, 'N1']],
    };
    const hbList = Object.entries(HB).flatMap(([set, list]) => list.map(x => ({set, x})));
    const hbData = {atoms: {name: hbList.flatMap(() => ['X', 'Y']), element: hbList.flatMap(() => ['N', 'N']), residue: hbList.flatMap(() => [0, 0]), position: hbList.flatMap(() => [[0, 0, 0], [0, 0, 0]])},
      bonds: [], hbonds: hbList.map((_, h) => [2 * h, 2 * h + 1]), residues: [{letter: null}]};
    const hbonds = createAtoms(world, hbData, {ghost: () => true});

    // The square's arrows: transitions within each class (a column), transversions between them, drawn outwards from
    // their middle; heads at both ends.
    const arrowMaterial = colour => baseMaterial(colour, {emissive: colour, emissiveIntensity: .35, roughness: .45});
    const arrow = (colour) => {
      const m = arrowMaterial(colour), group = new THREE.Group();
      const shaft = new THREE.Mesh(new THREE.CylinderGeometry(.2, .2, 1, 10), m), heads = [0, 1].map(() => new THREE.Mesh(new THREE.ConeGeometry(.62, 1.5, 16), m));
      group.add(shaft, ...heads); world.add(group); group.visible = false;
      return {group, material: m, set(from, to, drawn, shown) {
        group.visible = shown > .01 && drawn > .01; if (!group.visible) return;
        fade(m, shown);
        const d = to.clone().sub(from), len = d.length(), u = d.clone().divideScalar(len), mid = from.clone().add(to).multiplyScalar(.5), half = (len / 2 - .75) * drawn;
        shaft.position.copy(mid); shaft.quaternion.setFromUnitVectors(V(0, 1, 0), u); shaft.scale.set(1, Math.max(1e-3, 2 * half), 1);
        heads.forEach((h, k) => { const s = k ? 1 : -1; h.position.copy(mid).addScaledVector(u, s * (half + .45)); h.quaternion.setFromUnitVectors(V(0, 1, 0), u.clone().multiplyScalar(s)); h.visible = drawn > .95; });
      }};
    };
    const ARROWS = [
      {kind: 'transition', from: t, to: c}, {kind: 'transition', from: a, to: g},
      {kind: 'transversion', from: t, to: a}, {kind: 'transversion', from: c, to: g},
      {kind: 'transversion', from: t, to: g, z: -.9}, {kind: 'transversion', from: c, to: a, z: .9},
    ].map(x => ({...x, ...arrow(x.kind === 'transition' ? TRANSITION : TRANSVERSION)}));

    // Where the arrow ends sit: each base's centre, pulled in towards the other so the heads clear the atoms.
    const ends = x => {
      const p = x.from.base(), q = x.to.base(), d = q.clone().sub(p).normalize(), pad = i => (isPurine(i.letter) ? 3.6 : 3.1) * (Math.abs(d.x) > .9 ? 1 : 1.05);
      const z = V(0, 0, (x.z || 0) - 1.6);
      return [p.addScaledVector(d, pad(x.from)).add(z), q.addScaledVector(d, -pad(x.to)).add(z)];
    };

    let lastKey = '';
    return {
      duplex, all, at,  // for tests (?debug=1)
      update(time, {pxPerA = 1} = {}) {
        duplex.view(pxPerA);
        // The duplex, then the atoms (never both part-seen: the one waits for the other). The duplex has gone before
        // the camera has moved far, so it never grows across the page's text.
        const dna = ramp(time, .2, 1.3) * (1 - ramp(time, T.base - 1, T.base - .4));
        duplex.opacity(dna); duplex.group.visible = dna > .001;
        // The changed pair's bond in the changed colour.
        const mutated = ramp(time, 3.6, 4.6), key = mutated.toFixed(3);
        if (key !== lastKey) {
          lastKey = key; const col = new THREE.Color();
          duplex.rungs.forEach((r, k) => { r.setColorAt(M, col.copy(rungColour[k]).lerp(new THREE.Color(CHANGE), mutated)); r.instanceColor.needsUpdate = true; });
        }
        at.mutated = mutated;

        // ---------- Atoms ----------
        const shown = ramp(time, T.base + .4, T.base + 1.4);
        // The cytosine and guanine; the cytosine becomes uracil; they part at replication, and the uracil leaves at
        // the next.
        const leave = ramp(time, T.transition + .3, T.transition + 1.6);
        cu.opacity(shown * (1 - leave)); cu.outer.visible = shown * (1 - leave) > .001;
        g.opacity(shown); g.outer.visible = shown > .001;
        const part = smooth(ramp(time, T.copy + .3, T.copy + 2.4));
        if (leave > 0) cu.blend(P.cuM, P.cuGone, smooth(leave)); else cu.blend(P.cu0, P.cuM, part);
        const open = smooth(ramp(time, T.types + .9, T.types + 2.9)), shrink = ramp(time, T.types + .3, T.types + 1.3);
        if (open > 0) g.blend(P.gW, P.gSq, open); else g.blend(P.g0, P.gW, part);
        // The new nucleotides arrive: adenine opposite uracil and cytosine opposite guanine, then thymine opposite adenine.
        const come = smooth(ramp(time, T.copy + 1.8, T.copy + 4)), fresh = ramp(time, T.copy + 1.8, T.copy + 2.8);
        a.opacity(fresh); a.outer.visible = fresh > .001; c.opacity(fresh); c.outer.visible = fresh > .001;
        if (open > 0) { a.blend(P.aM, P.aSq, open); c.blend(P.cW, P.cSq, open); } else { a.blend(P.aIn, P.aM, come); c.blend(P.cIn, P.cW, come); }
        const tCome = smooth(ramp(time, T.transition + 1.6, T.transition + 3.6)), tFresh = ramp(time, T.transition + 1.6, T.transition + 2.6);
        t.opacity(tFresh); t.outer.visible = tFresh > .001;
        if (open > 0) t.blend(P.tM, P.tSq, open); else t.blend(P.tIn, P.tM, tCome);

        // Cytosine into uracil: the amino hydrogens go, the nitrogen becomes oxygen, N3 gains its hydrogen.
        const gone = ramp(time, T.base + 5.4, T.base + 6.4), turn = ramp(time, T.base + 5.9, T.base + 7.1), gain = ramp(time, T.base + 6.6, T.base + 7.6);
        cu.atoms.show(amino, 1 - gone); cu.atoms.show([kH3], gain);
        cu.atoms.positions[kX].lerpVectors(N4, O4, smooth(turn));
        for (const b of [cBonds, uBonds]) b.positions[2].copy(cu.atoms.positions[kX]);
        cBonds.showAll(1 - turn); uBonds.showAll(turn); cBonds.shown[2] = cBonds.shown[0]; cBonds.update(); uBonds.update();
        cBonds.opacity(shown * (1 - leave)); uBonds.opacity(shown * (1 - leave));
        // The square: sugars and phosphates shrink away, leaving the bases.
        for (const i of [g, a, c, t]) i.atoms.show(backbone[i.letter], 1 - shrink);
        for (const i of all) i.atoms.update();
        const tintKey = `${turn.toFixed(2)}`;
        if (cu.tintKey !== tintKey) { cu.tintKey = tintKey; cu.atoms.untint(); cu.atoms.tint([kX], ELEMENTS.O.color, turn); }

        // Plates: by letter, then (from the transition) by class.
        const byClass = ramp(time, T.transition + 2.6, T.transition + 3.6);
        cu.plates.opacity(shown * (1 - ramp(time, T.base + 5.4, T.base + 6.3))); uPlates.opacity(shown * (1 - leave) * ramp(time, T.base + 6.5, T.base + 7.4)); cu.classPlates.opacity(0);
        for (const i of [g, a, c, t]) { i.plates.opacity(i.shown * (1 - byClass)); i.classPlates.opacity(i.shown * byClass); }
        for (const i of all) { i.plates.update(); i.classPlates.update(); }
        uPlates.update();

        // Hydrogen bonds.
        const hbShown = {
          cg0: ramp(time, T.base + 1.4, T.base + 2.2) * (1 - ramp(time, T.base + 5.6, T.base + 6.6)),
          ua: ramp(time, T.copy + 3.6, T.copy + 4.4) * (1 - ramp(time, T.transition + .1, T.transition + .7)),
          cgW: ramp(time, T.copy + 3.6, T.copy + 4.4) * (1 - ramp(time, T.types + .1, T.types + .8)),
          ta: ramp(time, T.transition + 3.5, T.transition + 4.2) * (1 - ramp(time, T.types + .1, T.types + .8)),
        };
        hbList.forEach(({set, x: [i, n, j, m]}, h) => {
          hbonds.positions[2 * h].copy(i.world(n)); hbonds.positions[2 * h + 1].copy(j.world(m));
          hbonds.showHbonds(hbShown[set], k => k === h);
        });
        hbonds.update(); hbonds.group.visible = Object.values(hbShown).some(v => v > .001);

        // The square's arrows: transitions, then transversions.
        const drawn = {transition: smooth(ramp(time, T.types + 2.4, T.types + 3.6)), transversion: smooth(ramp(time, T.types + 5.2, T.types + 6.6))};
        for (const x of ARROWS) { const [p, q] = ends(x); x.set(p, q, drawn[x.kind], open); }
        at.arrows = drawn;
      },
      annotate(time, {label, tag}) {
        const col = c => ({color: hex(c)});
        if (time < T.base - 1) {
          // The gene and one of its pairs; the pair changes colour, then is named. In the second step, how often a
          // pair or a gene changes.
          const pair = pairMid(M), gene = duplex.world.aBackbone[N - 7];
          if (time < T.rare) {
            if (time > 1.6 && time < 3.4) tag(pair, 'C–G', col(BASES.C));
            if (time > 1.6) label(gene, 'A gene', 'A sequence of DNA', col(GENE));
            if (time > 4.6) label(duplex.world.bBackbone[M], 'Mutation', 'One base pair changed: C–G to T–A', {...col(CHANGE), below: true});
          } else if (time > T.rare + 1.6) {
            // (on a phone, at a pair further left, where the label has room beside it)
            label(duplex.world.bBackbone[innerWidth <= 600 ? M - 8 : M], 'Per base pair: 10⁻⁹–10⁻¹⁰', 'Mutations per generation, in bacteria', {...col(CHANGE), below: true});
            label(gene, 'Per locus: about 10⁻⁶', 'Mutations per generation, in bacteria', col(GENE));
          }
        } else if (time < T.base) {
          // (the duplex fades as the camera moves in)
        } else if (time < T.copy) {
          if (time > T.base + 1.8) tag(g.base(), 'G', col(BASES.G));
          if (time > T.base + 1.8 && time < T.base + 4.6) label(cu.base(), 'Cytosine', 'Paired with guanine', col(BASES.C));
          else if (time > T.base + 4.6 && time < T.base + 7.8) label(cu.world('N4'), 'Nitrous acid', 'A mutagen, modifying the base', col(MUTAGEN));
          else if (time > T.base + 8) label(cu.world('N4'), 'Uracil', 'O in place of cytosine’s NH₂', col(BASES.U));
        } else if (time < T.transition) {
          if (time > T.copy + 4.4) {
            tag(cu.base(), 'U', col(BASES.U)); tag(a.base(), 'A', col(BASES.A)); tag(c.base(), 'C', col(BASES.C)); tag(g.base(), 'G', col(BASES.G));
            label(a.world('N6'), 'Mutant', 'U pairs with A', col(CHANGE));
            label(g.world("C1'"), 'Wild type', 'C pairs with G', {...col(BASES.G), below: true});
          }
        } else if (time < T.types) {
          if (time > T.transition + 4.2) {
            tag(t.base(), 'T', col(PYRIMIDINE)); tag(a.base(), 'A', col(PURINE)); tag(c.base(), 'C', col(PYRIMIDINE)); tag(g.base(), 'G', col(PURINE));
            label(t.world('O4'), 'C → T', 'One pyrimidine for another', col(PYRIMIDINE));
            label(a.world('N6'), 'G → A', 'One purine for another', col(PURINE));
          }
        } else if (time > T.types + 2.4) {
          // Each base by its letter, just outside the square so its rings stay in view (above the top row, below the
          // bottom one); the two classes over their columns; the transitions and transversions named to the left of
          // the square, clear of the letters.
          const off = (i, dy) => i.base().add(V(0, dy, 0));
          tag(off(t, -4.3), 'T', col(PYRIMIDINE)); tag(off(a, -4.3), 'A', col(PURINE)); tag(off(c, 4.3), 'C', col(PYRIMIDINE)); tag(off(g, 4.3), 'G', col(PURINE));
          tag(t.base().add(V(-2.5, -8.6, 0)), 'Pyrimidines', col(PYRIMIDINE)); tag(a.base().add(V(-2.5, -8.6, 0)), 'Purines', col(PURINE));
          const along = (x, f) => { const [p, q] = ends(x); return p.lerp(q, f); };
          label(along(ARROWS[0], .3), 'Transitions', 'Most common: purine for purine, pyrimidine for pyrimidine', {...col(TRANSITION), side: 'left'});
          if (time > T.types + 6) label(along(ARROWS[3], .1), 'Transversions', 'Less common: purine for pyrimidine, or the reverse', {...col(TRANSVERSION), side: 'left', below: true});
        }
      },
    };
  },
});
