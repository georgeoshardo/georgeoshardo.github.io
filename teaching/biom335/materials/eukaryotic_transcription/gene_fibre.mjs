// The promoter, enhancer and chromatin shared by chapter 3's gene-scale scenes: the TFIID-based
// preinitiation complex with Mediator (7ENC) at the promoter, NF-Y on its CCAAT box (4AWL), the interferon-β
// enhancer with its activators (2O61, 1T2K) and the LEF-1 architectural factor (2LEF) beside it, nucleosomes
// (1KX5) and how open chromatin sets them along a fibre, and the helpers that lay a fibre's path and a loop.
// Every structure brings its own DNA; ../shared/chromatin.mjs draws the DNA between them, a base pair at a
// time.
import * as THREE from 'three';
import {PALETTE, loadSurfaceSet, surfaceGeometry, proteinMaterial} from '../shared/molecules.mjs';
import {RISE, TWIST, pairsFromStrands, frameFromPairs, meanLocal, createMorph} from '../shared/dna.mjs';
import {createChain, createFibre, fillFrames, dyadTurn, nucleosomePattern, screw, zOf} from '../shared/chromatin.mjs';
import {fitRigid, fitError} from '../shared/fit.mjs';

const V = (...a) => new THREE.Vector3(...a);
export const NUC_SPAN = 147, NUC_STEP = 200;              // bp a nucleosome wraps; the nucleosome repeat
export const TURN = 100;                                   // radius (Å) of the DNA's turn onto a loop at either end

export const COLOUR = {
  'RNAP II': 0x9fb0b8, TFIID: 0x86b88f, TBP: PALETTE.tbp, TFIIA: 0x9a8fc4, TFIIB: 0xe07f6b, TFIIF: 0x5b9fd0, TFIIE: 0xc39bdc,
  TFIIH: 0xd4b04a, CAK: 0xc0714e, 'Mediator head': 0xb07cc6, 'Mediator middle': 0xc294d4, 'Mediator tail': 0x9c6ab7,
  p65: 0xf2a65a, p50: 0xe98b4a, 'IRF-7': 0xf07a8a, 'IRF-3 (2O61)': 0xe8667a, 'IRF-3 a': 0xf49aa6, 'IRF-3 b': 0xd9586d, 'c-Jun': 0xf6c667, 'ATF-2': 0xe5b04e,
  'LEF-1': 0x6fd0a8, 'NF-YA': 0xa9d86e, 'NF-YB': 0x8fc75a, 'NF-YC': 0xbfe38a, Histones: 0xc9bfd8, DNA: 0x72cdeb,
};
export const PIC_PARTS = ['RNAP II', 'TFIID', 'TBP', 'TFIIA', 'TFIIB', 'TFIIF', 'TFIIE', 'TFIIH', 'CAK'];
export const MEDIATOR = ['Mediator head', 'Mediator middle', 'Mediator tail'];
export const ACTIVATORS = [['enh', 'p65'], ['enh', 'p50'], ['enh', 'IRF-7'], ['enh', 'IRF-3 (2O61)'], ['enh2', 'IRF-3 a'], ['enh2', 'IRF-3 b'], ['enh2', 'c-Jun'], ['enh2', 'ATF-2']];
export const ENHANCER_TINT = 0xf2a65a, CCAAT_TINT = 0xa9d86e;

// Loads the structures (the chapter's `enhancer` surface set) into `world` and returns everything the scenes
// build from: meshes placed in a scene frame (the gene along +x, Mediator above), each structure's DNA as
// base-pair frames, the enhancer modules, nucleosome geometry, the fibre and its chain, and the path helpers.
export async function geneSetup({world, progress}) {
    const set = await loadSurfaceSet('assets/enhancer.json', 'assets/enhancer.bin', progress);
    const rec = (s, n) => set.meta.meshes.find(m => m.structure === s && m.name === n);
    const strand = (s, n) => set.meta.strands.find(x => x.structure === s && x.name === n);
    const makeMesh = (s, n) => { const r = rec(s, n), m = new THREE.Mesh(surfaceGeometry(r, set.buffer), proteinMaterial(COLOUR[n])); m.userData.rec = r; return m; };
    const verts = (m, stride) => { const a = (m.isMesh ? m.geometry : m).attributes.position, out = []; for (let i = 0; i < a.count; i += stride) out.push(V().fromBufferAttribute(a, i)); return out; };
    const geometryOf = (s, n) => surfaceGeometry(rec(s, n), set.buffer);
    // A structure's duplex as base-pair frames (dna.mjs), every pair from its first to its last paired one
    // (any left unpaired filled in), numbered by strand a.
    const crystal = (s, a, b) => { const pairs = pairsFromStrands(strand(s, a), strand(s, b)); return fillFrames(pairs.map(p => p.a.num), frameFromPairs(pairs)); };
    const matQ = m => new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().extractRotation(m));

    // ---------- Geometry from the structures ----------
    // A duplex's axis: the midpoints of paired bases along strand a, gaps filled from paired neighbours.
    function axis(s, aName, bName) {
      const A = strand(s, aName), B = strand(s, bName);
      const pts = A.base.map((b, i) => { const p = A.partner[i]; return p && p[0] === B.chain ? V(...b).add(V(...B.base[p[1]])).multiplyScalar(.5) : null; });
      const first = pts.findIndex(Boolean), last = pts.length - 1 - [...pts].reverse().findIndex(Boolean);
      for (let i = first; i <= last; i++) if (!pts[i]) {
        let lo = i - 1, hi = i + 1; while (!pts[lo]) lo--; while (!pts[hi]) hi++;
        pts[i] = pts[lo].clone().lerp(pts[hi], (i - lo) / (hi - lo));
      }
      return {points: pts.slice(first, last + 1), numbers: A.numbers.slice(first, last + 1)};
    }
    const centroid = pts => pts.reduce((a, p) => a.add(p), V()).divideScalar(pts.length);
    // Principal direction of points (power iteration), oriented from first to last.
    function direction(pts) {
      const c = centroid(pts), C = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
      for (const p of pts) { const d = [p.x - c.x, p.y - c.y, p.z - c.z]; for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) C[i][j] += d[i] * d[j]; }
      let v = pts[pts.length - 1].clone().sub(pts[0]).normalize();
      for (let k = 0; k < 30; k++) v = V(C[0][0] * v.x + C[0][1] * v.y + C[0][2] * v.z, C[1][0] * v.x + C[1][1] * v.y + C[1][2] * v.z, C[2][0] * v.x + C[2][1] * v.y + C[2][2] * v.z).normalize();
      return v.dot(pts[pts.length - 1].clone().sub(pts[0])) < 0 ? v.negate() : v;
    }
    const basis = (x, y) => { const z = x.clone().cross(y).normalize(); y = z.clone().cross(x).normalize(); return new THREE.Matrix4().makeBasis(x.clone().normalize(), y, z); };
    // A rotation taking a → b and (as nearly as possible) a2 → b2.
    const rotation = (a, b, a2, b2) => basis(b, b2).multiply(basis(a, a2).transpose());
    const aboutLine = (point, dir, angle) => new THREE.Matrix4().makeTranslation(point.x, point.y, point.z)
      .multiply(new THREE.Matrix4().makeRotationAxis(dir.clone().normalize(), angle)).multiply(new THREE.Matrix4().makeTranslation(-point.x, -point.y, -point.z));
    // The closest approach of two point clouds (for choosing how a factor sits on its DNA).
    const clearance = (A, B) => { let d = Infinity; for (const a of A) for (const b of B) { const x = a.distanceToSquared(b); if (x < d) d = x; } return Math.sqrt(d); };

    // The promoter: the PIC's DNA runs from −39 to +29 (the non-template strand's numbering).
    const pic = axis('pic', 'non-template', 'template');
    const U = pic.points[0], D = pic.points[pic.points.length - 1];
    const upDir = direction(pic.points.slice(0, 8)), dnDir = direction(pic.points.slice(-8));
    const bpOf = i => pic.numbers[i];
    const picMeshes = PIC_PARTS.map(n => makeMesh('pic', n)), medMeshes = MEDIATOR.map(n => makeMesh('pic', n));
    const medCentre = centroid(MEDIATOR.map(n => V(...rec('pic', n).center))), tail = V(...rec('pic', 'Mediator tail').center);
    const complex = centroid([...PIC_PARTS, ...MEDIATOR].map(n => V(...rec('pic', n).center)));
    const chord = D.clone().sub(U).normalize();
    const up = medCentre.clone().sub(U.clone().add(D).multiplyScalar(.5)); up.addScaledVector(chord, -up.dot(chord)).normalize();
    const side = chord.clone().cross(up).normalize();

    // The scene frame: the gene along +x, Mediator above (−y is up on screen).
    const frame = new THREE.Group();
    frame.quaternion.setFromRotationMatrix(new THREE.Matrix4().makeBasis(V(1, 0, 0), V(0, -1, 0), V(0, 0, -1)).multiply(basis(chord, up).transpose()));
    frame.position.copy(complex).applyQuaternion(frame.quaternion).negate();
    world.add(frame);
    const toWorld = v => frame.localToWorld(v.clone());
    picMeshes.forEach(m => frame.add(m));
    const mediator = new THREE.Group(); medMeshes.forEach(m => mediator.add(m)); frame.add(mediator);
    const picSample = [...picMeshes, ...medMeshes].flatMap(m => verts(m, 40));

    // NF-Y on the CCAAT box (−82 … −78): its DNA's downstream arm lies on the line from the PIC's upstream end;
    // it bends the DNA, and the turn about that line is the one that clears the PIC and points the upstream
    // DNA on upstream and a little down, away from Mediator above (where an enhancer's activators come).
    const nfy = axis('nfy', 'top', 'bottom'), NFY0 = -89;           // top index k is bp −89 + k
    const connector = bp => U.clone().addScaledVector(upDir, (bp - bpOf(0)) * RISE);
    const nfyMeshes = ['NF-YA', 'NF-YB', 'NF-YC'].map(n => makeMesh('nfy', n)), nfySample = nfyMeshes.flatMap(m => verts(m, 8));
    const nfyFit = fitRigid(nfy.points.slice(18), Array.from({length: nfy.points.length - 18}, (_, k) => connector(NFY0 + 18 + k)));
    const lineP = connector(-68), wantUp = chord.clone().negate().addScaledVector(up, -.25).normalize();
    let nfyPose = nfyFit, best = -Infinity;
    for (let a = 0; a < 36; a++) {
      const m = aboutLine(lineP, upDir, a / 36 * Math.PI * 2).multiply(nfyFit);
      const arm = nfy.points[0].clone().applyMatrix4(m).sub(nfy.points[4].clone().applyMatrix4(m)).normalize();
      const score = Math.min(14, clearance(nfySample.map(p => p.clone().applyMatrix4(m)), picSample)) + 16 * arm.dot(wantUp);
      if (score > best) { best = score; nfyPose = m; }
    }
    const nfyGroup = new THREE.Group(); nfyGroup.matrixAutoUpdate = false; nfyGroup.matrix.copy(nfyPose);
    nfyMeshes.forEach(m => nfyGroup.add(m)); frame.add(nfyGroup);
    const nfyPts = nfy.points.map(p => p.clone().applyMatrix4(nfyPose));
    const S = nfyPts[0].clone(), tS = nfyPts[0].clone().sub(nfyPts[4]).normalize();  // upstream DNA leaves here
    const Sdn = D.clone().addScaledVector(dnDir, 16 * RISE), tSdn = dnDir.clone();     // downstream, after +45

    // The enhancer: one duplex through both structures (1T2K's top strand 1–31, then 2O61's 15–35, which
    // continue it on the DNA the two share), in its own frame: centre at the origin, top strand along +x, the
    // NF-κB side up (+y).
    const enhPairs = [...pairsFromStrands(strand('enh2', 'top'), strand('enh2', 'bottom')).filter(p => p.a.num <= 31),
      ...pairsFromStrands(strand('enh', 'top'), strand('enh', 'bottom')).filter(p => p.a.num >= 15)];
    const enhCrystal = frameFromPairs(enhPairs), enhPts = enhCrystal.map(f => f.origin);
    const enhC = centroid(enhPts), enhDir = direction(enhPts);
    const nfkb = centroid([V(...rec('enh', 'p65').center), V(...rec('enh', 'p50').center)]).sub(enhC);
    const toEnhLocal = basis(enhDir, nfkb).transpose().multiply(new THREE.Matrix4().makeTranslation(-enhC.x, -enhC.y, -enhC.z)), enhQ = matQ(toEnhLocal);
    const actSample = ACTIVATORS.flatMap(([s, n]) => verts(geometryOf(s, n), 10)).map(p => p.applyMatrix4(toEnhLocal));
    const enhAll = enhCrystal.map(f => ({o: f.origin.clone().applyMatrix4(toEnhLocal), q: enhQ.clone().multiply(f.q)}));
    // Every base pair is drawn with one ideal pair's geometry (2O61's B-DNA) on its own frame.
    const local = meanLocal(enhPairs.slice(3, -3)), DYAD = dyadTurn(local);
    // The next (dir 1) or previous (−1) base pair of ideal B-DNA from a frame.
    const step = (f, dir) => { const z = zOf(f.q); return {o: f.o.clone().addScaledVector(z, dir * RISE), q: new THREE.Quaternion().setFromAxisAngle(z, dir * TWIST).multiply(f.q)}; };
    // The enhancer turns over (inversion) as its own DNA allows. Of the stretches of the structures' DNA a few
    // pairs shorter at either end (the frayed ends run on as free DNA), it is the one that, turned over, lies back
    // on itself most closely (both strands' backbones, each strand in the other's place), turning about an axis
    // that points most nearly towards the activators, so they still face Mediator; its ends land where they were.
    const backbones = (fr, swapped) => fr.flatMap(f => {
      const a = local.aBackbone.clone().applyQuaternion(f.q).add(f.o), b = local.bBackbone.clone().applyQuaternion(f.q).add(f.o);
      return swapped ? [b, a] : [a, b];
    });
    let seg = null;
    for (let a0 = 0; a0 <= 6; a0++) for (let a1 = enhAll.length - 1; a1 >= enhAll.length - 7; a1--) {
      const fr = enhAll.slice(a0, a1 + 1), P = backbones([...fr].reverse(), true), Q = backbones(fr, false);
      const M = fitRigid(P, Q), err = fitError(M, P, Q), sc = screw(M), score = Math.abs(sc.axis.y) - err / 8;
      if (!seg || score > seg.score) seg = {a0, a1, M, sc, err, score};
    }
    const enhFrames = enhAll.slice(seg.a0, seg.a1 + 1), EN = enhFrames.length;
    // Turned that way a fraction angle/π (in the enhancer's frame), lifting clear as it goes.
    const turnOver = angle => new THREE.Matrix4().makeTranslation(0, 0, -70 * Math.sin(angle)).multiply(seg.sc.at(angle / Math.PI));
    const lefCrystal = crystal('hmg', 'top', 'bottom'), LN = lefCrystal.length;
    // LEF-1 beside the enhancer, after its last pair (module A, the enhancer upstream of the gene) or before its
    // first (module B, downstream), joined to it by a spacer of ideal DNA that carries the enhancer's helix on
    // into LEF-1's own; of the spacers that could, the one that best clears the activators.
    function lefPlacement(after) {
      const lefSample = verts(geometryOf('hmg', 'LEF-1'), 6), anchor = after ? lefCrystal[0] : lefCrystal[LN - 1];
      let best = null;
      for (let s = 3; s <= 13; s++) {
        const spacer = []; let f = after ? enhFrames[EN - 1] : enhFrames[0];
        for (let i = 0; i < s; i++) { f = step(f, after ? 1 : -1); spacer.push(f); }
        const target = step(f, after ? 1 : -1), qm = target.q.clone().multiply(anchor.q.clone().invert());
        const m = new THREE.Matrix4().makeRotationFromQuaternion(qm).setPosition(target.o.clone().sub(anchor.o.clone().applyQuaternion(qm)));
        const score = clearance(lefSample.map(p => p.clone().applyMatrix4(m)), actSample);
        if (!best || score > best.score) best = {score, s, m, qm, target, spacer: after ? spacer : spacer.reverse()};
      }
      // LEF-1's DNA as in its structure (bent), and straight on from the spacer before LEF-1 binds.
      const bent = lefCrystal.map(f => ({o: f.o.clone().applyMatrix4(best.m), q: best.qm.clone().multiply(f.q)}));
      const straight = []; for (let i = 0, f = best.target; i < LN; i++, f = step(f, after ? 1 : -1)) straight.push(f);
      if (!after) straight.reverse();
      return {...best, bent, straight};
    }
    // A module: the enhancer with its activators, the spacer and LEF-1, in the enhancer's frame, placed on the
    // fibre by one matrix; the enhancer and its activators can turn over (inversion) within it.
    function module(after) {
      const g = new THREE.Group(), flipPart = new THREE.Group(), enhancerPart = new THREE.Group(), lefPart = new THREE.Group();
      for (const o of [g, flipPart, enhancerPart, lefPart]) o.matrixAutoUpdate = false;
      const inner = new THREE.Group(); inner.matrixAutoUpdate = false; inner.matrix.copy(toEnhLocal);
      ACTIVATORS.forEach(([s, n]) => inner.add(makeMesh(s, n))); enhancerPart.add(inner);
      const lef = lefPlacement(after);
      const lefInner = new THREE.Group(); lefInner.matrixAutoUpdate = false; lefInner.matrix.copy(lef.m); lefInner.add(makeMesh('hmg', 'LEF-1'));
      lefPart.add(lefInner); flipPart.add(enhancerPart); g.add(flipPart, lefPart); frame.add(g);
      // An arrow beside the enhancer along its sequence (5′→3′ of its top strand), turning with it when inverted.
      const arrowMat = new THREE.MeshStandardMaterial({color: ENHANCER_TINT, emissive: ENHANCER_TINT, emissiveIntensity: .55, roughness: .5});
      const shaft = new THREE.Mesh(new THREE.CylinderGeometry(5, 5, 130, 14), arrowMat), head = new THREE.Mesh(new THREE.ConeGeometry(15, 38, 18), arrowMat);
      shaft.rotation.z = -Math.PI / 2; head.rotation.z = -Math.PI / 2; head.position.x = 84;
      const arrow = new THREE.Group(); arrow.add(shaft, head); arrow.position.set(-10, -72, 0); arrow.visible = false; arrow.matrixAutoUpdate = true; enhancerPart.add(arrow);
      const lefCentre = V(...rec('hmg', 'LEF-1').center).applyMatrix4(lef.m);  // the protein, in the module's frame
      const asDna = f => ({origin: f.o, q: f.q}), morph = createMorph(lef.straight.map(asDna), lef.bent.map(asDna), after ? 0 : LN - 1);
      const MN = EN + lef.s + LN;
      // LEF-1's DNA in chain order (increasing bp), bent as far as `bind`; the spacer before it is free DNA.
      const lefAt = bind => morph(bind).map(f => ({o: f.origin.clone(), q: f.q.clone()}));
      return {g, flipPart, enhancerPart, lefPart, arrow, lefCentre, after, s: lef.s, MN, lefAt};
    }
    const modA = module(true), modB = module(false);

    // Nucleosomes: the histone octamer with 1KX5's own 147 bp of DNA round it, in a frame centred on the octamer,
    // and how open chromatin sets them along the fibre.
    const histC = V(...rec('nucleosome', 'Histones').center);
    const nucLocal = crystal('nucleosome', 'top', 'bottom').map(f => ({o: f.o.sub(histC), q: f.q})), NS = nucLocal.length;
    const nucEnds = {entry: nucLocal[0].o, exit: nucLocal[NS - 1].o,
      tIn: nucLocal[3].o.clone().sub(nucLocal[0].o).normalize(), tOut: nucLocal[NS - 1].o.clone().sub(nucLocal[NS - 4].o).normalize()};
    const pattern = nucleosomePattern(nucEnds, {linker: NUC_STEP - NUC_SPAN});
    // Closed chromatin: straight linkers, each nucleosome turned 305° about the linker from the last: a compact
    // two-start fibre, 27 Å of fibre a nucleosome (four in 11 nm), the octamers 140 Å from its axis and its
    // crossing linkers 38 Å apart.
    const patternClosed = nucleosomePattern(nucEnds, {linker: NUC_STEP - NUC_SPAN, closed: true, beta: 305 * Math.PI / 180});
    const MAXN = 320;
    const octamers = new THREE.InstancedMesh(surfaceGeometry(rec('nucleosome', 'Histones'), set.buffer).clone().translate(-histC.x, -histC.y, -histC.z), proteinMaterial(COLOUR.Histones, {rim: .25}), MAXN);
    octamers.frustumCulled = false; octamers.count = 0; frame.add(octamers);
    // The promoter's DNA, as in its structures: NF-Y's on the CCAAT box, and the PIC's from −39 to +29.
    const nfyQ = matQ(nfyPose), nfyFrames = crystal('nfy', 'top', 'bottom').map(f => ({o: f.o.applyMatrix4(nfyPose), q: nfyQ.clone().multiply(f.q)}));
    const picFrames = crystal('pic', 'non-template', 'template'), PIC0 = picFrames[0].num;
    // RNAP II transcribing (6GMH, superposed on 7ENC's RNAP II): the DNA through the polymerase as base-pair frames
    // numbered by its non-template strand (the transcription bubble filled in), the RNA from its 5′ end to its 3′
    // end at the active site, the non-template number opposite that end, and the downstream DNA's axis.
    const ecPairs = pairsFromStrands(strand('ec', 'non-template'), strand('ec', 'template'));
    const ecFrames = fillFrames(ecPairs.map(p => p.a.num), frameFromPairs(ecPairs));
    const pairSum = ecPairs[0].a.num + ecPairs[0].b.num;  // template residue i pairs with non-template pairSum − i
    const rnaStrand = strand('ec', 'RNA'), ecTemplate = strand('ec', 'template');
    const rna3 = rnaStrand.partner[rnaStrand.partner.length - 1], ntActive = pairSum - ecTemplate.numbers[rna3[1]];
    const rnaBackbone = rnaStrand.backbone.map(b => V(...b)), rnaBase = rnaStrand.base.map(b => V(...b));
    const ecDown = ecFrames.filter(f => f.num >= ntActive + 4).map(f => f.o), ecAxis = {point: centroid(ecDown), dir: direction(ecDown)};
    // All of the DNA, one base pair at a time.
    const fibre = createFibre({local, maxNear: 24000, maxFar: 140000}); frame.add(fibre.group);
    const chain = createChain(90000);

    // A smooth guide from P0 (leaving along t0) turning towards `heading` with a slow wave. Its shape depends
    // only on distance along it, so a longer guide starts the same way.
    function wander(P0, t0, heading, length, wave = 22) {
      const pts = [P0.clone()], d = t0.clone(), p = P0.clone(), n = heading.clone().cross(up).normalize();
      if (n.lengthSq() < .1) n.copy(side);
      for (let l = 0; l < length + 8; l += 8) {
        d.lerp(heading, Math.min(1, 8 / 260)).normalize();
        p.addScaledVector(d, 8);
        pts.push(p.clone().addScaledVector(n, wave * Math.sin(l / 520) * Math.min(1, l / 300)).addScaledVector(up, .6 * wave * Math.sin(l / 810 + 1)));
      }
      return pts;
    }
    // A turn: from P along the unit direction t, a circular arc of radius r turning towards the direction `to`: its
    // points, its end and the direction there. Near a U-turn the plane to turn in is ill defined (the directions
    // nearly opposite) and would swing as they move, so from about 115° on it is drawn towards `bias` (the loop's
    // own plane), and the turn stays steady.
    function turn(P, t, to, r, bias) {
      const theta = Math.acos(Math.min(1, Math.max(-1, t.dot(to))));
      const n = to.clone().addScaledVector(t, -t.dot(to)), b = bias.clone().addScaledVector(t, -t.dot(bias));
      if (b.lengthSq() > 1e-8) b.normalize();
      const k = Math.min(1, Math.max(0, (theta - 2) / .9));
      n.addScaledVector(b, .6 * k * k * (3 - 2 * k));
      if (n.lengthSq() < 1e-8) n.copy(b);
      n.normalize();
      const steps = Math.max(1, Math.ceil(theta * r / 6)), pts = [];
      for (let i = 0; i <= steps; i++) { const a = theta * i / steps; pts.push(P.clone().addScaledVector(t, r * Math.sin(a)).addScaledVector(n, r * (1 - Math.cos(a)))); }
      return {pts, end: pts[steps]};
    }
    // The loop: from A (leaving along tA) round a circular arc bulging away from the complex to B (arriving
    // against tB), with a gentle wobble out of plane. At each end the DNA turns from its own direction onto
    // the circle along an arc of radius TURN (the circle is refitted through the turns' ends until they meet
    // it along its own direction), so it never kinks. The circle's centre (and so its size) is found so the
    // loop is as long as the DNA in it: a nearly straight run for a short loop, most of a circle for a long one.
    function loop(A, tA, B, tB, length, bulge) {
      const wobble = .1 * length / (Math.PI * 2), dist = A.distanceTo(B);
      const circle = (P, Q, d) => {
        const mid = P.clone().add(Q).multiplyScalar(.5), e1 = Q.clone().sub(P).normalize(), R = Math.hypot(d, P.distanceTo(Q) / 2);
        const e2 = bulge.clone(); e2.addScaledVector(e1, -e2.dot(e1)); if (e2.lengthSq() < 1e-3) e2.copy(up).addScaledVector(e1, -up.dot(e1)); e2.normalize();
        const e3 = e1.clone().cross(e2), O = mid.clone().addScaledVector(e2, d);
        const angle = p => Math.atan2(p.clone().sub(O).dot(e2), p.clone().sub(O).dot(e1));
        let a0 = angle(P), a1 = angle(Q);
        while (a0 < Math.PI / 2) a0 += Math.PI * 2; while (a1 > Math.PI / 2) a1 -= Math.PI * 2;  // through the far side
        const on = f => { const a = a0 + (a1 - a0) * f; return O.clone().addScaledVector(e1, R * Math.cos(a)).addScaledVector(e2, R * Math.sin(a)).addScaledVector(e3, wobble * Math.sin(Math.PI * f) * Math.sin(3 * Math.PI * f + .6)); };
        const along = f => on(Math.min(1, f + 1e-4)).sub(on(Math.max(0, f - 1e-4))).normalize();
        return {on, along, e2, span: R * Math.abs(a1 - a0)};
      };
      const arc = d => {
        let P = A, Q = B, c, inA, inB;
        for (let k = 0; k < 4; k++) {
          c = circle(P, Q, d);
          inA = turn(A, tA, c.along(0), TURN, c.e2); inB = turn(B, tB, c.along(1).negate(), TURN, c.e2);
          P = inA.end; Q = inB.end;
        }
        c = circle(P, Q, d);
        const n = Math.max(24, Math.min(1500, Math.round(c.span / 8))), pts = [...inA.pts];
        for (let i = 1; i < n; i++) pts.push(c.on(i / n));
        return pts.concat(inB.pts.reverse());
      };
      let lo = -40 * dist - 4000, hi = Math.max(dist, length);
      if (lengthOf(arc(lo)) > length) return arc(lo);
      for (let k = 0; k < 40; k++) { const d = (lo + hi) / 2; if (lengthOf(arc(d)) < length) lo = d; else hi = d; }
      return arc((lo + hi) / 2);
    }
    const lengthOf = pts => { let L = 0; for (let i = 1; i < pts.length; i++) L += pts[i].distanceTo(pts[i - 1]); return L; };
    function sampler(pts) {
      const cum = [0]; for (let i = 1; i < pts.length; i++) cum.push(cum[i - 1] + pts[i].distanceTo(pts[i - 1]));
      const L = cum[cum.length - 1];
      return {L, at(l, out = V()) {
        const x = Math.min(L, Math.max(0, l)); let lo = 0, hi = cum.length - 1;
        while (hi - lo > 1) { const m = (lo + hi) >> 1; if (cum[m] <= x) lo = m; else hi = m; }
        return out.lerpVectors(pts[lo], pts[hi], (x - cum[lo]) / ((cum[hi] - cum[lo]) || 1));
      }};
    }

    // A module's pose: lying along its arm (straight), or with the activators at Mediator's tail (looped).
    const contact = tail.clone().addScaledVector(tail.clone().sub(medCentre).normalize(), 105);
    const loopPose = () => new THREE.Matrix4().makeTranslation(contact.x, contact.y, contact.z).multiply(rotation(V(1, 0, 0), chord.clone().negate(), V(0, 1, 0), medCentre.clone().sub(contact)));
    const blendPose = (a, b, w) => {
      const pa = V(), qa = new THREE.Quaternion(), pb = V(), qb = new THREE.Quaternion(), s = V();
      a.decompose(pa, qa, s); b.decompose(pb, qb, s);
      return new THREE.Matrix4().compose(pa.lerp(pb, w), qa.slerp(qb, w), V(1, 1, 1));
    };
    const heading = {up: chord.clone().negate().addScaledVector(up, .18).normalize(), down: chord.clone().addScaledVector(up, .12).normalize()};
    const bulge = {up: chord.clone().negate().addScaledVector(up, .9).normalize(), down: chord.clone().addScaledVector(up, .9).normalize()};
    // Chromatin beyond a looped enhancer leaves up and away, behind the scene (−side is away from the viewer).
    const away = {up: chord.clone().multiplyScalar(-.35).addScaledVector(up, .55).addScaledVector(side, -.75).normalize(),
      down: chord.clone().multiplyScalar(.35).addScaledVector(up, .55).addScaledVector(side, -.75).normalize()};
    const armStart = {up: [S, tS], down: [Sdn, tSdn]};

    // A pair of the enhancer in the scene: the module at `pose` (rotation poseQ), the enhancer turned by F within
    // it. Turned right over (OVER), the chain meets its pairs in reverse, each seen from its other strand (its
    // top strand now continues the chromosome's other strand).
    const OVER = turnOver(Math.PI), OVERQ = matQ(OVER), I4 = new THREE.Matrix4(), IQ = new THREE.Quaternion();
    function moduleFrame(dna, pose, poseQ, F, FQ, reversed, i, o, q) {
      const src = reversed ? dna[dna.length - 1 - i] : dna[i];
      o.copy(src.o).applyMatrix4(F).applyMatrix4(pose);
      q.copy(poseQ).multiply(FQ).multiply(src.q); if (reversed) q.multiply(DYAD);
    }

    return {set, rec, strand, makeMesh, verts, geometryOf, crystal, matQ, axis, centroid, direction, basis, rotation, aboutLine, clearance, pic, U, D, upDir, dnDir, bpOf, picMeshes, medMeshes, medCentre, tail, complex, chord, up, side, frame, toWorld, mediator, picSample, nfy, NFY0, connector, nfyMeshes, nfySample, nfyFit, lineP, wantUp, nfyPose, best, nfyGroup, nfyPts, S, tS, Sdn, tSdn, enhPairs, enhCrystal, enhPts, enhC, enhDir, nfkb, toEnhLocal, enhQ, actSample, enhAll, local, DYAD, step, backbones, seg, enhFrames, EN, turnOver, lefCrystal, LN, lefPlacement, module, modA, modB, histC, nucLocal, NS, nucEnds, pattern, patternClosed, MAXN, octamers, ecFrames, pairSum, ntActive, rnaBackbone, rnaBase, ecAxis, nfyQ, nfyFrames, picFrames, PIC0, fibre, chain, wander, turn, loop, lengthOf, sampler, contact, loopPose, blendPose, heading, bulge, away, armStart, OVER, OVERQ, I4, IQ, moduleFrame};
}
