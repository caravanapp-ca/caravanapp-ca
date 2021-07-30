import { Services } from '@caravanapp/types';
import axios from 'axios';
import { API_ORIGIN } from './api';

const questionPromptsRoute = `${API_ORIGIN}/api/profile/questions`;

export async function getAllProfileQuestions() {
  const res = await axios.get<Services.GetProfileQuestions>(
    questionPromptsRoute
  );
  return res;
}
