import { generateSlugIds } from './url';

test('generating slug ids works', () => {
  const name = 'John Doe';
  const ids = generateSlugIds(name);
  expect(ids.length).toEqual(10);
  const regularSlug = ids[0];
  ids.forEach(id => {
    expect(id.startsWith(regularSlug)).toBeTruthy();
    expect(id.toLocaleLowerCase()).toEqual(id);
  });
});
