"use client";

import React, { useState } from 'react';

export interface WheelItem {
  name: string;
}

interface ConfigurationProps {
  items: WheelItem[];
  setItems: React.Dispatch<React.SetStateAction<WheelItem[]>>;
  onItemsChange: () => void;
  onToggleVisibility: () => void; // --- NEW: Prop to handle minimizing
}

const Configuration: React.FC<ConfigurationProps> = ({ items, setItems, onItemsChange, onToggleVisibility }) => {
  const [newItemName, setNewItemName] = useState('');

  const handleAddItem = () => {
    if (newItemName.trim() && items.length < 12) {
      const newWheelItem: WheelItem = { name: newItemName.trim() };
      setItems(prevItems => [...prevItems, newWheelItem]);
      onItemsChange();
      setNewItemName('');
    }
  };

  const handleRemoveItem = (indexToRemove: number) => {
    if (items.length > 2) {
      setItems(prevItems => prevItems.filter((_, index) => index !== indexToRemove));
      onItemsChange();
    }
  };

  return (
    <div className="w-full bg-white/80 backdrop-blur-md p-4 rounded-lg shadow-2xl border border-gray-200">
      {/* --- REVISION: Header now includes a minimize button --- */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-gray-900 text-lg font-bold">Customize Wheel</h3>
        <button
          onClick={onToggleVisibility}
          title="Minimize Panel"
          className="text-gray-500 hover:text-gray-900 font-black text-2xl leading-none px-2"
        >
          &mdash;
        </button>
      </div>

      <div className="space-y-3">
        <input
          type="text"
          placeholder="Prize Name (e.g., iPhone 17)"
          value={newItemName}
          onChange={(e) => setNewItemName(e.target.value)}
          className="w-full bg-gray-100 text-gray-800 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
        />
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