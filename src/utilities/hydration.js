export const rehydrate = function(obj) {
  try {
    return JSON.parse(new Buffer(obj, 'base64').toString());
  } catch (e) {
    alert('Unable to parse values passed in url query parameters');
    console.error(e);
    return {}
  }
}

export const dehydrate = function(obj) {
  return new Buffer(JSON.stringify(obj)).toString('base64');
}
