import { AppState, Platform } from 'react-native';
import { useEffect, useState, useCallback } from 'react';
import Geolocation from '@react-native-community/geolocation';
import {
  accelerometer,
  SensorTypes,
  setUpdateIntervalForType,
} from 'react-native-sensors';
import {
  CameraRoll,
  cameraRollEventEmitter,
} from '@react-native-camera-roll/camera-roll';

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

export function useGeoLocationPermission(isOn = true) {
  const [isGranted, setIsGranted] = useState(false);
  const [location, setLocation] = useState(null);

  async function CheckPermission() {
    Geolocation.requestAuthorization(
      () => setIsGranted(true),
      () => setIsGranted(false)
    );
  }

  function GetLoc() {
    console.log('tick');
    Geolocation.getCurrentPosition(
      position => {
        setLocation(position.coords);
      },
      error => {
        console.log(error.code, error.message);
      }
    );
  }

  useEffect(() => {
    console.log('isOn ' + isOn);
    if (!isGranted || !isOn) return;

    GetLoc();
    const timer = setInterval(GetLoc, 10000);

    return () => clearInterval(timer);
  }, [isGranted, isOn]);

  return { isGranted, CheckPermission, location };
}

export function useOrientationXYZ(isOn = true) {
  const [xyz, setXyz] = useState({ x: 0, y: 0, z: 0 });

  useEffect(() => {
    if (!isOn) return;
    console.log('on');
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

const APP_ALBUM = 'Jovision Album';
const isAndroid = Platform.OS === 'android';

function toDto(edges) {
  return edges.map(({ node }) => ({
    id: node.image.uri,
    uri: node.image.uri,
    filename: node.image.filename,
    timestamp: node.timestamp,
  }));
}

export function useGallery(albumName = 'Jovision Album') {
  const [photos, setPhotos] = useState([]); // array of URIs
  const [refreshing, setRefreshing] = useState(false);

  async function loadPhotos() {
    try {
      const res = await CameraRoll.getPhotos({
        first: 100,
        assetType: 'Photos',
        groupTypes: 'Album',
        groupName: 'Jovision Album',
      });

      setPhotos(res.edges.map(e => e.node.image.uri));
    } catch (e) {
      console.log(e);
    }
  }

  async function refresh() {
    setRefreshing(true);
    await loadPhotos();
    setRefreshing(false);
  }

  useEffect(() => {
    loadPhotos();
  }, []);

  return { photos, refreshing, refresh };
}
