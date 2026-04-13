import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Switch } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import type { RootStackParamList } from '../../navigation/navigation';
import { useTranslation } from 'react-i18next';
import i18n from '../../i18n/i18n';
import { saveLanguage, getSavedLanguage } from '@/app/i18n/language_storage';
import { useTheme } from '@/app/context/theme-context';
import Header from '../components/Header';
type Props = NativeStackScreenProps<RootStackParamList, 'Settings'>;

const Settings: React.FC<Props> = ({ navigation }) => {
    const [pushNotifications, setPushNotifications] = useState(true);
    const [selectedLanguage, setSelectedLanguage] = useState('english');
    const { t } = useTranslation();
    const { setTheme, mode } = useTheme();

    const getLang = async () => {
        const lang = await getSavedLanguage();
        if (lang === "hi") {
            setSelectedLanguage('hindi')
        } else if (lang === "mr") {
            setSelectedLanguage("marathi")
        } else if (lang === "ta") {
            setSelectedLanguage("tamil")
        } else if (lang === "pa") {
            setSelectedLanguage("punjabi")
        } else if (lang === "ur") {
            setSelectedLanguage("urdu")
        } else if (lang === "sa") {
            setSelectedLanguage("sanskirit")
        }else {
            setSelectedLanguage('english')
        }

    }

    useEffect(() => {
        getLang();
    }, []);


    const changeLanguage = async (lang: 'en' | 'hi' | 'mr' | 'ta' | 'pa' | 'ur' | 'sa') => {
        i18n.changeLanguage(lang);
        await saveLanguage(lang);
        //setSelectedLanguage(lang === 'en' ? 'english' : lang === 'ma' ? );
    };

    return (
        <View className="flex-1 bg-[#f6f7f8] dark:bg-[#101922]">
            {/* Header */}

            <Header goBack tabName='Settings' />


            {/* Main Content */}
            <ScrollView className="flex-1 p-4">
                <View className="space-y-8">
                    {/* Notifications Section */}
                    <View>
                        <Text className="mb-2 text-sm font-bold uppercase text-slate-500 dark:text-slate-400">
                            Notifications
                        </Text>
                        <View className="rounded-lg bg-white dark:bg-slate-900/70 shadow-sm">
                            <View className="flex-row items-center justify-between p-4">
                                <View className="flex-1">
                                    <Text className="font-medium text-slate-800 dark:text-slate-200">
                                        Push Notifications
                                    </Text>
                                    <Text className="text-sm text-slate-500 dark:text-slate-400">
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
                        <Text className="mb-2 text-sm font-bold uppercase text-slate-500 dark:text-slate-400">
                            Language
                        </Text>
                        <View className="rounded-lg bg-white dark:bg-slate-900/70 shadow-sm">
                            <TouchableOpacity
                                className="flex-row items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800"
                                onPress={() => {
                                    changeLanguage('en');
                                    setSelectedLanguage('english')
                                }}
                            >
                                <Text className="text-slate-800 dark:text-slate-200">English</Text>
                                <View className={`h-5 w-5 rounded-full border-2 items-center justify-center ${selectedLanguage === 'english'
                                    ? 'border-[#1173d4]'
                                    : 'border-slate-300 dark:border-slate-600'
                                    }`}>
                                    {selectedLanguage === 'english' && (
                                        <View className="h-3 w-3 rounded-full bg-[#1173d4]" />
                                    )}
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity
                                className="flex-row items-center justify-between p-4 dark:border-slate-800 border-slate-200 border-b"
                                onPress={() => {
                                    changeLanguage('hi');
                                    setSelectedLanguage('hindi')
                                }}
                            >
                                <Text className="text-slate-800 dark:text-slate-200">हिंदी</Text>
                                <View className={`h-5 w-5 rounded-full border-2 items-center justify-center ${selectedLanguage === 'hindi'
                                    ? 'border-[#1173d4]'
                                    : 'border-slate-300 dark:border-slate-600'
                                    }`}>
                                    {selectedLanguage === 'hindi' && (
                                        <View className="h-3 w-3 rounded-full bg-[#1173d4]" />
                                    )}
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity
                                className="flex-row items-center justify-between p-4 dark:border-slate-800 border-slate-200 border-b"
                                onPress={() => {
                                    changeLanguage('ta');
                                    setSelectedLanguage('tamil')
                                }}
                            >
                                <Text className="text-slate-800 dark:text-slate-200">தமிழ்</Text>
                                <View className={`h-5 w-5 rounded-full border-2 items-center justify-center ${selectedLanguage === 'hindi'
                                    ? 'border-[#1173d4]'
                                    : 'border-slate-300 dark:border-slate-600'
                                    }`}>
                                    {selectedLanguage === 'tamil' && (
                                        <View className="h-3 w-3 rounded-full bg-[#1173d4]" />
                                    )}
                                </View>
                            </TouchableOpacity>

                            <TouchableOpacity
                                className="flex-row items-center justify-between p-4 dark:border-slate-800 border-slate-200 border-b"
                                onPress={() => {
                                    changeLanguage('pa');
                                    setSelectedLanguage('punjabi')
                                }}
                            >
                                <Text className="text-slate-800 dark:text-slate-200">ਪੰਜਾਬੀ</Text>
                                <View className={`h-5 w-5 rounded-full border-2 items-center justify-center ${selectedLanguage === 'hindi'
                                    ? 'border-[#1173d4]'
                                    : 'border-slate-300 dark:border-slate-600'
                                    }`}>
                                    {selectedLanguage === 'punjabi' && (
                                        <View className="h-3 w-3 rounded-full bg-[#1173d4]" />
                                    )}
                                </View>
                            </TouchableOpacity>

                            <TouchableOpacity
                                className="flex-row items-center justify-between p-4 dark:border-slate-800 border-slate-200 border-b"
                                onPress={() => {
                                    changeLanguage('ur');
                                    setSelectedLanguage('urdu')
                                }}
                            >
                                <Text className="text-slate-800 dark:text-slate-200">اردو</Text>
                                <View className={`h-5 w-5 rounded-full border-2 items-center justify-center ${selectedLanguage === 'hindi'
                                    ? 'border-[#1173d4]'
                                    : 'border-slate-300 dark:border-slate-600'
                                    }`}>
                                    {selectedLanguage === 'urdu' && (
                                        <View className="h-3 w-3 rounded-full bg-[#1173d4]" />
                                    )}
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity
                                className="flex-row items-center justify-between p-4 dark:border-slate-800 border-slate-200 border-b"
                                onPress={() => {
                                    changeLanguage('sa');
                                    setSelectedLanguage('sanskirit')
                                }}
                            >
                                <Text className="text-slate-800 dark:text-slate-200">संस्कृत</Text>
                                <View className={`h-5 w-5 rounded-full border-2 items-center justify-center ${selectedLanguage === 'hindi'
                                    ? 'border-[#1173d4]'
                                    : 'border-slate-300 dark:border-slate-600'
                                    }`}>
                                    {selectedLanguage === 'sanskirit' && (
                                        <View className="h-3 w-3 rounded-full bg-[#1173d4]" />
                                    )}
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity
                                className="flex-row items-center justify-between p-4"
                                onPress={() => {
                                    changeLanguage('mr');
                                    setSelectedLanguage('marathi')
                                }}
                            >
                                <Text className="text-slate-800 dark:text-slate-200">मराठी</Text>
                                <View className={`h-5 w-5 rounded-full border-2 items-center justify-center ${selectedLanguage === 'hindi'
                                    ? 'border-[#1173d4]'
                                    : 'border-slate-300 dark:border-slate-600'
                                    }`}>
                                    {selectedLanguage === 'marathi' && (
                                        <View className="h-3 w-3 rounded-full bg-[#1173d4]" />
                                    )}
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Theme Section */}
                    <View>
                        <Text className="mb-2 text-sm font-bold uppercase text-slate-500 dark:text-slate-400">
                            Theme
                        </Text>
                        <View className="rounded-lg bg-white dark:bg-slate-900/70 shadow-sm">
                            <TouchableOpacity
                                className="flex-row items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800"
                                onPress={() => {
                                    setTheme('light')
                                }}
                            >
                                <Text className="text-slate-800 dark:text-slate-200">Light</Text>
                                <View className={`h-5 w-5 rounded-full border-2 items-center justify-center ${mode === 'light'
                                    ? 'border-[#1173d4]'
                                    : 'border-slate-300 dark:border-slate-600'
                                    }`}>
                                    {mode === 'light' && (
                                        <View className="h-3 w-3 rounded-full bg-[#1173d4]" />
                                    )}
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity
                                className="flex-row items-center justify-between p-4"
                                onPress={() => {
                                    setTheme('dark')
                                }}
                            >
                                <Text className="text-slate-800 dark:text-slate-200">Dark</Text>
                                <View className={`h-5 w-5 rounded-full border-2 items-center justify-center ${mode === 'dark'
                                    ? 'border-[#1173d4]'
                                    : 'border-slate-300 dark:border-slate-600'
                                    }`}>
                                    {mode === 'dark' && (
                                        <View className="h-3 w-3 rounded-full bg-[#1173d4]" />
                                    )}
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>


                </View>
            </ScrollView>

            {/* Footer */}
            <View className="p-4">
                <TouchableOpacity className="w-full rounded-lg bg-[#1173d4]/20 dark:bg-[#1173d4]/30 py-3 items-center">
                    <Text className="text-[#1173d4] font-bold">{t('logout')}</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

export default Settings;