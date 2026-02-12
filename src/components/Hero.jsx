import React from 'react';
import { motion } from 'framer-motion';
import Logo from './Logo';

const Hero = ({ onCtaClick }) => {
    return (
        <section
            style={{
                height: '100vh',
                width: '100%',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
                overflow: 'hidden',
                padding: '0 40px'
            }}
        >
            {/* Massive Branding Container */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                style={{
                    zIndex: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    width: '100%',
                    maxWidth: '1800px',
                    position: 'relative'
                }}
            >
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.5 }}
                    style={{ width: '100%', position: 'relative' }}
                >
                    {/* THE BIG LOGO */}
                    <Logo style={{ width: '100%', height: 'auto', fill: '#fff' }} />

                    {/* Sub-branding at corners of the massive logo */}
                    <div style={{
                        position: 'absolute',
                        bottom: '-15px',
                        left: '0',
                        fontSize: 'clamp(0.6rem, 2vw, 1.2rem)',
                        textTransform: 'uppercase',
                        letterSpacing: '4px',
                        fontWeight: '300',
                        opacity: 0.8
                    }}>
                        Production
                    </div>
                    <div style={{
                        position: 'absolute',
                        bottom: '-15px',
                        right: '0',
                        fontSize: 'clamp(0.6rem, 2vw, 1.2rem)',
                        textTransform: 'uppercase',
                        letterSpacing: '4px',
                        fontWeight: '300',
                        opacity: 0.8
                    }}>
                        Studio
                    </div>
                </motion.div>
            </motion.div>

            {/* Exploration Button (Optional or integrated into footer) */}
            <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.8 }}
                transition={{ delay: 2.5, duration: 1 }}
                onClick={onCtaClick}
                style={{
                    marginTop: '80px',
                    padding: '15px 30px',
                    border: '1px solid rgba(255,255,255,0.2)',
                    textTransform: 'uppercase',
                    letterSpacing: '4px',
                    fontSize: '0.7rem',
                    zIndex: 2,
                    transition: 'all 0.3s ease',
                    background: 'transparent',
                    color: 'white'
                }}
                onMouseEnter={(e) => { e.target.style.background = 'white'; e.target.style.color = 'black'; }}
                onMouseLeave={(e) => { e.target.style.background = 'transparent'; e.target.style.color = 'white'; }}
            >
                View Work
            </motion.button>

            {/* Atmospheric Footer (Cities & Copyright) */}
            <style>
                {`
                    @media (max-width: 768px) {
                        .hero-footer {
                            flex-direction: column !important;
                            align-items: center !important;
                            text-align: center !important;
                            bottom: 20px !important;
                            gap: 15px;
                        }
                        .hero-lang-switcher {
                            position: relative !important;
                            left: 0 !important;
                            transform: none !important;
                            margin-bottom: 5px;
                            order: 1;
                        }
                        .hero-copy {
                            order: 2;
                            font-size: 0.55rem !important;
                        }
                        .hero-rights {
                            display: none; /* Hide secondary text on mobile for cleanliness */
                        }
                    }
                `}
            </style>
            <div className="hero-footer" style={{
                position: 'absolute',
                bottom: '30px',
                left: '40px',
                right: '40px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-end',
                fontSize: '0.65rem',
                textTransform: 'uppercase',
                letterSpacing: '2px',
                opacity: 0.5,
                zIndex: 2
            }}>
                <div className="hero-copy" style={{ textAlign: 'left' }}>
                    &copy; 2024 Colmillo Production Studio
                </div>

                {/* Centered Language Switcher */}
                <div className="hero-lang-switcher" style={{
                    position: 'absolute',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    display: 'flex',
                    gap: '20px',
                    cursor: 'pointer'
                }}>
                    <span>Español</span>
                    <span style={{ opacity: 0.3 }}>/</span>
                    <span>English</span>
                </div>

                <div className="hero-rights" style={{ textAlign: 'right' }}>
                    All Rights Reserved
                </div>
            </div>
        </section>
    );
};

export default Hero;
