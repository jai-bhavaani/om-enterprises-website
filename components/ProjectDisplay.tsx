// components/ProjectDisplay.tsx
import React from 'react';
import { projectData } from '../projects.config'; // Adjust path as necessary

const ProjectDisplay: React.FC = () => {
  return (
    <div className="projects-container">
      <h1>Our Projects</h1>
      {projectData.map((project, index) => (
        <section key={index} className="project-section">
          <h2>{project.title}</h2>
          <div className="image-grid">
            {project.images.map((imagePath, imgIndex) => (
              <div key={imgIndex} className="image-item">
                <img src={imagePath} alt={`${project.title} - ${imgIndex + 1}`} style={{ maxWidth: '100%', height: 'auto' }} />
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
};

export default ProjectDisplay;
