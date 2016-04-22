let errorMessage = 'Unable to parse values passed in url query parameters';

export const rehydrate = function(obj) {
  try {
    return JSON.parse(new Buffer(obj, 'base64').toString());
  } catch (e) {
    if (typeof alert !== 'undefined') {
      alert(errorMessage);
    } else {
      console.error(errorMessage);
    }
    return {}
  }
}

export const dehydrate = function(obj) {
  return new Buffer(JSON.stringify(obj)).toString('base64');
}
