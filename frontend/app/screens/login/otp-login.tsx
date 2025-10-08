import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    SafeAreaView,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StatusBar,
    ActivityIndicator
} from 'react-native';

import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/navigation';
import API_BASE_IP from '../../../config/api';
import axios from 'axios';
import { Toast } from 'toastify-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Animated, {
    SlideInDown,
    SlideOutDown,
    Layout,
    FadeInLeft
} from 'react-native-reanimated';
type Props = NativeStackScreenProps<RootStackParamList, 'OTPLogin'>;


const OTPLogin: React.FC<Props> = ({ navigation }) => {
    const [loginMethod, setLoginMethod] = useState('password'); // 'password' or 'otp'
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [generatedOtp, setGeneratedOtp] = useState('');
    const [showOtpInput, setShowOtpInput] = useState(false);
    const [timer, setTimer] = useState(30);
    const [canResend, setCanResend] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    const otpInputs = useRef([]);
    console.log(API_BASE_IP)
    useEffect(() => {
        if (showOtpInput && timer > 0) {
            const interval = setInterval(() => {
                setTimer(prev => {
                    if (prev <= 1) {
                        setCanResend(true);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [showOtpInput, timer]);

    const handleLoginMethodChange = (method: string) => {
        setLoginMethod(method);
        setError('');
        setPassword('');
        setOtp(['', '', '', '', '', '']);
        setShowOtpInput(false);
    };

    const sendOtp = async () => {
        if (phone.length < 10) {
            setError('Please enter a valid phone number');
            return;
        };

        const response = await axios({
            url: `${API_BASE_IP}/api/user/login-otp`,
            method: "post",
            data: {
                phone: phone
            }
        });

        if (response.data.error) {
            Toast.error(`${response.data.error}`);
            return;
        }

        Toast.success('OTP sent successfully!');
        setGeneratedOtp(response.data.otp);
        setError('');
        setShowOtpInput(true);
        setTimer(30);
        setCanResend(false);
    };

    const handleOtpChange = (index: number, value: string) => {
        if (!/^\d*$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);
        setError('');

        if (value && index < 5) {
            //@ts-ignore
            otpInputs.current[index + 1]?.focus();
        }

        if (newOtp.every(digit => digit !== '') && index === 5) {
            setTimeout(() => verifyOtp(newOtp), 100);
        }
    };

    const handleKeyPress = (index: number, key: string) => {
        if (key === 'Backspace' && !otp[index] && index > 0) {
            //@ts-ignore
            otpInputs.current[index - 1]?.focus();
        }
    };

    const verifyOtp = async (otpToVerify = otp) => {
        const enteredOtp = otpToVerify.join('');
        if (enteredOtp === generatedOtp) {
            const response = await axios({
                url: `${API_BASE_IP}/api/user/confirm-login-otp`,
                method: 'post',
                data: {
                    phonenumber: phone,
                }
            })
            if (response.data.error) {
                Toast.error(`${response.data.error}`);
                setLoading(false);
                return;
            }
            setError('');
            if (response.status === 200 && response.data.success) {
                AsyncStorage.setItem('citytoken', response.data.msg);

            }
            setSuccess(true);

        } else {
            setError('Invalid OTP. Please try again.');
            setOtp(['', '', '', '', '', '']);
            //@ts-ignore
            otpInputs.current[0]?.focus();
        }
    };

    const resendOtp = () => {
        const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
        setGeneratedOtp(newOtp);
        setOtp(['', '', '', '', '', '']);
        setTimer(30);
        setCanResend(false);
        setError('');
        console.log('OTP resent:', newOtp);
    };

    const handlePasswordLogin = async () => {
        setError('')
        if (phone.length < 10) {
            setError('Please enter a valid phone number');
            return;
        }
        if (password.length < 8) {
            setError('Please enter your password');
            return;
        }
        setLoading(true)
        const response = await axios({
            url: `${API_BASE_IP}/api/user/login-password`,
            method: 'post',
            data: {
                phonenumber: phone,
                password
            }
        })
        console.log(response.data);
        if (response.data.error) {
            Toast.error(`${response.data.error}`);
            setLoading(false);
            return;
        }
        setError('');
        if (response.status === 200 && response.data.success) {
            AsyncStorage.setItem('citytoken', response.data.msg);

        }
        setLoading(false)
        setSuccess(true);
    };

    if (success) {
        return (
            <SafeAreaView className="flex-1 bg-gray-50">
                <StatusBar barStyle="dark-content" />
                <View className="flex-1 justify-center items-center px-6">
                    <View className="w-20 h-20 rounded-full bg-green-500 justify-center items-center mb-6">
                        <Text className="text-4xl text-white font-bold">✓</Text>
                    </View>
                    <Text className="text-3xl font-bold text-gray-900 mb-3">
                        Welcome Back!
                    </Text>
                    <Text className="text-base text-gray-600 text-center mb-8 leading-6">
                        You've successfully logged in to your account.
                    </Text>
                    <TouchableOpacity onPress={() => { navigation.navigate('HomeScreen') }} className="w-full bg-[#1173D4] rounded-xl py-4 items-center">
                        <Text className="text-white text-base font-semibold">Continue</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            <StatusBar barStyle="dark-content" />
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className="flex-1"
            >
                <ScrollView
                    contentContainerClassName="flex-grow px-6 pt-10 pb-6"
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    <View className="flex-1">
                        <Text className="text-4xl font-bold text-gray-900 mb-2 text-center">
                            Welcome Back
                        </Text>
                        <Text className="text-base text-gray-600 mb-8 leading-6 text-center">
                            Login to your account to continue
                        </Text>

                        {/* Login Method Toggle */}
                        <View className="flex-row bg-gray-200 rounded-xl p-1 mb-6">
                            <TouchableOpacity
                                className={`flex-1 py-3 rounded-lg ${loginMethod === 'password' ? 'bg-white' : 'bg-transparent'
                                    }`}
                                onPress={() => handleLoginMethodChange('password')}
                                activeOpacity={0.7}
                            >
                                <Text
                                    className={`text-center text-sm font-semibold ${loginMethod === 'password' ? 'text-gray-900' : 'text-gray-600'
                                        }`}
                                >
                                    Password
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                className={`flex-1 py-3 rounded-lg ${loginMethod === 'otp' ? 'bg-white' : 'bg-transparent'
                                    }`}
                                onPress={() => handleLoginMethodChange('otp')}
                                activeOpacity={0.7}
                            >
                                <Text
                                    className={`text-center text-sm font-semibold ${loginMethod === 'otp' ? 'text-gray-900' : 'text-gray-600'
                                        }`}
                                >
                                    OTP
                                </Text>
                            </TouchableOpacity>
                        </View>

                        {/* Phone Number Input */}
                        <View className="mb-5">
                            <Text className="text-sm font-semibold text-gray-700 mb-2">
                                Phone Number
                            </Text>
                            <TextInput
                                className="bg-white border-2 border-gray-200 rounded-xl px-4 py-3.5 text-base text-gray-900"
                                value={phone}
                                onChangeText={(text) => setPhone(text.replace(/\D/g, ''))}
                                placeholder="+91 9876543210"
                                placeholderTextColor="#9CA3AF"
                                keyboardType="phone-pad"
                                maxLength={10}
                            />
                        </View>

                        {/* Password Login */}
                        <Animated.View
                            key={loginMethod} // IMPORTANT: tells reanimated to re-render with animation when key changes
                            entering={SlideInDown.duration(250)}
                            exiting={SlideOutDown.duration(150)}
                            layout={Layout.springify()}
                        >
                            {loginMethod === 'password' ?
                                <>
                                    <View className="mb-5">
                                        <Text className="text-sm font-semibold text-gray-700 mb-2">
                                            Password
                                        </Text>
                                        <TextInput
                                            className="bg-white border-2 border-gray-200 rounded-xl px-4 py-3.5 text-base text-gray-900"
                                            value={password}
                                            onChangeText={setPassword}
                                            placeholder="Enter your password"
                                            placeholderTextColor="#9CA3AF"
                                            secureTextEntry
                                        />
                                    </View>

                                    <TouchableOpacity
                                        className="self-end mb-6"
                                        activeOpacity={0.7}
                                    >
                                        <Text className="text-sm text-gray-600">
                                            Forgot Password?
                                        </Text>
                                    </TouchableOpacity>

                                    {error ? (
                                        <Text className="text-red-500 text-sm mb-4">{error}</Text>
                                    ) : null}

                                    <TouchableOpacity
                                        className="bg-[#1173D4] rounded-xl py-4 items-center mb-4"
                                        onPress={handlePasswordLogin}
                                        activeOpacity={0.8}
                                    >
                                        {
                                            loading ?
                                                <View className="flex-row items-center">
                                                    <ActivityIndicator color="white" size="small" />
                                                    <Text className="text-white font-medium ml-2">Logging in...</Text>
                                                </View>
                                                :
                                                <Text className="text-white text-base font-semibold">
                                                    Login
                                                </Text>
                                        }

                                    </TouchableOpacity>
                                </>
                                :
                                <>
                                    {!showOtpInput ? (
                                        <>
                                            {error ? (
                                                <Text className="text-red-500 text-sm mb-4">{error}</Text>
                                            ) : null}

                                            <TouchableOpacity
                                                className="bg-[#1173D4] rounded-xl py-4 items-center mb-4"
                                                onPress={sendOtp}
                                                activeOpacity={0.8}
                                            >
                                                <Text className="text-white text-base font-semibold">
                                                    Send OTP
                                                </Text>
                                            </TouchableOpacity>
                                        </>
                                    ) : (
                                        <>
                                            <Text className="text-sm text-gray-600 mb-4 leading-5">
                                                Enter the 6-digit code sent to +91 {phone}
                                            </Text>

                                            <View className="flex-row justify-between mb-6">
                                                {otp.map((digit, index) => (
                                                    <TextInput
                                                        key={index}
                                                        //@ts-ignore
                                                        ref={el => otpInputs.current[index] = el}
                                                        className="w-12 h-14 bg-white border-2 border-gray-200 rounded-xl text-2xl font-semibold text-center text-gray-900"
                                                        value={digit}
                                                        onChangeText={(value) => handleOtpChange(index, value)}
                                                        onKeyPress={({ nativeEvent: { key } }) =>
                                                            handleKeyPress(index, key)
                                                        }
                                                        keyboardType="number-pad"
                                                        maxLength={1}
                                                        selectTextOnFocus
                                                    />
                                                ))}
                                            </View>

                                            {error ? (
                                                <Text className="text-red-500 text-sm text-center mb-4">
                                                    {error}
                                                </Text>
                                            ) : null}

                                            <View className="items-center mb-6">
                                                {canResend ? (
                                                    <TouchableOpacity onPress={resendOtp} activeOpacity={0.7}>
                                                        <Text className="text-gray-900 text-sm font-semibold">
                                                            Resend OTP
                                                        </Text>
                                                    </TouchableOpacity>
                                                ) : (
                                                    <Text className="text-gray-500 text-sm">
                                                        Resend OTP in {timer}s
                                                    </Text>
                                                )}
                                            </View>

                                            <TouchableOpacity
                                                className="bg-[#1173D4] rounded-xl py-4 items-center mb-3"
                                                onPress={() => verifyOtp()}
                                                activeOpacity={0.8}
                                            >
                                                <Text className="text-white text-base font-semibold">
                                                    Verify & Login
                                                </Text>
                                            </TouchableOpacity>

                                            <TouchableOpacity
                                                onPress={() => setShowOtpInput(false)}
                                                activeOpacity={0.7}
                                            >
                                                <Text className="text-gray-500 text-sm text-center">
                                                    Change phone number
                                                </Text>
                                            </TouchableOpacity>
                                        </>
                                    )}
                                </>
                            }

                        </Animated.View>


                        {/* Sign Up Link */}
                        <View className="flex-row justify-center items-center mt-6">
                            <Text className="text-gray-600 text-sm">
                                Don't have an account?{' '}
                            </Text>
                            <TouchableOpacity onPress={() => {navigation.navigate('OTPSignUp')}} activeOpacity={0.7}>
                                <Text className="text-gray-900 text-sm font-semibold">
                                    Sign Up
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

export default OTPLogin