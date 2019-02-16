export const colors = [
  { name: 'red',    hex: '#dc3545', rgb: [220,  53,  69] },
  { name: 'pink',   hex: '#e83e8c', rgb: [232,  62, 140] },
  { name: 'orange', hex: '#fd7e14', rgb: [253, 126,  20] },
  { name: 'yellow', hex: '#ffc107', rgb: [255, 193,   7] },
  { name: 'green',  hex: '#28a745', rgb: [ 40, 167,  69] },
  { name: 'blue',   hex: '#007bff', rgb: [  0, 123, 255] },
  { name: 'indigo', hex: '#6610f2', rgb: [102,  16, 242] },
  { name: 'teal',   hex: '#20c997', rgb: [ 32, 201, 151] },
  { name: 'cyan',   hex: '#17a2b8', rgb: [ 23, 162, 184] },
  { name: 'white',  hex: '#ffffff', rgb: [255, 255, 255] },
  { name: 'gray',   hex: '#6c757d', rgb: [108, 117, 125] },
  { name: 'dark',   hex: '#343a40', rgb: [ 52,  58,  64] },
]

export function hexToRgb(hex) {
  // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
  var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(shorthandRegex, function(m, r, g, b) {
      return r + r + g + g + b + b;
  });

  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
  } : null;
}