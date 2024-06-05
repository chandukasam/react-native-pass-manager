import { NativeModules, Platform } from 'react-native';

const { GoogleWallet, AppleWallet } = NativeModules;

interface WalletApi {
  saveToWallet: (policyNumber: string) => Promise<void>;
  isWalletAvailable: () => Promise<boolean>;
}

const defaultWallet: WalletApi = {
  saveToWallet: async (_: string) => {
    /*  NOTE: Default implementation
        This will be used if the platform is not android or ios */
    return Promise.resolve();
  },
  isWalletAvailable: () => Promise.resolve(false),
};

//Improvements: check is the pass already exists in the wallet before saving it
const Wallet: WalletApi =
  Platform.select({
    ios: {
      saveToWallet: async (base64Encoded: string) => {
        try {
          // Save the .pkpass file to Apple Wallet
          AppleWallet.saveToAppleWallet(base64Encoded)
            .then(({ status }: { status: string }) => status === 'success')
            .catch((error: any) =>
              console.error("passed couldn't be saved to Apple Wallet: ", error)
            );
        } catch (e) {
          console.error('Error in callWalletApi:', e);
        }
      },
      isWalletAvailable: async () => {
        return AppleWallet.isWalletAvailable();
      },
    },
    android: {
      saveToWallet: async (signedJWT: string) => {
        if (signedJWT.length) {
          GoogleWallet.saveToGoogleWallet(signedJWT);
        } else {
          return Promise.reject(
            'Could not save to Google Wallet. Signed JWT is empty.'
          );
        }
      },
      isWalletAvailable: async () => {
        return GoogleWallet.isWalletAvailable();
      },
    },
  }) || defaultWallet;

export default Wallet;
