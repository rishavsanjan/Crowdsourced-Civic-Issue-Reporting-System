import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    StatusBar,
    ActivityIndicator,
} from 'react-native';
import Icon from '@react-native-vector-icons/ionicons';
import { RootStackParamList } from '../navigation/navigation';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useLocalSearchParams } from 'expo-router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import API_BASE_URL from '@/config/api';
import { Complaint } from '../types/job';
import { formatISTDateTime } from '../utils/date';
import { MediaItem } from '../utils/image';
import AdminInstructions from '../components/AdminInstructions';
import MediaUpload from '../components/MediaUpload';
import WorkLocation from '../components/WorkLocation';
import { uploadToCloudinary } from '../utils/cloudinary';
import { Toast } from 'toastify-react-native';




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

interface MediaType {
    media_id: number;
    file_url: string;
    file_type: "video" | "image";
}


const JobDetail: React.FC<Props> = () => {
    const { id } = useLocalSearchParams();
    const jobId = Number(id);
    const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
    const [mediaUrls, setMediaUrls] = useState<MediaType[]>([]);
    const queryClient = useQueryClient();
    console.log(id)
    
    const { data, isLoading } = useQuery({
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

    const uploadWorkMutation = useMutation({
        mutationKey: ['job', jobId],
        mutationFn: async () => {
            const uploadedMediaUrls = [];
            for (const mediaItem of mediaItems) {
                try {
                    const cloudinaryUrl = await uploadToCloudinary(
                        mediaItem.uri,
                        mediaItem.type === 'photo' ? 'image' : 'video'
                    );
                    console.log(cloudinaryUrl)
                    uploadedMediaUrls.push({
                        file_type: mediaItem.type,
                        file_url: cloudinaryUrl,
                    });
                    const file = {
                        file_type: mediaItem.type,
                        file_url: cloudinaryUrl
                    }
                    setMediaUrls(prev => ({ ...prev, file }))
                } catch (uploadError) {
                    console.error(`Failed to upload ${mediaItem.type}:`, uploadError);
                    Toast.error(`Failed to upload ${mediaItem.type}`);
                }
            }
            console.log(uploadedMediaUrls)
            
            const token = await AsyncStorage.getItem('workercitytoken');
            const response = await axios({
                url: `${API_BASE_URL}/api/worker/upload-job`,
                method: 'POST',
                data: {
                    jobId: jobId,
                    media: uploadedMediaUrls,
                },
                headers: {
                    'Authorization': "Bearer " + token
                }
            });

            return response.data
        },
        onMutate: async () => {
            await queryClient.cancelQueries({ queryKey: ['job', jobId] });

            const previousData = queryClient.getQueryData<JobDetails>(['job', jobId]);

            queryClient.setQueryData<JobDetails>(['job', jobId], (old) =>
                old ? { ...old, status: 'completed', complaint: { ...old.complaint, media: mediaUrls } } : old
            )

            return { previousData };
        },
        onError: (_err, _vars, context) => {
            if (context?.previousData) {
                queryClient.setQueryData(['job', jobId], context.previousData);
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['job', jobId] });
        },
        onSuccess: () => {
            Toast.success("Uploaded successfully!")
        }
    })



    const handleGoBack = () => {
        console.log('Go back pressed');
        // Implement navigation back logic here
    };

    if(isLoading){
        return(
            <View className='h-screen items-center flex flex-row justify-center'>
                <ActivityIndicator color={'blue'} size={50}/>
            </View>
        )
    }

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
                <AdminInstructions instructions={data.instructions} />



                <MediaUpload mediaItems={mediaItems} setMediaItems={setMediaItems} />


                {/* Location Info */}
                <WorkLocation address={data.complaint.address} />

                {/* Submit */}
                <View className="mt-4">
                    <TouchableOpacity

                        className={`p-3 items-center rounded-xl bg-blue-500 disabled:opacity-75`}
                        onPress={() => { uploadWorkMutation.mutate() }}
                        disabled={uploadWorkMutation.isPending || mediaItems.length === 0}
                    >
                        {
                            uploadWorkMutation.isPending ?
                                <ActivityIndicator color={'white'} />
                                :
                                <Text className="text-white font-medium">Upload Proof</Text>
                        }

                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
}

export default JobDetail