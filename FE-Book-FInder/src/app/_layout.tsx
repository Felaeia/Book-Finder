// import { Stack } from "expo-router";
// import { SafeAreaProvider } from "react-native-safe-area-context";
import { LandingScreen } from "../components/FEATURES/LIBRARY";
import { View } from "react-native";

export default function RootLayout() {
  return (
    // <SafeAreaProvider>
    //   <Stack
    //     screenOptions={{
    //       headerShown: false,
    //       contentStyle: { backgroundColor: "#F8FAFC" },
    //     }}
    //   />
    // </SafeAreaProvider>
    <View style={{ flex: 1 }}>
      <LandingScreen></LandingScreen>
    </View>
  );
}
