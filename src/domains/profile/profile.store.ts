import { makeAutoObservable } from 'mobx';
import { ProfileData } from '~domains/profile/profile.api';

export class ProfileStore {
  data: ProfileData | null = null;
  loaded = false;
  loading = false;

  constructor() {
    makeAutoObservable(this);
  }

  get firstName() {
    return this.data?.first_name;
  }

  get lastName() {
    return this.data?.last_name;
  }

  get contacts() {
    return this.data?.contacts;
  }

  get registeredContacts() {
    return this.contacts?.registered;
  }

  get emails() {
    return this.registeredContacts?.filter(
      (contact) => contact?.provider_name === 'email'
    );
  }

  get hasEmail() {
    return !!this.emails?.length;
  }

  get phones() {
    return this.registeredContacts?.filter(
      (contact) => contact?.provider_name === 'phone'
    );
  }

  get emailContact() {
    return this.emails?.[0];
  }

  get hasConfirmedEmail() {
    return this.emailContact?.is_confirmed;
  }

  get email() {
    return this.emailContact?.user_key;
  }

  get phoneContact() {
    return this.phones?.[0];
  }

  get hasConfirmedPhone() {
    return this.phoneContact?.is_confirmed;
  }

  get phone() {
    return this.phoneContact?.user_key;
  }

  get canSignUpWalletAccount() {
    return (
      this.hasConfirmedEmail &&
      this.hasConfirmedPhone &&
      this.firstName &&
      this.lastName
    );
  }

  setData = (data: ProfileData | null) => {
    this.data = data;
  };

  setLoaded = (state: boolean) => {
    this.loaded = state;
  };

  setLoading = (state: boolean) => {
    this.loading = state;
  };
}
