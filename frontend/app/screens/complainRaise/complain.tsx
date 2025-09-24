import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Toast } from 'toastify-react-native';
import { LoadingDots } from '@mrakesh0608/react-native-loading-dots';

import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/navigation';
import LoginScreen from '../login/login';
import * as Location from "expo-location";

type Props = NativeStackScreenProps<RootStackParamList, 'RaiseComplainScreen'>;


const RaiseComplainScreen: React.FC<Props> = ({ navigation }) => {

    const [isLogin, setIsLogin] = useState(false);
    const [complainForm, setComplainForm] = useState({
        title: '',
        description: ''
    });
    const [location, setLocation] = useState(null);
    const [address, setAddress] = useState(null);
    const [errorMsg, setErrorMsg] = useState('');
    

    const getLocation = async () => {
        try {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== "granted") {
                setErrorMsg("Permission to access location was denied");
                return;
            }

            // Get precise location
            let loc = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.Highest,
            });

            setLocation(loc.coords);

            // Reverse geocode to get address
            let addr = await Location.reverseGeocodeAsync({
                latitude: loc.coords.latitude,
                longitude: loc.coords.longitude,
            });

            setAddress(addr[0]); // first result
        } catch (err) {
            setErrorMsg(err.message);
        }
    };

    const getLoginStatus = async () => {
        const token = await AsyncStorage.getItem('citytoken');
        if (token) {
            setIsLogin(true);
        }
    }
    console.log(address)

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
        <View className=" flex flex-col  h-full bg-[#F6F7F8]  ">
            <View className='flex flex-row items-center justify-between w-full px-4 p-4 border-b border-gray-300'>
                <Image style={{ width: 20, height: 20 }} source={{ uri: 'https://img.icons8.com/?size=100&id=WWzSFZsWqPFD&format=png&color=1A1A1A' }} />
                <Text className='font-bold text-xl'>Report an Issue</Text>
                <Text></Text>
            </View>
            <View className='p-4'>
                <View className='flex flex-col gap-2'>
                    <Text className='text-[#96A4B1] font-medium'>Title</Text>
                    <TextInput
                        className="w-full bg-white p-4 rounded-lg mb-4 border border-blue-300 transition-all duration-300 ease-in-out outline-blue-400 outline-1 "
                        placeholder="Title"
                        value={complainForm.title}
                        onChangeText={(text) => setComplainForm({ ...complainForm, title: text })}

                    />
                </View>
                <View className='flex flex-col gap-2'>
                    <Text className='text-[#96A4B1] font-medium'>Describe the issue</Text>
                    <TextInput
                        className="w-full bg-white p-4 rounded-lg mb-4 border border-blue-300 transition-all duration-300 ease-in-out outline-blue-400 outline-1 "
                        placeholder="Description"
                        value={complainForm.description}
                        onChangeText={(text) => setComplainForm({ ...complainForm, description: text })}

                    />
                </View>
                <View className='flex flex-col gap-2'>
                    <Text className='text-[#96A4B1] font-medium'>Location</Text>
                    <TextInput
                        className="w-full bg-white p-4 rounded-lg mb-4 border border-blue-300 transition-all duration-300 ease-in-out outline-blue-400 outline-1 "
                        placeholder="Location"
                        value={complainForm.description}
                        onChangeText={(text) => setComplainForm({ ...complainForm, description: text })}
                        onFocus={getLocation}

                    />
                </View>
                <View className='flex flex-col gap-2'>
                    <Text className='text-[#96A4B1] font-medium'>Add Media</Text>
                    <View className='flex flex-row gap-2 justify-between w-full'>
                        <TouchableOpacity className='bg-[#DFE9F4] rounded-lg p-4 flex-1 items-center'>
                            <View className='flex flex-row items-center gap-2'>
                                <Image style={{ width: 20, height: 20 }} source={{ uri: 'https://img.icons8.com/?size=100&id=MKHxHdHEYEfC&format=png&color=1173D4' }} />
                                <Text className='text-[#1173D4] font-semibold'>Add Photo</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity className='bg-[#DFE9F4] rounded-lg p-4 flex-1 items-center'>
                            <View className='flex flex-row items-center gap-2'>
                                <Image style={{ width: 20, height: 20 }} source={{ uri: 'https://img.icons8.com/?size=100&id=alybng0KUhxp&format=png&color=1173D4' }} />
                                <Text className='text-[#1173D4] font-semibold'>Add Video</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
                <View className='mt-4'>
                    <TouchableOpacity className='bg-[#1173D4] p-3 items-center rounded-xl'>
                        <Text className='text-white font-medium'>Submit Issue</Text>
                    </TouchableOpacity>
                </View>
            </View>

        </View>
    );
};

export default RaiseComplainScreen;
