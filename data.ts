export const services = [
  { 
    id: 'EXCAV', 
    type: 'EXCAV', 
    title: 'Deep Excavation & Bulk Earthmoving', 
    desc: 'Self-performed multi-tier basement excavations up to 4 basements (18m+ depth). Powered by our owned fleet of 28 heavy excavators (including 3x EX-380 heavy rock breakers) and 50 dumpers, achieving 50,000+ CuM monthly cutting throughput in hard Mumbai basalt.' 
  },
  { 
    id: 'FNDTN', 
    type: 'FNDTN', 
    title: 'Piling & Retaining Shoring Systems', 
    desc: 'Bored cast-in-situ piles, Contiguous Bored Piles (CBP), Secant Piles, and soldier shoring. Executed with 4 hydraulic piling rigs and 4 DTH hammer units for socketing into massive basalt compliant with IS 2911 standards.' 
  },
  { 
    id: 'ANCHOR', 
    type: 'ANCHOR', 
    title: 'Prestressed Rock Anchoring & Soil Nailing', 
    desc: 'High-tensile multi-strand prestressed rock anchors (35T to 75T working load), passive soil nails, and wire-mesh shotcreting for deep foundation retaining pits in compliance with IS 10270 and BS 8081.' 
  },
  { 
    id: 'CIVIL', 
    type: 'CIVIL', 
    title: 'Civil Substructure & Infrastructure', 
    desc: 'Turnkey subterranean civil execution: basement raft foundations, waterproofing barriers, grade beams, drainage dewatering networks, and site clearance across high-density urban corridors.' 
  },
] as const;

export const stats = [
  { label: 'Years Experience', value: 20, suffix: '+' },
  { label: 'Contract Value', value: 150, suffix: 'Cr+' },
  { label: 'Heavy Fleet Units', value: 89, suffix: '+' },
  { label: 'Site Workforce', value: 200, suffix: '+' },
];

export const aboutFeatures: { icon: 'engineer' | 'building' | 'blueprint'; text: string }[] = [
  { icon: 'engineer', text: 'Proprietary<br/>Heavy Fleet' },
  { icon: 'building', text: 'ISO 9001:2015<br/>Certified' },
  { icon: 'blueprint', text: '20+ Years<br/>Heritage' },
];

export const companyProfile = {
  name: 'OM ENTERPRISES',
  legalEntity: 'Om Enterprises Civil Engineering Construction Contractors',
  associatedEntity: 'Edilite Constructions Pvt. Ltd.',
  proprietor: 'Mr. Ashok Kumar Pal',
  experience: '20+ Years (Est. 2004)',
  address: '412, B2B Agrawal Centre, D’Monte Lane, Kanchpada, Malad West, Mumbai - 400064, Maharashtra',
  phone: '+91 99309 00048',
  email: 'omenterprise20@gmail.com',
  iso: 'ISO 9001:2015 (QMS/230620/6784)',
  gstin: '27ANBPP0974C1Z5',
  pan: 'ANBPP0974C',
  udyam: 'UDYAM-MH-19-0080669',
  pf: 'KDMAL1600126000',
  esic: '35000403150001099',
  tan: 'MUMA43626C',
  mlwb: 'MUMUMO000181',
  pt: '99862054008P / 27490993104P',
  vat: '27490993104V',
};

export const fleetInventory = [
  { machine: 'Poclain / Excavator EX-380', category: 'Heavy Mass Rock Excavator', qty: 3, unit: 'Units' },
  { machine: 'Poclain / Excavator EX-210', category: '21T Hydraulic Rock Breakers', qty: 10, unit: 'Units' },
  { machine: 'Poclain / Excavator EX-200', category: '20T Heavy Excavators', qty: 12, unit: 'Units' },
  { machine: 'Poclain / Excavator EX-70', category: 'Compact Urban Excavator', qty: 3, unit: 'Units' },
  { machine: 'Heavy Dumpers / Tippers', category: 'Muck & Earth Transport Fleet', qty: 50, unit: 'Units' },
  { machine: 'JCB Backhoe Loaders', category: 'Utility & Trenching Units', qty: 3, unit: 'Units' },
  { machine: 'Hydraulic Piling Rigs', category: 'Bored Cast-in-Situ Piling', qty: 4, unit: 'Units' },
  { machine: 'Piling DTH Machines', category: 'Deep Rock Socketing Rigs', qty: 4, unit: 'Units' },
  { machine: 'Anchor Crawler DTH Machines', category: 'Prestressed Rock Anchor Rigs', qty: 4, unit: 'Units' },
];

export const workforceBreakdown = {
  management: 29, // Key staff, engineers, supervisors, accountants
  operators: {
    poclainOperators: 30,
    poclainHelpers: 30,
    dumperOperators: 50,
    dumperHelpers: 50,
    pilingRigOperators: 10,
    pilingHelpers: 30,
  },
  totalSiteLabor: 200,
};

