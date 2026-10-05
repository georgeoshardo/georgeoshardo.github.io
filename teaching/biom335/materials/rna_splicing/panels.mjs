// The hub's figures below the tour, drawn as SVG from the notes: the tour's gene and its mRNA to the same scale; the
// RNA processed in the nucleus and translated in the cytoplasm (stages that a scene shows open it); the spliceosome's
// mass by component (the notes' figure as a stacked bar); and the six modes of alternative splicing, each a pre-mRNA,
// its splicing and the mRNAs it gives (a retained intron is kept inside the mRNA). Colours are chapter 4's (SPLICING
// in ../shared/rna.mjs, set as CSS variables in hub.css): exons orange, in two shades where they meet, introns grey-violet,
// the cap yellow and poly(A) green.
import {setRich} from '../shared/text.mjs';

const NS = 'http://www.w3.org/2000/svg';
const el = (name, attrs = {}, parent) => { const e = document.createElementNS(NS, name); for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, v); parent?.append(e); return e; };
const text = (parent, x, y, s, attrs = {}) => { const t = el('text', {x, y, ...attrs}, parent); setRich(t, s); return t; };
const svgOf = (parent, w, h, label) => { const svg = el('svg', {viewBox: `0 0 ${w} ${h}`, role: 'img', 'aria-label': label}, parent); return svg; };

// ---------- The tour's gene and its mRNA ----------
// The same gene as the tour (hub.mjs): eight exons and seven introns (bp), and the mRNA it gives.
const EXONS = [150, 120, 180, 110, 160, 130, 190, 170], INTRONS = [1000, 950, 1100, 900, 1050, 980, 1020], POLY_A = 200;
// A figure is drawn as wide as it is shown (between `least` and `most` units), so its text keeps its size on a phone
// rather than shrinking with the drawing; it is redrawn when its width changes.
const widthOf = (host, least, most) => Math.round(Math.max(least, Math.min(most, host.clientWidth || most)));
function fitted(host, draw, least, most) {
  let drawn = 0;
  const redraw = () => { const W = widthOf(host, least, most); if (W !== drawn) { drawn = W; host.replaceChildren(); draw(host, W); } };
  redraw(); new ResizeObserver(redraw).observe(host);
  document.fonts?.ready.then(() => { drawn = 0; redraw(); });  // its text measured in the page's own font
}
function geneDrawing(host, W = 1000) {
  const tight = W < 600, H = tight ? 160 : 150, x0 = tight ? 40 : 64, total = EXONS.reduce((s, x) => s + x, 0) + INTRONS.reduce((s, x) => s + x, 0), k = (W - x0 - 8) / total;
  const svg = svgOf(host, W, H, 'A gene of eight exons, each 110 to 190 bp, separated by seven introns of about 1 kb, and its mRNA: a cap, the eight exons joined, and a poly(A) tail.');
  const yG = tight ? 44 : 34, yM = yG + 78, h = 16;
  text(svg, 0, yG + 4, 'Gene', {class: 'row-name'}); text(svg, 0, yM + 4, 'mRNA', {class: 'row-name'});
  el('line', {x1: x0, x2: x0 + total * k, y1: yG, y2: yG, class: 'line'}, svg);
  let g = 0, m = 0;
  const mx0 = x0 + 10, exonsAt = [];
  EXONS.forEach((e, i) => {
    const x = x0 + g * k, mx = mx0 + m * k;
    el('rect', {x, y: yG - h / 2, width: e * k, height: h, rx: 2, class: `exon${i % 2 ? ' even' : ''}`}, svg);
    el('rect', {x: mx, y: yM - h / 2, width: e * k, height: h, rx: 0, class: `exon${i % 2 ? ' even' : ''}`}, svg);
    // Each exon's place in the mRNA, joined to its place in the gene by a fine line.
    el('path', {d: `M${(x + e * k / 2).toFixed(1)} ${yG + h / 2 + 3} L${(mx + e * k / 2).toFixed(1)} ${yM - h / 2 - 3}`, class: 'tick', 'stroke-opacity': .35}, svg);
    exonsAt.push(x);
    g += e + (INTRONS[i] || 0); m += e;
  });
  // The cap (a G at the 5′ end) and the poly(A) tail.
  el('circle', {cx: mx0 - 5, cy: yM, r: 5, class: 'cap'}, svg);
  el('rect', {x: mx0 + m * k, y: yM - 2.5, width: POLY_A * k, height: 5, rx: 2.5, class: 'polya'}, svg);
  text(svg, mx0 - 2, yM + h / 2 + 16, '5′ cap', {class: 'size', 'text-anchor': 'middle'});
  text(svg, mx0 + (m + POLY_A / 2) * k, yM + h / 2 + 16, 'Poly(A) tail', {class: 'size', 'text-anchor': 'middle'});
  const e1 = text(svg, exonsAt[0], yG - h / 2 - 8, 'Exon 1', {class: 'size'}), mid = exonsAt[0] + (EXONS[0] + INTRONS[0] / 2) * k;
  const i1 = text(svg, mid, yG - h / 2 - 8, 'Intron 1', {class: 'size', 'text-anchor': 'middle'});
  // Narrower, the two names would meet: intron 1's moves along its intron, or, with no room there, exon 1's rises a line.
  const eEnd = exonsAt[0] + e1.getComputedTextLength() + 6, iw = i1.getComputedTextLength(), intronEnd = exonsAt[0] + (EXONS[0] + INTRONS[0]) * k;
  if (mid - iw / 2 < eEnd) {
    if (eEnd + iw <= intronEnd) { i1.setAttribute('x', eEnd.toFixed(1)); i1.setAttribute('text-anchor', 'start'); }
    else e1.setAttribute('y', yG - h / 2 - 24);
  }
  // A scale bar of 1 kb, right of the mRNA.
  const sx = W - 8 - 1000 * k;
  el('path', {d: `M${sx} ${yM - 6} V${yM} H${sx + 1000 * k} V${yM - 6}`, class: 'tick', fill: 'none'}, svg);
  text(svg, sx + 500 * k, yM + 16, '1 kb', {class: 'size', 'text-anchor': 'middle'});
}

// ---------- Processing in the nucleus ----------
// An RNA as boxes: exons (shades alternating), introns between them (or removed), a cap and a poly(A) tail.
function rna(g, x, y, {exons = [26, 22, 30], introns = [34, 30], spliced = false, cap = false, polyA = false, h = 12} = {}) {
  let at = x;
  if (cap) { el('circle', {cx: at + 4, cy: y, r: 4.5, class: 'cap'}, g); at += 10; }
  exons.forEach((e, i) => {
    el('rect', {x: at, y: y - h / 2, width: e, height: h, rx: 1.5, class: `exon${i % 2 ? ' even' : ''}`}, g); at += e;
    if (i < exons.length - 1 && !spliced) { el('rect', {x: at, y: y - 2, width: introns[i], height: 4, rx: 1, class: 'intron'}, g); at += introns[i]; }
  });
  if (polyA) { el('rect', {x: at, y: y - 2.2, width: 22, height: 4.4, rx: 2.2, class: 'polya'}, g); at += 22; }
  return at;
}
const STAGES = [
  {step: 'Transcribed', sub: 'Exons and introns', opts: {}},
  {step: 'Capped at the 5′ end', sub: 'A G joined 5′–5′', href: 'cap.html', opts: {cap: true}},
  {step: 'Introns removed', sub: 'Exons joined', href: 'spliceosome.html', opts: {cap: true, spliced: true}},
  {step: 'Polyadenylated', sub: 'At the 3′ end', opts: {cap: true, spliced: true, polyA: true}},
];
// A rectangle with its corners rounded (r) except on one side (`square`: 'right' or 'bottom'), which meets a membrane.
const roundedBox = (x, y, w, h, r, square) => {
  const x1 = x + w, y1 = y + h, arc = (ex, ey) => `A${r} ${r} 0 0 1 ${ex} ${ey}`;
  return square === 'right' ? `M${x + r} ${y}H${x1}V${y1}H${x + r}${arc(x, y1 - r)}V${y + r}${arc(x + r, y)}Z`
    : `M${x + r} ${y}H${x1 - r}${arc(x1, y + r)}V${y1}H${x}V${y + r}${arc(x + r, y)}Z`;
};
// Where the row of stages would be shown below about 0.82 of its size (its text under 10 px), the stages go down the
// page instead (on a phone or a narrow tablet), at most 440 px wide.
function processing(host, tall = false) {
  const W = tall ? 360 : 1000, H = tall ? 672 : 280;
  const svg = svgOf(host, W, H, 'In the nucleus the RNA is capped at its 5′ end, has its introns removed and is polyadenylated at its 3′ end; it is transported through a nuclear pore to the cytoplasm, where a ribosome translates it into protein.');
  const defs = el('defs', {}, svg), head = el('marker', {id: 'proc-head', viewBox: '0 0 10 10', refX: 8, refY: 5, markerWidth: 6, markerHeight: 6, orient: 'auto-start-reverse'}, defs);
  el('path', {d: 'M1 1 9 5 1 9z', class: 'head'}, head);
  const arrow = d => el('path', {d, class: 'arrow', 'marker-end': 'url(#proc-head)'}, svg);
  const caption = (x, y, s, anchor = 'middle') => {
    const g = s.href ? el('a', {href: s.href}, svg) : el('g', {}, svg);
    text(g, x, y, s.href ? `${s.step} ↗` : s.step, {class: 'step', 'text-anchor': anchor});
    text(g, x, y + 16, s.sub, {class: 'sub', 'text-anchor': anchor});
  };
  if (!tall) {
    // The nucleus on the left, its envelope (two membranes) with a pore, the cytoplasm on the right.
    const ex = 780;
    // The nucleus's fill ends at the inner membrane (its corners rounded away from the envelope).
    el('path', {d: roundedBox(0, 30, ex - 6, 200, 18, 'right'), class: 'nucleus'}, svg);
    el('path', {d: `M${ex - 6} 30 V105 M${ex - 6} 155 V230 M${ex + 6} 30 V105 M${ex + 6} 155 V230`, class: 'envelope'}, svg);
    el('rect', {x: ex - 10, y: 105, width: 20, height: 50, rx: 6, class: 'pore'}, svg);
    text(svg, 16, 52, 'Nucleus', {class: 'place'}); text(svg, ex + 24, 52, 'Cytoplasm', {class: 'place'});
    const cx = [95, 280, 465, 650], y = 130, ends = [];
    STAGES.forEach((s, i) => {
      const w = s.opts.spliced ? 78 + (s.opts.cap ? 10 : 0) + (s.opts.polyA ? 22 : 0) : 142 + (s.opts.cap ? 10 : 0), x = cx[i] - w / 2;
      ends.push([x, rna(svg, x, y, s.opts)]);
      caption(cx[i], y + 40, s);
    });
    // Each arrow midway between the RNA it leaves and the one it reaches.
    for (let i = 0; i < STAGES.length - 1; i++) { const m = (ends[i][1] + ends[i + 1][0]) / 2; arrow(`M${m - 13} ${y} H${m + 14}`); }
    arrow(`M${cx[3] + 62} ${y} H${ex - 16}`);
    caption(ex, 254, {step: 'Through a nuclear pore', sub: 'Transported to the cytoplasm'});
    // In the cytoplasm, a ribosome on the mRNA, a protein chain growing from it.
    const rx = 890;
    arrow(`M${ex + 16} ${y} H${rx - 46}`);
    rna(svg, rx - 44, y, {cap: true, spliced: true, polyA: true, exons: [26, 22, 30].map(e => e * .7)});
    el('ellipse', {cx: rx, cy: y - 14, rx: 22, ry: 12, class: 'ribosome'}, svg); el('ellipse', {cx: rx, cy: y + 7, rx: 16, ry: 8, class: 'ribosome small'}, svg);
    for (let i = 0; i < 5; i++) el('circle', {cx: rx + 2 + i * 8, cy: y - 34 - (i % 2) * 6, r: 4.2, class: 'chain'}, svg);
    caption(rx, y + 40, {step: 'Translated', sub: 'Into protein'});
  } else {
    // On a phone: the stages down the page, the envelope across it.
    const ey = 470, x = W / 2;
    el('path', {d: roundedBox(0, 24, W, ey - 6 - 24, 18, 'bottom'), class: 'nucleus'}, svg);
    el('path', {d: `M0 ${ey - 6} H${x - 25} M${x + 25} ${ey - 6} H${W} M0 ${ey + 6} H${x - 25} M${x + 25} ${ey + 6} H${W}`, class: 'envelope'}, svg);
    el('rect', {x: x - 25, y: ey - 10, width: 50, height: 20, rx: 6, class: 'pore'}, svg);
    text(svg, 14, 46, 'Nucleus', {class: 'place'}); text(svg, 14, ey + 34, 'Cytoplasm', {class: 'place'});
    const ys = [78, 180, 282, 384];
    STAGES.forEach((s, i) => {
      const w = s.opts.spliced ? 78 + (s.opts.cap ? 10 : 0) + (s.opts.polyA ? 22 : 0) : 142 + (s.opts.cap ? 10 : 0);
      rna(svg, x - w / 2, ys[i], s.opts);
      caption(x, ys[i] + 32, s);
      arrow(`M${x} ${ys[i] + 54} V${(ys[i + 1] ?? ey) - (i < 3 ? 18 : 16)}`);
    });
    // The pore's caption in the cytoplasm, right of the arrow and inside the drawing; the arrow ends above the chain.
    text(svg, W - 6, ey + 32, 'Through a nuclear pore', {class: 'step', 'text-anchor': 'end'});
    text(svg, W - 6, ey + 49, 'Transported to the cytoplasm', {class: 'sub', 'text-anchor': 'end'});
    const ry = 592;
    arrow(`M${x} ${ey + 16} V${ry - 52}`);
    rna(svg, x - 44, ry, {cap: true, spliced: true, polyA: true, exons: [26, 22, 30].map(e => e * .7)});
    el('ellipse', {cx: x, cy: ry - 14, rx: 22, ry: 12, class: 'ribosome'}, svg); el('ellipse', {cx: x, cy: ry + 7, rx: 16, ry: 8, class: 'ribosome small'}, svg);
    for (let i = 0; i < 5; i++) el('circle', {cx: x + 2 + i * 8, cy: ry - 34 - (i % 2) * 6, r: 4.2, class: 'chain'}, svg);
    caption(x, ry + 40, {step: 'Translated', sub: 'Into protein'});
  }
}

// ---------- The spliceosome's mass ----------
// The notes' figure (spliceosome_components.png): about 12 MDa in all. Colours checked for colour-blind viewers on the
// page's dark surface (adjacent pairs ΔE ≥ 8); every part is also named and valued beside its bar.
const MASS = [
  {name: '5 snRNAs', mda: 3.3, pct: 27, colour: '#d55181'},
  {name: '41 snRNP proteins', mda: 2.2, pct: 18, colour: '#9085e9'},
  {name: '70 splicing factors', mda: 4.7, pct: 38, colour: '#199e70'},
  {name: '30 other proteins', mda: 2.1, pct: 17, colour: '#c98500'},
];
function mass(host, W = 600) {
  const x0 = 0, bw = W, y = 74, h = 34, gap = 2;
  const svg = svgOf(host, W, 300, `The spliceosome's mass, about 12 MDa: ${MASS.map(m => `${m.name}, ${m.mda} MDa (${m.pct}%)`).join('; ')}. The five snRNPs (snRNAs and snRNP proteins) make up almost half.`);
  text(svg, 0, 30, '≈12 MDa', {class: 'total'}); text(svg, 118, 30, 'IN ALL', {class: 'total-sub'});
  let at = x0;
  const spans = MASS.map((m, i) => {
    const w = bw * m.pct / 100, x = at; at += w;
    const g = el('g', {class: 'part', tabindex: 0, role: 'img', 'aria-label': `${m.name}: ${m.mda} MDa, ${m.pct}%`}, svg);
    el('title', {}, g).textContent = `${m.name}: ${m.mda} MDa (${m.pct}%)`;
    // Rounded at the bar's two ends only, a 2px gap between parts.
    const r = 4, l = i === 0, rgt = i === MASS.length - 1, x1 = x + (l ? 0 : gap / 2), x2 = x + w - (rgt ? 0 : gap / 2);
    el('path', {d: `M${x1 + (l ? r : 0)} ${y} H${x2 - (rgt ? r : 0)} ${rgt ? `Q${x2} ${y} ${x2} ${y + r} V${y + h - r} Q${x2} ${y + h} ${x2 - r} ${y + h}` : `V${y + h}`} H${x1 + (l ? r : 0)} ${l ? `Q${x1} ${y + h} ${x1} ${y + h - r} V${y + r} Q${x1} ${y} ${x1 + r} ${y}` : `V${y}`}Z`, fill: m.colour}, g);
    text(g, x + w / 2, y + h / 2 + 4.5, `${m.pct}%`, {class: 'pct', 'text-anchor': 'middle'});
    return {x, w};
  });
  // The five snRNPs: their snRNAs and proteins together, almost half.
  const sx0 = spans[0].x, sx1 = spans[1].x + spans[1].w;
  el('path', {d: `M${sx0 + 1} ${y - 6} V${y - 14} H${sx1 - 2} V${y - 6}`, class: 'mass-bracket'}, svg);
  text(svg, sx0, y - 22, `Five snRNPs · ${(MASS[0].mda + MASS[1].mda).toFixed(1)} MDa, almost half`, {class: 'mass-bracket-label'});
  // The key: each part, its mass and share.
  MASS.forEach((m, i) => {
    const ky = y + h + 38 + i * 34;
    el('rect', {x: 0, y: ky - 11, width: 14, height: 14, rx: 3, fill: m.colour}, svg);
    text(svg, 24, ky, m.name, {class: 'name'});
    text(svg, W, ky, `${m.mda.toFixed(1)} MDa · ${m.pct}%`, {class: 'value', 'text-anchor': 'end'});
  });
}

// ---------- The modes of alternative splicing ----------
// Each mode: a pre-mRNA (exons as numbered boxes, alternative ones paler; introns as lines), its splicing (an arc over
// each intron removed: above for one choice, dashed below for the other) and the mRNA or mRNAs it gives.
const MODES = [
  {name: 'Constitutive splicing', text: 'Introns are removed and exons joined in a consistent, non-variable way, producing a single type of mature mRNA. The most common form of splicing; not alternative splicing.',
    pre: [['1'], 'i', ['2'], 'i', ['3']], above: [[0, 2], [2, 4]], below: [], products: [[['1'], ['2'], ['3']]]},
  {name: 'Exon skipping', text: 'An entire exon, a cassette exon, is either included in the final mRNA or excluded from it.',
    pre: [['1'], 'i', ['2', 'alt'], 'i', ['3']], above: [[0, 2], [2, 4]], below: [[0, 4]], products: [[['1'], ['2', 'alt'], ['3']], [['1'], ['3']]]},
  {name: 'Intron retention', text: 'An entire intron is kept in the mature mRNA, between the exons it separated.',
    pre: [['1'], 'i', ['2']], above: [[0, 2]], below: [], products: [[['1'], ['2']], [['1'], ['intron'], ['2']]]},
  {name: 'Mutually exclusive exons', text: 'One of two or more exons is included, but not both. This is often regulated in a tissue-specific manner.',
    pre: [['1'], 'i', ['2a', 'alt'], 'i', ['2b', 'alt'], 'i', ['3']], above: [[0, 2], [2, 6]], below: [[0, 4], [4, 6]], products: [[['1'], ['2a', 'alt'], ['3']], [['1'], ['2b', 'alt'], ['3']]]},
  {name: 'Alternative 5′ splice site', text: 'An alternative 5′ splice site is used, changing the 3′ end of the upstream exon.',
    pre: [['1'], ['', 'alt', 'ext'], 'i', ['2']], above: [[1, 3]], below: [[0, 3]], products: [[['1'], ['', 'alt', 'ext'], ['2']], [['1'], ['2']]]},
  {name: 'Alternative 3′ splice site', text: 'An alternative 3′ splice site is used, changing the 5′ end of the downstream exon.',
    pre: [['1'], 'i', ['', 'alt', 'ext'], ['2']], above: [[0, 2]], below: [[0, 3]], products: [[['1'], ['', 'alt', 'ext'], ['2']], [['1'], ['2']]]},
];
const EW = 30, EXT = 14, IW = 34, BH = 14;
const width = part => part === 'i' ? IW : part[0] === 'intron' ? IW : part[2] === 'ext' ? EXT : EW;
function drawRow(g, parts, x, y) {
  const at = [];
  let cx = x, k = 0;
  parts.forEach(part => {
    const w = width(part); at.push([cx, cx + w]);
    if (part === 'i') el('line', {x1: cx, x2: cx + w, y1: y, y2: y, class: 'intron-line', stroke: 'var(--intron)', 'stroke-width': 2}, g);
    else if (part[0] === 'intron') el('rect', {x: cx, y: y - BH / 2, width: w, height: BH, rx: 0, class: 'intron'}, g);
    else {
      const alt = part[1] === 'alt', l = part[2] === 'ext';
      el('rect', {x: cx, y: y - BH / 2, width: w, height: BH, rx: 1.5, class: `exon${alt ? ' alt' : k % 2 ? ' even' : ''}`}, g);
      if (part[0]) text(g, cx + w / 2, y + .5, part[0], {class: `num${alt ? ' light' : ''}`});
      if (!l) k++;
    }
    cx += w;
  });
  return {at, end: cx};
}
function mode(host, m) {
  const fig = document.createElement('figure'); fig.className = 'mode';
  const h = document.createElement('h3'); setRich(h, m.name); fig.append(h);
  const W = 300, preW = m.pre.reduce((s, p) => s + width(p), 0), x0 = (W - preW) / 2, H = m.products.length > 1 ? 168 : 128;
  const svg = svgOf(fig, W, H, `${m.name}: a pre-mRNA of ${m.pre.filter(p => p !== 'i' && p[0]).map(p => 'exon ' + p[0]).join(', ')} gives ${m.products.map(p => p.map(q => q[0] === 'intron' ? 'the retained intron' : q[0] ? 'exon ' + q[0] : 'an extended exon').join('–')).join(', or ')}.`);
  const yPre = 40, row = drawRow(svg, m.pre, x0, yPre);
  // Splicing: an arc from the end of one exon to the start of the next it is joined to.
  const arc = ([a, b], up) => {
    const xa = row.at[a][1], xb = row.at[b][0], mid = (xa + xb) / 2, dy = up ? -1 : 1, hh = Math.min(22, 8 + (xb - xa) * .14);
    el('path', {d: `M${xa} ${yPre + dy * BH / 2} Q${mid} ${yPre + dy * (BH / 2 + 2 * hh)} ${xb} ${yPre + dy * BH / 2}`, class: `splice${up ? '' : ' alt'}`}, svg);
  };
  m.above.forEach(p => arc(p, true)); m.below.forEach(p => arc(p, false));
  const defs = el('defs', {}, svg), id = `alt-head-${MODES.indexOf(m)}`, hd = el('marker', {id, viewBox: '0 0 10 10', refX: 8, refY: 5, markerWidth: 6, markerHeight: 6, orient: 'auto'}, defs);
  el('path', {d: 'M1 1 9 5 1 9z', class: 'head'}, hd);
  const yA = yPre + BH / 2 + (m.below.length ? 30 : 10);
  el('path', {d: `M${W / 2} ${yA} V${yA + 14}`, class: 'arrow', 'marker-end': `url(#${id})`}, svg);
  m.products.forEach((p, i) => {
    const pw = p.reduce((s, q) => s + width(q), 0), y = yA + 34 + i * 36;
    drawRow(svg, p, (W - pw) / 2, y);
    if (i) text(svg, W / 2, y - 19, 'or', {class: 'or'});
  });
  text(svg, 0, 12, 'pre-mRNA', {class: 'label'}); text(svg, 0, yA + 12, 'mRNA', {class: 'label'});
  const p = document.createElement('p'); setRich(p, m.text); fig.append(p);
  host.append(fig);
}

const geneHost = document.getElementById('gene-drawing');
if (geneHost) fitted(geneHost, geneDrawing, 360, 1000);
const procHost = document.getElementById('processing-figure');
if (procHost) {
  let tall = null;
  const redraw = () => { const t = (procHost.clientWidth || 1000) < 820; if (t !== tall) { tall = t; procHost.replaceChildren(); processing(procHost, t); procHost.classList.toggle('tall', t); } };
  redraw(); new ResizeObserver(redraw).observe(procHost);
}
const massHost = document.getElementById('mass-figure');
if (massHost) fitted(massHost, mass, 320, 600);
const modesHost = document.getElementById('modes');
if (modesHost) MODES.forEach(m => mode(modesHost, m));
