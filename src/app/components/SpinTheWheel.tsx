"use client";

import Image from "next/image";
import React, { useState } from "react";
import SpinningWheel from "./SpinningWheel"; 
import Configuration, { WheelItem } from "./configurations";

// --- Default Configuration ---
const initialWheelItems: WheelItem[] = [
  { name: "iPhone 17 Pro", imageUrl: "/assets/iphone-17.png" },
  { name: "50% Discount" },
  { name: "Smart Watch" },
  { name: "Try Again" },
  { name: "Headphones" },
  { name: "10% Discount" },
  { name: "Speaker" },
  { name: "Try Again" },
];

// --- Main Component ---
const SpinTheWheel: React.FC = () => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [selectedItem, setSelectedItem] = useState<WheelItem | null>(null);
  const [wheelItems, setWheelItems] = useState<WheelItem[]>(initialWheelItems);

  const handleSpin = () => {
    if (isSpinning) return;

    setIsSpinning(true);
    setSelectedItem(null);

    const randomItemIndex = Math.floor(Math.random() * wheelItems.length);
    const segmentAngle = 360 / wheelItems.length;
    const targetAngle = 360 - (randomItemIndex * segmentAngle) - (segmentAngle / 2);

    const fullSpins = 5;
    const newRotation = rotation - (rotation % 360) + (360 * fullSpins) + targetAngle;

    setRotation(newRotation);

    setTimeout(() => {
      setSelectedItem(wheelItems[randomItemIndex]);
      setIsSpinning(false);
    }, 4000); 
  };

  return (
    <div
      className="relative flex min-h-screen w-full items-center justify-center p-8 overflow-hidden"
      style={{ background: "radial-gradient(circle at 50% 30%, #4c1d95, #1e1b4b, #111827)" }}
    >
      <Configuration items={wheelItems} setItems={setWheelItems} />

      <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-red-800 to-red-700/50 -skew-y-3"></div>
      
      <div className="relative w-[600px] h-[90vh] bg-red-700 rounded-t-2xl flex flex-col items-center shadow-2xl shadow-black/50">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "repeating-radial-gradient(circle at 50% 100%, transparent, transparent 10px, #000000 11px, #000000 20px)" }}></div>
        <div className="relative mt-[-50px] z-10">
          <div className="w-[450px] h-[120px] bg-white/70 backdrop-blur-sm rounded-2xl flex items-center justify-center" style={{ boxShadow: "0 0 15px 5px #ef4444, 0 0 30px 10px #ef4444, inset 0 0 10px #fff" }}>
            <h2 className="text-5xl font-extrabold text-red-600 tracking-wider">HOME CREDIT</h2>
          </div>
        </div>
        
        <div className="mt-12 w-[500px] bg-red-800 p-4 rounded-lg shadow-inner shadow-black/30">
          <div className="bg-black w-full h-[270px] rounded-md overflow-hidden flex items-center justify-center text-center">
            {selectedItem ? (
              <div className="flex flex-col items-center justify-center text-white animate-fade-in">
                {selectedItem.imageUrl ? (
                    <Image src={selectedItem.imageUrl} alt={selectedItem.name} width={480} height={270} className="object-contain" />
                ) : (
                  <>
                    <h3 className="text-2xl font-semibold tracking-wider">{selectedItem.name === "Try Again" ? "Better Luck Next Time!" : "Congratulations!"}</h3>
                    <p className="text-6xl font-bold mt-4 text-yellow-400" style={{ textShadow: "0 0 15px #facc15" }}>{selectedItem.name}</p>
                  </>
                )}
              </div>
            ) : isSpinning ? (
               <div className="text-white text-3xl font-bold">Spinning...</div>
            ) : (
              <Image src="/assets/iphone-17.png" alt="iPhone 17 Pro" width={480} height={270} className="object-contain" />
            )}
          </div>
        </div>
        <div className="w-[550px] h-8 bg-red-800 mt-6 rounded-md shadow-lg shadow-black/40"></div>
      </div>
      
      {/* --- MODIFICATIONS START HERE --- */}
      <div className="absolute bottom-10 left-[calc(50%-480px)] z-20 transform -rotate-3 drop-shadow-2xl">
        {/* Enlarge the tablet's container */}
        <div className="w-[360px] h-[460px] bg-black border-4 border-gray-700 rounded-2xl p-4 flex flex-col items-center justify-center">
          <div className="w-full h-full bg-white rounded-lg flex flex-col items-center justify-center relative">
            <div className="absolute top-[-15px] z-20 w-0 h-0 border-l-[20px] border-l-transparent border-r-[20px] border-r-transparent border-t-[30px] border-t-red-600 drop-shadow-lg"></div>
            
            {/* Enlarge the wheel's container to fill the new space */}
            <div className="relative w-72 h-72 flex items-center justify-center my-4">
              <SpinningWheel items={wheelItems.map(item => item.name)} rotation={rotation} />
              
              {/* Make the spin button larger and more prominent */}
              <button
                onClick={handleSpin}
                disabled={isSpinning}
                className="absolute w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-lg disabled:opacity-50 disabled:cursor-not-allowed z-10"
              >
                <span className="font-bold text-2xl text-red-600">SPIN</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* --- MODIFICATIONS END HERE --- */}
    </div>
  );
};

export default SpinTheWheel;