/**
 * TODO: Debug Jest with Lerna configuration on Cloud build.
 * Remove .skip to reinstate these tests.
 * @see: https://github.com/caravanapp-ca/caravanapp-ca/issues/266
 */

import { getClubUrl, getDefaultClubTopic } from './club';

const clubId = '5d252dde47f6210027071948';

// eslint-disable-next-line jest/no-disabled-tests
describe.skip('club services', () => {
  it('should create the correct club URL', () => {
    expect.hasAssertions();
    const url = getClubUrl(clubId);
    expect(url).toBe('https://caravanapp.ca/clubs/5d252dde47f6210027071948');
  });

  it('should generate good default club topics', () => {
    expect.hasAssertions();
    const url = getClubUrl(clubId);
    const bio = 'This is a standard bio.';
    const topic = getDefaultClubTopic(url, bio);
    const expected = `${url}\n\n${bio}`;
    expect(topic).toBe(expected);
  });

  it('should shrink a long bio appropriately for the club topic', () => {
    expect.hasAssertions();
    const url = getClubUrl(clubId);
    const bio = 'A'.repeat(1024);
    const topic = getDefaultClubTopic(url, bio);
    const expected = `${url}\n\n${'A'.repeat(1024 - url.length - 2)}`;
    expect(topic).toBe(expected);
  });
});
