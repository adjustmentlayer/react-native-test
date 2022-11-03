import React, { useEffect, useRef, useState } from 'react';
import {
  AuthLayout,
  AuthLayoutHandle,
  ERROR_TEXT_COLOR
} from '~common/components/AuthLayout';
import { nh } from '~common/lib/normalize.helper';
import { StyleSheet, View } from 'react-native';
import { Text } from '~common/components/Text';
import { AuthInput } from '~domains/auth/components/AuthInput';
import { TextButton } from '~common/components/TextButton';
import { profileService, authService } from '~services';
import { authApi } from '~domains/auth/auth.api';
import { useTranslation } from 'react-i18next';
import { roboto } from '~common/lib/font.helper';

const validateEmail = (email: string) => {
  return String(email)
    .toLowerCase()
    .match(
      /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/
    );
};

export const SaveEmailScreen = () => {
  const { t } = useTranslation();
  const ref = useRef<AuthLayoutHandle>(null);
  const handleRefresh = () => {
    profileService.loadProfile().finally(() => {
      ref.current?.setRefreshing(false);
    });
  };
  const [errors, setErrors] = useState<string[]>([]);
  const [email, setEmail] = useState('');
  const [submitDisabled, setSubmitDisabled] = useState(true);

  const handleSubmit = async () => {
    ref.current?.setRefreshing(true);
    setErrors([]);
    const valid = validateEmail(email);
    if (!valid) {
      setErrors(['The email must be a valid email address.']);
      ref.current?.setRefreshing(false);
    }

    valid &&
      authApi
        .updateEmail(email)
        .then(() => {
          handleRefresh();
        })
        .catch((e) => {
          const { data } = e.response;
          ref.current?.setRefreshing(false);
          if (data.indexOf('email in use') > -1) {
            setErrors([
              'This email has already been taken. Please try another.'
            ]);
            return;
          }
          setErrors([t('errors.smthWentWrong')]);
        });
  };

  useEffect(() => {
    if (email.length > 0) {
      setSubmitDisabled(false);
    } else {
      setSubmitDisabled(true);
    }
  }, [email]);

  return (
    <AuthLayout
      onRefresh={handleRefresh}
      refreshControlEnabled={true}
      ref={ref}
      hasLogo={false}
      footerActionText={'Logout'}
      onFooterButtonClick={() => {
        authService.logout();
      }}
      TitleComp={() => {
        return (
          <View
            style={{
              marginBottom: nh(31)
            }}
          >
            <Text style={styles.titleText}>Save email address</Text>
            <Text
              style={{
                marginTop: nh(11)
              }}
            >
              Please provide your email address
            </Text>
          </View>
        );
      }}
    >
      <AuthInput
        hasError={!!errors.length}
        placeholder={'Email'}
        value={email}
        onChangeText={(text: string) => {
          setEmail(text.trim());
        }}
        style={{
          marginTop: nh(115)
        }}
      />
      {!!errors.length && (
        <View style={styles.errorContainer}>
          {errors.map((err, i) => (
            <Text key={i} style={styles.errorText}>
              {err}
            </Text>
          ))}
        </View>
      )}
      <TextButton
        onPress={handleSubmit}
        disabled={submitDisabled}
        containerStyle={{
          marginTop: nh(51)
        }}
      >
        Submit
      </TextButton>
    </AuthLayout>
  );
};

export const styles = StyleSheet.create({
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
