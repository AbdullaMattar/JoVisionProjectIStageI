# JoVision Project — Stage II

A React Native mobile app with camera capture, sensor monitoring, and media gallery features.

## Screens

### 1. Camera

- Switch between front and back cameras
- Toggle between photo and video modes
- Capture photos or record/stop videos
- Files saved as `AbdullaMatar_<ISODate>.jpg/mp4`

### 2. Sensors

- Displays GPS data (altitude, latitude, longitude, speed)
- Shows accelerometer orientation (X, Y, Z)
- Speed-based activity icon: 🚗 car (>3.0), 🚶 walking (>0.5), 🧘 sitting (<0.5)
- Device orientation icon: Portrait, Landscape Left/Right, Upside Down

### 3. Gallery

- Grid view of all captured media
- Pull to refresh
- Tap any item to Rename, Delete, or view Fullscreen

### 4. Media Viewer

- Fullscreen image/video viewer (hidden from tab bar)
- Video controls: Play/Pause, ±5s seek
- Navigate between media with Next/Previous

## Tech Stack

- React Native (CLI)
- react-native-vision-camera
- react-native-video
- react-native-sensors
- react-native-orientation-locker
- @react-native-community/geolocation
- react-native-fs

## Run

```bash
npm install
npx react-native run-android
```
