import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { Mail, ArrowLeft, KeyRound, AlertCircle, CheckCircle2 } from 'lucide-react-native';

import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { COLORS } from '../../constants/theme';
import { forgotPassword, resetAuthStatus } from '../../store/slices/authSlice';
import { isValidEmail } from '../../utils/validators';

export function ForgotPasswordScreen({ navigation }) {
  const dispatch = useDispatch();
  const { forgotStatus, error, forgotSuccessMessage } = useSelector((state) => state.auth);

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
            <ArrowLeft size={20} color={COLORS.slate[300]} />
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
    color: COLORS.slate[300],
    fontSize: 14,
    fontWeight: '600',
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
    alignItems: 'center',
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(94, 67, 243, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(94, 67, 243, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 18,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.common.white,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.slate[400],
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 20,
    marginBottom: 20,
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
    width: '100%',
  },
  errorText: {
    color: '#fca5a5',
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
    color: COLORS.common.white,
    marginBottom: 6,
  },
  successMessage: {
    fontSize: 14,
    color: COLORS.slate[300],
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  returnButton: {
    width: '100%',
  },
});

export default ForgotPasswordScreen;
