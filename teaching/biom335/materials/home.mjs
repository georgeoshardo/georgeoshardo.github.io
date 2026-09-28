// The landing page's hero: a long double helix in the course's colours, sweeping through the view and slowly turning
// about its own axis. It is drawn as every page draws DNA (shared/dna.mjs, from the ideal B-DNA the scenes use) and
// rendered as the film is (shared/render.mjs). The page reads the same without it: the helix fades in once drawn,
// stops while the hero is off screen or the tab hidden, and holds still with reduced motion.
import * as THREE from 'three';
import {createRenderer, studio, NIGHT, viewScale, restoreEnvironment} from './shared/molecules.mjs';
import {createPipeline, TIERS} from './shared/render.mjs';
import {pairsFromStrands, frameFromPairs, meanLocal, sequencePairs, createDuplex, RISE, TWIST} from './shared/dna.mjs';
import {prefs} from './shared/prefs.mjs';

const $ = id => document.getElementById(id), V = (...a) => new THREE.Vector3(...a);
const SPIN = .22;   // rad/s the helix turns about its axis
const NEAR = V(110, 45, 640);  // where the helix passes closest: its strands keep the film's widths there
// Where the helix runs (Å), seen from the origin looking along +z (world −y is up on screen and +x is right, as on
// every page): from far away above the title, towards the viewer and close past the right of centre, and out of view
// at the lower right.
const PATH = [V(-1893, -1331, 4600), V(-617, -563, 3000), V(39, -96, 1500), V(110, 45, 640), V(121, 122, 380), V(123, 174, 300)];

async function start() {
  const hero = $('hero'), view = $('viewport');
  const rmq = matchMedia('(prefers-reduced-motion: reduce)');
  const motion = () => prefs.get('motion') || 'auto';
  let calm = motion() === 'auto' ? rmq.matches : motion() === 'reduced';
  let renderer;
  try { renderer = createRenderer({antialias: false, exposure: .95}); } catch { return; }  // no WebGL 2: the page reads as it is
  view.append(renderer.domElement);
  const size = () => [Math.max(1, hero.clientWidth), Math.max(1, hero.clientHeight)];
  const scene = new THREE.Scene(), camera = new THREE.PerspectiveCamera(30, 1, 20, 12000);
  scene.background = new THREE.Color(NIGHT); scene.fog = new THREE.FogExp2(NIGHT, .00042);
  studio(scene, camera, renderer);

  // Ideal B-DNA: the mean base-pair geometry of a straight stretch of RNA polymerase II's downstream DNA (9QEB), as the
  // methylation scene draws it.
  let meta;
  try { meta = await fetch('eukaryotic_transcription/assets/methylation.json').then(r => { if (!r.ok) throw new Error(r.status); return r.json(); }); }
  catch { return; }
  const strand = n => meta.strands.find(s => s.structure === 'bdna' && s.name === n);
  const bdna = pairsFromStrands(strand('non-template'), strand('template'));
  frameFromPairs(bdna);
  const local = meanLocal(bdna.slice(4, bdna.length - 4));

  // One base pair every 3.38 Å along the path, each turned 34.3° on the last; frames carried along the curve so the
  // helix never twists about its path except by its own turn.
  const curve = new THREE.CatmullRomCurve3(PATH, false, 'centripetal'), length = curve.getLength(), n = Math.floor(length / RISE);
  const at = [], along = [], across = [];
  let x = V(0, 1, 0);
  for (let i = 0; i < n; i++) {
    const u = i * RISE / length, p = curve.getPointAt(u), z = curve.getTangentAt(u).normalize();
    x.addScaledVector(z, -x.dot(z)).normalize(); at.push(p); along.push(z); across.push(x.clone());
  }
  const bases = 'ACGT', sequence = Array.from({length: n}, (_, i) => bases[(i * 7 + (i >> 3)) % 4]).join('');
  const duplex = createDuplex({pairs: sequencePairs(sequence, local), samples: 3});
  scene.add(duplex.group);
  const frames = at.map(() => ({origin: V(), q: new THREE.Quaternion()})), m = new THREE.Matrix4(), xi = V(), yi = V();
  const pose = phase => {
    for (let i = 0; i < n; i++) {
      xi.copy(across[i]).applyAxisAngle(along[i], i * TWIST + phase); yi.crossVectors(along[i], xi);
      frames[i].origin.copy(at[i]); frames[i].q.setFromRotationMatrix(m.makeBasis(xi, yi, along[i]));
    }
    duplex.pose(frames);
  };

  // The camera looks at the near part of the helix from the front, a little from below, with the helix right of the
  // title on wide screens and above it on narrow ones.
  const target = V(0, 0, 1000), eye = V(0, 0, 0), look = V();
  const pipeline = createPipeline(renderer, scene, camera, {size});
  const saved = prefs.get('quality');
  pipeline.setTier(TIERS[saved] ? saved : 'balanced');
  // Portrait screens see less sideways, so the eye steps back until the helix's near sweep fits.
  let back = 0;
  const frame = () => {
    const [W, H] = size(), narrow = W <= 780;
    camera.aspect = W / H; back = 650 * Math.min(1, Math.max(0, (1.2 - camera.aspect) / .74));
    camera.setViewOffset(W, H, (.5 - (narrow ? .5 : .6)) * W, (.5 - (narrow ? .34 : .42)) * H, W, H);
    camera.updateProjectionMatrix(); pipeline.syncCamera();
  };
  const resize = () => { pipeline.resize(); frame(); };
  addEventListener('resize', () => { resize(); wake(); });
  resize();

  let raf = 0, last = 0, t = 0, visible = true, drawn = 0;
  const wake = () => { if (!raf && visible && !document.hidden) raf = requestAnimationFrame(tick); };
  function tick(now) {
    raf = 0;
    const raw = last ? now - last : 0, dt = Math.min(.05, raw / 1000); last = now;
    if (!calm) t += dt;
    // A slow drift of the eye keeps the view alive; the helix turns about its axis.
    const drift = calm ? 0 : 1;
    camera.position.copy(eye).add(V(22 * Math.sin(t * .09) * drift, 10 * Math.sin(t * .13 + 1) * drift, -back));
    camera.lookAt(look.copy(target).add(V(back * .07, 0, 0))); camera.updateMatrixWorld();
    pose(t * SPIN);
    duplex.view(viewScale(camera, NEAR, size()[1]));
    pipeline.render();
    // Auto quality, as in the film: one tier down if frames stay slow.
    pipeline.recordWork(performance.now() - now);
    if (!calm && raw && !TIERS[saved]) { const next = pipeline.govern(raw, now); if (next) { pipeline.setTier(next); frame(); } }
    if (++drawn === 2) view.classList.add('ready');
    if (!calm || drawn < 3) wake(); else last = 0;
  }
  // A lost graphics context (a GPU reset, a reclaimed background tab) comes back with its lighting rebuilt.
  renderer.domElement.addEventListener('webglcontextlost', e => e.preventDefault());
  renderer.domElement.addEventListener('webglcontextrestored', () => { restoreEnvironment(renderer, [scene]); wake(); });
  // Only while the hero is on screen, and not in a hidden tab.
  new IntersectionObserver(([e]) => { visible = e.isIntersecting; last = 0; wake(); }).observe(hero);
  document.addEventListener('visibilitychange', () => { last = 0; wake(); });
  rmq.addEventListener('change', e => { if (motion() === 'auto') { calm = e.matches; wake(); } });
  wake();
  if (new URLSearchParams(location.search).get('debug') === '1') window.home = {pairs: n, drawn: () => drawn, ready: () => view.classList.contains('ready'), tier: () => pipeline.tier};
}
start();
