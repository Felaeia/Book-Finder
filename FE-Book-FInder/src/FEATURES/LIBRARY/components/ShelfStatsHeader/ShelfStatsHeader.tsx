import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { LibraryStats } from "../../lib/types";
import { Colors } from "@/theme/colors";

export interface ShelfStatsHeaderProps {
  stats: LibraryStats;
}

export function ShelfStatsHeader({ stats }: ShelfStatsHeaderProps) {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{stats.totalBooks}</Text>
          <Text style={styles.statLabel}>Shelved</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: Colors.shelves.reading.text }]}>
            {stats.booksReading}
          </Text>
          <Text style={styles.statLabel}>Reading</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: Colors.shelves.completed.text }]}>
            {stats.booksCompleted}
          </Text>
          <Text style={styles.statLabel}>Completed</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: Colors.primary }]}>{stats.pagesRead}</Text>
          <Text style={styles.statLabel}>Pages Read</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 4,
  },
  card: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statValue: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.text,
  },
  statLabel: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 2,
    fontWeight: "500",
  },
  divider: {
    width: 1,
    height: 24,
    backgroundColor: Colors.border,
  },
});
