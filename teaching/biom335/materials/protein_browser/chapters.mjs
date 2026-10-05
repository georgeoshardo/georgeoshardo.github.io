// The library's chapters: each lists its proteins (text from the notes, in proteins*.mjs), the surface sets
// its structures come from, what each card shows, where each protein appears in the chapter's scenes and
// how its sources are credited. A part names a mesh in one of the chapter's sets (by `structure` as well
// when a set holds several structures); `group` gathers parts under one legend entry; `link` opens another
// protein. A chapter's models can be a function of its loaded sets, for parts listed in the set itself. A model
// with style 'strands' is a nucleic acid drawn as the scenes draw DNA and RNA (browser.mjs, nucleicParts). `orient`
// turns a model to show it best: {to: 'up'} stands its long axis up (a duplex), {to: 'view'} turns it towards the
// viewer (down a ring), {axis: 'short'} uses its shortest axis instead (the face of a flat molecule); `part` takes
// the axis from one part or a list of parts (the strand through a ring), {to: 'front'} brings them round in
// front of the rest (DNA in its enzyme's cleft), and `turn` then spins the model about the upright (radians).
import * as THREE from 'three';
import {PALETTE} from '../shared/molecules.mjs';
import {STRANDS} from '../shared/strands.mjs';
import * as genes from './proteins_ch1.mjs';
import * as bacterial from './proteins.mjs';
import * as eukaryotic from './proteins_ch3.mjs';
import * as rnaSplicing from './proteins_ch4.mjs';
import {SPLICING} from '../shared/rna.mjs';
import {INFO} from '../transcription_3d/inspect.mjs';

const GENES = '../genes_are_dna/', FILM = '../transcription_3d/', EUK = '../eukaryotic_transcription/';
const lighten = (c, k = .12) => new THREE.Color(c).lerp(new THREE.Color(0xffffff), k).getHex();
const shades = (a, b, n) => Array.from({length: n}, (_, i) => new THREE.Color(a).lerp(new THREE.Color(b), n > 1 ? i / (n - 1) : 0).getHex());

// ---------- Genes are DNA ----------
// Everything comes from the chapter's library set (../genes_are_dna/assets/library.*). The three nucleic acids are
// drawn as the scenes draw DNA and RNA (style 'strands'), from the strands of the B-DNA dodecamer (355D) and the
// hybridisation scene's RNA–DNA decamer (1FIX), and the atoms of yeast tRNA-Phe (1EHZ). The enzymes are surfaces:
// the replication scene's T7 DNA polymerase (1T7P) and helicase (6N7I), split into their chains; HIV-1 reverse
// transcriptase (4PQU), the poliovirus polymerase (3OL6) and human thymidine kinase 1 (1XBT). Colours follow the
// scenes: DNA sky blue and ivory, RNA orange (the hybrid as in the hybridisation scene), the replication scene's
// polymerase, helicase, parental (blue) and new (gold) strands.
const G = {
  dna: STRANDS.template, rna: STRANDS.rna, rnaRung: 0xd7925c, newRna: 0xffc68f,
  polymerase: 0xe0937a, thioredoxin: 0xc7b98f, helicase: 0x5cbf9a, parental: 0x4f7fe0, daughter: 0xf1dcaa,
  p66: 0xd98aa6, p51: 0xb58cc4, rdrp: 0xa6c46a, tk: 0x7f93d2,
};
const HELICASE = [0, 3, 1, 4, 2, 5].map(i => shades(0x3f9f7c, 0x9adfc0, 6)[i]), TK = [0, 2, 1, 3].map(i => shades(0x4d65b8, 0x8698d8, 4)[i]);
const g = (structure, mesh, color, extra = {}) => ({structure, mesh, color, label: mesh, ...extra});

const GENES_ARE_DNA = {
  id: 'genes', tab: 'Genes are DNA', label: 'Genes are DNA', title: 'Genes are DNA · Protein library',
  eyebrow: 'Genes are DNA', heading: 'Nucleic acids and<br>their enzymes.',
  lede: 'The DNA double helix and base-paired RNA, the enzymes that replicate DNA at the replication fork, the viral enzymes that copy RNA genomes, and thymidine kinase, whose gene can be transfected into cells.',
  links: [{href: GENES + 'index.html', text: 'Genes are DNA'}],
  notes: GENES + 'notes.html', ...genes,
  sets: {lib: [GENES + 'assets/library.json', GENES + 'assets/library.bin']},
  defaultSet: 'lib',
  models: {
    bdna: {style: 'strands', duplex: {structure: 'bdna', strands: ['a', 'b']}, labels: ['Strand 1', 'Strand 2'], accent: lighten(STRANDS.template), orient: {to: 'up'}},
    trna: {style: 'strands', fold: {structure: 'trna', atoms: 'tRNA'}, colors: [G.rna], rungs: [G.rnaRung], accent: lighten(G.rna), orient: {axis: 'short', to: 'view'}},
    hybrid: {style: 'strands', duplex: {structure: 'hybrid', strands: ['rna', 'dna']}, labels: ['RNA strand', 'DNA strand'], colors: [G.rna, G.dna],
      widths: [1.05, .95], rungs: [G.rnaRung, STRANDS.rung.template], accent: lighten(G.rna), orient: {to: 'up', turn: 1.6}},
    dnapol: {parts: [g('pol', 'DNA polymerase', G.polymerase), g('pol', 'Thioredoxin', G.thioredoxin),
      g('pol', 'Template strand', G.parental), g('pol', 'New strand', G.daughter)], accent: lighten(G.polymerase), orient: {part: ['Template strand', 'New strand'], to: 'front'}},
    helicase: {parts: [...HELICASE.map((c, i) => g('helicase', `Subunit ${i + 1}`, c, {group: 'Helicase subunits'})),
      g('helicase', 'DNA strand', G.parental)], accent: lighten(G.helicase), orient: {part: 'DNA strand', to: 'view'}},
    rdrp: {parts: [g('rdrp', 'Polymerase', G.rdrp), g('rdrp', 'RNA template', G.rna), g('rdrp', 'New RNA strand', G.newRna)], accent: lighten(G.rdrp)},
    rt: {parts: [g('rt', 'p66', G.p66), g('rt', 'p51', G.p51), g('rt', 'RNA template', G.rna), g('rt', 'New DNA strand', G.dna)], accent: lighten(G.p66), orient: {part: 'RNA template', to: 'up'}},
    tk: {parts: TK.map((c, i) => g('tk', `Subunit ${i + 1}`, c)), accent: lighten(G.tk), legend: false, orient: {axis: 'short', to: 'view'}},
  },
  context: {}, contextLabel: {}, contextDefault: '',
  // Related entries of other chapters, by the names this chapter gives them.
  relatedNames: {core: 'RNA polymerase'},
  sources: {
    '355D': 'PDB 355D · B-DNA dodecamer CGCGAATTCGCG (Shui et al., Biochemistry 1998)',
    '1EHZ': 'PDB 1EHZ · yeast phenylalanine tRNA (Shi and Moore, RNA 2000)',
    '1FIX': 'PDB 1FIX · RNA–DNA hybrid decamer (Horton and Finzel, J Mol Biol 1996)',
    '1T7P': 'PDB 1T7P · bacteriophage T7 DNA polymerase (gp5) with E. coli thioredoxin on a primer–template (Doublié et al., Nature 1998)',
    '6N7I': 'PDB 6N7I · bacteriophage T7 gp4 helicase on single-stranded DNA (Gao et al., Science 2019)',
    '4PQU': 'PDB 4PQU · HIV-1 reverse transcriptase on an RNA template with a DNA primer and dATP (Das et al., Nucleic Acids Res 2014)',
    '3OL6': 'PDB 3OL6 · poliovirus RNA-dependent RNA polymerase (3Dpol) elongation complex (Gong and Peersen, PNAS 2010)',
    '1XBT': 'PDB 1XBT · human thymidine kinase 1 (Welin et al., PNAS 2004)',
  },
  // Where each molecule appears in the chapter's pages: its scenes (tests/proteins_ch1.test.mjs checks that each
  // time is the start of the step named) and the hub's central dogma, which names the enzymes.
  seeAlsoTitle: 'In the scenes',
  seeAlso: {
    bdna: [['A double helix', GENES + 'double_helix.html?t=0'], ['Antiparallel', GENES + 'double_helix.html?t=28'], ['Ten to a turn', GENES + 'double_helix.html?t=57'],
      ['Two grooves', GENES + 'double_helix.html?t=70'], ['Charged backbone', GENES + 'double_helix.html?t=82']],
    dnapol: [['Polymerases and helicase', GENES + 'replication.html?t=32'], ['Leading and lagging', GENES + 'replication.html?t=43'], ['The central dogma', GENES + 'index.html#dogma-title']],
    helicase: [['Polymerases and helicase', GENES + 'replication.html?t=32']],
    hybrid: [['DNA–RNA heteroduplex', GENES + 'hybridisation.html?t=55'], ['Central to all', GENES + 'hybridisation.html?t=70']],
    rdrp: [['RNA replication', GENES + 'dna_or_rna.html?t=46'], ['The central dogma', GENES + 'index.html#dogma-title']],
    rt: [['Reverse transcription', GENES + 'dna_or_rna.html?t=59'], ['The central dogma', GENES + 'index.html#dogma-title']],
    tk: [['Cells without TK', GENES + 'transfection.html?t=0'], ['Thymidine kinase', GENES + 'transfection.html?t=33'], ['Selection: a colony', GENES + 'transfection.html?t=56']],
  },
};

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

// ---------- RNA splicing and processing ----------
// Sets shared with the chapter's scenes, as they draw these molecules: the cap scene's (capping enzyme on RNA
// polymerase II, 8P4B; the cap-binding complex, 1N52; eIF4E, 1IPC; their caps as atoms), the snRNPs scene's (Sm ring
// 4WZJ, superposed on the tri-snRNP's U4 ring; Lsm ring 4M7A; U2 snRNP 7EVO; tri-snRNP 6QW6) and the spliceosome
// scene's P complex (6QDV, coarse); and the library's own (U1 snRNP 4PJO, SF1 1K1G, U2AF 2G4B and 1JMT, SRSF1 2M8D,
// Dbr1 5K78, the exon junction complex 2J0S, Bcl-xL 1MAZ, CaMKIIδ 8USO). Proteins are surfaces; every RNA, and the DNA
// in RNA polymerase II, is drawn from its exported strands as the scenes draw it; the caps atom by atom. Colours are
// the chapter's (SPLICING: each snRNP's snRNA and proteins in its colour, rings in theirs, exon and intron).
const RNA = '../rna_splicing/', S = SPLICING;
const shade = (c, k) => k >= 0 ? lighten(c, k) : new THREE.Color(c).multiplyScalar(1 + k).getHex();
// Seven shades round a ring, alternately lighter and deeper (as the snRNPs scene shades its rings).
const RING = [.3, -.22, .12, -.36, .42, -.1, -.3];
const SM = ['SmB', 'SmD1', 'SmD2', 'SmD3', 'SmE', 'SmF', 'SmG'], LSM = [2, 3, 4, 5, 6, 7, 8].map(k => `Lsm${k}`);
const R = {
  // The cap scene's colours for the capping enzyme, CBP80, CBP20 and eIF4E; RNA polymerase II in the eukaryotic tab's
  // blue-grey, made deeper so that it does not read as white.
  gt: 0xc890d8, pol: [0x667d8e, 0x5a6f80, 0x748b9c], cbp80: 0x6c79b0, cbp20: 0x3f9a8a, eif4e: 0x4f7fc9,
  tri: 0x9c8fa8, ntc: 0x86a39b, factors: 0x737b88, dbr1: 0x58a6c2,
  eif4a3: 0x8f9fdc, magoh: 0xd9a066, y14: 0xb894d8, btz: 0x86c48f, bclxl: 0x7fc79a, kinase: 0xd98b6f, hub: 0x9fb4d8,
};
const on = (set, structure, mesh, color, extra = {}) => ({set, structure, mesh, color, label: mesh, ...extra});
const rna = (set, structure, strand, color, extra = {}) => ({set, structure, strand, color, label: strand, ...extra});
const ring = (set, structure, names, color, group, extra = {}) => names.map((n, i) => on(set, structure, n, shade(color, RING[i]), {group, ...extra}));
const POL2 = [on('cap', 'pol', 'Rpb1', R.pol[0]), on('cap', 'pol', 'Rpb2', R.pol[1]), on('cap', 'pol', 'Other Pol II subunits', R.pol[2])]
  .map(p => ({...p, group: 'RNA polymerase II', link: 'rnap2'}));
const TRI = [on('snrnps', 'tri', 'Prp8', S.U5, {group: 'U5 proteins'}), on('snrnps', 'tri', 'Brr2', lighten(S.U5, .3), {group: 'U5 proteins'}),
  on('snrnps', 'tri', 'Snu114', shade(S.U5, -.28), {group: 'U5 proteins'}), on('snrnps', 'tri', 'U5 40K and Dib1', lighten(S.U5, .52), {group: 'U5 proteins'}),
  on('snrnps', 'tri', 'U4/U6 proteins', S.U4), on('snrnps', 'tri', 'U5 Sm ring', S.Sm, {group: 'Sm rings', link: 'smring'}),
  on('snrnps', 'tri', 'U4 Sm ring', S.Sm, {group: 'Sm rings', link: 'smring'}), ...LSM.map(n => on('snrnps', 'tri', n, S.Lsm, {group: 'Lsm ring', link: 'lsmring'})),
  on('snrnps', 'tri', 'Tri-snRNP proteins', R.tri)];

const RNA_SPLICING = {
  id: 'rna', tab: 'RNA splicing', label: 'RNA splicing', title: 'RNA splicing · Protein library',
  eyebrow: 'RNA splicing and processing', heading: 'Capping, splicing<br>and their products.',
  lede: 'The enzyme that caps new RNA and the proteins that bind its cap, the snRNPs and the spliceosome that remove introns, the factors that first recognise the splice sites, and proteins whose forms are chosen by alternative splicing.',
  links: [{href: RNA + 'index.html', text: 'RNA splicing and processing'}],
  notes: RNA + 'notes.html', ...rnaSplicing,
  sets: {lib: [RNA + 'assets/library.json', RNA + 'assets/library.bin'], cap: [RNA + 'assets/cap.json', RNA + 'assets/cap.bin'],
    snrnps: [RNA + 'assets/snrnps.json', RNA + 'assets/snrnps.bin'], p: [RNA + 'assets/spliceosome_p.json', RNA + 'assets/spliceosome_p.bin']},
  defaultSet: 'lib',
  models: {
    capping: {parts: [on('cap', 'pol', 'Capping enzyme', R.gt), ...POL2],
      strands: [rna('cap', 'pol', 'template', STRANDS.template, {label: 'Template strand', group: 'DNA', width: 1}),
        rna('cap', 'pol', 'nontemplate', STRANDS.coding, {label: 'Non-template strand', group: 'DNA', width: .8}),
        rna('cap', 'pol', 'rna', S.exon, {label: 'RNA'})], accent: lighten(R.gt), wide: true},
    cbc: {parts: [on('cap', 'cbc', 'CBP80', R.cbp80), on('cap', 'cbc', 'CBP20', R.cbp20)],
      ligands: [{set: 'cap', structure: 'cbc', atoms: 'cbc-cap', label: 'Cap (m7GpppG)', color: S.cap}], accent: lighten(R.cbp80), orient: {part: 'Cap (m7GpppG)', to: 'front'}},
    eif4e: {parts: [on('cap', 'eif4e', 'eIF4E', R.eif4e)], ligands: [{set: 'cap', structure: 'eif4e', atoms: 'eif4e-cap', label: 'Cap (m7GTP)', color: S.cap}], accent: lighten(R.eif4e), orient: {part: 'Cap (m7GTP)', to: 'front'}},
    smring: {parts: ring('snrnps', 'sm', SM, S.Sm), strands: [rna('snrnps', 'sm', 'U4 Sm site', S.U4, {label: 'U4 snRNA'})], accent: lighten(S.Sm), orient: {part: 'U4 snRNA', to: 'view'}},
    lsmring: {parts: ring('snrnps', 'lsm', LSM, S.Lsm), strands: [rna('snrnps', 'lsm', 'U6 3′ end', S.U6, {label: 'U6 snRNA 3′ end'})], accent: lighten(S.Lsm, .3), orient: {axis: 'short', to: 'view'}},
    u2snrnp: {parts: [on('snrnps', 'u2', 'SF3b', S.U2), on('snrnps', 'u2', 'SF3a', shade(S.U2, -.26)), on('snrnps', 'u2', 'U2A′ and U2B″', lighten(S.U2, .4)),
      on('snrnps', 'u2', 'HTATSF1 and DDX46', shade(S.U2, -.42)), on('snrnps', 'u2', 'U2 Sm ring', S.Sm, {link: 'smring'})],
      strands: [rna('snrnps', 'u2', 'U2 snRNA', lighten(S.U2, .15))], accent: lighten(S.U2, .2)},
    trisnrnp: {parts: TRI, strands: [rna('snrnps', 'tri', 'U4 snRNA', S.U4), rna('snrnps', 'tri', 'U6 snRNA', S.U6), rna('snrnps', 'tri', 'U5 snRNA', lighten(S.U5, .2))],
      accent: lighten(S.U4, .2), wide: true},
    spliceosome: {parts: [on('p', 'p', 'U2 snRNP', S.U2, {link: 'u2snrnp'}), on('p', 'p', 'U2 Sm ring', S.Sm, {link: 'smring', group: 'Sm rings'}),
      on('p', 'p', 'U5 snRNP', S.U5), on('p', 'p', 'U5 Sm ring', S.Sm, {link: 'smring', group: 'Sm rings'}), on('p', 'p', 'Prp19 complex', R.ntc), on('p', 'p', 'Other proteins', R.factors)],
      strands: [rna('p', 'p', 'U2 snRNA', lighten(S.U2, .15)), rna('p', 'p', 'U5 snRNA', lighten(S.U5, .2)), rna('p', 'p', 'U6 snRNA', S.U6),
        rna('p', 'p', 'pre-mRNA E', S.exon, {label: 'Joined exons'}), rna('p', 'p', 'pre-mRNA I', S.intron, {label: 'Intron lariat', group: 'Intron lariat', from: {strand: 'pre-mRNA I', num: 97}})],
      accent: lighten(S.U5, .35), wide: true, orient: {part: ['U6 snRNA', 'Joined exons', 'Intron lariat'], to: 'front'}},
    dbr1: {parts: [on('lib', 'dbr1', 'Dbr1', R.dbr1)], strands: [rna('lib', 'dbr1', 'Branch', S.intron, {label: 'Branched RNA', group: 'Branched RNA'}),
      rna('lib', 'dbr1', '2′ arm', S.intron, {label: 'Branched RNA', group: 'Branched RNA', from: {strand: 'Branch', num: 501}})],
      accent: lighten(R.dbr1), orient: {part: 'Branched RNA', to: 'front'}},
    u1snrnp: {parts: [...ring('lib', 'u1', SM, S.Sm, 'Sm ring', {link: 'smring'}), on('lib', 'u1', 'U1-70K', S.U1), on('lib', 'u1', 'U1-C', lighten(S.U1, .35))],
      strands: [rna('lib', 'u1', 'U1 snRNA', lighten(S.U1, .1)), rna('lib', 'u1', '5′ splice site', S.exon)], accent: lighten(S.U1, .2)},
    sf1: {parts: [on('lib', 'sf1', 'SF1', S.SF1)], strands: [rna('lib', 'sf1', 'Branch site', S.intron)], accent: lighten(S.SF1, .3)},
    u2af65: {parts: [on('lib', 'u2af65', 'U2AF65', S.U2AF)], strands: [rna('lib', 'u2af65', 'Polypyrimidine tract', S.intron)], accent: lighten(S.U2AF, .35), orient: {part: 'Polypyrimidine tract', to: 'front'}},
    u2af35: {parts: [on('lib', 'u2af35', 'U2AF35', lighten(S.U2AF, .3)), on('lib', 'u2af35', 'U2AF65', S.U2AF, {link: 'u2af65'})], accent: lighten(S.U2AF, .45)},
    srsf1: {parts: [on('lib', 'srsf1', 'SRSF1', S.SR)], strands: [rna('lib', 'srsf1', 'RNA', S.exon)], accent: lighten(S.SR, .3), orient: {part: 'RNA', to: 'front'}},
    camkii: {parts: [on('lib', 'camkii', 'Kinase domains', R.kinase), on('lib', 'camkii', 'Hub domains', R.hub)], accent: lighten(R.kinase), orient: {part: 'Hub domains', axis: 'short', to: 'view'}},
    bclxl: {parts: [on('lib', 'bclxl', 'Bcl-xL', R.bclxl)], accent: lighten(R.bclxl)},
    ejc: {parts: [on('lib', 'ejc', 'eIF4AIII', R.eif4a3), on('lib', 'ejc', 'MAGOH', R.magoh), on('lib', 'ejc', 'Y14', R.y14), on('lib', 'ejc', 'Barentsz', R.btz)],
      strands: [rna('lib', 'ejc', 'RNA', S.exon)], accent: lighten(R.eif4a3), orient: {part: 'RNA', to: 'front'}},
  },
  // The Sm ring core (4WZJ) is superposed on the tri-snRNP's U4 ring, so it can be shown in place.
  context: {smring: TRI}, contextLabel: {smring: 'In the tri-snRNP'}, contextDefault: '',
  relatedNames: {rnap2: 'RNA polymerase II'},
  sources: {
    'PDB 8P4B': 'PDB 8P4B · human capping enzyme on pig RNA polymerase II, paused with its new RNA (Garg et al., Mol Cell 2023)',
    'PDB 1N52': 'PDB 1N52 · human nuclear cap-binding complex, CBP80 and CBP20, with m7GpppG (Calero et al., Nat Struct Biol 2002)',
    'PDB 1IPC': 'PDB 1IPC · human eIF4E with m7GTP (Tomoo et al., Biochem J 2002)',
    'PDB 4WZJ': 'PDB 4WZJ · human U4 snRNP core: the Sm ring on U4 snRNA (Leung et al., Nature 2011)',
    'PDB 4M7A': 'PDB 4M7A · yeast Lsm2–8 ring on the 3′ end of U6 snRNA (Zhou et al., Nature 2014)',
    'PDB 7EVO': 'PDB 7EVO · human 17S U2 snRNP (Zhang et al., Nat Struct Mol Biol 2024)',
    'PDB 6QW6': 'PDB 6QW6 · human U4/U6·U5 tri-snRNP (Charenton et al., Science 2019)',
    'PDB 6QDV': 'PDB 6QDV · human post-catalytic P complex spliceosome (Fica et al., Science 2019)',
    'PDB 5K78': 'PDB 5K78 · Entamoeba histolytica Dbr1 with a branched RNA (Clark et al., PNAS 2016)',
    'PDB 4PJO': 'PDB 4PJO · minimal human U1 snRNP with a 5′ splice site RNA (Kondo et al., eLife 2015)',
    'PDB 1K1G': 'PDB 1K1G · human SF1 on branch-site RNA, NMR, first model (Liu et al., Science 2001)',
    'PDB 2G4B': 'PDB 2G4B · human U2AF65 RNA-binding domains on a polyuridine tract (Sickmier et al., Mol Cell 2006)',
    'PDB 1JMT': 'PDB 1JMT · core of the human U2AF65–U2AF35 heterodimer (Kielkopf et al., Cell 2001)',
    'PDB 2M8D': 'PDB 2M8D · human SRSF1 RRM2 with RNA, NMR, first model (Cléry et al., PNAS 2013)',
    'PDB 2J0S': 'PDB 2J0S · core of the human exon junction complex on RNA (Bono et al., Cell 2006)',
    'PDB 1MAZ': 'PDB 1MAZ · human Bcl-xL (Muchmore et al., Nature 1996)',
    'PDB 8USO': 'PDB 8USO · human CaMKIIδ holoenzyme, its twelve subunits from the crystal’s symmetry (Nguyen et al., Nat Commun 2025)',
  },
  // Where each molecule appears in the chapter's scenes (tests/proteins_ch4.test.mjs checks that each time starts the
  // step named).
  seeAlsoTitle: 'In the scenes',
  seeAlso: {
    capping: [['Capped as it is made', RNA + 'cap.html?t=0'], ['A G added in reverse', RNA + 'cap.html?t=23']],
    cbc: [['The cap-binding complex', RNA + 'cap.html?t=82']],
    eif4e: [['eIF4F', RNA + 'cap.html?t=94']],
    smring: [['The Sm ring', RNA + 'snrnps.html?t=54'], ['Five snRNPs', RNA + 'snrnps.html?t=13']],
    lsmring: [['The Lsm ring', RNA + 'snrnps.html?t=68']],
    u2snrnp: [['One snRNA, several proteins', RNA + 'snrnps.html?t=27'], ['U1 and U2 join', RNA + 'spliceosome.html?t=0']],
    trisnrnp: [['U4/U6 and U5', RNA + 'snrnps.html?t=40'], ['The tri-snRNP joins', RNA + 'spliceosome.html?t=15'], ['U4 leaves', RNA + 'spliceosome.html?t=44']],
    spliceosome: [['In the spliceosome', RNA + 'snrnps.html?t=81'], ['Exons joined', RNA + 'spliceosome.html?t=88'], ['Second transesterification', RNA + 'lariat.html?t=58']],
    dbr1: [['Debranching', RNA + 'lariat.html?t=90']],
    u1snrnp: [['U1 binds first', RNA + 'u1.html?t=0'], ['A single-stranded 5′ end', RNA + 'u1.html?t=15'], ['U1 at the 5′ splice site', RNA + 'commitment.html?t=12'],
      ['Small RNAs with proteins', RNA + 'snrnps.html?t=0'], ['U1 leaves', RNA + 'spliceosome.html?t=30']],
    sf1: [['U2AF and BBP/SF1', RNA + 'commitment.html?t=25']],
    u2af65: [['U2AF and BBP/SF1', RNA + 'commitment.html?t=25'], ['Exon definition', RNA + 'commitment.html?t=88']],
    u2af35: [['U2AF and BBP/SF1', RNA + 'commitment.html?t=25']],
    srsf1: [['SR proteins', RNA + 'commitment.html?t=41'], ['A molecular glue', RNA + 'commitment.html?t=55'], ['Exon definition', RNA + 'commitment.html?t=88']],
    camkii: [['One gene, three kinases', RNA + 'isoforms.html?t=0'], ['δC: the cytoplasm', RNA + 'isoforms.html?t=15'], ['δB: the nucleus', RNA + 'isoforms.html?t=27'],
      ['δA: the cell membrane', RNA + 'isoforms.html?t=38']],
    bclxl: [['Bcl-x: two isoforms', RNA + 'isoforms.html?t=50'], ['Bcl-xL and Bcl-xS', RNA + 'isoforms.html?t=63']],
    // The isoforms scene draws no exon junction complex; its step on the premature stop codon is this card's subject.
    ejc: [['A premature stop codon', RNA + 'isoforms.html?t=77']],
  },
};

// In the chapters' order; the first is shown when the address names none.
export const CHAPTERS = [GENES_ARE_DNA, BACTERIAL, EUKARYOTIC, RNA_SPLICING];
