function initThemeToggle() {
  const button = document.querySelector<HTMLButtonElement>('[data-theme-toggle]');
  if (!button) return;

  button.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    try {
      localStorage.setItem('theme', next);
    } catch {
      /* ignore */
    }
  });
}

function initMobileMenu() {
  const toggle = document.querySelector<HTMLButtonElement>('[data-menu-toggle]');
  const panel = document.querySelector<HTMLElement>('[data-mobile-nav]');
  if (!toggle || !panel) return;

  const setOpen = (open: boolean) => {
    panel.hidden = !open;
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
  };

  toggle.addEventListener('click', () => {
    setOpen(panel.hidden);
  });

  panel.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => setOpen(false));
  });
}

function initSliders() {
  document.querySelectorAll<HTMLElement>('[data-slider]').forEach((root) => {
    const track = root.querySelector<HTMLElement>('[data-track]');
    const slides = root.querySelectorAll('[data-slide], .slide');
    const dots = root.querySelectorAll<HTMLButtonElement>('[data-dot]');
    const prev = root.querySelector<HTMLButtonElement>('[data-prev]');
    const next = root.querySelector<HTMLButtonElement>('[data-next]');
    if (!track || slides.length === 0) return;

    let index = 0;

    const goTo = (nextIndex: number) => {
      index = (nextIndex + slides.length) % slides.length;
      track.style.transform = `translateX(-${index * 100}%)`;
      dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
      });
    };

    prev?.addEventListener('click', () => goTo(index - 1));
    next?.addEventListener('click', () => goTo(index + 1));
    dots.forEach((dot) => {
      dot.addEventListener('click', () => {
        const i = Number(dot.dataset.dot);
        if (!Number.isNaN(i)) goTo(i);
      });
    });
  });
}

function initTypewriter() {
  const target = document.querySelector<HTMLElement>('[data-typewriter]');
  const cursor = document.querySelector<HTMLElement>('[data-cursor]');
  const output = document.querySelector<HTMLElement>('[data-type-output]');
  if (!target) return;

  const full = target.textContent ?? '';
  target.textContent = '';
  let i = 0;

  const tick = () => {
    if (i <= full.length) {
      target.textContent = full.slice(0, i);
      i += 1;
      window.setTimeout(tick, 70);
      return;
    }

    cursor?.classList.add('is-done');
    if (output) {
      output.hidden = false;
    }
  };

  window.setTimeout(tick, 400);
}

initThemeToggle();
initMobileMenu();
initSliders();
initTypewriter();
