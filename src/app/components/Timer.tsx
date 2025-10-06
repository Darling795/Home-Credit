"use client";

import Image from "next/image";
import React, { useEffect, useState, useRef } from "react";

const camptonStack = '"Campton", "Arial", "Helvetica", sans-serif';

// --- TimerDisplay component with 5-minute timer ---
const TimerDisplay: React.FC = () => {
  // CHANGED: Set initial time to 5 minutes (5 * 60 = 300 seconds)
  const initialTime = 300;
  const [time, setTime] = useState(initialTime);
  const [isActive, setIsActive] = useState(false);

  const countdownAudioRef = useRef<HTMLAudioElement>(null);
  const timesUpAudioRef = useRef<HTMLAudioElement>(null);
  const loopTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // This effect handles the timer countdown itself
  useEffect(() => {
    let timerId: ReturnType<typeof setInterval> | undefined;

    if (isActive && time > 0) {
      timerId = setInterval(() => setTime((t) => t - 1), 1000);
    } else if (time === 0 && isActive) {
      setIsActive(false);
      // Stop the countdown music when time is up
      if (countdownAudioRef.current) {
        countdownAudioRef.current.pause();
        countdownAudioRef.current.currentTime = 0;
      }
      // Clear any pending loop timeout
      if (loopTimeoutRef.current) {
        clearTimeout(loopTimeoutRef.current);
      }
      // Play the "Time's Up!" sound
      timesUpAudioRef.current?.play();
    }

    return () => {
      if (timerId) clearInterval(timerId);
    };
  }, [isActive, time]);
  
  // This effect handles setting up the custom audio loop with a delay
  useEffect(() => {
    const audio = countdownAudioRef.current;
    if (!audio) return;

    // Function to handle the end of audio playback
    const handleAudioEnd = () => {
      // If the timer is still active, schedule the next playback
      if (isActive) {
        loopTimeoutRef.current = setTimeout(() => {
          audio.play();
        }, 250); // 0.5 second delay
      }
    };

    // Add the event listener
    audio.addEventListener('ended', handleAudioEnd);

    // Cleanup function to remove the listener and clear timeout
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
    // Start playing the countdown music for the first time
    countdownAudioRef.current?.play();
  };

  const handleRestart = () => {
    setIsActive(false);
    setTime(initialTime);
    
    // Stop and reset the countdown music
    if (countdownAudioRef.current) {
      countdownAudioRef.current.pause();
      countdownAudioRef.current.currentTime = 0;
    }
    // Clear the pending timeout to prevent it from playing again
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

  return (
    <>
      <audio ref={countdownAudioRef} src="/assets/countdown-music.mp3" />
      <audio ref={timesUpAudioRef} src="/assets/times-up-sound.mp3" />

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
    </>
  );
};


// --- EventScene component (No changes here) ---
const EventScene: React.FC = () => {

  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      {/* Header with logos */}
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

          {/* Logo 2 - PowerMac */}
          <Image
            src="/assets/Powermac-logo.png"
            alt="PowerMac Center"
            width={240}
            height={90}
            className="object-contain h-16 w-auto sm:h-20"
            priority
          />
        </div>
      </div>

      {/* Center content */}
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
            marginBottom: "1rem",
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