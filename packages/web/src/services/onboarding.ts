import { Services } from '@caravanapp/types';
import axios from 'axios';
import { API_ORIGIN } from './api';

const readingPreferencesRoute = `${API_ORIGIN}/api/onboarding`;

interface SaveReadingPreferencesProps {
  genres: string[];
  readingSpeed: string;
}

export async function saveReadingPreferences(
  props: SaveReadingPreferencesProps
) {
  const body = {
    genres: props.genres,
    readingSpeed: props.readingSpeed,
  };

  const res = await axios.post<Services.ReadingPreferencesResult | null>(
    readingPreferencesRoute,
    body
  );
  return res;
}
