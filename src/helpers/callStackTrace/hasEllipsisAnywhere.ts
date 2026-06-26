/**
 * Returns `true` if an ellipsis node (`{ type: "ellipsis" }`) exists anywhere
 * in the given (possibly nested) array of formatted event data. Used by the
 * CallStackTrace component to decide whether to hide closing brackets when
 * collapsed params have been truncated.
 *
 * @param data - The (possibly nested) array to inspect.
 * @returns Whether an ellipsis node is present at any depth.
 */
export const hasEllipsisAnywhere = (data: any): boolean => {
  if (!data) return false;

  if (Array.isArray(data)) {
    return data.some((item) => {
      if (item?.type === "ellipsis") return true;

      if (Array.isArray(item?.value)) return hasEllipsisAnywhere(item.value);

      return false;
    });
  }

  return false;
};
