import React, { useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { BookingsStackParamList } from '@/app/navigation/routes';
import { Routes } from '@/app/navigation/routes';
import { colors } from '@/core/theme/colors';
import { ResourceCard } from '@/features/bookings/components/ResourceCard';
import { BookingFilterChips } from '@/features/bookings/components/BookingFilterChips';
import { ResourceCatalogSkeleton } from '@/features/bookings/components/ResourceCatalogSkeleton';
import { useResources } from '@/features/bookings/hooks/useResources';
import type { Resource } from '@/features/bookings/types/resource';
import type { ResourceFilters } from '@/features/bookings/hooks/useResources';

type Nav = NativeStackNavigationProp<BookingsStackParamList>;

// ─── Filter header ────────────────────────────────────────────────────────────

interface HeaderProps {
  filters: ResourceFilters;
  floors: { id: number; label: string }[];
  handlers: ReturnType<typeof useResources>['handlers'];
}

function CatalogHeader({ filters, floors, handlers }: HeaderProps) {
  return (
    <View style={headerStyles.container}>
      <Text style={headerStyles.title}>Каталог ресурсов</Text>

      {/* Search */}
      <View style={headerStyles.searchRow}>
        <Ionicons name="search-outline" size={18} color={colors.textMuted} />
        <TextInput
          style={headerStyles.searchInput}
          placeholder="Поиск по названию..."
          placeholderTextColor={colors.textSubtle}
          value={filters.search}
          onChangeText={handlers.onSearchChange}
          returnKeyType="search"
          clearButtonMode="while-editing"
        />
        {filters.search.length > 0 && (
          <TouchableOpacity onPress={() => handlers.onSearchChange('')} hitSlop={8}>
            <Ionicons name="close-circle" size={18} color={colors.textMuted} />
          </TouchableOpacity>
        )}
      </View>

      {/* Type + floor chips */}
      <BookingFilterChips
        selectedType={filters.type}
        onTypeChange={handlers.onTypeChange}
        floors={floors.length > 0 ? floors : undefined}
        selectedFloor={filters.floor}
        onFloorChange={handlers.onFloorChange}
      />

      {/* Capacity stepper — only for meeting_room */}
      {filters.type === 'meeting_room' && (
        <View style={headerStyles.capacityRow}>
          <Text style={headerStyles.capacityLabel}>Вместимость:</Text>
          <TouchableOpacity
            style={[
              headerStyles.stepBtn,
              filters.capacityMin === 0 && headerStyles.stepBtnDisabled,
            ]}
            onPress={handlers.onCapacityDecrement}
            disabled={filters.capacityMin === 0}
            hitSlop={8}
          >
            <Text style={headerStyles.stepBtnText}>−</Text>
          </TouchableOpacity>
          <Text style={headerStyles.capacityValue}>
            {filters.capacityMin === 0 ? 'Любая' : `≥ ${filters.capacityMin} чел.`}
          </Text>
          <TouchableOpacity
            style={headerStyles.stepBtn}
            onPress={handlers.onCapacityIncrement}
            hitSlop={8}
          >
            <Text style={headerStyles.stepBtnText}>+</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const headerStyles = StyleSheet.create({
  container: {
    paddingTop: 16,
    paddingBottom: 12,
    gap: 12,
  },
  title: {
    fontFamily: 'Inter_700Bold',
    fontSize: 22,
    color: colors.textPrimary,
    paddingHorizontal: 16,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    marginHorizontal: 16,
    paddingHorizontal: 12,
    paddingVertical: 9,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: colors.textPrimary,
    padding: 0,
  },
  capacityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    gap: 10,
  },
  capacityLabel: {
    fontFamily: 'Inter_500Medium',
    fontSize: 13,
    color: colors.textSecondary,
    flex: 1,
  },
  stepBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: colors.raised,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepBtnDisabled: {
    opacity: 0.4,
  },
  stepBtnText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 18,
    color: colors.textPrimary,
    lineHeight: 22,
  },
  capacityValue: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
    color: colors.textPrimary,
    minWidth: 80,
    textAlign: 'center',
  },
});

// ─── Empty state ──────────────────────────────────────────────────────────────

function EmptyState() {
  return (
    <View style={emptyStyles.container}>
      <Ionicons name="calendar-outline" size={48} color={colors.textSubtle} />
      <Text style={emptyStyles.text}>Нет ресурсов по фильтрам</Text>
      <Text style={emptyStyles.sub}>Попробуйте изменить параметры поиска</Text>
    </View>
  );
}

const emptyStyles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 32,
    gap: 10,
  },
  text: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  sub: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    color: colors.textMuted,
    textAlign: 'center',
  },
});

// ─── Footer ───────────────────────────────────────────────────────────────────

function ListFooter({ isFetchingMore }: { isFetchingMore: boolean }) {
  if (!isFetchingMore) return null;
  return (
    <View style={footerStyles.container}>
      <ActivityIndicator color={colors.brand} />
    </View>
  );
}

const footerStyles = StyleSheet.create({
  container: {
    paddingVertical: 16,
    alignItems: 'center',
  },
});

// ─── Screen ───────────────────────────────────────────────────────────────────

export function ResourceCatalogScreen() {
  const {
    resources,
    floors,
    filters,
    isLoading,
    isRefreshing,
    isFetchingMore,
    handlers,
  } = useResources();

  const navigation = useNavigation<Nav>();

  const renderItem = useCallback(
    ({ item }: { item: Resource }) => (
      <ResourceCard
        resource={item}
        onPress={() => navigation.navigate(Routes.ResourceDetail, { resourceId: item.id })}
      />
    ),
    [navigation],
  );

  const keyExtractor = useCallback((item: Resource) => String(item.id), []);

  const listHeader = (
    <CatalogHeader filters={filters} floors={floors} handlers={handlers} />
  );

  const listEmpty = isLoading ? (
    <ResourceCatalogSkeleton />
  ) : (
    <EmptyState />
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <FlatList
        data={isLoading ? [] : resources}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        contentContainerStyle={styles.content}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListHeaderComponent={listHeader}
        ListEmptyComponent={listEmpty}
        ListFooterComponent={<ListFooter isFetchingMore={isFetchingMore} />}
        onEndReached={handlers.onLoadMore}
        onEndReachedThreshold={0.3}
        keyboardShouldPersistTaps="handled"
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handlers.onRefresh}
            tintColor={colors.brand}
            colors={[colors.brand]}
          />
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.page,
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  separator: {
    height: 12,
  },
});
