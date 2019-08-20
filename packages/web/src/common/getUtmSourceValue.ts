export default function getUtmSourceValue(urlValue: string) {
  // Keeping only alphanumeric chars in the utm_source value -- in case '/'
  // or '&' get grabbed accidentally
  const filteredUrlValue = urlValue.replace(/[^0-9a-z]/gi, '');
  switch (filteredUrlValue) {
    case 'fb':
    case 'tw':
    case 'gr':
    case 'em':
    case 'rd':
    case 'cpp':
    case 'cph':
    case 'cpc':
      return filteredUrlValue;
    default:
      throw new Error(`Unknown utm_source: ${filteredUrlValue}`);
  }
}
