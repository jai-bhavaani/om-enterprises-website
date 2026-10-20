import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LEADERS, Leader } from '../src/data/team'; // Adjust path as necessary
import { useTeam } from '../src/hooks/useCMS';
import { Button } from './Button'; // Assuming Button component is available
import { ButtonVariant } from '../types';

// Reusable LeaderCard component (optional, but good for separation of concerns)
const LeaderCard: React.FC<{ leader: Leader }> = ({ leader }) => (
  <motion.div
    layout
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.3 }}
    className="bg-surface border border-border-subtle p-8 text-center hover:border-safety/50 transition-colors group rounded-xl shadow-md flex flex-col justify-between"
  >
    <div>
      <div className="w-36 h-36 bg-surface-subtle border-2 border-border-subtle rounded-full mx-auto mb-5 overflow-hidden relative transition-all duration-300 group-hover:border-safety/40 shadow-inner">
        {/* Authentic Leadership Portrait */}
        <img src={leader.image} alt={leader.name} className="w-full h-full object-cover" />
      </div>
      
      {leader.experience && (
        <span className="inline-block px-2.5 py-0.5 rounded-full bg-safety/10 text-safety border border-safety/30 font-mono text-[10px] font-bold uppercase tracking-wider mb-2">
          {leader.experience}
        </span>
      )}
      
      <h3 className="font-header text-xl text-text-primary uppercase mb-1">{leader.name}</h3>
      <p className="font-body text-safety text-xs uppercase tracking-widest mb-3 font-semibold">{leader.role}</p>
      <p className="font-body text-text-secondary text-sm leading-relaxed mb-4">{leader.bio}</p>
    </div>
  </motion.div>
);

export const LeadershipSection: React.FC = () => {
  const { team } = useTeam();
  const [showAll, setShowAll] = useState(false);
  const initialDisplayCount = 3; // Display first 3 leaders by default
  const displayedLeaders = showAll ? team : team.slice(0, initialDisplayCount);

  return (
    <section id="team" className="scroll-mt-28 py-20 px-4 bg-surface/30 border-t border-border-subtle">
      <div className="max-w-7xl mx-auto text-center mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-safety/10 border border-safety/30 text-safety text-xs font-mono font-bold uppercase tracking-wider mb-3">
          <span>Key Technical Management & Site Leadership</span>
        </div>
        <h2 className="font-header text-4xl sm:text-5xl uppercase font-bold text-text-primary mb-4">
          Leadership & Engineering Command
        </h2>
        <p className="font-body text-text-secondary max-w-2xl mx-auto text-sm sm:text-base">
          Headed by founder Mr. Ashok Kumar Pal with over 20 years of continuous ground-engineering experience in Mumbai, backed by seasoned deputy directors and project managers.
        </p>
      </div>
      
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence initial={false}>
            {displayedLeaders.map((leader) => (
              <LeaderCard key={leader.name} leader={leader} />
            ))}
          </AnimatePresence>
        </div>

        {team.length > initialDisplayCount && (
          <div className="flex justify-center mt-8">
            <Button
              onClick={() => setShowAll(!showAll)}
              variant={ButtonVariant.OUTLINE}
              label={showAll ? "Show Less" : "View Complete Leadership"}
              icon={
                <motion.span
                  animate={{ rotate: showAll ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2.5}
                    stroke="currentColor"
                    className="h-4 w-4"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                  </svg>
                </motion.span>
              }
            />
          </div>
        )}

        {/* Self-Performed Field Workforce Matrix (Institutional Proof) */}
        <div className="mt-16 bg-surface border border-border-subtle rounded-2xl p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 pb-6 border-b border-border-subtle gap-4">
            <div>
              <span className="font-mono text-xs uppercase tracking-widest text-safety font-bold block mb-1">
                Direct In-House Human Assets
              </span>
              <h3 className="font-header text-2xl uppercase font-bold text-text-primary">
                200+ Dedicated Self-Performed Field Crew
              </h3>
            </div>
            <div className="px-3.5 py-1.5 rounded-lg bg-surface-subtle border border-border-subtle font-mono text-xs text-text-secondary">
              Zero Third-Party Labor Brokering
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-surface-subtle border border-border-subtle text-center">
              <span className="font-header text-3xl font-bold text-text-primary block">60</span>
              <span className="font-mono text-xs text-safety font-bold uppercase block mt-1">Poclain Crew</span>
              <span className="text-[11px] text-text-secondary mt-1 block">30 Certified Operators + 30 Helpers</span>
            </div>

            <div className="p-4 rounded-xl bg-surface-subtle border border-border-subtle text-center">
              <span className="font-header text-3xl font-bold text-text-primary block">100</span>
              <span className="font-mono text-xs text-safety font-bold uppercase block mt-1">Dumper Logistics</span>
              <span className="text-[11px] text-text-secondary mt-1 block">50 Heavy Drivers + 50 Spotters</span>
            </div>

            <div className="p-4 rounded-xl bg-surface-subtle border border-border-subtle text-center">
              <span className="font-header text-3xl font-bold text-text-primary block">40</span>
              <span className="font-mono text-xs text-safety font-bold uppercase block mt-1">Piling & Shoring</span>
              <span className="text-[11px] text-text-secondary mt-1 block">10 Rig Masters + 30 Rig Assistants</span>
            </div>

            <div className="p-4 rounded-xl bg-surface-subtle border border-border-subtle text-center">
              <span className="font-header text-3xl font-bold text-text-primary block">29</span>
              <span className="font-mono text-xs text-safety font-bold uppercase block mt-1">Engineers & PMs</span>
              <span className="text-[11px] text-text-secondary mt-1 block">Supervisors, Surveyors & Planners</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};