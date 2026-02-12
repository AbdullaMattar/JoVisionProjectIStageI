import { AppState } from 'react-native';
import { useEffect, useState } from 'react';
import Geolocation from '@react-native-community/geolocation';

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
