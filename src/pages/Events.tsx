import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Calendar } from 'lucide-react';
import PageLayout from '@/components/PageLayout';
import ScrollReveal from '@/components/ScrollReveal';
import { events } from '@/data/content';

/**
 * Events Page — 3D Tilt Cards.
 *
 * Shows upcoming and past events as 3D tilt cards.
 * Each card shows Event Name, a 3D icon/thumbnail, and a short one-line detail.
 * Clicking "More" navigates to a dedicated Event Detail page.
 */

function TiltCard({ event, index }: { event: typeof events[0]; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const onMove = (e: React.MouseEvent) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: y * -12, y: x * 12 });
  };

  const onLeave = () => setTilt({ x: 0, y: 0 });

  const Icon = event.icon;

  return (
    <div className="perspective-1000" style={{ perspective: '1000px' }}>
      <div
        ref={cardRef}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        className="relative glass-strong rounded-2xl p-6 h-full preserve-3d transition-transform duration-200 ease-out"
        style={{
          transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Glow accent */}
        <div
          className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-neon-cyan/10 blur-3xl pointer-events-none"
          style={{ transform: 'translateZ(-20px)' }}
        />

        {/* Icon */}
        <div
          className="w-16 h-16 rounded-2xl bg-gradient-to-br from-neon-cyan/20 to-neon-blue/10 flex items-center justify-center mb-5"
          style={{ transform: 'translateZ(40px)' }}
        >
          <Icon size={32} className="text-neon-cyan" />
        </div>

        {/* Category badge */}
        <div
          className="absolute top-5 right-5"
          style={{ transform: 'translateZ(30px)' }}
        >
          <span
            className={`text-xs font-mono uppercase tracking-wider px-3 py-1 rounded-full ${
              event.category === 'upcoming'
                ? 'bg-neon-green/20 text-neon-green'
                : 'bg-white/10 text-white/50'
            }`}
          >
            {event.category}
          </span>
        </div>

        {/* Title */}
        <h3
          className="font-display font-bold text-xl mb-2"
          style={{ transform: 'translateZ(30px)' }}
        >
          {event.name}
        </h3>

        {/* Date */}
        <div
          className="flex items-center gap-2 text-white/50 text-sm mb-3"
          style={{ transform: 'translateZ(20px)' }}
        >
          <Calendar size={14} />
          <span>{event.date}</span>
        </div>

        {/* Tagline */}
        <p
          className="text-white/60 text-sm leading-relaxed mb-5"
          style={{ transform: 'translateZ(15px)' }}
        >
          {event.tagline}
        </p>

        {/* More button */}
        <div style={{ transform: 'translateZ(40px)' }}>
          <Link
            to={`/events/${event.id}`}
            className="inline-flex items-center gap-2 text-neon-cyan text-sm font-display font-medium hover:gap-3 transition-all"
            data-cursor="link"
          >
            More Info <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function Events() {
  const upcoming = events.filter((e) => e.category === 'upcoming');
  const past = events.filter((e) => e.category === 'past');

  return (
    <PageLayout
      title="Events"
      subtitle="Hackathons, workshops, tech talks, and competitions — explore what ITSA brings to the table."
    >
      {/* Upcoming Events */}
      <ScrollReveal>
        <div className="flex items-center gap-3 mb-8">
          <div className="w-2 h-8 rounded-full bg-neon-green shadow-[0_0_12px_rgba(0,255,157,0.6)]" />
          <h2 className="font-display font-bold text-2xl">Upcoming Events</h2>
        </div>
      </ScrollReveal>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
        {upcoming.map((e, i) => (
          <ScrollReveal key={e.id} delay={i * 0.1}>
            <TiltCard event={e} index={i} />
          </ScrollReveal>
        ))}
      </div>

      {/* Past Events */}
      <ScrollReveal>
        <div className="flex items-center gap-3 mb-8">
          <div className="w-2 h-8 rounded-full bg-white/30" />
          <h2 className="font-display font-bold text-2xl">Past Events</h2>
        </div>
      </ScrollReveal>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {past.map((e, i) => (
          <ScrollReveal key={e.id} delay={i * 0.1}>
            <TiltCard event={e} index={i} />
          </ScrollReveal>
        ))}
      </div>
    </PageLayout>
  );
}
