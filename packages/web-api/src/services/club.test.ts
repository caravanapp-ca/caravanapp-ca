import { getClubUrl, getDefaultClubTopic } from './club';

const clubId = '5d252dde47f6210027071948';

it('should create the correct club URL', () => {
  const url = getClubUrl(clubId);
  expect(url).toBe('https://caravanapp.ca/clubs/5d252dde47f6210027071948');
});

it('should generate good default club topics', () => {
  const url = getClubUrl(clubId);
  const bio = 'This is a standard bio.';
  const topic = getDefaultClubTopic(url, bio);
  const expected = `${url}\n\n${bio}`;
  expect(topic).toBe(expected);
});

it('should shrink a long bio appropriately for the club topic', () => {
  const url = getClubUrl(clubId);
  const bio = 'A'.repeat(1024);
  const topic = getDefaultClubTopic(url, bio);
  const expected = `${url}\n\n${'A'.repeat(1024 - url.length - 2)}`;
  expect(topic).toBe(expected);
});
