export const getPressureColor = (pressure: number): string => {
  // Normalize pressure to 0-1 range (0-225 kPa)
  const normalized = Math.min(Math.max(pressure / 225, 0), 1);
  
  // Enhanced color gradient with more vibrant and saturated colors
  const colors = [
    { r: 0, g: 0, b: 139 },       // Dark blue (0 kPa) - more intense
    { r: 0, g: 100, b: 255 },     // Bright blue
    { r: 0, g: 191, b: 255 },     // Deep sky blue - more saturated
    { r: 0, g: 255, b: 200 },     // Bright cyan
    { r: 50, g: 255, b: 50 },     // Bright lime green - more intense
    { r: 200, g: 255, b: 0 },     // Yellow green - more saturated
    { r: 255, g: 255, b: 0 },     // Pure yellow - maximum saturation
    { r: 255, g: 140, b: 0 },     // Dark orange - more intense
    { r: 255, g: 69, b: 0 },      // Red orange - more saturated
    { r: 220, g: 20, b: 60 },     // Crimson - more intense
    { r: 139, g: 0, b: 0 }        // Dark red (225+ kPa) - maximum intensity
  ];
  
  const index = normalized * (colors.length - 1);
  const lowerIndex = Math.floor(index);
  const upperIndex = Math.ceil(index);
  const fraction = index - lowerIndex;
  
  if (lowerIndex === upperIndex) {
    const color = colors[lowerIndex];
    return `rgb(${color.r}, ${color.g}, ${color.b})`;
  }
  
  const lower = colors[lowerIndex];
  const upper = colors[upperIndex];
  
  const r = Math.round(lower.r + (upper.r - lower.r) * fraction);
  const g = Math.round(lower.g + (upper.g - lower.g) * fraction);
  const b = Math.round(lower.b + (upper.b - lower.b) * fraction);
  
  return `rgb(${r}, ${g}, ${b})`;
};

export const getPressureOpacity = (pressure: number): number => {
  // Enhanced opacity calculation for better visual contrast
  const baseOpacity = 0.3; // Minimum opacity for visibility
  const maxOpacity = 0.95;  // Maximum opacity for high pressure
  const normalized = Math.min(Math.max(pressure / 225, 0), 1);
  
  // Use exponential curve for better visual distinction
  const exponentialNormalized = Math.pow(normalized, 0.7);
  
  return baseOpacity + (maxOpacity - baseOpacity) * exponentialNormalized;
};