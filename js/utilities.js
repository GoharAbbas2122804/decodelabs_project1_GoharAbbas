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

  function initScrollReveal() {
    const revealEls = document.querySelectorAll('[data-reveal]');

    if (!revealEls.length) return;

    // Mark all elements as observed so CSS fallback doesn't apply
    revealEls.forEach(el => el.setAttribute('data-observe', 'true'));

    if (!('IntersectionObserver' in window) || prefersReducedMotion) {
      // Fallback: show everything immediately
      revealEls.forEach(el => {
        el.classList.add('revealed');
      });
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px'
    });

    revealEls.forEach(el => observer.observe(el));

    // Immediately trigger for elements already in viewport
    revealEls.forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        el.classList.add('revealed');
        observer.unobserve(el);
      }
    });
  }

  function initCounters() {
    const counterEls = document.querySelectorAll('[data-count]');
    if (!counterEls.length) return;

    if (!('IntersectionObserver' in window) || prefersReducedMotion) {
      counterEls.forEach(el => {
        el.textContent = el.getAttribute('data-count');
      });
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const target = parseInt(entry.target.getAttribute('data-count'), 10);
          animateCounter(entry.target, target, 1500);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    counterEls.forEach(el => observer.observe(el));
  }

  return {
    throttle,
    debounce,
    safeEl,
    safeAll,
    animateCounter,
    initScrollReveal,
    initCounters,
    prefersReducedMotion,
  };
})();