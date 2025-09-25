import React, { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image, Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";

import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../navigation/navigation";
import LoginScreen from "../login/login";
import axios from "axios";
import { Toast } from 'toastify-react-native';

type Props = NativeStackScreenProps<RootStackParamList, "RaiseComplainScreen">;

const RaiseComplainScreen: React.FC<Props> = ({ navigation }) => {
    const [isLogin, setIsLogin] = useState(false);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [location, setLocation] = useState({ latitude: 28.6139, longitude: 77.2090 }); // default Delhi
    const [address, setAddress] = useState("");
    const [errorMsg, setErrorMsg] = useState("");

    // Get login status
    const getLoginStatus = async () => {
        const token = await AsyncStorage.getItem("citytoken");
        if (token) {
            setIsLogin(true);
        }
    };

    useEffect(() => {
        getLoginStatus();
    }, []);

    // Fetch address from Google Maps API
    const fetchAddress = async (lat: number, lng: number) => {
        try {
            const apiKey = "AIzaSyDjyRoO4ogCeRr9IMw9LXYFL-y2HuxjZKg";
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
                setErrorMsg("Permission to access location was denied");
                return;
            }

            let loc = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.Highest,
            });

            setLocation(loc.coords);
            fetchAddress(loc.coords.latitude, loc.coords.longitude);
        } catch (err: any) {
            setErrorMsg(err.message);
        }
    };

    // Submit issue
    const handleSubmit = async () => {
        const token = await AsyncStorage.getItem('citytoken')
        const response = await axios({
            url: 'http://172.20.10.2:3000/api/user/addcomplain',
            method: 'POST',
            data: {
                category: 'other',
                title: title,
                description: description,
                latitude: location.latitude,
                longitude: location.longitude,
                address: address,
            },
            headers: {
                'Authorization': "Bearer " + token
            }
        });
        Toast.success('Complain raised successfully!');
        setTitle('');
        setDescription('');
        setAddress('');

    };

    if (!isLogin) {
        // @ts-ignore
        return <LoginScreen />;
    }

    return (
        <View className="flex flex-col h-full bg-[#F6F7F8]">
            {/* Header */}
            <View className="flex flex-row items-center justify-between w-full px-4 p-4 border-b border-gray-300">
                <Image
                    style={{ width: 20, height: 20 }}
                    source={{
                        uri: "https://img.icons8.com/?size=100&id=WWzSFZsWqPFD&format=png&color=1A1A1A",
                    }}
                />
                <Text className="font-bold text-xl">Report an Issue</Text>
                <Text></Text>
            </View>

            {/* Form */}
            <View className="p-4 flex-1">
                {/* Title */}
                <View className="flex flex-col gap-2 mb-4">
                    <Text className="text-[#96A4B1] font-medium">Title</Text>
                    <TextInput
                        className="w-full bg-white p-4 rounded-lg border border-blue-300"
                        placeholder="Title"
                        value={title}
                        onChangeText={setTitle}
                    />
                </View>

                {/* Description */}
                <View className="flex flex-col gap-2 mb-4">
                    <Text className="text-[#96A4B1] font-medium">Describe the issue</Text>
                    <TextInput
                        className="w-full bg-white p-4 rounded-lg border border-blue-300"
                        placeholder="Description"
                        value={description}
                        onChangeText={setDescription}
                        multiline
                    />
                </View>

                {/* Location */}
                <View className="flex flex-col gap-2 mb-4">
                    <Text className="text-[#96A4B1] font-medium">Location</Text>
                    <TextInput
                        className="w-full bg-white p-4 rounded-lg border border-blue-300"
                        placeholder="Fetching location..."
                        value={address}
                        onFocus={getLocation}
                    />
                </View>

                {/* Map */}
                {Platform.OS === "android" && (
                    <>
                        <MapView
                            style={{ width: "100%", height: 200, marginVertical: 10 }}
                            initialRegion={{
                                latitude: location.latitude,
                                longitude: location.longitude,
                                latitudeDelta: 0.01,
                                longitudeDelta: 0.01,
                            }}
                            onPress={(e) => {
                                const coords = e.nativeEvent.coordinate;
                                setLocation(coords);
                                fetchAddress(coords.latitude, coords.longitude);
                            }}
                        >
                            <Marker
                                coordinate={location}
                                draggable
                                onDragEnd={(e) => {
                                    const coords = e.nativeEvent.coordinate;
                                    setLocation(coords);
                                    fetchAddress(coords.latitude, coords.longitude);
                                }}
                            />
                        </MapView>
                        {address ? (
                            <Text className="text-[#1173D4] font-semibold mt-2">📍 {address}</Text>
                        ) : null}
                    </>
                )}

                {/* Add Media */}
                <View className="flex flex-col gap-2 mb-4">
                    <Text className="text-[#96A4B1] font-medium">Add Media</Text>
                    <View className="flex flex-row gap-2 justify-between w-full">
                        <TouchableOpacity className="bg-[#DFE9F4] rounded-lg p-4 flex-1 items-center">
                            <View className="flex flex-row items-center gap-2">
                                <Image
                                    style={{ width: 20, height: 20 }}
                                    source={{
                                        uri: "https://img.icons8.com/?size=100&id=MKHxHdHEYEfC&format=png&color=1173D4",
                                    }}
                                />
                                <Text className="text-[#1173D4] font-semibold">Add Photo</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity className="bg-[#DFE9F4] rounded-lg p-4 flex-1 items-center">
                            <View className="flex flex-row items-center gap-2">
                                <Image
                                    style={{ width: 20, height: 20 }}
                                    source={{
                                        uri: "https://img.icons8.com/?size=100&id=alybng0KUhxp&format=png&color=1173D4",
                                    }}
                                />
                                <Text className="text-[#1173D4] font-semibold">Add Video</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Submit */}
                <View className="mt-4">
                    <TouchableOpacity
                        className="bg-[#1173D4] p-3 items-center rounded-xl"
                        onPress={handleSubmit}
                    >
                        <Text className="text-white font-medium">Submit Issue</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

export default RaiseComplainScreen;
