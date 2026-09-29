import { Theme } from "@/src/constants/Theme";
import React from "react";
import {
  ActivityIndicator,
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Book } from "../lib/types";

type Props = {
  query: string;
  setQuery: (val: string) => void;
  isFocused: boolean;
  setIsFocused: (val: boolean) => void;
  suggestions: Book[];
  loading: boolean;
  error: string | null;
  onSelect: (book: Book) => void;
};

export default function SearchBar({
  query,
  setQuery,
  isFocused,
  setIsFocused,
  suggestions,
  loading,
  error,
  onSelect,
}: Props) {
  const showDropdown = isFocused && query.length > 0;

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={query}
        onChangeText={setQuery}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder="Search for author or book"
        placeholderTextColor={Theme.colors.textMuted}
        autoCapitalize="none"
        autoCorrect={false}
        returnKeyType="search"
      />

      {showDropdown && (
        <View style={styles.dropdown}>
          {loading ? (
            <ActivityIndicator
              style={styles.loading}
              color={Theme.colors.accent}
            />
          ) : error ? (
            <Text style={styles.noResultsText}>{error}</Text>
          ) : suggestions.length > 0 ? (
            suggestions.map((book) => (
              <TouchableOpacity
                key={book.id}
                style={styles.suggestionItem}
                onPress={() => {
                  onSelect(book);
                  Keyboard.dismiss();
                }}
              >
                <Text style={styles.suggestionText} numberOfLines={1}>
                  {book.title}
                </Text>
              </TouchableOpacity>
            ))
          ) : (
            <Text style={styles.noResultsText}>No books found</Text>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
    zIndex: 10,
    elevation: 10,
    marginBottom: 32,
  },
  input: {
    backgroundColor: Theme.colors.surface,
    color: Theme.colors.textDark,
    borderRadius: Theme.radius.input,
    padding: 16,
    fontSize: 16,
  },
  dropdown: {
    position: "absolute",
    top: 60,
    left: 0,
    right: 0,
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.radius.card,
    padding: 8,
    zIndex: 20,
    elevation: 20,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  loading: {
    paddingVertical: 16,
  },
  suggestionItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  suggestionText: {
    color: Theme.colors.textDark,
    fontSize: 16,
  },
  noResultsText: {
    padding: 16,
    color: Theme.colors.textMuted,
    textAlign: "center",
  },
});
