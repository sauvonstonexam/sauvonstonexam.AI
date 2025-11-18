import { View, StyleSheet, Image, Pressable, Dimensions } from 'react-native';
import { useState } from 'react';
import { ThemedText } from '../components/ThemedText';
import { ThemedView } from '../components/ThemedView';
import { Colors, Spacing, BorderRadius } from '../constants/theme';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../hooks/useTheme';

const { width, height } = Dimensions.get('window');

const onboardingData = [
  {
    title: 'Empower Yourself With Quick Knowledge',
    description: 'Get instant answers to your exam questions with AI-powered assistance',
    image: require('../assets/images/onboarding-1.jpg'),
  },
  {
    title: 'Elevate Your Reading With Quick Insights',
    description: 'Access comprehensive study materials and explanations',
    image: require('../assets/images/onboarding-2.jpg'),
  },
  {
    title: 'Stay Motivated And Achieve Goals',
    description: 'Track your progress and reach your academic targets',
    image: require('../assets/images/onboarding-3.jpg'),
  },
];

interface OnboardingScreenProps {
  onComplete: () => void;
}

export default function OnboardingScreen({ onComplete }: OnboardingScreenProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const { colors } = useTheme();

  const goToNext = () => {
    if (currentPage < onboardingData.length - 1) {
      setCurrentPage(currentPage + 1);
    } else {
      onComplete();
    }
  };

  const item = onboardingData[currentPage];

  return (
    <ThemedView style={styles.container}>
      <Pressable
        style={({ pressed }) => [
          styles.skipButton,
          { opacity: pressed ? 0.7 : 1 },
        ]}
        onPress={onComplete}
      >
        <ThemedText style={styles.skipText}>Skip</ThemedText>
      </Pressable>

      <View style={styles.page}>
        <Image source={item.image} style={styles.image} />
        <View style={styles.content}>
          <ThemedText style={styles.title}>{item.title}</ThemedText>
          <ThemedText style={[styles.description, { color: colors.textSecondary }]}>
            {item.description}
          </ThemedText>
        </View>
      </View>

      <View style={styles.footer}>
        <View style={styles.pagination}>
          {onboardingData.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                {
                  backgroundColor: index === currentPage ? colors.primary : colors.backgroundTertiary,
                },
              ]}
            />
          ))}
        </View>

        <Pressable
          style={({ pressed }) => [
            styles.button,
            {
              backgroundColor: colors.primary,
              opacity: pressed ? 0.8 : 1,
            },
          ]}
          onPress={goToNext}
        >
          <ThemedText style={styles.buttonText}>
            {currentPage === onboardingData.length - 1 ? 'Get Started' : 'Next'}
          </ThemedText>
          <Feather name="arrow-right" size={20} color={colors.buttonText} />
        </Pressable>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  skipButton: {
    position: 'absolute',
    top: 60,
    right: Spacing.xl,
    zIndex: 10,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
  },
  skipText: {
    fontSize: 16,
  },
  page: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: width * 0.8,
    height: height * 0.45,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing['3xl'],
  },
  content: {
    paddingHorizontal: Spacing['2xl'],
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  footer: {
    paddingHorizontal: Spacing['2xl'],
    paddingBottom: Spacing['4xl'],
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing['2xl'],
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  button: {
    flexDirection: 'row',
    height: Spacing.buttonHeight,
    borderRadius: BorderRadius.sm,
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
