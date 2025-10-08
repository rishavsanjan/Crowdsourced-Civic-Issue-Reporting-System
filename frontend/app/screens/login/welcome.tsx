import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, Image } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/navigation';
import { Link } from 'expo-router';

type Props = NativeStackScreenProps<RootStackParamList, 'WelcomeLoginScreen'>;


const WelcomeLoginScreen: React.FC<Props> = ({ navigation }) => {
    
    useEffect(() => {
        const token = AsyncStorage.getItem('citytoken');
        console.log(token)
    }, [])

    return (
        <View className="flex flex-col justify-between h-full bg-[#F6F7F8]">
            <View>
                <View className=''>
                    <Image className=' aspect-[2/1]' style={{ width: 'auto', height: 300 }}
                        resizeMode="cover" source={require('../../../assets/images/welcomelogin.png')} />
                </View>
                <View className='flex flex-col gap-4 m-4'>
                    <Text className='text-3xl text-center font-bold'>Report Issues, Improve Your City</Text>
                    <Text className='text-center text-gray-500 font-normal text-sm'>Join your community in making our city a better place. Report issues, track progress and see real change</Text>
                    <TouchableOpacity onPress={() => navigation.navigate('OTPLogin')} className='items-center bg-[#1173D4] p-3 rounded-lg'>
                        <Text className='text-white font-medium  text-lg'>Log In</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => navigation.navigate("OTPSignUp")} className='bg-[#DFE9F4] items-center p-3 rounded-lg'>
                        <Text className='text-[#1173D4] font-medium  text-lg'>Sign Up</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <View className='m-4'>
                <Text className='text-center'>By continuing, you agree to our <Text className='text-[#1173D4] font-medium'>Terms of Service</Text> and <Text className='text-[#1173D4] font-medium'>Privacy Policy.</Text></Text>
            </View>
        </View>
    );
};

export default WelcomeLoginScreen;
