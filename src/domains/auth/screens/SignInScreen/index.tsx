import React, { useEffect, useMemo, useState } from 'react';

import {
  AuthLayout,
  ERROR_TEXT_COLOR,
  FOOTER_LINK_COLOR
} from '../../../../common/components/AuthLayout';
import { AuthInput } from '../../components/AuthInput';
import { nh } from '~common/lib/normalize.helper';
import { StyleSheet, View } from 'react-native';
import { Text } from '~common/components/Text';
import { TextButton } from '~common/components/TextButton';
import { authService } from '~domains/auth/auth.service';
import { sessionService } from '~domains/session/session.service';
import { object, string } from 'yup';
import { observeStores, sanitizePhoneNumber } from '~common/utils';
import { log } from '~common/lib/logging.helper';
import { useTranslation } from 'react-i18next';
import { AuthStore } from '~domains/auth/auth.store';
import { AppStore } from '~domains/app/app.store';
import { NavigationContainerRef } from '@react-navigation/native';
import { AuthStackParamList } from '~navigation/Navigation';
import { roboto } from '~common/lib/font.helper';
import { authApi } from '~domains/auth/auth.api';
import { stores } from '~stores';
import { profileService } from '~domains/profile/profile.service';

export const SignInScreen = observeStores(
  'authStore',
  'appStore'
)(
  ({
    navigation,
    authStore,
    appStore
  }: {
    authStore: AuthStore;
    appStore: AppStore;
    navigation: NavigationContainerRef<AuthStackParamList>;
  }) => {
    const { t } = useTranslation();
    const [errors, setErrors] = useState([]);
    const [phoneError, setPhoneError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
    const [phone, setPhone] = useState(authStore.rememberedPhone || '');
    const [password, setPassword] = useState('');
    const [submitDisabled, setSubmitDisabled] = useState(true);

    const onChangeWrapper = (cb: (...args: any) => void | undefined) => {
      return (...args: any[]) => {
        errors.length && setErrors([]);
        passwordError && setPasswordError(false);
        phoneError && setPhoneError(false);
        cb && cb(...args);
      };
    };

    const handleSubmit = async () => {
      appStore.setLoading(true);
      setErrors([]);
      await authApi
        // @ts-ignore 'signUpUrl' is expected to be set on the moment when this function is called
        .signInByPhone(stores.sessionStore.signInUrl, {
          password,
          phone
        })
        .then((res) => authService.setAuthToken(res.data))
        .then(() => authService.setRememberedPhone(phone))
        .then(() => sessionService.update())
        .catch((e) => {
          setPhoneError(true);
          setPasswordError(true);
          setErrors([t('login.authError')]);
          log.err(e);
        })
        .finally(() => {
          appStore.setLoading(false);
        });
    };

    const schema = useMemo(
      () =>
        object({
          password: string().required(),
          phone: string().required()
        }),
      []
    );

    useEffect(() => {
      try {
        schema.validateSync({
          password,
          phone
        });
        setSubmitDisabled(false);
      } catch (e) {
        setSubmitDisabled(true);
      }
    }, [password, phone, schema]);

    const onPhoneChanged = (value: string) => {
      setPhone(sanitizePhoneNumber(value));
    };

    return (
      <AuthLayout
        footerQuestion={t('login.dontHaveAcc')}
        footerActionText={t('common.signUp')}
        onFooterButtonClick={() => {
          navigation.navigate('SignUp');
        }}
        title={t('login.title')}
        titleViewStyle={{
          paddingBottom: nh(68)
        }}
      >
        <AuthInput
          placeholder={t('common.phone')}
          onChangeText={onChangeWrapper(onPhoneChanged)}
          value={phone}
          hasError={phoneError}
          style={{
            marginTop: nh(46)
          }}
        />
        <AuthInput
          style={styles.password}
          placeholder={t('common.password')}
          onChangeText={onChangeWrapper(setPassword)}
          secureTextEntry={true}
          hasError={passwordError}
          value={password}
        />
        {errors && (
          <View style={styles.errorContainer}>
            {errors.map((err, i) => (
              <Text key={i} style={styles.errorText}>
                {err}
              </Text>
            ))}
          </View>
        )}
        <View style={styles.forgot}>
          <Text>{t('login.forgotPassword')}</Text>
        </View>
        <TextButton
          disabled={submitDisabled}
          onPress={handleSubmit}
          containerStyle={{
            marginTop: nh(29)
          }}
        >
          Log In
        </TextButton>
      </AuthLayout>
    );
  }
);

export const styles = StyleSheet.create({
  password: {
    marginTop: nh(16)
  },
  forgot: {
    marginTop: nh(38),
    alignItems: 'flex-end',
    fontFamily: roboto(400)
  },
  footer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: nh(23)
  },
  footerText: {
    fontSize: nh(16)
  },
  footerLink: {
    color: FOOTER_LINK_COLOR,
    fontSize: nh(16)
  },
  errorContainer: {
    marginTop: nh(16)
  },
  errorText: {
    color: ERROR_TEXT_COLOR
  }
});
