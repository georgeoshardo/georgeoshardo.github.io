// Scene: the structure of nucleotides, atom by atom (ideal coordinates from the PDB's Chemical Component Dictionary,
// hydrogens included, phosphates charged as at neutral pH; all superposed on dAMP's sugar ring): a nucleotide's three
// components, the sugar's carbons and the glycosidic bond, nucleoside and nucleotide, deoxyribose and ribose (the
// 2′-OH swapped in from AMP), the purines and pyrimidines side by side, the glycosidic bond from N9 of a purine and N1
// of a pyrimidine (G and C), uracil for thymine, and a four-nucleotide
// chain (GCGA from the B-DNA crystal structure 355D, each nucleotide rebuilt from its ideal molecule) with its free
// 5′ phosphate and 3′ hydroxyl.
import * as THREE from 'three';
import {runScene} from '../shared/scene_player.mjs';
import {loadSurfaceSet} from '../shared/molecules.mjs';
import {BASES, STRANDS} from '../shared/strands.mjs';
import {createAtoms, createPlates, ELEMENTS, RINGS} from '../shared/atoms.mjs';
import {ramp, smooth, clamp} from '../shared/ease.mjs';
import {boxAround} from '../shared/camera.mjs';

const V = (...a) => new THREE.Vector3(...a);
const hex = c => '#' + c.toString(16).padStart(6, '0');
const T = {carbons: 10, nuc: 19, ribose: 28, bases: 37, glyco: 46, uracil: 55, chain: 64, end: 76};
const SUGAR = STRANDS.coding, PHOSPHATE = ELEMENTS.P.color, BOND_GOLD = 0xf6d27a;
const SPACING = [-16.5, -5.5, 5.5, 16.5];  // A, G, C, T side by side (Å), each stood upright, its base on top

const NOTES = 'the-structure-of-nucleotides';
const steps = [
  {t: 0, nav: 'Three components', title: 'A nucleotide has<br>three components.', notes: NOTES,
    text: 'The basic building block of nucleic acids (DNA and RNA) is the nucleotide, which has three components: a nitrogenous base, a sugar, and one or more phosphate groups.'},
  {t: T.carbons, nav: 'The glycosidic bond', title: 'The base joins<br>the 1′ carbon.', notes: NOTES,
    text: 'The nitrogenous base is a purine or pyrimidine ring, linked to the 1′ (one-prime) carbon of the pentose sugar by a glycosidic bond: from N9 of a purine, as here, or N1 of a pyrimidine.'},
  {t: T.nuc, nav: 'Nucleoside, nucleotide', title: 'Nucleoside,<br>then nucleotide.', notes: NOTES,
    text: 'A nitrogenous base linked to a pentose sugar is called a nucleoside. A nucleoside linked to a phosphate at the 5′ carbon is called a nucleotide.'},
  {t: T.ribose, nav: 'Deoxyribose, ribose', title: 'DNA and RNA differ<br>at the 2′ carbon.', notes: NOTES, hold: 1.1,
    text: 'Nucleic acids are named for the sugar in their backbone: DNA has a 2′-deoxyribose, RNA a ribose. The only difference is the hydroxyl group (-OH) on the 2′ carbon of the ribose in RNA.'},
  {t: T.bases, nav: 'Purines, pyrimidines', title: 'Two purines,<br>two pyrimidines.', notes: NOTES, hold: 1.1,
    text: 'Each nucleic acid contains four types of bases. The same two purines, adenine (A) and guanine (G), are present in both DNA and RNA. The two pyrimidines in DNA are cytosine (C) and thymine (T).'},
  {t: T.glyco, nav: 'N9 or N1', title: 'A purine joins at N9,<br>a pyrimidine at N1.', notes: NOTES, hold: 1.1,
    text: 'In every nucleotide the base is linked to the 1′ carbon of the sugar by a glycosidic bond: from N9 of a purine, such as guanine, or from N1 of a pyrimidine, such as cytosine.'},
  {t: T.uracil, nav: 'Uracil in RNA', title: 'In RNA, uracil<br>replaces thymine.', notes: NOTES,
    text: 'In RNA, uracil (U) is found instead of thymine, on a ribose sugar.'},
  {t: T.chain, nav: 'A polynucleotide chain', title: 'Nucleotides join<br>into a chain.', notes: NOTES, hold: 1.2,
    text: 'Successive nucleotides joined together form a polynucleotide chain: a backbone of 5′–3′ sugar–phosphate links from which the bases protrude. One end has a free 5′ phosphate group and the other a free 3′ hydroxyl group; sequences are written 5′ to 3′, from left to right.'},
];

const at = {};  // positions the camera shots read (world coordinates)

runScene({
  pageTitle: 'The structure of nucleotides · Genes are DNA', eyebrow: 'Nucleotides',
  links: [{href: 'index.html', text: 'All scenes'}],
  steps, duration: T.end, notesPage: 'notes.html', fov: 28, fog: .0006,
  shots: [
    {t: 0, target: [0, 0, 0], dir: [.08, -.16, -1], radius: 11.5, fill: .9},
    {t: T.carbons, blend: 2.4, frame: () => ({target: at.sugar, dir: [.08, -.2, -1], radius: 8, fill: .9})},
    {t: T.nuc, blend: 2.2, target: [0, 0, 0], dir: [.08, -.16, -1], radius: 11.5, fill: .9},
    // The whole nucleotide, turned to show its 2′ carbon, and the row of four with room above for its brackets, each
    // fitted to the free part of the screen, so no atom stands behind the page's text or buttons.
    {t: T.ribose, blend: 2.4, frame: () => ({...at.views.ribose, fill: .92})},
    {t: T.bases, blend: 2.8, frame: () => ({...at.views.bases, fill: .95})},
    // G and C, with room either side for their bonds' labels, in the free part of the screen at any size.
    {t: T.glyco, blend: 2.4, target: [0, -.5, 0], dir: [0, -.12, -1], box: [30, 17], fill: .95},
    {t: T.uracil, blend: 2.6, target: [SPACING[3], 0, 0], dir: [.1, -.18, -1], radius: 10, fill: .9},
    // The chain with room round it for its labels, in the free part of the screen at any size.
    {t: T.chain, blend: 3, target: [0, 2, 0], dir: [0, -.1, -1], box: [46, 25], fill: .95},
  ],
  async build({world, progress}) {
    const set = await loadSurfaceSet('assets/nucleotides.json', 'assets/nucleotides.bin', progress);
    const G = Object.fromEntries(set.meta.atoms.map(g => [g.name, g]));
    const pos = (g, name) => V(...g.atoms.position[g.atoms.name.indexOf(name)]);
    const mean = (g, names) => names.reduce((s, n) => s.add(pos(g, n)), V()).divideScalar(names.length);

    // The single nucleotides share dAMP's frame: phosphate to the left, base to the right, sugar below them.
    const dAMP = G.dAMP, P0 = pos(dAMP, 'P'), sugar0 = mean(dAMP, RINGS.sugar[0]), base0 = mean(dAMP, RINGS.purine.flat());
    const orientation = (x, upRaw) => {
      const up = upRaw.clone().addScaledVector(x, -upRaw.dot(x)).normalize();
      const basis = new THREE.Matrix4().makeBasis(x, up, x.clone().cross(up));
      return new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().makeBasis(V(1, 0, 0), V(0, -1, 0), V(0, 0, -1)).multiply(basis.transpose()));
    };
    const q = orientation(base0.clone().sub(P0).normalize(), P0.clone().add(base0).multiplyScalar(.5).sub(sugar0));
    const centre = P0.clone().add(base0).add(sugar0).divideScalar(3);
    // Each molecule sits in a holder placed in world coordinates (so it can slide sideways), in the shared frame.
    const holder = x => {
      const outer = new THREE.Group(), inner = new THREE.Group();
      inner.quaternion.copy(q); inner.position.copy(centre).applyQuaternion(q).negate();
      outer.position.x = x; outer.add(inner); world.add(outer); return {outer, inner};
    };
    const hold = {A: holder(0), G: holder(SPACING[1]), C: holder(SPACING[2]), T: holder(SPACING[3])};
    const nts = {A: createAtoms(hold.A.inner, dAMP), G: createAtoms(hold.G.inner, G.dGMP), C: createAtoms(hold.C.inner, G.dCMP), T: createAtoms(hold.T.inner, G.dTMP)};
    const plates = Object.fromEntries(Object.entries(nts).map(([k, a]) => [k, createPlates(hold[k].inner, a, {color: ring => BASES[ring.letter], opacity: .5})]));
    const sugarPlate = createPlates(hold.A.inner, nts.A, {kinds: ['sugar'], color: () => SUGAR, opacity: .3});

    // Swapped atoms. A 2′-OH from AMP (its C2′ a ghost that bonds it to the sugar drawn beneath), for dA and dT;
    // uracil's H5 from UMP for thymine's methyl group. Each replaces the hydrogen of the host nearest to it.
    const named = (g, list) => i => list.includes(g.atoms.name[i]);
    const hydroxyl = h => createAtoms(h.inner, G.AMP, {filter: named(G.AMP, ["C2'", "O2'", "HO2'"]), ghost: named(G.AMP, ["C2'"])});
    const oh = {A: hydroxyl(hold.A), T: hydroxyl(hold.T)};
    const h5 = createAtoms(hold.T.inner, G.UMP, {filter: named(G.UMP, ['C5', 'H5']), ghost: named(G.UMP, ['C5'])});
    const nearestH = (a, point, names) => names.map(n => a.find(n)).filter(k => k >= 0).sort((i, j) => a.home[i].distanceTo(point) - a.home[j].distanceTo(point))[0];
    const o2 = pos(G.AMP, "O2'");
    const replaced = {A: nearestH(nts.A, o2, ["H2'", "H2''"]), T: nearestH(nts.T, o2, ["H2'", "H2''"])};
    const methyl = ['C7', 'H71', 'H72', 'H73'].map(n => nts.T.find(n)).filter(k => k >= 0);
    const phosphate = nts.A.select(k => nts.A.part(k) === 'phosphate');
    const glyco = [nts.A.find('N9'), nts.A.find("C1'")];
    // Each nucleotide's glycosidic bond, from its sugar's C1′ to the base's nitrogen bonded to it (N9 of a purine, N1
    // of a pyrimidine), as [nitrogen, C1′].
    const glycos = Object.fromEntries(Object.entries(nts).map(([k, a]) => { const c1 = a.find("C1'"); return [k, [a.neighbours[c1].find(j => a.elements[j] === 'N'), c1]]; }));
    at.glycosidic = Object.fromEntries(Object.entries(glycos).map(([k, [n]]) => [k, nts[k].names[n]]));

    // The chain: 5′ end to the left, its bases up, centred.
    const C = G.chain, R = C.residues, last = R.length - 1;
    const cpos = (name, r) => V(...C.atoms.position[C.atoms.name.findIndex((n, i) => n === name && C.atoms.residue[i] === r)]);
    const chainBases = R.map((res, r) => { const names = C.atoms.name.map((n, i) => [n, i]).filter(([n, i]) => C.atoms.residue[i] === r && ['N1', 'C2', 'N3', 'C4', 'C5', 'C6'].includes(n)); return names.reduce((s, [, i]) => s.add(V(...C.atoms.position[i])), V()).divideScalar(names.length); });
    const five = cpos('P', 0), three = cpos("O3'", last);
    const backboneMid = five.clone().add(three).multiplyScalar(.5), basesMid = chainBases.reduce((s, b) => s.add(b), V()).divideScalar(chainBases.length);
    const qc = orientation(three.clone().sub(five).normalize(), basesMid.clone().sub(backboneMid));
    const chainHold = new THREE.Group(), chainInner = new THREE.Group(); world.add(chainHold); chainHold.add(chainInner);
    const chainCentre = backboneMid.clone().add(basesMid).multiplyScalar(.5);
    chainInner.quaternion.copy(qc); chainInner.position.copy(chainCentre).applyQuaternion(qc).negate();
    const chain = createAtoms(chainInner, C);
    const chainPlates = createPlates(chainInner, chain, {color: ring => BASES[ring.letter], opacity: .58});

    world.updateMatrixWorld(true);
    const toWorld = (h, v) => h.localToWorld(v.clone());
    at.sugar = toWorld(hold.A.inner, sugar0);
    const atomsOf = list => list.flatMap(([h, a]) => a.home.map(p => toWorld(h.inner, p)));
    // The row's pose (as update() sets it at the end of its move), for its shot.
    const rowPose = w => { hold.A.outer.position.x = SPACING[0] * w; for (const h of Object.values(hold)) h.outer.rotation.z = -Math.PI / 2 * w; world.updateMatrixWorld(true); };
    at.views = {ribose: boxAround(atomsOf([[hold.A, nts.A], [hold.A, oh.A]]), [.35, -.22, -1], {margin: .8, fov: 28})};
    rowPose(1); at.views.bases = boxAround(atomsOf(Object.entries(nts).map(([k, a]) => [hold[k], a])), [0, -.14, -1], {margin: 1.2, above: 5, fov: 28}); rowPose(0);

    const everything = [...Object.values(nts), oh.A, oh.T, h5];
    let lastTint = -1, lastTint4 = -1;
    // For tests (?debug=1): the atoms drawn now (of the single nucleotides and the chain), world coordinates.
    at.shown = () => {
      const out = [], add = (a, h) => { if (a.group.visible) a.positions.forEach((v, k) => { if (a.shown[k] > .05) out.push(h.localToWorld(v.clone())); }); };
      for (const [k, a] of Object.entries(nts)) add(a, hold[k].inner);
      add(chain, chainInner);
      return out.map(v => v.toArray());
    };

    return {
      nts, chain, at,  // for tests (?debug=1)
      update(t) {
        // A slides aside for its three partners, which arrive beside it; all give way to the chain.
        // For the row, each nucleotide stands upright (base on top, phosphate below), so the four fit closer together.
        const row = smooth(ramp(t, T.bases + .3, T.bases + 2.4));
        hold.A.outer.position.x = SPACING[0] * row;
        for (const h of Object.values(hold)) h.outer.rotation.z = -Math.PI / 2 * row;
        const others = ramp(t, T.bases + .9, T.bases + 2.3), singles = 1 - ramp(t, T.chain, T.chain + 1.2), chained = ramp(t, T.chain + .7, T.chain + 2.1);
        // While G and C are compared, A and T leave the view; while thymine becomes uracil, G and C do too (A stays
        // away), so nothing stands at the edges of the view, behind the step list or the narration.
        const back = ramp(t, T.glyco + .2, T.glyco + 1.2), gone = ramp(t, T.uracil + .2, T.uracil + 1.2), dim = {
          A: 1 - back, T: 1 - back * (1 - ramp(t, T.uracil - .4, T.uracil + .6)), G: 1 - gone, C: 1 - gone,
        };
        for (const k of ['G', 'C']) nts[k].opacity(others * singles * dim[k]);
        nts.T.opacity(others * singles * dim.T); nts.A.opacity(singles * dim.A); oh.A.opacity(singles * dim.A); oh.T.opacity(others * singles); h5.opacity(others * singles);
        chain.opacity(chained); chainPlates.opacity(chained);
        // The chain turns gently to and fro, so its bases and backbone show in depth.
        chainHold.rotation.y = .38 * Math.sin(2 * Math.PI * (t - T.chain) / 12) * ramp(t, T.chain + 1.5, T.chain + 3.5);
        // The phosphate leaves (a nucleoside) and returns (a nucleotide).
        const p = clamp(1 - ramp(t, T.nuc + .6, T.nuc + 1.6) + ramp(t, T.nuc + 4.4, T.nuc + 5.4));
        nts.A.show(phosphate, p);
        // Deoxyribose to ribose on A, and back before the four bases; thymine to uracil on a ribose.
        const rib = ramp(t, T.ribose + 1.8, T.ribose + 2.9) * (1 - ramp(t, T.bases - 1.4, T.bases - .4));
        nts.A.show([replaced.A], 1 - rib); oh.A.showAll(rib);
        const ura = ramp(t, T.uracil + 1.8, T.uracil + 3);
        nts.T.show(methyl, 1 - ura); nts.T.show([replaced.T], 1 - ura); h5.showAll(ura); oh.T.showAll(ura);
        for (const a of everything) a.update();
        chain.update();
        // The glycosidic bond's two atoms glow while it is named: A's alone, then every nucleotide's.
        const g = ramp(t, T.carbons + 1.6, T.carbons + 2.6) * (1 - ramp(t, T.nuc - .6, T.nuc));
        const g4 = ramp(t, T.glyco + 1, T.glyco + 2) * (1 - ramp(t, T.uracil - .6, T.uracil));
        if (Math.abs(g - lastTint) + Math.abs(g4 - lastTint4) > .01) {
          lastTint = g; lastTint4 = g4;
          for (const [k, a] of Object.entries(nts)) { a.untint(); a.tint(glycos[k], BOND_GOLD, .7 * (k === 'A' ? Math.max(g, g4) : g4)); }
        }
        plates.A.opacity(ramp(t, 1, 2) * (1 - ramp(t, T.carbons - .6, T.carbons + .4)) + ramp(t, T.bases + 1, T.bases + 2.2) * singles * dim.A);
        for (const k of ['G', 'C', 'T']) plates[k].opacity(ramp(t, T.bases + 1, T.bases + 2.2) * singles * dim[k]);
        sugarPlate.opacity(ramp(t, 1, 2) * (1 - ramp(t, T.nuc - .6, T.nuc + .4)));
      },
      annotate(t, {label, tag, bracket}) {
        const A = nts.A, W = (a, k) => toWorld(a === chain ? chainInner : a === nts.A || a === oh.A ? hold.A.inner : a === nts.G ? hold.G.inner : a === nts.C ? hold.C.inner : hold.T.inner, a.positions[k]);
        const atomW = (a, name, r = 0) => W(a, a.find(name, r));
        const baseW = (a, r = 0) => { const ks = a.select(k => a.residueOf[k] === r && a.part(k) === 'base' && a.elements[k] !== 'H'); return ks.reduce((s, k) => s.add(W(a, k)), V()).divideScalar(ks.length); };
        const sugarW = a => { const ks = RINGS.sugar[0].map(n => a.find(n)); return ks.reduce((s, k) => s.add(W(a, k)), V()).divideScalar(ks.length); };
        if (t < T.carbons) {
          if (t > 1.8) {
            label(baseW(A), 'Nitrogenous base', 'Adenine', {color: hex(BASES.A)});
            label(sugarW(A), 'Sugar', '2′-deoxyribose', {color: hex(SUGAR)});
            label(atomW(A, 'P'), 'Phosphate group', 'One phosphate', {color: hex(PHOSPHATE)});
          }
        } else if (t < T.nuc) {
          if (t > T.carbons + 2.4) {
            ["C1'", "C2'", "C3'", "C4'", "C5'"].forEach((n, i) => tag(atomW(A, n), `${i + 1}′`, {color: hex(SUGAR)}));
            label(atomW(A, 'N9').lerp(atomW(A, "C1'"), .5), 'Glycosidic bond', 'N9 of the base to C1′ of the sugar', {color: hex(BOND_GOLD)});
          }
        } else if (t < T.ribose) {
          if (t > T.nuc + 1.8 && t < T.nuc + 4.4) label(sugarW(A), 'Nucleoside', 'Base and sugar', {color: hex(SUGAR)});
          else if (t > T.nuc + 5.6) label(atomW(A, 'P'), 'Nucleotide', 'Phosphate on the 5′ carbon', {color: hex(PHOSPHATE)});
        } else if (t < T.bases) {
          if (t > T.ribose + 1 && t < T.ribose + 1.8) label(atomW(A, "C2'"), '2′-deoxyribose · DNA', 'No oxygen on the 2′ carbon', {color: hex(SUGAR)});
          else if (t > T.ribose + 3.1 && t < T.bases - 1.4) label(atomW(oh.A, "O2'"), 'Ribose · RNA', 'A hydroxyl on the 2′ carbon', {color: hex(ELEMENTS.O.color)});
        } else if (t < T.glyco) {
          if (t > T.bases + 2.6) {
            const b = Object.fromEntries(Object.entries(nts).map(([k, a]) => [k, baseW(a)]));
            for (const [k, p] of Object.entries(b)) tag(p, k, {color: hex(BASES[k])});
            const top = Math.min(...Object.values(b).map(p => p.y)) - 6;
            bracket(V(b.A.x - 4, top, b.A.z), V(b.G.x + 4, top, b.G.z), 'Purines · two rings');
            bracket(V(b.C.x - 4, top, b.C.z), V(b.T.x + 4, top, b.T.z), 'Pyrimidines · one ring');
          }
        } else if (t < T.uracil) {
          if (t > T.glyco + 2.2) {
            // G's bond, then C's, each named on its own side (one at a time, so both read clearly on a phone); each
            // base's letter on it.
            const mid = k => { const [n, c] = glycos[k]; return W(nts[k], n).lerp(W(nts[k], c), .5); };
            if (t < T.glyco + 5.6) label(mid('G'), 'Glycosidic bond · N9', 'A purine: N9 to C1′', {color: hex(BOND_GOLD), side: 'left'});
            else label(mid('C'), 'Glycosidic bond · N1', 'A pyrimidine: N1 to C1′', {color: hex(BOND_GOLD), side: 'right'});
            for (const k of ['G', 'C']) tag(baseW(nts[k]), k, {color: hex(BASES[k])});
          }
        } else if (t < T.chain) {
          const k7 = nts.T.find('C7');
          if (t > T.uracil + .6 && t < T.uracil + 1.8 && k7 >= 0) label(W(nts.T, k7), 'Methyl group', 'Thymine · DNA', {color: hex(BASES.T)});
          else if (t > T.uracil + 3.2) {
            label(W(h5, h5.find('H5')), 'Uracil · RNA', 'Hydrogen in place of the methyl group', {color: hex(BASES.U)});
            label(W(oh.T, oh.T.find("O2'")), 'Ribose', 'A hydroxyl on the 2′ carbon', {color: hex(ELEMENTS.O.color)});
          }
        } else if (t > T.chain + 2.2) {
          const c = chain, letters = R.map(r => r.letter);
          // The ends' labels outside the chain, left and right; the link's below it, to the left.
          label(atomW(c, 'P', 0), '5′ end', 'A free phosphate group', {color: hex(PHOSPHATE), side: 'left'});
          label(atomW(c, "O3'", last), '3′ end', 'A free hydroxyl group', {color: hex(ELEMENTS.O.color), side: 'right'});
          letters.forEach((l, r) => tag(baseW(c, r), l, {color: hex(BASES[l])}));
          // Under the chain, from its 3′ end back to its 5′ end so the bracket's ends turn up towards it and its
          // caption sits below.
          const bottom = Math.max(...c.positions.map((_, k) => W(c, k).y)) + 2.5;
          bracket(V(atomW(c, "O3'", last).x, bottom, 0), V(atomW(c, 'P', 0).x, bottom, 0), `5′ → 3′ · ${letters.join('')}`);
          label(atomW(c, "O3'", last - 1).lerp(atomW(c, 'P', last), .5), 'Sugar–phosphate link', 'From the 3′ carbon to the next 5′ carbon', {color: hex(SUGAR), side: 'right', below: true});
        }
      },
    };
  },
});
