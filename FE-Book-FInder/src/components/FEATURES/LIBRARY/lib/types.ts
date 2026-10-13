export type ShelfType =
  | "all"
  | "favorites"
  | "bookmarks"
  | "want_to_read"
  | "reading"
  | "completed";

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
  isBookmarked?: boolean;
  series?: string;
  edition?: string;
  publishedDate?: string;
  publisher?: string;
  ratingsCount?: string;
  reviewsCount?: string;
  authorPhotoUrl?: string;
  authorBio?: string;
}

export interface LibraryStats {
  shelved: number;
  favorites: number;
  bookmarks: number;
  wantToRead: number;
  totalBooks?: number;
  booksReading?: number;
  booksWantToRead?: number;
  booksCompleted?: number;
  booksFavorites?: number;
  pagesRead?: number;
}
