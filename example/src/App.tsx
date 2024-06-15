import * as React from 'react';

import { Alert, Button, StyleSheet, View } from 'react-native';
import { mockData } from './mock';
import PassManager from 'react-native-pass-manager';

export default function App() {
  const [walletAvailable, setWalletAvailable] = React.useState(false);

  const checkWallet = async () => {
    try {
      const isAvailable = await PassManager.isWalletAvailable();
      setWalletAvailable(isAvailable);
    } catch (error) {
      console.log('Error checking if wallet is available:', error);
    }
  };

  React.useEffect(() => {
    checkWallet();
  }, []);

  const savePassToWallet = async () => {
    try {
      const base64Encoded = mockData!.base64data;
      await PassManager.saveToWallet(base64Encoded);
      console.log('Pass saved to wallet');
    } catch (error) {
      console.log('Error saving pass to wallet:', error);
      Alert.alert('Error', 'Failed to save pass to wallet');
    }
  };
  return (
    <View style={styles.container}>
      {walletAvailable && (
        <Button title="Save Pass to Wallet" onPress={savePassToWallet} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  box: {
    width: 60,
    height: 60,
    marginVertical: 20,
  },
});
