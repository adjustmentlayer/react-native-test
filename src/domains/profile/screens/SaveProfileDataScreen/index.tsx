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
import { authService } from '~domains/auth/auth.service';
import { profileApi } from '../../profile.api';
import { useTranslation } from 'react-i18next';
import { profileService } from '~services';
import { roboto } from '~common/lib/font.helper';
import { AuthStackParamList } from '~navigation/Navigation';

export const SaveProfileDataScreen = ({
  route: { params }
}: {
  route: {
    params: AuthStackParamList['SaveProfileData'];
  };
}) => {
  const { firstName: initialFirstName = '', lastName: initialLastName = '' } =
    params;
  const { t } = useTranslation();
  const [errors, setErrors] = useState([]);
  const [firstName, setFirstName] = useState(initialFirstName);
  const [lastName, setLastName] = useState(initialLastName);
  const [submitDisabled, setSubmitDisabled] = useState(true);
  const ref = useRef<AuthLayoutHandle>(null);
  const handleRefresh = () => {
    profileService.loadProfile().finally(() => {
      ref.current?.setRefreshing(false);
    });
  };

  const handleProfileDataSave = async () => {
    setErrors([]);
    ref.current?.setRefreshing(true);
    await profileApi
      .updateProfile({
        first_name: firstName,
        last_name: lastName
      })
      .then(() => profileService.loadProfile())
      .catch(() => setErrors([t('errors.smthWentWrong')]))
      .finally(() => ref.current?.setRefreshing(false));
  };

  useEffect(() => {
    if (lastName.length > 0 && firstName.length > 0) {
      setSubmitDisabled(false);
    } else {
      setSubmitDisabled(true);
    }
  }, [firstName, lastName]);

  return (
    <AuthLayout
      hasLogo={false}
      ref={ref}
      onRefresh={handleRefresh}
      refreshControlEnabled={true}
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
            <Text style={styles.titleText}>Fill out personal data</Text>
            <Text
              style={{
                marginTop: nh(11)
              }}
            >
              Please provide your personal data
            </Text>
          </View>
        );
      }}
    >
      <AuthInput
        hasError={!!errors.length}
        placeholder={'First name'}
        value={firstName}
        onChangeText={setFirstName}
        style={{
          marginTop: nh(46)
        }}
      />
      <AuthInput
        hasError={!!errors.length}
        placeholder={'Last name'}
        value={lastName}
        onChangeText={setLastName}
        style={{
          marginTop: nh(16)
        }}
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
      <TextButton
        onPress={handleProfileDataSave}
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
