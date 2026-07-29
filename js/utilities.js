const Utils = (() => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function throttle(fn, delay) {
    let lastCall = 0;
    let timer = null;
    return function (...args) {
      const now = Date.now();
      const remaining = delay - (now - lastCall);
      clearTimeout(timer);
      if (remaining <= 0) {
        lastCall = now;
        fn.apply(this, args);
      } else if (!prefersReducedMotion) {
        timer = setTimeout(() => {
          lastCall = Date.now();
          fn.apply(this, args);
        }, remaining);
      }
    };
  }

  function debounce(fn, delay) {
    let timer = null;
    return function (...args) {
      clearTimeout(timer);
      timer = setTimeout(() => fn.apply(this, args), delay);
    };
  }

  function safeEl(selector) {
    try {
      return document.querySelector(selector);
    } catch {
      return null;
    }
  }

  function safeAll(selector) {
    try {
      return document.querySelectorAll(selector);
    } catch {
      return [];
    }
  }

  function animateCounter(el, target, duration) {
    if (prefersReducedMotion) {
      el.textContent = target;
      return;
    }
    let start = 0;
    const step = (timestamp) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      el.textContent = Math.floor(progress * target);
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = target;
      }
    };
    requestAnimationFrame(step);
  }

  return {
    throttle,
    debounce,
    safeEl,
    safeAll,
    animateCounter,
    prefersReducedMotion,
  };
})();