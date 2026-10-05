// Scene: genetic information can be provided by DNA or RNA. Four genomes side by side, as a table: double-stranded
// and single-stranded (columns), DNA and RNA (rows); DNA as ideal B-DNA (the mean base-pair geometry of 355D), RNA as
// an ideal A-form helix (the mean step of the RNA duplex in the poliovirus polymerase's elongation complex, 3OL6).
// Then a nucleotide of each, atom by atom: dTMP (from the Chemical Component Dictionary), and the same molecule with
// AMP's 2′-OH and uracil's H5 swapped in, so the two differ only there. Every cell's genome is double-stranded DNA
// (the other three step back). The central dogma: the double-stranded DNA and the single-stranded RNA move into it,
// a polypeptide below, the arrows of replication, transcription and translation drawn in turn. The dogma then steps
// aside for its two viral processes: RNA copied from RNA by an RNA-dependent RNA polymerase (poliovirus 3Dpol, 3OL6)
// and into DNA by a reverse transcriptase (HIV-1 RT, 4PQU), each enzyme still while its template screws through it
// along the ideal helix of its own crystal's nucleic acid (so its contacts keep their phase), the new strand made at
// its active site. Last, the dogma returns whole, RNA replication and reverse transcription added, nothing leaving
// the polypeptide.
import * as THREE from 'three';
import {runScene} from '../shared/scene_player.mjs';
import {loadSurfaceSet, surfaceGeometry, proteinMaterial, fadeObject, fade, baseMaterial} from '../shared/molecules.mjs';
import {pairsFromStrands, frameFromPairs, meanLocal, sequencePairs, helixFrames, createDuplex, RISE} from '../shared/dna.mjs';
import {createAtoms, createPlates, ELEMENTS, RINGS} from '../shared/atoms.mjs';
import {BASES, STRANDS} from '../shared/strands.mjs';
import {idealHelix} from '../shared/rna.mjs';
import {ramp, smooth, clamp} from '../shared/ease.mjs';

const V = (...a) => new THREE.Vector3(...a);
const hex = c => '#' + c.toString(16).padStart(6, '0');
const T = {chem: 11, cells: 23, dogma: 33, rdrp: 46, rt: 59, back: 72, end: 84};
// DNA's strands sky blue and ivory, RNA's orange and a paler orange, each base-pair bond half a shade of its strand.
const DNA = [STRANDS.template, STRANDS.coding], RNA = [STRANDS.rna, 0xffd3a6];
const DNA_RUNG = [STRANDS.rung.template, STRANDS.rung.coding], RNA_RUNG = [0xd08a55, 0xe3c29e];
const FLOW = 0xb3c1ca, BEAD = 0x8fc2a0, RDRP = 0xa48bd8, RTASE = 0x4fb3a6;
// Carbons of each nucleotide in its strand's colour, a shade lighter.
const CARBON = {dna: 0x86d2ec, rna: 0xffc08a};

// The table of genomes (steps 1–3): each molecule's centre, about 78 Å long, horizontal.
const LEN = 78, COLS = [-54, 54], ROWS = [-34, 34];
const KINDS = [
  {key: 'dsDNA', name: 'Double-stranded DNA', rna: false, strands: 2, at: V(COLS[0], ROWS[0], 0)},
  {key: 'ssDNA', name: 'Single-stranded DNA', rna: false, strands: 1, at: V(COLS[1], ROWS[0], 0)},
  {key: 'dsRNA', name: 'Double-stranded RNA', rna: true, strands: 2, at: V(COLS[0], ROWS[1], 0)},
  {key: 'ssRNA', name: 'Single-stranded RNA', rna: true, strands: 1, at: V(COLS[1], ROWS[1], 0)},
];
// The central dogma (steps 4 and 7): DNA above RNA above the polypeptide.
const DOGMA = {dna: -100, rna: 0, pep: 96};
// Where each enzyme works (steps 5 and 6, the central dogma put aside): the RNA-dependent RNA polymerase where the
// dogma's RNA was, the reverse transcriptase below it. Each is turned about its helix's axis (its centre towards FACE,
// chosen by eye) so that the view shows its nucleic acid passing through it: through the polymerase's closed hand,
// and along the reverse transcriptase's cleft.
const SPOT = {rdrp: V(0, -10, 0), rt: V(0, 150, 0)}, FACE = {rdrp: V(0, .6, .8), rt: V(0, .71, .71)};
// How fast each template moves through its enzyme (nucleotides a second).
const RATE = .6;

const NOTES = 'genetic-information-can-be-provided-by-dna-or-rna';
const steps = [
  {t: 0, nav: 'Four kinds of genome', title: 'A genome can be<br>DNA or RNA.', notes: NOTES, hold: 1.1,
    text: 'Genomes are not always duplex DNA. In some viruses, the genome is made up of double-stranded DNA, single-stranded DNA, double-stranded RNA or single-stranded RNA.'},
  {t: T.chem, nav: 'DNA or RNA', title: 'Deoxyribose and T,<br>or ribose and U.', notes: 'the-structure-of-nucleotides', hold: 1.1,
    text: 'DNA and RNA are named for the sugar in their backbone: DNA has a 2′-deoxyribose, RNA a ribose, with a hydroxyl group (-OH) on its 2′ carbon. In RNA, uracil (U) is found instead of thymine (T).'},
  {t: T.cells, nav: 'Cellular genomes', title: 'Every cell’s genome is<br>double-stranded DNA.', notes: NOTES, hold: 1.3,
    text: 'No cellular organism has been found to have a genome made of anything other than double-stranded DNA.'},
  {t: T.dogma, nav: 'The central dogma', title: 'DNA to RNA<br>to polypeptide.', notes: NOTES, hold: 1.1,
    text: 'RNA is synthesised by reading a DNA template in transcription, carried out by RNA polymerase; a polypeptide is synthesised by reading an RNA template in translation, carried out by the ribosome. These two processes, along with DNA replication, form the foundation of the central dogma.'},
  {t: T.rdrp, nav: 'RNA replication', title: 'RNA copied<br>from RNA.', notes: NOTES, hold: 1.2,
    text: 'Most RNA viruses replicate RNA from RNA using an RNA-dependent RNA polymerase. It reads an RNA template and makes the complementary RNA strand.'},
  {t: T.rt, nav: 'Reverse transcription', title: 'RNA copied<br>into DNA.', notes: NOTES, hold: 1.2,
    text: 'Retroviruses instead copy their RNA genome into DNA by reverse transcription, carried out by reverse transcriptase. It reads the RNA and makes a DNA strand paired with it.'},
  {t: T.back, nav: 'No way back', title: 'Nothing flows back<br>from polypeptide.', notes: NOTES, hold: 1.1,
    text: 'Information in nucleic acid can be perpetuated or transferred, but the transfer of information into a polypeptide is irreversible: it never passes from the polypeptide level back to nucleic acid.'},
];

const at = {};  // the scene's state, for tests (?debug=1)
// A shot of an enzyme at work: the enzyme and all of its nucleic acid, wherever its ends move while it is shown, with
// room above it for its name; nothing it shows passes behind the page's text or controls.
const enzymeShot = (e, dir) => ({target: V((e.frame.left + e.frame.right) / 2, (e.frame.top + e.frame.bottom) / 2, 0), dir,
  box: [e.frame.right - e.frame.left, e.frame.bottom - e.frame.top], fill: .95});
const TABLE = {target: [0, 0, 0], dir: [.05, -.1, -1], box: [220, 118], fill: .95};
const WHOLE = {target: [0, 6, 0], dir: [.06, -.08, -1], box: [236, 282], fill: .95};

runScene({
  pageTitle: 'DNA or RNA genomes · Genes are DNA', eyebrow: 'DNA or RNA',
  links: [{href: 'index.html', text: 'All scenes'}],
  steps, duration: T.end, notesPage: 'notes.html', fov: 28, fog: .00012, loop: false,
  shots: [
    {t: 0, ...TABLE},
    {t: T.chem, blend: 2.6, target: [5, 0, 0], dir: [.04, -.12, -1], box: [30, 29], fill: .92},
    {t: T.cells, blend: 2.6, ...TABLE},
    {t: T.dogma, blend: 2.8, ...WHOLE},
    // Each enzyme with its nucleic acid either side of it, room for the strands' names.
    {t: T.rdrp, blend: 2.8, frame: (t, c) => enzymeShot(c.rdrp, [.12, -.06, -1])},
    {t: T.rt, blend: 3, frame: (t, c) => enzymeShot(c.rtase, [-.12, -.2, -1])},
    {t: T.back, blend: 3, ...WHOLE},
  ],
  async build({world, progress}) {
    const [helix, nucleotides, set] = await Promise.all([loadSurfaceSet('assets/helix.json', 'assets/helix.bin'), loadSurfaceSet('assets/nucleotides.json', 'assets/nucleotides.bin'),
      loadSurfaceSet('assets/dna_or_rna.json', 'assets/dna_or_rna.bin', progress)]);
    // B-DNA: the mean base-pair geometry of the dodecamer 355D, on ideal frames.
    const hs = n => helix.meta.strands.find(s => s.name === n), crystal = pairsFromStrands(hs('a'), hs('b')); frameFromPairs(crystal);
    const localB = meanLocal(crystal.slice(1, -1));
    // Each enzyme's nucleic acid: its template (strand a, 5′→3′) paired with the strand it makes (b), pair 0 the
    // new strand's 3′ end at the active site; the pairs' mean geometry, and the ideal helix of their frames.
    const ss = (structure, name) => set.meta.strands.find(s => s.structure === structure && s.name === name);
    const crystalHelix = (structure, made) => {
      const pairs = pairsFromStrands(ss(structure, 'template'), ss(structure, made)), frames = frameFromPairs(pairs);
      return {pairs, local: meanLocal(pairs.slice(1, -1)), helix: idealHelix(frames, 1, frames.length - 1)};
    };
    const rd = crystalHelix('rdrp', 'product'), rt = crystalHelix('rt', 'primer');
    at.helices = {rna: {rise: rd.helix.rise, twist: THREE.MathUtils.radToDeg(rd.helix.twist)}, hybrid: {rise: rt.helix.rise, twist: THREE.MathUtils.radToDeg(rt.helix.twist)}};

    // ---------- The table of genomes ----------
    // Each molecule's frames centred on the origin along +x (pair 0 on the left), moved by `move`.
    const nRNA = Math.round(LEN / rd.helix.rise) + 1, nDNA = Math.round(LEN / RISE) + 1;
    const alongX = rd.helix.place(V(1, 0, 0), V(-(nRNA - 1) / 2 * rd.helix.rise, 0, 0), V(0, -1, 0));
    const baseFrames = kind => kind.rna
      ? Array.from({length: nRNA}, (_, i) => rd.helix.frame(i, alongX))
      : helixFrames(nDNA, {origin: V(-(nDNA - 1) / 2 * RISE, 0, 0), direction: V(1, 0, 0), reference: V(0, -1, 0)});
    const genomes = KINDS.map(kind => {
      const n = kind.rna ? nRNA : nDNA, colours = kind.rna ? RNA : DNA;
      const d = createDuplex({pairs: sequencePairs('A'.repeat(n), kind.rna ? rd.local : localB), template: colours[0], coding: colours[1], rung: kind.rna ? RNA_RUNG : DNA_RUNG, widths: [1, 1], samples: 3});
      if (kind.strands === 1) d.pieces(1, []);
      world.add(d.group);
      const base = baseFrames(kind), frames = base.map(f => ({origin: f.origin.clone(), q: f.q.clone()}));
      const g = {kind, d, n, base, frames, pos: V(NaN), shown: -1, tone: -1,
        place(p) { if (p.equals(g.pos)) return; g.pos.copy(p); frames.forEach((f, i) => f.origin.copy(base[i].origin).add(p)); d.pose(frames); },
        opacity(v) { if (v === g.shown) return; g.shown = v; d.opacity(v); },
        dim(k) { if (k === g.tone || Math.abs(k - g.tone) < .004 && k !== 1) return; g.tone = k; tone(d.group, k); },
        point: (i, k = 0) => (k ? d.world.bBackbone : d.world.aBackbone)[Math.max(0, Math.min(n - 1, i))],
      };
      return g;
    });
    const G = Object.fromEntries(genomes.map(g => [g.kind.key, g]));
    at.genomes = genomes.map(g => ({key: g.kind.key, strands: g.kind.strands, sugar: g.kind.rna ? 'ribose' : 'deoxyribose', base: g.kind.rna ? 'U' : 'T', length: g.n}));

    // ---------- A nucleotide of each, atom by atom ----------
    // Both in dTMP's frame, one above the other (DNA above): phosphate to the left, base to the right, sugar below.
    const N = Object.fromEntries(nucleotides.meta.atoms.map(g => [g.name, g]));
    const pos = (g, name) => V(...g.atoms.position[g.atoms.name.indexOf(name)]);
    const mean = (g, names) => names.reduce((s, n) => s.add(pos(g, n)), V()).divideScalar(names.length);
    const dT = N.dTMP, P0 = pos(dT, 'P'), sugar0 = mean(dT, RINGS.sugar[0]), base0 = mean(dT, RINGS.pyrimidine[0]);
    const xAxis = base0.clone().sub(P0).normalize(), upRaw = P0.clone().add(base0).multiplyScalar(.5).sub(sugar0), up = upRaw.addScaledVector(xAxis, -upRaw.dot(xAxis)).normalize();
    const qn = new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().makeBasis(V(1, 0, 0), V(0, -1, 0), V(0, 0, -1)).multiply(new THREE.Matrix4().makeBasis(xAxis, up, xAxis.clone().cross(up)).transpose()));
    const centre = P0.clone().add(base0).add(sugar0).divideScalar(3);
    const holder = y => {
      const inner = new THREE.Group(); inner.quaternion.copy(qn); inner.position.copy(centre).applyQuaternion(qn).negate().add(V(0, y, 0));
      world.add(inner); return inner;
    };
    const hold = {dna: holder(-6.5), rna: holder(6.5)};
    // The RNA nucleotide is the same molecule with its two differences: the 2′ hydrogen nearest AMP's 2′-OH swapped for
    // that hydroxyl, and the methyl group for uracil's H5 (from UMP, superposed on dT's base), each on a ghost carbon
    // that bonds it to the carbon drawn beneath; so the two differ only there.
    const named = (g, list) => i => list.includes(g.atoms.name[i]);
    const o2 = pos(N.AMP, "O2'"), swapped = ["H2'", "H2''"].map(n => dT.atoms.name.indexOf(n)).sort((i, j) => V(...dT.atoms.position[i]).distanceTo(o2) - V(...dT.atoms.position[j]).distanceTo(o2))[0];
    const METHYL = ['C7', 'H71', 'H72', 'H73'];
    const nts = {dna: createAtoms(hold.dna, dT, {carbon: () => CARBON.dna}),
      rna: createAtoms(hold.rna, dT, {carbon: () => CARBON.rna, filter: i => i !== swapped && !METHYL.includes(dT.atoms.name[i])})};
    const swaps = [createAtoms(hold.rna, N.AMP, {carbon: () => CARBON.rna, filter: named(N.AMP, ["C2'", "O2'", "HO2'"]), ghost: named(N.AMP, ["C2'"])}),
      createAtoms(hold.rna, N.UMP, {filter: named(N.UMP, ['C5', 'H5']), ghost: named(N.UMP, ['C5'])})];
    const rings = Object.fromEntries(Object.entries(nts).map(([k, a]) => [k, [
      createPlates(hold[k], a, {color: r => BASES[r.letter], opacity: .5}),
      createPlates(hold[k], a, {kinds: ['sugar'], color: () => k === 'dna' ? DNA[0] : RNA[0], opacity: .38}),
    ]]));
    world.updateMatrixWorld(true);
    const atomAt = (k, name, a = nts[k]) => hold[k].localToWorld(a.positions[a.find(name)].clone());
    const ringAt = k => RINGS.pyrimidine[0].reduce((s, n) => s.add(atomAt(k, n)), V()).divideScalar(6);
    const chem = {dna: {c2: atomAt('dna', "C2'"), mark: atomAt('dna', 'C7'), base: ringAt('dna')}, rna: {c2: atomAt('rna', "O2'", swaps[0]), mark: atomAt('rna', 'H5', swaps[1]), base: ringAt('rna')}};
    const has = (list, name) => list.some(a => a.names.includes(name));
    at.nucleotides = {dna: {hydroxyl2: has([nts.dna], "O2'"), methyl: has([nts.dna], 'C7')}, rna: {hydroxyl2: has([nts.rna, ...swaps], "O2'"), methyl: has([nts.rna, ...swaps], 'C7')}};

    // ---------- The central dogma ----------
    const flowMaterial = baseMaterial(FLOW, {emissive: FLOW, emissiveIntensity: .3, roughness: .5});
    const arrow = (points, dotted = false) => createArrow(world, new THREE.CubicBezierCurve3(...points.map(p => V(...p, 0))), flowMaterial, dotted);
    const D = DOGMA.dna, R = DOGMA.rna, P = DOGMA.pep;
    const loop = y => [[-47, y - 7], [-100, y - 34], [-100, y + 34], [-47, y + 7]];
    const arrows = {
      replication: arrow(loop(D)), rnaReplication: arrow(loop(R)),
      transcription: arrow([[0, D + 16], [0, D + 40], [0, R - 40], [0, R - 15]]),
      translation: arrow([[0, R + 15], [0, R + 40], [0, P - 30], [0, P - 8]]),
      reverse: arrow([[48, R], [104, R], [104, D], [50, D]], true),
    };
    // The polypeptide: a chain of beads, made one after another as translation is drawn.
    const BEADS = 14, beadGap = 5.6, beadR = 3.3;
    const beadMaterial = baseMaterial(BEAD, {emissive: BEAD, emissiveIntensity: .12, roughness: .5});
    const beads = new THREE.InstancedMesh(new THREE.SphereGeometry(1, 20, 14), beadMaterial, BEADS);
    beads.frustumCulled = false; world.add(beads);
    const beadAt = k => V((k - (BEADS - 1) / 2) * beadGap, P + (k % 2 ? -2 : 2), k % 2 ? 1.2 : -1.2);
    const dummy = new THREE.Object3D();
    let beadsShown = -1, flowShown = -1;

    // ---------- The two enzymes at work ----------
    // Each enzyme is still; its template screws through it along the ideal helix of its crystal's nucleic acid, pair x
    // (0 at the active site) at the helix's frame x, the new strand drawn wherever x ≥ 0. Placed with the helix axis
    // across the view, the enzyme turned about it towards `face`, its centre at the spot. Its RNA is a short molecule:
    // `ahead` pairs of template beyond the enzyme where it enters and `behind` pairs of new duplex where it leaves, so
    // both ends stay in view as the template is used up and the new duplex grows, shown from `from` to `to` (s).
    const travel = (t, from) => { const u = Math.max(0, t - from); return RATE * (u < 1 ? u * u * u - u * u * u * u / 2 : u - .5); };
    const enzyme = (c, name, colour, spot, face, dir, made, {ahead, behind, from, to}) => {
      const record = set.byName.get(name), geometry = surfaceGeometry(record, set.buffer), group = new THREE.Group();
      group.add(new THREE.Mesh(geometry, proteinMaterial(colour))); world.add(group);
      const place = c.helix.place(dir, V(), face, V(...record.center));
      place.p.copy(spot).sub(V(...record.center).applyQuaternion(place.q));
      group.quaternion.copy(place.q); group.position.copy(place.p);
      // The enzyme's extent: its highest point (where its name is pinned, so the name sits above it), its lowest, its
      // reach along the helix axis (world x) and how far it reaches round the nucleic acid.
      group.updateMatrixWorld(true);
      const vs = geometry.attributes.position, v = V(), top = V(0, Infinity, 0), axisAt = c.helix.frame(0, place).origin, surface = [];
      let low = -Infinity, left = Infinity, right = -Infinity, wide = [Infinity, -Infinity];
      for (let i = 0; i < vs.count; i++) {
        v.fromBufferAttribute(vs, i).applyMatrix4(group.matrixWorld);
        if (v.y < top.y) top.copy(v); low = Math.max(low, v.y); wide = [Math.min(wide[0], v.x), Math.max(wide[1], v.x)];
        if (Math.hypot(v.y - axisAt.y, v.z - axisAt.z) < 16) { left = Math.min(left, v.x); right = Math.max(right, v.x); }
        if (i % 24 === 0) surface.push(v.toArray());
      }
      // Its edges along the axis in pairs from the active site (where the template enters, −, and the new strand
      // leaves, +), and so the RNA's length: pair 0 is the template's 5′ end, pair n − 1 the new duplex's far end.
      const pairAt = X => (X - axisAt.x) / (dir.x * c.helix.rise), edgeIn = pairAt(dir.x > 0 ? left : right), edgeOut = pairAt(dir.x > 0 ? right : left);
      const J0 = Math.ceil(-edgeIn) + ahead, n = J0 + Math.ceil(edgeOut) + behind + 1, start = from + 1.5, sEnd = travel(to + .9, start);
      const d = createDuplex({pairs: sequencePairs('A'.repeat(n), c.local), template: RNA[0], coding: made.colour, rung: [RNA_RUNG[0], made.rung], widths: [1, 1], samples: 3});
      world.add(d.group);
      const frames = Array.from({length: n}, () => ({origin: V(), q: new THREE.Quaternion()}));
      // The frame of the shot: the template's end where it starts, the new duplex's end where it stops, the enzyme,
      // and room above it for its name.
      const endAt = x => axisAt.x + dir.x * c.helix.rise * x, xs = [endAt(-J0), endAt(n - 1 - J0 + sEnd), ...wide];
      // Where each strand is named, just above it beside the enzyme: the template where it enters, the new strand where
      // it leaves. A name reads rightwards from its point, so on the left it starts well clear of the enzyme.
      const beside = side => V(side > 0 ? right + 6 : left - 36, axisAt.y - 15, axisAt.z);
      const e = {group, d, frames, place, centre: spot.clone(), top, n, from, to, shown: -1, s: NaN, made: 0, drawnFrom: 0,
        frame: {left: Math.min(...xs) - 4, right: Math.max(...xs) + 4, top: top.y - 34, bottom: low + 8},
        ahead: beside(-dir.x), behind: beside(dir.x), over: V(left, top.y - 5, axisAt.z),
        pose(s) {
          if (s === e.s) return; e.s = s;
          for (let j = 0; j < n; j++) c.helix.frame(j - J0 + s, place, frames[j]);
          e.drawnFrom = Math.max(0, Math.ceil(J0 - s - 1e-6)); e.made = n - e.drawnFrom;
          d.pieces(1, [[e.drawnFrom, n]]); d.pose(frames);
        },
        update(t, pxPerA) {
          const w = ramp(t, from, from + 1.1) * (1 - ramp(t, to, to + .9));
          if (w !== e.shown) { e.shown = w; fadeObject(group, w); d.opacity(w); }
          if (w > 0) { e.pose(travel(t, start)); d.view(pxPerA); }
        },
        // Everything it shows (world points), for tests.
        extent: () => [...surface, ...d.world.aBackbone.map(p => p.toArray()), ...d.world.bBackbone.slice(e.drawnFrom).map(p => p.toArray())],
      };
      e.pose(0);
      return e;
    };
    // Each shown while the camera is on it.
    const rdrp = enzyme(rd, 'RNA-dependent RNA polymerase', RDRP, SPOT.rdrp, FACE.rdrp, V(-1, 0, 0), {colour: RNA[1], rung: RNA_RUNG[1]},
      {ahead: 16, behind: 13, from: T.rdrp - .3, to: T.rt - 1.1});
    const rtase = enzyme(rt, 'Reverse transcriptase', RTASE, SPOT.rt, FACE.rt, V(1, 0, 0), {colour: DNA[0], rung: DNA_RUNG[0]},
      {ahead: 20, behind: 9, from: T.rt - .1, to: T.back - 1.2});

    // Everything the step at t shows, as lists of world points by name (for tests: all on screen and clear of the page's
    // text and controls): each molecule's backbones, atoms, beads, drawn arrows and the enzymes' surfaces.
    const strands = g => [...g.d.world.aBackbone, ...(g.kind.strands === 2 ? g.d.world.bBackbone : [])].map(p => p.toArray());
    const extent = t => {
      if (t < T.chem || t >= T.cells && t < T.dogma) return Object.fromEntries(genomes.map(g => [g.kind.key, strands(g)]));
      if (t < T.cells) return Object.fromEntries(['dna', 'rna'].map(k => [k, [nts[k], ...(k === 'rna' ? swaps : [])].flatMap(a => a.positions.map(p => hold[k].localToWorld(p.clone()).toArray()))]));
      if (t < T.rdrp || t >= T.back) return {DNA: strands(G.dsDNA), RNA: strands(G.ssRNA), polypeptide: Array.from({length: BEADS}, (_, k) => beadAt(k).toArray()),
        ...Object.fromEntries(Object.entries(arrows).filter(([, a]) => a.drawn > .98).map(([k, a]) => [k, a.curve.getPoints(24).map(p => p.toArray())]))};
      return {[t < T.rt ? 'rdrp' : 'rt']: (t < T.rt ? rdrp : rtase).extent()};
    };

    return {
      genomes: G, rdrp, rtase, at, extent,  // for tests (?debug=1)
      update(t, {pxPerA = 1} = {}) {
        // The table: all four, then (the nucleotides shown) none, then all four; the double-stranded DNA and the
        // single-stranded RNA move into the central dogma and the other two leave.
        const table = 1 - ramp(t, T.chem - .5, T.chem + .6) + ramp(t, T.cells - .3, T.cells + .8), leave = 1 - ramp(t, T.dogma, T.dogma + 1);
        const move = smooth(ramp(t, T.dogma + .5, T.dogma + 2.7));
        const dim = 1 - .78 * ramp(t, T.cells + 1.4, T.cells + 2.4) * (1 - ramp(t, T.dogma - .8, T.dogma));
        // The central dogma steps aside while the two enzymes are shown, and returns.
        const dogma = 1 - ramp(t, T.rdrp - 1.2, T.rdrp - .2) + ramp(t, T.back - .2, T.back + .9);
        for (const g of genomes) {
          const stays = g === G.dsDNA || g === G.ssRNA;
          const to = g === G.dsDNA ? V(0, D, 0) : g === G.ssRNA ? V(0, R, 0) : g.kind.at;
          g.place(g.kind.at.clone().lerp(to, stays ? move : 0));
          g.opacity(table * (stays ? dogma : leave)); g.dim(g === G.dsDNA ? 1 : dim); g.d.view(pxPerA);
        }
        if (dogma !== flowShown) { flowShown = dogma; fade(flowMaterial, dogma); fade(beadMaterial, dogma); }
        // The nucleotides, while the table is away.
        const n = ramp(t, T.chem + .2, T.chem + 1.3) * (1 - ramp(t, T.cells - .9, T.cells + .1));
        for (const k of ['dna', 'rna']) { nts[k].opacity(n); for (const p of rings[k]) p.opacity(n); }
        for (const a of swaps) a.opacity(n);
        // The dogma's arrows, drawn in turn: replication, transcription, translation; RNA replication and reverse
        // transcription as their enzymes are shown.
        arrows.replication.set(ramp(t, T.dogma + 2.2, T.dogma + 3.4));
        arrows.transcription.set(ramp(t, T.dogma + 2.8, T.dogma + 4));
        arrows.translation.set(ramp(t, T.dogma + 3.6, T.dogma + 4.8));
        arrows.rnaReplication.set(ramp(t, T.back + 1.2, T.back + 2.4));
        arrows.reverse.set(ramp(t, T.back + 1.8, T.back + 3.4));
        const grown = clamp((t - T.dogma - 4.2) / 2.2);
        if (grown !== beadsShown) {
          beadsShown = grown;
          for (let k = 0; k < BEADS; k++) { const s = smooth(grown * (BEADS + 1) - k); dummy.position.copy(beadAt(k)); dummy.scale.setScalar(Math.max(1e-4, beadR * s)); dummy.updateMatrix(); beads.setMatrixAt(k, dummy.matrix); }
          beads.instanceMatrix.needsUpdate = true;
        }
        beads.visible = grown > 0 && dogma > .01;
        rdrp.update(t, pxPerA); rtase.update(t, pxPerA);
        at.made = {rdrp: rdrp.made, rt: rtase.made}; at.moved = {dsDNA: G.dsDNA.pos.toArray(), ssRNA: G.ssRNA.pos.toArray()};
      },
      annotate(t, {label, tag}) {
        const phone = innerWidth <= 600, colourOf = g => hex(g.kind.rna ? RNA[0] : DNA[0]);
        // Each process named beside its arrow.
        const PROCESS = {replication: ['Replication', V(-92, D + 25, 0)], rnaReplication: ['RNA replication', V(-92, R + 25, 0)],
          transcription: ['Transcription', V(6, D + 36, 0)], translation: ['Translation', V(6, R + 56, 0)], reverse: ['Reverse transcription', V(90, R - 30, 0)]};
        const processTags = keys => { for (const k of keys) tag(PROCESS[k][1], PROCESS[k][0]); };
        const nameTag = (g, text = g.kind.name, colour = colourOf(g)) => tag(g.pos.clone().add(V(-LEN / 2 + 3, -16, 0)), text, {color: colour});
        if (t < T.chem - .4) {
          if (t > 1.2) for (const g of genomes) nameTag(g);
          if (t > 3.6) {
            label(G.dsDNA.point(17), 'Two strands', 'Joined by base pairs', {color: hex(DNA[0])});
            label(G.ssRNA.point(Math.round(nRNA * .7)), 'One strand', 'No partner strand', {color: hex(RNA[0]), below: true});
          }
        } else if (t < T.cells) {
          if (t > T.chem + 2.2) {
            label(chem.dna.c2, '2′-deoxyribose · DNA', 'No oxygen on the 2′ carbon', {color: hex(DNA[0]), side: 'left', priority: 2});
            label(chem.rna.c2, 'Ribose · RNA', 'A hydroxyl on the 2′ carbon', {color: hex(ELEMENTS.O.color), side: 'left', below: true, priority: 2});
            label(chem.dna.mark, 'Thymine (T) · DNA', 'A methyl group on its ring', {color: hex(BASES.T), side: 'right'});
            label(chem.rna.mark, 'Uracil (U) · RNA', 'No methyl group on its ring', {color: hex(BASES.U), side: 'right', below: true});
            // Phones show two callouts, the sugars': the bases are named by their letters.
            if (phone) { tag(chem.dna.base, 'T', {color: hex(BASES.T)}); tag(chem.rna.base, 'U', {color: hex(BASES.U)}); }
          }
        } else if (t < T.dogma - .4) {
          if (t > T.cells + 1) for (const g of genomes) nameTag(g, g.kind.name, g === G.dsDNA ? colourOf(g) : '#8e9ea8');
          if (t > T.cells + 2.4) label(G.dsDNA.point(8), 'Every cellular genome', 'Double-stranded DNA', {color: hex(DNA[0]), priority: 2});
        } else if (t < T.rdrp - .6) {
          if (t > T.dogma + 3) { tag(V(-12, D - 20, 0), 'DNA', {color: hex(DNA[0])}); tag(V(-24, R - 18, 0), 'RNA', {color: hex(RNA[0])}); }
          if (t > T.dogma + 5.2) {
            tag(V(-20, P + 11, 0), 'Polypeptide', {color: hex(BEAD)});
            // (Phones, which show two callouts and titles only, name all three processes as tags.)
            if (phone) processTags(['replication', 'transcription', 'translation']);
            else {
              label(arrows.replication.mid, 'Replication', 'DNA polymerase', {color: '#dfe7ea', side: 'left', below: true});
              label(arrows.transcription.mid, 'Transcription', 'RNA polymerase reads DNA', {color: '#dfe7ea', side: 'right', below: true});
              label(arrows.translation.mid, 'Translation', 'The ribosome reads RNA', {color: '#dfe7ea', side: 'right', below: true});
            }
          }
        } else if (t < T.rt - .6) {
          if (t > T.rdrp + 2.6) {
            // (A phone's callouts are too narrow for the enzymes' names: there they are tags.)
            if (phone) tag(rdrp.over, 'RNA-dependent RNA polymerase', {color: hex(RDRP)});
            else label(rdrp.top, 'RNA-dependent RNA polymerase', 'Of poliovirus', {color: hex(RDRP), side: 'right'});
            tag(rdrp.ahead, 'RNA template', {color: hex(RNA[0])}); tag(rdrp.behind, 'New RNA', {color: hex(RNA[1])});
          }
        } else if (t < T.back - .6) {
          if (t > T.rt + 2.6) {
            if (phone) tag(rtase.over, 'Reverse transcriptase', {color: hex(RTASE)});
            else label(rtase.top, 'Reverse transcriptase', 'Of HIV-1, a retrovirus', {color: hex(RTASE), side: 'right'});
            tag(rtase.ahead, 'RNA genome', {color: hex(RNA[0])}); tag(rtase.behind, 'New DNA', {color: hex(DNA[0])});
          }
        } else if (t > T.back + 3.6) {
          // (On a phone, the molecules named in step 4 leave room for the processes' names.)
          if (!phone) { tag(V(-12, D - 20, 0), 'DNA', {color: hex(DNA[0])}); tag(V(-24, R - 18, 0), 'RNA', {color: hex(RNA[0])}); tag(V(-20, P + 11, 0), 'Polypeptide', {color: hex(BEAD)}); }
          processTags(['replication', 'rnaReplication', 'transcription', 'reverse', 'translation']);
          label(beadAt(BEADS / 2).add(V(0, beadR, 0)), 'No transfer back', 'From polypeptide to nucleic acid', {color: hex(BEAD), side: 'right', below: true, priority: 2});
        }
      },
    };
  },
});

// Darkens every lit material under an object to k of its own colour (1 its colour), for molecules that step back.
function tone(object, k) {
  object.traverse(o => {
    const m = o.material; if (!m?.isMeshPhysicalMaterial) return;
    m.userData.toneBase ??= {color: m.color.clone(), emissive: m.emissive.clone()};
    m.color.copy(m.userData.toneBase.color).multiplyScalar(k); m.emissive.copy(m.userData.toneBase.emissive).multiplyScalar(k);
  });
}

// An arrow along a curve, drawn as it is made (set(0–1)): a tube and a cone at its head, or dots.
function createArrow(parent, curve, material, dotted) {
  const HEAD = 6.5, length = curve.getLength(), u = 1 - HEAD / length;
  const head = new THREE.Mesh(new THREE.ConeGeometry(2.6, HEAD, 18).translate(0, -HEAD / 2, 0), material);
  head.position.copy(curve.getPointAt(1)); head.quaternion.setFromUnitVectors(V(0, 1, 0), curve.getTangentAt(1).normalize());
  parent.add(head);
  let set;
  if (dotted) {
    const n = Math.floor(length * u / 4.4), dots = new THREE.InstancedMesh(new THREE.SphereGeometry(.95, 10, 8), material, n), m = new THREE.Matrix4();
    for (let i = 0; i < n; i++) dots.setMatrixAt(i, m.makeTranslation(curve.getPointAt(u * (i + .5) / n)));
    dots.frustumCulled = false; parent.add(dots);
    set = w => { a.drawn = w; dots.count = Math.round(n * w); dots.visible = dots.count > 0; head.visible = w > .98; };
  } else {
    const path = new THREE.CatmullRomCurve3(Array.from({length: 33}, (_, i) => curve.getPointAt(u * i / 32)));
    const geometry = new THREE.TubeGeometry(path, 64, .9, 8), shaft = new THREE.Mesh(geometry, material), total = geometry.index.count;
    parent.add(shaft);
    set = w => { a.drawn = w; geometry.setDrawRange(0, Math.floor(total * w / 6) * 6); shaft.visible = w > .01; head.visible = w > .98; };
  }
  const a = {set: w => set(w), mid: curve.getPointAt(.5), curve, drawn: 0};
  set(0);
  return a;
}
