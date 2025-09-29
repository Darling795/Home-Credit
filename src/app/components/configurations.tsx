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
  const [newItemImageFile, setNewItemImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewItemImageFile(file);
      // Clean up the *previous* preview URL before creating a new one
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  const handleAddItem = () => {
    if (newItemName.trim() && items.length < 12) {
      // --- FIX: REUSE THE PREVIEW URL ---
      // We already created a blob URL for the preview, so let's use it.
      // This is more efficient and avoids potential race conditions.
      const newWheelItem: WheelItem = {
        name: newItemName.trim(),
        // Use the existing imagePreview URL directly
        imageUrl: imagePreview || undefined,
      };
      
      setItems(prevItems => [...prevItems, newWheelItem]);
      onItemsChange(); // Notify parent to clear TV screen

      // Reset state. CRUCIALLY, we no longer call revokeObjectURL here
      // because the URL has been passed to the parent component, which
      // is now responsible for its lifecycle.
      setNewItemName('');
      setNewItemImageFile(null);
      setImagePreview(null); // Just clear the local preview state
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemoveItem = (indexToRemove: number) => {
    if (items.length > 2) {
      const itemToRemove = items[indexToRemove];
      // When an item is explicitly removed, we should revoke its URL
      if (itemToRemove.imageUrl?.startsWith('blob:')) {
        URL.revokeObjectURL(itemToRemove.imageUrl);
      }
      setItems(prevItems => prevItems.filter((_, index) => index !== indexToRemove));
      onItemsChange();
    }
  };

  return (
    <div className="absolute top-4 right-4 lg:top-10 lg:right-10 z-30 w-[350px] bg-gray-800/80 backdrop-blur-md p-4 rounded-lg shadow-2xl border border-gray-600">
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
          ref={fileInputRef}
          type="file"
          accept="image/png, image/jpeg, image/webp, image/gif"
          onChange={handleFileChange}
          className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100"
        />
        {imagePreview && (
          <div className="flex justify-center p-2 bg-gray-900 rounded-md">
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

      <hr className="border-gray-600 my-4" />

      <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
        {items.map((item, index) => (
          <div key={index} className="flex items-center justify-between bg-gray-700 p-2 rounded">
            <span className="text-white text-sm truncate" title={item.name}>{item.name}</span>
            {item.imageUrl && <div className="w-6 h-6 ml-2 flex-shrink-0"><Image src={item.imageUrl} alt="" width={24} height={24} className="object-cover rounded-sm" /></div>}
            <button
              onClick={() => handleRemoveItem(index)}
              disabled={items.length <= 2}
              className="text-gray-400 hover:text-red-500 disabled:text-gray-600 disabled:cursor-not-allowed ml-2 pl-2"
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