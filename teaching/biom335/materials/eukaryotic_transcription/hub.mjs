// The chapter's opening view: a nucleus with its nucleolus, chromatin threads and copies of the three yeast
// RNA polymerases (one envelope each, from the scene's structures) where they work: RNAP I in the
// nucleolus, RNAP II and RNAP III in the nucleoplasm. Hovering a polymerase lights its copies; clicking
// one opens it in the protein library. The film's labels name them.
import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {NIGHT, loadSurfaceSet, surfaceGeometry, proteinMaterial, createRenderer, studio, fitDistance, restoreEnvironment} from '../shared/molecules.mjs';
import {createLabels} from '../shared/labels.mjs';

const $ = id => document.getElementById(id), V = (...a) => new THREE.Vector3(...a);
const hex = c => '#' + c.toString(16).padStart(6, '0');
// The scenes' polymerase tints, a shade deeper: small copies read paler than a close-up.
const OWN = {pol1: 0x9784bf, pol2: 0x86a0b0, pol3: 0xc4a574};
const COPIES = {pol1: 9, pol2: 14, pol3: 8};
const LABEL = {
  pol1: ['RNAP I · nucleolus', 'rRNA, but not 5S rRNA'],
  pol2: ['RNAP II · nucleoplasm', 'mRNA and some small RNAs'],
  pol3: ['RNAP III · nucleoplasm', 'tRNA, 5S rRNA and other small RNAs'],
};
const LIBRARY = {pol1: 'rnap1', pol2: 'rnap2', pol3: 'rnap3'};
const R = 620, NUCLEOLUS = {c: V(-150, 70, 90), r: 235}, SCALE = .62;
const rmq = matchMedia('(prefers-reduced-motion: reduce)');
let calm = rmq.matches;

// A small seeded generator, so the nucleus is laid out the same way on every visit.
function random(seed) { return () => { seed = (seed + 0x6d2b79f5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t ^= t + Math.imul(t ^ (t >>> 7), 61 | t); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
const rand = random(20260926);
const inBall = r => { for (;;) { const p = V(rand() * 2 - 1, rand() * 2 - 1, rand() * 2 - 1); if (p.lengthSq() <= 1) return p.multiplyScalar(r); } };

// A soft rim for membranes and the nucleolus: bright where the surface turns away from the viewer.
function rimMaterial(color, strength, power = 2.4) {
  return new THREE.ShaderMaterial({
    uniforms: {uColor: {value: new THREE.Color(color)}, uStrength: {value: strength}},
    vertexShader: 'varying vec3 vN;varying vec3 vV;void main(){vec4 p=modelViewMatrix*vec4(position,1.);vN=normalize(normalMatrix*normal);vV=-p.xyz;gl_Position=projectionMatrix*p;}',
    fragmentShader: `uniform vec3 uColor;uniform float uStrength;varying vec3 vN;varying vec3 vV;void main(){float f=pow(1.-abs(dot(normalize(vN),normalize(vV))),${power.toFixed(2)});gl_FragColor=vec4(uColor*f*uStrength,1.);}`,
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
  });
}

async function start() {
  if (location.protocol === 'file:') return;
  const hero = $('hero'), view = $('viewport');
  let renderer;
  try { renderer = createRenderer({alpha: false, exposure: .82}); }
  catch { $('load-detail').textContent = 'This page needs WebGL 2, which this browser could not start.'; return; }
  view.append(renderer.domElement);
  const scene = new THREE.Scene(), camera = new THREE.PerspectiveCamera(30, 1, 10, 20000);
  scene.background = new THREE.Color(NIGHT);
  studio(scene, camera, renderer);
  const world = new THREE.Group(); scene.add(world);

  // Once loading has failed, the download still under way must not write over the message.
  let set, failed = false;
  try { set = await loadSurfaceSet('assets/hub.json', 'assets/hub.bin', p => { if (!failed) $('load-detail').textContent = `Loading structures · ${Math.floor(p * 10) * 10}%`; }); }
  catch (e) { failed = true; $('load-detail').textContent = `The structures could not be loaded (${e.message}).`; return; }

  // The nuclear envelope (two membranes) and the nucleolus.
  const sphere = new THREE.SphereGeometry(1, 96, 64);
  for (const [r, k] of [[R, .75], [R - 16, .32]]) { const m = new THREE.Mesh(sphere, rimMaterial(0x7fb6d0, k, 4.2)); m.scale.setScalar(r); world.add(m); }
  const nucleolus = new THREE.Group(); nucleolus.position.copy(NUCLEOLUS.c); world.add(nucleolus);
  const glow = new THREE.Mesh(sphere, rimMaterial(0xe0b67a, .75, 1.6)); glow.scale.setScalar(NUCLEOLUS.r); nucleolus.add(glow);
  const fill = new THREE.Mesh(sphere, new THREE.MeshBasicMaterial({color: 0xe0b67a, transparent: true, opacity: .045, depthWrite: false})); fill.scale.setScalar(NUCLEOLUS.r); nucleolus.add(fill);
  // Dense granules in the nucleolus.
  const grains = new Float32Array(900 * 3);
  for (let i = 0; i < 900; i++) inBall(NUCLEOLUS.r * .96).toArray(grains, i * 3);
  const dots = new THREE.Points(new THREE.BufferGeometry().setAttribute('position', new THREE.BufferAttribute(grains, 3)),
    new THREE.PointsMaterial({color: 0xe8c690, size: 3.2, sizeAttenuation: true, transparent: true, opacity: .5, depthWrite: false}));
  nucleolus.add(dots);

  // Chromatin: thin threads wandering through the nucleoplasm.
  const outsideNucleolus = (p, gap) => p.distanceTo(NUCLEOLUS.c) > NUCLEOLUS.r + gap;
  const chromatin = new THREE.MeshStandardMaterial({color: 0x5f8599, roughness: .8, transparent: true, opacity: .2, depthWrite: false});
  const threads = [];
  for (let k = 0; k < 7; k++) {
    const pts = [];
    let p; do p = inBall(R * .8); while (!outsideNucleolus(p, 30));
    for (let i = 0; i < 12; i++) {
      pts.push(p.clone());
      let q; do q = p.clone().add(inBall(170)); while (q.length() > R * .88 || !outsideNucleolus(q, 20));
      p = q;
    }
    const curve = new THREE.CatmullRomCurve3(pts, false, 'centripetal'), tube = new THREE.Mesh(new THREE.TubeGeometry(curve, 300, 3.6, 8), chromatin);
    world.add(tube); threads.push(curve);
  }

  // Polymerase copies, each slowly tumbling about its own axis.
  const copies = {}, meshes = [];
  const taken = [];
  const place = (id, i) => {
    for (let tries = 0; tries < 400; tries++) {
      const p = id === 'pol1' ? NUCLEOLUS.c.clone().add(inBall(NUCLEOLUS.r * .72)) : inBall(R * .8);
      if (id !== 'pol1' && !outsideNucleolus(p, 70)) continue;
      if (taken.every(q => q.distanceTo(p) > 115)) { taken.push(p); return p; }
    }
    return inBall(R * .5);
  };
  for (const rec of set.meta.meshes) {
    const id = rec.structure, n = COPIES[id], material = proteinMaterial(OWN[id], {rim: .14});
    const inst = new THREE.InstancedMesh(surfaceGeometry(rec, set.buffer), material, n);
    inst.userData.id = id; inst.frustumCulled = false; world.add(inst); meshes.push(inst);
    const centre = V(...rec.center);
    copies[id] = Array.from({length: n}, (_, i) => ({
      at: place(id, i), q: new THREE.Quaternion().setFromEuler(new THREE.Euler(rand() * 6.3, rand() * 6.3, rand() * 6.3)),
      axis: inBall(1).normalize(), rate: .05 + rand() * .08, centre,
    }));
  }
  // Each type's label goes on its copy nearest the viewer's side (−z), so it rarely hides behind the nucleus.
  const lead = Object.fromEntries(Object.entries(copies).map(([id, list]) => [id, list.reduce((a, b) => (b.at.z < a.at.z ? b : a))]));
  const dummy = new THREE.Object3D(), spin = new THREE.Quaternion();
  const pose = dt => {
    for (const inst of meshes) {
      copies[inst.userData.id].forEach((c, i) => {
        if (!calm) c.q.premultiply(spin.setFromAxisAngle(c.axis, c.rate * dt));
        // Instances turn about their own centre: the envelope's coordinates are about RNAP II's frame.
        dummy.quaternion.copy(c.q); dummy.scale.setScalar(SCALE);
        dummy.position.copy(c.at).sub(c.centre.clone().multiplyScalar(SCALE).applyQuaternion(c.q));
        dummy.updateMatrix(); inst.setMatrixAt(i, dummy.matrix);
      });
      inst.instanceMatrix.needsUpdate = true;
    }
  };

  // Camera, controls and labels.
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true; controls.dampingFactor = .07; controls.enablePan = false; controls.enableZoom = false; controls.rotateSpeed = .6;
  // OrbitControls claims every touch; vertical swipes should still scroll the page past the nucleus.
  renderer.domElement.style.touchAction = 'pan-y';
  renderer.domElement.addEventListener('webglcontextlost', e => e.preventDefault());
  renderer.domElement.addEventListener('webglcontextrestored', () => { restoreEnvironment(renderer, [scene]); wake(); });
  camera.position.set(.28, -.22, -1).normalize().multiplyScalar(fitDistance(camera, R * 1.04, .9)); camera.lookAt(0, 0, 0);
  const labels = createLabels($('annotations'), $('leaders'), $('hub-now'));
  let W = 0, H = 0;
  const resize = () => {
    W = hero.clientWidth; H = hero.clientHeight;
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2)); renderer.setSize(W, H, false);
    camera.aspect = W / H;
    // The nucleus sits right of the introduction on wide screens, above it on narrow ones.
    const narrow = W <= 780, ax = narrow ? .5 : .64, ay = narrow ? .34 : .47;
    camera.setViewOffset(W, H, -(ax - .5) * W, -(ay - .5) * H, W, H);
    camera.position.setLength(fitDistance(camera, R * 1.04, narrow ? .72 : .86));
    camera.updateProjectionMatrix();
    const base = hero.getBoundingClientRect(), rects = [];
    for (const el of [document.querySelector('.top'), $('hero-text'), document.querySelector('.hero-hint')]) {
      const r = el?.getBoundingClientRect(); if (r?.width) rects.push({x: r.left - base.left, y: r.top - base.top, w: r.width, h: r.height});
    }
    labels.resetSizes?.(); labels.layout(rects);
  };
  addEventListener('resize', () => { resize(); wake(); });
  resize();

  // Hover lights one polymerase's copies; a click (not a drag) opens it in the protein library.
  const ray = new THREE.Raycaster(), ndc = new THREE.Vector2();
  let hovered = null, down = null;
  const pick = e => {
    const r = renderer.domElement.getBoundingClientRect();
    ndc.set((e.clientX - r.left) / r.width * 2 - 1, -(e.clientY - r.top) / r.height * 2 + 1);
    ray.setFromCamera(ndc, camera);
    return ray.intersectObjects(meshes, false)[0]?.object.userData.id || null;
  };
  renderer.domElement.addEventListener('pointermove', e => {
    if (e.buttons) return;
    const id = pick(e);
    if (id !== hovered) { hovered = id; renderer.domElement.style.cursor = id ? 'pointer' : ''; wake(); }
  });
  renderer.domElement.addEventListener('pointerleave', () => { hovered = null; wake(); });
  renderer.domElement.addEventListener('pointerdown', e => { down = {x: e.clientX, y: e.clientY}; });
  renderer.domElement.addEventListener('pointerup', e => {
    if (!down || Math.hypot(e.clientX - down.x, e.clientY - down.y) > 5) return;
    const id = pick(e); if (id) location.href = `../protein_browser/#${LIBRARY[id]}`;
  });
  controls.addEventListener('change', wake);

  // Only while the nucleus is on screen.
  let visible = true, raf = 0, last = 0, t = 0;
  new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; if (visible) wake(); }).observe(hero);
  rmq.addEventListener('change', e => { calm = e.matches; wake(); });
  function wake() { if (!raf && visible) raf = requestAnimationFrame(frame); }
  function frame(now) {
    raf = 0;
    const dt = last ? Math.min(.05, (now - last) / 1000) : 0; last = now; t += dt;
    world.rotation.y = calm ? 0 : .32 * Math.sin(t * .05);
    pose(dt);
    for (const inst of meshes) inst.material.userData.uniforms.uGlow.value += ((hovered === inst.userData.id ? .35 : 0) - inst.material.userData.uniforms.uGlow.value) * Math.min(1, dt * 8 || 1);
    const moving = controls.update(dt);
    renderer.render(scene, camera);
    labels.begin();
    for (const [id, c] of Object.entries(lead)) labels.label(world.localToWorld(c.at.clone()), ...LABEL[id], {color: hex(OWN[id])});
    labels.tag(world.localToWorld(threads[0].getPointAt(.5)), 'Chromatin', {color: '#8fb3c6'});
    const settling = labels.end(camera, W, H, dt, 1, true);
    if (!calm || moving || settling || hovered) wake(); else last = 0;
  }
  wake();
  const ready = () => { const l = $('loader'); if (l.classList.contains('hidden')) return; l.classList.add('hidden'); setTimeout(() => { l.hidden = true; }, 800); };
  requestAnimationFrame(ready); setTimeout(ready, 600);
  if (new URLSearchParams(location.search).get('debug') === '1') window.hub = {labels: () => labels.snapshot(), shown: () => labels.shown(), copies: () => Object.fromEntries(Object.entries(copies).map(([k, v]) => [k, v.length]))};
}
start();
