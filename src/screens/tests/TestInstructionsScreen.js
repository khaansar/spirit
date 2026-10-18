import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import {
  ArrowLeft,
  Clock,
  Award,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  Play,
} from 'lucide-react-native';

import Checkbox from '../../components/common/Checkbox';
import Button from '../../components/common/Button';
import { COLORS } from '../../constants/theme';
import { useTheme } from '../../context/ThemeContext';
import { fetchTestStructure } from '../../store/slices/catalogSlice';
import { startAttemptThunk } from '../../store/slices/attemptSlice';

export function TestInstructionsScreen({ route, navigation }) {
  const dispatch = useDispatch();
  const { test } = route.params || {};
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { currentTestStructure, loading } = useSelector((state) => state.catalog);
  const { theme, isDark } = useTheme();
  const styles = React.useMemo(() => getStyles(theme, isDark), [theme, isDark]);

  const [hasAgreed, setHasAgreed] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('English');
  const [isStarting, setIsStarting] = useState(false);

  useEffect(() => {
    if (test?.id) {
      dispatch(fetchTestStructure(test.id));
    }
  }, [dispatch, test?.id]);

  const testDetails = currentTestStructure || test || {};
  const sections = testDetails?.sections || [
    { id: '1', name: 'General Intelligence', questionCount: 25, marksPerQuestion: 2, negativeMarks: 0.5 },
    { id: '2', name: 'General Awareness', questionCount: 25, marksPerQuestion: 2, negativeMarks: 0.5 },
    { id: '3', name: 'Quantitative Aptitude', questionCount: 25, marksPerQuestion: 2, negativeMarks: 0.5 },
    { id: '4', name: 'English Comprehension', questionCount: 25, marksPerQuestion: 2, negativeMarks: 0.5 },
  ];

  const handleStartExam = async () => {
    if (!hasAgreed || isStarting) return;

    if (!isAuthenticated) {
      Alert.alert(
        'Sign In Required',
        'You must be signed in to take this test so that your questions, live timer, and scorecard are recorded to your account.',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Sign In Now',
            onPress: () => navigation.navigate('Login'),
          },
        ]
      );
      return;
    }

    setIsStarting(true);
    try {
      const targetTestId = test?.id || testDetails?.testId || testDetails?.id;
      const duration = testDetails?.totalDurationMinutes || testDetails?.durationMinutes || 60;

      const res = await dispatch(
        startAttemptThunk({ testId: targetTestId, durationMinutes: duration })
      ).unwrap();

      setIsStarting(false);
      navigation.navigate('TestAttempt', { test: res, language: selectedLanguage });
    } catch (err) {
      setIsStarting(false);
      Alert.alert(
        'Unable to Start Exam',
        err || 'Could not connect to the exam server. Please check your network and try again.',
        [{ text: 'OK' }]
      );
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={theme.colors.bg} />

      {/* Top Header */}
      <View style={styles.topBar}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <ArrowLeft size={20} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.topBarTitle}>Exam Instructions</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Test Overview Card */}
        <View style={styles.overviewCard}>
          <Text style={styles.testTitle}>{testDetails.title || 'Full Length Mock Exam'}</Text>
          <Text style={styles.categoryTag}>{testDetails.categoryName || 'Competitive Exam'}</Text>

          <View style={styles.metaGrid}>
            <View style={styles.metaBox}>
              <Clock size={18} color={COLORS.brand[400]} />
              <Text style={styles.metaVal}>{testDetails.durationMinutes || 60} Mins</Text>
              <Text style={styles.metaLbl}>Duration</Text>
            </View>

            <View style={styles.metaBox}>
              <Award size={18} color={COLORS.accent.skyLight} />
              <Text style={styles.metaVal}>{testDetails.totalMarks || 200}</Text>
              <Text style={styles.metaLbl}>Total Marks</Text>
            </View>

            <View style={styles.metaBox}>
              <HelpCircle size={18} color={COLORS.status.success} />
              <Text style={styles.metaVal}>{testDetails.totalQuestions || 100}</Text>
              <Text style={styles.metaLbl}>Questions</Text>
            </View>
          </View>
        </View>

        {/* Language Selection */}
        <View style={styles.sectionCard}>
          <Text style={styles.cardHeader}>Select Default Language</Text>
          <View style={styles.langRow}>
            {['English', 'Hindi'].map((lang) => {
              const isSelected = selectedLanguage === lang;
              return (
                <TouchableOpacity
                  key={lang}
                  onPress={() => setSelectedLanguage(lang)}
                  style={[styles.langChip, isSelected && styles.langChipSelected]}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.langText, isSelected && styles.langTextSelected]}>
                    {lang}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Sectional Breakdown */}
        <View style={styles.sectionCard}>
          <Text style={styles.cardHeader}>Section Breakdown</Text>
          {sections.map((sec, idx) => (
            <View key={sec.id || idx} style={styles.secRow}>
              <View style={styles.secInfo}>
                <Text style={styles.secName}>{sec.name}</Text>
                <Text style={styles.secMeta}>
                  {sec.questionCount} Questions • +{sec.marksPerQuestion} / -{sec.negativeMarks} marks
                </Text>
              </View>
              <View style={styles.secMarksBadge}>
                <Text style={styles.secMarksText}>{sec.questionCount * sec.marksPerQuestion} M</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Question Palette Color Legend */}
        <View style={styles.sectionCard}>
          <Text style={styles.cardHeader}>Exam Palette Legend</Text>

          <View style={styles.legendRow}>
            <View style={[styles.legendDot, { backgroundColor: '#10b981' }]} />
            <Text style={styles.legendText}>Answered</Text>

            <View style={[styles.legendDot, { backgroundColor: '#ef4444' }]} />
            <Text style={styles.legendText}>Not Answered</Text>
          </View>

          <View style={styles.legendRow}>
            <View style={[styles.legendDot, { backgroundColor: '#8b5cf6' }]} />
            <Text style={styles.legendText}>Marked for Review</Text>

            <View style={[styles.legendDot, { backgroundColor: '#475569' }]} />
            <Text style={styles.legendText}>Not Visited</Text>
          </View>
        </View>

        {/* Instructions Checklist */}
        <View style={styles.sectionCard}>
          <Text style={styles.cardHeader}>General Rules</Text>
          <View style={styles.ruleItem}>
            <CheckCircle2 size={16} color={COLORS.brand[400]} style={{ marginTop: 2 }} />
            <Text style={styles.ruleText}>
              The countdown timer at top shows remaining time. Exam will auto-submit when timer expires.
            </Text>
          </View>

          <View style={styles.ruleItem}>
            <CheckCircle2 size={16} color={COLORS.brand[400]} style={{ marginTop: 2 }} />
            <Text style={styles.ruleText}>
              You can navigate between questions at any time using the Question Palette drawer.
            </Text>
          </View>

          <View style={styles.ruleItem}>
            <AlertTriangle size={16} color={COLORS.status.warning} style={{ marginTop: 2 }} />
            <Text style={styles.ruleText}>
              Do not close the application or switch apps repeatedly during active test.
            </Text>
          </View>
        </View>

        {/* Agreement Checkbox */}
        <View style={styles.agreementBox}>
          <Checkbox
            checked={hasAgreed}
            onChange={setHasAgreed}
            label="I have read all instructions and confirm that I am ready to begin."
          />
        </View>

        {/* Start Exam CTA */}
        <Button
          title={isStarting ? 'Preparing Exam...' : 'I am ready to begin'}
          onPress={handleStartExam}
          disabled={!hasAgreed || isStarting}
          loading={isStarting}
          rightIcon={<Play size={16} color={COLORS.common.white} fill={COLORS.common.white} />}
          style={styles.startButton}
        />
      </ScrollView>
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
    scrollContent: {
      padding: 20,
      paddingBottom: 40,
    },
    overviewCard: {
      backgroundColor: theme.colors.card,
      borderRadius: 22,
      padding: 20,
      borderWidth: 1,
      borderColor: theme.colors.cardBorder,
      marginBottom: 16,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: isDark ? 0.3 : 0.05,
      shadowRadius: 8,
      elevation: 2,
    },
    testTitle: {
      fontSize: 20,
      fontWeight: '800',
      color: theme.colors.text,
      lineHeight: 26,
    },
    categoryTag: {
      fontSize: 12,
      color: COLORS.brand[400],
      fontWeight: '600',
      marginTop: 4,
      marginBottom: 16,
    },
    metaGrid: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: 8,
    },
    metaBox: {
      flex: 1,
      backgroundColor: theme.colors.cardInner,
      borderRadius: 14,
      padding: 12,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: theme.colors.cardBorder,
    },
    metaVal: {
      fontSize: 14,
      fontWeight: '800',
      color: theme.colors.text,
      marginTop: 6,
    },
    metaLbl: {
      fontSize: 11,
      color: theme.colors.textMuted,
      marginTop: 2,
    },
    sectionCard: {
      backgroundColor: theme.colors.card,
      borderRadius: 20,
      padding: 18,
      borderWidth: 1,
      borderColor: theme.colors.cardBorder,
      marginBottom: 16,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: isDark ? 0.3 : 0.05,
      shadowRadius: 8,
      elevation: 2,
    },
    cardHeader: {
      fontSize: 15,
      fontWeight: '700',
      color: theme.colors.text,
      marginBottom: 12,
    },
    langRow: {
      flexDirection: 'row',
      gap: 10,
    },
    langChip: {
      flex: 1,
      height: 40,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.cardInner,
      justifyContent: 'center',
      alignItems: 'center',
    },
    langChipSelected: {
      borderColor: COLORS.brand[500],
      backgroundColor: 'rgba(94, 67, 243, 0.15)',
    },
    langText: {
      fontSize: 13,
      fontWeight: '600',
      color: theme.colors.textSecondary,
    },
    langTextSelected: {
      color: COLORS.brand[400],
      fontWeight: '700',
    },
    secRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 10,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.divider,
    },
    secInfo: {
      flex: 1,
    },
    secName: {
      fontSize: 13,
      fontWeight: '600',
      color: theme.colors.text,
    },
    secMeta: {
      fontSize: 11,
      color: theme.colors.textMuted,
      marginTop: 2,
    },
    secMarksBadge: {
      backgroundColor: theme.colors.cardInner,
      paddingHorizontal: 8,
      paddingVertical: 3,
      borderRadius: 6,
    },
    secMarksText: {
      color: theme.colors.textSecondary,
      fontSize: 11,
      fontWeight: '700',
    },
    legendRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 8,
    },
    legendDot: {
      width: 12,
      height: 12,
      borderRadius: 6,
      marginRight: 6,
    },
    legendText: {
      fontSize: 12,
      color: theme.colors.textSecondary,
      width: '45%',
    },
    ruleItem: {
      flexDirection: 'row',
      gap: 8,
      alignItems: 'flex-start',
      marginBottom: 10,
    },
    ruleText: {
      fontSize: 12,
      color: theme.colors.textSecondary,
      lineHeight: 18,
      flex: 1,
    },
    agreementBox: {
      backgroundColor: theme.colors.card,
      borderRadius: 16,
      padding: 16,
      borderWidth: 1,
      borderColor: theme.colors.cardBorder,
      marginBottom: 16,
    },
    startButton: {
      marginTop: 4,
    },
  });

export default TestInstructionsScreen;
