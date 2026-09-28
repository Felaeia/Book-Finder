import React from "react";
import { StyleSheet, Text, View, TouchableOpacity, Dimensions } from "react-native";
import { Image } from "expo-image";
import { Book } from "../../lib/types";
import { Badge } from "@/src/components/Global/Badge";
import { ProgressBar } from "@/src/components/Global/ProgressBar";
import { Colors } from "@/src/theme/colors";

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - 48) / 2;

export interface BookGridCardProps {
  book: Book;
  onPress: (book: Book) => void;
  onToggleFavorite: (bookId: string) => void;
}

export function BookGridCard({ book, onPress, onToggleFavorite }: BookGridCardProps) {
  const percentage =
    book.totalPages > 0
      ? Math.min(100, Math.round((book.currentPage / book.totalPages) * 100))
      : 0;

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={() => onPress(book)}
      style={[styles.container, { width: CARD_WIDTH }]}
    >
      <View style={styles.coverWrapper}>
        <Image
          source={{ uri: book.coverUrl }}
          style={styles.coverImage}
          contentFit="cover"
          transition={300}
        />
        <TouchableOpacity
          onPress={() => onToggleFavorite(book.id)}
          style={styles.favoriteButton}
          activeOpacity={0.7}
        >
          <Text style={styles.favoriteIcon}>{book.isFavorite ? "❤️" : "🤍"}</Text>
        </TouchableOpacity>
        <View style={styles.badgeContainer}>
          <Badge label={Colors.shelves[book.shelf].label} variant={book.shelf} size="sm" />
        </View>
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.title} numberOfLines={2}>
          {book.title}
        </Text>
        <Text style={styles.author} numberOfLines={1}>
          {book.author}
        </Text>

        {book.shelf === "reading" && (
          <View style={styles.progressSection}>
            <ProgressBar
              current={book.currentPage}
              total={book.totalPages}
              color={Colors.primary}
              height={5}
            />
            <Text style={styles.progressText}>{`${percentage}% done`}</Text>
          </View>
        )}

        {book.rating > 0 && (
          <View style={styles.ratingRow}>
            <Text style={styles.stars}>{"★".repeat(book.rating)}</Text>
            <Text style={styles.ratingNumber}>{book.rating}.0</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.card,
    borderRadius: 14,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  coverWrapper: {
    width: "100%",
    height: 190,
    backgroundColor: "#F1F5F9",
    position: "relative",
  },
  coverImage: {
    width: "100%",
    height: "100%",
  },
  favoriteButton: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "rgba(255, 255, 255, 0.85)",
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  favoriteIcon: {
    fontSize: 14,
  },
  badgeContainer: {
    position: "absolute",
    bottom: 8,
    left: 8,
  },
  infoContainer: {
    padding: 10,
  },
  title: {
    fontSize: 14,
    fontWeight: "700",
    color: Colors.text,
    lineHeight: 18,
  },
  author: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
    fontWeight: "500",
  },
  progressSection: {
    marginTop: 8,
  },
  progressText: {
    fontSize: 10,
    color: Colors.primary,
    fontWeight: "600",
    marginTop: 3,
    textAlign: "right",
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
    gap: 4,
  },
  stars: {
    color: Colors.star,
    fontSize: 12,
  },
  ratingNumber: {
    fontSize: 11,
    color: Colors.textSecondary,
    fontWeight: "600",
  },
});
