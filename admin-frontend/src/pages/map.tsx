import { GoogleMap, Marker, useLoadScript } from '@react-google-maps/api';

const containerStyle = {
    width: '100%',
    height: '50vh'
};

//@ts-ignore
const MyMap = ({ lat, lng }) => {
    const { isLoaded } = useLoadScript({
        googleMapsApiKey: 'AIzaSyDjyRoO4ogCeRr9IMw9LXYFL-y2HuxjZKg', // replace with your API key
    });

    if (!isLoaded) return <div>Loading...</div>;

    return (
        <GoogleMap mapContainerStyle={containerStyle} center={{ lat, lng }} zoom={15}>
            <Marker position={{ lat, lng }} />
        </GoogleMap>
    );
};

export default MyMap;


//import React from 'react';
//import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
//import L from 'leaflet';
//
//// Fix default marker icon issue in React-Leaflet
////@ts-ignore
//delete L.Icon.Default.prototype._getIconUrl;
//L.Icon.Default.mergeOptions({
//  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png',
//  iconUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png',
//  shadowUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png',
//});
//
////@ts-ignore
//const MyMap = ({ lat, lng }) => {
//  return (
//    <MapContainer center={[lat, lng]} zoom={13} style={{ height: '50vh', width: '100%' }}>
//      <TileLayer
//        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//      />
//      <Marker position={[lat, lng]}>
//        <Popup>You are here</Popup>
//      </Marker>
//    </MapContainer>
//  );
//};
//
//export default MyMap;
