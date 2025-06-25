import React, { useEffect, useRef } from 'react';
import { FootData } from '../types';

interface ConsoleViewProps {
  footData: FootData;
  footType: string;
}

export const ConsoleView: React.FC<ConsoleViewProps> = ({ footData, footType }) => {
  const consoleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (consoleRef.current) {
      consoleRef.current.scrollTop = consoleRef.current.scrollHeight;
    }
  }, [footData]);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-96">
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Raw Data Console</h3>
      </div>
      <div
        ref={consoleRef}
        className="p-4 h-80 overflow-y-auto bg-gray-900 text-green-400 font-mono text-sm"
      >
        <div className="space-y-1">
          <div className="text-gray-500">
            {footData.lastUpdate.toLocaleTimeString()} - PRESSURE_{footType.toUpperCase()}:
          </div>
          <div className="text-green-400">
            {footData.sensors.map(sensor => sensor.value.toFixed(1)).join(',')}
          </div>
          <div className="text-gray-500 text-xs">
            Sensors: {footData.sensors.map(sensor => `${sensor.id}=${sensor.value.toFixed(1)}kPa`).join(' | ')}
          </div>
          <div className="border-t border-gray-700 my-2"></div>
        </div>
      </div>
    </div>
  );
};