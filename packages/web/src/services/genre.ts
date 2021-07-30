import { Services } from '@caravanapp/types';
import axios from 'axios';
import { API_ORIGIN } from './api';

const genresRoute = `${API_ORIGIN}/api/books/genres`;

export async function getAllGenres() {
  const res = await axios.get<Services.GetGenres>(genresRoute);
  return res;
}
