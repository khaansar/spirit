import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Mail, ArrowRight, AlertCircle } from 'lucide-react-native';

import BrandLogo from '../../components/common/BrandLogo';
import Input from '../../components/common/Input';
import PasswordInput from '../../components/common/PasswordInput';
import Button from '../../components/common/Button';
import Checkbox from '../../components/common/Checkbox';

import { COLORS } from '../../constants/theme';
import { loginUser, clearAuthError } from '../../store/slices/authSlice';
import { isValidEmail } from '../../utils/validators';

export function LoginScreen({ navigation }) {
  const dispatch = useDispatch();
  const { loginStatus, error } = useSelector((state) => state.auth);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    dispatch(clearAuthError());
  }, [dispatch]);

  const validate = () => {
    const errors = {};
    if (!email.trim()) {
      errors.email = 'Email or phone number is required';
    } else if (!isValidEmail(email) && email.length < 10) {
      errors.email = 'Please enter a valid email or 10-digit phone';
    }

    if (!password) {
      errors.password = 'Password is required';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleLogin = () => {
    if (!validate()) return;

    dispatch(
      loginUser({
        email: email.trim(),
        password,
        rememberMe,
      })
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Top Brand Header */}
          <View style={styles.header}>
            <BrandLogo size="lg" showTagline layout="stacked" />
          </View>

          {/* Login Card matching Web UI */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.title}>Welcome Back</Text>
              <Text style={styles.subtitle}>Login to continue your preparation.</Text>
            </View>

            {/* Error Banner */}
            {error && (
              <View style={styles.errorBanner}>
                <AlertCircle size={18} color={COLORS.status.error} style={styles.errorIcon} />
                <Text style={styles.errorBannerText}>{error}</Text>
              </View>
            )}

            {/* Input Form */}
            <View style={styles.form}>
              <Input
                label="Email or Phone Number"
                placeholder="Enter your email or phone"
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
                placeholder="Enter your password"
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  if (fieldErrors.password) setFieldErrors({ ...fieldErrors, password: null });
                }}
                error={fieldErrors.password}
              />

              {/* Options Row: Remember Me & Forgot Password */}
              <View style={styles.optionsRow}>
                <Checkbox
                  label="Remember me"
                  checked={rememberMe}
                  onChange={setRememberMe}
                />
                <TouchableOpacity
                  onPress={() => navigation.navigate('ForgotPassword')}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                </TouchableOpacity>
              </View>

              {/* Login Button */}
              <Button
                title={loginStatus === 'loading' ? 'Signing in...' : 'Login'}
                onPress={handleLogin}
                loading={loginStatus === 'loading'}
                rightIcon={<ArrowRight size={18} color={COLORS.common.white} />}
                style={styles.loginButton}
              />
            </View>

            {/* Divider */}
            <View style={styles.dividerContainer}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>NEW ASPIRANT?</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Sign Up Link */}
            <TouchableOpacity
              style={styles.signupButton}
              onPress={() => navigation.navigate('Signup')}
              activeOpacity={0.7}
            >
              <Text style={styles.signupText}>
                Don't have an account?{' '}
                <Text style={styles.signupHighlight}>Sign Up &rarr;</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.slate[950],
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 40,
    justifyContent: 'center',
  },
  header: {
    marginBottom: 24,
    alignItems: 'center',
  },
  card: {
    backgroundColor: COLORS.slate[900],
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: COLORS.slate[800],
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 8,
  },
  cardHeader: {
    marginBottom: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: COLORS.common.white,
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.slate[400],
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
  optionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 2,
    marginBottom: 22,
  },
  forgotPasswordText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.brand[400],
  },
  loginButton: {
    marginTop: 4,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
    gap: 12,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.slate[800],
  },
  dividerText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.slate[500],
    letterSpacing: 1,
  },
  signupButton: {
    alignItems: 'center',
    paddingVertical: 4,
  },
  signupText: {
    fontSize: 14,
    color: COLORS.slate[400],
  },
  signupHighlight: {
    color: COLORS.brand[400],
    fontWeight: '700',
  },
});

export default LoginScreen;
