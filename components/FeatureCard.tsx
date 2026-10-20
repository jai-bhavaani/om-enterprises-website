import React from 'react';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({ title, description, icon }) => {
  return (
    <div className="group bg-surface border border-border-subtle p-8 rounded-lg transform transition-all duration-300 hover:-translate-y-1 hover:border-safety/60 shadow-md">
      <div className="mb-4 text-safety">
        {icon}
      </div>
      <h3 className="font-header text-2xl text-text-primary font-bold mb-2 group-hover:text-safety transition-colors">{title}</h3>
      <p className="font-body text-text-secondary leading-relaxed">{description}</p>
    </div>
  );
};
