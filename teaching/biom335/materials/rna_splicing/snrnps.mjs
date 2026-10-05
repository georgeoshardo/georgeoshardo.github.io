// Scene: the snRNPs. Small RNAs work as ribonucleoproteins: the U1 snRNP (3CW1), its snRNA first, then its proteins;
// the five snRNPs as particles side by side at true scale (U1; the 17S U2 snRNP, 7EVO; and the U4/U6·U5 tri-snRNP,
// 6QW6, in which the U4/U6 di-snRNP is bound to U5); the U2 snRNP's one snRNA and its proteins; U4 and U6 snRNAs
// paired in the tri-snRNP; the ring of seven Sm proteins round U4's Sm site (the Sm core 4WZJ, superposed on the
// tri-snRNP's U4 ring); the Lsm2–8 ring on U6's 3′ end (yeast, 4M7A, fitted onto the tri-snRNP's human Lsm ring); and
// the snRNPs in an assembled spliceosome (pre-B, 6QX9). Proteins are envelopes (coarse, from Cα atoms, for the large
// particles; from every atom for the rings close up), coloured by family; snRNAs are strands in their snRNP's colour.
import * as THREE from 'three';
import {runScene} from '../shared/scene_player.mjs';
import {loadSurfaceSet, surfaceGeometry, proteinMaterial, fade} from '../shared/molecules.mjs';
import {SPLICING, COMPLEMENT, createCartoon, pairTip, stubColour} from '../shared/rna.mjs';
import {boxAround} from '../shared/camera.mjs';
import {fitRigid} from '../shared/fit.mjs';
import {ramp, smooth} from '../shared/ease.mjs';

const V = (...a) => new THREE.Vector3(...a);
const hex = c => '#' + new THREE.Color(c).getHexString();
const lighter = (c, k) => new THREE.Color(c).lerp(new THREE.Color(0xffffff), k).getHex();
const deeper = (c, k) => new THREE.Color(c).multiplyScalar(k).getHex();
const TRI = 0x9c8fa8, FACTORS = 0x6f7684, NTC = 0xa7abb0;

// Protein colours by family: each snRNP's own proteins in its colour (shades tell them apart), the rings in theirs.
const SM = SPLICING.Sm, LSM = SPLICING.Lsm;
// Seven shades of a ring's colour, alternating lighter and deeper round the ring, so its proteins read apart.
const SHADES = [.3, -.22, .12, -.36, .42, -.1, -.3];
const shade = (c, k) => k >= 0 ? lighter(c, k) : deeper(c, 1 + k);
const COLOUR = {
  u1: {'U1-70K': SPLICING.U1, 'U1-C': lighter(SPLICING.U1, .35), 'U1 Sm ring': SM},
  u2: {'SF3b': SPLICING.U2, 'SF3a': deeper(SPLICING.U2, .74), 'U2A′ and U2B″': lighter(SPLICING.U2, .4), 'HTATSF1 and DDX46': deeper(SPLICING.U2, .58), 'U2 Sm ring': SM},
  tri: {'Prp8': SPLICING.U5, 'Brr2': lighter(SPLICING.U5, .3), 'Snu114': deeper(SPLICING.U5, .72), 'U5 40K and Dib1': lighter(SPLICING.U5, .52),
    'U5 Sm ring': SM, 'U4/U6 proteins': SPLICING.U4, 'U4 Sm ring': SM, 'Tri-snRNP proteins': TRI},
};
const SM_NAMES = ['SmB', 'SmD1', 'SmD2', 'SmD3', 'SmE', 'SmF', 'SmG'], LSM_NAMES = [2, 3, 4, 5, 6, 7, 8].map(k => `Lsm${k}`);
const RNA_COLOUR = {'U1 snRNA': SPLICING.U1, 'U2 snRNA': SPLICING.U2, 'U4 snRNA': SPLICING.U4, 'U5 snRNA': SPLICING.U5, 'U6 snRNA': SPLICING.U6,
  'U4 Sm site': SPLICING.U4, 'U6 3′ end': SPLICING.U6};
// The pre-B spliceosome's parts (spliceosome_preb) as the spliceosome scene groups them, by snRNP.
const PREB = {'U1 snRNP': SPLICING.U1, 'U1 Sm ring': SM, 'U2 snRNP': SPLICING.U2, 'SF3a and SF3b': SPLICING.U2, 'U2 Sm ring': SM,
  'U4 snRNP': SPLICING.U4, 'U4 Sm ring': SM, 'U6 Lsm ring': LSM, 'U5 snRNP': SPLICING.U5, 'U5 Sm ring': SM, 'Tri-snRNP proteins': TRI,
  'Prp19 complex': NTC, 'Other proteins': FACTORS};
const SNRNP_OF = {'U1 snRNA': 'U1', 'U2 snRNA': 'U2', 'U4 snRNA': 'U4', 'U5 snRNA': 'U5', 'U6 snRNA': 'U6'};

// Times (s): each step starts at its t.
const T = {u1: 0, five: 13, u2: 27, tri: 40, sm: 54, lsm: 68, spl: 81, end: 98};
const LEAD = 1;  // stations fade out as the camera leaves (about a second before the next step) and in as it arrives
// The stations that come in at the end of a long pull-back start fading in that much later, once the camera is nearly
// there, so they do not pass behind the step list or the narration on its way.
const FIVE_LATE = .6;
const NOTES = {snrnas: 'snrnas-are-required-for-splicing', parts: 'the-spliceosome-and-its-components'};
const steps = [
  {t: T.u1, nav: 'Small RNAs with proteins', title: 'Small RNAs work<br>with proteins.', notes: NOTES.snrnas, hold: 1.1,
    text: 'Small RNAs confined to the nucleus are small nuclear RNAs (snRNAs); those in the cytoplasm are small cytoplasmic RNAs (scRNAs); the small nucleolar RNAs (snoRNAs) of the nucleolus process ribosomal RNA. In their natural state they exist as ribonucleoprotein particles: snRNPs (“snurps”) and scRNPs.'},
  {t: T.five, nav: 'Five snRNPs', title: 'Five snRNPs, named<br>after their snRNAs.', notes: NOTES.parts, hold: 1.1,
    text: 'The spliceosome contains five essential snRNPs, named after the snRNA they contain: U1, U2, U5, U4 and U6. The U4 and U6 snRNPs typically exist together as a single U4/U6 di-snRNP particle, here bound to U5. Inactivating any one of them prevents splicing.'},
  {t: T.u2, nav: 'One snRNA, several proteins', title: 'One snRNA,<br>several proteins.', notes: NOTES.parts,
    text: 'Each snRNP contains a single snRNA and several proteins. In the U2 snRNP, U2 snRNA is held by the SF3a and SF3b complexes, U2A′ and U2B″, and a ring of Sm proteins.'},
  {t: T.tri, nav: 'U4/U6 and U5', title: 'U4 and U6 snRNAs<br>pair with each other.', notes: NOTES.parts,
    text: 'In the U4/U6 di-snRNP the two snRNAs are held together by base pairing. The spliceosome relies heavily on RNA–RNA interactions like these, among the snRNAs themselves and between the snRNAs and the pre-mRNA.'},
  {t: T.sm, nav: 'The Sm ring', title: 'Sm proteins ring<br>U1, U2, U4 and U5.', notes: NOTES.parts, hold: 1.1,
    text: 'A core group of conserved Sm proteins is found in the U1, U2, U4 and U5 snRNPs, ringed round each snRNA. They are recognized by anti-Sm antibodies, which are often found in patients with autoimmune diseases like systemic lupus erythematosus.'},
  {t: T.lsm, nav: 'The Lsm ring', title: 'U6 has a ring of<br>Sm-like proteins.', notes: NOTES.parts,
    text: 'The U6 snRNP lacks Sm proteins but contains a set of Sm-like (Lsm) proteins, Lsm2 to Lsm8, ringed round the 3′ end of U6 snRNA.'},
  {t: T.spl, nav: 'In the spliceosome', title: 'The snRNPs: almost half<br>of the spliceosome.', notes: NOTES.parts, hold: 1.1,
    text: 'The spliceosome, larger than a ribosome, forms as the snRNPs and other proteins assemble on the pre-mRNA. The five snRNAs and their proteins make up almost half of its mass; about 70 other proteins, the splicing factors, assemble it, bind the pre-mRNA and create its catalytic centre.'},
];

// The view (from the subject towards the camera; world −y is up on screen).
const DIR = [.05, -.12, -1];
const at = {};
// A strand is drawn before the see-through envelopes and keeps writing depth while it fades (outline first, then the
// tube, its caps and its bonds), so neither a see-through envelope behind it nor its own far side paints over it:
// three.js orders see-through objects by their middles and does not sort a mesh's own triangles, so a strand fading
// in with its proteins (the Sm site in its ring, U6 in the Lsm ring) would otherwise sit behind an envelope it lies in
// front of, or show its crossings and bonds in the wrong order, until the moment it turns opaque.
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
  pageTitle: 'snRNPs · RNA splicing and processing', eyebrow: 'snRNPs',
  links: [{href: 'index.html', text: 'All scenes'}],
  steps, duration: T.end, notesPage: 'notes.html', fov: 26,
  shots: [
    {t: T.u1, frame: () => at.views.u1},
    // (Pulling back from U1 to all five, the camera pans with the zoom, so U1 does not slide off one side first.)
    // (Pulling back from U1 to all five, the camera pans with the zoom, so U1 does not slide off one side first.)
    {t: T.five, blend: 3, zoomPan: true, frame: () => at.views.five},
    {t: T.u2, blend: 2.8, frame: () => at.views.u2},
    {t: T.tri, blend: 3, frame: () => at.views.tri},
    {t: T.sm, blend: 3, frame: () => at.views.sm},
    {t: T.lsm, blend: 3, frame: () => at.views.lsm},
    {t: T.spl, blend: 3.2, frame: () => at.views.spl},
  ],
  async build({world, progress}) {
    const got = [0, 0], tell = k => p => { got[k] = p; progress((got[0] * 4 + got[1]) / 5); };
    const [set, preb] = await Promise.all([loadSurfaceSet('assets/snrnps.json', 'assets/snrnps.bin', tell(0)),
      loadSurfaceSet('assets/spliceosome_preb.json', 'assets/spliceosome_preb.bin', tell(1))]);

    // ---------- Molecules ----------
    // Each particle sits in a holder (its place in the row, turned to show its broad face) round an inner group
    // that centres it.
    const holders = {}, inner = {}, items = {};
    const holder = id => { if (!holders[id]) { holders[id] = new THREE.Group(); inner[id] = new THREE.Group(); holders[id].add(inner[id]); world.add(holders[id]); } return inner[id]; };
    const item = (key, place) => items[key] ||= {key, place, meshes: [], strands: [], shown: -1, sample: []};
    const addMesh = (key, place, rec, buffer, colour) => {
      const m = new THREE.Mesh(surfaceGeometry(rec, buffer), proteinMaterial(colour));
      m.userData = {rec, colour}; holder(place).add(m);
      const it = item(key, place); it.meshes.push(m);
      const a = m.geometry.attributes.position; for (let k = 0; k < a.count; k += 5) it.sample.push(V().fromBufferAttribute(a, k));
      return m;
    };
    // A structure's RNA drawn as structures' RNA is: pieces of consecutive nucleotides (no more than 9 Å apart), each
    // base's bond towards its base, or to the middle of its pair (Watson–Crick partners only).
    const addStrand = (key, place, s, strands, colour) => {
      const P = s.backbone.map(b => V(...b)), it = item(key, place), byChain = new Map(strands.map(x => [x.chain, x]));
      const runs = [[0, 1]];
      for (let k = 1; k < P.length; k++) if (P[k - 1].distanceTo(P[k]) > 9) runs.push([k, k + 1]); else runs[runs.length - 1][1] = k + 1;
      for (const [a, b] of runs.filter(([a, b]) => b - a > 1)) {
        const piece = P.slice(a, b), cc = createCartoon(holder(place), b - a, {colour, rung: stubColour(colour).getHex(), radius: 1.6, samples: 3});
        const tips = piece.map((p, i) => {
          const k = a + i, q = s.partner[k], o = q && byChain.get(q[0]);
          const mate = o && COMPLEMENT[s.sequence[k]]?.includes(o.sequence[q[1]]) ? V(...o.backbone[q[1]]) : null, base = V(...s.base[k]);
          if (base.distanceTo(p) < .5) return mate ? p.clone().lerp(mate, .5) : p.clone();
          return pairTip(V(), p, base, mate, 1);
        });
        cc.pose(piece, tips); noFlatBonds(cc, piece, tips);
        it.strands.push(cc); it.sample.push(...piece);
      }
      it.paired = (it.paired || 0) + s.partner.filter(Boolean).length;
    };
    const meshes = set.meta.meshes, strands = set.meta.strands;
    for (const rec of meshes) {
      if (rec.structure === 'sm') addMesh(`sm:${rec.name}`, 'tri', rec, set.buffer, shade(SM, SHADES[SM_NAMES.indexOf(rec.name)]));
      else if (rec.structure === 'lsm') addMesh(`lsm:${rec.name}`, 'lsm', rec, set.buffer, shade(LSM, SHADES[LSM_NAMES.indexOf(rec.name)]));
      else if (rec.name.startsWith('Lsm')) addMesh('tri:Lsm ring', 'tri', rec, set.buffer, LSM);
      else addMesh(`${rec.structure}:${rec.name}`, rec.structure, rec, set.buffer, COLOUR[rec.structure][rec.name]);
    }
    for (const s of strands) {
      const own = strands.filter(x => x.structure === s.structure);
      addStrand(`${s.structure}:${s.name}`, s.structure === 'sm' ? 'tri' : s.structure, s, own, RNA_COLOUR[s.name]);
    }
    for (const rec of preb.meta.meshes) addMesh(`preb:${rec.name}`, 'preb', rec, preb.buffer, PREB[rec.name]);
    for (const s of preb.meta.strands) addStrand(`preb:${s.name}`, 'preb', s, preb.meta.strands, RNA_COLOUR[s.name] ?? SPLICING.intron);

    // The yeast Lsm2–8 ring placed on the tri-snRNP's human ring: each protein's middle onto its human counterpart's.
    const middle = m => { const a = m.geometry.attributes.position, c = V(); for (let k = 0; k < a.count; k++) c.add(V().fromBufferAttribute(a, k)); return c.divideScalar(a.count); };
    const human = LSM_NAMES.map(n => middle(items['tri:Lsm ring'].meshes.find(m => m.userData.rec.name === n)));
    const yeast = LSM_NAMES.map(n => middle(items[`lsm:${n}`].meshes[0]));
    const fit = fitRigid(yeast, human);
    holder('tri').add(holders.lsm); holders.lsm.matrixAutoUpdate = false; holders.lsm.matrix.copy(fit);
    at.lsmFit = Math.sqrt(yeast.reduce((s, p, k) => s + p.clone().applyMatrix4(fit).distanceToSquared(human[k]), 0) / 7);

    // ---------- Places ----------
    // Each particle turned so its longest extent lies across the screen and its broad face to the camera.
    const principal = pts => {
      const c = pts.reduce((s, p) => s.add(p), V()).divideScalar(pts.length), M = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
      for (const p of pts) { const d = [p.x - c.x, p.y - c.y, p.z - c.z]; for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) M[i][j] += d[i] * d[j]; }
      const axes = [];
      for (let k = 0; k < 2; k++) {  // power iteration, deflating the axes found
        let v = V(1, .3 + k, .2 - k);
        for (let it = 0; it < 60; it++) {
          const w = V(M[0][0] * v.x + M[0][1] * v.y + M[0][2] * v.z, M[1][0] * v.x + M[1][1] * v.y + M[1][2] * v.z, M[2][0] * v.x + M[2][1] * v.y + M[2][2] * v.z);
          for (const a of axes) w.addScaledVector(a, -w.dot(a));
          v = w.normalize();
        }
        axes.push(v);
      }
      return {centre: c, x: axes[0], y: axes[1]};
    };
    const view = V(...DIR).normalize(), across = V(0, -1, 0).cross(view).normalize(), up = view.clone().cross(across);
    const extent = {};
    for (const id of ['u1', 'u2', 'tri', 'preb']) {
      const pts = Object.values(items).filter(it => it.place === id).flatMap(it => it.sample);
      const {centre, x, y} = principal(pts), z = x.clone().cross(y);
      inner[id].position.copy(centre).negate();
      // The principal axes onto the screen's across, up and depth directions.
      const from = new THREE.Matrix4().makeBasis(x, y, z), to = new THREE.Matrix4().makeBasis(across, up.clone().negate(), view.clone().negate());
      holders[id].quaternion.setFromRotationMatrix(to.multiply(from.transpose()));
      const local = pts.map(p => p.clone().sub(centre).applyQuaternion(holders[id].quaternion));
      extent[id] = {w: Math.max(...local.map(p => p.dot(across))) - Math.min(...local.map(p => p.dot(across))),
        h: Math.max(...local.map(p => p.dot(up))) - Math.min(...local.map(p => p.dot(up)))};
    }
    // The three particles in a row, 70 Å apart (U1 on the right, so the camera pulls back from it away from the step
    // list); the spliceosome below them.
    const GAP = 70, row = extent.u1.w + extent.u2.w + extent.tri.w + 2 * GAP;
    holders.tri.position.copy(across).multiplyScalar(-row / 2 + extent.tri.w / 2);
    holders.u2.position.copy(across).multiplyScalar(-row / 2 + extent.tri.w + GAP + extent.u2.w / 2);
    holders.u1.position.copy(across).multiplyScalar(row / 2 - extent.u1.w / 2);
    holders.preb.position.copy(up).multiplyScalar(-(Math.max(extent.u1.h, extent.u2.h, extent.tri.h) / 2 + GAP * 2 + extent.preb.h / 2));
    world.updateMatrixWorld(true);

    const worldOf = it => it.sample.map(p => (it.place === 'lsm' ? holders.lsm : inner[it.place]).localToWorld(p.clone()));
    const pointsOf = keys => keys.flatMap(k => worldOf(items[k]));
    const placeKeys = place => Object.keys(items).filter(k => items[k].place === place);
    const box = (keys, o = {}) => ({...boxAround(pointsOf(keys).filter((p, k) => k % 2 === 0), DIR, {margin: 8, fov: 26, ...o}), fill: .95});
    // A ring seen down its axis: the plane through its proteins' middles, from the camera's side.
    // A ring seen down its axis (the normal of the plane through its proteins' middles), from the side its RNA lies on
    // (`rna`: the RNA's points), so the strand shows running into the ring's hole; `also` adds points to the box.
    const ringView = (keys, rna, also = []) => {
      const ms = keys.map(k => items[k].meshes[0]), cs = ms.map(m => m.parent.localToWorld(middle(m)));
      const c = cs.reduce((s, p) => s.add(p), V()).divideScalar(cs.length);
      let n = V(); for (let k = 0; k < cs.length; k++) n.add(cs[k].clone().sub(c).cross(cs[(k + 1) % cs.length].clone().sub(c)));
      n.normalize();
      const r = rna.reduce((s, p) => s.add(p), V()).divideScalar(rna.length);
      if (r.sub(c).dot(n) < 0) n.negate();
      return {...boxAround([...pointsOf(keys), ...also].filter((p, k) => k % 3 === 0), n.toArray(), {margin: 22, fov: 26}), fill: .9};
    };
    at.views = {
      u1: box(placeKeys('u1')), five: box([...placeKeys('u1'), ...placeKeys('u2'), ...placeKeys('tri').filter(k => !k.startsWith('sm:'))]),
      u2: box(placeKeys('u2')), tri: box(placeKeys('tri').filter(k => !k.startsWith('sm:'))),
      sm: ringView(SM_NAMES.map(n => `sm:${n}`), worldOf(items['sm:U4 Sm site'])),
      lsm: ringView(LSM_NAMES.map(n => `lsm:${n}`), worldOf(items['tri:U6 snRNA']), worldOf(items['tri:U6 snRNA'])), spl: box(placeKeys('preb')),
    };

    // ---------- When each thing shows ----------
    // Shown from a (fading in as the camera arrives, over the last part of its move) until b (fading out quickly as the
    // camera sets off, while it has hardly moved).
    const stay = (t, a, b) => ramp(t, a + .8, a + 1.9) * (1 - ramp(t, b - LEAD, b - LEAD + .55));
    const visible = (key, t) => {
      const it = items[key], name = key.split(':').slice(1).join(':');
      switch (it.place) {
        case 'u1': return key === 'u1:U1 snRNA' ? ramp(t, .2, 1.6) * stay(t, -2, T.u2) : ramp(t, 3.6, 5.6) * stay(t, -2, T.u2);
        // (The other four come in once the pull-back from U1 is nearly over, so they do not pass behind the step list.)
        case 'u2': return Math.max(stay(t, T.five + FIVE_LATE, T.tri), 0);
        case 'tri': {
          if (key.startsWith('sm:')) return ramp(t, T.sm + 1.6, T.sm + 3.2) * (1 - ramp(t, T.lsm - LEAD, T.lsm - LEAD + 1));
          const whole = Math.max(stay(t, T.five + FIVE_LATE, T.u2), stay(t, T.tri + FIVE_LATE, T.sm));
          // Close to the Sm ring, the tri-snRNP's own U4 ring gives way to the Sm core's (cross-dissolved over it).
          if (name === 'U4 Sm ring') return Math.max(whole, (t > T.sm - LEAD ? 1 - ramp(t, T.sm + 2.4, T.sm + 3.6) : 0));
          if (name === 'U6 snRNA') return Math.max(whole, stay(t, T.lsm, T.spl));
          return whole;
        }
        case 'lsm': return stay(t, T.lsm, T.spl);
        case 'preb': return ramp(t, T.spl + 1.4, T.spl + 2.4) * (key.endsWith('snRNA') || key.includes('pre-mRNA') ? 1 : 1 - ramp(t, T.spl + 9.5, T.spl + 11));
      }
      return 0;
    };
    const opacity = (it, v) => {
      v = v < .002 ? 0 : v > .998 ? 1 : v;
      if (v === it.shown) return; it.shown = v;
      for (const m of it.meshes) { fade(m.material, v); m.visible = v > 0; }
      for (const cc of it.strands) { cc.opacity(v); strandFirst(cc.group); }
    };
    const keys = Object.keys(items);

    // For tests (?debug=1): world points of what is drawn now, and what each step shows.
    at.shown = () => keys.filter(k => items[k].shown > 0).flatMap(k => worldOf(items[k]).filter((p, j) => j % 4 === 0)).map(p => p.toArray());
    at.visible = () => keys.filter(k => items[k].shown > 0);
    at.counts = {sm: SM_NAMES.filter(n => items[`sm:${n}`]).length, lsm: LSM_NAMES.filter(n => items[`lsm:${n}`]).length,
      u4u6Pairs: strands.find(s => s.structure === 'tri' && s.name === 'U6 snRNA').partner.filter(p => p && p[0] === strands.find(s => s.structure === 'tri' && s.name === 'U4 snRNA').chain).length,
      snRNAs: preb.meta.strands.filter(s => SNRNP_OF[s.name]).map(s => SNRNP_OF[s.name])};

    // Label anchors: a part's middle (world), or a strand's nucleotide.
    const centreOf = key => { const it = items[key]; const ps = worldOf(it); return ps.reduce((s, p) => s.add(p), V()).divideScalar(ps.length); };
    const partCentre = (key, name) => { const m = items[key].meshes.find(x => x.userData.rec.name === name); return m.parent.localToWorld(middle(m)); };
    const nearest = (key, to) => worldOf(items[key]).reduce((b, p) => !b || p.distanceToSquared(to) < b.distanceToSquared(to) ? p : b, null);

    return {
      items, holders, at,  // for tests (?debug=1)
      update(t, {pxPerA = 1} = {}) {
        for (const k of keys) opacity(items[k], visible(k, t));
        for (const k of keys) if (items[k].shown > 0) for (const cc of items[k].strands) cc.view(pxPerA);
        at.time = t;
      },
      annotate(t, {label, tag}) {
        const on = key => items[key] && items[key].shown > .9;
        const T0 = k => t - k;
        const name = (key, text, colour) => { if (on(key)) tag(centreOf(key), text, {color: hex(colour)}); };
        if (t < T.five - LEAD) {
          if (T0(T.u1) > 1.6 && T0(T.u1) < 5.6) label(nearest('u1:U1 snRNA', centreOf('u1:U1 snRNA')), 'U1 snRNA', 'Folded on itself', {color: hex(SPLICING.U1)});
          if (T0(T.u1) > 6) {
            label(centreOf('u1:U1-70K'), 'U1 snRNP', 'U1 snRNA with its proteins', {color: hex(SPLICING.U1)});
            name('u1:U1 Sm ring', 'Sm ring', SM); name('u1:U1-C', 'U1-C', COLOUR.u1['U1-C']);
          }
        } else if (t < T.u2 - LEAD) {
          if (T0(T.five) < 2.2) return;
          name('u1:U1-70K', 'U1', SPLICING.U1); name('u2:SF3b', 'U2', SPLICING.U2);
          name('tri:U4/U6 proteins', 'U4/U6', SPLICING.U4); name('tri:Prp8', 'U5', SPLICING.U5);
          if (T0(T.five) > 5) label(centreOf('tri:Tri-snRNP proteins'), 'U4/U6·U5 tri-snRNP', 'The U4/U6 di-snRNP bound to U5', {color: hex(TRI)});
        } else if (t < T.tri - LEAD) {
          if (T0(T.u2) < 2.2) return;
          label(nearest('u2:U2 snRNA', centreOf('u2:U2 snRNA')), 'U2 snRNA', 'The snRNP’s one snRNA', {color: hex(SPLICING.U2)});
          if (T0(T.u2) > 5) {
            name('u2:SF3b', 'SF3b', COLOUR.u2.SF3b); name('u2:SF3a', 'SF3a', COLOUR.u2.SF3a);
            name('u2:U2A′ and U2B″', 'U2A′, U2B″', COLOUR.u2['U2A′ and U2B″']); name('u2:U2 Sm ring', 'Sm ring', SM);
          }
        } else if (t < T.sm - LEAD) {
          if (T0(T.tri) < 2.2) return;
          const u6 = items['tri:U6 snRNA'];
          label(nearest('tri:U6 snRNA', centreOf('tri:U4 snRNA')), 'U4 and U6 snRNAs', 'Base paired: the U4/U6 di-snRNP', {color: hex(SPLICING.U4)});
          if (T0(T.tri) > 6 && u6) label(nearest('tri:U5 snRNA', centreOf('tri:U5 snRNA')), 'U5 snRNA', 'With the U5 proteins', {color: hex(SPLICING.U5)});
          if (T0(T.tri) > 4) { name('tri:Prp8', 'U5 proteins', SPLICING.U5); name('tri:Lsm ring', 'Lsm ring', LSM); name('tri:U4 Sm ring', 'Sm ring', SM); name('tri:U5 Sm ring', 'Sm ring', SM); }
        } else if (t < T.lsm - LEAD) {
          if (T0(T.sm) < 3.6) return;
          for (const n of SM_NAMES) name(`sm:${n}`, n, shade(SM, SHADES[SM_NAMES.indexOf(n)]));
          if (T0(T.sm) > 6) label(nearest('sm:U4 Sm site', centreOf(`sm:${SM_NAMES[0]}`).lerp(centreOf(`sm:${SM_NAMES[3]}`), .5)), 'U4 snRNA', 'Its Sm site runs through the ring', {color: hex(SPLICING.U4)});
        } else if (t < T.spl - LEAD) {
          if (T0(T.lsm) < 2.6) return;
          for (const n of LSM_NAMES) name(`lsm:${n}`, n, shade(LSM, SHADES[LSM_NAMES.indexOf(n)]));
          if (T0(T.lsm) > 5) label(nearest('lsm:U6 3′ end', centreOf('lsm:U6 3′ end')), 'U6 snRNA 3′ end', 'Bound in the Lsm ring', {color: hex(SPLICING.U6)});
        } else {
          if (T0(T.spl) < 2.4) return;
          const rna = T0(T.spl) > 11;
          if (!rna) {
            name('preb:U1 snRNP', 'U1', SPLICING.U1); name('preb:SF3a and SF3b', 'U2', SPLICING.U2); name('preb:U4 snRNP', 'U4', SPLICING.U4);
            name('preb:U5 snRNP', 'U5', SPLICING.U5); name('preb:U6 Lsm ring', 'U6', SPLICING.U6);
            if (T0(T.spl) > 5.5) label(centreOf('preb:Tri-snRNP proteins'), 'Tri-snRNP proteins', 'Joined with U4/U6 and U5', {color: hex(TRI)});
          } else {
            label(nearest('preb:U6 snRNA', centreOf('preb:U4 snRNA')), 'RNA–RNA interactions', 'snRNAs paired with each other and the pre-mRNA', {color: hex(SPLICING.U6)});
            for (const n of ['U1', 'U2', 'U4', 'U5', 'U6']) name(`preb:${n} snRNA`, `${n} snRNA`, SPLICING[n]);
          }
        }
      },
    };
  },
});
