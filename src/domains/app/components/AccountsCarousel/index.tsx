import * as React from 'react';
import {
  ActivityIndicator,
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  StyleSheet,
  View
} from 'react-native';
import { nh, nw } from '~common/lib/normalize.helper';
import { AccountCard } from '../AccountCard';
import { useCallback, useRef } from 'react';
import { CONTENT_PADDING_HORIZONTAL } from '~common/constants/layout.constants';
import { AccountModel } from '~domains/wallet/wallet.store';

const styles = StyleSheet.create({
  carouselContainer: {
    marginTop: nh(36)
  },
  spinnerContainer: {
    alignItems: 'center',
    justifyContent: 'center'
  }
});

type Props = {
  compact?: boolean;
  data?: AccountModel[];
  loading?: boolean;
  activeIndex?: number;
  setActiveIndex?: (index: number) => void;
};

export const AccountsCarousel = ({
  compact = true,
  data = [],
  loading = false,
  activeIndex = 0,
  setActiveIndex = () => {}
}: Props) => {
  const flatListRef = useRef<FlatList>(null);
  const height = compact ? 98 : 121.5;
  const slideWidth = 310;
  const slideOffset = CONTENT_PADDING_HORIZONTAL;
  const totalSlideWidth = slideWidth + slideOffset;

  const renderItem = ({
    item,
    index
  }: {
    item: AccountModel;
    index: number;
  }) => {
    return (
      <AccountCard
        isActive={activeIndex === index}
        compact={compact}
        item={item}
        style={{
          marginRight: nw(slideOffset),
          marginLeft: !index ? nw(slideOffset) : 0
        }}
      />
    );
  };

  /*    const scrollToIndex = (index: number) => {
        flatListRef.current?.scrollToIndex({
            animated: true,
            index,
            viewOffset: nw(slideOffset)
        });
    };*/

  const onScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const { contentOffset } = event.nativeEvent;
      const slideSize = nw(totalSlideWidth);
      const index = contentOffset.x / slideSize;
      const roundIndex = Math.round(index);

      setActiveIndex(roundIndex);
    },
    []
  );

  if (loading) {
    return (
      <View
        style={[
          styles.spinnerContainer,
          styles.carouselContainer,
          {
            height: nh(height)
          }
        ]}
      >
        <ActivityIndicator />
      </View>
    );
  }
  return (
    <View
      style={[
        styles.carouselContainer,
        {
          height: nh(height)
        }
      ]}
    >
      <FlatList
        data={data}
        ref={flatListRef}
        snapToInterval={nw(totalSlideWidth)}
        initialScrollIndex={activeIndex}
        initialNumToRender={data.length}
        keyExtractor={(item) => item.id}
        showsHorizontalScrollIndicator={false}
        decelerationRate={'fast'}
        bounces={false}
        renderItem={renderItem}
        viewabilityConfig={{
          waitForInteraction: true,
          viewAreaCoveragePercentThreshold: 95
        }}
        horizontal
        pagingEnabled
        onScroll={onScroll}
        getItemLayout={(_, index) => {
          return {
            length: nw(totalSlideWidth),
            offset: nw(totalSlideWidth) * index,
            index
          };
        }}
      />
    </View>
  );
};
