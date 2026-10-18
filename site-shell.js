/* Stark Plumbing Solutions universal header/footer loader.
 * Upload as https://starkplumbingsolutions.com/site-shell.js
 * Requires /header.html, /footer.html and corresponding slots in page markup.
 */
(function () {
  'use strict';
  async function loadFragment(slotId, path) {
    const slot = document.getElementById(slotId);
    if (!slot) { console.warn('[Stark] Missing slot #' + slotId); return; }
    try {
      const response = await fetch(path, { cache: 'no-cache', credentials: 'same-origin' });
      if (!response.ok) throw new Error('HTTP ' + response.status + ' for ' + path);
      const html = await response.text();
      if (!html.trim()) throw new Error('Empty fragment: ' + path);
      slot.innerHTML = html;
      slot.dataset.loaded = 'true';
      console.info('[Stark] Loaded ' + path);
    } catch (error) {
      console.error('[Stark] Failed to load ' + path, error);
      slot.innerHTML = slotId === 'stark-header-slot'
        ? '<nav style="background:#153D35;color:white;padding:15px 20px"><a href="/" style="color:white;font-weight:bold">Stark Plumbing Solutions</a> &nbsp; <a href="tel:+18441234567" style="color:#C8A96B">Call (844) 123-4567</a></nav>'
        : '<footer style="background:#153D35;color:white;padding:24px 20px;text-align:center">Stark Plumbing Solutions · San Antonio, TX · <a href="tel:+18441234567" style="color:#C8A96B">(844) 123-4567</a></footer>';
    }
  }

  function initNavigation() {
    document.querySelectorAll('[data-stark-year]').forEach(el => {
      el.textContent = String(new Date().getFullYear());
    });
    const normalize = path => (path.replace(/\/index\.html?$/i, '/').replace(/\/+$/, '') || '/');
    const current = normalize(location.pathname);
    document.querySelectorAll('.stark-header a[href]').forEach(a => {
      try { if (normalize(new URL(a.href, location.href).pathname) === current) a.setAttribute('aria-current', 'page'); }
      catch (_) { /* ignore invalid URLs */ }
    });
    document.addEventListener('click', event => {
      document.querySelectorAll('.stark-header .stark-desktop-links details[open]').forEach(d => {
        if (!d.contains(event.target)) d.open = false;
      });
    });
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape') document.querySelectorAll('.stark-header details[open]').forEach(d => { d.open = false; });
    });
  }

  async function init() {
    await Promise.all([
      loadFragment('stark-header-slot', '/header.html'),
      loadFragment('stark-footer-slot', '/footer.html')
    ]);
    initNavigation();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();
