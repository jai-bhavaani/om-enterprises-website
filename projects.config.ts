
// Get all images from the projects folder
const projectImages = import.meta.glob('./src/assets/projects/**/*.{png,jpg,jpeg,JPG,JPEG,webp}', { eager: true, import: 'default' });

const projectsMap: Record<string, string[]> = {};

Object.keys(projectImages).forEach((path) => {
  // path is like /src/assets/projects/Folder Name/Image.jpg
  const parts = path.split('/');
  const projectsIndex = parts.indexOf('projects');
  
  // Ensure we are looking at a subfolder within projects
  if (projectsIndex !== -1 && parts.length > projectsIndex + 2) {
    const folderName = parts[projectsIndex + 1];
    
    if (folderName) {
      if (!projectsMap[folderName]) {
        projectsMap[folderName] = [];
      }
      projectsMap[folderName].push(projectImages[path] as string);
    }
  }
});
const titleMapping: Record<string, string> = {
  "Ariisto Mulund": "Ariisto, Mulund",
  "Aristo Glory": "Ariisto Glory ",
  "Arristo Goregaon": "Ariisto Goregaon",
  "Ashirwad Bunglow": "Ashirwad Bungalow,Bandra West",
  "Aurum Venturs": "Aurum Ventures",
  "B E Billimoria Andheri": "B. E. Billimoria Andheri",
  "B E Billimoria Raptacos Thane": "B. E. Billimoria Raptacos Thane",
  "Breaking": "Breaking Works",
  "Breach Candy Hospital": "Breach Candy Hospital",
  "Chembur Demoliotion": "Chembur Demolition",
  "Chistiya height Null bazar": "Chistiya Height, Null Bazar",
  "Fem Jaycee Home Ghatkoper": "Fem Jaycee Home, Ghatkopar",
  "HCC Jammu": "HCC Jammu",
  "Kasturi Chirabazar": "Kasturi Chirabazar",
  "L & T Forest Hill": "L&T Forest Hill",
  "Lulu Walkeshwar": "Lulu Walkeshwar",
  "Mahindra Kandivali": "Mahindra & Mahindra , Kandivali",
  "Photo": "Other Photos",
  "Piramal": "Piramal Gulita ",
  "Piramal Agastya": "Piramal Agastya",
  "Piramal Pathway Images": "Piramal Pathway",
  "Piramal Vaikunth": "Piramal Vaikunth",
  "Piraml Revanta Mulund": "Piramal Revanta, Mulund",
  "Prestige mulund": "Prestige Mulund",
  "Raymond Bandra Site": "Raymond Bandra",
  "RNA BAM Market Photos": "RNA BAM Market, Kandivali",
  "RNA Metroppolis": "RNA Metropolis",
  "Shanti Housing": "Vasai Madhuban Shantee Housing",
  "Tractor Piling": "Tractor Piling Works",
  "VJTF Borivali": "VJTF Borivali",
  "Welspun": "Welspun Thane"
  
  
};

const nameMapping: Record<string, string> = {
  "Ashirwad Bunglow": "Ashirwad Bunglow",
  "B E Billimoria Andheri": "B.E. Billimoria & Co. Limited",
  "Breach Candy Hospital": "Breach Candy Hospital Trust",
  "HCC Jammu": "HCC ( Hindustan Construction Company )",
  "Kasturi Chirabazar": "Kasturi Infrastructure Private Limited",
  "L & T Forest Hill": "L&T Construction",
  "Piramal": " Piramal Gulita ",
  "Piramal Estates": "Piramal Estates Pvt. Ltd.",
  "Piramal Mahalaxmi": "Piramal Mahalaxmi ( Glider Buildcon )",
  "Prestige Estates": "Prestige Estates Pvt Ltd.",
  "Prestige mulund": "Prestige Estates Projects Ltd",
  "Prime Focus": "Prime Focus ( ILA CHS Ltd, Juhu )",
  "Raymond Bandra Site": "Raymond Ltd.",
  "Sayba Spaces": "Sayba Spaces ( Star Regency )",
  "Tryksha Real Estate": "Tryksha Real Estate Pvt. Ltd.",
  "Verve Greens": "Verve Greens Holding & Realty Pvt Ltd",
  "Welspun": "Connective Industrial And Logistics Parks Pvt. Ltd. ( Welspun Group )"
};



const scopeMapping: Record<string, string> = {
  // Piling, Anchoring & Excavation (Combined - Most Common)
  "Ashirwad Bunglow": "Piling, Anchoring & Excavation",
  "Breach Candy Hospital": "Piling, Anchoring & Excavation",
  "Kasturi Chirabazar": "Piling, Anchoring & Excavation",
  "Lulu Walkeshwar": "Piling, Anchoring & Excavation",
  "Piling": "Piling, Anchoring & Excavation",
  "Tractor Piling": "Piling, Anchoring & Excavation",
  "Welspun": "Piling, Anchoring & Excavation",
  "L & T Forest Hill": "Piling, Anchoring & Excavation",
  "Prestige mulund": "Piling, Anchoring & Excavation",

  // Civil & Infrastructure
  "Arristo Goregaon": "Civil & Infrastructure",
  "HCC Jammu": "Civil & Infrastructure",
  "B E Billimoria Andheri": "Civil & Infrastructure",
  "Chistiya height Null bazar": "Civil & Infrastructure",
  
  "Piramal": "Civil & Infrastructure",
  "Piramal Agastya": "Civil & Infrastructure",
  "Piramal Vaikunth": "Civil & Infrastructure",
  "Piraml Revanta Mulund": "Civil & Infrastructure",
  "RNA Metroppolis": "Civil & Infrastructure",
  "Shanti Housing": "Civil & Infrastructure",
  "VJTF Borivali": "Civil & Infrastructure",
  "Welspun One ( JNPA SEZ Site )": "Civil & Infrastructure",

  // Excavation Only (Specialized)
  "Aristo Glory": "Excavation Only",
  "Aurum Venturs": "Excavation Only",
  "B E Billimoria Raptacos Thane": "Excavation Only",
  "Raymond Bandra Site": "Excavation Only",
  "RNA BAM Market Photos": "Excavation Only",

  // Demolition
  "Breaking": "Demolition",
  "Chembur Demoliotion": "Demolition",


  // road 
  "Mahindra Kandivali": "Road constructionn",
};



export const projectData = Object.keys(projectsMap).map((folderName) => {

  const name = nameMapping[folderName] || folderName;

  return {

    title: titleMapping[folderName] || folderName,

    name: name,


    images: projectsMap[folderName],

    scope: scopeMapping[folderName] || '' // Add scope to project data

  };

}).sort((a, b) => b.images.length - a.images.length);
