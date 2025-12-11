import ashokImg from '../assets/team_images/ashok.jpg';
import lokeshImg from '../assets/team_images/lokesh.jpg';
import jeetuImg from '../assets/team_images/jeetu.jpg';
import adalatImg from '../assets/team_images/adalat.jpg';
import pravinImg from '../assets/team_images/pravin.jpg';
import surendraImg from '../assets/team_images/surendra.jpg';
import abhinashImg from '../assets/team_images/abhinash.jpg';

export type Leader = {
  name: string;
  role: string;
  image: string; // Placeholder for image path
  bio: string;
  linkedin?: string;
};

export const LEADERS: Leader[] = [
  {
    name: 'Ashok Kumar Pal',
    role: 'Proprietor',
    image: ashokImg,
    bio: 'Ashok Kumar Pal is the visionary founder and proprietor of OM Enterprises, with over two decades of experience in civil and foundational engineering. His leadership has been instrumental in the company\'s growth and reputation for excellence.',
    linkedin: '#'
  },
  {
    name: 'Ramlokesh Pal',
    role: 'Manager',
    image: lokeshImg,
    bio: 'Ramlokesh Pal, as the Manager, oversees daily operations and project execution. His meticulous attention to detail and strong organizational skills ensure projects are delivered on time and within budget.',
    linkedin: '#'
  },
  {
    name: 'Jeeut Prasad',
    role: 'DGM',
    image: jeetuImg,
    bio: 'Jeeut Prasad, the Deputy General Manager, brings extensive technical expertise to the team. He is responsible for engineering design, quality control, and innovative problem-solving on complex projects.',
    linkedin: '#'
  },
  {
    name: 'Adalat Yadav',
    role: 'All Project In charge',
    image: adalatImg,
    bio: 'Adalat Yadav, as the All Project In charge, is responsible for overseeing and managing all aspects of project execution, ensuring adherence to timelines, budgets, and quality standards.',
    linkedin: '#'
  },
  {
    name: 'Pravin Chavan',
    role: 'Project Manager',
    image: pravinImg,
    bio: 'Pravin Chavan, an experienced Project Manager, leads project teams with a focus on efficiency and successful delivery. His expertise ensures seamless coordination and execution of complex engineering tasks.',
    linkedin: '#'
  },
  { // New team member
    name: 'Surendra Yadav',
    role: 'Supervisor', // Assuming a role for Surendra Yadav
    image: surendraImg,
    bio: 'Surendra Yadav is a dedicated supervisor, ensuring smooth execution and adherence to safety standards on site. His practical experience is invaluable to project success.',
    linkedin: '#'
  },
  { // New team member
    name: 'Abhinash Verma',
    role: 'Engineer', // Assuming a role for Abhinash Verma
    image: abhinashImg,
    bio: 'Abhinash Verma is a talented engineer contributing to the design and technical aspects of our projects, bringing fresh perspectives and innovative solutions.',
    linkedin: '#'
  },
];
