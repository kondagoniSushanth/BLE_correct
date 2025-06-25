export interface SensorData {
  id: string;
  value: number;
  timestamp: Date;
  x: number;
  y: number;
}

export interface FootData {
  sensors: SensorData[];
  lastUpdate: Date;
  maxSensorId?: string;
  maxSensorValue?: number;
  overallMaxPressure?: number;
  overallMaxSensor?: string;
}

export interface SessionData {
  timestamp: Date;
  leftFoot: number[];
  rightFoot: number[];
}

export type ViewMode = 'heatmap' | 'console' | 'graph';
export type FootType = 'left' | 'right';

export interface BLEDevice {
  device: BluetoothDevice | null;
  characteristic: BluetoothRemoteGATTCharacteristic | null;
  connected: boolean;
}