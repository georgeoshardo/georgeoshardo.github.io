// Scene: splice sites. A gene's DNA (ideal B-DNA) and its mature mRNA: the mRNA holds the exons' sequence and not the
// intron's, so comparing the two finds the exon–intron junctions. Then the pre-mRNA (70 nucleotides, drawn with
// shared/rna.mjs at true size): its 5′ and 3′ splice sites, named 5′ → 3′ along the intron; the GU–AG rule; the
// consensus at each site as a logo along the RNA, each letter as tall as the base is common at that position (the
// notes' figure, splicing_consensus.png); the branch site 21 nucleotides upstream of the 3′ splice site, its A, and
// the polypyrimidine tract; a point mutation (G → A at the intron's first nucleotide) that prevents splicing, beside
// the wild type, which is spliced (its intron removed as a lariat, its exons joined); and the major (U2-type) and minor
// (U12-type, AU–AC and GU–AG) introns' consensus sequences.
// The pre-mRNA lies in a straight row. Only the spliced wild type's intron loops out, as it is spliced: the G of its GU
// travels along the row to the branch A, the stretch between them looping out, so the one loop drawn is the lariat's
// ring from the moment it appears, its feet the two nucleotides the 2′–5′ bond joins. Every shot fits what its step
// shows into the free part of the screen.
import * as THREE from 'three';
import {runScene} from '../shared/scene_player.mjs';
import {loadSurfaceSet, baseMaterial, fade} from '../shared/molecules.mjs';
import {boxAround} from '../shared/camera.mjs';
import {STRANDS, BASES} from '../shared/strands.mjs';
import {SPLICING, SPACING, createStrand, line, loopBetween} from '../shared/rna.mjs';
import {pairsFromStrands, frameFromPairs, meanLocal, sequencePairs, helixFrames, createDuplex, RISE} from '../shared/dna.mjs';
import {ramp, smooth, clamp, mix} from '../shared/ease.mjs';

const V = (...a) => new THREE.Vector3(...a);
const X = V(1, 0, 0), Y = V(0, 1, 0);
const hex = c => '#' + new THREE.Color(c).getHexString();
const lighter = (c, k) => new THREE.Color(c).lerp(new THREE.Color(0xffffff), k).getHex();
const S = SPACING;

// Times (s): each step starts at its t.
const T = {junction: 0, sites: 14, rule: 27, logo: 41, branch: 56, mutation: 71, minor: 90, end: 112};

// ---------- The pre-mRNA ----------
// 70 nucleotides: exon 1 (0–9), the intron (10–59) and exon 2 (60–69). Its branch A is 38, 21 nucleotides upstream of
// the 3′ splice site; between the 5′ splice site's consensus and the branch site's, a short stretch with none (22–27).
// Each sequence's letters follow its consensus (the commonest base at each position of the logos).
const N = 70, E1 = 10, E2 = 60, BR = 38, PY = [43, 58];
const SEQ = {
  major: 'GACUCCACAG' + 'GUAAGUAUUCUG' + 'GGCCUG' + 'GUG' + 'GCCACUAACUCU' + 'UUCCU' + 'UUCUUUUCUCAG' + 'GUCCUGGAGC',
  minorAC: 'GACUCCAAAG' + 'AUAUCCUUUUUA' + 'GGCCUG' + 'UUUUUCCUUAACU' + 'GCCUGCC' + 'AACUUUGCUCAC' + 'GUUCUGGAGC',
  minorGU: 'GACUCCAACU' + 'GUAUCCUUUUUA' + 'GGCCUG' + 'UUUUUCCUUAACU' + 'GCCUGCC' + 'AACUUUUUUCAG' + 'AUACUGGAGC',
};
SEQ.mutant = SEQ.major.slice(0, E1) + 'A' + SEQ.major.slice(E1 + 1);

// The consensus logos, read from the notes' figure: per position, each base's percent occurrence. `from` is the
// nucleotide under the logo's first position (5′ site −3…, branch site −7… or −10… round its A, 3′ site −12…).
const col = s => s.split(' ').map(x => [x[0], +x.slice(1)]);
const LOGOS = {
  major: {
    five: {from: 7, cols: ['C38 A34 G17 U11', 'A60 C14 G13 U13', 'G78 A10 U6 C6', 'G100', 'U100', 'A60 G34 C3 U3', 'A70 G11 U10 C9',
      'G80 U7 A7 C6', 'U45 G20 C18 A17', 'A37 G29 C17 U17', 'U33 C26 G25 A16', 'U32 C26 G23 A19']},
    branch: {from: 31, cols: ['G33 C27 A20 U20', 'C34 G30 U18 A18', 'C50 U22 G14 A14', 'A38 C28 G20 U14', 'C70 U14 G8 A8', 'U68 C22 A5 G5',
      'A40 G36 C18 U6', 'A90 U4 C3 G3', 'C72 U16 G6 A6', 'U58 C26 A8 G8', 'C40 G34 U14 A12', 'U60 C24 A8 G8']},
    three: {from: 48, cols: ['U55 C30 A8 G7', 'U57 C30 A7 G6', 'U57 C31 A6 G6', 'U58 C30 A6 G6', 'U60 C30 G6 A4', 'U60 C30 G6 A4',
      'U58 C31 G7 A4', 'U57 C32 G7 A4', 'U30 C30 A22 G18', 'C68 U26 A4 G2', 'A100', 'G100', 'G52 A26 C12 U10', 'U32 A30 G22 C16']},
  },
  minorAC: {
    five: {from: 7, cols: ['A45 G30 C20 U5', 'A55 U25 C20', 'G50 A30 C20', 'A100', 'U100', 'A100', 'U100', 'C100', 'C100', 'U100',
      'U85 C15', 'U80 C12 G8', 'U55 A20 G15 C10', 'U35 A25 G20 C20', 'A40 C30 G25 U5']},
    branch: {from: 28, cols: ['U65 G25 A10', 'U70 G20 A10', 'U62 A20 G18', 'U66 C18 G16', 'U80 C15 A5', 'C95 U5', 'C95 U5', 'U100',
      'U100', 'A75 G25', 'A100', 'C85 U15', 'U60 C30 A10']},
    three: {from: 48, cols: ['A50 C30 U10 G10', 'A50 U25 C15 G10', 'C55 U20 A15 G10', 'U45 A25 C20 G10', 'U40 C30 A18 G12',
      'U45 G30 C20 A5', 'G45 U30 C20 A5', 'C55 U25 A15 G5', 'U40 A35 C20 G5', 'C60 U30 A10', 'A100', 'C100', 'G45 A30 C20 U5',
      'U45 C30 G20 A5', 'U45 A35 C15 G5']},
  },
  minorGU: {
    five: {from: 7, cols: ['A50 U20 G20 C10', 'C60 U20 A12 G8', 'U45 A35 C20', 'G100', 'U100', 'A100', 'U100', 'C100', 'C100', 'U100',
      'U92 C4 A4', 'U62 C22 A8 G8', 'U40 A30 C18 G12', 'U30 C30 A25 G15', 'A50 U20 C18 G12']},
    branch: {from: 28, cols: ['U55 G30 A15', 'U68 G22 A10', 'U60 A22 G18', 'U62 C22 G16', 'U80 C15 A5', 'C95 U5', 'C95 U5', 'U100',
      'U100', 'A72 G28', 'A100', 'C88 U12', 'U58 C32 A10']},
    three: {from: 48, cols: ['A55 U25 C15 G5', 'A50 U25 C20 G5', 'C55 U25 A15 G5', 'U50 C30 A15 G5', 'U50 C30 A15 G5',
      'U55 A25 G15 C5', 'U45 A30 C20 G5', 'U45 C30 A20 G5', 'U40 A30 C25 G5', 'C70 U25 A5', 'A100', 'G100', 'A70 C20 U5 G5',
      'U55 C30 A10 G5', 'A60 G25 U10 C5']},
  },
};
for (const set of Object.values(LOGOS)) for (const site of Object.values(set)) site.cols = site.cols.map(col);
// Logo geometry (Å): the letters stand on a line BASE above the strand; a column (100 %) is H tall, each letter W wide.
const BASE = 6.4, H = 16, W = .86 * S;

// ---------- Step 1: the gene and its mRNA ----------
const YG = -46, YM = 40;   // the gene's DNA above, the mRNA below (−y is up)
const GENE = SEQ.major.replace(/U/g, 'T'), MRNA = SEQ.major.slice(0, E1) + SEQ.major.slice(E2);

// ---------- Step 6: the wild type and, below it, the mutant ----------
const YMUT = 112;   // the mutant's row, below the wild type's

const NOTES = {sites: 'nuclear-splice-sites-are-short-sequences', lariat: 'splicing-proceeds-through-a-lariat-intermediate'};
const steps = [
  {t: T.junction, nav: 'Junctions', title: 'An mRNA compared<br>with its gene.', notes: NOTES.sites, hold: 1.1,
    text: 'The exons are the sequences retained in the mature RNA; the intron between them is not. By comparing the nucleotide sequence of a mature mRNA with that of the original gene, the junctions between exons and introns can be determined.'},
  {t: T.sites, nav: '5′ and 3′ splice sites', title: 'Splice sites mark<br>the ends of the intron.', notes: NOTES.sites, hold: 1.1,
    text: 'The exon–intron boundaries contain short, well-conserved consensus sequences known as splice sites. They define the ends of the intron directionally, named from left to right (5′ to 3′) along it: the 5′ splice site (the left, or donor, site) and the 3′ splice site (the right, or acceptor, site).'},
  {t: T.rule, nav: 'The GU–AG rule', title: 'Introns start with GU<br>and end with AG.', notes: NOTES.sites, hold: 1.1,
    text: 'The sequence of a generic intron is GU…AG. Because the intron starts with the dinucleotide GU and ends with the dinucleotide AG, the junctions are described as conforming to the GU–AG rule. In the coding strand of the DNA, this corresponds to a GT–AG sequence.'},
  {t: T.logo, nav: 'Consensus sequences', title: 'Short, conserved<br>consensus sequences.', notes: NOTES.sites, hold: 1.1,
    text: 'Around each junction, the bases of a splice site are conserved. The height of each letter indicates the percent occurrence of that base at each consensus position: the 5′ splice site reads mostly CAG|GUAAGU, and the 3′ splice site a run of pyrimidines, then CAG|G.'},
  {t: T.branch, nav: 'The branch site', title: 'The branch site,<br>upstream of the 3′ site.', notes: NOTES.lariat, hold: 1.1,
    text: 'Splicing also requires a branch site, located 18 to 40 nucleotides upstream of the 3′ splice site. It contains a critical adenine (A) nucleotide that is essential for the chemical reaction. Highly conserved in yeast (UACUAAC), it is less defined in multicellular eukaryotes. The polypyrimidine tract lies between the branch site and the 3′ splice site.'},
  {t: T.mutation, nav: 'Point mutations', title: 'A point mutation<br>prevents splicing.', notes: NOTES.sites, hold: 1.1,
    text: 'The importance of these consensus sequences is confirmed by point mutations, which can prevent splicing from occurring. Here the intron’s first G is changed to A: the wild-type pre-mRNA is spliced, its intron removed and its exons joined, while the mutant keeps its intron.'},
  {t: T.minor, nav: 'Major and minor introns', title: 'Major and<br>minor introns.', notes: NOTES.sites, hold: 1.1,
    text: 'The vast majority of introns belong to the major class, the U2-type introns, which generally follow the GU–AG rule. A small fraction are minor, U12-type introns: first identified through AU–AC termini, most have GU–AG termini. They are defined by their consensus signals and use of the minor spliceosome.'},
];

// ---------- Letters for the logos ----------
// Each letter drawn once, white, filling its canvas edge to edge (so a stretched letter fills its share of a column),
// tinted by its material; on planes facing the viewer (−z) with −y up, standing on their origin.
const glyphs = {};
function glyph(ch) {
  if (glyphs[ch]) return glyphs[ch];
  const c = document.createElement('canvas'); c.width = 128; c.height = 160;
  const g = c.getContext('2d'); g.font = '700 200px "DM Sans", system-ui, sans-serif';
  const m = g.measureText(ch), w = m.actualBoundingBoxLeft + m.actualBoundingBoxRight, h = m.actualBoundingBoxAscent + m.actualBoundingBoxDescent, pad = 5;
  const sx = (c.width - 2 * pad) / w, sy = (c.height - 2 * pad) / h;
  g.setTransform(sx, 0, 0, sy, pad + m.actualBoundingBoxLeft * sx, pad + m.actualBoundingBoxAscent * sy);
  g.fillStyle = '#fff'; g.fillText(ch, 0, 0);
  const tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 4;
  return glyphs[ch] = tex;
}
const letterGeometry = new THREE.PlaneGeometry(1, 1).rotateX(Math.PI).translate(0, -.5, 0);

// A logo: for each site, its columns of letters stacked smallest at the bottom, each letter's height its percent of H,
// standing above the nucleotides of a strand. One instanced mesh per base. `grow` (site → column → 0–1) sets each
// column's height; place(points) puts the columns over the strand's points now.
function createLogo(parent, logo) {
  const records = [];
  for (const [site, {from, cols}] of Object.entries(logo)) {
    cols.forEach((letters, k) => {
      let below = 0;
      for (const [ch, f] of [...letters].sort((a, b) => a[1] - b[1])) { if (f >= 5) records.push({site, k, i: from + k, ch, f, below}); below += f; }
    });
  }
  const meshes = {}, m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), p = V(), s = V();
  for (const ch of 'ACGU') {
    const list = records.filter(r => r.ch === ch); if (!list.length) continue;
    const material = new THREE.MeshBasicMaterial({map: glyph(ch), color: new THREE.Color(BASES[ch]).multiplyScalar(1.1), transparent: true, depthWrite: false});
    material.userData.noAO = true;
    const mesh = new THREE.InstancedMesh(letterGeometry, material, list.length); mesh.frustumCulled = false; mesh.renderOrder = 4; parent.add(mesh);
    meshes[ch] = {mesh, list};
  }
  let alpha = 1;
  const logo$ = {records, shown: 0,
    // Columns at their heights over the strand's points (local to the parent), and their opacity.
    place(points, grow, opacity = 1) {
      let any = 0;
      for (const {mesh, list} of Object.values(meshes)) {
        list.forEach((r, j) => {
          const g = grow(r.site, r.k), base = points[r.i];
          if (g <= .002) { m4.makeScale(0, 0, 0); mesh.setMatrixAt(j, m4); return; }
          any = Math.max(any, g);
          p.set(base.x, base.y - BASE - r.below / 100 * H * g, base.z - .3); s.set(W, r.f / 100 * H * g, 1);
          mesh.setMatrixAt(j, m4.compose(p, q, s));
        });
        mesh.instanceMatrix.needsUpdate = true;
      }
      alpha = any > .002 ? clamp(opacity) : 0;
      for (const {mesh} of Object.values(meshes)) { mesh.material.opacity = alpha; mesh.visible = alpha > 0; }
      logo$.shown = alpha;
      logo$.points = points; logo$.grow = grow;
      return logo$;
    },
    // World points round every column now shown (its foot and top, either side), for shots and tests.
    extent() {
      if (!(alpha > 0) || !logo$.points) return [];
      parent.updateWorldMatrix(true, false);
      const out = [], seen = new Set();
      for (const r of records) {
        const key = r.site + r.k; if (seen.has(key)) continue; seen.add(key);
        const g = logo$.grow(r.site, r.k); if (g <= .002) continue;
        const b = logo$.points[r.i];
        for (const dx of [-W / 2, W / 2]) for (const dy of [-BASE, -BASE - H * g]) out.push(parent.localToWorld(V(b.x + dx, b.y + dy, b.z)).toArray());
      }
      return out;
    },
    // The top of a column (local to the parent), for labels.
    top(site, k, lift = 1.5) { const r = records.find(x => x.site === site && x.k === k), b = logo$.points[r.i], g = logo$.grow(site, k); return V(b.x, b.y - BASE - H * g - lift, b.z); },
  };
  return logo$;
}

// ---------- Splicing in a row (a pre-mRNA with exon 1 [0, e1), its intron [e1, e2), its branch A at br, exon 2 from e2) ----------
// The pre-mRNA lies straight along a row (from `origin`, along `dir`, 5′ → 3′). Splicing: the intron's 5′ end (its G,
// at e1, with exon 1 behind it) travels along the row to one step before the branch A, the stretch between them looping
// out towards `side` as they close in (loopBetween: every step keeps its length), so the loop is the lariat's ring from
// the moment it appears; exon 1 is cut free (the 2′–5′ bond forms); the lariat swings back and up about the pivot (exon
// 2's first nucleotide); exon 1 slides along the row to the pivot, where the exons join; the lariat drifts off.
function createRowSplice({e1, br, e2, origin, dir = X, side = V(0, .8, .6), swing = [.8, 1], drift = V(-8, -16, 60)}) {
  const d = dir.clone().normalize(), sd = side.clone().normalize(), up = d.clone().cross(Y).normalize();
  const row = i => origin.clone().addScaledVector(d, i * S), A = row(br), at = row(e2), dR = (e2 - br) * S;
  const q = new THREE.Quaternion(), q2 = new THREE.Quaternion(), G = V(), loop = Array.from({length: br - e1 - 1}, () => V());
  return {
    pivot: at,
    // w: {fold (the G's travel to the branch A), cut, swing, slide, away (0–1)}; fills out[0, n).
    pose(n, {fold = 0, cut = 0, swing: sw = 0, slide = 0, away = 0}, out) {
      const gap = mix((br - e1) * S, S, fold);
      G.copy(A).addScaledVector(d, -gap);
      loopBetween(G, A, loop.length, {toward: sd, out: loop});
      q.setFromAxisAngle(Y, swing[0] * sw); q2.setFromAxisAngle(up, swing[1] * sw); q.premultiply(q2);
      for (let i = 0; i < n; i++) {
        const p = out[i];
        if (i >= br) p.copy(row(i));
        else if (i > e1) p.copy(loop[i - e1 - 1]);
        else p.copy(G).addScaledVector(d, -(e1 - i) * S);
        if (i < e1) {
          // Exon 1, drawn back a step by the cut, then slid until its last nucleotide is a step before the pivot.
          p.addScaledVector(d, -1.2 * S * cut + (gap + dR + 1.2 * S * cut) * slide);
        } else if (i < e2 && (sw > 0 || away > 0)) {
          p.sub(at).applyQuaternion(q).add(at).addScaledVector(drift, away);
        }
      }
      return out;
    },
  };
}

const at = {};
const DIR = [.03, -.12, -1];

runScene({
  pageTitle: 'Splice sites · RNA splicing and processing', eyebrow: 'Splice sites',
  links: [{href: 'index.html', text: 'All scenes'}],
  steps, duration: T.end, notesPage: 'notes.html', fov: 26, fog: .00008, loop: false,
  shots: [
    {t: T.junction, frame: () => at.frames.junction},
    {t: T.sites, blend: 2.4, frame: () => at.frames.straight},
    // Closer in, for the logos.
    {t: T.rule + 4.6, blend: 2.2, frame: () => at.frames.row},
    {t: T.mutation, blend: 2.4, frame: () => at.frames.pair},
    {t: T.minor, blend: 2.4, frame: () => at.frames.row},
  ],
  async build({world, progress}) {
    const [set] = await Promise.all([loadSurfaceSet('assets/splice_sites.json', 'assets/splice_sites.bin', progress), document.fonts.load('700 200px "DM Sans"')]);
    for (const [k, s] of Object.entries(SEQ)) if (s.length !== N) throw new Error(`sequence ${k} has ${s.length} nucleotides`);

    // ---------- The gene (ideal B-DNA: 355D's mean base-pair geometry) and its mRNA ----------
    const strand = name => set.meta.strands.find(s => s.name === name);
    const crystal = pairsFromStrands(strand('a'), strand('b')); frameFromPairs(crystal);
    const local = meanLocal(crystal.slice(1, -1));
    const gene = createDuplex({pairs: sequencePairs(GENE, local), samples: 3}); world.add(gene.group);
    const g0 = -(N - 1) * RISE / 2;
    gene.pose(helixFrames(N, {origin: V(g0, YG, 0), direction: X, reference: V(0, -1, 0)}));
    // The exons' DNA in the exons' colour, the intron's as DNA.
    const tint = (c, w) => new THREE.Color(c).lerp(new THREE.Color(SPLICING.exon), w).getHex();
    gene.segments(0, [[0, E1, tint(STRANDS.template, .7)], [E1, E2, STRANDS.template], [E2, N, tint(STRANDS.template, .7)]]);
    gene.segments(1, [[0, E1, tint(STRANDS.coding, .7)], [E1, E2, STRANDS.coding], [E2, N, tint(STRANDS.coding, .7)]]);
    gene.pose(helixFrames(N, {origin: V(g0, YG, 0), direction: X, reference: V(0, -1, 0)}));
    const gx = i => g0 + i * RISE;
    const mrna = createStrand(world, MRNA.length).colour(SPLICING.exon).letters(MRNA, 1);
    const m0 = -(MRNA.length - 1) * S / 2;
    mrna.pose(line(MRNA.length, {origin: V(m0, YM, 0), direction: X}));
    // Wedges from each exon of the gene to its stretch of the mRNA, as the notes' figures draw them.
    const wedgeMaterial = new THREE.MeshBasicMaterial({color: lighter(SPLICING.exon, .35), transparent: true, opacity: 0, depthWrite: false, side: THREE.DoubleSide});
    wedgeMaterial.userData.noAO = true;
    const wedge = (a0, a1, b0, b1) => {
      const corners = [V(a0, YG + 11, 2), V(a1, YG + 11, 2), V(b1, YM - 7, 2), V(b0, YM - 7, 2)];
      const geo = new THREE.BufferGeometry().setFromPoints([corners[0], corners[1], corners[2], corners[0], corners[2], corners[3]]);
      const mesh = new THREE.Mesh(geo, wedgeMaterial); mesh.renderOrder = -1; world.add(mesh); return {mesh, corners};
    };
    const wedges = [wedge(gx(0) - RISE / 2, gx(E1 - 1) + RISE / 2, m0 - S / 2, m0 + (E1 - .5) * S),
      wedge(gx(E2) - RISE / 2, gx(N - 1) + RISE / 2, m0 + (E1 - .5) * S, m0 + (MRNA.length - .5) * S)];

    // ---------- The pre-mRNA and its layouts ----------
    const stretches = [[0, E1, SPLICING.exon], [E1, E2, SPLICING.intron], [E2, N, SPLICING.exon]];
    const pre = createStrand(world, N).stretches(stretches);
    const mutant = createStrand(world, N).stretches(stretches).letters(SEQ.mutant, 1);
    const X0 = -(N - 1) * S / 2, straight = line(N, {origin: V(X0, 0, 0), direction: X}), work = straight.map(p => p.clone());
    // Step 6: the wild type on its row, spliced; the mutant straight below it.
    const splice = createRowSplice({e1: E1, br: BR, e2: E2, origin: V(X0, 0, 0)});
    const mutStraight = line(N, {origin: V(X0, YMUT, 0), direction: X});
    const bond = pre.link(BR, E1, {w: 0, colour: lighter(SPLICING.cap, .2)});
    // The backbone bonds that break and form, drawn so none vanishes or appears in one frame: at the cut, the bond
    // between exon 1 and the intron shrinks back into both (each half in its own colour, as the strand drew it); before
    // the join, exon 1's end reaches exon 2; after it, the intron's 3′ end lets go of exon 2.
    const backbone = (i, j) => pre.link(i, j, {w: 0, backbone: true});
    const cutBonds = [backbone(E1 - 1, E1), backbone(E1, E1 - 1)], newBond = backbone(E1 - 1, E2), oldBonds = [backbone(E2 - 1, E2), backbone(E2, E2 - 1)];
    const BREAK = .4;

    // ---------- Logos, the junctions, the branch A ----------
    const logos = Object.fromEntries(Object.entries(LOGOS).map(([k, l]) => [k, createLogo(world, l)]));
    const barMaterial = baseMaterial(0xc9d4de, {roughness: .6});
    const bars = [E1, E2].map(i => { const m = new THREE.Mesh(new THREE.CylinderGeometry(.32, .32, 1, 10), barMaterial); world.add(m); return {i, mesh: m}; });
    const markerMaterial = baseMaterial(0xff6f61, {emissive: 0xff6f61, emissiveIntensity: .35, roughness: .4});
    const marker = new THREE.Mesh(new THREE.SphereGeometry(1.7, 20, 14), markerMaterial); world.add(marker);

    // Each logo's column heights at time t (site → column → 0–1): sites grow column by column, 5′ to 3′.
    const rising = (t, a, b, k, n) => { const span = b - a, each = span * .45; return ramp(t, a + (span - each) * k / Math.max(1, n - 1), a + (span - each) * k / Math.max(1, n - 1) + each); };
    const shrink = (t, a) => 1 - ramp(t, a, a + .8);
    const majorGrow = t => (site, k) => {
      if (t >= T.minor) return ramp(t, T.minor + 2.4, T.minor + 4) * shrink(t, T.minor + 8.4);
      const out = 1 - ramp(t, T.mutation - .8, T.mutation - .2);
      // The GU and AG first (step 3), then the rest of the 5′ and 3′ sites (step 4), then the branch site (step 5).
      const dinucleotide = (site === 'five' && (k === 3 || k === 4)) || (site === 'three' && (k === 10 || k === 11));
      if (dinucleotide) return ramp(t, T.rule + 7.4, T.rule + 8.8) * out;
      if (site === 'five') return rising(t, T.logo + .6, T.logo + 3.4, k, 12) * out;
      if (site === 'three') return rising(t, T.logo + 3.8, T.logo + 6.6, k, 14) * out;
      return rising(t, T.branch + .6, T.branch + 3.2, k, 12) * out;
    };
    const ACt = [T.minor + 9.2, T.minor + 14.6], GUt = T.minor + 15.4;
    const minorACGrow = t => () => ramp(t, ACt[0], ACt[0] + 1.6) * shrink(t, ACt[1]);
    const minorGUGrow = t => () => ramp(t, GUt, GUt + 1.6);
    // Step 6: both appear, straight; the mutant's G becomes A; the wild type's G travels along the row to its branch A,
    // the intron between them looping out into the lariat's ring; exon 1 is cut free, the lariat swings back, exon 1
    // slides to exon 2 and they join, and the lariat leaves. The mutant stays as it is.
    const M = T.mutation, MUT = {shown: [M + 1.6, M + 2.4], swap: M + 4.4, done: M + 6.4};
    const SP = {fold: [M + 6.2, M + 8.4], cut: [M + 8.6, M + 9.6], swing: [M + 9.8, M + 11.6], slide: [M + 11.6, M + 13.2], join: M + 13.2, away: [M + 13.6, M + 16]};
    const sequenceAt = t => t < ACt[1] + .8 ? (t < ACt[0] - .2 || t < T.minor ? SEQ.major : SEQ.minorAC) : SEQ.minorGU;
    let shownSeq = '';

    // Points (world) of everything drawn now: for the shots and the tests.
    const shownPoints = () => {
      const out = [];
      if (pre.alpha > 0) out.push(...pre.extent());
      if (mutant.alpha > 0) out.push(...mutant.extent());
      if (mrna.alpha > 0) out.push(...mrna.extent());
      if (at.dnaShown > 0) for (let i = 0; i < N; i += 3) out.push(gene.world.aBackbone[i].toArray(), gene.world.bBackbone[i].toArray());
      if (at.dnaShown > 0) for (const w of wedges) out.push(...w.corners.map(c => c.toArray()));
      for (const l of Object.values(logos)) out.push(...l.extent());
      for (const b of bars) if (b.mesh.visible) out.push(b.mesh.localToWorld(V(0, .5, 0)).toArray(), b.mesh.localToWorld(V(0, -.5, 0)).toArray());
      if (marker.visible) out.push(marker.position.toArray());
      return out;
    };
    at.shown = shownPoints;

    let pxPerA = 1, lastAway = 0;
    const content = {
      pre, mutant, mrna, gene, logos, at,  // for tests (?debug=1)
      update(t, {pxPerA: px = 1} = {}) {
        pxPerA = px;
        // Step 1: the gene and its mRNA, crossfading to the pre-mRNA once the camera has drawn back.
        const dna = ramp(t, .2, 1.4) * (1 - ramp(t, T.sites + 1.7, T.sites + 2.7));
        gene.opacity(clamp(dna)); gene.group.visible = dna > 0; gene.view(pxPerA); at.dnaShown = dna;
        mrna.opacity(dna).view(pxPerA);
        const w = .085 * ramp(t, 4, 5.6) * (1 - ramp(t, T.sites + 1.7, T.sites + 2.7));
        wedgeMaterial.opacity = w; for (const x of wedges) x.mesh.visible = w > .002;

        // The pre-mRNA: straight, spliced (step 6), then afresh for the minor introns.
        const preIn = ramp(t, T.sites + 1.7, T.sites + 2.7), preOut = 1 - ramp(t, T.minor - .8, T.minor - .3), preAgain = ramp(t, T.minor + 1.6, T.minor + 2.4);
        let points;
        if (t < T.mutation || t >= T.minor) {
          points = straight;
          pre.pieces(null); bond.w = 0; lastAway = 0;
          for (const L of [...cutBonds, newBond, ...oldBonds]) L.w = 0;
        } else {
          const w = {cut: ramp(t, ...SP.cut), swing: smooth(ramp(t, ...SP.swing)), slide: smooth(ramp(t, ...SP.slide)), away: smooth(ramp(t, ...SP.away))};
          points = splice.pose(N, {fold: smooth(ramp(t, ...SP.fold)), ...w}, work);
          const joined = t >= SP.join;
          pre.pieces(w.cut > 0 ? joined ? [[[0, E1], [E2, N]], {ranges: [[E1, E2]], opacity: 1 - ramp(t, SP.away[0] + .6, SP.away[1])}] : [[0, E1], [E1, N]] : null);
          bond.w = w.cut; lastAway = w.away;
          const cutGone = w.cut > 0 && !joined ? .5 * (1 - ramp(t, SP.cut[0], SP.cut[0] + BREAK)) : 0;
          for (const L of cutBonds) L.w = cutGone;
          newBond.w = w.cut > 0 && !joined ? ramp(t, SP.join - BREAK, SP.join) : 0;
          for (const L of oldBonds) L.w = joined ? .5 * (1 - ramp(t, SP.join, SP.join + BREAK)) : 0;
        }
        const seq = sequenceAt(t);
        // Letters on the strand: the sequence's bases shown from step 3; out and in again as the intron changes.
        const lettersW = ramp(t, T.rule + 5.4, T.rule + 6.6) * (t < T.minor ? 1 : Math.min(1 - ramp(t, ACt[0] - 1, ACt[0] - .3) + ramp(t, ACt[0] - .2, ACt[0] + .5),
          1 - ramp(t, ACt[1], ACt[1] + .7) + ramp(t, ACt[1] + .8, ACt[1] + 1.5)));
        if (seq !== shownSeq || Math.abs(lettersW - (at.lettersW ?? -1)) > .004) { pre.letters(seq, lettersW); shownSeq = seq; at.lettersW = lettersW; }
        const preVis = t < T.mutation ? preIn * (1 - ramp(t, T.mutation - .8, T.mutation - .2)) : t < T.minor ? ramp(t, ...MUT.shown) * preOut : preAgain;
        pre.pose(points).view(pxPerA).opacity(preVis);
        at.sequence = seq;

        // The mutant, below the wild type, in step 6.
        const mutShown = (t >= T.mutation ? ramp(t, ...MUT.shown) : 0) * preOut;
        // Its G becomes A: the base's colour crossfades (the letter counted as changed halfway through).
        const swap = ramp(t, MUT.swap, MUT.swap + .6), mutKey = swap <= 0 ? 'G' : swap >= 1 ? 'A' : swap.toFixed(3);
        if (mutKey !== at.mutKey) {
          mutant.letters(swap >= 1 ? SEQ.mutant : SEQ.major, 1); at.mutKey = mutKey;
          if (swap > 0 && swap < 1) { mutant.stubs.setColorAt(E1, new THREE.Color(BASES.G).lerp(new THREE.Color(BASES.A), swap)); mutant.stubs.instanceColor.needsUpdate = true; }
        }
        if (mutShown > 0) mutant.pose(mutStraight);
        mutant.view(pxPerA).opacity(mutShown);

        // Logos.
        const preShown = pre.alpha;
        logos.major.place(points, majorGrow(t), preShown);
        logos.minorAC.place(points, minorACGrow(t), preShown);
        logos.minorGU.place(points, minorGUGrow(t), preShown);
        // The junctions, ruled through the logos while the major and minor logos show.
        const ruled = Math.max(majorGrow(t)('five', 3), minorACGrow(t)(), minorGUGrow(t)()) * preShown;
        fade(barMaterial, ruled > .01 ? clamp(ruled * 1.4) : 0);
        bars.forEach(b => {
          const x = (points[b.i - 1].x + points[b.i].x) / 2, top = -BASE - H * clamp(ruled * 1.4) - 1.5, bottom = 4.5;
          b.mesh.position.set(x, (top + bottom) / 2, points[b.i].z); b.mesh.scale.set(1, bottom - top, 1); b.mesh.visible = ruled > .01;
        });
        // The branch A, marked over its column.
        const mark = t < T.minor ? (t > T.branch ? ramp(t, T.branch + 3.4, T.branch + 4.2) * (1 - ramp(t, T.mutation - .8, T.mutation - .2)) : 0)
          : Math.max(majorGrow(t)('branch', 7), minorACGrow(t)(), minorGUGrow(t)());
        marker.position.set(points[BR].x, points[BR].y - BASE - H * clamp(mark) - 4, points[BR].z); marker.scale.setScalar(Math.max(.001, clamp(mark)));
        fade(markerMaterial, clamp(mark) * preShown); marker.visible = mark * preShown > .01;

        at.time = t; at.joined = t >= SP.join && t < T.minor; at.away = lastAway; at.bond = bond.w;
        at.mutantLetter = t < MUT.swap + .3 ? 'G' : 'A';
      },
      annotate(t, {label, tag, bracket}) {
        const preW = i => pre.world(i), mutW = i => mutant.world(i), ink = c => ({color: hex(c)});
        const INTRON = lighter(SPLICING.intron, .5), EXON = SPLICING.exon;
        if (t < T.sites) {
          if (t > 1.6 && t < 6) { label(V(gx(30), YG - 9, 0), 'Gene', 'Exons and an intron', ink(STRANDS.coding)); label(mrna.centre(), 'Mature mRNA', 'Its exons only', {...ink(EXON), below: true}); }
          else if (t > 6.2 && t < 10.4) { label(V(gx(4), YG - 9, 0), 'Exon', 'Found in the mRNA', ink(EXON)); label(V(gx(40), YG - 9, 0), 'Intron', 'Not in the mRNA', ink(INTRON)); }
          else if (t > 10.6) { label(V(gx(E1) - RISE / 2, YG - 9, 0), 'Exon–intron junction', 'Where the mRNA’s match breaks off', ink(EXON)); tag(V(gx(E2) - RISE / 2, YG - 9, 0), 'Junction', ink(EXON)); }
          return;
        }
        if (t < T.rule) {
          if (pre.alpha < .9) return;
          if (t < T.sites + 6.4) label(preW(35), 'Pre-mRNA', 'The intron transcribed with the exons', ink(INTRON));
          else {
            label(preW(E1).lerp(preW(E1 - 1), .5), '5′ splice site', 'Left, or donor', {...ink(EXON), side: 'left'});
            if (t > T.sites + 7.6) label(preW(E2).lerp(preW(E2 - 1), .5), '3′ splice site', 'Right, or acceptor', {...ink(EXON), side: 'left'});
            if (t > T.sites + 9) bracket(preW(E1), preW(E2 - 1), 'Intron · 5′ → 3′');
          }
          return;
        }
        const top = (site, k) => logos.major.top(site, k);
        // (Steps 3–5 name the pre-mRNA and its logos while they show: none as they fade before step 6.)
        if (t < T.mutation && pre.alpha < .9) return;
        if (t < T.logo) {
          if (t > T.rule + 9) {
            label(top('five', 3).lerp(top('five', 4), .5), 'GU', 'The intron’s first two · GT in the DNA', {...ink(BASES.G), side: 'left'});
            label(top('three', 10).lerp(top('three', 11), .5), 'AG', 'Its last two · AG in the DNA', {...ink(BASES.A), side: 'right'});
          }
          return;
        }
        if (t < T.branch) {
          if (t > T.logo + 3.4) label(top('five', 4), '5′ splice site', 'Mostly CAG|GUAAGU', {...ink(EXON), side: 'left'});
          if (t > T.logo + 6.8) label(top('three', 6), '3′ splice site', 'Pyrimidines, then CAG|G', {...ink(EXON), side: 'right'});
          if (t > T.logo + 9.6) label(top('five', 5), 'Letter height', 'How often each base is found', ink(BASES.A));
          return;
        }
        if (t < T.mutation) {
          if (t > T.branch + 3.6) label(marker.position.clone().add(V(0, -2, 0)), 'Branch site A', 'Essential for the reaction', {color: '#ff8a7e'});
          if (t > T.branch + 5.4) bracket(preW(BR).add(V(0, 9, 0)), preW(E2 - 1).add(V(0, 9, 0)), '21 nucleotides');
          if (t > T.branch + 7.4) label(top('branch', 2), 'Branch site', 'UACUAAC in yeast; less defined in animals', {...ink(INTRON), side: 'left'});
          if (t > T.branch + 9.4) label(preW((PY[0] + PY[1]) >> 1), 'Polypyrimidine tract', 'Between branch site and 3′ splice site', {...ink(BASES.C), below: true});
          return;
        }
        if (t < T.minor) {
          if (mutant.alpha < .9) return;
          if (t < SP.fold[0]) { tag(preW(0).add(V(-4, -11, 0)), 'Wild type', ink(EXON)); tag(mutW(0).add(V(-4, -11, 0)), 'Mutant', ink(EXON)); }
          if (t < MUT.swap + .3) { if (t > MUT.shown[1]) tag(preW(E1).lerp(preW(E1 + 1), .5).add(V(0, -9, 0)), 'GU', ink(BASES.G)); }
          else if (t < SP.fold[0]) label(mutW(E1), 'Point mutation', 'G → A at the 5′ splice site', ink(BASES.A));
          // (Where the G is going: the branch A, tagged as the G sets off and until the lariat is named.)
          if (t > SP.fold[0] - .4 && t < SP.cut[0] + .4) tag(preW(BR).add(V(0, -9, 0)), 'Branch A', {color: '#ff8a7e'});
          if (t > SP.cut[0] + .4 && t < SP.slide[0]) label(preW(E1).lerp(preW(BR), .5), 'Lariat', 'The intron’s 5′ end joined to the branch\u00a0A', {...ink(INTRON), side: 'left'});
          if (t > SP.away[1] - .6) {
            label(preW(E2), 'Spliced', 'Its exons joined', ink(EXON));
            label(mutW(30), 'Not spliced', 'The mutant keeps its intron', {...ink(INTRON), below: true});
          }
          return;
        }
        if (pre.alpha < .9) return;
        const minorTop = (l, site, k) => logos[l].top(site, k);
        if (t > T.minor + 4.2 && t < T.minor + 8.4) label(top('five', 4), 'U2-type intron', 'The major class: GU…AG', ink(EXON));
        else if (t > ACt[0] + 1.6 && t < ACt[1]) {
          label(minorTop('minorAC', 'five', 4), 'U12-type intron', 'First identified by AU…AC ends', ink(SPLICING.U12));
          tag(minorTop('minorAC', 'three', 10).lerp(minorTop('minorAC', 'three', 11), .5).add(V(0, -2, 0)), 'AC', ink(BASES.C));
        } else if (t > GUt + 1.6) {
          label(minorTop('minorGU', 'five', 4), 'U12-type intron', 'Most have GU…AG ends', ink(SPLICING.U12));
          label(minorTop('minorGU', 'branch', 6), 'U12-type branch site', 'UCCUUAAC', {...ink(INTRON), side: 'right'});
        }
      },
    };

    // Each shot's box: fitted round the points of what its steps show, sampled through them (seen from DIR, with room
    // above for the labels).
    const around = (from, to, o = {}) => {
      const pts = [];
      for (let t = from; t <= to + 1e-6; t += .5) { content.update(t, {pxPerA: 1}); pts.push(...shownPoints().map(p => V(...p))); }
      return boxAround(pts, DIR, {fov: 26, margin: 6, above: 14, ...o});
    };
    at.frames = {
      junction: around(1.5, T.sites - .5, {above: 18}),
      straight: around(T.sites + 1, T.rule, {above: 22}),
      row: around(T.rule + 4.6, T.mutation - .2, {above: 16}),
      pair: around(T.mutation + 2.6, T.minor - 1, {above: 12}),
    };
    content.update(0, {pxPerA: 1});
    return content;
  },
});
