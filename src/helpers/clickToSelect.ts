// DOM helper. When an element has clickToSelect and a users clicks on the element,
// then the whole element will be selected/highlighted.

// usage: <Element onClick={clickToSelect} />
export const clickToSelect = (event: React.MouseEvent<HTMLElement>) => {
  const range = document.createRange();
  const windowSelection = window.getSelection();

  range.selectNodeContents(event.target as Node);

  if (windowSelection) {
    windowSelection.removeAllRanges();
    windowSelection.addRange(range);
  }
};
