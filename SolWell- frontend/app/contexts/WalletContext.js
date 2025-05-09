'use client';
import React, { createContext, useContext, useState } from 'react';

const WalletContext = createContext();

export function WalletProvider({ children }) {
  const [walletAddress, setWalletAddress] = useState(null);
  const [connecting, setConnecting] = useState(false);

  const connectWallet = async () => {
    setConnecting(true);
    // Mock wallet connection process
    await new Promise((resolve) => setTimeout(resolve, 1500));
    // Generate a random wallet address
    setWalletAddress('SoL' + Math.random().toString(36).slice(2, 10) + '...'+ Math.random().toString(36).slice(-4));
    setConnecting(false);
  };

  const disconnectWallet = () => {
    setWalletAddress(null);
  };

  return (
    <WalletContext.Provider value={{ walletAddress, connectWallet, disconnectWallet, connecting }}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  return useContext(WalletContext);
} 