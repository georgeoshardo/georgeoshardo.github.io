// The hub's two figures below the zoom, drawn as SVG from the notes' numbers: three genomes side by side (size in
// base pairs, chromosomes and organellar DNA, genes), and the central dogma, each arrow naming the enzyme that carries
// it out and, where the course shows that process, opening it.
const NS = 'http://www.w3.org/2000/svg';
const el = (name, attrs = {}, parent) => { const e = document.createElementNS(NS, name); for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, v); parent?.append(e); return e; };
const text = (parent, x, y, s, attrs = {}) => { const t = el('text', {x, y, ...attrs}, parent); t.textContent = s; return t; };

// ---------- Three genomes ----------
// Size (Mbp), chromosomes (how many, their shape) and organellar DNA or plasmids, genes (a range, or a floor).
const GENOMES = [
  {name: '<i>E. coli</i>', size: 4.6, count: 1, circular: true, extra: ['plasmid'], note: 'One circular chromosome, often with plasmids', genes: [4000, 5500], label: '4,000–5,500'},
  {name: 'Human', size: 3200, count: 23, extra: ['mitochondrial'], note: '23 linear chromosomes, with mitochondrial DNA', genes: [20000, null], label: '20,000+'},
  {name: 'Rice', size: 400, count: 12, extra: ['mitochondrial', 'chloroplast'], note: '12 linear chromosomes, with mitochondrial and chloroplast DNA', genes: [50000, 60000], label: '50,000–60,000'},
];
const SIZE_MAX = 3500, GENES_MAX = 60000;

// A bar on a linear scale: solid to `lo`, lighter on to `hi` (a range), or fading on (a floor, `hi` null).
function bar(lo, hi, max, cls) {
  const svg = el('svg', {viewBox: '0 0 200 14', class: `bar ${cls}`, 'aria-hidden': 'true', preserveAspectRatio: 'none'});
  el('rect', {x: 0, y: 5, width: 200, height: 4, rx: 2, class: 'track'}, svg);
  const w = v => Math.max(1.5, 200 * v / max);
  if (hi === null) {
    const id = `fade-${cls}-${lo}`, g = el('linearGradient', {id}, el('defs', {}, svg));
    el('stop', {offset: 0, 'stop-color': 'currentColor', 'stop-opacity': .55}, g); el('stop', {offset: 1, 'stop-color': 'currentColor', 'stop-opacity': 0}, g);
    el('rect', {x: w(lo) - 1, y: 3, width: 26, height: 8, rx: 2, fill: `url(#${id})`}, svg);
  } else if (hi > lo) el('rect', {x: 0, y: 3, width: w(hi), height: 8, rx: 2, class: 'range'}, svg);
  el('rect', {x: 0, y: 3, width: w(lo), height: 8, rx: 2, class: 'fill'}, svg);
  return svg;
}
// The chromosomes as a count: a circle for a circular chromosome, a mark for each linear one; small rings for
// plasmids and organellar DNA.
function shapes(g) {
  const marks = g.circular ? 0 : g.count, width = g.circular ? 34 : marks * 6 + 4, extras = g.extra.length * 14;
  const svg = el('svg', {viewBox: `0 0 ${width + extras + 6} 28`, class: 'shapes', 'aria-hidden': 'true'});
  if (g.circular) el('circle', {cx: 15, cy: 14, r: 11, class: 'chromosome ring'}, svg);
  for (let i = 0; i < marks; i++) el('rect', {x: 2 + i * 6, y: 4, width: 3.4, height: 20, rx: 1.7, class: 'chromosome'}, svg);
  g.extra.forEach((kind, i) => el('circle', {cx: width + 8 + i * 14, cy: 20, r: 4, class: `extra ${kind}`}, svg));
  return svg;
}
const rows = document.getElementById('genome-rows');
if (rows) for (const g of GENOMES) {
  const tr = document.createElement('tr');
  const th = document.createElement('th'); th.scope = 'row'; th.innerHTML = g.name; tr.append(th);
  const size = document.createElement('td'); size.className = 'size';
  size.append(bar(g.size, g.size, SIZE_MAX, 'size-bar')); size.insertAdjacentHTML('beforeend', `<span class="value">${g.size.toLocaleString('en-GB')} <small>Mbp</small></span>`);
  const chromosomes = document.createElement('td'); chromosomes.className = 'chromosomes';
  chromosomes.append(shapes(g)); chromosomes.insertAdjacentHTML('beforeend', `<span class="value">${g.note}</span>`);
  const genes = document.createElement('td'); genes.className = 'genes';
  genes.append(bar(g.genes[0], g.genes[1], GENES_MAX, 'gene-bar')); genes.insertAdjacentHTML('beforeend', `<span class="value">${g.label}</span>`);
  tr.append(size, chromosomes, genes); rows.append(tr);
}

// ---------- The central dogma ----------
// DNA, RNA and polypeptide down the middle; replication loops beside DNA and RNA; transcription and translation
// down; reverse transcription back up, dotted. Where a page shows the process, its name opens it.
const figure = document.getElementById('dogma-figure');
if (figure) {
  const svg = el('svg', {viewBox: '0 0 600 430', role: 'group', 'aria-labelledby': 'dogma-svg-title'}, figure);
  el('title', {id: 'dogma-svg-title'}, svg).textContent = 'The central dogma: DNA is replicated and transcribed into RNA, and RNA translated into polypeptide; RNA can also be replicated, or reverse transcribed into DNA.';
  const defs = el('defs', {}, svg);
  const head = el('marker', {id: 'dogma-head', viewBox: '0 0 10 10', refX: 8, refY: 5, markerWidth: 7, markerHeight: 7, orient: 'auto-start-reverse'}, defs);
  el('path', {d: 'M1 1 9 5 1 9z', class: 'head'}, head);
  const X = 300, Y = {dna: 64, rna: 214, pep: 364};
  // DNA: two strands round each other; RNA: one strand; a polypeptide: a chain of beads.
  const wave = (y, phase, amp = 11) => { let d = ''; for (let i = 0; i <= 60; i++) { const x = X - 70 + i * 140 / 60, v = y + amp * Math.sin(i / 60 * Math.PI * 4 + phase); d += `${i ? 'L' : 'M'}${x.toFixed(1)} ${v.toFixed(1)}`; } return d; };
  el('path', {d: wave(Y.dna, 0), class: 'strand template'}, svg); el('path', {d: wave(Y.dna, Math.PI), class: 'strand coding'}, svg);
  el('path', {d: wave(Y.rna, 0), class: 'strand rna'}, svg);
  for (let i = 0; i < 9; i++) el('circle', {cx: X - 64 + i * 16, cy: Y.pep + (i % 2 ? -5 : 5), r: 7.5, class: 'bead'}, svg);
  text(svg, X, Y.dna - 26, 'DNA', {class: 'node'}); text(svg, X, Y.rna - 24, 'RNA', {class: 'node'}); text(svg, X, Y.pep - 22, 'Polypeptide', {class: 'node'});
  const arrow = (d, dotted) => el('path', {d, class: `flow${dotted ? ' dotted' : ''}`, 'marker-end': 'url(#dogma-head)'}, svg);
  // A process: its name (a link where the course shows it) and the enzyme that carries it out.
  const process = (x, y, name, enzyme, href, anchor = 'start') => {
    const g = href ? el('a', {href, class: 'process link'}, svg) : el('g', {class: 'process'}, svg);
    text(g, x, y, href ? `${name} ↗` : name, {class: 'name', 'text-anchor': anchor});
    [].concat(enzyme).forEach((line, i) => text(g, x, y + 17 + 14 * i, line, {class: 'enzyme', 'text-anchor': anchor}));
    return g;
  };
  arrow(`M${X} ${Y.dna + 22} V${Y.rna - 44}`); process(X + 16, Y.dna + 66, 'Transcription', 'RNA polymerase', '../transcription_3d/index.html');
  arrow(`M${X} ${Y.rna + 22} V${Y.pep - 42}`); process(X + 16, Y.rna + 66, 'Translation', 'Ribosome');
  // Replication: a loop that returns to the molecule it leaves.
  const loop = y => arrow(`M${X - 84} ${y - 10} C${X - 150} ${y - 44} ${X - 150} ${y + 44} ${X - 84} ${y + 10}`);
  loop(Y.dna); process(X - 150, Y.dna - 6, 'Replication', 'DNA polymerase', 'replication.html', 'end');
  loop(Y.rna); process(X - 150, Y.rna - 6, 'RNA replication', ['RNA-dependent', 'RNA polymerase'], 'dna_or_rna.html?t=48', 'end');
  arrow(`M${X + 88} ${Y.rna} C${X + 150} ${Y.rna} ${X + 150} ${Y.dna} ${X + 92} ${Y.dna}`, true);
  process(X + 156, Y.rna - 84, 'Reverse transcription', 'Reverse transcriptase', 'dna_or_rna.html?t=61.5');
  // Nothing returns from protein.
  text(svg, X, Y.pep + 46, 'No transfer from polypeptide back to nucleic acid', {class: 'never'});
}
