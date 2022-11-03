import {
  Config,
  ConfigWithId,
  Logger,
  Message,
  Opts,
  SocketStatus,
  UserOpts,
  WSClient,
  WSClientEventMap
} from './typings';
import { Emitter, eventEmitter } from '~common/event-emitter';

export const SocketConnectionStatuses = {
  Disconnected: 'disconnected',
  Connecting: 'connecting',
  Connected: 'connected',
  Failed: 'failed',
  Destroyed: 'destroyed'
} as const;

let uniqueId = 0;

const baseLogger: Logger = (args, type) => {
  console[type](...args);
};

const defaults: Opts = {
  name: 'WebSocket',
  maxFailures: 200,
  maxReconnects: 13,
  silenceTimeoutMS: 20000,
  reconnectTimeoutMS: 20000,
  debug: false,
  pollingTimeIntervalMS: 10000,
  logger: baseLogger
};

export function createWsClient(url: string, userOpts: UserOpts): WSClient {
  const id = uniqueId;
  uniqueId++;
  let messageId = 0;
  const emitter: Emitter<WSClientEventMap> = eventEmitter();
  let status: SocketStatus = SocketConnectionStatuses.Disconnected;
  const handlerMap: Record<number, any> = {};
  const throttleMap: Record<string, any> = {};
  const subscriptionsList: Config[] = [];
  let failedMsgs: Record<number, ConfigWithId> = {};
  let resetsCount = 0;
  let silenceTimer: NodeJS.Timeout | undefined;
  let reconnectTimer: NodeJS.Timeout | undefined;
  let instance: WebSocket | null = null;
  const opts: Opts | null = Object.assign({}, defaults, userOpts);
  const prefix = `Instance #${id}. ${getOpt('name')}`;
  const logger = getOpt('logger');

  function init() {
    changeStatus(SocketConnectionStatuses.Connecting);
    unsubscribe();
    reconnectTimer = setTimeout(() => {
      fail(
        `WS has not been connected for almost ${
          getOpt('reconnectTimeoutMS') / 1000
        } secs, trying to reconnect.`
      );
    }, getOpt('reconnectTimeoutMS'));

    instance = new WebSocket(url);
    instance.onopen = onOpen;
    instance.onclose = onClose;
    instance.onmessage = onMessage;
    instance.onerror = unsubscribe;
    return instance;
  }

  function unsubscribe() {
    if (instance) {
      clearTimeout(silenceTimer);
      _log('closing WS connection with good reason');
      instance.close(1000);
    }
  }

  function fail(msg: string) {
    _error(msg);
    unsubscribe();
    emitter!.emit('onfail', {
      msg
    });
  }

  function destroy() {
    _log('destroying socket connection');
    changeStatus(SocketConnectionStatuses.Destroyed);
    unsubscribe();
    instance = null;
    clearFailedMsgs();
    subscriptionsList.length = 0;
    // clear all timeouts
    Object.keys(handlerMap).forEach((id) => {
      clearTimeout(handlerMap[+id].timeout);
    });
  }

  function clearFailedMsgs() {
    failedMsgs = {};
  }

  function resendFailed() {
    Object.values(failedMsgs).forEach(send);
  }

  function send(config: Config) {
    const configWithId = {
      ...config,
      id: messageId
    };
    messageId++;
    if (!isOpen()) {
      _log(`push to msg queue, no connection ${messageId}`);
      const foundInSubs = subscriptionsList.findIndex(
        (el) => JSON.stringify(el) === JSON.stringify(config)
      );
      if (!foundInSubs) {
        failedMsgs[messageId] = configWithId;
      }
      return configWithId;
    }

    const message = {
      id: configWithId.id,
      type: config.type
    };

    let throttle = throttleMap[config.type];
    if (!throttle) throttle = throttleMap[config.type] = {};
    // send only if its not blocked by self made throttle
    if (
      !config.throttleInterval ||
      (config.throttleInterval && throttle && !throttle?.value)
    ) {
      addHandler(configWithId);
      sendMessage(message, configWithId);
    }

    if (config.throttleInterval && !throttle?.value) {
      throttle.value = true;
      throttle.timeout = setTimeout(() => {
        throttle.value = false;
      }, config.throttleInterval);
    }

    return configWithId;
  }

  function sendMessage(msg: Message, config: ConfigWithId) {
    const { onSend } = config;
    try {
      if (!instance) {
        _error('socket is not connected');
        return;
      }
      instance!.send(JSON.stringify(msg));
      onSend && onSend(config);
      emitter!.emit('onsend', config);
      if (config?.debug) {
        _log('we have sent a message', msg);
      }
    } catch (e) {
      _error('sending error: ', e);
      failedMsgs[messageId] = config;
    }
  }

  function sendSubscribeMessage(config: Config, addToSubscriptionList = false) {
    if (addToSubscriptionList) {
      subscriptionsList.push(config);
    }

    const { pollingIntervalMS } = config;

    if (!isOpen()) {
      return;
    }

    if (pollingIntervalMS) {
      config.timeout = setTimeout(
        () => sendSubscribeMessage(config, false),
        config.pollingIntervalMS || getOpt('pollingTimeIntervalMS')
      );
    }

    return send(config);
  }

  function onOpen() {
    changeStatus(SocketConnectionStatuses.Connected);
    subscriptionsList.forEach((config) => {
      sendSubscribeMessage(config);
    });
    resendFailed();
    emitter!.emit('onopen', null);
    resetsCount = 0;
    clearTimeout(reconnectTimer);
  }

  function onClose() {
    if (status === SocketConnectionStatuses.Destroyed) {
      return;
    }

    if (resetsCount >= getOpt('maxFailures')) {
      fail(`WebSocket failed to reconnect ${getOpt('maxFailures')} times.`);
      clearFailedMsgs();
      return;
    }

    changeStatus(SocketConnectionStatuses.Disconnected);
    if (resetsCount >= getOpt('maxReconnects')) {
      changeStatus(SocketConnectionStatuses.Failed);
      _warn(
        `WebSocket tried to reconnect ${getOpt(
          'maxReconnects'
        )} times, but no success.`
      );

      clearFailedMsgs();
      return;
    }

    reconnectTimer = setTimeout(() => {
      _log(`reconnecting to ws after ${resetsCount} seconds...`);
      init(); // retry connection
      resetsCount++;
    }, 1000 * resetsCount);
  }

  function onMessage(event: WebSocketMessageEvent) {
    try {
      const message = JSON.parse(event.data);
      const messageType = message.type;
      const id = message.id;
      const config: ConfigWithId = handlerMap[id];

      if (config?.debug) {
        _log('we have received a message', message);
      }

      if (config && config.callback && !config.handleType) {
        config.callback(message.body, message);
      } else {
        Object.values(handlerMap).forEach((config: ConfigWithId) => {
          if (messageType === config.handleType && config.callback) {
            config.callback(message.body, message);
          }
        });
      }

      clearTimeout(silenceTimer);
      silenceTimer = setTimeout(() => {
        fail(
          `WS was silent for almost ${
            getOpt('silenceTimeoutMS') / 1000
          } secs, closing connection.`
        );
      }, getOpt('silenceTimeoutMS'));

      if (config && !config?.isTickingType) {
        delete handlerMap[id];
      }
    } catch (e) {
      _log(`event data`, event.data);
      _error(e);
    }
  }

  function deleteSubscription(msg: Message) {
    try {
      const { id, ...msgWithoutId } = msg;
      const foundMsgIdx = subscriptionsList.findIndex(
        (el) => JSON.stringify(el) === JSON.stringify(msgWithoutId)
      );
      if (foundMsgIdx >= 0) {
        if (subscriptionsList[foundMsgIdx].timeout)
          clearTimeout(subscriptionsList[foundMsgIdx].timeout);
        subscriptionsList.splice(foundMsgIdx, 1);
        emitter!.emit('subscriptiondeleted', {
          msg
        });
      } else {
        _log('this.subscriptionsList', JSON.stringify(subscriptionsList));
      }
    } catch (error) {
      emitter!.emit('subscriptiondeletederror', {
        msg
      });
    }
  }

  function addHandler(config: ConfigWithId) {
    handlerMap[config.id] = config;
  }

  function onSubscribe(config: Config) {
    return sendSubscribeMessage(config, true);
  }

  function isOpen() {
    return status === SocketConnectionStatuses.Connected;
  }

  function _log(...args: any[]) {
    if (getOpt('debug')) {
      logger([`[${prefix}]`, ...args], 'log');
    }
  }

  function _error(...args: any[]) {
    logger([`[${prefix}]`, ...args], 'error');
  }

  function _warn(...args: any[]) {
    if (getOpt('debug')) {
      logger([`[${prefix}]`, ...args], 'warn');
    }
  }

  function getOpt<K extends keyof Opts>(key: K): Opts[K] {
    return opts?.[key] || defaults[key];
  }

  function changeStatus(newStatus: SocketStatus) {
    const prevStatus = status;
    status = newStatus;
    _log(`status changed from [${prevStatus}] to [${status}]`);
    emitter!.emit('statuschanged', {
      status
    });
  }

  return {
    init,
    unsubscribe,
    fail,
    destroy,
    clearFailedMsgs,
    resendFailed,
    changeStatus,
    send,
    sendMessage,
    sendSubscribeMessage,
    onOpen,
    onClose,
    onMessage,
    deleteSubscription,
    addHandler,
    onSubscribe,
    isOpen,
    getOpt,
    emitter
  };
}
