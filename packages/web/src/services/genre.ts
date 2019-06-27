import axios from 'axios';
import { Services } from '@caravan/buddy-reading-types';

const genresRoute = '/api/books/genres';
const questionPromptsRoute = '/api/profile/';

// 2 Services (genres and question prompts)
// 2 routes
// new route at books in web api services /api/books/genres
// type would map to the model
// genre.ts model in web api models

export async function getAllGenres() {
  const res = await axios.get<Services.GetGenres>(genresRoute);
  return res;
  // other screen well have to do res.data
}
