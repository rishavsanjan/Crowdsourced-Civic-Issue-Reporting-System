import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    StatusBar,
    Switch,
    ActivityIndicator,
} from 'react-native';
import Icon from '@react-native-vector-icons/ionicons';
import { RootStackParamList } from '../navigation/navigation';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useMutation } from '@tanstack/react-query';
import axios, { Axios, AxiosError } from 'axios';
import API_BASE_URL from '@/config/api';
import { Toast } from 'toastify-react-native';
import { useAuth } from '../context/auth-context';
type Props = NativeStackScreenProps<RootStackParamList, 'AuthScreen'>;


const WorkerLoginScreen: React.FC<Props> = () => {
    const [formData, setFormData] = useState({
        number: '',
        password: ''
    })
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const {login} = useAuth();

    const handleLoginMutation = useMutation({
        mutationKey: ['worker-login'],
        mutationFn: async () => {
            const res = await axios({
                url: `${API_BASE_URL}/api/worker/login`,
                method: 'post',
                data: {
                    number: formData.number,
                    password: formData.password
                }
            })
            return res.data;
        }, onSuccess: async (data) => {
            Toast.success('Logged in successfully!');
            console.log(data)
            login(data.msg);
        },
        onError: (error: AxiosError<{ error?: string; message?: string }>) => {
            if (error.response) {
                Toast.error(error.response.data?.error || error.response.data?.message || 'An error occurred');
            } else if (error.request) {
                Toast.error('No response from server');
            } else {
                Toast.error(error.message || 'An error occurred');
            }
        }
    })

    console.log(formData)

    return (
        <View className="flex-1 bg-background-light dark:bg-background-dark">
            <StatusBar barStyle="dark-content" />

            <ScrollView
                className="flex-1 px-8 pt-12"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ flexGrow: 1 }}
            >
                {/* Branding/Icon Section */}
                <View className="mb-10 flex flex-col items-center">
                    <View className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
                        <Icon name="construct" size={36} color="#136dec" />
                    </View>
                    <Text className="text-3xl font-bold text-slate-900 dark:text-black tracking-tight">
                        Worker Portal
                    </Text>
                    <Text className="text-slate-500 dark:text-slate-400 mt-2 text-sm text-center">
                        Enter your credentials to access your assignments.
                    </Text>
                </View>

                {/* Form Section */}
                <View className="space-y-5">
                    {/* Identity Input */}
                    <View className="mb-5">
                        <Text className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 ml-1 mb-1.5">
                            Mobile
                        </Text>
                        <View className="relative">
                            <View className="absolute left-4 top-4 z-10">
                                <Icon name="person-outline" size={20} color="#94a3b8" />
                            </View>
                            <TextInput
                                className="w-full pl-11 pr-4 py-4 bg-slate-50 dark:bg-slate-800 rounded-xl text-slate-900 dark:text-white text-base"
                                placeholder="+91 7051901216"
                                placeholderTextColor="#94a3b8"
                                value={formData.number}
                                onChangeText={(text) => { setFormData(prev => ({ ...prev, number: text })) }}
                                keyboardType="number-pad"
                                autoCapitalize="none"
                            />
                        </View>
                    </View>

                    {/* Password Input */}
                    <View className="mb-5">
                        <Text className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 ml-1 mb-1.5">
                            Password
                        </Text>
                        <View className="relative">
                            <View className="absolute left-4 top-4 z-10">
                                <Icon name="lock-open-outline" size={20} color="#94a3b8" />
                            </View>
                            <TextInput
                                className="w-full pl-11 pr-12 py-4 bg-slate-50 dark:bg-slate-800 rounded-xl text-slate-900 dark:text-white text-base"
                                placeholder="••••••••"
                                placeholderTextColor="#94a3b8"
                                value={formData.password}
                                onChangeText={(text) => { setFormData(prev => ({ ...prev, password: text })) }}
                                secureTextEntry={!showPassword}
                            />
                            <TouchableOpacity
                                className="absolute right-4 top-4"
                                onPress={() => setShowPassword(!showPassword)}
                            >
                                <Icon
                                    name={showPassword ? "eye-outline" : "eye-off-outline"}
                                    size={20}
                                    color="#94a3b8"
                                />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Remember Me & Forgot */}
                    <View className="flex-row items-center justify-between pt-1 mb-5">
                        <View className="flex-row items-center space-x-2">
                            <Switch
                                value={rememberMe}
                                onValueChange={setRememberMe}
                                trackColor={{ false: '#e2e8f0', true: '#136dec' }}
                                thumbColor="#ffffff"
                                ios_backgroundColor="#e2e8f0"
                            />
                            <Text className="text-sm text-slate-600 dark:text-slate-400 ml-2">
                                Remember Me
                            </Text>
                        </View>
                        <TouchableOpacity>
                            <Text className="text-sm font-medium text-primary">Forgot?</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Submit Button */}
                    <TouchableOpacity
                        className="w-full bg-primary bg-blue-600 py-4 rounded-xl shadow-lg flex-row items-center justify-center space-x-2 mt-4 active:scale-95"
                        onPress={() => {
                            handleLoginMutation.mutate()
                        }}
                        disabled={handleLoginMutation.isPending}
                        activeOpacity={0.9}
                    >
                        {
                            handleLoginMutation.isPending ?
                                <View className='flex flex-row gap-2'>
                                    <Text className='text-white text-base font-semibold'>Logging...</Text>
                                    <ActivityIndicator color={'white'} />
                                </View>
                                :
                                <>
                                    <Text className="text-white font-bold text-base">Login</Text>
                                    <Icon name="arrow-forward" size={18} color="#ffffff" />
                                </>
                        }

                    </TouchableOpacity>
                </View>

                {/* Bottom Actions */}
                <View className="mt-auto pb-10 flex flex-col items-center space-y-6">
                    <View className="flex-row items-center space-x-2 mt-6">
                        <Text className="text-slate-500 dark:text-slate-400 text-sm">
                            New worker?
                        </Text>
                        <TouchableOpacity>
                            <Text className="text-primary font-bold text-sm ml-2">Request Access</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>

            {/* Decorative Background Elements */}
            <View className="absolute -top-24 -right-24 w-64 h-64 bg-primary/5 rounded-full opacity-50"
                style={{ position: 'absolute' }}
            />
            <View className="absolute -bottom-24 -left-24 w-64 h-64 bg-primary/5 rounded-full opacity-50"
                style={{ position: 'absolute' }}
            />
        </View>
    );
}

export default WorkerLoginScreen