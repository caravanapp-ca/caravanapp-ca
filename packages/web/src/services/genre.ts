import axios from 'axios';

import { Services } from '@caravanapp/types';

const genresRoute = '/api/books/genres';

export async function getAllGenres() {
  const res = await axios.get<Services.GetGenres>(genresRoute);
  return res;
}
