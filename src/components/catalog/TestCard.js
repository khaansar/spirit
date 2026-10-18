import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Clock, HelpCircle, Award, ArrowRight } from 'lucide-react-native';
import { COLORS } from '../../constants/theme';
import { useTheme } from '../../context/ThemeContext';

export function TestCard({ test, onStart, style }) {
  const { isDark, theme } = useTheme();

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.colors.card,
          borderColor: theme.colors.cardBorder,
        },
        style,
      ]}
    >
      <View style={styles.topRow}>
        <View
          style={[
            styles.categoryBadge,
            {
              backgroundColor: theme.colors.cardInner,
              borderColor: theme.colors.border,
            },
          ]}
        >
          <Text style={[styles.categoryBadgeText, { color: theme.colors.textSecondary }]}>
            {test.categoryName || 'Mock Test'}
          </Text>
        </View>

        {test.difficulty && (
          <View
            style={[
              styles.difficultyBadge,
              test.difficulty === 'Hard'
                ? styles.diffHard
                : test.difficulty === 'Moderate'
                ? styles.diffMod
                : styles.diffEasy,
            ]}
          >
            <Text style={styles.diffText}>{test.difficulty}</Text>
          </View>
        )}
      </View>

      <Text style={[styles.title, { color: theme.colors.text }]}>{test.title}</Text>

      {/* Test Meta Chips */}
      <View style={styles.metaRow}>
        <View
          style={[
            styles.chip,
            {
              backgroundColor: theme.colors.cardInner,
              borderColor: theme.colors.border,
            },
          ]}
        >
          <Clock size={13} color={theme.colors.textMuted} />
          <Text style={[styles.chipText, { color: theme.colors.textSecondary }]}>
            {test.durationMinutes} mins
          </Text>
        </View>

        <View
          style={[
            styles.chip,
            {
              backgroundColor: theme.colors.cardInner,
              borderColor: theme.colors.border,
            },
          ]}
        >
          <Award size={13} color={theme.colors.textMuted} />
          <Text style={[styles.chipText, { color: theme.colors.textSecondary }]}>
            {test.totalMarks} Marks
          </Text>
        </View>

        <View
          style={[
            styles.chip,
            {
              backgroundColor: theme.colors.cardInner,
              borderColor: theme.colors.border,
            },
          ]}
        >
          <HelpCircle size={13} color={theme.colors.textMuted} />
          <Text style={[styles.chipText, { color: theme.colors.textSecondary }]}>
            {test.totalQuestions || 100} Qs
          </Text>
        </View>
      </View>

      <View style={[styles.divider, { backgroundColor: theme.colors.divider }]} />

      <TouchableOpacity
        style={styles.startButton}
        activeOpacity={0.8}
        onPress={() => onStart(test)}
      >
        <Text style={styles.startButtonText}>Take Mock Test</Text>
        <ArrowRight size={16} color={COLORS.common.white} />
      </TouchableOpacity>
    </View>
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
    marginBottom: 8,
  },
  categoryBadge: {
    backgroundColor: COLORS.slate[800],
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  categoryBadgeText: {
    color: COLORS.slate[300],
    fontSize: 11,
    fontWeight: '600',
  },
  difficultyBadge: {
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  diffEasy: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
  },
  diffMod: {
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
  },
  diffHard: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
  },
  diffText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.slate[200],
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.common.white,
    lineHeight: 22,
    marginBottom: 12,
  },
  metaRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 6,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.slate[950],
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.slate[800],
  },
  chipText: {
    fontSize: 11,
    color: COLORS.slate[300],
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.slate[800],
    marginVertical: 14,
  },
  startButton: {
    backgroundColor: COLORS.brand[600],
    borderRadius: 12,
    height: 44,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  startButtonText: {
    color: COLORS.common.white,
    fontSize: 14,
    fontWeight: '700',
  },
});

export default TestCard;
