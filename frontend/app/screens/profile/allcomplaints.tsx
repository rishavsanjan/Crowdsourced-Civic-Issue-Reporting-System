import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, StatusBar, Image } from 'react-native';

import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/navigation';
import API_BASE_IP from '../../../config/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { getStatusColor, getStatusIcon, getStatusText } from '@/app/util/styles';
import { useQuery } from '@tanstack/react-query';
import Loading from '../components/Loading';
import Header from '../components/Header';
import { Ionicons } from '@expo/vector-icons';

type Props = NativeStackScreenProps<RootStackParamList, 'AllComplaints'>;

interface Complaint {
    address: string,
    complaint_id: number,
    createdAt: string,
    description: string,
    latitude: number,
    longitude: number,
    status: string,
    title: string,
    updatedAt: string,
    user_id: number,
    votes: {
        like: number;
        dislike: number;
        userReaction: 'like' | 'dislike' | null;
    };
};

const ComplaintCard = ({ complaint }: { complaint: Complaint }) => {
    return (
        <TouchableOpacity className="bg-white rounded-lg p-4 mb-4 dark:bg-[#101922] dark:border dark:border-white">
            <View className="flex-row justify-between items-start gap-4">
                <View className="flex-1">
                    <Text className="font-bold text-black dark:text-white">{complaint?.title}</Text>
                    <Text className="text-sm text-gray-500 mt-1">Submitted on {new Date(complaint?.createdAt).toLocaleDateString()}</Text>
                </View>
                <View
                    style={{ backgroundColor: getStatusColor(complaint.status) + '20' }}
                    className={`flex-row items-center gap-2 px-3 py-1 rounded-full `}>
                    <Ionicons
                        name={getStatusIcon(complaint.status)}
                        size={16}
                        color={getStatusColor(complaint.status)}
                    />
                    <Text style={{ color: getStatusColor(complaint.status) }} className="text-sm font-medium ">{getStatusText(complaint?.status)}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
};


const AllComplaints: React.FC<Props> = ({ navigation, route }) => {


    const { data, isLoading } = useQuery({
        queryKey: ['all-complaints'],
        queryFn: async () => {
            const token = await AsyncStorage.getItem('citytoken');
            const response = await axios({
                method: 'get',
                url: `${API_BASE_IP}/api/user/allcomplain`,
                headers: {
                    'Authorization': 'Bearer ' + token
                }
            });

            return response.data.complaint as Complaint[]
        }
    })

    if (isLoading) {
        return (
            <Loading />
        );
    }


    return (
        <SafeAreaView className="flex-1 bg-[#F6F7F8] dark:bg-[#101922]">
            <StatusBar barStyle="dark-content" />

            {/* Header */}
            <Header goBack tabName='My Complaints' />

            {/* Main Content */}
            <ScrollView className="flex-1 p-4">
                {data?.length !== undefined ? (
                    data.map((complaint, index) => (
                        <ComplaintCard key={complaint.complaint_id || index} complaint={complaint} />
                    ))
                ) : (
                    <View className="flex-1 items-center justify-center mt-20">
                        <Text className="text-gray-500 text-center">No complaints found</Text>
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
};

export default AllComplaints;