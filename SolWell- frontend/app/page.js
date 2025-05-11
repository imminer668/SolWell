'use client'
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import BottomNavigation from './components/BottomNavigation';
import { useWallet } from './contexts/WalletContext';
import { fetchHealthData } from './contexts/WalletContext';
import ConnectWalletModal from './components/ConnectWalletModal';
import WalletDropdown from './components/WalletDropdown';
import { PublicKey } from '@solana/web3.js';

const MOCK_DATA = {
  '7d': {
    steps: 8456,
    sleep: 7.3,
    heartRate: 72,
    calories: 342,
    activity: 45,
  },
  '30d': {
    steps: 12034,
    sleep: 6.8,
    heartRate: 75,
    calories: 410,
    activity: 38,
  },
  '365d': {
    steps: 320000,
    sleep: 6.5,
    heartRate: 78,
    calories: 12000,
    activity: 30,
  },
  all: {
    steps: 500000,
    sleep: 6.9,
    heartRate: 74,
    calories: 18000,
    activity: 35,
  },
};

const PERIODS = [
  { key: 'Week', label: '7 Days' },
  { key: 'Month', label: '30 Days' },
  { key: 'Year', label: '365 Days' },
  { key: 'All', label: 'All' },
];

export default function Home() {
  const router = useRouter();
  const { walletAddress } = useWallet();
  const [period, setPeriod] = useState('Week');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showConnect, setShowConnect] = useState(false);

  // refresh data
  useEffect(() => {
    setLoading(true);
    async function getData() {
      if (walletAddress) {
        console.log("Fetching data for wallet:", walletAddress);
        console.log("Current period:", period);
        try {
          // create PublicKey object
          const pubKey = new PublicKey(walletAddress);
          
          // get health data
          const health = await fetchHealthData(pubKey, period);
          console.log("Health data received:", health);
          
          // ensure all fields have values
          setData({
            steps: health.steps || 0,
            sleep: health.sleep || 0,
            heartRate: health.heartRate || 0,
            calories: health.calories || 0,
            activity: health.activeMinutes || 0,
          });
        } catch (e) {
          console.error("Error in getData:", e);
          // set default data when error
          setData({
            steps: 5000,
            sleep: 7.0,
            heartRate: 70,
            calories: 300,
            activity: 30,
          });
        }
      } else {
        // show default data when not connected
        setData({
          steps: 5000,
          sleep: 7.0,
          heartRate: 70,
          calories: 300,
          activity: 30,
        });
      }
      setLoading(false);
    }
    getData();
  }, [walletAddress, period]);

  // handle period change
  const handlePeriodChange = (newPeriod) => {
    console.log("Changing period to:", newPeriod);
    setPeriod(newPeriod);
  };

  // Custom pulse animation style
  const pulseStyle = {
    animation: 'pulse-gradient 1.5s ease-in-out infinite',
  };

  // Key data click
  const handleDataClick = () => {
    if (!walletAddress) {
      setShowConnect(true);
    }
  };

  // Close connect-wallet
  const handleCloseConnect = () => setShowConnect(false);
  // Close after successful connection
  const handleConnectSuccess = () => setShowConnect(false);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 pb-20">
      {/* Top Navigation */}
      <div className="p-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-black">SolWell</h1>
        {walletAddress ? (
          <WalletDropdown />
        ) : (
          <button 
            className="rounded-full bg-purple-100 p-2 hover:bg-purple-200 transition-colors duration-300"
            onClick={() => setShowConnect(true)}
          >
            <i className="fas fa-wallet text-black"></i>
          </button>
        )}
      </div>
      
      {/* Health Data Overview */}
      <div className="px-6">
        <div className="rounded-xl bg-gradient-to-r from-purple-500 to-green-400 p-4 text-white">
          <div className="flex justify-between items-center mb-2">
            <h2 className="font-bold">Today's Health Overview</h2>
            <span className="text-xs">October 12, 2023</span>
          </div>
          <div className="grid grid-cols-2 gap-3 mt-3">
            <div className="bg-white/20 rounded-lg p-3 cursor-pointer" onClick={handleDataClick}>
              {loading ? (
                <div className="animate-pulse h-10 bg-white/30 rounded flex items-center justify-center overflow-hidden">
                  <div className="w-full h-1 bg-white/50 shimmer-loading"></div>
                </div>
              ) : (
                <>
                  <div className="flex items-center">
                    <i className="fas fa-shoe-prints mr-2"></i>
                    <span>Steps</span>
                  </div>
                  <p className="text-xl font-bold mt-1">{data?.steps ? data.steps.toLocaleString() : 0}</p>
                </>
              )}
            </div>
            <div className="bg-white/20 rounded-lg p-3 cursor-pointer" onClick={handleDataClick}>
              {loading ? (
                <div className="animate-pulse h-10 bg-white/30 rounded flex items-center justify-center overflow-hidden">
                  <div className="w-full h-1 bg-white/50 shimmer-loading"></div>
                </div>
              ) : (
                <>
                  <div className="flex items-center">
                    <i className="fas fa-moon mr-2"></i>
                    <span>Sleep</span>
                  </div>
                  <p className="text-xl font-bold mt-1">{data?.sleep ?? 0} hours</p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Time Filter */}
      <div className="px-6 mt-6">
        <div className="flex space-x-2 text-sm">
          {PERIODS.map((p) => (
            <button
              key={p.key}
              className={`px-3 py-1 rounded-full ${period === p.key ? 'bg-purple-500 text-white' : 'bg-gray-200 text-black'}`}
              onClick={() => handlePeriodChange(p.key)}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>
      
      {/* Detailed Health Data */}
      <div className="px-6 mt-6">
        <h3 className="font-bold text-black mb-3">Health Details</h3>
        <div className="bg-white rounded-xl p-4 mb-4 shadow-sm border border-gray-100 hover:shadow-md transition duration-300 cursor-pointer" onClick={handleDataClick}>
          <div className="flex justify-between items-center">
            <div>
              <div className="flex items-center">
                <i className="fas fa-heart text-purple-500 mr-2 text-lg"></i>
                <span className="text-black font-medium">Heart Rate</span>
              </div>
              {loading ? (
                <div className="animate-pulse h-6 w-16 bg-gray-200 rounded mt-2 shimmer-loading"></div>
              ) : (
                <p className="text-black font-bold text-2xl">{data?.heartRate ?? 0} <span className="text-xs font-normal">bpm</span></p>
              )}
            </div>
            <div className="w-28 h-16 bg-gray-50 rounded-lg flex items-end overflow-hidden relative p-1 border border-gray-100">
              {loading ? (
                <div className="absolute inset-0 shimmer-loading"></div>
              ) : (
                <>
                  <div className="w-4 h-0 bg-purple-300 rounded-t mx-0.5 transform transition-all duration-700 hover:h-12 animate-bar-grow" style={{"--final-height": "14px", "--delay": "0.1s"}}></div>
                  <div className="w-4 h-0 bg-purple-400 rounded-t mx-0.5 transform transition-all duration-700 hover:h-14 animate-bar-grow" style={{"--final-height": "20px", "--delay": "0.2s"}}></div>
                  <div className="w-4 h-0 bg-purple-500 rounded-t mx-0.5 transform transition-all duration-700 hover:h-16 animate-bar-grow" style={{"--final-height": "24px", "--delay": "0.3s"}}></div>
                  <div className="w-4 h-0 bg-purple-400 rounded-t mx-0.5 transform transition-all duration-700 hover:h-13 animate-bar-grow" style={{"--final-height": "18px", "--delay": "0.4s"}}></div>
                  <div className="w-4 h-0 bg-purple-500 rounded-t mx-0.5 transform transition-all duration-700 hover:h-15 animate-bar-grow" style={{"--final-height": "22px", "--delay": "0.5s"}}></div>
                  <div className="w-4 h-0 bg-purple-400 rounded-t mx-0.5 transform transition-all duration-700 hover:h-12 animate-bar-grow" style={{"--final-height": "16px", "--delay": "0.6s"}}></div>
                </>
              )}
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-4 mb-4 shadow-sm border border-gray-100 hover:shadow-md transition duration-300 cursor-pointer" onClick={handleDataClick}>
          <div className="flex justify-between items-center">
            <div>
              <div className="flex items-center">
                <i className="fas fa-fire text-purple-500 mr-2 text-lg"></i>
                <span className="text-black font-medium">Calories</span>
              </div>
              {loading ? (
                <div className="animate-pulse h-6 w-16 bg-gray-200 rounded mt-2 shimmer-loading"></div>
              ) : (
                <p className="text-black font-bold text-2xl">{data?.calories ?? 0} <span className="text-xs font-normal">kcal</span></p>
              )}
            </div>
            <div className="w-28 h-16 bg-gray-50 rounded-lg flex justify-center items-center overflow-hidden relative p-1 border border-gray-100">
              {loading ? (
                <div className="absolute inset-0 shimmer-loading"></div>
              ) : (
                <div className="w-20 h-8 relative">
                  <svg viewBox="0 0 80 32" className="w-full h-full">
                    <path d="M0,32 C10,28 20,16 30,22 C40,28 50,10 60,14 C70,18 80,24 80,32" fill="none" stroke="#9333ea" strokeWidth="3" strokeLinecap="round" className="animate-draw-path"></path>
                  </svg>
                  <div className="absolute right-0 bottom-0 w-3 h-3 bg-purple-500 rounded-full animate-pulse-dot"></div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition duration-300 cursor-pointer" onClick={handleDataClick}>
          <div className="flex justify-between items-center">
            <div>
              <div className="flex items-center">
                <i className="fas fa-running text-purple-500 mr-2 text-lg"></i>
                <span className="text-black font-medium">Activity Time</span>
              </div>
              {loading ? (
                <div className="animate-pulse h-6 w-16 bg-gray-200 rounded mt-2 shimmer-loading"></div>
              ) : (
                <p className="text-black font-bold text-2xl">{data?.activity ?? 0} <span className="text-xs font-normal">minutes</span></p>
              )}
            </div>
            <div className="w-28 h-16 bg-gray-50 rounded-lg flex items-center justify-center overflow-hidden relative p-1 border border-gray-100">
              {loading ? (
                <div className="absolute inset-0 shimmer-loading"></div>
              ) : (
                <div className="w-20 h-10 rounded-full bg-gray-200 relative">
                  <div className="absolute inset-0 rounded-full overflow-hidden">
                    <div className="bg-gradient-to-r from-purple-400 to-green-300 h-full animate-progress-fill" style={{width: '75%'}}></div>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-sm text-black font-medium">75%</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Sync Button */}
      <div className="px-6 mt-6">
        <button className="w-full py-3 bg-black text-white rounded-xl font-medium flex items-center justify-center" onClick={handleDataClick}>
          <i className="fas fa-sync-alt mr-2"></i>
          Sync Health Data to Solana
        </button>
      </div>
      
      {/* Bottom Navigation */}
      <BottomNavigation activePage="home" />
      
      {/* Connect Wallet Modal */}
      {showConnect && (
        <ConnectWalletModal 
          onClose={handleCloseConnect} 
          onSuccess={handleConnectSuccess} 
        />
      )}
      
      <style jsx>{`
        .shimmer-loading {
          background: linear-gradient(
            to right,
            rgba(255, 255, 255, 0.1) 0%,
            rgba(255, 255, 255, 0.3) 50%,
            rgba(255, 255, 255, 0.1) 100%
          );
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
        }
        
        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }
        
        @keyframes pulse-gradient {
          0%, 100% {
            background-color: rgba(147, 51, 234, 0.3);
          }
          50% {
            background-color: rgba(147, 51, 234, 0.5);
          }
        }
        
        .animate-bar-1 {
          animation: barHeight 2s ease-in-out infinite;
          animation-delay: 0.1s;
        }
        
        .animate-bar-2 {
          animation: barHeight 2s ease-in-out infinite;
          animation-delay: 0.3s;
        }
        
        .animate-bar-3 {
          animation: barHeight 2s ease-in-out infinite;
          animation-delay: 0.5s;
        }
        
        .animate-bar-4 {
          animation: barHeight 2s ease-in-out infinite;
          animation-delay: 0.7s;
        }
        
        .animate-bar-5 {
          animation: barHeight 2s ease-in-out infinite;
          animation-delay: 0.9s;
        }
        
        .animate-bar-6 {
          animation: barHeight 2s ease-in-out infinite;
          animation-delay: 1.1s;
        }
        
        .animate-bar-grow {
          animation: barGrow 1s forwards, barPulse 2s 1s infinite;
          animation-delay: var(--delay, 0s);
        }
        
        @keyframes barGrow {
          0% {
            height: 0;
          }
          100% {
            height: var(--final-height);
          }
        }
        
        @keyframes barPulse {
          0%, 100% {
            height: var(--final-height);
          }
          50% {
            height: calc(var(--final-height) + 2px);
          }
        }
        
        @keyframes barHeight {
          0%, 100% {
            height: var(--h);
          }
          50% {
            height: calc(var(--h) + 3px);
          }
        }
        
        .animate-draw-path {
          stroke-dasharray: 100;
          stroke-dashoffset: 100;
          animation: drawPath 2s ease-in-out forwards, pulseStroke 2s 2s ease-in-out infinite;
        }
        
        @keyframes drawPath {
          to {
            stroke-dashoffset: 0;
          }
        }
        
        @keyframes pulseStroke {
          0%, 100% {
            stroke-width: 3;
          }
          50% {
            stroke-width: 4;
          }
        }
        
        .animate-pulse-dot {
          animation: pulseDot 1.5s ease-in-out infinite;
        }
        
        @keyframes pulseDot {
          0%, 100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.5);
            opacity: 0.7;
          }
        }
        
        .animate-progress-fill {
          animation: progressFill 1s ease-out forwards, progressPulse 2s 1s ease-in-out infinite;
          width: 0%;
        }
        
        @keyframes progressFill {
          0% {
            width: 0%;
          }
          100% {
            width: 75%;
          }
        }
        
        @keyframes progressPulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.8;
          }
        }
      `}</style>
    </div>
  );
} 