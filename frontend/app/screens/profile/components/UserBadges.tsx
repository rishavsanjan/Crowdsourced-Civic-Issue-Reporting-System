import { RootStackParamList } from '@/app/navigation/navigation';
import { ProfileData } from '@/app/types/profileData';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { Text, TouchableOpacity, View } from 'react-native'

type P = NativeStackScreenProps<RootStackParamList, 'ProfileScreen'>;

interface Props {
    data: ProfileData | undefined
    navigation: P['navigation'];
}

const UserBadges: React.FC<Props> = ({ data, navigation }) => {
    const { t } = useTranslation();
    return (
        <View className="bg-white mx-4 rounded-lg p-4 mb-4 shadow-sm">
            <View className='flex flex-row justify-between'>
                <Text className="text-lg font-semibold mb-4 w-32">{t('myBadges')}</Text>
                <TouchableOpacity onPress={() => { navigation.navigate('Badges') }}>
                    <Text className="text-lg font-semibold mb-4 w-20">{t('viewAll')}</Text>
                </TouchableOpacity>
            </View>


            <View className="flex-row flex-wrap justify-around">
                {
                    data?.user.UserBage?.length !== undefined ?
                        <>
                            {data?.user.UserBage.map((badge) => (
                                <View key={badge.id} className="items-center mb-4 w-1/3">
                                    <View className="w-16 h-16 bg-teal-100 rounded-lg items-center justify-center mb-2">
                                        <Text className="text-2xl">{badge.icon_url}</Text>
                                    </View>
                                    <Text className="text-sm text-center font-medium">{badge.name}</Text>
                                </View>
                            ))}
                        </>
                        :

                        <View className='flex flex-col items-center gap-4'>
                            <View>
                                <Text>You have not earned any badges yet!</Text>
                            </View>
                            <TouchableOpacity onPress={() => { navigation.navigate('Badges') }} className='bg-blue-600 rounded-lg p-4'>
                                <Text className='text-white font-medium '>{t('viewProgress')}</Text>
                            </TouchableOpacity>
                        </View>
                }

            </View>
        </View>
    )
}

export default UserBadges