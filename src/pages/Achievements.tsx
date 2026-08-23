import { useRef, useEffect } from 'react';
import { Award, Code2, Trophy, Medal } from 'lucide-react';
import PageLayout from '@/components/PageLayout';
import ScrollReveal from '@/components/ScrollReveal';
import { achievements, type Achievement } from '@/data/content';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Achievements Page — 3D Vertical Timeline.
 *
 * As the user scrolls down, 3D objects (trophies, medals, code brackets) pop out
 * from the timeline, detailing milestones and competition wins.
 */

const iconMap: Record<Achievement['type'], typeof Trophy> = {
  trophy: Trophy,
  medal: Medal,
  code: Code2,
};

const colorMap: Record<Achievement['type'], string> = {
  trophy: '#ffd700',
  medal: '#00f0ff',
  code: '#00ff9d',
};

function TimelineItem({ item, index }: { item: Achievement; index: number }) {
  const itemRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<HTMLDivElement>(null);
  const isLeft = index % 2 === 0;
  const Icon = iconMap[item.type];
  const color = colorMap[item.type];

  useEffect(() => {
    const el = itemRef.current;
    const icon = iconRef.current;
    if (!el || !icon) return;

    const tween = gsap.fromTo(
      el,
      { opacity: 0, x: isLeft ? -60 : 60, rotateY: isLeft ? -15 : 15 },
      {
        opacity: 1,
        x: 0,
        rotateY: 0,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
      }
    );

    // Pop-out animation for the 3D icon
    const iconTween = gsap.fromTo(
      icon,
      { scale: 0, rotation: -180, z: -100 },
      {
        scale: 1,
        rotation: 0,
        z: 0,
        duration: 1,
        ease: 'back.out(1.7)',
        scrollTrigger: {
          trigger: el,
          start: 'top 75%',
          toggleActions: 'play none none none',
        },
      }
    );

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
      iconTween.scrollTrigger?.kill();
      iconTween.kill();
    };
  }, [isLeft]);

  return (
    <div
      ref={itemRef}
      className={`relative flex items-center ${isLeft ? 'flex-row' : 'flex-row-reverse'} mb-16 last:mb-0`}
      style={{ perspective: '1000px' }}
    >
      {/* Card */}
      <div className={`w-full sm:w-5/12 ${isLeft ? 'pr-8 sm:text-right' : 'pl-8'}`}>
        <div className="glass-strong p-6 rounded-2xl hover:border-neon-cyan/40 transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,240,255,0.15)]">
          <span className="text-xs font-mono uppercase tracking-widest text-neon-cyan">{item.year}</span>
          <h3 className="font-display font-bold text-lg mt-2 mb-3">{item.title}</h3>
          <p className="text-white/60 text-sm leading-relaxed">{item.description}</p>
        </div>
      </div>

      {/* Center icon */}
      <div className="absolute left-1/2 -translate-x-1/2 z-10">
        <div
          ref={iconRef}
          className="w-14 h-14 rounded-2xl flex items-center justify-center preserve-3d"
          style={{
            background: `linear-gradient(135deg, ${color}30, ${color}10)`,
            border: `1px solid ${color}40`,
            boxShadow: `0 0 20px ${color}30`,
          }}
        >
          <Icon size={26} style={{ color }} />
        </div>
      </div>

      {/* Spacer for the other side */}
      <div className="hidden sm:block w-5/12" />
    </div>
  );
}

export default function Achievements() {
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const line = lineRef.current;
    if (!line) return;

    const tween = gsap.fromTo(
      line,
      { scaleY: 0, transformOrigin: 'top' },
      {
        scaleY: 1,
        duration: 2,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: line.parentElement!,
          start: 'top 60%',
          end: 'bottom 80%',
          scrub: 1,
        },
      }
    );

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, []);

  return (
    <PageLayout
      title="Achievements"
      subtitle="Milestones, competition wins, and moments of pride for ITSA and its students."
    >
      {/* Stats banner */}
      <ScrollReveal>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-16">
          {[
            { icon: Trophy, value: '15+', label: 'Competition Wins' },
            { icon: Award, value: '30+', label: 'Awards & Honors' },
            { icon: Code2, value: '10+', label: 'Research Papers' },
            { icon: Medal, value: '5', label: 'Best Chapter Awards' },
          ].map((s, i) => (
            <div key={i} className="glass p-5 text-center hover:border-neon-cyan/40 transition-all">
              <s.icon size={28} className="text-neon-cyan mx-auto mb-2" />
              <p className="font-display font-bold text-2xl gradient-text">{s.value}</p>
              <p className="text-white/40 text-xs uppercase tracking-wider mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </ScrollReveal>

      {/* 3D Timeline */}
      <div className="relative max-w-4xl mx-auto pb-8">
        {/* Center line */}
        <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-1 hidden sm:block">
          <div
            ref={lineRef}
            className="w-full h-full rounded-full bg-gradient-to-b from-neon-cyan via-neon-blue to-neon-green"
            style={{ boxShadow: '0 0 15px rgba(0,240,255,0.4)' }}
          />
        </div>
        {/* Mobile line (left-aligned) */}
        <div className="absolute left-7 top-0 bottom-0 w-1 sm:hidden">
          <div
            ref={lineRef}
            className="w-full h-full rounded-full bg-gradient-to-b from-neon-cyan via-neon-blue to-neon-green"
          />
        </div>

        <div className="sm:pl-0 pl-16">
          {achievements.map((item, i) => (
            <TimelineItem key={item.id} item={item} index={i} />
          ))}
        </div>
      </div>

      {/* CTA */}
      <ScrollReveal>
        <div className="text-center mt-12">
          <p className="text-white/50 mb-4">Want to be part of our next achievement?</p>
          <a
            href="/contact"
            className="btn-primary"
            data-cursor="link"
          >
            Join ITSA
          </a>
        </div>
      </ScrollReveal>
    </PageLayout>
  );
}
