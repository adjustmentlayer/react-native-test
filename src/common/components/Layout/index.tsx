import React, { ReactNode } from 'react';
import {
  ImageBackground,
  SafeAreaView,
  StyleSheet,
  ViewProps
} from 'react-native';
import { useHeaderHeight } from '@react-navigation/elements';

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});

type Opts = {
  children?: ReactNode;
  safeAreaProps?: ViewProps;
};

export const Layout = ({ children, safeAreaProps }: Opts) => {
  const headerHeight = useHeaderHeight();
  return (
    <ImageBackground
      style={{
        flex: 1,
        width: '100%',
        backgroundColor: '#0F131E'
      }}
      resizeMode={'stretch'}
      source={require('./../../../assets/img/gradient-bg.png')}
    >
      <SafeAreaView
        {...safeAreaProps}
        style={[
          styles.container,
          {
            marginTop: headerHeight
          },
          safeAreaProps?.style
        ]}
      >
        {children}
      </SafeAreaView>
    </ImageBackground>
  );
};
