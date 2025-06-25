import React from 'react';
import { Bluetooth, BluetoothConnected, Loader2, AlertCircle, Wifi, CheckCircle } from 'lucide-react';
import { BLEDevice } from '../types';

interface BLEControlsProps {
  bleDevice: BLEDevice;
  isConnecting: boolean;
  onConnect: () => Promise<void>;
  onDisconnect: () => Promise<void>;
  isRecording: boolean;
}

export const BLEControls: React.FC<BLEControlsProps> = ({
  bleDevice,
  isConnecting,
  onConnect,
  onDisconnect,
  isRecording
}) => {
  const [error, setError] = React.useState<string | null>(null);

  // Check if Web Bluetooth is supported
  const isBluetoothSupported = typeof navigator !== 'undefined' && 'bluetooth' in navigator;

  const handleConnect = async () => {
    try {
      setError(null);
      await onConnect();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Connection failed';
      setError(errorMessage);
      console.error('BLE Connection Error:', err);
    }
  };

  const handleDisconnect = async () => {
    try {
      setError(null);
      await onDisconnect();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Disconnection failed';
      setError(errorMessage);
      console.error('BLE Disconnection Error:', err);
    }
  };

  if (!isBluetoothSupported) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">BLE Connection</h3>
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md flex items-center space-x-2">
          <AlertCircle className="h-5 w-5 text-yellow-600" />
          <div>
            <p className="text-sm text-yellow-800 font-medium">Web Bluetooth Not Supported</p>
            <p className="text-xs text-yellow-700 mt-1">
              Please use Chrome, Edge, or Opera browser with HTTPS to enable Bluetooth functionality.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
      <div className="flex items-center space-x-2 mb-4">
        <Wifi className="h-5 w-5 text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-900">ESP32 BLE Connection</h3>
      </div>
      
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-start space-x-2">
          <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
          <div>
            <span className="text-sm text-red-700 font-medium">Connection Error</span>
            <p className="text-xs text-red-600 mt-1">{error}</p>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {!bleDevice.connected ? (
            <button
              onClick={handleConnect}
              disabled={isConnecting || isRecording}
              className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md"
            >
              {isConnecting ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Bluetooth className="h-5 w-5" />
              )}
              <span className="font-medium">
                {isConnecting ? 'Scanning & Connecting...' : 'Connect ESP32'}
              </span>
            </button>
          ) : (
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3 px-4 py-2 bg-green-50 border border-green-200 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <div>
                  <span className="text-sm font-medium text-green-800">Connected</span>
                  {bleDevice.device?.name && (
                    <p className="text-xs text-green-600">{bleDevice.device.name}</p>
                  )}
                </div>
              </div>
              <button
                onClick={handleDisconnect}
                disabled={isRecording}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                Disconnect
              </button>
            </div>
          )}
        </div>

        {bleDevice.connected && (
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs text-gray-500 font-medium">Live Data</span>
          </div>
        )}
      </div>

      {/* Connection Instructions */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h4 className="text-sm font-medium text-blue-900 mb-2">Connection Instructions:</h4>
        <ol className="text-xs text-blue-800 space-y-1 list-decimal list-inside">
          <li>Make sure your ESP32 is powered on and running the foot pressure firmware</li>
          <li>Ensure the ESP32 is advertising with the correct service UUID</li>
          <li>Click "Connect ESP32" and select your device from the browser dialog</li>
          <li>Look for devices named "ESP32", "FootPressure", or similar</li>
        </ol>
      </div>

      {/* Technical Details */}
      <div className="mt-4 p-3 bg-gray-50 rounded-md">
        <div className="text-xs text-gray-600 space-y-1">
          <p><span className="font-medium">Service UUID:</span> 12345678-1234-1234-1234-1234567890ab</p>
          <p><span className="font-medium">Characteristic UUID:</span> abcd1234-5678-90ab-cdef-1234567890ab</p>
          <p className="text-gray-500 mt-2">
            Expected data format: "PRESSURE_LEFT:val1,val2,val3,val4,val5,val6,val7,val8" or "PRESSURE_RIGHT:..."
          </p>
        </div>
      </div>
    </div>
  );
};