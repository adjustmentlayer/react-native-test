import * as React from 'react';
import Svg, { Path, SvgProps } from 'react-native-svg';

const ArrowUpIcon = (props: SvgProps) => (
  <Svg width={12} height={7} fill="none" {...props}>
    <Path
      fill="#fff"
      d="M11.253 6.371a.97.97 0 0 0 0-1.41L6.686.649a1 1 0 0 0-1.373 0L.745 4.962a.97.97 0 0 0 1.331 1.41l3.237-3.057a1 1 0 0 1 1.373 0l3.236 3.056a.97.97 0 0 0 1.331 0z"
    />
  </Svg>
);

export default ArrowUpIcon;
