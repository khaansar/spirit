import React, { useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import {
  Award,
  Clock,
  Target,
  ArrowRight,
  CheckCircle,
  Sparkles,
} from 'lucide-react-native';

import BrandLogo from '../../components/common/BrandLogo';
import SeriesCard from '../../components/catalog/SeriesCard';
import TestCard from '../../components/catalog/TestCard';
import { COLORS } from '../../constants/theme';
import {
  fetchCategories,
  fetchPopularSeries,
  fetchFeaturedTests,
} from '../../store/slices/catalogSlice';

export function HomeScreen({ navigation }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { categories, popularSeries, featuredTests } = useSelector((state) => state.catalog);

  const userName = user?.name || user?.email?.split('@')[0] || 'Aspirant';

  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchPopularSeries());
    dispatch(fetchFeaturedTests());
  }, [dispatch]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.slate[950]} />

      {/* Top App Bar */}
      <View style={styles.topBar}>
        <BrandLogo size="sm" showTagline={false} />
        <TouchableOpacity
          onPress={() => navigation.navigate('ProfileTab')}
          style={styles.avatarButton}
          activeOpacity={0.7}
        >
          <Text style={styles.avatarText}>{userName.charAt(0).toUpperCase()}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Welcome Banner */}
        <View style={styles.welcomeBanner}>
          <View style={styles.welcomeBadge}>
            <Sparkles size={12} color={COLORS.brand[400]} />
            <Text style={styles.welcomeBadgeText}>READY TO PREPARE</Text>
          </View>
          <Text style={styles.welcomeGreeting}>Welcome back, {userName}!</Text>
          <Text style={styles.welcomeSubtext}>
            Practice full-length papers, identify weak topics, and clear your target cutoff.
          </Text>
        </View>

        {/* Performance Metric Cards */}
        <View style={styles.metricsRow}>
          <View style={styles.metricCard}>
            <View style={[styles.metricIconBox, { backgroundColor: 'rgba(94, 67, 243, 0.15)' }]}>
              <Target size={18} color={COLORS.brand[400]} />
            </View>
            <Text style={styles.metricValue}>12</Text>
            <Text style={styles.metricLabel}>Tests Taken</Text>
          </View>

          <View style={styles.metricCard}>
            <View style={[styles.metricIconBox, { backgroundColor: 'rgba(16, 185, 129, 0.15)' }]}>
              <CheckCircle size={18} color={COLORS.status.success} />
            </View>
            <Text style={styles.metricValue}>78.5%</Text>
            <Text style={styles.metricLabel}>Accuracy</Text>
          </View>

          <View style={styles.metricCard}>
            <View style={[styles.metricIconBox, { backgroundColor: 'rgba(56, 189, 248, 0.15)' }]}>
              <Award size={18} color={COLORS.accent.skyLight} />
            </View>
            <Text style={styles.metricValue}>#142</Text>
            <Text style={styles.metricLabel}>State Rank</Text>
          </View>
        </View>

        {/* Quick Categories Bar */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Exam Categories</Text>
          <TouchableOpacity onPress={() => navigation.navigate('CategoriesTab')} activeOpacity={0.7}>
            <Text style={styles.viewAllText}>View All &rarr;</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesRow}
        >
          {categories.slice(0, 5).map((cat) => (
            <TouchableOpacity
              key={cat.id}
              style={styles.categoryChip}
              onPress={() => navigation.navigate('SeriesList', { category: cat })}
              activeOpacity={0.8}
            >
              <Text style={styles.categoryChipText}>{cat.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Popular Test Series Carousel */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Trending Test Series</Text>
          <TouchableOpacity onPress={() => navigation.navigate('SeriesTab')} activeOpacity={0.7}>
            <Text style={styles.viewAllText}>Browse &rarr;</Text>
          </TouchableOpacity>
        </View>

        {popularSeries.slice(0, 2).map((series) => (
          <SeriesCard
            key={series.id}
            series={series}
            onPress={() => navigation.navigate('SeriesDetail', { seriesId: series.id, series })}
          />
        ))}

        {/* Recommended Mock Tests */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Today's Featured Mocks</Text>
          <Text style={styles.sectionSubtitle}>Handpicked by exam mentors</Text>
        </View>

        {featuredTests.slice(0, 2).map((test) => (
          <TestCard
            key={test.id}
            test={test}
            onStart={(selectedTest) =>
              navigation.navigate('TestInstructions', { test: selectedTest })
            }
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.slate[950],
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.slate[900],
    backgroundColor: COLORS.slate[950],
  },
  avatarButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: COLORS.brand[600],
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: COLORS.brand[400],
  },
  avatarText: {
    color: COLORS.common.white,
    fontWeight: '800',
    fontSize: 16,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  welcomeBanner: {
    backgroundColor: COLORS.slate[900],
    borderRadius: 22,
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS.slate[800],
    marginBottom: 20,
  },
  welcomeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(94, 67, 243, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(94, 67, 243, 0.3)',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  welcomeBadgeText: {
    color: COLORS.brand[400],
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  welcomeGreeting: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.common.white,
  },
  welcomeSubtext: {
    fontSize: 13,
    color: COLORS.slate[400],
    marginTop: 4,
    lineHeight: 18,
  },
  metricsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 24,
  },
  metricCard: {
    flex: 1,
    backgroundColor: COLORS.slate[900],
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.slate[800],
    alignItems: 'center',
  },
  metricIconBox: {
    width: 34,
    height: 34,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  metricValue: {
    fontSize: 17,
    fontWeight: '800',
    color: COLORS.common.white,
  },
  metricLabel: {
    fontSize: 11,
    color: COLORS.slate[400],
    marginTop: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    marginTop: 6,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.common.white,
  },
  sectionSubtitle: {
    fontSize: 12,
    color: COLORS.slate[400],
    marginTop: 2,
  },
  viewAllText: {
    fontSize: 13,
    color: COLORS.brand[400],
    fontWeight: '700',
  },
  categoriesRow: {
    gap: 10,
    paddingBottom: 16,
  },
  categoryChip: {
    backgroundColor: COLORS.slate[900],
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.slate[800],
  },
  categoryChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.slate[200],
  },
});

export default HomeScreen;
