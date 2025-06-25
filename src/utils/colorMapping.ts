export const getPressureColor = (pressure: number): string => {
  // Normalize pressure to 0-1 range (0-225 kPa)
  const normalized = Math.min(Math.max(pressure / 225, 0), 1);
  
  // Color gradient from blue (0) to red (225+)
  const colors = [
    { r: 30, g: 144, b: 255 },   // Blue (0 kPa)
    { r: 0, g: 191, b: 255 },    // Deep sky blue
    { r: 64, g: 224, b: 208 },   // Turquoise
    { r: 50, g: 205, b: 50 },    // Lime green
    { r: 154, g: 205, b: 50 },   // Yellow green
    { r: 255, g: 255, b: 0 },    // Yellow
    { r: 255, g: 165, b: 0 },    // Orange
    { r: 255, g: 69, b: 0 },     // Red orange
    { r: 255, g: 0, b: 0 }       // Red (225+ kPa)
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
  return Math.min(Math.max(pressure / 225 * 0.8 + 0.2, 0.2), 1);
};