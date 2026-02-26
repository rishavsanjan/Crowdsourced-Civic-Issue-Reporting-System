import React, { SetStateAction } from 'react'
import { Alert, Image, Text, TouchableOpacity, View } from 'react-native'
import { MediaItem, pickImage, pickVideo, removeMediaItem, takePhoto } from '../utils/image'
import Icon from '@react-native-vector-icons/ionicons';

interface Props {
    mediaItems : MediaItem[]
    setMediaItems : React.Dispatch<SetStateAction<MediaItem[]>>
}

const MediaUpload:React.FC<Props> = ({mediaItems, setMediaItems}) => {
     const showPhotoOptions = () => {
            Alert.alert(
                "Add Photo",
                "Choose an option",
                [
                    { text: "Camera", onPress: takePhoto },
                    { text: "Gallery", onPress: pickImage(setMediaItems) },
                    { text: "Cancel", style: "cancel" }
                ]
            );
        };
    return (
        <View>
            {/*Add media */}
            <View className="flex flex-col gap-2 mb-4">
                <Text className="text-[#96A4B1] font-medium">Add Media</Text>
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
                            <Text className="text-[#1173D4] font-semibold">Add Photo</Text>
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
                            <Text className="text-[#1173D4] font-semibold">Add Video</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Photo Evidence Gallery */}
            <View className="mb-6">
                <View className="flex-row items-center justify-between mb-4">
                    <Text className="text-sm font-bold text-slate-400 uppercase tracking-widest">
                        Work Evidence
                    </Text>
                    <Text className="text-xs text-slate-500">
                        {mediaItems.length} / 5 Uploaded
                    </Text>
                </View>
                <View className="flex-row flex-wrap gap-3">
                    {/* Uploaded Photos */}
                    {mediaItems.map((photo) => (
                        <View
                            key={photo.id}
                            className="w-[31%] aspect-square rounded-lg overflow-hidden relative"
                        >
                            <Image
                                source={{ uri: photo.uri }}
                                className="w-full h-full"
                                resizeMode="cover"
                            />
                            <View className="absolute inset-0 bg-black/20 flex items-start justify-end p-1">
                                <TouchableOpacity
                                    className="bg-white/90 light:bg-slate-800/90 rounded-full p-1 shadow-sm"
                                    onPress={() => removeMediaItem(photo.id, setMediaItems)}
                                >
                                    <Icon name="close" size={12} color="#ef4444" />
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))}

                    {/* Add Photo Button */}
                    {mediaItems.length < 5 && (
                        <TouchableOpacity
                            className="w-[31%] aspect-square rounded-lg border-2 border-dashed border-slate-300 light:border-slate-700 flex flex-col items-center justify-center bg-slate-50 light:bg-slate-800/50"
                            onPress={showPhotoOptions}
                            activeOpacity={0.7}
                        >
                            <Icon name="camera-outline" size={24} color="#94a3b8" />
                            <Text className="text-[10px] font-medium text-slate-500 uppercase mt-1">
                                ADD
                            </Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        </View>
    )
}

export default MediaUpload