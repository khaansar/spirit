import React from 'react';
import { StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Home, Layers, BookOpen, User } from 'lucide-react-native';

import HomeScreen from '../screens/home/HomeScreen';
import CategoriesScreen from '../screens/catalog/CategoriesScreen';
import SeriesListScreen from '../screens/catalog/SeriesListScreen';
import SeriesDetailScreen from '../screens/catalog/SeriesDetailScreen';
import TestInstructionsScreen from '../screens/tests/TestInstructionsScreen';
import TestAttemptScreen from '../screens/attempt/TestAttemptScreen';
import TestResultScreen from '../screens/attempt/TestResultScreen';
import SolutionsReviewScreen from '../screens/attempt/SolutionsReviewScreen';
import LeaderboardScreen from '../screens/leaderboard/LeaderboardScreen';
import AttemptHistoryScreen from '../screens/history/AttemptHistoryScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';

import { COLORS } from '../constants/theme';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: COLORS.brand[400],
        tabBarInactiveTintColor: COLORS.slate[500],
        tabBarLabelStyle: styles.tabBarLabel,
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size }) => <Home size={size || 22} color={color} />,
        }}
      />
      <Tab.Screen
        name="CategoriesTab"
        component={CategoriesScreen}
        options={{
          tabBarLabel: 'Categories',
          tabBarIcon: ({ color, size }) => <Layers size={size || 22} color={color} />,
        }}
      />
      <Tab.Screen
        name="SeriesTab"
        component={SeriesListScreen}
        options={{
          tabBarLabel: 'Series',
          tabBarIcon: ({ color, size }) => <BookOpen size={size || 22} color={color} />,
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color, size }) => <User size={size || 22} color={color} />,
        }}
      />
    </Tab.Navigator>
  );
}

export function AppNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="MainTabs"
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="MainTabs" component={MainTabNavigator} />
      <Stack.Screen name="SeriesList" component={SeriesListScreen} />
      <Stack.Screen name="SeriesDetail" component={SeriesDetailScreen} />
      <Stack.Screen name="TestInstructions" component={TestInstructionsScreen} />
      <Stack.Screen
        name="TestAttempt"
        component={TestAttemptScreen}
        options={{ gestureEnabled: false }}
      />
      <Stack.Screen
        name="TestResult"
        component={TestResultScreen}
        options={{ gestureEnabled: false }}
      />
      <Stack.Screen name="SolutionsReview" component={SolutionsReviewScreen} />
      <Stack.Screen name="Leaderboard" component={LeaderboardScreen} />
      <Stack.Screen name="AttemptHistory" component={AttemptHistoryScreen} />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: COLORS.slate[900],
    borderTopWidth: 1,
    borderTopColor: COLORS.slate[800],
    height: 64,
    paddingBottom: 8,
    paddingTop: 8,
  },
  tabBarLabel: {
    fontSize: 11,
    fontWeight: '600',
  },
});

export default AppNavigator;
