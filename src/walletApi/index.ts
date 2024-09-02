import { NativeModules, Platform } from 'react-native';

const { GoogleWallet, AppleWallet } = NativeModules;

export interface WalletApi {
  saveToWallet: (base64Encoded: string) => Promise<PassResult>;
  isWalletAvailable: () => Promise<boolean>;
  openPassWithPassURI?: (passURL: string) => Promise<PassResult>;
  openPassInWallet?: (
    passIdentifier: string,
    passSerialNumber: string
  ) => Promise<PassResult>;
  isPassInWallet?: (
    passIdentifier: string,
    serialNumber: string
  ) => Promise<boolean>;
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
  openPassWithPassURI: async (_: string) => {
    return Promise.resolve({ success: false, status: 'Unsupported platform' });
  },
  openPassInWallet: async (_: string, __: string) => {
    return Promise.resolve({ success: false, status: 'Unsupported platform' });
  },
  isPassInWallet: async (_: string, __: string) => {
    return Promise.resolve(false);
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
      openPassInWallet: async (
        passIdentifier: string,
        serialNumber: string
      ): Promise<PassResult> => {
        try {
          const data: PassResult = await AppleWallet.openPassInWallet(
            passIdentifier,
            serialNumber
          );
          return data;
        } catch (error) {
          console.error('Error in openPassInWallet:', error);
          throw error;
        }
      },
      openPassWithPassURI: async (passURL: string): Promise<PassResult> => {
        try {
          const data: PassResult =
            await AppleWallet.openPassWithPassURI(passURL);
          return data;
        } catch (error) {
          console.error('Error in openPassInWallet:', error);
          throw error;
        }
      },
      isPassInWallet: async (passIdentifier: string, serialNumber: string) => {
        return AppleWallet.isPassInWallet(passIdentifier, serialNumber);
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
