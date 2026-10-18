import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCategories, setSelectedCategory } from '../../store/slices/catalogSlice';
import CategoryCard from '../../components/catalog/CategoryCard';
import SearchBar from '../../components/common/SearchBar';
import { COLORS } from '../../constants/theme';

export function CategoriesScreen({ navigation }) {
  const dispatch = useDispatch();
  const { categories, loading } = useSelector((state) => state.catalog);
  const [search, setSearch] = useState('');

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelectCategory = (cat) => {
    dispatch(setSelectedCategory(cat.slug || cat.name));
    navigation.navigate('SeriesList', { category: cat });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.slate[950]} />

      <View style={styles.header}>
        <Text style={styles.title}>Exam Categories</Text>
        <Text style={styles.subtitle}>Choose your target exam stream to explore curated series</Text>
        
        <SearchBar
          value={search}
          onChangeText={setSearch}
          placeholder="Search categories (e.g. Engineering, Govt...)"
          style={styles.searchBar}
        />
      </View>

      {loading && categories.length === 0 ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={COLORS.brand[400]} />
        </View>
      ) : (
        <FlatList
          data={filteredCategories}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={styles.listContent}
          columnWrapperStyle={styles.columnWrapper}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <CategoryCard
              category={item}
              onPress={() => handleSelectCategory(item)}
              style={styles.categoryCard}
            />
          )}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No categories found matching "{search}"</Text>
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
    paddingBottom: 12,
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
    marginBottom: 4,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 30,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  categoryCard: {
    width: '48%',
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

export default CategoriesScreen;
