// STDP Persistence Model — Interactive Visualization Dashboard
// All math ported from Python; no external data dependency.
import { useState, useEffect, useRef, useMemo } from "react";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, LineChart, Line,
  ResponsiveContainer, CartesianGrid, Legend
} from "recharts";

// ═══════════════════════════════════════════════════════════════════
// MATH LIBRARY
// ═══════════════════════════════════════════════════════════════════

function fact(n) { let r = 1; for (let i = 2; i <= n; i++) r *= i; return r; }

function erlangSF(k, lam, t) {
  if (t <= 0) return 1.0;
  const x = lam * t;
  let s = 0, term = 1;
  for (let m = 0; m < k; m++) { if (m > 0) term *= x / m; s += term; }
  return Math.exp(-x) * s;
}

function erlangPDF(k, lam, t) {
  if (t <= 0) return 0;
  const x = lam * t;
  return lam * Math.pow(x, k - 1) * Math.exp(-x) / fact(k - 1);
}

// ∫_0^τ t^{k-1} e^{bt} dt
function IPolyExp(b, tau, k) {
  if (tau <= 0) return 0;
  const t = tau;
  if (Math.abs(b * t) < 1e-6) {
    let s = Math.pow(t, k) / k, term = s;
    for (let m = 1; m <= 200; m++) {
      term *= (b * t) / (k + m); term /= m; s += term;
      if (Math.abs(term) < 1e-15 * Math.abs(s)) break;
    }
    return s;
  }
  let I = (Math.exp(b * t) - 1.0) / b;
  for (let kk = 2; kk <= k; kk++)
    I = Math.exp(b * t) * Math.pow(t, kk - 1) / b - (kk - 1) / b * I;
  return I;
}

// ∫_0^τ e^{α ℓ} f_Erlang(ℓ; k, λ) dℓ
function JTrunc(k, lam, alpha, tau) {
  if (tau <= 0) return 0;
  return Math.pow(lam, k) * IPolyExp(alpha - lam, tau, k) / fact(k - 1);
}

// Returns [J, dJ/dα] for the degenerate H = hT case
function JDJ(k, lam, alpha, tau) {
  const b = alpha - lam, fk = Math.pow(lam, k) / fact(k - 1);
  return [fk * IPolyExp(b, tau, k), fk * IPolyExp(b, tau, k + 1)];
}

// Hazard functions (log(1+x) form from code)
const hS = (C, kS, K, n) => C <= 0 ? 0 : Math.log(1 + kS * Math.pow(C / K, n));
const hT = (C, kT, K, n) => C <= 0 ? 0 : Math.log(1 + kT * Math.pow(C / K, n));
const rST = (C, a, kST, KST, nST, a50, r0) => {
  const m = a / (a + a50);
  const hz = C <= 0 ? 0 : Math.log(1 + kST * Math.pow(C / KST, nST));
  return m * (r0 + hz);
};

function getLambda(p, a) {
  return p.k_lag / Math.max(p.mu0 + (a / 24) * p.mu24p, 1e-9);
}

function predict(p, C, tau, a) {
  const lam = getLambda(p, a);
  const piD = Math.min(Math.max(erlangSF(p.k_lag, lam, tau), 0), 1);
  const hs = hS(C, p.kS, p.K, p.n);
  const ht = hT(C, p.kT, p.K, p.n);
  const r  = rST(C, a, p.kST, p.KST, p.nST, p.a50, p.r0);
  const H  = hs + r;
  const JH = JTrunc(p.k_lag, lam, H, tau);
  const piS = Math.min(Math.max(Math.exp(-H * tau) * JH, 0), 1);
  let piT;
  if (Math.abs(H - ht) > 1e-10) {
    const Jh  = JTrunc(p.k_lag, lam, ht, tau);
    const JH2 = JTrunc(p.k_lag, lam, H, tau);
    piT = (r / (H - ht)) * (Math.exp(-ht * tau) * Jh - Math.exp(-H * tau) * JH2);
  } else {
    const [Jh, dJh] = JDJ(p.k_lag, lam, ht, tau);
    piT = r * Math.exp(-ht * tau) * (tau * Jh - dJh);
  }
  piT = Math.min(Math.max(piT || 0, 0), 1);
  return { S: piS, T: piT, D: piD, dead: Math.max(0, 1 - piD - piS - piT) };
}

// Post-treatment: discounted deep-persister arrival integral
function regIncGamma(k, x) { return 1 - erlangSF(k, 1, x); }
function JDisc(u, tau, k, lam, g) {
  const a2 = lam + g;
  const pref = Math.pow(lam / a2, k) * Math.exp(g * tau);
  return pref * Math.max(regIncGamma(k, a2 * (tau + u)) - regIncGamma(k, a2 * tau), 0);
}

// CMYK→RGB: Cyan=D, Magenta=S, Yellow=T; K=1−survivors^γ if useK
function cmyk2rgb(phiS, phiT, phiD, surv, useK, kg) {
  const Kk = useK ? 1 - Math.pow(Math.max(0, Math.min(1, surv)), kg) : 0;
  return [
    Math.round(255 * Math.max(0, Math.min(1, (1 - phiD) * (1 - Kk)))),
    Math.round(255 * Math.max(0, Math.min(1, (1 - phiS) * (1 - Kk)))),
    Math.round(255 * Math.max(0, Math.min(1, (1 - phiT) * (1 - Kk)))),
  ];
}

// ═══════════════════════════════════════════════════════════════════
// DEFAULTS & CONSTANTS
// ═══════════════════════════════════════════════════════════════════

const P0 = {
  k_lag: 3, mu0: 0.69, mu24p: 0.21,
  kS: 3.38, kT: 1.18, kST: 1.91,
  K: 20.0, n: 1.45, KST: 19.3, nST: 1.16,
  a50: 32.1, r0: 0.01,
};

const SC = { S: "#F7A541", T: "#D4C832", D: "#7BC940", dead: "#C94040" };
const ACCENT = "#64FFDA";
const BG = "#0D0D14";
const PANEL = "#14141E";
const BORDER = "#252535";
const DIM = "#555577";
const TXT = "#C8C8D8";

const PARAM_GROUPS = [
  {
    label: "LAG DISTRIBUTION",
    params: [
      { key: "mu0",   label: "μ₀",     tip: "mean lag at age=0 (h)", min: 0.05, max: 5, step: 0.01 },
      { key: "mu24p", label: "μ₂₄′",   tip: "extra mean lag per 24h age", min: 0, max: 3, step: 0.01 },
    ]
  },
  {
    label: "DEATH HAZARDS (shared K, n)",
    params: [
      { key: "kS", label: "κS", tip: "susceptible death prefactor",  min: 0.05, max: 15,  step: 0.05 },
      { key: "kT", label: "κT", tip: "tolerant death prefactor",     min: 0.01, max: 5,   step: 0.01 },
      { key: "K",  label: "K",  tip: "shared reference conc. (μg/mL)", min: 1, max: 200,  step: 0.5,  fmt: v => `${v.toFixed(0)}` },
      { key: "n",  label: "n",  tip: "shared Hill exponent",         min: 0.3, max: 5,   step: 0.05 },
    ]
  },
  {
    label: "S→T SWITCHING",
    params: [
      { key: "kST",  label: "κST",  tip: "switching prefactor",          min: 0.01, max: 10,  step: 0.01 },
      { key: "KST",  label: "KST",  tip: "switching ref. conc. (μg/mL)", min: 1,    max: 200, step: 0.5,  fmt: v => `${v.toFixed(0)}` },
      { key: "nST",  label: "nST",  tip: "switching Hill exponent",      min: 0.3,  max: 5,   step: 0.05 },
      { key: "r0",   label: "r₀",   tip: "baseline switch rate (C=0)",   min: 1e-4, max: 0.1, step: 5e-4, fmt: v => v.toFixed(4) },
    ]
  },
  {
    label: "STRESS MEMORY",
    params: [
      { key: "a50", label: "a₅₀", tip: "half-saturation age (h)", min: 1, max: 200, step: 1, fmt: v => `${v.toFixed(0)}h` },
    ]
  },
];

// ═══════════════════════════════════════════════════════════════════
// UI PRIMITIVES
// ═══════════════════════════════════════════════════════════════════

function Slider({ label, tip, value, min, max, step, onChange, fmt }) {
  return (
    <div style={{ marginBottom: 6 }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "#8888AA", fontFamily: "monospace", marginBottom: 1 }}>
        <span title={tip}>{label}</span>
        <span style={{ color: ACCENT }}>{fmt ? fmt(value) : value.toFixed(3)}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={e => onChange(Number(e.target.value))}
        style={{ width: "100%", accentColor: ACCENT, cursor: "pointer", height: 3 }} />
    </div>
  );
}

function Tag({ children, color = ACCENT, bg = "#0A1A14" }) {
  return (
    <span style={{ background: bg, border: `1px solid ${color}33`, color, fontSize: 9, padding: "1px 6px", borderRadius: 10, fontFamily: "monospace" }}>
      {children}
    </span>
  );
}

function SectionLabel({ children }) {
  return (
    <div style={{ fontSize: 8, color: ACCENT, letterSpacing: 2, marginBottom: 5, marginTop: 10, borderBottom: `1px solid ${BORDER}`, paddingBottom: 3 }}>
      {children}
    </div>
  );
}

// Shared tooltip style for recharts
const TT = { contentStyle: { background: "#0A0A12", border: `1px solid ${BORDER}`, fontSize: 10, padding: "4px 8px" }, itemStyle: { color: TXT }, labelStyle: { color: DIM } };

// X-axis log-concentration ticks
const LOG_TICKS = [-0.5, 0, 1, 2, 3, 3.5];
const logTickFmt = v => ["0.3", "1", "10", "100", "1k", "3k"][[-0.5,0,1,2,3,3.5].indexOf(v)] ?? `10^${v}`;

// ═══════════════════════════════════════════════════════════════════
// CHART COMPONENTS
// ═══════════════════════════════════════════════════════════════════

function StackedArea({ data, xKey, xLabel, xTicks, xFmt, title }) {
  return (
    <div>
      <div style={{ fontSize: 9, color: "#7788AA", fontFamily: "monospace", marginBottom: 3 }}>{title}</div>
      <ResponsiveContainer width="100%" height={155}>
        <AreaChart data={data} margin={{ top: 4, right: 4, bottom: 22, left: 28 }}>
          <CartesianGrid strokeDasharray="2 3" stroke="#1C1C2A" />
          <XAxis dataKey={xKey} stroke={DIM} tick={{ fill: "#667", fontSize: 9 }}
            ticks={xTicks} tickFormatter={xFmt}
            label={{ value: xLabel, position: "insideBottom", offset: -10, fill: "#667", fontSize: 9 }} />
          <YAxis stroke={DIM} tick={{ fill: "#667", fontSize: 9 }} tickCount={5} domain={[0, 1]} />
          <Tooltip {...TT} formatter={(v, n) => [(v * 100).toFixed(3) + "%", n]} />
          <Area type="monotone" dataKey="dead" stackId="1" stroke={SC.dead} fill={SC.dead} fillOpacity={0.9} name="Dead" />
          <Area type="monotone" dataKey="T" stackId="1" stroke={SC.T} fill={SC.T} fillOpacity={0.9} name="Tolerant (T)" />
          <Area type="monotone" dataKey="D" stackId="1" stroke={SC.D} fill={SC.D} fillOpacity={0.9} name="Dormant (D)" />
          <Area type="monotone" dataKey="S" stackId="1" stroke={SC.S} fill={SC.S} fillOpacity={0.9} name="Susceptible (S)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

function PhaseTau({ p, C, age }) {
  const data = useMemo(() => Array.from({ length: 100 }, (_, i) => {
    const tau = i / 99 * 12;
    const r = predict(p, C, tau, age);
    return { tau: +tau.toFixed(2), ...r };
  }), [p, C, age]);
  return <StackedArea data={data} xKey="tau" xLabel="τ (h)" title="vs treatment duration τ" />;
}

function PhaseConc({ p, tau, age }) {
  const data = useMemo(() => Array.from({ length: 100 }, (_, i) => {
    const logC = -0.5 + i / 99 * 4;
    const C = Math.pow(10, logC);
    const r = predict(p, C, tau, age);
    return { logC: +logC.toFixed(3), ...r };
  }), [p, tau, age]);
  return <StackedArea data={data} xKey="logC" xLabel="C (μg/mL)"
    xTicks={LOG_TICKS} xFmt={logTickFmt} title="vs concentration C" />;
}

function PhaseAge({ p, C, tau }) {
  const data = useMemo(() => Array.from({ length: 100 }, (_, i) => {
    const a = i / 99 * 96;
    const r = predict(p, C, tau, a);
    return { a: +a.toFixed(1), ...r };
  }), [p, C, tau]);
  return <StackedArea data={data} xKey="a" xLabel="age (h)" title="vs culture age" />;
}

function HazardChart({ p, age }) {
  const data = useMemo(() => Array.from({ length: 100 }, (_, i) => {
    const logC = -0.5 + i / 99 * 4;
    const C = Math.pow(10, logC);
    return {
      logC: +logC.toFixed(3),
      hS_v: hS(C, p.kS, p.K, p.n),
      hT_v: hT(C, p.kT, p.K, p.n),
      rST_v: rST(C, age, p.kST, p.KST, p.nST, p.a50, p.r0),
    };
  }), [p, age]);
  return (
    <div>
      <div style={{ fontSize: 9, color: "#7788AA", fontFamily: "monospace", marginBottom: 3 }}>Hazard rates vs C  (age = {age.toFixed(0)}h)</div>
      <ResponsiveContainer width="100%" height={155}>
        <LineChart data={data} margin={{ top: 4, right: 4, bottom: 22, left: 28 }}>
          <CartesianGrid strokeDasharray="2 3" stroke="#1C1C2A" />
          <XAxis dataKey="logC" stroke={DIM} tick={{ fill: "#667", fontSize: 9 }}
            ticks={LOG_TICKS} tickFormatter={logTickFmt}
            label={{ value: "C (μg/mL)", position: "insideBottom", offset: -10, fill: "#667", fontSize: 9 }} />
          <YAxis stroke={DIM} tick={{ fill: "#667", fontSize: 9 }} tickCount={5} />
          <Tooltip {...TT} formatter={(v, n) => [v.toFixed(4), n]} labelFormatter={v => `C ≈ ${Math.pow(10, v).toFixed(2)} μg/mL`} />
          <Line type="monotone" dataKey="hS_v" stroke="#C900C9" dot={false} name="hS  (S death)" strokeWidth={2} />
          <Line type="monotone" dataKey="hT_v" stroke="#FF8C00" dot={false} name="hT  (T death)" strokeWidth={2} />
          <Line type="monotone" dataKey="rST_v" stroke="#00CBCB" dot={false} name="rST (S→T switch)" strokeWidth={2} strokeDasharray="5 2" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

function LagChart({ p, age }) {
  const lam = getLambda(p, age);
  const meanLag = p.k_lag / lam;
  const data = useMemo(() => Array.from({ length: 100 }, (_, i) => {
    const t = i / 99 * meanLag * 5;
    return { t: +t.toFixed(3), pdf: erlangPDF(p.k_lag, lam, t), sf: erlangSF(p.k_lag, lam, t) };
  }), [p, age]);
  return (
    <div>
      <div style={{ fontSize: 9, color: "#7788AA", fontFamily: "monospace", marginBottom: 3 }}>
        Lag distribution  Erlang(k={p.k_lag}, λ={lam.toFixed(3)}) · mean = {meanLag.toFixed(2)}h
      </div>
      <ResponsiveContainer width="100%" height={155}>
        <LineChart data={data} margin={{ top: 4, right: 4, bottom: 22, left: 28 }}>
          <CartesianGrid strokeDasharray="2 3" stroke="#1C1C2A" />
          <XAxis dataKey="t" stroke={DIM} tick={{ fill: "#667", fontSize: 9 }} tickCount={5}
            label={{ value: "t (h)", position: "insideBottom", offset: -10, fill: "#667", fontSize: 9 }} />
          <YAxis stroke={DIM} tick={{ fill: "#667", fontSize: 9 }} tickCount={5} />
          <Tooltip {...TT} formatter={(v, n) => [v.toFixed(4), n]} labelFormatter={v => `t = ${Number(v).toFixed(2)}h`} />
          <Line type="monotone" dataKey="pdf" stroke={ACCENT} dot={false} name="f(t)  PDF" strokeWidth={2} />
          <Line type="monotone" dataKey="sf"  stroke="#FF6B6B" dot={false} name="S(t)  Survival" strokeWidth={2} strokeDasharray="5 2" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

function SwitchingAgeLines({ p }) {
  const AGES = [6, 12, 24, 48, 72];
  const COLS = ["#334", "#447", "#559", "#66C", "#88EE"];
  const data = useMemo(() => Array.from({ length: 100 }, (_, i) => {
    const logC = -0.5 + i / 99 * 4;
    const C = Math.pow(10, logC);
    const entry = { logC: +logC.toFixed(3) };
    AGES.forEach(a => { entry[`a${a}`] = rST(C, a, p.kST, p.KST, p.nST, p.a50, p.r0); });
    return entry;
  }), [p]);
  return (
    <div>
      <div style={{ fontSize: 9, color: "#7788AA", fontFamily: "monospace", marginBottom: 3 }}>rST vs C  at multiple culture ages (memory effect)</div>
      <ResponsiveContainer width="100%" height={155}>
        <LineChart data={data} margin={{ top: 4, right: 4, bottom: 22, left: 28 }}>
          <CartesianGrid strokeDasharray="2 3" stroke="#1C1C2A" />
          <XAxis dataKey="logC" stroke={DIM} tick={{ fill: "#667", fontSize: 9 }}
            ticks={LOG_TICKS} tickFormatter={logTickFmt}
            label={{ value: "C (μg/mL)", position: "insideBottom", offset: -10, fill: "#667", fontSize: 9 }} />
          <YAxis stroke={DIM} tick={{ fill: "#667", fontSize: 9 }} tickCount={5} />
          <Tooltip {...TT} formatter={(v, n) => [v.toFixed(5), n]} labelFormatter={v => `C ≈ ${Math.pow(10, v).toFixed(2)} μg/mL`} />
          {AGES.map((a, i) => (
            <Line key={a} dataKey={`a${a}`} stroke={COLS[i]} dot={false} name={`age ${a}h`} strokeWidth={1.5} />
          ))}
          <Legend wrapperStyle={{ fontSize: 9, color: TXT }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

// ─── CMYK Heatmap (canvas) ───────────────────────────────────────

function CMYKHeatmap({ p, age, nC = 70, nTau = 70, kGamma, useK }) {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = nC; canvas.height = nTau;
    const ctx = canvas.getContext("2d");
    const buf = new Uint8ClampedArray(nC * nTau * 4);
    for (let i = 0; i < nTau; i++) {
      const tau = i / (nTau - 1) * 8;
      for (let j = 0; j < nC; j++) {
        const logC = -0.5 + j / (nC - 1) * 4;
        const C = Math.pow(10, logC);
        const r = predict(p, C, tau, age);
        const surv = r.S + r.T + r.D;
        const d = Math.max(surv, 1e-12);
        const [R, G, B] = cmyk2rgb(r.S / d, r.T / d, r.D / d, surv, useK, kGamma);
        const idx = ((nTau - 1 - i) * nC + j) * 4;
        buf[idx] = R; buf[idx + 1] = G; buf[idx + 2] = B; buf[idx + 3] = 255;
      }
    }
    ctx.putImageData(new ImageData(buf, nC, nTau), 0, 0);
  }, [p, age, kGamma, useK]);

  return (
    <div style={{ position: "relative", paddingLeft: 30 }}>
      {/* Y-axis labels */}
      <div style={{ position: "absolute", left: 0, top: 0, height: 200, display: "flex", flexDirection: "column", justifyContent: "space-between", fontSize: 8, color: DIM, fontFamily: "monospace" }}>
        <span>8h</span><span>6h</span><span>4h</span><span>2h</span><span>0h</span>
      </div>
      <canvas ref={canvasRef} style={{ width: "100%", height: 200, imageRendering: "pixelated", display: "block" }} />
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 2, fontSize: 8, color: DIM, fontFamily: "monospace" }}>
        <span>0.3</span><span>1</span><span>10</span><span>100</span><span>1000 μg/mL</span>
      </div>
      <div style={{ textAlign: "center", fontSize: 8, color: DIM, marginTop: 1 }}>concentration C →</div>
    </div>
  );
}

// Ternary hue key (canvas)
function TernaryKey({ size = 110 }) {
  const canvasRef = useRef(null);
  useEffect(() => {
    const c = canvasRef.current; if (!c) return;
    c.width = size; c.height = size;
    const ctx = c.getContext("2d");
    const h = Math.sqrt(3) / 2;
    const W = size, H = size;
    const img = ctx.createImageData(W, H);
    const buf = img.data;
    for (let py = 0; py < H; py++) {
      for (let px = 0; px < W; px++) {
        const x = px / W, y = (H - 1 - py) / H;
        const D = y / h, T = x - 0.5 * D, S = 1 - T - D;
        const idx = (py * W + px) * 4;
        if (S >= 0 && T >= 0 && D >= 0) {
          buf[idx] = Math.round(255 * (1 - D));
          buf[idx + 1] = Math.round(255 * (1 - S));
          buf[idx + 2] = Math.round(255 * (1 - T));
          buf[idx + 3] = 255;
        } else {
          buf[idx] = 13; buf[idx + 1] = 13; buf[idx + 2] = 20; buf[idx + 3] = 255;
        }
      }
    }
    ctx.putImageData(img, 0, 0);
    ctx.strokeStyle = "#555"; ctx.lineWidth = 0.8;
    ctx.beginPath();
    ctx.moveTo(0, H); ctx.lineTo(W, H); ctx.lineTo(W / 2, H * (1 - h)); ctx.closePath();
    ctx.stroke();
  }, [size]);
  return (
    <div style={{ textAlign: "center" }}>
      <canvas ref={canvasRef} style={{ width: size, height: size }} />
      <div style={{ fontSize: 8, color: DIM, fontFamily: "monospace", lineHeight: 1.7, marginTop: 2 }}>
        <div style={{ color: "#00CBCB" }}>▲ D Dormant (Cyan)</div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 7.5 }}>
          <span style={{ color: "#C900C9" }}>S Suscept.</span>
          <span style={{ color: "#F7BB25" }}>T Tolerant</span>
        </div>
      </div>
    </div>
  );
}

// Survival fraction heatmap (grayscale)
function SurvivalHeatmap({ p, age, nC = 70, nTau = 70 }) {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    canvas.width = nC; canvas.height = nTau;
    const ctx = canvas.getContext("2d");
    const buf = new Uint8ClampedArray(nC * nTau * 4);
    // precompute min/max for log-scaling brightness
    const vals = [];
    for (let i = 0; i < nTau; i++) {
      const tau = i / (nTau - 1) * 8;
      for (let j = 0; j < nC; j++) {
        const C = Math.pow(10, -0.5 + j / (nC - 1) * 4);
        const r = predict(p, C, tau, age);
        vals.push(r.S + r.T + r.D);
      }
    }
    const logMin = Math.log10(Math.max(Math.min(...vals.filter(v => v > 0)), 1e-7));
    const logMax = Math.log10(Math.max(...vals));
    const range = logMax - logMin || 1;
    let vi = 0;
    for (let i = 0; i < nTau; i++) {
      for (let j = 0; j < nC; j++) {
        const v = vals[vi++];
        const bright = v <= 0 ? 0 : Math.max(0, Math.min(1, (Math.log10(v) - logMin) / range));
        const pix = Math.round(bright * 255);
        const idx = ((nTau - 1 - i) * nC + j) * 4;
        buf[idx] = pix; buf[idx + 1] = Math.round(pix * 0.9); buf[idx + 2] = Math.round(pix * 0.6); buf[idx + 3] = 255;
      }
    }
    ctx.putImageData(new ImageData(buf, nC, nTau), 0, 0);
  }, [p, age]);
  return (
    <div style={{ position: "relative", paddingLeft: 30 }}>
      <div style={{ position: "absolute", left: 0, top: 0, height: 200, display: "flex", flexDirection: "column", justifyContent: "space-between", fontSize: 8, color: DIM, fontFamily: "monospace" }}>
        <span>8h</span><span>4h</span><span>0h</span>
      </div>
      <canvas ref={canvasRef} style={{ width: "100%", height: 200, imageRendering: "pixelated", display: "block" }} />
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 2, fontSize: 8, color: DIM, fontFamily: "monospace" }}>
        <span>0.3</span><span>1</span><span>10</span><span>100</span><span>1000 μg/mL</span>
      </div>
    </div>
  );
}

// ─── Post-treatment charts ────────────────────────────────────────

function RegrowthComposition({ p, C, age, u }) {
  const g = Math.log(2);
  const lam = getLambda(p, age);
  const data = useMemo(() => Array.from({ length: 100 }, (_, i) => {
    const tau = i / 99 * 8;
    const r = predict(p, C, tau, age);
    const J = JDisc(u, tau, p.k_lag, lam, g);
    const denom = Math.max(r.S + r.T + J, 1e-12);
    return { tau: +tau.toFixed(2), S: r.S / denom, T: r.T / denom, D: J / denom };
  }), [p, C, age, u]);
  return <StackedArea data={data} xKey="tau" xLabel="τ (h)" title={`Descendant composition at u = ${u.toFixed(0)}h post-removal`} />;
}

function RegrowthMass({ p, C, age, u }) {
  const g = Math.log(2);
  const lam = getLambda(p, age);
  const data = useMemo(() => Array.from({ length: 100 }, (_, i) => {
    const tau = i / 99 * 8;
    const r = predict(p, C, tau, age);
    const J = JDisc(u, tau, p.k_lag, lam, g);
    const denom = r.S + r.T + J;
    return { tau: +tau.toFixed(2), R: Math.exp(g * u) * denom };
  }), [p, C, age, u]);
  return (
    <div>
      <div style={{ fontSize: 9, color: "#7788AA", fontFamily: "monospace", marginBottom: 3 }}>
        Total regrown mass N(u)/N₀  (log₁₀ scale) · g = ln2 ≈ 0.693 h⁻¹
      </div>
      <ResponsiveContainer width="100%" height={155}>
        <LineChart data={data} margin={{ top: 4, right: 4, bottom: 22, left: 35 }}>
          <CartesianGrid strokeDasharray="2 3" stroke="#1C1C2A" />
          <XAxis dataKey="tau" stroke={DIM} tick={{ fill: "#667", fontSize: 9 }} tickCount={5}
            label={{ value: "τ (h)", position: "insideBottom", offset: -10, fill: "#667", fontSize: 9 }} />
          <YAxis stroke={DIM} tick={{ fill: "#667", fontSize: 9 }} tickCount={5}
            scale="log" domain={["auto", "auto"]} tickFormatter={v => v.toExponential(0)} />
          <Tooltip {...TT} formatter={(v) => [v.toExponential(3), "N(u)/N₀"]} />
          <Line type="monotone" dataKey="R" stroke={ACCENT} dot={false} name="N(u)/N₀" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// MAIN DASHBOARD
// ═══════════════════════════════════════════════════════════════════

const TABS = [
  { id: "phase",    label: "PHASE" },
  { id: "heatmap",  label: "HEATMAP" },
  { id: "kinetics", label: "KINETICS" },
  { id: "regrowth", label: "REGROWTH" },
];

export default function App() {
  const [params, setParams] = useState(P0);
  const [cond, setCond] = useState({ C: 50, tau: 4, age: 24 });
  const [tab, setTab] = useState("phase");
  const [sidebar, setSidebar] = useState(true);
  const [u, setU] = useState(24);
  const [kGamma, setKGamma] = useState(0.35);
  const [useK, setUseK] = useState(true);

  const setP = (k, v) => setParams(p => ({ ...p, [k]: v }));
  const setC = (k, v) => setCond(c => ({ ...c, [k]: v }));

  const pred = useMemo(() => predict(params, cond.C, cond.tau, cond.age), [params, cond]);
  const total = pred.S + pred.T + pred.D + pred.dead;

  const legend = (
    <div style={{ display: "flex", gap: 14, flexWrap: "wrap", fontSize: 9, fontFamily: "monospace", color: "#8888AA" }}>
      {[["S", "Susceptible survivors"], ["T", "Tolerant survivors"], ["D", "Dormant (pre-existing)"], ["dead", "Dead"]].map(([k, lbl]) => (
        <span key={k} style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <span style={{ width: 10, height: 10, background: SC[k], display: "inline-block", borderRadius: 2 }} />
          {lbl}
        </span>
      ))}
    </div>
  );

  return (
    <div style={{ height: "100vh", background: BG, color: TXT, fontFamily: "'Courier New', monospace", display: "flex", flexDirection: "column", overflow: "hidden", fontSize: 11 }}>

      {/* ── Header ── */}
      <div style={{ background: PANEL, borderBottom: `1px solid ${BORDER}`, padding: "7px 14px", display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
        <div style={{ fontSize: 12, fontWeight: "bold", letterSpacing: 3, color: ACCENT }}>STDP</div>
        <div style={{ fontSize: 9, color: DIM, flex: 1 }}>Survival · Tolerance · Dormancy · Persistence  —  Interactive Model Explorer</div>
        <Tag>k_lag = {params.k_lag}</Tag>
        <button onClick={() => setSidebar(s => !s)}
          style={{ background: "none", border: `1px solid ${BORDER}`, color: DIM, fontSize: 9, padding: "2px 8px", cursor: "pointer", borderRadius: 2, fontFamily: "monospace" }}>
          {sidebar ? "◀" : "▶"} PARAMS
        </button>
        <button onClick={() => setParams(P0)}
          style={{ background: "none", border: `1px solid ${BORDER}`, color: DIM, fontSize: 9, padding: "2px 8px", cursor: "pointer", borderRadius: 2, fontFamily: "monospace" }}>
          RESET
        </button>
      </div>

      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>

        {/* ── Sidebar ── */}
        {sidebar && (
          <div style={{ width: 220, borderRight: `1px solid ${BORDER}`, padding: "10px 10px", overflowY: "auto", background: PANEL, flexShrink: 0 }}>

            <SectionLabel>CONDITIONS</SectionLabel>
            <Slider label="C  (μg/mL)" tip="Antibiotic concentration" value={cond.C} min={0.5} max={300} step={0.5} onChange={v => setC("C", v)} fmt={v => `${v.toFixed(1)}`} />
            <Slider label="τ  (h)"     tip="Treatment duration"      value={cond.tau} min={0} max={12} step={0.1} onChange={v => setC("tau", v)} fmt={v => `${v.toFixed(1)}`} />
            <Slider label="age  (h)"   tip="Culture age at treatment" value={cond.age} min={1} max={96} step={0.5} onChange={v => setC("age", v)} fmt={v => `${v.toFixed(0)}`} />

            {/* Live prediction readout */}
            <div style={{ background: "#080810", border: `1px solid ${BORDER}`, borderRadius: 3, padding: "6px 8px", margin: "8px 0 4px", fontSize: 9, lineHeight: 1.9 }}>
              <div style={{ color: ACCENT, fontSize: 8, letterSpacing: 2, marginBottom: 3 }}>PREDICTION</div>
              {[["S (incomplete)", pred.S, SC.S], ["T (induced)", pred.T, SC.T], ["D (pre-existing)", pred.D, SC.D], ["Dead", pred.dead, SC.dead]].map(([lbl, v, c]) => (
                <div key={lbl} style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: c }}>{lbl}</span>
                  <span style={{ color: "#CCC" }}>{(v * 100).toFixed(3)}%</span>
                </div>
              ))}
              <div style={{ borderTop: `1px solid ${BORDER}`, marginTop: 3, paddingTop: 3, display: "flex", justifyContent: "space-between", color: DIM }}>
                <span>Σ survivors</span>
                <span style={{ color: ACCENT }}>{((pred.S + pred.T + pred.D) * 100).toFixed(3)}%</span>
              </div>
              <div style={{ marginTop: 4, fontSize: 8, color: DIM, lineHeight: 1.5 }}>
                hS = {hS(cond.C, params.kS, params.K, params.n).toFixed(4)}<br />
                hT = {hT(cond.C, params.kT, params.K, params.n).toFixed(4)}<br />
                rST = {rST(cond.C, cond.age, params.kST, params.KST, params.nST, params.a50, params.r0).toFixed(4)}
              </div>
            </div>

            {/* Parameter groups */}
            {PARAM_GROUPS.map(grp => (
              <div key={grp.label}>
                <SectionLabel>{grp.label}</SectionLabel>
                {grp.params.map(s => (
                  <Slider key={s.key} label={s.label} tip={s.tip} value={params[s.key]}
                    min={s.min} max={s.max} step={s.step} onChange={v => setP(s.key, v)} fmt={s.fmt} />
                ))}
              </div>
            ))}

            <SectionLabel>ERLANG SHAPE  k_lag</SectionLabel>
            <div style={{ display: "flex", gap: 3 }}>
              {[1, 2, 3, 4, 5].map(k => (
                <button key={k} onClick={() => setP("k_lag", k)}
                  style={{ flex: 1, background: params.k_lag === k ? "#64FFDA22" : "none", border: `1px solid ${params.k_lag === k ? ACCENT : BORDER}`, color: params.k_lag === k ? ACCENT : DIM, fontSize: 10, padding: "3px", cursor: "pointer", borderRadius: 2, fontFamily: "monospace" }}>
                  {k}
                </button>
              ))}
            </div>

          </div>
        )}

        {/* ── Main panel ── */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>

          {/* Tabs */}
          <div style={{ display: "flex", borderBottom: `1px solid ${BORDER}`, background: PANEL, flexShrink: 0 }}>
            {TABS.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)}
                style={{ padding: "7px 16px", fontSize: 9, background: "none", border: "none", borderBottom: `2px solid ${t.id === tab ? ACCENT : "transparent"}`, color: t.id === tab ? ACCENT : DIM, cursor: "pointer", fontFamily: "monospace", letterSpacing: 1.5 }}>
                {t.label}
              </button>
            ))}
          </div>

          {/* Content */}
          <div style={{ flex: 1, overflowY: "auto", padding: 14 }}>

            {/* ── PHASE ── */}
            {tab === "phase" && (
              <div>
                {legend}
                <div style={{ marginTop: 12, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }}>
                  <PhaseTau p={params} C={cond.C} age={cond.age} />
                  <PhaseConc p={params} tau={cond.tau} age={cond.age} />
                  <PhaseAge p={params} C={cond.C} tau={cond.tau} />
                </div>
                <div style={{ marginTop: 10, fontSize: 8.5, color: DIM, lineHeight: 1.7, background: "#0A0A12", border: `1px solid ${BORDER}`, borderRadius: 3, padding: "6px 10px" }}>
                  <strong style={{ color: "#9999BB" }}>Left:</strong> Composition as τ increases at fixed C = {cond.C} μg/mL, age = {cond.age}h. &nbsp;
                  <strong style={{ color: "#9999BB" }}>Centre:</strong> Composition over the concentration range at τ = {cond.tau}h, age = {cond.age}h. &nbsp;
                  <strong style={{ color: "#9999BB" }}>Right:</strong> Composition as culture age increases at C = {cond.C} μg/mL, τ = {cond.tau}h (stress-memory effect via m(a)).
                  Each panel sums to 1; stacked areas show fractions of initial N₀.
                </div>
              </div>
            )}

            {/* ── HEATMAP ── */}
            {tab === "heatmap" && (
              <div>
                <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 10, flexWrap: "wrap" }}>
                  <div style={{ fontSize: 9, color: "#8888AA" }}>
                    Hue: <span style={{ color: "#00CBCB" }}>■ D</span>·
                    <span style={{ color: "#C900C9" }}> ■ S</span>·
                    <span style={{ color: "#F7BB25" }}> ■ T</span> (CMY colorspace)
                  </div>
                  <label style={{ fontSize: 9, color: "#8888AA", display: "flex", alignItems: "center", gap: 4, cursor: "pointer" }}>
                    <input type="checkbox" checked={useK} onChange={e => setUseK(e.target.checked)} style={{ accentColor: ACCENT }} />
                    Brightness encodes total survivors
                  </label>
                  {useK && (
                    <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 9, color: "#8888AA" }}>
                      γ:
                      <input type="range" min={0.1} max={2} step={0.05} value={kGamma}
                        onChange={e => setKGamma(Number(e.target.value))}
                        style={{ width: 70, accentColor: ACCENT }} />
                      <span style={{ color: ACCENT }}>{kGamma.toFixed(2)}</span>
                    </div>
                  )}
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 140px", gap: 20, alignItems: "start" }}>
                  <div>
                    <div style={{ fontSize: 9, color: "#7788AA", fontFamily: "monospace", marginBottom: 4 }}>
                      Composition map · age = {cond.age.toFixed(0)}h
                    </div>
                    <CMYKHeatmap p={params} age={cond.age} kGamma={kGamma} useK={useK} nC={80} nTau={80} />
                  </div>
                  <div>
                    <div style={{ fontSize: 9, color: "#7788AA", fontFamily: "monospace", marginBottom: 4 }}>
                      Total survivor fraction  S(τ,C) = π_S + π_T + π_D
                    </div>
                    <SurvivalHeatmap p={params} age={cond.age} nC={80} nTau={80} />
                    <div style={{ fontSize: 8, color: DIM, marginTop: 4 }}>Brightness ∝ log₁₀(survivors). Gold=high, black=zero.</div>
                  </div>
                  <TernaryKey size={120} />
                </div>

                <div style={{ marginTop: 10, fontSize: 8.5, color: DIM, lineHeight: 1.7, background: "#0A0A12", border: `1px solid ${BORDER}`, borderRadius: 3, padding: "6px 10px" }}>
                  X-axis: concentration C, log₁₀ scale 0.3–1000 μg/mL. Y-axis: treatment duration τ, 0–8h. Age = {cond.age.toFixed(0)}h (adjust via sidebar).
                  {useK ? " Darkness encodes 1 − survivors^γ." : " Pure hue only; all brightnesses equal."}
                </div>
              </div>
            )}

            {/* ── KINETICS ── */}
            {tab === "kinetics" && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                <HazardChart p={params} age={cond.age} />
                <LagChart p={params} age={cond.age} />
                <div style={{ gridColumn: "1/-1" }}>
                  <SwitchingAgeLines p={params} />
                </div>
                <div style={{ gridColumn: "1/-1", fontSize: 8.5, color: DIM, lineHeight: 1.7, background: "#0A0A12", border: `1px solid ${BORDER}`, borderRadius: 3, padding: "6px 10px" }}>
                  <strong style={{ color: "#9999BB" }}>Top-left:</strong> Dose-response curves hS(C), hT(C), rST(C) — all in log(1+x) form. Constraint: κT {"<"} κS with shared K,n ensures h_T {"<"} h_S ∀C. &nbsp;
                  <strong style={{ color: "#9999BB" }}>Top-right:</strong> Erlang(k_lag, λ) lag distribution for current age.
                  λ = k_lag / (μ₀ + age/24·μ₂₄′). &nbsp;
                  <strong style={{ color: "#9999BB" }}>Bottom:</strong> rST at multiple ages — illustrates the m(a) = a/(a+a₅₀) stress-memory saturation.
                </div>
              </div>
            )}

            {/* ── REGROWTH ── */}
            {tab === "regrowth" && (
              <div>
                <div style={{ display: "flex", gap: 16, alignItems: "center", marginBottom: 10 }}>
                  <div style={{ fontSize: 9, color: "#8888AA" }}>Post-treatment time u:</div>
                  <input type="range" min={1} max={200} step={1} value={u}
                    onChange={e => setU(Number(e.target.value))}
                    style={{ width: 120, accentColor: ACCENT }} />
                  <span style={{ color: ACCENT, fontSize: 10, fontFamily: "monospace" }}>u = {u}h</span>
                  <span style={{ fontSize: 9, color: DIM }}>2^{(u * Math.log2(Math.E) * Math.log(2)).toFixed(1)} × N₀ max theoretical</span>
                </div>

                {legend}
                <div style={{ marginTop: 12, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                  <RegrowthComposition p={params} C={cond.C} age={cond.age} u={u} />
                  <RegrowthMass p={params} C={cond.C} age={cond.age} u={u} />
                </div>

                <div style={{ marginTop: 10, fontSize: 8.5, color: DIM, lineHeight: 1.7, background: "#0A0A12", border: `1px solid ${BORDER}`, borderRadius: 3, padding: "6px 10px" }}>
                  <strong style={{ color: "#9999BB" }}>Left:</strong> Fractional contribution to the regrown population at time u, as a function of τ.
                  S: incomplete-treatment survivors (grew exponentially from τ). T: induced tolerant survivors. D: deep persisters — delayed by residual lag before contributing. <br />
                  <strong style={{ color: "#9999BB" }}>Right:</strong> Total regrown mass N(u)/N₀ on log scale. Minima arise because intermediate τ kills many cells before persisters dominate.
                  g = ln 2 ≈ 0.693 h⁻¹ (1h doubling). Varying u shows how D-lineage dominance emerges over time.
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}