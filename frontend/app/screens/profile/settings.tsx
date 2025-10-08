import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Switch } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import type { RootStackParamList } from '../../navigation/navigation';
import API_BASE_IP from '../../../config/api';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import i18n from '../../i18n/i18n';
import { saveLanguage } from '@/app/i18n/language_storage';
import { getSavedLanguage } from '@/app/i18n/language_storage';
type Props = NativeStackScreenProps<RootStackParamList, 'Settings'>;

const Settings: React.FC<Props> = ({ navigation }) => {
    const [pushNotifications, setPushNotifications] = useState(true);
    const [selectedLanguage, setSelectedLanguage] = useState('english');
    const { t } = useTranslation();

    const getLang = async () => {
        const lang = await getSavedLanguage();
        lang === 'hi' ? setSelectedLanguage('hindi') : setSelectedLanguage('english');
    }

    useEffect(() => {
        getLang();
    }, []);


    const changeLanguage = async (lang: 'en' | 'hi') => {
        i18n.changeLanguage(lang); // instantly changes language
        await saveLanguage(lang);  // saves selection to AsyncStorage
        setSelectedLanguage(lang === 'en' ? 'english' : 'hindi');
    };

    return (
        <View className="flex-1 bg-[#f6f7f8] light:bg-[#101922]">
            {/* Header */}
            <View className="border-b border-slate-200 light:border-slate-800 bg-[#f6f7f8] light:bg-[#101922] p-4 flex-row items-center justify-between">
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color="#000" />
                </TouchableOpacity>
                <Text className="text-lg font-bold text-slate-800 light:text-slate-200">Settings</Text>
                <View className="w-10" />
            </View>

            {/* Main Content */}
            <ScrollView className="flex-1 p-4">
                <View className="space-y-8">
                    {/* Notifications Section */}
                    <View>
                        <Text className="mb-2 text-sm font-bold uppercase text-slate-500 light:text-slate-400">
                            Notifications
                        </Text>
                        <View className="rounded-lg bg-white light:bg-slate-900/70 shadow-sm">
                            <View className="flex-row items-center justify-between p-4">
                                <View className="flex-1">
                                    <Text className="font-medium text-slate-800 light:text-slate-200">
                                        Push Notifications
                                    </Text>
                                    <Text className="text-sm text-slate-500 light:text-slate-400">
                                        Receive updates on your reports.
                                    </Text>
                                </View>
                                <Switch
                                    value={pushNotifications}
                                    onValueChange={setPushNotifications}
                                    trackColor={{ false: '#cbd5e1', true: '#1173d4' }}
                                    thumbColor="#ffffff"
                                />
                            </View>
                        </View>
                    </View>

                    {/* Language Section */}
                    <View>
                        <Text className="mb-2 text-sm font-bold uppercase text-slate-500 light:text-slate-400">
                            Language
                        </Text>
                        <View className="rounded-lg bg-white light:bg-slate-900/70 shadow-sm">
                            <TouchableOpacity
                                className="flex-row items-center justify-between p-4 border-b border-slate-200 light:border-slate-800"
                                onPress={() => {
                                    changeLanguage('en');
                                    setSelectedLanguage('english')
                                }}
                            >
                                <Text className="text-slate-800 light:text-slate-200">English</Text>
                                <View className={`h-5 w-5 rounded-full border-2 items-center justify-center ${selectedLanguage === 'english'
                                    ? 'border-[#1173d4]'
                                    : 'border-slate-300 light:border-slate-600'
                                    }`}>
                                    {selectedLanguage === 'english' && (
                                        <View className="h-3 w-3 rounded-full bg-[#1173d4]" />
                                    )}
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity
                                className="flex-row items-center justify-between p-4"
                                onPress={() => {
                                    changeLanguage('hi');
                                    setSelectedLanguage('hindi')
                                }}
                            >
                                <Text className="text-slate-800 light:text-slate-200">हिंदी</Text>
                                <View className={`h-5 w-5 rounded-full border-2 items-center justify-center ${selectedLanguage === 'hindi'
                                    ? 'border-[#1173d4]'
                                    : 'border-slate-300 light:border-slate-600'
                                    }`}>
                                    {selectedLanguage === 'hindi' && (
                                        <View className="h-3 w-3 rounded-full bg-[#1173d4]" />
                                    )}
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Privacy & Account Section */}
                    <View>
                        <Text className="mb-2 text-sm font-bold uppercase text-slate-500 light:text-slate-400">
                            Privacy & Account
                        </Text>
                        <View className="rounded-lg bg-white light:bg-slate-900/70 shadow-sm">
                            <TouchableOpacity className="flex-row items-center justify-between p-4 border-b border-slate-200 light:border-slate-800">
                                <View className="flex-1">
                                    <Text className="font-medium text-slate-800 light:text-slate-200">
                                        Privacy Settings
                                    </Text>
                                    <Text className="text-sm text-slate-500 light:text-slate-400">
                                        Control who can see your profile.
                                    </Text>
                                </View>
                                <TouchableOpacity onPress={() => navigation.goBack()}>
                                    <Ionicons name="arrow-forward-outline" size={24} color="#000" />
                                </TouchableOpacity>
                            </TouchableOpacity>
                            <TouchableOpacity className="flex-row items-center justify-between p-4">
                                <View className="flex-1">
                                    <Text className="font-medium text-slate-800 light:text-slate-200">
                                        Account Management
                                    </Text>
                                    <Text className="text-sm text-slate-500 light:text-slate-400">
                                        Manage your account details.
                                    </Text>
                                </View>
                                <TouchableOpacity onPress={() => navigation.goBack()}>
                                    <Ionicons name="arrow-forward-outline" size={24} color="#000" />
                                </TouchableOpacity>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </ScrollView>

            {/* Footer */}
            <View className="p-4">
                <TouchableOpacity className="w-full rounded-lg bg-[#1173d4]/20 light:bg-[#1173d4]/30 py-3 items-center">
                    <Text className="text-[#1173d4] font-bold">{t('logout')}</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

export default Settings;