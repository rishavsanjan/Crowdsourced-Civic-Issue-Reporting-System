import React from 'react'
import { Text, View } from 'react-native'

interface Props {
    totalTasks: number
    successRate: string
}

const ProfileStats: React.FC<Props> = ({totalTasks, successRate}) => {
    return (
        <View className="flex-row gap-4 mb-8">
            <View className="flex-1 bg-white light:bg-slate-800 p-5 rounded-xl shadow-sm border border-slate-100 light:border-slate-700 flex flex-col items-center justify-center">
                <Text className="text-primary font-bold text-3xl">{totalTasks || 0}</Text>
                <Text className="text-ios-gray light:text-slate-400 text-xs font-medium uppercase mt-1">
                    Total Tasks
                </Text>
            </View>
            <View className="flex-1 bg-white light:bg-slate-800 p-5 rounded-xl shadow-sm border border-slate-100 light:border-slate-700 flex flex-col items-center justify-center">
                <Text className="text-green-500 font-bold text-3xl">{successRate}</Text>
                <Text className="text-ios-gray light:text-slate-400 text-xs font-medium uppercase mt-1">
                    Successfully Done
                </Text>
            </View>
        </View>
    )
}

export default ProfileStats