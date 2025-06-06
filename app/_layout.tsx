import { useEffect } from 'react';
import { Stack, useNavigation } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Platform, View, useColorScheme, ColorSchemeName } from 'react-native';
import { useFrameworkReady } from '../hooks/useFrameworkReady';
import { AuthProvider } from '../providers/AuthProvider';
import { AccessibilityProvider, useAccessibility, getHighContrastColors } from '../lib/accessibilityContext';
import { NativeStackNavigationOptions } from '@react-navigation/native-stack';

export default function RootLayout() {
  useFrameworkReady();
  const navigation = useNavigation();
  const colorScheme = useColorScheme();

  useEffect(() => {
    // Reset scroll position when screen changes
    const unsubscribe = navigation.addListener('focus', () => {
      if (Platform.OS === 'web' && typeof window !== 'undefined') {
        window.scrollTo(0, 0);
      }
    });
    
    return unsubscribe;
  }, []);

  return (
    <AccessibilityProvider>
      <AuthProvider>
        <RootLayoutContent colorScheme={colorScheme} />
      </AuthProvider>
    </AccessibilityProvider>
  );
}

function RootLayoutContent({ colorScheme }: { colorScheme: ColorSchemeName }) {
  const { settings } = useAccessibility();
  const isDarkMode = colorScheme === 'dark';
  
  // Get colors based on accessibility settings
  const colors = getHighContrastColors(isDarkMode, settings.highContrast);
  
  // Apply reduced motion if enabled
  const screenOptions: NativeStackNavigationOptions = {
    headerShown: false,
    animation: settings.reduceMotion ? 'none' as const : 'default' as const,
    contentStyle: {
      backgroundColor: colors.background,
    },
  };

  return (
    <>
      <Stack screenOptions={screenOptions}>
        <Stack.Screen name="+not-found" />
        <Stack.Screen name="notifications" />
        <Stack.Screen name="ndis-plan" />
      </Stack>
      <StatusBar style={isDarkMode || settings.highContrast ? "light" : "dark"} />
    </>
  );
}