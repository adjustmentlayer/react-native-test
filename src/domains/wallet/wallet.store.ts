import { action, makeAutoObservable } from 'mobx';
import { log } from '~common/lib/logging.helper';
import { createWsClient } from '~common/create-ws-client';
import { walletApi } from './wallet.api';
import { WALLET_PLATFORMS } from './constants/general.constants';
import { WSClient } from '~common/create-ws-client/typings';
import {
  AccountAttributes,
  FrontEndReadyInstrument,
  GetAccountResponseBody,
  GetInstrumentsResponseBody,
  GetServerTimeResponseBody,
  Precision
} from '~domains/wallet/typings';
import {
  PRICING_TYPES,
  TRADING_TYPES
} from '~domains/wallet/constants/socket.constants';
import {
  getFancySymbol,
  isInstrumentAllowed,
  removeSymbolExtension
} from '~domains/wallet/utils';

export class AccountModel {
  attributes: AccountAttributes;
  isStreamingInitialized = false;
  tradingSocket: WSClient | null = null;
  shiftTime: number | null = null;
  requestedTime: number | null = null;
  selectedSymbolName: string | null = null;
  frontEndReadyInstruments: FrontEndReadyInstrument[] = [];
  precision: Precision = {};
  constructor(attributes: AccountAttributes) {
    this.attributes = attributes;
    makeAutoObservable(this, {
      _handleAccount: action
    });
  }
  streamEndpoint: string | null = null;

  get accountType() {
    return this.attributes.account_type;
  }

  get type() {
    return this.attributes.type;
  }

  get id() {
    return this.attributes.external_id;
  }

  get leverage() {
    return this.attributes.leverage;
  }

  get login() {
    return this.attributes.login;
  }

  get name() {
    return this.attributes.name;
  }

  get margin() {
    return this.attributes.margin;
  }

  get marginFree() {
    return this.attributes.margin_free;
  }

  get balance() {
    return this.attributes.balance;
  }

  get accountTypeName() {
    return this.type.includes('demo') ? 'demo' : 'real';
  }

  _handleAccount(message: GetAccountResponseBody) {
    this.attributes.equity = message.equity;
    this.attributes.margin = message.margin;
    this.attributes.balance = message.balance;
    this.attributes.margin_free = message.free_margin;
  }

  _handleInstruments(message: GetInstrumentsResponseBody) {
    if (!message) {
      return;
    }
    this.setFrontendReadyInstruments([]);
    this.setPrecision({});
    const frontendReadyInstruments = message
      .map((instrument) => ({
        ...instrument,
        label: removeSymbolExtension(instrument.symbol),
        symbolWithoutExtension: removeSymbolExtension(instrument.symbol),
        fancySymbol: getFancySymbol(instrument.symbol)
      }))
      .filter(isInstrumentAllowed);

    const precision = frontendReadyInstruments.reduce(
      (acc, instrument) => ({
        ...acc,
        [instrument.symbolWithoutExtension]: instrument.digits
      }),
      {}
    );

    this.setFrontendReadyInstruments(frontendReadyInstruments);
    this.setPrecision(precision);

    return this.setSelectedSymbolName(
      frontendReadyInstruments?.[0]?.symbolWithoutExtension && 'EURUSD'
    );
  }

  async initStreaming() {
    if (this.isStreamingInitialized) {
      return;
    }
    const res = await walletApi.getStreamEndpoint(
      this.id,
      this.accountType,
      WALLET_PLATFORMS.TRADING
    );
    const streamEndpoint = res.data?.endpoints?.[0]?.endpoint;
    this.setStreamEndpoint(streamEndpoint);
    if (!this.streamEndpoint) {
      return;
    }

    this.setStreamingIsInitialized(true);

    this.tradingSocket = createWsClient(this.streamEndpoint, {
      name: `Account [${this.login}]`,
      debug: true,
      logger: (args, type) => {
        log[type](...args);
      }
    });

    this.tradingSocket.onSubscribe({
      type: TRADING_TYPES.GET_ACCOUNT,
      callback: (message: GetAccountResponseBody) =>
        this._handleAccount(message),
      pollingIntervalMS: 1000
    });

    this.tradingSocket.onSubscribe({
      type: PRICING_TYPES.GET_SERVER_TIME,
      callback: (message: GetServerTimeResponseBody) => {
        this.setShiftTime(message.time - this.requestedTime!);
        log.dbg('shiftTime', this.shiftTime);
      },
      onSend: () => {
        this.setRequestedTime(+new Date());
      }
    });

    this.tradingSocket.onSubscribe({
      type: PRICING_TYPES.GET_INSTRUMENTS,
      callback: (message: GetInstrumentsResponseBody) =>
        this._handleInstruments(message)
    });

    this.tradingSocket.init();
  }

  destroyStreaming() {
    if (this.isStreamingInitialized) {
      this.tradingSocket?.destroy();
    }
  }

  setStreamingIsInitialized(state: boolean) {
    this.isStreamingInitialized = state;
  }

  setStreamEndpoint = (url: string) => {
    this.streamEndpoint = url;
  };

  setShiftTime = (shift: number) => {
    this.shiftTime = shift;
  };

  setRequestedTime = (shift: number) => {
    this.requestedTime = shift;
  };

  setPrecision = (precision: Precision) => {
    return (this.precision = precision);
  };

  setSelectedSymbolName = (symbol: string) => {
    this.selectedSymbolName = symbol;
  };

  setFrontendReadyInstruments = (instruments: FrontEndReadyInstrument[]) => {
    this.frontEndReadyInstruments = instruments;
  };
}

export class WalletStore {
  initialized = false;
  accessToken?: string | null = null;
  refreshToken?: string | null = null;
  accountModels: any[] = [];
  loading = false;

  constructor() {
    makeAutoObservable(this);
  }

  setAccessToken = (token?: string | null) => {
    this.accessToken = token;
  };

  setRefreshToken = (token?: string | null) => {
    this.refreshToken = token;
  };

  setInitialized = (state: boolean) => {
    this.initialized = state;
  };

  setAccountModels = (accounts: any[]) => {
    this.accountModels = accounts.map((account) => {
      return new AccountModel(account);
    });
  };

  setLoading = (state: boolean) => {
    this.loading = state;
  };
}
