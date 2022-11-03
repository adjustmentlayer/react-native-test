import { AuthStore } from '~domains/auth/auth.store';
import { WalletStore } from '~domains/wallet/wallet.store';
import { AppStore } from '~domains/app/app.store';
import { SessionStore } from '~domains/session/session.store';
import { ProfileStore } from '~domains/profile/profile.store';

const authStore = new AuthStore();
const appStore = new AppStore();
const walletStore = new WalletStore();
const sessionStore = new SessionStore();
const profileStore = new ProfileStore();

export const stores = {
  authStore,
  appStore,
  walletStore,
  sessionStore,
  profileStore
};
