import React from 'react';
import { FeatureCard } from './FeatureCard';

const features = [
  {
    title: 'Unmatched Expertise',
    description: 'Our team consists of industry veterans with decades of combined experience in high-stakes infrastructure development.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.79-2.93 9.562C7.039 17.79 6 14.517 6 11c0-3.517 1.009-6.79 2.93-9.562C10.961 4.21 12 7.483 12 11z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0-3.517 1.009-6.79 2.93-9.562C16.961 4.21 18 7.483 18 11c0 3.517-1.009 6.79-2.93 9.562C13.039 17.79 12 14.517 12 11z" />
      </svg>
    ),
  },
  {
    title: 'Safety & Reliability',
    description: 'We adhere to the strictest safety protocols and are certified with ISO 45001:2018 for occupational health and safety.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 20.955a11.955 11.955 0 0018 0 12.02 12.02 0 00-3.382-8.971z" />
      </svg>
    ),
  },
  {
    title: 'Cutting-Edge Technology',
    description: 'We leverage the latest machinery and software to deliver projects with unmatched precision and efficiency.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    title: 'Proven Track Record',
    description: 'Our portfolio of successfully completed projects for India’s leading developers speaks for itself.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
];

export const WhyChooseUs: React.FC = () => {
  return (
    <section id="why-choose-us" className="py-20 px-4 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="font-header text-4xl uppercase font-bold text-white mb-4">Why Choose Us</h2>
          <p className="font-body text-concrete max-w-2xl mx-auto">
            We are committed to delivering excellence in every project, ensuring our clients receive the best possible service and results.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
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
