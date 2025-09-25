import { Image } from "react-native";
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
import RaiseComplainScreen from "./screens/complainRaise/complain";
import ProfileScreen from "./screens/profile/profile";


const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

function BottomTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#fffff',
          height: 50,
        },
        tabBarActiveTintColor: '#1173D4',
        tabBarInactiveTintColor: '#A1A1AA',
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: 'bold',
        },
      }}
    >
      <Tab.Screen
        name="HomeScreen"
        //@ts-ignore
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Image style={{width:20, height:20}} source={{ uri: 'https://img.icons8.com/?size=100&id=aVHe2jHuORcA&format=png&color=737373' }} />
          ),
        }}
      />

      <Tab.Screen
      //@ts-ignore
        name="Upload"
        //@ts-ignore
        component={RaiseComplainScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Image style={{width:20, height:20}} source={{ uri: 'https://img.icons8.com/?size=100&id=40097&format=png&color=737373' }} />
          ),
        }}
      />

      <Tab.Screen
      //@ts-ignore
        name="Profile"
        //@ts-ignore
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Image style={{width:20, height:20}} source={{ uri: 'https://img.icons8.com/?size=100&id=undefined&format=png&color=737373' }} />
          ),
        }}
      />

    </Tab.Navigator>
  )
}

export default function Index() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#1F183E' }}>
      <ToastManager />
      <Stack.Navigator initialRouteName="HomeScreen" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="HomeScreen" component={BottomTabs} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="WelcomeLoginScreen" component={WelcomeLoginScreen} />
        <Stack.Screen name="SignUpScreen" component={SignUpScreen} />
      </Stack.Navigator>
    </SafeAreaView>
  );
}
