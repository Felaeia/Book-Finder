// data/books.ts
import { Book, GenreGroup } from '../types/books';

// The complete searchable book list
export const BOOKS: Book[] = [
  {
    id: '1',
    title: 'The Peculiars',
    authors: ['Maureen Doyle McQuerry'],
    cover: {
  uri: "https://placehold.co/300x450/3E2723/FFFFFF?text=The+Peculiars",},
    genres: ['Fantasy'],
    recommended: true,
  },
  {
    id: '2',
    title: 'Me Before You',
    authors: ['Jojo Moyes'],
        cover: {
  uri: "https://placehold.co/300x450/3E2723/FFFFFF?text=The+Peculiars",},
    genres: ['Romance'],
    recommended: true,
  },
  {
    id: '3',
    title: 'Last Days',
    authors: ['Adam Nevill'],
        cover: {
  uri: "https://placehold.co/300x450/3E2723/FFFFFF?text=The+Peculiars",},
    genres: ['Horror'],
    recommended: true,
  },
  {
    id: '4',
    title: 'Year of the Witching',
    authors: ['Alexis Henderson'],
        cover: {
  uri: "https://placehold.co/300x450/3E2723/FFFFFF?text=The+Peculiars",},
    genres: ['Horror'],
    recommended: false,
  },
  {
    id: '5',
    title: 'I Love You, Ara',
    authors: ['Janece L. Shuman'],
        cover: {
  uri: "https://placehold.co/300x450/3E2723/FFFFFF?text=The+Peculiars",},
    genres: ['Horror'],
    recommended: false,
  },
  {
    id: '6',
    title: 'These We Remember',
    authors: ['Del Sani'],
        cover: {
  uri: "https://placehold.co/300x450/3E2723/FFFFFF?text=The+Peculiars",},
    genres: ['Horror'],
    recommended: false,
  },
  {
    id: '7',
    title: 'Twilight',
    authors: ['Stephenie Meyer'],
        cover: {
  uri: "https://placehold.co/300x450/3E2723/FFFFFF?text=The+Peculiars",},
    genres: ['Romance'],
    recommended: false,
  },
  {
    id: '8',
    title: 'Just A Illusion',
    authors: ['J.C. Daniels'],
        cover: {
  uri: "https://placehold.co/300x450/3E2723/FFFFFF?text=The+Peculiars",},
    genres: ['Romance'],
    recommended: false,
  }
];

// Ordered IDs for the "Selected for you" carousel
export const RECOMMENDED_BOOK_IDS: string[] = ['1', '2', '3'];

// Genre labels and their ordered book IDs for the "By group" categories[cite: 2]
export const GENRE_GROUPS: GenreGroup[] = [
  {
    id: 'g1',
    label: 'Horror',
    bookIds: ['4', '5', '6'],
  },
  {
    id: 'g2',
    label: 'Romance',
    bookIds: ['7', '8'],
  },
];