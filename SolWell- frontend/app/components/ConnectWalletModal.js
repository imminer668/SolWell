'use client';
import { useWallet } from '../contexts/WalletContext';
import { useState } from 'react';

export default function ConnectWalletModal({ onClose, onSuccess }) {
  const { connectWallet, connecting, walletAddress } = useWallet();
  const [connectingLocal, setConnectingLocal] = useState(false);
  const [syncAfterConnect, setSyncAfterConnect] = useState(true);

  const handleConnect = async () => {
    setConnectingLocal(true);
    try {
      await connectWallet();
      if (onSuccess) onSuccess(syncAfterConnect);
    } catch (error) {
      console.error("Connection error:", error);
    } finally {
      setConnectingLocal(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-xl w-80 max-w-full p-6 relative animate-fade-in">
        <button className="absolute right-3 top-3 text-gray-400" onClick={onClose}><i className="fas fa-times"></i></button>
        <div className="w-24 h-24 rounded-full gradient-bg flex items-center justify-center mb-6 mx-auto">
          <i className="fas fa-wallet text-white text-3xl"></i>
        </div>
        <h2 className="text-2xl font-bold text-black text-center">Connect Your Wallet</h2>
        <p className="text-black text-center mt-2 mb-4">Connect your Solana wallet to sync health data and access insurance services</p>
        
        {/* Sync checkbox */}
        <div className="flex items-center mb-4 px-2">
          <input 
            type="checkbox" 
            id="syncData" 
            checked={syncAfterConnect} 
            onChange={(e) => setSyncAfterConnect(e.target.checked)}
            className="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500"
          />
          <label htmlFor="syncData" className="ml-2 text-sm font-medium text-gray-700">
            Sync health data to Solana after connecting
          </label>
        </div>
        
        <div className="w-full space-y-4">
          <button
            className="w-full py-4 bg-black text-white rounded-xl font-medium flex items-center justify-center disabled:opacity-60"
            onClick={handleConnect}
            disabled={connecting || connectingLocal}
          >
            {connecting || connectingLocal ? (
              <span className="flex items-center"><span className="loader mr-2"></span>Connecting...</span>
            ) : (
              <><i className="fas fa-ghost text-purple-600 text-lg mr-2"></i> Phantom Wallet</>
            )}
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