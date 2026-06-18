import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';

import { colors } from '@/core/theme/colors';

interface Props {
  avatarUrl: string | null;
  fullName: string;
  onPress: () => void;
  isLoading?: boolean;
  cacheKey?: number;
  size?: number;
}

function getInitials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('');
}

export const AvatarPicker = React.memo(function AvatarPicker({
  avatarUrl,
  fullName,
  onPress,
  isLoading = false,
  cacheKey,
  size = 96,
}: Props) {
  const initials = getInitials(fullName) || '?';
  const borderRadius = size / 2;

  return (
    <Pressable
      onPress={onPress}
      disabled={isLoading}
      style={[styles.container, { width: size, height: size, borderRadius }]}
      accessibilityRole="button"
      accessibilityLabel="Изменить фото профиля"
    >
      {avatarUrl ? (
        <Image
          source={{ uri: avatarUrl, cacheKey: cacheKey != null ? String(cacheKey) : undefined }}
          style={[styles.image, { width: size, height: size, borderRadius }]}
          contentFit="cover"
          cachePolicy="memory-disk"
          transition={200}
        />
      ) : (
        <View style={[styles.placeholder, { width: size, height: size, borderRadius }]}>
          <Text style={[styles.initials, { fontSize: size * 0.33 }]}>{initials}</Text>
        </View>
      )}

      {isLoading ? (
        <View style={[styles.overlay, { borderRadius }]}>
          <ActivityIndicator color={colors.textOnBrand} size="small" />
        </View>
      ) : (
        <View style={[styles.editBar, { borderBottomLeftRadius: borderRadius, borderBottomRightRadius: borderRadius }]}>
          <Text style={styles.editLabel}>Изменить</Text>
        </View>
      )}
    </Pressable>
  );
});

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    alignSelf: 'center',
    borderWidth: 2,
    borderColor: colors.border,
  },
  image: {
    position: 'absolute',
  },
  placeholder: {
    backgroundColor: colors.brandSubtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: {
    fontFamily: 'Inter_600SemiBold',
    color: colors.brandText,
  },
  overlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0,0,0,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  editBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 24,
    backgroundColor: 'rgba(0,0,0,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  editLabel: {
    fontFamily: 'Inter_500Medium',
    fontSize: 11,
    color: colors.textOnBrand,
  },
});
