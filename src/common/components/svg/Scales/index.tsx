import * as React from 'react';
import Svg, { Path, SvgProps } from 'react-native-svg';

const Scales = (props: SvgProps) => (
  <Svg width={14} height={14} fill="none" {...props}>
    <Path
      fill="#fff"
      d="M3.361 14c-.112-.073-.142-.178-.136-.306.006-.145-.001-.292.002-.437.009-.407.275-.673.684-.686.095-.002.191 0 .31 0v-.29c.005-.461.274-.731.738-.734.423-.003.846 0 1.268 0h.154V3.881H3.11c.015.04.026.078.041.112.63 1.376 1.258 2.753 1.891 4.127a.222.222 0 0 0 .132.105c.187.047.293.212.211.385-.13.276-.264.552-.425.81-.16.258-.42.35-.721.349-.882-.004-1.764-.002-2.646-.002-.17 0-.34.003-.51-.003A.76.76 0 0 1 .41 9.36a13.124 13.124 0 0 1-.376-.73c-.09-.186.008-.358.21-.403A.187.187 0 0 0 .36 8.14c.642-1.395 1.281-2.792 1.92-4.189.01-.02.014-.041.026-.08-.153 0-.294.005-.435 0-.455-.02-.724-.451-.516-.828a.532.532 0 0 1 .438-.29c.069-.006.138-.007.207-.007h4.389c0-.243.005-.466-.004-.688-.002-.042-.053-.089-.09-.123-.342-.305-.478-.68-.358-1.121.123-.45.43-.725.896-.8.5-.081.973.181 1.18.638.197.438.076.96-.305 1.277-.07.058-.102.114-.099.206.007.195.002.391.002.61h.18c1.41 0 2.821 0 4.232.002.091 0 .185 0 .273.022a.548.548 0 0 1 .415.558.547.547 0 0 1-.453.527c-.09.016-.183.015-.274.018-.092.003-.183 0-.295 0 .025.06.042.105.062.149.62 1.355 1.241 2.71 1.86 4.066.038.081.07.138.179.152a.254.254 0 0 1 .187.359c-.134.28-.267.561-.43.824-.159.257-.42.348-.721.347-1.02-.004-2.04-.002-3.06-.002l-.11-.003a.751.751 0 0 1-.645-.383 10.948 10.948 0 0 1-.39-.753c-.09-.188.009-.357.212-.402.041-.01.094-.04.11-.075.646-1.404 1.288-2.81 1.93-4.215.007-.015.007-.034.012-.058H7.612v.617c0 .055.002.11-.006.163-.016.105-.09.177-.186.165-.073-.01-.151-.072-.199-.133-.033-.042-.023-.122-.023-.185-.002-.251-.001-.502 0-.753 0-.227.065-.292.295-.292h4.52c.06 0 .13.01.175-.018.049-.03.099-.1.099-.152 0-.042-.067-.097-.117-.123-.04-.02-.099-.008-.15-.008H7.543c-.293 0-.345-.053-.345-.344v-.624h-.393v.616c0 .302-.049.351-.351.351H1.932c-.162.002-.234.048-.225.153.011.146.124.149.233.149h4.52c.296 0 .344.047.344.34v7.735h.393V5.726c0-.059 0-.12.015-.176.029-.107.106-.157.217-.146.105.011.166.074.178.177.007.054.004.11.004.164v5.801h1.416c.48.002.748.27.75.748v.276h.298c.424.01.692.278.698.7.002.141-.004.283.002.424.006.127-.024.233-.137.305H3.361V14zm-.654-9.99L.78 8.22h3.851L2.707 4.01zm8.585 0L9.367 8.222h3.851l-1.925-4.21zm-6.63 8.562c.183 0 .366-.002.55 0 .122.002.2.066.214.188.013.11-.07.202-.198.22-.04.005-.083.003-.124.003-.39 0-.78-.001-1.171.001-.17.001-.266.07-.283.219-.014.124-.003.25-.003.377h6.712v-.24c0-.28-.077-.357-.36-.357H6.292c-.208 0-.311-.07-.311-.208 0-.137.101-.204.312-.204h3.069v-.207c0-.344-.062-.405-.412-.405-1.263 0-2.527.006-3.79-.003-.517-.004-.54.084-.518.571 0 .008.007.016.02.045zM.506 8.645c.074.145.147.275.207.411.097.22.26.305.5.304.9-.007 1.799-.003 2.698-.003.138 0 .275 0 .413-.004a.34.34 0 0 0 .298-.168c.1-.172.189-.35.29-.54H.505zm8.585 0c.077.15.152.283.215.424.094.209.25.293.48.29.495-.007.99-.002 1.487-.002h1.555c.145 0 .284-.025.364-.151.11-.176.2-.364.307-.562H9.091zm-2.088-6.87a.694.694 0 0 0 .686-.676c0-.38-.307-.69-.685-.692a.692.692 0 0 0-.694.698.695.695 0 0 0 .693.67z"
    />
  </Svg>
);

export default Scales;
