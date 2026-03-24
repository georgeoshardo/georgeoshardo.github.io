import * as zarr from "https://cdn.jsdelivr.net/npm/zarrita@0.6.1/+esm";

const DEFAULT_MASK_SOURCE =
  "https://huggingface.co/datasets/ghardo/scientific_data_2026_masks/resolve/main/20260307_SB7_exit_snake_V4_1.segmentation_masks_multi_epoch_uint8_masks_only.zarr/data";
const DEFAULT_IMAGE_SOURCE =
  "https://huggingface.co/datasets/ghardo/scientific_data_2026_images/resolve/main/20260307_SB7_exit_snake_V4_1_with_metadata.trenches.zarr/data";
const DEFAULT_MASK_ALPHA = 0.45;
const MAX_CACHED_CHUNKS = 8;
const FETCH_DEBOUNCE_MS = 100;
const PHASE_CHANNEL_PREFERENCES = ["pc", "phase", "phase contrast", "phase_contrast"];
const PALETTE = buildPalette(256);

const elements = {
  maskSourceInput: document.getElementById("mask-source-input"),
  imageSourceInput: document.getElementById("image-source-input"),
  loadButton: document.getElementById("load-button"),
  copyLinkButton: document.getElementById("copy-link-button"),
  status: document.getElementById("status"),
  metadata: document.getElementById("metadata"),
  controls: document.getElementById("controls"),
  zoomRange: document.getElementById("zoom-range"),
  zoomNumber: document.getElementById("zoom-number"),
  maskAlphaRange: document.getElementById("mask-alpha-range"),
  maskAlphaNumber: document.getElementById("mask-alpha-number"),
  canvas: document.getElementById("mask-canvas"),
  viewSummary: document.getElementById("view-summary"),
  hoverReadout: document.getElementById("hover-readout"),
};

const context = elements.canvas.getContext("2d", { alpha: false });

const state = {
  maskArray: null,
  imageArray: null,
  maskSource: DEFAULT_MASK_SOURCE,
  imageSource: DEFAULT_IMAGE_SOURCE,
  maskAxisInfo: [],
  imageAxisInfo: [],
  viewSelection: {},
  zoom: 4,
  maskAlpha: DEFAULT_MASK_ALPHA,
  phaseChannelIndex: 0,
  phaseChannelLabel: "PC",
  maskCache: new Map(),
  imageCache: new Map(),
  currentMaskChunk: null,
  currentImageChunk: null,
  currentSlice: null,
  refreshToken: 0,
  pendingRefreshTimer: null,
};

initialise();

function initialise() {
  const params = new URLSearchParams(window.location.search);
  state.maskSource = normalizeSource(params.get("mask_source") || params.get("source") || DEFAULT_MASK_SOURCE);
  state.imageSource = normalizeSource(params.get("image_source") || DEFAULT_IMAGE_SOURCE);
  state.zoom = clampInteger(params.get("zoom"), 1, 18, 4);
  state.maskAlpha = clampNumber(params.get("mask_alpha"), 0, 1, DEFAULT_MASK_ALPHA);

  elements.maskSourceInput.value = state.maskSource;
  elements.imageSourceInput.value = state.imageSource;
  syncZoomInputs(state.zoom);
  syncMaskAlphaInputs(state.maskAlpha);
  applyZoom();

  elements.loadButton.addEventListener("click", () => {
    loadDatasets(elements.maskSourceInput.value, elements.imageSourceInput.value);
  });

  elements.maskSourceInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      loadDatasets(elements.maskSourceInput.value, elements.imageSourceInput.value);
    }
  });

  elements.imageSourceInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      loadDatasets(elements.maskSourceInput.value, elements.imageSourceInput.value);
    }
  });

  elements.copyLinkButton.addEventListener("click", async () => {
    const url = buildUrl();
    try {
      await navigator.clipboard.writeText(url);
      setStatus("Current view link copied to clipboard.");
    } catch {
      setStatus(`Copy failed. Use this link manually: ${url}`);
    }
  });

  elements.zoomRange.addEventListener("input", (event) => {
    updateZoom(event.target.value);
  });

  elements.zoomNumber.addEventListener("input", (event) => {
    updateZoom(event.target.value);
  });

  elements.maskAlphaRange.addEventListener("input", (event) => {
    updateMaskAlpha(event.target.value);
  });

  elements.maskAlphaNumber.addEventListener("input", (event) => {
    updateMaskAlpha(event.target.value);
  });

  elements.canvas.addEventListener("mousemove", updateHoverReadout);
  elements.canvas.addEventListener("mouseleave", () => {
    elements.hoverReadout.textContent = "";
  });

  loadDatasets(state.maskSource, state.imageSource);
}

async function loadDatasets(maskSourceInput, imageSourceInput) {
  const maskSource = normalizeSource(maskSourceInput);
  const imageSource = normalizeSource(imageSourceInput);

  elements.maskSourceInput.value = maskSource;
  elements.imageSourceInput.value = imageSource;
  elements.controls.innerHTML = "";
  elements.metadata.innerHTML = "";
  elements.viewSummary.textContent = "Loading array metadata...";

  state.maskCache.clear();
  state.imageCache.clear();
  state.currentMaskChunk = null;
  state.currentImageChunk = null;
  state.currentSlice = null;
  clearPendingRefresh();
  setBusy(true);
  setStatus("Opening remote Zarr arrays...");

  try {
    const [maskArray, imageArray, imageMeta] = await Promise.all([
      zarr.open.v3(new zarr.FetchStore(maskSource), { kind: "array" }),
      zarr.open.v2(new zarr.FetchStore(imageSource), { kind: "array" }),
      loadImageMetadata(imageSource),
    ]);

    const maskAxisInfo = buildAxisInfo(maskArray.shape.slice(), maskArray.chunks.slice(), maskArray.attrs || {});
    const imageAxisInfo = buildAxisInfo(imageArray.shape.slice(), imageArray.chunks.slice(), imageArray.attrs || {});

    assertRequiredAxes(maskAxisInfo, ["hypothesis", "trench", "time", "y", "x"], "mask");
    assertRequiredAxes(imageAxisInfo, ["trench", "time", "channel", "y", "x"], "image");

    state.maskArray = maskArray;
    state.imageArray = imageArray;
    state.maskSource = maskSource;
    state.imageSource = imageSource;
    state.maskAxisInfo = maskAxisInfo;
    state.imageAxisInfo = imageAxisInfo;
    state.phaseChannelIndex = imageMeta.phaseChannelIndex;
    state.phaseChannelLabel = imageMeta.phaseChannelLabel;
    state.viewSelection = initialiseViewSelection(maskAxisInfo, new URLSearchParams(window.location.search));

    renderMetadata();
    renderControls();
    await refreshView(true);
  } catch (error) {
    handleRefreshError(error, "Failed to load arrays");
  } finally {
    setBusy(false);
  }
}

async function loadImageMetadata(imageSource) {
  const groupRoot = deriveImageGroupRoot(imageSource);
  const channelLabels = await loadChannelLabels(groupRoot);
  const phaseChannelIndex = findPhaseChannelIndex(channelLabels);

  return {
    channelLabels,
    phaseChannelIndex,
    phaseChannelLabel: channelLabels[phaseChannelIndex] || `channel ${phaseChannelIndex}`,
  };
}

function deriveImageGroupRoot(imageSource) {
  if (imageSource.endsWith("/data")) {
    return imageSource.slice(0, -"/data".length);
  }

  const pieces = imageSource.split("/");
  pieces.pop();
  return pieces.join("/");
}

async function loadChannelLabels(groupRoot) {
  try {
    const channelArray = await zarr.open.v2(new zarr.FetchStore(`${groupRoot}/C`), { kind: "array" });
    const channelChunk = await zarr.get(channelArray);
    if (!channelChunk || !("data" in channelChunk)) {
      return [];
    }
    return Array.from(channelChunk.data, (value) => String(value));
  } catch {
    return [];
  }
}

function findPhaseChannelIndex(channelLabels) {
  const normalized = channelLabels.map((label) => label.trim().toLowerCase());

  for (const preferred of PHASE_CHANNEL_PREFERENCES) {
    const exactIndex = normalized.findIndex((label) => label === preferred);
    if (exactIndex !== -1) {
      return exactIndex;
    }
  }

  const fuzzyIndex = normalized.findIndex((label) => {
    return PHASE_CHANNEL_PREFERENCES.some((preferred) => label.includes(preferred));
  });

  return fuzzyIndex === -1 ? 0 : fuzzyIndex;
}

function assertRequiredAxes(axisInfo, requiredAxes, label) {
  const available = new Set(axisInfo.map((axis) => axis.name));
  for (const axisName of requiredAxes) {
    if (!available.has(axisName)) {
      throw new Error(`Missing ${label} axis "${axisName}".`);
    }
  }
}

function buildAxisInfo(shape, chunks, attrs) {
  const axisNames = resolveAxisNames(shape, attrs);

  return shape.map((length, index) => {
    const rawName = axisNames[index];
    const name = canonicalizeAxisName(rawName);
    const valueLabels = resolveAxisValues(attrs, rawName, name, length);

    return {
      index,
      rawName,
      name,
      displayName: name,
      length,
      chunk: chunks[index],
      isSpatial: name === "y" || name === "x",
      cacheWholeAxis: name !== "y" && name !== "x" && chunks[index] === length,
      valueLabels,
    };
  });
}

function resolveAxisNames(shape, attrs) {
  if (Array.isArray(attrs.axis_names) && attrs.axis_names.length === shape.length) {
    return attrs.axis_names;
  }

  if (Array.isArray(attrs._ARRAY_DIMENSIONS) && attrs._ARRAY_DIMENSIONS.length === shape.length) {
    return attrs._ARRAY_DIMENSIONS;
  }

  return shape.map((_, index) => `axis_${index}`);
}

function canonicalizeAxisName(name) {
  const normalized = String(name).trim().toLowerCase();

  if (normalized === "t") {
    return "time";
  }
  if (normalized === "c") {
    return "channel";
  }
  if (normalized === "trench") {
    return "trench";
  }
  if (normalized === "x") {
    return "x";
  }
  if (normalized === "y") {
    return "y";
  }
  if (normalized === "hypothesis") {
    return "hypothesis";
  }

  return normalized;
}

function resolveAxisValues(attrs, rawAxisName, canonicalAxisName, length) {
  const candidates = [
    `${rawAxisName}_values`,
    `${canonicalAxisName}_values`,
    `${canonicalAxisName}_epoch_values`,
    `${rawAxisName}_epoch_values`,
  ];

  for (const key of candidates) {
    if (Array.isArray(attrs[key]) && attrs[key].length === length) {
      return attrs[key];
    }
  }

  const fallbackEntry = Object.entries(attrs).find(([key, value]) => {
    return Array.isArray(value) && value.length === length && key.endsWith("_values") && key.startsWith(`${canonicalAxisName}_`);
  });

  return fallbackEntry ? fallbackEntry[1] : null;
}

function initialiseViewSelection(maskAxisInfo, params) {
  const selection = {};

  maskAxisInfo
    .filter((axis) => !axis.isSpatial)
    .forEach((axis) => {
      const rawValue = params.get(axis.name) ?? params.get(axis.rawName);

      if (rawValue !== null) {
        selection[axis.name] = clampInteger(rawValue, 0, axis.length - 1, 0);
        return;
      }

      if (axis.name === "hypothesis") {
        selection[axis.name] = axis.length - 1;
        return;
      }

      selection[axis.name] = 0;
    });

  return selection;
}

function renderMetadata() {
  const chips = [
    `mask ${state.maskAxisInfo.map((axis) => axis.length).join(" x ")}`,
    `image ${state.imageAxisInfo.map((axis) => axis.length).join(" x ")}`,
    `mask ${state.maskArray.dtype}`,
    `image ${state.imageArray.dtype}`,
    `channel ${state.phaseChannelLabel}`,
  ];

  elements.metadata.innerHTML = "";
  chips.forEach((text) => {
    const chip = document.createElement("span");
    chip.className = "chip";
    chip.textContent = text;
    elements.metadata.appendChild(chip);
  });
}

function renderControls() {
  elements.controls.innerHTML = "";

  state.maskAxisInfo
    .filter((axis) => !axis.isSpatial)
    .forEach((axis) => {
      const card = document.createElement("section");
      card.className = "control-card";

      const head = document.createElement("div");
      head.className = "control-head";

      const title = document.createElement("strong");
      title.textContent = axis.displayName;

      const readout = document.createElement("span");
      readout.id = `axis-readout-${axis.name}`;
      readout.textContent = formatAxisValue(axis, state.viewSelection[axis.name]);

      head.append(title, readout);

      const range = document.createElement("input");
      range.type = "range";
      range.min = "0";
      range.max = String(axis.length - 1);
      range.step = "1";
      range.value = String(state.viewSelection[axis.name]);

      const number = document.createElement("input");
      number.type = "number";
      number.min = "0";
      number.max = String(axis.length - 1);
      number.step = "1";
      number.value = String(state.viewSelection[axis.name]);

      range.addEventListener("input", (event) => {
        syncAxisInputs(axis, event.target.value, number, readout);
        requestRefresh();
      });

      number.addEventListener("change", (event) => {
        syncAxisInputs(axis, event.target.value, range, readout);
        requestRefresh();
      });

      card.append(head, range, number);
      elements.controls.appendChild(card);
    });
}

function syncAxisInputs(axis, rawValue, peerInput, readoutElement) {
  const nextValue = clampInteger(rawValue, 0, axis.length - 1, state.viewSelection[axis.name]);
  state.viewSelection[axis.name] = nextValue;
  peerInput.value = String(nextValue);
  readoutElement.textContent = formatAxisValue(axis, nextValue);
}

async function refreshView(forceChunkReload = false) {
  if (!state.maskArray || !state.imageArray) {
    return;
  }

  const refreshToken = ++state.refreshToken;
  const maskSelection = buildChunkSelection(state.maskAxisInfo, state.viewSelection);
  const imageSelection = buildChunkSelection(state.imageAxisInfo, state.viewSelection, {
    channel: state.phaseChannelIndex,
  });

  const maskKey = getChunkKey(maskSelection);
  const imageKey = getChunkKey(imageSelection);

  let maskChunk = state.maskCache.get(maskKey);
  let imageChunk = state.imageCache.get(imageKey);

  if (!maskChunk || !imageChunk || forceChunkReload) {
    setStatus("Fetching image and mask data...");

    const tasks = [];
    if (!maskChunk || forceChunkReload) {
      tasks.push(
        zarr.get(state.maskArray, maskSelection).then((chunk) => {
          maskChunk = chunk;
          updateCache(state.maskCache, maskKey, chunk);
        }),
      );
    }
    if (!imageChunk || forceChunkReload) {
      tasks.push(
        zarr.get(state.imageArray, imageSelection).then((chunk) => {
          imageChunk = chunk;
          updateCache(state.imageCache, imageKey, chunk);
        }),
      );
    }
    await Promise.all(tasks);
  } else {
    updateCache(state.maskCache, maskKey, maskChunk);
    updateCache(state.imageCache, imageKey, imageChunk);
    setStatus("Using cached data for this view.");
  }

  if (refreshToken !== state.refreshToken) {
    return;
  }

  state.currentMaskChunk = maskChunk;
  state.currentImageChunk = imageChunk;
  renderCurrentSlice(maskSelection, imageSelection);
  updateUrl();
}

function requestRefresh(forceChunkReload = false) {
  clearPendingRefresh();

  if (forceChunkReload) {
    void refreshView(true).catch((error) => {
      handleRefreshError(error, "Refresh failed");
    });
    return;
  }

  const maskSelection = buildChunkSelection(state.maskAxisInfo, state.viewSelection);
  const imageSelection = buildChunkSelection(state.imageAxisInfo, state.viewSelection, {
    channel: state.phaseChannelIndex,
  });

  const maskKey = getChunkKey(maskSelection);
  const imageKey = getChunkKey(imageSelection);

  if (state.maskCache.has(maskKey) && state.imageCache.has(imageKey)) {
    void refreshView().catch((error) => {
      handleRefreshError(error, "Refresh failed");
    });
    return;
  }

  state.pendingRefreshTimer = window.setTimeout(() => {
    state.pendingRefreshTimer = null;
    void refreshView().catch((error) => {
      handleRefreshError(error, "Refresh failed");
    });
  }, FETCH_DEBOUNCE_MS);
}

function buildChunkSelection(axisInfo, viewSelection, fixedValues = {}) {
  return axisInfo.map((axis) => {
    if (axis.isSpatial) {
      return null;
    }

    if (Object.hasOwn(fixedValues, axis.name)) {
      return axis.cacheWholeAxis ? null : fixedValues[axis.name];
    }

    return axis.cacheWholeAxis ? null : viewSelection[axis.name];
  });
}

function getChunkKey(selection) {
  return selection.map((item) => (item === null ? "*" : item)).join("|");
}

function updateCache(cache, key, chunk) {
  if (!chunk || typeof chunk !== "object" || !("data" in chunk)) {
    throw new Error("Unexpected Zarr response when reading the selected chunk.");
  }

  cache.delete(key);
  cache.set(key, chunk);

  while (cache.size > MAX_CACHED_CHUNKS) {
    const oldestKey = cache.keys().next().value;
    cache.delete(oldestKey);
  }
}

function renderCurrentSlice(maskSelection, imageSelection) {
  const imageChunk = state.currentImageChunk;
  const maskChunk = state.currentMaskChunk;
  const width = imageChunk.shape.at(-1);
  const height = imageChunk.shape.at(-2);

  if (!Number.isInteger(width) || !Number.isInteger(height)) {
    throw new Error("The selected image data does not end in a 2D slice.");
  }

  if (maskChunk.shape.at(-1) !== width || maskChunk.shape.at(-2) !== height) {
    throw new Error("Mask and image slices do not have matching spatial dimensions.");
  }

  elements.canvas.width = width;
  elements.canvas.height = height;
  applyZoom();

  const imageBaseOffset = getBaseOffset(
    state.imageAxisInfo,
    imageSelection,
    imageChunk.stride,
    state.viewSelection,
    { channel: state.phaseChannelIndex },
  );
  const maskBaseOffset = getBaseOffset(state.maskAxisInfo, maskSelection, maskChunk.stride, state.viewSelection);

  const imageYStride = imageChunk.stride.at(-2);
  const imageXStride = imageChunk.stride.at(-1);
  const maskYStride = maskChunk.stride.at(-2);
  const maskXStride = maskChunk.stride.at(-1);

  const imageValues = new Uint16Array(width * height);
  let minValue = Number.POSITIVE_INFINITY;
  let maxValue = Number.NEGATIVE_INFINITY;

  for (let y = 0; y < height; y += 1) {
    const rowBase = imageBaseOffset + y * imageYStride;
    for (let x = 0; x < width; x += 1) {
      const value = imageChunk.data[rowBase + x * imageXStride];
      imageValues[y * width + x] = value;
      if (value < minValue) {
        minValue = value;
      }
      if (value > maxValue) {
        maxValue = value;
      }
    }
  }

  const scale = maxValue > minValue ? 255 / (maxValue - minValue) : 0;
  const overlayAlpha = state.maskAlpha;
  const imageData = context.createImageData(width, height);
  const rgba = imageData.data;

  for (let y = 0; y < height; y += 1) {
    const imageRow = y * width;
    const maskRowBase = maskBaseOffset + y * maskYStride;

    for (let x = 0; x < width; x += 1) {
      const pixelIndex = imageRow + x;
      const targetIndex = pixelIndex * 4;
      const value = imageValues[pixelIndex];
      const normalizedGray = scale === 0 ? 0 : Math.round((value - minValue) * scale);

      const label = maskChunk.data[maskRowBase + x * maskXStride];
      if (label === 0 || overlayAlpha === 0) {
        rgba[targetIndex] = normalizedGray;
        rgba[targetIndex + 1] = normalizedGray;
        rgba[targetIndex + 2] = normalizedGray;
        rgba[targetIndex + 3] = 255;
        continue;
      }

      const paletteIndex = label * 4;
      rgba[targetIndex] = Math.round(normalizedGray * (1 - overlayAlpha) + PALETTE[paletteIndex] * overlayAlpha);
      rgba[targetIndex + 1] = Math.round(normalizedGray * (1 - overlayAlpha) + PALETTE[paletteIndex + 1] * overlayAlpha);
      rgba[targetIndex + 2] = Math.round(normalizedGray * (1 - overlayAlpha) + PALETTE[paletteIndex + 2] * overlayAlpha);
      rgba[targetIndex + 3] = 255;
    }
  }

  context.putImageData(imageData, 0, 0);
  state.currentSlice = {
    width,
    height,
    imageBaseOffset,
    maskBaseOffset,
    imageYStride,
    imageXStride,
    maskYStride,
    maskXStride,
    minValue,
    maxValue,
  };

  const summary = state.maskAxisInfo
    .filter((axis) => !axis.isSpatial)
    .map((axis) => `${axis.displayName}: ${formatAxisValue(axis, state.viewSelection[axis.name])}`)
    .join(" | ");
  elements.viewSummary.textContent = `${summary} | channel: ${state.phaseChannelLabel}`;
  setStatus("Viewer ready.");
}

function getBaseOffset(axisInfo, selection, stride, viewSelection, fixedValues = {}) {
  let baseOffset = 0;
  let chunkAxis = 0;

  axisInfo.forEach((axis) => {
    if (selection[axis.index] !== null) {
      return;
    }

    if (!axis.isSpatial) {
      const selectedIndex = Object.hasOwn(fixedValues, axis.name) ? fixedValues[axis.name] : viewSelection[axis.name];
      baseOffset += selectedIndex * stride[chunkAxis];
    }
    chunkAxis += 1;
  });

  return baseOffset;
}

function updateZoom(rawValue) {
  const nextZoom = clampInteger(rawValue, 1, 18, state.zoom);
  state.zoom = nextZoom;
  syncZoomInputs(nextZoom);
  applyZoom();
  updateUrl();
}

function updateMaskAlpha(rawValue) {
  const nextAlpha = clampNumber(rawValue, 0, 1, state.maskAlpha);
  state.maskAlpha = nextAlpha;
  syncMaskAlphaInputs(nextAlpha);

  if (state.currentMaskChunk && state.currentImageChunk) {
    const maskSelection = buildChunkSelection(state.maskAxisInfo, state.viewSelection);
    const imageSelection = buildChunkSelection(state.imageAxisInfo, state.viewSelection, {
      channel: state.phaseChannelIndex,
    });
    renderCurrentSlice(maskSelection, imageSelection);
  }

  updateUrl();
}

function syncZoomInputs(value) {
  elements.zoomRange.value = String(value);
  elements.zoomNumber.value = String(value);
}

function syncMaskAlphaInputs(value) {
  const rounded = value.toFixed(2).replace(/0+$/, "").replace(/\.$/, "");
  elements.maskAlphaRange.value = String(value);
  elements.maskAlphaNumber.value = rounded;
}

function applyZoom() {
  elements.canvas.style.width = `${elements.canvas.width * state.zoom}px`;
  elements.canvas.style.height = `${elements.canvas.height * state.zoom}px`;
}

function updateHoverReadout(event) {
  if (!state.currentMaskChunk || !state.currentImageChunk || !state.currentSlice) {
    return;
  }

  const rect = elements.canvas.getBoundingClientRect();
  const x = Math.floor(((event.clientX - rect.left) / rect.width) * state.currentSlice.width);
  const y = Math.floor(((event.clientY - rect.top) / rect.height) * state.currentSlice.height);

  if (x < 0 || y < 0 || x >= state.currentSlice.width || y >= state.currentSlice.height) {
    elements.hoverReadout.textContent = "";
    return;
  }

  const imageValue = state.currentImageChunk.data[
    state.currentSlice.imageBaseOffset + y * state.currentSlice.imageYStride + x * state.currentSlice.imageXStride
  ];
  const label = state.currentMaskChunk.data[
    state.currentSlice.maskBaseOffset + y * state.currentSlice.maskYStride + x * state.currentSlice.maskXStride
  ];
  elements.hoverReadout.textContent = `x=${x}, y=${y}, image=${imageValue}, label=${label}`;
}

function setBusy(isBusy) {
  elements.loadButton.disabled = isBusy;
}

function clearPendingRefresh() {
  if (state.pendingRefreshTimer !== null) {
    window.clearTimeout(state.pendingRefreshTimer);
    state.pendingRefreshTimer = null;
  }
}

function setStatus(message, isError = false) {
  elements.status.textContent = message;
  elements.status.classList.toggle("error", isError);
}

function handleRefreshError(error, prefix) {
  const message = error instanceof Error ? error.message : String(error);
  setStatus(`${prefix}: ${message}`, true);
  elements.viewSummary.textContent = "Viewer not ready.";
  context.clearRect(0, 0, elements.canvas.width, elements.canvas.height);
}

function formatAxisValue(axis, index) {
  if (axis.valueLabels) {
    return `${axis.valueLabels[index]} (index ${index})`;
  }

  return `${index} of ${axis.length - 1}`;
}

function normalizeSource(source) {
  return (source || "").trim().replace(/\/+$/, "");
}

function updateUrl() {
  const url = buildUrl();
  window.history.replaceState({}, "", url);
}

function buildUrl() {
  const url = new URL(window.location.href);
  url.searchParams.set("mask_source", state.maskSource);
  url.searchParams.set("image_source", state.imageSource);
  url.searchParams.set("zoom", String(state.zoom));
  url.searchParams.set("mask_alpha", String(state.maskAlpha));

  state.maskAxisInfo
    .filter((axis) => !axis.isSpatial)
    .forEach((axis) => {
      url.searchParams.set(axis.name, String(state.viewSelection[axis.name]));
    });

  return url.toString();
}

function clampInteger(value, min, max, fallback) {
  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed)) {
    return fallback;
  }

  return Math.min(max, Math.max(min, parsed));
}

function clampNumber(value, min, max, fallback) {
  const parsed = Number.parseFloat(value);
  if (!Number.isFinite(parsed)) {
    return fallback;
  }

  return Math.min(max, Math.max(min, parsed));
}

function buildPalette(size) {
  const palette = new Uint8ClampedArray(size * 4);
  palette[3] = 0;

  for (let label = 1; label < size; label += 1) {
    const hash = (label * 2654435761) >>> 0;
    const hue = hash % 360;
    const saturation = 62 + ((hash >>> 8) % 20);
    const lightness = 42 + ((hash >>> 16) % 16);
    const [r, g, b] = hslToRgb(hue / 360, saturation / 100, lightness / 100);
    const offset = label * 4;
    palette[offset] = r;
    palette[offset + 1] = g;
    palette[offset + 2] = b;
    palette[offset + 3] = 255;
  }

  return palette;
}

function hslToRgb(h, s, l) {
  if (s === 0) {
    const gray = Math.round(l * 255);
    return [gray, gray, gray];
  }

  const hueToRgb = (p, q, t) => {
    let value = t;
    if (value < 0) {
      value += 1;
    }
    if (value > 1) {
      value -= 1;
    }
    if (value < 1 / 6) {
      return p + (q - p) * 6 * value;
    }
    if (value < 1 / 2) {
      return q;
    }
    if (value < 2 / 3) {
      return p + (q - p) * (2 / 3 - value) * 6;
    }
    return p;
  };

  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;

  return [
    Math.round(hueToRgb(p, q, h + 1 / 3) * 255),
    Math.round(hueToRgb(p, q, h) * 255),
    Math.round(hueToRgb(p, q, h - 1 / 3) * 255),
  ];
}
