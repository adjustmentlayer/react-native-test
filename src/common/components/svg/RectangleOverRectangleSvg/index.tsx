import * as React from 'react';
import Svg, { Rect, Path, SvgProps } from 'react-native-svg';

const RectangleOverRectangleSvg = (props: SvgProps) => (
  <Svg width={12} height={14} fill="none" {...props}>
    <Rect width={8} height={11} x={0.5} y={0.5} stroke="#fff" rx={0.5} />
    <Path
      stroke="#fff"
      strokeWidth={1}
      d="M3.5 11v2a.5.5 0 0 0 .5.5h7a.5.5 0 0 0 .5-.5V3a.5.5 0 0 0-.5-.5H9"
    />
  </Svg>
);

export default RectangleOverRectangleSvg;
