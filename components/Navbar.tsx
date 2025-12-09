
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion'; // Import motion
import { Logo } from './Logo'; // Import Logo component

const navItems = [
  { label: 'About', href: '#about' },
  { label: 'Services', href: '#services' },
  { label: 'Timeline', href: '#timeline' },
  { label: 'Projects', href: '#projects' },
  { label: 'Team', href: '#team' },
  { label: 'Contact', href: '#contact' },
];

export const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className="fixed top-0 left-0 w-full z-50 p-4 md:p-4 pointer-events-none transition-all duration-300">
      <div className="max-w-7xl mx-auto pointer-events-auto">
        {/* Main Glass Bar */}
        <div className={`relative backdrop-blur-lg border transition-all duration-300 shadow-2xl flex items-center justify-between px-4 py-3 ${
          scrolled ? 'bg-background/90 border-safety/30' : 'bg-background/40 border-slate-700/50'
        }`}>
          
          {/* Blueprint Technical Corner Accents */}
          <div className="absolute -top-[1px] -left-[1px] w-3 h-[1px] bg-safety"></div>
          <div className="absolute -top-[1px] -left-[1px] w-[1px] h-3 bg-safety"></div>
          <div className="absolute -bottom-[1px] -right-[1px] w-3 h-[1px] bg-safety"></div>
          <div className="absolute -bottom-[1px] -right-[1px] w-[1px] h-3 bg-safety"></div>
          
          {/* Logo Section */}
          <div className="flex items-center gap-4">
            <Logo size="medium" layoutId="brand-logo" /> 
            <div className="flex flex-col leading-none">
              <span className="font-header text-xl tracking-industrial font-bold text-white uppercase">OM Enterprises</span>
              <span className="font-body text-[10px] text-concrete uppercase tracking-widest">Edilite Const. Pvt. Ltd</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="relative font-body text-xs font-bold uppercase tracking-widest text-concrete hover:text-safety transition-colors duration-300 group"
              >
                <span className="relative z-10">{item.label}</span>
                <span className="absolute -bottom-2 left-0 w-full h-[1px] bg-safety transform scale-x-0 origin-right transition-transform duration-300 group-hover:scale-x-100 group-hover:origin-left"></span>
              </a>
            ))}
            
            <a 
              href="/src/assets/brochure/brochure.pdf" 
              download 
              className="border border-safety text-safety px-4 py-2 font-header text-sm tracking-widest hover:bg-safety hover:text-black transition-all duration-300 uppercase clip-path-slant"
            >
              Brochure
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-white hover:text-safety transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={1.5} d="M4 8h16M4 16h16" />
            </svg>
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMenuOpen && (
          <div className="md:hidden mt-2 p-6 backdrop-blur-xl bg-background/95 border border-safety/30 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-safety"></div>
             {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="block py-4 font-header text-lg uppercase tracking-widest text-concrete hover:text-white hover:pl-2 transition-all duration-300 border-b border-slate-800/50 last:border-0"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </a>
            ))}
            <div className="mt-6 pt-2 border-t border-slate-700">
               <a href="/src/assets/brochure/brochure.pdf" download className="block text-center w-full bg-safety text-black font-header py-3 tracking-widest">Download Brochure</a>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
