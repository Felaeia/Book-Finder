import React from "react";
import { StyleSheet, View, Text, ViewStyle } from "react-native";
import { Colors } from "@/theme/colors";

export interface ProgressBarProps {
  current: number;
  total: number;
  showText?: boolean;
  color?: string;
  height?: number;
  style?: ViewStyle;
}

export function ProgressBar({
  current,
  total,
  showText = false,
  color = Colors.primary,
  height = 6,
  style,
}: ProgressBarProps) {
  const percentage = total > 0 ? Math.min(100, Math.max(0, Math.round((current / total) * 100))) : 0;

  return (
    <View style={[styles.container, style]}>
      <View style={[styles.track, { height }]}>
        <View style={[styles.fill, { width: `${percentage}%`, backgroundColor: color, height }]} />
      </View>
      {showText && (
        <View style={styles.textRow}>
          <Text style={styles.text}>{`${current} / ${total} pages`}</Text>
          <Text style={styles.percentageText}>{`${percentage}%`}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  track: {
    width: "100%",
    backgroundColor: "#E2E8F0",
    borderRadius: 9999,
    overflow: "hidden",
  },
  fill: {
    borderRadius: 9999,
  },
  textRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 4,
  },
  text: {
    fontSize: 11,
    color: Colors.textSecondary,
    fontWeight: "500",
  },
  percentageText: {
    fontSize: 11,
    color: Colors.primary,
    fontWeight: "600",
  },
});
