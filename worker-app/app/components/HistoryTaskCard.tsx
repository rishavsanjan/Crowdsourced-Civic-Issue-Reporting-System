import React from 'react'
import { Image, Text, TouchableOpacity, View } from 'react-native';
import Icon from '@react-native-vector-icons/ionicons';

interface Props {
    task: HistoryTask
    onPress: () => void;

}

interface HistoryTask {
    id: string;
    name: string;
    status: 'completed' | 'pending' | 'failed';
    completedAt: string;
    image: string;
    hasEvidence: boolean;
}

const HistoryTaskCard: React.FC<Props> = ({ task, onPress }) => {

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

    const handleViewEvidence = (taskId: string) => {
        console.log('View evidence for task:', taskId);
        // Navigate to evidence view
    };

    const handleViewDetails = (taskId: string) => {
        console.log('View details for task:', taskId);
        // Navigate to task details
    };
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
                        {task.name}
                    </Text>
                    <View className="flex-row items-center gap-1">
                        <Icon name="calendar-outline" size={14} color="#94a3b8" />
                        <Text className="text-slate-500 light:text-slate-400 text-xs">
                            Completed {task.completedAt} • {task.completedAt}
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
export default HistoryTaskCard