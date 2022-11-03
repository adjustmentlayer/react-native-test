import React from 'react';
import { Input, InputProps } from '~common/components/Input';

const BACKGROUND_COLOR = '#0F131E';
const PLACEHOLDER_TEXT_COLOR = '#FFFFFF';

export const AuthInput = ({ style, ...rest }: InputProps) => {
  return (
    <Input
      style={[
        {
          backgroundColor: BACKGROUND_COLOR
        },
        style
      ]}
      placeholderTextColor={PLACEHOLDER_TEXT_COLOR}
      {...rest}
    />
  );
};
