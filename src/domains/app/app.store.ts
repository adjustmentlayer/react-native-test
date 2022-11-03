import { makeAutoObservable } from 'mobx';

export class AppStore {
  constructor() {
    makeAutoObservable(this);
  }

  loading = false;

  setLoading = (state: boolean) => {
    this.loading = state;
  };
}
