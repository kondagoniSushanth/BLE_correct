import React from 'react';
import { FootType } from '../types';

interface NavigationProps {
  activeTab: FootType;
  onTabChange: (tab: FootType) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ activeTab, onTabChange }) => {
  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center space-x-8">
          <button
            onClick={() => onTabChange('left')}
            className={`py-4 px-6 text-sm font-medium border-b-2 transition-colors duration-200 ${
              activeTab === 'left'
                ? 'border-red-500 text-red-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            🦶 Left Foot
          </button>
          <button
            onClick={() => onTabChange('right')}
            className={`py-4 px-6 text-sm font-medium border-b-2 transition-colors duration-200 ${
              activeTab === 'right'
                ? 'border-green-700 text-green-700'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            🦶 Right Foot
          </button>
        </div>
      </div>
    </nav>
  );
};