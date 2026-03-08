import React, { useRef, useState } from 'react';
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


import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/navigation';
import API_BASE_IP from '../../../config/api';
import Constants from 'expo-constants'
import { WebView } from "react-native-webview";
import Status from './components/Status';
import { useQuery } from '@tanstack/react-query';
import Header from '../components/Header';
import Loading from '../components/Loading';
import { useTranslation } from 'react-i18next';

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
    const {t} = useTranslation();
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

    function formatDate(isoString: string) {
        const date = new Date(isoString);
        return date.toLocaleString("en-GB");
    }

    if (isLoading) {
        return (
            <Loading/>
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
        <SafeAreaView className="flex-1 bg-white dark:bg-[#101922]">
            {/* Header */}
            <Header tabName={t('detail')} goBack={true} />

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
                    <Text className="text-2xl font-bold text-gray-900 mb-2 dark:text-white">
                        {data?.title}
                    </Text>
                    <Text className="text-sm text-gray-500">
                        Reported by Aadhaar ID: **** **** 1234
                    </Text>
                </View>


                {/* Description */}
                <View className="px-4 pb-4">
                    <Text className="text-gray-700 leading-6 dark:text-white">
                        {data?.description}
                    </Text>
                </View>

                {/* Status */}
                <Status status={data.status} />

                {/* Location */}
                <View >
                    <Text className="text-lg font-bold text-gray-900 mb-3 px-4 ">{t('location')}</Text>
                    <View style={{ width: "100%", height: 200 }}>
                        <WebView
                            originWhitelist={['*']}
                            source={{ html }}
                        />
                    </View>
                </View>


                {/* Updates */}
                <View className="px-4 pb-6">
                    <Text className="text-lg font-bold text-gray-900 mb-4">{t('updates')}</Text>

                    {/* Update 1 */}
                    {
                        data.AdminstrativeComments.map((item) => (
                            <View
                                className='mb-2'
                                key={item.id}>
                                <View className='flex flex-row justify-between'>
                                    <Text className='font-bold text-xl  dark:text-white'>{t('admin')}</Text>
                                    <Text className='text-gray-600 dark:text-white'>{formatDate(item.createdAt)}</Text>
                                </View>

                                <Text className='dark:text-white'>{item.comment}</Text>
                            </View>
                        ))
                    }
                    {
                        data.AdminstrativeComments.length === 0 &&
                        <View>
                            <Text className='text-center dark:text-white'>{t('Officals have made no comment on this yet!')}</Text>
                        </View>
                    }
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default ComplaintDetails;
