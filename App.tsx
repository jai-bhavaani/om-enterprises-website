import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Navbar } from './components/Navbar';
import { HeroCarousel, HeroCarouselItem } from './components/HeroCarousel';
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
import { Contact } from './components/Contact';
import { MachinerySection } from './components/MachinerySection';
import { AdminRoutes } from './src/admin/AdminRoutes';
import { ThemeProvider } from './src/context/ThemeContext';
import { useHeroSlides, useProjects } from './src/hooks/useCMS';
import { Award, Users, ShieldCheck } from 'lucide-react';
import teamLegacyLocal from '@/assets/images/om_team_legacy.jpg';

// OM Enterprises & Edilite Construction Team & Leadership - A Legacy of Strength
const omTeamLegacyImg = 'https://cuorugoykxvkldyztiin.supabase.co/storage/v1/object/public/media/team/om_team_legacy.jpg';



// Component for the main home page content
const HomeContent: React.FC = () => {
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxImages, setLightboxImages] = useState<string[]>([]);
  const [initialImageIndex, setInitialImageIndex] = useState(0);

  // Consume slides directly from Admin CMS (with responsive desktop & mobile art direction)
  const { slides: heroSlides } = useHeroSlides();
  const { projects: liveProjects } = useProjects();

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
        <HeroCarousel items={heroSlides} />



        {/* Projects Grid Section */}
        <section id="projects" className="scroll-mt-28 py-20 px-4 bg-background relative overflow-hidden">
          {/* Background Grid */}
          <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none"></div>

          <div className="max-w-7xl mx-auto relative z-10">
            <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
              <div>
                <span className="font-body text-safety text-xs uppercase tracking-widest mb-2 block">Our Portfolio</span>
                <h2 className="font-header text-5xl md:text-6xl uppercase font-bold text-text-primary">Project Spotlights</h2>
              </div>
              {/* Standalone View All Projects link */}
              <Link to="/projects">
                <Button label="View All Projects" variant={ButtonVariant.OUTLINE} />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {(() => {
                const sourceProjects = liveProjects.length > 0 ? liveProjects : projectData;
                let homepageProjects = sourceProjects.slice(0, 4);
                const vjtfBorivaliIndex = homepageProjects.findIndex(p => p.title === "VJTF Borivali");

                if (vjtfBorivaliIndex !== -1) {
                  const ltForestHillProject = sourceProjects.find(p => p.title === "L&T Forest Hill");
                  if (ltForestHillProject) {
                    homepageProjects[vjtfBorivaliIndex] = ltForestHillProject;
                  }
                }
                return homepageProjects.map((project, i) => (
                  <Link
                    key={project.id || i}
                    to={`/projects?project=${encodeURIComponent(project.title)}`}
                    className="group relative h-80 sm:h-96 rounded-xl bg-slate-900 border border-border-subtle overflow-hidden cursor-pointer shadow-md hover:shadow-2xl hover:border-safety/60 transition-all duration-300 block"
                    title={`View technical specifications and case study for ${project.title}`}
                  >
                    <ImageWithFallback
                      src={project.images[0]}
                      fallbackSrc="https://placehold.co/800x600/png?text=Project+Image"
                      alt={project.title}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                    {/* Rich cinematic gradient overlay for perfect contrast in both light and dark mode */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-transparent transition-opacity duration-300"></div>

                    {/* Subtle top vignette for depth */}
                    <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/40 to-transparent pointer-events-none"></div>

                    {/* Scope & Contract Value badges */}
                    <div className="absolute top-4 inset-x-4 z-10 flex items-center justify-between pointer-events-none">
                      {project.scope ? (
                        <span className="font-mono text-xs uppercase tracking-wider px-2.5 py-1 rounded bg-black/60 backdrop-blur-md text-white/90 border border-white/20 shadow-sm">
                          {project.scope.split(',')[0]}
                        </span>
                      ) : <div />}
                      {((project as any).contractValue || (project as any).project_value) && (
                        <span className="font-mono text-xs font-bold px-2.5 py-1 rounded bg-safety text-black shadow-md">
                          {(project as any).contractValue || (project as any).project_value}
                        </span>
                      )}
                    </div>

                    <div className="absolute bottom-0 left-0 w-full p-6 sm:p-8 z-10">
                      <div className="flex justify-between items-end gap-4">
                        <div className="flex-1">
                          <h3 className="font-header text-2xl sm:text-3xl text-white uppercase tracking-wide group-hover:text-safety transition-colors drop-shadow-sm">
                            {project.title}
                          </h3>
                          {project.scope && (
                            <p className="font-body text-slate-200 text-sm sm:text-base mt-1.5 font-medium line-clamp-1 drop-shadow-xs">
                              {project.scope}
                            </p>
                          )}
                          <span className="inline-flex items-center gap-1.5 text-xs font-mono text-safety font-bold uppercase tracking-wider mt-2 group-hover:translate-x-1 transition-transform">
                            <span>View Technical Dossier</span>
                            <span>→</span>
                          </span>
                        </div>
                        <div className="w-10 h-10 rounded-lg border border-white/30 bg-black/40 backdrop-blur-md flex items-center justify-center text-white group-hover:bg-safety group-hover:border-safety group-hover:text-[var(--color-safety-text)] transition-all flex-shrink-0">
                          ↗
                        </div>
                      </div>
                    </div>
                  </Link>
                ));
              })()} 
            </div>
          </div>
        </section>



        {/* Services Section */}
        <section id="services" className="scroll-mt-28 py-20 px-4 bg-surface-subtle relative border-t border-border-subtle">
          {/* Pattern overlay */}
          <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none"></div>

          <div className="max-w-7xl mx-auto">
            <div className="mb-10 relative z-10 text-center">
              <h3 className="font-header text-4xl text-text-primary uppercase mb-4">Our Core Services</h3>
              <p className="font-body text-text-secondary text-sm">Deploying advanced engineering solutions.</p>
            </div>

            <div className="flex overflow-x-auto lg:grid lg:grid-cols-4 gap-6 relative z-10 pb-6 lg:pb-0 no-scrollbar">
              {services.map((service) => (
                <div key={service.id} className="flex-shrink-0 w-80 sm:w-84 lg:w-auto h-full">
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

        {/* Heavy Plant & Machinery Arsenal (Owned Fleet Showcase) */}
        <MachinerySection />

        {/* About Section - Redesigned for Visual Storytelling */}
        <section id="about" className="scroll-mt-28 py-20 px-4 bg-surface/30 border-t border-border-subtle">
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
                  <h2 className="font-header text-5xl md:text-7xl uppercase font-bold text-text-primary mb-8 leading-normal">
                    A Legacy of <br /><span className="text-text-secondary">Strength</span>
                  </h2>
                </TextReveal>

                <TextReveal>
                  <p className="font-body text-text-secondary text-base md:text-lg max-w-xl leading-relaxed mb-3">
                    For over 20 years, OM Enterprises has delivered reliable civil and foundational engineering solutions, enabling architects and developers to build complex projects with confidence.</p>
                </TextReveal>

                {/* Animated Stats */}
                <div className="grid grid-cols-2 gap-6 border-t border-border-subtle pt-3">
                  {stats.map((stat, i) => (
                    <div key={i} className="group">
                      <div className="font-header text-4xl md:text-5xl text-text-primary font-bold mb-1 group-hover:text-safety transition-colors">
                        <CountUp end={stat.value} suffix={stat.suffix} />
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-px w-4 bg-safety group-hover:w-8 transition-all duration-300"></div>
                        <div className="font-body text-xs text-text-secondary uppercase tracking-widest">{stat.label}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Side: Visual Storytelling Team Legacy Image */}
              <div className="lg:w-7/12 w-full">
                <figure className="relative">
                  <div className="w-full aspect-[4/3] sm:aspect-[16/11] lg:h-[500px] rounded-2xl overflow-hidden bg-background border-2 border-border-subtle shadow-2xl relative group">
                    <img
                      src={omTeamLegacyImg}
                      onError={(e) => {
                        // Fallback to bundled local asset if offline
                        (e.target as HTMLImageElement).src = teamLegacyLocal;
                      }}
                      alt="OM Enterprises and Edilite Construction Leadership & Field Engineering Team"
                      className="w-full h-full object-cover object-top sm:object-center group-hover:scale-102 transition-transform duration-700"
                    />

                    {/* Established Badge */}
                    <div className="absolute top-4 left-4 bg-safety text-[var(--color-safety-text)] font-header text-xs uppercase tracking-wider px-3.5 py-1.5 font-bold rounded-lg shadow-lg flex items-center gap-1.5">
                      <Award className="w-3.5 h-3.5" />
                      <span>EST. 2004 • 20+ Years Legacy</span>
                    </div>

                    {/* Bottom Caption Pill Strip */}
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-4 sm:p-5 flex flex-col sm:flex-row sm:items-end justify-between gap-2 text-white">
                      <div>
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-safety" />
                          <span className="font-header text-sm sm:text-base font-bold uppercase tracking-wide">
                            OM Enterprises & Edilite Construction Family
                          </span>
                        </div>
                        <p className="text-xs text-slate-300 font-body mt-0.5">
                          Proprietor, Project Incharges, Site Engineers & Geotechnical Supervisors
                        </p>
                      </div>

                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/10 backdrop-blur-md border border-white/15 text-[11px] font-mono text-safety font-bold whitespace-nowrap">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>200+ Core Workforce</span>
                      </div>
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

        <section id="contact" className="scroll-mt-28">
          <Contact />
        </section>

      </main>

      <footer className="footer-reveal border-t border-border-subtle bg-surface-subtle pt-16 pb-12 px-4">
        <div className="max-w-7xl mx-auto space-y-12">
          {/* Top Row: Corporate Identity & Direct Inquiries */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 pb-10 border-b border-border-subtle">
            <div className="lg:col-span-5 space-y-3">
              <span className="font-header text-xl sm:text-2xl uppercase font-bold text-text-primary tracking-wide block">
                OM ENTERPRISES
              </span>
              <p className="font-body text-xs text-safety uppercase tracking-widest font-mono">
                Civil Engineering Construction Contractors &bull; Edilite Constructions
              </p>
              <p className="font-body text-xs text-text-secondary leading-relaxed max-w-md">
                Specialized B2B heavy civil substructure, deep multi-tier basement rock excavation, contiguous bored piling, and prestressed rock anchoring contractor delivering landmark developments across Mumbai for over two decades.
              </p>
            </div>

            <div className="lg:col-span-4 space-y-2 text-xs">
              <span className="font-mono text-xs uppercase tracking-widest text-text-secondary font-bold block mb-1">
                Headquarters & Registered Office
              </span>
              <p className="text-text-primary leading-relaxed font-body">
                412, B2B Agrawal Centre, D’Monte Lane, Kanchpada, Malad West, Mumbai – 400064, Maharashtra, India.
              </p>
              <p className="text-text-secondary pt-1 font-mono">
                Office Hours: Monday – Saturday, 9:00 AM – 7:00 PM
              </p>
            </div>

            <div className="lg:col-span-3 space-y-2 text-xs">
              <span className="font-mono text-xs uppercase tracking-widest text-safety font-bold block mb-1">
                Tenders & Contracts Desk
              </span>
              <p className="text-text-primary font-bold font-header text-sm">
                Mr. Ashok Kumar Pal (Proprietor)
              </p>
              <a
                href="tel:+919930900048"
                className="font-mono text-text-secondary hover:text-safety transition-colors block"
              >
                Mob: +91 99309 00048
              </a>
              <a
                href="mailto:omenterprise20@gmail.com"
                className="font-mono text-text-secondary hover:text-safety transition-colors block"
              >
                omenterprise20@gmail.com
              </a>
            </div>
          </div>

          {/* Middle Row: Statutory Registrations & Legal Verification (Report Benchmark) */}
          <div className="bg-surface/50 border border-border-subtle rounded-xl p-5">
            <span className="text-[10px] font-mono uppercase tracking-widest text-text-secondary block mb-3 font-bold">
              Government Registrations & Statutory Accreditations
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 text-xs font-mono">
              <div className="p-2 rounded bg-surface border border-border-subtle">
                <span className="text-[9px] text-text-secondary uppercase block">GSTIN (Maharashtra)</span>
                <span className="text-[11px] font-bold text-text-primary block mt-0.5">27ANBPP0974C1Z5</span>
              </div>
              <div className="p-2 rounded bg-surface border border-border-subtle">
                <span className="text-[9px] text-text-secondary uppercase block">PAN No.</span>
                <span className="text-[11px] font-bold text-text-primary block mt-0.5">ANBPP0974C</span>
              </div>
              <div className="p-2 rounded bg-surface border border-border-subtle">
                <span className="text-[9px] text-text-secondary uppercase block">ISO Quality Standard</span>
                <span className="text-[11px] font-bold text-safety block mt-0.5">ISO 9001:2015</span>
              </div>
              <div className="p-2 rounded bg-surface border border-border-subtle">
                <span className="text-[9px] text-text-secondary uppercase block">MSME Udyam</span>
                <span className="text-[11px] font-bold text-text-primary block mt-0.5">UDYAM-MH-19-0080669</span>
              </div>
              <div className="p-2 rounded bg-surface border border-border-subtle">
                <span className="text-[9px] text-text-secondary uppercase block">EPFO Registration</span>
                <span className="text-[11px] font-bold text-text-primary block mt-0.5">KDMAL1600126000</span>
              </div>
              <div className="p-2 rounded bg-surface border border-border-subtle">
                <span className="text-[9px] text-text-secondary uppercase block">ESIC Registration</span>
                <span className="text-[11px] font-bold text-text-primary block mt-0.5">35000403150001099</span>
              </div>
            </div>
          </div>

          {/* Bottom Row: Copyright & Admin Portal */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4 border-t border-border-subtle text-xs text-text-secondary font-mono">
            <div>
              &copy; {new Date().getFullYear()} OM ENTERPRISES &bull; Edilite Constructions. All Rights Reserved.
            </div>
            <div className="flex items-center gap-6">
              <span className="text-[10px] text-text-muted">IS 2911 &bull; IS 10270 &bull; BS 8081 Compliant</span>
              <Link
                to="/admin/login"
                className="text-[11px] text-text-muted hover:text-safety transition-colors uppercase tracking-wider font-bold"
              >
                OM Admin &rarr;
              </Link>
            </div>
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
  const [showSplash, setShowSplash] = useState(true);

  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background text-text-primary relative selection:bg-safety selection:text-[var(--color-safety-text)] transition-colors duration-300">
        <AnimatePresence>
          {showSplash && (
            <SplashScreen
              key="splash-screen"
              onComplete={handleSplashComplete}
            />
          )}
        </AnimatePresence>

        <div className="relative z-10">
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<HomeContent />} />
              <Route path="/projects" element={<ProjectsPage />} />
              <Route path="/admin/*" element={<AdminRoutes />} />
            </Routes>
          </BrowserRouter>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default App;
