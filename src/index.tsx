import { NativeModules } from 'react-native';
import Wallet, { defaultWallet } from './wlletApi';

const PassManager = NativeModules.PassManager ? Wallet : defaultWallet;
export default PassManager;
