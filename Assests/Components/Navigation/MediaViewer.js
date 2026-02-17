import { useIsFocused, useNavigation } from '@react-navigation/native';
import { Button, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { useEffect, useRef, useState } from 'react';
import Video from 'react-native-video';
import { useGallery } from '../hooks';

export default function MediaViewer({ route }) {
  const navigation = useNavigation();
  const { uri, type, index } = route?.params;
  const { photos: media, refreshing, refresh } = useGallery();
  const videoRef = useRef(null);
  const [paused, setPaused] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [currentItem, setCurrentItem] = useState(uri);
  const isFocused = useIsFocused();
  const indexCounter = useRef(index);
  useEffect(() => {
    if (isFocused) {
      setCurrentItem(uri);
      setCurrentTime(0);
      setPaused(false);
      indexCounter.current = 0;
    }
  }, [isFocused]);
  useEffect(() => {
    if (isFocused) {
      setCurrentTime(0);
      setPaused(false);
    }
  }, [currentItem]);

  const getNextItem = () => {
    if (!media?.length) return;

    indexCounter.current = (indexCounter.current + 1) % media.length; // loop
    const next = media[indexCounter.current];

    console.log('next index', indexCounter.current, 'uri', next);
    setCurrentItem(next);
  };

  const getPreviousItem = () => {
    if (!media?.length) return;

    indexCounter.current =
      (indexCounter.current - 1 + media.length) % media.length; // loop backwards

    const prev = media[indexCounter.current];

    console.log('prev index', indexCounter.current, 'uri', prev);
    setCurrentItem(prev);
  };
  const onProgress = data => {
    setCurrentTime(data.currentTime);
  };

  const forward = () => {
    videoRef.current?.seek(currentTime + 5);
  };

  const rewind = () => {
    const newTime = currentTime - 5 < 0 ? 0 : currentTime - 5;
    videoRef.current?.seek(newTime);
  };

  if (!uri) {
    return (
      <View style={styles.container}>
        <Text>No media selected</Text>
        <Button title="Back" onPress={() => navigation.navigate('Gallary')} />
      </View>
    );
  }
  const isVideo = /\.(mp4|mov|m4v|avi|mkv)$/i.test(currentItem);
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        {!isVideo ? (
          <Image source={{ uri: currentItem }} style={styles.media} />
        ) : (
          <>
            <Video
              ref={videoRef}
              source={{ uri: currentItem }}
              style={styles.media}
              resizeMode="contain"
              paused={paused}
              onProgress={onProgress}
            />

            {/* Video Controls */}
            <View style={styles.controls}>
              <Pressable style={styles.controlBtn} onPress={rewind}>
                <Text style={styles.controlText}>⏪ -5s</Text>
              </Pressable>

              <Pressable
                style={styles.controlBtn}
                onPress={() => setPaused(!paused)}>
                <Text style={styles.controlText}>
                  {paused ? '▶ Play' : '⏸ Pause'}
                </Text>
              </Pressable>

              <Pressable style={styles.controlBtn} onPress={forward}>
                <Text style={styles.controlText}>⏩ +5s</Text>
              </Pressable>
            </View>
          </>
        )}
      </View>
      <View style={[styles.card, { flexDirection: 'row', padding: 20 }]}>
        <Pressable style={styles.controlBtn} onPress={getPreviousItem}>
          <Text style={styles.controlText}>⏪ Previous Media</Text>
        </Pressable>
        <Pressable style={styles.controlBtn} onPress={getNextItem}>
          <Text style={styles.controlText}>Next Media ⏩</Text>
        </Pressable>
      </View>
      <Pressable
        style={styles.controlBtn}
        onPress={() => navigation.navigate('Gallary')}>
        <Text style={styles.controlText}>Back</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(230, 239, 220, 0.84)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
  },
  media: {
    height: 300,
    width: '100%',
    resizeMode: 'contain',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 15,
  },
  controlBtn: {
    backgroundColor: '#333',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 8,
  },
  controlText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
