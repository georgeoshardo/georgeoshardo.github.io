// Scene: inactive, poised and active genes. A gene in closed chromatin (nucleosomes, 1KX5, packed in a compact
// fibre, one of them over the promoter) opens into beads on a string; the basal apparatus assembles on the free
// promoter in the notes' order (the TFIID-based preinitiation complex 7ENC, with NF-Y on the CCAAT box, 4AWL) and
// waits: a poised gene. A second signal comes from an enhancer 2 kb upstream: its activators (2O61, 1T2K) bind,
// the DNA loops and Mediator, the co-activator, joins them to the basal apparatus. RNAP II then leaves the
// promoter with TFIIF to transcribe the gene, the DNA through it and its RNA as in a transcribing complex (6GMH),
// while TFIIE and TFIIH are released and TFIID, TBP and TFIIB stay. The DNA is one double helix throughout
// (../shared/chromatin.mjs), and each structure holds its own.
import * as THREE from 'three';
import {runScene} from '../shared/scene_player.mjs';
import {fade, fadeObject} from '../shared/molecules.mjs';
import {smooth, ramp} from '../shared/ease.mjs';
import {RISE, TWIST} from '../shared/dna.mjs';
import {assemble, alongPath, zOf, xOf, nucleosomeOpening} from '../shared/chromatin.mjs';
import {geneSetup, COLOUR, PIC_PARTS, NUC_SPAN, NUC_STEP, ENHANCER_TINT, CCAAT_TINT} from './gene_fibre.mjs';

const V = (...a) => new THREE.Vector3(...a);
const EZ = V(0, 0, 1);
const hex = c => '#' + c.toString(16).padStart(6, '0');
const KB0 = 2;                          // kb from the promoter to the enhancer
const FLANK_BP = 3000, DOWN_BP = 4130;  // chromatin drawn beyond the enhancer, and downstream of the promoter
const GRID0 = -40;                      // nucleosomes sit every 200 bp from −40 (over the promoter)
const NTX = 70;                         // base pairs RNAP II transcribes in the scene
const EC_UP = 6, EC_DN = 24;            // 6GMH's DNA drawn upstream and downstream of the active site
const KEEP = -20;                       // TBP and TFIIB keep the promoter's DNA to here as RNAP II leaves
const RNA_STEP = 5.9, RNA = 0xffa259;   // Å between nucleotides of single-stranded RNA; the film's RNA colour
const APPROACH = 90;                    // Å a factor drifts in from as it arrives (and fades in), as in the film
// The basal apparatus assembles in the notes' order: TFIID (with TBP and TFIIA, and NF-Y on the CCAAT box),
// TFIIB, RNAP II with TFIIF, TFIIE, then TFIIH.
const ORDER = {TFIID: 0, TBP: 0, TFIIA: 0, TFIIB: 1, 'RNAP II': 2, TFIIF: 2, TFIIE: 3, TFIIH: 4, CAK: 4};
const MOVES = new Set(['RNAP II', 'TFIIF']), RELEASED = new Set(['TFIIE', 'TFIIH', 'CAK']);

const T = {closed: 0, open: 11, poised: 23, wait: 37, signal: 47, active: 59, end: 76};
const SECTION = 'the-basal-apparatus-assembles-at-the-promoter-of-rnap-ii';
const steps = [
  {t: 0, nav: 'Inactive', title: 'An inactive gene<br>is in closed chromatin.', notes: SECTION,
    text: 'In the cell, promoters can be found in three basic types of chromatin. An inactive gene is in closed chromatin.'},
  {t: T.open, nav: 'Open chromatin', title: 'The chromatin<br>opens.', notes: 'chromatin-must-be-opened-before-transcription-can-occur',
    text: 'The chromatin structure of DNA must be opened before RNA polymerase can bind to the promoter. A potentially active gene, or an active one, is in open chromatin.'},
  {t: T.poised, nav: 'Poised', title: 'A poised gene<br>assembles the basal apparatus.', notes: SECTION, hold: 1.2,
    text: 'A potentially active gene in open chromatin, bound to RNAP, is called a poised gene. It may assemble the basal apparatus: TFIID binds the promoter first and TFIIB joins it; RNAP II arrives with TFIIF, followed by TFIIE and finally TFIIH.'},
  {t: T.wait, nav: 'A second signal', title: 'It waits for<br>a second signal.', notes: SECTION,
    text: 'Poised genes cannot proceed to transcribe the gene without a second signal to initiate transcription.'},
  {t: T.signal, nav: 'From an enhancer', title: 'A signal<br>from an enhancer.', notes: 'enhancer-driven-transcription-factors', hold: 1.1,
    text: 'A second signal can come from an enhancer. Its activators bind specific DNA sites and, as the DNA loops, contact the basal machinery at the promoter, with the co-activator they recruit.'},
  {t: T.active, nav: 'Active', title: 'An active gene:<br>RNAP II transcribes.', notes: SECTION, hold: 1.1,
    text: 'An active gene is in open chromatin. RNAP II leaves the promoter with TFIIF to transcribe the gene; TFIIE and TFIIH are released, while TBP and TFIIB can remain at the promoter.'},
];

// Scene state read by the camera shots (world coordinates).
const at = {};

runScene({
  pageTitle: 'Inactive, poised and active genes · Eukaryotic transcription', eyebrow: 'Inactive, poised, active',
  links: [{href: 'index.html', text: 'All scenes'}, {href: '../protein_browser/?chapter=eukaryotic', text: 'Protein library'}],
  steps, duration: T.end, notesPage: 'notes.html', fov: 30, near: 3, far: 60000, fog: .00001,
  shots: [
    {t: 0, frame: () => ({target: at.closedView || V(), dir: [.1, -.28, -1], radius: at.closedRadius || 1200, fill: .95})},
    {t: T.open, blend: 3.5, frame: () => ({target: at.openView || V(), dir: [.04, -.24, -1], radius: at.openRadius || 1500, fill: .95})},
    {t: T.poised, blend: 3, frame: () => ({target: at.promoterView || V(), dir: [.15, -.3, -1], radius: 420, fill: .92})},
    {t: T.wait, blend: 3, frame: () => ({target: at.linearView || V(), dir: [.05, -.2, -1], radius: at.linearRadius || 1100, fill: .95})},
    {t: T.signal, blend: 3, frame: () => ({target: at.loopView || V(), dir: [-.08, -.22, -1], radius: at.loopRadius || 800, fill: .95})},
    {t: T.active, blend: 3, frame: () => ({target: at.activeView || V(), dir: [.35, .04, -1], radius: at.activeRadius || 460, fill: .92})},
  ],
  async build({world, progress}) {
    const G = await geneSetup({world, progress});
    const {rec, frame, toWorld, picMeshes, mediator, nfyGroup, nfyPose, nfyPts, S, tS, Sdn, tSdn, U, D, complex, tail, up, side, chord,
      enhFrames, EN, LN, modA, modB, nucLocal, NS, nucEnds, pattern, patternClosed, MAXN, octamers, nfyFrames, NFY0, picFrames, PIC0, fibre, chain,
      ecFrames, ntActive, rnaBackbone, rnaBase, wander, loop, sampler, loopPose, blendPose, heading, bulge, away, moduleFrame, I4, IQ,
      basis, centroid, matQ, lengthOf} = G;
    modB.g.visible = false;
    const partOf = new Map(PIC_PARTS.map((n, i) => [n, picMeshes[i]]));
    for (const m of picMeshes) m.matrixAutoUpdate = false;
    const centreOf = name => V(...rec('pic', name).center);
    const picCentre = centroid(PIC_PARTS.map(centreOf));
    const picAt = new Map(picFrames.map(f => [f.num, f])), ecAt = new Map(ecFrames.map(f => [f.num, f]));
    // 6GMH's downstream DNA ends in a few irregular pairs; from its 44th pair on it is drawn as ideal B-DNA.
    for (let n = 45, f = ecAt.get(44); ecAt.has(n); n++) { f = {...G.step(f, 1), num: n}; ecAt.set(n, f); }

    // ---------- The fibre ----------
    // Nucleosomes sit every 200 bp from −40. Closed chromatin has one at every place, in a compact fibre (straight
    // linkers); open chromatin has none over the promoter (−40, +160) or over the enhancer and 60 bp either side,
    // and sets the rest along the fibre as beads on a string, as the enhancer scene does. Each is a whole layout,
    // its fibre as long as its nucleosomes and free DNA need (a nucleosome's pairs take no length along it, a
    // linker next to one carries the repeat, free DNA 3.38 Å a pair); as the chromatin opens, the DNA moves from
    // one layout to the other and the nucleosomes that open chromatin lacks come apart.
    const sE = -KB0 * 1000 - 26, mod = modA, mStart = sE, mEnd = sE + mod.MN - 1, lefFrom = sE + EN + mod.s;
    const FROM = mStart - FLANK_BP, TO = DOWN_BP, N = TO - FROM + 1, idx = bp => Math.max(0, Math.min(N - 1, bp - FROM));
    const centre = g => GRID0 + NUC_STEP * g, G0 = Math.ceil((FROM + 73 - GRID0) / NUC_STEP), G1 = Math.floor((TO - 73 - GRID0) / NUC_STEP);
    const nfr = [mStart - 60, mEnd + 60];
    const openWeight = c => {
      if (c === centre(0) || c === centre(1)) return 0;
      const gap = Math.max(nfr[0] - (c + NUC_SPAN / 2), (c - NUC_SPAN / 2) - nfr[1]);
      return Math.min(1, Math.max(0, gap / 24));
    };
    const LINK = NUC_STEP - NUC_SPAN + 1, HALF = LINK / 2;
    function lengths(weight, repeat) {
      const w = g => g >= G0 && g <= G1 ? weight(centre(g)) : 0, ell = new Float64Array(N);
      for (let i = 1; i < N; i++) {
        // The step before pair FROM + i: in nucleosome k, or in the linker from k to k + 1.
        const u = FROM + i - .5 - GRID0, k = Math.floor((u + (NUC_SPAN - 1) / 2) / NUC_STEP);
        let step;
        if (Math.abs(u - NUC_STEP * k) < NUC_SPAN / 2) step = (1 - w(k)) * RISE;
        else {
          const dIn = u - (NUC_STEP * k + NUC_SPAN / 2), dOut = NUC_STEP * (k + 1) - NUC_SPAN / 2 - u;
          const near = dIn < HALF ? w(k) : dOut < HALF ? w(k + 1) : 0;
          step = near * repeat / LINK + (1 - near) * RISE;
        }
        ell[i] = ell[i - 1] + step;
      }
      return bp => ell[idx(bp)];
    }
    const ellC = lengths(() => 1, patternClosed.rise), ellO = lengths(openWeight, pattern.rise);
    // How each nucleosome sits in the fibre as it opens: every stage a fibre whose linkers are gentle arcs.
    const opening = nucleosomeOpening(nucEnds, patternClosed, {rise: pattern.rise});
    // Closed chromatin: one compact fibre along the gene, its nucleosome at −40 where the promoter's factors sit.
    const C0 = U.clone().add(D).multiplyScalar(.5), lC0 = ellC(GRID0);
    const closedAt = (bp, out = V()) => {
      const l = ellC(bp) - lC0;
      return out.copy(C0).addScaledVector(chord, l).addScaledVector(up, 45 * Math.sin(l / 650)).addScaledVector(side, 35 * Math.sin(l / 1000 + .8));
    };
    // Open chromatin: the enhancer scene's arms, upstream from −90 (where NF-Y's DNA ends) and downstream from +45,
    // with the promoter's free DNA between them on a smooth curve as long as its 135 bp, bulging to one side.
    const upDist = bp => ellO(-90) - ellO(bp), dnDist = bp => ellO(bp) - ellO(45);
    const upLine = sampler(wander(S, tS, heading.up, upDist(FROM))), dnLine = sampler(wander(Sdn, tSdn, heading.down, dnDist(TO)));
    const promoterGuide = (() => {
      const A = S, tA = tS.clone().negate(), B = Sdn, tB = tSdn, d = A.distanceTo(B), want = 135 * RISE;
      const c = B.clone().sub(A).normalize(), bl = tA.clone().sub(tB); bl.addScaledVector(c, -bl.dot(c)); bl.normalize();
      const on = (u, h) => V().addScaledVector(A, 2 * u ** 3 - 3 * u ** 2 + 1).addScaledVector(tA, d * (u ** 3 - 2 * u ** 2 + u))
        .addScaledVector(B, -2 * u ** 3 + 3 * u ** 2).addScaledVector(tB, d * (u ** 3 - u ** 2)).addScaledVector(bl, h * Math.sin(Math.PI * u) ** 2);
      const curve = h => Array.from({length: 241}, (_, i) => on(i / 240, h));
      let lo = 0, hi = want; for (let it = 0; it < 30; it++) { const m = (lo + hi) / 2; if (lengthOf(curve(m)) < want) lo = m; else hi = m; }
      return sampler(curve((lo + hi) / 2));
    })();

    // The enhancer module on the upstream arm: lying along it, or with its activators at Mediator's tail (the loop
    // closed), as in the enhancer scene; its DNA and LEF-1's are pieces, the free DNA meeting their ends.
    const upLin = (bp, out = V()) => upLine.at(upDist(bp), out);
    const x0 = upLin(sE + EN - 1).sub(upLin(sE)).normalize();
    const linPose = basis(x0, up.clone().addScaledVector(x0, -up.dot(x0))).setPosition(upLin(Math.round(sE + (EN - 1) / 2))), linQ = matQ(linPose);
    const enhAt = (P, PQ) => (i, o, q) => moduleFrame(enhFrames, P, PQ, I4, IQ, false, i, o, q);
    const lefAt = (P, PQ, l) => (i, o, q) => { o.copy(l[i].o).applyMatrix4(P); q.copy(PQ).multiply(l[i].q); };
    const endsOf = (frameAt, n) => {
      const get = i => { const f = {o: V(), q: new THREE.Quaternion()}; frameAt(i, f.o, f.q); return f; };
      const f0 = get(0), f3 = get(Math.min(3, n - 1)), f1 = get(n - 1), f4 = get(Math.max(0, n - 4));
      return [alongPath(f0.o, f0.q, f3.o.clone().sub(f0.o)), alongPath(f1.o, f1.q, f1.o.clone().sub(f4.o))];
    };
    // The loop leaves the promoter and meets LEF-1's far end; the flank leaves the enhancer's far end.
    const sideEnds = (le, ee) => ({loop: {o: le[1].o, out: zOf(le[1].q)}, flank: {o: ee[0].o, out: zOf(ee[0].q).negate()}});
    const loopLen = upDist(mEnd + 1), flankFrom = mStart - 1;
    const laid = (en, w) => {
      const lp = sampler(loop(S, tS, en.loop.o.clone().addScaledVector(en.loop.out, RISE), en.loop.out, loopLen, bulge.up)), k = lp.L / (loopLen || 1);
      const fl = sampler(wander(en.flank.o.clone().addScaledVector(en.flank.out, RISE), en.flank.out, heading.up.clone().lerp(away.up, w).normalize(), upDist(FROM) - upDist(flankFrom)));
      return {loop: lp, at: bp => bp > mEnd ? lp.at(upDist(bp) * k) : fl.at(upDist(bp) - upDist(flankFrom))};
    };
    const straightLaid = laid(sideEnds(endsOf(lefAt(linPose, linQ, mod.lefAt(0)), LN), endsOf(enhAt(linPose, linQ), EN)), 0);

    // ---------- RNAP II leaving the promoter ----------
    // RNAP II moves away from TBP as it transcribes, along the gene (between the promoter DNA's way and the downstream
    // DNA's), so that the DNA it lets out behind it, back to TBP, is nearly straight: over its first 10 bp the slack
    // there is taken up, then kept at 4%. Over its first 15 bp it turns a third of the way, about the pair where the
    // DNA leaves it upstream, towards the DNA leaving it pointing at TBP (the rest of the turn is shared out along
    // the DNA either side). The chromatin downstream takes up what it gains or loses on the other side (below). The
    // DNA threads through it: its pairs are 6GMH's, a fraction of a step along for part of a pair moved, each
    // turned about the DNA's own axis as the helix turns.
    const tbpEnd = picAt.get(KEEP).o, dUp = tbpEnd.clone().sub(picAt.get(KEEP - 3).o).normalize(), onward = dUp.clone().add(tSdn).normalize();
    const exitPt = ecAt.get(ntActive - EC_UP).o.clone(), exitDir = exitPt.clone().sub(ecAt.get(ntActive - EC_UP - 3).o).normalize();
    const away0 = exitPt.clone().sub(tbpEnd), c0 = away0.length(); away0.normalize();
    const steps0 = 1 - EC_UP - KEEP;  // steps from TBP's last pair to RNAP II's first, at the start
    const slack0 = steps0 * RISE / c0, SLACK = 1.04;
    const moveAt = mf => {
      if (mf <= 0) return new THREE.Matrix4();
      const dir = away0.clone().lerp(onward, smooth(mf / 20)).normalize(), slack = slack0 + (SLACK - slack0) * smooth(mf / 10);
      const W = tbpEnd.clone().addScaledVector(dir, (steps0 + mf) * RISE / slack);
      const q = new THREE.Quaternion().slerp(new THREE.Quaternion().setFromUnitVectors(exitDir, dir), .35 * smooth(mf / 15));
      return new THREE.Matrix4().makeTranslation(W.x, W.y, W.z).multiply(new THREE.Matrix4().makeRotationFromQuaternion(q)).multiply(new THREE.Matrix4().makeTranslation(-exitPt.x, -exitPt.y, -exitPt.z));
    };

    // ---------- Building a state ----------
    // open: 0 closed – 1 open chromatin; pic: the promoter's factors holding its DNA; act: the activators bound;
    // w: the loop closed; cleft: the DNA taken into RNAP II's cleft; m: base pairs transcribed; pull: how far (Å) the
    // chromatin downstream is drawn in towards RNAP II.
    // The free DNA's frames in open chromatin with nothing bound (where factors will bind), and the promoter's with
    // NF-Y and the PIC in place.
    let reference = null, bound = null;
    const twist = new Map();  // the DNA's twist, kept from frame to frame (chromatin.mjs)
    // A structure that takes hold of free DNA starts from that DNA as it was drawn when it took hold, its twist
    // included (the reference's positions, each pair turned about its axis to its drawn place).
    const grabbed = new Map();
    const heldFrom = (key, from, count, on) => {
      if (!on) { grabbed.delete(key); return reference; }
      if (!grabbed.has(key)) {
        const g = new Map();
        for (let bp = from; bp < from + count; bp++) {
          const r = reference.get(bp), x = twist.get(bp); if (!r) continue;
          const q = r.q.clone(), z = zOf(q), xr = xOf(q), xl = x ? x.clone().addScaledVector(z, -x.dot(z)) : null;
          if (xl && xl.lengthSq() > 1e-6) q.premultiply(new THREE.Quaternion().setFromAxisAngle(z, Math.atan2(xr.clone().cross(xl).dot(z), xr.dot(xl))));
          g.set(bp, {o: r.o, q});
        }
        grabbed.set(key, g);
      }
      return grabbed.get(key);
    };
    const tmp = V();
    function build(st, {record = null} = {}) {
      const pieces = [], beads = [], {open, act, w} = st;
      // The enhancer's pose and, while the loop closes, each frame of it a smooth loop laid for the module where it
      // is now (how the straight arm differs from the same construction for the straight module fading as it closes).
      const pose = blendPose(linPose, loopPose(), w), poseQ = matQ(pose), lefF = mod.lefAt(w);
      let upAt = upLin, loopNow = null;
      if (act > .02 && w > 0) {
        loopNow = laid(sideEnds(endsOf(lefAt(pose, poseQ, lefF), LN), endsOf(enhAt(pose, poseQ), EN)), w);
        upAt = (bp, out = V()) => {
          upLin(bp, out);
          if (bp >= mStart && bp <= mEnd) return out;
          const g = loopNow.at(bp);
          if (w < 1) g.add(out.sub(straightLaid.at(bp)).multiplyScalar(1 - w));
          return out.copy(g);
        };
      }
      // From the promoter on downstream the guide is one path (the promoter's curve, then the arm). The chromatin
      // downstream is drawn in along it from RNAP II's downstream end on, fully from 60 bp beyond (the path keeps its
      // shape, and the DNA leaving RNAP II its way).
      const pullFrom = 2 + Math.floor(st.m || 0) + EC_DN, pullOf = bp => st.pull ? st.pull * smooth((bp - pullFrom) / 60) : 0;
      const PROMOTER = 135 * RISE, down = (l, out) => l < PROMOTER ? promoterGuide.at(l, out) : dnLine.at(l - PROMOTER, out);
      // Just beyond RNAP II's downstream end the guide starts from that end, along it, joining the path over 60 bp.
      let lead = null;
      const openAt = (bp, out = V()) => {
        if (bp <= -90) return upAt(bp, out);
        down((bp < 45 ? (bp + 90) * RISE : PROMOTER + dnDist(bp)) - pullOf(bp), out);
        if (lead && bp > lead.e && bp < lead.e + 60) out.lerpVectors(lead.o.clone().addScaledVector(lead.z, (bp - lead.e) * RISE), out.clone(), smooth((bp - lead.e) / 60));
        return out;
      };
      const guide = open >= 1 ? openAt : open <= 0 ? closedAt : (bp, out = V()) => closedAt(bp, out).lerp(openAt(bp, tmp), open);
      const ellB = open >= 1 ? ellO : open <= 0 ? ellC : bp => ellC(bp) + (ellO(bp) - ellC(bp)) * open;

      // Nucleosomes: each octamer where the fibre's guide puts it, in the fibre's frame there (x along the fibre, the
      // rest carried along it from the promoter), posed as the opening has it at this stage: each keeps the turn
      // about the fibre that closed chromatin gives it (135.5° a nucleosome), every nucleosome moving the same way,
      // so neighbours stay in step and the linkers between them stay gentle arcs. Its DNA is 1KX5's.
      const slot = g => {
        const c = centre(g), p = guide(c);
        let a = c, b = c; while (a < TO && ellB(a) < ellB(c) + 24) a++; while (b > FROM && ellB(b) > ellB(c) - 24) b--;
        return {g, c, p, w: 1 - open * (1 - openWeight(c)), xf: guide(a).sub(guide(b)).normalize()};
      };
      // A nucleosome that open chromatin lacks comes apart as the octamer shrinks away: its DNA unwinds from it,
      // every pair moving from its place on the octamer to where the free DNA runs and turning to lie along it (by
      // the end, exactly where the free DNA of open chromatin lies, so it lets go without a jump), and the octamer is
      // gone as the last of it leaves.
      const gp = V(), ga = V(), gb = V(), qz = new THREE.Quaternion();
      const place = (n, nf) => {
        if (n.w <= 0) return;
        const Nk = new THREE.Matrix4().makeBasis(n.xf, nf, n.xf.clone().cross(nf)).setPosition(n.p).multiply(opening.pose(n.g, open)), NkQ = matQ(Nk);
        const u = n.w < 1 ? smooth((1 - n.w) / .88) : 0;
        // Where open chromatin's free DNA lies (the reference), blended with closed chromatin as the fibre is; the
        // linkers either side follow it too, as far as the nucleosome has come apart.
        const target = (bp, out) => { const r = reference && reference.get(bp); return r ? closedAt(bp, out).lerp(r.o, open) : guide(bp, out); };
        pieces.push({from: n.c - (NS >> 1), count: NS, bound: true, lead: u > 0 && reference ? {at: target, w: u} : null, frame: (i, o, q) => {
          const f = nucLocal[i]; o.copy(f.o).applyMatrix4(Nk); q.copy(NkQ).multiply(f.q);
          if (!u) return;
          const bp = n.c - (NS >> 1) + i; guide(bp, gp); guide(bp + 2, ga).sub(guide(bp - 2, gb)).normalize();
          qz.setFromUnitVectors(zOf(q), ga).multiply(q);
          const r = reference && reference.get(bp);
          if (r) { target(bp, gp); qz.slerp(r.q, open); }
          o.lerp(gp, u); q.slerp(qz, u);
        }});
        beads.push({g: n.g, p: n.p, w: n.w, s: 1 - smooth((1 - n.w) / .75), m: Nk});
      };
      // The fibre's frame at the promoter's nucleosome is the gene's own (along it, `up` across it) turned to the fibre
      // there; it is carried from there along the fibre, a few steps between nucleosomes, so it stays well defined
      // however the fibre turns.
      const n0 = slot(0), nf0 = up.clone().applyQuaternion(new THREE.Quaternion().setFromUnitVectors(chord, n0.xf));
      nf0.addScaledVector(n0.xf, -nf0.dot(n0.xf)).normalize();
      place(n0, nf0);
      for (const dir of [1, -1]) {
        let prev = n0, nPrev = nf0;
        for (let g = dir; g >= G0 && g <= G1; g += dir) {
          const n = slot(g), nf = nPrev.clone();
          let x = prev.xf;
          for (let b = prev.c + dir * 30; (n.c - b) * dir > 15; b += dir * 30) {
            const mid = guide(b + 4).sub(guide(b - 4));
            if (mid.lengthSq() > 1e-6) { mid.normalize(); nf.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(x, mid)); x = mid; }
          }
          nf.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(x, n.xf));
          nf.addScaledVector(n.xf, -nf.dot(n.xf)); if (nf.lengthSq() < 1e-6) nf.copy(side).addScaledVector(n.xf, -side.dot(n.xf)); nf.normalize();
          place(n, nf); prev = n; nPrev = nf;
        }
      }

      // The promoter: NF-Y's DNA and the PIC's bend into their structures' shapes from the free DNA they replace.
      // Once RNAP II takes the DNA into its cleft, TBP and TFIIB keep −39 … −20 and RNAP II holds 6GMH's DNA
      // from 6 pairs upstream of its active site to 24 downstream, moving with it.
      const held = list => (i, o, q) => { o.copy(list[i].o); q.copy(list[i].q); };
      const morphing = st.pic > .02 && st.pic < 1 && bound, from0 = !record && heldFrom('promoter', NFY0, 30 - NFY0, morphing) || reference;
      if (morphing) {
        // The whole promoter moves from its free layout to its bound one, NF-Y's DNA and the PIC's taking their
        // structures' shapes and the DNA between them going along.
        pieces.push({from: NFY0, count: 30 - NFY0, bound: true, frame: (i, o, q) => {
          const a = from0.get(NFY0 + i), b = bound.get(NFY0 + i); o.lerpVectors(a.o, b.o, st.pic); q.slerpQuaternions(a.q, b.q, st.pic);
        }});
      } else if (st.pic >= 1) {
        pieces.push({from: NFY0, count: nfyFrames.length, bound: true, frame: held(nfyFrames)});
        if (st.cleft > 0) {
          pieces.push({from: PIC0, count: KEEP - PIC0 + 1, bound: true, frame: held(picFrames)});
          const m0 = Math.floor(st.m), f = st.m - m0, first = 1 + m0 - EC_UP, M = moveAt(st.m), MQ = matQ(M);
          const spin = new THREE.Quaternion().setFromAxisAngle(EZ, st.m * TWIST), qa = new THREE.Quaternion();
          const ec = {from: first, count: EC_UP + EC_DN + 1, bound: true, frame: (i, o, q) => {
            const n = ntActive - EC_UP + i - f, n0 = Math.floor(n), u = n - n0, A = ecAt.get(n0), B = ecAt.get(n0 + 1) || A;
            o.lerpVectors(A.o, B.o, u).applyMatrix4(M); q.copy(MQ).multiply(qa.slerpQuaternions(A.q, B.q, u)).multiply(spin);
            const pf = st.cleft < 1 && picAt.get(first + i);
            if (pf) { o.lerpVectors(pf.o, o.clone(), st.cleft); q.slerpQuaternions(pf.q, q.clone(), st.cleft); }
          }};
          pieces.push(ec);
          const last = ec.count - 1, oL = V(), o4 = V(), qq = new THREE.Quaternion();
          ec.frame(last, oL, qq); ec.frame(last - 3, o4, qq);
          lead = {e: first + last, o: oL, z: oL.clone().sub(o4).normalize()};
        } else pieces.push({from: PIC0, count: picFrames.length, bound: true, frame: held(picFrames)});
      }
      // The enhancer's DNA and LEF-1's take hold as the activators bind, from the free DNA they replace.
      const binding = act > .02 && act < 1;
      const enhFrom = !record && heldFrom('enhancer', sE, EN, binding) || reference, lefFrom0 = !record && heldFrom('lef', lefFrom, LN, binding) || reference;
      if (act > .02 && reference) {
        const blendIn = (fn, from, src) => (i, o, q) => {
          fn(i, o, q);
          const r = src.get(from + i);
          if (r && act < 1) { const oo = o.clone(), qq = q.clone(); o.lerpVectors(r.o, oo, act); q.slerpQuaternions(r.q, qq, act); }
        };
        pieces.push({from: sE, count: EN, bound: true, frame: blendIn(enhAt(pose, poseQ), sE, enhFrom)});
        pieces.push({from: lefFrom, count: LN, bound: true, frame: blendIn(lefAt(pose, poseQ, lefF), lefFrom, lefFrom0)});
      }
      pieces.sort((x, y) => x.from - y.from);
      assemble(chain, {from: FROM, to: TO, pieces, guide, memory: record ? null : twist});
      if (record === 'rise') {
        // The free DNA from RNAP II's downstream end to the first nucleosome downstream: its mean rise and steps.
        const e = 1 + Math.floor(st.m) + EC_DN, n0 = centre(2) - 73;
        let sum = 0, n = 0;
        for (let k = 1; k < chain.n; k++) if (chain.bp[k] > e + 2 && chain.bp[k] < n0 - 2 && !chain.bound[k] && !chain.bound[k - 1]) { sum += chain.o[k].distanceTo(chain.o[k - 1]); n++; }
        return {rise: sum / n, steps: n0 - 1 - e};
      }
      if (record) {
        const r = new Map();
        for (let k = 0; k < chain.n; k++) { const bp = chain.bp[k]; if (record.some(([lo, hi]) => bp >= lo && bp <= hi)) r.set(bp, {o: chain.o[k].clone(), q: chain.q[k].clone()}); }
        return r;
      }
      fibre.band(0, sE, sE + EN - 1, ENHANCER_TINT, .8 * open);
      fibre.band(1, -82, -78, CCAAT_TINT, .7 * st.pic);
      fibre.set(chain); at.chain = chain;
      const m = new THREE.Matrix4(), sc = new THREE.Matrix4();
      beads.slice(0, MAXN).forEach((b, i) => { const s = Math.max(1e-3, b.s); octamers.setMatrixAt(i, m.copy(b.m).multiply(sc.makeScale(s, s, s))); });
      octamers.count = Math.min(MAXN, beads.length); octamers.instanceMatrix.needsUpdate = true;
      // The activators drift in and fade in as they bind (their side of the enhancer is +y); LEF-1 binds, and bends
      // its DNA, as the loop closes.
      mod.g.matrix.copy(pose).multiply(new THREE.Matrix4().makeTranslation(0, APPROACH * (1 - act), 0)); mod.flipPart.matrix.identity();
      mod.lefPart.matrix.makeTranslation(0, APPROACH * (1 - w), 0);
      fadeObject(mod.g, act); fadeObject(mod.lefPart, act * w);

      // Views for the camera.
      const enhancer = V(0, 0, 0).applyMatrix4(pose);
      const span = (from, to) => { const pts = []; for (let bp = from; bp <= to; bp += 25) pts.push(guide(bp)); return pts; };
      const fit = pts => { const c = centroid(pts); return {c, r: Math.max(...pts.map(p => p.distanceTo(c)))}; };
      const whole = fit(span(FROM, TO)), gene = fit(span(sE - 400, 1400));
      at.closedView = toWorld(whole.c); at.closedRadius = whole.r * .9;
      at.openView = toWorld(gene.c); at.openRadius = gene.r * .95;
      at.promoterView = toWorld(picCentre);
      at.linearView = toWorld(enhancer.clone().lerp(picCentre, .5)); at.linearRadius = enhancer.distanceTo(picCentre) / 2 + 320;
      const lp = fit([...span(mEnd + 1, -90), complex.clone()]);
      at.loopView = toWorld(lp.c); at.loopRadius = lp.r + 150;
      at.state = st; at.beads = beads; at.enhancer = enhancer; at.pose = pose; at.enhancerToTail = enhancer.distanceTo(tail);
    }
    reference = build({open: 1, pic: 0, act: 0, w: 0, cleft: 0, m: 0}, {record: [[NFY0 - 2, 31], [sE - 2, mEnd + 2],
      ...[0, 1, -9, -10].map(g => [centre(g) - 128, centre(g) + 128])]});
    bound = build({open: 1, pic: 1, act: 0, w: 0, cleft: 0, m: 0}, {record: [[NFY0, 29]]});
    // Held in RNAP II's cleft the DNA lies deeper, and turned, so the way from RNAP II's downstream end to the
    // chromatin beyond is longer than the free DNA there; the chromatin downstream is drawn that much in towards
    // it, and the DNA keeps its length. How far, at points along RNAP II's way: the shortfall measured and made up.
    let pull = 0;
    const PULL_AT = [0, 3, 6, 9, 12, 15, 18, 22, 26, 32, 40, 50, 60, NTX], PULLS = PULL_AT.map(m => {
      for (let it = 0; it < 2; it++) { const {rise, steps} = build({open: 1, pic: 1, act: 1, w: 1, cleft: 1, m, pull}, {record: 'rise'}); pull += (rise - RISE) * steps; }
      return pull;
    });
    const pullAt = mf => { let i = 0; while (i < PULL_AT.length - 2 && mf > PULL_AT[i + 1]) i++; const f = (mf - PULL_AT[i]) / (PULL_AT[i + 1] - PULL_AT[i]); return PULLS[i] + (PULLS[i + 1] - PULLS[i]) * Math.min(1, Math.max(0, f)); };
    {
      const end = centreOf('RNAP II').applyMatrix4(moveAt(NTX)), pts = [end, picCentre, centreOf('TFIID')];
      const c = centroid(pts); at.activeView = toWorld(c); at.activeRadius = Math.max(...pts.map(p => p.distanceTo(c))) + 170;
    }

    // ---------- RNA ----------
    // Its path in RNAP II (as at the promoter): from the active site (s = 0, where its 3′ end is made) back along
    // the structure's 21 nt to their 5′ end, then out of the exit channel and away, 5.9 Å a nucleotide. The RNA made
    // so far lies along it from its 3′ end, moving out as RNAP II adds to that end and carried along with RNAP II.
    const R3 = rnaBackbone.length - 1, path = [], baseDir = [];
    for (let s = 0; s <= R3; s++) { path.push(rnaBackbone[R3 - s].clone()); baseDir.push(rnaBase[R3 - s].clone().sub(rnaBackbone[R3 - s])); }
    {
      // Out of the channel it turns up, towards the viewer and on along the gene, away from the DNA, TFIID and
      // Mediator's tail, in a loose coil as a single strand gathers (5.9 Å a nucleotide along it, 2.5 Å on).
      const d = rnaBackbone[0].clone().sub(rnaBackbone[3]).normalize(), c = rnaBackbone[0].clone();
      const out = up.clone().multiplyScalar(.6).addScaledVector(side, .6).addScaledVector(chord, .5).normalize();
      for (let s = R3 + 1, i = 1; s <= NTX + 3; s++, i++) {
        d.lerp(out, .12).normalize();
        const k = Math.min(1, i / 6), n1 = d.clone().cross(chord).normalize(), n2 = d.clone().cross(n1).normalize(), a = .7 * i;
        c.addScaledVector(d, RNA_STEP - (RNA_STEP - 2.5) * k);
        path.push(c.clone().addScaledVector(n1, 7.5 * k * (Math.cos(a) - 1)).addScaledVector(n2, 7.5 * k * Math.sin(a)));
        baseDir.push(n1.clone().multiplyScalar(-Math.cos(a)).addScaledVector(n2, -Math.sin(a)).multiplyScalar(5));
      }
    }
    const along = (list, s, out = V()) => { const i = Math.min(list.length - 2, Math.floor(s)); return out.lerpVectors(list[i], list[i + 1], s - i); };
    const rnaGroup = new THREE.Group(); rnaGroup.matrixAutoUpdate = false; frame.add(rnaGroup);
    const rnaMat = new THREE.MeshStandardMaterial({color: RNA, emissive: RNA, emissiveIntensity: .25, roughness: .45});
    const baseMesh = new THREE.InstancedMesh(new THREE.CylinderGeometry(.8, .8, 1, 6, 1, true), new THREE.MeshStandardMaterial({color: 0xffc58f, roughness: .55}), NTX + 4);
    baseMesh.frustumCulled = false; baseMesh.count = 0; rnaGroup.add(baseMesh);
    let rnaTube = null, rnaKey = -1;
    function drawRNA(mf) {
      const key = Math.round(mf * 20);
      if (key === rnaKey) return; rnaKey = key;
      if (rnaTube) { rnaGroup.remove(rnaTube); rnaTube.geometry.dispose(); rnaTube = null; }
      baseMesh.count = 0;
      if (mf < 1) return;
      const pts = [], dummy = new THREE.Object3D(), d = V();
      for (let s = mf - Math.floor(mf); s <= mf + 1e-6; s += 1) pts.push(along(path, s));
      rnaTube = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts, false, 'centripetal'), pts.length * 4, 1.5, 8), rnaMat);
      rnaGroup.add(rnaTube);
      pts.forEach((p, i) => {
        d.copy(along(baseDir, mf - Math.floor(mf) + i)); const len = d.length() || 1;
        dummy.position.copy(p).addScaledVector(d, .5); dummy.quaternion.setFromUnitVectors(V(0, 1, 0), d.divideScalar(len)); dummy.scale.set(1, len, 1);
        dummy.updateMatrix(); baseMesh.setMatrixAt(i, dummy.matrix);
      });
      baseMesh.count = pts.length; baseMesh.instanceMatrix.needsUpdate = true;
      at.rnaEnd = pts[pts.length - 1];
    }

    // The basal apparatus: each factor drifts in and fades in as it arrives, as the film's factors do; RNAP II and
    // TFIIF move with the polymerase; TFIIE and TFIIH drift off and fade out as they are released. NF-Y arrives with
    // TFIID; Mediator with the loop.
    function placeParts(arrive, release, mf) {
      const M = moveAt(mf);
      for (const [name, mesh] of partOf) {
        const k = arrive[ORDER[name]], c = centreOf(name), out = c.clone().sub(picCentre).normalize();
        const r = RELEASED.has(name) ? release : 0;
        fade(mesh.material, k * (1 - ramp(r, .35, 1))); mesh.visible = mesh.material.opacity > .01;
        const mm = new THREE.Matrix4().makeTranslation(...out.multiplyScalar(APPROACH * (1 - k) + 240 * r).toArray());
        if (MOVES.has(name)) mm.multiply(M);
        mesh.matrix.copy(mm);
      }
      rnaGroup.matrix.copy(M);
      at.rnap = centreOf('RNAP II').applyMatrix4(M);
    }

    let last = '', lastT = -1;
    return {
      frame, fibre, chain, at, reference, moveAt, pulls: PULLS, setup: G,  // for tests (?debug=1)
      shown: () => Object.fromEntries([...partOf].map(([name, mesh]) => [name, mesh.visible])), rna: () => baseMesh.count,
      update(t, {pxPerA = 1} = {}) {
        if (Math.abs(t - lastT) > .5) twist.clear();  // a jump in time: the DNA's twist starts afresh
        fibre.view(pxPerA);
        lastT = t;
        const open = ramp(t, T.open + .8, T.open + 6);
        const arrive = [0, 1, 2, 3, 4].map(i => ramp(t, T.poised + 1 + 1.2 * i, T.poised + 2.8 + 1.2 * i));
        const act = ramp(t, T.wait + 1.2, T.wait + 3.8), w = ramp(t, T.signal + .8, T.signal + 4.6);
        // TFIIE and TFIIH lift off first; the DNA then goes into RNAP II's cleft, and RNAP II sets off.
        const release = ramp(t, T.active + .3, T.active + 3.3), cleft = ramp(t, T.active + 1.3, T.active + 2.5);
        const mf = cleft < 1 ? 0 : NTX * ramp(t, T.active + 2.7, T.end - 2.5);
        const r = x => +x.toFixed(3);
        const st = {open: r(open), pic: r(arrive[0]), act: r(act), w: r(w), cleft: r(cleft), m: +mf.toFixed(2), pull: +(pullAt(mf) * cleft).toFixed(1)};
        const key = JSON.stringify(st);
        if (key !== last) { last = key; build(st); }
        placeParts(arrive, release, st.m);
        drawRNA(st.m);
        fadeObject(nfyGroup, arrive[0]);
        nfyGroup.matrix.copy(nfyPose).premultiply(new THREE.Matrix4().makeTranslation(...up.clone().multiplyScalar(-APPROACH * (1 - arrive[0])).toArray()));
        const med = ramp(t, T.signal + 1.4, T.signal + 4.6);
        fadeObject(mediator, med); mediator.position.copy(up).multiplyScalar(170 * (1 - med));
      },
      annotate(t, {label, tag}) {
        const P = v => toWorld(v), st = at.state, bead = g => at.beads.find(b => b.g === g);
        if (t < T.open) {
          if (t > 1.2) {
            const b = bead(-4) || at.beads[0];
            if (b) label(P(b.p), 'Closed chromatin', 'Nucleosomes packed in a compact fibre', {color: hex(COLOUR.Histones)});
            tag(P(C0), 'Promoter', {color: '#cfe3ea'});
          }
        } else if (t < T.poised) {
          if (t > T.open + 6.2) {
            label(P(promoterGuide.at(60 * RISE)), 'Promoter · open', 'Free of nucleosomes', {color: '#cfe3ea'});
            tag(P(at.enhancer), 'Enhancer', {color: hex(ENHANCER_TINT)});
            const b = bead(4); if (b) tag(P(b.p), 'Open chromatin', {color: hex(COLOUR.Histones)});
          }
        } else if (t < T.wait) {
          if (t > T.poised + 2.4) tag(P(nfyPts[9]), 'NF-Y', {color: hex(COLOUR['NF-YB'])});
          if (t > T.poised + 2.8) tag(P(centreOf('TFIID')), 'TFIID', {color: hex(COLOUR.TFIID)});
          if (t > T.poised + 4) tag(P(centreOf('TFIIB')), 'TFIIB', {color: hex(COLOUR.TFIIB)});
          if (t > T.poised + 5.2) label(P(at.rnap), 'RNAP II', 'With TFIIF', {color: hex(COLOUR['RNAP II'])});
          if (t > T.poised + 6.4) tag(P(centreOf('TFIIE')), 'TFIIE', {color: hex(COLOUR.TFIIE)});
          if (t > T.poised + 7.6) tag(P(centreOf('TFIIH')), 'TFIIH', {color: hex(COLOUR.TFIIH)});
        } else if (t < T.signal) {
          label(P(at.rnap), 'Poised', 'The basal apparatus, waiting', {color: hex(COLOUR['RNAP II'])});
          if (t > T.wait + 3.8) label(P(at.enhancer), 'Enhancer · activators', 'Bound, but not yet at the promoter', {color: hex(ENHANCER_TINT)});
        } else if (t < T.active) {
          if (t > T.signal + 4.8) {
            label(P(tail), 'Co-activator', 'Recruited by the activators', {color: hex(COLOUR['Mediator tail'])});
            label(P(at.enhancer), 'Activators', 'The second signal', {color: hex(COLOUR.p65)});
            tag(P(picCentre), 'Basal apparatus', {color: hex(COLOUR['RNAP II'])});
          }
        } else if (t > T.active + 2.8) {
          label(P(at.rnap), 'RNAP II · transcribing', 'With TFIIF', {color: hex(COLOUR['RNAP II'])});
          if (at.rnaEnd && st.m > 25) tag(P(at.rnaEnd.clone().applyMatrix4(rnaGroup.matrix)), 'RNA', {color: hex(RNA)});
          tag(P(centreOf('TBP')), 'TBP and TFIIB stay', {color: hex(COLOUR.TBP)});
        }
      },
    };
  },
});
