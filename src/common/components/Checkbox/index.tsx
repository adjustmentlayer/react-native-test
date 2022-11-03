import React, {
  forwardRef,
  PropsWithChildren,
  useImperativeHandle,
  useState
} from 'react';
import { View, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import CheckSvg from '../svg/CheckSvg';
import { nh } from '../../lib/normalize.helper';

const SELECTED_BACKGROUND = '#0066FF';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row'
  },
  control: {
    width: nh(20),
    height: nh(20),
    backgroundColor: 'transparent',
    borderRadius: 20,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#0066FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: nh(10)
  },
  text: {
    fontSize: nh(11)
  },
  view: {
    marginTop: nh(3)
  }
});

export type CheckboxHandle = {
  isChecked: () => boolean;
};

type CheckboxProps = {
  initiallySelected?: boolean;
  controlStyle?: ViewStyle;
  containerStyle?: ViewStyle;
  onChange?: (args: { selected: boolean }) => void;
};

export const Checkbox = forwardRef<
  CheckboxHandle,
  PropsWithChildren<CheckboxProps>
>(
  (
    {
      initiallySelected = false,
      controlStyle = {},
      containerStyle = {},
      onChange = () => {},
      children,
      ...rest
    },
    ref
  ) => {
    const [selected, setSelected] = useState(initiallySelected);
    useImperativeHandle(ref, () => ({
      isChecked: () => selected
    }));
    return (
      <TouchableOpacity
        style={[styles.container, containerStyle]}
        onPress={() => {
          setSelected(!selected);
          onChange({
            selected: !selected
          });
        }}
        {...rest}
      >
        <View
          style={[
            styles.control,
            selected && {
              backgroundColor: SELECTED_BACKGROUND
            },
            controlStyle
          ]}
        >
          {selected && <CheckSvg />}
        </View>
        <View style={[styles.view]}>{children}</View>
      </TouchableOpacity>
    );
  }
);
