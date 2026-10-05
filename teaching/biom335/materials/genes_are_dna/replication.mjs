// Scene: DNA replication is semiconservative. A replication fork moves along a parental duplex (both strands blue;
// ideal B-DNA) and leaves two daughter duplexes behind it, each keeping one parental strand beside a new one (gold).
// The fork is laid out as bacteriophage T7's is (Gao et al. 2019). The parental strands part at the
// leading-strand DNA polymerase (T7 gp5 with thioredoxin, PDB 1T7P), which copies one of them continuously. The
// other runs up through the ring of the DNA helicase (T7 gp4, PDB 6N7I), which stands across the parental duplex,
// and over to a second polymerase that copies it in pieces, since new strands grow only 5′→3′: the leading strand is
// made continuously, the lagging strand in Okazaki fragments, each joined to the one before it a while after it is
// finished. Replication began off to the left before the scene opens. The proteins keep their orientation as they
// move, and the DNA's helical phase is not matched under them.
import * as THREE from 'three';
import {runScene} from '../shared/scene_player.mjs';
import {loadSurfaceSet, surfaceGeometry, proteinMaterial, fadeObject, NIGHT} from '../shared/molecules.mjs';
import {pairsFromStrands, frameFromPairs, meanLocal, sequencePairs, createDuplex, RISE, TWIST} from '../shared/dna.mjs';
import {STRANDS} from '../shared/strands.mjs';
import {boxAround} from '../shared/camera.mjs';
import {ramp, clamp, mix, quintic} from '../shared/ease.mjs';

const V = (...a) => new THREE.Vector3(...a);
const hex = c => '#' + c.toString(16).padStart(6, '0');
const T = {fork: 10, close: 21, enzymes: 32, pieces: 43, kept: 56, end: 68};
const OLD = 0x4f7fe0, NEW = 0xf1dcaa, HELICASE = 0x5cbf9a, POLYMERASE = 0xe0937a;
// Once the lagging strand is named, every other piece of it is a deeper shade of new DNA, so the pieces stay apart to
// the eye after they are joined.
const PIECE_SHADE = 0xdcb77e;
// The parental duplex runs on far enough ahead of the fork for the whole scene.
const NP = 225, X_START = -105 * RISE, X_END = X_START + (NP - 1) * RISE;
const SEQ = Array.from({length: NP}, (_, i) => 'ACGT'[(i * 7 + (i >> 2) + (i >> 4)) % 4]).join('');
// The fork: where it is at t = 0 and how fast it moves (Å/s).
const FORK = {x0: X_START + 380, v: 4};
// The fork's shape, from where the parental strands part (Å). Strand b runs straight on into the leading
// polymerase. Strand a turns up (radius R0), rises through the helicase ring to STEM above the parental duplex's
// axis, and turns over (radius R1) into the lagging arm. RING_Y is the height of the ring's centre.
const R0 = 12, STEM = 97, R1 = 35, RING_Y = -66;
// The polymerases' active sites behind the fork along each arm (Å), the length of a lagging-strand piece (an Okazaki
// fragment), and how fast the lagging polymerase copies relative to the fork.
const LEAD = 58, LAG = 170, FRAG = 16 * RISE, SYNTH = 1.2;
// Piece k of the lagging strand starts (its 5′ end) at parental x = PIECE0 + k·FRAG, LAG behind the fork. Piece 0
// starts a second before the polymerases are named, so both are at work while they are. A piece is made up to GAP
// pairs short of the one before it (in GROW seconds); JOIN seconds later the gap fills (in FILL seconds) and the two
// are joined. So the pieces near the fork show apart while the strands are named, and further back the lagging
// strand is whole.
const GAP = 4, JOIN = 30, FILL = 1.6;
const PIECE0 = FORK.x0 - LAG + FORK.v * (T.enzymes - 1), GROW = (FRAG - GAP * RISE) / (SYNTH * FORK.v);

// The lagging arm's path, fork-relative (world −y is up): the point at arc length s behind the fork, and the
// direction of increasing s. Ahead of the fork (s < 0) it is the parental duplex's axis.
const A1 = Math.PI / 2 * R0, A2 = A1 + STEM - R0, A3 = A2 + Math.PI / 2 * R1;
function lagging(s, p, d) {
  if (s < 0) { p.set(-s, 0, 0); d.set(-1, 0, 0); }
  else if (s < A1) { const a = s / R0; p.set(-R0 * Math.sin(a), -R0 * (1 - Math.cos(a)), 0); d.set(-Math.cos(a), -Math.sin(a), 0); }
  else if (s < A2) { p.set(-R0, -R0 - (s - A1), 0); d.set(0, -1, 0); }
  else if (s < A3) { const a = (s - A2) / R1; p.set(-R0 - R1 + R1 * Math.cos(a), -STEM - R1 * Math.sin(a), 0); d.set(-Math.sin(a), -Math.cos(a), 0); }
  else { p.set(-R0 - R1 - (s - A3), -STEM - R1, 0); d.set(-1, 0, 0); }
}

const NOTES = 'dna-replication-is-semiconservative', FORK_NOTES = 'polymerases-act-on-separated-dna-strands-at-the-replication-fork';
const steps = [
  {t: 0, nav: 'A template for copying', title: 'Each strand holds<br>the other’s sequence.', notes: NOTES, hold: 1.1,
    text: 'DNA’s structure allows it to be replicated with high fidelity. Its two strands are joined only by relatively weak hydrogen bonds, so they can separate, and the specificity of base pairing lets each strand act as the template for the synthesis of the other.'},
  {t: T.fork, nav: 'Two daughter duplexes', title: 'Each daughter keeps<br>one parental strand.', notes: NOTES, hold: 1.1,
    text: 'The parental duplex is replicated to form two daughter duplexes, each identical in sequence to the parent and each consisting of one parental strand and one newly synthesised strand: semiconservative replication.'},
  {t: T.close, nav: 'The replication fork', title: 'A small region<br>is unwound at a time.', notes: FORK_NOTES, hold: 1.1,
    text: 'Separating the two strands is called denaturation; it is reversible, and the reverse is renaturation. Only a small region of the duplex is denatured at any time: the replication fork, which moves along the parental duplex and exposes both parental strands as templates.'},
  {t: T.enzymes, nav: 'Polymerases and helicase', title: 'DNA polymerases<br>make the new strands.', notes: FORK_NOTES, hold: 1.1,
    text: 'DNA polymerases recognise the template strand and catalyse the addition of nucleotides to the polynucleotide chain being synthesised. They are assisted by other proteins, such as DNA helicase, which unwinds the DNA.'},
  {t: T.pieces, nav: 'Leading and lagging', title: 'One new strand<br>is made in pieces.', notes: FORK_NOTES, hold: 1.1,
    text: 'DNA polymerase adds nucleotides only to a 3′ end, and the two parental strands are antiparallel. So one daughter strand, the leading strand, is made continuously as the fork moves, while the other, the lagging strand, is made in short pieces, Okazaki fragments, that are later joined.'},
  {t: T.kept, nav: 'Strands pass on whole', title: 'A strand, once made,<br>stays whole.', notes: NOTES,
    text: 'A single strand of DNA, once created, continues to exist in the daughter duplexes. None of the DNA from one strand ever becomes part of the other strand.'},
];

const fork = t => FORK.x0 + FORK.v * t;
const at = {fork: V(), lead: V(), lag: V()};
// Shots look from behind the fork's plane, so it moves right to left and the proteins and daughters sit to the right
// of the text. Each fits what it shows into the free part of the screen (a box, measured in build(): at.views), so
// nothing stands behind the step list, the narration or the buttons. What a shot shows of the DNA is also limited:
// the parental duplex up to `hi` (world x) ahead of the fork, the lagging arm's daughter back to `lo` behind it (the
// lower daughter runs on out of the view to the right); beyond these the DNA fades into the dark over FADE, except
// where the DNA itself ends. The first and last shots show it all; the close view of the fork follows the fork, as
// the polymerases' view does; the daughters' view and the strands' view hold still over the fork's path (so the DNA
// and its labels keep still while the fork and polymerases move on).
const FADE = 10 * RISE;
const SHOTS = [
  {t: 0, view: 'wide', dir: [-.08, -.15, 1], win: () => ({hi: X_END, lo: X_START})},
  {t: T.fork, blend: 2.8, view: 'daughters', dir: [-.1, -.12, 1], win: () => ({hi: 240, lo: X_START})},
  {t: T.close, blend: 3, view: 'close', follow: true, dir: [-.75, .28, 1], win: t => ({hi: fork(t) + 85, lo: fork(t) - 110})},
  {t: T.enzymes, blend: 3, view: 'enzymes', follow: true, dir: [-.2, -.08, 1], win: t => ({hi: fork(t) + 115, lo: X_START})},
  {t: T.pieces, blend: 2.8, view: 'pieces', dir: [-.14, -.1, 1], win: () => ({hi: fork(T.kept) + 75, lo: X_START})},
  {t: T.kept, blend: 3.2, view: 'wide', dir: [-.08, -.15, 1], win: () => ({hi: X_END, lo: X_START})},
];
// The DNA shown at time t, blended from shot to shot as the camera is (the player's quintic blends, which begin a
// little before their step and are shorter with reduced motion).
const windowAt = (t, calm) => {
  let w = SHOTS[0].win(t);
  for (const s of SHOTS.slice(1)) {
    const b = calm ? Math.min(s.blend, 1.2) : s.blend, u = quintic((t - s.t + .35 * b) / b);
    if (u <= 0) break;
    const n = s.win(t); w = {hi: mix(w.hi, n.hi, u), lo: mix(w.lo, n.lo, u)};
  }
  return w;
};

runScene({
  pageTitle: 'DNA replication · Genes are DNA', eyebrow: 'Semiconservative replication',
  links: [{href: 'index.html', text: 'All scenes'}],
  steps, duration: T.end, notesPage: 'notes.html', fov: 30, fog: .00012, loop: false,
  shots: SHOTS.map(({t, blend, view, follow}) => ({t, blend, frame: () => {
    const v = at.views[view];
    return {...v, target: follow ? v.target.clone().add(at.fork) : v.target, fill: .92};
  }})),
  async build({world, progress}) {
    const [helix, set] = await Promise.all([loadSurfaceSet('assets/helix.json', 'assets/helix.bin'), loadSurfaceSet('assets/replication.json', 'assets/replication.bin', progress)]);
    const hs = n => helix.meta.strands.find(s => s.name === n), crystal = pairsFromStrands(hs('a'), hs('b')); frameFromPairs(crystal);
    const local = meanLocal(crystal.slice(1, -1));
    const duplex = colours => { const d = createDuplex({pairs: sequencePairs(SEQ, local), template: colours[0], coding: colours[1], widths: [.95, .95], samples: 3}); world.add(d.group); return d; };
    // The parent, and the two daughters: the leading arm (lower) keeps parental strand b, the lagging arm (upper)
    // parental strand a.
    const parent = duplex([OLD, OLD]), upper = duplex([OLD, NEW]), lower = duplex([NEW, OLD]);

    // Proteins, each in a group placed by a local anchor, axis and side.
    const mesh = (name, colour) => { const g = new THREE.Group(), geometry = surfaceGeometry(set.byName.get(name), set.buffer); g.add(new THREE.Mesh(geometry, proteinMaterial(colour))); world.add(g); g.userData.geometry = geometry; return g; };
    const polymerases = [mesh('DNA polymerase', POLYMERASE), mesh('DNA polymerase', POLYMERASE)], helicase = mesh('Helicase', HELICASE);
    const ss = n => set.meta.strands.find(s => s.name === n);
    // The polymerase: its primer–template duplex's axis, pointing the way the primer grows (template 5′→3′ is the
    // pair frames' z), and its active site, the pair at the primer's 3′ end.
    const pp = pairsFromStrands(ss('template'), ss('primer')), pf = frameFromPairs(pp);
    const polAxis = pf.reduce((sum, f) => sum.add(V(0, 0, 1).applyQuaternion(f.q)), V()).normalize().negate();
    const site = pf[pp.reduce((best, p, i) => p.b.num > pp[best].b.num ? i : best, 0)].origin;
    // The polymerase's thinnest side across its axis, turned towards the helicase so the two sit close.
    const thinSide = (geometry, origin, axis) => {
      const e1 = V(0, 0, 1).cross(axis).normalize(), e2 = axis.clone().cross(e1), p = geometry.attributes.position, v = V(), n = V();
      let best = null, low = Infinity;
      for (let k = 0; k < 72; k++) {
        const a = k * Math.PI / 36; n.copy(e1).multiplyScalar(Math.cos(a)).addScaledVector(e2, Math.sin(a));
        let high = -Infinity; for (let i = 0; i < p.count; i++) high = Math.max(high, v.fromBufferAttribute(p, i).sub(origin).dot(n));
        if (high < low) { low = high; best = n.clone(); }
      }
      return best;
    };
    const polSide = thinSide(polymerases[0].userData.geometry, site, polAxis);
    // The helicase ring: its axis (the direction of least spread), pointing 5′→3′ along the strand it encircles,
    // the direction it moves; and its centre.
    const hg = helicase.userData.geometry.attributes.position, hc = V(), hv = V();
    for (let i = 0; i < hg.count; i++) hc.add(hv.fromBufferAttribute(hg, i)); hc.divideScalar(hg.count);
    const cov = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    for (let i = 0; i < hg.count; i++) { hv.fromBufferAttribute(hg, i).sub(hc); const a = hv.toArray(); for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) cov[r * 3 + c] += a[r] * a[c]; }
    const ringAxis = leastSpread(cov), ssb = ss('ssDNA').backbone;
    if (ringAxis.dot(V(...ssb[ssb.length - 1]).sub(V(...ssb[0]))) < 0) ringAxis.negate();
    // Maps a local frame (axis, side) onto a world one; the group then puts `anchor` at `to`.
    const orient = (group, axis, side, toAxis, toSide, anchor, to) => {
      const m = new THREE.Matrix4().makeBasis(axis, side, axis.clone().cross(side)), w = new THREE.Matrix4().makeBasis(toAxis, toSide, toAxis.clone().cross(toSide));
      group.quaternion.setFromRotationMatrix(w.multiply(m.transpose()));
      group.position.copy(to).sub(anchor.clone().applyQuaternion(group.quaternion));
    };
    const ringSide = V(0, 0, 1).cross(ringAxis).normalize();
    const centreOf = group => V(...set.byName.get(group === helicase ? 'Helicase' : 'DNA polymerase').center).applyQuaternion(group.quaternion).add(group.position);

    const frames = {parent: Array.from({length: NP}, () => ({origin: V(), q: new THREE.Quaternion()})), upper: Array.from({length: NP}, () => ({origin: V(), q: new THREE.Quaternion()}))};
    const Z = V(0, 0, 1), zz = V(), yy = V(), m4 = new THREE.Matrix4(), q0 = new THREE.Quaternion(), qt = new THREE.Quaternion(), p = V(), d = V();
    // A pair's frame at a path point: its axis along the path (towards higher pair numbers), a fixed reference
    // across it (the path is flat), and the helix's twist.
    const setFrame = (f, i, x, y) => {
      f.origin.set(x, y, 0); zz.copy(d).negate(); yy.crossVectors(zz, Z);
      q0.setFromRotationMatrix(m4.makeBasis(Z, yy, zz)); f.q.copy(qt.setFromAxisAngle(zz, i * TWIST)).multiply(q0);
    };
    const idx = x => (x - X_START) / RISE;

    // The lagging strand at time t: its pieces as pair ranges [3′ end, 5′ end] with their colours (a piece joined to
    // the one before it meets it end to end), how many are begun and how many stand apart, and the newest piece's 3′
    // end and when it was begun.
    const piecesAt = t => {
      const f = fork(t), ranges = [], last = Math.floor((f - LAG - PIECE0) / FRAG);
      const shade = new THREE.Color(NEW).lerp(new THREE.Color(PIECE_SHADE), ramp(t, T.pieces + .6, T.pieces + 2.4)).getHex();
      let apart = 0, end = 0, t0 = 0;
      for (let k = Math.floor((X_START - PIECE0) / FRAG) + 1; k <= last; k++) {
        const start = PIECE0 + k * FRAG; t0 = (start + LAG - FORK.x0) / FORK.v;
        // Made 5′→3′, away from the fork, up to GAP pairs short of the piece before it; later joined to that piece.
        const fill = GAP * RISE * ramp(t, t0 + GROW + JOIN, t0 + GROW + JOIN + FILL);
        end = start - Math.min(FRAG - GAP * RISE, SYNTH * FORK.v * (t - t0)) - fill;
        if (!ranges.length || fill < GAP * RISE) apart++;
        ranges.push([Math.max(0, idx(end)), idx(start), k % 2 ? shade : NEW]);
      }
      return {ranges, end, t0, made: ranges.length, apart};
    };
    // A strand's backbone at a parental position x (between pairs), for labels that must not step from pair to pair.
    const along = (backbone, x) => { const i = Math.max(0, Math.min(NP - 1.001, idx(x))), k = Math.floor(i); return backbone[k].clone().lerp(backbone[k + 1], i - k); };

    // What each shot shows, for the camera to fit. The proteins sit where they are for a fork at x = 0 (the lagging
    // polymerase anywhere along the piece it makes), and the DNA as its axes, with its radius round them.
    const placeProteins = (f, s) => {
      orient(helicase, ringAxis, ringSide, V(0, 1, 0), V(1, 0, 0), hc, V(f - R0, RING_Y, 0));
      orient(polymerases[0], polAxis, polSide, V(1, 0, 0), V(0, -1, 0), site, V(f - LEAD, 0, 0));
      lagging(s, p, d); orient(polymerases[1], polAxis, polSide, d.clone(), V(0, 1, 0), site, V(f + p.x, p.y, 0));
    };
    const surface = (group, every = 23) => {
      group.updateMatrixWorld(true); const g = group.userData.geometry.attributes.position, out = [];
      for (let i = 0; i < g.count; i += every) out.push(V().fromBufferAttribute(g, i).applyMatrix4(group.matrixWorld));
      return out;
    };
    const proteinsAt = (f, lag = true) => [LAG, LAG + FRAG / 2, LAG + FRAG].flatMap((s, k) => {
      placeProteins(f, s); return [...(k ? [] : [...surface(helicase), ...surface(polymerases[0])]), ...(lag ? surface(polymerases[1]) : [])];
    });
    const R_DNA = 11, tube = (a, b) => { const out = [], n = Math.max(1, Math.ceil(a.distanceTo(b) / 12));
      for (let i = 0; i <= n; i++) { const c = a.clone().lerp(b, i / n); out.push(c.clone().add(V(0, R_DNA, 0)), c.clone().add(V(0, -R_DNA, 0)), c.clone().add(V(0, 0, R_DNA)), c.clone().add(V(0, 0, -R_DNA))); }
      return out; };
    // The lagging arm (fork-relative) from the fork back to arc length s1, and along the axis of the parental duplex
    // and lower daughter from x0 to x1.
    const arm = (f, s1) => { const out = []; for (let s = 0; s <= s1; s += 8) { lagging(s, p, d); out.push(V(f + p.x, p.y, 0)); } return out.flatMap((q, i, all) => i ? tube(all[i - 1], q) : []); };
    const axisOf = (x0, x1) => tube(V(x0, 0, 0), V(x1, 0, 0));
    const fit = (points, dir) => boxAround(points, dir, {margin: 4, fov: 30});
    const dirOf = view => SHOTS.find(s => s.view === view).dir;
    at.views = {
      wide: fit([...axisOf(X_START, X_END), ...arm(fork(0), fork(0) - X_START), ...arm(fork(T.end), fork(T.end) - X_START), ...proteinsAt(fork(0)), ...proteinsAt(fork(T.end))], dirOf('wide')),
      daughters: fit([...axisOf(X_START, 240), ...arm(fork(T.fork), fork(T.fork) - X_START), ...arm(fork(T.close), fork(T.close) - X_START), ...proteinsAt(fork(T.fork)), ...proteinsAt(fork(T.close))], dirOf('daughters')),
      close: fit([...axisOf(-110, 85), ...arm(0, 110), ...proteinsAt(0, false)], dirOf('close')),
      enzymes: fit([...axisOf(-210, 115), ...arm(0, LAG + FRAG + 12), ...proteinsAt(0)], dirOf('enzymes')),
      pieces: fit([...axisOf(-140, fork(T.kept) + 75), ...arm(fork(T.pieces), fork(T.pieces) + 140), ...arm(fork(T.kept), fork(T.kept) + 140), ...proteinsAt(fork(T.pieces)), ...proteinsAt(fork(T.kept))], dirOf('pieces')),
    };

    // The DNA within the shot's window: each strand's stretches [from, to, colour] (pairs, drawn end to end), cut to
    // the window and, over FADE at its edges, split pair by pair into stretches darkening into the night (by the cube
    // of the level, which looks even: a lit strand keeps looking bright until it is quite dark); and the base-pair
    // bonds' colours to match (as a strand's own, or its stretch's, a shade darker, as segments() has them).
    const NIGHT_C = new THREE.Color(NIGHT), cc = new THREE.Color(), RUNG = [STRANDS.rung.template, STRANDS.rung.coding];
    const levels = new Float32Array(NP);
    const faded = (duplex, k, stretches, level, own = false) => {
      for (let i = 0; i < NP; i++) levels[i] = level(X_START + i * RISE) ** 3;
      const out = [];
      for (const [a0, b0, colour] of stretches) {
        const a = Math.max(0, Math.round(a0)), b = Math.min(NP - 1, Math.round(b0));
        let run = -1;
        for (let i = a; i < b; i++) {
          const v = Math.min(levels[i], levels[i + 1]);
          if (v > .995) { if (run < 0) run = i; continue; }
          if (run >= 0) { out.push([run, i, colour]); run = -1; }
          if (v > .01) out.push([i, i + 1, cc.set(colour).lerp(NIGHT_C, 1 - v).getHex()]);
        }
        if (run >= 0) out.push([run, b, colour]);
      }
      duplex.segments(k, out);
      // The bonds: a pair's colour for each stretch (the full stretches'), dimmed by its level.
      const r = duplex.rungs[k];
      for (let i = 0; i < NP; i++) r.setColorAt(i, cc.set(RUNG[k]).lerp(NIGHT_C, 1 - levels[i]));
      if (own) for (const [a0, b0, colour] of stretches) for (let i = Math.max(0, Math.round(a0)); i <= Math.min(NP - 1, Math.round(b0)); i++) r.setColorAt(i, cc.set(colour).multiplyScalar(.8).lerp(NIGHT_C, 1 - levels[i]));
      r.instanceColor.needsUpdate = true;
    };

    // For tests (?debug=1): points of what is drawn now (world coordinates): the DNA as far as it shows, every other
    // pair, and the proteins shown.
    at.shown = () => {
      const f = fork(at.time), win = at.window, out = [];
      for (let i = 0; i < NP; i += 2) {
        const x = X_START + i * RISE;
        if (x >= f && x < Math.min(win.hi - .3 * FADE, X_END + 1)) out.push(parent.world.aBackbone[i], parent.world.bBackbone[i]);
        if (x < f && (win.lo <= X_START + .01 || x > win.lo + .3 * FADE)) out.push(upper.world.aBackbone[i], upper.world.bBackbone[i]);
        if (x < f) out.push(lower.world.aBackbone[i], lower.world.bBackbone[i]);
      }
      for (const g of [helicase, ...polymerases]) if (g.visible) out.push(...surface(g, 61));
      return out.map(v => v.toArray());
    };

    return {
      parent, upper, lower, at,  // for tests (?debug=1)
      update(t, {pxPerA = 1, calm = false} = {}) {
        const f = fork(t), iF = Math.max(0, Math.min(NP, Math.ceil(idx(f)))); at.fork.set(f, 0, 0);
        for (let i = 0; i < NP; i++) {
          const x = X_START + i * RISE;
          d.set(-1, 0, 0); setFrame(frames.parent[i], i, x, 0);
          lagging(f - x, p, d); setFrame(frames.upper[i], i, f + p.x, p.y);
        }
        // What the shot shows: the parental duplex up to hi, the lagging arm back to lo (each fading over FADE; not at
        // the DNA's own ends).
        const win = windowAt(t, calm); at.window = win; at.time = t;
        const ahead = x => win.hi >= X_END - .01 ? 1 : clamp((win.hi - x) / FADE), behind = x => win.lo <= X_START + .01 ? 1 : clamp((x - win.lo) / FADE);
        // Each daughter's parental strand joins the parent's at the fork, one pair shared.
        faded(parent, 0, [[iF, NP - 1, OLD]], ahead); faded(parent, 1, [[iF, NP - 1, OLD]], ahead);
        faded(upper, 0, [[0, iF, OLD]], behind); faded(lower, 1, [[0, iF, OLD]], () => 1);
        faded(lower, 0, [[0, Math.round(idx(f - LEAD)) - 1, NEW]], () => 1);
        const lag = piecesAt(t); faded(upper, 1, lag.ranges.map(([a, b, c]) => [a, b, c]), behind, true); at.pieces = lag.made; at.apart = lag.apart;
        parent.pose(frames.parent); lower.pose(frames.parent); upper.pose(frames.upper);
        for (const dx of [parent, upper, lower]) dx.view(pxPerA);

        // The helicase stands across the parental duplex, strand a through it, moving 5′→3′ along it (down, to the fork).
        orient(helicase, ringAxis, ringSide, V(0, 1, 0), V(1, 0, 0), hc, V(f - R0, RING_Y, 0));
        // The leading polymerase copies strand b just behind the fork, its thin side up against the helicase.
        at.lead.set(f - LEAD, 0, 0);
        orient(polymerases[0], polAxis, polSide, V(1, 0, 0), V(0, -1, 0), site, at.lead);
        // The lagging polymerase sits at the 3′ end of the piece being made; between pieces it lets go and fades,
        // and it returns at the next piece's start.
        const done = lag.t0 + GROW, s = f - lag.end;
        lagging(s, p, d); at.lag.set(f + p.x, p.y, 0);
        orient(polymerases[1], polAxis, polSide, d.clone(), V(0, 1, 0), site, at.lag);
        // (Out of the shot's window, as in the close view of the fork, it is not drawn.)
        const seen = win.lo <= X_START + .01 ? 1 : ramp(lag.end - win.lo, 30, 70);
        fadeObject(polymerases[1], (t < done ? ramp(t, lag.t0, lag.t0 + .8) : 1 - ramp(t, done, done + .8)) * seen);
      },
      annotate(t, {label, tag}) {
        // Labels on the DNA name fixed pairs, as the DNA away from the fork stays still.
        const f = fork(t), pair = x => Math.max(1, Math.min(NP - 2, Math.round(idx(X_START + x))));
        const P = hex(OLD), N = hex(NEW);
        if (t > 1.6 && t < T.fork) {
          label(parent.world.aBackbone[pair(560)], 'Parental duplex', 'Two strands, joined by base pairs', {color: P});
        } else if (t > T.fork + 2.4 && t < T.close) {
          label(upper.world.aBackbone[pair(170)], 'Parental strand', 'Kept whole', {color: P});
          label(upper.world.bBackbone[pair(125)], 'New strand', 'Made on the parental strand', {color: N});
          tag(lower.world.bBackbone[pair(290)], 'Parental strand', {color: P});
          tag(lower.world.aBackbone[pair(170)], 'New strand', {color: N});
        } else if (t > T.close + 3 && t < T.enzymes) {
          label(V(f, 0, 0), 'Replication fork', 'Moving along the parental duplex', {color: '#f3cf97'});
          tag(V(f + 45, 0, 0), 'Parental duplex', {color: P});
        } else if (t > T.enzymes + 2.6 && t < T.pieces) {
          label(centreOf(helicase), 'DNA helicase', 'Unwinds the DNA', {color: hex(HELICASE)});
          label(centreOf(polymerases[0]), 'DNA polymerase', 'Adds nucleotides to the new strand', {color: hex(POLYMERASE), key: 'leading'});
          if (polymerases[1].visible) label(centreOf(polymerases[1]), 'DNA polymerase', 'Recognises the template strand', {color: hex(POLYMERASE), key: 'lagging'});
        } else if (t > T.pieces + 2.8 && t < T.kept) {
          // The two new strands; then, in the lagging strand's place, one of its pieces: the one before the piece begun
          // as the polymerases are named, clear of the lagging polymerase, with a gap at each end until it is joined
          // just after this step.
          const x = FORK.x0 + FORK.v * T.pieces, named = {
            leading: along(lower.world.aBackbone, x - LEAD - 100),
            lagging: along(upper.world.bBackbone, PIECE0 - FRAG - (FRAG - GAP * RISE) / 2),
          };
          at.named = Object.fromEntries(Object.entries(named).map(([k, v]) => [k, v.toArray()]));
          label(named.leading, 'Leading strand', 'Made continuously as the fork moves', {color: N});
          if (t < T.pieces + 7.2) label(named.lagging, 'Lagging strand', 'Made in short pieces', {color: N});
          else label(named.lagging, 'Okazaki fragment', 'A short piece, later joined', {color: N});
        } else if (t > T.kept + 2.4) {
          label(upper.world.aBackbone[pair(250)], 'Parental strand', 'In one daughter duplex', {color: P});
          // (Its own key, so the two labels of the same name keep their own places.)
          label(lower.world.bBackbone[pair(300)], 'Parental strand', 'In the other', {color: P, key: 'other parental'});
        }
      },
    };
  },
});

// The unit eigenvector of a symmetric 3×3 matrix (row-major) with the smallest eigenvalue: power iteration on
// trace·I − M, whose largest eigenvector it is.
function leastSpread(m) {
  const tr = m[0] + m[4] + m[8], a = [tr - m[0], -m[1], -m[2], -m[3], tr - m[4], -m[5], -m[6], -m[7], tr - m[8]];
  let v = [1, .31, .17];
  for (let k = 0; k < 200; k++) {
    const w = [a[0] * v[0] + a[1] * v[1] + a[2] * v[2], a[3] * v[0] + a[4] * v[1] + a[5] * v[2], a[6] * v[0] + a[7] * v[1] + a[8] * v[2]];
    const n = Math.hypot(...w); v = w.map(x => x / n);
  }
  return V(...v);
}
