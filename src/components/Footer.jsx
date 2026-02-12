import React from 'react';
import { Instagram, Youtube, Linkedin } from 'lucide-react';

const Footer = () => {
    return (
        <footer style={{ padding: '80px 40px', background: '#000', borderTop: '1px solid #111' }}>
            <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '40px' }}>
                <div style={{ flex: 1 }}>
                    <h2 style={{ fontSize: '2rem', marginBottom: '20px' }}>COLMILLO</h2>
                    <p style={{ opacity: 0.5, fontSize: '0.9rem' }}>&copy; {new Date().getFullYear()} Colmillo Production Studio. Todos los derechos reservados.</p>
                </div>

                <div style={{ display: 'flex', gap: '30px' }}>
                    <a href="#" style={{ opacity: 0.6, transition: '0.3s' }} onMouseEnter={e => e.target.style.opacity = 1} onMouseLeave={e => e.target.style.opacity = 0.6}>
                        <Instagram size={20} />
                    </a>
                    <a href="#" style={{ opacity: 0.6, transition: '0.3s' }} onMouseEnter={e => e.target.style.opacity = 1} onMouseLeave={e => e.target.style.opacity = 0.6}>
                        <Youtube size={20} />
                    </a>
                    <a href="#" style={{ opacity: 0.6, transition: '0.3s' }} onMouseEnter={e => e.target.style.opacity = 1} onMouseLeave={e => e.target.style.opacity = 0.6}>
                        <Linkedin size={20} />
                    </a>
                </div>

                <div style={{ display: 'flex', gap: '20px', fontSize: '0.8rem', opacity: 0.5 }}>
                    <a href="#">Privacidad</a>
                    <a href="#">Legal</a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
