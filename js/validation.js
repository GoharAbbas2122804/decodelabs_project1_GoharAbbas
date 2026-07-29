const FormValidation = (() => {
  const form = Utils.safeEl('[data-form]');
  const inputs = Utils.safeAll('[data-validate]');
  const submitBtn = Utils.safeEl('[data-submit]');
  const successMsg = Utils.safeEl('[data-form-success]');
  const errorMsg = Utils.safeEl('[data-form-error]');

  const rules = {
    name: {
      test: (v) => v.trim().length >= 2,
      message: 'Name must be at least 2 characters.',
    },
    email: {
      test: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()),
      message: 'Please enter a valid email address.',
    },
    subject: {
      test: (v) => v.trim().length >= 2,
      message: 'Subject must be at least 2 characters.',
    },
    message: {
      test: (v) => v.trim().length >= 10,
      message: 'Message must be at least 10 characters.',
    },
  };

  function validateField(input) {
    const name = input.getAttribute('name');
    const rule = rules[name];
    if (!rule) return true;
    const errorEl = input.parentElement.querySelector('.form-error');
    const isValid = rule.test(input.value);
    input.classList.toggle('form-input--error', !isValid);
    input.classList.toggle('form-textarea--error', !isValid);
    if (errorEl) {
      errorEl.textContent = isValid ? '' : rule.message;
      errorEl.classList.toggle('form-error--visible', !isValid);
    }
    input.setAttribute('aria-invalid', String(!isValid));
    return isValid;
  }

  function validateAll() {
    let allValid = true;
    inputs.forEach((input) => {
      if (!validateField(input)) allValid = false;
    });
    return allValid;
  }

  function clearErrors() {
    inputs.forEach((input) => {
      input.classList.remove('form-input--error', 'form-textarea--error');
      input.setAttribute('aria-invalid', 'false');
      const errorEl = input.parentElement.querySelector('.form-error');
      if (errorEl) errorEl.classList.remove('form-error--visible');
    });
  }

  function handleSubmit(e) {
    e.preventDefault();
    clearErrors();
    if (!validateAll()) return;
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending...';
      submitBtn.classList.add('btn--disabled');
    }
    setTimeout(() => {
      if (form) form.reset();
      if (successMsg) successMsg.classList.add('form-success--visible');
      if (errorMsg) errorMsg.classList.remove('form-error--visible');
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send Message';
        submitBtn.classList.remove('btn--disabled');
      }
      if (successMsg) {
        setTimeout(() => successMsg.classList.remove('form-success--visible'), 5000);
      }
    }, 1000);
  }

  function init() {
    if (!form) return;
    inputs.forEach((input) => {
      input.addEventListener('blur', () => validateField(input));
      input.addEventListener('input', () => {
        input.classList.remove('form-input--error', 'form-textarea--error');
        const errorEl = input.parentElement.querySelector('.form-error');
        if (errorEl) errorEl.classList.remove('form-error--visible');
        input.setAttribute('aria-invalid', 'false');
      });
    });
    form.addEventListener('submit', handleSubmit);
  }

  return { init, validateField, validateAll };
})();