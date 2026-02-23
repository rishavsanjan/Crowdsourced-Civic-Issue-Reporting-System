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


interface Task {
    id: string;
    title: string;
    description: string;
    status: 'in-progress' | 'pending' | 'completed';
    location: string;
    dueTime: string;
    isPriority?: boolean;
    hasEvidence?: boolean;
    teamMember?: string;
}

type Props = NativeStackScreenProps<RootStackParamList, "HomeScreen">;


const WorkerHomeScreen: React.FC<Props> = () => {
    const [activeTab, setActiveTab] = useState<'tasks' | 'map' | 'history' | 'settings'>('tasks');

    const tasks: Task[] = [
        {
            id: '1',
            title: 'Repair HVAC Unit - Server Room 2',
            description: 'Filter replacement and general maintenance of the cooling system.',
            status: 'in-progress',
            location: 'Building B, 3rd Floor - South Wing',
            dueTime: '11:30 AM (Priority)',
            isPriority: true,
            teamMember: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD_M9hJHr4ijrDENUKQ93EI8jPEM7H1gVEe_aVVvDoKrB5Mq5JM1n7TfM6OWphWY4sRS80qTTRT7OCUkPZtknyufgk7cB1DqG8e6eYXSB5_pF50UpxecUqAAiqEPB8n1xYSUHRUu6qukseU49R3wJDagwQWITWwarI5SMvik0_bKKdpgJEhQQqfhzyuEP_BK4f1tNT0n954sZqCq5ygh80BvrMA2Y1MMgZLGeKAVAeWtURUzq8ok9lImSZ-opNAoX-w-VpHJjY9x4h5',
        },
        {
            id: '2',
            title: 'Network Cable Management',
            description: 'Tidy up the server racks and label all incoming fiber connections.',
            status: 'pending',
            location: 'Data Center A, Rack 4-12',
            dueTime: '2:00 PM',
        },
        {
            id: '3',
            title: 'Check Emergency Lighting',
            description: 'Monthly inspection of all fire exit signs and emergency battery packs.',
            status: 'completed',
            location: 'All Floors',
            dueTime: 'Completed',
            hasEvidence: true,
        },
        {
            id: '4',
            title: 'Water Leak Inspection',
            description: 'Reported leak near the pantry area on Level 4.',
            status: 'pending',
            location: 'Level 4, Pantry Zone',
            dueTime: '4:30 PM',
        },
    ];

    const getStatusBadge = (status: Task['status']) => {
        switch (status) {
            case 'in-progress':
                return (
                    <View className="shrink-0 px-2.5 py-1 rounded-full bg-primary/10 border border-primary/20">
                        <Text className="text-[11px] font-bold uppercase tracking-wider text-primary">
                            In Progress
                        </Text>
                    </View>
                );
            case 'pending':
                return (
                    <View className="shrink-0 px-2.5 py-1 rounded-full bg-amber-100 border border-amber-200 light:bg-amber-900/30 light:border-amber-800">
                        <Text className="text-[11px] font-bold uppercase tracking-wider text-amber-700 light:text-amber-400">
                            Pending
                        </Text>
                    </View>
                );
            case 'completed':
                return (
                    <View className="shrink-0 px-2.5 py-1 rounded-full bg-emerald-100 border border-emerald-200 light:bg-emerald-900/30 light:border-emerald-800">
                        <Text className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 light:text-emerald-400">
                            Completed
                        </Text>
                    </View>
                );
        }
    };

    const renderTaskCard = (task: Task) => {
        const isCompleted = task.status === 'completed';
        const isInProgress = task.status === 'in-progress';

        return (
            <TouchableOpacity
                key={task.id}
                className={`rounded-xl p-4 shadow-sm mb-4 active:scale-[0.98] ${isCompleted
                        ? 'bg-white/60 light:bg-slate-900/60 border border-slate-100 light:border-slate-800 opacity-75'
                        : 'bg-white light:bg-slate-900 border border-slate-100 light:border-slate-800'
                    }`}
                activeOpacity={0.9}
            >
                {/* Header */}
                <View className="flex-row justify-between items-start mb-2">
                    <Text
                        className={`text-base font-semibold leading-tight pr-4 flex-1 ${isCompleted
                                ? 'text-slate-400 light:text-slate-500 line-through'
                                : 'text-slate-900 light:text-white'
                            }`}
                        numberOfLines={2}
                    >
                        {task.title}
                    </Text>
                    {getStatusBadge(task.status)}
                </View>

                {/* Description */}
                <Text
                    className={`text-sm mb-4 ${isCompleted
                            ? 'text-slate-400 light:text-slate-600'
                            : 'text-slate-500 light:text-slate-400'
                        }`}
                    numberOfLines={1}
                >
                    {task.description}
                </Text>

                {/* Location and Time (not shown for completed) */}
                {!isCompleted && (
                    <View className="flex-col gap-2 mb-0">
                        <View className="flex-row items-center">
                            <Icon
                                name="location-outline"
                                size={16}
                                color={isInProgress ? '#136dec' : '#cbd5e1'}
                            />
                            <Text className="text-slate-400 light:text-slate-500 text-xs font-medium ml-1.5">
                                {task.location}
                            </Text>
                        </View>
                        <View className="flex-row items-center">
                            <Icon
                                name="time-outline"
                                size={16}
                                color={isInProgress ? '#136dec' : '#cbd5e1'}
                            />
                            <Text className="text-slate-400 light:text-slate-500 text-xs font-medium ml-1.5">
                                Due: {task.dueTime}
                            </Text>
                        </View>
                    </View>
                )}

                {/* Completed Evidence Badge */}
                {isCompleted && task.hasEvidence && (
                    <View className="flex-row items-center">
                        <Icon name="checkmark-circle" size={16} color="#10b981" />
                        <Text className="text-emerald-500 light:text-emerald-400 text-xs font-bold ml-1.5">
                            Evidence Uploaded
                        </Text>
                    </View>
                )}

                {/* In Progress Footer */}
                {isInProgress && (
                    <View className="mt-4 pt-4 border-t border-slate-50 light:border-slate-800 flex-row justify-between items-center">
                        <View className="flex-row -space-x-2">
                            {task.teamMember && (
                                <View className="w-6 h-6 rounded-full bg-slate-200 border-2 border-white light:border-slate-900 overflow-hidden">
                                    <Image
                                        source={{ uri: task.teamMember }}
                                        className="w-full h-full"
                                        resizeMode="cover"
                                    />
                                </View>
                            )}
                        </View>
                        <TouchableOpacity className="bg-primary py-2 px-4 rounded-lg flex-row items-center gap-2">
                            <Icon name="camera-outline" size={16} color="#ffffff" />
                            <Text className="text-white text-xs font-bold">Evidence</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </TouchableOpacity>
        );
    };

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
                <ScrollView
                    className="flex-1 px-5 py-4"
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 120 }}
                >
                    {tasks.map((task) => renderTaskCard(task))}
                </ScrollView>

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