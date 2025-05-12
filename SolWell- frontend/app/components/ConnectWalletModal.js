'use client';
import { useWallet } from '../contexts/WalletContext';
import { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';

export default function ConnectWalletModal({ onClose, onSuccess }) {
  const { connectWallet, connecting, walletAddress } = useWallet();
  const [connectingLocal, setConnectingLocal] = useState(false);
  const [syncAfterConnect, setSyncAfterConnect] = useState(true);
  const [error, setError] = useState(null);
  const [currentUrl, setCurrentUrl] = useState('');
  const [showQR, setShowQR] = useState(false);
  
  
  const isMobile = typeof window !== 'undefined' && /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  
  // check if it is local access (not localhost)
  const isRemoteAccess = typeof window !== 'undefined' && 
    !window.location.hostname.match(/^localhost$|^127(?:\.[0-9]+){0,2}\.[0-9]+$|^(?:0*:)*?:?0*1$/);

  // get current URL
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCurrentUrl(window.location.href);
    }
  }, []);

  const handleConnect = async () => {
    setConnectingLocal(true);
    setError(null);
    try {
      const result = await connectWallet();
      // if the return value is "redirecting", it means it is redirecting to Phantom App
      if (result === "redirecting") {
        setError("Redirecting to Phantom App...");
        return;
      }
      if (onSuccess) onSuccess(syncAfterConnect);
    } catch (error) {
      console.error("Connection error:", error);
      if (isRemoteAccess) {
        setError("Connecting to wallet may be restricted in local network environment. Please try to open the application locally or scan the QR code using the Phantom App.");
      } else {
        setError("Failed to connect wallet: " + (error.message || "Unknown error"));
      }
    } finally {
      setConnectingLocal(false);
    }
  };

  // 生成Phantom深层链接URL
  const getPhantomDeepLink = () => {
    return `https://phantom.app/ul/browse/${encodeURIComponent(currentUrl)}`;
  };

  // 切换显示二维码
  const toggleQRCode = () => {
    setShowQR(!showQR);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-xl w-80 max-w-full p-6 relative animate-fade-in">
        <button className="absolute right-3 top-3 text-gray-400" onClick={onClose}><i className="fas fa-times"></i></button>
        <div className="w-24 h-24 rounded-full gradient-bg flex items-center justify-center mb-6 mx-auto">
          <i className="fas fa-wallet text-white text-3xl"></i>
        </div>
        <h2 className="text-2xl font-bold text-black text-center">Connect Wallet</h2>
        <p className="text-black text-center mt-2 mb-4">Connect your Solana wallet to sync health data and access insurance services</p>
        
        {/* error message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4 text-sm">
            {error}
          </div>
        )}
        
        {/* local network access message */}
        {isRemoteAccess && !error && (
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded mb-4 text-sm">
            You are accessing through a local network. If the wallet connection fails, please try to use the Phantom App to scan the QR code below to connect.
          </div>
        )}
        
        {/* 显示二维码 */}
        {showQR && (
          <div className="mb-4 flex flex-col items-center">
            <div className="bg-white p-2 rounded-lg shadow-sm border">
              <QRCodeSVG 
                value={getPhantomDeepLink()} 
                size={200} 
                bgColor={"#ffffff"} 
                fgColor={"#000000"} 
                level={"L"} 
                includeMargin={false}
              />
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">
              Scan this QR code using the Phantom App to connect the wallet
            </p>
          </div>
        )}
        
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
            Sync health data after connecting
          </label>
        </div>
        
        <div className="w-full space-y-3">
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
          
          {/* QR code toggle button */}
          {!isMobile && (
            <button
              className="w-full py-2 bg-gray-100 text-gray-700 rounded-xl font-medium flex items-center justify-center text-sm"
              onClick={toggleQRCode}
              type="button"
            >
              {showQR ? "Hide QR code" : "Show QR code to connect"}
            </button>
          )}
          
          {/* mobile device */}
          {isMobile && (
            <p className="text-center text-sm text-gray-500 mt-2">
              If you have installed the Phantom App, please click the button above to connect
            </p>
          )}
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