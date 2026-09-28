// Scene: enhancers. A promoter with its preinitiation complex (the human TFIID-based PIC with Mediator, the
// co-activator, PDB 7ENC) and an enhancer bound by its activators (the interferon-β enhanceosome: 2O61 and
// 1T2K, joined on the DNA they share) on chromatin: double-stranded DNA drawn a base pair at a time, wrapped
// round histone octamers (1KX5) at a 200 bp repeat and free where factors bind. The DNA loops so that the
// enhancer's activators meet the promoter's complex; an architectural factor (the LEF-1 HMG domain, 2LEF)
// bends the DNA beside the enhancer; NF-Y (4AWL) sits on the CCAAT box at −80, bending the DNA as it does in
// its structure. Every structure brings its own DNA, and the free DNA between them meets each in place,
// direction and twist; every loop holds its real content, so a loop of tens of kilobases is drawn at its
// true size.
import * as THREE from 'three';
import {runScene} from '../shared/scene_player.mjs';
import {fadeObject} from '../shared/molecules.mjs';
import {smooth, ramp} from '../shared/ease.mjs';
import {RISE, TWIST} from '../shared/dna.mjs';
import {assemble, alongPath, zOf} from '../shared/chromatin.mjs';
import {geneSetup, COLOUR, NUC_SPAN, NUC_STEP, ENHANCER_TINT, CCAAT_TINT} from './gene_fibre.mjs';

const V = (...a) => new THREE.Vector3(...a);
const hex = c => '#' + c.toString(16).padStart(6, '0');
const ARM_BP = 5200, FLANK_BP = 4200;                   // chromatin drawn beyond the promoter and the enhancer
const KB0 = 2;                                          // kb from the promoter to the enhancer, before the loop grows
const NEAR_BP = 5600;                                   // DNA farther than this from the promoter and the enhancer is drawn as a line
const APPROACH = 90;                                    // Å a factor drifts in from as it arrives (and fades in), as in the film


const T = {loop: 11, far: 22, side: 35, invert: 48, types: 58, ccaat: 70, end: 82};
const steps = [
  {t: 0, nav: 'An enhancer', title: 'An enhancer<br>boosts a promoter.', notes: 'enhancers',
    text: 'In most cases, the activity of a promoter is substantially increased by an enhancer: a closely packed array of sites that bind transcription factors, at a variable distance from the core promoter.'},
  {t: T.loop, nav: 'The DNA loops', title: 'The DNA loops<br>to bring them together.', notes: 'enhancers',
    text: 'The DNA can loop so that the transcription factors at the enhancer and those at the promoter interact, forming a large protein complex.'},
  {t: T.far, nav: 'Near or far', title: 'Near, or tens of<br>kilobases away.', notes: 'enhancers', hold: 1.1,
    text: 'Some enhancers function through very long-range interactions of tens of kilobases; others function through short-range interactions and may be quite close to the promoter.'},
  {t: T.side, nav: 'Up or downstream', title: 'Upstream<br>or downstream.', notes: 'enhancers',
    text: 'An enhancer need not be at a fixed position: it can be upstream or downstream of the promoter, and at great distances from it.'},
  {t: T.invert, nav: 'Either way round', title: 'It works<br>either way round.', notes: 'enhancers',
    text: 'An enhancer can function in either orientation: it can be inverted and still work.'},
  {t: T.types, nav: 'Activators', title: 'Activators, co-activators,<br>architectural factors.', notes: 'enhancer-driven-transcription-factors', hold: 1.15,
    text: 'True activators bind specific DNA sites and contact the basal machinery at the promoter. Co-activators are recruited by DNA-bound activators. Architectural factors change the shape of DNA, typically bending it, which can help bring together factors separated by short distances.'},
  {t: T.ccaat, nav: 'The CCAAT box', title: 'The CCAAT box<br>is part of the promoter.', notes: 'enhancers',
    text: 'The CCAAT box is a common promoter-proximal element, often near −80, that can influence promoter strength. It is not an enhancer, because of its location and how it acts.'},
];

// Scene state read by the camera shots (world coordinates).
const at = {};

runScene({
  pageTitle: 'Enhancers · Eukaryotic transcription', eyebrow: 'Enhancers',
  links: [{href: 'index.html', text: 'All scenes'}, {href: '../protein_browser/?chapter=eukaryotic', text: 'Protein library'}],
  steps, duration: T.end, notesPage: 'notes.html', fov: 30, near: 3, far: 180000, fog: .000005,
  shots: [
    {t: 0, frame: () => ({target: at.linearView || V(), dir: [.05, -.2, -1], radius: at.linearRadius || 900, fill: .95})},
    {t: T.loop, blend: 3, frame: () => ({target: at.loopView || V(), dir: [-.08, -.22, -1], radius: at.loopRadius || 700, fill: .95})},
    {t: T.far, blend: 2.4, frame: () => ({target: at.loopView || V(), dir: [.12, -.3, -1], radius: at.loopRadius || 700, fill: .95})},
    {t: T.side, blend: 2.6, frame: () => ({target: at.sideView || V(), dir: [.04, -.2, -1], radius: at.sideRadius || 1400, fill: .95})},
    {t: T.invert, blend: 2.8, frame: () => ({target: at.enhancerView || V(), dir: [.2, -.25, -1], radius: 280, fill: .9})},
    {t: T.types, blend: 2.6, frame: () => ({target: at.contactView || V(), dir: at.typesDir || [-.25, -.2, -1], radius: 360, fill: .92})},
    {t: T.ccaat, blend: 2.8, frame: () => ({target: at.ccaatView || V(), dir: at.ccaatDir || [-1, -.3, -.5], radius: 200, fill: .9})},
  ],
  async build({world, progress}) {
    const {set, rec, strand, makeMesh, verts, geometryOf, crystal, matQ, axis, centroid, direction, basis, rotation, aboutLine, clearance, pic, U, D, upDir, dnDir, bpOf, picMeshes, medMeshes, medCentre, tail, complex, chord, up, side, frame, toWorld, mediator, picSample, nfy, NFY0, connector, nfyMeshes, nfySample, nfyFit, lineP, wantUp, nfyPose, best, nfyGroup, nfyPts, S, tS, Sdn, tSdn, enhPairs, enhCrystal, enhPts, enhC, enhDir, nfkb, toEnhLocal, enhQ, actSample, enhAll, local, DYAD, step, backbones, seg, enhFrames, EN, turnOver, lefCrystal, LN, lefPlacement, module, modA, modB, histC, nucLocal, NS, pattern, MAXN, octamers, nfyQ, nfyFrames, picFrames, PIC0, fibre, chain, wander, turn, loop, lengthOf, sampler, contact, loopPose, blendPose, heading, bulge, away, armStart, OVER, OVERQ, I4, IQ, moduleFrame} = await geneSetup({world, progress});

    // ---------- The fibre ----------
    // Each arm of chromatin runs from the promoter outward: upstream from bp −90 (where NF-Y's DNA ends),
    // downstream from +45. Nucleosomes sit at a 200 bp repeat counted from the promoter (−240, −440 … and +150,
    // +350 …). A nucleosome's DNA wraps round its octamer, entering and leaving level with it along the fibre,
    // so its pairs take no length of fibre; the linker after it carries the pattern's repeat on to the next
    // nucleosome; free DNA takes 3.38 Å a base pair. A nucleosome fades as the enhancer's free stretch (the
    // enhancer region and 60 bp either side) comes near it, over st.fade bp (a whole repeat while the loop grows
    // or shrinks, so its length changes smoothly; a few pairs otherwise, so a nucleosome is whole or gone).
    // Where the enhancer region itself arrives or leaves (as it changes side), nucleosomes over it form only
    // once it has let go of its DNA, and are gone before it takes hold.
    const DOWN0 = 45, REPEAT = pattern.rise;
    function armOf(which, st, mod) {
      const e = which === 'up' ? st.eUp : st.eDn, dir = which === 'up' ? -1 : 1, s0 = which === 'up' ? -90 : DOWN0;
      const kbBp = Math.round(st.kb * 1000), sE = which === 'up' ? -kbBp - 26 : kbBp - 26;
      const mStart = mod.after ? sE : sE - mod.s - LN, mEnd = mStart + mod.MN - 1, nfr = [mStart - 60, mEnd + 60];
      const extent = Math.round(ARM_BP + e * (kbBp + mod.MN + FLANK_BP - ARM_BP));
      const c0 = which === 'up' ? -240 : 150, centre = k => c0 + dir * NUC_STEP * k;
      const held = smooth((.35 - e) / .35);
      const weight = c => {
        const gap = Math.max(nfr[0] - (c + NUC_SPAN / 2), (c - NUC_SPAN / 2) - nfr[1]);
        return (1 - e * (1 - Math.min(1, Math.max(0, gap / st.fade)))) * (gap < 0 ? held : 1);
      };
      // The repeat a step belongs to: its nucleosome, then the linker on to the next one (walking outward). Free
      // DNA within half a linker of a nucleosome runs as a linker does (it swings out to where the nucleosome's
      // DNA enters or leaves, beside the octamer); farther off, it runs along the fibre.
      const repeatOf = s => Math.floor(((s - c0) * dir + (NUC_SPAN - 1) / 2) / NUC_STEP), LINK = NUC_STEP - NUC_SPAN + 1, HALF = LINK / 2;
      const wAt = k => k >= 0 && (centre(k) - s0) * dir + NUC_SPAN / 2 <= extent ? weight(centre(k)) : 0;
      const ell = new Float32Array(extent + 1);
      for (let j = 1; j <= extent; j++) {
        const s = s0 + dir * (j - .5), u = (s - c0) * dir, k = repeatOf(s);
        let step;
        if (k >= 0 && Math.abs(u - NUC_STEP * k) < NUC_SPAN / 2) step = (1 - wAt(k)) * RISE;
        else {
          // Between nucleosome k (inward, its end at u = 200k + 73.5) and k + 1 (outward, from 200(k + 1) − 73.5).
          const dIn = u - (NUC_STEP * k + NUC_SPAN / 2), dOut = NUC_STEP * (k + 1) - NUC_SPAN / 2 - u;
          const near = dIn < HALF ? wAt(k) : dOut < HALF ? wAt(k + 1) : 0;
          step = near * REPEAT / LINK + (1 - near) * RISE;
        }
        ell[j] = ell[j - 1] + step;
      }
      const j = s => Math.max(0, Math.min(extent, Math.round((s - s0) * dir)));
      return {which, e, dir, s0, sE, mStart, mEnd, extent, ell, j, centre, weight, present: e > .35, bp: jj => s0 + dir * jj};
    }
    // Builds the whole fibre for a state: side of the enhancer, loop closed (w), its length (kb), inversion
    // (inv), and the enhancer's presence on each arm (eUp, eDn: it fades from one to the other).
    const twist = new Map();  // the DNA's twist, kept from frame to frame (chromatin.mjs)
    function build(st) {
      const pieces = [], beads = [], mod = st.side === 'up' ? modA : modB, guides = {};
      const arms = {up: armOf('up', st, modA), down: armOf('down', st, modB)};
      const loopW = st.w, bind = st.w;  // LEF-1 binds and bends the DNA as the loop closes
      // Inversion: the enhancer turns over about its dyad, lifting clear as it goes; drawn apart from its
      // neighbours until it lands.
      const flip = turnOver(st.inv), flipQ = matQ(flip);
      const landed = st.inv > Math.PI - 1e-3, flipping = st.inv > 1e-3 && !landed;
      const view = {};
      for (const which of ['up', 'down']) {
        const a = arms[which], [start, t0] = armStart[which], has = which === st.side;
        const straightGuide = sampler(wander(start, t0, heading[which], a.ell[a.extent]));
        const lin = (jj, out = V()) => straightGuide.at(a.ell[jj], out);
        let pos = lin;
        if (has) {
          const eLo = a.j(a.sE), eHi = a.j(a.sE + EN - 1);
          const loopEnd = which === 'up' ? a.j(a.mEnd + 1) : a.j(a.mStart - 1), flank0 = which === 'up' ? a.j(a.mStart - 1) : a.j(a.mEnd + 1);
          // Straight pose: the enhancer on the arm, its top strand along increasing bp, turned with `up`.
          const x = lin(eHi).sub(lin(eLo)).normalize(), cE = lin(Math.round((eLo + eHi) / 2));
          const linPose = basis(x, up.clone().addScaledVector(x, -up.dot(x))); linPose.setPosition(cE);
          const pose = blendPose(linPose, loopPose(), loopW), poseQ = matQ(pose), linQ = matQ(linPose);
          // As the enhancer changes side its activators drift off and fade, then drift in and fade in on the other
          // side (their side of the enhancer is +y); LEF-1 binds, and bends its DNA, as the loop closes.
          const f = a.e, cL = mod.lefCentre;
          mod.g.matrix.copy(pose).multiply(new THREE.Matrix4().makeTranslation(0, APPROACH * (1 - f), 0)); mod.flipPart.matrix.copy(flip);
          mod.lefPart.matrix.makeTranslation(0, APPROACH * (1 - bind), 0);
          fadeObject(mod.g, f); fadeObject(mod.lefPart, f * bind); mod.shown = f;
          view.pose = pose; view.loopEnd = loopEnd; view.lefWorld = cL.clone().applyMatrix4(pose);
          if (a.present) {
            const lefF = mod.lefAt(bind), lefFrom = mod.after ? a.sE + EN + mod.s : a.sE - mod.s - LN;
            // A piece's two ends as free DNA meets them (along its own path over its last 4 pairs).
            const endsOf = (frameAt, n) => {
              const at = i => { const f = {o: V(), q: new THREE.Quaternion()}; frameAt(i, f.o, f.q); return f; };
              const f0 = at(0), f3 = at(Math.min(3, n - 1)), f1 = at(n - 1), f4 = at(Math.max(0, n - 4));
              return [alongPath(f0.o, f0.q, f3.o.clone().sub(f0.o)), alongPath(f1.o, f1.q, f1.o.clone().sub(f4.o))];
            };
            const enhAt = (P, PQ, F, FQ, reversed) => (i, o, q) => moduleFrame(enhFrames, P, PQ, F, FQ, reversed, i, o, q);
            const lefAt = (P, PQ, l) => (i, o, q) => { o.copy(l[i].o).applyMatrix4(P); q.copy(PQ).multiply(l[i].q); };
            // While the enhancer turns over it is drawn apart from its neighbours, which meet where its ends are on
            // the way from where they were to where they land (the same places, as it lies on itself).
            let link = null, eEnds;
            if (flipping) {
              const u = endsOf(enhAt(pose, poseQ, I4, IQ, false), EN), l = endsOf(enhAt(pose, poseQ, OVER, OVERQ, true), EN), k = smooth(st.inv / Math.PI);
              link = {first: {o: u[0].o.lerp(l[0].o, k), q: u[0].q.slerp(l[0].q, k)}, last: {o: u[1].o.lerp(l[1].o, k), q: u[1].q.slerp(l[1].q, k)}};
              eEnds = [link.first, link.last];
            } else eEnds = endsOf(enhAt(pose, poseQ, landed ? OVER : I4, landed ? OVERQ : IQ, landed), EN);
            pieces.push({from: a.sE, count: EN, bound: true, cut: flipping, link, swap: flipping ? smooth(st.inv / Math.PI) : 0, frame: enhAt(pose, poseQ, flip, flipQ, landed)});
            pieces.push({from: lefFrom, count: LN, bound: true, frame: lefAt(pose, poseQ, lefF)});
            const lEnds = endsOf(lefAt(pose, poseQ, lefF), LN);
            view.enhancerBp = [a.sE, a.sE + EN - 1];
            // The loop leaves the promoter and meets LEF-1's far end; the flank leaves the enhancer's far end.
            const sideEnds = (le, ee) => which === 'up'
              ? {loop: {o: le[1].o, out: zOf(le[1].q)}, flank: {o: ee[0].o, out: zOf(ee[0].q).negate()}}
              : {loop: {o: le[0].o, out: zOf(le[0].q).negate()}, flank: {o: ee[1].o, out: zOf(ee[1].q)}};
            const laid = (en, w) => {
              const lp = sampler(loop(start, t0, en.loop.o.clone().addScaledVector(en.loop.out, RISE), en.loop.out, a.ell[loopEnd], bulge[which])), k = lp.L / (a.ell[loopEnd] || 1);
              const fl = sampler(wander(en.flank.o.clone().addScaledVector(en.flank.out, RISE), en.flank.out, heading[which].clone().lerp(away[which], w).normalize(), a.ell[a.extent] - a.ell[flank0]));
              return {loop: lp, at: jj => jj <= loopEnd ? lp.at(a.ell[jj] * k) : fl.at(a.ell[jj] - a.ell[flank0])};
            };
            // Every frame of the loop closing is itself a smooth loop, laid for the module where it is now; how
            // the straight arm differs from the same construction for the straight module fades as it closes.
            const now = loopW > 0 ? laid(sideEnds(lEnds, eEnds), loopW) : null;
            const straight = loopW > 0 && loopW < 1 ? laid(sideEnds(endsOf(lefAt(linPose, linQ, mod.lefAt(0)), LN), endsOf(enhAt(linPose, linQ, I4, IQ, false), EN)), 0) : null;
            pos = (jj, out = V()) => {
              lin(jj, out);
              if (!now || (jj > loopEnd && jj < flank0)) return out;
              const g = now.at(jj);
              if (straight) g.add(out.sub(straight.at(jj)).multiplyScalar(1 - loopW));
              return out.copy(g);
            };
            view.loop = now && now.loop;
          } else view.enhancerBp = [a.sE, a.sE + EN - 1];
          view.pos = pos;
        }
        guides[which] = pos;
        // Nucleosomes: each octamer where the fibre's guide puts it, turned as open chromatin turns it.
        // The fibre's frame starts where the arm leaves the promoter (along the arm's first DNA, `up` across it) and is
        // carried from there along the fibre, a few steps between nucleosomes, so it stays well defined however the
        // fibre turns.
        let xPrev = which === 'up' ? t0.clone().negate() : t0.clone(), nPrev = up.clone().addScaledVector(xPrev, -up.dot(xPrev)).normalize(), jPrev = 0;
        for (let k = 0; ; k++) {
          const c = a.centre(k);
          if ((c - a.s0) * a.dir + NUC_SPAN / 2 > a.extent) break;
          const jj = a.j(c), w = a.weight(c), p = pos(jj);
          // The fibre's direction here, from 24 Å of fibre either side (a nucleosome's own pairs take none).
          let jA = jj, jB = jj; while (jA < a.extent && a.ell[jA] < a.ell[jj] + 24) jA++; while (jB > 0 && a.ell[jB] > a.ell[jj] - 24) jB--;
          const xf = pos(jA).sub(pos(jB)).multiplyScalar(a.dir).normalize();
          const nf = nPrev.clone(); let x = xPrev;
          for (let jm = jPrev + 30; jm < jj - 15; jm += 30) {
            const mid = pos(Math.min(a.extent, jm + 4)).sub(pos(Math.max(0, jm - 4))).multiplyScalar(a.dir);
            if (mid.lengthSq() > 1e-6) { mid.normalize(); nf.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(x, mid)); x = mid; }
          }
          nf.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(x, xf));
          nf.addScaledVector(xf, -nf.dot(xf)); if (nf.lengthSq() < 1e-6) nf.copy(side).addScaledVector(xf, -side.dot(xf)); nf.normalize();
          nPrev = nf; xPrev = xf; jPrev = jj;
          if (w < .12) continue;
          const Nk = new THREE.Matrix4().makeBasis(xf, nf, xf.clone().cross(nf)).setPosition(p).multiply(pattern.pose(k)), NkQ = matQ(Nk);
          // Its DNA as in 1KX5. While it forms (or comes apart) its DNA winds onto the octamer from the fibre's path
          // (or unwinds onto it), every pair moving between its place on the octamer and the path, the octamer
          // growing (or shrinking) with it; the linkers either side follow the path as far as the DNA is off.
          const u = w < 1 ? smooth((1 - w) / .88) : 0, gp = V(), ga = V(), gb = V(), qz = new THREE.Quaternion();
          const along = (bp, out) => pos(a.j(bp), out);
          pieces.push({from: c - (NS >> 1), count: NS, bound: true, lead: u > 0 ? {at: along, w: u} : null, frame: (i, o, q) => {
            const f = nucLocal[i]; o.copy(f.o).applyMatrix4(Nk); q.copy(NkQ).multiply(f.q);
            if (!u) return;
            const bp = c - (NS >> 1) + i; along(bp, gp); along(bp + 2, ga).sub(along(bp - 2, gb));
            if (ga.lengthSq() < 1e-8) return;
            qz.setFromUnitVectors(zOf(q), ga.normalize()).multiply(q); o.lerp(gp, u); q.slerp(qz, u);
          }});
          beads.push({p, w, s: 1 - smooth((1 - w) / .75), m: Nk});
        }
      }
      // The promoter: NF-Y's DNA and the PIC's.
      pieces.push({from: NFY0, count: nfyFrames.length, bound: true, frame: (i, o, q) => { o.copy(nfyFrames[i].o); q.copy(nfyFrames[i].q); }});
      pieces.push({from: PIC0, count: picFrames.length, bound: true, frame: (i, o, q) => { o.copy(picFrames[i].o); q.copy(picFrames[i].q); }});
      pieces.sort((x, y) => x.from - y.from);
      // Free DNA runs along each arm's guide, the connector from NF-Y to the PIC, and on from the PIC downstream.
      const up_ = arms.up, dn = arms.down, enhMid = arms[st.side].sE + EN / 2;
      const guide = (bp, out) => bp <= up_.s0 ? guides.up(up_.j(bp), out) : bp >= dn.s0 ? guides.down(dn.j(bp), out)
        : bp < PIC0 ? out.copy(connector(bp)) : out.copy(D).addScaledVector(dnDir, (bp - 29) * RISE);
      assemble(chain, {from: up_.s0 + up_.dir * up_.extent, to: dn.s0 + dn.dir * dn.extent, pieces, guide, memory: twist,
        far: bp => Math.abs(bp) > NEAR_BP && Math.abs(bp - enhMid) > NEAR_BP});
      const eNow = arms[st.side].e;
      fibre.band(0, view.enhancerBp[0], view.enhancerBp[1], ENHANCER_TINT, .8 * eNow);
      fibre.band(1, -82, -78, CCAAT_TINT, st.ccaat);
      fibre.set(chain); at.chain = chain;
      const m = new THREE.Matrix4(), sc = new THREE.Matrix4();
      beads.slice(0, MAXN).forEach((b, i) => { const s = Math.max(1e-3, b.s); octamers.setMatrixAt(i, m.copy(b.m).multiply(sc.makeScale(s, s, s))); });
      octamers.count = Math.min(MAXN, beads.length); octamers.instanceMatrix.needsUpdate = true;
      // Views for the camera: the loop (or the straight run to the enhancer) with the complex.
      const loopPts = []; for (let jj = 0; jj <= view.loopEnd; jj += Math.max(1, view.loopEnd / 120 | 0)) loopPts.push(view.pos(jj));
      const loopMid = centroid([...loopPts, complex.clone()]);
      at.loopView = toWorld(loopMid); at.loopRadius = Math.max(...loopPts.map(p => p.distanceTo(loopMid))) + 160;
      const origin = V(0, 0, 0).applyMatrix4(view.pose);
      at.enhancerView = toWorld(origin); at.contactView = toWorld(origin.clone().lerp(tail, .5));
      at.linearView = toWorld(origin.clone().lerp(complex, .5)); at.linearRadius = origin.distanceTo(complex) / 2 + 240;
      // To see LEF-1 at the contact, look from its side of Mediator's tail, from above.
      const d = toWorld(view.lefWorld).sub(toWorld(tail)).normalize();
      const typesDir = d.multiplyScalar(.75).add(V(-.25, -.2, -1).normalize().multiplyScalar(.45)); typesDir.y = Math.min(typesDir.y, -.25);
      at.typesDir = typesDir.normalize().toArray();
      at.lefProtein = view.lefWorld;
      at.state = st; at.mod = mod; at.pose = view.pose; at.beads = beads; at.loopLen = arms[st.side].ell[view.loopEnd];
      at.loopGuide = view.loop ? Array.from({length: 200}, (_, i) => view.loop.at(view.loop.L * i / 199)) : loopPts;
      at.enhancerToTail = origin.distanceTo(tail);
    }

    at.sideView = toWorld(complex.clone().addScaledVector(up, 260)); at.sideRadius = 1500;
    // The CCAAT box is seen from above and outside the complex, looking down on NF-Y and its DNA.
    const nfyCentre = centroid(nfyMeshes.map(m => V(...m.userData.rec.center).applyMatrix4(nfyPose)));
    at.ccaatView = toWorld(nfyCentre.clone().lerp(U, .25));
    const outward = toWorld(nfyCentre).sub(toWorld(complex)); outward.y = 0; outward.normalize();
    at.ccaatDir = [outward.x * .55, -.83, outward.z * .55];

    let last = '', lastT = -1, lastKb = null;
    return {
      frame, fibre, chain, modA, modB, at, nucLocal, pattern, turn: seg,  // for tests (?debug=1)
      update(t, {pxPerA = 1} = {}) {
        if (Math.abs(t - lastT) > .5) twist.clear();  // a jump in time: the DNA's twist starts afresh
        lastT = t;
        fibre.view(pxPerA);
        // Where the enhancer is (side), how closed the loop is (w), how long it is (kb), its inversion, and its
        // presence on each arm while it changes side.
        const swap = T.side + 3.4, sideNow = t < swap ? 'up' : 'down';
        let w = ramp(t, T.loop + .6, T.loop + 4.4);
        if (t >= T.side) w = sideNow === 'up' ? 1 - ramp(t, T.side + .8, T.side + 3.2) : ramp(t, T.side + 4, T.side + 7.6);
        const grow = ramp(t, T.far + .6, T.far + 5) * (1 - ramp(t, T.far + 8.2, T.far + 12));
        const kb = KB0 * Math.exp(Math.log(50 / KB0) * grow);
        const inv = Math.PI * ramp(t, T.invert + 1.2, T.invert + 4.6);
        const eUp = sideNow === 'up' ? 1 - ramp(t, swap - 1.4, swap) : 0, eDn = sideNow === 'down' ? ramp(t, swap, swap + 1.4) : 0;
        const ccaat = ramp(t, T.ccaat + .6, T.ccaat + 1.8);
        // How many base pairs a nucleosome takes to form as the enhancer's free stretch moves off it: a full repeat
        // while the loop grows and shrinks (so its length changes smoothly), a few pairs otherwise (whole or gone).
        const fade = 24 + 176 * ramp(t, T.far + .1, T.far + .6) * (1 - ramp(t, T.far + 12, T.far + 12.8));
        const r = x => +x.toFixed(4);
        const st = {side: sideNow, w: r(w), kb: +kb.toFixed(3), inv: r(inv), eUp: r(eUp), eDn: r(eDn), ccaat: r(ccaat), fade: +fade.toFixed(2)};
        // As the loop grows or shrinks, the enhancer module stays where it is while it moves along the DNA's
        // numbering (the loop's DNA and the DNA beyond keep their numbers, sliding along their paths): the twist
        // kept for the module's DNA moves with it.
        const kbBp = Math.round(st.kb * 1000);
        if (lastKb !== null && kbBp !== lastKb && sideNow === 'up') {
          const shift = lastKb - kbBp, first = -lastKb - 26, last = first + modA.MN - 1, moved = [];
          for (const [k, v] of twist) { const b = typeof k === 'number' ? k : +k.slice(5); if (b >= first && b <= last) moved.push([k, v, b]); }
          for (const [k] of moved) twist.delete(k);
          for (const [k, v, b] of moved) twist.set(typeof k === 'number' ? b + shift : 'bulge' + (b + shift), v);
        }
        lastKb = kbBp;
        const key = JSON.stringify(st);
        if (key !== last) { last = key; build(st); }
        modA.g.visible = sideNow === 'up' && (modA.shown ?? 1) > .01; modB.g.visible = sideNow === 'down' && (modB.shown ?? 1) > .01;
        modA.arrow.visible = modB.arrow.visible = t >= T.invert - .2 && t < T.types;
        // Mediator, the co-activator, arrives as the loop closes and stays.
        const med = ramp(t, T.loop + 1.4, T.loop + 4.6);
        fadeObject(mediator, med); mediator.position.copy(up).multiplyScalar(170 * (1 - med));
      },
      annotate(t, {label, tag}) {
        const P = v => toWorld(v);
        const enh = () => P(V(0, 0, 0).applyMatrix4(at.pose));
        const st = at.state;
        if (t < T.loop) {
          if (t > 1.2) {
            label(P(V(...rec('pic', 'RNAP II').center)), 'Promoter · basal apparatus', 'RNAP II with its basal factors', {color: hex(COLOUR['RNAP II'])});
            label(enh(), 'Enhancer · activators', 'Closely packed sites for transcription factors', {color: hex(ENHANCER_TINT)});
            if (at.beads[2]) tag(P(at.beads[2].p), 'Nucleosome', {color: hex(COLOUR.Histones)});
            tag(P(D.clone().addScaledVector(dnDir, 60)), 'Transcription →', {color: '#cfe3ea'});
          }
        } else if (t < T.far) {
          if (t > T.loop + 4.6) {
            label(P(tail), 'Co-activator', 'Recruited by the activators', {color: hex(COLOUR['Mediator tail'])});
            tag(enh(), 'Enhancer', {color: hex(ENHANCER_TINT)});
            tag(P(V(...rec('pic', 'RNAP II').center)), 'Promoter', {color: hex(COLOUR['RNAP II'])});
          }
        } else if (t < T.side) {
          tag(enh(), 'Enhancer', {color: hex(ENHANCER_TINT)});
          tag(P(complex), 'Promoter', {color: hex(COLOUR['RNAP II'])});
          if (st.kb > 40) tag(P(at.loopGuide[Math.floor(at.loopGuide.length * .28)]), 'About 50 kilobases of DNA', {color: '#cfe3ea'});
        } else if (t < T.invert) {
          if (st.w > .9 || st.w < .1) tag(enh(), st.side === 'up' ? 'Enhancer · upstream' : 'Enhancer · downstream', {color: hex(ENHANCER_TINT)});
          tag(P(complex), 'Promoter', {color: hex(COLOUR['RNAP II'])});
        } else if (t < T.types) {
          if (t < T.invert + 1.2) label(enh(), 'Enhancer', 'In one orientation', {color: hex(ENHANCER_TINT)});
          else if (t > T.invert + 4.8) label(enh(), 'Enhancer · inverted', 'Still works the other way round', {color: hex(ENHANCER_TINT)});
        } else if (t < T.ccaat) {
          if (t > T.types + 2.4) {
            label(enh(), 'Activators', 'Bind the enhancer; reach the basal machinery through the co-activator', {color: hex(COLOUR.p65)});
            label(P(tail), 'Co-activator', 'Recruited by the activators', {color: hex(COLOUR['Mediator tail'])});
            label(P(at.lefProtein), 'Architectural factor', 'Bends the DNA', {color: hex(COLOUR['LEF-1'])});
            tag(P(V(...rec('pic', 'TFIID').center)), 'Basal apparatus', {color: hex(COLOUR['RNAP II'])});
          }
        } else if (t > T.ccaat + 1.8) {
          label(P(nfyPts[9]), 'CCAAT box · about −80', 'A promoter element, not an enhancer', {color: hex(CCAAT_TINT)});
          tag(P(U), 'Core promoter', {color: hex(COLOUR['RNAP II'])});
        }
      },
    };
  },
});
