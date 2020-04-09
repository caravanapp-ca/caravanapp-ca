export const getRandItemList = (
  items: string[],
  numItemsToInclude: number
): string => {
  const numItemsToUse = Math.min(Math.max(numItemsToInclude, 1), items.length);
  const itemsToUse: string[] = [];
  const itemsCopy = [...items];
  for (let i = 0; i < numItemsToUse; i++) {
    const randIndex = Math.floor(Math.random() * itemsCopy.length);
    itemsToUse.push(itemsCopy[randIndex]);
    itemsCopy.splice(randIndex, 1);
  }
  if (itemsToUse.length === 1) {
    return `: ${itemsToUse[0]}`;
  }
  let itemsStr = '';
  if (itemsToUse.length < items.length) {
    itemsStr += ', including: ';
  } else {
    itemsStr += ': ';
  }
  const sliceLastItem = itemsToUse.slice(0, itemsToUse.length - 1);
  itemsStr += sliceLastItem.join(', ');
  itemsStr += `, and ${itemsToUse[itemsToUse.length - 1]}`;
  return itemsStr;
};

export const parseIntWithZeroDefault = (
  val: unknown,
  defaultNumAsStr = '0'
) => {
  return Number.parseInt(
    val && typeof val === 'string' ? val : defaultNumAsStr
  );
};
