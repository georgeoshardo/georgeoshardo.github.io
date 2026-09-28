// Scene: the three eukaryotic RNA polymerases (yeast RNAP I, II and III elongation complexes, superposed
// through their shared subunits), then what RNAP II shares with the bacterial enzyme (E. coli core,
// superposed on the RNA–DNA hybrid so the active sites coincide) and what it lacks (σ), and its CTD.
import * as THREE from 'three';
import {runScene} from '../shared/scene_player.mjs';
import {PALETTE, loadSurfaceSet, surfaceGeometry, proteinMaterial, fade, fadeObject} from '../shared/molecules.mjs';
import {smooth, ramp} from '../shared/ease.mjs';

const V = (...a) => new THREE.Vector3(...a);
const hex = c => '#' + c.toString(16).padStart(6, '0');
// Subunit colours by kind: the two largest match bacterial β′ and β, the α-like pair is gold as α, the
// subunits common to all three are coral, and each polymerase's own subunits keep a pale tint of its own.
const SHARED = 0xe0795f;
const ROLE = {'beta-prime-like': PALETTE.betaPrime, 'beta-like': PALETTE.beta, 'alpha-like': PALETTE.alpha, shared: SHARED};
const OWN = {pol1: 0xa99bc4, pol2: 0x9fb0b8, pol3: 0xc9b48f};
const BACTERIAL = {'β': PALETTE.beta, 'β′': PALETTE.betaPrime, 'α I': PALETTE.alpha, 'α II': PALETTE.alpha2, 'ω': PALETTE.omega, 'σ70': PALETTE.sigma};
const NAME = {pol1: 'RNAP I', pol2: 'RNAP II', pol3: 'RNAP III'};
const MAKES = {pol1: 'rRNA, but not 5S rRNA', pol2: 'mRNA and some small RNAs', pol3: 'tRNA, 5S rRNA and other small RNAs'};
const SLOT = {pol1: -1, pol2: 0, pol3: 1, bacteria: 1, sigma70: 1}, GAP = 235;
// Every structure is turned half a turn so the cleft faces the viewer: Rpb2 (β) above, Rpb1 (β′) below.
const YAW = Math.PI + .2;
const REPEATS = 26;  // yeast CTD heptads (the notes: yeast n = 26, mouse n = 52)

// Times (s): each step starts at its t.
const T = {subunits: 9, shared: 19, large: 28, sigma: 38, ctd: 47, end: 59};
const steps = [
  {t: 0, nav: 'Three polymerases', title: 'Three polymerases,<br>three classes of gene.', notes: 'there-are-multiple-types-of-rnap',
    text: 'While bacteria have a single type of RNAP, eukaryotes have three, each responsible for transcribing one of the major classes of genes.'},
  {t: T.subunits, nav: 'Many subunits', title: 'Large complexes of<br>many subunits.', notes: 'eukaryotic-rnaps-are-large-complexes',
    text: 'Each is a large protein complex of many subunits: RNAP II, for example, is approximately 500 kD and made of 12 or so subunits.'},
  {t: T.shared, nav: 'Shared subunits', title: 'Five subunits are<br>common to all three.', notes: 'eukaryotic-rnaps-are-large-complexes',
    text: 'Five of the smaller subunits are the same proteins in RNAP I, II and III.'},
  {t: T.large, nav: 'β′ and β', title: 'The two largest subunits<br>are related to β′ and β.', notes: 'eukaryotic-rnaps-are-large-complexes',
    text: 'The two largest subunits are homologous to the β′ and β subunits of bacterial RNAP.'},
  {t: T.sigma, nav: 'No σ', title: 'No subunit<br>plays the part of σ.', notes: 'eukaryotic-rnaps-are-large-complexes',
    text: 'There is no subunit analogous to the σ factor of bacterial RNAP: that function is contained within the basal transcription factors.'},
  {t: T.ctd, nav: 'The CTD', title: 'RNAP II has a tail<br>of repeats: the CTD.', notes: 'the-large-subunit-of-rnap-ii', hold: 1.1,
    text: 'The largest subunit of RNAP II has a carboxy-terminal domain (CTD) made of repeats of a consensus sequence. The CTD is unique to RNAP II, and is involved in initiation, elongation, all aspects of mRNA processing and even mRNA export.'},
];

// Scene state shared by update(), annotate() and the camera shots.
const at = {};

runScene({
  pageTitle: 'Three RNA polymerases · Eukaryotic transcription', eyebrow: 'Eukaryotic RNA polymerases',
  links: [{href: 'index.html', text: 'All scenes'}, {href: '../protein_browser/#rnap2', text: 'Protein library'}],
  steps, duration: T.end, notesPage: 'notes.html',
  shots: [
    {t: 0, target: [0, -40, 0], dir: [.12, -.32, -1], radius: 350, fill: .95},
    {t: T.subunits, blend: 2.6, target: [0, 0, 0], dir: [-.22, -.28, -1], radius: 360, fill: .95},
    {t: T.shared, blend: 2.6, target: [0, 0, 0], dir: [.3, -.3, -1], radius: 320, fill: .95},
    {t: T.large, blend: 2.8, target: [GAP * .5, 0, 0], dir: [.08, -.3, -1], radius: 250, fill: .92},
    {t: T.sigma, blend: 2.4, target: [GAP * .55, 0, 0], dir: [-.12, -.34, -1], radius: 250, fill: .92},
    {t: T.ctd, blend: 2.8, frame: () => ({target: at.ctdView || V(), dir: [.25, -.2, -1], radius: at.ctdRadius || 130, fill: .95})},
  ],
  async build({world, progress}) {
    const set = await loadSurfaceSet('assets/polymerases.json', 'assets/polymerases.bin', progress);
    // Every structure is in RNAP II's frame; each sits in its own slot and turns slowly about its own axis.
    const groups = {}, meshes = [];
    for (const rec of set.meta.meshes) {
      const id = rec.structure, g = groups[id] ||= new THREE.Group();
      const colour = OWN[id] ?? BACTERIAL[rec.name];
      const m = new THREE.Mesh(surfaceGeometry(rec, set.buffer), proteinMaterial(colour));
      const i = g.children.length;
      m.userData = {rec, own: new THREE.Color(colour).multiplyScalar(.86), role: new THREE.Color(ROLE[rec.role] ?? colour).multiplyScalar(.86),
        // A lighter or deeper shade per subunit, so the pieces of one complex read apart.
        shade: .8 + .36 * ((i * .618) % 1), centre: V(...rec.center)};
      g.add(m); meshes.push(m);
    }
    groups.bacteria.add(...groups.sigma70.children); delete groups.sigma70;
    for (const g of Object.values(groups)) world.add(g);
    const centroid = id => { const c = V(), ms = groups[id].children; ms.forEach(m => c.add(m.userData.centre)); return c.divideScalar(ms.length); };
    const centre = {pol1: centroid('pol1'), pol2: centroid('pol2'), pol3: centroid('pol3'), bacteria: centroid('bacteria')};
    // Half-height of each complex, so tags sit just above it (a little higher while the subunits drift apart).
    const half = {};
    for (const [id, g] of Object.entries(groups)) { const b = new THREE.Box3().setFromObject(g); half[id] = Math.max(centre[id].y - b.min.y, 40); }
    // Where a callout's leader meets each complex: a point on its surface at the top of its body (−y is up), near
    // the complex's centre line rather than out on a protruding subunit, so the leader ends on the protein.
    // (`dir` −1: the top; +1: the bottom, for a callout below.)
    const surfacePoint = (id, dir) => {
      const c = centre[id], p = V(); let best = null, score = Infinity;
      for (const m of groups[id].children) {
        if (!m.isMesh || !m.userData.rec) continue;
        const a = m.geometry.attributes.position;
        for (let i = 0; i < a.count; i += 7) { p.fromBufferAttribute(a, i); const k = -dir * p.y + .6 * Math.hypot(p.x - c.x, p.z - c.z); if (k < score) { score = k; best = p.clone(); } }
      }
      return best;
    };
    const crown = {}, foot = {};
    for (const id of Object.keys(groups)) { crown[id] = surfacePoint(id, -1); foot[id] = surfacePoint(id, 1); }
    for (const m of meshes) m.userData.out = m.userData.centre.clone().sub(centre[m.userData.rec.structure === 'sigma70' ? 'bacteria' : m.userData.rec.structure]);
    const find = (id, name) => meshes.find(m => m.userData.rec.structure === id && m.userData.rec.name === name);
    const sigma = find('sigma70', 'σ70'), rpb1 = find('pol2', 'Rpb1');

    // RNAP II's CTD: the linker and 26 heptad repeats beyond Rpb1's last modelled residue, a flexible string of beads.
    const anchor = V(...set.meta.points.find(p => p.name === 'rpb1-end').position);
    // In RNAP II's frame the viewer looks along z, so the tail hangs and curls in the x–y plane (towards the
    // screen's right, away from the narration) and sways a little in depth.
    const out = anchor.clone().sub(centre.pol2).normalize(), side = V(0, 0, 1).cross(out).normalize(), lift = out.clone().cross(side);
    const LINK = 12;
    const linker = new THREE.InstancedMesh(new THREE.SphereGeometry(1.35, 10, 6), proteinMaterial(PALETTE.betaPrime, {rim: .3}), LINK);
    const beads = new THREE.InstancedMesh(new THREE.SphereGeometry(2.7, 14, 10), proteinMaterial(PALETTE.betaPrime, {rim: .35}), REPEATS);
    linker.frustumCulled = beads.frustumCulled = false; groups.pol2.add(linker, beads);
    const dummy = new THREE.Object3D(), ctd = Array.from({length: REPEATS}, () => V());
    const place = (inst, i, p, s) => { dummy.position.copy(p); dummy.scale.setScalar(Math.max(1e-3, s)); dummy.updateMatrix(); inst.setMatrixAt(i, dummy.matrix); };

    const tint = (m, c, k = 1) => m.material.color.copy(c).multiplyScalar(k);
    return {
      meshes, groups,  // for tests (?debug=1)
      update(t, {calm}) {
        // Who is on stage: RNAP I and III step back when the bacterial enzyme comes forward.
        const eukOthers = 1 - ramp(t, T.large, T.large + 1.8);
        const bacteria = ramp(t, T.large + .6, T.large + 2.6) * (1 - ramp(t, T.ctd, T.ctd + 1.6));
        const sig = ramp(t, T.sigma + .6, T.sigma + 2.4) * (1 - ramp(t, T.ctd, T.ctd + 1.6));
        const presence = {pol1: eukOthers, pol2: 1, pol3: eukOthers, bacteria};
        for (const [id, g] of Object.entries(groups)) {
          const p = presence[id];
          g.visible = p > .01;
          g.position.set(SLOT[id] * GAP, 0, 420 * (1 - p));
          g.scale.setScalar(.35 + .65 * p);
          g.rotation.y = YAW + (calm ? 0 : .1 * Math.sin(t * .16));
        }
        // Step 2: the subunits drift apart a little, so each complex reads as many pieces.
        const apart = ramp(t, T.subunits + 1, T.subunits + 3.5) * (1 - ramp(t, T.shared - 2.5, T.shared - .2));
        const shades = ramp(t, T.subunits + .5, T.subunits + 2) * (1 - ramp(t, T.shared - .5, T.shared + 1));
        const roles = ramp(t, T.large, T.large + 1.5);  // RNAP II takes on bacterial colours from step 4
        const focusShared = ramp(t, T.shared, T.shared + 1.2) * (1 - ramp(t, T.large - .8, T.large + .4));
        const focusLarge = ramp(t, T.large + 1, T.large + 2.2) * (1 - ramp(t, T.sigma - .5, T.sigma + .5));
        const focusSigma = ramp(t, T.sigma + .4, T.sigma + 1.6) * (1 - ramp(t, T.ctd - .5, T.ctd + .5));
        const focusCtd = ramp(t, T.ctd, T.ctd + 1.5);
        for (const m of meshes) {
          const {rec, own, role, shade, centre: c, out: o} = m.userData, id = rec.structure, u = m.material.userData.uniforms;
          const bacterial = id === 'bacteria' || id === 'sigma70';
          m.position.copy(o).multiplyScalar(.55 * apart);
          const colour = new THREE.Color().copy(own).lerp(role, id === 'pol2' ? roles : 0).multiplyScalar(1 + (shade - 1) * shades);
          const large = rec.role === 'beta-prime-like' || rec.role === 'beta-like';  // the two named in step 4
          let dim = 0;
          dim = Math.max(dim, focusShared * (rec.role === 'shared' ? 0 : 1));
          dim = Math.max(dim, focusLarge * (large ? 0 : 1));
          dim = Math.max(dim, focusSigma * (id === 'sigma70' ? 0 : bacterial ? 1 : .35));
          dim = Math.max(dim, focusCtd * (m === rpb1 ? 0 : 1));
          if (rec.role === 'shared' && !bacterial) colour.lerp(new THREE.Color(SHARED).multiplyScalar(.86), focusShared);
          const k = 1 - .82 * dim;  // linear light: .18 reads as a little under half brightness
          tint(m, colour, k);
          u.uRim.value = .2 * k;
          u.uGlow.value = .25 * (focusShared * (rec.role === 'shared' ? 1 : 0) + (id === 'sigma70' ? .9 * focusSigma : 0));
          // Light falls away with distance as a molecule steps back into the dark.
          const p = bacterial ? presence.bacteria : presence[id];
          m.material.color.multiplyScalar(.2 + .8 * p); u.uRim.value *= p;
        }
        // σ70 joins the bacterial core (holoenzyme) for step 5 only: it drifts in and fades in, as in the film.
        fade(sigma.material, sig); sigma.visible = sig > .01;
        sigma.position.copy(sigma.userData.out).normalize().multiplyScalar(70 * (1 - sig));
        // The CTD grows out of Rpb1 bead by bead, then drifts slowly.
        const grow = ramp(t, T.ctd + .8, T.ctd + 3.4) * (LINK + REPEATS + 4);
        linker.visible = beads.visible = grow > 0;
        const wave = calm ? 0 : t;
        let p = anchor.clone();
        for (let i = 0; i < LINK; i++) {
          p = anchor.clone().addScaledVector(out, 2.4 * (i + 1)).addScaledVector(side, 3 * Math.sin(i * .5));
          place(linker, i, p, smooth(grow - i));
        }
        // The tail curls to one side as it hangs, with a slow, small sway along its length.
        const dir = V();
        for (let i = 0; i < REPEATS; i++) {
          const s = i / (REPEATS - 1), turn = 1.9 * s * s + .12 * Math.sin(wave * .45 + s * 3);
          dir.copy(out).multiplyScalar(Math.cos(turn)).addScaledVector(side, Math.sin(turn)).addScaledVector(lift, .35 * Math.sin(i * .7 + wave * .5));
          p = (i ? ctd[i - 1] : p).clone().addScaledVector(dir.normalize(), 5.8);
          ctd[i].copy(p);
          place(beads, i, ctd[i], smooth(grow - LINK - i));
        }
        linker.instanceMatrix.needsUpdate = beads.instanceMatrix.needsUpdate = true;
        at.apart = apart;
        const tail = ctd.reduce((a, b) => a.add(b), V()).divideScalar(REPEATS);
        at.ctdView = groups.pol2.localToWorld(tail.clone().lerp(rpb1.userData.centre, .58));
        at.ctdRadius = .5 * tail.distanceTo(rpb1.userData.centre) + 88;
      },
      annotate(t, {label, tag}) {
        const on = (id, name) => { const m = find(id, name); return m.parent.visible && m.visible ? m.localToWorld(m.userData.centre.clone()) : null; };
        const above = (id, gap = 14) => groups[id].visible ? groups[id].localToWorld(centre[id].clone().add(V(0, -half[id] * (1 + .4 * (at.apart || 0)) - gap, 0))) : null;
        const top = id => groups[id].visible ? groups[id].localToWorld(crown[id].clone()) : null;
        const bottom = id => groups[id].visible ? groups[id].localToWorld(foot[id].clone()) : null;
        const show = (fn, p, ...rest) => { if (p) fn(p, ...rest); };
        // The callouts sit above RNAP I (to its left) and RNAP II (to its right) and below RNAP III (the right-most, where
        // there is no room above), so the three fit side by side; each leader ends on its polymerase.
        const PLACE = {pol1: {side: 'left'}, pol2: {side: 'right'}, pol3: {side: 'left', below: true}};
        if (t < T.subunits) for (const id of ['pol1', 'pol2', 'pol3']) show(label, id === 'pol3' ? bottom(id) : top(id), NAME[id], MAKES[id], {color: hex(OWN[id]), ...PLACE[id]});
        else if (t < T.shared) {
          if (t > T.subunits + 2) for (const id of ['pol1', 'pol2', 'pol3']) show(tag, above(id), `${NAME[id]} · ${groups[id].children.filter(m => m.isMesh && m.userData.rec).length} subunits`, {color: hex(OWN[id])});
        } else if (t < T.large) {
          if (t > T.shared + 1.2) {
            show(label, on('pol2', 'Rpb5'), 'Shared subunits', 'The same proteins in RNAP I, II and III', {color: hex(SHARED)});
            for (const id of ['pol1', 'pol3']) show(tag, on(id, 'Rpb5'), 'Shared', {color: hex(SHARED)});
            for (const id of ['pol1', 'pol2', 'pol3']) show(tag, above(id), NAME[id], {color: hex(OWN[id])});
          }
        } else if (t < T.sigma) {
          if (t > T.large + 2.2) {
            show(label, on('pol2', 'Rpb1'), 'Rpb1 · related to β′', 'Binds DNA', {color: '#7fa3e3'});
            show(label, on('pol2', 'Rpb2'), 'Rpb2 · related to β', 'Binds nucleotides', {color: '#56c2b1'});
            show(tag, on('bacteria', 'β′'), 'β′', {color: '#7fa3e3'});
            show(tag, on('bacteria', 'β'), 'β', {color: '#56c2b1'});
            show(tag, above('pol2'), 'RNAP II', {color: hex(OWN.pol2)});
            show(tag, above('bacteria'), 'Bacterial RNAP', {color: '#cfe3ea'});
          }
        } else if (t < T.ctd) {
          if (t > T.sigma + 1.6) {
            show(label, on('sigma70', 'σ70'), 'σ70 · bacteria only', 'Finds the promoter for the bacterial enzyme', {color: '#f094ae'});
            show(tag, above('pol2'), 'RNAP II · no σ-like subunit', {color: hex(OWN.pol2)});
            show(tag, above('bacteria'), 'Bacterial holoenzyme', {color: '#cfe3ea'});
          }
        } else if (t > T.ctd + 3.2) {
          label(groups.pol2.localToWorld(ctd[15].clone()), 'CTD · (YSPTSPS)ₙ', 'Repeats of Tyr–Ser–Pro–Thr–Ser–Pro–Ser; n = 26 in yeast, 52 in mouse', {color: '#7fa3e3'});
          show(tag, on('pol2', 'Rpb1'), 'Rpb1', {color: '#7fa3e3'});
        }
      },
    };
  },
});
