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
  /* The button starts hidden, so its entrance animation is created here rather
     than at load and its delay would count from this moment. The wordmark holds
     the header's real clock, and the button joins it. */
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

// Opening the page away from the top (anchor link, restored scroll) skips the entrance.
// One-way on purpose: the flag is never removed, so scrolling back up never replays it.
const skipIntro = () => {
  if (window.scrollY > 4) document.body.dataset.introSkip = '';
};
skipIntro();
requestAnimationFrame(skipIntro);
window.addEventListener('pageshow', skipIntro);

const precisePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

/* One project crosses from the index to its page and back.

   A plate on the index, the header of a project page and a card in that page's
   rail are three drawings of the same project, and each of them marks its six
   parts with data-vt. Handing those parts their view transition names on both
   sides of a navigation is what makes the browser carry them across.

   One project at a time: a name may belong to only one rendered element in a
   document, and seven plates would all answer to plate-print at once. The one
   that gets the names is the project the navigation is about, which is the
   project being opened, or, on the way back to the index, the one being left.

   pageswap writes that slug down before the document goes, pagereveal reads it
   on the other side. Through sessionStorage rather than through the history
   entry, because the entry is only readable where the Navigation API is, and
   these two events shipped elsewhere without it.

   Firefox has neither event and ignores @view-transition, so it navigates
   plainly and none of this runs. */
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

/* Where the navigation is headed. The history entry says so wherever it is
   readable; where it is not, the last link pressed says so, and the second and
   a half is there so that a back button pressed long afterwards does not get
   answered with a stale address. */
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
  // Opening a project, or leaving one for anywhere else.
  const crossing = projectSlug(heading) ?? projectSlug(location.href);
  if (!crossing) return;
  try { sessionStorage.setItem(CROSSING, crossing); } catch {}
  nameParts(crossing);
});

listen('pagereveal', event => {
  if (!event.viewTransition) return;
  let crossing: string | null = null;
  // Read once and spent: the next navigation that has something to carry will
  // write its own, and a leftover would name a plate nothing is arriving into.
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


/* Without a pointer the projects section would sit still, which is every touch
   screen and every visitor who only scrolls. So the plate passing the middle of
   the screen hands the section its colour, at a fraction of the strength the
   pointer gets: project-grid.css reads --scroll-ground and --scroll-shade as the
   coat's fallback, and ProjectTheme.astro's rules override them under the
   pointer.

   Nothing is cleared on the way out: the last colour stays until another plate
   takes the band, which keeps it from flickering off between two rows. */
const projectsSection = document.querySelector<HTMLElement>('.projects-section');
if (projectsSection && !reducedMotion.matches) {
  const plates = [...document.querySelectorAll<HTMLElement>('.project-plate')];
  const inBand = new Set<HTMLElement>();
  const band = new IntersectionObserver(entries => {
    for (const entry of entries) {
      const plate = entry.target as HTMLElement;
      if (entry.isIntersecting) inBand.add(plate); else inBand.delete(plate);
    }
    // Rows hold two plates and both cross the band together, so the one that
    // leads takes it: the left one, which is where every row starts. Picking the
    // nearest to the middle instead would let the two swap as you scroll.
    const palette = plates.find(plate => inBand.has(plate))?.dataset.palette?.split(',');
    if (!palette) return;
    projectsSection.style.setProperty('--scroll-ground', palette[0]);
    projectsSection.style.setProperty('--scroll-shade', palette[2]);
    projectsSection.style.setProperty('--scroll-strength', '.3');
  }, { rootMargin: '-42% 0px -42% 0px' });
  plates.forEach(plate => band.observe(plate));
}
