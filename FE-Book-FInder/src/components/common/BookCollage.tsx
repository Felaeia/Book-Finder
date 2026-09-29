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
  { id: 1, uri: "...", style: { top: "-1%", left: "2%", width: 110, height: 140, rotate: "0deg", zIndex: 1 } }, // top left
  { id: 2, uri: "...", style: { top: "3%", left: "37%", width: 110, height: 140, rotate: "0deg", zIndex: 2 } }, // top mid
  { id: 3, uri: "...", style: { top: "-1%", left: "70%", width: 110, height: 140, rotate: "0deg", zIndex: 1 } }, // top right
  { id: 4, uri: "...", style: { top: "30%", left: "2%", width: 110, height: 140, rotate: "0deg", zIndex: 3 } }, // mid left
  { id: 5, uri: "...", style: { top: "34%", left: "37%", width: 110, height: 140, rotate: "0deg", zIndex: 4 } }, // mid mid
  { id: 6, uri: "...", style: { top: "30%", left: "70%", width: 110, height: 140, rotate: "0deg", zIndex: 3 } }, // mid right
  { id: 7, uri: "...", style: { top: "61%", left: "2%", width: 110, height: 140, rotate: "0deg", zIndex: 5 } }, //bottom left
  { id: 8, uri: "...", style: { top: "65%", left: "37%", width: 110, height: 140, rotate: "0deg", zIndex: 6 } }, //bottom mid
  { id: 9, uri: "...", style: { top: "61%", left: "70%", width: 110, height: 140, rotate: "0deg", zIndex: 4 } }, //bottom right
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
    flex: 1,                  
    position: "relative",
    marginTop: 20,
    overflow: "hidden",       
  },
  bookImage: {
    position: "absolute",
    borderRadius: 8,
    resizeMode: "cover",
    elevation: 8,
  },
});