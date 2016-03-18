// scrollOnAnchorOpen is a function that can be used in the onClick of an element.
// When an event bubbles up to this handler with the target being an anchor link,
// this will scroll the user to the top of the page.

// This will also handle the edgecase to not scroll when the link is targeting
// a different tab.
// It will only scroll the user if the url is now the same as that of the link.

// Edgecase: This won't detect context menu link opens.

export default function scrollOnAnchorOpen(event) {
  if (isScrollEligible(event)) {
    window.scrollTo(0,0);
    event.target.blur();
  }
}

function isScrollEligible(event, initialWindowLocation) {
  if (event.target.tagName !== 'A') { return false; } // not A tag
  if (event.target.target !== '') { return false; } // non-empty target attr (such as _blank)
  if (typeof event.target.href !== 'string') { return false; } // target anchor has no href

  // If user used any keyboard modifiers, then they might be opening in a new
  // tab or window.. Won't be completely accurate but it should improve the
  // experience for the most common cases. It is better to scroll too much than
  // too little.

  // NOTE: Another method to achieve this is to check that the window.location.href
  // changes before and after. This works great except that links that go to the
  // current page also get detected as "not changed". This gets really confusing
  // since the click doesn't scroll the window.
  if (event.metaKey || event.shiftKey || event.ctrlKey) { return false; }

  return true;
}
