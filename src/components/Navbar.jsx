import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Menu from './Menu';
import MinimalLogo from './MinimalLogo';

const Navbar = ({ setView }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <style>
        {`
          @media (max-width: 768px) {
            .navbar-logo-container {
              width: 40px !important;
            }
          }
        `}
      </style>
      <nav
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          zIndex: 2000,
          padding: '25px 40px', // Slightly adjusted
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          onClick={() => { setView('home'); setIsMenuOpen(false); }}
          className="navbar-logo-container"
          style={{
            width: '60px',
            cursor: 'pointer',
            zIndex: 2001,
            mixBlendMode: isMenuOpen ? 'difference' : 'difference'
          }}
        >
          <MinimalLogo />
        </motion.div>

        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '10px 0',
            zIndex: 2001,
            mixBlendMode: isMenuOpen ? 'normal' : 'difference',
            color: isMenuOpen ? '#000' : '#fff',
            fontSize: '0.7rem',
            letterSpacing: '2px',
            textTransform: 'uppercase',
            fontWeight: '300'
          }}
        >
          <span>[ / ]</span>
          <span>{isMenuOpen ? 'CLOSE' : 'MENU'}</span>
        </button>
      </nav>

      <Menu isOpen={isMenuOpen} setIsOpen={setIsMenuOpen} setView={setView} />
    </>
  );
};

export default Navbar;
