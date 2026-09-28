// The library's chapters: each lists its proteins (text from the notes, in proteins*.mjs), the surface sets
// its structures come from, what each card shows, where each protein appears in the chapter's scenes and
// how its sources are credited. A part names a mesh in one of the chapter's sets (by `structure` as well
// when a set holds several structures); `group` gathers parts under one legend entry; `link` opens another
// protein. A chapter's models can be a function of its loaded sets, for parts listed in the set itself.
import * as THREE from 'three';
import {PALETTE} from '../shared/molecules.mjs';
import * as bacterial from './proteins.mjs';
import * as eukaryotic from './proteins_ch3.mjs';
import {INFO} from '../transcription_3d/inspect.mjs';

const FILM = '../transcription_3d/', EUK = '../eukaryotic_transcription/';
const lighten = (c, k = .12) => new THREE.Color(c).lerp(new THREE.Color(0xffffff), k).getHex();
const shades = (a, b, n) => Array.from({length: n}, (_, i) => new THREE.Color(a).lerp(new THREE.Color(b), n > 1 ? i / (n - 1) : 0).getHex());

// ---------- Bacterial transcription ----------
// Parts name a mesh in one of three surface sets: the film's RNAP, NusG and Rho (8E6X/8E6W), its σ70
// and NusA (4YLN, 6FLQ, aligned to the same core) and the other σ factors (AlphaFold models).
const SIGMA = {sigma70: 0xe987a3, sigma54: 0xd66a8e, sigmaS: 0xe595ad, sigma32: 0xde7390, sigmaF: 0xdb93aa, sigmaE: 0xc97ba3, fecI: 0xd9889f};
const SUB = {
  beta: {mesh: 'β', color: PALETTE.beta, label: 'β', link: 'beta'},
  betaPrime: {mesh: 'β′', color: PALETTE.betaPrime, label: 'β′', link: 'betaPrime'},
  alphaI: {mesh: 'α I', color: PALETTE.alpha, label: 'α (I)', link: 'alpha'},
  alphaII: {mesh: 'α II', color: PALETTE.alpha2, label: 'α (II)', link: 'alpha'},
  omega: {mesh: 'ω', color: PALETTE.omega, label: 'ω', link: 'omega'},
  sigma70: {set: 'acc', mesh: 'σ70', color: SIGMA.sigma70, label: 'σ70', link: 'sigma70'},
};
const CORE = [SUB.beta, SUB.betaPrime, SUB.alphaI, SUB.alphaII, SUB.omega];

const BACTERIAL = {
  id: 'bacterial', tab: 'Bacterial', noun: 'bacterial',
  eyebrow: 'Prokaryotic transcription', heading: 'The proteins that<br>make RNA.',
  lede: 'RNA polymerase, the sigma factors that direct it to promoters, and the factors that regulate elongation and end transcription.',
  links: [{href: FILM + 'index.html', text: 'The transcription cycle'}],
  notes: FILM + 'notes.html', ...bacterial,
  sets: {film: [FILM + 'assets/structure.json', FILM + 'assets/molecular_surfaces.bin'], acc: [FILM + 'assets/accessories.json', FILM + 'assets/accessories.bin'],
    sigma: ['assets/sigma_models.json', 'assets/sigma_models.bin']},
  defaultSet: 'film',
  models: {
    core: {parts: CORE, accent: 0x6fb3c0, wide: true},
    holoenzyme: {parts: [...CORE, SUB.sigma70], accent: 0xe7a3b6, wide: true},
    beta: {parts: [SUB.beta], accent: 0x56c2b1},
    betaPrime: {parts: [SUB.betaPrime], accent: 0x7fa3e3},
    alpha: {parts: [SUB.alphaI, SUB.alphaII], accent: 0xd6c496},
    omega: {parts: [SUB.omega], accent: 0xc2bdb2},
    sigma70: {parts: [{...SUB.sigma70, link: null}], accent: 0xf094ae},
    ...Object.fromEntries(['sigma54', 'sigmaS', 'sigma32', 'sigmaF', 'sigmaE', 'fecI'].map(id =>
      [id, {parts: [{set: 'sigma', id, color: SIGMA[id]}], accent: lighten(SIGMA[id])}])),
    nusA: {parts: [{set: 'acc', mesh: 'NusA', color: PALETTE.nusA}], accent: 0xb9d56b},
    nusG: {parts: [{mesh: 'NusG NGN', color: PALETTE.nusG, label: 'N-terminal domain'}, {mesh: 'NusG KOW', color: PALETTE.nusGKow, label: 'C-terminal (KOW) domain'}], accent: 0xc08a4c},
    rho: {parts: 'ABCDEF'.split('').map((c, i) => ({mesh: `Rho ${c}`, color: PALETTE.rho[i], label: `Subunit ${i + 1}`})), accent: 0x9d7cc0, legend: false},
  },
  // Proteins whose structure shares the core enzyme's coordinates can be shown inside it, faintly.
  context: {beta: CORE, betaPrime: CORE, alpha: CORE, omega: CORE, sigma70: CORE, nusA: CORE, nusG: CORE},
  contextLabel: {sigma70: 'On the core enzyme', nusA: 'On RNA polymerase', nusG: 'On RNA polymerase'}, contextDefault: 'In the core enzyme',
  sources: {
    '8E6X': 'PDB 8E6X · E. coli Rho-dependent pre-termination complex, RNA polymerase and NusG (Molodtsov et al., Nature 2023)',
    '8E6W': 'PDB 8E6W · E. coli Rho-dependent pre-termination complex, Rho (Molodtsov et al., Nature 2023)',
    '4YLN': 'PDB 4YLN · E. coli transcription initiation complex (Zuo and Steitz, Mol Cell 2015)',
    '6FLQ': 'PDB 6FLQ · E. coli RNA polymerase paused elongation complex bound to NusA (Guo et al., Mol Cell 2018)',
  },
  // Where each protein appears in the transcription film: [chapter, time, route].
  seeAlsoTitle: 'In the transcription cycle',
  seeAlso: Object.fromEntries(Object.entries({
    core: [['Core enzyme', 0]], holoenzyme: [['Sigma binding', 9], ['Closed complex', 34]],
    beta: INFO.beta.at, betaPrime: INFO.betaPrime.at, alpha: INFO.alphaI.at, omega: INFO.omega.at,
    sigma70: INFO.sigma.at, nusA: INFO.nusA.at, nusG: INFO.nusG.at, rho: INFO.rho.at,
  }).map(([id, at]) => [id, at.map(([name, t, route]) => [name, `${FILM}index.html?t=${t}${route ? `&path=${route}` : ''}`])])),
};

// ---------- Eukaryotic transcription ----------
// The three yeast polymerases come from the scene's set (superposed through their shared subunits);
// everything else from the chapter's library set: the TFIID-based preinitiation complex (7EGB: human
// factors with pig RNAP II), in
// which TBP and each basal factor can be shown in place, yeast Core Factor (the counterpart of SL1), UBF
// (AlphaFold), the yeast 5S rRNA gene with TFIIIA, TFIIIC and Brf1–TBP (8FFZ), RNAP III with TFIIIB
// (6F44), the nucleosome core particle and three DNA methylation enzymes on DNA.
const ROLE = {'beta-prime-like': PALETTE.betaPrime, 'beta-like': PALETTE.beta, 'alpha-like': PALETTE.alpha, shared: 0xe0795f};
const ROLE_GROUP = {'beta-prime-like': 'Related to β′', 'beta-like': 'Related to β', 'alpha-like': 'Related to α', shared: 'Common to all three'};
const OWN = {pol1: 0xa99bc4, pol2: 0x9fb0b8, pol3: 0xc9b48f};
const OWN_GROUP = {pol1: 'Specific to RNAP I', pol2: 'Specific to RNAP II', pol3: 'Specific to RNAP III'};
const TAFS = ['TAF1', 'TAF2', 'TAF3', 'TAF4', 'TAF5', 'TAF6', 'TAF7', 'TAF8', 'TAF9', 'TAF10', 'TAF11', 'TAF12', 'TAF13'];
const C = {
  tbp: PALETTE.tbp, tfiia: 0x9a8fc4, tfiib: 0xe07f6b, rap74: 0x5b9fd0, rap30: 0x86bde0, tfiieA: 0xc39bdc, tfiieB: 0xa77fc6,
  dna: 0x72cdeb, rnap: 0x9fb0b8, coreFactor: [0x7fb59a, 0x98c4a8, 0x6a9f86], ubf: 0x7fb6d6, tfiiia: 0xe3a07a,
  tauA: [0x8aa0d6, 0x7b91c9, 0x9cb0e0], tauB: [0x6f86c2, 0x6279b3, 0x8095cf], brf1: 0xd77f9b, bdp1: 0xb56f8d,
  h3: 0x6c8fd6, h4: 0x5fb39b, h2a: 0xd9a35a, h2b: 0xd47d6a, dnmt1: 0x9f86d0, dnmt3a: 0x8c7bc2, dnmt3l: 0xb3a6d9, tet: 0x62b6a6,
};
const TAF_COLOURS = shades(0x6f9f7a, 0xb3cf9f, TAFS.length), TFIIH_COLOURS = shades(0xc9a23f, 0xe6c979, 7), CAK_COLOURS = [0xc0714e, 0xd08a62, 0xa9603f];

const lib = (structure, mesh, color, extra = {}) => ({set: 'lib', structure, mesh, color, label: mesh, ...extra});
const PIC = {
  tbp: [lib('pic', 'TBP', C.tbp, {link: 'tbp'})],
  tfiid: TAFS.map((n, i) => lib('pic', n, TAF_COLOURS[i], {group: 'TAFs'})),
  tfiia: [lib('pic', 'TFIIA', C.tfiia)],
  tfiib: [lib('pic', 'TFIIB', C.tfiib, {link: 'tfiib'})],
  tfiif: [lib('pic', 'RAP74', C.rap74, {link: 'tfiif'}), lib('pic', 'RAP30', C.rap30, {link: 'tfiif'})],
  tfiie: [lib('pic', 'TFIIEα', C.tfiieA, {link: 'tfiie'}), lib('pic', 'TFIIEβ', C.tfiieB, {link: 'tfiie'})],
  tfiih: [...['XPB', 'XPD', 'p62', 'p52', 'p44', 'p34', 'p8'].map((n, i) => lib('pic', n, TFIIH_COLOURS[i], {group: 'Core TFIIH', link: 'tfiih'})),
    ...['CDK7', 'Cyclin H', 'MAT1'].map((n, i) => lib('pic', n, CAK_COLOURS[i], {group: 'Kinase module', link: 'tfiih'}))],
  rnap: [lib('pic', 'RNAP II', C.rnap, {link: 'rnap2'})], dna: [lib('pic', 'Promoter DNA', C.dna)],
};
const WHOLE_PIC = Object.values(PIC).flat();
const FIVE_S = {
  tfiiia: [lib('fiveS', 'TFIIIA', C.tfiiia, {link: 'tfiiia'})],
  tfiiic: [...['τ131', 'τ95', 'τ55'].map((n, i) => lib('fiveS', n, C.tauA[i], {group: 'τA', link: 'tfiiic'})), ...['τ138', 'τ91', 'τ60'].map((n, i) => lib('fiveS', n, C.tauB[i], {group: 'τB', link: 'tfiiic'}))],
  tfiiib: [lib('fiveS', 'Brf1', C.brf1, {link: 'tfiiib'}), lib('fiveS', 'TBP', C.tbp, {link: 'tbp'})],
  dna: [lib('fiveS', '5S rRNA gene', C.dna)],
};
const POL3_PIC = [lib('pol3pic', 'RNAP III', C.rnap, {link: 'rnap3'}), lib('pol3pic', 'Promoter DNA', C.dna)];
const alone = parts => parts.map(p => ({...p, link: null}));

function polymerase(sets, id) {
  return sets.pols.meta.meshes.filter(r => r.structure === id).map(r => ({
    set: 'pols', structure: id, mesh: r.name, label: r.name, color: ROLE[r.role] ?? OWN[id], group: ROLE_GROUP[r.role] ?? OWN_GROUP[id],
    link: id === 'pol2' && r.name === 'Rpb1' ? 'rpb1' : null,
  }));
}

const EUKARYOTIC = {
  id: 'eukaryotic', tab: 'Eukaryotic', noun: 'eukaryotic',
  eyebrow: 'Eukaryotic transcription', heading: 'Three polymerases<br>and their factors.',
  lede: 'The three RNA polymerases, the basal transcription factors that bring them to their promoters, and the chromatin and DNA methylation that control whether genes are transcribed.',
  links: [{href: EUK + 'index.html', text: 'Eukaryotic transcription'}, {href: FILM + 'index.html', text: 'The transcription cycle'}],
  notes: EUK + 'notes.html', ...eukaryotic,
  sets: {pols: [EUK + 'assets/polymerases.json', EUK + 'assets/polymerases.bin'], lib: [EUK + 'assets/library.json', EUK + 'assets/library.bin']},
  defaultSet: 'lib',
  models: sets => ({
    rnap1: {parts: polymerase(sets, 'pol1'), accent: lighten(OWN.pol1), wide: true},
    rnap2: {parts: polymerase(sets, 'pol2'), accent: lighten(OWN.pol2), wide: true},
    rnap3: {parts: polymerase(sets, 'pol3'), accent: lighten(OWN.pol3), wide: true},
    rpb1: {parts: [{set: 'pols', structure: 'pol2', mesh: 'Rpb1', label: 'Rpb1', color: PALETTE.betaPrime}], accent: 0x7fa3e3},
    tbp: {parts: alone(PIC.tbp), accent: lighten(C.tbp)},
    tfiid: {parts: [...PIC.tbp, ...PIC.tfiid], accent: lighten(TAF_COLOURS[6]), wide: true},
    tfiib: {parts: alone(PIC.tfiib), accent: lighten(C.tfiib)},
    tfiif: {parts: alone(PIC.tfiif), accent: lighten(C.rap74)},
    tfiie: {parts: alone(PIC.tfiie), accent: lighten(C.tfiieA)},
    tfiih: {parts: alone(PIC.tfiih), accent: lighten(TFIIH_COLOURS[3])},
    sl1: {parts: ['Rrn6', 'Rrn7', 'Rrn11'].map((n, i) => lib('coreFactor', n, C.coreFactor[i])), accent: lighten(C.coreFactor[0])},
    ubf: {parts: [lib('ubf', 'UBF', C.ubf)], accent: lighten(C.ubf)},
    tfiiia: {parts: alone(FIVE_S.tfiiia), accent: lighten(C.tfiiia)},
    tfiiib: {parts: [lib('pol3pic', 'TBP', C.tbp, {link: 'tbp'}), lib('pol3pic', 'Brf1', C.brf1), lib('pol3pic', 'Bdp1', C.bdp1)], accent: lighten(C.brf1)},
    tfiiic: {parts: alone(FIVE_S.tfiiic), accent: lighten(C.tauA[0])},
    nucleosome: {parts: [['H3', C.h3], ['H4', C.h4], ['H2A', C.h2a], ['H2B', C.h2b], ['DNA', C.dna]].map(([n, c]) => lib('nucleosome', n, c)), accent: lighten(C.h3)},
    dnmt1: {parts: [lib('dnmt1', 'DNMT1', C.dnmt1), lib('dnmt1', 'DNA', C.dna)], accent: lighten(C.dnmt1)},
    dnmt3a: {parts: [lib('dnmt3a', 'DNMT3A', C.dnmt3a), lib('dnmt3a', 'DNMT3L', C.dnmt3l), lib('dnmt3a', 'DNA', C.dna)], accent: lighten(C.dnmt3a)},
    tet: {parts: [lib('tet2', 'TET2', C.tet), lib('tet2', 'DNA', C.dna)], accent: lighten(C.tet)},
  }),
  context: sets => ({
    rpb1: polymerase(sets, 'pol2'),
    tbp: WHOLE_PIC, tfiid: WHOLE_PIC, tfiib: WHOLE_PIC, tfiif: WHOLE_PIC, tfiie: WHOLE_PIC, tfiih: WHOLE_PIC,
    tfiiia: Object.values(FIVE_S).flat(), tfiiic: Object.values(FIVE_S).flat(),
    tfiiib: POL3_PIC,
  }),
  contextLabel: {rpb1: 'In RNAP II', tfiiia: 'On a 5S rRNA gene', tfiiic: 'On a 5S rRNA gene', tfiiib: 'With RNAP III on its promoter'},
  contextDefault: 'In the preinitiation complex',
  sources: {
    '9QEB': 'PDB 9QEB · yeast RNA polymerase II elongation complex (Li et al., Mol Cell 2026)',
    '6HKO': 'PDB 6HKO · yeast RNA polymerase I elongation complex (Tafur et al., eLife 2019)',
    '7Z1M': 'PDB 7Z1M · yeast RNA polymerase III elongation complex (Girbig et al., Cell Rep 2022)',
    '7EGB': 'PDB 7EGB · TFIID-based preinitiation complex on a core promoter: human factors with pig RNA polymerase II (Chen et al., Science 2021)',
    '5O7X': 'PDB 5O7X · yeast Core Factor, the counterpart of SL1; unlike SL1 it contains no TBP (Engel et al., Cell 2017)',
    'AF-P17480-F1': 'AlphaFold DB model AF-P17480-F1 (UniProt P17480), residues 20–659 · Jumper et al., Nature 2021; Varadi et al., Nucleic Acids Res 2024 · CC BY 4.0',
    '8FFZ': 'PDB 8FFZ · yeast TFIIIA, TFIIIC and Brf1–TBP on a 5S rRNA gene (Talyzina et al., Mol Cell 2023)',
    '6F44': 'PDB 6F44 · yeast RNA polymerase III with TFIIIB on promoter DNA (Vorländer et al., Nature 2018)',
    '1KX5': 'PDB 1KX5 · nucleosome core particle (Davey et al., J Mol Biol 2002)',
    '6X9I': 'PDB 6X9I · human DNMT1 on hemimethylated DNA (Pappalardi et al., Nat Cancer 2021)',
    '5YX2': 'PDB 5YX2 · human DNMT3A–DNMT3L on DNA (Zhang et al., Nature 2018)',
    '4NM6': 'PDB 4NM6 · human TET2 on methylated DNA (Hu et al., Cell 2013)',
  },
  seeAlsoTitle: 'In the scenes',
  seeAlso: {
    rnap1: [['Three polymerases', EUK + 'polymerases.html?t=0'], ['Many subunits', EUK + 'polymerases.html?t=9'], ['Shared subunits', EUK + 'polymerases.html?t=19']],
    rnap2: [['Three polymerases', EUK + 'polymerases.html?t=0'], ['β′ and β', EUK + 'polymerases.html?t=28'], ['No σ', EUK + 'polymerases.html?t=38'], ['The CTD', EUK + 'polymerases.html?t=47'], ['A poised gene', EUK + 'gene_states.html?t=23'], ['Leaving the promoter', EUK + 'gene_states.html?t=59'], ['An enhancer', EUK + 'enhancers.html?t=0']],
    rnap3: [['Three polymerases', EUK + 'polymerases.html?t=0'], ['Many subunits', EUK + 'polymerases.html?t=9'], ['Shared subunits', EUK + 'polymerases.html?t=19']],
    rpb1: [['β′ and β', EUK + 'polymerases.html?t=28'], ['The CTD', EUK + 'polymerases.html?t=47']],
    tbp: [['The TATA box', EUK + 'tbp.html?t=0'], ['Minor groove', EUK + 'tbp.html?t=10'], ['About 80°', EUK + 'tbp.html?t=28'], ['Staying at the promoter', EUK + 'gene_states.html?t=59'], ['TET enzymes', EUK + 'methylation.html?t=60']],
    tfiid: [['Binding first', EUK + 'gene_states.html?t=23'], ['A universal factor', EUK + 'tbp.html?t=48'], ['Activators', EUK + 'enhancers.html?t=58']], sl1: [['A universal factor', EUK + 'tbp.html?t=48']],
    tfiiib: [['A universal factor', EUK + 'tbp.html?t=48']],
    nucleosome: [['Closed chromatin', EUK + 'gene_states.html?t=0'], ['Open chromatin', EUK + 'gene_states.html?t=11'], ['An enhancer', EUK + 'enhancers.html?t=0'], ['Near or far', EUK + 'enhancers.html?t=22']],
    dnmt1: [['Kept after replication', EUK + 'methylation.html?t=31']], dnmt3a: [['De novo methylation', EUK + 'methylation.html?t=50']],
    tet: [['TET enzymes', EUK + 'methylation.html?t=60']],
  },
};

export const CHAPTERS = [BACTERIAL, EUKARYOTIC];
