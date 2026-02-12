import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';

const ProjectDetail = ({ project, onBack }) => {
    const videoRef = useRef(null);
    const [isLoading, setIsLoading] = useState(false); // Default to false for immediate visibility
    const [showDescription, setShowDescription] = useState(false);
    const [showCredits, setShowCredits] = useState(false);

    const toggleDescription = () => {
        setShowDescription(!showDescription);
        if (!showDescription) setShowCredits(false); // Close credits if opening description
    };

    const toggleCredits = () => {
        setShowCredits(!showCredits);
        if (!showCredits) setShowDescription(false); // Close description if opening credits
    };

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.play().catch(error => console.log("Autoplay failed:", error));
        }
    }, [project.video]);

    return (
        <div style={{
            width: '100%',
            height: '100vh',
            backgroundColor: '#000',
            position: 'relative',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            zIndex: 3000,
            color: '#fff' // Ensure all text is white by default
        }} className="project-detail-container">
            <style>
                {`
                    @media (max-width: 768px) {
                        .project-header {
                            padding: 100px 30px 20px !important;
                            text-align: center !important;
                        }
                        .project-header > div {
                            text-align: center !important;
                            width: 100%;
                        }
                        .project-title-text {
                            font-size: 2.2rem !important;
                        }
                        .project-video {
                            object-fit: cover !important;
                        }
                        .desktop-description {
                            display: none !important;
                        }
                        .desktop-credits {
                            display: none !important;
                        }
                        .mobile-controls {
                            display: flex !important;
                            flex-direction: row !important;
                            gap: 20px;
                            padding: 20px 30px;
                            background: transparent; /* Clean transparent background */
                            position: absolute;
                            bottom: 80px;
                            left: 0;
                            width: 100%;
                            z-index: 50;
                            justify-content: center;
                        }
                        .mobile-toggle-btn {
                            background: transparent;
                            border: none;
                            border-bottom: 1px solid rgba(255,255,255,0.3); /* Simple underline */
                            color: white;
                            padding: 5px 0;
                            text-transform: uppercase;
                            letter-spacing: 2px;
                            font-size: 0.7rem;
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            opacity: 0.8;
                        }
                        .mobile-toggle-btn.active {
                            border-bottom: 2px solid #fff;
                            opacity: 1;
                        }
                        .mobile-content-box {
                            position: absolute;
                            bottom: 100%;
                            left: 0;
                            width: 100%;
                            background: linear-gradient(to top, rgba(10,10,10,1) 0%, rgba(10,10,10,0.85) 70%, rgba(10,10,10,0) 100%);
                            padding: 40px 30px 20px;
                            font-size: 0.9rem;
                            line-height: 1.6;
                            border: none;
                        }
                        .mobile-credits-list {
                            display: grid !important;
                            grid-template-columns: 1fr 1fr;
                            gap: 20px 15px;
                        }
                        .project-footer {
                            padding: 15px 30px !important;
                            justify-content: center !important;
                        }
                        .footer-branding {
                            display: none !important; /* Hide on mobile as requested */
                        }
                        .project-header {
                            padding: 30px 20px !important;
                            gap: 15px !important;
                            top: 10px !important;
                        }
                        .back-btn {
                            position: relative !important;
                            margin-bottom: 5px !important;
                        }
                            flex-direction: column !important;
                            gap: 15px !important;
                            align-items: flex-start !important;
                        }
                        .project-footer-credits {
                            order: 1;
                        }
                        .project-footer-back {
                            order: 2;
                        }
                    }
                    @media (min-width: 769px) {
                        .mobile-controls {
                            display: none !important;
                        }
                    }
                `}
            </style>

            {/* 1. TOP HEADER (Titles) */}
            <div className="project-header" style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                padding: '120px 60px 40px',
                display: 'flex',
                justifyContent: 'flex-end',
                zIndex: 200, // Higher Z-index
                background: 'linear-gradient(to bottom, rgba(0,0,0,0.9) 0%, transparent 100%)',
                pointerEvents: 'none'
            }}>
                <div style={{ textAlign: 'right', pointerEvents: 'auto' }}>
                    <motion.h1
                        className="project-title-text"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={{
                            fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
                            fontFamily: 'var(--font-serif)',
                            textTransform: 'uppercase',
                            lineHeight: '1',
                            marginBottom: '5px',
                            color: '#fff'
                        }}
                    >
                        {project.title}
                    </motion.h1>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.6 }}
                        transition={{ delay: 0.3 }}
                        style={{
                            fontSize: '0.8rem',
                            letterSpacing: '4px',
                            textTransform: 'uppercase',
                            color: '#fff'
                        }}
                    >
                        {project.category} — {project.year}
                    </motion.div>
                </div>
            </div>

            {/* 2. DESCRIPTION BOX (Desktop only) */}
            <motion.div
                className="desktop-description"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8, duration: 1 }}
                style={{
                    position: 'absolute',
                    top: '50%',
                    right: '60px',
                    transform: 'translateY(-50%)',
                    maxWidth: '300px',
                    zIndex: 150, // Higher
                    textAlign: 'right'
                }}
            >
                <div style={{
                    background: 'rgba(255,255,255,0.05)',
                    backdropFilter: 'blur(20px)',
                    padding: '30px',
                    borderRight: '2px solid rgba(255,255,255,0.2)'
                }}>
                    <p style={{
                        fontSize: '0.9rem',
                        lineHeight: '1.6',
                        fontWeight: '300',
                        opacity: 0.9,
                        fontStyle: 'italic',
                        color: '#fff'
                    }}>
                        {project.description || "Proyecto cinematográfico desarrollado por Colmillo Studio, enfocado en la excelencia visual y narrativa."}
                    </p>
                </div>
            </motion.div>

            {/* 3. CENTRAL VIDEO CONTENT */}
            <div style={{
                flex: 1,
                width: '100%',
                position: 'relative',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                background: '#000',
                zIndex: 1 // Baseline
            }}>
                {isLoading && (
                    <div style={{ position: 'absolute', opacity: 0.6, fontSize: '0.6rem', letterSpacing: '3px', color: '#fff', zIndex: 10 }}>
                        LOADING...
                    </div>
                )}
                <video
                    ref={videoRef}
                    autoPlay
                    muted
                    loop
                    playsInline
                    onPlaying={() => setIsLoading(false)}
                    onLoadedData={() => setIsLoading(false)}
                    onCanPlay={() => setIsLoading(false)}
                    className="project-video"
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain',
                        opacity: 1, // Always visible for debugging
                        transition: 'opacity 1s ease',
                        backgroundColor: '#000'
                    }}
                    src={project.video}
                />
            </div>

            {/* MOBILE COLLAPSIBLE CONTROLS */}
            <div className="mobile-controls">
                <button
                    className={`mobile-toggle-btn ${showDescription ? 'active' : ''}`}
                    onClick={toggleDescription}
                >
                    Descripción
                </button>
                <button
                    className={`mobile-toggle-btn ${showCredits ? 'active' : ''}`}
                    onClick={toggleCredits}
                >
                    Créditos
                </button>

                <AnimatePresence>
                    {showDescription && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="mobile-content-box"
                        >
                            <div style={{ fontSize: '0.6rem', color: '#666', marginBottom: '10px', textTransform: 'uppercase' }}>Sinopsis</div>
                            {project.description}
                        </motion.div>
                    )}

                    {showCredits && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="mobile-content-box"
                        >
                            <div style={{ fontSize: '0.5rem', color: '#666', marginBottom: '15px', textTransform: 'uppercase', letterSpacing: '1px' }}>Créditos del Proyecto</div>
                            <div className="mobile-credits-list">
                                {(project.credits || []).map((credit, i) => (
                                    <div key={i}>
                                        <div style={{ fontSize: '0.45rem', opacity: 0.5, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '2px' }}>{credit.role}</div>
                                        <div style={{ fontSize: '0.75rem', color: '#fff' }}>{credit.name}</div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* 4. BOTTOM OVERLAY (Credits & Back) */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    width: '100%',
                    padding: '40px 60px 40px',
                    background: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.5) 60%, transparent 100%)',
                    zIndex: 20
                }}
            >
                <div className="desktop-credits" style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
                    gap: '15px 40px',
                    marginBottom: '30px',
                    maxWidth: '1200px'
                }}>
                    {(project.credits || []).slice(0, 10).map((credit, i) => (
                        <div key={i}>
                            <div style={{ fontSize: '0.5rem', textTransform: 'uppercase', letterSpacing: '2px', opacity: 0.4, marginBottom: '2px', color: '#fff' }}>
                                {credit.role}
                            </div>
                            <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px', opacity: 0.9, color: '#fff' }}>
                                {credit.name}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="project-footer" style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderTop: '1px solid rgba(255,255,255,0.2)',
                    paddingTop: '30px'
                }}>
                    <button
                        className="project-footer-back back-btn"
                        onClick={onBack}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            textTransform: 'uppercase',
                            letterSpacing: '4px',
                            fontSize: '0.65rem',
                            background: 'transparent',
                            border: 'none',
                            color: 'white',
                            cursor: 'pointer',
                            opacity: 0.8,
                            padding: 0,
                            transition: 'opacity 0.3s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.opacity = 1}
                        onMouseLeave={(e) => e.currentTarget.style.opacity = 0.8}
                    >
                        <ChevronLeft size={16} /> Volver
                    </button>

                    <div className="project-footer-credits footer-branding" style={{ fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '3px', opacity: 0.5, color: '#fff' }}>
                        Colmillo &copy; 2024 &bull; Production Studio
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default ProjectDetail;
