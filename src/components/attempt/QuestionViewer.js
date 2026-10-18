import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { Check, Bookmark, RotateCcw } from 'lucide-react-native';
import { COLORS } from '../../constants/theme';
import { useTheme } from '../../context/ThemeContext';

export function QuestionViewer({
  question,
  questionNumber,
  totalInCurrentSection,
  selectedOptionIds = [],
  isMarked = false,
  onSelectOption,
  onClearOption,
  onToggleMark,
}) {
  const { theme, isDark } = useTheme();
  const styles = useMemo(() => getStyles(theme, isDark), [theme, isDark]);

  if (!question) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Loading question...</Text>
      </View>
    );
  }

  const isMulti = question.type === 'MSQ';

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      {/* Top Question Info Row */}
      <View style={styles.topInfoRow}>
        <View style={styles.qNumBadge}>
          <Text style={styles.qNumText}>
            Q. {questionNumber} / {totalInCurrentSection}
          </Text>
        </View>

        <View style={styles.marksBadge}>
          <Text style={styles.marksText}>
            +{question.marks || 2} / -{question.negativeMarks || 0.5} M
          </Text>
        </View>

        {/* Mark for Review Toggle */}
        <TouchableOpacity
          style={[styles.markButton, isMarked && styles.markButtonActive]}
          onPress={onToggleMark}
          activeOpacity={0.7}
        >
          <Bookmark
            size={14}
            color={isMarked ? '#c084fc' : COLORS.slate[400]}
            fill={isMarked ? '#c084fc' : 'transparent'}
          />
          <Text style={[styles.markButtonText, isMarked && styles.markButtonTextActive]}>
            {isMarked ? 'Marked' : 'Mark'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Question Prompt Body */}
      <View style={styles.questionCard}>
        <Text style={styles.questionText}>{question.text}</Text>
      </View>

      {/* Options List */}
      <View style={styles.optionsSection}>
        <Text style={styles.optionsLabel}>
          {isMulti ? 'Select all that apply:' : 'Select one option:'}
        </Text>

        {question.options?.map((option, optIdx) => {
          const isSelected = selectedOptionIds.includes(option.id);
          const optionLetter = ['A', 'B', 'C', 'D', 'E', 'F'][optIdx] || String(optIdx + 1);

          return (
            <TouchableOpacity
              key={option.id}
              activeOpacity={0.8}
              onPress={() => onSelectOption(option.id, isMulti)}
              style={[
                styles.optionItem,
                isSelected && styles.optionItemSelected,
              ]}
            >
              {/* Option Letter Key */}
              <View
                style={[
                  styles.optionKeyBox,
                  isSelected && styles.optionKeyBoxSelected,
                ]}
              >
                {isSelected ? (
                  <Check size={14} color={COLORS.common.white} strokeWidth={3} />
                ) : (
                  <Text style={styles.optionKeyText}>{optionLetter}</Text>
                )}
              </View>

              {/* Option Text */}
              <Text
                style={[
                  styles.optionText,
                  isSelected && styles.optionTextSelected,
                ]}
              >
                {option.text}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Clear Option Row */}
      {selectedOptionIds.length > 0 && (
        <TouchableOpacity
          onPress={onClearOption}
          style={styles.clearResponseButton}
          activeOpacity={0.7}
        >
          <RotateCcw size={13} color={COLORS.slate[400]} />
          <Text style={styles.clearResponseText}>Clear Response</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}

const getStyles = (theme, isDark) =>
  StyleSheet.create({
    container: {
      padding: 16,
      paddingBottom: 30,
    },
    emptyContainer: {
      padding: 40,
      alignItems: 'center',
      justifyContent: 'center',
    },
    emptyText: {
      color: theme.colors.textSecondary,
      fontSize: 14,
    },
    topInfoRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 12,
    },
    qNumBadge: {
      backgroundColor: theme.colors.card,
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    qNumText: {
      color: theme.colors.text,
      fontSize: 12,
      fontWeight: '700',
    },
    marksBadge: {
      backgroundColor: 'rgba(16, 185, 129, 0.12)',
      paddingHorizontal: 8,
      paddingVertical: 5,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: 'rgba(16, 185, 129, 0.25)',
    },
    marksText: {
      color: COLORS.status.success,
      fontSize: 11,
      fontWeight: '700',
    },
    markButton: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      backgroundColor: theme.colors.card,
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    markButtonActive: {
      backgroundColor: 'rgba(192, 132, 252, 0.15)',
      borderColor: 'rgba(192, 132, 252, 0.4)',
    },
    markButtonText: {
      fontSize: 11,
      fontWeight: '600',
      color: theme.colors.textSecondary,
    },
    markButtonTextActive: {
      color: '#c084fc',
    },
    questionCard: {
      backgroundColor: theme.colors.card,
      borderRadius: 18,
      padding: 18,
      borderWidth: 1,
      borderColor: theme.colors.border,
      marginBottom: 16,
    },
    questionText: {
      fontSize: 15,
      fontWeight: '600',
      color: theme.colors.text,
      lineHeight: 23,
    },
    optionsSection: {
      marginBottom: 12,
    },
    optionsLabel: {
      fontSize: 12,
      color: theme.colors.textSecondary,
      fontWeight: '600',
      marginBottom: 10,
      marginLeft: 2,
    },
    optionItem: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.card,
      borderRadius: 14,
      padding: 14,
      borderWidth: 1.5,
      borderColor: theme.colors.border,
      marginBottom: 10,
    },
    optionItemSelected: {
      borderColor: COLORS.brand[500],
      backgroundColor: isDark ? 'rgba(94, 67, 243, 0.12)' : 'rgba(94, 67, 243, 0.08)',
    },
    optionKeyBox: {
      width: 28,
      height: 28,
      borderRadius: 8,
      backgroundColor: isDark ? COLORS.slate[950] : theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
    },
    optionKeyBoxSelected: {
      backgroundColor: COLORS.brand[600],
      borderColor: COLORS.brand[600],
    },
    optionKeyText: {
      fontSize: 12,
      fontWeight: '800',
      color: theme.colors.text,
    },
    optionText: {
      flex: 1,
      fontSize: 14,
      color: theme.colors.text,
      lineHeight: 20,
    },
    optionTextSelected: {
      color: isDark ? COLORS.common.white : COLORS.brand[700],
      fontWeight: '700',
    },
    clearResponseButton: {
      flexDirection: 'row',
      alignItems: 'center',
      alignSelf: 'flex-start',
      gap: 6,
      paddingVertical: 6,
      paddingHorizontal: 8,
      marginTop: 2,
    },
    clearResponseText: {
      fontSize: 12,
      color: theme.colors.textSecondary,
      fontWeight: '600',
    },
  });

export default QuestionViewer;
