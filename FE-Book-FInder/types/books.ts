// types/book.ts
import type { ImageSourcePropType } from "react-native";

export type Book = {
  id: string;
  title: string;
  authors: string[];
  cover: ImageSourcePropType;
  genres: string[];
  recommended: boolean;
};

export type GenreGroup = {
  id: string;
  label: string;
  bookIds: string[];
};