const { origin, pathname } = window.location;

// Netlify redirects (from stellar.org) are slash-agnostic, but this app needs
// a trailing slash to function. Force a JS redirect to make sure there is one.
if (pathname[pathname.length - 1] !== '/') {
  window.location = `${origin}${pathname}/`
}
