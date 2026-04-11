import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import BackgroundVideo from './components/BackgroundVideo';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Manifesto from './components/Manifesto';
import Portfolio from './components/Portfolio';
import ProjectDetail from './components/ProjectDetail';
import Contact from './components/Contact';
import Meet from './components/Meet';
import Admin from './components/Admin';
import projectsData from './data/projects.json';
import './index.css';

function App() {
  const [currentView, setCurrentView] = useState('home'); // home, manifesto, projects, contact, project-detail, meet, admin
  const [selectedProject, setSelectedProject] = useState(null);

  // Check simple routing for Admin
  // Check simple routing for Admin
  React.useEffect(() => {
    // Check if path starts with /admin (handles /admin and /admin/)
    if (window.location.pathname.startsWith('/admin')) {
      setCurrentView('admin');
    }
  }, []);

  React.useEffect(() => {
    // We only need browser scroll for Manifesto scrollytelling
    if (currentView === 'manifesto') {
      document.body.style.overflowY = 'scroll';
      document.body.style.overflowX = 'hidden';
    } else {
      document.body.style.overflow = 'hidden';
      window.scrollTo(0, 0);
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [currentView]);

  const handleProjectSelect = (project) => {
    setSelectedProject(project);
    setCurrentView('project-detail');
  };

  const handleBackToPortfolio = () => {
    setCurrentView('projects');
  };

  return (
    <div style={{
      color: '#fff',
      height: currentView === 'manifesto' ? 'auto' : '100dvh', // Use 100dvh for mobile support
      width: '100vw',
      position: 'relative',
      overflow: currentView === 'manifesto' ? 'visible' : 'hidden' // Key fix for scroll propagation
    }}>
      <BackgroundVideo src="/background.webm" />

      {currentView !== 'meet' && <Navbar setView={setCurrentView} />}

      <main style={{
        width: '100%',
        height: currentView === 'manifesto' ? 'auto' : '100%',
        position: 'relative'
      }}>
        <AnimatePresence mode="wait">
          {currentView === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
              style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1 }}
            >
              <Hero onCtaClick={() => setCurrentView('projects')} />
            </motion.div>
          )}

          {currentView === 'manifesto' && (
            <motion.div
              key="manifesto"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              style={{ width: '100%', position: 'relative', zIndex: 1 }}
            >
              <Manifesto />
            </motion.div>
          )}

          {currentView === 'projects' && (
            <motion.div
              key="projects"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1 }}
            >
              <Portfolio onProjectSelect={handleProjectSelect} />
            </motion.div>
          )}

          {currentView === 'contact' && (
            <motion.div
              key="contact"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
              style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1 }}
            >
              <Contact />
            </motion.div>
          )}

          {currentView === 'project-detail' && selectedProject && (
            <motion.div
              key="project-detail"
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 9999 }}
            >
              <ProjectDetail project={selectedProject} projects={projectsData} onSelectProject={handleProjectSelect} onBack={handleBackToPortfolio} />
            </motion.div>
          )}

          {currentView === 'meet' && (
            <motion.div
              key="meet"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
              style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 2000 }}
            >
              <Meet setCurrentView={setCurrentView} />
            </motion.div>
          )}

          {currentView === 'admin' && (
            <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 9999 }}>
              <Admin />
            </div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

export default App;
