// @ts-ignore
import * as PerformanceFlipperReporter from 'react-native-performance-flipper-reporter';
import Reactotron from 'reactotron-react-native';
// @ts-ignore
import ReactotronFlipper from 'reactotron-react-native/dist/flipper';
import { createMobxDebugger } from 'mobx-flipper';
import RNAsyncStorageFlipper from 'rn-async-storage-flipper';
import { spy } from 'mobx';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { stores } from '~stores';
import { sessionService } from '../session/session.service';
import { walletService } from '../wallet/wallet.service';
import { authService } from '../auth/auth.service';
import { log } from '~common/lib/logging.helper';
import remoteConfig from '@react-native-firebase/remote-config';


const { appStore } = stores;
export const appService = {
  async init() {
    log.dbg(`environment: ${process.env.NODE_ENV}`);
    this.initDevTools();

    appStore.setLoading(true);
    sessionService
      .init()
      .then(() => authService.init())
      .then(() => walletService.init())
      .finally(() => appStore.setLoading(false));

      remoteConfig()
          .setDefaults({
              awesome_new_feature: 'disabled',
          })
          .then(() => remoteConfig().fetchAndActivate())
          .then(fetchedRemotely => {
              if (fetchedRemotely) {
                  console.log('Configs were retrieved from the backend and activated.');
              } else {
                  console.log(
                      'No configs were fetched from the backend, and the local configs were already activated',
                  );
              }
          });
  },
  initDevTools() {
    if (__DEV__) {
      // @ts-ignore
      spy(createMobxDebugger(stores));
      // @ts-ignore
      RNAsyncStorageFlipper(AsyncStorage);
      PerformanceFlipperReporter.setupDefaultFlipperReporter();
      Reactotron.configure({
        name: 'Simp1e',
        createSocket: (path) => new ReactotronFlipper(path)
      })
        .useReactNative({
          asyncStorage: false, // there are more options to the async storage.
          networking: {
            // optionally, you can turn it off with false.
            ignoreUrls: /symbolicate/
          },
          editor: false, // there are more options to editor
          errors: { veto: () => false }, // or turn it off with false
          overlay: false // just turning off overlay
        })
        .connect();
    }
  }
};
