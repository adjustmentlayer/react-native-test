type CustomFont = 'Roboto' | 'Poppins';

export const font = (family: CustomFont, weight = 400, italic = false) => {
  const alphabeticWeight =
    {
      100: 'Thin',
      200: 'ExtraLight',
      300: 'Light',
      400: 'Regular',
      500: 'Medium',
      600: 'SemiBold',
      700: 'Bold',
      800: 'ExtraBold',
      900: 'Black'
    }[weight] || 'Regular';

  return `${family}-${alphabeticWeight}${italic ? 'Italic' : ''}`;
};

export const roboto = (weight = 400, italic = false) => {
  return font('Roboto', weight, italic);
};

export const poppins = (weight = 400, italic = false) => {
  return font('Poppins', weight, italic);
};
