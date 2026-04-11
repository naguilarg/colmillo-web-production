import React, { useState, useEffect } from 'react';

const BackgroundVideo = ({ src }) => {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 768);
        };
        checkMobile(); // Check immediately on mount
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Swap precisely the home app background video when on mobile
    const currentVideoSrc = (isMobile && src === '/background.webm') ? '/background-mobile.mp4' : src;

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100dvh',
            zIndex: -2,
            overflow: 'hidden',
            pointerEvents: 'none',
            background: '#000'
        }}>
            <video
                autoPlay
                muted
                defaultMuted
                loop
                playsInline
                poster="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
                key={currentVideoSrc}
                style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block'
                }}
            >
                <source src={currentVideoSrc} type={currentVideoSrc.endsWith('.webm') ? 'video/webm' : 'video/mp4'} />
            </video>

            {/* Dark overlay for readability */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: 'rgba(0,0,0,0.3)', // Slightly lighter overlay for the new video
                zIndex: 1
            }} />
        </div>
    );
};

export default BackgroundVideo;
