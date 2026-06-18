import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '@/core/theme/colors';

interface Props {
  title: string;
  onSeeAll?: () => void;
}

export function SectionHeader({ title, onSeeAll }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {onSeeAll ? (
        <Pressable
          hitSlop={8}
          style={({ pressed }) => pressed && styles.pressed}
          onPress={onSeeAll}
        >
          <Text style={styles.seeAll}>Все</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 6,
  },
  title: {
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
    color: colors.textPrimary,
  },
  seeAll: {
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
    color: colors.brandText,
  },
  pressed: {
    opacity: 0.6,
  },
});
