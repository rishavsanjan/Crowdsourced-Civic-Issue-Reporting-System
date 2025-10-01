import React, { useEffect, useRef, useState } from 'react';
import {
    View,
    Text,
    Image,
    ScrollView,
    TouchableOpacity,
    SafeAreaView,
    FlatList,
    Platform,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Toast } from 'toastify-react-native';
import { Video } from 'expo-av';

import MapView, { Marker } from "react-native-maps";

import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'ComplainDetails'>;

interface Complaint {
    address: string,
    complaint_id: number,
    createdAt: string,
    description: string,
    latitude: number,
    longitude: number,
    status: string,
    title: string,
    updatedAt: string,
    user_id: number,
    votes: {
        like: number;
        dislike: number;
        userReaction: 'like' | 'dislike' | null;
    };
}

const ComplaintDetails: React.FC<Props> = ({ navigation, route }) => {
    const { complaintId } = route.params;

    const [complaint, setComplaint] = useState<Complaint | null>(null);
    const [mediaItems, setMediaItems] = useState([]);
    const flatListRef = useRef(null);
    const [activeIndex, setActiveIndex] = useState(0);


    const getDetails = async () => {
        const token = await AsyncStorage.getItem('citytoken');
        const response = await axios({
            method: 'get',
            url: `http://10.11.8.198:3000/api/complain/complainDetail/${complaintId}`,
            headers: {
                'Authorization': 'Bearer ' + token
            }
        });
        setComplaint(response.data.response);
        setMediaItems(response.data.response.media);
        console.log(response.data);

    }

    const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
        if (viewableItems.length > 0) {
            setActiveIndex(viewableItems[0].index);
        }
    }).current;

    const viewabilityConfig = useRef({
        itemVisiblePercentThreshold: 50,
    }).current;

    const renderMediaItem = ({ item }: any) => {
        if (item.file_type === 'image') {
            return (
                <Image
                    source={{ uri: item.file_url }}
                    style={{ height: 250, width: 400 }}
                    resizeMode="cover"
                />
            );
        } else if (item.file_type === 'video') {
            return (
                <Video
                    source={{ uri: item.file_url }}
                    style={{ width: 400, height: 250 }}
                    useNativeControls
                    shouldPlay={false}
                    //@ts-ignore
                    resizeMode='cover'
                />
            );
        }
    }




    useEffect(() => {
        getDetails();
    }, [])

    console.log(mediaItems)
    return (
        <SafeAreaView className="flex-1 bg-white">
            {/* Header */}
            <View className="flex-row items-center px-4 py-3 border-b border-gray-200">
                <TouchableOpacity className="mr-4">
                    <Image style={{ width: 20, height: 20 }} source={{ uri: 'https://img.icons8.com/?size=100&id=100033&format=png&color=000000' }} />
                </TouchableOpacity>
                <Text className="text-lg font-semibold">Issue Details</Text>
            </View>

            <ScrollView className="flex-1">
                {/* Media Carousel */}
                <FlatList
                    ref={flatListRef}
                    data={mediaItems}
                    //@ts-ignore
                    renderItem={renderMediaItem}
                    keyExtractor={(item, index) => index.toString()}
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    onViewableItemsChanged={onViewableItemsChanged}
                    viewabilityConfig={viewabilityConfig}
                />

                {/* Issue Title and Reporter */}
                <View className="px-4 py-4">
                    <Text className="text-2xl font-bold text-gray-900 mb-2">
                        {complaint?.title}
                    </Text>
                    <Text className="text-sm text-gray-500">
                        Reported by Aadhaar ID: **** **** 1234
                    </Text>
                </View>

                {/* Action Buttons */}
                <View className="flex-row px-4 pb-4 gap-3">
                    <TouchableOpacity className="flex-1 flex-row items-center justify-center bg-blue-50 py-3 rounded-lg">
                        <Image style={{ width: 20, height: 20 }} source={{ uri: 'https://img.icons8.com/?size=100&id=96384&format=png&color=000000' }} />
                        <Text className="text-blue-600 font-semibold ml-2">Upvote (125)</Text>
                    </TouchableOpacity>
                    <TouchableOpacity className="flex-1 flex-row items-center justify-center bg-gray-100 py-3 rounded-lg">
                        <Text className="text-gray-700 font-semibold ml-2">Follow Issue</Text>
                    </TouchableOpacity>
                </View>

                {/* Description */}
                <View className="px-4 pb-4">
                    <Text className="text-gray-700 leading-6">
                        {complaint?.description}
                    </Text>
                </View>

                {/* Status */}
                <View className="px-4 pb-4">
                    <Text className="text-lg font-bold text-gray-900 mb-3">Status</Text>
                    <View className="flex-row items-center">
                        {/* Pending */}
                        <View className="flex-1 items-center">
                            <View>
                                <Image style={{ width: 30, height: 30 }} source={{ uri: 'https://img.icons8.com/?size=100&id=10058&format=png&color=40C057' }} />
                            </View>
                            <Text className="text-xs text-gray-600">Pending</Text>
                        </View>

                        {/* Progress Line */}
                        <View className={`${complaint?.status === 'pending' ? 'bg-gray-300' : 'bg-green-500 '} h-0.5 flex-1 -mt-6`} />

                        {/* In Progress */}
                        <View className="flex-1 items-center">
                            <View className=" mb-2">
                                <Image style={{ width: 30, height: 30 }} source={{ uri: 'https://img.icons8.com/?size=100&id=49170&format=png&color=228BE6' }} />
                            </View>
                            <Text className="text-xs text-gray-600">In Progress</Text>
                        </View>

                        {/* Progress Line */}
                        <View className="h-0.5 bg-gray-300 flex-1 -mt-6" />

                        {/* Resolved */}
                        <View className="flex-1 items-center">
                            <View className=" mb-2">
                                <Image style={{ width: 30, height: 30 }} source={{ uri: 'https://img.icons8.com/?size=100&id=gWpFZsHoozrx&format=png&color=40C057' }} />
                            </View>
                            <Text className="text-xs text-gray-600">Resolved</Text>
                        </View>
                    </View>
                </View>


                {/* Location */}
                <Text className="text-lg font-bold text-gray-900 mb-3">Location</Text>
                {Platform.OS === "android" && (
                    <>
                        <MapView
                            style={{ width: "100%", height: 200, marginVertical: 10 }}
                            initialRegion={{
                                latitude: complaint?.latitude || 78,
                                longitude: complaint?.longitude || 23,
                                latitudeDelta: 0.01,
                                longitudeDelta: 0.01,
                            }}

                        >
                            <Marker
                                coordinate={{
                                    latitude: complaint?.latitude || 78,
                                    longitude: complaint?.longitude || 23
                                }}
                            />
                        </MapView>
                    </>
                )}

                {/* Updates */}
                <View className="px-4 pb-6">
                    <Text className="text-lg font-bold text-gray-900 mb-4">Updates</Text>

                    {/* Update 1 */}
                    <View className="flex-row mb-4">
                        <Image
                            source={{ uri: 'https://i.pravatar.cc/150?img=12' }}
                            className="w-10 h-10 rounded-full mr-3"
                        />
                        <View className="flex-1">
                            <View className="flex-row items-center mb-1">
                                <Text className="font-semibold text-gray-900 mr-2">Admin</Text>
                                <Text className="text-xs text-gray-500">1d ago</Text>
                            </View>
                            <Text className="text-gray-700 leading-5">
                                Team has inspected the site and scheduled repairs for tomorrow.
                            </Text>
                        </View>
                    </View>

                    {/* Update 2 */}
                    <View className="flex-row">
                        <Image
                            source={{ uri: 'https://i.pravatar.cc/150?img=13' }}
                            className="w-10 h-10 rounded-full mr-3"
                        />
                        <View className="flex-1">
                            <View className="flex-row items-center mb-1">
                                <Text className="font-semibold text-gray-900 mr-2">Admin</Text>
                                <Text className="text-xs text-gray-500">2d ago</Text>
                            </View>
                            <Text className="text-gray-700 leading-5">
                                Issue received and assigned to the road maintenance team.
                            </Text>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default ComplaintDetails;
