const root = document.documentElement;
const themeButton = document.querySelector<HTMLButtonElement>('.theme-toggle');
const systemTheme = window.matchMedia('(prefers-color-scheme: dark)');
const isDark = () => root.dataset.theme ? root.dataset.theme === 'dark' : systemTheme.matches;
const syncTheme = () => {
  themeButton?.setAttribute('aria-label', `Activer le thème ${isDark() ? 'clair' : 'sombre'}`);
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', isDark() ? '#181420' : '#fff7fb');
};
if (themeButton) {
  themeButton.hidden = false;
  themeButton.addEventListener('click', () => {
    const theme = isDark() ? 'light' : 'dark';
    root.dataset.theme = theme;
    try { localStorage.setItem('portfolio-theme', theme); } catch {}
    syncTheme();
  });
}
systemTheme.addEventListener('change', syncTheme);
syncTheme();

const header = document.querySelector<HTMLElement>('.site-header');
if (header) {
  const syncHeader = () => {
    const atTop = String(window.scrollY < 1);
    if (header.dataset.atTop !== atTop) header.dataset.atTop = atTop;
  };
  new ResizeObserver(() => {
    root.style.setProperty('--header-height', `${header.offsetHeight}px`);
  }).observe(header);
  window.addEventListener('scroll', syncHeader, { passive: true });
  window.addEventListener('pageshow', syncHeader);
  syncHeader();
}

if ('showModal' in HTMLDialogElement.prototype) {
  document.querySelectorAll<HTMLAnchorElement>('[data-project]').forEach(link => {
    const dialog = document.getElementById(`dialog-${link.dataset.project}`) as HTMLDialogElement | null;
    if (!dialog) return;
    link.setAttribute('aria-haspopup', 'dialog');
    link.addEventListener('click', event => {
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
      event.preventDefault();
      if (dialog.open) return;
      dialog.dataset.keyboard = String(event.detail === 0);
      dialog.showModal();
    });
    dialog.addEventListener('keydown', event => {
      if (event.key !== 'Tab') return;
      const controls = [...dialog.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), [tabindex="0"]')];
      const first = controls[0];
      const last = controls.at(-1);
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    });
    let backdropPointerDown = false;
    const outside = (event: PointerEvent | MouseEvent) => {
      const rect = dialog.getBoundingClientRect();
      return event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom;
    };
    dialog.addEventListener('pointerdown', event => { backdropPointerDown = event.target === dialog && outside(event); });
    dialog.addEventListener('click', event => {
      if (backdropPointerDown && event.target === dialog && outside(event)) dialog.close();
      backdropPointerDown = false;
    });
    dialog.addEventListener('close', () => {
      link.focus({ preventScroll: true });
    });
  });
}

const precisePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
document.querySelectorAll<HTMLElement>('[data-name-portrait]').forEach(wrapper => {
  const trigger = wrapper.querySelector<HTMLElement>('.portrait-trigger')!;
  const portrait = wrapper.querySelector<HTMLElement>('.portrait-position')!;
  let currentX = 0;
  let currentY = 0;
  let targetX = 0;
  let targetY = 0;
  let velocityX = 0;
  let velocityY = 0;
  let frame = 0;
  let lastTime = 0;
  const paint = () => {
    portrait.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
  };
  const stop = () => {
    cancelAnimationFrame(frame);
    frame = 0;
    lastTime = 0;
    velocityX = velocityY = 0;
  };
  const animate = (time: number) => {
    let remaining = Math.min((time - lastTime) / 1000, .05);
    lastTime = time;
    // Match the React portrait's spring: stiffness 120, damping 25.
    while (remaining > 0) {
      const step = Math.min(remaining, 1 / 120);
      velocityX += ((targetX - currentX) * 120 - velocityX * 25) * step;
      velocityY += ((targetY - currentY) * 120 - velocityY * 25) * step;
      currentX += velocityX * step;
      currentY += velocityY * step;
      remaining -= step;
    }
    const settled = Math.hypot(targetX - currentX, targetY - currentY) < .1
      && Math.hypot(velocityX, velocityY) < .5;
    if (settled) {
      currentX = targetX;
      currentY = targetY;
      stop();
    } else {
      frame = requestAnimationFrame(animate);
    }
    paint();
  };
  const setOpen = (open: boolean) => {
    wrapper.dataset.open = String(open);
    if (trigger instanceof HTMLButtonElement) trigger.setAttribute('aria-expanded', String(open));
    if (!open) stop();
  };
  const position = (event?: PointerEvent, immediate = false) => {
    const rect = wrapper.getBoundingClientRect();
    const follow = event && precisePointer.matches && !reducedMotion.matches;
    const x = follow ? event.clientX - 56 : rect.left + rect.width / 2 - 56;
    const y = follow ? event.clientY + 18 : rect.bottom + 12;
    targetX = Math.max(12, Math.min(x, window.innerWidth - 124)) - rect.left;
    targetY = Math.max(12, Math.min(y, window.innerHeight - 124)) - rect.top;
    if (immediate || !follow) {
      stop();
      currentX = targetX;
      currentY = targetY;
      paint();
    } else if (!frame) {
      lastTime = performance.now();
      frame = requestAnimationFrame(animate);
    }
  };
  trigger.addEventListener('pointerenter', event => {
    if (!precisePointer.matches || event.pointerType !== 'mouse') return;
    wrapper.dataset.keyboard = 'false';
    position(event, true);
    setOpen(true);
  });
  trigger.addEventListener('pointermove', event => {
    if (wrapper.dataset.open === 'true' && event.pointerType === 'mouse') position(event);
  });
  trigger.addEventListener('pointerleave', event => {
    if (event.pointerType === 'mouse') setOpen(false);
  });
  trigger.addEventListener('focus', () => {
    if (!trigger.matches(':focus-visible')) return;
    wrapper.dataset.keyboard = 'true';
    position();
    setOpen(true);
  });
  trigger.addEventListener('blur', () => setOpen(false));
  if (trigger instanceof HTMLButtonElement) {
    trigger.addEventListener('click', event => {
      if (precisePointer.matches && event.detail > 0) return;
      wrapper.dataset.keyboard = String(event.detail === 0);
      position();
      setOpen(wrapper.dataset.open !== 'true');
    });
  }
  document.addEventListener('pointerdown', event => {
    if (event.target instanceof Node && !wrapper.contains(event.target)) setOpen(false);
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') setOpen(false);
  });
  window.addEventListener('resize', () => {
    position();
    setOpen(false);
  });
  window.addEventListener('scroll', () => setOpen(false), { passive: true });
  window.addEventListener('pagehide', () => setOpen(false));
  document.addEventListener('visibilitychange', () => { if (document.hidden) setOpen(false); });
  reducedMotion.addEventListener('change', () => { position(); setOpen(false); });
  precisePointer.addEventListener('change', () => { position(); setOpen(false); });
});
