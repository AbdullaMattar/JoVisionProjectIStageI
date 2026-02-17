import { AppState } from 'react-native';
import { useEffect, useState, useCallback } from 'react';
import Geolocation from '@react-native-community/geolocation';
import {
  accelerometer,
  SensorTypes,
  setUpdateIntervalForType,
} from 'react-native-sensors';
import RNFS from 'react-native-fs';

import { getMediaFiles } from './CameraMethods';

export function useIsAppActive() {
  const [isActive, setIsActive] = useState(AppState.currentState === 'active');

  useEffect(() => {
    const sub = AppState.addEventListener('change', state => {
      setIsActive(state === 'active');
    });
    return () => sub.remove();
  }, []);

  return isActive;
}

//Location
export function useGeoLocationPermission(isOn = true) {
  const [isGranted, setIsGranted] = useState(false);
  const [location, setLocation] = useState(null);

  const CheckPermission = useCallback(() => {
    Geolocation.requestAuthorization(
      () => setIsGranted(true),
      () => setIsGranted(false)
    );
  }, []);

  const GetLoc = useCallback(() => {
    Geolocation.getCurrentPosition(
      position => setLocation(position.coords),
      error => console.log(error.code, error.message),
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 5000 }
    );
  }, []);

  useEffect(() => {
    CheckPermission();
  }, [CheckPermission]);

  useEffect(() => {
    if (!isGranted || !isOn) return;

    GetLoc();
    const timer = setInterval(GetLoc, 10000);
    return () => clearInterval(timer);
  }, [isGranted, isOn, GetLoc]);

  return { isGranted, CheckPermission, location };
}

// Orientation XYZ
export function useOrientationXYZ(isOn = true) {
  const [xyz, setXyz] = useState({ x: 0, y: 0, z: 0 });

  useEffect(() => {
    if (!isOn) return;

    setUpdateIntervalForType(SensorTypes.accelerometer, 500);

    const sub = accelerometer.subscribe(({ x, y, z }) => {
      setXyz({
        x: Number(x.toFixed(3)),
        y: Number(y.toFixed(3)),
        z: Number(z.toFixed(3)),
      });
    });

    return () => sub.unsubscribe();
  }, [isOn]);

  return xyz;
}

export function useGallery() {
  const [photos, setPhotos] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    const files = await getMediaFiles();
    setPhotos(files);
  }, []);

  const refresh = useCallback(async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  }, [load]);

  useEffect(() => {
    load();
  }, [load]);

  return { photos, refreshing, refresh };
}

export async function renameFile(oldUri, newName) {
  const oldPath = oldUri.replace('file://', '');

  const exists = await RNFS.exists(oldPath);
  if (!exists) throw new Error('File Dosent Exist');
  const extension = oldPath.substring(oldPath.lastIndexOf('.')); // .jpg

  const folderPath = oldPath.substring(0, oldPath.lastIndexOf('/'));

  const newPath = `${folderPath}/${newName}${extension}`;

  await RNFS.moveFile(oldPath, newPath);

  return 'file://' + newPath;
}

export async function deleteFile(uri) {
  try {
    const path = uri.replace('file://', '');

    const exists = await RNFS.exists(path);
    if (!exists) {
      console.log('File does not exist');
      return;
    }

    await RNFS.unlink(path);
    console.log('Deleted successfully');
  } catch (error) {
    console.log('Delete error:', error);
  }
}
