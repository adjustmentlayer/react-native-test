import * as React from 'react';
import { StyleSheet, TextInput, TextInputProps } from 'react-native';
import { nh, nw } from '../../lib/normalize.helper';
import { poppins } from '../../lib/font.helper';
import { useRef } from 'react';

export type InputProps = TextInputProps & {
  hasError?: boolean;
};

const INPUT_BACKGROUND_COLOR = 'rgba(0, 0, 0, 0.3)';
const INPUT_COLOR = '#FFF';
const INPUT_BORDER_COLOR = 'rgba(0, 102, 255, 0.2)';
const INPUT_FOCUSED_BORDER_COLOR = '#0066FF';
const INPUT_INVALID_BORDER_COLOR = '#FF5C00';
const PLACEHOLDER_TEXT_COLOR = '#FFFFFF';

const styles = StyleSheet.create({
  input: {
    backgroundColor: INPUT_BACKGROUND_COLOR,
    borderRadius: 6,
    borderWidth: 1,
    borderStyle: 'solid',
    color: INPUT_COLOR,
    borderColor: INPUT_BORDER_COLOR,
    height: nh(50),
    paddingTop: nh(17),
    paddingLeft: nw(16),
    paddingRight: nw(16),
    fontSize: nh(14),
    fontFamily: poppins(500)
  }
});

export const Input = ({
  style,
  placeholderTextColor = PLACEHOLDER_TEXT_COLOR,
  hasError = false,
  keyboardType = 'default',
  onChangeText = () => {},
  value = '',
  ...rest
}: InputProps) => {
  const ref = useRef<TextInput | null>(null);

  const handleFocus = () => {
    !hasError &&
      ref.current?.setNativeProps({
        borderColor: INPUT_FOCUSED_BORDER_COLOR
      });
  };

  const handleBlur = () => {
    !hasError &&
      ref.current?.setNativeProps({
        borderColor: INPUT_BORDER_COLOR
      });
  };
  return (
    <TextInput
      ref={(c) => (ref.current = c)}
      style={[
        styles.input,
        hasError && {
          borderColor: INPUT_INVALID_BORDER_COLOR
        },
        style
      ]}
      onBlur={handleBlur}
      onFocus={handleFocus}
      placeholderTextColor={placeholderTextColor}
      keyboardType={keyboardType}
      onChangeText={onChangeText}
      value={value}
      {...rest}
    />
  );
};
