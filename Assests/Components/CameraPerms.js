import { useState, useEffect } from 'react';
import { PermissionsAndroid, Platform } from 'react-native';
import { CameraRoll } from '@react-native-camera-roll/camera-roll';

export function useMediaPermission() {
  const [hasPermission, setHasPermission] = useState(false);

  const checkPermission = async () => {
    if (Platform.OS !== 'android') {
      setHasPermission(true);
      return true;
    }

    if (Platform.Version >= 33) {
      const results = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES
      );
      setHasPermission(results);
      return results;
    } else {
      const result = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE
      );
      setHasPermission(result);
      return result;
    }
  };

  const requestPermission = async () => {
    if (Platform.OS !== 'android') return true;

    const result = await PermissionsAndroid.request(
      Platform.Version >= 33
        ? PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES
        : PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE
    );

    const granted = result === PermissionsAndroid.RESULTS.GRANTED;
    setHasPermission(granted);
    return granted;
  };

  useEffect(() => {
    checkPermission();
  }, []);

  return { hasPermission, requestPermission };
}

export async function savePicture({ uri, type, album, hasPermission }) {
  if (Platform.OS === 'android' && !hasPermission)
    throw new Error('invalid permission');
  await CameraRoll.saveAsset(uri, { type, album });
  return true;
}
