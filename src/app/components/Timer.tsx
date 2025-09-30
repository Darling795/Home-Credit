"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";

const camptonStack = '"Campton", "Arial", "Helvetica", sans-serif';

// --- TimerDisplay component with "Time's Up!" and "Restart" logic is kept ---
const TimerDisplay: React.FC = () => {
  const initialTime = 60;
  const [time, setTime] = useState(initialTime);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let timerId: ReturnType<typeof setInterval> | undefined;
    if (isActive && time > 0) {
      timerId = setInterval(() => setTime(t => t - 1), 1000);
    } else if (time === 0) {
      setIsActive(false);
    }
    return () => { if (timerId) clearInterval(timerId); };
  }, [isActive, time]);

  const handleStart = () => {
    if (time === 0) setTime(initialTime);
    setIsActive(true);
  };
  
  const handleRestart = () => {
    setIsActive(false);
    setTime(initialTime);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const isTimeUp = time === 0;

  return (
    <div className="flex flex-col items-center gap-16">
      <div
        className={`font-mono font-black tracking-wider leading-none transition-all duration-300 ${
          isTimeUp ? "text-[12vw]" : "text-[20vw]"
        }`}
        style={{
          color: "#E11931",
          textShadow:
            "0 0 30px rgba(225,25,49,0.8), 0 0 60px rgba(225,25,49,0.5), 0 0 90px rgba(225,25,49,0.3), 0 8px 20px rgba(0,0,0,0.5)",
          WebkitTextStroke: "2px rgba(225,25,49,0.3)",
        }}
      >
        {isTimeUp ? "Time's Up!" : formatTime(time)}
      </div>

      {!isActive ? (
        <button
          onClick={handleStart}
          className="rounded-2xl text-6xl font-bold text-white py-8 px-24 transition-all duration-300 shadow-2xl hover:scale-105 active:scale-95"
          style={{
            backgroundColor: "#E11931",
            boxShadow:
              "0 10px 40px rgba(225,25,49,0.5), 0 0 80px rgba(225,25,49,0.3)",
            fontFamily: camptonStack,
          }}
        >
          {isTimeUp ? "Restart" : "Start"}
        </button>
      ) : (
        <button
          onClick={handleRestart}
          className="rounded-2xl text-6xl font-bold text-white py-8 px-24 transition-all duration-300 shadow-2xl hover:scale-105 active:scale-95"
          style={{
            backgroundColor: "#787878",
            boxShadow: "0 10px 40px rgba(120,120,120,0.5)",
            fontFamily: camptonStack,
          }}
        >
          Restart
        </button>
      )}
    </div>
  );
};


// --- EventScene component layout has been reverted ---
const EventScene: React.FC = () => {
  // Toggle Logo 2 between iCenter and Aerophone
  const [showAltLogo, setShowAltLogo] = useState(false);
  const handleSwapLogo = () => setShowAltLogo(v => !v);

  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      {/* REVERT: The top header structure is restored as it was originally. */}
      <div className="w-full bg-white flex items-center justify-center py-6 px-8 shadow-2xl">
        <div className="flex items-center gap-12 sm:gap-16">
          {/* Logo 1 */}
          <Image
            src="/assets/HC-LOGO.png"
            alt="Home Credit"
            width={240}
            height={90}
            className="object-contain h-16 w-auto sm:h-20"
            priority
          />

          {/* Divider */}
          <div className="h-16 w-[2px]" style={{ backgroundColor: "#CCCCCC" }} />

          {/* Logo 2 (click to swap) */}
          <button
            onClick={handleSwapLogo}
            className="focus:outline-none focus:ring-4 rounded-lg transition-transform hover:scale-105"
            style={{ outlineColor: "#E11931" }}
            aria-pressed={showAltLogo}
            aria-label="Swap logo"
            title="Swap logo"
          >
            <Image
              key={showAltLogo ? "aerophone" : "icenter"} // forces re-render
              src={
                showAltLogo
                  ? "/assets/aerophone_Black_font.png"
                  : "/assets/iCenter_Logo.png"
              }
              alt={showAltLogo ? "Aerophone" : "iCenter"}
              width={240}
              height={90}
              className="object-contain h-16 w-auto sm:h-20 transition-opacity duration-200"
              priority
            />
          </button>
        </div>
      </div>

      {/* REVERT: Center content no longer contains the logos. */}
      <div className="flex-1 flex flex-col items-center justify-center p-12 gap-8">
        <h2
          style={{
            fontFamily: camptonStack,
            fontWeight: 800,
            fontStyle: "italic",
            fontSize: "8vw",
            color: "#E11931",
            textShadow:
              "0 0 20px rgba(225,25,49,0.8), 0 0 40px rgba(225,25,49,0.5), 0 0 60px rgba(225,25,49,0.3), 0 6px 15px rgba(0,0,0,0.5)",
            letterSpacing: "0.02em",
            marginBottom: "1rem", // Margin is restored
          }}
        >
          The Buzzwire
        </h2>
        <TimerDisplay />
      </div>
    </div>
  );
};

export default EventScene;