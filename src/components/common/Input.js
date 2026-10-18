import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { COLORS } from '../../constants/theme';

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

  return (
    <View style={[styles.container, style]}>
      {label && <Text style={styles.label}>{label}</Text>}

      <View
        style={[
          styles.inputWrapper,
          isFocused && styles.inputWrapperFocused,
          error && styles.inputWrapperError,
          disabled && styles.inputWrapperDisabled,
        ]}
      >
        {leftIcon && <View style={styles.leftIconContainer}>{leftIcon}</View>}

        <TextInput
          {...rest}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={COLORS.slate[500]}
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
          style={[styles.input, inputStyle]}
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
    color: COLORS.slate[300],
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.slate[900],
    borderWidth: 1.5,
    borderColor: COLORS.slate[800],
    borderRadius: 14,
    height: 52,
    paddingHorizontal: 14,
  },
  inputWrapperFocused: {
    borderColor: COLORS.brand[500],
    backgroundColor: COLORS.slate[900],
  },
  inputWrapperError: {
    borderColor: COLORS.status.error,
  },
  inputWrapperDisabled: {
    opacity: 0.6,
    backgroundColor: COLORS.slate[950],
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
    color: COLORS.common.white,
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
