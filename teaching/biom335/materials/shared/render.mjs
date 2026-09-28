// The course's rendering pipeline (the transcription film's): the scene drawn into a half-float, multisampled
// target, then ambient occlusion at half resolution, a soft bloom, tone mapping and sRGB output, and FXAA on the
// Low tier. Quality tiers set a pixel budget and which passes run; Auto measures a few frames at startup and steps
// down during playback if frames stay slow.
import * as THREE from 'three';
import {EffectComposer} from 'three/addons/postprocessing/EffectComposer.js';
import {RenderPass} from 'three/addons/postprocessing/RenderPass.js';
import {SSAOPass} from 'three/addons/postprocessing/SSAOPass.js';
import {UnrealBloomPass} from 'three/addons/postprocessing/UnrealBloomPass.js';
import {OutputPass} from 'three/addons/postprocessing/OutputPass.js';
import {FXAAPass} from 'three/addons/postprocessing/FXAAPass.js';

// Quality tiers: a pixel budget sets the render resolution; Low also swaps AO and bloom for FXAA.
export const TIERS = {
  high: {label: 'High', budget: 4.2e6, ao: true, bloom: true, samples: 4},
  balanced: {label: 'Balanced', budget: 2.4e6, ao: true, bloom: true, samples: 2},
  low: {label: 'Low', budget: 1.3e6, ao: false, bloom: false, samples: 0, fxaa: true},
};
export const TIER_ORDER = ['high', 'balanced', 'low'];
export const pixelRatioFor = (name, w = innerWidth, h = innerHeight) => Math.min(devicePixelRatio, 2, Math.sqrt(TIERS[name].budget / Math.max(1, w * h)));

// SSAO at half resolution. Its normal/depth pass ignores clipping and opacity, so a page switches it off while a
// cutaway or a fade shows what it would wrongly shade (setOcclusion). Materials marked userData.noAO (glows,
// outlines: light, not matter) are hidden from that pass, so they cast no occlusion.
class HalfSSAO extends SSAOPass {
  setSize(w, h) { super.setSize(Math.max(1, w * .5 | 0), Math.max(1, h * .5 | 0)); }
  _overrideVisibility() {
    super._overrideVisibility();
    const cache = this._visibilityCache;
    this.scene.traverse(o => { if ((o.isMesh || o.isLine) && o.visible && o.material?.userData?.noAO) { o.visible = false; cache.push(o); } });
  }
}
// Bloom's blur chain spreads one NaN or infinite pixel into flickering black blocks, so its input is clamped (GPU
// min/max return the non-NaN operand) before the bright-pass.
function guardBloom(pass) {
  const m = pass.materialHighPassFilter;
  m.fragmentShader = m.fragmentShader.replace('vec4 texel = texture2D( tDiffuse, vUv );', 'vec4 texel = clamp( texture2D( tDiffuse, vUv ), 0.0, 256.0 );');
  m.needsUpdate = true;
}

// `size` gives the view's size in CSS pixels (the window, unless the view is a box within the page).
export function createPipeline(renderer, scene, camera, {tier = 'balanced', size = () => [innerWidth, innerHeight]} = {}) {
  const W = () => size()[0], H = () => size()[1], ratio0 = Math.min(devicePixelRatio, 2);
  const composer = new EffectComposer(renderer, new THREE.WebGLRenderTarget(1, 1, {type: THREE.HalfFloatType, samples: ratio0 >= 1.75 ? 2 : 4}));
  composer.setPixelRatio(ratio0); composer.setSize(W(), H());
  composer.addPass(new RenderPass(scene, camera));
  const ao = new HalfSSAO(scene, camera, W(), H());
  // The occlusion is blended in by its copy pass's opacity (1 − opacity leaves the image as it is), so it can fade.
  { const m = ao.copyMaterial; m.fragmentShader = m.fragmentShader.replace('gl_FragColor = opacity * texel;', 'gl_FragColor = mix( vec4( 1.0 ), texel, opacity );'); m.needsUpdate = true; }
  ao.kernelRadius = 7;
  composer.addPass(ao);
  const bloom = new UnrealBloomPass(new THREE.Vector2(W(), H()), .14, .25, 1.1); guardBloom(bloom); composer.addPass(bloom);
  composer.addPass(new OutputPass());
  const fxaa = new FXAAPass(); fxaa.enabled = false; composer.addPass(fxaa);
  let aoWeight = 1, aoAllowed = true;
  // Frame times (ms) for the governor: whole frames, and the page's own work in them.
  const governor = {samples: [], work: [], skip: 30, strikes: 0, checked: 0};
  const pipeline = {
    composer, ao, bloom, fxaa, tier, governor,
    // Reallocates every render target, so only when the tier (or the screen) changes.
    setTier(name) {
      if (!TIERS[name]) name = 'balanced';
      const T = TIERS[name], ratio = pixelRatioFor(name, W(), H()); pipeline.tier = name;
      renderer.setPixelRatio(ratio); renderer.setSize(W(), H());
      const samples = T.samples && ratio >= 1.75 ? Math.min(T.samples, 2) : T.samples;
      for (const rt of [composer.renderTarget1, composer.renderTarget2]) if (rt.samples !== samples) { rt.samples = samples; rt.dispose(); }
      composer.setPixelRatio(ratio); composer.setSize(W(), H());
      bloom.enabled = T.bloom; fxaa.enabled = !!T.fxaa; ao.enabled = aoAllowed && T.ao;
      governor.samples.length = 0; governor.skip = 30; governor.strikes = 0;
    },
    resize() { const ratio = pixelRatioFor(pipeline.tier, W(), H()); renderer.setPixelRatio(ratio); renderer.setSize(W(), H()); composer.setPixelRatio(ratio); composer.setSize(W(), H()); },
    // How strongly ambient occlusion applies (0–1); it switches off below a trace, or when not `allowed`.
    setOcclusion(weight, allowed = true) { aoWeight = weight; aoAllowed = allowed && weight > .004; ao.enabled = aoAllowed && TIERS[pipeline.tier].ao; ao.copyMaterial.uniforms.opacity.value = weight; },
    get occlusionAllowed() { return aoAllowed; },
    // After the camera's lens or clipping range changes: SSAO keeps its own copy of the projection, and its depth
    // range (1.5–40 Å) is measured in the camera's depth span.
    syncCamera() {
      const u = ao.ssaoMaterial.uniforms;
      u.cameraProjectionMatrix.value.copy(camera.projectionMatrix); u.cameraInverseProjectionMatrix.value.copy(camera.projectionMatrixInverse);
      ao.minDistance = 1.5 / (camera.far - camera.near); ao.maxDistance = 40 / (camera.far - camera.near);
    },
    render() { composer.render(); },
    // The page's own work in a frame (ms), recorded every frame.
    recordWork(ms) { governor.work.push(ms); if (governor.work.length > 240) governor.work.splice(0, 120); },
    // Auto quality: one tier down if the 2 s median frame stays above 24 ms on two checks in a row (and the page's own
    // work is a real share of it). Call once a frame while playing; returns the tier to step down to (setTier), if any.
    govern(raw, now = performance.now()) {
      if (pipeline.tier === 'low') return null;
      if (governor.skip > 0) governor.skip--; else governor.samples.push(raw);
      if (now - governor.checked <= 2000) return null;
      governor.checked = now;
      const f = governor.samples.sort((a, b) => a - b); let next = null;
      if (f.length > 20) {
        const w = [...governor.work].sort((a, b) => a - b), med = w[w.length >> 1] || 0;
        governor.strikes = f[f.length >> 1] > 24 && med > 10 ? governor.strikes + 1 : 0;
        if (governor.strikes >= 2) next = TIER_ORDER[TIER_ORDER.indexOf(pipeline.tier) + 1];
      }
      governor.samples.length = 0;
      return next;
    },
    // Startup probe (behind the loader): synced frames of a heavy view at the High tier; `draw` renders one.
    async measure(draw) {
      pipeline.setTier('high');
      const gl = renderer.getContext(), px = new Uint8Array(4), times = [];
      for (let i = 0; i < 10; i++) {
        const t0 = performance.now(); draw(); gl.readPixels(0, 0, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, px);
        if (i >= 2) times.push(performance.now() - t0);
        await new Promise(r => setTimeout(r, 0));
      }
      times.sort((a, b) => a - b); const median = times[times.length >> 1];
      return median < 16 ? 'high' : median < 30 ? 'balanced' : 'low';
    },
  };
  pipeline.syncCamera();
  return pipeline;
}
