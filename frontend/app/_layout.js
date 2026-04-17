import { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useFonts } from 'expo-font';
import {
  ShareTechMono_400Regular,
} from '@expo-google-fonts/share-tech-mono';
import {
  Rajdhani_400Regular,
  Rajdhani_500Medium,
  Rajdhani_600SemiBold,
  Rajdhani_700Bold,
} from '@expo-google-fonts/rajdhani';
import {
  Orbitron_700Bold,
  Orbitron_900ExtraBold,
} from '@expo-google-fonts/orbitron';
import { View, ActivityIndicator } from 'react-native';
import { colors } from '../src/theme/tokens';

import { AuthProvider, useAuth } from '../src/context/AuthContext';
import LoginScreen from '../src/pages/LoginScreen';
import RegisterScreen from '../src/pages/RegisterScreen';

function RootLayoutContent() {
  const { token, loading } = useAuth();
  const [currentScreen, setCurrentScreen] = useState('login'); // 'login' or 'register'
  
  const [fontsLoaded, fontError] = useFonts({
    ShareTechMono_400Regular,
    Rajdhani_400Regular,
    Rajdhani_500Medium,
    Rajdhani_600SemiBold,
    Rajdhani_700Bold,
    Orbitron_700Bold,
    Orbitron_900ExtraBold,
  });
  const [fontLoadTimedOut, setFontLoadTimedOut] = useState(false);

  useEffect(() => {
    if (fontsLoaded || fontError) return;
    const timer = setTimeout(() => setFontLoadTimedOut(true), 6000);
    return () => clearTimeout(timer);
  }, [fontsLoaded, fontError]);

  if (loading || (!fontsLoaded && !fontError && !fontLoadTimedOut)) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.bgDeep, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" color={colors.accent} />
      </View>
    );
  }

  // Auth Gate: If no token, show Login or Register
  if (!token) {
    if (currentScreen === 'register') {
      return <RegisterScreen onSwitchToLogin={() => setCurrentScreen('login')} />;
    }
    return <LoginScreen onSwitchToRegister={() => setCurrentScreen('register')} />;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.bg },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen
        name="post/[id]"
        options={{ animation: 'slide_from_right' }}
      />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AuthProvider>
          <StatusBar style="light" backgroundColor={colors.bgDeep} />
          <RootLayoutContent />
        </AuthProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
