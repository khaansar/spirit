import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import { Check } from 'lucide-react-native';
import { COLORS } from '../../constants/theme';

export function Checkbox({ checked, onChange, label, style }) {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() => onChange(!checked)}
      style={[styles.container, style]}
    >
      <View style={[styles.box, checked && styles.boxChecked]}>
        {checked && <Check size={14} color={COLORS.common.white} strokeWidth={3} />}
      </View>
      {label && <Text style={styles.label}>{label}</Text>}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  box: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: COLORS.slate[700],
    backgroundColor: COLORS.slate[900],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  boxChecked: {
    backgroundColor: COLORS.brand[600],
    borderColor: COLORS.brand[600],
  },
  label: {
    fontSize: 13,
    fontWeight: '500',
    color: COLORS.slate[400],
  },
});

export default Checkbox;
