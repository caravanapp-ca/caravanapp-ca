import type { ClubReadingSchedule } from '@caravanapp/types';

export function scheduleStrToDates(
  schedule: ClubReadingSchedule
): ClubReadingSchedule {
  const newSchedule = { ...schedule };
  if (typeof newSchedule.startDate === 'string') {
    newSchedule.startDate = new Date(newSchedule.startDate);
  }
  newSchedule.discussions = newSchedule.discussions.map(d => {
    if (typeof d.date === 'string') {
      return { ...d, date: new Date(d.date) };
    } else {
      return d;
    }
  });
  return newSchedule;
}
