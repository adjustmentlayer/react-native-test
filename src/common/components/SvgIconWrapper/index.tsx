import * as React from 'react';
import { View } from 'react-native';
import { PropsWithChildren } from 'react';
import { nh, nw } from '~common/lib/normalize.helper';

type Props = PropsWithChildren<{
  backgroundColor?: string;
}>;

export const SvgIconWrapper = ({
  children,
  backgroundColor = '#0066FF'
}: Props) => {
  return (
    <View
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor,
        width: nw(20),
        height: nh(20),
        borderRadius: 4
      }}
    >
      {children}
    </View>
  );
};
