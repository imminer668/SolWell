'use client'
import { useRouter } from 'next/navigation';
import BottomNavigation from '../components/BottomNavigation';
import { useWallet } from '../contexts/WalletContext';
import WalletDropdown from '../components/WalletDropdown';

export default function Profile() {
  const router = useRouter();
  const { walletAddress, formatWalletAddress, balance } = useWallet();
  
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 pb-20">
      {/* Top Navigation */}
      <div className="p-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-black">Profile</h1>
        {walletAddress ? (
          <WalletDropdown />
        ) : (
          <button 
            className="rounded-full bg-purple-100 p-2 hover:bg-purple-200 transition-colors duration-300"
            onClick={() => router.push('/')}
          >
            <i className="fas fa-wallet text-black"></i>
          </button>
        )}
      </div>
      
      {/* User Info */}
      <div className="px-6">
        <div className="flex items-center">
          <div className="w-20 h-20 rounded-full gradient-bg flex items-center justify-center mr-4">
            <i className="fas fa-user text-white text-2xl"></i>
          </div>
          <div>
            <h2 className="text-black font-bold text-xl">
              {walletAddress ? 'Solana User' : 'Not Connected'}
            </h2>
            <div className="flex items-center mt-1">
              <div className={`rounded-full px-2 py-1 text-xs mr-2 flex items-center ${walletAddress ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-500'}`}>
                <i className={`fas fa-wallet mr-1 text-xs ${walletAddress ? 'text-purple-500' : 'text-gray-500'}`}></i>
                {walletAddress ? 'Connected' : 'Not Connected'}
              </div>
              {walletAddress && (
                <p className="text-black text-xs font-mono">
                  {formatWalletAddress(walletAddress)}
                </p>
              )}
            </div>
            {walletAddress && balance && (
              <div className="mt-2 text-sm text-gray-600">
                <span className="bg-green-50 text-green-700 rounded-full px-2 py-0.5 text-xs">
                  <i className="fas fa-coins mr-1 text-xs"></i>
                  {balance} SOL
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Data Statistics */}
      <div className="px-6 mt-6">
        <div className="bg-gray-50 rounded-xl p-4">
          <div className="grid grid-cols-3 gap-2">
            <div className="text-center">
              <p className="text-black text-sm">Health Score</p>
              <p className="text-black font-bold text-xl mt-1">85</p>
            </div>
            <div className="text-center border-l border-r border-gray-200">
              <p className="text-black text-sm">Insurance Assets</p>
              <p className="text-black font-bold text-xl mt-1">2.5 SOL</p>
            </div>
            <div className="text-center">
              <p className="text-black text-sm">Healthy Days</p>
              <p className="text-black font-bold text-xl mt-1">156</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Feature Menu */}
      <div className="px-6 mt-6">
        <h3 className="text-black font-bold mb-3">My Services</h3>
        
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-4 flex items-center justify-between border-b border-gray-100">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                <i className="fas fa-file-contract text-purple-500"></i>
              </div>
              <span className="text-black">My Policies</span>
            </div>
            <i className="fas fa-chevron-right text-gray-400"></i>
          </div>
          
          <div className="p-4 flex items-center justify-between border-b border-gray-100">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-3">
                <i className="fas fa-heartbeat text-green-500"></i>
              </div>
              <span className="text-black">Health Records</span>
            </div>
            <i className="fas fa-chevron-right text-gray-400"></i>
          </div>
          
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                <i className="fas fa-coins text-blue-500"></i>
              </div>
              <span className="text-black">Transaction History</span>
            </div>
            <i className="fas fa-chevron-right text-gray-400"></i>
          </div>
        </div>
      </div>
      
      {/* System Settings */}
      <div className="px-6 mt-6">
        <h3 className="text-black font-bold mb-3">System Settings</h3>
        
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-4 flex items-center justify-between border-b border-gray-100">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center mr-3">
                <i className="fas fa-bell text-gray-500"></i>
              </div>
              <span className="text-black">Notifications</span>
            </div>
            <i className="fas fa-chevron-right text-gray-400"></i>
          </div>
          
          <div className="p-4 flex items-center justify-between border-b border-gray-100">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center mr-3">
                <i className="fas fa-shield-alt text-gray-500"></i>
              </div>
              <span className="text-black">Privacy Settings</span>
            </div>
            <i className="fas fa-chevron-right text-gray-400"></i>
          </div>
          
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center mr-3">
                <i className="fas fa-question-circle text-gray-500"></i>
              </div>
              <span className="text-black">Help Center</span>
            </div>
            <i className="fas fa-chevron-right text-gray-400"></i>
          </div>
        </div>
      </div>
      
      {/* Bottom Navigation */}
      <BottomNavigation activePage="profile" />
    </div>
  );
} 