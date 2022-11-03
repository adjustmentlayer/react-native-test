import { pureClient } from '~common/services/api-clients.service';
import { stores } from '~stores';
import { AxiosResponse } from 'axios';
import { persistentStorage } from '~common/services/persistent-storage.service';
import { AUTH_TOKEN } from '~domains/auth/constants/storage.constants';

type AuthToken = string;
type ConfirmCode = string;

export type ConfirmCodeProps = {
  confirmId: string;
  code: string;
};

type SavePasswordProps = {
  password: string;
};

export type SignInByPhoneProps = {
  password: string;
  phone: string;
};

const getBaseUrl = async () => {
  const host =
    process.env.NODE_ENV === 'staging' || process.env.NODE_ENV === 'development'
      ? 'https://stage.maiv.biz'
      : 'https://prod.maiv.biz';
  const authToken = stores.sessionStore.authToken;
  const appGuid = stores.sessionStore.appGuid;
  return `${host}/api/v1/registration/${authToken}/${appGuid}`;
};

export const authApi = {
  async signInByPhone(
    url: string,
    { password, phone }: SignInByPhoneProps
  ): Promise<AxiosResponse<AuthToken>> {
    return pureClient.post(url, {
      pass: password,
      phone
    });
  },
  async signUpByPhone(
    url: string,
    phone: string
  ): Promise<AxiosResponse<ConfirmCode>> {
    return pureClient.post(url, {
      phone
    });
  },
  async resendCode(
    url: string,
    phone: string
  ): Promise<AxiosResponse<ConfirmCode>> {
    return pureClient.post(url, {
      message: 'confirmation code: ',
      phone
    });
  },
  async confirmPhone(
    url: string,
    { confirmId, code }: ConfirmCodeProps
  ): Promise<AxiosResponse<AuthToken>> {
    return pureClient.put(url, {
      confirmID: confirmId,
      code
    });
  },
  async updateEmail(email: string): Promise<AxiosResponse> {
    const url = await getBaseUrl();
    return pureClient.post(`${url}/email`, {
      email
    });
  },
  async resendEmailConfirmationCode(email: string): Promise<AxiosResponse> {
    return this.updateEmail(email);
  },
  async makeEmailPrimary(id: string): Promise<AxiosResponse> {
    const url = await getBaseUrl();
    return pureClient.put(`${url}/email/${id}`);
  },
  async savePassword(
    url: string,
    { password }: SavePasswordProps
  ): Promise<AxiosResponse> {
    const authToken = await persistentStorage.get(AUTH_TOKEN);
    const headers = {
      ...(authToken && { 'X-Authorization': authToken })
    };
    return pureClient.put(
      url,
      {
        pass: password
      },
      {
        headers
      }
    );
  }
};
