import { stores } from '~stores';
import { ConfirmCodeProps, authApi } from './auth.api';
import { sessionService, walletService } from '~services';
import { persistentStorage } from '~common/services/persistent-storage.service';
import {
  AUTH_TOKEN,
  REMEMBERED_PHONE
} from '~domains/auth/constants/storage.constants';
const { authStore, profileStore } = stores;

export const authService = {
  async init() {
    await persistentStorage.get(AUTH_TOKEN, false, (_, result) => {
      this.setAuthToken(result);
    });
    await persistentStorage.get(REMEMBERED_PHONE, false, (_, result) => {
      this.setRememberedPhone(result);
    });
  },
  async signUpByPhone(phone: string) {
    return (
      authApi
        // @ts-ignore 'signUpUrl' is expected to be set on the moment when this function is called
        .signUpByPhone(stores.sessionStore.signUpUrl, phone)
        .then(async (res) => {
          if (res.data) {
            await authStore.setConfirmId(res.data);
          }
          return Promise.resolve(res);
        })
    );
  },
  resendCode(phone: string) {
    return (
      authApi
        // @ts-ignore 'signUpUrl' is expected to be set on the moment when this function is called
        .resendCode(stores.sessionStore.signUpUrl, phone)
        .then(async (res) => {
          if (res.data) {
            await authStore.setConfirmId(res.data);
          }
          return Promise.resolve(res);
        })
    );
  },
  async confirmPhone({ code, confirmId }: ConfirmCodeProps) {
    return (
      authApi
        // @ts-ignore 'signUpUrl' is expected to be set on the moment when this function is called
        .confirmPhone(stores.sessionStore.signUpUrl, {
          confirmId,
          code
        })
        .then((res) => this.setAuthToken(res.data))
    );
  },
  async savePassword(password: string) {
    return (
      authApi
        // @ts-ignore 'signInUrl' is expected to be set on the moment when this function is called
        .savePassword(stores.sessionStore.signInUrl, {
          password
        })
    );
  },
  async logout() {
    await sessionService.setAuthToken(null);
    await sessionService.setAppToken(null);
    await walletService.setAccessToken(null);
    await sessionService.update();
    stores.walletStore.setAccountModels([]);
    profileStore.setData(null);
  },
  async setAuthToken(token?: string | null) {
    return await persistentStorage.set(AUTH_TOKEN, token, false, () =>
      authStore.setAuthToken(token)
    );
  },
  async setRememberedPhone(phone?: string | null) {
    return await persistentStorage.set(REMEMBERED_PHONE, phone, false, () =>
      authStore.setRememberedPhone(phone)
    );
  }
};
