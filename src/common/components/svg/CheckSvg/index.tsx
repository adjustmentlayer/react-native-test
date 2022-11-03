import * as React from 'react';
import Svg, { Path, SvgProps } from 'react-native-svg';

const SvgComponent = (props: SvgProps) => (
  <Svg width={11} height={10} fill="none" {...props}>
    <Path stroke="#fff" d="m1 4.692 3.594 4.014a.3.3 0 0 0 .476-.037L10 1" />
  </Svg>
);

export default SvgComponent;
