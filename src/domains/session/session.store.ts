import { makeAutoObservable } from 'mobx';
import { ProbablyAuthorizedSessionResponse } from '~domains/session/session.api';

export class SessionStore {
  initialized = false;
  data: ProbablyAuthorizedSessionResponse | null = null;
  authToken?: string | null = null;
  appToken?: string | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  setInitialized = (state: boolean): void => {
    this.initialized = state;
  };

  setAppToken = (token?: string | null): void => {
    this.appToken = token;
  };

  setAuthToken = (token?: string | null): void => {
    this.authToken = token;
  };

  setData = (data: ProbablyAuthorizedSessionResponse): void => {
    this.data = data;
  };

  get isAuthorized(): boolean {
    return !!this.authToken;
  }

  get loginUrl(): string | undefined {
    return this.data?.login_url;
  }

  get registrationUrl(): string | undefined {
    return this.data?.registration_url;
  }

  get signInUrl(): string | undefined {
    return this.data?.signin_url;
  }

  get signUpUrl(): string | undefined {
    return this.data?.signup_url;
  }

  get appGuid(): string | undefined {
    return this.data?.app_guid;
  }

  get userGuid(): string | undefined {
    return this.data?.user_guid;
  }
}
