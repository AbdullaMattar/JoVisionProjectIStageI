import { AppState } from 'react-native';
import { useEffect, useState } from 'react';
import Geolocation from '@react-native-community/geolocation';
import {
  accelerometer,
  SensorTypes,
  setUpdateIntervalForType,
} from 'react-native-sensors';

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

export function useGeoLocationPermission() {
  const [isGranted, setIsGranted] = useState(false);
  const [location, setLocation] = useState(null);
  const [isOn, setIsOn] = useState(false);

  async function CheckPermission() {
    Geolocation.requestAuthorization(
      () => setIsGranted(true),
      () => setIsGranted(false)
    );
  }
  function toggle(bool) {
    setIsOn(bool);
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
    // console.log(isGranted + '  ' + isOn);
    if (!isGranted || !isOn) return;
    GetLoc();
    const timer = setInterval(() => GetLoc(), 10_000);
    return () => clearInterval(timer);
  }, [isOn]);

  return { isGranted, CheckPermission, location, toggle };
}

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
