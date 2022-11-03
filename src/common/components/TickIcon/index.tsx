import * as React from 'react';
import Svg, { Path, SvgProps } from 'react-native-svg';

const TickIcon = (props: SvgProps) => (
  <Svg width={15} height={10} fill="none" {...props}>
    <Path
      fill="#fff"
      d="M1.15 4.01a.97.97 0 0 0 0 1.41l4.163 3.932a1 1 0 0 0 1.374 0l7.567-7.147a.97.97 0 1 0-1.331-1.41l-6.236 5.89a1 1 0 0 1-1.374 0L2.481 4.01a.97.97 0 0 0-1.33 0z"
    />
  </Svg>
);

export default TickIcon;
