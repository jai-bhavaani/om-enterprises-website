import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Button } from './components/Button';
import { ButtonVariant } from './types';
import { ServiceCard } from './components/ServiceCard';
import { Timeline } from './components/Timeline';
import { ClientSection } from './components/ClientSection';
import TextReveal from './components/TextReveal';
import CountUp from './components/CountUp';
import { WhyChooseUs } from './components/WhyChooseUs';
import { KineticDivider } from './components/KineticDivider';
import { ImageWithFallback } from './components/ImageWithFallback';
import { SplashScreen } from './components/SplashScreen';
import { LeadershipSection } from './components/LeadershipSection';
import { ProjectLightbox } from './components/ProjectLightbox'; // Import ProjectLightbox
import { ProjectsPage } from './components/ProjectsPage'; // Corrected import
import { stats, services } from './data';
import { projectData } from './projects.config'; // New import for structured project data
// import { projects } from './src/data/projects'; // Old import
// import { Project } from './types'; // Project interface might not be needed if not defining new types for projectData

import AshirwadBunglowImage2 from './src/assets/projects/Ashirwad Bunglow/IMG-20160625-WA0010.jpg'; // Import Ashirwad Bunglow Image 2

import { CarouselItem } from './components/ImageCarousel';

// Component for the main home page content
const HomeContent: React.FC = () => {
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxImages, setLightboxImages] = useState<string[]>([]);
  const [initialImageIndex, setInitialImageIndex] = useState(0);

  // Logic to select random images for the Hero section
  const potentialHeroItems: CarouselItem[] = [];
  projectData.forEach(project => {
    if (project.images && project.images.length > 0) {
      // Pick one random image from the project
      const randomImage = project.images[Math.floor(Math.random() * project.images.length)];
      potentialHeroItems.push({ src: randomImage, title: project.title, scope: project.scope });
    }
  });

  // Shuffle the collected images and take up to 10
  const selectedHeroItems = potentialHeroItems.sort(() => 0.5 - Math.random()).slice(0, 10);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
  }, []);

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
    <>
      <Navbar />
      
      <main className="relative z-10 flex flex-col">
        <Hero heroCarouselItems={selectedHeroItems} />
        

        
        {/* Projects Grid Section */}
        <section id="projects" className="scroll-mt-28 py-20 px-4 bg-background relative overflow-hidden">
          {/* Background Grid */}
          <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none"></div>

          <div className="max-w-7xl mx-auto relative z-10">
             <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                <div>
                   <span className="font-body text-safety text-xs uppercase tracking-widest mb-2 block">Our Portfolio</span>
                   <h2 className="font-header text-5xl md:text-6xl uppercase font-bold text-white">Project Spotlights</h2>
                </div>
                {/* Remove Link to="/projects" and ensure button is standalone */}
                <Link to="/projects">
                  <Button label="View All Projects" variant={ButtonVariant.OUTLINE} />
                </Link>
             </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                             {(() => {
                               let homepageProjects = projectData.slice(0, 4);
                               const vjtfBorivaliIndex = homepageProjects.findIndex(p => p.title === "VJTF Borivali");
                               
                               if (vjtfBorivaliIndex !== -1) {
                                 const ltForestHillProject = projectData.find(p => p.title === "L&T Forest Hill");
                                 if (ltForestHillProject) {
                                   homepageProjects[vjtfBorivaliIndex] = ltForestHillProject;
                                 }
                               }
                               return homepageProjects.map((project, i) => ( // Display a subset for spotlights, e.g., first 4
                                 <div
                                   key={i}
                                   className="group relative h-80 bg-surface border border-slate-800 overflow-hidden cursor-pointer"
                                   onClick={() => openLightbox(project.images, 0)} // Open lightbox on card click
                                 >
                                    <ImageWithFallback
                                     src={project.images[0]} // Use first image from the array
                                     fallbackSrc="https://placehold.co/800x600/png?text=Project+Image"
                                     alt={project.title}
                                     className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-50"
                                   />
                                    <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent"></div>
                                    
                                    <div className="absolute bottom-0 left-0 w-full p-8">
                                       <div className="flex justify-between items-end">
                                          <div>
                                             {/* Removed id and status as they are not in the new projectData structure */}
                                             <h3 className="font-header text-3xl text-white uppercase">{project.title}</h3>
                               {project.scope && <p className="font-body text-concrete-light text-base mt-1">{project.scope}</p>}
                                             {/* Removed client as it is not in the new projectData structure */}
                                          </div>
                                          <div className="w-10 h-10 border border-white/20 flex items-center justify-center text-white group-hover:bg-safety group-hover:text-black group-hover:border-safety transition-all">
                                             ↗
                                          </div>
                                       </div>
                                    </div>
                                 </div>
                               ));
                             })()}             </div>
          </div>
        </section>

        

        {/* Services Section */}
        <section id="services" className="scroll-mt-28 py-20 px-4 bg-slate-900 relative">
           {/* Pattern overlay */}
           <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none"></div>

           <div className="max-w-7xl mx-auto">
             <div className="mb-10 relative z-10 text-center">
               <h3 className="font-header text-4xl text-white uppercase mb-4">Our Core Services</h3>
               <p className="font-body text-concrete text-sm">Deploying advanced engineering solutions.</p>
             </div>

             <div className="flex overflow-x-auto gap-6 relative z-10 pb-8 -mb-8">
               {services.map((service) => (
                 <div key={service.id} className="flex-shrink-0 w-80">
                   <ServiceCard 
                     id={service.id}
                     title={service.title}
                     desc={service.desc}
                     type={service.type}
                   />
                 </div>
               ))}
             </div>
           </div>
        </section>

        
        {/* About Section - Redesigned for Visual Storytelling (Fixed) */}
        <section id="about" className="scroll-mt-28 py-20 px-4 bg-surface/20 border-t border-slate-800">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">

              {/* Left Side: Story & Stats */}
              <div className="w-full lg:w-5/12 relative flex flex-col justify-center">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-2 h-2 bg-safety"></div>
                  <TextReveal>
                    <span className="font-body text-safety text-sm uppercase tracking-widest">About Us</span>
                  </TextReveal>
                </div>
                
                <TextReveal>
                  <h2 className="font-header text-5xl md:text-7xl uppercase font-bold text-white mb-8 leading-normal">
                    A Legacy of <br/><span className="text-steel-cut">Strength</span>
                  </h2>
                </TextReveal>

                <TextReveal>
                  <p className="font-body text-concrete-light text-base md:text-lg max-w-xl leading-relaxed mb-3">
                    For over 20 years, OM Enterprises has delivered reliable civil and foundational engineering solutions, enabling architects and developers to build complex projects with confidence.</p>
                </TextReveal>

                {/* Animated Stats */}
                <div className="grid grid-cols-2 gap-6 border-t border-slate-700/50 pt-3">
                  {stats.map((stat, i) => (
                    <div key={i} className="group">
                        <div className="font-header text-4xl md:text-5xl text-white font-bold mb-1 group-hover:text-safety transition-colors">
                          <CountUp end={stat.value} suffix={stat.suffix} />
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="h-px w-4 bg-safety group-hover:w-8 transition-all duration-300"></div>
                          <div className="font-body text-xs text-concrete-light uppercase tracking-widest">{stat.label}</div>
                        </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Side: Visual Storytelling Image */}
              <div className="lg:w-7/12 w-full">
                <figure>
                  <div className="h-96 lg:h-[500px] bg-background border-2 border-slate-800 relative">
                    <img 
                      src={AshirwadBunglowImage2}
                      alt="Ashirwad Bunglow Project Image"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 left-4 bg-safety text-background font-body text-xs uppercase tracking-widest px-3 py-1">
                      EST. 2004
                    </div>
                  </div>
                </figure>
              </div>

            </div>
          </div>
        </section>

        

        <WhyChooseUs />

        {/* Timeline Section */}
        <section id="timeline" className="scroll-mt-28">
          <Timeline />
        </section>

        <section id="team" className="scroll-mt-28">
          <LeadershipSection />
        </section>

        <section id="clients" className="scroll-mt-28">
          <ClientSection />
        </section>

        <section id="contact" className="scroll-mt-28 py-20 px-4 text-center bg-background border-t border-slate-800">
          <div className="text-center">
            <h3 className="font-header text-3xl uppercase font-bold text-white mb-4">Contact Us Directly</h3>
            <p className="font-body text-concrete/80 text-lg mb-8">For immediate consultation, contact our project director directly.</p>
            <div className="flex flex-col md:flex-row justify-center gap-6 md:gap-12 font-body text-base text-concrete">
              <div>
                  <span className="block text-xs text-safety uppercase tracking-widest mb-1">Email</span>
                  omenterprise20@gmail.com
              </div>
              <div>
                  <span className="block text-xs text-safety uppercase tracking-widest mb-1">Phone</span>
                  +91-022-49697792
              </div>
              <div>
                  <span className="block text-xs text-safety uppercase tracking-widest mb-1">HQ</span>
                  Mumbai, Maharashtra
              </div>
            </div>
          </div>
        </section>

              </main>

        <footer className="footer-reveal border-t border-slate-800 bg-background py-8 px-4">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="font-header text-sm uppercase tracking-widest text-concrete">
              OM ENTERPRISES <span className="text-safety">©2025</span>
            </div>
            <div className="font-body text-[10px] text-slate-600 uppercase tracking-widest">
              Foundation & Civil Engineering Specialists
            </div>
          </div>
        </footer>

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

// Main App component for routing and splash screen
const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Remove the initial HTML loader once the React app is mounted
    const initialLoader = document.getElementById('initial-loader');
    if (initialLoader) {
      initialLoader.style.transition = 'opacity 0.5s ease-out';
      initialLoader.style.opacity = '0';
      setTimeout(() => { // Keep a small timeout to allow opacity transition
        initialLoader.style.display = 'none';
        initialLoader.remove();
      }, 500);
    }

    // Simulate loading time and then hide splash screen
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <div className="min-h-screen bg-background text-slate-50 relative selection:bg-safety selection:text-black">
      <AnimatePresence>
        {isLoading && <SplashScreen key="splash-screen" isLoading={isLoading} />}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoading ? 0 : 1, transition: { delay: isLoading ? 1.5 : 0, duration: 0.5 } }}
        className="relative z-10"
      >
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomeContent />} />
            <Route path="/projects" element={<ProjectsPage />} /> {/* Added route for ProjectsPage */}
          </Routes>
        </BrowserRouter>
      </motion.div>
    </div>
  );
};

export default App;
