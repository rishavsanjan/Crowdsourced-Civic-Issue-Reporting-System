import React from 'react'
import { Text, View } from 'react-native'
import { formatToMonthYear } from '../utils/date'
import Icon from '@react-native-vector-icons/ionicons';

interface Props {
    phonenumber:string
    createdAt:string
}

const InformationList:React.FC<Props> = ({phonenumber, createdAt}) => {
    return (
        <View className="mb-4">
            <View className="bg-white light:bg-slate-800 rounded-xl shadow-sm border border-slate-100 light:border-slate-700 overflow-hidden">
                {/* Email */}
                {/* <View className="px-4 py-3 border-b border-slate-50 light:border-slate-700/50 flex-row items-center justify-between">
                                <View className="flex-row items-center gap-3">
                                    <View className="bg-primary/10 p-2 rounded-lg">
                                        <Icon name="mail-outline" size={20} color="#136dec" />
                                    </View>
                                    <View>
                                        <Text className="text-[10px] text-ios-gray light:text-slate-400 uppercase font-bold">
                                            Email
                                        </Text>
                                        <Text className="text-sm font-medium light:text-white">
                                            {profile.email}
                                        </Text>
                                    </View>
                                </View>
                            </View> */}

                {/* Phone */}
                <View className="px-4 py-3 border-b border-slate-50 light:border-slate-700/50 flex-row items-center justify-between">
                    <View className="flex-row items-center gap-3">
                        <View className="bg-primary/10 p-2 rounded-lg">
                            <Icon name="phone-portrait-outline" size={20} color="#136dec" />
                        </View>
                        <View>
                            <Text className="text-[10px] text-ios-gray light:text-slate-400 uppercase font-bold">
                                Phone
                            </Text>
                            <Text className="text-sm font-medium light:text-white">
                                {phonenumber}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Department */}
                <View className="px-4 py-3 border-b border-slate-50 light:border-slate-700/50 flex-row items-center justify-between">
                    <View className="flex-row items-center gap-3">
                        <View className="bg-primary/10 p-2 rounded-lg">
                            <Icon name="people-outline" size={20} color="#136dec" />
                        </View>
                        <View>
                            <Text className="text-[10px] text-ios-gray light:text-slate-400 uppercase font-bold">
                                Department
                            </Text>
                            <Text className="text-sm font-medium light:text-white">
                                To be Decided
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Joined Date */}
                <View className="px-4 py-3 flex-row items-center justify-between">
                    <View className="flex-row items-center gap-3">
                        <View className="bg-primary/10 p-2 rounded-lg">
                            <Icon name="calendar-outline" size={20} color="#136dec" />
                        </View>
                        <View>
                            <Text className="text-[10px] text-ios-gray light:text-slate-400 uppercase font-bold">
                                Joined
                            </Text>
                            <Text className="text-sm font-medium light:text-white">
                                {formatToMonthYear(createdAt)}
                            </Text>
                        </View>
                    </View>
                </View>
            </View>
        </View>
    )
}

export default InformationList