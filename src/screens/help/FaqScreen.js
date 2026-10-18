import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  FileQuestion,
  Shield,
  CreditCard,
  Sparkles,
  Sun,
  Moon,
} from 'lucide-react-native';

import { COLORS } from '../../constants/theme';
import { useTheme } from '../../context/ThemeContext';

const FAQ_SECTIONS = [
  {
    category: 'Examinations & Test Interface',
    icon: FileQuestion,
    items: [
      {
        q: 'Are mock tests based on the latest 2026 syllabus?',
        a: 'Yes, every mock test and question set is aligned directly with the official latest notification and syllabus pattern, featuring accurate timing, section cutoffs, and negative marking rules.',
      },
      {
        q: 'Can I switch between sections during an exam?',
        a: 'Yes! The exam interface has dynamic section tabs at the top. You can freely switch across sections unless a particular exam enforces strict sectional time limits.',
      },
      {
        q: 'What does "Mark for Review" do?',
        a: 'Marking a question flags it in purple on your question palette, allowing you to quickly revisit it before final submission.',
      },
      {
        q: 'What happens if my connection drops or app closes during a test?',
        a: 'All selected answers are autosaved in real-time to the server. If you accidentally close the app, your timer continues running, and you can resume right where you left off from My Learning or History.',
      },
    ],
  },
  {
    category: 'Evaluation & Analytics',
    icon: Sparkles,
    items: [
      {
        q: 'How are All-India Ranks and Percentiles calculated?',
        a: 'Our analytics engine processes submissions through an asynchronous scoring pipeline via Kafka. Your percentile compares your performance against thousands of active aspirants who took the same test.',
      },
      {
        q: 'Can I view step-by-step solutions after submitting?',
        a: 'Yes! Immediately after submitting, you can access the Solutions Review screen which provides detailed explanations, shortcut formulas, and question-level peer accuracy.',
      },
    ],
  },
  {
    category: 'Orders, Payments & Access',
    icon: CreditCard,
    items: [
      {
        q: 'How do I unlock premium mock tests?',
        a: 'You can purchase a Test Series Pass from the Series tab. Once payment is confirmed, all tests and solutions under that series are unlocked instantly.',
      },
      {
        q: 'Where can I find my payment receipts?',
        a: 'Go to Profile > Orders & Payments to view your complete transaction history, receipt IDs, and validity dates.',
      },
    ],
  },
];

export function FaqScreen({ navigation }) {
  const { theme, isDark, toggleTheme } = useTheme();
  const styles = useMemo(() => getStyles(theme, isDark), [theme, isDark]);

  const [expandedIndices, setExpandedIndices] = useState({ '0-0': true });

  const toggleAccordion = (key) => {
    setExpandedIndices((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={theme.colors.bg} />

      {/* Top Header */}
      <View style={styles.topBar}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <ArrowLeft size={20} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.topBarTitle}>Help & FAQs</Text>
        <TouchableOpacity
          onPress={toggleTheme}
          style={styles.backButton}
          activeOpacity={0.7}
        >
          {isDark ? <Sun size={18} color="#fbbf24" /> : <Moon size={18} color={COLORS.brand[600]} />}
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.heroBanner}>
          <HelpCircle size={28} color={COLORS.brand[400]} />
          <Text style={styles.heroTitle}>Frequently Asked Questions</Text>
          <Text style={styles.heroSubtitle}>
            Find answers regarding mock test timing, scoring, analytics, and passes.
          </Text>
        </View>

        {FAQ_SECTIONS.map((section, secIdx) => {
          const IconComp = section.icon;
          return (
            <View key={secIdx} style={styles.categoryBlock}>
              <View style={styles.categoryHeader}>
                <IconComp size={18} color={COLORS.brand[400]} />
                <Text style={styles.categoryTitle}>{section.category}</Text>
              </View>

              {section.items.map((item, itemIdx) => {
                const key = `${secIdx}-${itemIdx}`;
                const isExpanded = !!expandedIndices[key];

                return (
                  <View key={key} style={styles.faqCard}>
                    <TouchableOpacity
                      style={styles.faqQuestionRow}
                      onPress={() => toggleAccordion(key)}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.faqQuestionText}>{item.q}</Text>
                      {isExpanded ? (
                        <ChevronUp size={18} color={COLORS.brand[400]} />
                      ) : (
                        <ChevronDown size={18} color={COLORS.slate[500]} />
                      )}
                    </TouchableOpacity>

                    {isExpanded && (
                      <View style={styles.faqAnswerContainer}>
                        <Text style={styles.faqAnswerText}>{item.a}</Text>
                      </View>
                    )}
                  </View>
                );
              })}
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

const getStyles = (theme, isDark) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: theme.colors.bg,
    },
    topBar: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
      backgroundColor: theme.colors.bg,
    },
    backButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: theme.colors.card,
      borderWidth: 1,
      borderColor: theme.colors.border,
      alignItems: 'center',
      justifyContent: 'center',
    },
    topBarTitle: {
      fontSize: 17,
      fontWeight: '700',
      color: theme.colors.text,
    },
    scrollContent: {
      padding: 16,
      paddingBottom: 40,
    },
    heroBanner: {
      alignItems: 'center',
      backgroundColor: theme.colors.card,
      borderRadius: 16,
      padding: 24,
      borderWidth: 1,
      borderColor: theme.colors.border,
      marginBottom: 20,
    },
    heroTitle: {
      fontSize: 18,
      fontWeight: '700',
      color: theme.colors.text,
      marginTop: 10,
    },
    heroSubtitle: {
      fontSize: 13,
      color: theme.colors.textSecondary,
      textAlign: 'center',
      marginTop: 6,
      lineHeight: 18,
    },
    categoryBlock: {
      marginBottom: 20,
    },
    categoryHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      marginBottom: 10,
      paddingHorizontal: 4,
    },
    categoryTitle: {
      fontSize: 15,
      fontWeight: '700',
      color: theme.colors.text,
    },
    faqCard: {
      backgroundColor: theme.colors.card,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.colors.border,
      marginBottom: 8,
      overflow: 'hidden',
    },
    faqQuestionRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 16,
      gap: 12,
    },
    faqQuestionText: {
      flex: 1,
      fontSize: 14,
      fontWeight: '600',
      color: theme.colors.text,
      lineHeight: 20,
    },
    faqAnswerContainer: {
      paddingHorizontal: 16,
      paddingBottom: 16,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border,
      paddingTop: 12,
    },
    faqAnswerText: {
      fontSize: 13,
      color: theme.colors.textSecondary,
      lineHeight: 20,
    },
  });

export default FaqScreen;
