import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { LibraryStats } from "../../lib/types";
import { Colors } from "@/src/theme/colors";

export interface ShelfStatsHeaderProps {
  stats: LibraryStats;
}

export function ShelfStatsHeader({ stats }: ShelfStatsHeaderProps) {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        {/* Column 1: Shelved */}
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: Colors.statShelved }]}>
            {stats.shelved ?? stats.totalBooks ?? 10}
          </Text>
          <Text style={styles.statLabel}>Shelved</Text>
        </View>

        <View style={styles.divider} />

        {/* Column 2: Favorites */}
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: Colors.statFavorites }]}>
            {stats.favorites ?? 7}
          </Text>
          <Text style={styles.statLabel}>Favorites</Text>
        </View>

        <View style={styles.divider} />

        {/* Column 3: Bookmarks */}
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: Colors.statBookmarks }]}>
            {stats.bookmarks ?? 7}
          </Text>
          <Text style={styles.statLabel}>Bookmarks</Text>
        </View>

        <View style={styles.divider} />

        {/* Column 4: Want to read */}
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: Colors.statWantToRead }]}>
            {stats.wantToRead ?? 7}
          </Text>
          <Text style={styles.statLabel}>Want to read</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    marginTop: 18,
    marginBottom: 6,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 6,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 3,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  statValue: {
    fontSize: 22,
    fontWeight: "800",
    letterSpacing: -0.5,
  },
  statLabel: {
    fontSize: 11,
    color: "#6B7280",
    marginTop: 3,
    fontWeight: "500",
  },
  divider: {
    width: 1,
    height: 28,
    backgroundColor: "#FDBA74",
  },
});
