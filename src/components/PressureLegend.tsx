import React from 'react';
import { getPressureColor } from '../utils/colorMapping';

export const PressureLegend: React.FC = () => {
  const pressureValues = [0, 100, 200, 300, 400, 500, 600, 700, 800];

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Pressure Scale</h3>
      <div className="flex flex-col space-y-2">
        <div className="flex items-center justify-between text-sm font-medium text-gray-700">
          <span>kPa</span>
          <span>&gt;800</span>
        </div>
        <div className="w-full h-64 bg-gradient-to-b from-red-600 via-yellow-400 to-blue-600 rounded-md relative">
          {pressureValues.reverse().map((value, index) => (
            <div
              key={value}
              className="absolute right-2 text-xs text-white font-medium"
              style={{ top: `${(index / (pressureValues.length - 1)) * 100}%` }}
            >
              {value}
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between text-sm font-medium text-gray-700">
          <span>0</span>
        </div>
      </div>
    </div>
  );
};