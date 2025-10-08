import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    Image,
    RefreshControl,
    ActivityIndicator
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Toast } from 'toastify-react-native';
import * as Location from "expo-location";
import API_BASE_IP from '../../../config/api';
import LottieView from 'lottie-react-native';

import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/navigation';
import NetInfo from '@react-native-community/netinfo';

type Props = NativeStackScreenProps<RootStackParamList, 'HomeScreen'>;

interface Complaint {
    complaint_id: number;
    title: string;
    description: string;
    status: 'pending' | 'in_progress' | 'resolved';
    category: string;
    address: string;
    created_at: string;
    latitude?: number;
    longitude?: number;
    user: {
        id: number;
        name: string;
    };
    media: Array<{
        media_id: number;
        file_url: string;
        file_type: 'image' | 'video';
    }>;
    votes: {
        like: number;
        dislike: number;
        userReaction: 'like' | 'dislike' | null;
    };
    _count?: {
        votes: number;
    };
}

const HomeScreen: React.FC<Props> = ({ navigation }) => {
    const [selectedStatus, setSelectedStatus] = useState('all');
    const [isLogin, setIsLogin] = useState(false);
    const [complaints, setComplaints] = useState<Complaint[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [filteredComplaints, setFilteredComplaints] = useState<Complaint[]>([]);
    const [isConnected, setIsConnected] = useState(true);

    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener(state => {
            setIsConnected(state.isConnected ?? false);
        });

        return () => unsubscribe();
    }, []);

    if (!isConnected) {
        return (
            < View className="flex-1 justify-center items-center" >
                <View className="flex-1 justify-center items-center ">
                    <LottieView
                        source={require('../../../assets/loading_animations/404 error page with cat.json')}
                        style={{ width: 300, height: 300 }}
                    />
                    <Text className='text-xl'>You are not connected to the internet!</Text>
                </View>
            </View >
        )
    }


    const getLoginStatus = async () => {
        const token = await AsyncStorage.getItem('citytoken');
        if (token) {
            setIsLogin(true);
        } else {
            navigation.navigate('WelcomeLoginScreen');
        }
    }

    const getLocation = async () => {
        try {
            setLoading(true);
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== "granted") {
                Toast.error('Permission to access location was denied');
                return;
            }

            let loc = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.Highest,
            });
            const token = await AsyncStorage.getItem('citytoken');
            const response = await axios({
                method: 'POST',
                url: `http://${API_BASE_IP}:3000/api/complain/getHomeComplaints`,
                data: {
                    userLat: loc.coords.latitude,
                    userLng: loc.coords.longitude
                },
                headers: {
                    'Authorization': 'Bearer ' + token
                }
            });

            console.log(response.data);
            if (response.data.complaints) {
                setComplaints(response.data.complaints);
                setFilteredComplaints(response.data.complaints);
            }
        } catch (err: any) {
            console.log(err);
            Toast.error(`${err.message}`);
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        getLoginStatus();
        getLocation();

    }, []);

    const onRefresh = async () => {
        setRefreshing(true);
        await getLocation();
        setRefreshing(false);
    };



    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending':
                return '#FF9500';
            case 'in_progress':
                return '#007AFF';
            case 'resolved':
                return '#34C759';
            default:
                return '#8E8E93';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'pending':
                return 'https://img.icons8.com/?size=100&id=37439&format=png&color=FAB005';
            case 'in_progress':
                return 'https://img.icons8.com/?size=100&id=71202&format=png&color=228BE6';
            case 'resolved':
                return 'https://img.icons8.com/?size=100&id=114054&format=png&color=40C057';
            default:
                return '#8E8E93';
        }
    }

    const getStatusText = (status: string) => {
        switch (status) {
            case 'pending':
                return 'Pending';
            case 'in_progress':
                return 'In Progress';
            case 'resolved':
                return 'Resolved';
            default:
                return status;
        }
    };

    const getPriorityColor = (status: string) => {
        // You can implement priority logic here
        return '#FF4444'; // High priority red for demo
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
        });
    };

    const truncateText = (text: string, maxLength: number) => {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    };




    const addVote = async (complaint_id: number, vote_type: 'like' | 'dislike' | null, currentReaction: 'like' | 'dislike' | null) => {
        if (currentReaction === null) {
            const token = await AsyncStorage.getItem('citytoken');
            const response = await axios({
                method: 'POST',
                url: `http://${API_BASE_IP}:3000/api/complain/addvote`,
                data: {
                    complaint_id,
                    vote_type
                },
                headers: {
                    'Authorization': ' Bearer ' + token
                }
            });
            console.log(response.data)
            setFilteredComplaints(prevPosts =>
                prevPosts.map((post) => {
                    if (post.complaint_id !== complaint_id) return post;
                    const newVotes = { ...post.votes };
                    if (vote_type === 'like') {
                        newVotes.like += 1;
                    }
                    if (vote_type === 'dislike') {
                        newVotes.dislike += 1;
                    }
                    newVotes.userReaction = vote_type;
                    return {
                        ...post,
                        votes: newVotes
                    }
                })
            )
        } else {
            const token = await AsyncStorage.getItem('citytoken');
            const response = await axios({
                method: 'POST',
                url: `http://${API_BASE_IP}:3000/api/complain/updatevote`,
                data: {
                    complaint_id,
                    vote_type
                },
                headers: {
                    'Authorization': ' Bearer ' + token
                }
            });
            setFilteredComplaints(prevPosts =>
                prevPosts.map(post => {
                    if (post.complaint_id !== complaint_id) return post;
                    const newVotes = { ...post.votes };
                    if (vote_type === 'like') {
                        newVotes.like += 1;
                        newVotes.dislike -= 1;
                    };
                    if (vote_type === 'dislike') {
                        newVotes.dislike += 1
                        newVotes.like -= 1;
                    };
                    newVotes.userReaction = vote_type;
                    return {
                        ...post,
                        votes: newVotes
                    };
                }))
            return;
        }
    }

    const removeVote = async (complaint_id: number, vote_type: 'like' | 'dislike' | null, currentReaction: 'like' | 'dislike' | null) => {
        console.log(complaint_id, vote_type)
        const token = await AsyncStorage.getItem('citytoken');


        const response = await axios({
            method: 'POST',
            url: `http://${API_BASE_IP}:3000/api/complain/removevote`,
            data: {
                complaint_id,
                vote_type
            },
            headers: {
                'Authorization': ' Bearer ' + token
            }
        });
        setFilteredComplaints(prevPosts =>
            prevPosts.map(post => {
                if (post.complaint_id !== complaint_id) return post;
                const newVotes = { ...post.votes };
                if (currentReaction === 'like') newVotes.like -= 1;
                if (currentReaction === 'dislike') newVotes.dislike -= 1;
                newVotes.userReaction = null;
                return {
                    ...post,
                    votes: newVotes
                }
            })
        )
    }

    useEffect(() => {
        if (selectedStatus === 'all') {
            setFilteredComplaints(complaints)
        } else {
            setFilteredComplaints(
                complaints.filter((complaint) => complaint.status === selectedStatus)
            );
        }

    }, [selectedStatus])

    return (
        <View className="flex-1 bg-[#F6F7F8]">
            {/* Header */}
            <View className="bg-white px-4 py-3 border-b border-gray-200">
                <View className=" items-center justify-between">

                    <Text className="text-lg font-bold text-center">CivicVoice</Text>

                </View>
            </View>

            {/* Status Filter Tabs */}
            <View className='flex flex-row justify-between mb-4 w-full px-4 mt-4'>
                <TouchableOpacity
                    onPress={() => { setSelectedStatus('all') }}
                    className={`${selectedStatus === 'all' ? 'bg-blue-600' : 'bg-[#DAE6F8] '} p-2 px-4 items-center rounded-2xl`}
                >
                    <Text className={`${selectedStatus === 'all' ? 'text-white' : 'text-blue-500'} font-medium`}>All</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => { setSelectedStatus('pending') }}
                    className={`${selectedStatus === 'pending' ? 'bg-blue-600' : 'bg-[#DAE6F8] '}  p-2 px-4 items-center rounded-2xl`}
                >
                    <Text className={`${selectedStatus === 'pending' ? 'text-white' : 'text-blue-500'} font-medium`}>Pending</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => { setSelectedStatus('in_progress') }}
                    className={`${selectedStatus === 'in_progress' ? 'bg-blue-600' : 'bg-[#DAE6F8] '}  p-2 px-4 items-center rounded-2xl`}
                >
                    <Text className={`${selectedStatus === 'in_progress' ? 'text-white' : 'text-blue-500'} font-medium`}>In-Progress</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => { setSelectedStatus('resolved') }}
                    className={`${selectedStatus === 'resolved' ? 'bg-blue-600' : 'bg-[#DAE6F8] '}  p-2 px-4 items-center rounded-2xl`}
                >
                    <Text className={`${selectedStatus === 'resolved' ? 'text-white' : 'text-blue-500'} font-medium`}>Resolved</Text>
                </TouchableOpacity>
            </View>

            {/* Complaints Feed */}
            {loading ? (
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
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
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
                            <TouchableOpacity
                                key={complaint.complaint_id}

                                className="bg-white rounded-lg mb-4 overflow-hidden shadow-sm"
                                onPress={() => {
                                    navigation.navigate('ComplainDetails', { complaintId: complaint.complaint_id });
                                }}
                            >
                                {/* Complaint Image */}
                                {complaint.media && complaint.media.length > 0 && complaint.media[0].file_type === 'image' ? (
                                    <Image
                                        source={{ uri: complaint.media[0].file_url }}
                                        className="w-full h-48"
                                        resizeMode="cover"
                                    />
                                ) : (
                                    <View className="w-full h-48 bg-gray-200 justify-center items-center">
                                        <Text className="text-gray-500 text-4xl">📷</Text>
                                        <Text className="text-gray-500 mt-2">No Image</Text>
                                    </View>
                                )}

                                {/* Content */}
                                <View className="">
                                    {/* Priority and Status */}
                                    <View className="flex-row justify-between items-center  px-4 py-2">
                                        <View className="flex-row items-center">
                                            <View
                                                className="w-2 h-2 rounded-full mr-2"
                                                style={{ backgroundColor: getPriorityColor(complaint.status) }}
                                            />
                                            <Text className="text-red-500 text-xs font-medium">High Priority</Text>
                                        </View>
                                        <View
                                            className="px-2 py-1 rounded-full flex flex-row items-center gap-1"
                                            style={{ backgroundColor: getStatusColor(complaint.status) + '20' }}
                                        >
                                            <Image style={{ width: 10, height: 10 }} source={{ uri: getStatusIcon(complaint.status) }} />
                                            <Text
                                                className="text-xs font-medium"
                                                style={{ color: getStatusColor(complaint.status) }}
                                            >
                                                {getStatusText(complaint.status)}
                                            </Text>
                                        </View>
                                    </View>

                                    {/* Title */}
                                    <Text className="text-lg font-bold mb-1 px-4">{complaint.title}</Text>

                                    {/* Location */}
                                    <View className="flex-row items-center mb-3 px-4">
                                        <Image style={{ width: 15, height: 15 }} source={{ uri: 'https://img.icons8.com/?size=100&id=85049&format=png&color=737373' }} />
                                        <Text className="text-gray-600 text-sm font-medium flex-1">
                                            {truncateText(complaint.address || 'Location not specified', 40)}
                                        </Text>
                                    </View>

                                    {/* Bottom Actions */}
                                    <View className='border-gray-200 border-b -px-8 my-2'></View>
                                    <View className="flex-row justify-between items-center px-4 py-2 self-end">
                                        <View className='flex flex-row  gap-4'>
                                            <View className="flex-row items-center space-x-4">
                                                <View className="flex-row items-center">
                                                    {
                                                        complaint.votes.userReaction === 'like' ?
                                                            <TouchableOpacity onPress={() => { removeVote(complaint.complaint_id, null, 'like') }}>
                                                                <Image style={{ width: 30, height: 30 }} source={{ uri: 'https://img.icons8.com/?size=100&id=HhxwuilvXTcb&format=png&color=228BE6' }} />
                                                            </TouchableOpacity>
                                                            :
                                                            <TouchableOpacity onPress={() => { addVote(complaint.complaint_id, 'like', complaint.votes.userReaction) }}>
                                                                <Image style={{ width: 30, height: 30 }} source={{ uri: 'https://img.icons8.com/?size=100&id=96384&format=png&color=000000' }} />
                                                            </TouchableOpacity>
                                                    }


                                                    <Text className="text-black text-base font-medium">
                                                        {complaint._count?.votes || complaint.votes?.like || 0}
                                                    </Text>
                                                </View>
                                            </View>
                                            <View className="flex-row items-center space-x-4">
                                                <View className="flex-row items-center">{
                                                    complaint.votes.userReaction === 'dislike' ?
                                                        <TouchableOpacity onPress={() => { removeVote(complaint.complaint_id, null, 'dislike') }}>
                                                            <Image style={{ width: 20, height: 20 }} source={{ uri: 'https://img.icons8.com/?size=100&id=87726&format=png&color=228BE6' }} />
                                                        </TouchableOpacity>
                                                        :
                                                        <TouchableOpacity onPress={() => { addVote(complaint.complaint_id, 'dislike', complaint.votes.userReaction) }}>
                                                            <Image style={{ width: 30, height: 30 }} source={{ uri: 'https://img.icons8.com/?size=100&id=gqN8RslTqitJ&format=png&color=000000' }} />
                                                        </TouchableOpacity>
                                                }


                                                    <Text className="text-black text-base font-medium">
                                                        {complaint._count?.votes || complaint.votes?.dislike || 0}
                                                    </Text>
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        ))
                    )}

                    {/* Bottom spacing */}
                    <View className="h-20" />
                </ScrollView>
            )}


        </View>
    );
};

export default HomeScreen;