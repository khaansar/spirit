import React, { useState, useEffect } from 'react';
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
import {
  Award,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ArrowRight,
  TrendingUp,
  Trophy,
  FileText,
  BarChart3,
  Medal,
  Sparkles,
} from 'lucide-react-native';

import { COLORS } from '../../constants/theme';
import apiClient from '../../api/client';

export function TestResultScreen({ route, navigation }) {
  const { result: initialResult, attemptId: routeAttemptId } = route.params || {};

  const hasValidReport = !!(initialResult?.summary && (initialResult.summary.totalScore !== undefined || initialResult.sectionBreakdown));
  const effectiveAttemptId = initialResult?.metadata?.attemptId || initialResult?.attemptId || routeAttemptId;

  const [result, setResult] = useState(hasValidReport ? initialResult : null);
  const [loading, setLoading] = useState(!hasValidReport && !!effectiveAttemptId);

  const attemptId = result?.metadata?.attemptId || result?.attemptId || effectiveAttemptId || 'REPORT';

  useEffect(() => {
    if (!result && effectiveAttemptId) {
      let isMounted = true;
      let retries = 0;
      const maxRetries = 8;

      const pollReport = async () => {
        try {
          const res = await apiClient.get(`/analytics-api/reports/${effectiveAttemptId}`);
          if (res && (res.summary || res.metadata)) {
            if (isMounted) {
              setResult(res);
              setLoading(false);
            }
            return;
          }
        } catch (err) {
          // Report may still be compiling on Kafka worker
        }

        retries++;
        if (retries < maxRetries && isMounted) {
          setTimeout(pollReport, 1500);
        } else if (isMounted) {
          setLoading(false);
        }
      };

      pollReport();

      return () => {
        isMounted = false;
      };
    }
  }, [effectiveAttemptId, result]);

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="light-content" backgroundColor={COLORS.slate[950]} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.brand[400]} />
          <Text style={styles.loadingText}>Generating Performance Scorecard...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const summary = result?.summary || result || {};
  const sections = Array.isArray(result?.sectionBreakdown)
    ? result.sectionBreakdown
    : Array.isArray(result?.sections)
    ? result.sections
    : [];
  const peer = result?.peerComparison;

  const score = Number(summary?.totalScore ?? summary?.score ?? 0);
  const totalMarks = Number(summary?.maxScore ?? summary?.totalMarks ?? 100);
  const accuracy = Math.round(Number(summary?.accuracyPercentage ?? summary?.accuracy ?? 0));
  const percentile = summary?.percentile != null ? Number(summary.percentile).toFixed(1) : null;
  const rank = summary?.rank ? `#${summary.rank}` : 'Evaluated';

  // Format time taken
  const timeSeconds = Number(summary?.timeSpentSeconds || summary?.timeTakenSeconds || 0);
  const formatTime = (secs) => {
    if (!secs || secs <= 0) return '—';
    const m = Math.floor(secs / 60);
    const s = Math.round(secs % 60);
    return `${m}m ${s}s`;
  };

  // Dynamic counts across sections if available
  const totalCorrect = sections.length > 0
    ? sections.reduce((acc, s) => acc + (Number(s.correct) || 0), 0)
    : (result?.correctCount ?? result?.correct ?? '—');

  const totalIncorrect = sections.length > 0
    ? sections.reduce((acc, s) => acc + (Number(s.incorrect) || 0), 0)
    : (result?.incorrectCount ?? result?.incorrect ?? '—');

  const totalUnattempted = sections.length > 0
    ? sections.reduce((acc, s) => acc + (Number(s.unattempted) || 0), 0)
    : (result?.unattemptedCount ?? result?.unattempted ?? '—');

  const totalQuestions = typeof totalCorrect === 'number' && typeof totalIncorrect === 'number' && typeof totalUnattempted === 'number'
    ? totalCorrect + totalIncorrect + totalUnattempted
    : 0;

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
            Your responses have been recorded and evaluated by the exam server.
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

            {percentile !== null && (
              <View style={styles.percentileBadge}>
                <TrendingUp size={16} color={COLORS.status.success} />
                <Text style={styles.percentileText}>{percentile}%tile</Text>
              </View>
            )}
          </View>

          <View style={styles.scoreDivider} />

          {/* Metrics Grid */}
          <View style={styles.metricGrid}>
            <View style={styles.metricItem}>
              <Text style={styles.metricVal}>{rank}</Text>
              <Text style={styles.metricLbl}>All India Rank</Text>
            </View>

            <View style={styles.metricItem}>
              <Text style={styles.metricVal}>{accuracy}%</Text>
              <Text style={styles.metricLbl}>Accuracy</Text>
            </View>

            <View style={styles.metricItem}>
              <Text style={styles.metricVal}>{formatTime(timeSeconds)}</Text>
              <Text style={styles.metricLbl}>Time Taken</Text>
            </View>
          </View>
        </View>

        {/* Question Performance Breakdown */}
        <View style={styles.breakdownCard}>
          <Text style={styles.breakdownTitle}>Question Analysis</Text>

          {totalQuestions > 0 && (
            <View style={styles.statusBarContainer}>
              <View
                style={[
                  styles.statusBarSegment,
                  { flex: totalCorrect, backgroundColor: COLORS.status.success },
                ]}
              />
              <View
                style={[
                  styles.statusBarSegment,
                  { flex: totalIncorrect, backgroundColor: '#ef4444' },
                ]}
              />
              <View
                style={[
                  styles.statusBarSegment,
                  { flex: totalUnattempted, backgroundColor: COLORS.slate[700] },
                ]}
              />
            </View>
          )}

          <View style={styles.breakdownRow}>
            <View style={styles.breakdownLeft}>
              <CheckCircle2 size={18} color={COLORS.status.success} />
              <Text style={styles.breakdownText}>Correct Answers</Text>
            </View>
            <Text style={[styles.breakdownCount, { color: COLORS.status.success }]}>
              {totalCorrect}
            </Text>
          </View>

          <View style={styles.breakdownRow}>
            <View style={styles.breakdownLeft}>
              <XCircle size={18} color="#ef4444" />
              <Text style={styles.breakdownText}>Incorrect Answers</Text>
            </View>
            <Text style={[styles.breakdownCount, { color: '#ef4444' }]}>{totalIncorrect}</Text>
          </View>

          <View style={styles.breakdownRow}>
            <View style={styles.breakdownLeft}>
              <HelpCircle size={18} color={COLORS.slate[400]} />
              <Text style={styles.breakdownText}>Unattempted</Text>
            </View>
            <Text style={[styles.breakdownCount, { color: COLORS.slate[400] }]}>{totalUnattempted}</Text>
          </View>
        </View>

        {/* Sectional Performance Breakdown (Matching Web App) */}
        {sections.length > 0 && (
          <View style={styles.sectionCard}>
            <View style={styles.sectionCardHeader}>
              <BarChart3 size={18} color={COLORS.brand[400]} />
              <Text style={styles.sectionCardTitle}>Sectional Performance Breakdown</Text>
            </View>
            <Text style={styles.sectionCardSubtitle}>
              Detailed transcript per subject domain evaluated by server.
            </Text>

            <View style={styles.sectionList}>
              {sections.map((sec, idx) => {
                const secAcc = Math.round(Number(sec.accuracy || 0));
                return (
                  <View key={sec.sectionId || idx} style={styles.sectionItem}>
                    <View style={styles.sectionTop}>
                      <Text style={styles.sectionName}>
                        {sec.sectionName || `Section ${idx + 1}`}
                      </Text>
                      <Text style={styles.sectionScore}>
                        {sec.score != null ? `${sec.score} / ${sec.maxScore || 25}` : ''}
                      </Text>
                    </View>

                    {/* Accuracy Progress */}
                    <View style={styles.secAccRow}>
                      <Text style={styles.secAccLabel}>Accuracy: {secAcc}%</Text>
                      <View style={styles.secAccTrack}>
                        <View style={[styles.secAccFill, { width: `${Math.min(secAcc, 100)}%` }]} />
                      </View>
                    </View>

                    {/* Stats Badges */}
                    <View style={styles.secBadges}>
                      <View style={styles.secBadgeGreen}>
                        <Text style={styles.secBadgeTextGreen}>✓ {sec.correct || 0} Correct</Text>
                      </View>
                      <View style={styles.secBadgeRed}>
                        <Text style={styles.secBadgeTextRed}>✗ {sec.incorrect || 0} Wrong</Text>
                      </View>
                      <View style={styles.secBadgeGray}>
                        <Text style={styles.secBadgeTextGray}>— {sec.unattempted || 0} Skipped</Text>
                      </View>
                    </View>
                  </View>
                );
              })}
            </View>
          </View>
        )}

        {/* Peer Benchmarking (Matching Web App) */}
        {peer && (
          <View style={styles.peerCard}>
            <View style={styles.peerHeader}>
              <Medal size={18} color={COLORS.brand[400]} />
              <Text style={styles.peerTitle}>Peer Cohort Benchmarking</Text>
            </View>
            <View style={styles.peerGrid}>
              <View style={styles.peerItem}>
                <Text style={styles.peerVal}>{peer.topperScore ?? '—'}</Text>
                <Text style={styles.peerLbl}>Topper Score</Text>
              </View>
              <View style={styles.peerItem}>
                <Text style={styles.peerVal}>{peer.averageScore ?? '—'}</Text>
                <Text style={styles.peerLbl}>Average Score</Text>
              </View>
              <View style={styles.peerItem}>
                <Text style={styles.peerVal}>{peer.totalParticipants ?? '—'}</Text>
                <Text style={styles.peerLbl}>Participants</Text>
              </View>
            </View>
          </View>
        )}

        {/* Evaluator Remarks */}
        <View style={styles.remarksCard}>
          <View style={styles.remarksHeader}>
            <Sparkles size={16} color={COLORS.brand[400]} />
            <Text style={styles.remarksTitle}>Official Evaluator Remarks</Text>
          </View>
          <Text style={styles.remarksBody}>
            {accuracy >= 80
              ? 'Outstanding performance! Speed and accuracy reflect solid subject comprehension across all domains.'
              : accuracy >= 50
              ? 'Good effort! Review missed concept areas and refine time allocation during practice sessions.'
              : 'Consistent practice recommended. Focus on core section fundamentals and step-by-step revision.'}
          </Text>
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
            onPress={() => navigation.navigate('Leaderboard', { testSlug: result?.metadata?.testId || 'mock-cgl-01' })}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  loadingText: {
    color: COLORS.slate[300],
    fontSize: 14,
    fontWeight: '600',
  },
  statusBarContainer: {
    flexDirection: 'row',
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 16,
    gap: 2,
  },
  statusBarSegment: {
    borderRadius: 4,
  },
  sectionCard: {
    backgroundColor: COLORS.slate[900],
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: COLORS.slate[800],
    marginBottom: 18,
  },
  sectionCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  sectionCardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.common.white,
  },
  sectionCardSubtitle: {
    fontSize: 11,
    color: COLORS.slate[400],
    marginBottom: 14,
  },
  sectionList: {
    gap: 12,
  },
  sectionItem: {
    backgroundColor: COLORS.slate[950],
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.slate[800],
  },
  sectionTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionName: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.common.white,
    flex: 1,
  },
  sectionScore: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.brand[400],
  },
  secAccRow: {
    marginBottom: 10,
  },
  secAccLabel: {
    fontSize: 11,
    color: COLORS.slate[400],
    fontWeight: '500',
    marginBottom: 4,
  },
  secAccTrack: {
    height: 6,
    backgroundColor: COLORS.slate[800],
    borderRadius: 3,
    overflow: 'hidden',
  },
  secAccFill: {
    height: '100%',
    backgroundColor: COLORS.brand[500],
    borderRadius: 3,
  },
  secBadges: {
    flexDirection: 'row',
    gap: 6,
  },
  secBadgeGreen: {
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  secBadgeTextGreen: {
    color: COLORS.status.success,
    fontSize: 10,
    fontWeight: '700',
  },
  secBadgeRed: {
    backgroundColor: 'rgba(239, 68, 68, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  secBadgeTextRed: {
    color: '#ef4444',
    fontSize: 10,
    fontWeight: '700',
  },
  secBadgeGray: {
    backgroundColor: 'rgba(148, 163, 184, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  secBadgeTextGray: {
    color: COLORS.slate[400],
    fontSize: 10,
    fontWeight: '700',
  },
  peerCard: {
    backgroundColor: COLORS.slate[900],
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: COLORS.slate[800],
    marginBottom: 18,
  },
  peerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 14,
  },
  peerTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.common.white,
  },
  peerGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  peerItem: {
    flex: 1,
    alignItems: 'center',
  },
  peerVal: {
    fontSize: 17,
    fontWeight: '800',
    color: COLORS.common.white,
  },
  peerLbl: {
    fontSize: 10,
    color: COLORS.slate[400],
    marginTop: 2,
  },
  remarksCard: {
    backgroundColor: 'rgba(94, 67, 243, 0.08)',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(94, 67, 243, 0.25)',
    marginBottom: 20,
  },
  remarksHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  remarksTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.brand[400],
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  remarksBody: {
    fontSize: 12,
    color: COLORS.slate[300],
    lineHeight: 18,
  },
});

export default TestResultScreen;
