import React from 'react';
import { FootData, ViewMode, SessionData, FootType, AppMode } from '../types';
import { HeatmapCanvas } from './HeatmapCanvas';
import { ConsoleView } from './ConsoleView';
import { GraphView } from './GraphView';
import { SerialTerminal } from './SerialTerminal';
import { PressureLegend } from './PressureLegend';
import { ViewControls } from './ViewControls';
import { ModeControls } from './ModeControls';
import { ExportControls } from './ExportControls';

interface FootPressureViewProps {
  leftFootData: FootData;
  rightFootData: FootData;
  averagedLeftFootData: FootData | null;
  averagedRightFootData: FootData | null;
  footType: FootType;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  appMode: AppMode;
  onAppModeChange: (mode: AppMode) => void;
  sessionData: SessionData[];
  graphDataBuffer: SessionData[];
  isRecording: boolean;
  onStartRecording: () => void;
  onStopRecording: () => void;
  onResetAveragedData: () => void;
  isConnected: boolean;
}

export const FootPressureView: React.FC<FootPressureViewProps> = ({
  leftFootData,
  rightFootData,
  averagedLeftFootData,
  averagedRightFootData,
  footType,
  viewMode,
  onViewModeChange,
  appMode,
  onAppModeChange,
  sessionData,
  graphDataBuffer,
  isRecording,
  onStartRecording,
  onStopRecording,
  onResetAveragedData,
  isConnected
}) => {
  const canvasId = `${footType}-foot-canvas`;

  // Determine which data to display based on mode and recording state
  const getCurrentFootData = (): FootData => {
    const liveData = footType === 'left' ? leftFootData : rightFootData;
    const averagedData = footType === 'left' ? averagedLeftFootData : averagedRightFootData;
    
    // Always show live data in live mode or during recording
    if (appMode === 'live' || isRecording) {
      return liveData;
    }
    
    // In test mode, show averaged data if available, otherwise fallback to live data
    if (appMode === 'test' && averagedData) {
      return averagedData;
    }
    
    return liveData;
  };

  const currentFootData = getCurrentFootData();
  const hasAveragedData = (footType === 'left' ? averagedLeftFootData : averagedRightFootData) !== null;

  // Determine which data to use for the graph based on app mode
  const getGraphData = (): SessionData[] => {
    if (appMode === 'live') {
      return graphDataBuffer;
    } else {
      return sessionData;
    }
  };
  return (
    <div className={`min-h-screen ${footType === 'left' ? 'bg-red-50' : 'bg-green-50'} p-6`}>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {/* Title and Description - Logo removed from here */}
            <div>
              <h1 className={`text-3xl font-bold ${footType === 'left' ? 'text-red-900' : 'text-green-900'} mb-2`}>
                {footType === 'left' ? 'Left' : 'Right'} Foot Pressure Map
              </h1>
              <p className="text-gray-600">
                Real-time plantar pressure visualization from ESP32 BLE sensors
              </p>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                appMode === 'live' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-blue-100 text-blue-800'
              }`}>
                {appMode === 'live' ? '📡 Live Mode' : '🧪 Test Mode'}
              </div>
              {appMode === 'test' && hasAveragedData && !isRecording && (
                <div className="px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                  📊 Showing Averaged Data
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Controls Column */}
          <div className="lg:col-span-1 space-y-6">
            <ViewControls viewMode={viewMode} onViewModeChange={onViewModeChange} />
            <ModeControls
              appMode={appMode}
              onAppModeChange={onAppModeChange}
              isRecording={isRecording}
              onStartRecording={onStartRecording}
              onStopRecording={onStopRecording}
              onResetAveragedData={onResetAveragedData}
              isConnected={isConnected}
              hasAveragedData={hasAveragedData}
            />
            <ExportControls
              sessionData={sessionData}
              canvasId={canvasId}
              footType={footType}
            />
            {viewMode === 'heatmap' && <PressureLegend />}
          </div>

          {/* Main Content Column */}
          <div className="lg:col-span-3 space-y-6">
            {/* Main View */}
            <div>
              {viewMode === 'heatmap' && (
                <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                  <div className="flex justify-center">
                    <HeatmapCanvas
                      footData={currentFootData}
                      footType={footType}
                      canvasId={canvasId}
                    />
                  </div>
                </div>
              )}

              {viewMode === 'console' && (
                <ConsoleView footData={currentFootData} footType={footType} />
              )}

              {viewMode === 'graph' && (
                <GraphView sessionData={getGraphData()} footType={footType} />
              )}
            </div>

            {/* Serial Terminal - Always visible */}
            <SerialTerminal isConnected={isConnected} />
          </div>
        </div>

        {/* Status Bar with Individual Sensor Values */}
        <div className="mt-6 bg-white rounded-lg shadow-sm p-4 border border-gray-200">
          <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
            <div>
              Last Update: {currentFootData.lastUpdate.toLocaleTimeString()}
            </div>
            <div>
              Max Pressure: {Math.max(...currentFootData.sensors.map(s => s.value)).toFixed(1)} kPa
            </div>
            <div>
              Active Sensors: {currentFootData.sensors.filter(s => s.value > 0).length}/8
            </div>
          </div>
          
          {/* Individual Sensor Values */}
          <div className="border-t border-gray-200 pt-4">
            <h4 className="text-sm font-medium text-gray-900 mb-3">Individual Sensor Readings:</h4>
            <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
              {currentFootData.sensors.map((sensor) => (
                <div
                  key={sensor.id}
                  className={`text-center p-3 rounded-lg border-2 transition-all duration-200 ${
                    sensor.value > 0
                      ? 'bg-blue-50 border-blue-200 text-blue-900'
                      : 'bg-gray-50 border-gray-200 text-gray-500'
                  }`}
                >
                  <div className="font-bold text-lg">{sensor.id}</div>
                  <div className="text-sm font-medium">
                    {sensor.value.toFixed(1)} kPa
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};