import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import {
  Settings,
  Stethoscope,
  Landmark,
  BookOpen,
  Sigma,
  Monitor,
  Network,
  Cpu,
  Layers,
} from 'lucide-react-native';
import { COLORS } from '../../constants/theme';

const ICON_MAP = {
  Settings: Settings,
  Stethoscope: Stethoscope,
  Landmark: Landmark,
  BookOpen: BookOpen,
  Sigma: Sigma,
  Monitor: Monitor,
  Network: Network,
  Cpu: Cpu,
};

export function CategoryCard({ category, isSelected = false, onPress, style }) {
  const IconComponent = ICON_MAP[category.icon] || Layers;
  const themeColor = category.color || COLORS.brand[400];
  const bgColor = category.bg || 'rgba(94, 67, 243, 0.12)';

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      style={[
        styles.card,
        isSelected && styles.cardSelected,
        style,
      ]}
    >
      <View style={[styles.iconBox, { backgroundColor: bgColor }]}>
        <IconComponent size={22} color={themeColor} />
      </View>

      <Text style={styles.name} numberOfLines={2}>
        {category.name}
      </Text>

      <View style={styles.badge}>
        <Text style={styles.badgeText}>{category.testCount || 50}+ Tests</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.slate[900],
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.slate[800],
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 130,
  },
  cardSelected: {
    borderColor: COLORS.brand[500],
    backgroundColor: 'rgba(94, 67, 243, 0.08)',
    shadowColor: COLORS.brand[600],
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  name: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.common.white,
    textAlign: 'center',
    marginBottom: 6,
    minHeight: 34,
  },
  badge: {
    backgroundColor: COLORS.slate[800],
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: COLORS.slate[400],
  },
});

export default CategoryCard;
