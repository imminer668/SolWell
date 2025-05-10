'use client'
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import BottomNavigation from '../components/BottomNavigation';

// CountUp component for number animation
function CountUp({ end, duration }) {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    if (!end) return;
    
    let startTime;
    let animationFrame;
    
    const updateCount = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      setCount(Math.floor(progress * end));
      
      if (progress < 1) {
        animationFrame = requestAnimationFrame(updateCount);
      }
    };
    
    animationFrame = requestAnimationFrame(updateCount);
    
    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [end, duration]);
  
  return count;
}

// Mock API data
const MOCK_API_DATA = {
  userHealth: {
    score: 85,
    percentile: 78,
    maxDiscount: 30
  },
  insuranceProducts: [
    {
      id: 1,
      name: "Health Select Insurance",
      description: "Customized for users in good health, providing comprehensive coverage",
      icon: "fa-heartbeat",
      iconBg: "bg-purple-100",
      iconColor: "text-purple-500",
      tag: {
        text: "Based on your health score, you get a 15% discount",
        bgColor: "bg-green-50",
        icon: "fa-tag",
        iconColor: "text-green-500"
      },
      price: {
        current: "0.25",
        original: "0.30"
      },
      recommended: true
    },
    {
      id: 2,
      name: "Sports Protection Plan",
      description: "Provides accident and medical coverage for users who exercise regularly",
      icon: "fa-running",
      iconBg: "bg-green-100",
      iconColor: "text-green-500",
      tag: {
        text: "Your exercise habits are good, enjoy 20% discount",
        bgColor: "bg-green-50",
        icon: "fa-tag",
        iconColor: "text-green-500"
      },
      price: {
        current: "0.18",
        original: "0.22"
      },
      recommended: false
    },
    {
      id: 3,
      name: "Comprehensive Medical Protection",
      description: "Coverage for hospitalization, outpatient care, and special disease treatment",
      icon: "fa-hospital",
      iconBg: "bg-blue-100",
      iconColor: "text-blue-500",
      tag: {
        text: "Increase daily sleep time to get more discounts",
        bgColor: "bg-yellow-50",
        icon: "fa-lightbulb",
        iconColor: "text-yellow-500"
      },
      price: {
        current: "0.35",
        original: null
      },
      recommended: false
    }
  ],
  healthTips: [
    "Add 30 minutes of moderate to high intensity exercise per week to improve health score",
    "Maintain 7-8 hours of quality sleep to improve health score by up to 10%",
    "Apply for insurance now to lock in current discounts, health status changes won't affect premiums"
  ]
};

export default function Insurance() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [animated, setAnimated] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  
  // Simulate API fetch
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      
      try {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1200));
        
        // Simulate successful API response
        const response = MOCK_API_DATA;
        
        // 5% chance of error for testing error handling
        if (Math.random() < 0.05) {
          throw new Error("Failed to fetch insurance data. Please try again.");
        }
        
        setData(response);
        setError(null);
        
        // Trigger animations after data is loaded
        setTimeout(() => {
          setLoading(false);
          setTimeout(() => setAnimated(true), 100);
        }, 300);
        
      } catch (err) {
        console.error("Error fetching insurance data:", err);
        setError(err.message);
        setLoading(false);
      }
    };
    
    fetchData();
    
    // Cleanup function
    return () => {
      setData(null);
      setAnimated(false);
    };
  }, []);
  
  // Handle retry on error
  const handleRetry = () => {
    setError(null);
    setAnimated(false);
    setLoading(true);
    
    // Simulate new request
    setTimeout(() => {
      setData(MOCK_API_DATA);
      setLoading(false);
      setTimeout(() => setAnimated(true), 100);
    }, 1000);
  };
  
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 pb-20">
      {/* Top Navigation */}
      <div className="p-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-black">Insurance</h1>
        <button 
          className="rounded-full bg-purple-100 p-2 hover:bg-purple-200 transition-colors duration-300"
          onClick={() => router.push('/connect-wallet')}
        >
          <i className="fas fa-wallet text-black"></i>
        </button>
      </div>
      
      {/* Error State */}
      {error && (
        <div className="px-6 mb-4">
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700">
            <div className="flex items-center mb-2">
              <i className="fas fa-exclamation-circle mr-2"></i>
              <h3 className="font-bold">Error Loading Data</h3>
            </div>
            <p className="text-sm mb-3">{error}</p>
            <button 
              className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-700 transition-colors"
              onClick={handleRetry}
            >
              Try Again
            </button>
          </div>
        </div>
      )}
      
      {/* Health Score */}
      <div className="px-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition duration-300">
          <h3 className="text-black font-bold mb-2">Your Health Score</h3>
          <div className="flex items-center justify-between">
            <div className={`text-4xl font-bold gradient-text ${animated ? 'animate-number-pop' : 'opacity-0'}`}>
              {loading ? (
                <div className="h-10 w-16 bg-gray-200 rounded shimmer-loading"></div>
              ) : (
                data?.userHealth.score || '—'
              )}
            </div>
            <div className={`w-24 h-24 rounded-full flex items-center justify-center relative ${animated ? 'animate-score-appear' : 'opacity-0'}`}>
              {loading ? (
                <div className="absolute inset-0 rounded-full shimmer-loading"></div>
              ) : (
                <>
                  <div className="absolute inset-0 rounded-full border-8 border-purple-500 animate-score-border"></div>
                  <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
                    <circle 
                      cx="50" 
                      cy="50" 
                      r="46" 
                      fill="none" 
                      stroke="#9333ea" 
                      strokeWidth="8" 
                      strokeDasharray="289.5" 
                      strokeDashoffset="289.5" 
                      className={animated ? "circle-animation" : ""}
                      style={animated ? { "--final-offset": `${(289.5 * (1 - data?.userHealth.score/100)).toFixed(3)}` } : {}}
                    />
                  </svg>
                  <span className="text-black font-bold text-2xl relative z-10">
                    {animated ? <CountUp end={data?.userHealth.score || 0} duration={1.5} /> : "—"}%
                  </span>
                </>
              )}
            </div>
          </div>
          {loading ? (
            <div className="mt-2 h-4 bg-gray-200 rounded w-3/4 shimmer-loading"></div>
          ) : (
            <p className="mt-2 text-black text-sm">
              Based on your health data, your health condition is better than {data?.userHealth.percentile || '—'}% of users
            </p>
          )}
          <div className={`mt-3 bg-purple-50 rounded-lg p-2.5 ${animated ? 'animate-slide-right' : 'opacity-0 -translate-x-4'}`}>
            {loading ? (
              <div className="h-4 bg-purple-100 rounded w-full shimmer-loading"></div>
            ) : (
              <p className="text-black text-sm">
                Congratulations! High health score can enjoy <span className="font-bold">up to {data?.userHealth.maxDiscount || '—'}%</span> premium discount
              </p>
            )}
          </div>
        </div>
      </div>
      
      {/* Recommended Insurance Products */}
      <div className="px-6 mt-6">
        <h3 className="text-black font-bold mb-3">Recommended Insurance Products</h3>
        
        {loading ? (
          // Loading skeletons for products
          Array(3).fill(0).map((_, index) => (
            <div key={`skeleton-${index}`} className="bg-white rounded-xl p-4 mb-4 shadow-sm animate-pulse">
              <div className="flex items-start">
                <div className="w-10 h-10 bg-gray-200 rounded-xl mr-3"></div>
                <div className="flex-1">
                  <div className="h-5 bg-gray-200 rounded w-1/3 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-full mb-3"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
                  <div className="flex justify-between mt-3">
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-8 bg-gray-200 rounded w-1/4"></div>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          // Actual products
          data?.insuranceProducts.map((product, index) => (
            <div 
              key={product.id}
              className={`bg-white border border-gray-100 rounded-xl p-4 mb-4 shadow-sm relative overflow-hidden transition-all duration-300 hover:shadow-md ${animated ? 'animate-card-appear' : 'opacity-0 -translate-y-4'} ${product.recommended ? 'recommended-card' : ''}`} 
              style={{ animationDelay: `${0.1 + index * 0.2}s` }}
            >
              {product.recommended && (
                <>
                  <div className="absolute -right-8 -top-2 transform rotate-45 bg-purple-500 text-white text-xs px-8 py-1 animate-badge-slide">
                    Recommended
                  </div>
                  <div className="absolute inset-0 border-2 border-purple-300 rounded-xl pointer-events-none recommended-border"></div>
                  <div className="absolute -inset-1 bg-gradient-to-r from-purple-400/20 via-purple-300/10 to-green-300/20 rounded-xl animate-gradient-background pointer-events-none"></div>
                </>
              )}
              <div className={`flex items-start relative ${product.recommended ? 'z-10' : ''}`}>
                <div className={`${product.iconBg} p-3 rounded-xl mr-3 ${product.recommended ? 'animate-icon-pulse' : ''}`}>
                  <i className={`fas ${product.icon} ${product.iconColor} ${product.icon === 'fa-lightbulb' ? 'animate-lightbulb' : 'animate-pulse-icon'}`}></i>
                </div>
                <div className="flex-1">
                  <h4 className={`text-black font-bold ${product.recommended ? 'recommended-text' : ''}`}>{product.name}</h4>
                  <p className="text-xs text-black mt-1">{product.description}</p>
                  <div className={`mt-2 ${product.tag.bgColor} rounded p-1.5 flex items-center ${product.recommended ? 'animate-background-pulse' : ''}`}>
                    <i className={`fas ${product.tag.icon} ${product.tag.iconColor} mr-1.5 text-xs ${product.recommended ? 'animate-pulse-icon' : ''}`}></i>
                    <span className="text-xs text-black">{product.tag.text}</span>
                  </div>
                  <div className="flex justify-between mt-3 items-end">
                    <div>
                      <span className="text-xs text-black">Monthly Premium</span>
                      <div className="flex items-end">
                        <p className={`text-black font-bold ${product.recommended ? 'recommended-price' : ''}`}>{product.price.current} SOL</p>
                        {product.price.original && (
                          <span className="text-xs line-through text-gray-400 ml-1">{product.price.original} SOL</span>
                        )}
                      </div>
                    </div>
                    <button className={`px-4 py-2 rounded-lg text-sm hover:bg-gray-800 transition-colors duration-300 ${product.recommended ? 'bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white animate-button-pulse' : 'bg-black text-white'}`}>
                      Purchase Now
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      
      {/* Health Tips */}
      <div className="px-6 mt-6 mb-6">
        <div className={`bg-purple-50 p-4 rounded-xl ${animated ? 'animate-fade-in' : 'opacity-0'}`} style={{ animationDelay: '0.7s' }}>
          <h4 className="text-black font-medium mb-2">Health Tips</h4>
          {loading ? (
            <div className="space-y-2">
              <div className="h-3 bg-purple-100 rounded w-full shimmer-loading"></div>
              <div className="h-3 bg-purple-100 rounded w-full shimmer-loading"></div>
              <div className="h-3 bg-purple-100 rounded w-3/4 shimmer-loading"></div>
            </div>
          ) : (
            <>
              <p className="text-black text-sm">Your current health condition is excellent! Keep it up to enjoy more premium discounts.</p>
              <div className="mt-3 space-y-2">
                {data?.healthTips.map((tip, index) => (
                  <div 
                    key={`tip-${index}`}
                    className={`flex items-start ${animated ? 'animate-tip-slide' : 'opacity-0 -translate-x-4'}`} 
                    style={{ animationDelay: `${0.8 + index * 0.1}s` }}
                  >
                    <div className="min-w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center mr-2 mt-0.5">
                      <i className="fas fa-check text-purple-500 text-xs"></i>
                    </div>
                    <p className="text-black text-xs">{tip}</p>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
      
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
        
        .animate-score-border {
          animation: pulse-border 2s infinite ease-in-out;
        }
        
        @keyframes pulse-border {
          0%, 100% {
            border-color: rgba(147, 51, 234, 0.9);
          }
          50% {
            border-color: rgba(147, 51, 234, 0.6);
          }
        }
        
        .animate-number-pop {
          animation: number-pop 0.6s ease-out forwards;
        }
        
        @keyframes number-pop {
          0% {
            opacity: 0;
            transform: scale(0.7);
          }
          70% {
            transform: scale(1.1);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        .animate-score-appear {
          animation: appear 0.6s ease-out forwards;
        }
        
        @keyframes appear {
          0% {
            opacity: 0;
          }
          100% {
            opacity: 1;
          }
        }
        
        .animate-card-appear {
          animation: card-slide-in 0.5s ease-out forwards;
        }
        
        @keyframes card-slide-in {
          0% {
            opacity: 0;
            transform: translateY(-16px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-slide-right {
          animation: slide-right 0.5s ease-out forwards;
        }
        
        @keyframes slide-right {
          0% {
            opacity: 0;
            transform: translateX(-16px);
          }
          100% {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        .animate-tip-slide {
          animation: tip-slide 0.5s ease-out forwards;
        }
        
        @keyframes tip-slide {
          0% {
            opacity: 0;
            transform: translateX(-16px);
          }
          100% {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
        }
        
        @keyframes fade-in {
          0% {
            opacity: 0;
          }
          100% {
            opacity: 1;
          }
        }
        
        .animate-pulse-icon {
          animation: pulse-icon 2s infinite ease-in-out;
        }
        
        @keyframes pulse-icon {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.1);
          }
        }
        
        .animate-badge-slide {
          animation: badge-slide 0.5s 0.2s ease-out backwards;
        }
        
        @keyframes badge-slide {
          0% {
            transform: translateX(50px) rotate(45deg);
          }
          100% {
            transform: translateX(0) rotate(45deg);
          }
        }
        
        .animate-lightbulb {
          animation: glow 2s infinite ease-in-out;
        }
        
        @keyframes glow {
          0%, 100% {
            opacity: 1;
            filter: drop-shadow(0 0 0 rgba(234, 179, 8, 0));
          }
          50% {
            opacity: 0.9;
            filter: drop-shadow(0 0 3px rgba(234, 179, 8, 0.8));
          }
        }
        
        .circle-animation {
          animation: circle-progress 1.5s ease-out forwards;
        }
        
        @keyframes circle-progress {
          0% {
            stroke-dashoffset: 289.5;
          }
          100% {
            stroke-dashoffset: var(--final-offset);
          }
        }
        
        .recommended-card {
          animation: card-breathe 3s ease-in-out infinite;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        }
        
        @keyframes card-breathe {
          0%, 100% {
            transform: scale(1);
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
          }
          50% {
            transform: scale(1.01);
            box-shadow: 0 10px 15px -3px rgba(139, 92, 246, 0.2), 0 4px 6px -2px rgba(139, 92, 246, 0.1);
          }
        }
        
        .recommended-border {
          animation: border-pulse 3s ease-in-out infinite;
        }
        
        @keyframes border-pulse {
          0%, 100% {
            opacity: 0.3;
          }
          50% {
            opacity: 0.9;
          }
        }
        
        .animate-gradient-background {
          animation: gradient-shift 8s ease-in-out infinite;
          background-size: 200% 200%;
        }
        
        @keyframes gradient-shift {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        
        .animate-icon-pulse {
          animation: icon-pulse 2s ease-in-out infinite;
        }
        
        @keyframes icon-pulse {
          0%, 100% {
            transform: scale(1);
            box-shadow: 0 0 0 rgba(139, 92, 246, 0);
          }
          50% {
            transform: scale(1.1);
            box-shadow: 0 0 10px rgba(139, 92, 246, 0.4);
          }
        }
        
        .recommended-text {
          background: linear-gradient(to right, #9333ea, #4f46e5);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          background-size: 200% auto;
          animation: text-shine 3s linear infinite;
        }
        
        @keyframes text-shine {
          0% {
            background-position: 0% center;
          }
          100% {
            background-position: 200% center;
          }
        }
        
        .animate-background-pulse {
          animation: bg-pulse 3s ease-in-out infinite;
        }
        
        @keyframes bg-pulse {
          0%, 100% {
            background-color: rgba(240, 253, 244, 1);
          }
          50% {
            background-color: rgba(220, 252, 231, 1);
          }
        }
        
        .recommended-price {
          animation: price-pulse 3s ease-in-out infinite;
          font-size: 1.1rem;
        }
        
        @keyframes price-pulse {
          0%, 100% {
            color: #111827;
          }
          50% {
            color: #7e22ce;
          }
        }
        
        .animate-button-pulse {
          animation: button-pulse 3s ease-in-out infinite;
          position: relative;
          overflow: hidden;
        }
        
        .animate-button-pulse:after {
          content: "";
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: linear-gradient(45deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0) 100%);
          transform: rotate(45deg);
          animation: button-shine 3s ease-in-out infinite;
        }
        
        @keyframes button-pulse {
          0%, 100% {
            box-shadow: 0 0 0 rgba(126, 34, 206, 0);
          }
          50% {
            box-shadow: 0 0 10px rgba(126, 34, 206, 0.6);
          }
        }
        
        @keyframes button-shine {
          0% {
            top: -50%;
            left: -50%;
          }
          100% {
            top: 150%;
            left: 150%;
          }
        }
      `}</style>
      
      {/* Bottom Navigation */}
      <BottomNavigation activePage="insurance" />
    </div>
  );
} 