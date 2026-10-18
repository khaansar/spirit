import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
  View,
} from 'react-native';
import { COLORS } from '../../constants/theme';

export function Button({
  title,
  onPress,
  variant = 'primary', // 'primary' | 'secondary' | 'outline' | 'ghost'
  loading = false,
  disabled = false,
  leftIcon,
  rightIcon,
  style,
  textStyle,
}) {
  const getButtonStyles = () => {
    switch (variant) {
      case 'secondary':
        return styles.btnSecondary;
      case 'outline':
        return styles.btnOutline;
      case 'ghost':
        return styles.btnGhost;
      case 'primary':
      default:
        return styles.btnPrimary;
    }
  };

  const getTextStyles = () => {
    switch (variant) {
      case 'secondary':
        return styles.textSecondary;
      case 'outline':
        return styles.textOutline;
      case 'ghost':
        return styles.textGhost;
      case 'primary':
      default:
        return styles.textPrimary;
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        styles.baseButton,
        getButtonStyles(),
        (disabled || loading) && styles.btnDisabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'outline' || variant === 'ghost' ? COLORS.brand[400] : COLORS.common.white}
        />
      ) : (
        <View style={styles.contentContainer}>
          {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}
          <Text style={[styles.baseText, getTextStyles(), textStyle]}>
            {title}
          </Text>
          {rightIcon && <View style={styles.rightIcon}>{rightIcon}</View>}
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  baseButton: {
    height: 52,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 20,
    width: '100%',
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnPrimary: {
    backgroundColor: COLORS.brand[600],
    shadowColor: COLORS.brand[600],
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 4,
  },
  btnSecondary: {
    backgroundColor: COLORS.slate[800],
    borderWidth: 1,
    borderColor: COLORS.slate[700],
  },
  btnOutline: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: COLORS.brand[600],
  },
  btnGhost: {
    backgroundColor: 'transparent',
  },
  btnDisabled: {
    opacity: 0.55,
  },
  leftIcon: {
    marginRight: 8,
  },
  rightIcon: {
    marginLeft: 8,
  },
  baseText: {
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  textPrimary: {
    color: COLORS.common.white,
  },
  textSecondary: {
    color: COLORS.slate[200],
  },
  textOutline: {
    color: COLORS.brand[400],
  },
  textGhost: {
    color: COLORS.slate[300],
  },
});

export default Button;
