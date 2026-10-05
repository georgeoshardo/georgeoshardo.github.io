// Scene: the spliceosome cycle, from cryo-EM structures of human spliceosomes caught at each stage (pre-A 7VPX, pre-B
// 6QX9, B 6AHD, Bact 8I0R, C 5YZG, C* 5XJC, P 6QDV, ILS 6ID1). All are in the C* complex's frame: each is superposed on
// the rigid core of its Prp8 and Snu114 (pre-A, which has neither, on the SF3b core of its U2 snRNP, placed on
// pre-B's), so the camera stays put while snRNPs and proteins join and leave. Proteins are coarse envelopes from their
// Cα atoms, grouped by snRNP (each snRNP its colour throughout, its Sm or Lsm ring in the ring colours); the snRNAs and
// the pre-mRNA (exons orange, intron grey-violet) are strands, their base pairs drawn across. A state changes to the
// next by a cross-dissolve, the new envelope fading in over the old, then the old fading out under it; what leaves
// recedes into the dark and fades fully out, and what joins comes forward out of it. A component whose structure is
// the same in both states but placed elsewhere (pre-A's U1 snRNP, docked differently in pre-B) is carried to its new
// place as it dissolves. From activation to the release of the joined exons, a cutaway square to the view opens the
// spliceosome to its RNA core.
import * as THREE from 'three';
import {runScene} from '../shared/scene_player.mjs';
import {loadSurfaceSet, surfaceGeometry, proteinMaterial, fade} from '../shared/molecules.mjs';
import {SPLICING, COMPLEMENT, createCartoon, createStrand, pairTip, stubColour} from '../shared/rna.mjs';
import {boxAround} from '../shared/camera.mjs';
import {fitRigid} from '../shared/fit.mjs';
import {ramp, smooth, clamp, mix} from '../shared/ease.mjs';

const V = (...a) => new THREE.Vector3(...a);
const hex = c => '#' + c.toString(16).padStart(6, '0');

// The states, in order: their asset set (assets/spliceosome_<key>), PDB entry and name.
const STATES = [
  {key: 'prea', pdb: '7VPX', name: 'Pre-A complex'}, {key: 'preb', pdb: '6QX9', name: 'Pre-B complex'},
  {key: 'b', pdb: '6AHD', name: 'B complex'}, {key: 'bact', pdb: '8I0R', name: 'B<sup>act</sup> complex'},
  {key: 'c', pdb: '5YZG', name: 'C complex'}, {key: 'cstar', pdb: '5XJC', name: 'C* complex'},
  {key: 'p', pdb: '6QDV', name: 'P complex'}, {key: 'ils', pdb: '6ID1', name: 'ILS complex'},
];
// Components keep their identity (and colour) from state to state: the meshes (part names) and strands (names) of
// each. U6 snRNA stays when its Lsm ring leaves, and SF3a/SF3b leave the U2 snRNP, so each is its own component; the
// joined exons (the P complex's own chain) leave the intron lariat behind. They are the C* complex's 5′ exon, joined
// in place (`from`): they dissolve in over the pre-mRNA rather than arriving out of the dark.
const OTHER = {tri: 0x9c8fa8, ntc: 0xa7abb0, other: 0x6f7684};  // splicing factors in greys, the snRNPs in colour
const COMPONENTS = {
  u1: {parts: ['U1 snRNP', 'U1 Sm ring'], strands: ['U1 snRNA'], colour: SPLICING.U1, name: 'U1'},
  u2: {parts: ['U2 snRNP', 'U2 Sm ring'], strands: ['U2 snRNA'], colour: SPLICING.U2, name: 'U2'},
  sf3: {parts: ['SF3a and SF3b'], strands: [], colour: SPLICING.U2, name: 'SF3a and SF3b'},
  u4: {parts: ['U4 snRNP', 'U4 Sm ring'], strands: ['U4 snRNA'], colour: SPLICING.U4, name: 'U4'},
  lsm: {parts: ['U6 Lsm ring'], strands: [], colour: SPLICING.Lsm, name: 'Lsm ring'},
  u6: {parts: [], strands: ['U6 snRNA'], colour: SPLICING.U6, name: 'U6'},
  u5: {parts: ['U5 snRNP', 'U5 Sm ring'], strands: ['U5 snRNA'], colour: SPLICING.U5, name: 'U5'},
  tri: {parts: ['Tri-snRNP proteins'], strands: [], colour: OTHER.tri, name: 'Tri-snRNP proteins'},
  ntc: {parts: ['Prp19 complex'], strands: [], colour: OTHER.ntc, name: 'Prp19 complex'},
  other: {parts: ['Other proteins'], strands: [], colour: OTHER.other, name: 'Other proteins'},
  premrna: {parts: [], strands: ['pre-mRNA', 'pre-mRNA I', 'pre-mRNA K'], colour: SPLICING.intron, name: 'pre-mRNA'},
  mrna: {parts: [], strands: ['pre-mRNA E'], colour: SPLICING.exon, name: 'mRNA', from: 'premrna'},
};
const SNRNPS = ['u1', 'u2', 'u4', 'u5', 'u6'];
// The pre-mRNA's residues are numbered from the intron's first nucleotide (G1): the 5′ exon is 0 and below. The P
// complex's ligated exons (chain E) number the 3′ exon's first nucleotides 1 and 2.
const isExon = (s, num) => s.name === 'pre-mRNA E' || num <= 0;
// Each state's branch-site adenosine (its 2′–5′ bond to G1 built in C, C*, P and ILS), and the residue the branch-site
// label names in pre-A, whose branch adenosine itself is not modelled.
const BRANCH = {prea: 37, preb: 100, b: 144, bact: 97, c: 144, cstar: 144, p: 97, ils: 144};
const LARIAT = new Set(['c', 'cstar', 'p', 'ils']);

// Times (s): each state's step starts at T[i]; the change from the state before begins 0.4 s ahead and takes 3.2 s.
const T = [0, 15, 30, 44, 59, 74, 88, 102], END = 120, LEAD = .4, CHANGE = 3.2;
const DRIFT = {back: 150, out: 45};  // how far a leaving component recedes (Å) and moves out to the side
const CUT = {open: [T[3] + 5, T[3] + 7.5], close: [T[7] + 5.5, T[7] + 8], depth: 18};  // the cutaway's times and depth
const RECYCLE = [END - 7, END - 1.5];  // the ILS complex comes apart, its snRNPs freed
const PULL = {blend: 3.2, lead: .8};   // the camera's move from pre-A to the whole cycle's frame (begins blend × lead early)

const NOTES = {first: 'initial-splice-site-recognition-and-the-e-complex', snrnas: 'snrnas-are-required-for-splicing',
  parts: 'the-spliceosome-and-its-components', lariat: 'splicing-proceeds-through-a-lariat-intermediate'};
const steps = [
  {t: T[0], nav: 'U1 and U2 join', topic: STATES[0].name, title: 'U1 and U2 bind<br>the pre-mRNA.', notes: NOTES.first,
    text: 'The very first step in splicing is the binding of the U1 snRNP to the 5′ splice site: the single-stranded 5′ end of U1 snRNA base pairs with it. The U2 snRNP joins at the branch site, which pairs with U2 snRNA.'},
  {t: T[1], nav: 'The tri-snRNP joins', topic: STATES[1].name, title: 'U4/U6 and U5<br>join as one particle.', notes: NOTES.snrnas,
    text: 'The spliceosome is formed by the sequential assembly of snRNPs and other proteins onto the pre-mRNA. The U4 and U6 snRNPs, together as the U4/U6 di-snRNP, arrive with U5: all five snRNPs are now in place.'},
  {t: T[2], nav: 'U1 leaves', topic: STATES[2].name, title: 'U1 hands on the<br>5′ splice site and leaves.', notes: NOTES.parts,
    text: 'The 5′ splice site passes from U1 snRNA to U6 snRNA, and the U1 snRNP leaves the spliceosome.'},
  {t: T[3], nav: 'U4 leaves', topic: STATES[3].name, title: 'U4 leaves: the spliceosome<br>is activated.', notes: NOTES.parts,
    text: 'U4 leaves, freeing U6 snRNA to pair with U2 snRNA at the heart of the spliceosome, and the Prp19 complex joins. The spliceosome relies heavily on RNA–RNA interactions, between the snRNAs and the pre-mRNA and among the snRNAs themselves.'},
  {t: T[4], nav: 'First reaction', topic: STATES[4].name, title: 'The branch site<br>attacks the 5′ splice site.', notes: NOTES.lariat,
    text: 'First transesterification: the 2′-OH of the branch-site adenine attacks the 5′ splice site. The intron’s 5′ end is cut from the 5′ exon and joined to that adenine by a 2′–5′ phosphodiester bond, forming a lariat.'},
  {t: T[5], nav: 'Ready to join', topic: STATES[5].name, title: 'The 5′ exon waits<br>for the 3′ splice site.', notes: NOTES.lariat,
    text: 'The spliceosome rearranges for the second reaction. The 5′ exon, its 3′-OH group newly freed, is held in place beside the lariat.'},
  {t: T[6], nav: 'Exons joined', topic: STATES[6].name, title: 'The exons<br>are joined.', notes: NOTES.lariat,
    text: 'Second transesterification: the 3′-OH of the 5′ exon attacks the 3′ splice site. This joins the two exons together (ligation) and releases the intron, still in its lariat form.'},
  {t: T[7], nav: 'Release', topic: STATES[7].name, title: 'The mRNA leaves;<br>the snRNPs are used again.', notes: NOTES.lariat, hold: 1.1,
    text: 'The joined exons leave. The intron lariat is debranched, converting it back to a linear RNA, which is rapidly degraded in the nucleus; U2, U5 and U6 are freed to splice again.'},
];

// The view: one direction for the whole cycle (from the spliceosome towards the camera; world −y is up on screen).
const DIR = V(.25, -.25, -1).normalize();
const at = {};
// A strand is drawn before the see-through envelopes and keeps writing depth while it fades (outline first, then the
// tube, its caps and its bonds), so neither a see-through envelope behind it nor its own far side paints over it:
// three.js orders see-through objects by their middles and does not sort a mesh's own triangles, so a fading strand
// would otherwise jump in front of or behind an envelope, or show its crossings and bonds in the wrong order, until
// the moment it turns opaque.
const strandFirst = group => group.traverse(o => { if (o.isMesh) { o.renderOrder = o.material.userData.noAO ? -2 : -1; o.material.depthWrite = true; } });
// A nucleotide modelled without its base and unpaired (a backbone trace, as 3CW1's U1 snRNA) gets no bond: at zero
// length a bond is a flat disc whose shading is NaN, which shows as a black dot wherever a see-through surface is drawn
// over it (its own tube as the strand fades).
const NO_BOND = new THREE.Matrix4().makeScale(0, 0, 0);
const noFlatBonds = (cc, points, tips) => {
  tips.forEach((t, i) => { if (t.distanceToSquared(points[i]) < 1e-6) cc.bonds.setMatrixAt(i, NO_BOND); });
  cc.bonds.instanceMatrix.needsUpdate = true;
};

runScene({
  pageTitle: 'The spliceosome cycle · RNA splicing and processing', eyebrow: 'The spliceosome',
  links: [{href: 'index.html', text: 'All scenes'}],
  steps, duration: END, notesPage: 'notes.html', fov: 26,
  // Pre-A, the smallest, is framed alone; from pre-B on, one frame holds every state, so the camera stays put while
  // snRNPs and proteins come and go.
  shots: [{t: 0, frame: () => at.shots[0]}, {t: T[1], ...PULL, frame: () => at.shots[1]}],
  async build({world, progress, renderer}) {
    const loaded = STATES.map(() => 0);
    const sets = await Promise.all(STATES.map((s, i) => loadSurfaceSet(`assets/spliceosome_${s.key}.json`, `assets/spliceosome_${s.key}.bin`,
      p => { loaded[i] = p; progress(loaded.reduce((a, b) => a + b, 0) / STATES.length); })));
    renderer.localClippingEnabled = true;
    // The cutaway: everything nearer the camera than this plane is cut away (proteins only; the RNA stays whole).
    const cut = new THREE.Plane(DIR.clone().negate(), 1e4);

    // ---------- Each state's components ----------
    const groups = STATES.map(() => ({})), all = [];
    sets.forEach((set, si) => {
      const key = STATES[si].key, strands = set.meta.strands, byChain = new Map(strands.map(s => [s.chain, s]));
      for (const [id, c] of Object.entries(COMPONENTS)) {
        const g = new THREE.Group(), meshes = [], strandsOf = [], residues = new Map();
        for (const rec of set.meta.meshes.filter(r => c.parts.includes(r.name))) {
          const colour = rec.name.includes('Lsm') ? SPLICING.Lsm : rec.name.includes('Sm ring') ? SPLICING.Sm : c.colour;
          const m = new THREE.Mesh(surfaceGeometry(rec, set.buffer), proteinMaterial(colour));
          m.material.clippingPlanes = [cut]; m.material.side = THREE.DoubleSide;
          // The cut faces keep their snRNP's colour, a shade deeper than its surface, with a warm edge.
          const u = m.material.userData.uniforms; u.uCut.value = .8; u.uCap.value.set(colour).multiplyScalar(.6);
          m.userData.part = rec.name; g.add(m); meshes.push(m);
        }
        for (const s of strands.filter(s => c.strands.includes(s.name))) {
          const P = s.backbone.map(b => V(...b)), n = P.length;
          s.numbers.forEach((num, k) => residues.set(`${s.name}:${num}`, P[k]));
          // Watson–Crick partners only (the export also finds G1 beside the branch A of a lariat).
          const mate = k => { const p = s.partner[k], other = p && byChain.get(p[0]);
            return other && COMPLEMENT[s.sequence[k]]?.includes(other.sequence[p[1]]) ? V(...other.backbone[p[1]]) : null; };
          // Pieces: runs of consecutive residues no more than 9 Å apart (unmodelled stretches between them), and once
          // the 5′ exon is cut from the intron (C onwards), exon and intron apart.
          const runs = [[0, 1]];
          for (let k = 1; k < n; k++) {
            const cutHere = LARIAT.has(key) && isExon(s, s.numbers[k - 1]) !== isExon(s, s.numbers[k]);
            if (P[k - 1].distanceTo(P[k]) > 9 || cutHere) runs.push([k, k + 1]); else runs[runs.length - 1][1] = k + 1;
          }
          const drawn = runs.filter(([a, b]) => b - a > 1);
          if (id === 'premrna' || id === 'mrna') {
            // The pre-mRNA: one strand, exons orange and intron grey-violet, the lariat's 2′–5′ bond drawn.
            const st = createStrand(g, n, {colour: SPLICING.intron, radius: 2.1, samples: 3});
            st.stretches(s.numbers.map((num, k) => [k, k + 1, isExon(s, num) ? SPLICING.exon : SPLICING.intron]));
            st.pieces(drawn.map(r => [r]));
            // (Each pair's partner a live point, so a stretch carried with its snRNA keeps its pairs: see carries.)
            const mates = P.map((p, k) => { const m = mate(k); if (m) st.pair(k, m, 1); return m; });
            if (LARIAT.has(key) && s.numbers.includes(1) && s.numbers.includes(BRANCH[key])) {
              const a = s.numbers.indexOf(BRANCH[key]), b = s.numbers.indexOf(1);
              st.link(a, b, {colour: SPLICING.intron, radius: 1.6});
              g.userData.linkMid = P[a].clone().lerp(P[b], .5);
            }
            // (`now`: where its nucleotides are drawn, home but while a stretch is carried; points() in the component's
            // frame, as the strand is placed in it.)
            const now = P.map(p => p.clone());
            st.pose(P); strandsOf.push({opacity: v => { st.opacity(v); strandFirst(st.group); }, view: px => st.view(px), points: () => drawn.flatMap(([a, b]) => now.slice(a, b)).map(p => p.clone().applyQuaternion(st.group.quaternion).add(st.group.position)),
              strand: st, numbers: s.numbers, home: P, now, mates, matesHome: mates.map(m => m?.clone())});
          } else {
            // An snRNA, as structures' RNA is drawn: each base's bond towards its base, or to the middle of its pair.
            for (const [a, b] of drawn) {
              const piece = P.slice(a, b), cc = createCartoon(g, b - a, {colour: c.colour, rung: stubColour(c.colour).getHex(), radius: 1.7, samples: 3});
              const tips = piece.map((p, i) => {
                const k = a + i, m = mate(k), base = V(...s.base[k]);
                if (base.distanceTo(p) < .5) return m ? p.clone().lerp(m, .5) : p.clone();
                return pairTip(V(), p, base, m, 1);
              });
              cc.pose(piece, tips); noFlatBonds(cc, piece, tips);
              strandsOf.push({opacity: v => { cc.opacity(v); strandFirst(cc.group); }, view: px => cc.view(px), points: () => piece});
            }
          }
        }
        if (!meshes.length && !strandsOf.length) continue;
        // Where the component is: the middle of its envelopes and strands (for its tag, and the way it leaves).
        const sample = [];
        for (const m of meshes) { const a = m.geometry.attributes.position; for (let k = 0; k < a.count; k += 7) sample.push(V().fromBufferAttribute(a, k)); }
        for (const st of strandsOf) sample.push(...st.points().map(p => p.clone()));
        const centre = sample.reduce((s, p) => s.add(p), V()).divideScalar(sample.length);
        g.userData = {...g.userData, id, state: si, meshes, strands: strandsOf, centre, sample, residues, shown: -1};
        // Bact: a U6 nucleotide paired with U2 snRNA (their helix at the catalytic centre).
        if (id === 'u6' && key === 'bact') {
          const u6 = strands.find(x => x.name === 'U6 snRNA'), u2 = strands.find(x => x.name === 'U2 snRNA');
          const ks = u6.partner.map((p, k) => p && p[0] === u2.chain ? k : -1).filter(k => k >= 0);
          g.userData.pairing = V(...u6.backbone[ks[Math.floor(ks.length / 2)]]);
        }
        world.add(g); groups[si][id] = g; all.push(g);
      }
    });
    // Which snRNPs each state has (their snRNA or proteins), for the tags and the tests.
    at.present = groups.map(gs => SNRNPS.filter(id => gs[id]).map(id => COMPONENTS[id].name));

    // ---------- Carries ----------
    // A component whose snRNA is the same model in two states (fitting rigidly within 1 Å) but placed more than 20 Å
    // away in the next (pre-A's U1 snRNP, 262 Å from where pre-B docks it) is carried there along one rigid path as
    // it dissolves, both copies together, with the pre-mRNA it holds (the 5′ splice site paired with U1), so the
    // particle moves instead of fading out in one place and in at another.
    const carries = STATES.map(() => []);
    const near = (pa, pb, F, d) => pa.clone().applyMatrix4(F).distanceTo(pb) < d;
    for (let i = 1; i < STATES.length; i++) for (const id of Object.keys(COMPONENTS)) {
      const a = groups[i - 1][id], b = groups[i][id];
      if (!a || !b || id === 'premrna') continue;
      const keys = [...a.userData.residues.keys()].filter(k => b.userData.residues.has(k));
      if (keys.length < 10) continue;
      const A = keys.map(k => a.userData.residues.get(k)), B = keys.map(k => b.userData.residues.get(k)), F = fitRigid(A, B);
      const rms = Math.sqrt(A.reduce((s, p, k) => s + p.clone().applyMatrix4(F).distanceToSquared(B[k]), 0) / A.length);
      if (rms > 1 || A.reduce((s, p, k) => s + p.distanceTo(B[k]), 0) / A.length < 20) continue;
      const c = {a, b, pos: V(), q: new THREE.Quaternion(), from: A.reduce((s, p) => s.add(p), V()).divideScalar(A.length), ride: [], riding: []};
      F.decompose(c.pos, c.q, V()); c.to = c.from.clone().applyMatrix4(F); c.qInv = c.q.clone().invert();
      // The pre-mRNA: the old state's strands that lie on the new state's residues once carried (they ride whole),
      // and the new state's nucleotides they cover (moved with the carry, their pairs' partners too).
      const preA = groups[i - 1].premrna?.userData.strands ?? [], preB = groups[i].premrna?.userData.strands ?? [];
      const atB = new Map(preB.flatMap(r => r.numbers.map((num, k) => [num, r.home[k]])));
      for (const r of preA) {
        const on = r.numbers.filter(num => atB.has(num));
        if (on.length >= 3 && on.every(num => near(r.home[r.numbers.indexOf(num)], atB.get(num), F, 2))) c.ride.push(r.strand.group);
      }
      const rode = new Set(preA.filter(r => c.ride.includes(r.strand.group)).flatMap(r => r.numbers));
      for (const r of preB) { const ks = r.numbers.flatMap((num, k) => rode.has(num) ? [k] : []); if (ks.length) c.riding.push({r, ks}); }
      carries[i].push(c);
    }
    at.carried = carries.map(cs => cs.map(c => c.a.userData.id));
    // The path bows away from the camera and to the screen's left (by these at its middle), so U1 passes behind the
    // U2 snRNP and clear of the tri-snRNP coming in (a straight path runs through SF3b and U4/U6).
    const AROUND = {back: 150, left: 80}, across = V(0, -1, 0).cross(DIR).normalize();
    const qs = new THREE.Quaternion(), ts = V(), tmp = V();
    // Carried by s (0 the old state's place … 1 the new one's): the old copy by the rigid move so far (turned about
    // its middle, which moves along the bowed path), the new copy by that move after undoing the whole one.
    const carry = (c, s) => {
      qs.identity().slerp(c.q, s); ts.lerpVectors(c.from, c.to, s).addScaledVector(DIR, -AROUND.back * 4 * s * (1 - s)).addScaledVector(across, -AROUND.left * 4 * s * (1 - s)).sub(tmp.copy(c.from).applyQuaternion(qs));
      c.a.quaternion.copy(qs); c.a.position.copy(ts);
      for (const g of c.ride) { g.quaternion.copy(qs); g.position.copy(ts); }
      c.b.quaternion.copy(qs).multiply(c.qInv); c.b.position.copy(ts).sub(tmp.copy(c.pos).applyQuaternion(c.b.quaternion));
      for (const {r, ks} of c.riding) {
        for (const k of ks) { r.now[k].copy(r.home[k]).applyQuaternion(c.b.quaternion).add(c.b.position); r.mates[k]?.copy(r.matesHome[k]).applyQuaternion(c.b.quaternion).add(c.b.position); }
        r.strand.pose(r.now);
      }
      c.moved = s > 0;
    };
    // At rest (outside its change): the groups are placed by `offset`, the riding strands at home.
    const rest = c => {
      if (!c.moved) return; c.moved = false;
      for (const g of c.ride) { g.quaternion.identity(); g.position.set(0, 0, 0); }
      for (const {r, ks} of c.riding) { for (const k of ks) { r.now[k].copy(r.home[k]); r.mates[k]?.copy(r.matesHome[k]); } r.strand.pose(r.now); }
    };

    // ---------- The camera ----------
    // Box shots from one direction: pre-A's envelopes and strands, then every later state's.
    const pts = all.flatMap(g => g.userData.sample.filter((p, k) => k % 3 === 0));
    const of = list => list.flatMap(g => g.userData.sample.filter((p, k) => k % 3 === 0));
    at.shots = [{...boxAround(of(Object.values(groups[0])), DIR, {margin: 10, fov: 26}), fill: .95},
      {...boxAround(of(groups.slice(1).flatMap(gs => Object.values(gs))), DIR, {margin: 8, fov: 26}), fill: .96}];
    at.shot = at.shots[1];
    // The cutaway's depth: the core (the C* complex's RNA) a little towards the camera; and the front, where it cuts nothing.
    const core = groups[5].u2.userData.centre.clone().add(groups[5].u6.userData.centre).multiplyScalar(.5);
    const front = Math.max(...pts.map(p => p.dot(DIR))) + 20, deep = core.dot(DIR) + CUT.depth;
    // The screen's sideways directions, for the way a component leaves: out from the middle of the view, square to it.
    const side = p => { const v = p.clone().sub(at.shot.target); v.addScaledVector(DIR, -v.dot(DIR)); return v.lengthSq() > 1 ? v.normalize() : V(1, 0, 0); };
    for (const g of all) g.userData.away = side(g.userData.centre);

    // For tests (?debug=1): world points of what is drawn now (envelope points the cutaway leaves, and every strand's
    // nucleotides), the states with a lariat's 2′–5′ bond, and each state's pre-mRNA pairs with U1, U2 and U6.
    at.shown = () => live().flatMap(g => {
      const out = [];
      for (const m of g.userData.meshes) { const a = m.geometry.attributes.position; for (let k = 0; k < a.count; k += 11) { const p = g.localToWorld(V().fromBufferAttribute(a, k)); if (p.dot(DIR) <= cut.constant) out.push(p.toArray()); } }
      for (const st of g.userData.strands) st.points().forEach((p, k) => { if (k % 2 === 0) out.push(g.localToWorld(p.clone()).toArray()); });
      return out;
    });
    const live = () => all.filter(g => g.visible && g.userData.shown > 0);
    at.lariats = STATES.filter((s, i) => groups[i].premrna?.userData.linkMid).map(s => s.key);
    at.pairs = sets.map(set => {
      const pre = set.meta.strands.filter(s => s.name.startsWith('pre-mRNA')), chains = new Map(set.meta.strands.map(s => [s.chain, s.name]));
      const out = {};
      for (const s of pre) s.partner.forEach((p, k) => { const n = p && chains.get(p[0]); if (n && n.endsWith('snRNA') && COMPLEMENT[s.sequence[k]]?.includes(set.meta.strands.find(x => x.chain === p[0]).sequence[p[1]])) out[n] = (out[n] || 0) + 1; });
      return out;
    });

    // ---------- Posing ----------
    const stateAt = t => { let i = 0; for (let k = 1; k < STATES.length; k++) if (t >= T[k] - LEAD) i = k; return i; };
    // The cut faces (cross-section caps) of envelopes dissolving into each other show through the dissolve while the
    // cutaway is open (the shared fade then draws such an envelope in one pass, writing depth, so its cap fades with
    // it and the new state's cap takes over from the old one's without a jump); otherwise a fading envelope is drawn
    // see-through, its inside lit rather than capped. (uCapOn is set before the fade, which reads it.)
    let cutting = false;
    const opacity = (g, v) => {
      v = v < .002 ? 0 : v > .998 ? 1 : v;
      const cap = v === 1 || (cutting && g.userData.order === 0) ? 1 : 0;
      if (v === g.userData.shown && cap === g.userData.cap) return; g.userData.shown = v; g.userData.cap = cap;
      for (const m of g.userData.meshes) { m.material.userData.uniforms.uCapOn.value = cap; fade(m.material, v); }
      for (const st of g.userData.strands) st.opacity(v);
      g.visible = v > 0;
    };
    // While the cutaway is open a dissolving envelope writes depth as it fades (its cap showing), so a faint one would
    // cut a hole in a see-through envelope drawn after it behind it. What joins or leaves is drawn see-through (no
    // cap, no depth) before the dissolving envelopes (after the strands), so it never cuts into them, nor they into
    // it; and while the cutaway is open it recedes out of the cut before it fades (SF3a/SF3b leaving the C complex),
    // so its cut faces never turn from cap to open as the fade begins.
    const order = (g, k) => { if (g.userData.order === k) return; g.userData.order = k; for (const m of g.userData.meshes) m.renderOrder = k; };
    // How far a component's change must go before receding has carried its envelopes behind the cut (0: never cut;
    // its strands are not cut).
    const clearOf = g => {
      let top = -Infinity;
      for (const m of g.userData.meshes) { const a = m.geometry.attributes.position; for (let k = 0; k < a.count; k++) top = Math.max(top, a.getX(k) * DIR.x + a.getY(k) * DIR.y + a.getZ(k) * DIR.z); }
      const over = top - deep + 6; if (over <= 0) return 0;
      let w = 0; while (w < 1 && DRIFT.back * smooth(w) < over) w += .01; return w < .8 ? w : 0; };
    for (const g of all) g.userData.clear = clearOf(g);
    // A component out of place by w (0 home … 1 gone): receded into the dark and moved out to the side.
    const offset = (g, w, side = 1) => { g.quaternion.identity(); g.position.copy(DIR).multiplyScalar(-DRIFT.back * w).addScaledVector(g.userData.away, DRIFT.out * w * side); };

    return {
      groups, at,  // for tests (?debug=1)
      update(t, {pxPerA = 1} = {}) {
        const i = stateAt(t), w = i === 0 ? 1 : ramp(t, T[i] - LEAD, T[i] - LEAD + CHANGE);
        // The cutaway opens after activation and closes once the joined exons have gone.
        const open = ramp(t, ...CUT.open) * (1 - ramp(t, ...CUT.close));
        cut.constant = open > 0 ? mix(front, deep, smooth(open)) : 1e4;  // kept: points with DIR·p below it
        cutting = open > 0;
        // The loop's start: the first state comes forward out of the dark; at the end, the ILS complex comes apart.
        const arrive = i === 0 ? ramp(t, 0, 2.2) : 1, apart = i === STATES.length - 1 ? ramp(t, RECYCLE[0], RECYCLE[1]) : 0;
        const now = groups[i], before = i > 0 ? groups[i - 1] : {}, live = new Set();
        for (const id of Object.keys(COMPONENTS)) {
          const a = before[id], b = now[id], from = COMPONENTS[id].from;
          if (b) live.add(b); if (a && w < 1) live.add(a);
          if (a && b && w < 1) {
            // Cross-dissolve: the new envelope fades in over the old, then the old fades out under it (each half eased,
            // so neither turns opaque or starts to fade with a jump).
            order(a, 0); order(b, 0); opacity(b, smooth(2 * w)); opacity(a, w < .5 ? 1 : smooth(2 - 2 * w)); offset(a, 0); offset(b, 0);
          } else if (b && !a && w < 1 && from && before[from]) {
            // Made in place from a component of the state before (the joined exons): dissolved in over it.
            order(b, 0); opacity(b, smooth(2 * w)); offset(b, 0);
          } else if (b && !a) {
            // (At the loop's start the first state comes straight forward, without moving to the side.)
            // In the first state U1 comes first, with the pre-mRNA, and U2 joins it.
            const k = i === 0 ? (id === 'u2' || id === 'sf3' ? ramp(t, 2.4, 4.6) : arrive) : smooth(ramp(w, .15, 1));
            order(b, -.5); opacity(b, k); offset(b, 1 - smooth(k), i === 0 ? 0 : 1);
          } else if (a && !b) {
            const start = cutting ? a.userData.clear : 0;  // (opaque until it has receded behind the cut)
            order(a, -.5); opacity(a, 1 - ramp(w, start, start ? .95 : .65)); offset(a, smooth(w));
          } else if (b) { order(b, 0); opacity(b, 1); offset(b, 0); }
          if (b && apart > 0) { opacity(b, 1 - ramp(apart, .2, .9)); offset(b, smooth(apart) * .6); }
        }
        for (const g of all) if (!live.has(g)) opacity(g, 0);
        // Carried components follow their rigid path through their change (after `offset`, which placed them home).
        carries.forEach((cs, k) => cs.forEach(c => { if (k === i && w < 1) carry(c, w); else rest(c); }));
        for (const g of live) if (g.visible) for (const st of g.userData.strands) st.view(pxPerA);
        at.state = i; at.open = open; at.time = t;
      },
      annotate(t, {label, tag}) {
        const i = stateAt(t), key = STATES[i].key, gs = groups[i], since = t - T[i];
        // (Pre-A's names leave as the camera starts to pull back, as every state's leave as its change begins: held
        // through the move, a label hops between free spots on a phone.)
        if (since < CHANGE - LEAD + .2 || (i === 0 && t > T[1] - PULL.blend * PULL.lead) || (i === STATES.length - 1 && t > RECYCLE[0])) return;
        const W = (g, p) => g.localToWorld(p.clone());
        const link = gs.premrna?.userData.linkMid ? W(gs.premrna, gs.premrna.userData.linkMid) : null;
        const at3 = (id, name, num) => { const g = gs[id], p = g?.userData.residues.get(`${name}:${num}`); return p ? W(g, p) : null; };
        const pre = num => at3('premrna', key === 'prea' ? (num === BRANCH.prea ? 'pre-mRNA I' : 'pre-mRNA K') : key === 'p' ? 'pre-mRNA I' : 'pre-mRNA', num);
        // Each snRNP named at the point of it nearest its middle that the cutaway leaves: in the states it opens in
        // (activation on), the point its full depth leaves, so a tag or label stays put as the cut sweeps in or out.
        const keep = i >= 3 ? deep : Infinity;
        const anchor = g => { const c = g.userData.centre; let best = null, d0 = Infinity;
          for (const p of g.userData.sample) { if (p.dot(DIR) > keep) continue; const d = p.distanceToSquared(c); if (d < d0) { d0 = d; best = p; } }
          return W(g, best || c); };
        for (const id of SNRNPS) if (gs[id]?.userData.shown === 1) tag(anchor(gs[id]), COMPONENTS[id].name, {color: hex(COMPONENTS[id].colour)});
        const show = (p, title, sub, colour, o = {}) => { if (p) label(p, title, sub, {color: hex(colour), ...o}); };
        const early = since < 8.2, late = !early;
        switch (key) {
          case 'prea':
            if (early) show(pre(1), '5′ splice site', 'Paired with U1 snRNA', SPLICING.U1);
            else show(pre(BRANCH.prea), 'Branch site', 'Paired with U2 snRNA', SPLICING.U2);
            break;
          case 'preb':
            if (gs.tri) show(anchor(gs.tri), 'U4/U6·U5 tri-snRNP', 'Joins U1 and U2', OTHER.tri);
            break;
          case 'b':
            show(pre(1), '5′ splice site', 'Now paired with U6 snRNA', SPLICING.U6, {inside: true});
            break;
          case 'bact':
            if (gs.ntc && early) show(anchor(gs.ntc), 'Prp19 complex', 'Joins as U4 leaves', OTHER.ntc);
            else if (at.open > .9) show(W(gs.u6, gs.u6.userData.pairing), 'U6 pairs with U2', 'At the catalytic centre', SPLICING.U6);
            break;
          case 'c':
            if (early) show(link, '2′–5′ bond', 'The branch A joined to the intron’s 5′ end', SPLICING.intron);
            else show(pre(-1), '5′ exon', 'Cut free, its 3′-OH exposed', SPLICING.exon);
            break;
          case 'cstar':
            show(pre(-1), '5′ exon', 'Held for the second reaction', SPLICING.exon);
            break;
          case 'p':
            if (early) show(at3('mrna', 'pre-mRNA E', -1), 'Exons joined', '5′ exon ligated to 3′ exon', SPLICING.exon);
            else show(link, 'Intron lariat', 'Released, its 2′–5′ bond kept', SPLICING.intron);
            break;
          case 'ils':
            // Until the cutaway starts to close over it.
            if (at.open > .9) show(link, 'Intron lariat', 'To be debranched and degraded', SPLICING.intron);
            break;
        }
      },
    };
  },
});
