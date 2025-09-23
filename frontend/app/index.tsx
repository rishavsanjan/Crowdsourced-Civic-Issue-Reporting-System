import { Text, View } from "react-native";
import "./global.css";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SafeAreaView } from 'react-native-safe-area-context';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { RootStackParamList } from "./navigation/navigation";
import LoginScreen from "./screens/login/login";
import WelcomeLoginScreen from "./screens/login/welcome";
import SignUpScreen from "./screens/login/signup";
import ToastManager from 'toastify-react-native';
import HomeScreen from "./screens/home/homescreen";


const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

export default function Index() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#1F183E' }}>
      <ToastManager />
      <Stack.Navigator initialRouteName="WelcomeLoginScreen" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="WelcomeLoginScreen" component={WelcomeLoginScreen} />
        <Stack.Screen name="SignUpScreen" component={SignUpScreen} />
        <Stack.Screen name="HomeScreen" component={HomeScreen} />

      </Stack.Navigator>
    </SafeAreaView>
  );
}
