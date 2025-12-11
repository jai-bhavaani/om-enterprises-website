import React, { useEffect, useRef } from 'react';
import { Button } from './Button';
import { ButtonVariant } from '../types';

import { ImageCarousel, CarouselItem } from './ImageCarousel';

import welspunImg from '@/assets/images/welspun.png';
import piramalImg from '@/assets/images/piramal.png';
import raymondImg from '@/assets/images/raymond.png';
import landtImg from '@/assets/images/landt.png';

declare global {
  interface Window {
    gsap: any;
  }
}

const bentoItems = [
  { title: '50M+ CuM', subtitle: 'Excavated & Moved' },
  { title: 'Safety Certified', subtitle: 'ISO 45001:2018' },
  { title: 'Deep Foundations', subtitle: 'Core Speciality' },
  { title: 'Our Projects', subtitle: 'View Case Studies' },
];

const clientLogos = [
  { name: 'Welspun Realty', logo: welspunImg },
  { name: 'Piramal Realty', logo: piramalImg },
  { name: 'Raymond Group', logo: raymondImg },
  { name: 'L&T', logo: landtImg },
];

const defaultCarouselItems: CarouselItem[] = [
  { src: "https://images.unsplash.com/photo-1521737852567-6949f3f9f2b5?q=80&w=2070&auto=format&fit=crop", title: "Project Alpha" },
  { src: "https://images.unsplash.com/photo-1556761175-59736f29332e?q=80&w=2070&auto=format&fit=crop", title: "Project Beta" },
  { src: "https://images.unsplash.com/photo-1556761175-b413da4b248b?q=80&w=2070&auto=format&fit=crop", title: "Project Gamma" },
]

interface HeroProps {
  heroCarouselItems?: CarouselItem[];
}

export const Hero: React.FC<HeroProps> = ({ heroCarouselItems }) => {
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!window.gsap || !heroRef.current) return;
    
    const tl = window.gsap.timeline({ defaults: { ease: 'power4.out', duration: 1.5 } });
    
    tl.fromTo('[data-animate="hero-left"]', 
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, delay: 0.5 }
    ).fromTo('[data-animate="hero-right"] > *', 
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, stagger: 0.15 },
      "-=1.2"
    );
  }, []);

  const itemsToDisplay = heroCarouselItems && heroCarouselItems.length > 0 ? heroCarouselItems : defaultCarouselItems;

  return (
    <section ref={heroRef} className="relative min-h-screen flex items-center overflow-hidden bg-background p-4 md:p-6">
      {/* Background Grid */}
      <div className="absolute inset-0 z-0 bg-grid-pattern opacity-10 pointer-events-none" style={{ backgroundSize: '40px 40px' }}></div>
      <div className="absolute inset-0 z-0 bg-gradient from-background via-transparent to-background pointer-events-none"></div>

      <div className="relative z-10 w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] lg:gap-10 gap-6 items-center">
        {/* Left Column: Text Content & Social Proof */}
        <div data-animate="hero-left" className="flex flex-col items-start text-left">
          <h1 className="font-header text-5xl md:text-7xl font-bold uppercase tracking-tight text-white mb-4">
            OM Enterprises
          </h1>
          <p className="font-body text-concrete-light text-lg max-w-xl leading-relaxed mb-6">
            The Foundation of Excellence. We deliver complex civil, excavation, and foundation projects for India's most demanding developers.
          </p>
          <div className="flex flex-wrap gap-4 mb-10">
            <Button label="View Projects" variant={ButtonVariant.PRIMARY} to="/projects" /> {/* Added to="/projects" */}
            <Button label="Request Quote" variant={ButtonVariant.OUTLINE} />
          </div>
          
          <div className="w-full border-t border-slate-700/50 pt-6">
             <p className="font-body text-xs text-concrete uppercase tracking-widest mb-4 flex items-center gap-2">
                Trusted by India's Leading Developers
                <a href="#clients" className="text-safety hover:text-white transition-colors flex items-center gap-1">
                   View All
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                   </svg>
                </a>
             </p>
             <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
                {clientLogos.map(client => (
                  <img key={client.name} src={client.logo} alt={client.name} className="h-16 opacity-60 hover:opacity-100 transition-opacity rounded-lg" />
                ))}
             </div>
          </div>
        </div>

        {/* Right Column: Image */}
        <div data-animate="hero-right" className="h-[70vh] w-full">
          <ImageCarousel items={itemsToDisplay} />
        </div>
      </div>
    </section>
  );
};