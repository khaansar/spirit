import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Clock, LayoutGrid, AlertCircle, RotateCw } from 'lucide-react-native';
import { COLORS } from '../../constants/theme';
import { useTheme } from '../../context/ThemeContext';

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
  const { theme, isDark } = useTheme();
  const styles = useMemo(() => getStyles(theme, isDark), [theme, isDark]);

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

const getStyles = (theme, isDark) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: theme.colors.card,
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    sectionBox: {
      maxWidth: '32%',
      backgroundColor: isDark ? COLORS.slate[950] : theme.colors.surface,
      paddingHorizontal: 8,
      paddingVertical: 5,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    sectionLabel: {
      fontSize: 11,
      fontWeight: '700',
      color: theme.colors.text,
    },
    timerBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: isDark ? 'rgba(94, 67, 243, 0.12)' : 'rgba(94, 67, 243, 0.08)',
      borderWidth: 1,
      borderColor: isDark ? 'rgba(94, 67, 243, 0.3)' : 'rgba(94, 67, 243, 0.2)',
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 20,
    },
    timerBadgeWarning: {
      backgroundColor: isDark ? 'rgba(239, 68, 68, 0.15)' : 'rgba(239, 68, 68, 0.1)',
      borderColor: isDark ? 'rgba(239, 68, 68, 0.4)' : 'rgba(239, 68, 68, 0.3)',
    },
    timerText: {
      fontSize: 14,
      fontWeight: '800',
      color: COLORS.brand[500],
      fontVariant: ['tabular-nums'],
      letterSpacing: 0.5,
    },
    timerTextWarning: {
      color: '#ef4444',
    },
    rightActions: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    orientationBtn: {
      backgroundColor: isDark ? COLORS.slate[950] : theme.colors.surface,
      padding: 7,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: theme.colors.border,
      alignItems: 'center',
      justifyContent: 'center',
    },
    paletteButton: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      backgroundColor: isDark ? COLORS.slate[950] : theme.colors.surface,
      paddingHorizontal: 8,
      paddingVertical: 6,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    paletteBadge: {
      backgroundColor: isDark ? COLORS.slate[800] : COLORS.slate[200],
      paddingHorizontal: 5,
      paddingVertical: 2,
      borderRadius: 6,
    },
    paletteBadgeText: {
      fontSize: 10,
      fontWeight: '700',
      color: theme.colors.text,
    },
    submitHeaderBtn: {
      backgroundColor: isDark ? 'rgba(239, 68, 68, 0.15)' : 'rgba(239, 68, 68, 0.1)',
      borderWidth: 1,
      borderColor: isDark ? 'rgba(239, 68, 68, 0.35)' : 'rgba(239, 68, 68, 0.25)',
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: 10,
    },
    submitHeaderText: {
      color: isDark ? '#fca5a5' : '#dc2626',
      fontSize: 11,
      fontWeight: '800',
    },
  });

export default ExamHeader;
