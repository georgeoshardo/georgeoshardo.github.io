import * as zarr from "https://cdn.jsdelivr.net/npm/zarrita@0.6.1/+esm";

const DEFAULT_DATASET = "ghardo/scientific_data_2026_curated_tracks";
const GEFF_NAME = "tracking_graph.geff";

// napari label_colormap(49, seed=0.5): the track colours used by motile_tracker
const PALETTE = [
  [0.4706, 0.1451, 0.0235], [0.3569, 0.8353, 0.9725], [0.5725, 0.5373, 0.9098],
  [0.4235, 0.0078, 0.7569], [0.2784, 0.2275, 0.6235], [0.6706, 0.9255, 0.5412],
  [0.5608, 0.6784, 0.698], [0.5255, 0.5647, 0.6039], [0.9961, 0.9686, 0.1098],
  [0.9686, 0.2667, 0.2314], [0.0118, 0.3059, 0.2235], [0.4431, 0.698, 0.3765],
  [0.4118, 0.5843, 0.2902], [0.2353, 0.1059, 0.5294], [0.1804, 0.2784, 0.0627],
  [0.3608, 0.7176, 0.8706], [0.2784, 0.6157, 0.4627], [0.2784, 0.2588, 0.3451],
  [0.9373, 0.3373, 0.3961], [0.7216, 0.3137, 0.4824], [0.651, 0.1647, 0.3922],
  [0.9451, 0.7059, 0.9255], [0.2941, 0.1176, 0.1255], [0.7059, 0.7725, 0.2431],
  [0.6118, 0.3765, 0.1843], [0.5412, 0.2627, 0.1059], [0.8471, 0.7451, 0.6039],
  [0.7059, 0.4902, 0.7412], [0.651, 0.3686, 0.6431], [0.3765, 0.4784, 0.2039],
  [0.7569, 0.8902, 0.3412], [0.8431, 0.5843, 0.3333], [0.6196, 0.5294, 0.4353],
  [0.0, 0.1725, 0.9216], [0.7922, 0.902, 0.8784], [0.8824, 0.5451, 0.1176],
  [0.4706, 0.9412, 0.0039], [0.4824, 0.5569, 0.0588], [0.898, 0.8667, 0.698],
  [0.6706, 0.9255, 0.5412], [0.2588, 0.8471, 0.651], [0.2745, 0.7294, 0.5569],
  [0.9961, 0.9686, 0.1098], [0.9686, 0.2667, 0.2314], [0.6863, 0.2941, 0.949],
  [0.6902, 0.0471, 0.2471], [0.4118, 0.5843, 0.2902], [0.9647, 0.5294, 0.6549],
  [0.7961, 0.1961, 0.7804],
].map((c) => c.map((v) => Math.round(v * 255)));

const colorOf = (id) => PALETTE[(((id - 1) % PALETTE.length) + PALETTE.length) % PALETTE.length];
const css = (rgb, a = 1) => `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${a})`;

// napari kymograph layer styling, in data units (scaled by zoom)
const STYLE = {
  pathWidth: 1.2,
  branchWidth: 1.0,
  dash: 6,
  gap: 4,
  linkOpacity: 0.9,
  pointSize: 5,
  boundsWidth: 0.5,
  boundsColor: "rgba(255,255,0,0.7)",
  branchColor: [0, 255, 0],
};

const $ = (id) => document.getElementById(id);
const el = {
  dataset: $("dataset"),
  loadDataset: $("load-dataset"),
  trench: $("trench"),
  prev: $("prev"),
  next: $("next"),
  status: $("status"),
  zoom: $("zoom"),
  lo: $("contrast-lo"),
  hi: $("contrast-hi"),
  opacity: $("opacity"),
  subsample: $("subsample"),
  subsampleValue: $("subsample-value"),
  divisionsOnly: $("divisions-only"),
  colorBy: $("color-by"),
  showMasks: $("show-masks"),
  showPoints: $("show-points"),
  showPaths: $("show-paths"),
  showBranches: $("show-branches"),
  showBounds: $("show-bounds"),
  selection: $("selection"),
  clear: $("clear"),
  hover: $("hover"),
  stage: $("stage"),
  kymo: $("kymo"),
  time: $("time"),
  resetZoom: $("reset-zoom"),
  timeRow: $("time-row"),
  timeLabel: $("time-label"),
  treeWrap: $("tree-wrap"),
  tabTree: $("tab-tree"),
  tabSpiral: $("tab-spiral"),
  spiral: $("spiral"),
  turn: $("turn"),
  turnValue: $("turn-value"),
  turnControl: $("turn-control"),
  resetSpiral: $("reset-spiral"),
  tree: $("tree"),
};

const state = {
  data: null, // the loaded trench
  composite: null, // offscreen canvas with image + masks for every frame
  viewX: 0, // left edge of the view, in kymograph pixels
  zoom: 1.7154,
  selected: null, // { tracklet, lineage }
  hoverNode: -1,
  hoverFrame: -1,
  loadToken: 0,
  tab: "tree",
};

// ---------------------------------------------------------------- loading

const baseUrl = () => `https://huggingface.co/datasets/${el.dataset.value.trim()}/resolve/main`;

function setStatus(text, error = false) {
  el.status.textContent = text;
  el.status.classList.toggle("error", error);
}

function toNumbers(data) {
  if (data instanceof BigInt64Array || data instanceof BigUint64Array) {
    return Float64Array.from(data, Number);
  }
  return data;
}

async function readArray(store, path) {
  const array = await zarr.open(zarr.root(store).resolve(path), { kind: "array" });
  return zarr.get(array);
}

async function listTrenches() {
  const repo = el.dataset.value.trim();
  const names = [];
  let url = `https://huggingface.co/api/datasets/${repo}/tree/main`;
  while (url) {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Could not list ${repo} (${response.status})`);
    for (const entry of await response.json()) {
      if (entry.type === "directory") names.push(entry.path);
    }
    const next = /<([^>]+)>;\s*rel="next"/.exec(response.headers.get("Link") || "");
    url = next ? next[1] : null;
  }
  return names.sort();
}

function resolveRelative(base, relative) {
  const parts = base.split("/").filter(Boolean);
  for (const piece of relative.split("/")) {
    if (piece === "..") parts.pop();
    else if (piece && piece !== ".") parts.push(piece);
  }
  return parts.join("/");
}

async function loadTrench(name) {
  const token = ++state.loadToken;
  setStatus(`Loading ${name}...`);
  const store = new zarr.FetchStore(`${baseUrl()}/${name}`);
  const geffPath = GEFF_NAME;
  const started = performance.now();

  const attrs = await (await fetch(`${baseUrl()}/${name}/${geffPath}/.zattrs`)).json();
  const meta = attrs.geff;
  const axes = meta.axes || [];
  const timeName = axes.find((a) => a.type === "time")?.name ?? "time";
  const space = axes.filter((a) => a.type === "space").map((a) => a.name);
  const yName = meta.display_hints?.display_vertical ?? space[0];
  const xName = meta.display_hints?.display_horizontal ?? space[1];
  const labels = (meta.related_objects || []).find((o) => o.type === "labels");
  const image = (meta.related_objects || []).find((o) => o.type === "image");
  if (!labels) throw new Error("This GEFF has no related labels array");
  const timeAxis = axes.find((a) => a.type === "time");
  const unitSeconds = { s: 1, second: 1, seconds: 1, min: 60, minute: 60, minutes: 60, h: 3600, hour: 3600 };
  const scaled = timeAxis?.scale && unitSeconds[timeAxis.unit] ? timeAxis.scale * unitSeconds[timeAxis.unit] : null;
  state.frameSeconds = Number(new URLSearchParams(location.search).get("interval")) || scaled || 30;
  const trackletName = meta.track_node_props?.tracklet ?? "tracklet";
  const lineageName = meta.track_node_props?.lineage ?? "lineage";
  const labelName = labels.label_prop ?? "seg_id";

  const prop = (p) => readArray(store, `${geffPath}/nodes/props/${p}/values`);
  const [ids, time, ys, xs, labelValues, tracklet, lineage, edges, seg, img] = await Promise.all([
    readArray(store, `${geffPath}/nodes/ids`),
    prop(timeName),
    prop(yName),
    prop(xName),
    prop(labelName),
    prop(trackletName),
    prop(lineageName),
    readArray(store, `${geffPath}/edges/ids`),
    readArray(store, resolveRelative(geffPath, labels.path)),
    image ? readArray(store, resolveRelative(geffPath, image.path)) : Promise.resolve(null),
  ]);
  if (token !== state.loadToken) return;

  const data = buildTrench(name, {
    ids: toNumbers(ids.data),
    time: toNumbers(time.data),
    y: toNumbers(ys.data),
    x: toNumbers(xs.data),
    label: toNumbers(labelValues.data),
    tracklet: toNumbers(tracklet.data),
    lineage: toNumbers(lineage.data),
    edges: toNumbers(edges.data),
    seg,
    img,
  });
  state.data = data;
  state.selected = null;
  state.hoverNode = -1;
  autoContrast();
  buildFrames(data);
  buildComposite();
  layoutTree();
  state.spiralView = null;
  el.time.max = String(data.T - 1);
  const params = new URLSearchParams(location.search);
  const frame = params.get("trench") === name ? Number(params.get("frame") || 0) : 0;
  state.viewX = frameToSlot(frame) * data.X;
  resize();
  updateSelectionPanel();
  const seconds = ((performance.now() - started) / 1000).toFixed(1);
  setStatus(`Loaded ${name} in ${seconds} s.`);
  writeUrl();
}

// ---------------------------------------------------------------- model

function buildTrench(name, raw) {
  const [T, Y, X] = raw.seg.shape;
  const N = raw.ids.length;
  const index = new Map();
  for (let i = 0; i < N; i++) index.set(raw.ids[i], i);

  const t = Int32Array.from(raw.time);
  const tracklet = Int32Array.from(raw.tracklet);
  const lineage = Int32Array.from(raw.lineage);
  const label = Int32Array.from(raw.label);
  const E = raw.edges.length / 2;
  const src = new Int32Array(E);
  const dst = new Int32Array(E);
  const outdeg = new Int32Array(N);
  const parent = new Int32Array(N).fill(-1);
  const children = Array.from({ length: N }, () => []);
  for (let e = 0; e < E; e++) {
    const s = index.get(raw.edges[2 * e]);
    const d = index.get(raw.edges[2 * e + 1]);
    src[e] = s;
    dst[e] = d;
    outdeg[s]++;
    parent[d] = s;
    children[s].push(d);
  }

  // labels are unique only within a frame: (frame, label) -> node
  let maxLabel = 0;
  for (let i = 0; i < N; i++) maxLabel = Math.max(maxLabel, label[i]);
  const stride = maxLabel + 1;
  const lut = new Int32Array(T * stride).fill(-1);
  for (let i = 0; i < N; i++) {
    if (t[i] >= 0 && t[i] < T) lut[t[i] * stride + label[i]] = i;
  }

  // tracklets: nodes in time order, parent tracklet, children
  const byTracklet = new Map();
  for (let i = 0; i < N; i++) {
    if (!byTracklet.has(tracklet[i])) byTracklet.set(tracklet[i], []);
    byTracklet.get(tracklet[i]).push(i);
  }
  const tracklets = [];
  const trackletIndex = new Map();
  for (const [id, nodes] of byTracklet) {
    nodes.sort((a, b) => t[a] - t[b]);
    const first = nodes[0];
    const last = nodes[nodes.length - 1];
    const p = parent[first];
    trackletIndex.set(id, tracklets.length);
    tracklets.push({
      id,
      lineage: lineage[first],
      nodes,
      start: t[first],
      end: t[last],
      parentTracklet: p >= 0 && tracklet[p] !== id ? tracklet[p] : null,
      divides: outdeg[last] === 2,
      children: [],
      y0: raw.y[first],
      lane: 0,
    });
  }
  for (const tr of tracklets) {
    if (tr.parentTracklet !== null && trackletIndex.has(tr.parentTracklet)) {
      tracklets[trackletIndex.get(tr.parentTracklet)].children.push(tr.id);
    }
  }
  const lineages = [...new Set(tracklets.map((tr) => tr.lineage))].sort((a, b) => a - b);

  const linkKind = new Uint8Array(E); // 0 path, 1 gap, 2 division
  for (let e = 0; e < E; e++) {
    const s = src[e];
    const d = dst[e];
    if (tracklet[s] !== tracklet[d]) linkKind[e] = 2;
    else linkKind[e] = t[d] === t[s] + 1 ? 0 : 1;
  }

  return {
    name,
    T,
    Y,
    X,
    W: T * X,
    N,
    ids: raw.ids,
    t,
    y: raw.y,
    x: raw.x,
    label,
    tracklet,
    lineage,
    src,
    dst,
    linkKind,
    outdeg,
    parent,
    children,
    lut,
    stride,
    seg: raw.seg.data,
    img: raw.img ? raw.img.data : null,
    tracklets,
    trackletIndex,
    lineages,
    contrast: [0, 1],
  };
}

function nodeColor(d, i) {
  return colorOf(el.colorBy.value === "lineage" ? d.lineage[i] : d.tracklet[i]);
}

function isEmphasised(d, i) {
  const sel = state.selected;
  if (!sel) return true;
  return d.lineage[i] === sel.lineage;
}

// ---------------------------------------------------------------- frames shown
//
// The kymograph shows every Nth frame ("subsample"), plus the frames either side of
// every division, so a division is never skipped. Each shown frame gets a slot (a column
// of the kymograph); frames in between map to fractional slots.

function buildFrames(d) {
  const step = Math.max(1, Number(el.subsample.value) || 1);
  const only = el.divisionsOnly.checked;
  const keep = new Uint8Array(d.T);
  if (!only) {
    for (let f = 0; f < d.T; f += step) keep[f] = 1;
    keep[d.T - 1] = 1;
  }
  for (let i = 0; i < d.N; i++) {
    if (d.outdeg[i] !== 2) continue;
    keep[d.t[i]] = 1;
    for (const c of d.children[i]) keep[d.t[c]] = 1;
  }
  // a trench where nothing divides still needs something to show
  if (only && !keep.some((v) => v)) {
    keep[0] = 1;
    keep[d.T - 1] = 1;
  }
  const frames = [];
  for (let f = 0; f < d.T; f++) if (keep[f]) frames.push(f);
  d.frames = Int32Array.from(frames);
  d.shown = keep;
  d.nSlots = frames.length;
  d.W = d.nSlots * d.X;
  d.slotOf = new Float64Array(d.T);
  for (let i = 0; i < frames.length; i++) {
    const a = frames[i];
    const b = i + 1 < frames.length ? frames[i + 1] : d.T;
    for (let f = a; f < b && f < d.T; f++) d.slotOf[f] = i + (f - a) / (b - a);
  }
  // links between consecutive shown cells of the same tracklet (dashed if the tracklet
  // has a frame-skipping link in between), and every division
  const links = [];
  for (const tr of d.tracklets) {
    let prev = -1;
    let gap = false;
    for (let j = 0; j < tr.nodes.length; j++) {
      const n = tr.nodes[j];
      if (j > 0 && d.t[n] - d.t[tr.nodes[j - 1]] > 1) gap = true;
      if (!keep[d.t[n]]) continue;
      if (prev >= 0) links.push([prev, n, gap ? 1 : 0]);
      prev = n;
      gap = false;
    }
  }
  for (let e = 0; e < d.src.length; e++) if (d.linkKind[e] === 2) links.push([d.src[e], d.dst[e], 2]);
  d.links = links;
  el.subsample.disabled = only;
  el.subsampleValue.textContent = only
    ? `divisions only (${d.nSlots} of ${d.T})`
    : step === 1
      ? "every frame"
      : `every ${step}th frame + divisions (${d.nSlots} of ${d.T})`;
}

function slotToFrame(slot) {
  const d = state.data;
  if (slot <= 0) return d.frames[0] + slot;
  const last = d.nSlots - 1;
  if (slot >= last) return d.frames[last] + (slot - last);
  const i = Math.floor(slot);
  return d.frames[i] + (slot - i) * (d.frames[i + 1] - d.frames[i]);
}

function frameToSlot(frame) {
  const d = state.data;
  const f = Math.min(d.T - 1, Math.max(0, frame));
  const i = Math.floor(f);
  const a = d.slotOf[i];
  const b = i + 1 < d.T ? d.slotOf[i + 1] : a + 1;
  return a + (f - i) * (b - a);
}

// ---------------------------------------------------------------- image + masks

function autoContrast() {
  const d = state.data;
  if (!d.img) return;
  const sample = [];
  const step = Math.max(1, Math.floor(d.img.length / 200000));
  for (let i = 0; i < d.img.length; i += step) sample.push(d.img[i]);
  sample.sort((a, b) => a - b);
  const min = sample[0];
  const max = sample[sample.length - 1];
  d.range = [min, max];
  d.contrast = [sample[Math.floor(sample.length * 0.005)], sample[Math.floor(sample.length * 0.998)]];
  const span = max - min || 1;
  el.lo.value = String((d.contrast[0] - min) / span);
  el.hi.value = String((d.contrast[1] - min) / span);
}

function buildComposite() {
  const d = state.data;
  if (!d) return;
  const { T, Y, X, W } = d;
  if (!state.composite || state.composite.width !== W || state.composite.height !== Y) {
    state.composite = document.createElement("canvas");
    state.composite.width = W;
    state.composite.height = Y;
  }
  const ctx = state.composite.getContext("2d");
  const out = ctx.createImageData(W, Y);
  const px = out.data;
  const [lo, hi] = d.contrast;
  const scale = 255 / (hi - lo || 1);
  const alpha = Number(el.opacity.value);
  const masks = el.showMasks.checked;
  const byLineage = el.colorBy.value === "lineage";
  const sel = state.selected;
  const frameSize = Y * X;

  // colour per node, with the selection's dimming applied
  const nodeRGBA = new Float32Array(d.N * 4);
  for (let i = 0; i < d.N; i++) {
    const c = colorOf(byLineage ? d.lineage[i] : d.tracklet[i]);
    nodeRGBA[4 * i] = c[0];
    nodeRGBA[4 * i + 1] = c[1];
    nodeRGBA[4 * i + 2] = c[2];
    let a = alpha;
    if (sel && d.lineage[i] !== sel.lineage) a *= 0.2;
    else if (sel && d.tracklet[i] === sel.tracklet) a = Math.min(1, alpha + 0.25);
    nodeRGBA[4 * i + 3] = a;
  }

  for (let slot = 0; slot < d.nSlots; slot++) {
    const t = d.frames[slot];
    const base = t * frameSize;
    const lutBase = t * d.stride;
    for (let y = 0; y < Y; y++) {
      let o = (y * W + slot * X) * 4;
      let k = base + y * X;
      for (let x = 0; x < X; x++, o += 4, k++) {
        let g = d.img ? (d.img[k] - lo) * scale : 0;
        g = g < 0 ? 0 : g > 255 ? 255 : g;
        let r = g;
        let gg = g;
        let b = g;
        const lab = d.seg[k];
        if (masks && lab) {
          const node = lab < d.stride ? d.lut[lutBase + lab] : -1;
          if (node >= 0) {
            const a = nodeRGBA[4 * node + 3];
            r = r * (1 - a) + nodeRGBA[4 * node] * a;
            gg = gg * (1 - a) + nodeRGBA[4 * node + 1] * a;
            b = b * (1 - a) + nodeRGBA[4 * node + 2] * a;
          }
        }
        px[o] = r;
        px[o + 1] = gg;
        px[o + 2] = b;
        px[o + 3] = 255;
      }
    }
  }
  ctx.putImageData(out, 0, 0);
}

// ---------------------------------------------------------------- kymograph view

// The default zoom is also the closest zoom: the stage keeps the height it has at this
// zoom, so zooming out (or selecting a time range in the tree) never moves the tree.
const MAX_ZOOM = 4;
const DEFAULT_ZOOM = 1.7154; // what a trench opens at, and what Reset zoom returns to

function minZoom() {
  const d = state.data;
  return d ? Math.min(MAX_ZOOM, el.stage.clientWidth / d.W) : MAX_ZOOM;
}

function setZoom(zoom) {
  state.zoom = Math.min(MAX_ZOOM, Math.max(minZoom(), zoom));
  // the zoom slider is logarithmic between "whole movie" and the default zoom
  const lo = Math.log(minZoom());
  const span = Math.log(MAX_ZOOM) - lo;
  el.zoom.value = String(span > 0 ? (Math.log(state.zoom) - lo) / span : 1);
  el.resetZoom.disabled = Math.abs(state.zoom - DEFAULT_ZOOM) < 1e-3;
}

function zoomFromSlider() {
  const lo = Math.log(minZoom());
  return Math.exp(lo + Number(el.zoom.value) * (Math.log(MAX_ZOOM) - lo));
}

// vertical offset that centres the image in the fixed-height stage
function offsetY() {
  const d = state.data;
  return d ? (d.Y * MAX_ZOOM - d.Y * state.zoom) / 2 : 0;
}

// show frames [f0, f1] across the whole width, but never fewer frames than fit at the
// default zoom
function showFrames(f0, f1) {
  const d = state.data;
  const width = el.stage.clientWidth;
  const minFrames = width / (d.X * MAX_ZOOM);
  const T = d.nSlots;
  let a = frameToSlot(Math.min(f0, f1));
  let b = frameToSlot(Math.max(f0, f1)) + 1;
  if (b - a < minFrames) {
    const mid = (a + b) / 2;
    a = mid - minFrames / 2;
    b = mid + minFrames / 2;
  }
  a = Math.max(0, a);
  b = Math.min(T, b);
  if (b - a < minFrames) {
    if (a === 0) b = Math.min(T, minFrames);
    else a = Math.max(0, T - minFrames);
  }
  setZoom(width / ((b - a) * d.X));
  state.viewX = a * d.X;
  clampView();
}

function viewWidthData() {
  return el.kymo.clientWidth / state.zoom;
}

function clampView() {
  const d = state.data;
  if (!d) return;
  const max = Math.max(0, d.W - viewWidthData());
  state.viewX = Math.min(Math.max(0, state.viewX), max);
  el.time.value = String(Math.round(slotToFrame(state.viewX / d.X)));
  updateTimeLabel();
}

function formatTime(frame) {
  const minutes = (frame * state.frameSeconds) / 60;
  const text = Number.isInteger(minutes) ? String(minutes) : minutes.toFixed(1);
  return `${text} min (frame ${frame})`;
}

function updateTimeLabel() {
  const d = state.data;
  if (!d) return;
  const frame = Number(el.time.value);
  const track = el.time.clientWidth - 14;
  el.timeLabel.style.left = `${el.time.offsetLeft + 7 + (frame / Math.max(1, d.T - 1)) * track}px`;
  el.timeLabel.textContent = formatTime(frame);
}

function resize() {
  const d = state.data;
  const dpr = window.devicePixelRatio || 1;
  const width = el.stage.clientWidth;
  const height = d ? Math.round(d.Y * MAX_ZOOM) : 300;
  if (d) setZoom(state.zoom);
  el.kymo.style.width = `${width}px`;
  el.kymo.style.height = `${height}px`;
  el.kymo.width = Math.round(width * dpr);
  el.kymo.height = Math.round(height * dpr);
  clampView();
  draw();
  drawTree();
}

function draw() {
  const d = state.data;
  const ctx = el.kymo.getContext("2d");
  const dpr = window.devicePixelRatio || 1;
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.fillStyle = "#0b0b0b";
  ctx.fillRect(0, 0, el.kymo.width, el.kymo.height);
  if (!d || !state.composite) return;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  const z = state.zoom;
  const oy = offsetY();
  const cssWidth = el.kymo.clientWidth;
  const sw = Math.min(cssWidth / z, d.W - state.viewX);
  // nearest-neighbour when magnified (like napari), smoothed when shrunk
  ctx.imageSmoothingEnabled = z < 1;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(state.composite, state.viewX, 0, sw, d.Y, 0, oy, sw * z, d.Y * z);

  const left = state.viewX;
  const right = state.viewX + cssWidth / z;
  const sx = (gx) => (gx - left) * z;
  const firstSlot = Math.max(0, Math.floor(left / d.X));
  const lastSlot = Math.min(d.nSlots - 1, Math.ceil(right / d.X));

  if (el.showBounds.checked && d.X * z >= 6) {
    ctx.strokeStyle = STYLE.boundsColor;
    ctx.lineWidth = Math.max(1, STYLE.boundsWidth * z);
    ctx.beginPath();
    for (let f = Math.max(1, firstSlot); f <= lastSlot; f++) {
      const x = Math.round(sx(f * d.X)) + 0.5;
      ctx.moveTo(x, oy);
      ctx.lineTo(x, oy + d.Y * z);
    }
    ctx.stroke();
  }

  // node centre in screen space; pixel i spans [i, i + 1], napari puts its centre at i
  const gx = (i) => d.slotOf[d.t[i]] * d.X + d.x[i] + 0.5;
  const gy = (i) => oy + (d.y[i] + 0.5) * z;

  if (el.showPaths.checked || el.showBranches.checked) {
    ctx.lineCap = "butt";
    for (const [s, t, kind] of d.links) {
      const x0 = gx(s);
      const x1 = gx(t);
      if (Math.max(x0, x1) < left - 1 || Math.min(x0, x1) > right + 1) continue;
      if (kind === 2 && !el.showBranches.checked) continue;
      if (kind !== 2 && !el.showPaths.checked) continue;
      const faded = !isEmphasised(d, t);
      const a = STYLE.linkOpacity * (faded ? 0.25 : 1);
      ctx.strokeStyle = kind === 2 ? css(STYLE.branchColor, a) : css(nodeColor(d, s), a);
      ctx.lineWidth = Math.max(0.75, (kind === 2 ? STYLE.branchWidth : STYLE.pathWidth) * z);
      ctx.setLineDash(kind === 0 ? [] : [STYLE.dash * z, STYLE.gap * z]);
      ctx.beginPath();
      ctx.moveTo(sx(x0), gy(s));
      ctx.lineTo(sx(x1), gy(t));
      ctx.stroke();
    }
    ctx.setLineDash([]);
  }

  const r = (STYLE.pointSize * z) / 2;
  if (el.showPoints.checked && r >= 1.5) {
    for (let i = 0; i < d.N; i++) {
      if (!d.shown[d.t[i]]) continue;
      const slot = d.slotOf[d.t[i]];
      if (slot < firstSlot || slot > lastSlot) continue;
      const x = sx(gx(i));
      const y = gy(i);
      const faded = !isEmphasised(d, i);
      const selected = state.selected && d.tracklet[i] === state.selected.tracklet;
      const hovered = i === state.hoverNode;
      drawSymbol(ctx, d, i, x, y, selected || hovered ? r * 1.35 : r, faded ? 0.3 : 1, selected || hovered);
    }
  }
}

function drawSymbol(ctx, d, i, x, y, r, alpha, strong) {
  const color = css(nodeColor(d, i), alpha);
  ctx.lineWidth = strong ? Math.max(2, r * 0.3) : Math.max(1, r * 0.12);
  ctx.strokeStyle = strong ? `rgba(0,255,255,${alpha})` : `rgba(255,255,255,${alpha})`;
  ctx.fillStyle = color;
  ctx.beginPath();
  if (d.outdeg[i] === 2) {
    // division: triangle up
    ctx.moveTo(x, y - r);
    ctx.lineTo(x + r * 0.95, y + r * 0.7);
    ctx.lineTo(x - r * 0.95, y + r * 0.7);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  } else {
    ctx.arc(x, y, r * 0.8, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  }
}

function pick(clientX, clientY) {
  const d = state.data;
  if (!d) return null;
  const rect = el.kymo.getBoundingClientRect();
  const gxData = state.viewX + (clientX - rect.left) / state.zoom;
  const gyData = (clientY - rect.top - offsetY()) / state.zoom;
  const slot = Math.floor(gxData / d.X);
  const x = Math.floor(gxData - slot * d.X);
  const y = Math.floor(gyData);
  if (slot < 0 || slot >= d.nSlots || y < 0 || y >= d.Y || x < 0 || x >= d.X) return null;
  const frame = d.frames[slot];
  const k = (frame * d.Y + y) * d.X + x;
  const lab = d.seg[k];
  const node = lab && lab < d.stride ? d.lut[frame * d.stride + lab] : -1;
  return { frame, x, y, node, value: d.img ? d.img[k] : null };
}

function describeNode(d, i) {
  return `cell ${d.ids[i]} · tracklet ${d.tracklet[i]} · lineage ${d.lineage[i]}`;
}

// ---------------------------------------------------------------- lineage tree

const TREE = { left: 54, right: 16, top: 22, bottom: 26, lane: 12, lineageGap: 10 };
document.documentElement.style.setProperty("--tree-left", `${TREE.left}px`);
document.documentElement.style.setProperty("--tree-right", `${TREE.right}px`);

// time from a tracklet's start to the last frame any of its descendants is seen
function descendantEnd(d) {
  const byId = (id) => d.tracklets[d.trackletIndex.get(id)];
  const memo = new Map();
  const end = (tr) => {
    if (memo.has(tr.id)) return memo.get(tr.id);
    let v = tr.end;
    for (const c of tr.children) v = Math.max(v, end(byId(c)));
    memo.set(tr.id, v);
    return v;
  };
  return end;
}

// Lineages are ordered by how long their longest line of descent lasts (in a mother
// machine, the old-pole mother's lineage comes first); within a lineage, each branch
// sits midway between its daughters.
function layoutTree() {
  const d = state.data;
  const byId = (id) => d.tracklets[d.trackletIndex.get(id)];
  const lastFrame = descendantEnd(d);
  let lane = 0;
  d.lineageTop = new Map();
  // the daughter whose descendants last longest goes below its sister, so a lineage
  // grows down and to the right, with its root near the top
  const place = (tr) => {
    const kids = tr.children.map(byId).sort((a, b) => lastFrame(a) - lastFrame(b) || b.y0 - a.y0);
    if (!kids.length) {
      tr.lane = lane++;
      return;
    }
    kids.forEach(place);
    tr.lane = (kids[0].lane + kids[kids.length - 1].lane) / 2;
  };
  const lineages = d.lineages.map((lin) => {
    const members = d.tracklets.filter((tr) => tr.lineage === lin);
    const roots = members
      .filter((tr) => tr.parentTracklet === null || !d.trackletIndex.has(tr.parentTracklet))
      .sort((a, b) => a.start - b.start || a.y0 - b.y0);
    const span = Math.max(...roots.map((r) => lastFrame(r) - r.start));
    return { lin, roots, span, size: members.length };
  });
  lineages.sort((a, b) => b.span - a.span || b.size - a.size || a.lin - b.lin);
  for (const { lin, roots } of lineages) {
    const top = lane;
    roots.forEach(place);
    d.lineageTop.set(lin, [top, lane - 1]);
    lane += 0.8; // gap between lineages
  }
  d.laneCount = lane;
}

function treeGeometry() {
  const d = state.data;
  const width = el.treeWrap.clientWidth;
  const plotW = width - TREE.left - TREE.right;
  return {
    width,
    height: TREE.top + TREE.bottom + Math.max(1, d.laneCount) * TREE.lane,
    tx: (t) => TREE.left + (t / Math.max(1, d.T - 1)) * plotW,
    ly: (lane) => TREE.top + (lane + 0.5) * TREE.lane,
    plotW,
  };
}

function drawTree() {
  if (state.tab === "spiral") drawSpiral();
  else drawLineageTree();
}

function drawLineageTree() {
  const d = state.data;
  const canvas = el.tree;
  const ctx = canvas.getContext("2d");
  const dpr = window.devicePixelRatio || 1;
  if (!d) {
    canvas.width = 1;
    canvas.height = 1;
    return;
  }
  const g = treeGeometry();
  canvas.style.width = `${g.width}px`;
  canvas.style.height = `${g.height}px`;
  canvas.width = Math.round(g.width * dpr);
  canvas.height = Math.round(g.height * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, g.width, g.height);

  // visible kymograph window
  const f0 = slotToFrame(state.viewX / d.X);
  const f1 = slotToFrame((state.viewX + viewWidthData()) / d.X);
  ctx.fillStyle = "rgba(17,17,17,0.06)";
  ctx.fillRect(g.tx(f0), TREE.top - 8, Math.max(2, g.tx(f1) - g.tx(f0)), g.height - TREE.top - TREE.bottom + 16);

  // time axis
  ctx.fillStyle = "rgba(17,17,17,0.6)";
  ctx.strokeStyle = "rgba(17,17,17,0.15)";
  ctx.font = "11px 'IBM Plex Mono', monospace";
  ctx.textAlign = "center";
  const tickStep = niceStep(d.T, g.plotW / 70);
  ctx.beginPath();
  for (let t = 0; t < d.T; t += tickStep) {
    const x = Math.round(g.tx(t)) + 0.5;
    ctx.moveTo(x, TREE.top - 6);
    ctx.lineTo(x, g.height - TREE.bottom + 4);
    ctx.fillText(String(t), x, g.height - 8);
  }
  ctx.stroke();
  ctx.textAlign = "left";
  ctx.fillText("frame", 4, g.height - 8);

  const sel = state.selected;
  // lineage labels
  ctx.textAlign = "right";
  for (const [lin, [a, b]] of d.lineageTop) {
    ctx.fillStyle = sel && sel.lineage !== lin ? "rgba(17,17,17,0.3)" : "rgba(17,17,17,0.75)";
    ctx.fillText(`L${lin}`, TREE.left - 8, (g.ly(a) + g.ly(b)) / 2 + 4);
  }
  ctx.textAlign = "left";

  // connectors from a parent's end to each child's start
  for (const tr of d.tracklets) {
    if (tr.parentTracklet === null || !d.trackletIndex.has(tr.parentTracklet)) continue;
    const p = d.tracklets[d.trackletIndex.get(tr.parentTracklet)];
    const faded = sel && sel.lineage !== tr.lineage;
    ctx.strokeStyle = faded ? "rgba(17,17,17,0.12)" : "rgba(17,17,17,0.45)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(g.tx(p.end), g.ly(p.lane));
    ctx.lineTo(g.tx(p.end), g.ly(tr.lane));
    ctx.lineTo(g.tx(tr.start), g.ly(tr.lane));
    ctx.stroke();
  }
  // branches
  for (const tr of d.tracklets) {
    const faded = sel && sel.lineage !== tr.lineage;
    const isSel = sel && sel.tracklet === tr.id;
    const id = el.colorBy.value === "lineage" ? tr.lineage : tr.id;
    const y = g.ly(tr.lane);
    const x0 = g.tx(tr.start);
    const x1 = Math.max(g.tx(tr.end), x0 + 1.5);
    if (isSel) {
      ctx.strokeStyle = "rgba(0,170,200,0.9)";
      ctx.lineWidth = 9;
      ctx.beginPath();
      ctx.moveTo(x0, y);
      ctx.lineTo(x1, y);
      ctx.stroke();
    }
    ctx.strokeStyle = css(colorOf(id), faded ? 0.25 : 1);
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(x0, y);
    ctx.lineTo(x1, y);
    ctx.stroke();
  }

  if (treeDrag && treeDrag.moved) {
    const a = g.tx(Math.min(treeDrag.from, treeDrag.to));
    const b = g.tx(Math.max(treeDrag.from, treeDrag.to));
    ctx.strokeStyle = "rgba(0,150,180,0.9)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (const x of [a, b]) {
      ctx.moveTo(Math.round(x) + 0.5, TREE.top - 8);
      ctx.lineTo(Math.round(x) + 0.5, g.height - TREE.bottom + 8);
    }
    ctx.stroke();
  }

  if (state.hoverFrame >= 0) {
    const x = Math.round(g.tx(state.hoverFrame)) + 0.5;
    ctx.strokeStyle = "rgba(0,150,180,0.8)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x, TREE.top - 8);
    ctx.lineTo(x, g.height - TREE.bottom + 8);
    ctx.stroke();
  }
}

function niceStep(total, maxTicks) {
  const raw = total / Math.max(1, maxTicks);
  for (const s of [1, 2, 5, 10, 20, 25, 50, 100, 200, 250, 500, 1000]) if (s >= raw) return s;
  return 1000;
}

function treePick(clientX, clientY) {
  const d = state.data;
  if (!d) return null;
  const rect = el.tree.getBoundingClientRect();
  const g = treeGeometry();
  const x = clientX - rect.left;
  const y = clientY - rect.top;
  const frame = Math.round(((x - TREE.left) / g.plotW) * (d.T - 1));
  let best = null;
  let bestDist = TREE.lane * 0.75;
  for (const tr of d.tracklets) {
    if (frame < tr.start - 3 || frame > tr.end + 3) continue;
    const dist = Math.abs(g.ly(tr.lane) - y);
    if (dist < bestDist) {
      bestDist = dist;
      best = tr;
    }
  }
  return { frame: Math.max(0, Math.min(d.T - 1, frame)), tracklet: best };
}


// ---------------------------------------------------------------- spiral view
//
// Each lineage is a spiral with time zero at the centre: an Archimedean spiral turning
// once per "minutes per turn" (default 2 h), which is the longest-lived line of descent
// (in a mother machine, the old-pole mother). Every other daughter leaves it along the
// spiral and curls outwards into a coil that tightens slowly as she lives, turning 1.5x
// faster than the spiral; her own other daughters curl the opposite way at 3x, on
// smaller coils, and deeper levels at 7.5x. A coil starts tangent to the spiral and stays inside a circle
// sitting on it, so it never crosses back; the turns are spaced to clear the tallest one.

const SPIRAL = {
  height: 560,
  margin: 30,
  r0: 3, // radius at time zero
  coil: 12, // starting radius of a daughter's coil
  tighten: 0.25, // how fast coils tighten, relative to the spiral's turning rate
  shrink: 0.7, // a granddaughter's coil relative to her mother's
  // how much faster than the spiral each level of offshoot turns: daughters, granddaughters,
  // then every deeper level
  rates: [1.5, 3, 7.5],
  clear: 3,
};
const SUBSTEPS = 4;

function framesPerTurn() {
  return Math.max(1, (Number(el.turn.value) * 60) / state.frameSeconds);
}

// offshoot coils in the local frame of their attachment: x along the spiral (forwards in
// time), y away from the centre; one point per frame from the division onwards
function layoutSpiral() {
  const d = state.data;
  const F = framesPerTurn();
  const w0 = (2 * Math.PI) / F;
  const byId = (id) => d.tracklets[d.trackletIndex.get(id)];
  const lastFrame = descendantEnd(d);
  const spirals = [];
  for (const lin of d.lineages) {
    const members = d.tracklets.filter((tr) => tr.lineage === lin);
    const roots = members
      .filter((tr) => tr.parentTracklet === null || !d.trackletIndex.has(tr.parentTracklet))
      .sort((a, b) => a.start - b.start || a.y0 - b.y0);
    const spine = new Set();
    let cur = roots[0];
    while (cur) {
      spine.add(cur.id);
      cur = cur.children.map(byId).sort((a, b) => lastFrame(b) - lastFrame(a) || a.y0 - b.y0)[0];
    }
    const shoot = new Map();
    let reach = 0;
    const grow = (tr, attach, x, y, heading, sense, rho, depth) => {
      const rate = w0 * SPIRAL.rates[Math.min(depth, SPIRAL.rates.length) - 1];
      const from = tr.parentTracklet !== null && d.trackletIndex.has(tr.parentTracklet) ? byId(tr.parentTracklet).end : tr.start;
      const frames = tr.end - from + 1;
      const pts = new Float64Array(2 * (frames + 1));
      pts[0] = x;
      pts[1] = y;
      for (let f = 1; f <= frames; f++) {
        for (let s = 0; s < SUBSTEPS; s++) {
          const step = (rho * rate) / SUBSTEPS;
          heading += (sense * rate) / SUBSTEPS;
          x += step * Math.cos(heading);
          y += step * Math.sin(heading);
          rho *= Math.exp((-SPIRAL.tighten * w0) / SUBSTEPS);
        }
        pts[2 * f] = x;
        pts[2 * f + 1] = y;
        reach = Math.max(reach, y);
      }
      shoot.set(tr.id, { attach, from, pts });
      const kids = tr.children.map(byId).sort((a, b) => lastFrame(b) - lastFrame(a) || a.y0 - b.y0);
      kids.forEach((k, i) => {
        if (i === 0) grow(k, attach, x, y, heading, sense, rho, depth);
        else grow(k, attach, x, y, heading - sense * 0.5, -sense, rho * SPIRAL.shrink, depth + 1);
      });
    };
    for (const id of spine) {
      const tr = byId(id);
      for (const c of tr.children) {
        if (!spine.has(c)) grow(byId(c), tr.end, 0, 0, 0, 1, SPIRAL.coil / SPIRAL.rates[0], 1);
      }
    }
    for (const r of roots.slice(1)) grow(r, r.start, 0, 0, 0, 1, SPIRAL.coil / SPIRAL.rates[0], 1);
    const start = Math.min(...members.map((tr) => tr.start));
    const end = Math.max(...members.map((tr) => tr.end));
    const gap = reach + SPIRAL.clear;
    // the spine, one pose per frame: time zero points up and time runs clockwise
    const poses = [];
    for (let t = start; t <= end + 1; t++) {
      const th = w0 * t;
      const r = SPIRAL.r0 + (gap * t) / F;
      const x = r * Math.sin(th);
      const y = -r * Math.cos(th);
      const th2 = w0 * (t + 0.5);
      const r2 = SPIRAL.r0 + (gap * (t + 0.5)) / F;
      let tx = r2 * Math.sin(th2) - x;
      let ty = -r2 * Math.cos(th2) - y;
      const len = Math.hypot(tx, ty) || 1;
      tx /= len;
      ty /= len;
      let nx = ty;
      let ny = -tx;
      if (nx * x + ny * y < 0) {
        nx = -nx;
        ny = -ny;
      }
      poses.push({ x, y, tx, ty, nx, ny });
    }
    const sp = { lineage: lin, tracklets: members, spine, shoot, start, end, poses, x: 0, y: 0 };
    let radius = Math.hypot(poses[poses.length - 1].x, poses[poses.length - 1].y);
    for (const tr of members) {
      if (spine.has(tr.id)) continue;
      const s = shoot.get(tr.id);
      for (let i = 0; i < s.pts.length; i += 2) {
        const [px, py] = spiralPoint(sp, tr, s.from + i / 2);
        radius = Math.max(radius, Math.hypot(px, py));
      }
    }
    sp.radius = radius + 6;
    spirals.push(sp);
  }
  return spirals;
}

function poseAt(sp, t) {
  const i = Math.min(sp.poses.length - 1, Math.max(0, t - sp.start));
  const i0 = Math.floor(i);
  const i1 = Math.min(sp.poses.length - 1, i0 + 1);
  const f = i - i0;
  const a = sp.poses[i0];
  if (f === 0) return a;
  const b = sp.poses[i1];
  return { x: a.x + (b.x - a.x) * f, y: a.y + (b.y - a.y) * f, tx: a.tx, ty: a.ty, nx: a.nx, ny: a.ny };
}

// spiral-local position of a tracklet at frame t
function spiralPoint(sp, tr, t) {
  const s = sp.shoot.get(tr.id);
  if (!s) {
    const p = poseAt(sp, t);
    return [p.x, p.y];
  }
  const n = s.pts.length / 2 - 1;
  const i = Math.min(n, Math.max(0, t - s.from));
  const i0 = Math.floor(i);
  const i1 = Math.min(n, i0 + 1);
  const f = i - i0;
  const a = s.pts[2 * i0] + (s.pts[2 * i1] - s.pts[2 * i0]) * f;
  const b = s.pts[2 * i0 + 1] + (s.pts[2 * i1 + 1] - s.pts[2 * i0 + 1]) * f;
  const p = poseAt(sp, s.attach);
  return [p.x + a * p.tx + b * p.nx, p.y + a * p.ty + b * p.ny];
}

// the biggest spiral on the left, the rest in a grid beside it, fitted to the panel
function arrangeSpirals(view) {
  const width = el.treeWrap.clientWidth;
  const height = SPIRAL.height;
  const m = SPIRAL.margin;
  const order = view.spirals.map((sp, i) => i).sort((a, b) => view.spirals[b].radius - view.spirals[a].radius);
  const big = view.spirals[order[0]];
  const rest = order.slice(1);
  let best = null;
  for (let cols = 1; cols <= Math.max(1, rest.length); cols++) {
    const rows = Math.ceil(rest.length / cols);
    const cell = rest.length ? Math.max(...rest.map((i) => 2 * view.spirals[i].radius)) : 0;
    const totalW = 2 * big.radius + (rest.length ? m + cols * cell + (cols - 1) * m : 0);
    const totalH = Math.max(2 * big.radius, rows * cell + (rows - 1) * m);
    const scale = Math.min((width - 2 * m) / totalW, (height - 2 * m) / totalH);
    if (!best || scale > best.scale) best = { scale, cols, cell, totalW, totalH };
  }
  const { scale, cols, cell, totalW, totalH } = best;
  big.x = -totalW / 2 + big.radius;
  big.y = 0;
  rest.forEach((i, n) => {
    const c = n % cols;
    const r = Math.floor(n / cols);
    const rows = Math.ceil(rest.length / cols);
    view.spirals[i].x = -totalW / 2 + 2 * big.radius + m + c * (cell + m) + cell / 2;
    view.spirals[i].y = -(rows * cell + (rows - 1) * m) / 2 + r * (cell + m) + cell / 2;
  });
  view.scale = scale;
  view.panX = width / 2;
  view.panY = height / 2;
}

function ensureSpiralView() {
  const d = state.data;
  if (!d) return null;
  const key = String(framesPerTurn());
  if (state.spiralView && state.spiralView.key === key) return state.spiralView;
  const old = state.spiralView;
  const view = { spirals: layoutSpiral(), key };
  arrangeSpirals(view);
  if (old && old.moved) {
    // keep the arrangement the user made; only the spirals' shapes change
    const scale = old.scale / view.scale;
    old.spirals.forEach((sp, i) => {
      view.spirals[i].x = sp.x * scale;
      view.spirals[i].y = sp.y * scale;
    });
    Object.assign(view, { scale: old.scale / scale, panX: old.panX, panY: old.panY, moved: true });
  }
  state.spiralView = view;
  return view;
}

function drawSpiral() {
  const d = state.data;
  const canvas = el.spiral;
  const ctx = canvas.getContext("2d");
  const dpr = window.devicePixelRatio || 1;
  const width = el.treeWrap.clientWidth;
  const height = SPIRAL.height;
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  canvas.width = Math.round(width * dpr);
  canvas.height = Math.round(height * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, width, height);
  el.turnValue.textContent = `${el.turn.value} min`;
  const view = ensureSpiralView();
  if (!view) return;
  const k = view.scale;
  const sel = state.selected;
  const screen = (sp, [x, y]) => [view.panX + (sp.x + x) * k, view.panY + (sp.y + y) * k];
  const trace = (sp, tr, t0, t1) => {
    ctx.beginPath();
    const a0 = Math.ceil(t0);
    const pts = [t0];
    for (let t = a0; t < t1; t++) if (t > t0) pts.push(t);
    pts.push(t1);
    pts.forEach((t, i) => {
      const [x, y] = screen(sp, spiralPoint(sp, tr, t));
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
  };
  const f0 = slotToFrame(state.viewX / d.X);
  const f1 = slotToFrame((state.viewX + viewWidthData()) / d.X);
  // fixed on screen, like the prototype: zooming in spreads the lines apart, not fattens them
  const spineWidth = 4;
  const shootWidth = 3;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  for (const sp of view.spirals) {
    const faded = sel && sel.lineage !== sp.lineage;
    const spine = sp.tracklets.filter((tr) => sp.spine.has(tr.id));
    const shoots = sp.tracklets.filter((tr) => !sp.spine.has(tr.id));

    // frames currently shown in the kymograph, as a band along the spine
    ctx.strokeStyle = "rgba(17,17,17,0.24)";
    ctx.lineWidth = spineWidth + 14;
    for (const tr of spine) {
      const a = Math.max(tr.start, f0);
      const b = Math.min(tr.end + 1, f1, sp.end);
      if (b > a) {
        trace(sp, tr, a, b);
        ctx.stroke();
      }
    }

    // offshoots first, so the spine is drawn over their roots
    for (const tr of shoots) {
      const shoot = sp.shoot.get(tr.id);
      const id = el.colorBy.value === "lineage" ? tr.lineage : tr.id;
      const t1 = Math.max(tr.end, shoot.from + 0.5);
      if (sel && sel.tracklet === tr.id) {
        ctx.strokeStyle = "rgba(0,170,200,0.9)";
        ctx.lineWidth = shootWidth + 5;
        trace(sp, tr, shoot.from, t1);
        ctx.stroke();
      }
      ctx.strokeStyle = css(colorOf(id), faded ? 0.25 : 1);
      ctx.lineWidth = shootWidth;
      trace(sp, tr, shoot.from, t1);
      ctx.stroke();
    }
    for (const tr of spine) {
      const id = el.colorBy.value === "lineage" ? tr.lineage : tr.id;
      const t1 = Math.min(sp.end, tr.end + (tr.divides ? 1 : 0));
      if (sel && sel.tracklet === tr.id) {
        ctx.strokeStyle = "rgba(0,170,200,0.9)";
        ctx.lineWidth = spineWidth + 5;
        trace(sp, tr, tr.start, Math.max(t1, tr.start + 0.5));
        ctx.stroke();
      }
      ctx.strokeStyle = css(colorOf(id), faded ? 0.25 : 1);
      ctx.lineWidth = spineWidth;
      trace(sp, tr, tr.start, Math.max(t1, tr.start + 0.5));
      ctx.stroke();
    }

    // time marks sit on the spine itself, on a white label, so they never run into
    // the neighbouring turn or the coils
    ctx.font = "10px 'IBM Plex Mono', monospace";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    // one label per turn, where the spiral crosses straight up from the centre
    const turn = Number(el.turn.value);
    for (let minutes = turn; ; minutes += turn) {
      const t = (minutes * 60) / state.frameSeconds;
      if (t > sp.end) break;
      if (t < sp.start) continue;
      const p = poseAt(sp, t);
      const [x, y] = screen(sp, [p.x, p.y]);
      const text = `${Number.isInteger(minutes / 60) ? minutes / 60 : (minutes / 60).toFixed(1)}h`;
      const w = ctx.measureText(text).width + 6;
      ctx.fillStyle = "rgba(255,255,255,0.92)";
      ctx.beginPath();
      ctx.roundRect(x - w / 2, y - 7, w, 14, 7);
      ctx.fill();
      ctx.fillStyle = faded ? "rgba(17,17,17,0.3)" : "rgba(17,17,17,0.75)";
      ctx.fillText(text, x, y + 0.5);
    }
    ctx.textBaseline = "alphabetic";

    // where the kymograph cursor is in time, on every cell alive then
    if (state.hoverFrame >= sp.start && state.hoverFrame <= sp.end) {
      ctx.fillStyle = "rgba(0,170,200,1)";
      for (const tr of sp.tracklets) {
        if (state.hoverFrame < tr.start || state.hoverFrame > tr.end) continue;
        const [x, y] = screen(sp, spiralPoint(sp, tr, state.hoverFrame));
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // lineage name above the spiral
    ctx.fillStyle = faded ? "rgba(17,17,17,0.3)" : "rgba(17,17,17,0.8)";
    ctx.textAlign = "center";
    ctx.font = "600 11px 'IBM Plex Mono', monospace";
    const [lx, ly] = screen(sp, [0, -sp.radius]);
    ctx.fillText(`L${sp.lineage}`, lx, ly - 4);
  }
}

function formatMinutes(frame) {
  const minutes = (frame * state.frameSeconds) / 60;
  return `${Number.isInteger(minutes) ? minutes : minutes.toFixed(1)}m`;
}

// nearest branch to a point on the spiral canvas
function spiralPick(clientX, clientY) {
  const view = state.spiralView;
  if (!state.data || !view) return null;
  const rect = el.spiral.getBoundingClientRect();
  const mx = (clientX - rect.left - view.panX) / view.scale;
  const my = (clientY - rect.top - view.panY) / view.scale;
  let best = null;
  let bestDist = Math.max(4, 8 / view.scale);
  let spiral = null;
  for (const sp of view.spirals) {
    const dx = mx - sp.x;
    const dy = my - sp.y;
    if (Math.hypot(dx, dy) <= sp.radius) spiral = sp;
    for (const tr of sp.tracklets) {
      for (let t = tr.start; t <= tr.end; t++) {
        const [x, y] = spiralPoint(sp, tr, t);
        const dist = Math.hypot(dx - x, dy - y);
        if (dist < bestDist) {
          bestDist = dist;
          best = { tracklet: tr, frame: t, spiral: sp };
        }
      }
    }
  }
  return best || (spiral ? { tracklet: null, frame: -1, spiral } : null);
}

function setTab(tab) {
  state.tab = tab;
  const spiral = tab === "spiral";
  el.tabTree.classList.toggle("active", !spiral);
  el.tabSpiral.classList.toggle("active", spiral);
  el.tabTree.setAttribute("aria-selected", String(!spiral));
  el.tabSpiral.setAttribute("aria-selected", String(spiral));
  el.tree.hidden = spiral;
  el.spiral.hidden = !spiral;
  el.turnControl.hidden = !spiral;
  el.resetSpiral.hidden = !spiral;
  drawTree();
  writeUrlSoon();
}

el.tabTree.addEventListener("click", () => setTab("tree"));
el.tabSpiral.addEventListener("click", () => setTab("spiral"));
el.turn.addEventListener("input", () => {
  drawTree();
  writeUrlSoon();
});
el.resetSpiral.addEventListener("click", () => {
  state.spiralView = null;
  drawTree();
});

// drag a spiral to move it, drag empty space to pan, scroll to zoom, click to select
let spiralDrag = null;

el.spiral.addEventListener("pointerdown", (event) => {
  const view = state.spiralView;
  if (!view) return;
  const hit = spiralPick(event.clientX, event.clientY);
  spiralDrag = {
    x: event.clientX,
    y: event.clientY,
    moved: false,
    spiral: hit ? hit.spiral : null,
    start: hit && hit.spiral ? [hit.spiral.x, hit.spiral.y] : [view.panX, view.panY],
  };
  el.spiral.setPointerCapture(event.pointerId);
  el.spiral.style.cursor = "grabbing";
});

el.spiral.addEventListener("pointermove", (event) => {
  const view = state.spiralView;
  if (!view) return;
  if (spiralDrag) {
    const dx = event.clientX - spiralDrag.x;
    const dy = event.clientY - spiralDrag.y;
    if (Math.hypot(dx, dy) > 3) spiralDrag.moved = true;
    if (!spiralDrag.moved) return;
    view.moved = true;
    if (spiralDrag.spiral) {
      spiralDrag.spiral.x = spiralDrag.start[0] + dx / view.scale;
      spiralDrag.spiral.y = spiralDrag.start[1] + dy / view.scale;
    } else {
      view.panX = spiralDrag.start[0] + dx;
      view.panY = spiralDrag.start[1] + dy;
    }
    drawSpiral();
    return;
  }
  const hit = spiralPick(event.clientX, event.clientY);
  el.spiral.style.cursor = hit && hit.tracklet ? "pointer" : "grab";
  el.hover.textContent =
    hit && hit.tracklet
      ? `${formatTime(hit.frame)} · tracklet ${hit.tracklet.id} · lineage ${hit.tracklet.lineage} · frames ${hit.tracklet.start}–${hit.tracklet.end}`
      : "";
});

el.spiral.addEventListener("pointerup", (event) => {
  const dragged = spiralDrag && spiralDrag.moved;
  spiralDrag = null;
  el.spiral.style.cursor = "grab";
  if (dragged || !state.data) return;
  const hit = spiralPick(event.clientX, event.clientY);
  if (hit && hit.tracklet) {
    centerOnFrame(hit.frame);
    select(hit.tracklet.id);
  } else {
    select(null);
  }
  writeUrl();
});

el.spiral.addEventListener(
  "wheel",
  (event) => {
    const view = state.spiralView;
    if (!view) return;
    event.preventDefault();
    const rect = el.spiral.getBoundingClientRect();
    const px = event.clientX - rect.left;
    const py = event.clientY - rect.top;
    const factor = Math.exp(-event.deltaY * 0.0015);
    view.panX = px - (px - view.panX) * factor;
    view.panY = py - (py - view.panY) * factor;
    view.scale *= factor;
    view.moved = true;
    drawSpiral();
  },
  { passive: false },
);

// ---------------------------------------------------------------- selection

function select(trackletId) {
  const d = state.data;
  if (trackletId === null || trackletId === undefined) {
    state.selected = null;
  } else {
    const tr = d.tracklets[d.trackletIndex.get(trackletId)];
    state.selected = { tracklet: tr.id, lineage: tr.lineage };
  }
  buildComposite();
  draw();
  drawTree();
  updateSelectionPanel();
}

function updateSelectionPanel() {
  const d = state.data;
  const sel = state.selected;
  if (!d || !sel) {
    el.selection.innerHTML = "<dt>None</dt><dd>Click a cell or a branch</dd>";
    return;
  }
  const tr = d.tracklets[d.trackletIndex.get(sel.tracklet)];
  const lineageTracklets = d.tracklets.filter((x) => x.lineage === tr.lineage);
  const rows = [
    ["Tracklet", tr.id],
    ["Lineage", `${tr.lineage} (${lineageTracklets.length} tracklets)`],
    ["Frames", `${tr.start}–${tr.end} (${tr.nodes.length} cells)`],
    ["Parent", tr.parentTracklet ?? "none"],
    ["Daughters", tr.children.length ? tr.children.join(", ") : "none"],
    ["Ends by", tr.divides ? "division" : tr.end === d.T - 1 ? "end of movie" : "leaving / lost"],
  ];
  el.selection.innerHTML = rows.map(([k, v]) => `<dt>${k}</dt><dd>${v}</dd>`).join("");
}

function centerOnFrame(frame) {
  const d = state.data;
  state.viewX = frameToSlot(frame) * d.X + d.X / 2 - viewWidthData() / 2;
  clampView();
}

// ---------------------------------------------------------------- interaction

let drag = null;

el.stage.addEventListener("pointerdown", (event) => {
  if (!state.data) return;
  drag = { x: event.clientX, viewX: state.viewX, moved: false };
  el.stage.setPointerCapture(event.pointerId);
  el.stage.classList.add("dragging");
});

el.stage.addEventListener("pointermove", (event) => {
  const d = state.data;
  if (!d) return;
  if (drag) {
    const dx = event.clientX - drag.x;
    if (Math.abs(dx) > 3) drag.moved = true;
    state.viewX = drag.viewX - dx / state.zoom;
    clampView();
    draw();
    drawTree();
    return;
  }
  const hit = pick(event.clientX, event.clientY);
  const node = hit ? hit.node : -1;
  const frame = hit ? hit.frame : -1;
  if (node !== state.hoverNode || frame !== state.hoverFrame) {
    state.hoverNode = node;
    state.hoverFrame = frame;
    draw();
    drawTree();
  }
  if (!hit) {
    el.hover.textContent = "";
    return;
  }
  const value = hit.value === null ? "" : ` · intensity ${hit.value.toFixed(0)}`;
  const cell = node >= 0 ? ` · ${describeNode(d, node)}` : "";
  el.hover.textContent = `${formatTime(hit.frame)} · y ${hit.y} x ${hit.x}${value}${cell}`;
});

el.stage.addEventListener("pointerup", (event) => {
  el.stage.classList.remove("dragging");
  const wasDrag = drag && drag.moved;
  drag = null;
  if (wasDrag || !state.data) return;
  const hit = pick(event.clientX, event.clientY);
  select(hit && hit.node >= 0 ? state.data.tracklet[hit.node] : null);
  writeUrl();
});

el.stage.addEventListener("pointerleave", () => {
  if (drag) return;
  state.hoverNode = -1;
  state.hoverFrame = -1;
  el.hover.textContent = "";
  draw();
  drawTree();
});

el.stage.addEventListener(
  "wheel",
  (event) => {
    if (!state.data) return;
    event.preventDefault();
    if (event.ctrlKey || event.metaKey) {
      const rect = el.kymo.getBoundingClientRect();
      const anchor = state.viewX + (event.clientX - rect.left) / state.zoom;
      setZoom(state.zoom * Math.exp(-event.deltaY * 0.01));
      state.viewX = anchor - (event.clientX - rect.left) / state.zoom;
      resize();
    } else {
      const delta = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY;
      state.viewX += delta / state.zoom;
      clampView();
      draw();
      drawTree();
    }
    writeUrlSoon();
  },
  { passive: false },
);

// drag across the tree to choose a time range: the kymograph zooms to show all of it
let treeDrag = null;

el.tree.addEventListener("pointerdown", (event) => {
  if (!state.data) return;
  const hit = treePick(event.clientX, event.clientY);
  if (!hit) return;
  treeDrag = { x: event.clientX, from: hit.frame, to: hit.frame, moved: false };
  el.tree.setPointerCapture(event.pointerId);
});

el.tree.addEventListener("pointermove", (event) => {
  if (!treeDrag) return;
  if (Math.abs(event.clientX - treeDrag.x) > 3) treeDrag.moved = true;
  if (!treeDrag.moved) return;
  const hit = treePick(event.clientX, event.clientY);
  if (!hit) return;
  treeDrag.to = hit.frame;
  showFrames(treeDrag.from, treeDrag.to);
  draw();
  drawTree();
  writeUrlSoon();
});

el.tree.addEventListener("pointerup", (event) => {
  const dragged = treeDrag && treeDrag.moved;
  treeDrag = null;
  if (dragged) {
    drawTree();
    writeUrl();
    return;
  }
  const hit = treePick(event.clientX, event.clientY);
  if (!hit) return;
  centerOnFrame(hit.frame);
  select(hit.tracklet ? hit.tracklet.id : null);
  writeUrl();
});

el.tree.addEventListener("mousemove", (event) => {
  const d = state.data;
  const hit = treePick(event.clientX, event.clientY);
  if (!d || !hit) return;
  el.tree.style.cursor = treeDrag ? "ew-resize" : hit.tracklet ? "pointer" : "crosshair";
  el.hover.textContent = hit.tracklet
    ? `frame ${hit.frame} · tracklet ${hit.tracklet.id} · lineage ${hit.tracklet.lineage} · frames ${hit.tracklet.start}–${hit.tracklet.end}`
    : `frame ${hit.frame}`;
});

el.time.addEventListener("input", () => {
  if (!state.data) return;
  state.viewX = frameToSlot(Number(el.time.value)) * state.data.X;
  clampView();
  draw();
  drawTree();
  writeUrlSoon();
});

el.resetZoom.addEventListener("click", () => {
  if (!state.data) return;
  const center = state.viewX + viewWidthData() / 2;
  setZoom(DEFAULT_ZOOM);
  state.viewX = center - viewWidthData() / 2;
  resize();
  writeUrl();
});

el.zoom.addEventListener("input", () => {
  if (!state.data) return;
  const center = state.viewX + viewWidthData() / 2;
  setZoom(zoomFromSlider());
  state.viewX = center - viewWidthData() / 2;
  resize();
  writeUrlSoon();
});

function contrastFromSliders() {
  const d = state.data;
  if (!d || !d.range) return;
  const [min, max] = d.range;
  let a = Number(el.lo.value);
  let b = Number(el.hi.value);
  if (b <= a) b = Math.min(1, a + 0.001);
  d.contrast = [min + a * (max - min), min + b * (max - min)];
  buildComposite();
  draw();
}

el.lo.addEventListener("input", contrastFromSliders);
el.hi.addEventListener("input", contrastFromSliders);
const refreshFrames = () => {
  const d = state.data;
  if (!d) return;
  const center = slotToFrame((state.viewX + viewWidthData() / 2) / d.X);
  buildFrames(d);
  buildComposite();
  setZoom(state.zoom);
  state.viewX = frameToSlot(center) * d.X - viewWidthData() / 2;
  resize();
  writeUrlSoon();
};
el.subsample.addEventListener("input", refreshFrames);
el.divisionsOnly.addEventListener("input", refreshFrames);

for (const control of [el.opacity, el.showMasks, el.colorBy]) {
  control.addEventListener("input", () => {
    if (!state.data) return;
    buildComposite();
    draw();
    drawTree();
  });
}
for (const control of [el.showPoints, el.showPaths, el.showBranches, el.showBounds]) {
  control.addEventListener("input", draw);
}

el.clear.addEventListener("click", () => {
  if (state.data) select(null);
});

window.addEventListener("keydown", (event) => {
  const d = state.data;
  if (!d || event.target instanceof HTMLInputElement || event.target instanceof HTMLSelectElement) return;
  if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
    const sign = event.key === "ArrowRight" ? 1 : -1;
    const step = event.shiftKey ? viewWidthData() : d.X;
    state.viewX = Math.round((state.viewX + sign * step) / d.X) * d.X;
    clampView();
    draw();
    drawTree();
    writeUrlSoon();
    event.preventDefault();
  } else if (event.key === "Escape") {
    select(null);
  }
});

window.addEventListener("resize", () => {
  if (state.data) resize();
});

// ---------------------------------------------------------------- trench list + URL

let urlTimer = null;
function writeUrlSoon() {
  clearTimeout(urlTimer);
  urlTimer = setTimeout(writeUrl, 300);
}

function writeUrl() {
  const params = new URLSearchParams();
  params.set("dataset", el.dataset.value.trim());
  if (el.trench.value) params.set("trench", el.trench.value);
  if (state.data) params.set("frame", String(Math.round(slotToFrame(state.viewX / state.data.X))));
  if (Number(el.subsample.value) > 1) params.set("subsample", el.subsample.value);
  if (el.divisionsOnly.checked) params.set("divisions", "only");
  params.set("zoom", String(Number(state.zoom.toFixed(4))));
  if (state.selected) params.set("tracklet", String(state.selected.tracklet));
  if (state.tab === "spiral") {
    params.set("view", "spiral");
    params.set("turn", el.turn.value);
  }
  history.replaceState(null, "", `${location.pathname}?${params}`);
}

async function loadDataset(preferred) {
  el.loadDataset.disabled = true;
  try {
    setStatus("Listing trenches...");
    const names = await listTrenches();
    if (!names.length) throw new Error("No trench folders found in this dataset");
    el.trench.innerHTML = names.map((n) => `<option value="${n}">${n}</option>`).join("");
    el.trench.value = names.includes(preferred) ? preferred : names[0];
    await loadTrench(el.trench.value);
  } catch (error) {
    setStatus(error.message || String(error), true);
  } finally {
    el.loadDataset.disabled = false;
  }
}

async function switchTrench(name) {
  try {
    await loadTrench(name);
  } catch (error) {
    setStatus(error.message || String(error), true);
  }
}

el.loadDataset.addEventListener("click", () => loadDataset());
el.trench.addEventListener("change", () => switchTrench(el.trench.value));
const step = (delta) => {
  const i = el.trench.selectedIndex + delta;
  if (i < 0 || i >= el.trench.options.length) return;
  el.trench.selectedIndex = i;
  switchTrench(el.trench.value);
};
el.prev.addEventListener("click", () => step(-1));
el.next.addEventListener("click", () => step(1));

const params = new URLSearchParams(location.search);
el.dataset.value = params.get("dataset") || DEFAULT_DATASET;
state.zoom = Number(params.get("zoom")) || DEFAULT_ZOOM;
if (params.get("subsample")) el.subsample.value = params.get("subsample");
if (params.get("divisions") === "only") el.divisionsOnly.checked = true;
el.subsampleValue.textContent = "every frame";
if (params.get("turn")) el.turn.value = params.get("turn");
if (params.get("view") === "spiral") setTab("spiral");
loadDataset(params.get("trench")).then(() => {
  const wanted = Number(params.get("tracklet"));
  if (state.data && params.get("tracklet") && state.data.trackletIndex.has(wanted)) select(wanted);
});
