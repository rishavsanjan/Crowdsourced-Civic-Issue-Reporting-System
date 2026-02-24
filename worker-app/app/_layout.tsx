import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import ToastManager from 'toastify-react-native';
import { AuthProvider } from "./context/auth-context";

const queryClient = new QueryClient();

export default function RootLayout() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <ToastManager />
        <Stack screenOptions={{ headerShown: false }} />
      </QueryClientProvider>
    </AuthProvider>
  );
}