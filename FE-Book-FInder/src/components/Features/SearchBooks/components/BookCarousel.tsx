import { Theme } from "@/src/constants/Theme";
import React from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Book } from "../lib/types";
import BookCard from "./BookCard";

type Props = {
  title: string;
  books: Book[];
  loading?: boolean;
  onSeeAll?: () => void;
  onBookPress?: (book: Book) => void;
};

export default function BookCarousel({
  title,
  books,
  loading,
  onSeeAll,
  onBookPress,
}: Props) {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{title}</Text>
        {onSeeAll && (
          <TouchableOpacity style={styles.seeAllButton} onPress={onSeeAll}>
            <Text style={styles.seeAllText}>see all</Text>
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={loading ? [] : books}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <BookCard book={item} onPress={() => onBookPress?.(item)} />}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    color: Theme.colors.textPrimary,
    fontSize: 18,
    fontWeight: "bold",
  },
  seeAllButton: {
    borderWidth: 1,
    borderColor: Theme.colors.surface,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  seeAllText: {
    color: Theme.colors.textMuted,
    fontSize: 12,
  },
  list: {
    gap: Theme.spacing.itemGap,
  },
});
