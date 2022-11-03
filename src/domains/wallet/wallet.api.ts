import {
  walletClient,
  unauthorizedWalletClient
} from '~common/services/api-clients.service';
import { AxiosResponse } from 'axios';
import {
  CreateWalletAccountRequestBody,
  CreateWalletAccountResponse,
  WalletAccountPlatform,
  WalletAccountResponse,
  WalletAccountsBriefResponse,
  WalletAccountType,
  WalletAuthResponse
} from '~domains/wallet/typings';

export const walletApi = {
  async getAccounts(
    platform: WalletAccountPlatform
  ): Promise<AxiosResponse<WalletAccountsBriefResponse>> {
    return walletClient.get(`user/platform/${platform}/accounts`);
  },

  async getAccount(
    id: string,
    type: WalletAccountType,
    platform: WalletAccountPlatform
  ): Promise<AxiosResponse<WalletAccountResponse>> {
    return walletClient.get(`user/platform/${platform}/accounts/${type}/${id}`);
  },

  async createAccount(
    type: WalletAccountType,
    platform: WalletAccountPlatform,
    data: CreateWalletAccountRequestBody
  ): Promise<AxiosResponse<CreateWalletAccountResponse>> {
    return walletClient.post(
      `user/platform/${platform}/accounts/${type}`,
      data
    );
  },

  async getStreamEndpoint(
    accountId: string,
    type: WalletAccountType,
    platform: WalletAccountPlatform
  ) {
    return walletClient(
      `user/platform/${platform}/accounts/${type}/${accountId}/stream`
    );
  },

  async signIn(): Promise<AxiosResponse<WalletAuthResponse>> {
    return unauthorizedWalletClient.post('sign-in');
  },

  async signUp(): Promise<AxiosResponse<WalletAuthResponse>> {
    return unauthorizedWalletClient.post('sign-up');
  }
};
