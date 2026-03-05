import * as ImagePicker from 'expo-image-picker';
import { SetStateAction } from 'react';
import { Alert } from 'react-native';

 export interface MediaItem {
    id: string;
    type: 'photo' | 'video';
    uri: string;
    cloudinaryUrl?: string;
}

 export const requestMediaPermissions = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
        Alert.alert('Sorry, we need camera roll permissions to make this work!');
    }
};

 export  const pickImage = async (setMediaItems: React.Dispatch<SetStateAction<MediaItem[]>>) => {
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

 export const pickVideo = async (setMediaItems: React.Dispatch<SetStateAction<MediaItem[]>>) => {
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
 export const takePhoto = async (setMediaItems: React.Dispatch<SetStateAction<MediaItem[]>>) => {
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

 export const removeMediaItem = (id: string, setMediaItems: React.Dispatch<SetStateAction<MediaItem[]>>) => {
    setMediaItems(prev => prev.filter(item => item.id !== id));
};




const CLOUDINARY_CLOUD_NAME = "diwmvqto3"; // Replace with your Cloudinary cloud name
const CLOUDINARY_UPLOAD_PRESET = "crowd-app";

// Upload to Cloudinary
 export const uploadToCloudinary = async (uri: string, type: 'image' | 'video') => {
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