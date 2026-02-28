import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    StatusBar,
    Image,
} from 'react-native';
import Icon from '@react-native-vector-icons/ionicons';

interface HistoryTask {
    id: string;
    title: string;
    status: 'completed' | 'pending' | 'failed';
    completedDate: string;
    completedTime: string;
    image: string;
    hasEvidence: boolean;
}

interface TaskGroup {
    monthYear: string;
    tasks: HistoryTask[];
}

const History = () => {
    const [activeTab, setActiveTab] = useState<'tasks' | 'history' | 'messages' | 'profile'>('history');

    const taskHistory: TaskGroup[] = [
        {
            monthYear: 'October 2023',
            tasks: [
                {
                    id: '1',
                    title: 'Warehouse Inventory Audit - Sector B',
                    status: 'completed',
                    completedDate: 'Oct 12, 2023',
                    completedTime: '2:45 PM',
                    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDWOgiFAJLa4TXp8viMQK20SbfYs-cJHoZvPBWAhg7c79O7ffVqLjF3E1fst9nCvhvOMdDAhlqDd3QKgUsQ0yManY4AU2wXPeiibquwGpO40FQRZxV4nBPRWkGivRuKxaAAeTvVATPV9rdaNwZRBDIJ_gfI_FlGpt6y69Z4_caaW214KA9xbzS7Vcri_rTTDlyFjApUoDzpbrT_Ift0X9jbT7I1zAQm1ZG2iZVTUoOfB1kfyezm3W7YK7kF9g8btG1LQe19CaY39wpw',
                    hasEvidence: true,
                },
                {
                    id: '2',
                    title: 'HVAC System Routine Maintenance',
                    status: 'completed',
                    completedDate: 'Oct 10, 2023',
                    completedTime: '10:15 AM',
                    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCpOIp5F1hHtWKPDM9NtPuKVCSUk_gCrHC_06Eyk-_X2ZjieT1q2FXcXolfP4V8hOrP4nSI9c2N6AI2G79n5ZF8WufW6te-lKEalIK3XvbSqGceOW3ai6LDWeCQJKZkd_1fMktX-1rmOBt_iu32OFG0xWbyjwDffB8swfTWu9TFKkdFPE1_I8tz3YEAg0oMt9UnVnJKMvZWj6oisvNNVbewavrpbNz5HoM3-_ZxJ_6tQTBCdrQc2qR_7oeavYqS28oYdTTWM1iI9tN3',
                    hasEvidence: true,
                },
            ],
        },
        {
            monthYear: 'September 2023',
            tasks: [
                {
                    id: '3',
                    title: 'Emergency Pipe Leak Repair',
                    status: 'completed',
                    completedDate: 'Sep 28, 2023',
                    completedTime: '5:30 PM',
                    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAhglsq9l608141GGyLfuUByALrT0Svz6TPHuqqP6YSaaf2CWs5qpQUQYjQ_qnIdeyG_efmqJhbjmFuIqLQ0Q2hl6Kaj9-nwoKJmc--Ho-r2tJ3ivOzoIny39jaY3gQ3RZsVHQyYzwAF95-oZngIQUogufGwFrqV2LQIho_x9YLtcuyJTl8rFLOHF1bNlJNH1RY8PQ4_srKGtC11T32Q7_QCy8e4hyq4bg_4J3qztehvsFInC9IDY5TgGCrxl3KNLvgfy3oiN-RBNLZ',
                    hasEvidence: true,
                },
            ],
        },
    ];

    const handleGoBack = () => {
        console.log('Go back pressed');
        // Implement navigation back logic here
    };

    const handleSearch = () => {
        console.log('Search pressed');
        // Implement search logic here
    };

    const handleViewEvidence = (taskId: string) => {
        console.log('View evidence for task:', taskId);
        // Navigate to evidence view
    };

    const handleViewDetails = (taskId: string) => {
        console.log('View details for task:', taskId);
        // Navigate to task details
    };

    const getStatusBadge = (status: HistoryTask['status']) => {
        switch (status) {
            case 'completed':
                return (
                    <View className="px-2 py-0.5 rounded bg-green-100 light:bg-green-900/30">
                        <Text className="text-green-700 light:text-green-400 text-[10px] font-bold uppercase tracking-wide">
                            Completed
                        </Text>
                    </View>
                );
            case 'cancelled':
                return (
                    <View className="px-2 py-0.5 rounded bg-slate-100 light:bg-slate-800">
                        <Text className="text-slate-700 light:text-slate-400 text-[10px] font-bold uppercase tracking-wide">
                            Cancelled
                        </Text>
                    </View>
                );
            case 'failed':
                return (
                    <View className="px-2 py-0.5 rounded bg-red-100 light:bg-red-900/30">
                        <Text className="text-red-700 light:text-red-400 text-[10px] font-bold uppercase tracking-wide">
                            Failed
                        </Text>
                    </View>
                );
        }
    };

    const renderTaskCard = (task: HistoryTask) => {
        return (
            <View
                key={task.id}
                className="flex flex-col gap-4 rounded-xl bg-white light:bg-slate-900 p-4 border border-slate-100 light:border-slate-800 shadow-sm"
            >
                <View className="flex-row justify-between items-start gap-3">
                    <View className="flex-col gap-1 flex-1">
                        <View className="flex-row items-center gap-2 mb-1">
                            {getStatusBadge(task.status)}
                        </View>
                        <Text className="text-slate-900 light:text-slate-100 text-base font-bold leading-snug">
                            {task.title}
                        </Text>
                        <View className="flex-row items-center gap-1">
                            <Icon name="calendar-outline" size={14} color="#94a3b8" />
                            <Text className="text-slate-500 light:text-slate-400 text-xs">
                                Completed {task.completedDate} • {task.completedTime}
                            </Text>
                        </View>
                    </View>
                    <View className="w-20 h-20 bg-slate-100 light:bg-slate-800 rounded-lg overflow-hidden border border-slate-100 light:border-slate-800">
                        <Image
                            source={{ uri: task.image }}
                            className="w-full h-full"
                            resizeMode="cover"
                        />
                    </View>
                </View>
                <View className="flex-row gap-2">
                    <TouchableOpacity
                        className="flex-1 flex items-center justify-center rounded-lg h-10 bg-slate-100 light:bg-slate-800"
                        onPress={() => handleViewEvidence(task.id)}
                        activeOpacity={0.7}
                    >
                        <Text className="text-slate-900 light:text-slate-100 text-sm font-semibold">
                            View Evidence
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        className="flex-1 flex items-center justify-center rounded-lg h-10 border border-slate-200 light:border-slate-700"
                        onPress={() => handleViewDetails(task.id)}
                        activeOpacity={0.7}
                    >
                        <Text className="text-slate-700 light:text-slate-300 text-sm font-semibold">
                            Details
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
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
            <ScrollView
                className="flex-1 px-4 py-6"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 100 }}
            >
                {taskHistory.map((group, index) => (
                    <View key={index} className="mb-6">
                        <Text className="text-slate-500 light:text-slate-400 text-xs font-bold uppercase tracking-wider mb-4">
                            {group.monthYear}
                        </Text>
                        <View className="space-y-4">
                            {group.tasks.map((task) => renderTaskCard(task))}
                        </View>
                    </View>
                ))}
            </ScrollView>

            {/* Bottom Navigation */}
            
        </View>
    );
}

export default History