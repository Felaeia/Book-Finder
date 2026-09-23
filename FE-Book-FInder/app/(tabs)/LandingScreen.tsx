// src/components/ui/LandingScreen.tsx
import { Feather } from "@expo/vector-icons";
import { View, Text, TouchableOpacity, StatusBar } from "react-native";
import BookCollage from "@/components/common/BookCollage";

export default function LandingScreen() {
  return (
    <View className="flex-1 bg-[#F97316] pt-14 pb-8">
      <StatusBar barStyle="light-content" backgroundColor="#F97316" />

      {/* Top: WELCOME TO badge */}
      <View className="flex-row items-center justify-center">
        <View className="flex-row items-center bg-white/15 px-3 py-1.5 rounded-full border border-white/30">
          <Feather name="book-open" size={12} color="#FFFFFF" />
          <Text className="text-[10px] font-bold text-white ml-1.5 tracking-widest">
            WELCOME TO
          </Text>
        </View>
      </View>

      {/* Middle: Collage takes remaining space */}
      <View className="flex-1">
        <BookCollage />
      </View>

      {/* Title + Subtitle (no flex — sized to content) */}
      <View className="px-[30px] pb-6">
        <Text className="text-[42px] font-extrabold text-white mb-3 text-center">
          BookFinder
        </Text>
        <Text className="text-base text-white text-center opacity-90 leading-6 font-normal">
          Discover captivating stories, that transport you to different worlds
          with every read
        </Text>
      </View>

      {/* Bottom: Actions (no flex — anchored at bottom) */}
      <View className="px-6 gap-3">
        <TouchableOpacity
          className="bg-white py-4 rounded-xl items-center justify-center flex-row"
          onPress={() => console.log("Log in pressed")}
          activeOpacity={0.85}
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.15,
            shadowRadius: 8,
            elevation: 3,
          }}
        >
          <Feather name="log-in" size={18} color="#F97316" />
          <Text className="text-[#F97316] text-base font-bold ml-2 leading-5">
            Log in
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="bg-transparent border-2 border-white py-4 rounded-xl items-center justify-center flex-row"
          onPress={() => console.log("Sign up pressed")}
          activeOpacity={0.85}
        >
          <Feather name="user-plus" size={18} color="#FFFFFF" />
          <Text className="text-white text-base font-bold ml-2 leading-5">
            Sign up
          </Text>
        </TouchableOpacity>

        <Text className="text-white text-xs text-center opacity-70 mt-2 leading-4">
          By continuing, you agree to our{" "}
          <Text className="underline font-semibold">Terms</Text>
          {" "}&{" "}
          <Text className="underline font-semibold">Privacy Policy</Text>
        </Text>
      </View>
    </View>
  );
}