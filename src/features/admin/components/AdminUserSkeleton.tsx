import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';

import { colors } from '@/core/theme/colors';

function SkeletonBox({ style }: { style?: object }) {
  const opacity = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 700, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.4, duration: 700, useNativeDriver: true }),
      ]),
    );
    anim.start();
    return () => anim.stop();
  }, [opacity]);

  return <Animated.View style={[styles.box, style, { opacity }]} />;
}

function AdminUserSkeletonRow() {
  return (
    <View style={styles.container}>
      <SkeletonBox style={styles.avatar} />
      <View style={styles.info}>
        <SkeletonBox style={styles.name} />
        <SkeletonBox style={styles.email} />
      </View>
      <SkeletonBox style={styles.badge} />
    </View>
  );
}

interface Props {
  count?: number;
}

export function AdminUserSkeleton({ count = 6 }: Props) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <AdminUserSkeletonRow key={i} />
      ))}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 12,
    gap: 12,
    marginHorizontal: 16,
    marginVertical: 4,
  },
  box: {
    backgroundColor: colors.raised,
    borderRadius: 6,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  info: {
    flex: 1,
    gap: 8,
  },
  name: {
    height: 14,
    width: '60%',
  },
  email: {
    height: 12,
    width: '80%',
  },
  badge: {
    width: 64,
    height: 22,
    borderRadius: 6,
  },
});
