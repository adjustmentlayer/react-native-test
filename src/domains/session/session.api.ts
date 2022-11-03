import { tradingClient } from '~common/services/api-clients.service';
import { AxiosResponse } from 'axios';

export type SessionResponse = {
  app_token: string;
  app_guid: string;
  is_authorized: boolean;
  is_authorised: boolean;
  login_url: string;
  registration_url: string;
  signup_url: string;
  signin_url: string;
  is_registered: boolean;
};

export type ProbablyAuthorizedSessionResponse = SessionResponse & {
  auth_token?: string;
  user_guid?: string;
};

export type CreateSessionRequestData = {
  app_session: any;
  claims: any;
};

export const sessionApi = {
  get(
    appToken: string
  ): Promise<AxiosResponse<ProbablyAuthorizedSessionResponse>> {
    return tradingClient.get(`session/${appToken}`);
  },
  create(
    data: CreateSessionRequestData
  ): Promise<AxiosResponse<SessionResponse>> {
    return tradingClient.post('session', data);
  }
};
