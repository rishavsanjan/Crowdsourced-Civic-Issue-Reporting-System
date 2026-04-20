import { RootStackParamList } from '@/app/navigation/navigation';
import { ProfileData } from '@/app/types/profileData';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { Image, Text, TouchableOpacity, View } from 'react-native'

type P = NativeStackScreenProps<RootStackParamList, 'ProfileScreen'>;

interface Props {
    data: ProfileData | undefined
    navigation: P['navigation'];
}

const UserBadges: React.FC<Props> = ({ data, navigation }) => {
    const { t } = useTranslation();

    return (
        <View className="dark:border-blue-300 border bg-white mx-4 rounded-lg p-4 mb-4 shadow-sm dark:bg-slate-900/70">
            <View className='flex flex-row justify-between'>
                <Text className="text-lg font-semibold mb-4 w-32 dark:text-slate-200">{t('myBadges')}</Text>
                <TouchableOpacity onPress={() => { navigation.navigate('Badges') }}>
                    <Text className="text-lg font-semibold mb-4 w-20 dark:text-slate-200">{t('viewAll')}</Text>
                </TouchableOpacity>
            </View>


            <View className="flex justify-around">
                {
                    data!.user.UserBadge.length > 0 ?
                        <>
                            {data?.user.UserBadge.map((b, i) => (
                                <View key={i} className="flex-row items-center gap-4">
                                    <Image style={{ width: 40, height: 40 }} source={{ uri: b.badge.icon_url }} />
                                    <View className="flex-1">
                                        <Text className={`font-bold text-base dark:text-white text-gray-500 `}>
                                            {b.badge.name}
                                        </Text>
                                        <Text className="text-sm text-gray-500 mt-1">
                                            {b.badge.description}
                                        </Text>

                                    </View>
                                </View>
                            ))}
                        </>
                        :

                        <View className='flex flex-col items-center gap-4'>
                            <View>
                                <Text className='dark:text-slate-200'>{t('noBadge')}</Text>
                            </View>
                            <TouchableOpacity onPress={() => { navigation.navigate('Badges') }} className='bg-blue-600 rounded-lg p-4'>
                                <Text className='text-white font-medium  dark:text-slate-200'>{t('viewProgress')}</Text>
                            </TouchableOpacity>
                        </View>
                }

            </View>
        </View>
    )
}

export default UserBadges