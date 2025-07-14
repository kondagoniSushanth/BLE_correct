import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { SessionData } from '../types';

interface GraphViewProps {
  sessionData: SessionData[];
  footType: string;
}

export const GraphView: React.FC<GraphViewProps> = ({ sessionData, footType }) => {
  const chartData = sessionData.slice(-50).map((session, index) => {
    const data: any = {
      time: session.timestamp.toLocaleTimeString(),
      index: index
    };

    const footData = footType === 'left' ? session.leftFoot : session.rightFoot;
    footData.forEach((value, i) => {
      data[`${footType === 'left' ? 'L' : 'R'}${i + 1}`] = value;
    });

    return data;
  });

  const colors = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899'];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Pressure Over Time</h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} key={chartData.length}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis label={{ value: 'Pressure (kPa)', angle: -90, position: 'insideLeft' }} />
            <Tooltip />
            <Legend />
            {Array.from({ length: 8 }, (_, i) => (
              <Line
                key={i}
                type="monotone"
                dataKey={`${footType === 'left' ? 'L' : 'R'}${i + 1}`}
                stroke={colors[i]}
                strokeWidth={2}
                dot={false}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};