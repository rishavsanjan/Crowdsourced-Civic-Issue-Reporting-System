import { View, Text, Image, ScrollView, Dimensions } from 'react-native';
import { Video, ResizeMode } from 'expo-av';

const { width } = Dimensions.get('window');

interface ProofMedia {
    file_type: 'video' | 'image';
    file_url: string;
    uploaded_at: Date;
}

const ProofMediaItem = ({ item }: { item: ProofMedia }) => {
    if (item.file_type === 'image') {
        return (
            <Image
                source={{ uri: item.file_url }}
                style={{ height: 250, width: 400 }}
                resizeMode="cover"
            />
        );
    } else if (item.file_type === 'video') {
        return (
            <Video
                source={{ uri: item.file_url }}
                style={{ width: 400, height: 250 }}
                useNativeControls
                shouldPlay={false}
                resizeMode={ResizeMode.COVER}
            />
        );
    }
};

const WorkEvidenceProof = ({ media }: { media: ProofMedia[] }) => {
    return (
        <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 8 }}
        >
            {media.map((item, index) => (
                <View key={index} className="mr-3 rounded-xl overflow-hidden">
                    <ProofMediaItem item={item} />
                </View>
            ))}
        </ScrollView>
    );
};

export default WorkEvidenceProof;