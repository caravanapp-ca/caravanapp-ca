import axios from 'axios';
import { Services } from '@caravanapp/buddy-reading-types';

const readingPreferencesRoute = '/api/onboarding';

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
