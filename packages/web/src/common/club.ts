export const getClubIdFromPathname = (url: string) => {
  const urlSplit = url.split('/');
  if(urlSplit.length !== 2 || urlSplit[1].length !== 24){
    throw new Error(`URL: ${url}, is not a valid club URL`);
  }
  return urlSplit[1];
}