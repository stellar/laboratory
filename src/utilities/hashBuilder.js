// Simple takes in a slug and a object and converts it into a hash url.

// For example:
// slug: foo
// query: {happy: 'yes'}
//
// Returns: #foo?happy=yes

import url from 'url';

export default function hashBuilder(slug, query) {
  let urlObj = {
    pathname: slug,
    query: query,
  };
  return '#' + url.format(urlObj);
}
