import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Toast } from 'toastify-react-native';
import { LoadingDots } from '@mrakesh0608/react-native-loading-dots';

import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/navigation';
import LoginScreen from '../login/login';

type Props = NativeStackScreenProps<RootStackParamList, 'HomeScreen'>;

//@ts-ignore
const HomeScreen: React.FC<Props> = ({ navigation }) => {

    const [selectedStatus, setSelectedStatus] = useState('all');
    const [isLogin, setIsLogin] = useState(false);

    const getLoginStatus = async () => {
        const token = await AsyncStorage.getItem('citytoken');
        if (token) {
            setIsLogin(true);
        } else {
            navigation.navigate('WelcomeLoginScreen')
        }
    }

    useEffect(() => {
        getLoginStatus()
    }, [])




    return (
        <View className=" flex flex-col justify-between h-full bg-[#F6F7F8] items-center ">
            <View className='flex flex-row justify-between mb-4 w-full px-4 mt-4'>
                <TouchableOpacity onPress={() => { setSelectedStatus('all') }} className={`${selectedStatus === 'all' ? 'bg-blue-600' : 'bg-[#DAE6F8] '} p-2 px-4 items-center rounded-2xl`}>
                    <Text className={`${selectedStatus === 'all' ? 'text-white' : 'text-blue-500'} font-medium`}>All</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => { setSelectedStatus('pending') }} className={`${selectedStatus === 'pending' ? 'bg-blue-600' : 'bg-[#DAE6F8] '}  p-2 px-4 items-center rounded-2xl`}>
                    <Text className={`${selectedStatus === 'pending' ? 'text-white' : 'text-blue-500'} font-medium`}>Pending</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => { setSelectedStatus('in_progress') }} className={`${selectedStatus === 'in_progress' ? 'bg-blue-600' : 'bg-[#DAE6F8] '}  p-2 px-4 items-center rounded-2xl`}>
                    <Text className={`${selectedStatus === 'in_progress' ? 'text-white' : 'text-blue-500'} font-medium`}>In-Progress</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => { setSelectedStatus('resolved') }} className={`${selectedStatus === 'resolved' ? 'bg-blue-600' : 'bg-[#DAE6F8] '}  p-2 px-4 items-center rounded-2xl`}>
                    <Text className={`${selectedStatus === 'resolved' ? 'text-white' : 'text-blue-500'} font-medium`}>Resolved</Text>
                </TouchableOpacity>
            </View>

        </View>
    );
};

export default HomeScreen;
