/* YamiLencerias — script compartido: HTTPS, configuración, protección de contenido y aviso de cookies.
   Cargar en <head> SIN defer para que la redirección a HTTPS ocurra antes de pintar la página. */
(function () {
  'use strict';

  /* ── Configuración global (cambia aquí tu dominio y tu WhatsApp) ── */
  window.YL = {
    brand: 'YamiLencerias',
    site: 'https://www.yamilencerias.com',   // ← reemplaza por tu dominio real
    whatsapp: '584129204453'
  };

  /* ── Forzar HTTPS (respaldo en navegador; el servidor lo fuerza con .htaccess) ── */
  if (location.protocol === 'http:' && !/^(localhost|127\.0\.0\.1|\[::1\]|.+\.local)$/.test(location.hostname)) {
    location.replace('https:' + location.href.substring(location.protocol.length));
    return;
  }

  /* ── Protección contra copia de texto e imágenes ──
     Es un disuasivo: no puede impedir capturas de pantalla ni que alguien con
     conocimientos técnicos descargue el contenido. */
  var isField = function (t) {
    return !!(t && t.closest && t.closest('input, textarea, select, [contenteditable="true"]'));
  };
  ['contextmenu', 'dragstart', 'selectstart'].forEach(function (ev) {
    document.addEventListener(ev, function (e) { if (!isField(e.target)) e.preventDefault(); });
  });
  ['copy', 'cut'].forEach(function (ev) {
    document.addEventListener(ev, function (e) {
      if (isField(e.target)) return;
      if (e.clipboardData) e.clipboardData.setData('text/plain', '© ' + window.YL.brand + ' — contenido protegido');
      e.preventDefault();
    });
  });
  document.addEventListener('keydown', function (e) {
    var k = (e.key || '').toLowerCase();
    var mod = e.ctrlKey || e.metaKey;
    var inField = isField(e.target);
    if (e.key === 'F12') { e.preventDefault(); return; }
    if (mod && e.shiftKey && ['i', 'j', 'c'].indexOf(k) > -1) { e.preventDefault(); return; }
    if (mod && !inField && ['c', 'x', 'u', 's', 'p', 'a'].indexOf(k) > -1) e.preventDefault();
  });

  /* ── Aviso de cookies ── */
  var KEY = 'yl_cookie_consent';
  var me = document.currentScript;
  var BASE = me && me.src ? me.src.replace(/site\.js(\?.*)?$/, '') : '';
  var read = function () { try { return localStorage.getItem(KEY); } catch (e) { return null; } };
  var write = function (v) { try { localStorage.setItem(KEY, v); } catch (e) { /* sin almacenamiento */ } };

  function showBar() {
    if (document.getElementById('cookieBar')) return;
    var bar = document.createElement('div');
    bar.id = 'cookieBar';
    bar.className = 'cookie-bar';
    bar.setAttribute('role', 'dialog');
    bar.setAttribute('aria-labelledby', 'cookieTitle');
    bar.innerHTML =
      '<h2 id="cookieTitle">Cookies y almacenamiento</h2>' +
      '<p>Usamos solo almacenamiento técnico para que el catálogo cargue rápido y recordar tu elección. ' +
      'No usamos cookies de publicidad ni de analítica. Más detalles en la ' +
      '<a href="' + BASE + 'politica-cookies.html">política de cookies</a>.</p>' +
      '<div class="cookie-actions">' +
      '<button type="button" class="btn" data-choice="all">Aceptar</button>' +
      '<button type="button" class="btn btn-ghost" data-choice="necessary">Solo necesarias</button>' +
      '</div>';
    bar.addEventListener('click', function (e) {
      var b = e.target.closest('[data-choice]');
      if (!b) return;
      write(b.getAttribute('data-choice'));
      bar.remove();
      document.dispatchEvent(new CustomEvent('yl:consent', { detail: b.getAttribute('data-choice') }));
    });
    document.body.appendChild(bar);
  }

  document.addEventListener('DOMContentLoaded', function () {
    if (!read()) showBar();
    document.addEventListener('click', function (e) {
      if (e.target.closest('[data-cookie-prefs]')) { e.preventDefault(); showBar(); }
    });
  });
})();
