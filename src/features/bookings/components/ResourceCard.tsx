import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { colors } from '@/core/theme/colors';
import { ResourceStatusBadge } from '@/features/bookings/components/ResourceStatusBadge';
import { ResourceTypeChip } from '@/features/bookings/components/ResourceTypeChip';
import type { Resource } from '@/features/bookings/types/resource';

interface Props {
  resource: Resource;
  onPress?: () => void;
}

export const ResourceCard = React.memo<Props>(({ resource, onPress }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      <Image
        source={resource.photoUrl ? { uri: resource.photoUrl } : null}
        style={styles.photo}
        contentFit="cover"
      />
      <View style={styles.body}>
        <View style={styles.row}>
          <Text style={styles.name} numberOfLines={1}>
            {resource.name}
          </Text>
          <ResourceTypeChip type={resource.type} />
        </View>
        <Text style={styles.floor}>
          {resource.floor_name}
          {resource.capacity != null ? ` · до ${resource.capacity} чел.` : ''}
        </Text>
        <ResourceStatusBadge
          status={resource.status}
          reason={resource.reason}
          availableAt={resource.availableAt}
        />
      </View>
    </TouchableOpacity>
  );
});

ResourceCard.displayName = 'ResourceCard';

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
  },
  photo: {
    height: 140,
    width: '100%',
    backgroundColor: colors.raised,
  },
  body: {
    padding: 12,
    gap: 6,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  name: {
    flex: 1,
    fontFamily: 'Inter_600SemiBold',
    fontSize: 15,
    color: colors.textPrimary,
  },
  floor: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: colors.textMuted,
  },
});
