import React from 'react';
import { Play, Square, Timer, BarChart3 } from 'lucide-react';

interface RecordingControlsProps {
  isRecording: boolean;
  onStartRecording: () => void;
  onStopRecording: () => void;
  isConnected: boolean;
}

export const RecordingControls: React.FC<RecordingControlsProps> = ({
  isRecording,
  onStartRecording,
  onStopRecording,
  isConnected
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
      <div className="flex items-center space-x-2 mb-4">
        <BarChart3 className="h-5 w-5 text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-900">Data Recording</h3>
      </div>
      
      <div className="space-y-4">
        {!isRecording ? (
          <button
            onClick={onStartRecording}
            disabled={!isConnected}
            className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 shadow-sm"
          >
            <Play className="h-5 w-5" />
            <span className="font-medium">Start 20s Recording</span>
          </button>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center justify-center space-x-2 text-red-600 bg-red-50 p-3 rounded-lg border border-red-200">
              <Timer className="h-5 w-5 animate-pulse" />
              <span className="font-medium">Recording in Progress...</span>
            </div>
            <button
              onClick={onStopRecording}
              className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
            >
              <Square className="h-4 w-4" />
              <span>Stop Recording</span>
            </button>
          </div>
        )}
        
        {!isConnected && (
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              ⚠️ Connect to ESP32 first to enable recording
            </p>
          </div>
        )}
      </div>
      
      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <h4 className="text-sm font-medium text-blue-900 mb-2">How it works:</h4>
        <ul className="text-xs text-blue-800 space-y-1">
          <li>• Records all sensor data for 20 seconds</li>
          <li>• Calculates average pressure for each sensor</li>
          <li>• Updates heatmap with averaged values</li>
          <li>• Data is available for export after recording</li>
        </ul>
      </div>
    </div>
  );
};