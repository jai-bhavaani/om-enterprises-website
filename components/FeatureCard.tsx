import React from 'react';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({ title, description, icon }) => {
  return (
    <div className="group bg-surface border border-border-subtle p-7 sm:p-8 rounded-2xl transform transition-all duration-300 hover:-translate-y-1 hover:border-safety/60 hover:shadow-xl shadow-sm relative overflow-hidden flex flex-col justify-between">
      {/* Subtle top corner safety accent */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-safety/5 rounded-bl-full pointer-events-none group-hover:bg-safety/10 transition-colors" />

      <div>
        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-surface-subtle border border-border-subtle group-hover:border-safety/40 group-hover:bg-safety/10 text-safety flex items-center justify-center mb-5 transition-all duration-300 group-hover:scale-110 shadow-xs">
          {icon}
        </div>
        <h3 className="font-header text-xl sm:text-2xl text-text-primary font-bold uppercase tracking-wide mb-2.5 group-hover:text-safety transition-colors">
          {title}
        </h3>
        <p className="font-body text-text-secondary leading-relaxed text-sm sm:text-base">
          {description}
        </p>
      </div>

      <div className="mt-6 pt-4 border-t border-border-subtle/50 flex items-center justify-between text-xs font-mono text-text-secondary group-hover:text-safety transition-colors">
        <span className="uppercase tracking-wider font-semibold">OM Engineering Protocol</span>
        <span className="w-8 h-0.5 bg-border-subtle group-hover:w-14 group-hover:bg-safety transition-all duration-300" />
      </div>
    </div>
  );
};
