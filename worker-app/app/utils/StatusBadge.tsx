import { Text, View } from "react-native"
import { Jobs } from "../types/job"

export const getStatusBadge = (status: Jobs['status']) => {
    switch (status) {
        case 'in-progress':
            return (
                <View className="shrink-0 px-2.5 py-1 rounded-full bg-primary/10 border border-primary/20">
                    <Text className="text-[11px] font-bold uppercase tracking-wider text-primary">
                        In Progress
                    </Text>
                </View>
            );
        case 'pending':
            return (
                <View className="shrink-0 px-2.5 py-1 rounded-full bg-amber-100 border border-amber-200 light:bg-amber-900/30 light:border-amber-800">
                    <Text className="text-[11px] font-bold uppercase tracking-wider text-amber-700 light:text-amber-400">
                        Pending
                    </Text>
                </View>
            );
        case 'completed':
            return (
                <View className="shrink-0 px-2.5 py-1 rounded-full bg-emerald-100 border border-emerald-200 light:bg-emerald-900/30 light:border-emerald-800">
                    <Text className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 light:text-emerald-400">
                        Completed
                    </Text>
                </View>
            );
    }
};