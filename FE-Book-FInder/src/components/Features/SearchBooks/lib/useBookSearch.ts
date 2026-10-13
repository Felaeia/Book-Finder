import { useEffect, useMemo, useRef, useState } from 'react';
import { searchBooks } from '../api/openLibrary';
import { mapSearchDocToBook } from './mapBook';
import { Book } from './types';

const DEBOUNCE_MS = 300;
const SUGGESTION_LIMIT = 6;

export function useBookSearch() {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [suggestions, setSuggestions] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const requestId = useRef(0);

  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length === 0) {
      setSuggestions([]);
      setError(null);
      setLoading(false);
      return;
    }

    const currentRequest = ++requestId.current;
    setLoading(true);
    setError(null);

    const timeout = setTimeout(async () => {
      try {
        const docs = await searchBooks(trimmed, SUGGESTION_LIMIT);
        if (currentRequest === requestId.current) {
          setSuggestions(docs.map(mapSearchDocToBook));
        }
      } catch {
        if (currentRequest === requestId.current) {
          setError('Could not load suggestions.');
          setSuggestions([]);
        }
      } finally {
        if (currentRequest === requestId.current) {
          setLoading(false);
        }
      }
    }, DEBOUNCE_MS);

    return () => clearTimeout(timeout);
  }, [query]);

  function selectSuggestion(book: Book) {
    setQuery(book.title);
    setSuggestions([]);
    setIsFocused(false);
  }

  return useMemo(
    () => ({ query, setQuery, isFocused, setIsFocused, suggestions, loading, error, selectSuggestion }),
    [query, isFocused, suggestions, loading, error],
  );
}
