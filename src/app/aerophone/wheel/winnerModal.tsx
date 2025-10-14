import React, { useEffect, useState, useMemo } from 'react';

// --- REMOVED: useWindowSize hook is no longer needed ---
// const useWindowSize = () => { ... };

// --- ADDED: New CSS for our custom confetti ---
const GlobalStyles = () => (
    <style jsx global>{`
      @keyframes slide-in-from-top {
        0% { transform: translateY(-100%); opacity: 0; }
        100% { transform: translateY(0); opacity: 1; }
      }
      @keyframes scale-in-with-pop {
        0% { transform: scale(0.5); opacity: 0; }
        75% { transform: scale(1.1); opacity: 1; }
        100% { transform: scale(1); opacity: 1; }
      }
      @keyframes slide-in-from-bottom {
        0% { transform: translateY(100%); opacity: 0; }
        100% { transform: translateY(0); opacity: 1; }
      }
      .animate-slide-in-from-top { animation: slide-in-from-top 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) both; }
      .animate-scale-in-with-pop { animation: scale-in-with-pop 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) both; }
      .animate-slide-in-from-bottom { animation: slide-in-from-bottom 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) both; }
      
      /* --- CSS Confetti Styles --- */
      @keyframes fall {
        0% {
          transform: translateY(-10vh) rotate(0deg);
          opacity: 1;
        }
        100% {
          transform: translateY(110vh) rotate(720deg);
          opacity: 0;
        }
      }
      .confetti-piece {
        position: absolute;
        width: 10px;
        height: 16px;
        top: -20px;
        animation-name: fall;
        animation-timing-function: linear;
        animation-iteration-count: infinite;
      }
    `}</style>
  );
  
const TrophyIcon = () => ( /* ... SVG code remains the same ... */ <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-full h-full"><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9a9 9 0 119 0zM19.5 18.75h-15a2.25 2.25 0 01-2.25-2.25V6.75A2.25 2.25 0 014.5 4.5h15a2.25 2.25 0 012.25 2.25v10.5A2.25 2.25 0 0119.5 18.75zM9 13.5l3 3m0 0l3-3m-3 3v-6m1.5-9V3.75A2.25 2.25 0 0012 1.5h0A2.25 2.25 0 009.75 3.75V4.5" /></svg>);

// --- ADDED: A new dependency-free confetti component ---
const CssConfetti: React.FC<{ numberOfPieces?: number }> = ({ numberOfPieces = 150 }) => {
  const confettiPieces = useMemo(() => {
    const pieces = [];
    const colors = ['#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5', '#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4caf50', '#8bc34a', '#cddc39', '#ffeb3b', '#ffc107', '#ff9800'];
    
    for (let i = 0; i < numberOfPieces; i++) {
      pieces.push(
        <div
          key={i}
          className="confetti-piece"
          style={{
            left: `${Math.random() * 100}vw`,
            backgroundColor: colors[Math.floor(Math.random() * colors.length)],
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${3 + Math.random() * 5}s`,
            transform: `rotate(${Math.random() * 360}deg)`,
          }}
        />
      );
    }
    return pieces;
  }, [numberOfPieces]);

  return <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">{confettiPieces}</div>;
};


interface WheelItem {
  name: string;
}

interface WinnerModalProps {
  isOpen: boolean;
  item: WheelItem | null;
  onClose: () => void;
}

const WinnerModal: React.FC<WinnerModalProps> = ({ isOpen, item, onClose }) => {
  // --- REMOVED: const { width, height } = useWindowSize(); ---
  
  if (!isOpen || !item) return null;

  return (
    <>
      <GlobalStyles />
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
        
        {/* --- REPLACED: react-confetti is now our CssConfetti component --- */}
        <CssConfetti />
        
        <div className="relative z-10 font-sans bg-white text-black rounded-3xl shadow-2xl w-full text-center border-4 border-yellow-300 overflow-hidden
                       max-w-3xl p-6 sm:p-10 md:p-12">
          
          <div className="absolute inset-0 flex items-center justify-center opacity-5 text-gray-400 -z-10 p-16">
            <TrophyIcon />
          </div>

          <h2 
            className="text-4xl sm:text-5xl md:text-6xl font-black mb-4 uppercase leading-tight animate-slide-in-from-top bg-gradient-to-br from-[#E30613] to-[#a1040d] bg-clip-text text-transparent"
            style={{ animationDelay: '100ms' }}
          >
            Congratulations!
          </h2>
          
          <p 
            className="text-xl sm:text-2xl text-gray-600 mb-6 font-medium animate-slide-in-from-top"
            style={{ animationDelay: '250ms' }}
          >
            You won:
          </p>

          <div 
            className="my-8 p-6 rounded-2xl bg-gray-500/10 animate-scale-in-with-pop"
            style={{ 
              background: 'radial-gradient(circle, rgba(227,6,19,0.08) 0%, rgba(255,255,255,0) 70%)',
              animationDelay: '400ms' 
            }}
          >
            <p 
              className="text-4xl sm:text-6xl md:text-7xl font-extrabold text-black break-words"
            >
              {item.name}
            </p>
          </div>

          <button
            onClick={onClose}
            className="bg-[#E30613] text-white font-bold py-4 px-12 rounded-xl text-lg transition-all duration-300 shadow-lg shadow-red-500/40 hover:bg-red-700 hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-red-400 animate-slide-in-from-bottom"
            style={{ animationDelay: '600ms' }}
          >
            Claim Prize & Continue
          </button>
        </div>
      </div>
    </>
  );
};

export default WinnerModal;