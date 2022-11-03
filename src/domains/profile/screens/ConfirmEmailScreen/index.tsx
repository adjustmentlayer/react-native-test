import React, { useRef } from 'react';
import { AuthLayout, AuthLayoutHandle } from '~common/components/AuthLayout';
import { TextButton } from '~common/components/TextButton';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Text } from '~common/components/Text';
import { observeStores } from '~common/utils';
import { roboto } from '~common/lib/font.helper';
import { nh } from '~common/lib/normalize.helper';
import { authService } from '~domains/auth/auth.service';
import { profileService } from '~services';
import { authApi } from '~domains/auth/auth.api';
import { ProfileStore } from '~domains/profile/profile.store';

export const ConfirmEmailScreen = observeStores(
  'authStore',
  'profileStore'
)(({ profileStore: { email } }: { profileStore: ProfileStore }) => {
  const ref = useRef<AuthLayoutHandle>(null);

  const handleRefresh = () => {
    return profileService.loadProfile().finally(() => {
      ref.current?.setRefreshing(false);
    });
  };

  return (
    <AuthLayout
      hasLogo={false}
      ref={ref}
      onFooterButtonClick={() => {
        authService.logout();
      }}
      refreshControlEnabled={true}
      onRefresh={handleRefresh}
      footerActionText={'Logout'}
      TitleComp={() => {
        return (
          <View>
            <Text style={styles.titleText}>Please check your Email ✉️</Text>
            <Text
              style={{
                fontSize: 12
              }}
            >
              {email}
            </Text>
            <Text
              style={{
                marginTop: nh(11)
              }}
            >
              Verification link has been sent to your email. Follow the link to
              confirm your email.
            </Text>
          </View>
        );
      }}
    >
      <View
        style={{
          paddingTop: nh(56),
          alignItems: 'center'
        }}
      >
        {<Image source={require('./email.png')} />}

        <TouchableOpacity
          style={{
            flexDirection: 'row'
          }}
          onPress={() => {
            ref.current?.setRefreshing(true);
            authApi
              // @ts-ignore email is expected to be present, because otherwise this screen wouldn't be shown at all
              .resendEmailConfirmationCode(email)
              .finally(() => {
                ref.current?.setRefreshing(false);
              });
          }}
        >
          <Text>Didn't get the email?</Text>
          <Text
            style={{
              color: '#2BD700'
            }}
          >
            {' '}
            Resend
          </Text>
        </TouchableOpacity>

        <TextButton
          onPress={() => {
            ref.current?.setRefreshing(true);
            handleRefresh();
          }}
          containerStyle={{
            marginTop: nh(12)
          }}
        >
          Refresh
        </TextButton>
      </View>
    </AuthLayout>
  );
});

const styles = StyleSheet.create({
  titleText: {
    fontSize: nh(22),
    fontFamily: roboto(700)
  }
});
