import * as React from 'react';
import Svg, { Path, SvgProps } from 'react-native-svg';

const PlusSvg = (props: SvgProps) => (
  <Svg width={22} height={22} fill="none" {...props}>
    <Path stroke="#fff" d="M1 11h20M11.001 1v20" />
  </Svg>
);

export default PlusSvg;
