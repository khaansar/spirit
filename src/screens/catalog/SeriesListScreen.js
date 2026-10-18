import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPopularSeries, fetchCategories } from '../../store/slices/catalogSlice';
import SeriesCard from '../../components/catalog/SeriesCard';
import SearchBar from '../../components/common/SearchBar';
import { COLORS } from '../../constants/theme';

export function SeriesListScreen({ route, navigation }) {
  const dispatch = useDispatch();
  const { popularSeries, categories, loading } = useSelector((state) => state.catalog);

  const initialCategory = route?.params?.category?.name || 'All';
  const [selectedFilter, setSelectedFilter] = useState(initialCategory);
  const [search, setSearch] = useState('');

  useEffect(() => {
    dispatch(fetchPopularSeries());
    if (categories.length === 0) {
      dispatch(fetchCategories());
    }
  }, [dispatch, categories.length]);

  const filterChips = ['All', ...categories.map((c) => c.name)];

  const filteredSeries = popularSeries.filter((series) => {
    const matchesCategory =
      selectedFilter === 'All' ||
      series.categoryName?.toLowerCase() === selectedFilter.toLowerCase() ||
      series.title?.toLowerCase().includes(selectedFilter.toLowerCase());

    const matchesSearch =
      search.trim() === '' ||
      series.title.toLowerCase().includes(search.toLowerCase()) ||
      (series.description && series.description.toLowerCase().includes(search.toLowerCase()));

    return matchesCategory && matchesSearch;
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.slate[950]} />

      <View style={styles.header}>
        <Text style={styles.title}>Test Series</Text>
        <Text style={styles.subtitle}>Full-length and sectional test series crafted by exam toppers</Text>

        <SearchBar
          value={search}
          onChangeText={setSearch}
          placeholder="Search test series..."
          style={styles.searchBar}
        />

        {/* Filter Chips Horizontal Carousel */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterChipsRow}
        >
          {filterChips.map((chip, idx) => {
            const isSelected = selectedFilter.toLowerCase() === chip.toLowerCase();
            return (
              <TouchableOpacity
                key={idx}
                onPress={() => setSelectedFilter(chip)}
                style={[styles.chip, isSelected && styles.chipSelected]}
                activeOpacity={0.7}
              >
                <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
                  {chip}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {loading && popularSeries.length === 0 ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={COLORS.brand[400]} />
        </View>
      ) : (
        <FlatList
          data={filteredSeries}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <SeriesCard
              series={item}
              onPress={() => navigation.navigate('SeriesDetail', { seriesId: item.id, series: item })}
            />
          )}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No test series found for this filter</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.slate[950],
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.common.white,
  },
  subtitle: {
    fontSize: 13,
    color: COLORS.slate[400],
    marginTop: 4,
    marginBottom: 16,
  },
  searchBar: {
    marginBottom: 14,
  },
  filterChipsRow: {
    gap: 8,
    paddingBottom: 6,
  },
  chip: {
    backgroundColor: COLORS.slate[900],
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.slate[800],
  },
  chipSelected: {
    backgroundColor: COLORS.brand[600],
    borderColor: COLORS.brand[600],
  },
  chipText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.slate[300],
  },
  chipTextSelected: {
    color: COLORS.common.white,
    fontWeight: '700',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 30,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  emptyText: {
    color: COLORS.slate[400],
    fontSize: 14,
  },
});

export default SeriesListScreen;
