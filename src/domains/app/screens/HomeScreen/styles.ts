import { StyleSheet } from 'react-native';
import { nh, nw } from '~common/lib/normalize.helper';
import { poppins, roboto } from '~common/lib/font.helper';
import { CONTENT_PADDING_HORIZONTAL } from '~common/constants/layout.constants';

export const styles = StyleSheet.create({
  container: {
    paddingLeft: nw(20),
    paddingRight: nw(20)
  },
  properties: {
    flexDirection: 'row',
    marginTop: nh(23)
  },
  property: {
    marginRight: nw(36)
  },
  label: {
    fontSize: nh(10),
    lineHeight: nh(12),
    fontFamily: roboto(500)
  },
  value: {
    marginTop: nh(2),
    fontSize: nh(16),
    lineHeight: nh(24),
    fontFamily: poppins(600)
  },
  inputContainer: {
    marginTop: nh(19),
    paddingHorizontal: nw(CONTENT_PADDING_HORIZONTAL)
  },
  bottomSheetContent: {
    paddingHorizontal: nw(CONTENT_PADDING_HORIZONTAL),
    paddingTop: nh(20)
  }
});
