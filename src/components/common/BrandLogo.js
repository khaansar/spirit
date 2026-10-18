import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../../constants/theme';
import { GraduationCap } from 'lucide-react-native';

export function BrandLogo({
  size = 'md',
  showTagline = true,
  layout = 'horizontal',
  className = '',
}) {
  const isStacked = layout === 'stacked';

  const sizeStyles = {
    sm: {
      iconSize: 22,
      firstText: 18,
      secondText: 18,
      tagline: 10,
    },
    md: {
      iconSize: 28,
      firstText: 26,
      secondText: 26,
      tagline: 11,
    },
    lg: {
      iconSize: 34,
      firstText: 32,
      secondText: 32,
      tagline: 12,
    },
  };

  const currentSize = sizeStyles[size] || sizeStyles.md;

  return (
    <View style={[styles.container, isStacked && styles.containerStacked]}>
      <View style={[styles.logoRow, isStacked && styles.logoRowStacked]}>
        {/* Brand Icon Badge */}
        <View style={[styles.iconContainer, { width: currentSize.iconSize * 1.5, height: currentSize.iconSize * 1.5 }]}>
          <GraduationCap size={currentSize.iconSize} color={COLORS.brand[400]} />
        </View>

        {/* Brand Typography */}
        <View style={styles.textRow}>
          <Text style={[styles.firstPart, { fontSize: currentSize.firstText }]}>Clear</Text>
          <Text style={styles.hyphen}>-</Text>
          <Text style={[styles.secondPart, { fontSize: currentSize.secondText }]}>It</Text>
        </View>
      </View>

      {/* Tagline */}
      {showTagline && (
        <View style={styles.taglineContainer}>
          <View style={styles.taglineLine} />
          <Text style={[styles.taglineText, { fontSize: currentSize.tagline }]}>
            Practice. Perform. Clear It.
          </Text>
          <View style={styles.taglineLine} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  containerStacked: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logoRowStacked: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: 8,
  },
  iconContainer: {
    borderRadius: 14,
    backgroundColor: 'rgba(94, 67, 243, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(94, 67, 243, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  firstPart: {
    fontWeight: '900',
    color: COLORS.common.white,
    letterSpacing: -0.5,
  },
  hyphen: {
    fontSize: 22,
    fontWeight: '900',
    color: COLORS.accent.skyLight,
    marginHorizontal: 1,
  },
  secondPart: {
    fontWeight: '900',
    color: COLORS.accent.skyLight,
    letterSpacing: -0.5,
  },
  taglineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    gap: 8,
  },
  taglineLine: {
    height: 1,
    width: 14,
    backgroundColor: COLORS.slate[700],
  },
  taglineText: {
    color: COLORS.slate[400],
    fontWeight: '500',
    letterSpacing: 0.8,
  },
});

export default BrandLogo;
