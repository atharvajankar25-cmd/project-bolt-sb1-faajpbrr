import { useRef, useState, useEffect, useCallback } from 'react';
import { team, type TeamMember } from '@/data/content';
import PageLayout from '@/components/PageLayout';
import ScrollReveal from '@/components/ScrollReveal';
import { User } from 'lucide-react';

/**
 * Team Members Page — 3D Circular Slanting Carousel.
 *
 * Hierarchy: Section 1: HOD, Section 2: Faculty Coordinators, Section 3: Lead Executives & Core Team.
 * The lead executives are displayed in a 3D rotating cylinder.
 * The full core team is grouped by department below.
 */

// ─── 3D Carousel ─────────────────────────────────────────────────

function TeamCarousel({ members }: { members: TeamMember[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState(0);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const startRotation = useRef(0);

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    isDragging.current = true;
    startX.current = e.clientX;
    startRotation.current = rotation;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }, [rotation]);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDragging.current || !containerRef.current) return;
    const dx = e.clientX - startX.current;
    setRotation(startRotation.current + dx * 0.5);
  }, []);

  const onPointerUp = useCallback(() => { isDragging.current = false; }, []);

  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;
      if (!isDragging.current) setRotation((r) => r + dt * 8);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const radius = 280;
  const angleStep = 360 / members.length;
  const tilt = 12;

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[440px] flex items-center justify-center perspective-1000 touch-none select-none cursor-grab active:cursor-grabbing"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      style={{ perspective: '1200px' }}
    >
      <div
        className="relative preserve-3d"
        style={{ transform: `rotateX(${tilt}deg) rotateY(${rotation}deg)`, transformStyle: 'preserve-3d' }}
      >
        {members.map((m, i) => (
          <div
            key={m.id}
            className="absolute top-1/2 left-1/2"
            style={{
              transform: `rotateY(${i * angleStep}deg) translateZ(${radius}px) translate(-50%, -50%)`,
              transformStyle: 'preserve-3d',
              backfaceVisibility: 'hidden',
            }}
          >
            <TeamCard member={m} />
          </div>
        ))}
      </div>
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-80 h-20 rounded-full bg-neon-cyan/10 blur-3xl" />
    </div>
  );
}

function TeamCard({ member }: { member: TeamMember }) {
  return (
    <div className="w-44 h-56 glass-strong rounded-2xl overflow-hidden flex flex-col items-center justify-center p-4 text-center hover:border-neon-cyan/50 transition-all duration-300">
      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-neon-cyan/20 to-neon-blue/20 flex items-center justify-center mb-4 overflow-hidden border-2 border-white/10">
        {member.photo ? (
          <img src={member.photo} alt={member.name} className="w-full h-full object-cover" />
        ) : (
          <User size={40} className="text-neon-cyan/60" />
        )}
      </div>
      <h4 className="font-display font-semibold text-sm text-white mb-1">{member.name}</h4>
      <p className="text-neon-cyan text-xs font-mono">{member.role}</p>
    </div>
  );
}

// ─── Featured Member (HOD / Faculty) ─────────────────────────────

function FeaturedMember({ member, label }: { member: TeamMember; label: string }) {
  return (
    <div className="flex flex-col items-center text-center group max-w-xs">
      <div className="relative w-40 h-40 rounded-3xl overflow-hidden glass-strong flex items-center justify-center mb-5 group-hover:shadow-[0_0_40px_rgba(0,240,255,0.3)] transition-all duration-500 group-hover:-translate-y-1">
        <div className="absolute inset-0 rounded-3xl border-2 border-neon-cyan/20 group-hover:border-neon-cyan/50 transition-colors" />
        {member.photo ? (
          <img src={member.photo} alt={member.name} className="w-full h-full object-cover" />
        ) : (
          <User size={64} className="text-neon-cyan/40" />
        )}
        <div className="absolute -inset-1 rounded-3xl bg-neon-cyan/10 blur-2xl -z-10 group-hover:bg-neon-cyan/20 transition-all" />
      </div>
      <span className="text-xs font-mono uppercase tracking-widest text-neon-cyan mb-1">{label}</span>
      <h3 className="font-display font-bold text-xl text-white mb-1">{member.name}</h3>
      {member.designation && <p className="text-white/40 text-xs mb-2">{member.designation}</p>}
      {member.bio && <p className="text-white/50 text-sm leading-relaxed">{member.bio}</p>}
    </div>
  );
}

// ─── Team Grid Card ──────────────────────────────────────────────

function TeamGridCard({ member }: { member: TeamMember }) {
  return (
    <div className="glass p-4 flex flex-col items-center text-center hover:border-neon-cyan/40 transition-all duration-300 hover:-translate-y-1 group">
      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-neon-cyan/20 to-neon-blue/20 flex items-center justify-center mb-3 overflow-hidden border border-white/10 group-hover:border-neon-cyan/40 transition-colors">
        {member.photo ? (
          <img src={member.photo} alt={member.name} className="w-full h-full object-cover" />
        ) : (
          <User size={28} className="text-neon-cyan/50" />
        )}
      </div>
      <h4 className="font-display font-semibold text-sm">{member.name}</h4>
      <p className="text-neon-cyan text-xs font-mono mt-1">{member.role}</p>
    </div>
  );
}

// ─── Page ───────────────────────────────────────────────────────

export default function Team() {
  const hod = team.find((m) => m.section === 'hod');
  const faculty = team.filter((m) => m.section === 'faculty');
  const leadExecutives = team.filter((m) =>
    ['President', 'Vice President', 'Secretary', 'Treasurer', 'Joint Secretary'].includes(m.role)
  );
  const coreTeam = team.filter((m) => m.section === 'core');

  // Group core team by role category
  const roleGroups: { title: string; members: TeamMember[] }[] = [
    { title: 'Core Team', members: coreTeam.filter((m) => m.role === 'Core Team') },
    { title: 'Technical Team', members: coreTeam.filter((m) => m.role.startsWith('Technical')) },
    { title: 'Webmasters', members: coreTeam.filter((m) => m.role === 'Webmasters') },
    { title: 'Event Management & Logistics', members: coreTeam.filter((m) => m.role.startsWith('Event Management')) },
    { title: 'Event Documentation', members: coreTeam.filter((m) => m.role === 'Event Documentation') },
    { title: 'Video Editing and Photography', members: coreTeam.filter((m) => m.role === 'Video Editing and Photography') },
    { title: 'Design Team', members: coreTeam.filter((m) => m.role === 'Design Team') },
    { title: 'Publicity Team', members: coreTeam.filter((m) => m.role === 'Publicity Team') },
    { title: 'Higher Studies & CDPC', members: coreTeam.filter((m) => m.role === 'Higher Studies & CDPC') },
    { title: 'ISR & NSS', members: coreTeam.filter((m) => m.role === 'ISR & NSS') },
    { title: 'Art Circle', members: coreTeam.filter((m) => m.role === 'Art Circle') },
    { title: 'Sports', members: coreTeam.filter((m) => m.role === 'Sports') },
    { title: 'Sponsorship and Budget', members: coreTeam.filter((m) => m.role === 'Sponsorship and Budget') },
    { title: 'SY Interaction Coordinator', members: coreTeam.filter((m) => m.role === 'SY Interaction Coordinator') },
  ].filter((g) => g.members.length > 0);

  return (
    <PageLayout
      title="Our Team"
      subtitle="The minds behind ITSA — leaders, mentors, and innovators driving our community forward."
    >
      {/* Section 1: HOD */}
      <ScrollReveal>
        <h2 className="font-display font-bold text-2xl text-center mb-8 mt-4">
          Head of <span className="gradient-text">Department</span>
        </h2>
      </ScrollReveal>
      {hod && (
        <ScrollReveal delay={0.1}>
          <div className="flex justify-center mb-20">
            <FeaturedMember member={hod} label="HOD - IT" />
          </div>
        </ScrollReveal>
      )}

      {/* Section 2: Faculty Coordinators */}
      <ScrollReveal>
        <h2 className="font-display font-bold text-2xl text-center mb-8">
          Faculty <span className="gradient-text">Coordinators</span>
        </h2>
      </ScrollReveal>
      <ScrollReveal delay={0.1}>
        <div className="flex flex-wrap justify-center gap-12 mb-20">
          {faculty.map((f) => (
            <FeaturedMember key={f.id} member={f} label={f.role} />
          ))}
        </div>
      </ScrollReveal>

      {/* Section 3: Lead Executives — 3D Carousel */}
      <ScrollReveal>
        <h2 className="font-display font-bold text-2xl text-center mb-2">
          Lead <span className="gradient-text">Executives</span>
        </h2>
      </ScrollReveal>
      <ScrollReveal delay={0.1}>
        <p className="text-white/40 text-center text-sm font-mono mb-8">
          Drag to rotate the 3D structure
        </p>
      </ScrollReveal>

      <ScrollReveal delay={0.2}>
        <TeamCarousel members={leadExecutives} />
      </ScrollReveal>

      {/* Lead executives grid */}
      <div className="mt-12 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-16">
        {leadExecutives.map((m, i) => (
          <ScrollReveal key={m.id} delay={i * 0.05}>
            <TeamGridCard member={m} />
          </ScrollReveal>
        ))}
      </div>

      {/* Core Team grouped by department */}
      <ScrollReveal>
        <h2 className="font-display font-bold text-2xl text-center mb-12 mt-8">
          The <span className="gradient-text">Core Team</span>
        </h2>
      </ScrollReveal>

      {roleGroups.map((group, gi) => (
        <div key={group.title} className="mb-12">
          <ScrollReveal>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1.5 h-6 rounded-full bg-neon-cyan shadow-[0_0_8px_rgba(0,240,255,0.5)]" />
              <h3 className="font-display font-semibold text-lg text-white/80">{group.title}</h3>
              <span className="text-white/30 text-sm font-mono">({group.members.length})</span>
            </div>
          </ScrollReveal>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {group.members.map((m, i) => (
              <ScrollReveal key={m.id} delay={i * 0.03}>
                <TeamGridCard member={m} />
              </ScrollReveal>
            ))}
          </div>
          {gi < roleGroups.length - 1 && <div className="mt-12 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />}
        </div>
      ))}
    </PageLayout>
  );
}
