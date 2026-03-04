import React, { SetStateAction, useState } from 'react';
import { View, Text, TextInput } from 'react-native';


interface Props {
    setComment: React.Dispatch<SetStateAction<string>>
    comment: string
}


const WorkerCommentsInput: React.FC<Props> = ({ comment, setComment }) => {
    const [isFocused, setIsFocused] = useState(false);
    return (
        <View className="space-y-3 mb-3">
            {/* Label */}
            <Text className="text-xs mb-2 font-bold uppercase tracking-wider text-gray-400 light:text-gray-500">
                Add comment
            </Text>

            {/* Text Input Container */}
            <View className="relative">
                <TextInput
                    className={`w-full p-4 bg-gray-50 light:bg-gray-900 border rounded-xl text-gray-800 light:text-white ${isFocused
                        ? 'border-primary ring-2 ring-primary/20'
                        : 'border-gray-100 light:border-gray-800'
                        }`}
                    placeholder='Add some description'
                    placeholderTextColor="#9ca3af"
                    value={comment}
                    onChangeText={setComment}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    multiline
                    numberOfLines={20}
                    maxLength={200}
                    textAlignVertical="top"
                    style={{ height: 120, paddingBottom: 24 }}
                />

                {/* Character Counter */}
                <View className="absolute bottom-3 right-3">
                    <Text className="text-[10px] text-gray-400">
                        {comment.trim().length} / {200}n  
                    </Text>
                </View>
            </View>
        </View>
    );
}

export default WorkerCommentsInput