import React from "react";
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from "react-native";
import { ShelfType } from "../../lib/types";

export interface ShelfTab {
  key: ShelfType;
  label: string;
  count?: number;
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
              activeOpacity={0.8}
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
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 18,
    marginBottom: 6,
  },
  scrollContent: {
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  tabButton: {
    paddingHorizontal: 18,
    paddingVertical: 9,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  activeTabButton: {
    backgroundColor: "#EA580C",
    shadowColor: "#EA580C",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
    elevation: 3,
  },
  inactiveTabButton: {
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 1,
  },
  tabLabel: {
    fontSize: 13,
  },
  activeTabLabel: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
  inactiveTabLabel: {
    color: "#374151",
    fontWeight: "600",
  },
});
