// Nucleic acids as every course page draws them (the transcription film's look): a sky-blue template strand, a
// thinner ivory coding strand and orange RNA, each a smooth tube with a thin dark outline, and base pairs as one
// straight bond across the duplex, from one strand's backbone to the other's, each half coloured by its strand.
// The film, the DNA of a structure (dna.mjs) and the DNA of whole genes (chromatin.mjs) are all built from these.
import * as THREE from 'three';
import {baseMaterial} from './molecules.mjs';
import {smooth} from './ease.mjs';

const V = (...a) => new THREE.Vector3(...a);
const UP = V(0, 1, 0), EX = V(1, 0, 0);

// Colours (hex), radii (Å) and self-lighting (emissive intensity) of the strands and base-pair bonds.
export const STRANDS = {
  template: 0x72cdeb, coding: 0xe9e1cf, rna: 0xffa259,
  radius: {template: 1, coding: .72, rna: 1.3},
  glow: {template: .2, coding: .16},
  rung: {template: 0x7eaac2, coding: 0xcfc8b8, radius: .5},
  outline: 0x03080f,
};
// Wide shots keep strands at least ~1.6 px (DNA) or 2 px (RNA) wide, and their outlines visible: a strand's
// radius and outline width (Å) for a view scale in px/Å (molecules.mjs viewScale).
export const minRadius = (base, pxPerA, px = .8) => Math.max(base, px / pxPerA);
export const outlineWidth = (pxPerA, least = .3) => Math.max(least, .9 / pxPerA);
// Base-pair bonds fade out in wide shots, where they would be under a pixel wide.
export const bondFade = pxPerA => smooth((pxPerA - .35) / .4);

// A strand's material: lit a little from within, so strands read brighter than the proteins around them. With
// `vertexColors` the glow follows each vertex's colour (a fibre whose strands trade colours). With `grow` ({uMinRadius},
// shared with the strand's outline) each vertex keeps the strand at least that radius, from its own (attribute
// aRadius), so a page that rebuilds its strands only when they change keeps them visible in wide shots.
export function strandMaterial(color = 0xffffff, {glow = .035, vertexColors = false, grow = null, ...options} = {}) {
  const m = baseMaterial(color, {roughness: .4, ...(vertexColors ? {vertexColors: true} : {emissive: color, emissiveIntensity: glow}), ...options});
  if (!vertexColors && !grow) return m;
  m.onBeforeCompile = sh => {
    if (vertexColors) sh.fragmentShader = sh.fragmentShader.replace('#include <emissivemap_fragment>', `#include <emissivemap_fragment>\n  totalEmissiveRadiance += diffuseColor.rgb * ${glow.toFixed(3)};`);
    if (grow) {
      sh.uniforms.uMinRadius = grow.uMinRadius;
      sh.vertexShader = sh.vertexShader.replace('void main() {', 'attribute float aRadius;\nuniform float uMinRadius;\nvoid main() {')
        .replace('#include <begin_vertex>', '#include <begin_vertex>\n  transformed += normalize(normal) * (max(aRadius, uMinRadius) - aRadius);');
    }
  };
  m.customProgramCacheKey = () => `course-strand-${vertexColors ? glow.toFixed(3) : ''}-${grow ? 'grow' : ''}`;
  return m;
}

// The thin dark outline: the strand's own geometry drawn again from inside (back faces), pushed out along its
// normals by `width` Å in view space, so it costs no geometry of its own and fits any scale (and any growth, as
// strandMaterial's). Hidden from ambient occlusion (render.mjs), which would shade it as matter.
export function outlineMaterial(width = .3, {grow = null} = {}) {
  const m = new THREE.MeshBasicMaterial({color: STRANDS.outline, side: THREE.BackSide});
  const u = {uWidth: {value: width}};
  m.userData.noAO = true; m.userData.uniforms = u;
  m.onBeforeCompile = sh => {
    sh.uniforms.uWidth = u.uWidth;
    if (grow) sh.uniforms.uMinRadius = grow.uMinRadius;
    const extra = grow ? ' + max(aRadius, uMinRadius) - aRadius' : '';
    sh.vertexShader = sh.vertexShader.replace('void main() {', `uniform float uWidth;${grow ? '\nattribute float aRadius;\nuniform float uMinRadius;' : ''}\nvoid main() {`)
      .replace('#include <project_vertex>', `#include <project_vertex>\n  mvPosition.xyz += normalize(normalMatrix * normal) * (uWidth${extra});\n  gl_Position = projectionMatrix * mvPosition;`);
  };
  m.customProgramCacheKey = () => `course-strand-outline${grow ? '-grow' : ''}`;
  return m;
}

const capGeometry = new THREE.SphereGeometry(1, 14, 10);
// A tube through points[0 … count) with rotation-minimising frames, rebuilt in place (update(count)) as often as a
// page likes. Rounded end caps; `outline` adds the dark outline (its width set with tube.outline.width); `taper`
// (Å, set on the tube) closes a sleeve in rounded ends over its last stretch, its normals leaning to match. A
// custom `material` (a glow sleeve, say) has no caps unless asked. `axis`: the direction that seeds the first frame
// when a tube starts along world y (the film passes its DNA axis).
export function createTube(group, {color = 0xffffff, radius = 1, max, sides = 8, glow = .035, material = null, outline = false, capped = !material, axis = EX} = {}) {
  const ring = sides + 1, position = new Float32Array(max * ring * 3), normal = new Float32Array(position.length);
  const index = new (max * ring < 65536 ? Uint16Array : Uint32Array)((max - 1) * sides * 6);
  const cos = Float32Array.from({length: ring}, (_, j) => Math.cos(j / sides * Math.PI * 2)), sin = Float32Array.from({length: ring}, (_, j) => Math.sin(j / sides * Math.PI * 2));
  // Wound counter-clockwise seen from outside (front faces out, like the normals), so FrontSide shows the outer wall.
  for (let i = 0, k = 0; i < max - 1; i++) for (let j = 0; j < sides; j++, k += 6) { const a = i * ring + j, b = a + ring; index.set([a, a + 1, b, b, a + 1, b + 1], k); }
  const g = new THREE.BufferGeometry(), pa = new THREE.BufferAttribute(position, 3).setUsage(THREE.DynamicDrawUsage), na = new THREE.BufferAttribute(normal, 3).setUsage(THREE.DynamicDrawUsage);
  g.setAttribute('position', pa); g.setAttribute('normal', na); g.setIndex(new THREE.BufferAttribute(index, 1));
  const m = material || strandMaterial(color, {glow}), mesh = new THREE.Mesh(g, m), caps = [0, 1].map(() => new THREE.Mesh(capGeometry, m));
  mesh.frustumCulled = false; caps.forEach(c => { c.scale.setScalar(radius); c.frustumCulled = false; }); group.add(mesh, ...caps);
  let hull = null;
  if (outline) {
    const hm = outlineMaterial(), hullMesh = new THREE.Mesh(g, hm), hullCaps = [0, 1].map(() => new THREE.Mesh(capGeometry, hm));
    hullMesh.frustumCulled = false; hullCaps.forEach(c => { c.frustumCulled = false; }); group.add(hullMesh, ...hullCaps);
    hull = {mesh: hullMesh, material: hm, caps: hullCaps, get width() { return hm.userData.uniforms.uWidth.value; }, set width(w) { hm.userData.uniforms.uWidth.value = w; }};
  }
  const points = Array.from({length: max}, () => V()), t = V(), n = V(), b = V(), v = V(), arc = new Float32Array(max);
  return {mesh, material: m, points, count: 0, radius, base: radius, taper: 0, outline: hull, update(count) {
    const radius = this.radius, taper = this.taper, show = count > 1;
    this.count = count; mesh.visible = show;
    caps.forEach(c => { c.scale.setScalar(radius); c.visible = show && capped; });
    if (hull) { hull.mesh.visible = show; hull.caps.forEach(c => { c.scale.setScalar(radius); c.visible = show; }); }
    if (!show) return;
    let total = 0;
    if (taper > 0) { arc[0] = 0; for (let i = 1; i < count; i++) arc[i] = arc[i - 1] + points[i].distanceTo(points[i - 1]); total = arc[count - 1]; }
    for (let i = 0; i < count; i++) {
      const p = points[i]; t.subVectors(points[Math.min(count - 1, i + 1)], points[Math.max(0, i - 1)]); if (t.lengthSq() < 1e-12) t.copy(axis); t.normalize();
      if (i > 0) n.addScaledVector(t, -n.dot(t)); if (i === 0 || n.lengthSq() < 1e-8) n.copy(Math.abs(t.y) < .9 ? UP : axis).cross(t);
      n.normalize(); b.crossVectors(t, n);
      let r = radius, lean = 0;
      if (taper > 0) {
        const L = Math.min(taper, total / 2) || 1, from = arc[i], to = total - from, u = Math.min(1, Math.max(0, Math.min(from, to) / L)), q = Math.sqrt(Math.max(u * (2 - u), 1e-4));
        r = radius * q; lean = u < 1 ? (from <= to ? -1 : 1) * radius * (1 - u) / (L * q) : 0;
      }
      for (let j = 0; j <= sides; j++) {
        const k = (i * ring + j) * 3; v.copy(n).multiplyScalar(cos[j]).addScaledVector(b, sin[j]);
        position[k] = p.x + r * v.x; position[k + 1] = p.y + r * v.y; position[k + 2] = p.z + r * v.z;
        if (lean) v.addScaledVector(t, lean).normalize();
        normal[k] = v.x; normal[k + 1] = v.y; normal[k + 2] = v.z;
      }
    }
    caps[0].position.copy(points[0]); caps[1].position.copy(points[count - 1]);
    if (hull) { hull.caps[0].position.copy(points[0]); hull.caps[1].position.copy(points[count - 1]); }
    g.setDrawRange(0, (count - 1) * sides * 6);
    for (const attr of [pa, na]) { attr.clearUpdateRanges(); attr.addUpdateRange(0, count * ring * 3); attr.needsUpdate = true; }
  }};
}

// ---------- Bonds ----------
// Instanced cylinders along a segment (bonds, base-pair halves, stubs): one unit cylinder scaled per instance.
export const bondGeometry = new THREE.CylinderGeometry(1, 1, 1, 8);
const dummy = new THREE.Object3D(), _d = V();
// A cylinder of radius r from a to b (`visible` scales its width, 0 hides it).
export function between(inst, i, a, b, r, visible = 1) {
  _d.subVectors(b, a); const len = _d.length();
  dummy.position.copy(a).add(b).multiplyScalar(.5); dummy.quaternion.setFromUnitVectors(UP, len > 1e-6 ? _d.divideScalar(len) : UP);
  dummy.scale.set(r * visible, len, r * visible); dummy.updateMatrix(); inst.setMatrixAt(i, dummy.matrix);
}
// A cylinder from a towards b, shortened to the fraction k of that distance (k < .01 hides it).
export function halfRung(inst, i, a, b, r, k) {
  if (k < .01) { dummy.position.copy(a); dummy.scale.setScalar(0); }
  else {
    _d.subVectors(b, a).multiplyScalar(k); const len = _d.length();
    dummy.position.copy(a).addScaledVector(_d, .5); dummy.quaternion.setFromUnitVectors(UP, len > 1e-6 ? _d.divideScalar(len) : UP); dummy.scale.set(r, len, r);
  }
  dummy.updateMatrix(); inst.setMatrixAt(i, dummy.matrix);
}
// A sphere of radius r at p (r = 0 hides it).
export function point(inst, i, p, r = 1) { dummy.position.copy(p); dummy.quaternion.identity(); dummy.scale.setScalar(r); dummy.updateMatrix(); inst.setMatrixAt(i, dummy.matrix); }
export function finish(inst) { inst.instanceMatrix.needsUpdate = true; inst.frustumCulled = false; }

// Base-pair bonds: two instanced halves per pair (`[template side, coding side]`, each with its strand's rung colour).
export function createRungs(group, count, colors = [STRANDS.rung.template, STRANDS.rung.coding]) {
  return colors.map(c => {
    const m = new THREE.InstancedMesh(bondGeometry, baseMaterial(0xffffff, {roughness: .55}), count), col = new THREE.Color(c);
    for (let i = 0; i < count; i++) m.setColorAt(i, col);
    m.frustumCulled = false; group.add(m); return m;
  });
}
const _mid = V();
// Pair i's bond from backbone p (the first half's strand) to backbone q: one straight line, split where it crosses
// the middle, each half drawn from its own strand a fraction k of the way (k < 1 while a duplex melts).
export function pairRung(rungs, i, p, q, k = 1, r = STRANDS.rung.radius) {
  _mid.addVectors(p, q).multiplyScalar(.5);
  halfRung(rungs[0], i, p, _mid, r, k); halfRung(rungs[1], i, q, _mid, r, k);
}
