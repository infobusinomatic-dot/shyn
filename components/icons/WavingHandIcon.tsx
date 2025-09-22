import React from 'react';

export const WavingHandIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M2 14c.6.9 1.3 2.8 2 5 .7 2.3 1.5 4 3 4s2.3-1.7 3-4c.7-2.2 1.4-4.1 2-5" />
        <path d="M17 12V6" />
        <path d="M17 6c-2.5-1.5-5-1.5-7.5 0" />
        <path d="M22 14c-.6.9-1.3 2.8-2 5-.7 2.3-1.5 4-3 4s-2.3-1.7-3-4c-.7-2.2-1.4-4.1-2-5" />
    </svg>
);