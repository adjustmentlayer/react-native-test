import { stores } from '~stores';
import { profileApi } from './profile.api';
const { profileStore } = stores;

export const profileService = {
  async loadProfile() {
    profileStore.setLoading(true);
    return profileApi
      .getProfile()
      .then((res) => {
        profileStore.setData(res.data);
        profileStore.setLoaded(true);
      })
      .finally(() => profileStore.setLoading(false));
  },

  unloadProfile() {
    profileStore.setLoaded(false);
    profileStore.setData(null);
  }
};
