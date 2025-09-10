import React from 'react';

const CakeIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg 
        className={className}
        viewBox="0 0 100 100" 
        xmlns="http://www.w3.org/2000/svg"
    >
        {/* Candles */}
        <rect x="30" y="5" width="5" height="15" fill="#f39c12" />
        <path d="M 32.5,5 A 5,5 0 0,1 32.5,0 A 5,5 0 0,1 32.5,5" fill="#f1c40f" />
        <rect x="50" y="5" width="5" height="15" fill="#e74c3c" />
        <path d="M 52.5,5 A 5,5 0 0,1 52.5,0 A 5,5 0 0,1 52.5,5" fill="#f1c40f" />
        <rect x="70" y="5" width="5" height="15" fill="#3498db" />
        <path d="M 72.5,5 A 5,5 0 0,1 72.5,0 A 5,5 0 0,1 72.5,5" fill="#f1c40f" />

        {/* Icing */}
        <path d="M 10,40 Q 20,30 30,40 T 50,40 T 70,40 T 90,40 V 50 H 10 Z" fill="#ecf0f1" />
        
        {/* Cake Layer 1 */}
        <rect x="10" y="50" width="80" height="20" fill="#e67e22" />
        
        {/* Filling */}
        <rect x="10" y="70" width="80" height="10" fill="#f9e79f" />
        
        {/* Cake Layer 2 */}
        <rect x="10" y="80" width="80" height="20" fill="#d35400" />
        
        {/* Plate */}
        <ellipse cx="50" cy="100" rx="45" ry="5" fill="#bdc3c7" />
    </svg>
);

export default CakeIcon;
