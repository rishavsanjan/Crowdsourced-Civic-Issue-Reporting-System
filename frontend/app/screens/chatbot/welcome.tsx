import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    SafeAreaView,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StatusBar,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/navigation';


type Props = NativeStackScreenProps<RootStackParamList, 'WelcomeChatbot'>;


const WelcomeChatbot: React.FC<Props> = ({ navigation }) => {




    return (
        <SafeAreaView className="flex-1 bg-[#191970] items-center justify-center gap-4">
            <Text className='text-white text-xl '>Welcome to FixMyCity!</Text>
            <Text className='text-white text-xl '>Hi, i am here to hep you.</Text>
            <Text className='text-white text-xl '>How May I Help you!!</Text>
            <Text className='text-white text-xl '>Ask me anything about Civic issues!</Text>
            <TouchableOpacity onPress={() => {navigation.navigate('Chatbot')}} className='bg-[#F1F060] p-4 px-24'>
                <Text  className=' '> GET STARTED</Text>
            </TouchableOpacity>

        </SafeAreaView>
    );
}

export default WelcomeChatbot