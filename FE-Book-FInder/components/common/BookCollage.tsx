// src/components/Common/BookCollage.tsx
import React from "react";
import { View, Image, StyleSheet, ViewStyle } from "react-native";

type BookEntry = {
  id: number;
  uri: string;
  style: {
    top: ViewStyle["top"];
    left: ViewStyle["left"];
    width: number;
    height: number;
    rotate: `${number}deg`;
    zIndex: number;
  };
};

const BOOKS: BookEntry[] = [
  { id: 1, uri: "...", style: { top: "-5%", left: "2%", width: 90, height: 135, rotate: "-4deg", zIndex: 1 } },
  { id: 2, uri: "...", style: { top: "10%", left: "30%", width: 105, height: 155, rotate: "2deg", zIndex: 2 } },
  { id: 3, uri: "...", style: { top: "-5%", left: "68%", width: 90, height: 135, rotate: "6deg", zIndex: 1 } },
  { id: 4, uri: "...", style: { top: "26%", left: "5%", width: 95, height: 140, rotate: "-2deg", zIndex: 3 } },
  { id: 5, uri: "...", style: { top: "32%", left: "28%", width: 110, height: 160, rotate: "0deg", zIndex: 4 } },
  { id: 6, uri: "...", style: { top: "34%", left: "68%", width: 90, height: 135, rotate: "3deg", zIndex: 3 } },
  { id: 7, uri: "...", style: { top: "54%", left: "-5%", width: 95, height: 140, rotate: "-5deg", zIndex: 5 } },
  { id: 8, uri: "...", style: { top: "58%", left: "26%", width: 115, height: 165, rotate: "1deg", zIndex: 6 } },
  { id: 9, uri: "...", style: { top: "56%", left: "68%", width: 95, height: 140, rotate: "-2deg", zIndex: 4 } },
];

export default function BookCollage() {
  return (
    <View style={styles.collageContainer} pointerEvents="none">
      {BOOKS.map((book) => (
        <Image
          key={book.id}
          source={{ uri: book.uri }}
          style={[
            styles.bookImage,
            {
              top: book.style.top,
              left: book.style.left,
              width: book.style.width,
              height: book.style.height,
              transform: [{ rotate: book.style.rotate }],
              zIndex: book.style.zIndex,
            },
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  collageContainer: {
    width: "100%",
    flex: 1,                  // <-- Changed from height: "65%"
    position: "relative",
    marginTop: 20,
    overflow: "hidden",       // <-- Added
  },
  bookImage: {
    position: "absolute",
    borderRadius: 8,
    resizeMode: "cover",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});