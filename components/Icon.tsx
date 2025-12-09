
import React from 'react';

const EngineerIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-safety" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const BuildingIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-safety" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 21V3m0 0l-3.3 3.3M12 3l3.3 3.3M3 21h18" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 21V11l7-5 7 5v10" />
  </svg>
);

const BlueprintIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-safety" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v18h14V3M5 3h14M9 3v18" />
  </svg>
);

interface IconProps {
  name: 'engineer' | 'building' | 'blueprint';
}

export const Icon: React.FC<IconProps> = ({ name }) => {
  switch (name) {
    case 'engineer':
      return <EngineerIcon />;
    case 'building':
      return <BuildingIcon />;
    case 'blueprint':
      return <BlueprintIcon />;
    default:
      return null;
  }
};
