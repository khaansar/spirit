import React, { useState, useEffect, useMemo } from 'react';
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
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Lightbulb,
  Sun,
  Moon,
} from 'lucide-react-native';

import { COLORS } from '../../constants/theme';
import { useTheme } from '../../context/ThemeContext';
import { fetchSolutions } from '../../store/slices/analyticsSlice';

export function SolutionsReviewScreen({ route, navigation }) {
  const dispatch = useDispatch();
  const { theme, isDark, toggleTheme } = useTheme();
  const styles = useMemo(() => getStyles(theme, isDark), [theme, isDark]);

  const { attemptId } = route.params || {};
  const { solutions, loading } = useSelector((state) => state.analytics);

  const [activeFilter, setActiveFilter] = useState('ALL'); // 'ALL' | 'CORRECT' | 'INCORRECT'

  useEffect(() => {
    dispatch(fetchSolutions(attemptId || 'att-101'));
  }, [dispatch, attemptId]);

  const filteredSolutions = solutions.filter((item) => {
    if (activeFilter === 'CORRECT') return item.isCorrect;
    if (activeFilter === 'INCORRECT') return !item.isCorrect;
    return true;
  });

  const correctCount = solutions.filter((s) => s.isCorrect).length;
  const incorrectCount = solutions.length - correctCount;

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
        <Text style={styles.topBarTitle}>Solutions & Explanations</Text>
        <TouchableOpacity
          onPress={toggleTheme}
          style={styles.backButton}
          activeOpacity={0.7}
        >
          {isDark ? <Sun size={18} color="#fbbf24" /> : <Moon size={18} color={COLORS.brand[600]} />}
        </TouchableOpacity>
      </View>

      {/* Filter Tabs */}
      <View style={styles.filtersRow}>
        <TouchableOpacity
          onPress={() => setActiveFilter('ALL')}
          style={[styles.filterChip, activeFilter === 'ALL' && styles.filterChipSelected]}
          activeOpacity={0.7}
        >
          <Text style={[styles.filterChipText, activeFilter === 'ALL' && styles.filterChipTextSelected]}>
            All ({solutions.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setActiveFilter('CORRECT')}
          style={[styles.filterChip, activeFilter === 'CORRECT' && styles.filterChipCorrect]}
          activeOpacity={0.7}
        >
          <CheckCircle2 size={13} color={COLORS.status.success} />
          <Text style={[styles.filterChipText, activeFilter === 'CORRECT' && styles.filterChipTextCorrect]}>
            Correct ({correctCount})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setActiveFilter('INCORRECT')}
          style={[styles.filterChip, activeFilter === 'INCORRECT' && styles.filterChipIncorrect]}
          activeOpacity={0.7}
        >
          <XCircle size={13} color="#ef4444" />
          <Text style={[styles.filterChipText, activeFilter === 'INCORRECT' && styles.filterChipTextIncorrect]}>
            Incorrect ({incorrectCount})
          </Text>
        </TouchableOpacity>
      </View>

      {loading && solutions.length === 0 ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={COLORS.brand[400]} />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {filteredSolutions.map((item, idx) => {
            const isCorrect = item.isCorrect;

            return (
              <View key={item.id || idx} style={styles.solutionCard}>
                {/* Question Info Header */}
                <View style={styles.cardHeaderRow}>
                  <View style={styles.qNumBox}>
                    <Text style={styles.qNumText}>Q. {idx + 1}</Text>
                  </View>

                  <View
                    style={[
                      styles.resultBadge,
                      isCorrect ? styles.badgeCorrect : styles.badgeIncorrect,
                    ]}
                  >
                    {isCorrect ? (
                      <CheckCircle2 size={13} color={COLORS.status.success} />
                    ) : (
                      <XCircle size={13} color="#ef4444" />
                    )}
                    <Text
                      style={[
                        styles.resultBadgeText,
                        { color: isCorrect ? COLORS.status.success : '#ef4444' },
                      ]}
                    >
                      {isCorrect ? '+2 Marks' : '-0.5 Marks'}
                    </Text>
                  </View>
                </View>

                {/* Section Tag */}
                {item.sectionName && (
                  <Text style={styles.sectionTag}>{item.sectionName}</Text>
                )}

                {/* Question Prompt */}
                <Text style={styles.questionText}>{item.text}</Text>

                {/* Options List */}
                <View style={styles.optionsList}>
                  {item.options?.map((opt) => {
                    const isUserChoice = item.userSelected === opt.id;
                    const isRightChoice = item.correctOption === opt.id;

                    let optionBorder = theme.colors.border;
                    let optionBg = isDark ? COLORS.slate[950] : theme.colors.surface;

                    if (isRightChoice) {
                      optionBorder = COLORS.status.success;
                      optionBg = isDark ? 'rgba(16, 185, 129, 0.12)' : 'rgba(16, 185, 129, 0.08)';
                    } else if (isUserChoice && !isCorrect) {
                      optionBorder = '#ef4444';
                      optionBg = isDark ? 'rgba(239, 68, 68, 0.12)' : 'rgba(239, 68, 68, 0.08)';
                    }

                    return (
                      <View
                        key={opt.id}
                        style={[
                          styles.optionItem,
                          { borderColor: optionBorder, backgroundColor: optionBg },
                        ]}
                      >
                        <View style={styles.optionKeyBox}>
                          <Text style={styles.optionKeyText}>{opt.id}</Text>
                        </View>
                        <Text style={styles.optionText}>{opt.text}</Text>

                        {isRightChoice && (
                          <View style={styles.correctTag}>
                            <Text style={styles.correctTagText}>Correct</Text>
                          </View>
                        )}
                        {isUserChoice && !isCorrect && (
                          <View style={styles.wrongTag}>
                            <Text style={styles.wrongTagText}>Your Pick</Text>
                          </View>
                        )}
                      </View>
                    );
                  })}
                </View>

                {/* Explanation Box */}
                {item.explanation && (
                  <View style={styles.explanationBox}>
                    <View style={styles.explanationHeader}>
                      <Lightbulb size={16} color={COLORS.brand[400]} />
                      <Text style={styles.explanationTitle}>Detailed Explanation</Text>
                    </View>
                    <Text style={styles.explanationBody}>{item.explanation}</Text>
                  </View>
                )}
              </View>
            );
          })}
        </ScrollView>
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
      backgroundColor: theme.colors.bg,
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
    filtersRow: {
      flexDirection: 'row',
      paddingHorizontal: 16,
      paddingVertical: 10,
      gap: 8,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    filterChip: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 5,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 16,
      backgroundColor: theme.colors.card,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    filterChipSelected: {
      backgroundColor: COLORS.brand[600],
      borderColor: COLORS.brand[600],
    },
    filterChipCorrect: {
      backgroundColor: 'rgba(16, 185, 129, 0.15)',
      borderColor: 'rgba(16, 185, 129, 0.3)',
    },
    filterChipIncorrect: {
      backgroundColor: 'rgba(239, 68, 68, 0.15)',
      borderColor: 'rgba(239, 68, 68, 0.3)',
    },
    filterChipText: {
      fontSize: 12,
      fontWeight: '600',
      color: theme.colors.textSecondary,
    },
    filterChipTextSelected: {
      color: COLORS.common.white,
      fontWeight: '700',
    },
    filterChipTextCorrect: {
      color: COLORS.status.success,
      fontWeight: '700',
    },
    filterChipTextIncorrect: {
      color: '#ef4444',
      fontWeight: '700',
    },
    scrollContent: {
      padding: 16,
      paddingBottom: 40,
    },
    loaderContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    solutionCard: {
      backgroundColor: theme.colors.card,
      borderRadius: 20,
      padding: 18,
      borderWidth: 1,
      borderColor: theme.colors.border,
      marginBottom: 16,
    },
    cardHeaderRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 8,
    },
    qNumBox: {
      backgroundColor: isDark ? COLORS.slate[950] : theme.colors.surface,
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    qNumText: {
      fontSize: 12,
      fontWeight: '800',
      color: theme.colors.text,
    },
    resultBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 8,
    },
    badgeCorrect: {
      backgroundColor: 'rgba(16, 185, 129, 0.12)',
    },
    badgeIncorrect: {
      backgroundColor: 'rgba(239, 68, 68, 0.12)',
    },
    resultBadgeText: {
      fontSize: 11,
      fontWeight: '800',
    },
    sectionTag: {
      fontSize: 11,
      color: COLORS.brand[400],
      fontWeight: '600',
      marginBottom: 6,
    },
    questionText: {
      fontSize: 15,
      fontWeight: '600',
      color: theme.colors.text,
      lineHeight: 22,
      marginBottom: 14,
    },
    optionsList: {
      gap: 8,
      marginBottom: 14,
    },
    optionItem: {
      flexDirection: 'row',
      alignItems: 'center',
      borderRadius: 12,
      padding: 12,
      borderWidth: 1.5,
    },
    optionKeyBox: {
      width: 26,
      height: 26,
      borderRadius: 6,
      backgroundColor: theme.colors.card,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 10,
    },
    optionKeyText: {
      fontSize: 12,
      fontWeight: '700',
      color: theme.colors.textSecondary,
    },
    optionText: {
      flex: 1,
      fontSize: 13,
      color: theme.colors.text,
      lineHeight: 18,
    },
    correctTag: {
      backgroundColor: COLORS.status.success,
      paddingHorizontal: 6,
      paddingVertical: 2,
      borderRadius: 6,
    },
    correctTagText: {
      fontSize: 10,
      fontWeight: '800',
      color: COLORS.common.white,
    },
    wrongTag: {
      backgroundColor: '#ef4444',
      paddingHorizontal: 6,
      paddingVertical: 2,
      borderRadius: 6,
    },
    wrongTagText: {
      fontSize: 10,
      fontWeight: '800',
      color: COLORS.common.white,
    },
    explanationBox: {
      backgroundColor: isDark ? 'rgba(94, 67, 243, 0.08)' : 'rgba(94, 67, 243, 0.05)',
      borderRadius: 14,
      padding: 14,
      borderWidth: 1,
      borderColor: isDark ? 'rgba(94, 67, 243, 0.25)' : 'rgba(94, 67, 243, 0.15)',
    },
    explanationHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      marginBottom: 6,
    },
    explanationTitle: {
      fontSize: 13,
      fontWeight: '700',
      color: COLORS.brand[400],
    },
    explanationBody: {
      fontSize: 13,
      color: theme.colors.text,
      lineHeight: 20,
    },
  });

export default SolutionsReviewScreen;
