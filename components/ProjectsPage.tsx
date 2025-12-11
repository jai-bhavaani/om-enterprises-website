// components/ProjectsPage.tsx
import React, { useState } from 'react'; // Import useState
import { Navbar } from './Navbar';
import { ProjectLightbox } from './ProjectLightbox'; // Import ProjectLightbox (assuming path is correct)
import { ImageWithFallback } from './ImageWithFallback'; // Import ImageWithFallback

import { projectData as projects } from '../projects.config'; // Use dynamic project data

export const ProjectsPage: React.FC = () => {
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxImages, setLightboxImages] = useState<string[]>([]);
  const [initialImageIndex, setInitialImageIndex] = useState(0);

  // State for filtering
  const [activeFilter, setActiveFilter] = useState('All');

  // Get unique scopes for filter buttons
  const allScopes = React.useMemo(() => ['All', ...new Set(projects.map(p => p.scope).filter(Boolean))], []);

  // Filter and sort projects
  const filteredProjects = React.useMemo(() => {
    const sorted = [...projects].sort((a, b) => (b.images?.length || 0) - (a.images?.length || 0));
    if (activeFilter === 'All') return sorted;
    return sorted.filter(p => p.scope === activeFilter);
  }, [activeFilter]);

  const openLightbox = (images: string[], index: number) => {
    setLightboxImages(images);
    setInitialImageIndex(index);
    setIsLightboxOpen(true);
  };

  const closeLightbox = () => {
    setIsLightboxOpen(false);
    setLightboxImages([]);
    setInitialImageIndex(0);
  };

  return (
    <> {/* Use React Fragment to wrap top-level elements */}
      <div className="min-h-screen bg-background text-slate-50 relative selection:bg-safety selection:text-black">
        <Navbar />
        
        <main className="relative z-10 flex flex-col pt-32">
          <section className="py-8 px-4 sm:py-12 sm:px-6 lg:py-16 lg:px-8 bg-surface/20">
            <div className="max-w-7xl mx-auto">
              <h1 className="font-header text-4xl sm:text-5xl md:text-6xl uppercase font-bold text-white mb-8 text-center">
                Our Projects
              </h1>

              {/* Filter Buttons */}
              <div className="flex justify-center flex-wrap gap-3 mb-12">
                {allScopes.map(scope => (
                  <button
                    key={scope}
                    onClick={() => setActiveFilter(scope)}
                    className={`px-4 py-2 rounded-full font-body text-sm font-semibold transition-colors duration-300 ${
                      activeFilter === scope
                        ? 'bg-safety text-background'
                        : 'bg-slate-800 text-concrete-light hover:bg-slate-700'
                    }`}
                  >
                    {scope}
                  </button>
                ))}
              </div>

              {filteredProjects.map((project, projectIndex) => (
                <div key={projectIndex} className="mb-12 md:mb-16 p-4 md:p-6 border border-slate-800 rounded-lg bg-surface/30"> {/* Container for each project */}
                  <div className="text-center md:text-left mb-8">
                    <h2 className="font-header text-3xl sm:text-4xl uppercase font-bold text-white mb-2">
                      {project.title}
                    </h2>
                    {project.scope && <p className="font-body text-concrete-light text-base sm:text-lg mb-2">{project.scope}</p>}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                    {project.images.map((imagePath, imageIndex) => (
                      <div
                        key={imageIndex}
                        className="relative aspect-video bg-surface border border-slate-800 overflow-hidden rounded-lg cursor-pointer" // Add cursor-pointer
                        onClick={() => openLightbox(project.images, imageIndex)} // Call openLightbox on click
                      >
                        <ImageWithFallback // Replaced img with ImageWithFallback
                          src={imagePath}
                          alt={`${project.title} - Image ${imageIndex + 1}`}
                          fallbackSrc={""} // Empty string as fallback to effectively remove placeholder
                          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              {/* Empty State for Filters */}
              {filteredProjects.length === 0 && (
                <div className="text-center py-16">
                  <p className="font-body text-concrete-light text-lg">No projects found for the selected category.</p>
                </div>
              )}
            </div>
          </section>
        </main>
      </div>

      {isLightboxOpen && lightboxImages.length > 0 && (
        <ProjectLightbox
          images={lightboxImages}
          initialImageIndex={initialImageIndex}
          onClose={closeLightbox}
        />
      )}
    </>
  );
};