export const hydrate = function(obj) {
  return new Buffer(obj, 'base64').toString();
}

export const dehydrate = function(obj) {
  return new Buffer(JSON.stringify(obj)).toString('base64');
}
