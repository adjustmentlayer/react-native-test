import * as React from 'react';
import { Layout } from '~common/components/Layout';
import {
  ScrollView,
  RefreshControl,
  View,
  LayoutChangeEvent,
  Keyboard,
  Platform
} from 'react-native';
import { Text } from '~common/components/Text';
import { Alert } from 'react-native';
import { useCallback, useEffect, useRef, useState } from 'react';
import { WalletInput } from '~common/components/WalletInput';
import { AccountsCarousel } from '~domains/app/components/AccountsCarousel';
import { WalletInputHandle } from '~common/components/WalletInput';
import { profileService } from '~domains/profile/profile.service';
import { inject, observer } from 'mobx-react';
import { walletService } from '~services';
import { AccountModel, WalletStore } from '~domains/wallet/wallet.store';
import { styles } from './styles';
import { useHeaderHeight } from '@react-navigation/elements';
import { nh } from '~common/lib/normalize.helper';

export const HomeScreen = inject('walletStore')(
  observer(({ walletStore }: { walletStore: WalletStore }) => {
    const walletInputRef = useRef<WalletInputHandle>(null);
    const [activeAccountIndex, setActiveAccountIndex] = useState(0);
    const [activeItem] = useState<AccountModel | null>(null);
    const [refreshing, setRefreshing] = useState(false);
    const headerHeight = useHeaderHeight();

    const [keyboardIsShown, setKeyboardIsShown] = useState(false);

    const onRefresh = useCallback(() => {
      setRefreshing(true);
      profileService.loadProfile().then(() => {
        setRefreshing(false);
      });
      walletService.signInOrSignUp();
    }, []);

    const renderActiveAccountProperties = () => {
      if (!activeItem?.margin || !activeItem?.leverage) {
        return null;
      }
      return (
        <View style={styles.container}>
          <View
            style={[
              styles.properties,
              {
                opacity: !activeItem ? 0 : 1
              }
            ]}
          >
            <View style={styles.property}>
              <Text style={styles.label}>Total margin</Text>
              <Text style={styles.value}>{activeItem?.margin} USD</Text>
            </View>
            <View style={styles.property}>
              <Text style={styles.label}>Leverage</Text>
              <Text style={styles.value}>{activeItem?.leverage}</Text>
            </View>
          </View>
        </View>
      );
    };

    useEffect(() => {
      const handleWillShow = () => {
        setKeyboardIsShown(true);
      };
      const handleWillHide = () => {
        setKeyboardIsShown(false);
      };

      const keyboardWillShow = Keyboard.addListener(
        Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
        handleWillShow
      );
      const keyboardWillHide = Keyboard.addListener(
        Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
        handleWillHide
      );

      return () => {
        keyboardWillShow.remove();
        keyboardWillHide.remove();
      };
    }, []);

    const handleInputSubmit = useCallback(() => {
      Alert.alert(
        'Result',
        (walletInputRef.current?.isDeposit()
          ? 'User wants to deposit'
          : 'User wants to withdraw') +
          ' ' +
          walletInputRef.current?.getAmount()
      );
    }, []);

    return (
      <Layout>
        <ScrollView
          contentContainerStyle={{
            flex: 1
          }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <AccountsCarousel
            loading={walletStore.loading}
            data={walletStore.accountModels}
            activeIndex={activeAccountIndex}
            setActiveIndex={setActiveAccountIndex}
            compact={true}
          />
          {renderActiveAccountProperties()}

          <View style={styles.inputContainer}>
            <WalletInput
              ref={walletInputRef}
              initialIsDeposit={true}
              initialValue={'186.15'}
              onSubmit={handleInputSubmit}
            />
          </View>
        </ScrollView>
      </Layout>
    );
  })
);
