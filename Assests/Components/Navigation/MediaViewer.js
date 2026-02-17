import { useIsFocused, useNavigation } from '@react-navigation/native';
import {
  Button,
  FlatList,
  Image,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useGallery, useIsAppActive } from '../hooks';
import { Dimensions } from 'react-native';
import { useEffect, useRef, useState } from 'react';
import Video from 'react-native-video';

export default function MediaViewer({ route }) {
  const navigation = useNavigation();
  const { uri, type } = route?.params;

  if (!uri) {
    return (
      <View style={styles.container}>
        <Text>No media selected</Text>
        <Button title="Back" onPress={() => navigation.navigate('Gallary')} />
      </View>
    );
  }

  return (
    <Pressable
      style={[
        styles.optionsPortal,
        { position: 'absolute' },
        { top: 75, bottom: 75, alignSelf: 'center', gap: 20 },
      ]}>
      {!type ? (
        <Image
          source={{
            uri: uri,
          }}
          style={{ height: '70%', width: '100%', resizeMode: 'contain' }}
        />
      ) : (
        <Video
          source={{
            uri: uri,
          }}
          style={{ height: '70%', width: '100%', resizeMode: 'contain' }}
          controls
        />
      )}

      <Button title="Back" onPress={() => navigation.navigate('Gallary')} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(18, 18, 5, 0.04)',
    flex: 1,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionsPortal: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
