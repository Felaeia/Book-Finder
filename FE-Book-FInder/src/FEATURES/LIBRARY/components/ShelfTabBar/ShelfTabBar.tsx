import React from "react";
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from "react-native";
import { ShelfType } from "../../lib/types";
import { Colors } from "@/theme/colors";

export interface ShelfTab {
  key: ShelfType;
  label: string;
  count: number;
}

export interface ShelfTabBarProps {
  activeTab: ShelfType;
  tabs: ShelfTab[];
  onSelectTab: (tab: ShelfType) => void;
}

export function ShelfTabBar({ activeTab, tabs, onSelectTab }: ShelfTabBarProps) {
  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <TouchableOpacity
              key={tab.key}
              onPress={() => onSelectTab(tab.key)}
              activeOpacity={0.7}
              style={[
                styles.tabButton,
                isActive ? styles.activeTabButton : styles.inactiveTabButton,
              ]}
            >
              <Text
                style={[
                  styles.tabLabel,
                  isActive ? styles.activeTabLabel : styles.inactiveTabLabel,
                ]}
              >
                {tab.label}
              </Text>
              <View
                style={[
                  styles.countBadge,
                  isActive ? styles.activeCountBadge : styles.inactiveCountBadge,
                ]}
              >
                <Text
                  style={[
                    styles.countText,
                    isActive ? styles.activeCountText : styles.inactiveCountText,
                  ]}
                >
                  {tab.count}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 12,
  },
  scrollContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  tabButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 24,
    borderWidth: 1,
  },
  activeTabButton: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  inactiveTabButton: {
    backgroundColor: Colors.card,
    borderColor: Colors.border,
  },
  tabLabel: {
    fontSize: 13,
    fontWeight: "600",
  },
  activeTabLabel: {
    color: "#FFFFFF",
  },
  inactiveTabLabel: {
    color: Colors.textSecondary,
  },
  countBadge: {
    marginLeft: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 12,
  },
  activeCountBadge: {
    backgroundColor: "rgba(255, 255, 255, 0.25)",
  },
  inactiveCountBadge: {
    backgroundColor: "#F1F5F9",
  },
  countText: {
    fontSize: 11,
    fontWeight: "700",
  },
  activeCountText: {
    color: "#FFFFFF",
  },
  inactiveCountText: {
    color: Colors.textSecondary,
  },
});
