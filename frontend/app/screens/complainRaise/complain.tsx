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
type Props = NativeStackScreenProps<RootStackParamList, "RaiseComplainScreen">;

interface MediaItem {
    id: string;
    type: 'photo' | 'video';
    uri: string;
    cloudinaryUrl?: string;
}

const RaiseComplainScreen: React.FC<Props> = ({ navigation }) => {
    const { googleApiKey } = Constants.expoConfig?.extra || {};
    console.log(googleApiKey)
    const { t } = useTranslation();
    const [isLogin, setIsLogin] = useState(false);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [location, setLocation] = useState({ latitude: 28.6139, longitude: 77.2090 }); // default Delhi
    const [address, setAddress] = useState("");
    const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
    const [uploading, setUploading] = useState(false);
    const [isConnected, setIsConnected] = useState(true);

    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener(state => {
            setIsConnected(state.isConnected ?? false);
        });

        return () => unsubscribe();
    }, []);


    // Cloudinary configuration
    const CLOUDINARY_CLOUD_NAME = "diwmvqto3"; 
    const CLOUDINARY_UPLOAD_PRESET = "crowd-app"; 

    // Get login status
    const getLoginStatus = async () => {
        const token = await AsyncStorage.getItem("citytoken");
        if (token) {
            setIsLogin(true);
        }
    };

    useEffect(() => {
        getLoginStatus();
        requestMediaPermissions();
    }, []);

    // Request media permissions
    const requestMediaPermissions = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Sorry, we need camera roll permissions to make this work!');
        }
    };

    // Upload to Cloudinary
    const uploadToCloudinary = async (uri: string, type: 'image' | 'video') => {
        try {
            const formData = new FormData();
            formData.append('file', {
                uri,
                type: type === 'image' ? 'image/jpeg' : 'video/mp4',
                name: type === 'image' ? 'photo.jpg' : 'video.mp4',
            } as any);
            formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
            formData.append('resource_type', type);

            const response = await fetch(
                `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/${type}/upload`,
                {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );

            const data = await response.json();

            if (data.secure_url) {
                return data.secure_url;
            } else {
                throw new Error('Upload failed');
            }
        } catch (error) {
            console.error('Cloudinary upload error:', error);
            throw error;
        }
    };

    // Pick image from gallery
    const pickImage = async () => {
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 0.8,
            });

            if (!result.canceled) {
                const newMediaItem: MediaItem = {
                    id: Date.now().toString(),
                    type: 'photo',
                    uri: result.assets[0].uri,
                };
                setMediaItems(prev => [...prev, newMediaItem]);
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to pick image');
        }
    };

    // Pick video from gallery
    const pickVideo = async () => {
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Videos,
                allowsEditing: true,
                quality: 0.8,
            });

            if (!result.canceled) {
                const newMediaItem: MediaItem = {
                    id: Date.now().toString(),
                    type: 'video',
                    uri: result.assets[0].uri,
                };
                setMediaItems(prev => [...prev, newMediaItem]);
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to pick video');
        }
    };

    // Take photo with camera
    const takePhoto = async () => {
        try {
            const { status } = await ImagePicker.requestCameraPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Sorry, we need camera permissions to make this work!');
                return;
            }

            const result = await ImagePicker.launchCameraAsync({
                allowsEditing: true,
                aspect: [4, 3],
                quality: 0.8,
            });

            if (!result.canceled) {
                const newMediaItem: MediaItem = {
                    id: Date.now().toString(),
                    type: 'photo',
                    uri: result.assets[0].uri,
                };
                setMediaItems(prev => [...prev, newMediaItem]);
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to take photo');
        }
    };

    // Remove media item
    const removeMediaItem = (id: string) => {
        setMediaItems(prev => prev.filter(item => item.id !== id));
    };

    // Show photo options
    const showPhotoOptions = () => {
        Alert.alert(
            "Add Photo",
            "Choose an option",
            [
                { text: "Camera", onPress: takePhoto },
                { text: "Gallery", onPress: pickImage },
                { text: "Cancel", style: "cancel" }
            ]
        );
    };

    // Fetch address from Google Maps API
    const fetchAddress = async (lat: number, lng: number) => {
        try {
            const apiKey = googleApiKey;
            const response = await fetch(
                `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`
            );
            const data = await response.json();
            if (data.results.length > 0) {
                setAddress(data.results[0].formatted_address);
            } else {
                setAddress("Address not found");
            }
        } catch (error) {
            setAddress("Error fetching address");
        }
    };

    // Get current device location
    const getLocation = async () => {
        try {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== "granted") {
                Toast.error('Permission to access location was denied');
                return;
            }

            let loc = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.Highest,
            });

            setLocation(loc.coords);
            fetchAddress(loc.coords.latitude, loc.coords.longitude);
        } catch (err: any) {
            Toast.error(`${err.message}`);
        }
    };

    // Submit issue
    const handleSubmit = async () => {
        try {
            setUploading(true);

            // Upload all media to Cloudinary first
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

            console.log(uploadedMediaUrls)
            console.log('hello')
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
                    media: uploadedMediaUrls, // Send uploaded media URLs
                },
                headers: {
                    'Authorization': "Bearer " + token
                }
            });
            console.log(response.data)

            Toast.success('Complaint raised successfully!');
            setTitle('');
            setDescription('');
            setAddress('');
            setMediaItems([]);

        } catch (error) {
            console.error(error);
            Toast.error('Failed to submit complaint');
        } finally {
            setUploading(false);
        }
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
                        fetchAddress(lat, lng);
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
                            onPress={pickVideo}
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
                        className={`p-3 items-center rounded-xl ${uploading ? 'bg-gray-400' : 'bg-[#1173D4]'}`}
                        onPress={handleSubmit}
                        disabled={uploading}
                    >
                        {uploading ? (
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