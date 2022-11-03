import { inject, observer } from 'mobx-react';
import { IReactComponent } from 'mobx-react/dist/types/IReactComponent';

function isPromise(p: any) {
  return typeof p === 'object' && typeof p?.then === 'function';
}

function isFunction(f: any) {
  return typeof f === 'function';
}

const observeStores = (...args: string[]) => {
  return (Component: IReactComponent) => {
    return inject(...args)(observer(Component));
  };
};

const resolvePromiseValue = async (v: any) => {
  return isPromise(v) ? await v : v;
};

const sanitizePhoneNumber = (value: string) => {
  value && value.charAt(0) !== '+' && (value = '+' + value);
  return value.replace(/[^0-9+]/g, '');
};

export {
  isPromise,
  isFunction,
  observeStores,
  resolvePromiseValue,
  sanitizePhoneNumber
};
