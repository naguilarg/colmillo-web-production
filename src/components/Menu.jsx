import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from './Logo';

const Menu = ({ isOpen, setIsOpen, setView }) => {
    const menuLinks = [
        { name: 'Nosotrxs', view: 'manifesto' },
        { name: 'Proyectos', view: 'projects' },
        { name: 'Contacto', view: 'contact' },
        { name: 'Cloud', view: 'home' },
    ];

    const variants = {
        initial: { clipPath: 'inset(100% 0 0 0)' },
        animate: { clipPath: 'inset(0% 0 0 0)' },
        exit: { clipPath: 'inset(100% 0 0 0)' },
    };

    const linkVariants = {
        initial: { y: 150, opacity: 0, skewY: 5 },
        animate: (i) => ({
            y: 0,
            opacity: 1,
            skewY: 0,
            transition: {
                duration: 1.2,
                delay: 0.2 + (i * 0.1),
                ease: [1, 0, 0, 1]
            }
        }),
        exit: { y: 100, opacity: 0, transition: { duration: 0.5 } }
    };

    const handleLinkClick = (view) => {
        setView(view);
        setIsOpen(false);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    variants={variants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100vh',
                        background: '#FFFFFF',
                        zIndex: 1500,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        padding: '0 80px',
                        color: '#000000',
                        overflow: 'hidden'
                    }}
                    className="menu-panel"
                >
                    <style>
                        {`
                            @media (max-width: 768px) {
                                .menu-panel {
                                    padding: 0 30px !important; 
                                    justify-content: flex-start !important;
                                    padding-top: 20vh !important;
                                }
                                .menu-link-btn {
                                    font-size: 2.8rem !important; 
                                    line-height: 1.1 !important;
                                }
                                .menu-logo-container {
                                    width: 80% !important;
                                    right: 10% !important;
                                    bottom: 120px !important;
                                }
                                .menu-footer-branding {
                                    left: 40px !important;
                                    bottom: 60px !important;
                                }
                                .menu-footer-links {
                                    left: 40px !important;
                                    bottom: 30px !important;
                                    flex-wrap: wrap;
                                    gap: 20px !important;
                                }
                            }
                        `}
                    </style>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0px', zIndex: 2, marginBottom: '5vh' }}>
                        {menuLinks.map((link, i) => (
                            <div key={link.name} style={{ overflow: 'hidden' }}>
                                <motion.button
                                    className="menu-link-btn"
                                    custom={i}
                                    variants={linkVariants}
                                    initial="initial"
                                    animate="animate"
                                    exit="exit"
                                    onClick={() => handleLinkClick(link.view)}
                                    style={{
                                        display: 'block',
                                        fontSize: 'clamp(5.5rem, 20vw, 15rem)',
                                        fontFamily: 'var(--font-serif)',
                                        textTransform: 'uppercase',
                                        lineHeight: '0.8',
                                        textAlign: 'left',
                                        color: '#000',
                                        transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                                        background: 'transparent',
                                        border: 'none',
                                        cursor: 'pointer',
                                        padding: 0
                                    }}
                                    onMouseEnter={(e) => {
                                        e.target.style.transform = 'translateX(50px) skewX(-3deg)';
                                        e.target.style.opacity = '0.3';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.target.style.transform = 'translateX(0px) skewX(0deg)';
                                        e.target.style.opacity = '1';
                                    }}
                                >
                                    {link.name}
                                </motion.button>
                            </div>
                        ))}
                    </div>

                    <motion.div
                        className="menu-logo-container"
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 1.5, delay: 0.8, ease: "easeOut" }}
                        style={{
                            position: 'absolute',
                            bottom: '40px',
                            right: '80px',
                            width: '600px',
                            zIndex: 1,
                            pointerEvents: 'none',
                            display: 'flex',
                            justifyContent: 'flex-end'
                        }}
                    >
                        <Logo style={{ width: '100%', height: 'auto', fill: '#000' }} />
                    </motion.div>

                    <div className="menu-footer-branding" style={{
                        position: 'absolute',
                        bottom: '40px',
                        left: '80px',
                        display: 'flex',
                        gap: '40px',
                        opacity: 0.5,
                        fontSize: '0.7rem',
                        textTransform: 'uppercase',
                        letterSpacing: '3px',
                        zIndex: 2,
                        color: '#000'
                    }}>
                        <span>Colmillo Studio &copy; 2024</span>
                    </div>

                    <div className="menu-footer-links" style={{
                        position: 'absolute',
                        bottom: '40px',
                        left: '300px',
                        display: 'flex',
                        gap: '40px',
                        opacity: 0.5,
                        fontSize: '0.7rem',
                        textTransform: 'uppercase',
                        letterSpacing: '2px',
                        zIndex: 2,
                        color: '#000'
                    }}>
                        <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Instagram</a>
                        <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Youtube</a>
                        <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Linkedin</a>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default Menu;
