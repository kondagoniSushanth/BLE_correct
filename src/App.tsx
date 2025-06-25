import React, { useState, useEffect } from 'react';
import { FootType, ViewMode } from './types';
import { Navigation } from './components/Navigation';
import { BLEControls } from './components/BLEControls';
import { FootPressureView } from './components/FootPressureView';
import { useBLE } from './hooks/useBLE';
import { useFootData } from './hooks/useFootData';

function App() {
  const [activeTab, setActiveTab] = useState<FootType>('left');
  const [viewMode, setViewMode] = useState<ViewMode>('heatmap');
  
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
    sessionData,
    isRecording,
    countdown,
    parseIncomingData,
    startRecording,
    stopRecording
  } = useFootData();

  // Set up BLE data handler
  useEffect(() => {
    setDataHandler(parseIncomingData);
  }, [setDataHandler, parseIncomingData]);

  const currentFootData = activeTab === 'left' ? leftFootData : rightFootData;

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
        footData={currentFootData}
        footType={activeTab}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        sessionData={sessionData}
        isRecording={isRecording}
        countdown={countdown}
        onStartRecording={() => startRecording(20000)}
        onStopRecording={stopRecording}
        isConnected={bleDevice.connected}
      />
    </div>
  );
}

export default App;