import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Clock, Star, BookOpen, ChevronRight } from 'lucide-react-native';
import { COLORS } from '../../constants/theme';

export function SeriesCard({ series, onPress, style }) {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={[styles.card, style]}
    >
      <View style={styles.topRow}>
        {series.badge ? (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{series.badge.toUpperCase()}</Text>
          </View>
        ) : (
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryBadgeText}>{series.categoryName || 'Test Series'}</Text>
          </View>
        )}

        {series.avgRating && (
          <View style={styles.ratingBadge}>
            <Star size={12} color="#f59e0b" fill="#f59e0b" />
            <Text style={styles.ratingText}>{series.avgRating}</Text>
          </View>
        )}
      </View>

      <Text style={styles.title} numberOfLines={2}>
        {series.title}
      </Text>

      {series.description && (
        <Text style={styles.description} numberOfLines={2}>
          {series.description}
        </Text>
      )}

      <View style={styles.divider} />

      <View style={styles.footerRow}>
        <View style={styles.metaItem}>
          <BookOpen size={14} color={COLORS.slate[400]} />
          <Text style={styles.metaText}>{series.testCount || 10} Mock Tests</Text>
        </View>

        <View style={styles.metaItem}>
          <Clock size={14} color={COLORS.slate[400]} />
          <Text style={styles.metaText}>{series.durationMinutes || 60} mins</Text>
        </View>

        <View style={styles.ctaButton}>
          <Text style={styles.ctaText}>Explore</Text>
          <ChevronRight size={14} color={COLORS.brand[400]} />
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.slate[900],
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: COLORS.slate[800],
    marginBottom: 14,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  badge: {
    backgroundColor: 'rgba(94, 67, 243, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(94, 67, 243, 0.3)',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  badgeText: {
    color: COLORS.brand[400],
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  categoryBadge: {
    backgroundColor: COLORS.slate[800],
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  categoryBadgeText: {
    color: COLORS.slate[300],
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
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.common.white,
    lineHeight: 22,
    marginBottom: 6,
  },
  description: {
    fontSize: 12,
    color: COLORS.slate[400],
    lineHeight: 17,
    marginBottom: 6,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.slate[800],
    marginVertical: 12,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  metaText: {
    fontSize: 12,
    color: COLORS.slate[400],
    fontWeight: '500',
  },
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  ctaText: {
    color: COLORS.brand[400],
    fontSize: 13,
    fontWeight: '700',
  },
});

export default SeriesCard;
