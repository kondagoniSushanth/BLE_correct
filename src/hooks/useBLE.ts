import { useState, useCallback, useRef } from 'react';
import { BLEDevice } from '../types';

const SERVICE_UUID = '12345678-1234-1234-1234-1234567890ab';
const CHARACTERISTIC_UUID = 'abcd1234-5678-90ab-cdef-1234567890ab';

export const useBLE = () => {
  const [bleDevice, setBleDevice] = useState<BLEDevice>({
    device: null,
    characteristic: null,
    connected: false
  });
  const [isConnecting, setIsConnecting] = useState(false);
  const onDataReceived = useRef<((data: string) => void) | null>(null);

  // Scan for BLE devices
  const scanForDevices = useCallback(async () => {
    if (!navigator.bluetooth) {
      throw new Error('Bluetooth not supported in this browser');
    }

    console.log('Starting BLE device scan...');
    
    try {
      const device = await navigator.bluetooth.requestDevice({
        filters: [
          { services: [SERVICE_UUID] },
          { namePrefix: 'ESP32' },
          { namePrefix: 'FootPressure' }
        ],
        optionalServices: [SERVICE_UUID],
        acceptAllDevices: false
      });
      
      console.log('Device found:', device.name || 'Unknown Device', device.id);
      return device;
    } catch (error) {
      console.error('Device scan failed:', error);
      throw new Error('No compatible BLE device found. Make sure your ESP32 is powered on and advertising.');
    }
  }, []);

  // Connect to selected BLE device
  const connectToDevice = useCallback(async (device: BluetoothDevice) => {
    console.log('Connecting to GATT server...');
    
    if (!device.gatt) {
      throw new Error('Device does not support GATT');
    }

    const server = await device.gatt.connect();
    console.log('GATT server connected');

    console.log('Getting primary service...');
    const service = await server.getPrimaryService(SERVICE_UUID);
    console.log('Service obtained');

    console.log('Getting characteristic...');
    const characteristic = await service.getCharacteristic(CHARACTERISTIC_UUID);
    console.log('Characteristic obtained');
    
    return { server, service, characteristic };
  }, []);

  // Enable notifications
  const enableNotifications = useCallback(async (
    characteristic: BluetoothRemoteGATTCharacteristic, 
    notificationHandler: (event: Event) => void
  ) => {
    console.log('Checking notification support...');
    
    if (characteristic.properties.notify) {
      console.log('Starting notifications...');
      await characteristic.startNotifications();
      characteristic.addEventListener('characteristicvaluechanged', notificationHandler);
      console.log('Notifications enabled successfully');
    } else if (characteristic.properties.indicate) {
      console.log('Using indications instead of notifications...');
      await characteristic.startNotifications();
      characteristic.addEventListener('characteristicvaluechanged', notificationHandler);
      console.log('Indications enabled successfully');
    } else {
      console.warn('Device does not support notifications or indications');
    }
  }, []);

  // Handle incoming notifications from the BLE device
  const handleNotifications = useCallback((event: Event) => {
    const target = event.target as BluetoothRemoteGATTCharacteristic;
    if (!target.value) return;

    const decoder = new TextDecoder('utf-8');
    const message = decoder.decode(target.value);
    console.log('Received BLE data:', message);
    
    // Pass data to the registered handler
    onDataReceived.current?.(message);
  }, []);

  // Setup disconnection handler
  const setupDisconnectionHandler = useCallback((device: BluetoothDevice) => {
    const onDisconnected = (event: Event) => {
      console.log('BLE Device disconnected:', event);
      setBleDevice(prev => ({ 
        ...prev, 
        connected: false,
        device: null,
        characteristic: null 
      }));
    };

    device.addEventListener('gattserverdisconnected', onDisconnected);
  }, []);

  // Main connect function
  const connect = useCallback(async () => {
    if (!navigator.bluetooth) {
      throw new Error('Web Bluetooth is not supported in this browser. Please use Chrome, Edge, or Opera with HTTPS.');
    }

    setIsConnecting(true);
    
    try {
      // Step 1: Scan for devices
      console.log('Step 1: Scanning for BLE devices...');
      const device = await scanForDevices();
      
      // Step 2: Connect to device
      console.log('Step 2: Connecting to device:', device.name || 'Unknown Device');
      const { characteristic } = await connectToDevice(device);
      
      // Step 3: Setup disconnection handler
      console.log('Step 3: Setting up disconnection handler...');
      setupDisconnectionHandler(device);
      
      // Step 4: Enable notifications
      console.log('Step 4: Enabling notifications...');
      await enableNotifications(characteristic, handleNotifications);
      
      // Step 5: Update state
      setBleDevice({
        device,
        characteristic,
        connected: true
      });
      
      console.log('✅ BLE connection successful!');
      
    } catch (error) {
      console.error('❌ BLE connection failed:', error);
      setBleDevice({
        device: null,
        characteristic: null,
        connected: false
      });
      
      // Provide more specific error messages
      if (error instanceof Error) {
        if (error.message.includes('User cancelled')) {
          throw new Error('Connection cancelled by user');
        } else if (error.message.includes('not found')) {
          throw new Error('ESP32 device not found. Make sure it\'s powered on and advertising.');
        } else if (error.message.includes('GATT')) {
          throw new Error('Failed to connect to device. Try turning Bluetooth off and on.');
        }
      }
      
      throw error;
    } finally {
      setIsConnecting(false);
    }
  }, [scanForDevices, connectToDevice, setupDisconnectionHandler, enableNotifications, handleNotifications]);

  // Disconnect from BLE device
  const disconnect = useCallback(async () => {
    try {
      if (bleDevice.device?.gatt?.connected) {
        console.log('Disconnecting from BLE device...');
        await bleDevice.device.gatt.disconnect();
      }
    } catch (error) {
      console.error('Error during disconnection:', error);
    } finally {
      setBleDevice({
        device: null,
        characteristic: null,
        connected: false
      });
      console.log('BLE device disconnected');
    }
  }, [bleDevice]);

  // Send data to BLE device
  const sendData = useCallback(async (dataObj: any) => {
    if (!bleDevice.characteristic) {
      throw new Error('No BLE characteristic available');
    }

    if (!bleDevice.device?.gatt?.connected) {
      throw new Error('Device is not connected');
    }

    try {
      const jsonString = JSON.stringify(dataObj);
      const encoder = new TextEncoder();
      const value = encoder.encode(jsonString);
      
      // Check if characteristic supports write
      if (bleDevice.characteristic.properties.write || bleDevice.characteristic.properties.writeWithoutResponse) {
        await bleDevice.characteristic.writeValue(value);
        console.log('Data sent to BLE device:', jsonString);
      } else {
        throw new Error('Characteristic does not support writing');
      }
    } catch (error) {
      console.error('Failed to send data to BLE device:', error);
      throw error;
    }
  }, [bleDevice.characteristic, bleDevice.device]);

  // Set data handler for incoming data
  const setDataHandler = useCallback((handler: (data: string) => void) => {
    onDataReceived.current = handler;
  }, []);

  return {
    bleDevice,
    isConnecting,
    connect,
    disconnect,
    sendData,
    setDataHandler
  };
};