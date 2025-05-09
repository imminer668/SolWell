'use client'
import { useRouter } from 'next/navigation';
import BottomNavigation from '../components/BottomNavigation';

export default function Insurance() {
  const router = useRouter();
  
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 pb-20">
      {/* Top Navigation */}
      <div className="p-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-black">Insurance</h1>
        <button 
          className="rounded-full bg-purple-100 p-2"
          onClick={() => router.push('/connect-wallet')}
        >
          <i className="fas fa-wallet text-black"></i>
        </button>
      </div>
      
      {/* Health Score */}
      <div className="px-6">
        <div className="bg-gray-50 rounded-xl p-6">
          <h3 className="text-black font-bold mb-2">Your Health Score</h3>
          <div className="flex items-center justify-between">
            <div className="text-4xl font-bold gradient-text">85</div>
            <div className="w-24 h-24 rounded-full border-8 border-purple-500 flex items-center justify-center">
              <span className="text-black font-bold text-2xl">85%</span>
            </div>
          </div>
          <p className="mt-2 text-black text-sm">Based on your health data, your health condition is better than 78% of users</p>
          <div className="mt-3 bg-purple-50 rounded-lg p-2.5">
            <p className="text-black text-sm">Congratulations! High health score can enjoy <span className="font-bold">up to 30%</span> premium discount</p>
          </div>
        </div>
      </div>
      
      {/* Recommended Insurance Products */}
      <div className="px-6 mt-6">
        <h3 className="text-black font-bold mb-3">Recommended Insurance Products</h3>
        
        <div className="bg-white border border-gray-100 rounded-xl p-4 mb-4 shadow-sm relative overflow-hidden">
          <div className="absolute -right-8 -top-2 transform rotate-45 bg-purple-500 text-white text-xs px-8 py-1">Recommended</div>
          <div className="flex items-start">
            <div className="bg-purple-100 p-3 rounded-xl mr-3">
              <i className="fas fa-heartbeat text-purple-500"></i>
            </div>
            <div className="flex-1">
              <h4 className="text-black font-bold">Health Select Insurance</h4>
              <p className="text-xs text-black mt-1">Customized for users in good health, providing comprehensive coverage</p>
              <div className="mt-2 bg-green-50 rounded p-1.5 flex items-center">
                <i className="fas fa-tag text-green-500 mr-1.5 text-xs"></i>
                <span className="text-xs text-black">Based on your health score, you get a 15% discount</span>
              </div>
              <div className="flex justify-between mt-3 items-end">
                <div>
                  <span className="text-xs text-black">Monthly Premium</span>
                  <div className="flex items-end">
                    <p className="text-black font-bold">0.25 SOL</p>
                    <span className="text-xs line-through text-gray-400 ml-1">0.30 SOL</span>
                  </div>
                </div>
                <button className="px-4 py-2 bg-black text-white rounded-lg text-sm">Purchase Now</button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white border border-gray-100 rounded-xl p-4 mb-4 shadow-sm">
          <div className="flex items-start">
            <div className="bg-green-100 p-3 rounded-xl mr-3">
              <i className="fas fa-running text-green-500"></i>
            </div>
            <div className="flex-1">
              <h4 className="text-black font-bold">Sports Protection Plan</h4>
              <p className="text-xs text-black mt-1">Provides accident and medical coverage for users who exercise regularly</p>
              <div className="mt-2 bg-green-50 rounded p-1.5 flex items-center">
                <i className="fas fa-tag text-green-500 mr-1.5 text-xs"></i>
                <span className="text-xs text-black">Your current health condition is excellent! Keep it up to enjoy more premium discounts.</span>
              </div>
              <div className="flex justify-between mt-3 items-end">
                <div>
                  <span className="text-xs text-black">Monthly Premium</span>
                  <div className="flex items-end">
                    <p className="text-black font-bold">0.18 SOL</p>
                    <span className="text-xs line-through text-gray-400 ml-1">0.22 SOL</span>
                  </div>
                </div>
                <button className="px-4 py-2 bg-black text-white rounded-lg text-sm">Purchase Now</button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
          <div className="flex items-start">
            <div className="bg-blue-100 p-3 rounded-xl mr-3">
              <i className="fas fa-hospital text-blue-500"></i>
            </div>
            <div className="flex-1">
              <h4 className="text-black font-bold">Comprehensive Medical Protection</h4>
              <p className="text-xs text-black mt-1">Coverage for hospitalization, outpatient care, and special disease treatment</p>
              <div className="mt-2 bg-yellow-50 rounded p-1.5 flex items-center">
                <i className="fas fa-lightbulb text-yellow-500 mr-1.5 text-xs"></i>
                <span className="text-xs text-black">Increase daily sleep time to get more discounts</span>
              </div>
              <div className="flex justify-between mt-3 items-end">
                <div>
                  <span className="text-xs text-black">Monthly Premium</span>
                  <p className="text-black font-bold">0.35 SOL</p>
                </div>
                <button className="px-4 py-2 bg-black text-white rounded-lg text-sm">Purchase Now</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Health Tips */}
      <div className="px-6 mt-6 mb-6">
        <div className="bg-purple-50 p-4 rounded-xl">
          <h4 className="text-black font-medium mb-2">Health Tips</h4>
          <p className="text-black text-sm">Your current health condition is excellent! Keep it up to enjoy more premium discounts.</p>
          <div className="mt-3 space-y-2">
            <div className="flex items-start">
              <div className="min-w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center mr-2 mt-0.5">
                <i className="fas fa-check text-purple-500 text-xs"></i>
              </div>
              <p className="text-black text-xs">Add 30 minutes of moderate to high intensity exercise per week to improve health score</p>
            </div>
            <div className="flex items-start">
              <div className="min-w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center mr-2 mt-0.5">
                <i className="fas fa-check text-purple-500 text-xs"></i>
              </div>
              <p className="text-black text-xs">Maintain 7-8 hours of quality sleep to improve health score by up to 10%</p>
            </div>
            <div className="flex items-start">
              <div className="min-w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center mr-2 mt-0.5">
                <i className="fas fa-check text-purple-500 text-xs"></i>
              </div>
              <p className="text-black text-xs">Apply for insurance now to lock in current discounts, health status changes won't affect premiums</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom Navigation */}
      <BottomNavigation activePage="insurance" />
    </div>
  );
} 