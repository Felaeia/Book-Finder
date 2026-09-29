import React from "react";
import { StyleSheet, Text, View, ViewStyle, TextStyle } from "react-native";
import { Colors } from "@/src/theme/colors";

export interface BadgeProps {
  label: string;
  variant?: "reading" | "want_to_read" | "completed" | "favorites" | "default";
  size?: "sm" | "md";
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export function Badge({ label, variant = "default", size = "sm", style, textStyle }: BadgeProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case "reading":
        return {
          backgroundColor: Colors.shelves.reading.bg,
          borderColor: Colors.shelves.reading.border,
          textColor: Colors.shelves.reading.text,
        };
      case "want_to_read":
        return {
          backgroundColor: Colors.shelves.want_to_read.bg,
          borderColor: Colors.shelves.want_to_read.border,
          textColor: Colors.shelves.want_to_read.text,
        };
      case "completed":
        return {
          backgroundColor: Colors.shelves.completed.bg,
          borderColor: Colors.shelves.completed.border,
          textColor: Colors.shelves.completed.text,
        };
      case "favorites":
        return {
          backgroundColor: Colors.shelves.favorites.bg,
          borderColor: Colors.shelves.favorites.border,
          textColor: Colors.shelves.favorites.text,
        };
      default:
        return {
          backgroundColor: "#F1F5F9",
          borderColor: "#E2E8F0",
          textColor: "#475569",
        };
    }
  };

  const vStyles = getVariantStyles();

  return (
    <View
      style={[
        styles.badge,
        size === "sm" ? styles.badgeSm : styles.badgeMd,
        { backgroundColor: vStyles.backgroundColor, borderColor: vStyles.borderColor },
        style,
      ]}
    >
      <Text
        style={[
          styles.text,
          size === "sm" ? styles.textSm : styles.textMd,
          { color: vStyles.textColor },
          textStyle,
        ]}
      >
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderWidth: 1,
    borderRadius: 9999,
    alignSelf: "flex-start",
    alignItems: "center",
    justifyContent: "center",
  },
  badgeSm: {
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  badgeMd: {
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  text: {
    fontWeight: "600",
  },
  textSm: {
    fontSize: 11,
  },
  textMd: {
    fontSize: 13,
  },
});
