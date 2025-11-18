import { View, StyleSheet, TextInput, Pressable, Alert, Image } from 'react-native';
import { useState } from 'react';
import { ThemedText } from '../components/ThemedText';
import { ThemedView } from '../components/ThemedView';
import { Colors, Spacing, BorderRadius } from '../constants/theme';
import { useTheme } from '../hooks/useTheme';
import { useAuth } from '../hooks/useAuth';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface AuthScreenProps {
  onAuthComplete: () => void;
}

export default function AuthScreen({ onAuthComplete }: AuthScreenProps) {
  const [isSignUp, setIsSignUp] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { colors } = useTheme();
  const { signUp, signIn } = useAuth();
  const insets = useSafeAreaInsets();

  const handleAuth = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      if (isSignUp) {
        await signUp(email, password);
      } else {
        await signIn(email, password);
      }
      onAuthComplete();
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Authentication failed');
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
        <Image
          source={require('../assets/images/icon.png')}
          style={styles.logo}
        />
        <ThemedText style={styles.title}>
          {isSignUp ? 'Create Account' : 'Welcome Back'}
        </ThemedText>
        <ThemedText style={[styles.subtitle, { color: colors.textSecondary }]}>
          {isSignUp
            ? 'Sign up to start your learning journey'
            : 'Sign in to continue your progress'}
        </ThemedText>

        <View style={styles.form}>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: colors.backgroundSecondary,
                color: colors.text,
              },
            ]}
            placeholder="Email"
            placeholderTextColor={colors.textSecondary}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            editable={!loading}
          />
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: colors.backgroundSecondary,
                color: colors.text,
              },
            ]}
            placeholder="Password"
            placeholderTextColor={colors.textSecondary}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
            editable={!loading}
          />

          <Pressable
            style={({ pressed }) => [
              styles.button,
              {
                backgroundColor: colors.primary,
                opacity: pressed || loading ? 0.8 : 1,
              },
            ]}
            onPress={handleAuth}
            disabled={loading}
          >
            <ThemedText style={styles.buttonText}>
              {loading ? 'Processing...' : isSignUp ? 'Sign Up' : 'Sign In'}
            </ThemedText>
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.toggleButton,
              { opacity: pressed ? 0.7 : 1 },
            ]}
            onPress={() => setIsSignUp(!isSignUp)}
            disabled={loading}
          >
            <ThemedText style={[styles.toggleText, { color: colors.textSecondary }]}>
              {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
              <ThemedText style={{ color: colors.primary }}>
                {isSignUp ? 'Sign In' : 'Sign Up'}
              </ThemedText>
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
  logo: {
    width: 100,
    height: 100,
    alignSelf: 'center',
    marginBottom: Spacing['2xl'],
    borderRadius: BorderRadius.lg,
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
  form: {
    gap: Spacing.lg,
  },
  input: {
    height: Spacing.inputHeight,
    borderRadius: BorderRadius.sm,
    paddingHorizontal: Spacing.lg,
    fontSize: 16,
  },
  button: {
    height: Spacing.buttonHeight,
    borderRadius: BorderRadius.sm,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Spacing.sm,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  toggleButton: {
    paddingVertical: Spacing.md,
  },
  toggleText: {
    fontSize: 14,
    textAlign: 'center',
  },
});
