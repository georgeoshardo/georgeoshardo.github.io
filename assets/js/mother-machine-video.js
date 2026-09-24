/* One native player, loaded on approach and played only while visible. */
(() => {
  const figure = document.querySelector('[data-mother-machine]');
  if (!figure) return;
  const video = figure.querySelector('video');
  const button = figure.querySelector('.mother-machine-toggle');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const connection = navigator.connection;
  let near = false;
  let visible = false;
  let userPaused = false;
  let optedIn = false;
  let blocked = false;
  let pendingPlay = false;

  video.muted = true;
  button.hidden = false;

  const allowed = () => optedIn || (!reducedMotion.matches && !connection?.saveData);
  const shouldPlay = () => visible && !document.hidden && allowed() && !userPaused && !blocked;
  const updateButton = () => {
    button.textContent = shouldPlay() ? 'Pause animation' : 'Play animation';
  };

  function load() {
    if (video.hasAttribute('src')) return;
    // Choose once at first use: resizing must not fetch a second movie or
    // restart playback. Both sources have sufficient detail for their slots.
    const pixels = video.getBoundingClientRect().width * Math.min(window.devicePixelRatio || 1, 2);
    video.src = pixels > 720 ? video.dataset.srcLarge : video.dataset.srcSmall;
    video.preload = 'auto';
    video.load();
  }

  function sync() {
    if (near && allowed() && !userPaused && !blocked && !document.hidden) load();
    if (shouldPlay()) {
      load();
      if (video.paused && !pendingPlay) {
        pendingPlay = true;
        video.play().catch(error => {
          // Pausing during a pending request is expected on scroll/tab changes.
          if (error.name !== 'AbortError') blocked = true;
        }).finally(() => {
          pendingPlay = false;
          if (!shouldPlay()) video.pause();
          updateButton();
          // A quick scroll out and back can abort a pending play request.
          if (shouldPlay() && video.paused) sync();
        });
      }
    } else {
      video.pause();
    }
    updateButton();
  }

  button.addEventListener('click', () => {
    if (shouldPlay()) {
      userPaused = true;
    } else {
      userPaused = false;
      optedIn = true;
      blocked = false;
    }
    sync();
  });

  video.addEventListener('error', () => {
    blocked = true;
    video.removeAttribute('src');
    video.load(); // Restore the poster; the play button permits an explicit retry.
    updateButton();
  });
  document.addEventListener('visibilitychange', sync);
  window.addEventListener('pagehide', () => video.pause());
  window.addEventListener('pageshow', sync);
  reducedMotion.addEventListener('change', () => { optedIn = false; sync(); });
  connection?.addEventListener('change', () => { optedIn = false; sync(); });

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(entries => {
      near = entries[0].isIntersecting;
      sync();
    }, { rootMargin: '200px' }).observe(video);
    new IntersectionObserver(entries => {
      visible = entries[0].isIntersecting && entries[0].intersectionRatio >= 0.1;
      sync();
    }, { threshold: [0, 0.1] }).observe(video);
  } else {
    // Keep the poster and manual playback if visibility observation is absent.
    visible = true;
    blocked = true;
    updateButton();
  }
})();
