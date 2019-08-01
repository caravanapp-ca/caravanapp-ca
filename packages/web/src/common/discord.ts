import qs from 'query-string';

const discordCdnUrl = 'https://cdn.discordapp.com';
const discordCdnAvatarUrl = `${discordCdnUrl}/avatars`;

const getDiscordPhotoSize = (containerSize: number) => {
  if (containerSize <= 64) {
    return 64;
  }
  if (containerSize <= 128) {
    return 128;
  }
  if (containerSize <= 160) {
    return 160;
  }
  if (containerSize <= 256) {
    return 256;
  }
  return 512;
};

export const shrinkDiscordPhotoSize = (url: string, size?: number) => {
  if (url.startsWith(discordCdnAvatarUrl)) {
    const photoSize = getDiscordPhotoSize(size || 64);
    const parsedUrl = qs.parseUrl(url);
    const photoSizeQs = qs.stringify({ size: photoSize });
    const newUrl = `${parsedUrl.url}?${photoSizeQs}`;
    return newUrl;
  }
  return url;
};
