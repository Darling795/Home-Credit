"use client";

import React, { useState } from 'react';

// Define the structure for a wheel item, including the optional image URL
export interface WheelItem {
  name: string;
  imageUrl?: string;
}

interface ConfigurationProps {
  items: WheelItem[];
  setItems: React.Dispatch<React.SetStateAction<WheelItem[]>>;
}

const Configuration: React.FC<ConfigurationProps> = ({ items, setItems }) => {
  const [newItemName, setNewItemName] = useState('');
  const [newItemImageUrl, setNewItemImageUrl] = useState('');

  const handleAddItem = () => {
    // Ensure the name is not empty and there are less than 12 items for readability
    if (newItemName.trim() && items.length < 12) {
      setItems([...items, { name: newItemName.trim(), imageUrl: newItemImageUrl.trim() || undefined }]);
      setNewItemName('');
      setNewItemImageUrl('');
    }
  };

  const handleRemoveItem = (indexToRemove: number) => {
    // Prevent removing all items
    if (items.length > 2) {
      setItems(items.filter((_, index) => index !== indexToRemove));
    }
  };

  return (
    <div className="absolute top-10 right-10 z-30 w-[350px] bg-gray-800/80 backdrop-blur-md p-4 rounded-lg shadow-2xl border border-gray-600">
      <h3 className="text-white text-lg font-bold mb-4 text-center">Customize Wheel</h3>
      <div className="space-y-3">
        <input
          type="text"
          placeholder="Prize Name (e.g., iPhone 17)"
          value={newItemName}
          onChange={(e) => setNewItemName(e.target.value)}
          className="w-full bg-gray-900 text-white border border-gray-500 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
        />
        <input
          type="text"
          placeholder="Image URL (Optional)"
          value={newItemImageUrl}
          onChange={(e) => setNewItemImageUrl(e.target.value)}
          className="w-full bg-gray-900 text-white border border-gray-500 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
        />
        <button
          onClick={handleAddItem}
          disabled={items.length >= 12}
          className="w-full bg-red-600 text-white font-bold py-2 rounded hover:bg-red-700 transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed"
        >
          {items.length >= 12 ? 'Max Items Reached' : 'Add Item'}
        </button>
      </div>

      <hr className="border-gray-600 my-4" />

      <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
        {items.map((item, index) => (
          <div key={index} className="flex items-center justify-between bg-gray-700 p-2 rounded">
            <span className="text-white text-sm truncate" title={item.name}>{item.name}</span>
            <button
              onClick={() => handleRemoveItem(index)}
              disabled={items.length <= 2}
              className="text-gray-400 hover:text-red-500 disabled:text-gray-600 disabled:cursor-not-allowed"
            >
              &#x2715; {/* Cross icon */}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Configuration;