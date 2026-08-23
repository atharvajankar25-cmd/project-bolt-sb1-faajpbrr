import { useEffect, useRef, type ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import gsap from 'gsap';

/**
 * Wraps page content with a GSAP-powered wipe/fade transition.
 * On route change, an overlay sweeps across then reveals the new page.
 */
export default function PageTransition({ children }: { children: ReactNode }) {
  const location = useLocation();
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const overlay = overlayRef.current;
    const content = contentRef.current;
    if (!overlay || !content) return;

    // Enter animation: overlay sweeps away, content fades in
    const tl = gsap.timeline();
    tl.set(overlay, { scaleY: 1, transformOrigin: 'bottom' })
      .to(overlay, {
        scaleY: 0,
        duration: 0.6,
        ease: 'power3.inOut',
        transformOrigin: 'top',
      })
      .fromTo(
        content,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' },
        '-=0.3'
      );
  }, [location.pathname]);

  return (
    <>
      <div
        ref={overlayRef}
        className="fixed inset-0 z-[9000] bg-ink-950 pointer-events-none"
        style={{ transform: 'scaleY(0)', transformOrigin: 'top' }}
      />
      <div ref={contentRef}>
        {children}
      </div>
    </>
  );
}
