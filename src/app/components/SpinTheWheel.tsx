"use client";

import Image from "next/image";
import React, { useState, useEffect } from "react";
import dynamic from 'next/dynamic'; // <-- Import dynamic
import Configuration, { WheelItem } from "./configurations";

// --- FIX: Dynamic Import for Client-Side Only Component ---
// This tells Next.js to only load the Wheel component on the client side,
// preventing the "window is not defined" error during server-side rendering.
const Wheel = dynamic(
  () => import('react-custom-roulette').then((mod) => mod.Wheel),
  { ssr: false }
);

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

interface WheelData {
  option: string;
  image?: { uri: string; sizeMultiplier: number; offsetY: number };
}

const SpinTheWheel: React.FC = () => {
  const [mustSpin, setMustSpin] = useState(false);
  const [prizeNumber, setPrizeNumber] = useState(0);
  const [selectedItem, setSelectedItem] = useState<WheelItem | null>(null);
  const [wheelItems, setWheelItems] = useState<WheelItem[]>(initialWheelItems);
  const [processedWheelData, setProcessedWheelData] = useState<WheelData[]>([]);

  useEffect(() => {
    return () => {
      wheelItems.forEach(item => {
        if (item.imageUrl && item.imageUrl.startsWith('blob:')) {
          URL.revokeObjectURL(item.imageUrl);
        }
      });
    };
  }, []);

  useEffect(() => {
    const processItems = async () => {
      const data: WheelData[] = [];
      for (const item of wheelItems) {
        if (item.imageUrl) {
          try {
            const newImageUri = await createImageWithText(item.imageUrl, item.name);
            data.push({
              option: '',
              image: {
                uri: newImageUri,
                sizeMultiplier: 0.8,
                offsetY: -10,
              },
            });
          } catch (error) {
            console.error("Error creating image with text:", error);
            data.push({ option: truncateText(item.name) });
          }
        } else {
          data.push({ option: truncateText(item.name) });
        }
      }
      setProcessedWheelData(data);
    };

    processItems();
  }, [wheelItems]);

  const handleSpin = () => {
    if (!mustSpin && wheelItems.length > 0) {
      const newPrizeNumber = Math.floor(Math.random() * wheelItems.length);
      setPrizeNumber(newPrizeNumber);
      setMustSpin(true);
      setSelectedItem(null);
    }
  };

  const truncateText = (text: string, maxLength = 15) => {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  const createImageWithText = (imageUrl: string, text: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return reject('Could not get canvas context');

      const img = new window.Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        const canvasWidth = 300;
        const canvasHeight = 300;
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;

        const imageSize = 150;
        const imageY = 40;

        const textY = imageY + imageSize + 25;
        ctx.font = 'bold 24px Arial';
        ctx.fillStyle = '#BE123C';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        ctx.drawImage(img, (canvasWidth - imageSize) / 2, imageY, imageSize, imageSize);
        ctx.fillText(truncateText(text, 18), canvasWidth / 2, textY);

        resolve(canvas.toDataURL('image/png'));
      };
      img.onerror = () => reject('Failed to load image');
      img.src = imageUrl;
    });
  };

  return (
    <div
      // --- CHANGE HERE: Updated the background color ---
      className="relative flex min-h-screen w-full items-center justify-center p-4 lg:p-8 overflow-hidden bg-red-900"
    >
      <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-12 w-full max-w-screen-xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-16">
            <div className="relative z-10 drop-shadow-2xl order-2 lg:order-1">
              <div className="w-[380px] h-[480px] sm:w-[420px] sm:h-[550px] bg-black border-4 border-gray-700 rounded-3xl p-4 flex flex-col items-center justify-center">
                <div className="w-full h-full bg-white rounded-xl flex flex-col items-center justify-center relative">
                  
                  {/* This empty div can be used as the new static pointer */}
                  <div className="absolute top-[-20px] z-20 w-0 h-0 border-l-[20px] border-l-transparent border-r-[20px] border-r-transparent border-b-[30px] border-b-gray-700"></div>

                  <div className="relative w-80 h-80 sm:w-96 sm:h-96 flex items-center justify-center my-4">
                    {processedWheelData.length > 0 && (
                      <Wheel
                        mustStartSpinning={mustSpin}
                        prizeNumber={prizeNumber}
                        data={processedWheelData}
                        onStopSpinning={() => {
                          setMustSpin(false);
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
              <Image 
                src="/assets/Home_Credit_logo.svg.png" 
                alt="Home Credit Logo" 
                width={150} 
                height={50} 
                className="mt-8 opacity-75"
              />
            </div>
        </div>

        <div className="w-full max-w-[350px] lg:w-[350px] flex-shrink-0 z-20">
          <Configuration items={wheelItems} setItems={setWheelItems} onItemsChange={() => setSelectedItem(null)} />
        </div>

      </div>
    </div>
  );
};

export default SpinTheWheel;