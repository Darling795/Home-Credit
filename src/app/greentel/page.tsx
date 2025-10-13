"use client";

import Image from "next/image";
import React, { useEffect, useState, useRef } from "react";

const camptonStack = '"Campton", "Arial", "Helvetica", sans-serif';

// --- TimerDisplay component with TV screen optimizations ---
const TimerDisplay: React.FC = () => {
  const initialTime = 300; // 5 minutes
  const [time, setTime] = useState(initialTime);
  const [isActive, setIsActive] = useState(false);

  const countdownAudioRef = useRef<HTMLAudioElement>(null);
  const timesUpAudioRef = useRef<HTMLAudioElement>(null);
  const loopTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // useEffect hooks for timer logic and audio handling remain the same...
  useEffect(() => {
    let timerId: ReturnType<typeof setInterval> | undefined;

    if (isActive && time > 0) {
      timerId = setInterval(() => setTime((t) => t - 1), 1000);
    } else if (time === 0 && isActive) {
      setIsActive(false);
      if (countdownAudioRef.current) {
        countdownAudioRef.current.pause();
        countdownAudioRef.current.currentTime = 0;
      }
      if (loopTimeoutRef.current) {
        clearTimeout(loopTimeoutRef.current);
      }
      timesUpAudioRef.current?.play();
    }

    return () => {
      if (timerId) clearInterval(timerId);
    };
  }, [isActive, time]);
  
  useEffect(() => {
    const audio = countdownAudioRef.current;
    if (!audio) return;

    const handleAudioEnd = () => {
      if (isActive) {
        loopTimeoutRef.current = setTimeout(() => {
          audio.play();
        }, 250);
      }
    };

    audio.addEventListener('ended', handleAudioEnd);

    return () => {
      audio.removeEventListener('ended', handleAudioEnd);
      if (loopTimeoutRef.current) {
        clearTimeout(loopTimeoutRef.current);
      }
    };
  }, [isActive]);

  const handleStart = () => {
    if (time === 0) setTime(initialTime);
    setIsActive(true);
    countdownAudioRef.current?.play();
  };

  const handleRestart = () => {
    setIsActive(false);
    setTime(initialTime);
    
    if (countdownAudioRef.current) {
      countdownAudioRef.current.pause();
      countdownAudioRef.current.currentTime = 0;
    }
    if (loopTimeoutRef.current) {
      clearTimeout(loopTimeoutRef.current);
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const isTimeUp = time === 0;

  // CHANGED FOR TV: Use `min(vw, vh)` to make font size responsive to both width and height.
  const timerFontSize = isTimeUp 
    ? "clamp(3.5rem, min(12vw, 18vh), 10rem)" // Min 56px, Preferred is smaller of 12% width or 18% height, Max 160px
    : "clamp(5rem, min(20vw, 30vh), 18rem)";   // Min 80px, Preferred is smaller of 20% width or 30% height, Max 288px

  return (
    <>
      <audio ref={countdownAudioRef} src="/assets/countdown-music.mp3" />
      <audio ref={timesUpAudioRef} src="/assets/times-up-sound.mp3" />

      {/* CHANGED FOR TV: Reduced vertical gap */}
      <div className="flex flex-col items-center gap-6 md:gap-8 lg:gap-10">
        <div
          className="font-mono font-black tracking-wider leading-none transition-all duration-300 text-center"
          style={{
            fontSize: timerFontSize, // Applied the new aspect-ratio-aware font size
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
            // CHANGED FOR TV: Slightly smaller text and padding on large screens to save vertical space
            className="rounded-2xl font-bold text-white transition-all duration-300 shadow-2xl hover:scale-105 active:scale-95 text-3xl py-4 px-12 sm:text-4xl md:text-5xl lg:text-5xl lg:py-6 lg:px-20"
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
            // CHANGED FOR TV: Slightly smaller text and padding on large screens to save vertical space
            className="rounded-2xl font-bold text-white transition-all duration-300 shadow-2xl hover:scale-105 active:scale-95 text-3xl py-4 px-12 sm:text-4xl md:text-5xl lg:text-5xl lg:py-6 lg:px-20"
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
    </>
  );
};


// --- EventScene component with TV screen optimizations ---
const EventScene: React.FC = () => {

  return (
    // Add overflow-hidden to prevent scrollbars on unusual aspect ratios
    <div className="min-h-screen flex flex-col bg-black text-white overflow-hidden">
      {/* Header with logos */}
      <div className="w-full bg-white flex items-center justify-center py-4 px-6 sm:py-5 sm:px-8 shadow-2xl">
        <div className="flex items-center gap-8 sm:gap-12 lg:gap-16">
          {/* Logo 1 */}
          <Image
            src="/assets/HC-LOGO.png"
            alt="Home Credit"
            width={240}
            height={90}
            // CHANGED FOR TV: More conservative height on larger screens
            className="object-contain h-12 w-auto sm:h-14 md:h-16 lg:h-20"
            priority
          />

          {/* Divider */}
          <div className="h-12 w-[2px] sm:h-14 md:h-16 lg:h-20" style={{ backgroundColor: "#CCCCCC" }} />

          {/* Logo 2 */}
          <Image
            src="/assets/greentel.png"
            alt="greentel"
            width={240}
            height={90}
            // CHANGED FOR TV: More conservative height on larger screens
            className="object-contain h-12 w-auto sm:h-14 md:h-16 lg:h-20"
            priority
          />
        </div>
      </div>

      {/* Center content */}
      {/* CHANGED FOR TV: Reduced padding and gap for more vertical room */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 gap-4 md:gap-6">
        <h2
          style={{
            fontFamily: camptonStack,
            fontWeight: 800,
            fontStyle: "italic",
            // CHANGED FOR TV: Also constrain title font size with viewport height
            fontSize: "clamp(28px, min(7vw, 9vh), 72px)",
            color: "#E11931",
            textShadow:
              "0 0 20px rgba(225,25,49,0.8), 0 0 40px rgba(225,25,49,0.5), 0 0 60px rgba(225,25,49,0.3), 0 6px 15px rgba(0,0,0,0.5)",
            letterSpacing: "0.01em",
            lineHeight: 1.1,
            textAlign: "center",
            marginBottom: "0.5rem", // Reduced margin
            maxWidth: "92%",
          }}
        >
          <span className="block">Home Credit's</span>
          <span className="block">Free iPhone Challenge</span>
        </h2>
        <TimerDisplay />
      </div>
    </div>
  );
};

export default EventScene;