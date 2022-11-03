import * as React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from '~common/components/Text';
import RectangleOverRectangleSvg from '../svg/RectangleOverRectangleSvg';
import Clipboard from '@react-native-clipboard/clipboard';
import { rightTrimText } from '../../lib/trim-text.helper';
import { nw } from '../../lib/normalize.helper';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row'
  },
  icon: {
    marginLeft: nw(11)
  }
});

const Icon = () => {
  return (
    <View>
      <RectangleOverRectangleSvg />
    </View>
  );
};

export const Copyable = ({ value, trim }: { value: string; trim: number }) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => Clipboard.setString(value)}
    >
      <View>
        <Text>{trim ? rightTrimText(value, trim) : value}</Text>
      </View>
      <View style={styles.icon}>
        <Icon />
      </View>
    </TouchableOpacity>
  );
};
