import React from 'react';
import { FootData, ViewMode, SessionData, FootType } from '../types';
import { HeatmapCanvas } from './HeatmapCanvas';
import { ConsoleView } from './ConsoleView';
import { GraphView } from './GraphView';
import { SerialTerminal } from './SerialTerminal';
import { PressureLegend } from './PressureLegend';
import { ViewControls } from './ViewControls';
import { RecordingControls } from './RecordingControls';
import { ExportControls } from './ExportControls';

interface FootPressureViewProps {
  footData: FootData;
  footType: FootType;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  sessionData: SessionData[];
  isRecording: boolean;
  onStartRecording: () => void;
  onStopRecording: () => void;
  isConnected: boolean;
}

export const FootPressureView: React.FC<FootPressureViewProps> = ({
  footData,
  footType,
  viewMode,
  onViewModeChange,
  sessionData,
  isRecording,
  onStartRecording,
  onStopRecording,
  isConnected
}) => {
  const canvasId = `${footType}-foot-canvas`;

  return (
    <div className={`min-h-screen ${footType === 'left' ? 'bg-red-50' : 'bg-green-50'} p-6`}>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className={`text-3xl font-bold ${footType === 'left' ? 'text-red-900' : 'text-green-900'} mb-2`}>
            {footType === 'left' ? 'Left' : 'Right'} Foot Pressure Map
          </h1>
          <p className="text-gray-600">
            Real-time plantar pressure visualization from ESP32 BLE sensors
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Controls Column */}
          <div className="lg:col-span-1 space-y-6">
            <ViewControls viewMode={viewMode} onViewModeChange={onViewModeChange} />
            <RecordingControls
              isRecording={isRecording}
              onStartRecording={onStartRecording}
              onStopRecording={onStopRecording}
              isConnected={isConnected}
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
                      footData={footData}
                      footType={footType}
                      canvasId={canvasId}
                    />
                  </div>
                </div>
              )}

              {viewMode === 'console' && (
                <ConsoleView footData={footData} footType={footType} />
              )}

              {viewMode === 'graph' && (
                <GraphView sessionData={sessionData} footType={footType} />
              )}
            </div>

            {/* Serial Terminal - Always visible */}
            <SerialTerminal isConnected={isConnected} />
          </div>
        </div>

        {/* Status Bar */}
        <div className="mt-6 bg-white rounded-lg shadow-sm p-4 border border-gray-200">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div>
              Last Update: {footData.lastUpdate.toLocaleTimeString()}
            </div>
            <div>
              Max Pressure: {Math.max(...footData.sensors.map(s => s.value)).toFixed(1)} kPa
            </div>
            <div>
              Active Sensors: {footData.sensors.filter(s => s.value > 0).length}/8
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};