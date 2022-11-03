export type WalletAuthResponse = {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
};

export type WalletAuthRequestError = {
  error?: string;
};

export type CreateWalletAccountResponse = {
  external_id: string;
};

export type DemoMt5RequestBody = {
  name?: string;
  leverage?: number;
  trading_pass?: string;
  investor_pass?: string;
};

export type CreateWalletAccountRequestBody = DemoMt5RequestBody;

export type WalletAccountsBriefResponse = {
  account_type: WalletAccountType;
  external_id: string;
}[];

export type WalletAccountResponse = {
  balance: number;
  equity: number;
  floating: number;
  group: string;
  leverage: number;
  login: string;
  margin: number;
  margin_free: number;
  name: string;
  swap: number;
  type: 'default';
  is_archived?: boolean;
};

//todo: find out all possible values for WalletAccountResponse.type

export type WalletAccountType =
  | 'demo-mt5'
  | 'investor-mt5'
  | 'default-mt5'
  | 'master-mt5'
  | 'commission-mt5';
export type WalletAccountPlatform = string;

export type AccountAttributes = WalletAccountResponse & {
  external_id: string;
  account_type: WalletAccountType;
};

export type GetAccountResponseBody = {
  equity: number;
  balance: number;
  margin: number;
  free_margin: number;
};

export type GetServerTimeResponseBody = {
  time: number;
};

type SessionDay = {
  quote: Array<{
    open: string;
    close: string;
  }>;
  trade: Array<{
    open: string;
    close: string;
  }>;
};

export type Instrument = {
  calc_mode: number;
  commission_in: number;
  commission_out: number;
  contract_size: number;
  digits: number;
  hedged_margin: number;
  initial_margin: number;
  initial_margin_rate_buy: number;
  initial_margin_rate_sell: number;
  maintenance_margin: number;
  maintenance_margin_rate_buy: number;
  maintenance_margin_rate_sell: number;
  sessions: {
    friday: SessionDay;
    monday: SessionDay;
    saturday: SessionDay;
    sunday: SessionDay;
    thursday: SessionDay;
    tuesday: SessionDay;
    wednesday: SessionDay;
  };
  stops_level: number;
  symbol: string;
  symbol_group: string;
  tick_size: number;
  tick_value: number;
  trade_mode: number;
  volume_max: number;
  volume_min: number;
  volume_step: number;
};

export type FrontEndReadyInstrument = Instrument & {
  symbolWithoutExtension: string;
  fancySymbol: string;
  label: string;
};

export type Precision = Record<string, number>;

export type GetInstrumentsResponseBody = Array<Instrument>;
