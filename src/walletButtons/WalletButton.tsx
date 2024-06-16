import React, { FC, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
  Platform,
  View,
} from 'react-native';
import { AddToAppleWalletButton } from './AddToAppleWalletButton';
import { AddToGoogleWalletButton } from './AddToGoogleWalletButton';
import { PassManager } from 'react-native-pass-manager';

interface IWalletButtonProps {
  onPress: () => Promise<any>;
}

export const WalletButton: FC<IWalletButtonProps> = ({ onPress }) => {
  const [loading, setLoading] = useState(false);
  const [isWalletAvailable, setIsWalletAvailable] = useState(false);

  useEffect(() => {
    PassManager.isWalletAvailable()
      .then(setIsWalletAvailable)
      .catch((error) =>
        console.error('Error checking wallet availability:', error)
      );
  }, []);

  const handlePress = async () => {
    setLoading(true);
    try {
      await onPress();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (!isWalletAvailable) {
    return null;
  }

  const AddToWalletButton =
    Platform.select({
      ios: AddToAppleWalletButton,
      android: AddToGoogleWalletButton,
    }) || View;

  return (
    <TouchableOpacity
      onPress={handlePress}
      style={styles.button}
      disabled={loading}
    >
      {loading ? (
        <ActivityIndicator size="small" color="#1f1f1f" />
      ) : (
        <AddToWalletButton />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 5,
    padding: 10,
    justifyContent: 'center',
    margin: 10,
    marginBottom: 20,
  },
});
