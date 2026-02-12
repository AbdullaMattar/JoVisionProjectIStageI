import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import CameraScreen from './Camera';
import SensorsScreen from './Sensors';
import { Image, StyleSheet } from 'react-native';
const Tab = createBottomTabNavigator();
const icons = {
  camera: require('../../Images/Icons/camera.png'),
  sensors: require('../../Images/Icons/sensors.png'),
};

export default function RootStack() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: { height: 60, paddingTop: 10 },
      }}>
      <Tab.Screen
        name="Camera"
        component={CameraScreen}
        options={{
          title: 'Camera',
          tabBarIcon: () => (
            <Image source={icons.camera} style={styles.image} />
          ),
          tabBarActiveTintColor: 'blue',
        }}
      />
      <Tab.Screen
        name="Sensors"
        component={SensorsScreen}
        options={{
          title: 'Sensors',
          tabBarIcon: () => (
            <Image source={icons.sensors} style={styles.image} />
          ),
          tabBarActiveTintColor: 'blue',
        }}
      />
    </Tab.Navigator>
  );
}
const styles = StyleSheet.create({
  image: {
    height: 40,
    width: 40,
  },
});
