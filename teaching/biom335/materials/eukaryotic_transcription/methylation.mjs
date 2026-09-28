// Scene: DNA methylation at a promoter. One DNA (a 110 bp teaching sequence: a CpG-island promoter with a
// CRE and a TATA box, then the start of the gene body) drawn as ideal B-DNA from the base-pair geometry of
// a straight stretch of RNAP II's downstream DNA (9QEB), with a methyl group on carbon 5 of each methylated
// cytosine, in the major groove. The enzymes and factors are placed on it by fitting their crystal DNA to
// it: DNMT1 on hemimethylated DNA (6X9I), DNMT3A–DNMT3L (5YX2), TET2 (4NM6), CREB on its CRE (1DH3) and TBP,
// which bends the TATA box as in 1C9B.
import * as THREE from 'three';
import {runScene} from '../shared/scene_player.mjs';
import {PALETTE, loadSurfaceSet, surfaceGeometry, proteinMaterial, fadeObject} from '../shared/molecules.mjs';
import {smooth, ramp} from '../shared/ease.mjs';
import {pairsFromStrands, frameFromPairs, extend, createDuplex, createMorph, meanLocal, sequencePairs, helixFrames, RISE, TWIST} from '../shared/dna.mjs';
import {fitRigid} from '../shared/fit.mjs';

const V = (...a) => new THREE.Vector3(...a);
const hex = c => '#' + c.toString(16).padStart(6, '0');

// Strand a (coding, 5′→3′, left to right). CRE TGACGTCA at 8–15, TATA box 39–46, start point at 70; the
// CpG island runs to 75; the gene body beyond has CpGs only at 84, 98 (14 bp apart, as the two sites
// DNMT3A–DNMT3L methylates in its structure) and 104.
const SEQUENCE = 'GCGGCGCC' + 'TGACGTCA' + 'GCCGCGCA' + 'CCGCGGCT' + 'CCGCCCT' + 'TATAAAAG' + 'GCGCCGCCC' + 'GCGGCTCC' + 'GCGTCC' +
  'AGTCGC' + 'TTCAGAAT' + 'CG' + 'TTAGAATCTATT' + 'CG' + 'ATTA' + 'CG' + 'TAAC';
const N = SEQUENCE.length, ISLAND = [0, 75], CRE = 8, TATA = 39, START = 70;
const CPGS = [...SEQUENCE].map((c, i) => c === 'C' && SEQUENCE[i + 1] === 'G' ? i : -1).filter(i => i >= 0);
const BODY_METHYLATED = [104], DE_NOVO = [84, 98], CLOSE = 57;
const ISLAND_CPGS = CPGS.filter(i => i <= ISLAND[1]), KEPT = [...ISLAND_CPGS, ...BODY_METHYLATED];  // methylated before replication
const PER = .55;  // seconds a working enzyme spends at each CpG (and moving on to the next)
const METHYL = 0xf2746b, CPG_TINT = 0xf8d0a8, NEW_STRAND = 0x8fd3a0;
const COLOUR = {DNMT1: 0x9f86d0, 'DNMT3A a': 0x8c7bc2, 'DNMT3A b': 0x8c7bc2, 'DNMT3L a': 0xb3a6d9, 'DNMT3L b': 0xb3a6d9, TET2: 0x62b6a6, CREB: 0xe8874f, TBP: PALETTE.tbp};

const T = {cpg: 11, island: 21, copy: 31, denovo: 50, tet: 60, active: 78, end: 89};
const HOP = {dnmt1: T.copy + 8.2, tet: T.tet + 1.2};  // when each enzyme reaches its first CpG
const steps = [
  {t: 0, nav: 'A silenced promoter', title: 'Methylation can<br>silence a promoter.', notes: 'gene-expression-is-associated-with-demethylation', hold: 1.1,
    text: 'Methylation of DNA is an epigenetic change: it does not change the DNA sequence itself, but is often heritable. At a promoter silenced by methylation, transcription can be prevented even if its specific transcription factors are present.'},
  {t: T.cpg, nav: '5-methylcytosine', title: 'A methyl group<br>on cytosine.', notes: 'gene-expression-is-associated-with-demethylation',
    text: 'In mammals, methylation typically occurs on carbon 5 of cytosine, creating 5-methylcytosine, at CG doublets: CpG sites.'},
  {t: T.island, nav: 'CpG islands', title: 'CpG islands<br>at promoters.', notes: 'gene-expression-is-associated-with-demethylation',
    text: 'CpG islands are regions rich in CG doublets. Around half lie in gene promoter regions, and 60–70% of human genes have one in their promoter.'},
  {t: T.copy, nav: 'Kept after replication', title: 'Kept through<br>DNA replication.', notes: 'gene-expression-is-associated-with-demethylation', hold: 1.1,
    text: 'After replication each methylated CG doublet is methylated on one strand only. A maintenance methyltransferase methylates the other, so the methylation can be stably maintained over many cell divisions.'},
  {t: T.denovo, nav: 'De novo methylation', title: 'Methylating<br>unmethylated sites.', notes: 'gene-expression-is-associated-with-demethylation',
    text: 'A de novo methyltransferase can methylate a previously unmethylated CG site.'},
  {t: T.tet, nav: 'TET enzymes', title: 'TET enzymes start<br>removing methyl groups.', notes: 'gene-expression-is-associated-with-demethylation', hold: 1.1,
    text: 'TET enzymes oxidise the methyl groups, initiating a repair pathway that replaces the modified cytosines with unmethylated ones. At promoters silenced by DNA methylation, loss of promoter methylation can permit activation.'},
  {t: T.active, nav: 'An active gene', title: 'Undermethylated promoter,<br>methylated body.', notes: 'gene-expression-is-associated-with-demethylation',
    text: 'A gene that is actively transcribed is generally undermethylated at its 5′ promoter region, while the body of an active gene is often methylated.'},
];

const at = {};

runScene({
  pageTitle: 'DNA methylation · Eukaryotic transcription', eyebrow: 'DNA methylation',
  links: [{href: 'index.html', text: 'All scenes'}, {href: '../protein_browser/?chapter=eukaryotic#dnmt1', text: 'Protein library'}],
  steps, duration: T.end, notesPage: 'notes.html', fov: 28,
  shots: [
    {t: 0, frame: () => ({target: at.whole || V(), dir: [.1, -.22, -1], radius: 225, fill: .95})},
    {t: T.cpg, blend: 2.8, frame: () => ({target: at.closeView || V(), dir: [.45, -.35, -1], radius: 34, fill: .9})},
    {t: T.island, blend: 2.6, frame: () => ({target: at.whole || V(), dir: [-.1, -.3, -1], radius: 225, fill: .95})},
    {t: T.copy, blend: 2.4, frame: () => ({target: at.copyView || V(), dir: [.12, -.25, -1], radius: at.copyRadius || 240, fill: .95})},
    {t: T.denovo, blend: 2.6, frame: () => ({target: at.denovoView || V(), dir: [-.3, -.3, -1], radius: 95, fill: .92})},
    {t: T.tet, blend: 2.6, frame: () => ({target: at.tetView || V(), dir: [.2, -.32, -1], radius: 175, fill: .92})},
    {t: T.active, blend: 2.8, frame: () => ({target: at.whole || V(), dir: [.05, -.25, -1], radius: at.wholeRadius || 240, fill: .95})},
  ],
  async build({world, progress}) {
    const set = await loadSurfaceSet('assets/methylation.json', 'assets/methylation.bin', progress);
    const strand = (s, n) => set.meta.strands.find(x => x.structure === s && x.name === n);
    const rec = (s, n) => set.meta.meshes.find(m => m.structure === s && m.name === n);
    const makeMesh = (s, n) => { const m = new THREE.Mesh(surfaceGeometry(rec(s, n), set.buffer), proteinMaterial(COLOUR[n])); m.userData.rec = rec(s, n); return m; };

    // Ideal B-DNA: the mean base-pair geometry of the longest paired run of 9QEB's downstream DNA.
    const bdna = pairsFromStrands(strand('bdna', 'non-template'), strand('bdna', 'template'));
    frameFromPairs(bdna);
    const local = meanLocal(bdna.slice(4, bdna.length - 4));
    const pairs = sequencePairs(SEQUENCE, local);
    const start = V(-(N - 1) * 3.38 / 2, 0, 0);
    const straight = helixFrames(N, {origin: start, direction: V(1, 0, 0), reference: V(0, -1, 0)});
    const root = new THREE.Group(); world.add(root);
    // Parental DNA (coding strand ivory and thin, template blue and thick), then its two daughters, each with
    // one parental strand and one new strand (lilac).
    const duplex = (a, b) => { const d = createDuplex({pairs, template: a, coding: b, widths: [.72, 1], rung: [0xcfc8b8, 0x7eaac2]}); root.add(d.group); return d; };
    const D0 = duplex(0xe9e1cf, 0x72cdeb), D1 = duplex(0xe9e1cf, NEW_STRAND), D2 = duplex(NEW_STRAND, 0x72cdeb);
    const offset = (frames, dy) => frames.map(f => ({origin: f.origin.clone().add(V(0, dy, 0)), q: f.q}));

    // TBP's bent TATA box from 1C9B: its pairs' frames, fitted onto the straight DNA just upstream of the box,
    // replace the straight frames there; the DNA beyond continues from the last of them.
    const tbpPairs = pairsFromStrands(strand('tbp', 'TATA strand'), strand('tbp', 'complementary strand'));
    // The box's index among the paired pairs (for frames) and in the strand itself (for fitting TBP).
    const tbpFrames = frameFromPairs(tbpPairs), box = tbpPairs.map(p => p.a.letter).join('').indexOf('TATAAAAG');
    const boxInStrand = strand('tbp', 'TATA strand').sequence.indexOf('TATAAAAG');
    const w0 = TATA - box, w1 = w0 + tbpPairs.length;   // our pairs w0 … w1 − 1 take the crystal's frames
    D0.pose(straight);
    const align = fitRigid(tbpPairs.slice(0, 4).flatMap(p => [p.a.backbone, p.b.backbone]), [0, 1, 2, 3].flatMap(k => [D0.world.aBackbone[w0 + k].clone(), D0.world.bBackbone[w0 + k].clone()]));
    const alignQ = new THREE.Quaternion().setFromRotationMatrix(align);
    const windowFrames = tbpFrames.map(f => ({origin: f.origin.clone().applyMatrix4(align), q: alignQ.clone().multiply(f.q)}));
    const bentRaw = extend([...straight.slice(0, w0), ...windowFrames], 0, N - w1);
    // Turned about the TATA box's centre by half the bend, so the two arms tilt alike (the promoter up one
    // side, the gene body down the other) rather than the gene body alone swinging round.
    const mid = TATA + 4, pivot = bentRaw[mid].origin.clone(), dOut = V(0, 0, 1).applyQuaternion(bentRaw[N - 1].q);
    const plane = V(1, 0, 0).cross(dOut).normalize(), half = -V(1, 0, 0).angleTo(dOut) / 2;
    const turn = new THREE.Quaternion().setFromAxisAngle(plane, half);
    const bentFrames = bentRaw.map(f => ({origin: f.origin.clone().sub(pivot).applyQuaternion(turn).add(pivot), q: turn.clone().multiply(f.q)}));
    const bend = createMorph(straight, bentFrames, mid), bendFrames = [];

    // Methyl groups: one instanced sphere per cytosine of each CpG (strand a's C at i, strand b's C at i + 1).
    const sites = CPGS.flatMap(i => [{i, strand: 'a'}, {i: i + 1, strand: 'b'}]);
    const beadGeo = new THREE.SphereGeometry(2.3, 16, 12), beadMat = new THREE.MeshStandardMaterial({color: METHYL, emissive: METHYL, emissiveIntensity: .6, roughness: .45});
    const methyls = [D0, D1, D2].map(d => { const m = new THREE.InstancedMesh(beadGeo, beadMat, sites.length); m.frustumCulled = false; root.add(m); return m; });
    const dummy = new THREE.Object3D(), c = V(), groove = V(), own = V();
    // Where a methyl sits: on the cytosine's base, out into the major groove (away from the two sugars).
    function methylAt(d, site, out) {
      const i = site.i, base = site.strand === 'a' ? d.world.aBase[i] : d.world.bBase[i], bb = site.strand === 'a' ? d.world.aBackbone[i] : d.world.bBackbone[i];
      c.addVectors(d.world.aBase[i], d.world.bBase[i]).multiplyScalar(.5);
      groove.addVectors(d.world.aBackbone[i], d.world.bBackbone[i]).multiplyScalar(.5).sub(c).normalize().negate();
      own.subVectors(bb, base).normalize();
      return out.copy(base).addScaledVector(groove, 3.1).addScaledVector(own, 1.2);
    }
    const drawMethyls = (d, inst, level) => {
      sites.forEach((s, k) => { methylAt(d, s, dummy.position); dummy.scale.setScalar(Math.max(1e-3, level(s))); dummy.updateMatrix(); inst.setMatrixAt(k, dummy.matrix); });
      inst.instanceMatrix.needsUpdate = true;
    };
    const tintCpG = (d, w) => d.tint(CPG_TINT, pairs.map((_, i) => (CPGS.includes(i) || CPGS.includes(i - 1)) ? w : 0));

    // A protein placed on a duplex by its crystal DNA: strand a's index k0 on our pair i0, same direction.
    function fitOn(d, structure, aName, bName, k0, i0) {
      const A = strand(structure, aName), B = strand(structure, bName), P = [], Q = [];
      A.partner.forEach((p, k) => {
        const i = i0 + (k - k0); if (!p || p[0] !== B.chain || i < 0 || i >= N) return;
        P.push(V(...A.backbone[k]), V(...B.backbone[p[1]])); Q.push(d.world.aBackbone[i].clone(), d.world.bBackbone[i].clone());
      });
      return fitRigid(P, Q);
    }
    const group = parts => { const g = new THREE.Group(); g.matrixAutoUpdate = false; parts.forEach(([st, n]) => g.add(makeMesh(st, n))); root.add(g); return g; };
    const dnmt1 = group([['dnmt1', 'DNMT1']]), dnmt3 = group([['dnmt3a', 'DNMT3A a'], ['dnmt3a', 'DNMT3A b'], ['dnmt3a', 'DNMT3L a'], ['dnmt3a', 'DNMT3L b']]);
    const tet = group([['tet2', 'TET2']]), creb = group([['creb', 'CREB']]), tbp = group([['tbp', 'TBP']]);
    const siteWorld = (d, i) => d.world.aBackbone[i].clone().add(d.world.bBackbone[i]).multiplyScalar(.5);
    // Placements on daughter 1 at the centre, after replication: DNMT1 at each CpG kept through replication (its
    // parental strand on our strand a), TET2 at each of the island's CpGs, DNMT3A–DNMT3L on the two gene-body
    // CpGs, CREB on its CRE; TBP on the bent TATA box.
    D1.pose(straight);
    const at1 = {dnmt1: KEPT.map(i => fitOn(D1, 'dnmt1', 'parental', 'target', 5, i)), tet: ISLAND_CPGS.map(i => fitOn(D1, 'tet2', 'target', 'other', 5, i))};
    const bound = {dnmt3: fitOn(D1, 'dnmt3a', 'top', 'bottom', 5, DE_NOVO[0]), creb: fitOn(D1, 'creb', 'top', 'bottom', 7, CRE)};
    // Each protein arrives and leaves along its own direction away from the DNA (from the axis at its site
    // towards its centre, square to the DNA), so it never passes through it.
    const away = (g, m, d, i) => {
      const c = V(); g.children.forEach(x => c.add(V(...x.userData.rec.center).applyMatrix4(m))); c.divideScalar(g.children.length);
      const out = c.sub(siteWorld(d, i)); out.x = 0; return out.normalize();
    };
    const dir = {dnmt1: KEPT.map((i, k) => away(dnmt1, at1.dnmt1[k], D1, i)), tet: ISLAND_CPGS.map((i, k) => away(tet, at1.tet[k], D1, i)),
      dnmt3: away(dnmt3, bound.dnmt3, D1, DE_NOVO[0] + 7), creb: away(creb, bound.creb, D1, CRE + 4)};
    D1.pose(bentFrames);
    bound.tbp = fitOn(D1, 'tbp', 'TATA strand', 'complementary strand', boxInStrand, TATA);
    dir.tbp = away(tbp, bound.tbp, D1, TATA + 4);
    // A protein away from its site: lifted clear of the DNA and drifting a little, as if diffusing.
    const shift = (v, k) => new THREE.Matrix4().makeTranslation(v.x * k, v.y * k, v.z * k);
    const hover = (m, v, lift, t, phase) => shift(v, lift + 6 * Math.sin(t * .8 + phase)).multiply(m);
    const landed = (m, v, lift, w) => shift(v, lift * (1 - w)).multiply(m);
    const blendPose = (a, b, w) => {
      const pa = V(), qa = new THREE.Quaternion(), pb = V(), qb = new THREE.Quaternion(), sc = V();
      a.decompose(pa, qa, sc); b.decompose(pb, qb, sc);
      return new THREE.Matrix4().compose(pa.lerp(pb, w), qa.slerp(qb, w), V(1, 1, 1));
    };
    // An enzyme working along the DNA: at each site in turn, then on to the next by a screw about the DNA's axis
    // (the x axis), the way the site itself turns and advances along the helix, taking the shorter way round
    // and a little raised; the fit's small residual is blended out on arrival. It never crosses the DNA.
    const hop = (poses, sites, dirs, t0, t) => {
      const x = Math.max(0, (t - t0) / PER), k = Math.min(poses.length - 1, Math.floor(x)), move = k < poses.length - 1 ? smooth((x - k - .45) / .55) : 0;
      if (!move) return {k, m: poses[k].clone(), dir: dirs[k]};
      const n = sites[k + 1] - sites[k], turn = Math.atan2(Math.sin(n * TWIST), Math.cos(n * TWIST));
      const screw = new THREE.Matrix4().makeTranslation(n * RISE * move, 0, 0).multiply(new THREE.Matrix4().makeRotationX(turn * move)).multiply(poses[k]);
      const v = dirs[k].clone().lerp(dirs[k + 1], move).normalize();
      return {k, m: shift(v, 8 * Math.sin(Math.PI * move)).multiply(blendPose(screw, poses[k + 1], smooth(move))), dir: v};
    };
    // When the enzyme acts at a site: a third of the way through its time there.
    const actsAt = (t0, list, i) => t0 + PER * (list.indexOf(i) + .35);

    const posed = {d1: '', d2: ''};
    D0.pose(straight);
    return {
      at, D0, D1, D2,  // for tests (?debug=1)
      info: {cpgs: CPGS, island: ISLAND, deNovo: DE_NOVO, body: BODY_METHYLATED},
      // Methyl groups drawn on duplex k (0 parent, 1 and 2 daughters): instances at more than half size.
      methylCount(k) { const m = new THREE.Matrix4(), s = V(), inst = methyls[k]; let n = 0; for (let i = 0; i < inst.count; i++) { inst.getMatrixAt(i, m); s.setFromMatrixScale(m); if (s.x > .5) n++; } return n; },
      update(t, {calm, pxPerA = 1}) {
        const tt = calm ? 0 : t;
        for (const d of [D0, D1, D2]) d.view(pxPerA);
        // Which DNA is on stage: the parent until it is copied; its daughters part; daughter 2 leaves, and
        // daughter 1 returns to the centre before its methylation is restored.
        const fork = ramp(t, T.copy + 1.4, T.copy + 5.2), parted = ramp(t, T.copy + 1, T.copy + 3), gone = ramp(t, T.copy + 5.6, T.copy + 7.6);
        const home = ramp(t, T.copy + 6, T.copy + 8), copying = t >= T.copy + 1;
        const dy1 = -48 * parted * (1 - home), dy2 = 48 * parted + 160 * gone;
        // Methylation of each site through the story (site.i is the cytosine's pair; its CpG starts there on
        // strand a, one pair before on strand b).
        const cpgOf = st => st.strand === 'a' ? st.i : st.i - 1;
        const removed = c => ISLAND_CPGS.includes(c) ? ramp(t, actsAt(HOP.tet, ISLAND_CPGS, c), actsAt(HOP.tet, ISLAND_CPGS, c) + .3) : 0;
        const deNovo = st => { const first = (st.i === DE_NOVO[0] && st.strand === 'a') || (st.i === DE_NOVO[1] + 1 && st.strand === 'b'); return ramp(t, T.denovo + (first ? 3.6 : 5), T.denovo + (first ? 4.4 : 5.8)); };
        const parental = st => { const c = cpgOf(st); return KEPT.includes(c) ? 1 - removed(c) : DE_NOVO.includes(c) ? deNovo(st) : 0; };
        // After replication a CpG's new strand waits for the maintenance methyltransferase to reach it.
        const restored = c => KEPT.includes(c) ? ramp(t, actsAt(HOP.dnmt1, KEPT, c), actsAt(HOP.dnmt1, KEPT, c) + .3) : 1;
        const made = st => st.i < fork * (N + 2) ? 1 : 0;
        const b = ramp(t, T.tet + 11.4, T.tet + 15.2);
        // The new strands are made as the fork passes, left to right. Each duplex is rebuilt only when it changes.
        const shown = copying ? Math.round(fork * (N + 2)) : N, k1 = `${dy1.toFixed(3)}|${b.toFixed(4)}|${shown}`, k2 = `${dy2.toFixed(3)}|${shown}`;
        if (k1 !== posed.d1) { posed.d1 = k1; D1.reveal(1, shown); D1.pose(b > 0 ? offset(bend(b, bendFrames), dy1) : offset(straight, dy1)); }
        if (k2 !== posed.d2) { posed.d2 = k2; D2.reveal(0, shown); D2.pose(offset(straight, dy2)); }
        drawMethyls(D0, methyls[0], parental);
        drawMethyls(D1, methyls[1], st => st.strand === 'a' ? parental(st) : DE_NOVO.includes(cpgOf(st)) ? parental(st) : parental(st) * restored(cpgOf(st)) * made(st));
        drawMethyls(D2, methyls[2], st => (1 - gone) * (st.strand === 'b' ? parental(st) : 0));
        D2.opacity(1 - gone);
        D0.group.visible = methyls[0].visible = !copying;
        D1.group.visible = methyls[1].visible = copying; D2.group.visible = methyls[2].visible = copying && gone < .99;
        tintCpG(D0, .75 * ramp(t, T.cpg, T.cpg + 1.5) * (1 - ramp(t, T.copy - 1, T.copy)));
        tintCpG(D1, .5 * ramp(t, T.active + .5, T.active + 2));
        // Enzymes: DNMT1 and TET2 work along the DNA site by site; DNMT3A–DNMT3L visits its two CpGs.
        const visit = (a, b1, c, d) => ramp(t, a, b1) * (1 - ramp(t, c, d));
        const m1 = visit(HOP.dnmt1 - .8, HOP.dnmt1, HOP.dnmt1 + PER * KEPT.length - .2, HOP.dnmt1 + PER * KEPT.length + 1);
        const h1 = hop(at1.dnmt1, KEPT, dir.dnmt1, HOP.dnmt1, t);
        fadeObject(dnmt1, m1); dnmt1.matrix.copy(landed(h1.m, h1.dir, 70, m1));
        const m3 = visit(T.denovo + 1, T.denovo + 3, T.denovo + 6.4, T.denovo + 8);
        fadeObject(dnmt3, m3); dnmt3.matrix.copy(landed(bound.dnmt3, dir.dnmt3, 80, m3));
        const mt = visit(HOP.tet - .8, HOP.tet, HOP.tet + PER * ISLAND_CPGS.length - .2, HOP.tet + PER * ISLAND_CPGS.length + 1);
        const ht = hop(at1.tet, ISLAND_CPGS, dir.tet, HOP.tet, t);
        fadeObject(tet, mt); tet.matrix.copy(landed(ht.m, ht.dir, 80, mt));
        // CREB and TBP wait above the silenced promoter, and bind once it has lost its methylation.
        const bindCreb = ramp(t, T.tet + 10.4, T.tet + 12), bindTbp = ramp(t, T.tet + 11.2, T.tet + 13.2);
        const crebOn = bindCreb > 0 && b > 0 ? fitOn(D1, 'creb', 'top', 'bottom', 7, CRE) : bound.creb;  // follows its DNA as TBP bends it
        creb.matrix.copy(bindCreb > 0 ? landed(crebOn, dir.creb, 58, bindCreb) : hover(bound.creb, dir.creb, 58, tt, 0));
        tbp.matrix.copy(bindTbp > 0 ? landed(bound.tbp, dir.tbp, 64, bindTbp) : hover(bound.tbp, dir.tbp, 64, tt, 1.7));
        // Out of sight while the DNA is copied and restored: they fade out before the copy and back in after.
        const waiting = 1 - ramp(t, T.copy + .2, T.copy + 1) + ramp(t, T.denovo - 1.3, T.denovo - .5);
        fadeObject(creb, waiting); fadeObject(tbp, waiting);
        // Views.
        const d = copying ? D1 : D0;
        const box = new THREE.Box3(); d.world.aBackbone.forEach(p => box.expandByPoint(p));
        at.whole = box.getCenter(V()).add(V(0, -12, 0)); at.wholeRadius = Math.max(200, box.getSize(V()).length() / 2 + 40);
        at.closeView = siteWorld(D0, CLOSE).lerp(siteWorld(D0, CLOSE + 1), .5);
        at.copyView = V(0, (dy1 + dy2) / 2 * (1 - gone) + dy1 * gone, 0); at.copyRadius = 240 - 40 * gone;
        at.denovoView = siteWorld(D1, (DE_NOVO[0] + DE_NOVO[1]) / 2 | 0).add(V(0, -18, 0));
        at.tetView = siteWorld(D1, 38).add(V(0, -24, 0));
        at.d = d; at.dy1 = dy1; at.dy2 = dy2; at.fork = fork; at.bend = b; at.dnmt1Site = KEPT[h1.k]; at.tetSite = ISLAND_CPGS[ht.k];
      },
      annotate(t, {label, tag, bracket}) {
        const d = at.d, bead = (dup, i, strandName) => { const p = V(); methylAt(dup, {i, strand: strandName}, p); return p; };
        const centreOf = g => { const box = new THREE.Box3().setFromObject(g); return box.getCenter(V()); };
        if (t < T.cpg) {
          if (t > 1.2) {
            label(centreOf(creb), 'Transcription factor', 'Present, but the promoter stays silent', {color: hex(COLOUR.CREB)});
            tag(bead(d, 48, 'a'), 'Methylated CpG sites', {color: hex(METHYL)});
            tag(centreOf(tbp), 'TBP', {color: hex(COLOUR.TBP)});
          }
        } else if (t < T.island) {
          if (t > T.cpg + 2.8) {
            label(bead(D0, CLOSE, 'a'), '5-methylcytosine', 'A methyl group on carbon 5 of cytosine', {color: hex(METHYL)});
            tag(siteWorld(D0, CLOSE).lerp(siteWorld(D0, CLOSE + 1), .5).add(V(0, 7, 0)), 'CpG · C then G', {color: hex(CPG_TINT)});
          }
        } else if (t < T.copy) {
          if (t > T.island + 2) {
            bracket(siteWorld(D0, ISLAND[0]).add(V(0, -16, 0)), siteWorld(D0, ISLAND[1]).add(V(0, -16, 0)), 'CpG island · methylated, silent');
            tag(siteWorld(D0, 96).add(V(0, 12, 0)), 'Gene body · scattered CpGs', {color: '#cfe3ea'});
            tag(siteWorld(D0, START).add(V(0, 14, 0)), 'Start point', {color: '#cfe3ea'});
          }
        } else if (t < T.denovo) {
          if (t > T.copy + 3 && t < T.copy + 5.6) {
            tag(D1.world.aBackbone[12].clone(), 'Parental strand', {color: '#e9e1cf'});
            tag(D2.world.aBackbone[30].clone(), 'New strand', {color: hex(NEW_STRAND)});
          }
          if (t > T.copy + 6 && t < HOP.dnmt1) tag(bead(D1, KEPT[0], 'a'), 'Methylated on one strand', {color: hex(METHYL)});
          if (t > HOP.dnmt1 && t < HOP.dnmt1 + PER * KEPT.length) label(centreOf(dnmt1), 'Maintenance methyltransferase', 'Methylates the new strand', {color: hex(COLOUR.DNMT1)});
          if (t > HOP.dnmt1 + PER * KEPT.length + .6) tag(bead(D1, 49, 'b'), 'Both strands methylated again', {color: hex(METHYL)});
        } else if (t < T.tet) {
          if (dnmt3.visible && t > T.denovo + 3 && t < T.denovo + 6.4) label(centreOf(dnmt3), 'De novo methyltransferase', 'Methylates unmethylated CG sites', {color: hex(COLOUR['DNMT3A a'])});
        } else if (t < T.active) {
          if (t > HOP.tet && t < HOP.tet + PER * ISLAND_CPGS.length) label(centreOf(tet), 'TET enzyme', 'Starts the removal of methyl groups', {color: hex(COLOUR.TET2)});
          if (t > T.tet + 12.4) { label(centreOf(creb), 'Transcription factor · binds', 'The promoter can be activated', {color: hex(COLOUR.CREB)}); tag(centreOf(tbp), 'TBP', {color: hex(COLOUR.TBP)}); }
        } else if (t > T.active + 1.5) {
          bracket(siteWorld(D1, 0).add(V(0, -18, 0)), siteWorld(D1, START).add(V(0, -18, 0)), 'Promoter · undermethylated');
          tag(bead(D1, 104, 'a'), 'Gene body · methylated', {color: hex(METHYL)});
        }
      },
    };
  },
});
