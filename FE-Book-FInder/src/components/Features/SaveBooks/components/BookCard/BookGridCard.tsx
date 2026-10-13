import React from "react";
import { StyleSheet, Text, View, TouchableOpacity, Dimensions } from "react-native";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { Book } from "../../lib/types";

const { width } = Dimensions.get("window");
export interface BookGridCardProps {
  book: Book;
  onPress: (book: Book) => void;
  onToggleFavorite: (bookId: string) => void;
}

export function BookGridCard({ book, onPress, onToggleFavorite }: BookGridCardProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={() => onPress(book)}
      style={styles.container}
    >
      {/* Book Cover Image */}
      <View style={styles.coverWrapper}>
        <Image
          source={{ uri: book.coverUrl }}
          style={styles.coverImage}
          contentFit="cover"
          transition={250}
        />

        {/* Favorite Heart Button */}
        <TouchableOpacity
          onPress={() => onToggleFavorite(book.id)}
          style={styles.favoriteButton}
          activeOpacity={0.7}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          {book.isFavorite ? (
            <Ionicons
              name="heart"
              size={24}
              color="#EA580C"
              style={styles.heartShadow}
            />
          ) : (
            <Ionicons
              name="heart-outline"
              size={24}
              color="rgba(255, 255, 255, 0.85)"
              style={styles.heartShadow}
            />
          )}
        </TouchableOpacity>
      </View>

      {/* Book Info Footer */}
      <View style={styles.infoContainer}>
        <Text style={styles.title} numberOfLines={1}>
          {book.title}
        </Text>
        <Text style={styles.author} numberOfLines={1}>
          {book.author}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    maxWidth: "48%",
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    overflow: "hidden",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.16,
    shadowRadius: 8,
    elevation: 3,
  },
  coverWrapper: {
    width: "100%",
    height: 195,
    backgroundColor: "#27272A",
    position: "relative",
  },
  coverImage: {
    width: "100%",
    height: "100%",
  },
  favoriteButton: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 10,
  },
  heartShadow: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.45,
    shadowRadius: 4,
  },
  infoContainer: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: "#FFFFFF",
  },
  title: {
    fontSize: 14,
    fontWeight: "700",
    color: "#18181B",
    lineHeight: 18,
  },
  author: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 2,
    fontWeight: "500",
  },
});
