import { Feather, FontAwesome } from "@expo/vector-icons";
import { Image as ExpoImage } from "expo-image";
import { useState } from "react";
import { Image, KeyboardAvoidingView, Platform, Pressable, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function LoginScreen() {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [message, setMessage] = useState("");

  return (
    <SafeAreaView style={styles.page}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <KeyboardAvoidingView style={styles.page} behavior={Platform.OS === "ios" ? "padding" : "height"}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <View style={styles.header}>
            <View style={styles.brand}>
              <Image source={require("../../assets/images/icon.png")} style={styles.logo} />
              <Text style={styles.brandName}>BookFinder</Text>
            </View>
            <View style={styles.illustration} pointerEvents="none" accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
              <Image source={require("../../assets/images/cats.png")} style={styles.cat} />
            </View>
            <Text style={styles.heading}>Welcome back</Text>
          </View>

          <View style={styles.form}>
            <View style={styles.field}>
              <Feather name="mail" size={21} color="#686363" />
              <TextInput style={styles.input} placeholder="Email or username" placeholderTextColor="#999393" accessibilityLabel="Email or username" autoCapitalize="none" autoCorrect={false} autoComplete="username" textContentType="username" />
            </View>
            <View style={[styles.field, styles.passwordField]}>
              <Feather name="lock" size={21} color="#686363" />
              <TextInput style={styles.input} placeholder="Password" placeholderTextColor="#999393" accessibilityLabel="Password" secureTextEntry={!passwordVisible} autoCapitalize="none" autoCorrect={false} autoComplete="current-password" textContentType="password" />
              <Pressable onPress={() => setPasswordVisible(!passwordVisible)} accessibilityRole="button" accessibilityLabel={passwordVisible ? "Hide password" : "Show password"} hitSlop={12}>
                <Feather name={passwordVisible ? "eye-off" : "eye"} size={15} color="#686363" />
              </Pressable>
            </View>
            <Pressable style={styles.forgot} accessibilityRole="button" hitSlop={8} onPress={() => setMessage("Password reset is not available yet.")}>
              <Text style={styles.link}>Forgot password?</Text>
            </Pressable>

            <TouchableOpacity style={styles.login} activeOpacity={0.8} accessibilityRole="button" onPress={() => setMessage("Login is not available yet. Your credentials have not been sent.")}>
              <Text style={styles.loginText}>Log In</Text>
            </TouchableOpacity>
            <Text style={styles.or}>or</Text>
            <Pressable style={styles.social} accessibilityRole="button" onPress={() => setMessage("Google sign-in is not available yet.")}>
              <ExpoImage style={styles.google} source={{ uri: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0OCA0OCI+PHBhdGggZmlsbD0iIzQyODVGNCIgZD0iTTQzLjYgMjQuNWMwLTEuNC0uMS0yLjgtLjQtNC4xSDI0djcuOGgxMWE5LjQgOS40IDAgMCAxLTQuMSA2LjJ2NWg2LjZjMy45LTMuNiA2LjEtOC44IDYuMS0xNC45WiIvPjxwYXRoIGZpbGw9IiMzNEE4NTMiIGQ9Ik0yNCA0NGM1LjUgMCAxMC4xLTEuOCAxMy41LTQuNmwtNi42LTVjLTEuOCAxLjItNC4xIDEuOS02LjkgMS45LTUuMyAwLTkuOC0zLjYtMTEuNC04LjRINS44djUuMkEyMCAyMCAwIDAgMCAyNCA0NFoiLz48cGF0aCBmaWxsPSIjRkJCQzA1IiBkPSJNMTIuNiAyNy45YTEyIDEyIDAgMCAxIDAtNy44di01LjJINS44YTIwIDIwIDAgMCAwIDAgMTguMmw2LjgtNS4yWiIvPjxwYXRoIGZpbGw9IiNFQTQzMzUiIGQ9Ik0yNCAxMS43YzMgMCA1LjcgMSA3LjggMy4xbDUuOC01LjhBMTkuNiAxOS42IDAgMCAwIDI0IDQgMjAgMjAgMCAwIDAgNS44IDE0LjlsNi44IDUuMkMxNC4yIDE1LjMgMTguNyAxMS43IDI0IDExLjdaIi8+PC9zdmc+" }} />
              <Text style={styles.socialText}>Continue with Google</Text>
            </Pressable>
            <Pressable style={[styles.social, styles.facebook]} accessibilityRole="button" onPress={() => setMessage("Facebook sign-in is not available yet.")}>
              <FontAwesome name="facebook" size={23} color="#3D5C9E" />
              <Text style={styles.socialText}>Continue with Facebook</Text>
            </Pressable>
            <View style={styles.signup}>
              <Text style={styles.signupText}>Don’t have an account?</Text>
              <Pressable accessibilityRole="button" hitSlop={10} onPress={() => setMessage("Sign up is not available yet.")}>
                <Text style={styles.link}>Sign Up</Text>
              </Pressable>
            </View>
            <Text accessibilityLiveRegion="polite" style={styles.message}>{message}</Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: "#FFFFFF" },
  content: { flexGrow: 1, width: "100%", paddingBottom: 32 },
  header: { height: 215 },
  brand: { position: "absolute", top: 24, left: 13 },
  logo: { width: 51, height: 43, marginLeft: -6, marginTop: -2 },
  brandName: { fontSize: 18, fontWeight: "700", color: "#FF6025" },
  illustration: { position: "absolute", right: 10, top: 16, width: 133, height: 165, overflow: "hidden" },
  cat: { position: "absolute", width: 284, height: 189.33, top: -17, left: -9 },
  heading: { position: "absolute", left: 19, bottom: 25, color: "#FF6025", fontSize: 23, fontWeight: "500" },
  form: { paddingHorizontal: 24 },
  field: { minHeight: 48, flexDirection: "row", alignItems: "center", paddingHorizontal: 15, gap: 20, backgroundColor: "#F5EEEE", borderWidth: 1, borderColor: "#F0E5E5", borderRadius: 12 },
  input: { flex: 1, minWidth: 0, paddingVertical: 9, fontSize: 14, color: "#454040" },
  passwordField: { marginTop: 21 },
  forgot: { alignSelf: "flex-end", paddingTop: 3, paddingBottom: 10 },
  link: { color: "#FF6025", fontSize: 13 },
  login: { minHeight: 48, marginHorizontal: 4, marginTop: 12, borderRadius: 24, backgroundColor: "#FA6326", alignItems: "center", justifyContent: "center" },
  loginText: { color: "#FFFFFF", fontSize: 16, fontWeight: "700" },
  or: { color: "#999999", textAlign: "center", fontSize: 12, marginVertical: 10 },
  social: { minHeight: 48, marginHorizontal: 4, borderWidth: 1, borderColor: "#E5DEDE", borderRadius: 24, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10 },
  google: { width: 18, height: 18 },
  socialText: { fontSize: 14, fontWeight: "700", color: "#666666" },
  facebook: { marginTop: 8 },
  signup: { flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 12, marginTop: 14 },
  signupText: { fontSize: 13, color: "#999999" },
  message: { color: "#686363", fontSize: 12, textAlign: "center", marginTop: 16 },
});
