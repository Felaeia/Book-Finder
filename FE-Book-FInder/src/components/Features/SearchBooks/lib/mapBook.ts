import { getCoverUrl, OpenLibraryDoc, SubjectWork } from '../api/openLibrary';
import { Book } from './types';

export function mapSearchDocToBook(doc: OpenLibraryDoc): Book {
  return {
    id: doc.key,
    title: doc.title,
    authors: doc.author_name ?? [],
    coverUrl: getCoverUrl(doc.cover_i),
    firstPublishYear: doc.first_publish_year,
    subjects: doc.subject,
  };
}

export function mapSubjectWorkToBook(work: SubjectWork): Book {
  return {
    id: work.key,
    title: work.title,
    authors: (work.authors ?? []).map((a) => a.name),
    coverUrl: getCoverUrl(work.cover_id),
    firstPublishYear: work.first_publish_year,
  };
}
