import Config from 'react-native-config';

export default {
  environmentName: Config.REACT_APP_CI_ENVIRONMENT_NAME || 'LOCAL',
  defaultLanguage: 'en'
};
