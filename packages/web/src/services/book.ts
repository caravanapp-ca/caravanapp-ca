import axios from 'axios';

import { GoogleBooks } from '@caravanapp/types';

export async function searchGoogleBooks(query: string) {
  const baseURL = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(
    `intitle:${query}`
  )}`;
  const res = await axios.get(baseURL);
  const responseData = res.data as GoogleBooks.Books;
  return responseData;
}
