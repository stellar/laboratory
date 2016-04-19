export const rehydrate = function(obj) {
  try {
    return JSON.parse(new Buffer(obj, 'base64').toString());
  } catch (e) {
    console.error(e);
    if (typeof alert !== 'undefined') {
      alert('Unable to parse values passed in url query parameters');
    }
    return {}
  }
}

export const dehydrate = function(obj) {
  return new Buffer(JSON.stringify(obj)).toString('base64');
}
