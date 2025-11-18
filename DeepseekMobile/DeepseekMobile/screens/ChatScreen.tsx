import { View, StyleSheet, TextInput, Pressable, FlatList, Image, Alert, ActivityIndicator } from 'react-native';
import { useState, useRef, useEffect } from 'react';
import { ThemedText } from '../components/ThemedText';
import { ThemedView } from '../components/ThemedView';
import { Colors, Spacing, BorderRadius } from '../constants/theme';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../hooks/useTheme';
import { useAuth } from '../hooks/useAuth';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { supabase } from '../lib/supabase';
import { ChatMessage } from '../lib/types';
import * as WebBrowser from 'expo-web-browser';
import { WebView } from 'react-native-webview';

interface ChatScreenProps {
  onProfilePress: () => void;
  onAdminPress: () => void;
  onLogoPress: () => void;
}

export default function ChatScreen({ onProfilePress, onAdminPress, onLogoPress }: ChatScreenProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const { colors } = useTheme();
  const { user, refreshUser } = useAuth();
  const insets = useSafeAreaInsets();
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    loadChatHistory();
  }, []);

  const loadChatHistory = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('chat_history')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true });

      if (error) throw error;
      if (data) setMessages(data);
    } catch (error) {
      console.error('Error loading chat history:', error);
    } finally {
      setLoadingHistory(false);
    }
  };

  const sendMessage = async () => {
    if (!inputText.trim() || !user) return;

    if (user.tokens_day <= 0) {
      Alert.alert(
        'No Tokens Remaining',
        "You've used all your tokens. Upgrade to continue or wait for your daily refresh.",
        [
          { text: 'OK', style: 'cancel' },
          { text: 'Upgrade', onPress: () => {} },
        ]
      );
      return;
    }

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      user_id: user.id,
      role: 'user',
      text: inputText.trim(),
      created_at: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setLoading(true);

    try {
      await supabase.from('chat_history').insert([userMessage]);

      const { data: webhookData } = await supabase
        .from('webhooks')
        .select('*')
        .eq('name', 'chat_webhook')
        .single();

      const { data: credentials } = await supabase
        .from('credentials')
        .select('*')
        .eq('send_to_chat_webhook', true);

      const { data: parameters } = await supabase
        .from('parameters')
        .select('*');

      const credentialsObj = credentials?.reduce((acc, cred) => {
        acc[cred.name] = cred.value;
        return acc;
      }, {} as Record<string, string>) || {};

      const parametersObj = parameters?.reduce((acc, param) => {
        acc[param.name] = param.value;
        return acc;
      }, {} as Record<string, string>) || {};

      const webhookUrl = webhookData?.url || 'https://n8n-uwso.onrender.com/webhook-test/sauvonstonexam.ai';
      
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(webhookData?.headers || {}),
        },
        body: JSON.stringify({
          message: inputText.trim(),
          user_id: user.id,
          email: user.email,
          tokens_left: user.tokens_day - 1,
          credentials: credentialsObj,
          parameters: parametersObj,
        }),
      });

      const aiResponse = await response.json();

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        user_id: user.id,
        role: 'assistant',
        text: aiResponse.text || 'I apologize, but I encountered an error processing your request.',
        youtube: aiResponse.youtube,
        source_url: aiResponse.sources,
        created_at: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
      await supabase.from('chat_history').insert([assistantMessage]);

      await supabase
        .from('users')
        .update({ tokens_day: user.tokens_day - 1 })
        .eq('id', user.id);

      await refreshUser();
    } catch (error) {
      console.error('Error sending message:', error);
      Alert.alert('Error', 'Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const openSourceUrl = (url: string) => {
    WebBrowser.openBrowserAsync(url);
  };

  const openCanadianSchool = () => {
    WebBrowser.openBrowserAsync('https://ecolecanadienne.ca/');
  };

  const getTokenColor = () => {
    if (!user) return colors.text;
    if (user.tokens_day === 0) return colors.error;
    if (user.tokens_day <= 5) return colors.warning;
    return colors.accent;
  };

  const renderMessage = ({ item }: { item: ChatMessage }) => {
    const isUser = item.role === 'user';

    return (
      <View style={[styles.messageContainer, isUser && styles.userMessageContainer]}>
        {!isUser && item.images && item.images.length > 0 && (
          <View style={styles.imagesContainer}>
            {item.images.map((img, idx) => (
              <Image
                key={idx}
                source={{ uri: img }}
                style={styles.messageImage}
                resizeMode="cover"
              />
            ))}
          </View>
        )}

        <View
          style={[
            styles.messageBubble,
            {
              backgroundColor: isUser ? colors.userBubble : colors.aiBubble,
            },
          ]}
        >
          <ThemedText style={styles.messageText}>{item.text}</ThemedText>

          {!isUser && item.youtube && (
            <View style={styles.youtubeContainer}>
              <WebView
                source={{ uri: item.youtube }}
                style={styles.youtube}
                allowsFullscreenVideo
                javaScriptEnabled
              />
            </View>
          )}
        </View>

        {!isUser && item.source_url && (
          <Pressable
            style={({ pressed }) => [
              styles.sourceButton,
              { opacity: pressed ? 0.7 : 1 },
            ]}
            onPress={() => openSourceUrl(item.source_url!)}
          >
            <Feather name="external-link" size={16} color={colors.accent} />
          </Pressable>
        )}
      </View>
    );
  };

  return (
    <ThemedView style={styles.container}>
      <View
        style={[
          styles.header,
          {
            backgroundColor: colors.backgroundDefault,
            paddingTop: insets.top + Spacing.sm,
          },
        ]}
      >
        <Pressable
          style={({ pressed }) => [
            styles.headerButton,
            { opacity: pressed ? 0.7 : 1 },
          ]}
          onPress={onLogoPress}
        >
          <Image source={require('../assets/images/icon.png')} style={styles.logo} />
        </Pressable>

        <View style={styles.tokenContainer}>
          <Feather name="award" size={20} color={getTokenColor()} />
          <ThemedText style={[styles.tokenText, { color: getTokenColor() }]}>
            {user?.tokens_day || 0}
          </ThemedText>
        </View>

        <View style={styles.headerRight}>
          <Pressable
            style={({ pressed }) => [
              styles.headerButton,
              { opacity: pressed ? 0.7 : 1 },
            ]}
            onPress={openCanadianSchool}
          >
            <Feather name="flag" size={24} color={colors.error} />
          </Pressable>

          {user?.is_admin && (
            <Pressable
              style={({ pressed }) => [
                styles.headerButton,
                { opacity: pressed ? 0.7 : 1 },
              ]}
              onPress={onAdminPress}
            >
              <Feather name="settings" size={24} color={colors.text} />
            </Pressable>
          )}

          <Pressable
            style={({ pressed }) => [
              styles.headerButton,
              { opacity: pressed ? 0.7 : 1 },
            ]}
            onPress={onProfilePress}
          >
            <Feather name="user" size={24} color={colors.text} />
          </Pressable>
        </View>
      </View>

      {loadingHistory ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : messages.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Feather name="message-circle" size={64} color={colors.textSecondary} />
          <ThemedText style={[styles.emptyTitle, { color: colors.text }]}>
            Hi, I'm SauvonsTonExam AI
          </ThemedText>
          <ThemedText style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
            How can I help you today?
          </ThemedText>
        </View>
      ) : (
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          contentContainerStyle={[
            styles.messagesList,
            { paddingBottom: insets.bottom + Spacing.xl },
          ]}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
        />
      )}

      {loading && (
        <View style={styles.typingIndicator}>
          <ActivityIndicator size="small" color={colors.textSecondary} />
          <ThemedText style={[styles.typingText, { color: colors.textSecondary }]}>
            AI is thinking...
          </ThemedText>
        </View>
      )}

      <View
        style={[
          styles.inputContainer,
          {
            backgroundColor: colors.backgroundDefault,
            paddingBottom: insets.bottom + Spacing.sm,
          },
        ]}
      >
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: colors.backgroundSecondary,
              color: colors.text,
            },
          ]}
          placeholder="Message SauvonsTonExam AI"
          placeholderTextColor={colors.textSecondary}
          value={inputText}
          onChangeText={setInputText}
          multiline
          maxLength={500}
          editable={!loading}
        />
        <Pressable
          style={({ pressed }) => [
            styles.sendButton,
            {
              backgroundColor: colors.primary,
              opacity: pressed || loading || !inputText.trim() ? 0.5 : 1,
            },
          ]}
          onPress={sendMessage}
          disabled={loading || !inputText.trim()}
        >
          <Feather name="send" size={20} color={colors.buttonText} />
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
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  headerButton: {
    padding: Spacing.sm,
  },
  logo: {
    width: 32,
    height: 32,
    borderRadius: BorderRadius.xs,
  },
  tokenContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: BorderRadius.xl,
  },
  tokenText: {
    fontSize: 16,
    fontWeight: '600',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing['2xl'],
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginTop: Spacing.xl,
    marginBottom: Spacing.sm,
  },
  emptySubtitle: {
    fontSize: 16,
    textAlign: 'center',
  },
  messagesList: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
  },
  messageContainer: {
    marginBottom: Spacing.lg,
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: Spacing.sm,
  },
  userMessageContainer: {
    flexDirection: 'row-reverse',
  },
  imagesContainer: {
    marginBottom: Spacing.sm,
    gap: Spacing.sm,
  },
  messageImage: {
    width: 200,
    height: 150,
    borderRadius: BorderRadius.xs,
  },
  messageBubble: {
    maxWidth: '75%',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 22,
  },
  youtubeContainer: {
    marginTop: Spacing.md,
    height: 200,
    borderRadius: BorderRadius.xs,
    overflow: 'hidden',
  },
  youtube: {
    flex: 1,
  },
  sourceButton: {
    padding: Spacing.xs,
  },
  typingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
  },
  typingText: {
    fontSize: 14,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  input: {
    flex: 1,
    maxHeight: 100,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    fontSize: 15,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
