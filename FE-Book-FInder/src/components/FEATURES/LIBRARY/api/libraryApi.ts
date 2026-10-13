import { Book, LibraryStats, ShelfType } from "../lib/types";
import { INITIAL_BOOKS } from "../lib/mockData";

let booksStore: Book[] = [...INITIAL_BOOKS];

export const libraryApi = {
  async getBooks(shelf?: ShelfType): Promise<Book[]> {
    if (!shelf || shelf === "all") {
      return [...booksStore];
    }
    if (shelf === "favorites") {
      return booksStore.filter((b) => b.isFavorite);
    }
    if (shelf === "bookmarks") {
      return booksStore.filter((b) => b.isBookmarked);
    }
    return booksStore.filter((b) => b.shelf === shelf);
  },

  async updateShelf(bookId: string, newShelf: Exclude<ShelfType, "all">): Promise<Book> {
    const index = booksStore.findIndex((b) => b.id === bookId);
    if (index === -1) throw new Error("Book not found");

    const book = booksStore[index];
    let updatedPage = book.currentPage;
    if (newShelf === "completed") {
      updatedPage = book.totalPages;
    } else if (newShelf === "want_to_read" && book.shelf === "reading") {
      updatedPage = 0;
    }

    const updatedBook: Book = {
      ...book,
      shelf: newShelf,
      currentPage: updatedPage,
    };
    booksStore[index] = updatedBook;
    return updatedBook;
  },

  async updateProgress(bookId: string, currentPage: number): Promise<Book> {
    const index = booksStore.findIndex((b) => b.id === bookId);
    if (index === -1) throw new Error("Book not found");

    const book = booksStore[index];
    const clampedPage = Math.max(0, Math.min(currentPage, book.totalPages));
    const newShelf = clampedPage >= book.totalPages ? "completed" : clampedPage > 0 ? "reading" : book.shelf;

    const updatedBook: Book = {
      ...book,
      currentPage: clampedPage,
      shelf: newShelf as Exclude<ShelfType, "all">,
    };
    booksStore[index] = updatedBook;
    return updatedBook;
  },

  async toggleFavorite(bookId: string): Promise<Book> {
    const index = booksStore.findIndex((b) => b.id === bookId);
    if (index === -1) throw new Error("Book not found");

    const book = booksStore[index];
    const updatedBook: Book = {
      ...book,
      isFavorite: !book.isFavorite,
    };
    booksStore[index] = updatedBook;
    return updatedBook;
  },

  async toggleBookmark(bookId: string): Promise<Book> {
    const index = booksStore.findIndex((b) => b.id === bookId);
    if (index === -1) throw new Error("Book not found");

    const book = booksStore[index];
    const updatedBook: Book = {
      ...book,
      isBookmarked: !book.isBookmarked,
    };
    booksStore[index] = updatedBook;
    return updatedBook;
  },

  async updateRating(bookId: string, rating: number): Promise<Book> {
    const index = booksStore.findIndex((b) => b.id === bookId);
    if (index === -1) throw new Error("Book not found");

    const updatedBook: Book = {
      ...booksStore[index],
      rating: Math.max(0, Math.min(5, rating)),
    };
    booksStore[index] = updatedBook;
    return updatedBook;
  },

  async removeBook(bookId: string): Promise<boolean> {
    booksStore = booksStore.filter((b) => b.id !== bookId);
    return true;
  },

  async getStats(): Promise<LibraryStats> {
    const shelved = booksStore.length;
    const favorites = booksStore.filter((b) => b.isFavorite).length;
    const bookmarks = booksStore.filter((b) => b.isBookmarked).length;
    const wantToRead = booksStore.filter((b) => b.shelf === "want_to_read").length;
    const booksReading = booksStore.filter((b) => b.shelf === "reading").length;
    const booksCompleted = booksStore.filter((b) => b.shelf === "completed").length;
    const pagesRead = booksStore.reduce((sum, b) => sum + b.currentPage, 0);

    return {
      shelved,
      favorites,
      bookmarks,
      wantToRead,
      totalBooks: shelved,
      booksReading,
      booksWantToRead: wantToRead,
      booksCompleted,
      booksFavorites: favorites,
      pagesRead,
    };
  },
};
