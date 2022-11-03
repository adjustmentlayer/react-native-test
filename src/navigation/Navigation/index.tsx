import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityIndicator, View } from 'react-native';
import { profileService } from '~domains/profile/profile.service';
import {
  SignInScreen,
  SignUpScreen,
  ResetPasswordScreen,
  OtpScreen,
  SavePasswordScreen
} from '~domains/auth/screens';
import { observeStores } from '~common/utils';

import {
  ConfirmEmailScreen,
  SaveProfileDataScreen,
  SaveEmailScreen
} from '~domains/profile/screens';
import { useEffect } from 'react';
import { ProfileStore } from '~domains/profile/profile.store';
import { AppStore } from '~domains/app/app.store';
import { SessionStore } from '~domains/session/session.store';
import { inject, observer } from 'mobx-react';
import { HomeTabs } from '~navigation/HomeTabs';
import { walletService } from '~domains/wallet/wallet.service';
import { WalletStore } from '~domains/wallet/wallet.store';
import { Text } from '~common/components/Text';
import { nw } from '~common/lib/normalize.helper';

export type AuthStackParamList = {
  SignIn: undefined;
  SignUp: undefined;
  SignUpStack: undefined;
  ResetPassword: undefined;
  Loading: undefined;
  AuthOtp: {
    phone: string;
  };
  SavePassword: undefined;
  SaveProfileData: {
    firstName: string | undefined;
    lastName: string | undefined;
  };
  SaveEmail: undefined;
};

export type RootTabsParamList = {
  Settings: undefined;
  Bonus: undefined;
  Home: undefined;
  History: undefined;
  Market: undefined;
};

type RootStackParamList = {
  HomeTabs: undefined;
  ConfirmEmail: undefined;
};

const Loading = ({ label = '' }: { label?: string }) => (
  <View
    style={{
      backgroundColor: '#0F131E',
      justifyContent: 'center',
      alignItems: 'center',
      flex: 1
    }}
  >
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center'
      }}
    >
      <ActivityIndicator size={'large'} />
      {label && (
        <Text
          style={{
            marginLeft: nw(16)
          }}
        >
          {label}
        </Text>
      )}
    </View>
  </View>
);

const Stack = createNativeStackNavigator<
  AuthStackParamList & RootStackParamList
>() as any;

const AuthStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false
      }}
    >
      <Stack.Screen name="SignIn" component={SignInScreen} />
      <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
      <Stack.Group>
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="AuthOtp" component={OtpScreen} />
      </Stack.Group>
    </Stack.Navigator>
  );
};

const RootStack = observeStores(
  'profileStore',
  'appStore',
  'sessionStore'
)(
  ({
    profileStore: { firstName, lastName, hasEmail, hasConfirmedEmail, loaded },
    appStore,
    sessionStore: { isAuthorized }
  }: {
    profileStore: ProfileStore;
    appStore: AppStore;
    sessionStore: SessionStore;
  }) => {
    let screens = [
      <Stack.Screen key={'HomeTabs'} name={'HomeTabs'} component={HomeTabs} />
    ];

    if (!hasConfirmedEmail) {
      screens = [
        <Stack.Screen
          key={'Step4'}
          name={'ConfirmEmail'}
          component={ConfirmEmailScreen}
        />
      ];
    }

    if (!hasEmail) {
      screens = [
        <Stack.Screen
          key={'Step3'}
          name="SaveEmail"
          component={SaveEmailScreen}
        />
      ];
    }

    if (!firstName || !lastName) {
      screens = [
        <Stack.Screen
          key={'Step1'}
          name="SavePassword"
          component={SavePasswordScreen}
        />,
        <Stack.Screen
          key={'Step2'}
          name="SaveProfileData"
          component={SaveProfileDataScreen}
          initialParams={{
            firstName,
            lastName
          }}
        />
      ];
    }

    if (!loaded) {
      screens = [
        <Stack.Screen
          key={'Loading'}
          name={'Loading'}
          component={() => {
            return <Loading label={'loading profile...'} />;
          }}
        />
      ];
    }

    return (
      <Stack.Navigator
        screenOptions={{
          headerShown: false
        }}
      >
        {screens}
      </Stack.Navigator>
    );
  }
) as any;

export const Navigation = inject(
  'sessionStore',
  'appStore',
  'profileStore',
  'walletStore'
)(
  observer(
    ({
      appStore,
      sessionStore,
      profileStore,
      walletStore
    }: {
      appStore?: AppStore;
      profileStore?: ProfileStore;
      sessionStore?: SessionStore;
      walletStore?: WalletStore;
    }) => {
      const { isAuthorized } = sessionStore!;
      const { canSignUpWalletAccount } = profileStore!;
      const { accessToken } = walletStore!;

      useEffect(() => {
        if (isAuthorized) {
          appStore!.setLoading(true);
          profileService.loadProfile().finally(() => {
            appStore!.setLoading(false);
          });
        } else {
          profileService.unloadProfile();
        }
      }, [isAuthorized]);

      useEffect(() => {
        if (isAuthorized && canSignUpWalletAccount) {
          walletService.signInOrSignUp();
        }
      }, [isAuthorized, canSignUpWalletAccount]);

      useEffect(() => {
        if (accessToken !== null && isAuthorized) {
          walletService.getAccountsOrCreateFirstOne();
        }
      }, [isAuthorized, accessToken]);

      if (appStore!.loading) {
        return <Loading label={'loading app...'} />;
      }

      return (
        <NavigationContainer>
          {!sessionStore!.isAuthorized ? <AuthStack /> : <RootStack />}
        </NavigationContainer>
      );
    }
  )
);
