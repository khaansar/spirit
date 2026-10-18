import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import {
  ArrowLeft,
  User,
  ShieldCheck,
  Lock,
  Phone,
  Target,
  CheckCircle2,
  AlertCircle,
  Check,
  ChevronDown,
} from 'lucide-react-native';

import Input from '../../components/common/Input';
import PasswordInput from '../../components/common/PasswordInput';
import Button from '../../components/common/Button';
import { COLORS } from '../../constants/theme';
import { userService } from '../../api/userService';
import { fetchCurrentUser, updateUser } from '../../store/slices/authSlice';
import { validatePassword } from '../../utils/validators';

const POPULAR_EXAMS = [
  'SSC CGL 2025',
  'UPSC CSE',
  'IBPS PO / Clerk',
  'SBI PO',
  'RRB NTPC',
  'JEE Main',
  'NEET UG',
  'State PSC',
  'GATE',
  'CDS / NDA',
];

export function AccountSettingsScreen({ navigation }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  // Profile Form States
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [targetExam, setTargetExam] = useState('');
  const [isExamPickerOpen, setIsExamPickerOpen] = useState(false);
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState('');
  const [profileError, setProfileError] = useState('');

  // Password Form States
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // Synchronize state with current user
  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || user.name?.split(' ')[0] || '');
      setLastName(user.lastName || user.name?.split(' ').slice(1).join(' ') || '');
      setPhone(user.phone || '');
      setTargetExam(user.targetExam || 'SSC CGL 2025');
    }
  }, [user]);

  // Password rules validation
  const hasMinLength = newPassword.length >= 8;
  const hasUppercase = /[A-Z]/.test(newPassword);
  const hasLowercase = /[a-z]/.test(newPassword);
  const hasNumber = /[0-9]/.test(newPassword);
  const passwordsMatch = newPassword && confirmPassword && newPassword === confirmPassword;

  const strengthScore = [hasMinLength, hasUppercase, hasLowercase, hasNumber].filter(Boolean).length;
  const strengthLabels = ['Too Weak', 'Weak', 'Fair', 'Good', 'Strong'];
  const strengthColors = [
    COLORS.slate[700],
    COLORS.status.error,
    '#f59e0b',
    '#3b82f6',
    COLORS.status.success,
  ];

  const handleProfileSubmit = async () => {
    setProfileError('');
    setProfileSuccess('');

    if (!firstName.trim()) {
      setProfileError('First name is required.');
      return;
    }

    setProfileSaving(true);
    try {
      const updated = await userService.updateProfile({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        phone: phone.trim(),
        targetExam: targetExam.trim(),
      });

      if (updated) {
        dispatch(updateUser(updated));
      }
      await dispatch(fetchCurrentUser());
      setProfileSuccess('Profile changes saved successfully!');
      Alert.alert('Profile Updated', 'Your personal details have been saved successfully.');
    } catch (err) {
      const isAuthError = err?.status === 401 || err?.message?.toLowerCase().includes('authentication') || err?.message?.toLowerCase().includes('token');
      const msg = isAuthError
        ? 'Session expired or authentication required. Please sign in again.'
        : err?.message || 'Failed to save profile changes. Please try again.';
      setProfileError(msg);
      Alert.alert('Update Failed', msg);
    } finally {
      setProfileSaving(false);
    }
  };

  const handlePasswordSubmit = async () => {
    setPasswordError('');
    setPasswordSuccess('');

    if (!currentPassword) {
      setPasswordError('Please enter your current password.');
      return;
    }

    const validationMsg = validatePassword(newPassword);
    if (validationMsg) {
      setPasswordError(validationMsg);
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match.');
      return;
    }

    if (currentPassword === newPassword) {
      setPasswordError('New password must be different from current password.');
      return;
    }

    setPasswordSaving(true);
    try {
      await userService.changePassword({
        currentPassword,
        newPassword,
      });

      setPasswordSuccess('Password updated successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      Alert.alert('Security', 'Your password has been changed successfully.');
    } catch (err) {
      const isAuthError = err?.status === 401 || err?.message?.toLowerCase().includes('authentication') || err?.message?.toLowerCase().includes('token');
      const msg = isAuthError
        ? 'Session expired or authentication required. Please sign in again.'
        : err?.message || 'Failed to update password. Please check your current password.';
      setPasswordError(msg);
      Alert.alert('Error', msg);
    } finally {
      setPasswordSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.slate[950]} />

      {/* Top Header */}
      <View style={styles.topBar}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <ArrowLeft size={20} color={COLORS.slate[200]} />
        </TouchableOpacity>
        <Text style={styles.topBarTitle}>Account Settings</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Profile Card Header */}
        <View style={styles.userBanner}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarInitials}>
              {(firstName.charAt(0) || user?.email?.charAt(0) || 'S').toUpperCase()}
            </Text>
          </View>
          <View style={styles.userBannerInfo}>
            <Text style={styles.userBannerName}>
              {[firstName, lastName].filter(Boolean).join(' ') || 'Student'}
            </Text>
            <Text style={styles.userBannerEmail}>{user?.email || 'student@clearit.com'}</Text>
            <View style={styles.targetBadge}>
              <Target size={12} color={COLORS.brand[400]} />
              <Text style={styles.targetBadgeText}>{targetExam || 'SSC CGL 2025'}</Text>
            </View>
          </View>
        </View>

        {/* SECTION 1: Personal Details */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <User size={18} color={COLORS.brand[400]} />
            <Text style={styles.sectionTitle}>Personal Details</Text>
          </View>

          {profileSuccess ? (
            <View style={styles.successBox}>
              <CheckCircle2 size={16} color={COLORS.status.success} />
              <Text style={styles.successText}>{profileSuccess}</Text>
            </View>
          ) : null}

          {profileError ? (
            <View style={styles.errorBox}>
              <AlertCircle size={16} color={COLORS.status.error} />
              <Text style={styles.errorText}>{profileError}</Text>
            </View>
          ) : null}

          <Input
            label="First Name"
            value={firstName}
            onChangeText={setFirstName}
            placeholder="e.g. Rahul"
            leftIcon={<User size={18} color={COLORS.slate[500]} />}
          />

          <Input
            label="Last Name"
            value={lastName}
            onChangeText={setLastName}
            placeholder="e.g. Verma"
            leftIcon={<User size={18} color={COLORS.slate[500]} />}
          />

          <Input
            label="Phone Number"
            value={phone}
            onChangeText={setPhone}
            placeholder="e.g. +91 9876543210"
            keyboardType="phone-pad"
            leftIcon={<Phone size={18} color={COLORS.slate[500]} />}
          />

          {/* Target Exam Dropdown */}
          <Text style={styles.inputLabel}>Target Examination</Text>
          <TouchableOpacity
            style={styles.dropdownTrigger}
            onPress={() => setIsExamPickerOpen(!isExamPickerOpen)}
            activeOpacity={0.8}
          >
            <View style={styles.dropdownLeft}>
              <Target size={18} color={COLORS.slate[400]} />
              <Text style={styles.dropdownValue}>{targetExam || 'Select target exam'}</Text>
            </View>
            <ChevronDown size={18} color={COLORS.slate[400]} />
          </TouchableOpacity>

          {isExamPickerOpen && (
            <View style={styles.dropdownMenu}>
              {POPULAR_EXAMS.map((exam) => {
                const isSelected = targetExam === exam;
                return (
                  <TouchableOpacity
                    key={exam}
                    style={[styles.dropdownItem, isSelected && styles.dropdownItemSelected]}
                    onPress={() => {
                      setTargetExam(exam);
                      setIsExamPickerOpen(false);
                    }}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.dropdownItemText,
                        isSelected && styles.dropdownItemTextSelected,
                      ]}
                    >
                      {exam}
                    </Text>
                    {isSelected && <Check size={16} color={COLORS.brand[400]} />}
                  </TouchableOpacity>
                );
              })}
            </View>
          )}

          <Button
            title="Save Profile Changes"
            onPress={handleProfileSubmit}
            loading={profileSaving}
            style={styles.saveBtn}
          />
        </View>

        {/* SECTION 2: Change Password & Security */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <ShieldCheck size={18} color="#f59e0b" />
            <Text style={styles.sectionTitle}>Password & Security</Text>
          </View>

          {passwordSuccess ? (
            <View style={styles.successBox}>
              <CheckCircle2 size={16} color={COLORS.status.success} />
              <Text style={styles.successText}>{passwordSuccess}</Text>
            </View>
          ) : null}

          {passwordError ? (
            <View style={styles.errorBox}>
              <AlertCircle size={16} color={COLORS.status.error} />
              <Text style={styles.errorText}>{passwordError}</Text>
            </View>
          ) : null}

          <PasswordInput
            label="Current Password"
            value={currentPassword}
            onChangeText={setCurrentPassword}
            placeholder="Enter existing password"
          />

          <PasswordInput
            label="New Password"
            value={newPassword}
            onChangeText={setNewPassword}
            placeholder="At least 8 characters"
          />

          {/* Password Strength Meter */}
          {newPassword.length > 0 && (
            <View style={styles.strengthContainer}>
              <View style={styles.strengthBarsRow}>
                {[1, 2, 3, 4].map((step) => (
                  <View
                    key={step}
                    style={[
                      styles.strengthBar,
                      {
                        backgroundColor:
                          step <= strengthScore
                            ? strengthColors[strengthScore]
                            : COLORS.slate[800],
                      },
                    ]}
                  />
                ))}
              </View>
              <Text style={[styles.strengthLabel, { color: strengthColors[strengthScore] }]}>
                Strength: {strengthLabels[strengthScore]}
              </Text>
            </View>
          )}

          <PasswordInput
            label="Confirm New Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder="Re-enter new password"
          />

          {/* Validation Checklist */}
          <View style={styles.checklist}>
            <View style={styles.checkItem}>
              <Check size={12} color={hasMinLength ? COLORS.status.success : COLORS.slate[600]} />
              <Text
                style={[
                  styles.checkText,
                  hasMinLength && styles.checkTextActive,
                ]}
              >
                Minimum 8 characters
              </Text>
            </View>
            <View style={styles.checkItem}>
              <Check size={12} color={hasUppercase ? COLORS.status.success : COLORS.slate[600]} />
              <Text
                style={[
                  styles.checkText,
                  hasUppercase && styles.checkTextActive,
                ]}
              >
                At least one uppercase letter (A-Z)
              </Text>
            </View>
            <View style={styles.checkItem}>
              <Check size={12} color={hasNumber ? COLORS.status.success : COLORS.slate[600]} />
              <Text
                style={[
                  styles.checkText,
                  hasNumber && styles.checkTextActive,
                ]}
              >
                At least one digit (0-9)
              </Text>
            </View>
          </View>

          <Button
            title="Update Password"
            onPress={handlePasswordSubmit}
            loading={passwordSaving}
            variant="outline"
            style={styles.saveBtn}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.slate[950],
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.slate[800],
    backgroundColor: COLORS.slate[950],
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.slate[900],
    alignItems: 'center',
    justifyContent: 'center',
  },
  topBarTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.common.white,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  userBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.slate[900],
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.slate[800],
    marginBottom: 16,
    gap: 16,
  },
  avatarCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(94, 67, 243, 0.2)',
    borderWidth: 2,
    borderColor: COLORS.brand[400],
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitials: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.brand[400],
  },
  userBannerInfo: {
    flex: 1,
  },
  userBannerName: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.common.white,
  },
  userBannerEmail: {
    fontSize: 13,
    color: COLORS.slate[400],
    marginTop: 2,
  },
  targetBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(94, 67, 243, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginTop: 6,
  },
  targetBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.brand[400],
  },
  sectionCard: {
    backgroundColor: COLORS.slate[900],
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: COLORS.slate[800],
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.slate[800],
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.common.white,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.slate[300],
    marginBottom: 6,
    marginTop: 8,
  },
  dropdownTrigger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.slate[950],
    borderWidth: 1,
    borderColor: COLORS.slate[700],
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  dropdownLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  dropdownValue: {
    fontSize: 14,
    color: COLORS.common.white,
    fontWeight: '500',
  },
  dropdownMenu: {
    backgroundColor: COLORS.slate[950],
    borderWidth: 1,
    borderColor: COLORS.slate[700],
    borderRadius: 10,
    marginTop: 6,
    overflow: 'hidden',
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.slate[800],
  },
  dropdownItemSelected: {
    backgroundColor: 'rgba(94, 67, 243, 0.1)',
  },
  dropdownItemText: {
    fontSize: 13,
    color: COLORS.slate[300],
  },
  dropdownItemTextSelected: {
    color: COLORS.brand[400],
    fontWeight: '600',
  },
  saveBtn: {
    marginTop: 16,
  },
  successBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
    borderRadius: 8,
    padding: 10,
    marginBottom: 14,
  },
  successText: {
    fontSize: 13,
    color: COLORS.status.success,
    fontWeight: '500',
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
    borderRadius: 8,
    padding: 10,
    marginBottom: 14,
  },
  errorText: {
    fontSize: 13,
    color: COLORS.status.error,
    fontWeight: '500',
  },
  strengthContainer: {
    marginTop: -4,
    marginBottom: 12,
  },
  strengthBarsRow: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 4,
  },
  strengthBar: {
    flex: 1,
    height: 4,
    borderRadius: 2,
  },
  strengthLabel: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 4,
    textAlign: 'right',
  },
  checklist: {
    backgroundColor: COLORS.slate[950],
    borderRadius: 8,
    padding: 10,
    gap: 6,
    marginTop: 4,
  },
  checkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  checkText: {
    fontSize: 12,
    color: COLORS.slate[500],
  },
  checkTextActive: {
    color: COLORS.slate[300],
  },
});

export default AccountSettingsScreen;
