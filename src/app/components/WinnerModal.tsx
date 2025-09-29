import React from 'react';

interface WheelItem {
  name: string;
}

interface WinnerModalProps {
  isOpen: boolean;
  item: WheelItem | null;
  onClose: () => void;
}

const WinnerModal: React.FC<WinnerModalProps> = ({ isOpen, item, onClose }) => {
  if (!isOpen || !item) return null;

  return (
    // Overlay container
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 backdrop-blur-sm animate-fade-in">
      {/* --- REMOVED: Custom campton font class. Added font-sans for consistency. --- */}
      <div className="font-sans bg-white text-black rounded-2xl shadow-2xl p-8 max-w-lg w-full text-center border-4 border-gray-200">
        <h2 className="text-4xl font-black text-[#E30613] mb-2 uppercase">Congratulations!</h2>
        <p className="text-xl text-gray-700 mb-6 font-semibold">You won:</p>
        <p 
          className="text-5xl font-extrabold mb-8 text-black" 
          style={{ textShadow: "0 0 15px rgba(227, 6, 19, 0.4)" }}
        >
          {item.name}
        </p>
        <button
          onClick={onClose}
          className="bg-[#E30613] text-white font-bold py-3 px-8 rounded-lg hover:bg-red-700 transition-transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
        >
          Claim Prize & Continue
        </button>
      </div>
    </div>
  );
};

export default WinnerModal;