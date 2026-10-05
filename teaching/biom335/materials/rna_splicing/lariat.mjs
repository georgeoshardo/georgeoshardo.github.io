// Scene: splicing proceeds through a lariat intermediate. A pre-mRNA drawn whole (exon 1, an intron with its GU,
// branch site and AG, exon 2) shows the three sequences splicing needs; then the chemistry atom by atom, where it
// happens, in the RNA core of the catalytic spliceosome: the 2′-OH of the branch-site adenine attacks the phosphate at
// the 5′ splice site, the bond to exon 1 breaks and a 2′–5′ bond forms (the C complex after branching, 5YZG); the
// whole pre-mRNA folds into the lariat; exon 1's freed 3′-OH attacks the 3′ splice site and the exons are joined (the
// P complex after exon ligation, 6QDV); the lariat is released, debranched by the debranching enzyme (Dbr1 with a
// branched RNA, 5K78) and degraded. The two cores are superposed on their Prp8, so both reactions happen at one
// place; each reaction is drawn on the structure's own atoms, the state before it rebuilt from them: the attacking
// oxygen a little further from the phosphorus, the leaving group bonded to it in line with the attack, and the
// phosphorus on the other side of its three other oxygens (the inversion of an in-line attack).
import * as THREE from 'three';
import {runScene} from '../shared/scene_player.mjs';
import {loadSurfaceSet, surfaceGeometry, proteinMaterial, baseMaterial, fade} from '../shared/molecules.mjs';
import {SPLICING, SPACING, COMPLEMENT, createStrand, pairTip, line, onwards, arcBetween, blend} from '../shared/rna.mjs';
import {createAtoms, createPlates} from '../shared/atoms.mjs';
import {BASES} from '../shared/strands.mjs';
import {boxAround} from '../shared/camera.mjs';
import {fitRigid} from '../shared/fit.mjs';
import {ramp, smooth, clamp, mix} from '../shared/ease.mjs';

const V = (...a) => new THREE.Vector3(...a), DEG = Math.PI / 180;
const hex = c => '#' + c.toString(16).padStart(6, '0');
const S = SPACING;

// Times (s): each step's start.
const T = {sites: 0, core: 13, first: 25, lariat: 43, second: 58, joined: 78, debranch: 90, degrade: 102, end: 116};
// Beats within the steps (absolute times).
const B = {
  // The first reaction: the attack shown, the A's 2′-O closing in, the bonds exchanged, exon 1 moving off.
  arrow1: T.first + 2.6, near1: [T.first + 4.2, T.first + 5.6], swap1: [T.first + 5.6, T.first + 7.2], leave1: [T.first + 7.6, T.first + 10.6],
  // The lariat at the strand's scale: the pre-mRNA folds, the bond is exchanged, exon 1 moves to the 3′ splice site.
  fold: [T.lariat + 2.8, T.lariat + 6.8], cut: [T.lariat + 7.8, T.lariat + 8.8], park: [T.lariat + 9.6, T.lariat + 12.4],
  // The second reaction: the P complex, then its core.
  dive2: T.second + 6.5, arrow2: T.second + 9, near2: [T.second + 10.6, T.second + 12], swap2: [T.second + 12, T.second + 13.6], leave2: [T.second + 14, T.second + 16.4],
  // The exons joined and the lariat released; debranching; degradation.
  join: [T.joined + 3, T.joined + 4.6], release: [T.joined + 5.2, T.joined + 8.4],
  dbr1In: [T.debranch + 1.2, T.debranch + 3.4], unbranch: [T.debranch + 4.4, T.debranch + 5.6], dbr1Out: [T.debranch + 6.6, T.debranch + 8.6], open: [T.debranch + 7, T.debranch + 10.6],
  degrade: [T.degrade + 1.6, T.degrade + 8],
};

// The camera's moves between places (a shot's time and blend): each begins a third of its blend early (the player's
// lead). What the camera leaves fades fully out at the start of the move, before it has moved; what it arrives at fades
// in as the move ends, so nothing passes behind the page's text on the way.
const MOVE = {core: [T.core, 3.2], first: [T.first, 3], lariat: [T.lariat, 3.2], second: [T.second, 3.2], dive2: [B.dive2, 3], joined: [T.joined, 3.2]};
const LEAD = .35, moveStart = ([t, b]) => t - LEAD * b, moveEnd = m => moveStart(m) + m[1];
const leaving = (t, m) => 1 - ramp(t, moveStart(m), moveStart(m) + .35), arriving = (t, m) => ramp(t, moveEnd(m) - .15, moveEnd(m) + .6);

// Colours: the chapter's exon and intron; atoms' carbons a lighter tint of their strand's; the 2′–5′ bond and the
// attack in a warm highlight; the spliceosome's proteins a cool grey, the debranching enzyme sea teal.
const EXON_C = 0xffc28c, INTRON_C = 0xb9b0e2, BOND = 0xffd27a, PROTEIN = 0x8a93a6, DBR1 = 0x4fa3a0;
const SNRNA = {U2: SPLICING.U2, U5: SPLICING.U5, U6: SPLICING.U6};

// ---------- The drawn pre-mRNA ----------
// 66 nucleotides: exon 1 (0–9), the intron (10–55: GU at its 5′ end, the yeast branch site UACUAAC at 27–33 with its
// A at 32, 24 nucleotides upstream of the 3′ splice site, and AG at its 3′ end), exon 2 (56–65).
const N = 66, E1 = 10, BR = 32, E2 = 56;
const SEQ = 'ACCUUGCCAG' + 'GUAAGUAUGCUUAGCAGUACUAACUCCUUUUCUUUCCUUUUCCCAG' + 'GUUCCAGAAG';
const MARKED = new Set([10, 11, 27, 28, 29, 30, 31, 32, 33, 54, 55]);
const MARKS = [...SEQ].map((c, i) => MARKED.has(i) ? c : '-').join('');

const NOTES = {lariat: 'splicing-proceeds-through-a-lariat-intermediate', parts: 'the-spliceosome-and-its-components'};
const steps = [
  {t: T.sites, nav: 'Three sequences', title: 'Three sequences<br>mark the intron.', notes: NOTES.lariat, hold: 1.1,
    text: 'Splicing requires three key sequences on the pre-mRNA: the 5′ splice site, the 3′ splice site and a branch site 18 to 40 nucleotides upstream of the 3′ splice site. The branch site contains a critical adenine, essential for the reaction; it is highly conserved in yeast (UACUAAC) and less defined in multicellular eukaryotes.'},
  {t: T.core, nav: 'In the spliceosome', title: 'Splicing happens<br>in the spliceosome.', notes: NOTES.parts, hold: 1.1,
    text: 'The reactions take place in the spliceosome, a large complex of snRNPs and other proteins assembled on the pre-mRNA. Its function relies heavily on RNA–RNA interactions, between the snRNAs and the pre-mRNA and among the snRNAs themselves, which suggests that the RNA components play a direct, possibly catalytic, role.'},
  {t: T.first, nav: 'First transesterification', title: 'The branch-site A attacks<br>the 5′ splice site.', notes: NOTES.lariat, hold: 1.1,
    text: 'Splicing occurs through two sequential transesterification reactions, each exchanging one phosphodiester bond for another. First, the 2′-OH group of the branch-site adenine attacks the 5′ splice site. The bond at the 5′ end of the intron is cleaved and, in the same step, this free 5′ end is attached to the adenine.'},
  {t: T.lariat, nav: 'A lariat', title: 'The intron becomes<br>a lariat.', notes: NOTES.lariat, hold: 1.1,
    text: 'This creates a looped, branched structure called a lariat. A key feature of the lariat is the unusual 2′–5′ phosphodiester bond that forms the branch point. The 5′ exon has been cleaved off, with a newly freed 3′-OH group.'},
  {t: T.second, nav: 'Second transesterification', title: 'Exon 1 attacks<br>the 3′ splice site.', notes: NOTES.lariat, hold: 1.1,
    text: 'Second transesterification: the newly freed 3′-OH group of the 5′ exon now attacks the 3′ splice site. This reaction joins the two exons together (ligation) and, at the same time, releases the intron.'},
  {t: T.joined, nav: 'Exons joined', title: 'The exons are joined;<br>the lariat is released.', notes: NOTES.lariat, hold: 1.1,
    text: 'Splicing occurs in two stages: first the 5′ exon is cleaved off, and then it is joined to the 3′ exon. The intron is released, still in its lariat form.'},
  {t: T.debranch, nav: 'Debranching', title: 'The lariat<br>is debranched.', notes: NOTES.lariat, hold: 1.1,
    text: 'After being released, the intron lariat is “debranched” by an enzyme, which cuts its 2′–5′ bond, converting it back to a linear RNA molecule.'},
  {t: T.degrade, nav: 'Degradation', title: 'The intron<br>is degraded.', notes: NOTES.lariat, hold: 1.1,
    text: 'The linear intron is then rapidly degraded in the nucleus, leaving the two exons joined.'},
];

// ---------- Small geometry helpers ----------
// A rigid transform as a rotation about a pivot: x → q(x − c) + p (the identity: q = 1, p = c).
const rigid = (c, q = new THREE.Quaternion(), p = c.clone()) => ({c: c.clone(), q, p});
const apply = (tr, x, out = V()) => out.copy(x).sub(tr.c).applyQuaternion(tr.q).add(tr.p);
// Between two transforms with the same pivot (w 0 the first … 1 the second).
const between = (a, b, w, out = rigid(a.c)) => { out.c.copy(a.c); out.q.slerpQuaternions(a.q, b.q, w); out.p.lerpVectors(a.p, b.p, w); return out; };
const mean = pts => pts.reduce((s, p) => s.add(p), V()).divideScalar(Math.max(1, pts.length));
// The unit normal of the plane through three points, turned towards `toward`.
const normalOf = (a, b, c, toward) => { const n = V().subVectors(b, a).cross(V().subVectors(c, a)).normalize(); if (n.dot(V().subVectors(toward, a)) < 0) n.negate(); return n; };

// Atom groups merged into one (so bonds can join them), each atom remembering its group.
function merge(groups) {
  const out = {atoms: {name: [], element: [], residue: [], position: []}, bonds: [], hbonds: [], residues: [], part: []};
  groups.forEach((g, k) => {
    const a0 = out.atoms.name.length, r0 = out.residues.length;
    out.atoms.name.push(...g.atoms.name); out.atoms.element.push(...g.atoms.element);
    out.atoms.residue.push(...g.atoms.residue.map(r => r + r0)); out.atoms.position.push(...g.atoms.position.map(p => p.slice()));
    out.bonds.push(...g.bonds.map(([i, j, o]) => [i + a0, j + a0, o])); out.residues.push(...g.residues);
    out.part.push(...g.atoms.name.map(() => k));
  });
  return out;
}
const atomIndex = (data, num, name) => data.atoms.name.findIndex((n, i) => n === name && data.residues[data.atoms.residue[i]].num === num);
const atomPos = (data, num, name) => V(...data.atoms.position[atomIndex(data, num, name)]);
// Adds a hydrogen (placed each frame) bonded to atom i; returns its index.
const addHydrogen = (data, i, part) => {
  const k = data.atoms.name.length;
  data.atoms.name.push('H' + data.atoms.name[i]); data.atoms.element.push('H'); data.atoms.residue.push(data.atoms.residue[i]);
  data.atoms.position.push(data.atoms.position[i].slice()); data.bonds.push([i, k, 1]); data.part.push(part);
  return k;
};
// A hydroxyl's hydrogen: 0.97 Å from its oxygen o, at 109.5° to the O–C bond, in the plane of c, o and the phosphorus
// p, on the side away from it.
const hydroxyl = (o, c, p, out) => {
  const a = V().subVectors(c, o).normalize(), b = V().subVectors(p, o); b.addScaledVector(a, -b.dot(a));
  if (b.lengthSq() < 1e-6) b.set(0, 0, 1).addScaledVector(a, -a.z);
  b.normalize().negate();
  return out.copy(o).addScaledVector(a, .97 * Math.cos(109.5 * DEG)).addScaledVector(b, .97 * Math.sin(109.5 * DEG));
};

const at = {};  // positions the shots and labels read, and state for the tests (?debug=1)

runScene({
  pageTitle: 'Splicing proceeds through a lariat · RNA splicing and processing', eyebrow: 'The lariat',
  links: [{href: 'index.html', text: 'All scenes'}],
  steps, duration: T.end, notesPage: 'notes.html', fov: 26, fog: .00012, loop: false,
  shots: [
    {t: T.sites, frame: () => at.shots.straight},
    {t: T.core, blend: MOVE.core[1], frame: () => at.shots.wideC},
    {t: T.first, blend: MOVE.first[1], frame: () => at.shots.atomsC},
    {t: T.lariat, blend: MOVE.lariat[1], frame: () => at.shots.straight},
    {t: B.fold[1] - .4, blend: 2.6, frame: () => at.shots.folded},
    {t: T.second, blend: MOVE.second[1], frame: () => at.shots.wideP},
    {t: B.dive2, blend: MOVE.dive2[1], frame: () => at.shots.atomsP},
    {t: T.joined, blend: MOVE.joined[1], frame: () => at.shots.joined},
    {t: B.degrade[1] + .6, blend: 2.8, frame: () => at.shots.mrna},
  ],
  async build({world, renderer, progress}) {
    const set = await loadSurfaceSet('assets/lariat.json', 'assets/lariat.bin', progress);
    renderer.localClippingEnabled = true;
    const strandOf = name => set.meta.strands.find(s => s.name === name);
    const atomsOf = name => set.meta.atoms.find(g => g.name === name);
    const meshOf = name => set.meta.meshes.find(m => m.name === name);

    // ======================================================================================================
    // The drawn pre-mRNA, at its own place (the origin); the camera looks along +z, −y up.
    // ======================================================================================================
    const DIR_S = V(0, -.1, -1).normalize();
    const strandGroup = new THREE.Group(); world.add(strandGroup);
    const pre = createStrand(strandGroup, N).stretches([[0, E1, SPLICING.exon], [E1, E2, SPLICING.intron], [E2, N, SPLICING.exon]]).letters(MARKS, 1);
    const branchBond = pre.link(BR, E1, {w: 0, colour: BOND});
    // The backbone bonds broken and made by the two reactions, drawn breaking and forming over a moment (two halves of
    // the strand's own backbone, one from each nucleotide to the middle of the two, grown or shrunk together), so no
    // stretch of backbone vanishes or appears in a frame: exon 1 lets go of the intron's G; exon 1 reaches exon 2 just
    // before they are joined; the intron lets go of exon 2.
    const BREAK = .35;
    const halfBonds = (i, j) => { const mid = V(), a = pre.link(i, mid, {w: 0, backbone: true}), b = pre.link(j, mid, {w: 0, backbone: true});
      return w => { mid.lerpVectors(pre.points[i], pre.points[j], .5); a.w = b.w = w; }; };
    const cutBond = halfBonds(E1 - 1, E1), madeBond = halfBonds(E1 - 1, E2), oldBond = halfBonds(E2 - 1, E2);

    // Layouts. Straight: the pre-mRNA as made. Loop (the 5′ splice site brought to the branch site): the branch A stays
    // where it was; the intron's first 22 nucleotides bulge into a ring whose ends, the G and the A, lie one step apart;
    // exon 1 stands up from the G; the intron's tail runs right from the A and comes into exon 2 from the lower left, as
    // the notes' figure has it. Ready (after the first reaction): the same, exon 1 moved to the upper left of exon 2,
    // its 3′ end one step from exon 2's first nucleotide. Ligated: exon 1 turned into line with exon 2.
    const straight = line(N, {origin: V(-(N - 1) / 2 * S, 0, 0)});
    // (The ring bulges to the side of its chord nearest BULGE. As the G comes round to the A the chord turns from
    // level to upright, and BULGE lies off every chord between, below and left of them, so the ring grows below the
    // strand and turns to the left of the A smoothly, clear of exon 1 swinging over the top; a bulge the chord passes
    // would flip the ring from one side to the other in a frame.)
    const A0 = straight[BR].clone(), ALPHA = 40 * DEG, BETA = 40 * DEG, BULGE = V(-1, .15, 0);
    const ready = Array.from({length: N}, () => V());
    for (let k = 0; k < N - E2; k++) ready[E2 + k].set(k * S, 0, 0);
    onwards(ready[E2], V(-Math.cos(ALPHA), Math.sin(ALPHA), 0), V(-1, 0, 0), E2 - BR, {turn: .22}).forEach((p, k) => ready[E2 - 1 - k].copy(p));
    const shift = A0.clone().sub(ready[BR]); for (let i = BR; i < N; i++) ready[i].add(shift);
    // The ring: a regular 23-gon through the A, closed by the 2′–5′ step from the G above it.
    const R = S / (2 * Math.sin(Math.PI / (BR - E1 + 1))), phi = 2 * Math.PI / (BR - E1 + 1);
    const G0 = A0.clone().add(V(R * (Math.cos(phi) - 1), -R * Math.sin(phi), 0));
    const ringOf = (g, out) => { out[E1].copy(g); arcBetween(g, A0, BR - E1 - 1, {bulge: BULGE}).forEach((p, k) => out[E1 + 1 + k].copy(p)); };
    ringOf(G0, ready);
    const ringCentre = A0.clone().add(V(-R, 0, 0));
    const u1 = V(Math.cos(BETA), Math.sin(BETA), 0);                           // exon 1's 5′→3′ way, ready
    const exon1At = (p9, u, out) => { for (let k = 0; k < E1; k++) out[k].copy(p9).addScaledVector(u, -(E1 - 1 - k) * S); };
    exon1At(ready[E2].clone().addScaledVector(u1, -S), u1, ready);
    const u0 = V(-Math.sin(30 * DEG), Math.cos(30 * DEG), 0);                 // and in the loop: down into the G, from the upper right
    const loop = ready.map(p => p.clone()); exon1At(G0.clone().addScaledVector(u0, -S), u0, loop);
    const ligated = ready.map(p => p.clone()); exon1At(ready[E2].clone().addScaledVector(V(1, 0, 0), -S), V(1, 0, 0), ligated);
    // The released lariat moves down and back; debranched, its ring opens into an arc run on from the branch.
    const RELEASE = V(-10, 62, 30);
    const released = ready.map((p, i) => i >= E1 && i < E2 ? p.clone().add(RELEASE) : p.clone());
    const linear = released.map(p => p.clone());
    line(BR - E1 + 1, {origin: released[BR], direction: released[BR].clone().sub(released[BR + 1]), toward: V(0, 1, 0), bend: 1.5}).forEach((p, j) => linear[BR - j].copy(p));
    const uNow = V(), qTurn = new THREE.Quaternion(), q1 = new THREE.Quaternion(), gNow = V(), xAxis = V(1, 0, 0);
    const tailFrom = straight.slice(BR), tailTo = loop.slice(BR), tailOut = tailFrom.map(p => p.clone());

    // Where the strand is at time t (its points, pieces and bond).
    const poseStrand = t => {
      const P = pre.points;
      if (t < B.fold[0] || t < T.lariat - 2) straight.forEach((p, i) => P[i].copy(p));
      else if (t < B.park[0]) {
        // The G moves to the A, the intron between them bulging into the ring, exon 1 carried with the G; the tail
        // bends into its place, the A fixed.
        const w = smooth(ramp(t, ...B.fold));
        gNow.lerpVectors(straight[E1], G0, w); ringOf(gNow, P);
        qTurn.setFromUnitVectors(xAxis, u0); uNow.copy(xAxis).applyQuaternion(q1.identity().slerp(qTurn, w));
        exon1At(gNow.clone().addScaledVector(uNow, -S), uNow, P);
        blend(tailFrom, tailTo, w, {anchor: 0, out: tailOut}); tailOut.forEach((p, k) => P[BR + k].copy(p));
      } else {
        // Exon 1 moves from the G to beside exon 2 (arching towards the viewer, clear of the tail), then, once ligated,
        // turns into line with exon 2 as the intron moves off.
        const park = smooth(ramp(t, ...B.park)), turn = smooth(ramp(t, ...B.join)), off = smooth(ramp(t, ...B.release));
        ready.forEach((p, i) => P[i].copy(p));
        qTurn.setFromUnitVectors(u0, u1); uNow.copy(u0).applyQuaternion(q1.identity().slerp(qTurn, park));
        const p9 = loop[E1 - 1].clone().lerp(ready[E1 - 1], park).add(V(0, 0, -22 * Math.sin(Math.PI * park)));
        if (turn > 0) { const a = BETA * (1 - turn); uNow.set(Math.cos(a), Math.sin(a), 0); p9.copy(ready[E2]).addScaledVector(uNow, -S); }
        exon1At(p9, uNow, P);
        if (t > B.dbr1In[0]) {
          const lar = released.slice(E1, E2), lin = linear.slice(E1, E2), out = lar.map(p => p.clone());
          blend(lar, lin, smooth(ramp(t, ...B.open)), {anchor: BR - E1, out});
          out.forEach((p, k) => P[E1 + k].copy(p));
        } else for (let i = E1; i < E2; i++) P[i].addScaledVector(RELEASE, off);
      }
      // Pieces: one strand; exon 1 cut from the G; the exons joined and the intron apart, degraded from its ends.
      const cut = t >= B.cut[0], joined = t >= B.join[0];
      // Degraded from both ends, a nucleotide at a time: each end nucleotide slides into its neighbour (the strand's end
      // shortening smoothly), its base bond drawing in, and is dropped once there, so nothing vanishes in a frame.
      const g = joined ? ramp(t, ...B.degrade) * 18 : 0, a = Math.min(18, Math.floor(g)), f = a < 18 ? smooth(g - a) : 0;
      for (let i = E1; i < E2; i++) pre.pair(i, P[i], i < E1 + a || i >= E2 - a ? 1 : i === E1 + a || i === E2 - 1 - a ? f : 0);
      if (f > 0) { P[E1 + a].lerp(P[E1 + a + 1], f); P[E2 - 1 - a].lerp(P[E2 - 2 - a], f); }
      if (!cut || t < T.lariat - 2) pre.pieces(null);
      else if (!joined) pre.pieces([[0, E1], [E1, N]]);
      else pre.pieces([[[0, E1], [E2, N]], {ranges: [[E1 + a, E2 - a]], opacity: 1 - ramp(t, B.degrade[1] - 1.4, B.degrade[1])}]);
      branchBond.w = t < T.lariat - 2 ? 0 : ramp(t, ...B.cut) * (1 - ramp(t, ...B.unbranch));
      const split = cut && t >= T.lariat - 2;
      cutBond(split && !joined ? 1 - ramp(t, B.cut[0], B.cut[0] + BREAK) : 0);
      madeBond(joined ? 0 : ramp(t, B.join[0] - BREAK, B.join[0])); oldBond(joined ? 1 - ramp(t, B.join[0], B.join[0] + BREAK) : 0);
    };

    // ---------- The debranching enzyme, fitted to the released lariat's branch ----------
    // 5K78's branched RNA: A501 (the branch A), C502, A503 and, by its 2′–5′ bond, G510, U511, A512; laid on the drawn
    // lariat's A32, 33, 34 and G10, 11, 12.
    const dX = strandOf('Dbr1 branch strand'), dx = strandOf('Dbr1 2′ strand');
    const crystal = [...[501, 502, 503].map(n => V(...dX.backbone[dX.numbers.indexOf(n)])), ...[510, 511, 512].map(n => V(...dx.backbone[dx.numbers.indexOf(n)]))];
    const drawnBranch = [BR, BR + 1, BR + 2, E1, E1 + 1, E1 + 2].map(i => released[i]);
    const dbr1Fit = fitRigid(crystal, drawnBranch);
    at.dbr1Fit = Math.sqrt(crystal.reduce((s, p, k) => s + p.clone().applyMatrix4(dbr1Fit).distanceToSquared(drawnBranch[k]), 0) / crystal.length);
    const dbr1 = new THREE.Group(), dbr1Inner = new THREE.Group(); dbr1.add(dbr1Inner); strandGroup.add(dbr1);
    dbr1Inner.applyMatrix4(dbr1Fit);
    const dbr1Mesh = new THREE.Mesh(surfaceGeometry(meshOf('Dbr1'), set.buffer), proteinMaterial(DBR1)); dbr1Inner.add(dbr1Mesh);
    const dbr1Sample = (() => { const a = dbr1Mesh.geometry.attributes.position, out = []; for (let k = 0; k < a.count; k += 7) out.push(V().fromBufferAttribute(a, k)); return out; })();
    // It arrives from behind the lariat (away from the viewer) and leaves the same way.
    const DBR1_AWAY = V(18, -10, 90);
    const dbr1World = () => { dbr1.updateMatrixWorld(true); return dbr1Sample.map(p => dbr1Inner.localToWorld(p.clone())); };

    // ======================================================================================================
    // The spliceosome's core: the C complex (5YZG) and the P complex (6QDV, superposed on its Prp8), placed at SITE
    // and turned so the first reaction's attack runs left to right across the view.
    // ======================================================================================================
    const SITE = V(1500, 0, 0);
    const site = new THREE.Group(); world.add(site);
    const C = merge([atomsOf('C exon'), atomsOf('C intron'), atomsOf('C branch')]);       // parts 0 exon, 1 intron, 2 branch
    const Pd = merge([atomsOf('P exon 1'), atomsOf('P exon 2'), atomsOf('P intron')]);   // parts 0 exon 1, 1 exon 2, 2 intron
    const c = {P: atomPos(C, 1, 'P'), O2: atomPos(C, 144, "O2'"), O3: atomPos(C, -1, "O3'")};
    const n1 = c.O2.clone().sub(c.P).normalize();
    // Each close-up looks down the thinnest axis of its reacting atoms, square to the attack, from the side with less
    // snRNA in front.
    const viewOf = (data, attack, centre, prefix) => {
      const pts = data.atoms.position.map(p => V(...p)), mid = mean(pts), cov = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
      for (const p of pts) { const d = p.clone().sub(mid).toArray(); for (let r = 0; r < 3; r++) for (let q = 0; q < 3; q++) cov[r][q] += d[r] * d[q]; }
      // The smallest eigenvector, by inverse iteration.
      const m = new THREE.Matrix3().set(...cov.flat()).invert(), v = V(1, .3, .2);
      for (let k = 0; k < 40; k++) v.applyMatrix3(m).normalize();
      v.addScaledVector(attack, -v.dot(attack)).normalize();
      const near = set.meta.strands.filter(x => x.name.startsWith(prefix)).flatMap(x => x.backbone.map(b => V(...b))).filter(p => p.distanceTo(centre) < 26);
      if (near.filter(p => p.clone().sub(centre).dot(v) > 0).length > near.length / 2) v.negate();
      return v;
    };
    const p2 = {P: atomPos(Pd, 1, 'P'), O3: atomPos(Pd, -1, "O3'"), O3i: atomPos(Pd, 113, "O3'")};
    const n2 = p2.O3.clone().sub(p2.P).normalize();
    const v1 = viewOf(C, n1, c.P, 'C U'), v2 = viewOf(Pd, n2, p2.P, 'P U');
    const flip = new URLSearchParams(location.search).get('flip');
    if (flip === '1' || flip === '3') v1.negate();
    if (flip === '2' || flip === '3') v2.negate();
    // The site turned so the first attack runs left to right across its view (from −z).
    const w1 = n1.clone().cross(v1);
    site.quaternion.setFromRotationMatrix(new THREE.Matrix4().makeBasis(n1, w1, v1.clone().negate()).transpose());
    site.position.copy(SITE).sub(c.P.clone().applyQuaternion(site.quaternion));
    site.updateMatrixWorld(true);
    const toWorld = p => site.localToWorld(p.clone());
    const DIR_C = V(0, -.08, -1).normalize(), n2w = n2.clone().applyQuaternion(site.quaternion);
    const DIR_P = new URLSearchParams(location.search).get('pview') === '1' ? v2.clone().applyQuaternion(site.quaternion) : DIR_C.clone().addScaledVector(n2w, -DIR_C.dot(n2w));
    DIR_P.normalize();

    // ---------- Each reaction's state before it, rebuilt from the structure ----------
    // The phosphorus sits on the far side of its three other oxygens (mirrored through their plane); the leaving
    // oxygen in line with the attack, 1.6 Å beyond it, its nucleotide turned least to make a 120° C–O–P angle (and
    // turned about that bond to keep clear of its neighbours); the attacking oxygen 3.4 Å from the phosphorus.
    const prepare = (data, num, nucOf, leaveOf, nucPart, leavePart) => {
      const P = atomPos(data, num, 'P'), eq = ['OP1', 'OP2', "O5'"].map(n => atomPos(data, num, n)), O = nucOf(), L = leaveOf();
      const n = normalOf(eq[0], eq[1], eq[2], O), ctr = mean(eq), h = P.clone().sub(ctr).dot(n), before = P.clone().addScaledVector(n, -2 * h);
      const leaveAt = before.clone().addScaledVector(n, -1.6);
      // The leaving nucleotide: the C3′ (or C2′) of its oxygen on the 120° cone about the bond to the phosphorus.
      const cName = data.atoms.name[L.carbonIndex];
      const C0 = V(...data.atoms.position[L.carbonIndex]), v0 = C0.clone().sub(L.pos).normalize(), a = n.clone();  // from the O towards the P
      const perp = v0.clone().addScaledVector(a, -v0.dot(a)).normalize();
      const v = a.clone().multiplyScalar(Math.cos(120 * DEG)).addScaledVector(perp, Math.sin(120 * DEG));
      const q0 = new THREE.Quaternion().setFromUnitVectors(v0, v);
      const others = data.atoms.position.map(p => V(...p)).filter((p, i) => data.part[i] !== leavePart);
      const members = data.atoms.position.map(p => V(...p)).filter((p, i) => data.part[i] === leavePart);
      let best = null;
      for (let k = 0; k < 24; k++) {
        const q = new THREE.Quaternion().setFromAxisAngle(v, k * 15 * DEG).multiply(q0), tr = rigid(L.pos, q, leaveAt.clone());
        let low = Infinity;
        for (const m of members) { const x = apply(tr, m); for (const o of others) low = Math.min(low, x.distanceTo(o)); }
        if (!best || low > best.low) best = {low, tr};
      }
      // The attacking nucleotide: moved straight back along the attack, to 3.4 Å.
      const u = O.clone().sub(P).normalize(), nucAt = before.clone().addScaledVector(u, 3.4);
      return {P, before, n, leave: best.tr, clearance: best.low, carbon: cName,
        approach: rigid(O, new THREE.Quaternion(), nucAt), nucPart, leavePart};
    };
    const idx = (data, num, name) => atomIndex(data, num, name);
    const r1 = prepare(C, 1, () => c.O2, () => ({pos: c.O3, carbonIndex: idx(C, -1, "C3'")}), 2, 0);
    const r2 = prepare(Pd, 1, () => p2.O3, () => ({pos: p2.O3i, carbonIndex: idx(Pd, 113, "C3'")}), 0, 2);
    at.prepared = {clearance1: r1.clearance, clearance2: r2.clearance};

    // ---------- The atoms ----------
    // Each reaction's pre-mRNA atoms (heavy atoms from the structure; the hydroxyl hydrogens that matter added), the
    // bonds that break and form among them, base rings as plates.
    const chem = (data, r, {nuc, nucH, leave, leaveH, P}) => {
      const hNuc = addHydrogen(data, nuc, r.nucPart), hLeave = addHydrogen(data, leave, r.leavePart);
      const extra = [[leave, P, 1], [nuc, P, 1]];
      const carbonOf = i => { const res = data.residues[data.atoms.residue[i]]; return res.chain === 'E' || res.num < 0 ? EXON_C : INTRON_C; };
      const atoms = createAtoms(site, data, {carbon: carbonOf, extraBonds: extra});
      const plates = createPlates(site, atoms, {color: ring => BASES[ring.letter], opacity: .5});
      const home = data.atoms.position.map(p => V(...p));
      return {data, r, atoms, plates, home, nuc, leave, P, hNuc, hLeave, nucC: nucH, leaveC: leaveH, shown: -1};
    };
    const chem1 = chem(C, r1, {nuc: idx(C, 144, "O2'"), nucH: idx(C, 144, "C2'"), leave: idx(C, -1, "O3'"), leaveH: idx(C, -1, "C3'"), P: idx(C, 1, 'P')});
    const chem2 = chem(Pd, r2, {nuc: idx(Pd, -1, "O3'"), nucH: idx(Pd, -1, "C3'"), leave: idx(Pd, 113, "O3'"), leaveH: idx(Pd, 113, "C3'"), P: idx(Pd, 1, 'P')});
    const trA = rigid(V()), trB = rigid(V()), ident = c0 => rigid(c0);
    // Poses the atoms of a reaction: near (0 apart … 1 the attacking O in place), swap (bonds exchanged, the phosphorus
    // through), leave (0 the leaving group bonded … 1 moved to its place in the structure).
    const poseChem = (ch, near, swap, leave) => {
      const {r, atoms, home, data} = ch;
      between(r.approach, ident(r.approach.c), near, trA);
      between(r.leave, ident(r.leave.c), leave, trB);
      for (let i = 0; i < home.length; i++) {
        const part = data.part[i];
        if (part === r.nucPart) apply(trA, home[i], atoms.positions[i]);
        else if (part === r.leavePart) apply(trB, home[i], atoms.positions[i]);
        else atoms.positions[i].copy(home[i]);
      }
      atoms.positions[ch.P].lerpVectors(r.before, r.P, smooth(swap));
      hydroxyl(atoms.positions[ch.nuc], atoms.positions[ch.nucC], atoms.positions[ch.P], atoms.positions[ch.hNuc]);
      hydroxyl(atoms.positions[ch.leave], atoms.positions[ch.leaveC], atoms.positions[ch.P], atoms.positions[ch.hLeave]);
      atoms.showBond(ch.leave, ch.P, 1 - swap); atoms.showBond(ch.nuc, ch.P, swap);
      atoms.show([ch.hNuc], 1 - ramp(swap, 0, .6)); atoms.show([ch.hLeave], ramp(swap, .5, 1));
      atoms.update(); ch.plates.update();
    };
    const opacityChem = (ch, v) => { v = v < .002 ? 0 : v > .998 ? 1 : v; if (v === ch.shown) return; ch.shown = v; ch.atoms.opacity(v); ch.plates.opacity(v); };
    const chemWorld = ch => ch.atoms.positions.filter((p, i) => ch.atoms.shown[i] > .01).map(p => toWorld(p));

    // The attack: a curved arrow from the attacking oxygen to the phosphorus, bowed towards the viewer.
    const arrowOf = r => {
      const from = r.approach.p.clone(), to = r.before.clone(), d = to.clone().sub(from), len = d.length();
      const toward = V(0, 0, -1).applyQuaternion(site.quaternion.clone().invert());
      const bow = toward.clone().addScaledVector(d, -toward.dot(d) / (len * len)).setLength(len * .45);
      const tipBack = .55, curve = new THREE.QuadraticBezierCurve3(from.clone().addScaledVector(d, .12), from.clone().addScaledVector(d, .5).add(bow), to.clone().addScaledVector(d, -tipBack / len - .1));
      const m = baseMaterial(BOND, {emissive: BOND, emissiveIntensity: .45, roughness: .45});
      const g = new THREE.Group(), tube = new THREE.Mesh(new THREE.TubeGeometry(curve, 24, .12, 8), m);
      const end = curve.getPoint(1), dir = curve.getTangent(1).normalize(), head = new THREE.Mesh(new THREE.ConeGeometry(.32, .7, 14), m);
      head.position.copy(end).addScaledVector(dir, .2); head.quaternion.setFromUnitVectors(V(0, 1, 0), dir);
      g.add(tube, head); site.add(g); g.visible = false;
      return {g, m, opacity(v) { g.visible = v > .002; fade(m, v); }};
    };
    const arrow1 = arrowOf(r1), arrow2 = arrowOf(r2);

    // ---------- The spliceosome around them ----------
    // Proteins as one coarse envelope per complex (from Cα atoms), cut away in front of the core.
    const cut = new THREE.Plane(DIR_C.clone().negate(), 1e5);
    const envelope = name => {
      const rec = meshOf(name), m = proteinMaterial(PROTEIN);
      m.clippingPlanes = [cut]; m.side = THREE.DoubleSide;
      const u = m.userData.uniforms; u.uCut.value = .8; u.uCap.value.set(PROTEIN).multiplyScalar(.5);
      const mesh = new THREE.Mesh(surfaceGeometry(rec, set.buffer), m); site.add(mesh); mesh.visible = false;
      const a = mesh.geometry.attributes.position, sample = [];
      for (let k = 0; k < a.count; k += 9) sample.push(toWorld(V().fromBufferAttribute(a, k)));
      return {mesh, sample, shown: -1};
    };
    const envC = envelope('C complex'), envP = envelope('P complex');
    // An envelope cut open keeps its cut face's cap while it fades, so the fade runs in one pass, cap and all (switched
    // on only once opaque, the cap would appear all at once as a fade in ends, and vanish as a fade out begins); whole,
    // it fades without the cap (which would shade its far side, seen through it, as a cut face).
    const opacityEnv = (e, v, open) => {
      v = v < .002 ? 0 : v > .998 ? 1 : v; const cap = v === 1 || open ? 1 : 0;
      if (v === e.shown && cap === e.cap) return; e.shown = v; e.cap = cap;
      e.mesh.material.userData.uniforms.uCapOn.value = cap; fade(e.mesh.material, v); e.mesh.visible = v > 0;
    };

    // The snRNAs: thin strands along their backbones, each base a short bond towards its base (or to the middle of its
    // pair), split into the core, within CORE Å of the reaction and behind it, and the rest, which leaves the view first
    // as the camera closes in. The core is thinner, to sit back behind the atoms.
    const CORE = 13;
    const snrnas = (prefix, centre, toward) => {
      const strands = set.meta.strands.filter(s => s.name.startsWith(prefix)), byChain = new Map(set.meta.strands.filter(s => s.name.startsWith(prefix[0])).map(s => [s.chain, s]));
      const core = [], outer = [];
      for (const s of strands) {
        const key = Object.keys(SNRNA).find(k => s.name.includes(k)); if (!key) continue;
        const Pts = s.backbone.map(b => V(...b)), n = Pts.length;
        const mate = k => { const p = s.partner[k], o = p && byChain.get(p[0]); return o && COMPLEMENT[s.sequence[k]]?.includes(o.sequence[p[1]]) ? V(...o.backbone[p[1]]) : null; };
        // Each base's bond: to the middle of its pair, or a stub towards its base; given to the strand as the point its
        // bond meets halfway.
        const reach = (k, own) => { const m = own ? null : mate(k), base = V(...s.base[k]), p = Pts[k]; const tip = base.distanceTo(p) < .5 ? (m ? p.clone().lerp(m, .5) : null) : pairTip(V(), p, base, m, 1, own ? 2.6 : 3.4); return tip && tip.multiplyScalar(2).sub(p); };
        const inCore = Pts.map(p => p.distanceTo(centre) < CORE && p.clone().sub(centre).dot(toward) < -2);
        // Runs of consecutive nucleotides (no more than 9 Å apart), split where they enter and leave the core (the
        // two pieces share the nucleotide where they meet).
        const flush = (from, to, isCore) => {
          if (to - from < 2) return;
          const st = createStrand(site, to - from, {colour: SNRNA[key], radius: isCore ? .42 : 1.1, stub: 3.4, stubRadius: isCore ? .16 : .5, samples: 3});
          for (let k = from; k < to; k++) { st.points[k - from].copy(Pts[k]); const r = reach(k, isCore); if (r) st.pair(k - from, r, 1); }
          st.pose(); st.opacity(0);
          (isCore ? core : outer).push({st, key, points: Pts.slice(from, to).map(toWorld), shown: -1});
        };
        let a = 0;
        for (let k = 1; k <= n; k++) {
          const brk = k === n || Pts[k - 1].distanceTo(Pts[k]) > 9;
          if (brk) { flush(a, k, inCore[a]); a = k; }
          else if (inCore[k] !== inCore[a]) { flush(a, k + 1, inCore[a]); a = k; }
        }
      }
      return {core, outer};
    };
    const local = d => d.clone().applyQuaternion(site.quaternion.clone().invert());
    const snC = snrnas('C U', c.P, local(DIR_C)), snP = snrnas('P U', p2.P, local(DIR_P));
    const opacityCartoons = (list, v) => { v = v < .002 ? 0 : v > .998 ? 1 : v; for (const x of list) if (x.shown !== v) { x.shown = v; x.st.opacity(v).pose(); } };

    // The pre-mRNA of each structure, as a strand (exons orange, intron grey-violet), before its reaction: in C, exon
    // 1 still joined to the intron (moved to where the rebuilt atoms put it); in P, the intron's 3′ end still joined
    // to exon 2 and exon 1 apart.
    const premrna = (parts, pieceOf, shiftOf, link) => {
      const list = parts.flatMap(([s, keep]) => s.numbers.map((num, k) => ({s, num, p: V(...s.backbone[k])})).filter(x => keep(x.num)));
      const st = createStrand(site, list.length, {radius: 1.6, samples: 3});
      st.stretches(list.map((x, k) => [k, k + 1, x.s.name.includes('exon') || x.num < 0 ? SPLICING.exon : SPLICING.intron]));
      list.forEach((x, k) => st.points[k].copy(x.p).add(shiftOf(x)));
      st.pieces(pieceOf(list)); if (link) st.link(list.findIndex(x => x.num === link[0] && x.s.name.includes('intron') === link[2]), list.findIndex(x => x.num === link[1] && x.s.name.includes('intron') === link[2]), {colour: BOND, radius: 1.1});
      st.pose(); st.opacity(0);
      return {st, list, shown: -1, points: () => list.map((x, k) => toWorld(st.points[k]))};
    };
    // Runs of nucleotides whose backbones are no more than 9 Å apart; `join` lists runs (by a member's number) drawn
    // as one piece.
    const runsOf = (list, joins = []) => {
      const runs = [[0, 1]];
      for (let k = 1; k < list.length; k++) { if (list[k].p.distanceTo(list[k - 1].p) > 9 || list[k].s !== list[k - 1].s) runs.push([k, k + 1]); else runs[runs.length - 1][1] = k + 1; }
      const pieces = runs.filter(([a, b]) => b - a > 1).map(r => [r]);
      for (const [x, y] of joins) {
        const ix = pieces.findIndex(p => p.some(([a, b]) => list.slice(a, b).some(e => e.num === x.num && e.s === x.s)));
        const iy = pieces.findIndex(p => p.some(([a, b]) => list.slice(a, b).some(e => e.num === y.num && e.s === y.s)));
        if (ix >= 0 && iy >= 0 && ix !== iy) { pieces[ix] = [...pieces[ix], ...pieces[iy]]; pieces.splice(iy, 1); }
      }
      return pieces;
    };
    const cPre = strandOf('C pre-mRNA'), pEx = strandOf('P exons'), pIn = strandOf('P intron');
    const shiftC = r1.leave.p.clone().sub(r1.leave.c);
    const preC = premrna([[cPre, () => true]], list => runsOf(list, [[{num: -1, s: cPre}, {num: 1, s: cPre}]]), x => x.num < 0 ? shiftC : V(), null);
    const shiftP = r2.leave.p.clone().sub(r2.leave.c), shiftP1 = r2.approach.p.clone().sub(r2.approach.c);
    const preP = premrna([[pIn, () => true], [pEx, n => n > 0], [pEx, n => n < 0]],
      list => runsOf(list, [[{num: 113, s: pIn}, {num: 1, s: pEx}]]), x => x.s === pIn && x.num >= 111 ? shiftP : x.s === pEx && x.num < 0 ? shiftP1 : V(), [97, 1, true]);
    const opacityStrand = (x, v) => { v = v < .002 ? 0 : v > .998 ? 1 : v; if (v === x.shown) return; x.shown = v; x.st.opacity(v).pose(); };

    // ---------- The camera's shots ----------
    world.updateMatrixWorld(true);
    const W = p => strandGroup.localToWorld(p.clone());
    const chemPoints = ch => {
      const out = [];
      for (const [near, swap, leave] of [[0, 0, 0], [1, 1, 1]]) { poseChem(ch, near, swap, leave); out.push(...ch.atoms.positions.map(toWorld)); }
      return out;
    };
    const cExtent = chemPoints(chem1), pExtent = chemPoints(chem2);
    const opening = [.2, .35, .5, .65, .8].flatMap(u => { const lar = released.slice(E1, E2), out = lar.map(p => p.clone()); return blend(lar, linear.slice(E1, E2), smooth(u), {anchor: BR - E1, out}); });
    at.shots = {
      straight: {...boxAround(straight.map(W), DIR_S, {margin: 16, above: 26, fov: 26}), fill: .94},
      folded: {...boxAround([...loop, ...ready].map(W), DIR_S, {margin: 14, above: 12, fov: 26}), fill: .95},
      wideC: {...boxAround(envC.sample, DIR_C, {margin: 10, fov: 26}), fill: .95},
      atomsC: {...boxAround([...cExtent, ...snC.core.flatMap(x => x.points)], DIR_C, {margin: 1.5, sides: 1, fov: 26}), fill: .96},
      wideP: {...boxAround(envP.sample, DIR_P, {margin: 10, fov: 26}), fill: .95},
      atomsP: {...boxAround([...pExtent, ...snP.core.flatMap(x => x.points)], DIR_P, {margin: 1.5, sides: 1, fov: 26}), fill: .96},
      // (With the ring part way open too: on its way it reaches further than at either end.)
      joined: {...boxAround([...ready, ...ligated, ...released, ...linear, ...opening, ...dbr1World()].map(W), DIR_S, {margin: 14, above: 8, fov: 26}), fill: .95},
      mrna: {...boxAround([...ligated.slice(0, E1), ...ligated.slice(E2)].map(W), DIR_S, {margin: 20, above: 16, fov: 26}), fill: .9},
    };
    // The cutaway: in front of each reaction's phosphorus by DEPTH Å (only proteins are cut), square to its view.
    const DEPTH = 10, cutDir = DIR_C.clone();
    const cuts = [[DIR_C, SITE, envC], [DIR_P, toWorld(p2.P), envP]].map(([d, o, e]) => ({dir: d, deep: o.dot(d) + DEPTH, front: Math.max(...e.sample.map(p => p.dot(d))) + 20}));
    const kept = p => p.dot(cutDir) <= cut.constant + 1e-3;

    // ---------- Showing ----------
    at.sites = {gu: SEQ.slice(E1, E1 + 2), ag: SEQ.slice(E2 - 2, E2), branchA: SEQ[BR], branchSite: SEQ.slice(BR - 5, BR + 2), upstream: E2 - BR};
    at.shown = () => {
      const out = [];
      for (const p of pre.extent()) out.push(p);
      if (dbr1.visible) for (const p of dbr1World()) out.push(p.toArray());
      for (const e of [envC, envP]) if (e.mesh.visible) for (const p of e.sample) if (kept(p)) out.push(p.toArray());
      for (const x of [...snC.core, ...snC.outer, ...snP.core, ...snP.outer]) if (x.shown > 0) for (const p of x.points) out.push(p.toArray());
      for (const x of [preC, preP]) if (x.shown > 0) for (const p of x.points()) out.push(p.toArray());
      for (const ch of [chem1, chem2]) if (ch.shown > 0) for (const p of chemWorld(ch)) out.push(p.toArray());
      return out;
    };

    return {
      at, pre, chem1, chem2,  // for tests (?debug=1)
      update(t, {pxPerA = 1} = {}) {
        // The drawn pre-mRNA: in the first step; from the lariat step to the second reaction; from the joined exons on.
        const shownS = ramp(t, .2, 1.2) * leaving(t, MOVE.core) + arriving(t, MOVE.lariat) * leaving(t, MOVE.second) + arriving(t, MOVE.joined);
        // (Opacity first: a strand faded in shows its tubes again when it is next posed.)
        poseStrand(t);
        pre.opacity(clamp(shownS)).pose().view(pxPerA);
        const P = pre.points, d1 = P[E1 - 1].clone().sub(P[E1 - 2]).normalize(), d2 = P[E2].clone().sub(P[E1 - 1]).normalize();
        at.strand = {pieces: t >= B.join[0] ? 'joined' : t >= B.cut[0] && t > T.lariat - 2 ? 'cut' : 'one', bond: branchBond.w, shown: pre.alpha,
          join: P[E1 - 1].distanceTo(P[E2]), joinAngle: Math.acos(clamp(d1.dot(d2))) / DEG, ring: P[BR].distanceTo(P[E1]),
          intron: [E1, E2 - 1, BR].map(i => pre.drawn(i)), steps: P.slice(1).map((p, i) => +p.distanceTo(P[i]).toFixed(2))};

        // The debranching enzyme comes forward to the branch, cuts the 2′–5′ bond and leaves.
        const dIn = smooth(ramp(t, ...B.dbr1In)), dOut = smooth(ramp(t, ...B.dbr1Out)), dShown = ramp(t, B.dbr1In[0], B.dbr1In[0] + 1.4) * (1 - ramp(t, B.dbr1Out[1] - 1.2, B.dbr1Out[1]));
        dbr1.position.copy(DBR1_AWAY).multiplyScalar(1 - dIn + dOut);
        const dv = dShown < .002 ? 0 : dShown > .998 ? 1 : dShown; fade(dbr1Mesh.material, dv); dbr1.visible = dv > 0;
        at.dbr1 = dv;

        // The spliceosome: the C complex for the step that introduces it, the P complex at the start of the second
        // reaction; each cut open once in view, and gone before the camera closes in on the core.
        const cIn = arriving(t, MOVE.core) * leaving(t, MOVE.first), pIn2 = arriving(t, MOVE.second) * leaving(t, MOVE.dive2);
        const open = Math.max(ramp(t, T.core + 2.6, T.core + 4.6), t > T.second - 2 ? 1 : 0), cu = cuts[t > T.second - 2 ? 1 : 0];
        cutDir.copy(cu.dir); cut.normal.copy(cu.dir).negate(); cut.constant = mix(cu.front, cu.deep, smooth(open));
        // (Cut open: the plane below the envelope's front, with 2 Å to spare for its unsampled points.)
        const cutting = cut.constant < cu.front - 18;
        // (Eased, so each fade meets opaque gently: an envelope's fade is steepest near opaque, where what lies behind its
        // nearest surface goes from seen to hidden.)
        opacityEnv(envC, smooth(cIn), cutting && cu === cuts[0]); opacityEnv(envP, smooth(pIn2), cutting && cu === cuts[1]);
        at.envelopes = {C: {shown: envC.shown, cap: envC.cap}, P: {shown: envP.shown, cap: envP.cap}};
        // Their RNA: the outer snRNA and pre-mRNA with the envelope; the core snRNA on into the close-up. Each comes in
        // once its envelope is opaque (drawn first, so the see-through strands blend over it): fading in with it, a strand
        // inside would be seen through the envelope's fade and then hidden by it, or (drawn before the envelope's cut
        // face, behind it) blot the cut face out.
        const within = m => ramp(t, moveEnd(m) + .6, moveEnd(m) + 1.2);
        opacityCartoons(snC.outer, within(MOVE.core) * leaving(t, MOVE.first)); opacityStrand(preC, within(MOVE.core) * leaving(t, MOVE.first));
        opacityCartoons(snC.core, within(MOVE.core) * leaving(t, MOVE.lariat));
        opacityCartoons(snP.outer, within(MOVE.second) * leaving(t, MOVE.dive2)); opacityStrand(preP, within(MOVE.second) * leaving(t, MOVE.dive2));
        opacityCartoons(snP.core, within(MOVE.second) * leaving(t, MOVE.joined));
        for (const x of [...snC.core, ...snC.outer, ...snP.core, ...snP.outer]) if (x.shown > 0) x.st.view(pxPerA);
        for (const x of [preC, preP]) if (x.shown > 0) x.st.view(pxPerA);

        // The atoms and their reactions.
        // (They come in as the camera closes in on them, small at first in the middle of the view.)
        const a1 = ramp(t, moveStart(MOVE.first) + .1, moveStart(MOVE.first) + 1) * leaving(t, MOVE.lariat);
        const a2 = ramp(t, moveStart(MOVE.dive2) + .1, moveStart(MOVE.dive2) + 1) * leaving(t, MOVE.joined);
        opacityChem(chem1, a1); opacityChem(chem2, a2);
        if (a1 > 0) poseChem(chem1, smooth(ramp(t, ...B.near1)), ramp(t, ...B.swap1), smooth(ramp(t, ...B.leave1)));
        if (a2 > 0) poseChem(chem2, smooth(ramp(t, ...B.near2)), ramp(t, ...B.swap2), smooth(ramp(t, ...B.leave2)));
        arrow1.opacity(a1 * ramp(t, B.arrow1, B.arrow1 + .8) * (1 - ramp(t, B.swap1[0], B.swap1[0] + .8)));
        arrow2.opacity(a2 * ramp(t, B.arrow2, B.arrow2 + .8) * (1 - ramp(t, B.swap2[0], B.swap2[0] + .8)));
        const dist = (ch, i) => ch.atoms.positions[i].distanceTo(ch.atoms.positions[ch.P]);
        const named = (ch, i) => { const r = ch.data.residues[ch.data.atoms.residue[i]]; return `${r.chain}${r.num}${r.letter}:${ch.data.atoms.name[i]}`; };
        at.chem1 = {shown: chem1.shown, attack: dist(chem1, chem1.nuc), leave: dist(chem1, chem1.leave), swap: ramp(t, ...B.swap1), names: [chem1.nuc, chem1.P, chem1.leave].map(i => named(chem1, i))};
        at.chem2 = {shown: chem2.shown, attack: dist(chem2, chem2.nuc), leave: dist(chem2, chem2.leave), swap: ramp(t, ...B.swap2), names: [chem2.nuc, chem2.P, chem2.leave].map(i => named(chem2, i))};
        at.time = t;
      },
      annotate(t, {label, tag, bracket}) {
        const col = c0 => ({color: hex(c0)});
        const A = (ch, i) => toWorld(ch.atoms.positions[i]);
        const base = (ch, num) => toWorld(ch.atoms.centre(ch.atoms.select(k => ch.data.residues[ch.atoms.residueOf[k]].num === num && ch.atoms.part(k) === 'base')));
        const resCentre = (ch, part) => toWorld(ch.atoms.centre(ch.atoms.select(k => ch.data.part[k] === part)));
        const nt = i => pre.world(i), tipAt = i => pre.tip(i);
        // An envelope named at its right- or left-hand side (in the view), where the cutaway leaves it, a third of the
        // way down.
        const edge = (e, side = 1) => { const pts = e.sample.filter(kept), x = V(side, 0, 0), y = V(0, 1, 0); if (!pts.length) return SITE;
          const lo = Math.min(...pts.map(p => p.dot(y))), hi = Math.max(...pts.map(p => p.dot(y))), band = pts.filter(p => Math.abs(p.dot(y) - mix(lo, hi, .35)) < (hi - lo) * .12);
          return (band.length ? band : pts).reduce((a, b) => b.dot(x) > a.dot(x) ? b : a); };
        // Nothing is named while the camera moves from one place to another.
        if ([MOVE.core, MOVE.first, MOVE.lariat, MOVE.second, MOVE.joined].some(m => t > moveStart(m) && t < moveEnd(m) - .3)) return;
        if (t < T.core) {
          if (t > 1.2) { tag(pre.centre(2, 8), 'Exon 1', col(SPLICING.exon)); tag(pre.centre(58, 64), 'Exon 2', col(SPLICING.exon)); }
          if (t > 2 && t < 7.4) label(tipAt(E1), '5′ splice site', 'GU, at the intron’s 5′ end', col(SPLICING.intron));
          if (t > 4.6) label(tipAt(BR), 'Branch site', 'Its A is critical', {...col(BASES.A), below: true});
          if (t > 7.4) label(tipAt(E2 - 1), '3′ splice site', 'AG, at the intron’s 3′ end', col(SPLICING.intron));
          if (t > 9) bracket(nt(BR), nt(E2), '18–40 nucleotides');
        } else if (t < T.first) {
          if (t > moveEnd(MOVE.core) && t < T.core + 6.6) label(edge(envC), 'Spliceosome', 'Larger than a ribosome', col(PROTEIN));
          if (t > T.core + 5.4) label(toWorld(preC.st.points[preC.list.findIndex(x => x.num === -1)]), 'pre-mRNA', 'Its 5′ splice site beside the branch site', col(SPLICING.exon));
          if (t > T.core + 6.6) {
            const sn = snC.core.concat(snC.outer);
            for (const key of ['U2', 'U5', 'U6']) { const x = sn.filter(y => y.key === key).sort((a, b) => b.points.length - a.points.length)[0]; if (x) tag(x.points[Math.floor(x.points.length / 2)], `${key} snRNA`, col(SNRNA[key])); }
          }
        } else if (t < T.lariat) {
          if (t < moveEnd(MOVE.first)) return;
          const ch = chem1;
          tag(resCentre(ch, 0), 'Exon 1', col(SPLICING.exon));
          tag(base(ch, 144), 'A', col(BASES.A)); tag(base(ch, 1), 'G', col(BASES.G));
          if (t < B.swap1[0] + .4) {
            label(A(ch, ch.nuc), '2′-OH', 'Of the branch-site A', col(BOND));
            if (t > T.first + 3.4) label(A(ch, ch.P), '5′ splice site', 'Exon 1 bonded to the intron’s G', {...col(SPLICING.intron), side: 'left'});
          } else if (t < B.leave1[0] + 1.2) {
            label(A(ch, ch.nuc).lerp(A(ch, ch.P), .5), '2′–5′ bond', 'The A joined to the intron’s 5′ G', col(BOND));
          } else {
            label(A(ch, ch.nuc).lerp(A(ch, ch.P), .5), '2′–5′ bond', 'The A joined to the intron’s 5′ G', col(BOND));
            label(A(ch, ch.leave), '3′-OH', 'Exon 1, cut free', {...col(SPLICING.exon), side: 'left'});
          }
        } else if (t < T.second) {
          if (t < moveEnd(MOVE.lariat)) return;
          tag(pre.centre(2, 8), 'Exon 1', col(SPLICING.exon)); tag(pre.centre(58, 64), 'Exon 2', col(SPLICING.exon));
          if (t > B.fold[1] && t < B.cut[0] + .6) label(tipAt(BR), 'Branch site A', 'Beside the 5′ splice site', col(BASES.A));
          // (The lariat named once exon 1 has moved off it.)
          if (t > B.cut[1]) label(pre.points[BR].clone().lerp(pre.points[E1], .5), '2′–5′ bond', 'The branch point', col(BOND));
          if (t > B.park[0] + 1.6) label(nt(E1 + 11), 'Lariat', 'The intron, looped and branched', {...col(SPLICING.intron), side: 'left', below: true});
          if (t > B.park[1]) label(nt(E1 - 1), '3′-OH', 'Exon 1, freed', {...col(SPLICING.exon), side: 'left'});
        } else if (t < T.joined) {
          if (t < moveEnd(MOVE.second) - .4) return;
          if (t < moveStart(MOVE.dive2)) {
            if (t > moveEnd(MOVE.second)) label(edge(envP, -1), 'Spliceosome', 'Exon 1 held beside the 3′ splice site', {...col(PROTEIN), side: 'left'});
            return;
          }
          if (t < moveEnd(MOVE.dive2)) return;
          const ch = chem2;
          tag(resCentre(ch, 0), 'Exon 1', col(SPLICING.exon)); tag(resCentre(ch, 1), 'Exon 2', col(SPLICING.exon));
          tag(base(ch, 113), 'G', col(BASES.G));
          if (t < B.swap2[0] + .4) {
            label(A(ch, ch.nuc), '3′-OH', 'Of exon 1', col(BOND));
            if (t > B.arrow2 + .8) label(A(ch, ch.P), '3′ splice site', 'After the intron’s AG', {...col(SPLICING.intron), side: 'left'});
          } else {
            label(A(ch, ch.nuc).lerp(A(ch, ch.P), .5), 'Exons joined', 'A new phosphodiester bond', col(SPLICING.exon));
            if (t > B.leave2[0] + 1) label(A(ch, ch.leave), '3′-OH', 'The intron released', {...col(SPLICING.intron), side: 'right', below: true});
          }
        } else if (t < T.debranch) {
          if (t < moveEnd(MOVE.joined)) return;
          if (t > B.join[1]) label(nt(E1 - 1).lerp(nt(E2), .5), 'Exons joined', 'Exon 1 ligated to exon 2', col(SPLICING.exon));
          if (t > B.release[0] + 1) label(nt(E1 + 11), 'Intron lariat', 'Released, still a lariat', {...col(SPLICING.intron), side: 'left'});
        } else if (t < T.degrade) {
          if (t > B.dbr1In[1] - .6 && t < B.dbr1Out[0]) label(dbr1World()[0] ? (() => { const p = dbr1World(); return p.sort((a, b) => a.y - b.y)[0]; })() : SITE, 'Debranching enzyme', 'Cuts the 2′–5′ bond', col(DBR1));
          if (t > B.open[1] - 1.5) label(nt(E1 + 6), 'Linear RNA', 'The intron, debranched', col(SPLICING.intron));
        } else {
          if (t > T.degrade + 1) tag(nt(E1 - 1).lerp(nt(E2), .5), 'Exons joined', col(SPLICING.exon));
          if (t > B.degrade[0] && t < B.degrade[1] - .4) label(nt(Math.round(mix(E1 + 2, BR, smooth(ramp(t, ...B.degrade)) * .6 + .2))), 'Degraded', 'Rapidly, in the nucleus', col(SPLICING.intron));
        }
      },
    };
  },
});
