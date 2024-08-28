import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { mockData } from './mock';
import { PassManager, WalletButton } from 'react-native-pass-manager';

export default function App() {
  // Simulate fetching wallet pass
  const fetchWalletPassMock = (): Promise<string> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockBase64Encoded = mockData!.passString;
        resolve(mockBase64Encoded);
      }, 2000); // Simulate API call delay
    });
  };
  const savePassToWallet = async () => {
    try {
      const base64Encoded = await fetchWalletPassMock();
      const { success } = await PassManager.saveToWallet(base64Encoded);
      if (success) {
        console.log('Pass saved to wallet', success);
      } else {
        console.log('Pass did not save wallet', success);
      }
    } catch (error) {
      console.log('Error saving pass to wallet:', error);
    }
  };
  return (
    <View style={styles.container}>
      <WalletButton onPress={savePassToWallet} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f0f0',
  },
  box: {
    width: 60,
    height: 60,
    marginVertical: 20,
  },
});
