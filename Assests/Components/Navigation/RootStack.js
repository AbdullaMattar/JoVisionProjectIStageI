import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import CameraScreen from './Camera';
import SensorsScreen from './Sensors';
import Gallary from './Gallary';
import Slideshow from './Slideshow';
import { Image, StyleSheet } from 'react-native';
const Tab = createBottomTabNavigator();
const icons = {
  camera: require('../../Images/Icons/camera.png'),
  sensors: require('../../Images/Icons/sensors.png'),
  gallary: require('../../Images/Icons/gallary.png'),
  slideshow: require('../../Images/Icons/slideshow.png'),
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
          tabBarIcon: ({ focused }) => (
            <Image
              source={icons.camera}
              style={[
                styles.image,
                focused
                  ? { tintColor: 'rgb(38, 85, 255)' }
                  : { tintColor: '#000000' },
              ]}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Sensors"
        component={SensorsScreen}
        options={{
          title: 'Sensors',
          tabBarIcon: ({ focused }) => (
            <Image
              source={icons.sensors}
              style={[
                styles.image,
                focused
                  ? { tintColor: 'rgb(38, 85, 255)' }
                  : { tintColor: '#000000' },
              ]}
            />
          ),
          tabBarActiveTintColor: 'blue',
        }}
      />
      <Tab.Screen
        name="Gallary"
        component={Gallary}
        options={{
          title: 'Gallary',
          tabBarIcon: ({ focused }) => (
            <Image
              source={icons.gallary}
              style={[
                styles.image,
                focused
                  ? { tintColor: 'rgb(38, 85, 255)' }
                  : { tintColor: '#000000' },
              ]}
            />
          ),
          tabBarActiveTintColor: 'blue',
        }}
      />
      <Tab.Screen
        name="Slideshow"
        component={Slideshow}
        options={{
          title: 'Slideshow',
          tabBarIcon: ({ focused }) => (
            <Image
              source={icons.slideshow}
              style={[
                styles.image,
                focused
                  ? { tintColor: 'rgb(38, 85, 255)' }
                  : { tintColor: '#000000' },
              ]}
            />
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
