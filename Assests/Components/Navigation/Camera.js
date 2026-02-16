import { useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Button,
  Image,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {
  Camera,
  useCameraDevice,
  useCameraFormat,
  useCameraPermission,
} from 'react-native-vision-camera';

import { saveMedia } from '../CameraMethods'; // <- your "mediaStore.js" file from earlier
import { useIsAppActive } from '../hooks';
import { useIsFocused } from '@react-navigation/native';
import Video from 'react-native-video';

const imgs = {
  captureIcon: require('../../Images/Icons/capture.png'),
  switchCameraIcon: require('../../Images/Icons/switch-camera.png'),
  startREC: require('../../Images/Icons/start-rec.png'),
  stopREC: require('../../Images/Icons/stop-rec.png'),
};

export default function CameraScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [loadingIndicator, setLoadingIndicator] = useState(false);
  const [cameraView, setCameraView] = useState('back');
  const [isPhotoMode, setIsPhotoMode] = useState(false);

  const cameraActive = useIsAppActive();
  const isFocused = useIsFocused();

  const [tempImg, setTempImg] = useState(null);
  const [tempVid, setTempVid] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const cameraRef = useRef(null);
  const cameraDevice = useCameraDevice(cameraView);

  const { hasPermission: hasCameraPermission, requestPermission } =
    useCameraPermission();

  function toggleCamera() {
    setCameraView(p => (p === 'back' ? 'front' : 'back'));
  }

  async function handleCapture() {
    setLoadingIndicator(true);
    try {
      if (!cameraRef.current) return;

      const photo = await cameraRef.current.takePhoto();
      setTempImg(String(photo.path));
      setModalVisible(true);
    } catch (e) {
      console.log('capture error:', e);
    } finally {
      setLoadingIndicator(false);
    }
  }

  async function handleRecording() {
    if (isRecording) return;
    setIsRecording(true);
    try {
      await cameraRef.current.startRecording({
        onRecordingFinished: video => {
          setTempVid(video.path);
          console.log(video.path);
          setIsRecording(false);
        },
        onRecordingError: error => {
          console.error(error);
          setIsRecording(false);
        },
      });
    } catch (e) {
      Alert.alert('Error', String(e.message));
    }
  }

  async function handleStopRecording() {
    try {
      await cameraRef.current.stopRecording();
      setModalVisible(true);
    } catch (e) {
      Alert.alert(e);
    } finally {
      setIsRecording(false);
    }
  }

  async function handleSave() {
    try {
      const date = new Date().toISOString().replace(/[:.]/g, '-'); //RegEx syntax (from web)
      const fileName = `AbdullaMatar_${date}`;
      const type = isPhotoMode ? 'photo' : 'video';
      await saveMedia({
        uri: isPhotoMode ? tempImg : tempVid,
        fileName,
        type,
      });
    } catch (error) {
      console.log('Error saving image:', error);
    } finally {
      setModalVisible(false);
    }
  }

  if (!hasCameraPermission) {
    return (
      <View style={styles.centerdContainer}>
        <Text>Permission Not Granted</Text>
        <Button title="Grant Permission | Camera" onPress={requestPermission} />
      </View>
    );
  }

  if (!cameraDevice) {
    return (
      <View style={styles.centerdContainer}>
        <Text>Loading camera...</Text>
      </View>
    );
  }
  const format = cameraDevice?.formats.find(
    f => f.videoWidth / f.videoHeight === 16 / 9
  );

  return (
    <View style={{ position: 'relative', flex: 1 }}>
      {cameraActive && isFocused ? (
        <Camera
          ref={cameraRef}
          isActive
          device={cameraDevice}
          style={styles.cameraStyle}
          photo
          video
          format={format}
        />
      ) : (
        <View style={styles.centerdContainer}>
          <Text>Camera inactive</Text>
        </View>
      )}
      {/* capture button - image/vid */}
      {isPhotoMode ? (
        //image
        <>
          <Pressable
            onPress={handleCapture}
            style={styles.captureOverlay}
            disabled={loadingIndicator}>
            <Image style={styles.captureIcon} source={imgs.captureIcon} />
          </Pressable>
          <View style={styles.mode}>
            <Text style={{ color: 'white' }}>Photo Mode</Text>
          </View>
        </>
      ) : (
        //video
        <>
          {!isRecording ? (
            <Pressable onPress={handleRecording} style={styles.captureOverlay}>
              <Image style={styles.captureIcon} source={imgs.startREC} />
            </Pressable>
          ) : (
            <Pressable
              onPress={handleStopRecording}
              style={styles.captureOverlay}>
              <Image style={styles.captureIcon} source={imgs.stopREC} />
            </Pressable>
          )}
          <View style={styles.mode}>
            <Text style={{ color: 'white' }}>Video Mode</Text>
          </View>
        </>
      )}

      {/* switch camera button */}

      <Pressable
        onPress={toggleCamera}
        style={styles.switchCamOverlay}
        disabled={isRecording}>
        <Image
          style={[
            styles.switchCamIcon,
            !isRecording ? null : { tintColor: '#9012125e' },
          ]}
          source={imgs.switchCameraIcon}
        />
      </Pressable>

      <View style={{ position: 'absolute', top: 50, left: 10 }}>
        <Button
          title="Change Video/Photo"
          onPress={() => setIsPhotoMode(p => !p)}
        />
      </View>

      <Modal
        visible={modalVisible}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}>
        {isPhotoMode
          ? !!tempImg && (
              <Image
                source={{
                  uri: tempImg.startsWith('file://')
                    ? tempImg
                    : `file://${tempImg}`,
                }}
                style={{ height: '70%', width: '100%', resizeMode: 'contain' }}
              />
            )
          : !!tempVid && (
              <Video
                source={{
                  uri: tempVid.startsWith('file://')
                    ? tempVid
                    : `file://${tempVid}`,
                }}
                style={{ height: '70%', width: '100%', resizeMode: 'contain' }}
                controls
              />
            )}

        <View style={{ alignItems: 'center', marginTop: 20 }}>
          <Text style={{ fontSize: 20 }}>
            Do You Want to Save the {isPhotoMode ? 'Image' : 'Video'}?
          </Text>
        </View>

        <View style={{ flexDirection: 'row', gap: 10, padding: 20 }}>
          <View style={{ flex: 1 }}>
            <Button title="Yes" onPress={handleSave} />
          </View>
          <View style={{ flex: 1 }}>
            <Button title="No" onPress={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal>

      {loadingIndicator && (
        <ActivityIndicator
          size={'large'}
          style={{
            position: 'absolute',
            backgroundColor: 'rgba(0, 0, 0, 0.60)',
            zIndex: 12,
            width: '100%',
            height: '100%',
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  centerdContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
  },
  cameraStyle: {
    flex: 1,
    resizeMode: 'contain',
  },
  captureOverlay: {
    position: 'absolute',
    backgroundColor: 'rgba(254, 255, 254, 0.2)',
    zIndex: 10,
    bottom: 30,
    alignSelf: 'center',
    height: 75,
    width: 75,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  captureIcon: {
    width: '75%',
    height: '75%',
  },
  switchCamOverlay: {
    position: 'absolute',
    backgroundColor: 'rgba(254, 255, 254, 0.2)',
    zIndex: 10,
    top: 10,
    right: 10,
    height: 50,
    width: 50,
    borderRadius: 20,
  },
  switchCamIcon: {
    width: '100%',
    height: '100%',
  },
  mode: {
    position: 'absolute',
    backgroundColor: 'red',
    top: 10,
    left: 10,
    zIndex: 10,
  },
});
