import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Image,
} from 'react-native';
import Icon from '@react-native-vector-icons/ionicons';

interface PhotoEvidence {
  id: string;
  uri: string;
  alt: string;
}

interface TaskDetail {
  id: string;
  title: string;
  description: string;
  status: 'in-progress' | 'pending' | 'completed';
  assignedDate: string;
  deadline: string;
  adminInstructions: string[];
  location: {
    building: string;
    accessKey: string;
  };
  photosRequired: number;
}

export default function TaskDetailsScreen() {
  const [photos, setPhotos] = useState<PhotoEvidence[]>([
    {
      id: '1',
      uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAxgN8Jcb34AgMR38S4AW-q6_Lhqn942LWO4SswlT9uLKNdmjs8MauZGug6StyQLdszQDAGQmSd1Cjw2S9RQ6t5WVcsx0JZ7Xca1MQnz27vomYK7SYQLS6AgobpvmhfFyoBM-iOt7YX1RSe1Ya5_ylZnRYsYFxNuWTFgTXEuIzIadgmzeHkxTUBpSriCsRsqDx3nKDvqXhm3RF_VKCHeGXogi6vWIO-QKRfq904nLyiLq9cX19lrf4T7_iYJ4xEilPch4prpC1p2_WC',
      alt: 'HVAC Unit Serial Number',
    },
    {
      id: '2',
      uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB5hyRT8H1R929UribRioJ0avdNiWfU-PEAc6cnMX_qmRICJY-P-Gi_sy_OfiLifRexcQY3zwY9of5Dt4WvYGIpFMLx1uXPh0NXsUQNe0jlmjKJg4sWLL0RIKD2lLgreLdtp0ASrh8g0V8YM7FOsVttGTS-yPO_AkId1oa79bsj2glEasKCsA3DLJ9WTb6DodpsokKsarOI6FAqJ9RtUsDd1zBVBToYbsU0o-uTBPJIhN_CajWUBMCka3u_RG6dvkePt2v6vbkKULPI',
      alt: 'Maintenance process',
    },
  ]);

  const task: TaskDetail = {
    id: '1',
    title: 'HVAC System Maintenance - Floor 4 East Wing',
    description:
      'Perform a full diagnostic check on the main air handling unit (AHU-4). Inspect filters, check belt tension, and verify sensor calibration for the thermostat zone 14-22. Ensure all drainage pipes are clear of obstructions.',
    status: 'in-progress',
    assignedDate: 'Oct 24, 2023',
    deadline: 'Today, 5:00 PM',
    adminInstructions: [
      'Take a photo of the unit serial number before starting.',
      'Log all pressure readings in the digital logbook.',
      'Clear work area of all debris before final completion photo.',
    ],
    location: {
      building: 'Building B, Sector 4',
      accessKey: 'B4-99',
    },
    photosRequired: 5,
  };

  const handleRemovePhoto = (photoId: string) => {
    setPhotos(photos.filter((p) => p.id !== photoId));
  };

  const handleAddPhoto = () => {
    console.log('Add photo pressed');
    // Implement camera/gallery picker logic here
  };

  const handleUploadPhotos = () => {
    console.log('Upload photos pressed');
    // Implement upload logic here
  };

  const handleSaveProgress = () => {
    console.log('Save progress pressed');
    // Implement save logic here
  };

  const handleGoBack = () => {
    console.log('Go back pressed');
    // Implement navigation back logic here
  };

  const getStatusBadge = () => {
    switch (task.status) {
      case 'in-progress':
        return (
          <View className="px-3 py-1 bg-primary/10 dark:bg-primary/20 rounded-full">
            <Text className="text-xs font-bold text-primary uppercase tracking-wider">
              In Progress
            </Text>
          </View>
        );
      case 'pending':
        return (
          <View className="px-3 py-1 bg-amber-100 dark:bg-amber-900/30 rounded-full">
            <Text className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider">
              Pending
            </Text>
          </View>
        );
      case 'completed':
        return (
          <View className="px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 rounded-full">
            <Text className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
              Completed
            </Text>
          </View>
        );
    }
  };

  return (
    <View className="flex-1 bg-background-light dark:bg-background-dark">
      <StatusBar barStyle="dark-content" />

      {/* iOS Status Bar Placeholder */}
      <View className="h-12 w-full bg-background-light dark:bg-background-dark flex-row items-center justify-between px-6">
        <Text className="text-sm font-semibold dark:text-white">9:41</Text>
        <View className="flex-row items-center gap-1.5">
          <Icon name="cellular" size={18} color="#000000" />
          <Icon name="wifi" size={18} color="#000000" />
          <Icon name="battery-full" size={18} color="#000000" />
        </View>
      </View>

      {/* Navigation Bar */}
      <View className="bg-background-light/80 dark:bg-background-dark/80 px-4 py-3 border-b border-slate-200 dark:border-slate-800 flex-row items-center justify-between">
        <TouchableOpacity className="flex-row items-center" onPress={handleGoBack}>
          <Icon name="chevron-back" size={20} color="#136dec" />
          <Text className="font-medium text-primary ml-1">Tasks</Text>
        </TouchableOpacity>
        <Text className="text-lg font-semibold absolute left-1/2 -translate-x-1/2 dark:text-white">
          Task Details
        </Text>
        {getStatusBadge()}
      </View>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 16, paddingBottom: 140 }}
      >
        {/* Task Header Section */}
        <View className="mb-6">
          <Text className="text-2xl font-bold leading-tight dark:text-white mb-2">
            {task.title}
          </Text>
          <View className="flex-row flex-wrap gap-4 pt-2">
            <View className="flex-row items-center gap-2">
              <Icon name="calendar-outline" size={14} color="#94a3b8" />
              <Text className="text-sm text-slate-500 dark:text-slate-400">
                Assigned: {task.assignedDate}
              </Text>
            </View>
            <View className="flex-row items-center gap-2">
              <Icon name="alarm-outline" size={14} color="#ef4444" />
              <Text className="text-sm text-red-500 font-medium">
                Deadline: {task.deadline}
              </Text>
            </View>
          </View>
        </View>

        {/* Description Card */}
        <View className="bg-white dark:bg-slate-900 rounded-xl p-4 shadow-sm border border-slate-200 dark:border-slate-800 mb-6">
          <Text className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-3">
            Description
          </Text>
          <Text className="text-slate-700 dark:text-slate-300 leading-relaxed">
            {task.description}
          </Text>
        </View>

        {/* Admin Instructions Card */}
        <View className="bg-primary/5 dark:bg-primary/10 rounded-xl p-4 border border-primary/20 mb-6">
          <View className="flex-row items-center gap-2 mb-3">
            <Icon name="clipboard-outline" size={20} color="#136dec" />
            <Text className="text-sm font-bold text-primary uppercase tracking-widest">
              Admin Instructions
            </Text>
          </View>
          <View className="space-y-3">
            {task.adminInstructions.map((instruction, index) => (
              <View key={index} className="flex-row gap-3 mb-3">
                <Text className="text-primary font-bold">{index + 1}.</Text>
                <Text className="text-slate-700 dark:text-slate-300 flex-1">
                  {instruction}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Photo Evidence Gallery */}
        <View className="mb-6">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-sm font-bold text-slate-400 uppercase tracking-widest">
              Work Evidence
            </Text>
            <Text className="text-xs text-slate-500">
              {photos.length} / {task.photosRequired} Uploaded
            </Text>
          </View>
          <View className="flex-row flex-wrap gap-3">
            {/* Uploaded Photos */}
            {photos.map((photo) => (
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
                    className="bg-white/90 dark:bg-slate-800/90 rounded-full p-1 shadow-sm"
                    onPress={() => handleRemovePhoto(photo.id)}
                  >
                    <Icon name="close" size={12} color="#ef4444" />
                  </TouchableOpacity>
                </View>
              </View>
            ))}

            {/* Add Photo Button */}
            {photos.length < task.photosRequired && (
              <TouchableOpacity
                className="w-[31%] aspect-square rounded-lg border-2 border-dashed border-slate-300 dark:border-slate-700 flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-800/50"
                onPress={handleAddPhoto}
                activeOpacity={0.7}
              >
                <Icon name="camera-outline" size={24} color="#94a3b8" />
                <Text className="text-[10px] font-medium text-slate-500 uppercase mt-1">
                  Add
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Location Info */}
        <View className="bg-white dark:bg-slate-900 rounded-xl p-4 shadow-sm border border-slate-200 dark:border-slate-800">
          <View className="flex-row items-center gap-3">
            <View className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Icon name="location" size={20} color="#136dec" />
            </View>
            <View className="flex-1">
              <Text className="font-semibold dark:text-white">
                {task.location.building}
              </Text>
              <Text className="text-xs text-slate-500">
                Service Access Key required: {task.location.accessKey}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Action Bar */}
      <View className="absolute bottom-0 left-0 right-0 bg-white/90 dark:bg-slate-900/90 border-t border-slate-200 dark:border-slate-800 px-6 pt-4 pb-8">
        <View className="max-w-md mx-auto flex flex-col gap-3">
          <TouchableOpacity
            className="w-full bg-primary py-4 rounded-xl shadow-lg flex-row items-center justify-center gap-2 active:scale-[0.98]"
            onPress={handleUploadPhotos}
            activeOpacity={0.9}
          >
            <Icon name="cloud-upload-outline" size={20} color="#ffffff" />
            <Text className="text-white font-bold">Upload Work Photos</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="w-full bg-transparent py-2"
            onPress={handleSaveProgress}
            activeOpacity={0.7}
          >
            <Text className="text-slate-500 dark:text-slate-400 font-medium text-sm text-center">
              Save Progress &amp; Exit
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}