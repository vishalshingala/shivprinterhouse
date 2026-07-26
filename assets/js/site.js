/* ==========================================================================
   Shiv Printer House — progressive enhancement only.
   Every feature of the site works with this file blocked or disabled:
     - the nav renders as a plain wrapped list (the Menu button stays hidden)
     - the theme follows prefers-color-scheme
     - revealed sections are simply visible, never hidden
     - gallery thumbnails are links straight to the full-size image
     - the map has a plain "Open in Google Maps" link
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

  /* --- Scroll reveal --------------------------------------------------- */
  /* Adds .is-in as elements enter the viewport. The CSS default state is
     visible, so if this never runs nothing is hidden. */

  var revealables = document.querySelectorAll('[data-reveal], [data-reveal-stagger]');

  if (revealables.length) {
    var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    var revealAll = function () {
      for (var i = 0; i < revealables.length; i++) {
        revealables[i].classList.add('is-in');
      }
    };

    if (reduced || !('IntersectionObserver' in window)) {
      // Nothing was ever hidden (CSS keys the hidden state on .reveal-ready,
      // which we never set here), so there is nothing to do.
      revealAll();
    } else {
      // Only now is it safe for CSS to hide these elements.
      root.classList.add('reveal-ready');

      // Anything already on screen is revealed synchronously, before the
      // observer has had a chance to run. Above-the-fold content must never
      // depend on an async callback to become visible.
      var vh = window.innerHeight || document.documentElement.clientHeight;
      for (var j = 0; j < revealables.length; j++) {
        if (revealables[j].getBoundingClientRect().top < vh) {
          revealables[j].classList.add('is-in');
        }
      }

      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-in');
            io.unobserve(entry.target);   // reveal once, never re-hide
          }
        });
      }, { rootMargin: '0px 0px -8% 0px', threshold: 0.06 });

      revealables.forEach(function (el) { io.observe(el); });

      // Failsafe: whatever happens, everything is visible shortly after load.
      // Cheap insurance against a blank page.
      window.setTimeout(revealAll, 2000);
    }
  }

  /* --- Gallery lightbox ------------------------------------------------ */
  /* Progressive enhancement over plain links: each gallery item is an
     <a href="full-size.webp">, which works on its own. Here we intercept the
     click and show it in a native <dialog> instead — the browser supplies
     focus trapping, Escape handling and the backdrop. */

  var gallery = document.querySelector('[data-gallery]');
  var dialog = document.querySelector('.lightbox');

  if (gallery && dialog && typeof dialog.showModal === 'function') {
    var dImg = dialog.querySelector('img');
    var dCap = dialog.querySelector('figcaption');
    var links = Array.prototype.slice.call(gallery.querySelectorAll('a[href]'));
    var index = -1;
    var opener = null;

    var show = function (i) {
      if (i < 0) i = links.length - 1;
      if (i >= links.length) i = 0;
      index = i;
      var link = links[i];
      var img = link.querySelector('img');
      dImg.src = link.getAttribute('href');
      // Reuse the thumbnail's alt text so the large view is described too.
      dImg.alt = img ? img.getAttribute('alt') || '' : '';
      var cap = link.closest('figure');
      cap = cap ? cap.querySelector('figcaption') : null;
      dCap.textContent = cap ? cap.textContent : dImg.alt;
      dialog.setAttribute('aria-label',
        'Image ' + (i + 1) + ' of ' + links.length +
        (dImg.alt ? ': ' + dImg.alt : ''));
    };

    gallery.addEventListener('click', function (e) {
      var link = e.target.closest('a[href]');
      if (!link || !gallery.contains(link)) return;
      e.preventDefault();
      opener = link;
      show(links.indexOf(link));
      dialog.showModal();
    });

    dialog.addEventListener('click', function (e) {
      var act = e.target.closest('[data-lb]');
      if (act) {
        var a = act.getAttribute('data-lb');
        if (a === 'close') dialog.close();
        if (a === 'prev') show(index - 1);
        if (a === 'next') show(index + 1);
        return;
      }
      // Clicking the backdrop (outside the image) closes.
      if (e.target === dialog) dialog.close();
    });

    dialog.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') { e.preventDefault(); show(index - 1); }
      if (e.key === 'ArrowRight') { e.preventDefault(); show(index + 1); }
    });

    // Return focus to the thumbnail that was opened, and drop the large image
    // so it is not kept in memory.
    dialog.addEventListener('close', function () {
      dImg.removeAttribute('src');
      if (opener) { opener.focus(); opener = null; }
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
