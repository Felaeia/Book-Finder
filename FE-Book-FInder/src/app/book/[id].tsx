import React from "react";
import { useLocalSearchParams } from "expo-router";
import { BookDetailScreen } from "../../screens/BookDetailScreen";
import { INITIAL_BOOKS } from "../../components/FEATURES/LIBRARY/lib/mockData";

export default function BookDetailPage() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const book = INITIAL_BOOKS.find((b) => b.id === id) || INITIAL_BOOKS.find((b) => b.id === "7") || INITIAL_BOOKS[0];

  return <BookDetailScreen book={book} />;
}
