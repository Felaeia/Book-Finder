import { Theme } from "@/src/constants/Theme";
import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { Book } from "../lib/types";

type Props = {
  subjectLabel: string;
  books: Book[];
};

const THUMB_WIDTH = 64;
const THUMB_HEIGHT = 96;
const CLUSTER_BG = "#2a1414";

export default function SubjectGroupCard({ subjectLabel, books }: Props) {
  const thumbs = books.slice(0, 3);

  return (
    <View style={styles.container}>
      <View style={styles.stack}>
        {thumbs.map((book, index) => (
          <View
            key={book.id}
            style={[
              styles.thumbWrapper,
              {
                marginLeft: index === 0 ? 0 : -24,
                zIndex: thumbs.length - index,
              },
            ]}
          >
            {book.coverUrl ? (
              <Image
                source={{ uri: book.coverUrl }}
                style={styles.thumb}
                resizeMode="cover"
              />
            ) : (
              <View style={styles.thumb} />
            )}
          </View>
        ))}
      </View>
      <Text style={styles.label}>{subjectLabel}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginRight: 24,
  },
  stack: {
    flexDirection: "row",
    backgroundColor: CLUSTER_BG,
    borderRadius: Theme.radius.card,
    padding: 12,
  },
  thumbWrapper: {
    borderRadius: Theme.radius.card,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: CLUSTER_BG,
  },
  thumb: {
    width: THUMB_WIDTH,
    height: THUMB_HEIGHT,
    backgroundColor: "#333",
  },
  label: {
    color: Theme.colors.textPrimary,
    fontSize: 14,
    fontWeight: "600",
    marginTop: 8,
  },
});
