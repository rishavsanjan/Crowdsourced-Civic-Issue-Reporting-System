import React, {  useRef, useState } from 'react';
import {
    View,
    Text,
    Image,
    ScrollView,
    TouchableOpacity,
    SafeAreaView,
    FlatList,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Video } from 'expo-av';

import { Ionicons } from '@expo/vector-icons';

import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/navigation';
import API_BASE_IP from '../../../config/api';
import LottieView from 'lottie-react-native';
import Constants from 'expo-constants'
import { WebView } from "react-native-webview";
import Status from './components/Status';
import { useQuery } from '@tanstack/react-query';

type Props = NativeStackScreenProps<RootStackParamList, 'ComplainDetails'>;

interface AdminstrativeComments {
    id: string
    createdAt: string
    comment: string
}

interface Response {
    complaint_id: number;
    title: string;
    description: string;
    status: 'pending' | 'in_progress' | 'resolved';
    createdAt: string;
    latitude?: number;
    longitude?: number;
    media: {
        file_url: string;
        file_type: 'image' | 'video';
    }[];
    votes: {
        like: number;
        dislike: number;
        userReaction: 'like' | 'dislike' | null;
    };
    AdminstrativeComments: AdminstrativeComments[]
}


const ComplaintDetails: React.FC<Props> = ({ navigation, route }) => {
    const { googleApiKey } = Constants.expoConfig?.extra || {};
    const { complaintId } = route.params;

    const flatListRef = useRef(null);
    const [activeIndex, setActiveIndex] = useState(0);


    const { data, isLoading } = useQuery({
        queryKey: ['post-detail'],
        queryFn: async () => {
            const token = await AsyncStorage.getItem('citytoken');
            const response = await axios({
                method: 'get',
                url: `${API_BASE_IP}/api/complain/complainDetail/${complaintId}`,
                headers: {
                    'Authorization': 'Bearer ' + token
                }
            });
            console.log(response)
            return response.data.response as Response

        }
    })


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

    console.log(data)


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

    if (isLoading) {
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
            const initialPos = { lat: ${data?.latitude || 78}, lng: ${data?.longitude || 78} };
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

    if (!data) {
        return;
    }

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
                    data={data?.media || []}
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
                        {data?.title}
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
                        {data?.description}
                    </Text>
                </View>

                {/* Status */}
                <Status status={data.status} />

                {/* Location */}
                <View >
                    <Text className="text-lg font-bold text-gray-900 mb-3 px-4 ">Location</Text>
                    <View style={{ width: "100%", height: 200 }}>
                        <WebView
                            originWhitelist={['*']}
                            source={{ html }}
                        />
                    </View>
                </View>


                {/* Updates */}
                <View className="px-4 pb-6">
                    <Text className="text-lg font-bold text-gray-900 mb-4">Updates</Text>

                    {/* Update 1 */}
                    {
                        data.AdminstrativeComments.map((item) => (
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
                        data.AdminstrativeComments.length === 0 &&
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
