
// Get all images from the projects folder
const projectImages = import.meta.glob('/src/assets/projects/**/*.{png,jpg,jpeg,JPG,JPEG,webp}', { eager: true, import: 'default' });

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

  "Prestige mulund": "Prestige Mulund Project",

  "Welspun": "Welspun Thane",

  "L & T Forest Hill": "L&T Forest Hill Project",

  "Raymond Bandra Site": "Raymond Bandra Project",

  "B E Billimoria Raptacos Thane": "B. E. Billimoria Raptacos Thane",

  "Ashirwad Bunglow": "Ashirwad Bungalow Project",

  "HCC Jammu": "HCC Jammu Project",

  "Piramal Agastya": "Piramal Agastya Project",

  "Arristo Goregaon": "Arissto Goregaon",

  "Mahindra Kandivali": "Mahindra Road Project, Kandivali",

  "Piraml Revanta Mulund": "Piramal Revanta Project, Mulund",

  "Shanti Housing": "Vasai Madhuban Shantee Housing",

  "Ariisto Mulund": "Ariisto Mulund",

  "Aristo Glory": "Aristo Glory",

  "Aurum Venturs": "Aurum Ventures",

  "B E Billimoria Andheri": "B. E. Billimoria Andheri",

  "Breach Candy Hospital": "Breach Candy Hospital",

  "Chembur Demoliotion": "Chembur Demolition",

  "Chistiya height Null bazar": "Chistiya Height, Null Bazar",

  "Fem Jaycee Home Ghatkoper": "Fem Jaycee Home, Ghatkopar",

  "Kasturi Chirabazar": "Kasturi Chirabazar",

  "Lulu Walkeshwar": "Lulu Walkeshwar",

  "Piramal Vaikunth": "Piramal Vaikunth",

  "RNA BAM Market Photos": "RNA BAM Market",

  "RNA Metroppolis": "RNA Metropolis",

  "VJTF Borivali": "VJTF Borivali",

  "Photo": "Other Photos",

  "Breaking": "Breaking Works",

  "Tractor Piling": "Tractor Piling Works",

  "Piramal Pathway Images": "Piramal Pathway",

  "Piramal": "Gulita Piramal (Nival D)"

};



const nameMapping: Record<string, string> = {

  "Piramal": "Gulita Piramal ( Nival Developers )",

  "Prime Focus": "Prime Focus ( ILA CHS Ltd, Juhu )",

  "Tryksha Real Estate": "Tryksha Real Estate Pvt. Ltd.",

  "Ashirwad Bunglow": "Ashirwad Bunglow",

  "B E Billimoria Andheri": "B.E. Billimoria & Co. Limited",

  "Welspun": "Connective Industrial And Logistics Parks Pvt. Ltd. ( Welspun Group)",

  "Breach Candy Hospital": "Breach Candy Hospital Trust",

  "Verve Greens": "Verve Greens Holding & Realty Pvt Ltd",

  "Piramal Mahalaxmi": "Piramal Mahalaxmi ( Glider Buildcon )",

  "HCC Jammu": "HCC ( Hindustan Construction Company )",

  "Prestige mulund": "Prestige Estates Projects Ltd",

  "L & T Forest Hill": "L&T Construction",

  "Prestige Estates": "Prestige Estates Pvt Ltd.",

  "Piramal Estates": "Piramal Estates Pvt. Ltd.",

  "Kasturi Chirabazar": "Kasturi Infrastructure Private Limited",

  "Raymond Bandra Site": "Raymond Ltd.",

  "Sayba Spaces": "Sayba Spaces ( Star Regency )"

};



const valueMapping: Record<string, string> = {

  "Gulita Piramal ( Nival Developers )": "9,44,87,166.00",

  "Prime Focus ( ILA CHS Ltd, Juhu )": "11,70,00,000.00",

  "Tryksha Real Estate Pvt. Ltd.": "6,50,34,250.00",

  "Ashirwad Bunglow": "1,95,00,000.00",

  "B.E. Billimoria & Co. Limited": "2,90,24,247.00",

  "Connective Industrial And Logistics Parks Pvt. Ltd. ( Welspun Group)": "15,71,75,862.00",

  "Breach Candy Hospital Trust": "1,02,52,074.00",

  "Verve Greens Holding & Realty Pvt Ltd": "10,48,42,000.00",

  "Piramal Mahalaxmi ( Glider Buildcon )": "6,50,00,000.00",

  "HCC ( Hindustan Construction Company )": "9,37,65,540.00",

  "Prestige Estates Projects Ltd": "20,05,99,882.00",

  "L&T Construction": "16,12,21,470.00",

  "Prestige Estates Pvt Ltd.": "10,21,00,000.00",

  "Piramal Estates Pvt. Ltd.": "20,50,000,00.00",

  "Kasturi Infrastructure Private Limited": "6,39,00,000.00",

  "Raymond Ltd.": "29,00,00,000.00",

  "Sayba Spaces ( Star Regency )": "1,47,00,000.00"

};



const scopeMapping: Record<string, string> = {

  "Piramal": "Civil Work",

  "Prime Focus": "Piling, Anchoring & Excavation Work",

  "Tryksha Real Estate": "Piling, Anchoring & Excavation",

  "Ashirwad Bunglow": "Piling, Anchoring & Excavation Work",

  "B E Billimoria Andheri": "Excavation & Civil Work",

  "Welspun": "Piling, Anchoring & Excavation Work",

  "Breach Candy Hospital": "Shore Piling & Rock Anchors",

  "Verve Greens": "Shore Piling, Rock Anchors & Excavation Work",

  "Piramal Mahalaxmi": "Civil & Infra Work",

  "HCC Jammu": "Foundation & Slop Stablization Work",

  "Prestige mulund": "Excavation",

  "L & T Forest Hill": "Excavation",

  "Prestige Estates": "Piling, Anchoring & Excavation Work",

  "Piramal Estates": "Civil & Infra Work",

  "Kasturi Chirabazar": "Piling, Anchoring & Excavation Work",

  "Raymond Bandra Site": "Excavation Work",

  "Sayba Spaces": "Anchoring & Excavation Work"

};



export const projectData = Object.keys(projectsMap).map((folderName) => {

  const name = nameMapping[folderName] || folderName;

  return {

    title: titleMapping[folderName] || folderName,

    name: name,

    value: valueMapping[name] || '',

    images: projectsMap[folderName],

    scope: scopeMapping[folderName] || '' // Add scope to project data

  };

}).sort((a, b) => b.images.length - a.images.length);
