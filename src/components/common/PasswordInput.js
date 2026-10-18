import React, { useState } from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Eye, EyeOff, Lock } from 'lucide-react-native';
import Input from './Input';
import { COLORS } from '../../constants/theme';

export function PasswordInput({
  label = 'Password',
  placeholder = 'Enter your password',
  value,
  onChangeText,
  error,
  disabled = false,
  ...rest
}) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Input
      label={label}
      placeholder={placeholder}
      value={value}
      onChangeText={onChangeText}
      error={error}
      disabled={disabled}
      secureTextEntry={!showPassword}
      leftIcon={<Lock size={18} color={COLORS.slate[400]} />}
      rightIcon={
        <TouchableOpacity
          onPress={() => setShowPassword(!showPassword)}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          {showPassword ? (
            <EyeOff size={18} color={COLORS.slate[400]} />
          ) : (
            <Eye size={18} color={COLORS.slate[400]} />
          )}
        </TouchableOpacity>
      }
      {...rest}
    />
  );
}

export default PasswordInput;
