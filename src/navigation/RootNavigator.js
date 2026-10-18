import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';

import AuthNavigator from './AuthNavigator';
import AppNavigator from './AppNavigator';
import BrandLogo from '../components/common/BrandLogo';

import { COLORS } from '../constants/theme';
import { useTheme } from '../context/ThemeContext';
import { restoreSession } from '../store/slices/authSlice';

export function RootNavigator() {
  const dispatch = useDispatch();
  const { isDark, theme } = useTheme();
  const { isAuthenticated, isRestoringSession } = useSelector((state) => state.auth);
  const [splashDone, setSplashDone] = useState(false);

  useEffect(() => {
    // Safety cap: Splash screen will NEVER hang for more than 1 second
    const timer = setTimeout(() => {
      setSplashDone(true);
    }, 1000);

    dispatch(restoreSession())
      .unwrap()
      .catch(() => {})
      .finally(() => {
        clearTimeout(timer);
        setSplashDone(true);
      });

    return () => clearTimeout(timer);
  }, [dispatch]);

  const navigationTheme = {
    ...(isDark ? DarkTheme : DefaultTheme),
    colors: {
      ...(isDark ? DarkTheme.colors : DefaultTheme.colors),
      background: theme.colors.bg,
      card: theme.colors.card,
      text: theme.colors.text,
      border: theme.colors.border,
      primary: theme.colors.accent,
    },
  };

  // Only show splash if both still restoring AND within the 1s window
  if (isRestoringSession && !splashDone) {
    return (
      <View style={[styles.splashContainer, { backgroundColor: theme.colors.bg }]}>
        <BrandLogo size="lg" showTagline layout="stacked" />
        <ActivityIndicator
          size="large"
          color={COLORS.brand[400]}
          style={styles.spinner}
        />
      </View>
    );
  }

  return (
    <NavigationContainer theme={navigationTheme}>
      <AppNavigator />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    backgroundColor: COLORS.slate[950],
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  spinner: {
    marginTop: 36,
  },
});

export default RootNavigator;
