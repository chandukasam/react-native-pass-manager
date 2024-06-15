# react-native-pass-manager

A pass manager for IOS and Android wallets

## Installation

```sh
npm install react-native-pass-manager
```

or using yarn

```sh
yarn add react-native-pass-manager
```

## Usage

Depending on the platform the PassManager will determine which wallet to use, Apple wallet for IOS and Google wallet for android.

## Android

Google has a [comprehensive guide](https://codelabs.developers.google.com/add-to-wallet-web#6) on how to create wallet passes for Google wallet. You can use your backend to create a wallet pass as a signed JWT and pass it to the pass manager for saving it in the wallet.

## IOS

For Apple wallet passes, the pass manager is expecting a valid .pkpass file encoded in base64 format. The pass manager will validate the base64 string and convert it to a wallet pass and will pass it to apple wallet.

## Usage

```js
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
```

The `WalletApi` interface provides two main methods to interact with the device's wallet (Apple Wallet for iOS and Google Wallet for Android). Below are the methods available:

### `isWalletAvailable()`

Checks if the wallet is available on the device.

- **Returns**: `Promise<boolean>` - A promise that resolves to `true` if the wallet is available, otherwise `false`.

### `saveToWallet(policyNumber: string)`

Saves a pass to the device's wallet. For iOS, this method expects a base64 encoded string which represents a valid `.pkpass` file. For Android, this method expects a signed JWT.

- **Parameters**:
  - For iOS: `base64Encoded: string` - The base64 encoded string of the `.pkpass` file.
  - For Android: `signedJWT: string` - The signed JWT.
- **Returns**: `Promise<void>` - A promise that resolves when the pass is successfully saved to the wallet.

Please note that the actual implementation might vary depending on the platform. Ensure that the pass format is correct for the respective platform to avoid any issues.

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)
