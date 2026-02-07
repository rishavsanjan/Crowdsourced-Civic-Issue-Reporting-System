import React, { useEffect, useState, useMemo } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    Image,
    RefreshControl,
    TouchableWithoutFeedback,
} from 'react-native';
import { Toast } from 'toastify-react-native';
import * as Location from "expo-location";
import LottieView from 'lottie-react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/navigation';
import NetInfo from '@react-native-community/netinfo';
import Slider from '@react-native-community/slider';
import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchHomePosts } from '@/app/util/posts';
import StatusFilterTab from './components/StatusFilterTab';
import ComplainCard from './components/ComplainCard';
import { Button } from '@react-navigation/elements';
import { useAuth } from '@/app/context/auth-context';

type Props = NativeStackScreenProps<RootStackParamList, 'HomeScreen'>;


const HomeScreen: React.FC<Props> = ({ navigation }) => {
    const [selectedStatus, setSelectedStatus] = useState('all');
    const [isConnected, setIsConnected] = useState(true);
    const [distance, setDistance] = useState(8);
    const [coordinates, setCoordinates] = useState({
        lat: 0.0,
        long: 0.0
    });
    const {user} = useAuth();
    
     if(!user){
        console.log("user not available")
        navigation.navigate('WelcomeLoginScreen')
    }
    
    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener(state => {
            setIsConnected(state.isConnected ?? false);
        });

        return () => unsubscribe();
    }, []);

    const getLoc = async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
            Toast.error('Permission to access location was denied');
            return;
        }

        let loc = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.Highest,
        });
        setCoordinates(prev => ({ ...prev, lat: loc.coords.latitude, long: loc.coords.longitude }));
    };

    useEffect(() => {
        getLoc();
    }, []);

    const { data, fetchNextPage, isFetchingNextPage, isLoading, hasNextPage, refetch, isRefetching } = useInfiniteQuery({
        queryKey: ['home-posts', selectedStatus, distance, coordinates.lat, coordinates.long],
        //@ts-ignore
        queryFn: fetchHomePosts,
        initialPageParam: 1,
        getNextPageParam: (lastPage) => lastPage.nextPage,
        enabled: coordinates.lat !== 0 && coordinates.long !== 0,
    });

    // Flatten all pages into a single array
    const allComplaints = useMemo(() => {
        return data?.pages.flatMap(page => page.posts) ?? [];
    }, [data]);

    // Filter by status
    const filteredComplaints = useMemo(() => {
        if (selectedStatus === 'all') {
            return allComplaints;
        }
        return allComplaints.filter(complaint => complaint.status === selectedStatus);
    }, [allComplaints, selectedStatus]);


    console.log(data)

    const onRefresh = async () => {
        await refetch();
    };


    if (!isConnected) {
        return (
            <View className="flex-1 justify-center items-center">
                <View className="flex-1 justify-center items-center ">
                    <LottieView
                        source={require('../../../assets/loading_animations/404 error page with cat.json')}
                        style={{ width: 300, height: 300 }}
                    />
                    <Text className='text-xl'>You are not connected to the internet!</Text>
                </View>
            </View>
        );
    }

   


    const handleScroll = (event: any) => {
        const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
        const paddingToBottom = 100;

        if (layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom) {
            if (hasNextPage && !isFetchingNextPage) {
                console.log('Loading next page...');
                fetchNextPage();
            }
        }
    };

    return (
        <View className="flex-1 bg-[#F6F7F8]">
            {/* Header */}
            <View className="bg-white px-4 py-3 border-b border-gray-200">
                <View className=" items-center justify-between">
                    <Text className="text-lg font-bold text-center">FixMyCity</Text>
                </View>
            </View>

            {/* Status Filter Tabs */}
            <StatusFilterTab selectedStatus={selectedStatus} setSelectedStatus={setSelectedStatus} />

            <View className="bg-indigo-600  py-2 items-center mb-2 shadow-lg">
                <Text className="text-lg font-medium text-indigo-200">
                    Filter by distance
                </Text>
                <Text className="text-3xl font-bold text-white ">
                    {distance}
                </Text>
                <Text className="text-lg font-medium text-indigo-200">
                    kilometers
                </Text>
            </View>

            <Slider
                style={{ width: '100%', height: 20 }}
                minimumValue={0}
                maximumValue={100}
                step={1}
                value={distance}
                onValueChange={setDistance}
                minimumTrackTintColor="#6366f1"
                maximumTrackTintColor="#e5e7eb"
                thumbTintColor="#8b5cf6"
            />

            {/* Complaints Feed */}
            {isLoading ? (
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
            ) : (
                <ScrollView
                    className="flex-1 px-2"
                    onScroll={handleScroll}
                    scrollEventThrottle={400}
                    refreshControl={
                        <RefreshControl refreshing={isRefetching} onRefresh={onRefresh} />
                    }
                    showsVerticalScrollIndicator={false}
                >
                    {filteredComplaints.length === 0 ? (
                        <View className="flex-1 justify-center items-center mt-20">
                            <Text className="text-gray-500 text-lg">No complaints found</Text>
                            <Text className="text-gray-400 mt-2">Try changing the filter or pull to refresh</Text>
                        </View>
                    ) : (
                        filteredComplaints.map((complaint) => (
                            <View key={complaint.complaint_id}>
                                <ComplainCard key={complaint.complaint_id} navigation={navigation} selectedStatus={selectedStatus} complaint={complaint} distance={distance} latitude={coordinates.lat} longitute={coordinates.long} />
                            </View>

                        ))
                    )}

                    {/* Loading more indicator */}
                    {isFetchingNextPage && (
                        <View className="py-4">
                            <LottieView
                                source={require('../../../assets/loading_animations/loader.json')}
                                autoPlay
                                loop
                                speed={2}
                                style={{ width: 50, height: 50, alignSelf: 'center' }}
                            />
                        </View>
                    )}

                    {/* End of list indicator */}
                    {!hasNextPage && filteredComplaints.length > 0 && (
                        <View className='flex justify-center py-4'>
                            <Text className='text-black text-center text-xl'>No more reports!</Text>
                        </View>
                    )}

                    <View className="h-20" />
                </ScrollView>
            )}
            <TouchableWithoutFeedback 
            onPress={() => { 
                console.log('hello')
                navigation.navigate('WelcomeChatbot') }}>
                <Image style={{ width: 70, height: 70, bottom: 17, position: 'absolute', right: 20 }} src='https://img.icons8.com/?size=100&id=9Otd0Js4uSYi&format=png&color=000000' />
            </TouchableWithoutFeedback>
        </View>
    );
};

export default HomeScreen;