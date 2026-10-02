import { Feather, FontAwesome } from "@expo/vector-icons";
import { Image as ExpoImage } from "expo-image";
import { useState } from "react";
import { Image, KeyboardAvoidingView, Platform, Pressable, ScrollView, StatusBar, StyleSheet, Text, TextInput, View } from "react-native";
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

            <Pressable style={({ pressed }) => [styles.login, { opacity: pressed ? 0.8 : 1 }]} accessibilityRole="button" onPress={() => setMessage("Login is not available yet. Your credentials have not been sent.")}>
              <Text style={styles.loginText}>Log In</Text>
            </Pressable>
            <Text style={styles.or}>or</Text>
            <Pressable style={styles.social} accessibilityRole="button" onPress={() => setMessage("Google sign-in is not available yet.")}>
              <ExpoImage style={styles.google} source={{ uri: `data:image/svg+xml;utf8,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><path fill="#4285F4" d="M43.6 24.5c0-1.4-.1-2.8-.4-4.1H24v7.8h11a9.4 9.4 0 0 1-4.1 6.2v5h6.6c3.9-3.6 6.1-8.8 6.1-14.9Z"/><path fill="#34A853" d="M24 44c5.5 0 10.1-1.8 13.5-4.6l-6.6-5c-1.8 1.2-4.1 1.9-6.9 1.9-5.3 0-9.8-3.6-11.4-8.4H5.8v5.2A20 20 0 0 0 24 44Z"/><path fill="#FBBC05" d="M12.6 27.9a12 12 0 0 1 0-7.8v-5.2H5.8a20 20 0 0 0 0 18.2l6.8-5.2Z"/><path fill="#EA4335" d="M24 11.7c3 0 5.7 1 7.8 3.1l5.8-5.8A19.6 19.6 0 0 0 24 4 20 20 0 0 0 5.8 14.9l6.8 5.2C14.2 15.3 18.7 11.7 24 11.7Z"/></svg>')}` }} />
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
  content: { flexGrow: 1, width: "100%", maxWidth: 420, alignSelf: "center", paddingBottom: 32 },
  header: { height: 215 },
  brand: { position: "absolute", top: 24, left: 13 },
  logo: { width: 51, height: 43, marginLeft: -6, marginTop: -2 },
  brandName: { fontSize: 18, fontWeight: "700", color: "#FF6025" },
  illustration: { position: "absolute", right: 10, top: 16, width: 133, height: 165, overflow: "hidden" },
  cat: { position: "absolute", width: 284, height: 189.33, top: -17, left: -9 },
  heading: { position: "absolute", left: 19, bottom: 25, color: "#FF6025", fontSize: 23, fontWeight: "500" },
  form: { paddingHorizontal: 24 },
  field: { minHeight: 38, flexDirection: "row", alignItems: "center", paddingHorizontal: 15, gap: 20, backgroundColor: "#F5EEEE", borderWidth: 1, borderColor: "#F0E5E5", borderRadius: 12 },
  input: { flex: 1, minWidth: 0, paddingVertical: 9, fontSize: 12, color: "#454040" },
  passwordField: { marginTop: 21 },
  forgot: { alignSelf: "flex-end", paddingTop: 3, paddingBottom: 10 },
  link: { color: "#FF6025", fontSize: 11 },
  login: { minHeight: 38, marginHorizontal: 4, marginTop: 12, borderRadius: 24, backgroundColor: "#FA6326", alignItems: "center", justifyContent: "center" },
  loginText: { color: "#FFFFFF", fontSize: 13, fontWeight: "700" },
  or: { color: "#999999", textAlign: "center", fontSize: 12, marginVertical: 10 },
  social: { minHeight: 38, marginHorizontal: 4, borderWidth: 1, borderColor: "#E5DEDE", borderRadius: 24, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10 },
  google: { width: 18, height: 18 },
  socialText: { fontSize: 12, fontWeight: "700", color: "#666666" },
  facebook: { marginTop: 8 },
  signup: { flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 12, marginTop: 14 },
  signupText: { fontSize: 11, color: "#999999" },
  message: { color: "#686363", fontSize: 12, textAlign: "center", marginTop: 16 },
});
