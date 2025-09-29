"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";

// Helper component for the timer display with responsive text size
const TimerDisplay: React.FC = () => {
  const initialTime = 23 * 3600 + 59 * 60 + 29;
  const [time, setTime] = useState(initialTime);

  useEffect(() => {
    const timerInterval = setInterval(() => {
      setTime((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
    }, 1000);

    return () => clearInterval(timerInterval);
  }, []);

  const formatTime = (seconds: number): string => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;

    return `${h.toString().padStart(2, "0")}:${m
      .toString()
      .padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div
      // Responsive text size: smaller on mobile, larger on desktop
      className="text-6xl md:text-7xl lg:text-8xl font-mono font-bold text-red-500 tracking-wider"
      style={{
        textShadow:
          "0 0 10px rgba(239, 68, 68, 0.7), 0 0 20px rgba(239, 68, 68, 0.5), 0 0 30px rgba(239, 68, 68, 0.3)",
      }}
    >
      {formatTime(time)}
    </div>
  );
};

// Main component that builds the entire scene
const EventScene: React.FC = () => {
  return (
    <div
      className="relative flex min-h-screen w-full items-center justify-center text-white p-6 md:p-12 overflow-hidden"
      // New radial gradient for a spotlight effect
      style={{
        background:
          "radial-gradient(circle, rgba(60,0,0,1) 0%, rgba(0,0,0,1) 80%)",
      }}
    >
      {/* Container to handle responsive layout */}
      <div className="relative w-full max-w-screen-2xl flex flex-col lg:flex-row justify-around items-center gap-20 lg:gap-8">
        
        {/* Floor shadow to ground the elements */}
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-black/50 to-transparent blur-2xl z-0"></div>

        {/* Left Side: The Buzzwire Game Stand */}
        <div className="flex flex-col items-center z-10 w-full max-w-md lg:w-96">
          <div
            className="bg-black/80 border-2 border-neutral-800 p-6 rounded-lg w-full flex flex-col justify-between"
            style={{ boxShadow: "inset 0 0 25px -10px #000" }}
          >
            <div>
              <h2
                className="text-3xl text-red-400 italic font-serif mb-4"
                style={{ textShadow: "0 0 12px rgba(220, 38, 38, 0.6)" }}
              >
                The Buzzwire
              </h2>
              <div className="border border-neutral-600 p-4 text-base text-neutral-300">
                <p className="font-bold mb-2">
                  YOU HAVE 60 SECONDS to guide the metal loop along the wire.
                </p>
                <p>
                  Navigate the loop from start to finish without making contact
                  with the edges. Touching the edges will trigger a buzz sound,
                  indicating you have failed the challenge.
                </p>
              </div>
            </div>
            <div className="flex justify-center mt-6">
              <Image
                src="/assets/Home_Credit_Logo.svg.png"
                alt="Home Credit Logo"
                width={90}
                height={35}
              />
            </div>
          </div>
          {/* Stand */}
          <div className="w-6 h-32 bg-neutral-900"></div>
          <div className="w-56 h-5 bg-neutral-900"></div>
        </div>

        {/* Centerpiece: Unlock It with Home Credit Stand */}
        <div className="flex flex-col items-center z-10 w-full max-w-lg lg:w-[550px]">
          <div className="bg-red-600 border-[12px] border-white p-8 rounded-xl w-full flex flex-col items-center justify-center text-center shadow-2xl shadow-black">
            <p
              className="text-4xl lg:text-5xl text-white font-black tracking-wider"
              style={{ textShadow: "3px 3px 6px rgba(0,0,0,0.6)" }}
            >
              UNLOCK IT WITH
            </p>
            <h2
              className="text-6xl lg:text-8xl text-white font-black tracking-normal mt-2"
              style={{
                textShadow:
                  "3px 3px 0 #ca8a04, 6px 6px 10px rgba(0,0,0,0.7)",
              }}
            >
              HOME CREDIT
            </h2>
          </div>
          {/* Stand */}
          <div className="w-8 h-32 bg-neutral-900"></div>
          <div className="w-72 h-5 bg-neutral-900"></div>
        </div>

        {/* Right Side: The Timer Stand */}
        <div className="flex flex-col items-center z-10 w-full max-w-lg lg:w-[550px]">
          <h1 className="text-2xl lg:text-3xl font-semibold mb-4 text-white tracking-wider text-center">
            WIN A BRAND NEW PHONE
          </h1>
          <div
            className="bg-black/80 border-2 border-neutral-800 p-8 rounded-lg w-full flex flex-col items-center justify-center"
            style={{ boxShadow: "inset 0 0 25px -10px #000" }}
          >
            <h2
              className="text-3xl lg:text-4xl text-red-400 italic font-serif mb-8"
              style={{ textShadow: "0 0 12px rgba(220, 38, 38, 0.6)" }}
            >
              The Buzzwire
            </h2>
            <TimerDisplay />
            <div className="mt-8">
              <Image
                src="/assets/Home_Credit_Logo.svg.png"
                alt="Home Credit Logo"
                width={120}
                height={50}
              />
            </div>
          </div>
          {/* Stand */}
          <div className="w-8 h-32 bg-neutral-900"></div>
          <div className="w-72 h-5 bg-neutral-900"></div>
        </div>
      </div>
    </div>
  );
};

export default EventScene;