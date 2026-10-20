import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { ImageWithFallback } from './ImageWithFallback';
import './Marquee.css';

import welspunImg from '@/assets/images/clients_clean/welspun.png';
import piramalImg from '@/assets/images/clients_clean/piramal.png';
import raymondImg from '@/assets/images/clients_clean/raymond.png';
import landtImg from '@/assets/images/clients_clean/landt.png';
import lodhaImg from '@/assets/images/clients_clean/lodha.png';
import prestigeImg from '@/assets/images/clients_clean/prestige.png';

const clientLogos = [
    { name: 'Larsen & Toubro', logo: landtImg },
    { name: 'Welspun Realty', logo: welspunImg },
    { name: 'Piramal Realty', logo: piramalImg },
    { name: 'Raymond Group', logo: raymondImg },
    { name: 'Lodha Group', logo: lodhaImg },
    { name: 'Prestige Group', logo: prestigeImg },
];

export interface HeroCarouselItem {
    image: string;
    mobileImage?: string;
    title: string;
    subtitle?: string;
    cta?: string;
    link?: string;
}

interface HeroCarouselProps {
    items: HeroCarouselItem[];
}

export const HeroCarousel: React.FC<HeroCarouselProps> = ({ items }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const nextSlide = useCallback(() => {
        if (!items || items.length === 0) return;
        setCurrentIndex((prevIndex) => (prevIndex + 1) % items.length);
    }, [items]);

    const prevSlide = useCallback(() => {
        if (!items || items.length === 0) return;
        setCurrentIndex((prevIndex) => (prevIndex - 1 + items.length) % items.length);
    }, [items]);

    const goToSlide = (index: number) => {
        setCurrentIndex(index);
    };

    useEffect(() => {
        if (!items || items.length <= 1) return;
        const timer = setInterval(() => {
            nextSlide();
        }, 6000);

        return () => clearInterval(timer);
    }, [nextSlide, items]);

    if (!items || items.length === 0) {
        return null;
    }

    return (
        <div className="w-full h-screen overflow-hidden relative group bg-[#0B1120] hero-carousel">
            {/* Sliding Track */}
            <div
                className="flex h-full transition-transform duration-700 ease-out"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
                {items.map((item, index) => (
                    <div key={index} className="flex-shrink-0 w-full h-full relative">
                        {/* Background Image: Responsive Mobile (9:16) vs Desktop (16:9) */}
                        {item.mobileImage && item.mobileImage !== item.image ? (
                            <>
                                {/* Mobile-specific portrait/vertical image (< 768px) */}
                                <ImageWithFallback
                                    src={item.mobileImage}
                                    alt={item.title}
                                    className="md:hidden w-full h-full object-cover object-center"
                                    fallbackSrc={item.image}
                                />
                                {/* Desktop landscape image (>= 768px) */}
                                <ImageWithFallback
                                    src={item.image}
                                    alt={item.title}
                                    className="hidden md:block w-full h-full object-cover object-center"
                                    fallbackSrc="https://placehold.co/1920x1080/0f1419/ffffff?text=OM+Enterprises+Project"
                                />
                            </>
                        ) : (
                            <ImageWithFallback
                                src={item.image}
                                alt={item.title}
                                className="w-full h-full object-cover object-center"
                                fallbackSrc="https://placehold.co/1920x1080/0f1419/ffffff?text=OM+Enterprises+Project"
                            />
                        )}

                        {/* Directional Gradient Overlay: Dark safe zone on left, machinery crystal clear on right */}
                        <div
                            className="absolute inset-0 pointer-events-none"
                            style={{
                                background:
                                    'linear-gradient(90deg, rgba(15, 20, 25, 0.92) 0%, rgba(15, 20, 25, 0.72) 46%, rgba(15, 20, 25, 0.22) 75%, rgba(15, 20, 25, 0.05) 100%)',
                            }}
                        />

                        {/* Vertical subtle vignette to frame content and ensure navbar/bottom bar legibility */}
                        <div
                            className="absolute inset-0 pointer-events-none"
                            style={{
                                background:
                                    'linear-gradient(180deg, rgba(11, 17, 32, 0.75) 0%, transparent 22%, transparent 72%, rgba(11, 17, 32, 0.85) 100%)',
                            }}
                        />

                        {/* Slide Content Safe Zone */}
                        <div className="absolute inset-0 flex flex-col justify-center items-start px-6 sm:px-12 md:px-16 lg:px-20 max-w-7xl mx-auto w-full z-20 pb-24 md:pb-20">
                            <div className="max-w-2xl animate-fade-in-up">
                                {/* Macro Brand Identifier */}
                                <div className="flex items-center gap-2 mb-3">
                                    <span
                                        className="font-mono text-[10px] sm:text-xs uppercase tracking-widest font-semibold bg-white/10 px-2.5 py-0.5 rounded-sm backdrop-blur-xs hero-meta-white"
                                        style={{ color: 'rgba(255, 255, 255, 0.85)' }}
                                    >
                                        Civil & Foundation Engineering Specialists • Est. 2004
                                    </span>
                                </div>

                                {/* Sleek Category Tag Pill Badge */}
                                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/60 border border-safety/60 backdrop-blur-md shadow-sm mb-4">
                                    <span className="w-2 h-2 rounded-full bg-safety animate-pulse shadow-[0_0_8px_rgba(255,107,0,0.8)]" />
                                    <span className="font-mono text-xs uppercase tracking-widest font-bold text-safety hero-badge-accent">
                                        {item.subtitle || 'Excavation & Shoring'}
                                    </span>
                                </div>

                                {/* Inverted Hero Heading: Crisp White (#FFFFFF) - Immune to theme flips */}
                                <h1
                                    className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-header font-bold uppercase leading-[1.08] tracking-tight drop-shadow-md mb-3 hero-heading-white"
                                    style={{ color: '#FFFFFF' }}
                                >
                                    {item.title}
                                </h1>

                                {/* Macro Capability / Value Metric Subtitle */}
                                <p
                                    className="font-body text-xs sm:text-sm md:text-base leading-relaxed mb-6 max-w-xl hero-subtitle-white"
                                    style={{ color: 'rgba(255, 255, 255, 0.88)' }}
                                >
                                    Precision Earthmoving & Deep Excavation • Turnkey Infrastructure • Industrial Heavy Fleet
                                </p>

                                {/* Dual Proportionate CTAs */}
                                <div className="flex flex-wrap items-center gap-3.5 pt-1">
                                    {/* Primary CTA: View Project with arrow */}
                                    <Link
                                        to={item.link || '/projects'}
                                        className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-lg bg-safety text-[var(--color-safety-text)] font-header font-bold text-xs sm:text-sm uppercase tracking-wider shadow-lg hover:opacity-95 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 group w-fit"
                                    >
                                        <span>{item.cta || 'View Project'}</span>
                                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                                    </Link>

                                    {/* Secondary CTA: Lead Gen Request a Quote */}
                                    <HashLink
                                        to="/#contact"
                                        smooth
                                        className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg bg-white/10 hover:bg-white/20 border border-white/25 font-header font-bold text-xs sm:text-sm uppercase tracking-wider backdrop-blur-md hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 w-fit"
                                        style={{ color: '#FFFFFF' }}
                                    >
                                        <span>Request a Quote</span>
                                    </HashLink>
                                </div>

                                {/* Sleek Left-Aligned Slider Controls (Directly below CTA) */}
                                <div className="flex items-center gap-4 sm:gap-6 pt-7 sm:pt-8">
                                    {/* Numbered Indicator (01 / 04) */}
                                    <div className="flex items-center gap-1.5 font-mono text-xs tracking-widest font-semibold select-none">
                                        <span className="text-safety text-sm sm:text-base font-bold hero-badge-accent">
                                            {String(currentIndex + 1).padStart(2, '0')}
                                        </span>
                                        <span style={{ color: 'rgba(255, 255, 255, 0.4)' }}>/</span>
                                        <span style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                                            {String(items.length).padStart(2, '0')}
                                        </span>
                                    </div>

                                    {/* Progress Pills */}
                                    <div className="flex items-center gap-1.5">
                                        {items.map((_, dotIdx) => (
                                            <button
                                                key={dotIdx}
                                                onClick={() => goToSlide(dotIdx)}
                                                className={`h-1.5 rounded-full transition-all duration-300 ${
                                                    dotIdx === currentIndex
                                                        ? 'w-7 bg-safety'
                                                        : 'w-2 bg-white/30 hover:bg-white/60'
                                                }`}
                                                aria-label={`Go to slide ${dotIdx + 1}`}
                                            />
                                        ))}
                                    </div>

                                    {/* Left / Right Nav Arrows */}
                                    <div className="flex items-center gap-1.5">
                                        <button
                                            onClick={prevSlide}
                                            className="p-2 rounded-lg bg-white/10 hover:bg-white/25 border border-white/20 hover:text-safety transition-colors"
                                            style={{ color: '#FFFFFF' }}
                                            aria-label="Previous Slide"
                                        >
                                            <ChevronLeft className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={nextSlide}
                                            className="p-2 rounded-lg bg-white/10 hover:bg-white/25 border border-white/20 hover:text-safety transition-colors"
                                            style={{ color: '#FFFFFF' }}
                                            aria-label="Next Slide"
                                        >
                                            <ChevronRight className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Trusted By Footer Bar: Deep Charcoal Solid Bar with Clean Monochrome Logos */}
            <div className="absolute bottom-0 left-0 w-full py-3.5 sm:py-4 z-30 overflow-hidden bg-[#12161A]/95 backdrop-blur-md border-t border-white/10 shadow-2xl">
                <div className="flex items-center max-w-7xl mx-auto px-4 md:px-8">
                    <div className="flex items-center gap-2.5 pr-6 mr-6 border-r border-white/15 whitespace-nowrap shrink-0">
                        <span className="w-1.5 h-1.5 rounded-full bg-safety" />
                        <span
                            className="text-[10px] sm:text-xs font-header font-bold uppercase tracking-widest"
                            style={{ color: 'rgba(255, 255, 255, 0.85)' }}
                        >
                            Trusted By Industry Leaders
                        </span>
                    </div>

                    <div className="flex overflow-hidden relative w-full mask-gradient-x">
                        <div className="flex items-center gap-12 sm:gap-16 animate-scroll w-max">
                            {[
                                ...clientLogos,
                                ...clientLogos,
                                ...clientLogos,
                                ...clientLogos,
                            ].map((client, i) => (
                                <img
                                    key={i}
                                    src={client.logo}
                                    alt={client.name}
                                    title={client.name}
                                    className="h-6 sm:h-7 md:h-8 w-auto object-contain opacity-75 hover:opacity-100 transition-opacity duration-300"
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
