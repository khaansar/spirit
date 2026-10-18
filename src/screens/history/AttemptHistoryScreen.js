import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ActivityIndicator,
  RefreshControl,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import {
  ArrowLeft,
  Clock,
  Trophy,
  CheckCircle2,
  AlertCircle,
  FileText,
  Award,
  Play,
} from 'lucide-react-native';

import { COLORS } from '../../constants/theme';
import { useTheme } from '../../context/ThemeContext';
import { fetchHistory } from '../../store/slices/analyticsSlice';

export function AttemptHistoryScreen({ navigation }) {
  const dispatch = useDispatch();
  const { history, loading } = useSelector((state) => state.analytics);
  const [refreshing, setRefreshing] = useState(false);
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;
  const { isDark, theme } = useTheme();
  const styles = React.useMemo(() => getStyles(theme, isDark), [theme, isDark]);

  useEffect(() => {
    dispatch(fetchHistory());
  }, [dispatch]);

  const onRefresh = async () => {
    setRefreshing(true);
    await dispatch(fetchHistory());
    setRefreshing(false);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Recent';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={theme.colors.bg} />

      {/* Header */}
      <View style={styles.topBar}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <ArrowLeft size={20} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.topBarTitle}>Attempt History</Text>
        <View style={{ width: 40 }} />
      </View>

      {loading && history.length === 0 ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={COLORS.brand[400]} />
        </View>
      ) : (
        <FlatList
          data={history}
          keyExtractor={(item) => item.attemptId || String(Math.random())}
          contentContainerStyle={[
            styles.listContent,
            isTablet && styles.listContentTablet,
          ]}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={COLORS.brand[400]}
              colors={[COLORS.brand[400]]}
            />
          }
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => {
            const isCompleted =
              String(item.status || '').toUpperCase() === 'SUBMITTED' ||
              String(item.status || '').toUpperCase() === 'COMPLETED';

            return (
              <View style={[styles.historyCard, isTablet && styles.historyCardTablet]}>
                <View style={styles.cardTopRow}>
                  <View style={styles.dateRow}>
                    <Clock size={12} color={COLORS.slate[400]} />
                    <Text style={styles.dateText}>{formatDate(item.startedAt)}</Text>
                  </View>

                  {isCompleted ? (
                    <View style={styles.statusBadge}>
                      <CheckCircle2 size={12} color={COLORS.status.success} />
                      <Text style={styles.statusBadgeText}>Completed</Text>
                    </View>
                  ) : (
                    <View style={styles.statusBadgeInProgress}>
                      <Clock size={12} color="#f59e0b" />
                      <Text style={styles.statusBadgeInProgressText}>In Progress</Text>
                    </View>
                  )}
                </View>

                <View style={styles.titleRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.testTitle}>{item.testName}</Text>
                    <Text style={styles.categoryName}>{item.categoryName || 'General Mock'}</Text>
                  </View>

                  {item.percentile != null && isCompleted && (
                    <View style={styles.rankPill}>
                      <Trophy size={12} color="#fbbf24" />
                      <Text style={styles.rankPillText}>
                        Rank #{item.rank} • Top {Math.max(1, Math.round(100 - Number(item.percentile)))}%
                      </Text>
                    </View>
                  )}
                </View>

                {isCompleted ? (
                  <View style={styles.scoreRow}>
                    <View style={styles.scoreBox}>
                      <Text style={styles.scoreVal}>
                        {item.score !== '—' && item.score != null ? `${item.score} / ${item.totalMarks}` : `Pending Evaluation`}
                      </Text>
                      <Text style={styles.scoreLbl}>Score Obtained</Text>
                    </View>

                    <View style={styles.scoreBox}>
                      <Text style={styles.scoreVal}>
                        {item.accuracy !== '—' && item.accuracy != null ? `${item.accuracy}%` : '—'}
                      </Text>
                      <Text style={styles.scoreLbl}>Accuracy</Text>
                    </View>
                  </View>
                ) : (
                  <View style={styles.inProgressNotice}>
                    <AlertCircle size={14} color="#f59e0b" />
                    <Text style={styles.inProgressNoticeText}>
                      Test attempt in progress. Resume to finish and see your scorecard.
                    </Text>
                  </View>
                )}

                <View style={styles.cardDivider} />

                {isCompleted ? (
                  <View style={styles.actionRow}>
                    <TouchableOpacity
                      style={styles.actionBtnOutline}
                      onPress={() => navigation.navigate('TestResult', { attemptId: item.attemptId })}
                      activeOpacity={0.7}
                    >
                      <Award size={14} color={COLORS.brand[400]} />
                      <Text style={styles.actionBtnOutlineText}>Scorecard</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.actionBtnPrimary}
                      onPress={() => navigation.navigate('SolutionsReview', { attemptId: item.attemptId })}
                      activeOpacity={0.8}
                    >
                      <FileText size={14} color={COLORS.common.white} />
                      <Text style={styles.actionBtnPrimaryText}>Solutions</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.actionBtnIconOnly}
                      onPress={() => navigation.navigate('Leaderboard', { testSlug: item.testId })}
                      activeOpacity={0.7}
                    >
                      <Trophy size={14} color={COLORS.brand[400]} />
                    </TouchableOpacity>
                  </View>
                ) : (
                  <TouchableOpacity
                    style={styles.resumeBtn}
                    onPress={() =>
                      navigation.navigate('TestAttempt', {
                        test: {
                          id: item.testId,
                          testId: item.testId,
                          attemptId: item.attemptId,
                          name: item.testName,
                        },
                      })
                    }
                    activeOpacity={0.8}
                  >
                    <Play size={15} color={COLORS.common.white} fill={COLORS.common.white} />
                    <Text style={styles.resumeBtnText}>Resume Mock Exam</Text>
                  </TouchableOpacity>
                )}
              </View>
            );
          }}
          ListEmptyComponent={
            <View style={styles.emptyBox}>
              <Text style={styles.emptyTitle}>No past attempts found</Text>
              <Text style={styles.emptySubtitle}>
                Complete a mock test to see your performance history and solutions here.
              </Text>
            </View>
          }
        />
      )}
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
      backgroundColor: theme.colors.card,
      borderWidth: 1,
      borderColor: theme.colors.border,
      justifyContent: 'center',
      alignItems: 'center',
    },
    topBarTitle: {
      fontSize: 16,
      fontWeight: '700',
      color: theme.colors.text,
    },
    listContent: {
      padding: 16,
      paddingBottom: 40,
    },
    loaderContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    historyCard: {
      backgroundColor: theme.colors.card,
      borderRadius: 20,
      padding: 18,
      borderWidth: 1,
      borderColor: theme.colors.cardBorder,
      marginBottom: 14,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: isDark ? 0.3 : 0.05,
      shadowRadius: 8,
      elevation: 2,
    },
    cardTopRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 8,
    },
    dateRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 5,
    },
    dateText: {
      fontSize: 11,
      color: theme.colors.textMuted,
      fontWeight: '500',
    },
    statusBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      backgroundColor: 'rgba(16, 185, 129, 0.12)',
      paddingHorizontal: 8,
      paddingVertical: 3,
      borderRadius: 8,
    },
    statusBadgeText: {
      color: theme.colors.statusSuccess,
      fontSize: 10,
      fontWeight: '700',
    },
    testTitle: {
      fontSize: 16,
      fontWeight: '700',
      color: theme.colors.text,
      lineHeight: 22,
    },
    categoryName: {
      fontSize: 11,
      color: COLORS.brand[400],
      fontWeight: '600',
      marginTop: 2,
      marginBottom: 12,
    },
    scoreRow: {
      flexDirection: 'row',
      gap: 12,
      marginBottom: 8,
    },
    scoreBox: {
      flex: 1,
      backgroundColor: theme.colors.cardInner,
      borderRadius: 12,
      padding: 10,
      borderWidth: 1,
      borderColor: theme.colors.cardBorder,
    },
    scoreVal: {
      fontSize: 15,
      fontWeight: '800',
      color: theme.colors.text,
    },
    scoreLbl: {
      fontSize: 10,
      color: theme.colors.textMuted,
      marginTop: 2,
    },
    cardDivider: {
      height: 1,
      backgroundColor: theme.colors.divider,
      marginVertical: 12,
    },
    actionRow: {
      flexDirection: 'row',
      gap: 10,
    },
    actionBtnOutline: {
      flex: 1,
      height: 40,
      borderRadius: 10,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      gap: 6,
      backgroundColor: theme.colors.cardInner,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    actionBtnOutlineText: {
      color: COLORS.brand[400],
      fontSize: 12,
      fontWeight: '700',
    },
    actionBtnPrimary: {
      flex: 1,
      height: 40,
      borderRadius: 10,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      gap: 6,
      backgroundColor: COLORS.brand[600],
    },
    actionBtnPrimaryText: {
      color: COLORS.common.white,
      fontSize: 12,
      fontWeight: '700',
    },
    actionBtnIconOnly: {
      width: 40,
      height: 40,
      borderRadius: 10,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.colors.cardInner,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    emptyBox: {
      padding: 40,
      alignItems: 'center',
    },
    emptyTitle: {
      fontSize: 16,
      fontWeight: '700',
      color: theme.colors.text,
      marginBottom: 6,
    },
    emptySubtitle: {
      fontSize: 13,
      color: theme.colors.textMuted,
      textAlign: 'center',
      lineHeight: 18,
    },
    listContentTablet: {
      paddingHorizontal: 32,
      maxWidth: 900,
      alignSelf: 'center',
      width: '100%',
    },
    historyCardTablet: {
      padding: 22,
    },
    statusBadgeInProgress: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      backgroundColor: 'rgba(245, 158, 11, 0.12)',
      paddingHorizontal: 8,
      paddingVertical: 3,
      borderRadius: 8,
    },
    statusBadgeInProgressText: {
      color: '#f59e0b',
      fontSize: 10,
      fontWeight: '700',
    },
    titleRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      gap: 10,
    },
    rankPill: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      backgroundColor: 'rgba(251, 191, 36, 0.12)',
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: 'rgba(251, 191, 36, 0.25)',
    },
    rankPillText: {
      color: '#fbbf24',
      fontSize: 11,
      fontWeight: '700',
    },
    inProgressNotice: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      backgroundColor: 'rgba(245, 158, 11, 0.08)',
      padding: 10,
      borderRadius: 10,
      marginBottom: 8,
    },
    inProgressNoticeText: {
      color: '#f59e0b',
      fontSize: 12,
      flex: 1,
      fontWeight: '500',
    },
    resumeBtn: {
      height: 42,
      borderRadius: 10,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      gap: 8,
      backgroundColor: COLORS.brand[600],
    },
    resumeBtnText: {
      color: COLORS.common.white,
      fontSize: 13,
      fontWeight: '700',
    },
  });

export default AttemptHistoryScreen;
