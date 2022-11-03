import { Platform } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { FXTR_BASE_URL } from '../constants/api.constants';
import { isFunction, resolvePromiseValue } from '../utils';
import { BASE_URL } from '~domains/wallet/constants/api.constants';
import { authService } from '~domains/auth/auth.service';
import { walletService } from '~services';
import { persistentStorage } from '~common/services/persistent-storage.service';
import { APP_TOKEN, AUTH_TOKEN } from '~domains/session/session.constants';
import { WALLET_ACCESS_TOKEN } from '~domains/wallet/constants/storage.constants';
const platform = Platform.OS === 'ios' ? 'iOS' : 'Android';
const userAgent = `Simp1e-App/${DeviceInfo.getVersion()}-${DeviceInfo.getBuildNumber()} (${platform})`;

const createClientFactory = ({ headers = {}, ...rest }) => {
  return axios.create({
    headers: {
      'content-type': 'application/json',
      'User-Agent': userAgent,
      ...headers
    },
    ...rest
  });
};

const walletClient = createClientFactory({
  baseURL: BASE_URL
});

const unauthorizedWalletClient = createClientFactory({
  baseURL: BASE_URL
});

const tradingClient = createClientFactory({
  baseURL: FXTR_BASE_URL
});

const pureClient = createClientFactory({});

const requestAuthInterceptorFactory = (
  value: any,
  headerKey: string,
  prefix = ''
) => {
  return async (config: AxiosRequestConfig) => {
    const resolvedValue = isFunction(value)
      ? await resolvePromiseValue(value())
      : await resolvePromiseValue(value);
    config.headers = {
      ...config.headers,
      [headerKey]: prefix + resolvedValue
    };
    return config;
  };
};

const tradingAuthRequestInterceptor = requestAuthInterceptorFactory(
  () => persistentStorage.get(APP_TOKEN),
  'X-Authorization'
);

const unauthorizedWalletAuthRequestInterceptor = requestAuthInterceptorFactory(
  () => persistentStorage.get(AUTH_TOKEN),
  'X-Auth-Token'
);

const walletAuthRequestInterceptor = requestAuthInterceptorFactory(
  () => persistentStorage.get(WALLET_ACCESS_TOKEN),
  'Authorization',
  'Bearer '
);

const responseSuccessInterceptor = (response: AxiosResponse) => {
  return response;
};

const _handleResponseError = (handelUnauthorizedErrorCallback: () => void) => {
  return (error: AxiosError) => {
    if (error.response) {
      if (error.response.data === 'unauthorized') {
        handelUnauthorizedErrorCallback();
      }

      const AUTH_ERROR_CODES = [401, 403];

      if (AUTH_ERROR_CODES.includes(error.response.status)) {
        handelUnauthorizedErrorCallback();
      }

      if (error.response.status >= 499) {
        // todo: handle 500+ error
      }
    }
    if (typeof error.response === 'undefined') {
      // todo: handle cors error
    }

    if (error.message === 'timeoutError') {
      // todo: handle timeout error
    }

    // todo: log error to sentry

    return Promise.reject(error);
  };
};

const responseErrorInterceptor = _handleResponseError(() => {
  authService.logout();
});

const walletResponseErrorInterceptor = _handleResponseError(() => {
  walletService
    .signInOrSignUp()
    .then(() => walletService.getAccountsOrCreateFirstOne());
});

const unauthorizedWalletResponseErrorInterceptor = _handleResponseError(
  () => {}
);

walletClient.interceptors.request.use(walletAuthRequestInterceptor);
walletClient.interceptors.response.use(
  responseSuccessInterceptor,
  walletResponseErrorInterceptor
);
unauthorizedWalletClient.interceptors.response.use(
  responseSuccessInterceptor,
  unauthorizedWalletResponseErrorInterceptor
);

tradingClient.interceptors.request.use(tradingAuthRequestInterceptor);
tradingClient.interceptors.response.use(
  responseSuccessInterceptor,
  responseErrorInterceptor
);
unauthorizedWalletClient.interceptors.request.use(
  unauthorizedWalletAuthRequestInterceptor
);

export { tradingClient, pureClient, walletClient, unauthorizedWalletClient };
