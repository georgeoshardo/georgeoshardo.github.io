// The guided camera's moves (the transcription film's, shared with the short scenes). A pose is {target, dir (unit,
// from the target to the camera), dist, fov, anchor (where the target sits on screen, 0–1 from the top left)}.
// Poses blend in azimuth and elevation about the teaching vertical (world −y: up on screen), so a swing of more than
// about 100° arcs over the top of the scene (a crane move) instead of passing along the subject; distance blends
// geometrically.
import * as THREE from 'three';
import {clamp, mix, wrap} from './ease.mjs';

const DEG = Math.PI / 180;

// `zoomPan` (a scene shot's option): the target moves with the zoom rather than the clock, so that on a pull-back
// the subject being left glides straight across the screen to where the new view shows it (it would otherwise race
// off one side while the view is still narrow), and on a push-in the new subject glides straight to the middle before
// the camera closes in. (The subject's place on screen is its offset from the target over the distance; this keeps
// it moving linearly in w.) At an unchanged distance it is the plain blend; a number (0–1) goes that far towards it.
export function blendPose(a, b, w, {calm = false, zoomPan = false} = {}) {
  const sph = d => ({az: Math.atan2(d.x, d.z), el: Math.asin(Math.max(-1, Math.min(1, -d.y)))}), A = sph(a.dir), B = sph(b.dir), dAz = wrap(B.az - A.az);
  const lift = calm ? 0 : clamp((Math.abs(dAz) - 100 * DEG) / (50 * DEG)), elMid = (A.el + B.el) / 2;
  const el = mix(A.el, B.el, w) + Math.sin(Math.PI * w) * Math.max(0, 80 * DEG - elMid) * lift, az = A.az + dAz * w;
  const dist = Math.exp(mix(Math.log(a.dist), Math.log(b.dist), w));
  const k = zoomPan === true ? 1 : +zoomPan || 0, wt = mix(w, b.dist > a.dist ? w * dist / b.dist : 1 - (1 - w) * dist / a.dist, k);
  return {target: a.target.clone().lerp(b.target, wt), dir: new THREE.Vector3(Math.cos(el) * Math.sin(az), -Math.sin(el), Math.cos(el) * Math.cos(az)),
    dist, fov: mix(a.fov, b.fov, w), anchor: [mix(a.anchor[0], b.anchor[0], w), mix(a.anchor[1], b.anchor[1], w)]};
}

// Where the subject sits on screen: right of the chapter list and above the narration (centred on phones and on
// short screens); `wide` shots sit a little higher.
export function screenAnchor(wide = false, w = innerWidth, h = innerHeight) {
  if (h <= 560 && w > 600) return [.5, wide ? .4 : .46];
  return w <= 780 ? [.5, wide ? .32 : .34] : w <= 1100 ? [.58, wide ? .36 : .4] : wide ? [.56, .36] : [.6, .4];
}

// A shot that frames a box (`box`: width and height in world units, centred on the target, square to the view) in
// the free part of the screen (`room`: {left, top, right, bottom} in px, what the page chrome leaves), whatever its
// size and shape: the distance that fits the box to `fill` of the room, and the anchor at the room's middle.
export function fitRoom(camera, [bw, bh], room, fill = .92, W = innerWidth, H = innerHeight) {
  const t = Math.tan(camera.fov * Math.PI / 360), rw = Math.max(40, room.right - room.left), rh = Math.max(40, room.bottom - room.top);
  return {dist: H / (2 * t * fill) * Math.max(bw / rw, bh / rh), anchor: [(room.left + room.right) / 2 / W, (room.top + room.bottom) / 2 / H]};
}

// A box shot that shows given points (world coordinates) whole, seen from `dir` (from the target to the camera) with
// the teaching vertical up: the box they fill square to the view, a little larger for the points nearer the camera
// (as perspective shows them), with `margin` round it (and `above` more at the top, `sides` more left and right, for
// labels), and its centre as the target. Spread it into a shot: {t, blend, ...boxAround(points, dir), fill}.
export function boxAround(points, dir, {margin = 1, above = 0, sides = 0, fov = 30} = {}) {
  const z = new THREE.Vector3(...(dir.isVector3 ? dir.toArray() : dir)).normalize(), x = new THREE.Vector3(0, -1, 0).cross(z).normalize(), y = z.clone().cross(x);
  const a = points.map(p => p.dot(x)), b = points.map(p => p.dot(y)), c = points.map(p => p.dot(z));
  // (Loops, not spreads: a protein's surface can give more points than a call takes arguments.)
  const lo = v => v.reduce((m, x) => x < m ? x : m, Infinity), hi = v => v.reduce((m, x) => x > m ? x : m, -Infinity);
  const ca = (lo(a) + hi(a)) / 2, cb = (lo(b) + hi(b)) / 2, cz = (lo(c) + hi(c)) / 2;
  // The nearest distance the fit can give (the box filling the whole height, or most of a wide window's width).
  const D = Math.max(hi(b) - lo(b), .6 * (hi(a) - lo(a))) / (2 * Math.tan(fov * DEG / 2)) + hi(c) - cz;
  const s = c.map(v => D / Math.max(D * .2, D - (v - cz))), A = a.map((v, i) => ca + (v - ca) * s[i]), B = b.map((v, i) => cb + (v - cb) * s[i]);
  const b0 = lo(B) - margin, b1 = hi(B) + margin + above, a0 = lo(A) - margin - sides, a1 = hi(A) + margin + sides;
  return {target: x.clone().multiplyScalar((a0 + a1) / 2).addScaledVector(y, (b0 + b1) / 2).addScaledVector(z, cz), dir: z.toArray(), box: [a1 - a0, b1 - b0]};
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
