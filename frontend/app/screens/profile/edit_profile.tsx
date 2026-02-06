import { useAuth } from '@/app/context/auth-context';
import { RootStackParamList } from '@/app/navigation/navigation';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    Image,
    SafeAreaView,
    StatusBar,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';

type Props = NativeStackScreenProps<RootStackParamList, 'EditProfile'>;


// Icon Components
const BackIcon = ({ color = 'currentColor' }: { color?: string }) => (
    <Svg width={24} height={24} viewBox="0 0 256 256" fill={color}>
        <Path d="M224,128a8,8,0,0,1-8,8H59.31l58.35,58.34a8,8,0,0,1-11.32,11.32l-72-72a8,8,0,0,1,0-11.32l72-72a8,8,0,0,1,11.32,11.32L59.31,120H216A8,8,0,0,1,224,128Z" />
    </Svg>
);

const EditIcon = ({ color = 'white' }: { color?: string }) => (
    <Svg width={20} height={20} viewBox="0 0 256 256" fill={color}>
        <Path d="M227.31,73.37,182.63,28.68a16,16,0,0,0-22.63,0L36.69,152A15.86,15.86,0,0,0,32,163.31V208a16,16,0,0,0,16,16H92.69A15.86,15.86,0,0,0,104,219.31L227.31,96a16,16,0,0,0,0-22.63ZM92.69,208H48V163.31l88-88L180.69,120ZM192,108.68,147.31,64,172,39.31,216.69,84Z" />
    </Svg>
);


interface EditProfileProps {
    onBack?: () => void;
    onNavigate?: (screen: string) => void;
    onSave?: (data: ProfileData) => void;
    Props: Props
}

interface ProfileData {
    name: string;
    email: string;
    phone: string;
    address: string;
}

const EditProfile: React.FC<Props> = () => {


    const { user } = useAuth();
    const [name, setName] = useState(user?.name);
    const [phone, setPhone] = useState(user?.phonenumber);
    console.log(user)



    const handleEditPhoto = () => {
        // Handle photo editing logic
        console.log('Edit photo clicked');
    };

    return (
        <SafeAreaView className="flex-1 bg-[#f6f7f8] light:bg-[#101922]">
            <StatusBar barStyle="light-content" />

            {/* Header */}
            <View className="bg-[#f6f7f8] light:bg-[#101922] px-4 py-3 border-b border-[#1173d4]/20 light:border-[#1173d4]/30">
                <View className="flex-row items-center">
                    <TouchableOpacity>
                        <BackIcon color="#1e293b" />
                    </TouchableOpacity>
                    <Text className="text-lg font-bold text-slate-900 light:text-slate-50 flex-1 text-center pr-6">
                        Edit Profile
                    </Text>
                </View>
            </View>

            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                <View className="p-4">
                    {/* Profile Picture Section */}
                    <View className="flex-col items-center space-y-4 mb-8">
                        <View className="relative">
                            <View className="w-24 h-24 bg-orange-200 rounded-full items-center justify-center">
                                <Text className="text-2xl font-semibold text-orange-800">
                                    {name?.charAt(0) || 'U'}
                                </Text>
                            </View>


                            <TouchableOpacity
                                onPress={handleEditPhoto}
                                className="absolute bottom-0 right-0 bg-[#1173d4] rounded-full p-2"
                            >
                                <EditIcon />
                            </TouchableOpacity>
                        </View>

                        <View className="items-center">
                            <Text className="text-2xl font-bold text-slate-900 light:text-slate-50">
                                {name}
                            </Text>
                        </View>
                    </View>

                    {/* Form */}
                    <View className="space-y-6">
                        {/* Name Input */}
                        <View>
                            <Text className="block text-sm font-medium text-slate-700 light:text-slate-300 mb-1">
                                Name
                            </Text>
                            <TextInput
                                className="w-full rounded-lg border border-[#1173d4]/30 bg-[#f6f7f8] light:bg-[#101922]/50 px-4 py-3 text-slate-900 light:text-slate-50"
                                value={name}
                                onChangeText={setName}
                                placeholderTextColor="#94a3b8"
                            />
                        </View>

                        {/* Phone Input */}
                        <View>
                            <Text className="block text-sm font-medium text-slate-700 light:text-slate-300 mb-1">
                                Phone
                                <Text> (You cannot change your number)</Text>
                            </Text>
                            <TextInput
                                className="w-full rounded-lg border border-[#1173d4]/30 bg-[#f6f7f8] light:bg-[#101922]/50 px-4 py-3 text-slate-900 light:text-slate-50"
                                value={phone}
                                placeholder="Enter your phone number"
                                keyboardType="phone-pad"
                                placeholderTextColor="#94a3b8"
                            />
                        </View>



                        {/* Save Button */}
                        <View className="pt-4 pb-20">
                            <TouchableOpacity
                                disabled={user?.name === name}
                                className="w-full bg-[#1173d4] py-3 px-4 rounded-lg active:bg-[#1173d4]/90 disabled:cursor-not-allowed disabled:opacity-70"
                            >
                                <Text className="text-white font-bold text-center text-base">
                                    Save Changes
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default EditProfile;