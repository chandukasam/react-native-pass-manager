import { NativeModules, Platform } from 'react-native';

const { GoogleWallet, AppleWallet } = NativeModules;

export interface WalletApi {
  saveToWallet: (base64Encoded: string) => Promise<PassResult>;
  isWalletAvailable: () => Promise<boolean>;
}

export interface PassResult {
  success: boolean;
  status: string;
}

export const defaultWallet: WalletApi = {
  saveToWallet: async (_: string) => {
    /*  NOTE: Default implementation
        This will be used if the platform is not android or ios */
    return Promise.resolve({ success: false, status: 'Unsupported platform' });
  },
  isWalletAvailable: () => Promise.resolve(false),
};

//Improvements: check is the pass already exists in the wallet before saving it
const Wallet: WalletApi =
  Platform.select({
    ios: {
      saveToWallet: async (base64Encoded: string): Promise<PassResult> => {
        try {
          const data: PassResult =
            await AppleWallet.saveToAppleWallet(base64Encoded);
          return data;
        } catch (error) {
          console.error('Error in saveToWallet:', error);
          throw error;
        }
      },
      isWalletAvailable: async () => {
        return AppleWallet.isWalletAvailable();
      },
    },
    android: {
      saveToWallet: async (signedJWT: string): Promise<PassResult> => {
        if (signedJWT.length) {
          GoogleWallet.saveToGoogleWallet(signedJWT);
          return { success: true, status: 'Saved to Google Wallet' };
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
