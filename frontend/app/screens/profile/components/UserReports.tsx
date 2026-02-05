import { RootStackParamList } from '@/app/navigation/navigation';
import { ProfileData } from '@/app/types/profileData';
import { formatISTDateTime } from '@/app/util/date';
import { getStatusColor, getStatusIcon, getStatusText } from '@/app/util/styles';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { Text, TouchableOpacity, View } from 'react-native'

type P = NativeStackScreenProps<RootStackParamList, 'ProfileScreen'>;

interface Props {
    data: ProfileData | undefined
    navigation :  P['navigation'];
}

const UserReports: React.FC<Props> = ({ data, navigation }) => {
    console.log(data)
    const { t } = useTranslation();
    return (
        <View className="bg-white mx-4 rounded-lg p-4 mb-4 shadow-sm">
            <View className='flex flex-row justify-between'>
                <Text className="text-lg font-semibold mb-4 w-32">{t('myReports')}</Text>
                <TouchableOpacity onPress={() => { navigation.navigate('AllComplaints') }}>
                    <Text className="text-lg font-semibold mb-4 w-20">{t('viewAll')}</Text>

                </TouchableOpacity>
            </View>
            {
                data?.user.Complaint.length !== undefined ?
                    data?.user.Complaint.map((complain, index) => (
                        <TouchableOpacity
                            key={index}
                            className=" py-3 border-b border-gray-100 last:border-b-0"
                        >
                            <View className='flex flex-row items-center'>


                                <View className="flex-1">
                                    <Text className="font-medium">{complain.title}</Text>
                                    {/* <Text className="text-gray-500 text-sm">{report.category}</Text> */}
                                </View>

                                <View className="flex-row items-center">
                                    <Ionicons
                                        name={getStatusIcon(complain.status)}
                                        size={16}
                                        color={getStatusColor(complain.status)}
                                    />
                                    <Text
                                        className="text-sm ml-1 font-medium"
                                        style={{ color: getStatusColor(complain.status) }}
                                    >
                                        {getStatusText(complain.status)}
                                    </Text>
                                </View>
                            </View>
                            <View>
                                <Text className="text-gray-500 text-sm">{formatISTDateTime(complain.createdAt)}</Text>
                            </View>

                        </TouchableOpacity>
                    ))
                    :
                    <View className='flex flex-col items-center'>
                        <Text className='text-center my-4'>{t('noReports')}</Text>
                        <TouchableOpacity onPress={() => { navigation.navigate('Upload') }} className='bg-blue-600 rounded-lg p-4'>
                            <Text className='text-white font-medium '>{t('startReporting')}</Text>
                        </TouchableOpacity>
                    </View>

            }
        </View>
    )
}

export default UserReports