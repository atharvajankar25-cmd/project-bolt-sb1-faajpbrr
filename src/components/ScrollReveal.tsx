import { useEffect, useRef, type ReactNode } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  /** Whether to use a one-time fade-in (default) or scrub-based opacity */
  scrub?: boolean;
}

/**
 * Scroll-triggered fade-in + float-up animation wrapper.
 * Elements fade in and rise as they enter the viewport.
 */
export default function ScrollReveal({ children, className = '', delay = 0, y = 40, scrub = false }: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const tween = gsap.fromTo(
      el,
      { opacity: 0, y },
      {
        opacity: 1,
        y: 0,
        duration: scrub ? 1 : 0.8,
        delay,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          toggleActions: 'play none none none',
          ...(scrub ? { scrub: true } : {}),
        },
      }
    );

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [delay, y, scrub]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
