import 'react-native-reanimated';
import React, { useEffect, useState } from 'react';
import './global.css';
import { View, ActivityIndicator, Image } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import ToastManager from 'toastify-react-native';
import { useTranslation } from 'react-i18next';

// Screens
import { RootStackParamList } from './navigation/navigation';
import LoginScreen from './screens/login/login';
import WelcomeLoginScreen from './screens/login/welcome';
import SignUpScreen from './screens/login/signup';
import HomeScreen from './screens/home/homescreen';
import RaiseComplainScreen from './screens/complainRaise/complain';
import ProfileScreen from './screens/profile/profile';
import ComplaintDetails from './screens/complain_details/details';
import OTPSignUp from './screens/login/otp-signup';
import OTPLogin from './screens/login/otp-login';
import Badges from './screens/profile/badges';
import AllComplaints from './screens/profile/allcomplaints';
import Settings from './screens/profile/settings';

// i18n setup
import { initI18n } from './i18n/i18n';
import WelcomeChatbot from './screens/chatbot/welcome';
import Chatbot from './screens/chatbot/chatbot';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/auth-context';
import EditProfile from './screens/profile/edit_profile';


const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

function BottomTabs() {
  const { t } = useTranslation();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#ffffff',
          height: 70,
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
        name="HomeTab"
        //@ts-ignore
        component={HomeScreen}
        options={{
          tabBarLabel: t('home'),
          tabBarIcon: ({ focused }) => (
            <Image
              style={{
                width: 24,
                height: 24,
                tintColor: focused ? '#1173D4' : '#A1A1AA',
              }}
              source={{
                uri: `https://img.icons8.com/?size=100&id=2797&format=png&color=${focused ? '1173D4' : 'A1A1AA'}`,
              }}
            />
          ),
        }}
      />

      <Tab.Screen
        //@ts-ignore
        name="UploadTab"
        //@ts-ignore
        component={RaiseComplainScreen}
        options={{
          tabBarLabel: t('upload'),
          tabBarIcon: ({ focused }) => (
            <Image
              style={{
                width: 24,
                height: 24,
                tintColor: focused ? '#1173D4' : '#A1A1AA',
              }}
              source={{
                uri: `https://img.icons8.com/?size=100&id=40097&format=png&color=${focused ? '1173D4' : 'A1A1AA'}`,
              }}
            />
          ),
        }}
      />

      <Tab.Screen
        //@ts-ignore
        name="ProfileTab"
        //@ts-ignore
        component={ProfileScreen}
        options={{
          tabBarLabel: t('profile'),
          tabBarIcon: ({ focused }) => (
            <Image
              style={{
                width: 24,
                height: 24,
                tintColor: focused ? '#1173D4' : '#A1A1AA',
              }}
              source={{
                uri: `https://img.icons8.com/?size=100&id=7819&format=png&color=${focused ? '1173D4' : 'A1A1AA'}`,
              }}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}


export default function Index() {
  const [ready, setReady] = useState(false);
  const queryClient = new QueryClient()

  useEffect(() => {
    const init = async () => {
      await initI18n(); // Wait until i18n setup is ready
      setReady(true);
    };
    init();
  }, []);

  if (!ready) {
    return (
      <SafeAreaProvider>
        <SafeAreaView
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#ffffff',
          }}
        >
          <ActivityIndicator size="large" color="#1173D4" />
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }

  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <SafeAreaProvider>
          <SafeAreaView style={{ flex: 1, backgroundColor: 'black' }}>
            <ToastManager />

            <Stack.Navigator initialRouteName="HomeScreen" screenOptions={{ headerShown: false }}>

              <Stack.Screen name="HomeScreen" component={BottomTabs} />
              <Stack.Screen name="Login" component={LoginScreen} />
              <Stack.Screen name="WelcomeLoginScreen" component={WelcomeLoginScreen} />
              <Stack.Screen name="SignUpScreen" component={SignUpScreen} />
              <Stack.Screen name="ComplainDetails" component={ComplaintDetails} />
              <Stack.Screen name="OTPSignUp" component={OTPSignUp} />
              <Stack.Screen name="OTPLogin" component={OTPLogin} />
              <Stack.Screen name="Badges" component={Badges} />
              <Stack.Screen name="AllComplaints" component={AllComplaints} />
              <Stack.Screen name="Settings" component={Settings} />
              <Stack.Screen name="WelcomeChatbot" component={WelcomeChatbot} />
              <Stack.Screen name="Chatbot" component={Chatbot} />
              <Stack.Screen name="EditProfile" component={EditProfile} />

            </Stack.Navigator>
          </SafeAreaView>
        </SafeAreaProvider>
      </QueryClientProvider>
    </AuthProvider>


  );
}
