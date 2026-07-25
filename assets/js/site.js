/* ==========================================================================
   Shiv Printer House — progressive enhancement only.
   Every feature of the site works with this file blocked or disabled:
     - navigation is a <details> disclosure (CSS-only)
     - the map has a plain "Open in Google Maps" link
     - the theme follows prefers-color-scheme
   Loaded with `defer`. No inline script, no eval, no document.write —
   the production CSP allows neither.
   ========================================================================== */
(function () {
  'use strict';

  var root = document.documentElement;

  /* Marks JS as available so CSS can reveal JS-only controls. */
  root.classList.add('js');

  /* --- Theme toggle --------------------------------------------------- */
  /* Persisted in localStorage; absent value means "follow the OS". */

  var STORAGE_KEY = 'sph-theme';

  function systemTheme() {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function currentTheme() {
    return root.getAttribute('data-theme') || systemTheme();
  }

  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    var btn = document.querySelector('.theme-toggle');
    if (btn) {
      btn.setAttribute('aria-pressed', String(theme === 'dark'));
      btn.setAttribute('aria-label',
        theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
    }
  }

  var stored = null;
  try { stored = localStorage.getItem(STORAGE_KEY); } catch (e) { /* private mode */ }
  if (stored === 'dark' || stored === 'light') applyTheme(stored);

  var toggle = document.querySelector('.theme-toggle');
  if (toggle) {
    toggle.addEventListener('click', function () {
      var next = currentTheme() === 'dark' ? 'light' : 'dark';
      applyTheme(next);
      try { localStorage.setItem(STORAGE_KEY, next); } catch (e) { /* ignore */ }
    });
  }

  /* --- Mobile navigation ---------------------------------------------- */
  /* Turns the Menu button into an aria-expanded disclosure. Without this file
     the button stays hidden and the nav renders as a plain wrapped list, so
     every link remains reachable. */

  var nav = document.querySelector('.nav');
  var navBtn = document.querySelector('.nav-toggle');

  if (nav && navBtn) {
    var setNav = function (open) {
      nav.classList.toggle('is-open', open);
      navBtn.setAttribute('aria-expanded', String(open));
    };

    navBtn.addEventListener('click', function () {
      setNav(navBtn.getAttribute('aria-expanded') !== 'true');
    });

    // Close on Escape, returning focus to the button.
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) {
        setNav(false);
        navBtn.focus();
      }
    });

    // Close when tapping outside the panel.
    document.addEventListener('click', function (e) {
      if (nav.classList.contains('is-open') &&
          !nav.contains(e.target) && !navBtn.contains(e.target)) {
        setNav(false);
      }
    });

    // Close after following a link.
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) setNav(false);
    });

    // Leaving mobile width: drop the open state so the desktop nav is clean.
    window.matchMedia('(min-width: 64em)').addEventListener('change', function (e) {
      if (e.matches) setNav(false);
    });
  }

  /* --- Click-to-load map --------------------------------------------- */
  /* The Google Maps iframe is injected only when the visitor asks for it,
     so no third-party request happens on a normal page view. The iframe URL
     comes from a data attribute in the HTML, never from user input. */

  var mapEmbed = document.querySelector('.map-embed');
  if (mapEmbed) {
    var loadBtn = mapEmbed.querySelector('[data-map-load]');
    if (loadBtn) {
      loadBtn.addEventListener('click', function () {
        var src = mapEmbed.getAttribute('data-map-src');
        if (!src || mapEmbed.getAttribute('data-loaded') === 'true') return;

        var frame = document.createElement('iframe');
        frame.src = src;
        frame.title = 'Google Map showing the location of Shiv Printer House, Gondal Road, Rajkot';
        frame.loading = 'lazy';
        frame.referrerPolicy = 'no-referrer-when-downgrade';
        frame.setAttribute('allowfullscreen', '');
        mapEmbed.appendChild(frame);
        mapEmbed.setAttribute('data-loaded', 'true');
      });
    }
  }
}());
