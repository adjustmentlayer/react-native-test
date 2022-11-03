import { stores } from '~stores';
import { walletApi } from './wallet.api';
import {
  WALLET_PLATFORMS,
  WALLET_ACCOUNT_TYPES
} from './constants/general.constants';
import { reaction } from 'mobx';
import { AxiosResponse } from 'axios';
import { persistentStorage } from '~common/services/persistent-storage.service';
import { WALLET_ACCESS_TOKEN } from '~domains/wallet/constants/storage.constants';
import {
  AccountAttributes,
  WalletAccountPlatform,
  WalletAuthResponse
} from '~domains/wallet/typings';

const { walletStore } = stores;

export const walletService = {
  async init() {
    return await persistentStorage.get(
      WALLET_ACCESS_TOKEN,
      false,
      (_, result) => {
        this.setAccessToken(result);
      }
    );
  },
  async handleAuthResp(res: AxiosResponse<WalletAuthResponse>) {
    const { access_token } = res.data;
    await this.setAccessToken(access_token);
  },
  async signInOrSignUp(): Promise<
    AxiosResponse<WalletAuthResponse> | undefined
  > {
    try {
      const res = await walletApi.signIn();
      await this.handleAuthResp(res);
      return Promise.resolve(res);
    } catch (e: any) {
      const { error } = e.response.data;
      if (error === 'not found') {
        const res = await walletApi.signUp();
        await this.handleAuthResp(res);
        return Promise.resolve(res);
      }
    }
  },
  async logout() {
    await this.setAccessToken(null);
  },
  /**
   * get all accounts and then fetch additional info for every account
   * @param platform
   */
  async getFullAccounts(
    platform: WalletAccountPlatform
  ): Promise<{ data: AccountAttributes[] }> {
    return walletApi.getAccounts(platform).then((res) => {
      const promises = res.data.map(async (item) => {
        return walletApi.getAccount(
          item.external_id,
          item.account_type,
          platform
        );
      });
      return Promise.all(promises).then((accountResponses) => {
        const accounts = accountResponses.map((accountResponse, i) => {
          return {
            external_id: res.data[i].external_id,
            account_type: res.data[i].account_type,
            ...accountResponse.data
          };
        });
        return Promise.resolve({
          data: accounts
        });
      });
    });
  },
  async loadAccounts(platform: WalletAccountPlatform) {
    walletStore.setLoading(true);
    const res = await this.getFullAccounts(platform);
    walletStore.setAccountModels(res.data);
    walletStore.setLoading(false);
    return res.data;
  },
  async getAccountsOrCreateFirstOne(): Promise<AccountAttributes[]> {
    const accounts = await this.loadAccounts(WALLET_PLATFORMS.TRADING);
    if (!accounts.length) {
      await walletApi.createAccount(
        WALLET_ACCOUNT_TYPES.DEMO_MT5,
        WALLET_PLATFORMS.TRADING,
        {
          name: 'demo account'
        }
      );
      return await this.loadAccounts(WALLET_PLATFORMS.TRADING);
    }
    return accounts;
  },
  async setAccessToken(token?: string | null) {
    return persistentStorage.set(WALLET_ACCESS_TOKEN, token, false, () =>
      walletStore.setAccessToken(token)
    );
  }
};
