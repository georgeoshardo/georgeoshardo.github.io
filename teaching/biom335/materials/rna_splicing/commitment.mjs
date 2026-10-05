// Scene: committing pre-mRNA to the splicing pathway. One pre-mRNA drawn at true scale (exon, a short intron, exon)
// with rna.mjs, smooth and evenly spaced throughout, the 5′ splice site paired with U1 snRNA as on the U1 page (the
// human U1 snRNP, 3CW1, with 4PJO's U1-C and Sm ring). The other factors sit on it, each protein's own RNA fitted onto
// the stretch it binds: U2AF65's two RRMs (2G4B) on the polypyrimidine tract, U2AF35 at the AG of the 3′ splice site
// (fission yeast's U2AF23, with U2AF59's ULM peptide and a 3′ splice-site RNA, 7C06, stands in for it), BBP/SF1 (1K1G)
// on the branch site, and SR proteins (SRSF1's RRM2 with an exonic GGA sequence, 2M8D) on the exons, their disordered
// RS domains drawn as flexible tails. Then the 3′ part comes round, the intron looping, and the SR proteins' RS domains
// reach U1 at the 5′ site and U2AF at the 3′ site. Intron definition: the yeast E complex (6N7R), its U1 snRNP on the
// 5′ splice site of a single, short intron (the rest of the intron drawn). Exon definition: a 120-nucleotide exon
// between long introns that run off into the dark, U2AF at its 3′ splice site, U1 at its 5′ splice site, SR proteins on
// it. The camera visits three places (the commitment complex, the yeast E complex, exon definition): each fades fully
// out as the camera leaves it and in once it has arrived, so nothing passes behind the page's text.
import * as THREE from 'three';
import {runScene} from '../shared/scene_player.mjs';
import {loadSurfaceSet, surfaceGeometry, proteinMaterial, fade, NIGHT} from '../shared/molecules.mjs';
import {SPLICING, SPACING, COMPLEMENT, createStrand, pairing, antiparallel, aFormPoint, line, onwards} from '../shared/rna.mjs';
import {createTube, minRadius, outlineWidth} from '../shared/strands.mjs';
import {boxAround} from '../shared/camera.mjs';
import {fitRigid} from '../shared/fit.mjs';
import {ramp, smooth, clamp, mix} from '../shared/ease.mjs';

const V = (...a) => new THREE.Vector3(...a);
const hex = c => '#' + new THREE.Color(c).getHexString();
const lighter = (c, k) => new THREE.Color(c).lerp(new THREE.Color(0xffffff), k).getHex();
const deeper = (c, k) => new THREE.Color(c).multiplyScalar(k).getHex();
// Colours: U1 pink (U1-C paler, the Sm ring sand; yeast's U1 proteins a deeper pink), U2AF deep blue (U2AF35 paler),
// SF1 terracotta, SR proteins olive-gold with their RS tails paler; exons orange, introns grey-violet.
const C = {U1: SPLICING.U1, U1C: lighter(SPLICING.U1, .38), Sm: SPLICING.Sm, U2AF65: SPLICING.U2AF, U2AF35: lighter(SPLICING.U2AF, .4),
  SF1: SPLICING.SF1, SR: SPLICING.SR, RS: lighter(SPLICING.SR, .12), exon: SPLICING.exon, intron: SPLICING.intron, yeast: deeper(SPLICING.U1, .78)};

// Times (s): each step starts at its t.
const T = {signals: 0, u1: 12, three: 25, sr: 41, glue: 55, intron: 72, exon: 88, end: 106};
const NOTES = {commit: 'committing-pre-mrna-to-the-splicing-pathway', e: 'initial-splice-site-recognition-and-the-e-complex',
  sr: 'the-role-of-sr-proteins', def: 'intron-vs.-exon-definition'};
const steps = [
  {t: T.signals, nav: 'Committing to splicing', title: 'Committing pre-mRNA<br>to splicing.', notes: NOTES.commit, hold: 1.1,
    text: 'For splicing to begin, the machinery must first recognize and commit to the correct splice sites on the pre-mRNA. This initial stage involves a series of binding events that form a stable foundation for the rest of the spliceosome to assemble.'},
  {t: T.u1, nav: 'U1 at the 5′ splice site', title: 'U1 binds the<br>5′ splice site.', notes: NOTES.e,
    text: 'The initial binding of U1 is part of a larger assembly, the commitment complex. It forms when, first, the U1 snRNP binds to the 5′ splice site, its snRNA base pairing with the splice site.'},
  {t: T.three, nav: 'U2AF and BBP/SF1', title: 'U2AF and BBP/SF1<br>at the 3′ end.', notes: NOTES.e, hold: 1.1,
    text: 'The protein U2AF binds to the polypyrimidine tract, located between the branch site and the 3′ splice site, and the branch point binding protein (BBP/SF1) interacts with the branch site. These interactions are cooperative and lock the pre-mRNA into the splicing pathway: the commitment complex, or E complex in mammals.'},
  {t: T.sr, nav: 'SR proteins', title: 'SR proteins: an RRM<br>and an RS domain.', notes: NOTES.sr, hold: 1.1,
    text: 'In multicellular eukaryotes, where splice-site consensus sequences can be weak or divergent, SR proteins are essential for forming the commitment complex. Each has an N-terminal RNA-recognition motif that binds specific RNA sequences, and a C-terminal RS domain, rich in arginine/serine dipeptides, that mediates protein–protein interactions.'},
  {t: T.glue, nav: 'A molecular glue', title: 'A molecular “glue”<br>across the intron.', notes: NOTES.sr, hold: 1.1,
    text: 'SR proteins act as a molecular “glue”, stabilizing the E complex through a network of interactions. They can bind to the U1 snRNP at the 5′ site and to U2AF at the 3′ site, bridging the two ends of the intron and ensuring the splice sites are properly recognised.'},
  {t: T.intron, nav: 'Intron definition', title: 'Intron definition:<br>a single, short intron.', notes: NOTES.def, hold: 1.1,
    text: 'In intron definition, the machinery recognizes the 5′ and 3′ splice sites across the intron. This works well for organisms like yeast, where genes typically contain a single, short intron. Yeast splice sites are highly conserved, and SR proteins are not found there. Here, a yeast E complex: its U1 snRNP on the 5′ splice site.'},
  {t: T.exon, nav: 'Exon definition', title: 'Exon definition:<br>a short exon.', notes: NOTES.def, hold: 1.1,
    text: 'In multicellular eukaryotes, introns are often extremely long and exons relatively short (100–300 nucleotides), and the exon is identified first: U2AF binds the 3′ splice site at its beginning, U1 snRNP the 5′ splice site at its end, and SR proteins bind sequences within it. These interactions are then rearranged to pair the 3′ splice site with the upstream 5′ splice site.'},
];

// The pre-mRNA of the commitment complex, 5′ → 3′, in stretches (nucleotides): drawn ones (a1, a2, b …) and those
// given by a structure, its RNA where its protein binds:
//   exon 1: 5 drawn, an SR protein's site (2M8D's UGAAGGAC), 2 drawn;
//   intron: +1 … +7 paired with U1 snRNA (GUAAGUA), 30 drawn, the branch site (1K1G's UAUACUAACAA, its branch A the
//   eighth), 3 drawn, the polypyrimidine tract (2G4B's seven Us) and 6 more, then 7C06's UAG, the intron's last three;
//   exon 2: 7C06's GU, 4 drawn, an SR protein's site, 6 drawn.
// The branch A lies 22 nucleotides before the intron's last (18–40 in the notes).
const L = {a1: 5, sr1: 8, a2: 2, site: 7, b: 30, sf1: 11, c: 3, py: 7, d: 6, ag: 5, e: 4, sr2: 8, f: 6};
const IX = {}; { let k = 0; for (const [key, n] of Object.entries(L)) { IX[key] = [k, k + n]; k += n; } IX.N = k; }
const EXON1 = [0, IX.site[0]], INTRON = [IX.site[0], IX.ag[0] + 3], EXON2 = [IX.ag[0] + 3, IX.N];
const BRANCH_A = IX.sf1[0] + 7;
// The exon-definition pre-mRNA: a long upstream intron (its last 320 nucleotides), the polypyrimidine tract and
// 3′ splice site with U2AF, an exon of 120 nucleotides with two SR proteins on it, the 5′ splice site with U1, and the
// first 320 nucleotides of the downstream intron.
const L3 = {up: 320, py: 7, d: 6, ag: 5, g1: 26, sr3: 8, g2: 36, sr4: 8, g3: 40, site: 7, down: 320};
const IX3 = {}; { let k = 0; for (const [key, n] of Object.entries(L3)) { IX3[key] = [k, k + n]; k += n; } IX3.N = k; }
const EXON3 = [IX3.ag[0] + 3, IX3.site[0]];
// The yeast pre-mRNA: 10 drawn exon nucleotides, 6N7R's own −2 … +8 (UG|GUAUGUUC), 56 more intron nucleotides drawn
// (its branch site and 3′ splice site named), and 10 of exon 2.
const LY = {ex1: 10, own: 10, intr: 56, ex2: 10};
const IXY = {}; { let k = 0; for (const [key, n] of Object.entries(LY)) { IXY[key] = [k, k + n]; k += n; } IXY.N = k; }

// The three places: the commitment complex at the origin, the yeast E complex below it, exon definition further down.
const S2 = V(0, 1000, 0), S3 = V(0, 2100, 0);
const DIR = [.05, -.2, -1], DIR_Y = [.05, -.5, -1];
const at = {};
// The camera: the whole pre-mRNA; closer once the intron has looped round; the yeast E complex; exon definition.
const BRIDGED = T.glue + 7.6;
const SHOTS = [
  {t: T.signals, frame: () => at.views.whole},
  {t: BRIDGED, blend: 2.6, frame: () => at.views.bridged},
  {t: T.intron, blend: 3, frame: () => at.views.yeast},
  {t: T.exon, blend: 3, frame: () => at.views.exon},
];

runScene({
  pageTitle: 'The commitment complex · RNA splicing and processing', eyebrow: 'The commitment complex',
  links: [{href: 'index.html', text: 'All scenes'}],
  steps, duration: T.end, notesPage: 'notes.html', fov: 26, loop: false, far: 30000,
  shots: SHOTS,
  async build({world, scene, camera, progress}) {
    const got = [0, 0], tell = k => p => { got[k] = p; progress((got[0] + 3 * got[1]) / 4); };
    const [u1Set, set] = await Promise.all([loadSurfaceSet('assets/u1.json', 'assets/u1.bin', tell(0)), loadSurfaceSet('assets/commitment.json', 'assets/commitment.bin', tell(1))]);
    // The long introns of exon definition fade into the dark with distance: a linear fog, set far off except there.
    scene.fog = new THREE.Fog(NIGHT, 1e6, 2e6);
    const strandOf = (s, name, structure) => s.meta.strands.find(x => x.name === name && x.structure === structure);
    const pts = s => s.backbone.map(p => V(...p));
    const mean = ps => ps.reduce((a, p) => a.add(p), V()).divideScalar(ps.length);
    const meshPoints = (rec, s, every = 9) => { const p = surfaceGeometry(rec, s.buffer).attributes.position, out = []; for (let k = 0; k < p.count; k += every) out.push(V().fromBufferAttribute(p, k)); return out; };
    const X = V(1, 0, 0);
    const frameFrom = (u, v, dir, up) => {  // a rotation taking u → dir and v (made square to u) → up (made square to dir)
      const a = u.clone().normalize(), b = v.clone().addScaledVector(a, -v.dot(a)).normalize(), d = dir.clone().normalize(), w = up.clone().addScaledVector(d, -up.dot(d)).normalize();
      return new THREE.Matrix4().makeBasis(d, w, d.clone().cross(w)).multiply(new THREE.Matrix4().makeBasis(a, b, a.clone().cross(b)).transpose());
    };

    // ---------- The human U1 snRNP and its duplex with the 5′ splice site (as on the U1 page) ----------
    const s3 = strandOf(u1Set, 'U1 snRNA', 'u1'), s4 = strandOf(u1Set, 'U1 5′ end', 'min'), sx = strandOf(u1Set, '5′ splice site', 'min');
    const nt = (s, n) => V(...s.backbone[s.numbers.indexOf(n)]);
    const fitted = pairing(antiparallel(0, 6, 7)).fit([2, 3, 4, 5, 6, 7, 8].map(n => nt(s4, n)), [3, 4, 5, 6, 7, 8, 9].map(n => nt(sx, n)));
    const A = k => aFormPoint(k, 'a', 'backbone', fitted.matrix), B = k => aFormPoint(k, 'b', 'backbone', fitted.matrix);
    const u1Local = s3.numbers.map((n, i) => n <= 11 ? A(n - 2) : n === 12 ? A(10).lerp(nt(s3, 12), .5) : V(...s3.backbone[i]));
    const STEMS = [[12, 15, 122], [17, 21, 47], [23, 27, 42], [48, 54, 91], [92, 94, 117], [95, 100, 113], [137, 143, 164], [146, 148, 155]];
    const u1Recs = u1Set.meta.meshes, u1Body = mean(u1Recs.flatMap(r => meshPoints(r, u1Set, 13)));
    // The pre-mRNA runs 5′ → 3′ along +x through the duplex, the snRNP behind it and above; the duplex's middle at
    // the origin.
    const U1_FRAME = (() => {
      const R = frameFrom(fitted.axis().negate(), u1Body.clone().sub(fitted.centre()), X, V(0, -.42, .91));
      return R.setPosition(fitted.centre().applyMatrix4(R).negate());
    })();
    const siteLocal = [1, 2, 3, 4, 5, 6, 7].map(j => B(7 - j));   // +j on strand b at pair 7 − j
    const u1Pair = [1, 2, 3, 4, 5, 6, 7].map(j => s3.numbers.indexOf(9 - j));  // U1 nucleotide 9 − j pairs with +j
    // A U1 snRNP (proteins and snRNA, its stems paired), placed by a matrix that can move.
    const makeU1 = parent => {
      const group = new THREE.Group(); group.matrixAutoUpdate = false; parent.add(group);
      const meshes = u1Recs.map(r => { const m = new THREE.Mesh(surfaceGeometry(r, u1Set.buffer), proteinMaterial({'U1-70K': C.U1, 'U1-C': C.U1C, 'Sm ring': C.Sm}[r.name])); m.userData.name = r.name; group.add(m); return m; });
      const strand = createStrand(parent, u1Local.length, {colour: C.U1}), idx = n => s3.numbers.indexOf(n);
      for (const [a, b, c] of STEMS) for (let n = a; n <= b; n++) { const i = idx(n), j = idx(c - (n - a)); strand.pair(i, strand.points[j], 1); strand.pair(j, strand.points[i], 1); }
      const samples = Object.fromEntries(u1Recs.map(r => [r.name, meshPoints(r, u1Set, 7)]));
      return {group, meshes, strand, samples, matrix: new THREE.Matrix4(),
        place(m) { this.matrix.copy(m); group.matrix.copy(m); group.matrixWorldNeedsUpdate = true; u1Local.forEach((p, i) => strand.points[i].copy(p).applyMatrix4(m)); return this; },
        world(name, out = V()) { return out.copy(mean(samples[name])).applyMatrix4(this.matrix); },
        // The nearest point of a protein's surface to p.
        nearestAny(p) { return Object.keys(samples).map(k => this.nearest(k, p)).reduce((a, b) => a.distanceToSquared(p) < b.distanceToSquared(p) ? a : b); },
        nearest(name, p) { let best = null, d0 = Infinity; for (const q of samples[name]) { const w = q.clone().applyMatrix4(this.matrix), d = w.distanceToSquared(p); if (d < d0) { d0 = d; best = w; } } return best; },
        points() { return [...Object.values(samples).flat().filter((p, k) => k % 3 === 0).map(p => p.clone().applyMatrix4(this.matrix)), ...strand.points.filter((p, k) => k % 2 === 0)]; },
        opacity(v) { for (const m of meshes) { fade(m.material, v); m.visible = v > 0; } strand.opacity(v); },
        view(px) { strand.pose().view(px); },
      };
    };

    // ---------- Bound stretches of RNA from the other structures ----------
    const SEG = {
      sr: {strand: strandOf(set, 'exon sequence', 'sr'), parts: {'SR protein RRM': C.SR}},
      sf1: {strand: strandOf(set, 'branch site', 'sf1'), parts: {SF1: C.SF1}},
      u2af65: {strand: strandOf(set, 'polypyrimidine tract', 'u2af65'), parts: {U2AF65: C.U2AF65}},
      u2af35: {strand: strandOf(set, '3′ splice site', 'u2af35'), parts: {U2AF35: C.U2AF35, 'U2AF65 ULM': C.U2AF65}},
    };
    for (const [key, sg] of Object.entries(SEG)) {
      sg.rna = pts(sg.strand); sg.recs = set.meta.meshes.filter(r => r.structure === key);
      sg.body = mean(sg.recs.flatMap(r => meshPoints(r, set, 11)));
      sg.samples = Object.fromEntries(sg.recs.map(r => [r.name, meshPoints(r, set, 9)]));
    }
    const SR_C = V(...set.meta.points.find(p => p.name === 'RRM C-terminus').position);  // where the RS domain begins
    // A copy of a stretch's proteins, placed by a matrix (its RNA is part of the drawn pre-mRNA).
    const makeSeg = (parent, sg) => {
      const group = new THREE.Group(); group.matrixAutoUpdate = false; parent.add(group);
      const meshes = sg.recs.map(r => { const m = new THREE.Mesh(surfaceGeometry(r, set.buffer), proteinMaterial(sg.parts[r.name])); m.userData.name = r.name; group.add(m); return m; });
      return {sg, group, meshes, matrix: new THREE.Matrix4(), shown: new THREE.Matrix4(),
        place(m) { this.matrix.copy(m); return this.show(m); },
        show(m) { this.shown.copy(m); group.matrix.copy(m); group.matrixWorldNeedsUpdate = true; return this; },  // where the protein is drawn
        rna() { return sg.rna.map(p => p.clone().applyMatrix4(this.matrix)); },
        world(name, out = V()) { return out.copy(mean(sg.samples[name ?? sg.recs[0].name])).applyMatrix4(this.shown); },
        nearest(p) { let best = null, d0 = Infinity; for (const q of Object.values(sg.samples).flat()) { const w = q.clone().applyMatrix4(this.shown), d = w.distanceToSquared(p); if (d < d0) { d0 = d; best = w; } } return best; },
        points() { return Object.values(sg.samples).flat().filter((p, k) => k % 2 === 0).map(p => p.clone().applyMatrix4(this.shown)); },
        opacity(v) { for (const m of meshes) { fade(m.material, v); m.visible = v > 0; } },
      };
    };
    // An SR protein's RS domain: a flexible tail from the RRM's C-terminus, a curl near the protein, or reaching out
    // to a partner (by w). Drawn as a smooth tube, no longer than an extended RS domain.
    const makeTail = (parent) => {
      const tube = createTube(parent, {color: C.RS, radius: 1.1, max: 48, glow: .02, outline: true}); tube.taper = 4;
      return {tube, reach: 0,
        pose(seg, target, w, px, lift = V(0, -1, 0)) {
          const M = seg.shown, c = SR_C.clone().applyMatrix4(M), out = c.clone().sub(seg.world()).normalize();
          // The curl: out from the protein, round, and back a little; reaching: an arc (bowed towards `lift`, with a
          // gentle wave, as a disordered chain lies) out to the target.
          const side = out.clone().cross(V(0, 0, 1)).normalize();
          const curl = [c, c.clone().addScaledVector(out, 9), c.clone().addScaledVector(out, 15).addScaledVector(side, 8), c.clone().addScaledVector(out, 11).addScaledVector(side, 15), c.clone().addScaledVector(out, 4).addScaledVector(side, 14)];
          const reach = target ? (() => {
            const d = target.clone().sub(c), across = d.clone().cross(lift).normalize(), bow = lift.clone().normalize().multiplyScalar(Math.min(22, d.length() * .28));
            return [0, .25, .5, .75, 1].map((s, k) => c.clone().addScaledVector(d, s).addScaledVector(bow, Math.sin(Math.PI * s)).addScaledVector(across, [0, 4, -3, 3, 0][k]));
          })() : curl;
          // Reaching, the tail grows out along its route (the first w of it), so it never cuts across what lies between.
          const route = target && new THREE.CatmullRomCurve3(reach, false, 'centripetal');
          const ctrl = curl.map((p, k) => p.clone().lerp(route ? route.getPoint(w * k / 4) : reach[k], w)), curve = new THREE.CatmullRomCurve3(ctrl, false, 'centripetal');
          curve.getSpacedPoints(47).forEach((p, k) => tube.points[k].copy(p));
          this.length = curve.getLength();
          tube.radius = minRadius(1.1, px, .8); if (tube.outline) tube.outline.width = outlineWidth(px, .3); tube.update(48);
        },
        opacity(v) { fade(tube.material, v); fade(tube.outline.material, v); tube.mesh.visible = tube.outline.mesh.visible = v > 0; tube.update(v > 0 ? 48 : 0); },
        points() { return tube.points.filter((p, k) => k % 4 === 0); },
      };
    };

    // ---------- Drawn RNA ----------
    // m nucleotides from p (leaving along tp) to q (arriving along tq): a Hermite curve between them (so it meets
    // both ends in place and direction), bowed towards `bulge` by k·sin(πs)·sin(lobes·πs), which leaves the ends'
    // directions alone (one lobe a rounded U, more a meander). The nucleotides are stepped along it one spacing (a
    // chord) at a time, and k chosen so that the (m + 1)th step lands on q; any remainder (a step at a fold can jump)
    // is shared out by relaxing the steps to the spacing, p and q held.
    const SAMPLES = 220, poly = Array.from({length: SAMPLES}, () => V());
    const stepAlong = (m, out) => {  // m + 1 chord steps along poly from its start; how far along the last one reaches
      let i = 0, f = 0; const cur = poly[0].clone(), tmp = V();
      for (let s = 0; s <= m; s++) {
        let j = Math.floor(i + f) + 1;
        while (j < SAMPLES && poly[j].distanceTo(cur) < SPACING) j++;
        if (j >= SAMPLES) return SAMPLES - 1 + (SPACING - cur.distanceTo(poly[SAMPLES - 1])) / 4;  // ran off the end
        let lo = 0, hi = 1; for (let it = 0; it < 18; it++) { const x = (lo + hi) / 2; if (tmp.lerpVectors(poly[j - 1], poly[j], x).distanceTo(cur) < SPACING) lo = x; else hi = x; }
        cur.lerpVectors(poly[j - 1], poly[j], lo); i = j - 1; f = lo;
        if (s < m && out) (out[s] ||= V()).copy(cur);
      }
      return i + f;
    };
    const bridge = (p, tp, q, tq, m, {bulge = V(0, 1, 0), lobes = 1} = {}, out = []) => {
      const need = (m + 1) * SPACING, chord = p.distanceTo(q), c = q.clone().sub(p).normalize();
      // Bowed square to the chord (a bow along it would fold the strand back on itself at an end).
      const b = bulge.clone().addScaledVector(c, -bulge.dot(c)); if (b.lengthSq() < 1e-6) b.set(-c.y, c.x, 0); b.normalize();
      const u = tp.clone().normalize(), v = tq.clone().normalize();
      const make = (k, h) => {
        for (let i = 0; i < SAMPLES; i++) {
          const s = i / (SAMPLES - 1), s2 = s * s, s3 = s2 * s, bow = k * Math.sin(Math.PI * s) * Math.sin(lobes * Math.PI * s);
          poly[i].copy(p).multiplyScalar(2 * s3 - 3 * s2 + 1).addScaledVector(u, h * (s3 - 2 * s2 + s)).addScaledVector(q, -2 * s3 + 3 * s2).addScaledVector(v, h * (s3 - s2)).addScaledVector(b, bow);
        }
        return stepAlong(m) - (SAMPLES - 1);  // > 0: the steps overshoot q (the curve is too short)
      };
      let h = Math.min(chord, need * .5);
      while (make(0, h) < 0 && h > .5) h *= .6;  // a taut stretch: gentler tangents
      let lo = 0, hi = need;
      if (make(0, h) > 0) for (let it = 0; it < 24; it++) { const k = (lo + hi) / 2; if (make(k, h) > 0) lo = k; else hi = k; }
      make(hi, h); at.stretch = Math.max(at.stretch || 0, chord / need);
      stepAlong(m, out); out.length = m;
      const P = [p, ...out, q];
      for (let it = 0; it < 60; it++) for (const dir of [1, -1]) for (let s = dir > 0 ? 0 : P.length - 2; s >= 0 && s < P.length - 1; s += dir) {
        const A = P[s], B = P[s + 1], d = B.clone().sub(A), l = d.length(), e = (l - SPACING) / l;
        if (s === 0) B.addScaledVector(d, -e); else if (s + 1 === P.length - 1) A.addScaledVector(d, e); else { A.addScaledVector(d, e / 2); B.addScaledVector(d, -e / 2); }
      }
      return out;
    };
    // A protein placed on drawn RNA: its own RNA fitted to the drawn stretch (least squares), then turned about the
    // stretch's axis so that its body lies towards `up`.
    const placeOn = (sg, ps, up) => {
      const M = fitRigid(sg.rna, ps), c = mean(ps), ax = ps[ps.length - 1].clone().sub(ps[0]).normalize();
      const body = sg.body.clone().applyMatrix4(M).sub(c), u = up.clone();
      body.addScaledVector(ax, -body.dot(ax)); u.addScaledVector(ax, -u.dot(ax));
      const angle = Math.atan2(body.clone().cross(u).dot(ax), body.dot(u));
      const turn = new THREE.Matrix4().makeTranslation(c).multiply(new THREE.Matrix4().makeRotationAxis(ax, angle)).multiply(new THREE.Matrix4().makeTranslation(c.clone().negate()));
      return turn.multiply(M);
    };

    const tOut = ps => ps[ps.length - 1].clone().sub(ps[ps.length - 2]), tIn = ps => ps[1].clone().sub(ps[0]);
    const put = (out, ix, key, ps) => ps.forEach((p, i) => out[ix[key][0] + i].copy(p));

    // ---------- Place 1: the commitment complex ----------
    const place1 = new THREE.Group(); world.add(place1);
    const u1 = makeU1(place1).place(U1_FRAME);
    const site = siteLocal.map(p => p.clone().applyMatrix4(U1_FRAME));
    const segs = {sr1: makeSeg(place1, SEG.sr), sf1: makeSeg(place1, SEG.sf1), u2af65: makeSeg(place1, SEG.u2af65), u2af35: makeSeg(place1, SEG.u2af35), sr2: makeSeg(place1, SEG.sr)};
    const tails = {sr1: makeTail(place1), sr2: makeTail(place1)};
    // Exon 1 runs back from the 5′ splice site: its last nucleotide (−1) where 4PJO's splice-site RNA has it, beside
    // U1-C, then to the left and towards the camera, clear of the snRNP (as U1 arrives too), an SR protein's RRM on it
    // just before the site, towards the camera.
    const minus1 = nt(sx, 2).applyMatrix4(U1_FRAME);
    const exon1 = [...onwards(minus1, minus1.clone().sub(site[0]), V(-1, 0, -.5), IX.site[0] - 1, {turn: .2}).reverse(), minus1];
    const SR1 = placeOn(SEG.sr, exon1.slice(...IX.sr1), V(0, 0, -1));
    // The 3′ part (branch site to the end of exon 2, 50 nucleotides), gently curved: open (0), well to the right of U1
    // along the RNA; bridged (1), turned to rise towards the 5′ splice site, U2AF35 beside the duplex and SF1 below, the
    // intron looping down between.
    const B0 = IX.sf1[0], blockPts = line(IX.N - B0, {direction: X, toward: V(0, -1, 0), bend: .15});
    // It travels down and round (DIP), keeping the intron between open as it loops.
    const BLOCK = [{p: V(132, 22, -6), a: 0}, {p: V(-46, 92, -4), a: -.45}], DIP = 40;
    const blockAt = w => new THREE.Matrix4().makeTranslation(BLOCK[0].p.clone().lerp(BLOCK[1].p, w).add(V(0, DIP * Math.sin(Math.PI * w), 0))).multiply(new THREE.Matrix4().makeRotationZ(mix(BLOCK[0].a, BLOCK[1].a, w)));
    // The pre-mRNA for w: the 3′ part moved as one (blockAt), the intron between the 5′ splice site and the branch site
    // laid again to meet it, each protein fitted onto its stretch.
    const UPS = {sf1: V(0, .3, -1), u2af65: V(0, -.55, .85), u2af35: V(0, -1, -.25), sr2: V(0, -.6, -.8)}, RANGE = {sf1: 'sf1', u2af65: 'py', u2af35: 'ag', sr2: 'sr2'};
    const layout = (w, out = Array.from({length: IX.N}, () => V())) => {
      const G = blockAt(w);
      exon1.forEach((p, i) => out[i].copy(p)); put(out, IX, 'site', site);
      blockPts.forEach((p, i) => out[B0 + i].copy(p).applyMatrix4(G));
      const start = out.slice(B0, B0 + 2);
      put(out, IX, 'b', bridge(site[6], site[6].clone().sub(site[5]), start[0], start[1].clone().sub(start[0]), L.b, {bulge: BULGE(w)}));
      return out;
    };
    // The intron loops down to the left of the 3′ part as it comes round, in front of the U1 snRNP and exon 1's SR protein.
    const BULGE = () => V(-.4, .3, -1);
    let laidW = null;
    const layPre = (w, out) => {
      if (!(laidW === w && out === work)) layout(w, out);
      if (out === work) laidW = w;
      const turn = new THREE.Matrix4().makeRotationZ(mix(BLOCK[0].a, BLOCK[1].a, w));
      for (const k of ['sf1', 'u2af65', 'u2af35', 'sr2']) segs[k].place(placeOn(segs[k].sg, out.slice(...IX[RANGE[k]]), UPS[k].clone().applyMatrix4(turn)));
      segs.sr1.place(SR1);
      return out;
    };
    const pre = createStrand(place1, IX.N).stretches([[...EXON1, C.exon], [...EXON2, C.exon]], C.intron);

    // ---------- Place 2: the yeast E complex (6N7R) ----------
    const place2 = new THREE.Group(); place2.position.copy(S2); world.add(place2);
    const yU1 = strandOf(set, 'U1 snRNA', 'e'), yPre = strandOf(set, 'pre-mRNA', 'e');
    const yRecs = set.meta.meshes.filter(r => r.structure === 'e');
    const yOwn = yPre.numbers.map((n, i) => n <= 8 ? i : -1).filter(i => i >= 0);  // −2 … +8
    const yOwnPts = yOwn.map(i => V(...yPre.backbone[i]));
    const yBody = mean(yRecs.flatMap(r => meshPoints(r, set, 13)));
    const Y_FRAME = (() => { const R = frameFrom(yOwnPts[yOwnPts.length - 1].clone().sub(yOwnPts[0]), yBody.clone().sub(mean(yOwnPts)), X, V(0, -.42, .91)); return R.setPosition(mean(yOwnPts).applyMatrix4(R).negate()); })();
    const yGroup = new THREE.Group(); yGroup.matrixAutoUpdate = false; yGroup.matrix.copy(Y_FRAME); place2.add(yGroup);
    const yMeshes = yRecs.map(r => { const m = new THREE.Mesh(surfaceGeometry(r, set.buffer), proteinMaterial(r.name === 'Sm ring' ? C.Sm : C.yeast)); yGroup.add(m); return m; });
    const ySamples = yRecs.flatMap(r => meshPoints(r, set, 9)).map(p => p.applyMatrix4(Y_FRAME));
    // Its U1 snRNA (568 nucleotides; 26–32 unmodelled) and its pairs, as in the structure.
    const yU1Strand = createStrand(place2, yU1.backbone.length, {colour: C.U1});
    yU1.backbone.forEach((p, i) => yU1Strand.points[i].set(...p).applyMatrix4(Y_FRAME));
    const gap = yU1.numbers.findIndex((n, i) => i > 0 && n !== yU1.numbers[i - 1] + 1);
    yU1Strand.pieces([[0, gap], [gap, yU1.backbone.length]]);
    const pairedRight = (s, i, other) => { const q = s.partner[i]; return q && q[0] === other.chain && COMPLEMENT[s.sequence[i]]?.includes(other.sequence[q[1]]) ? q[1] : -1; };
    yU1.partner.forEach((q, i) => { const j = pairedRight(yU1, i, yU1); if (j >= 0) yU1Strand.pair(i, yU1Strand.points[j], 1); });
    const yPreStrand = createStrand(place2, IXY.N).stretches([[...IXY.ex1, C.exon], [IXY.own[0], IXY.own[0] + 2, C.exon], [...IXY.ex2, C.exon]], C.intron);
    {
      const own = yOwnPts.map(p => p.clone().applyMatrix4(Y_FRAME)), out = yPreStrand.points;
      put(out, IXY, 'own', own);
      put(out, IXY, 'ex1', onwards(own[0], tIn(own).negate(), V(-1, .3, -.2), LY.ex1, {turn: .3}).reverse());
      // A short intron looping down and back, ending beside the snRNP; exon 2 runs on to the right.
      const q = own[own.length - 1].clone().add(V(118, 30, -18)), tq = V(1, -.3, 0);
      const intr = bridge(own[own.length - 1], tOut(own), q, tq, LY.intr - 1, {bulge: V(0, 1, -.4)});
      put(out, IXY, 'intr', [...intr, q]);
      put(out, IXY, 'ex2', onwards(q, tq, V(1, .1, 0), LY.ex2, {turn: .3}));
      yOwn.forEach((i, k) => { const j = pairedRight(yPre, i, yU1); if (j >= 0) { yPreStrand.pair(IXY.own[0] + k, yU1Strand.points[j], 1); yU1Strand.pair(j, yPreStrand.points[IXY.own[0] + k], 1); } });
    }
    const yBranch = IXY.intr[1] - 23, yAG = IXY.intr[1] - 1;

    // ---------- Place 3: exon definition ----------
    const place3 = new THREE.Group(); place3.position.copy(S3); world.add(place3);
    const U1_FRAME3 = new THREE.Matrix4().makeTranslation(210, 0, 0).multiply(U1_FRAME);
    const u1b = makeU1(place3).place(U1_FRAME3);
    const site3 = siteLocal.map(p => p.clone().applyMatrix4(U1_FRAME3));
    const segs3 = {u2af65: makeSeg(place3, SEG.u2af65), u2af35: makeSeg(place3, SEG.u2af35), sr3: makeSeg(place3, SEG.sr), sr4: makeSeg(place3, SEG.sr)};
    const tails3 = {sr3: makeTail(place3), sr4: makeTail(place3)};
    const pre3 = createStrand(place3, IX3.N).stretches([[...EXON3, C.exon]], C.intron);
    {
      // The 3′ end of the upstream intron (polypyrimidine tract and AG, with U2AF) on a line, its long rest running
      // back into the dark; the exon meanders from it to the 5′ splice site, two SR proteins on it; the downstream
      // intron runs off into the dark too.
      const out = pre3.points, blk = line(IX3.g1[0] - IX3.py[0], {origin: V(-250, 12, 0), direction: X});
      blk.forEach((p, i) => out[IX3.py[0] + i].copy(p));
      put(out, IX3, 'up', onwards(blk[0], blk[0].clone().sub(blk[1]), V(-.14, .2, 1), L3.up, {turn: .2}).reverse());
      // Its last stretch runs into the site as exon 1 does (from the −1 of 4PJO's splice-site RNA back to the left and
      // towards the camera, clear of the snRNP); the meander (three even lobes) meets it there.
      const minus1b = nt(sx, 2).applyMatrix4(U1_FRAME3), K3 = 6;
      const last = [...onwards(minus1b, minus1b.clone().sub(site3[0]), V(-1, 0, -.5), K3, {turn: .2}).reverse(), minus1b];
      const ex = bridge(blk[blk.length - 1], blk[blk.length - 1].clone().sub(blk[blk.length - 2]), last[0], last[1].clone().sub(last[0]), IX3.site[0] - IX3.g1[0] - K3 - 1, {bulge: V(0, 1, -.12), lobes: 3});
      [...ex, ...last].forEach((p, i) => out[IX3.g1[0] + i].copy(p));
      put(out, IX3, 'site', site3);
      put(out, IX3, 'down', onwards(site3[6], site3[6].clone().sub(site3[5]), V(.14, .2, 1), L3.down, {turn: .2}));
      const seg3 = key => out.slice(...IX3[key]);
      segs3.u2af65.place(placeOn(SEG.u2af65, seg3('py'), V(0, -.55, .85))); segs3.u2af35.place(placeOn(SEG.u2af35, seg3('ag'), V(0, -1, -.25)));
      segs3.sr3.place(placeOn(SEG.sr, seg3('sr3'), V(0, -.6, -.8))); segs3.sr4.place(placeOn(SEG.sr, seg3('sr4'), V(0, -.6, -.8)));
      u1Pair.forEach((i, k) => { pre3.pair(IX3.site[0] + k, u1b.strand.points[i], 1); u1b.strand.pair(i, pre3.points[IX3.site[0] + k], 1); });
    }

    // ---------- Views ----------
    const work = pre.points.map(p => p.clone()), DROP = 32, U1_IN = V(0, -46, 26);
    const allOf = w => { layPre(w, work); return [...u1.points(), ...work.map(p => p.clone()), ...Object.values(segs).flatMap(s => s.points())]; };
    at.views = {
      // The whole pre-mRNA, open, looping round and bridged, in one box; once bridged the camera only pans to centre
      // the complex in a box of the same size, so it stays in the same part of the screen at the same scale.
      whole: {...boxAround([0, .25, .5, .75, 1].flatMap(w => allOf(w)), DIR, {margin: 10, fov: 26}), fill: .95},
      bridged: null,
      yeast: {...boxAround([...ySamples, ...yU1Strand.points, ...yPreStrand.points].filter((p, k) => k % 2 === 0).map(p => p.clone().add(S2)), DIR_Y, {margin: 12, fov: 26}), fill: .95},
      exon: {...boxAround([...u1b.points(), ...pre3.points.slice(IX3.up[1] - 30, IX3.down[0] + 30), ...Object.values(segs3).flatMap(s => s.points())].map(p => p.clone().add(S3)), DIR, {margin: 12, above: 10, fov: 26}), fill: .95},
    };
    { const b = boxAround(allOf(1), DIR, {margin: 6, fov: 26}); at.views.bridged = {...at.views.whole, target: b.target}; }
    // Camera moves (for tests): each shot's blend, from a third of the way before it.
    at.moves = SHOTS.slice(1).map(sh => [sh.t - .35 * sh.blend - .15, sh.t + .65 * sh.blend + .15]);

    // ---------- Timeline ----------
    // Each place shows while the camera is there: out as the camera sets off, in as it arrives.
    const place = [t => ramp(t, .2, 1.4) * (1 - ramp(t, T.intron - 1.15, T.intron - .6)),
      t => ramp(t, T.intron + 1.95, T.intron + 2.7) * (1 - ramp(t, T.exon - 1.15, T.exon - .6)),
      t => ramp(t, T.exon + 1.95, T.exon + 2.7)];
    const show = {
      u1: t => ramp(t, T.u1 + .2, T.u1 + 1.4), u1Dock: t => smooth(ramp(t, T.u1 + .4, T.u1 + 4.2)), u1Bonds: t => ramp(t, T.u1 + 4.2, T.u1 + 6.6),
      u2af: t => ramp(t, T.three + 1.6, T.three + 2.8), u2afDock: t => smooth(ramp(t, T.three + 1.6, T.three + 4.6)),
      sf1: t => ramp(t, T.three + 5.6, T.three + 6.8), sf1Dock: t => smooth(ramp(t, T.three + 5.6, T.three + 8.6)),
      sr: t => ramp(t, T.sr + 1.6, T.sr + 2.8), srDock: t => smooth(ramp(t, T.sr + 1.6, T.sr + 4.6)),
      tails: t => ramp(t, T.sr + 3.6, T.sr + 4.8), bridge: t => smooth(ramp(t, T.glue + 1, T.glue + 6.4)), reach: t => smooth(ramp(t, BRIDGED + 1, BRIDGED + 3.4)),
    };
    // A protein arrives from beside the stretch it binds, its RNA-binding face first: from DROP Å out along the line
    // from its RNA to its body, so the RNA never passes through it.
    const away = V(), drop = (seg, d) => {
      away.copy(seg.sg.body).applyMatrix4(seg.matrix).sub(mean(seg.rna())).setLength(DROP * (1 - d));
      return seg.show(new THREE.Matrix4().makeTranslation(away).multiply(seg.matrix));
    };
    const fogged = p => camera.position.distanceTo(p) < scene.fog.far;

    // For tests (?debug=1): where each factor sits on the pre-mRNA, and world points of everything drawn.
    at.ix = IX; at.ix3 = IX3; at.ixy = IXY; at.branchToAG = INTRON[1] - 1 - BRANCH_A; at.exonLength = EXON3[1] - EXON3[0];
    // How closely each protein's own RNA (placed with it) lies on the drawn stretch it sits on: rms distance (Å), and
    // for U1 the duplex's +1 against the pre-mRNA's.
    at.sites = () => {
      const rms = (seg, from) => { const r = seg.rna(); return Math.sqrt(r.reduce((s, p, i) => s + p.distanceToSquared(work[from + i]), 0) / r.length); };
      return {u1: site[0].distanceTo(work[IX.site[0]]), sr1: rms(segs.sr1, IX.sr1[0]), sf1: rms(segs.sf1, IX.sf1[0]), u2af65: rms(segs.u2af65, IX.py[0]),
        u2af35: rms(segs.u2af35, IX.ag[0]), sr2: rms(segs.sr2, IX.sr2[0])};
    };
    // The drawn stretches' steps (Å), the steps where they meet a structure's RNA included: each about 6.1 Å.
    at.steps = () => {
      const span = (st, ix, keys) => { const d = []; for (const k of keys) for (let i = Math.max(1, ix[k][0]); i <= Math.min(st.n - 1, ix[k][1]); i++) d.push(st.points[i].distanceTo(st.points[i - 1])); return [Math.min(...d), Math.max(...d)]; };
      return {pre: span(pre, IX, ['a1', 'a2', 'b', 'c', 'd', 'e', 'f']), yeast: span(yPreStrand, IXY, ['ex1', 'intr', 'ex2']), exon: span(pre3, IX3, ['up', 'd', 'g1', 'g2', 'g3', 'down'])};
    };
    // The sharpest bend (degrees) between successive steps of each drawn stretch, where it meets a structure's RNA too.
    at.bends = () => {
      const most = (st, ix, keys) => { let mx = 0; for (const k of keys) for (let i = Math.max(1, ix[k][0]); i < Math.min(st.n - 1, ix[k][1] + 1); i++) {
        const a = st.points[i].clone().sub(st.points[i - 1]).normalize(), b = st.points[i + 1].clone().sub(st.points[i]).normalize(); mx = Math.max(mx, Math.acos(clamp(a.dot(b))) * 180 / Math.PI); } return Math.round(mx); };
      return {pre: most(pre, IX, ['a1', 'a2', 'b', 'c', 'd', 'e', 'f']), yeast: most(yPreStrand, IXY, ['ex1', 'intr', 'ex2']), exon: most(pre3, IX3, ['up', 'd', 'g1', 'g2', 'g3', 'down'])};
    };
    // Each RS tail's end and the partner it reaches for (bridged), and its length (Å).
    at.tailEnds = () => [['sr1', segs.u2af35.nearest(segs.sr1.world())], ['sr2', u1.nearestAny(segs.sr2.world())]].map(([k, target]) => [tails[k].tube.points[47].distanceTo(target), tails[k].length]);
    at.shown = () => {
      const out = [], W = (g, p) => g.localToWorld(p.clone()).toArray();
      out.push(...pre.extent(), ...u1.strand.extent(), ...yU1Strand.extent().filter((p, k) => k % 3 === 0), ...yPreStrand.extent());
      out.push(...pre3.extent().filter(p => fogged(V(...p))), ...u1b.strand.extent());
      if (u1.meshes[0].visible) out.push(...u1.points().filter((p, k) => k % 2 === 0).map(p => W(place1, p)));
      for (const s of Object.values(segs)) if (s.meshes[0].visible) out.push(...s.points().map(p => W(place1, p)));
      for (const tl of Object.values(tails)) if (tl.tube.mesh.visible) out.push(...tl.points().map(p => W(place1, p)));
      if (yMeshes[0].visible) out.push(...ySamples.filter((p, k) => k % 3 === 0).map(p => W(place2, p)));
      if (u1b.meshes[0].visible) out.push(...u1b.points().filter((p, k) => k % 2 === 0).map(p => W(place3, p)));
      for (const s of Object.values(segs3)) if (s.meshes[0].visible) out.push(...s.points().map(p => W(place3, p)));
      for (const tl of Object.values(tails3)) if (tl.tube.mesh.visible) out.push(...tl.points().map(p => W(place3, p)));
      return out;
    };

    return {
      pre, u1, segs, tails, pre3, u1b, segs3, tails3, yPreStrand, yU1Strand, yMeshes, at,
      update(t, {pxPerA = 1} = {}) {
        const p1 = place[0](t), p2 = place[1](t), p3 = place[2](t), w = show.bridge(t);
        // Place 1: the pre-mRNA (its 3′ end looping round as the SR proteins bridge), U1 docking, the factors arriving.
        layPre(w, work);
        u1.place(new THREE.Matrix4().makeTranslation(U1_IN.clone().multiplyScalar(1 - show.u1Dock(t))).multiply(U1_FRAME));
        const bw = show.u1Bonds(t);
        u1Pair.forEach((i, k) => { const x = clamp(bw * 2.4 - k * .23); u1.strand.pair(i, x > 0 ? work[IX.site[0] + k] : null, x); pre.pair(IX.site[0] + k, u1.strand.points[i], x); });
        pre.pose(work).view(pxPerA).opacity(p1);
        u1.view(pxPerA); u1.opacity(show.u1(t) * p1);
        drop(segs.u2af65, show.u2afDock(t)); drop(segs.u2af35, show.u2afDock(t)); drop(segs.sf1, show.sf1Dock(t));
        drop(segs.sr1, show.srDock(t)); drop(segs.sr2, show.srDock(t));
        segs.u2af65.opacity(show.u2af(t) * p1); segs.u2af35.opacity(show.u2af(t) * p1); segs.sf1.opacity(show.sf1(t) * p1);
        segs.sr1.opacity(show.sr(t) * p1); segs.sr2.opacity(show.sr(t) * p1);
        // RS tails: curled, then reaching across (SR 1 on exon 1 to U2AF35 at the 3′ site, SR 2 on exon 2 to U1-70K).
        const reach = show.reach(t), tv = show.tails(t) * p1;
        if (tv > 0) {
          tails.sr1.pose(segs.sr1, segs.u2af35.nearest(segs.sr1.world()), reach, pxPerA, V(0, -.5, -1));
          tails.sr2.pose(segs.sr2, u1.nearestAny(segs.sr2.world()), reach, pxPerA, V(0, -1, .4));
        }
        tails.sr1.opacity(tv); tails.sr2.opacity(tv);
        // Place 2: the yeast E complex.
        for (const m of yMeshes) { fade(m.material, p2); m.visible = p2 > 0; }
        yU1Strand.pose().view(pxPerA).opacity(p2); yPreStrand.pose().view(pxPerA).opacity(p2);
        // Place 3: exon definition, its long introns fading into the dark.
        u1b.view(pxPerA); u1b.opacity(p3); pre3.pose().view(pxPerA).opacity(p3);
        for (const s of Object.values(segs3)) s.opacity(p3);
        if (p3 > 0) { tails3.sr3.pose(segs3.sr3, null, 0, pxPerA); tails3.sr4.pose(segs3.sr4, null, 0, pxPerA); }
        tails3.sr3.opacity(p3); tails3.sr4.opacity(p3);
        const d3 = camera.position.distanceTo(S3);
        scene.fog.near = p3 > 0 ? d3 + 260 : 1e6; scene.fog.far = p3 > 0 ? d3 + 2300 : 2e6;
        at.time = t; at.bridged = w; at.reach = reach; at.tailLength = [tails.sr1.length || 0, tails.sr2.length || 0];
      },
      annotate(t, {label, tag}) {
        const col = c => ({color: hex(c)}), P1 = p => place1.localToWorld(p.clone()), P3 = p => place3.localToWorld(p.clone()), P2 = p => place2.localToWorld(p.clone());
        if (t < T.intron - 1.2) {
          const d1 = t - T.signals;
          if (d1 > 1.4 && t < T.u1 - .6) {
            tag(P1(work[IX.site[0]]), 'GU · 5′ splice site', col(C.intron));
            // Above and below the RNA in turn, so the names of sites close together stay apart.
            tag(P1(work[BRANCH_A].clone().add(V(0, -16, 0))), 'Branch site', col(C.intron));
            tag(P1(work[IX.py[0] + 4].clone().add(V(0, 18, 0))), 'Py tract', col(C.intron));
            tag(P1(work[INTRON[1] - 1].clone().add(V(0, -16, 0))), 'AG · 3′ splice site', col(C.intron));
            tag(P1(work[3]), 'Exon', col(C.exon)); tag(P1(work[IX.N - 3]), 'Exon', col(C.exon)); tag(P1(work[IX.b[0] + 14]), 'Intron', col(C.intron));
          } else if (t > T.u1 + 4.2 && t < T.three) {
            // Each factor is named once it has settled on the RNA (a label riding its arrival is pushed about the screen).
            label(P1(u1.world('Sm ring')), 'U1 snRNP', 'On the 5′ splice site', col(C.U1));
            if (t > T.u1 + 6.6) tag(P1(work[IX.site[0] + 3]), 'Base paired', col(C.U1));
          } else if (t > T.three + 4.6 && t < T.sr - .6) {
            if (t < T.three + 11) {
              label(P1(segs.u2af65.world()), 'U2AF65', 'On the polypyrimidine tract', col(C.U2AF65));
              label(P1(segs.u2af35.world('U2AF35')), 'U2AF35', 'At the AG', col(C.U2AF35));
              if (t > T.three + 7.2) label(P1(segs.sf1.world()), 'BBP/SF1', 'On the branch site', col(C.SF1));
            } else {
              label(P1(segs.u2af65.world()), 'Commitment (E) complex', 'Locked into the splicing pathway', col(C.U2AF65));
              tag(P1(u1.world('U1-C')), 'U1', col(C.U1)); tag(P1(segs.sf1.world()), 'BBP/SF1', col(C.SF1)); tag(P1(segs.u2af35.world('U2AF35')), 'U2AF', col(C.U2AF35));
            }
          } else if (t > T.sr + 4.6 && t < T.glue - .6) {
            // To the right: their anchors sit near the step list, where the side a label would take first changes with
            // the camera's slow drift.
            label(P1(segs.sr1.world()), 'RNA-recognition motif', 'Of an SR protein, on the exon', {...col(C.SR), side: 'right'});
            if (t > T.sr + 5.4) label(P1(tails.sr1.tube.points[30]), 'RS domain', 'Arginine/serine dipeptides', {...col(C.RS), side: 'right'});
            tag(P1(segs.sr2.world()), 'SR protein', col(C.SR));
          } else if (t > T.glue + 1.4 && t < BRIDGED + 3.4) {
            tag(P1(work[IX.b[0] + 15]), 'Intron', col(C.intron));
          } else if (t >= BRIDGED + 3.4) {
            label(P1(tails.sr1.tube.points[36]), 'SR proteins bridge', 'U1 at the 5′ site, U2AF at the 3′ site', {...col(C.RS), side: 'right'});
            tag(P1(work[IX.b[0] + 15]), 'Intron', col(C.intron));
            tag(P1(segs.u2af35.world('U2AF35')), 'U2AF', col(C.U2AF35));
            tag(P1(u1.world('U1-C')), 'U1', col(C.U1));
          }
        } else if (t < T.exon - 1.2) {
          if (t > T.intron + 2.8) {
            label(P2(mean(ySamples)), 'Yeast E complex', 'U1 snRNP on the 5′ splice site', col(C.yeast));
            tag(P2(yPreStrand.points[yBranch]), 'Branch site', col(C.intron));
            tag(P2(yPreStrand.points[yAG]), '3′ splice site', col(C.intron));
            if (t > T.intron + 5) tag(P2(yPreStrand.points[IXY.intr[0] + 12].clone().add(V(16, 0, 0))), 'A single, short intron', col(C.intron));
          }
        } else if (t > T.exon + 2.8) {
          label(P3(pre3.points[IX3.g2[0] + 18]), 'Exon', '120 nucleotides', col(C.exon));
          tag(P3(segs3.u2af35.world('U2AF35')), 'U2AF · 3′ splice site', col(C.U2AF35));
          tag(P3(u1b.world('U1-C')), 'U1 · 5′ splice site', col(C.U1));
          tag(P3(segs3.sr3.world()), 'SR', col(C.SR)); tag(P3(segs3.sr4.world()), 'SR', col(C.SR));
          if (t > T.exon + 5) { tag(P3(pre3.points[IX3.up[1] - 60]), 'Long intron', col(C.intron)); tag(P3(pre3.points[IX3.down[0] + 60]), 'Long intron', col(C.intron)); }
        }
      },
    };
  },
});
