import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { ShelfType } from "../../lib/types";
import { Colors } from "@/theme/colors";

export interface EmptyShelfStateProps {
  shelf: ShelfType;
  isSearching: boolean;
  onResetSearch?: () => void;
  onExploreBooks?: () => void;
}

export function EmptyShelfState({
  shelf,
  isSearching,
  onResetSearch,
  onExploreBooks,
}: EmptyShelfStateProps) {
  const getEmptyDetails = () => {
    if (isSearching) {
      return {
        icon: "🔍",
        title: "No Matching Books",
        subtitle: "We couldn't find any books matching your search query.",
        buttonText: "Clear Search",
        action: onResetSearch,
      };
    }

    switch (shelf) {
      case "reading":
        return {
          icon: "📖",
          title: "No Books In Progress",
          subtitle: "Pick a book from your wishlist or discover a new read to start tracking.",
          buttonText: "Browse Books",
          action: onExploreBooks,
        };
      case "want_to_read":
        return {
          icon: "🔖",
          title: "Your Reading List is Empty",
          subtitle: "Save books you want to read next to build your personal queue.",
          buttonText: "Discover Books",
          action: onExploreBooks,
        };
      case "completed":
        return {
          icon: "🏆",
          title: "No Finished Books Yet",
          subtitle: "Books you finish reading will appear here with your ratings and review notes.",
          buttonText: "Explore Books",
          action: onExploreBooks,
        };
      case "favorites":
        return {
          icon: "⭐",
          title: "No Favorite Books",
          subtitle: "Tap the heart icon on any book to add it to your favorite collection.",
          buttonText: "View All Books",
          action: onExploreBooks,
        };
      default:
        return {
          icon: "📚",
          title: "Your Shelf is Empty",
          subtitle: "Start building your digital library by searching and adding books.",
          buttonText: "Add First Book",
          action: onExploreBooks,
        };
    }
  };

  const details = getEmptyDetails();

  return (
    <View style={styles.container}>
      <Text style={styles.icon}>{details.icon}</Text>
      <Text style={styles.title}>{details.title}</Text>
      <Text style={styles.subtitle}>{details.subtitle}</Text>
      {details.buttonText && details.action && (
        <TouchableOpacity style={styles.button} onPress={details.action} activeOpacity={0.8}>
          <Text style={styles.buttonText}>{details.buttonText}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 32,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
  },
  icon: {
    fontSize: 48,
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.text,
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: "center",
    lineHeight: 20,
    maxWidth: 280,
    marginBottom: 20,
  },
  button: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
});
