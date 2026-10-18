import React, { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';

import AuthNavigator from './AuthNavigator';
import AppNavigator from './AppNavigator';
import BrandLogo from '../components/common/BrandLogo';

import { COLORS } from '../constants/theme';
import { restoreSession } from '../store/slices/authSlice';

export function RootNavigator() {
  const dispatch = useDispatch();
  const { isAuthenticated, isRestoringSession } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(restoreSession());
  }, [dispatch]);

  if (isRestoringSession) {
    return (
      <View style={styles.splashContainer}>
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
    <NavigationContainer>
      {isAuthenticated ? <AppNavigator /> : <AuthNavigator />}
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
