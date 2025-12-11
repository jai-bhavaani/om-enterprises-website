
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
  "Aristo Glory": "Aristo Glory ",
  "Arristo Goregaon": "Arissto Goregaon",
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
  "Mahindra Kandivali": "Mahindra Road, Kandivali",
  "Photo": "Other Photos",
  "Piramal": "Gulita Piramal (Nival D)",
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
  "Piramal": "Gulita Piramal ( Nival Developers )",
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
  "Aristo Glory": "Excavation",
  "Arristo Goregaon": "Civil & Infra Work",
  "Ashirwad Bunglow": "Piling, Anchoring & Excavation Work",
  "B E Billimoria Andheri": "Excavation & Civil Work",
  "B E Billimoria Raptacos Thane": "Excavation Work",
  "Breach Candy Hospital": "Shore Piling & Rock Anchors",
  "HCC Jammu": "Foundation & Slope Stablization Work",
  "Kasturi Chirabazar": "Piling, Anchoring & Excavation Work",
  "L & T Forest Hill": "Excavation",
  "Lulu Walkeshwar": "Anchoring & Excavation",
  "Mahindra Kandivali": "Road Construction",
  "Piramal": "Civil Work",
  "Piramal Estates": "Civil & Infra Work",
  "Piramal Mahalaxmi": "Civil & Infra Work",
  "Piraml Revanta Mulund": "Civil & Infra ",
  "Prestige Estates": "Piling, Anchoring & Excavation Work",
  "Prestige mulund": "Excavation",
  "Prime Focus": "Piling, Anchoring & Excavation Work",
  "Raymond Bandra Site": "Excavation Work",
  "RNA BAM Market Photos": "Excavation Work",
  "Sayba Spaces": "Anchoring & Excavation Work",
  "Tryksha Real Estate": "Piling, Anchoring & Excavation",
  "Verve Greens": "Shore Piling, Rock Anchors & Excavation Work",
  "Welspun": "Piling, Anchoring & Excavation Work",
  "VJTF Borivali": "Compound Wall "
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
