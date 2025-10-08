import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, StatusBar, Image } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import type { RootStackParamList } from '../../navigation/navigation';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import API_BASE_IP from '../../../config/api';
import { Ionicons } from '@expo/vector-icons';

type Props = NativeStackScreenProps<RootStackParamList, 'Badges'>;

interface Badge {
    created_at: string,
    criteria: string,
    description: string,
    icon_url: string,
    name: string,
    updated_at: string,
    current: number,
    goal: number
}

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

    const [badges, setBadges] = useState<Badge[]>([]);
    const getBadges = async () => {
        const token = await AsyncStorage.getItem('citytoken')
        const response = await axios.get(`http://${API_BASE_IP}:3000/api/user/badges`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        setBadges(response.data.badges)
        console.log(response.data)
    }

    useEffect(() => {
        getBadges();

    }, []);



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

                {badges!.map((badge, index) => (
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