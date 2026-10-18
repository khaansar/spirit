import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
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
  Users,
  ThumbsUp,
  Star,
  PlayCircle,
  BarChart2,
  Trophy,
  BookOpen,
  Receipt,
  User,
} from 'lucide-react-native';

import BrandLogo from '../../components/common/BrandLogo';
import SeriesCard from '../../components/catalog/SeriesCard';
import TestCard from '../../components/catalog/TestCard';
import { COLORS } from '../../constants/theme';
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

export function HomeScreen({ navigation }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { categories, popularSeries, featuredTests } = useSelector((state) => state.catalog);

  // Live Exam Preview state
  const [previewSeconds, setPreviewSeconds] = useState(3590);
  const [previewSelected, setPreviewSelected] = useState(1);
  const [expandedFaq, setExpandedFaq] = useState(null);

  const userName = user?.name || user?.email?.split('@')[0] || '';

  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchPopularSeries());
    dispatch(fetchFeaturedTests());
  }, [dispatch]);

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

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.slate[950]} />

      {/* Top App Bar with Logo & Auth / Avatar Button */}
      <View style={styles.topBar}>
        <BrandLogo size="sm" showTagline={false} />

        {user ? (
          <TouchableOpacity
            onPress={() => navigation.navigate('ProfileTab')}
            style={styles.avatarButton}
            activeOpacity={0.7}
          >
            <Text style={styles.avatarText}>{userName.charAt(0).toUpperCase()}</Text>
          </TouchableOpacity>
        ) : (
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

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* ================================================================= */}
        {/* 1. HERO SECTION (For Guests) vs STUDENT BANNER (For Logged In)   */}
        {/* ================================================================= */}
        {!user ? (
          <View style={styles.heroSection}>
            {/* Header copy */}
            <View style={styles.heroBadge}>
              <Sparkles size={13} color={COLORS.brand[400]} />
              <Text style={styles.heroBadgeText}>INDIA'S MOCK TEST PLATFORM</Text>
            </View>

            <Text style={styles.heroTitle}>Practice on the Real Exam Interface.</Text>
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
            <View style={styles.featureGrid}>
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

            {/* Interactive Live Exam Preview Simulation (matching web ExamPreview) */}
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
        ) : (
          /* ================================================================= */
          /* STUDENT BANNER (For Logged-in Aspirants)                          */
          /* ================================================================= */
          <View style={styles.welcomeBanner}>
            <View style={styles.welcomeBadge}>
              <Sparkles size={12} color={COLORS.brand[400]} />
              <Text style={styles.welcomeBadgeText}>ASPIRANT DASHBOARD</Text>
            </View>
            <Text style={styles.welcomeGreeting}>Welcome back, {userName}!</Text>
            <Text style={styles.welcomeSubtext}>
              Pick up where you left off, take full-length mock tests, and keep your streak alive.
            </Text>

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
                onPress={() => navigation.navigate('ProfileTab')}
                activeOpacity={0.7}
              >
                <User size={13} color="#3b82f6" />
                <Text style={styles.quickAccessText}>My Profile</Text>
              </TouchableOpacity>
            </View>
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

        {popularSeries.slice(0, 2).map((series) => (
          <SeriesCard
            key={series.id}
            series={series}
            onPress={() => navigation.navigate('SeriesDetail', { seriesId: series.id, series })}
          />
        ))}

        {/* ================================================================= */}
        {/* 4. TODAY'S FEATURED MOCKS                                        */}
        {/* ================================================================= */}
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>Today's Featured Mocks</Text>
            <Text style={styles.sectionSubtitle}>Handpicked by exam mentors</Text>
          </View>
        </View>

        {featuredTests.slice(0, 2).map((test) => (
          <TestCard
            key={test.id}
            test={test}
            onStart={(selectedTest) =>
              navigation.navigate('TestInstructions', { test: selectedTest })
            }
          />
        ))}

        {/* ================================================================= */}
        {/* 5. WHY CHOOSE CLEARIT (Matches ValueStrip.jsx)                   */}
        {/* ================================================================= */}
        <View style={styles.valueSection}>
          <View style={styles.valueHeaderRow}>
            <ShieldCheck size={20} color={COLORS.brand[400]} />
            <Text style={styles.valueSectionTitle}>Why Choose ClearIt?</Text>
          </View>
          <Text style={styles.valueSectionSub}>Everything you need to crack your exam, in one place.</Text>

          <View style={styles.valueGrid}>
            <View style={styles.valueCard}>
              <View style={[styles.valueIconBox, { backgroundColor: 'rgba(94, 67, 243, 0.15)' }]}>
                <Monitor size={18} color={COLORS.brand[400]} />
              </View>
              <Text style={styles.valueTitle}>Exam-Like Interface</Text>
              <Text style={styles.valueDesc}>Practice with real test timer, palette, and marking scheme.</Text>
            </View>

            <View style={styles.valueCard}>
              <View style={[styles.valueIconBox, { backgroundColor: 'rgba(16, 185, 129, 0.15)' }]}>
                <BarChart2 size={18} color={COLORS.status.success} />
              </View>
              <Text style={styles.valueTitle}>AI-Powered Insights</Text>
              <Text style={styles.valueDesc}>Detailed section analytics and personalized recommendations.</Text>
            </View>

            <View style={styles.valueCard}>
              <View style={[styles.valueIconBox, { backgroundColor: 'rgba(239, 68, 68, 0.15)' }]}>
                <FileText size={18} color="#f87171" />
              </View>
              <Text style={styles.valueTitle}>Extensive Question Bank</Text>
              <Text style={styles.valueDesc}>Topic mocks, full tests, and curated previous year papers.</Text>
            </View>

            <View style={styles.valueCard}>
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

          <View style={styles.stepsList}>
            <View style={styles.stepItem}>
              <View style={styles.stepNumBox}>
                <Text style={styles.stepNumText}>1</Text>
              </View>
              <View style={styles.stepTextBox}>
                <Text style={styles.stepItemTitle}>Choose your exam</Text>
                <Text style={styles.stepItemDesc}>Pick from SSC, Banking, Railways, Defense, or State exams.</Text>
              </View>
            </View>

            <View style={styles.stepItem}>
              <View style={styles.stepNumBox}>
                <Text style={styles.stepNumText}>2</Text>
              </View>
              <View style={styles.stepTextBox}>
                <Text style={styles.stepItemTitle}>Take mock tests</Text>
                <Text style={styles.stepItemDesc}>Practice on the real exam interface with timed conditions.</Text>
              </View>
            </View>

            <View style={styles.stepItem}>
              <View style={styles.stepNumBox}>
                <Text style={styles.stepNumText}>3</Text>
              </View>
              <View style={styles.stepTextBox}>
                <Text style={styles.stepItemTitle}>Analyze performance</Text>
                <Text style={styles.stepItemDesc}>Review question-level accuracy and topic-wise weak spots.</Text>
              </View>
            </View>

            <View style={styles.stepItem}>
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
        <View style={styles.statsStrip}>
          <View style={styles.statBox}>
            <Users size={20} color={COLORS.brand[400]} />
            <Text style={styles.statValue}>100K+</Text>
            <Text style={styles.statLabel}>Aspirants</Text>
          </View>

          <View style={styles.statBox}>
            <FileText size={20} color={COLORS.accent.skyLight} />
            <Text style={styles.statValue}>5K+</Text>
            <Text style={styles.statLabel}>Mock Tests</Text>
          </View>

          <View style={styles.statBox}>
            <ThumbsUp size={20} color={COLORS.status.success} />
            <Text style={styles.statValue}>95%</Text>
            <Text style={styles.statLabel}>Recommend</Text>
          </View>

          <View style={styles.statBox}>
            <Star size={20} color="#fbbf24" fill="#fbbf24" />
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
      </ScrollView>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.slate[900],
    backgroundColor: COLORS.slate[950],
  },
  avatarButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: COLORS.brand[600],
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: COLORS.brand[400],
  },
  avatarText: {
    color: COLORS.common.white,
    fontWeight: '800',
    fontSize: 16,
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
    color: COLORS.common.white,
    fontWeight: '700',
    fontSize: 13,
  },
  scrollContent: {
    padding: 18,
    paddingBottom: 48,
  },

  /* Hero Section */
  heroSection: {
    backgroundColor: COLORS.slate[900],
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS.slate[800],
    marginBottom: 24,
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
    color: COLORS.common.white,
    lineHeight: 32,
    letterSpacing: -0.3,
  },
  heroSubtitle: {
    fontSize: 13,
    color: COLORS.slate[300],
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
    color: COLORS.common.white,
    fontWeight: '700',
    fontSize: 13,
  },
  secondaryCta: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.slate[800],
    borderWidth: 1,
    borderColor: COLORS.slate[700],
    borderRadius: 14,
    paddingVertical: 12,
  },
  secondaryCtaText: {
    color: COLORS.slate[200],
    fontWeight: '700',
    fontSize: 13,
  },

  /* Feature Grid */
  featureGrid: {
    gap: 10,
    marginBottom: 20,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    borderRadius: 14,
    padding: 10,
    borderWidth: 1,
    borderColor: COLORS.slate[800],
  },
  featureIconBox: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: COLORS.slate[800],
    justifyContent: 'center',
    alignItems: 'center',
  },
  featureTextBox: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.common.white,
  },
  featureDesc: {
    fontSize: 11,
    color: COLORS.slate[400],
    marginTop: 1,
  },

  /* Exam Preview Simulation Card */
  examPreviewCard: {
    backgroundColor: COLORS.slate[950],
    borderRadius: 18,
    borderWidth: 1,
    borderColor: COLORS.slate[800],
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
    color: COLORS.common.white,
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
    color: COLORS.common.white,
  },
  previewBody: {
    padding: 14,
  },
  previewQMeta: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.slate[400],
    marginBottom: 4,
  },
  previewQuestion: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.common.white,
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
    backgroundColor: COLORS.slate[900],
    borderWidth: 1,
    borderColor: COLORS.slate[800],
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
    color: COLORS.slate[300],
    fontWeight: '500',
  },
  previewOptionTextSelected: {
    color: COLORS.common.white,
    fontWeight: '700',
  },
  miniPaletteBox: {
    borderTopWidth: 1,
    borderTopColor: COLORS.slate[850] || COLORS.slate[800],
    paddingTop: 10,
  },
  miniPaletteTitle: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.slate[400],
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
    color: COLORS.common.white,
  },
  aiInsightSub: {
    fontSize: 10,
    color: COLORS.slate[300],
    marginTop: 2,
  },

  /* Logged-in Welcome Banner */
  welcomeBanner: {
    backgroundColor: COLORS.slate[900],
    borderRadius: 22,
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS.slate[800],
    marginBottom: 20,
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
    color: COLORS.common.white,
  },
  welcomeSubtext: {
    fontSize: 13,
    color: COLORS.slate[400],
    marginTop: 4,
    lineHeight: 18,
  },
  metricsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 18,
  },
  metricCard: {
    flex: 1,
    backgroundColor: COLORS.slate[950],
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.slate[800],
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
    color: COLORS.common.white,
  },
  metricLabel: {
    fontSize: 11,
    color: COLORS.slate[400],
    marginTop: 2,
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
    color: COLORS.common.white,
  },
  sectionSubtitle: {
    fontSize: 12,
    color: COLORS.slate[400],
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
    backgroundColor: COLORS.slate[900],
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.slate[800],
  },
  categoryChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.slate[200],
  },

  /* Value Section (Why Choose ClearIt) */
  valueSection: {
    backgroundColor: COLORS.slate[900],
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: COLORS.slate[800],
    marginTop: 14,
    marginBottom: 20,
  },
  valueHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  valueSectionTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: COLORS.common.white,
  },
  valueSectionSub: {
    fontSize: 12,
    color: COLORS.slate[400],
    marginTop: 3,
    marginBottom: 16,
  },
  valueGrid: {
    gap: 10,
  },
  valueCard: {
    backgroundColor: COLORS.slate[950],
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.slate[800],
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
    color: COLORS.common.white,
  },
  valueDesc: {
    fontSize: 11,
    color: COLORS.slate[400],
    marginTop: 3,
    lineHeight: 16,
  },

  /* How It Works Section */
  howSection: {
    backgroundColor: COLORS.slate[900],
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: COLORS.slate[800],
    marginBottom: 20,
  },
  howTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.common.white,
  },
  howSub: {
    fontSize: 12,
    color: COLORS.slate[400],
    marginTop: 2,
    marginBottom: 16,
  },
  stepsList: {
    gap: 14,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  stepNumBox: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.brand[600],
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
  stepNumText: {
    color: COLORS.common.white,
    fontWeight: '800',
    fontSize: 12,
  },
  stepTextBox: {
    flex: 1,
  },
  stepItemTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.common.white,
  },
  stepItemDesc: {
    fontSize: 11,
    color: COLORS.slate[400],
    marginTop: 2,
    lineHeight: 16,
  },

  /* Stats Strip */
  statsStrip: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: COLORS.slate[900],
    borderRadius: 18,
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: COLORS.slate[800],
    marginBottom: 20,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.common.white,
    marginTop: 4,
  },
  statLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: COLORS.slate[400],
  },

  /* FAQ Accordion Section */
  faqSection: {
    backgroundColor: COLORS.slate[900],
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: COLORS.slate[800],
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
    fontSize: 17,
    fontWeight: '800',
    color: COLORS.common.white,
  },
  faqSubtitle: {
    fontSize: 12,
    color: COLORS.slate[400],
    marginTop: 2,
    marginBottom: 14,
  },
  faqList: {
    gap: 10,
  },
  faqCard: {
    backgroundColor: COLORS.slate[950],
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.slate[800],
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
    color: COLORS.common.white,
    lineHeight: 18,
  },
  faqAnswerBox: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: COLORS.slate[850] || COLORS.slate[800],
  },
  faqAnswerText: {
    fontSize: 12,
    color: COLORS.slate[300],
    lineHeight: 18,
  },

  /* Bottom Join Card */
  bottomJoinCard: {
    backgroundColor: 'rgba(94, 67, 243, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(94, 67, 243, 0.35)',
    borderRadius: 22,
    padding: 20,
    alignItems: 'center',
    marginBottom: 10,
  },
  bottomJoinTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.common.white,
    textAlign: 'center',
  },
  bottomJoinDesc: {
    fontSize: 12,
    color: COLORS.slate[300],
    textAlign: 'center',
    lineHeight: 18,
    marginTop: 6,
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  bottomJoinBtn: {
    backgroundColor: COLORS.brand[600],
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  bottomJoinBtnText: {
    color: COLORS.common.white,
    fontWeight: '700',
    fontSize: 13,
  },
  quickAccessRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 14,
  },
  quickAccessPill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: COLORS.slate[900],
    borderWidth: 1,
    borderColor: COLORS.slate[800],
    paddingVertical: 9,
    borderRadius: 10,
  },
  quickAccessText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.slate[300],
  },
});

export default HomeScreen;
