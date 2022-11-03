import * as React from 'react';
import Svg, { Path, SvgProps } from 'react-native-svg';

export const Hamburger = (props: SvgProps) => (
  <Svg width={24} height={20} fill="none" {...props}>
    <Path
      fill="#fff"
      d="M1.333 0C.597 0 0 .64 0 1.429s.597 1.428 1.333 1.428h21.334c.736 0 1.333-.64 1.333-1.428C24 .639 23.403 0 22.667 0H1.333zM0 10c0-.789.597-1.429 1.333-1.429h21.334c.736 0 1.333.64 1.333 1.429s-.597 1.429-1.333 1.429H1.333C.597 11.429 0 10.789 0 10zm0 8.571c0-.789.597-1.428 1.333-1.428h21.334c.736 0 1.333.64 1.333 1.428 0 .79-.597 1.429-1.333 1.429H1.333C.597 20 0 19.36 0 18.571z"
    />
  </Svg>
);

export default Hamburger;
