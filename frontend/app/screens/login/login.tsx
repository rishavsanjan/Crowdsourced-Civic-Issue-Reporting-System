import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Toast } from 'toastify-react-native';
import { LoadingDots } from '@mrakesh0608/react-native-loading-dots';

import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;


const LoginScreen: React.FC<Props> = ({ navigation }) => {
    const [loginForm, setLoginForm] = useState({
        email: "",
        password: ""
    })
    const [loading, setLoading] = useState(false);
    const [buttonDisabled, setButtonDisabled] = useState(true);

    useEffect(() => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        const isDisabled =
            !emailRegex.test(loginForm.email) ||
            loginForm.password.trim().length < 8;

        setButtonDisabled(isDisabled);


    }, [loginForm]);

    const handleLogin = async () => {
        setLoading(true);
        try {
            const response = await axios({
                url: 'http://10.11.9.95:3000/api/user/login',
                method: 'POST',
                data: {
                    email: loginForm.email,
                    password: loginForm.password
                }
            });
            console.log(response.data)

            if (response.data.error) {
                setLoading(false);
                Toast.error(`${response.data.error}`)
                return;
            }
            if (response.status === 200 && response.data.success) {
                AsyncStorage.setItem('citytoken', response.data.msg);
                navigation.navigate('HomeScreen');
            }

            Toast.show({
                type: 'success',
                text1: 'Logged in successfully!',
                position: 'top',
                visibilityTime: 3000,
                autoHide: true,
                backgroundColor: '#FFFFFF',
                textColor: '#1173D4',
                iconColor: '#4CAF50',
                iconSize: 24,
                progressBarColor: '#1173D4',
                theme: 'light',
            })
            setLoading(false);
        } catch (error) {
            console.log(error);
            setLoading(false);
            Toast.error(`${error}`)
        }
    };

    return (
        <View className=" flex flex-col justify-between h-full bg-[#F6F7F8] px-6">
            <View>
                <Text className='font-bold text-xl'>Fix My City</Text>
            </View>
            <View>
                <View className='items-center'>
                    <Text className="text-2xl font-bold mb-6">Welcome Back</Text>
                    <Text className="font-medium mb-6 text-gray-500">Login to continue reporting</Text>
                </View>
                <View className='w-full'>
                    <TextInput
                        className="w-full bg-white p-4 rounded-lg mb-4 border border-gray-300 transition-all duration-300 ease-in-out "
                        placeholder="Email"
                        keyboardType="email-address"
                        value={loginForm.email}
                        onChangeText={(text) => setLoginForm({ ...loginForm, email: text })}

                    />
                    <View >
                        <TextInput

                            className="w-full bg-white p-4 rounded-lg mb-4 border border-gray-300"
                            placeholder="Password"
                            secureTextEntry
                            value={loginForm.password}
                            onChangeText={(text) => setLoginForm({ ...loginForm, password: text })}
                        />
                        {
                            loginForm.password.length < 8 &&
                            <Text className='-mt-4 mb-4 ml-4 text-red-500 font-medium'>Password must be at least 8 characters long!</Text>
                        }
                    </View>

                    <TouchableOpacity
                        className={`${buttonDisabled ? 'bg-gray-800' : 'bg-blue-600'} w-full  p-4 rounded-lg`}
                        onPress={handleLogin}
                        disabled={buttonDisabled}
                    >
                        {
                            loading ?
                                <>
                                    <LoadingDots
                                        animation={'typing'}
                                        containerStyle={{
                                            backgroundColor: 'bg-blue-600',
                                        }}
                                        size={10}
                                        color='#ffffff'
                                    />
                                </>
                                :
                                <Text className={`${buttonDisabled ? 'text-gray-400' : 'text-white'} text-center font-semibold`}>Sign Up</Text>
                        }

                    </TouchableOpacity>
                </View>
            </View>
            <View className='items-center mb-8'>
                <Text className='text-[#1173D4] font-bold'>Forgot Password?</Text>
                <Text className='text-gray-500 font-semibold'>Dont have a acoount ?
                    <TouchableOpacity onPress={() => navigation.navigate('SignUpScreen')}>
                        <Text className='text-[#1173D4] font-bold'> Sign Up</Text>
                    </TouchableOpacity>

                </Text>
            </View>
        </View>
    );
};

export default LoginScreen;
