import { Complaint } from '@/app/types/complain'
import React from 'react'
import { Image, Text, View } from 'react-native'

interface Props{
    status : "pending" | "in_progress" | "resolved"
}

const Status:React.FC<Props> = ({status}) => {
    return (
        <View className="px-4 pb-4">
            <Text className="text-lg font-bold text-gray-900 mb-3">Status</Text>
            <View className="flex-row items-center">
                {/* Pending */}
                <View className="flex-1 items-center">
                    <View>
                        <Image style={{ width: 30, height: 30 }} source={{ uri: 'https://img.icons8.com/?size=100&id=12582&format=png&color=228BE6' }} />
                    </View>
                    <Text className="text-xs text-gray-600">Pending</Text>
                </View>

                {/* Progress Line */}
                <View className={`${status === 'pending' ? 'bg-gray-300' : 'bg-green-500 '} h-1 flex-1 -mt-6`} />

                {/* In Progress */}
                <View className="flex-1 items-center">
                    <View className=" mb-2">
                        <Image style={{ width: 30, height: 30 }} source={{ uri: 'https://img.icons8.com/?size=100&id=71202&format=png&color=228BE6' }} />
                    </View>
                    <Text className="text-xs text-gray-600">In Progress</Text>
                </View>

                {/* Progress Line */}
                <View className={`${status === 'pending' || 'in_progress' ? 'bg-gray-300' : 'bg-green-500 '} h-1 flex-1 -mt-6`} />
                {/* Resolved */}
                <View className="flex-1 items-center">
                    <View className=" mb-2">
                        <Image style={{ width: 30, height: 30 }} source={{ uri: 'https://img.icons8.com/?size=100&id=gWpFZsHoozrx&format=png&color=40C057' }} />
                    </View>
                    <Text className="text-xs text-gray-600">Resolved</Text>
                </View>
            </View>
        </View>
    )
}

export default Status