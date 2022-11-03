import React, { useEffect, useRef, useState } from 'react';
import { AuthLayout, ERROR_TEXT_COLOR } from '~common/components/AuthLayout';
import { nh } from '~common/lib/normalize.helper';
import { Text } from '~common/components/Text';
import {
  Alert,
  Image,
  Linking,
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native';
import { AuthInput } from '../../components/AuthInput';
import { TextButton } from '~common/components/TextButton';
import { Checkbox } from '~common/components/Checkbox';
import { CheckboxHandle } from '~common/components/Checkbox';
import { authService, sessionService } from '~services';
import { log } from '~common/lib/logging.helper';
import { sanitizePhoneNumber } from '~common/utils';
import { useTranslation } from 'react-i18next';
import { NavigationContainerRef } from '@react-navigation/native';
import { AuthStackParamList } from '~navigation/Navigation';
import { roboto } from '~common/lib/font.helper';

export const SignUpScreen = ({
  navigation
}: {
  navigation: NavigationContainerRef<AuthStackParamList>;
}) => {
  const privacyPolicyCheckboxRef = useRef<CheckboxHandle>(null);
  const notCitizenCheckboxRef = useRef<CheckboxHandle>(null);
  const [errors, setErrors] = useState([]);
  const [submitDisabled, setSubmitDisabled] = useState(true);
  const [acceptedTerms, setAcceptedTerms] = useState([false, false]);
  const [phone, setPhone] = useState('');
  const { t } = useTranslation();
  const [isQuestCompleted, setIsQuestCompleted] = useState(false);

  useEffect(() => {
    setSubmitDisabled(!(acceptedTerms[0] && acceptedTerms[1] && phone));
  }, [acceptedTerms, phone]);

  useEffect(() => {
    if (isQuestCompleted) {
      //todo: create method to remove the session
      sessionService.getOrCreate('dummysession');
      Alert.alert('updating session');
    }
  }, [isQuestCompleted]);

  const handleSubmit = async () => {
    setErrors([]);
    await authService
      .signUpByPhone(phone)
      .then(() => {
        navigation.navigate('AuthOtp', {
          phone
        });
      })
      .catch((e) => {
        setErrors([t('errors.smthWentWrong')]);
        log.err(e.message);
      });
  };

  const onPhoneChanged = (value: string) => {
    if (__DEV__) {
      if (value === '+987654321123456789' && !isQuestCompleted) {
        setIsQuestCompleted(true);
      }
    }
    setPhone(sanitizePhoneNumber(value));
  };

  return (
    <View style={{ flex: 1 }}>
      <AuthLayout
        footerQuestion={'Have an account?'}
        footerActionText={'Log In'}
        onFooterButtonClick={() => {
          navigation.navigate('SignIn');
        }}
        TitleComp={() => {
          return (
            <View>
              <Text style={styles.titleText}>
                Trade instantly with{' '}
                <Text style={[styles.titleText, styles.textWithAccent]}>
                  1,000
                </Text>
                {'\n'}
                USD on demo account 🚀
              </Text>
            </View>
          );
        }}
      >
        {/*<PhoneInput
            defaultCountryCode={"IN"}
            onChangeFormattedText={onPhoneChanged}
            containerStyle={{
            marginTop: nh(80)
        }}/>*/}
        <AuthInput
          hasError={errors.length > 0}
          placeholder={'Phone'}
          value={phone}
          onChangeText={onPhoneChanged}
          style={{
            marginTop: nh(80)
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
        <Checkbox
          onChange={({ selected }) => {
            setAcceptedTerms([selected, acceptedTerms[1]]);
          }}
          ref={privacyPolicyCheckboxRef}
          containerStyle={{
            marginTop: nh(32)
          }}
        >
          <View
            style={{
              flexDirection: 'row'
            }}
          >
            <Text style={styles.checkboxText}>I accept </Text>
            <TouchableOpacity
              onPress={() => {
                Linking.openURL(
                  'https://rock-west.com/storage/app/media/legal_documents/client_services_agreement.pdf'
                );
              }}
            >
              <Text style={[styles.checkboxText, styles.checkboxLink]}>
                Client Services Agreement
              </Text>
            </TouchableOpacity>
            <Text style={styles.checkboxText}> and </Text>
            <TouchableOpacity
              onPress={() => {
                Linking.openURL(
                  'https://rock-west.com/storage/app/media/legal_documents/privacy_policy.pdf'
                );
              }}
            >
              <Text style={[styles.checkboxText, styles.checkboxLink]}>
                Privacy Policy
              </Text>
            </TouchableOpacity>
          </View>
        </Checkbox>
        <Checkbox
          onChange={({ selected }) => {
            setAcceptedTerms([acceptedTerms[0], selected]);
          }}
          ref={notCitizenCheckboxRef}
          containerStyle={{
            marginTop: nh(12)
          }}
        >
          <Text style={styles.checkboxText}>
            I am not a citizen or resident of the United States of America
          </Text>
        </Checkbox>
        <TextButton
          onPress={handleSubmit}
          disabled={submitDisabled}
          containerStyle={{
            marginTop: nh(47)
          }}
        >
          Sign Up
        </TextButton>
      </AuthLayout>
    </View>
  );
};

const ACCENT_TEXT_COLOR = '#2BD700';

export const styles = StyleSheet.create({
  titleText: {
    fontSize: nh(22),
    fontFamily: roboto(400),
    lineHeight: nh(31)
  },
  forgot: {
    marginTop: nh(29),
    alignItems: 'flex-end',
    fontFamily: roboto(400)
  },
  checkboxText: {
    fontSize: nh(11)
  },
  checkboxLink: {
    textDecorationLine: 'underline'
  },
  errorContainer: {
    marginTop: nh(16)
  },
  errorText: {
    color: ERROR_TEXT_COLOR
  },
  textWithAccent: {
    color: ACCENT_TEXT_COLOR,
    fontFamily: roboto(700)
  }
});
