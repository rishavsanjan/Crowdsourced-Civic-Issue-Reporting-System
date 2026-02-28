import React from 'react'
import { Image, Text, View } from 'react-native'
import Icon from '@react-native-vector-icons/ionicons';

interface Props {
    name : string
    id : string
}

const ProfileIdenity:React.FC<Props> = ({name, id}) => {
    return (
        <View className="flex flex-col items-center mt-8 mb-10">
            <View className="relative">
                <View className="w-28 h-28 rounded-full overflow-hidden border-4 border-white light:border-slate-800 shadow-xl">
                    <Image
                        source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCC7vIstZZKJvGDIijThBCxYRyRCt2N6jwXBjh4BK9xQEjtoTlUNrbuZGOZuh7Ouvmnx9K8Vg7IZvNRUNv2J3hRsbuPMMwBxe0qmoL_YLEmBapoLT6WMBakBA1K9lU0ehA-RgGiHbWTzR_7BIc5_3tcuNBjOh2OpSgeemhuRohO-Z4Hzdih3YTRAzTRSyByfpThrxaIt3dx3zh-RgzDTw-Wc-60tu0b0kdIMLYaxvonQB5hAhj_xJWEEvBnx6EK3Ngncw4sj1DZVQdN' }}
                        className="w-full h-full"
                        resizeMode="cover"
                    />
                </View>
                {true && (
                    <View className="absolute bottom-1 right-1 bg-primary p-1.5 rounded-full border-2 border-white light:border-slate-800 flex items-center justify-center">
                        <Icon name="checkmark-circle" size={12} color="#ffffff" />
                    </View>
                )}
            </View>
            <Text className="mt-4 text-2xl font-bold tracking-tight light:text-white">
                {name}
            </Text>
            <Text className="text-primary font-semibold text-sm mt-1 uppercase tracking-wider">
                #{id}
            </Text>
        </View>
    )
}

export default ProfileIdenity