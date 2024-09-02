import { NativeModules, Platform } from 'react-native';

const { GoogleWallet, AppleWallet } = NativeModules;

export interface WalletApi {
  saveToWallet: (base64Encoded: string) => Promise<PassResult>;
  isWalletAvailable: () => Promise<boolean>;
  openPassInWallet?: (passURL: string) => Promise<PassResult>; // Add the method to the interface
}

export interface PassResult {
  success: boolean;
  status: string;
  passURL?: string;
}

export const defaultWallet: WalletApi = {
  saveToWallet: async (_: string) => {
    /*  NOTE: Default implementation
        This will be used if the platform is not android or ios */
    return Promise.resolve({ success: false, status: 'Unsupported platform' });
  },
  isWalletAvailable: () => Promise.resolve(false),
  openPassInWallet: async (_: string) => {
    return Promise.resolve({ success: false, status: 'Unsupported platform' });
  },
};

// Improvements: check if the pass already exists in the wallet before saving it
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
      openPassInWallet: async (passURL: string): Promise<PassResult> => {
        try {
          const data: PassResult = await AppleWallet.openPassInWallet(passURL);
          return data;
        } catch (error) {
          console.error('Error in openPassInWallet:', error);
          throw error;
        }
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
