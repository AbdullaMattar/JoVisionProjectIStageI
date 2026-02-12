import { StyleSheet, Text, View } from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import { useGeoLocationPermission, useIsAppActive } from '../hooks';
import { useIsFocused } from '@react-navigation/native';
import { useEffect } from 'react';

export default function () {
  const isFocused = useIsFocused();
  const appActive = useIsAppActive();
  const {
    isGranted: hasLocPerm,
    CheckPermission: checkLocPerm,
    location: location,
    toggle: toggle,
  } = useGeoLocationPermission();

  useEffect(() => {
    if (!hasLocPerm) checkLocPerm();
  }, []);
  useEffect(() => {
    if (hasLocPerm) toggle(true);
  }, [hasLocPerm]);
  useEffect(() => {
    if (!isFocused || !appActive) toggle(false);
    if (isFocused && appActive && hasLocPerm) toggle(true);
  }, [isFocused, appActive]);

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
        <Text>X: {location.altitude}</Text>
        <Text>Y: {location.latitude}</Text>
        <Text>Z: {location.longitude}</Text>
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
