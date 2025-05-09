'use client'
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import BottomNavigation from './components/BottomNavigation';
import { useWallet } from './contexts/WalletContext';
import ConnectWalletModal from './components/ConnectWalletModal';

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
  { key: '7d', label: '7 Days' },
  { key: '30d', label: '30 Days' },
  { key: '365d', label: '365 Days' },
  { key: 'all', label: 'All' },
];

export default function Home() {
  const router = useRouter();
  const { walletAddress } = useWallet();
  const [period, setPeriod] = useState('7d');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showConnect, setShowConnect] = useState(false);

  // Mock request data
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setData(MOCK_DATA[period]);
      setLoading(false);
    }, 800);
  }, [period]);

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
        <button 
          className="rounded-full bg-purple-100 p-2"
          onClick={() => router.push('/connect-wallet')}
        >
          <i className="fas fa-wallet text-black"></i>
        </button>
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
                <div className="animate-pulse h-10 bg-white/30 rounded"></div>
              ) : (
                <>
                  <div className="flex items-center">
                    <i className="fas fa-shoe-prints mr-2"></i>
                    <span>Steps</span>
                  </div>
                  <p className="text-xl font-bold mt-1">{data.steps.toLocaleString()}</p>
                </>
              )}
            </div>
            <div className="bg-white/20 rounded-lg p-3 cursor-pointer" onClick={handleDataClick}>
              {loading ? (
                <div className="animate-pulse h-10 bg-white/30 rounded"></div>
              ) : (
                <>
                  <div className="flex items-center">
                    <i className="fas fa-moon mr-2"></i>
                    <span>Sleep</span>
                  </div>
                  <p className="text-xl font-bold mt-1">{data.sleep} hours</p>
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
              onClick={() => setPeriod(p.key)}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>
      
      {/* Detailed Health Data */}
      <div className="px-6 mt-6">
        <h3 className="font-bold text-black mb-3">Health Details</h3>
        <div className="bg-gray-50 rounded-xl p-4 mb-4 cursor-pointer" onClick={handleDataClick}>
          <div className="flex justify-between items-center">
            <div>
              <div className="flex items-center">
                <i className="fas fa-heart text-purple-500 mr-2"></i>
                <span className="text-black font-medium">Heart Rate</span>
              </div>
              {loading ? (
                <div className="animate-pulse h-6 w-16 bg-gray-200 rounded mt-2"></div>
              ) : (
                <p className="text-black font-bold text-xl">{data.heartRate} <span className="text-xs font-normal">bpm</span></p>
              )}
            </div>
            <div className="w-24 h-12 bg-gray-100 rounded flex items-end">
              <div className="w-3 h-4 bg-purple-300 rounded-t mx-0.5"></div>
              <div className="w-3 h-6 bg-purple-400 rounded-t mx-0.5"></div>
              <div className="w-3 h-8 bg-purple-500 rounded-t mx-0.5"></div>
              <div className="w-3 h-5 bg-purple-400 rounded-t mx-0.5"></div>
              <div className="w-3 h-7 bg-purple-500 rounded-t mx-0.5"></div>
              <div className="w-3 h-6 bg-purple-400 rounded-t mx-0.5"></div>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-50 rounded-xl p-4 mb-4 cursor-pointer" onClick={handleDataClick}>
          <div className="flex justify-between items-center">
            <div>
              <div className="flex items-center">
                <i className="fas fa-fire text-purple-500 mr-2"></i>
                <span className="text-black font-medium">Calories</span>
              </div>
              {loading ? (
                <div className="animate-pulse h-6 w-16 bg-gray-200 rounded mt-2"></div>
              ) : (
                <p className="text-black font-bold text-xl">{data.calories} <span className="text-xs font-normal">kcal</span></p>
              )}
            </div>
            <div className="w-24 h-12 bg-gray-100 rounded flex justify-center items-center">
              <div className="w-20 h-8 relative">
                <svg viewBox="0 0 80 32" className="w-full h-full">
                  <path d="M0,32 C10,28 20,16 30,22 C40,28 50,10 60,14 C70,18 80,24 80,32" fill="none" stroke="#9333ea" strokeWidth="2"></path>
                </svg>
                <div className="absolute right-0 bottom-0 w-2 h-2 bg-purple-500 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-50 rounded-xl p-4 cursor-pointer" onClick={handleDataClick}>
          <div className="flex justify-between items-center">
            <div>
              <div className="flex items-center">
                <i className="fas fa-running text-purple-500 mr-2"></i>
                <span className="text-black font-medium">Activity Time</span>
              </div>
              {loading ? (
                <div className="animate-pulse h-6 w-16 bg-gray-200 rounded mt-2"></div>
              ) : (
                <p className="text-black font-bold text-xl">{data.activity} <span className="text-xs font-normal">minutes</span></p>
              )}
            </div>
            <div className="w-24 h-12 bg-gray-100 rounded flex items-center justify-center">
              <div className="w-16 h-8 rounded-full bg-gray-200 relative">
                <div className="absolute inset-0 rounded-full overflow-hidden">
                  <div className="bg-gradient-to-r from-purple-400 to-green-300 h-full" style={{width: '75%'}}></div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xs text-black font-medium">75%</span>
                </div>
              </div>
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
      
      {/* Connect Wallet Modal */}
      {showConnect && (
        <ConnectWalletModal onClose={handleCloseConnect} onSuccess={handleConnectSuccess} />
      )}
      
      {/* Bottom Navigation */}
      <BottomNavigation activePage="home" />
    </div>
  );
} 