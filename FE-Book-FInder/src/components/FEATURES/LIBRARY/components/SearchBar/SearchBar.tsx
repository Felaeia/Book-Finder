import React from "react";
import { StyleSheet, TextInput, View, TouchableOpacity, Text } from "react-native";
import { ViewMode, SortOption } from "../../lib/types";
import { Colors } from "@/src/theme/colors";

export interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  viewMode: ViewMode;
  onToggleViewMode: () => void;
  currentSort: SortOption;
  onOpenFilterSort: () => void;
}

export function SearchBar({
  value,
  onChangeText,
  viewMode,
  onToggleViewMode,
  currentSort,
  onOpenFilterSort,
}: SearchBarProps) {
  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.input}
          placeholder="Search by title or author..."
          placeholderTextColor={Colors.textMuted}
          value={value}
          onChangeText={onChangeText}
          clearButtonMode="while-editing"
          autoCapitalize="none"
          autoCorrect={false}
        />
        {value.length > 0 && (
          <TouchableOpacity onPress={() => onChangeText("")} style={styles.clearBtn}>
            <Text style={styles.clearText}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      <TouchableOpacity
        style={styles.iconButton}
        onPress={onOpenFilterSort}
        activeOpacity={0.7}
      >
        <Text style={styles.btnIcon}>⚡</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.iconButton}
        onPress={onToggleViewMode}
        activeOpacity={0.7}
      >
        <Text style={styles.btnIcon}>{viewMode === "grid" ? "☰" : "⊞"}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
  },
  inputContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 12,
    height: 44,
  },
  searchIcon: {
    fontSize: 14,
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: Colors.text,
    height: "100%",
  },
  clearBtn: {
    padding: 4,
  },
  clearText: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: "700",
  },
  iconButton: {
    width: 44,
    height: 44,
    backgroundColor: Colors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  btnIcon: {
    fontSize: 18,
    color: Colors.text,
  },
});
