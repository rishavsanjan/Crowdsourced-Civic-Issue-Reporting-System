import React from 'react'
import { Text, TouchableOpacity, View } from 'react-native';
import Icon from '@react-native-vector-icons/ionicons';
import { Jobs } from '../types/job';
import { getStatusBadge } from '../utils/StatusBadge';
import { formatDate } from '../utils/date';

interface Props {
    task: Jobs
    onPress: () => void;

}
const TaskCard: React.FC<Props> = ({ task, onPress }) => {
    const isCompleted = task.workerWorkStatus === 'completed';
    const isPending = task.workerWorkStatus === 'pending';

    return (
        <TouchableOpacity
            onPress={onPress}

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
                {getStatusBadge(task.workerWorkStatus)}
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

            {/* Location and Time  */}
            {!isCompleted && (
                <View className="flex-col gap-2 mb-0">
                    <View className="flex-row items-center">
                        <Icon
                            name="location-outline"
                            size={16}
                            color={isPending ? '#136dec' : '#cbd5e1'}
                        />
                        <Text className="text-slate-400 light:text-slate-500 text-xs font-medium ml-1.5">
                            {task.address}
                        </Text>
                    </View>
                    <View className="flex-row items-center">
                        <Icon
                            name="time-outline"
                            size={16}
                            color={isPending ? '#136dec' : '#cbd5e1'}
                        />
                        <Text className="text-slate-400 light:text-slate-500 text-xs font-medium ml-1.5">
                            Assigned at: {formatDate(task.workAssignedAt)}
                        </Text>
                    </View>
                </View>
            )}

        </TouchableOpacity>
    )
}

export default TaskCard