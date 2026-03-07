import React from 'react';
import { View, Text, ScrollView, SafeAreaView, StatusBar, Image } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import type { RootStackParamList } from '../../navigation/navigation';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import API_BASE_IP from '../../../config/api';
import { useQuery } from '@tanstack/react-query';
import { Badge } from '@/app/types/badge';
import Header from '../components/Header';
import Loading from '../components/Loading';

type P = NativeStackScreenProps<RootStackParamList, 'Badges'>;

interface Props {
    badge: Badge,
    isLocked: false
}

const BadgeCard: React.FC<Props> = ({ badge, isLocked = false }) => {
    const progress = (badge.current / badge.goal) * 100;
    console.log(badge.icon_url)
    return (
        <View className={`rounded-xl bg-white/50 p-4 mb-4 dark:border-white dark:border dark:bg-[#101922] ${isLocked ? 'opacity-60' : ''}`}>
            <View className="flex-row items-center gap-4">
                <Image style={{ width: 40, height: 40 }} source={{ uri: badge.icon_url }} />
                <View className="flex-1">
                    <Text className={`font-bold text-base dark:text-white ${isLocked ? 'text-gray-500' : 'text-black'}`}>
                        {badge.name}
                    </Text>
                    <Text className="text-sm text-gray-500 mt-1">
                        {badge.description}
                    </Text>
                    <View className="mt-3">
                        <View className="h-2 w-full rounded-full bg-gray-200">
                            <View
                                className="h-2 rounded-full bg-[#1173D4]"
                                style={{ width: `${progress}%` }}
                            />
                        </View>
                        <Text className="text-right text-xs text-gray-500 mt-1">
                            {badge.current}/{badge.goal}{badge.current === badge.goal ? ' - Completed' : ''}
                        </Text>
                    </View>
                </View>
            </View>
        </View>
    );
};


const Badges: React.FC<Props> = () => {

    const { data, isLoading } = useQuery({
        queryKey: ['all-complaints'],
        queryFn: async () => {
            const token = await AsyncStorage.getItem('citytoken');
            const response = await axios({
                method: 'get',
                url: `${API_BASE_IP}/api/user/badges`,
                headers: {
                    'Authorization': 'Bearer ' + token
                }
            });

            return response.data.badges as Badge[]
        }
    })

    if (isLoading) {
        return (
            <Loading/>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-[#F6F7F8] dark:bg-[#101922]">
            <StatusBar barStyle="dark-content" />

            {/* Header */}
            <Header goBack tabName='Badges' />


            {/* Main Content */}
            <ScrollView className="flex-1 px-4 mt-4">

                {data!.map((badge, index) => (
                    <BadgeCard
                        key={index}
                        badge={badge}
                        isLocked={false}
                    />
                ))}

                <View className="h-20" />
            </ScrollView>
        </SafeAreaView>
    );
};

export default Badges;