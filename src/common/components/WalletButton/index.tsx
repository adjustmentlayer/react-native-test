import * as React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import WalletSvg from '../svg/WalletSvg';
import { nh, nw } from '../../lib/normalize.helper';
import { forwardRef, ForwardRefRenderFunction } from 'react';

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    width: nw(69),
    height: nh(43),

    justifyContent: 'center',
    alignItems: 'center'
  }
});

type Props = {
  deposit?: boolean;
  style?: ViewStyle;
  backgroundColor?: string;
};

type Render = ForwardRefRenderFunction<View, Props>;

const render: Render = (
  { deposit = true, style, backgroundColor = 'transparent', ...rest },
  ref
) => {
  return (
    <View
      ref={ref}
      style={{
        ...styles.container,
        ...style,
        backgroundColor
      }}
      {...rest}
    >
      <WalletSvg deposit={deposit} />
    </View>
  );
};

export const WalletButton = forwardRef(render);
