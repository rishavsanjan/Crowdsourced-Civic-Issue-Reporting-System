import React from 'react'
import { Text, View } from 'react-native'
import { JobDetails } from '../types/job'
import Icon from '@react-native-vector-icons/ionicons';

interface Props {
    instructions : string[]
}

const AdminInstructions:React.FC<Props> = ({instructions}) => {
    return (
        <View className="bg-primary/5 light:bg-primary/10 rounded-xl p-4 border border-primary/20 mb-6">
            <View className="flex-row items-center gap-2 mb-3">
                <Icon name="clipboard-outline" size={20} color="#136dec" />
                <Text className="text-sm font-bold text-primary uppercase tracking-widest">
                    Admin Instructions
                </Text>
            </View>
            <View className="space-y-3">
                {instructions.map((instruction, index) => (
                    <View key={index} className="flex-row gap-3 mb-3">
                        <Text className="text-primary font-bold">{index + 1}.</Text>
                        <Text className="text-slate-700 light:text-slate-300 flex-1">
                            {instruction}
                        </Text>
                    </View>
                ))}
            </View>
        </View>
    )
}

export default AdminInstructions