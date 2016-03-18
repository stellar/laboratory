// This code originally taken from the XDR Viewer https://github.com/stellar/xdr-viewer
// by Stellar Development Foundation under Apache-2.0.

// This turns a base64 encoded xdr object with it's type, and turns it into an
// object with more detailed information suitable for use in the tree view.

// Values can be one of three types:
// - undefined
// - string: string values that appear as just plain text
// - object: typed values always with a type and value `{type: 'code', value: 'Foo();'}`

import {xdr, encodeCheck} from 'stellar-sdk';
export default function extrapolateFromXdr(input, type) {
  // TODO: Check to see if type exists
  // TODO: input validation

  let xdrObject;
  try {
    xdrObject = xdr[type].fromXDR(input, 'base64');
  } catch(error) {
    throw new Error('Input XDR could not be parsed');
  }

  let tree = [{}];
  buildTreeFromObject(xdrObject, tree[0], type);
  return tree;
}

function buildTreeFromObject(object, anchor, name) {
  anchor.type = name;

  if (_.isArray(object)) {
    parseArray(anchor, object);
  } else if (!hasChildren(object)) {
    anchor.value = getValue(object, name);
  } else if (object.switch) {
    parseArm(anchor, object)
  } else {
    parseNormal(anchor, object)
  }
}

function parseArray(anchor, object) {
  anchor.value = `Array[${object.length}]`;
  anchor.nodes = [];
  for (var i = 0; i < object.length; i++) {
    anchor.nodes.push({});
    buildTreeFromObject(object[i], anchor.nodes[anchor.nodes.length-1], '[' + i + ']');
  }
}

function parseArm(anchor, object) {
  anchor.value = '['+object.switch().name+']';
  if (_.isString(object.arm())) {
    anchor.nodes = [{}];
    buildTreeFromObject(object[object.arm()](), anchor.nodes[anchor.nodes.length-1], object.arm());
  }
}

function parseNormal(anchor, object) {
  anchor.nodes = [];
  _(object).functions().without('toXDR', 'ext').value().forEach(function(name) {
    anchor.nodes.push({});
    buildTreeFromObject(object[name](), anchor.nodes[anchor.nodes.length-1], name);
  });
}

function hasChildren(object) {
  // string
  if (_.isString(object)) {
    return false;
  }
  // node buffer
  if (object && object._isBuffer) {
    return false;
  }
  var functions = _(object).functions();
  if (functions.value().length == 0) {
    return false;
  }
  // int64
  if (functions.include('getLowBits') && functions.include('getHighBits')) {
    return false;
  }
  return true;
}

function getValue(object, name) {
  if (name === 'ed25519') {
    var address = encodeCheck("accountId", object);
    return {type: 'code', value: address};
  }

  if (name === 'assetCode' || name === 'assetCode4' || name === 'assetCode12') {
    return object.toString();
  }

  if (object && object._isBuffer) {
    return {type: 'code', value: new Buffer(object).toString('base64')};
  }

  // getValue is a leaf in the recursive xdr extrapolating function meaning that
  // whatever this function returns will be in the final result as-is.
  // Therefore, we want them in string format so that it displayable in React.
  // One example of why we need this is that UnsignedHyper values won't get
  // displayed unless we convert it to a string.
  if (typeof object.toString === 'function') {
    return object.toString();
  }

  throw new Error('Internal laboratory bug: Encountered value type in XDR viewer that does not have a toString method');
}
