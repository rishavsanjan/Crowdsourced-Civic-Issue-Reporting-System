import { ProfileData } from '@/app/types/profileData';
import { useTranslation } from 'react-i18next';
import {  Text, View } from 'react-native'

interface Props {
    data: ProfileData | undefined
}

const UserStats: React.FC<Props> = ({ data }) => {
    const { t } = useTranslation();
    return (
        <View className="bg-white dark:bg-slate-900/70 mx-4 rounded-lg p-4 mb-4 shadow-sm">
            <View className="flex-row justify-around">
                <View className="items-center flex">
                    <Text className="text-2xl font-bold dark:text-slate-200">{data?.user?.Complaint.length || 0}</Text>
                    <Text className="text-gray-500 text-base dark:text-slate-200">{t('submitted')}</Text>
                </View>
                <View className="items-center">
                    <Text className="text-2xl font-bold dark:text-slate-200">{data?.resolvedReports.length}</Text>
                    <Text className="text-gray-500 text-base dark:text-slate-200">{t('resolved')}</Text>
                </View>
                <View className="items-center">
                    <Text className="text-2xl font-bold dark:text-slate-200">{0}</Text>
                    <Text className="text-gray-500 text-base dark:text-slate-200">{t('badges')}</Text>
                </View>
            </View>
        </View>
    )
}

export default UserStats