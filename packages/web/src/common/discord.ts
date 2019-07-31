import qs from 'query-string';

const discordCdnUrl = 'https://cdn.discordapp.com';
const discordCdnAvatarUrl = `${discordCdnUrl}/avatars`;

export const shrinkDiscordPhotoSize = (url?: string, size?: number) => {
  if (!url) {
    return url;
  }
  if (url.startsWith(discordCdnAvatarUrl)) {
    const photoSize = size || 64;
    const parsedUrl = qs.parseUrl(url);
    const photoSizeQs = qs.stringify({ size: photoSize });
    const newUrl = `${parsedUrl.url}?${photoSizeQs}`;
    return newUrl;
  }
  return url;
};
