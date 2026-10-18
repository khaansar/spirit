import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { COLORS } from '../../constants/theme';
import { useTheme } from '../../context/ThemeContext';

export function Input({
  label,
  value,
  onChangeText,
  placeholder,
  leftIcon,
  rightIcon,
  error,
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'none',
  disabled = false,
  style,
  inputStyle,
  ...rest
}) {
  const [isFocused, setIsFocused] = useState(false);
  const { theme, isDark } = useTheme();

  return (
    <View style={[styles.container, style]}>
      {label && <Text style={[styles.label, { color: theme.colors.textSecondary }]}>{label}</Text>}

      <View
        style={[
          styles.inputWrapper,
          {
            backgroundColor: theme.colors.inputBg,
            borderColor: theme.colors.inputBorder,
          },
          isFocused && { borderColor: COLORS.brand[500] },
          error && styles.inputWrapperError,
          disabled && { opacity: 0.6, backgroundColor: theme.colors.cardInner },
        ]}
      >
        {leftIcon && <View style={styles.leftIconContainer}>{leftIcon}</View>}

        <TextInput
          {...rest}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={theme.colors.textMuted}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          editable={!disabled}
          onFocus={(e) => {
            setIsFocused(true);
            if (rest.onFocus) rest.onFocus(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            if (rest.onBlur) rest.onBlur(e);
          }}
          style={[styles.input, { color: theme.colors.text }, inputStyle]}
        />

        {rightIcon && <View style={styles.rightIconContainer}>{rightIcon}</View>}
      </View>

      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    width: '100%',
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderRadius: 14,
    height: 52,
    paddingHorizontal: 14,
  },
  inputWrapperError: {
    borderColor: COLORS.status.error,
  },
  leftIconContainer: {
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rightIconContainer: {
    marginLeft: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    height: '100%',
    fontSize: 15,
  },
  errorText: {
    fontSize: 12,
    color: COLORS.status.error,
    marginTop: 5,
    marginLeft: 4,
  },
});

export default Input;
