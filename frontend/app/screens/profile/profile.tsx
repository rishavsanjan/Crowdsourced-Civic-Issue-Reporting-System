import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Toast } from 'toastify-react-native';
import { LoadingDots } from '@mrakesh0608/react-native-loading-dots';

import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/navigation';
import LoginScreen from '../login/login';

type Props = NativeStackScreenProps<RootStackParamList, 'ProfileScreen'>;


const ProfileScreen: React.FC<Props> = ({ navigation }) => {

    const [isLogin, setIsLogin] = useState(false);

    const getLoginStatus = async () => {
        const token = await AsyncStorage.getItem('citytoken');
        if (token) {
            setIsLogin(true);
        }
    }

    useEffect(() => {
        getLoginStatus()
    }, [])

    if (!isLogin) {
        return (
            //@ts-ignore
            <LoginScreen />
        )
    }


    return (
        <View className=" flex flex-col justify-between h-full bg-[#F6F7F8] items-center ">
           <View>
                <Text className='font-bold text-xl'>Profile</Text>
           </View>

        </View>
    );
};

export default ProfileScreen;
