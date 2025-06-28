import React, { useState, useEffect } from 'react';
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

  // Handle navigation from landing page to main app
  const handleGetStarted = () => {
    setShowMainApp(true);
  };

  // Show landing page if main app is not active
  if (!showMainApp) {
    return <LandingPage onGetStarted={handleGetStarted} />;
  }

  // Main application content
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
      
      {/* BLE Controls - Fixed at top */}
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