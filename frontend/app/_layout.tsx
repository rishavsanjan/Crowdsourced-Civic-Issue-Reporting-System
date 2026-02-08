import { Stack } from 'expo-router';
import { View } from 'react-native';
import { ThemeProvider, useTheme } from '@/app/context/theme-context';

function RootLayoutInner() {
  const { mode } = useTheme();

  return (
    <View className={`flex-1 ${mode === 'dark' ? 'dark' : ''}`}>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      />
    </View>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <RootLayoutInner />
    </ThemeProvider>
  );
}
