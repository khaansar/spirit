import React, { useMemo } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { X } from 'lucide-react-native';
import { COLORS } from '../../constants/theme';
import { useTheme } from '../../context/ThemeContext';

export function QuestionPaletteModal({
  visible,
  onClose,
  sections = [],
  currentSectionIndex,
  currentQuestionIndex,
  responses = {},
  onSelectQuestion,
  onSelectSection,
}) {
  const { theme, isDark } = useTheme();
  const styles = useMemo(() => getStyles(theme, isDark), [theme, isDark]);

  const currentSection = sections[currentSectionIndex] || { questions: [] };

  // Calculate status counts across entire exam
  let answeredCount = 0;
  let markedCount = 0;
  let notAnsweredCount = 0;
  let notVisitedCount = 0;

  sections.forEach((sec) => {
    sec.questions?.forEach((q) => {
      const resp = responses[q.id];
      if (!resp || !resp.visited) {
        notVisitedCount++;
      } else if (resp.marked) {
        markedCount++;
      } else if (resp.selected && resp.selected.length > 0) {
        answeredCount++;
      } else {
        notAnsweredCount++;
      }
    });
  });

  const getQuestionStatus = (questionId) => {
    const resp = responses[questionId];
    if (!resp || !resp.visited) return 'NOT_VISITED';
    if (resp.marked) return 'MARKED';
    if (resp.selected && resp.selected.length > 0) return 'ANSWERED';
    return 'NOT_ANSWERED';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'ANSWERED':
        return '#10b981'; // Emerald
      case 'NOT_ANSWERED':
        return '#ef4444'; // Red
      case 'MARKED':
        return '#8b5cf6'; // Purple
      case 'NOT_VISITED':
      default:
        return isDark ? '#334155' : '#94a3b8'; // Slate
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Question Palette</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn} activeOpacity={0.7}>
              <X size={20} color={theme.colors.text} />
            </TouchableOpacity>
          </View>

          {/* Status Counter Badges */}
          <View style={styles.legendContainer}>
            <View style={styles.legendItem}>
              <View style={[styles.legendBox, { backgroundColor: '#10b981' }]}>
                <Text style={styles.legendBoxText}>{answeredCount}</Text>
              </View>
              <Text style={styles.legendText}>Answered</Text>
            </View>

            <View style={styles.legendItem}>
              <View style={[styles.legendBox, { backgroundColor: '#ef4444' }]}>
                <Text style={styles.legendBoxText}>{notAnsweredCount}</Text>
              </View>
              <Text style={styles.legendText}>Not Answered</Text>
            </View>

            <View style={styles.legendItem}>
              <View style={[styles.legendBox, { backgroundColor: '#8b5cf6' }]}>
                <Text style={styles.legendBoxText}>{markedCount}</Text>
              </View>
              <Text style={styles.legendText}>Marked</Text>
            </View>

            <View style={styles.legendItem}>
              <View style={[styles.legendBox, { backgroundColor: isDark ? '#334155' : '#94a3b8' }]}>
                <Text style={styles.legendBoxText}>{notVisitedCount}</Text>
              </View>
              <Text style={styles.legendText}>Not Visited</Text>
            </View>
          </View>

          {/* Section Tabs inside Palette */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.sectionTabs}
          >
            {sections.map((sec, idx) => {
              const isSelected = currentSectionIndex === idx;
              return (
                <TouchableOpacity
                  key={sec.id || idx}
                  onPress={() => onSelectSection(idx)}
                  style={[styles.secTab, isSelected && styles.secTabSelected]}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.secTabText, isSelected && styles.secTabTextSelected]}>
                    {sec.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* Question Grid */}
          <ScrollView contentContainerStyle={styles.gridContainer} showsVerticalScrollIndicator={false}>
            <View style={styles.grid}>
              {currentSection.questions?.map((q, idx) => {
                const status = getQuestionStatus(q.id);
                const color = getStatusColor(status);
                const isCurrent = currentQuestionIndex === idx;

                return (
                  <TouchableOpacity
                    key={q.id}
                    onPress={() => {
                      onSelectQuestion(idx);
                      onClose();
                    }}
                    style={[
                      styles.qItem,
                      { backgroundColor: color },
                      isCurrent && styles.qItemCurrent,
                    ]}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.qItemText}>{idx + 1}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const getStyles = (theme, isDark) =>
  StyleSheet.create({
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.75)',
      justifyContent: 'flex-end',
    },
    modalContent: {
      backgroundColor: theme.colors.card,
      borderTopLeftRadius: 28,
      borderTopRightRadius: 28,
      borderWidth: 1,
      borderColor: theme.colors.border,
      maxHeight: '85%',
      paddingBottom: 24,
    },
    modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingVertical: 18,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: '800',
      color: theme.colors.text,
    },
    closeBtn: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: isDark ? COLORS.slate[800] : COLORS.slate[200],
      justifyContent: 'center',
      alignItems: 'center',
    },
    legendContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
      paddingVertical: 14,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    legendItem: {
      alignItems: 'center',
      gap: 4,
    },
    legendBox: {
      width: 32,
      height: 26,
      borderRadius: 6,
      justifyContent: 'center',
      alignItems: 'center',
    },
    legendBoxText: {
      color: COLORS.common.white,
      fontSize: 12,
      fontWeight: '800',
    },
    legendText: {
      fontSize: 10,
      color: theme.colors.textSecondary,
      fontWeight: '600',
    },
    sectionTabs: {
      paddingHorizontal: 20,
      paddingVertical: 12,
      gap: 8,
    },
    secTab: {
      paddingHorizontal: 14,
      paddingVertical: 7,
      borderRadius: 20,
      backgroundColor: isDark ? COLORS.slate[950] : theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    secTabSelected: {
      backgroundColor: COLORS.brand[600],
      borderColor: COLORS.brand[600],
    },
    secTabText: {
      fontSize: 12,
      fontWeight: '600',
      color: theme.colors.textSecondary,
    },
    secTabTextSelected: {
      color: COLORS.common.white,
      fontWeight: '700',
    },
    gridContainer: {
      paddingHorizontal: 20,
      paddingVertical: 14,
    },
    grid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 12,
    },
    qItem: {
      width: 46,
      height: 46,
      borderRadius: 12,
      justifyContent: 'center',
      alignItems: 'center',
    },
    qItemCurrent: {
      borderWidth: 2.5,
      borderColor: theme.colors.text,
      transform: [{ scale: 1.05 }],
    },
    qItemText: {
      color: COLORS.common.white,
      fontSize: 14,
      fontWeight: '800',
    },
  });

export default QuestionPaletteModal;
