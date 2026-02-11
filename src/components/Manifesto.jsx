import React, { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform, AnimatePresence, useMotionValueEvent } from 'framer-motion';

const Manifesto = () => {
    const containerRef = useRef(null);
    const [isAnimationComplete, setIsAnimationComplete] = useState(false);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    // Layering & Color Timelines
    const statementOpacity = useTransform(scrollYProgress, [0, 0.15, 0.22], [1, 1, 0]);
    const statementScale = useTransform(scrollYProgress, [0, 0.15, 0.22], [1, 1, 0.95]);
    const statementZIndex = useTransform(scrollYProgress, [0, 0.2], [10, 0]);

    const bgColor = useTransform(scrollYProgress, [0.3, 0.5], ["rgba(0,0,0,0.4)", "rgba(0,0,0,1)"]);

    // Team Section (Simultaneous)
    const teamOpacity = useTransform(scrollYProgress, [0.4, 0.6, 1], [0, 1, 1]);
    const teamZIndex = 20;

    // KINETIC SHUTTERS TIMELINES
    // Containers slide from sides to center
    const nachoSlideX = useTransform(scrollYProgress, [0.4, 0.6], ["-100%", "0%"]);
    const floSlideX = useTransform(scrollYProgress, [0.4, 0.6], ["100%", "0%"]);

    // Inverse Parallax (Images move opposite to containers)
    const nachoImgX = useTransform(scrollYProgress, [0.4, 0.6], ["50%", "0%"]);
    const floImgX = useTransform(scrollYProgress, [0.4, 0.6], ["-50%", "0%"]);

    // Scale for impact
    const photoScale = useTransform(scrollYProgress, [0.4, 0.7], [1.3, 1]);

    const [showBios, setShowBios] = useState(false);

    useMotionValueEvent(scrollYProgress, "change", (latest) => {
        if (latest > 0.52) {
            setShowBios(true);
        } else {
            setShowBios(false);
        }
    });

    useEffect(() => {
        const timer = setTimeout(() => setIsAnimationComplete(true), 600);
        return () => clearTimeout(timer);
    }, []);

    const bioItemVariants = {
        initial: { y: 30, opacity: 0, filter: 'blur(10px)' },
        animate: (i) => ({
            y: 0,
            opacity: 1,
            filter: 'blur(0px)',
            transition: { delay: i * 0.1, duration: 1, ease: [0.16, 1, 0.3, 1] }
        })
    };

    return (
        <div ref={containerRef} style={{ height: '200vh', position: 'relative', width: '100%' }}>
            <style>
                {`
                    @media (max-width: 768px) {
                        .manifesto-statement {
                            font-size: clamp(0.9rem, 5vw, 1.4rem) !important;
                            padding: 0 20px !important;
                            line-height: 1.4 !important;
                        }
                        .team-shutter-container {
                            flex-direction: column !important;
                        }
                        .bio-overlay {
                            max-width: 80% !important;
                            padding: 20px !important;
                        }
                        .bio-name {
                            font-size: 2.2rem !important;
                        }
                        .bio-role {
                            font-size: 0.6rem !important;
                            margin-bottom: 10px !important;
                        }
                        .bio-desc {
                            font-size: 0.8rem !important;
                            line-height: 1.4 !important;
                        }
                        .nacho-bio {
                            bottom: 5% !important;
                            left: 5% !important;
                        }
                        .flo-bio {
                            bottom: 5% !important;
                            top: auto !important;
                            right: 5% !important;
                        }
                    }
                `}
            </style>

            <motion.div style={{
                position: 'sticky',
                top: 0,
                left: 0,
                width: '100%',
                height: '100vh',
                overflow: 'hidden',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: bgColor
            }}>

                {/* 1. RHYTHMIC AUTOMATIC STATEMENT */}
                <motion.div
                    className="manifesto-statement"
                    style={{
                        position: 'absolute',
                        fontSize: 'clamp(1rem, 3.5vw, 2.7rem)',
                        fontFamily: 'var(--font-serif)',
                        lineHeight: '1.2',
                        maxWidth: '1000px',
                        textAlign: 'center',
                        letterSpacing: '2px',
                        color: '#fff',
                        opacity: statementOpacity,
                        scale: statementScale,
                        zIndex: statementZIndex
                    }}
                >
                    <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        style={{ fontWeight: 800, fontStyle: 'italic', textTransform: 'uppercase' }}
                    >
                        Creemos
                    </motion.span>

                    <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: isAnimationComplete ? 0.6 : 0 }}
                        transition={{ duration: 0.5 }}
                        style={{ fontWeight: 200 }}
                    >
                        {" "}que las{" "}
                    </motion.span>

                    <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        style={{ fontWeight: 800, fontStyle: 'italic', textTransform: 'uppercase' }}
                    >
                        ideas simples
                    </motion.span>

                    <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: isAnimationComplete ? 0.6 : 0 }}
                        transition={{ duration: 0.5 }}
                        style={{ fontWeight: 200 }}
                    >
                        {" "}pueden ser las más{" "}
                    </motion.span>

                    <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        style={{ fontWeight: 800, fontStyle: 'italic', textTransform: 'uppercase' }}
                    >
                        poderosas,
                    </motion.span>

                    <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: isAnimationComplete ? 0.6 : 0 }}
                        transition={{ duration: 0.5 }}
                        style={{ fontWeight: 200 }}
                    >
                        {" "}y nos enfocamos en resaltar lo mejor de cada cliente en todo lo que{" "}
                    </motion.span>

                    <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        style={{ fontWeight: 800, fontStyle: 'italic', textTransform: 'uppercase' }}
                    >
                        creamos.
                    </motion.span>
                </motion.div>

                {/* 2. TEAM SECTION (Sliding Shutters) */}
                <motion.div
                    className="team-shutter-container"
                    style={{
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        opacity: teamOpacity,
                        zIndex: teamZIndex
                    }}
                >
                    {/* NACHO SHUTTER (Left Panel) */}
                    <motion.div style={{
                        flex: 1,
                        height: '100%',
                        position: 'relative',
                        overflow: 'hidden',
                        x: nachoSlideX,
                        backgroundColor: '#000' /* Ensure opacity to hide background text */
                    }}>
                        <motion.div style={{ width: '100%', height: '100%', x: nachoImgX }}>
                            <motion.img
                                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=2000&auto=format&fit=crop"
                                alt="Nacho"
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                    filter: 'grayscale(100%)',
                                    opacity: 0.6,
                                    scale: photoScale
                                }}
                            />
                        </motion.div>

                        {/* BIO OVERLAY NACHO */}
                        <div className="bio-overlay nacho-bio" style={{
                            position: 'absolute',
                            bottom: '10%',
                            left: '10%',
                            maxWidth: '400px',
                            zIndex: 30
                        }}>
                            <motion.h2
                                className="bio-name"
                                initial="initial"
                                animate={showBios ? "animate" : "initial"}
                                custom={0}
                                variants={bioItemVariants}
                                style={{ fontSize: '5rem', fontFamily: 'var(--font-serif)', textTransform: 'uppercase', marginBottom: '10px', color: '#fff' }}
                            >
                                Nacho
                            </motion.h2>
                            <motion.p
                                className="bio-role"
                                initial="initial"
                                animate={showBios ? "animate" : "initial"}
                                custom={1}
                                variants={bioItemVariants}
                                style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '5px', opacity: 0.5, marginBottom: '20px', color: '#fff' }}
                            >
                                Creative Director
                            </motion.p>
                            <motion.p
                                className="bio-desc"
                                initial="initial"
                                animate={showBios ? "animate" : "initial"}
                                custom={2}
                                variants={bioItemVariants}
                                style={{ fontSize: '1.2rem', lineHeight: '1.6', fontWeight: 200, opacity: 0.8, color: '#fff' }}
                            >
                                Estratega visual transformando conceptos abstractos en piezas cinematográficas inolvidables.
                            </motion.p>
                        </div>
                    </motion.div>

                    {/* FLO SHUTTER (Right Panel) */}
                    <motion.div style={{
                        flex: 1,
                        height: '100%',
                        position: 'relative',
                        overflow: 'hidden',
                        x: floSlideX,
                        backgroundColor: '#000' /* Ensure opacity to hide background text */
                    }}>
                        <motion.div style={{ width: '100%', height: '100%', x: floImgX }}>
                            <motion.img
                                src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=2000&auto=format&fit=crop"
                                alt="Flo"
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                    filter: 'grayscale(100%)',
                                    opacity: 0.6,
                                    scale: photoScale
                                }}
                            />
                        </motion.div>

                        {/* BIO OVERLAY FLO */}
                        <div className="bio-overlay flo-bio" style={{
                            position: 'absolute',
                            bottom: '10%',
                            right: '10%',
                            maxWidth: '400px',
                            textAlign: 'right',
                            zIndex: 30
                        }}>
                            <motion.h2
                                className="bio-name"
                                initial="initial"
                                animate={showBios ? "animate" : "initial"}
                                custom={0}
                                variants={bioItemVariants}
                                style={{ fontSize: '5rem', fontFamily: 'var(--font-serif)', textTransform: 'uppercase', marginBottom: '10px', color: '#fff' }}
                            >
                                Flo
                            </motion.h2>
                            <motion.p
                                className="bio-role"
                                initial="initial"
                                animate={showBios ? "animate" : "initial"}
                                custom={1}
                                variants={bioItemVariants}
                                style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '5px', opacity: 0.5, marginBottom: '20px', color: '#fff' }}
                            >
                                Cinematographer
                            </motion.p>
                            <motion.p
                                className="bio-desc"
                                initial="initial"
                                animate={showBios ? "animate" : "initial"}
                                custom={2}
                                variants={bioItemVariants}
                                style={{ fontSize: '1.2rem', lineHeight: '1.6', fontWeight: 200, opacity: 0.8, color: '#fff' }}
                            >
                                Escultor de luz y movement, capturando la esencia cruda de la realidad y elevándola artísticamente.
                            </motion.p>
                        </div>
                    </motion.div>

                </motion.div>

                {/* Scroll Hint */}
                <motion.div
                    style={{
                        position: 'absolute',
                        bottom: '40px',
                        fontSize: '0.6rem',
                        textTransform: 'uppercase',
                        letterSpacing: '5px',
                        opacity: useTransform(scrollYProgress, [0, 0.1], [0.4, 0]),
                        color: '#fff'
                    }}
                >
                    SCROLL
                </motion.div>

            </motion.div>
        </div>
    );
};

export default Manifesto;
