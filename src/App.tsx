import React from 'react';
import { Provider as MobxProvider } from 'mobx-react';
import ErrorBoundary from 'react-native-error-boundary';
import { captureError } from '~common/lib/error.helper';
import { Navigation } from '~navigation/Navigation';
import { StatusBar } from 'react-native';
import { stores } from '~stores';
import './i18n';
import { appService } from '~domains/app/app.service';

appService.init();

const App = () => {
  return (
    <ErrorBoundary
      onError={(err) => {
        captureError(err);
      }}
    >
      <MobxProvider {...stores}>
        <StatusBar backgroundColor={'transparent'} translucent={true} />
        <Navigation />
      </MobxProvider>
    </ErrorBoundary>
  );
};

export default App;
