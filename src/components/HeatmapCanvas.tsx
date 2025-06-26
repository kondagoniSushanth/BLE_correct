import React, { useRef, useEffect, useState } from 'react';
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

export const HeatmapCanvas: React.FC<HeatmapCanvasProps> = ({
  footData,
  footType,
  canvasId
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const [tooltip, setTooltip] = useState<TooltipData>({
    visible: false,
    x: 0,
    y: 0,
    sensorId: '',
    pressure: 0,
    timestamp: new Date()
  });
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Find max pressure sensor for animation
    const maxPressureSensor = footData.sensors.reduce((max, sensor) => 
      sensor.value > max.value ? sensor : max
    );

    let animationTime = 0;

    const animate = () => {
      // Clear canvas with white background
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Load and draw foot sole image
      const img = new Image();
      img.onload = () => {
        setImageLoaded(true);
        
        // Draw the foot sole image
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        
        // Draw pressure sensors
        footData.sensors.forEach((sensor) => {
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

        // Animate max pressure sensor with pulsating circle
        if (maxPressureSensor.value > 0) {
          const pulseRadius = 35 + Math.sin(animationTime * 0.1) * 8;
          const pulseOpacity = 0.3 + Math.sin(animationTime * 0.1) * 0.2;
          
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

        animationTime += 1;
        animationRef.current = requestAnimationFrame(animate);
      };
      
      img.onerror = () => {
        console.error(`Failed to load foot sole image: /${footType}_sole.png`);
        setImageLoaded(false);
        
        // Draw fallback foot outline
        ctx.strokeStyle = '#ccc';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.ellipse(canvas.width / 2, canvas.height / 2, 120, 200, 0, 0, 2 * Math.PI);
        ctx.stroke();
        
        // Draw sensors even without image
        footData.sensors.forEach((sensor) => {
          const color = getPressureColor(sensor.value);
          const opacity = getPressureOpacity(sensor.value);
          
          ctx.save();
          ctx.globalAlpha = opacity;
          ctx.fillStyle = color;
          ctx.beginPath();
          ctx.arc(sensor.x, sensor.y, 25, 0, 2 * Math.PI);
          ctx.fill();
          ctx.restore();

          ctx.fillStyle = '#000';
          ctx.font = '12px Inter, sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText(sensor.id, sensor.x, sensor.y + 4);
        });

        animationTime += 1;
        animationRef.current = requestAnimationFrame(animate);
      };
      
      img.src = `/${footType}_sole.png`;
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [footData, footType]);

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
};