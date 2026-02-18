import { AppState, PermissionsAndroid } from 'react-native';
import { useEffect, useState, useCallback } from 'react';
import Geolocation from '@react-native-community/geolocation';
import {
  accelerometer,
  SensorTypes,
  setUpdateIntervalForType,
} from 'react-native-sensors';
import RNFS from 'react-native-fs';

import { getMediaFiles } from './CameraMethods';
import {
  useDeviceOrientationChange,
  useOrientationChange,
} from 'react-native-orientation-locker';

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
  const [error, setError] = useState(null);
  const [image, setimage] = useState('PORTRAIT');
  const activityImg = {
    car: require('../Images/car.png'),
    walk: require('../Images/walk.png'),
    sit: require('../Images/sit.png'),
  };
  const X = 3.0;
  const Y = 0.5;

  function getActivity(speed = 0) {
    if (speed > X) return 'car';
    if (speed > Y) return 'walk';
    return 'sit';
  }
  useEffect(() => {
    (async () => {
      const res = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      );
      setIsGranted(res === PermissionsAndroid.RESULTS.GRANTED);
    })();
  }, []);

  useEffect(() => {
    if (!isOn || !isGranted) return;

    let cancelled = false;

    const getLoc = () => {
      Geolocation.getCurrentPosition(
        pos => {
          if (cancelled) return;
          setError(null);
          setLocation(pos.coords);
        },
        err => {
          if (cancelled) return;
          setError(`${err.code}: ${err.message}`);
        },
        { enableHighAccuracy: true, timeout: 50000, maximumAge: 100 }
      );
    };

    getLoc();
    const id = setInterval(getLoc, 10000);

    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [isOn, isGranted]);
  useEffect(() => {
    const activity = getActivity(location?.speed);
    setimage(activityImg[activity]);
  }, [location]);
  return { isGranted, location, error, image };
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

export function useOrientationImage(isOn = true) {
  const {
    isGranted: hasLocPerm,
    error: error,
    location: location,
  } = useGeoLocationPermission(isOn);
  const [ori, setOri] = useState('PORTRAIT');

  useDeviceOrientationChange(o => {
    if (!isOn) return;
    setOri(o);
  });
  const orientationImg = {
    PORTRAIT: require('../Images/por.png'),
    'LANDSCAPE-LEFT': require('../Images/land_left.png'),
    'LANDSCAPE-RIGHT': require('../Images/land_right.png'),
    'PORTRAIT-UPSIDEDOWN': require('../Images/upside_por.png'),
  };

  return orientationImg[ori] || orientationImg.PORTRAIT;
}
