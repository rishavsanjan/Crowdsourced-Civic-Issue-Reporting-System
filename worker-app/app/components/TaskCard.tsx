import React from 'react'
import { Image, Text, TouchableOpacity, View } from 'react-native';
import Icon from '@react-native-vector-icons/ionicons';
import { Jobs } from '../types/job';
import { getStatusBadge } from '../utils/StatusBadge';

interface Props {
    task: Jobs
}
const TaskCard: React.FC<Props> = ({ task }) => {
    const isCompleted = task.status === 'completed';
    const isInProgress = task.status === 'in-progress';

    return (
        <TouchableOpacity
            key={task.complaint_id}
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
                            {task.address}
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
    )
}

export default TaskCard