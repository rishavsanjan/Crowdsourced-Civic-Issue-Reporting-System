import React from 'react'
import { Text, View } from 'react-native'
import Icon from '@react-native-vector-icons/ionicons';

interface Props{
    address : string
}

const WorkLocation:React.FC<Props> = ({address}) => {
    return (
        <View className="bg-white light:bg-slate-900 rounded-xl p-4 shadow-sm border border-slate-200 light:border-slate-800">
            <View className="flex-row items-center gap-3">
                <View className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Icon name="location" size={20} color="#136dec" />
                </View>
                <View className="flex-1">
                    <Text className="font-semibold light:text-white">
                        {address}
                    </Text>

                </View>
            </View>
        </View>
    )
}

export default WorkLocation