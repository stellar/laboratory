// currently used to clear store data when page changes

export const CHANGE_PAGE = "CHANGE_PAGE";
export function changePage() {
  return {
    type: CHANGE_PAGE,
  }
}
