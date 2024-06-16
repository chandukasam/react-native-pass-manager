# react-native-pass-manager

A unified pass manager for IOS and Android wallets

| <img src="./gifs/ios.gif" alt="alt text" width="250" height="500"/> | <img src="./gifs/android.gif" alt="alt text" width="250" height="500"/> |
| :-----------------------------------------------------------------: | :---------------------------------------------------------------------: |
|                    Saving passes to Apple Wallet                    |                     Saving passes to Google Wallet                      |

## Installation

```sh
npm install react-native-pass-manager
```

or using yarn

```sh
yarn add react-native-pass-manager
```

## Setup

### Adding Google Wallet SDK

To save passes correctly to Google Wallet, you need to add the Google Wallet SDK to your app. Follow these steps:

1. Open the module-level Gradle build file (`android/app/build.gradle`).
2. Add the Google Wallet SDK to the dependencies section:

```gradle
// TODO: Add the "com.google.android.gms:play-services-pay" dependency to
//       use the Google Wallet API
implementation "com.google.android.gms:play-services-pay:<latest_version>"
```

### Enabling Apple Wallet

To use Apple Wallet with your app, you need to enable the Wallet capability in your Xcode project. Follow these steps:

1. Open your project in Xcode.
2. Select your app's target and then go to the "Signing & Capabilities" tab.
3. Click the "+" button to add a new capability.
4. Search for and select "Wallet".
5. Check the "Apple Wallet" capability to add it to your project.

This step is essential for allowing your app to interact with Apple Wallet, enabling it to save passes on iOS devices.

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

## More direct way to save passes using wallet buttons

To simplify the process of saving a pass to the wallet and to handle the rendering and loading states of the wallet button, you can use the [`WalletButton`] component along with a custom function to fetch and save the pass. This approach abstracts the loading state management and conditional rendering based on the wallet's availability.

### Example

Below is an example that demonstrates how to use the [`WalletButton`] to save a pass to the wallet. This method automatically handles the rendering of the button based on the wallet's availability and displays a loading indicator while the pass is being saved.

```tsx
import React from 'react';
import { View, Alert, StyleSheet } from 'react-native';
import { WalletButton, PassManager } from 'react-native-pass-manager';

function App() {
  // Simulate fetching wallet pass
  const fetchWalletPassMock = (): Promise<string> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const passString = 'your_mock_base64_encoded_pass_here';
        resolve(passString);
      }, 2000); // Simulate API call delay
    });
  };

  const savePassToWallet = async () => {
    try {
      const passString = await fetchWalletPassMock();
      await PassManager.saveToWallet(passString);
      console.log('Pass saved to wallet');
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
    justifyContent: 'center',
    alignItems: 'center',
  },
});
```

This example demonstrates how to integrate the wallet saving functionality seamlessly into your app, providing a user-friendly way to add passes to the wallet with minimal effort.

For more details on the `WalletButton` component and the `PassManager` API, refer to the respective sections in this document.

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
