import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Switch } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import type { RootStackParamList } from '../../navigation/navigation';
import { useTranslation } from 'react-i18next';
import i18n from '../../i18n/i18n';
import { saveLanguage, getSavedLanguage } from '@/app/i18n/language_storage';
import { useTheme } from '@/app/context/theme-context';
import Header from '../components/Header';
import { useAuth } from '@/app/context/auth-context';
type Props = NativeStackScreenProps<RootStackParamList, 'Settings'>;

type LanguageProps = {
    key: string
    label: string
    code: 'en' | 'hi' | 'mr' | 'ta' | 'pa' | 'ur' | 'sa' | 'gu'
}

const Settings: React.FC<Props> = ({ navigation }) => {
    const [selectedLanguage, setSelectedLanguage] = useState('english');
    const { t } = useTranslation();
    const { setTheme, mode } = useTheme();
    const { logout } = useAuth();
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
        } else if (lang === "gu") {
            setSelectedLanguage("gujurati")
        } else {
            setSelectedLanguage('english')
        }

    }

    const languages: LanguageProps[] = [
        { key: 'english', label: 'English', code: 'en' },
        { key: 'hindi', label: 'हिंदी', code: 'hi' },
        { key: 'tamil', label: 'தமிழ்', code: 'ta' },
        { key: 'punjabi', label: 'ਪੰਜਾਬੀ', code: 'pa' },
        { key: 'urdu', label: 'اردو', code: 'ur' },
        { key: 'sanskrit', label: 'संस्कृत', code: 'sa' },
        { key: 'gujarati', label: 'ગુજરાતી', code: 'gu' },
        { key: 'marathi', label: 'मराठी', code: 'mr' },
    ];

    useEffect(() => {
        getLang();
    }, []);


    const changeLanguage = async (lang: 'en' | 'hi' | 'mr' | 'ta' | 'pa' | 'ur' | 'sa' | 'gu') => {
        i18n.changeLanguage(lang);
        await saveLanguage(lang);
        //setSelectedLanguage(lang === 'en' ? 'english' : lang === 'ma' ? );
    };

    return (
        <View className="flex-1 bg-[#f6f7f8] dark:bg-[#101922]">
            {/* Header */}

            <Header goBack tabName='Settings' />


            {/* Main Content */}
            <ScrollView className="flex-1 p-4 ">
                <View className=" gap-4">

                    {/* Language Section */}
                    <View>
                        <Text className="mb-2 text-sm font-bold uppercase text-slate-500 dark:text-slate-400">
                            Language
                        </Text>
                        <View className="rounded-lg bg-white dark:bg-slate-900/70 shadow-sm">
                            {
                                languages.map((language) => {
                                    return (
                                        <TouchableOpacity
                                            key={language.key}
                                            className="flex-row items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800"
                                            onPress={() => {
                                                changeLanguage(language.code);
                                                setSelectedLanguage(language.key)
                                            }}
                                        >
                                            <Text className="text-slate-800 dark:text-slate-200">{language.label}</Text>
                                            <View className={`h-5 w-5 rounded-full border-2 items-center justify-center ${selectedLanguage === `${language.key}`
                                                ? 'border-[#1173d4]'
                                                : 'border-slate-300 dark:border-slate-600'
                                                }`}>
                                                {selectedLanguage === `${language.key}` && (
                                                    <View className="h-3 w-3 rounded-full bg-[#1173d4]" />
                                                )}
                                            </View>
                                        </TouchableOpacity>
                                    )
                                })
                            }

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
                <TouchableOpacity
                    onPress={() => {
                        logout()
                        navigation.navigate('WelcomeLoginScreen')
                    }}
                    className="w-full rounded-lg bg-[#1173d4]/20 dark:bg-[#1173d4]/30 py-3 items-center">
                    <Text className="text-[#1173d4] font-bold">{t('logout')}</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

export default Settings;