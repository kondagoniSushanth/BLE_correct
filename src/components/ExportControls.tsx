import React from 'react';
import { Download, FileSpreadsheet, Image } from 'lucide-react';
import { SessionData } from '../types';
import { exportToExcel, exportHeatmapImage } from '../utils/exportUtils';

interface ExportControlsProps {
  sessionData: SessionData[];
  canvasId: string;
  footType: string;
}

export const ExportControls: React.FC<ExportControlsProps> = ({
  sessionData,
  canvasId,
  footType
}) => {
  const handleExportExcel = () => {
    if (sessionData.length === 0) {
      alert('No session data to export');
      return;
    }
    exportToExcel(sessionData, `${footType}_foot_pressure_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const handleExportImage = () => {
    exportHeatmapImage(canvasId, `${footType}_foot_heatmap_${new Date().toISOString().split('T')[0]}.png`);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Export Data</h3>
      <div className="space-y-3">
        <button
          onClick={handleExportExcel}
          disabled={sessionData.length === 0}
          className="w-full flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
        >
          <FileSpreadsheet className="h-4 w-4" />
          <span>Export Excel (.xlsx)</span>
        </button>
        <button
          onClick={handleExportImage}
          className="w-full flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors duration-200"
        >
          <Image className="h-4 w-4" />
          <span>Export Heatmap (.png)</span>
        </button>
      </div>
      <p className="mt-2 text-xs text-gray-500">
        {sessionData.length} data points recorded
      </p>
    </div>
  );
};