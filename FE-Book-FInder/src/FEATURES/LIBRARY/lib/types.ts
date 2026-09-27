export type ShelfType = "all" | "reading" | "want_to_read" | "completed" | "favorites";

export type SortOption = "recent" | "title" | "author" | "rating" | "progress";

export type ViewMode = "grid" | "list";

export interface Book {
  id: string;
  title: string;
  author: string;
  coverUrl: string;
  shelf: Exclude<ShelfType, "all">;
  rating: number; // 0-5
  currentPage: number;
  totalPages: number;
  dateAdded: string;
  genre: string;
  description?: string;
  isFavorite?: boolean;
}

export interface LibraryStats {
  totalBooks: number;
  booksReading: number;
  booksWantToRead: number;
  booksCompleted: number;
  booksFavorites: number;
  pagesRead: number;
}
