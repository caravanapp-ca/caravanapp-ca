import { BookSource } from '@caravan/buddy-reading-types';

export const ALLOWED_BOOK_SOURCES: { [key in BookSource]: boolean } = {
  amazon: true,
  custom: true,
  goodreads: true,
  google: true,
  unknown: true,
  wattpad: true,
};
