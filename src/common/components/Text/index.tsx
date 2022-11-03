import React from 'react';
import { Text as TextBase, TextProps } from 'react-native';
import { roboto } from '~common/lib/font.helper';
import { nh } from '~common/lib/normalize.helper';

const defaultStyle = {
  fontFamily: roboto(400),
  color: '#fff',
  fontSize: nh(16)
};

export const Text = ({ children, style, ...rest }: TextProps) => {
  return (
    <TextBase style={[defaultStyle, style]} {...rest}>
      {children}
    </TextBase>
  );
};
