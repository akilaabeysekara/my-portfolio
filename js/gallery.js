/*gallery.js */
(() => {
  'use strict';

  const modalEl = document.getElementById('gallery-modal');
  const imageEl = document.getElementById('gallery-full');
  const closeBtn = modalEl?.querySelector('.modal-close');
  const tiles = Array.from(document.querySelectorAll('.tile'));
  if (!modalEl || !imageEl || tiles.length === 0) return;

  let lastFocusedElement = null;
  const ESC_KEY = 'Escape';

  function openModal(src, alt = '') {
    if (!src) return;
    lastFocusedElement = document.activeElement;
    // set src and alt
    imageEl.src = src;
    imageEl.alt = alt || 'Expanded gallery image';
    // show modal
    modalEl.classList.add('open');
    modalEl.setAttribute('aria-hidden', 'false');

    // prevent background from scrolling while modal open
    document.documentElement.style.overflow = 'hidden';
    // move focus to close button
    closeBtn?.focus();
  }

  function closeModal() {
    modalEl.classList.remove('open');
    modalEl.setAttribute('aria-hidden', 'true');
    // clear image after transition to avoid instantly loading many images
    imageEl.src = '';
    document.documentElement.style.overflow = '';
    // restore focus
    lastFocusedElement?.focus();
    lastFocusedElement = null;
  }

  function onTileActivated(event) {
    const isKey = event.type === 'keydown';
    if (isKey) {
      const k = event.key;
      // accept Enter or Space
      if (k !== 'Enter' && k !== ' ' && k !== 'Spacebar') return;
      event.preventDefault(); // for Space to avoid page scroll
    }
    const tile = event.currentTarget;
    const src = tile.dataset.full || tile.getAttribute('data-full');
    const img = tile.querySelector('img');
    const alt = img?.alt || '';
    openModal(src, alt);
  }

  // Attach listeners to tiles
  tiles.forEach(tile => {
    tile.addEventListener('click', onTileActivated);
    tile.addEventListener('keydown', onTileActivated);
    // ensure tiles are keyboard-focusable (defensive)
    if (!tile.hasAttribute('tabindex')) tile.setAttribute('tabindex', '0');
  });

  // Close handlers (guard existence)
  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  // Clicking backdrop closes modal (but clicking image does nothing)
  modalEl.addEventListener('click', (e) => {
    if (e.target === modalEl) closeModal();
  });

  // Escape closes modal
  document.addEventListener('keydown', (e) => {
    if (e.key === ESC_KEY && modalEl.classList.contains('open')) {
      closeModal();
    }
  });

  // Minimal focus trap: keep focus on close button while modal open
  document.addEventListener('focus', (e) => {
    if (!modalEl.classList.contains('open')) return;
    if (!modalEl.contains(e.target)) {
      e.stopPropagation();
      closeBtn?.focus();
    }
  }, true);
})();
