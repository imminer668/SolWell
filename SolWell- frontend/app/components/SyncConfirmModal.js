'use client';
import { useState } from 'react';

export default function SyncConfirmModal({ onClose, onConfirm }) {
  const [syncing, setSyncing] = useState(false);

  const handleConfirm = async () => {
    setSyncing(true);
    try {
      await onConfirm();
    } finally {
      setSyncing(false);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-xl w-80 max-w-full p-6 relative animate-fade-in">
        <button className="absolute right-3 top-3 text-gray-400" onClick={onClose}>
          <i className="fas fa-times"></i>
        </button>
        <div className="w-24 h-24 rounded-full gradient-bg flex items-center justify-center mb-6 mx-auto">
          <i className="fas fa-sync-alt text-white text-3xl"></i>
        </div>
        <h2 className="text-2xl font-bold text-black text-center">Sync Health Data</h2>
        <p className="text-black text-center mt-2 mb-6">
          Your wallet has been successfully connected! Do you want to sync your health data to the Solana blockchain?
        </p>
        
        <div className="w-full space-y-3">
          <button
            className="w-full py-3 bg-black text-white rounded-xl font-medium flex items-center justify-center disabled:opacity-60"
            onClick={handleConfirm}
            disabled={syncing}
          >
            {syncing ? (
              <span className="flex items-center"><span className="loader mr-2"></span>Syncing...</span>
            ) : (
              <>Sync Now</>
            )}
          </button>
          <button
            className="w-full py-3 bg-gray-200 text-black rounded-xl font-medium"
            onClick={onClose}
            disabled={syncing}
          >
            Later
          </button>
        </div>
        <style jsx>{`
          .loader {
            border: 2px solid #f3f3f3;
            border-top: 2px solid #9333ea;
            border-radius: 50%;
            width: 1.2em;
            height: 1.2em;
            animation: spin 1s linear infinite;
            display: inline-block;
          }
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          
          .gradient-bg {
            background: linear-gradient(135deg, #9333ea, #4ade80);
          }
        `}</style>
      </div>
    </div>
  );
} 