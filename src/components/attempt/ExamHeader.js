import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Clock, LayoutGrid, AlertCircle, RotateCw } from 'lucide-react-native';
import { COLORS } from '../../constants/theme';

export function ExamHeader({
  timeRemainingSeconds,
  currentSectionName,
  answeredCount,
  totalQuestions,
  onOpenPalette,
  onSubmitPress,
  onToggleOrientation,
  isLandscape = false,
}) {
  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    const pad = (n) => String(n).padStart(2, '0');
    if (hrs > 0) {
      return `${pad(hrs)}:${pad(mins)}:${pad(secs)}`;
    }
    return `${pad(mins)}:${pad(secs)}`;
  };

  const isLowTime = timeRemainingSeconds < 300; // < 5 mins

  return (
    <View style={styles.container}>
      {/* Section Pill */}
      <View style={styles.sectionBox}>
        <Text style={styles.sectionLabel} numberOfLines={1}>
          {currentSectionName || 'Section'}
        </Text>
      </View>

      {/* Countdown Timer */}
      <View style={[styles.timerBadge, isLowTime && styles.timerBadgeWarning]}>
        <Clock
          size={14}
          color={isLowTime ? COLORS.status.error : COLORS.brand[400]}
          style={{ marginRight: 6 }}
        />
        <Text style={[styles.timerText, isLowTime && styles.timerTextWarning]}>
          {formatTime(timeRemainingSeconds)}
        </Text>
      </View>

      {/* Right Action: Orientation, Palette & Submit */}
      <View style={styles.rightActions}>
        {onToggleOrientation && (
          <TouchableOpacity
            onPress={onToggleOrientation}
            style={styles.orientationBtn}
            activeOpacity={0.7}
            accessibilityLabel="Toggle Screen Orientation"
          >
            <RotateCw size={16} color={isLandscape ? COLORS.brand[400] : COLORS.slate[300]} />
          </TouchableOpacity>
        )}

        <TouchableOpacity
          onPress={onOpenPalette}
          style={styles.paletteButton}
          activeOpacity={0.7}
        >
          <LayoutGrid size={18} color={COLORS.slate[300]} />
          <View style={styles.paletteBadge}>
            <Text style={styles.paletteBadgeText}>
              {answeredCount}/{totalQuestions}
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onSubmitPress}
          style={styles.submitHeaderBtn}
          activeOpacity={0.8}
        >
          <Text style={styles.submitHeaderText}>Submit</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.slate[900],
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.slate[800],
  },
  sectionBox: {
    maxWidth: '32%',
    backgroundColor: COLORS.slate[950],
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.slate[800],
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.slate[300],
  },
  timerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(94, 67, 243, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(94, 67, 243, 0.3)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  timerBadgeWarning: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    borderColor: 'rgba(239, 68, 68, 0.4)',
  },
  timerText: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.brand[400],
    fontVariant: ['tabular-nums'],
    letterSpacing: 0.5,
  },
  timerTextWarning: {
    color: '#f87171',
  },
  rightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  orientationBtn: {
    backgroundColor: COLORS.slate[950],
    padding: 7,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.slate[800],
    alignItems: 'center',
    justifyContent: 'center',
  },
  paletteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLORS.slate[950],
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.slate[800],
  },
  paletteBadge: {
    backgroundColor: COLORS.slate[800],
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 6,
  },
  paletteBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.slate[300],
  },
  submitHeaderBtn: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.35)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },
  submitHeaderText: {
    color: '#fca5a5',
    fontSize: 11,
    fontWeight: '800',
  },
});

export default ExamHeader;
