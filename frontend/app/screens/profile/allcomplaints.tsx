import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, StatusBar, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/navigation';
import API_BASE_IP from '../../../config/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

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

const getStatusColor = (status: string) => {
    switch (status) {
        case 'pending':
            return '#FF9500';
        case 'in_progress':
            return '#007AFF';
        case 'resolved':
            return '#34C759';
        default:
            return '#8E8E93';
    }
};

const getStatusIcon = (status: string) => {
    switch (status) {
        case 'pending':
            return 'https://img.icons8.com/?size=100&id=37439&format=png&color=FAB005';
        case 'in_progress':
            return 'https://img.icons8.com/?size=100&id=71202&format=png&color=228BE6';
        case 'resolved':
            return 'https://img.icons8.com/?size=100&id=114054&format=png&color=40C057';
        default:
            return '#8E8E93';
    }
}

const getStatusText = (status: string) => {
    switch (status) {
        case 'pending':
            return 'Pending';
        case 'in_progress':
            return 'In Progress';
        case 'resolved':
            return 'Resolved';
        default:
            return status;
    }
};

const ComplaintCard = ({ complaint }: { complaint: Complaint }) => {
    return (
        <TouchableOpacity className="bg-white rounded-lg p-4 mb-4">
            <View className="flex-row justify-between items-start gap-4">
                <View className="flex-1">
                    <Text className="font-bold text-black">{complaint?.title}</Text>
                    <Text className="text-sm text-gray-500 mt-1">Submitted on {new Date(complaint?.createdAt).toLocaleDateString()}</Text>
                </View>
                <View style={{ backgroundColor: getStatusColor(complaint.status) + '20' }} className={`flex-row items-center gap-2 px-3 py-1 rounded-full `}>
                    <Image style={{ width: 10, height: 10 }} source={{ uri: getStatusIcon(complaint.status) }} />
                    <Text style={{ color: getStatusColor(complaint.status) }} className="text-sm font-medium ">{getStatusText(complaint?.status)}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
};


const AllComplaints: React.FC<Props> = ({ navigation, route }) => {

    const [complaints, setComplaints] = useState<Complaint[]>([]);

    const getComplaints = async () => {
        try {
            const token = await AsyncStorage.getItem('citytoken');
            const response = await axios({
                method: 'get',
                url: `${API_BASE_IP}/user/allcomplain`,
                headers: {
                    'Authorization': 'Bearer ' + token
                }
            });
            console.log(response.data);
            setComplaints(response.data.complaint);
        } catch (error) {
            console.error('Error fetching complaints:', error);
        }
    }

    useEffect(() => {
        getComplaints();
    }, []);



    return (
        <SafeAreaView className="flex-1 bg-[#F6F7F8]">
            <StatusBar barStyle="dark-content" />

            {/* Header */}
            <View className="bg-[#F6F7F8] border-b border-gray-200">
                <View className="flex-row items-center p-4">
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Ionicons name="arrow-back" size={24} color="#000" />
                    </TouchableOpacity>
                    <Text className="text-lg font-bold text-black text-center flex-1">
                        My Complaints
                    </Text>
                    <View className="w-8" />
                </View>
            </View>

            {/* Main Content */}
            <ScrollView className="flex-1 p-4">
                {complaints.length > 0 ? (
                    complaints.map((complaint, index) => (
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