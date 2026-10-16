import React from "react";
import { useLocalSearchParams } from "expo-router";
import { BookDetailScreen } from "../../screens/BookDetailScreen";
import { INITIAL_BOOKS } from "../../components/Features/SaveBooks/lib/mockData";
import { Book } from "../../components/Features/SaveBooks/lib/types";

export default function BookDetailPage() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const book: Book = INITIAL_BOOKS.find((b: Book) => b.id === id) || INITIAL_BOOKS.find((b: Book) => b.id === "7") || INITIAL_BOOKS[0];

  return <BookDetailScreen book={book} />;
}
