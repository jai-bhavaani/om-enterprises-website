import React from 'react';
import { ShieldCheck, Check, ArrowRight, Building2, Repeat } from 'lucide-react';
import { HashLink } from 'react-router-hash-link';

import lodhaImg from '@/assets/images/lodha.png';
import prestigeImg from '@/assets/images/prestige.png';
import welspunImg from '@/assets/images/welspun.png';
import piramalImg from '@/assets/images/piramal.png';
import raymondImg from '@/assets/images/raymond.png';
import billiImg from '@/assets/images/billi.png';
import breachImg from '@/assets/images/breach.png';
import landtImg from '@/assets/images/landt.png';
import hccImg from '@/assets/images/hcc.png';
import primeImg from '@/assets/images/prime.png';
import rnaImg from '@/assets/images/rna.png';
import trykshaImg from '@/assets/images/tryksha.png';
import jpImg from '@/assets/images/jp.png';
import dataImg from '@/assets/images/data.png';
import knightImg from '@/assets/images/knight.png';
import gleedsImg from '@/assets/images/gleeds.png';

const PARTNER_LOGOS = [
  { name: "Larsen & Toubro", logo: landtImg },
  { name: "Piramal Realty", logo: piramalImg },
  { name: "Raymond Group", logo: raymondImg },
  { name: "Lodha Group", logo: lodhaImg },
  { name: "Welspun Realty", logo: welspunImg },
  { name: "Prestige Group", logo: prestigeImg },
  { name: "Breach Candy Hospital", logo: breachImg },
  { name: "B.E. Billimoria", logo: billiImg },
  { name: "HCC", logo: hccImg },
  { name: "JP Infra", logo: jpImg },
  { name: "Prime Group", logo: primeImg },
  { name: "RNA Corp", logo: rnaImg },
  { name: "Gleeds PMC", logo: gleedsImg },
  { name: "Knight Frank", logo: knightImg },
];

const VERIFIED_PARTNERSHIPS = [
  {
    client: "Prestige Estates Projects Ltd",
    logo: prestigeImg,
    landmark: "Prestige City Mulund",
    contractValue: "₹20,05,99,882",
    status: "Completed",
    scope: "Deep Piling, High-Load Rock Anchoring & Bulk Excavation",
    metrics: "₹20.06 Cr substructure package executed to strict structural tolerance",
  },
  {
    client: "Raymond Ltd.",
    logo: raymondImg,
    landmark: "Raymond Bandra & Thane Developments",
    contractValue: "₹20,00,00,000",
    status: "In Progress",
    scope: "Deep Basalt Breaking, Mass Earthmoving & Substructure Clearance",
    metrics: "₹20.00 Cr fast-track mobilization with dedicated EX-380 heavy fleet",
  },
  {
    client: "Piramal Group / Realty",
    logo: piramalImg,
    landmark: "Piramal Gulita (Worli) & Nival Developments",
    contractValue: "₹29,94,87,166 (Combined)",
    status: "Active & Delivered",
    scope: "Ultra-Luxury Landmark Substructure & Coastal Saline Earthworks",
    metrics: "₹20.50 Cr ongoing package + ₹9.45 Cr completed landmark project",
  },
  {
    client: "Larsen & Toubro (L&T Construction)",
    logo: landtImg,
    landmark: "L&T Forest Hill, Powai Corridor",
    contractValue: "₹16,12,21,470",
    status: "In Progress",
    scope: "Deep Basement Excavation, Shoring Piling & 45T Rock Anchors",
    metrics: "₹16.12 Cr deep foundation package delivered ahead of monsoon cutoff",
  },
  {
    client: "Welspun Group",
    logo: welspunImg,
    landmark: "Connective Industrial & Logistics Parks",
    contractValue: "₹15,71,75,862",
    status: "Completed",
    scope: "Mass Earthmoving, Soil Stabilization & Heavy Industrial Foundation",
    metrics: "₹15.72 Cr high-capacity logistics park earthmoving delivered on time",
  },
  {
    client: "Prime Focus (ILA CHS, Juhu)",
    logo: primeImg,
    landmark: "Prime Focus Commercial Substructure",
    contractValue: "₹11,70,00,000",
    status: "Completed",
    scope: "Turnkey Deep Excavation, Contiguous Piling & Rock Dewatering",
    metrics: "₹11.70 Cr precision deep basement excavation adjacent to live structures",
  },
];

export const ClientSection: React.FC = () => {
  return (
    <section id="clients" className="scroll-mt-28 py-20 px-4 bg-surface-subtle/50 border-t border-border-subtle relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-safety/10 border border-safety/30 text-safety text-xs font-mono font-bold uppercase tracking-wider mb-3">
            <Repeat className="w-3.5 h-3.5" />
            <span>85%+ Repeat Client Track Record</span>
          </div>
          <h2 className="font-header text-4xl sm:text-5xl uppercase font-bold text-text-primary tracking-tight">
            Trusted by India’s Premier Developers
          </h2>
          <p className="font-body text-text-secondary text-sm sm:text-base mt-3 leading-relaxed">
            Rather than anonymous claims, our reputation is proven through multi-year repeat partnerships with India’s leading real estate conglomerates, EPC builders, and institutional trusts.
          </p>
        </div>

        {/* Clean Logo Marquee Strip */}
        <div className="mb-14 p-6 bg-surface border border-border-subtle rounded-2xl shadow-sm">
          <span className="text-[10px] font-mono uppercase tracking-widest text-text-secondary block text-center mb-6">
            Approved Substructure & Earthmoving Partner For
          </span>
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10">
            {PARTNER_LOGOS.map((partner, i) => (
              <div
                key={i}
                className="h-12 w-28 sm:w-32 flex items-center justify-center grayscale hover:grayscale-0 opacity-70 hover:opacity-100 transition-all duration-300"
                title={partner.name}
              >
                <img
                  src={partner.logo}
                  alt={partner.name}
                  className="max-h-10 max-w-full object-contain"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Verified Case Study Cross-Links (The Benchmark Standard) */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-header text-lg sm:text-xl font-bold uppercase text-text-primary tracking-wide flex items-center gap-2">
              <Building2 className="w-5 h-5 text-safety" />
              <span>Marquee Project Engagements</span>
            </h3>
            <HashLink
              to="/projects"
              className="font-mono text-xs text-safety hover:underline flex items-center gap-1 font-bold"
            >
              <span>View All Delivered Projects</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </HashLink>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {VERIFIED_PARTNERSHIPS.map((item, idx) => (
              <div
                key={idx}
                className="p-5 sm:p-6 bg-surface border border-border-subtle hover:border-safety/50 rounded-xl transition-all shadow-sm flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-3 gap-2">
                    <span className="font-header font-bold text-sm uppercase text-safety">
                      {item.client}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-mono font-bold text-safety px-2 py-0.5 rounded bg-safety/10 border border-safety/30">
                        {item.contractValue}
                      </span>
                      <span className="text-[10px] font-mono text-text-secondary px-2 py-0.5 rounded bg-surface-subtle border border-border-subtle">
                        {item.status}
                      </span>
                    </div>
                  </div>

                  <h4 className="font-header text-xl font-bold text-text-primary uppercase group-hover:text-safety transition-colors">
                    {item.landmark}
                  </h4>

                  <p className="text-xs text-text-secondary mt-2 leading-relaxed">
                    <strong className="text-text-primary font-medium">Scope:</strong> {item.scope}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-border-subtle flex items-center justify-between text-xs">
                  <span className="text-[11px] font-mono text-emerald-500 flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5" />
                    <span>{item.metrics}</span>
                  </span>

                  <HashLink
                    to="/projects"
                    className="font-mono text-[11px] text-text-secondary group-hover:text-safety transition-colors flex items-center gap-1"
                  >
                    <span>Details</span>
                    <ArrowRight className="w-3 h-3" />
                  </HashLink>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};