import React from 'react';
import { BottomNavigationTabBar } from '~navigation/BottomNavigationTabBar';
import { HomeScreen } from '~domains/app/screens/HomeScreen';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { RootTabsParamList } from '~navigation/Navigation';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Logo } from '~common/components/Logo';
import { authService } from '~domains/auth/auth.service';
import Hamburger from '~common/components/Hamburger';
import { nh, nw } from '~common/lib/normalize.helper';
import { CONTENT_PADDING_HORIZONTAL } from '~common/constants/layout.constants';

const Tab = createBottomTabNavigator<RootTabsParamList>() as any;

const styles = StyleSheet.create({
  header: {
    backgroundColor: 'transparent',
    paddingTop: nh(58),
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: nw(CONTENT_PADDING_HORIZONTAL),
    paddingRight: nw(CONTENT_PADDING_HORIZONTAL)
  }
});

const TabHeader = () => (
  <View style={styles.header}>
    <Logo width={nw(108)} height={nh(14)} />
    <TouchableOpacity
      onPress={() => {
        authService.logout();
      }}
    >
      <Hamburger />
    </TouchableOpacity>
  </View>
);

export const HomeTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerTransparent: true,
        header: TabHeader,
        tabBarHideOnKeyboard: true
      }}
      tabBar={(props: any) => <BottomNavigationTabBar {...props} />}
    >
      <Tab.Screen name="Market" component={HomeScreen} />
      <Tab.Screen name="History" component={HomeScreen} />
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Bonus" component={HomeScreen} />
      <Tab.Screen name="Settings" component={HomeScreen} />
    </Tab.Navigator>
  );
};
