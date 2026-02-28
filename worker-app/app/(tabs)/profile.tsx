import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    StatusBar,
    Image,
} from 'react-native';
import Icon from '@react-native-vector-icons/ionicons';
import { RootStackParamList } from '../navigation/navigation';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useQuery } from '@tanstack/react-query';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import API_BASE_URL from '@/config/api';
import { formatToMonthYear } from '../utils/date';
import ProfileIdenity from '../components/ProfileIdenity';
import ProfileStats from '../components/ProfileStats';
import InformationList from '../components/InformationList';

interface WorkerProfile {
    id: string;
    name: string;
    workerId: string;
    avatar: string;
    totalTasks: number;
    successRate: string;
    email: string;
    phonenumber: string;
    department: string;
    createdAt: string;
    isVerified: boolean;
}

type Props = NativeStackScreenProps<RootStackParamList, "ProfileScreen">;


const Profile: React.FC<Props> = () => {

    const { data } = useQuery({
        queryKey: ['profile'],
        queryFn: async () => {
            const token = await AsyncStorage.getItem("workercitytoken");
            const res = await axios({
                url: `${API_BASE_URL}/api/worker/profile`,
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            })
            console.log(res.data)
            return res.data.final as WorkerProfile;
        }
    })


    const handleGoBack = () => {
        console.log('Go back pressed');
        // Implement navigation back logic here
    };


    const handleLogout = () => {
        console.log('Logout pressed');
        // Implement logout logic here
    };

    if (!data) {
        return;
    }

    return (
        <View className="flex-1 bg-background-light light:bg-background-light">
            <StatusBar barStyle="light-content" />

            {/* Header Navigation */}
            <View className="px-4 py-2 flex-row items-center justify-between bg-background-light/80 light:bg-background-light/80 mt-8">
                <TouchableOpacity className="flex-row items-center" onPress={handleGoBack}>
                    <Icon name="chevron-back" size={24} color="#136dec" />
                    <Text className="font-medium text-primary">Tasks</Text>
                </TouchableOpacity>
                <Text className="text-lg font-bold light:text-white">Profile</Text>
                <View></View>
            </View>

            <ScrollView
                className="flex-1 px-4"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 100 }}
            >
                {/* Profile Identity Section */}
                <ProfileIdenity name={data.name} id={data.id} />

                {/* Stats Grid */}
                <ProfileStats totalTasks={data.totalTasks} successRate={data.successRate} />

                {/* Information List */}
                <InformationList phonenumber={data.phonenumber} createdAt={data.createdAt} />



                {/* Logout Action */}
                <View className="mt-10 mb-6">
                    <TouchableOpacity
                        className="w-full py-4 bg-white light:bg-slate-800 rounded-xl shadow-sm border border-slate-100 light:border-slate-700 active:scale-[0.98]"
                        onPress={handleLogout}
                        activeOpacity={0.9}
                    >
                        <Text className="text-danger font-bold text-center">Log Out</Text>
                    </TouchableOpacity>
                </View>

                {/* App Footer */}
                <View className="items-center mb-6">
                    <Text className="text-[11px] text-ios-gray light:text-slate-500 font-medium">
                        FixMyCIty Worker App
                    </Text>
                    <Text className="text-[10px] text-ios-gray/60 light:text-slate-600">
                        v1.0.0
                    </Text>
                </View>
            </ScrollView>


            {/*Home Indicator */}
            <View className="h-1.5 w-32 bg-slate-300 light:bg-slate-700 rounded-full mx-auto mb-2 mt-4 opacity-50" />
        </View>
    );
}

export default Profile