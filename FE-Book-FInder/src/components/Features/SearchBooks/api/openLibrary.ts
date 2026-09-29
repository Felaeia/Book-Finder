// Open Library API client
// Search API: https://openlibrary.org/dev/docs/api/search
// Subjects API (browse-by-subject; sibling of Lists/Search-inside in the OL API index):
//   https://openlibrary.org/dev/docs/api/subjects
// Lists API: https://openlibrary.org/dev/docs/api/lists
// Search inside API: https://openlibrary.org/dev/docs/api/search_inside

const SEARCH_BASE = 'https://openlibrary.org';
const COVERS_BASE = 'https://covers.openlibrary.org';

// Open Library asks frequent callers to identify themselves via User-Agent.
// Replace the contact email with your own before shipping.
const USER_AGENT = 'BookFinder/1.0 (contact: your-email@example.com)';

export type OpenLibraryDoc = {
  key: string;
  title: string;
  author_name?: string[];
  cover_i?: number;
  first_publish_year?: number;
  subject?: string[];
};

type SearchResponse = {
  numFound: number;
  docs: OpenLibraryDoc[];
};

export type SubjectWork = {
  key: string;
  title: string;
  cover_id?: number;
  authors?: { name: string; key: string }[];
  first_publish_year?: number;
};

type SubjectResponse = {
  name: string;
  work_count: number;
  works: SubjectWork[];
};

async function request<T>(url: string): Promise<T> {
  const res = await fetch(url, { headers: { 'User-Agent': USER_AGENT } });
  if (!res.ok) {
    throw new Error(`Open Library request failed: ${res.status} ${res.statusText}`);
  }
  return res.json() as Promise<T>;
}

/** Book Search API — powers the search bar / suggestion dropdown. */
export function searchBooks(query: string, limit = 20): Promise<OpenLibraryDoc[]> {
  const fields = 'key,title,author_name,cover_i,first_publish_year,subject';
  const url = `${SEARCH_BASE}/search.json?q=${encodeURIComponent(query)}&fields=${fields}&limit=${limit}`;
  return request<SearchResponse>(url).then((res) => res.docs ?? []);
}

/** Subjects API — powers "Selected for you" and the "By group" carousels. */
export function getBooksBySubject(subject: string, limit = 12): Promise<SubjectWork[]> {
  const slug = subject.toLowerCase().replace(/\s+/g, '_');
  const url = `${SEARCH_BASE}/subjects/${encodeURIComponent(slug)}.json?limit=${limit}`;
  return request<SubjectResponse>(url).then((res) => res.works ?? []);
}

/**
 * Search inside API — full-text search within scanned book pages.
 * Not wired into SearchScreen yet; useful later for an "inside this book" search.
 */
export function searchInsideBooks(query: string) {
  const url = `${SEARCH_BASE}/search/inside.json?q=${encodeURIComponent(query)}`;
  return request<{ hits: { total: number; hits: unknown[] } }>(url);
}

/**
 * Lists API — reads a logged-in patron's own reading list.
 * Requires the user's Open Library key/username (and, for private lists, an
 * authenticated session) — not wired into SearchScreen yet since this screen
 * has no auth. Useful later for a real "Saved" tab backed by the user's OL account.
 */
export function getUserList(userKey: string, listId: string) {
  const url = `${SEARCH_BASE}/people/${userKey}/lists/${listId}.json`;
  return request<unknown>(url);
}

export function getCoverUrl(
  coverId: number | null | undefined,
  size: 'S' | 'M' | 'L' = 'M',
): string | null {
  if (!coverId) return null;
  return `${COVERS_BASE}/b/id/${coverId}-${size}.jpg`;
}
