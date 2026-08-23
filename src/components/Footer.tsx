import { Link } from 'react-router-dom';
import { Github, Linkedin, Instagram, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="relative mt-20 border-t border-white/10 bg-ink-900/50 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-neon-cyan to-neon-blue flex items-center justify-center font-display font-bold text-ink-950 text-lg">
                IT
              </div>
              <span className="font-display font-bold text-lg">ITSA</span>
            </div>
            <p className="text-white/60 text-sm leading-relaxed max-w-xs">
              Information Technology Student Association, PCCOE. Innovate, Create, and build the future of technology together.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-display font-semibold text-sm uppercase tracking-wider text-neon-cyan mb-4">Explore</h4>
            <div className="grid grid-cols-2 gap-2">
              {[
                { name: 'Home', path: '/' },
                { name: 'About', path: '/about' },
                { name: 'Team', path: '/team' },
                { name: 'Events', path: '/events' },
                { name: 'Achievements', path: '/achievements' },
                { name: 'Gallery', path: '/gallery' },
                { name: 'Contact', path: '/contact' },
              ].map((l) => (
                <Link key={l.path} to={l.path} className="text-white/60 hover:text-neon-cyan text-sm transition-colors" data-cursor="link">
                  {l.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Connect */}
          <div>
            <h4 className="font-display font-semibold text-sm uppercase tracking-wider text-neon-cyan mb-4">Connect</h4>
            <div className="flex gap-3 mb-4">
              {[
                { Icon: Github, label: 'GitHub' },
                { Icon: Linkedin, label: 'LinkedIn' },
                { Icon: Instagram, label: 'Instagram' },
                { Icon: Mail, label: 'Email' },
              ].map(({ Icon, label }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="w-10 h-10 rounded-lg glass flex items-center justify-center text-white/70 hover:text-neon-cyan hover:border-neon-cyan/50 transition-all"
                  data-cursor="link"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
            <p className="text-white/40 text-xs">PCCOE, Akurdi, Pune — 411044</p>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-white/40 text-xs">© {new Date().getFullYear()} ITSA · PCCOE. All rights reserved.</p>
          <p className="text-white/30 text-xs font-mono">Built with Three.js · GSAP · React</p>
        </div>
      </div>
    </footer>
  );
}
