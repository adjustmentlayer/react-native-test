import { makeAutoObservable } from 'mobx';

export class AuthStore {
  initialized = false;
  rememberedPhone?: string | null = null;
  confirmId: string | null = null;
  authToken?: string | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  setAuthToken(authToken?: string | null) {
    this.authToken = authToken;
  }

  setRememberedPhone = (phone?: string | null) => {
    this.rememberedPhone = phone;
  };

  setInitialized = (state: boolean) => {
    this.initialized = state;
  };

  setConfirmId = (id: string) => {
    this.confirmId = id;
  };
}
