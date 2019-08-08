import { generateSlugIds } from './url';

test('generating slug ids works', () => {
  expect.hasAssertions();
  const name = 'John Doe';
  const ids = generateSlugIds(name);
  expect(ids.length).toStrictEqual(10);
  const regularSlug = ids[0];
  ids.forEach(id => {
    expect(id.startsWith(regularSlug)).toBe(true);
    expect(id.toLocaleLowerCase()).toStrictEqual(id);
  });
});
