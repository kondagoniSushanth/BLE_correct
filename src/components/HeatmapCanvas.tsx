import React, { useRef, useEffect, useState, useCallback, forwardRef, useImperativeHandle } from 'react';
import { FootData, FootType } from '../types';
import { getPressureColor, getPressureOpacity } from '../utils/colorMapping';

interface HeatmapCanvasProps {
  footData: FootData;
  footType: FootType;
  canvasId: string;
}

interface TooltipData {
  visible: boolean;
  x: number;
  y: number;
  sensorId: string;
  pressure: number;
  timestamp: Date;
}

export interface HeatmapCanvasRef {
  getCanvasImageBlob: () => Promise<Blob>;
}

export const HeatmapCanvas = forwardRef<HeatmapCanvasRef, HeatmapCanvasProps>(({
  footData,
  footType,
  canvasId
}, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const [footSoleImage, setFootSoleImage] = useState<HTMLImageElement | null>(null);
  const [imageLoadError, setImageLoadError] = useState<boolean>(false);
  const [tooltip, setTooltip] = useState<TooltipData>({
    visible: false,
    x: 0,
    y: 0,
    sensorId: '',
    pressure: 0,
    timestamp: new Date()
  });

  // Expose canvas image export function
  useImperativeHandle(ref, () => ({
    getCanvasImageBlob: (): Promise<Blob> => {
      return new Promise((resolve, reject) => {
        const canvas = canvasRef.current;
        if (!canvas) {
          reject(new Error('Canvas not available'));
          return;
        }

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas context not available'));
          return;
        }

        try {
          // Temporarily stop animation
          if (animationRef.current) {
            cancelAnimationFrame(animationRef.current);
          }

          // Ensure canvas is fully updated with current data
          drawCanvas(ctx, canvas, footData, footSoleImage, imageLoadError, Date.now());

          // Convert canvas to blob
          canvas.toBlob((blob) => {
            if (blob) {
              // Restart animation
              const animateLoop = (time: DOMHighResTimeStamp) => {
                drawCanvas(ctx, canvas, footData, footSoleImage, imageLoadError, time);
                animationRef.current = requestAnimationFrame(animateLoop);
              };
              animationRef.current = requestAnimationFrame(animateLoop);
              
              resolve(blob);
            } else {
              reject(new Error('Failed to create image blob'));
            }
          }, 'image/png', 1.0);
        } catch (error) {
          reject(error);
        }
      });
    }
  }), [footData, footSoleImage, imageLoadError]);

  // Separate effect for image loading - only runs when footType changes
  useEffect(() => {
    console.log(`Loading foot sole image for ${footType} foot`);
    
    const img = new Image();
    
    const handleLoad = () => {
      console.log(`✅ Foot sole image loaded successfully for ${footType} foot`);
      setFootSoleImage(img);
      setImageLoadError(false);
    };
    
    const handleError = () => {
      console.error(`❌ Failed to load foot sole image: /${footType}_sole.png`);
      setFootSoleImage(null);
      setImageLoadError(true);
    };
    
    img.onload = handleLoad;
    img.onerror = handleError;
    img.src = `/${footType}_sole.png`;
    
    // Cleanup function
    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [footType]);

  // Drawing function - separated from animation loop
  const drawCanvas = useCallback((
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    currentFootData: FootData,
    image: HTMLImageElement | null,
    hasImageError: boolean,
    time: number
  ) => {
    // Clear canvas with white background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw foot sole image or fallback
    if (image && !hasImageError) {
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    } else {
      // Draw fallback foot outline
      ctx.strokeStyle = '#ddd';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.ellipse(canvas.width / 2, canvas.height / 2, 120, 200, 0, 0, 2 * Math.PI);
      ctx.stroke();
      
      // Add fallback text
      ctx.fillStyle = '#999';
      ctx.font = '14px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Foot Outline', canvas.width / 2, canvas.height / 2);
    }

    // Find max pressure sensor for animation
    const maxPressureSensor = currentFootData.sensors.reduce((max, sensor) => 
      sensor.value > max.value ? sensor : max
    );

    // Draw pressure sensors
    currentFootData.sensors.forEach((sensor) => {
      const color = getPressureColor(sensor.value);
      const opacity = getPressureOpacity(sensor.value);
      
      // Draw pressure circle with gradient effect
      const gradient = ctx.createRadialGradient(sensor.x, sensor.y, 0, sensor.x, sensor.y, 25);
      gradient.addColorStop(0, color);
      gradient.addColorStop(1, 'rgba(255,255,255,0)');
      
      ctx.save();
      ctx.globalAlpha = opacity;
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(sensor.x, sensor.y, 25, 0, 2 * Math.PI);
      ctx.fill();
      ctx.restore();

      // Add sensor border
      ctx.strokeStyle = '#333';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(sensor.x, sensor.y, 25, 0, 2 * Math.PI);
      ctx.stroke();

      // Add sensor label with background
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.fillRect(sensor.x - 12, sensor.y - 8, 24, 16);
      
      ctx.fillStyle = '#000';
      ctx.font = 'bold 11px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(sensor.id, sensor.x, sensor.y);

      // Add pressure value below sensor
      if (sensor.value > 0) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        ctx.font = '10px Inter, sans-serif';
        ctx.fillText(`${sensor.value.toFixed(1)}`, sensor.x, sensor.y + 35);
      }
    });

    // Animate max pressure sensor with pulsating circle (time-based animation)
    if (maxPressureSensor.value > 0) {
      const pulseRadius = 35 + Math.sin(time * 0.005) * 8;
      const pulseOpacity = 0.3 + Math.sin(time * 0.005) * 0.2;
      
      ctx.save();
      ctx.globalAlpha = pulseOpacity;
      ctx.strokeStyle = '#ff0000';
      ctx.lineWidth = 3;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.arc(maxPressureSensor.x, maxPressureSensor.y, pulseRadius, 0, 2 * Math.PI);
      ctx.stroke();
      ctx.restore();

      // Add "MAX" label
      ctx.fillStyle = 'rgba(255, 0, 0, 0.9)';
      ctx.fillRect(maxPressureSensor.x - 15, maxPressureSensor.y - 50, 30, 16);
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 10px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('MAX', maxPressureSensor.x, maxPressureSensor.y - 42);
    }
  }, []);

  // Animation loop effect - runs when footData, image, or error state changes
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    console.log(`🎨 Starting animation loop for ${footType} foot`);

    const animateLoop = (time: DOMHighResTimeStamp) => {
      drawCanvas(ctx, canvas, footData, footSoleImage, imageLoadError, time);
      animationRef.current = requestAnimationFrame(animateLoop);
    };

    // Start animation loop
    animationRef.current = requestAnimationFrame(animateLoop);

    // Cleanup function
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        console.log(`🛑 Animation loop stopped for ${footType} foot`);
      }
    };
  }, [footData, footSoleImage, imageLoadError, footType, drawCanvas]);

  const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Check if mouse is over any sensor
    const hoveredSensor = footData.sensors.find(sensor => {
      const distance = Math.sqrt((x - sensor.x) ** 2 + (y - sensor.y) ** 2);
      return distance <= 25;
    });

    if (hoveredSensor) {
      setTooltip({
        visible: true,
        x: event.clientX,
        y: event.clientY,
        sensorId: hoveredSensor.id,
        pressure: hoveredSensor.value,
        timestamp: hoveredSensor.timestamp
      });
    } else {
      setTooltip(prev => ({ ...prev, visible: false }));
    }
  };

  const handleMouseLeave = () => {
    setTooltip(prev => ({ ...prev, visible: false }));
  };

  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        id={canvasId}
        width={350}
        height={500}
        className="border border-gray-200 rounded-lg cursor-pointer shadow-sm"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      />
      
      {/* Status indicator */}
      <div className="absolute top-2 right-2 bg-white bg-opacity-90 rounded-md px-2 py-1 text-xs">
        <div className="flex items-center space-x-1">
          <div className={`w-2 h-2 rounded-full ${
            footData.sensors.some(s => s.value > 0) ? 'bg-green-500' : 'bg-gray-400'
          }`}></div>
          <span className="text-gray-700">
            {footData.sensors.filter(s => s.value > 0).length}/8 active
          </span>
        </div>
        {imageLoadError && (
          <div className="text-xs text-orange-600 mt-1">
            Image fallback
          </div>
        )}
      </div>
      
      {tooltip.visible && (
        <div
          className="fixed z-50 bg-gray-900 text-white px-3 py-2 rounded-md text-sm pointer-events-none shadow-lg"
          style={{
            left: tooltip.x + 10,
            top: tooltip.y - 10,
            transform: 'translateY(-100%)'
          }}
        >
          <div className="font-medium">Sensor: {tooltip.sensorId}</div>
          <div>Pressure: {tooltip.pressure.toFixed(1)} kPa</div>
          <div className="text-xs text-gray-300">
            Time: {tooltip.timestamp.toLocaleTimeString()}
          </div>
        </div>
      )}
    </div>
  );
});

HeatmapCanvas.displayName = 'HeatmapCanvas';