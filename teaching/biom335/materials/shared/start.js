// Runs before an animated page's modules (a classic script), with the page's loader and its error card in place.
// Opened straight from disk, a browser will not load the modules, so the page says how to serve it. If a module then
// fails to load or link (a missing file, or an older copy kept by the browser), the page says so and offers a reload,
// rather than loading forever.
(() => {
  const $ = id => document.getElementById(id);
  const show = (title, body, code) => {
    const loader = $('loader'); if (!loader) return;
    loader.hidden = false; loader.classList.remove('hidden'); loader.classList.add('failed'); $('load-error').hidden = false;
    $('error-title').textContent = title; $('error-body').textContent = body;
    const c = $('error-code'); if (c) { c.hidden = !code; c.textContent = code || ''; }
    $('error-description')?.setAttribute('hidden', '');  // it needs the page's own scripts
    const retry = $('error-retry'); if (retry) retry.onclick = () => location.reload();
  };
  if (location.protocol === 'file:') {
    const folder = (location.pathname.split('/drawings/')[1] || '').replace(/[^/]*$/, '');
    show('Open this page through a local web server',
      `Browsers block the page's files when it is opened straight from disk. In the repository folder, run the command below, then open http://127.0.0.1:8080/${folder}.`,
      'pixi run serve-drawings');
    return;
  }
  addEventListener('error', e => {
    const loader = $('loader');
    if (!loader || loader.classList.contains('hidden') || loader.classList.contains('failed')) return;
    const script = e.target?.tagName === 'SCRIPT', link = e instanceof ErrorEvent && /module|export|import/i.test(e.message || '');
    if (script || link) show('The page could not start', 'One of its files could not be loaded, or the browser kept an older copy of it. Reload the page (with Shift held, to fetch every file again).');
  }, true);
})();
