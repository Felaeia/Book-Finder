import { Theme } from "@/src/constants/Theme";
import React from "react";
import { Image, Pressable, StyleSheet, View } from "react-native";
import { Book } from "../lib/types";

type Props = {
  book: Book;
  width?: number;
  height?: number;
  onPress?: () => void;
};

export default function BookCard({ book, width = 120, height = 180, onPress }: Props) {
  return (
    <Pressable onPress={onPress} accessibilityRole="button" accessibilityLabel={`View ${book.title}`} style={[styles.container, { width, height }]}>
      {book.coverUrl ? (
        <Image
          source={{ uri: book.coverUrl }}
          style={styles.cover}
          resizeMode="cover"
        />
      ) : (
        <View style={styles.placeholder} />
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: Theme.radius.card,
    overflow: "hidden",
    backgroundColor: "#333",
  },
  cover: {
    width: "100%",
    height: "100%",
  },
  placeholder: {
    width: "100%",
    height: "100%",
    backgroundColor: "#333",
  },
});
