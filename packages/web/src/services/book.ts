import axios from 'axios';
import { GoogleBooks } from '@caravan/buddy-reading-types';

const discordRoute = '/api/discord';

export async function searchGoogleBooks(query: string) {
  const baseURL = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(
    `intitle:${query}`
  )}`;
  const res = await axios.get(baseURL);
  const responseData = res.data as GoogleBooks.Books;
  return responseData;
}

export async function notifyOfClubShelfUpdate(clubId: string) {
  const res = await axios.post(`${discordRoute}/updateClubShelf/${clubId}`, {});
  return res;
}
