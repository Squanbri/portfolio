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

type GalleryImage = { src: string; alt: string };

function ensureLightbox() {
  let dialog = document.querySelector<HTMLDialogElement>('[data-lightbox]');
  if (dialog) return dialog;

  dialog = document.createElement('dialog');
  dialog.setAttribute('data-lightbox', '');
  dialog.className = 'lightbox';
  dialog.innerHTML = `
    <div class="lightbox-panel">
      <button type="button" class="lightbox-close" data-lightbox-close aria-label="Закрыть">×</button>
      <button type="button" class="lightbox-nav prev" data-lightbox-prev aria-label="Предыдущий">←</button>
      <figure class="lightbox-figure">
        <img data-lightbox-image alt="" />
        <figcaption data-lightbox-caption></figcaption>
      </figure>
      <button type="button" class="lightbox-nav next" data-lightbox-next aria-label="Следующий">→</button>
    </div>
  `;
  document.body.appendChild(dialog);
  return dialog;
}

function createLightboxController() {
  const dialog = ensureLightbox();
  const imageEl = dialog.querySelector<HTMLImageElement>('[data-lightbox-image]')!;
  const captionEl = dialog.querySelector<HTMLElement>('[data-lightbox-caption]')!;
  const closeBtn = dialog.querySelector<HTMLButtonElement>('[data-lightbox-close]')!;
  const prevBtn = dialog.querySelector<HTMLButtonElement>('[data-lightbox-prev]')!;
  const nextBtn = dialog.querySelector<HTMLButtonElement>('[data-lightbox-next]')!;

  let images: GalleryImage[] = [];
  let index = 0;
  let touchStartX = 0;

  const render = () => {
    const current = images[index];
    if (!current) return;
    imageEl.src = current.src;
    imageEl.alt = current.alt;
    captionEl.textContent = current.alt;
    const multi = images.length > 1;
    prevBtn.hidden = !multi;
    nextBtn.hidden = !multi;
  };

  const goTo = (nextIndex: number) => {
    if (!images.length) return;
    index = (nextIndex + images.length) % images.length;
    render();
  };

  const close = () => {
    if (dialog.open) dialog.close();
  };

  const open = (nextImages: GalleryImage[], nextIndex: number) => {
    images = nextImages;
    index = nextIndex;
    render();
    if (!dialog.open) dialog.showModal();
  };

  closeBtn.addEventListener('click', (event) => {
    event.stopPropagation();
    close();
  });
  prevBtn.addEventListener('click', (event) => {
    event.stopPropagation();
    goTo(index - 1);
  });
  nextBtn.addEventListener('click', (event) => {
    event.stopPropagation();
    goTo(index + 1);
  });

  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) close();
  });

  window.addEventListener('keydown', (event) => {
    if (!dialog.open) return;
    if (event.key === 'Escape') close();
    if (event.key === 'ArrowLeft') goTo(index - 1);
    if (event.key === 'ArrowRight') goTo(index + 1);
  });

  dialog.addEventListener(
    'touchstart',
    (event) => {
      touchStartX = event.changedTouches[0]?.clientX ?? 0;
    },
    { passive: true },
  );

  dialog.addEventListener(
    'touchend',
    (event) => {
      const endX = event.changedTouches[0]?.clientX ?? 0;
      const delta = endX - touchStartX;
      if (Math.abs(delta) < 40) return;
      goTo(delta < 0 ? index + 1 : index - 1);
    },
    { passive: true },
  );

  return { open };
}

function parseImages(root: HTMLElement): GalleryImage[] {
  const raw = root.dataset.images;
  if (raw) {
    try {
      const parsed = JSON.parse(raw) as GalleryImage[];
      if (Array.isArray(parsed) && parsed.length) return parsed;
    } catch {
      /* fall through */
    }
  }

  return Array.from(root.querySelectorAll<HTMLImageElement>('[data-slide-image]')).map((img) => ({
    src: img.currentSrc || img.src,
    alt: img.alt,
  }));
}

function initSliders() {
  const lightbox = createLightboxController();

  document.querySelectorAll<HTMLElement>('[data-slider]').forEach((root) => {
    const viewport = root.querySelector<HTMLElement>('[data-viewport]');
    const track = root.querySelector<HTMLElement>('[data-track]');
    const slides = root.querySelectorAll('.slide');
    const dots = root.querySelectorAll<HTMLButtonElement>('[data-dot]');
    const prev = root.querySelector<HTMLButtonElement>('[data-prev]');
    const next = root.querySelector<HTMLButtonElement>('[data-next]');
    if (!viewport || !track || slides.length === 0) return;

    const images = parseImages(root);
    let index = 0;
    let activePointer: number | null = null;
    let startX = 0;
    let deltaX = 0;
    let dragging = false;

    const paint = () => {
      track.style.transform = `translateX(-${index * 100}%)`;
      dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
      });
    };

    const goTo = (nextIndex: number) => {
      index = (nextIndex + slides.length) % slides.length;
      track.classList.remove('is-dragging');
      paint();
    };

    const openCurrent = () => {
      lightbox.open(images, index);
    };

    prev?.addEventListener('click', () => goTo(index - 1));
    next?.addEventListener('click', () => goTo(index + 1));

    dots.forEach((dot) => {
      dot.addEventListener('click', () => {
        const i = Number(dot.dataset.dot);
        if (!Number.isNaN(i)) goTo(i);
      });
    });

    // Double-click / double-tap friendly open without fighting drag.
    viewport.addEventListener('dblclick', openCurrent);

    viewport.addEventListener('pointerdown', (event) => {
      if (event.pointerType === 'mouse' && event.button !== 0) return;
      activePointer = event.pointerId;
      startX = event.clientX;
      deltaX = 0;
      dragging = false;
    });

    viewport.addEventListener('pointermove', (event) => {
      if (activePointer !== event.pointerId) return;
      deltaX = event.clientX - startX;

      if (!dragging && Math.abs(deltaX) > 8) {
        dragging = true;
        track.classList.add('is-dragging');
        viewport.classList.add('is-dragging');
        try {
          viewport.setPointerCapture(event.pointerId);
        } catch {
          /* ignore */
        }
      }

      if (!dragging) return;
      const width = viewport.clientWidth || 1;
      const percent = (deltaX / width) * 100;
      track.style.transform = `translateX(calc(-${index * 100}% + ${percent}%))`;
    });

    const endPointer = (event: PointerEvent) => {
      if (activePointer !== event.pointerId) return;
      activePointer = null;
      viewport.classList.remove('is-dragging');

      const width = viewport.clientWidth || 1;
      const threshold = Math.min(70, width * 0.16);

      if (dragging) {
        if (Math.abs(deltaX) > threshold) {
          goTo(deltaX < 0 ? index + 1 : index - 1);
        } else {
          goTo(index);
        }
      } else if (Math.abs(deltaX) < 8) {
        // Tap / click opens lightbox.
        openCurrent();
      }

      dragging = false;
      deltaX = 0;
    };

    viewport.addEventListener('pointerup', endPointer);
    viewport.addEventListener('pointercancel', endPointer);
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
