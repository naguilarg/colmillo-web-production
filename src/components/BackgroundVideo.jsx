import React from 'react';

const BackgroundVideo = ({ src }) => {
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
                    style="position: absolute; top: 0; left: 0; width: 100vw; height: 100dvh; object-fit: cover; display: block; background: #000;"
                    src="${src}"
                >
                </video>
            `}} style={{ width: '100%', height: '100%' }} />

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
