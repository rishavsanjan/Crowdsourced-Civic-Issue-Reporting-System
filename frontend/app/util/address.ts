import Constants from 'expo-constants'
import { SetStateAction } from 'react';
import { Toast } from 'toastify-react-native';
import * as Location from "expo-location";

const { googleApiKey } = Constants.expoConfig?.extra || {};

export const fetchAddress = async (lat: number, lng: number, setAddress: React.Dispatch<SetStateAction<string>>) => {
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

export const getLocation = async (setLocation: React.Dispatch<SetStateAction<any>>, setAddress: React.Dispatch<SetStateAction<string>>) => {
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
        fetchAddress(loc.coords.latitude, loc.coords.longitude, setAddress);
    } catch (err: any) {
        Toast.error(`${err.message}`);
    }
};
