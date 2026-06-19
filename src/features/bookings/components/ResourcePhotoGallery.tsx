import React, { useRef, useState } from 'react';
import {
  Dimensions,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { Image } from 'expo-image';
import { colors } from '@/core/theme/colors';
import type { ResourcePhoto } from '@/features/bookings/types/resource';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const GALLERY_HEIGHT = 260;

interface Props {
  photos: ResourcePhoto[];
  photoUrl: string | null;
}

export const ResourcePhotoGallery = React.memo<Props>(({ photos, photoUrl }) => {
  const sources: string[] =
    photos.length > 0 ? photos.map((p) => p.image_url) : photoUrl ? [photoUrl] : [];

  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<ScrollView>(null);

  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH);
    setActiveIndex(index);
  };

  if (sources.length === 0) {
    console.log('[ResourcePhotoGallery] no sources — photos:', photos.length, 'photoUrl:', photoUrl);
    return null;
  }

  return (
    <View style={styles.wrapper}>
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        bounces={false}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {sources.map((uri, index) => (
          <Image
            key={`photo-${index}`}
            source={{ uri }}
            style={styles.image}
            contentFit="cover"
            transition={200}
          />
        ))}
      </ScrollView>

      {sources.length > 1 && (
        <View style={styles.dotsRow}>
          {sources.map((_, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                i === activeIndex ? styles.dotActive : styles.dotInactive,
              ]}
            />
          ))}
        </View>
      )}
    </View>
  );
});

ResourcePhotoGallery.displayName = 'ResourcePhotoGallery';

const styles = StyleSheet.create({
  wrapper: {
    width: SCREEN_WIDTH,
    height: GALLERY_HEIGHT,
    backgroundColor: colors.raised,
  },
  scrollView: {
    width: SCREEN_WIDTH,
    height: GALLERY_HEIGHT,
  },
  scrollContent: {
    height: GALLERY_HEIGHT,
  },
  image: {
    width: SCREEN_WIDTH,
    height: GALLERY_HEIGHT,
  },
  dotsRow: {
    position: 'absolute',
    bottom: 12,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
  },
  dot: {
    height: 6,
    borderRadius: 3,
  },
  dotActive: {
    width: 18,
    backgroundColor: colors.surface,
  },
  dotInactive: {
    width: 6,
    backgroundColor: colors.surface,
    opacity: 0.5,
  },
});
