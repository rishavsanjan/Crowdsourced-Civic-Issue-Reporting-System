import React, { useRef } from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import { WebView } from "react-native-webview";

interface MapPickerProps {
  latitude: number;
  longitude: number;
  onLocationSelect: (lat: number, lng: number) => void;
  googleApiKey: string;
}

const MapPicker: React.FC<MapPickerProps> = ({ latitude, longitude, onLocationSelect, googleApiKey }) => {
  const webviewRef = useRef<WebView>(null);

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
            const initialPos = { lat: ${latitude}, lng: ${longitude} };
            const map = new google.maps.Map(document.getElementById('map'), {
              zoom: 15,
              center: initialPos,
            });
            const marker = new google.maps.Marker({
              position: initialPos,
              map: map,
              draggable: true
            });

            google.maps.event.addListener(marker, 'dragend', function(event) {
              window.ReactNativeWebView.postMessage(JSON.stringify({
                lat: event.latLng.lat(),
                lng: event.latLng.lng()
              }));
            });

            map.addListener('click', function(e) {
              marker.setPosition(e.latLng);
              window.ReactNativeWebView.postMessage(JSON.stringify({
                lat: e.latLng.lat(),
                lng: e.latLng.lng()
              }));
            });
          }
        </script>
      </head>
      <body onload="initMap()">
        <div id="map"></div>
      </body>
    </html>
  `;

  return (
    <View style={{ width: "100%", height: 200 }}>
      <WebView
        ref={webviewRef}
        originWhitelist={['*']}
        source={{ html }}
        onMessage={(event) => {
          const data = JSON.parse(event.nativeEvent.data);
          onLocationSelect(data.lat, data.lng);
        }}
      />
    </View>
  );
};

export default MapPicker;
