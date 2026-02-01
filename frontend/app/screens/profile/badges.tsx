import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, StatusBar, Image } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import type { RootStackParamList } from '../../navigation/navigation';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import API_BASE_IP from '../../../config/api';
import { Ionicons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { Badge } from '@/app/types/badge';
import LottieView from 'lottie-react-native';

type Props = NativeStackScreenProps<RootStackParamList, 'Badges'>;


//@ts-ignore
const BadgeCard = ({ badge, isLocked = false }) => {
    const progress = (badge.current / badge.goal) * 100;
    console.log(badge.icon_url)
    return (
        <View className={`rounded-xl bg-white/50 p-4 mb-4 ${isLocked ? 'opacity-60' : ''}`}>
            <View className="flex-row items-center gap-4">
                <Image style={{ width: 40, height: 40 }} source={{ uri: badge.icon_url }} />
                <View className="flex-1">
                    <Text className={`font-bold text-base ${isLocked ? 'text-gray-500' : 'text-black'}`}>
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


const Badges: React.FC<Props> = ({ navigation }) => {



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
        <SafeAreaView className="flex-1 bg-[#F6F7F8]">
            <StatusBar barStyle="dark-content" />

            {/* Header */}
            <View className="border-b border-gray-200 bg-[#F6F7F8] px-4 py-3">
                <View className="flex-row items-center justify-between">
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Ionicons name="arrow-back" size={24} color="#000" />
                    </TouchableOpacity>
                    <Text className="flex-1 text-center text-lg font-bold text-black">
                        Badges & Progress
                    </Text>
                    <View className="w-10" />
                </View>
            </View>

            {/* Main Content */}
            <ScrollView className="flex-1 px-4">

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