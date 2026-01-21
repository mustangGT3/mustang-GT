// Simple SPA router: load other HTML pages into the <main> element of index.html
// Behavior:
// - Intercepts clicks on same-origin links that end with .html
// - Fetches the target HTML, extracts its <main> content and <title>, and injects into the current page
// - Updates history (pushState) and handles back/forward (popstate)

(function () {
  'use strict';

  async function fetchPage(url) {
    try {
      const res = await fetch(url, { cache: 'no-store' });
      if (!res.ok) throw new Error('Network response was not ok');
      const text = await res.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(text, 'text/html');
      return doc;
    } catch (err) {
      console.error('fetchPage error', err);
      return null;
    }
  }

  async function updateMetaTags(doc) {
    // Update meta description
    const newDescription = doc.querySelector('meta[name="description"]');
    if (newDescription) {
      const existing = document.querySelector('meta[name="description"]');
      if (existing) existing.setAttribute('content', newDescription.getAttribute('content'));
    }

    // Update meta keywords
    const newKeywords = doc.querySelector('meta[name="keywords"]');
    if (newKeywords) {
      const existing = document.querySelector('meta[name="keywords"]');
      if (existing) existing.setAttribute('content', newKeywords.getAttribute('content'));
    }

    // Update canonical tag
    const newCanonical = doc.querySelector('link[rel="canonical"]');
    if (newCanonical) {
      let canonical = document.querySelector('link[rel="canonical"]');
      if (!canonical) {
        canonical = document.createElement('link');
        canonical.rel = 'canonical';
        document.head.appendChild(canonical);
      }
      canonical.setAttribute('href', newCanonical.getAttribute('href'));
    }

    // Update OG:title
    const newOgTitle = doc.querySelector('meta[property="og:title"]');
    if (newOgTitle) {
      const existing = document.querySelector('meta[property="og:title"]');
      if (existing) existing.setAttribute('content', newOgTitle.getAttribute('content'));
    }

    // Update OG:description
    const newOgDesc = doc.querySelector('meta[property="og:description"]');
    if (newOgDesc) {
      const existing = document.querySelector('meta[property="og:description"]');
      if (existing) existing.setAttribute('content', newOgDesc.getAttribute('content'));
    }

    // Update OG:url
    const newOgUrl = doc.querySelector('meta[property="og:url"]');
    if (newOgUrl) {
      const existing = document.querySelector('meta[property="og:url"]');
      if (existing) existing.setAttribute('content', newOgUrl.getAttribute('content'));
    }

    // Update robots meta tag
    const newRobots = doc.querySelector('meta[name="robots"]');
    if (newRobots) {
      let robots = document.querySelector('meta[name="robots"]');
      if (!robots) {
        robots = document.createElement('meta');
        robots.name = 'robots';
        document.head.appendChild(robots);
      }
      robots.setAttribute('content', newRobots.getAttribute('content'));
    }
  }

  async function loadIntoMain(url, replaceState = false) {
    const doc = await fetchPage(url);
    if (!doc) return;

    const newMain = doc.querySelector('main');
    const currentMain = document.querySelector('main');
    if (newMain && currentMain) {
      currentMain.innerHTML = newMain.innerHTML;
    }

    // update title
    const newTitle = doc.querySelector('title');
    if (newTitle) document.title = newTitle.innerText;

    // Update SEO meta tags
    updateMetaTags(doc);

    // update URL & history
    if (replaceState) {
      history.replaceState({ url }, '', url);
    } else {
      history.pushState({ url }, '', url);
    }

    window.scrollTo(0, 0);
  }

  // Intercept clicks on links that target local .html files
  document.addEventListener('click', function (e) {
    const a = e.target.closest('a');
    if (!a) return;
    const href = a.getAttribute('href');
    if (!href) return;

    // Only handle same-document HTML links (not external, not anchors, not mailto/tel)
    const isLocalHtml = href.endsWith('.html') && !href.startsWith('http') && !href.startsWith('mailto:') && !href.startsWith('tel:');
    if (!isLocalHtml) return;

    // Let links with target (e.g., _blank) behave normally
    if (a.target && a.target !== '_self') return;

    // Prevent full page navigation and load into main instead
    e.preventDefault();
    loadIntoMain(href);
  });

  // Handle popstate (back/forward)
  window.addEventListener('popstate', function (e) {
    const url = location.pathname.replace(/^\//, '') || 'index.html';
    // If we're already on the matching URL, do nothing
    loadIntoMain(url, true);
  });

  // On first load: if path is not index.html, load that page into main
  (function initialLoad() {
    const path = location.pathname.replace(/^\//, '');
    if (path && path !== '' && path !== 'index.html') {
      // Replace the current history entry so SPA stays usable
      loadIntoMain(path, true);
    }
  }());

}());
