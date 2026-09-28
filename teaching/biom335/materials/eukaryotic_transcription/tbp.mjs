// Scene: the TATA-binding protein (human TBP core on the adenovirus major late promoter TATA box, from the
// TBP–TFIIB–DNA structure PDB 1C9B, whose flanks show the full ~80° bend; TFIIB is not drawn). The
// crystal's 17 bp are extended by arms of ideal B-DNA. Before TBP binds, the same base pairs lie on a
// straight B-form helix; as TBP settles into the minor groove the duplex morphs to the crystal's bent,
// unwound path, so the ~80° bend is the structure's own.
import * as THREE from 'three';
import {runScene} from '../shared/scene_player.mjs';
import {PALETTE, loadSurfaceSet, surfaceGeometry, proteinMaterial} from '../shared/molecules.mjs';
import {smooth, ramp} from '../shared/ease.mjs';
import {pairsFromStrands, frameFromPairs, straightFrames, extend, padPairs, createDuplex, createMorph, minorGroove} from '../shared/dna.mjs';

const V = (...a) => new THREE.Vector3(...a);
const hex = c => '#' + c.toString(16).padStart(6, '0');
const ARM = 22;              // ideal base pairs added on each side of the crystal's 17

const T = {groove: 10, saddle: 19, bend: 28, surface: 39, universal: 48, end: 58};
const steps = [
  {t: 0, nav: 'The TATA box', title: 'TBP recognises<br>the TATA box.', notes: 'tata-binding-protein-tbp-is-a-universal-factor',
    text: 'TBP directly recognises TATA DNA at TATA-containing promoters, while other components of its complexes help position the machinery at TATA-less promoters.'},
  {t: T.groove, nav: 'Minor groove', title: 'It binds in the<br>minor groove.', notes: 'tata-binding-protein-tbp-is-a-universal-factor',
    text: 'TBP binds DNA in the minor groove. This is unusual for a DNA-binding protein.'},
  {t: T.saddle, nav: 'A saddle', title: 'A saddle<br>astride the DNA.', notes: 'tata-binding-protein-tbp-is-a-universal-factor',
    text: 'TBP forms a saddle-like structure around the DNA.'},
  {t: T.bend, nav: 'About 80°', title: 'The DNA bends<br>by about 80°.', notes: 'tata-binding-protein-tbp-is-a-universal-factor', hold: 1.1,
    text: 'TBP bends the DNA by approximately 80 degrees. The sharp kink is accompanied by significant unwinding of the DNA, and allows other transcription machinery to bind.'},
  {t: T.surface, nav: 'Outer surface', title: 'Its outer surface<br>contacts other proteins.', notes: 'tata-binding-protein-tbp-is-a-universal-factor',
    text: 'TBP’s larger outer surface is exposed and available to contact other proteins for the recruitment of RNAP.'},
  {t: T.universal, nav: 'A universal factor', title: 'One factor for<br>all three RNAPs.', notes: 'tata-binding-protein-tbp-is-a-universal-factor',
    text: 'TBP is a component of the Pol I factor SL1, the Pol II factor TFIID and the Pol III factor TFIIIB.'},
];

const at = {};  // positions the camera shots read (scene frame: DNA along x, TBP above, towards −y)

runScene({
  pageTitle: 'TBP bends the TATA box · Eukaryotic transcription', eyebrow: 'The TATA-binding protein',
  links: [{href: 'index.html', text: 'All scenes'}, {href: '../protein_browser/#tbp', text: 'Protein library'}],
  steps, duration: T.end, notesPage: 'notes.html', fov: 28,
  // TBP is seen from a three-quarter view, a little above and along the DNA, so its saddle shows its side and the curve
  // of its underside; the bend is seen square to its plane, so the angle reads true.
  shots: [
    {t: 0, target: [0, -24, 0], dir: [1, -.4, -1], radius: 100, fill: .95},
    {t: T.groove, blend: 2.6, target: [0, -6, 0], dir: [1, -.5, -.75], radius: 54, fill: .9},
    {t: T.saddle, blend: 2.8, target: [0, -12, 0], dir: [1, -.52, -.34], radius: 62, fill: .9},
    {t: T.bend, blend: 2.8, frame: () => ({target: at.bendView || V(), dir: at.bendDir || [0, -.12, -1], radius: 92, fill: .95})},
    {t: T.surface, blend: 2.6, target: [0, -14, 0], dir: [-.45, -.85, -1], radius: 50, fill: .9},
    {t: T.universal, blend: 2.6, target: [0, -8, 0], dir: [.85, -.4, -1], radius: 70, fill: .95},
  ],
  async build({world, progress}) {
    const set = await loadSurfaceSet('assets/tbp.json', 'assets/tbp.bin', progress);
    const strand = name => set.meta.strands.find(s => s.name === name);
    const pairs = pairsFromStrands(strand('TATA strand'), strand('complementary strand'));
    // The TATA box (TATAAAAG) within the crystal's pairs; its centre stays put while the DNA bends.
    const box = pairs.map(p => p.a.letter).join('').indexOf('TATAAAAG'), TATA = [box, box + 7], ANCHOR = box + 4;
    if (box < 0) throw new Error('TATA box not found');
    const bent = frameFromPairs(pairs), bentX = extend(bent, ARM, ARM), all = padPairs(pairs, ARM, ARM);
    // The two arms of the bent DNA: the left one's direction towards the TATA box, the right one's away from it.
    const line = (a, b) => ({a, d: b.clone().sub(a).normalize()});
    const L = line(bentX[2].origin, bentX[ARM - 2].origin), R = line(bentX[bentX.length - ARM + 1].origin, bentX[bentX.length - 3].origin);
    // Unbent, the DNA runs along the mean of the two arms through the TATA box's centre (the base pairs there
    // are too tilted and unwound for their own normal to give the path).
    const axis = L.d.clone().add(R.d).normalize(), centre = bent[ANCHOR];
    const lined = bent.slice(); lined[ANCHOR] = {origin: centre.origin, q: new THREE.Quaternion().setFromUnitVectors(V(0, 0, 1).applyQuaternion(centre.q), axis).multiply(centre.q)};
    const straightX = extend(straightFrames(lined, {anchor: ANCHOR}), ARM, ARM);
    const morph = createMorph(straightX, bentX, ANCHOR + ARM), frames = [];

    // The scene frame: the TATA box's centre at the origin, the straight DNA along x and TBP above it (−y is up
    // on screen), from the crystal's own geometry.
    const rec = set.meta.meshes.find(m => m.name === 'TBP'), tbpCentre = V(...rec.center);
    const origin = centre.origin.clone();
    const up = tbpCentre.clone().sub(origin); up.addScaledVector(axis, -up.dot(axis)).normalize();
    const basis = new THREE.Matrix4().makeBasis(axis, up, axis.clone().cross(up));
    const target = new THREE.Matrix4().makeBasis(V(1, 0, 0), V(0, -1, 0), V(0, 0, -1));
    const frame = new THREE.Group();
    frame.quaternion.setFromRotationMatrix(target.multiply(basis.clone().transpose()));
    frame.position.copy(origin).applyQuaternion(frame.quaternion).negate();
    world.add(frame);

    const duplex = createDuplex({pairs: all});
    duplex.tint(PALETTE.tata, all.map((_, i) => i >= ARM + TATA[0] && i <= ARM + TATA[1] ? 1 : 0));
    frame.add(duplex.group);

    // TBP, with a vertex shade that can light its outer surface (the side away from the DNA).
    const geometry = surfaceGeometry(rec, set.buffer), pos = geometry.attributes.position;
    const dna = [...bentX.map(f => f.origin)], outer = new Float32Array(pos.count), colour = new Float32Array(pos.count * 3).fill(1);
    const p = V();
    for (let i = 0; i < pos.count; i++) {
      p.fromBufferAttribute(pos, i);
      let d = Infinity; for (const o of dna) d = Math.min(d, p.distanceToSquared(o));
      outer[i] = smooth((Math.sqrt(d) - 17) / 8);  // the DNA's axis is ~10 Å from its surface
    }
    geometry.setAttribute('color', new THREE.BufferAttribute(colour, 3));
    const material = proteinMaterial(PALETTE.tbp); material.vertexColors = true;
    const tbp = new THREE.Mesh(geometry, material), tbpHome = new THREE.Group();
    tbpHome.add(tbp); frame.add(tbpHome);
    const shade = new THREE.Color(1.5, 1.3, 1), lit = {w: -1};
    const setGlow = w => {
      if (Math.abs(w - lit.w) < 1e-3) return; lit.w = w;
      for (let i = 0; i < pos.count; i++) { const k = w * outer[i]; colour[3 * i] = 1 + (shade.r - 1) * k; colour[3 * i + 1] = 1 + (shade.g - 1) * k; colour[3 * i + 2] = 1 + (shade.b - 1) * k; }
      geometry.attributes.color.needsUpdate = true;
    };

    // The bend angle, from the arms of the bent duplex: the straight continuation of the left arm (dashed) and
    // the right arm as it is, with an arc between them at their meeting point.
    const w0 = L.a.clone().sub(R.a), b = L.d.dot(R.d), dd = L.d.dot(w0), e = R.d.dot(w0), den = 1 - b * b;
    const vertex = L.a.clone().addScaledVector(L.d, (b * e - dd) / den).add(R.a.clone().addScaledVector(R.d, (e - b * dd) / den)).multiplyScalar(.5);
    const angle = L.d.angleTo(R.d);
    const arcR = 30, normal = L.d.clone().cross(R.d).normalize(), arcPts = [];
    for (let k = 0; k <= 40; k++) arcPts.push(vertex.clone().addScaledVector(L.d.clone().applyAxisAngle(normal, angle * k / 40), arcR));
    const guideMat = new THREE.LineDashedMaterial({color: 0xe8f1f4, dashSize: 2.2, gapSize: 1.6, transparent: true, opacity: 0, depthTest: false});
    const arcMat = new THREE.LineBasicMaterial({color: PALETTE.tata, transparent: true, opacity: 0, depthTest: false});
    const guide = new THREE.Line(new THREE.BufferGeometry().setFromPoints([vertex.clone().addScaledVector(L.d, -12), vertex.clone().addScaledVector(L.d, 62)]), guideMat);
    const armLine = new THREE.Line(new THREE.BufferGeometry().setFromPoints([vertex.clone().addScaledVector(R.d, -12), vertex.clone().addScaledVector(R.d, 62)]), guideMat);
    const arc = new THREE.Line(new THREE.BufferGeometry().setFromPoints(arcPts), arcMat);
    guide.computeLineDistances(); armLine.computeLineDistances();
    for (const o of [guide, armLine, arc]) { o.renderOrder = 5; frame.add(o); }
    at.degrees = Math.round(THREE.MathUtils.radToDeg(angle));

    const inFrame = v => frame.localToWorld(v.clone());
    at.bendView = inFrame(vertex).lerp(V(0, 0, 0), .55);
    // Seen square to the plane of the bend (from the viewer's side, a little from above).
    const n = normal.clone().applyQuaternion(frame.quaternion); if (n.z > 0) n.negate();
    if (n.y > -.15) n.y = -.15;  // never from below
    at.bendDir = n.normalize().toArray();
    // Where TBP sits over the DNA before it settles, along its own "up".
    const upLocal = up.clone();
    let posed = -1;
    return {
      duplex, tbp, at,  // for tests (?debug=1)
      update(t, {pxPerA = 1} = {}) {
        duplex.view(pxPerA);
        // TBP arrives above the TATA box, meets the minor groove, then settles as the DNA bends.
        const bend = ramp(t, T.bend + .6, T.bend + 4.6);
        const lift = 52 * (1 - ramp(t, T.groove - .2, T.groove + 3.2)) + 7 * (1 - bend);
        tbpHome.position.copy(upLocal).multiplyScalar(lift);
        // The duplex is rebuilt only while it bends (or when first drawn).
        if (bend !== posed) { morph(bend, frames); duplex.pose(frames); posed = bend; }
        at.bend = bend;
        const show = ramp(t, T.bend + 4.4, T.bend + 5.4) * (1 - ramp(t, T.surface - .6, T.surface));
        guideMat.opacity = .7 * show; arcMat.opacity = .95 * show;
        guide.visible = armLine.visible = arc.visible = show > .01;
        setGlow(ramp(t, T.surface + .4, T.surface + 1.8) * (1 - ramp(t, T.universal + .4, T.universal + 1.6)));
        tbp.material.userData.uniforms.uGlow.value = .12 * ramp(t, T.universal + .4, T.universal + 1.6);
        at.frames = frames;
      },
      annotate(t, {label, tag, bracket}) {
        const pair = i => frames[ARM + i], w = v => inFrame(v);
        const top = w(tbpCentre.clone().addScaledVector(upLocal, 14 + tbpHome.position.length()));
        if (t < T.groove) {
          bracket(w(pair(TATA[0]).origin.clone().addScaledVector(upLocal, 16)), w(pair(TATA[1]).origin.clone().addScaledVector(upLocal, 16)), 'TATA box · TATAAAAG');
          if (t > 1.2) label(w(tbpCentre.clone().add(tbpHome.position)), 'TBP', 'TATA-binding protein', {color: hex(PALETTE.tbp)});
        } else if (t < T.saddle) {
          if (t > T.groove + 3.2) {
            const f = pair(ANCHOR + 2);
            label(w(f.origin.clone().addScaledVector(minorGroove(all[ARM + ANCHOR + 2], f), 8)), 'Minor groove', 'TBP binds along it', {color: hex(PALETTE.tata)});
            tag(top, 'TBP', {color: hex(PALETTE.tbp)});
          }
        } else if (t < T.bend) {
          if (t > T.saddle + 2.4) {
            label(top, 'TBP · a saddle', 'Sits astride the DNA', {color: hex(PALETTE.tbp)});
            tag(w(pair(ANCHOR + 13).origin), 'DNA', {color: '#72cdeb'});
          }
        } else if (t < T.surface) {
          if (at.bend > .98 && t > T.bend + 5.4) {
            const mid = arc.geometry.attributes.position, m = V().fromBufferAttribute(mid, 20);
            tag(w(m), `about ${Math.round(at.degrees / 5) * 5}°`, {color: hex(PALETTE.tata)});
            label(w(pair(TATA[0] + 1).origin), 'TATA box · partly unwound', 'Its minor groove widens under TBP', {color: hex(PALETTE.tata)});
          }
        } else if (t < T.universal) {
          if (t > T.surface + 1.8) label(top, 'Outer surface', 'Free to contact other proteins', {color: '#f3cf97'});
        } else if (t > T.universal + 1.6) {
          tag(top, 'TFIID · RNAP II', {color: hex(PALETTE.tbp)});
          tag(w(tbpCentre.clone().addScaledVector(upLocal, 4).addScaledVector(axis, -30)), 'SL1 · RNAP I', {color: hex(PALETTE.tbp)});
          tag(w(tbpCentre.clone().addScaledVector(upLocal, 4).addScaledVector(axis, 30)), 'TFIIIB · RNAP III', {color: hex(PALETTE.tbp)});
        }
      },
    };
  },
});
