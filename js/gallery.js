/* gallery.js */

(() => {
  'use strict';

  // Elements
  const modalEl = document.getElementById('gallery-modal');
  const imageEl = document.getElementById('gallery-full');
  const closeBtn = modalEl?.querySelector('.modal-close');
  const tiles = Array.from(document.querySelectorAll('.tile'));

  // Early exit if required elements are missing
  if (!modalEl || !imageEl || tiles.length === 0) return;

  let lastFocusedElement = null;
  const ESC_KEY = 'Escape';

  /**
   * Open the modal and show the image.
   * @param {string} src - URL of the full-size image.
   */
  function openModal(src) {
    if (!src) return;
    lastFocusedElement = document.activeElement;
    imageEl.src = src;
    modalEl.classList.add('open');
    modalEl.setAttribute('aria-hidden', 'false');
    // move focus to close button for accessibility
    closeBtn?.focus();
  }

  /**
   * Close the modal and clear the image.
   */
  function closeModal() {
    modalEl.classList.remove('open');
    modalEl.setAttribute('aria-hidden', 'true');
    imageEl.src = '';
    // restore focus to the element that opened the modal
    lastFocusedElement?.focus();
    lastFocusedElement = null;
  }

  /**
   * Click handler for a tile element.
   * @param {MouseEvent|KeyboardEvent} event
   */
  function onTileActivated(event) {
    // Accept both click and keyboard activation (Enter/Space)
    if (event.type === 'keydown') {
      const key = event.key;
      if (key !== 'Enter' && key !== ' ' && key !== 'Spacebar') return;
      // prevent page scroll for Space
      event.preventDefault();
    }
    const tile = event.currentTarget;
    const src = tile.dataset.full || tile.getAttribute('data-full');
    openModal(src);
  }

  // Attach listeners to tiles
  tiles.forEach(tile => {
    tile.addEventListener('click', onTileActivated);
    tile.addEventListener('keydown', onTileActivated);
    // ensure tiles are keyboard-focusable (in case markup omitted)
    if (!tile.hasAttribute('tabindex')) tile.setAttribute('tabindex', '0');
  });

  // Close button
  closeBtn?.addEventListener('click', closeModal);

  // Clicking backdrop closes modal
  modalEl.addEventListener('click', (e) => {
    if (e.target === modalEl) closeModal();
  });

  // Keyboard: Escape closes modal
  document.addEventListener('keydown', (e) => {
    if (e.key === ESC_KEY) closeModal();
  });

  // Optional: when modal opens, trap focus to close button only (simple approach)
  // More complete focus trapping can be added later if needed.
})();
