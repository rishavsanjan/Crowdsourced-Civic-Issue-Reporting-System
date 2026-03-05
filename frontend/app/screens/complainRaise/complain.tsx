import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Image,
    Platform,
    Alert,
    ScrollView,
    ActivityIndicator
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import * as ImagePicker from 'expo-image-picker';
import { useTranslation } from "react-i18next";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../navigation/navigation";
import axios from "axios";
import { Toast } from 'toastify-react-native';
import NetInfo from '@react-native-community/netinfo';
import API_BASE_IP from '../../../config/api';
import Constants from 'expo-constants'
import MapPicker from '../../../config/MapPicker'
import { uploadToCloudinary } from "@/app/util/cloudinary";
import { pickImage, pickVideo, takePhoto } from "@/app/util/image";
import { fetchAddress } from "@/app/util/address";
import { getLocation } from "@/app/util/get-location";
import { useMutation } from "@tanstack/react-query";
type Props = NativeStackScreenProps<RootStackParamList, "RaiseComplainScreen">;

interface MediaItem {
    id: string;
    type: 'photo' | 'video';
    uri: string;
    cloudinaryUrl?: string;
}

const RaiseComplainScreen: React.FC<Props> = ({ navigation }) => {
    const { googleApiKey } = Constants.expoConfig?.extra || {};
    const { t } = useTranslation();
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [location, setLocation] = useState({ latitude: 28.6139, longitude: 77.2090 });
    const [address, setAddress] = useState("");
    const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
    const [isConnected, setIsConnected] = useState(true);



    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener(state => {
            setIsConnected(state.isConnected ?? false);
        });

        return () => unsubscribe();
    }, []);


    useEffect(() => {
        requestMediaPermissions();
    }, []);

    const uploadComplaintMutation = useMutation({
        mutationKey: ['complaint-raise'],
        mutationFn: async () => {
            const uploadedMediaUrls = [];
            for (const mediaItem of mediaItems) {
                try {
                    const cloudinaryUrl = await uploadToCloudinary(
                        mediaItem.uri,
                        mediaItem.type === 'photo' ? 'image' : 'video'
                    );
                    console.log(cloudinaryUrl)
                    uploadedMediaUrls.push({
                        type: mediaItem.type,
                        url: cloudinaryUrl
                    });
                } catch (uploadError) {
                    console.error(`Failed to upload ${mediaItem.type}:`, uploadError);
                    Toast.error(`Failed to upload ${mediaItem.type}`);
                }
            }

            const token = await AsyncStorage.getItem('citytoken');
            const response = await axios({
                url: `${API_BASE_IP}/api/user/addcomplain`,
                method: 'POST',
                data: {
                    category: 'other',
                    title: title,
                    description: description,
                    latitude: location.latitude,
                    longitude: location.longitude,
                    address: address,
                    media: uploadedMediaUrls,
                },
                headers: {
                    'Authorization': "Bearer " + token
                }
            });
            console.log(response.data)
            return response.data;
        },
        onError: () => {
            Toast.error('Failed to submit complaint');
        },
        onSuccess: () => {
            Toast.success('Complaint raised successfully!');
            setTitle('');
            setDescription('');
            setAddress('');
            setMediaItems([]);
        }
    })

    const requestMediaPermissions = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Sorry, we need camera roll permissions to make this work!');
        }
    };


    const removeMediaItem = (id: string) => {
        setMediaItems(prev => prev.filter(item => item.id !== id));
    };

    const showPhotoOptions = () => {
        Alert.alert(
            "Add Photo",
            "Choose an option",
            [
                { text: "Camera", onPress: () => takePhoto(setMediaItems) },
                { text: "Gallery", onPress: () => pickImage(setMediaItems) },
                { text: "Cancel", style: "cancel" }
            ]
        );
    };


    return (
        <ScrollView className="flex-1 bg-[#F6F7F8]">
            {/* Header */}
            <View className="flex flex-row items-center justify-center w-full px-4 p-4 border-b border-gray-300">

                <Text className="font-bold text-xl">{t('reportIssue')}</Text>
            </View>

            {/* Form */}
            <View className="p-4 flex-1">
                {/* Title */}
                <View className="flex flex-col gap-2 mb-4">
                    <Text className="text-[#96A4B1] font-medium">{t('title')}</Text>
                    <TextInput
                        className="w-full bg-white p-4 rounded-lg border border-blue-300"
                        placeholder={t('title')}
                        value={title}
                        onChangeText={setTitle}
                    />
                </View>



                {/* Description */}
                <View className="flex flex-col gap-2 mb-4">
                    <Text className="text-[#96A4B1] font-medium">{t('description')}</Text>
                    <TextInput
                        className="w-full bg-white p-4 rounded-lg border border-blue-300"
                        placeholder={t('describeIssue')}
                        value={description}
                        onChangeText={setDescription}
                        multiline
                        numberOfLines={4}
                    />
                </View>

                {/* Location */}
                <View className="flex flex-col gap-2 mb-4">
                    <Text className="text-[#96A4B1] font-medium">{t('location')}</Text>
                    <TextInput
                        className="w-full bg-white p-4 rounded-lg border border-blue-300"
                        placeholder={t('fetchingLocation')}
                        value={address}
                        onFocus={getLocation}
                    />
                </View>

                {/* Map */}
                <MapPicker
                    latitude={location.latitude}
                    longitude={location.longitude}
                    googleApiKey={googleApiKey}
                    onLocationSelect={(lat, lng) => {
                        setLocation({ latitude: lat, longitude: lng });
                        fetchAddress(lat, lng, setAddress);
                    }}
                />



                {address ? (
                    <Text className="text-[#1173D4] font-semibold mt-2">📍 {address}</Text>
                ) : null}

                {/* Add Media */}
                <View className="flex flex-col gap-2 mb-4">
                    <Text className="text-[#96A4B1] font-medium">{t('addMedia')}</Text>
                    <View className="flex flex-row gap-2 justify-between w-full">

                        <TouchableOpacity
                            className="bg-[#DFE9F4] rounded-lg p-4 flex-1 items-center"
                            onPress={showPhotoOptions}
                        >
                            <View className="flex flex-row items-center gap-2">
                                <Image
                                    style={{ width: 20, height: 20 }}
                                    source={{
                                        uri: "https://img.icons8.com/?size=100&id=MKHxHdHEYEfC&format=png&color=1173D4",
                                    }}
                                />
                                <Text className="text-[#1173D4] font-semibold">{t('addPhoto')}</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity
                            className="bg-[#DFE9F4] rounded-lg p-4 flex-1 items-center"
                            onPress={() => { pickVideo(setMediaItems) }}
                        >
                            <View className="flex flex-row items-center gap-2">
                                <Image
                                    style={{ width: 20, height: 20 }}
                                    source={{
                                        uri: "https://img.icons8.com/?size=100&id=alybng0KUhxp&format=png&color=1173D4",
                                    }}
                                />
                                <Text className="text-[#1173D4] font-semibold">{t('addVideo')}</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Media Preview */}
                {mediaItems.length > 0 && (
                    <View className="flex flex-col gap-2 mb-4 ">
                        <Text className="text-[#96A4B1] font-medium">Preview</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                            <View className="flex flex-row gap-2">
                                {mediaItems.map((item) => (
                                    <View key={item.id} className="relative mt-2">
                                        {item.type === 'photo' ? (
                                            <Image
                                                source={{ uri: item.uri }}
                                                className="w-24 h-24 rounded-lg"
                                                resizeMode="cover"
                                            />
                                        ) : (
                                            <View className="w-24 h-24 rounded-lg bg-gray-300 justify-center items-center">
                                                <View className="w-full h-full justify-center items-center bg-blue-100 rounded-lg">
                                                    <Text className="text-blue-600 text-xs font-bold">VIDEO</Text>
                                                    <Text className="text-blue-600 text-xs">📹</Text>
                                                </View>
                                            </View>
                                        )}
                                        <TouchableOpacity
                                            className="absolute -top-2 -right-2 bg-red-500 rounded-full w-6 h-6 justify-center items-center"
                                            onPress={() => removeMediaItem(item.id)}
                                        >
                                            <Text className="text-white text-xs font-bold">×</Text>
                                        </TouchableOpacity>
                                    </View>
                                ))}
                            </View>
                        </ScrollView>
                    </View>
                )}

                {/* Submit */}
                <View className="mt-4">
                    <TouchableOpacity
                        className={`p-3 items-center rounded-xl bg-[#1173D4] disabled:opacity-75`}
                        onPress={() => {
                            if (!isConnected) {
                                Toast.error("You are not connected to the internet!")
                                return;
                            }
                            uploadComplaintMutation.mutate();
                        }}
                        disabled={
                            uploadComplaintMutation.isPending
                            || title.length < 10
                            || description.length < 10
                            || mediaItems.length < 1
                        }
                    >
                        {uploadComplaintMutation.isPending ? (
                            <View className="flex-row items-center">
                                <ActivityIndicator color="white" size="small" />
                                <Text className="text-white font-medium ml-2">Uploading...</Text>
                            </View>
                        ) : (
                            <Text className="text-white font-medium">{t('submitIssue')}</Text>
                        )}
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    );
};

export default RaiseComplainScreen;