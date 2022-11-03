import { tradingClient } from '~common/services/api-clients.service';
import { AxiosResponse } from 'axios';

export type ProfileDataUpdateData = {
  first_name?: string;
  last_name?: string;
  patronymic_name?: string;
  is_male?: boolean;
  region?: string;
  meta_data?: Record<string, any>;
};

type Provider = {
  provider_name: string;
  register_url: string;
};

type Registered = {
  id: number;
  is_confirmed: boolean;
  is_primary: boolean;
  provider_name: string;
  user_key: string;
};

export type ProfileData = {
  first_name: string;
  last_name: string;
  guid: string;
  is_swap_free: string;
  psp_list: Record<string, any>;
  patronymic_name: string;
  is_male: boolean;
  region: string;
  meta_data: Record<string, any>;
  contacts: {
    providers: Provider[];
    registered: Registered[];
  };
  languages: any;
  ratings: any;
  date_info: null;
};

export const profileApi = {
  async updateProfile(data: ProfileDataUpdateData) {
    return tradingClient.put('/profile', data);
  },
  async getProfile(): Promise<AxiosResponse<ProfileData>> {
    return tradingClient.get('/profile');
  }
};
