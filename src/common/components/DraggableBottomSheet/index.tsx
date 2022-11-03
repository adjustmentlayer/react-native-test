import {
  Dispatch,
  forwardRef,
  PropsWithChildren,
  SetStateAction,
  useCallback,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
  useState
} from 'react';
import { Animated, PanResponder, StyleSheet, ViewStyle } from 'react-native';
import * as React from 'react';

export type ResolveStyleCallback = ({
  animatedValue,
  maxUpwardTranslateY,
  maxDownwardTranslateY
}: {
  animatedValue: Animated.Value;
  maxUpwardTranslateY: number;
  maxDownwardTranslateY: number;
}) => Animated.AnimatedProps<ViewStyle>;

type Props = {
  minHeight?: number;
  maxHeight?: number;
  dragThreshold?: number;
  containerStyle?: ViewStyle;
  dragHandleStyle?: ViewStyle;
  draggableAreaStyle?: ViewStyle;
  contentStyle?: ViewStyle;
  resolveContentStyle?: ResolveStyleCallback;
  resolveContainerStyle?: ResolveStyleCallback;
  resolveDraggableAreaStyle?: ResolveStyleCallback;
  resolveDragHandleStyle?: ResolveStyleCallback;
};

export type BottomSheetHandle = {
  expanded: boolean;
  setExpanded: Dispatch<SetStateAction<boolean>>;
  minHeight: number;
  maxHeight: number;
  maxUpwardTranslateY: number;
  maxDownwardTranslateY: number;
  animatedValue: Animated.Value;
};

export const DraggableBottomSheet = forwardRef<
  BottomSheetHandle,
  PropsWithChildren<Props>
>(
  (
    {
      minHeight = 100,
      maxHeight = 400,
      dragThreshold = 50,
      containerStyle = {},
      contentStyle = {},
      dragHandleStyle = {},
      draggableAreaStyle = {},
      resolveContentStyle,
      resolveContainerStyle,
      resolveDraggableAreaStyle,
      resolveDragHandleStyle,
      children
    },
    ref
  ) => {
    const [expanded, setExpanded] = useState(false);
    const safeMaxHeight = Math.max(minHeight, maxHeight);
    const maxUpwardTranslateY = minHeight - safeMaxHeight;
    const maxDownwardTranslateY = 0;
    const animatedValue = useRef(new Animated.Value(0)).current;
    const lastGestureDy = useRef(0);

    useLayoutEffect(() => {
      springAnimation(expanded ? 'up' : 'down');
    }, [expanded]);

    const panResponder = useRef(
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onPanResponderGrant: () => {
          animatedValue.setOffset(lastGestureDy.current);
        },
        onPanResponderMove: (e, gesture) => {
          animatedValue.setValue(gesture.dy);
        },
        onPanResponderRelease: (e, gesture) => {
          lastGestureDy.current += gesture.dy;
          animatedValue.flattenOffset();

          if (gesture.dy > 0) {
            //dragging down
            if (gesture.dy <= dragThreshold) {
              setExpanded(true);
            } else {
              setExpanded(false);
            }
          } else {
            //dragging up
            if (gesture.dy >= -dragThreshold) {
              setExpanded(false);
            } else {
              setExpanded(true);
            }
          }
        }
      })
    ).current;

    const springAnimation = (direction: 'up' | 'down') => {
      lastGestureDy.current =
        direction === 'down' ? maxDownwardTranslateY : maxUpwardTranslateY;
      Animated.spring(animatedValue, {
        toValue: lastGestureDy.current,
        useNativeDriver: true
      }).start();
    };

    const bottomSheetAnimation = {
      transform: [
        {
          translateY: animatedValue.interpolate({
            inputRange: [maxUpwardTranslateY, maxDownwardTranslateY],
            outputRange: [maxUpwardTranslateY, maxDownwardTranslateY],
            extrapolate: 'clamp'
          })
        }
      ],
      borderTopLeftRadius: animatedValue.interpolate({
        inputRange: [maxUpwardTranslateY, maxDownwardTranslateY],
        outputRange: [0, 30],
        extrapolate: 'clamp'
      }),
      borderTopRightRadius: animatedValue.interpolate({
        inputRange: [maxUpwardTranslateY, maxDownwardTranslateY],
        outputRange: [0, 30],
        extrapolate: 'clamp'
      })
    };

    useImperativeHandle(ref, () => ({
      expanded,
      setExpanded,
      animatedValue,
      minHeight,
      maxHeight: safeMaxHeight,
      maxUpwardTranslateY,
      maxDownwardTranslateY
    }));

    const resolveStyleCallbackWrapper = useCallback(
      (fn?: ResolveStyleCallback) =>
        fn && fn({ animatedValue, maxDownwardTranslateY, maxUpwardTranslateY }),
      [maxDownwardTranslateY, maxUpwardTranslateY]
    );

    return (
      <Animated.View
        style={[
          style.container,
          {
            height: safeMaxHeight,
            bottom: minHeight - safeMaxHeight
          },
          containerStyle,
          bottomSheetAnimation,
          resolveStyleCallbackWrapper(resolveContainerStyle)
        ]}
        {...panResponder.panHandlers}
      >
        <Animated.View
          style={[
            style.draggableArea,
            draggableAreaStyle,
            resolveStyleCallbackWrapper(resolveDraggableAreaStyle)
          ]}
        >
          <Animated.View
            style={[
              style.dragHandle,
              dragHandleStyle,
              resolveStyleCallbackWrapper(resolveDragHandleStyle)
            ]}
          />
        </Animated.View>
        <Animated.View
          style={[
            style.content,
            contentStyle,
            resolveStyleCallbackWrapper(resolveContentStyle)
          ]}
        >
          {children}
        </Animated.View>
      </Animated.View>
    );
  }
);

const style = StyleSheet.create({
  draggableArea: {
    width: 100,
    height: 32,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center'
  },
  dragHandle: {
    width: 100,
    height: 6,
    borderRadius: 10,
    backgroundColor: 'white'
  },
  container: {
    position: 'absolute',
    width: '100%',
    backgroundColor: 'black'
  },
  content: {}
});
