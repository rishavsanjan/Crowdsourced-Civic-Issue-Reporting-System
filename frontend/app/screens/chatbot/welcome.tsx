import React, { useEffect, useRef } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  Animated,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'WelcomeChatbot'>;

const BUBBLES = [
  { id: 1, text: '👋 Welcome! I\'m your civic assistant.' },
  { id: 2, text: 'Report potholes, broken lights, or any local issue — I\'ll help you get it fixed.' },
  { id: 3, text: 'What\'s on your mind today?' },
];

const CHIPS = [
  { label: '🕳  Report pothole' },
  { label: '💡 Broken streetlight' },
  { label: '🗑  Overflowing bin' },
];

const WelcomeChatbot: React.FC<Props> = ({ navigation }) => {
  const fadeAnims = useRef(BUBBLES.map(() => new Animated.Value(0))).current;
  const slideAnims = useRef(BUBBLES.map(() => new Animated.Value(16))).current;
  const chipsAnim = useRef(new Animated.Value(0)).current;
  const ctaAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const bubbleAnimations = BUBBLES.map((_, i) =>
      Animated.parallel([
        Animated.timing(fadeAnims[i], {
          toValue: 1,
          duration: 350,
          delay: 300 + i * 280,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnims[i], {
          toValue: 0,
          duration: 350,
          delay: 300 + i * 280,
          useNativeDriver: true,
        }),
      ])
    );

    Animated.sequence([
      Animated.stagger(280, bubbleAnimations),
      Animated.parallel([
        Animated.timing(chipsAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
        Animated.timing(ctaAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
      ]),
    ]).start();
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-[#0d0d2b]">

      {/* Decorative rings */}
      <View className="absolute top-0 left-0 right-0 h-48 overflow-hidden pointer-events-none">
        <View className="absolute w-56 h-56 rounded-full border border-[#F1F060]/20 -top-20 -left-10" />
        <View className="absolute w-36 h-36 rounded-full border border-[#F1F060]/15 -top-5 right-3" />
      </View>

      <View className="flex-1 px-6 pt-10 pb-6 justify-between">

        {/* Top: branding */}
        <View className="items-center gap-y-2">
          <View className="w-14 h-14 rounded-2xl bg-[#F1F060] items-center justify-center">
            {/* House icon */}
            <Text className="text-2xl">🏙️</Text>
          </View>
          <Text className="text-[#F1F060] text-[11px] font-semibold tracking-[3px] uppercase">
            FixMyCity
          </Text>
        </View>

        {/* Chat bubbles */}
        <View className="gap-y-3 mt-6">
          {/* Avatar row */}
          <View className="flex-row items-center gap-x-3 mb-1">
            <View className="w-9 h-9 rounded-full bg-[#F1F060] items-center justify-center">
              <Text className="text-base">🤖</Text>
            </View>
            <Text className="text-[#F1F060] text-xs font-semibold tracking-wide">
              Civic Assistant
            </Text>
          </View>

          {BUBBLES.map((bubble, i) => (
            <Animated.View
              key={bubble.id}
              style={{
                opacity: fadeAnims[i],
                transform: [{ translateY: slideAnims[i] }],
              }}
              className="ml-12"
            >
              <View className="bg-[#1a1a4e] rounded-[18px] rounded-tl-[4px] px-4 py-3 self-start max-w-[85%]">
                <Text className="text-[#e8e8ff] text-sm leading-relaxed">
                  {bubble.text}
                </Text>
              </View>
            </Animated.View>
          ))}

          {/* Suggestion chips */}
          <Animated.View
            style={{ opacity: chipsAnim }}
            className="flex-row flex-wrap gap-2 ml-12 mt-1"
          >
            {CHIPS.map((chip) => (
              <TouchableOpacity
                key={chip.label}
                onPress={() => navigation.navigate('Chatbot')}
                className="bg-[#F1F060]/10 border border-[#F1F060]/30 rounded-full px-3 py-1.5"
              >
                <Text className="text-[#F1F060] text-xs font-medium">
                  {chip.label}
                </Text>
              </TouchableOpacity>
            ))}
          </Animated.View>
        </View>

        {/* CTA */}
        <Animated.View style={{ opacity: ctaAnim }} className="gap-y-3 mt-8">
          <TouchableOpacity
            onPress={() => navigation.navigate('Chatbot')}
            activeOpacity={0.85}
            className="bg-[#F1F060] rounded-2xl py-4 items-center w-full"
          >
            <Text className="text-[#0d0d2b] text-base font-bold tracking-wide">
              Get Started
            </Text>
          </TouchableOpacity>
          
        </Animated.View>

      </View>
    </SafeAreaView>
  );
};

export default WelcomeChatbot;