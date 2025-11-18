import React, { useState, useEffect } from 'react';
import { StyleSheet, Modal } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

import { ErrorBoundary } from '@/components/ErrorBoundary';
import { AuthProvider, useAuth } from '@/hooks/useAuth';
import OnboardingScreen from '@/screens/OnboardingScreen';
import AuthScreen from '@/screens/AuthScreen';
import ProfileSetupScreen from '@/screens/ProfileSetupScreen';
import PaywallScreen from '@/screens/PaywallScreen';
import ChatScreen from '@/screens/ChatScreen';
import ProfileModal from '@/screens/ProfileModal';
import AdminSettingsScreen from '@/screens/AdminSettingsScreen';
import WebsiteModal from '@/screens/WebsiteModal';
import { supabase } from '@/lib/supabase';

type AppState = 'onboarding' | 'auth' | 'profile_setup' | 'paywall' | 'main';

function AppContent() {
  const [appState, setAppState] = useState<AppState>('onboarding');
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [showWebsiteModal, setShowWebsiteModal] = useState(false);
  const [websiteUrl, setWebsiteUrl] = useState('');
  const { session, user, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (!session) {
        setAppState('auth');
      } else if (user && !user.full_name) {
        setAppState('profile_setup');
      } else if (user) {
        setAppState('main');
      }
    }
  }, [session, user, loading]);

  useEffect(() => {
    loadIframeUrl();
  }, []);

  const loadIframeUrl = async () => {
    try {
      const { data } = await supabase
        .from('parameters')
        .select('value')
        .eq('name', 'iframe_url')
        .single();

      if (data?.value) {
        setWebsiteUrl(data.value);
      } else {
        setWebsiteUrl('https://sauvonstonexam.com');
      }
    } catch (error) {
      setWebsiteUrl('https://sauvonstonexam.com');
    }
  };

  const handleOnboardingComplete = () => {
    setAppState('auth');
  };

  const handleAuthComplete = () => {
    setAppState('profile_setup');
  };

  const handleProfileSetupComplete = () => {
    setAppState('paywall');
  };

  const handlePaywallComplete = () => {
    setAppState('main');
  };

  const handleLogout = () => {
    setShowProfileModal(false);
    setAppState('auth');
  };

  const handleLogoPress = () => {
    setShowWebsiteModal(true);
  };

  if (loading) {
    return null;
  }

  return (
    <>
      {appState === 'onboarding' && (
        <OnboardingScreen onComplete={handleOnboardingComplete} />
      )}
      {appState === 'auth' && (
        <AuthScreen onAuthComplete={handleAuthComplete} />
      )}
      {appState === 'profile_setup' && (
        <ProfileSetupScreen onComplete={handleProfileSetupComplete} />
      )}
      {appState === 'paywall' && (
        <PaywallScreen onComplete={handlePaywallComplete} />
      )}
      {appState === 'main' && (
        <ChatScreen
          onProfilePress={() => setShowProfileModal(true)}
          onAdminPress={() => setShowAdminModal(true)}
          onLogoPress={handleLogoPress}
        />
      )}

      <Modal
        visible={showProfileModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowProfileModal(false)}
      >
        <ProfileModal
          onClose={() => setShowProfileModal(false)}
          onLogout={handleLogout}
        />
      </Modal>

      <Modal
        visible={showAdminModal}
        animationType="slide"
        presentationStyle="fullScreen"
        onRequestClose={() => setShowAdminModal(false)}
      >
        <AdminSettingsScreen onClose={() => setShowAdminModal(false)} />
      </Modal>

      <Modal
        visible={showWebsiteModal}
        animationType="slide"
        presentationStyle="fullScreen"
        onRequestClose={() => setShowWebsiteModal(false)}
      >
        <WebsiteModal
          url={websiteUrl}
          onClose={() => setShowWebsiteModal(false)}
        />
      </Modal>
    </>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <SafeAreaProvider>
        <GestureHandlerRootView style={styles.root}>
          <KeyboardProvider>
            <AuthProvider>
              <AppContent />
            </AuthProvider>
            <StatusBar style="light" />
          </KeyboardProvider>
        </GestureHandlerRootView>
      </SafeAreaProvider>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
