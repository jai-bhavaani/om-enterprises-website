import React from 'react';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({ title, description, icon }) => {
  return (
    <div className="group bg-surface/10 border border-slate-800 p-8 rounded-lg transform transition-transform duration-300 hover:-translate-y-1 hover:border-safety">
      <div className="mb-4 text-safety">
        {icon}
      </div>
      <h3 className="font-header text-2xl text-white font-bold mb-2">{title}</h3>
      <p className="font-body text-concrete-light">{description}</p>
    </div>
  );
};
