// Easing for every page's animation (the transcription film's): clamp to 0–1, smoothstep, a smoothstep ramp
// between two times, linear mix, and the quintic ease of camera blends (velocity and acceleration both start
// and end at zero, so a blend never jolts).
export const clamp = x => Math.max(0, Math.min(1, x));
export const smooth = x => { x = clamp(x); return x * x * (3 - 2 * x); };
export const ramp = (t, a, b) => smooth((t - a) / (b - a));
export const mix = (a, b, t) => a + (b - a) * t;
export const quintic = x => { x = clamp(x); return x * x * x * (x * (6 * x - 15) + 10); };
// An angle's principal value, in (−π, π].
export const wrap = a => Math.atan2(Math.sin(a), Math.cos(a));
