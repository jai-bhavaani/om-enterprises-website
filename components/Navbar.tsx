import React, { useState, useEffect } from 'react';
import { HashLink } from 'react-router-hash-link';
import { Sun, Moon, ArrowRight } from 'lucide-react';
import { Logo } from './Logo';
import { useTheme } from '../src/context/ThemeContext';

const navLinks = [
  { label: 'Home', path: '/#home' },
  { label: 'Projects', path: '/projects' },
  { label: 'Services', path: '/#services' },
  { label: 'Machinery', path: '/#machinery' },
  { label: 'About', path: '/#about' },
  { label: 'Team', path: '/#team' },
  { label: 'Clients', path: '/#clients' },
];

export const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className="fixed top-0 left-0 w-full z-50 p-3 sm:p-4 pointer-events-none transition-all duration-300">
      <div className="max-w-7xl mx-auto pointer-events-auto">
        {/* Main Glass Bar */}
        <div
          className={`relative backdrop-blur-md border rounded-xl transition-all duration-300 flex items-center justify-between px-4 py-2.5 sm:py-3 ${
            scrolled
              ? 'bg-surface/90 border-border-subtle shadow-xl'
              : 'bg-surface/60 border-border-subtle/50 shadow-sm'
          }`}
        >
          {/* Logo Section */}
          <HashLink to="/" className="flex items-center gap-3">
            <Logo size="medium" />
            <div className="flex flex-col leading-none">
              <span className="font-header text-lg sm:text-xl tracking-industrial font-bold text-text-primary uppercase">
                OM Enterprises
              </span>
              <span className="font-body text-[10px] text-text-secondary uppercase tracking-widest font-mono">
                Edilite Const. Pvt. Ltd
              </span>
            </div>
          </HashLink>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-5 lg:gap-7">
            {navLinks.map((item) => (
              <HashLink
                key={item.label}
                to={item.path}
                smooth
                className="relative font-body text-xs font-bold uppercase tracking-widest text-text-secondary hover:text-safety transition-colors duration-200 group py-1"
              >
                <span className="relative z-10">{item.label}</span>
                <span className="absolute -bottom-1 left-0 w-full h-[2px] bg-safety transform scale-x-0 origin-right transition-transform duration-200 group-hover:scale-x-100 group-hover:origin-left"></span>
              </HashLink>
            ))}

            {/* High-Converting B2B Navbar CTA Button */}
            <HashLink
              to="/#contact"
              smooth
              className="px-4 py-2 rounded-lg bg-safety text-[var(--color-safety-text)] font-header font-bold text-xs uppercase tracking-wider shadow-sm hover:opacity-95 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-1.5"
            >
              <span>Get a Quote</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </HashLink>

            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              className="p-2 rounded-lg bg-surface-subtle hover:bg-border-subtle text-text-primary border border-border-subtle transition-colors flex items-center justify-center cursor-pointer"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-safety" />
              ) : (
                <Moon className="w-4 h-4 text-text-primary" />
              )}
            </button>
          </div>

          {/* Mobile Right Controls: Theme Toggle + Menu Hamburger */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="p-2 rounded-lg bg-surface-subtle text-text-primary border border-border-subtle transition-colors"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-safety" />
              ) : (
                <Moon className="w-4 h-4 text-text-primary" />
              )}
            </button>

            <button
              className="p-2 text-text-primary hover:text-safety transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle Navigation Menu"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={1.5} d="M4 8h16M4 16h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMenuOpen && (
          <div className="md:hidden mt-2 p-5 backdrop-blur-xl bg-surface/98 border border-border-subtle rounded-xl shadow-2xl relative overflow-hidden transition-all flex flex-col gap-1">
            {navLinks.map((item) => (
              <HashLink
                key={item.label}
                to={item.path}
                smooth
                className="block py-3 font-header text-base uppercase tracking-widest text-text-secondary hover:text-safety hover:pl-2 transition-all duration-200 border-b border-border-subtle"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </HashLink>
            ))}

            {/* Mobile Prominent CTA */}
            <div className="pt-3">
              <HashLink
                to="/#contact"
                smooth
                className="w-full py-3 px-4 rounded-lg bg-safety text-[var(--color-safety-text)] font-header text-xs uppercase tracking-wider font-bold flex items-center justify-center gap-2 shadow-sm"
                onClick={() => setIsMenuOpen(false)}
              >
                <span>Get a Quote / Contact Us</span>
                <ArrowRight className="w-4 h-4" />
              </HashLink>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
