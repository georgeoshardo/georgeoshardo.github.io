// Molecules atom by atom, for the pages that zoom in to the chemistry (chapter 1's nucleotides and double helix):
// ball-and-stick atoms in the course's element colours, bonds split at their middle and coloured by their two atoms
// (a double bond as two thinner sticks), hydrogen bonds as short dashes, and the flat rings of bases and sugars as
// translucent plates. Drawn from an atom group exported by build_surfaces.py ("atoms"). Each atom can be shown part
// way, tinted towards a highlight or moved, so a scene can build a molecule piece by piece, pick out one part of it,
// swell it to its van der Waals size or morph one nucleotide into another.
import * as THREE from 'three';
import {baseMaterial, fadeObject} from './molecules.mjs';
import {bondGeometry} from './strands.mjs';
import {mix} from './ease.mjs';

const V = (...a) => new THREE.Vector3(...a);
// Element colours on the course's night background (carbon a soft grey unless a page gives it its strand's colour,
// nitrogen blue, oxygen coral red, phosphorus amber, hydrogen ivory, ions green or violet), with ball radii (Å) for
// ball-and-stick and van der Waals radii for space filling.
export const ELEMENTS = {
  C: {color: 0xbfc9cd, ball: .36, vdw: 1.7}, N: {color: 0x5d8fe8, ball: .34, vdw: 1.55}, O: {color: 0xe2584e, ball: .34, vdw: 1.52},
  P: {color: 0xf0a240, ball: .46, vdw: 1.8}, H: {color: 0xeeeae0, ball: .2, vdw: 1.1},
  MG: {color: 0x9ad68a, ball: .62, vdw: 1.73}, NA: {color: 0xb99be0, ball: .62, vdw: 2.27},
};
export const BOND = {radius: .13, double: .085, gap: .14, hbond: .075, hbondColor: 0xf6e3a0};
// The rings of a nucleotide, by atom name: a purine's six- and five-membered rings, a pyrimidine's single ring,
// and the sugar's five-membered ring.
export const RINGS = {
  purine: [['N1', 'C2', 'N3', 'C4', 'C5', 'C6'], ['C4', 'C5', 'N7', 'C8', 'N9']],
  pyrimidine: [['N1', 'C2', 'N3', 'C4', 'C5', 'C6']],
  sugar: [["C1'", "C2'", "C3'", "C4'", "O4'"]],
};
export const isPurine = letter => letter === 'A' || letter === 'G';
// Which part of a nucleotide an atom belongs to, by its name: the phosphate group (P, OP1, OP2, OP3 and their
// hydrogens; a triphosphate's PA, PB, PG, O1A…O3G and HOA2… as the PDB names GTP's), the sugar (its atoms carry primes)
// or the base. An atom group's own atoms are better told apart by their bonds too (nucleotideParts), as createAtoms does.
export const partOf = name => /^(P|OP\d|HOP\d|P[ABG]|O[1-3][ABG]|HO[ABG]\d)$/.test(name) ? 'phosphate' : name.includes("'") ? 'sugar' : 'base';
// Each atom's part of its nucleotide in an exported atom group. A primed name is sugar and P, OP1… phosphate, as
// partOf says; any other atom with bonds is placed by them: phosphorus, an oxygen bonded to phosphorus and to no carbon
// (a phosphate's own and bridging oxygens, however a triphosphate names them) and its hydrogens are phosphate; a
// ribose ring (four carbons and an oxygen) and what hangs from it, short of a nitrogen (the base's) or a phosphorus,
// is sugar (an unprimed sugar's 2′, 3′ and 5′ oxygens and hydrogens); the rest is base. An atom without bonds goes by
// partOf. For the PDB's nucleotides this is partOf's answer; for the dictionary's caps (GTG, GTA, MGP, …), whose
// sugars carry no primes and whose phosphates are named every way (P1, O11, PA, O1A…), it is the right one. `extra`:
// bonds beyond the export's ([i, j]), as createAtoms' extraBonds.
export function nucleotideParts(data, extra = []) {
  const A = data.atoms, n = A.name.length, el = A.element.map(e => e.toUpperCase()), nb = Array.from({length: n}, () => []);
  for (const [i, j] of [...(data.bonds || []), ...extra]) { nb[i].push(j); nb[j].push(i); }
  const part = A.name.map(name => name.includes("'") ? 'sugar' : /^(P|OP\d|HOP\d)$/.test(name) ? 'phosphate' : null);
  const phosphateO = i => el[i] === 'O' && nb[i].some(j => el[j] === 'P') && !nb[i].some(j => el[j] === 'C');
  for (let i = 0; i < n; i++) if (!part[i] && (el[i] === 'P' || phosphateO(i))) part[i] = 'phosphate';
  for (let i = 0; i < n; i++) if (!part[i] && el[i] === 'H' && nb[i].some(j => el[j] === 'O' && part[j] === 'phosphate')) part[i] = 'phosphate';
  // Furanose rings (O–C–C–C–C back to the O), then what hangs from them.
  const ring = new Set();
  for (let o = 0; o < n; o++) {
    if (el[o] !== 'O') continue;
    const walk = path => {
      const last = path[path.length - 1];
      if (path.length === 5) { if (nb[last].includes(o)) path.forEach(k => ring.add(k)); return; }
      for (const j of nb[last]) if (el[j] === 'C' && !path.includes(j)) walk([...path, j]);
    };
    for (const c of nb[o]) if (el[c] === 'C') walk([o, c]);
  }
  const queue = [...ring], seen = new Set(ring);
  for (const k of ring) part[k] ??= 'sugar';
  while (queue.length) {
    const k = queue.pop();
    for (const j of nb[k]) if (!seen.has(j) && el[j] !== 'N' && el[j] !== 'P' && part[j] !== 'phosphate') { seen.add(j); part[j] ??= 'sugar'; queue.push(j); }
  }
  for (let i = 0; i < n; i++) part[i] ??= nb[i].length ? 'base' : partOf(A.name[i]);
  return part;
}

const sphereGeometry = new THREE.SphereGeometry(1, 22, 16);
const UP = V(0, 1, 0), dummy = new THREE.Object3D(), _a = V(), _b = V(), _d = V(), _n = V(), _m = V();

// A drawable atom group. `carbon(i)` colours carbon atoms (a strand's colour, say); `filter(i)` leaves atoms out
// (hydrogens, ions); `ghost(i)` keeps an atom for its bonds but draws no ball, so a group of a few atoms (a 2′-OH
// swapped into another molecule's sugar) can bond to an atom another group draws. `extraBonds` ([[i, j, order], …],
// indices into the export's atoms) adds bonds the export lacks: a lariat's 2′–5′ bond, a cap's 5′–5′ link. Any bond can
// be shown part way (showBond), as one forms and another breaks. Positions start at the export's and can be moved
// (atoms.positions[i]); update() redraws.
export function createAtoms(parent, data, {carbon = () => ELEMENTS.C.color, filter = () => true, ghost = () => false, extraBonds = []} = {}) {
  const A = data.atoms, all = A.name.map((_, i) => i).filter(filter), n = all.length, of = new Map(all.map((i, k) => [i, k]));
  const partsAll = nucleotideParts(data, extraBonds), parts = all.map(i => partsAll[i]);
  const group = new THREE.Group(); parent.add(group);
  const names = all.map(i => A.name[i]), elements = all.map(i => A.element[i].toUpperCase()), residueOf = all.map(i => A.residue[i]);
  const positions = all.map(i => V(...A.position[i])), home = positions.map(p => p.clone());
  const colour = elements.map((e, k) => new THREE.Color(e === 'C' ? carbon(all[k]) : ELEMENTS[e]?.color ?? 0xcccccc));
  const ghosts = all.map(i => !!ghost(i));
  const info = e => ELEMENTS[e] || ELEMENTS.C;

  const material = baseMaterial(0xffffff, {roughness: .4, envMapIntensity: .35});
  const spheres = new THREE.InstancedMesh(sphereGeometry, material, n);
  // Bonds between kept atoms; a double bond is two parallel sticks. Each stick is two halves, one per atom.
  const bonds = [...data.bonds, ...extraBonds].filter(([i, j]) => of.has(i) && of.has(j)).map(([i, j, order = 1]) => [of.get(i), of.get(j), order]);
  const neighbours = Array.from({length: n}, () => []);
  for (const [i, j] of bonds) { neighbours[i].push(j); neighbours[j].push(i); }
  const sticks = bonds.flatMap(([i, j, order], b) => order >= 2 ? [[i, j, 1, b], [i, j, -1, b]] : [[i, j, 0, b]]), bondShown = new Float32Array(bonds.length).fill(1);
  const halves = new THREE.InstancedMesh(bondGeometry, material, sticks.length * 2);
  const hbonds = (data.hbonds || []).filter(([i, j]) => of.has(i) && of.has(j)).map(([i, j]) => [of.get(i), of.get(j)]);
  const DASHES = 4, dashMaterial = baseMaterial(BOND.hbondColor, {roughness: .5, emissive: BOND.hbondColor, emissiveIntensity: .5});
  // (A molecule without hydrogen bonds draws no dashes: an instance never placed would draw at the origin.)
  const dashes = new THREE.InstancedMesh(bondGeometry, dashMaterial, Math.max(1, hbonds.length * DASHES));
  dashes.count = hbonds.length * DASHES;
  // Drawn before other see-through things, and writing depth while they fade (as strands do, shared/rna.mjs): a
  // fading protein then shows over atoms behind it and not over atoms in front of it, or in its pocket.
  for (const m of [spheres, halves, dashes]) { m.frustumCulled = false; m.renderOrder = -.5; group.add(m); }

  const shown = new Float32Array(n).fill(1), tint = colour.map(c => c.clone()), hbondShown = new Float32Array(hbonds.length);
  let fill = 0;  // 0 ball-and-stick … 1 space filling
  const paint = () => {
    for (let k = 0; k < n; k++) spheres.setColorAt(k, tint[k]);
    sticks.forEach(([i, j], s) => { halves.setColorAt(2 * s, tint[i]); halves.setColorAt(2 * s + 1, tint[j]); });
    spheres.instanceColor.needsUpdate = true; if (halves.instanceColor) halves.instanceColor.needsUpdate = true;
  };
  paint();

  // `shown` (0–1 per atom) can also be written directly, as show() does.
  const atoms = {group, count: n, names, elements, residueOf, residues: data.residues, positions, home, bonds, hbonds, neighbours, shown,
    // The atom of that name in residue r (index into this group), or -1.
    find(name, r = 0) { for (let k = 0; k < n; k++) if (names[k] === name && residueOf[k] === r) return k; return -1; },
    // Indices of the atoms that pass test(k).
    select(test) { const out = []; for (let k = 0; k < n; k++) if (test(k)) out.push(k); return out; },
    part(k) { return parts[k]; },
    // Shows the bond between atoms i and j (this group's indices) part way: 0 broken … 1 whole (the default).
    showBond(i, j, value) { bonds.forEach(([a, b], k) => { if ((a === i && b === j) || (a === j && b === i)) bondShown[k] = value; }); },
    // Shows atoms part way (0 hidden … 1 whole); bonds show as much as their less-shown atom.
    show(ks, value) { for (const k of ks) shown[k] = value; },
    showAll(value) { shown.fill(value); },
    // Blends atoms' colours towards `color` by amount (0 their own colour).
    tint(ks, color, amount) { const c = new THREE.Color(color); for (const k of ks) tint[k].copy(colour[k]).lerp(c, amount); paint(); },
    untint() { colour.forEach((c, k) => tint[k].copy(c)); paint(); },
    // Hydrogen bonds shown part way (all, or those that pass test(h)).
    showHbonds(value, test = () => true) { hbonds.forEach((_, h) => { if (test(h)) hbondShown[h] = value; }); },
    // 0 ball-and-stick … 1 space filling.
    set fill(v) { fill = v; }, get fill() { return fill; },
    centre(ks) { const c = V(); for (const k of ks) c.add(positions[k]); return ks.length ? c.divideScalar(ks.length) : c; },
    update() {
      for (let k = 0; k < n; k++) {
        const e = info(elements[k]), r = ghosts[k] ? 0 : mix(e.ball, e.vdw * .92, fill) * shown[k];
        dummy.position.copy(positions[k]); dummy.quaternion.identity(); dummy.scale.setScalar(Math.max(r, 1e-4)); dummy.updateMatrix(); spheres.setMatrixAt(k, dummy.matrix);
      }
      sticks.forEach(([i, j, side, b], s) => {
        const w = Math.min(shown[i], shown[j]) * bondShown[b] * (1 - fill), r = (side ? BOND.double : BOND.radius) * w;
        _a.copy(positions[i]); _b.copy(positions[j]);
        if (side) {
          // Offset in the plane of a neighbouring bond, so a ring's double bond lies in the ring.
          _d.subVectors(_b, _a); const k = neighbours[i].find(x => x !== j) ?? neighbours[j].find(x => x !== i);
          _n.subVectors(k !== undefined ? positions[k] : _m.set(0, 0, 1).add(_a), _a).cross(_d).cross(_d);
          if (_n.lengthSq() < 1e-10) _n.set(0, 0, 1).cross(_d);
          _n.normalize().multiplyScalar(side * BOND.gap);
          _a.add(_n); _b.add(_n);
        }
        _m.addVectors(_a, _b).multiplyScalar(.5);
        place(halves, 2 * s, _a, _m, r); place(halves, 2 * s + 1, _b, _m, r);
      });
      hbonds.forEach(([i, j], h) => {
        const w = hbondShown[h] * Math.min(shown[i], shown[j]);
        for (let d = 0; d < DASHES; d++) {
          // Dashes along the middle of the gap between the two atoms' balls.
          _a.lerpVectors(positions[i], positions[j], .18 + .64 * d / DASHES); _b.lerpVectors(positions[i], positions[j], .18 + .64 * (d + .55) / DASHES);
          place(dashes, h * DASHES + d, _a, _b, BOND.hbond * w);
        }
      });
      for (const m of [spheres, halves, dashes]) m.instanceMatrix.needsUpdate = true;
    },
    opacity(value) { fadeObject(group, value); for (const m of [material, dashMaterial]) if (m.transparent) m.depthWrite = true; },
  };
  atoms.update();
  return atoms;
}

// A cylinder of radius r from a to b (r ≈ 0 hides it).
function place(inst, i, a, b, r) {
  _d.subVectors(b, a); const len = _d.length();
  dummy.position.addVectors(a, b).multiplyScalar(.5); dummy.quaternion.setFromUnitVectors(UP, len > 1e-6 ? _d.divideScalar(len) : UP);
  dummy.scale.set(Math.max(r, 1e-4), r < 1e-4 ? 1e-4 : len, Math.max(r, 1e-4)); dummy.updateMatrix(); inst.setMatrixAt(i, dummy.matrix);
}

// The rings of nucleotides as flat translucent plates (the "steps" of the double helix, the sugar's ring), one
// colour per ring from color(ring); ring.kind is 'purine', 'pyrimidine' or 'sugar'; `residues` (indices) limits them.
// update() follows the atoms.
export function createPlates(parent, atoms, {kinds = ['purine', 'pyrimidine'], color = () => 0xffffff, opacity = .55, residues = null} = {}) {
  const rings = [];
  atoms.residues.forEach((res, r) => {
    if (!res.letter || residues && !residues.includes(r)) return;
    for (const kind of kinds) {
      const sets = kind === 'sugar' ? RINGS.sugar : kind === (isPurine(res.letter) ? 'purine' : 'pyrimidine') ? RINGS[kind] : [];
      for (const names of sets) {
        const ks = names.map(name => atoms.find(name, r));
        if (ks.every(k => k >= 0)) rings.push({residue: r, letter: res.letter, kind, atoms: ks});
      }
    }
  });
  const tris = rings.reduce((s, ring) => s + ring.atoms.length, 0), position = new Float32Array(tris * 9), colors = new Float32Array(tris * 9);
  let o = 0;
  for (const ring of rings) { const c = new THREE.Color(color(ring)); for (let t = 0; t < ring.atoms.length * 3; t++, o += 3) colors.set([c.r, c.g, c.b], o); }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(position, 3).setUsage(THREE.DynamicDrawUsage)); g.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  const material = new THREE.MeshBasicMaterial({vertexColors: true, transparent: true, opacity, side: THREE.DoubleSide, depthWrite: false});
  material.userData.noAO = true;
  const mesh = new THREE.Mesh(g, material); mesh.frustumCulled = false; mesh.renderOrder = 2; parent.add(mesh);
  const plates = {mesh, rings, material,
    update() {
      let p = 0;
      for (const ring of rings) {
        const c = atoms.centre(ring.atoms);
        ring.atoms.forEach((k, i) => {
          const a = atoms.positions[k], b = atoms.positions[ring.atoms[(i + 1) % ring.atoms.length]];
          position.set([c.x, c.y, c.z, a.x, a.y, a.z, b.x, b.y, b.z], p); p += 9;
        });
      }
      g.attributes.position.needsUpdate = true; g.computeBoundingSphere();
    },
    opacity(value) { material.opacity = opacity * value; mesh.visible = value > .01; },
  };
  plates.update();
  return plates;
}
