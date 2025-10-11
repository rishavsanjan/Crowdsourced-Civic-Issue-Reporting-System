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
import { Ionicons } from '@expo/vector-icons';

import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/navigation';
import API_BASE_IP from '../../../config/api';
import LottieView from 'lottie-react-native';
import Constants from 'expo-constants'
import { WebView } from "react-native-webview";

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

interface AdminstrativeComments extends Complaint {
    id: string
    createdAt: string
    comment: string
}

const ComplaintDetails: React.FC<Props> = ({ navigation, route }) => {
    const { googleApiKey } = Constants.expoConfig?.extra || {};
    const { complaintId } = route.params;
  const webviewRef = useRef<WebView>(null);

    const [complaint, setComplaint] = useState<Complaint | null>(null);
    const [mediaItems, setMediaItems] = useState([]);
    const flatListRef = useRef(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const [comments, setComments] = useState<AdminstrativeComments[]>([]);
    const [loading, setLoading] = useState(true);


    const getDetails = async () => {
        const token = await AsyncStorage.getItem('citytoken');
        const response = await axios({
            method: 'get',
            url: `${API_BASE_IP}/api/complain/complainDetail/${complaintId}`,
            headers: {
                'Authorization': 'Bearer ' + token
            }
        });
        setComplaint(response.data.response);
        setMediaItems(response.data.response.media);
        setComments(response.data.response.AdminstrativeComments);
        console.log(response.data);
        setLoading(false);
    }



    console.log(comments)

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
    }, []);

    function formatDate(isoString: string) {
        const date = new Date(isoString);
        const options = {
            day: "numeric",
            month: "long",
            year: "numeric",
            hour: "numeric",
            minute: "numeric",
            hour12: false,
        };

        return date.toLocaleString("en-GB");
    }

    if (loading) {
        return (
            <View className="flex-1 justify-center items-center">
                <View className="flex-1 justify-center items-center ">
                    <LottieView
                        source={require('../../../assets/loading_animations/loader.json')}
                        autoPlay
                        loop
                        speed={2}
                        style={{ width: 50, height: 50 }}
                    />
                </View>
            </View>
        )
    }

    const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="initial-scale=1.0, user-scalable=no" />
        <style>
          #map { height: 100%; width: 100%; }
          html, body { margin: 0; padding: 0; height: 100%; width: 100%; }
        </style>
        <script src="https://maps.googleapis.com/maps/api/js?key=${googleApiKey}"></script>
        <script>
          function initMap() {
            const initialPos = { lat: ${complaint?.latitude || 78}, lng: ${complaint?.longitude || 78} };
            const map = new google.maps.Map(document.getElementById('map'), {
              zoom: 15,
              center: initialPos,
            });
            const marker = new google.maps.Marker({
              position: initialPos,
              map: map,
              draggable: true
            });

          }
        </script>
      </head>
      <body onload="initMap()">
        <div id="map"></div>
      </body>
    </html>
  `;

    return (
        <SafeAreaView className="flex-1 bg-white">
            {/* Header */}
            <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-200">
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color="#000" />
                </TouchableOpacity>
                <Text className="text-lg font-semibold">Issue Details</Text>
                <Text className="text-lg font-semibold"></Text>

            </View>

            <ScrollView className="flex-1">
                {/* Media Carousel */}
                <FlatList
                    ref={flatListRef}
                    data={mediaItems || []}
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
                                <Image style={{ width: 30, height: 30 }} source={{ uri: 'https://img.icons8.com/?size=100&id=12582&format=png&color=228BE6' }} />
                            </View>
                            <Text className="text-xs text-gray-600">Pending</Text>
                        </View>

                        {/* Progress Line */}
                        <View className={`${complaint?.status === 'pending' ? 'bg-gray-300' : 'bg-green-500 '} h-1 flex-1 -mt-6`} />

                        {/* In Progress */}
                        <View className="flex-1 items-center">
                            <View className=" mb-2">
                                <Image style={{ width: 30, height: 30 }} source={{ uri: 'https://img.icons8.com/?size=100&id=71202&format=png&color=228BE6' }} />
                            </View>
                            <Text className="text-xs text-gray-600">In Progress</Text>
                        </View>

                        {/* Progress Line */}
                        <View className={`${complaint?.status === 'pending' || 'in_progress' ? 'bg-gray-300' : 'bg-green-500 '} h-1 flex-1 -mt-6`} />
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
                <View >
                    <Text className="text-lg font-bold text-gray-900 mb-3 px-4 ">Location</Text>
                    <View style={{ width: "100%", height: 200 }}>
                          <WebView
                            originWhitelist={['*']}
                            source={{ html }}
                          />
                        </View>
                    {/* <>
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
                    </> */}
                </View>


                {/* Updates */}
                <View className="px-4 pb-6">
                    <Text className="text-lg font-bold text-gray-900 mb-4">Updates</Text>

                    {/* Update 1 */}
                    {
                        comments.map((item) => (
                            <View key={item.id}>
                                <View className='flex flex-row justify-between'>
                                    <Text className='font-bold text-xl '>Admin</Text>
                                    <Text className='text-gray-600'>{formatDate(item.createdAt)}</Text>
                                </View>

                                <Text>{item.comment}</Text>
                            </View>
                        ))
                    }
                    {
                        comments.length === 0 &&
                        <View>
                            <Text className='text-center'>Officals have made no comment on this yet!</Text>
                        </View>
                    }
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default ComplaintDetails;
