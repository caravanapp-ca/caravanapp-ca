import { generateSlugIds } from './url';

describe('url functions', () => {
  it('generating slug ids works', () => {
    expect.hasAssertions();
    const name = 'John Doe';
    const ids = generateSlugIds(name);
    expect(ids).toHaveLength(10);
    const regularSlug = ids[0];
    ids.forEach(id => {
      expect(id.startsWith(regularSlug)).toBe(true);
      expect(id.toLocaleLowerCase()).toStrictEqual(id);
    });
  });

})
