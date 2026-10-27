/* Shared by the portfolio and the separately deployed FTSM map. */
(() => {
  if (window.__chinweiAnalytics || navigator.doNotTrack === '1' || navigator.globalPrivacyControl) return;
  window.__chinweiAnalytics = true;
  const endpoint = new URL('/api/analytics', document.currentScript.src).href;
  const uuid = () => crypto.randomUUID();
  function stored(storage, key, fallback) {
    try { const value = storage.getItem(key) || fallback; storage.setItem(key, value); return value; }
    catch { return fallback; }
  }
  let visitor;
  try { visitor = stored(localStorage, 'cw-visitor', uuid()); } catch { visitor = uuid(); }
  let session = uuid(), lastActivity = Date.now(), view, previous = performance.now();
  try {
    const saved = JSON.parse(sessionStorage.getItem('cw-session') || 'null');
    if (saved && Date.now() - saved.time < 1800000) session = saved.id;
  } catch {}
  function saveSession() {
    try { sessionStorage.setItem('cw-session', JSON.stringify({id: session, time: Date.now()})); } catch {}
  }
  function send() {
    if (!view) return;
    const body = JSON.stringify({...view, host: location.host, seconds: Math.floor(view.seconds)});
    if (!navigator.sendBeacon?.(endpoint, new Blob([body], {type: 'text/plain'}))) {
      fetch(endpoint, {method: 'POST', body, keepalive: true, credentials: 'same-origin'}).catch(() => {});
    }
  }
  function tick() {
    const now = performance.now();
    if (view && document.visibilityState === 'visible' && Date.now() - lastActivity < 60000) {
      view.seconds = Math.min(86400, view.seconds + Math.min((now - previous) / 1000, 15));
      saveSession();
    }
    previous = now;
  }
  function navigate() {
    const path = location.pathname;
    if (view?.path === path) return;
    tick(); send();
    view = null;
    if (/^\/(admin|api)(\/|$)/.test(path)) return;
    let referrer = 'Direct';
    try { referrer = new URL(document.referrer).hostname; } catch {}
    view = {id: uuid(), visitor, session, path, referrer, seconds: 0};
    previous = performance.now(); saveSession(); send();
  }
  for (const method of ['pushState', 'replaceState']) {
    const original = history[method];
    history[method] = function (...args) { const result = original.apply(this, args); navigate(); return result; };
  }
  addEventListener('popstate', navigate);
  for (const event of ['pointerdown', 'keydown', 'scroll', 'touchstart']) {
    addEventListener(event, () => {
      tick();
      if (Date.now() - lastActivity > 1800000) { send(); session = uuid(); view = null; navigate(); }
      lastActivity = Date.now();
    }, {passive: true, capture: true});
  }
  document.addEventListener('visibilitychange', () => { tick(); send(); });
  addEventListener('pagehide', () => { tick(); send(); });
  addEventListener('pageshow', (event) => { if (event.persisted) { view = null; navigate(); } });
  setInterval(() => { tick(); send(); }, 15000);
  navigate();
})();
