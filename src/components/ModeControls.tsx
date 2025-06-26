import React, { useState, useEffect } from 'react';
import { Play, Square, Timer, BarChart3, Radio, TestTube, RotateCcw } from 'lucide-react';
import { AppMode } from '../types';

interface ModeControlsProps {
  appMode: AppMode;
  onAppModeChange: (mode: AppMode) => void;
  isRecording: boolean;
  onStartRecording: () => void;
  onStopRecording: () => void;
  onResetAveragedData: () => void;
  isConnected: boolean;
  hasAveragedData: boolean;
}

export const ModeControls: React.FC<ModeControlsProps> = ({
  appMode,
  onAppModeChange,
  isRecording,
  onStartRecording,
  onStopRecording,
  onResetAveragedData,
  isConnected,
  hasAveragedData
}) => {
  const [countdown, setCountdown] = useState<number>(0);

  // Countdown timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isRecording && countdown > 0) {
      interval = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isRecording, countdown]);

  const handleStartRecording = () => {
    setCountdown(20); // 20 seconds countdown
    onStartRecording();
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
      <div className="flex items-center space-x-2 mb-6">
        <BarChart3 className="h-5 w-5 text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-900">Application Mode</h3>
      </div>
      
      {/* Mode Selection */}
      <div className="mb-6">
        <div className="flex space-x-2 mb-4">
          <button
            onClick={() => onAppModeChange('live')}
            className={`flex items-center space-x-2 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 flex-1 ${
              appMode === 'live'
                ? 'bg-green-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Radio className="h-4 w-4" />
            <span>Live Mode</span>
          </button>
          <button
            onClick={() => onAppModeChange('test')}
            className={`flex items-center space-x-2 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 flex-1 ${
              appMode === 'test'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <TestTube className="h-4 w-4" />
            <span>Test Mode</span>
          </button>
        </div>
        
        {/* Mode Description */}
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            {appMode === 'live' 
              ? '📡 Live Mode: Real-time sensor data visualization'
              : '🧪 Test Mode: 20-second data collection with averaged results'
            }
          </p>
        </div>
      </div>

      {/* Test Mode Controls */}
      {appMode === 'test' && (
        <div className="space-y-4">
          {!isRecording ? (
            <button
              onClick={handleStartRecording}
              disabled={!isConnected}
              className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 shadow-sm"
            >
              <Play className="h-5 w-5" />
              <span className="font-medium">Start 20s Test Recording</span>
            </button>
          ) : (
            <div className="space-y-3">
              {/* Countdown Timer */}
              <div className="flex items-center justify-center space-x-3 text-red-600 bg-red-50 p-4 rounded-lg border border-red-200">
                <Timer className="h-6 w-6 animate-pulse" />
                <div className="text-center">
                  <div className="text-2xl font-bold">{countdown}s</div>
                  <div className="text-sm font-medium">Recording in Progress...</div>
                </div>
              </div>
              
              {/* Progress Bar */}
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-red-500 h-2 rounded-full transition-all duration-1000 ease-linear"
                  style={{ width: `${((20 - countdown) / 20) * 100}%` }}
                ></div>
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
          
          {/* Reset Button */}
          {hasAveragedData && !isRecording && (
            <button
              onClick={onResetAveragedData}
              className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200"
            >
              <RotateCcw className="h-4 w-4" />
              <span>Reset Test Data</span>
            </button>
          )}
          
          {!isConnected && (
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                ⚠️ Connect to ESP32 first to enable test recording
              </p>
            </div>
          )}
        </div>
      )}
      
      {/* Instructions */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h4 className="text-sm font-medium text-blue-900 mb-2">
          {appMode === 'live' ? 'Live Mode:' : 'Test Mode:'}
        </h4>
        <ul className="text-xs text-blue-800 space-y-1">
          {appMode === 'live' ? (
            <>
              <li>• Real-time sensor data visualization</li>
              <li>• Instant updates as data arrives</li>
              <li>• Perfect for monitoring live activity</li>
            </>
          ) : (
            <>
              <li>• Records all sensor data for 20 seconds</li>
              <li>• Calculates average pressure for each sensor</li>
              <li>• Updates visualization with averaged values</li>
              <li>• Data is available for export after recording</li>
            </>
          )}
        </ul>
      </div>
    </div>
  );
};