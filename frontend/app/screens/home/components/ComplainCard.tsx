import API_BASE_IP from '../../../../config/api';
import axios from 'axios';
import { RootStackParamList } from '@/app/navigation/navigation';
import { Complaint } from '@/app/types/complain';
import { getStatusColor, getStatusIcon, getStatusText } from '@/app/util/styles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import React from 'react'
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { Toast } from 'toastify-react-native';
type P = NativeStackScreenProps<RootStackParamList, 'HomeScreen'>;




interface Props {
    complaint: Complaint
    navigation: P['navigation'];
    selectedStatus: string
    distance: number
    latitude: number
    longitute: number


}

const ComplainCard: React.FC<Props> = ({ complaint, navigation, selectedStatus, distance, latitude, longitute }) => {
    const queryClient = useQueryClient();
    const getPriorityColor = (status: string) => {
        return '#FF4444';
    };

    const truncateText = (text: string, maxLength: number) => {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    };

    const voteMutation = useMutation({
        mutationFn: async ({
            complaint_id,
            vote_type,
            action
        }: {
            complaint_id: number;
            vote_type: 'like' | 'dislike' | null;
            action: 'add' | 'update' | 'remove';
        }) => {
            const token = await AsyncStorage.getItem('citytoken');
            const endpoints = {
                add: `${API_BASE_IP}/api/complain/addvote`,
                update: `${API_BASE_IP}/api/complain/updatevote`,
                remove: `${API_BASE_IP}/api/complain/removevote`,
            };

            const response = await axios({
                method: 'POST',
                url: endpoints[action],
                data: { complaint_id, vote_type },
                headers: { 'Authorization': 'Bearer ' + token }
            });
            return response.data;
        },
        onMutate: async ({ complaint_id, vote_type, action }) => {
            // Cancel outgoing refetches
            await queryClient.cancelQueries({ queryKey: ['home-posts'] });

            // Snapshot previous value
            const previousData = queryClient.getQueryData(['home-posts', selectedStatus, distance, latitude, longitute]);

            // Optimistically update
            queryClient.setQueryData(['home-posts', selectedStatus, distance, latitude, longitute], (old: any) => {
                if (!old) return old;

                return {
                    ...old,
                    pages: old.pages.map((page: any) => ({
                        ...page,
                        posts: page.posts.map((complaint: Complaint) => {
                            if (complaint.complaint_id !== complaint_id) return complaint;

                            const newVotes = { ...complaint.votes };

                            if (action === 'add') {
                                if (vote_type === 'like') newVotes.like += 1;
                                if (vote_type === 'dislike') newVotes.dislike += 1;
                                newVotes.userReaction = vote_type;
                            } else if (action === 'update') {
                                if (vote_type === 'like') {
                                    newVotes.like += 1;
                                    newVotes.dislike -= 1;
                                } else if (vote_type === 'dislike') {
                                    newVotes.dislike += 1;
                                    newVotes.like -= 1;
                                }
                                newVotes.userReaction = vote_type;
                            } else if (action === 'remove') {
                                if (complaint.votes.userReaction === 'like') newVotes.like -= 1;
                                if (complaint.votes.userReaction === 'dislike') newVotes.dislike -= 1;
                                newVotes.userReaction = null;
                            }

                            return { ...complaint, votes: newVotes };
                        })
                    }))
                };
            });

            return { previousData };
        },
        onError: (err, variables, context) => {
            // Rollback on error
            if (context?.previousData) {
                queryClient.setQueryData(['home-posts', selectedStatus, distance, latitude,longitute], context.previousData);
            }
            Toast.error('Failed to update vote');
        },
    });

    const addVote = async (complaint_id: number, vote_type: 'like' | 'dislike' | null, currentReaction: 'like' | 'dislike' | null) => {
        if (currentReaction === null) {
            voteMutation.mutate({ complaint_id, vote_type, action: 'add' });
        } else {
            voteMutation.mutate({ complaint_id, vote_type, action: 'update' });
        }
    };

    const removeVote = async (complaint_id: number, vote_type: 'like' | 'dislike' | null, currentReaction: 'like' | 'dislike' | null) => {
        voteMutation.mutate({ complaint_id, vote_type, action: 'remove' });
    };

    return (
        <TouchableOpacity
            key={complaint.complaint_id}
            className="bg-white rounded-lg mb-4 overflow-hidden shadow-sm"
            onPress={() => {
                navigation.navigate('ComplainDetails', { complaintId: complaint.complaint_id });
            }}
        >
            {/* Complaint Image */}
            {complaint.media && complaint.media.length > 0 && complaint.media[0].file_type === 'image' ? (
                <Image
                    source={{ uri: complaint.media[0].file_url }}
                    className="w-full h-48"
                    resizeMode="cover"
                />
            ) : (
                <View className="w-full h-48 bg-gray-200 justify-center items-center">
                    <Text className="text-gray-500 text-4xl">📷</Text>
                    <Text className="text-gray-500 mt-2">No Image</Text>
                </View>
            )}

            {/* Content */}
            <View className="">
                {/* Priority and Status */}
                <View className="flex-row justify-between items-center  px-4 py-2">
                    <View className="flex-row items-center">
                        <View
                            className="w-2 h-2 rounded-full mr-2"
                            style={{ backgroundColor: getPriorityColor(complaint.status) }}
                        />
                        <Text className="text-red-500 text-xs font-medium">High Priority</Text>
                    </View>
                    <View
                        className="px-2 py-1 rounded-full flex flex-row items-center gap-1"
                        style={{ backgroundColor: getStatusColor(complaint.status) + '20' }}
                    >
                        <Image style={{ width: 10, height: 10 }} source={{ uri: getStatusIcon(complaint.status) }} />
                        <Text
                            className="text-xs font-medium"
                            style={{ color: getStatusColor(complaint.status) }}
                        >
                            {getStatusText(complaint.status)}
                        </Text>
                    </View>
                </View>

                {/* Title */}
                <Text className="text-lg font-bold mb-1 px-4">{complaint.title}</Text>

                {/* Location */}
                <View className="flex-row items-center mb-3 px-4">
                    <Image style={{ width: 15, height: 15 }} source={{ uri: 'https://img.icons8.com/?size=100&id=85049&format=png&color=737373' }} />
                    <Text className="text-gray-600 text-sm font-medium flex-1">
                        {truncateText(complaint.address || 'Location not specified', 40)}
                    </Text>
                </View>

                {/* Bottom Actions */}
                <View className='border-gray-200 border-b -px-8 my-2'></View>
                <View className="flex-row justify-between items-center px-4 py-2 self-end">
                    <View className='flex flex-row  gap-4'>
                        <View className="flex-row items-center space-x-4">
                            <View className="flex-row items-center">
                                {
                                    complaint.votes.userReaction === 'like' ?
                                        <TouchableOpacity onPress={() => { removeVote(complaint.complaint_id, null, 'like') }}>
                                            <Image style={{ width: 30, height: 30 }} source={{ uri: 'https://img.icons8.com/?size=100&id=HhxwuilvXTcb&format=png&color=228BE6' }} />
                                        </TouchableOpacity>
                                        :
                                        <TouchableOpacity onPress={() => { addVote(complaint.complaint_id, 'like', complaint.votes.userReaction) }}>
                                            <Image style={{ width: 30, height: 30 }} source={{ uri: 'https://img.icons8.com/?size=100&id=96384&format=png&color=000000' }} />
                                        </TouchableOpacity>
                                }

                                <Text className="text-black text-base font-medium">
                                    {complaint._count?.votes || complaint.votes?.like || 0}
                                </Text>
                            </View>
                        </View>
                        <View className="flex-row items-center space-x-4">
                            <View className="flex-row items-center">{
                                complaint.votes.userReaction === 'dislike' ?
                                    <TouchableOpacity onPress={() => { removeVote(complaint.complaint_id, null, 'dislike') }}>
                                        <Image style={{ width: 20, height: 20 }} source={{ uri: 'https://img.icons8.com/?size=100&id=87726&format=png&color=228BE6' }} />
                                    </TouchableOpacity>
                                    :
                                    <TouchableOpacity onPress={() => { addVote(complaint.complaint_id, 'dislike', complaint.votes.userReaction) }}>
                                        <Image style={{ width: 30, height: 30 }} source={{ uri: 'https://img.icons8.com/?size=100&id=gqN8RslTqitJ&format=png&color=000000' }} />
                                    </TouchableOpacity>
                            }

                                <Text className="text-black text-base font-medium">
                                    {complaint._count?.votes || complaint.votes?.dislike || 0}
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    )
}

export default ComplainCard