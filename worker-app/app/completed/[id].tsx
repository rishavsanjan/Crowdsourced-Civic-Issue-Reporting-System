import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StatusBar, ImageBackground, ActivityIndicator, Dimensions } from 'react-native';
import Icon from '@react-native-vector-icons/ionicons';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import API_BASE_URL from '@/config/api';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { RootStackParamList } from '../navigation/navigation';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { JobSummary } from '../types/job';
import { formatDate, formatTo12Hour } from '../utils/date';
import { SafeAreaView } from 'react-native-safe-area-context';
type Props = NativeStackScreenProps<RootStackParamList, "JobSummary">;

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = Math.min(SCREEN_WIDTH - 32, 398);

const TaskSummaryScreen: React.FC<Props> = () => {
    const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
    const router = useRouter();
    const { id } = useLocalSearchParams();
    const jobId = Number(id);


    const { data, isLoading } = useQuery({
        queryKey: ['job', jobId],
        queryFn: async () => {
            const token = await AsyncStorage.getItem("workercitytoken");
            const res = await axios({
                url: `${API_BASE_URL}/api/worker/summary?id=${jobId}`,
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            })
            console.log(res.data)
            return res.data.summary as JobSummary;
        }
    })

    if (isLoading) {
        return (
            <View className='h-screen items-center flex flex-row justify-center'>
                <ActivityIndicator color={'blue'} size={50} />
            </View>
        )
    }

    return (
        <SafeAreaView className="flex-1 bg-background-light light:bg-background-light">
            <StatusBar barStyle="light-content" />
            <View className="flex-1 max-w-[430px] w-full self-center shadow-2xl">
                <View className="bg-white/80 light:bg-background-light/80 p-2 border-b border-slate-200 light:border-slate-800 flex-row items-center">
                    <TouchableOpacity
                        onPress={() => router.back()}
                        className="w-10 h-10 items-center justify-center">
                        <Icon
                            name="arrow-back"
                            size={24} color="#136dec"
                        />
                    </TouchableOpacity>
                    <Text className="flex-1 text-lg font-bold text-center pr-10 light:text-white">Task Summary</Text>
                </View>
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
                    <View className="py-4">
                        <ScrollView
                            horizontal
                            pagingEnabled
                            showsHorizontalScrollIndicator={false}
                            onScroll={(e) => {
                                const index = Math.round(e.nativeEvent.contentOffset.x / CARD_WIDTH);
                                setCurrentPhotoIndex(index);
                            }}
                            scrollEventThrottle={16}
                        >
                            {data?.evidence.map((photo, index) => (
                                <View key={index} className="px-4" style={{ width: CARD_WIDTH + 32 }}>
                                    <View className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800" style={{ aspectRatio: 4 / 3 }}>
                                        <ImageBackground source={{ uri: photo.file_url }} className="flex-1" resizeMode="cover">
                                        </ImageBackground>
                                    </View>
                                </View>
                            ))}
                        </ScrollView>

                        {/* Photo Indicator Dots */}
                        {data?.evidence != null && (
                            <View className="flex-row justify-center items-center gap-2 mt-3">
                                {data?.evidence.map((_, index) => (
                                    <View
                                        key={index}
                                        className={`h-2 rounded-full ${index === currentPhotoIndex ? 'w-6 bg-primary' : 'w-2 bg-slate-300 dark:bg-slate-700'}`}
                                    />
                                ))}
                            </View>
                        )}

                        {/* Photo Counter */}
                        {data?.evidence != null && (
                            <View className="absolute top-8 left-8 bg-black/60 px-3 py-1.5 rounded-full">
                                <Text className="text-white text-xs font-bold">
                                    {currentPhotoIndex + 1} / {data?.evidence.length}
                                </Text>
                            </View>
                        )}
                    </View>
                    <View className="px-4 pt-2">
                        <View className="flex-row items-center gap-2 mb-2">
                            <View className="bg-primary/10 px-2 py-0.5 rounded"><Text className="text-primary text-[10px] font-bold uppercase">{data?.category}</Text></View>
                            <Text className="text-slate-400 text-xs">#TASK-{data?.id}</Text>
                        </View>
                        <Text className="text-slate-900 light:text-white text-2xl font-bold mb-4">{data?.title}</Text>
                        <View className="flex-row gap-4 py-4 border-y border-slate-100 light:border-slate-800">
                            <View><Text className="text-slate-400 text-[11px] font-semibold uppercase mb-1">Status</Text>
                                <View className="flex-row items-center gap-2"><Icon name="checkmark-circle" size={18} color="#16a34a" /><Text className="text-green-600 light:text-green-400 font-bold">Completed</Text></View></View>
                            <View className="w-px bg-slate-200 light:bg-slate-800" />
                            <View className="flex-1"><Text className="text-slate-400 text-[11px] font-semibold uppercase mb-1">Completion Date</Text>
                                <View className="flex-row items-center gap-2"><Icon name="calendar-outline" size={18} color="#64748b" /><Text className="text-slate-700 light:text-slate-300 font-semibold text-sm">{formatDate(data!.completionDate)} • {formatTo12Hour(data!.completionDate)}</Text></View></View>
                        </View>
                    </View>
                    <View className="px-4 py-6">
                        <Text className="text-slate-900 light:text-white text-sm font-bold uppercase mb-3">Worker Comments</Text>
                        <View className="bg-white light:bg-slate-900/50 p-4 rounded-xl border border-slate-200 light:border-slate-800">
                            {
                                data?.workerComments != null ?
                                    <Text className="text-slate-600 light:text-slate-400 italic">{data?.workerComments}</Text>
                                    :
                                    <Text className="text-slate-600 light:text-slate-400 italic">
                                        Worker did not added any comment.
                                    </Text>
                            }

                        </View>
                    </View>
                    <View className="px-4 pb-6">
                        <Text className="text-slate-900 light:text-white text-sm font-bold uppercase mb-3">Location Record</Text>
                        <View className="flex-row gap-3 bg-white light:bg-slate-900/50 p-4 rounded-xl border border-slate-200 light:border-slate-800">
                            <View className="bg-primary/10 p-2 rounded-lg"><Icon name="location" size={24} color="#136dec" /></View>
                            <View className="flex-1">
                                <Text className="text-sm text-slate-500 light:text-slate-400">{data?.location}</Text></View>
                        </View>
                    </View>
                </ScrollView>

            </View>
        </SafeAreaView>
    );
}

export default TaskSummaryScreen