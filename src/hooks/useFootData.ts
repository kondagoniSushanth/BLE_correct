import { useState, useCallback, useRef, useEffect } from 'react';
import { FootData, SensorData, SessionData, FootType } from '../types';

const SENSOR_POSITIONS = {
  left: [
    { x: 100, y: 139 },   // P1
    { x: 170, y: 140 },  // P2
    { x: 210, y: 190 },  // P3
    { x: 110, y: 230 },  // P4
    { x: 190, y: 245 },  // P5
    { x: 102, y: 302 },  // P6
    { x: 175, y: 305 },  // P7
    { x: 125, y: 370 }   // P8
  ],
  right: [
    { x: 100, y: 139 },   // P1
    { x: 170, y: 140 },  // P2
    { x: 210, y: 190 },  // P3
    { x: 110, y: 230 },  // P4
    { x: 190, y: 245 },  // P5
    { x: 102, y: 302 },  // P6
    { x: 175, y: 305 },  // P7
    { x: 125, y: 370 }   // P8
  ]
};

export const useFootData = () => {
  const [leftFootData, setLeftFootData] = useState<FootData>({
    sensors: SENSOR_POSITIONS.left.map((pos, i) => ({
      id: `L${i + 1}`,
      value: 0,
      timestamp: new Date(),
      x: pos.x,
      y: pos.y
    })),
    lastUpdate: new Date()
  });

  const [rightFootData, setRightFootData] = useState<FootData>({
    sensors: SENSOR_POSITIONS.right.map((pos, i) => ({
      id: `R${i + 1}`,
      value: 0,
      timestamp: new Date(),
      x: pos.x,
      y: pos.y
    })),
    lastUpdate: new Date()
  });

  const [sessionData, setSessionData] = useState<SessionData[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [countdown, setCountdown] = useState(0);
  
  const recordingTimer = useRef<NodeJS.Timeout | null>(null);
  const countdownTimer = useRef<NodeJS.Timeout | null>(null);
  const recordingData = useRef<SessionData[]>([]);
  
  // Track overall maximum pressure during recording session
  const overallMaxLeftPressureRef = useRef(0);
  const overallMaxRightPressureRef = useRef(0);
  const overallMaxLeftSensorRef = useRef('');
  const overallMaxRightSensorRef = useRef('');

  const updateFootData = useCallback((
    foot: FootType, 
    values: number[], 
    maxSensorId?: string, 
    maxSensorValue?: number,
    overallMaxPressure?: number,
    overallMaxSensor?: string
  ) => {
    console.log(`🔄 updateFootData called for ${foot} foot with values:`, values);
    
    if (values.length !== 8) {
      console.warn(`❌ Invalid sensor data length for ${foot} foot: expected 8, got ${values.length}. Values:`, values);
      return;
    }

    const timestamp = new Date();
    const positions = SENSOR_POSITIONS[foot];

    const sensors: SensorData[] = values.map((value, i) => ({
      id: `${foot === 'left' ? 'L' : 'R'}${i + 1}`,
      value: Math.max(0, value), // Ensure non-negative values
      timestamp,
      x: positions[i].x,
      y: positions[i].y
    }));

    const footData: FootData = {
      sensors,
      lastUpdate: timestamp,
      maxSensorId,
      maxSensorValue,
      overallMaxPressure,
      overallMaxSensor
    };

    console.log(`✅ Updating ${foot} foot state with processed data:`, footData);

    if (foot === 'left') {
      setLeftFootData(footData);
      console.log(`📊 Left foot data state updated`);
    } else {
      setRightFootData(footData);
      console.log(`📊 Right foot data state updated`);
    }

    // Track overall maximum during recording
    if (isRecording) {
      console.log(`🔴 Recording active - adding data to session and tracking max values`);
      
      // Find max pressure in current data
      const maxValue = Math.max(...values);
      const maxIndex = values.indexOf(maxValue);
      const maxSensorIdCurrent = `${foot === 'left' ? 'L' : 'R'}${maxIndex + 1}`;
      
      // Update overall max for this foot
      if (foot === 'left' && maxValue > overallMaxLeftPressureRef.current) {
        overallMaxLeftPressureRef.current = maxValue;
        overallMaxLeftSensorRef.current = maxSensorIdCurrent;
      } else if (foot === 'right' && maxValue > overallMaxRightPressureRef.current) {
        overallMaxRightPressureRef.current = maxValue;
        overallMaxRightSensorRef.current = maxSensorIdCurrent;
      }
      
      const currentSession: SessionData = {
        timestamp,
        leftFoot: foot === 'left' ? values : recordingData.current[recordingData.current.length - 1]?.leftFoot || Array(8).fill(0),
        rightFoot: foot === 'right' ? values : recordingData.current[recordingData.current.length - 1]?.rightFoot || Array(8).fill(0)
      };
      
      recordingData.current.push(currentSession);
      
      // Update session data for real-time display
      setSessionData(prev => [...prev, currentSession]);
      console.log(`📈 Session data updated, total sessions: ${recordingData.current.length}`);
    }

    console.log(`✅ ${foot} foot data processing completed successfully`);
  }, [isRecording]);

  const parseIncomingData = useCallback((data: string) => {
    console.log(`📡 parseIncomingData called with raw data:`, data);
    
    // Dispatch custom event for serial terminal (BLE logic unchanged)
    window.dispatchEvent(new CustomEvent('ble-data', { detail: { data } }));
    
    const lines = data.trim().split('\n');
    console.log(`📝 Split into ${lines.length} lines:`, lines);
    
    lines.forEach((line, lineIndex) => {
      const trimmedLine = line.trim();
      console.log(`🔍 Processing line ${lineIndex + 1}: "${trimmedLine}"`);
      
      if (trimmedLine.startsWith('PRESSURE_LEFT:')) {
        console.log(`👈 Found LEFT foot data in line ${lineIndex + 1}`);
        const valuesStr = trimmedLine.replace('PRESSURE_LEFT:', '').trim();
        console.log(`🔢 Extracted values string: "${valuesStr}"`);
        
        const values = valuesStr.split(',').map(v => {
          const parsed = parseFloat(v.trim());
          return isNaN(parsed) ? 0 : parsed;
        });
        
        console.log(`🧮 Parsed values for LEFT foot:`, values);
        
        if (values.length === 8) {
          console.log(`✅ Valid LEFT foot data - calling updateFootData`);
          updateFootData('left', values);
        } else {
          console.warn(`❌ Invalid LEFT foot data format. Expected 8 values, got ${values.length}. Raw string: "${valuesStr}", Parsed values:`, values);
        }
      } else if (trimmedLine.startsWith('PRESSURE_RIGHT:')) {
        console.log(`👉 Found RIGHT foot data in line ${lineIndex + 1}`);
        const valuesStr = trimmedLine.replace('PRESSURE_RIGHT:', '').trim();
        console.log(`🔢 Extracted values string: "${valuesStr}"`);
        
        const values = valuesStr.split(',').map(v => {
          const parsed = parseFloat(v.trim());
          return isNaN(parsed) ? 0 : parsed;
        });
        
        console.log(`🧮 Parsed values for RIGHT foot:`, values);
        
        if (values.length === 8) {
          console.log(`✅ Valid RIGHT foot data - calling updateFootData`);
          updateFootData('right', values);
        } else {
          console.warn(`❌ Invalid RIGHT foot data format. Expected 8 values, got ${values.length}. Raw string: "${valuesStr}", Parsed values:`, values);
        }
      } else if (trimmedLine.length > 0) {
        console.log(`⚠️ Unrecognized data format in line ${lineIndex + 1}: "${trimmedLine}"`);
      }
    });
    
    console.log(`🏁 parseIncomingData processing completed`);
  }, [updateFootData]);

  const calculateAverages = useCallback((data: SessionData[]) => {
    if (data.length === 0) return { 
      leftFoot: Array(8).fill(0), 
      rightFoot: Array(8).fill(0),
      leftMaxSensorId: '',
      leftMaxValue: 0,
      rightMaxSensorId: '',
      rightMaxValue: 0
    };

    const leftSums = Array(8).fill(0);
    const rightSums = Array(8).fill(0);

    data.forEach(session => {
      session.leftFoot.forEach((value, index) => {
        leftSums[index] += value;
      });
      session.rightFoot.forEach((value, index) => {
        rightSums[index] += value;
      });
    });

    const leftAverages = leftSums.map(sum => sum / data.length);
    const rightAverages = rightSums.map(sum => sum / data.length);

    // Find max averaged values
    const leftMaxValue = Math.max(...leftAverages);
    const leftMaxIndex = leftAverages.indexOf(leftMaxValue);
    const leftMaxSensorId = `L${leftMaxIndex + 1}`;

    const rightMaxValue = Math.max(...rightAverages);
    const rightMaxIndex = rightAverages.indexOf(rightMaxValue);
    const rightMaxSensorId = `R${rightMaxIndex + 1}`;

    return { 
      leftFoot: leftAverages, 
      rightFoot: rightAverages,
      leftMaxSensorId,
      leftMaxValue,
      rightMaxSensorId,
      rightMaxValue
    };
  }, []);

  const startRecording = useCallback((duration: number = 20000) => {
    setIsRecording(true);
    setSessionData([]);
    setCountdown(Math.ceil(duration / 1000));
    recordingData.current = [];
    
    // Reset overall max tracking
    overallMaxLeftPressureRef.current = 0;
    overallMaxRightPressureRef.current = 0;
    overallMaxLeftSensorRef.current = '';
    overallMaxRightSensorRef.current = '';
    
    // Dispatch system message
    window.dispatchEvent(new CustomEvent('ble-data', { 
      detail: { data: `🔴 Recording started for ${duration/1000} seconds` } 
    }));
    
    console.log(`Starting recording for ${duration}ms`);
    
    // Start countdown timer
    countdownTimer.current = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          if (countdownTimer.current) {
            clearInterval(countdownTimer.current);
            countdownTimer.current = null;
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    recordingTimer.current = setTimeout(() => {
      setIsRecording(false);
      setCountdown(0);
      
      if (countdownTimer.current) {
        clearInterval(countdownTimer.current);
        countdownTimer.current = null;
      }
      
      // Calculate averages and update heatmap
      const averages = calculateAverages(recordingData.current);
      
      console.log('Recording completed. Averages calculated:', averages);
      
      // Update foot data with averages and max values
      updateFootData(
        'left', 
        averages.leftFoot, 
        averages.leftMaxSensorId, 
        averages.leftMaxValue,
        overallMaxLeftPressureRef.current,
        overallMaxLeftSensorRef.current
      );
      updateFootData(
        'right', 
        averages.rightFoot, 
        averages.rightMaxSensorId, 
        averages.rightMaxValue,
        overallMaxRightPressureRef.current,
        overallMaxRightSensorRef.current
      );
      
      window.dispatchEvent(new CustomEvent('ble-data', { 
        detail: { data: `⏹️ Recording completed automatically. Processed ${recordingData.current.length} data points.` } 
      }));
      
      console.log(`Recording completed with ${recordingData.current.length} data points`);
    }, duration);
  }, [calculateAverages, updateFootData]);

  const stopRecording = useCallback(() => {
    setIsRecording(false);
    setCountdown(0);
    
    if (recordingTimer.current) {
      clearTimeout(recordingTimer.current);
      recordingTimer.current = null;
    }
    
    if (countdownTimer.current) {
      clearInterval(countdownTimer.current);
      countdownTimer.current = null;
    }
    
    // Calculate averages and update heatmap
    const averages = calculateAverages(recordingData.current);
    
    console.log('Recording stopped manually. Averages calculated:', averages);
    
    // Update foot data with averages and max values
    updateFootData(
      'left', 
      averages.leftFoot, 
      averages.leftMaxSensorId, 
      averages.leftMaxValue,
      overallMaxLeftPressureRef.current,
      overallMaxLeftSensorRef.current
    );
    updateFootData(
      'right', 
      averages.rightFoot, 
      averages.rightMaxSensorId, 
      averages.rightMaxValue,
      overallMaxRightPressureRef.current,
      overallMaxRightSensorRef.current
    );
    
    // Dispatch system message
    window.dispatchEvent(new CustomEvent('ble-data', { 
      detail: { data: `⏹️ Recording stopped manually. Processed ${recordingData.current.length} data points.` } 
    }));
    
    console.log(`Recording stopped with ${recordingData.current.length} data points`);
  }, [calculateAverages, updateFootData]);

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (recordingTimer.current) {
        clearTimeout(recordingTimer.current);
      }
      if (countdownTimer.current) {
        clearInterval(countdownTimer.current);
      }
    };
  }, []);

  return {
    leftFootData,
    rightFootData,
    sessionData,
    isRecording,
    countdown,
    parseIncomingData,
    startRecording,
    stopRecording
  };
};