import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    StatusBar,
    Image,
    FlatList,
    ActivityIndicator,
} from 'react-native';
import Icon from '@react-native-vector-icons/ionicons';
import { RootStackParamList } from '../navigation/navigation';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useInfiniteQuery } from '@tanstack/react-query';
import axios from 'axios';
import API_BASE_URL from '@/config/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import TaskCard from '../components/TaskCard';
import { useRouter } from 'expo-router';


interface Jobs {
    complaint_id: number;
    title: string;
    description: string;
    status: 'in-progress' | 'pending' | 'completed';
    address: string;
    dueTime?: string;
    isPriority?: boolean;
    hasEvidence?: boolean;
    teamMember?: string;
    workAssigneds : {
        id : number,
        status : 'in-progress' | 'pending' | 'completed'
    }[]
}



type Props = NativeStackScreenProps<RootStackParamList, "HomeScreen">;


const WorkerHomeScreen: React.FC<Props> = () => {
    const [activeTab, setActiveTab] = useState<'tasks' | 'map' | 'history' | 'settings'>('tasks');
    
    const router = useRouter();
    const { data, hasNextPage, isFetchingNextPage, fetchNextPage } = useInfiniteQuery({
        queryKey: ['jobs'],
        queryFn: async ({ pageParam = 1 }) => {
            const token = await AsyncStorage.getItem("workercitytoken");
            const res = await axios({
                url: `${API_BASE_URL}/api/worker/get-jobs?page=${pageParam}&limit=5`,
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            })
            console.log(res.data)
            return res.data;
        },
        initialPageParam: 1,
        getNextPageParam: (lastPage, allPages) => {
            if (lastPage.jobs.length < 5) return undefined;
            return allPages.length + 1;
        }

    })

    const jobs: Jobs[] = data?.pages.flatMap(page => page.jobs) ?? [];




    return (
        <View className="flex-1 bg-background-light light:bg-background-light">
            <StatusBar barStyle="light-content" />

            {/* Phone Container */}
            <View className="flex-1 max-w-[430px] w-full self-center bg-white light:bg-background-light shadow-2xl">
                {/* Status Bar Simulator */}


                {/* Top Navigation */}
                <View className="px-5 pt-4 pb-2">
                    <View className="flex-row justify-between items-center mb-4">
                        <View className="w-10 h-10 rounded-full bg-primary/10 overflow-hidden border-2 border-primary/20">
                            <Image
                                source={{
                                    uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDMQ0NQWu6Jw7zk4cSTsfaDyaOCayTuastxaXcIAWqnBviCGMqabCoKtg6QmOUNFJxu4jox0K57S_mDrautP5jYvE8f3tHGzw5PZ-SRrqYJWHcF4yEzkz6O_hxweeZyUirDki7yt6t2tCy7mEL-aq03QuoMIGs06DqC0rjUZ2JvOk8jW3PZxY9jgWHIG8fQRiJTmC-gjkJLHSHL_geCk3NRvYfQ-6X2o_28qtwAlf2UCz-y8G6_KR0URxTx23YRf19s5lJJi6ZhuOSH',
                                }}
                                className="w-full h-full"
                                resizeMode="cover"
                            />
                        </View>
                        <View className="flex-row gap-2">
                            <TouchableOpacity className="w-10 h-10 rounded-full bg-slate-100 light:bg-slate-800 flex items-center justify-center">
                                <Icon name="search-outline" size={20} color="#64748b" />
                            </TouchableOpacity>
                            <TouchableOpacity className="w-10 h-10 rounded-full bg-slate-100 light:bg-slate-800 flex items-center justify-center">
                                <Icon name="options-outline" size={20} color="#64748b" />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <Text className="text-3xl font-bold tracking-tight text-slate-900 light:text-white">
                        Dashboard
                    </Text>
                    <Text className="text-slate-500 light:text-slate-400 text-sm mt-1">
                        You have 5 tasks remaining today
                    </Text>
                </View>

                {/* Main Content */}
                <FlatList
                    data={jobs}
                    keyExtractor={(item) => item.complaint_id.toString()}
                    renderItem={({ item }) => <TaskCard
                        task={item}
                        onPress={() =>
                            router.push({
                                pathname: "/job/[id]",
                                params: { id: item.workAssigneds[0].id.toString() },
                            })}
                    />}
                    onEndReached={() => {
                        if (hasNextPage && !isFetchingNextPage) {
                            fetchNextPage()
                        }
                    }}
                    onEndReachedThreshold={0.5}
                    ListFooterComponent={
                        isFetchingNextPage ? <ActivityIndicator /> : null
                    }
                />

                {/* Floating Action Button */}
                <View className="absolute bottom-24 right-5">
                    <TouchableOpacity
                        className="w-14 h-14 bg-primary rounded-full shadow-lg flex items-center justify-center active:scale-95"
                        activeOpacity={0.9}
                    >
                        <Icon name="qr-code-outline" size={28} color="#ffffff" />
                    </TouchableOpacity>
                </View>



                {/* Home Indicator (iOS Style) */}
                <View className="absolute bottom-1.5 left-1/2 w-32 h-1.5 bg-slate-200 light:bg-slate-800 rounded-full" style={{ transform: [{ translateX: -64 }] }} />
            </View>
        </View>
    );
}

export default WorkerHomeScreen