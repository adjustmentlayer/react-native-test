import { Input } from '../Input';
import { WalletButton } from '../WalletButton';
import {
  StyleSheet,
  TextInputProps,
  TouchableOpacity,
  View
} from 'react-native';
import * as React from 'react';
import { nh, nw } from '../../lib/normalize.helper';
import { forwardRef, useImperativeHandle, useRef, useState } from 'react';

const BUTTON_ACTIVE_BG_COLOR = '#0066FF';
const BUTTON_DEFAULT_BG_COLOR = 'transparent';

export type WalletInputHandle = {
  isDeposit: () => boolean;
  getAmount: () => string;
};

type WalletInputProps = TextInputProps & {
  onChangeText?: () => void;
  onSubmit?: () => void;
  initialIsDeposit?: boolean;
  initialValue?: string;
};

export const WalletInput = forwardRef<WalletInputHandle, WalletInputProps>(
  (
    {
      initialIsDeposit = false,
      initialValue = '',
      onChangeText,
      onSubmit,
      ...rest
    },
    ref
  ) => {
    const [amount, setAmount] = useState(initialValue);
    const [isDeposit, setIsDeposit] = useState(initialIsDeposit);
    const depositBtnRef = useRef<View | null>(null);
    const withdrawBtnRef = useRef<View | null>(null);

    useImperativeHandle(ref, () => ({
      isDeposit: () => isDeposit,
      getAmount: () => amount
    }));

    const setActive = (isDeposit: boolean) => {
      withdrawBtnRef.current?.setNativeProps({
        backgroundColor: isDeposit
          ? BUTTON_DEFAULT_BG_COLOR
          : BUTTON_ACTIVE_BG_COLOR
      });
      depositBtnRef.current?.setNativeProps({
        backgroundColor: !isDeposit
          ? BUTTON_DEFAULT_BG_COLOR
          : BUTTON_ACTIVE_BG_COLOR
      });
      setIsDeposit(isDeposit);
    };

    return (
      <View style={[styles.container]}>
        <Input
          value={`${amount}`}
          onChangeText={(value: string) => {
            onChangeText && onChangeText();
            setAmount(value);
          }}
          keyboardType={'numeric'}
          onSubmitEditing={() => {
            onSubmit && onSubmit();
          }}
          style={styles.input}
          {...rest}
        />
        <TouchableOpacity
          style={styles.walletWithdraw}
          onPress={() => {
            setActive(false);
          }}
        >
          <WalletButton
            ref={withdrawBtnRef}
            deposit={false}
            backgroundColor={
              !initialIsDeposit
                ? BUTTON_ACTIVE_BG_COLOR
                : BUTTON_DEFAULT_BG_COLOR
            }
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.walletDeposit}
          onPress={() => {
            setActive(true);
          }}
        >
          <WalletButton
            ref={depositBtnRef}
            backgroundColor={
              initialIsDeposit
                ? BUTTON_ACTIVE_BG_COLOR
                : BUTTON_DEFAULT_BG_COLOR
            }
            deposit={true}
          />
        </TouchableOpacity>
      </View>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    position: 'relative'
  },
  input: {
    paddingRight: nw(145)
  },
  walletDeposit: {
    position: 'absolute',
    right: nw(5),
    top: nh(5)
  },
  walletWithdraw: {
    position: 'absolute',
    right: nw(73),
    top: nh(5)
  }
});
