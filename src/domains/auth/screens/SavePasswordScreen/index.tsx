import React, { useEffect, useRef, useState } from 'react';
import {
  AuthLayout,
  AuthLayoutHandle,
  ERROR_TEXT_COLOR
} from '~common/components/AuthLayout';
import { nh } from '~common/lib/normalize.helper';
import { StyleSheet, View } from 'react-native';
import { Text } from '~common/components/Text';
import { AuthInput } from '../../components/AuthInput';
import { TextButton } from '~common/components/TextButton';
import { authService } from '../../auth.service';
import { profileService } from '~domains/profile/profile.service';
import { NavigationContainerRef } from '@react-navigation/native';
import { AuthStackParamList } from '~navigation/Navigation';
import { roboto } from '~common/lib/font.helper';

export const SavePasswordScreen = ({
  navigation
}: {
  navigation: NavigationContainerRef<AuthStackParamList>;
}) => {
  const [submitDisabled, setSubmitDisabled] = useState(true);

  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const ref = useRef<AuthLayoutHandle>(null);

  const handleRefresh = () => {
    profileService.loadProfile().finally(() => {
      ref.current?.setRefreshing(false);
    });
  };

  const handlePasswordSave = async () => {
    ref.current?.setRefreshing(true);
    authService
      .savePassword(password)
      .then(() => {
        navigation.navigate<keyof AuthStackParamList>(
          // @ts-ignore
          'SaveProfileData'
        );
      })
      .finally(() => ref.current?.setRefreshing(false));
  };

  useEffect(() => {
    if (password.length > 5 && password === passwordConfirmation) {
      setSubmitDisabled(false);
    } else {
      setSubmitDisabled(true);
    }
  }, [password, passwordConfirmation]);

  return (
    <AuthLayout
      ref={ref}
      onRefresh={handleRefresh}
      hasLogo={false}
      refreshControlEnabled={true}
      footerActionText={'Logout'}
      onFooterButtonClick={() => {
        authService.logout();
      }}
      titleViewStyle={{
        paddingBottom: nh(69)
      }}
      TitleComp={() => {
        return (
          <View>
            <Text style={styles.titleText}>Create password 🔑</Text>
            <Text
              style={{
                marginTop: nh(11)
              }}
            >
              Please create new password
            </Text>
          </View>
        );
      }}
    >
      <AuthInput
        hasError={false}
        placeholder={'Password'}
        value={password}
        onChangeText={setPassword}
        secureTextEntry={true}
        style={{
          marginTop: nh(46)
        }}
      />
      <AuthInput
        hasError={false}
        placeholder={'Confirm new password'}
        value={passwordConfirmation}
        onChangeText={setPasswordConfirmation}
        secureTextEntry={true}
        style={{
          marginTop: nh(16)
        }}
      />
      <TextButton
        onPress={handlePasswordSave}
        disabled={submitDisabled}
        containerStyle={{
          marginTop: nh(54)
        }}
      >
        Submit
      </TextButton>
    </AuthLayout>
  );
};

export const styles = StyleSheet.create({
  password: {
    marginTop: nh(25)
  },
  titleText: {
    fontSize: nh(22),
    fontFamily: roboto(700)
  },

  errorContainer: {
    marginTop: nh(16)
  },
  errorText: {
    color: ERROR_TEXT_COLOR
  }
});
