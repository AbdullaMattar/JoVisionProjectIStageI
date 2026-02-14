import { StyleSheet, Text, View } from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import {
  useGeoLocationPermission,
  useIsAppActive,
  useOrientationXYZ,
} from '../hooks';
import { useIsFocused } from '@react-navigation/native';
import { useEffect, useState } from 'react';

export default function () {
  const [isOn, setIsOn] = useState(true);
  const isFocused = useIsFocused();
  const appActive = useIsAppActive();
  const {
    isGranted: hasLocPerm,
    CheckPermission: checkLocPerm,
    location: location,
  } = useGeoLocationPermission(isOn);
  const { x, y, z } = useOrientationXYZ(isOn);

  useEffect(() => {
    if (!hasLocPerm) checkLocPerm();
  }, []);

  useEffect(() => {
    if (!isFocused || (!appActive && hasLocPerm)) {
      // toggle(false);
      setIsOn(false);
    } else {
      // toggle(true);
      setIsOn(true);
    }
  }, [isFocused, appActive, hasLocPerm]);

  if (!location) return <Text>Waiting</Text>;
  if (!isFocused || !appActive) return <Text>Screen is Turned Off</Text>;

  return (
    <View style={styles.centerdContainer}>
      <View style={styles.centerdBox}>
        <Text>GPS info:</Text>
        <Text>Altitude: {location.altitude}</Text>
        <Text>Latitude: {location.latitude}</Text>
        <Text>Longitude: {location.longitude}</Text>
        <Text>Speed: {location.speed}</Text>
      </View>
      <View style={styles.centerdBox}>
        <Text>( X , Y , Z ) orientation: </Text>
        <Text>X: {x}</Text>
        <Text>Y: {y}</Text>
        <Text>Z: {z}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  centerdContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerdBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 6,
    marginTop: 20,
    gap: 10,
    width: '90%',
    borderRadius: 80,
  },
});
