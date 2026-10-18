import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { AlertTriangle, Clock, CheckCircle, HelpCircle } from 'lucide-react-native';
import { COLORS } from '../../constants/theme';

export function SubmitConfirmModal({
  visible,
  onClose,
  onConfirm,
  isSubmitting = false,
  totalQuestions = 0,
  answeredCount = 0,
  markedCount = 0,
  timeRemainingSeconds = 0,
}) {
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const unansweredCount = totalQuestions - answeredCount;

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.card}>
          <View style={styles.iconCircle}>
            <AlertTriangle size={32} color={COLORS.brand[400]} />
          </View>

          <Text style={styles.title}>Submit Examination?</Text>
          <Text style={styles.subtitle}>
            Are you sure you want to finish and submit your test? You will not be able to change any answers after submission.
          </Text>

          {/* Exam Summary Breakdown */}
          <View style={styles.statsCard}>
            <View style={styles.statRow}>
              <View style={styles.statLeft}>
                <CheckCircle size={15} color={COLORS.status.success} />
                <Text style={styles.statLabel}>Answered Questions</Text>
              </View>
              <Text style={[styles.statValue, { color: COLORS.status.success }]}>
                {answeredCount}
              </Text>
            </View>

            <View style={styles.statRow}>
              <View style={styles.statLeft}>
                <HelpCircle size={15} color="#ef4444" />
                <Text style={styles.statLabel}>Unanswered Questions</Text>
              </View>
              <Text style={[styles.statValue, { color: '#ef4444' }]}>
                {unansweredCount}
              </Text>
            </View>

            <View style={styles.statRow}>
              <View style={styles.statLeft}>
                <Clock size={15} color={COLORS.accent.skyLight} />
                <Text style={styles.statLabel}>Time Remaining</Text>
              </View>
              <Text style={[styles.statValue, { color: COLORS.accent.skyLight }]}>
                {formatTime(timeRemainingSeconds)}
              </Text>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={onClose}
              disabled={isSubmitting}
              activeOpacity={0.7}
            >
              <Text style={styles.cancelText}>Resume Exam</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.confirmButton}
              onPress={onConfirm}
              disabled={isSubmitting}
              activeOpacity={0.8}
            >
              {isSubmitting ? (
                <ActivityIndicator size="small" color={COLORS.common.white} />
              ) : (
                <Text style={styles.confirmText}>Submit Test</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: COLORS.slate[900],
    borderRadius: 24,
    padding: 24,
    width: '100%',
    maxWidth: 380,
    borderWidth: 1,
    borderColor: COLORS.slate[800],
    alignItems: 'center',
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(94, 67, 243, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(94, 67, 243, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.common.white,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 13,
    color: COLORS.slate[400],
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 18,
    marginBottom: 20,
  },
  statsCard: {
    width: '100%',
    backgroundColor: COLORS.slate[950],
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.slate[800],
    marginBottom: 20,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 7,
  },
  statLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statLabel: {
    fontSize: 13,
    color: COLORS.slate[300],
  },
  statValue: {
    fontSize: 14,
    fontWeight: '700',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  cancelButton: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    backgroundColor: COLORS.slate[800],
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.slate[700],
  },
  cancelText: {
    color: COLORS.slate[200],
    fontSize: 14,
    fontWeight: '700',
  },
  confirmButton: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#dc2626', // Red submit button
    justifyContent: 'center',
    alignItems: 'center',
  },
  confirmText: {
    color: COLORS.common.white,
    fontSize: 14,
    fontWeight: '700',
  },
});

export default SubmitConfirmModal;
