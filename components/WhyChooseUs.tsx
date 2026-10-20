import React from 'react';
import { FeatureCard } from './FeatureCard';

const features = [
  {
    title: 'Unmatched Expertise',
    description: 'Our team consists of industry veterans with decades of combined experience in high-stakes infrastructure development.',
    icon: (
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 sm:w-9 sm:h-9">
        {/* Precision Geotechnical Drafting Caliper / Compass */}
        <path d="M24 7L11 39H17L24 21L31 39H37L24 7Z" fill="currentColor" fillOpacity="0.14" />
        <path d="M24 7L11 39" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M24 7L37 39" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        {/* Caliper Measuring Arc with Metric Calibration Notches */}
        <path d="M16 27C18.5 25.4 21.2 24.6 24 24.6C26.8 24.6 29.5 25.4 32 27" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <line x1="24" y1="22" x2="24" y2="25" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <line x1="20" y1="23" x2="20.8" y2="26" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="28" y1="23" x2="27.2" y2="26" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        {/* Geological Strata Horizon Baseline */}
        <line x1="6" y1="42" x2="42" y2="42" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="12" y1="45" x2="16" y2="45" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="22" y1="45" x2="26" y2="45" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="32" y1="45" x2="36" y2="45" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        {/* Center Precision Joint Pivot */}
        <circle cx="24" cy="7" r="4.5" fill="currentColor" fillOpacity="0.25" stroke="currentColor" strokeWidth="2.5" />
        <circle cx="24" cy="7" r="1.5" fill="currentColor" />
        {/* Geotechnical Leveling Plummet */}
        <circle cx="24" cy="33" r="2" fill="currentColor" />
      </svg>
    ),
  },
  {
    title: 'Safety & Reliability',
    description: 'We adhere to the strictest safety protocols and are certified with ISO 45001:2018 for occupational health and safety.',
    icon: (
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 sm:w-9 sm:h-9">
        {/* Heavy Armored Geotechnical Safety Shield */}
        <path d="M24 4L8 10V22C8 33.2 14.8 41.5 24 44C33.2 41.5 40 33.2 40 22V10L24 4Z" fill="currentColor" fillOpacity="0.14" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
        {/* Inner Beveled Armor Truss */}
        <path d="M24 7V41C31 38.5 36.5 31.8 36.5 22.5V12L24 7Z" fill="currentColor" fillOpacity="0.1" />
        <path d="M14 14L24 20L34 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        {/* Central Bold Verified Checkmark */}
        <path d="M17 24L22 29L31 19" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        {/* Perimeter Structural Rivets */}
        <circle cx="13" cy="14" r="1.5" fill="currentColor" />
        <circle cx="35" cy="14" r="1.5" fill="currentColor" />
        <circle cx="24" cy="38" r="1.5" fill="currentColor" />
      </svg>
    ),
  },
  {
    title: 'Cutting-Edge Technology',
    description: 'We leverage the latest machinery and software to deliver projects with unmatched precision and efficiency.',
    icon: (
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 sm:w-9 sm:h-9">
        {/* Excavator Hydraulic Boom & Rock Breaker Assembly */}
        <path d="M6 34H16L14 40H4L6 34Z" fill="currentColor" fillOpacity="0.25" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
        <circle cx="11" cy="37" r="1.5" fill="currentColor" />
        {/* Main Boom Arm */}
        <path d="M12 34L20 14L28 18L18 36L12 34Z" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
        {/* Dipper Stick */}
        <path d="M26 16L38 24L35 28L24 19L26 16Z" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
        {/* Hydraulic Pistons */}
        <line x1="16" y1="28" x2="23" y2="20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <line x1="24" y1="14" x2="33" y2="21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        {/* Hydraulic Rock Breaker Chisel */}
        <path d="M37 25L42 34L39 36L34 27L37 25Z" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
        <path d="M42 34L45 41L42 41L39 36" fill="currentColor" />
        {/* Digital Laser Telemetry Sensor Grid */}
        <circle cx="36" cy="11" r="6" stroke="currentColor" strokeWidth="1.5" strokeDasharray="2 2" />
        <line x1="36" y1="3" x2="36" y2="7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="36" y1="15" x2="36" y2="19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="28" y1="11" x2="32" y2="11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="40" y1="11" x2="44" y2="11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="36" cy="11" r="1.5" fill="currentColor" />
        {/* Basalt Rock Fracture Waves */}
        <path d="M35 43L39 40L43 43" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: 'Proven Track Record',
    description: 'Our portfolio of successfully completed projects for India’s leading developers speaks for itself.',
    icon: (
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 sm:w-9 sm:h-9">
        {/* Rising Skyscraper Tower (Superstructure Above Grade) */}
        <path d="M18 18V6H30V18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <line x1="22" y1="10" x2="26" y2="10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="22" y1="14" x2="26" y2="14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        {/* Datum 0.00m Ground Line */}
        <line x1="4" y1="18" x2="44" y2="18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        {/* Multi-Tier Substructure Retaining Pit (Basement B1-B4) */}
        <path d="M12 18V42H36V18" fill="currentColor" fillOpacity="0.14" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
        {/* Intermediate Slabs */}
        <line x1="12" y1="26" x2="36" y2="26" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="12" y1="34" x2="36" y2="34" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        {/* Piling Foundations */}
        <line x1="16" y1="42" x2="16" y2="46" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <line x1="24" y1="42" x2="24" y2="46" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <line x1="32" y1="42" x2="32" y2="46" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        {/* Prestressed Rock Anchor Tiebacks Socketed into Bedrock */}
        <line x1="12" y1="24" x2="5" y2="29" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <line x1="12" y1="32" x2="5" y2="37" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <line x1="36" y1="24" x2="43" y2="29" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <line x1="36" y1="32" x2="43" y2="37" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        {/* Milestone Achievement Delivery Star Badge */}
        <path d="M37 5L38.5 8.5L42 9L39.5 11.5L40 15L37 13.2L34 15L34.5 11.5L32 9L35.5 8.5L37 5Z" fill="currentColor" stroke="currentColor" strokeWidth="1" strokeLinejoin="round" />
      </svg>
    ),
  },
];

export const WhyChooseUs: React.FC = () => {
  return (
    <section id="why-choose-us" className="py-20 px-4 bg-background border-t border-border-subtle relative overflow-hidden">
      {/* Subtle Blueprint Grid Accent */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-safety/10 border border-safety/30 text-safety text-xs font-mono font-bold uppercase tracking-wider mb-3">
            <span>Engineering Distinction & Competitive Edge</span>
          </div>
          <h2 className="font-header text-4xl sm:text-5xl uppercase font-bold text-text-primary tracking-tight">
            Why Choose Us
          </h2>
          <p className="font-body text-text-secondary text-sm sm:text-base max-w-2xl mx-auto mt-3 leading-relaxed">
            We are committed to delivering excellence in every project, ensuring our clients receive the best possible service and results.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              title={feature.title}
              description={feature.description}
              icon={feature.icon}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
