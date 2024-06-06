import { NativeModules } from 'react-native';
import Wallet, { WalletApi, defaultWallet } from './walletApi';

const PassManager: WalletApi = NativeModules.PassManager
  ? Wallet
  : defaultWallet;
export default PassManager;
