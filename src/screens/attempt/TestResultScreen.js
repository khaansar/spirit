import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Award,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ArrowRight,
  TrendingUp,
  Trophy,
  FileText,
} from 'lucide-react-native';

import { COLORS } from '../../constants/theme';

export function TestResultScreen({ route, navigation }) {
  const { result } = route.params || {};

  const attemptId = result?.attemptId || 'att-101';
  const score = result?.score ?? 16;
  const totalMarks = result?.totalMarks ?? 20;
  const accuracy = result?.accuracy ?? 80;
  const percentile = result?.percentile ?? 92.4;
  const rank = result?.rank ?? 14;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.slate[950]} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Success Header */}
        <View style={styles.headerBox}>
          <View style={styles.trophyCircle}>
            <Award size={40} color={COLORS.brand[400]} />
          </View>
          <Text style={styles.title}>Test Submitted!</Text>
          <Text style={styles.subtitle}>
            Your responses have been recorded and evaluated successfully.
          </Text>
        </View>

        {/* Scorecard Hero Banner */}
        <View style={styles.scoreCard}>
          <View style={styles.scoreRow}>
            <View>
              <Text style={styles.scoreLabel}>TOTAL SCORE</Text>
              <View style={styles.scoreValueRow}>
                <Text style={styles.scoreBig}>{score}</Text>
                <Text style={styles.scoreMax}> / {totalMarks}</Text>
              </View>
            </View>

            <View style={styles.percentileBadge}>
              <TrendingUp size={16} color={COLORS.status.success} />
              <Text style={styles.percentileText}>{percentile}%tile</Text>
            </View>
          </View>

          <View style={styles.scoreDivider} />

          {/* Metrics Grid */}
          <View style={styles.metricGrid}>
            <View style={styles.metricItem}>
              <Text style={styles.metricVal}>#{rank}</Text>
              <Text style={styles.metricLbl}>All India Rank</Text>
            </View>

            <View style={styles.metricItem}>
              <Text style={styles.metricVal}>{accuracy}%</Text>
              <Text style={styles.metricLbl}>Accuracy</Text>
            </View>

            <View style={styles.metricItem}>
              <Text style={styles.metricVal}>24m 12s</Text>
              <Text style={styles.metricLbl}>Time Taken</Text>
            </View>
          </View>
        </View>

        {/* Question Performance Breakdown */}
        <View style={styles.breakdownCard}>
          <Text style={styles.breakdownTitle}>Question Analysis</Text>

          <View style={styles.breakdownRow}>
            <View style={styles.breakdownLeft}>
              <CheckCircle2 size={18} color={COLORS.status.success} />
              <Text style={styles.breakdownText}>Correct Answers</Text>
            </View>
            <Text style={[styles.breakdownCount, { color: COLORS.status.success }]}>
              8
            </Text>
          </View>

          <View style={styles.breakdownRow}>
            <View style={styles.breakdownLeft}>
              <XCircle size={18} color="#ef4444" />
              <Text style={styles.breakdownText}>Incorrect Answers</Text>
            </View>
            <Text style={[styles.breakdownCount, { color: '#ef4444' }]}>2</Text>
          </View>

          <View style={styles.breakdownRow}>
            <View style={styles.breakdownLeft}>
              <HelpCircle size={18} color={COLORS.slate[400]} />
              <Text style={styles.breakdownText}>Unattempted</Text>
            </View>
            <Text style={[styles.breakdownCount, { color: COLORS.slate[400] }]}>0</Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          {/* Review Solutions Button */}
          <TouchableOpacity
            style={styles.primaryBtn}
            onPress={() => navigation.navigate('SolutionsReview', { attemptId })}
            activeOpacity={0.8}
          >
            <FileText size={18} color={COLORS.common.white} />
            <Text style={styles.primaryBtnText}>Review Solutions & Explanations</Text>
            <ArrowRight size={18} color={COLORS.common.white} />
          </TouchableOpacity>

          {/* View Leaderboard Button */}
          <TouchableOpacity
            style={styles.secondaryBtn}
            onPress={() => navigation.navigate('Leaderboard', { testSlug: 'mock-cgl-01' })}
            activeOpacity={0.7}
          >
            <Trophy size={16} color={COLORS.brand[400]} />
            <Text style={styles.secondaryBtnText}>View All-India Leaderboard</Text>
          </TouchableOpacity>

          {/* Return to Dashboard */}
          <TouchableOpacity
            style={styles.ghostBtn}
            onPress={() => navigation.navigate('MainTabs', { screen: 'HomeTab' })}
            activeOpacity={0.7}
          >
            <Text style={styles.ghostBtnText}>Return to Dashboard</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.slate[950],
  },
  scrollContent: {
    padding: 20,
    paddingTop: 30,
    paddingBottom: 40,
  },
  headerBox: {
    alignItems: 'center',
    marginBottom: 24,
  },
  trophyCircle: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: 'rgba(94, 67, 243, 0.15)',
    borderWidth: 2,
    borderColor: COLORS.brand[500],
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: COLORS.common.white,
  },
  subtitle: {
    fontSize: 13,
    color: COLORS.slate[400],
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 18,
    paddingHorizontal: 20,
  },
  scoreCard: {
    backgroundColor: COLORS.slate[900],
    borderRadius: 24,
    padding: 22,
    borderWidth: 1,
    borderColor: COLORS.slate[800],
    marginBottom: 18,
  },
  scoreRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  scoreLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.slate[400],
    letterSpacing: 1,
  },
  scoreValueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: 4,
  },
  scoreBig: {
    fontSize: 38,
    fontWeight: '900',
    color: COLORS.common.white,
  },
  scoreMax: {
    fontSize: 18,
    color: COLORS.slate[400],
    fontWeight: '600',
  },
  percentileBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  percentileText: {
    color: COLORS.status.success,
    fontSize: 12,
    fontWeight: '700',
  },
  scoreDivider: {
    height: 1,
    backgroundColor: COLORS.slate[800],
    marginVertical: 18,
  },
  metricGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metricItem: {
    alignItems: 'center',
    flex: 1,
  },
  metricVal: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.common.white,
  },
  metricLbl: {
    fontSize: 11,
    color: COLORS.slate[400],
    marginTop: 2,
  },
  breakdownCard: {
    backgroundColor: COLORS.slate[900],
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: COLORS.slate[800],
    marginBottom: 24,
  },
  breakdownTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.common.white,
    marginBottom: 14,
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.slate[800],
  },
  breakdownLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  breakdownText: {
    fontSize: 13,
    color: COLORS.slate[300],
  },
  breakdownCount: {
    fontSize: 15,
    fontWeight: '800',
  },
  actionButtons: {
    gap: 12,
  },
  primaryBtn: {
    backgroundColor: COLORS.brand[600],
    height: 52,
    borderRadius: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    shadowColor: COLORS.brand[600],
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryBtnText: {
    color: COLORS.common.white,
    fontSize: 14,
    fontWeight: '700',
  },
  secondaryBtn: {
    backgroundColor: COLORS.slate[900],
    height: 50,
    borderRadius: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: COLORS.slate[800],
  },
  secondaryBtnText: {
    color: COLORS.brand[400],
    fontSize: 14,
    fontWeight: '700',
  },
  ghostBtn: {
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ghostBtnText: {
    color: COLORS.slate[400],
    fontSize: 13,
    fontWeight: '600',
  },
});

export default TestResultScreen;
