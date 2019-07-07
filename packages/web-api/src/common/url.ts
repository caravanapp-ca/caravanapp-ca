import slugify from 'slugify';

export const generateSlugIds = (name: string) => {
  const slug = slugify(name, { lower: true });
  const slugIds: string[] = [slug];
  for (let i = 0; i < 9; i++) {
    const randomSuffix = Math.floor(Math.random() * 50).toString();
    slugIds.push(`${slug}-${randomSuffix}`);
  }
  return slugIds;
};
