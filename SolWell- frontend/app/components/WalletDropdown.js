'use client';
import { useWallet } from '../contexts/WalletContext';
import { useEffect, useRef } from 'react';

export default function WalletDropdown() {
  const { 
    walletAddress, 
    balance, 
    walletDropdownOpen, 
    toggleWalletDropdown, 
    disconnectWallet,
    formatWalletAddress
  } = useWallet();
  
  const dropdownRef = useRef(null);
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        if (walletDropdownOpen) {
          toggleWalletDropdown();
        }
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [walletDropdownOpen, toggleWalletDropdown]);
  
  if (!walletAddress) return null;
  
  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        className="rounded-full bg-purple-100 p-2 hover:bg-purple-200 transition-colors duration-300 relative"
        onClick={toggleWalletDropdown}
      >
        <i className="fas fa-wallet text-black"></i>
        <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border border-white"></span>
      </button>
      
      {walletDropdownOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg z-50 overflow-hidden animate-dropdown p-0">
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-4 text-white">
            <p className="text-sm font-semibold">Connected Wallet</p>
            <p className="mt-1 font-mono text-sm truncate">{walletAddress}</p>
          </div>
          
          <div className="p-3 border-b border-gray-100">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 text-sm">Balance</span>
              <span className="font-semibold">{balance || '0'} SOL</span>
            </div>
          </div>
          
          <div className="p-2">
            <button 
              className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors flex items-center"
              onClick={() => {
                navigator.clipboard.writeText(walletAddress);
                // Could add a toast notification here
              }}
            >
              <i className="fas fa-copy mr-2 text-gray-500"></i>
              Copy Address
            </button>
            
            <button 
              className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center mt-1"
              onClick={disconnectWallet}
            >
              <i className="fas fa-sign-out-alt mr-2"></i>
              Disconnect Wallet
            </button>
          </div>
        </div>
      )}
      
      <style jsx>{`
        .animate-dropdown {
          animation: dropdown 0.2s ease-out;
          transform-origin: top right;
        }
        
        @keyframes dropdown {
          0% {
            opacity: 0;
            transform: scale(0.95);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
} 