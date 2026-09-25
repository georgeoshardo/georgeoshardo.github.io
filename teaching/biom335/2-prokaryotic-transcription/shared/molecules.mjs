// Shared 3D toolkit for the course's pages: loads the exported molecular surfaces and renders them the
// way the transcription film does (tone, fresnel rim, studio lights, room environment, ACES tone mapping).
// Surface sets are a JSON index plus one binary buffer; each record points at Float32 positions and
// normals and a Uint16/Uint32 index (byte offsets, element lengths), as written by the build_*.py exporters.
import * as THREE from 'three';
import {RoomEnvironment} from 'three/addons/environments/RoomEnvironment.js';

export const NIGHT = 0x070e17;
// Proteins sit a shade deeper than their nominal colour, so nucleic acids and highlights read brightest.
export const PROTEIN_TONE = .86;
// Molecule colours (hex), shared with the film: α gold, β teal and β′ blue are the film's assembly tints
// (its TINT), so each subunit stays distinct; alpha2 is a shade darker to separate the two α chains. ω is a
// shade deeper than the film's tint (0xa7a39a): without the film's ambient occlusion that light grey reads as
// white. σ rose, NusA lime, NusG amber and Rho violet (one shade per protomer) are the film's surface colours.
export const PALETTE = {
  alpha: 0xb9a47a, alpha2: 0xa99670, beta: 0x2f9e8f, betaPrime: 0x4a74b8, omega: 0x8a867d,
  sigma: 0xe987a3, nusA: 0xafcf5c, nusG: 0xa8743a, nusGKow: 0xc08a4c,
  rho: [0x9875b8, 0x8967a9, 0x785799, 0x775b95, 0x8568a4, 0x9577b6],
};

export async function loadSurfaceSet(jsonUrl, binUrl, onProgress) {
  const [meta, buffer] = await Promise.all([
    fetch(jsonUrl).then(r => { if (!r.ok) throw new Error(`${jsonUrl}: ${r.status}`); return r.json(); }),
    fetchBuffer(binUrl, onProgress),
  ]);
  return {meta, buffer, byName: new Map(meta.meshes.map(m => [m.name, m])), byId: new Map(meta.meshes.filter(m => m.id).map(m => [m.id, m]))};
}

async function fetchBuffer(url, onProgress) {
  const r = await fetch(url);
  if (!r.ok) throw new Error(`${url}: ${r.status}`);
  // Content-Length is only a progress hint: a compressed response streams more bytes than it states.
  const total = +r.headers.get('content-length') || 0;
  if (!r.body || !total || !onProgress) return r.arrayBuffer();
  const reader = r.body.getReader(), chunks = [];
  let got = 0;
  for (;;) { const {done, value} = await reader.read(); if (done) break; chunks.push(value); got += value.length; onProgress(Math.min(1, got / total)); }
  const out = new Uint8Array(got);
  let at = 0;
  for (const c of chunks) { out.set(c, at); at += c.length; }
  return out.buffer;
}

// Geometry for one record; views share the buffer, so every page that shows a molecule costs one upload.
const geometryCache = new WeakMap();
export function surfaceGeometry(record, buffer) {
  let perBuffer = geometryCache.get(buffer);
  if (!perBuffer) geometryCache.set(buffer, perBuffer = new Map());
  if (perBuffer.has(record)) return perBuffer.get(record);
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(buffer, record.position.offset, record.position.length), 3));
  if (record.normal) g.setAttribute('normal', new THREE.BufferAttribute(new Float32Array(buffer, record.normal.offset, record.normal.length), 3));
  else g.computeVertexNormals();
  const Index = record.index.type === 'uint16' ? Uint16Array : Uint32Array;
  g.setIndex(new THREE.BufferAttribute(new Index(buffer, record.index.offset, record.index.length), 1));
  g.computeBoundingSphere(); g.computeBoundingBox();
  perBuffer.set(record, g);
  return g;
}

// The film's protein surface: matte physical material with a faint fresnel rim that separates
// neighbouring subunits. uniforms.uRim and uniforms.uGlow can be animated (hover, highlight, dimming).
export function proteinMaterial(color, {rim = .2} = {}) {
  const tone = new THREE.Color(color).multiplyScalar(PROTEIN_TONE);
  const m = new THREE.MeshPhysicalMaterial({color: tone, roughness: .63, metalness: 0, clearcoat: 0, envMapIntensity: .2, side: THREE.DoubleSide});
  const uniforms = {uRim: {value: rim}, uGlow: {value: 0}, uRimColor: {value: new THREE.Color(color).lerp(new THREE.Color(0xdff4ff), .6)}};
  m.userData.uniforms = uniforms; m.userData.base = tone.clone();
  m.onBeforeCompile = sh => {
    Object.assign(sh.uniforms, uniforms);
    // The rim is added in linear light, before tone mapping and sRGB encoding, so it looks the same whether a
    // page renders straight to the canvas or through post-processing (as the film does).
    sh.fragmentShader = sh.fragmentShader.replace('void main() {', 'uniform float uRim,uGlow;uniform vec3 uRimColor;\nvoid main() {')
      .replace('#include <opaque_fragment>', `#include <opaque_fragment>
  float fr=clamp(1.-abs(dot(normalize(normal),normalize(vViewPosition))),0.,1.);
  gl_FragColor.rgb+=(uRim+uGlow)*fr*fr*sqrt(fr)*uRimColor*gl_FragColor.a+uGlow*.06*uRimColor;`);
  };
  m.customProgramCacheKey = () => 'course-protein';
  return m;
}

// Renderer settings shared by every page.
export function createRenderer({canvas, alpha = false, antialias = true, exposure = .95} = {}) {
  const renderer = new THREE.WebGLRenderer({canvas, alpha, antialias, powerPreference: 'high-performance'});
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = exposure;
  return renderer;
}

// A soft room reflection, as in the film. After a lost WebGL context is restored the texture's contents are gone,
// so the cache entry is dropped and the next call (see restoreEnvironment) builds it again.
const environments = new WeakMap();
export function restoreEnvironment(renderer, scenes) {
  environments.get(renderer)?.dispose(); environments.delete(renderer);
  const texture = roomEnvironment(renderer);
  for (const scene of scenes) scene.environment = texture;
  return texture;
}
export function roomEnvironment(renderer) {
  if (environments.has(renderer)) return environments.get(renderer);
  const pmrem = new THREE.PMREMGenerator(renderer), room = new RoomEnvironment();
  const texture = pmrem.fromScene(room, .04).texture;
  room.dispose(); pmrem.dispose(); environments.set(renderer, texture);
  return texture;
}

// Studio lighting from the film: a cool sky light plus key, fill and rim lights fixed to the camera,
// so a molecule is never lit from below however it is turned. The teaching frame has world −y up.
export function studio(scene, camera, renderer) {
  scene.environment = roomEnvironment(renderer);
  scene.environmentRotation.x = Math.PI;
  const hemi = new THREE.HemisphereLight(0xa6c7dc, 0x111724, .45);
  hemi.position.set(0, -1, 0);
  scene.add(hemi, camera);
  for (const [c, i, p] of [[0xffedd9, 2.6, [-60, 55, 60]], [0x83bdda, 1.4, [70, -30, 40]], [0xa4b6ff, .8, [30, 40, -100]]]) {
    const l = new THREE.DirectionalLight(c, i);
    l.position.set(...p); l.target.position.set(0, 0, -100);
    camera.add(l, l.target);
  }
  camera.up.set(0, -1, 0);
}

// The centre and radius enclosing a group of meshes.
export function bounds(object) {
  const box = new THREE.Box3().setFromObject(object), sphere = box.getBoundingSphere(new THREE.Sphere());
  return {box, center: sphere.center, radius: sphere.radius};
}

// Distance at which a sphere of this radius fills `fill` of the view's smaller dimension.
export function fitDistance(camera, radius, fill = .82) {
  const vfov = camera.fov * Math.PI / 180, hfov = 2 * Math.atan(Math.tan(vfov / 2) * camera.aspect);
  return radius / Math.sin(Math.min(vfov, hfov) / 2) / fill;
}
