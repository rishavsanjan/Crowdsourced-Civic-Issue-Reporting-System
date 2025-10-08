import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, Platform } from 'react-native';
import axios from 'axios';
import { Toast } from 'toastify-react-native';

import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/navigation';
import { LoadingDots } from '@mrakesh0608/react-native-loading-dots';


type Props = NativeStackScreenProps<RootStackParamList, 'SignUpScreen'>;


const SignUpScreen: React.FC<Props> = ({ navigation }) => {

    const [buttonDisabled, setButtonDisabled] = useState(true);
    const [signUpForm, setSignUpForm] = useState({
        name: "",
        email: "",
        password: "",
        confirmpassword: ""
    })

    const [loading, setLoading] = useState(false);
    const [errors, setErros] = useState([]);

    console.log(signUpForm)

    useEffect(() => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        const isDisabled =
            !signUpForm.name ||
            !emailRegex.test(signUpForm.email) ||
            signUpForm.password !== signUpForm.confirmpassword ||
            signUpForm.password.trim().length < 8;

        setButtonDisabled(isDisabled);


    }, [signUpForm]);



    const handleSignup = async () => {
        setLoading(true);
        try {
            const response = await axios({
                url: 'http://172.20.10.2:3000/api/user/signup',
                method: 'POST',
                data: {
                    email: signUpForm.email,
                    name: signUpForm.name,
                    password: signUpForm.password
                }
            });
            Toast.success('Signed up!')
            console.log(response.data)
            if (response.data.error) {
                setLoading(false);
                Toast.error(`${response.data.error}`)
                return;
            }
            navigation.navigate('Login');
            Toast.show({
                type: 'success',
                text1: 'Signed Up Successfully!',
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
        <View className=" flex flex-col justify-between h-full bg-gray-50 px-6">
            <View>
                <Text className='font-bold text-xl'>Fix My City</Text>
            </View>
            <View>
                <View className='items-center'>
                    <Text className="text-2xl font-bold mb-6">Sign Up</Text>
                    <Text className="font-medium mb-6 text-gray-500">SignUp to make your city better</Text>
                </View>
                <View className='w-full'>
                    <TextInput
                        className="w-full bg-white p-4 rounded-lg mb-4 border border-gray-300 transition-all duration-300 ease-in-out "
                        placeholder="Name"
                        keyboardType="email-address"
                        value={signUpForm.name}
                        onChangeText={(text) => setSignUpForm({ ...signUpForm, name: text })}

                    />
                    <TextInput
                        className="w-full bg-white p-4 rounded-lg mb-4 border border-gray-300 transition-all duration-300 ease-in-out "
                        placeholder="Email"
                        keyboardType="email-address"
                        value={signUpForm.email}
                        onChangeText={(text) => setSignUpForm({ ...signUpForm, email: text })}
                    />
                    <View >
                        <TextInput
                            className="w-full bg-white p-4 rounded-lg mb-4 border border-gray-300"
                            placeholder="Password"
                            secureTextEntry
                            value={signUpForm.password}
                            onChangeText={(text) => setSignUpForm({ ...signUpForm, password: text })}
                        />
                        {
                            signUpForm.password.length < 8 &&
                            <Text className='-mt-4 mb-4 ml-4 text-red-500 font-medium'>Password must be at least 8 characters long!</Text>
                        }
                    </View>
                    <View>
                        <TextInput
                            className="w-full bg-white p-4 rounded-lg mb-4 border border-gray-300"
                            placeholder="Confirm Password"
                            secureTextEntry
                            value={signUpForm.confirmpassword}
                            onChangeText={(text) => setSignUpForm({ ...signUpForm, confirmpassword: text })}
                        />
                        {
                            signUpForm.password !== signUpForm.confirmpassword &&
                            <Text className='-mt-4 mb-4 ml-4 text-red-500 font-medium'>Both passwords must match!</Text>
                        }
                    </View>



                    <TouchableOpacity
                        className={`${buttonDisabled ? 'bg-gray-800' : 'bg-blue-600'} w-full  p-4 rounded-lg`}
                        onPress={handleSignup}
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
                <Text className='text-gray-500 font-semibold'>Already have a acoount ?
                    <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                        <Text className='text-[#1173D4] font-bold'> Log in</Text>
                    </TouchableOpacity>
                </Text>
            </View>
        </View>
    );
};

export default SignUpScreen;
