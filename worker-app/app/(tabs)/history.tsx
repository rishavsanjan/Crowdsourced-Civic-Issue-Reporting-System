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
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import API_BASE_URL from '@/config/api';
import HistoryTaskCard from '../components/HistoryTaskCard';
import { useRouter } from 'expo-router';

interface HistoryTask {
    id: string;
    name: string;
    status: 'completed' | 'pending' | 'failed';
    completedAt: string;
    image: string;
    hasEvidence: boolean;
    workAssigneds: {
        id: string
    }
    complaint_id:number
}

interface TaskGroup {
    monthYear: string;
    tasks: HistoryTask[];
}

const History = () => {
    const router = useRouter();
    const { data, hasNextPage, isFetchingNextPage, fetchNextPage } = useInfiniteQuery({
        queryKey: ['jobs-history'],
        queryFn: async ({ pageParam = 1 }) => {
            const token = await AsyncStorage.getItem("workercitytoken");
            const res = await axios({
                url: `${API_BASE_URL}/api/worker/history?page=${pageParam}&limit=5`,
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
            if (lastPage.history.length < 5) return undefined;
            return allPages.length + 1;
        }

    })



    const jobs: HistoryTask[] = data?.pages.flatMap(page => page.history) ?? [];

    console.log(jobs)


    
    const handleGoBack = () => {
        console.log('Go back pressed');
        // Implement navigation back logic here
    };

    const handleSearch = () => {
        console.log('Search pressed');
        // Implement search logic here
    };

    

    

    return (
        <View className="flex-1 bg-white light:bg-background-light">
            <StatusBar barStyle="light-content" />

            {/* Header */}
            <View className="bg-white/80 light:bg-background-light/80 border-b border-slate-200 light:border-slate-800">
                <View className="flex-row items-center p-4 justify-between">
                    <TouchableOpacity
                        className="flex w-10 h-10 items-center justify-center rounded-full"
                        onPress={handleGoBack}
                    >
                        <Icon name="arrow-back" size={24} color="#000000" />
                    </TouchableOpacity>
                    <Text className="text-slate-900 light:text-slate-100 text-lg font-bold flex-1 text-center">
                        Task History
                    </Text>
                    <View className="flex w-10 items-center justify-end">
                        <TouchableOpacity
                            className="flex w-10 h-10 items-center justify-center rounded-full"
                            onPress={handleSearch}
                        >
                            <Icon name="search-outline" size={24} color="#000000" />
                        </TouchableOpacity>
                    </View>
                </View>

            </View>

            {/* Main Content */}
             <FlatList
                data={jobs}
                keyExtractor={(item) => item.complaint_id.toString()}
                renderItem={({ item }) => <HistoryTaskCard
                    task={item}
                    onPress={() =>
                        router.push({
                            pathname: "/job/[id]",
                            params: { id: item.workAssigneds.id.toString() },
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

            {/* Bottom Navigation */}

        </View>
    );
}

export default History