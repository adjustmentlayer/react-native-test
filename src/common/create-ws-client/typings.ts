import { Emitter } from '~common/event-emitter';

type SocketStatus =
  | 'disconnected'
  | 'connecting'
  | 'connected'
  | 'failed'
  | 'destroyed';

type LogTypes = 'warn' | 'debug' | 'log' | 'error';

type WSClientEventMap = {
  onsend: ConfigWithId;
  onopen: null;
  onfail: {
    msg: string;
  };
  subscriptiondeleted: {
    msg: Message;
  };
  statuschanged: {
    status: SocketStatus;
  };
  subscriptiondeletederror: {
    msg: Message;
  };
};

type Config = {
  type: string;
  callback?: (body: any, message: any) => void;
  throttleInterval?: number;
  timeout?: NodeJS.Timeout;
  pollingIntervalMS?: number;
  handleType?: string;
  debug?: boolean;
  onSend?: (config: ConfigWithId) => void;
  isTickingType?: boolean;
};

type ConfigWithId = Config & {
  id: number;
};

type Message = {
  id: number;
  type: string;
};

type Logger = (args: any[], type: LogTypes) => void;

type Opts = {
  name: string;
  logger: Logger;
  debug: boolean;
  pollingTimeIntervalMS: number;
  maxFailures: number;
  silenceTimeoutMS: number;
  maxReconnects: number;
  reconnectTimeoutMS: number;
};

type UserOpts = Partial<Opts>;

type WSClient = {
  init: () => void;
  unsubscribe: () => void;
  fail: (msg: string) => void;
  destroy: () => void;
  clearFailedMsgs: () => void;
  resendFailed: () => void;
  changeStatus: (status: SocketStatus) => void;
  send: (config: Config) => ConfigWithId;
  sendMessage: (msg: Message, config: ConfigWithId) => void;
  sendSubscribeMessage: (
    config: Config,
    addToSubscriptionList?: boolean
  ) => ConfigWithId | undefined;
  onOpen: () => void;
  onClose: () => void;
  onMessage: (event: WebSocketMessageEvent) => void;
  deleteSubscription: (msg: Message) => void;
  addHandler: (config: ConfigWithId) => void;
  onSubscribe: (config: Config) => ConfigWithId | undefined;
  isOpen: () => boolean;
  getOpt: (key: keyof Opts) => any;
  emitter: Emitter<WSClientEventMap>;
};

export type {
  UserOpts,
  Logger,
  Message,
  ConfigWithId,
  Config,
  LogTypes,
  SocketStatus,
  Opts,
  WSClientEventMap,
  WSClient
};
