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
import ComplaintDetails from "./screens/complain_details/details";


const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

function BottomTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#ffffff', // Fixed: was '#fffff'
          height: 70, // Increased height
          paddingBottom: 10,
          paddingTop: 5,
        },
        tabBarActiveTintColor: '#1173D4',
        tabBarInactiveTintColor: '#A1A1AA',
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '600',
        },
      }}
    >
      <Tab.Screen
        //@ts-ignore
        name="Home"
        //@ts-ignore
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <Image
              style={{
                width: 24,
                height: 24,
                tintColor: focused ? '#1173D4' : '#A1A1AA'
              }}
              source={{
                uri: 'https://img.icons8.com/?size=100&id=2797&format=png&color=' + (focused ? '1173D4' : 'A1A1AA')
              }}
            />
          ),
        }}
      />

      <Tab.Screen
        //@ts-ignore
        name="Upload"
        //@ts-ignore
        component={RaiseComplainScreen}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <Image
              style={{
                width: 24,
                height: 24,
                tintColor: focused ? '#1173D4' : '#A1A1AA'
              }}
              source={{
                uri: 'https://img.icons8.com/?size=100&id=40097&format=png&color=' + (focused ? '1173D4' : 'A1A1AA')
              }}
            />
          ),
        }}
      />

      <Tab.Screen
        //@ts-ignore
        name="Profile"
        //@ts-ignore
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <Image
              style={{
                width: 24,
                height: 24,
                tintColor: focused ? '#1173D4' : '#A1A1AA'
              }}
              source={{
                uri: 'https://img.icons8.com/?size=100&id=7819&format=png&color=' + (focused ? '1173D4' : 'A1A1AA')
              }}
            />
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
        <Stack.Screen name="ComplainDetails" component={ComplaintDetails} />
      </Stack.Navigator>
    </SafeAreaView>
  );
}
