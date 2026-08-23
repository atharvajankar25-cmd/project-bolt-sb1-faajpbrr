import { useEffect, useRef } from 'react';

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

/**
 * Interactive 3D-style particle network rendered on a 2D canvas for performance.
 * Particles drift around, connect with lines when close, and are attracted to
 * the cursor on desktop / respond to scroll velocity on mobile.
 */
export default function ParticleNetwork({ className = '' }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const scrollVelRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let nodes: Node[] = [];
    let raf = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      // Node count scales with screen area but is capped for performance
      const count = Math.min(90, Math.floor((width * height) / 16000));
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
      }));
    };

    resize();

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    const onMouseLeave = () => {
      mouseRef.current = { x: -1000, y: -1000 };
    };
    let lastScrollY = window.scrollY;
    const onScroll = () => {
      const dy = window.scrollY - lastScrollY;
      lastScrollY = window.scrollY;
      scrollVelRef.current = dy * 0.02;
    };

    const connectDist = 130;
    const mouseRadius = 160;

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      const { x: mx, y: my } = mouseRef.current;
      const sv = scrollVelRef.current;

      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        n.x += n.vx;
        n.y += n.vy;

        // Wrap edges
        if (n.x < 0) n.x = width;
        if (n.x > width) n.x = 0;
        if (n.y < 0) n.y = height;
        if (n.y > height) n.y = 0;

        // Cursor attraction
        const dxm = mx - n.x;
        const dym = my - n.y;
        const distM = Math.hypot(dxm, dym);
        if (distM < mouseRadius && distM > 0) {
          const force = (1 - distM / mouseRadius) * 0.3;
          n.x += dxm / distM * force;
          n.y += dym / distM * force;
        }

        // Scroll influence on mobile (horizontal drift)
        if (sv !== 0) {
          n.x += sv;
        }

        // Draw node
        ctx.beginPath();
        ctx.arc(n.x, n.y, 1.8, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0, 240, 255, 0.6)';
        ctx.fill();

        // Draw connections
        for (let j = i + 1; j < nodes.length; j++) {
          const m = nodes[j];
          const dx = n.x - m.x;
          const dy = n.y - m.y;
          const dist = Math.hypot(dx, dy);
          if (dist < connectDist) {
            const alpha = (1 - dist / connectDist) * 0.35;
            ctx.beginPath();
            ctx.moveTo(n.x, n.y);
            ctx.lineTo(m.x, m.y);
            ctx.strokeStyle = `rgba(59, 130, 246, ${alpha})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }

        // Draw connection to cursor
        if (distM < mouseRadius) {
          const alpha = (1 - distM / mouseRadius) * 0.5;
          ctx.beginPath();
          ctx.moveTo(n.x, n.y);
          ctx.lineTo(mx, my);
          ctx.strokeStyle = `rgba(0, 240, 255, ${alpha})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }

      // Decay scroll velocity
      scrollVelRef.current *= 0.9;
      if (Math.abs(scrollVelRef.current) < 0.01) scrollVelRef.current = 0;

      raf = requestAnimationFrame(draw);
    };

    draw();

    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('scroll', onScroll, { passive: true });
    canvas.addEventListener('mouseleave', onMouseLeave);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('scroll', onScroll);
      canvas.removeEventListener('mouseleave', onMouseLeave);
    };
  }, []);

  return <canvas ref={canvasRef} className={`absolute inset-0 w-full h-full ${className}`} />;
}
