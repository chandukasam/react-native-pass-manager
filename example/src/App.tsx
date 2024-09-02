import * as React from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { mockData } from './mock';
import { PassManager, WalletButton } from 'react-native-pass-manager';

export default function App() {
  const [urlForThePass, setUrlForThePass] = React.useState<string | null>(null);
  const [isPassAlreadyInWallet, setIsPassAlreadyInWallet] =
    React.useState<boolean>(false);
  // Simulate fetching wallet pass
  const fetchWalletPassMock = (): Promise<string> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockBase64Encoded = mockData!.passString;
        resolve(mockBase64Encoded);
      }, 2000); // Simulate API call delay
    });
  };

  React.useEffect(() => {
    const checkPassInWallet = async () => {
      try {
        const isPassInWallet = await PassManager.isPassInWallet!(
          'your_pass_identifier',
          'your_pass_serial_number'
        );
        setIsPassAlreadyInWallet(isPassInWallet);
        console.log('Is pass in wallet:', isPassInWallet);
      } catch (error) {
        console.log('Error checking pass in wallet:', error);
      }
    };
    checkPassInWallet();
  }, []);

  const isIOS = Platform.OS === 'ios';

  const savePassToWallet = async () => {
    try {
      const base64Encoded = await fetchWalletPassMock();
      //NOTE: pass manager result example
      // ["success": true, "passURL": "shoebox://pass/pass.com.appID/1234567", "status": "didAddPasses"]
      const { success, passURL } =
        await PassManager.saveToWallet(base64Encoded);
      if (success && passURL?.length && isIOS) {
        setUrlForThePass(passURL);
        console.log('Pass saved to wallet', { success, passURL });
      } else {
        console.log('Pass did not save wallet', success);
      }
    } catch (error) {
      console.log('Error saving pass to wallet:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text>{`Is Pass in the wallet: ${isPassAlreadyInWallet}`}</Text>
      <WalletButton onPress={savePassToWallet} />
      {urlForThePass && PassManager.openPassInWallet && (
        <Pressable onPress={() => PassManager.openPassInWallet!(urlForThePass)}>
          <Text>Open pass in Wallet</Text>
        </Pressable>
      )}
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
