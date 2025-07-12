import React, { useState, useEffect } from 'react';
import { Home } from 'lucide-react';
import { FootType, ViewMode, AppMode } from './types';
import { LandingPage } from './components/LandingPage';
import { Navigation } from './components/Navigation';
import { BLEControls } from './components/BLEControls';
import { FootPressureView } from './components/FootPressureView';
import { useBLE } from './hooks/useBLE';
import { useFootData } from './hooks/useFootData';

function App() {
  const [showMainApp, setShowMainApp] = useState(false);
  const [activeTab, setActiveTab] = useState<FootType>('left');
  const [viewMode, setViewMode] = useState<ViewMode>('heatmap');
  const [appMode, setAppMode] = useState<AppMode>('live');
  
  const {
    bleDevice,
    isConnecting,
    connect,
    disconnect,
    setDataHandler
  } = useBLE();

  const {
    leftFootData,
    rightFootData,
    averagedLeftFootData,
    averagedRightFootData,
    sessionData,
    graphDataBuffer,
    isRecording,
    parseIncomingData,
    startRecording,
    stopRecording,
    resetAveragedData
  } = useFootData();

  // Set up BLE data handler only when main app is shown
  useEffect(() => {
    if (showMainApp) {
      setDataHandler(parseIncomingData);
    }
  }, [setDataHandler, parseIncomingData, showMainApp]);

  // Show landing page first
  if (!showMainApp) {
    return <LandingPage onGetStarted={() => setShowMainApp(true)} />;
  }

  // Main application content
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Logo and Company Header - At the very top */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* FootRYX Logo */}
              <div className="flex-shrink-0">
                <img 
                  src="/generated-image2 copy copy.png" 
                  alt="FootRYX Logo" 
                  className="w-12 h-12 object-contain"
                />
              </div>
              
              {/* Company Name and Tagline */}
              <div>
                <div className="text-2xl font-bold tracking-wide">
                  <span className="text-red-500">FOOT</span>
                  <span className="text-green-800">RYX</span>
                  <span className="text-gray-600 ml-2 text-lg font-medium">Healthcare</span>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  Real-time plantar pressure analysis system
                </p>
              </div>
            </div>
            
            {/* Status Indicator with Home Button */}
            <div className="flex items-center space-x-2">
              {/* Home Button - Icon Only */}
              <button
                onClick={() => setShowMainApp(false)}
                className="p-2 rounded-full hover:bg-gray-100 text-gray-600 transition-colors duration-200"
                title="Back to Home"
              >
                <Home className="h-5 w-5" />
              </button>
              
              <div className={`w-3 h-3 rounded-full ${
                bleDevice.connected ? 'bg-green-500 animate-pulse' : 'bg-gray-400'
              }`}></div>
              <span className="text-sm text-gray-600 font-medium">
                {bleDevice.connected ? 'Connected' : 'Disconnected'}
              </span>
            </div>
          </div>
        </div>
      </div>

      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
      
      {/* BLE Controls - Unchanged to preserve functionality */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="max-w-7xl mx-auto">
          <BLEControls
            bleDevice={bleDevice}
            isConnecting={isConnecting}
            onConnect={connect}
            onDisconnect={disconnect}
            isRecording={isRecording}
          />
        </div>
      </div>

      {/* Main Content */}
      <FootPressureView
        leftFootData={leftFootData}
        rightFootData={rightFootData}
        averagedLeftFootData={averagedLeftFootData}
        averagedRightFootData={averagedRightFootData}
        footType={activeTab}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        appMode={appMode}
        onAppModeChange={setAppMode}
        sessionData={sessionData}
        graphDataBuffer={graphDataBuffer}
        isRecording={isRecording}
        onStartRecording={() => startRecording(20000)}
        onStopRecording={stopRecording}
        onResetAveragedData={resetAveragedData}
        isConnected={bleDevice.connected}
      />
    </div>
  );
}

export default App;