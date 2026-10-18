import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { Check, Bookmark, RotateCcw } from 'lucide-react-native';
import { COLORS } from '../../constants/theme';

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

const styles = StyleSheet.create({
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
    color: COLORS.slate[400],
    fontSize: 14,
  },
  topInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  qNumBadge: {
    backgroundColor: COLORS.slate[900],
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.slate[800],
  },
  qNumText: {
    color: COLORS.common.white,
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
    backgroundColor: COLORS.slate[900],
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.slate[800],
  },
  markButtonActive: {
    backgroundColor: 'rgba(192, 132, 252, 0.15)',
    borderColor: 'rgba(192, 132, 252, 0.4)',
  },
  markButtonText: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.slate[400],
  },
  markButtonTextActive: {
    color: '#c084fc',
  },
  questionCard: {
    backgroundColor: COLORS.slate[900],
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: COLORS.slate[800],
    marginBottom: 16,
  },
  questionText: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.common.white,
    lineHeight: 23,
  },
  optionsSection: {
    marginBottom: 12,
  },
  optionsLabel: {
    fontSize: 12,
    color: COLORS.slate[400],
    fontWeight: '600',
    marginBottom: 10,
    marginLeft: 2,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.slate[900],
    borderRadius: 14,
    padding: 14,
    borderWidth: 1.5,
    borderColor: COLORS.slate[800],
    marginBottom: 10,
  },
  optionItemSelected: {
    borderColor: COLORS.brand[500],
    backgroundColor: 'rgba(94, 67, 243, 0.1)',
  },
  optionKeyBox: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: COLORS.slate[950],
    borderWidth: 1,
    borderColor: COLORS.slate[700],
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
    color: COLORS.slate[300],
  },
  optionText: {
    flex: 1,
    fontSize: 14,
    color: COLORS.slate[200],
    lineHeight: 20,
  },
  optionTextSelected: {
    color: COLORS.common.white,
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
    color: COLORS.slate[400],
    fontWeight: '600',
  },
});

export default QuestionViewer;
