import { Platform } from 'react-native';
import { stores } from '~stores';
import { log } from '~common/lib/logging.helper';
import { ProbablyAuthorizedSessionResponse, sessionApi } from './session.api';
import DeviceInfo from 'react-native-device-info';
import { AxiosResponse } from 'axios';
import { persistentStorage } from '~common/services/persistent-storage.service';
import { APP_TOKEN, AUTH_TOKEN } from '~domains/session/session.constants';

const { sessionStore } = stores;

export const sessionService = {
  async init() {
    await persistentStorage.get(APP_TOKEN, false, (_, result) => {
      this.setAppToken(result);
    });
    await persistentStorage.get(AUTH_TOKEN, false, (_, result) => {
      this.setAuthToken(result);
    });

    return this.update();
  },
  async update(sessionToRestore?: string | null) {
    const appToken = sessionToRestore
      ? sessionToRestore
      : sessionStore.appToken;
    return sessionService
      .getOrCreate(appToken)
      .then(this.handleSessionResponse);
  },
  getOrCreate(
    appToken?: string | null
  ): Promise<AxiosResponse<ProbablyAuthorizedSessionResponse>> {
    if (appToken) {
      return this.get(appToken);
    } else {
      return this.create();
    }
  },
  create(): Promise<AxiosResponse<ProbablyAuthorizedSessionResponse>> {
    const data = {
      app_session: {},
      claims: {
        fingerprint: `${DeviceInfo.getVersion()}-${DeviceInfo.getBuildNumber()}-${
          Platform.OS
        }`
      }
    };
    return sessionApi.create(data).then((res) => {
      log.debug(`session has been created ${JSON.stringify(res.data)}`);
      return Promise.resolve(res);
    });
  },
  async get(
    appToken: string
  ): Promise<AxiosResponse<ProbablyAuthorizedSessionResponse>> {
    try {
      const res = await sessionApi.get(appToken);
      log.dbg('session has been received', res.data);
      return Promise.resolve(res);
    } catch (e: unknown) {
      log.err(
        `could not get session by token [${appToken}] -> token is probably expired or corrupted -> recreating it`
      );
      const res = await this.create();
      return Promise.resolve(res);
    }
  },

  async handleSessionResponse(
    res: AxiosResponse<ProbablyAuthorizedSessionResponse>
  ): Promise<AxiosResponse<ProbablyAuthorizedSessionResponse>> {
    const { auth_token = null } = res.data;
    await sessionService.setAuthToken(auth_token);
    await sessionService.setAppToken(res.data.app_token);
    sessionStore.setData(res.data);
    return Promise.resolve(res);
  },
  async setAppToken(token?: string | null) {
    return await persistentStorage.set(APP_TOKEN, token, false, () =>
      sessionStore.setAppToken(token)
    );
  },
  async setAuthToken(token?: string | null) {
    return await persistentStorage.set(AUTH_TOKEN, token, false, () =>
      sessionStore.setAuthToken(token)
    );
  }
};
