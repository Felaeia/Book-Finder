import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { Image } from "expo-image";
import { Book } from "../../lib/types";
import { Badge } from "@/src/components/Global/Badge";
import { ProgressBar } from "@/src/components/Global/ProgressBar";
import { Colors } from "@/src/theme/colors";

export interface BookListCardProps {
  book: Book;
  onPress: (book: Book) => void;
  onToggleFavorite: (bookId: string) => void;
  onOpenShelfAction: (book: Book) => void;
}

export function BookListCard({
  book,
  onPress,
  onToggleFavorite,
  onOpenShelfAction,
}: BookListCardProps) {
  const percentage =
    book.totalPages > 0
      ? Math.min(100, Math.round((book.currentPage / book.totalPages) * 100))
      : 0;

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={() => onPress(book)}
      style={styles.container}
    >
      <View style={styles.coverWrapper}>
        <Image
          source={{ uri: book.coverUrl }}
          style={styles.coverImage}
          contentFit="cover"
          transition={300}
        />
      </View>

      <View style={styles.content}>
        <View style={styles.headerRow}>
          <Badge label={Colors.shelves[book.shelf].label} variant={book.shelf} size="sm" />
          <TouchableOpacity
            onPress={() => onToggleFavorite(book.id)}
            style={styles.favoriteButton}
            activeOpacity={0.7}
          >
            <Text style={styles.favoriteIcon}>{book.isFavorite ? "❤️" : "🤍"}</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.title} numberOfLines={2}>
          {book.title}
        </Text>
        <Text style={styles.author} numberOfLines={1}>
          {book.author}
        </Text>

        <View style={styles.metaRow}>
          <Text style={styles.genreTag}>{book.genre}</Text>
          {book.rating > 0 && (
            <View style={styles.ratingBadge}>
              <Text style={styles.star}>★</Text>
              <Text style={styles.ratingText}>{book.rating}.0</Text>
            </View>
          )}
        </View>

        {book.shelf === "reading" && (
          <View style={styles.progressSection}>
            <ProgressBar
              current={book.currentPage}
              total={book.totalPages}
              showText
              color={Colors.primary}
              height={5}
            />
          </View>
        )}

        <View style={styles.footerRow}>
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => onOpenShelfAction(book)}
            activeOpacity={0.7}
          >
            <Text style={styles.actionBtnText}>
              {book.shelf === "reading" ? "Update Progress 📖" : "Manage Shelf ⚙️"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 12,
    flexDirection: "row",
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
    gap: 14,
  },
  coverWrapper: {
    width: 86,
    height: 126,
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "#F1F5F9",
  },
  coverImage: {
    width: "100%",
    height: "100%",
  },
  content: {
    flex: 1,
    justifyContent: "space-between",
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  favoriteButton: {
    padding: 4,
  },
  favoriteIcon: {
    fontSize: 16,
  },
  title: {
    fontSize: 15,
    fontWeight: "700",
    color: Colors.text,
    lineHeight: 20,
    marginTop: 4,
  },
  author: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontWeight: "500",
    marginTop: 2,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 6,
  },
  genreTag: {
    fontSize: 11,
    color: "#64748B",
    backgroundColor: "#F1F5F9",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    fontWeight: "500",
  },
  ratingBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  star: {
    color: Colors.star,
    fontSize: 12,
  },
  ratingText: {
    fontSize: 11,
    color: Colors.textSecondary,
    fontWeight: "600",
  },
  progressSection: {
    marginTop: 8,
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 8,
  },
  actionBtn: {
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  actionBtnText: {
    fontSize: 12,
    color: Colors.primary,
    fontWeight: "600",
  },
});
