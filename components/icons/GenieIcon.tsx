import React from 'react';

const GenieIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 250 250"
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
  >
    <defs>
      <radialGradient id="genie-body-grad" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
        <stop offset="0%" style={{ stopColor: '#a1d9ff' }} />
        <stop offset="100%" style={{ stopColor: '#5c97c4' }} />
      </radialGradient>
      <linearGradient id="genie-vest-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{ stopColor: '#f7d033' }} />
        <stop offset="100%" style={{ stopColor: '#e58f1e' }} />
      </linearGradient>
       <linearGradient id="turban-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{ stopColor: '#9b59b6' }} />
        <stop offset="100%" style={{ stopColor: '#8e44ad' }} />
      </linearGradient>
       <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur in="SourceAlpha" stdDeviation="3"/>
        <feOffset dx="2" dy="4" result="offsetblur"/>
        <feComponentTransfer>
          <feFuncA type="linear" slope="0.5"/>
        </feComponentTransfer>
        <feMerge> 
          <feMergeNode/>
          <feMergeNode in="SourceGraphic"/> 
        </feMerge>
      </filter>
    </defs>
    
    <g filter="url(#shadow)">
      {/* Smoke Tail */}
      <path 
        d="M 125,240 C 70,200 100,150 125,140 S 180,200 125,240 Z"
        fill="url(#genie-body-grad)"
        transform="rotate(5 125 140)"
        opacity="0.9"
      />
      
      {/* Body */}
      <path d="M 125,145 C 90,140 80,90 125,70 S 160,140 125,145 Z" fill="url(#genie-body-grad)" />

      {/* Arms */}
      <path d="M 95,110 C 60,100 65,140 95,130" stroke="url(#genie-body-grad)" strokeWidth="20" fill="none" strokeLinecap="round" />
      <path d="M 155,110 C 190,100 185,140 155,130" stroke="url(#genie-body-grad)" strokeWidth="20" fill="none" strokeLinecap="round" />
      
      {/* Vest */}
      <path d="M 125,80 C 105,85 100,120 125,125 S 145,85 125,80 Z" fill="url(#genie-vest-grad)" />
      <circle cx="125" cy="85" r="8" fill="none" stroke="#a4660a" strokeWidth="2" />
      
      {/* Head */}
      <circle cx="125" cy="50" r="38" fill="#f2d5ab" />
      
      {/* Turban */}
      <path d="M 125, 5 C 165,5 170,45 125,45 S 85,5 125,5 Z" fill="url(#turban-grad)" />
      <circle cx="125" cy="22" r="8" fill="#f7d033" stroke="#a4660a" strokeWidth="1.5" />

      {/* Face Features */}
      {/* Eyes */}
      <ellipse cx="108" cy="50" rx="6" ry="8" fill="white" />
      <ellipse cx="142" cy="50" rx="6" ry="8" fill="white" />
      <circle cx="109" cy="52" r="3" fill="#3498db" />
      <circle cx="141" cy="52" r="3" fill="#3498db" />
      <circle cx="110" cy="51" r="1" fill="black" />
      <circle cx="140" cy="51" r="1" fill="black" />
      
      {/* Eyebrows */}
      <path d="M 100,40 Q 108,35 116,40" stroke="#4a3520" fill="none" strokeWidth="3" strokeLinecap="round" />
      <path d="M 134,40 Q 142,35 150,40" stroke="#4a3520" fill="none" strokeWidth="3" strokeLinecap="round" />
      
      {/* Smile */}
      <path d="M 115,65 Q 125,75 135,65" stroke="#ae5d5a" fill="none" strokeWidth="2.5" strokeLinecap="round" />
      
      {/* Earings */}
      <circle cx="90" cy="60" r="5" fill="#f7d033" stroke="#a4660a" strokeWidth="1" />
      <circle cx="160" cy="60" r="5" fill="#f7d033" stroke="#a4660a" strokeWidth="1" />
    </g>
  </svg>
);

export default GenieIcon;