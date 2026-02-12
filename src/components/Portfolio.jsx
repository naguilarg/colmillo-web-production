import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import projectsData from '../data/projects.json';

const Portfolio = ({ onProjectSelect }) => {
    const [hoveredProject, setHoveredProject] = useState(null);
    const videoRefs = useRef({});

    // Dramatic Reveal Variants
    const containerVariants = {
        initial: { opacity: 0 },
        animate: {
            opacity: 1,
            transition: { staggerChildren: 0.1, delayChildren: 0.2 }
        }
    };

    const itemVariants = {
        initial: { y: 100, opacity: 0 },
        animate: {
            y: 0,
            opacity: 1,
            transition: { duration: 1, ease: [0.16, 1, 0.3, 1] }
        }
    };

    return (
        <motion.section
            variants={containerVariants}
            initial="initial"
            animate="animate"
            style={{
                position: 'relative',
                height: '100vh',
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                padding: '0 80px',
                overflow: 'hidden'
            }}
            className="portfolio-container"
        >
            <style>
                {`
                    @media (max-width: 768px) {
                        .portfolio-container {
                            padding: 100px 30px 40px !important; /* Increased top padding */
                        }
                        .project-item {
                            gap: 15px !important;
                            margin-bottom: 25px !important;
                        }
                        .project-title {
                            font-size: 1.8rem !important; /* Smaller titles */
                        }
                        .project-metadata {
                            opacity: 0.5 !important;
                            transform: translateX(0) !important;
                            font-size: 0.6rem !important;
                            margin-top: 5px !important;
                        }
                        .project-row {
                            flex-direction: column !important;
                            align-items: flex-start !important;
                            gap: 5px !important;
                        }
                        .bottom-hint {
                            left: 30px !important;
                            bottom: 40px !important;
                            font-size: 0.5rem !important;
                            max-width: 60% !important;
                        }
                    }
                `}
            </style>
            {/* Dynamic Background Video Overlay */}
            <AnimatePresence>
                {hoveredProject && (
                    <motion.div
                        key={hoveredProject.id}
                        initial={{ opacity: 0, scale: 1.05 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.8 }}
                        style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            width: '100vw',
                            height: '100vh',
                            zIndex: -1,
                            pointerEvents: 'none'
                        }}
                    >
                        <video
                            autoPlay
                            muted
                            loop
                            playsInline
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover'
                            }}
                            src={hoveredProject.video}
                        />
                        {/* Subtle dark overlay for readability while browsing labels */}
                        <div style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            background: 'rgba(0,0,0,0.4)'
                        }} />
                    </motion.div>
                )}
            </AnimatePresence>

            <div style={{ zIndex: 2 }}>
                {projectsData.map((project, index) => (
                    <motion.div
                        key={project.id}
                        variants={itemVariants}
                        className="project-item"
                        style={{
                            marginBottom: '15px',
                            display: 'flex',
                            alignItems: 'baseline',
                            gap: '40px',
                            cursor: 'pointer'
                        }}
                        onMouseEnter={() => setHoveredProject(project)}
                        onMouseLeave={() => setHoveredProject(null)}
                        onClick={() => onProjectSelect(project)}
                    >
                        <span style={{
                            fontSize: '0.8rem',
                            fontFamily: 'var(--font-mono)',
                            opacity: 0.4,
                            minWidth: '30px'
                        }}>
                            0{index + 1}
                        </span>

                        <div className="project-row" style={{ display: 'flex', alignItems: 'baseline', gap: '20px' }}>
                            <h2 className="project-title" style={{
                                fontSize: 'clamp(2rem, 6vw, 6rem)',
                                fontFamily: hoveredProject?.id === project.id ? 'var(--font-serif)' : 'var(--font-sans)',
                                textTransform: 'uppercase',
                                lineHeight: '1',
                                transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
                                opacity: hoveredProject && hoveredProject.id !== project.id ? 0.2 : 1,
                                fontStyle: hoveredProject?.id === project.id ? 'italic' : 'normal',
                                color: '#fff'
                            }}>
                                {project.title}
                            </h2>

                            {/* Categorization & Year Reveal */}
                            <motion.div
                                className="project-metadata"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{
                                    opacity: hoveredProject?.id === project.id ? 0.5 : 0,
                                    x: hoveredProject?.id === project.id ? 0 : -20
                                }}
                                style={{
                                    fontSize: '0.8rem',
                                    letterSpacing: '2px',
                                    textTransform: 'uppercase',
                                    whiteSpace: 'nowrap',
                                    color: '#fff'
                                }}
                            >
                                {project.category} | {project.year}
                            </motion.div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Bottom hint */}
            <motion.div
                className="bottom-hint"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.3 }}
                transition={{ delay: 1.5 }}
                style={{
                    position: 'absolute',
                    bottom: '80px',
                    left: '80px',
                    fontSize: '0.7rem',
                    textTransform: 'uppercase',
                    letterSpacing: '2px',
                    color: '#fff'
                }}
            >
                Seleccione un proyecto para ver los créditos
            </motion.div>
        </motion.section>
    );
};

export default Portfolio;
