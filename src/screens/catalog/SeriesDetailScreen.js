import React, { useEffect, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { ArrowLeft, BookOpen, Clock, Star, ShieldCheck } from 'lucide-react-native';

import TestCard from '../../components/catalog/TestCard';
import { COLORS } from '../../constants/theme';
import { useTheme } from '../../context/ThemeContext';
import { fetchSeriesDetail } from '../../store/slices/catalogSlice';

export function SeriesDetailScreen({ route, navigation }) {
  const dispatch = useDispatch();
  const { isDark, theme } = useTheme();
  const styles = useMemo(() => getStyles(theme, isDark), [theme, isDark]);

  const { seriesId, series: fallbackSeries } = route.params || {};
  const { currentSeries, loading } = useSelector((state) => state.catalog);

  const seriesData = currentSeries || fallbackSeries || {};

  useEffect(() => {
    if (seriesId) {
      dispatch(fetchSeriesDetail(seriesId));
    }
  }, [dispatch, seriesId]);

  const rawTests = currentSeries?.mockTests || currentSeries?.tests || seriesData?.mockTests || seriesData?.tests || [];
  const testsList = rawTests.length > 0
    ? rawTests.map((t) => ({
        ...t,
        id: t.testId || t.id,
        categoryName: t.categoryName || seriesData.categoryName || 'General',
      }))
    : [
        {
          id: 'dfc9d8e2-33a2-4f66-b0c7-5c71278616a8',
          title: `${seriesData.title || 'Mock Exam'} - All India Mock #01`,
          categoryName: seriesData.categoryName || 'General',
          durationMinutes: seriesData.durationMinutes || 60,
          totalMarks: 200,
          totalQuestions: 100,
          difficulty: 'Moderate',
        },
        {
          id: '28491461-5978-4a72-a2ba-3a467d4a6ae5',
          title: `${seriesData.title || 'Mock Exam'} - Sectional Practice #02`,
          categoryName: seriesData.categoryName || 'General',
          durationMinutes: 45,
          totalMarks: 50,
          totalQuestions: 25,
          difficulty: 'Hard',
        },
        {
          id: '8f085de9-f0b2-40f2-b90b-1171217183e2',
          title: `${seriesData.title || 'Mock Exam'} - Speed Drill #03`,
          categoryName: seriesData.categoryName || 'General',
          durationMinutes: 30,
          totalMarks: 50,
          totalQuestions: 25,
          difficulty: 'Easy',
        },
      ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={theme.colors.bg} />

      {/* Top Header Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <ArrowLeft size={20} color={COLORS.slate[200]} />
        </TouchableOpacity>
        <Text style={styles.topBarTitle} numberOfLines={1}>
          {seriesData.title || 'Series Detail'}
        </Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Series Hero Card */}
        <View style={styles.heroCard}>
          <View style={styles.heroBadgeRow}>
            {seriesData.badge && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{seriesData.badge.toUpperCase()}</Text>
              </View>
            )}
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryBadgeText}>{seriesData.categoryName || 'Test Series'}</Text>
            </View>

            {seriesData.avgRating && (
              <View style={styles.ratingBadge}>
                <Star size={12} color="#f59e0b" fill="#f59e0b" />
                <Text style={styles.ratingText}>{seriesData.avgRating} / 5.0</Text>
              </View>
            )}
          </View>

          <Text style={styles.seriesTitle}>{seriesData.title}</Text>
          <Text style={styles.seriesDesc}>
            {seriesData.description ||
              'Complete test package created by top educators with instant analytics, percentile rankings, and detailed answer keys.'}
          </Text>

          {/* Key Stats Row */}
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <BookOpen size={16} color={COLORS.brand[400]} />
              <Text style={styles.statValue}>{seriesData.testCount || testsList.length} Mock Tests</Text>
            </View>

            <View style={styles.statItem}>
              <Clock size={16} color={COLORS.accent.skyLight} />
              <Text style={styles.statValue}>{seriesData.durationMinutes || 60} mins per test</Text>
            </View>

            <View style={styles.statItem}>
              <ShieldCheck size={16} color={COLORS.status.success} />
              <Text style={styles.statValue}>Latest Pattern</Text>
            </View>
          </View>
        </View>

        {/* Section Header */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Available Tests</Text>
          <Text style={styles.sectionSubtitle}>
            Select a test to view full instructions and begin your attempt
          </Text>
        </View>

        {/* Tests List */}
        {loading && !currentSeries ? (
          <ActivityIndicator size="small" color={COLORS.brand[400]} style={{ marginTop: 20 }} />
        ) : (
          testsList.map((test) => (
            <TestCard
              key={test.id}
              test={test}
              onStart={(selectedTest) =>
                navigation.navigate('TestInstructions', { test: selectedTest, series: seriesData })
              }
            />
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const getStyles = (theme, isDark) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: theme.colors.bg,
    },
    topBar: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
      backgroundColor: theme.colors.topBarBg,
    },
    backButton: {
      width: 40,
      height: 40,
      borderRadius: 12,
      backgroundColor: theme.colors.cardInner,
      borderWidth: 1,
      borderColor: theme.colors.border,
      justifyContent: 'center',
      alignItems: 'center',
    },
    topBarTitle: {
      fontSize: 16,
      fontWeight: '700',
      color: theme.colors.text,
      maxWidth: '70%',
      textAlign: 'center',
    },
    scrollContent: {
      padding: 20,
      paddingBottom: 40,
    },
    heroCard: {
      backgroundColor: theme.colors.card,
      borderRadius: 24,
      padding: 20,
      borderWidth: 1,
      borderColor: theme.colors.cardBorder,
      marginBottom: 24,
    },
    heroBadgeRow: {
      flexDirection: 'row',
      gap: 8,
      alignItems: 'center',
      marginBottom: 12,
    },
    badge: {
      backgroundColor: theme.colors.badgeBg,
      borderWidth: 1,
      borderColor: theme.colors.badgeBorder,
      borderRadius: 8,
      paddingHorizontal: 8,
      paddingVertical: 3,
    },
    badgeText: {
      color: COLORS.brand[400],
      fontSize: 10,
      fontWeight: '800',
    },
    categoryBadge: {
      backgroundColor: theme.colors.cardInner,
      borderRadius: 8,
      paddingHorizontal: 8,
      paddingVertical: 3,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    categoryBadgeText: {
      color: theme.colors.textSecondary,
      fontSize: 10,
      fontWeight: '600',
    },
    ratingBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      backgroundColor: 'rgba(245, 158, 11, 0.12)',
      paddingHorizontal: 8,
      paddingVertical: 3,
      borderRadius: 8,
    },
    ratingText: {
      color: '#fbbf24',
      fontSize: 11,
      fontWeight: '700',
    },
    seriesTitle: {
      fontSize: 20,
      fontWeight: '800',
      color: theme.colors.text,
      lineHeight: 26,
      marginBottom: 8,
    },
    seriesDesc: {
      fontSize: 13,
      color: theme.colors.textMuted,
      lineHeight: 19,
      marginBottom: 16,
    },
    statsRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 12,
      paddingTop: 12,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border,
    },
    statItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },
    statValue: {
      fontSize: 12,
      fontWeight: '600',
      color: theme.colors.textSecondary,
    },
    sectionHeader: {
      marginBottom: 14,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '700',
      color: theme.colors.text,
    },
    sectionSubtitle: {
      fontSize: 12,
      color: theme.colors.textMuted,
      marginTop: 2,
    },
  });

export default SeriesDetailScreen;
