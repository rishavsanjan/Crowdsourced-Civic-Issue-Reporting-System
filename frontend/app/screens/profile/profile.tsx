import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  Alert,
  ScrollView,
  TouchableOpacity,
  Image
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/navigation';
import { Ionicons } from '@expo/vector-icons';

type Props = NativeStackScreenProps<RootStackParamList, 'ProfileScreen'>;

type User = {
  id: number;
  name: string;
  email: string;
  profileImage?: string;
  createdAt: string;
  Complaint: Complaint[]
};

type Report = {
  id: number;
  title: string;
  category: string;
  status: 'In Progress' | 'Resolved' | 'Submitted';
  icon: string;
  createdAt: string;

};

type Badge = {
  id: number;
  name: string;
  icon: string;
  earned: boolean;
};

type Complaint = {
  id: number,
  title: string,
  status: string,
  createdAt: string,
  address: string
}

const ProfileScreen: React.FC<Props> = ({ navigation }) => {
  const [isLogin, setIsLogin] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [resolvedComplaints, setReslovedComplaints] = useState<Complaint[]>([]);

  const [badges] = useState<Badge[]>([
    { id: 1, name: 'Active Reporter', icon: '✅', earned: true },
    { id: 2, name: 'Community Champion', icon: '📋', earned: true },
    { id: 3, name: 'Problem Solver', icon: '📄', earned: true }
  ]);

  const getProfile = async (token: string) => {
    try {
      const response = await axios.get("http://172.20.10.2:3000/api/user/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response.data);
      setComplaints(response.data.user.Complaint);
      setReslovedComplaints(response.data.resolvedReports);
      setUser(response.data.user);

    } catch (error: any) {
      console.log("Profile fetch error:", error.response?.data || error.message);
      await AsyncStorage.removeItem("citytoken");
      setIsLogin(false);
      navigation.replace("Login");
    } finally {
      setLoading(false);
    }
  };

  const checkLogin = async () => {
    const token = await AsyncStorage.getItem("citytoken");
    if (token) {
      setIsLogin(true);
      await getProfile(token);
    } else {
      setIsLogin(false);
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in_progress':
        return '#FF9500';
      case 'resolved':
        return '#34C759';
      case 'pending':
        return '#007AFF';
      default:
        return '#8E8E93';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'in_progress':
        return 'time-outline';
      case 'resolved':
        return 'checkmark-circle-outline';
      case 'pending':
        return 'paper-plane-outline';
      default:
        return 'help-circle-outline';
    }
  };

  function formatMonthYear(dateString: string) {
    const months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];

    const date = new Date(dateString);
    const monthName = months[date.getUTCMonth()]; // getUTCMonth() gives 0-11
    const year = date.getUTCFullYear();

    return `${monthName} ${year}`;
  }

  useEffect(() => {
    checkLogin();
  }, []);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#007AFF" />
        <Text className="mt-4 text-gray-600">Loading...</Text>
      </View>
    );
  }

  if (!isLogin) {
    navigation.replace("Login");
    return null;
  }


  function formatISTDateTime(dateString: string) {
    const months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];

    const date = new Date(dateString);

    // Convert to IST by adding offset (5h 30m = 330 mins)
    const istOffset = 5.5 * 60 * 60 * 1000;
    const istDate = new Date(date.getTime() + istOffset);

    const day = istDate.getDate();
    const monthName = months[istDate.getMonth()];
    const year = istDate.getFullYear();

    let hours: any = istDate.getHours();
    let minutes: any = istDate.getMinutes();
    let seconds: any = istDate.getSeconds();

    // Pad single digits
    hours = String(hours).padStart(2, "0");
    minutes = String(minutes).padStart(2, "0");
    seconds = String(seconds).padStart(2, "0");

    return `${day} ${monthName} ${year}, ${hours}:${minutes} `;
  }

  return (
    <ScrollView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-3 bg-white">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text className="text-lg font-semibold">Profile</Text>
        <View className="w-6" />
      </View>

      {/* Profile Section */}
      <View className="bg-white px-6 py-8 items-center">
        <View className="relative">
          <View className="w-24 h-24 bg-orange-200 rounded-full items-center justify-center">
            {user?.profileImage ? (
              <Image
                source={{ uri: user.profileImage }}
                className="w-24 h-24 rounded-full"
              />
            ) : (
              <Text className="text-2xl font-semibold text-orange-800">
                {user?.name?.charAt(0) || 'U'}
              </Text>
            )}
          </View>
          <View className="absolute -bottom-2 -right-2 w-8 h-8 bg-blue-500 rounded-full items-center justify-center">
            <Ionicons name="checkmark" size={16} color="white" />
          </View>
        </View>

        <Text className="text-xl font-bold mt-4">{user?.name}</Text>
        <Text className="text-gray-500">Citizen Reporter</Text>
        <Text className="text-gray-400 text-sm">Joined {formatMonthYear(user!.createdAt)}</Text>
      </View>

      {/* Stats Section */}
      <View className="bg-white mx-4 rounded-lg p-4 mb-4 shadow-sm">
        <View className="flex-row justify-around">
          <View className="items-center">
            <Text className="text-2xl font-bold">{user?.Complaint.length || 0}</Text>
            <Text className="text-gray-500 text-sm">Submitted</Text>
          </View>
          <View className="items-center">
            <Text className="text-2xl font-bold">{resolvedComplaints.length}</Text>
            <Text className="text-gray-500 text-sm">Resolved</Text>
          </View>
          <View className="items-center">
            <Text className="text-2xl font-bold">{0}</Text>
            <Text className="text-gray-500 text-sm">Badges</Text>
          </View>
        </View>
      </View>

      {/* My Reports Section */}
      <View className="bg-white mx-4 rounded-lg p-4 mb-4 shadow-sm">
        <View className='flex flex-row justify-between'>
          <Text className="text-lg font-semibold mb-4">My Reports</Text>
          <TouchableOpacity onPress={() => {AsyncStorage.removeItem('citytoken')}}>
            <Text className="text-lg font-semibold mb-4">View All</Text>

          </TouchableOpacity>
        </View>


        {
          complaints.length > 0 ?
            complaints.map((complain, index) => (
              <TouchableOpacity
                key={index}
                className=" py-3 border-b border-gray-100 last:border-b-0"
              >
                <View className='flex flex-row items-center'>


                  <View className="flex-1">
                    <Text className="font-medium">{complain.title}</Text>
                    {/* <Text className="text-gray-500 text-sm">{report.category}</Text> */}
                  </View>

                  <View className="flex-row items-center">
                    <Ionicons
                      name={getStatusIcon(complain.status)}
                      size={16}
                      color={getStatusColor(complain.status)}
                    />
                    <Text
                      className="text-sm ml-1 font-medium"
                      style={{ color: getStatusColor(complain.status) }}
                    >
                      {complain.status}
                    </Text>
                  </View>
                </View>
                <View>
                  <Text className="text-gray-500 text-sm">{formatISTDateTime(complain.createdAt)}</Text>
                </View>

              </TouchableOpacity>
            ))
            :
            <Text className='text-center my-4'>You haven't reported any issues yet!</Text>
        }
      </View>

      {/* Badges Section */}
      <View className="bg-white mx-4 rounded-lg p-4 mb-4 shadow-sm">
        <Text className="text-lg font-semibold mb-4">Badges</Text>

        <View className="flex-row flex-wrap justify-around">
          {badges.map((badge) => (
            <View key={badge.id} className="items-center mb-4 w-1/3">
              <View className="w-16 h-16 bg-teal-100 rounded-lg items-center justify-center mb-2">
                <Text className="text-2xl">{badge.icon}</Text>
              </View>
              <Text className="text-sm text-center font-medium">{badge.name}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Bottom padding */}
      <View className="h-6" />
    </ScrollView>
  );
};

export default ProfileScreen;