import React from 'react';
import { motion } from 'framer-motion';

const Contact = () => {
    const containerVariants = {
        initial: { opacity: 0 },
        animate: {
            opacity: 1,
            transition: { duration: 0.8, staggerChildren: 0.3 }
        },
        exit: { opacity: 0 }
    };

    const itemVariants = {
        initial: { y: 20, opacity: 0 },
        animate: { y: 0, opacity: 1, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
    };

    return (
        <motion.div
            variants={containerVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            style={{
                width: '100%',
                height: '100vh',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '0 40px',
                textAlign: 'center',
                background: 'rgba(0,0,0,0.6)',
                backdropFilter: 'blur(10px)',
                zIndex: 10
            }}
        >
            <div style={{ maxWidth: '1200px' }}>
                <motion.h1
                    variants={itemVariants}
                    style={{
                        fontSize: 'clamp(1.5rem, 5vw, 4.5rem)',
                        fontFamily: 'var(--font-serif)',
                        lineHeight: '1.2',
                        marginBottom: '40px',
                        textTransform: 'lowercase',
                        letterSpacing: '-1px',
                        fontWeight: 200,
                        display: 'flex',
                        gap: '20px',
                        justifyContent: 'center',
                        alignItems: 'baseline',
                        whiteSpace: 'nowrap'
                    }}
                >
                    <span>¿tienes una idea?</span>
                    <motion.span
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 1, duration: 1 }}
                        style={{
                            fontStyle: 'italic',
                            fontWeight: 300,
                            opacity: 0.7
                        }}
                    >
                        hablemos
                    </motion.span>
                </motion.h1>

                <motion.div
                    variants={itemVariants}
                    style={{
                        marginTop: '40px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '15px'
                    }}
                >
                    <a
                        href="mailto:info@colmillo.es"
                        style={{
                            fontSize: '1.2rem',
                            letterSpacing: '5px',
                            textTransform: 'uppercase',
                            color: '#fff',
                            textDecoration: 'none',
                            opacity: 0.5,
                            transition: 'opacity 0.3s ease'
                        }}
                        onMouseEnter={(e) => e.target.style.opacity = 1}
                        onMouseLeave={(e) => e.target.style.opacity = 0.5}
                    >
                        info@colmillo.es
                    </a>
                </motion.div>
            </div>

            {/* Social Bottom */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.4 }}
                transition={{ delay: 1.5 }}
                style={{
                    position: 'absolute',
                    bottom: '40px',
                    display: 'flex',
                    gap: '30px',
                    fontSize: '0.6rem',
                    textTransform: 'uppercase',
                    letterSpacing: '2px'
                }}
            >
                <a href="#" style={{ color: '#fff', textDecoration: 'none' }}>Instagram</a>
                <a href="#" style={{ color: '#fff', textDecoration: 'none' }}>Youtube</a>
                <a href="#" style={{ color: '#fff', textDecoration: 'none' }}>Linkedin</a>
            </motion.div>
        </motion.div>
    );
};

export default Contact;
