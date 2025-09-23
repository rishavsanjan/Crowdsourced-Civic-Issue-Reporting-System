import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Toast } from 'toastify-react-native';
import { LoadingDots } from '@mrakesh0608/react-native-loading-dots';

import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'HomeScreen'>;


const HomeScreen: React.FC<Props> = ({ navigation }) => {
    

    return (
        <View className=" flex flex-col justify-between h-full bg-[#F6F7F8] px-6">
            <Text>HomeScreen</Text>
        </View>
    );
};

export default HomeScreen;
