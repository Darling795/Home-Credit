"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Configuration, { WheelItem } from "./configurations";
import WinnerModal from './WinnerModal';

// @ts-ignore - spin-wheel doesn't have TypeScript definitions
import { Wheel } from 'spin-wheel';

const initialWheelItems: WheelItem[] = [
  { name: "Macbook Air" },
  { name: "Iphone 17 Air" },
  { name: "Iphone 17 Pro Max" },
  { name: "Airpods" },
  { name: "Magsafe" },
  { name: "Umbrella" },
  { name: "Tote Bag" },
  { name: "Tumbler" },
  { name: "Try Again" },
  { name: "Try Again" },
];
const camptonStack = '"Campton", "Arial", "Helvetica", sans-serif';
const SpinTheWheel: React.FC = () => {
  const wheelContainerRef = useRef<HTMLDivElement>(null);
  const wheelInstanceRef = useRef<any>(null);
  const [selectedItem, setSelectedItem] = useState<WheelItem | null>(null);
  const [wheelItems, setWheelItems] = useState<WheelItem[]>(initialWheelItems);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfigVisible, setIsConfigVisible] = useState(false);
  const [showAltLogo, setShowAltLogo] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);

  const handleSwapLogo = () => setShowAltLogo(v => !v);

  useEffect(() => {
    if (!wheelContainerRef.current || wheelItems.length === 0) return;

    // Clear previous wheel instance
    if (wheelInstanceRef.current) {
      wheelContainerRef.current.innerHTML = '';
    }

    // Prepare wheel items
    const items = wheelItems.map((item, index) => ({
      label: item.name.toUpperCase(),
      backgroundColor: index % 2 === 0 ? '#FFFFFF' : '#E30613',
      labelColor: index % 2 === 0 ? '#E30613' : '#FFFFFF',
    }));

    // Create wheel configuration
    const props = {
      items: items,
      borderWidth: 12,
      borderColor: '#000000',
      radius: 0.88,
      itemLabelRadius: 0.60,
      itemLabelRadiusMax: 0.20,
      itemLabelRotation: 0,
      itemLabelAlign: 'center',
      itemLabelColors: items.map(item => item.labelColor),
      itemLabelBaselineOffset: 0,
      itemLabelFont: 'Arial',
      itemLabelFontSizeMax: 10,
      itemBackgroundColors: items.map(item => item.backgroundColor),
      rotationSpeedMax: 500,
      rotationResistance: -100,
      lineWidth: 0,
      lineColor: 'transparent',
      onRest: (e: any) => {
        const winningIndex = e.currentIndex;
        const winningItem = wheelItems[winningIndex];
        setSelectedItem(winningItem);
        setIsSpinning(false);
        
        if (winningItem && !winningItem.name.toLowerCase().includes("try again")) {
          setTimeout(() => setIsModalOpen(true), 500);
        }
      }
    };

    // Initialize wheel
    const wheel = new Wheel(wheelContainerRef.current, props);
    wheelInstanceRef.current = wheel;

    return () => {
      if (wheelContainerRef.current) {
        wheelContainerRef.current.innerHTML = '';
      }
    };
  }, [wheelItems]);

  const handleSpinClick = () => {
    if (!wheelInstanceRef.current || isSpinning || wheelItems.length === 0) return;
    
    setIsSpinning(true);
    setSelectedItem(null);
    
    // Spin to a random item
    const randomIndex = Math.floor(Math.random() * wheelItems.length);
    wheelInstanceRef.current.spinToItem(randomIndex, 4000, true, 2, 1);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    if (selectedItem) {
      setWheelItems(prevItems => prevItems.filter(item => item.name !== selectedItem.name));
    }
    setSelectedItem(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 font-sans">
      <div className="w-full bg-white flex items-center justify-center py-6 px-8 shadow-lg">
        <div className="flex items-center gap-12 sm:gap-16">
          <Image
            src="/assets/HC-LOGO.png"
            alt="Home Credit"
            width={240}
            height={90}
            className="object-contain h-16 w-auto sm:h-20"
            priority
          />
          <div className="h-16 w-[2px]" style={{ backgroundColor: "#CCCCCC" }} />
          <button
            onClick={handleSwapLogo}
            className="focus:outline-none focus:ring-4 rounded-lg transition-transform hover:scale-105"
            style={{ outlineColor: "#E11931" }}
            aria-pressed={showAltLogo}
            aria-label="Swap logo"
            title="Swap logo"
          >
            <Image
              key={showAltLogo ? "aerophone" : "icenter"}
              src={showAltLogo ? "/assets/aerophone_Black_font.png" : "/assets/iCenter_Logo.png"}
              alt={showAltLogo ? "Aerophone" : "iCenter"}
              width={240}
              height={90}
              className="object-contain h-16 w-auto sm:h-20 transition-opacity duration-200"
              priority
            />
          </button>
        </div>
      </div>

      <div className="flex-1 relative flex w-full flex-col items-center justify-center gap-8 p-4 overflow-hidden">
        <div className="flex flex-col items-center justify-center text-center">
          <h1 className="text-5xl md:text-6xl font-black text-black tracking-wider mb-4">PLAY AND WIN</h1>
          

          <div className="relative w-[600px] h-[600px] md:w-[700px] md:h-[700px] flex items-center justify-center">
            <div 
              ref={wheelContainerRef} 
              className="w-full h-full"
              style={{ position: 'relative' }}
            />
            
            <button
              onClick={handleSpinClick}
              disabled={isSpinning || wheelItems.length === 0}
              className="absolute w-[28%] h-[28%] bg-[#E30613] rounded-full flex items-center justify-center text-center shadow-inner border-4 border-white z-20
                         transition-transform hover:scale-105 active:scale-95 disabled:cursor-not-allowed disabled:scale-100 disabled:opacity-75"
              style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
            >
              <div className="text-white font-black text-2xl md:text-3xl leading-tight tracking-wide">
                  <Image
            src="/assets/white.png"
            alt="Home Credit"
            width={240}
            height={90}
            className="object-contain h-16 w-auto sm:h-20"
            priority
          />
              </div>
            </button>
          </div>

          <button
            onClick={() => setIsConfigVisible(true)}
            className="rounded-2xl text-m font-bold text-white py-8 px-24 transition-all duration-300 shadow-2xl hover:scale-105 active:scale-95"
          style={{
            backgroundColor: "#E11931",
            boxShadow:
              "0 10px 40px rgba(225,25,49,0.5), 0 0 80px rgba(225,25,49,0.3)",
            fontFamily: camptonStack,
          }}
          >
            🎯 Customize Wheel
          </button>
        </div>
      </div>

      {/* Configuration Modal */}
      {isConfigVisible && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[80vh] overflow-hidden">
            <Configuration 
              items={wheelItems} 
              setItems={setWheelItems} 
              onItemsChange={() => setSelectedItem(null)} 
              onToggleVisibility={() => setIsConfigVisible(false)}
            />
          </div>
        </div>
      )}

      <WinnerModal 
        isOpen={isModalOpen} 
        item={selectedItem} 
        onClose={handleCloseModal} 
      />
    </div>
  );
};

export default SpinTheWheel;