import { Ionicons } from "@expo/vector-icons";
import { Href, usePathname, useRouter } from "expo-router";
import { Pressable, StyleSheet, View } from "react-native";

const tabs = [
  { key: "home", label: "Home", icon: "home", route: "/library" },
  { key: "explore", label: "Explore", icon: "compass", route: "/search" },
  { key: "saved", label: "Saved books", icon: "bookmark", route: "/saved" },
] as const;

export default function FloatingTabBar() {
  const pathname = usePathname();
  const router = useRouter();
  const activeTab = pathname.startsWith("/book/")
    ? "explore"
    : pathname === "/search"
      ? "explore"
      : pathname === "/saved"
        ? "saved"
        : "home";

  return (
    <View pointerEvents="box-none" style={styles.overlay}>
      <View style={styles.bar}>
        {tabs.map((tab) => (
          <Pressable
            key={tab.key}
            onPress={() => router.navigate(tab.route as unknown as Href)}
            style={styles.tab}
            accessibilityRole="tab"
            accessibilityLabel={tab.label}
            accessibilityState={{ selected: activeTab === tab.key }}
          >
            <Ionicons
              name={tab.icon}
              size={26}
              color="#FFFFFF"
              style={{ opacity: activeTab === tab.key ? 1 : 0.78 }}
            />
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 20,
    alignItems: "center",
    zIndex: 20,
  },
  bar: {
    width: 180,
    height: 46,
    paddingHorizontal: 5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    backgroundColor: "#FF642D",
    borderRadius: 12,
    elevation: 8,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.24,
    shadowRadius: 6,
  },
  tab: {
    width: 52,
    height: 42,
    alignItems: "center",
    justifyContent: "center",
  },
});