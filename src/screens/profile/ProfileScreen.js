import React from 'react';
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
  User,
  Mail,
  Award,
  CheckCircle,
  Clock,
  Shield,
  LogOut,
  ChevronRight,
  Server,
  FileText,
  Trophy,
} from 'lucide-react-native';

import { COLORS } from '../../constants/theme';
import { CONFIG } from '../../config/env';
import { logoutUser } from '../../store/slices/authSlice';

export function ProfileScreen({ navigation }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const userName = user?.name || user?.email?.split('@')[0] || 'Aspirant';
  const userEmail = user?.email || 'aspirant@clearit.com';

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.slate[950]} />

      <View style={styles.header}>
        <Text style={styles.title}>My Profile</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* User Card */}
        <View style={styles.userCard}>
          <View style={styles.avatarBox}>
            <User size={36} color={COLORS.brand[400]} />
          </View>

          <Text style={styles.userName}>{userName}</Text>
          <View style={styles.emailRow}>
            <Mail size={14} color={COLORS.slate[400]} />
            <Text style={styles.userEmail}>{userEmail}</Text>
          </View>

          <View style={styles.roleBadge}>
            <Shield size={12} color={COLORS.accent.skyLight} />
            <Text style={styles.roleText}>PREMIUM ASPIRANT</Text>
          </View>
        </View>

        {/* Quick Activity Navigation */}
        <View style={styles.menuCard}>
          <Text style={styles.cardHeader}>My Activity</Text>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation.navigate('AttemptHistory')}
            activeOpacity={0.7}
          >
            <View style={styles.menuLeft}>
              <View style={[styles.menuIconBox, { backgroundColor: 'rgba(94, 67, 243, 0.15)' }]}>
                <FileText size={18} color={COLORS.brand[400]} />
              </View>
              <View>
                <Text style={styles.menuTitle}>Attempt History & Solutions</Text>
                <Text style={styles.menuSub}>Review past test scores and step-by-step keys</Text>
              </View>
            </View>
            <ChevronRight size={18} color={COLORS.slate[500]} />
          </TouchableOpacity>

          <View style={styles.menuDivider} />

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation.navigate('Leaderboard', { testSlug: 'mock-cgl-01' })}
            activeOpacity={0.7}
          >
            <View style={styles.menuLeft}>
              <View style={[styles.menuIconBox, { backgroundColor: 'rgba(245, 158, 11, 0.15)' }]}>
                <Trophy size={18} color="#f59e0b" />
              </View>
              <View>
                <Text style={styles.menuTitle}>All-India Leaderboards</Text>
                <Text style={styles.menuSub}>Compare accuracy and rankings with toppers</Text>
              </View>
            </View>
            <ChevronRight size={18} color={COLORS.slate[500]} />
          </TouchableOpacity>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsCard}>
          <Text style={styles.cardHeader}>Overall Performance</Text>
          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Award size={20} color={COLORS.brand[400]} />
              <Text style={styles.statVal}>12</Text>
              <Text style={styles.statLbl}>Tests Solved</Text>
            </View>

            <View style={styles.statBox}>
              <CheckCircle size={20} color={COLORS.status.success} />
              <Text style={styles.statVal}>78.5%</Text>
              <Text style={styles.statLbl}>Avg Accuracy</Text>
            </View>

            <View style={styles.statBox}>
              <Clock size={20} color={COLORS.accent.skyLight} />
              <Text style={styles.statVal}>14.2h</Text>
              <Text style={styles.statLbl}>Total Time</Text>
            </View>
          </View>
        </View>

        {/* System & Connection Status */}
        <View style={styles.menuCard}>
          <Text style={styles.cardHeader}>App & Backend Config</Text>

          <View style={styles.menuItem}>
            <View style={styles.menuLeft}>
              <View style={[styles.menuIconBox, { backgroundColor: COLORS.slate[800] }]}>
                <Server size={18} color={COLORS.slate[400]} />
              </View>
              <View>
                <Text style={styles.menuTitle}>Backend Server</Text>
                <Text style={styles.menuSub}>{CONFIG.API_BASE_URL}</Text>
              </View>
            </View>
            <View style={styles.onlineBadge}>
              <View style={styles.onlineDot} />
              <Text style={styles.onlineText}>Connected</Text>
            </View>
          </View>
        </View>

        {/* Logout Action Button */}
        <TouchableOpacity
          style={styles.logoutButton}
          activeOpacity={0.8}
          onPress={handleLogout}
        >
          <LogOut size={18} color="#f87171" />
          <Text style={styles.logoutText}>Log Out from Account</Text>
        </TouchableOpacity>
      </ScrollView>
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
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  userCard: {
    backgroundColor: COLORS.slate[900],
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.slate[800],
    marginBottom: 20,
  },
  avatarBox: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: 'rgba(94, 67, 243, 0.15)',
    borderWidth: 2,
    borderColor: COLORS.brand[500],
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
  },
  userName: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.common.white,
  },
  emailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
    marginBottom: 12,
  },
  userEmail: {
    fontSize: 13,
    color: COLORS.slate[400],
  },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(56, 189, 248, 0.12)',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.3)',
  },
  roleText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.accent.skyLight,
    letterSpacing: 0.5,
  },
  menuCard: {
    backgroundColor: COLORS.slate[900],
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: COLORS.slate[800],
    marginBottom: 20,
  },
  cardHeader: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.common.white,
    marginBottom: 14,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  menuIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.common.white,
  },
  menuSub: {
    fontSize: 12,
    color: COLORS.slate[400],
    marginTop: 2,
  },
  menuDivider: {
    height: 1,
    backgroundColor: COLORS.slate[800],
    marginVertical: 10,
  },
  statsCard: {
    backgroundColor: COLORS.slate[900],
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: COLORS.slate[800],
    marginBottom: 20,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  statBox: {
    flex: 1,
    backgroundColor: COLORS.slate[950],
    borderRadius: 14,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.slate[800],
  },
  statVal: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.common.white,
    marginTop: 6,
  },
  statLbl: {
    fontSize: 11,
    color: COLORS.slate[400],
    marginTop: 2,
  },
  onlineBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  onlineDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.status.success,
  },
  onlineText: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.status.success,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.25)',
    borderRadius: 16,
    height: 52,
  },
  logoutText: {
    color: '#f87171',
    fontSize: 15,
    fontWeight: '700',
  },
});

export default ProfileScreen;
