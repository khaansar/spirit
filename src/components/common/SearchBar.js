import React from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Search, X } from 'lucide-react-native';
import { COLORS } from '../../constants/theme';

export function SearchBar({
  value,
  onChangeText,
  placeholder = 'Search categories, exams, or test series...',
  onClear,
  style,
}) {
  return (
    <View style={[styles.container, style]}>
      <Search size={18} color={COLORS.slate[400]} style={styles.searchIcon} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={COLORS.slate[500]}
        style={styles.input}
        returnKeyType="search"
        autoCorrect={false}
      />
      {value && value.length > 0 ? (
        <TouchableOpacity
          onPress={onClear || (() => onChangeText(''))}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <X size={16} color={COLORS.slate[400]} />
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.slate[900],
    borderWidth: 1,
    borderColor: COLORS.slate[800],
    borderRadius: 14,
    height: 48,
    paddingHorizontal: 14,
  },
  searchIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: '100%',
    color: COLORS.common.white,
    fontSize: 14,
  },
});

export default SearchBar;
