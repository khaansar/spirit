import React, { useEffect } from 'react';
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
import { ArrowLeft, Trophy, Crown, Clock, Target } from 'lucide-react-native';

import { COLORS } from '../../constants/theme';
import { fetchLeaderboard } from '../../store/slices/analyticsSlice';

export function LeaderboardScreen({ route, navigation }) {
  const dispatch = useDispatch();
  const { testSlug } = route.params || {};
  const { leaderboard, loading } = useSelector((state) => state.analytics);

  useEffect(() => {
    dispatch(fetchLeaderboard(testSlug || 'mock-cgl-01'));
  }, [dispatch, testSlug]);

  const topThree = leaderboard.slice(0, 3);
  const restList = leaderboard.slice(3);
  const currentUserEntry = leaderboard.find((item) => item.isCurrentUser);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.slate[950]} />

      {/* Top Header */}
      <View style={styles.topBar}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <ArrowLeft size={20} color={COLORS.slate[200]} />
        </TouchableOpacity>
        <Text style={styles.topBarTitle}>All India Leaderboard</Text>
        <View style={{ width: 40 }} />
      </View>

      {loading && leaderboard.length === 0 ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={COLORS.brand[400]} />
        </View>
      ) : (
        <>
          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            {/* Top 3 Podium Cards */}
            <View style={styles.podiumContainer}>
              {/* Rank 2 (Silver) */}
              {topThree[1] && (
                <View style={[styles.podiumColumn, { marginTop: 24 }]}>
                  <View style={[styles.avatarCircle, { borderColor: '#cbd5e1' }]}>
                    <Text style={styles.avatarInitial}>
                      {topThree[1].name.charAt(0)}
                    </Text>
                    <View style={[styles.rankPill, { backgroundColor: '#64748b' }]}>
                      <Text style={styles.rankPillText}>2</Text>
                    </View>
                  </View>
                  <Text style={styles.podiumName} numberOfLines={1}>
                    {topThree[1].name}
                  </Text>
                  <Text style={styles.podiumScore}>{topThree[1].score} M</Text>
                  <Text style={styles.podiumAccuracy}>{topThree[1].accuracy}% acc</Text>
                </View>
              )}

              {/* Rank 1 (Gold) */}
              {topThree[0] && (
                <View style={styles.podiumColumn}>
                  <Crown size={24} color="#fbbf24" style={{ marginBottom: 4 }} />
                  <View style={[styles.avatarCircle, styles.goldBorder]}>
                    <Text style={styles.avatarInitial}>
                      {topThree[0].name.charAt(0)}
                    </Text>
                    <View style={[styles.rankPill, { backgroundColor: '#f59e0b' }]}>
                      <Text style={styles.rankPillText}>1</Text>
                    </View>
                  </View>
                  <Text style={styles.podiumName} numberOfLines={1}>
                    {topThree[0].name}
                  </Text>
                  <Text style={styles.podiumScore}>{topThree[0].score} M</Text>
                  <Text style={styles.podiumAccuracy}>{topThree[0].accuracy}% acc</Text>
                </View>
              )}

              {/* Rank 3 (Bronze) */}
              {topThree[2] && (
                <View style={[styles.podiumColumn, { marginTop: 32 }]}>
                  <View style={[styles.avatarCircle, { borderColor: '#b45309' }]}>
                    <Text style={styles.avatarInitial}>
                      {topThree[2].name.charAt(0)}
                    </Text>
                    <View style={[styles.rankPill, { backgroundColor: '#b45309' }]}>
                      <Text style={styles.rankPillText}>3</Text>
                    </View>
                  </View>
                  <Text style={styles.podiumName} numberOfLines={1}>
                    {topThree[2].name}
                  </Text>
                  <Text style={styles.podiumScore}>{topThree[2].score} M</Text>
                  <Text style={styles.podiumAccuracy}>{topThree[2].accuracy}% acc</Text>
                </View>
              )}
            </View>

            {/* Rest of the Leaderboard list */}
            <View style={styles.listCard}>
              <Text style={styles.listCardTitle}>Top Performers</Text>

              {restList.map((item) => (
                <View
                  key={item.rank}
                  style={[
                    styles.rankRow,
                    item.isCurrentUser && styles.rankRowCurrentUser,
                  ]}
                >
                  <View style={styles.rankLeft}>
                    <Text
                      style={[
                        styles.rankNumber,
                        item.isCurrentUser && styles.rankNumberCurrent,
                      ]}
                    >
                      #{item.rank}
                    </Text>
                    <View>
                      <Text
                        style={[
                          styles.rankName,
                          item.isCurrentUser && styles.rankNameCurrent,
                        ]}
                      >
                        {item.name}
                      </Text>
                      <View style={styles.rankMetaRow}>
                        <Clock size={11} color={COLORS.slate[500]} />
                        <Text style={styles.rankMetaText}>{item.timeTaken}</Text>
                        <Text style={styles.rankMetaDot}>•</Text>
                        <Text style={styles.rankMetaText}>{item.accuracy}% acc</Text>
                      </View>
                    </View>
                  </View>

                  <View style={styles.rankRight}>
                    <Text style={styles.scoreText}>{item.score}</Text>
                    <Text style={styles.scoreSub}>Marks</Text>
                  </View>
                </View>
              ))}
            </View>
          </ScrollView>

          {/* Sticky Current User Rank Bar */}
          {currentUserEntry && (
            <View style={styles.userStickyBar}>
              <View style={styles.userStickyLeft}>
                <View style={styles.userRankBadge}>
                  <Text style={styles.userRankBadgeText}>#{currentUserEntry.rank}</Text>
                </View>
                <View>
                  <Text style={styles.userStickyName}>Your Standing</Text>
                  <Text style={styles.userStickySub}>
                    Accuracy: {currentUserEntry.accuracy}% • Time: {currentUserEntry.timeTaken}
                  </Text>
                </View>
              </View>

              <View style={styles.userStickyRight}>
                <Text style={styles.userStickyScore}>{currentUserEntry.score}</Text>
                <Text style={styles.userStickyScoreSub}>Marks</Text>
              </View>
            </View>
          )}
        </>
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
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  podiumContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-start',
    gap: 16,
    marginVertical: 20,
  },
  podiumColumn: {
    alignItems: 'center',
    width: 100,
  },
  avatarCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.slate[900],
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    marginBottom: 8,
  },
  goldBorder: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderColor: '#fbbf24',
    borderWidth: 2.5,
  },
  avatarInitial: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.common.white,
  },
  rankPill: {
    position: 'absolute',
    bottom: -6,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 10,
  },
  rankPillText: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.common.white,
  },
  podiumName: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.common.white,
    textAlign: 'center',
  },
  podiumScore: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.brand[400],
    marginTop: 2,
  },
  podiumAccuracy: {
    fontSize: 10,
    color: COLORS.slate[400],
  },
  listCard: {
    backgroundColor: COLORS.slate[900],
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.slate[800],
  },
  listCardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.common.white,
    marginBottom: 12,
  },
  rankRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.slate[800],
  },
  rankRowCurrentUser: {
    backgroundColor: 'rgba(94, 67, 243, 0.12)',
    marginHorizontal: -8,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  rankLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  rankNumber: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.slate[400],
    width: 32,
  },
  rankNumberCurrent: {
    color: COLORS.brand[400],
  },
  rankName: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.common.white,
  },
  rankNameCurrent: {
    color: COLORS.brand[400],
    fontWeight: '700',
  },
  rankMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  rankMetaText: {
    fontSize: 11,
    color: COLORS.slate[400],
  },
  rankMetaDot: {
    color: COLORS.slate[600],
    fontSize: 10,
  },
  rankRight: {
    alignItems: 'flex-end',
  },
  scoreText: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.common.white,
  },
  scoreSub: {
    fontSize: 10,
    color: COLORS.slate[400],
  },
  userStickyBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.slate[900],
    borderTopWidth: 1,
    borderTopColor: COLORS.slate[800],
    paddingHorizontal: 20,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  userStickyLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  userRankBadge: {
    backgroundColor: COLORS.brand[600],
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },
  userRankBadgeText: {
    color: COLORS.common.white,
    fontWeight: '800',
    fontSize: 13,
  },
  userStickyName: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.common.white,
  },
  userStickySub: {
    fontSize: 11,
    color: COLORS.slate[400],
    marginTop: 2,
  },
  userStickyRight: {
    alignItems: 'flex-end',
  },
  userStickyScore: {
    fontSize: 18,
    fontWeight: '900',
    color: COLORS.brand[400],
  },
  userStickyScoreSub: {
    fontSize: 10,
    color: COLORS.slate[400],
  },
});

export default LeaderboardScreen;
