// The chapter's opening view: a zoom from the human genome to one base pair, in five stations. The karyotype (23
// pairs of condensed chromosomes, each two sister chromatids at its length and with its centromere in place); one
// pair of homologues with a locus marked on both, its two alleles; the DNA and protein at that locus (an open
// chromatin fibre: 1KX5's nucleosome on ideal B-DNA linkers, laid by ../shared/chromatin.mjs); its double helix; and
// one G–C base pair atom by atom (PDB 355D). Everything is drawn at its true size in one space (Å). The camera moves
// between stations on a logarithmic scale, and each level fades as the next takes over. The rail under the
// introduction names the stations and moves between them; a drag turns the view.
import * as THREE from 'three';
import {mergeVertices} from 'three/addons/utils/BufferGeometryUtils.js';
import {NIGHT, loadSurfaceSet, surfaceGeometry, proteinMaterial, baseMaterial, createRenderer, studio, fitDistance, restoreEnvironment, viewScale, fade} from '../shared/molecules.mjs';
import {createLabels} from '../shared/labels.mjs';
import {pairsFromStrands, frameFromPairs, meanLocal} from '../shared/dna.mjs';
import {createChain, assemble, createFibre, fillFrames, nucleosomePattern, zOf} from '../shared/chromatin.mjs';
import {createAtoms, createPlates} from '../shared/atoms.mjs';
import {STRANDS, BASES} from '../shared/strands.mjs';
import {clamp, quintic, smooth} from '../shared/ease.mjs';

const $ = id => document.getElementById(id), V = (...a) => new THREE.Vector3(...a);
const hex = c => '#' + c.toString(16).padStart(6, '0');
const rmq = matchMedia('(prefers-reduced-motion: reduce)');
let calm = rmq.matches;

// The stations, in the notes' words.
const STATIONS = [
  {name: 'Genome', text: 'A genome is all the hereditary information in an organism. A haploid human cell has 23 chromosomes, with 3.2 billion base pairs in all.'},
  {name: 'Homologues', text: 'A gene lies at a locus. Its two alleles, one inherited from each parent, lie at the same locus on a pair of homologous chromosomes.'},
  {name: 'DNA and protein', text: 'Each chromosome consists of a very long molecule of duplex DNA and an approximately equal mass of proteins.'},
  {name: 'Double helix', text: 'DNA is a double helix of two strands of nucleotides. A gene is a sequence of DNA that encodes a single type of RNA.'},
  {name: 'Base pair', text: 'Each nucleotide contains a sugar, a phosphate group and a base. Hydrogen bonds join complementary bases on the two strands.'},
];

// ---------- Chromosomes ----------
// Human chromosomes (GRCh38): length and centromere position (Mb), in a karyotype's rows. They are drawn condensed,
// as at cell division, at about 25 Mb per µm (MB Å a megabase); R is a chromatid's radius (Å).
const CHROMOSOMES = {
  1: [248.96, 123.4], 2: [242.19, 93.9], 3: [198.3, 90.9], 4: [190.21, 50], 5: [181.54, 48.8], 6: [170.81, 59.8], 7: [159.35, 60.1],
  8: [145.14, 45.2], 9: [138.39, 43], 10: [133.8, 39.8], 11: [135.09, 53.4], 12: [133.28, 35.5], 13: [114.36, 17.7], 14: [107.04, 17.2],
  15: [101.99, 19], 16: [90.34, 36.8], 17: [83.26, 25.1], 18: [80.37, 18.5], 19: [58.62, 26.2], 20: [64.44, 28.1], 21: [46.71, 12],
  22: [50.82, 15], X: [156.04, 60.6],
};
const ROWS = [[1, 2, 3, 4, 5], [6, 7, 8, 9, 10, 11, 12], [13, 14, 15, 16, 17, 18], [19, 20, 21, 22, 'X']];
const MB = 400, R = 3500;
// The zoom's way in: chromosome 11, the first homologue's left chromatid, at a locus 35 Mb from the p arm's end.
const TARGET = {name: 11, locus: 35}, FLOAT = 260;               // the fibre floats this far off the chromatid (Å)
const CHROMATIN = 0x9aa8cf, ALLELES = [0xf0c060, 0x62d0b4], HISTONES = 0xc9bfd8;

// A small seeded generator, so every visit draws the same chromosomes.
function random(seed) { return () => { seed = (seed + 0x6d2b79f5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t ^= t + Math.imul(t ^ (t >>> 7), 61 | t); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
const rand = random(20260928);
// A chromatid's radius at height y (its centromere at y = 0 and the p arm up, towards −y): rounded ends and the
// centromere's constriction.
function profile(y, p, q) {
  const u = Math.min(y + p * MB, q * MB - y), end = u < R ? Math.sqrt(Math.max(0, 1 - ((R - u) / R) ** 2)) : 1;
  return R * end * (1 - .36 * Math.exp(-((y / (.55 * R)) ** 2)));
}
// Sister chromatids touch at the centromere and part a little along their arms.
const offset = y => .64 * R + .09 * Math.min(Math.hypot(y, .6 * R) - .6 * R, 5 * R);
// A lumpy envelope rather than a smooth tube: long and short waves over it, the same for every chromatid.
const WAVES = [...Array.from({length: 4}, () => [1.5, .022]), ...Array.from({length: 6}, () => [5, .008])].map(([k, a]) => ({
  k: V(rand() - .5, rand() - .5, rand() - .5).normalize().multiplyScalar(k / R), phase: rand() * Math.PI * 2, a}));
const bump = p => WAVES.reduce((s, w) => s + w.a * Math.sin(w.k.dot(p) + w.phase), 0);

function chromatidGeometry(p, q, side) {
  const top = -p * MB, bottom = q * MB, ys = [];
  // Close sampling over the rounded ends and the centromere, coarser along the arms.
  for (let i = 0; i <= 8; i++) ys.push(top + R * (1 - Math.cos(i / 8 * Math.PI / 2)));
  for (let y = top + R + 900; y < bottom - R; y += 900) ys.push(y);
  for (let i = -4; i <= 4; i++) ys.push(i * .25 * R);
  for (let i = 8; i >= 0; i--) ys.push(bottom - R * (1 - Math.cos(i / 8 * Math.PI / 2)));
  const sorted = [...new Set(ys.map(y => Math.round(y)))].sort((a, b) => a - b).filter(y => y >= top && y <= bottom);
  let g = new THREE.LatheGeometry(sorted.map(y => new THREE.Vector2(Math.max(1, profile(y, p, q)), y)), 36);
  g.deleteAttribute('normal'); g.deleteAttribute('uv'); g = mergeVertices(g);
  const pos = g.attributes.position, v = V();
  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i);
    const k = 1 + bump(v);
    pos.setXYZ(i, v.x * k + side * offset(v.y), v.y, v.z * k);
  }
  g.computeVertexNormals();
  return g;
}

// ---------- The page ----------
async function start() {
  if (location.protocol === 'file:') return;
  const hero = $('hero'), view = $('viewport');
  let renderer;
  try { renderer = createRenderer({alpha: false, exposure: .9}); }
  catch { $('load-detail').textContent = 'This page needs WebGL 2, which this browser could not start.'; return; }
  view.append(renderer.domElement);
  const scene = new THREE.Scene(), camera = new THREE.PerspectiveCamera(30, 1, 1, 1e7);
  scene.background = new THREE.Color(NIGHT); scene.fog = new THREE.Fog(NIGHT, 1e6, 1e7);
  studio(scene, camera, renderer);

  let sets, failed = false;
  try {
    sets = await Promise.all([
      loadSurfaceSet('assets/hub.json', 'assets/hub.bin', p => { if (!failed) $('load-detail').textContent = `Loading structures · ${Math.floor(p * 10) * 10}%`; }),
      loadSurfaceSet('assets/helix.json', 'assets/helix.bin'),
    ]);
  } catch (e) { failed = true; $('load-detail').textContent = `The structures could not be loaded (${e.message}).`; return; }
  const [set, helix] = sets;

  // The karyotype: each row's centromeres on a line, homologues side by side, pairs apart.
  const karyotype = new THREE.Group(); scene.add(karyotype);
  const shared = proteinMaterial(CHROMATIN, {rim: .28});
  const own = {chromatid: proteinMaterial(CHROMATIN, {rim: .28})};
  const ringMaterial = c => baseMaterial(c, {emissive: c, emissiveIntensity: .45, roughness: .45});
  const rings = [ringMaterial(ALLELES[0]), ringMaterial(ALLELES[1])];
  own.ring = ringMaterial(ALLELES[0]);
  const at = {pairs: {}};
  let y = 0, prevQ = 0;
  ROWS.forEach((row, r) => {
    const maxP = Math.max(...row.map(n => CHROMOSOMES[n][1])), maxQ = Math.max(...row.map(n => CHROMOSOMES[n][0] - CHROMOSOMES[n][1]));
    if (r) y += (prevQ + maxP) * MB + 3.4 * R;
    prevQ = maxQ;
    const pitch = 12.6 * R, x0 = -(row.length - 1) * pitch / 2;
    row.forEach((name, i) => {
      const [len, cen] = CHROMOSOMES[name], p = cen, q = len - cen, xc = x0 + i * pitch;
      at.pairs[name] = V(xc, y, 0);
      [-2.8 * R, 2.8 * R].forEach((dx, h) => {
        const chromosome = new THREE.Group(); chromosome.position.set(xc + dx, y, 0); karyotype.add(chromosome);
        const target = name === TARGET.name && h === 0;
        for (const side of [-1, 1]) {
          const mine = target && side === -1;
          chromosome.add(new THREE.Mesh(chromatidGeometry(p, q, side), mine ? own.chromatid : shared));
          if (name !== TARGET.name) continue;
          // The locus, on both chromatids of both homologues: one allele's colour on each homologue.
          const yl = -(p - TARGET.locus) * MB, ring = new THREE.Mesh(new THREE.TorusGeometry(profile(yl, p, q) + 120, 320, 14, 90).rotateX(Math.PI / 2), mine ? own.ring : rings[h]);
          ring.position.set(side * offset(yl), yl, 0); chromosome.add(ring);
          if (side === -1) at[h ? 'ringB' : 'ringA'] = chromosome.position.clone().add(V(side * offset(yl), yl, -profile(yl, p, q) - 440));
        }
        if (target) {
          // The way in: the front of that chromatid's surface at the locus, a little behind the world's origin.
          const yl = -(p - TARGET.locus) * MB, r0 = profile(yl, p, q), front = V(0, yl, -r0);
          at.front = chromosome.position.clone().add(V(-offset(yl), yl, -r0 * (1 + bump(front))));
          at.axisRadius = r0 * (1 + bump(front));
        }
      });
    });
  });
  const shift = at.front.clone().negate().add(V(0, 0, FLOAT));
  karyotype.position.copy(shift);
  for (const k of ['ringA', 'ringB']) at[k].add(shift);
  for (const k of Object.keys(at.pairs)) at.pairs[k].add(shift);
  const box = new THREE.Box3().setFromObject(karyotype), karyCentre = box.getCenter(V());

  // ---------- The DNA and protein at the locus ----------
  // 1KX5's nucleosome (its 147 bp as base-pair frames, about the octamer's centre), set along an open fibre.
  const strand = n => set.meta.strands.find(s => s.name === n);
  const nucPairs = pairsFromStrands(strand('top'), strand('bottom')), histC = V(...set.byName.get('Histones').center);
  const nucLocal = fillFrames(nucPairs.map(p => p.a.num), frameFromPairs(nucPairs)).map(f => ({o: f.o.sub(histC), q: f.q})), NS = nucLocal.length;
  const nucEnds = {entry: nucLocal[0].o, exit: nucLocal[NS - 1].o,
    tIn: nucLocal[3].o.clone().sub(nucLocal[0].o).normalize(), tOut: nucLocal[NS - 1].o.clone().sub(nucLocal[NS - 4].o).normalize()};
  const REPEAT = 200, pattern = nucleosomePattern(nucEnds, {linker: REPEAT - NS});
  // The fibre's path: round the chromatid at the locus, FLOAT off its surface, then (past ±32°) turning into it.
  const rho = at.axisRadius + FLOAT, guidePts = [];
  for (let a = -58; a <= 58; a += .25) {
    const t = Math.abs(a), rr = rho - (rho - (at.axisRadius - 1800)) * smooth((t - 32) / 26), phi = a * Math.PI / 180;
    guidePts.push(V(rr * Math.sin(phi), 0, rho - rr * Math.cos(phi)));
  }
  const cum = [0]; for (let i = 1; i < guidePts.length; i++) cum.push(cum[i - 1] + guidePts[i].distanceTo(guidePts[i - 1]));
  const mid = cum[(guidePts.length - 1) / 2];
  const along = (s, out = V()) => {
    const x = Math.min(cum[cum.length - 1], Math.max(0, s + mid)); let lo = 0, hi = cum.length - 1;
    while (hi - lo > 1) { const m = (lo + hi) >> 1; if (cum[m] <= x) lo = m; else hi = m; }
    return out.lerpVectors(guidePts[lo], guidePts[hi], (x - cum[lo]) / ((cum[hi] - cum[lo]) || 1));
  };
  const sOf = bp => bp * pattern.rise / REPEAT, span = rho * 40 * Math.PI / 180;
  const pieces = [], octamerPoses = [], UPW = V(0, -1, 0);
  for (let k = -40; k <= 40; k++) {
    const c = REPEAT / 2 + k * REPEAT, s = sOf(c);
    if (Math.abs(s) > span - pattern.rise) continue;
    const p = along(s), xf = along(s + 12).sub(along(s - 12)).normalize();
    const Nk = new THREE.Matrix4().makeBasis(xf, UPW, xf.clone().cross(UPW)).setPosition(p).multiply(pattern.pose(k));
    const NkQ = new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().extractRotation(Nk));
    octamerPoses.push(Nk);
    pieces.push({from: c - (NS >> 1), count: NS, bound: true, frame: (i, o, q) => { o.copy(nucLocal[i].o).applyMatrix4(Nk); q.copy(NkQ).multiply(nucLocal[i].q); }});
  }
  const bpFrom = pieces[0].from - 30, bpTo = pieces[pieces.length - 1].from + NS + 30;
  const chain = createChain(bpTo - bpFrom + 8);
  assemble(chain, {from: bpFrom, to: bpTo, pieces, guide: (bp, out) => along(sOf(bp), out), far: bp => Math.abs(sOf(bp)) > 1700});
  const crystal = pairsFromStrands(helix.meta.strands.find(s => s.name === 'a'), helix.meta.strands.find(s => s.name === 'b'));
  const crystalFrames = frameFromPairs(crystal), local = meanLocal(crystal.slice(1, -1));
  const fibre = createFibre({local, maxNear: 16000, maxFar: 20000});
  // The gene: its first base pair a few before the one the zoom ends on.
  const GENE = -6;
  fibre.band(0, GENE, bpTo, ALLELES[0], .85);
  fibre.set(chain);
  const octamers = new THREE.InstancedMesh(surfaceGeometry(set.byName.get('Histones'), set.buffer).clone().translate(-histC.x, -histC.y, -histC.z), proteinMaterial(HISTONES, {rim: .25}), octamerPoses.length);
  octamerPoses.forEach((m, i) => octamers.setMatrixAt(i, m));
  octamers.frustumCulled = false;
  // Base pair 0 (the linker's middle) is the zoom's end: the fibre moves so that it sits at the origin.
  const k0 = Array.from({length: chain.n}, (_, k) => k).find(k => chain.bp[k] === 0);
  const molecule = new THREE.Group(); molecule.position.copy(chain.o[k0]).negate(); molecule.add(fibre.group, octamers); scene.add(molecule);
  molecule.updateMatrixWorld(true);
  const pairAt = bp => { const k = chain.bp.indexOf(bp); return {o: chain.o[k].clone().add(molecule.position), q: chain.q[k].clone()}; };
  const bp0 = pairAt(0), helixAxis = zOf(bp0.q).normalize();

  // One G–C pair of the crystal, atom by atom, laid on base pair 0.
  const data = helix.meta.atoms[0], R355 = data.residues, find = (c, n) => R355.findIndex(r => r.chain === c && r.num === n);
  const GC = [find('A', 4), find('B', 21)], gcFrame = crystalFrames[crystal.findIndex(p => p.a.num === 4)];
  const pairGroup = new THREE.Group(); pairGroup.matrixAutoUpdate = false; scene.add(pairGroup);
  pairGroup.matrix.compose(bp0.o, bp0.q.clone().multiply(gcFrame.q.clone().invert()), V(1, 1, 1))
    .multiply(new THREE.Matrix4().makeTranslation(-gcFrame.origin.x, -gcFrame.origin.y, -gcFrame.origin.z));
  pairGroup.updateMatrixWorld(true);
  const atoms = createAtoms(pairGroup, data, {filter: i => GC.includes(data.atoms.residue[i]), carbon: i => R355[data.atoms.residue[i]].chain === 'A' ? STRANDS.coding : STRANDS.template});
  atoms.showHbonds(1); atoms.update();
  const plates = createPlates(pairGroup, atoms, {color: ring => BASES[ring.letter], opacity: .5});
  const partCentre = (res, part) => pairGroup.localToWorld(atoms.centre(atoms.select(k => atoms.residueOf[k] === res && atoms.part(k) === part)));

  // ---------- Stations: where the camera looks from, and how far ----------
  const near2 = octamerPoses.map(m => V().setFromMatrixPosition(m).add(molecule.position)).sort((a, b) => a.length() - b.length()).slice(0, 2);
  const away = near2[0].clone().add(near2[1]).multiplyScalar(-.5); away.addScaledVector(helixAxis, -away.dot(helixAxis)).normalize();
  const side = away.clone().add(V(0, -.25, 0)).addScaledVector(helixAxis, .22).normalize();
  // The base pair seen nearly face on: turned from the side view towards the helix's axis.
  const faceOn = side.clone().addScaledVector(helixAxis, 1.25).normalize();
  const FRAMES = [
    {target: karyCentre, radius: .54 * Math.max(box.max.x - box.min.x, box.max.y - box.min.y), dir: V(0, -.05, -1)},
    {target: at.pairs[TARGET.name].clone().setY(at.pairs[TARGET.name].y + 5600), radius: 34000, dir: V(.18, -.1, -1)},
    {target: V(0, 0, -30), radius: 380, dir: V(.18, -.32, -1)},
    {target: V(), radius: 48, dir: side},
    // The base pair a little right of the middle, so its strand-1 phosphate clears the introduction.
    {target: pairGroup.localToWorld(atoms.positions[atoms.find('P', GC[0])].clone()).multiplyScalar(.3), radius: 13.5, dir: faceOn},
  ].map(f => ({...f, dir: f.dir.clone().normalize()}));
  let fill = .88;
  const distance = k => fitDistance(camera, FRAMES[k].radius, fill);

  // Where the camera is at zoom z (0 … 4): distance on a log scale; the target moving with it, so the point being
  // zoomed into stays in view; the direction turning evenly with the zoom.
  const pose = z => {
    const k = Math.min(3, Math.floor(z)), g = z - k, D0 = distance(k), D1 = distance(k + 1), D = Math.exp(Math.log(D0) + (Math.log(D1) - Math.log(D0)) * g);
    const target = FRAMES[k + 1].target.clone().lerp(FRAMES[k].target, (D - D1) / (D0 - D1));
    const dir = FRAMES[k].dir.clone().lerp(FRAMES[k + 1].dir, g).normalize();
    return {D, target, dir};
  };

  // ---------- Camera, controls and labels ----------
  const labels = createLabels($('annotations'), $('leaders'), $('hub-now'));
  let W = 0, H = 0;
  const resize = () => {
    W = hero.clientWidth; H = hero.clientHeight;
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2)); renderer.setSize(W, H, false);
    camera.aspect = W / H;
    // The view sits right of the introduction on wide screens, above it on narrow ones.
    const narrow = W <= 780, ax = narrow ? .5 : .64, ay = narrow ? .3 : .44;
    camera.setViewOffset(W, H, -(ax - .5) * W, -(ay - .5) * H, W, H);
    fill = narrow ? .7 : .86;
    camera.updateProjectionMatrix();
    const base = hero.getBoundingClientRect(), rects = [];
    for (const el of [document.querySelector('.top'), $('hero-text'), document.querySelector('.hero-hint')]) {
      const r = el?.getBoundingClientRect(); if (r?.width) rects.push({x: r.left - base.left, y: r.top - base.top, w: r.width, h: r.height});
    }
    labels.resetSizes?.(); labels.layout(rects);
  };
  addEventListener('resize', () => { resize(); wake(); });
  renderer.domElement.addEventListener('webglcontextlost', e => e.preventDefault());
  renderer.domElement.addEventListener('webglcontextrestored', () => { restoreEnvironment(renderer, [scene]); wake(); });

  // A drag turns the view about the point looked at; it eases back to the station's view when let go.
  const turn = {yaw: 0, pitch: 0, dragging: false, x: 0, y: 0};
  renderer.domElement.style.touchAction = 'pan-y';
  renderer.domElement.addEventListener('pointerdown', e => { turn.dragging = true; turn.x = e.clientX; turn.y = e.clientY; renderer.domElement.setPointerCapture(e.pointerId); stopTour(); wake(); });
  renderer.domElement.addEventListener('pointermove', e => {
    if (!turn.dragging) return;
    turn.yaw = Math.max(-1.2, Math.min(1.2, turn.yaw - (e.clientX - turn.x) * .005)); turn.pitch = Math.max(-.7, Math.min(.7, turn.pitch + (e.clientY - turn.y) * .004));
    turn.x = e.clientX; turn.y = e.clientY; wake();
  });
  const release = () => { turn.dragging = false; wake(); };
  renderer.domElement.addEventListener('pointerup', release); renderer.domElement.addEventListener('pointercancel', release);

  // ---------- The rail ----------
  const rail = $('stations'), text = $('station-text'), tourButton = $('tour');
  const buttons = STATIONS.map((s, i) => {
    const b = document.createElement('button'); b.type = 'button'; b.className = 'station';
    b.innerHTML = `<span class="n">${String(i + 1).padStart(2, '0')}</span><span class="name">${s.name}</span>`;
    b.addEventListener('click', () => { stopTour(); go(i); });
    rail.append(b); return b;
  });
  let zoom = 0, glide = null, station = 0, tour = null, clock = 0;
  const HOLD = 7;  // s at each station on the tour, long enough to read it
  function go(i) {
    station = i;
    const d = Math.abs(i - zoom);
    glide = calm || d < 1e-3 ? null : {from: zoom, to: i, t0: clock, dur: 1.4 + 1.25 * d};
    if (!glide) zoom = i;
    show(); wake();
  }
  function show() {
    buttons.forEach((b, i) => b.setAttribute('aria-current', i === station ? 'step' : 'false'));
    text.textContent = STATIONS[station].text;
  }
  function setTour(on) {
    tour = on ? {next: clock + (station === 0 ? 2.2 : HOLD)} : null;
    tourButton.setAttribute('aria-pressed', on ? 'true' : 'false');
    tourButton.setAttribute('aria-label', on ? 'Pause the zoom' : station === STATIONS.length - 1 ? 'Replay the zoom' : 'Play the zoom');
    tourButton.dataset.state = on ? 'playing' : station === STATIONS.length - 1 ? 'ended' : 'paused';
  }
  function stopTour() { if (tour) setTour(false); }
  tourButton.addEventListener('click', () => {
    if (tour) { setTour(false); return; }
    if (station === STATIONS.length - 1) go(0);
    setTour(true); wake();
  });
  show();

  // ---------- Frames ----------
  let visible = true, raf = 0, last = 0;
  new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; if (visible) wake(); }).observe(hero);
  rmq.addEventListener('change', e => { calm = e.matches; if (calm) { stopTour(); if (glide) { zoom = glide.to; glide = null; } } wake(); });
  function wake() { if (!raf && visible) raf = requestAnimationFrame(frame); }
  const tmp = V();
  function frame(now) {
    raf = 0;
    const dt = last ? Math.min(.05, (now - last) / 1000) : 0; last = now; clock += dt;
    if (glide) { const u = (clock - glide.t0) / glide.dur; zoom = glide.from + (glide.to - glide.from) * quintic(u); if (u >= 1) { zoom = glide.to; glide = null; if (tour) tour.next = clock + HOLD; } }
    if (tour && !glide && clock >= tour.next) { if (station < STATIONS.length - 1) go(station + 1); else setTour(false); }
    if (!turn.dragging) { const k = Math.exp(-dt * 2.2); turn.yaw *= k; turn.pitch *= k; }

    // The camera: the station pose, turned by the drag (and, unless calm, a slow drift).
    const {D, target, dir} = pose(zoom);
    const drift = calm ? 0 : .05 * Math.sin(clock * .21);
    const up = V(0, -1, 0), d = dir.clone().applyAxisAngle(up, turn.yaw + drift);
    const across = V().crossVectors(up, d).normalize(); d.applyAxisAngle(across, turn.pitch).normalize();
    camera.position.copy(target).addScaledVector(d, D); camera.lookAt(target);
    camera.near = D / 60; camera.far = D * 80; camera.updateProjectionMatrix();
    scene.fog.near = D; scene.fog.far = D * 4.5;

    // Each level as the camera reaches it: the chromatid zoomed into dissolves as the fibre appears; the fibre's
    // DNA gives way to the atoms of one base pair.
    const chromatid = clamp((D - 9000) / 21000), fibreIn = clamp((70000 - D) / 40000), toAtoms = clamp((200 - D) / 110), toHelix = clamp((1500 - D) / 1200);
    fade(own.chromatid, chromatid); fade(own.ring, chromatid);
    karyotype.children.forEach(c => c.children.forEach(m => { if (m.material === own.chromatid || m.material === own.ring) m.visible = chromatid > .01; }));
    fibre.group.visible = octamers.visible = fibreIn > .01;
    for (const m of [fibre.tubes.material, fibre.outline.material, fibre.line.material]) fade(m, fibreIn * (1 - .9 * toAtoms));
    fade(octamers.material, fibreIn * (1 - .6 * toHelix) * (1 - toAtoms)); octamers.visible = fibreIn * (1 - toAtoms) > .01;
    fibre.view(viewScale(camera, target, H)); fade(fibre.rungs.material, fibre.rungs.material.opacity * fibreIn * (1 - .9 * toAtoms));
    atoms.opacity(toAtoms); plates.opacity(.5 * toAtoms); pairGroup.visible = toAtoms > .01;
    renderer.render(scene, camera);

    // Labels once the zoom has settled at a station.
    labels.begin();
    const here = Math.abs(zoom - station) < .03 ? station : -1;
    if (here === 0) labels.label(at.pairs[TARGET.name], 'Chromosome 11', 'Two homologous chromosomes', {color: '#cfd8ee'});
    if (here === 1) {
      labels.label(at.ringA, 'One allele', 'From one parent', {color: hex(ALLELES[0])});
      labels.label(at.ringB, 'The other allele', 'At the same locus', {color: hex(ALLELES[1])});
    }
    if (here === 2) {
      labels.tag(octamers.localToWorld(tmp.setFromMatrixPosition(octamerPoses[(octamerPoses.length >> 1) + 1])), 'Protein', {color: hex(HISTONES)});
      labels.tag(pairAt(2 * REPEAT).o, 'DNA', {color: hex(STRANDS.template)});
    }
    if (here === 3) {
      const b = pairAt(9); labels.label(local.bBackbone.clone().applyQuaternion(b.q).add(b.o), 'Double helix', 'Two strands of nucleotides', {color: hex(STRANDS.template)});
      labels.tag(pairAt(GENE).o, 'Start of gene', {color: hex(ALLELES[0])});
    }
    if (here === 4) {
      labels.label(atoms.hbonds.length ? pairGroup.localToWorld(atoms.centre(atoms.hbonds.flat())) : V(), 'G–C base pair', 'Three hydrogen bonds', {color: hex(BASES.G)});
      labels.tag(partCentre(GC[0], 'base'), 'Base', {color: hex(STRANDS.coding)});
      labels.tag(partCentre(GC[0], 'sugar'), 'Sugar', {color: hex(STRANDS.coding)});
      labels.tag(partCentre(GC[0], 'phosphate'), 'Phosphate', {color: hex(STRANDS.coding)});
    }
    const settling = labels.end(camera, W, H, dt, 1, true);
    if (glide || tour || turn.dragging || Math.abs(turn.yaw) + Math.abs(turn.pitch) > 1e-4 || !calm || settling) wake(); else last = 0;
  }
  resize();
  wake();
  const ready = () => { const l = $('loader'); if (l.classList.contains('hidden')) return; l.classList.add('hidden'); setTimeout(() => { l.hidden = true; }, 800); };
  requestAnimationFrame(ready); setTimeout(ready, 600);
  if (!calm) setTour(true); else setTour(false);
  if (new URLSearchParams(location.search).get('debug') === '1') window.hub = {
    labels: () => labels.snapshot(), shown: () => labels.shown(), state: () => ({zoom, station, touring: !!tour, gliding: !!glide}),
    go: i => { stopTour(); go(i); }, jump: i => { stopTour(); station = i; zoom = i; glide = null; show(); wake(); }, zoomTo: z => { stopTour(); zoom = z; glide = null; wake(); },
    chain: () => ({pairs: chain.n, nucleosomes: octamerPoses.length, rise: pattern.rise}), frames: () => FRAMES.map((f, k) => ({radius: f.radius, distance: distance(k)})),
  };
}
start();
