import * as XLSX from 'xlsx';
import { SessionData } from '../types';

export const exportToExcel = (sessionData: SessionData[], filename: string = 'foot_pressure_data.xlsx') => {
  const workbook = XLSX.utils.book_new();
  
  // Prepare data for Excel
  const excelData = sessionData.map((session, index) => ({
    'Sample': index + 1,
    'Timestamp': session.timestamp.toISOString(),
    'L1 (kPa)': session.leftFoot[0] || 0,
    'L2 (kPa)': session.leftFoot[1] || 0,
    'L3 (kPa)': session.leftFoot[2] || 0,
    'L4 (kPa)': session.leftFoot[3] || 0,
    'L5 (kPa)': session.leftFoot[4] || 0,
    'L6 (kPa)': session.leftFoot[5] || 0,
    'L7 (kPa)': session.leftFoot[6] || 0,
    'L8 (kPa)': session.leftFoot[7] || 0,
    'R1 (kPa)': session.rightFoot[0] || 0,
    'R2 (kPa)': session.rightFoot[1] || 0,
    'R3 (kPa)': session.rightFoot[2] || 0,
    'R4 (kPa)': session.rightFoot[3] || 0,
    'R5 (kPa)': session.rightFoot[4] || 0,
    'R6 (kPa)': session.rightFoot[5] || 0,
    'R7 (kPa)': session.rightFoot[6] || 0,
    'R8 (kPa)': session.rightFoot[7] || 0,
  }));
  
  const worksheet = XLSX.utils.json_to_sheet(excelData);
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Pressure Data');
  
  XLSX.writeFile(workbook, filename);
};

export const exportHeatmapImage = (imageBlob: Blob, filename: string = 'foot_heatmap.png') => {
  try {
    const url = URL.createObjectURL(imageBlob);
    const link = document.createElement('a');
    link.download = filename;
    link.href = url;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Clean up the object URL
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Failed to export heatmap image:', error);
    throw error;
  }
};