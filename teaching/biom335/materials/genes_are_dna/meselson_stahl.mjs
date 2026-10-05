// Scene: the Meselson–Stahl experiment, laid out as the notes' figure. Each generation's DNA stands in its column
// (parental, generation 1, generation 2; ideal B-DNA, heavy strands blue and light strands pale gold), each duplex's
// two strands passing to two daughters. Under each column is the density gradient its DNA was spun in, with the light,
// hybrid and heavy levels marked and the bands that formed. Two last steps redraw the tree and its bands as
// conservative, then dispersive, replication would have given them, with the bands seen outlined in the same tubes.
// Shots fit the free part of the screen, so the whole experiment shows in any window.
import * as THREE from 'three';
import {runScene} from '../shared/scene_player.mjs';
import {loadSurfaceSet, baseMaterial, fade} from '../shared/molecules.mjs';
import {pairsFromStrands, frameFromPairs, meanLocal, sequencePairs, helixFrames, createDuplex} from '../shared/dna.mjs';
import {ramp, smooth} from '../shared/ease.mjs';

const V = (...a) => new THREE.Vector3(...a);
const hex = c => '#' + c.toString(16).padStart(6, '0');
const T = {gen1: 12, gen2: 25, semi: 38, cons: 48, disp: 58, end: 72};
const HEAVY = 0x4f7fe0, LIGHT = 0xf1dcaa;
const mixed = (w, a = HEAVY, b = LIGHT) => new THREE.Color(a).lerp(new THREE.Color(b), w).getHex();
const BAND = {light: LIGHT, between: mixed(.75), hybrid: mixed(.5), heavy: HEAVY};
const N = 12, SEQ = 'GATCCGTAGCTT', LEN = (N - 1) * 3.38;
// The tree: each generation's column (x), its duplexes' rows (y; −y is up) and each duplex's parent row.
const COL = [-100, 0, 100], ROWS = [[0], [-29, 29], [-50, -17, 17, 50]], PARENT = [[], [0, 0], [0, 0, 1, 1]];
// Under each column its density gradient: the tube's centre and size, and where each kind of DNA bands in it (from the
// centre): light DNA highest, heavy lowest; DNA a quarter heavy between light and hybrid.
const TUBE = {y: 102, height: 66, radius: 9};
const LEVEL = {light: -17, between: -8.5, hybrid: 0, heavy: 17};

// Each model's DNA, generation by generation and row by row: a duplex's two strands as a heavy (1) or light (0) mark
// for every base pair; and the bands its generations give.
const H = Array(N).fill(1), L = Array(N).fill(0);
const runs = (spans, n = N) => Array.from({length: n}, (_, i) => spans.some(([a, b]) => i >= a && i < b) ? 1 : 0);
const flip = s => s.map(x => 1 - x);
const half = runs([[0, 3], [6, 9]]), quarterA = runs([[0, 2], [6, 7]]), quarterB = runs([[3, 4], [9, 11]]);
const MODELS = {
  semi: {name: 'Semiconservative', dna: [[[H, H]], [[H, L], [L, H]], [[H, L], [L, L], [L, L], [L, H]]],
    bands: [{heavy: 1}, {hybrid: 1}, {hybrid: .5, light: .5}]},
  cons: {name: 'Conservative', dna: [[[H, H]], [[H, H], [L, L]], [[H, H], [L, L], [L, L], [L, L]]],
    bands: [{heavy: 1}, {heavy: .5, light: .5}, {heavy: .25, light: .75}]},
  disp: {name: 'Dispersive', dna: [[[H, H]], [[half, flip(half)], [flip(half), half]], [[quarterA, quarterB], [quarterB, quarterA], [quarterA, quarterB], [quarterB, quarterA]]],
    bands: [{heavy: 1}, {hybrid: 1}, {between: 1}]},
};
const SEEN = MODELS.semi.bands, MODEL_TAG = V(COL[0] - 26, 46, 0);  // the model drawn, named below the parental DNA

const NOTES = 'evidence-for-semiconservative-replication';
const steps = [
  {t: 0, nav: 'Heavy DNA', title: 'Start with<br>heavy DNA.', notes: NOTES, hold: 1.1,
    text: 'In 1958, Meselson and Stahl grew E. coli in a medium containing a heavy isotope of nitrogen, so that all of its DNA was heavy. Gradient centrifugation then separates DNA by weight: heavier DNA bands lower in the tube.'},
  {t: T.gen1, nav: 'One generation', title: 'One generation:<br>all hybrid.', notes: NOTES, hold: 1.1,
    text: 'They then switched the growth medium to one with light nitrogen. After one generation, all of the DNA was of medium weight, or hybrid, with one heavy strand and one light strand.'},
  {t: T.gen2, nav: 'Two generations', title: 'Two generations:<br>hybrid and light.', notes: NOTES, hold: 1.1,
    text: 'After two generations, there was a fraction of light DNA and a fraction of hybrid DNA, with no intermediate weights: the nucleotides in the two strands of DNA did not mix.'},
  {t: T.semi, nav: 'Semiconservative', title: 'Replication is<br>semiconservative.', notes: 'dna-replication-is-semiconservative', hold: 1.1,
    text: 'Each daughter duplex consists of one parental strand and one newly synthesised strand. A single strand of DNA, once created, continues to exist in the daughter duplexes: none of the DNA from one strand ever becomes part of the other.'},
  {t: T.cons, nav: 'Not conservative', title: 'Not conservative:<br>one band, not two.', notes: NOTES, hold: 1.1,
    text: 'Had replication been conservative, keeping the parental duplex whole beside an entirely new one, one generation would have given separate heavy and light bands. A single hybrid band was seen.'},
  {t: T.disp, nav: 'Not dispersive', title: 'Not dispersive:<br>two bands, not one.', notes: NOTES, hold: 1.1,
    text: 'Had replication been dispersive, mixing old and new DNA along each strand, two generations would have given a single band between hybrid and light. Separate hybrid and light bands were seen.'},
];

// A density-gradient tube under a column: glass, the gradient (denser, darker, towards the bottom), the three levels
// marked round the glass, its DNA bands (glowing discs, stronger for more DNA) and, for the models, the bands seen as
// dotted rings.
function createGradient(parent, x) {
  const {height, radius} = TUBE, group = new THREE.Group(); group.position.set(x, TUBE.y, 0); parent.add(group);
  const glassMaterial = baseMaterial(0x9fb8c2, {roughness: .12, transparent: true, opacity: .14, side: THREE.DoubleSide, depthWrite: false});
  const glass = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, height, 48, 1, true), glassMaterial);
  const bottom = new THREE.Mesh(new THREE.SphereGeometry(radius, 48, 16, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2), glassMaterial);
  bottom.position.y = height / 2; bottom.rotation.x = Math.PI;
  const rim = new THREE.Mesh(new THREE.TorusGeometry(radius, .8, 10, 48), baseMaterial(0xdbe8ec, {roughness: .3}));
  rim.rotation.x = Math.PI / 2; rim.position.y = -height / 2;
  const liquidGeo = new THREE.CylinderGeometry(radius * .93, radius * .93, height * .84, 48, 16, true), colours = [], p = liquidGeo.attributes.position;
  for (let i = 0; i < p.count; i++) { const c = new THREE.Color(0x24404f).lerp(new THREE.Color(0x0a151d), (p.getY(i) + height * .42) / (height * .84)); colours.push(c.r, c.g, c.b); }
  liquidGeo.setAttribute('color', new THREE.Float32BufferAttribute(colours, 3));
  const liquid = new THREE.Mesh(liquidGeo, new THREE.MeshBasicMaterial({vertexColors: true, transparent: true, opacity: .6, side: THREE.DoubleSide, depthWrite: false}));
  liquid.position.y = height * .08;
  const markMaterial = new THREE.MeshBasicMaterial({color: 0xdfe9ec, transparent: true, opacity: .32, depthWrite: false});
  const marks = ['light', 'hybrid', 'heavy'].map(k => { const m = new THREE.Mesh(new THREE.TorusGeometry(radius + .25, .16, 6, 64), markMaterial); m.rotation.x = Math.PI / 2; m.position.y = LEVEL[k]; group.add(m); return m; });
  const bands = Object.fromEntries(Object.entries(BAND).map(([kind, colour]) => {
    const disc = new THREE.Mesh(new THREE.CylinderGeometry(radius * .86, radius * .86, 3, 48), new THREE.MeshBasicMaterial({color: colour, transparent: true, opacity: 0, depthWrite: false}));
    const glow = new THREE.Mesh(new THREE.CylinderGeometry(radius * 1.02, radius * 1.02, 4.4, 48, 1, true), new THREE.MeshBasicMaterial({color: colour, transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide}));
    disc.position.y = glow.position.y = LEVEL[kind]; disc.renderOrder = glow.renderOrder = 3; group.add(disc, glow);
    return [kind, {disc, glow}];
  }));
  // The bands seen, as a ring of dots round the glass.
  const dot = new THREE.SphereGeometry(.62, 10, 8), seenMaterial = new THREE.MeshBasicMaterial({color: 0xffffff, transparent: true, opacity: 0, depthWrite: false});
  const rings = Object.fromEntries(Object.keys(BAND).map(kind => {
    const ring = new THREE.InstancedMesh(dot, seenMaterial.clone(), 22), m = new THREE.Matrix4();
    for (let i = 0; i < 22; i++) { const a = i / 22 * Math.PI * 2; ring.setMatrixAt(i, m.makeTranslation((radius + 1.6) * Math.cos(a), LEVEL[kind], (radius + 1.6) * Math.sin(a))); }
    group.add(ring); return [kind, ring];
  }));
  group.add(glass, bottom, rim, liquid);
  const parts = [glassMaterial, rim.material, liquid.material, markMaterial].map(m => ({m, base: m.opacity}));
  let shown = 1, amounts = {}, seen = {}, seenShown = 0;
  const tube = {group, bands, rings,
    // Band strengths (0–1 each), e.g. {hybrid: .5, light: .5}; the bands seen, and how much they show.
    set(next) { amounts = next; tube.draw(); },
    seen(next, w) { seen = next; seenShown = w; tube.draw(); },
    draw() {
      for (const [kind, {disc, glow}] of Object.entries(bands)) {
        const a = Math.min(1, amounts[kind] || 0);
        disc.material.opacity = .96 * Math.min(1, a * 1.6) * shown; glow.material.opacity = .32 * a * shown; disc.visible = glow.visible = a * shown > .01;
        disc.scale.y = .55 + .75 * a;
        const r = rings[kind]; r.material.opacity = .85 * (seen[kind] ? 1 : 0) * seenShown * shown; r.visible = r.material.opacity > .01;
      }
    },
    opacity(v) {
      shown = v; group.visible = v > .01;
      for (const {m, base} of parts) { const see = base * v < .999; if (m.transparent !== see) { m.transparent = see; m.depthWrite = !see; m.needsUpdate = true; } m.opacity = base * v; }
      tube.draw();
    },
    level: kind => V(x + radius + 2.5, TUBE.y + LEVEL[kind], 0),
    seenAt: kind => V(x - radius - 1.6, TUBE.y + LEVEL[kind], 0),
  };
  return tube;
}

// An arrow from a parent duplex to a daughter, drawn along a curve as it is made.
function createArrow(parent, from, to) {
  const curve = new THREE.CubicBezierCurve3(from, from.clone().add(V(34, 0, 0)), to.clone().add(V(-34, 0, 0)), to);
  const material = baseMaterial(0x9fb3bd, {emissive: 0x9fb3bd, emissiveIntensity: .25, roughness: .5, transparent: true});
  const geometry = new THREE.TubeGeometry(curve, 48, .7, 8), shaft = new THREE.Mesh(geometry, material), total = geometry.index.count;
  const head = new THREE.Mesh(new THREE.ConeGeometry(2.4, 6, 18), material);
  head.position.copy(to); head.quaternion.setFromUnitVectors(V(0, 1, 0), curve.getTangent(1).normalize());
  parent.add(shaft, head);
  return {set(drawn, opacity) {
    geometry.setDrawRange(0, Math.floor(total * drawn / 6) * 6); head.visible = drawn > .98 && opacity > .01; shaft.visible = drawn > .01 && opacity > .01;
    fade(material, opacity);
  }};
}

const at = {};

runScene({
  pageTitle: 'The Meselson–Stahl experiment · Genes are DNA', eyebrow: 'Semiconservative replication',
  links: [{href: 'index.html', text: 'All scenes'}],
  steps, duration: T.end, notesPage: 'notes.html', fov: 26, fog: .00008, loop: false,
  shots: [
    {t: 0, target: [COL[0], 56, 0], dir: [.06, -.07, -1], box: [115, 180]},
    {t: T.gen1, blend: 2.6, target: [(COL[0] + COL[1]) / 2, 42, 0], dir: [.06, -.07, -1], box: [225, 210]},
    {t: T.gen2, blend: 2.6, target: [0, 36, 0], dir: [.05, -.06, -1], box: [290, 225]},
    {t: T.semi, blend: 2.4, target: [0, -4, 0], dir: [.05, -.06, -1], box: [290, 150]},
    {t: T.cons, blend: 2.4, target: [0, 36, 0], dir: [.05, -.06, -1], box: [290, 225]},
    {t: T.disp, blend: 1.2, target: [0, 36, 0], dir: [.05, -.06, -1], box: [290, 225]},
  ],
  async build({world, progress}) {
    // Ideal B-DNA: the mean base-pair geometry of the B-DNA crystal structure (355D).
    const set = await loadSurfaceSet('assets/helix.json', 'assets/helix.bin', progress);
    const strand = n => set.meta.strands.find(s => s.name === n);
    const crystal = pairsFromStrands(strand('a'), strand('b')); frameFromPairs(crystal);
    const local = meanLocal(crystal.slice(1, -1));
    const where = (g, r) => V(COL[g], ROWS[g][r], 0);

    // A duplex of any mix of heavy and light DNA: each strand drawn as stretches of each kind, meeting end to end.
    // draw(upTo) draws strand k up to base pair upTo[k], as a new strand is made.
    const duplex = (g, r, [a, b]) => {
      const frames = helixFrames(N, {origin: where(g, r).add(V(-LEN / 2, 0, 0)), direction: V(1, 0, 0), reference: V(0, -1, 0)});
      const d = createDuplex({pairs: sequencePairs(SEQ, local), template: HEAVY, coding: LIGHT, widths: [.95, .95], samples: 3}); world.add(d.group);
      const stretches = (marks, upTo) => { const out = []; for (let i = 0, start = 0; i < upTo; i++) if (i + 1 === upTo || marks[i + 1] !== marks[start]) { out.push([start, i + 1, marks[start] ? HEAVY : LIGHT]); start = i + 1; } return out; };
      const mol = {d, marks: [a, b], shown: -1, grown: [-1, -1],
        draw(upTo) {
          if (upTo[0] === mol.grown[0] && upTo[1] === mol.grown[1]) return;
          mol.grown = upTo.slice();
          for (const k of [0, 1]) d.segments(k, stretches(mol.marks[k], upTo[k]));
          d.pose(frames);
        },
        opacity(v) { if (v === mol.shown) return; mol.shown = v; d.opacity(v); },
        view(pxPerA) { d.view(pxPerA); },
        backbone: (k, i) => (k ? d.world.bBackbone : d.world.aBackbone)[i],
      };
      mol.draw([N, N]); mol.opacity(0);
      return mol;
    };
    // Every model's tree (generation 0, the parental DNA, is the same in all three).
    const trees = Object.fromEntries(Object.entries(MODELS).map(([key, m]) => [key, m.dna.map((gen, g) => key !== 'semi' && g === 0 ? null : gen.map((strands, r) => duplex(g, r, strands)))]));
    trees.cons[0] = trees.disp[0] = trees.semi[0];
    // In the semiconservative tree each daughter keeps one strand of its parent (the one of the same kind at its end)
    // and makes the other.
    const oldStrand = (g, r) => r % 2;

    // Arrows from parents to daughters, and a density gradient under each column.
    const arrows = [1, 2].map(g => ROWS[g].map((y, r) => createArrow(world, where(g - 1, PARENT[g][r]).add(V(LEN / 2 + 4, 0, 0)), where(g, r).add(V(-LEN / 2 - 6, 0, 0)))));
    const tubes = COL.map(x => createGradient(world, x));
    at.models = Object.values(MODELS).map(m => ({name: m.name, bands: m.bands})); at.tubeAt = COL.map(x => [x, TUBE.y, 0]);

    // When each generation forms: its arrows drawn, its duplexes' kept strands in place and their new strands made
    // along them; its DNA spun a moment later, the bands forming.
    const FORM = [0, T.gen1 + .6, T.gen2 + .6];
    // For tests (?debug=1): points of what is drawn now, world coordinates: each duplex shown (its two backbones) and
    // each gradient shown (its glass, round its rim and bottom).
    at.shown = () => {
      const out = [];
      for (const tree of Object.values(trees)) for (const gen of tree) for (const mol of gen || []) if (mol.d.group.visible) out.push(...mol.d.world.aBackbone, ...mol.d.world.bBackbone);
      tubes.forEach((tube, g) => { if (tube.group.visible) for (const dy of [-TUBE.height / 2, TUBE.height / 2 + TUBE.radius]) for (const dx of [-TUBE.radius, TUBE.radius]) out.push(V(COL[g] + dx, TUBE.y + dy, 0)); });
      return out.map(v => v.toArray());
    };
    return {
      trees, tubes, at,  // for tests (?debug=1)
      update(t, {pxPerA = 1} = {}) {
        // Which model is drawn: semiconservative, then conservative and dispersive in turn, then back.
        const toCons = ramp(t, T.cons + .3, T.cons + 1.5) * (1 - ramp(t, T.disp - .6, T.disp + .4));
        const toDisp = ramp(t, T.disp - .6, T.disp + .4) * (1 - ramp(t, T.disp + 8.4, T.disp + 9.6));
        const weight = {semi: 1 - toCons - toDisp, cons: toCons, disp: toDisp};
        // The light duplexes step back while the parental strands are followed through the generations.
        const follow = ramp(t, T.semi + .6, T.semi + 1.8) * (1 - ramp(t, T.cons - 1, T.cons));
        const away = ramp(t, T.semi - .4, T.semi + .6) * (1 - ramp(t, T.cons + .2, T.cons + 1.4));
        for (const [key, tree] of Object.entries(trees)) tree.forEach((gen, g) => {
          if (!gen || (key !== 'semi' && g === 0)) return;
          const formed = ramp(t, FORM[g], FORM[g] + .8);
          gen.forEach((mol, r) => {
            mol.view(pxPerA);
            if (key === 'semi' && g > 0) {
              // The kept strand whole at once; the new one made along it.
              const grown = Math.round(N * smooth(ramp(t, FORM[g] + .9, FORM[g] + 3.1))), kept = oldStrand(g, r);
              mol.draw(kept ? [grown, N] : [N, grown]);
            }
            const lightDNA = mol.marks.every(s => s.every(x => !x)) && key === 'semi' && g === 2;
            // The parental DNA is the same in every model, so it stays as the models change.
            mol.opacity(g ? formed * weight[key] * (lightDNA ? 1 - .72 * follow : 1) : ramp(t, .3, 1.4));
          });
        });
        arrows.forEach((row, i) => row.forEach(a => a.set(smooth(ramp(t, FORM[i + 1] - .2, FORM[i + 1] + 1.2)), ramp(t, FORM[i + 1] - .2, FORM[i + 1] + .3))));
        // The bands of the model drawn; in the model steps, the bands seen outlined.
        const seenShown = ramp(t, T.cons + 1.2, T.cons + 2.2) * (1 - ramp(t, T.disp + 8.4, T.disp + 9.6));
        tubes.forEach((tube, g) => {
          const spun = ramp(t, FORM[g] + 3.2, FORM[g] + 4.6), amounts = {};
          for (const [key, w] of Object.entries(weight)) for (const [kind, a] of Object.entries(MODELS[key].bands[g])) amounts[kind] = (amounts[kind] || 0) + a * w * spun;
          tube.set(amounts); tube.seen(SEEN[g], g ? seenShown : 0);
          // While the parental strands are followed, the camera is close on the tree and the gradients leave the view
          // (they would stand behind the narration), as the camera moves in and until it has moved out again.
          tube.opacity((g ? ramp(t, FORM[g] - .2, FORM[g] + .8) : ramp(t, .3, 1.4)) * (1 - away));
        });
        at.weight = weight;
      },
      annotate(t, {label, tag}) {
        const P = HEAVY, Li = LIGHT, head = (g, text, o) => tag(V(COL[g], ROWS[g][0] - 22, 0), text, o);
        // Column headings and the move to light nitrogen, from when each generation forms.
        if (t > 1.2) head(0, 'Parental DNA · heavy nitrogen', {color: hex(P)});
        if (t > FORM[1] + 1) head(1, 'Generation 1 · light nitrogen', {color: hex(Li)});
        if (t > FORM[2] + 1) head(2, 'Generation 2', {color: hex(Li)});
        // The gradient's three levels, named left of the first tube, clear of its bands.
        if (t > 2.2) for (const kind of ['light', 'hybrid', 'heavy']) tag(V(COL[0] - TUBE.radius - 30, TUBE.y + LEVEL[kind], 0), kind[0].toUpperCase() + kind.slice(1), {color: hex(BAND[kind])});
        const mol = (g, r) => trees.semi[g][r];
        if (t > 2 && t < T.gen1) {
          label(mol(0, 0).backbone(1, N - 3), 'Heavy DNA', 'Both strands made with heavy nitrogen', {color: hex(P), below: true});
          if (t > 4.8) label(tubes[0].level('heavy'), 'All of the DNA heavy', 'One band, low in the gradient', {color: hex(BAND.heavy)});
        } else if (t > FORM[1] + 3.2 && t < T.gen2) {
          label(mol(1, 0).backbone(0, 3), 'Hybrid DNA', 'One heavy strand, one light', {color: hex(BAND.hybrid)});
          if (t > FORM[1] + 4.8) label(tubes[1].level('hybrid'), 'All of the DNA hybrid', 'One band, higher up', {color: hex(BAND.hybrid)});
        } else if (t > FORM[2] + 3.2 && t < T.semi) {
          label(mol(2, 0).backbone(0, N - 2), 'Hybrid DNA', 'Half of the DNA', {color: hex(BAND.hybrid)});
          label(mol(2, 2).backbone(0, N - 2), 'Light DNA', 'Half of the DNA', {color: hex(Li)});
          if (t > FORM[2] + 4.8) tag(tubes[2].level('hybrid'), 'Hybrid and light, equal', {color: '#cfe3ea'});
        } else if (t > T.semi + 1.8 && t < T.cons) {
          // The two parental strands, one in each hybrid of generation 2.
          label(mol(2, 0).backbone(0, N - 2), 'Parental strand', 'Kept whole since generation 0', {color: hex(P)});
          label(mol(2, 3).backbone(1, N - 2), 'Parental strand', 'The other one', {color: hex(P), key: 'other parental'});
        } else if (t > T.cons + 2.2 && t < T.disp) {
          tag(MODEL_TAG, 'Conservative model', {color: '#f3cf97'});
          label(tubes[1].level('heavy'), 'Predicted', 'Separate heavy and light bands', {color: '#f3cf97'});
          tag(tubes[1].seenAt('hybrid'), 'Seen', {color: '#ffffff'});
        } else if (t > T.disp + 1.4 && t < T.disp + 8.8) {
          tag(MODEL_TAG, 'Dispersive model', {color: '#f3cf97'});
          label(tubes[2].level('between'), 'Predicted', 'One band between hybrid and light', {color: '#f3cf97'});
          tag(tubes[2].seenAt('hybrid'), 'Seen', {color: '#ffffff'}); tag(tubes[2].seenAt('light'), 'Seen', {color: '#ffffff'});
        } else if (t > T.disp + 10) {
          tag(MODEL_TAG, 'Semiconservative model · as seen', {color: '#f3cf97'});
        }
      },
    };
  },
});
