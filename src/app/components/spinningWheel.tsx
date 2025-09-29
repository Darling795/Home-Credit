"use client";

import React, { CSSProperties } from "react";

interface SpinningWheelProps {
  items: string[];
  rotation: number;
}

const SpinningWheel: React.FC<SpinningWheelProps> = ({ items, rotation }) => {
  const numItems = items.length;
  const segmentAngle = 360 / numItems;
  const colors = ["#FFFFFF", "#FEE2E2"]; 

  // --- MODIFICATIONS START HERE ---

  // Main wheel style - updated size to w-72, h-72 (288px)
  const wheelStyle: CSSProperties = {
    transform: `rotate(${rotation}deg)`,
    transition: 'transform 4s cubic-bezier(0.2, 0.8, 0.3, 1)',
    position: 'relative',
    width: '288px',
    height: '288px',
    borderRadius: '50%',
    border: '4px solid #d1d5db',
    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    overflow: 'hidden',
  };

  return (
    <div style={wheelStyle}>
      {items.map((item, index) => {
        const rotateAngle = segmentAngle * index;
        
        return (
          <div
            key={index}
            style={{
              position: 'absolute',
              width: '50%',
              height: '100%',
              transformOrigin: '100% 50%',
              transform: `rotate(${rotateAngle}deg)`,
              clipPath: `polygon(0% 0%, 100% 50%, 0% 100%)`,
            }}
          >
            <div
              style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                backgroundColor: colors[index % colors.length],
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transform: `rotate(${segmentAngle / 2}deg)`,
              }}
            >
              {/* This is the key change for text readability */}
              <span
                style={{
                  color: '#be123c',
                  fontWeight: 'bold',
                  fontSize: '12px', // Slightly larger font
                  textAlign: 'center',
                  // This new transform pushes the text out from the center
                  // but KEEPS IT UPRIGHT, so it's always readable.
                  transform: `translateX(45%)`, 
                  whiteSpace: 'pre-wrap',
                  lineHeight: '1.1',
                }}
              >
                {item.replace(" ", "\n")}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default SpinningWheel;