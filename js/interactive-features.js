const InteractiveFeatures = (() => {
  /* 1. Golden Rule Grayscale Mode */
  const grayscaleToggle = Utils.safeEl('[data-grayscale-toggle]');
  const root = document.documentElement;

  function toggleGrayscale() {
    const isGrayscale = root.getAttribute('data-grayscale') === 'true';
    const nextState = !isGrayscale;
    if (nextState) {
      root.setAttribute('data-grayscale', 'true');
    } else {
      root.removeAttribute('data-grayscale');
    }
    if (grayscaleToggle) {
      grayscaleToggle.setAttribute('aria-pressed', String(nextState));
      grayscaleToggle.classList.toggle('grayscale-toggle--active', nextState);
    }
    showToast(nextState 
      ? 'Golden Rule Active: Grayscale hierarchy test enabled' 
      : 'Color mode restored'
    );
  }

  /* Toast Notification Utility */
  function showToast(message) {
    let toast = Utils.safeEl('.app-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'app-toast';
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add('app-toast--visible');
    setTimeout(() => {
      toast.classList.remove('app-toast--visible');
    }, 3000);
  }

  /* 2. Pillar 1: Empathy Map Interactive Quadrants */
  const empathyData = {
    says: {
      title: 'What Mobile Users Say',
      quotes: [
        '"I need pages to load in under 2 seconds on mobile data."',
        '"Buttons must be large enough for touch targets without accidental taps."',
        '"I hate popups and clutter when reading on a small screen."'
      ],
      icon: '💬',
      badge: 'User Quote'
    },
    thinks: {
      title: 'What Mobile Users Think',
      quotes: [
        '"Is this site secure and trustworthy for my personal details?"',
        '"Will this form lose my inputs if my screen orientation shifts?"',
        '"Can I navigate easily with one hand while on the move?"'
      ],
      icon: '🧠',
      badge: 'Cognitive Model'
    },
    does: {
      title: 'What Mobile Users Do',
      quotes: [
        'Swipes quickly through content sections looking for key callouts.',
        'Scrolls with thumb in vertical single-column layouts.',
        'Toggles dark mode immediately depending on ambient room lighting.'
      ],
      icon: '📱',
      badge: 'Behavioral Pattern'
    },
    feels: {
      title: 'What Mobile Users Feel',
      quotes: [
        'Delighted by warm, grounded aesthetic colors (Mocha Mousse & Ethereal Blue).',
        'Frustrated by slow, framework-heavy bloated scripts.',
        'Reassured by crisp typography and clear WCAG high-contrast text.'
      ],
      icon: '✨',
      badge: 'Emotional State'
    }
  };

  function initEmpathyMap() {
    const quadrants = Utils.safeAll('[data-empathy-quadrant]');
    const displayCard = Utils.safeEl('[data-empathy-display]');
    if (!quadrants.length || !displayCard) return;

    function renderQuadrant(key) {
      const data = empathyData[key];
      if (!data) return;

      quadrants.forEach(q => {
        const isActive = q.getAttribute('data-empathy-quadrant') === key;
        q.classList.toggle('empathy-quadrant--active', isActive);
        q.setAttribute('aria-selected', String(isActive));
      });

      displayCard.innerHTML = `
        <div class="empathy-card__header">
          <span class="empathy-card__icon" aria-hidden="true">${data.icon}</span>
          <div>
            <span class="empathy-card__badge">${data.badge}</span>
            <h4 class="empathy-card__title">${data.title}</h4>
          </div>
        </div>
        <ul class="empathy-card__list">
          ${data.quotes.map(q => `<li><span class="empathy-card__bullet">❯</span> ${q}</li>`).join('')}
        </ul>
      `;
    }

    quadrants.forEach(quadrant => {
      quadrant.addEventListener('click', () => {
        const key = quadrant.getAttribute('data-empathy-quadrant');
        renderQuadrant(key);
      });
    });

    // Default to 'says'
    renderQuadrant('says');
  }

  /* 3. Pillar 2: Color Palette Inspector & Copy Hex */
  function initColorInspector() {
    const swatches = Utils.safeAll('[data-color-swatch]');
    swatches.forEach(swatch => {
      swatch.addEventListener('click', () => {
        const hex = swatch.getAttribute('data-color-swatch');
        if (navigator.clipboard && hex) {
          navigator.clipboard.writeText(hex).then(() => {
            showToast(`Copied ${hex} to clipboard!`);
          }).catch(() => {
            showToast(`Color code: ${hex}`);
          });
        } else if (hex) {
          showToast(`Color code: ${hex}`);
        }
      });
    });
  }

  /* 4. Slide 3: Viewport Tester Simulation */
  function initViewportTester() {
    const buttons = Utils.safeAll('[data-viewport-target]');
    const previewContainer = Utils.safeEl('[data-viewport-container]');
    const labelEl = Utils.safeEl('[data-viewport-label]');

    if (!buttons.length || !previewContainer) return;

    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        const target = btn.getAttribute('data-viewport-target');
        buttons.forEach(b => b.classList.remove('viewport-btn--active'));
        btn.classList.add('viewport-btn--active');

        previewContainer.className = 'viewport-container viewport-container--' + target;
        if (labelEl) {
          const names = {
            mobile: 'Mobile Viewport (375px) — Single Column Layout',
            tablet: 'Tablet Viewport (768px) — Dual Column Grid',
            desktop: 'Desktop Viewport (1200px) — Full Multi-Column Grid'
          };
          labelEl.textContent = names[target] || 'Responsive Viewport';
        }
      });
    });
  }

  /* 5. Semantic Landmark Inspector Toggle */
  function initSemanticInspector() {
    const toggleBtn = Utils.safeEl('[data-semantic-toggle]');
    if (!toggleBtn) return;

    toggleBtn.addEventListener('click', () => {
      const isActive = root.getAttribute('data-semantic-inspector') === 'true';
      const nextState = !isActive;
      if (nextState) {
        root.setAttribute('data-semantic-inspector', 'true');
      } else {
        root.removeAttribute('data-semantic-inspector');
      }
      toggleBtn.classList.toggle('semantic-btn--active', nextState);
      showToast(nextState ? 'Semantic HTML & Accessibility Outlines Enabled' : 'Semantic Outlines Hidden');
    });
  }

  /* 6. Toolkit Interactive Tabs */
  function initToolkitTabs() {
    const tabs = Utils.safeAll('[data-toolkit-tab]');
    const panels = Utils.safeAll('[data-toolkit-panel]');
    if (!tabs.length || !panels.length) return;

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const targetId = tab.getAttribute('data-toolkit-tab');
        tabs.forEach(t => {
          t.classList.remove('toolkit-tab--active');
          t.setAttribute('aria-selected', 'false');
        });
        panels.forEach(p => p.classList.remove('toolkit-panel--active'));

        tab.classList.add('toolkit-tab--active');
        tab.setAttribute('aria-selected', 'true');

        const activePanel = Utils.safeEl(`#toolkit-panel-${targetId}`);
        if (activePanel) activePanel.classList.add('toolkit-panel--active');
      });
    });
  }

  /* Init All Interactive Features */
  function init() {
    if (grayscaleToggle) {
      grayscaleToggle.addEventListener('click', toggleGrayscale);
    }
    initEmpathyMap();
    initColorInspector();
    initViewportTester();
    initSemanticInspector();
    initToolkitTabs();
  }

  return { init, toggleGrayscale };
})();
