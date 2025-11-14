(() => {
  'use strict';

  // Configuration
  const REVEAL_THRESHOLD = 0.12;
  const SKILLS_THRESHOLD = 0.18;
  const TIMELINE_THRESHOLD = 0.14;
  const PROJECT_BASE_DELAY = 200;
  const PROJECT_STAGGER = 100;

  /**
   * Observe elements matching selector and add a class once each becomes visible.
   * @param {string} selector
   * @param {string} className
   * @param {IntersectionObserverInit} [options]
   */
  function observeOnce(selector, className, options = { threshold: REVEAL_THRESHOLD }) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add(className);
        obs.unobserve(entry.target);
      });
    }, options);

    document.querySelectorAll(selector).forEach(el => observer.observe(el));
  }

  /**
   * Animate skill progress bars when the skills section is visible.
   */
  function setupSkillsProgress() {
    const skillsEl = document.getElementById('skills');
    if (!skillsEl) return;

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;

        skillsEl.querySelectorAll('.skill-track').forEach(track => {
          const fill = track.querySelector('.skill-fill');
          const dataProgress = track.dataset.progress ?? track.getAttribute('aria-valuenow') ?? '0';
          const target = Math.max(0, Math.min(100, parseInt(dataProgress, 10) || 0));
          if (fill) fill.style.width = `${target}%`;
          track.setAttribute('aria-valuenow', String(target));
        });

        obs.unobserve(entry.target);
      });
    }, { threshold: SKILLS_THRESHOLD });

    observer.observe(skillsEl);
  }

  /**
   * Reveal timeline items when they appear.
   */
  function setupTimeline() {
    observeOnce('.timeline-item', 'visible', { threshold: TIMELINE_THRESHOLD });
  }

  /**
   * Stagger reveal of project cards on load.
   */
  function setupProjectsStaggerReveal() {
    const cards = Array.from(document.querySelectorAll('.project-card'));
    if (!cards.length) return;
    cards.forEach((card, i) => {
      setTimeout(() => card.classList.add('revealed'), PROJECT_BASE_DELAY + i * PROJECT_STAGGER);
    });
  }

  /**
   * Smooth scroll to #about when hero indicator or chevron clicked.
   * Uses event delegation.
   */
  function setupScrollToAbout() {
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('.hero-scroll-indicator, .chev');
      if (!btn) return;
      const about = document.getElementById('about');
      if (about) about.scrollIntoView({ behavior: 'smooth' });
    });
  }


  // Initialize
  observeOnce('section', 'revealed', { threshold: REVEAL_THRESHOLD });
  setupSkillsProgress();
  setupTimeline();
  setupProjectsStaggerReveal();
  setupScrollToAbout();
})();
