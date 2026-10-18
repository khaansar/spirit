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
import { User, Mail, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react-native';

import BrandLogo from '../../components/common/BrandLogo';
import Input from '../../components/common/Input';
import PasswordInput from '../../components/common/PasswordInput';
import Button from '../../components/common/Button';
import Checkbox from '../../components/common/Checkbox';

import { COLORS } from '../../constants/theme';
import { useTheme } from '../../context/ThemeContext';
import { registerUser, clearAuthError, resetAuthStatus } from '../../store/slices/authSlice';
import { isValidEmail, validatePassword } from '../../utils/validators';

export function SignupScreen({ navigation }) {
  const dispatch = useDispatch();
  const { registerStatus, error, registerSuccessMessage } = useSelector((state) => state.auth);
  const { theme, isDark } = useTheme();
  const styles = useMemo(() => getStyles(theme, isDark), [theme, isDark]);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    dispatch(resetAuthStatus());
  }, [dispatch]);

  const validate = () => {
    const errors = {};
    if (!name.trim()) {
      errors.name = 'Full name is required';
    }

    if (!email.trim()) {
      errors.email = 'Email address is required';
    } else if (!isValidEmail(email)) {
      errors.email = 'Please enter a valid email address';
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
      errors.password = passwordError;
    }

    if (password !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    if (!agreeTerms) {
      errors.terms = 'Please accept the Terms & Conditions';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleRegister = () => {
    if (!validate()) return;

    dispatch(
      registerUser({
        name: name.trim(),
        email: email.trim(),
        password,
      })
    );
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
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <BrandLogo size="md" showTagline layout="stacked" />
          </View>

          {/* Registration Card */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.title}>Create Account</Text>
              <Text style={styles.subtitle}>Start your exam preparation journey today.</Text>
            </View>

            {/* Success Banner */}
            {registerSuccessMessage ? (
              <View style={styles.successContainer}>
                <CheckCircle2 size={40} color={COLORS.status.success} />
                <Text style={styles.successTitle}>Registration Successful!</Text>
                <Text style={styles.successText}>{registerSuccessMessage}</Text>
                <Button
                  title="Proceed to Login"
                  onPress={() => navigation.navigate('Login')}
                  style={styles.proceedButton}
                />
              </View>
            ) : (
              <>
                {/* Error Banner */}
                {error && (
                  <View style={styles.errorBanner}>
                    <AlertCircle size={18} color={COLORS.status.error} style={styles.errorIcon} />
                    <Text style={styles.errorBannerText}>{error}</Text>
                  </View>
                )}

                {/* Form Fields */}
                <View style={styles.form}>
                  <Input
                    label="Full Name"
                    placeholder="e.g. John Doe"
                    value={name}
                    onChangeText={(text) => {
                      setName(text);
                      if (fieldErrors.name) setFieldErrors({ ...fieldErrors, name: null });
                    }}
                    leftIcon={<User size={18} color={COLORS.slate[400]} />}
                    error={fieldErrors.name}
                  />

                  <Input
                    label="Email Address"
                    placeholder="Enter your email"
                    value={email}
                    onChangeText={(text) => {
                      setEmail(text);
                      if (fieldErrors.email) setFieldErrors({ ...fieldErrors, email: null });
                    }}
                    leftIcon={<Mail size={18} color={COLORS.slate[400]} />}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    error={fieldErrors.email}
                  />

                  <PasswordInput
                    label="Password"
                    placeholder="Create a strong password"
                    value={password}
                    onChangeText={(text) => {
                      setPassword(text);
                      if (fieldErrors.password) setFieldErrors({ ...fieldErrors, password: null });
                    }}
                    error={fieldErrors.password}
                  />

                  <PasswordInput
                    label="Confirm Password"
                    placeholder="Repeat password"
                    value={confirmPassword}
                    onChangeText={(text) => {
                      setConfirmPassword(text);
                      if (fieldErrors.confirmPassword)
                        setFieldErrors({ ...fieldErrors, confirmPassword: null });
                    }}
                    error={fieldErrors.confirmPassword}
                  />

                  {/* Terms Checkbox */}
                  <View style={styles.termsRow}>
                    <Checkbox
                      label="I agree to the Terms of Service & Privacy Policy"
                      checked={agreeTerms}
                      onChange={setAgreeTerms}
                    />
                  </View>
                  {fieldErrors.terms && (
                    <Text style={styles.termsError}>{fieldErrors.terms}</Text>
                  )}

                  {/* Register Button */}
                  <Button
                    title={registerStatus === 'loading' ? 'Creating Account...' : 'Create Account'}
                    onPress={handleRegister}
                    loading={registerStatus === 'loading'}
                    rightIcon={<ArrowRight size={18} color={COLORS.common.white} />}
                    style={styles.signupButton}
                  />
                </View>

                {/* Footer Link to Login */}
                <View style={styles.footerContainer}>
                  <Text style={styles.footerText}>
                    Already have an account?{' '}
                  </Text>
                  <TouchableOpacity
                    onPress={() => navigation.navigate('Login')}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  >
                    <Text style={styles.footerHighlight}>Log In &rarr;</Text>
                  </TouchableOpacity>
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
    header: {
      marginBottom: 20,
      alignItems: 'center',
    },
    card: {
      backgroundColor: theme.colors.card,
      borderRadius: 24,
      padding: 24,
      borderWidth: 1,
      borderColor: theme.colors.cardBorder,
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: isDark ? 0.4 : 0.08,
      shadowRadius: 20,
      elevation: 6,
    },
    cardHeader: {
      marginBottom: 20,
    },
    title: {
      fontSize: 26,
      fontWeight: '800',
      color: theme.colors.text,
      letterSpacing: -0.3,
    },
    subtitle: {
      fontSize: 14,
      color: theme.colors.textMuted,
      marginTop: 6,
    },
    errorBanner: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: 'rgba(239, 68, 68, 0.12)',
      borderWidth: 1,
      borderColor: 'rgba(239, 68, 68, 0.3)',
      borderRadius: 12,
      padding: 12,
      marginBottom: 16,
    },
    errorIcon: {
      marginRight: 8,
    },
    errorBannerText: {
      color: '#fca5a5',
      fontSize: 13,
      fontWeight: '500',
      flex: 1,
    },
    form: {
      width: '100%',
    },
    termsRow: {
      marginTop: 6,
      marginBottom: 4,
    },
    termsError: {
      fontSize: 12,
      color: COLORS.status.error,
      marginBottom: 10,
      marginLeft: 4,
    },
    signupButton: {
      marginTop: 18,
    },
    footerContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 22,
    },
    footerText: {
      fontSize: 14,
      color: theme.colors.textMuted,
    },
    footerHighlight: {
      fontSize: 14,
      fontWeight: '700',
      color: COLORS.brand[400],
    },
    successContainer: {
      alignItems: 'center',
      paddingVertical: 20,
    },
    successTitle: {
      fontSize: 20,
      fontWeight: '700',
      color: theme.colors.text,
      marginTop: 16,
      marginBottom: 8,
    },
    successText: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      textAlign: 'center',
      lineHeight: 22,
      marginBottom: 24,
    },
    proceedButton: {
      width: '100%',
    },
  });

export default SignupScreen;
