import { useState, useMemo } from 'react';
import { Book } from '../types/books';

export function useBookSearch(books: Book[]) {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  const suggestions = useMemo(() => {
    if (!query.trim()) return [];
    
    const normalizedQuery = query.trim().toLocaleLowerCase();
    
    return books.filter((book) => {
      const titleMatches = book.title.toLocaleLowerCase().includes(normalizedQuery);
      const authorMatches = book.authors.some((author) =>
        author.toLocaleLowerCase().includes(normalizedQuery)
      );
      return titleMatches || authorMatches;
    }).slice(0, 5);
  }, [query, books]);

  const selectSuggestion = (book: Book) => {
    setQuery(book.title);
    setSelectedBook(book);
    setIsFocused(false);
  };

  const clearSearch = () => {
    setQuery('');
    setSelectedBook(null);
  };

  return {
    query,
    setQuery,
    isFocused,
    setIsFocused,
    suggestions,
    selectedBook,
    selectSuggestion,
    clearSearch,
  };
}