import React, { useEffect, useState, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { useTheme } from '../../context/ThemeContext';
import {
  Award,
  Clock,
  Target,
  ArrowRight,
  CheckCircle,
  Sparkles,
  LogIn,
  Monitor,
  FileText,
  Lightbulb,
  Bot,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  Users,
  ThumbsUp,
  Star,
  Play,
  BarChart2,
  Trophy,
  BookOpen,
  Receipt,
  User,
  Moon,
  Sun,
  Flame,
  Check,
} from 'lucide-react-native';

import BrandLogo from '../../components/common/BrandLogo';
import SeriesCard from '../../components/catalog/SeriesCard';
import TestCard from '../../components/catalog/TestCard';
import { COLORS } from '../../constants/theme';
import apiClient from '../../api/client';
import {
  fetchCategories,
  fetchPopularSeries,
  fetchFeaturedTests,
} from '../../store/slices/catalogSlice';

// Live exam preview questions & state
const PREVIEW_OPTIONS = ['30 km/h', '36 km/h', '40 km/h', '54 km/h'];
const PALETTE_SAMPLE = [
  'ans', 'ans', 'ans', 'not_ans', 'ans', 'marked', 'current',
  'not_vis', 'not_vis', 'not_vis', 'not_vis', 'not_vis', 'not_vis', 'not_vis',
];

const FAQS = [
  {
    q: 'Are mock tests based on the latest 2026 syllabus?',
    a: 'Yes, all mock tests and previous year papers are curated and updated by subject-matter experts to precisely reflect the latest exam patterns, time limits, and negative marking rules.',
  },
  {
    q: 'Can I review step-by-step solutions after submitting?',
    a: 'Absolutely! Immediately after completing any test, you can review detailed step-by-step explanations, shortcut formulas, and compare your answer with the correct answer.',
  },
  {
    q: 'Does the exam engine simulate real computer-based tests?',
    a: 'Yes! The mobile exam interface features an active countdown timer, multi-section tabs, a question status palette (Answered, Marked for Review, Not Visited), and auto-submission when time runs out.',
  },
  {
    q: 'Do I get All-India ranks and performance analytics?',
    a: 'Yes, each submitted test calculates your percentile, accuracy percentage, score breakdown across sections, and your standing on the All-India Leaderboard.',
  },
];

const WEEK_DAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

export function HomeScreen({ navigation }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { categories, popularSeries, featuredTests } = useSelector((state) => state.catalog);

  const { width } = useWindowDimensions();
  const isTablet = width >= 768;
  const isLargeTablet = width >= 1024;

  const { isDark, theme, toggleTheme } = useTheme();
  const styles = useMemo(() => getStyles(theme, isDark), [theme, isDark]);

  // Live Exam Preview state
  const [previewSeconds, setPreviewSeconds] = useState(3590);
  const [previewSelected, setPreviewSelected] = useState(1);
  const [expandedFaq, setExpandedFaq] = useState(null);

  // In-progress Mock Exam Attempt
  const [continueAttempt, setContinueAttempt] = useState(null);

  const userName = user?.firstName || user?.name || user?.email?.split('@')[0] || '';
  const greeting = getGreeting();

  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchPopularSeries());
    dispatch(fetchFeaturedTests());
  }, [dispatch]);

  // Check for any in-progress attempt to display ContinueCard
  useEffect(() => {
    if (!user) {
      setContinueAttempt(null);
      return;
    }
    apiClient
      .get('/attempts-api/attempts/in-progress')
      .then((res) => {
        const item = res?.data || res;
        if (item && (item.attemptId || item.id || item.testId)) {
          setContinueAttempt(item);
        }
      })
      .catch(() => {
        setContinueAttempt(null);
      });
  }, [user]);

  // Live countdown timer for the exam simulation card
  useEffect(() => {
    const timer = setInterval(() => {
      setPreviewSeconds((s) => (s > 0 ? s - 1 : 3600));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (total) => {
    const m = String(Math.floor(total / 60)).padStart(2, '0');
    const s = String(total % 60).padStart(2, '0');
    return `${m}:${s}`;
  };

  const todayIndex = new Date().getDay();

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={theme.colors.bg} />

      {/* Top App Bar with Logo & Theme Toggle (Replaced avatar with Moon/Sun) */}
      <View style={styles.topBar}>
        <BrandLogo size="sm" showTagline={false} />

        <View style={styles.topBarRight}>
          <TouchableOpacity
            onPress={toggleTheme}
            style={styles.themeToggleBtn}
            activeOpacity={0.7}
            accessibilityLabel="Toggle Theme Mode"
          >
            {isDark ? (
              <Sun size={18} color="#fbbf24" />
            ) : (
              <Moon size={18} color={theme.colors.textSecondary} />
            )}
          </TouchableOpacity>

          {!user && (
            <TouchableOpacity
              onPress={() => navigation.navigate('Login')}
              style={styles.signInPill}
              activeOpacity={0.8}
            >
              <LogIn size={14} color={COLORS.common.white} />
              <Text style={styles.signInText}>Sign In</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          isTablet && styles.scrollContentTablet,
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.mainContainer, isTablet && styles.mainContainerTablet]}>
          {/* ================================================================= */}
          {/* 1. HERO SECTION (For Guests) vs STUDENT BANNER (For Logged In)   */}
          {/* ================================================================= */}
          {!user ? (
            <View style={[styles.heroSection, isTablet && styles.heroSectionTablet]}>
              {/* Left Column: Hero Copy & Features */}
              <View style={[styles.heroLeftCol, isTablet && styles.heroLeftColTablet]}>
                <View style={styles.heroBadge}>
                  <Sparkles size={13} color={COLORS.brand[400]} />
                  <Text style={styles.heroBadgeText}>INDIA'S MOCK TEST PLATFORM</Text>
                </View>

                <Text style={[styles.heroTitle, isTablet && styles.heroTitleTablet]}>
                  Practice on the Real Exam Interface.
                </Text>
                <Text style={styles.heroSubtitle}>
                  Full-length mock tests, previous year papers, and step-by-step solutions with AI insights to help you clear your target cutoff.
                </Text>

                {/* Hero CTAs */}
                <View style={styles.heroCtaRow}>
                  <TouchableOpacity
                    style={styles.primaryCta}
                    onPress={() => navigation.navigate('CategoriesTab')}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.primaryCtaText}>Start a Mock Test</Text>
                    <ArrowRight size={16} color={COLORS.common.white} />
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.secondaryCta}
                    onPress={() => navigation.navigate('SeriesTab')}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.secondaryCtaText}>Explore Series</Text>
                  </TouchableOpacity>
                </View>

                {/* Core Feature Highlights */}
                <View style={[styles.featureGrid, isTablet && styles.featureGridTablet]}>
                  <View style={styles.featureItem}>
                    <View style={styles.featureIconBox}>
                      <Monitor size={16} color={COLORS.brand[400]} />
                    </View>
                    <View style={styles.featureTextBox}>
                      <Text style={styles.featureTitle}>Real Exam UI</Text>
                      <Text style={styles.featureDesc}>Exact timer & question palette</Text>
                    </View>
                  </View>

                  <View style={styles.featureItem}>
                    <View style={styles.featureIconBox}>
                      <FileText size={16} color={COLORS.accent.skyLight} />
                    </View>
                    <View style={styles.featureTextBox}>
                      <Text style={styles.featureTitle}>Past Papers</Text>
                      <Text style={styles.featureDesc}>Actual exam pattern questions</Text>
                    </View>
                  </View>

                  <View style={styles.featureItem}>
                    <View style={styles.featureIconBox}>
                      <Lightbulb size={16} color={COLORS.status.warning} />
                    </View>
                    <View style={styles.featureTextBox}>
                      <Text style={styles.featureTitle}>Detailed Solutions</Text>
                      <Text style={styles.featureDesc}>Step-by-step explanations</Text>
                    </View>
                  </View>

                  <View style={styles.featureItem}>
                    <View style={styles.featureIconBox}>
                      <Sparkles size={16} color={COLORS.status.success} />
                    </View>
                    <View style={styles.featureTextBox}>
                      <Text style={styles.featureTitle}>AI Analysis</Text>
                      <Text style={styles.featureDesc}>Pinpoint topics that cost marks</Text>
                    </View>
                  </View>
                </View>
              </View>

              {/* Right Column: Live Exam Preview Simulation */}
              <View style={[styles.heroRightCol, isTablet && styles.heroRightColTablet]}>
                <View style={styles.examPreviewCard}>
                  {/* Preview top title bar */}
                  <View style={styles.previewTitleBar}>
                    <Text style={styles.previewTitleText}>Mock Test 01 · Quantitative Aptitude</Text>
                    <View style={styles.previewTimerPill}>
                      <Clock size={12} color={COLORS.common.white} />
                      <Text style={styles.previewTimerText}>{formatTimer(previewSeconds)}</Text>
                    </View>
                  </View>

                  {/* Sample Question Box */}
                  <View style={styles.previewBody}>
                    <Text style={styles.previewQMeta}>Question 7 of 20 · +1 / −0.25</Text>
                    <Text style={styles.previewQuestion}>
                      A train 150 m long passes a pole in 15 seconds. What is its speed in km/h?
                    </Text>

                    {/* Selectable Options */}
                    <View style={styles.previewOptionsList}>
                      {PREVIEW_OPTIONS.map((opt, i) => {
                        const isSelected = previewSelected === i;
                        return (
                          <TouchableOpacity
                            key={opt}
                            onPress={() => setPreviewSelected(i)}
                            activeOpacity={0.8}
                            style={[
                              styles.previewOptionItem,
                              isSelected && styles.previewOptionSelected,
                            ]}
                          >
                            <View
                              style={[
                                styles.previewRadio,
                                isSelected && styles.previewRadioSelected,
                              ]}
                            >
                              {isSelected && <View style={styles.previewRadioDot} />}
                            </View>
                            <Text
                              style={[
                                styles.previewOptionText,
                                isSelected && styles.previewOptionTextSelected,
                              ]}
                            >
                              {opt}
                            </Text>
                          </TouchableOpacity>
                        );
                      })}
                    </View>

                    {/* Mini Question Palette */}
                    <View style={styles.miniPaletteBox}>
                      <Text style={styles.miniPaletteTitle}>Question Palette</Text>
                      <View style={styles.miniPaletteGrid}>
                        {PALETTE_SAMPLE.map((state, i) => {
                          let bg = COLORS.slate[800];
                          let textCol = COLORS.slate[300];
                          if (state === 'ans') {
                            bg = '#10b981';
                            textCol = '#ffffff';
                          } else if (state === 'not_ans') {
                            bg = '#ef4444';
                            textCol = '#ffffff';
                          } else if (state === 'marked') {
                            bg = '#8b5cf6';
                            textCol = '#ffffff';
                          } else if (state === 'current') {
                            bg = COLORS.brand[500];
                            textCol = '#ffffff';
                          }
                          return (
                            <View key={i} style={[styles.miniPaletteCell, { backgroundColor: bg }]}>
                              <Text style={[styles.miniPaletteCellText, { color: textCol }]}>{i + 1}</Text>
                            </View>
                          );
                        })}
                      </View>
                    </View>
                  </View>

                  {/* AI Insight banner */}
                  <View style={styles.aiInsightBox}>
                    <View style={styles.aiBotCircle}>
                      <Bot size={16} color={COLORS.common.white} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.aiInsightTitle}>Time & Work needs practice</Text>
                      <Text style={styles.aiInsightSub}>
                        3 of 8 correct in recent test. Try 10 more practice questions.
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          ) : (
            /* ================================================================= */
            /* STUDENT BANNER (For Logged-in Aspirants)                          */
            /* ================================================================= */
            <View style={[styles.welcomeBanner, isTablet && styles.welcomeBannerTablet]}>
              <View style={[styles.welcomeLeftCol, isTablet && styles.welcomeLeftColTablet]}>
                <View style={styles.welcomeBadge}>
                  <Sparkles size={12} color={COLORS.brand[400]} />
                  <Text style={styles.welcomeBadgeText}>ASPIRANT DASHBOARD</Text>
                </View>
                <Text style={[styles.welcomeGreeting, isTablet && styles.welcomeGreetingTablet]}>
                  {greeting}, {userName}!
                </Text>
                <Text style={styles.welcomeSubtext}>
                  {user.targetExam
                    ? `Preparing for ${user.targetExam}. Keep up your mock test practice and clear your cutoff.`
                    : 'Pick up where you left off, take full-length mock tests, and keep your streak alive.'}
                </Text>

                {/* Primary Student Actions */}
                <View style={styles.bannerActionRow}>
                  <TouchableOpacity
                    style={styles.bannerPrimaryBtn}
                    onPress={() => navigation.navigate('CategoriesTab')}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.bannerPrimaryBtnText}>Start a Mock Test</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.bannerSecondaryBtn}
                    onPress={() => navigation.navigate('SeriesTab')}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.bannerSecondaryBtnText}>Browse Series</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={[styles.welcomeRightCol, isTablet && styles.welcomeRightColTablet]}>
                {/* Weekly Streak Tracker */}
                <View style={styles.streakCard}>
                  <View style={styles.streakHeader}>
                    <View style={styles.streakHeaderLeft}>
                      <Flame size={16} color="#f59e0b" />
                      <Text style={styles.streakTitle}>Weekly Streak</Text>
                    </View>
                    <Text style={styles.streakBadge}>4 Days Active</Text>
                  </View>

                  <View style={styles.weekDotsRow}>
                    {WEEK_DAYS.map((day, idx) => {
                      const isPastOrToday = idx <= todayIndex;
                      const isActive = idx === todayIndex || idx === 2 || idx === 4;
                      return (
                        <View key={idx} style={styles.weekDayCol}>
                          <Text style={styles.weekDayLabel}>{day}</Text>
                          <View
                            style={[
                              styles.weekDot,
                              isActive && styles.weekDotActive,
                              !isActive && isPastOrToday && styles.weekDotMissed,
                            ]}
                          >
                            {isActive && <Check size={10} color={COLORS.common.white} />}
                          </View>
                        </View>
                      );
                    })}
                  </View>
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
                    <Text style={styles.metricLabel}>All-India Rank</Text>
                  </View>
                </View>

                {/* Quick Access Strip */}
                <View style={styles.quickAccessRow}>
                  <TouchableOpacity
                    style={styles.quickAccessPill}
                    onPress={() => navigation.navigate('AttemptHistory')}
                    activeOpacity={0.7}
                  >
                    <FileText size={13} color={COLORS.brand[400]} />
                    <Text style={styles.quickAccessText}>Past Attempts</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.quickAccessPill}
                    onPress={() => navigation.navigate('OrdersPayments')}
                    activeOpacity={0.7}
                  >
                    <Receipt size={13} color={COLORS.status.success} />
                    <Text style={styles.quickAccessText}>My Passes</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.quickAccessPill}
                    onPress={() => navigation.navigate('AccountSettings')}
                    activeOpacity={0.7}
                  >
                    <User size={13} color="#3b82f6" />
                    <Text style={styles.quickAccessText}>Settings</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}

          {/* ================================================================= */}
          {/* CONTINUE CARD (If user has in-progress attempt)                   */}
          {/* ================================================================= */}
          {continueAttempt && (
            <View style={styles.continueCard}>
              <View style={styles.continueCardLeft}>
                <View style={styles.continueIconBox}>
                  <Clock size={18} color={COLORS.brand[400]} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.continueTag}>IN-PROGRESS MOCK TEST</Text>
                  <Text style={styles.continueTitle} numberOfLines={1}>
                    {continueAttempt.testTitle || continueAttempt.testName || 'Full-Length Mock Examination'}
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                style={styles.continueBtn}
                onPress={() =>
                  navigation.navigate('TestAttempt', {
                    test: {
                      id: continueAttempt.testId || continueAttempt.id,
                      testId: continueAttempt.testId || continueAttempt.id,
                      attemptId: continueAttempt.attemptId || continueAttempt.id,
                      name: continueAttempt.testTitle || continueAttempt.testName,
                    },
                  })
                }
                activeOpacity={0.8}
              >
                <Play size={14} color={COLORS.common.white} fill={COLORS.common.white} />
                <Text style={styles.continueBtnText}>Resume</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* ================================================================= */}
          {/* 2. EXAM CATEGORIES GRID / STRIP                                   */}
          {/* ================================================================= */}
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionTitle}>Exam Categories</Text>
              <Text style={styles.sectionSubtitle}>Browse by target exam board</Text>
            </View>
            <TouchableOpacity onPress={() => navigation.navigate('CategoriesTab')} activeOpacity={0.7}>
              <Text style={styles.viewAllText}>View All &rarr;</Text>
            </TouchableOpacity>
          </View>

          {isTablet ? (
            /* Multi-column grid on Tablet */
            <View style={styles.categoriesGridTablet}>
              {categories.slice(0, 6).map((cat) => (
                <TouchableOpacity
                  key={cat.id}
                  style={styles.categoryCardTablet}
                  onPress={() => navigation.navigate('SeriesList', { category: cat })}
                  activeOpacity={0.8}
                >
                  <View style={styles.categoryCardTabletLeft}>
                    <View style={styles.categoryIconCircle}>
                      <BookOpen size={16} color={COLORS.brand[400]} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.categoryCardTitle} numberOfLines={1}>
                        {cat.name}
                      </Text>
                      <Text style={styles.categoryCardSub}>Mocks & Past Papers</Text>
                    </View>
                  </View>
                  <ChevronRight size={16} color={COLORS.slate[500]} />
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            /* Horizontal chips on Mobile */
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoriesRow}
            >
              {categories.slice(0, 6).map((cat) => (
                <TouchableOpacity
                  key={cat.id}
                  style={styles.categoryChip}
                  onPress={() => navigation.navigate('SeriesList', { category: cat })}
                  activeOpacity={0.8}
                >
                  <BookOpen size={14} color={COLORS.brand[400]} />
                  <Text style={styles.categoryChipText}>{cat.name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}

          {/* ================================================================= */}
          {/* 3. TRENDING TEST SERIES                                          */}
          {/* ================================================================= */}
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionTitle}>Popular Test Series</Text>
              <Text style={styles.sectionSubtitle}>Comprehensive exam packages</Text>
            </View>
            <TouchableOpacity onPress={() => navigation.navigate('SeriesTab')} activeOpacity={0.7}>
              <Text style={styles.viewAllText}>Browse All &rarr;</Text>
            </TouchableOpacity>
          </View>

          <View style={[styles.seriesContainer, isTablet && styles.seriesContainerTablet]}>
            {popularSeries.slice(0, isTablet ? 4 : 2).map((series) => (
              <View key={series.id} style={isTablet ? styles.seriesCardColTablet : undefined}>
                <SeriesCard
                  series={series}
                  onPress={() => navigation.navigate('SeriesDetail', { seriesId: series.id, series })}
                />
              </View>
            ))}
          </View>

          {/* ================================================================= */}
          {/* 4. TODAY'S FEATURED MOCKS                                        */}
          {/* ================================================================= */}
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionTitle}>Today's Featured Mocks</Text>
              <Text style={styles.sectionSubtitle}>Handpicked by exam mentors</Text>
            </View>
          </View>

          <View style={[styles.testsContainer, isTablet && styles.testsContainerTablet]}>
            {featuredTests.slice(0, isTablet ? 4 : 2).map((test) => (
              <View key={test.id} style={isTablet ? styles.testCardColTablet : undefined}>
                <TestCard
                  test={test}
                  onStart={(selectedTest) =>
                    navigation.navigate('TestInstructions', { test: selectedTest })
                  }
                />
              </View>
            ))}
          </View>

          {/* ================================================================= */}
          {/* 5. WHY CHOOSE CLEARIT (Matches ValueStrip.jsx)                   */}
          {/* ================================================================= */}
          <View style={styles.valueSection}>
            <View style={styles.valueHeaderRow}>
              <ShieldCheck size={20} color={COLORS.brand[400]} />
              <Text style={styles.valueSectionTitle}>Why Choose ClearIt?</Text>
            </View>
            <Text style={styles.valueSectionSub}>Everything you need to crack your exam, in one place.</Text>

            <View style={[styles.valueGrid, isTablet && styles.valueGridTablet]}>
              <View style={[styles.valueCard, isTablet && styles.valueCardTablet]}>
                <View style={[styles.valueIconBox, { backgroundColor: 'rgba(94, 67, 243, 0.15)' }]}>
                  <Monitor size={18} color={COLORS.brand[400]} />
                </View>
                <Text style={styles.valueTitle}>Exam-Like Interface</Text>
                <Text style={styles.valueDesc}>Practice with real test timer, palette, and marking scheme.</Text>
              </View>

              <View style={[styles.valueCard, isTablet && styles.valueCardTablet]}>
                <View style={[styles.valueIconBox, { backgroundColor: 'rgba(16, 185, 129, 0.15)' }]}>
                  <BarChart2 size={18} color={COLORS.status.success} />
                </View>
                <Text style={styles.valueTitle}>AI-Powered Insights</Text>
                <Text style={styles.valueDesc}>Detailed section analytics and personalized recommendations.</Text>
              </View>

              <View style={[styles.valueCard, isTablet && styles.valueCardTablet]}>
                <View style={[styles.valueIconBox, { backgroundColor: 'rgba(239, 68, 68, 0.15)' }]}>
                  <FileText size={18} color="#f87171" />
                </View>
                <Text style={styles.valueTitle}>Extensive Question Bank</Text>
                <Text style={styles.valueDesc}>Topic mocks, full tests, and curated previous year papers.</Text>
              </View>

              <View style={[styles.valueCard, isTablet && styles.valueCardTablet]}>
                <View style={[styles.valueIconBox, { backgroundColor: 'rgba(245, 158, 11, 0.15)' }]}>
                  <Lightbulb size={18} color={COLORS.status.warning} />
                </View>
                <Text style={styles.valueTitle}>Detailed Solutions</Text>
                <Text style={styles.valueDesc}>Step-by-step explanations and shortcut methods for every question.</Text>
              </View>
            </View>
          </View>

          {/* ================================================================= */}
          {/* 6. HOW IT WORKS (Matches HowItWorks.jsx)                         */}
          {/* ================================================================= */}
          <View style={styles.howSection}>
            <Text style={styles.howTitle}>How It Works</Text>
            <Text style={styles.howSub}>Start preparing in four simple steps.</Text>

            <View style={[styles.stepsList, isTablet && styles.stepsListTablet]}>
              <View style={[styles.stepItem, isTablet && styles.stepItemTablet]}>
                <View style={styles.stepNumBox}>
                  <Text style={styles.stepNumText}>1</Text>
                </View>
                <View style={styles.stepTextBox}>
                  <Text style={styles.stepItemTitle}>Choose your exam</Text>
                  <Text style={styles.stepItemDesc}>Pick from SSC, Banking, Railways, Defense, or State exams.</Text>
                </View>
              </View>

              <View style={[styles.stepItem, isTablet && styles.stepItemTablet]}>
                <View style={styles.stepNumBox}>
                  <Text style={styles.stepNumText}>2</Text>
                </View>
                <View style={styles.stepTextBox}>
                  <Text style={styles.stepItemTitle}>Take mock tests</Text>
                  <Text style={styles.stepItemDesc}>Practice on the real exam interface with timed conditions.</Text>
                </View>
              </View>

              <View style={[styles.stepItem, isTablet && styles.stepItemTablet]}>
                <View style={styles.stepNumBox}>
                  <Text style={styles.stepNumText}>3</Text>
                </View>
                <View style={styles.stepTextBox}>
                  <Text style={styles.stepItemTitle}>Analyze performance</Text>
                  <Text style={styles.stepItemDesc}>Review question-level accuracy and topic-wise weak spots.</Text>
                </View>
              </View>

              <View style={[styles.stepItem, isTablet && styles.stepItemTablet]}>
                <View style={styles.stepNumBox}>
                  <Text style={styles.stepNumText}>4</Text>
                </View>
                <View style={styles.stepTextBox}>
                  <Text style={styles.stepItemTitle}>Improve and repeat</Text>
                  <Text style={styles.stepItemDesc}>Focus on weak topics and boost your All-India rank.</Text>
                </View>
              </View>
            </View>
          </View>

          {/* ================================================================= */}
          {/* 7. STATS STRIP (Matches StatsStrip.jsx)                          */}
          {/* ================================================================= */}
          <View style={[styles.statsStrip, isTablet && styles.statsStripTablet]}>
            <View style={styles.statBox}>
              <Users size={22} color={COLORS.brand[400]} />
              <Text style={styles.statValue}>100K+</Text>
              <Text style={styles.statLabel}>Aspirants</Text>
            </View>

            <View style={styles.statBox}>
              <FileText size={22} color={COLORS.accent.skyLight} />
              <Text style={styles.statValue}>5K+</Text>
              <Text style={styles.statLabel}>Mock Tests</Text>
            </View>

            <View style={styles.statBox}>
              <ThumbsUp size={22} color={COLORS.status.success} />
              <Text style={styles.statValue}>95%</Text>
              <Text style={styles.statLabel}>Recommend</Text>
            </View>

            <View style={styles.statBox}>
              <Star size={22} color="#fbbf24" fill="#fbbf24" />
              <Text style={styles.statValue}>4.8/5</Text>
              <Text style={styles.statLabel}>Rating</Text>
            </View>
          </View>

          {/* ================================================================= */}
          {/* 8. FAQ ACCORDION (Matches HomeFaq.jsx)                            */}
          {/* ================================================================= */}
          <View style={styles.faqSection}>
            <View style={styles.faqBadge}>
              <Sparkles size={11} color={COLORS.brand[400]} />
              <Text style={styles.faqBadgeText}>QUICK ANSWERS</Text>
            </View>
            <Text style={styles.faqTitle}>Frequently Asked Questions</Text>
            <Text style={styles.faqSubtitle}>Helpful answers about ClearIt exam practice.</Text>

            <View style={styles.faqList}>
              {FAQS.map((faq, index) => {
                const isOpen = expandedFaq === index;
                return (
                  <TouchableOpacity
                    key={index}
                    onPress={() => setExpandedFaq(isOpen ? null : index)}
                    activeOpacity={0.8}
                    style={styles.faqCard}
                  >
                    <View style={styles.faqQuestionRow}>
                      <Text style={styles.faqIndexText}>{String(index + 1).padStart(2, '0')}</Text>
                      <Text style={styles.faqQuestionText}>{faq.q}</Text>
                      {isOpen ? (
                        <ChevronUp size={18} color={COLORS.brand[400]} />
                      ) : (
                        <ChevronDown size={18} color={COLORS.slate[400]} />
                      )}
                    </View>

                    {isOpen && (
                      <View style={styles.faqAnswerBox}>
                        <Text style={styles.faqAnswerText}>{faq.a}</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* ================================================================= */}
          {/* 9. BOTTOM JOIN CTA BANNER (Matches JoinBanner.jsx)               */}
          {/* ================================================================= */}
          <View style={styles.bottomJoinCard}>
            <Text style={styles.bottomJoinTitle}>Ready to Clear Your Cutoff?</Text>
            <Text style={styles.bottomJoinDesc}>
              Join thousands of serious aspirants preparing smarter with ClearIt today.
            </Text>
            <TouchableOpacity
              style={styles.bottomJoinBtn}
              onPress={() => navigation.navigate('SeriesTab')}
              activeOpacity={0.8}
            >
              <Text style={styles.bottomJoinBtnText}>Explore All Test Series &rarr;</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const getStyles = (theme, isDark) => StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.bg,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    backgroundColor: theme.colors.topBarBg,
  },
  topBarRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  themeToggleBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: theme.colors.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  signInPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLORS.brand[600],
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  signInText: {
    color: theme.colors.text,
    fontWeight: '700',
    fontSize: 13,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 48,
  },
  scrollContentTablet: {
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  mainContainer: {
    width: '100%',
  },
  mainContainerTablet: {
    maxWidth: 1100,
    alignSelf: 'center',
  },

  /* Hero Section */
  heroSection: {
    backgroundColor: theme.colors.card,
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: 24,
  },
  heroSectionTablet: {
    flexDirection: 'row',
    padding: 28,
    gap: 28,
    alignItems: 'center',
  },
  heroLeftCol: {
    flex: 1,
  },
  heroLeftColTablet: {
    flex: 1.1,
  },
  heroRightCol: {
    marginTop: 20,
  },
  heroRightColTablet: {
    flex: 0.9,
    marginTop: 0,
  },
  heroBadge: {
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
    marginBottom: 12,
  },
  heroBadgeText: {
    color: COLORS.brand[400],
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: theme.colors.text,
    lineHeight: 32,
    letterSpacing: -0.3,
  },
  heroTitleTablet: {
    fontSize: 32,
    lineHeight: 40,
  },
  heroSubtitle: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    marginTop: 8,
    lineHeight: 20,
  },
  heroCtaRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 18,
    marginBottom: 20,
  },
  primaryCta: {
    flex: 1.2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: COLORS.brand[600],
    borderRadius: 14,
    paddingVertical: 12,
  },
  primaryCtaText: {
    color: theme.colors.text,
    fontWeight: '700',
    fontSize: 13,
  },
  secondaryCta: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.border,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 14,
    paddingVertical: 12,
  },
  secondaryCtaText: {
    color: theme.colors.text,
    fontWeight: '700',
    fontSize: 13,
  },

  /* Feature Grid */
  featureGrid: {
    gap: 10,
    marginBottom: 10,
  },
  featureGridTablet: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    borderRadius: 14,
    padding: 10,
    borderWidth: 1,
    borderColor: theme.colors.border,
    minWidth: 180,
    flex: 1,
  },
  featureIconBox: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: theme.colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  featureTextBox: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: theme.colors.text,
  },
  featureDesc: {
    fontSize: 11,
    color: theme.colors.textMuted,
    marginTop: 1,
  },

  /* Exam Preview Simulation Card */
  examPreviewCard: {
    backgroundColor: theme.colors.cardInner,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: theme.colors.border,
    overflow: 'hidden',
  },
  previewTitleBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.brand[700],
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  previewTitleText: {
    fontSize: 11,
    fontWeight: '700',
    color: theme.colors.text,
    flex: 1,
  },
  previewTimerPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  previewTimerText: {
    fontSize: 11,
    fontWeight: '700',
    color: theme.colors.text,
  },
  previewBody: {
    padding: 14,
  },
  previewQMeta: {
    fontSize: 11,
    fontWeight: '600',
    color: theme.colors.textMuted,
    marginBottom: 4,
  },
  previewQuestion: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.text,
    lineHeight: 19,
    marginBottom: 12,
  },
  previewOptionsList: {
    gap: 8,
    marginBottom: 14,
  },
  previewOptionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: theme.colors.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 9,
  },
  previewOptionSelected: {
    borderColor: COLORS.brand[500],
    backgroundColor: 'rgba(94, 67, 243, 0.15)',
  },
  previewRadio: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 1.5,
    borderColor: COLORS.slate[500],
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewRadioSelected: {
    borderColor: COLORS.brand[400],
  },
  previewRadioDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.brand[400],
  },
  previewOptionText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    fontWeight: '500',
  },
  previewOptionTextSelected: {
    color: theme.colors.text,
    fontWeight: '700',
  },
  miniPaletteBox: {
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    paddingTop: 10,
  },
  miniPaletteTitle: {
    fontSize: 10,
    fontWeight: '700',
    color: theme.colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  miniPaletteGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  miniPaletteCell: {
    width: 20,
    height: 20,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  miniPaletteCellText: {
    fontSize: 9,
    fontWeight: '700',
  },
  aiInsightBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: 'rgba(94, 67, 243, 0.12)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(94, 67, 243, 0.25)',
    padding: 12,
  },
  aiBotCircle: {
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: COLORS.brand[600],
    justifyContent: 'center',
    alignItems: 'center',
  },
  aiInsightTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: theme.colors.text,
  },
  aiInsightSub: {
    fontSize: 10,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },

  /* Logged-in Welcome Banner */
  welcomeBanner: {
    backgroundColor: theme.colors.card,
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: 20,
  },
  welcomeBannerTablet: {
    flexDirection: 'row',
    padding: 26,
    gap: 28,
  },
  welcomeLeftCol: {
    flex: 1,
  },
  welcomeLeftColTablet: {
    flex: 1.1,
  },
  welcomeRightCol: {
    marginTop: 18,
  },
  welcomeRightColTablet: {
    flex: 1,
    marginTop: 0,
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
    color: theme.colors.text,
  },
  welcomeGreetingTablet: {
    fontSize: 28,
  },
  welcomeSubtext: {
    fontSize: 13,
    color: theme.colors.textMuted,
    marginTop: 6,
    lineHeight: 20,
  },
  bannerActionRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 18,
  },
  bannerPrimaryBtn: {
    backgroundColor: COLORS.brand[600],
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
  },
  bannerPrimaryBtnText: {
    color: theme.colors.text,
    fontWeight: '700',
    fontSize: 13,
  },
  bannerSecondaryBtn: {
    backgroundColor: theme.colors.border,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  bannerSecondaryBtnText: {
    color: theme.colors.text,
    fontWeight: '700',
    fontSize: 13,
  },

  /* Weekly Streak Card */
  streakCard: {
    backgroundColor: theme.colors.cardInner,
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: 12,
  },
  streakHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  streakHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  streakTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.text,
  },
  streakBadge: {
    fontSize: 11,
    fontWeight: '700',
    color: '#f59e0b',
  },
  weekDotsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  weekDayCol: {
    alignItems: 'center',
    gap: 6,
  },
  weekDayLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: theme.colors.textMuted,
  },
  weekDot: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: theme.colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  weekDotActive: {
    backgroundColor: COLORS.status.success,
  },
  weekDotMissed: {
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
  },

  /* Metrics */
  metricsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 4,
  },
  metricCard: {
    flex: 1,
    backgroundColor: theme.colors.cardInner,
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: theme.colors.border,
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
    color: theme.colors.text,
  },
  metricLabel: {
    fontSize: 11,
    color: theme.colors.textMuted,
    marginTop: 2,
  },
  quickAccessRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  quickAccessPill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: theme.colors.cardInner,
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingVertical: 9,
    borderRadius: 10,
  },
  quickAccessText: {
    fontSize: 11,
    fontWeight: '600',
    color: theme.colors.textSecondary,
  },

  /* Continue Card */
  continueCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(94, 67, 243, 0.12)',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(94, 67, 243, 0.35)',
    marginBottom: 20,
    gap: 12,
  },
  continueCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  continueIconBox: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: theme.colors.card,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(94, 67, 243, 0.3)',
  },
  continueTag: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.brand[400],
    letterSpacing: 0.5,
  },
  continueTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.text,
    marginTop: 2,
  },
  continueBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLORS.brand[600],
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
  },
  continueBtnText: {
    color: theme.colors.text,
    fontSize: 12,
    fontWeight: '700',
  },

  /* Section Headers */
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 12,
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: theme.colors.text,
  },
  sectionSubtitle: {
    fontSize: 12,
    color: theme.colors.textMuted,
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
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: theme.colors.card,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  categoryChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.text,
  },

  /* Tablet Categories Grid */
  categoriesGridTablet: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
  },
  categoryCardTablet: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.card,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: theme.colors.border,
    width: '31.5%',
    minWidth: 220,
  },
  categoryCardTabletLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  categoryIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: theme.colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryCardTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: theme.colors.text,
  },
  categoryCardSub: {
    fontSize: 10,
    color: theme.colors.textMuted,
    marginTop: 2,
  },

  /* Series & Tests Grids */
  seriesContainer: {
    gap: 12,
  },
  seriesContainerTablet: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  seriesCardColTablet: {
    width: '48.5%',
  },
  testsContainer: {
    gap: 12,
  },
  testsContainerTablet: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  testCardColTablet: {
    width: '48.5%',
  },

  /* Value Section (Why Choose ClearIt) */
  valueSection: {
    backgroundColor: theme.colors.card,
    borderRadius: 22,
    padding: 20,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginTop: 14,
    marginBottom: 20,
  },
  valueHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  valueSectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: theme.colors.text,
  },
  valueSectionSub: {
    fontSize: 12,
    color: theme.colors.textMuted,
    marginTop: 3,
    marginBottom: 16,
  },
  valueGrid: {
    gap: 10,
  },
  valueGridTablet: {
    flexDirection: 'row',
    gap: 12,
  },
  valueCard: {
    backgroundColor: theme.colors.cardInner,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  valueCardTablet: {
    flex: 1,
  },
  valueIconBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  valueTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: theme.colors.text,
  },
  valueDesc: {
    fontSize: 11,
    color: theme.colors.textMuted,
    marginTop: 3,
    lineHeight: 16,
  },

  /* How It Works Section */
  howSection: {
    backgroundColor: theme.colors.card,
    borderRadius: 22,
    padding: 20,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: 20,
  },
  howTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: theme.colors.text,
  },
  howSub: {
    fontSize: 12,
    color: theme.colors.textMuted,
    marginTop: 2,
    marginBottom: 16,
  },
  stepsList: {
    gap: 14,
  },
  stepsListTablet: {
    flexDirection: 'row',
    gap: 14,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  stepItemTablet: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'flex-start',
    backgroundColor: theme.colors.cardInner,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  stepNumBox: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.brand[600],
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  stepNumText: {
    color: theme.colors.text,
    fontWeight: '800',
    fontSize: 12,
  },
  stepTextBox: {
    flex: 1,
  },
  stepItemTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: theme.colors.text,
  },
  stepItemDesc: {
    fontSize: 11,
    color: theme.colors.textMuted,
    marginTop: 2,
    lineHeight: 16,
  },

  /* Stats Strip */
  statsStrip: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.card,
    borderRadius: 18,
    paddingVertical: 18,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: 20,
  },
  statsStripTablet: {
    paddingVertical: 24,
    paddingHorizontal: 24,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  statValue: {
    fontSize: 17,
    fontWeight: '800',
    color: theme.colors.text,
    marginTop: 4,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: theme.colors.textMuted,
  },

  /* FAQ Accordion Section */
  faqSection: {
    backgroundColor: theme.colors.card,
    borderRadius: 22,
    padding: 20,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: 20,
  },
  faqBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(94, 67, 243, 0.15)',
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 3,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  faqBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.brand[400],
    letterSpacing: 0.5,
  },
  faqTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: theme.colors.text,
  },
  faqSubtitle: {
    fontSize: 12,
    color: theme.colors.textMuted,
    marginTop: 2,
    marginBottom: 14,
  },
  faqList: {
    gap: 10,
  },
  faqCard: {
    backgroundColor: theme.colors.cardInner,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: 14,
  },
  faqQuestionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  faqIndexText: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.brand[400],
  },
  faqQuestionText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.text,
    lineHeight: 18,
  },
  faqAnswerBox: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  faqAnswerText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    lineHeight: 18,
  },

  /* Bottom Join Card */
  bottomJoinCard: {
    backgroundColor: 'rgba(94, 67, 243, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(94, 67, 243, 0.35)',
    borderRadius: 22,
    padding: 24,
    alignItems: 'center',
    marginBottom: 10,
  },
  bottomJoinTitle: {
    fontSize: 19,
    fontWeight: '800',
    color: theme.colors.text,
    textAlign: 'center',
  },
  bottomJoinDesc: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginTop: 6,
    marginBottom: 16,
    maxWidth: 600,
  },
  bottomJoinBtn: {
    backgroundColor: COLORS.brand[600],
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 22,
  },
  bottomJoinBtnText: {
    color: theme.colors.text,
    fontWeight: '700',
    fontSize: 13,
  },
});

export default HomeScreen;
