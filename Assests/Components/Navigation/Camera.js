import { useRef, useState } from 'react';
import {
  ActivityIndicator,
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
  useCameraPermission,
} from 'react-native-vision-camera';
import { CameraRoll } from '@react-native-camera-roll/camera-roll';
import { useMediaPermission, savePicture } from '../CameraPerms';
import { useIsAppActive } from '../hooks';
import { useIsFocused } from '@react-navigation/native';

const imgs = {
  captureIcon: require('../../Images/Icons/capture.png'),
};

export default function CameraScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [loadingIndicator, setLoadingIndicator] = useState(false);
  // app and page state
  const cameraActive = useIsAppActive();
  const isFocused = useIsFocused();

  const [tempImg, setTempImg] = useState(null);
  const cameraRef = useRef(null);
  const backCamera = useCameraDevice('back');
  // the permissions hooks
  const { hasPermission: hasCameraPermission, requestPermission } =
    useCameraPermission();
  const {
    hasPermission: hasMediaPermission,
    requestPermission: requestMediaPermission,
  } = useMediaPermission();

  const handleCapture = async () => {
    console.log('Pressed');
    setLoadingIndicator(true);
    try {
      if (!cameraRef.current) return; // not ready yet
      const photo = await cameraRef.current.takePhoto();
      setTempImg(String(photo.path)); //set temp images path
    } catch (e) {
      console.log(e);
    } finally {
      //currently no does not show the error to the user
      setLoadingIndicator(false);
      setModalVisible(true);
    }
  };

  if (!hasCameraPermission || !hasMediaPermission) {
    //permission for camera and Media
    return (
      <View style={styles.centerdContainer}>
        <Text>Permission Not Granted</Text>

        <Button
          title="Grant Permission | Camera"
          onPress={() => requestPermission()}
          disabled={hasCameraPermission}
        />
        <Button
          title="Grant Permission | Storage"
          onPress={() => requestMediaPermission()}
          disabled={hasMediaPermission}
        />
      </View>
    );
  }

  if (!backCamera) {
    //prevents problem when loading => null
    return (
      <View style={styles.centerdContainer}>
        <Text>Loading camera...</Text>
      </View>
    );
  }
  // console.log(isFocused + '  ' + cameraActive);
  return (
    <View style={{ position: 'relative', flex: 1 }}>
      {/* make sure we unmounts the camera  if swithed to another page or exit app  */}
      {cameraActive && isFocused ? (
        <Camera
          ref={cameraRef}
          isActive
          device={backCamera}
          style={styles.cameraStyle}
          photo
        />
      ) : (
        <View style={styles.centerdContainer}>
          <Text>Camera inactive</Text>
        </View>
      )}
      <Pressable onPress={handleCapture} style={styles.captureOverlay}>
        <Image style={styles.captureIcon} source={imgs.captureIcon} />
      </Pressable>
      {/* preview image modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}>
        <Image
          source={{ uri: 'file://' + tempImg }}
          style={{
            height: '70%',
            width: '100%',
            resizeMode: 'contain',
          }}
        />
        <View style={{ alignItems: 'center', marginTop: 20 }}>
          <Text style={{ fontSize: 20 }}>Do You Want to Save the Image?</Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            gap: 10,
            padding: 20,
          }}>
          <View style={{ flex: 1 }}>
            <Button title="Yes" onPress={handleSaveImage} />
          </View>
          <View style={{ flex: 1 }}>
            <Button title="No" onPress={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal>
      {loadingIndicator && (
        <ActivityIndicator
          size={'100'}
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
  async function handleSaveImage() {
    try {
      // console.log(hasMediaPermission);
      if (!hasMediaPermission) await requestMediaPermission();
      const fileName = `image_${Date.now()}.jpg`;
      await savePicture({
        uri: `file://${tempImg}`,
        type: 'photo',
        album: 'Jovision Album',
        hasPermission: hasMediaPermission,
      });
    } catch (error) {
      console.log('Error saving image:', error);
    } finally {
      setModalVisible(false);
    }
  }
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
    backgroundColor: 'rgba(13, 29, 247, 0.16)',
    zIndex: 10,
    bottom: 30,
    alignSelf: 'center',
    height: 100,
    width: 100,
  },
  captureIcon: {
    width: '100%',
    height: '100%',
  },
});
