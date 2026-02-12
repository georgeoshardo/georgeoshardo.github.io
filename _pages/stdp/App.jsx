// STDP Persistence Model — Interactive Visualization Dashboard
// All math ported from Python; no external data dependency.
import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, LineChart, Line,
  ResponsiveContainer, CartesianGrid, Legend, ComposedChart, ReferenceLine
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

function computeConvolutionSeries(p, cond, nPts = 240) {
  const tau = Math.max(0, cond.tau);
  const lam = getLambda(p, cond.age);
  const meanLag = p.k_lag / Math.max(lam, 1e-12);
  const hs = hS(cond.C, p.kS, p.K, p.n);
  const ht = hT(cond.C, p.kT, p.K, p.n);
  const r = rST(cond.C, cond.age, p.kST, p.KST, p.nST, p.a50, p.r0);
  const H = hs + r;
  const isDegenerate = Math.abs(H - ht) <= 1e-10;
  const tMax = Math.min(24, Math.max(1.15 * tau, 4 * meanLag, 8));
  const points = Math.max(3, Math.floor(nPts));
  const step = tMax / (points - 1);
  const dataRaw = [];
  let maxF = 0;
  let maxPS = 0;
  let maxPX = 0;

  for (let i = 0; i < points; i++) {
    const t = i * step;
    const pr = predict(p, cond.C, t, cond.age);
    const fLag = erlangPDF(p.k_lag, lam, t);
    const pS = Math.exp(-H * t);
    let pX;
    if (isDegenerate) {
      pX = r * t * Math.exp(-ht * t);
    } else {
      pX = (r / (H - ht)) * (Math.exp(-ht * t) - Math.exp(-H * t));
    }
    pX = Math.max(0, pX);
    maxF = Math.max(maxF, fLag);
    maxPS = Math.max(maxPS, pS);
    maxPX = Math.max(maxPX, pX);
    dataRaw.push({ t: +t.toFixed(4), S_t: pr.S, X_t: pr.T, fLag, pS, pX });
  }

  const data = dataRaw.map(d => ({
    ...d,
    fNorm: maxF > 0 ? d.fLag / maxF : 0,
    pSNorm: maxPS > 0 ? d.pS / maxPS : 0,
    pXNorm: maxPX > 0 ? d.pX / maxPX : 0,
  }));

  return { data, tau, tMax };
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
    label: "S→X SWITCHING",
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
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#8888AA", fontFamily: "monospace", marginBottom: 1 }}>
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
    <span style={{ background: bg, border: `1px solid ${color}33`, color, fontSize: 11, padding: "1px 6px", borderRadius: 10, fontFamily: "monospace" }}>
      {children}
    </span>
  );
}

function SectionLabel({ children }) {
  return (
    <div style={{ fontSize: 10, color: ACCENT, letterSpacing: 2, marginBottom: 5, marginTop: 10, borderBottom: `1px solid ${BORDER}`, paddingBottom: 3 }}>
      {children}
    </div>
  );
}

function useMathJax(tex) {
  const ref = useRef(null);
  useEffect(() => {
    if (typeof window === "undefined") return undefined;
    let cancelled = false;
    let timer = null;
    const run = (tries = 0) => {
      if (cancelled) return;
      const mj = window.MathJax;
      const node = ref.current;
      if (node && mj && typeof mj.typesetPromise === "function") {
        if (typeof mj.typesetClear === "function") mj.typesetClear([node]);
        mj.typesetPromise([node]).catch(() => {});
        return;
      }
      if (tries < 20) timer = setTimeout(() => run(tries + 1), 120);
    };
    run();
    return () => { cancelled = true; if (timer) clearTimeout(timer); };
  }, [tex]);
  return ref;
}

function MathDisplay({ tex, style }) {
  const ref = useMathJax(tex);
  return (
    <div ref={ref} style={{ color: TXT, fontSize: 10.6, lineHeight: 1.7, ...style }}>
      {`\\[${tex}\\]`}
    </div>
  );
}

// Shared tooltip style for recharts
const TT = { contentStyle: { background: "#0A0A12", border: `1px solid ${BORDER}`, fontSize: 12, padding: "4px 8px" }, itemStyle: { color: TXT }, labelStyle: { color: DIM } };

// X-axis log-concentration ticks
const LOG_TICKS = [-0.5, 0, 1, 2, 3, 3.5];
const logTickFmt = v => ["0.3", "1", "10", "100", "1k", "3k"][[-0.5,0,1,2,3,3.5].indexOf(v)] ?? `10^${v}`;
const fmtVal = (v, d = 4) => Number.isFinite(v) ? v.toFixed(d) : "0";
const fmtPct = v => `${(100 * Math.max(0, v)).toFixed(3)}%`;

function modelSnapshot(p, cond) {
  const m = cond.age / (cond.age + p.a50);
  const phiShared = cond.C <= 0 ? 0 : Math.pow(cond.C / p.K, p.n);
  const phiSwitch = cond.C <= 0 ? 0 : Math.pow(cond.C / p.KST, p.nST);
  const hs = hS(cond.C, p.kS, p.K, p.n);
  const ht = hT(cond.C, p.kT, p.K, p.n);
  const r = rST(cond.C, cond.age, p.kST, p.KST, p.nST, p.a50, p.r0);
  const H = hs + r;
  const lam = getLambda(p, cond.age);
  const sfTau = erlangSF(p.k_lag, lam, cond.tau);
  const pdfTau = erlangPDF(p.k_lag, lam, cond.tau);
  const hLagNow = pdfTau / Math.max(sfTau, 1e-12);
  return { m, phiShared, phiSwitch, hs, ht, r, H, lam, sfTau, pdfTau, hLagNow };
}

function EquationCard({ title, children }) {
  return (
    <div style={{ background: "#0A0A12", border: `1px solid ${BORDER}`, borderRadius: 4, padding: "8px 10px" }}>
      <div style={{ fontSize: 10, letterSpacing: 1.6, color: ACCENT, marginBottom: 5 }}>{title}</div>
      {children}
    </div>
  );
}

function LiveMathStrip({ p, cond, pred }) {
  const s = useMemo(() => modelSnapshot(p, cond), [p, cond]);
  return (
    <div style={{ marginBottom: 12, background: "#0A0A12", border: `1px solid ${BORDER}`, borderRadius: 4, padding: "7px 10px", lineHeight: 1.6 }}>
      <div style={{ fontSize: 10, color: ACCENT, letterSpacing: 1.4, marginBottom: 4 }}>
        LIVE MODEL READOUT · D --hL(t;a)→ S --rS→X(C;a)→ X, with death exits from S and X
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(165px, 1fr))", gap: 8, fontSize: 10.5, color: DIM }}>
        <div>m(a) = a/(a+a50) = <span style={{ color: TXT }}>{fmtVal(s.m, 3)}</span></div>
        <div>phiS = (C/K)^n = <span style={{ color: TXT }}>{fmtVal(s.phiShared, 3)}</span></div>
        <div>phiS→X = (C/KST)^nST = <span style={{ color: TXT }}>{fmtVal(s.phiSwitch, 3)}</span></div>
        <div>hS(C) = <span style={{ color: SC.S }}>{fmtVal(s.hs)}</span></div>
        <div>hX(C) = <span style={{ color: SC.T }}>{fmtVal(s.ht)}</span></div>
        <div>rS→X(C;a) = <span style={{ color: "#00CBCB" }}>{fmtVal(s.r)}</span></div>
        <div>H = hS + rS→X = <span style={{ color: ACCENT }}>{fmtVal(s.H)}</span></div>
        <div>hL(t=τ;a) = fL/SL = <span style={{ color: SC.D }}>{fmtVal(s.hLagNow)}</span></div>
      </div>
      <div style={{ marginTop: 5, fontSize: 10, color: "#7788AA" }}>
        Survivor split at current sliders: S={fmtPct(pred.S)} · X={fmtPct(pred.T)} · D={fmtPct(pred.D)} · dead={fmtPct(pred.dead)}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// CHART COMPONENTS
// ═══════════════════════════════════════════════════════════════════

function StackedArea({ data, xKey, xLabel, xTicks, xFmt, title }) {
  return (
    <div>
      <div style={{ fontSize: 11, color: "#7788AA", fontFamily: "monospace", marginBottom: 3 }}>{title}</div>
      <ResponsiveContainer width="100%" height={155}>
        <AreaChart data={data} margin={{ top: 4, right: 4, bottom: 22, left: 28 }}>
          <CartesianGrid strokeDasharray="2 3" stroke="#1C1C2A" />
          <XAxis dataKey={xKey} stroke={DIM} tick={{ fill: "#667", fontSize: 11 }}
            ticks={xTicks} tickFormatter={xFmt}
            label={{ value: xLabel, position: "insideBottom", offset: -10, fill: "#667", fontSize: 11 }} />
          <YAxis stroke={DIM} tick={{ fill: "#667", fontSize: 11 }} tickCount={5} domain={[0, 1]} />
          <Tooltip {...TT} formatter={(v, n) => [(v * 100).toFixed(3) + "%", n]} />
          <Area type="monotone" dataKey="dead" stackId="1" stroke={SC.dead} fill={SC.dead} fillOpacity={0.9} name="Dead" />
          <Area type="monotone" dataKey="T" stackId="1" stroke={SC.T} fill={SC.T} fillOpacity={0.9} name="Tolerant (X)" />
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
      <div style={{ fontSize: 11, color: "#7788AA", fontFamily: "monospace", marginBottom: 3 }}>Hazard rates vs C  (age = {age.toFixed(0)}h)</div>
      <ResponsiveContainer width="100%" height={155}>
        <LineChart data={data} margin={{ top: 4, right: 4, bottom: 22, left: 28 }}>
          <CartesianGrid strokeDasharray="2 3" stroke="#1C1C2A" />
          <XAxis dataKey="logC" stroke={DIM} tick={{ fill: "#667", fontSize: 11 }}
            ticks={LOG_TICKS} tickFormatter={logTickFmt}
            label={{ value: "C (μg/mL)", position: "insideBottom", offset: -10, fill: "#667", fontSize: 11 }} />
          <YAxis stroke={DIM} tick={{ fill: "#667", fontSize: 11 }} tickCount={5} />
          <Tooltip {...TT} formatter={(v, n) => [v.toFixed(4), n]} labelFormatter={v => `C ≈ ${Math.pow(10, v).toFixed(2)} μg/mL`} />
          <Line type="monotone" dataKey="hS_v" stroke="#C900C9" dot={false} name="hS  (S death)" strokeWidth={2} />
          <Line type="monotone" dataKey="hT_v" stroke="#FF8C00" dot={false} name="hX  (X death)" strokeWidth={2} />
          <Line type="monotone" dataKey="rST_v" stroke="#00CBCB" dot={false} name="rS→X (switch)" strokeWidth={2} strokeDasharray="5 2" />
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
      <div style={{ fontSize: 11, color: "#7788AA", fontFamily: "monospace", marginBottom: 3 }}>
        Lag distribution  Erlang(k={p.k_lag}, λ={lam.toFixed(3)}) · mean = {meanLag.toFixed(2)}h
      </div>
      <ResponsiveContainer width="100%" height={155}>
        <LineChart data={data} margin={{ top: 4, right: 4, bottom: 22, left: 28 }}>
          <CartesianGrid strokeDasharray="2 3" stroke="#1C1C2A" />
          <XAxis dataKey="t" stroke={DIM} tick={{ fill: "#667", fontSize: 11 }} tickCount={5}
            label={{ value: "t (h)", position: "insideBottom", offset: -10, fill: "#667", fontSize: 11 }} />
          <YAxis stroke={DIM} tick={{ fill: "#667", fontSize: 11 }} tickCount={5} />
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
      <div style={{ fontSize: 11, color: "#7788AA", fontFamily: "monospace", marginBottom: 3 }}>rS→X vs C  at multiple culture ages (memory effect)</div>
      <ResponsiveContainer width="100%" height={155}>
        <LineChart data={data} margin={{ top: 4, right: 4, bottom: 22, left: 28 }}>
          <CartesianGrid strokeDasharray="2 3" stroke="#1C1C2A" />
          <XAxis dataKey="logC" stroke={DIM} tick={{ fill: "#667", fontSize: 11 }}
            ticks={LOG_TICKS} tickFormatter={logTickFmt}
            label={{ value: "C (μg/mL)", position: "insideBottom", offset: -10, fill: "#667", fontSize: 11 }} />
          <YAxis stroke={DIM} tick={{ fill: "#667", fontSize: 11 }} tickCount={5} />
          <Tooltip {...TT} formatter={(v, n) => [v.toFixed(5), n]} labelFormatter={v => `C ≈ ${Math.pow(10, v).toFixed(2)} μg/mL`} />
          {AGES.map((a, i) => (
            <Line key={a} dataKey={`a${a}`} stroke={COLS[i]} dot={false} name={`age ${a}h`} strokeWidth={1.5} />
          ))}
          <Legend wrapperStyle={{ fontSize: 11, color: TXT }} />
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
      <div style={{ position: "absolute", left: 0, top: 0, height: 200, display: "flex", flexDirection: "column", justifyContent: "space-between", fontSize: 10, color: DIM, fontFamily: "monospace" }}>
        <span>8h</span><span>6h</span><span>4h</span><span>2h</span><span>0h</span>
      </div>
      <canvas ref={canvasRef} style={{ width: "100%", height: 200, imageRendering: "pixelated", display: "block" }} />
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 2, fontSize: 10, color: DIM, fontFamily: "monospace" }}>
        <span>0.3</span><span>1</span><span>10</span><span>100</span><span>1000 μg/mL</span>
      </div>
      <div style={{ textAlign: "center", fontSize: 10, color: DIM, marginTop: 1 }}>concentration C →</div>
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
      <div style={{ fontSize: 10, color: DIM, fontFamily: "monospace", lineHeight: 1.7, marginTop: 2 }}>
        <div style={{ color: "#00CBCB" }}>▲ D Dormant (Cyan)</div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9.5 }}>
          <span style={{ color: "#C900C9" }}>S Suscept.</span>
          <span style={{ color: "#F7BB25" }}>X Tolerant</span>
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
      <div style={{ position: "absolute", left: 0, top: 0, height: 200, display: "flex", flexDirection: "column", justifyContent: "space-between", fontSize: 10, color: DIM, fontFamily: "monospace" }}>
        <span>8h</span><span>4h</span><span>0h</span>
      </div>
      <canvas ref={canvasRef} style={{ width: "100%", height: 200, imageRendering: "pixelated", display: "block" }} />
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 2, fontSize: 10, color: DIM, fontFamily: "monospace" }}>
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
      <div style={{ fontSize: 11, color: "#7788AA", fontFamily: "monospace", marginBottom: 3 }}>
        Total regrown mass N(u)/N₀  (log₁₀ scale) · g = ln2 ≈ 0.693 h⁻¹
      </div>
      <ResponsiveContainer width="100%" height={155}>
        <LineChart data={data} margin={{ top: 4, right: 4, bottom: 22, left: 35 }}>
          <CartesianGrid strokeDasharray="2 3" stroke="#1C1C2A" />
          <XAxis dataKey="tau" stroke={DIM} tick={{ fill: "#667", fontSize: 11 }} tickCount={5}
            label={{ value: "τ (h)", position: "insideBottom", offset: -10, fill: "#667", fontSize: 11 }} />
          <YAxis stroke={DIM} tick={{ fill: "#667", fontSize: 11 }} tickCount={5}
            scale="log" domain={["auto", "auto"]} tickFormatter={v => v.toExponential(0)} />
          <Tooltip {...TT} formatter={(v) => [v.toExponential(3), "N(u)/N₀"]} />
          <Line type="monotone" dataKey="R" stroke={ACCENT} dot={false} name="N(u)/N₀" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

function KernelChart({ p, cond }) {
  const s = useMemo(() => modelSnapshot(p, cond), [p, cond]);
  const isDegenerate = Math.abs(s.H - s.ht) <= 1e-10;
  const data = useMemo(() => Array.from({ length: 120 }, (_, i) => {
    const delta = i / 119 * 10;
    const PS = Math.exp(-s.H * delta);
    const PX = isDegenerate
      ? s.r * delta * Math.exp(-s.ht * delta)
      : (s.r / (s.H - s.ht)) * (Math.exp(-s.ht * delta) - Math.exp(-s.H * delta));
    return { delta: +delta.toFixed(3), PS, PX: Math.max(0, PX) };
  }), [s.H, s.ht, s.r, isDegenerate]);
  return (
    <div>
      <div style={{ fontSize: 11, color: "#7788AA", fontFamily: "monospace", marginBottom: 4 }}>
        Convolution kernels at current C, age: P_S(Δ)=e^(-HΔ), P_X(Δ) [{isDegenerate ? "H = hX" : "H ≠ hX"}]
      </div>
      <ResponsiveContainer width="100%" height={170}>
        <LineChart data={data} margin={{ top: 4, right: 4, bottom: 22, left: 32 }}>
          <CartesianGrid strokeDasharray="2 3" stroke="#1C1C2A" />
          <XAxis dataKey="delta" stroke={DIM} tick={{ fill: "#667", fontSize: 11 }}
            label={{ value: "Δ (h)", position: "insideBottom", offset: -10, fill: "#667", fontSize: 11 }} />
          <YAxis stroke={DIM} tick={{ fill: "#667", fontSize: 11 }} domain={[0, "auto"]} />
          <Tooltip {...TT} formatter={(v, n) => [v.toFixed(4), n]} />
          <Line type="monotone" dataKey="PS" stroke={SC.S} dot={false} name="P_S(Δ)" strokeWidth={2} />
          <Line type="monotone" dataKey="PX" stroke={SC.T} dot={false} name="P_X(Δ)" strokeWidth={2} strokeDasharray="5 2" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

function ConvolutionSweepPanels({ p, cond, pred }) {
  const sweep = useMemo(() => computeConvolutionSeries(p, cond), [p, cond]);
  const shapeFmt = v => Number(v).toFixed(3);
  const probFmt = v => `${(100 * Math.max(0, v)).toFixed(3)}%`;

  return (
    <div style={{ background: "#0A0A12", border: `1px solid ${BORDER}`, borderRadius: 4, padding: "8px 10px" }}>
      <div style={{ fontSize: 10, color: ACCENT, letterSpacing: 1.6, marginBottom: 5 }}>
        STATE PROBABILITY OVER TIME
      </div>
      <div style={{ fontSize: 10, color: DIM, marginBottom: 8, lineHeight: 1.6 }}>
        All curves move left-to-right in treatment time. Filled curves show the probability of being in state S (top) and state X (bottom).
        Dashed curves show the two ingredients of the convolution: wake-up timing and post-wake survival/contribution shape.
      </div>

      <div style={{ fontSize: 10, color: "#7788AA", marginBottom: 4, display: "flex", gap: 12, flexWrap: "wrap" }}>
        <span style={{ color: SC.S }}>S(τ) = {probFmt(pred.S)}</span>
        <span>Probability of being in state S at current treatment time</span>
      </div>
      <ResponsiveContainer width="100%" height={180}>
        <ComposedChart data={sweep.data} margin={{ top: 28, right: 8, bottom: 24, left: 36 }}>
          <CartesianGrid strokeDasharray="2 3" stroke="#1C1C2A" />
          <XAxis
            type="number"
            dataKey="t"
            domain={[0, sweep.tMax]}
            stroke={DIM}
            tick={{ fill: "#667", fontSize: 11 }}
            tickCount={6}
            label={{ value: "treatment time t (h)", position: "insideBottom", offset: -10, fill: "#667", fontSize: 11 }}
          />
          <YAxis yAxisId="raw" stroke={DIM} domain={[0, 1]} tick={{ fill: "#667", fontSize: 11 }} tickFormatter={v => `${(100 * v).toFixed(0)}%`} />
          <YAxis yAxisId="norm" orientation="right" domain={[0, 1]} stroke={DIM} tick={{ fill: "#667", fontSize: 10 }} tickCount={3} />
          <Tooltip
            {...TT}
            labelFormatter={v => `t = ${Number(v).toFixed(2)}h`}
            formatter={(v, n) => [String(n).includes("relative shape") ? shapeFmt(v) : probFmt(v), n]}
          />
          <ReferenceLine x={sweep.tau} stroke="#9AA3B2" strokeDasharray="4 2" yAxisId="raw" label={{ value: "τ", fill: "#9AA3B2", fontSize: 10, position: "top" }} />
          <Area yAxisId="raw" type="monotone" dataKey="S_t" stroke={SC.S} fill={SC.S} fillOpacity={0.42} name="S(t): probability of being in state S at time t" />
          <Line yAxisId="norm" type="monotone" dataKey="fNorm" stroke={ACCENT} dot={false} strokeWidth={1.6} strokeDasharray="4 2" name="Wake-up timing f_L(t|a) (relative shape)" />
          <Line yAxisId="norm" type="monotone" dataKey="pSNorm" stroke={SC.S} dot={false} strokeWidth={1.6} strokeDasharray="6 2" name="P_S(t): probability a waking cell remains in S up to time t (relative shape)" />
          <Legend verticalAlign="top" align="right" iconSize={8} wrapperStyle={{ fontSize: 10, color: TXT }} />
        </ComposedChart>
      </ResponsiveContainer>

      <div style={{ fontSize: 10, color: "#7788AA", marginBottom: 4, marginTop: 6, display: "flex", gap: 12, flexWrap: "wrap" }}>
        <span style={{ color: SC.T }}>X(τ) = {probFmt(pred.T)}</span>
        <span>Probability of being in state X at current treatment time</span>
      </div>
      <ResponsiveContainer width="100%" height={188}>
        <ComposedChart data={sweep.data} margin={{ top: 28, right: 8, bottom: 24, left: 36 }}>
          <CartesianGrid strokeDasharray="2 3" stroke="#1C1C2A" />
          <XAxis
            type="number"
            dataKey="t"
            domain={[0, sweep.tMax]}
            stroke={DIM}
            tick={{ fill: "#667", fontSize: 11 }}
            tickCount={6}
            label={{ value: "treatment time t (h)", position: "insideBottom", offset: -10, fill: "#667", fontSize: 11 }}
          />
          <YAxis yAxisId="raw" stroke={DIM} domain={[0, 1]} tick={{ fill: "#667", fontSize: 11 }} tickFormatter={v => `${(100 * v).toFixed(0)}%`} />
          <YAxis yAxisId="norm" orientation="right" domain={[0, 1]} stroke={DIM} tick={{ fill: "#667", fontSize: 10 }} tickCount={3} />
          <Tooltip
            {...TT}
            labelFormatter={v => `t = ${Number(v).toFixed(2)}h`}
            formatter={(v, n) => [String(n).includes("relative shape") ? shapeFmt(v) : probFmt(v), n]}
          />
          <ReferenceLine x={sweep.tau} stroke="#9AA3B2" strokeDasharray="4 2" yAxisId="raw" label={{ value: "τ", fill: "#9AA3B2", fontSize: 10, position: "top" }} />
          <Area yAxisId="raw" type="monotone" dataKey="X_t" stroke={SC.T} fill={SC.T} fillOpacity={0.42} name="X(t): probability of being in state X at time t" />
          <Line yAxisId="norm" type="monotone" dataKey="fNorm" stroke={ACCENT} dot={false} strokeWidth={1.6} strokeDasharray="4 2" name="Wake-up timing f_L(t|a) (relative shape)" />
          <Line yAxisId="norm" type="monotone" dataKey="pXNorm" stroke={SC.T} dot={false} strokeWidth={1.6} strokeDasharray="6 2" name="P_X(t): probability a waking cell contributes to X by time t (relative shape)" />
          <Legend verticalAlign="top" align="right" iconSize={8} wrapperStyle={{ fontSize: 10, color: TXT }} />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}

function ModelTab({ p, cond, pred, u }) {
  const s = useMemo(() => modelSnapshot(p, cond), [p, cond]);
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 12 }}>
      <EquationCard title="1) STATE FLOW (UNDER ANTIBIOTICS)">
        <MathDisplay tex={String.raw`\begin{aligned}
D &\xrightarrow{h_L(t;a)} S \\
S &\xrightarrow{r_{S\to X}(C;a)} X \\
S &\xrightarrow{h_S(C)} \varnothing,\qquad
X \xrightarrow{h_X(C)} \varnothing
\end{aligned}`} />
        <div style={{ marginTop: 6, fontSize: 10, color: DIM }}>
          Move <span style={{ color: TXT }}>C</span> to tune hS/hX/rS→X, move <span style={{ color: TXT }}>age</span> to tune memory m(a), and move <span style={{ color: TXT }}>τ</span> to change how long these rates act.
        </div>
      </EquationCard>

      <EquationCard title="2) ODE SYSTEM DURING TREATMENT">
        <MathDisplay tex={String.raw`\begin{aligned}
\frac{dD}{dt} &= -h_L(t;a)\,D \\
\frac{dS}{dt} &= h_L(t;a)\,D - h_S(C)\,S - r_{S\to X}(C;a)\,S \\
\frac{dX}{dt} &= r_{S\to X}(C;a)\,S - h_X(C)\,X
\end{aligned}`} />
        <div style={{ marginTop: 6, fontSize: 10, color: DIM }}>
          Current values: hL(t=τ;a)={fmtVal(s.hLagNow)}, hS={fmtVal(s.hs)}, rS→X={fmtVal(s.r)}, hX={fmtVal(s.ht)}.
        </div>
      </EquationCard>

      <EquationCard title="3) RATE PARAMETRISATION">
        <MathDisplay tex={String.raw`\begin{aligned}
\varphi_i(C) &= \left(\frac{C}{C_{i,0}}\right)^{n_i},\qquad i\in\{S,X,S\to X\} \\
r_{S\to X}(C;a) &= m(a)\left[r_0 + \alpha_{S\to X}\,\varphi_{S\to X}(C)\right],\quad m(a)=\frac{a}{a+a_{50}} \\
h_S(C) &= \alpha_S\,\varphi_S(C),\qquad h_X(C)=\alpha_X\,\varphi_X(C)
\end{aligned}`} />
        <MathDisplay tex={String.raw`C_{S,0}=C_{X,0},\quad n_S=n_X,\quad 0<\alpha_X<\alpha_S`} style={{ marginTop: -5 }} />
        <div style={{ marginTop: 2, fontSize: 10, color: DIM }}>
          Implementation note: solver uses log(1+...) dose-response internally for numerical stability in this dashboard.
        </div>
        <div style={{ marginTop: 6, fontSize: 10, color: DIM }}>
          At this point: m(a)={fmtVal(s.m, 3)}, phiS={fmtVal(s.phiShared, 3)}, phiS→X={fmtVal(s.phiSwitch, 3)}.
        </div>
      </EquationCard>

      <EquationCard title="4) CONVOLUTION SOLVER VIEW">
        <MathDisplay tex={String.raw`\begin{aligned}
D(t) &= N_0\,S_L(t\mid a) \\
S(t) &= N_0\int_0^t P_S(t-\ell)\,f_L(\ell\mid a)\,d\ell \\
X(t) &= N_0\int_0^t P_X(t-\ell)\,f_L(\ell\mid a)\,d\ell
\end{aligned}`} />
        <MathDisplay tex={String.raw`P_S(\Delta)=e^{-H\Delta},\quad H=h_S+r_{S\to X}`} style={{ marginTop: -8 }} />
        <MathDisplay tex={String.raw`P_X(\Delta)=
\begin{cases}
\dfrac{r_{S\to X}}{H-h_X}\left[e^{-h_X\Delta}-e^{-H\Delta}\right], & H\neq h_X \\[6pt]
r_{S\to X}\,\Delta\,e^{-h_X\Delta}, & H=h_X
\end{cases}`} style={{ marginTop: -8 }} />
        <div style={{ marginTop: 6, fontSize: 10, color: DIM }}>
          Current branch: {Math.abs(s.H - s.ht) <= 1e-10 ? "degenerate H = hX" : "generic H ≠ hX"} with H={fmtVal(s.H)}.
        </div>
      </EquationCard>

      <div style={{ gridColumn: "1/-1" }}>
        <KernelChart p={p} cond={cond} />
      </div>

      <div style={{ gridColumn: "1/-1" }}>
        <ConvolutionSweepPanels p={p} cond={cond} pred={pred} />
      </div>

      <EquationCard title="5) POST-TREATMENT REGROWTH (u = t - τ)">
        <MathDisplay tex={String.raw`\pi_S=\frac{S(\tau)}{N_0},\qquad \pi_X=\frac{X(\tau)}{N_0},\qquad \pi_D=S_L(\tau\mid a)`} />
        <MathDisplay tex={String.raw`\begin{aligned}
G_S(u) &= N_0\,\pi_S\,e^{gu} \\
G_X(u) &= N_0\,\pi_X\,e^{gu}
\end{aligned}`} style={{ marginTop: -8 }} />
        <MathDisplay tex={String.raw`G_D(u)=e^{gu}\int_{0}^{u}e^{-gs}\,\underbrace{N_0\,f_L(\tau+s\mid a)}_{\text{wake rate at }\tau+s}\,ds`} style={{ marginTop: -8 }} />
        <div style={{ marginTop: 6, fontSize: 10, color: DIM }}>
          With current sliders: πS={fmtPct(pred.S)}, πX={fmtPct(pred.T)}, πD={fmtPct(pred.D)}; at u={u}h both S/X branches amplify by e^(gu) with g=ln2.
        </div>
      </EquationCard>

      <EquationCard title="6) HOW TO READ THE DASHBOARD">
        <div style={{ fontSize: 10.3, color: DIM, lineHeight: 1.75 }}>
          1. `PHASE` shows how survivor composition shifts with one axis at a time. <br />
          2. `HEATMAP` maps (C, τ) to composition and total survival at fixed age. <br />
          3. `KINETICS` exposes hS/hX/rS→X dose-response and lag distribution controls. <br />
          4. `REGROWTH` projects which survivor class dominates descendants after removal.
        </div>
      </EquationCard>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// MAIN DASHBOARD
// ═══════════════════════════════════════════════════════════════════

const TABS = [
  { id: "model",    label: "MODEL" },
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

  const legend = (
    <div style={{ display: "flex", gap: 14, flexWrap: "wrap", fontSize: 11, fontFamily: "monospace", color: "#8888AA" }}>
      {[["S", "Susceptible survivors"], ["T", "Tolerant survivors (X)"], ["D", "Dormant (pre-existing)"], ["dead", "Dead"]].map(([k, lbl]) => (
        <span key={k} style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <span style={{ width: 10, height: 10, background: SC[k], display: "inline-block", borderRadius: 2 }} />
          {lbl}
        </span>
      ))}
    </div>
  );

  return (
    <div style={{ height: "100vh", background: BG, color: TXT, fontFamily: "'Courier New', monospace", display: "flex", flexDirection: "column", overflow: "hidden", fontSize: 13 }}>

      {/* ── Header ── */}
      <div style={{ background: PANEL, borderBottom: `1px solid ${BORDER}`, padding: "7px 14px", display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
        <div style={{ fontSize: 14, fontWeight: "bold", letterSpacing: 3, color: ACCENT }}>STDP</div>
        <div style={{ fontSize: 11, color: DIM, flex: 1 }}>Survival · Tolerance · Dormancy · Persistence  —  Interactive Model Explorer</div>
        <Tag>k_lag = {params.k_lag}</Tag>
        <button onClick={() => setSidebar(s => !s)}
          style={{ background: "none", border: `1px solid ${BORDER}`, color: DIM, fontSize: 11, padding: "2px 8px", cursor: "pointer", borderRadius: 2, fontFamily: "monospace" }}>
          {sidebar ? "◀" : "▶"} PARAMS
        </button>
        <button onClick={() => setParams(P0)}
          style={{ background: "none", border: `1px solid ${BORDER}`, color: DIM, fontSize: 11, padding: "2px 8px", cursor: "pointer", borderRadius: 2, fontFamily: "monospace" }}>
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
            <div style={{ background: "#080810", border: `1px solid ${BORDER}`, borderRadius: 3, padding: "6px 8px", margin: "8px 0 4px", fontSize: 11, lineHeight: 1.9 }}>
              <div style={{ color: ACCENT, fontSize: 10, letterSpacing: 2, marginBottom: 3 }}>PREDICTION</div>
              {[["S (incomplete)", pred.S, SC.S], ["X (induced tolerant)", pred.T, SC.T], ["D (pre-existing)", pred.D, SC.D], ["Dead", pred.dead, SC.dead]].map(([lbl, v, c]) => (
                <div key={lbl} style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: c }}>{lbl}</span>
                  <span style={{ color: "#CCC" }}>{(v * 100).toFixed(3)}%</span>
                </div>
              ))}
              <div style={{ borderTop: `1px solid ${BORDER}`, marginTop: 3, paddingTop: 3, display: "flex", justifyContent: "space-between", color: DIM }}>
                <span>Σ survivors</span>
                <span style={{ color: ACCENT }}>{((pred.S + pred.T + pred.D) * 100).toFixed(3)}%</span>
              </div>
              <div style={{ marginTop: 4, fontSize: 10, color: DIM, lineHeight: 1.5 }}>
                hS = {hS(cond.C, params.kS, params.K, params.n).toFixed(4)}<br />
                hX = {hT(cond.C, params.kT, params.K, params.n).toFixed(4)}<br />
                rS→X = {rST(cond.C, cond.age, params.kST, params.KST, params.nST, params.a50, params.r0).toFixed(4)}
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
                  style={{ flex: 1, background: params.k_lag === k ? "#64FFDA22" : "none", border: `1px solid ${params.k_lag === k ? ACCENT : BORDER}`, color: params.k_lag === k ? ACCENT : DIM, fontSize: 12, padding: "3px", cursor: "pointer", borderRadius: 2, fontFamily: "monospace" }}>
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
                style={{ padding: "7px 16px", fontSize: 11, background: "none", border: "none", borderBottom: `2px solid ${t.id === tab ? ACCENT : "transparent"}`, color: t.id === tab ? ACCENT : DIM, cursor: "pointer", fontFamily: "monospace", letterSpacing: 1.5 }}>
                {t.label}
              </button>
            ))}
          </div>

          {/* Content */}
          <div style={{ flex: 1, overflowY: "auto", padding: 14 }}>
            <LiveMathStrip p={params} cond={cond} pred={pred} />

            {/* ── MODEL ── */}
            {tab === "model" && (
              <ModelTab p={params} cond={cond} pred={pred} u={u} />
            )}

            {/* ── PHASE ── */}
            {tab === "phase" && (
              <div>
                {legend}
                <div style={{ marginTop: 12, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }}>
                  <PhaseTau p={params} C={cond.C} age={cond.age} />
                  <PhaseConc p={params} tau={cond.tau} age={cond.age} />
                  <PhaseAge p={params} C={cond.C} tau={cond.tau} />
                </div>
                <div style={{ marginTop: 10, fontSize: 10.5, color: DIM, lineHeight: 1.7, background: "#0A0A12", border: `1px solid ${BORDER}`, borderRadius: 3, padding: "6px 10px" }}>
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
                  <div style={{ fontSize: 11, color: "#8888AA" }}>
                    Hue: <span style={{ color: "#00CBCB" }}>■ D</span>·
                    <span style={{ color: "#C900C9" }}> ■ S</span>·
                    <span style={{ color: "#F7BB25" }}> ■ X</span> (CMY colorspace)
                  </div>
                  <label style={{ fontSize: 11, color: "#8888AA", display: "flex", alignItems: "center", gap: 4, cursor: "pointer" }}>
                    <input type="checkbox" checked={useK} onChange={e => setUseK(e.target.checked)} style={{ accentColor: ACCENT }} />
                    Brightness encodes total survivors
                  </label>
                  {useK && (
                    <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: "#8888AA" }}>
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
                    <div style={{ fontSize: 11, color: "#7788AA", fontFamily: "monospace", marginBottom: 4 }}>
                      Composition map · age = {cond.age.toFixed(0)}h
                    </div>
                    <CMYKHeatmap p={params} age={cond.age} kGamma={kGamma} useK={useK} nC={80} nTau={80} />
                  </div>
                  <div>
                    <div style={{ fontSize: 11, color: "#7788AA", fontFamily: "monospace", marginBottom: 4 }}>
                      Total survivor fraction  S(τ,C) = π_S + π_X + π_D
                    </div>
                    <SurvivalHeatmap p={params} age={cond.age} nC={80} nTau={80} />
                    <div style={{ fontSize: 10, color: DIM, marginTop: 4 }}>Brightness ∝ log₁₀(survivors). Gold=high, black=zero.</div>
                  </div>
                  <TernaryKey size={120} />
                </div>

                <div style={{ marginTop: 10, fontSize: 10.5, color: DIM, lineHeight: 1.7, background: "#0A0A12", border: `1px solid ${BORDER}`, borderRadius: 3, padding: "6px 10px" }}>
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
                <div style={{ gridColumn: "1/-1", fontSize: 10.5, color: DIM, lineHeight: 1.7, background: "#0A0A12", border: `1px solid ${BORDER}`, borderRadius: 3, padding: "6px 10px" }}>
                  <strong style={{ color: "#9999BB" }}>Top-left:</strong> Dose-response curves hS(C), hX(C), rS→X(C) — all in log(1+x) form. Constraint: κT {"<"} κS with shared K,n ensures h_X {"<"} h_S ∀C. &nbsp;
                  <strong style={{ color: "#9999BB" }}>Top-right:</strong> Erlang(k_lag, λ) lag distribution for current age.
                  λ = k_lag / (μ₀ + age/24·μ₂₄′). &nbsp;
                  <strong style={{ color: "#9999BB" }}>Bottom:</strong> rS→X at multiple ages — illustrates the m(a) = a/(a+a₅₀) stress-memory saturation.
                </div>
              </div>
            )}

            {/* ── REGROWTH ── */}
            {tab === "regrowth" && (
              <div>
                <div style={{ display: "flex", gap: 16, alignItems: "center", marginBottom: 10 }}>
                  <div style={{ fontSize: 11, color: "#8888AA" }}>Post-treatment time u:</div>
                  <input type="range" min={1} max={200} step={1} value={u}
                    onChange={e => setU(Number(e.target.value))}
                    style={{ width: 120, accentColor: ACCENT }} />
                  <span style={{ color: ACCENT, fontSize: 12, fontFamily: "monospace" }}>u = {u}h</span>
                  <span style={{ fontSize: 11, color: DIM }}>2^{(u * Math.log2(Math.E) * Math.log(2)).toFixed(1)} × N₀ max theoretical</span>
                </div>

                {legend}
                <div style={{ marginTop: 12, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                  <RegrowthComposition p={params} C={cond.C} age={cond.age} u={u} />
                  <RegrowthMass p={params} C={cond.C} age={cond.age} u={u} />
                </div>

                <div style={{ marginTop: 10, fontSize: 10.5, color: DIM, lineHeight: 1.7, background: "#0A0A12", border: `1px solid ${BORDER}`, borderRadius: 3, padding: "6px 10px" }}>
                  <strong style={{ color: "#9999BB" }}>Left:</strong> Fractional contribution to the regrown population at time u, as a function of τ.
                  S: incomplete-treatment survivors (grew exponentially from τ). X: induced tolerant survivors. D: deep persisters — delayed by residual lag before contributing. <br />
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
