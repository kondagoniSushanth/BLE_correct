import React from 'react';
import { ViewMode } from '../types';
import { Activity, Terminal, BarChart3 } from 'lucide-react';

interface ViewControlsProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
}

export const ViewControls: React.FC<ViewControlsProps> = ({
  viewMode,
  onViewModeChange
}) => {
  const modes = [
    { id: 'heatmap' as ViewMode, label: 'Heatmap', icon: Activity },
    { id: 'console' as ViewMode, label: 'Console', icon: Terminal },
    { id: 'graph' as ViewMode, label: 'Graph', icon: BarChart3 }
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">View Mode</h3>
      <div className="flex space-x-2">
        {modes.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => onViewModeChange(id)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
              viewMode === id
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Icon className="h-4 w-4" />
            <span>{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};