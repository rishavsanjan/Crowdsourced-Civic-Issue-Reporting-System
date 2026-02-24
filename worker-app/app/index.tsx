import { Redirect } from "expo-router";
import { useAuth } from "./context/auth-context";
import "../app/global.css"
import { ActivityIndicator } from "react-native";

export default function Index() {
  const { worker, loading } = useAuth();
  if (loading) {
    return <ActivityIndicator color={'black'} />

  }
  if (worker) {
    return <Redirect href="/(tabs)" />;
  }

  return <Redirect href="/(auth)/auth" />;
}