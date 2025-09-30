"use client";

import React, { useState, useEffect } from "react";
import dynamic from 'next/dynamic';
import Image from "next/image";
import Configuration, { WheelItem } from "./configurations";
import WinnerModal from './WinnerModal';

const Wheel = dynamic(
  () => import('react-custom-roulette').then((mod) => mod.Wheel),
  { ssr: false }
);

const initialWheelItems: WheelItem[] = [
  { name: "Macbook Air" },
  { name: "Iphone 17 Air" },
  { name: "Iphone 17 Pro Max" },
  { name: "Airpods" },
  { name: "Magsafe" },
  { name: "Umbrella" },
  { name: "Tote Bag" },
  { name: "Tumbler" },
  { name: "Thankyou for trying" },
  { name: "Thankyou for trying" },
];

interface WheelData {
  option?: string;
  image?: { uri: string; sizeMultiplier: number; offsetY: number };
  style?: {
    backgroundColor?: string;
    textColor?: string;
  };
}

const createTextAsImage = (
  text: string,
  textColor: string,
  canvasWidth: number,
  canvasHeight: number
): Promise<string> => {
  return new Promise((resolve) => {
    const canvas = document.createElement("canvas");
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return resolve("");

    ctx.fillStyle = textColor;
    ctx.font = "800 48px Arial, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    const wrapText = (context: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, lineHeight: number) => {
      const words = text.split(' ');
      let line = '';
      let lines = [];

      for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + ' ';
        const metrics = context.measureText(testLine);
        const testWidth = metrics.width;
        if (testWidth > maxWidth && n > 0) {
          lines.push(line);
          line = words[n] + ' ';
        } else {
          line = testLine;
        }
      }
      lines.push(line);
      
      const totalHeight = lines.length * lineHeight;
      let startY = y - totalHeight / 2 + lineHeight / 2;

      for(let k=0; k<lines.length; k++){
        context.fillText(lines[k].trim(), x, startY + (k * lineHeight));
      }
    };
    wrapText(ctx, text, canvasWidth / 2, canvasHeight / 2, 480, 52); 
    resolve(canvas.toDataURL("image/png"));
  });
};


const SpinTheWheel: React.FC = () => {
  const [mustSpin, setMustSpin] = useState(false);
  const [prizeNumber, setPrizeNumber] = useState(0);
  const [selectedItem, setSelectedItem] = useState<WheelItem | null>(null);
  const [wheelItems, setWheelItems] = useState<WheelItem[]>(initialWheelItems);
  const [processedWheelData, setProcessedWheelData] = useState<WheelData[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isConfigVisible, setIsConfigVisible] = useState(true);
  const [showAltLogo, setShowAltLogo] = useState(false);
  const handleSwapLogo = () => setShowAltLogo(v => !v);

  useEffect(() => {
    const processItems = async () => {
      setIsLoading(true);
      const dataPromises = wheelItems.map(async (item, index) => {
        const isWhiteSegment = index % 2 === 0;
        const textColor = isWhiteSegment ? '#E30613' : '#FFFFFF';
        
        const imageUri = await createTextAsImage(item.name, textColor, 500, 300);

        return {
          option: '',
          image: {
            uri: imageUri,
            sizeMultiplier: 0.7,
            offsetY: -20,
          },
          style: {
            backgroundColor: isWhiteSegment ? '#FFFFFF' : '#E30613',
          },
        };
      });

      const data = await Promise.all(dataPromises);
      setProcessedWheelData(data);
      setIsLoading(false);
    };

    if (wheelItems.length > 0) {
      processItems();
    } else {
      setProcessedWheelData([]);
    }
  }, [wheelItems]);

  const handleSpinClick = () => {
    if (!mustSpin && wheelItems.length > 0 && !isLoading) {
      const newPrizeNumber = Math.floor(Math.random() * wheelItems.length);
      setPrizeNumber(newPrizeNumber);
      setMustSpin(true);
      setSelectedItem(null);
    }
  };
  
  const handleStopSpinning = () => {
    setMustSpin(false);
    const winningItem = wheelItems[prizeNumber];
    setSelectedItem(winningItem);
    
    if (winningItem && !winningItem.name.toLowerCase().includes("thankyou for trying")) {
      setTimeout(() => setIsModalOpen(true), 500);
    }
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
            src="/assets/HC-Logo-Horizontal.png"
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
              src={ showAltLogo ? "/assets/aerophone_Black_font.png" : "/assets/iCenter_Logo.png" }
              alt={showAltLogo ? "Aerophone" : "iCenter"}
              width={240}
              height={90}
              className="object-contain h-16 w-auto sm:h-20 transition-opacity duration-200"
              priority
            />
          </button>
        </div>
      </div>

      <div className="flex-1 relative flex w-full flex-col items-center justify-center gap-12 p-4 lg:flex-row lg:items-start lg:p-8 overflow-hidden">
        <div className="flex flex-col items-center justify-center mt-8 text-center">
          <h1 className="text-5xl md:text-6xl font-black text-black tracking-wider mb-8">PLAY AND WIN</h1>

          <div className="relative w-[380px] h-[380px] sm:w-[500px] sm:h-[500px] flex items-center justify-center">
            {isLoading && wheelItems.length > 0 ? (
              <div className="text-gray-500 font-semibold">Generating Wheel...</div>
            ) : (
              <Wheel
                mustStartSpinning={mustSpin}
                prizeNumber={prizeNumber}
                data={processedWheelData}
                onStopSpinning={handleStopSpinning}
                outerBorderColor={'#000000'}
                outerBorderWidth={12}
                radiusLineColor={'transparent'}
                radiusLineWidth={0}
                spinDuration={0.5}
              />
            )}
            
            <button
              onClick={handleSpinClick}
              disabled={mustSpin || isLoading || wheelItems.length === 0}
              // REVISION: The `before:*` classes that created the black pin have been removed.
              className="absolute w-[28%] h-[28%] bg-[#E30613] rounded-full flex items-center justify-center text-center shadow-inner border-4 border-white z-20
                         transition-transform hover:scale-105 active:scale-95 disabled:cursor-not-allowed disabled:scale-100 disabled:opacity-75"
            >
              <div className="text-white font-black text-xl md:text-2xl leading-tight tracking-wide">
                HOME<br/>CREDIT
              </div>
            </button>
          </div>
        </div>

        <div className="w-full max-w-sm lg:w-[350px] flex-shrink-0 z-20 mt-8 lg:mt-24">
          {isConfigVisible ? (
            <Configuration 
              items={wheelItems} 
              setItems={setWheelItems} 
              onItemsChange={() => setSelectedItem(null)} 
              onToggleVisibility={() => setIsConfigVisible(false)}
            />
          ) : (
            <button
              onClick={() => setIsConfigVisible(true)}
              className="w-full bg-white/80 backdrop-blur-md p-4 rounded-lg shadow-2xl border border-gray-200 text-gray-900 text-lg font-bold hover:bg-gray-200"
            >
              Show Panel
            </button>
          )}
        </div>
      </div>

      <WinnerModal 
        isOpen={isModalOpen} 
        item={selectedItem} 
        onClose={handleCloseModal} 
      />
    </div>
  );
};

export default SpinTheWheel;