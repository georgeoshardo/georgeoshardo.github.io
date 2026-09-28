// Links that lead further down a hub page. `glide` makes a link glide to its target (a jump for viewers who prefer
// less motion). `scrollCue` does the same for the arrow at the foot of a hub page's hero (`.scroll-cue` in hub.css),
// which also fades once the visitor has scrolled on and returns near the top. They need nothing else on the page, so
// they work even when the 3D view cannot start, and without scripts the links still jump to their targets.
const calm = matchMedia('(prefers-reduced-motion: reduce)');

export function glide(link, target) {
  if (!link || !target) return;
  link.addEventListener('click', e => {
    e.preventDefault();
    target.scrollIntoView({behavior: calm.matches ? 'instant' : 'smooth', block: 'start'});
  });
}

export function scrollCue(cue, target) {
  if (!cue || !target) return;
  glide(cue, target);
  // Away once the page has scrolled a fifth of the window, whatever the hero's height: the content is in view by then.
  let raf = 0;
  const update = () => { raf = 0; cue.classList.toggle('away', scrollY > innerHeight * .2); };
  const queue = () => { raf ||= requestAnimationFrame(update); };
  addEventListener('scroll', queue, {passive: true});
  addEventListener('resize', queue);
  update();
}
