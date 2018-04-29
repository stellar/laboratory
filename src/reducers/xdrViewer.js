import {combineReducers} from 'redux';
import {UPDATE_XDR_INPUT, UPDATE_XDR_TYPE_FILTER, UPDATE_XDR_TYPE} from '../actions/xdrViewer';
import {LOAD_STATE} from '../actions/routing';
import {xdr} from 'stellar-sdk';
import url from 'url';

const routing = combineReducers({
  input,
  type,
  types,
  filter,
});

export default routing;

function input(state = '', action) {
  switch (action.type) {
  case LOAD_STATE:
    if (action.slug === 'xdr-viewer' && action.queryObj.input) {
      return action.queryObj.input;
    }
    break;
  case UPDATE_XDR_INPUT:
    return action.input;
  }

  return state;
}

function filter(state = '', action) {
  switch (action.type) {
  case UPDATE_XDR_TYPE_FILTER:
    return action.filter;
  }

  return state;
}

function type(state = 'TransactionEnvelope', action) {
  switch (action.type) {
  case LOAD_STATE:
    if (action.slug === 'xdr-viewer' && action.queryObj.type) {
      return action.queryObj.type;
    }
    break;
  case UPDATE_XDR_TYPE:
    return action.xdrType;
  case UPDATE_XDR_TYPE_FILTER:
    let matches = xdrTypeSearch(action.filter);
    if (matches.length > 1) {
      return matches[0];
    }
    break;
  }

  return state;
}

function types(state = [], action) {
  switch (action.type) {
  case LOAD_STATE:
    return xdrTypes("");
  case UPDATE_XDR_TYPE_FILTER:
    return xdrTypes(action.filter);
  }

  return state;
}

let allXdrTypes = _(xdr).functions().sort().value();
let commonXdrTypes = ['TransactionEnvelope', 'TransactionResult', 'TransactionMeta'];

// All the xdr types.
// Preceded by either the most common types or those that pass the filter.
function xdrTypes(filter) {
  let front = commonXdrTypes;
  if (filter) {
    let matches = xdrTypeSearch(filter);
    front = matches.slice(0, 10);
  }
  return front.concat(['---']).concat(allXdrTypes)
}

function xdrTypeSearch(filter) {
  if (!filter) {
    return [];
  }
  return fuzzySearch(filter, allXdrTypes);
}

// fuzzysearch by qrtz/@github
// https://github.com/qrtz/fuzzySearch/blob/master/lib/fuzzySearch.js
function fuzzySearch(value, array, caseSensitive) {
  var pattern = caseSensitive === true ? value : value.toLowerCase(),
    patternLength = pattern.length;
  return array.reduce(function(results, current) {
    if (patternLength > current.length) {
      return results
    }

    var lastIndex = -1,
      start = -1,
      str = caseSensitive === true ? current : current.toLowerCase();

    for (var i = 0; i < patternLength; i++) {
      lastIndex = str.indexOf(pattern.charAt(i), lastIndex + 1);

      if (0 > lastIndex) {
        break;
      }

      if (0 > start) {
        start = lastIndex
      }
    }

    if (-1 < lastIndex) {
      results.push({
        input: current,
        length: lastIndex + 1 - start,
        start: start
      })
    }
    return results
  }, []).sort(function(a, b) {
    var diff = a.length - b.length;
    if (0 === diff) {
      diff = a.start - b.start;
      if (0 === diff) {
        return a.input.localeCompare(b.input);
      }
    }
    return diff;
  }).map(function(item) {
    return item.input
  });
}
