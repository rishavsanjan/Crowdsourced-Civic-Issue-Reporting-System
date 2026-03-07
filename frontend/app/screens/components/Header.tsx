import React from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import { Ionicons } from '@react-native-vector-icons/ionicons';
import { useTheme } from '@/app/context/theme-context';
import { useRouter } from 'expo-router';

interface Props {
    tabName: string
    goBack?: boolean
}

const Header: React.FC<Props> = ({ tabName, goBack }) => {
    const { mode } = useTheme();
    const router = useRouter();
    return (
        <View className="bg-white/80 light:bg-background-light/80 border-b border-slate-200 light:border-slate-800 dark:bg-[#101922]">
            <View className="flex-row items-center p-2 justify-between">
                <TouchableOpacity
                    onPress={() => {
                        if (!goBack)
                            return
                        router.back()
                    }}
                    className="flex  items-center justify-center rounded-full w-10 h-10"
                >
                    {
                        goBack &&
                        <Ionicons
                            className=''
                            name='arrow-back' color={`${mode === 'light' ? 'black' : 'white'}`} size={25} />

                    }
                </TouchableOpacity>
                <Text className="text-slate-900 light:text-slate-100 text-lg font-bold flex-1 text-center dark:text-white">
                    {tabName}
                </Text>
                <View className="flex w-10 items-center justify-end">
                    <View
                        className="flex w-10 h-10 items-center justify-center rounded-full"
                    >
                    </View>
                </View>
            </View>

        </View>
    )
}

export default Header