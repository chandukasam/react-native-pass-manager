import { NativeModules, Platform } from 'react-native';
import Wallet, { WalletApi, defaultWallet } from './walletApi';
import { WalletButton } from './walletButtons/WalletButton';
const { GoogleWallet, AppleWallet } = NativeModules;

// Determine the appropriate wallet API based on the platform and availability
const PassManager: WalletApi = (() => {
  if (Platform.OS === 'ios' && AppleWallet) {
    return Wallet; // Use the iOS wallet implementation if available
  } else if (Platform.OS === 'android' && GoogleWallet) {
    return Wallet; // Use the Android wallet implementation if available
  }
  return defaultWallet; // Fallback to the default wallet implementation
})();
export { PassManager, WalletButton };
