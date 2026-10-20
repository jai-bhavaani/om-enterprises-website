// Team portraits hosted on Supabase Storage CDN
const CDN_TEAM_BASE = 'https://cuorugoykxvkldyztiin.supabase.co/storage/v1/object/public/media/team';
const ashokImg = `${CDN_TEAM_BASE}/ashok.jpg`;
const lokeshImg = `${CDN_TEAM_BASE}/lokesh.jpg`;
const jeetuImg = `${CDN_TEAM_BASE}/jeetu.jpg`;
const adalatImg = `${CDN_TEAM_BASE}/adalat.jpg`;
const pravinImg = `${CDN_TEAM_BASE}/pravin.jpg`;
const surendraImg = `${CDN_TEAM_BASE}/surendra.jpg`;
const abhinashImg = `${CDN_TEAM_BASE}/abhinash.jpg`;

export type Leader = {
  name: string;
  role: string;
  image: string;
  bio: string;
  experience?: string;
  linkedin?: string;
};

export const LEADERS: Leader[] = [
  {
    name: 'Ashok Kumar Pal',
    role: 'Proprietor & Principal Planner',
    experience: '20+ Years Exp',
    image: ashokImg,
    bio: 'Founder and visionary planner of OM Enterprises. With 20+ years steering high-stakes civil substructure, deep rock excavation, and shoring contracts across Mumbai and Western India.',
    linkedin: '#'
  },
  {
    name: 'Jeeut Prasad',
    role: 'Deputy General Manager (DGM)',
    experience: '25 Years Exp',
    image: jeetuImg,
    bio: '25 years of specialized geotechnical and structural execution experience, leading technical compliance, heavy plant mobilization, and safety across flagship developer sites.',
    linkedin: '#'
  },
  {
    name: 'Ramlokesh Pal',
    role: 'General Manager',
    experience: '15 Years Exp',
    image: lokeshImg,
    bio: '15 years overseeing multi-site operations, commercial contracts, client relations, and logistics across Mumbai’s major real estate corridors.',
    linkedin: '#'
  },
  {
    name: 'Adalat Yadav',
    role: 'All Project In-Charge',
    experience: '15 Years Exp',
    image: adalatImg,
    bio: '15 years commanding site execution teams, machine allocation, shift management, and round-the-clock deep pit excavation operations.',
    linkedin: '#'
  },
  {
    name: 'Pravin Chavan',
    role: 'Project Manager',
    experience: '10 Years Exp',
    image: pravinImg,
    bio: 'Civil engineering specialist managing execution milestones, rock anchoring testing, and quality control for tier-1 developer projects.',
    linkedin: '#'
  },
  {
    name: 'Surendra Yadav',
    role: 'Senior Geotechnical Engineer',
    experience: '10 Years Exp',
    image: surendraImg,
    bio: '10 years experience in deep basement shoring design, bored pile socketing, and strata stability analysis in Mumbai basalt.',
    linkedin: '#'
  },
  {
    name: 'Abhinash Verma',
    role: 'Senior Site Engineer',
    experience: '10 Years Exp',
    image: abhinashImg,
    bio: '10 years field engineering experience in prestressed anchor tensioning, pile load testing, and site coordinate control.',
    linkedin: '#'
  },
];

export const KEY_STAFF = [
  { name: 'Ashok Kumar Pal', role: 'Proprietor', exp: 20 },
  { name: 'Jeeut Prasad', role: 'DGM', exp: 25 },
  { name: 'Ramlokesh Pal', role: 'Manager', exp: 15 },
  { name: 'Adalat Yadav', role: 'All Project In charge', exp: 15 },
  { name: 'Anil Prasad', role: 'Project Manager', exp: 16 },
  { name: 'Pravin Chavan', role: 'Project Manager', exp: 10 },
  { name: 'Pankaj Pal', role: 'Sr. Engineer', exp: 20 },
  { name: 'Surendra Yadav', role: 'Sr. Engineer', exp: 10 },
  { name: 'Abhinash', role: 'Sr. Engineer', exp: 10 },
  { name: 'Babalu', role: 'Chief Surveyor', exp: 10 },
  { name: 'Ram Ashish Yadav', role: 'Site Supervisor', exp: 30 },
  { name: 'Babulal Patel', role: 'Site Supervisor', exp: 18 },
  { name: 'Md Jillur', role: 'Site Supervisor', exp: 15 },
  { name: 'Taufik Alam', role: 'Site Supervisor', exp: 10 },
  { name: 'Saddam Hussain', role: 'Supervisor', exp: 8 },
  { name: 'Kishan Rajbhar', role: 'Supervisor', exp: 8 },
  { name: 'Subhash Pal', role: 'Site Coordinator', exp: 6 },
  { name: 'Tushar Savinkar', role: 'Site Supervisor', exp: 6 },
  { name: 'Bajarangi Pal', role: 'Site Supervisor', exp: 5 },
  { name: 'Santosh Maurya', role: 'Site Supervisor', exp: 5 },
  { name: 'Kalpesh Shinde', role: 'Jr. Engineer', exp: 3 },
  { name: 'Sangeeta Pal', role: 'Administration', exp: 9 },
  { name: 'Anjali Tiwari', role: 'Accountant / Admin', exp: 5 },
];

export const WORKFORCE_TOTALS = {
  poclainCrew: { operators: 30, helpers: 30 },
  dumperCrew: { operators: 50, helpers: 50 },
  pilingCrew: { operators: 10, helpers: 30 },
  supervisoryStaff: 29,
  totalFieldPersonnel: 229,
};
