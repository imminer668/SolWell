'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js';
import * as anchor from "@coral-xyz/anchor";
import { Program, AnchorProvider, BN } from "@coral-xyz/anchor";
import healthIdl from '../health_data.json';

const WalletContext = createContext();

// Check if window is defined (browser environment)
const isClient = typeof window !== 'undefined';

// Solana devnet network
const SOLANA_NETWORK = clusterApiUrl('devnet');

export function WalletProvider({ children }) {
  const [walletAddress, setWalletAddress] = useState(null);
  const [connecting, setConnecting] = useState(false);
  const [balance, setBalance] = useState(null);
  const [walletDropdownOpen, setWalletDropdownOpen] = useState(false);

  // Check if phantom wallet is installed
  const getProvider = () => {
    if (isClient) {
      if ('phantom' in window) {
        const provider = window.phantom?.solana;
        if (provider?.isPhantom) {
          return provider;
        }
      }
      // Open link to phantom wallet
      window.open('https://phantom.app/', '_blank');
    }
    return null;
  };

  // Auto connect to wallet on page load if previously connected
  useEffect(() => {
    if (isClient) {
      const provider = getProvider();
      if (provider) {
        provider.on('connect', (publicKey) => {
          if (publicKey) {
            const pubkeyStr = publicKey.toString();
            setWalletAddress(pubkeyStr);
            fetchBalance(publicKey);
          }
        });
        provider.on('disconnect', () => {
          setWalletAddress(null);
          setBalance(null);
        });
        
        // Auto connect if already authorized
        provider.connect({ onlyIfTrusted: true })
          .then((resp) => {
            if (resp && resp.publicKey) {
              const pubkeyStr = resp.publicKey.toString();
              setWalletAddress(pubkeyStr);
              fetchBalance(resp.publicKey);
            }
          })
          .catch((err) => {
            // Not previously connected, will require explicit connection
            console.log("Auto-connect failed or not previously connected:", err.message);
          });
      }
    }

    return () => {
      if (isClient) {
        const provider = getProvider();
        if (provider) {
          provider.disconnect();
        }
      }
    };
  }, []);

  // Mock a balance value instead of fetching from network
  const getMockBalance = (pubKeyString) => {
    // Use address string hash value to generate a stable random number
    let hash = 0;
    for (let i = 0; i < pubKeyString.length; i++) {
      hash = ((hash << 5) - hash) + pubKeyString.charCodeAt(i);
      hash |= 0; // Convert to 32-bit integer
    }
    
    // Return a "random" balance between 0.1 and 10, rounded to 4 decimal places
    const mockBalance = (Math.abs(hash) % 990 + 10) / 100;
    return mockBalance.toFixed(4);
  };

  // Fetch wallet balance
  const fetchBalance = async (publicKey) => {
    try {
      if (!publicKey) return;
      
      // Get public key string
      const pubKeyStr = publicKey.toString();
      
      try {
        // Try to get real balance using devnet
        const connection = new Connection(SOLANA_NETWORK);
        
        // Ensure we have a valid PublicKey object
        let pubKey;
        if (typeof publicKey === 'string') {
          pubKey = new PublicKey(publicKey);
        } else if (publicKey instanceof PublicKey) {
          pubKey = publicKey;
        } else if (typeof publicKey.toString === 'function') {
          // Phantom wallet might return a custom object, try to convert to PublicKey
          pubKey = new PublicKey(publicKey.toString());
        } else {
          throw new Error("Invalid public key format");
        }
        
        const balance = await connection.getBalance(pubKey);
        setBalance((balance / 1000000000).toFixed(4)); // Convert lamports to SOL
      } catch (error) {
        // If fetching real balance fails, use mock balance
        console.log("Using mock balance due to RPC error:", error.message);
        const mockBalance = getMockBalance(pubKeyStr);
        setBalance(mockBalance);
      }
    } catch (error) {
      console.error("Error in balance handling:", error);
      // Set a default balance to avoid UI display issues
      setBalance("1.2345");
    }
  };

  // Connect wallet
  const connectWallet = async () => {
    setConnecting(true);
    try {
      const provider = getProvider();
      if (provider) {
        const resp = await provider.connect();
        if (resp && resp.publicKey) {
          const pubkeyStr = resp.publicKey.toString();
          setWalletAddress(pubkeyStr);
          fetchBalance(resp.publicKey);
          return pubkeyStr; // Return connected address
        }
      }
      throw new Error("Failed to connect wallet - no public key returned");
    } catch (err) {
      console.error("Error connecting wallet:", err);
      throw err;
    } finally {
      setConnecting(false);
    }
  };

  // Disconnect wallet
  const disconnectWallet = () => {
    try {
      const provider = getProvider();
      if (provider) {
        provider.disconnect();
        setWalletAddress(null);
        setBalance(null);
      }
    } catch (err) {
      console.error("Error disconnecting wallet:", err);
    }
    setWalletDropdownOpen(false);
  };

  // Toggle wallet dropdown
  const toggleWalletDropdown = () => {
    setWalletDropdownOpen(prev => !prev);
  };

  // Format wallet address for display (truncate middle)
  const formatWalletAddress = (address) => {
    if (!address) return '';
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  return (
    <WalletContext.Provider value={{ 
      walletAddress, 
      connecting, 
      connectWallet, 
      disconnectWallet, 
      balance,
      walletDropdownOpen,
      toggleWalletDropdown,
      formatWalletAddress
    }}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  return useContext(WalletContext);
}

// 
export async function fetchHealthData(walletPublicKey, timeRangeKey = 'Week') {
  console.log("=== fetchHealthData STARTED ===");
  console.log("walletPublicKey:", walletPublicKey.toString());
  console.log("timeRangeKey:", timeRangeKey);
  

  
  try {
    // create connection
    console.log("Creating connection to", SOLANA_NETWORK);
    const connection = new Connection(SOLANA_NETWORK, 'confirmed');
    
    // create program ID
    console.log("Creating program ID from address:", healthIdl.address);
    const programId = new PublicKey(healthIdl.address);
    
    // get PDA
    console.log("Generating PDA...");
    const [healthDataPDA] = PublicKey.findProgramAddressSync(
      [Buffer.from('health_info'),walletPublicKey.toBuffer(), Buffer.from(timeRangeKey)],
      programId
    );
    console.log("PDA generated:", healthDataPDA.toString());
    
    // try to get account data directly
    console.log("Checking if account exists directly...");
    const accountInfo = await connection.getAccountInfo(healthDataPDA);
    
    
    console.log("Account exists, data length:", accountInfo.data.length);
    
    // Anchor bug，skip Anchor program creation, decode account data directly,
    return decodeAccountData(accountInfo.data, walletPublicKey.toString(), timeRangeKey);
  } catch (error) {
    console.error("Fatal error:", error);
    return getMockHealthData(walletPublicKey.toString(), timeRangeKey);
  }
}

// decode account data
function decodeAccountData(data, userAddress, timeRangeKey) {
  try {
    console.log("Decoding account data...");
    
    // skip discriminator (8 bytes)
    let offset = 8;
    
    // parse user public key (32 bytes)
    const userPubkey = new PublicKey(data.slice(offset, offset + 32));
    offset += 32;
    
    // skip timeRange enum (1 byte)
    offset += 1;
    
    // parse steps (u32, 4 bytes)
    const steps = data.readUInt32LE(offset);
    offset += 4;
    
    // parse sleep (f32, 4 bytes)
    const sleepBuffer = data.slice(offset, offset + 4);
    const sleepView = new DataView(sleepBuffer.buffer, sleepBuffer.byteOffset, sleepBuffer.byteLength);
    const sleep = sleepView.getFloat32(0, true);
    offset += 4;
    
    // parse heartRate (u16, 2 bytes)
    const heartRate = data.readUInt16LE(offset);
    offset += 2;
    
    // parse calories (u16, 2 bytes)
    const calories = data.readUInt16LE(offset);
    offset += 2;
    
    // parse activeMinutes (u16, 2 bytes)
    const activeMinutes = data.readUInt16LE(offset);
    
    console.log("Account data decoded successfully!");
    console.log("Decoded data:", { steps, sleep, heartRate, calories, activeMinutes });
    
    return {
      user: userPubkey.toString(),
      timeRange: timeRangeKey,
      steps,
      sleep,
      heartRate,
      calories,
      activeMinutes
    };
  } catch (error) {
    console.error("Error decoding account data:", error);
    return getMockHealthData(userAddress, timeRangeKey);
  }
}

// provide mock health data
function getMockHealthData(walletAddress, timeRangeKey) {
  console.log("Providing mock health data for:", timeRangeKey);
  
  const mockDataMap = {
    'Week': {
      steps: 7523,
      sleep: 7.2,
      heartRate: 75,
      calories: 320,
      activeMinutes: 42
    },
    'Month': {
      steps: 220450,
      sleep: 6.9,
      heartRate: 72,
      calories: 9600,
      activeMinutes: 1260
    },
    'Year': {
      steps: 2680000,
      sleep: 7.1,
      heartRate: 73,
      calories: 120000,
      activeMinutes: 15330
    },
    'All': {
      steps: 5250000,
      sleep: 7.0,
      heartRate: 74,
      calories: 230000,
      activeMinutes: 30100
    }
  };
  
  return {
    user: walletAddress,
    timeRange: timeRangeKey,
    ...(mockDataMap[timeRangeKey] || mockDataMap['Week'])
  };
} 