import React, { useEffect, useRef, useState } from 'react';
import { AuthLayout, AuthLayoutHandle } from '~common/components/AuthLayout';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Text } from '~common/components/Text';
import { authService } from '../../auth.service';
import { sessionService } from '../../../session/session.service';
import { observeStores } from '~common/utils';
import { roboto } from '~common/lib/font.helper';
import { nh, nw } from '~common/lib/normalize.helper';
import { Otp } from '~common/components/Otp';
import { profileService } from '~domains/profile/profile.service';
import { AuthStore } from '~domains/auth/auth.store';
import { AuthStackParamList } from '~navigation/Navigation';
import { NavigationHelpers } from '@react-navigation/native';

const RESEND_SECONDS = 120;

const formatTimeFromSeconds = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainedSeconds = seconds % 60;

  const addZero = (number: number) => {
    return ('0' + number).slice(-2);
  };
  return `${addZero(minutes)}:${addZero(remainedSeconds)}`;
};

type Props = {
  authStore: AuthStore;
  route: {
    params: AuthStackParamList['AuthOtp'];
  };
  navigation: NavigationHelpers<AuthStackParamList>;
};

export const OtpScreen = observeStores('authStore')(
  ({ navigation, route: { params }, authStore }: Props) => {
    const { phone } = params;
    const [otp, setOtp] = useState('');
    const [resendEnabled, setResendEnabled] = useState(true);
    const [resendSeconds, setResendSeconds] = useState(RESEND_SECONDS);
    const intervalId = useRef<NodeJS.Timer | null>(null);
    const handleRefresh = () => {
      profileService.loadProfile().finally(() => {
        ref.current?.setRefreshing(false);
      });
    };

    const ref = useRef<AuthLayoutHandle>(null);

    const [otpError, setOtpError] = useState(false);

    useEffect(() => {
      if (otp.length === 4) {
        ref.current?.setRefreshing(true);
        if (authStore.confirmId) {
          authService
            .confirmPhone({
              code: otp,
              confirmId: authStore.confirmId
            })
            .then(() => sessionService.update())
            .finally(() => ref.current?.setRefreshing(false))
            .catch(() => setOtpError(true));
        }
      }
    }, [otp, authStore.confirmId]);

    const handleResend = () => {
      setResendEnabled(false);
      authService.resendCode(phone);
    };

    const handleOtpValueChange = (code: string) => {
      if (code.length !== 4) {
        setOtpError(false);
      }
    };

    const handleOtpFocus = () => {
      setOtpError(false);
    };

    useEffect(() => {
      if (!resendEnabled) {
        intervalId.current = setInterval(() => {
          setResendSeconds((value) => value - 1);
        }, 1000);
      }
      return () => {
        if (intervalId.current) {
          clearInterval(intervalId.current);
        }
      };
    }, [resendEnabled]);

    useEffect(() => {
      if (resendSeconds === 0) {
        setResendEnabled(true);
        setResendSeconds(RESEND_SECONDS);
        if (intervalId.current) {
          clearInterval(intervalId.current);
        }
      }
    }, [resendSeconds]);

    return (
      <AuthLayout
        ref={ref}
        refreshControlEnabled={true}
        onRefresh={handleRefresh}
        hasLogo={false}
        footerQuestion={'Have an account?'}
        footerActionText={'Log In'}
        onFooterButtonClick={() => {
          navigation.navigate('SignIn');
        }}
        TitleComp={() => {
          return (
            <View>
              <Text style={styles.titleText}>Please enter the code 📲</Text>
              <Text
                style={{
                  marginTop: nh(11)
                }}
              >
                We sent OTP code to you number
              </Text>
              <Text
                style={{
                  marginTop: nh(10)
                }}
              >
                {phone}
              </Text>
            </View>
          );
        }}
      >
        <View
          style={{
            alignItems: 'center',
            marginTop: nh(54)
          }}
        >
          <Otp
            value={otp}
            setValue={setOtp}
            onValueChange={handleOtpValueChange}
            hasError={otpError}
            onFocus={handleOtpFocus}
          />

          <TouchableOpacity disabled={!resendEnabled} onPress={handleResend}>
            <Text
              style={{
                marginTop: nh(32),
                textDecorationLine: 'underline',
                opacity: resendEnabled ? 1 : 0.7
              }}
            >
              Resend the code
              {!resendEnabled && ` in ${formatTimeFromSeconds(resendSeconds)}`}
            </Text>
          </TouchableOpacity>
        </View>
      </AuthLayout>
    );
  }
);

const THEME = {
  UNTOUCHED: {
    BG: '#0F131E',
    BORDER: '#0F131E'
  },
  FOCUSED: {
    BG: '#0F131E',
    BORDER: '#0066FF'
  },
  FILLED: {
    BG: '#0066FF',
    BORDER: '#0066FF'
  },
  INVALID: {
    BG: '#FF5C00',
    BORDER: '#FF5C00'
  }
};

const styles = StyleSheet.create({
  titleText: {
    fontSize: nh(22),
    fontFamily: roboto(700)
  },
  otpTextInput: {
    marginTop: nh(54),
    color: 'white',
    fontSize: nh(16),
    borderWidth: 1,
    backgroundColor: THEME.UNTOUCHED.BG,
    borderBottomWidth: 1,
    borderRadius: 6,
    width: nw(58),
    height: nw(58)
  }
});
