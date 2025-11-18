import { View, StyleSheet, Pressable, Alert } from 'react-native';
import { useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { ThemedText } from '../components/ThemedText';
import { ThemedView } from '../components/ThemedView';
import { Colors, Spacing, BorderRadius } from '../constants/theme';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../hooks/useTheme';
import { useAuth } from '../hooks/useAuth';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface PaywallScreenProps {
  onComplete: () => void;
}

const features = [
  { text: 'AI-powered exam assistance', free: true, paid: true },
  { text: '10 tokens per day', free: true, paid: false },
  { text: 'Unlimited tokens', free: false, paid: true },
  { text: 'Priority response time', free: false, paid: true },
  { text: 'Advanced learning insights', free: false, paid: true },
  { text: '24/7 support', free: false, paid: true },
];

export default function PaywallScreen({ onComplete }: PaywallScreenProps) {
  const [loading, setLoading] = useState(false);
  const { colors } = useTheme();
  const { updateUserProfile } = useAuth();
  const insets = useSafeAreaInsets();

  const handleFreeTrial = async () => {
    try {
      await updateUserProfile({ status: 'free' });
      onComplete();
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to continue');
    }
  };

  const handleUnlockAccess = async () => {
    setLoading(true);
    try {
      Alert.alert(
        'Coming Soon',
        'Payment integration will be available soon. For now, enjoy the free tier!',
        [{ text: 'OK', onPress: handleFreeTrial }]
      );
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Payment failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemedView
      style={[
        styles.container,
        {
          paddingTop: insets.top + Spacing.xl,
          paddingBottom: insets.bottom + Spacing.xl,
        },
      ]}
    >
      <View style={styles.content}>
        <ThemedText style={styles.title}>Choose Your Plan</ThemedText>
        <ThemedText style={[styles.subtitle, { color: colors.textSecondary }]}>
          Start learning with AI assistance today
        </ThemedText>

        <View style={[styles.card, { backgroundColor: colors.backgroundSecondary }]}>
          <View style={styles.priceSection}>
            <ThemedText style={styles.price}>$9.99</ThemedText>
            <ThemedText style={[styles.period, { color: colors.textSecondary }]}>
              /month
            </ThemedText>
          </View>

          <View style={styles.features}>
            {features.map((feature, index) => (
              <View key={index} style={styles.featureRow}>
                <Feather
                  name={feature.paid ? 'check-circle' : 'circle'}
                  size={20}
                  color={feature.paid ? colors.success : colors.textSecondary}
                />
                <ThemedText
                  style={[
                    styles.featureText,
                    !feature.paid && { color: colors.textSecondary },
                  ]}
                >
                  {feature.text}
                </ThemedText>
              </View>
            ))}
          </View>

          <View style={styles.securityBadge}>
            <Feather name="shield" size={16} color={colors.success} />
            <ThemedText style={[styles.securityText, { color: colors.textSecondary }]}>
              Secure payment powered by NotchPay
            </ThemedText>
          </View>
        </View>

        <View style={styles.actions}>
          <Pressable
            style={({ pressed }) => [
              styles.primaryButton,
              {
                backgroundColor: colors.primary,
                opacity: pressed || loading ? 0.8 : 1,
              },
            ]}
            onPress={handleUnlockAccess}
            disabled={loading}
          >
            <ThemedText style={styles.primaryButtonText}>
              Unlock Unlimited Access
            </ThemedText>
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.secondaryButton,
              {
                borderColor: colors.primary,
                opacity: pressed ? 0.7 : 1,
              },
            ]}
            onPress={handleFreeTrial}
          >
            <ThemedText style={[styles.secondaryButtonText, { color: colors.primary }]}>
              Try for Free (10 tokens/day)
            </ThemedText>
          </Pressable>
        </View>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: Spacing['2xl'],
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: Spacing['3xl'],
  },
  card: {
    borderRadius: BorderRadius.lg,
    padding: Spacing['2xl'],
    marginBottom: Spacing['3xl'],
  },
  priceSection: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'center',
    marginBottom: Spacing['2xl'],
  },
  price: {
    fontSize: 48,
    fontWeight: '700',
  },
  period: {
    fontSize: 18,
    marginLeft: Spacing.sm,
  },
  features: {
    gap: Spacing.lg,
    marginBottom: Spacing['2xl'],
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  featureText: {
    fontSize: 16,
    flex: 1,
  },
  securityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    paddingTop: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  securityText: {
    fontSize: 14,
  },
  actions: {
    gap: Spacing.lg,
  },
  primaryButton: {
    height: Spacing.buttonHeight,
    borderRadius: BorderRadius.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    height: Spacing.buttonHeight,
    borderRadius: BorderRadius.sm,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
