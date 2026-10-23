import { useLayoutEffect } from 'react';

export default function useGalleryViewport(rail) {
  useLayoutEffect(() => {
    const node = rail.current;
    const gallery = node.closest('.gallery');
    const heading = gallery.querySelector('.section-heading');
    const header = document.querySelector('.site-header');
    const desktop = window.matchMedia('(min-width: 801px)');
    const viewport = window.visualViewport;
    let frame;
    let settleTimer;
    let navigating = false;

    const setPixels = (name, value) => {
      const next = `${Math.floor(value * 100) / 100}px`;
      if (gallery.style.getPropertyValue(name) !== next) gallery.style.setProperty(name, next);
    };
    const visibleBounds = () => {
      const top = viewport?.offsetTop || 0;
      const bottom = top + Math.min(window.innerHeight, viewport?.height || window.innerHeight);
      return { top: Math.max(top, header.getBoundingClientRect().bottom), bottom };
    };
    const fit = (useActualPosition = false) => {
      if (!desktop.matches) {
        gallery.style.removeProperty('--gallery-available-height');
        gallery.style.removeProperty('--gallery-photo-height');
        return;
      }
      const bounds = visibleBounds();
      const sectionTop = gallery.getBoundingClientRect().top;
      const start = useActualPosition ? Math.max(bounds.top, sectionTop) : bounds.top;
      const available = Math.max(1, bounds.bottom - start);
      setPixels('--gallery-available-height', available);

      // Read the rendered heading and gaps after applying the viewport budget.
      const railOffset = node.getBoundingClientRect().top - gallery.getBoundingClientRect().top;
      const spacing = getComputedStyle(node);
      const paddingTop = parseFloat(spacing.paddingTop);
      const naturalHeight = parseFloat(getComputedStyle(node.querySelector('img')).maxHeight);
      // Keep a little gallery background visible below the photos at every height.
      // This includes the rail's bottom padding, rather than adding another gap.
      const edge = Math.min(32, (viewport?.height || window.innerHeight) * .04);
      const room = available - railOffset - paddingTop - edge;
      setPixels('--gallery-photo-height', Math.max(1, Math.min(naturalHeight, room)));
    };
    const scheduleFit = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => fit());
    };
    const finishNavigation = () => {
      if (!navigating) return;
      navigating = false;
      clearTimeout(settleTimer);
      if (!desktop.matches) return;
      fit();
      const delta = gallery.getBoundingClientRect().top - visibleBounds().top;
      if (Math.abs(delta) > 1) window.scrollBy({ top: delta, behavior: 'instant' });
      fit(true);
    };
    const watchScroll = event => {
      if (!navigating || (event.target !== document && event.target !== window)) return;
      clearTimeout(settleTimer);
      settleTimer = window.setTimeout(finishNavigation, 150);
    };
    const onScrollEnd = event => {
      if (event.target === document || event.target === window) finishNavigation();
    };
    const beginNavigation = () => {
      if (!desktop.matches) return;
      navigating = true;
      fit();
      clearTimeout(settleTimer);
      settleTimer = window.setTimeout(finishNavigation, 250);
    };
    const onClick = event => {
      if (!event.defaultPrevented && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey && event.target.closest?.('a[href="#gallery"]')) beginNavigation();
    };
    const cancelNavigation = () => {
      navigating = false;
      clearTimeout(settleTimer);
    };
    const onHashChange = () => {
      if (window.location.hash === '#gallery') beginNavigation();
      else cancelNavigation();
    };

    const observer = new ResizeObserver(scheduleFit);
    observer.observe(header);
    observer.observe(heading);
    window.addEventListener('resize', scheduleFit);
    viewport?.addEventListener('resize', scheduleFit);
    viewport?.addEventListener('scroll', scheduleFit);
    desktop.addEventListener('change', scheduleFit);
    document.addEventListener('click', onClick);
    window.addEventListener('hashchange', onHashChange);
    window.addEventListener('scroll', watchScroll, { passive: true });
    window.addEventListener('scrollend', onScrollEnd);
    window.addEventListener('wheel', cancelNavigation, { passive: true });
    window.addEventListener('pointerdown', cancelNavigation, { passive: true });
    window.addEventListener('keydown', cancelNavigation);
    fit();
    if (window.location.hash === '#gallery') beginNavigation();

    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(settleTimer);
      observer.disconnect();
      window.removeEventListener('resize', scheduleFit);
      viewport?.removeEventListener('resize', scheduleFit);
      viewport?.removeEventListener('scroll', scheduleFit);
      desktop.removeEventListener('change', scheduleFit);
      document.removeEventListener('click', onClick);
      window.removeEventListener('hashchange', onHashChange);
      window.removeEventListener('scroll', watchScroll);
      window.removeEventListener('scrollend', onScrollEnd);
      window.removeEventListener('wheel', cancelNavigation);
      window.removeEventListener('pointerdown', cancelNavigation);
      window.removeEventListener('keydown', cancelNavigation);
      gallery.style.removeProperty('--gallery-available-height');
      gallery.style.removeProperty('--gallery-photo-height');
    };
  }, [rail]);
}
