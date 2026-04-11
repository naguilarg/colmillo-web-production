import React, { useState, useEffect } from 'react';

const BackgroundVideo = ({ src }) => {
    // Initialize synchronously so first render is correct, preventing source swap bugs breaking Safari autoplay
    const [isMobile, setIsMobile] = useState(
        typeof window !== 'undefined' ? window.innerWidth <= 768 : false
    );

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
            <div dangerouslySetInnerHTML={{ __html: `
                <video 
                    autoplay 
                    muted 
                    loop 
                    playsinline 
                    poster="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
                    style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); min-width: 100vw; min-height: 100dvh; width: auto; height: auto; object-fit: cover;"
                >
                    <source src="${currentVideoSrc}" type="${currentVideoSrc.endsWith('.webm') ? 'video/webm' : 'video/mp4'}" />
                </video>
            `}} style={{ position: 'absolute', top: 0, left: 0, width: '100vw', height: '100dvh', overflow: 'hidden' }} />

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
