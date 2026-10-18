import React, { useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { ArrowLeft, Clock, Trophy, CheckCircle2, ChevronRight, FileText } from 'lucide-react-native';

import { COLORS } from '../../constants/theme';
import { fetchHistory } from '../../store/slices/analyticsSlice';

export function AttemptHistoryScreen({ navigation }) {
  const dispatch = useDispatch();
  const { history, loading } = useSelector((state) => state.analytics);

  useEffect(() => {
    dispatch(fetchHistory());
  }, [dispatch]);

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Recent';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.slate[950]} />

      {/* Header */}
      <View style={styles.topBar}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <ArrowLeft size={20} color={COLORS.slate[200]} />
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
          keyExtractor={(item) => item.attemptId}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <View style={styles.historyCard}>
              <View style={styles.cardTopRow}>
                <View style={styles.dateRow}>
                  <Clock size={12} color={COLORS.slate[400]} />
                  <Text style={styles.dateText}>{formatDate(item.startedAt)}</Text>
                </View>

                <View style={styles.statusBadge}>
                  <CheckCircle2 size={12} color={COLORS.status.success} />
                  <Text style={styles.statusBadgeText}>Completed</Text>
                </View>
              </View>

              <Text style={styles.testTitle}>{item.testName}</Text>
              <Text style={styles.categoryName}>{item.categoryName || 'General Mock'}</Text>

              <View style={styles.scoreRow}>
                <View style={styles.scoreBox}>
                  <Text style={styles.scoreVal}>{item.score} / {item.totalMarks}</Text>
                  <Text style={styles.scoreLbl}>Score Obtained</Text>
                </View>

                <View style={styles.scoreBox}>
                  <Text style={styles.scoreVal}>{item.accuracy}%</Text>
                  <Text style={styles.scoreLbl}>Accuracy</Text>
                </View>
              </View>

              <View style={styles.cardDivider} />

              <View style={styles.actionRow}>
                <TouchableOpacity
                  style={styles.actionBtnOutline}
                  onPress={() => navigation.navigate('Leaderboard', { testSlug: item.testId })}
                  activeOpacity={0.7}
                >
                  <Trophy size={14} color={COLORS.brand[400]} />
                  <Text style={styles.actionBtnOutlineText}>Leaderboard</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.actionBtnPrimary}
                  onPress={() => navigation.navigate('SolutionsReview', { attemptId: item.attemptId })}
                  activeOpacity={0.8}
                >
                  <FileText size={14} color={COLORS.common.white} />
                  <Text style={styles.actionBtnPrimaryText}>View Solutions</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
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

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.slate[950],
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.slate[900],
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: COLORS.slate[900],
    borderWidth: 1,
    borderColor: COLORS.slate[800],
    justifyContent: 'center',
    alignItems: 'center',
  },
  topBarTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.common.white,
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
    backgroundColor: COLORS.slate[900],
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: COLORS.slate[800],
    marginBottom: 14,
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
    color: COLORS.slate[400],
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
    color: COLORS.status.success,
    fontSize: 10,
    fontWeight: '700',
  },
  testTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.common.white,
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
    backgroundColor: COLORS.slate[950],
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: COLORS.slate[800],
  },
  scoreVal: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.common.white,
  },
  scoreLbl: {
    fontSize: 10,
    color: COLORS.slate[400],
    marginTop: 2,
  },
  cardDivider: {
    height: 1,
    backgroundColor: COLORS.slate[800],
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
    backgroundColor: COLORS.slate[950],
    borderWidth: 1,
    borderColor: COLORS.slate[700],
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
  emptyBox: {
    padding: 40,
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.common.white,
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 13,
    color: COLORS.slate[400],
    textAlign: 'center',
    lineHeight: 18,
  },
});

export default AttemptHistoryScreen;
