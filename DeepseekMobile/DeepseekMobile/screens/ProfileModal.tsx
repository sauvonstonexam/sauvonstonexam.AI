import { View, StyleSheet, Pressable, Alert } from 'react-native';
import { ThemedText } from '../components/ThemedText';
import { ThemedView } from '../components/ThemedView';
import { Colors, Spacing, BorderRadius } from '../constants/theme';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../hooks/useTheme';
import { useAuth } from '../hooks/useAuth';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface ProfileModalProps {
  onClose: () => void;
  onLogout: () => void;
}

export default function ProfileModal({ onClose, onLogout }: ProfileModalProps) {
  const { colors } = useTheme();
  const { user, signOut } = useAuth();
  const insets = useSafeAreaInsets();

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await signOut();
            onLogout();
          },
        },
      ]
    );
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
      <View style={styles.header}>
        <ThemedText style={styles.title}>Profile</ThemedText>
        <Pressable
          style={({ pressed }) => [
            styles.closeButton,
            { opacity: pressed ? 0.7 : 1 },
          ]}
          onPress={onClose}
        >
          <Feather name="x" size={24} color={colors.text} />
        </Pressable>
      </View>

      <View style={styles.content}>
        <View style={[styles.avatarContainer, { backgroundColor: colors.primary }]}>
          <Feather name="user" size={48} color={colors.buttonText} />
        </View>

        <View style={styles.infoSection}>
          <View style={styles.infoRow}>
            <ThemedText style={[styles.label, { color: colors.textSecondary }]}>
              Name
            </ThemedText>
            <ThemedText style={styles.value}>{user?.full_name || 'Not set'}</ThemedText>
          </View>

          <View style={styles.infoRow}>
            <ThemedText style={[styles.label, { color: colors.textSecondary }]}>
              Email
            </ThemedText>
            <ThemedText style={styles.value}>{user?.email}</ThemedText>
          </View>

          <View style={styles.infoRow}>
            <ThemedText style={[styles.label, { color: colors.textSecondary }]}>
              Class
            </ThemedText>
            <ThemedText style={styles.value}>{user?.class || 'Not set'}</ThemedText>
          </View>

          <View style={styles.infoRow}>
            <ThemedText style={[styles.label, { color: colors.textSecondary }]}>
              Status
            </ThemedText>
            <View
              style={[
                styles.statusBadge,
                {
                  backgroundColor:
                    user?.status === 'paid' ? colors.success : colors.backgroundTertiary,
                },
              ]}
            >
              <ThemedText style={styles.statusText}>
                {user?.status === 'paid' ? 'Premium' : 'Free'}
              </ThemedText>
            </View>
          </View>

          <View style={styles.infoRow}>
            <ThemedText style={[styles.label, { color: colors.textSecondary }]}>
              Tokens (Daily)
            </ThemedText>
            <ThemedText style={styles.value}>{user?.tokens_day || 0}</ThemedText>
          </View>

          <View style={styles.infoRow}>
            <ThemedText style={[styles.label, { color: colors.textSecondary }]}>
              Tokens (Monthly)
            </ThemedText>
            <ThemedText style={styles.value}>{user?.tokens_month || 0}</ThemedText>
          </View>
        </View>

        <Pressable
          style={({ pressed }) => [
            styles.logoutButton,
            {
              backgroundColor: colors.error,
              opacity: pressed ? 0.8 : 1,
            },
          ]}
          onPress={handleLogout}
        >
          <Feather name="log-out" size={20} color={colors.buttonText} />
          <ThemedText style={styles.logoutText}>Logout</ThemedText>
        </Pressable>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.xl,
    marginBottom: Spacing['2xl'],
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
  },
  closeButton: {
    padding: Spacing.sm,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.xl,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: BorderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: Spacing['3xl'],
  },
  infoSection: {
    gap: Spacing.lg,
    marginBottom: Spacing['3xl'],
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.md,
  },
  label: {
    fontSize: 16,
  },
  value: {
    fontSize: 16,
    fontWeight: '600',
  },
  statusBadge: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.xs,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
  },
  logoutButton: {
    flexDirection: 'row',
    height: Spacing.buttonHeight,
    borderRadius: BorderRadius.sm,
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
