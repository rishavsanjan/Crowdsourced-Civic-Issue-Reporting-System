import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import ToastManager from 'toastify-react-native';
import { AuthProvider } from "./context/auth-context";


export default function RootLayout() {
  const queryClient = new QueryClient();

  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <ToastManager />
        <Stack screenOptions={{ headerShown: false }} />
      </QueryClientProvider>
    </AuthProvider>

  );
}
