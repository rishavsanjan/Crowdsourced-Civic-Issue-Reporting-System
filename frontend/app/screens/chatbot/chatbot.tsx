import React, { useState, useCallback, useEffect, useRef } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Animated,
    StatusBar,
    Platform,
} from 'react-native';
import { GiftedChat, Bubble, InputToolbar, Send, Composer } from 'react-native-gifted-chat';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/navigation';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import API_BASE_IP from '../../../config/api';
import { useTranslation } from 'react-i18next';

type Props = NativeStackScreenProps<RootStackParamList, 'Chatbot'>;

interface Message {
    _id: number;
    text: string;
    createdAt: Date;
    user: { _id: number; name: string; avatar: string };
    isComplaintList?: boolean;
    complaints?: any[];
    isRaiseComplaint?: boolean;
}

interface Complaint {
    _id: string;
    title: string;
    status: string;
    category?: string;
    description?: string;
    createdAt?: string;
}

const BOT_AVATAR = 'https://img.icons8.com/?size=100&id=OinpqSk7y90z&format=png&color=000000';

const STATUS_CONFIG: Record<string, {
    emoji: string;
    borderClass: string;
    badgeClass: string;
    textClass: string;
}> = {
    Resolved: { emoji: '✅', borderClass: 'border-l-green-500', badgeClass: 'bg-green-50', textClass: 'text-green-600' },
    'In Progress': { emoji: '🔄', borderClass: 'border-l-amber-400', badgeClass: 'bg-amber-50', textClass: 'text-amber-600' },
    Pending: { emoji: '⏳', borderClass: 'border-l-indigo-500', badgeClass: 'bg-indigo-50', textClass: 'text-indigo-600' },
    default: { emoji: '📌', borderClass: 'border-l-slate-400', badgeClass: 'bg-slate-100', textClass: 'text-slate-500' },
};

const getStatusCfg = (status: string) =>
    STATUS_CONFIG[status] ?? STATUS_CONFIG.default;

const QUICK_OPTIONS = [
    { label: 'complaintStatus', value: 'Complaint Status' },
    { label: 'raiseComplaint', value: 'Raise New Complaint' },
    { label: 'vision', value: 'What is our vision ?' },
];

// ─── Animated Chip ────────────────────────────────────────────────────────────
const QuickChip: React.FC<{ label: string; onPress: () => void; delay: number }> = ({
    label, onPress, delay,
}) => {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(10)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, { toValue: 1, duration: 380, delay, useNativeDriver: true }),
            Animated.timing(slideAnim, { toValue: 0, duration: 380, delay, useNativeDriver: true }),
        ]).start();
    }, []);

    return (
        <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
            <TouchableOpacity
                onPress={onPress}
                activeOpacity={0.75}
                className="bg-white rounded-full px-4 py-2 border border-blue-200"
            >
                <Text className="text-blue-900 text-[13px] font-semibold">{label}</Text>
            </TouchableOpacity>
        </Animated.View>
    );
};

// ─── Main Component ───────────────────────────────────────────────────────────
const Chatbot: React.FC<Props> = ({ navigation }) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(false);
    const headerAnim = useRef(new Animated.Value(0)).current;

    const {t} = useTranslation();
    useEffect(() => {
        Animated.timing(headerAnim, { toValue: 1, duration: 550, useNativeDriver: true }).start();
        setMessages([{
            _id: 1,
            text: t('chatbotWelcome'),
            createdAt: new Date(),
            user: { _id: 2, name: 'FixMyCity Bot', avatar: BOT_AVATAR },
        }]);
    }, []);

    const appendBot = (partial: Partial<Message>) =>
        setMessages(prev => GiftedChat.append(prev, [{
            _id: Math.random(), text: '', createdAt: new Date(),
            user: { _id: 2, name: 'FixMyCity Bot', avatar: BOT_AVATAR },
            ...partial,
        }]));

    const onSend = useCallback(async (newMessages: Message[] = []) => {
        const token = await AsyncStorage.getItem('citytoken');
        const userMessage = newMessages[0];
        setMessages(prev => GiftedChat.append(prev, newMessages));
        try {
            setLoading(true);
            const response = await axios.post(
                `${API_BASE_IP}/api/user/chatbot-message`,
                // @ts-ignore
                { message: userMessage.text },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            // @ts-ignore
            const text: string = userMessage.text;
            if (text === 'Complaint Status') {
                const fetched: Complaint[] = response.data.complaint || [];
                fetched.length > 0
                    ? appendBot({ text: t('complaintsList'), isComplaintList: true, complaints: fetched })
                    : appendBot({ text: t('noComplaints') });
            } else if (text === 'Raise New Complaint') {
                appendBot({ text: t('raisePrompt'), isRaiseComplaint: true });
            } else if (text === 'What is our vision ?') {
                appendBot({ text: t('mission') });
            } else {
                appendBot({ text: response.data.msg || t('unknown') });
            }
        } catch {
            appendBot({ text: t('error') });
        } finally {
            setLoading(false);
        }
    }, []);

    const handleOptionPress = (value: string) =>
        // @ts-ignore
        onSend([{ _id: Math.random(), text: value, createdAt: new Date(), user: { _id: 1, name: 'You', avatar: '' } }]);

    const handleComplaintTap = (complaint: Complaint) => {
        const { emoji } = getStatusCfg(complaint.status);
        const userMsg: Message = {
            _id: Math.random(), text: `📄 ${complaint.title}`,
            createdAt: new Date(), user: { _id: 1, name: 'You', avatar: '' },
        };
        const botMsg: Message = {
            _id: Math.random(),
            text:
                `${emoji} ${complaint.status}\n\n${complaint.title}\n` +
                (complaint.category ? `🏷 ${complaint.category}\n` : '') +
                (complaint.description ? `📝 ${complaint.description}\n` : '') +
                (complaint.createdAt ? `📅 Filed: ${new Date(complaint.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}` : ''),
            createdAt: new Date(),
            user: { _id: 2, name: 'FixMyCity Bot', avatar: BOT_AVATAR },
        };
        setMessages(prev => GiftedChat.append(GiftedChat.append(prev, [userMsg]), [botMsg]));
    };

    // ── GiftedChat Bubble — must use its own wrapperStyle/textStyle API ───────
    const renderBubble = (props: any) => (
        <Bubble
            {...props}
            wrapperStyle={{
                right: {
                    backgroundColor: '#3B82F6',
                    borderRadius: 18,
                    borderBottomRightRadius: 4,
                    elevation: 3,
                    marginBottom: 2,
                },
                left: {
                    backgroundColor: '#FFFFFF',
                    borderRadius: 18,
                    borderBottomLeftRadius: 4,
                    elevation: 2,
                    marginBottom: 2,
                },
            }}
            textStyle={{
                right: { color: '#fff', fontSize: 14.5, lineHeight: 21 },
                left: { color: '#1E293B', fontSize: 14.5, lineHeight: 21 },
            }}
            timeTextStyle={{
                right: { color: 'rgba(255,255,255,0.6)', fontSize: 10.5 },
                left: { color: '#94A3B8', fontSize: 10.5 },
            }}
        />
    );

    // ── Custom message renderer ───────────────────────────────────────────────
    const renderMessage = (props: any) => {
        const { currentMessage } = props;

        // Complaint list
        if (currentMessage.isComplaintList && currentMessage.complaints) {
            return (
                <View className="mx-2 mb-1">
                    {renderBubble(props)}
                    <View className="mt-2 gap-y-2">
                        {currentMessage.complaints.map((c: Complaint, i: number) => {
                            const cfg = getStatusCfg(c.status);
                            return (
                                <TouchableOpacity
                                    key={c._id || i}
                                    onPress={() => handleComplaintTap(c)}
                                    activeOpacity={0.8}
                                    className={`bg-white rounded-2xl px-4 py-3 border-l-4 flex-row items-center justify-between ${cfg.borderClass}`}
                                >
                                    <Text
                                        className="flex-1 text-slate-800 font-semibold text-sm mr-3"
                                        numberOfLines={1}
                                    >
                                        {c.title}
                                    </Text>
                                    <View className={`rounded-full px-3 py-1 ${cfg.badgeClass}`}>
                                        <Text className={`text-xs font-bold ${cfg.textClass}`}>
                                            {cfg.emoji} {c.status}
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </View>
            );
        }

        // Raise complaint
        if (currentMessage.isRaiseComplaint) {
            return (
                <View className="mx-2 mb-1">
                    {renderBubble(props)}
                    <TouchableOpacity
                        activeOpacity={0.85}
                        className="mt-3 bg-blue-900 rounded-2xl py-4 px-5 items-center"
                        onPress={() =>
                            // @ts-ignore
                            navigation.navigate('HomeScreen', { screen: 'UploadTab' })
                        }
                    >
                        <Text className="text-white text-[15px] font-bold tracking-wide">
                            {t('fileComplaint')}
                        </Text>
                    </TouchableOpacity>
                </View>
            );
        }

        return renderBubble(props);
    };

    // ── GiftedChat toolbar/composer/send — their props require style objects ──
    const renderInputToolbar = (props: any) => (
        <InputToolbar
            {...props}
            containerStyle={{
                backgroundColor: '#fff',
                borderTopWidth: 0,
                borderRadius: 20,
                marginHorizontal: 10,
                marginBottom: Platform.OS === 'ios' ? 24 : 10,
                paddingHorizontal: 8,
                paddingVertical: 6,
                elevation: 6,
                shadowColor: '#000',
                shadowOpacity: 0.08,
                shadowRadius: 10,
                shadowOffset: { width: 0, height: -2 },
            }}
            primaryStyle={{ alignItems: 'center' }}
        />
    );

    const renderComposer = (props: any) => (
        <Composer
            {...props}
            textInputStyle={{
                backgroundColor: '#EFF6FF',
                borderRadius: 14,
                paddingHorizontal: 14,
                paddingTop: 10,
                paddingBottom: 10,
                fontSize: 14.5,
                color: '#1E293B',
                marginVertical: 0,
                lineHeight: 20,
            }}
            placeholderTextColor="#94A3B8"
        />
    );

    const renderSend = (props: any) => (
        <Send {...props} containerStyle={{ justifyContent: 'center', alignItems: 'center', marginRight: 2 }}>
            <View className="w-10 h-10 rounded-full bg-blue-500 items-center justify-center">
                <Text className="text-white text-lg font-bold leading-5">↑</Text>
            </View>
        </Send>
    );

    return (
        <View className="flex-1 bg-blue-50">
            <StatusBar barStyle="light-content" backgroundColor="#1E3A5F" />

            {/* ── Header — Animated.View needs inline style for transform ── */}
            <Animated.View
                style={{
                    opacity: headerAnim,
                    transform: [{
                        translateY: headerAnim.interpolate({ inputRange: [0, 1], outputRange: [-20, 0] }),
                    }],
                }}
                className={`flex-row items-center bg-blue-900 px-5 pb-4 gap-x-3 ${Platform.OS === 'android' ? 'pt-4' : 'pt-14'}`}
            >
                <View className="w-11 h-11 rounded-full bg-white/20 items-center justify-center">
                    <Text className="text-2xl">🏙</Text>
                </View>

                <View className="flex-1">
                    <Text className="text-white text-[17px] font-bold tracking-wide">
                        {t('assistant')}
                    </Text>
                    <View className="flex-row items-center mt-0.5 gap-x-1.5">
                        <View className="w-2 h-2 rounded-full bg-green-400" />
                        <Text className="text-white/60 text-xs font-medium">
                            {t('online')}
                        </Text>
                    </View>
                </View>
            </Animated.View>

            {/* ── Quick option chips ── */}
            <View className="flex-row flex-wrap gap-2 px-3.5 py-2.5 bg-blue-50">
                {QUICK_OPTIONS.map((opt, i) => (
                    <QuickChip
                        key={opt.value}
                        label={t(opt.label)}
                        onPress={() => handleOptionPress(opt.value)}
                        delay={i * 80}
                    />
                ))}
            </View>

            {/* ── GiftedChat ── */}
            <GiftedChat
                messages={messages}
                // @ts-ignore
                onSend={msgs => onSend(msgs)}
                user={{ _id: 1 }}
                placeholder={loading ? t('typing') : t('placeholder')}
                renderMessage={renderMessage}
                renderBubble={renderBubble}
                renderInputToolbar={renderInputToolbar}
                renderComposer={renderComposer}
                renderSend={renderSend}
                renderAvatarOnTop
                showAvatarForEveryMessage={false}
                messagesContainerStyle={{ backgroundColor: '#EFF6FF', paddingHorizontal: 16, paddingVertical:20 }}
                isTyping={loading}
                alwaysShowSend
            />
        </View>
    );
};

export default Chatbot;