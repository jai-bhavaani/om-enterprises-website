
const fs = require('fs');
const path = require('path');

// 1. Scan directories
const projectsDir = path.join('src', 'assets', 'projects');
const scannedProjects = {}; // FolderName -> [ImagePaths]

if (fs.existsSync(projectsDir)) {
    const folders = fs.readdirSync(projectsDir, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name);

    folders.forEach(folder => {
        const folderPath = path.join(projectsDir, folder);
        const files = fs.readdirSync(folderPath)
            .filter(file => /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(file))
            .map(file => `/src/assets/projects/${folder}/${file}`); // construct web-friendly path
        
        if (files.length > 0) {
            scannedProjects[folder] = files;
        }
    });
}

// 2. Dynamically load existing projects from projects.ts
const projectsFile = path.join('src', 'data', 'projects.ts');
let fileContent = fs.readFileSync(projectsFile, 'utf8');

// Extract the array part and parse it
let existingProjects = [];
const startMarker = "export const projects = ";
const startIndex = fileContent.indexOf(startMarker);
if (startIndex !== -1) {
    const jsonString = fileContent.substring(startIndex + startMarker.length, fileContent.lastIndexOf(';')).trim();
    try {
        existingProjects = JSON.parse(jsonString);
    } catch (e) {
        console.error("Error parsing existing projects.ts:", e);
        process.exit(1);
    }
}


// Helper to find matching existing project
function findMatchingProject(folderName) {
    // 1. Direct match by checking if existing project uses this folder in its images
    const directMatch = existingProjects.find(p => 
        p.images.some(img => img.includes(`/src/assets/projects/${folderName}/`))
    );
    if (directMatch) return directMatch;

    // 2. Loose match for "Welspun"
    if (folderName === 'Welspun') {
         return existingProjects.find(p => p.title === "Welspun Thane");
    }
    
    return null;
}

const finalProjects = [];
const processedFolders = new Set();
const processedExistingProjects = new Set();

// Iterate through scanned folders
for (const [folderName, images] of Object.entries(scannedProjects)) {
    const existing = findMatchingProject(folderName);
    
    if (existing) {
        // Update existing project
        finalProjects.push({
            ...existing,
            images: images // Use ALL scanned images
        });
        processedExistingProjects.add(existing);
    } else {
        // Create new project
        finalProjects.push({
            title: folderName, // Use folder name as title
            name: folderName, // Default name
            value: "", // No value
            images: images,
            scope: "" // No scope
        });
    }
    processedFolders.add(folderName);
}

// Add remaining existing projects that weren't matched to a folder (e.g., those using single src/assets/images or other specific cases)
existingProjects.forEach(p => {
    if (!processedExistingProjects.has(p)) {
        finalProjects.push(p);
    }
});

// Output the result
console.log("export const projects = " + JSON.stringify(finalProjects, null, 2) + ";");
