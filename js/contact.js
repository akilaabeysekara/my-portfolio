/* contact.js */

(() => {
  'use strict';

  const form = document.getElementById('contact-form');
  if (!form) return;

  // small helpers
  const q = (sel, ctx = document) => (ctx || document).querySelector(sel);
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // create message element if not present
  let msgEl = q('.form-msg', form);
  if (!msgEl) {
    msgEl = document.createElement('div');
    msgEl.className = 'form-msg';
    form.appendChild(msgEl);
  }

  // helper: set message
  function showMessage(text, type = '') {
    msgEl.textContent = text || '';
    msgEl.classList.remove('success', 'error');
    if (type) msgEl.classList.add(type);
  }

  // basic validation
  function validate() {
    const name = q('#name', form).value.trim();
    const email = q('#email', form).value.trim();
    const message = q('#message', form).value.trim();

    if (!name) {
      showMessage('Please enter your name.', 'error');
      q('#name', form).focus();
      return false;
    }
    if (!email || !emailRegex.test(email)) {
      showMessage('Please enter a valid email address.', 'error');
      q('#email', form).focus();
      return false;
    }
    if (!message) {
      showMessage('Please enter a message.', 'error');
      q('#message', form).focus();
      return false;
    }
    return true;
  }

  // simulate submit (demo) — replace with fetch(...) to your server if available
  async function submitForm(data) {
    // demo: wait 700ms to simulate network
    await new Promise((res) => setTimeout(res, 700));
    // return success (for demo)
    return { ok: true };
  }

  form.addEventListener('submit', async (ev) => {
    ev.preventDefault();
    showMessage('', '');

    if (!validate()) return;

    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Sending...';

    const payload = {
      name: q('#name', form).value.trim(),
      email: q('#email', form).value.trim(),
      message: q('#message', form).value.trim(),
    };

    try {
      // Demo submission – replace with your own endpoint / API
      const res = await submitForm(payload);
      if (res && res.ok) {
        showMessage('Thanks — your message has been sent. I will reply soon!', 'success');
        form.reset();
      } else {
        throw new Error('Submission failed');
      }
    } catch (err) {
      showMessage('Sorry — could not send the message. Try again later or email akila@example.com', 'error');
      console.error('Contact submit error:', err);
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
    }
  });

  // Optional: press Enter inside the message textarea to submit if meta/ctrl not pressed
  const textarea = q('#message', form);
  if (textarea) {
    textarea.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        form.requestSubmit();
      }
    });
  }

})();
