import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    StatusBar,
    Image,
    Alert,
} from 'react-native';
import Icon from '@react-native-vector-icons/ionicons';
import { RootStackParamList } from '../navigation/navigation';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useLocalSearchParams } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import API_BASE_URL from '@/config/api';
import { Complaint } from '../types/job';
import { formatISTDateTime } from '../utils/date';
import { MediaItem, pickImage, pickVideo, removeMediaItem, takePhoto } from '../utils/image';

interface PhotoEvidence {
    id: string;
    uri: string;
    alt: string;
}


type Props = NativeStackScreenProps<RootStackParamList, "JobDetails">;

interface JobDetails {
    complaint: Complaint

    complaint_id: number
    createdAt: string
    id: number
    status: 'in-progress' | 'pending' | 'completed',
    worker_id: number
    instructions: string[]
    worker: Worker
}


const JobDetail: React.FC<Props> = () => {
    const { id } = useLocalSearchParams();
    const jobId = Number(id);
    const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
    console.log(mediaItems)

    const { data } = useQuery({
        queryKey: ['job', jobId],
        queryFn: async () => {
            const token = await AsyncStorage.getItem("workercitytoken");
            const res = await axios({
                url: `${API_BASE_URL}/api/worker/job?id=${jobId}`,
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            })
            console.log(res.data)
            return res.data.job as JobDetails;
        }
    })


    // Show photo options
    const showPhotoOptions = () => {
        Alert.alert(
            "Add Photo",
            "Choose an option",
            [
                { text: "Camera", onPress: takePhoto },
                { text: "Gallery", onPress: pickImage(setMediaItems) },
                { text: "Cancel", style: "cancel" }
            ]
        );
    };



    const handleGoBack = () => {
        console.log('Go back pressed');
        // Implement navigation back logic here
    };


    if (!data) {
        return;
    }


    const getStatusBadge = () => {
        switch (data.status) {
            case 'in-progress':
                return (
                    <View className="px-3 py-1 bg-primary/10 light:bg-primary/20 rounded-full">
                        <Text className="text-xs font-bold text-primary uppercase tracking-wider">
                            In Progress
                        </Text>
                    </View>
                );
            case 'pending':
                return (
                    <View className="px-3 py-1 bg-amber-100 light:bg-amber-900/30 rounded-full">
                        <Text className="text-xs font-bold text-amber-700 light:text-amber-400 uppercase tracking-wider">
                            Pending
                        </Text>
                    </View>
                );
            case 'completed':
                return (
                    <View className="px-3 py-1 bg-emerald-100 light:bg-emerald-900/30 rounded-full">
                        <Text className="text-xs font-bold text-emerald-700 light:text-emerald-400 uppercase tracking-wider">
                            Completed
                        </Text>
                    </View>
                );
        }
    };

    return (
        <View className="flex-1 bg-background-light light:bg-background-light">
            <StatusBar barStyle="light-content" />

            <View className="h-8 w-full bg-background-light light:bg-background-light flex-row items-center justify-between px-6">
            </View>

            {/* Navigation Bar */}
            <View className="bg-background-light/80 light:bg-background-light/80 px-4 py-3 border-b border-slate-200 light:border-slate-800 flex-row items-center justify-between">
                <TouchableOpacity className="flex-row items-center" onPress={handleGoBack}>
                    <Icon name="chevron-back" size={20} color="#136dec" />
                    <Text className="font-medium text-primary ml-1">Tasks</Text>
                </TouchableOpacity>
                <View className="absolute left-1/2" style={{ transform: [{ translateX: -50 }] }}>
                    <Text className="text-lg font-semibold light:text-white">Task Details</Text>
                </View>
                {getStatusBadge()}
            </View>

            <ScrollView
                className="flex-1"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ padding: 16, paddingBottom: 140 }}
            >
                {/* Task Header Section */}
                <View className="mb-6">
                    <Text className="text-2xl font-bold leading-tight light:text-white mb-2">
                        {data?.complaint.title}
                    </Text>
                    <View className="flex-row flex-wrap gap-4 pt-2">
                        <View className="flex-row items-center gap-2">
                            <Icon name="calendar-outline" size={14} color="#94a3b8" />
                            <Text className="text-sm text-slate-500 light:text-slate-400">
                                Assigned: {formatISTDateTime(data.createdAt)}
                            </Text>
                        </View>
                        {/* <View className="flex-row items-center gap-2">
                            <Icon name="alarm-outline" size={14} color="#ef4444" />
                            <Text className="text-sm text-red-500 font-medium">
                                Deadline: {task.deadline}
                            </Text>
                        </View> */}
                    </View>
                </View>

                {/* Description Card */}
                <View className="bg-white light:bg-slate-900 rounded-xl p-4 shadow-sm border border-slate-200 light:border-slate-800 mb-6">
                    <Text className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-3">
                        Description
                    </Text>
                    <Text className="text-slate-700 light:text-slate-300 leading-relaxed">
                        {data?.complaint.description}
                    </Text>
                </View>

                {/* Admin Instructions Card */}
                <View className="bg-primary/5 light:bg-primary/10 rounded-xl p-4 border border-primary/20 mb-6">
                    <View className="flex-row items-center gap-2 mb-3">
                        <Icon name="clipboard-outline" size={20} color="#136dec" />
                        <Text className="text-sm font-bold text-primary uppercase tracking-widest">
                            Admin Instructions
                        </Text>
                    </View>
                    <View className="space-y-3">
                        {data.instructions.map((instruction, index) => (
                            <View key={index} className="flex-row gap-3 mb-3">
                                <Text className="text-primary font-bold">{index + 1}.</Text>
                                <Text className="text-slate-700 light:text-slate-300 flex-1">
                                    {instruction}
                                </Text>
                            </View>
                        ))}
                    </View>
                </View>

                {/* Photo Evidence Gallery */}
                <View className="mb-6">
                    <View className="flex-row items-center justify-between mb-4">
                        <Text className="text-sm font-bold text-slate-400 uppercase tracking-widest">
                            Work Evidence
                        </Text>
                        <Text className="text-xs text-slate-500">
                            {mediaItems.length} / 5 Uploaded
                        </Text>
                    </View>
                    <View className="flex-row flex-wrap gap-3">
                        {/* Uploaded Photos */}
                        {mediaItems.map((photo) => (
                            <View
                                key={photo.id}
                                className="w-[31%] aspect-square rounded-lg overflow-hidden relative"
                            >
                                <Image
                                    source={{ uri: photo.uri }}
                                    className="w-full h-full"
                                    resizeMode="cover"
                                />
                                <View className="absolute inset-0 bg-black/20 flex items-start justify-end p-1">
                                    <TouchableOpacity
                                        className="bg-white/90 light:bg-slate-800/90 rounded-full p-1 shadow-sm"
                                        onPress={() => removeMediaItem(photo.id, setMediaItems)}
                                    >
                                        <Icon name="close" size={12} color="#ef4444" />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        ))}

                        {/* Add Photo Button */}
                        {mediaItems.length < 5 && (
                            <TouchableOpacity
                                className="w-[31%] aspect-square rounded-lg border-2 border-dashed border-slate-300 light:border-slate-700 flex flex-col items-center justify-center bg-slate-50 light:bg-slate-800/50"
                                onPress={showPhotoOptions}
                                activeOpacity={0.7}
                            >
                                <Icon name="camera-outline" size={24} color="#94a3b8" />
                                <Text className="text-[10px] font-medium text-slate-500 uppercase mt-1">
                                    Add
                                </Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
                

                {/*Add media */}
                <View className="flex flex-col gap-2 mb-4">
                    <Text className="text-[#96A4B1] font-medium">Add Media</Text>
                    <View className="flex flex-row gap-2 justify-between w-full">

                        <TouchableOpacity
                            className="bg-red-500 rounded-lg p-4 flex-1 items-center"
                            onPress={showPhotoOptions}
                        >
                            <View className="flex flex-row items-center gap-2">
                                <Image
                                    style={{ width: 20, height: 20 }}
                                    source={{
                                        uri: "https://img.icons8.com/?size=100&id=MKHxHdHEYEfC&format=png&color=1173D4",
                                    }}
                                />
                                <Text className="text-[#1173D4] font-semibold">Add Photo</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity
                            className="bg-[#DFE9F4] rounded-lg p-4 flex-1 items-center"
                            onPress={ () => {pickVideo(setMediaItems)}}
                        >
                            <View className="flex flex-row items-center gap-2">
                                <Image
                                    style={{ width: 20, height: 20 }}
                                    source={{
                                        uri: "https://img.icons8.com/?size=100&id=alybng0KUhxp&format=png&color=1173D4",
                                    }}
                                />
                                <Text className="text-[#1173D4] font-semibold">Add Video</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Location Info */}
                <View className="bg-white light:bg-slate-900 rounded-xl p-4 shadow-sm border border-slate-200 light:border-slate-800">
                    <View className="flex-row items-center gap-3">
                        <View className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                            <Icon name="location" size={20} color="#136dec" />
                        </View>
                        <View className="flex-1">
                            <Text className="font-semibold light:text-white">
                                {data.complaint.address}
                            </Text>

                        </View>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}

export default JobDetail