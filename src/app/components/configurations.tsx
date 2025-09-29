"use client";

import React, { useState, useRef, ChangeEvent } from 'react';
import Image from 'next/image';

export interface WheelItem {
  name: string;
  imageUrl?: string;
}

interface ConfigurationProps {
  items: WheelItem[];
  setItems: React.Dispatch<React.SetStateAction<WheelItem[]>>;
  onItemsChange: () => void;
}

const Configuration: React.FC<ConfigurationProps> = ({ items, setItems, onItemsChange }) => {
  const [newItemName, setNewItemName] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  const handleAddItem = () => {
    if (newItemName.trim() && items.length < 12) {
      const newWheelItem: WheelItem = {
        name: newItemName.trim(),
        imageUrl: imagePreview || undefined,
      };
      
      setItems(prevItems => [...prevItems, newWheelItem]);
      onItemsChange();

      setNewItemName('');
      setImagePreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemoveItem = (indexToRemove: number) => {
    if (items.length > 2) {
      const itemToRemove = items[indexToRemove];
      if (itemToRemove.imageUrl?.startsWith('blob:')) {
        URL.revokeObjectURL(itemToRemove.imageUrl);
      }
      setItems(prevItems => prevItems.filter((_, index) => index !== indexToRemove));
      onItemsChange();
    }
  };

  return (
    // --- THEME: Changed panel to a light theme ---
    <div className="w-full bg-white/80 backdrop-blur-md p-4 rounded-lg shadow-2xl border border-gray-200">
      <h3 className="text-gray-900 text-lg font-bold mb-4 text-center">Customize Wheel</h3>
      <div className="space-y-3">
        <input
          type="text"
          placeholder="Prize Name (e.g., iPhone 17)"
          value={newItemName}
          onChange={(e) => setNewItemName(e.target.value)}
          // --- THEME: Light theme for input ---
          className="w-full bg-gray-100 text-gray-800 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
        />
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png, image/jpeg, image/webp, image/gif"
          onChange={handleFileChange}
          className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-red-100 file:text-red-700 hover:file:bg-red-200"
        />
        {imagePreview && (
          <div className="flex justify-center p-2 bg-gray-100 rounded-md">
            <Image src={imagePreview} alt="Preview" width={80} height={80} className="object-contain rounded" />
          </div>
        )}
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
          // --- THEME: Light theme for list items ---
          <div key={index} className="flex items-center justify-between bg-gray-100 p-2 rounded">
            <div className="flex items-center gap-3 overflow-hidden">
              {item.imageUrl && (
                <Image src={item.imageUrl} alt={item.name} width={24} height={24} className="object-cover rounded-sm flex-shrink-0" />
              )}
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