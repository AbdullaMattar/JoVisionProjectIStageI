import { useIsFocused } from '@react-navigation/native';
import {
  Button,
  FlatList,
  Image,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useGallery, useIsAppActive } from '../hooks';
import { Dimensions } from 'react-native';
import { useEffect, useRef, useState } from 'react';
const { width: screenWidth } = Dimensions.get('window');

export default function Slideshow() {
  const isFocused = useIsFocused();
  const isAppActive = useIsAppActive();
  const { photos, refreshing, refresh } = useGallery('Jovision Album');
  const SlideShowRef = useRef();
  const [isPaused, setIsPaused] = useState(false);
  const indexRef = useRef(0);

  useEffect(() => {
    if (isPaused || !isFocused || !isAppActive || photos.length === 0) return;

    const timer = setInterval(() => {
      indexRef.current = (indexRef.current + 1) % photos.length;
      SlideShowRef.current?.scrollToIndex({
        index: indexRef.current,
        animated: true,
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isPaused, isFocused, isAppActive, photos.length]);

  if (!isFocused || !isAppActive) return <></>;
  return (
    <View style={styles.container}>
      {/* <Text>Slideshow</Text> */}
      <FlatList
        indicatorStyle="black"
        ref={SlideShowRef}
        horizontal={true}
        data={photos}
        keyExtractor={uri => uri}
        renderItem={({ item }) => (
          <Image source={{ uri: item }} style={styles.img} />
        )}
        ListEmptyComponent={<Text style={styles.empty}>No photos yet </Text>}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={refresh} />
        }
        pagingEnabled={true}
        scrollEnabled={false}
        contentContainerStyle={{ alignItems: 'center', flexGrow: 1 }}
        // snapToInterval={screenWidth - 20}
        // decelerationRate="normal"
      />
      <View>
        <Button
          title={isPaused ? 'Resume' : 'Pause'}
          onPress={() => setIsPaused(!isPaused)}
        />
      </View>
    </View>
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
  title: {
    fontSize: 18,
    fontWeight: '700',
    margin: 1,
  },
  img: {
    width: screenWidth - 20,
    aspectRatio: 1,
    // marginTop: 200,
    resizeMode: 'contain',
  },
  empty: { marginTop: 20, textAlign: 'center' },
});
