import axios from 'axios';
import { Services } from '@caravan/buddy-reading-types';

const questionPromptsRoute = '/api/profile/questions';

export async function getAllProfileQuestions() {
  const res = await axios.get<Services.GetProfileQuestions>(
    questionPromptsRoute
  );
  return res;
}
