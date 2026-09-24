/* One native loop; defer loading and stop decoding while out of view. */
(() => {
  const figure = document.querySelector('[data-mother-machine]');
  if (!figure) return;
  const video = figure.querySelector('video');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const connection = navigator.connection;
  let near = false, visible = false, pendingPlay = false;
  let retryTimer = null, retries = 0, source = '';
  let autoplayBlocked = false;
  let pageHidden = false;
  const allowed = () => !reducedMotion.matches && !connection?.saveData;
  const active = () => visible && !document.hidden && !pageHidden && allowed();
  video.muted = true;
  video.defaultMuted = true;
  video.loop = true;
  video.autoplay = false;

  function load() {
    if (!source) {
      const pixels = video.getBoundingClientRect().width * Math.min(window.devicePixelRatio || 1, 2);
      source = pixels > 720 ? video.dataset.srcLarge : video.dataset.srcSmall;
    }
    if (!video.hasAttribute('src')) {
      video.src = source;
      video.preload = 'auto';
      video.load();
    }
  }

  function retry(reload = false) {
    if (!active() || retryTimer !== null || retries >= 2) return;
    retries++;
    retryTimer = setTimeout(() => {
      retryTimer = null;
      if (!active()) return;
      if (reload || video.error) {
        video.removeAttribute('src');
        load();
      }
      sync();
    }, 750 * retries);
  }

  function sync() {
    video.autoplay = active();
    if (near && allowed() && !document.hidden) load();
    if (!active()) {
      video.pause();
      return;
    }
    load();
    if (!video.paused || pendingPlay || autoplayBlocked) return;
    pendingPlay = true;
    video.play().catch(error => {
      if (error.name === 'NotAllowedError') autoplayBlocked = true;
      else retry(error.name !== 'AbortError');
    }).finally(() => {
      pendingPlay = false;
      if (!active()) video.pause();
    });
  }

  video.addEventListener('error', () => retry(true));
  video.addEventListener('canplay', sync);
  video.addEventListener('playing', () => {
    retries = 0;
    if (retryTimer !== null) clearTimeout(retryTimer);
    retryTimer = null;
  });
  // Native loop normally handles this. Recover if an embedded player ends it.
  video.addEventListener('ended', () => {
    if (active()) { video.currentTime = 0; sync(); }
  });
  video.addEventListener('pause', () => { if (active() && !autoplayBlocked) retry(); });
  function resume() { autoplayBlocked = false; retries = 0; sync(); }
  document.addEventListener('visibilitychange', resume);
  window.addEventListener('pagehide', () => { pageHidden = true; video.pause(); });
  window.addEventListener('pageshow', () => { pageHidden = false; resume(); });
  window.addEventListener('focus', resume);
  // If the browser requires a gesture, any normal page interaction unlocks it.
  document.addEventListener('pointerdown', () => { if (autoplayBlocked) resume(); }, { passive: true });
  document.addEventListener('keydown', () => { if (autoplayBlocked) resume(); });
  reducedMotion.addEventListener('change', resume);
  connection?.addEventListener('change', resume);

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(entries => {
      near = entries[0].isIntersecting;
      sync();
    }, { rootMargin: '200px' }).observe(video);
    new IntersectionObserver(entries => {
      visible = entries[0].isIntersecting && entries[0].intersectionRatio >= 0.1;
      if (visible) resume(); else sync();
    }, { threshold: [0, 0.1] }).observe(video);
  } else {
    near = visible = true;
    sync();
  }
})();
