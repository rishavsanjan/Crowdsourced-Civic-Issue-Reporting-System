import { Toast } from "toastify-react-native";
import * as Location from "expo-location";


export async function getLocation() {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
        Toast.error('Permission to access location was denied');
        return;
    }

    let location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Highest,
    });

    return location
}