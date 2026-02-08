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

type Props = NativeStackScreenProps<RootStackParamList, 'ProfileScreen'>;


const ProfileScreen: React.FC<Props> = ({ navigation }) => {

  const { t } = useTranslation();

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
      <View className="flex-1 justify-center items-center ">
        <LottieView
          source={require('../../../assets/loading_animations/loader.json')}
          autoPlay
          loop
          speed={2}
          style={{ width: 50, height: 50 }}
        />
      </View>
    );
  }
  return (
    <ScrollView className="flex-1 bg-gray-50 dark:bg-slate-900/70 ">
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-3 bg-white dark:bg-slate-900/70 border-b-2 border-gray-200">
        
        <Text className="text-2xl font-semibold dark:text-slate-200">Profile</Text>
        <TouchableOpacity onPress={() => { navigation.navigate('Settings') }}>
          <Image className='' style={{ width: 25, height: 25 }} source={{ uri: 'https://img.icons8.com/?size=100&id=82535&format=png&color=000000' }} />
        </TouchableOpacity>
      </View>

      {/* Profile Section */}
      <UserInfo data={data} navigation={navigation}/>
      <TouchableOpacity
        onPress={() => {navigation.navigate('EditProfile')}}
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