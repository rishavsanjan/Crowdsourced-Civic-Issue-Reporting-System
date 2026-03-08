import React, { SetStateAction } from 'react'
import { useTranslation } from 'react-i18next'
import { Text, TouchableOpacity, View } from 'react-native'

interface Props {
    selectedStatus: string
    setSelectedStatus: React.Dispatch<SetStateAction<string>>
}

const StatusFilterTab: React.FC<Props> = ({ selectedStatus, setSelectedStatus }) => {
    const { t } = useTranslation();
    return (
        <View className='flex flex-row justify-between mb-4 w-full px-4 mt-4'>
            <TouchableOpacity
                onPress={() => { setSelectedStatus('all') }}
                className={`${selectedStatus === 'all' ? 'bg-blue-600' : 'bg-[#DAE6F8] '} p-2 px-4 items-center rounded-2xl dark:bg-[#101922] dark:border-white dark:border`}
            >
                <Text className={`${selectedStatus === 'all' ? 'text-white' : 'text-blue-500'} font-medium`}>{t('all')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={() => { setSelectedStatus('pending') }}
                className={`${selectedStatus === 'pending' ? 'bg-blue-600' : 'bg-[#DAE6F8] '}  p-2 px-4 items-center rounded-2xl dark:bg-[#101922] dark:border-white dark:border`}
            >
                <Text className={`${selectedStatus === 'pending' ? 'text-white' : 'text-blue-500'} font-medium`}>{t('pending')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={() => { setSelectedStatus('in_progress') }}
                className={`${selectedStatus === 'in_progress' ? 'bg-blue-600' : 'bg-[#DAE6F8] '}  p-2 px-4 items-center rounded-2xl dark:bg-[#101922] dark:border-white dark:border`}
            >
                <Text className={`${selectedStatus === 'in_progress' ? 'text-white' : 'text-blue-500'} font-medium`}>{t('in_progress')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={() => { setSelectedStatus('resolved') }}
                className={`${selectedStatus === 'resolved' ? 'bg-blue-600' : 'bg-[#DAE6F8] '}  p-2 px-4 items-center rounded-2xl dark:bg-[#101922] dark:border-white dark:border`}
            >
                <Text className={`${selectedStatus === 'resolved' ? 'text-white' : 'text-blue-500'} font-medium`}>{t('resolved')}</Text>
            </TouchableOpacity>
        </View>
    )
}

export default StatusFilterTab