import React, {
  PropsWithChildren,
  ReactElement,
  useState,
  ForwardRefRenderFunction,
  forwardRef,
  useImperativeHandle
} from 'react';
import {
  Image,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle
} from 'react-native';
import { Text } from '~common/components/Text';
import { Logo } from '~common/components/Logo';
import { nh, nw } from '~common/lib/normalize.helper';
import { roboto } from '~common/lib/font.helper';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { CONTENT_PADDING_HORIZONTAL } from '~common/constants/layout.constants';

const BOTTOM_PANEL_BACKGROUND_COLOR = '#000000';
export const ERROR_TEXT_COLOR = '#FF5C00';
export const FOOTER_LINK_COLOR = '#2BD700';

type AuthLayoutProps = {
  title?: string;
  titleStyle?: ViewStyle;
  footerQuestion?: string;
  footerActionText: string;
  onRefresh?: () => void;
  TitleComp?: () => ReactElement;
  titleTextStyle?: TextStyle;
  titleViewStyle?: ViewStyle;
  titleCompViewStyle?: ViewStyle;
  hasLogo?: boolean;
  onFooterButtonClick?: () => void;
  initialIsRefreshing?: boolean;
  refreshControlEnabled?: boolean;
};

export type AuthLayoutHandle = {
  setRefreshing: (state: boolean) => void;
  refreshing: boolean;
};

const Render: ForwardRefRenderFunction<
  AuthLayoutHandle,
  PropsWithChildren<AuthLayoutProps>
> = (
  {
    children,
    title,
    TitleComp = null,
    titleTextStyle = {},
    titleViewStyle = {},
    titleCompViewStyle = {},
    hasLogo = true,
    footerQuestion,
    footerActionText,
    onFooterButtonClick,
    onRefresh: onRefreshPassed,
    initialIsRefreshing: initialIsRefreshing = false,
    refreshControlEnabled = false
  },
  ref
) => {
  const [refreshing, setRefreshing] = useState(initialIsRefreshing);

  useImperativeHandle(ref, () => ({
    setRefreshing,
    refreshing
  }));

  const onRefresh = () => {
    setRefreshing(true);
    onRefreshPassed && onRefreshPassed();
  };

  const scrollViewProps = refreshControlEnabled && {
    refreshControl: (
      <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
    )
  };

  return (
    <SafeAreaView style={[styles.safeAreaView]}>
      <KeyboardAwareScrollView
        style={[styles.scrollView]}
        contentContainerStyle={{
          flexGrow: 1
        }}
        {...scrollViewProps}
      >
        <View style={[styles.container]}>
          <View style={styles.header}>
            {hasLogo && <Logo height={nh(14)} />}
            {title && (
              <View style={[styles.titleView, titleViewStyle]}>
                <Text style={[styles.title, titleTextStyle]}>
                  {title && title}
                </Text>
              </View>
            )}
            {TitleComp && (
              <View style={[styles.titleCompView, titleCompViewStyle]}>
                <TitleComp />
              </View>
            )}
          </View>

          <View style={[styles.bottomPanel]}>
            {children}
            <View style={[styles.footer]}>
              <TouchableOpacity
                onPress={() => {
                  onFooterButtonClick && onFooterButtonClick();
                }}
              >
                <Text style={[styles.footerText]}>
                  {footerQuestion}
                  <Text style={[styles.footerLink]}> {footerActionText}</Text>
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <Image
          style={{
            ...StyleSheet.absoluteFillObject,
            width: '100%',
            opacity: 1,
            zIndex: 1,
            backgroundColor: '#0F131E'
          }}
          source={require('../../../assets/img/gradient-bg.png')}
        />
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

export const AuthLayout = forwardRef(Render);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    zIndex: 2
  },
  safeAreaView: {
    flex: 1
  },
  scrollView: {
    position: 'relative'
  },
  header: {
    justifyContent: 'flex-end',
    paddingHorizontal: nw(CONTENT_PADDING_HORIZONTAL),
    height: nh(250)
  },
  title: {
    fontFamily: roboto(400),
    fontSize: nh(22),
    color: '#fff'
  },
  bottomPanel: {
    flexGrow: 1,
    backgroundColor: BOTTOM_PANEL_BACKGROUND_COLOR,
    borderTopStartRadius: nh(25),
    borderTopEndRadius: nh(25),
    paddingHorizontal: nw(24)
  },
  titleView: {
    marginTop: nh(26),
    paddingBottom: nh(38)
  },
  titleCompView: {
    marginTop: nh(26),
    paddingBottom: nh(40)
  },
  footer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: nh(73)
  },
  footerText: {
    marginTop: nh(16),
    fontSize: nh(16)
  },
  footerLink: {
    color: FOOTER_LINK_COLOR,
    fontSize: nh(16)
  }
});
