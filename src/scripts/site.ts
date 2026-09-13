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
  const wordmarkEntrance = document.querySelector('.wordmark')?.getAnimations()
    .find(animation => animation instanceof CSSAnimation && animation.animationName === 'header-enter');
  if (wordmarkEntrance?.startTime != null) {
    for (const animation of themeButton.getAnimations()) animation.startTime = wordmarkEntrance.startTime;
  }
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
  new ResizeObserver(() => {
    root.style.setProperty('--header-height', `${header.offsetHeight}px`);
  }).observe(header);
}

// Do not replay the entrance after anchor navigation or restored scroll.
const skipIntro = () => {
  if (window.scrollY > 4) document.body.dataset.introSkip = '';
};
skipIntro();
requestAnimationFrame(skipIntro);
window.addEventListener('pageshow', skipIntro);

const precisePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

// View-transition names must be unique, so only the navigating project gets them.
type PageEvent = Event & {
  viewTransition?: ViewTransition | null;
  activation?: { entry?: { url: string } | null } | null;
};
const CROSSING = 'project-crossing';
const projectSlug = (url: string | undefined) =>
  url ? new URL(url, location.href).pathname.match(/^\/projets\/([^/]+)\//)?.[1] : undefined;

const nameParts = (slug: string | null | undefined) => {
  if (!slug) return;
  document.querySelector(`[data-project-card="${CSS.escape(slug)}"]`)
    ?.querySelectorAll<HTMLElement>('[data-vt]')
    .forEach(part => { part.style.viewTransitionName = `plate-${part.dataset.vt}`; });
};
const clearParts = () => {
  document.querySelectorAll<HTMLElement>('[data-vt]')
    .forEach(part => { part.style.viewTransitionName = ''; });
};

// `activation.entry` is unavailable in some browsers, so retain the latest click briefly.
let pressed = { url: '', at: -Infinity };
document.addEventListener('click', event => {
  const link = (event.target as Element | null)?.closest?.('a[href]');
  if (link) pressed = { url: (link as HTMLAnchorElement).href, at: performance.now() };
}, true);

const listen = (type: string, handler: (event: PageEvent) => void) =>
  window.addEventListener(type, handler as EventListener);

listen('pageswap', event => {
  if (!event.viewTransition) return;
  const heading = event.activation?.entry?.url
    ?? (performance.now() - pressed.at < 1500 ? pressed.url : undefined);
  const crossing = projectSlug(heading) ?? projectSlug(location.href);
  if (!crossing) return;
  try { sessionStorage.setItem(CROSSING, crossing); } catch {}
  nameParts(crossing);
});

listen('pagereveal', event => {
  if (!event.viewTransition) return;
  let crossing: string | null = null;
  try {
    crossing = sessionStorage.getItem(CROSSING);
    sessionStorage.removeItem(CROSSING);
  } catch {}
  if (!crossing) return;
  nameParts(crossing);
  event.viewTransition.finished.finally(clearParts);
});

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
    // Match the original portrait spring.
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
// On touch screens, the first plate crossing the viewport center colors the section.
const projectsSection = document.querySelector<HTMLElement>('.projects-section');
if (projectsSection && !reducedMotion.matches) {
  const plates = [...document.querySelectorAll<HTMLElement>('.project-plate')];
  const inBand = new Set<HTMLElement>();
  const band = new IntersectionObserver(entries => {
    for (const entry of entries) {
      const plate = entry.target as HTMLElement;
      if (entry.isIntersecting) inBand.add(plate); else inBand.delete(plate);
    }
    const palette = plates.find(plate => inBand.has(plate))?.dataset.palette?.split(',');
    if (!palette) return;
    projectsSection.style.setProperty('--scroll-ground', palette[0]);
    projectsSection.style.setProperty('--scroll-shade', palette[2]);
    projectsSection.style.setProperty('--scroll-strength', '.3');
  }, { rootMargin: '-42% 0px -42% 0px' });
  plates.forEach(plate => band.observe(plate));
}

// Load a preview only after its card remains selected for 150ms.
const table = document.querySelector<HTMLElement>('[data-sidequests]');
if (table && precisePointer.matches && window.matchMedia('(min-width: 951px)').matches) {
  const figures = [...table.querySelectorAll<HTMLElement>('.stage-figure')];
  let hold = 0;
  const show = (index: number) => {
    figures.forEach((figure, i) => figure.toggleAttribute('data-live', i === index));
    clearTimeout(hold);
    hold = window.setTimeout(() => {
      const frame = figures[index].querySelector<HTMLIFrameElement>('iframe[data-src]');
      if (!frame) return;
      frame.src = frame.dataset.src!;
      delete frame.dataset.src;
    }, 150);
  };
  table.querySelectorAll<HTMLElement>('[data-sidequest]').forEach((link, i) => {
    link.addEventListener('pointerenter', () => show(i));
    link.addEventListener('focus', () => show(i));
  });
  new IntersectionObserver((entries, observer) => {
    if (!entries.some(entry => entry.isIntersecting)) return;
    show(0);
    observer.disconnect();
  }, { rootMargin: '400px 0px' }).observe(table);
}
