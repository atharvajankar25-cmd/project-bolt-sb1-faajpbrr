import type { ReactNode } from 'react';
import ParticleNetwork from './ParticleNetwork';

interface PageLayoutProps {
  children: ReactNode;
  /** Whether to show the particle network background */
  particles?: boolean;
  /** Page title for the hero section */
  title?: string;
  /** Subtitle below the title */
  subtitle?: string;
}

/**
 * Shared layout for interior pages: particle background, hero header, and content area.
 */
export default function PageLayout({ children, particles = true, title, subtitle }: PageLayoutProps) {
  return (
    <div className="relative min-h-screen">
      {/* Particle background */}
      {particles && (
        <div className="fixed inset-0 z-0 opacity-40 pointer-events-none">
          <ParticleNetwork />
        </div>
      )}

      {/* Content */}
      <div className="relative z-10">
        {title && (
          <section className="pt-32 pb-12 px-4 sm:px-6 text-center">
            <h1 className="font-display font-bold text-4xl sm:text-5xl md:text-6xl gradient-text neon-text mb-4">
              {title}
            </h1>
            {subtitle && (
              <p className="text-white/60 text-lg max-w-2xl mx-auto leading-relaxed">
                {subtitle}
              </p>
            )}
          </section>
        )}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-10">
          {children}
        </div>
      </div>
    </div>
  );
}
