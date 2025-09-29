"use client";

import Image from "next/image";
import React, { useState, useEffect, useMemo } from "react"; // <-- IMPORT useMemo
import { Wheel } from 'react-custom-roulette';
import Configuration, { WheelItem } from "./configurations";

const initialWheelItems: WheelItem[] = [
  { name: "iPhone 17 Pro" },
  { name: "50% Discount" },
  { name: "Smart Watch" },
  { name: "Try Again" },
  { name: "Headphones" },
  { name: "10% Discount" },
  { name: "Speaker" },
  { name: "Try Again" },
];

const SpinTheWheel: React.FC = () => {
  const [mustSpin, setMustSpin] = useState(false);
  const [prizeNumber, setPrizeNumber] = useState(0);
  const [selectedItem, setSelectedItem] = useState<WheelItem | null>(null);
  const [wheelItems, setWheelItems] = useState<WheelItem[]>(initialWheelItems);

  useEffect(() => {
    return () => {
      wheelItems.forEach(item => {
        if (item.imageUrl && item.imageUrl.startsWith('blob:')) {
          URL.revokeObjectURL(item.imageUrl);
        }
      });
    };
  }, []);

  const handleSpin = () => {
    if (!mustSpin && wheelItems.length > 0) {
      const newPrizeNumber = Math.floor(Math.random() * wheelItems.length);
      setPrizeNumber(newPrizeNumber);
      setMustSpin(true);
      setSelectedItem(null);
    }
  };

  // --- FIX #1: MEMOIZE THE WHEEL DATA ---
  // This prevents the data array from being recreated on every render,
  // making the library's state stable.
  const wheelData = useMemo(() => {
    return wheelItems.map(item => {
      const dataItem: { option: string; image?: { uri: string; sizeMultiplier: number } } = {
        // Truncate long text to prevent it from overflowing the segment
        option: item.name.length > 12 ? item.name.substring(0, 12) + '...' : item.name,
      };
      if (item.imageUrl) {
        dataItem.image = {
          uri: item.imageUrl,
          sizeMultiplier: 0.7 // Adjusted size for better visuals
        };
        // If there's an image, the text option can be shorter
        dataItem.option = item.name.length > 8 ? item.name.substring(0, 8) + '...' : item.name;
      }
      return dataItem;
    });
  }, [wheelItems]); // This dependency array ensures it only recalculates when items change

  return (
    <div
      className="relative flex min-h-screen w-full items-center justify-center p-4 lg:p-8 overflow-hidden"
      style={{ background: "radial-gradient(circle at 50% 50%, #4c1d95, #1e1b4b)" }}
    >
      {/* Pass a function to clear the TV when items are changed */}
      <Configuration items={wheelItems} setItems={setWheelItems} onItemsChange={() => setSelectedItem(null)} />

      <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-16 w-full max-w-7xl">
        <div className="relative z-20 drop-shadow-2xl order-2 lg:order-1">
          <div className="w-[380px] h-[480px] sm:w-[420px] sm:h-[550px] bg-black border-4 border-gray-700 rounded-3xl p-4 flex flex-col items-center justify-center">
            <div className="w-full h-full bg-white rounded-xl flex flex-col items-center justify-center relative">
              <div className="absolute top-[-20px] z-20 w-0 h-0 border-l-[25px] border-l-transparent border-r-[25px] border-r-transparent border-t-[40px] border-t-red-600 drop-shadow-lg"></div>
              
              <div className="relative w-80 h-80 sm:w-96 sm:h-96 flex items-center justify-center my-4">
                {wheelData.length > 0 && (
                  <Wheel
                    mustStartSpinning={mustSpin}
                    prizeNumber={prizeNumber}
                    data={wheelData}
                    onStopSpinning={() => {
                      setMustSpin(false);
                      // --- FIX #2: The prizeNumber is now reliable ---
                      // No more -1 hack needed. The library index is now in sync.
                      setSelectedItem(wheelItems[prizeNumber]);
                    }}
                    backgroundColors={['#FFFFFF', '#FEE2E2']}
                    textColors={['#BE123C']}
                    outerBorderColor={'#D1D5DB'}
                    radiusLineColor={'#D1D5DB'}
                    outerBorderWidth={4}
                    radiusLineWidth={2}
                    fontSize={14}
                    spinDuration={0.5}
                    // This prop helps if text is still misaligned
                    textDistance={75} 
                  />
                )}
                <button
                  onClick={handleSpin}
                  disabled={mustSpin}
                  className="absolute w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-lg disabled:opacity-50 disabled:cursor-not-allowed z-10 transition-transform hover:scale-105 active:scale-95"
                >
                  <span className="font-bold text-3xl text-red-600">SPIN</span>
                </button>
              </div>

            </div>
          </div>
        </div>
        
        <div className="flex flex-col items-center order-1 lg:order-2">
          <div className="relative w-[360px] h-[202px] sm:w-[500px] sm:h-[281px] bg-gray-900 border-8 border-gray-800 rounded-lg shadow-2xl flex items-center justify-center text-center overflow-hidden">
             <div className="absolute inset-0 bg-black flex items-center justify-center p-4">
               {selectedItem ? (
                 <div className="flex flex-col items-center justify-center text-white animate-fade-in">
                   {selectedItem.imageUrl ? (
                       <Image src={selectedItem.imageUrl} alt={selectedItem.name} width={480} height={270} className="object-contain max-h-full" />
                   ) : (
                     <>
                       <h3 className="text-xl sm:text-2xl font-semibold tracking-wider">{selectedItem.name === "Try Again" ? "Better Luck Next Time!" : "Congratulations!"}</h3>
                       <p className="text-4xl sm:text-6xl font-bold mt-4 text-yellow-400" style={{ textShadow: "0 0 15px #facc15" }}>{selectedItem.name}</p>
                     </>
                   )}
                 </div>
               ) : mustSpin ? (
                  <div className="text-white text-2xl sm:text-3xl font-bold">Spinning...</div>
               ) : (
                 <div className="text-gray-400 text-lg sm:text-2xl font-semibold">
                   Spin the wheel to win a prize!
                 </div>
               )}
             </div>
             <div className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-r from-white/10 to-transparent -skew-x-12"></div>
          </div>
          <div className="w-4 h-12 bg-gray-700"></div>
          <div className="w-48 h-2 bg-gray-600 rounded-full shadow-lg"></div>
        </div>
      </div>
    </div>
  );
};

export default SpinTheWheel;