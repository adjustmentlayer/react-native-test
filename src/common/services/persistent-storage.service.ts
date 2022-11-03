import AsyncStorage from '@react-native-async-storage/async-storage';
import { log } from '../lib/logging.helper';
import {
  Callback,
  CallbackWithResult
} from '@react-native-async-storage/async-storage/lib/typescript/types';

export const persistentStorage = {
  async set(key: string, value: any, json = false, callback?: Callback) {
    if (value === null || typeof value === 'undefined') {
      return await this.remove(key, callback);
    }
    if (json) {
      value = JSON.stringify(value);
    }
    await AsyncStorage.setItem(key, value, callback);
    this.dbg(`value of [${key}] in persistent storage was updated to ${value}`);
    return value;
  },
  async get(key: string, json = false, callback?: CallbackWithResult<string>) {
    const value: string | null = await AsyncStorage.getItem(key, callback);
    if (json && value) {
      return JSON.parse(value);
    }
    return value;
  },
  async remove(key: string, callback?: Callback) {
    this.dbg(`key [${key}] in persistent storage was deleted`);
    await AsyncStorage.removeItem(key, callback);
    return null;
  },
  dbg(msg: string) {
    log.dbg(`${msg}`);
  }
};
