import React, { useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  BackHandler,
  Alert,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { ChevronLeft, ChevronRight, Bookmark } from 'lucide-react-native';

import ExamHeader from '../../components/attempt/ExamHeader';
import QuestionViewer from '../../components/attempt/QuestionViewer';
import QuestionPaletteModal from '../../components/attempt/QuestionPaletteModal';
import SubmitConfirmModal from '../../components/attempt/SubmitConfirmModal';

import { COLORS } from '../../constants/theme';
import {
  initLocalExam,
  tickTimer,
  selectAnswer,
  clearAnswer,
  toggleMarkForReview,
  setCurrentSection,
  setCurrentQuestion,
  nextQuestion,
  prevQuestion,
  setPaletteOpen,
  setSubmitModalOpen,
  submitAttemptThunk,
  saveAnswerThunk,
} from '../../store/slices/attemptSlice';

export function TestAttemptScreen({ route, navigation }) {
  const dispatch = useDispatch();
  const { test } = route.params || {};

  const {
    attemptId,
    testTitle,
    timeRemainingSeconds,
    sections,
    currentSectionIndex,
    currentQuestionIndex,
    responses,
    status,
    isPaletteOpen,
    isSubmitModalOpen,
    lastResult,
  } = useSelector((state) => state.attempt);

  // Initialize test data on mount
  useEffect(() => {
    dispatch(initLocalExam(test));
  }, [dispatch, test]);

  // Real-time Countdown Timer Interval
  useEffect(() => {
    if (status !== 'active') return;

    const interval = setInterval(() => {
      dispatch(tickTimer());
    }, 1000);

    return () => clearInterval(interval);
  }, [dispatch, status]);

  // Auto-submit when time expires
  useEffect(() => {
    if (status === 'active' && timeRemainingSeconds === 0) {
      Alert.alert(
        'Time Is Up!',
        'Your examination time has expired. Submitting your test automatically now...',
        [{ text: 'OK', onPress: () => dispatch(submitAttemptThunk()) }]
      );
      dispatch(submitAttemptThunk());
    }
  }, [dispatch, status, timeRemainingSeconds]);

  // Navigate to Result screen once submitted
  useEffect(() => {
    if (status === 'submitted') {
      navigation.replace('TestResult', {
        result: lastResult,
        attemptId: lastResult?.attemptId || attemptId,
      });
    }
  }, [status, lastResult, attemptId, navigation]);

  // Handle Hardware Back Button
  useEffect(() => {
    const onBackPress = () => {
      Alert.alert(
        'Exit Examination?',
        'Are you sure you want to pause or exit? Your timer will continue running.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Exit', style: 'destructive', onPress: () => navigation.goBack() },
        ]
      );
      return true;
    };

    const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => subscription.remove();
  }, [navigation]);

  const currentSection = sections[currentSectionIndex] || { name: 'Section', questions: [] };
  const currentQuestion = currentSection.questions?.[currentQuestionIndex];
  const currentResponse = currentQuestion ? responses[currentQuestion.id] : null;

  // Total and answered counts
  let totalExamQuestions = 0;
  let answeredExamQuestions = 0;
  let markedCount = 0;

  sections.forEach((sec) => {
    sec.questions?.forEach((q) => {
      totalExamQuestions++;
      const resp = responses[q.id];
      if (resp?.selected && resp.selected.length > 0) {
        answeredExamQuestions++;
      }
      if (resp?.marked) {
        markedCount++;
      }
    });
  });

  const isFirstQuestion = currentSectionIndex === 0 && currentQuestionIndex === 0;
  const isLastQuestion =
    currentSectionIndex === sections.length - 1 &&
    currentQuestionIndex === (currentSection.questions?.length || 1) - 1;

  const handleNextOrSubmit = () => {
    if (isLastQuestion) {
      dispatch(setSubmitModalOpen(true));
    } else {
      dispatch(nextQuestion());
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.slate[950]} />

      {/* Real-time Header */}
      <ExamHeader
        timeRemainingSeconds={timeRemainingSeconds}
        currentSectionName={currentSection.name}
        answeredCount={answeredExamQuestions}
        totalQuestions={totalExamQuestions}
        onOpenPalette={() => dispatch(setPaletteOpen(true))}
        onSubmitPress={() => dispatch(setSubmitModalOpen(true))}
      />

      {/* Section Quick Switcher Tabs */}
      <View style={styles.sectionTabsContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.sectionTabs}>
          {sections.map((sec, idx) => {
            const isSelected = currentSectionIndex === idx;
            return (
              <TouchableOpacity
                key={sec.id || idx}
                onPress={() => dispatch(setCurrentSection(idx))}
                style={[styles.sectionTab, isSelected && styles.sectionTabSelected]}
                activeOpacity={0.8}
              >
                <Text style={[styles.sectionTabText, isSelected && styles.sectionTabTextSelected]}>
                  {sec.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Question Canvas */}
      <View style={styles.viewerContainer}>
        <QuestionViewer
          question={currentQuestion}
          questionNumber={currentQuestionIndex + 1}
          totalInCurrentSection={currentSection.questions?.length || 1}
          selectedOptionIds={currentResponse?.selected || []}
          isMarked={!!currentResponse?.marked}
          onSelectOption={(optionId, isMulti) => {
            if (currentQuestion) {
              dispatch(selectAnswer({ questionId: currentQuestion.id, optionId, isMulti }));
              dispatch(
                saveAnswerThunk({
                  questionId: currentQuestion.id,
                  selectedOption: optionId,
                  currentQuestionIndex,
                  currentSectionId: currentSection?.id,
                })
              );
            }
          }}
          onClearOption={() => {
            if (currentQuestion) {
              dispatch(clearAnswer({ questionId: currentQuestion.id }));
              dispatch(
                saveAnswerThunk({
                  questionId: currentQuestion.id,
                  selectedOption: null,
                  currentQuestionIndex,
                  currentSectionId: currentSection?.id,
                })
              );
            }
          }}
          onToggleMark={() => {
            if (currentQuestion) {
              dispatch(toggleMarkForReview({ questionId: currentQuestion.id }));
            }
          }}
        />
      </View>

      {/* Bottom Sticky Action Bar */}
      <View style={styles.bottomBar}>
        {/* Previous Button */}
        <TouchableOpacity
          style={[styles.navButton, isFirstQuestion && styles.navButtonDisabled]}
          onPress={() => dispatch(prevQuestion())}
          disabled={isFirstQuestion}
          activeOpacity={0.7}
        >
          <ChevronLeft size={18} color={isFirstQuestion ? COLORS.slate[600] : COLORS.slate[200]} />
          <Text style={[styles.navButtonText, isFirstQuestion && styles.navButtonTextDisabled]}>
            Previous
          </Text>
        </TouchableOpacity>

        {/* Mark for Review Button */}
        <TouchableOpacity
          style={[styles.actionBtn, currentResponse?.marked && styles.actionBtnActive]}
          onPress={() => {
            if (currentQuestion) {
              dispatch(toggleMarkForReview({ questionId: currentQuestion.id }));
            }
          }}
          activeOpacity={0.7}
        >
          <Bookmark
            size={16}
            color={currentResponse?.marked ? '#c084fc' : COLORS.slate[300]}
            fill={currentResponse?.marked ? '#c084fc' : 'transparent'}
          />
          <Text style={[styles.actionBtnText, currentResponse?.marked && styles.actionBtnTextActive]}>
            {currentResponse?.marked ? 'Marked' : 'Mark'}
          </Text>
        </TouchableOpacity>

        {/* Save & Next / Submit Button */}
        <TouchableOpacity
          style={[styles.saveNextButton, isLastQuestion && styles.submitFinalButton]}
          onPress={handleNextOrSubmit}
          activeOpacity={0.8}
        >
          <Text style={styles.saveNextText}>
            {isLastQuestion ? 'Review & Submit' : 'Save & Next'}
          </Text>
          <ChevronRight size={18} color={COLORS.common.white} />
        </TouchableOpacity>
      </View>

      {/* Question Palette Drawer Modal */}
      <QuestionPaletteModal
        visible={isPaletteOpen}
        onClose={() => dispatch(setPaletteOpen(false))}
        sections={sections}
        currentSectionIndex={currentSectionIndex}
        currentQuestionIndex={currentQuestionIndex}
        responses={responses}
        onSelectQuestion={(qIdx) => dispatch(setCurrentQuestion(qIdx))}
        onSelectSection={(sIdx) => dispatch(setCurrentSection(sIdx))}
      />

      {/* Submit Confirmation Dialog Modal */}
      <SubmitConfirmModal
        visible={isSubmitModalOpen}
        onClose={() => dispatch(setSubmitModalOpen(false))}
        onConfirm={() => dispatch(submitAttemptThunk())}
        isSubmitting={status === 'submitting'}
        totalQuestions={totalExamQuestions}
        answeredCount={answeredExamQuestions}
        markedCount={markedCount}
        timeRemainingSeconds={timeRemainingSeconds}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.slate[950],
  },
  sectionTabsContainer: {
    backgroundColor: COLORS.slate[900],
    borderBottomWidth: 1,
    borderBottomColor: COLORS.slate[800],
  },
  sectionTabs: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
  },
  sectionTab: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 8,
    backgroundColor: COLORS.slate[950],
    borderWidth: 1,
    borderColor: COLORS.slate[800],
  },
  sectionTabSelected: {
    backgroundColor: COLORS.brand[600],
    borderColor: COLORS.brand[600],
  },
  sectionTabText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.slate[400],
  },
  sectionTabTextSelected: {
    color: COLORS.common.white,
    fontWeight: '700',
  },
  viewerContainer: {
    flex: 1,
  },
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.slate[900],
    borderTopWidth: 1,
    borderTopColor: COLORS.slate[800],
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.slate[800],
    paddingHorizontal: 12,
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.slate[700],
  },
  navButtonDisabled: {
    backgroundColor: COLORS.slate[900],
    borderColor: COLORS.slate[800],
  },
  navButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.slate[200],
  },
  navButtonTextDisabled: {
    color: COLORS.slate[600],
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.slate[800],
    paddingHorizontal: 12,
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.slate[700],
  },
  actionBtnActive: {
    backgroundColor: 'rgba(192, 132, 252, 0.15)',
    borderColor: 'rgba(192, 132, 252, 0.4)',
  },
  actionBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.slate[300],
  },
  actionBtnTextActive: {
    color: '#c084fc',
    fontWeight: '700',
  },
  saveNextButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    backgroundColor: COLORS.brand[600],
    height: 44,
    borderRadius: 12,
    paddingHorizontal: 14,
    shadowColor: COLORS.brand[600],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 3,
  },
  submitFinalButton: {
    backgroundColor: '#dc2626',
    shadowColor: '#dc2626',
  },
  saveNextText: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.common.white,
  },
});

export default TestAttemptScreen;
