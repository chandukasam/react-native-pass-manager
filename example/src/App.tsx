import * as React from 'react';

import { Alert, Button, StyleSheet, View } from 'react-native';
import WalletPass from 'react-native-pass-manager';
import { mockData } from './mock';

export default function App() {
  const savePassToWallet = async () => {
    try {
      // const response = await fetch(
      //   'https://crimson-resonance-896319.postman.co/workspace/My-Workspace~c3e6a3b1-3593-47d7-8bc0-160af05be356/mock/aaa0a20f-dc06-4276-901a-8cea6dadd63f'
      // );
      // const passData = await response.arrayBuffer();
      // const base64Encoded = btoa(
      //   String.fromCharCode(...new Uint8Array(passData))
      // );

      const base64Encoded = mockData.base64data;

      const success = await WalletPass.saveToWallet(base64Encoded);
      if (success) {
        Alert.alert('Success', 'Pass saved to wallet');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to save pass to wallet');
    }
  };
  return (
    <View style={styles.container}>
      <Button title="Save Pass to Wallet" onPress={savePassToWallet} />
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
