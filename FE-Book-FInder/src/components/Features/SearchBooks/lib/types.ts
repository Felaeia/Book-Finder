export type Book = {
  id: string;
  title: string;
  authors: string[];
  coverUrl: string | null;
  firstPublishYear?: number;
  subjects?: string[];
};
