import React from 'react';

const BackgroundVideo = ({ src }) => {
    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh', /* Safe fallback height */
            minHeight: '100dvh',
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
                    style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); min-width: 100vw; min-height: 100dvh; width: auto; height: auto; object-fit: cover; background: #000;"
                    src="${src}"
                >
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
