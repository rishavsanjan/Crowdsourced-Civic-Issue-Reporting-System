import LottieView from 'lottie-react-native'
import React from 'react'
import { View } from 'react-native'

const Loading = () => {
    return (
        <View className="flex-1 justify-center items-center ">
            <LottieView
                source={require('../../../../assets/loading_animations/loader.json')}
                autoPlay
                loop
                speed={2}
                style={{ width: 50, height: 50 }}
            />
        </View>
    )
}

export default Loading