// The guided camera's moves (the transcription film's, shared with the short scenes). A pose is {target, dir (unit,
// from the target to the camera), dist, fov, anchor (where the target sits on screen, 0–1 from the top left)}.
// Poses blend in azimuth and elevation about the teaching vertical (world −y: up on screen), so a swing of more than
// about 100° arcs over the top of the scene (a crane move) instead of passing along the subject; distance blends
// geometrically.
import * as THREE from 'three';
import {clamp, mix, wrap} from './ease.mjs';

const DEG = Math.PI / 180;

export function blendPose(a, b, w, {calm = false} = {}) {
  const sph = d => ({az: Math.atan2(d.x, d.z), el: Math.asin(Math.max(-1, Math.min(1, -d.y)))}), A = sph(a.dir), B = sph(b.dir), dAz = wrap(B.az - A.az);
  const lift = calm ? 0 : clamp((Math.abs(dAz) - 100 * DEG) / (50 * DEG)), elMid = (A.el + B.el) / 2;
  const el = mix(A.el, B.el, w) + Math.sin(Math.PI * w) * Math.max(0, 80 * DEG - elMid) * lift, az = A.az + dAz * w;
  return {target: a.target.clone().lerp(b.target, w), dir: new THREE.Vector3(Math.cos(el) * Math.sin(az), -Math.sin(el), Math.cos(el) * Math.cos(az)),
    dist: Math.exp(mix(Math.log(a.dist), Math.log(b.dist), w)), fov: mix(a.fov, b.fov, w), anchor: [mix(a.anchor[0], b.anchor[0], w), mix(a.anchor[1], b.anchor[1], w)]};
}

// Where the subject sits on screen: right of the chapter list and above the narration (centred on phones and on
// short screens); `wide` shots sit a little higher.
export function screenAnchor(wide = false, w = innerWidth, h = innerHeight) {
  if (h <= 560 && w > 600) return [.5, wide ? .4 : .46];
  return w <= 780 ? [.5, wide ? .32 : .34] : w <= 1100 ? [.58, wide ? .36 : .4] : wide ? [.56, .36] : [.6, .4];
}

// Sets the lens and shifts the frustum so the target lands on its screen anchor; `pipeline` (render.mjs) keeps its
// ambient occlusion's copy of the projection in step.
export function applyLens(camera, fov, anchor, pipeline = null, W = innerWidth, H = innerHeight) {
  camera.fov = fov; camera.aspect = W / H;
  camera.setViewOffset(W, H, (.5 - anchor[0]) * W, (.5 - anchor[1]) * H, W, H);
  camera.updateProjectionMatrix();
  pipeline?.syncCamera();
}

// Places the camera at a pose.
export function placeCamera(camera, controls, pose) {
  controls.target.copy(pose.target);
  camera.position.copy(pose.target).addScaledVector(pose.dir, pose.dist);
  camera.lookAt(pose.target); camera.updateMatrixWorld();
}

// The camera's pose now (after the viewer has explored), to ease back from.
export function currentPose(camera, controls, anchor) {
  const d = camera.position.clone().sub(controls.target);
  return {target: controls.target.clone(), dir: d.clone().normalize(), dist: d.length(), fov: camera.fov, anchor: anchor.slice()};
}
