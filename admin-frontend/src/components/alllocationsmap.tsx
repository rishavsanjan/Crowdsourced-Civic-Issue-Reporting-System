import React, { useEffect, useMemo, useState } from 'react';
import { GoogleMap, Marker, InfoWindow, useLoadScript } from '@react-google-maps/api';
import axios from 'axios';
import { Link } from 'react-router-dom';

const containerStyle = {
    width: '100%',
    height: '60vh',
    borderRadius: '16px'
};

interface Location {
    id: number;
    name: string;
    latitude: number;
    longitude: number;
    description?: string;
    status?: string;
    category?: string;
    createdAt?: string;
    media: Array<{
        media_id: number;
        file_url: string;
        file_type: 'image' | 'video';
    }>;
}

interface MyMapProps {
}

const MyMapAll: React.FC<MyMapProps> = ({ }) => {
    const [selectedMarker, setSelectedMarker] = useState<Location | null>(null);
    const [locations, setLocations] = useState<Location[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const getLocations = async () => {
        try {
            setLoading(true);
            setError(null);
            const token = localStorage.getItem('admincitytoken');

            const response = await axios({
                url: `http://172.20.10.2:3000/api/admin/admin-home`,
                method: 'get',
                headers: token ? { Authorization: `Bearer ${token}` } : {}
            });

            // Map the data to ensure correct property names
            const mappedLocations = response.data.complaints.map((complaint: any) => ({
                id: complaint.complaint_id,
                name: complaint.name || complaint.title || 'Untitled Complaint',
                latitude: complaint.latitude,
                longitude: complaint.longitude || complaint.latitudelongitude,
                description: complaint.description,
                status: complaint.status,
                category: complaint.category,
                createdAt: complaint.createdAt,
                media: complaint.media
            }));

            setLocations(mappedLocations);
            console.log('Locations loaded:', mappedLocations);
        } catch (error: any) {
            console.error('Error fetching locations:', error);
            setError(error.message || 'Failed to load complaints');
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        getLocations();
    }, []);

    console.log(locations)

    const { isLoaded } = useLoadScript({
        googleMapsApiKey: 'AIzaSyDjyRoO4ogCeRr9IMw9LXYFL-y2HuxjZKg',
    });

    // Calculate center based on all locations
    const center = useMemo(() => {
        if (locations.length === 0) return { lat: 23.2599, lng: 77.4126 }; // Default to Bhopal

        const avgLat = locations.reduce((sum, loc) => sum + loc.latitude, 0) / locations.length;
        const avgLng = locations.reduce((sum, loc) => sum + loc.longitude, 0) / locations.length;

        return { lat: avgLat, lng: avgLng };
    }, [locations]);

    // Calculate appropriate zoom level
    const zoom = useMemo(() => {
        if (locations.length === 0) return 12;
        if (locations.length === 1) return 15;

        const lats = locations.map(loc => loc.latitude);
        const lngs = locations.map(loc => loc.longitude);

        const latDiff = Math.max(...lats) - Math.min(...lats);
        const lngDiff = Math.max(...lngs) - Math.min(...lngs);
        const maxDiff = Math.max(latDiff, lngDiff);

        if (maxDiff > 100) return 2;
        if (maxDiff > 50) return 3;
        if (maxDiff > 20) return 4;
        if (maxDiff > 10) return 5;
        if (maxDiff > 5) return 6;
        if (maxDiff > 2) return 7;
        if (maxDiff > 1) return 8;
        if (maxDiff > 0.5) return 9;
        if (maxDiff > 0.1) return 11;
        return 13;
    }, [locations]);

    const getStatusColor = (status?: string) => {
        switch (status?.toLowerCase()) {
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'in progress': return 'bg-blue-100 text-blue-800';
            case 'resolved': return 'bg-green-100 text-green-800';
            case 'rejected': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    if (!isLoaded || loading) {
        return (
            <div className="w-full bg-white rounded-2xl shadow-lg p-8">
                <div className="flex items-center justify-center h-[60vh]">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600 mx-auto mb-4"></div>
                        <p className="text-gray-600 font-semibold text-lg">Loading Map...</p>
                        <p className="text-gray-400 text-sm mt-2">Please wait while we fetch all complaints</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="w-full bg-white rounded-2xl shadow-lg p-8">
                <div className="flex items-center justify-center h-[60vh]">
                    <div className="text-center max-w-md">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </div>
                        <p className="text-gray-800 font-semibold text-lg mb-2">Error Loading Map</p>
                        <p className="text-gray-500 text-sm mb-4">{error}</p>
                        <button
                            onClick={getLocations}
                            className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700 transition"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    console.log(selectedMarker)

    return (
        <div className="w-full bg-white  shadow-lg overflow-hidden">
            {/* Header Section */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-white mb-1 flex items-center gap-2">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            All Complaints Map
                        </h2>
                        <p className="text-indigo-100 text-sm">
                            Interactive map showing all registered complaints
                        </p>
                    </div>
                    <button
                        onClick={getLocations}
                        className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg font-medium transition flex items-center gap-2"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        Refresh
                    </button>
                </div>
            </div>

            {/* Stats Bar */}
            <div className="grid grid-cols-4 gap-4 p-6 bg-gray-50 border-b border-gray-200">
                <div className="text-center">
                    <p className="text-3xl font-bold text-indigo-600">{locations.length}</p>
                    <p className="text-sm text-gray-600 font-medium">Total Complaints</p>
                </div>
                <div className="text-center">
                    <p className="text-3xl font-bold text-yellow-600">
                        {locations.filter(l => l.status?.toLowerCase() === 'pending').length}
                    </p>
                    <p className="text-sm text-gray-600 font-medium">Pending</p>
                </div>
                <div className="text-center">
                    <p className="text-3xl font-bold text-blue-600">
                        {locations.filter(l => l.status?.toLowerCase() === 'in_progress').length}
                    </p>
                    <p className="text-sm text-gray-600 font-medium">In Progress</p>
                </div>
                <div className="text-center">
                    <p className="text-3xl font-bold text-green-600">
                        {locations.filter(l => l.status?.toLowerCase() === 'resolved').length}
                    </p>
                    <p className="text-sm text-gray-600 font-medium">Resolved</p>
                </div>
            </div>

            {/* Map Section */}
            <div className="p-6">
                {locations.length === 0 ? (
                    <div className="flex items-center justify-center h-[60vh] bg-gray-50 rounded-2xl border-2 border-dashed border-gray-300">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                                </svg>
                            </div>
                            <p className="text-gray-600 font-medium mb-2">No Complaints Found</p>
                            <p className="text-gray-400 text-sm">Complaints will appear on the map once they are registered</p>
                        </div>
                    </div>
                ) : (
                    <div className="rounded-2xl overflow-hidden shadow-lg">
                        <GoogleMap
                            mapContainerStyle={containerStyle}
                            center={center}
                            zoom={zoom}
                            options={{
                                streetViewControl: false,
                                mapTypeControl: true,
                                fullscreenControl: true,
                                zoomControl: true,
                                styles: [
                                    {
                                        featureType: 'poi',
                                        elementType: 'labels',
                                        stylers: [{ visibility: 'off' }]
                                    }
                                ]
                            }}
                        >
                            {locations.map((location, index) => (
                                <Marker
                                    key={location.id}
                                    position={{ lat: location.latitude, lng: location.longitude }}
                                    onClick={() => setSelectedMarker(location)}
                                    label={{
                                        text: `${index + 1}`,
                                        color: 'white',
                                        fontSize: '12px',
                                        fontWeight: 'bold'
                                    }}
                                    icon={{
                                        path: window.google.maps.SymbolPath.CIRCLE,
                                        fillColor: `${location.status === 'in_progress' ? '#6366f1' : location.status === 'pending' ? '#D08700' : location.status === 'resolved' ? '#00A63E' : ''}`,
                                        fillOpacity: 1,
                                        strokeColor: '#ffffff',
                                        strokeWeight: 2,
                                        scale: 14,
                                    }}
                                />
                            ))}

                            {selectedMarker && (
                                <InfoWindow
                                    position={{ lat: selectedMarker.latitude, lng: selectedMarker.longitude }}
                                    onCloseClick={() => setSelectedMarker(null)}
                                >
                                    <div className="p-3 min-w-[250px]">
                                        <div className='flex flex-row'>
                                            {
                                                selectedMarker?.media.map((media, index) => (
                                                    <div className='flex flex-row gap-4' key={media.media_id}>
                                                        {
                                                            media.file_type === 'image' &&
                                                            <img
                                                                key={index}
                                                                alt={`Pothole Image ${index + 1}`}
                                                                className=" object-cover w-32  h-32 cursor-pointer hover:opacity-80 transition-opacity"
                                                                src={media.file_url}
                                                            />
                                                        }

                                                        {
                                                            media.file_type === 'video' &&
                                                            <video
                                                                className='w-32 h-32'
                                                                key={index}
                                                                src={media.file_url}
                                                            />
                                                        }

                                                    </div>
                                                ))
                                            }
                                        </div>
                                        <h3 className="font-bold text-gray-800 text-lg mb-2">
                                            {selectedMarker.name}
                                        </h3>

                                        {selectedMarker.status && (
                                            <div className="mb-2">
                                                <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(selectedMarker.status)}`}>
                                                    {selectedMarker.status}
                                                </span>
                                            </div>
                                        )}

                                        {selectedMarker.category && (
                                            <p className="text-sm text-gray-600 mb-2">
                                                <span className="font-semibold">Category:</span> {selectedMarker.category}
                                            </p>
                                        )}

                                        {selectedMarker.description && (
                                            <p className="text-gray-600 text-sm mb-3 line-clamp-3">
                                                {selectedMarker.description}
                                            </p>
                                        )}

                                        {selectedMarker.createdAt && (
                                            <p className="text-xs text-gray-400 mb-2">
                                                📅 {new Date(selectedMarker.createdAt).toLocaleDateString()}
                                            </p>
                                        )}

                                        <p className="text-xs text-gray-500 mt-2 pt-2 border-t border-gray-200">
                                            📍 {selectedMarker.latitude.toFixed(4)}, {selectedMarker.longitude.toFixed(4)}
                                        </p>
                                        <Link to={`/details/${selectedMarker.id}`}>
                                            <button className='flex p-2 px-4 bg-blue-500 text-white cursor-pointer'>
                                                View Details
                                            </button>
                                        </Link>

                                    </div>

                                </InfoWindow>
                            )}
                        </GoogleMap>
                    </div>
                )}
            </div>

            {/* Footer Info */}
            {locations.length > 0 && (
                <div className="px-6 pb-6">
                    <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-4 border border-indigo-100">
                        <div className="flex items-start gap-3">
                            <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                                <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-semibold text-gray-800 mb-1">
                                    Interactive Map Features
                                </p>
                                <ul className="text-sm text-gray-600 space-y-1">
                                    <li>• Click on any marker to view detailed complaint information</li>
                                    <li>• Use zoom controls to explore specific areas</li>
                                    <li>• Map automatically centers to show all complaints</li>
                                    <li>• Markers are numbered for easy reference</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyMapAll;