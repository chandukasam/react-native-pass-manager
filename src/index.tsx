import { NativeModules, Platform } from 'react-native';
import Wallet from './wlletApi';

const LINKING_ERROR =
  `The package 'react-native-pass-manager' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo Go\n';

const PassManager = NativeModules.PassManager
  ? Wallet
  : new Proxy(
      {},
      {
        get() {
          throw new Error(LINKING_ERROR);
        },
      }
    );

export default PassManager;
