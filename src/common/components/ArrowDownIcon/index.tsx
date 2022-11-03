import * as React from 'react';
import Svg, { Path, SvgProps } from 'react-native-svg';

const ArrowDownIcon = (props: SvgProps) => (
  <Svg width={12} height={7} fill="none" {...props}>
    <Path
      fill="#fff"
      d="M.745.629a.97.97 0 0 0 0 1.41l4.568 4.313a1 1 0 0 0 1.373 0l4.567-4.314A.97.97 0 0 0 9.922.628L6.686 3.686a1 1 0 0 1-1.373 0L2.077.629a.97.97 0 0 0-1.332 0z"
    />
  </Svg>
);

export default ArrowDownIcon;
