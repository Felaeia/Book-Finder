import React from "react";
import { View, Image, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const COVERS = [
  { id: 1, uri: "https://covers.openlibrary.org/b/isbn/9780439554930-L.jpg", top: "0%", left: "4%", rotate: "-4deg", z: 1 },
  { id: 2, uri: "https://covers.openlibrary.org/b/isbn/9780140328721-L.jpg", top: "2%", left: "36.5%", rotate: "3deg", z: 2 },
  { id: 3, uri: "https://covers.openlibrary.org/b/isbn/9780061120084-L.jpg", top: "0%", left: "69%", rotate: "-2deg", z: 1 },
  { id: 4, uri: "https://covers.openlibrary.org/b/isbn/9780451524935-L.jpg", top: "32%", left: "4%", rotate: "2deg", z: 3 },
  { id: 5, uri: "https://covers.openlibrary.org/b/isbn/9780743273565-L.jpg", top: "36%", left: "36.5%", rotate: "-3deg", z: 5 },
  { id: 6, uri: "https://covers.openlibrary.org/b/isbn/9780544003415-L.jpg", top: "32%", left: "69%", rotate: "4deg", z: 3 },
  { id: 7, uri: "https://covers.openlibrary.org/b/isbn/9780439023481-L.jpg", top: "64%", left: "4%", rotate: "-3deg", z: 4 },
  { id: 8, uri: "https://covers.openlibrary.org/b/isbn/9780062315007-L.jpg", top: "68%", left: "36.5%", rotate: "2deg", z: 6 },
  { id: 9, uri: "https://covers.openlibrary.org/b/isbn/9780385472579-L.jpg", top: "64%", left: "69%", rotate: "-4deg", z: 4 },
];

export default function BookCollage() {
  return (
    <View style={styles.container}>
      {COVERS.map((b) => (
        <Image
          key={b.id}
          source={{ uri: b.uri }}
          style={[
            styles.book,
            {
              top: b.top as any,
              left: b.left as any,
              transform: [{ rotate: b.rotate }],
              zIndex: b.z,
            },
          ]}
        />
      ))}
      {/* Fade for text readability - solves your contrast issue */}
      <LinearGradient
        colors={["transparent", "#F97316"]}
        style={styles.fade}
        pointerEvents="none"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flex: 1,
    position: "relative",
    marginTop: 24,
  },
  book: {
    position: "absolute",
    width: 108,
    height: 152,
    borderRadius: 12,
    backgroundColor: "#fb923c", // placeholder while loading
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.8)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 8,
  },
  fade: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 120,
    zIndex: 10,
  },
});