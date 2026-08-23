import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'About', path: '/about' },
  { name: 'Team', path: '/team' },
  { name: 'Events', path: '/events' },
  { name: 'Achievements', path: '/achievements' },
  { name: 'Gallery', path: '/gallery' },
  { name: 'Contact', path: '/contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-[8000] transition-all duration-500 ${
          scrolled ? 'glass-strong py-3' : 'py-5 bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group" data-cursor="link">
            <div className="relative w-9 h-9 rounded-lg bg-gradient-to-br from-neon-cyan to-neon-blue flex items-center justify-center font-display font-bold text-ink-950 text-lg shadow-[0_0_20px_rgba(0,240,255,0.4)] group-hover:shadow-[0_0_30px_rgba(0,240,255,0.6)] transition-shadow">
              IT
            </div>
            <span className="font-display font-bold text-lg tracking-tight hidden sm:block">
              ITSA
            </span>
          </Link>

          {/* Desktop links */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const active = location.pathname === link.path || (link.path !== '/' && location.pathname.startsWith(link.path));
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`relative px-4 py-2 rounded-lg font-display text-sm font-medium transition-all duration-300 ${
                    active ? 'text-neon-cyan' : 'text-white/70 hover:text-white'
                  }`}
                  data-cursor="link"
                >
                  {link.name}
                  {active && (
                    <span className="absolute inset-x-3 -bottom-0.5 h-0.5 bg-neon-cyan rounded-full shadow-[0_0_8px_rgba(0,240,255,0.6)]" />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Mobile toggle */}
          <button
            className="lg:hidden p-2 text-white"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <div
        className={`fixed inset-0 z-[7000] lg:hidden transition-all duration-500 ${
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="absolute inset-0 bg-ink-950/95 backdrop-blur-xl" onClick={() => setOpen(false)} />
        <div className="relative flex flex-col items-center justify-center h-full gap-4 px-6">
          {navLinks.map((link, i) => {
            const active = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`text-2xl font-display font-medium transition-all duration-300 ${
                  active ? 'text-neon-cyan neon-text' : 'text-white/80'
                }`}
                style={{
                  transform: open ? 'translateY(0)' : 'translateY(20px)',
                  opacity: open ? 1 : 0,
                  transition: `all 0.4s ease ${i * 0.05}s`,
                }}
              >
                {link.name}
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}
