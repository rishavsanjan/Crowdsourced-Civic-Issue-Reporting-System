import { useAuth } from '@/app/context/auth-context';
import { RootStackParamList } from '@/app/navigation/navigation';
import { ProfileData } from '@/app/types/profileData';
import { formatMonthYear } from '@/app/util/date';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { Image, Text, TouchableOpacity, View } from 'react-native'

type P = NativeStackScreenProps<RootStackParamList, 'ProfileScreen'>;


interface Props {
    data: ProfileData | undefined
    navigation :  P['navigation'];
}

const UserInfo: React.FC<Props> = ({ data,navigation }) => {
    const { t } = useTranslation();
    const { logout, user } = useAuth();
    
    return (
        <View className="bg-white px-6 py-8 items-center relative">
            <View className='flex self-end absolute right-12 top-4'>
                <TouchableOpacity onPress={() => {
                     logout()
                    navigation.navigate('WelcomeLoginScreen')
                }}>
                    <Image style={{ width: 30, height: 30 }} source={{ uri: 'https://img.icons8.com/?size=100&id=vGj0AluRnTSa&format=png&color=000000' }} />
                </TouchableOpacity>
            </View>
            <View className="relative">
                <View className="w-24 h-24 bg-orange-200 rounded-full items-center justify-center">
                    {data?.user?.profileImage ? (
                        <Image
                            source={{ uri: data?.user.profileImage }}
                            className="w-24 h-24 rounded-full"
                        />
                    ) : (
                        <Text className="text-2xl font-semibold text-orange-800">
                            {user?.name?.charAt(0) || 'U'}
                        </Text>
                    )}
                </View>
                <View className="absolute -bottom-2 -right-2 w-8 h-8 bg-blue-500 rounded-full items-center justify-center">
                    <Ionicons name="checkmark" size={16} color="white" />
                </View>
            </View>

            <Text className="text-xl font-bold mt-4">{user?.name}</Text>
            <Text className="text-gray-500">{t('citizenReporter')}</Text>
            <Text className="text-gray-400 text-sm">{t('joined')} {formatMonthYear(data!.user.createdAt)}</Text>
        </View>
    )
}

export default UserInfo