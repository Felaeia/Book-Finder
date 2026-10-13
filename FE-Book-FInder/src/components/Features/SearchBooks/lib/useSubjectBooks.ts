import { useEffect, useState } from 'react';
import { getBooksBySubject } from '../api/openLibrary';
import { mapSubjectWorkToBook } from './mapBook';
import { Book } from './types';

export function useSubjectBooks(subject: string, limit = 12) {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    getBooksBySubject(subject, limit)
      .then((works) => {
        if (!cancelled) setBooks(works.map(mapSubjectWorkToBook));
      })
      .catch(() => {
        if (!cancelled) setError(`Could not load "${subject}" books.`);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [subject, limit]);

  return { books, loading, error };
}
