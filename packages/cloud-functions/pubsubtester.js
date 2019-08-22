const jsonData = {
  clubId: '5d47be1bd20ca329b85f81c9',
  clubMembership: 'joined',
  userId: '277845895066812417'
};
const encodedData = Buffer.from(JSON.stringify(jsonData)).toString(
  'base64'
);
console.log(encodedData);
