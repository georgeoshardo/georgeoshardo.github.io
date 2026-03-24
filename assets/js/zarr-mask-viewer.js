import * as zarr from "https://cdn.jsdelivr.net/npm/zarrita@0.6.1/+esm";

const DEFAULT_SOURCE =
  "https://huggingface.co/datasets/ghardo/scientific_data_2026/resolve/main/20260307_SB7_exit_snake_V4_1.segmentation_masks_multi_epoch_uint8_masks_only.zarr/data";

const MAX_CACHED_CHUNKS = 8;
const FETCH_DEBOUNCE_MS = 100;
const PALETTE = buildPalette(256);

const elements = {
  sourceInput: document.getElementById("source-input"),
  loadButton: document.getElementById("load-button"),
  copyLinkButton: document.getElementById("copy-link-button"),
  status: document.getElementById("status"),
  metadata: document.getElementById("metadata"),
  controls: document.getElementById("controls"),
  zoomRange: document.getElementById("zoom-range"),
  zoomNumber: document.getElementById("zoom-number"),
  canvas: document.getElementById("mask-canvas"),
  viewSummary: document.getElementById("view-summary"),
  hoverReadout: document.getElementById("hover-readout"),
};

const context = elements.canvas.getContext("2d", { alpha: true });

const state = {
  array: null,
  source: DEFAULT_SOURCE,
  axisInfo: [],
  selection: [],
  zoom: 4,
  cache: new Map(),
  currentChunkKey: null,
  currentChunk: null,
  currentSlice: null,
  refreshToken: 0,
  pendingRefreshTimer: null,
};

initialise();

function initialise() {
  const params = new URLSearchParams(window.location.search);
  state.source = normalizeSource(params.get("source") || DEFAULT_SOURCE);
  state.zoom = clampInteger(params.get("zoom"), 1, 18, 4);

  elements.sourceInput.value = state.source;
  syncZoomInputs(state.zoom);
  applyZoom();

  elements.loadButton.addEventListener("click", () => {
    loadDataset(elements.sourceInput.value);
  });

  elements.sourceInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      loadDataset(elements.sourceInput.value);
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

  elements.canvas.addEventListener("mousemove", updateHoverReadout);
  elements.canvas.addEventListener("mouseleave", () => {
    elements.hoverReadout.textContent = "Hover over the mask to inspect a pixel label.";
  });

  loadDataset(state.source);
}

async function loadDataset(sourceInput) {
  const source = normalizeSource(sourceInput);
  elements.sourceInput.value = source;
  elements.controls.innerHTML = "";
  elements.metadata.innerHTML = "";
  elements.viewSummary.textContent = "Loading array metadata...";
  state.cache.clear();
  state.currentChunk = null;
  state.currentChunkKey = null;
  state.currentSlice = null;
  clearPendingRefresh();
  setBusy(true);
  setStatus("Opening remote Zarr array...");

  try {
    const store = new zarr.FetchStore(source);
    const array = await zarr.open.v3(store, { kind: "array" });
    const shape = array.shape.slice();
    const chunks = array.chunks.slice();

    if (shape.length < 2) {
      throw new Error(`Expected at least 2 dimensions, got ${shape.length}.`);
    }

    state.array = array;
    state.source = source;
    state.axisInfo = buildAxisInfo(shape, chunks, array.attrs || {});
    state.selection = initialiseSelection(state.axisInfo, new URLSearchParams(window.location.search));
    renderMetadata();
    renderControls();
    await refreshView(true);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    setStatus(`Failed to load array: ${message}`, true);
    elements.viewSummary.textContent = "Viewer not ready.";
    context.clearRect(0, 0, elements.canvas.width, elements.canvas.height);
  } finally {
    setBusy(false);
  }
}

function buildAxisInfo(shape, chunks, attrs) {
  const axisNames = Array.isArray(attrs.axis_names) && attrs.axis_names.length === shape.length
    ? attrs.axis_names
    : shape.map((_, index) => `axis_${index}`);

  return shape.map((length, index) => {
    const name = axisNames[index];
    const valueLabels = resolveAxisValues(attrs, name, length);

    return {
      index,
      name,
      length,
      chunk: chunks[index],
      isSpatial: index >= shape.length - 2,
      cacheWholeAxis: index < shape.length - 2 && chunks[index] === length,
      valueLabels,
    };
  });
}

function resolveAxisValues(attrs, axisName, length) {
  const preferredKeys = [`${axisName}_values`, `${axisName}_epoch_values`];
  for (const key of preferredKeys) {
    if (Array.isArray(attrs[key]) && attrs[key].length === length) {
      return attrs[key];
    }
  }

  const fallbackEntry = Object.entries(attrs).find(([key, value]) => {
    return key.startsWith(`${axisName}_`) && key.endsWith("_values") && Array.isArray(value) && value.length === length;
  });

  return fallbackEntry ? fallbackEntry[1] : null;
}

function initialiseSelection(axisInfo, params) {
  return axisInfo.map((axis) => {
    if (axis.isSpatial) {
      return 0;
    }

    const rawValue = params.get(axis.name) ?? params.get(`axis${axis.index}`);
    if (rawValue !== null) {
      return clampInteger(rawValue, 0, axis.length - 1, 0);
    }

    if (axis.name === "hypothesis") {
      return axis.length - 1;
    }

    return 0;
  });
}

function renderMetadata() {
  const shapeText = state.axisInfo.map((axis) => axis.length).join(" x ");
  const chunkText = state.axisInfo.map((axis) => axis.chunk).join(" x ");
  const axesText = state.axisInfo.map((axis) => axis.name).join(", ");

  const chips = [
    `shape ${shapeText}`,
    `chunks ${chunkText}`,
    `axes ${axesText}`,
    `dtype ${state.array.dtype}`,
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

  state.axisInfo
    .filter((axis) => !axis.isSpatial)
    .forEach((axis) => {
      const card = document.createElement("section");
      card.className = "control-card";

      const head = document.createElement("div");
      head.className = "control-head";

      const title = document.createElement("strong");
      title.textContent = axis.name;

      const readout = document.createElement("span");
      readout.id = `axis-readout-${axis.index}`;
      readout.textContent = formatAxisValue(axis, state.selection[axis.index]);

      head.append(title, readout);

      const range = document.createElement("input");
      range.type = "range";
      range.min = "0";
      range.max = String(axis.length - 1);
      range.step = "1";
      range.value = String(state.selection[axis.index]);

      const number = document.createElement("input");
      number.type = "number";
      number.min = "0";
      number.max = String(axis.length - 1);
      number.step = "1";
      number.value = String(state.selection[axis.index]);

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
  const nextValue = clampInteger(rawValue, 0, axis.length - 1, state.selection[axis.index]);
  state.selection[axis.index] = nextValue;
  peerInput.value = String(nextValue);
  readoutElement.textContent = formatAxisValue(axis, nextValue);
}

async function refreshView(forceChunkReload = false) {
  if (!state.array) {
    return;
  }

  const refreshToken = ++state.refreshToken;
  const selection = buildChunkSelection();
  const chunkKey = getChunkKey(selection);
  let chunk = state.cache.get(chunkKey);

  if (!chunk || forceChunkReload) {
    setStatus("Fetching mask data...");
    chunk = await zarr.get(state.array, selection);
    if (!chunk || typeof chunk !== "object" || !("data" in chunk)) {
      throw new Error("Unexpected Zarr response when reading the selected chunk.");
    }

    state.cache.delete(chunkKey);
    state.cache.set(chunkKey, chunk);

    while (state.cache.size > MAX_CACHED_CHUNKS) {
      const oldestKey = state.cache.keys().next().value;
      state.cache.delete(oldestKey);
    }
  } else {
    state.cache.delete(chunkKey);
    state.cache.set(chunkKey, chunk);
    setStatus("Using cached data for this view.");
  }

  if (refreshToken !== state.refreshToken) {
    return;
  }

  state.currentChunkKey = chunkKey;
  state.currentChunk = chunk;
  renderCurrentSlice(selection);
  updateUrl();
}

function requestRefresh(forceChunkReload = false) {
  clearPendingRefresh();

  if (forceChunkReload) {
    refreshView(true);
    return;
  }

  const selection = buildChunkSelection();
  const chunkKey = getChunkKey(selection);

  if (state.cache.has(chunkKey)) {
    refreshView();
    return;
  }

  state.pendingRefreshTimer = window.setTimeout(() => {
    state.pendingRefreshTimer = null;
    refreshView();
  }, FETCH_DEBOUNCE_MS);
}

function buildChunkSelection() {
  return state.axisInfo.map((axis) => {
    if (axis.isSpatial) {
      return null;
    }

    return axis.cacheWholeAxis ? null : state.selection[axis.index];
  });
}

function getChunkKey(selection) {
  return selection.map((item) => (item === null ? "*" : item)).join("|");
}

function renderCurrentSlice(selection) {
  const chunk = state.currentChunk;
  const width = chunk.shape.at(-1);
  const height = chunk.shape.at(-2);

  if (!Number.isInteger(width) || !Number.isInteger(height)) {
    throw new Error("The selected data does not end in a 2D image.");
  }

  elements.canvas.width = width;
  elements.canvas.height = height;
  applyZoom();

  const baseOffset = getBaseOffset(selection, chunk.stride);
  const yStride = chunk.stride.at(-2);
  const xStride = chunk.stride.at(-1);
  const image = context.createImageData(width, height);
  const rgba = image.data;

  for (let y = 0; y < height; y += 1) {
    const rowBase = baseOffset + y * yStride;
    for (let x = 0; x < width; x += 1) {
      const label = chunk.data[rowBase + x * xStride];
      const sourceIndex = label * 4;
      const targetIndex = (y * width + x) * 4;
      rgba[targetIndex] = PALETTE[sourceIndex];
      rgba[targetIndex + 1] = PALETTE[sourceIndex + 1];
      rgba[targetIndex + 2] = PALETTE[sourceIndex + 2];
      rgba[targetIndex + 3] = PALETTE[sourceIndex + 3];
    }
  }

  context.putImageData(image, 0, 0);
  state.currentSlice = { selection, width, height, baseOffset };

  const summary = state.axisInfo
    .filter((axis) => !axis.isSpatial)
    .map((axis) => `${axis.name}: ${formatAxisValue(axis, state.selection[axis.index])}`)
    .join(" | ");
  elements.viewSummary.textContent = summary;
  setStatus("Viewer ready.");
}

function getBaseOffset(selection, stride) {
  let baseOffset = 0;
  let chunkAxis = 0;

  state.axisInfo.forEach((axis) => {
    if (selection[axis.index] === null) {
      if (!axis.isSpatial) {
        baseOffset += state.selection[axis.index] * stride[chunkAxis];
      }
      chunkAxis += 1;
    }
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

function syncZoomInputs(value) {
  elements.zoomRange.value = String(value);
  elements.zoomNumber.value = String(value);
}

function applyZoom() {
  elements.canvas.style.width = `${elements.canvas.width * state.zoom}px`;
  elements.canvas.style.height = `${elements.canvas.height * state.zoom}px`;
}

function updateHoverReadout(event) {
  if (!state.currentChunk || !state.currentSlice) {
    return;
  }

  const rect = elements.canvas.getBoundingClientRect();
  const x = Math.floor(((event.clientX - rect.left) / rect.width) * state.currentSlice.width);
  const y = Math.floor(((event.clientY - rect.top) / rect.height) * state.currentSlice.height);

  if (x < 0 || y < 0 || x >= state.currentSlice.width || y >= state.currentSlice.height) {
    elements.hoverReadout.textContent = "Hover over the mask to inspect a pixel label.";
    return;
  }

  const stride = state.currentChunk.stride;
  const yStride = stride.at(-2);
  const xStride = stride.at(-1);
  const label = state.currentChunk.data[state.currentSlice.baseOffset + y * yStride + x * xStride];
  elements.hoverReadout.textContent = `x=${x}, y=${y}, label=${label}`;
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

function formatAxisValue(axis, index) {
  if (axis.valueLabels) {
    return `${axis.valueLabels[index]} (index ${index})`;
  }

  return `${index} of ${axis.length - 1}`;
}

function normalizeSource(source) {
  return (source || DEFAULT_SOURCE).trim().replace(/\/+$/, "");
}

function updateUrl() {
  const url = buildUrl();
  window.history.replaceState({}, "", url);
}

function buildUrl() {
  const url = new URL(window.location.href);
  url.searchParams.set("source", state.source);
  url.searchParams.set("zoom", String(state.zoom));

  state.axisInfo
    .filter((axis) => !axis.isSpatial)
    .forEach((axis) => {
      url.searchParams.set(axis.name, String(state.selection[axis.index]));
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
    palette[offset + 3] = 238;
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
