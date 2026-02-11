import React from 'react';

const LogoIcon = ({ className, style }) => {
    return (
        <svg
            version="1.1"
            viewBox="340 220 345 585"
            style={{
                fill: '#FFFFFF',
                ...style
            }}
            xmlSpace="preserve"
            className={className}
        >
            <g>
                <path d="M673,620.4L555.6,795.7l-1.7-567.4H673V620.4z" />
                <path d="M351,228.3h119.1l-1.7,567.4L351,620.4V228.3z" />
            </g>
        </svg>
    );
};

const MinimalLogo = () => {
    return (
        <div style={{
            position: 'fixed',
            top: '30px',
            left: '30px',
            zIndex: 50,
            width: '80px',
        }} className="minimal-logo-container">
            <style>
                {`
          @media (max-width: 768px) {
            .minimal-logo-container {
              width: 35px !important;
              top: 20px !important;
              left: 20px !important;
            }
          }
        `}
            </style>
            <LogoIcon style={{ width: '100%', height: 'auto', fill: 'white' }} />
        </div>
    );
};

export default MinimalLogo;
