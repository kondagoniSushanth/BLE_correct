import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { SessionData } from '../types';
import { Eye, EyeOff } from 'lucide-react';

interface GraphViewProps {
  dataHistory: SessionData[];
  footType: string;
}

export const GraphView: React.FC<GraphViewProps> = ({ dataHistory, footType }) => {
  const sensorIds = Array.from({ length: 8 }, (_, i) => `${footType === 'left' ? 'L' : 'R'}${i + 1}`);
  const [selectedSensors, setSelectedSensors] = useState<string[]>(sensorIds);

  const chartData = dataHistory.slice(-50).map((session, index) => {
    const data: any = {
      time: session.timestamp.toLocaleTimeString(),
      index: index
    };

    const footData = footType === 'left' ? session.leftFoot : session.rightFoot;
    footData.forEach((value, i) => {
      data[sensorIds[i]] = value;
    });

    return data;
  });

  const colors = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899'];

  const toggleSensor = (sensorId: string) => {
    setSelectedSensors(prev => 
      prev.includes(sensorId) 
        ? prev.filter(id => id !== sensorId)
        : [...prev, sensorId]
    );
  };

  const selectAllSensors = () => {
    setSelectedSensors(sensorIds);
  };

  const deselectAllSensors = () => {
    setSelectedSensors([]);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Pressure Over Time</h3>
        <div className="flex items-center space-x-2">
          <button
            onClick={selectAllSensors}
            className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
          >
            Select All
          </button>
          <button
            onClick={deselectAllSensors}
            className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
          >
            Deselect All
          </button>
        </div>
      </div>

      {/* Sensor Selection Controls */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Select Sensors to Display:</h4>
        <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
          {sensorIds.map((sensorId, index) => (
            <button
              key={sensorId}
              onClick={() => toggleSensor(sensorId)}
              className={`flex items-center justify-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                selectedSensors.includes(sensorId)
                  ? 'text-white shadow-md'
                  : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'
              }`}
              style={{
                backgroundColor: selectedSensors.includes(sensorId) ? colors[index] : undefined
              }}
            >
              {selectedSensors.includes(sensorId) ? (
                <Eye className="h-3 w-3" />
              ) : (
                <EyeOff className="h-3 w-3" />
              )}
              <span>{sensorId}</span>
            </button>
          ))}
        </div>
        <p className="text-xs text-gray-500 mt-2">
          {selectedSensors.length} of {sensorIds.length} sensors selected
        </p>
      </div>

      {/* Chart */}
      <div className="h-80">
        {selectedSensors.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500">
            <div className="text-center">
              <EyeOff className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No sensors selected</p>
              <p className="text-sm">Select at least one sensor to view the graph</p>
            </div>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis label={{ value: 'Pressure (kPa)', angle: -90, position: 'insideLeft' }} />
              <Tooltip />
              <Legend />
              {selectedSensors.map((sensorId, index) => {
                const colorIndex = sensorIds.indexOf(sensorId);
                return (
                  <Line
                    key={sensorId}
                    type="monotone"
                    dataKey={sensorId}
                    stroke={colors[colorIndex]}
                    strokeWidth={2}
                    dot={false}
                    name={`Sensor ${sensorId}`}
                  />
                );
              })}
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Data Info */}
      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-center justify-between text-sm text-blue-800">
          <span>Showing last {Math.min(dataHistory.length, 50)} data points</span>
          <span>Total data points: {dataHistory.length}</span>
        </div>
      </div>
    </div>
  );
};