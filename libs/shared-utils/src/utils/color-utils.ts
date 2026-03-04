type Color = keyof typeof colors;

const colors = {
  black: '#000000',
  blue: '#1d4289',
  green: '#007a78',
  orange: '#dc582a',
  pink: '#e56db1',
  red: '#d3273e',
  white: '#ffffff',
  yellow: '#ffc845',
};

const accessibleColor = (color: Color) => colors[color];

const decimalToHexColor = (decimal: number) => '#' + decimal.toString(16).padStart(6, '0');

const hexToDecimalColor = (hex: string) => parseInt(hex.replace('#', ''), 16);

export { accessibleColor, decimalToHexColor, hexToDecimalColor, type Color };
