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
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/navigation';
import API_BASE_IP from '../../../config/api';
import axios from 'axios';
import { Toast } from 'toastify-react-native';

type Props = NativeStackScreenProps<RootStackParamList, 'OTPSignUp'>;


const OTPSignUp: React.FC<Props> = ({ navigation }) => {
    const [step, setStep] = useState(1);
    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [generatedOtp, setGeneratedOtp] = useState('');
    const [timer, setTimer] = useState(30);
    const [canResend, setCanResend] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState('');

    const otpInputs = useRef([]);

    useEffect(() => {
        if (step === 2 && timer > 0) {
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
    }, [step, timer]);

    const sendOtp = async () => {
        const response = await axios({
            url: `${API_BASE_IP}/api/user/signup-no-otp`,
            method: "post",
            data: {
                phone: phone
            }
        })
        Toast.success('OTP sent successfully!');
        setGeneratedOtp(response.data.otp);
        setError('');
        setStep(2);
        setTimer(30);
        setCanResend(false);
        console.log('OTP sent:', response.data.otp);
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

    const verifyOtp = (otpToVerify = otp) => {
        const enteredOtp = otpToVerify.join('');
        if (enteredOtp === generatedOtp) {
            setError('');
            setStep(3);
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

    const createAccount = async () => {
        if (!name || !password || !confirmPassword) {
            setError('Please fill all fields');
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords must match');
            return;
        }
        if (password.length < 8) {
            setError('Password must be at least 8 characters');
            return;
        }
        const res = await axios({
            url: `${API_BASE_IP}/api/user/signup-final`,
            method: 'post',
            data: {
                name,
                email,
                password,
                phonenumber: phone,

            }
        });
        


        setError('');
        setSuccess(true);
    };

    if (success) {
        return (
            <SafeAreaView className="flex-1 bg-[#F6F7F8]">
                <StatusBar barStyle="dark-content" />
                <View className="flex-1 justify-center items-center px-6">
                    <View className="w-20 h-20 rounded-full bg-green-500 justify-center items-center mb-6">
                        <Text className="text-4xl text-white font-bold">✓</Text>
                    </View>
                    <Text className="text-3xl font-bold text-gray-900 mb-3">
                        Account Created!
                    </Text>
                    <Text className="text-base text-gray-600 text-center mb-8 leading-6">
                        Welcome aboard! Your account has been successfully created.
                    </Text>
                    <TouchableOpacity onPress={() => navigation.navigate('OTPLogin')} className="w-full bg-gray-900 rounded-xl py-4 items-center">
                        <Text className="text-white text-base font-semibold">Get Started</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-[#F6F7F8]">
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
                    {/* Progress Indicator */}
                    <View className="flex-row items-center justify-center mb-10">
                        <View className={`w-3 h-3 rounded-full ${step >= 1 ? 'bg-gray-900' : 'bg-gray-300'}`} />
                        <View className={`w-10 h-0.5 mx-2 ${step >= 2 ? 'bg-gray-900' : 'bg-gray-300'}`} />
                        <View className={`w-3 h-3 rounded-full ${step >= 2 ? 'bg-gray-900' : 'bg-gray-300'}`} />
                        <View className={`w-10 h-0.5 mx-2 ${step >= 3 ? 'bg-gray-900' : 'bg-gray-300'}`} />
                        <View className={`w-3 h-3 rounded-full ${step >= 3 ? 'bg-gray-900' : 'bg-gray-300'}`} />
                    </View>

                    {/* Step 1: Phone Number */}
                    {step === 1 && (
                        <View className="flex-1">
                            <Text className="text-4xl font-bold text-gray-900 mb-2 text-center">
                                Sign Up
                            </Text>
                            <Text className="text-base text-gray-600 mb-8 leading-6 text-center">
                                Enter your phone number to get started
                            </Text>

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

                            {error ? (
                                <Text className="text-red-500 text-sm mb-4">{error}</Text>
                            ) : null}

                            <TouchableOpacity
                                className="bg-gray-900 rounded-xl py-4 items-center mb-4"
                                onPress={sendOtp}
                                activeOpacity={0.8}
                            >
                                <Text className="text-white text-base font-semibold">Send OTP</Text>
                            </TouchableOpacity>


                        </View>
                    )}

                    {/* Step 2: OTP Verification */}
                    {step === 2 && (
                        <View className="flex-1">
                            <Text className="text-4xl font-bold text-gray-900 mb-2">
                                Verify OTP
                            </Text>
                            <Text className="text-base text-gray-600 mb-8 leading-6">
                                Enter the 6-digit code sent to{'\n'}+91 {phone}
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
                                <Text className="text-red-500 text-sm text-center mb-4">{error}</Text>
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
                                className="bg-gray-900 rounded-xl py-4 items-center mb-4"
                                onPress={() => verifyOtp()}
                                activeOpacity={0.8}
                            >
                                <Text className="text-white text-base font-semibold">Verify</Text>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => setStep(1)} activeOpacity={0.7}>
                                <Text className="text-gray-500 text-sm text-center">
                                    Change phone number
                                </Text>
                            </TouchableOpacity>
                        </View>
                    )}

                    {/* Step 3: Account Details */}
                    {step === 3 && (
                        <View className="flex-1">
                            <Text className="text-4xl font-bold text-gray-900 mb-2 text-center">
                                Create Account
                            </Text>
                            <Text className="text-base text-gray-600 mb-8 leading-6 text-center">
                                Complete your profile to finish
                            </Text>

                            <View className="mb-5">
                                <Text className="text-sm font-semibold text-gray-700 mb-2">
                                    Full Name
                                </Text>
                                <TextInput
                                    className="bg-white border-2 border-gray-200 rounded-xl px-4 py-3.5 text-base text-gray-900"
                                    value={name}
                                    onChangeText={setName}
                                    placeholder="John Doe"
                                    placeholderTextColor="#9CA3AF"
                                    autoCapitalize="words"
                                />
                            </View>

                            <View className="mb-5">
                                <Text className="text-sm font-semibold text-gray-700 mb-2">
                                    Email (optional)
                                </Text>
                                <TextInput
                                    className="bg-white border-2 border-gray-200 rounded-xl px-4 py-3.5 text-base text-gray-900"
                                    value={email}
                                    onChangeText={setEmail}
                                    placeholder="john@example.com"
                                    placeholderTextColor="#9CA3AF"
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                />
                            </View>

                            <View className="mb-5">
                                <Text className="text-sm font-semibold text-gray-700 mb-2">
                                    Password
                                </Text>
                                <TextInput
                                    className="bg-white border-2 border-gray-200 rounded-xl px-4 py-3.5 text-base text-gray-900"
                                    value={password}
                                    onChangeText={setPassword}
                                    placeholder="Min. 8 characters"
                                    placeholderTextColor="#9CA3AF"
                                    secureTextEntry
                                />
                            </View>

                            <View className="mb-5">
                                <Text className="text-sm font-semibold text-gray-700 mb-2">
                                    Confirm Password
                                </Text>
                                <TextInput
                                    className="bg-white border-2 border-gray-200 rounded-xl px-4 py-3.5 text-base text-gray-900"
                                    value={confirmPassword}
                                    onChangeText={setConfirmPassword}
                                    placeholder="Passwords must match!"
                                    placeholderTextColor="#9CA3AF"
                                    secureTextEntry
                                />
                            </View>

                            {error ? (
                                <Text className="text-red-500 text-sm mb-4">{error}</Text>
                            ) : null}

                            <TouchableOpacity
                                className="bg-gray-900 rounded-xl py-4 items-center"
                                onPress={createAccount}
                                activeOpacity={0.8}
                            >
                                <Text className="text-white text-base font-semibold">
                                    Create Account
                                </Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

export default OTPSignUp