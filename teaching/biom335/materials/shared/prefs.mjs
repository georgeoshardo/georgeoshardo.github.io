// A viewer's settings (reading pace, motion, graphics quality, …), kept in this browser for every course page, so a
// choice made in one animation holds in the others. Storage can be unavailable (private windows, blocked site data):
// then nothing is kept and each page uses its defaults. Earlier visits kept the film's settings under its own prefix.
const read = key => { try { return localStorage.getItem(key); } catch { return null; } };
export const prefs = {
  get(k) { return read('course.' + k) ?? read('transcription3d.' + k); },
  set(k, v) { try { localStorage.setItem('course.' + k, v); } catch { /* not kept */ } },
};
