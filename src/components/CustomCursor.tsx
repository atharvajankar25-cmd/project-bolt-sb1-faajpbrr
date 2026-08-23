import { useEffect, useRef, useState } from 'react';

/**
 * Custom 3D cursor — a glowing orb that follows the mouse with a trailing ring.
 * The orb magnetically snaps (scales up) when hovering interactive elements.
 * On touch devices this component renders nothing.
 */
export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [isTouch, setIsTouch] = useState(false);
  const [hovering, setHovering] = useState(false);

  useEffect(() => {
    // Disable on touch / small screens
    if (window.matchMedia('(hover: none), (pointer: coarse)').matches) {
      setIsTouch(true);
      return;
    }

    let mouseX = 0;
    let mouseY = 0;
    let ringX = 0;
    let ringY = 0;
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mouseX - 6}px, ${mouseY - 6}px, 0)`;
      }
      // Check if hovering an interactive element
      const target = e.target as HTMLElement;
      const isInteractive = !!target.closest('a, button, [data-cursor="link"], input, textarea, select');
      setHovering(isInteractive);
    };

    const animate = () => {
      // Smooth trailing for the ring
      ringX += (mouseX - ringX) * 0.15;
      ringY += (mouseY - ringY) * 0.15;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringX - 20}px, ${ringY - 20}px, 0)`;
      }
      raf = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', onMove);
    raf = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  if (isTouch) return null;

  return (
    <>
      <div
        ref={dotRef}
        className="fixed top-0 left-0 z-[9999] pointer-events-none w-3 h-3 rounded-full bg-neon-cyan shadow-[0_0_15px_rgba(0,240,255,0.8)]"
        style={{ willChange: 'transform' }}
      />
      <div
        ref={ringRef}
        className={`fixed top-0 left-0 z-[9998] pointer-events-none rounded-full border border-neon-cyan/60 transition-[width,height,opacity,border-color] duration-200 ${
          hovering ? 'w-12 h-12 border-neon-green/80 bg-neon-cyan/10' : 'w-10 h-10'
        }`}
        style={{ willChange: 'transform', marginLeft: hovering ? '-8px' : '0', marginTop: hovering ? '-8px' : '0' }}
      />
    </>
  );
}
