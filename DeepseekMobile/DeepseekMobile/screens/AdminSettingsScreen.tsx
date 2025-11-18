import { View, StyleSheet, TextInput, Pressable, Alert, Switch } from 'react-native';
import { useState, useEffect } from 'react';
import { ThemedText } from '../components/ThemedText';
import { ScreenScrollView } from '../components/ScreenScrollView';
import { Colors, Spacing, BorderRadius } from '../constants/theme';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../hooks/useTheme';
import { supabase } from '../lib/supabase';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface AdminSettingsScreenProps {
  onClose: () => void;
}

export default function AdminSettingsScreen({ onClose }: AdminSettingsScreenProps) {
  const [webhookUrl, setWebhookUrl] = useState('https://n8n-uwso.onrender.com/webhook-test/sauvonstonexam.ai');
  const [webhookHeaders, setWebhookHeaders] = useState('{}');
  const [webhookBody, setWebhookBody] = useState('{}');
  const [notchpayPublicKey, setNotchpayPublicKey] = useState('');
  const [notchpayPrivateKey, setNotchpayPrivateKey] = useState('');
  const [testMode, setTestMode] = useState(true);
  const [callbackUrl, setCallbackUrl] = useState('');
  const [webhookSecret, setWebhookSecret] = useState('');
  const [iframeUrl, setIframeUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const { data: webhookData } = await supabase
        .from('webhooks')
        .select('*')
        .eq('name', 'chat_webhook')
        .single();

      if (webhookData) {
        setWebhookUrl(webhookData.url);
        setWebhookHeaders(JSON.stringify(webhookData.headers || {}, null, 2));
      }

      const { data: parameters } = await supabase
        .from('parameters')
        .select('*');

      parameters?.forEach((param) => {
        if (param.name === 'notchpay_public_key') setNotchpayPublicKey(param.value);
        if (param.name === 'notchpay_private_key') setNotchpayPrivateKey(param.value);
        if (param.name === 'test_mode') setTestMode(param.value === 'true');
        if (param.name === 'callback_url') setCallbackUrl(param.value);
        if (param.name === 'webhook_secret') setWebhookSecret(param.value);
        if (param.name === 'iframe_url') setIframeUrl(param.value);
      });
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const saveSettings = async () => {
    setLoading(true);
    try {
      let headers = {};
      try {
        headers = JSON.parse(webhookHeaders);
      } catch (e) {
        Alert.alert('Error', 'Invalid JSON in webhook headers');
        setLoading(false);
        return;
      }

      const { error: webhookError } = await supabase
        .from('webhooks')
        .upsert({
          name: 'chat_webhook',
          url: webhookUrl,
          headers,
        });

      if (webhookError) throw webhookError;

      const parametersToUpsert = [
        { name: 'notchpay_public_key', value: notchpayPublicKey, type: 'payment' },
        { name: 'notchpay_private_key', value: notchpayPrivateKey, type: 'payment' },
        { name: 'test_mode', value: testMode.toString(), type: 'payment' },
        { name: 'callback_url', value: callbackUrl, type: 'payment' },
        { name: 'webhook_secret', value: webhookSecret, type: 'payment' },
        { name: 'iframe_url', value: iframeUrl, type: 'iframe_url' },
      ];

      for (const param of parametersToUpsert) {
        const { error } = await supabase
          .from('parameters')
          .upsert(param);
        if (error) throw error;
      }

      Alert.alert('Success', 'Settings saved successfully');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to save settings');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenScrollView>
      <View
        style={[
          styles.header,
          {
            paddingTop: insets.top + Spacing.xl,
          },
        ]}
      >
        <ThemedText style={styles.title}>Admin Settings</ThemedText>
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
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Webhook Settings</ThemedText>
          
          <View style={styles.field}>
            <ThemedText style={styles.label}>Chat Webhook URL</ThemedText>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: colors.backgroundSecondary,
                  color: colors.text,
                },
              ]}
              value={webhookUrl}
              onChangeText={setWebhookUrl}
              placeholder="https://..."
              placeholderTextColor={colors.textSecondary}
              editable={!loading}
            />
          </View>

          <View style={styles.field}>
            <ThemedText style={styles.label}>Headers (JSON)</ThemedText>
            <TextInput
              style={[
                styles.textArea,
                {
                  backgroundColor: colors.backgroundSecondary,
                  color: colors.text,
                },
              ]}
              value={webhookHeaders}
              onChangeText={setWebhookHeaders}
              placeholder='{"Content-Type": "application/json"}'
              placeholderTextColor={colors.textSecondary}
              multiline
              editable={!loading}
            />
          </View>
        </View>

        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Payment Parameters (NotchPay)</ThemedText>
          
          <View style={styles.field}>
            <ThemedText style={styles.label}>Public Key</ThemedText>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: colors.backgroundSecondary,
                  color: colors.text,
                },
              ]}
              value={notchpayPublicKey}
              onChangeText={setNotchpayPublicKey}
              placeholder="pk_..."
              placeholderTextColor={colors.textSecondary}
              editable={!loading}
            />
          </View>

          <View style={styles.field}>
            <ThemedText style={styles.label}>Private Key</ThemedText>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: colors.backgroundSecondary,
                  color: colors.text,
                },
              ]}
              value={notchpayPrivateKey}
              onChangeText={setNotchpayPrivateKey}
              placeholder="sk_..."
              placeholderTextColor={colors.textSecondary}
              secureTextEntry
              editable={!loading}
            />
          </View>

          <View style={styles.field}>
            <View style={styles.switchRow}>
              <ThemedText style={styles.label}>Test Mode</ThemedText>
              <Switch
                value={testMode}
                onValueChange={setTestMode}
                trackColor={{ false: colors.backgroundTertiary, true: colors.primary }}
                disabled={loading}
              />
            </View>
          </View>

          <View style={styles.field}>
            <ThemedText style={styles.label}>Callback URL</ThemedText>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: colors.backgroundSecondary,
                  color: colors.text,
                },
              ]}
              value={callbackUrl}
              onChangeText={setCallbackUrl}
              placeholder="https://..."
              placeholderTextColor={colors.textSecondary}
              editable={!loading}
            />
          </View>

          <View style={styles.field}>
            <ThemedText style={styles.label}>Webhook Secret</ThemedText>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: colors.backgroundSecondary,
                  color: colors.text,
                },
              ]}
              value={webhookSecret}
              onChangeText={setWebhookSecret}
              placeholder="secret_..."
              placeholderTextColor={colors.textSecondary}
              secureTextEntry
              editable={!loading}
            />
          </View>
        </View>

        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>App Configuration</ThemedText>
          
          <View style={styles.field}>
            <ThemedText style={styles.label}>Embedded Website URL</ThemedText>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: colors.backgroundSecondary,
                  color: colors.text,
                },
              ]}
              value={iframeUrl}
              onChangeText={setIframeUrl}
              placeholder="https://..."
              placeholderTextColor={colors.textSecondary}
              editable={!loading}
            />
          </View>
        </View>

        <Pressable
          style={({ pressed }) => [
            styles.saveButton,
            {
              backgroundColor: colors.primary,
              opacity: pressed || loading ? 0.8 : 1,
            },
          ]}
          onPress={saveSettings}
          disabled={loading}
        >
          <Feather name="save" size={20} color={colors.buttonText} />
          <ThemedText style={styles.saveButtonText}>
            {loading ? 'Saving...' : 'Save Settings'}
          </ThemedText>
        </Pressable>
      </View>
    </ScreenScrollView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.xl,
    marginBottom: Spacing.xl,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
  },
  closeButton: {
    padding: Spacing.sm,
  },
  content: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing['3xl'],
  },
  section: {
    marginBottom: Spacing['3xl'],
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: Spacing.lg,
  },
  field: {
    marginBottom: Spacing.lg,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: Spacing.sm,
  },
  input: {
    height: Spacing.inputHeight,
    borderRadius: BorderRadius.sm,
    paddingHorizontal: Spacing.lg,
    fontSize: 16,
  },
  textArea: {
    minHeight: 100,
    borderRadius: BorderRadius.sm,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    fontSize: 14,
    fontFamily: 'monospace',
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  saveButton: {
    flexDirection: 'row',
    height: Spacing.buttonHeight,
    borderRadius: BorderRadius.sm,
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.sm,
    marginTop: Spacing.xl,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
