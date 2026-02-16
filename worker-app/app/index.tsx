import { Redirect } from "expo-router";
import "../app/global.css"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export default function Index() {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <Redirect href="/(auth)/auth" />
    </QueryClientProvider>
    );
}