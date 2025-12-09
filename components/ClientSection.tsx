import React from 'react';
import './Marquee.css';

import lodhaImg from '@/assets/images/lodha.png';
import prestigeImg from '@/assets/images/prestige.png';
import welspunImg from '@/assets/images/welspun.png';
import piramalImg from '@/assets/images/piramal.png';
import raymondImg from '@/assets/images/raymond.png';
import billiImg from '@/assets/images/billi.png';
import breachImg from '@/assets/images/breach.png';
import landtImg from '@/assets/images/LandT.png';
import hccImg from '@/assets/images/hcc.png';
import primeImg from '@/assets/images/prime.png';
import rnaImg from '@/assets/images/rna.png';
import trykshaImg from '@/assets/images/tryksha.png';
import jpImg from '@/assets/images/jp.png';
import dataImg from '@/assets/images/data.png';
import knightImg from '@/assets/images/knight.png';
import gleedsImg from '@/assets/images/gleeds.png';

const PARTNERS = [
  { name: "Lodha", logo: lodhaImg, alt: "Lodha Group" },
  { name: "Prestige", logo: prestigeImg, alt: "Prestige Group" },
  { name: "Welspun", logo: welspunImg, alt: "Welspun Group" },
  { name: "Piramal", logo: piramalImg, alt: "Piramal Group" },
  { name: "Raymond", logo: raymondImg, alt: "Raymond Group" },
  { name: "Billi", logo: billiImg, alt: "Billiards India" },
  { name: "Breach", logo: breachImg, alt: "Breach Candy Hospital" },
  { name: "L&T", logo: landtImg, alt: "Larsen & Toubro" },
  { name: "HCC", logo: hccImg, alt: "HCC" },
  { name: "Prime", logo: primeImg, alt: "Prime Group" },
  { name: "RNA", logo: rnaImg, alt: "RNA Corp" },
  { name: "Tryksha", logo: trykshaImg, alt: "Tryksha" },
  { name: "JP", logo: jpImg, alt: "JP Infra" },
  { name: "Data", logo: dataImg, alt: "Data Group" },
  { name: "Knight", logo: knightImg, alt: "Knight Frank" },
  { name: "Gleeds", logo: gleedsImg, alt: "Gleeds" },
];

export const ClientSection: React.FC = () => {
  const extendedPartners = [...PARTNERS, ...PARTNERS];

  return (
    <section className="py-12 bg-background">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-center font-header text-3xl uppercase font-bold text-white mb-10">
          Trusted By
        </h2>
          <div className="relative w-full">
            <div className="flex flex-wrap justify-center">
            {extendedPartners.map((partner, index) => (
              <div key={index} className="flex-shrink-0 mx-6">
                <img
                  src={partner.logo}
                  alt={partner.alt}
                  className="h-16 w-auto grayscale opacity-70 transition-all duration-300 hover:grayscale-0 hover:opacity-100 hover:scale-110 rounded-lg"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};