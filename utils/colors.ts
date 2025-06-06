// In utils/colors.ts
export const ColorWithOpacity = (color: string, opacity: number): string => {
  let normalizedColor = color.trim();

  // Handle 3-digit hex
  if (normalizedColor.startsWith('#') && normalizedColor.length === 4) {
    const r = normalizedColor.charAt(1);
    const g = normalizedColor.charAt(2);
    const b = normalizedColor.charAt(3);
    normalizedColor = `#${r}${r}${g}${g}${b}${b}`;
  }

  // Handle 6-digit hex
  if (normalizedColor.startsWith('#') && normalizedColor.length === 7) {
    const r = parseInt(normalizedColor.slice(1, 3), 16);
    const g = parseInt(normalizedColor.slice(3, 5), 16);
    const b = parseInt(normalizedColor.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  }

  // Handle existing rgba color string
  if (normalizedColor.startsWith('rgba')) {
    // Replace the current alpha value with the new opacity
    return normalizedColor.replace(/[\d\.]+\)$/g, `${opacity})`);
  }

  // Handle existing rgb color string - convert to rgba
  if (normalizedColor.startsWith('rgb')) {
    // Extract numbers from rgb(r,g,b)
    const match = normalizedColor.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
    if (match) {
      return `rgba(${match[1]}, ${match[2]}, ${match[3]}, ${opacity})`;
    }
  }

  // If color format is not recognized or cannot be processed, return original color
  // Or, one might choose to throw an error or return a default color like 'transparent'
  console.warn(`ColorWithOpacity: Could not process color '${color}'. Returning original.`);
  return normalizedColor;
};
