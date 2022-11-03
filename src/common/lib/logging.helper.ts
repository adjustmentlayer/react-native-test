import { logger } from 'react-native-logs';

type Level = 'debug' | 'info' | 'warn' | 'error';

const LEVELS = ['debug', 'info', 'warn', 'error'];
const PRODUCTION_VISIBLE_LEVELS = ['info', 'warn', 'error'];

const loggerInstance = logger.createLogger();

const checkLevel = (level: Level): void => {
  if (!LEVELS.includes(level)) {
    throw new Error(`level [${level}] is not supported`);
  }
};

const shouldShowLogMsg = (level: Level): boolean => {
  return PRODUCTION_VISIBLE_LEVELS.includes(level) || __DEV__;
};

const baseLog = (msg: string, level: Level = 'info') => {
  checkLevel(level);
  shouldShowLogMsg(level) && loggerInstance[level](msg);
};

const enhanceLog = (level: Level) => {
  return (...args: any[]) => {
    const string = args
      .map((arg) => {
        return JSON.stringify(arg).replace(/^"/, '').replace(/"$/, '');
      })
      .join(' ');
    baseLog(string, level);
  };
};

const log: Logger = {
  debug: enhanceLog('debug'),
  dbg: enhanceLog('debug'),
  info: enhanceLog('info'),
  log: enhanceLog('info'),
  warn: enhanceLog('warn'),
  error: enhanceLog('error'),
  err: enhanceLog('error')
};

type Logger = {
  debug: (...args: any[]) => void;
  info: (...args: any[]) => void;
  log: (...args: any[]) => void;
  warn: (...args: any[]) => void;
  error: (...args: any[]) => void;
  dbg: (...args: any[]) => void;
  err: (...args: any[]) => void;
};

export { log };
