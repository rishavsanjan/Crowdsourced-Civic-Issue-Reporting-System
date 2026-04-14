import React, { useEffect, useRef } from 'react';
import {
    View,
    Text,
    Animated,
    StatusBar,
} from 'react-native';

export default function CivicPulseSplash() {
    const progressAnim = useRef(new Animated.Value(0)).current;
    const logoScale = useRef(new Animated.Value(0.85)).current;
    const logoOpacity = useRef(new Animated.Value(0)).current;
    const textOpacity = useRef(new Animated.Value(0)).current;
    const footerOpacity = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.sequence([
            Animated.parallel([
                Animated.spring(logoScale, {
                    toValue: 1,
                    tension: 60,
                    friction: 8,
                    useNativeDriver: true,
                }),
                Animated.timing(logoOpacity, {
                    toValue: 1,
                    duration: 400,
                    useNativeDriver: true,
                }),
            ]),
            Animated.timing(textOpacity, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }),
            Animated.timing(footerOpacity, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }),
        ]).start();

        Animated.timing(progressAnim, {
            toValue: 0.3,
            duration: 1200,
            delay: 400,
            useNativeDriver: false,
        }).start();
    }, []);

    const progressWidthPercent = progressAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0%', '100%'],
    });

    return (
        <View className="flex-1 bg-[#f8f9ff] items-center justify-between overflow-hidden">
            <StatusBar barStyle="dark-content" backgroundColor="#f8f9ff" />

            {/* Ambient blobs */}
            <View className="absolute -top-[5%] -left-[10%] w-[50%] aspect-square rounded-full bg-[#0050cb]/5" />
            <View className="absolute bottom-[5%] right-[5%] w-[35%] aspect-square rounded-full bg-[#00682c]/5" />

            {/* Top spacer */}
            <View className="h-20" />

            {/* Main branding */}
            <View className="flex-1 items-center justify-center">

                {/* Logo */}
                <Animated.View
                    style={{ opacity: logoOpacity, transform: [{ scale: logoScale }] }}
                    className="items-center justify-center mb-8"
                >
                    {/* Glow halo */}
                    <View className="absolute w-[120px] h-[120px] rounded-[32px] bg-[#0050cb]/10" />

                    {/* Logo card */}
                    <View className="w-24 h-24 rounded-3xl bg-white items-center justify-center shadow-md">
                        <MonitoringIcon />
                    </View>

                    {/* Pulse ring */}
                    <View className="absolute w-28 h-28 rounded-[32px] border-2 border-[#0050cb]/10" />
                </Animated.View>

                {/* Text */}
                <Animated.View
                    style={{ opacity: textOpacity }}
                    className="items-center gap-y-2"
                >
                    <Text className="text-[40px] font-extrabold tracking-tight text-[#121c28]">
                        FixMyCity
                    </Text>
                    <Text className="text-base font-medium tracking-wide text-[#424656]">
                        Rebuilding community
                    </Text>
                </Animated.View>

            </View>

            {/* Footer */}
            <Animated.View
                style={{ opacity: footerOpacity }}
                className="w-full max-w-xs px-6 mb-12 items-center gap-y-10"
            >
                {/* Progress section */}
                <View className="w-full gap-y-3">
                    <View className="w-full h-1 bg-[#d9e3f4] rounded-full overflow-hidden">
                        <Animated.View
                            style={{ width: progressWidthPercent }}
                            className="h-full bg-[#0050cb] rounded-full"
                        />
                    </View>
                    <Text className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#727687] text-center">
                        Syncing Network
                    </Text>
                </View>

                {/* Version info */}
                <View className="items-center gap-y-1">
                    <View className="px-3 py-1 bg-[#eef4ff] rounded-full">
                        <Text className="text-[11px] font-semibold text-[#424656]">
                            v1.0.0 Stable
                        </Text>
                    </View>
                    <Text className="text-[10px] font-medium text-[#727687]">
                        The Civic Sentinel Framework
                    </Text>
                </View>
            </Animated.View>
        </View>
    );
}

function MonitoringIcon() {
    return (
        <View className="w-12 h-12 flex-row items-end justify-between px-1 pb-1.5 relative">
            <View className="w-2 h-4 rounded bg-[#0050cb]" />
            <View className="w-2 h-6 rounded bg-[#0050cb]" />
            <View className="w-2 h-8 rounded bg-[#0050cb]" />
            <View className="w-2 h-10 rounded bg-[#0050cb]" />
            {/* Baseline */}
            <View className="absolute bottom-1 left-1 right-1 h-0.5 rounded bg-[#0050cb]/40" />
        </View>
    );
}