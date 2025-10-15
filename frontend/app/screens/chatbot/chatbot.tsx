import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { GiftedChat, Bubble } from 'react-native-gifted-chat';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/navigation';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import API_BASE_IP from '../../../config/api';

type Props = NativeStackScreenProps<RootStackParamList, 'Chatbot'>;

interface Message {
    _id: number;
    text: string;
    createdAt: Date;
    user: {
        _id: number;
        name: string;
        avatar: string;
    };
    isComplaintList?: boolean;
    complaints?: any[];
    isRaiseComplaint?: boolean
}

interface Complaint {
    _id: string;
    title: string;
    status: string;
    category?: string;
    description?: string;
    createdAt?: string;
}

const Chatbot: React.FC<Props> = ({ navigation }) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(false);
    const [complaints, setComplaints] = useState<Complaint[]>([]);

    const quickOptions = [
        'Complaint Status',
        'Raise New Complaint',
        'What is our vision ?',
        'Contact Support',
    ];

    useEffect(() => {
        setMessages([
            {
                _id: 1,
                text: '👋 Greetings!! Please enter your query in the text field below or select an option.',
                createdAt: new Date(),
                user: {
                    _id: 2,
                    name: 'FixMyCity Bot',
                    avatar: 'https://img.icons8.com/?size=100&id=OinpqSk7y90z&format=png&color=000000',
                },
            },
        ]);
    }, []);

    const onSend = useCallback(async (newMessages = []) => {
        const token = await AsyncStorage.getItem('citytoken');
        const userMessage = newMessages[0];

        setMessages(previousMessages => GiftedChat.append(previousMessages, newMessages));

        try {
            setLoading(true);
            const response = await axios.post(
                `${API_BASE_IP}/api/user/chatbot-message`,
                //@ts-ignore
                { message: userMessage.text },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            //@ts-ignore
            if (userMessage.text === 'Complaint Status') {
                const fetchedComplaints = response.data.complaint || [];
                setComplaints(fetchedComplaints);

                if (fetchedComplaints.length > 0) {
                    const botReply: Message = {
                        _id: Math.random(),
                        text: '📋 Here are your complaints. Tap on any complaint to view its status:',
                        createdAt: new Date(),
                        user: {
                            _id: 2,
                            name: 'FixMyCity Bot',
                            avatar: 'https://img.icons8.com/?size=100&id=OinpqSk7y90z&format=png&color=000000',
                        },
                        isComplaintList: true,
                        complaints: fetchedComplaints,
                    };
                    setMessages(previousMessages => GiftedChat.append(previousMessages, [botReply]));
                } else {
                    const botReply: Message = {
                        _id: Math.random(),
                        text: '📭 You have no complaints registered yet.',
                        createdAt: new Date(),
                        user: {
                            _id: 2,
                            name: 'FixMyCity Bot',
                            avatar: 'https://img.icons8.com/?size=100&id=OinpqSk7y90z&format=png&color=000000',
                        },
                    };
                    setMessages(previousMessages => GiftedChat.append(previousMessages, [botReply]));
                }

            }
            //@ts-ignore
            else if (userMessage.text === 'Raise New Complaint') {
                const botReply: Message = {
                    _id: Math.random(),
                    text: 'Click on the button below to raise a new complaint :',
                    createdAt: new Date(),
                    user: {
                        _id: 2,
                        name: 'FixMyCity Bot',
                        avatar: 'https://img.icons8.com/?size=100&id=OinpqSk7y90z&format=png&color=000000',
                    },
                    isRaiseComplaint: true
                };

                setMessages(previousMessages => GiftedChat.append(previousMessages, [botReply]));

            } //@ts-ignore
            else if (userMessage.text === 'What is our vision ?') {
                const botReply: Message = {
                    _id: Math.random(),
                    text: 'Our mission is to make India a better civic society.',
                    createdAt: new Date(),
                    user: {
                        _id: 2,
                        name: 'FixMyCity Bot',
                        avatar: 'https://img.icons8.com/?size=100&id=OinpqSk7y90z&format=png&color=000000',
                    }
                };

                setMessages(previousMessages => GiftedChat.append(previousMessages, [botReply]));

            }
            else {
                const botReplyText = response.data.msg || "I'm sorry, I couldn't understand that.";

                const botReply: Message = {
                    _id: Math.random(),
                    text: botReplyText,
                    createdAt: new Date(),
                    user: {
                        _id: 2,
                        name: 'FixMyCity Bot',
                        avatar: 'https://img.icons8.com/?size=100&id=OinpqSk7y90z&format=png&color=000000',
                    },
                };

                setMessages(previousMessages => GiftedChat.append(previousMessages, [botReply]));
            }
        } catch (error) {
            console.log('Chatbot error:', error);
            const errMsg: Message = {
                _id: Math.random(),
                text: '⚠️ Sorry, something went wrong. Please try again later.',
                createdAt: new Date(),
                user: {
                    _id: 2,
                    name: 'FixMyCity Bot',
                    avatar: 'https://img.icons8.com/?size=100&id=OinpqSk7y90z&format=png&color=000000',
                },
            };
            setMessages(previousMessages => GiftedChat.append(previousMessages, [errMsg]));
        } finally {
            setLoading(false);
        }
    }, []);

    const handleOptionPress = (option: string) => {
        const newMessage = {
            _id: Math.random(),
            text: option,
            createdAt: new Date(),
            user: { _id: 1, name: 'You', avatar: '' },
        };
        //@ts-ignore
        onSend([newMessage]);
    };

    const handleComplaintTap = (complaint: Complaint) => {
        // User selects a complaint
        const userMessage: Message = {
            _id: Math.random(),
            text: `📄 ${complaint.title}`,
            createdAt: new Date(),
            user: { _id: 1, name: 'You', avatar: '' },
        };

        // Bot responds with complaint details
        const statusEmoji =
            complaint.status === 'Resolved' ? '✅' :
                complaint.status === 'In Progress' ? '🔄' :
                    complaint.status === 'Pending' ? '⏳' : '📌';

        const botReply: Message = {
            _id: Math.random(),
            text: `${statusEmoji} Complaint Status\n\n` +
                `Title: ${complaint.title}\n` +
                `Status: ${complaint.status}\n` +
                (complaint.category ? `Category: ${complaint.category}\n` : '') +
                (complaint.description ? `Description: ${complaint.description}\n` : '') +
                (complaint.createdAt ? `Created: ${new Date(complaint.createdAt).toLocaleDateString()}\n` : ''),
            createdAt: new Date(),
            user: {
                _id: 2,
                name: 'FixMyCity Bot',
                avatar: 'https://img.icons8.com/?size=100&id=OinpqSk7y90z&format=png&color=000000',
            },
        };

        setMessages(previousMessages =>
            GiftedChat.append(GiftedChat.append(previousMessages, [userMessage]), [botReply])
        );
    };

    const renderMessage = (props: any) => {
        const { currentMessage } = props;

        // Render complaint list
        if (currentMessage.isComplaintList && currentMessage.complaints) {
            return (
                <View style={{ marginVertical: 0, marginHorizontal: 0 }}>
                    <Bubble {...props} />
                    <View style={{ marginTop: 8 }}>
                        {currentMessage.complaints.map((complaint: Complaint, index: number) => (
                            <TouchableOpacity
                                key={complaint._id || index}
                                onPress={() => handleComplaintTap(complaint)}
                                style={{
                                    backgroundColor: '#DDEFFF',
                                    borderRadius: 12,
                                    padding: 12,
                                    marginBottom: 8,
                                    borderLeftWidth: 4,
                                    borderLeftColor: '#4A90E2',
                                }}
                            >
                                <Text style={{
                                    color: '#0B0B64',
                                    fontWeight: '600',
                                    fontSize: 15,
                                    marginBottom: 4,
                                }}>
                                    {complaint.title}
                                </Text>
                                <Text style={{
                                    color: '#666',
                                    fontSize: 12,
                                }}>
                                    Status: {complaint.status}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            );
        }

        //Raise a new complaint
        if (currentMessage.isRaiseComplaint) {

            return (
                <View style={{ marginTop: 8 }}>
                    <Bubble {...props} />
                    <TouchableOpacity style={{
                        backgroundColor: '#DDEFFF',
                        borderRadius: 12,
                        padding: 12,
                        marginBottom: 8,
                        borderLeftWidth: 4,
                        borderLeftColor: '#4A90E2',
                        width: 256
                    }} onPress={() => {
                        //@ts-ignore
                        navigation.navigate('HomeScreen', { screen: 'UploadTab' });
                    }} className='bg-white p-2 px-4'>
                        <Text>Raise a new complaint</Text>
                    </TouchableOpacity>
                </View>
            )
        }

        // Default bubble rendering
        return <Bubble {...props} />;
    };

    return (
        <View style={{ flex: 1, backgroundColor: '#0B0B64' }}>
            {/* Header */}
            <View style={{ backgroundColor: '#4A90E2', padding: 12 }}>
                <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>
                    Hi, I am your FixMyCity Assistant 👋
                </Text>
                <Text style={{ color: 'white', fontSize: 13 }}>
                    How may I help you today?
                </Text>
            </View>

            {/* Quick Options */}
            <View style={{ padding: 10, flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                {quickOptions.map((option, index) => (
                    <TouchableOpacity
                        key={index}
                        onPress={() => handleOptionPress(option)}
                        style={{
                            backgroundColor: '#8EC9FF',
                            borderRadius: 20,
                            paddingVertical: 8,
                            paddingHorizontal: 16,
                            margin: 4,
                        }}
                    >
                        <Text style={{ color: '#0B0B64', fontWeight: '600' }}>{option}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Chat */}
            <GiftedChat
                messages={messages}
                //@ts-ignore
                onSend={messages => onSend(messages)}
                user={{ _id: 1 }}
                placeholder={loading ? 'Bot is typing...' : 'Type your message...'}

                renderMessage={renderMessage}
                renderAvatarOnTop
            />
        </View>
    );
};

export default Chatbot;