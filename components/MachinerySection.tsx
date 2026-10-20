import React, { useState } from 'react';
import { 
  Wrench, 
  ShieldCheck, 
  Gauge, 
  Truck, 
  ArrowRight, 
  CheckCircle2, 
  HardHat, 
  Zap,
  Activity
} from 'lucide-react';
import { HashLink } from 'react-router-hash-link';

interface MachineCategory {
  id: string;
  category: string;
  badge: string;
  highlight: string;
  models: string;
  specs: { label: string; value: string }[];
  applications: string[];
}

const FLEET_CATEGORIES: MachineCategory[] = [
  {
    id: 'excavators',
    category: 'Heavy Hydraulic Excavators',
    badge: '28 Units Owned',
    highlight: 'Deep Mass Excavation & Hard Basalt Breaking',
    models: 'Poclain EX-380 (03), EX-210 (10), EX-200 (12), EX-70 (03)',
    specs: [
      { label: 'Total Excavator Fleet', value: '28 Hydraulic Units' },
      { label: 'Heavy Mass Breakers', value: '03x EX-380 Heavy Class' },
      { label: 'Core Workhorse Fleet', value: '22x EX-210 / EX-200' },
      { label: 'Monthly Throughput', value: '50,000+ CuM / Month' },
    ],
    applications: [
      'Multi-tier deep basement rock cutting (up to 4 basements / 18m+)',
      'Bulk earthmoving & site leveling across high-density urban corridors',
      'Vibration-damped rock breaking adjacent to live heritage towers',
    ],
  },
  {
    id: 'dumpers',
    category: 'Haulage & Earthmoving Fleet',
    badge: '53 Units Owned',
    highlight: 'High-Capacity Muck Transport & Earthworks',
    models: 'Heavy Dumpers (50 Units) + JCB Backhoe Loaders (03 Units)',
    specs: [
      { label: 'Heavy Tipper Dumpers', value: '50 Dedicated Units' },
      { label: 'JCB Backhoe Loaders', value: '03 Versatile Units' },
      { label: 'Haulage Drivers & Spotters', value: '100 Trained Site Crew' },
      { label: 'Haulage Compliance', value: '100% Authorized Dumping' },
    ],
    applications: [
      'Continuous 24/7 muck removal during fast-track basement cutting',
      'Spill-free transport to authorized municipal dumping locations',
      'Site utility grading, trench backfilling & access ramp formation',
    ],
  },
  {
    id: 'piling',
    category: 'Hydraulic Piling & Shoring Rigs',
    badge: '08 Units Owned',
    highlight: 'Contiguous, Secant & Foundation Bored Piles',
    models: 'Hydraulic Piling Rigs (04 Units) + Piling DTH Machines (04 Units)',
    specs: [
      { label: 'Hydraulic Piling Rigs', value: '04 Rotary Units' },
      { label: 'Piling DTH Machines', value: '04 Deep Rock Socketing Units' },
      { label: 'Boring Diameter', value: '600mm to 1,200mm' },
      { label: 'Compliance Standards', value: 'IS 2911 (Part 1/Sec 2)' },
    ],
    applications: [
      'Contiguous Bored Piles (CBP) and Secant Pile retaining walls',
      'High-capacity foundation piling for residential towers & bridges',
      'Waterproof shoring barriers for coastal marine water tables',
    ],
  },
  {
    id: 'anchoring',
    category: 'Rock Anchoring & Drilling Units',
    badge: '04 Units Owned',
    highlight: 'Prestressed Tiebacks, Soil Nailing & Shotcrete',
    models: 'Anchor Crawler DTH Machines (04 Units)',
    specs: [
      { label: 'Anchor Crawler DTH', value: '04 Specialized Units' },
      { label: 'Anchor Capacity', value: '35T to 75T Working Load' },
      { label: 'Drill Hole Diameter', value: '76mm to 150mm' },
      { label: 'Testing Standard', value: 'IS 10270 & BS 8081 Compliant' },
    ],
    applications: [
      'Multi-tier prestressed rock anchors for retaining pit walls',
      'Passive soil nailing with welded wire mesh and shotcreting',
      'Micro-piling and underpinning for foundation strengthening',
    ],
  },
];

export const MachinerySection: React.FC = () => {
  const [activeTab, setActiveTab] = useState(FLEET_CATEGORIES[0].id);
  const activeCategory = FLEET_CATEGORIES.find(c => c.id === activeTab) || FLEET_CATEGORIES[0];

  return (
    <section id="machinery" className="scroll-mt-28 py-20 px-4 bg-background border-t border-border-subtle relative overflow-hidden">
      {/* Blueprint Grid Watermark */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2.5 h-2.5 bg-safety rounded-full animate-pulse" />
              <span className="font-mono text-xs uppercase tracking-widest text-safety font-bold">
                Owned Physical Fleet & Execution Muscle
              </span>
            </div>
            <h2 className="font-header text-4xl sm:text-5xl md:text-6xl uppercase font-bold text-text-primary tracking-tight">
              Heavy Plant & Machinery Arsenal
            </h2>
            <p className="font-body text-text-secondary text-sm sm:text-base mt-3 leading-relaxed">
              We own and self-perform with an active fleet of <strong className="text-text-primary">89+ heavy equipment units</strong> — eliminating broker markups and ensuring direct schedule certainty for every client.
            </p>
          </div>

          <HashLink
            to="/#contact"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-safety hover:bg-safety-hover text-black font-header font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-safety/20 whitespace-nowrap cursor-pointer"
          >
            <span>Mobilize Equipment for RFP</span>
            <ArrowRight className="w-4 h-4" />
          </HashLink>
        </div>

        {/* 89+ Owned Fleet Summary Banner */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          <div className="p-4 rounded-xl bg-surface border border-border-subtle flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-safety/10 flex items-center justify-center text-safety font-header font-bold text-lg flex-shrink-0">
              28
            </div>
            <div>
              <span className="font-header text-sm font-bold uppercase text-text-primary block">Excavators</span>
              <span className="font-mono text-[10px] text-text-secondary">3x EX-380, 10x EX-210, 12x EX-200, 3x EX-70</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-surface border border-border-subtle flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-safety/10 flex items-center justify-center text-safety font-header font-bold text-lg flex-shrink-0">
              53
            </div>
            <div>
              <span className="font-header text-sm font-bold uppercase text-text-primary block">Dumpers & JCB</span>
              <span className="font-mono text-[10px] text-text-secondary">50 Heavy Dumpers + 3 Backhoe Loaders</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-surface border border-border-subtle flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-safety/10 flex items-center justify-center text-safety font-header font-bold text-lg flex-shrink-0">
              08
            </div>
            <div>
              <span className="font-header text-sm font-bold uppercase text-text-primary block">Piling Fleet</span>
              <span className="font-mono text-[10px] text-text-secondary">4 Hydraulic Rigs + 4 DTH Rock Units</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-surface border border-border-subtle flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-safety/10 flex items-center justify-center text-safety font-header font-bold text-lg flex-shrink-0">
              04
            </div>
            <div>
              <span className="font-header text-sm font-bold uppercase text-text-primary block">Anchor Drills</span>
              <span className="font-mono text-[10px] text-text-secondary">4 Anchor Crawler DTH Machines</span>
            </div>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 border-b border-border-subtle no-scrollbar">
          {FLEET_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveTab(cat.id)}
              className={`px-4 py-2.5 rounded-lg font-header text-xs uppercase tracking-wider font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${
                activeTab === cat.id
                  ? 'bg-surface text-safety border border-safety/60 shadow-md'
                  : 'bg-surface-subtle/50 text-text-secondary hover:text-text-primary border border-transparent'
              }`}
            >
              <span>{cat.category}</span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-black/20 text-text-secondary">
                {cat.badge}
              </span>
            </button>
          ))}
        </div>

        {/* Active Machine Showcase Detail Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-surface border border-border-subtle rounded-2xl p-6 sm:p-8 shadow-xl">
          {/* Left Column: Machine Details & Specifications */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
            <div>
              <div className="flex items-center gap-2.5 mb-2">
                <span className="px-2.5 py-1 rounded bg-safety/10 text-safety border border-safety/30 font-mono text-xs font-bold uppercase tracking-wider">
                  {activeCategory.badge}
                </span>
                <span className="text-text-secondary text-xs font-mono">
                  {activeCategory.models}
                </span>
              </div>

              <h3 className="font-header text-2xl sm:text-3xl font-bold uppercase text-text-primary mt-2">
                {activeCategory.highlight}
              </h3>
            </div>

            {/* Specifications Matrix */}
            <div>
              <h4 className="font-mono text-xs uppercase tracking-wider text-text-secondary mb-3 flex items-center gap-1.5">
                <Gauge className="w-4 h-4 text-safety" />
                <span>Verified Operating Parameters</span>
              </h4>
              <div className="grid grid-cols-2 gap-3">
                {activeCategory.specs.map((spec, i) => (
                  <div key={i} className="p-3 bg-surface-subtle rounded-xl border border-border-subtle">
                    <span className="text-[10px] font-mono uppercase text-text-secondary block">
                      {spec.label}
                    </span>
                    <span className="font-header font-bold text-base sm:text-lg text-text-primary mt-0.5 block">
                      {spec.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Substructure Applications */}
            <div>
              <h4 className="font-mono text-xs uppercase tracking-wider text-text-secondary mb-2.5 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Typical Project Deployment</span>
              </h4>
              <ul className="space-y-2">
                {activeCategory.applications.map((app, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-text-secondary">
                    <span className="w-1.5 h-1.5 rounded-full bg-safety flex-shrink-0 mt-2" />
                    <span>{app}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right Column: Execution Assurance Card */}
          <div className="lg:col-span-5 bg-surface-subtle border border-border-subtle rounded-xl p-6 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-safety" />
                <span className="font-header text-sm uppercase font-bold text-text-primary tracking-wider">
                  The Self-Perform Advantage
                </span>
              </div>

              <p className="text-xs text-text-secondary leading-relaxed">
                By maintaining full in-house ownership of our heavy excavators and piling rigs, OM Enterprises eliminates subcontractor markup, avoids equipment availability bottlenecks, and maintains 100% control over jobsite safety and progress.
              </p>

              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-3 p-3 bg-surface rounded-lg border border-border-subtle">
                  <div className="w-8 h-8 rounded-lg bg-safety/10 flex items-center justify-center text-safety flex-shrink-0">
                    <Wrench className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-header text-xs font-bold uppercase text-text-primary block">
                      In-House Maintenance Workshop
                    </span>
                    <span className="text-[10px] text-text-secondary block font-mono">
                      Dedicated mechanic team in Mumbai ensuring zero site downtime
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-surface rounded-lg border border-border-subtle">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500 flex-shrink-0">
                    <HardHat className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-header text-xs font-bold uppercase text-text-primary block">
                      Certified Heavy Machine Operators
                    </span>
                    <span className="text-[10px] text-text-secondary block font-mono">
                      Strict PPE, daily toolbox safety briefings & ISO 45001 compliance
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-surface rounded-lg border border-border-subtle">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500 flex-shrink-0">
                    <Activity className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-header text-xs font-bold uppercase text-text-primary block">
                      Vibration-Controlled Rock Breaking
                    </span>
                    <span className="text-[10px] text-text-secondary block font-mono">
                      Safe excavation adjacent to live structures, railways & utilities
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-border-subtle flex items-center justify-between">
              <span className="text-[11px] font-mono text-text-secondary">
                24-Hour Emergency Mobilization
              </span>
              <HashLink
                to="/#contact"
                className="text-xs font-mono font-bold text-safety hover:underline flex items-center gap-1"
              >
                <span>Check Equipment Availability</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </HashLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
