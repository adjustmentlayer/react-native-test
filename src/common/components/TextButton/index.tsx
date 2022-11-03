import React, { PropsWithChildren } from 'react';
import {
  GestureResponderEvent,
  StyleSheet,
  TextStyle,
  TouchableOpacity,
  ViewStyle
} from 'react-native';
import { Text } from '~common/components/Text';
import { nh } from '../../lib/normalize.helper';
import { roboto } from '../../lib/font.helper';

const BUTTON_DEFAULT_BG_COLOR = '#0066FF';
const BUTTON_DEFAULT_DISABLED_BG_COLOR = '#173051';

const defaultDisabledContainerStyle = {
  backgroundColor: BUTTON_DEFAULT_DISABLED_BG_COLOR
};

const defaultDisabledTextStyle = {
  opacity: 0.5
};

type Props = PropsWithChildren<{
  containerStyle?: ViewStyle;
  disabledContainerStyle?: ViewStyle;
  textStyle?: TextStyle;
  disabledTextStyle?: TextStyle;
  disabled?: boolean;
  onPress?: (e: GestureResponderEvent) => void;
}>;

export const TextButton = ({
  containerStyle = {},
  disabledContainerStyle = defaultDisabledContainerStyle,
  textStyle = {},
  disabledTextStyle = defaultDisabledTextStyle,
  disabled = false,
  children,
  onPress,
  ...rest
}: Props) => {
  return (
    <TouchableOpacity
      style={[
        styles.buttonWrapper,
        containerStyle,
        disabled && disabledContainerStyle
      ]}
      disabled={disabled}
      onPress={(e) => {
        onPress && onPress(e);
      }}
      {...rest}
    >
      <Text
        style={[styles.buttonText, textStyle, disabled && disabledTextStyle]}
      >
        {children}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonWrapper: {
    height: nh(50),
    width: '100%',
    backgroundColor: BUTTON_DEFAULT_BG_COLOR,
    borderRadius: 6,
    justifyContent: 'center'
  },
  buttonText: {
    textAlign: 'center',
    textAlignVertical: 'center',
    fontFamily: roboto(700),
    fontSize: nh(16)
  }
});
