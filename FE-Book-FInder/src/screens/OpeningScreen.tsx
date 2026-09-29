import { View, Text, Image, StatusBar } from "react-native";
import { useEffect } from "react";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withDelay,
  withTiming,
  runOnJS,
} from "react-native-reanimated";

type Props = { onFinish: () => void };

export function OpeningScreen({ onFinish }: Props) {
  const scale = useSharedValue(0.8);
  const opacity = useSharedValue(0);
  const progress = useSharedValue(0); // 0 -> 1

  useEffect(() => {
    scale.value = withSpring(1, { damping: 12 });
    opacity.value = withDelay(300, withSpring(1));

    // Fill loader over 2s, then navigate
    progress.value = withTiming(1, { duration: 2000 }, (finished) => {
      if (finished) {
        runOnJS(onFinish)();
      }
    });
  }, []);

  const logoStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const textStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const progressStyle = useAnimatedStyle(() => ({
    width: `${progress.value * 100}%`,
  }));

  return (
    <View className="flex-1 bg-white items-center justify-center">
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Soft orange glow */}
      <View className="absolute w- h- rounded-full bg-[#F97316]/15" style={{ top: '32%' }} />

      <View className="items-center">
        <Animated.View style={logoStyle}>
          <Image
            source={require("../../assets/images/icon.png")}
            style={{ width: 140, height: 140 }}
            resizeMode="contain"
          />
        </Animated.View>

        <Animated.View style={textStyle} className="items-center mt-8">
          <Text className="text- font-extrabold text-black tracking-tight">
            BookFinder
          </Text>
          <Text className="text- text-black/60 mt-2 font-medium tracking-wide">
            Discover your next story
          </Text>
        </Animated.View>
      </View>

      {/* Bottom loader - now animated */}
      <View className="absolute bottom-20 items-center">
        <View className="w-24 h-1 bg-black/10 rounded-full overflow-hidden">
          <Animated.View
            className="h-full bg-[#F97316] rounded-full"
            style={progressStyle}
          />
        </View>
      </View>
    </View>
  );
}