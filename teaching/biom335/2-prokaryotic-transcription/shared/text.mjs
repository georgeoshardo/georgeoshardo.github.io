// Rich text shared by the course's pages. σ factor names take a subscript: σ70 → σ<sub>70</sub> and σS →
// σ<sub>S</sub> (two or more digits, or one capital letter, so σ region labels such as σ4 stay as written).
// Unicode subscript digits (α₂) become <sub> as well, since the serif face has none. The text content is
// unchanged (σ<sub>70</sub> still reads "σ70"), so searching, measuring and reading aloud see the same words.
export const RICH = /σ(\d{2,}|[A-Z](?![A-Za-z]))|([₀-₉]+)/g;
const SUBSCRIPT = '₀₁₂₃₄₅₆₇₈₉';

// A regex with the g flag carries lastIndex between calls (and matchAll copies it), so each use starts at 0.
const has = text => { RICH.lastIndex = 0; const hit = RICH.test(text); RICH.lastIndex = 0; return hit; };

function parts(text) {
  const out = [];
  let at = 0;
  RICH.lastIndex = 0;
  for (const m of text.matchAll(RICH)) {
    if (m.index > at) out.push(text.slice(at, m.index));
    if (m[1]) out.push('σ', {sub: m[1]}); else out.push({sub: [...m[2]].map(c => SUBSCRIPT.indexOf(c)).join('')});
    at = m.index + m[0].length;
  }
  if (at < text.length) out.push(text.slice(at));
  return out;
}

function node(piece, svg, doc) {
  if (typeof piece === 'string') return doc.createTextNode(piece);
  if (svg) {
    const t = doc.createElementNS('http://www.w3.org/2000/svg', 'tspan');
    t.setAttribute('baseline-shift', 'sub'); t.setAttribute('font-size', '72%'); t.textContent = piece.sub;
    return t;
  }
  const s = doc.createElement('sub'); s.textContent = piece.sub;
  return s;
}

// Replaces an element's content with `text`, subscripts included (SVG <text> gets <tspan>s).
export function setRich(el, text) {
  const t = text == null ? '' : String(text);
  if (!has(t)) { el.textContent = t; return el; }
  const svg = el instanceof SVGElement;
  el.textContent = '';
  for (const p of parts(t)) el.append(node(p, svg, el.ownerDocument));
  return el;
}

// Applies the same subscripts to every text node under `root`, in place (for HTML built from templates).
export function enrichTree(root) {
  const doc = root.ownerDocument, walk = doc.createTreeWalker(root, NodeFilter.SHOW_TEXT), hits = [];
  for (let n = walk.nextNode(); n; n = walk.nextNode()) {
    if (has(n.data) && !n.parentElement?.closest('sub,tspan[baseline-shift],script,style,textarea,option')) hits.push(n);
  }
  for (const n of hits) {
    const svg = n.parentElement instanceof SVGElement, frag = doc.createDocumentFragment();
    for (const p of parts(n.data)) frag.append(node(p, svg, doc));
    n.replaceWith(frag);
  }
  return root;
}
