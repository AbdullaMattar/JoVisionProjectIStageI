import { Image, StyleSheet, Text, View } from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import {
  useGeoLocationPermission,
  useIsAppActive,
  useOrientationImage,
  useOrientationXYZ,
} from '../hooks';
import { useIsFocused } from '@react-navigation/native';
import { useEffect, useState } from 'react';

export default function () {
  const [isOn, setIsOn] = useState(true);
  const isFocused = useIsFocused();
  const appActive = useIsAppActive();
  const oriImg = useOrientationImage(isOn);

  const {
    isGranted: hasLocPerm,
    error: error,
    location: location,
    image: speedImg,
  } = useGeoLocationPermission(isOn);
  const { x, y, z } = useOrientationXYZ(isOn);

  useEffect(() => {
    setIsOn(isFocused && appActive);
  }, [isFocused, appActive]);

  if (!isFocused || !appActive) return <Text>Screen is Turned Off</Text>;
  if (!hasLocPerm) return <Text>No location permission</Text>;
  if (error) return <Text>Location error: {error}</Text>;
  if (!location) return <Text>Waiting...</Text>;

  return (
    <View style={styles.mainContainer}>
      <View style={styles.centerdContainer}>
        <View style={styles.centerdBox}>
          <Text>GPS info:</Text>
          <Text>Altitude: {Number(location.altitude).toFixed(3)}</Text>
          <Text>Latitude: {Number(location.latitude).toFixed(3)}</Text>
          <Text>Longitude: {Number(location.longitude).toFixed(3)}</Text>
          <Text>Speed: {Number(location.speed).toFixed(3)}</Text>
        </View>
        <View style={styles.centerdBox}>
          <Text>( X , Y , Z ) orientation: </Text>
          <Text>X: {x}</Text>
          <Text>Y: {y}</Text>
          <Text>Z: {z}</Text>
        </View>
      </View>
      <View style={[styles.centerdContainer, { margin: 25 }]}>
        <Image source={speedImg} style={{ width: 120, height: 120 }} />
        <Image source={oriImg} style={{ width: 120, height: 120 }} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    alignItems: 'center',
  },
  centerdContainer: {
    width: '100%',
    justifyContent: 'space-evenly',
    flexDirection: 'row',
  },
  centerdBox: {
    height: 200,
    width: '45%',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 6,
    marginTop: 20,
    gap: 10,
    borderRadius: 20,
  },
});
