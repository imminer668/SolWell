'use client'
import { useRouter } from 'next/navigation';
import { useWallet } from '../contexts/WalletContext';
import { useState } from 'react';

export default function ConnectWallet() {
  const router = useRouter();
  const { connectWallet, walletAddress } = useWallet();
  const [connecting, setConnecting] = useState(false);
  
  // If wallet is already connected, redirect to home
  if (walletAddress) {
    router.push('/');
    return null;
  }
  
  const handleConnectPhantom = async () => {
    setConnecting(true);
    try {
      await connectWallet();
      router.push('/');
    } catch (error) {
      console.error("Failed to connect wallet:", error);
    } finally {
      setConnecting(false);
    }
  };
  
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <div className="p-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-black">Connect Wallet</h1>
          <button 
            className="w-8 h-8 flex items-center justify-center"
            onClick={() => router.back()}
          >
            <i className="fas fa-times text-black"></i>
          </button>
        </div>
      </div>
      
      <div className="px-6 py-10 flex-1 flex flex-col items-center justify-center">
        <div className="w-24 h-24 rounded-full gradient-bg flex items-center justify-center mb-6">
          <i className="fas fa-wallet text-white text-3xl"></i>
        </div>
        
        <h2 className="text-2xl font-bold text-black">Connect Your Wallet</h2>
        <p className="text-black text-center mt-2 mb-8">Connect your Solana wallet to sync health data and access insurance services</p>
        
        <div className="w-full space-y-4">
          <button 
            className="w-full py-4 bg-black text-white rounded-xl font-medium flex items-center justify-center disabled:opacity-70"
            onClick={handleConnectPhantom}
            disabled={connecting}
          >
            {connecting ? (
              <span className="flex items-center">
                <span className="loader mr-2"></span>
                Connecting...
              </span>
            ) : (
              <>
                <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center mr-2">
                  <i className="fas fa-ghost text-purple-600 text-xs"></i>
                </div>
                Phantom Wallet
              </>
            )}
          </button>
          
          <button className="w-full py-4 bg-white border border-gray-200 text-black rounded-xl font-medium flex items-center justify-center opacity-50 cursor-not-allowed">
            <div className="w-5 h-5 rounded-full gradient-bg flex items-center justify-center mr-2">
              <i className="fas fa-wallet text-white text-xs"></i>
            </div>
            Sollet Wallet
            <span className="ml-2 text-xs bg-gray-200 text-gray-700 px-2 py-0.5 rounded">Coming Soon</span>
          </button>
          
          <button className="w-full py-4 bg-white border border-gray-200 text-black rounded-xl font-medium flex items-center justify-center opacity-50 cursor-not-allowed">
            <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center mr-2">
              <i className="fas fa-sun text-white text-xs"></i>
            </div>
            Solflare Wallet
            <span className="ml-2 text-xs bg-gray-200 text-gray-700 px-2 py-0.5 rounded">Coming Soon</span>
          </button>
        </div>
      </div>
      
      <div className="p-6">
        <p className="text-xs text-black text-center">By connecting your wallet, you agree to SolWell's Terms of Service and Privacy Policy</p>
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
      `}</style>
    </div>
  );
} 