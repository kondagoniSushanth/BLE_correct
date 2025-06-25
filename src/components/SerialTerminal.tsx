import React, { useEffect, useRef, useState } from 'react';
import { Terminal, Copy, Trash2, Download } from 'lucide-react';

interface LogEntry {
  timestamp: Date;
  data: string;
  type: 'left' | 'right' | 'system' | 'error';
}

interface SerialTerminalProps {
  isConnected: boolean;
}

export const SerialTerminal: React.FC<SerialTerminalProps> = ({ isConnected }) => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isAutoScroll, setIsAutoScroll] = useState(true);
  const terminalRef = useRef<HTMLDivElement>(null);
  const logCountRef = useRef(0);

  // Add system message when connection status changes
  useEffect(() => {
    const message = isConnected 
      ? '✅ ESP32 BLE connection established' 
      : '❌ ESP32 BLE disconnected';
    
    addLog(message, 'system');
  }, [isConnected]);

  // Function to add new log entry
  const addLog = (data: string, type: LogEntry['type'] = 'system') => {
    const newLog: LogEntry = {
      timestamp: new Date(),
      data,
      type
    };

    setLogs(prev => {
      const updated = [...prev, newLog];
      // Keep only last 500 entries to prevent memory issues
      if (updated.length > 500) {
        return updated.slice(-500);
      }
      return updated;
    });

    logCountRef.current++;
  };

  // Auto-scroll to bottom when new logs arrive
  useEffect(() => {
    if (isAutoScroll && terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [logs, isAutoScroll]);

  // Handle scroll to detect if user scrolled up
  const handleScroll = () => {
    if (terminalRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = terminalRef.current;
      const isAtBottom = scrollTop + clientHeight >= scrollHeight - 10;
      setIsAutoScroll(isAtBottom);
    }
  };

  // Clear logs
  const clearLogs = () => {
    setLogs([]);
    logCountRef.current = 0;
  };

  // Copy logs to clipboard
  const copyLogs = async () => {
    const logText = logs.map(log => 
      `[${log.timestamp.toLocaleTimeString()}] ${log.data}`
    ).join('\n');
    
    try {
      await navigator.clipboard.writeText(logText);
      addLog('📋 Logs copied to clipboard', 'system');
    } catch (err) {
      addLog('❌ Failed to copy logs', 'error');
    }
  };

  // Export logs as text file
  const exportLogs = () => {
    const logText = logs.map(log => 
      `[${log.timestamp.toISOString()}] ${log.data}`
    ).join('\n');
    
    const blob = new Blob([logText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `foot-pressure-logs-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    addLog('💾 Logs exported successfully', 'system');
  };

  // Format timestamp for display
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  // Get log entry styling based on type
  const getLogStyle = (type: LogEntry['type']) => {
    switch (type) {
      case 'left':
        return 'text-red-400';
      case 'right':
        return 'text-green-400';
      case 'system':
        return 'text-blue-400';
      case 'error':
        return 'text-red-500';
      default:
        return 'text-gray-300';
    }
  };

  // Expose addLog function globally for BLE data
  useEffect(() => {
    const handleBLEData = (event: CustomEvent) => {
      const { data } = event.detail;
      
      if (data.includes('PRESSURE_LEFT:')) {
        addLog(data, 'left');
      } else if (data.includes('PRESSURE_RIGHT:')) {
        addLog(data, 'right');
      } else {
        addLog(data, 'system');
      }
    };

    window.addEventListener('ble-data', handleBLEData as EventListener);
    
    return () => {
      window.removeEventListener('ble-data', handleBLEData as EventListener);
    };
  }, []);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-96 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50 rounded-t-lg">
        <div className="flex items-center space-x-2">
          <Terminal className="h-5 w-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">📟 Raw Sensor Data</h3>
          <div className="flex items-center space-x-2 ml-4">
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
            <span className="text-xs text-gray-500">
              {isConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <span className="text-xs text-gray-500">
            {logs.length} entries
          </span>
          <button
            onClick={copyLogs}
            disabled={logs.length === 0}
            className="p-1.5 text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            title="Copy logs"
          >
            <Copy className="h-4 w-4" />
          </button>
          <button
            onClick={exportLogs}
            disabled={logs.length === 0}
            className="p-1.5 text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            title="Export logs"
          >
            <Download className="h-4 w-4" />
          </button>
          <button
            onClick={clearLogs}
            disabled={logs.length === 0}
            className="p-1.5 text-gray-500 hover:text-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
            title="Clear logs"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Terminal Content */}
      <div
        ref={terminalRef}
        onScroll={handleScroll}
        className="flex-1 p-4 bg-gray-900 text-green-400 font-mono text-sm overflow-y-auto console-scroll"
      >
        {logs.length === 0 ? (
          <div className="text-gray-500 text-center py-8">
            <Terminal className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>Waiting for sensor data...</p>
            <p className="text-xs mt-1">Connect to ESP32 to see real-time data</p>
          </div>
        ) : (
          <div className="space-y-1">
            {logs.map((log, index) => (
              <div key={index} className="flex">
                <span className="text-gray-500 mr-2 flex-shrink-0">
                  [{formatTime(log.timestamp)}]
                </span>
                <span className={getLogStyle(log.type)}>
                  {log.data}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-4 py-2 bg-gray-50 border-t border-gray-200 rounded-b-lg">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center space-x-4">
            <span>Auto-scroll: {isAutoScroll ? 'ON' : 'OFF'}</span>
            <button
              onClick={() => setIsAutoScroll(!isAutoScroll)}
              className="text-blue-600 hover:text-blue-800"
            >
              Toggle
            </button>
          </div>
          <div>
            Expected format: PRESSURE_LEFT:88,122,199,145,101,92,130,88
          </div>
        </div>
      </div>
    </div>
  );
};