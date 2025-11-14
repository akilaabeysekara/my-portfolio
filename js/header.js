(() => {
  'use strict';

// Header navigation elements

  const SELECTORS = {
    toggle: '#nav-toggle',
    close: '#nav-close',
    nav: '#primary-nav, .mobile-nav'
  };

  const MOBILE_CLOSE_WIDTH = 980; // px - threshold for auto-closing when a link is clicked

  const navToggle = document.querySelector(SELECTORS.toggle);
  const navClose = document.querySelector(SELECTORS.close);
  const mobileNav = document.querySelector(SELECTORS.nav);

  if (!navToggle || !mobileNav) {
    // Required elements missing — nothing to do.
    return;
  }

  // Utility: set ARIA + body class consistently
  function setNavOpenState(isOpen) {
    mobileNav.classList.toggle('open', isOpen);
    mobileNav.setAttribute('aria-hidden', String(!isOpen));
    navToggle.setAttribute('aria-expanded', String(isOpen));
    document.body.classList.toggle('nav-open', isOpen);
  }

  // Event handlers
  function onDocumentClick(e) {
    // Close when clicking outside the open nav (but not when clicking the toggle)
    if (!mobileNav.contains(e.target) && e.target !== navToggle) {
      closeNav();
    }
  }

  function onDocumentKeydown(e) {
    if (e.key === 'Escape') {
      closeNav();
    }
  }

  function toggleNav() {
    const isOpen = mobileNav.classList.contains('open');
    isOpen ? closeNav() : openNav();
  }

  function openNav() {
    setNavOpenState(true);
    // focus first interactive element for keyboard users
    const firstLink = mobileNav.querySelector('a, button, [tabindex]:not([tabindex="-1"])');
    if (firstLink) firstLink.focus();

    // Attach global listeners only when open
    document.addEventListener('click', onDocumentClick);
    document.addEventListener('keydown', onDocumentKeydown);
  }

  function closeNav() {
    setNavOpenState(false);
    // return focus to the toggle for better keyboard flow
    navToggle.focus();

    document.removeEventListener('click', onDocumentClick);
    document.removeEventListener('keydown', onDocumentKeydown);
  }

  // Toggle via click
  navToggle.addEventListener('click', (e) => {
    toggleNav();
  });

  // Support Enter and Space when the toggle has keyboard focus
  navToggle.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault(); // prevent scrolling on Space
      toggleNav();
    }
  });

  // Optional close button inside the nav
  if (navClose) {
    navClose.addEventListener('click', closeNav);
  }

  // Close nav after clicking any internal link on small screens
  mobileNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth < MOBILE_CLOSE_WIDTH) {
        closeNav();
      }
    });
  });

  // Initialize ARIA attributes to a consistent state
  (function initAccessibility() {
    const isOpen = mobileNav.classList.contains('open');
    mobileNav.setAttribute('role', mobileNav.getAttribute('role') || 'navigation');
    mobileNav.setAttribute('aria-hidden', String(!isOpen));
    navToggle.setAttribute('aria-expanded', String(isOpen));
  }());
})();
