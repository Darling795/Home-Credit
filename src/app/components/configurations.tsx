"use client";

import React, { useState } from 'react';

// --- CHANGE: Simplified interface, no imageUrl ---
export interface WheelItem {
  name: string;
}

interface ConfigurationProps {
  items: WheelItem[];
  setItems: React.Dispatch<React.SetStateAction<WheelItem[]>>;
  onItemsChange: () => void;
}

const Configuration: React.FC<ConfigurationProps> = ({ items, setItems, onItemsChange }) => {
  const [newItemName, setNewItemName] = useState('');

  const handleAddItem = () => {
    if (newItemName.trim() && items.length < 12) {
      // --- CHANGE: Simplified item creation ---
      const newWheelItem: WheelItem = {
        name: newItemName.trim(),
      };
      
      setItems(prevItems => [...prevItems, newWheelItem]);
      onItemsChange();

      setNewItemName('');
    }
  };

  const handleRemoveItem = (indexToRemove: number) => {
    if (items.length > 2) {
      // --- CHANGE: Simplified removal, no blob URL cleanup ---
      setItems(prevItems => prevItems.filter((_, index) => index !== indexToRemove));
      onItemsChange();
    }
  };

  return (
    <div className="w-full bg-white/80 backdrop-blur-md p-4 rounded-lg shadow-2xl border border-gray-200">
      <h3 className="text-gray-900 text-lg font-bold mb-4 text-center">Customize Wheel</h3>
      <div className="space-y-3">
        <input
          type="text"
          placeholder="Prize Name (e.g., iPhone 17)"
          value={newItemName}
          onChange={(e) => setNewItemName(e.target.value)}
          className="w-full bg-gray-100 text-gray-800 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
        />
        {/* --- REMOVED: File input and image preview --- */}
        <button
          onClick={handleAddItem}
          disabled={!newItemName.trim() || items.length >= 12}
          className="w-full bg-red-600 text-white font-bold py-2 rounded hover:bg-red-700 transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed"
        >
          {items.length >= 12 ? 'Max Items Reached' : 'Add Item'}
        </button>
      </div>

      <hr className="border-gray-300 my-4" />

      <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
        {items.map((item, index) => (
          <div key={index} className="flex items-center justify-between bg-gray-100 p-2 rounded">
            <div className="flex items-center gap-3 overflow-hidden">
              {/* --- REMOVED: Image from the list item view --- */}
              <span className="text-gray-800 text-sm truncate" title={item.name}>{item.name}</span>
            </div>
            <button
              onClick={() => handleRemoveItem(index)}
              disabled={items.length <= 2}
              className="text-gray-400 hover:text-red-500 disabled:text-gray-500 disabled:cursor-not-allowed flex-shrink-0 pl-2"
            >
              &#x2715;
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Configuration;