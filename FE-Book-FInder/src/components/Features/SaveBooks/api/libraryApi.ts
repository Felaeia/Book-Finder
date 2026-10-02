import { Book, LibraryStats, ShelfType } from "../lib/types";
import { INITIAL_BOOKS } from "../lib/mockData";

let booksStore: Book[] = [...INITIAL_BOOKS];

export const libraryApi = {
  async addBook(book: Omit<Book, "shelf" | "rating" | "currentPage" | "totalPages" | "dateAdded" | "isFavorite">): Promise<Book> {
    const existingBook = booksStore.find((savedBook) => savedBook.id === book.id);
    if (existingBook) return existingBook;

    const savedBook: Book = {
      ...book,
      shelf: "want_to_read",
      rating: 0,
      currentPage: 0,
      totalPages: 0,
      dateAdded: new Date().toISOString(),
      isFavorite: false,
    };
    booksStore = [savedBook, ...booksStore];
    return savedBook;
  },

  async getBooks(shelf?: ShelfType): Promise<Book[]> {
    if (!shelf || shelf === "all") {
      return [...booksStore];
    }
    if (shelf === "favorites") {
      return booksStore.filter((b) => b.isFavorite);
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
    const totalBooks = booksStore.length;
    const booksReading = booksStore.filter((b) => b.shelf === "reading").length;
    const booksWantToRead = booksStore.filter((b) => b.shelf === "want_to_read").length;
    const booksCompleted = booksStore.filter((b) => b.shelf === "completed").length;
    const booksFavorites = booksStore.filter((b) => b.isFavorite).length;
    const pagesRead = booksStore.reduce((sum, b) => sum + b.currentPage, 0);

    return {
      totalBooks,
      booksReading,
      booksWantToRead,
      booksCompleted,
      booksFavorites,
      pagesRead,
    };
  },
};
