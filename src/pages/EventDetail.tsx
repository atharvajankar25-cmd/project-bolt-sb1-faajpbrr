import { useParams, Link, Navigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, CheckCircle2, Sparkles } from 'lucide-react';
import { events } from '@/data/content';
import ScrollReveal from '@/components/ScrollReveal';
import ParticleNetwork from '@/components/ParticleNetwork';
import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

/**
 * Event Detail Page — Dynamic Route.
 *
 * Full information for a specific event: description, schedule, highlights,
 * photo gallery placeholder, and an animated registration button.
 */

export default function EventDetail() {
  const { id } = useParams<{ id: string }>();
  const event = events.find((e) => e.id === id);
  const [registered, setRegistered] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  // Animate registration button on mount
  useEffect(() => {
    if (btnRef.current) {
      gsap.fromTo(
        btnRef.current,
        { scale: 0.9, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.6, ease: 'back.out(1.7)', delay: 0.3 }
      );
    }
  }, []);

  if (!event) {
    return <Navigate to="/events" replace />;
  }

  const Icon = event.icon;

  return (
    <div className="relative min-h-screen">
      {/* Particle background */}
      <div className="fixed inset-0 z-0 opacity-30 pointer-events-none">
        <ParticleNetwork />
      </div>

      <div className="relative z-10 pt-28 pb-20 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          {/* Back link */}
          <Link
            to="/events"
            className="inline-flex items-center gap-2 text-white/50 hover:text-neon-cyan text-sm font-mono transition-colors mb-8"
            data-cursor="link"
          >
            <ArrowLeft size={16} /> Back to Events
          </Link>

          {/* Header */}
          <ScrollReveal>
            <div className="glass-strong rounded-3xl p-8 sm:p-12 mb-8 relative overflow-hidden">
              <div className="absolute -top-20 -right-20 w-48 h-48 rounded-full bg-neon-cyan/15 blur-3xl" />
              <div className="absolute -bottom-20 -left-20 w-48 h-48 rounded-full bg-neon-blue/15 blur-3xl" />

              <div className="relative flex flex-col sm:flex-row items-start gap-6">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-neon-cyan/20 to-neon-blue/10 flex items-center justify-center shrink-0">
                  <Icon size={40} className="text-neon-cyan" />
                </div>
                <div>
                  <span
                    className={`text-xs font-mono uppercase tracking-wider px-3 py-1 rounded-full ${
                      event.category === 'upcoming'
                        ? 'bg-neon-green/20 text-neon-green'
                        : 'bg-white/10 text-white/50'
                    }`}
                  >
                    {event.category}
                  </span>
                  <h1 className="font-display font-bold text-3xl sm:text-4xl gradient-text neon-text mt-3 mb-2">
                    {event.name}
                  </h1>
                  <div className="flex items-center gap-4 text-white/50 text-sm">
                    <span className="flex items-center gap-1.5">
                      <Calendar size={14} /> {event.date}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* Description */}
          <ScrollReveal delay={0.1}>
            <div className="glass p-8 mb-8">
              <h2 className="font-display font-semibold text-xl mb-4 text-neon-cyan">About this event</h2>
              <p className="text-white/60 leading-relaxed">{event.description}</p>
            </div>
          </ScrollReveal>

          {/* Highlights */}
          <ScrollReveal delay={0.15}>
            <div className="glass p-8 mb-8">
              <h2 className="font-display font-semibold text-xl mb-4 text-neon-cyan">Highlights</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {event.highlights.map((h, i) => (
                  <div key={i} className="flex items-start gap-3 text-white/60 text-sm">
                    <CheckCircle2 size={18} className="text-neon-green shrink-0 mt-0.5" />
                    <span>{h}</span>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>

          {/* Schedule */}
          <ScrollReveal delay={0.2}>
            <div className="glass p-8 mb-8">
              <h2 className="font-display font-semibold text-xl mb-6 text-neon-cyan">Schedule</h2>
              <div className="relative pl-8">
                {/* Timeline line */}
                <div className="absolute left-3 top-2 bottom-2 w-0.5 bg-gradient-to-b from-neon-cyan via-neon-blue to-transparent" />
                {event.schedule.map((s, i) => (
                  <div key={i} className="relative mb-6 last:mb-0">
                    {/* Dot */}
                    <div className="absolute -left-[1.65rem] top-1 w-3 h-3 rounded-full bg-neon-cyan shadow-[0_0_10px_rgba(0,240,255,0.6)]" />
                    <div className="flex items-center gap-3">
                      <Clock size={14} className="text-white/40" />
                      <span className="text-neon-cyan text-sm font-mono">{s.time}</span>
                    </div>
                    <p className="text-white/70 text-sm mt-1 ml-7">{s.title}</p>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>

          {/* Photo Gallery */}
          <ScrollReveal delay={0.25}>
            <div className="glass p-8 mb-8">
              <h2 className="font-display font-semibold text-xl mb-4 text-neon-cyan">Gallery</h2>
              {event.gallery.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {event.gallery.map((url, i) => (
                    <div key={i} className="aspect-video rounded-xl overflow-hidden border border-white/10 hover:border-neon-cyan/40 transition-all group">
                      <img src={url} alt={`${event.name} photo ${i + 1}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" loading="lazy" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="aspect-video rounded-xl bg-gradient-to-br from-ink-700 to-ink-800 border border-white/5 flex items-center justify-center">
                      <span className="text-white/20 text-xs font-mono">Photo {i}</span>
                    </div>
                  ))}
                </div>
              )}
              {event.gallery.length === 0 && (
                <p className="text-white/30 text-xs mt-4 font-mono">Event photos coming soon</p>
              )}
            </div>
          </ScrollReveal>

          {/* Registration Button */}
          <ScrollReveal delay={0.3}>
            <div className="text-center">
              <button
                ref={btnRef}
                onClick={() => setRegistered(true)}
                disabled={registered || event.category === 'past'}
                className={`relative inline-flex items-center justify-center gap-2 px-10 py-4 rounded-xl font-display font-semibold text-lg transition-all duration-300 ${
                  registered
                    ? 'bg-neon-green/20 text-neon-green border-2 border-neon-green/40'
                    : event.category === 'past'
                    ? 'bg-white/5 text-white/30 cursor-not-allowed'
                    : 'bg-gradient-to-r from-neon-cyan to-neon-green text-ink-950 hover:scale-105 hover:shadow-[0_0_40px_rgba(0,240,255,0.4)]'
                }`}
                data-cursor="link"
              >
                {registered ? (
                  <>
                    <CheckCircle2 size={20} /> Registered!
                  </>
                ) : event.category === 'past' ? (
                  'Event Ended'
                ) : (
                  <>
                    <Sparkles size={20} /> Register Now
                  </>
                )}
              </button>
              {event.category === 'upcoming' && !registered && (
                <p className="text-white/40 text-sm mt-3 font-mono">Limited seats available</p>
              )}
            </div>
          </ScrollReveal>
        </div>
      </div>
    </div>
  );
}
