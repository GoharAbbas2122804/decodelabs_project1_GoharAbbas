const ThemeToggle = (() => {
  const toggleBtn = Utils.safeEl('[data-theme-toggle]');
  const root = document.documentElement;

  function getStored() {
    try {
      return localStorage.getItem('theme');
    } catch {
      return null;
    }
  }

  function setStored(theme) {
    try {
      localStorage.setItem('theme', theme);
    } catch {
      /* storage unavailable */
    }
  }

  function apply(theme) {
    if (theme === 'dark') {
      root.setAttribute('data-theme', 'dark');
    } else {
      root.removeAttribute('data-theme');
    }
    if (toggleBtn) {
      toggleBtn.setAttribute('aria-checked', String(theme === 'dark'));
    }
  }

  function toggle() {
    const current = root.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    apply(next);
    setStored(next);
  }

  function init() {
    const stored = getStored();
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    apply(stored || (prefersDark ? 'dark' : 'light'));
    if (toggleBtn) {
      toggleBtn.addEventListener('click', toggle);
    }
  }

  return { init, toggle };
})();

const App = (() => {
  function init() {
    Navigation.init();
    FormValidation.init();
    ThemeToggle.init();
    if (typeof InteractiveFeatures !== 'undefined') {
      InteractiveFeatures.init();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  return { init };
})();