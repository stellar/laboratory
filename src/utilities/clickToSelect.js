// DOM helper. When an element has clickToSelect and a users clicks on the element,
// then the whole element will be selected/highlighted.

// usage: <Element onClick={clickToSelect} />
export default function clickToSelect(event) {
  var range = document.createRange();
  range.selectNodeContents(event.target);
  window.getSelection().removeAllRanges();
  window.getSelection().addRange(range);
};
