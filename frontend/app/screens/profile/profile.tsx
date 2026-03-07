import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/navigation';
import API_BASE_IP from '../../../config/api';
import { useTranslation } from 'react-i18next';
import LottieView from 'lottie-react-native';
import { useQuery } from '@tanstack/react-query';
import UserInfo from './components/UserInfo';
import UserStats from './components/UserStats';
import UserReports from './components/UserReports';
import UserBadges from './components/UserBadges';
import { ProfileData } from '@/app/types/profileData';
import { Ionicons } from '@react-native-vector-icons/ionicons';
import { useTheme } from '@/app/context/theme-context';
import Loading from '../components/Loading';

type Props = NativeStackScreenProps<RootStackParamList, 'ProfileScreen'>;


const ProfileScreen: React.FC<Props> = ({ navigation }) => {

  const { t } = useTranslation();
  const { mode } = useTheme();
  const { data, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const token = await AsyncStorage.getItem("citytoken");
      const response = await axios.get(`${API_BASE_IP}/api/user/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data as ProfileData
    }
  })

  if (isLoading) {
    return (
      <Loading />
    );
  }
  return (
    <ScrollView className="flex-1 bg-gray-50  dark:bg-[#101922]">
      {/* Header */}
      <View className="bg-white/80 light:bg-background-light/80 border-b border-slate-200 light:border-slate-800 dark:bg-[#101922] dark:border-b dark:border-b-blue-300">
        <View className="flex-row items-center p-2 justify-between">
          <View
            className="flex w-10 h-10 items-center justify-center rounded-full"
          />
          <Text className="text-slate-900 light:text-slate-100 text-lg font-bold flex-1 text-center dark:text-white">
            Profile
          </Text>
          <TouchableOpacity
            className=' w-10'
            onPress={() => { navigation.navigate('Settings') }}>
            <Ionicons name='settings-outline' color={`${mode === 'light' ? 'black' : 'white'}`} size={20} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Profile Section */}
      <UserInfo data={data} navigation={navigation} />
      <TouchableOpacity
        onPress={() => { navigation.navigate('EditProfile') }}
        className='bg-blue-500 p-2 rounded-lg flex flex-row items-center self-center gap-2 my-2'>
        <Image
          style={{ width: 20, height: 20 }}
          source={{ uri: "https://img.icons8.com/?size=100&id=VMo8ScDaJ5lL&format=png&color=FFFFFF" }}
        />

        <Text className='text-white font-bold'>{t('editProfile')}</Text>
      </TouchableOpacity>


      {/* Stats Section */}
      <UserStats data={data} />

      {/* My Reports Section */}
      <UserReports data={data} navigation={navigation} />

      {/* Badges Section */}
      <UserBadges data={data} navigation={navigation} />

      {/* Bottom padding */}
      <View className="h-6" />
    </ScrollView>
  );
};

export default ProfileScreen;