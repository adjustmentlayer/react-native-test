/**
 * @file contains classes of custom errors
 */
import * as Sentry from '@sentry/react-native';
import { severityLevelFromString } from '@sentry/utils';

import { log } from './logging.helper';

const handleConstructorParam = (param: any) => {
  if (param instanceof Error) {
    return String(param);
  }
  return param;
};

const isHTTPError = (error: any) => !!error.url;

const isErrorChild = (obj: any) => {
  if (obj instanceof Error) {
    return true;
  }
  if (obj.prototype) {
    isErrorChild(obj.prototype);
  } else {
    return obj instanceof Error;
  }
  return false;
};

class WError extends Error {
  url;
  method;
  params;
  constructor(
    payload: any,
    url = undefined,
    method = undefined,
    params = undefined
  ) {
    const msg = handleConstructorParam(payload);
    super(msg);
    if (isHTTPError(payload)) {
      this.url = payload.url;
      this.method = payload.method;
      this.params = payload.params;
    } else {
      this.url = url;
      this.method = method;
      this.params = params;
    }
  }
}

export class HTTPError extends WError {
  constructor(msg: any, url: any, method: any, params: any) {
    super(msg, url, method, params);
    this.name = 'HTTPError';
  }
}
export class IntegrationError extends WError {
  constructor(msg: any) {
    super(`IntegrationError: ${msg}`);
    this.name = 'IntegrationError';
  }
}

export class KYCError extends IntegrationError {
  constructor(msg: any) {
    super(`KYCError: ${msg}`);
    this.name = 'KYCError';
  }
}
export class SocketError extends WError {
  constructor(msg: any) {
    super(msg);
    this.name = 'SocketError';
  }
}

export class ConnectionError extends SocketError {
  constructor(msg: any) {
    super(`ConnectionError: ${msg}`);
    this.name = 'ConnectionError';
  }
}

export class BackendError extends SocketError {
  constructor(msg: any) {
    super(msg);
    this.name = 'BackendError';
  }
}

export class InfrastructureError extends WError {
  details;
  constructor(msg: any, details: any) {
    super(msg);
    this.name = 'InfrastructureError';
    this.details = details;
  }
}
export class QAError extends WError {
  constructor(msg: any) {
    super(msg);
    this.name = 'QAError';
  }
}

export class AuthError extends WError {
  constructor(msg: any) {
    super(msg);
    this.name = 'AuthError';
  }
}

export class BonusError extends WError {
  constructor(msg: any) {
    super(msg);
    this.name = 'BonusError';
  }
}

export class PaymentError extends WError {
  constructor(msg: any) {
    super(msg);
    this.name = 'PaymentError';
  }
}

export const captureError = (err: any, needToThrow = false) => {
  let strError = '';
  if (isErrorChild(err)) {
    const props = Object.getOwnPropertyNames(err);
    strError = `${JSON.stringify(err, props)}`;
  } else {
    strError = err;
  }
  log.error(strError);
  Sentry.captureException(err, (scope) => {
    // to pass through Sentry's alert criterias (need to be tag)
    if (isErrorChild(err)) {
      scope.setTag('exceptionType', err.name);
    }
    return scope;
  });
  if (needToThrow) {
    throw err;
  }
};

export const captureMessage = (err: any) => {
  let strError = '';
  if (isErrorChild(err)) {
    strError = JSON.stringify(err, Object.getOwnPropertyNames(err));
  } else {
    strError = err;
  }
  log.info(strError);
  Sentry.captureMessage(strError, severityLevelFromString('info'));
};
