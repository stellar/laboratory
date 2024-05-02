const isValidItemIndex = (array: any[], itemIndex: number) => {
  // No items in the array
  if (array.length === 0) {
    return false;
  }

  // Invalid item index
  if (itemIndex < 0 || itemIndex > array.length - 1) {
    return false;
  }

  return true;
};

const addItem = <T>(array: any[], item: T) => {
  return [...array, item];
};

const deleteItem = (array: any[], itemIndex: number) => {
  if (!isValidItemIndex(array, itemIndex)) {
    return array;
  }

  const itemArray = [...array];
  itemArray.splice(itemIndex, 1);

  return itemArray;
};

const duplicateItem = (array: any[], itemIndexToDuplicate: number) => {
  if (!isValidItemIndex(array, itemIndexToDuplicate)) {
    return array;
  }

  return [...array, array[itemIndexToDuplicate]];
};

const moveItem = (
  array: any[],
  itemIndex: number,
  direction: "before" | "after",
) => {
  if (!isValidItemIndex(array, itemIndex)) {
    return array;
  }

  // Can't move before the first item
  if (itemIndex === 0 && direction === "before") {
    return array;
  }

  // Can't move after the last item
  if (itemIndex === array.length - 1 && direction === "after") {
    return array;
  }

  const itemArray = [...array];
  const el = itemArray.splice(itemIndex, 1)[0];
  const moveTo = direction === "after" ? itemIndex + 1 : itemIndex - 1;

  itemArray.splice(moveTo, 0, el);
  return itemArray;
};

const updateItem = (array: any[], itemIndex: number, newItem: any) => {
  if (!isValidItemIndex(array, itemIndex)) {
    return array;
  }

  const itemArray = [...array];
  itemArray[itemIndex] = newItem;

  return itemArray;
};

export const arrayItem = {
  add: addItem,
  delete: deleteItem,
  duplicate: duplicateItem,
  move: moveItem,
  update: updateItem,
};
