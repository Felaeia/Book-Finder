import { Feather } from "@expo/vector-icons";
import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BookCollage from "../components/common/BookCollage";

export function LandingScreen({ onLogin }: { onLogin: () => void }) {
  return (
    <View className="flex-1 bg-[#F97316]">
      <StatusBar barStyle="light-content" backgroundColor="#F97316" />
      <SafeAreaView className="flex-1 pt-2 pb-6">
        {/* TOP - This is the fix */}
        <View className="items-center justify-center mt-4">
          {/* 1. Badge */}
          <View className="flex-row items-center bg-white/20 px-3.5 py-1.5 rounded-full border border-white/40">
            <Feather name="book-open" size={12} color="#FFF" />
            <Text className="text- font-bold text-white ml-1.5 tracking-[1.8px]">
              WELCOME TO
            </Text>
          </View>

          {/* 2. App name goes DOWN now - it's in a column */}
          <Text className="text- font-extrabold text-white text-center tracking-tight mt-3">
            BookFinder
          </Text>
        </View>

        <View className="flex-1">
          <BookCollage />
        </View>

        <View className="px-8 pb-6">
          <Text className="text- text-white text-center leading-6 font-medium opacity-95">
            Discover captivating stories that transport you to different worlds
            with every read
          </Text>
        </View>

        <View className="px-6 gap-3.5">
          <TouchableOpacity
            className="bg-white py- rounded-xl items-center justify-center flex-row"
            activeOpacity={0.9}
            style={{
              elevation: 4,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.15,
              shadowRadius: 8,
            }}
          >
            <Feather name="user-plus" size={30} color="#F97316" />
            <Text className="text-[#F97316] text- font-bold ml-2">Sign up</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="bg-transparent border-[1.5px] border-white py- rounded-xl items-center justify-center flex-row"
            activeOpacity={0.9}
            onPress={onLogin}
          >
            <Feather name="log-in" size={29} color="#FFF" />
            <Text className="text-white text- font-bold ml-2">Log in</Text>
          </TouchableOpacity>

          <View className="flex-row justify-center items-center mt-2 flex-wrap">
            <Text className="text-white text- opacity-90">
              By continuing, you agree to our{" "}
            </Text>
            <Pressable>
              <Text className="text-white text- underline font-semibold">
                Terms
              </Text>
            </Pressable>
            <Text className="text-white text- opacity-90"> & </Text>
            <Pressable>
              <Text className="text-white text- underline font-semibold">
                Privacy Policy
              </Text>
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}
