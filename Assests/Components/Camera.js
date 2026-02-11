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

const imgs = {
  captureIcon: require('../Images/Icons/capture.png'),
};

export default function CameraScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [loadingIndicator, setLoadingIndicator] = useState(false);
  const [tempImg, setTempImg] = useState(null);
  const cameraRef = useRef(null);
  const { hasPermission, requestPermission } = useCameraPermission();
  const backCamera = useCameraDevice('back');

  const handleCapture = async () => {
    setLoadingIndicator(true);
    try {
      if (!cameraRef.current) return; // not ready yet
      const photo = await cameraRef.current.takePhoto();
      setTempImg(String(photo.path));
    } catch (e) {
      console.log(e);
    } finally {
      setLoadingIndicator(false);
      setModalVisible(true);
    }
  };

  if (!hasPermission) {
    //permission for camera
    return (
      <View style={styles.centerdContainer}>
        <Text>Permission Not Granted</Text>
        <Button title="Grant Permission" onPress={() => requestPermission()} />
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

  return (
    <View style={{ position: 'relative', flex: 1 }}>
      <Camera
        ref={cameraRef}
        isActive={true}
        device={backCamera}
        style={styles.cameraStyle}
        photo={true}
      />
      <Pressable onPress={handleCapture} style={styles.captureOverlay}>
        <Image style={styles.captureIcon} source={imgs.captureIcon} />
      </Pressable>
      <Modal
        visible={modalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
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
      const fileName = `image_${Date.now()}.jpg`;

      const newPath = `${RNFS.DocumentDirectoryPath}/${fileName}`;

      await RNFS.copyFile(tempImg, newPath);

      console.log('Saved at:', newPath);

      // return newPath;
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
