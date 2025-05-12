'use client';
import { useState, useEffect } from 'react';

export default function ToastNotification({ message, type, onClose }) {
  const [visible, setVisible] = useState(true);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(() => {
        onClose();
      }, 300); // Wait for fade out animation
    }, 3000);
    
    return () => clearTimeout(timer);
  }, [onClose]);
  
  const bgColor = type === 'success' ? 'bg-green-500' : 
                  type === 'error' ? 'bg-red-500' : 
                  'bg-black';
  
  return (
    <div 
      className={`fixed bottom-20 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded-lg text-white shadow-lg 
                  flex items-center transition-opacity duration-300 z-50 ${visible ? 'opacity-100' : 'opacity-0'} ${bgColor}`}
    >
      <span className="mr-2">
        {type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ'}
      </span>
      <span>{message}</span>
    </div>
  );
} 