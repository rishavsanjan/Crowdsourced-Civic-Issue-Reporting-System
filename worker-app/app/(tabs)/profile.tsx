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
import { RootStackParamList } from '../navigation/navigation';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

interface WorkerProfile {
    id: string;
    name: string;
    workerId: string;
    avatar: string;
    totalTasks: number;
    successRate: string;
    email: string;
    phone: string;
    department: string;
    joinedDate: string;
    isVerified: boolean;
}

type Props = NativeStackScreenProps<RootStackParamList, "ProfileScreen">;


const Profile: React.FC<Props> = () => {
    const [activeTab, setActiveTab] = useState<'tasks' | 'history' | 'profile'>('profile');

    const profile: WorkerProfile = {
        id: '1',
        name: 'Alex Rivera',
        workerId: '#WRK-9921',
        avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCC7vIstZZKJvGDIijThBCxYRyRCt2N6jwXBjh4BK9xQEjtoTlUNrbuZGOZuh7Ouvmnx9K8Vg7IZvNRUNv2J3hRsbuPMMwBxe0qmoL_YLEmBapoLT6WMBakBA1K9lU0ehA-RgGiHbWTzR_7BIc5_3tcuNBjOh2OpSgeemhuRohO-Z4Hzdih3YTRAzTRSyByfpThrxaIt3dx3zh-RgzDTw-Wc-60tu0b0kdIMLYaxvonQB5hAhj_xJWEEvBnx6EK3Ngncw4sj1DZVQdN',
        totalTasks: 128,
        successRate: '98%',
        email: 'a.rivera@fieldlink.com',
        phone: '+1 (555) 012-3456',
        department: 'Maintenance & Logistics',
        joinedDate: 'March 2023',
        isVerified: true,
    };

    const handleGoBack = () => {
        console.log('Go back pressed');
        // Implement navigation back logic here
    };

    const handleEdit = () => {
        console.log('Edit pressed');
        // Implement edit profile logic here
    };

    const handleAccountSettings = () => {
        console.log('Account Settings pressed');
        // Implement navigation to settings
    };

    const handleSupport = () => {
        console.log('Support pressed');
        // Implement navigation to support
    };

    const handleLogout = () => {
        console.log('Logout pressed');
        // Implement logout logic here
    };

    return (
        <View className="flex-1 bg-background-light light:bg-background-light">
            <StatusBar barStyle="light-content" />

            {/* iOS Status Bar Spacer */}
            <View className="h-12 w-full bg-background-light light:bg-background-light flex-row items-center justify-between px-6">
                <Text className="text-sm font-semibold light:text-white">9:41</Text>
                <View className="flex-row gap-1.5 items-center">
                    <Icon name="cellular" size={14} color="#000000" />
                    <Icon name="wifi" size={14} color="#000000" />
                    <Icon name="battery-full" size={14} color="#000000" />
                </View>
            </View>

            {/* Header Navigation */}
            <View className="px-4 py-2 flex-row items-center justify-between bg-background-light/80 light:bg-background-light/80">
                <TouchableOpacity className="flex-row items-center" onPress={handleGoBack}>
                    <Icon name="chevron-back" size={24} color="#136dec" />
                    <Text className="font-medium text-primary">Tasks</Text>
                </TouchableOpacity>
                <Text className="text-lg font-bold light:text-white">Profile</Text>
                <TouchableOpacity onPress={handleEdit}>
                    <Text className="text-primary font-medium">Edit</Text>
                </TouchableOpacity>
            </View>

            <ScrollView
                className="flex-1 px-4"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 100 }}
            >
                {/* Profile Identity Section */}
                <View className="flex flex-col items-center mt-8 mb-10">
                    <View className="relative">
                        <View className="w-28 h-28 rounded-full overflow-hidden border-4 border-white light:border-slate-800 shadow-xl">
                            <Image
                                source={{ uri: profile.avatar }}
                                className="w-full h-full"
                                resizeMode="cover"
                            />
                        </View>
                        {profile.isVerified && (
                            <View className="absolute bottom-1 right-1 bg-primary p-1.5 rounded-full border-2 border-white light:border-slate-800 flex items-center justify-center">
                                <Icon name="checkmark-circle" size={12} color="#ffffff" />
                            </View>
                        )}
                    </View>
                    <Text className="mt-4 text-2xl font-bold tracking-tight light:text-white">
                        {profile.name}
                    </Text>
                    <Text className="text-primary font-semibold text-sm mt-1 uppercase tracking-wider">
                        {profile.workerId}
                    </Text>
                </View>

                {/* Stats Grid */}
                <View className="flex-row gap-4 mb-8">
                    <View className="flex-1 bg-white light:bg-slate-800 p-5 rounded-xl shadow-sm border border-slate-100 light:border-slate-700 flex flex-col items-center justify-center">
                        <Text className="text-primary font-bold text-3xl">{profile.totalTasks}</Text>
                        <Text className="text-ios-gray light:text-slate-400 text-xs font-medium uppercase mt-1">
                            Total Tasks
                        </Text>
                    </View>
                    <View className="flex-1 bg-white light:bg-slate-800 p-5 rounded-xl shadow-sm border border-slate-100 light:border-slate-700 flex flex-col items-center justify-center">
                        <Text className="text-green-500 font-bold text-3xl">{profile.successRate}</Text>
                        <Text className="text-ios-gray light:text-slate-400 text-xs font-medium uppercase mt-1">
                            Success Rate
                        </Text>
                    </View>
                </View>

                {/* Information List */}
                <View className="mb-4">
                    <View className="bg-white light:bg-slate-800 rounded-xl shadow-sm border border-slate-100 light:border-slate-700 overflow-hidden">
                        {/* Email */}
                        <View className="px-4 py-3 border-b border-slate-50 light:border-slate-700/50 flex-row items-center justify-between">
                            <View className="flex-row items-center gap-3">
                                <View className="bg-primary/10 p-2 rounded-lg">
                                    <Icon name="mail-outline" size={20} color="#136dec" />
                                </View>
                                <View>
                                    <Text className="text-[10px] text-ios-gray light:text-slate-400 uppercase font-bold">
                                        Email
                                    </Text>
                                    <Text className="text-sm font-medium light:text-white">
                                        {profile.email}
                                    </Text>
                                </View>
                            </View>
                        </View>

                        {/* Phone */}
                        <View className="px-4 py-3 border-b border-slate-50 light:border-slate-700/50 flex-row items-center justify-between">
                            <View className="flex-row items-center gap-3">
                                <View className="bg-primary/10 p-2 rounded-lg">
                                    <Icon name="phone-portrait-outline" size={20} color="#136dec" />
                                </View>
                                <View>
                                    <Text className="text-[10px] text-ios-gray light:text-slate-400 uppercase font-bold">
                                        Phone
                                    </Text>
                                    <Text className="text-sm font-medium light:text-white">
                                        {profile.phone}
                                    </Text>
                                </View>
                            </View>
                        </View>

                        {/* Department */}
                        <View className="px-4 py-3 border-b border-slate-50 light:border-slate-700/50 flex-row items-center justify-between">
                            <View className="flex-row items-center gap-3">
                                <View className="bg-primary/10 p-2 rounded-lg">
                                    <Icon name="people-outline" size={20} color="#136dec" />
                                </View>
                                <View>
                                    <Text className="text-[10px] text-ios-gray light:text-slate-400 uppercase font-bold">
                                        Department
                                    </Text>
                                    <Text className="text-sm font-medium light:text-white">
                                        {profile.department}
                                    </Text>
                                </View>
                            </View>
                        </View>

                        {/* Joined Date */}
                        <View className="px-4 py-3 flex-row items-center justify-between">
                            <View className="flex-row items-center gap-3">
                                <View className="bg-primary/10 p-2 rounded-lg">
                                    <Icon name="calendar-outline" size={20} color="#136dec" />
                                </View>
                                <View>
                                    <Text className="text-[10px] text-ios-gray light:text-slate-400 uppercase font-bold">
                                        Joined
                                    </Text>
                                    <Text className="text-sm font-medium light:text-white">
                                        {profile.joinedDate}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Settings Links */}
                <View className="bg-white light:bg-slate-800 rounded-xl shadow-sm border border-slate-100 light:border-slate-700 overflow-hidden mb-4">
                    <TouchableOpacity
                        className="px-4 py-4 flex-row items-center justify-between active:bg-slate-50 light:active:bg-slate-700/50"
                        onPress={handleAccountSettings}
                        activeOpacity={0.7}
                    >
                        <View className="flex-row items-center gap-3">
                            <Icon name="settings-outline" size={20} color="#8e8e93" />
                            <Text className="font-medium text-sm light:text-white">Account Settings</Text>
                        </View>
                        <Icon name="chevron-forward" size={20} color="#8e8e93" />
                    </TouchableOpacity>

                    <TouchableOpacity
                        className="px-4 py-4 border-t border-slate-50 light:border-slate-700/50 flex-row items-center justify-between active:bg-slate-50 light:active:bg-slate-700/50"
                        onPress={handleSupport}
                        activeOpacity={0.7}
                    >
                        <View className="flex-row items-center gap-3">
                            <Icon name="help-circle-outline" size={20} color="#8e8e93" />
                            <Text className="font-medium text-sm light:text-white">Support &amp; Help</Text>
                        </View>
                        <Icon name="chevron-forward" size={20} color="#8e8e93" />
                    </TouchableOpacity>
                </View>

                {/* Logout Action */}
                <View className="mt-10 mb-6">
                    <TouchableOpacity
                        className="w-full py-4 bg-white light:bg-slate-800 rounded-xl shadow-sm border border-slate-100 light:border-slate-700 active:scale-[0.98]"
                        onPress={handleLogout}
                        activeOpacity={0.9}
                    >
                        <Text className="text-danger font-bold text-center">Log Out</Text>
                    </TouchableOpacity>
                </View>

                {/* App Footer */}
                <View className="items-center mb-6">
                    <Text className="text-[11px] text-ios-gray light:text-slate-500 font-medium">
                        FieldLink Worker App
                    </Text>
                    <Text className="text-[10px] text-ios-gray/60 light:text-slate-600">
                        v2.4.12 • Built with Efficiency
                    </Text>
                </View>
            </ScrollView>

            {/* Navigation Bar (iOS Style) */}
            <View className="bg-white/80 light:bg-slate-900/80 border-t border-slate-200 light:border-slate-800">
                <View className="flex-row justify-around items-center h-16">
                    <TouchableOpacity
                        className="flex flex-col items-center gap-0.5"
                        onPress={() => setActiveTab('tasks')}
                    >
                        <Icon
                            name="clipboard-outline"
                            size={24}
                            color={activeTab === 'tasks' ? '#136dec' : '#8e8e93'}
                        />
                        <Text
                            className={`text-[10px] font-medium ${activeTab === 'tasks' ? 'text-primary' : 'text-ios-gray light:text-slate-500'
                                }`}
                        >
                            Tasks
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        className="flex flex-col items-center gap-0.5"
                        onPress={() => setActiveTab('history')}
                    >
                        <Icon
                            name="time-outline"
                            size={24}
                            color={activeTab === 'history' ? '#136dec' : '#8e8e93'}
                        />
                        <Text
                            className={`text-[10px] font-medium ${activeTab === 'history' ? 'text-primary' : 'text-ios-gray light:text-slate-500'
                                }`}
                        >
                            History
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        className="flex flex-col items-center gap-0.5"
                        onPress={() => setActiveTab('profile')}
                    >
                        <Icon
                            name="person"
                            size={24}
                            color={activeTab === 'profile' ? '#136dec' : '#8e8e93'}
                        />
                        <Text
                            className={`text-[10px] font-medium ${activeTab === 'profile' ? 'text-primary' : 'text-ios-gray light:text-slate-500'
                                }`}
                        >
                            Profile
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* iOS Home Indicator */}
            <View className="h-1.5 w-32 bg-slate-300 light:bg-slate-700 rounded-full mx-auto mb-2 mt-4 opacity-50" />
        </View>
    );
}

export default Profile