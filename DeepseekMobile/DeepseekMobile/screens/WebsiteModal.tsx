import { View, StyleSheet, Pressable } from 'react-native';
import { ThemedView } from '../components/ThemedView';
import { Spacing } from '../constants/theme';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../hooks/useTheme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';

interface WebsiteModalProps {
  onClose: () => void;
  url: string;
}

export default function WebsiteModal({ onClose, url }: WebsiteModalProps) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <ThemedView style={styles.container}>
      <Pressable
        style={({ pressed }) => [
          styles.closeButton,
          {
            top: insets.top + Spacing.sm,
            backgroundColor: colors.backgroundSecondary,
            opacity: pressed ? 0.7 : 1,
          },
        ]}
        onPress={onClose}
      >
        <Feather name="x" size={24} color={colors.text} />
      </Pressable>

      <WebView
        source={{ uri: url }}
        style={styles.webview}
        startInLoadingState
        javaScriptEnabled
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  closeButton: {
    position: 'absolute',
    right: Spacing.lg,
    zIndex: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  webview: {
    flex: 1,
  },
});
