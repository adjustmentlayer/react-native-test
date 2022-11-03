import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import PlusSvg from '../../common/components/svg/PlusSvg';
import CounterClockwiseRadialArrow from '../../common/components/svg/CounterclockwiseRadialArrow';
import PieChartSvg from '../../common/components/svg/PieChartSvg';
import GearSvg from '../../common/components/svg/GearSvg';
import GiftSvg from '../../common/components/svg/GiftSvg';
import { NavigationState } from '@react-navigation/native';
import { BottomTabDescriptorMap } from '@react-navigation/bottom-tabs/lib/typescript/src/types';
import { nh } from '~common/lib/normalize.helper';

export const BottomNavigationTabBar = (props: {
  state: NavigationState;
  descriptors: BottomTabDescriptorMap;
  navigation: any;
}) => {
  const { state, descriptors, navigation } = props;
  return (
    <View
      style={{
        flexDirection: 'row',
        height: nh(109),
        alignItems: 'center',
        backgroundColor: '#000'
      }}
    >
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        /*                const label =
                    options.tabBarLabel !== undefined
                        ? options.tabBarLabel
                        : options.title !== undefined
                        ? options.title
                        : route.name;*/

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key
          });
        };

        const Icon =
          {
            Home: PlusSvg,
            History: CounterClockwiseRadialArrow,
            Market: PieChartSvg,
            Settings: GearSvg,
            Bonus: GiftSvg
          }[route.name] || PlusSvg;

        const TabContent = () => {
          return (
            <View>
              <Icon />
            </View>
          );
        };

        const SecondaryTab = () => {
          return <TabContent />;
        };

        const CentralTab = () => {
          return (
            <View
              style={{
                width: nh(54),
                height: nh(54),
                backgroundColor: '#0066FF',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 100
              }}
            >
              <TabContent />
            </View>
          );
        };

        return (
          <TouchableOpacity
            key={index}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={{ flex: 1, alignItems: 'center' }}
          >
            {index === 2 ? <CentralTab /> : <SecondaryTab />}
          </TouchableOpacity>
        );
      })}
    </View>
  );
};
