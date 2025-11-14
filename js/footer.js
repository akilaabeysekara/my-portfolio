/**
 * Update element(s) matching selector with the current year.
 * @param {string} [selector='#footer-year'] CSS selector for the element(s) to update.
 * @returns {Element[]|null} Updated elements, or null if none found.
 */
function setFooterYear(selector = '#footer-year') {
  const els = Array.from(document.querySelectorAll(selector));
  if (els.length === 0) {
    console.warn(`setFooterYear: no elements found for selector "${selector}"`);
    return null;
  }
  const year = String(new Date().getFullYear());
  els.forEach(el => { el.textContent = year; });
  return els;
}

// Auto-run when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => setFooterYear());
} else {
  setFooterYear();
}
