import React from 'react';
import { Calculator } from 'lucide-react';
import { FootData, FootType } from '../types';

interface FHRatioDisplayProps {
  footData: FootData;
  footType: FootType;
}

export const FHRatioDisplay: React.FC<FHRatioDisplayProps> = ({
  footData,
  footType
}) => {
  const calculateFHRatio = (): { ratio: number | null; forefoot: number; heel: number } => {
    // Extract sensor values based on foot type
    const sensors = footData.sensors;
    
    let forefootSensors: string[];
    let heelSensors: string[];
    
    if (footType === 'left') {
      forefootSensors = ['L2', 'L3', 'L4'];
      heelSensors = ['L6', 'L7', 'L8'];
    } else {
      forefootSensors = ['R2', 'R3', 'R4'];
      heelSensors = ['R6', 'R7', 'R8'];
    }
    
    // Calculate forefoot sum (F)
    const forefootSum = forefootSensors.reduce((sum, sensorId) => {
      const sensor = sensors.find(s => s.id === sensorId);
      return sum + (sensor ? sensor.value : 0);
    }, 0);
    
    // Calculate heel sum (H)
    const heelSum = heelSensors.reduce((sum, sensorId) => {
      const sensor = sensors.find(s => s.id === sensorId);
      return sum + (sensor ? sensor.value : 0);
    }, 0);
    
    // Calculate ratio (F/H)
    const ratio = heelSum > 0 ? forefootSum / heelSum : null;
    
    return {
      ratio,
      forefoot: forefootSum,
      heel: heelSum
    };
  };

  const { ratio, forefoot, heel } = calculateFHRatio();

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
      <div className="flex items-center space-x-2 mb-4">
        <Calculator className="h-5 w-5 text-purple-600" />
        <h3 className="text-lg font-semibold text-gray-900">F/H Ratio</h3>
      </div>
      
      {/* Main Ratio Display */}
      <div className="text-center mb-4">
        <div className="text-3xl font-bold text-purple-600 mb-1">
          {ratio !== null ? ratio.toFixed(2) : 'N/A'}
        </div>
        <div className="text-sm text-gray-600">
          Forefoot / Heel Ratio
        </div>
      </div>
      
      {/* Detailed Breakdown */}
      <div className="space-y-3">
        <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
          <div>
            <div className="text-sm font-medium text-blue-900">Forefoot (F)</div>
            <div className="text-xs text-blue-700">
              {footType === 'left' ? 'L2 + L3 + L4' : 'R2 + R3 + R4'}
            </div>
          </div>
          <div className="text-lg font-bold text-blue-600">
            {forefoot.toFixed(1)} kPa
          </div>
        </div>
        
        <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
          <div>
            <div className="text-sm font-medium text-green-900">Heel (H)</div>
            <div className="text-xs text-green-700">
              {footType === 'left' ? 'L6 + L7 + L8' : 'R6 + R7 + R8'}
            </div>
          </div>
          <div className="text-lg font-bold text-green-600">
            {heel.toFixed(1)} kPa
          </div>
        </div>
      </div>
      
      {/* Status Indicator */}
      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
        <div className="text-xs text-gray-600 text-center">
          {ratio === null ? (
            <span className="text-orange-600">⚠️ No heel pressure detected</span>
          ) : ratio > 1 ? (
            <span className="text-blue-600">📈 Forefoot dominant</span>
          ) : ratio < 1 ? (
            <span className="text-green-600">📉 Heel dominant</span>
          ) : (
            <span className="text-purple-600">⚖️ Balanced distribution</span>
          )}
        </div>
      </div>
      
      {/* Last Update */}
      <div className="mt-3 text-xs text-gray-500 text-center">
        Updated: {footData.lastUpdate.toLocaleTimeString()}
      </div>
    </div>
  );
};