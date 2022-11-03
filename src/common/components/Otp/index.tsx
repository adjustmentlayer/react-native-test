import {
  useBlurOnFulfill,
  useClearByFocusCell,
  CodeField,
  Cursor
} from 'react-native-confirmation-code-field';
import React from 'react';
import { StyleSheet } from 'react-native';
import { Text } from '~common/components/Text';
import { nh, nw } from '../../lib/normalize.helper';

const THEME = {
  UNTOUCHED: {
    BG: '#0F131E',
    BORDER: '#0F131E'
  },
  FOCUSED: {
    BG: '#0F131E',
    BORDER: '#0066FF'
  },
  FILLED: {
    BG: '#0066FF',
    BORDER: '#0066FF'
  },
  INVALID: {
    BG: '#FF5C00',
    BORDER: '#FF5C00'
  }
};

const styles = StyleSheet.create({
  codeFieldRoot: {
    width: nw(58 * 4 + 10 * 3)
  },
  cell: {
    color: 'white',
    textAlign: 'center',
    textAlignVertical: 'center',
    fontSize: nh(16),
    borderWidth: 1,
    borderBottomWidth: 1,
    borderRadius: 6,
    width: nw(58),
    height: nw(58),
    borderColor: THEME.UNTOUCHED.BORDER,
    backgroundColor: THEME.UNTOUCHED.BG
  },
  focusCell: {
    borderColor: THEME.FOCUSED.BORDER,
    backgroundColor: THEME.FOCUSED.BG
  },
  filledCell: {
    borderColor: THEME.FILLED.BORDER,
    backgroundColor: THEME.FILLED.BG
  }
});

type Props = {
  hasError?: boolean;
  cellCount?: number;
  value: string;
  setValue: (value: string) => void;
  onValueChange?: (value: string) => void;
  onFocus?: () => void;
};

export const Otp = ({
  onValueChange = () => {},
  hasError = false,
  cellCount = 4,
  onFocus = () => {},
  value,
  setValue
}: Props) => {
  const ref = useBlurOnFulfill({ value, cellCount: cellCount });
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue
  });

  const handleChangeText = (value: string) => {
    onValueChange(value);
    setValue(value);
  };

  return (
    <CodeField
      ref={ref}
      {...props}
      value={value}
      onChangeText={handleChangeText}
      cellCount={cellCount}
      rootStyle={styles.codeFieldRoot}
      keyboardType="number-pad"
      textContentType="oneTimeCode"
      renderCell={({ index, symbol, isFocused }) => {
        const isFilled = value.length > index;
        return (
          <Text
            key={index}
            style={[
              styles.cell,
              isFilled && styles.filledCell,
              isFocused && styles.focusCell,
              hasError && {
                borderColor: THEME.INVALID.BORDER,
                backgroundColor: THEME.INVALID.BG
              }
            ]}
            onLayout={getCellOnLayoutHandler(index)}
          >
            {symbol || (isFocused ? <Cursor /> : null)}
          </Text>
        );
      }}
      onFocus={onFocus}
    />
  );
};
