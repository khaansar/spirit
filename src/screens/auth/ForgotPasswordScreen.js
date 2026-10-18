import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { Mail, ArrowLeft, KeyRound, AlertCircle, CheckCircle2 } from 'lucide-react-native';

import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { COLORS } from '../../constants/theme';
import { useTheme } from '../../context/ThemeContext';
import { forgotPassword, resetAuthStatus } from '../../store/slices/authSlice';
import { isValidEmail } from '../../utils/validators';

export function ForgotPasswordScreen({ navigation }) {
  const dispatch = useDispatch();
  const { forgotStatus, error, forgotSuccessMessage } = useSelector((state) => state.auth);
  const { theme, isDark } = useTheme();
  const styles = useMemo(() => getStyles(theme, isDark), [theme, isDark]);

  const [email, setEmail] = useState('');
  const [fieldError, setFieldError] = useState(null);

  useEffect(() => {
    dispatch(resetAuthStatus());
  }, [dispatch]);

  const handleSubmit = () => {
    if (!email.trim()) {
      setFieldError('Email address is required');
      return;
    }
    if (!isValidEmail(email.trim())) {
      setFieldError('Please enter a valid email address');
      return;
    }

    setFieldError(null);
    dispatch(forgotPassword({ email: email.trim() }));
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={theme.colors.bg} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        enabled={Platform.OS === 'ios'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* Back Navigation Button */}
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <ArrowLeft size={20} color={theme.colors.textSecondary} />
            <Text style={styles.backButtonText}>Back to Login</Text>
          </TouchableOpacity>

          {/* Main Card */}
          <View style={styles.card}>
            <View style={styles.iconCircle}>
              <KeyRound size={28} color={COLORS.brand[400]} />
            </View>

            <Text style={styles.title}>Forgot Password?</Text>
            <Text style={styles.subtitle}>
              No worries! Enter your registered email address and we'll send you instructions to reset your password.
            </Text>

            {/* Success State */}
            {forgotSuccessMessage ? (
              <View style={styles.successBox}>
                <CheckCircle2 size={32} color={COLORS.status.success} style={{ marginBottom: 10 }} />
                <Text style={styles.successTitle}>Check Your Inbox</Text>
                <Text style={styles.successMessage}>{forgotSuccessMessage}</Text>
                <Button
                  title="Return to Login"
                  onPress={() => navigation.navigate('Login')}
                  style={styles.returnButton}
                />
              </View>
            ) : (
              <>
                {/* Error Banner */}
                {error && (
                  <View style={styles.errorBanner}>
                    <AlertCircle size={18} color={COLORS.status.error} style={{ marginRight: 8 }} />
                    <Text style={styles.errorText}>{error}</Text>
                  </View>
                )}

                <View style={styles.form}>
                  <Input
                    label="Email Address"
                    placeholder="Enter your registered email"
                    value={email}
                    onChangeText={(text) => {
                      setEmail(text);
                      if (fieldError) setFieldError(null);
                    }}
                    leftIcon={<Mail size={18} color={COLORS.slate[400]} />}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    error={fieldError}
                  />

                  <Button
                    title={forgotStatus === 'loading' ? 'Sending...' : 'Send Reset Link'}
                    onPress={handleSubmit}
                    loading={forgotStatus === 'loading'}
                    style={styles.submitButton}
                  />
                </View>
              </>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const getStyles = (theme, isDark) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: theme.colors.bg,
    },
    keyboardView: {
      flex: 1,
    },
    scrollContent: {
      flexGrow: 1,
      paddingHorizontal: 20,
      paddingTop: 20,
      paddingBottom: 40,
    },
    backButton: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      marginBottom: 20,
      alignSelf: 'flex-start',
    },
    backButtonText: {
      color: theme.colors.textSecondary,
      fontSize: 14,
      fontWeight: '600',
    },
    card: {
      backgroundColor: theme.colors.card,
      borderRadius: 24,
      padding: 24,
      borderWidth: 1,
      borderColor: theme.colors.border,
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: isDark ? 0.4 : 0.08,
      shadowRadius: 20,
      elevation: 8,
      alignItems: 'center',
    },
    iconCircle: {
      width: 60,
      height: 60,
      borderRadius: 30,
      backgroundColor: isDark ? 'rgba(94, 67, 243, 0.15)' : 'rgba(94, 67, 243, 0.08)',
      borderWidth: 1,
      borderColor: isDark ? 'rgba(94, 67, 243, 0.3)' : 'rgba(94, 67, 243, 0.2)',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 18,
    },
    title: {
      fontSize: 24,
      fontWeight: '800',
      color: theme.colors.text,
      textAlign: 'center',
    },
    subtitle: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      textAlign: 'center',
      marginTop: 8,
      lineHeight: 20,
      marginBottom: 20,
    },
    errorBanner: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: isDark ? 'rgba(239, 68, 68, 0.12)' : 'rgba(239, 68, 68, 0.08)',
      borderWidth: 1,
      borderColor: isDark ? 'rgba(239, 68, 68, 0.3)' : 'rgba(239, 68, 68, 0.2)',
      borderRadius: 12,
      padding: 12,
      marginBottom: 16,
      width: '100%',
    },
    errorText: {
      color: isDark ? '#fca5a5' : '#dc2626',
      fontSize: 13,
      flex: 1,
    },
    form: {
      width: '100%',
    },
    submitButton: {
      marginTop: 8,
    },
    successBox: {
      alignItems: 'center',
      width: '100%',
      paddingVertical: 10,
    },
    successTitle: {
      fontSize: 18,
      fontWeight: '700',
      color: theme.colors.text,
      marginBottom: 6,
    },
    successMessage: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      textAlign: 'center',
      lineHeight: 20,
      marginBottom: 20,
    },
    returnButton: {
      width: '100%',
    },
  });

export default ForgotPasswordScreen;

