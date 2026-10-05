// Rich text shared by the course's pages. σ factor names take a subscript: σ70 → σ<sub>70</sub> and σS →
// σ<sub>S</sub> (two or more digits, or one capital letter, so σ region labels such as σ4 stay as written).
// Unicode subscript digits and n (α₂, (YSPTSPS)ₙ) become <sub> as well, since the serif face has none, and
// the notes' basal factors take a subscript class: TFIID → TF<sub>II</sub>D, TFIIIB → TF<sub>III</sub>B. The text content is
// unchanged (σ<sub>70</sub> still reads "σ70"), so searching, measuring and reading aloud see the same words.
// Chapter 4's names: the Bcl-x isoforms take their letter as a subscript (Bcl-xL → Bcl-x<sub>L</sub>, Bcl-xS), and a
// methylated nucleoside its positions as a superscript (m7G → m<sup>7</sup>G, m2,2,7G, m6A; written m⁷G with Unicode
// superscripts it is set the same and reads "m7G"). Anything else can be marked up in plain text as <sup>…</sup> or
// <sub>…</sub> (<sup>32</sup>P), in labels, tags, captions and questions alike. Unicode superscripts elsewhere (³²P,
// Mg²⁺, 10⁻⁶) are left as written.
export const RICH = /σ(\d{2,}|[A-Z](?![A-Za-z]))|([₀-₉ₙ]+)|\bTF(III|II)(?=[A-H]\b)|<(sup|sub)>([^<]*)<\/\4>|\b(Bcl-x)([LS])\b|\bm([0-9⁰¹²³⁴-⁹](?:,?[0-9⁰¹²³⁴-⁹])*)(?=[AGCUI])/g;
const SUBSCRIPT = '₀₁₂₃₄₅₆₇₈₉ₙ', PLAIN = '0123456789n', SUPERSCRIPT = '⁰¹²³⁴⁵⁶⁷⁸⁹';
const plainSuper = s => [...s].map(c => { const k = SUPERSCRIPT.indexOf(c); return k < 0 ? c : String(k); }).join('');

// A regex with the g flag carries lastIndex between calls (and matchAll copies it), so each use starts at 0.
const has = text => { RICH.lastIndex = 0; const hit = RICH.test(text); RICH.lastIndex = 0; return hit; };

function parts(text) {
  const out = [];
  let at = 0;
  RICH.lastIndex = 0;
  for (const m of text.matchAll(RICH)) {
    if (m.index > at) out.push(text.slice(at, m.index));
    if (m[1]) out.push('σ', {sub: m[1]});
    else if (m[3]) out.push('TF', {sub: m[3]});
    else if (m[4]) out.push({[m[4]]: m[5]});
    else if (m[6]) out.push(m[6], {sub: m[7]});
    else if (m[8]) out.push('m', {sup: plainSuper(m[8])});
    else out.push({sub: [...m[2]].map(c => PLAIN[SUBSCRIPT.indexOf(c)]).join('')});
    at = m.index + m[0].length;
  }
  if (at < text.length) out.push(text.slice(at));
  return out;
}

function node(piece, svg, doc) {
  if (typeof piece === 'string') return doc.createTextNode(piece);
  const up = 'sup' in piece, text = up ? piece.sup : piece.sub;
  if (svg) {
    const t = doc.createElementNS('http://www.w3.org/2000/svg', 'tspan');
    t.setAttribute('baseline-shift', up ? 'super' : 'sub'); t.setAttribute('font-size', '72%'); t.textContent = text;
    return t;
  }
  const s = doc.createElement(up ? 'sup' : 'sub'); s.textContent = text;
  return s;
}

// Replaces an element's content with `text`, subscripts and superscripts included (SVG <text> gets <tspan>s).
export function setRich(el, text) {
  const t = text == null ? '' : String(text);
  if (!has(t)) { el.textContent = t; return el; }
  const svg = el instanceof SVGElement;
  el.textContent = '';
  for (const p of parts(t)) el.append(node(p, svg, el.ownerDocument));
  return el;
}

// Applies the same subscripts and superscripts to every text node under `root`, in place (for HTML built from
// templates).
export function enrichTree(root) {
  const doc = root.ownerDocument, walk = doc.createTreeWalker(root, NodeFilter.SHOW_TEXT), hits = [];
  for (let n = walk.nextNode(); n; n = walk.nextNode()) {
    if (has(n.data) && !n.parentElement?.closest('sub,sup,tspan[baseline-shift],script,style,textarea,option')) hits.push(n);
  }
  for (const n of hits) {
    const svg = n.parentElement instanceof SVGElement, frag = doc.createDocumentFragment();
    for (const p of parts(n.data)) frag.append(node(p, svg, doc));
    n.replaceWith(frag);
  }
  return root;
}

// The pieces rich text is set in (strings, and {sub} or {sup}), for tests.
export const richParts = text => parts(String(text ?? ''));
