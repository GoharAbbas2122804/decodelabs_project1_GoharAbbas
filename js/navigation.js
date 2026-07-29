const Navigation = (() => {
  const hamburger = Utils.safeEl('[data-hamburger]');
  const mobileNav = Utils.safeEl('[data-mobile-nav]');
  const navLinks = Utils.safeAll('.main-nav__link');
  const backToTopBtn = Utils.safeEl('[data-back-to-top]');

  let isOpen = false;

  function toggle() {
    isOpen = !isOpen;
    if (hamburger) hamburger.classList.toggle('hamburger--active', isOpen);
    if (mobileNav) mobileNav.classList.toggle('mobile-nav--open', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
    const expanded = hamburger ? hamburger.getAttribute('aria-expanded') === 'true' : false;
    if (hamburger) hamburger.setAttribute('aria-expanded', String(!expanded));
  }

  function close() {
    if (!isOpen) return;
    isOpen = false;
    if (hamburger) hamburger.classList.remove('hamburger--active');
    if (mobileNav) mobileNav.classList.remove('mobile-nav--open');
    document.body.style.overflow = '';
    if (hamburger) hamburger.setAttribute('aria-expanded', 'false');
  }

  function onHashChange() {
    close();
  }

  function onScroll() {
    if (!backToTopBtn) return;
    const scrollY = window.scrollY || window.pageYOffset;
    backToTopBtn.classList.toggle('back-to-top--visible', scrollY > 400);
  }

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function highlightActive() {
    const sections = Utils.safeAll('section[id]');
    const scrollPos = (window.scrollY || window.pageYOffset) + 100;
    let currentId = '';
    sections.forEach((section) => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        currentId = section.getAttribute('id');
      }
    });
    navLinks.forEach((link) => {
      link.classList.remove('main-nav__link--active');
      const href = link.getAttribute('href');
      if (href && href.startsWith('#') && currentId && href === '#' + currentId) {
        link.classList.add('main-nav__link--active');
        link.style.color = 'var(--color-primary)';
      } else {
        link.style.color = '';
      }
    });
  }

  function init() {
    if (hamburger) {
      hamburger.addEventListener('click', toggle);
    }
    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        const href = link.getAttribute('href');
        if (href && href.startsWith('#')) {
          close();
        }
      });
    });
    if (backToTopBtn) {
      backToTopBtn.addEventListener('click', scrollToTop);
    }
    window.addEventListener('scroll', Utils.throttle(highlightActive, 100), { passive: true });
    window.addEventListener('scroll', Utils.throttle(onScroll, 100), { passive: true });
    window.addEventListener('hashchange', onHashChange);
    window.addEventListener('resize', Utils.debounce(() => {
      if (window.innerWidth >= 768) close();
    }, 150));
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && isOpen) close();
    });
  }

  return { init, toggle, close };
})();